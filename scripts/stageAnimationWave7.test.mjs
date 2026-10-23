import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_7, WAVE_7_MODE_REFERENCE_SCENES, getStageAnimationWave7Geometry } from '../src/game/melee/stageAnimationCatalogWave7.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave7-2026-10-20/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = [
  ['Payday', 'First World Bank security gate drill 2011', 'firstworldbank-clamped-security-drill'],
  ['Payday', 'Golden Grin Casino BFD gantry 2015', 'goldengrin-bfd-bounded-tool-gantry'],
  ['Duke Nukem', 'Hollywood Holocaust cinema projector 1996', 'hollywood-projector-reels-and-shutter'],
  ['Duke Nukem', 'Rabid Transit metro train 1996', 'rabidtransit-metro-two-bogie-car'],
  ['Wolfenstein', 'Tram Ride cable car 2001', 'tramride-cablecar-fixed-span'],
  ['Wolfenstein', 'Eisenwald prison cell block elevator 2014', 'eisenwald-caged-lift-and-drum'],
  ['Poppy Playtime', 'Make-A-Friend assembly conveyor chapter 1 2021', 'makeafriend-three-hopper-conveyor'],
  ['Poppy Playtime', 'Game Station train platform lever chapter 2 2022', 'gamestation-lever-and-access-shutter'],
  ['Bendy and the Ink Machine', 'Moving Pictures chapter 1 Ink Machine 2017', 'movingpictures-ink-machine-pump'],
  ['Bendy and the Ink Machine', 'Heavenly Toys toy machine room gears chapter 3 2017', 'heavenlytoys-meshed-gears-and-belt'],
  ['Atomic Heart', 'Vavilov Algae Workshop cart five motors 2023', 'vavilov-algae-five-motor-cart'],
  ['Atomic Heart', 'VDNH exhibition mirror magnetic platforms 2023', 'vdnh-opposed-magnetic-platform-racks'],
  ['Horizon Zero Dawn', 'Meridian mesa elevators 2017', 'meridian-twin-mesa-lifts'],
  ['Horizon Zero Dawn', 'Cauldron SIGMA hovering assembly conveyor 2017', 'sigma-hover-freight-underbar-loop'],
  ['SCP Foundation', 'SCP-914 research cell 109-B clockworks', 'scp914-empty-booths-mainspring'],
  ['SCP Foundation', 'SCP-294 second floor break room dispenser', 'scp294-paper-cup-dispenser'],
  ['Hellraiser', 'Attic Lament Configuration puzzle box 1987', 'attic-lament-interlocking-cube-panels'],
  ['Hellraiser', 'Labyrinth Leviathan Hellbound 1988', 'labyrinth-leviathan-suspended-rhombus'],
  ['Unreal Tournament', 'DM-Conveyor smelter belt UT99 1999', 'conveyor-smelter-stepped-roller-belt'],
  ['Unreal Tournament', 'DM-Pressure empty chamber UT99 1999', 'pressure-chamber-empty-sliding-seals'],
  ['Crash Bandicoot', 'Heavy Machinery drop platforms 1996', 'heavymachinery-guided-drop-platforms'],
  ['Crash Bandicoot', 'Castle Machinery moving lift platforms 1996', 'castlemachinery-alternating-vertical-carriers'],
  ['Spyro', 'Hurricos factory windmills 1999', 'hurricos-opposed-windmill-wheels'],
  ['Spyro', 'Aquaria Towers Moneybags submarine 1999', 'aquaria-moneybags-submarine-screw']
];
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

test('wave7 preserves the 137 previous definitions and all 274 drawing-command hashes', () => {
  assert.equal(baseline.profiles.length, 137);
  assert.equal(baseline.profiles.reduce((n, p) => n + p.samples.length, 0), 274);
  const throughWave7 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 7);
  assert.equal(throughWave7.length, 161);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, v) => v instanceof RegExp ? v.toString() : v)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} at ${sample.time}`);
  }
});

test('24 explicitly sourced mechanisms cover 12 real previously uncovered universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_7.length, 24);
  const roster = new Set(HEROES_DB.map(hero => hero.universe)), old = new Set(baseline.profiles.flatMap(p => p.definition.universes)), counts = new Map();
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(roster.has(universe)); assert.equal(old.has(universe), false);
    assert.equal(p?.mechanism, mechanism, name); assert.equal(p.animationWave, 7);
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
  assert.equal(counts.size, 12); assert.ok([...counts.values()].every(n => n === 2));
});

test('precise scenes and continuity exclusions resolve before all four mode defaults', () => {
  const rejected = [
    ['Payday', 'First World Bank security gate drill PAYDAY 2 2015'],
    ['Payday', 'First World Bank vault floor thermite 2011'],
    ['Payday', 'Golden Grin Casino BFD stealth 2015'],
    ['Duke Nukem', 'Hollywood Holocaust projector DN64'],
    ['Duke Nukem', 'Rabid Transit metro train World Tour 2016'],
    ['Wolfenstein', 'Tram Ride cable car Tides of War 2003'],
    ['Wolfenstein', 'Eisenwald prison elevator The Old Blood'],
    ['Poppy Playtime', 'Make-A-Friend assembly chapter 3'],
    ['Poppy Playtime', 'Game Station train lever Project: Playtime'],
    ['Poppy Playtime', 'Game Station train after derailment chapter 2'],
    ['Bendy and the Ink Machine', 'Moving Pictures chapter 1 Ink Machine Dark Revival'],
    ['Bendy and the Ink Machine', 'Heavenly Toys chapter 3 belt jammed'],
    ['Atomic Heart', 'Vavilov Algae Workshop motors Trapped in Limbo'],
    ['Atomic Heart', 'VDNH exhibition mirror magnets destroyed'],
    ['Horizon Zero Dawn', 'Meridian elevators Forbidden West rebuilding'],
    ['Horizon Zero Dawn', 'Cauldron SIGMA assembly conveyor Remastered 2024'],
    ['Horizon Zero Dawn', 'Cauldron RHO assembly conveyor 2017'],
    ['SCP Foundation', 'SCP-914 clockwork cell Site-02 Secret Laboratory'],
    ['SCP Foundation', 'SCP-294 break room Containment Breach'],
    ['Hellraiser', 'Attic Lament Configuration 2022'],
    ['Hellraiser', 'Labyrinth Leviathan 2022'],
    ['Unreal Tournament', 'DM-Conveyor smelter belt UT3 remake'],
    ['Unreal Tournament', 'DM-Pressure chamber occupied UT99 1999'],
    ['Crash Bandicoot', 'Heavy Machinery platforms N. Sane 2017'],
    ['Crash Bandicoot', 'Castle Machinery lift green gem 1996'],
    ['Spyro', 'Hurricos factory windmills Reignited 2018'],
    ['Spyro', 'Aquaria Towers Moneybags submarine Reignited'],
    ['Unknown Universe', 'SCP-914 research cell 109-B']
  ];
  for (const [universe, name] of rejected) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, name, mode }), null, `${universe}/${name}/${mode}`);
  for (const [universe, name] of examples) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 7);
    assert.equal(getStageAnimationProfile({ universe, name, mode })?.id, getStageAnimationProfile({ universe, name })?.id);
    assert.equal(getStageAnimationProfile({ universe, name: 'Quiet ordinary room', mode }), null);
    assert.equal(getStageAnimationProfile({ universe: 'Unknown Universe', name, mode }), null);
  }
  assert.equal(Object.keys(WAVE_7_MODE_REFERENCE_SCENES).length, 12);
});

test('all 24 mechanisms change real geometry deterministically without changing gameplay', () => {
  const signatures = new Set();
  for (const [universe, name] of examples) {
    const stage = { universe, name, actors: [{ hp: 73, state: 'idle' }], events: [], safeZones: [1, 2], cameraX: 12 };
    const before = structuredClone(stage), p = getStageAnimationProfile(stage), time = p.periodSeconds * 0.23;
    const first = draw(stage, 0), later = draw(stage, time);
    assert.notDeepEqual(geometry(first), geometry(later), p.id); assert.deepEqual(later, draw(stage, time));
    assert.deepEqual(first, draw(stage, p.periodSeconds)); assert.deepEqual(stage, before);
    signatures.add(hash(geometry(later)));
    assert.deepEqual(later.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, 460 * 0.065, 1040, 460 * 0.55], ['clip']]);
    assert.equal(later.at(-1)[0], 'restore');
    for (const op of later) {
      for (const n of op.slice(1).filter(v => typeof v === 'number')) assert.ok(Number.isFinite(n), `${p.id}/${op[0]}`);
      if (op[0] === 'globalAlpha') assert.ok(op[1] >= 0 && op[1] <= 0.2);
    }
  }
  assert.equal(signatures.size, 24);
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

test('drawn cable-car suspension, elevator ropes, fixed crank rods and windmill radii stay constrained', () => {
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const contains = (ops, point) => ops.some(op => ['moveTo', 'lineTo', 'ellipse'].includes(op[0]) && Math.abs(op[1] - point[0]) < 1e-8 && Math.abs(op[2] - point[1]) < 1e-8);
  for (const [width, height] of [[1040, 460], [360, 780], [1920, 480], [512, 512]]) {
    for (const progress of [0, 0.13, 0.23, 0.5, 0.77, 0.99999]) for (const index of [0, 4, 5, 8, 12, 22]) {
      const [universe, name, mechanism] = examples[index], state = getStageAnimationWave7Geometry(mechanism, progress, width, height);
      const p = getStageAnimationProfile({ universe, name }), r = recorder();
      renderStageAnimation(r.ctx, { stage: { universe, name }, width, height, elapsedSeconds: p.periodSeconds * progress });
      if (state.crank) {
        assert.ok(Math.abs(distance(state.root, state.crank) - state.radius) < 1e-8);
        assert.ok(Math.abs(distance(state.crank, state.slider) - state.length) < 1e-8);
        assert.equal(state.slider[1], state.root[1]);
        assert.ok(contains(r.operations, state.crank) && contains(r.operations, state.slider));
      }
      if (state.pulley) {
        assert.ok(Math.abs(distance(state.pulley, state.cage) - state.suspension) < 1e-8);
        assert.ok(Math.abs(state.pulley[0] - state.start[0] - state.t * (state.end[0] - state.start[0])) < 1e-8);
        assert.ok(Math.abs(state.pulley[1] - state.start[1] - state.t * (state.end[1] - state.start[1])) < 1e-8);
        assert.ok(contains(r.operations, state.pulley) && contains(r.operations, state.cage));
      }
      if (state.lifts) for (const lift of state.lifts) {
        assert.ok(Math.abs(lift.cage[1] + lift.counterweight[1] - lift.sum) < 1e-8);
        assert.ok(lift.cage[1] >= lift.top && lift.counterweight[1] >= lift.top);
        assert.ok(contains(r.operations, lift.cage) && contains(r.operations, lift.counterweight));
      }
      if (state.wheels) for (const wheel of state.wheels) for (const end of wheel.ends) {
        assert.ok(Math.abs(distance(wheel.center, end) - wheel.radius) < 1e-8);
        assert.ok(contains(r.operations, wheel.center) && contains(r.operations, end));
      }
    }
  }
});
