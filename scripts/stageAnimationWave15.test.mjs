import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_15 } from '../src/game/melee/stageAnimationCatalogWave15.js';

const root = new URL('../', import.meta.url);
const before = JSON.parse(readFileSync(new URL('docs/combat-fidelity-wave15-2026-10-26/baseline-current-wave14.json', root)));
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

test('W15 adds ten explicit scene studies without changing the previous 415 source definitions', () => {
  assert.equal(STAGE_ANIMATION_WAVE_15.length, 10);
  assert.equal(new Set(STAGE_ANIMATION_WAVE_15.flatMap(p => p.universes)).size, 10);
  assert.equal(STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 12).length, 415);
  for (const path of Object.keys(before.inputHashes).filter(path => /^src\/game\/melee\/stageAnimationCatalogWave\d+\.js$/.test(path))) {
    assert.equal(hash(readFileSync(new URL(path, root))), before.inputHashes[path], path);
  }
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
});

test('precise W15 locations resolve in all four modes and reject foreign locations and continuities', () => {
  for (const p of STAGE_ANIMATION_WAVE_15) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
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

test('W15 scenes animate deterministic geometry, keep complete cycles and never mutate actors or terrain', () => {
  const signatures = new Set();
  for (const p of STAGE_ANIMATION_WAVE_15) {
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

test('W15 honors reduced motion, disable flags, finite simulation time and canvas restoration', () => {
  for (const p of STAGE_ANIMATION_WAVE_15) {
    const stage = { universe: p.universes[0], name: p.sourceScene };
    assert.deepEqual(record(stage, 7, { reducedMotion: true }), record(stage, 700, { reducedMotion: true }));
    assert.deepEqual(record(stage, NaN), record(stage, 0));
    for (const key of ['disableStageAtmosphere', 'disableStageAnimations']) {
      const result = record({ ...stage, [key]: true }, 4);
      assert.equal(result.rendered, false); assert.deepEqual(result.calls, []);
    }
  }
});
