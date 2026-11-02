// Prepared before the production freeze. No source or evidence is repaired here.
// Only the two final validation reports are written after every barrier passes.
import assert from 'node:assert/strict';
import { requiredProofDomains } from './build-browser-checks.mjs';
import { root, prefix, previousPrefix, read, json, sha, fingerprint, verifyFile,
  verifyHashes, historicalBaseline, effectiveBatchPlan, validateFreeze,
  assertDeliveryReady, writeReports, time, sorted, expected } from './closure-support.mjs';

assert.ok(process.argv.includes('--after-build-exit-0'));
const startedAt = new Date().toISOString();
const { baseline, validation: previousValidation } = historicalBaseline();
const freeze = validateFreeze(), plan = effectiveBatchPlan();
const auditBytes = read(prefix + 'current.json'), audit = JSON.parse(auditBytes);
assertDeliveryReady(audit); verifyHashes(audit.inputHashes);
const self = fingerprint(prefix + 'validate-final-artifacts.mjs');
assert.equal(audit.inputHashes[self.path], self.sha256, 'Verifier must be bound before building');
assert.equal(freeze.files[self.path], self.sha256, 'Verifier must be frozen before all final proofs');

const buildBytes = read(prefix + 'build-exit.json'), build = JSON.parse(buildBytes);
const logBytes = read(prefix + 'build.log');
const log = logBytes.toString().replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), '');
assert.deepEqual(build.command, ['npm', 'run', 'build']);
assert.equal(build.receiptOrigin, 'node-child-process-close-event');
assert.equal(build.exitCode, 0); assert.equal(build.signal, null); assert.equal(build.spawnError, null);
assert.equal(build.log, prefix + 'build.log'); assert.equal(build.logSha256, sha(logBytes));
assert.equal(build.auditSha256, sha(auditBytes)); assert.equal(build.auditSha256After, sha(auditBytes));
assert.equal(build.auditUnchangedDuringBuild, true); assert.equal(build.frozenInputsUnchanged, true);
assert.equal(build.frozenInputFailure, null);
assert.ok(time(freeze.createdAt) <= time(build.startedAt));
assert.ok(time(build.startedAt) <= time(build.finishedAt));

// Derive every required Node test group from the actual frozen npm lifecycle.
const packageJson = json('package.json');
function testCommands(name, parents = []) {
  assert.ok(!parents.includes(name), 'Cyclic npm script: ' + name);
  assert.equal(typeof packageJson.scripts[name], 'string', name);
  return packageJson.scripts[name].split('&&').flatMap(raw => {
    const command = raw.trim(), child = command.match(/^npm run ([\w:.-]+)(?:\s|$)/);
    if (child) return testCommands(child[1], [...parents, name]);
    return /^node\s/.test(command) && (/\s--test(?:\s|=|$)/.test(command)
      || /\s[^\s]+\.test\.m?js(?:\s|$)/.test(command)) ? [command] : [];
  });
}
const requiredTestCommands = testCommands('prebuild');
const metric = name => [...log.matchAll(new RegExp('(?:ℹ |# )' + name + ' (\\d+)', 'g'))].map(match => Number(match[1]));
const counts = metric('tests');
assert.ok(requiredTestCommands.length > 0); assert.equal(counts.length, requiredTestCommands.length);
assert.deepEqual(metric('pass'), counts); assert.deepEqual(metric('fail'), counts.map(() => 0));
for (const name of ['cancelled', 'skipped', 'todo']) assert.deepEqual(metric(name), counts.map(() => 0), name);
assert.ok(counts.every(count => count > 0)); assert.match(log, /built in \d+(?:\.\d+)?s/);
assert.equal(log.includes('✖ failing tests'), false);

const staticChecks = json(prefix + 'static-check-results.json'); assert.equal(staticChecks.passed, true);
for (const [name, command] of [['lint', ['npm', 'run', 'lint']], ['diffCheck', ['git', 'diff', '--check']],
  ['nativeAnchorsC', ['node', 'scripts/buildCombatNativeSuperAnchorsWave16PartC.mjs', '--check']]]) {
  const record = staticChecks[name]; assert.deepEqual(record.command, command);
  assert.equal(record.exitCode, 0); assert.equal(record.signal, null); assert.equal(record.spawnError, null);
  assert.equal(sha(read(prefix + record.log)), record.logSha256);
  assert.ok(time(freeze.createdAt) <= time(record.startedAt));
  assert.ok(time(record.startedAt) <= time(record.finishedAt));
  assert.ok(time(record.finishedAt) <= time(build.startedAt));
}

const browserBytes = read(prefix + 'browser-checks.json'), browser = JSON.parse(browserBytes);
assert.equal(browser.passed, true); assert.equal(browser.observedInternalRuntimeErrors, 0);
assert.deepEqual(sorted(browser.checks.map(row => row.domain)), sorted(requiredProofDomains));
assert.equal(new Set(browser.checks.map(row => row.domain)).size, browser.checks.length);
assert.ok(browser.verifiedFiles.length > 0); browser.verifiedFiles.forEach(verifyFile);
for (const record of browser.checks) {
  const file = record.reportPath || record.path;
  assert.ok(file, record.domain + ': proof path missing');
  assert.equal(sha(read(file)), record.reportSha256 || record.sha256, record.domain);
}
verifyFile(browser.productionFreeze);
assert.equal(browser.productionFreeze.sha256, sha(read(prefix + 'production-freeze.json')));
assert.ok(time(browser.generatedAt) >= time(freeze.createdAt));
assert.ok(time(browser.generatedAt) <= time(build.startedAt));

// The refresh is a real five-process sequence completed before the freeze.
const refreshPath = prefix + 'rift-refresh/result.json', refresh = json(refreshPath);
assert.equal(refresh.success, true); assert.equal(refresh.sourceFilesUnchanged, true);
assert.equal(refresh.historicalPythonAndThresholdsUnchanged, true);
assert.equal(refresh.availabilityUnchanged, true); assert.equal(refresh.qualityBindsCurrentReferenceHashes, true);
verifyHashes(refresh.sourceFilesAfter); assert.deepEqual(refresh.sourceFilesBefore, refresh.sourceFilesAfter);
Object.values(refresh.outputsAfter).forEach(verifyFile); verifyFile(freeze.riftReceipt);
assert.equal(freeze.riftReceipt.sha256, sha(read(refreshPath)));
const commands = [
  ['node', 'scripts/buildRiftDossierCatalog.mjs', '--refresh-character-reference-audit'],
  ['python', 'scripts/auditCharacterReferenceQuality.py'],
  ['node', 'scripts/buildRiftDossierCatalog.mjs'], ['node', 'scripts/buildRiftDossierAssetRegistry.mjs'],
  ['npm', 'run', 'rift:audit']
];
assert.equal(refresh.steps.length, commands.length);
for (const [index, record] of refresh.steps.entries()) {
  assert.deepEqual(record.argv, commands[index]); assert.equal(record.exitCode, 0);
  assert.equal(record.signal, null); assert.equal(record.spawnError, null);
  assert.equal(record.receiptOrigin, 'node-child-process-close-event');
  assert.equal(sha(read(record.log)), record.logSha256);
  assert.ok(time(record.startedAt) <= time(record.finishedAt));
  if (index) assert.ok(time(refresh.steps[index - 1].finishedAt) <= time(record.startedAt));
}
assert.ok(time(refresh.startedAt) <= time(refresh.steps[0].startedAt));
assert.ok(time(refresh.steps.at(-1).finishedAt) <= time(refresh.finishedAt));
assert.ok(time(refresh.finishedAt) <= time(freeze.createdAt));
const beforeRift = json(prefix + 'baseline-rift-before.json');
for (const file of ['scripts/auditCharacterReferenceQuality.py', 'scripts/buildRiftDossierCatalog.mjs', 'scripts/buildRiftDossierAssetRegistry.mjs']) {
  const old = beforeRift.files.find(row => row.path === file); assert.ok(old); verifyFile(old);
}
const quality = json('docs/rift-dossiers/character-reference-quality.json');
assert.equal(quality.summary.uniqueReferencePathCount, 1912);
const qualityByPath = new Map(quality.referenceFiles.map(row => [row.path, row]));
assert.equal(refresh.references.length, 120);
assert.deepEqual(sorted(refresh.references.map(row => row.id)), sorted(audit.batch.actualCharacterIds));
for (const row of refresh.references) {
  verifyFile(row); const current = qualityByPath.get(row.sheet); assert.ok(current, row.id);
  assert.equal(current.metrics.fileSha256, row.sha256); assert.equal(current.classification, 'approved');
  assert.equal(row.classification, current.classification);
}

const deliveryPath = prefix + 'deliverables.json', delivery = json(deliveryPath);
assert.equal(delivery.preliminary, false); assert.equal(delivery.phase, 'final');
assert.equal(delivery.readiness.ready, true); assert.equal(delivery.source1to1Verified, false);
verifyFile(delivery.productionFreeze); assert.equal(delivery.productionFreeze.sha256, sha(read(prefix + 'production-freeze.json')));
assert.ok(time(delivery.startedAt) >= time(freeze.createdAt));
assert.ok(time(delivery.finishedAt) <= time(build.startedAt));
assert.deepEqual(delivery.missingNativeIds, []); assert.deepEqual(delivery.missingBaseIds, []);
assert.deepEqual(delivery.duplicateRetainedCells, []);
assert.equal(delivery.completeNative32.length, 120); assert.equal(delivery.base16.length, 120);
assert.equal(delivery.full45.length, 1); assert.equal(delivery.full45[0].id, expected.full45);
assert.equal(delivery.rosterPerformers16.length, 6); assert.equal(delivery.sourceEntities16.length, 1);
assert.equal(delivery.action16.length, 1); assert.equal(delivery.action16[0].heroId, 'kirito_sao');
assert.equal(delivery.persistentProtection16.length, 1);
for (const rows of [delivery.completeNative32, delivery.base16]) {
  assert.deepEqual(sorted(rows.map(row => row.heroId)), sorted(audit.batch.actualCharacterIds));
}
const poses = 120 * 32 + 120 * 16 + 180 + 7 * 16 + 16 + 16;
assert.equal(delivery.newPoses, poses); assert.equal(delivery.nativeRgbaCellsChecked, poses);
assert.equal(delivery.globallyDistinctNativeRgbaCells, poses);
assert.equal(delivery.pngProofs.reduce((sum, row) => sum + row.usedCellCount, 0), poses);
assert.equal(delivery.newPngFiles, 255); assert.equal(delivery.pngProofs.length, 255);
for (const row of delivery.pngProofs) { verifyFile(row); verifyFile(row.registry); }
for (const row of [...delivery.sourceProofs, ...delivery.provenanceAndReceiptProofs, ...delivery.inputProofs]) verifyFile(row);
assert.deepEqual(delivery.preProductionAmendments, plan.withheld);
for (const decision of plan.withheld) {
  verifyFile(decision.refusal); const bytes = read(decision.refusal.path).toString();
  assert.ok(bytes.includes(decision.refusal.requestId) && bytes.includes('moderation_blocked'));
  assert.equal(delivery.completeNative32.some(row => row.heroId === decision.withheldId), false);
  assert.equal(delivery.base16.some(row => row.heroId === decision.withheldId), false);
}
const starfireRpg = json(prefix + 'rpg-tool-receipts/starfire-result.json');
const starfireNativeRefusal = json(prefix + 'part-c/sources/starfire_tt-failed-result.json');
assert.ok(time(starfireRpg.observedAt) < time(starfireNativeRefusal.finishedAt),
  'The legitimate separate RPG drawing must precede the observed native48 refusal');
assert.equal(starfireNativeRefusal.imageReturned, false);
assert.equal(starfireNativeRefusal.retried, false);

// Every public image must be the same actual PNG in dist and both HTTP clients.
const proofPath = prefix + 'browser/production-assets-http.json', proofBytes = read(proofPath), proof = JSON.parse(proofBytes);
assert.equal(proof.passed, true); assert.equal(proof.rootMounted, true); assert.deepEqual(proof.pageErrors, []);
assert.equal(proof.allBrowserWindowsClosed, true); assert.ok(time(proof.browserClosedAt) <= time(proof.finishedAt));
assert.equal(proof.buildReceipt, prefix + 'build-exit.json'); assert.equal(proof.buildReceiptSha256, sha(buildBytes));
assert.equal(proof.auditSha256, sha(auditBytes)); assert.equal(proof.publicDistHttpBytesIdentical, true);
assert.ok(time(proof.startedAt) >= time(build.finishedAt)); assert.ok(time(proof.finishedAt) <= time(startedAt));
assert.equal(proof.registryCount, audit.assetInventory.registryFiles);
assert.equal(proof.uniquePngCount, audit.assetInventory.deliveredUniquePngFiles);
assert.equal(proof.localFullDecodeCount, proof.uniquePngCount); assert.equal(proof.browserDecodeCount, proof.uniquePngCount);
assert.equal(proof.historicalImagesPreserved, 982); assert.equal(proof.historicalRegistryCount, 127);
const assets = proof.assets.map(row => {
  const publicBytes = read('public' + row.sheet), distBytes = read('dist' + row.sheet);
  assert.deepEqual(publicBytes, distBytes); assert.equal(sha(distBytes), row.sha256);
  assert.equal(distBytes.readUInt32BE(16), row.width); assert.equal(distBytes.readUInt32BE(20), row.height);
  assert.ok([4, 6].includes(distBytes[25]));
  return { sheet: row.sheet, sha256: row.sha256, bytes: distBytes.length,
    width: row.width, height: row.height, registry: row.registries[0] };
});
assert.deepEqual(sorted(assets.map(row => row.sheet)), sorted(audit.assetInventory.sheets));
assert.equal(new Set(assets.map(row => row.sheet)).size, assets.length);
for (const old of previousValidation.distAssets) {
  const row = assets.find(row => row.sheet === old.sheet); assert.ok(row);
  for (const key of ['sha256', 'width', 'height']) assert.equal(row[key], old[key], old.sheet);
}
const newAssets = assets.filter(row => !baseline.assetInventory.sheets.includes(row.sheet));
assert.deepEqual(sorted(newAssets.map(row => row.sheet)), sorted(delivery.sheets));
assert.equal(newAssets.length, 255);

// Last read-only barrier; no concurrent edit can be hidden by earlier checks.
historicalBaseline(); validateFreeze(); verifyHashes(audit.inputHashes);
assert.deepEqual(read(prefix + 'current.json'), auditBytes);
assert.deepEqual(read(prefix + 'build-exit.json'), buildBytes);
assert.deepEqual(read(proofPath), proofBytes); assert.deepEqual(read(prefix + 'browser-checks.json'), browserBytes);
const testsPassed = counts.reduce((sum, count) => sum + count, 0);
const result = { schemaVersion: 2, wave: 16, date: '2026-10-28', passed: true,
  verifiedAt: new Date().toISOString(), batchCharacters: 120, reviewedIdentities: plan.reviewedIds.length,
  testsPassed, testsFailed: 0, testSuites: counts.length, suiteTestCounts: counts, requiredTestCommands,
  tests: { total: testsPassed, passed: testsPassed, failed: 0 },
  build: { ...build, receipt: fingerprint(prefix + 'build-exit.json') }, lint: staticChecks.lint, diffCheck: staticChecks.diffCheck,
  deliveredThisWave: { completeNative32Heroes: 120, base16Heroes: 120, full45Heroes: [expected.full45],
    rosterReinforcement16Atlases: 6, sourceEntity16Atlases: 1, action16Atlases: 1, persistentProtection16Atlases: 1,
    usedNativePoses: poses, newPngFiles: newAssets.length,
    newTacticsBattlefields: 4, newTerrainMaterials: 8, newStageMechanisms: 10, newStageUniverses: 2 },
  unresolvedThisBatch: { missingEffectiveNative32HeroIds: [], missingEffectiveBase16HeroIds: [],
    withheldOriginalIdentities: plan.withheld, historicalFallbacksCountAsNewDrawings: false,
    starfireRpg16PrecedesSeparateNative48Refusal: true, source1to1Verified: false },
  browserChecks: 'browser-checks.json', browserChecksSha256: sha(browserBytes),
  browserDomains: browser.checks.map(row => row.domain),
  deliverables: fingerprint(deliveryPath), productionHttpProof: fingerprint(proofPath),
  riftReferenceRefresh: { ...fingerprint(refreshPath), sourceFilesUnchanged: true, availabilityUnchanged: true,
    qualityBindsCurrentReferenceHashes: true, completedBeforeFreeze: true, references: refresh.references },
  distAssetCount: assets.length, distRegistryCount: proof.registryCount, distAssets: assets,
  previousPngFilesPreserved: 982, previousRegistryFilesPreserved: 127,
  previousWaveValidation: fingerprint(previousPrefix + 'validation.json'),
  currentAuditSha256: sha(auditBytes), frozenInputHashCount: Object.keys(audit.inputHashes).length,
  frozenInputHashesMatch: true, source1to1Verified: false,
  productionFreeze: { ...fingerprint(prefix + 'production-freeze.json'), createdAt: freeze.createdAt,
    frozenFiles: Object.keys(freeze.files).length, allHashesMatch: true, permittedShaTransitions: 0 },
  finalizer: { ...self, frozenBeforeBuild: true, postBuildSourceAdapterNeeded: false }, workspace: root };
const markdown = '# Validation finale du lot 16\n\n'
  + `Le vrai \`npm run build\` a terminé avec le code **0** : **${testsPassed} tests dans ${counts.length} groupes** passent, sans échec, annulation ni test ignoré. Lint et contrôle des espaces passent.\n\n`
  + `Livraison mesurée : **120 présentations32**, **120 bases16**, **Senua45/180 poses**, **6 renforts RPG16 + Fox Devil16**, **Kirito16**, **Shield Pal autonome16** ; **${poses} poses dans ${newAssets.length} nouveaux PNG**. Les ${assets.length} PNG de production sont identiques dans public, dist et HTTP et se décodent dans Chromium. Les 982 PNG et 127 registres antérieurs sont préservés.\n\n`
  + 'Les cartes Tactics comptent 19 terrains verticaux, dont 16 secteurs d’univers, avec 42 matériaux. Dix mécanismes de scène s’ajoutent ; les mécaniques et commandes particulières sont vérifiées dans les moteurs et les deux camps.\n\n'
  + 'Les quatre identités initiales suspendues restent documentées : John Wick, Robin, Raven et Starfire. Leurs anciens dessins ne comptent pas comme nouvelles poses. Les deux annexes ajoutent Tank, MEIKO, KAITO et l’Oracle pour conserver trois lots effectifs de 40. Le Starfire RPG16 a été généré avant son refus natif48 distinct.\n\n'
  + '**Fidélité officielle 1:1 certifiée : false.** Les versions, équipements et limites des adaptations sont documentés.\n\n'
  + '[Livraisons](deliverables.json) · [Navigateur](browser-checks.json) · [Build](build-exit.json) · [HTTP](browser/production-assets-http.json) · [Tactics](../tactics-universes-2026-10-28/README.md).\n';
writeReports([[prefix + 'validation.json', result], [prefix + 'validation.md', markdown]]);
console.log(JSON.stringify({ passed: true, checkOnly: process.argv.includes('--check-only'),
  tests: testsPassed, groups: counts.length, poses, newPng: newAssets.length, images: assets.length }));
