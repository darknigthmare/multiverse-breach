import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import test from 'node:test';

register('./sourceSceneTestLoader.mjs', import.meta.url);

const { getHeroById } = await import('../src/game/heroes.js');
const { getQuarantinedCanonSprite } = await import('../src/game/runtimeSpriteQuarantine.js');
const { getHeroSpriteSheetSrc, getHeroSpriteSheetSources, getSpriteFrameForLayout,
  getSpritePreviewPosition, getSpriteSheetLayout, getSpriteStateResolution } = await import('../src/game/spriteAssets.js');
const { getCardArtPresentation } = await import('../src/components/cards/cardArtPresentation.js');
const { getKartForHero } = await import('../src/game/kart/kartRoster.js');
const { resolveP0CanonAttackEffect } = await import('../src/game/canonP0AttackEffects.js');
const { drawCombatantBust, drawPixelSprite } = await import('../src/game/renderer.js');
const { HISTORICAL_LILO_P0_POSE_FALLBACKS: [liloReview] } = await import('../src/game/combat/historicalLiloP0PoseFallbacks.js');

const modes = ['rpg', 'tactics', 'melee', 'nexus', 'collection', 'kart'];
const atlasSha256 = path => createHash('sha256').update(readFileSync(new URL(`../DLC/LiloStitch/assets${path}`, import.meta.url))).digest('hex');

test('Stitch retains the exact 2002 identity and actions while his wrong armored atlas stays archived', () => {
  const stitch = getHeroById('stitch_626');
  const quarantine = getQuarantinedCanonSprite(stitch);
  assert.equal(quarantine.actorId, stitch.id);
  assert.equal(atlasSha256(quarantine.asset), quarantine.sha256);
  assert.equal(getQuarantinedCanonSprite({ ...stitch, incarnation: 'Experiment 626 in the opening escape' }), null);
  assert.equal(getQuarantinedCanonSprite({ ...stitch, universe: 'Other universe' }), null);
  assert.deepEqual(getKartForHero(stitch.id).driverSprite.sources, []);
  assert.equal(resolveP0CanonAttackEffect(stitch, 'special').kind, 'melee');
  const labels = [];
  const context = new Proxy({}, {
    get: (_, method) => method === 'drawImage' ? () => assert.fail('incorrect character bitmap')
      : method === 'fillText' ? (...args) => labels.push(args) : () => {}
  });
  for (const actor of [stitch, { ...stitch, id: 'cpu:1', sourceHeroId: stitch.id }]) {
    for (const mode of modes) {
      assert.deepEqual(getHeroSpriteSheetSources(actor, mode), []);
      drawPixelSprite(context, 50, 80, { ...actor, state: 'attack' }, 40, 1, 72, mode);
    }
    assert.equal(drawCombatantBust(context, 0, 0, 44, 50, actor), true);
  }
  assert.equal(labels.length, 2 * (modes.length + 1));
  assert.ok(labels.every(([text, , , maxWidth]) => text === 'ART PENDING' && maxWidth > 0));
});

test('Lilo uses reviewed cells for combat, movement and previews while keeping the camera effect', () => {
  const lilo = getHeroById('lilo_pelekai');
  assert.equal(atlasSha256(liloReview.sheet), '4a5866860d2403299372f4af4bf150d91d8f262127e84fbe4e73e18b4628319d');
  assert.equal(getQuarantinedCanonSprite(lilo), null);
  assert.equal(resolveP0CanonAttackEffect(lilo, 'simple').kind, 'cameraFlash');
  const layout = getSpriteSheetLayout(liloReview.sheet);
  for (const mode of modes) assert.equal(getHeroSpriteSheetSrc(lilo, mode), liloReview.sheet);
  for (const state of ['idle', 'attack', 'special', 'support', 'defense', 'hit', 'dead', 'intro', 'victory', 'defeat']) {
    const first = getSpriteFrameForLayout(state, 0, layout);
    const second = getSpriteFrameForLayout(state, 10, layout);
    assert.deepEqual([first.row, first.col, second.row, second.col], [0, 2, 0, 3], state);
    assert.equal(getSpriteStateResolution(state, layout).canonicalAnimationVerified, false);
  }
  for (const state of ['run', 'walk', 'jump', 'fall']) {
    const first = getSpriteFrameForLayout(state, 0, layout);
    const second = getSpriteFrameForLayout(state, 10, layout);
    assert.deepEqual([first.row, first.col, second.row, second.col], [1, 0, 1, 3], state);
  }
  assert.equal(getKartForHero(lilo.id).driverSprite.col, 2);
  assert.equal(getSpritePreviewPosition(layout), `${2 / 3 * 100}% 0%`);
  const art = getCardArtPresentation({ image: liloReview.sheet, source: 'project-sprite' });
  assert.equal(art.style.backgroundPosition, getSpritePreviewPosition(layout));
});
