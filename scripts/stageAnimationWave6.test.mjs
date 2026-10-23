import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_6, WAVE_6_MODE_REFERENCE_SCENES, getStageAnimationWave6Geometry } from '../src/game/melee/stageAnimationCatalogWave6.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave6-2026-10-20/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = [
  ['Titanfall 2', 'Into the Abyss Dynamic Testing factory assembly robot arms', 'assembly-house-two-link-arms'],
  ['Titanfall 2', 'The Beacon substation triple fans', 'beacon-substation-three-axial-fans'],
  ['Final Fantasy XIII', 'Palumpolum Nutriculture Complex mobile paddies 2009', 'palumpolum-oval-mobile-paddies'],
  ['Final Fantasy XIII', 'Mahhabara Atomos falCie tunnel cutter 2009', 'mahhabara-atomos-segmented-excavator'],
  ['Final Fantasy XV', 'Hammerhead fuel pump station 2016', 'hammerhead-pump-meter-and-hose'],
  ['Final Fantasy XV', 'Lestallum EXINERIS steam valve inspection pipes', 'lestallum-blue-pipe-valve-array'],
  ['Team Fortress 2', 'ctf_turbine central rotor room', 'turbine-central-three-horizontal-rotors'],
  ['Team Fortress 2', 'arena_sawmill central paired saw blades 2009', 'sawmill-two-enclosed-saw-wheels'],
  ['The Last of Us', 'Pittsburgh hotel basement generator 2013', 'hotel-generator-pullcord-flywheel'],
  ['The Last of Us', 'Tommy hydroelectric dam bridge valves 2013', 'tommys-dam-paired-lift-bridges'],
  ['Deus Ex', 'VersaLife level 2 security ramp 2000', 'versalife-hinged-security-ramp'],
  ['Deus Ex', 'MJ12 Sub Base mini-sub dock 2000', 'mj12-mini-sub-docking-screw'],
  ['Pirates of the Caribbean', 'Port Royal John Brown smithy wheel 2003', 'portroyal-smithy-sweep-wheel'],
  ['Pirates of the Caribbean', 'Isla Cruces attached old mill wheel 2006', 'isla-cruces-attached-mill-wheel'],
  ['Chicken Run', 'Tweedy pie machine barn press 2000', 'tweedy-empty-pie-press-conveyor'],
  ['Chicken Run', 'Old Crate aircraft workshop coop pedal 2000', 'old-crate-pedal-chain-propeller'],
  ['Wallace & Gromit', 'Wrong Trousers 1993 living room model train', 'westwallaby-model-train-oval'],
  ['Wallace & Gromit', 'A Close Shave 1995 Wallace workshop Knit-O-Matic', 'wallace-knitomatic-yarn-carriage'],
  ['Voyage de Chihiro', 'Kamaji boiler room furnace 2001', 'kamaji-boiler-feed-shutters'],
  ['Voyage de Chihiro', 'Aburaya bathhouse elevator 2001', 'aburaya-lift-rope-counterweight'],
  ['Gremlins', 'Dorry Tavern ceiling fan 1984', 'dorry-four-blade-ceiling-fan'],
  ['Gremlins', 'Kingston Falls movie theater projection 1984', 'kingston-cinema-two-reel-projector'],
  ['Gears of War', 'Timgad drawbridge restored Windows 2007', 'timgad-two-leaf-restored-drawbridge'],
  ['Gears of War', 'Tyro Pillar third car coupling train 2006', 'tyro-pillar-two-jaw-coupling']
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

test('wave6 preserves the 113 previous definitions and all 226 drawing-command hashes', () => {
  assert.equal(baseline.profiles.length, 113);
  assert.equal(baseline.profiles.reduce((n, p) => n + p.samples.length, 0), 226);
  const throughWave6 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 6);
  assert.equal(throughWave6.length, 137);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, v) => v instanceof RegExp ? v.toString() : v)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} at ${sample.time}`);
  }
});

test('24 explicitly sourced mechanisms cover 12 real previously uncovered universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_6.length, 24);
  const roster = new Set(HEROES_DB.map(hero => hero.universe)), old = new Set(baseline.profiles.flatMap(p => p.definition.universes)), counts = new Map();
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(roster.has(universe)); assert.equal(old.has(universe), false);
    assert.equal(p?.mechanism, mechanism, name); assert.equal(p.animationWave, 6);
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
    ['Titanfall 2', 'Into the Abyss assembly factory after collapse destroyed'],
    ['Titanfall 2', 'The Beacon substation fans stopped'],
    ['Final Fantasy XIII', 'Palumpolum mobile paddies Final Fantasy XIII-2'],
    ['Final Fantasy XIII', 'Mahhabara Atomos cutter Lightning Returns Dead Dunes immobilized'],
    ['Final Fantasy XV', 'Hammerhead fuel pump World of Ruin abandoned'],
    ['Final Fantasy XV', 'Lestallum EXINERIS steam valves Comrades ten years'],
    ['Team Fortress 2', 'ctf_turbine room workshop custom remix'],
    ['Team Fortress 2', 'Sawmill saw blades King of the Hill koth'],
    ['The Last of Us', 'Pittsburgh hotel basement generator Part I remake 2022'],
    ['The Last of Us', 'Tommy hydroelectric dam bridge HBO TV series'],
    ['Deus Ex', 'VersaLife level 2 ramp Human Revolution'],
    ['Deus Ex', 'MJ12 Sub Base mini-sub dock Invisible War'],
    ['Pirates of the Caribbean', 'Port Royal smithy wheel LEGO 2003'],
    ['Pirates of the Caribbean', 'Isla Cruces mill wheel detached rolling away 2006'],
    ['Chicken Run', 'Tweedy pie machine barn after explosion'],
    ['Chicken Run', 'Old Crate aircraft coop pedal Dawn of the Nugget 2023'],
    ['Wallace & Gromit', 'Wrong Trousers model train museum 1993'],
    ['Wallace & Gromit', 'A Close Shave Knit-O-Matic Mutton-O-Matic Preston factory 1995'],
    ['Voyage de Chihiro', 'Kamaji boiler room furnace stage play 2022'],
    ['Voyage de Chihiro', 'Aburaya bathhouse elevator stage play 2023'],
    ['Gremlins', 'Dorry Tavern ceiling fan Gremlins 2 Clamp 1990'],
    ['Gremlins', 'Kingston Falls movie theater projection after explosion 1984'],
    ['Gears of War', 'Timgad drawbridge original Xbox 360 2006'],
    ['Gears of War', 'Timgad drawbridge Windows 2007 power out'],
    ['Gears of War', 'Tyro Pillar third car coupling Gears of War 2'],
    ['Unknown Universe', 'Timgad drawbridge Windows 2007']
  ];
  for (const [universe, name] of rejected) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, name, mode }), null, `${universe}/${name}/${mode}`);
  for (const [universe, name] of examples) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 6);
    assert.equal(getStageAnimationProfile({ universe, name, mode })?.id, getStageAnimationProfile({ universe, name })?.id);
    assert.equal(getStageAnimationProfile({ universe, name: 'Quiet ordinary room', mode }), null);
    assert.equal(getStageAnimationProfile({ universe: 'Unknown Universe', name, mode }), null);
  }
  assert.equal(Object.keys(WAVE_6_MODE_REFERENCE_SCENES).length, 12);
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

test('drawn joints, ramp, hose and elevator use constrained physical coordinates', () => {
  const w = 1040, h = 460, distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const contains = (ops, point) => ops.some(op => ['moveTo', 'lineTo', 'ellipse'].includes(op[0]) && Math.abs(op[1] - point[0]) < 1e-8 && Math.abs(op[2] - point[1]) < 1e-8);
  for (const progress of [0, 0.13, 0.23, 0.5, 0.77, 0.99999]) {
    for (const [index, mechanism] of [[0, examples[0][2]], [4, examples[4][2]], [10, examples[10][2]], [19, examples[19][2]], [22, examples[22][2]]]) {
      const state = getStageAnimationWave6Geometry(mechanism, progress, w, h), p = getStageAnimationProfile({ universe: examples[index][0], name: examples[index][1] });
      const ops = draw({ universe: examples[index][0], name: examples[index][1] }, progress * p.periodSeconds);
      if (state.arms) for (const arm of state.arms) {
        assert.ok(Math.abs(distance(arm.base, arm.elbow) - arm.lengths[0]) < 1e-8);
        assert.ok(Math.abs(distance(arm.elbow, arm.tip) - arm.lengths[1]) < 1e-8);
        assert.ok(contains(ops, arm.base) && contains(ops, arm.elbow) && contains(ops, arm.tip));
      }
      if (state.nozzle) { assert.ok(Math.abs(distance(state.root, state.nozzle) - state.length) < 1e-8); assert.ok(contains(ops, state.nozzle)); }
      if (state.end) { assert.ok(Math.abs(distance(state.pivot, state.end) - state.length) < 1e-8); assert.ok(contains(ops, state.end)); }
      if (state.leaves) for (const leaf of state.leaves) { assert.ok(Math.abs(distance(leaf.pivot, leaf.end) - leaf.length) < 1e-8); assert.ok(contains(ops, leaf.end)); }
      if (state.cage) {
        assert.ok(Math.abs(state.cage[1] + state.counterweight[1] - h * 0.63) < 1e-8, 'pulley rope changes length');
        assert.ok(contains(ops, state.cage) && contains(ops, state.counterweight));
        assert.ok(state.cage[1] >= h * 0.23 && state.cage[1] + h * 0.09 <= h * 0.48);
      }
    }
  }
  for (const [width, height] of [[1040, 460], [360, 780], [1920, 480], [512, 512]]) {
    const closed = getStageAnimationWave6Geometry('timgad-two-leaf-restored-drawbridge', 0, width, height).leaves;
    assert.ok(distance(closed[0].end, closed[1].end) < 1e-8, 'closed bridge leaves must meet at every aspect ratio');
    const opened = getStageAnimationWave6Geometry('timgad-two-leaf-restored-drawbridge', 0.5, width, height).leaves;
    for (const leaf of opened) assert.ok(leaf.end[1] > height * 0.065 && leaf.end[1] < leaf.pivot[1]);
  }
});
