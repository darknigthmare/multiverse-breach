// Collect observed final proofs. This file never runs a browser or invents QA.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { historicalBaseline, validateFreeze, writeReports } from './closure-support.mjs';
assert.ok(process.argv.includes('--after-final-browser-and-rift'), 'Finish all final browser runs and the authorized Rift refresh before collecting their proofs');
historicalBaseline();
const root = new URL('../../', import.meta.url);
const prefix = 'docs/combat-fidelity-wave14-2026-10-25/';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fingerprint = path => ({ path, sha256: sha(read(path)), bytes: read(path).length });
const freeze = json(prefix + 'production-freeze.json');
const gate = json(prefix + 'rift-refresh/allow-final-writes.json');
const refresh = json(prefix + 'rift-refresh/result.json');
const time = value => { const result = Date.parse(value); assert.ok(Number.isFinite(result), String(value)); return result; };
assert.equal(freeze.productionFrozen, true); assert.equal(refresh.success, true);
for (const name of ['authorized','productionFrozen','allBrowserWindowsClosed','rootFinalSignalReceived']) assert.equal(gate[name], true);
const files = new Map(), checks = [];
function verifyFile(record) {
  assert.equal(typeof record.path, 'string'); const actual = fingerprint(record.path);
  assert.equal(actual.sha256, record.sha256, record.path);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes, record.path);
  files.set(actual.path, actual);
}
function verifyInput(record, finishedAt) {
  if (sha(read(record.path)) === record.sha256) return verifyFile(record);
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
  if (harness) verifyFile({path:harness,sha256:value.harnessSha256 || value.validatorSha256});
  for (const artifact of value.artifacts || []) verifyFile(artifact);
  checks.push({ domain, ...fingerprint(path), source1to1Verified:false, ...inspect(value) });
}
const baseline = json(prefix + 'baseline.json');
for (const path of baseline.assetInventory.registries) verifyFile({path,sha256:baseline.inputHashes[path]});
const previous = json('docs/combat-fidelity-wave13-2026-10-24/validation.json');
for (const asset of previous.distAssets) verifyFile({path:'public'+asset.sheet,sha256:asset.sha256});
const delivery = json(prefix + 'deliverables.json'), nativeCount = delivery.completeNative32.length;
assert.equal(nativeCount,40); assert.deepEqual(delivery.blockedNativeHeroIds,[]);
for (const name of ['native-presentations','base-corrections']) report('browser/'+name+'.json',name,value=>{
  assert.equal(value.productionInputsUnchanged,true); assert.equal(value.productionInputsStableDuringRun,true);
  const historicalDraws=name==='native-presentations'
    ? (baseline.meleeBindings.nativePresentationHeroes*32+baseline.meleeBindings.nativePartialPresentationEntries.reduce((sum,entry)=>sum+entry.frames,0))*2
    : baseline.baseSpriteCorrections.heroes*16*2;
  assert.equal(value.historicalDrawGeometryUnchanged,historicalDraws);
  assert.equal(value.newCharacters,nativeCount); assert.equal(value.pendingIds.length,0);
  assert.equal(value.historicalPngHashesPreserved,638); assert.equal(value.historicalRegistryHashesPreserved,111);
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
report('browser/native-super-runtime.json','forty-character-authoritative-runtime',value=>{
  assert.equal(value.productionFreezeAcknowledged,true); verifyInputs(value.inputHashes,value.finishedAt);
  assert.equal(value.results.length,240);assert.equal(value.tacticsCases.length,80);assert.equal(value.projectileCases.length,34);
  assert.equal(new Set(value.results.map(row=>row.id)).size,40);
  assert.ok(value.results.every(row=>row.impactUnique&&row.pauseStable&&row.renderReadOnly));
  for(const [kinds,expectedCount] of [[value.bodyKinds,nativeCount*6],[value.tacticsBodyKinds,nativeCount*2]]){
    assert.equal(kinds.native32,expectedCount);assert.equal(kinds['legacy-fallback']||0,0);
    assert.ok(Object.keys(kinds).every(kind=>['native32','legacy-fallback'].includes(kind)));
  }
  assert.ok(value.projectileCases.every(row=>row.nativeSpawn.kind==='measured-native'&&row.acceptedDamageEvents===1&&row.pauseStable&&row.realFlightCoordinates&&row.movedDeadTargetPreservesContact));
  assert.ok(value.tacticsCases.every(row=>row.pauseStable&&row.renderReadOnly&&row.samples.length===4));
  return {metrics:{identities:40,authoritativeEngineFixtures:240,physicalProjectileFlights:34,verticalTacticsFixtures:80},method:value.method};
});
report('docs/tactics-universes-2026-10-25/result.json','universe-tactics-custom-gamecanvas',value=>{
  assert.equal(value.productionInputsStableDuringRun,true);assert.deepEqual(value.sourceHashesBefore,value.sourceHashesAfter);verifyInputs(value.sourceHashesAfter,value.finishedAt);
  assert.equal(value.actualCustomBattleLaunches,10);assert.equal(value.actualSourceSectorLaunches,8);assert.equal(value.actualLegacyControlLaunches,2);assert.equal(value.rows.length,27);
  assert.equal(value.artifacts.filter(artifact=>artifact.path.endsWith('.png')).length,18);assert.ok(value.rows.every(row=>row.passed));
  return {metrics:{actualCustomBattleLaunches:10,sourceSectors:8,legacyControls:2,captures:18,checks:27},method:'Real CustomBattleMode map selection and GameCanvas controls, movement confirmation, cuts, zoom, picking, keyboard and mobile viewport.'};
});
report('summon-runtime-result.json','rpg-ssr-engine',value=>{
  assert.equal(value.finalProductionFreezeClaimed,true);assert.equal(value.productionInputsStableDuringRun,true);
  assert.deepEqual(value.sourceHashesBefore,value.sourceHashesAfter);verifyInputs(value.sourceHashesAfter,value.finishedAt);
  assert.deepEqual([value.actualSsrEngineFlows,value.offensiveFlows,value.guardFlows,value.shieldCases,value.deadTargetCases,value.removedTargetCases,value.callerAbortCases],[12,10,2,10,10,10,24]);
  assert.equal(value.buffFlows,0);assert.equal(value.supportFlows,2);
  return {metrics:{ssrEngineFlows:12,offensiveFlows:10,supportFlows:2},method:'Actual SSR production engines; deterministic committed costs, contacts, invalid targets and interrupted callers.'};
},{browser:false});
report('summon-wave14-result.json','rpg-gamecanvas',value=>{
  assert.equal(value.finalProductionFreezeClaimed,true);assert.equal(value.productionInputsStableDuringRun,true);
  assert.deepEqual(value.sourceFiles,value.sourceFilesAfter);verifyInputs(value.sourceFiles,value.finishedAt);
  assert.deepEqual([value.actualGameCanvasFlows,value.nativePixelMirrorChecks,value.offensiveHpImpacts,value.supportEffectEvents,value.supportDamageImpacts],[12,192,10,2,0]);
  assert.equal(value.allEffectsOnce,true);assert.equal(value.supportAlliedHpUnchanged,true);
  return {metrics:{actualGameCanvasFlows:12,nativePixelMirrorChecks:192,offensiveHpImpacts:10,supportEffectEvents:2},method:'Actual GameCanvas commands and target confirmation in both camps, pause, cancellation and exactly one accepted effect.'};
});
report('aragorn-sources/browser/aragorn-evidence.json','aragorn-native-motion',value=>{
  assert.equal(value.heroId,'aragorn_lotr');assert.equal(value.source1to1Verified,false);
  assert.deepEqual(value.execution.resourcesBefore,value.execution.resourcesAfter);
  assert.equal(value.execution.resourcesUnchangedDuringRun,true);
  value.resources.forEach(record=>verifyInput(record,value.execution.finishedAt));verifyFile(value.productionFreeze);
  assert.equal(value.counts.states,45);assert.equal(value.counts.nativePoses,180);assert.equal(value.flows.length,4);
  assert.equal(value.execution.commands.length,4);
  assert.deepEqual(value.execution.commands.map(command=>command.command),['core','movement','super','physical-ledge'].map(id=>'node '+prefix+'aragorn-sources/browser/aragorn-'+id+'-browser.mjs'));
  for(const [index,command] of value.execution.commands.entries()){
    assert.equal(command.exitCode,0);assert.ok(time(command.startedAt)>=time(value.execution.startedAt));
    assert.ok(time(command.finishedAt)>=time(command.startedAt));assert.ok(time(command.finishedAt)<=time(value.execution.finishedAt));
    if(index)assert.ok(time(value.execution.commands[index-1].finishedAt)<=time(command.startedAt));
  }
  for(const flow of value.flows){
    [flow.harness,flow.report,...flow.captures,...flow.traces].forEach(verifyFile);
    const observed=json(flow.report.path);assert.equal(observed.passed,true);
    assert.equal(observed.allBrowserWindowsClosed,true); assert.ok(time(observed.browserClosedAt)<=time(observed.finishedAt));
    for(const errors of [observed.pageErrors,observed.errors])if(errors)assert.deepEqual(errors,[]);
  }
  assert.equal(value.flows.filter(flow=>flow.type.startsWith('real-gamecanvas-keyboard')).length,2);
  return {metrics:value.counts,scope:value.scope,limitations:value.limitations};
},{nestedExecution:true});
const result = {schemaVersion:2,date:'2026-10-25',wave:14,passed:true,observedInternalRuntimeErrors:0,checks,verifiedFiles:[...files.values()],source1to1Verified:false,
  evidenceOrigin:'Retained real execution reports and current file SHA checks, with only the documented post-browser Rift registry transition allowed.'};
validateFreeze({refresh,gate});
writeReports([[prefix+'browser-checks.json',result]]);
console.log(JSON.stringify({passed:true,domains:checks.length,verifiedFiles:files.size}));
