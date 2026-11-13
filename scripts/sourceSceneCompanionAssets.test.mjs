import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getSourceSceneCompanionPortraitArt, SARII_PORTRAIT_ART } from '../src/game/sourceSceneCompanionAssets.js';

const scene = () => ({ definition: {
  id: 50106, sourceSceneId: 'prey_1719_naru_feral_bog', universe: 'Prey', mode: 'Tactics',
  incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale'
} });

test('Sarii portrait is restricted to the exact Prey source encounter and companion', () => {
  assert.equal(getSourceSceneCompanionPortraitArt(scene()), SARII_PORTRAIT_ART);
  assert.equal(getSourceSceneCompanionPortraitArt(scene(), 'feral_predator'), null);
  for (const [key, value] of Object.entries({ id: 50104, sourceSceneId: 'another_scene',
    universe: 'Predator', mode: 'RPG', incarnation: 'Prey remake' })) {
    const other = scene(); other.definition[key] = value;
    assert.equal(getSourceSceneCompanionPortraitArt(other), null, key);
  }
  for (const flag of ['customBattle', 'isCustomBattle', 'isCustom', 'forceBaseArena', 'dlcSuppressedArena']) {
    const custom = scene(); custom.definition[flag] = true;
    assert.equal(getSourceSceneCompanionPortraitArt(custom), null, flag);
  }
  assert.equal(getSourceSceneCompanionPortraitArt(null), null);
});

test('published portrait is the single transparent image recorded by provenance, not a body sheet', () => {
  const receipt = JSON.parse(readFileSync(new URL('../docs/assets/p0-p1-continuation-2026-11-13/sarii/portrait-manifest.json', import.meta.url)));
  const bytes = readFileSync(new URL(`../public${SARII_PORTRAIT_ART.path}`, import.meta.url));
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 256);
  assert.equal(bytes.readUInt32BE(20), 256);
  assert.equal(bytes[25], 6, 'RGBA PNG color type');
  assert.equal(receipt.asset.path, SARII_PORTRAIT_ART.path);
  assert.equal(receipt.asset.frameCount, 1);
  assert.equal(receipt.remainingWork.fullBodyArtworkComplete, false);
  assert.equal(receipt.remainingWork.animationArtworkComplete, false);
  assert.equal(receipt.remainingWork.backlogP1Closed, false);
});

const fakeContext = () => {
  const calls = [];
  const ctx = { calls, save() {}, restore() {}, fillRect() {}, strokeRect() {},
    beginPath() {}, moveTo() {}, lineTo() {}, fill() {}, drawImage(...args) { calls.push(args); } };
  return ctx;
};

test('portrait waits for the real dimensions, then follows its supplied cell without mutating the scene', async () => {
  const { drawSariiPortrait } = await import('../src/game/sourceSceneCompanionAssets.js?loading-ready');
  const previous = globalThis.Image;
  const created = [];
  globalThis.Image = class {
    complete = false; naturalWidth = 0; naturalHeight = 0;
    constructor() { created.push(this); }
  };
  try {
    const ctx = fakeContext(), current = scene(), before = structuredClone(current);
    assert.equal(drawSariiPortrait(ctx, current, { x: 160, y: 120 }), false);
    assert.equal(ctx.calls.length, 0);
    assert.equal(created.length, 1);
    assert.equal(created[0].src, SARII_PORTRAIT_ART.path);
    created[0].naturalWidth = 256; created[0].naturalHeight = 256; created[0].onload();
    assert.equal(drawSariiPortrait(ctx, current, { x: 160, y: 120 }), true);
    assert.deepEqual(ctx.calls[0].slice(1), [144, 76, 32, 32]);
    assert.equal(drawSariiPortrait(ctx, current, { x: 240, y: 90 }), true);
    assert.deepEqual(ctx.calls[1].slice(1), [224, 46, 32, 32]);
    assert.equal(created.length, 1, 'same source is cached');
    assert.deepEqual(current, before, 'portrait never moves or creates a combat actor');
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});

test('load errors and unexpected image dimensions keep the existing fallback available', async () => {
  const previous = globalThis.Image;
  const created = [];
  globalThis.Image = class {
    complete = false; naturalWidth = 0; naturalHeight = 0;
    constructor() { created.push(this); }
  };
  try {
    for (const failure of ['error', 'wrong-size']) {
      const { drawSariiPortrait } = await import(`../src/game/sourceSceneCompanionAssets.js?${failure}`);
      const ctx = fakeContext();
      assert.equal(drawSariiPortrait(ctx, scene(), { x: 20, y: 60 }), false);
      const image = created.at(-1);
      if (failure === 'error') image.onerror();
      else { image.naturalWidth = 1024; image.naturalHeight = 1024; image.onload(); }
      assert.equal(drawSariiPortrait(ctx, scene(), { x: 20, y: 60 }), false);
      assert.equal(ctx.calls.length, 0);
    }
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});

test('SSR and invalid anchor positions draw nothing', async () => {
  const { drawSariiPortrait } = await import('../src/game/sourceSceneCompanionAssets.js?ssr');
  const previous = globalThis.Image;
  delete globalThis.Image;
  try {
    const ctx = fakeContext();
    assert.equal(drawSariiPortrait(ctx, scene(), { x: 20, y: 60 }), false);
    assert.equal(drawSariiPortrait(ctx, scene(), { x: NaN, y: 60 }), false);
    assert.equal(ctx.calls.length, 0);
  } finally {
    if (previous !== undefined) globalThis.Image = previous;
  }
});
