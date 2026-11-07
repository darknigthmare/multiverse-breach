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

for (const [id, width, height, separatorsX, separatorsY] of [
  ['arthur_kaamelott', 792, 1980, [0, 198, 395, 593, 791], [0, 202, 404, 607]],
  ['serj_tankian', 796, 1990, [0, 199, 395, 592, 792], [0, 203, 407, 610]]
]) test(`${id}: authored first-person cells exclude the PNG separators in all four phases`, () => {
  const profile = getExtinctionViewmodel({ id });
  const before = structuredClone(profile);
  for (const [state, row] of [[{}, 0], [{ vx: 1 }, 1], [{ muzzle: 3 }, 2], [{ reloadPulse: 3 }, 0]]) {
    for (let col = 0; col < 4; col += 1) {
      const frame = getExtinctionHandFrame(profile, { ...state, t: col * 12 });
      assert.equal(frame.row, row, 'state mapping remains unchanged, including idle as reload fallback');
      const rect = getExtinctionHandSourceRect(frame, width, height);
      assert.ok(rect.x > separatorsX[col] && rect.x + rect.w <= separatorsX[col + 1]);
      assert.ok(rect.y > separatorsY[row] && rect.y + rect.h <= separatorsY[row + 1]);
      assert.ok(rect.w >= 190 && rect.h >= 198, 'exclude grid lines without reducing the hands to a small fragment');
      for (const [screenW, screenH] of [[390, 844], [844, 390], [1280, 900], [2560, 1080]]) {
        const placed = getExtinctionHandPlacement(rect, screenW, screenH);
        assert.ok(Math.abs(placed.w / placed.h - rect.w / rect.h) < 1e-9);
        assert.ok(placed.x >= 0 && placed.y >= 0 && placed.x + placed.w <= screenW && placed.y + placed.h <= screenH);
      }
      assert.deepEqual(getExtinctionHandSourceRect(frame, width * 2, height * 2), Object.fromEntries(Object.entries(rect).map(([key, value]) => [key, value * 2])));
      assert.equal(getExtinctionHandSourceRect(frame, width + 1, height), null, 'a changed atlas aspect must not reuse stale authored bounds');
    }
  }
  assert.deepEqual(profile, before);
  assert.equal(getExtinctionHandFrame(profile, { weapon: { type: 'shotgun' } }), null);
  assert.equal(getExtinctionViewmodel({ id, activeSkin: { id: 'unbound' } }).src, '');
});

test('invalid authored source cells fall back instead of sampling a different asset region', () => {
  const frame = getExtinctionHandFrame(getExtinctionViewmodel({ id: 'serj_tankian' }));
  for (const patch of [{ x: -1 }, { y: NaN }, { w: 0 }, { h: 2000 }, { width: 0 }, { height: Infinity }]) {
    assert.equal(getExtinctionHandSourceRect({ ...frame, sourceCell: { ...frame.sourceCell, ...patch } }, 796, 1990), null);
  }
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
