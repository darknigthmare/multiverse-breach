import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getSourceSceneBoneMaskArt, PREY_BONE_MASK_FRONT_ART } from '../src/game/sourceScenePreyPropAssets.js';

const scene = (...done) => ({
  definition: { id: 50106, sourceSceneId: 'prey_1719_naru_feral_bog', universe: 'Prey', mode: 'Tactics', material: 'prey',
    incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale' },
  actor: { id: 'naru_prey', universe: 'Prey' }, done: new Set(done)
});

test('mask has one physical owner and never duplicates the mask still worn by Feral on the ground', () => {
  const roles = ['ground', 'carried', 'mounted'];
  for (const [current, expected] of [
    [scene(), []], [scene('flintlock'), []],
    [scene('flintlock', 'take_mask'), ['carried']],
    [scene('flintlock', 'take_mask', 'set_mask'), ['mounted']],
    [scene('set_mask'), []]
  ]) {
    assert.deepEqual(roles.filter(role => getSourceSceneBoneMaskArt(current, role)), expected);
  }
  assert.equal(getSourceSceneBoneMaskArt(scene('take_mask'), 'carried'), PREY_BONE_MASK_FRONT_ART);
  assert.equal(getSourceSceneBoneMaskArt(scene('take_mask'), 'launcher'), null);
});

test('the icon is unavailable for other scenes, actors, universes, modes and custom battles', () => {
  assert.equal(getSourceSceneBoneMaskArt(null, 'carried'), null);
  const actorVariants = [{ id: 'naru', universe: 'Predator' }, { id: 'naru', universe: 'Prey' },
    { id: 'naru_prey', universe: 'Predator' }, null];
  for (const actor of actorVariants) assert.equal(getSourceSceneBoneMaskArt({ ...scene('take_mask'), actor }, 'carried'), null);
  for (const [key, value] of Object.entries({ id: 50105, sourceSceneId: 'custom_prey', universe: 'Predator',
    mode: 'RPG', material: 'ship', incarnation: 'another film edition', customBattle: true,
    isCustomBattle: true, isCustom: true, forceBaseArena: true, dlcSuppressedArena: true })) {
    const other = scene('take_mask'); other.definition[key] = value;
    assert.equal(getSourceSceneBoneMaskArt(other, 'carried'), null, key);
  }
});

test('the canonical DLC icon and its publication match the selected final edit receipt', () => {
  const manifest = JSON.parse(readFileSync(new URL('../docs/assets/p0-p1-continuation-2026-11-13/bone-mask/prop-manifest.json', import.meta.url)));
  const source = readFileSync(new URL(`../${PREY_BONE_MASK_FRONT_ART.sourcePath}`, import.meta.url));
  const publication = readFileSync(new URL(`../public${PREY_BONE_MASK_FRONT_ART.path}`, import.meta.url));
  assert.deepEqual(publication, source);
  assert.equal(source.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(source.readUInt32BE(16), 256); assert.equal(source.readUInt32BE(20), 256);
  assert.equal(source[25], 6);
  assert.equal(createHash('sha256').update(source).digest('hex'), manifest.asset.sha256);
  assert.equal(manifest.selectedAttempt, 2);
  assert.equal(manifest.asset.frameCount, 1);
  assert.equal(manifest.runtimeProposal.groundPhysicalIconAllowed, false);
  assert.equal(manifest.remainingWork.backlogP0Closed, false);
  assert.equal(manifest.remainingWork.fullEquipmentArtworkComplete, false);
});

test('loading/error fallback and the carried/mounted sizes preserve scene state', async () => {
  const previous = globalThis.Image, created = [], draws = [];
  globalThis.Image = class {
    complete = false; naturalWidth = 0; naturalHeight = 0;
    constructor() { created.push(this); }
  };
  const ctx = { save() {}, restore() {}, drawImage(...args) { draws.push(args); } };
  try {
    const { drawSourceSceneBoneMask } = await import('../src/game/sourceScenePreyPropAssets.js?loaded');
    const current = scene('take_mask'), before = structuredClone(current);
    assert.equal(drawSourceSceneBoneMask(ctx, current, { x: 100, y: 80 }, 'ground'), false);
    assert.equal(created.length, 0, 'forbidden ground role never loads the icon');
    assert.equal(drawSourceSceneBoneMask(ctx, current, { x: 100, y: 80 }, 'carried'), false);
    assert.equal(draws.length, 0);
    assert.equal(created[0].src, PREY_BONE_MASK_FRONT_ART.path);
    created[0].naturalWidth = 256; created[0].naturalHeight = 256; created[0].onload();
    assert.equal(drawSourceSceneBoneMask(ctx, current, { x: 100, y: 80 }, 'carried'), true);
    assert.deepEqual(draws[0].slice(1), [88, 56, 24, 24]);
    assert.deepEqual(current, before);
    current.done.add('set_mask');
    assert.equal(drawSourceSceneBoneMask(ctx, current, { x: 100, y: 80 }, 'carried'), false);
    assert.equal(drawSourceSceneBoneMask(ctx, current, { x: 100, y: 80 }, 'mounted'), true);
    assert.deepEqual(draws[1].slice(1), [84, 48, 32, 32]);
    for (const failure of ['error', 'wrong-size']) {
      const module = await import(`../src/game/sourceScenePreyPropAssets.js?${failure}`);
      assert.equal(module.drawSourceSceneBoneMask(ctx, scene('take_mask'), { x: 20, y: 50 }, 'carried'), false);
      if (failure === 'error') created.at(-1).onerror();
      else { created.at(-1).naturalWidth = 100; created.at(-1).naturalHeight = 100; created.at(-1).onload(); }
      assert.equal(module.drawSourceSceneBoneMask(ctx, scene('take_mask'), { x: 20, y: 50 }, 'carried'), false);
    }
    delete globalThis.Image;
    const module = await import('../src/game/sourceScenePreyPropAssets.js?ssr');
    assert.equal(module.drawSourceSceneBoneMask(ctx, scene('take_mask'), { x: 20, y: 50 }, 'carried'), false);
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});
