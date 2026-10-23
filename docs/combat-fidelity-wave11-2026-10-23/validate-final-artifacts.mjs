// Run only after the integration owner has observed npm run build exit0 and
// completed the separate, immutable production HTTP proof.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../../', import.meta.url), dir = new URL('./', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const prefix = 'docs/combat-fidelity-wave11-2026-10-23/';
assert.ok(process.argv.includes('--after-build-exit-0'), 'Observe the real build exit code before finalizing');
const auditBytes = read(prefix + 'current.json'), audit = JSON.parse(auditBytes);
const baseline = json(prefix + 'baseline.json'), previousValidation = json('docs/combat-fidelity-wave10-2026-10-23/validation.json');
const browser = json(prefix + 'browser-checks.json');
const proofBytes = read(prefix + 'browser/production-assets-http.json'), proof = JSON.parse(proofBytes);
const buildLogBytes = read(prefix + 'build.log'), log = buildLogBytes.toString().replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), '');
const receiptBytes = read(prefix + 'build-exit.json'), receipt = JSON.parse(receiptBytes);
assert.deepEqual(receipt.command, ['npm', 'run', 'build']);
assert.equal(receipt.receiptOrigin, 'node-child-process-close-event');
assert.equal(receipt.exitCode, 0); assert.equal(receipt.signal, null); assert.equal(receipt.spawnError, null);
assert.equal(receipt.log, prefix + 'build.log');
assert.equal(receipt.logSha256, sha(buildLogBytes)); assert.equal(receipt.auditSha256, sha(auditBytes));
assert.equal(receipt.auditSha256After, receipt.auditSha256); assert.equal(receipt.auditUnchangedDuringBuild, true);
const buildStarted = Date.parse(receipt.startedAt), buildFinished = Date.parse(receipt.finishedAt);
assert.ok(Number.isFinite(buildStarted) && Number.isFinite(buildFinished) && buildStarted <= buildFinished);
assert.equal(proof.buildReceipt, prefix + 'build-exit.json'); assert.equal(proof.buildReceiptSha256, sha(receiptBytes));
assert.ok(Number.isFinite(Date.parse(proof.startedAt)) && Date.parse(proof.startedAt) >= buildFinished, 'HTTP evidence must begin after actual build completion');
assert.ok(Number.isFinite(Date.parse(proof.finishedAt)) && Date.parse(proof.finishedAt) >= Date.parse(proof.startedAt));
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
const refresh = json(prefix + 'rift-refresh/result.json');
assert.equal(refresh.success,true);assert.equal(refresh.sourceFilesUnchanged,true);
const expectedCommands=[['node','scripts/buildRiftDossierCatalog.mjs','--refresh-character-reference-audit'],['python','scripts/auditCharacterReferenceQuality.py'],['node','scripts/buildRiftDossierCatalog.mjs'],['node','scripts/buildRiftDossierAssetRegistry.mjs'],['npm','run','rift:audit']];
assert.equal(refresh.steps.length,5);
for(const [index,step] of refresh.steps.entries()){
 assert.equal(step.exitCode,0);assert.deepEqual(step.argv,expectedCommands[index]);
 assert.equal(sha(read(prefix+'rift-refresh/'+step.log)),step.logSha256);
}
for(const [path,digest] of Object.entries(refresh.sourceSha256Before)){
 assert.equal(refresh.sourceSha256After[path],digest,path);assert.equal(sha(read(path)),digest,path+': source changed');
}
for(const [path,digest] of Object.entries(refresh.generatedSha256After))assert.equal(sha(read(path)),digest,path);
assert.equal(sha(read('scripts/auditCharacterReferenceQuality.py')),baseline.inputHashes['scripts/auditCharacterReferenceQuality.py'],'Historical Python source and thresholds must remain byte-exact in W11');
const qualityReport=json('docs/rift-dossiers/character-reference-quality.json');
// Availability is distinct from quality. A revised prompt can correctly leave an
// old image pending; no all37/all40-approved shortcut or relabeling is accepted.
assert.equal(qualityReport.summary.uniqueReferencePathCount, 1912);
assert.equal(rift.success, true); assert.equal(rift.qualityBindsCurrentReferenceHashes, true);
const authorization=json(prefix+'rift-refresh/authorization.json');
assert.equal(authorization.authorized, true); assert.equal(authorization.productionFrozen, true);
assert.equal(authorization.references.length, audit.batch.requestedCharacters);
assert.equal(new Set(authorization.references.map(reference=>reference.id)).size, audit.batch.requestedCharacters);
assert.deepEqual(authorization.references.map(reference=>reference.id).sort(), [...audit.batch.actualCharacterIds].sort());
const qualityReferences=new Map(qualityReport.referenceFiles.map(reference=>[reference.path,reference]));
assert.equal(rift.authorizedReferenceClassifications.length, authorization.references.length);
const boundReferenceHashes=authorization.references.map(reference=>{
 assert.ok(reference.sheet.startsWith('/sprites/') && !reference.sheet.includes('..'),reference.id);
 const actual=sha(read('public'+reference.sheet)), quality=qualityReferences.get(reference.sheet);
 const summarized=rift.authorizedReferenceClassifications.filter(entry=>entry.id===reference.id);
 assert.equal(summarized.length,1,reference.id+': exactly one summary binding');
 assert.equal(actual,reference.sha256,reference.id+': authorization must bind the current PNG');
 assert.ok(quality,reference.id+': missing current quality record');
 assert.equal(quality.metrics.fileSha256,actual,reference.id+': quality audit must have read this exact PNG');
 assert.equal(summarized[0].path,reference.sheet); assert.equal(summarized[0].sha256,actual);
 assert.equal(summarized[0].qualityReportedSha256,actual); assert.equal(summarized[0].authorizedSha256,actual);
 assert.equal(summarized[0].classification,quality.classification);
 return {id:reference.id,path:reference.sheet,sha256:actual,classification:quality.classification};
});
const delivery=json(prefix+'deliverables.json');
assert.equal(delivery.newPngFiles,assets.length-previousValidation.distAssets.length);
const staticChecks = json(prefix + 'static-check-results.json');
assert.equal(staticChecks.lint.exitCode, 0); assert.equal(staticChecks.diffCheck.exitCode, 0);
const result = {
  date: '2026-10-23', wave: 11, passed: true, batchCharacters: audit.batch.requestedCharacters,
  testSuites: counts.length, testsPassed: counts.reduce((sum, count) => sum + count, 0), testsFailed: 0,
  tests: { total: counts.reduce((sum, count) => sum + count, 0), passed: counts.reduce((sum, count) => sum + count, 0), failed: 0 },
  suiteTestCounts: counts,
  build: { command: receipt.command.join(' '), exitCode: receipt.exitCode, startedAt: receipt.startedAt, finishedAt: receipt.finishedAt,
    receipt: 'build-exit.json', receiptSha256: sha(receiptBytes), receiptOrigin: receipt.receiptOrigin,
    log: 'build.log', logSha256: sha(buildLogBytes),
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
    details: rift, sourceFilesUnchanged:refresh.sourceFilesUnchanged, steps:refresh.steps,
    qualityBindsCurrentReferenceHashes:true, boundReferenceHashes,
    scriptsWereNotWeakened: true, qualityAuditMaintenance: 'No historical audit source changed in W11; byte-exact Python verified.' },
  distAssetCount: assets.length, distRegistryCount: proof.registryCount, distAssets: assets,
  previousPngFilesPreserved: previousValidation.distAssets.length,
  previousRegistryFilesPreserved: baseline.assetInventory.registryFiles,
  frozenInputHashCount: frozenInputs.length, frozenInputHashesMatch: true,
  currentAuditSha256: sha(auditBytes), source1to1Verified: false
};
const blocked=['harry_potter','hermione_granger','snape'];
assert.deepEqual([...result.unresolvedThisBatch.missingNative32HeroIds].sort(),[...blocked].sort());
assert.equal(newNative.length,37);assert.equal(newPartial.length,0);assert.equal(newBases.length,37);assert.equal(newSummons.length,7);
assert.deepEqual(newFull.map(e=>e.id).sort(),['arthur_kaamelott','buffy_summers']);
for(const id of blocked){assert.equal(newNative.some(e=>e.heroId===id),false);assert.equal(newBases.some(e=>e.heroId===id),false);}
assert.equal(newSummons.some(e=>e.performerHeroId==='hermione_granger'),false);
assert.equal(result.deliveredThisWave.usedNativePoses,delivery.newPoses);
result.unresolvedThisBatch.blockedNativeCorrections=blocked.map(heroId=>({heroId,phases:'all new native32/base16 requests blocked; retained fallback is not a delivery',reason:'explicit image_gen refusal',evidence:'part-a-request-failures.json'}));
fs.writeFileSync(new URL('validation.json', dir), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, tests: result.testsPassed, groups: counts.length,
  images: assets.length, preserved: result.previousPngFilesPreserved, frozenInputs: frozenInputs.length,
  poses: result.deliveredThisWave.usedNativePoses, newPng: result.deliveredThisWave.newPngFiles }));
