// Real sequential refresh, completed before W16 production is frozen.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { measureCombatFidelity } from '../../scripts/combatFidelityAudit.mjs';
import { root, prefix, read, json, fingerprint, sha, verifyFile, writeReports,
  historicalBaseline, effectiveBatchPlan, assertDeliveryReady } from './closure-support.mjs';

assert.ok(process.argv.includes('--all-reference-owners-finished'));
historicalBaseline();
const audit = measureCombatFidelity(); assertDeliveryReady(audit);
const baseline = json(prefix + 'baseline-rift-before.json');
const scripts = ['scripts/buildRiftDossierCatalog.mjs', 'scripts/auditCharacterReferenceQuality.py', 'scripts/buildRiftDossierAssetRegistry.mjs'];
for (const file of scripts) {
  const old = baseline.files.find(record => record.path === file); assert.ok(old);
  assert.equal(sha(read(file)), old.sha256, file + ': historical source or thresholds changed');
}
const plan = effectiveBatchPlan(), bases = new Map(audit.baseSpriteCorrections.entries.map(entry => [entry.heroId, entry]));
const references = plan.heroes.map(({ hero }) => {
  const entry = bases.get(hero.id); assert.ok(entry?.sheet.includes('wave16'), hero.id);
  return { id: hero.id, path: 'public' + entry.sheet, sheet: entry.sheet, sha256: sha(read('public' + entry.sheet)) };
});
const commands = [
  ['node', 'scripts/buildRiftDossierCatalog.mjs', '--refresh-character-reference-audit'],
  ['python', 'scripts/auditCharacterReferenceQuality.py'],
  ['node', 'scripts/buildRiftDossierCatalog.mjs'],
  ['node', 'scripts/buildRiftDossierAssetRegistry.mjs'],
  ['npm', 'run', 'rift:audit']
];
const generated = ['docs/rift-dossiers/catalog.json', 'docs/rift-dossiers/character-reference-quality.json', 'src/game/riftDossierAssets.json'];
const resultPath = prefix + 'rift-refresh/result.json';
assert.equal(fs.existsSync(path.resolve(root, resultPath)), false, 'Preserve an existing actual refresh before another attempt');
if (process.argv.includes('--check-only')) {
  console.log(JSON.stringify({ checkOnly: true, references: references.length, wouldRun: commands, realCommandsRun: 0 }));
  process.exit(0);
}
const startedAt = new Date().toISOString(), before = Object.fromEntries([...scripts, 'package.json', 'package-lock.json'].map(file => [file, sha(read(file))]));
const outputsBefore = Object.fromEntries(generated.map(file => [file, fingerprint(file)]));
const registryBefore = json('src/game/riftDossierAssets.json');
const statuses = registry => registry.entries.map(entry => [entry.stageId, entry.status, entry.assetPath]).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
const directory = path.resolve(root, prefix + 'rift-refresh'); fs.mkdirSync(directory, { recursive: true });
const steps = [];
for (const [index, argv] of commands.entries()) {
  const log = prefix + `rift-refresh/step-${String(index + 1).padStart(2, '0')}.log`, commandStarted = new Date().toISOString();
  const descriptor = fs.openSync(path.resolve(root, log), 'w'); let spawnError = null;
  const child = spawn(argv[0], argv.slice(1), { cwd: root, stdio: ['ignore', descriptor, descriptor] });
  child.once('error', error => { spawnError = error.message; });
  const observed = await new Promise(resolve => child.once('close', (exitCode, signal) => resolve({ exitCode, signal })));
  fs.closeSync(descriptor);
  steps.push({ argv, startedAt: commandStarted, finishedAt: new Date().toISOString(), ...observed, spawnError,
    processId: child.pid ?? null, receiptOrigin: 'node-child-process-close-event', log, logSha256: sha(read(log)) });
  console.log(JSON.stringify({ step: index + 1, argv, exitCode: observed.exitCode, finishedAt: steps.at(-1).finishedAt }));
  if (observed.exitCode !== 0 || observed.signal || spawnError) {
    writeReports([[resultPath, { success: false, startedAt, finishedAt: new Date().toISOString(), steps, references,
      sourceFilesBefore: before, reason: 'A real command failed; later steps were not run.' }]]);
    throw new Error('Rift step failed; see ' + log);
  }
}
for (const [file, digest] of Object.entries(before)) assert.equal(sha(read(file)), digest, file + ': source changed during refresh');
for (const record of references) verifyFile(record);
assert.deepEqual(statuses(json('src/game/riftDossierAssets.json')), statuses(registryBefore), 'Reference refresh changed availability without an asset delivery');
const quality = json('docs/rift-dossiers/character-reference-quality.json');
assert.equal(quality.summary.uniqueReferencePathCount, 1912);
const qualityByPath = new Map(quality.referenceFiles.map(record => [record.path, record]));
const bound = references.map(record => {
  const classified = qualityByPath.get(record.sheet); assert.ok(classified, record.id);
  assert.equal(classified.metrics.fileSha256, record.sha256, record.id);
  assert.equal(classified.classification, 'approved', record.id + ': actual quality audit requires review');
  return { ...record, classification: classified.classification };
});
const result = { schemaVersion: 1, success: true, startedAt, finishedAt: new Date().toISOString(),
  timing: 'All five real steps complete before the production freeze; no post-freeze write phase exists.',
  steps, references: bound, sourceFilesBefore: before, sourceFilesAfter: before, sourceFilesUnchanged: true,
  historicalPythonAndThresholdsUnchanged: true, availabilityUnchanged: true, outputsBefore,
  outputsAfter: Object.fromEntries(generated.map(file => [file, fingerprint(file)])),
  qualityBindsCurrentReferenceHashes: true, source1to1Verified: false };
writeReports([[resultPath, result]]);
console.log(JSON.stringify({ success: true, steps: steps.length, references: bound.length, availabilityUnchanged: true }));
