import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_3, WAVE_3_MODE_REFERENCE_SCENES } from '../src/game/melee/stageAnimationCatalogWave3.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave3-2026-10-18/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = [
  ['Metal Gear', 'Shadow Moses heliport', 'shadow-moses-heliport-searchlights'],
  ['Metal Gear', 'Shadow Moses cargo dock elevator', 'shadow-moses-cargo-lift'],
  ['Guilty Gear', 'Zepp airship propellers', 'zepp-airship-propellers'],
  ['Guilty Gear', 'May Ship anchor winch', 'may-ship-anchor-winch'],
  ['Mass Effect', 'Normandy SR1 galaxy map', 'normandy-sr1-galaxy-map'],
  ['Mass Effect', 'Citadel Presidium skycars', 'presidium-skycar-lanes'],
  ['Dead Space', 'Ishimura engineering centrifuge', 'ishimura-engineering-centrifuge'],
  ['Dead Space', 'Ishimura tram station', 'ishimura-tram-coupling'],
  ['Metal Gear Rising', 'World Marshal freight elevator', 'world-marshal-freight-lift'],
  ['Metal Gear Rising', 'Abkhazia refinery compressor', 'abkhazia-refinery-compressor'],
  ['Tekken', 'Urban Square Tekken 8', 'urban-square-taxi-traffic'],
  ['Tekken', 'Airport Tekken 4', 'airport-parked-airliner-turbine'],
  ['Rayman', 'Rayman 3 Hoodlum Headquarters', 'hoodlum-headquarters-conveyor'],
  ['Rayman', 'Rayman Legends 20 000 Lums Under the Sea', 'undersea-security-scanner'],
  ['Soul Calibur', 'Village of the Wind Soulcalibur II', 'village-of-wind-mill'],
  ['Soul Calibur', 'Indian Port Impending Storm Soulcalibur VI', 'indian-port-moored-boats'],
  ['NieR', 'Automata Amusement Park', 'automata-amusement-carousel'],
  ['NieR', 'Automata abandoned factory', 'automata-factory-production-line'],
  ['Dark Souls', 'Firelink Shrine parish elevator Dark Souls 2011', 'firelink-parish-elevator'],
  ['Dark Souls', 'Anor Londo rotating staircase Dark Souls 2011', 'anor-londo-rotating-staircase'],
  ['Devil May Cry', 'Temen ni gru Gears of Madness DMC3', 'temen-ni-gru-gear-train'],
  ['Devil May Cry', 'Fortuna Gyro Blade DMC4', 'fortuna-gyro-blade'],
  ['Final Fantasy VIII', 'Balamb Garden flight ring', 'balamb-garden-flight-ring'],
  ['Final Fantasy VIII', 'D-District Prison screw tower', 'd-district-prison-screw-tower']
];
const recorder = () => {
  const operations = [];
  let depth = 0;
  const ctx = new Proxy({}, {
    get(_, key) { return (...args) => { if (key === 'save') depth++; if (key === 'restore') { depth--; assert.ok(depth >= 0); } operations.push([key, ...args]); }; },
    set(_, key, value) { operations.push([key, value]); return true; }
  });
  return { ctx, operations, depth: () => depth };
};
const draw = (stage, time, options = {}) => {
  const { ctx, operations, depth } = recorder();
  assert.equal(renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds: time, ...options }), true);
  assert.equal(depth(), 0);
  return operations;
};
const geometry = ops => ops.filter(op => ['rect', 'arc', 'ellipse', 'moveTo', 'lineTo', 'strokeRect', 'fillRect'].includes(op[0]));

test('wave3 preserves all 41 previous definitions and their recorded drawing geometry', () => {
  assert.equal(baseline.profiles.length, 41);
  const throughWave3 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 3);
  assert.equal(throughWave3.length, 65);
  assert.equal(new Set(throughWave3.map(p => p.id)).size, 65);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, value) => value instanceof RegExp ? value.toString() : value)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} changed its drawing at ${sample.time}`);
  }
});

test('24 scene mechanisms cover exactly 12 real, previously uncovered roster universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_3.length, 24);
  const universeCounts = new Map();
  const rosterUniverses = new Set(HEROES_DB.map(hero => hero.universe));
  const oldUniverses = new Set(baseline.profiles.flatMap(row => row.definition.universes));
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(rosterUniverses.has(universe), universe);
    assert.equal(oldUniverses.has(universe), false, universe);
    assert.equal(p.mechanism, mechanism);
    assert.equal(p.animationWave, 3);
    assert.equal(p.renderingKind, 'authored-mechanism');
    assert.equal(p.sourceVisualValidation, 'not-validated-1:1');
    assert.equal(p.gameplayEffect, 'none');
    assert.equal(p.animationProvenance, 'authored-scene-mechanism-geometry-and-timing');
    assert.equal(p.timeSource, 'simulation-elapsed-seconds');
    assert.equal(p.reducedMotionBehavior, 'freeze-at-time-zero');
    assert.ok(p.sourceWork && p.sourceScene && p.continuity);
    assert.ok(p.sourceReference.startsWith('https://'));
    assert.ok(p.sceneEvidence.length > 100);
    assert.deepEqual(p.localAssetPaths, []);
    assert.equal(p.atlas, undefined);
    assert.equal(getStageAnimationFrame({ universe, name }, 1).frameCount, 0);
    assert.equal(getStageAnimationProfile({ universe, name: p.sourceScene })?.id, p.id, 'Own concrete sourceScene does not select the authored mechanism');
    universeCounts.set(universe, (universeCounts.get(universe) || 0) + 1);
  }
  assert.equal(universeCounts.size, 12);
  assert.ok([...universeCounts.values()].every(count => count === 2));
});

test('strict universe and continuity constraints win over reference defaults', () => {
  const rejected = [
    ['Metal Gear', 'Shadow Moses heliport in Metal Gear Rising'],
    ['Metal Gear Rising', 'Shadow Moses heliport'],
    ['Mass Effect', 'Normandy SR2 galaxy map'],
    ['Mass Effect', 'Andromeda Citadel Presidium skycars'],
    ['Guilty Gear', 'Guilty Gear Strive May Ship anchor winch'],
    ['NieR', 'Replicant Automata abandoned factory'],
    ['Dark Souls', 'Dark Souls III Firelink Shrine parish elevator'],
    ['Dark Souls', 'Anor Londo rotating staircase in Dark Souls 3'],
    ['Final Fantasy VIII', 'Galbadia Garden'],
    ['Tekken', 'Tekken 7 Urban Square'],
    ['Rayman', 'Rayman 2 Hoodlum Headquarters'],
    ['Soul Calibur', 'Soulcalibur III Indian Port Impending Storm'],
    ['Soul Calibur', 'Soulcalibur VI Village of the Wind'],
    ['Soul Calibur', 'Grand Labyrinth Sealed Corridor Soulcalibur VI'],
    ['Devil May Cry', 'Devil May Cry 5 Temen ni gru Gears of Madness'],
    ['Unknown Universe', 'Balamb Garden flight ring']
  ];
  for (const [universe, name] of rejected) assert.equal(getStageAnimationProfile({ universe, name }), null, `${universe}: ${name}`);
  for (const universe of Object.keys(WAVE_3_MODE_REFERENCE_SCENES)) {
    for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 3, `${universe}/${mode}`);
    assert.equal(getStageAnimationProfile({ universe, name: 'Quiet ordinary stone room', mode: 'Combat' }), null, universe);
  }
});

test('all 24 additions move real coordinates, rather than changing color or opacity alone', () => {
  const signatures = new Set();
  for (const [universe, name] of examples) {
    const stage = { universe, name, heroes: [{ currentHp: 93, state: 'idle' }], events: [], cameraX: 5 };
    const before = structuredClone(stage), p = getStageAnimationProfile(stage);
    const original = draw(stage, 0), advanced = draw(stage, p.periodSeconds * 0.23);
    assert.notDeepEqual(geometry(original), geometry(advanced), name);
    assert.deepEqual(advanced, draw(stage, p.periodSeconds * 0.23), name);
    assert.deepEqual(original, draw(stage, p.periodSeconds), 'period boundary changes geometry');
    assert.deepEqual(stage, before, 'decor changed gameplay state');
    signatures.add(hash(geometry(advanced)));
    assert.deepEqual(advanced.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, 460 * 0.065, 1040, 460 * 0.55], ['clip']]);
    assert.equal(advanced.at(-1)[0], 'restore');
    for (const op of advanced) {
      for (const number of op.slice(1).filter(value => typeof value === 'number')) assert.ok(Number.isFinite(number), name);
      if (op[0] === 'globalAlpha') assert.ok(op[1] >= 0 && op[1] <= 0.2);
    }
  }
  assert.equal(signatures.size, 24, 'separate mechanisms collapsed to the same geometry');
});

test('simulation pause, both reduced-motion paths, disabled stages and fighter mirrors are respected', () => {
  for (const [universe, name] of examples) {
    const stage = { universe, name };
    assert.deepEqual(draw(stage, 5), draw(stage, 5));
    assert.deepEqual(draw(stage, 5, { reducedMotion: true }), draw(stage, 500, { reducedMotion: true }));
    assert.deepEqual(draw({ ...stage, reducedMotion: true }, 5), draw({ ...stage, reducedMotion: true }, 500));
    assert.deepEqual(draw(stage, NaN), draw(stage, 0));
    assert.deepEqual(draw(stage, -5), draw(stage, 0));
    assert.deepEqual(draw(stage, 5), draw({ ...stage, facing: -1, mirror: true, flipX: true, player2: true }, 5));
    for (const key of ['disableStageAtmosphere', 'disableStageAnimations']) {
      const { ctx, operations } = recorder();
      assert.equal(renderStageAnimation(ctx, { stage: { ...stage, [key]: true }, width: 1040, height: 460, elapsedSeconds: 1 }), false);
      assert.deepEqual(operations, []);
    }
    for (const [width, height] of [[360, 780], [1920, 480], [512, 512]]) {
      const { ctx, operations } = recorder();
      assert.equal(renderStageAnimation(ctx, { stage, width, height, elapsedSeconds: 5 }), true);
      assert.deepEqual(operations.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, height * 0.065, width, height * 0.55], ['clip']]);
      for (const op of operations) for (const number of op.slice(1).filter(value => typeof value === 'number')) assert.ok(Number.isFinite(number));
    }
  }
});

test('cargo machinery, opposite counterweights and projected centrifuge arms follow their physical constraints', () => {
  const w = 1040, h = 460;
  const lift = { universe: 'Metal Gear', name: 'Shadow Moses cargo dock elevator' };
  const cargo = time => draw(lift, time).find(op => op[0] === 'strokeRect' && op[3] === w * 0.25 - w * 0.08);
  assert.equal(cargo(0)[2], h * 0.4);
  assert.equal(cargo(17)[2], h * 0.22);
  const wm = { universe: 'Metal Gear Rising', name: 'World Marshal freight elevator' };
  const main = draw(wm, 29 / 4).find(op => op[0] === 'strokeRect' && op[3] === w * 0.91 - w * 0.7);
  const counter = draw(wm, 29 / 4).find(op => op[0] === 'strokeRect' && op[3] === w * 0.02);
  assert.equal(main[2], h * (0.28 + 0.085));
  assert.equal(counter[2], h * (0.28 - 0.085));
  const centrifuge = { universe: 'Dead Space', name: 'Ishimura engineering centrifuge' };
  const arm = time => draw(centrifuge, time).find(op => op[0] === 'strokeRect' && op[3] === w * 0.024);
  assert.equal(arm(0)[1], w * 0.77 + w * 0.084 - w * 0.012);
  assert.ok(Math.abs(arm(18 / 4)[1] - (w * 0.77 - w * 0.012)) < 1e-9);
  assert.equal(arm(18 / 4)[2], h * 0.35 + h * 0.046 - h * 0.011);
  const airport = { universe: 'Tekken', name: 'Airport Tekken 4' };
  const fuselage = time => draw(airport, time).find(op => op[0] === 'moveTo');
  assert.deepEqual(fuselage(0), ['moveTo', w * 0.68, h * 0.26]);
  assert.deepEqual(fuselage(12), fuselage(0), 'the source aircraft is parked, not taxiing');
  const gears = { universe: 'Devil May Cry', name: 'Temen ni gru Gears of Madness DMC3' };
  const start = geometry(draw(gears, 0)), end = geometry(draw(gears, 26 - 1e-5));
  assert.equal(start.length, end.length);
  for (let i = 0; i < start.length; i++) for (let n = 1; n < start[i].length; n++) {
    if (typeof start[i][n] === 'number') assert.ok(Math.abs(start[i][n] - end[i][n]) < 0.002, 'the gear train jumps at the period boundary');
  }
});
