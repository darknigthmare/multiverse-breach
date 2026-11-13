#!/usr/bin/env python3
"""Carry the unique actor export forward only across the reviewed FPS exception."""
import argparse
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from collections import Counter

BASE = '82a1f0035af46b85aac479a8a530963a28cfb219'
BASELINE = '98991b161d0116dd9fa8d52d42f2337a243f2091'
CG_BASE = '5baaae27bf23b845a5056eeab3c95fbe7b0d234e'
EXCEPTION = 'src/game/extinctionFighterProfiles.js'
EXPECTED_EXCEPTION_SHA = '4ffe9ec65bd4ceb0997fe954d58542c5a19b50532c16cdb9e09f593570dae6fc'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    root = args.repo.resolve()
    audit = Path(__file__).resolve().parent
    checkpoint = audit / 'checkpoint-82a1f003'
    assert re.fullmatch('[0-9a-f]{40}', args.revision)
    assert not args.out.exists(), 'Use a new receipt path.'
    env = {**os.environ, 'GIT_NO_LAZY_FETCH': '1', 'GIT_OPTIONAL_LOCKS': '0'}

    def git(*parts):
        return subprocess.check_output(['git', '-C', str(root), *parts], env=env)

    def tree(revision):
        records = {}
        for item in git('ls-tree', '-rz', '--full-tree', revision).split(b'\0'):
            if not item:
                continue
            header, name = item.split(b'\t', 1)
            mode, kind, oid = header.decode().split()
            records[name.decode()] = {'mode': mode, 'type': kind, 'gitBlobOid': oid}
        return records

    assert git('rev-parse', args.revision + '^{commit}').decode().strip() == args.revision
    subprocess.run(['git', '-C', str(root), 'merge-base', '--is-ancestor', BASE, args.revision], env=env, check=True)
    source = json.loads((checkpoint / 'source-inputs.json').read_text())
    validation = json.loads((checkpoint / 'validation.json').read_text())
    assert source['sourceCommit'] == validation['sourceCommit'] == BASE
    assert source['fileCount'] == len(source['files']) == 3873
    original, later, cg_tree = tree(BASE), tree(args.revision), tree(CG_BASE)
    indexed = {entry['path']: entry for entry in source['files']}
    assert len(indexed) == 3873
    changes, working_mismatches, original_mismatches = [], [], []
    exception = None
    for filename, entry in indexed.items():
        before, after = original.get(filename), later.get(filename)
        if not before or before['type'] != 'blob' or before['gitBlobOid'] != entry['gitBlobOid']:
            original_mismatches.append(filename)
        changed = after != before
        if changed:
            changes.append(filename)
        path = root / filename
        if not path.is_file() or path.is_symlink():
            working_mismatches.append(filename)
            continue
        data = path.read_bytes()
        expected_sha, expected_length = entry['sha256'], entry['bytes']
        if filename == EXCEPTION:
            assert changed and after and after['type'] == 'blob'
            committed = git('cat-file', 'blob', after['gitBlobOid'])
            assert sha(committed) == EXPECTED_EXCEPTION_SHA
            expected_sha, expected_length = sha(committed), len(committed)
            exception = {'path': filename, 'beforeGitBlobOid': entry['gitBlobOid'],
                         'afterGitBlobOid': after['gitBlobOid'], 'beforeSha256': entry['sha256'],
                         'afterSha256': expected_sha, 'afterBytes': expected_length,
                         'workingBytesMatchLaterCommit': sha(data) == expected_sha and len(data) == expected_length,
                         'reason': 'Reviewed Extinction FPS source-consumer bindings; this module is not imported by actor export or native cohort probes.'}
        if sha(data) != expected_sha or len(data) != expected_length:
            working_mismatches.append(filename)
    assert not original_mismatches and not working_mismatches
    assert changes == [EXCEPTION] and exception

    closure_path = checkpoint / 'actor-import-closure.json'
    closure = json.loads(closure_path.read_text())
    archive_path = checkpoint / closure['graphArchive']
    encoded = archive_path.read_bytes()
    decoded = gzip.decompress(encoded)
    assert sha(encoded) == closure['graphGzipSha256']
    assert sha(decoded) == closure['graphOriginalSha256']
    assert sha((audit / 'actor_import_closure.mjs').read_bytes()) == closure['scriptSha256']
    graph = json.loads(decoded)
    assert closure['closureComplete'] and not closure['unresolvedReferences']
    assert graph['entries'] == closure['entries']
    assert len(graph['modules']) == len(set(graph['modules'])) == closure['modules'] == 1974
    assert len(graph['edges']) == closure['importEdges'] == 2151
    assert set(graph['modules']) <= set(indexed)
    assert EXCEPTION not in graph['modules']
    closure_changes = [filename for filename in graph['modules'] if original[filename] != later.get(filename)]
    assert not closure_changes

    changed_paths = [item.decode() for item in git('diff', '--name-only', '-z', BASE, args.revision).split(b'\0') if item]
    runtime_changes = [name for name in changed_paths if name.startswith(('src/', 'DLC/', 'public/'))]
    assert runtime_changes == [EXCEPTION]
    dirty_runtime = [item.decode() for item in git('diff', '--name-only', '-z', args.revision, '--', 'src', 'DLC', 'public').split(b'\0') if item]
    untracked_runtime = [item.decode() for item in git('ls-files', '--others', '--exclude-standard', '-z', '--', 'src', 'DLC', 'public').split(b'\0') if item]
    assert not dirty_runtime and not untracked_runtime
    helper_changes = [name for name, expected in validation['pinnedAuditHelpers'].items()
                      if not Path(name).is_file() or sha(Path(name).read_bytes()) != expected]
    assert not helper_changes
    assert sha((audit / 'refresh_core_checkpoint.py').read_bytes()) == validation['scriptSha256']

    cg_fixture_path = root / 'scripts/fixtures/cg-continuation02-metadata-amendment-2026-11-13.json'
    cg = json.loads(cg_fixture_path.read_text())
    assert cg['sourceCommit'] == CG_BASE and len(cg['sourceFiles']) == 17
    cg_pins = []
    for entry in cg['sourceFiles']:
        filename = entry['path']
        assert cg_tree[filename] == original[filename] == later[filename]
        data = (root / filename).read_bytes()
        assert sha(data) == entry['sha256'] and len(data) == entry['bytes']
        cg_pins.append({**entry, 'gitBlobOid': later[filename]['gitBlobOid']})
    hero_review = json.loads((checkpoint / 'cg-source-pin-review.json').read_text())
    assert len(hero_review['heroes']) == 31

    queue_name = 'docs/assets/p0-p1-menu-continuation-2026-11-13/backlog/actor-batches-40.json'
    queue_bytes = (root / queue_name).read_bytes()
    assert queue_bytes == git('cat-file', 'blob', f'{BASELINE}:{queue_name}')
    assert queue_bytes == git('cat-file', 'blob', f'{args.revision}:{queue_name}')
    assert sha(queue_bytes) == validation['historicalQueueSha256']
    queue = json.loads(queue_bytes)
    actors = [actor for batch in queue['batches'] for actor in batch['actors']]
    p0 = [actor['actorKey'] for actor in actors if actor['priority'] == 'P0']
    refusals = [actor['actorKey'] for actor in actors if actor.get('automaticGenerationRetryAllowed') is False]
    assert len(p0) == 22 and len(refusals) == 6 and queue['batchCount'] == 124

    retained = {entry['compressedPath']: entry for entry in validation['compressedRetention']}
    ledger_bytes = (checkpoint / 'actor-tasks.json.gz').read_bytes()
    ledger_raw = gzip.decompress(ledger_bytes)
    assert sha(ledger_bytes) == retained['actor-tasks.json.gz']['compressedSha256']
    assert sha(ledger_raw) == retained['actor-tasks.json.gz']['originalSha256']
    ledger = json.loads(ledger_raw)
    counts = Counter(task['priority'] for row in ledger for task in row['tasks'])
    assert len(ledger) == 4937 and counts == {'P1': 16734, 'P2': 13582}
    missing_rasters = sum(bool(row['missingRasterPaths']) for row in ledger)
    assert missing_rasters == 1471
    batman = [row for row in ledger if row['actorKey'] == '["The Dark Knight","id:batman_tdk"]']
    assert len(batman) == 1 and any(task['code'] == 'RASTER_SCOPE_UNRESOLVED' for task in batman[0]['tasks'])
    cohort_reuse = []
    for activity, slots in [('gears-deadspace-040', 60), ('portal-l4d-040', 56)]:
        review_path = checkpoint / f'{activity}-review.json'
        review = json.loads(review_path.read_text())
        name = f'{activity}-runtime.json.gz'
        packed = (checkpoint / name).read_bytes()
        assert sha(packed) == retained[name]['compressedSha256']
        assert sha(gzip.decompress(packed)) == retained[name]['originalSha256']
        assert review['actorKeysPreserved'] and review['unchangedPreparedRpgHeroSlots'] == slots
        assert not any(change.get('lost') for change in review['selectedLegacySignatureChanges'])
        cohort_reuse.append({'activityId': activity, 'reviewSha256': sha(review_path.read_bytes()),
                             'runtimeGzipSha256': sha(packed), 'preservedPreparedHeroRpgSlotsVersus9899': slots,
                             'reusedReason': 'All transitive actor/probe module inputs remain identical to the actual82a execution. This does not claim FPS profiles are unchanged.'})

    report = {'schemaVersion': 1,
              'scope': 'Carry the single actual82a actor export and native cohort probes forward across exactly one reviewed FPS consumer change outside their closed import graph; no re-export, media hydration or new classification.',
              'baselineSourceCommit': BASELINE, 'actualExportSourceCommit': BASE, 'laterCoreCommit': args.revision,
              'gitHeadAtVerification': git('rev-parse', 'HEAD').decode().strip(),
              'sourceManifestSha256': sha((checkpoint / 'source-inputs.json').read_bytes()),
              'validationSha256': sha((checkpoint / 'validation.json').read_bytes()),
              'sourceInventoryFilesChecked': len(indexed), 'unchangedSourceInventoryFiles': len(indexed) - 1,
              'explicitSourceException': exception, 'unexpectedSourceChanges': [], 'workingSourceMismatches': [],
              'laterSrcDlcPublicChangedPaths': runtime_changes, 'workingRuntimeChanges': dirty_runtime,
              'untrackedRuntimeFiles': untracked_runtime,
              'allLaterCommitChangedPaths': changed_paths,
              'actorImportClosure': {'report': closure_path.name, 'reportSha256': sha(closure_path.read_bytes()),
                                     'modules': len(graph['modules']), 'importEdges': len(graph['edges']),
                                     'unresolvedReferences': [], 'allModulesUnchangedInGitAndWorkingTree': True,
                                     'fpsConsumerImported': False, 'closureComplete': True},
              'auditHelperChanges': helper_changes, 'cohortProbesReused': cohort_reuse,
              'cgMetadataContinuity': {'sourceCommit': CG_BASE, 'sourceFixtureSha256': sha(cg_fixture_path.read_bytes()),
                                       'actorSourcePins': len(hero_review['heroes']), 'sourceFilesChecked': cg_pins,
                                       'all17FilesUnchangedFrom5baIn82aLaterGitAndWorkingTree': True,
                                       'cgApprovalOrHistoryChangedByThisAudit': False},
              'historicalQueue': {'path': queue_name, 'sha256': sha(queue_bytes), 'byteIdenticalTo9899AndLaterGit': True,
                                  'batches': 124, 'historicalP0ActorKeys': p0, 'automaticRetryDisallowedActorKeys': refusals},
              'carriedActorExportCounts': {'actors': len(ledger), 'tasksByPriority': dict(counts),
                                           'missingRasterActors': missing_rasters, 'newProtectionScope': '["The Dark Knight","id:batman_tdk"]',
                                           'newProtectionFinding': 'RASTER_SCOPE_UNRESOLVED'},
              'checksPassed': True, 'scriptSha256': sha(Path(__file__).read_bytes()),
              'reexportsExecuted': 0, 'mediaCopiedOrHydrated': 0, 'fullActorClosures': 0, 'artApprovals': 0,
              'visual1to1Verified': False}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'checksPassed': True, 'sourceFiles': len(indexed), 'unchanged': len(indexed)-1,
                      'exception': EXCEPTION, 'unchangedImportedModules': len(graph['modules']),
                      'cgSourceFiles': len(cg_pins), 'historicalP0': len(p0), 'retryControls': len(refusals)}))


if __name__ == '__main__':
    main()
