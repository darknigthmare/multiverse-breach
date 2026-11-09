import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, EngineTactics;
const engines = [];
const hero = id => ({ id, name: id, universe: 'Nexus de Convergence', category: 'qa',
  stats: { hp: 300, atk: 30, def: 0, spd: 20 }, simple: { name: 'Shot', type: 'bullet', dmg: 1, tactics: { range: 5 } },
  secondary: { name: 'Shot+', type: 'bullet', dmg: 2, cd: 3, tactics: { range: 5 } },
  special: { name: 'Burst', type: 'melee', dmg: 3 }, defense: { type: 'shield', reduce: 0.4, dur: 1 } });
function make() {
  const enemy = { id: 'qa-enemy', name: 'QA enemy', hp: 300, atk: 20, spd: 1, weapon: 'gun' };
  const e = new EngineTactics(760, 420, [hero('a'), hero('b'), hero('c')], { monsters: [enemy], bosses: [], customRoster: [enemy, { ...enemy, id: 'qa-e2', name: 'QA enemy 2' }] }, { add() {} }, () => {}, () => {},
    { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e); e.tiles = []; e.obstacles = []; e.protectedArtifact = null; e.escortUnit = null;
  e.missionProfile = { ...e.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  e.heroes.forEach((u, i) => Object.assign(u, { gridX: 1, gridY: i + 1, specialCharge: 100 }));
  e.enemies.forEach((u, i) => Object.assign(u, { gridX: 4, gridY: i + 1, specialCharge: 100 }));
  return e;
}
const ticks = (e, n) => { for (let i = 0; i < n; i++) e.update(); };
function start(e, unit = e.heroes[0], type = 'hero') {
  e.turnQueue = [{ unit, type }, ...e.heroes.filter(h => h !== unit).map(h => ({ unit: h, type: 'hero' })), ...e.enemies.filter(h => h !== unit).map(h => ({ unit: h, type: 'enemy' }))];
  e.startTurn();
}
before(async () => { vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } }); ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js')); });
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });

for (const side of ['hero', 'enemy']) {
  test(`Tactics ${side}: paused selection and movement cannot mutate the turn`, () => {
    const e = make(), u = side === 'hero' ? e.heroes[0] : e.enemies[0]; start(e, u, side); e.setPaused(true);
    const before = [u.gridX, u.gridY, u.specialCharge, e.actionPhase, e.selectedAction];
    assert.equal(e.selectAction('secondary'), false);
    assert.equal(e.handleCellClick(u.gridX, u.gridY).handled, false);
    assert.deepEqual([u.gridX, u.gridY, u.specialCharge, e.actionPhase, e.selectedAction], before);
  });
  test(`Tactics ${side}: KO on an entry hazard skips the turn without a ghost action`, () => {
    const e = make(), u = side === 'hero' ? e.heroes[0] : e.enemies[0]; u.currentHp = 3;
    e.tiles = [{ x: u.gridX, y: u.gridY, type: 'hazard' }]; start(e, u, side);
    assert.equal(u.currentHp, 0); assert.equal(u.state, 'dead'); assert.equal(e.actionPhase, 'end');
    assert.equal(e.selectAction('simple'), false);
    ticks(e, 40); assert.notEqual(e.activeUnit, u); assert.equal(e.turnsElapsed, 1);
  });
}
test('Tactics: a heal tile triggers once per unit/cell/turn, not once per cancel or idle click', () => {
  const e = make(), u = e.heroes[0]; u.currentHp = 100; e.tiles = [{ x: u.gridX, y: u.gridY, type: 'heal' }]; start(e);
  assert.equal(u.currentHp, 108);
  for (let i = 0; i < 4; i++) { e.handleCellClick(u.gridX, u.gridY); e.cancelSelectedAction(); }
  assert.equal(u.currentHp, 108); start(e); assert.equal(u.currentHp, 116);
});
test('Tactics: a removed combatant cannot be selected from a stale initiative queue', () => {
  const e = make(), removed = e.heroes[0]; e.heroes = e.heroes.slice(1);
  e.turnQueue = [{ unit: removed, type: 'hero' }, { unit: e.heroes[0], type: 'hero' }]; e.startTurn();
  assert.equal(e.activeUnit, e.heroes[0]);
});
test('Tactics: a stale enemy windup cannot hit or end the next hero turn', () => {
  const e = make(); e.opponentControl = 'cpu'; start(e, e.enemies[0], 'enemy'); e.runEnemyAI();
  start(e, e.heroes[0]); const hp = e.heroes.map(h => h.currentHp), turns = e.turnsElapsed;
  ticks(e, 30); assert.deepEqual(e.heroes.map(h => h.currentHp), hp); assert.equal(e.turnsElapsed, turns);
});
test('Tactics: a KO during an enemy windup cancels that turn, but not a world callback', () => {
  const e = make(); e.opponentControl = 'cpu'; start(e, e.enemies[0], 'enemy'); e.runEnemyAI();
  let world = 0; e.schedule(() => world++, 250); const hp = e.heroes.map(h => h.currentHp);
  e.applyDamage(e.heroes[0], e.enemies[0], 10000); ticks(e, 32);
  assert.deepEqual(e.heroes.map(h => h.currentHp), hp); assert.equal(world, 1); assert.equal(e.turnsElapsed, 1);
});
test('Tactics: invalid/dead units cannot take manual actions', () => {
  const e = make(), u = e.heroes[0]; start(e); u.currentHp = 0;
  assert.equal(e.selectAction('secondary'), false); assert.equal(e.handleCellClick(u.gridX, u.gridY).handled, false);
});
for (const amount of [-20, NaN, Infinity]) test(`Tactics: invalid damage ${amount} leaves HP, shields and statuses unchanged`, () => {
  const e = make(), u = e.heroes[0]; u.currentHp = 100;
  const before = JSON.stringify(u); assert.equal(e.applyDamage(e.enemies[0], u, amount, 'infected'), 0); assert.equal(JSON.stringify(u), before);
});
test('Tactics: reapplying a status cannot shorten it', () => {
  const e = make(), u = e.enemies[0]; u.statusEffects.infected = 900;
  e.applyDamage(e.heroes[0], u, 5, 'infected'); assert.equal(u.statusEffects.infected, 900);
});
test('Tactics: dead targets cannot produce another hit or status', () => {
  const e = make(), u = e.enemies[0]; u.currentHp = 0; u.state = 'dead';
  const before = JSON.stringify(u); assert.equal(e.applyDamage(e.heroes[0], u, 20, 'infected'), 0); assert.equal(JSON.stringify(u), before);
});
test('Tactics: a barrier added after preview makes the shot fail without cost', () => {
  const e = make(), u = e.heroes[0], target = e.enemies[0]; start(e); e.selectAction('secondary');
  e.obstacles.push({ type: 'barrier', gridX: 2, gridY: 1, hp: 100, maxHp: 100 });
  const before = [target.currentHp, u.cooldown, u.specialCharge, e.turnsElapsed];
  assert.equal(e.handleCellClick(target.gridX, target.gridY).handled, false);
  assert.deepEqual([target.currentHp, u.cooldown, u.specialCharge, e.turnsElapsed], before);
});
test('Tactics: paused and disposed pickups are not consumed', () => {
  const e = make(); const item = { effect: { heal: 20 }, gridX: 1, gridY: 1 }; e.heroes[0].currentHp = 100;
  e.setPaused(true); assert.equal(e.applyTacticalBattleItem(item), false); e.setPaused(false); e.dispose();
  assert.equal(e.applyTacticalBattleItem(item), false); assert.equal(e.heroes[0].currentHp, 100); assert.equal(e.tacticalItemsUsed, 0);
});
test('Tactics: artifact impact counts effective damage, not requested overkill', () => {
  const e = make(); e.enemies[0].currentHp = 3; Object.assign(e.enemies[1], { gridX: 6, gridY: 4 });
  e.applyTacticalBattleItem({ tier: 'pickup', gridX: 4, gridY: 1, effect: { damage: 1000 } });
  assert.equal(e.tacticalItemImpact, 3);
});
test('Tactics: repeated AI dispatch within one turn cannot queue duplicate attacks', () => {
  const e = make(); start(e); e.runHeroAI(); const timers = e.timers.size; e.runHeroAI(); assert.equal(e.timers.size, timers);
});
test('Tactics: same-tick revival cannot resurrect the dead active actor windup', () => {
  const e = make(); e.opponentControl = 'cpu'; const enemy = e.enemies[0]; start(e, enemy, 'enemy'); e.runEnemyAI();
  const hp = e.heroes.map(u => u.currentHp); e.applyDamage(e.heroes[0], enemy, 10000);
  enemy.currentHp = 60; enemy.state = 'idle'; ticks(e, 30);
  assert.deepEqual(e.heroes.map(u => u.currentHp), hp); assert.equal(e.turnsElapsed, 1);
});
for (const side of ['hero', 'enemy']) test(`Tactics ${side}: enabling AI during a stun resumes once without duplication`, () => {
  const e = make(), unit = side === 'hero' ? e.heroes[0] : e.enemies[0]; start(e, unit, side);
  unit.state = 'hit'; unit.stateTimer = 10;
  const run = () => side === 'hero' ? e.runHeroAI() : e.runEnemyAI();
  run(); const queued = e.timers.size; run(); assert.equal(e.timers.size, queued);
  ticks(e, 44); assert.equal(e.turnsElapsed, 1);
});
test('Tactics: preview revalidation also rejects an AP route blocked after highlighting', () => {
  const e = make(); start(e); const u = e.activeUnit;
  e.obstacles.push({ type: 'barrier', hp: 100, gridX: 2, gridY: 1 });
  assert.equal(e.handleCellClick(3, 1).handled, false); assert.deepEqual([u.gridX, u.gridY, e.movementSpent], [1, 1, 0]);
});
test('Tactics: large unit movement rejects a clear centre whose footprint intersects cover', () => {
  const e = make(), u = e.enemies[0]; u.gridX = 3; u.gridY = 1; u.tacticsFootprint = { width: 2, height: 2 };
  e.enemies[1].gridX = 7; e.obstacles = [{ type: 'barrier', hp: 100, gridX: 5, gridY: 2 }];
  start(e, u, 'enemy'); assert.equal(e.isCellOccupied(4, 1, u), false);
  assert.equal(e.canOccupyCell(u, 4, 1), false); assert.ok(!e.movementRange.some(c => c.x === 4 && c.y === 1));
});
for (const cell of [[NaN, 1], [Infinity, 1], [1.5, 1], [-1, 0]]) test(`Tactics invalid cell ${cell} cannot spend movement`, () => {
  const e = make(); start(e); assert.equal(e.handleCellClick(...cell).handled, false); assert.equal(e.movementSpent, 0);
});
test('Tactics: obstacle preview reports effective damage without inventing cover or variance', () => {
  const e = make(), u = e.heroes[0], obstacle = { type: 'barrier', hp: 7, gridX: 3, gridY: 1 };
  const preview = e.getDamagePreview(u, obstacle, 'simple'); const dealt = e.applyDamage(u, obstacle, e.getActionBaseDamage(u, 'simple'));
  assert.equal(preview.damage, dealt); assert.equal(dealt, 7); assert.equal(preview.min, preview.max);
});

// Exercise the complete draw method too: logic-only tests cannot catch an
// out-of-scope identifier in the movement-highlight renderer.
for (const side of ['hero', 'enemy']) test(`Tactics ${side}: draw movement highlights without changing the turn`, () => {
  const e = make(), unit = side === 'hero' ? e.heroes[0] : e.enemies[0];
  start(e, unit, side);
  const gradient = { addColorStop() {} };
  const ctx = new Proxy({
    canvas: { width: e.width, height: e.height },
    createLinearGradient: () => gradient, createRadialGradient: () => gradient,
    createPattern: () => null,
    measureText: value => ({ width: String(value).length * 7 })
  }, { get: (target, key) => key in target ? target[key] : () => {} });
  const before = [e.activeUnit, e.turnSerial, e.movementSpent, e.selectedAction];
  assert.doesNotThrow(() => e.draw(ctx, 0));
  assert.deepEqual([e.activeUnit, e.turnSerial, e.movementSpent, e.selectedAction], before);
});
