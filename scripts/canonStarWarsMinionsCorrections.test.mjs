import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

import { HEROES_DB, getHeroById } from '../src/game/heroes.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getRpgActionProfile, resolveRpgTargets } from '../src/game/rpgTargeting.js';

const kit = hero => JSON.stringify([
  hero.equipment, hero.simple, hero.secondary, hero.defense, hero.special
]);
const selectedEnemies = profile => resolveRpgTargets({
  actor: { id: 'actor', x: 10, y: 10 },
  profile,
  eligibleTargets: [
    { id: 'chosen', x: 100, y: 10, currentHp: 100 },
    { id: 'neighbor', x: 105, y: 10, currentHp: 100 }
  ],
  selectedTargetIds: ['chosen']
}).targets.map(enemy => enemy.id);

test('Luke keeps the Return of the Jedi green saber and his special reaches one opponent through melee', () => {
  const luke = getHeroById('luke');
  assert.match(luke.incarnation, /Return of the Jedi \(1983\)/);
  assert.equal(luke.weaponType, 'lightsaber');
  assert.equal(luke.weaponColor, '#00ff00');
  assert.doesNotMatch(kit(luke), /mind strike|beam|lightning|blue saber/i);
  const profile = getRpgActionProfile(luke, 'special');
  assert.equal(profile.delivery, 'melee');
  assert.equal(profile.shape, 'single');
  assert.deepEqual(selectedEnemies(profile), ['chosen']);
});

test('Vader keeps a red Sith blade and Force choke targets one enemy rather than a musical area explosion', () => {
  const vader = getHeroById('vader');
  assert.match(vader.incarnation, /Empire Strikes Back \(1980\)/);
  assert.equal(vader.weaponType, 'lightsaber');
  assert.equal(vader.weaponColor, '#ff3030');
  assert.doesNotMatch(kit(vader), /imperial march|lightning|nexus_aoe|blue blade/i);
  const profile = getRpgActionProfile(vader, 'special');
  assert.equal(profile.delivery, 'ranged');
  assert.equal(profile.shape, 'single');
  assert.equal(profile.effect, 'damage');
  assert.deepEqual(selectedEnemies(profile), ['chosen']);
});

test('Han uses his DL-44 and an evasion defense without carbonite protection or a Kessel-run explosion', () => {
  const han = getHeroById('han_solo');
  assert.match(han.incarnation, /A New Hope \(1977\)/);
  assert.equal(han.defense.type, 'dodge');
  assert.doesNotMatch(kit(han), /carbonite|kessel|nexus_aoe|lightsaber|force/i);
  for (const ability of ['simple', 'secondary', 'special']) {
    const profile = getRpgActionProfile(han, ability);
    assert.equal(profile.delivery, 'ranged');
    assert.match(profile.name, /DL-44/);
  }
  const volley = getRpgActionProfile(han, 'special');
  assert.equal(volley.shape, 'multi');
  assert.equal(volley.maxTargets, 3);
});

test('Bob and Kevin basic attacks use melee instead of class-generated lasers and guns', () => {
  for (const id of ['bob_minions', 'kevin_minions']) {
    const hero = getHeroById(id);
    assert.equal(hero.weaponType, 'fists', id);
    assert.equal(hero.weapon, hero.weaponType, `${id}: legacy weapon alias`);
    assert.equal(getRpgActionProfile(hero, 'simple').delivery, 'melee', id);
    assert.doesNotMatch(kit(hero), /energy|laser|gun|origin burst|breach technique/i, id);
    assert.match(hero.incarnation, /Minions \(2015\)/);
  }
});

test('Stuart uses the documented red guitar while his sound damage remains an explicit game adaptation', () => {
  const stuart = getHeroById('stuart_minions');
  assert.equal(stuart.weaponType, 'guitar');
  assert.equal(stuart.weapon, 'guitar');
  assert.match(kit(stuart), /Red Electric Guitar/);
  assert.doesNotMatch(kit(stuart), /blade|sword|origin burst|breach technique/i);
  assert.equal(getRpgActionProfile(stuart, 'simple').delivery, 'melee');
  assert.match(stuart.canonStatus, /game adaptation/);
});

test('the six corrected identities preserve saved IDs, stats, categories and existing sprite paths', () => {
  const expected = [
    ['han_solo', 'tactical', [120, 11, 7, 4], '/sprites/generated/heroes/star-wars/han-solo.png'],
    ['luke', 'slayer', [140, 18, 9, 7], '/sprites/generated/heroes/star-wars/luke.png'],
    ['vader', 'slayer', [105, 14, 5, 6], '/sprites/generated/heroes/star-wars/vader.png'],
    ['bob_minions', 'hacker', [100, 12, 6, 6], '/sprites/generated/heroes/minions/bob-minions.png'],
    ['kevin_minions', 'tactical', [120, 11, 7, 4], '/sprites/generated/heroes/minions/kevin-minions.png'],
    ['stuart_minions', 'slayer', [105, 14, 5, 6], '/sprites/generated/heroes/minions/stuart-minions.png']
  ];
  for (const [id, category, stats, sprite] of expected) {
    assert.equal(HEROES_DB.filter(hero => hero.id === id).length, 1, id);
    const hero = getHeroById(id);
    assert.equal(hero.category, category, id);
    assert.deepEqual(['hp', 'atk', 'def', 'spd'].map(key => hero.stats[key]), stats, id);
    assert.equal(getHeroSpriteSheetSrc(hero), sprite, id);
    assert.equal(hero.visualReviewStatus, 'pending', id);
  }
});

test('the playable character plaques use the same incarnations and label musical/comic combat as an adaptation', async () => {
  const vite = await createServer({
    appType: 'custom', logLevel: 'silent', server: { middlewareMode: true }
  });
  try {
    const { getCharacterPlaque } = await vite.ssrLoadModule('/src/game/characterPlaques.js?star-wars-minions-tests');
    assert.match(getCharacterPlaque(getHeroById('han_solo')).origin.en, /A New Hope \(1977\)/);
    assert.match(getCharacterPlaque(getHeroById('luke')).origin.en, /Return of the Jedi \(1983\)/);
    assert.match(getCharacterPlaque(getHeroById('vader')).origin.en, /Empire Strikes Back \(1980\)/);
    for (const id of ['bob_minions', 'kevin_minions', 'stuart_minions']) {
      const plaque = getCharacterPlaque(getHeroById(id));
      assert.match(plaque.origin.en, /Minions \(2015\)/, id);
      assert.match(plaque.dossier.en, /game adaptation|adapt.*game/, id);
    }
  } finally {
    await vite.close();
  }
});
