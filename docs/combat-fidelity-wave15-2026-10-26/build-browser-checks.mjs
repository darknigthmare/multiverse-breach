// Collect observed final proofs. This file never runs a browser or invents QA.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { historicalBaseline, validateFreeze, writeReports, expected } from './closure-support.mjs';
import { resolveRiftReviewContext } from './rift-review-support.mjs';
import { proofExpectations, assertRpgRows, assertNativeFixtureRows, assertRpgControlSupportRows } from './proof-contracts.mjs';
assert.ok(process.argv.includes('--after-final-browser-and-rift'), 'Finish all final browser runs and the authorized Rift refresh before collecting their proofs');
historicalBaseline();
const contract=proofExpectations();
const root = new URL('../../', import.meta.url);
const prefix = 'docs/combat-fidelity-wave15-2026-10-26/';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fingerprint = path => ({ path, sha256: sha(read(path)), bytes: read(path).length });
const riftContext=resolveRiftReviewContext();
const {freeze,refresh,writeGate}=riftContext,gate=riftContext.reviewBarrier;
const time = value => { const result = Date.parse(value); assert.ok(Number.isFinite(result), String(value)); return result; };
assert.equal(freeze.productionFrozen, true); assert.equal(refresh.success, true);
for (const name of ['authorized','productionFrozen','allBrowserWindowsClosed','rootFinalSignalReceived']) assert.equal(writeGate[name], true);
if(!riftContext.allowTransition){assert.equal(gate.reviewApproved,true);assert.equal(gate.authorizesRiftWrites,false);}
const files = new Map(), checks = [];
function verifyFile(record) {
  assert.equal(typeof record.path, 'string'); const actual = fingerprint(record.path);
  assert.equal(actual.sha256, record.sha256, record.path);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes, record.path);
  files.set(actual.path, actual);
}
function verifyInput(record, finishedAt) {
  if (sha(read(record.path)) === record.sha256) return verifyFile(record);
  assert.equal(riftContext.allowTransition,true,'Completed Rift revalidation permits no SHA transition');
  assert.equal(record.path, 'src/game/riftDossierAssets.json');
  assert.equal(refresh.generatedSha256Before[record.path], record.sha256);
  assert.equal(refresh.generatedSha256After[record.path], sha(read(record.path)));
  assert.ok(time(finishedAt) <= time(gate.createdAt));
  assert.ok(time(gate.createdAt) <= time(refresh.steps[2].startedAt));
}
function verifyInputs(records, finishedAt) {
  assert.ok(records && Object.keys(records).length);
  const rows = Array.isArray(records) ? records : Object.entries(records).map(([path,sha256]) => ({path,sha256}));
  rows.forEach(record => verifyInput(record, finishedAt));
}
function verifyVisualReview(path, proof, captures, countField) {
  const review=json(path);
  assert.equal(review.passed,true,path);assert.equal(review.preliminary,false,path);
  assert.equal(review[countField],captures.length,path);
  assert.ok(time(review.reviewedAt)>=time(proof.browserClosedAt));assert.ok(time(review.reviewedAt)<=time(gate.createdAt));
  const records=review.artifacts||review.rows;
  assert.ok(Array.isArray(records));
  for(const capture of captures){
    const found=records.filter(record=>record.path===capture);assert.equal(found.length,1,capture);
    if(found[0].inspected!==undefined)assert.equal(found[0].inspected,true);
    verifyFile(found[0]);
  }
  if(review.report){verifyFile(review.report);assert.equal(review.report.sha256,sha(read(review.report.path)));}
  verifyFile(fingerprint(path));
  return fingerprint(path);
}
function report(relative, domain, inspect, { browser = true, nestedExecution = false } = {}) {
  const path = relative.startsWith('docs/') ? relative : prefix + relative, value = json(path);
  assert.equal(value.passed, true, path);
  const execution = nestedExecution ? value.execution : value;
  assert.ok(time(execution.startedAt) >= time(freeze.createdAt), path + ': before production freeze');
  assert.ok(time(execution.finishedAt) >= time(execution.startedAt));
  assert.ok(time(execution.finishedAt) <= time(gate.createdAt), path + ': after final Rift gate');
  for (const errors of [value.pageErrors,value.errors]) if (errors) assert.deepEqual(errors, [], path);
  for (const failure of value.failedRequests || []) {
    assert.match(failure.url, /^https:\/\/fonts\.googleapis\.com\//); assert.equal(failure.error,'net::ERR_TUNNEL_CONNECTION_FAILED');
  }
  if (value.consoleErrors) assert.equal(value.consoleErrors.length,(value.failedRequests || []).length);
  if (browser && !nestedExecution) {
    assert.equal(value.allBrowserWindowsClosed,true,path);
    assert.ok(time(value.browserClosedAt) <= time(value.finishedAt));
  }
  if (value.preliminary !== undefined) assert.equal(value.preliminary,false,path);
  if (value.phase !== undefined) assert.equal(value.phase,'final',path);
  const harness = value.harness || value.validator;
  if (harness) {
    const digest=value.harnessSha256 || value.validatorSha256;
    assert.equal(freeze.files[harness],digest,path+': proof harness was not frozen before execution');
    verifyFile({path:harness,sha256:digest});
  }
  for (const artifact of value.artifacts || []) verifyFile(artifact);
  checks.push({ domain, ...fingerprint(path), source1to1Verified:false, ...inspect(value) });
}
const baseline = json(prefix + 'baseline-current-wave14.json');
for (const path of baseline.assetInventory.registries) verifyFile({path,sha256:baseline.inputHashes[path]});
const previous = json('docs/combat-fidelity-wave14-2026-10-25/validation.json');
for (const asset of previous.distAssets) verifyFile({path:'public'+asset.sheet,sha256:asset.sha256});
const delivery = json(prefix + 'deliverables.json'), nativeCount = delivery.completeNative32.length;
assert.equal(nativeCount,expected.characters-delivery.blockedNativeHeroIds.length);
for (const name of ['native-presentations','base-corrections']) report('browser/'+name+'.json',name,value=>{
  assert.equal(value.productionInputsUnchanged,true); assert.equal(value.productionInputsStableDuringRun,true);
  const historicalDraws=name==='native-presentations'
    ? (baseline.meleeBindings.nativePresentationHeroes*32+baseline.meleeBindings.nativePartialPresentationEntries.reduce((sum,entry)=>sum+entry.frames,0))*2
    : baseline.baseSpriteCorrections.heroes*16*2;
  assert.equal(value.historicalDrawGeometryUnchanged,historicalDraws);
  assert.equal(value.newCharacters,nativeCount); assert.equal(value.pendingIds.length,0);
  assert.equal(value.historicalPngHashesPreserved,expected.historicalPng); assert.equal(value.historicalRegistryHashesPreserved,expected.historicalRegistries);
  assert.deepEqual([...value.actualDeliveredIds].sort(),delivery.completeNative32.map(entry=>entry.heroId).sort());
  verifyFile({path:value.productionFreezePath,sha256:value.productionFreezeSha256});
  const before = json(value.attempt+'/'+name+'-inputs-before.json'),after = json(value.attempt+'/'+name+'-inputs-after.json');
  assert.deepEqual(before,after); assert.equal(before.sha256,sha(Buffer.from(JSON.stringify(before.hashes))));
  verifyInputs(before.hashes,value.finishedAt);
  for (const [path,digest] of Object.entries(freeze.files)) assert.equal(before.hashes[path],digest,path);
  const perHero = name==='native-presentations'?64:32;
  assert.equal(value.newFrameDraws,nativeCount*perHero);
  return { metrics:{newCharacters:nativeCount,newFrameDraws:value.newFrameDraws,actualFrameDraws:value.actualFrameDraws,historicalDrawGeometryUnchanged:value.historicalDrawGeometryUnchanged},method:'Controlled production renderer draws, all retained cells and both facings; historical reuses remain separate.' };
});
report('browser/native-super-runtime.json','120-character-authoritative-runtime',value=>{
  assert.equal(value.productionFreezeAcknowledged,true); verifyInputs(value.inputHashes,value.finishedAt);
  assert.equal(value.results.length,contract.engineFixtures);assert.equal(value.tacticsCases.length,contract.tacticsFixtures);assert.equal(value.projectileCases.length,contract.projectileFlights);
  assertNativeFixtureRows(value,contract);
  assert.equal(new Set(value.results.map(row=>row.id)).size,expected.characters);
  assert.ok(value.results.every(row=>row.impactUnique&&row.pauseStable&&row.renderReadOnly));
  for(const [kinds,expectedCount] of [[value.bodyKinds,nativeCount*6],[value.tacticsBodyKinds,nativeCount*2]]){
    assert.equal(kinds.native32,expectedCount);assert.equal(kinds['legacy-fallback']||0,(expected.characters-nativeCount)*(expectedCount/nativeCount));
    assert.ok(Object.keys(kinds).every(kind=>['native32','legacy-fallback'].includes(kind)));
  }
  assert.ok(value.projectileCases.every(row=>row.nativeSpawn.kind===(delivery.blockedNativeHeroIds.includes(row.id)?'unavailable-native-fallback':'measured-native')&&row.acceptedDamageEvents===1&&row.pauseStable&&row.realFlightCoordinates&&row.movedDeadTargetPreservesContact));
  assert.ok(value.tacticsCases.every(row=>row.pauseStable&&row.renderReadOnly&&row.samples.length===4));
  return {metrics:{identities:expected.characters,authoritativeEngineFixtures:contract.engineFixtures,physicalProjectileFlights:contract.projectileFlights,verticalTacticsFixtures:contract.tacticsFixtures,preReleaseObservations:contract.projectileIds.length*4,preReleaseNativeAimingSamples:value.results.filter(row=>row.preReleaseFeedback&&row.bodyKind==='native32').length},method:value.method};
});
report('docs/tactics-universes-2026-10-26/result.json','universe-tactics-custom-gamecanvas',value=>{
  assert.equal(value.productionInputsStableDuringRun,true);assert.deepEqual(value.sourceHashesBefore,value.sourceHashesAfter);verifyInputs(value.sourceHashesAfter,value.finishedAt);
  assert.equal(value.actualCustomBattleLaunches,6);assert.equal(value.actualSourceSectorLaunches,4);assert.equal(value.actualLegacyControlLaunches,2);assert.equal(value.rows.length,18);
  assert.equal(value.artifacts.filter(artifact=>artifact.path.endsWith('.png')).length,10);assert.ok(value.rows.every(row=>row.passed));
  const visualReview=verifyVisualReview('docs/tactics-universes-2026-10-26/visual-review-final.json',value,value.artifacts.filter(row=>row.path.endsWith('.png')).map(row=>row.path),'actualCapturesInspected');
  return {metrics:{actualCustomBattleLaunches:6,sourceSectors:4,legacyControls:2,captures:10,checks:18},visualReview,method:'Real CustomBattleMode map selection and GameCanvas controls, movement confirmation, cuts, zoom, picking, keyboard and mobile viewport.'};
});
report('summon-runtime-result.json','rpg-ssr-engine',value=>{
  assert.equal(value.finalProductionFreezeClaimed,true);assert.equal(value.productionInputsStableDuringRun,true);
  assert.deepEqual(value.sourceHashesBefore,value.sourceHashesAfter);verifyInputs(value.sourceHashesAfter,value.finishedAt);
  assert.deepEqual([value.actualSsrEngineFlows,value.offensiveFlows,value.guardFlows,value.shieldCases,value.deadTargetCases,value.removedTargetCases,value.callerAbortCases],[12,10,0,10,10,10,24]);
  assert.equal(value.buffFlows,contract.rpgBuff);assert.equal(value.guardFlows,contract.rpgGuard);assert.equal(value.supportFlows,contract.rpgSupport);
  assertRpgRows(value.rows,contract);
  return {metrics:{ssrEngineFlows:12,offensiveFlows:10,supportFlows:2},method:'Actual SSR production engines; deterministic committed costs, contacts, invalid targets and interrupted callers.'};
},{browser:false});
report('summon-wave15-result.json','rpg-gamecanvas',value=>{
  assert.equal(value.finalProductionFreezeClaimed,true);assert.equal(value.productionInputsStableDuringRun,true);
  assert.deepEqual(value.sourceFiles,value.sourceFilesAfter);verifyInputs(value.sourceFiles,value.finishedAt);
  assert.deepEqual([value.actualGameCanvasFlows,value.nativePixelMirrorChecks,value.offensiveHpImpacts,value.supportEffectEvents,value.supportDamageImpacts],[12,192,10,2,0]);
  assert.equal(value.allEffectsOnce,true);assert.equal(value.supportAlliedHpUnchanged,true);
  assertRpgRows(value.rows,contract,{gameCanvas:true});
  return {metrics:{actualGameCanvasFlows:12,nativePixelMirrorChecks:192,offensiveHpImpacts:10,supportEffectEvents:2},method:'Actual GameCanvas commands and target confirmation in both camps, pause, cancellation and exactly one accepted effect.'};
});
report('rpg-control-support.json','rpg-gamecanvas-control-and-healing-burst',value=>{
  assert.equal(value.finalProductionFreezeClaimed,true);assert.equal(value.productionInputsStableDuringRun,true);
  assert.deepEqual(value.sourceFiles,value.sourceFilesAfter);verifyInputs(value.sourceFiles,value.finishedAt);
  verifyFile({path:value.productionFreezePath,sha256:value.productionFreezeSha256});assertRpgControlSupportRows(value);
  const visualReview=verifyVisualReview(prefix+'rpg-control-support-visual-review.json',value,value.artifacts.filter(row=>row.path.endsWith('.png')).map(row=>row.path),'actualCapturesInspected');
  return {metrics:{actualGameCanvasFlows:6,controlFlows:4,healingBurstFlows:2,captures:12},visualReview,method:value.method};
});
report('sir-daniel-sources/browser/sir-daniel-evidence.json','sir-daniel-native-motion',value=>{
  assert.equal(value.heroId,'sir_daniel_fortesque');assert.equal(value.source1to1Verified,false);
  assert.deepEqual(value.execution.resourcesBefore,value.execution.resourcesAfter);
  assert.equal(value.execution.resourcesUnchangedDuringRun,true);
  value.resources.forEach(record=>verifyInput(record,value.execution.finishedAt));verifyFile(value.productionFreeze);
  assert.equal(value.counts.states,45);assert.equal(value.counts.nativePoses,180);assert.equal(value.flows.length,4);
  assert.equal(value.execution.commands.length,4);
  assert.deepEqual(value.execution.commands.map(command=>command.command),['core','movement','super','physical-ledge'].map(id=>'node '+prefix+'sir-daniel-sources/browser/sir-daniel-'+id+'-browser.mjs'));
  for(const [index,command] of value.execution.commands.entries()){
    assert.equal(command.exitCode,0);assert.ok(time(command.startedAt)>=time(value.execution.startedAt));
    assert.ok(time(command.finishedAt)>=time(command.startedAt));assert.ok(time(command.finishedAt)<=time(value.execution.finishedAt));
    if(index)assert.ok(time(value.execution.commands[index-1].finishedAt)<=time(command.startedAt));
  }
  for(const flow of value.flows){
    assert.equal(freeze.files[flow.harness.path],flow.harness.sha256,flow.id+': runtime harness must precede freeze');
    [flow.harness,flow.report,...flow.captures,...flow.traces].forEach(verifyFile);
    const observed=json(flow.report.path);assert.equal(observed.passed,true);
    assert.equal(observed.allBrowserWindowsClosed,true); assert.ok(time(observed.browserClosedAt)<=time(observed.finishedAt));
    for(const errors of [observed.pageErrors,observed.errors])if(errors)assert.deepEqual(errors,[]);
  }
  assert.equal(value.flows.filter(flow=>flow.type.startsWith('real-gamecanvas-keyboard')).length,2);
  const visualReview=verifyVisualReview(prefix+'sir-daniel-sources/browser/sir-daniel-visual-review.json',value.execution,value.flows.flatMap(flow=>flow.captures.map(row=>row.path)),'actualCapturesInspected');
  return {metrics:value.counts,visualReview,scope:value.scope,limitations:value.limitations};
},{nestedExecution:true});
report('browser/stages-wave15.json','ten-universe-stage-canvas-studies',value=>{
  assert.equal(value.productionInputsStableDuringRun,true);assert.equal(value.rows.length,10);assert.equal(value.actualCanvasFrames,40);
  assert.equal(value.captures.length,2);assert.equal(value.artifacts.filter(row=>row.path.endsWith('.png')).length,2);
  assert.equal(new Set(value.rows.map(row=>row.id)).size,10);
  assert.ok(value.rows.every(row=>row.frames.length===4&&row.frames.every(frame=>frame.rendered&&frame.visiblePixels>0&&/^[0-9a-f]{64}$/.test(frame.sha256))&&row.cyclic&&row.reducedMotionStable&&row.allFourModeSelections&&row.stageImmutable));
  const inputs=name=>{const found=value.artifacts.filter(row=>row.path.endsWith('/inputs-'+name+'.json'));assert.equal(found.length,1);return json(found[0].path);};
  const before=inputs('before'),after=inputs('after');assert.deepEqual(before,after);
  assert.equal(before.sha256,value.productionInputSha256);assert.equal(before.sha256,sha(Buffer.from(JSON.stringify(before.hashes))));verifyInputs(before.hashes,value.finishedAt);
  verifyFile({path:value.productionFreezePath,sha256:value.productionFreezeSha256});
  for(const [path,digest]of Object.entries(freeze.files))assert.equal(before.hashes[path],digest,path);
  const visualReview=verifyVisualReview(prefix+'browser/stages-visual-review-final.json',value,value.captures,'actualContactSheetsViewed');
  return {metrics:{studies:10,actualCanvasFrames:40,captures:2},visualReview,method:value.scope};
});
const result = {schemaVersion:2,date:'2026-10-26',wave:15,passed:true,observedInternalRuntimeErrors:0,checks,verifiedFiles:[...files.values()],source1to1Verified:false,
  riftReview:{mode:riftContext.mode,reviewGate:fingerprint(riftContext.reviewBarrierPath),originalFinalWriteGate:fingerprint('docs/combat-fidelity-wave15-2026-10-26/rift-refresh/allow-final-writes.json')},
  evidenceOrigin:riftContext.allowTransition?'Retained real execution reports with the documented post-browser Rift registry transition.':'Fresh real execution reports against unchanged, already completed Rift outputs; no post-browser transition permitted.'};
validateFreeze({refresh,gate:writeGate});
writeReports([[prefix+'browser-checks.json',result]]);
console.log(JSON.stringify({passed:true,domains:checks.length,verifiedFiles:files.size}));
