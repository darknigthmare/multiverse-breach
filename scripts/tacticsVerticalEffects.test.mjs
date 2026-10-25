import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';

let vite, EngineTactics, HEROES_DB;
const engines = [], noop = () => {};
before(async () => {
  vite = await createServer({ logLevel: 'silent', appType: 'custom', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
const hero = id => HEROES_DB.find(unit => unit.id === id);
const make = (ids = ['bishop', 'ripley'], battlefield = 'nexus_skybridge') => {
  const roster = ids.map(id => ({ ...hero(id), stats: { hp: 300, atk: 40, def: 0, spd: 20 } }));
  const enemies = ['test-enemy-1', 'test-enemy-2'].map(id => ({
    id, name: id, universe: 'Nexus de Convergence', hp: 300, atk: 20, spd: 1, weapon: 'rifle',
    simple: { name: 'Test shot', type: 'projectile', dmg: 1, tactics: { delivery: 'ranged', range: 6 } }
  }));
  const e = new EngineTactics(1100, 720, roster,
    { monsters: enemies, bosses: [], customRoster: enemies },
    { add: noop }, noop, noop, {
      tacticsBattlefieldId: battlefield, universe: 'Nexus de Convergence', difficulty: 'Medium',
      customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  engines.push(e);
  return e;
};
const place = (e, unit, id) => {
  const surface = e.terrain.byId.get(id);
  assert.ok(surface, id);
  Object.assign(unit, { surfaceId: id, gridX: surface.x, gridY: surface.y, gridZ: surface.z });
  e.syncActorsToCamera();
};
const act = (e, unit, side = 'hero') => {
  e.activeUnit = unit; e.activeUnitType = side; e.actionPhase = 'action';
  e.movementBudget = 2; e.movementSpent = 0;
};

test('vertical commands resolve the selected source identity and convert pixel reach to bounded grid reach', () => {
  const e = make(['cloud_ff7']), cloud = e.heroes[0];
  assert.equal(e.getActionDefinition(cloud, 'simple').name, 'Taille de Buster Sword');
  assert.equal(e.getActionDefinition(cloud, 'secondary').name, 'Braver');
  assert.equal(e.getActionDefinition(cloud, 'defense').name, 'Parade de Buster Sword');
  assert.equal(e.getAttackProfile(cloud, 'simple').delivery, 'melee');
  assert.ok(e.getAttackProfile(cloud, 'special').range <= 8);
  assert.equal(e.getActionBaseDamage(e.heroes[0], 'defense'), 0);
});

test('Bishop guards actual allies without damaging opponents or supporting through the bridge slab', () => {
  const e = make(), [bishop, ripley] = e.heroes;
  place(e, bishop, 'ground:4:3'); place(e, ripley, 'ground:5:3');
  place(e, e.enemies[0], 'bridge:4:3');
  const opponentHp = e.enemies.map(unit => unit.currentHp);
  act(e, bishop);
  assert.equal(e.selectAction('simple'), true);
  assert.equal(e.getActionBaseDamage(bishop, 'simple'), 0);
  const result = e.handleSurfaceClick(ripley.surfaceId);
  assert.equal(result.handled, true);
  assert.ok(ripley.tacticsGuardTicks > 0);
  assert.ok(ripley.tacticsGuardReduce > 0);
  assert.deepEqual(e.enemies.map(unit => unit.currentHp), opponentHp);
  assert.equal(e.enemies[0].tacticsGuardTicks, undefined);
  place(e, ripley, 'bridge:4:3'); act(e, bishop);
  e.selectedAction = 'simple'; e.calculateAttackRange();
  assert.equal(e.attackRange.some(entry => entry.surfaceId === ripley.surfaceId), false);
  assert.equal(e.handleSurfaceClick(ripley.surfaceId).handled, false);
});

test('opposing support consumes its own meter and only guards its own side', () => {
  const e = make(), support = { ...hero('hayden'), ...e.enemies[0] };
  Object.assign(support, hero('hayden'), { currentHp: 300, maxHp: 300, specialCharge: 100, state: 'idle' });
  e.enemies[0] = support;
  place(e, support, 'ground:0:0'); place(e, e.enemies[1], 'ground:1:0');
  place(e, e.heroes[0], 'ground:0:1'); act(e, support, 'enemy');
  assert.equal(e.selectAction('special'), true);
  const hp = [...e.heroes, ...e.enemies].map(unit => unit.currentHp);
  const result = e.handleSurfaceClick(e.enemies[1].surfaceId);
  assert.equal(result.handled, true);
  assert.equal(support.specialCharge, 0);
  assert.ok(e.enemies[1].tacticsGuardTicks > 0);
  assert.equal(e.heroes[0].tacticsGuardTicks, undefined);
  assert.deepEqual([...e.heroes, ...e.enemies].map(unit => unit.currentHp), hp);
});

test('an explicit healer heals its real ally once and rejects enemy targets without consuming cooldown', () => {
  const e = make(), [healer, ally] = e.heroes;
  healer.id = 'vertical-healer'; healer.sourceHeroId = undefined;
  healer.secondary = { name: 'Local aid', type: 'heal', dmg: 0, cd: 4,
    targeting: { effect: 'heal', targetSide: 'ally', delivery: 'support', shape: 'single', range: 760, healRatio: 0.25 } };
  healer.cooldown = 0;
  place(e, healer, 'ground:0:0'); place(e, ally, 'ground:1:0');
  place(e, e.enemies[0], 'ground:2:0'); ally.currentHp = 100;
  act(e, healer); assert.equal(e.selectAction('secondary'), true);
  assert.equal(e.handleSurfaceClick(e.enemies[0].surfaceId).handled, false);
  assert.equal(healer.cooldown, 0);
  assert.equal(e.handleSurfaceClick(ally.surfaceId).handled, true);
  assert.equal(ally.currentHp, 175);
  assert.equal(healer.cooldown, 240);
  assert.equal(e.enemies[0].currentHp, 300);
});

test('a healing defense retains its declared ally targeting and never becomes a shield or attack', () => {
  const e = make(), [healer, ally] = e.heroes;
  healer.id = 'vertical-healing-defense';
  healer.defense = { name: 'Medical defense', type: 'heal', dmg: 0,
    targeting: { effect: 'heal', delivery: 'support', shape: 'single', targetSide: 'ally', range: 760, healRatio: 0.2 } };
  place(e, healer, 'ground:0:0'); place(e, ally, 'ground:1:0');
  ally.currentHp = 100; act(e, healer);
  assert.equal(e.selectAction('defense'), true);
  assert.ok(e.attackRange.some(entry => entry.surfaceId === ally.surfaceId));
  const hp = e.enemies.map(unit => unit.currentHp);
  assert.equal(e.handleSurfaceClick(ally.surfaceId).handled, true);
  assert.equal(ally.currentHp, 160);
  assert.equal(ally.tacticsGuardTicks, undefined);
  assert.equal(healer.state === 'defense', false);
  assert.deepEqual(e.enemies.map(unit => unit.currentHp), hp);
});

test('revival requires an unoccupied supported surface and never overlaps a living combatant', () => {
  const e = make(), [healer, ally] = e.heroes;
  healer.id = 'vertical-reviver';
  healer.secondary = { name: 'Return', type: 'revive', dmg: 0, cd: 4,
    targeting: { effect: 'revive', targetSide: 'ally', delivery: 'support', shape: 'single', range: 760, reviveRatio: 0.3 } };
  healer.cooldown = 0;
  place(e, healer, 'ground:0:0'); place(e, ally, 'ground:1:0'); ally.currentHp = 0;
  place(e, e.enemies[0], ally.surfaceId);
  act(e, healer); e.selectedAction = 'secondary'; e.calculateAttackRange();
  assert.equal(e.attackRange.some(entry => entry.surfaceId === ally.surfaceId), false);
  place(e, e.enemies[0], 'ground:3:0'); e.calculateAttackRange();
  assert.equal(e.handleSurfaceClick(ally.surfaceId).handled, true);
  assert.equal(ally.currentHp, 90);
});

test('guard and buff timers freeze in pause and preview uses the same guard reduction as damage', () => {
  const e = make(), [attacker, defender] = [e.enemies[0], e.heroes[1]];
  place(e, attacker, 'ground:0:0'); place(e, defender, 'ground:1:0');
  const normal = e.getDamagePreview(attacker, defender, 'simple').damage;
  defender.tacticsGuardTicks = 60; defender.tacticsGuardReduce = 0.4;
  attacker.tacticsBuffTicks = 60; attacker.tacticsBuffMultiplier = 1.2;
  assert.equal(e.getDamagePreview(attacker, defender, 'simple').damage, Math.round(normal * 1.2 * 0.6));
  e.setPaused(true); for (let i = 0; i < 10; i++) e.update();
  assert.equal(defender.tacticsGuardTicks, 60); assert.equal(attacker.tacticsBuffTicks, 60);
  e.setPaused(false); e.update();
  assert.equal(defender.tacticsGuardTicks, 59); assert.equal(attacker.tacticsBuffTicks, 59);
});

test('local pickup effects use the addressed floor and cannot heal, damage or trigger through a bridge', () => {
  const e = make(), [lower, upper] = e.heroes;
  place(e, lower, 'ground:4:3'); place(e, upper, 'bridge:4:3');
  place(e, e.enemies[0], 'bridge:5:3'); lower.currentHp = upper.currentHp = 100;
  assert.equal(e.applyTacticalBattleItem({ gridX: 4, gridY: 3, effect: { heal: 20 } }), false);
  assert.equal(e.tacticalItemsUsed, 0);
  assert.equal(e.applyTacticalBattleItem({ gridX: 4, gridY: 3, surfaceId: lower.surfaceId, effect: { heal: 20, damage: 20 } }), true);
  assert.equal(lower.currentHp, 120); assert.equal(upper.currentHp, 100);
  assert.equal(e.enemies[0].currentHp, 300);
});

test('a one-unit custom extraction keeps a reachable target and requires the actual extraction surface', () => {
  const e = make(['ripley'], 'cyber_catwalks'), unit = e.heroes[0];
  assert.equal(e.objectiveTarget, 1);
  const exit = e.battlefield.extractionZone[0];
  const lower = e.terrain.byCell.get(exit.x + ',' + exit.y).find(surface => surface.z === 0);
  if (lower && lower.id !== exit.surfaceId) {
    place(e, unit, lower.id); e.updateTacticsObjective();
    assert.equal(e.objectiveProgress, 0); assert.equal(e.gameOver, false);
  }
  place(e, unit, exit.surfaceId); e.updateTacticsObjective();
  assert.equal(e.battleResult, 'victory');
});
