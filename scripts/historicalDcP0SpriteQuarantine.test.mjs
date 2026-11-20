import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import test from 'node:test';

register('./sourceSceneTestLoader.mjs', import.meta.url);

const { getHeroById } = await import('../src/game/heroes.js');
const { getQuarantinedCanonSprite } = await import('../src/game/runtimeSpriteQuarantine.js');
const { HISTORICAL_DC_P0_SPRITE_QUARANTINES, getReviewedDcP0Bust } = await import('../src/game/historicalDcP0SpriteQuarantine.js');
const { drawCombatantBust, drawPixelSprite } = await import('../src/game/renderer.js');
const { getHeroSpriteSheetSources, getHeroMeleeAnimationFrame, getHeroCompleteSpritePack } = await import('../src/game/spriteAssets.js');
const { getSummonAnimationAssets, resolveSummonAnimationAsset } = await import('../src/game/combat/summonAnimationCatalog.js');

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceBytes = path => readFileSync(new URL(`..${path}`, import.meta.url));
const starfire = getHeroById('starfire_tt');
const raven = getHeroById('raven_tt');
const packNames = { 'Joker New 52': 'JokerNew52', 'Teen Titans': 'TeenTitans', 'The Batman Who Laughs': 'TheBatmanWhoLaughs' };

const canvas = calls => new Proxy({ measureText: () => ({ width: 40 }) }, {
  get(target, key) { return key in target ? target[key] : (...args) => calls.push([key, ...args]); }
});

test('the six new DC scope locks match the live heroes and the rejected archived bytes', () => {
  for (const record of HISTORICAL_DC_P0_SPRITE_QUARANTINES) {
    const hero = getHeroById(record.actorId);
    assert.equal(hash(sourceBytes(`/DLC/${packNames[record.universe]}/assets${record.asset}`)), record.sha256);
    assert.equal(getQuarantinedCanonSprite(hero)?.asset, record.asset);
    const before = structuredClone(hero);
    for (const actor of [hero, { ...hero, id: 'p2-cpu', sourceHeroId: hero.id }, { ...hero, id: 'combat:summon', sourceId: hero.id }]) {
      for (const context of ['rpg', 'tactics', 'melee', 'hud', 'collection', 'fps', 'kart']) {
        const fromSave = { ...actor, spriteSheet: record.asset, spriteSource: record.asset, cosmeticId: 'original' };
        assert.deepEqual(getHeroSpriteSheetSources(fromSave, context), [], `${record.actorId}/${actor.id}/${context}`);
        assert.equal(getHeroCompleteSpritePack(fromSave), null);
        assert.equal(getHeroMeleeAnimationFrame(fromSave), null);
      }
    }
    assert.equal(getQuarantinedCanonSprite({ ...hero, universe: 'Other universe' }), null);
    assert.equal(getQuarantinedCanonSprite({ ...hero, incarnation: 'alternate source' }), null);
    assert.deepEqual(hero, before);
  }
});

test('Starfire reuses only the inspected recovery crop for the Canvas bust and retains the native summon', () => {
  const bust = getReviewedDcP0Bust(starfire, getQuarantinedCanonSprite(starfire));
  const asset = getSummonAnimationAssets().find(candidate => candidate.id === 'starfire_tt-wave16');
  assert.equal(bust.sheet, asset.sheet);
  assert.equal(hash(sourceBytes(`/public${bust.sheet}`)), bust.sha256);
  const descriptor = { kind: 'reinforcement', universe: starfire.universe, entityName: asset.entityName,
    action: { name: asset.actionName, sourceHeroId: starfire.id }, sourceHeroId: starfire.id,
    performer: starfire, performerRole: 'reinforcement' };
  assert.equal(resolveSummonAnimationAsset(descriptor), asset);
  const alias = { ...starfire, id: 'combat:starfire', sourceId: starfire.id };
  assert.equal(getReviewedDcP0Bust(alias, getQuarantinedCanonSprite(alias)), bust);
  for (const alt of [{ ...starfire, incarnation: 'Teen Titans Go!' }, { ...starfire, sourceHeroId: 'raven_tt' },
    { ...starfire, sourceHeroId: starfire.id, sourceId: 'raven_tt' }]) {
    assert.equal(getReviewedDcP0Bust(alt, getQuarantinedCanonSprite(alt)), null);
  }
  assert.deepEqual(getHeroSpriteSheetSources(starfire, 'tactics'), [], 'the special-use portrait cannot become a base sheet');
});

test('Raven reuses only the portrait crop from its shipped 2003 characterSolo CG', () => {
  const bust = getReviewedDcP0Bust(raven, getQuarantinedCanonSprite(raven));
  const evidence = JSON.parse(sourceBytes('/docs/cg/raven-wave3-2026-10-20.json'));
  const thumbnail = evidence.entries.find(entry => entry.type === 'characterSolo').assets.thumbnail;
  const inventory = JSON.parse(sourceBytes('/DLC/TeenTitans/assets.json'));
  assert.ok(inventory.assets.some(asset => asset.publicPath === thumbnail.path));
  assert.equal(bust.sheet, thumbnail.path);
  assert.equal(bust.sha256, thumbnail.sha256);
  assert.equal(bust.width, thumbnail.width);
  assert.equal(bust.height, thumbnail.height);
  assert.deepEqual(bust.crop, { x: 113, y: 30, width: 91, height: 120 });
  const other = { ...raven, incarnation: 'Teen Titans Go!' };
  assert.equal(getReviewedDcP0Bust(other, getQuarantinedCanonSprite(other)), null);
  assert.deepEqual(getHeroSpriteSheetSources(raven, 'tactics'), [], 'the CG crop cannot become a base sheet');
});

test('runtime Canvas draws the reviewed crop, keeping the body and other quarantined portraits on neutral routes', () => {
  const oldImage = globalThis.Image;
  const requests = [];
  globalThis.Image = class {
    complete = true;
    set src(value) {
      const [width, height] = value.startsWith('/cg/') ? [384, 512] : [2048, 1024];
      this.naturalWidth = width;
      this.naturalHeight = height;
      requests.push(value);
      this.onload();
    }
  };
  try {
    const calls = [];
    const ctx = canvas(calls);
    for (const record of HISTORICAL_DC_P0_SPRITE_QUARANTINES) for (const state of ['idle', 'run', 'attack', 'hit']) {
      drawPixelSprite(ctx, 100, 160, { ...getHeroById(record.actorId), state }, 0, 1, 72, 'rpg');
    }
    drawCombatantBust(ctx, 0, 0, 64, 64, getHeroById('harley_n52'));
    assert.deepEqual(requests, []);
    assert.equal(calls.filter(([name, label]) => name === 'fillText' && label === 'ART PENDING').length, 25);
    assert.equal(calls.filter(([name]) => name === 'drawImage').length, 0);
    drawCombatantBust(ctx, 0, 0, 64, 64, starfire);
    drawCombatantBust(ctx, 0, 0, 64, 64, raven);
    const crops = calls.filter(([name]) => name === 'drawImage');
    assert.deepEqual(crops.map(crop => crop.slice(2, 6)), [[1226, 782, 76, 80], [113, 30, 91, 120]]);
    assert.deepEqual(requests, [
      '/sprites/generated/summon-animations-wave16/starfire.png',
      '/cg/teen-titans/raven-tt/character-solo-wave3-2026-10-20-thumb.webp'
    ]);
  } finally {
    if (oldImage === undefined) delete globalThis.Image;
    else globalThis.Image = oldImage;
  }
});
