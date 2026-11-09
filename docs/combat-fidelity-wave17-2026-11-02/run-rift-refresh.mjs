// Real sequential refresh, completed before W17 production is frozen.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HEROES_DB } from '../../src/game/heroes.js';
import { measureCombatFidelity } from '../../scripts/combatFidelityAudit.mjs';
import { root, prefix, read, json, fingerprint, sha, verifyFile, writeReports,
  historicalBaseline, effectiveBatchPlan, assertDeliveryReady } from './closure-support.mjs';

export const riftPendingPathCorrectionPlan = prefix + 'rift-refresh/pending-pomni-path-correction-before-rerun.json';
const publishedCommit = '9981b73deb3ee027c86877d7c15c6698e4f02191';
const publishedRegistrySha256 = '313258fc13043cce88bdd7cdc81bf0bd0fd50bc924215d03d803fb2275360c5a';
const publishedWave16AuditSha256 = '0778067e03aa3b5da8880d72c004f00f7659e158653027535bfc94573be88fc9';
const expectedCorrection = Object.freeze({ stageId: 9330, sourceHeroId: 'pomni', statusBefore: 'pending', statusAfter: 'pending',
  assetPathBefore: '/images/rift-dossiers/openai/arc-personnage/stage-9330-character-arc-digital-circus-v1.webp',
  assetPathAfter: '/images/rift-dossiers/openai/arc-personnage/stage-9330-character-arc-pomni-v1.webp',
  oldAssetExists: false, newAssetExists: false });
const statuses = registry => registry.entries.map(entry => [entry.stageId, entry.status]).sort((a, b) => a[0] - b[0]);
const availablePaths = registry => registry.entries.filter(entry => entry.status === 'available')
  .map(entry => [entry.stageId, entry.assetPath]).sort((a, b) => a[0] - b[0]);

export function validateRiftPendingPathCorrectionPlan() {
  const plan = json(riftPendingPathCorrectionPlan), origin = json(plan.publishedRegistryOrigin.path);
  assert.equal(plan.wave, 17); assert.equal(plan.sourceCommit, publishedCommit);
  assert.equal(plan.source1to1Verified, false); assert.ok(Number.isFinite(Date.parse(plan.createdAt)));
  assert.deepEqual(plan.allowedPendingAssetPathCorrections, [expectedCorrection]);
  for (const key of ['allStageIdsAndStatusesMustRemainUnchanged', 'allAvailableAssetPathsMustRemainUnchanged', 'allOtherPendingAssetPathsMustRemainUnchanged']) assert.equal(plan[key], true);
  assert.equal(plan.expectedEntryCount, 3199); assert.deepEqual(plan.expectedAvailabilityCounts, { available: 1030, pending: 2169 });
  assert.equal(plan.publishedRegistry.sha256, publishedRegistrySha256); verifyFile(plan.publishedRegistry);
  assert.equal(plan.publishedWave16Audit.sha256, publishedWave16AuditSha256); verifyFile(plan.publishedWave16Audit);
  verifyFile(plan.publishedRegistryOrigin); verifyFile(plan.failedAttemptArchive);
  assert.equal(origin.sourceCommit, publishedCommit); assert.equal(origin.originalRepoPath, 'src/game/riftDossierAssets.json');
  assert.deepEqual(origin.command, ['git', 'show', publishedCommit + ':src/game/riftDossierAssets.json']); assert.equal(origin.exitCode, 0);
  assert.deepEqual(origin.publishedRegistry, plan.publishedRegistry); assert.equal(origin.entryCount, 3199);
  assert.deepEqual(origin.publishedWave16Audit.baselineCopy, plan.publishedWave16Audit);
  assert.deepEqual(origin.publishedWave16Audit.command, ['git', 'show', publishedCommit + ':docs/combat-fidelity-wave16-2026-10-28/current.json']);
  assert.equal(origin.publishedWave16Audit.exitCode, 0);
  assert.deepEqual(plan.expectedSourceIdentity, { id: 'pomni', name: 'Pomni', legacyRosterName: 'Digital Circus' });
  const pomni = HEROES_DB.find(hero => hero.id === 'pomni'); assert.ok(pomni);
  for (const [key, value] of Object.entries(plan.expectedSourceIdentity)) assert.equal(pomni[key], value, 'The actual Pomni identity must remain corrected');
  assert.deepEqual(plan.observedAbsenceBeforeRerun, [expectedCorrection.assetPathBefore, expectedCorrection.assetPathAfter]
    .map(assetPath => ({ path: 'public' + assetPath, exists: false })));
  for (const assetPath of [expectedCorrection.assetPathBefore, expectedCorrection.assetPathAfter]) assert.equal(fs.existsSync(path.resolve(root, 'public' + assetPath)), false, 'Pending Pomni correction cannot move a delivered asset');
  const archive = json(plan.failedAttemptArchive.path);
  assert.equal(archive.success, false); assert.equal(archive.doNotTreatAsCompletedRefresh, true);
  assert.equal(archive.failurePhase, 'postflight-availability-assertion'); assert.equal(archive.observedPrintedCompletionLines.length, 5);
  for (const proof of archive.artifacts) verifyFile(proof);
  const published = json(plan.publishedRegistry.path);
  assert.equal(published.entries.length, 3199); assert.equal(new Set(published.entries.map(row => row.stageId)).size, 3199);
  return { plan, published, proof: fingerprint(riftPendingPathCorrectionPlan) };
}

export function inspectRiftAvailabilityAgainstPublished(registry, correction = validateRiftPendingPathCorrectionPlan()) {
  const { plan, published } = correction;
  assert.equal(registry.entries.length, plan.expectedEntryCount); assert.equal(new Set(registry.entries.map(row => row.stageId)).size, plan.expectedEntryCount);
  assert.deepEqual(statuses(registry), statuses(published), 'A Rift stage or availability status changed from the published registry');
  assert.deepEqual(availablePaths(registry), availablePaths(published), 'A delivered Rift asset path changed');
  const byStage = new Map(registry.entries.map(row => [row.stageId, row])), corrections = [];
  for (const previous of published.entries) {
    const current = byStage.get(previous.stageId);
    if (previous.assetPath === current.assetPath) continue;
    assert.equal(previous.stageId, 9330, 'An unplanned Rift path changed');
    corrections.push({ stageId: previous.stageId, sourceHeroId: 'pomni', statusBefore: previous.status, statusAfter: current.status,
      assetPathBefore: previous.assetPath, assetPathAfter: current.assetPath,
      oldAssetExists: fs.existsSync(path.resolve(root, 'public' + previous.assetPath)),
      newAssetExists: fs.existsSync(path.resolve(root, 'public' + current.assetPath)) });
  }
  assert.deepEqual(corrections, [expectedCorrection], 'Only the predeclared pending Pomni URL may differ from published W16');
  const counts = Object.fromEntries(['available', 'pending'].map(status => [status, registry.entries.filter(row => row.status === status).length]));
  assert.deepEqual(counts, plan.expectedAvailabilityCounts);
  return { availabilityUnchanged: true, availableAssetPathsUnchanged: true, pendingAssetPathCorrections: corrections,
    registryEntryCount: registry.entries.length, availableAssetCount: counts.available, pendingAssetCount: counts.pending,
    comparisonBaseline: plan.publishedRegistry, correctionPlan: correction.proof };
}

async function main() {
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
  const effectiveIds = new Set(Object.values(plan.parts).flat());
  const references = plan.heroes.filter(({ hero }) => effectiveIds.has(hero.id)).map(({ hero }) => {
    const entry = bases.get(hero.id); assert.ok(entry?.sheet.includes('wave17'), hero.id);
    return { id: hero.id, path: 'public' + entry.sheet, sheet: entry.sheet, sha256: sha(read('public' + entry.sheet)) };
  });
  const commands = [
    ['node', 'scripts/buildRiftDossierCatalog.mjs', '--refresh-character-reference-audit'],
    ['python', 'scripts/auditCharacterReferenceQuality.py'], ['node', 'scripts/buildRiftDossierCatalog.mjs'],
    ['node', 'scripts/buildRiftDossierAssetRegistry.mjs'], ['npm', 'run', 'rift:audit']
  ];
  const generated = ['docs/rift-dossiers/catalog.json', 'docs/rift-dossiers/character-reference-quality.json', 'src/game/riftDossierAssets.json'];
  const resultPath = prefix + 'rift-refresh/result.json', progressPath = prefix + 'rift-refresh/progress.json';
  assert.equal(fs.existsSync(path.resolve(root, resultPath)), false, 'Preserve an existing actual refresh before another attempt');
  assert.equal(fs.existsSync(path.resolve(root, progressPath)), false, 'Archive an earlier actual progress receipt before another attempt');
  const correction = validateRiftPendingPathCorrectionPlan(), registryBefore = json('src/game/riftDossierAssets.json');
  const availabilityBefore = inspectRiftAvailabilityAgainstPublished(registryBefore, correction);
  if (process.argv.includes('--check-only')) {
    console.log(JSON.stringify({ checkOnly: true, references: references.length, wouldRun: commands, realCommandsRun: 0, availabilityBefore }));
    return;
  }
  const directory = path.resolve(root, prefix + 'rift-refresh'); fs.mkdirSync(directory, { recursive: true });
  for (const [index] of commands.entries()) assert.equal(fs.existsSync(path.join(directory, `step-${String(index + 1).padStart(2, '0')}.log`)), false, 'Archive previous actual step logs before rerunning');
  const startedAt = new Date().toISOString(); assert.ok(Date.parse(correction.plan.createdAt) < Date.parse(startedAt));
  const trackedSources = [...scripts, 'package.json', 'package-lock.json'];
  const sourceSnapshot = () => Object.fromEntries(trackedSources.map(file => [file, sha(read(file))]));
  const before = sourceSnapshot(), outputsBefore = Object.fromEntries(generated.map(file => [file, fingerprint(file)]));
  const steps = [], receiptInputs = { schemaVersion: 2, startedAt, sourceFilesBefore: before, outputsBefore, references,
    pendingAssetPathCorrectionPlan: correction.proof, publishedAvailabilityBaseline: correction.plan.publishedRegistry,
    publishedAvailabilityOrigin: correction.plan.publishedRegistryOrigin, publishedWave16Audit: correction.plan.publishedWave16Audit,
    availabilityBefore, pendingCorrectionAlreadyPresentBeforeThisRun: true, source1to1Verified: false };
  const progress = phase => writeReports([[progressPath, { ...receiptInputs, phase, updatedAt: new Date().toISOString(), steps }]]);
  progress('starting');
  try {
    for (const [index, argv] of commands.entries()) {
      const log = prefix + `rift-refresh/step-${String(index + 1).padStart(2, '0')}.log`, commandStarted = new Date().toISOString();
      const descriptor = fs.openSync(path.resolve(root, log), 'wx'); let spawnError = null;
      const child = spawn(argv[0], argv.slice(1), { cwd: root, stdio: ['ignore', descriptor, descriptor] });
      child.once('error', error => { spawnError = error.message; });
      const observed = await new Promise(resolve => child.once('close', (exitCode, signal) => resolve({ exitCode, signal })));
      fs.closeSync(descriptor);
      steps.push({ argv, startedAt: commandStarted, finishedAt: new Date().toISOString(), ...observed, spawnError,
        processId: child.pid ?? null, receiptOrigin: 'node-child-process-close-event', log, logSha256: sha(read(log)) });
      // Persist each actual close event before postflight checks can throw.
      progress('step-' + String(index + 1).padStart(2, '0') + '-closed');
      console.log(JSON.stringify({ step: index + 1, ...steps.at(-1) }));
      assert.equal(observed.exitCode, 0, 'Rift step failed; see ' + log); assert.equal(observed.signal, null); assert.equal(spawnError, null);
    }
    const after = sourceSnapshot(); assert.deepEqual(after, before, 'Protected source or package changed during refresh');
    for (const record of references) verifyFile(record);
    const currentCorrection = validateRiftPendingPathCorrectionPlan(); assert.deepEqual(currentCorrection.proof, correction.proof);
    const registryAfter = json('src/game/riftDossierAssets.json'), availability = inspectRiftAvailabilityAgainstPublished(registryAfter, currentCorrection);
    assert.deepEqual(statuses(registryAfter), statuses(registryBefore)); assert.deepEqual(availablePaths(registryAfter), availablePaths(registryBefore));
    assert.deepEqual(registryAfter.entries, registryBefore.entries, 'The predeclared pending correction was already present; this run must not introduce another path change');
    const quality = json('docs/rift-dossiers/character-reference-quality.json'); assert.equal(quality.summary.uniqueReferencePathCount, 1912);
    const qualityByPath = new Map(quality.referenceFiles.map(record => [record.path, record]));
    const bound = references.map(record => {
      const classified = qualityByPath.get(record.sheet); assert.ok(classified, record.id);
      assert.equal(classified.metrics.fileSha256, record.sha256, record.id);
      assert.equal(classified.classification, 'approved', record.id + ': actual quality audit requires review');
      return { ...record, classification: classified.classification };
    });
    const result = { ...receiptInputs, success: true, finishedAt: new Date().toISOString(),
      timing: 'All five real steps complete before the production freeze; no post-freeze write phase exists.',
      steps, references: bound, sourceFilesAfter: after, sourceFilesUnchanged: true, historicalPythonAndThresholdsUnchanged: true,
      ...availability, pendingAssetPathCorrectionsDuringThisRun: [],
      outputsAfter: Object.fromEntries(generated.map(file => [file, fingerprint(file)])), qualityBindsCurrentReferenceHashes: true };
    progress('completed'); result.progressReceipt = fingerprint(progressPath);
    writeReports([[resultPath, result]]);
    console.log(JSON.stringify({ success: true, steps: steps.length, references: bound.length, availabilityUnchanged: true,
      availableAssetPathsUnchanged: true, pendingAssetPathCorrections: availability.pendingAssetPathCorrections }));
  } catch (error) {
    progress('failed');
    writeReports([[resultPath, { ...receiptInputs, success: false, finishedAt: new Date().toISOString(), steps,
      sourceFilesAfter: sourceSnapshot(), outputsAfter: Object.fromEntries(generated.map(file => [file, fingerprint(file)])),
      failure: error.stack || String(error), progressReceipt: fingerprint(progressPath) }]]);
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
