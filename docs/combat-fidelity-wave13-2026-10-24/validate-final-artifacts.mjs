// Freeze this verifier BEFORE the final audit/build. It only writes the two
// excluded validation reports after every real build, browser and Rift check.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../../', import.meta.url), directory = new URL('./', import.meta.url);
const prefix = 'docs/combat-fidelity-wave13-2026-10-24/';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const time = value => {
  const result = Date.parse(value);
  assert.ok(Number.isFinite(result), `Invalid execution timestamp: ${value}`);
  return result;
};
const checkHashes = (hashes, label) => {
  assert.ok(Object.keys(hashes).length > 0, label + ': no frozen source hashes');
  for (const [path, digest] of Object.entries(hashes)) assert.equal(sha(read(path)), digest, `${label}: ${path}`);
};
assert.ok(process.argv.includes('--after-build-exit-0'), 'Observe npm run build exit 0 before finalizing');
const auditBytes = read(prefix + 'current.json'), audit = JSON.parse(auditBytes);
const baseline = json(prefix + 'baseline.json');
const previousValidation = json('docs/combat-fidelity-wave12-2026-10-23/validation.json');
const frozenInputs = Object.entries(audit.inputHashes);
assert.equal(audit.inputHashes[prefix + 'validate-final-artifacts.mjs'], sha(fs.readFileSync(new URL(import.meta.url))), 'Verifier must be frozen before build');
checkHashes(audit.inputHashes, 'Changed after final audit');
for (const path of baseline.assetInventory.registries) assert.equal(sha(read(path)), baseline.inputHashes[path], path + ': historical registry changed');

const receiptBytes = read(prefix + 'build-exit.json'), receipt = JSON.parse(receiptBytes);
const buildLogBytes = read(prefix + 'build.log');
const log = buildLogBytes.toString().replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), '');
assert.deepEqual(receipt.command, ['npm', 'run', 'build']);
assert.equal(receipt.receiptOrigin, 'node-child-process-close-event');
assert.equal(receipt.exitCode, 0); assert.equal(receipt.signal, null); assert.equal(receipt.spawnError, null);
assert.equal(receipt.log, prefix + 'build.log'); assert.equal(receipt.logSha256, sha(buildLogBytes));
assert.equal(receipt.auditSha256, sha(auditBytes)); assert.equal(receipt.auditSha256After, sha(auditBytes));
assert.equal(receipt.auditUnchangedDuringBuild, true);
const buildStarted = time(receipt.startedAt), buildFinished = time(receipt.finishedAt);
assert.ok(buildStarted <= buildFinished);

// Derive required Node groups from the frozen npm prebuild, including its direct
// ocDlcCatalog.test.mjs invocation. Do not inherit W11's group/test counts.
const packageJson = json('package.json');
function requiredTestCommands(name, parents = []) {
  assert.ok(!parents.includes(name), 'Cyclic npm script: ' + name);
  assert.equal(typeof packageJson.scripts[name], 'string', 'Unknown npm script: ' + name);
  return packageJson.scripts[name].split('&&').flatMap(raw => {
    const command = raw.trim(), child = command.match(/^npm run ([\w:.-]+)(?:\s|$)/);
    if (child) return requiredTestCommands(child[1], [...parents, name]);
    return /^node\s/.test(command) && (/\s--test(?:\s|=|$)/.test(command) || /\s[^\s]+\.test\.m?js(?:\s|$)/.test(command)) ? [command] : [];
  });
}
const expectedTestCommands = requiredTestCommands('prebuild');
const metric = name => [...log.matchAll(new RegExp('(?:ℹ |# )' + name + ' (\\d+)', 'g'))].map(match => Number(match[1]));
const counts = metric('tests'), passedCounts = metric('pass'), failures = metric('fail');
assert.ok(expectedTestCommands.length > 0); assert.equal(counts.length, expectedTestCommands.length, 'Every prebuild Node group must finish');
assert.deepEqual(passedCounts, counts); assert.equal(failures.length, counts.length); assert.ok(failures.every(count => count === 0));
for (const name of ['cancelled', 'skipped', 'todo']) assert.deepEqual(metric(name), counts.map(() => 0), name + ': unexpected unfinished tests');
assert.ok(counts.every(count => count > 0)); assert.match(log, /built in \d+(?:\.\d+)?s/);
assert.equal(log.includes('✖ failing tests'), false);

const staticChecks = json(prefix + 'static-check-results.json');
assert.equal(staticChecks.passed, true);
for (const [name, expected] of [['lint', ['npm', 'run', 'lint']], ['diffCheck', ['git', 'diff', '--check']]]) {
  const check = staticChecks[name];
  assert.equal(check.exitCode, 0); assert.equal(check.signal, null); assert.equal(check.spawnError, null);
  assert.deepEqual(check.command, expected); assert.equal(sha(read(prefix + check.log)), check.logSha256);
  assert.ok(time(check.startedAt) <= time(check.finishedAt)); assert.ok(time(check.finishedAt) <= buildStarted);
}
const browser = json(prefix + 'browser-checks.json');
assert.equal(browser.passed, true); assert.equal(browser.observedInternalRuntimeErrors, 0);
assert.ok(browser.verifiedFiles.length > 0);
for (const file of browser.verifiedFiles) {
  const bytes = read(file.path); assert.equal(sha(bytes), file.sha256, file.path + ': browser evidence changed');
  assert.equal(bytes.length, file.bytes, file.path + ': browser evidence byte count changed');
}

const proofBytes = read(prefix + 'browser/production-assets-http.json'), proof = JSON.parse(proofBytes);
assert.equal(proof.buildReceipt, prefix + 'build-exit.json'); assert.equal(proof.buildReceiptSha256, sha(receiptBytes));
assert.ok(time(proof.startedAt) >= buildFinished, 'HTTP evidence must begin after the real build close event');
assert.ok(time(proof.finishedAt) >= time(proof.startedAt));
assert.equal(proof.passed, true); assert.equal(proof.rootMounted, true); assert.deepEqual(proof.pageErrors, []);
assert.equal(proof.auditSha256, sha(auditBytes)); assert.equal(proof.publicDistHttpBytesIdentical, true);
assert.equal(proof.registryCount, audit.assetInventory.registryFiles);
assert.equal(proof.uniquePngCount, audit.assetInventory.deliveredUniquePngFiles);
assert.equal(proof.historicalImagesPreserved, baseline.assetInventory.deliveredUniquePngFiles);
assert.equal(proof.historicalRegistryCount, baseline.assetInventory.registryFiles);
assert.equal(proof.localFullDecodeCount, proof.uniquePngCount); assert.equal(proof.browserDecodeCount, proof.uniquePngCount);
const assets = proof.assets.map(asset => {
  const publicBytes = read('public' + asset.sheet), distBytes = read('dist' + asset.sheet);
  assert.equal(sha(publicBytes), asset.sha256); assert.equal(sha(distBytes), asset.sha256); assert.deepEqual(publicBytes, distBytes);
  assert.equal(distBytes.readUInt32BE(16), asset.width); assert.equal(distBytes.readUInt32BE(20), asset.height);
  assert.ok([4, 6].includes(distBytes[25]), asset.sheet + ': expected PNG alpha');
  return { sheet: asset.sheet, sha256: asset.sha256, bytes: distBytes.length, width: asset.width, height: asset.height, registry: asset.registries[0] };
});
assert.equal(new Set(assets.map(asset => asset.sheet)).size, assets.length);
assert.deepEqual(sorted(assets.map(asset => asset.sheet)), sorted(audit.assetInventory.sheets));
for (const old of previousValidation.distAssets) {
  const now = assets.find(asset => asset.sheet === old.sheet); assert.ok(now, old.sheet);
  assert.equal(now.sha256, old.sha256); assert.equal(now.width, old.width); assert.equal(now.height, old.height);
}

const refresh = json(prefix + 'rift-refresh/result.json');
assert.equal(refresh.resumption.mode, 'resume-after-reference-audit');
const interruptedBytes = read(refresh.resumption.archivedResult.path);
assert.equal(sha(interruptedBytes), refresh.resumption.archivedResult.sha256);
const interrupted = JSON.parse(interruptedBytes);
assert.equal(interrupted.startedAt, refresh.startedAt);
assert.equal(refresh.resumption.originalStartedAt, refresh.startedAt);
assert.deepEqual(interrupted.steps, refresh.steps.slice(0, 2));
assert.equal(interrupted.steps.length, 2);
assert.deepEqual(interrupted.authorization, refresh.authorization);
assert.deepEqual(interrupted.sourceSha256Before, refresh.sourceSha256Before);
assert.equal(sha(read(refresh.resumption.runner.path)), refresh.resumption.runner.sha256);
assert.ok(time(interrupted.steps[1].finishedAt) <= time(refresh.resumption.resumedAt));
assert.ok(time(refresh.resumption.resumedAt) <= time(refresh.steps[2].startedAt));
for (const key of ['completedStepLogsAndArguments', 'historicalSourcesAndPackageUnchanged', 'qualityReportBindsFrozenReferences', 'registryStillBeforeFinalWrites']) assert.equal(refresh.resumption.verified[key], true);
assert.equal(refresh.resumption.verified.frozenReferences, 40);
const rift = json(prefix + 'rift-refresh/summary.json');
const authorizationPath = prefix + 'rift-refresh/authorization.json', authorization = json(authorizationPath);
const gatePath = prefix + 'rift-refresh/allow-final-writes.json', gate = json(gatePath);
assert.equal(refresh.success, true); assert.equal(refresh.sourceFilesUnchanged, true);
assert.equal(authorization.authorized, true); assert.equal(authorization.referenceInputsFrozen, true);
assert.deepEqual(refresh.authorization, authorization);
assert.deepEqual(refresh.finalWriteGate, gate, 'The executed final-write gate must equal the frozen authorization file');
for (const field of ['authorized', 'productionFrozen', 'allBrowserWindowsClosed', 'rootFinalSignalReceived']) assert.equal(gate[field], true, field);
const expectedCommands = [
  ['node', 'scripts/buildRiftDossierCatalog.mjs', '--refresh-character-reference-audit'],
  ['python', 'scripts/auditCharacterReferenceQuality.py'],
  ['node', 'scripts/buildRiftDossierCatalog.mjs'], ['node', 'scripts/buildRiftDossierAssetRegistry.mjs'], ['npm', 'run', 'rift:audit']
];
assert.equal(refresh.steps.length, expectedCommands.length);
for (const [index, step] of refresh.steps.entries()) {
  assert.equal(step.exitCode, 0); assert.deepEqual(step.argv, expectedCommands[index]);
  assert.equal(sha(read(prefix + 'rift-refresh/' + step.log)), step.logSha256);
  assert.ok(time(step.startedAt) <= time(step.finishedAt));
  if (index) assert.ok(time(refresh.steps[index - 1].finishedAt) <= time(step.startedAt));
}
assert.ok(time(refresh.startedAt) <= time(refresh.steps[0].startedAt));
assert.ok(time(refresh.steps[1].finishedAt) <= time(gate.createdAt));
assert.ok(time(gate.createdAt) <= time(refresh.steps[2].startedAt));
assert.ok(time(refresh.steps[4].finishedAt) <= time(refresh.finishedAt)); assert.ok(time(refresh.finishedAt) <= buildStarted);
assert.deepEqual(refresh.sourceSha256Before, refresh.sourceSha256After);
checkHashes(refresh.sourceSha256After, 'Rift source drift'); checkHashes(refresh.generatedSha256After, 'Rift output drift');
const pythonPath = 'scripts/auditCharacterReferenceQuality.py';
assert.equal(sha(read(pythonPath)), baseline.inputHashes[pythonPath], 'Historical Python source/thresholds must remain byte-exact');
for (const field of ['success', 'historicalAuditScriptsUnchanged', 'historicalCatalogBuildersUnchanged', 'packageUnchanged', 'qualityThresholdsUnchanged', 'knownCaseExpectationsUnchanged', 'manualReferencePinsUnchanged', 'qualityBindsCurrentReferenceHashes']) assert.equal(rift[field], true, field);
assert.ok(Object.values(rift.qualityConstantsUnchanged).every(value => value === true));
const qualityReport = json('docs/rift-dossiers/character-reference-quality.json');
assert.equal(qualityReport.summary.uniqueReferencePathCount, 1912);
assert.equal(authorization.references.length, audit.batch.requestedCharacters);
assert.equal(new Set(authorization.references.map(reference => reference.id)).size, audit.batch.requestedCharacters);
assert.deepEqual(sorted(authorization.references.map(reference => reference.id)), sorted(audit.batch.actualCharacterIds));
const qualityReferences = new Map(qualityReport.referenceFiles.map(reference => [reference.path, reference]));
assert.equal(rift.authorizedReferenceClassifications.length, authorization.references.length);
const boundReferenceHashes = authorization.references.map(reference => {
  assert.ok(reference.sheet.startsWith('/sprites/') && !reference.sheet.includes('..'), reference.id);
  const actual = sha(read('public' + reference.sheet)), quality = qualityReferences.get(reference.sheet);
  const summarized = rift.authorizedReferenceClassifications.filter(entry => entry.id === reference.id);
  assert.equal(summarized.length, 1, reference.id); assert.equal(actual, reference.sha256, reference.id);
  assert.ok(quality, reference.id); assert.equal(quality.metrics.fileSha256, actual, reference.id);
  assert.equal(summarized[0].path, reference.sheet); assert.equal(summarized[0].sha256, actual);
  assert.equal(summarized[0].qualityReportedSha256, actual); assert.equal(summarized[0].authorizedSha256, actual);
  assert.equal(summarized[0].classification, quality.classification);
  return { id: reference.id, path: reference.sheet, sha256: actual, classification: quality.classification };
});

const productionFreeze = json(prefix + 'production-freeze.json');
assert.equal(productionFreeze.productionFrozen, true);
for (const [path, digest] of Object.entries(productionFreeze.files)) {
  const current = sha(read(path));
  if (current === digest) continue;
  assert.equal(path, productionFreeze.intentionalPostBrowserTransition.path);
  assert.equal(path, 'src/game/riftDossierAssets.json');
  assert.equal(digest, productionFreeze.intentionalPostBrowserTransition.beforeSha256);
  assert.equal(digest, refresh.generatedSha256Before[path]); assert.equal(current, refresh.generatedSha256After[path]);
}
const runtime = json(prefix + 'summon-runtime-result.json'), summonBrowser = json(prefix + 'summon-wave13-result.json');
for (const report of [runtime, summonBrowser]) {
  assert.equal(report.passed, true); assert.equal(report.preliminary, false); assert.equal(report.finalProductionFreezeClaimed, true);
  assert.equal(report.productionInputsStableDuringRun, true); assert.ok(time(report.startedAt) <= time(report.finishedAt));
  assert.ok(time(report.startedAt) >= time(productionFreeze.createdAt), 'RPG final proof must start after the real production freeze');
  assert.ok(time(report.finishedAt) <= time(gate.createdAt), 'RPG review must finish before final Rift writes are authorized');
  const validatorPath = report.harness || report.validator;
  const validatorSha256 = report.harnessSha256 || report.validatorSha256;
  assert.equal(sha(read(validatorPath)), validatorSha256);
}
assert.equal(runtime.actualSsrEngineFlows, 12); assert.equal(runtime.historicalPngPreserved, baseline.assetInventory.deliveredUniquePngFiles);
assert.equal(runtime.historicalRegistriesPreserved, baseline.assetInventory.registryFiles);
assert.deepEqual(runtime.sourceHashesBefore, runtime.sourceHashesAfter); checkHashes(runtime.sourceHashesAfter, 'RPG runtime input drift');
assert.deepEqual([runtime.offensiveFlows, runtime.buffFlows, runtime.shieldCases, runtime.deadTargetCases, runtime.removedTargetCases, runtime.callerAbortCases], [10, 2, 10, 10, 10, 24]);
assert.equal(runtime.rows.length, 12); assert.ok(runtime.rows.every(row => row.passed && row.samplerCells === 16 && row.impacts === 1));
assert.equal(summonBrowser.actualGameCanvasFlows, 12); assert.equal(summonBrowser.nativeFlows, 12); assert.equal(summonBrowser.fallbackFlows, 0);
assert.deepEqual([summonBrowser.distinctSourceCells, summonBrowser.nativeCells, summonBrowser.opposingNativeCells, summonBrowser.nativePixelMirrorChecks], [96, 96, 96, 192]);
assert.deepEqual([summonBrowser.offensiveFlows, summonBrowser.offensiveHpImpacts, summonBrowser.supportFlows, summonBrowser.supportEffectEvents, summonBrowser.supportDamageImpacts], [10, 10, 2, 2, 0]);
assert.equal(summonBrowser.supportAlliedHpUnchanged, true); assert.equal(summonBrowser.allEffectsOnce, true); assert.deepEqual(summonBrowser.pageErrors, []);
assert.equal(summonBrowser.allBrowserWindowsClosed, true);
assert.ok(time(summonBrowser.browserClosedAt) <= time(summonBrowser.finishedAt));
assert.ok(time(summonBrowser.browserClosedAt) <= time(gate.createdAt));
assert.equal(summonBrowser.artifacts.length, 12);
assert.equal(new Set(summonBrowser.artifacts.map(artifact => artifact.path)).size, 12);
for (const artifact of summonBrowser.artifacts) {
  assert.ok(artifact.path.startsWith(prefix + 'summon-wave13-') && artifact.path.endsWith('-impact.png'));
  const bytes = read(artifact.path); assert.equal(sha(bytes), artifact.sha256); assert.equal(bytes.length, artifact.bytes);
}
assert.deepEqual(summonBrowser.sourceFiles, summonBrowser.sourceFilesAfter);
for (const file of summonBrowser.sourceFiles) {
  const current = sha(read(file.path));
  if (current === file.sha256) continue;
  assert.equal(file.path, 'src/game/riftDossierAssets.json', 'Only documented post-review Rift output may change');
  assert.equal(file.sha256, refresh.generatedSha256Before[file.path]); assert.equal(current, refresh.generatedSha256After[file.path]);
  assert.ok(time(summonBrowser.finishedAt) <= time(refresh.steps[2].startedAt));
}

const fresh = (entries, before, key) => entries.filter(entry => !new Set(before.map(old => old[key])).has(entry[key]));
const newNative = fresh(audit.meleeBindings.nativePresentationEntries, baseline.meleeBindings.nativePresentationEntries, 'heroId');
const newPartial = fresh(audit.meleeBindings.nativePartialPresentationEntries, baseline.meleeBindings.nativePartialPresentationEntries, 'heroId');
const newBases = fresh(audit.baseSpriteCorrections.entries, baseline.baseSpriteCorrections.entries, 'heroId');
const newFull = fresh(audit.meleeBindings.detailedManifestCoverage.filter(entry => entry.complete), baseline.meleeBindings.detailedManifestCoverage.filter(entry => entry.complete), 'id');
const newSummons = fresh(audit.entities.nativeAnimationEntries, baseline.entities.nativeAnimationEntries, 'key');
const delivery = json(prefix + 'deliverables.json');
for (const [entries, delivered, key] of [[newNative, delivery.completeNative32, 'heroId'], [newPartial, delivery.partialNative, 'heroId'], [newBases, delivery.base16, 'heroId'], [newFull, delivery.full45, 'id'], [newSummons, delivery.rosterReinforcement16, 'key']]) assert.deepEqual(sorted(entries.map(entry => entry[key])), sorted(delivered.map(entry => entry[key])));
const previousSheets = new Set(previousValidation.distAssets.map(asset => asset.sheet));
const newSheets = assets.filter(asset => !previousSheets.has(asset.sheet)).map(asset => asset.sheet);
assert.equal(delivery.newPngFiles, newSheets.length); assert.deepEqual(sorted(delivery.sheets), sorted(newSheets));
const poses = newNative.length * 32 + newPartial.reduce((n, entry) => n + entry.frames, 0) + newBases.length * 16 + newFull.reduce((n, entry) => n + entry.boundFrames, 0) + newSummons.length * 16;
assert.equal(delivery.newPoses, poses); assert.equal(delivery.source1to1Verified, false);
// Every absent native/base identity remains tied to an actual refusal receipt.
const failuresReport = json(prefix + 'part-b/request-failures.json');
const blocked = [...new Set(failuresReport.failures.filter(entry => entry.code === 'moderation_blocked').map(entry => entry.heroId))];
assert.deepEqual(sorted(audit.batch.remainingNativeCharacterIds), sorted(blocked));
assert.deepEqual(sorted(delivery.blockedNativeHeroIds), sorted(blocked));
for (const failure of failuresReport.failures.filter(entry => entry.code === 'moderation_blocked')) {
  assert.ok(failure.requestId);
  for (const receipt of failure.receipts || [failure]) {
    const bytes = read(receipt.receipt), tool = JSON.parse(bytes);
    if (receipt.receiptSha256) assert.equal(sha(bytes), receipt.receiptSha256);
    assert.equal(tool.requestId, receipt.requestId);
    assert.equal(tool.code, 'moderation_blocked'); assert.equal(tool.imageReturned, false);
  }
  if (failure.heroId === 'ahsoka_adult') {
    assert.equal(failure.initialImageReturned, true);
    assert.equal(failure.receipts.length, 2);
    assert.equal(failure.rejectedNativeSources.length, 2);
    for (const rejected of failure.rejectedNativeSources) {
      assert.equal(sha(read(rejected.path)), rejected.sha256);
      assert.equal(rejected.acceptedForDelivery, false);
    }
  }
}
for (const id of blocked) {
  assert.equal(newNative.some(entry => entry.heroId === id), false);
  assert.equal(newBases.some(entry => entry.heroId === id), false);
}
assert.equal(newNative.length, audit.batch.requestedCharacters - blocked.length);
assert.deepEqual(sorted(newBases.map(entry => entry.heroId)), sorted(newNative.map(entry => entry.heroId)));
assert.deepEqual(delivery.missingNativeRpgPartnerHeroIds, ['obi_wan']);
const rpgAttempts = json(prefix + 'summon-attempts-final.json');
const refusedRpg = rpgAttempts.attempts.find(entry => entry.key === 'obiwan');
assert.equal(refusedRpg.status, 'refused'); assert.equal(refusedRpg.code, 'moderation_blocked');
assert.equal(refusedRpg.requestId, '85aa38a6-e108-4811-aea1-9b0dfa65b959');
assert.equal(newSummons.some(entry => entry.performerHeroId === 'obi_wan'), false);
assert.equal(newPartial.length, 0); assert.deepEqual(newFull.map(entry => entry.id), ['ripley']); assert.equal(newSummons.length, 6);
const tactics = json('docs/tactics-verticality-2026-10-24/ui/final/result.json');
assert.equal(tactics.passed, true); assert.equal(tactics.preliminary, false); assert.equal(tactics.actualCustomBattleLaunches, 3);
assert.equal(tactics.productionInputsStableDuringRun, true); assert.equal(tactics.allBrowserWindowsClosed, true);
assert.deepEqual(tactics.pageErrors, []); assert.equal(tactics.rows.length, 16);
assert.ok(time(tactics.startedAt) >= time(productionFreeze.createdAt)); assert.ok(time(tactics.browserClosedAt) <= time(gate.createdAt));
for (const [path, digest] of Object.entries(tactics.sourceHashesAfter)) {
  const actual = sha(read(path)); if (actual === digest) continue;
  assert.equal(path, 'src/game/riftDossierAssets.json');
  assert.equal(digest, refresh.generatedSha256Before[path]); assert.equal(actual, refresh.generatedSha256After[path]);
}
assert.deepEqual(tactics.sourceHashesBefore, tactics.sourceHashesAfter);
assert.equal(audit.tacticsTerrain.selectableVerticalBattlefields, 3);

const testsPassed = counts.reduce((sum, count) => sum + count, 0);
const result = {
  date: '2026-10-25', wave: 13, passed: true, verifiedAt: new Date().toISOString(), batchCharacters: audit.batch.requestedCharacters,
  testSuites: counts.length, testsPassed, testsFailed: 0, tests: { total: testsPassed, passed: testsPassed, failed: 0 },
  suiteTestCounts: counts, requiredTestCommands: expectedTestCommands,
  build: { command: receipt.command.join(' '), exitCode: receipt.exitCode, startedAt: receipt.startedAt, finishedAt: receipt.finishedAt,
    receipt: 'build-exit.json', receiptSha256: sha(receiptBytes), receiptOrigin: receipt.receiptOrigin,
    log: 'build.log', logSha256: sha(buildLogBytes), warnings: log.split('\n').filter(line => /^\(!\)/.test(line)) },
  lint: staticChecks.lint, diffCheck: staticChecks.diffCheck,
  deliveredThisWave: { completeNative32Heroes: newNative.length, partialNativeHeroIds: newPartial.map(entry => entry.heroId),
    partialNativePoses: newPartial.reduce((n, entry) => n + entry.frames, 0), base16Heroes: newBases.length,
    full45Heroes: newFull.map(entry => entry.id), rosterReinforcement16Atlases: newSummons.length,
    usedNativePoses: poses, newPngFiles: newSheets.length,
    newStageMechanisms: audit.stages.sceneMechanismDefinitions - baseline.stages.sceneMechanismDefinitions,
    newStageUniverses: audit.stages.rosterUniversesWithSceneMechanismDefinition - baseline.stages.rosterUniversesWithSceneMechanismDefinition },
  unresolvedThisBatch: { missingNative32HeroIds: blocked, noRejectedOrReservedCellCountedAsDelivered: true, source1to1Verified: false,
    blockedNativeCorrections: blocked.map(heroId => ({ heroId, reason: 'explicit image_gen refusal', evidence: 'part-b/request-failures.json', retainedFallbackIsNewDelivery: false })) },
  browserChecks: 'browser-checks.json', browserChecksSha256: sha(read(prefix + 'browser-checks.json')),
  rpgFinalProofs: { actualSsrEngineFlows: runtime.actualSsrEngineFlows, actualGameCanvasFlows: summonBrowser.actualGameCanvasFlows,
    runtime: 'summon-runtime-result.json', runtimeSha256: sha(read(prefix + 'summon-runtime-result.json')),
    browser: 'summon-wave13-result.json', browserSha256: sha(read(prefix + 'summon-wave13-result.json')), nativePixelMirrorChecks: summonBrowser.nativePixelMirrorChecks },
  tacticsFinalProof: { path: 'docs/tactics-verticality-2026-10-24/ui/final/result.json', sha256: sha(read('docs/tactics-verticality-2026-10-24/ui/final/result.json')), launches: tactics.actualCustomBattleLaunches, checks: tactics.rows.length, passed: true },
  productionHttpProof: 'browser/production-assets-http.json', productionHttpSha256: sha(proofBytes),
  riftReferenceRefresh: { report: 'rift-refresh/summary.json', sha256: sha(read(prefix + 'rift-refresh/summary.json')), details: rift,
    sourceFilesUnchanged: true, steps: refresh.steps, qualityBindsCurrentReferenceHashes: true, boundReferenceHashes,
    scriptsWereNotWeakened: true, authorization: { path: authorizationPath, sha256: sha(read(authorizationPath)) },
    finalWriteGate: { path: gatePath, sha256: sha(read(gatePath)), value: gate }, chronologicalOrderVerified: true,
    qualityAuditMaintenance: 'Historical Python source and thresholds remain byte-exact; availability statuses are not restored.' },
  distAssetCount: assets.length, distRegistryCount: proof.registryCount, distAssets: assets,
  previousPngFilesPreserved: previousValidation.distAssets.length, previousRegistryFilesPreserved: baseline.assetInventory.registryFiles,
  frozenInputHashCount: frozenInputs.length, frozenInputHashesMatch: true, currentAuditSha256: sha(auditBytes), source1to1Verified: false,
  productionFreeze: { path: prefix + 'production-freeze.json', sha256: sha(read(prefix + 'production-freeze.json')),
    createdAt: productionFreeze.createdAt, frozenFiles: Object.keys(productionFreeze.files).length, allHashesMatchOrDocumentedRiftTransition: true },
  finalizer: { path: prefix + 'validate-final-artifacts.mjs', sha256: sha(fs.readFileSync(new URL(import.meta.url))), frozenBeforeBuild: true, postBuildSourceAdapterNeeded: false }
};
// Final read-only barrier: no report may claim a pass if a concurrent task has
// changed a frozen input while verification was running.
checkHashes(audit.inputHashes, 'Final verification barrier');
assert.deepEqual(read(prefix + 'current.json'), auditBytes); assert.deepEqual(read(prefix + 'build-exit.json'), receiptBytes);
assert.deepEqual(read(prefix + 'browser/production-assets-http.json'), proofBytes);
const markdown = `# Validation finale du lot 13

Le build réel npm run build s’est terminé avec le code **0**, suivi du contrôle HTTP de tous les PNG de production.

- **${testsPassed} tests dans ${counts.length} groupes** ; aucun échec, test ignoré ou annulé. Lint et contrôle des espaces réussis.
- **${newNative.length} atlas de 32 poses**, **${newBases.length} bases de 16 poses**, Ripley en **45 états et 180 poses** et **6 renforts RPG de 16 poses** : **${poses} poses et ${newSheets.length} nouveaux PNG** livrés.
- **${assets.length} PNG et ${proof.registryCount} registres** vérifiés ; les ${previousValidation.distAssets.length} PNG et ${baseline.assetInventory.registryFiles} registres historiques sont préservés.
- **12 flux RPG SSR et 12 flux GameCanvas**, dix impacts offensifs uniques, deux soutiens sans dégât et 192 vérifications de réflexion des pixels.
- **Trois terrains Tactics verticaux réellement jouables** dans Combat custom : pont, terrasses et passerelles. Les déplacements, escaliers, rampes, occupations, lignes de vue, objectifs et coupes visuelles utilisent les étages. Trois lancements réels et seize contrôles UI passent ; les 66 tests de terrain font partie du build requis.
- Les cinq commandes Rift ont réussi dans l’ordre, avec les 40 références liées à leur SHA actuel. Le Python et ses seuils historiques restent inchangés ; les statuts pending réellement observés sont conservés.
- **${frozenInputs.length} entrées gelées** correspondent encore à l’audit ; le finaliseur était gelé avant le build.

Atlas manquants : **${blocked.join(', ')}** après refus explicites ; les sources invalides et anciennes poses réutilisées ne comptent pas comme livraison. Les nouvelles images sont des adaptations générées et revues : **la fidélité officielle 1:1 n’est pas certifiée**.

Détails : [validation.json](validation.json), [deliverables.json](deliverables.json), [preuves navigateur](browser-checks.json), [reçu du build](build-exit.json), [contrôle HTTP](browser/production-assets-http.json), [bilan Rift](rift-refresh/summary.json) et [guide du moteur Tactics](../tactics-terrain-verticality.md).
`;
fs.writeFileSync(new URL('validation.json', directory), JSON.stringify(result, null, 2) + '\n');
fs.writeFileSync(new URL('validation.md', directory), markdown);
console.log(JSON.stringify({ passed: true, tests: testsPassed, groups: counts.length, images: assets.length,
  preserved: result.previousPngFilesPreserved, frozenInputs: frozenInputs.length, poses, newPng: newSheets.length }));
