import assert from 'node:assert/strict';
import test from 'node:test';

import { getHeroById } from '../src/game/heroes.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getRpgActionProfile, resolveRpgTargets } from '../src/game/rpgTargeting.js';
import {
  applyCanonP0SourceKit, CANON_P0_SOURCE_KIT_IDS, getCanonP0SourcePlaque
} from '../src/game/canonP0SourceKits.js';

const abilities = ['simple', 'secondary', 'defense', 'special'];
const hero = id => applyCanonP0SourceKit(getHeroById(id));
const snapshots = id => {
  const source = getHeroById(id);
  return {
    id: source.id, name: source.name, universe: source.universe,
    category: source.category, stats: { ...source.stats },
    resources: Object.fromEntries(abilities.map(key => [key,
      Object.fromEntries(Object.entries(source[key]).filter(([, value]) => typeof value === 'number'))
    ])),
    sprite: getHeroSpriteSheetSrc(source)
  };
};
const expectedSnapshots = new Map(CANON_P0_SOURCE_KIT_IDS.map(id => [id, snapshots(id)]));
const kitText = value => JSON.stringify([value.equipment, ...abilities.map(key => value[key])]);

test('all 19 source locks preserve saved identities, stats, balancing numbers and sprite paths', () => {
  assert.equal(CANON_P0_SOURCE_KIT_IDS.length, 19);
  assert.equal(new Set(CANON_P0_SOURCE_KIT_IDS).size, 19);
  for (const id of CANON_P0_SOURCE_KIT_IDS) {
    const corrected = hero(id);
    const expected = expectedSnapshots.get(id);
    for (const key of ['id', 'name', 'universe', 'category', 'stats']) {
      assert.deepEqual(corrected[key], expected[key], `${id}: ${key}`);
    }
    for (const key of abilities) {
      for (const [number, value] of Object.entries(expected.resources[key])) {
        assert.equal(corrected[key][number], value, `${id}: ${key}.${number}`);
      }
    }
    assert.equal(getHeroSpriteSheetSrc(corrected), expected.sprite, id);
    assert.equal(corrected.visualReviewStatus, 'pending', id);
    assert.equal(corrected.canonCombatPresentation, true, id);
    assert.match(corrected.mechanicsReviewStatus, /adaptation|damage|review/i, id);
    assert.ok(corrected.referenceUrls.length > 0, id);
    for (const url of corrected.referenceUrls) assert.equal(new URL(url).protocol, 'https:', id);
  }
});

test('unrelated heroes and absent inputs retain their exact object identity', () => {
  for (const id of ['han_solo', 'luke', 'vader', 'bob_minions', 'ripley', 'freeman']) {
    const original = getHeroById(id);
    assert.ok(original, id);
    assert.equal(applyCanonP0SourceKit(original), original, id);
    assert.equal(getCanonP0SourcePlaque(original), null, id);
  }
  assert.equal(applyCanonP0SourceKit(null), null);
  assert.equal(applyCanonP0SourceKit(undefined), undefined);
  for (const id of ['constructor', 'toString', 'hasOwnProperty']) {
    const unrelated = { id };
    assert.equal(applyCanonP0SourceKit(unrelated), unrelated);
    assert.equal(getCanonP0SourcePlaque(unrelated), null);
  }
});

test('source-kit application is idempotent and does not modify the caller or shared targeting profiles', () => {
  const original = structuredClone(getHeroById('jack_sparrow_potc'));
  const before = structuredClone(original);
  const corrected = applyCanonP0SourceKit(original);
  assert.deepEqual(original, before);
  assert.deepEqual(applyCanonP0SourceKit(corrected), corrected);
  corrected.secondary.attackProfile.delivery = 'changed-in-test';
  corrected.equipment.push('temporary test prop');
  assert.deepEqual(original, before);
  assert.equal(hero('jack_sparrow_potc').secondary.attackProfile.delivery, 'ranged');
  assert.equal(hero('jack_sparrow_potc').equipment.includes('temporary test prop'), false);
});

test('the duckling, human child and toon lose class-derived firearms and explicitly keep comic adaptations', () => {
  for (const id of ['saturnin_duck', 'lilo_pelekai', 'roger_rabbit']) {
    const corrected = hero(id);
    assert.doesNotMatch(kitText(corrected), /laser|rifle|type":"bullet|origin_aoe|nexus_aoe|breach technique/i, id);
    assert.match(corrected.canonStatus, /comic|original.*adaptation/i, id);
    assert.equal(getRpgActionProfile(corrected, 'special').delivery, 'melee', id);
    assert.equal(corrected.special.canonPresentation.kind, 'melee', id);
  }
  assert.equal(hero('lilo_pelekai').weaponType, 'camera');
  assert.equal(hero('lilo_pelekai').simple.canonPresentation.kind, 'cameraFlash');
  assert.equal(getRpgActionProfile(hero('lilo_pelekai'), 'simple').delivery, 'ranged');
  assert.match(hero('roger_rabbit').loreLocalized.en, /vulnerable.*solvent/);
});

test('Stitch uses his separate two-arm Earth disguise and innate physical strength without an origin beam', () => {
  const corrected = hero('stitch_626');
  assert.match(corrected.incarnation, /2002.*Earth.*disguise/);
  assert.equal(corrected.weaponType, 'claws');
  assert.match(corrected.visualAnchor, /two visible arms/);
  for (const key of ['simple', 'secondary', 'special']) {
    assert.equal(getRpgActionProfile(corrected, key).delivery, 'melee', key);
    assert.equal(corrected[key].tacticsProfile.range, 1, key);
    assert.equal(corrected[key].smashProfile.range, 70, key);
  }
});

test('Jack keeps the 2003 sword, flintlock and compass rather than a laser or a sequel boss power', () => {
  const corrected = hero('jack_sparrow_potc');
  assert.match(corrected.incarnation, /Curse of the Black Pearl \(2003\)/);
  assert.deepEqual(corrected.equipment, ['Pirate Sword', 'Flintlock Pistol', 'Jack s Compass']);
  assert.equal(getRpgActionProfile(corrected, 'simple').delivery, 'melee');
  assert.equal(getRpgActionProfile(corrected, 'secondary').delivery, 'ranged');
  assert.equal(corrected.secondary.canonPresentation.kind, 'flintlock');
  assert.doesNotMatch(kitText(corrected), /laser|energy|maelstrom|tentacle|Davy Jones|origin_aoe/i);
  assert.match(corrected.secondary.name, /Reserved Flintlock Pistol Shot/);
  assert.equal(corrected.sourceAmmunition.maxShots, 1);
  assert.deepEqual(corrected.sourceAmmunition.actionIds, ['secondary']);
  assert.equal(corrected.sourceAmmunition.resetPolicy, 'new-battle');
  assert.match(corrected.loreLocalized.en, /Will returns the final coins with offerings from his lineage and Jack/);
  assert.match(corrected.loreLocalized.en, /without an attack or automatic enemy tracking/);
  assert.match(corrected.loreLocalized.en, /one shot per battle/);
});

test('ordinary Batman kits use martial attacks and Batarangs while the Grim Knight retains source firearms', () => {
  for (const id of ['batman_tdk', 'batman_n52']) {
    const corrected = hero(id);
    assert.equal(corrected.weaponType, 'fists', id);
    assert.equal(corrected.simple.type, 'melee', id);
    assert.equal(corrected.secondary.type, 'projectile', id);
    assert.equal(corrected.secondary.canonPresentation.kind, 'batarang', id);
    assert.doesNotMatch(kitText(corrected), /type":"bullet|Origin Burst|nexus_aoe/i, id);
  }
  assert.match(hero('batman_tdk').incarnation, /The Dark Knight \(2008\)/);
  assert.match(hero('batman_n52').incarnation, /Endgame.*#35-40/);
  const grim = hero('grim_knight');
  assert.equal(grim.weaponType, 'gun');
  assert.equal(grim.simple.canonPresentation.kind, 'bullet');
  assert.equal(grim.special.type, 'bullet');
  assert.match(grim.incarnation, /Grim Knight #1 \(2019\)/);
});

test('Joker Endgame excludes the detached-face gear and Harley keeps her distinct 2011 roster adaptation', () => {
  const joker = hero('joker_n52');
  assert.match(joker.incarnation, /Endgame.*#35-40/);
  assert.doesNotMatch(joker.equipment.join(' '), /stapled|detached.*face/i);
  assert.equal(joker.secondary.canonPresentation.kind, 'toxin');
  assert.match(joker.mechanicsReviewStatus, /infection.*not simulated/);
  const harley = hero('harley_n52');
  assert.match(harley.incarnation, /Suicide Squad.*#1.*2011/);
  assert.equal(harley.weaponType, 'hammer');
  assert.match(harley.loreLocalized.en, /not evidence.*Endgame/);
});

test('the original 2003 Titans keep mystical Raven, green ranged starbolts and a separate melee kick', () => {
  const raven = hero('raven_tt');
  const starfire = hero('starfire_tt');
  for (const corrected of [raven, starfire]) assert.match(corrected.incarnation, /2003-2006 animated/);
  assert.equal(raven.weaponType, 'magic');
  assert.equal(raven.simple.type, 'gravity');
  assert.equal(raven.simple.canonPresentation.kind, 'shadow');
  assert.equal(starfire.simple.type, 'energy');
  assert.equal(starfire.simple.color, '#63ef72');
  assert.equal(starfire.simple.canonPresentation.kind, 'starbolt');
  assert.equal(getRpgActionProfile(starfire, 'simple').delivery, 'ranged');
  assert.equal(getRpgActionProfile(starfire, 'secondary').delivery, 'melee');
  assert.equal(starfire.simple.tacticsProfile.range, 4);
  assert.equal(starfire.secondary.tacticsProfile.range, 1);
});

test('Harry and Hermione share their fifth-year source and ranged spells without a time explosion or offensive Patronus', () => {
  const harry = hero('harry');
  const hermione = hero('hermione');
  assert.equal(harry.incarnation, hermione.incarnation);
  assert.match(harry.incarnation, /Order of the Phoenix \(2007 film\).*fifth-year/);
  assert.equal(harry.equipment[0], 'Holly Wand with Phoenix-Feather Core');
  assert.equal(hermione.equipment[0], 'Vine Wand with Dragon-Heartstring Core');
  for (const corrected of [harry, hermione]) {
    assert.equal(corrected.defense.name, 'Protego');
    for (const key of ['simple', 'secondary', 'special']) {
      const profile = getRpgActionProfile(corrected, key);
      assert.equal(profile.delivery, 'ranged', `${corrected.id}: ${key}`);
      assert.equal(profile.shape, 'single', `${corrected.id}: ${key}`);
      assert.equal(corrected[key].canonPresentation.kind, 'spell');
    }
    assert.doesNotMatch(kitText(corrected), /Time-Turner|Protego Maxima|nexus_aoe|magic_aoe|Expecto Patronum/i);
    assert.match(corrected.mechanicsReviewStatus, /disarm.*stun/i);
  }
  assert.ok(harry.sourceAbilities.includes('Expecto Patronum - Stag'));
});

test('Spider attachment slots remain adaptations of the same Kelly with distinct slasher, flame and electrical actions', () => {
  const kits = [
    ['cyber_spider_kelly', 'blade', 'melee', 'melee'],
    ['cyber_spider_flamethrower', 'flamethrower', 'fire', 'flame'],
    ['cyber_spider_electro_beam', 'electro_beam', 'beam', 'electricBeam']
  ];
  for (const [id, weaponType, actionType, presentation] of kits) {
    const corrected = hero(id);
    assert.match(corrected.incarnation, /1997.*Michael Kelly/);
    assert.equal(corrected.sourceIdentityType, 'source-protagonist-loadout-adaptation');
    assert.equal(corrected.weaponType, weaponType);
    assert.equal(corrected.simple.type, actionType);
    assert.equal(corrected.simple.canonPresentation.kind, presentation);
    assert.match(corrected.canonStatus, /not three official characters/);
    assert.match(corrected.equipmentEvidenceStatus, /original.*gameplay review/);
  }
});

test('the two musical personas remain explicit project originals without false Michael Jackson certification', () => {
  for (const id of ['mj_performer', 'rhythm_guard_mj']) {
    const corrected = hero(id);
    assert.equal(corrected.isOfficialCharacter, false, id);
    assert.equal(corrected.sourceIdentityType, 'project-original-adaptation', id);
    assert.match(corrected.incarnation, /Multiverse Breach original/, id);
    assert.match(corrected.loreLocalized.en, /original/, id);
    assert.doesNotMatch(kitText(corrected), /type":"bullet|weapon":"gun|origin_aoe/i, id);
  }
  assert.equal(hero('mj_performer').name, 'King of Pop Avatar');
  assert.equal(hero('rhythm_guard_mj').secondary.canonPresentation.kind, 'music');
});

test('every damaging action uses the selected single opponent instead of a generic Nexus area explosion', () => {
  for (const id of CANON_P0_SOURCE_KIT_IDS) {
    const corrected = hero(id);
    for (const key of ['simple', 'secondary', 'special']) {
      const profile = getRpgActionProfile(corrected, key);
      const chosen = { id: 'chosen', x: 100, y: 0, currentHp: 100 };
      const neighbor = { id: 'neighbor', x: 105, y: 0, currentHp: 100 };
      const result = resolveRpgTargets({ actor: { id: 'caster', x: 0, y: 0 }, profile,
        eligibleTargets: [chosen, neighbor], selectedTargetIds: ['chosen'] });
      assert.equal(result.valid, true, `${id}: ${key}`);
      assert.deepEqual(result.targets.map(target => target.id), ['chosen'], `${id}: ${key}`);
      assert.equal(corrected[key].smashProfile.shape, 'single', `${id}: ${key}`);
      assert.equal(corrected[key].smashProfile.maxTargets, 1, `${id}: ${key}`);
    }
  }
});

test('source plaques carry the exact selected incarnation and describe adaptation without approving visuals', () => {
  for (const id of CANON_P0_SOURCE_KIT_IDS) {
    const corrected = hero(id);
    const plaque = getCanonP0SourcePlaque(corrected);
    assert.equal(plaque.origin.en, corrected.incarnation, id);
    assert.deepEqual(plaque.dossier, corrected.loreLocalized, id);
    assert.match(plaque.doctrine.en, /game adaptation.*visual review remains pending/, id);
  }
});
