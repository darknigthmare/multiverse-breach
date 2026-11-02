// Preserve the W14 outputs before any W15 refresh. This prepares evidence only;
// no production catalog, audit, reference, threshold or registry is modified.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { prefix, previousPrefix, root, read, json, sha, relative } from './closure-support.mjs';
import path from 'node:path';

assert.ok(process.argv.includes('--snapshot-baseline') || process.argv.includes('--check-only'));
const directory = prefix + 'rift-refresh/';
const previous = json(previousPrefix + 'rift-refresh/result.json');
assert.equal(previous.success, true);
const sourceRows = [
  ['docs/rift-dossiers/catalog.json', 'catalog-before.json'],
  ['docs/rift-dossiers/character-reference-quality.json', 'quality-before.json'],
  ['src/game/riftDossierAssets.json', 'registry-before.json'],
  ['scripts/auditCharacterReferenceQuality.py', 'auditCharacterReferenceQuality-before.py']
];
for (const source of ['scripts/buildRiftDossierCatalog.mjs', 'scripts/buildRiftDossierAssetRegistry.mjs', 'scripts/auditCharacterReferenceQuality.py']) {
  assert.equal(sha(read(source)), previous.sourceSha256After[source], source + ': historical source must remain byte-exact');
}
const snapshots = sourceRows.map(([source, name]) => {
  const bytes = read(source), digest = sha(bytes), snapshot = directory + name;
  const expected = previous.generatedSha256After[source] || previous.sourceSha256After[source];
  assert.equal(digest, expected, source + ': W14 baseline output changed before preparation');
  const absolute = path.resolve(root, relative(snapshot));
  if (fs.existsSync(absolute)) assert.equal(sha(read(snapshot)), digest, snapshot + ': never replace a historical snapshot');
  return { source, snapshot, sha256: digest, bytes: bytes.length };
});
const helperNames = ['run-sequential-refresh.py', 'summarize-refresh.py', 'verify-refresh-integrity.py'];
const helpers = Object.fromEntries(helperNames.map(name => [name, sha(read(directory + name))]));
const preparation = {
  schemaVersion: 2, wave: 15, createdAt: new Date().toISOString(), preparationOnly: true, authorized: false,
  commandsExecuted: [], authorizationFileCreated: false, finalWriteGateCreated: false,
  historicalPythonSha256: sha(read('scripts/auditCharacterReferenceQuality.py')),
  sourceBaseline: prefix + 'baseline-current-wave14.json', snapshots, helpers,
  remainingBeforeExecution: 'Root freezes package and all120 current base16 references before separate authorization. References-only steps1–2 remain separate from final writes3–5 after every final browser has closed. No threshold/pin/source changes or pending-status restoration are authorized.'
};
const target = path.resolve(root, directory + 'preparation-only.json');
if (fs.existsSync(target)) {
  const existing = json(directory + 'preparation-only.json');
  assert.deepEqual(existing.snapshots, snapshots);
  if (JSON.stringify(existing.helpers) !== JSON.stringify(helpers)) {
    assert.ok(process.argv.includes('--refresh-helper-fingerprints'), 'Review helpers before refreshing the unexecuted preparation');
    for (const name of ['authorization.json', 'result.json']) assert.equal(fs.existsSync(path.resolve(root, directory + name)), false, 'Executed preparation is immutable');
  } else {
    console.log(JSON.stringify({ preparationOnly: true, existing: true, snapshots: snapshots.length, commandsExecuted: [] }));
    process.exit(0);
  }
}
if (!process.argv.includes('--check-only')) {
  fs.mkdirSync(path.resolve(root, directory), { recursive: true });
  for (const row of snapshots) {
    const target = path.resolve(root, row.snapshot);
    if (!fs.existsSync(target)) fs.writeFileSync(target, read(row.source));
  }
  if (fs.existsSync(target)) fs.copyFileSync(target, path.resolve(root, directory + 'preparation-before-' + preparation.createdAt.replace(/[^0-9]/g, '') + '.json'));
  fs.writeFileSync(target, JSON.stringify(preparation, null, 2) + '\n');
}
console.log(JSON.stringify({ preparationOnly: true, checkOnly: process.argv.includes('--check-only'), snapshots: snapshots.length, commandsExecuted: [], authorizationCreated: false }));
