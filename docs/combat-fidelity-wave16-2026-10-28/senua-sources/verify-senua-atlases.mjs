import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const dir='docs/combat-fidelity-wave16-2026-10-28/senua-sources',startedAt=new Date().toISOString();
const commands=[['node',[dir+'/build-native-senua-atlases.mjs','--config',dir+'/packing-plan.json','--check']],['node',[dir+'/measure-senua-native-hands.mjs','--check']],['node',['--test','scripts/senuaNativeAssetsWave16.test.mjs','scripts/senuaMeleeWave16.test.mjs']]];
const receipts=[];for(const[command,args]of commands){const at=new Date().toISOString(),r=spawnSync(command,args,{encoding:'utf8'});receipts.push({argv:[command,...args],startedAt:at,finishedAt:new Date().toISOString(),exitCode:r.status,signal:r.signal,stdout:r.stdout,stderr:r.stderr});if(r.status!==0)break;}
const passed=receipts.length===commands.length&&receipts.every(r=>r.exitCode===0&&r.signal===null),result={passed,startedAt,finishedAt:new Date().toISOString(),source1to1Verified:false,commands:receipts};await fs.writeFile(dir+'/verify-all-result.json',JSON.stringify(result,null,2)+'\n');assert.equal(passed,true,'See actual child command logs in verify-all-result.json');console.log(JSON.stringify({passed,commands:receipts.length}));
