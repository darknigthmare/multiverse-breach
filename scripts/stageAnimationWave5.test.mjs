import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_5, WAVE_5_MODE_REFERENCE_SCENES } from '../src/game/melee/stageAnimationCatalogWave5.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave5-2026-10-20/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = [
  ['The Lord of the Rings', 'Isengard forge wheel The Two Towers 2002', 'isengard-forge-wheel-transmission'],
  ['The Lord of the Rings', 'Morannon Black Gate The Two Towers 2002', 'morannon-chain-operated-leaves'],
  ['Harry Potter', 'Hogwarts Clock Tower film 2004', 'hogwarts-clock-tower-pendulum'],
  ['Harry Potter', 'Burrow Weasley family clock novel summer 1994', 'burrow-nine-location-hands'],
  ['Fallout', 'Fallout 4 Vault 111 round lift', 'vault111-round-platform-shaft'],
  ['Fallout', 'Fallout 4 Prydwen Boston Airport propellers', 'prydwen-four-propeller-outriggers'],
  ['Ghostbusters', 'Firehouse containment unit loading 1984', 'firehouse-empty-trap-loading-slide'],
  ['Ghostbusters', 'Sedgewick ballroom trap pedal 1984', 'sedgewick-pedal-and-trap-hinges'],
  ['Tomb Raider', 'Lost Valley repaired three cogs Tomb Raider 1996', 'lost-valley-three-cog-sluice'],
  ['Tomb Raider', 'St Francis Folly Thor hammer Tomb Raider 1996', 'thor-room-empty-hammer-rig'],
  ['Oddworld', 'RuptureFarms barrel stamper Abe Oddysee 1997', 'rupturefarms-sealed-barrel-stamper'],
  ['Oddworld', 'FeeCo Depot train Abe Exoddus 1998', 'feeco-depot-train-and-points'],
  ['Legacy of Kain', 'Silenced Cathedral steam valves Soul Reaver 1999 material realm', 'silenced-cathedral-three-valves'],
  ['Legacy of Kain', 'Drowned Abbey bell Soul Reaver 1999 material realm', 'drowned-abbey-pull-chain-bell'],
  ['The Thing', 'Outpost 31 generator working The Thing 1982', 'outpost31-generator-flywheel'],
  ['The Thing', 'Outpost 31 helipad MacReady Bell206 The Thing 1982', 'outpost31-bell206-main-tail-rotors'],
  ['Evil Dead', 'Knowby cabin reel-to-reel tape recorder 1981', 'knowby-recorder-reels-capstan'],
  ['Evil Dead', 'Evil Dead II 1987 workshed empty vice', 'workshed-empty-vice-screw'],
  ['The Mummy', 'Cairo museum puzzle key box 1999', 'cairo-eight-petal-key-box'],
  ['The Mummy', 'Hamunaptra sarcophagus lock 1999', 'hamunaptra-radial-key-lock'],
  ['Fullmetal Alchemist', 'Resembool Rockbell automail workshop Brotherhood 2009', 'rockbell-automail-finger-linkages'],
  ['Fullmetal Alchemist', 'Resembool station railway Brotherhood episode 6', 'resembool-locomotive-coupling-rods'],
  ['MediEvil', 'Scarecrow Fields windmill MediEvil remake 2019', 'scarecrow-fields-wooden-windmill'],
  ['MediEvil', 'The Time Device clock carriage MediEvil remake 2019', 'time-device-descending-clock-carriage']
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

test('wave5 preserves all 89 previous definitions and their recorded drawing geometry', () => {
  assert.equal(baseline.profiles.length, 89);
  const throughWave5 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 5);
  assert.equal(throughWave5.length, 113);
  assert.equal(new Set(throughWave5.map(p => p.id)).size, 113);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, value) => value instanceof RegExp ? value.toString() : value)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} changed its drawing at ${sample.time}`);
  }
});

test('24 scene mechanisms cover exactly 12 real, previously uncovered roster universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_5.length, 24);
  const universeCounts = new Map();
  const rosterUniverses = new Set(HEROES_DB.map(hero => hero.universe));
  const oldUniverses = new Set(baseline.profiles.flatMap(row => row.definition.universes));
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(rosterUniverses.has(universe), universe);
    assert.equal(oldUniverses.has(universe), false, universe);
    assert.equal(p.mechanism, mechanism);
    assert.equal(p.animationWave, 5);
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
    ['The Lord of the Rings', 'Isengard forge wheel flooded after Ents'],
    ['The Lord of the Rings', 'Morannon Black Gate collapsed destroyed'],
    ['The Lord of the Rings', 'Isengard forge wheel Rings of Power'],
    ['Harry Potter', 'Hogwarts Clock Tower Hogwarts Legacy 1890'],
    ['Harry Potter', 'Burrow family clock film 2002'],
    ['Harry Potter', 'Burrow family clock mortal peril 1997'],
    ['Fallout', 'Fallout 76 Vault 111 elevator'],
    ['Fallout', 'Prydwen Boston Airport after Airship Down destroyed'],
    ['Ghostbusters', 'Firehouse containment unit after Peck shutdown'],
    ['Ghostbusters', 'Sedgewick ballroom trap in Frozen Empire 2024'],
    ['Tomb Raider', 'Lost Valley cogs Anniversary 2007'],
    ['Tomb Raider', 'Lost Valley missing cogs not repaired'],
    ['Tomb Raider', 'St Francis Folly Thor hammer Hephaestus Anniversary'],
    ['Oddworld', 'RuptureFarms barrel stamper New n Tasty 2014'],
    ['Oddworld', 'RuptureFarms barrel stamper halted out of service'],
    ['Oddworld', 'FeeCo Depot train in Soulstorm Comet Depot 2021'],
    ['Legacy of Kain', 'Silenced Cathedral pipe valves spectral realm'],
    ['Legacy of Kain', 'Silenced Cathedral pipe valves Pinnacle unused Hymn of Death'],
    ['Legacy of Kain', 'Drowned Abbey bell in Soul Reaver 2'],
    ['The Thing', 'Outpost 31 generator after sabotage destroyed'],
    ['The Thing', 'MacReady helicopter Norwegian 2011'],
    ['Evil Dead', 'Knowby cabin tape recorder Evil Dead II 1987'],
    ['Evil Dead', 'Evil Dead 2013 workshed vice'],
    ['The Mummy', 'Cairo museum puzzle box The Mummy 2017'],
    ['The Mummy', 'Hamunaptra sarcophagus lock Mummy Returns 2001'],
    ['The Mummy', 'Hamunaptra sarcophagus lock after city collapsed destroyed'],
    ['Fullmetal Alchemist', 'Rockbell automail workshop anime 2003'],
    ['Fullmetal Alchemist', 'Resembool station 1907 destroyed'],
    ['MediEvil', 'Scarecrow Fields windmill MediEvil 1998'],
    ['MediEvil', 'The Time Device in Resurrection 2005'],
    ['Unknown Universe', 'Isengard forge wheel']
  ];
  for (const [universe, name] of rejected) assert.equal(getStageAnimationProfile({ universe, name }), null, `${universe}: ${name}`);
  for (const universe of Object.keys(WAVE_5_MODE_REFERENCE_SCENES)) {
    for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 5, `${universe}/${mode}`);
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

test('lifts, pendulums, grounded rotorcraft, tape gearing and rigid locomotive rods retain physical constraints', () => {
  const w = 1040, h = 460;
  const operations = (index, time) => draw({ universe: examples[index][0], name: examples[index][1] }, time);
  const ellipses = ops => ops.filter(op => op[0] === 'ellipse');
  const shaft = time => ellipses(operations(4, time));
  assert.deepEqual(shaft(0).slice(0, 2), shaft(19.5).slice(0, 2), 'shaft edges stay fixed');
  assert.equal(shaft(0)[2][1], w * 0.8);
  assert.equal(shaft(19.5)[2][1], w * 0.8);
  assert.ok(Math.abs(shaft(19.5)[2][2] - shaft(0)[2][2] - h * 0.17) < 1e-9);
  const clock = time => operations(2, time).filter(op => op[0] === 'lineTo').find(op => Math.abs(Math.hypot(op[1] - w * 0.8, op[2] - h * 0.23) - h * 0.22) < 1e-9);
  assert.ok(clock(0) && clock(5));
  assert.ok(Math.abs(Math.hypot(clock(0)[1] - w * 0.8, clock(0)[2] - h * 0.23) - h * 0.22) < 1e-9, 'pendulum rod length is fixed');
  assert.ok(Math.abs(Math.hypot(clock(5)[1] - w * 0.8, clock(5)[2] - h * 0.23) - h * 0.22) < 1e-9);
  const airframe = time => geometry(operations(15, time)).slice(1, 9);
  assert.deepEqual(airframe(0), airframe(6), 'parked Bell206 airframe cannot move with its rotors');
  const handOps = operations(3, 5);
  assert.equal(handOps.filter(op => op[0] === 'ellipse' && op[3] === h * 0.006 && op[4] === h * 0.009).length, 9, 'the Weasley clock has nine location hands');
  const locomotivePins = time => ellipses(operations(21, time)).filter(op => op[3] === 2 && op[4] === 2).slice(0, 3);
  const pins0 = locomotivePins(0), pins1 = locomotivePins(35 / 4);
  assert.equal(pins0.length, 3);
  for (const pins of [pins0, pins1]) for (let i = 1; i < 3; i++) assert.ok(Math.abs(Math.hypot(pins[i][1] - pins[i-1][1], pins[i][2] - pins[i-1][2]) - w * 0.045) < 1e-9, 'rigid coupling rod changes length');
  for (const index of [2, 3, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23]) {
    const profile = getStageAnimationProfile({ universe: examples[index][0], name: examples[index][1] });
    const first = geometry(operations(index, 0)), nearEnd = geometry(operations(index, profile.periodSeconds - 1e-6));
    assert.equal(first.length, nearEnd.length);
    for (let i = 0; i < first.length; i++) for (let n = 1; n < first[i].length; n++) if (typeof first[i][n] === 'number') assert.ok(Math.abs(first[i][n] - nearEnd[i][n]) < 0.004, `mechanism jumps at loop boundary: ${profile.id}`);
  }
});
