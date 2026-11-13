#!/usr/bin/env python3
"""Review exact actor-source findings and prepared RPG profiles, without art approval."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re


def load(file):
    value = json.loads(file.read_text())
    return value['rows'] if isinstance(value, dict) else value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('baseline', 'before', 'after', 'overlay', 'out'):
        parser.add_argument('--' + name, type=Path, required=True)
    args = parser.parse_args()
    baseline = {row['actorKey']: row for row in load(args.baseline)}
    before, after = load(args.before), load(args.after)
    assert len(before) == len(after) == len({row['actorKey'] for row in before}) == 40
    before = {row['actorKey']: row for row in before}
    assert set(before) == {row['actorKey'] for row in after}
    selected = re.compile(r'CONTINUITY_PRECISION|INCARNATION_|VISUAL_CONTRACT_|REFERENCE_(MISSING|SCENE_REVIEW)|GENERIC_TECHNIQUE_NAMES')
    removed, added, profiles, signatures, raw_mismatches = [], [], [], [], []
    unchanged_heroes = unchanged_slots = preserved_signatures = 0
    for row in after:
        key = row['actorKey']
        old = before[key]
        assert all(row[field] == old[field] for field in ('actorId', 'name', 'universe', 'kind'))
        assert row['artApproved'] is False and row['source1to1Verified'] is False
        left = {task['code']: task['priority'] for task in baseline[key]['tasks'] if selected.search(task['code'])}
        right = {task['code']: task['priority'] for task in row['sourceClassification']['findings']}
        assert not any(left[code] != right[code] for code in left.keys() & right.keys()), 'Unreviewed priority change'
        removed.extend({'actorKey': key, 'code': code, 'priority': left[code]} for code in sorted(left.keys() - right.keys()))
        added.extend({'actorKey': key, 'code': code, 'priority': right[code]} for code in sorted(right.keys() - left.keys()))
        changed_slots = {}
        for slot in ('simple', 'secondary', 'defense', 'special'):
            previous, current = old['prepared'][slot]['rpgProfile'], row['prepared'][slot]['rpgProfile']
            if previous != current:
                changed_slots[slot] = {field: {'before': previous.get(field), 'after': current.get(field)}
                                       for field in previous.keys() | current.keys() if previous.get(field) != current.get(field)}
            elif row['kind'] == 'hero':
                unchanged_slots += 1
            raw, effective = row['unprepared'][slot]['raw'], row['unprepared'][slot]['rpgAbility']
            if isinstance(raw, dict) and isinstance(effective, dict) and raw.get('name') != effective.get('name'):
                raw_mismatches.append({'actorKey': key, 'slot': slot, 'rawName': raw.get('name'), 'effectiveName': effective.get('name')})
        if changed_slots:
            profiles.append({'actorKey': key, 'kind': row['kind'], 'slots': changed_slots})
        elif row['kind'] == 'hero':
            unchanged_heroes += 1
        if old['selectedLegacySignature'] != row['selectedLegacySignature']:
            previous_signature, current_signature = old['selectedLegacySignature'], row['selectedLegacySignature']
            signatures.append({'actorKey': key, 'beforeKey': (old['selectedLegacySignature'] or {}).get('key'),
                               'afterKey': (row['selectedLegacySignature'] or {}).get('key'),
                               'lost': bool(previous_signature) and not bool(current_signature),
                               'changedDefinitionFields': [field for field in sorted((previous_signature or {}).keys() | (current_signature or {}).keys())
                                                           if (previous_signature or {}).get(field) != (current_signature or {}).get(field)]})
        elif old['selectedLegacySignature']:
            preserved_signatures += 1
    report = {'schemaVersion': 1, 'scope': 'Independent exact40 source/resolver comparison. Removed source findings are not completed actors, visual approvals, new gameplay or 1:1 certification.',
              'inputs': {name: {'path': str(getattr(args, name)), 'sha256': hashlib.sha256(getattr(args, name).read_bytes()).hexdigest()} for name in ('baseline', 'before', 'after', 'overlay')},
              'actors': 40, 'actorKeysPreserved': True, 'removedSourceFindings': removed, 'addedSourceFindings': added,
              'removedSourceFindingsByCode': dict(Counter(row['code'] for row in removed)),
              'addedSourceFindingsByCode': dict(Counter(row['code'] for row in added)),
              'unchangedPreparedRpgHeroes': unchanged_heroes, 'unchangedPreparedRpgHeroSlots': unchanged_slots,
              'changedPreparedRpgProfiles': profiles, 'selectedLegacySignatureChanges': signatures,
              'preservedSelectedLegacySignatures': preserved_signatures, 'rawEffectiveLabelDifferences': raw_mismatches,
              'artApprovals': 0, 'actorClosuresApproved': 0, 'source1to1Verified': False}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({key: report[key] for key in ('actors', 'removedSourceFindingsByCode', 'addedSourceFindingsByCode', 'unchangedPreparedRpgHeroes', 'unchangedPreparedRpgHeroSlots', 'selectedLegacySignatureChanges', 'preservedSelectedLegacySignatures')}))


if __name__ == '__main__':
    main()
