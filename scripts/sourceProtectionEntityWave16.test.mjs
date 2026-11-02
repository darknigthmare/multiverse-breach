import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import registry from '../src/game/combat/sourceProtectionEntitiesWave16.generated.json' with {type:'json'};
import {createProtectionEntityVisualWave16 as create,advanceProtectionEntityVisualWave16 as advance,
 absorbProtectionEntityVisualWave16 as absorb,sampleProtectionEntityVisualWave16 as sample} from '../src/game/combat/protectionEntityRuntimeWave16.js';
import {getSourceProtectionEntityFrameWave16 as frame} from '../src/game/combat/sourceProtectionEntityCatalogWave16.js';
const root=new URL('../',import.meta.url),docs='docs/combat-fidelity-wave16-2026-10-28/';
const read=p=>fs.readFile(new URL(p,root)),json=async p=>JSON.parse(await read(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const actor=()=>({id:'cuphead_ms_chalice',battleId:'hero:chalice',universe:'Cuphead',currentHp:100,x:300,y:350,facing:1});
const shield=()=>({kind:'shield-pal-one-hit',active:true,ownerRuntimeId:'hero:chalice',charges:1});

test('autonomous Shield Pal contains sixteen genuinely distinct complete alpha cells from its actual generated source',async()=>{
 assert.equal(registry.entries.length,1);const asset=registry.entries[0];assert.equal(asset.kind,'protection-entity');assert.equal(asset.frames,16);
 assert.equal(sha(await read('public'+asset.sheet)),asset.sha256);assert.equal(sha(await read(asset.sourceImage)),asset.sourceImageSha256);
 assert.equal(asset.sourceImages.length,1);assert.equal(asset.sourceImages[0].path,asset.sourceImage);assert.notEqual(asset.sourceImage,asset.referenceImage);
 assert.equal(asset.visualValidation.distinctCells,16);assert.equal(new Set(asset.visualValidation.frameHashes).size,16);
 const{data,info}=await sharp(await read('public'+asset.sheet)).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.deepEqual([info.width,info.height,info.channels],[1024,1024,4]);
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){let opaque=0;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){const a=data[((row*256+y)*1024+col*256+x)*4+3];if(a>24)opaque++;if(x<12||x>=244||y<12||y>=244)assert.equal(a,0);}
  assert.ok(opaque>500);
 }
 const review=await json(docs+'shield-pal-sources/artwork-review.json');assert.equal(review.actuallyViewed,true);assert.equal(review.heartAnchors.length,16);assert.ok(review.heartAnchors.every(p=>p.centerAlpha>200));
});
test('protection artwork provenance separates the rejected eye design, official references and unchanged RPG/historical assets',async()=>{
 const proof=await json(docs+'source-protection-entity-provenance.json');assert.equal(proof.category,'persistentProtection');
 assert.deepEqual([proof.actualGenerationCalls,proof.observedNativePoses,proof.retainedNativePoses,proof.excludedNativePoses],[2,32,16,16]);
 assert.equal(proof.affectsRpgSummonCounters,false);assert.equal(proof.references.length,4);assert.ok(proof.references.every(r=>r.referenceOnly&&!r.countsAsNewGeneratedDrawing));
 for(const item of proof.references)assert.equal(sha(await read(item.file)),item.sha256);
 for(const item of proof.excludedAttempts)assert.equal(sha(await read(item.image)),item.sha256);
 const rpg=await json('src/game/combat/summonAnimationsWave16.generated.json');assert.equal(rpg.entries.length,7);assert.equal(rpg.entries.reduce((n,a)=>n+a.frames,0),112);
 const old=await json(docs+'rpg-historical-assets-before.json');assert.equal(old.count,55);for(const asset of[...old.entries,...rpg.entries])assert.equal(sha(await read('public'+asset.sheet)),asset.sha256);
});
test('visual lifecycle plays all sixteen cells, waits through the native cast and persists until exactly one absorbed hit',()=>{
 const owner=actor(),protection=shield(),snapshot=JSON.stringify({owner,protection});let state=create(owner,protection);assert.ok(state);
 assert.equal(advance(state,10,{casterAnimating:true}),state);state=advance(state,.001,{casterAnimating:false});
 const indices=new Set(),phases=[];const record=()=>{const f=sample(state);if(f){indices.add(f.index);if(phases.at(-1)!==f.phase)phases.push(f.phase);}};
 for(let n=0;n<70;n++){record();state=advance(state,1/60);}assert.equal(state.phase,'guard');
 state=advance(state,60);assert.equal(state.phase,'guard');assert.equal(state.active,true);
 const paused=state;assert.equal(advance(state,10,{paused:true}),paused);
 state=absorb(state);assert.equal(state.absorptionCount,1);assert.equal(absorb(state),state);
 for(let n=0;n<60;n++){record();state=advance(state,1/60);}
 assert.equal(state.active,false);assert.equal(sample(state),null);assert.deepEqual([...indices].sort((a,b)=>a-b),Array.from({length:16},(_,i)=>i));
 assert.deepEqual(phases,['arrival','guard','absorb','departure']);assert.equal(JSON.stringify({owner,protection}),snapshot,'visuals must not spend resources, HP or shield charges');
});
test('catalog projection stays cosmetic, follows both real facings and rejects hidden, dead or wrong-owner states',()=>{
 const owner=actor();let state=create(owner,shield());owner.sourceProtectionEntityWave16=state;assert.equal(frame(owner),null);
 state=advance(state,.01,{casterAnimating:false});owner.sourceProtectionEntityWave16=state;
 const before=JSON.stringify(owner),right=frame(owner,72);assert.equal(right.asset.id,'shield-pal-wave16');assert.equal(right.extraProtectionCharges,0);assert.equal(right.visualOnly,true);assert.equal(JSON.stringify(owner),before);
 const left=frame({...owner,facing:-1},72);assert.equal(right.facing,1);assert.equal(left.facing,-1);assert.equal(right.x-owner.x,owner.x-left.x);assert.equal(right.y,left.y);
 assert.equal(frame({...owner,currentHp:0}),null);assert.equal(frame({...owner,battleId:'wrong-owner'}),null);assert.equal(frame(owner,NaN),null);
});
