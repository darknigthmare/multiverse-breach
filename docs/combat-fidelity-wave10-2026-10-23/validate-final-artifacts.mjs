// Run only after the integration owner has observed npm run build exit0 and
// completed the separate, immutable production HTTP proof.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../../', import.meta.url), dir = new URL('./', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const prefix = 'docs/combat-fidelity-wave10-2026-10-23/';
assert.ok(process.argv.includes('--after-build-exit-0'), 'Observe the real build exit code before finalizing');
const auditBytes = read(prefix + 'current.json'), audit = JSON.parse(auditBytes);
const baseline = json(prefix + 'baseline.json'), previousValidation = json('docs/combat-fidelity-wave9-2026-10-22/validation.json');
const browser = json(prefix + 'browser-checks.json');
const proofBytes = read(prefix + 'browser/production-assets-http.json'), proof = JSON.parse(proofBytes);
const buildLogBytes = read(prefix + 'build.log'), log = buildLogBytes.toString().replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), '');
const counts = [...log.matchAll(/(?:ℹ |# )tests (\d+)/g)].map(match => Number(match[1]));
const failures = [...log.matchAll(/(?:ℹ |# )fail (\d+)/g)].map(match => Number(match[1]));
assert.equal(counts.length, previousValidation.testSuites, 'Every required Node test group must finish');
assert.equal(failures.length, counts.length); assert.ok(failures.every(count => count === 0));
assert.match(log, /built in \d+(?:\.\d+)?s/); assert.equal(log.includes('✖ failing tests'), false);
assert.equal(browser.passed, true); assert.equal(browser.observedInternalRuntimeErrors, 0);
assert.equal(proof.passed, true); assert.equal(proof.rootMounted, true); assert.deepEqual(proof.pageErrors, []);
assert.equal(proof.auditSha256, sha(auditBytes));
assert.equal(proof.registryCount, audit.assetInventory.registryFiles);
assert.equal(proof.uniquePngCount, audit.assetInventory.deliveredUniquePngFiles);
assert.equal(proof.historicalImagesPreserved, baseline.assetInventory.deliveredUniquePngFiles);
assert.equal(proof.historicalRegistryCount, baseline.assetInventory.registryFiles);
assert.equal(proof.publicDistHttpBytesIdentical, true);
assert.equal(proof.localFullDecodeCount, proof.uniquePngCount);
assert.equal(proof.browserDecodeCount, proof.uniquePngCount);

const frozenInputs = Object.entries(audit.inputHashes);
for (const [path, digest] of frozenInputs) assert.equal(sha(read(path)), digest, `${path}: changed after final audit`);
for (const path of baseline.assetInventory.registries) assert.equal(sha(read(path)), baseline.inputHashes[path], `${path}: historical registry changed`);
const assets = proof.assets.map(asset => {
  const publicBytes = read('public' + asset.sheet), distBytes = read('dist' + asset.sheet);
  assert.equal(sha(publicBytes), asset.sha256); assert.equal(sha(distBytes), asset.sha256);
  assert.deepEqual(publicBytes, distBytes);
  assert.equal(distBytes.readUInt32BE(16), asset.width); assert.equal(distBytes.readUInt32BE(20), asset.height);
  assert.ok([4, 6].includes(distBytes[25]));
  return { sheet: asset.sheet, sha256: asset.sha256, bytes: distBytes.length,
    width: asset.width, height: asset.height, registry: asset.registries[0] };
});
assert.deepEqual(assets.map(asset => asset.sheet).sort(), [...audit.assetInventory.sheets].sort());
for (const old of previousValidation.distAssets) {
  const now = assets.find(asset => asset.sheet === old.sheet); assert.ok(now, old.sheet);
  assert.equal(now.sha256, old.sha256); assert.equal(now.width, old.width); assert.equal(now.height, old.height);
}
const beforeNative = new Set(baseline.meleeBindings.nativePresentationHeroIds);
const newNative = audit.meleeBindings.nativePresentationEntries.filter(entry => !beforeNative.has(entry.heroId));
const beforePartial = new Set(baseline.meleeBindings.nativePartialPresentationEntries.map(entry => entry.heroId));
const newPartial = audit.meleeBindings.nativePartialPresentationEntries.filter(entry => !beforePartial.has(entry.heroId));
const beforeBases = new Set(baseline.baseSpriteCorrections.entries.map(entry => entry.heroId));
const newBases = audit.baseSpriteCorrections.entries.filter(entry => !beforeBases.has(entry.heroId));
const beforeFull = new Set(baseline.meleeBindings.fullDetailedMeleeManifestHeroes);
const newFull = audit.meleeBindings.detailedManifestCoverage.filter(entry => entry.complete && !beforeFull.has(entry.id));
const beforeSummons = new Set(baseline.entities.nativeAnimationEntries.map(entry => entry.key));
const newSummons = audit.entities.nativeAnimationEntries.filter(entry => !beforeSummons.has(entry.key));
const rift = json(prefix + 'rift-refresh/summary.json');
assert.equal(rift.success, true); assert.equal(rift.changedReferencePaths, 40);
assert.equal(rift.all40NewReferencesApproved, true);
assert.equal(rift.historicalAuditScriptsUnchanged, false, 'The retired-reference audit maintenance must be disclosed');
assert.equal(rift.historicalCatalogBuildersUnchanged, true);
assert.equal(rift.qualityThresholdsUnchanged, true); assert.equal(rift.knownCaseExpectationsUnchanged, true);
assert.equal(rift.qualityAuditChangedForRetiredReferences, true);
const invariantFix = json(prefix + 'rift-refresh/retired-known-case-regression.json');
assert.equal(invariantFix.tests.exitCode, 0); assert.equal(invariantFix.tests.passed, 5);
assert.equal(invariantFix.constantsUnchanged, true); assert.equal(invariantFix.analyzeAndClassifyFunctionsUnchanged, true);
assert.equal(invariantFix.constantsSha256Before, invariantFix.constantsSha256After);
assert.equal(invariantFix.classifierFunctionsSha256Before, invariantFix.classifierFunctionsSha256After);
assert.equal(invariantFix.manualApprovalsAdded, 0);
assert.equal(sha(read(prefix + 'rift-refresh/retired-known-case-tests.log')), invariantFix.tests.logSha256);
assert.equal(sha(read(invariantFix.beforeSnapshot)), invariantFix.sourceSha256Before);
assert.equal(sha(read(invariantFix.changedScript)), invariantFix.sourceSha256After);
const qualityReport = json('docs/rift-dossiers/character-reference-quality.json');
assert.equal(qualityReport.summary.uniqueReferencePathCount, 1912);
assert.equal(qualityReport.historicalKnownCaseReferences.length, 1);
const historicalFreeman = qualityReport.historicalKnownCaseReferences[0];
assert.equal(historicalFreeman.path, '/sprites/generated/heroes/half-life/freeman.png');
assert.equal(historicalFreeman.classification, 'approved');
assert.equal(historicalFreeman.metrics.fileSha256, '88f9e1269f442c9eb805f78bfd776ebd5cdbe6aba85fbc57db390464d443fd28');
assert.equal(Object.values(rift.exitCodes).length, 5); assert.ok(Object.values(rift.exitCodes).every(code => code === 0));
const refresh = json(prefix + 'rift-refresh/result.json');
for (const [path, digest] of Object.entries(refresh.sourceSha256Before)) {
  if (path === invariantFix.changedScript) {
    assert.equal(digest, invariantFix.sourceSha256Before);
    assert.equal(refresh.sourceSha256After[path], invariantFix.sourceSha256After);
    assert.equal(sha(read(path)), invariantFix.sourceSha256After);
  } else {
    assert.equal(refresh.sourceSha256After[path], digest, path);
    assert.equal(sha(read(path)), digest, `${path}: reference-audit source changed`);
  }
}
const staticChecks = json(prefix + 'static-check-results.json');
assert.equal(staticChecks.lint.exitCode, 0); assert.equal(staticChecks.diffCheck.exitCode, 0);
const result = {
  date: '2026-10-23', wave: 10, passed: true, batchCharacters: audit.batch.requestedCharacters,
  testSuites: counts.length, testsPassed: counts.reduce((sum, count) => sum + count, 0), testsFailed: 0,
  tests: { total: counts.reduce((sum, count) => sum + count, 0), passed: counts.reduce((sum, count) => sum + count, 0), failed: 0 },
  suiteTestCounts: counts,
  build: { command: 'npm run build', exitCode: 0, log: 'build.log', logSha256: sha(buildLogBytes),
    warnings: log.split('\n').filter(line => /^\(!\)/.test(line)) },
  lint: staticChecks.lint, diffCheck: staticChecks.diffCheck,
  deliveredThisWave: { completeNative32Heroes: newNative.length, partialNativeHeroIds: newPartial.map(entry => entry.heroId), partialNativePoses: newPartial.reduce((n, entry) => n + entry.frames, 0),
    base16Heroes: newBases.length, full45Heroes: newFull.map(entry => entry.id), rosterReinforcement16Atlases: newSummons.length,
    usedNativePoses: newNative.length * 32 + newPartial.reduce((n, entry) => n + entry.frames, 0) + newBases.length * 16 + newFull.reduce((n, entry) => n + entry.boundFrames, 0) + newSummons.length * 16,
    newPngFiles: assets.length - previousValidation.distAssets.length,
    newStageMechanisms: audit.stages.sceneMechanismDefinitions - baseline.stages.sceneMechanismDefinitions,
    newStageUniverses: audit.stages.rosterUniversesWithSceneMechanismDefinition - baseline.stages.rosterUniversesWithSceneMechanismDefinition },
  unresolvedThisBatch: { missingNative32HeroIds: audit.batch.remainingNativeCharacterIds,
    noRejectedOrReservedCellCountedAsDelivered: true, source1to1Verified: false },
  browserChecks: 'browser-checks.json', productionHttpProof: 'browser/production-assets-http.json', productionHttpSha256: sha(proofBytes),
  riftReferenceRefresh: { report: 'rift-refresh/summary.json', sha256: sha(read(prefix + 'rift-refresh/summary.json')),
    details: rift, scriptsWereNotWeakened: true, qualityAuditMaintenance: invariantFix },
  distAssetCount: assets.length, distRegistryCount: proof.registryCount, distAssets: assets,
  previousPngFilesPreserved: previousValidation.distAssets.length,
  previousRegistryFilesPreserved: baseline.assetInventory.registryFiles,
  frozenInputHashCount: frozenInputs.length, frozenInputHashesMatch: true,
  currentAuditSha256: sha(auditBytes), source1to1Verified: false
};
assert.deepEqual(result.unresolvedThisBatch.missingNative32HeroIds, ['janine_gb']);
assert.equal(newNative.length, 39); assert.equal(newPartial.length, 1);
assert.equal(newPartial[0].heroId, 'janine_gb'); assert.equal(newPartial[0].frames, 24);
assert.deepEqual([...newPartial[0].phases].sort(), ['intro','outro','roundVictory','roundDefeat','victory','defeat'].sort());
const refusedCorrection = json(prefix + 'part-d-sources/janine_gb-phone-correction-refusal.json');
assert.ok(JSON.stringify(refusedCorrection).includes('moderation_blocked'), 'The blocked source correction must retain its actual refusal');
result.unresolvedThisBatch.blockedNativeCorrections = [{ heroId: 'janine_gb', phases: ['fatality','super'], reason: 'image_gen moderation_blocked', evidence: 'part-d-sources/janine_gb-phone-correction-refusal.json' }];
fs.writeFileSync(new URL('validation.json', dir), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, tests: result.testsPassed, groups: counts.length,
  images: assets.length, preserved: result.previousPngFilesPreserved, frozenInputs: frozenInputs.length,
  poses: result.deliveredThisWave.usedNativePoses, newPng: result.deliveredThisWave.newPngFiles }));
