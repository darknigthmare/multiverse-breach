import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_17 } from '../src/game/melee/stageAnimationCatalogWave17.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17 } from '../src/game/tacticsUniverseBattlefieldsWave17.js';
import { HEROES_DB } from '../src/game/heroes.js';
import { assertHistoricalStageDrawTrace } from './historicalStageRuntimeCompatibility.mjs';
const root = new URL('../', import.meta.url);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const baselineBytes = readFileSync(new URL('docs/combat-fidelity-wave17-2026-11-02/stages/baseline-before.json', root));
assert.equal(hash(baselineBytes), '13339ae20d54be5f35031af959dd6d3226c5904ed3bd2dab38cde07492fee044');
const baseline = JSON.parse(baselineBytes);
const planBytes = readFileSync(new URL('docs/combat-fidelity-wave17-2026-11-02/stages/source-plan-before.json', root));
assert.equal(hash(planBytes), baseline.sourcePlanSha256);
const plan = JSON.parse(planBytes);
const record = (stage, elapsedSeconds, options = {}) => {
  const calls = [], stack = [];
  let properties = { globalAlpha: 0.7, lineWidth: 2, strokeStyle: '#abcdef', fillStyle: '#fedcba' };
  const initial = { ...properties };
  const ctx = new Proxy({}, {
    get(_, key) {
      if (key in properties) return properties[key];
      if (key === 'save') return () => { stack.push({ ...properties }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); properties = stack.pop(); calls.push(['restore']); };
      return (...args) => {
        for (const n of args.filter(value => typeof value === 'number')) assert.ok(Number.isFinite(n), String(key));
        calls.push([key, ...args]);
      };
    },
    set(_, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value)); properties[key] = value; calls.push([key, value]); return true; }
  });
  const rendered = renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds, ...options });
  assert.equal(stack.length, 0); assert.deepEqual(properties, initial);
  return { rendered, calls };
};

test('ten preplanned W17 location studies add four source universes while every historical scene identity remains present', () => {
  assert.equal(STAGE_ANIMATION_WAVE_17.length, 10);
  assert.equal(new Set(STAGE_ANIMATION_WAVE_17.flatMap(profile => profile.universes)).size, 10);
  assert.equal(STAGE_ANIMATION_PROFILES.length, 445);
  assert.equal(STAGE_ANIMATION_PROFILES.filter(profile => profile.animationWave !== 17).length, 435);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(profile => profile.id)).size, 445);
  const roster = new Set(HEROES_DB.map(hero => hero.universe));
  const configured = new Set(STAGE_ANIMATION_PROFILES.flatMap(profile => profile.universes));
  assert.equal(baseline.configuredRosterUniverses, 216);
  assert.equal([...configured].filter(universe => roster.has(universe)).length, 220);
  for (const source of plan.scenes) {
    const actual = STAGE_ANIMATION_WAVE_17.find(profile => profile.id === source.id);
    assert.ok(actual, source.id);
    assert.deepEqual(actual.universes, [source.universe]);
    assert.equal(actual.sourceWork, source.work); assert.equal(actual.sourceScene, source.location);
    assert.equal(actual.sourceReference, source.reference); assert.equal(actual.periodSeconds, source.periodSeconds);
    assert.equal(actual.networkVerified, false); assert.equal(actual.source1to1Verified, false);
    assert.equal(actual.officialSourceFrames, false); assert.equal(actual.fidelityVerified, false);
  }
});

test('W17 requires the explicit location, continuity and detail in every engine and never installs a general universe fallback', () => {
  for (const profile of STAGE_ANIMATION_WAVE_17) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    const stage = { universe: profile.universes[0], name: profile.sourceScene, mode };
    assert.equal(getStageAnimationProfile(stage)?.id, profile.id);
    assert.equal(getStageAnimationProfile(stage).selection, 'stage-scene');
    assert.notEqual(getStageAnimationProfile({ ...stage, universe: 'Foreign fixture universe' })?.animationWave, 17);
    assert.notEqual(getStageAnimationProfile({ ...stage, name: 'An ordinary unspecified room' })?.animationWave, 17);
    assert.notEqual(getStageAnimationProfile({ ...stage, name: stage.name + ' destroyed' })?.animationWave, 17);
    assert.notEqual(getStageAnimationProfile({ universe: stage.universe, mode })?.animationWave, 17);
    assert.equal(getStageAnimationProfile(stage).gameplayEffect, 'none');
    assert.equal(getStageAnimationFrame(stage, 1).frameCount, 0);
  }
});

test('ten geometry sequences animate from simulation seconds, close their finite cycles and preserve actors, terrain and canvas state', () => {
  const signatures = new Set();
  for (const profile of STAGE_ANIMATION_WAVE_17) {
    const stage = { universe: profile.universes[0], name: profile.sourceScene,
      actors: [{ hp: 83, z: 2, surfaceId: 'fixture-upper' }], terrain: [{ x: 2, y: 3, z: -1, material: 'stone' }], events: [] };
    const before = structuredClone(stage);
    const first = record(stage, 0), later = record(stage, profile.periodSeconds * .23);
    assert.equal(first.rendered, true); assert.equal(later.rendered, true);
    assert.notDeepEqual(first.calls, later.calls, profile.id);
    assert.deepEqual(later, record(stage, profile.periodSeconds * .23), profile.id + ': paused simulation time drifted');
    assert.deepEqual(first, record(stage, profile.periodSeconds));
    assert.deepEqual(stage, before); signatures.add(hash(JSON.stringify(later.calls)));
    for (const [width, height] of [[360, 780], [1920, 480], [512, 512]]) assert.equal(record(stage, 3, { width, height }).rendered, true);
    assert.deepEqual(record(stage, 7, { reducedMotion: true }), first);
    assert.deepEqual(record(stage, 700, { reducedMotion: true }), first);
    assert.deepEqual(record({ ...stage, reducedMotion: true }, 700), first);
    assert.deepEqual(record(stage, NaN), first);
    for (const flag of ['disableStageAtmosphere', 'disableStageAnimations']) {
      const disabled = record({ ...stage, [flag]: true }, 7);
      assert.equal(disabled.rendered, false); assert.deepEqual(disabled.calls, []);
    }
  }
  assert.equal(signatures.size, 10);
});

test('all435 historical definitions and1740 mode-specific resolved draw traces retain their pre-production hashes', () => {
  const encode = value => JSON.stringify(value, (_, item) => item instanceof RegExp ? { source: item.source, flags: item.flags } : item);
  assert.equal(Object.keys(baseline.stageDefinitions).length, 435); assert.equal(baseline.stageTraces.length, 1740);
  for (const [id, expected] of Object.entries(baseline.stageDefinitions)) {
    const actual = STAGE_ANIMATION_PROFILES.find(profile => profile.id === id);
    assert.ok(actual, id); assert.equal(hash(encode(actual)), expected, id);
  }
  for (const row of baseline.stageTraces) {
    const actual = STAGE_ANIMATION_PROFILES.find(profile => profile.id === row.id);
    for (const [key, time] of [['at0', 0], ['at23', actual.periodSeconds * .23]]) {
      const draw = record(row.stage, time);
      assert.equal(draw.rendered, row[key].rendered, row.id);
      assert.equal(getStageAnimationProfile(row.stage)?.id || null, row[key].resolved, row.id + ': historical selection was intercepted');
      assertHistoricalStageDrawTrace({ id: row.id, stage: row.stage, timeKey: key, elapsedSeconds: time, calls: draw.calls, expectedSha256: row[key].sha256 });
    }
  }
});

test('new scene studies do not silently substitute the four dedicated Tactics sectors or another source edition', () => {
  for (const field of Object.values(TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17)) for (const name of [field.label.fr, field.label.en]) {
    assert.notEqual(getStageAnimationProfile({ universe: field.source.universe, name, mode: 'Tactics' })?.animationWave, 17);
  }
  const changed = [
    ['w17-spyro-summer-forest-water', 'Reignited 2018', 'original 1999'],
    ['w17-rayman-castle-rock-pennants', 'original 2013', '8-Bit Edition'],
    ['w17-bge-mammago-maintenance-vent', 'original 2003', 'Anniversary 2024'],
    ['w17-hotd-curien-foyer-drapes', 'original Model 2', 'remake 2022'],
    ['w17-dandadan-ayase-talisman-gate', 'season 1 2024', 'season 2 2025'],
    ['w17-zootopia-station-garden', 'original 2016', 'Zootopia 2 2025']
  ];
  for (const [id, from, to] of changed) {
    const profile = STAGE_ANIMATION_WAVE_17.find(value => value.id === id);
    assert.notEqual(getStageAnimationProfile({ universe: profile.universes[0], name: profile.sourceScene.replace(from, to) })?.animationWave, 17);
  }
});

