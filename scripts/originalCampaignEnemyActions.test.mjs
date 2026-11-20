import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { getRpgActionProfile, getRpgCombatantAbility } from '../src/game/rpgTargeting.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData } from '../src/game/customBattle.js';
import { getCombatHealingAmount } from '../src/game/combatHealing.js';

const universes = [
  'The Aether Crown', 'Meridian Clockwork', 'Iron Tempest', 'Helios 56',
  'Kemet: The Devoured Sun', 'Imperium Aeternum', 'The Crownless Sea', 'The Drowned Testament'
];
const roster = universes.flatMap(universe => ENEMIES_DB[universe].monsters);
const catalog = buildCustomEnemyCatalog();
const noop = () => {};
const place = (actor, x, y) => Object.assign(actor, { x, y, homeX: x, homeY: y });
const ticks = (engine, total) => { for (let tick = 0; tick < total; tick++) engine.update(); };

function makeBattle(actor, opponentControl = 'p2', campaign = false) {
  const universe = actor.universe;
  const heroes = HEROES_DB.filter(hero => hero.universe === universe);
  const originalEnemies = ENEMIES_DB[universe];
  const allies = originalEnemies.monsters.filter(enemy => enemy.id !== actor.id).slice(0, 2);
  const data = campaign ? originalEnemies : buildCustomEnemyData([actor, ...allies].map(enemy =>
    catalog.find(entry => entry.universe === universe && entry.data.id === enemy.id).id), catalog);
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

test('the eight original worlds contribute forty different regular actors and forty named commands', () => {
  assert.equal(roster.length, 40);
  assert.equal(new Set(roster.map(actor => actor.id)).size, 40);
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
  assert.equal(names.size, 40);
});

for (const actor of roster) test(`the live P2 command prepares, previews and resolves the secondary of ${actor.name}`, () => {
  const engine = makeBattle(actor);
  try {
    const [source, nearAlly, farAlly] = engine.enemies;
    const [first, second] = engine.heroes;
    nearAlly.currentHp -= 60;
    farAlly.currentHp -= 60;
    const initialHeroes = engine.heroes.map(unit => unit.currentHp);
    const initialNearAlly = nearAlly.currentHp;
    const initialFarAlly = farAlly.currentHp;
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
    assert.equal(source.atb, 100);
    assert.equal(source.cooldown, 0);
    assert.equal(engine.confirmTargeting(), true);
    assert.equal(engine.confirmTargeting(), false);
    assert.equal(source.atb, 0);
    assert.equal(source.cooldown, 180);
    const beforeImpact = profile.delivery === 'melee' ? 11 : 17;
    ticks(engine, beforeImpact);
    assert.deepEqual(engine.heroes.map(unit => unit.currentHp), initialHeroes);
    assert.equal(nearAlly.currentHp, initialNearAlly);
    assert.equal(Boolean(nearAlly.rpgGuardTicks || nearAlly.rpgBuffTicks), false);
    const expectedHeal = profile.effect === 'heal' ? getCombatHealingAmount(nearAlly, profile.healRatio * nearAlly.maxHp) : 0;
    ticks(engine, 1);
    engine.heroes.forEach((unit, index) => {
      assert.equal(unit.currentHp < initialHeroes[index], profile.effect === 'damage' && expected.includes(unit), unit.id);
      if (profile.action.statusEffect) assert.equal(unit.statusEffects[profile.action.statusEffect] > 0, expected.includes(unit));
    });
    engine.enemies.forEach(unit => {
      const hit = expected.includes(unit);
      assert.equal(Boolean(unit.rpgGuardTicks), profile.effect === 'guard' && hit);
      assert.equal(Boolean(unit.rpgBuffTicks), profile.effect === 'buff' && hit);
      if (profile.effect === 'guard' && hit) assert.equal(unit.rpgGuardReduce, profile.guardReduce);
      if (profile.effect === 'buff' && hit) assert.equal(unit.rpgBuffMultiplier, profile.buffMultiplier);
    });
    assert.equal(nearAlly.currentHp, initialNearAlly + expectedHeal);
    assert.equal(farAlly.currentHp, initialFarAlly);
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
