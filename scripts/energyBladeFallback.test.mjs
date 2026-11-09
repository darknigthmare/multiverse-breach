import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { drawFallbackEnergyBlades,getEnergyBladeFallbackGeometry } from '../src/game/energyBladeFallback.js';

function mock() {
  const operations=[];
  const ctx={fillStyle:'',shadowColor:'',shadowBlur:0,fillRect(x,y,w,h){
    operations.push({x,y,w,h,fillStyle:this.fillStyle,shadowColor:this.shadowColor,shadowBlur:this.shadowBlur});
  }};
  return {ctx,operations};
}

test('single, dual and staff sabers keep distinct count and silhouette', () => {
  const single=getEnergyBladeFallbackGeometry('lightsaber');
  const dual=getEnergyBladeFallbackGeometry('dual_lightsaber');
  const staff=getEnergyBladeFallbackGeometry('double_lightsaber');
  assert.equal(single.blades.length,1);
  assert.equal(dual.blades.length,2);
  assert.equal(dual.hilts.length,2);
  assert.equal(staff.blades.length,2);
  assert.equal(staff.hilts.length,1);
  assert.ok(staff.blades[0].x+staff.blades[0].w<=staff.hilts[0].x);
  assert.ok(staff.blades[1].x>=staff.hilts[0].x+staff.hilts[0].w);
  assert.notEqual(single.blades[0].y,dual.blades[0].y);
  for(const plan of [single,dual,staff]) {
    for(const s of [...plan.hilts,...plan.blades])
      assert.ok([s.x,s.y,s.w,s.h].every(Number.isInteger) && s.w>0 && s.h>0);
  }
});

test('canvas fallback draws exactly one/two lit blades without changing persistent sprite assets', () => {
  for(const [type,count,color] of [['lightsaber',1,'#65df73'],['dual_lightsaber',2,'#4ea8ff'],['double_lightsaber',2,'#ff2d24']]) {
    const {ctx,operations}=mock();
    assert.equal(drawFallbackEnergyBlades(ctx,type,color),true);
    assert.equal(operations.filter(o=>o.fillStyle===color && o.shadowBlur===6).length,count);
    assert.equal(operations.filter(o=>o.fillStyle==='#f5f8ff').length,count);
    assert.ok(operations.some(o=>o.fillStyle==='#727c87'));
    assert.equal(ctx.shadowBlur,0);
  }
  const renderer=readFileSync(new URL('../src/game/renderer.js',import.meta.url),'utf8');
  assert.match(renderer,/case 'double_lightsaber':\s+\/\/ Only when no generated sprite/);
  assert.match(renderer,/drawFallbackEnergyBlades\(ctx, type, color\)/);
  assert.match(renderer,/if \(generatedStatus !== 'missing'\) \{\s+return;/);
});

test('unknown weapon types do not get a fabricated lightsaber', () => {
  const {ctx,operations}=mock();
  assert.equal(drawFallbackEnergyBlades(ctx,'gun','#00aacc'),false);
  assert.equal(getEnergyBladeFallbackGeometry('raygun'),null);
  assert.equal(operations.length,0);
});
