import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import test from 'node:test';

register('./sourceSceneTestLoader.mjs', import.meta.url);

const { getHeroById } = await import('../src/game/heroes.js');
const { getQuarantinedCanonSprite } = await import('../src/game/runtimeSpriteQuarantine.js');
const { HISTORICAL_STAR_WARS_P0_SPRITE_QUARANTINES: [vaderGate] } = await import('../src/game/historicalStarWarsP0SpriteQuarantine.js');
const { getExtinctionViewmodel } = await import('../src/game/extinctionContent.js');
const { getKartForHero } = await import('../src/game/kart/kartRoster.js');
const { getHeroSpriteSheetSources, getHeroMeleeSpriteSheetSrcs, getSpriteSheetLayout } = await import('../src/game/spriteAssets.js');
const { getCharacterAnimationFrame, resolveCharacterAnimationAsset } = await import('../src/game/combat/characterAnimationCatalog.js');
const { drawPixelSprite, drawCombatantBust } = await import('../src/game/renderer.js');

const contexts = ['rpg', 'melee', 'tactics', 'nexus', 'collection', 'hud', 'kart'];

function assertPng(path, sha256, width, height) {
  const bytes = readFileSync(new URL(`../${path}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), sha256, path);
  assert.equal(bytes.toString('ascii', 12, 16), 'IHDR');
  assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [width, height]);
}

test('the rejected Bespin Vader staff atlas stays archived while current combat and portraits use the pending schematic', () => {
  const vader = getHeroById('vader');
  assert.equal(getQuarantinedCanonSprite(vader), vaderGate);
  assertPng(`DLC/StarWars/assets${vaderGate.asset}`, vaderGate.sha256, 1024, 1024);
  assert.equal(getQuarantinedCanonSprite({ ...vader, incarnation: 'Star Wars: A New Hope (1977)' }), null);
  assert.equal(getQuarantinedCanonSprite({ ...vader, universe: 'Other' }), null);
  assert.equal(getExtinctionViewmodel(vader).src, '');
  assert.deepEqual(getKartForHero(vader.id).driverSprite.sources, []);

  const calls = [];
  const context = new Proxy({}, {
    get(target, method) {
      return method in target ? target[method] : (...args) => calls.push({ method, args, color: target.fillStyle, shadowBlur: target.shadowBlur });
    }
  });
  const views = [vader, { ...vader, id: 'combat:p2', sourceHeroId: vader.id }, { ...vader, id: 'summon:p2', sourceId: vader.id }];
  for (const view of views) {
    assert.equal(getQuarantinedCanonSprite(view), vaderGate);
    assert.deepEqual(getHeroMeleeSpriteSheetSrcs(view), []);
    assert.equal(resolveCharacterAnimationAsset(view), null);
    for (const mode of contexts) {
      assert.deepEqual(getHeroSpriteSheetSources(view, mode), [], mode);
      drawPixelSprite(context, 70, 90, { ...view, state: 'attack' }, 0, 1, 72, mode);
    }
    assert.equal(drawCombatantBust(context, 0, 0, 60, 72, view), true);
  }
  assert.equal(calls.filter(({ method }) => method === 'drawImage').length, 0);
  assert.equal(calls.filter(({ method, args }) => method === 'fillText' && args[0] === 'ART PENDING').length, views.length * (contexts.length + 1));
  assert.equal(calls.filter(({ method }) => method === 'arc').length, views.length * (contexts.length + 1));
  assert.ok(!calls.some(({ color, shadowBlur }) => color === vader.weaponColor && shadowBlur === 6), 'the pending locator does not invent a weapon drawing');
});

const routedCorrections = [
  {
    id: 'han_solo', incarnation: 'Star Wars: A New Hope (1977) - Mos Eisley / Death Star escape', weaponType: 'gun',
    wave: '7', baseSha: '422985c683664f21278d6e5698346450502479c050c93392199ed5e1ff916be1',
    presentationSha: '2ca105124606a7f9d8841034a5af004f21bff1f48eef68b34f0a2ad3c588e6c4'
  },
  {
    id: 'luke', incarnation: 'Star Wars: Return of the Jedi (1983) - Death Star II Jedi Knight', weaponType: 'lightsaber',
    wave: '13-part-b', baseSha: '5feee4bf4b31609d48bb1f74ab848f6c998ab98885dc1d896d793554128be775',
    presentationSha: 'f231de229995ba8ca6bf85e1e77d15f87a683f8db0f65e2a13368c6baba15848'
  }
];

for (const correction of routedCorrections) {
  test(`${correction.id} uses the reviewed gameplay base and presentation for the live film incarnation`, () => {
    const hero = getHeroById(correction.id);
    const base = `/sprites/generated/combat-character-corrections-wave${correction.wave}/${hero.id}.png`;
    const presentation = `/sprites/generated/combat-character-animations-wave${correction.wave}/${hero.id}.png`;
    assert.equal(hero.incarnation, correction.incarnation);
    assert.equal(hero.weaponType, correction.weaponType);
    assert.equal(getQuarantinedCanonSprite(hero), null);
    assertPng(`public${base}`, correction.baseSha, 1024, 1024);
    assertPng(`public${presentation}`, correction.presentationSha, 1024, 2048);
    assert.deepEqual(getKartForHero(hero.id).driverSprite.sources, [base]);
    const layout = getSpriteSheetLayout(base);
    assert.deepEqual([layout.columns, layout.rows], [4, 4]);
    assert.deepEqual(['idle', 'run', 'attack', 'hit'].map(state => layout.rowByState[state]), [0, 1, 2, 3]);
    for (const actor of [hero, { ...hero, id: 'combat:p2', sourceHeroId: hero.id }]) {
      for (const context of contexts) assert.deepEqual(getHeroSpriteSheetSources(actor, context), [base], context);
      for (const phase of ['intro', 'outro', 'roundVictory', 'roundDefeat', 'super', 'victory', 'defeat', 'fatality']) {
        const samples = Array.from({ length: 101 }, (_, index) => getCharacterAnimationFrame(actor, { phase, progress: index / 100 }));
        assert.ok(samples.every(sample => sample?.asset.sheet === presentation), phase);
        assert.deepEqual([...new Set(samples.map(sample => sample.col))], [0, 1, 2, 3], phase);
        assert.ok(samples.every(sample => sample.canonicalAnimationVerified === false), phase);
      }
    }
  });
}
