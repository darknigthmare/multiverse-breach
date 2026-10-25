// Release the existing authorized refresh only after all final runtime proofs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { writeReports, verifyHashes } from './closure-support.mjs';
const root=new URL('../../',import.meta.url),prefix='docs/combat-fidelity-wave14-2026-10-25/';
assert.ok(process.argv.includes('--all-final-browsers-closed'));
const read=file=>fs.readFileSync(new URL(file,root)),json=file=>JSON.parse(read(file)),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const refresh=json(prefix+'rift-refresh/result.json');
assert.equal(refresh.phase,'awaiting-final-write-gate');assert.equal(refresh.success,null);
verifyHashes(refresh.sourceSha256Before);verifyHashes(refresh.referencePhaseOutputSha256);
assert.equal(refresh.steps.length,2);assert.ok(refresh.steps.every(step=>step.exitCode===0));
const freezePath=prefix+'production-freeze.json',freeze=json(freezePath);assert.equal(freeze.productionFrozen,true);
for(const [path,digest] of Object.entries(freeze.files))assert.equal(sha(read(path)),digest,path);
const paths=['browser/native-presentations.json','browser/base-corrections.json','browser/native-super-runtime.json','summon-runtime-result.json','summon-wave14-result.json','aragorn-sources/browser/aragorn-evidence.json'].map(name=>prefix+name).concat('docs/tactics-universes-2026-10-25/result.json');
const reports=paths.map(path=>{
 const value=json(path);assert.equal(value.passed,true,path);
 if(value.preliminary!==undefined)assert.equal(value.preliminary,false,path);
 if(value.phase!==undefined)assert.equal(value.phase,'final',path);
 const execution=value.execution||value;assert.ok(Date.parse(execution.startedAt)>=Date.parse(freeze.createdAt));
 if(path.includes('aragorn-evidence')){
  assert.equal(value.flows.length,4);assert.equal(value.execution.commands.length,4);assert.ok(value.execution.commands.every(command=>command.exitCode===0));
  for(const flow of value.flows)assert.equal(json(flow.report.path).allBrowserWindowsClosed,true,flow.id);
 }else if(!path.includes('summon-runtime-result'))assert.equal(value.allBrowserWindowsClosed,true,path);
 return {path,sha256:sha(read(path)),finishedAt:execution.finishedAt};
});
const processes=execFileSync('ps',['-eo','pid=,stat=,comm='],{encoding:'utf8'}).split('\n').map(line=>line.trim().split(/\s+/)).filter(([,state,command])=>command?.includes('chromium')&&!state.startsWith('Z'));
assert.deepEqual(processes,[],'A Chromium process is still running; final writes remain blocked');
const output=prefix+'rift-refresh/allow-final-writes.json';assert.equal(fs.existsSync(new URL(output,root)),false);
const gate={schemaVersion:1,authorized:true,authorizedBy:'/root',createdAt:new Date().toISOString(),productionFrozen:true,allBrowserWindowsClosed:true,rootFinalSignalReceived:true,
  productionFreeze:{path:freezePath,sha256:sha(read(freezePath))},finalReports:reports,observedLiveChromiumProcesses:processes,
  basis:'Real step02 exit0 observed, final runtime proofs passed after production freeze, every browser closed, and all frozen production files still match.'};
writeReports([[output,gate]]);console.log(JSON.stringify({authorized:true,createdAt:gate.createdAt,reports:reports.length}));
