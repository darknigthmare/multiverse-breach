import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const evidenceBytes = readFileSync(new URL('./fixtures/cg-rift-evidence-before-p0-rebuild-2026-11-20.json', import.meta.url));
assert.equal(createHash('sha256').update(evidenceBytes).digest('hex'),
  '78527060e5285737f1d559cd3f11c467be8e9879ebe8b8951a9561e481060989');
const evidence = new Map(JSON.parse(evidenceBytes).records.map(({ id, fields }) => [id, fields]));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const fieldValue = (record, key) => Object.hasOwn(record, key) ? { value: record[key] } : {};

// Reconstruct the Rift inputs of the existing CG archive. New authoring still
// reads the live catalogue. A change beyond the recorded transition remains
// visible to the archived CG file, identity and serialization assertions.
export function readCgRiftDossiers(root, historical = true) {
  const source = JSON.parse(readFileSync(path.join(root, 'docs/rift-dossiers/catalog.json'), 'utf8')).entrees;
  if (!historical) return source;
  return source.map(row => {
    const fields = row.famille === 'arc-personnage' ? evidence.get(row.id) : null;
    if (!fields) return row;
    const historicalRow = { ...row };
    for (const [key, { current, previous }] of Object.entries(fields)) {
      if (!same(fieldValue(row, key), current)) continue;
      if (Object.hasOwn(previous, 'value')) historicalRow[key] = previous.value;
      else delete historicalRow[key];
    }
    return historicalRow;
  });
}
