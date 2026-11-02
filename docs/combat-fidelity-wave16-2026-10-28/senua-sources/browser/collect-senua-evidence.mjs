import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
export const base='docs/combat-fidelity-wave16-2026-10-28/senua-sources/browser';
export const FLOW_IDS=Object.freeze(['core','movement','super','physical-ledge','attack','guard']);
const archive=path.dirname(base),packing=JSON.parse(await fs.readFile(archive+'/packing-plan.json','utf8'));
async function list(dir){const result=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())result.push(...await list(p));else result.push(p);}return result;}
const ownHelpers=(await list(archive)).filter(p=>p.endsWith('.mjs'));
export const resourcePaths=[...new Set([...(await list('src')), ...ownHelpers, archive+'/packing-plan.json',archive+'/source-row-review.json',archive+'/native-hand-points.json',archive+'/hand-measurements.json',archive+'/actual-tool-calls.json',packing.reference.savedImage,...packing.sources.flatMap(s=>[s.image,s.promptFile]),...packing.atlases.map(a=>packing.outputDir+'/'+a.id+'.png')])].sort();
export async function fingerprint(file){const b=await fs.readFile(file);return{path:file,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')};}
export async function resourceSnapshot(){return Promise.all(resourcePaths.map(fingerprint));}
export async function collect({execution,outputBase=base,preliminary=false}){
 assert.equal(execution.commands.length,6);assert.equal(execution.allBrowserWindowsClosed,true);assert.deepEqual(execution.resourcesBefore,execution.resourcesAfter);
 const flows=[];for(const id of FLOW_IDS){const p=outputBase+'/senua-'+id+'-result.json',r=JSON.parse(await fs.readFile(p,'utf8'));assert.equal(r.passed,true);assert.equal(r.preliminary,preliminary);assert.equal(r.allBrowserWindowsClosed,true);assert.equal(r.productionInputsStableDuringRun,true);assert.deepEqual(r.pageErrors,[]);assert.deepEqual(r.resourcesBefore,execution.resourcesBefore);flows.push({id,report:await fingerprint(p),closure:await fingerprint(outputBase+'/senua-'+id+'-closure.json'),harness:await fingerprint(base+'/senua-'+id+'-browser.mjs')});}
 const read=async id=>JSON.parse(await fs.readFile(outputBase+'/senua-'+id+'-result.json','utf8'));
 const core=await read('core'),move=await read('movement'),focus=await read('super'),ledge=await read('physical-ledge'),attack=await read('attack'),guard=await read('guard');
 assert.equal(core.states,45);assert.equal(core.distinctCorePoses,180);assert.equal(core.coreFrameDraws,360);assert.equal(core.gripFrameDraws,8);
 for(const s of ['jumpRise','fall','land','turn'])assert.deepEqual(move.summary[s].columns,[0,1,2,3]);assert.equal(move.pause.unchanged,true);
 assert.equal(focus.final.hitCount,0);assert.equal(focus.final.hp,100000);assert.equal(focus.impact.hit.support.buffMultiplier,1.45);assert.equal(focus.sameInput.retriggered,false);assert.deepEqual(focus.sourceDraws.columns,[0,1,2,3]);
 assert.equal(ledge.caseCount,20);assert.equal(ledge.attachedDraws,32);assert.equal(attack.summary.damageEvents,1);assert.deepEqual(guard.summary.states.shieldHold.columns,[0,1,2,3]);
 const captures=(await list(outputBase)).filter(p=>p.endsWith('.png')&&!p.includes('failure'));return{passed:true,heroId:'hellblade_senua',generatedAt:new Date().toISOString(),preliminary,phase:preliminary?'preliminary':'final',source1to1Verified:false,allBrowserWindowsClosed:true,counts:{flows:6,keyboardFlows:4,controlledFlows:2,states:45,nativePoses:180,coreDraws:360,controlledGripDraws:8,physicalLedgeCases:20,physicalGripDraws:32},scope:'Four actual GameCanvas keyboard flows (movement, support Focus, light attack, sword parry), controlled360-draw renderer sheet and real-engine20-case ledge study. Original generated adaptation; no official animation certification.',execution,flows,captures:await Promise.all(captures.map(fingerprint)),limitations:['Opponent facing mirrors equipment and anatomical asymmetries.','Ledge physical study uses real engine/runtime calls; it is counted separately from keyboard flows.','2017 official cosplay PDF fetch blocked403; linked source and textual mirror are documented without claiming PDF inspection.']};
}
