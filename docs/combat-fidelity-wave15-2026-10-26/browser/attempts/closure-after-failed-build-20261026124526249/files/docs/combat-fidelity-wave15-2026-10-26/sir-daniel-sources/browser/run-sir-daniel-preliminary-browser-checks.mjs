import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { base, FLOW_IDS, fingerprint, resourceSnapshot } from './collect-sir-daniel-evidence.mjs';
const startedAt=new Date().toISOString(),stamp=startedAt.replaceAll(/[-:.]/g,'');
const outputBase=base+'/preliminary-'+stamp;
await fs.mkdir(outputBase,{recursive:true});
const before=await resourceSnapshot(),commands=[];
let passed=true;
for(const id of FLOW_IDS){
 const script=`${base}/sir-daniel-${id}-browser.mjs`,startedAt=new Date().toISOString(),output=[];
 let spawnError=null;
 const observed=await new Promise(resolve=>{const child=spawn(process.execPath,[script],{env:{...process.env,SIR_DANIEL_BROWSER_OUTPUT:outputBase},stdio:['ignore','pipe','pipe']});child.stdout.on('data',chunk=>output.push(chunk));child.stderr.on('data',chunk=>output.push(chunk));child.once('error',error=>{spawnError=error.message;});child.once('close',(exitCode,signal)=>resolve({exitCode,signal}));});
 const log=`${outputBase}/sir-daniel-${id}.log`;await fs.writeFile(log,Buffer.concat(output));
 const command={id,script,argv:[process.execPath,script],startedAt,finishedAt:new Date().toISOString(),...observed,spawnError,receiptOrigin:'node-child-process-close-event',log,logSha256:(await fingerprint(log)).sha256};commands.push(command);
 console.log(JSON.stringify(command));
 if(observed.exitCode!==0||observed.signal||spawnError){passed=false;break;}
 const report=JSON.parse(await fs.readFile(`${outputBase}/sir-daniel-${id}-result.json`));
 assert.equal(report.passed,true);assert.equal(report.preliminary,true);assert.equal(report.phase,'preliminary');assert.equal(report.allBrowserWindowsClosed,true);
 command.report=await fingerprint(`${outputBase}/sir-daniel-${id}-result.json`);command.browserClosedAt=report.browserClosedAt;
}
const after=await resourceSnapshot();
const result={schemaVersion:1,preliminary:true,phase:'preliminary',passed,startedAt,finishedAt:new Date().toISOString(),receiptOrigin:'observed-node-child-process-close-events',commands,resourcesBefore:before,resourcesAfter:after,resourcesUnchangedDuringRun:JSON.stringify(before)===JSON.stringify(after),source1to1Verified:false,limitation:'Preliminary integration run only, before the common production freeze. It is never accepted as final browser evidence.'};
if(!result.resourcesUnchangedDuringRun)result.passed=false;
await fs.writeFile(`${outputBase}/preliminary-run-result.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:result.passed,preliminary:true,outputBase,commands:commands.length}));
process.exitCode=result.passed?0:1;
