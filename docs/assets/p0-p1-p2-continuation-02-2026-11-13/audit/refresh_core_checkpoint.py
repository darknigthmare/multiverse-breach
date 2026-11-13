#!/usr/bin/env python3
"""One final immutable-source export and exact delta for continuation02."""
import argparse
from collections import Counter
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile


def digest(content):
    return hashlib.sha256(content).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--node', required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    root, output = args.repo.resolve(), args.out.resolve()
    binary = shutil.which(args.node)
    assert binary and re.fullmatch('[a-f0-9]{40}', args.revision)
    node = str(Path(binary).resolve())
    assert int(subprocess.check_output([node, '--version'], text=True).strip().lstrip('v').split('.')[0]) >= 22
    assert not output.exists(), 'Output must be new; no existing files are deleted.'
    here = Path(__file__).resolve().parent
    runner_sha = digest(Path(__file__).read_bytes())
    adoption_sha = digest((here / 'baseline-adoption.json').read_bytes())
    before_probes_sha = digest((here / 'runtime-baselines.json').read_bytes())
    adoption = json.loads((here / 'baseline-adoption.json').read_text())
    before_probes = json.loads((here / 'runtime-baselines.json').read_text())
    base = adoption['baselineSourceCommit']
    environment = {**os.environ, 'GIT_NO_LAZY_FETCH': '1', 'GIT_OPTIONAL_LOCKS': '0'}
    subprocess.run(['git', '-C', str(root), 'merge-base', '--is-ancestor', base, args.revision], check=True, env=environment)
    helpers = root / 'docs/assets/p0-p1-p2-continuation-2026-11-13/audit'
    names = ['prepare_source_snapshot.py', 'actor_task_delta.py', 'inspect_actor_lot.mjs', 'review_actor_lot.py']
    pins = {}
    for name in names:
        file = helpers / name
        pinned = subprocess.check_output(['git', '-C', str(root), 'cat-file', 'blob', base + ':' + str(file.relative_to(root))], env=environment)
        assert file.read_bytes() == pinned, 'Previously audited helper changed: ' + name
        pins[str(file)] = digest(pinned)
    reservations = root / here.parent.relative_to(root) / 'reservations.json'
    selection = json.loads(reservations.read_text())
    assert digest(reservations.read_bytes()) == adoption['reservationsSha256']
    baseline_gzip = root / adoption['ledgerGzip']
    assert digest(baseline_gzip.read_bytes()) == adoption['ledgerGzipSha256']
    baseline_bytes = gzip.decompress(baseline_gzip.read_bytes())
    assert digest(baseline_bytes) == adoption['ledgerOriginalSha256']
    baseline = json.loads(baseline_bytes)
    inherited_queue = root / 'docs/assets/p0-p1-menu-continuation-2026-11-13/backlog/actor-batches-40.json'
    queue_bytes = inherited_queue.read_bytes()
    run_root = Path(tempfile.mkdtemp(prefix='actor-audit-turn02-', dir='/tmp'))
    output.mkdir(parents=True)
    commands, compressed = [], []

    def run(name, command):
        log = output / (name + '.log')
        with log.open('wb') as stream:
            result = subprocess.run([str(item) for item in command], cwd=root, env=environment, stdout=stream, stderr=subprocess.STDOUT)
        commands.append({'name': name, 'command': [str(item) for item in command], 'exitCode': result.returncode, 'log': log.name, 'logSha256': digest(log.read_bytes())})
        (output / 'commands.json').write_text(json.dumps(commands, indent=2) + '\n')
        assert result.returncode == 0, f'{name} failed; see {log}'

    def retain(file, filename):
        payload = file.read_bytes()
        encoded = gzip.compress(payload, compresslevel=9, mtime=0)
        target = output / filename
        target.write_bytes(encoded)
        assert gzip.decompress(target.read_bytes()) == payload
        record = {'compressedPath': filename, 'compressedBytes': len(encoded), 'compressedSha256': digest(encoded),
                  'originalPathUsed': str(file), 'originalBytes': len(payload), 'originalSha256': digest(payload)}
        compressed.append(record)
        return record

    snapshot, raw_export = run_root / 'source', run_root / 'export'
    source_manifest = output / 'source-inputs.json'
    run('snapshot', [sys.executable, helpers / names[0], '--repo', root, '--revision', args.revision, '--out', snapshot, '--manifest', source_manifest])
    # Priority/classifier semantics are intentionally unchanged in this work.
    for relative in ['scripts/exportActorFidelityBacklog.mjs', 'src/game/actorFidelityBacklog.js']:
        original = subprocess.check_output(['git', '-C', str(root), 'cat-file', 'blob', base + ':' + relative], env=environment)
        assert (snapshot / relative).read_bytes() == original, 'Exporter/classifier changed; independent review required.'
    native = [node, '--max-old-space-size=1024', '--no-warnings', '--loader', snapshot / 'scripts/sourceSceneTestLoader.mjs']
    run('export', [*native, snapshot / 'scripts/exportActorFidelityBacklog.mjs', raw_export, args.revision, snapshot / 'complete-tree.json', args.revision])
    after_raw = json.loads((raw_export / 'actors.json').read_text())
    fields, task_fields = list(baseline[0]), list(baseline[0]['tasks'][0])
    after = [{**{field: row.get(field) for field in fields if field != 'tasks'},
              'tasks': [{field: task.get(field) for field in task_fields} for task in row['tasks']]} for row in after_raw]
    before_file, after_file = run_root / 'before-ledger.json', run_root / 'after-ledger.json'
    before_file.write_bytes(baseline_bytes)
    after_file.write_text(json.dumps(after, indent=2, ensure_ascii=False) + '\n')
    retain(after_file, 'actor-tasks.json.gz')
    summary = json.loads((raw_export / 'summary.json').read_text())
    (output / 'summary.json').write_text(json.dumps(summary, indent=2, ensure_ascii=False) + '\n')
    delta_file = output / 'actor-task-delta.json'
    run('global-delta', [sys.executable, helpers / names[1], '--before', before_file, '--after', after_file, '--out', delta_file])
    delta = json.loads(delta_file.read_text())
    cohorts, all_keys, extra_hero_fields = [], set(), {}
    for activity in selection['activities']:
        name = activity['activityId']
        reservation = root / activity['reservation']
        document = json.loads(reservation.read_text())
        keys = [row['actorKey'] for row in document['actors']]
        assert len(keys) == len(set(keys)) == 40 and not all_keys.intersection(keys)
        all_keys.update(keys)
        adoption_cohort = next(row for row in adoption['cohorts'] if row['activityId'] == name)
        assert digest(reservation.read_bytes()) == adoption_cohort['reservationSha256']
        key_file = run_root / (name + '-keys.json')
        key_file.write_text(json.dumps(keys) + '\n')
        old_probe = next(row for row in before_probes['cohorts'] if row['activityId'] == name)
        archive = here / old_probe['compressedPath']
        assert digest(archive.read_bytes()) == old_probe['compressedSha256']
        previous = gzip.decompress(archive.read_bytes())
        assert digest(previous) == old_probe['originalSha256']
        old_file, new_file = run_root / (name + '-before.json'), run_root / (name + '-after.json')
        old_file.write_bytes(previous)
        run(name + '-probe', [*native, helpers / names[2], snapshot, key_file, new_file])
        retain(new_file, name + '-runtime.json.gz')
        review = output / (name + '-review.json')
        run(name + '-review', [sys.executable, helpers / names[3], '--baseline', before_file, '--before', old_file, '--after', new_file, '--overlay', source_manifest, '--out', review])
        result = json.loads(review.read_text())
        old_rows = {row['actorKey']: row for row in json.loads(previous)['rows']}
        new_rows = json.loads(new_file.read_text())['rows']
        summon_changes = []
        for row in new_rows:
            old_row = old_rows[row['actorKey']]
            if old_row['summon'] != row['summon']:
                previous_summon, current_summon = old_row['summon'] or {}, row['summon'] or {}
                contract_keys = ['id', 'name', 'kind', 'entityName', 'performerRole', 'action', 'sourceHeroId', 'sourceAbility', 'entityRender', 'visualStyle']
                changed_keys = sorted(key for key in previous_summon.keys() | current_summon.keys() if previous_summon.get(key) != current_summon.get(key))
                performer = lambda value: {field: (value.get('performer') or {}).get(field) for field in ['id', 'universe', 'stats']}
                summon_changes.append({'actorKey': row['actorKey'], 'changedTopLevelFields': changed_keys,
                                       'beforeContract': {key: previous_summon.get(key) for key in contract_keys},
                                       'afterContract': {key: current_summon.get(key) for key in contract_keys},
                                       'beforePerformerIdentityAndStats': performer(previous_summon), 'afterPerformerIdentityAndStats': performer(current_summon),
                                       'scope': 'Compact resolver delta; full performer/provenance objects remain in gzip snapshots. Actual engine execution and source/canonical scope require independent review.'})
            if row['kind'] == 'hero':
                changed = [field for field in ['equipment', 'canonStatus'] if old_row['metadata'].get(field) != row['metadata'].get(field)]
                if changed:
                    extra_hero_fields[row['actorKey']] = ['runtimeMetadata.' + field for field in changed]
        if summon_changes:
            (output / (name + '-summon-delta.json')).write_text(json.dumps({'changes': summon_changes, 'newCanonicalInvocationsApproved': 0}, indent=2, ensure_ascii=False) + '\n')
        cohorts.append({'activityId': name, 'actors': 40, 'reservationSha256': digest(reservation.read_bytes()), 'review': review.name,
                        'removedSourceFindingsByCode': result['removedSourceFindingsByCode'], 'addedSourceFindingsByCode': result['addedSourceFindingsByCode'],
                        'summonResolverChangesRequiringReview': len(summon_changes),
                        'signatureLossesRequiringReview': [row for row in result['selectedLegacySignatureChanges'] if row['lost']]})
    previous = {row['actorKey']: row for row in baseline}
    changed_heroes = []
    for row in after:
        old = previous.get(row['actorKey'])
        if old and row['kind'] == 'hero':
            changes = [field for field in ['incarnation', 'declaredReference', 'visualAnchor'] if old[field] != row[field]] + extra_hero_fields.get(row['actorKey'], [])
            if changes:
                changed_heroes.append({'actorKey': row['actorKey'], 'heroId': row['actorId'], 'changedSourceFields': changes, 'cgPinReviewRequired': True})
    (output / 'cg-source-pin-review.json').write_text(json.dumps({'scope': 'Hero source metadata changed; coordinate exact CG snapshot pins separately. No CG file is changed by this audit.', 'heroes': changed_heroes}, indent=2, ensure_ascii=False) + '\n')
    manifest = json.loads(source_manifest.read_text())
    assert all(digest((snapshot / row['path']).read_bytes()) == row['sha256'] for row in manifest['files'])
    assert all(digest(Path(file).read_bytes()) == value for file, value in pins.items())
    assert inherited_queue.read_bytes() == queue_bytes, 'Historical queue changed during audit.'
    assert digest(Path(__file__).read_bytes()) == runner_sha, 'Audit runner changed during execution.'
    assert digest((here / 'baseline-adoption.json').read_bytes()) == adoption_sha
    assert digest((here / 'runtime-baselines.json').read_bytes()) == before_probes_sha
    report = {'schemaVersion': 1, 'baselineSourceCommit': base, 'sourceCommit': args.revision, 'baselineLedgerSourceCommit': adoption['reusedLedgerSourceCommit'],
              'baselineLedgerGzip': adoption['ledgerGzip'], 'baselineLedgerSha256': digest(baseline_bytes),
              'baselineAdoptionSha256': adoption_sha, 'runtimeBaselineManifestSha256': before_probes_sha,
              'sourceFilesRechecked': len(manifest['files']), 'changedSnapshotSources': [], 'pinnedAuditHelpers': pins,
              'cohorts': cohorts, 'reservedActors': len(all_keys), 'cgHeroSourcePinsRequiringReview': len(changed_heroes),
              'actorsAddedRequiringReview': delta['actorsAdded'], 'actorsRemovedRequiringReview': delta['actorsRemoved'],
              'outsideReservationChangedActors': [row['actorKey'] for row in delta['changedActors'] if row['actorKey'] not in all_keys],
              'removedSourceFindingsByPriority': dict(Counter(row['priority'] for row in delta['removedSourceFindings'])),
              'addedOpenFindingsByPriority': dict(Counter(row['priority'] for row in delta['addedSourceFindings'])),
              'historicalQueueBytesUnchanged': True, 'historicalQueueSha256': digest(queue_bytes), 'commands': commands,
              'compressedRetention': compressed, 'rawTemporaryRun': str(run_root), 'scriptSha256': runner_sha,
              'fullActorClosures': 0, 'artApprovals': 0, 'visual1to1Verified': False, 'mediaCopiedOrHydrated': 0}
    (output / 'validation.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({key: report[key] for key in ['sourceCommit', 'sourceFilesRechecked', 'reservedActors', 'removedSourceFindingsByPriority', 'addedOpenFindingsByPriority', 'cgHeroSourcePinsRequiringReview', 'outsideReservationChangedActors']}))


if __name__ == '__main__':
    main()
