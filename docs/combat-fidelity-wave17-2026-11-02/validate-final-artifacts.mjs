// Read-only barriers first; final JSON/Markdown are the only optional writes.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requiredProofDomains, collectBrowserChecks, time, sorted } from './build-browser-checks.mjs';
import { staticCommands } from './run-static-checks.mjs';
import { validateRiftPendingPathCorrectionPlan, inspectRiftAvailabilityAgainstPublished } from './run-rift-refresh.mjs';
import { prefix, root, read, json, sha, fingerprint, verifyFile, historicalBaseline,
  effectiveBatchPlan, validateFreeze, assertDeliveryReady, validateInventory, writeReports } from './closure-support.mjs';

const hashes = value => { assert.ok(value && Object.keys(value).length); for (const [path, sha256] of Object.entries(value)) verifyFile({ path, sha256 }); };
function observedProcess(record, command, start, end) {
  assert.deepEqual(record.command ?? record.argv, command); assert.equal(record.exitCode, 0); assert.equal(record.signal, null); assert.equal(record.spawnError, null);
  assert.equal(record.receiptOrigin, 'node-child-process-close-event'); assert.ok(Number.isInteger(record.processId) && record.processId > 0, 'Missing actual child PID');
  assert.equal(sha(read(record.log)), record.logSha256); assert.ok(time(record.startedAt) >= time(start));
  assert.ok(time(record.finishedAt) >= time(record.startedAt)); assert.ok(time(record.finishedAt) <= time(end));
}
export function requiredNodeTestCommands(packageJson) {
  function expand(name, parents = []) {
    assert.ok(!parents.includes(name), 'Cyclic npm lifecycle: ' + name); const source = packageJson.scripts[name]; assert.equal(typeof source, 'string', name);
    return source.split('&&').flatMap(raw => {
      const command = raw.trim(), child = command.match(/^npm run ([\w:.-]+)(?:\s|$)/);
      if (child) return expand(child[1], [...parents, name]);
      return /^node\s/.test(command) && (/\s--test(?:\s|=|$)/.test(command) || /\s[^\s]+\.test\.m?js(?:\s|$)/.test(command)) ? [command] : [];
    });
  }
  return [...(packageJson.scripts.prebuild ? expand('prebuild') : []), ...expand('build')];
}
export function validateFinalArtifacts() {
  const startedAt = new Date().toISOString(), { baseline, preservation } = historicalBaseline(), freeze = validateFreeze(), plan = effectiveBatchPlan();
  const freezeProof = fingerprint(prefix + 'production-freeze.json'), self = fingerprint(prefix + 'validate-final-artifacts.mjs');
  assert.equal(freeze.files[self.path], self.sha256); assert.deepEqual(freeze.permittedPostBrowserShaTransitions, []);
  assert.equal(plan.reviewedIds.length, 125); assert.equal(plan.withheld.length, 5); assert.equal(plan.amendments.length, 4);
  for (const [group, count] of [['pngFiles', 1237], ['registries', 138], ['historicalReports', 13197]]) {
    assert.equal(Object.keys(preservation[group]).length, count); hashes(preservation[group]);
  }
  const unionPath = prefix + 'proof-source-union.json', union = json(unionPath);
  assert.equal(union.wave, 17); assert.ok(time(union.createdAt) <= time(freeze.createdAt));
  assert.equal(union.fileCount, Object.keys(union.files).length); assert.equal(union.filesSha256, sha(Buffer.from(JSON.stringify(union.files))));
  assert.equal(freeze.files[unionPath], sha(read(unionPath))); for (const [file, digest] of Object.entries(union.files)) assert.equal(freeze.files[file], digest, file + ': union was not frozen');
  const auditBytes = read(prefix + 'current.json'), audit = JSON.parse(auditBytes), completionBytes = read(prefix + 'completion-current.json'), completion = JSON.parse(completionBytes);
  assertDeliveryReady(audit); validateInventory(audit); hashes(audit.inputHashes);
  assert.equal(audit.scope.heroes, 1911); assert.equal(audit.scope.universes, 525); assert.equal(audit.scope.abilitySlots, 5733);
  for (const [key, count] of Object.entries({ authoredHeroes: 1662, authoredSlots: 4911, completeThreeSlotKits: 1618, partialSlotKits: 44 })) assert.equal(audit.abilities[key], count, key);
  assert.equal(audit.scope.abilitySlots - audit.abilities.authoredSlots, 822);
  assert.equal(audit.abilities.effectiveStrictGenericSlots, 0);
  assert.equal(audit.abilities.authoredSlots - baseline.abilities.authoredSlots, 261);
  assert.equal(audit.batch.newlyAuthoredAbilityIds.length, 80); assert.equal(audit.batch.revisedAbilityIds.length, 45);
  assert.equal(audit.meleeBindings.nativePresentationHeroes, 666); assert.equal(audit.meleeBindings.nativePartialPresentationHeroes, 2);
  assert.equal(audit.baseSpriteCorrections.heroes, 614); assert.equal(audit.meleeBindings.fullDetailedMeleeManifestHeroes.length, 18);
  assert.equal(audit.entities.nativeAnimationAtlases, 68); assert.equal(audit.actions.nativeAction16Atlases, 2); assert.equal(audit.actions.nativeActionPoses, 32);
  assert.equal(audit.tacticsTerrain.universeBattlefields, 20); assert.equal(audit.tacticsTerrain.uniqueTopologyCount, 23);
  assert.equal(audit.stages.sceneMechanismDefinitions, 445); assert.equal(audit.stages.rosterUniversesWithSceneMechanismDefinition, 220);
  assert.equal(audit.assetInventory.deliveredUniquePngFiles, 1491); assert.equal(audit.assetInventory.registryFiles, 149);
  assert.equal(completion.wave, 17); assert.equal(completion.date, '2026-11-02');
  assert.equal(completion.current.heroes, 1911); assert.equal(completion.current.universes, 525); assert.equal(completion.current.supers, 1911);
  assert.equal(completion.current.genericCapabilities, 0); assert.equal(completion.current.missingEntityProfiles, 0); assert.equal(completion.current.unconfiguredAtmospheres, 0);
  assert.equal(completion.fidelity.canonicalVisualFidelityCertified, false);

  const buildBytes = read(prefix + 'build-exit.json'), build = JSON.parse(buildBytes), logBytes = read(prefix + 'build.log');
  assert.deepEqual(build.command, ['npm', 'run', 'build']); assert.equal(build.receiptOrigin, 'node-child-process-close-event');
  assert.ok(Number.isInteger(build.processId) && build.processId > 0, 'Missing actual npm run build child PID');
  assert.equal(build.exitCode, 0); assert.equal(build.signal, null); assert.equal(build.spawnError, null);
  assert.equal(build.log, prefix + 'build.log'); assert.equal(build.logSha256, sha(logBytes));
  assert.equal(build.auditSha256, sha(auditBytes)); assert.equal(build.auditSha256After, sha(auditBytes));
  assert.equal(build.auditUnchangedDuringBuild, true); assert.equal(build.frozenInputsUnchanged, true); assert.equal(build.frozenInputError, null);
  verifyFile(build.productionFreeze); assert.equal(build.productionFreeze.sha256, freezeProof.sha256);
  assert.ok(time(build.startedAt) >= time(freeze.createdAt)); assert.ok(time(build.finishedAt) >= time(build.startedAt));
  const packageJson = json('package.json'), requiredTestCommands = requiredNodeTestCommands(packageJson);
  const log = logBytes.toString().replace(/\x1b\[[0-9;]*m/g, '');
  const metric = name => [...log.matchAll(new RegExp('^(?:#|ℹ) ' + name + '\\s+(\\d+)', 'gm'))].map(m => Number(m[1]));
  const counts = metric('tests'), testsPassed = counts.reduce((a, b) => a + b, 0);
  assert.ok(counts.length >= 18 && testsPassed > 2076); assert.equal(counts.length, requiredTestCommands.length, 'Every frozen Node test invocation must have its observed TAP summary');
  assert.ok(counts.every(n => n > 0)); assert.deepEqual(metric('pass'), counts);
  for (const key of ['fail', 'cancelled', 'skipped', 'todo']) assert.deepEqual(metric(key), counts.map(() => 0), key);
  assert.equal(build.tests.tests, testsPassed); assert.equal(build.tests.pass, testsPassed); assert.equal(build.tests.nodeTestGroups, counts.length); assert.deepEqual(build.tests.groups, counts);
  assert.match(log, /built in \d+(?:\.\d+)?s/); assert.equal(log.includes('✖ failing tests'), false);

  const staticChecks = json(prefix + 'static-check-results.json'); assert.equal(staticChecks.passed, true); assert.equal(staticChecks.frozenInputsUnchanged, true);
  verifyFile(staticChecks.productionFreeze); assert.equal(staticChecks.productionFreeze.sha256, freezeProof.sha256);
  for (const [name, command] of staticCommands) observedProcess(staticChecks[name], command, freeze.createdAt, build.startedAt);
  const browserBytes = read(prefix + 'browser-checks.json'), browser = JSON.parse(browserBytes), observedBrowser = collectBrowserChecks();
  assert.equal(browser.passed, true); assert.equal(browser.preliminary, false); assert.equal(browser.observedInternalRuntimeErrors, 0);
  assert.deepEqual(sorted(browser.checks.map(r => r.domain)), sorted(requiredProofDomains)); assert.equal(browser.checks.length, 10);
  assert.deepEqual(browser.checks, observedBrowser.checks); assert.deepEqual(browser.verifiedFiles, observedBrowser.verifiedFiles);
  const runtimeMetrics = browser.checks.find(row => row.domain === '120-character-authoritative-runtime').metrics;
  assert.equal(runtimeMetrics.cases, 720); assert.equal(runtimeMetrics.committedCasts, 718); assert.equal(runtimeMetrics.conditionallyUnavailableCases, 2);
  assert.equal(browser.productionFreeze.sha256, freezeProof.sha256); assert.ok(time(browser.generatedAt) <= time(build.startedAt));
  for (const record of browser.checks) assert.ok(time(record.finishedAt) <= time(browser.generatedAt));

  const refreshPath = prefix + 'rift-refresh/result.json', refresh = json(refreshPath);
  assert.equal(freeze.files[refreshPath], sha(read(refreshPath)), 'The actual refresh receipt must be frozen before final browser execution');
  assert.equal(refresh.schemaVersion, 2);
  for (const key of ['success', 'sourceFilesUnchanged', 'historicalPythonAndThresholdsUnchanged', 'availabilityUnchanged', 'availableAssetPathsUnchanged', 'qualityBindsCurrentReferenceHashes', 'pendingCorrectionAlreadyPresentBeforeThisRun']) assert.equal(refresh[key], true);
  assert.deepEqual(refresh.sourceFilesBefore, refresh.sourceFilesAfter); hashes(refresh.sourceFilesAfter); Object.values(refresh.outputsAfter).forEach(verifyFile);
  const correction = validateRiftPendingPathCorrectionPlan(), availability = inspectRiftAvailabilityAgainstPublished(json('src/game/riftDossierAssets.json'), correction);
  assert.deepEqual(refresh.pendingAssetPathCorrectionPlan, correction.proof); assert.deepEqual(refresh.correctionPlan, correction.proof);
  assert.deepEqual(refresh.publishedAvailabilityBaseline, correction.plan.publishedRegistry); assert.deepEqual(refresh.comparisonBaseline, correction.plan.publishedRegistry);
  assert.deepEqual(refresh.publishedAvailabilityOrigin, correction.plan.publishedRegistryOrigin); assert.deepEqual(refresh.publishedWave16Audit, correction.plan.publishedWave16Audit);
  assert.ok(time(correction.plan.createdAt) < time(refresh.startedAt), 'The one pending path correction must be planned before the actual rerun');
  for (const [key, value] of Object.entries(availability)) assert.deepEqual(refresh[key], value, key);
  assert.deepEqual(refresh.availabilityBefore, availability); assert.deepEqual(refresh.pendingAssetPathCorrectionsDuringThisRun, []);
  const archive = json(correction.plan.failedAttemptArchive.path), archivedRegistry = archive.artifacts.find(proof => proof.path.endsWith('/registry-after-failed-postflight.json'));
  assert.ok(archivedRegistry); assert.equal(refresh.outputsBefore['src/game/riftDossierAssets.json'].sha256, archivedRegistry.sha256);
  assert.equal(refresh.outputsAfter['src/game/riftDossierAssets.json'].sha256, archivedRegistry.sha256, 'The planned correction was already present before the real rerun');
  for (const proof of [correction.proof, correction.plan.publishedRegistry, correction.plan.publishedRegistryOrigin, correction.plan.publishedWave16Audit,
    correction.plan.failedAttemptArchive, ...archive.artifacts, refresh.progressReceipt]) {
    verifyFile(proof); assert.equal(freeze.files[proof.path], proof.sha256, proof.path + ': Rift provenance was not frozen');
  }
  const progress = json(refresh.progressReceipt.path); assert.equal(progress.phase, 'completed'); assert.equal(progress.startedAt, refresh.startedAt);
  assert.deepEqual(progress.steps, refresh.steps); assert.deepEqual(progress.sourceFilesBefore, refresh.sourceFilesBefore);
  assert.deepEqual(progress.pendingAssetPathCorrectionPlan, correction.proof); assert.ok(time(progress.updatedAt) >= time(refresh.finishedAt));
  const commands = [['node', 'scripts/buildRiftDossierCatalog.mjs', '--refresh-character-reference-audit'], ['python', 'scripts/auditCharacterReferenceQuality.py'],
    ['node', 'scripts/buildRiftDossierCatalog.mjs'], ['node', 'scripts/buildRiftDossierAssetRegistry.mjs'], ['npm', 'run', 'rift:audit']];
  assert.equal(refresh.steps.length, 5);
  for (const [i, record] of refresh.steps.entries()) { observedProcess(record, commands[i], i ? refresh.steps[i - 1].finishedAt : refresh.startedAt, refresh.finishedAt); }
  assert.ok(time(refresh.finishedAt) <= time(freeze.createdAt));
  const beforeRift = json(prefix + 'baseline-rift-before.json');
  for (const file of ['scripts/auditCharacterReferenceQuality.py', 'scripts/buildRiftDossierCatalog.mjs', 'scripts/buildRiftDossierAssetRegistry.mjs']) { const proof = beforeRift.files.find(r => r.path === file); assert.ok(proof); verifyFile(proof); }
  const quality = json('docs/rift-dossiers/character-reference-quality.json'), byPath = new Map(quality.referenceFiles.map(r => [r.path, r]));
  assert.equal(quality.summary.uniqueReferencePathCount, 1912); assert.equal(refresh.references.length, 120);
  assert.deepEqual(sorted(refresh.references.map(r => r.id)), sorted(audit.batch.actualCharacterIds));
  for (const row of refresh.references) { verifyFile(row); assert.equal(byPath.get(row.sheet)?.metrics.fileSha256, row.sha256); assert.equal(byPath.get(row.sheet)?.classification, 'approved'); }

  const deliveryPath = prefix + 'deliverables.json', delivery = json(deliveryPath);
  assert.equal(delivery.preliminary, false); assert.equal(delivery.phase, 'final'); assert.equal(delivery.readiness.ready, true); assert.equal(delivery.source1to1Verified, false);
  verifyFile(delivery.productionFreeze); assert.equal(delivery.productionFreeze.sha256, freezeProof.sha256);
  assert.ok(time(delivery.startedAt) >= time(freeze.createdAt)); assert.ok(time(delivery.finishedAt) <= time(build.startedAt));
  for (const key of ['missingNativeIds', 'missingBaseIds', 'duplicateRetainedCells']) assert.deepEqual(delivery[key], []);
  assert.equal(delivery.completeNative32.length, 120); assert.equal(delivery.base16.length, 120);
  assert.equal(delivery.full45.length, 1); assert.equal(delivery.full45[0].id, 'beyond_good_evil_jade');
  assert.equal(delivery.rosterPerformers16.length, 6); assert.equal(delivery.sourceEntities16.length, 0);
  assert.equal(delivery.action16.length, 1); assert.equal(delivery.action16[0].heroId, 'beyond_good_evil_jade');
  assert.equal(delivery.sourceNpc16.length, 1); assert.equal(delivery.counts.sourceNpc16, 1);
  for (const rows of [delivery.completeNative32, delivery.base16]) assert.deepEqual(sorted(rows.map(r => r.heroId)), sorted(audit.batch.actualCharacterIds));
  for (const key of ['newPoses', 'nativeRgbaCellsChecked', 'globallyDistinctNativeRgbaCells']) assert.equal(delivery[key], 6068);
  assert.equal(delivery.pngProofs.reduce((n, p) => n + p.usedCellCount, 0), 6068); assert.equal(delivery.newPngFiles, 254); assert.equal(delivery.pngProofs.length, 254);
  assert.equal(delivery.counts.newRegistryFiles, 11);
  for (const proof of delivery.pngProofs) { verifyFile(proof); verifyFile(proof.registry); }
  for (const proof of [...delivery.sourceProofs, ...delivery.provenanceAndReceiptProofs, ...delivery.inputProofs]) verifyFile(proof);
  assert.deepEqual(delivery.preProductionAmendments, plan.withheld);
  for (const decision of plan.withheld) {
    verifyFile(decision.refusal); assert.ok(read(decision.refusal.path).toString().includes('moderation_blocked'));
    assert.equal(delivery.completeNative32.some(r => r.heroId === decision.withheldId), false); assert.equal(delivery.base16.some(r => r.heroId === decision.withheldId), false);
  }

  const httpPath = prefix + 'browser/production-assets-http.json', httpBytes = read(httpPath), http = JSON.parse(httpBytes);
  assert.equal(http.passed, true); assert.equal(http.rootMounted, true); assert.deepEqual(http.pageErrors, []); assert.equal(http.allBrowserWindowsClosed, true);
  assert.ok(time(http.startedAt) >= time(build.finishedAt)); assert.ok(time(http.browserClosedAt) >= time(http.startedAt)); assert.ok(time(http.finishedAt) >= time(http.browserClosedAt)); assert.ok(time(http.finishedAt) <= time(startedAt));
  assert.equal(http.buildReceipt, prefix + 'build-exit.json'); assert.equal(http.buildReceiptSha256, sha(buildBytes)); assert.equal(http.auditSha256, sha(auditBytes));
  assert.equal(http.publicDistHttpBytesIdentical, true); assert.equal(http.browserHttpHashesMatch, true);
  assert.equal(http.registryCount, 149); assert.equal(http.uniquePngCount, 1491); assert.equal(http.localFullDecodeCount, 1491); assert.equal(http.browserDecodeCount, 1491);
  assert.equal(http.historicalImagesPreserved, 1237); assert.equal(http.historicalRegistryCount, 138); assert.equal(http.historicalRegistryMetadataBytesUnchanged, true);
  const distAssets = http.assets.map(row => {
    const publicBytes = read('public' + row.sheet), distBytes = read('dist' + row.sheet); assert.deepEqual(publicBytes, distBytes); assert.equal(sha(distBytes), row.sha256);
    assert.equal(distBytes.readUInt32BE(16), row.width); assert.equal(distBytes.readUInt32BE(20), row.height); assert.ok([4, 6].includes(distBytes[25]));
    const decoded = http.browserImages.find(p => p.sheet === row.sheet); assert.ok(decoded?.decoded); assert.equal(decoded.sha256, row.sha256); assert.equal(decoded.width, row.width); assert.equal(decoded.height, row.height);
    return { sheet: row.sheet, sha256: row.sha256, width: row.width, height: row.height, bytes: distBytes.length, registry: row.registries[0] };
  });
  assert.equal(new Set(distAssets.map(r => r.sheet)).size, 1491); assert.deepEqual(sorted(distAssets.map(r => r.sheet)), sorted(audit.assetInventory.sheets));
  assert.deepEqual(sorted(http.registries.map(r => r.file)), sorted(audit.assetInventory.registries));
  for (const record of http.registries) assert.equal(sha(read(record.file)), record.sha256);
  const oldValidation = json(prefix + 'baseline-validation-wave16.json');
  for (const old of oldValidation.distAssets) { const now = distAssets.find(r => r.sheet === old.sheet); assert.ok(now); for (const key of ['sha256', 'width', 'height']) assert.equal(now[key], old[key]); }
  const newAssets = distAssets.filter(r => !baseline.assetInventory.sheets.includes(r.sheet)); assert.equal(newAssets.length, 254); assert.deepEqual(sorted(newAssets.map(r => r.sheet)), sorted(delivery.sheets));

  historicalBaseline(); validateFreeze(); hashes(audit.inputHashes);
  for (const group of ['pngFiles', 'registries', 'historicalReports']) hashes(preservation[group]);
  for (const [file, bytes] of [[prefix + 'current.json', auditBytes], [prefix + 'completion-current.json', completionBytes], [prefix + 'build-exit.json', buildBytes], [prefix + 'build.log', logBytes], [prefix + 'browser-checks.json', browserBytes], [httpPath, httpBytes]]) assert.deepEqual(read(file), bytes, file + ': changed during final verification');
  return { schemaVersion: 3, wave: 17, date: '2026-11-02', passed: true, verifiedAt: new Date().toISOString(), workspace: root,
    batchCharacters: 120, reviewedIdentities: 125, testsPassed, testsFailed: 0, testSuites: counts.length, suiteTestCounts: counts, requiredTestCommands,
    tests: { total: testsPassed, passed: testsPassed, failed: 0 }, build: { ...build, receipt: fingerprint(prefix + 'build-exit.json') },
    staticChecks: fingerprint(prefix + 'static-check-results.json'), lint: staticChecks.lint, diffCheck: staticChecks.diffCheck,
    currentAuditSha256: sha(auditBytes), completionAudit: fingerprint(prefix + 'completion-current.json'),
    deliveredThisWave: { completeNative32Heroes: 120, base16Heroes: 120, full45Heroes: ['beyond_good_evil_jade'], rosterReinforcement16Atlases: 6,
      sourceEntity16Atlases: 0, action16Atlases: 1, sourceNpc16Atlases: 1, usedNativePoses: 6068, newPngFiles: 254, newRegistryFiles: 11,
      newlyAuthoredIdentities: 80, revisedIdentities: 45, newlyAuthoredBasicSlots: 261, newTacticsBattlefields: 4, newTerrainMaterials: 10, newStageMechanisms: 10 },
    unresolvedThisBatch: { missingEffectiveNative32HeroIds: [], missingEffectiveBase16HeroIds: [], withheldOriginalIdentities: plan.withheld, source1to1Verified: false },
    coverage: { heroes: 1911, universes: 525, authoredHeroes: 1662, authoredSlots: 4911, missingExplicitBasicSlots: 822, completeThreeSlotKits: 1618, partialSlotKits: 44, strictGenericSlots: 0 },
    browserChecks: fingerprint(prefix + 'browser-checks.json'), browserDomains: requiredProofDomains,
    authoritativeRuntime: runtimeMetrics,
    deliverables: fingerprint(deliveryPath), productionHttpProof: fingerprint(httpPath), riftReferenceRefresh: fingerprint(refreshPath),
    distAssetCount: 1491, distRegistryCount: 149, distAssets, previousPngFilesPreserved: 1237, previousRegistryFilesPreserved: 138, historicalReportFilesPreserved: 13197,
    previousWaveValidation: fingerprint(prefix + 'baseline-validation-wave16.json'), frozenInputHashesMatch: true,
    productionFreeze: { ...freezeProof, createdAt: freeze.createdAt, frozenFiles: Object.keys(freeze.files).length, allHashesMatch: true, permittedShaTransitions: 0 },
    finalizer: { ...self, frozenBeforeBuild: true }, source1to1Verified: false };
}
export function assertValidatedArtifactsCurrent() {
  const validation = json(prefix + 'validation.json'); assert.equal(validation.passed, true); assert.equal(validation.wave, 17); assert.equal(validation.build.exitCode, 0);
  validateFreeze(); assert.equal(validation.currentAuditSha256, sha(read(prefix + 'current.json')));
  for (const proof of [validation.completionAudit, validation.deliverables, validation.browserChecks, validation.productionHttpProof, validation.riftReferenceRefresh,
    validation.staticChecks, validation.build.receipt, validation.productionFreeze, validation.finalizer]) verifyFile(proof);
  assert.equal(validation.source1to1Verified, false); return validation;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.argv.includes('--after-build-exit-0'));
  const result = validateFinalArtifacts();
  if (!process.argv.includes('--check-only')) writeReports([[prefix + 'validation.json', result], [prefix + 'validation.md',
    `# Validation finale W17\n\nLe vrai npm run build termine avec le code 0 : ${result.testsPassed} tests dans ${result.testSuites} groupes. Dix domaines navigateur après gel sont liés à leurs captures réellement inspectées.\n\n120 présentations32, 120 bases16, Jade45/180 poses, 6 renforts RPG16, Gyrodisk16 et un chaton NPC16 : **6 068 poses distinctes et 254 nouveaux PNG**. Les 1 491 PNG et 149 registres sont vérifiés dans public, dist, HTTP Node et Chromium. Les 1 237 PNG, 138 registres et 13 197 rapports antérieurs sont préservés.\n\n80 identités nouvellement rédigées, 45 révisions et 261 nouvelles actions explicites ; 822 emplacements de base restent sans rédaction explicite. Ce manque est distinct du compteur strict de capacités génériques (0).\n\n**Fidélité officielle 1:1 certifiée : false.**\n`]]);
  console.log(JSON.stringify({ passed: true, checkOnly: process.argv.includes('--check-only'), tests: result.testsPassed, groups: result.testSuites, domains: result.browserDomains.length, png: result.distAssetCount }));
}
