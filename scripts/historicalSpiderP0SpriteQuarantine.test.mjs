import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { HISTORICAL_SPIDER_P0_SPRITE_QUARANTINES as REVIEWED } from '../src/game/historicalSpiderP0SpriteQuarantine.js';

const assetInventory = JSON.parse(readFileSync(new URL('../DLC/SpiderTheVideoGame/assets.json', import.meta.url)));
const contexts = ['auto', 'rpg', 'melee', 'tactics', 'collection', 'hud', 'fps', 'kart'];
const expectedLoadouts = {
  cyber_spider_kelly: ['blade', 'Slasher Attachment Rush', 'melee', 'melee'],
  cyber_spider_electro_beam: ['electro_beam', 'Electro-Beam Cyber-Leg Burst', 'beam', 'electricBeam'],
  cyber_spider_flamethrower: ['flamethrower', 'Flamethrower Cyber-Leg Burst', 'projectile', 'flame']
};

test('the three rejected 1997 atlas fingerprints still match their exact archived DLC assets', () => {
  assert.deepEqual(REVIEWED.map(record => record.actorId), Object.keys(expectedLoadouts));
  for (const record of REVIEWED) {
    const entry = assetInventory.assets.find(asset => asset.publicPath === record.asset);
    assert.ok(entry, record.actorId);
    const bytes = readFileSync(new URL(`../${entry.sourcePath}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);
    assert.equal(bytes.readUInt32BE(16), 1024);
    assert.equal(bytes.readUInt32BE(20), 1024);
  }
});

test('real Kelly loadouts retain their weapons and attack profiles while rejecting the legacy character bitmap', async () => {
  const server = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  const previousImage = globalThis.Image;
  const requested = [];
  globalThis.Image = class { set src(value) { requested.push(value); } };
  try {
    const { getQuarantinedCanonSprite } = await server.ssrLoadModule('/src/game/runtimeSpriteQuarantine.js');
    const { getHeroById } = await server.ssrLoadModule('/src/game/heroes.js');
    const { getHeroSpriteSheetSources, getHeroMeleeAnimationFrame, getHeroMeleeSpriteSheetSrcs } = await server.ssrLoadModule('/src/game/spriteAssets.js');
    const { resolveCombatAbility, resolveCombatHeroSpriteActor } = await server.ssrLoadModule('/src/game/combatIdentity.js');
    const { resolveCanonHeroAttackEffect } = await server.ssrLoadModule('/src/game/canonHeroAttackEffects.js');
    const { resolvePresentationScript } = await server.ssrLoadModule('/src/game/combat/presentationCatalog.js');
    const { drawCombatantBust, drawPixelSprite } = await server.ssrLoadModule('/src/game/renderer.js');
    const { getExtinctionViewmodel } = await server.ssrLoadModule('/src/game/extinctionContent.js');
    const { getKartForHero } = await server.ssrLoadModule('/src/game/kart/kartRoster.js');
    for (const record of REVIEWED) {
      const hero = getHeroById(record.actorId);
      const [weapon, special, delivery, effect] = expectedLoadouts[record.actorId];
      assert.equal(hero.sourceIdentityType, 'source-protagonist-loadout-adaptation');
      assert.equal(hero.weaponType, weapon);
      const kart = getKartForHero(hero.id);
      assert.equal(kart.heroId, hero.id);
      assert.deepEqual(kart.driverSprite.sources, []);
      assert.equal(kart.sprite2D.containsDriver, false);
      const before = JSON.stringify(hero);
      for (const actor of [hero, { ...hero, id: `p2:${hero.id}:0`, sourceId: hero.id },
        resolveCombatHeroSpriteActor({ id: 'cpu:1', sourceHeroId: hero.id, universe: hero.universe })]) {
        assert.equal(getQuarantinedCanonSprite(actor).sha256, record.sha256);
        for (const context of contexts) assert.deepEqual(getHeroSpriteSheetSources(actor, context), [], `${hero.id} / ${context}`);
        assert.equal(getHeroMeleeAnimationFrame(actor), null);
        assert.deepEqual(getHeroMeleeSpriteSheetSrcs(actor), []);
        assert.equal(resolvePresentationScript(actor, 'intro'), null);
        assert.equal(getExtinctionViewmodel(actor).src, '');
        const action = resolveCombatAbility(actor, 'special');
        assert.equal(action.name, special);
        assert.equal(action.delivery, delivery);
        assert.equal(resolveCanonHeroAttackEffect(actor, 'special').kind, effect);
        const labels = [];
        const canvas = new Proxy({ canvas: { isConnected: true }, fillText: value => labels.push(value) }, {
          get(target, key) { return key in target ? target[key] : () => {}; }
        });
        for (const context of ['rpg', 'melee', 'tactics']) drawPixelSprite(canvas, 50, 74, { ...actor, state: 'attack' }, 0, -1, 72, context);
        assert.equal(drawCombatantBust(canvas, 0, 0, 60, 72, actor), true);
        assert.ok(labels.includes('ART PENDING'), 'unavailable character art must be visible as a status');
      }
      assert.equal(JSON.stringify(hero), before);
      assert.equal(getQuarantinedCanonSprite({ ...hero, incarnation: 'Another edition' }), null);
      assert.equal(getQuarantinedCanonSprite({ ...hero, universe: 'Another universe' }), null);
    }
    assert.deepEqual(requested, []);
  } finally {
    if (previousImage === undefined) delete globalThis.Image;
    else globalThis.Image = previousImage;
    await server.close();
  }
});
