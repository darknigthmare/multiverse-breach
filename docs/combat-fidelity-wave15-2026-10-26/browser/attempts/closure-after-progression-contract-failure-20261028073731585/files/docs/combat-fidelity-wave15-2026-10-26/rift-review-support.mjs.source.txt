// A completed Rift execution is immutable. A later browser review never grants
// another write phase, changes an execution timestamp, or permits input drift.
import assert from 'node:assert/strict';
import { prefix, json, fingerprint, verifyFile, time, sha, sorted } from './closure-support.mjs';

export const completedArchivePath=prefix+'rift-completed-execution-archive.json';
export const completedReviewPath=prefix+'rift-refresh/completed-refresh-review.json';
export const originalGatePath=prefix+'rift-refresh/allow-final-writes.json';
export const finalProofPaths=[
  'browser/native-presentations.json','browser/base-corrections.json','browser/native-super-runtime.json',
  'summon-runtime-result.json','summon-wave15-result.json','rpg-control-support.json',
  'sir-daniel-sources/browser/sir-daniel-evidence.json','browser/stages-wave15.json'
].map(file=>prefix+file).concat('docs/tactics-universes-2026-10-26/result.json');
export const finalReviewPaths=[
  'browser/native-part-a-visual-review-final.json','browser/native-part-b-visual-review-final.json',
  'browser/native-part-c-visual-review-final.json','browser/native-visual-review-final.json',
  'browser/base-visual-review-final.json','browser/visual-review-final.json',
  'browser/stages-visual-review-final.json','sir-daniel-sources/browser/sir-daniel-visual-review.json',
  'rpg-control-support-visual-review.json'
].map(file=>prefix+file).concat('docs/tactics-universes-2026-10-26/visual-review-final.json');
const expectedCommands=[['node','scripts/buildRiftDossierCatalog.mjs','--refresh-character-reference-audit'],
  ['python','scripts/auditCharacterReferenceQuality.py'],['node','scripts/buildRiftDossierCatalog.mjs'],
  ['node','scripts/buildRiftDossierAssetRegistry.mjs'],['npm','run','rift:audit']];

export function assertReviewWindow(execution,freezeCreatedAt,reviewCreatedAt,{browser=true}={}){
  assert.ok(time(execution.startedAt)>=time(freezeCreatedAt),'Fresh proof began before the current freeze');
  assert.ok(time(execution.startedAt)<=time(execution.finishedAt));
  assert.ok(time(execution.finishedAt)<=time(reviewCreatedAt),'Proof finished after its review gate');
  if(browser){assert.equal(execution.allBrowserWindowsClosed,true);assert.ok(time(execution.browserClosedAt)<=time(execution.finishedAt));}
}

export function verifyCurrentReviewBindings(value){
  if(!value||typeof value!=='object')return;
  if(typeof value.path==='string'&&typeof value.sha256==='string')verifyFile(value);
  for(const key of ['manifest','sourceReport'])if(typeof value[key]==='string'){
    const digest=value[key+'Sha256']||value[key+'SHA'];assert.equal(typeof digest,'string','Missing '+key+' SHA');verifyFile({path:value[key],sha256:digest});
  }
  if(value.productionFreezePath)verifyFile({path:value.productionFreezePath,sha256:value.productionFreezeSha256});
  for(const child of Object.values(value))verifyCurrentReviewBindings(child);
}

export function validateCompletedRift({ readJson=json }={}){
  const verified=new Map(),check=record=>{const result=verifyFile(record);verified.set(result.path,result);return result;};
  const index=readJson(completedArchivePath);check(fingerprint(completedArchivePath));
  assert.equal(index.mode,'completed-refresh-execution-archive');check(index.manifest);
  const archive=readJson(index.manifest.path),records=new Map();
  for(const record of archive.files){assert.ok(!records.has(record.originalPath));records.set(record.originalPath,record);}
  function archived(logicalPath,expectedSha){
    const record=records.get(logicalPath);assert.ok(record,'Missing archived original: '+logicalPath);
    assert.equal(record.preservation,'byte-identical-copy');
    if(expectedSha)assert.equal(record.sha256,expectedSha,logicalPath);
    check({path:record.archivedPath,sha256:record.sha256,bytes:record.bytes});
    return {record,value:readJson(record.archivedPath)};
  }
  function immutable(logicalPath){
    const saved=archived(logicalPath),actual=check({path:logicalPath,sha256:saved.record.sha256,bytes:saved.record.bytes});
    const value=readJson(logicalPath);assert.deepEqual(value,saved.value,logicalPath);return {value,actual};
  }
  const {value:refresh,actual:refreshResult}=immutable(prefix+'rift-refresh/result.json');
  const {value:summary,actual:refreshSummary}=immutable(prefix+'rift-refresh/summary.json');
  const {value:integrity,actual:finalIntegrity}=immutable(prefix+'rift-refresh/final-integrity.json');
  const {value:authorization,actual:referenceAuthorization}=immutable(prefix+'rift-refresh/authorization.json');
  const {value:writeGate,actual:originalFinalWriteGate}=immutable(originalGatePath);
  assert.equal(refresh.phase,'complete');assert.equal(refresh.success,true);assert.equal(refresh.sourceFilesUnchanged,true);
  assert.deepEqual(refresh.finalWriteGate,writeGate);assert.deepEqual(refresh.authorization,authorization);
  for(const flag of ['authorized','productionFrozen','allBrowserWindowsClosed','rootFinalSignalReceived'])assert.equal(writeGate[flag],true);
  assert.equal(authorization.authorized,true);assert.equal(authorization.referenceInputsFrozen,true);
  assert.equal(refresh.steps.length,5);
  for(const [i,step]of refresh.steps.entries()){
    assert.deepEqual(step.argv,expectedCommands[i]);assert.equal(step.exitCode,0);
    assert.equal(step.receiptOrigin,'observed-python-subprocess-wait-and-output-join');
    assert.ok(time(step.startedAt)<=time(step.finishedAt));if(i)assert.ok(time(refresh.steps[i-1].finishedAt)<=time(step.startedAt));
    check({path:prefix+'rift-refresh/'+step.log,sha256:step.logSha256});
  }
  assert.ok(time(authorization.createdAt)<=time(refresh.startedAt));assert.ok(time(refresh.startedAt)<=time(refresh.steps[0].startedAt));
  assert.ok(time(refresh.steps[1].finishedAt)<=time(writeGate.createdAt));assert.ok(time(writeGate.createdAt)<=time(refresh.steps[2].startedAt));
  assert.ok(time(refresh.steps[4].finishedAt)<=time(refresh.finishedAt));assert.ok(time(refresh.finishedAt)<=time(index.createdAt));
  const oldFreeze=archived(writeGate.productionFreeze.path,writeGate.productionFreeze.sha256);
  assert.equal(oldFreeze.value.productionFrozen,true);assert.ok(time(oldFreeze.value.createdAt)<=time(writeGate.createdAt));
  assert.deepEqual(sorted(writeGate.finalReports.map(r=>r.path)),sorted(finalProofPaths));
  const originalFinalReports=writeGate.finalReports.map(report=>{
    const saved=archived(report.path,report.sha256),execution=saved.value.execution||saved.value;
    assert.equal(saved.value.passed,true);assert.ok(time(execution.startedAt)>=time(oldFreeze.value.createdAt));
    assert.ok(time(execution.startedAt)<=time(execution.finishedAt));assert.equal(execution.finishedAt,report.finishedAt);
    assert.ok(time(execution.finishedAt)<=time(writeGate.createdAt));
    return {logicalPath:report.path,...check({path:saved.record.archivedPath,sha256:report.sha256,bytes:saved.record.bytes})};
  });
  assert.equal(integrity.passed,true);assert.equal(integrity.success,true);assert.equal(integrity.hashChecks,147);
  assert.equal(integrity.files.length,147);assert.equal(new Set(integrity.files.map(r=>r.path)).size,147);
  assert.equal(integrity.referencesChecked,120);assert.deepEqual(integrity.fiveCommandExitCodes,[0,0,0,0,0]);
  for(const record of integrity.files){const saved=records.get(record.path);assert.ok(saved);assert.equal(saved.sha256,record.sha256);check(record);check({path:saved.archivedPath,sha256:record.sha256,bytes:saved.bytes});}
  assert.deepEqual(refresh.sourceSha256Before,refresh.sourceSha256After);
  assert.equal(Object.keys(refresh.sourceSha256After).length,4);assert.equal(Object.keys(refresh.generatedSha256After).length,3);
  for(const hashes of [refresh.sourceSha256After,refresh.generatedSha256After])for(const [path,sha256]of Object.entries(hashes))check({path,sha256});
  assert.deepEqual(summary.finalOutputSha256,refresh.generatedSha256After);assert.deepEqual(summary.sourceSha256After,refresh.sourceSha256After);
  for(const flag of ['success','historicalAuditScriptsUnchanged','historicalCatalogBuildersUnchanged','packageUnchanged','qualityThresholdsUnchanged','knownCaseExpectationsUnchanged','manualReferencePinsUnchanged','qualityBindsCurrentReferenceHashes'])assert.equal(summary[flag],true);
  assert.ok(Object.values(summary.qualityConstantsUnchanged).every(value=>value===true));
  const receipt=refresh.continuation.referencePhaseReceipt;check(receipt);const first=readJson(receipt.path);
  assert.equal(refresh.continuation.mode,'planned-final-write-phase');assert.equal(first.phase,'awaiting-final-write-gate');assert.equal(first.success,null);
  assert.deepEqual(first.steps,refresh.steps.slice(0,2));assert.equal(first.startedAt,refresh.startedAt);assert.deepEqual(first.authorization,authorization);
  const quality=readJson('docs/rift-dossiers/character-reference-quality.json'),qualityRows=new Map(quality.referenceFiles.map(r=>[r.path,r]));
  assert.equal(authorization.references.length,120);assert.equal(new Set(authorization.references.map(r=>r.id)).size,120);
  assert.equal(summary.authorizedReferenceClassifications.length,120);
  const references=authorization.references.map(reference=>{
    check({path:'public'+reference.sheet,sha256:reference.sha256});const measured=qualityRows.get(reference.sheet);
    assert.ok(measured);assert.equal(measured.metrics.fileSha256,reference.sha256);assert.equal(measured.classification,'approved');
    const matches=summary.authorizedReferenceClassifications.filter(row=>row.id===reference.id);assert.equal(matches.length,1);
    const row=matches[0];for(const key of ['sha256','qualityReportedSha256','authorizedSha256'])assert.equal(row[key],reference.sha256);
    assert.equal(row.path,reference.sheet);assert.equal(row.classification,measured.classification);return reference;
  });
  const snapshot={mode:'completed-refresh-revalidation',authorizesRiftWrites:false,archiveIndex:fingerprint(completedArchivePath),archiveManifest:index.manifest,
    originalFinalWriteGate,originalProductionFreezeArchive:{logicalPath:writeGate.productionFreeze.path,path:oldFreeze.record.archivedPath,sha256:oldFreeze.record.sha256,bytes:oldFreeze.record.bytes},
    originalFinalReports,refreshResult,refreshSummary,finalIntegrity,referenceAuthorization,originalExecutionStartedAt:refresh.startedAt,originalExecutionFinishedAt:refresh.finishedAt,
    sourceHashes:refresh.sourceSha256After,outputHashes:refresh.generatedSha256After,referencesSha256:sha(JSON.stringify(references)),referenceCount:120,integrityFileCount:147,
    verifiedFiles:[...verified.values()].sort((a,b)=>a.path.localeCompare(b.path))};
  return {refresh,summary,integrity,authorization,writeGate,snapshot};
}

export function resolveRiftReviewContext(){
  const freeze=json(prefix+'production-freeze.json'),refresh=json(prefix+'rift-refresh/result.json'),writeGate=json(originalGatePath);
  if(freeze.riftReviewMode!=='completed-refresh-revalidation'){
    assert.ok(freeze.riftReviewMode===undefined||freeze.riftReviewMode==='initial-transition');
    return {mode:'initial-transition',freeze,refresh,writeGate,reviewBarrier:writeGate,reviewBarrierPath:originalGatePath,allowTransition:true};
  }
  const completed=validateCompletedRift();assert.deepEqual(freeze.completedRiftAtFreeze,completed.snapshot);
  assert.equal(freeze.intentionalPostBrowserTransition,null);assert.ok(time(refresh.finishedAt)<=time(freeze.createdAt));
  const review=json(completedReviewPath);assert.equal(review.mode,'completed-refresh-revalidation');assert.equal(review.reviewApproved,true);assert.equal(review.authorizesRiftWrites,false);
  for(const flag of ['productionFrozen','allBrowserWindowsClosed','rootFinalSignalReceived'])assert.equal(review[flag],true);
  verifyFile(review.productionFreeze);assert.equal(review.productionFreeze.sha256,fingerprint(prefix+'production-freeze.json').sha256);
  assert.deepEqual(review.completedRift,completed.snapshot);assert.ok(time(freeze.createdAt)<=time(review.createdAt));
  assert.deepEqual(sorted(review.finalReports.map(row=>row.path)),sorted(finalProofPaths));
  for(const record of review.finalReports){verifyFile(record);const value=json(record.path),execution=value.execution||value;assert.equal(value.passed,true);
    assertReviewWindow({...execution,allBrowserWindowsClosed:execution.allBrowserWindowsClosed??value.allBrowserWindowsClosed},freeze.createdAt,review.createdAt,{browser:!record.path.endsWith('summon-runtime-result.json')});assert.equal(record.finishedAt,execution.finishedAt);}
  assert.deepEqual(sorted(review.finalReviews.map(row=>row.path)),sorted(finalReviewPaths));
  for(const record of review.finalReviews){verifyFile(record);const value=json(record.path);assert.equal(value.passed,true);assert.equal(value.preliminary,false);assert.ok(time(value.reviewedAt)>=time(freeze.createdAt));assert.ok(time(value.reviewedAt)<=time(review.createdAt));verifyCurrentReviewBindings(value);}
  return {mode:'completed-refresh-revalidation',freeze,refresh,writeGate,reviewBarrier:review,reviewBarrierPath:completedReviewPath,allowTransition:false,completed};
}
