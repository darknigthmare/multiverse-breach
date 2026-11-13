#!/usr/bin/env python3
"""Diff actor/source findings by exact key. Removed findings are not art approval."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def load(file):
    rows = json.loads(file.read_text())
    assert isinstance(rows, list)
    indexed = {}
    for row in rows:
        assert row['actorKey'] not in indexed, 'Actor identity collision'
        indexed[row['actorKey']] = row
        assert row.get('artApproved', False) is False, 'Unexpected automatic art approval'
        codes = set()
        for task in row['tasks']:
            assert task['code'] not in codes, 'Duplicate task code'
            codes.add(task['code'])
            assert task.get('status') == 'OPEN' and task.get('artApproved', False) is False
    return indexed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--before', type=Path, required=True)
    parser.add_argument('--after', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    before, after = load(args.before), load(args.after)
    removed, added, reprioritized, changed = [], [], [], []
    fields = ['incarnation', 'incarnationEvidence', 'declaredReference', 'visualAnchor', 'techniques', 'missingRasterPaths', 'staticGameplayPaths']
    for key in sorted(before.keys() & after.keys()):
        left, right = before[key], after[key]
        assert all(left.get(field) == right.get(field) for field in ('actorId', 'actorName', 'universe', 'kind', 'sourceScope')), key
        old = {task['code']: task for task in left['tasks']}
        new = {task['code']: task for task in right['tasks']}
        for code in sorted(old.keys() - new.keys()):
            removed.append({'actorKey': key, 'code': code, 'priority': old[code]['priority'], 'decision': 'SOURCE_FINDING_REMOVED_REQUIRES_SCOPED_REVIEW', 'actorClosed': False, 'artApproved': False})
        for code in sorted(new.keys() - old.keys()):
            added.append({'actorKey': key, 'code': code, 'priority': new[code]['priority']})
        for code in sorted(old.keys() & new.keys()):
            if old[code]['priority'] != new[code]['priority']:
                reprioritized.append({'actorKey': key, 'code': code, 'before': old[code]['priority'], 'after': new[code]['priority']})
        delta = {field: {'before': left.get(field), 'after': right.get(field)} for field in fields if left.get(field) != right.get(field)}
        if delta:
            changed.append({'actorKey': key, 'fields': delta, 'remainingTasks': [{'code': task['code'], 'priority': task['priority']} for task in right['tasks']]})
    report = {'schemaVersion': 1, 'scope': 'Exact actor-key/task-code source delta. A removed finding is not a completed actor, new gameplay implementation, artistic approval or 1:1 certification.',
              'inputs': {'before': str(args.before), 'beforeSha256': sha(args.before), 'after': str(args.after), 'afterSha256': sha(args.after)},
              'beforeActors': len(before), 'afterActors': len(after), 'actorsAdded': sorted(after.keys() - before.keys()), 'actorsRemoved': sorted(before.keys() - after.keys()),
              'beforeTasks': dict(Counter(task['priority'] for row in before.values() for task in row['tasks'])),
              'afterTasks': dict(Counter(task['priority'] for row in after.values() for task in row['tasks'])),
              'removedSourceFindingsByCode': dict(Counter(item['code'] for item in removed)), 'addedSourceFindingsByCode': dict(Counter(item['code'] for item in added)),
              'removedSourceFindings': removed, 'addedSourceFindings': added, 'reprioritized': reprioritized, 'changedActors': changed,
              'actorClosuresApproved': 0, 'artApprovals': 0, 'source1to1Verified': False}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({key: report[key] for key in ('beforeActors', 'afterActors', 'beforeTasks', 'afterTasks', 'removedSourceFindingsByCode', 'addedSourceFindingsByCode', 'actorClosuresApproved')}))


if __name__ == '__main__':
    main()
