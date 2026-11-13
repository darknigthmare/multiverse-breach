import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getSourceSceneBackdropArt, drawSourceSceneBackdropArt } from '../src/game/sourceSceneArtAssets.js';

const scene = {
  id: 50106, sourceSceneId: 'prey_1719_naru_feral_bog', universe: 'Prey', mode: 'Tactics',
  incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale'
};

test('Prey forest stays with its exact tactical source scene, never another mode or edition', () => {
  const art = getSourceSceneBackdropArt(scene);
  assert.ok(art);
  assert.equal(art.bogArtworkComplete, false);
  assert.equal(art.visualFidelityApproved, false);
  for (const patch of [{ id: 50104 }, { universe: 'Predator' }, { mode: 'RPG' },
    { mode: 'Melee' }, { incarnation: 'Prey (2006)' }, { sourceSceneId: 'another-scene' },
    { customBattle: {} }, { isCustom: true }, { forceBaseArena: true }, { dlcSuppressedArena: true }]) {
    assert.equal(getSourceSceneBackdropArt({ ...scene, ...patch }), null, JSON.stringify(patch));
  }
  const file = readFileSync(new URL(`../public${art.path}`, import.meta.url));
  assert.equal(file.subarray(1, 4).toString(), 'PNG');
  assert.equal(file.readUInt32BE(16), 960);
  assert.equal(file.readUInt32BE(20), 540);
});

test('the three source finales have distinct DLC artwork and retain their unfinished source-specific props', () => {
  const scenes = [scene,
    { id: 50104, sourceSceneId: 'predator_1987_jungle_finale', universe: 'Predator', mode: 'Tactics',
      incarnation: 'Predator (1987) — Dutch / Jungle Hunter final confrontation' },
    { id: 50105, sourceSceneId: 'predator_2_lost_tribe_ship_1990', universe: 'Predator', mode: 'Tactics',
      incarnation: 'Predator 2 (1990) — Los Angeles subterranean Lost Tribe ship / trophy chamber' }
  ];
  const assets = scenes.map(s => getSourceSceneBackdropArt(s));
  assert.equal(new Set(assets.map(a => a.path)).size, 3);
  assert.equal(assets[0].bogArtworkComplete, false);
  assert.equal(assets[1].trapArtworkComplete, false);
  assert.equal(assets[2].trophyArtworkComplete, false);
  for (const [i, art] of assets.entries()) {
    assert.equal(art.visualFidelityApproved, false);
    const source = readFileSync(new URL(`../${art.sourcePath}`, import.meta.url));
    const publication = readFileSync(new URL(`../public${art.path}`, import.meta.url));
    assert.deepEqual(source, publication, 'DLC source and public projection stay byte-identical');
    assert.equal(getSourceSceneBackdropArt({ ...scenes[i], mode: 'Combat' }), null);
    assert.equal(getSourceSceneBackdropArt({ ...scenes[i], mode: 'Melee' }), null);
    assert.equal(getSourceSceneBackdropArt({ ...scenes[i], mode: 'RPG' }), null);
  }
});

test('real-image loading keeps the schematic until ready, then draws with a centered cover crop', () => {
  const previous = globalThis.Image, made = [], draws = [], calls = [];
  globalThis.Image = class {
    constructor() { made.push(this); this.complete = false; this.naturalWidth = 0; this.naturalHeight = 0; }
  };
  const ctx = { save: () => calls.push('save'), restore: () => calls.push('restore'),
    drawImage: (...args) => draws.push(args) };
  try {
    assert.equal(drawSourceSceneBackdropArt(ctx, scene, 960, 540), false);
    assert.equal(draws.length, 0);
    assert.equal(made.length, 1);
    assert.equal(made[0].src, getSourceSceneBackdropArt(scene).path);
    made[0].naturalWidth = 960; made[0].naturalHeight = 540; made[0].onload();
    assert.equal(drawSourceSceneBackdropArt(ctx, scene, 600, 600), true);
    assert.deepEqual(draws[0].slice(1), [210, 0, 540, 540, 0, 0, 600, 600]);
    assert.deepEqual(calls, ['save', 'restore']);
    assert.equal(ctx.imageSmoothingEnabled, false);
    assert.equal(made.length, 1, 'one image request survives subsequent frames');
    assert.equal(drawSourceSceneBackdropArt(ctx, { ...scene, mode: 'Combat' }, 960, 540), false);
    assert.equal(draws.length, 1);
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});

test('failed images stay on the schematic rather than drawing a broken or wrong scene', async () => {
  const { drawSourceSceneBackdropArt: drawFresh } = await import('../src/game/sourceSceneArtAssets.js?error-case');
  const previous = globalThis.Image, made = [];
  globalThis.Image = class { constructor() { made.push(this); } };
  const ctx = { drawImage: () => assert.fail('failed image must not draw') };
  try {
    assert.equal(drawFresh(ctx, scene, 960, 540), false);
    made[0].onerror();
    made[0].naturalWidth = 960; made[0].naturalHeight = 540;
    assert.equal(drawFresh(ctx, scene, 960, 540), false);
    assert.equal(made.length, 1);
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});
