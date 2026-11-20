import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { getRpgActionProfile, getRpgCombatantAbility } from '../src/game/rpgTargeting.js';
import { getOriginalCampaignEnemySecondary } from '../src/game/originalCampaignEnemyActions.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData } from '../src/game/customBattle.js';
import { getCombatHealingAmount } from '../src/game/combatHealing.js';

const universes = [
  'The Aether Crown', 'Meridian Clockwork', 'Iron Tempest', 'Helios 56',
  'Kemet: The Devoured Sun', 'Imperium Aeternum', 'The Crownless Sea', 'The Drowned Testament',
  'Aegea: War of the Moirai', 'Nine Realms: Last Twilight', 'Tawantinsuyu: The Split Sun',
  'Yomi no Kage', 'Mandate of Nine Heavens', 'Mythos Primordia',
  'Aetherion: Seven Laws of Magic', 'Infernum: Nine Pits'
];
const roster = universes.flatMap(universe => ENEMIES_DB[universe].monsters);
const continuationUniverses = [
  'Neon Requiem', 'Ilyr Concordat', 'Valedor: The Shattered Crown', 'Aevum Fracture',
  'Thalassa Mnémique', 'Méridien Creux', 'Viridienne Ultime', 'Nexus de Convergence'
];
const continuationRoster = continuationUniverses.flatMap(universe => ENEMIES_DB[universe].monsters
  .filter(actor => universe !== 'Nexus de Convergence' || actor.actId || actor.name === 'Matrice de Substitution')
  .map(actor => ({ ...actor, universe })));
const catalog = buildCustomEnemyCatalog();
const noop = () => {};
const place = (actor, x, y) => Object.assign(actor, { x, y, homeX: x, homeY: y });
const ticks = (engine, total) => { for (let tick = 0; tick < total; tick++) engine.update(); };

function makeBattle(actor, opponentControl = 'p2', campaign = false) {
  const universe = actor.universe;
  const heroes = HEROES_DB.filter(hero => hero.universe === universe);
  const originalEnemies = ENEMIES_DB[universe];
  const allies = originalEnemies.monsters.filter(enemy => enemy.name !== actor.name).slice(0, 2);
  const data = campaign ? originalEnemies : buildCustomEnemyData([actor, ...allies].map(enemy =>
    catalog.find(entry => entry.universe === universe && entry.kind === 'monster' && entry.name === enemy.name).id), catalog);
  const engine = new EngineRpg(1040, 520, heroes, data, { add: noop }, noop, noop, {
    universe, mode: 'RPG', disableHazards: true,
    ...(!campaign ? { customBattle: { singleRoster: true, opponentControl } } : {})
  });
  const [source, nearAlly, farAlly] = engine.enemies;
  const [first, second, distant] = engine.heroes;
  place(source, 660, 300);
  place(nearAlly, 735, 345);
  place(farAlly, 970, 330);
  place(first, 550, 300);
  place(second, 575, 320);
  place(distant, 320, 510);
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.atb = 0; });
  engine.enemyGlobalRecovery = 0;
  source.atb = 100;
  return engine;
}

test('sixteen original worlds contribute eighty different regular actors and eighty named commands', () => {
  assert.equal(roster.length, 80);
  assert.equal(new Set(roster.map(actor => actor.id)).size, 80);
  const names = new Set();
  for (const actor of roster) {
    const action = getRpgCombatantAbility(actor, 'secondary');
    assert.ok(action, actor.id);
    names.add(action.name);
    assert.equal(action.cd, 3);
    const unauthored = { ...actor, signature: null };
    for (const slot of ['simple', 'special', 'defense', 'summon']) {
      assert.deepEqual(getRpgActionProfile(actor, slot, 'enemy'), getRpgActionProfile(unauthored, slot, 'enemy'));
    }
  }
  assert.equal(names.size, 80);
});

test('twenty remaining campaign monsters, nine DLC threats and eleven Nexus threats add forty exact secondaries', () => {
  assert.deepEqual(continuationUniverses.map(universe => continuationRoster.filter(actor => actor.universe === universe).length),
    [5, 5, 5, 5, 3, 3, 3, 11]);
  const allReviewed = [...roster, ...continuationRoster];
  assert.equal(new Set(allReviewed.map(actor => JSON.stringify([actor.universe, actor.id ?? actor.name]))).size, 120);
  const registered = Object.entries(ENEMIES_DB).flatMap(([universe, actors]) => actors.monsters
    .map(actor => ({ ...actor, universe })).filter(getOriginalCampaignEnemySecondary));
  assert.equal(registered.length, 120);
  assert.equal(new Set(allReviewed.map(actor => getOriginalCampaignEnemySecondary(actor).name)).size, 120);
});

for (const actor of [...roster, ...continuationRoster]) test(`the live P2 command prepares, previews and resolves the secondary of ${actor.name}`, () => {
  const engine = makeBattle(actor);
  try {
    const [source, nearAlly, farAlly] = engine.enemies;
    const [first, second] = engine.heroes;
    [source, nearAlly, farAlly].forEach(unit => { unit.currentHp = Math.max(1, unit.currentHp - 60); });
    const initialHeroes = engine.heroes.map(unit => unit.currentHp);
    const initialEnemies = engine.enemies.map(unit => unit.currentHp);
    const profile = engine.getActionContext(source, 'secondary', 'enemy').profile;

    assert.equal(engine.beginTargeting(source, 'secondary', 'enemy'), true);
    if (profile.effect === 'damage') assert.equal(engine.selectTarget(first.battleId), true);
    const preview = engine.getTargetingState();
    assert.equal(preview.abilityName, getRpgCombatantAbility(actor, 'secondary').name);
    let expected;
    if (profile.effect === 'damage') expected = profile.shape === 'single' ? [first] : [first, second];
    else if (profile.targetSide === 'self') expected = [source];
    else expected = profile.excludeSelf ? [nearAlly] : [source, nearAlly];
    assert.equal(preview.previewTargetIds.length, expected.length);
    assert.deepEqual(new Set(preview.previewTargetIds), new Set(expected.map(unit => unit.battleId)));
    assert.equal(preview.valid, true);
    if (profile.effect === 'damage' && profile.multiplier === 0) {
      assert.equal(profile.action.statusEffect, 'glitched');
      assert.ok(preview.estimates.every(estimate => estimate.amount === 0 && estimate.min === 0 && estimate.max === 0));
    }
    assert.equal(source.atb, 100);
    assert.equal(source.cooldown, 0);
    assert.equal(source.specialCharge, 0);
    assert.equal(engine.confirmTargeting(), true);
    assert.equal(engine.confirmTargeting(), false);
    assert.equal(source.atb, 0);
    assert.equal(source.cooldown, 180);
    assert.equal(source.specialCharge, 20);
    const beforeImpact = profile.delivery === 'melee' ? 11 : 17;
    ticks(engine, beforeImpact);
    assert.deepEqual(engine.heroes.map(unit => unit.currentHp), initialHeroes);
    assert.deepEqual(engine.enemies.map(unit => unit.currentHp), initialEnemies);
    assert.ok(engine.enemies.every(unit => !unit.rpgGuardTicks && !unit.rpgBuffTicks));
    const expectedHeals = engine.enemies.map(unit => profile.effect === 'heal' && expected.includes(unit)
      ? getCombatHealingAmount(unit, profile.healRatio * unit.maxHp) : 0);
    ticks(engine, 1);
    engine.heroes.forEach((unit, index) => {
      assert.equal(unit.currentHp < initialHeroes[index], profile.effect === 'damage' && profile.multiplier > 0 && expected.includes(unit), unit.id);
      if (profile.action.statusEffect) assert.equal(unit.statusEffects[profile.action.statusEffect] > 0, expected.includes(unit));
    });
    engine.enemies.forEach((unit, index) => {
      const hit = expected.includes(unit);
      assert.equal(unit.currentHp, initialEnemies[index] + expectedHeals[index]);
      assert.equal(Boolean(unit.rpgGuardTicks), profile.effect === 'guard' && hit);
      assert.equal(Boolean(unit.rpgBuffTicks), profile.effect === 'buff' && hit);
      if (profile.effect === 'guard' && hit) assert.equal(unit.rpgGuardReduce, profile.guardReduce);
      if (profile.effect === 'buff' && hit) assert.equal(unit.rpgBuffMultiplier, profile.buffMultiplier);
    });
  } finally {
    engine.dispose();
  }
});

test('a regular campaign monster and the CPU use the same registered source', () => {
  const actor = ENEMIES_DB['Iron Tempest'].monsters[0];
  const engine = makeBattle(actor, 'cpu', true);
  try {
    const [source] = engine.enemies;
    assert.equal(source.id, actor.id);
    assert.equal(engine.getActionContext(source, 'secondary', 'enemy').profile.name, 'Couvert du bouclier de suie');
    engine.update();
    assert.equal(source.cooldown, 180);
    ticks(engine, 18);
    assert.ok(source.rpgGuardTicks > 0);
    assert.equal(source.rpgGuardReduce, 0.35);
  } finally {
    engine.dispose();
  }
});

test('a CPU repair unit heals an eligible ally and falls back when the radiation cap prevents repair', () => {
  const actor = roster.find(unit => unit.id === 'helios_56:happy_home_servitor');
  for (const injured of [true, false]) {
    const engine = makeBattle(actor, 'cpu');
    try {
      const [source, ally] = engine.enemies;
      ally.currentHp = Math.floor(ally.maxHp * (injured ? 0.35 : 0.55));
      ally.statusEffects.radiated = 300;
      const before = ally.currentHp;
      const hp = engine.heroes.map(unit => unit.currentHp);
      engine.update();
      assert.equal(source.cooldown, injured ? 180 : 0);
      ticks(engine, 18);
      assert.equal(ally.currentHp, injured ? ally.maxHp * 0.5 : before);
      assert.equal(engine.heroes.some((unit, index) => unit.currentHp < hp[index]), !injured);
    } finally {
      engine.dispose();
    }
  }
});

test('the CPU uses the Oni’s self-directed fury in the campaign with no opponent damage', () => {
  const actor = ENEMIES_DB['Yomi no Kage'].monsters[0];
  const engine = makeBattle(actor, 'cpu', true);
  try {
    const [source] = engine.enemies;
    const initial = engine.heroes.map(unit => unit.currentHp);
    assert.equal(source.id, 'yomi_no_kage:oni_du_peage_rouge');
    engine.update();
    assert.equal(source.cooldown, 180);
    ticks(engine, 18);
    assert.ok(source.rpgBuffTicks > 0);
    assert.equal(source.rpgBuffMultiplier, 1.22);
    assert.deepEqual(engine.heroes.map(unit => unit.currentHp), initial);
    assert.ok(engine.enemies.slice(1).every(unit => !unit.rpgBuffTicks));
    ticks(engine, 180);
    assert.equal(source.rpgBuffTicks, 0);
  } finally {
    engine.dispose();
  }
});

test('the regular enemy rule requires full identity and preserves supplied and encounter actions', () => {
  const [actor] = roster;
  const different = [
    { ...actor, id: 'copied-constable' }, { ...actor, name: 'Another actor' },
    { ...actor, universe: 'Unrelated universe' }, { ...actor, weapon: 'rifle' },
    { ...actor, sourceUniverse: 'Another continuity' },
    { ...actor, signature: { ...actor.signature, en: 'Source was changed' } },
    { ...actor, isBoss: true }, { ...actor, isWorldBoss: true },
    { ...actor, rpgAttacks: { secondary: { shape: 'line' } } }
  ];
  for (const other of different) assert.equal(getRpgCombatantAbility(other, 'secondary'), null);
  const supplied = { name: 'Encounter command', type: 'projectile', dmg: 1.1, targeting: { shape: 'line' } };
  assert.equal(getRpgCombatantAbility({ ...actor, secondary: supplied }, 'secondary'), supplied);
  assert.equal(getRpgActionProfile(actor, 'secondary', 'enemy', {}, supplied).action, supplied);
});

test('the Valedor campaign CPU regenerates the Troll and falls back to a normal attack when it is full', () => {
  const actor = continuationRoster.find(unit => unit.id === 'valedor_shattered_crown:brute_troll_des_ponts');
  for (const injured of [true, false]) {
    const engine = makeBattle(actor, 'cpu', true);
    try {
      const source = engine.enemies.find(unit => unit.id === actor.id);
      engine.enemies.forEach(unit => { unit.atb = 0; });
      source.atb = 100;
      if (injured) source.currentHp -= 60;
      const before = source.currentHp;
      const hp = engine.heroes.map(unit => unit.currentHp);
      const healing = getCombatHealingAmount(source, 0.16 * source.maxHp);
      const profile = engine.getActionContext(source, 'secondary', 'enemy').profile;
      assert.equal(profile.name, 'Régénération du pont contesté');
      assert.equal(profile.targetSide, 'self');
      assert.equal(profile.healRatio, 0.16);
      engine.update();
      assert.equal(source.cooldown, injured ? 180 : 0);
      ticks(engine, 18);
      assert.equal(source.currentHp, before + healing);
      assert.equal(engine.heroes.some((unit, index) => unit.currentHp < hp[index]), !injured);
    } finally {
      engine.dispose();
    }
  }
});

test('Rature reduces the confirmed hero’s ATB rate without damaging their body', () => {
  const actor = continuationRoster.find(unit => unit.id === 'oc_act4_rature_seuil_blanc');
  const engine = makeBattle(actor);
  try {
    const [source] = engine.enemies;
    const [hero, other] = engine.heroes;
    const initialHp = hero.currentHp;
    assert.equal(engine.beginTargeting(source, 'secondary', 'enemy'), true);
    assert.equal(engine.selectTarget(hero.battleId), true);
    assert.equal(engine.getTargetingState().abilityName, 'Effacement de l’intention');
    assert.equal(engine.confirmTargeting(), true);
    ticks(engine, 34);
    assert.equal(hero.currentHp, initialHp);
    assert.ok(hero.statusEffects.glitched > 0);
    assert.equal(other.statusEffects.glitched, 0);
    const atb = hero.atb;
    engine.update();
    assert.ok(Math.abs(hero.atb - atb - (hero.stats.spd * 0.05 + 0.15) / 2) < 1e-9);
  } finally {
    engine.dispose();
  }
});

test('the DLC and Nexus commands require the original signed enemy and preserve explicit selections', () => {
  const dlc = continuationRoster.find(actor => actor.id === 'rature_de_corail');
  const nexus = continuationRoster.find(actor => actor.id === 'oc_act3_indexeur_contradictions');
  const matrix = continuationRoster.find(actor => actor.name === 'Matrice de Substitution');
  const others = [
    { ...dlc, contentPackId: 'oc-dlc-borrowed-hours' }, { ...dlc, contentOrigin: 'custom' }, { ...dlc, originalContent: false },
    { ...dlc, lore: { ...dlc.lore, en: 'Different character' } }, { ...dlc, isWorldBoss: true },
    { ...nexus, actId: 'arrivals' }, { ...nexus, role: 'tank' }, { ...nexus, special: 'Ordinary cutter' },
    { ...nexus, lore: 'Different actor' }, { ...nexus, sourceUniverse: 'Aevum Fracture' },
    { ...matrix, id: 'name:Matrice de Substitution' }, { ...matrix, visualStyle: 'another_matrix' }, { ...matrix, isBoss: true }
  ];
  for (const other of others) assert.equal(getRpgCombatantAbility(other, 'secondary'), null, other.name);
  assert.equal(matrix.id, undefined);
  for (const actor of [dlc, nexus, matrix]) {
    const supplied = { name: 'Encounter secondary', type: 'beam', dmg: 1.1, targeting: { shape: 'line' } };
    assert.equal(getRpgCombatantAbility({ ...actor, secondary: supplied }, 'secondary'), supplied);
    assert.equal(getRpgActionProfile(actor, 'secondary', 'enemy', {}, supplied).action, supplied);
    const original = getRpgActionProfile({ ...actor, weapon: 'identity-test' }, 'special', 'enemy');
    assert.deepEqual(getRpgActionProfile(actor, 'special', 'enemy'), original);
  }
});
