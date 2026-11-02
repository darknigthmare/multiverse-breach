import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const directory = 'docs/combat-fidelity-wave15-2026-10-26/';
const read = path => readFileSync(new URL('../../../' + path, import.meta.url));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const plan = JSON.parse(read(directory + 'batch-plan-before.json'));
const inventory = JSON.parse(read(directory + 'baseline-preservation.json'));
assert.equal(digest(read(directory + 'batch-plan-before.json')), '08c143270255b5bc83fc051d37f5203351da868b232856d9f43a4dc943463dd1');
assert.equal(digest(read(directory + 'baseline-preservation.json')), plan.baselinePreservation.sha256);
const mismatches = [], files = {};
for (const [path, expected] of Object.entries({ ...inventory.pngFiles, ...inventory.registries, ...inventory.historicalReports })) {
  const actual = digest(read(path));
  files[path] = actual;
  if (actual !== expected) mismatches.push({ path, expected, actual, kind: 'managed-baseline' });
}
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
assert.equal(head, plan.gitHead, 'Preservation is anchored to the selected commit; a later commit needs a new verification context');
const tracked = execFileSync('git', ['ls-tree', '-rz', plan.gitHead, '--', 'docs'], { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }).split('\0').filter(Boolean);
let historicalDocumentationFiles = 0;
for (const row of tracked) {
  const tab = row.indexOf('\t'), path = row.slice(tab + 1);
  const wave = /^docs\/combat-fidelity-wave(\d+)-/.exec(path);
  if (!(wave && Number(wave[1]) <= 14) && !/^docs\/combat-fidelity-2026-/.test(path)) continue;
  const [_mode, type, expected] = row.slice(0, tab).split(' ');
  assert.equal(type, 'blob', path);
  const bytes = read(path);
  const actual = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  historicalDocumentationFiles++;
  if (actual !== expected) mismatches.push({ path, expected, actual, kind: 'committed-historical-documentation' });
}
const result = { schemaVersion: 1, createdAt: new Date().toISOString(), gitHead: head,
  method: 'sha256 against frozen pre-W15 managed inventory; git blob hashes against selected commit for every tracked W1–W14 fidelity document and image',
  counts: { oldPng: Object.keys(inventory.pngFiles).length, oldRegistries: Object.keys(inventory.registries).length, pinnedHistoricalReports: Object.keys(inventory.historicalReports).length, historicalDocumentationFiles },
  mismatches, files, source1to1Verified: false, passed: mismatches.length === 0 };
writeFileSync(new URL('preservation-result.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: result.passed, counts: result.counts, mismatches }, null, 2));
assert.equal(mismatches.length, 0, 'Historical validated bytes changed');
