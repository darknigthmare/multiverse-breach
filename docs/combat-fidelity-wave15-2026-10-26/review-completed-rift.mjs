// Review a previously completed refresh after a new freeze and fresh browsers.
// This command cannot run Rift, release writes, or alter original receipts.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { prefix,json,fingerprint,verifyFile,verifyHashes,validateFreeze,writeReports,time,exists } from './closure-support.mjs';
import { validateCompletedRift,completedReviewPath,finalProofPaths,finalReviewPaths,verifyCurrentReviewBindings } from './rift-review-support.mjs';
assert.ok(process.argv.includes('--all-final-browsers-closed'));
assert.ok(process.argv.includes('--completed-refresh-outputs-unchanged'));
assert.equal(exists(completedReviewPath),false,'Archive the previous review receipt; never overwrite a review gate');
const completed=validateCompletedRift(),freeze=validateFreeze();
assert.equal(freeze.riftReviewMode,'completed-refresh-revalidation');assert.deepEqual(freeze.completedRiftAtFreeze,completed.snapshot);
const reports=new Map();
const finalReports=finalProofPaths.map(path=>{
  const value=json(path),execution=value.execution||value;assert.equal(value.passed,true,path);
  if(value.preliminary!==undefined)assert.equal(value.preliminary,false,path);if(value.phase!==undefined)assert.equal(value.phase,'final',path);
  assert.ok(time(execution.startedAt)>=time(freeze.createdAt));assert.ok(time(execution.startedAt)<=time(execution.finishedAt));
  if(!path.endsWith('summon-runtime-result.json')){
    assert.equal(execution.allBrowserWindowsClosed??value.allBrowserWindowsClosed,true,path);
    assert.ok(time(execution.browserClosedAt)<=time(execution.finishedAt));
  }
  for(const key of ['pageErrors','errors'])if(value[key])assert.deepEqual(value[key],[],path);
  for(const [before,after]of [['sourceHashesBefore','sourceHashesAfter'],['sourceFiles','sourceFilesAfter']])if(value[before])assert.deepEqual(value[before],value[after]);
  for(const hashes of [value.sourceHashesAfter,value.sourceFilesAfter,value.inputHashes])if(hashes)verifyHashes(hashes,{allowTransition:false});
  if(value.resources)for(const record of value.resources)verifyFile(record);
  for(const artifact of value.artifacts||[])verifyFile(artifact);
  const harness=value.harness||value.validator;if(harness){const digest=value.harnessSha256||value.validatorSha256;assert.equal(freeze.files[harness],digest);verifyFile({path:harness,sha256:digest});}
  reports.set(path,{value,execution});return {...fingerprint(path),startedAt:execution.startedAt,finishedAt:execution.finishedAt,browserClosedAt:execution.browserClosedAt};
});
const finalReviews=finalReviewPaths.map(path=>{
  const value=json(path);assert.equal(value.passed,true,path);assert.equal(value.preliminary,false,path);
  assert.equal(value.previousReview,undefined,'A fresh review cannot carry an earlier review as current evidence');
  assert.equal(value.previousExecutionArchive,undefined,'Build fresh review metadata from the current reports');
  assert.ok(time(value.reviewedAt)>=time(freeze.createdAt));
  const source=path.includes('tactics-universes')?'docs/tactics-universes-2026-10-26/result.json':path.includes('sir-daniel')?prefix+'sir-daniel-sources/browser/sir-daniel-evidence.json':path.includes('stages-')?prefix+'browser/stages-wave15.json':path.includes('rpg-control-support')?prefix+'rpg-control-support.json':path.includes('base-visual')?prefix+'browser/base-corrections.json':prefix+'browser/native-presentations.json';
  assert.ok(time(value.reviewedAt)>=time(reports.get(source).execution.browserClosedAt));
  verifyCurrentReviewBindings(value);return {...fingerprint(path),reviewedAt:value.reviewedAt};
});
const processes=execFileSync('ps',['-eo','pid=,stat=,comm='],{encoding:'utf8'}).split('\n').map(line=>line.trim().split(/\s+/)).filter(([,state,command])=>command?.includes('chromium')&&!state.startsWith('Z'));
assert.deepEqual(processes,[],'A Chromium process is still running');
const result={schemaVersion:1,mode:'completed-refresh-revalidation',reviewApproved:true,authorizesRiftWrites:false,createdAt:new Date().toISOString(),reviewedBy:'/root',
  productionFrozen:true,allBrowserWindowsClosed:true,rootFinalSignalReceived:true,productionFreeze:fingerprint(prefix+'production-freeze.json'),completedRift:completed.snapshot,
  finalReports,finalReviews,observedLiveChromiumProcesses:processes,
  basis:'Fresh proofs reviewed after the current freeze against already completed, unchanged Rift outputs. The original five-command execution and original final-write authorization remain intact. No refresh or additional write was run.'};
for(const report of finalReports)assert.ok(time(report.finishedAt)<=time(result.createdAt));for(const review of finalReviews)assert.ok(time(review.reviewedAt)<=time(result.createdAt));
validateFreeze();validateCompletedRift();writeReports([[completedReviewPath,result]]);
console.log(JSON.stringify({reviewApproved:!process.argv.includes('--check-only'),authorizesRiftWrites:false,createdAt:result.createdAt,reports:finalReports.length,reviews:finalReviews.length,checkOnly:process.argv.includes('--check-only')}));
