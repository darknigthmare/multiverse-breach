import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_16 } from '../src/game/melee/stageAnimationCatalogWave16.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 } from '../src/game/tacticsUniverseBattlefieldsWave16.js';
import { assertHistoricalStageDrawTrace } from './historicalStageRuntimeCompatibility.mjs';

const root = new URL('../', import.meta.url);
const before = JSON.parse(readFileSync(new URL('docs/combat-fidelity-wave16-2026-10-28/baseline-current-wave15.json', root)));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
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

test('W16 adds ten explicit scene studies without changing the previous 425 source definitions', () => {
  assert.equal(STAGE_ANIMATION_WAVE_16.length, 10);
  assert.equal(new Set(STAGE_ANIMATION_WAVE_16.flatMap(p => p.universes)).size, 10);
  assert.equal(STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 15).length, 425);
  for (const path of Object.keys(before.inputHashes).filter(path => /^src\/game\/melee\/stageAnimationCatalogWave\d+\.js$/.test(path))) {
    assert.equal(hash(readFileSync(new URL(path, root))), before.inputHashes[path], path);
  }
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
});

test('precise W16 locations resolve in all four modes and reject foreign locations and continuities', () => {
  for (const p of STAGE_ANIMATION_WAVE_16) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    const stage = { universe: p.universes[0], name: p.sourceScene, mode };
    const resolved = getStageAnimationProfile(stage);
    assert.equal(resolved?.id, p.id, p.sourceScene);
    assert.equal(resolved.selection, 'stage-scene');
    assert.notEqual(getStageAnimationProfile({ ...stage, universe: 'Unrelated fixture universe' })?.animationWave, 15);
    assert.notEqual(getStageAnimationProfile({ ...stage, name: 'An ordinary unspecified room' })?.animationWave, 15);
    assert.notEqual(getStageAnimationProfile({ ...stage, name: stage.name + ' destroyed' })?.animationWave, 15);
    assert.equal(resolved.gameplayEffect, 'none'); assert.equal(resolved.fidelityVerified, false);
    assert.equal(resolved.officialSourceFrames, false); assert.equal(getStageAnimationFrame(stage, 1).frameCount, 0);
  }
});

test('W16 scenes animate deterministic geometry, keep complete cycles and never mutate actors or terrain', () => {
  const signatures = new Set();
  for (const p of STAGE_ANIMATION_WAVE_16) {
    const stage = { universe: p.universes[0], name: p.sourceScene,
      actors: [{ hp: 73, z: 2 }], terrain: [{ x: 1, y: 2, z: 0, material: 'stone' }], events: [] };
    const original = structuredClone(stage);
    const start = record(stage, 0), later = record(stage, p.periodSeconds * 0.23);
    assert.equal(start.rendered, true); assert.equal(later.rendered, true);
    assert.notDeepEqual(start.calls, later.calls, p.id);
    assert.deepEqual(later, record(stage, p.periodSeconds * 0.23));
    assert.deepEqual(start, record(stage, p.periodSeconds));
    assert.deepEqual(stage, original);
    signatures.add(hash(JSON.stringify(later.calls)));
    for (const size of [[360, 780], [1920, 480], [512, 512]]) {
      assert.equal(record(stage, 3, { width: size[0], height: size[1] }).rendered, true);
    }
  }
  assert.equal(signatures.size, 10);
});

test('W16 honors reduced motion, disable flags, finite simulation time and canvas restoration', () => {
  for (const p of STAGE_ANIMATION_WAVE_16) {
    const stage = { universe: p.universes[0], name: p.sourceScene };
    assert.deepEqual(record(stage, 7, { reducedMotion: true }), record(stage, 700, { reducedMotion: true }));
    assert.deepEqual(record(stage, NaN), record(stage, 0));
    for (const key of ['disableStageAtmosphere', 'disableStageAnimations']) {
      const result = record({ ...stage, [key]: true }, 4);
      assert.equal(result.rendered, false); assert.deepEqual(result.calls, []);
    }
  }
});

test('all425 previous definitions and their resolved simulation draw traces remain byte-for-byte stable', () => {
  const baselineBytes = readFileSync(new URL('docs/tactics-universes-2026-10-28/baseline-tactics-stages-before.json', root));
  assert.equal(hash(baselineBytes), '6063699c4e2e8424d7f9eb1574aabe6a433801442c2ec8cc1239020a6725503f');
  const baseline = JSON.parse(baselineBytes);
  const encode = value => JSON.stringify(value, (_, item) => item instanceof RegExp ? { source: item.source, flags: item.flags } : item);
  assert.equal(Object.keys(baseline.stageDefinitions).length, 425);
  for (const [id, expected] of Object.entries(baseline.stageDefinitions)) {
    const definition = STAGE_ANIMATION_PROFILES.find(value => value.id === id);
    assert.ok(definition, id); assert.equal(hash(encode(definition)), expected, id);
  }
  for (const row of baseline.stageTraces) {
    const definition = STAGE_ANIMATION_PROFILES.find(value => value.id === row.id);
    for (const [key, time] of [['at0', 0], ['at23', definition.periodSeconds * .23]]) {
      const draw = record(row.stage, time), resolved = getStageAnimationProfile(row.stage)?.id || null;
      assert.equal(draw.rendered, row[key].rendered, row.id);
      assert.equal(resolved, row[key].resolved, row.id + ': selection was intercepted');
      assertHistoricalStageDrawTrace({ id: row.id, stage: row.stage, timeKey: key, elapsedSeconds: time, calls: draw.calls, expectedSha256: row[key].sha256 });
    }
  }
});

test('stage trace compatibility accepts only the exact two Springfield runtime variants and rejects every other context or draw change', () => {
  const baseline = JSON.parse(readFileSync(new URL('docs/tactics-universes-2026-10-28/baseline-tactics-stages-before.json', root)));
  const row = baseline.stageTraces.find(row => row.id === 'w11-springfield-cooling-tower-vapor');
  assert.ok(row); assert.equal(row.stage.mode, 'Tactics');
  for (const [timeKey, elapsedSeconds] of [['at0', 0], ['at23', 5.75]]) {
    const calls = record(row.stage, elapsedSeconds).calls;
    assert.equal(calls[24][0], 'lineTo'); assert.equal(calls[24][1], 482.41648200000003);
    assert.ok([177.8660725, 177.86607249999997].includes(calls[24][2]));
    const historical = structuredClone(calls); historical[24][2] = 177.86607249999997;
    assert.equal(hash(JSON.stringify(historical)), row[timeKey].sha256);
    const node22 = structuredClone(calls); node22[24][2] = 177.8660725;
    const input = { id: row.id, stage: row.stage, timeKey, elapsedSeconds, calls: node22, expectedSha256: row[timeKey].sha256 };
    const before = structuredClone(input);
    assertHistoricalStageDrawTrace(input); assert.deepEqual(input, before);
    assertHistoricalStageDrawTrace({ ...input, calls: historical });
    for (const override of [
      { id: 'other-stage' }, { stage: { ...row.stage, universe: 'Other universe' } },
      { stage: { ...row.stage, name: 'Other cooling tower' } }, { stage: { ...row.stage, mode: 'Kart' } },
      { timeKey: 'at50' }, { timeKey: timeKey === 'at0' ? 'at23' : 'at0' },
      { elapsedSeconds: elapsedSeconds + 1e-12 }, { expectedSha256: '0'.repeat(64) }
    ]) assert.throws(() => assertHistoricalStageDrawTrace({ ...input, ...override }));
    for (const mutate of [
      draw => { draw[24][0] = 'moveTo'; }, draw => { draw[24][1] += 1e-12; },
      draw => { draw[24][2] = 177.86607250000003; }, draw => { draw[24][2] += 1; },
      draw => { draw[14][2] += 1e-12; }, draw => { draw.push(['stroke']); }
    ]) {
      const changed = structuredClone(node22); mutate(changed);
      assert.throws(() => assertHistoricalStageDrawTrace({ ...input, calls: changed }));
    }
  }
});

test('actual localized custom-map labels select only their matching work, location and continuity', () => {
  const expected = { cuphead_inkwell_tactics: 'w16-cuphead-inkwell-water', wakfu_sadida_tactics: 'w16-wakfu-sadida-leaves', titanfall_reclamation_tactics: 'titanfall2-assembly-house-arms' };
  for (const [fieldId, sceneId] of Object.entries(expected)) {
    const field = TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16[fieldId];
    for (const name of [field.label.fr, field.label.en]) {
      assert.equal(getStageAnimationProfile({ universe: field.source.universe, name, mode: 'Tactics' })?.id, sceneId);
    }
  }
  const field = TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16.wakfu_sadida_tactics;
  assert.notEqual(getStageAnimationProfile({ universe: 'Wakfu', name: field.label.fr.replace('saison 1', 'saison 3'), mode: 'Tactics' })?.animationWave, 16);
  const central = TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16.fma_central_station_tactics;
  assert.equal(getStageAnimationProfile({ universe: central.source.universe, name: central.label.fr, mode: 'Tactics' }), null, 'Central cannot borrow the Resembool locomotive scene');
});
