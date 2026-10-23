import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_4, WAVE_4_MODE_REFERENCE_SCENES } from '../src/game/melee/stageAnimationCatalogWave4.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave4-2026-10-18/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = [
  ['Star Wars', 'Death Star I hangar blast doors Episode IV', 'death-star1-blast-doors'],
  ['Star Wars', 'Cloud City carbon-freezing chamber Episode V', 'cloud-city-carbon-lift'],
  ['Ghost in the Shell', 'Section 9 Tachikoma maintenance SAC 2nd GIG', 'sac-tachikoma-wheel-diagnostic'],
  ['Ghost in the Shell', 'Section 9 cyberbrain dive room SAC 2nd GIG', 'sac-dive-room-cable-reels'],
  ['Mad Max', 'MFP garage Interceptor Mad Max 1979', 'mfp-interceptor-blower-belt'],
  ['Mad Max', 'Road Warrior Pappagallo refinery', 'road-warrior-refinery-process-pump'],
  ['Mad Max: Fury Road', 'Citadel AquaCola water actuators Fury Road 2015', 'citadel-water-pipe-actuators'],
  ['Mad Max: Fury Road', 'War Rig desert tanker coupling Fury Road 2015', 'war-rig-articulated-tanker'],
  ['Cyberpunk', 'Night City 2077 NCART 2.1 viaduct train', 'ncart2077-viaduct-train'],
  ['Cyberpunk', 'Megabuilding H10 V apartment door', 'h10-apartment-sliding-door'],
  ['Cyberpunk: Edgerunners', 'Edgerunners David NCART platform', 'edgerunners-platform-train-doors'],
  ['Cyberpunk: Edgerunners', 'Edgerunners Doc clinic chair', 'edgerunners-doc-chair-linkage'],
  ['RoboCop', 'OCP ED209 boardroom diagnostic RoboCop 1987', 'ocp-ed209-diagnostic-joints'],
  ['RoboCop', 'Metro West maintenance chair RoboCop 1987', 'metro-west-maintenance-booms'],
  ['Blade Runner', 'Los Angeles 2019 Spinner Blade Runner 1982', 'blade-runner-spinner-vtol'],
  ['Blade Runner', 'Bradbury cage elevator Blade Runner 1982', 'bradbury-cage-elevator'],
  ['Cowboy Bebop', 'Bebop hangar Swordfish folding wings anime 1998', 'swordfish-folding-wings'],
  ['Cowboy Bebop', 'Swordfish service monopod anime 1998', 'swordfish-service-monopod'],
  ['Neon Genesis Evangelion', 'Tokyo-3 retracting buildings TV 1995', 'tokyo3-hydraulic-buildings'],
  ['Neon Genesis Evangelion', 'NERV Geofront launch frame TV 1995', 'nerv-empty-launch-frame'],
  ['Le Cinquième Element', 'New York 2263 Korben yellow taxi traffic', 'new-york2263-yellow-taxi-lanes'],
  ['Le Cinquième Element', 'Fhloston Paradise opera curtains', 'fhloston-opera-curtain-rig'],
  ['Futurama', 'New New York transport tubes', 'new-new-york-pneumatic-tubes'],
  ['Futurama', 'Planet Express hangar retractable roof', 'planet-express-retractable-roof']
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

test('wave4 preserves all 65 previous definitions and their recorded drawing geometry', () => {
  assert.equal(baseline.profiles.length, 65);
  const throughWave4 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 4);
  assert.equal(throughWave4.length, 89);
  assert.equal(new Set(throughWave4.map(p => p.id)).size, 89);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, value) => value instanceof RegExp ? value.toString() : value)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} changed its drawing at ${sample.time}`);
  }
});

test('24 scene mechanisms cover exactly 12 real, previously uncovered roster universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_4.length, 24);
  const universeCounts = new Map();
  const rosterUniverses = new Set(HEROES_DB.map(hero => hero.universe));
  const oldUniverses = new Set(baseline.profiles.flatMap(row => row.definition.universes));
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(rosterUniverses.has(universe), universe);
    assert.equal(oldUniverses.has(universe), false, universe);
    assert.equal(p.mechanism, mechanism);
    assert.equal(p.animationWave, 4);
    assert.equal(p.renderingKind, 'authored-mechanism');
    assert.equal(p.sourceVisualValidation, 'not-validated-1:1');
    assert.equal(p.gameplayEffect, 'none');
    assert.equal(p.fidelityVerified, false);
    assert.equal(p.officialSourceFrames, false);
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
    ['Star Wars', 'Death Star II hangar blast doors Episode VI'],
    ['Star Wars', 'Cloud City carbon freezing on Kamino'],
    ['Star Wars', 'Destroyed Death Star I hangar blast doors'],
    ['Ghost in the Shell', 'Section 9 Tachikoma maintenance SAC_2045'],
    ['Ghost in the Shell', 'Section 9 cyberbrain dive room in the 1995 film'],
    ['Mad Max', 'MFP garage Interceptor in Fury Road'],
    ['Mad Max', 'Road Warrior Pappagallo refinery after explosion exploded'],
    ['Mad Max: Fury Road', 'War Rig desert tanker crash wreck'],
    ['Cyberpunk', 'Edgerunners David NCART metro 2076'],
    ['Cyberpunk: Edgerunners', 'NCART 2077 game Update 2.1 metro'],
    ['Cyberpunk: Edgerunners', 'Viktor Vektor Doc clinic chair'],
    ['RoboCop', 'OCP ED209 diagnostic RoboCop 2014 remake'],
    ['Blade Runner', 'Bradbury cage elevator in Blade Runner 2049'],
    ['Cowboy Bebop', 'Bebop hangar Swordfish wings in 2021 live action'],
    ['Neon Genesis Evangelion', 'Tokyo-3 retracting buildings after Third Impact'],
    ['Neon Genesis Evangelion', 'NERV Geofront launch frame Rebuild 3.0'],
    ['Le Cinquième Element', 'New York taxi traffic in 1914'],
    ['Le Cinquième Element', 'Fhloston Paradise opera destroyed'],
    ['Futurama', 'Old New York transport tubes'],
    ['Unknown Universe', 'Planet Express hangar retractable roof']
  ];
  for (const [universe, name] of rejected) assert.equal(getStageAnimationProfile({ universe, name }), null, `${universe}: ${name}`);
  for (const universe of Object.keys(WAVE_4_MODE_REFERENCE_SCENES)) {
    for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 4, `${universe}/${mode}`);
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

test('doors, grounded props, hydraulic towers, wings and rail frames retain physical constraints', () => {
  const w = 1040, h = 460;
  const operations = (universe, name, time) => draw({ universe, name }, time);
  const rects = ops => ops.filter(op => op[0] === 'strokeRect');
  const deathStar = time => rects(operations('Star Wars', examples[0][1], time));
  assert.deepEqual(deathStar(0)[0], deathStar(15)[0], 'door frame must stay fixed');
  assert.equal(deathStar(0)[1][1] + deathStar(0)[1][3], w * 0.8, 'left blast door ends at the middle when closed');
  assert.equal(deathStar(0)[6][1], w * 0.8, 'right blast door starts at the middle when closed');
  assert.ok(deathStar(15)[1][1] < deathStar(0)[1][1], 'left door slides left');
  assert.ok(deathStar(15)[6][1] > deathStar(0)[6][1], 'right door slides right');
  const tachikoma = time => operations('Ghost in the Shell', examples[2][1], time).filter(op => op[0] === 'ellipse');
  assert.deepEqual(tachikoma(0), tachikoma(6), 'the cradle, chassis and four wheel hubs remain fixed while spokes turn');
  assert.equal(tachikoma(0).filter(op => op[3] === h * 0.014).length, 4);
  const ed209Feet = time => rects(operations('RoboCop', examples[12][1], time)).filter(op => op[3] === w * 0.036);
  assert.equal(ed209Feet(0).length, 2);
  assert.deepEqual(ed209Feet(0), ed209Feet(12), 'ED209 feet remain grounded in the diagnostic bay');
  const lift = time => rects(operations('Blade Runner', examples[15][1], time)).find(op => op[3] === w * 0.11);
  assert.ok(Math.abs(lift(0)[2] - h * 0.21) < 1e-9);
  assert.ok(Math.abs(lift(22)[2] - h * 0.39) < 1e-9);
  const towerRects = time => rects(operations('Neon Genesis Evangelion', examples[18][1], time)).filter(op => op[3] === w * 0.052 && op[4] === h * 0.28);
  assert.equal(towerRects(0).length, 3);
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(towerRects(24.5)[i][2] - towerRects(0)[i][2] - h * 0.25) < 1e-9, 'hydraulic towers descend vertically by their authored stroke');
  const frame = time => rects(operations('Neon Genesis Evangelion', examples[19][1], time)).find(op => op[3] === w * 0.11);
  assert.equal(frame(0)[1], frame(13.5)[1], 'launch frame never leaves its two rails horizontally');
  assert.ok(frame(13.5)[2] < frame(0)[2]);
  const wing = time => operations('Cowboy Bebop', examples[16][1], time).filter(op => op[0] === 'lineTo')[3];
  assert.ok(wing(15.5)[2] < wing(0)[2], 'wings fold upward rather than simply blinking');
});
