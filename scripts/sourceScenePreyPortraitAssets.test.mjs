import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getSourceSceneNaruPortraitArt, NARU_PREY_PORTRAIT_ART } from '../src/game/sourceScenePreyPortraitAssets.js';

const scene = () => ({
  definition: { id: 50106, sourceSceneId: 'prey_1719_naru_feral_bog', universe: 'Prey', mode: 'Tactics', material: 'prey',
    incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale' },
  actor: { id: 'naru_prey', universe: 'Prey' }
});

test('Naru portrait is owned by the exact Prey scene and lead, never the separate Predator roster identity', () => {
  assert.equal(getSourceSceneNaruPortraitArt(scene()), NARU_PREY_PORTRAIT_ART);
  for (const actor of [{ id: 'naru', universe: 'Predator' }, { id: 'naru', universe: 'Prey' },
    { id: 'naru_prey', universe: 'Predator' }, null]) {
    assert.equal(getSourceSceneNaruPortraitArt({ ...scene(), actor }), null);
  }
  for (const [key, value] of Object.entries({ id: 50104, sourceSceneId: 'custom_prey', universe: 'Predator',
    mode: 'Fighter', material: 'jungle', incarnation: 'another Naru edition' })) {
    const other = scene(); other.definition[key] = value;
    assert.equal(getSourceSceneNaruPortraitArt(other), null, key);
  }
  for (const flag of ['customBattle', 'isCustomBattle', 'isCustom', 'forceBaseArena', 'dlcSuppressedArena']) {
    const custom = scene(); custom.definition[flag] = true;
    assert.equal(getSourceSceneNaruPortraitArt(custom), null, flag);
  }
});

test('Naru production PNG matches provenance and remains a single portrait', () => {
  const manifest = JSON.parse(readFileSync(new URL('../docs/assets/p0-p1-continuation-2026-11-13/naru/portrait-manifest.json', import.meta.url)));
  const bytes = readFileSync(new URL(`../public${NARU_PREY_PORTRAIT_ART.path}`, import.meta.url));
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 256); assert.equal(bytes.readUInt32BE(20), 256);
  assert.equal(bytes[25], 6);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.asset.sha256);
  assert.equal(manifest.asset.frameCount, 1);
  assert.equal(manifest.remainingWork.fullBodyArtworkComplete, false);
  assert.equal(manifest.remainingWork.animationArtworkComplete, false);
  assert.equal(manifest.remainingWork.backlogP0Closed, false);
});

test('HUD portrait waits for loading and draws only in the requested rectangle', async () => {
  const { drawSourceSceneNaruPortrait } = await import('../src/game/sourceScenePreyPortraitAssets.js?loaded');
  const previous = globalThis.Image, created = [], draws = [];
  globalThis.Image = class {
    complete = false; naturalWidth = 0; naturalHeight = 0;
    constructor() { created.push(this); }
  };
  const ctx = { save() {}, restore() {}, drawImage(...args) { draws.push(args); } };
  try {
    const current = scene(), before = structuredClone(current);
    assert.equal(drawSourceSceneNaruPortrait(ctx, current, 20, 30, 64), false);
    assert.equal(draws.length, 0);
    assert.equal(created[0].src, NARU_PREY_PORTRAIT_ART.path);
    created[0].naturalWidth = 256; created[0].naturalHeight = 256; created[0].onload();
    assert.equal(drawSourceSceneNaruPortrait(ctx, current, 20, 30, 64), true);
    assert.deepEqual(draws[0].slice(1), [20, 30, 64, 64]);
    assert.equal(drawSourceSceneNaruPortrait(ctx, current, 20, 30, 0), false);
    assert.equal(drawSourceSceneNaruPortrait(ctx, current, NaN, 30, 64), false);
    assert.deepEqual(current, before);
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});

test('failed images retain fallback and SSR does not construct an image', async () => {
  const previous = globalThis.Image, created = [];
  globalThis.Image = class {
    complete = false; naturalWidth = 0; naturalHeight = 0;
    constructor() { created.push(this); }
  };
  const ctx = { save() {}, restore() {}, drawImage() { throw new Error('must not draw'); } };
  try {
    for (const reason of ['failed', 'wrong-dimensions']) {
      const { drawSourceSceneNaruPortrait } = await import(`../src/game/sourceScenePreyPortraitAssets.js?${reason}`);
      assert.equal(drawSourceSceneNaruPortrait(ctx, scene(), 10, 20), false);
      if (reason === 'failed') created.at(-1).onerror();
      else { created.at(-1).naturalWidth = 1024; created.at(-1).naturalHeight = 1024; created.at(-1).onload(); }
      assert.equal(drawSourceSceneNaruPortrait(ctx, scene(), 10, 20), false);
    }
    delete globalThis.Image;
    const { drawSourceSceneNaruPortrait } = await import('../src/game/sourceScenePreyPortraitAssets.js?ssr');
    assert.equal(drawSourceSceneNaruPortrait(ctx, scene(), 10, 20), false);
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});
