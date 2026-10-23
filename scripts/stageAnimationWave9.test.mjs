import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_9, WAVE_9_MODE_REFERENCE_SCENES, getStageAnimationWave9Geometry } from '../src/game/melee/stageAnimationCatalogWave9.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave9-2026-10-22/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = STAGE_ANIMATION_WAVE_9.map(p => [p.universes[0], p.sourceScene, p.mechanism]);
const recorder = () => {
  const operations = []; let depth = 0;
  const ctx = new Proxy({}, {
    get(_, key) { return (...args) => { if (key === 'save') depth++; if (key === 'restore') { depth--; assert.ok(depth >= 0); } operations.push([key, ...args]); }; },
    set(_, key, value) { operations.push([key, value]); return true; }
  });
  return { ctx, operations, depth: () => depth };
};
const draw = (stage, time, options = {}) => {
  const { ctx, operations, depth } = recorder();
  assert.equal(renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds: time, ...options }), true);
  assert.equal(depth(), 0); return operations;
};
const geometry = ops => ops.filter(op => ['rect', 'arc', 'ellipse', 'moveTo', 'lineTo', 'strokeRect', 'fillRect', 'translate', 'rotate'].includes(op[0]));

test('wave9 preserves the 201 previous definitions and all 402 drawing-command hashes', () => {
  assert.equal(baseline.profiles.length, 201);
  assert.equal(baseline.profiles.reduce((n, p) => n + p.samples.length, 0), 402);
  const throughWave9 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 9);
  assert.equal(throughWave9.length, 241);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, v) => v instanceof RegExp ? v.toString() : v)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} at ${sample.time}`);
  }
});

test('40 explicitly sourced mechanisms cover 20 real previously uncovered universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_9.length, 40);
  const roster = new Set(HEROES_DB.map(hero => hero.universe)), old = new Set(baseline.profiles.flatMap(p => p.definition.universes)), counts = new Map();
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(roster.has(universe)); assert.equal(old.has(universe), false);
    assert.equal(p?.mechanism, mechanism, name); assert.equal(p.animationWave, 9);
    assert.equal(p.sourceVisualValidation, 'not-validated-1:1'); assert.equal(p.fidelityVerified, false); assert.equal(p.officialSourceFrames, false);
    assert.equal(p.gameplayEffect, 'none'); assert.equal(p.renderingKind, 'authored-mechanism');
    assert.equal(p.animationProvenance, 'authored-scene-mechanism-geometry-and-timing');
    assert.equal(p.timeSource, 'simulation-elapsed-seconds'); assert.equal(p.reducedMotionBehavior, 'freeze-at-time-zero');
    assert.ok(p.sourceWork && p.sourceScene && p.continuity && p.sourceAccess);
    assert.ok(p.sourceReference.startsWith('https://')); assert.ok(p.sceneEvidence.length > 120);
    assert.deepEqual(p.localAssetPaths, []); assert.equal(p.atlas, undefined);
    assert.equal(getStageAnimationFrame({ universe, name }, 1).frameCount, 0);
    assert.equal(getStageAnimationProfile({ universe, name: p.sourceScene })?.id, p.id, p.sourceScene);
    counts.set(universe, (counts.get(universe) || 0) + 1);
  }
  assert.equal(counts.size, 20); assert.ok([...counts.values()].every(n => n === 2));
});

test('precise scenes and continuity exclusions resolve before all four mode defaults', () => {
  const rejected = [
    ['Stargate Atlantis','Atlantis Jumper Bay ceiling hatch The Siege destroyed'],
    ['Stargate Atlantis','Thirty-Eight Minutes engine pod jammed'],
    ['Stargate Universe','Destiny Stargate Pegasus inner ring only'],
    ['Stargate Universe','Destiny shuttle docking clamps detached'],
    ['Zero Escape: The Nonary Games','999 steam engine room gears Zero Time Dilemma'],
    ['Zero Escape: The Nonary Games','999 first class cabin piano Virtues Last Reward ZTD'],
    ["Mirror's Edge",'Jacknife storm drain valve Catalyst 2016'],
    ["Mirror's Edge",'Heat chapter 3 crane girders The Boat'],
    ['Tom Clancy’s Splinter Cell','CIA HQ roof ventilation fan Blacklist'],
    ['Tom Clancy’s Splinter Cell','Defense Ministry office elevator Kalinatek'],
    ['Max Payne 2','Hospital prologue elevator broken 2003'],
    ['Max Payne 2','Elevator Doors warehouse forklift occupied'],
    ['Flashback','New Washington fuse elevator remake 2013'],
    ['Flashback','Death Tower floor switch Flashback 2 2023'],
    ['Lost Planet 2','Railway Gun loading crane Lost Planet 3'],
    ['Lost Planet 2','NEOS orbital cannon collar destroyed'],
    ['Borderlands','Salt Flats Thor bucket wheel Caustic Caverns Borderlands 2'],
    ['Borderlands','Headstone Mine elevator Borderlands 3'],
    ['Attack on Titan','Trost supply headquarters lift Final Season'],
    ['Attack on Titan','Trost Wall Rose transport lift supply headquarters episode 8'],
    ['Secret of Monkey Island','Sea Monkey deck cannon Return to Monkey Island'],
    ['Secret of Monkey Island','Stan grog vending machine LeChuck’s Revenge'],
    ['LittleBigPlanet','Get a Grip hanging sponge LittleBigPlanet 2'],
    ['LittleBigPlanet','Skate to Victory windmill Sackboy Big Adventure'],
    ['Ristar','Planet Scorch furnace cage Game Gear'],
    ['Ristar','Planet Sonata metronome clock tower Game Gear'],
    ['The Surge','Central Production B Conveyor Hub The Surge 2 2019'],
    ['The Surge','Resolve Biolabs courtyard elevator A Walk in the Park DLC'],
    ['Putt-Putt','Cartown Zoo Hydro Dam pulley Travels Through Time'],
    ['Putt-Putt','Jungle Land drawbridge blocked'],
    ['Freddi Fish','Sunken Ship window crank Haunted Schoolhouse'],
    ['Freddi Fish','Volcano Gate bucket Stolen Conch'],
    ['Spy Fox','MobCom gadget vending machine Operation Ozone'],
    ['Spy Fox','NOG fortress tram Some Assembly Required'],
    ['Serious Sam','Luxor rising obelisk HD 2009'],
    ['Serious Sam','Great Pyramid entrance door Second Encounter'],
    ["No Man's Sky",'Foundation Signal Booster Beyond 2019'],
    ["No Man's Sky",'Beyond mineral extractor Foundation 2016'],
    ['Brütal Legend','Dry Ice Mines rail cart destroyed'],
    ['Brütal Legend','Bladehenge Ironheade Megastage speakers Tainted Coil']
  ];
  for (const [universe, name] of rejected) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, name, mode }), null, `${universe}/${name}/${mode}`);
  for (const [universe, name] of examples) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 9);
    assert.equal(getStageAnimationProfile({ universe, name, mode })?.id, getStageAnimationProfile({ universe, name })?.id);
    assert.equal(getStageAnimationProfile({ universe, name: 'Quiet ordinary room', mode }), null);
    assert.equal(getStageAnimationProfile({ universe: 'Unknown Universe', name, mode }), null);
  }
  assert.equal(Object.keys(WAVE_9_MODE_REFERENCE_SCENES).length, 20);
});

test('all 40 mechanisms change real geometry deterministically without changing gameplay', () => {
  const signatures = new Set();
  for (const [universe, name] of examples) {
    const stage = { universe, name, actors: [{ hp: 73, state: 'idle' }], events: [], safeZones: [1, 2], cameraX: 12 };
    const before = structuredClone(stage), p = getStageAnimationProfile(stage), time = p.periodSeconds * 0.23;
    const first = draw(stage, 0), later = draw(stage, time);
    assert.notDeepEqual(geometry(first), geometry(later), p.id); assert.deepEqual(later, draw(stage, time));
    assert.deepEqual(first, draw(stage, p.periodSeconds)); assert.deepEqual(stage, before);
    signatures.add(hash(geometry(later)));
    assert.ok(later.some(op => op[0] === 'strokeStyle' && op[1] === p.color), p.id + '/source-specific color');
    assert.ok(later.some(op => op[0] === 'lineWidth' && op[1] > 0));
    assert.deepEqual(later.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, 460 * 0.065, 1040, 460 * 0.55], ['clip']]);
    assert.equal(later.at(-1)[0], 'restore');
    for (const op of later) {
      for (const n of op.slice(1).filter(v => typeof v === 'number')) assert.ok(Number.isFinite(n), `${p.id}/${op[0]}`);
      if (op[0] === 'globalAlpha') assert.ok(op[1] >= 0 && op[1] <= 0.2);
    }
  }
  assert.equal(signatures.size, 40);
});

test('simulation time, reduced motion, stage disable flags, mirrors and viewport clipping remain safe', () => {
  for (const [universe, name] of examples) {
    const stage = { universe, name };
    assert.deepEqual(draw(stage, 7), draw(stage, 7));
    assert.deepEqual(draw(stage, 7, { reducedMotion: true }), draw(stage, 700, { reducedMotion: true }));
    assert.deepEqual(draw({ ...stage, reducedMotion: true }, 7), draw({ ...stage, reducedMotion: true }, 700));
    assert.deepEqual(draw(stage, NaN), draw(stage, 0)); assert.deepEqual(draw(stage, -1), draw(stage, 0));
    assert.deepEqual(draw(stage, 7), draw({ ...stage, facing: -1, mirror: true, flipX: true, player2: true }, 7));
    for (const key of ['disableStageAtmosphere', 'disableStageAnimations']) {
      const r = recorder(); assert.equal(renderStageAnimation(r.ctx, { stage: { ...stage, [key]: true }, width: 1040, height: 460, elapsedSeconds: 7 }), false); assert.deepEqual(r.operations, []);
    }
    for (const [width, height] of [[360, 780], [1920, 480], [512, 512]]) {
      const r = recorder(); assert.equal(renderStageAnimation(r.ctx, { stage, width, height, elapsedSeconds: 7 }), true); assert.equal(r.depth(), 0);
      assert.deepEqual(r.operations.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, height * 0.065, width, height * 0.55], ['clip']]);
      for (const op of r.operations) for (const n of op.slice(1).filter(v => typeof v === 'number')) assert.ok(Number.isFinite(n));
    }
  }
});

test('actual drawn clamps, crane cables, carrier ropes, drawbridge, pendulums and crank rods remain constrained', () => {
  const distance = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1]);
  const contains = (ops,p) => ops.some(op => ['moveTo','lineTo','ellipse'].includes(op[0]) && Math.abs(op[1]-p[0])<1e-8 && Math.abs(op[2]-p[1])<1e-8);
  const constrained = STAGE_ANIMATION_WAVE_9.filter(p => getStageAnimationWave9Geometry(p.mechanism,0,1040,460));
  assert.equal(constrained.length,8);
  for (const [width,height] of [[1040,460],[360,780],[1920,480],[512,512]]) for (const progress of [0,.13,.23,.5,.77,.99999]) for (const p of constrained) {
    const g=getStageAnimationWave9Geometry(p.mechanism,progress,width,height), r=recorder();
    renderStageAnimation(r.ctx,{stage:{universe:p.universes[0],name:p.sourceScene},width,height,elapsedSeconds:p.periodSeconds*progress});
    if (g.arms) for (const arm of g.arms) {
      assert.ok(Math.abs(distance(arm.root,arm.elbow)-arm.lengths[0])<1e-8);
      assert.ok(Math.abs(distance(arm.elbow,arm.tip)-arm.lengths[1])<1e-8);
      assert.ok(contains(r.operations,arm.root)&&contains(r.operations,arm.elbow)&&contains(r.operations,arm.tip));
    }
    if (g.roots) {
      for(let i=0;i<2;i++){assert.ok(Math.abs(distance(g.roots[i],g.ends[i])-g.length)<1e-8);assert.ok(contains(r.operations,g.roots[i])&&contains(r.operations,g.ends[i]));}
      assert.ok(Math.abs(distance(...g.ends)-g.span)<1e-8);
      assert.ok(Math.abs(g.ends[0][1]-g.ends[1][1])<1e-8);
    }
    if (g.car) {
      assert.ok(Math.abs(g.car[1]+g.counterweight[1]-g.sum)<1e-8);
      assert.ok(g.car[1]>=g.top&&g.counterweight[1]>=g.top);
      assert.ok(contains(r.operations,g.car)&&contains(r.operations,g.counterweight));
    }
    if (g.root&&g.end) {
      assert.ok(Math.abs(distance(g.root,g.end)-g.length)<1e-8);
      assert.ok(contains(r.operations,g.root)&&contains(r.operations,g.end));
    }
    if(g.drum){assert.ok(Math.abs(distance(g.drum,g.end)-g.cableLength)<1e-8);assert.ok(Math.abs(g.drumAngle-g.cableLength/(Math.min(width,height)*.03))<1e-8);assert.ok(contains(r.operations,g.drum));}
    if(g.bucket){assert.ok(Math.abs(g.bucket[1]+g.gate[1]-g.sum)<1e-8);assert.ok(contains(r.operations,g.bucket)&&contains(r.operations,g.gate));}
    if(g.crank){assert.ok(Math.abs(distance(g.root,g.crank)-g.radius)<1e-8);assert.ok(Math.abs(distance(g.crank,g.slider)-g.length)<1e-8);assert.equal(g.slider[1],g.root[1]);assert.ok(contains(r.operations,g.crank)&&contains(r.operations,g.slider));}
    if(g.weight){assert.ok(Math.abs(distance(g.root,g.weight)-g.length*.65)<1e-8);}
  }
});
