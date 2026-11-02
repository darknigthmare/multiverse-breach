import assert from 'node:assert/strict';
import test from 'node:test';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 as fields } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { TACTICS_TERRAIN_MATERIALS_WAVE15 as materials, TACTICS_ENVIRONMENT_PROFILES_WAVE15 } from '../src/game/tacticsUniversePresentationWave15.js';
import { TACTICS_TERRAIN_MATERIALS_WAVE16, TACTICS_ENVIRONMENT_PROFILES_WAVE16 } from '../src/game/tacticsUniversePresentationWave16.js';
import { assertWave16EnvironmentExtension, assertWave16MaterialExtension } from './tacticsHistoricalBaselineWave16.mjs';
import {
  TACTICS_ENVIRONMENT_BIOMES, TACTICS_RUNTIME_ENVIRONMENT_BIOMES, getTacticsEnvironmentProfile,
  drawTacticsEnvironment, drawTacticsScenery, getTacticsSceneryBounds
} from '../src/game/tacticsEnvironmentRenderer.js';
import {
  TACTICS_TERRAIN_MATERIALS, getTerrainDrawList, getSurfacePolygon, drawTerrainFace
} from '../src/game/tacticsTerrainRenderer.js';

// Command recordings exercise the actual renderer and its invariants. They do
// not stand in for a browser pixel review or a claim of source-art fidelity.
function recorder() {
  const calls = [], stack = [];
  const target = {
    canvas: { width: 1040, height: 460 },
    save() { stack.push(1); calls.push(['save']); },
    restore() { assert.ok(stack.length, 'Canvas restore without matching save'); stack.pop(); calls.push(['restore']); },
    createLinearGradient(...args) {
      const gradient = { addColorStop: (...stop) => calls.push(['gradient-stop', ...stop]) };
      calls.push(['gradient', ...args]); return gradient;
    }
  };
  const ctx = new Proxy(target, {
    get(object, key) {
      if (key in object) return object[key];
      if (['lineWidth', 'globalAlpha'].includes(key)) return 1;
      return (...args) => {
        for (const argument of args) if (typeof argument === 'number') assert.ok(Number.isFinite(argument), key + ': invalid number');
        calls.push([key, ...args]);
      };
    },
    set(object, key, value) {
      if (typeof value === 'number') assert.ok(Number.isFinite(value), key + ': invalid style');
      object[key] = value;
      calls.push(['set', key, value && typeof value === 'object' ? 'gradient' : value]); return true;
    }
  });
  return { ctx, calls, stack };
}
function environment(field, options = {}) {
  const recording = recorder();
  const drawn = drawTacticsEnvironment(recording.ctx, { battlefield: field, width: 1040, height: 460, animTime: 165, ...options });
  assert.equal(recording.stack.length, 0); return { ...recording, drawn };
}

test('four W15 source environments add distinct deterministic landmarks while historical biome export remains bounded',()=>{
  assertWave16EnvironmentExtension(TACTICS_ENVIRONMENT_BIOMES, TACTICS_RUNTIME_ENVIRONMENT_BIOMES,
    TACTICS_ENVIRONMENT_PROFILES_WAVE15, TACTICS_ENVIRONMENT_PROFILES_WAVE16);
  const signatures=new Set();
  for(const field of Object.values(fields)){
    const before=JSON.stringify(field),a=environment(field),b=environment(field);
    assert.equal(a.drawn,true);assert.deepEqual(a.calls,b.calls);assert.equal(JSON.stringify(field),before);
    assert.equal(a.calls.some(c=>c[0]==='drawImage'),false);assert.ok(a.calls.filter(c=>c[0]==='lineTo').length>25);
    const profile=getTacticsEnvironmentProfile(field);
    assert.equal(profile.universe,field.source.universe);assert.equal(profile.work,field.source.work);
    assert.equal(profile.sourceSpecific,true);assert.equal(profile.source1to1Verified,false);assert.equal(profile.usesSharedBackdrop,false);
    signatures.add(JSON.stringify(a.calls));
  }
  assert.equal(signatures.size,4);
});
test('W15 environments cannot enter other engines and suppression removes source-specific art',()=>{
  for(const field of Object.values(fields)){
    for(const mode of ['RPG','Smash','Fighter','Kart']){const result=environment(field,{mode});assert.equal(result.drawn,false);assert.deepEqual(result.calls,[]);}
    for(const flag of ['forceBaseArena','dlcSuppressedArena']){
      const profile=getTacticsEnvironmentProfile(field,'Tactics',{[flag]:true});
      assert.equal(profile.universe,'Nexus de Convergence');assert.equal(profile.architecture,'none');assert.equal(profile.sourceSpecific,false);
    }
  }
});
test('Spencer mist respects reduced-motion while game time drives its independent original atmosphere',()=>{
  const field=fields.re_spencer_courtyard_tactics;
  assert.deepEqual(environment(field,{reducedMotion:true,animTime:0}).calls,environment(field,{reducedMotion:true,animTime:999}).calls);
  assert.notDeepEqual(environment(field,{animTime:0}).calls,environment(field,{animTime:999}).calls);
});
test('seven W15 materials paint real tops and cliff faces without changing geometry',()=>{
  assert.equal(Object.keys(materials).length,7);
  assertWave16MaterialExtension(TACTICS_TERRAIN_MATERIALS, TACTICS_TERRAIN_MATERIALS_WAVE16);
  const project=(x,y,z)=>({x:120+x*44,y:180+y*26-z*24});
  const polygons=new Set(),samples=new Set();
  for(const [id,material] of Object.entries(materials)){
    assert.equal(TACTICS_TERRAIN_MATERIALS[id],material);
    const surface={id:id+':cliff',x:1,y:1,z:3,cornerZ:[3,3,3,3],materialId:id,solidBottom:-1};
    polygons.add(JSON.stringify(getSurfacePolygon(surface,project)));
    const faces=getTerrainDrawList({surfaces:[surface]},{project});assert.ok(faces.some(f=>f.kind==='side'));
    const recording=recorder();for(const face of faces)drawTerrainFace(recording.ctx,face,{animTime:48});
    assert.equal(recording.stack.length,0);samples.add(JSON.stringify(recording.calls));
  }
  assert.equal(polygons.size,1);assert.equal(samples.size,7);
  assert.equal(materials['red-rock-sandstone'].sideFamily,'strata');assert.equal(materials['white-forest-grass'].sideFamily,'strata');
});
test('every W15 playable surface selects a registered material and renders finite faces including slabs and slopes',()=>{
  const project=(x,y,z)=>({x:120+x*44,y:180+y*26-z*24});
  for(const field of Object.values(fields)){
    for(const surface of field.surfaces)assert.ok(TACTICS_TERRAIN_MATERIALS[surface.materialId],surface.id);
    const before=JSON.stringify(field),recording=recorder(),faces=getTerrainDrawList(field,{project});
    for(const face of faces)drawTerrainFace(recording.ctx,face,{animTime:48});
    assert.equal(recording.stack.length,0);assert.ok(faces.some(f=>f.kind==='underside'));assert.equal(JSON.stringify(field),before);
  }
});
test('lamppost, statue and radio mast use real obstacle supports and never alter collision or HP',()=>{
  const silhouettes=new Set(),point={x:310,y:265};
  for(const kind of ['dollet-lamppost','spencer-statue','radio-mast']){
    const obstacle={id:kind,sceneryKind:kind,hp:80,maxHp:80,tacticsHeight:2.5,surfaceId:'upper:3:4',gridX:3,gridY:4};
    const before=structuredClone(obstacle),recording=recorder();
    assert.equal(drawTacticsScenery(recording.ctx,{obstacle,point,width:37,height:55}),true);
    assert.deepEqual(obstacle,before);assert.equal(recording.stack.length,0);
    assert.ok(recording.calls.some(c=>c[0]==='translate'&&c[1]===point.x&&c[2]===point.y));
    assert.equal(recording.calls.some(c=>c[0]==='drawImage'),false);silhouettes.add(JSON.stringify(recording.calls));
    const bounds=getTacticsSceneryBounds(obstacle,point,37,55);assert.ok(bounds.top<=point.y-55&&bounds.bottom>=point.y);
  }
  assert.equal(silhouettes.size,3);
});
