#!/usr/bin/env python3
"""Record five exact, disjoint work activities without changing the historical queue."""
import argparse
from collections import Counter
import gzip
import hashlib
import json
from pathlib import Path


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--checkpoint-dir', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    root, directory = args.repo.resolve(), args.checkpoint_dir.resolve()
    assert not args.out.exists(), 'Refuse to overwrite an existing activity record.'
    turn = directory.parent.parent
    ledger_bytes = gzip.decompress((directory / 'actor-tasks.json.gz').read_bytes())
    retention = json.loads((directory / 'retention.json').read_text())
    assert hashlib.sha256(ledger_bytes).hexdigest() == retention['originalSha256']
    ledger_rows = json.loads(ledger_bytes)
    ledger = {row['actorKey']: row for row in ledger_rows}
    assert len(ledger) == len(ledger_rows) == 4937
    delta_file = directory / 'actor-task-delta.json'
    delta = json.loads(delta_file.read_text())
    validation = json.loads((directory / 'validation.json').read_text())
    assert validation['afterLedgerSha256'] == retention['originalSha256']
    queue_file = root / 'docs/assets/p0-p1-menu-continuation-2026-11-13/backlog/actor-batches-40.json'
    queue_bytes = queue_file.read_bytes()
    queue = json.loads(queue_bytes)
    inherited = {row['actorKey']: row for batch in queue['batches'] for row in batch['actors']}
    definitions = [
        ('p0-lot-004', 'reserved-actors.json', 'Existing single-red KOTOR I Revan correction selected with exact identity/layout/hash guards; body and HUD rendering restored. No new image generated; historical P0 remains open.'),
        ('ff-lot-040', 'plan.json', 'Forty actor source contracts and raw labels corrected; 112 prepared hero profiles and 21 selected kits preserved. Equipment/type corrections remain distinct from art approval.'),
        ('scifi-lot-040', 'reservation-040.json', 'Source contracts/raw labels corrected; Cortana Fragment support, legacy Buck ODST single-target kit and Collector Drone firearm corrected. The prepared profile sets of 23 heroes and seven kits are preserved.'),
        ('arena-lot-040', 'reservation-040.json', 'Thirty-nine individual declarations and twelve UT2004 catalogue actions aligned; six NPC shots become ranged. Necris model remains unresolved; Gladiator keeps Quake II scope.'),
        ('raster-lot-004', 'baseline-audit.json', 'Only the classic Doom Pinky receives one usable raster of 16 poses and three source fields. Stable name/signature retained; the other 39 missing rasters remain open.')]
    next_steps = {
        'INCARNATION_UNSPECIFIED': 'Fix the individual edition/model before further artwork.',
        'VISUAL_CONTRACT_MISSING': 'Document the source silhouette, materials, palette and equipment.',
        'REFERENCE_MISSING': 'Find and record a source reference for this exact identity.',
        'GENERIC_TECHNIQUE_NAMES': 'Reconcile raw labels with the existing effective resolver and prepared signature; preserve reviewed mechanics.',
        'RASTER_MISSING': 'Check the complete Git asset tree, exact source contract and all historical refusal evidence before considering new art.',
        'RASTER_SCOPE_UNRESOLVED': 'Resolve the exact reviewed source binding; keep rejected asset families blocked.',
        'PACK_CONTINUITY_PRECISION': 'Select an individually supported model/edition; do not copy only the pack scope.',
        'REFERENCE_SCENE_REVIEW': 'Compare the declared model and encounter with actual source images/scenes.',
        'ORIGINAL_COSTUME_ARTWORK': 'Review the original costume against the exact selected source.',
        'ANIMATION_AND_VISUAL_REVIEW': 'Review remaining animation states and game-scale presentation against source references.',
        'OFFICIAL_COSTUME_RESEARCH': 'Continue documented official-variant research without treating missing evidence as approval.'}
    corrected_without_removed_pairs = {'["Unreal Tournament 2004","id:unreal_tournament_2004_necris"]':
                                       'Existing Lightning Gun now receives ranged RPG targeting; identity/model precision remains open.'}
    activities, seen = [], set()
    for folder, filename, scope in definitions:
        reservation = turn / folder / filename
        document = json.loads(reservation.read_text())
        selected = document['actors'] if isinstance(document, dict) else document
        keys = [row['actorKey'] for row in selected]
        assert len(keys) == len(set(keys)) == 40
        assert not seen.intersection(keys), 'Activity reservations overlap.'
        seen.update(keys)
        rows = []
        for key in keys:
            current = ledger[key]
            closed = [row for row in delta['removedSourceFindings'] if row['actorKey'] == key]
            added = [row for row in delta['addedSourceFindings'] if row['actorKey'] == key]
            open_codes = {row['code'] for row in current['tasks']}
            assert all(row['code'] not in open_codes and row['actorClosed'] is False and row['artApproved'] is False for row in closed)
            assert all(row['code'] in open_codes for row in added)
            prior = inherited.get(key, {})
            runtime_note = corrected_without_removed_pairs.get(key)
            rows.append({'actorKey': key, 'actorId': current['actorId'], 'name': current['actorName'], 'universe': current['universe'], 'kind': current['kind'],
                         'activityStatus': 'SOURCE_FINDINGS_REMOVED_REVIEWS_OPEN' if closed else 'RUNTIME_FIX_RECORDED_REVIEWS_OPEN' if runtime_note else 'RESERVED_NOT_CORRECTED_THIS_TURN',
                         'removedSourceFindingPairs': [{'code': row['code'], 'priority': row['priority'], 'closureScope': 'Source finding removed only; no complete actor or art approval.'} for row in closed],
                         'addedOpenFindingPairs': [{'code': row['code'], 'priority': row['priority']} for row in added],
                         'remainingOpenFindings': [{'code': row['code'], 'priority': row['priority'], 'status': row['status']} for row in current['tasks']],
                         'remainingOpenP1Codes': [row['code'] for row in current['tasks'] if row['priority'] == 'P1'],
                         'remainingOpenP2Codes': [row['code'] for row in current['tasks'] if row['priority'] == 'P2'],
                         'nextWork': list(dict.fromkeys(next_steps[code] for code in sorted(open_codes) if code in next_steps)),
                         'runtimeCorrectionWithoutSourceFindingRemoval': runtime_note,
                         'currentIncarnation': current['incarnation'], 'currentReference': current['declaredReference'],
                         'missingRasterPaths': current['missingRasterPaths'], 'staticGameplayPaths': current['staticGameplayPaths'],
                         'inheritedRiskPriority': prior.get('priority'), 'inheritedWorkMode': prior.get('workMode'),
                         'inheritedProviderRefusalEvidence': prior.get('providerRefusalEvidence'),
                         'inheritedAutomaticGenerationRetryAllowed': prior.get('automaticGenerationRetryAllowed'),
                         'generationConstraint': 'Check all historical refusal evidence before any request; null inherited fields do not authorize retries.',
                         'actorClosed': False, 'artApproved': False, 'visual1to1Verified': False})
        activity_closed = [pair for row in rows for pair in row['removedSourceFindingPairs']]
        activity_added = [pair for row in rows for pair in row['addedOpenFindingPairs']]
        activities.append({'activityId': folder, 'reservation': str(reservation.relative_to(root)), 'reservationSha256': sha(reservation),
                           'actorCount': 40, 'correctedScope': scope, 'actorsWithRemovedSourceFindings': sum(bool(row['removedSourceFindingPairs']) for row in rows),
                           'removedSourceFindingsByPriority': dict(Counter(row['priority'] for row in activity_closed)),
                           'addedOpenFindingsByPriority': dict(Counter(row['priority'] for row in activity_added)),
                           'actors': rows, 'fullActorClosures': 0, 'visual1to1Verified': False})
    assert len(seen) == 200
    covered_removed = {(row['actorKey'], pair['code']) for activity in activities for row in activity['actors'] for pair in row['removedSourceFindingPairs']}
    expected_removed = {(row['actorKey'], row['code']) for row in delta['removedSourceFindings']}
    assert covered_removed == expected_removed, 'Actual source-pair delta must be covered exactly once.'
    assert queue_file.read_bytes() == queue_bytes, 'Historical queue changed during activity capture.'
    report = {'schemaVersion': 1, 'sourceCommit': validation['sourceCommit'], 'batchSize': 40, 'activityCount': 5, 'reservedActors': 200,
              'distinctActorKeys': 200, 'reservationsDisjoint': True, 'scope': 'New activity tracking only. The historical queue of 124 batches and its risks/refusal controls are untouched. Reserving 40 actors does not mean delivering 40 artworks or complete actors.',
              'inputLedgerSha256': retention['originalSha256'], 'inputDeltaSha256': sha(delta_file),
              'historicalQueue': str(queue_file.relative_to(root)), 'historicalQueueSha256': hashlib.sha256(queue_bytes).hexdigest(),
              'historicalQueueBytesUnchanged': True, 'removedSourceFindingPairs': len(covered_removed),
              'removedSourceFindingsByPriority': dict(Counter(row['priority'] for row in delta['removedSourceFindings'])),
              'addedOpenFindingsByPriority': dict(Counter(row['priority'] for row in delta['addedSourceFindings'])),
              'activities': activities, 'fullActorClosures': 0, 'newArtApprovals': 0, 'visual1to1Verified': False,
              'scriptSha256': sha(Path(__file__))}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({key: report[key] for key in ('activityCount', 'reservedActors', 'distinctActorKeys', 'removedSourceFindingPairs', 'removedSourceFindingsByPriority', 'addedOpenFindingsByPriority', 'historicalQueueBytesUnchanged')}))


if __name__ == '__main__':
    main()
