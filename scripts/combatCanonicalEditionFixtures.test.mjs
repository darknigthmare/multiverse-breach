import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { resolveCharacterAnimationAsset } from '../src/game/combat/characterAnimationCatalog.js';
import { prefersCurrentCanonCombatKit } from '../src/game/combat/sourceKitPriority.js';
import { supportsNativeSuperWave13 } from '../src/game/combat/nativeSuperVisualsWave13.js';
import { CANONICAL_BASE_EDITIONS, RAW_CANONICAL_EDITIONS, NATIVE_SOURCE_BASE_EDITIONS, assertNativeSourceBaseEdition, assertBaseSpriteEdition,
  assertCatalogActionEdition, assertCatalogWeaponEdition, historicalWave13Actor } from './combatCanonicalEditionFixtures.mjs';

const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const json = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url)));
const wave13 = json('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('all nine pinned master canonical bodies retain exact historical bytes and resolve source aliases only in their real universe', () => {
  assert.equal(Object.keys(CANONICAL_BASE_EDITIONS).length, 9);
  for (const [id, edition] of Object.entries(CANONICAL_BASE_EDITIONS)) {
    const actor = roster.get(id);
    for (const historical of edition.historicalAtlases) assertBaseSpriteEdition(actor, historical, getHeroSpriteSheetSrc(actor, 'rpg'));
    for (const key of ['sourceHeroId', 'sourceId']) {
      const alias = { ...actor, id: 'runtime:' + id, [key]: id };
      assert.equal(getHeroSpriteSheetSrc(alias, 'rpg'), edition.src, id + ':' + key);
      assert.notEqual(getHeroSpriteSheetSrc({ ...alias, universe: 'Foreign continuity' }, 'rpg'), edition.src, id);
      assert.notEqual(getHeroSpriteSheetSrc({ ...alias, [key]: 'unregistered' }, 'rpg'), edition.src, id);
    }
  }
});

test('edition fixtures reject changed historical hashes, selected paths, raw slots, universe and incarnation', () => {
  for (const [id, edition] of Object.entries(CANONICAL_BASE_EDITIONS)) {
    const actor = roster.get(id), historical = edition.historicalAtlases[0];
    assert.throws(() => assertBaseSpriteEdition(actor, { ...historical, sha256: '0'.repeat(64) }, edition.src));
    assert.throws(() => assertBaseSpriteEdition(actor, historical, '/sprites/unreviewed.png'));
  }
  for (const [id, edition] of Object.entries(RAW_CANONICAL_EDITIONS)) for (const [slot, revision] of Object.entries(edition.slots)) {
    const actor = roster.get(id);
    assertCatalogActionEdition(actor, slot, revision.historical);
    assert.throws(() => assertCatalogActionEdition({ ...actor, [slot]: { ...actor[slot], name: 'Changed action' } }, slot, revision.historical));
    assert.throws(() => assertCatalogActionEdition({ ...actor, id: 'unregistered' }, slot, revision.historical));
    assert.throws(() => assertCatalogActionEdition({ ...actor, universe: 'Other' }, slot, revision.historical));
    assert.throws(() => assertCatalogActionEdition({ ...actor, incarnation: 'Other' }, slot, revision.historical));
    assert.throws(() => assertCatalogActionEdition(actor, slot, { ...revision.historical, dmg: -1 }));
  }
});

for (const id of ['ripley', 'liquid_snake']) test(`${id}: current canonical edition rejects incompatible W13 art while the independently frozen older source stays addressable`, () => {
  const current = roster.get(id), row = wave13.heroes.find(entry => entry.hero.id === id);
  const legacy = historicalWave13Actor(current, row.hero, row.source);
  assert.equal(resolveCharacterAnimationAsset(current), null);
  assert.equal(resolveCharacterAnimationAsset({ ...current, id: 'runtime:' + id, sourceHeroId: id }), null);
  assert.equal(supportsNativeSuperWave13(resolveCombatAbility(current, 'special')), false);
  const asset = resolveCharacterAnimationAsset(legacy);
  assert.ok(asset); assert.equal(asset.frames, 32);
  assert.equal(hash(readFileSync(new URL('../public' + asset.sheet, import.meta.url))), asset.sha256);
  assert.equal(supportsNativeSuperWave13(resolveCombatAbility(legacy, 'special')), true);
  assert.notEqual(current.incarnation, legacy.incarnation);
});

// Shared historical base, not proof of cybernetic-leg fidelity or new native art.
test('Maul keeps exact shared master base bytes and separates current Mandalore from the frozen Naboo native-art refusal', () => {
  const current = roster.get('darth_maul'), row = wave13.heroes.find(entry => entry.hero.id === current.id);
  const historical = historicalWave13Actor(current, row.hero, row.source);
  assert.equal(current.incarnation, 'The Clone Wars - ruler of Mandalore');
  assert.equal(current.weaponType, 'double_lightsaber');
  assert.equal(historical.weaponType, 'lightsaber');
  assertCatalogWeaponEdition(current, 'lightsaber');
  assertCatalogWeaponEdition(historical, 'lightsaber');
  assert.throws(() => assertCatalogWeaponEdition({ ...current, weaponType: 'lightsaber' }, 'lightsaber'));
  assert.throws(() => assertCatalogWeaponEdition({ ...current, universe: 'Foreign continuity' }, 'lightsaber'));
  assert.throws(() => assertCatalogWeaponEdition({ ...current, equipment: ['Double-Bladed Red Lightsaber', 'Original Legs', 'Mandalore Command Seal'] }, 'lightsaber'));
  assert.equal(prefersCurrentCanonCombatKit(current), true);
  assert.equal(prefersCurrentCanonCombatKit(historical), false);
  assert.equal(resolveCharacterAnimationAsset(current), null);
  assert.equal(resolveCharacterAnimationAsset(historical), null);
  assert.equal(supportsNativeSuperWave13(resolveCombatAbility(current, 'special')), false);
  assert.equal(supportsNativeSuperWave13(resolveCombatAbility(historical, 'special')), true);
  assert.equal(getHeroSpriteSheetSrc(current, 'rpg'), '/sprites/generated/heroes/star-wars/darth-maul.png');
  assert.equal(hash(readFileSync(new URL('../public/sprites/generated/heroes/star-wars/darth-maul.png', import.meta.url))), '88ad49c11b99a5a5322252092e63029668dce6378be143db7b5d9b4e5b67dccd');
});


test('declared source-compatible native bases retain exact editions and byte-identical master reference PNGs', () => {
  assert.deepEqual(Object.keys(NATIVE_SOURCE_BASE_EDITIONS).sort(), ['freeman', 'han_solo', 'luke', 'ripley_aliens']);
  for (const [id, edition] of Object.entries(NATIVE_SOURCE_BASE_EDITIONS)) {
    const actor = roster.get(id);
    for (const context of ['auto', 'rpg', 'tactics', 'nexus', 'collection', 'hud', 'fps']) {
      assertNativeSourceBaseEdition(actor, getHeroSpriteSheetSrc(actor, context));
      for (const key of ['sourceHeroId', 'sourceId']) {
        const alias = { ...actor, id: 'runtime:' + id, [key]: id };
        assertNativeSourceBaseEdition(alias, getHeroSpriteSheetSrc(alias, context));
        const foreign = { ...alias, universe: 'Foreign source continuity' };
        assert.notEqual(getHeroSpriteSheetSrc(foreign, context), edition.src);
        assert.throws(() => assertNativeSourceBaseEdition(foreign, edition.src));
      }
    }
    assert.throws(() => assertNativeSourceBaseEdition(actor, edition.reference));
    assert.throws(() => assertNativeSourceBaseEdition({ ...actor, incarnation: 'Different source version' }, edition.src));
    assert.throws(() => assertNativeSourceBaseEdition({ ...actor, id: 'unregistered' }, edition.src));
  }
});
