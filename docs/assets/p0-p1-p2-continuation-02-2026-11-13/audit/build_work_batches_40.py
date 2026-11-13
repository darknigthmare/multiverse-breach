#!/usr/bin/env python3
"""Write the four reserved cohorts with their actual remaining ledger findings."""
import argparse
from collections import Counter
import gzip
import hashlib
import json
from pathlib import Path


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    assert not args.out.exists(), 'Use a new output path.'
    audit = Path(__file__).resolve().parent
    checkpoint = audit / 'checkpoint-82a1f003'
    validation = json.loads((checkpoint / 'validation.json').read_text())
    delta = json.loads((checkpoint / 'actor-task-delta.json').read_text())
    packed = (checkpoint / 'actor-tasks.json.gz').read_bytes()
    raw = gzip.decompress(packed)
    retention = next(row for row in validation['compressedRetention'] if row['compressedPath'] == 'actor-tasks.json.gz')
    assert sha(packed) == retention['compressedSha256'] and sha(raw) == retention['originalSha256']
    ledger = {row['actorKey']: row for row in json.loads(raw)}
    assert len(ledger) == 4937
    scopes = {
        'gears-deadspace-040': 'Precise selected-edition actor metadata and raw catalog projection.60 prepared hero RPG slots preserved. FPS consumer corrections are documented separately; remaining source, artwork and scene reviews stay open.',
        'portal-l4d-040': 'Precise selected-edition actor metadata and raw catalog projection. Two damaging support identities corrected;56 other prepared hero RPG slots preserved. Four synthetic cross-era reinforcement action/render contracts corrected without canonical-invocation approval.',
        'raster-lot-004-resume': 'Two new bounded Doom rasters: Imp Fireballer and Mancubus Flame Tank. Pinky was already delivered before this turn and is not recounted.37 raster-missing actors remain in this reserved cohort.',
        'presentation-040': 'Three bounded Revan presentation clips and KO hold/alias guards; no new atlas. Batman exact-identity quarantine adds an unresolved-raster P1. Global animation/source/visual reviews remain open.'}
    seen, activities = set(), []
    for activity, scope in scopes.items():
        key_path = audit / f'{activity}-keys.json'
        keys = json.loads(key_path.read_text())
        assert len(keys) == len(set(keys)) == 40 and not seen.intersection(keys)
        seen.update(keys)
        removed = [row for row in delta['removedSourceFindings'] if row['actorKey'] in keys]
        added = [row for row in delta['addedSourceFindings'] if row['actorKey'] in keys]
        rows = []
        for key in keys:
            actor = ledger[key]
            rows.append({'actorKey': key, 'actorId': actor['actorId'], 'name': actor['actorName'],
                         'universe': actor['universe'], 'kind': actor['kind'], 'status': 'OPEN_REMAINING_FINDINGS',
                         'removedFindingsThisTurn': [{field: row[field] for field in ('code', 'priority')}
                                                    for row in removed if row['actorKey'] == key],
                         'addedFindingsThisTurn': [{field: row[field] for field in ('code', 'priority')}
                                                  for row in added if row['actorKey'] == key],
                         'remainingFindings': [{field: row[field] for field in ('code', 'priority', 'status')}
                                               for row in actor['tasks']],
                         'missingRasterPaths': actor['missingRasterPaths'],
                         'fullActorClosed': False, 'visual1to1Verified': False})
        remaining = Counter(task['priority'] for key in keys for task in ledger[key]['tasks'])
        missing = sum(bool(ledger[key]['missingRasterPaths']) for key in keys)
        if activity == 'raster-lot-004-resume':
            assert missing == 37
        activities.append({'activityId': activity, 'reservedActorCount': 40, 'reservationSha256': sha(key_path.read_bytes()),
                           'correctedScope': scope, 'removedFindingPairs': len(removed),
                           'removedByCode': dict(Counter(row['code'] for row in removed)),
                           'addedFindingPairs': len(added), 'addedByCode': dict(Counter(row['code'] for row in added)),
                           'remainingFindingsByPriority': dict(remaining), 'actorsWithMissingRaster': missing,
                           'actorOrder': 'Exact original reservation order retained; no reranking or inference of generation authorization.',
                           'actors': rows})
    assert len(seen) == 160
    assert sum(row['removedFindingPairs'] for row in activities) == 248
    assert sum(row['addedFindingPairs'] for row in activities) == 77
    report = {'schemaVersion': 1, 'actualExportSourceCommit': validation['sourceCommit'],
              'laterCoreContinuityReceipt': 'final-core-continuity-5667556.json',
              'scope': 'Continuation ledger for the four reserved cohorts only. Preserve historical124-batch queue/refusal controls; no new actor completion, art approval or generation authorization.',
              'batchSize': 40, 'reservedActors': 160, 'distinctActorKeys': len(seen), 'reservationsDisjoint': True,
              'ledgerGzipSha256': sha(packed), 'deltaSha256': sha((checkpoint / 'actor-task-delta.json').read_bytes()),
              'activities': activities, 'historicalQueueModified': False,
              'fullActorClosures': 0, 'artApprovals': 0, 'visual1to1Verified': False,
              'scriptSha256': sha(Path(__file__).read_bytes())}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'activities': len(activities), 'actors': len(seen), 'removedPairs': 248,
                      'addedPairs': 77, 'bytes': args.out.stat().st_size}))


if __name__ == '__main__':
    main()
