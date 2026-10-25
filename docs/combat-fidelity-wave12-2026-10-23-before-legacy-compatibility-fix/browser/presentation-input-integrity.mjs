import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const sha=b=>createHash('sha256').update(b).digest('hex');
async function walk(directory){const list=[];for(const entry of await fs.readdir(new URL(directory,root),{withFileTypes:true})){const p=directory+'/'+entry.name;if(entry.isDirectory())list.push(...await walk(p));else if(/\.(?:js|jsx|json|mjs)$/.test(entry.name))list.push(p);}return list;}
export async function snapshotPresentationInputs(){
 const paths=new Set([...await walk('src/game/combat'),...await walk('src/game/melee'),'package.json','src/game/heroes.js','src/game/renderer.js','src/game/spriteAssets.js','src/game/combatIdentity.js','src/game/engineFighter.js','src/game/engineSmash.js','src/game/engineRpg.js','src/game/engineTactics.js','src/components/GameCanvas.jsx','src/components/FighterMode.jsx']);
 const productionFreezePath='docs/combat-fidelity-wave12-2026-10-23/production-freeze.json',freezeBytes=await fs.readFile(new URL(productionFreezePath,root)),freeze=JSON.parse(freezeBytes);
 assert.equal(freeze.productionFrozen,true,'Production freeze must be final before browser verification');
 for(const path of Object.keys(freeze.files))paths.add(path);
 const baseline=JSON.parse(await fs.readFile(new URL('docs/combat-fidelity-wave12-2026-10-23/runtime-baseline.json',root),'utf8'));
 for(const record of baseline.historicalPngFiles)paths.add('public'+record.sheet);
 for(const p of [...paths].filter(p=>p.endsWith('.json'))){const doc=JSON.parse(await fs.readFile(new URL(p,root)));for(const entry of doc.entries||[])if(typeof entry.sheet==='string'&&entry.sheet.startsWith('/sprites/'))paths.add('public'+entry.sheet);}
 for(const path of ['public/sprites/generated/heroes/rick-morty/morty.png','public/sprites/generated/heroes/harry-potter/harry-potter.png','public/sprites/generated/heroes/harry-potter/hermione-granger.png','public/sprites/generated/heroes/harry-potter/snape.png'])paths.add(path);
 const hashes={};for(const path of [...paths].sort())hashes[path]=sha(await fs.readFile(new URL(path,root)));
 for(const[path,expected]of Object.entries(freeze.files))assert.equal(hashes[path],expected,path+': does not match final production freeze');
 return {hashes,sha256:sha(Buffer.from(JSON.stringify(hashes))),productionFreezePath,productionFreezeSha256:sha(freezeBytes),productionFreezeFileCount:Object.keys(freeze.files).length};
}
export async function finishPresentationIntegrity(before){const after=await snapshotPresentationInputs();assert.deepEqual(after,before,'A production input changed during browser verification');return {productionInputsUnchanged:true,productionInputCount:Object.keys(before.hashes).length,productionInputSha256:before.sha256,productionFreezePath:before.productionFreezePath,productionFreezeSha256:before.productionFreezeSha256,productionFreezeFileCount:before.productionFreezeFileCount};}
export async function hashPresentationArtifacts(paths){const artifacts=[];for(const path of [...new Set(paths)].sort()){const bytes=await fs.readFile(new URL(path,root));artifacts.push({path,sha256:sha(bytes),bytes:bytes.length});}return artifacts;}
