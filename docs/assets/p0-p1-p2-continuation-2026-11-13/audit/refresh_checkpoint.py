#!/usr/bin/env python3
"""Export and compare one real immutable Git checkpoint, without copying game media."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--node', required=True)
    parser.add_argument('--snapshot', type=Path, required=True)
    parser.add_argument('--raw-export', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    # Subprocesses run from --repo; resolve caller-relative paths beforehand.
    for name in ('repo', 'snapshot', 'raw_export', 'out'):
        setattr(args, name, getattr(args, name).resolve())
    node_binary = shutil.which(args.node)
    assert node_binary, 'Node executable not found.'
    args.node = str(Path(node_binary).resolve())
    assert re.fullmatch('[a-f0-9]{40}', args.revision)
    assert not any(path.exists() for path in (args.snapshot, args.raw_export, args.out)), 'All output directories must be new.'
    version = subprocess.check_output([args.node, '--version'], text=True).strip()
    assert int(version.lstrip('v').split('.')[0]) >= 22, 'Node22 or later is required.'
    root, here = args.repo.resolve(), Path(__file__).resolve().parent
    helpers = [Path(__file__).resolve(), *(here / name for name in ['prepare_source_snapshot.py', 'actor_task_delta.py', 'inspect_actor_lot.mjs', 'review_actor_lot.py'])]
    tool_hashes = {str(file): sha(file) for file in helpers}
    baseline = here / 'before-actor-tasks.json'
    validation = json.loads((here / 'before-source-validation.json').read_text())
    assert sha(baseline) == validation['compactLedgerSha256'], 'Baseline ledger changed.'
    args.out.mkdir(parents=True)
    commands = []

    def run(name, command):
        log = args.out / (name + '.log')
        with log.open('wb') as stream:
            result = subprocess.run([str(item) for item in command], cwd=root, stdout=stream, stderr=subprocess.STDOUT,
                                    env={**os.environ, 'GIT_NO_LAZY_FETCH': '1', 'GIT_OPTIONAL_LOCKS': '0'})
        commands.append({'name': name, 'command': [str(item) for item in command], 'exitCode': result.returncode,
                         'log': log.name, 'logSha256': sha(log)})
        (args.out / 'commands.json').write_text(json.dumps(commands, indent=2) + '\n')
        if result.returncode:
            raise RuntimeError(f'{name} failed with exit {result.returncode}; see {log}')

    source_manifest = args.out / 'source-inputs.json'
    run('snapshot', [sys.executable, here / 'prepare_source_snapshot.py', '--repo', root, '--revision', args.revision,
                     '--out', args.snapshot, '--manifest', source_manifest])
    node = [args.node, '--max-old-space-size=1024', '--no-warnings', '--loader', args.snapshot / 'scripts/sourceSceneTestLoader.mjs']
    run('export', [*node, args.snapshot / 'scripts/exportActorFidelityBacklog.mjs', args.raw_export, args.revision,
                   args.snapshot / 'complete-tree.json', args.revision])
    rows = json.loads((args.raw_export / 'actors.json').read_text())
    before = json.loads(baseline.read_text())
    fields, task_fields = list(before[0]), list(before[0]['tasks'][0])
    compact = [{**{field: row.get(field) for field in fields if field != 'tasks'},
                'tasks': [{field: task.get(field) for field in task_fields} for task in row['tasks']]} for row in rows]
    after = args.out / 'actor-tasks.json'
    after.write_text(json.dumps(compact, indent=2, ensure_ascii=False) + '\n')
    summary = json.loads((args.raw_export / 'summary.json').read_text())
    (args.out / 'summary.json').write_text(json.dumps(summary, indent=2, ensure_ascii=False) + '\n')
    run('global-delta', [sys.executable, here / 'actor_task_delta.py', '--before', baseline, '--after', after,
                          '--out', args.out / 'actor-task-delta.json'])
    selections = {'arena': 'arena-lot-040/reservation-040.json', 'ff': 'ff-lot-040/plan.json', 'scifi': 'scifi-lot-040/reservation-040.json'}
    cohorts = []
    for tag, filename in selections.items():
        plan = here.parent / filename
        keys = [row['actorKey'] for row in json.loads(plan.read_text())['actors']]
        assert len(keys) == len(set(keys)) == 40
        key_file = args.out / (tag + '-keys.json')
        key_file.write_text(json.dumps(keys, indent=2) + '\n')
        probe = args.out / (tag + '-runtime.json')
        run(tag + '-probe', [*node, here / 'inspect_actor_lot.mjs', args.snapshot, key_file, probe])
        run(tag + '-review', [sys.executable, here / 'review_actor_lot.py', '--baseline', baseline,
                              '--before', here / (tag + '-runtime-before-lossless.json'), '--after', probe,
                              '--overlay', source_manifest, '--out', args.out / (tag + '-review.json')])
        cohorts.append({'name': tag, 'actors': 40, 'selectionPlan': str(plan), 'selectionPlanSha256': sha(plan),
                        'selectionOrigin': 'EXPLICIT_HASHED_COHORT_PLAN; not implied to be a file in the source checkpoint'})
    manifest = json.loads(source_manifest.read_text())
    changed = [entry['path'] for entry in manifest['files'] if sha(args.snapshot / entry['path']) != entry['sha256']]
    assert not changed, 'Immutable source snapshot changed.'
    assert all(sha(Path(file)) == digest for file, digest in tool_hashes.items()), 'Audit helper changed during execution.'
    report = {'schemaVersion': 1, 'scope': 'Real Git source checkpoint and complete Git asset tree; no local sparse absence inference or media copy.',
              'sourceCommit': args.revision, 'nodeVersion': version, 'auditHelpersSha256': tool_hashes,
              'baselineLedgerSha256': sha(baseline), 'afterLedgerSha256': sha(after), 'rawExportSha256': sha(args.raw_export / 'actors.json'),
              'sourceFilesRechecked': len(manifest['files']), 'changedSourceFiles': changed, 'runtimeCohorts': cohorts,
              'commands': commands, 'mediaCopied': 0, 'actorClosuresApproved': 0, 'artApprovals': 0, 'source1to1Verified': False}
    (args.out / 'validation.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'sourceCommit': args.revision, 'actors': len(rows), 'sourceFilesRechecked': len(manifest['files']), 'mediaCopied': 0}))


if __name__ == '__main__':
    main()
