import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import corrections from '../src/game/combat/characterSpriteCorrectionsWave13PartB.generated.json' with { type: 'json' };
import { getHeroById } from '../src/game/heroes.js';
import { getHeroSpriteSheetSources, getHeroSpriteSheetSrc, getHeroMeleeAnimationFrame, getHeroMeleeSpriteSheetSrcs, getHeroCompleteSpritePack,
  getReviewedQuarantinedHeroSprite } from '../src/game/spriteAssets.js';
import { getQuarantinedCanonSprite, getReviewedQuarantineCorrection, QUARANTINED_CANON_SPRITES,
  REVIEWED_KOTOR_I_REVAN_CORRECTION as approved } from '../src/game/canonicalSpriteQuarantine.js';

const hero = getHeroById('darth_revan');
const candidate = corrections.entries.find(entry => entry.heroId === hero.id);

test('the exact inspected single-red correction is selected while the rejected original remains quarantined', () => {
  const before = structuredClone(hero);
  assert.equal(getQuarantinedCanonSprite(hero), QUARANTINED_CANON_SPRITES.darth_revan);
  assert.equal(getReviewedQuarantinedHeroSprite(hero), approved);
  for (const context of ['auto', 'rpg', 'melee', 'tactics', 'smash']) {
    assert.deepEqual(getHeroSpriteSheetSources(hero, context), [approved.sheet]);
    assert.equal(getHeroSpriteSheetSrc(hero, context), approved.sheet);
    assert.equal(getHeroSpriteSheetSources(hero, context).includes(QUARANTINED_CANON_SPRITES.darth_revan.asset), false);
  }
  assert.equal(getHeroMeleeAnimationFrame(hero), null, 'unreviewed 48-frame action art is still blocked');
  assert.deepEqual(getHeroMeleeSpriteSheetSrcs(hero), []);
  assert.equal(getHeroCompleteSpritePack(hero), null, 'no old selectable costume pack is enabled');
  assert.deepEqual(hero, before);
});

test('path, PNG checksum, native provenance and the reviewed 16-frame layout must all match', () => {
  assert.equal(getReviewedQuarantineCorrection(hero, candidate), approved);
  for (const [key, value] of Object.entries({ sheet: approved.sheet + '?new', sha256: '0'.repeat(64),
    sourceImageSha256: '0'.repeat(64), sourceWork: 'The Old Republic MMO', heroId: 'other_actor', universe: 'Other universe',
    columns: 8, rows: 6, frames: 48, width: 2048 })) {
    assert.equal(getReviewedQuarantineCorrection(hero, { ...candidate, [key]: value }), null, key);
  }
  for (const normalization of [null, { baseline: 244, rows: {} },
    { ...candidate.normalization, baseline: 230 }, { ...candidate.normalization, rows: [null, null, null, null] }]) {
    assert.equal(getReviewedQuarantineCorrection(hero, { ...candidate, normalization }), null);
  }
  assert.equal(getReviewedQuarantineCorrection(hero, { ...candidate, states: { ...candidate.states, attack: { row: 5, columns: 4, frames: 4 } } }), null);
});

test('other editions, universes and conflicting aliases cannot obtain the reviewed correction', () => {
  const variants = [
    { ...hero, incarnation: undefined }, { ...hero, incarnation: 'Star Wars: Knights of the Old Republic II' },
    { ...hero, universe: 'Other universe' }, { ...hero, sourceHeroId: 'ahsoka' },
    { ...hero, sourceId: true }, { ...hero, sourceHeroId: {} },
    { ...hero, id: 'combat:revan:2', sourceHeroId: 'darth_revan' }
  ];
  for (const actor of variants) {
    assert.equal(getReviewedQuarantinedHeroSprite(actor), null);
    assert.equal(getHeroSpriteSheetSources(actor).includes(approved.sheet), false);
  }
  for (const id of ['ahsoka', 'ahsoka_padawan']) {
    const actor = getHeroById(id);
    assert.equal(getReviewedQuarantinedHeroSprite(actor), null);
    assert.deepEqual(getHeroSpriteSheetSources(actor), []);
  }
});

test('saved cosmetic fields cannot redirect the canonical correction to the old dual-saber atlas', () => {
  const actor = { ...hero, spriteSource: QUARANTINED_CANON_SPRITES.darth_revan.asset,
    spriteSheet: QUARANTINED_CANON_SPRITES.darth_revan.asset, cosmeticId: 'original', variant: 'original' };
  assert.deepEqual(getHeroSpriteSheetSources(actor), [approved.sheet]);
});

test('the selected existing PNG bytes match the reviewed source record and retain alpha/grid dimensions', () => {
  const png = readFileSync(new URL('../public' + approved.sheet, import.meta.url));
  assert.equal(createHash('sha256').update(png).digest('hex'), approved.sha256);
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1024); assert.equal(png.readUInt32BE(20), 1024); assert.equal(png[25], 6);
  assert.equal(approved.fullSource1to1Verified, false);
});
