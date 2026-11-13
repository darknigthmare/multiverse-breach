import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import test from 'node:test';
register('./sourceSceneTestLoader.mjs', import.meta.url);
const { getHeroById } = await import('../src/game/heroes.js');
const { getQuarantinedCanonSprite, QUARANTINED_CANON_SPRITES } = await import('../src/game/canonicalSpriteQuarantine.js');
const sprites = await import('../src/game/spriteAssets.js');
const { drawPixelSprite, drawCombatantBust } = await import('../src/game/renderer.js');
const hero = getHeroById('batman_tdk');

test('the actually inspected civilian atlas stays intact but is unavailable for the exact 2008 Batsuit', () => {
  const record = QUARANTINED_CANON_SPRITES.batman_tdk;
  const bytes = readFileSync(new URL('../DLC/TheDarkKnight/assets' + record.asset, import.meta.url));
  assert.equal(bytes.length, 957350);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);
  assert.equal(getQuarantinedCanonSprite(hero), record);
  const before = structuredClone(hero);
  for (const context of ['auto', 'rpg', 'melee', 'tactics', 'smash']) {
    assert.deepEqual(sprites.getHeroSpriteSheetSources(hero, context), []);
    assert.equal(sprites.getHeroSpriteSheetSrc(hero, context), '');
  }
  assert.equal(sprites.getHeroCompleteSpritePack(hero), null);
  assert.deepEqual(sprites.getHeroMeleeSpriteSheetSrcs(hero), []);
  assert.equal(sprites.getHeroMeleeAnimationFrame(hero), null);
  assert.deepEqual(hero, before, 'Visual gating must not mutate combat data or stable identity');
});

test('combat aliases keep the gate, while another edition, universe or actor is not inferred from a name', () => {
  assert.ok(getQuarantinedCanonSprite({ ...hero, id: 'combat:batman:0', sourceHeroId: hero.id }));
  for (const changed of [{ universe: 'Batman Comics' }, { incarnation: 'Batman Begins (2005)' },
    { id: 'another_actor' }, { id: '' }, { id: null }, { id: 1 }]) {
    assert.equal(getQuarantinedCanonSprite({ ...hero, ...changed }), null);
  }
  const saved = { ...hero, cosmeticId: 'original', spriteSheet: QUARANTINED_CANON_SPRITES.batman_tdk.asset };
  assert.deepEqual(sprites.getHeroSpriteSheetSources(saved), []);
  assert.ok(sprites.getHeroSpriteSheetSrc(getHeroById('darth_revan'))?.includes('corrections-wave13'));
});

test('real body and HUD renderers draw an explicit pending silhouette without loading an unrelated bitmap', () => {
  const calls = [];
  const gradient = { addColorStop() {} };
  const ctx = new Proxy({ measureText: text => ({ width: String(text).length * 6 }),
    createLinearGradient: () => gradient, createRadialGradient: () => gradient }, {
    get(target, key) { return key in target ? target[key] : (...args) => calls.push({ op: key, args }); },
    set(target, key, value) { target[key] = value; return true; }
  });
  for (const state of ['idle', 'run', 'attack', 'hit']) {
    drawPixelSprite(ctx, 100, 140, { ...hero, state }, 0, 1, 72);
  }
  drawCombatantBust(ctx, 0, 0, 64, 64, hero, 'hero');
  assert.equal(calls.filter(c => c.op === 'drawImage').length, 0);
  assert.ok(calls.filter(c => c.op === 'fillText' && c.args[0] === 'ART PENDING').length >= 5);
});
