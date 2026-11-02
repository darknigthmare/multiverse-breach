// Publish a real UI execution without rewriting its origin or timestamps.
// Only artifact locations are relocated; the raw report is retained byte-exact.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const input = process.argv[2];
assert.ok(input, 'Pass a completed proof directory containing result.json');
const source = path.resolve(input), bytes = fs.readFileSync(path.join(source, 'result.json'));
const report = JSON.parse(bytes), hash = value => createHash('sha256').update(value).digest('hex');
assert.equal(report.passed, true); assert.equal(report.allBrowserWindowsClosed, true);
assert.equal(report.actualCustomBattleLaunches, 6); assert.equal(report.actualSourceSectorLaunches, 4);
assert.equal(report.actualLegacyControlLaunches, 2); assert.equal(report.rows.length, 18);
assert.equal(report.artifacts.filter(a => a.path.endsWith('.png')).length, 10);
const directory = 'docs/tactics-universes-2026-10-28';
const output = report.preliminary ? directory + '/preliminary-' + report.startedAt.replace(/[^0-9]/g, '') : directory;
const archive = 'docs/combat-fidelity-wave16-2026-10-28/browser/attempts/tactics-' + (report.preliminary ? 'preliminary-' : 'final-') + report.startedAt.replace(/[^0-9]/g, '');
fs.mkdirSync(path.join(root, output), { recursive: true }); fs.mkdirSync(path.join(root, archive), { recursive: true });
const raw = archive + '/raw-execution-result.json';
assert.equal(fs.existsSync(path.join(root, raw)), false, 'Keep every prior raw execution');
fs.writeFileSync(path.join(root, raw), bytes);
const relocations = [];
for (const artifact of report.artifacts) {
  const original = path.resolve(artifact.path);
  assert.equal(path.dirname(original), source, 'Only an actual run artifact may be relocated');
  const data = fs.readFileSync(original); assert.equal(hash(data), artifact.sha256); assert.equal(data.length, artifact.bytes);
  const target = output + '/' + path.basename(original);
  fs.writeFileSync(path.join(root, target), data);
  relocations.push({ from: artifact.path, to: target, sha256: artifact.sha256, bytes: data.length });
  artifact.path = target;
}
report.publication = { publishedAt: new Date().toISOString(), rawExecution: { path: raw, sha256: hash(bytes), bytes: bytes.length }, artifactLocationsOnly: true, relocations };
fs.writeFileSync(path.join(root, output, 'result.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, preliminary: report.preliminary, source, output, rawExecution: raw, checks: report.rows.length, captures: 10 }));
