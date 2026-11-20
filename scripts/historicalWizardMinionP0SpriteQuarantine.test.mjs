import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import test from 'node:test';
import { HISTORICAL_WIZARD_MINION_P0_SPRITE_QUARANTINES as records } from '../src/game/historicalWizardMinionP0SpriteQuarantine.js';
import { getQuarantinedCanonSprite } from '../src/game/runtimeSpriteQuarantine.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { getHeroById, HEROES_DB } = await import('../src/game/heroes.js');
const {
  getHeroCompleteSpritePack, getHeroMeleeAnimationFrame, getHeroMeleeSpriteSheetSrcs,
  getHeroSpriteSheetSrc, getHeroSpriteSheetSources
} = await import('../src/game/spriteAssets.js');
const { drawPixelSprite, drawCombatantBust } = await import('../src/game/renderer.js');
const { resolvePresentationScript } = await import('../src/game/combat/presentationCatalog.js');
const { getRpgActionProfile } = await import('../src/game/rpgTargeting.js');

const contexts = ['auto', 'rpg', 'tactics', 'melee', 'smash', 'collection', 'hud', 'kart'];
const review = JSON.parse(readFileSync(new URL(
  '../docs/assets/p0-p1-p2-continuation-04-2026-11-20/p0-media-review/review.json', import.meta.url
), 'utf8'));

for (const record of records) {
  const { actorId, universe, incarnation, asset } = record;
  const hero = getHeroById(actorId);

  test(`${actorId}: reviewed atlas stays archived and the exact playable actor routes to neutral art`, () => {
    const inspected = review.assets.find(entry => entry.id === actorId);
    const pack = universe === 'Harry Potter' ? 'HarryPotter' : 'Minions';
    const sourceBytes = readFileSync(new URL(`../DLC/${pack}/assets${asset}`, import.meta.url));
    assert.equal(inspected?.file, `public${asset}`);
    assert.equal(inspected?.catalogIncarnation, incarnation);
    assert.equal(createHash('sha256').update(sourceBytes).digest('hex'), inspected?.sha256);
    assert.equal(record.sha256, inspected?.sha256);
    assert.equal(HEROES_DB.filter(entry => entry.id === actorId).length, 1);
    assert.equal(hero.universe, universe);
    assert.equal(hero.incarnation, incarnation);
    const before = structuredClone(hero);
    const saved = { ...hero, cosmeticId: 'original', spriteSheet: asset };
    const opponent = { ...saved, id: `test:p2:${actorId}`, sourceHeroId: actorId };
    for (const actor of [hero, saved, opponent]) {
      assert.equal(getQuarantinedCanonSprite(actor), record);
      for (const context of contexts) {
        assert.deepEqual(getHeroSpriteSheetSources(actor, context), []);
        assert.equal(getHeroSpriteSheetSrc(actor, context), '');
      }
      assert.deepEqual(getHeroMeleeSpriteSheetSrcs(actor), []);
      assert.equal(getHeroMeleeAnimationFrame(actor), null);
      assert.equal(getHeroCompleteSpritePack(actor), null);
      for (const phase of ['intro', 'victory', 'defeat']) {
        assert.equal(resolvePresentationScript(actor, phase), null);
      }
    }
    assert.deepEqual(hero, before);
    assert.equal(getRpgActionProfile(hero, 'simple').name, before.simple.name);
  });

  test(`${actorId}: body and party bust draw a labelled silhouette in real rendering functions`, () => {
    const draws = [];
    const labels = [];
    const ctx = new Proxy({
      measureText: text => ({ width: String(text).length * 6 }),
      createLinearGradient: () => ({ addColorStop() {} }),
      createRadialGradient: () => ({ addColorStop() {} }),
      drawImage: (...args) => draws.push(args),
      fillText: text => labels.push(text)
    }, {
      get: (target, key) => key in target ? target[key] : () => {}
    });
    for (const state of ['idle', 'run', 'attack', 'hit']) {
      drawPixelSprite(ctx, 100, 140, { ...hero, state }, 0, 1, 72, 'melee');
    }
    drawCombatantBust(ctx, 0, 0, 64, 64, hero, 'hero');
    assert.equal(draws.length, 0);
    assert.equal(labels.filter(text => text === 'ART PENDING').length, 5);
  });

  test(`${actorId}: a matching name in another universe, edition or unverified alias is unaffected`, () => {
    const alias = { ...hero, id: 'p2-other-slot', sourceId: actorId };
    assert.equal(getQuarantinedCanonSprite(alias), record);
    assert.equal(getQuarantinedCanonSprite({ ...alias, universe: 'Unrelated adventure' }), null);
    assert.equal(getQuarantinedCanonSprite({ ...alias, incarnation: 'An unrelated adaptation' }), null);
    assert.equal(getQuarantinedCanonSprite({ ...alias, incarnation: undefined }), null);
    assert.equal(getQuarantinedCanonSprite({ ...alias, sourceHeroId: 'unrelated-id' }), null);
  });
}

test('the distinct wizard IDs keep their original routes and do not authorize another edition', () => {
  for (const [id, file] of [['harry_potter', 'harry-potter'], ['hermione_granger', 'hermione-granger']]) {
    const hero = getHeroById(id);
    assert.equal(getQuarantinedCanonSprite(hero), null);
    assert.equal(getHeroSpriteSheetSrc(hero), `/sprites/generated/heroes/harry-potter/${file}.png`);
  }
});
