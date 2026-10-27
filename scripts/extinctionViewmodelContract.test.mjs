import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verifyExtinctionViewmodelContract, verifyExtinctionRendererBinding } from './extinctionViewmodelContract.mjs';
import { getExtinctionViewmodel, getExtinctionHandFrame, getExtinctionHandSourceRect, getExtinctionHandPlacement, getExtinctionProjectilePlacement } from '../src/game/extinctionContent.js';
test('progression contract executes current owner, reload, crop, pickup and aspect rules',()=>assert.equal(verifyExtinctionViewmodelContract(),true));
test('the audit fails for wrong Mirelle row count',()=>assert.throws(()=>verifyExtinctionViewmodelContract(hero=>{const p=getExtinctionViewmodel(hero);return p.layout?{...p,layout:{...p.layout,rows:4}}:p;})));
test('the audit fails if reload loses the source bleed trim',()=>assert.throws(()=>verifyExtinctionViewmodelContract(getExtinctionViewmodel,(p,s)=>{const f=getExtinctionHandFrame(p,s);return f&&s.reloadPulse?{...f,trim:{}}:f;})));
test('the audit fails if a cell spills into its neighbour',()=>assert.throws(()=>verifyExtinctionViewmodelContract(getExtinctionViewmodel,getExtinctionHandFrame,()=>({x:0,y:0,w:3000,h:3000}))));
test('all four trim edges are bounded to the declared cell without mutating input',()=>{
 const f={columns:4,rows:10,col:2,row:6,trim:{left:14,right:8,top:40,bottom:6}}, before=structuredClone(f);
 assert.deepEqual(getExtinctionHandSourceRect(f,1024,2560),{x:526,y:1576,w:234,h:210});assert.deepEqual(f,before);
 assert.deepEqual(getExtinctionHandSourceRect({...f,trim:{left:1000,right:1000,top:1000,bottom:1000}},1024,2560),{x:767,y:1791,w:1,h:1});
});
test('unloaded sizes and invalid layouts return no crop',()=>{
 const f={columns:4,rows:10,col:0,row:0};
 for(const [w,h] of [[0,2560],[1024,0],[NaN,2560],[1024,Infinity],[-1,100],[1,1]])assert.equal(getExtinctionHandSourceRect(f,w,h),null);
 for(const bad of [{row:10},{row:-1},{col:4},{columns:0},{rows:2.5},{col:NaN}])assert.equal(getExtinctionHandSourceRect({...f,...bad},1024,2560),null);
});
test('placement contains square, wide and tall sources across screen formats',()=>{
 for(const [w,h] of [[840,430],[390,844],[844,390],[2560,1080]]) for(const source of [{w:256,h:210},{w:200,h:500},{w:500,h:100}]) {
  const box=getExtinctionHandPlacement(source,w,h,{vx:Infinity,turnVel:-10000});
  assert.ok(box.x>=0&&box.x+box.w<=w&&box.y>=0&&box.y+box.h<=h);
  assert.ok(Math.abs(box.w/box.h-source.w/source.h)<1e-9);assert.ok(box.y>=h*.5);
 }
 assert.equal(getExtinctionHandPlacement(null,840,430),null);
});

test('projectile overlay keeps its own aspect without changing timing or simulation',()=>{
 const box=getExtinctionProjectilePlacement(256,122,840,430);
 assert.ok(Math.abs(box.w/box.h-256/122)<1e-9);assert.ok(box.x>=0&&box.y>=0&&box.x+box.w<=840&&box.y+box.h<=430);
 assert.equal(getExtinctionProjectilePlacement(0,122,840,430),null);
});

const hubSource = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
test('progression hookup accepts the selected owner instead of a hardcoded Mirelle constant', () => {
  assert.equal(verifyExtinctionRendererBinding(hubSource), true);
});
for (const [name, before, after] of [
  ['wrong owner', 'getExtinctionViewmodel(selectedHero)', "getExtinctionViewmodel({id:'arca_mirelle'})"],
  ['borrowed hands', 'hands.src = viewmodel.src;', "hands.src = '/borrowed-hands.png';"],
  ['unbound hand reference', 'fpsHandsRef.current = hands;', 'fpsHandsRef.current = null;'],
  ['borrowed effect', 'projectile.src = viewmodel.projectile;', "projectile.src = '/borrowed-effect.png';"],
  ['unbound effect reference', 'fpsProjectileRef.current = projectile;', 'fpsProjectileRef.current = null;']
]) test(`progression hookup rejects ${name}`, () => {
  assert.ok(hubSource.includes(before));
  assert.throws(() => verifyExtinctionRendererBinding(hubSource.replace(before, after)), /hookup missing/);
});
