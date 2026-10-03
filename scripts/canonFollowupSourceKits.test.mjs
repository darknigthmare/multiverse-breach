import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { HEROES_DB, getHeroById } from '../src/game/heroes.js';
import { CANON_P0_SOURCE_KIT_IDS } from '../src/game/canonP0SourceKits.js';
import {
  applyCanonFollowupSourceKit, CANON_FOLLOWUP_SOURCE_KITS, CANON_FOLLOWUP_SOURCE_KIT_IDS
} from '../src/game/canonFollowupSourceKits.js';
import {
  emitCanonHeroAttackEffect, resolveCanonHeroAttackEffect
} from '../src/game/canonHeroAttackEffects.js';
import { getRpgActionProfile, resolveRpgTargets } from '../src/game/rpgTargeting.js';
import { getSmashAbilityProfile, getSmashAbilityTargets } from '../src/game/smashAbilityProfiles.js';

const IDS = ['liquid_snake', 'mistral_mgr', 'true_ogre_tekken'];
const OFFENSES = ['simple', 'secondary', 'special'];
const ACTIONS = ['simple', 'secondary', 'defense', 'special'];
const HISTORICAL = {
  liquid_snake: { universe: 'Metal Gear', category: 'slayer', stats: { hp: 105, atk: 14, def: 5, spd: 6 } },
  mistral_mgr: { universe: 'Metal Gear Rising', category: 'horror', stats: { hp: 115, atk: 11, def: 7, spd: 5 } },
  true_ogre_tekken: { universe: 'Tekken', category: 'horror', stats: { hp: 115, atk: 11, def: 7, spd: 5 } }
};
const HISTORICAL_RESOURCES = {
  simple: { dmg: 1 }, secondary: { cd: 8, dmg: 2.2 },
  defense: { dur: 2, reduce: 0.75 }, special: { dmg: 4.5 }
};
const balance = actor => Object.fromEntries(ACTIONS.map(key => [key,
  Object.fromEntries(Object.entries(actor[key]).filter(([, value]) => typeof value === 'number'))
]));
const offensiveText = actor => JSON.stringify([
  actor.weapon, actor.weaponType, actor.equipment, ...OFFENSES.map(key => actor[key]), actor.defense.name
]);

test('the follow-up fixes exactly three identities without expanding the frozen 19 P0 locks', () => {
  assert.deepEqual(CANON_FOLLOWUP_SOURCE_KIT_IDS, IDS);
  assert.equal(CANON_P0_SOURCE_KIT_IDS.length, 19);
  for (const id of IDS) assert.equal(CANON_P0_SOURCE_KIT_IDS.includes(id), false);
});

for (const id of IDS) test(`${id} preserves historical saved identity, category, stats and every action resource`, () => {
  const actor = getHeroById(id);
  const expected = HISTORICAL[id];
  assert.equal(HEROES_DB.filter(hero => hero.id === id).length, 1);
  assert.equal(actor.id, id);
  assert.equal(actor.universe, expected.universe);
  assert.equal(actor.category, expected.category);
  assert.deepEqual(actor.stats, expected.stats);
  assert.deepEqual(balance(actor), HISTORICAL_RESOURCES);
  const fixture = {
    ...actor, category: 'tactical', stats: { hp: 177, atk: 13, def: 8, spd: 2 },
    simple: { type: 'bullet', dmg: 0.35, mana: 7 },
    secondary: { type: 'signature', dmg: 8.25, cd: 11, energy: 43 },
    defense: { type: 'shield', dur: 3.25, reduce: 0.12 },
    special: { type: 'origin_aoe', dmg: 9.75, cost: 51 }
  };
  const corrected = applyCanonFollowupSourceKit(fixture);
  assert.equal(corrected.category, fixture.category);
  assert.deepEqual(corrected.stats, fixture.stats);
  assert.deepEqual(balance(corrected), balance(fixture));
});

test('actual database heroes receive physical actions and updated flat labels after legacy class loadouts', () => {
  for (const id of IDS) {
    const actor = getHeroById(id);
    const source = CANON_FOLLOWUP_SOURCE_KITS[id];
    assert.equal(actor.incarnation, source.incarnation);
    assert.equal(actor.canonCombatPresentation, true);
    for (const key of ACTIONS) assert.equal(actor[`${key}Name`], actor[key].name);
    for (const key of OFFENSES) {
      assert.equal(actor[key].type, 'melee', `${id} ${key}`);
      assert.equal(actor[key].canonPresentation.kind, 'melee', `${id} ${key}`);
      assert.equal(actor[key].tacticsProfile.range, 1, `${id} ${key}`);
    }
    assert.doesNotMatch(offensiveText(actor), /Origin Burst|Breach Technique|origin_aoe|nexus_aoe|Magnetic Guard|type":"bullet|type":"beam/i, id);
  }
});

test('application is idempotent and never mutates callers or shared metadata and targeting profiles', () => {
  for (const id of IDS) {
    const caller = structuredClone(getHeroById(id));
    const before = structuredClone(caller);
    const corrected = applyCanonFollowupSourceKit(caller);
    assert.deepEqual(applyCanonFollowupSourceKit(corrected), corrected, id);
    corrected.simple.attackProfile.delivery = 'temporary-test-value';
    corrected.secondary.tacticsProfile.range = 99;
    corrected.special.smashProfile.range = 999;
    corrected.special.canonPresentation.kind = 'temporary-test-value';
    corrected.referenceUrls.push('https://example.com/test-only');
    corrected.equipment.push('test-only prop');
    corrected.sourceAbilities.push('test-only ability');
    corrected.loreLocalized.en = 'test-only lore';
    assert.deepEqual(caller, before, id);
    assert.deepEqual(applyCanonFollowupSourceKit(caller), before, id);
  }
});

test('unrelated, absent, prototype-named and wrong-universe inputs retain exact identity', () => {
  for (const input of [null, undefined, {}, ...['constructor', 'toString', 'hasOwnProperty'].map(id => ({ id }))]) {
    assert.equal(applyCanonFollowupSourceKit(input), input);
  }
  for (const id of ['masterchief', 'jack_sparrow_potc', 'monsoon_mgr', 'raiden_mgr']) {
    const input = getHeroById(id);
    if (input) assert.equal(applyCanonFollowupSourceKit(input), input, id);
  }
  for (const id of IDS) {
    const input = { ...getHeroById(id), universe: 'Unrelated test universe' };
    assert.equal(applyCanonFollowupSourceKit(input), input, id);
  }
});

test('candidate URLs and description-based kits never certify artwork, source review or 1:1 fidelity', () => {
  for (const id of IDS) {
    const actor = getHeroById(id);
    assert.equal(actor.canonicalFidelityApproved, false, id);
    assert.equal(actor.visualReviewStatus, 'pending', id);
    assert.match(actor.sourceReviewStatus, /description-based.*pending/, id);
    assert.match(actor.referenceReviewStatus, /candidate.*not read.*reviewed/, id);
    assert.match(actor.canonStatus, /adaptations.*not a 1:1 fidelity approval/, id);
    assert.match(actor.mechanicsReviewStatus, /adapted.*pending/, id);
    assert.ok(actor.loreLocalized.fr.length > 100, id);
    assert.ok(actor.loreLocalized.en.length > 100, id);
    assert.equal(actor.referenceUrl, actor.referenceUrls[0], id);
    for (const url of actor.referenceUrls) assert.equal(new URL(url).protocol, 'https:');
  }
});

test('Liquid selects the 1998 REX-top bare-handed duel without class firearms or Hind D support', () => {
  const actor = getHeroById('liquid_snake');
  assert.match(actor.incarnation, /1998.*final bare-handed duel on REX/);
  assert.equal(actor.weaponType, 'fists');
  assert.deepEqual(actor.equipment, ['Bare Fists', 'Bare-Chested Final-Duel Outfit']);
  assert.match(actor.secondary.name, /Kick/);
  assert.match(actor.visualAnchor, /long blond hair.*bare muscular torso/);
  assert.doesNotMatch(offensiveText(actor), /rifle|gun|Hind|coat|sunglasses|beam|laser/i);
});

test('Mistral has L’Étranger and articulated Dwarf Gekko limbs without Monsoon mechanics or possession', () => {
  const actor = getHeroById('mistral_mgr');
  assert.match(actor.incarnation, /Revengeance \(2013\)/);
  assert.equal(actor.weaponType, 'polearm');
  assert.ok(actor.equipment.every(name => /Dwarf Gekko/.test(name)));
  assert.match(actor.secondary.name, /Articulated Dwarf Gekko Arm/);
  assert.match(actor.defense.name, /L’Étranger Polearm Guard/);
  assert.doesNotMatch(offensiveText(actor), /magnetic|possession|Monsoon|Nexus|beam|laser/i);
});

test('True Ogre selects the Tekken 3 beast with a claw and serpent arm without invented equipment or mythology', () => {
  const actor = getHeroById('true_ogre_tekken');
  assert.match(actor.incarnation, /Tekken 3.*1997.*1998.*beast/);
  assert.equal(actor.weaponType, 'claws');
  assert.deepEqual(actor.equipment, ['Bestial Claw', 'Serpent Arm', 'Horned Winged Beast Anatomy']);
  assert.match(actor.secondary.name, /Serpent-Arm/);
  assert.match(actor.visualAnchor, /asymmetric clawed limb.*distinct serpent arm/);
  assert.doesNotMatch(offensiveText(actor), /sword|gun|staff|laser|Nexus|divine|aztec|crown/i);
});

test('shared RPG targeting and Smash hit resolution keep all follow-up attacks physical and single-target', () => {
  for (const id of IDS) for (const key of OFFENSES) {
    const actor = { ...getHeroById(id), x: 100, y: 300, facing: 1 };
    const targets = [
      { id: 'near-first', x: 140, y: 300, currentHp: 100 },
      { id: 'near-second', x: 160, y: 300, currentHp: 100 },
      { id: 'rear', x: 80, y: 300, currentHp: 100 },
      { id: 'distant', x: 450, y: 300, currentHp: 100 }
    ];
    const rpg = getRpgActionProfile(actor, key);
    assert.equal(rpg.delivery, 'melee', `${id} ${key}`);
    assert.equal(rpg.shape, 'single', `${id} ${key}`);
    assert.deepEqual(resolveRpgTargets({ actor, profile: rpg, eligibleTargets: targets, selectedTargetIds: ['near-second'] }).targets,
      [targets[1]], `${id} ${key}`);
    const smash = getSmashAbilityProfile(actor, key);
    assert.equal(smash.delivery, 'melee', `${id} ${key}`);
    assert.equal(smash.range, 70, `${id} ${key}`);
    assert.equal(smash.maxTargets, 1, `${id} ${key}`);
    assert.deepEqual(getSmashAbilityTargets(actor, targets, smash), [targets[0]], `${id} ${key}`);
  }
});

test('follow-up effects require the opted-in incarnation and physical action, including P2 and CPU clones', () => {
  for (const id of IDS) {
    const actor = getHeroById(id);
    for (const clone of [actor,
      { ...actor, id: `p2:${id}:0`, sourceId: id },
      { ...actor, id: `cpu-custom:${id}:1`, sourceId: id },
      { ...actor, id: `p2:${id}:0`, sourceId: null },
      { ...actor, id: `cpu-custom:${id}:1`, sourceId: null }
    ]) {
      for (const key of OFFENSES) assert.deepEqual(resolveCanonHeroAttackEffect(clone, key), {
        kind: 'melee', color: actor.weaponColor, sfx: 'hit'
      }, `${id} ${key}`);
    }
    for (const invalid of [
      { ...actor, canonCombatPresentation: false },
      { ...actor, incarnation: 'Unreviewed different incarnation' },
      { ...actor, universe: 'Unrelated test universe' },
      { ...actor, id: 'unrelated-legacy', sourceId: null }
    ]) assert.equal(resolveCanonHeroAttackEffect(invalid, 'simple'), null, id);
    assert.equal(resolveCanonHeroAttackEffect(actor, 'defense'), null, id);
    assert.equal(resolveCanonHeroAttackEffect(actor, { ...actor.simple, type: 'projectile' }), null, id);
    assert.equal(resolveCanonHeroAttackEffect(actor, { ...actor.simple, canonPresentation: { kind: 'bullet' } }), null, id);
  }
});

test('follow-up contact emits one physical impact cue without a projectile or group flash', () => {
  for (const id of IDS) for (const key of OFFENSES) {
    const actor = { ...getHeroById(id), x: 100, y: 300, facing: 1 };
    const calls = [];
    assert.equal(emitCanonHeroAttackEffect({ add: (...args) => calls.push(args) }, actor, { x: 140, y: 300 }, key), true);
    assert.equal(calls.length, 1, `${id} ${key}`);
    assert.equal(calls[0][7], 'spark', `${id} ${key}`);
    assert.equal(calls[0][4], actor.weaponColor, `${id} ${key}`);
  }
});

const engines = [];
let vite;
let EngineRpg;
let EngineTactics;
let EngineSmash;
const threats = Array.from({ length: 3 }, (_, index) => ({
  id: `followup-target-${index}`, name: `Target ${index}`, hp: 10000,
  atk: 1, def: 0, spd: 1, weapon: 'melee', color: '#808080'
}));
before(async () => {
  // SSR module loading needs neither a network listener nor a watched dev server.
  vite = await createServer({ appType: 'custom', logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null } });
  [{ EngineRpg }, { EngineTactics }, { EngineSmash }] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineRpg.js?followup-source-kit-runtime'),
    vite.ssrLoadModule('/src/game/engineTactics.js?followup-source-kit-runtime'),
    vite.ssrLoadModule('/src/game/engineSmash.js?followup-source-kit-runtime')
  ]);
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });

const makeEngine = (mode, id) => {
  const calls = [];
  const sounds = [];
  const Engine = { RPG: EngineRpg, Tactics: EngineTactics, Smash: EngineSmash }[mode];
  const engine = new Engine(760, 420, [getHeroById(id)], { monsters: threats, bosses: [], customRoster: threats },
    { add: (...args) => calls.push(args) }, cue => sounds.push(cue), () => {}, {
      universe: 'Nexus de Convergence', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  engines.push(engine);
  engine.calls = calls;
  engine.sounds = sounds;
  const actor = engine.heroes[0];
  Object.assign(actor, { state: 'idle', atb: 100, specialCharge: 100, cooldown: 0 });
  if (mode === 'RPG') engine.enemyGlobalRecovery = 9999;
  else if (mode === 'Tactics') {
    Object.assign(engine, { cols: 10, rows: 8, tiles: [], obstacles: [], escortUnit: null,
      protectedArtifact: null, objective: 'rout', activeUnit: actor, activeUnitType: 'hero',
      actionPhase: 'action', selectedAction: null });
    Object.assign(actor, { gridX: 2, gridY: 2 });
    engine.enemies.forEach((unit, index) => Object.assign(unit, { gridX: [3, 5, 8][index], gridY: 2 }));
  } else {
    engine.syncPreMatchFromServer(3000);
    Object.assign(actor, { x: 100, y: 300, facing: 1, state: 'idle' });
    engine.enemies.forEach((unit, index) => Object.assign(unit,
      { x: [140, 160, 450][index], y: 300, currentHp: 10000, maxHp: 10000, state: 'idle' }));
  }
  calls.length = 0;
  sounds.length = 0;
  return engine;
};

for (const id of IDS) for (const key of OFFENSES) for (const mode of ['RPG', 'Tactics', 'Smash']) {
  test(`${mode} ${id} ${key} damages one valid victim with physical feedback and no generic shot or glitch`, () => {
    const engine = makeEngine(mode, id);
    const actor = engine.heroes[0];
    const previousHp = engine.enemies.map(unit => unit.currentHp);
    let victimIndex = 0;
    if (mode === 'RPG') {
      victimIndex = 2;
      assert.equal(engine.triggerAbility(actor, key, [engine.enemies[victimIndex].battleId]), true);
      assert.deepEqual(engine.enemies.map(unit => unit.currentHp), previousHp, 'impact must wait for simulation');
      for (let tick = 0; tick < 18; tick++) engine.update();
    } else if (mode === 'Tactics') {
      const profile = engine.getAttackProfile(actor, key);
      assert.equal(profile.delivery, 'melee');
      assert.equal(profile.range, 1);
      assert.equal(profile.maxTargets, 1);
      assert.equal(engine.selectAction(key), true);
      const beforeCosts = { cooldown: actor.cooldown, charge: actor.specialCharge, atb: actor.atb };
      assert.equal(engine.handleCellClick(5, 2).handled, false);
      assert.deepEqual({ cooldown: actor.cooldown, charge: actor.specialCharge, atb: actor.atb }, beforeCosts,
        'invalid distant contact must not consume resources');
      assert.equal(engine.handleCellClick(3, 2).handled, true);
    } else assert.equal(engine.triggerAbility(actor, key), true);
    engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < previousHp[index], index === victimIndex,
      `${mode} ${id} ${key}: incorrect damage identity ${index}`));
    assert.ok(engine.calls.some(call => call[7] === 'spark' && call[4] === actor.weaponColor), 'missing declared physical cue');
    assert.ok(engine.sounds.includes('hit'), 'missing physical contact sound');
    assert.equal(engine.sounds.includes('shoot'), false);
    assert.equal(engine.calls.some(call => ['glitch', 'laser_line', 'bullet', 'electric_beam'].includes(call[7])), false);
  });
}
