import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, EngineTactics;
const engines = [];
const hero = (id, extra = {}) => ({ id, name: id, universe: 'Nexus de Convergence', category: 'audit',
  primaryColor: '#39c5bb', stats: { hp: 200, atk: 20, def: 0, spd: 30 },
  simple: { name: 'Audit shot', type: 'bullet', dmg: 1, tactics: { range: 6 } },
  secondary: { name: 'Audit heal', type: 'heal', dmg: 2, cd: 3 },
  special: { name: 'Audit revive', type: 'revive', reviveRatio: 0.3 },
  defense: { name: 'Guard', type: 'shield', reduce: 0.4, dur: 1 }, ...extra });
const make = (extra = {}) => {
  const enemy = { ...hero('enemy'), hp: 200, atk: 20, def: 0, spd: 1, stats: undefined };
  const e = new EngineTactics(760, 420, [hero('caster', extra), hero('patient'), hero('other')],
    { customRoster: [enemy, { ...enemy, id: 'enemy2', name: 'enemy2' }], monsters: [enemy], bosses: [] },
    { add() {} }, () => {}, () => {}, { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e);
  e.timers.clear(); e.obstacles = []; e.tiles = []; e.protectedArtifact = null; e.escortUnit = null;
  e.objective = 'rout'; e.missionProfile = { reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  e.heroes.forEach((u, i) => Object.assign(u, { gridX: 1, gridY: 1 + i, currentHp: 200, state: 'idle', stateTimer: 0, specialCharge: 100 }));
  e.enemies.forEach((u, i) => Object.assign(u, { gridX: 5, gridY: 1 + i, state: 'idle', stateTimer: 0 }));
  e.activeUnit = e.heroes[0]; e.activeUnitType = 'hero'; e.actionPhase = 'move';
  e.movementSpent = 0; e.movementBudget = 2; e.calculateMovementRange();
  return e;
};
const ticks = (e, n) => { for (let i = 0; i < n; i++) e.update(); };
before(async () => { vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js')); });
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });

test('Tactics: a healing skill heals an allied target, never damages the enemy', () => {
  const e = make(); const h = e.heroes[0], patient = e.heroes[1]; patient.currentHp = 80;
  const enemyHp = e.enemies.map(u => u.currentHp);
  assert.equal(e.selectAction('secondary'), true);
  assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, true);
  assert.equal(patient.currentHp, 120);
  assert.deepEqual(e.enemies.map(u => u.currentHp), enemyHp);
  assert.ok(h.cooldown > 0);
});

test('Tactics: pause blocks movement, action selection and direct AI', () => {
  const e = make(); e.setPaused(true); const h = e.heroes[0];
  assert.equal(e.selectAction('simple'), false);
  assert.equal(e.handleCellClick(2, 1).handled, false);
  e.runHeroAI(); ticks(e, 90);
  assert.equal(h.gridX, 1); assert.equal(e.turnsElapsed, 0); assert.equal(e.timers.size, 0);
});

test('Tactics: a hero killed on entering hazardous terrain cannot attack and does not strand the turn', () => {
  const e = make(); const h = e.heroes[0]; h.currentHp = 5;
  e.tiles = [{ x: 2, y: 1, type: 'hazard' }]; e.calculateMovementRange();
  assert.equal(e.handleCellClick(2, 1).handled, true);
  assert.equal(h.currentHp, 0);
  assert.equal(e.selectAction('simple'), false);
  ticks(e, 38);
  assert.notEqual(e.activeUnit, h);
});

test('Tactics: choosing the occupied current tile does not repeat its healing', () => {
  const e = make(); const h = e.heroes[0]; h.currentHp = 100;
  e.tiles = [{ x: 1, y: 1, type: 'heal' }];
  e.applyStartTileEffect(h); assert.equal(h.currentHp, 108);
  for (let i = 0; i < 3; i++) { e.handleCellClick(1, 1); e.cancelSelectedAction(); }
  assert.equal(h.currentHp, 108);
});

test('Tactics: negative damage cannot stagger, debuff or heal any target category', () => {
  const e = make(); const h = e.heroes[0]; h.talent = 'suppressing_fire';
  const obstacle = { type: 'barrier', hp: 20, gridX: 3, gridY: 1 };
  e.obstacles = [obstacle];
  for (const target of [e.enemies[0], obstacle]) {
    const before = JSON.stringify(target);
    e.applyDamage(h, target, -40, 'infected');
    assert.equal(JSON.stringify(target), before);
  }
});

test('Tactics: refreshed status does not shorten a longer existing duration', () => {
  const e = make(); e.enemies[0].statusEffects.infected = 1000;
  e.applyDamage(e.heroes[0], e.enemies[0], 10, 'infected');
  assert.equal(e.enemies[0].statusEffects.infected, 1000);
});

for (const side of ['hero', 'enemy']) test(`Tactics ${side}: support targets only its own team`, () => {
  const e = make(); const actor = side === 'hero' ? e.heroes[0] : e.enemies[0];
  const ally = side === 'hero' ? e.heroes[1] : e.enemies[1];
  const foe = side === 'hero' ? e.enemies[0] : e.heroes[0];
  e.activeUnit = actor; e.activeUnitType = side; actor.cooldown = 0;
  ally.currentHp = 80; foe.currentHp = 80;
  assert.equal(e.selectAction('secondary'), true);
  assert.equal(e.handleCellClick(foe.gridX, foe.gridY).handled, false);
  assert.equal(actor.cooldown, 0);
  assert.equal(e.handleCellClick(ally.gridX, ally.gridY).handled, true);
  assert.equal(ally.currentHp, 120); assert.equal(foe.currentHp, 80);
});

for (const hp of [95, 100, 160]) test(`Tactics healing with radiation at ${hp}/200 HP respects its cap`, () => {
  const e = make(); const patient = e.heroes[1]; patient.currentHp = hp; patient.statusEffects.radiated = 1000;
  e.selectAction('secondary'); const result = e.handleCellClick(patient.gridX, patient.gridY);
  assert.equal(result.handled, hp < 100);
  assert.equal(patient.currentHp, hp < 100 ? 100 : hp);
  assert.equal(e.heroes[0].cooldown > 0, hp < 100);
});

test('Tactics heal+cleanse at radiation cap removes only the requested status, preserving unknown and positive ones', () => {
  const e = make({ secondary: { type: 'heal', dmg: 2, cd: 3, cleanses: ['infected'] } });
  const patient = e.heroes[1]; patient.currentHp = 100;
  patient.statusEffects = { infected: 600, radiated: 600, blessed: 900, customStatus: 80 };
  e.selectAction('secondary');
  const preview = e.getDamagePreview(e.heroes[0], patient, 'secondary');
  assert.equal(preview.healing, 0); assert.deepEqual(preview.cleanses, ['infected']);
  assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, true);
  assert.equal(patient.currentHp, 100);
  assert.deepEqual(patient.statusEffects, { infected: 0, radiated: 600, blessed: 900, customStatus: 80 });
});

test('Tactics pure cleanse cannot select allies without the requested ailment', () => {
  const e = make({ secondary: { type: 'cleanse', cd: 2, cleanses: ['radiated'] } });
  e.heroes[1].statusEffects.infected = 800; e.selectAction('secondary');
  assert.equal(e.handleCellClick(1, 2).handled, false);
  e.heroes[1].statusEffects.radiated = 800; e.calculateAttackRange();
  assert.equal(e.handleCellClick(1, 2).handled, true);
  assert.equal(e.heroes[1].statusEffects.infected, 800); assert.equal(e.heroes[1].statusEffects.radiated, 0);
});

for (const kind of ['revive', 'heal', 'cleanse']) test(`Tactics ${kind}: wrong target state does not spend a charge or cooldown`, () => {
  const e = make({ secondary: { type: kind, dmg: 3, cd: 3 } });
  if (kind === 'heal') { e.heroes[1].currentHp = 0; e.heroes[1].state = 'dead'; }
  const before = [e.heroes[0].cooldown, e.heroes[0].specialCharge];
  e.selectAction('secondary'); assert.equal(e.handleCellClick(1, 2).handled, false);
  assert.deepEqual([e.heroes[0].cooldown, e.heroes[0].specialCharge], before);
});

for (const side of ['hero', 'enemy']) test(`Tactics ${side}: resurrection has real HP, clears ailments and never duplicates a turn`, () => {
  const e = make(); const allies = side === 'hero' ? e.heroes : e.enemies;
  const actor = allies[0], target = allies[1]; actor.specialCharge = 100;
  target.currentHp = 0; target.state = 'dead'; target.statusEffects.infected = 1000;
  e.activeUnit = actor; e.activeUnitType = side;
  e.turnQueue = e.turnQueue.filter(entry => entry.unit !== target);
  assert.equal(e.selectAction('special'), true);
  const preview = e.getDamagePreview(actor, target, 'special'); assert.equal(preview.healing, 60);
  assert.equal(e.handleCellClick(target.gridX, target.gridY).handled, true);
  assert.equal(target.currentHp, 60); assert.equal(target.state, 'idle'); assert.equal(target.statusEffects.infected, 0);
  assert.equal(actor.specialCharge, 0);
  assert.equal(e.turnQueue.filter(entry => entry.unit === target).length, 0);
  e.rebuildTurnQueue(); assert.equal(e.turnQueue.filter(entry => entry.unit === target).length, 1);
});

test('Tactics revival refuses a corpse cell occupied by another unit without spending special charge', () => {
  const e = make(); const target = e.heroes[1]; target.currentHp = 0; target.state = 'dead';
  Object.assign(e.enemies[0], { gridX: 1, gridY: 2 }); e.selectAction('special');
  assert.equal(e.handleCellClick(1, 2).handled, false);
  assert.equal(e.heroes[0].specialCharge, 100); assert.equal(target.currentHp, 0);
});

test('Tactics healing obeys current range and line of sight, including a blocker added after selection', () => {
  const e = make(); e.heroes[1].gridY = 4; e.heroes[2].gridX = 0; e.heroes[1].currentHp = 80;
  e.selectAction('secondary'); e.obstacles.push({ type: 'barrier', hp: 20, gridX: 1, gridY: 2 });
  assert.equal(e.handleCellClick(1, 4).handled, false); assert.equal(e.heroes[0].cooldown, 0);
});

test('Tactics group healing applies once to each eligible ally and never hits foes', () => {
  const e = make({ special: { type: 'heal', healRatio: 0.2, targeting: 'group' } });
  e.heroes.forEach(h => { h.currentHp = 100; });
  const before = e.enemies.map(u => u.currentHp);
  e.selectAction('special'); assert.equal(e.handleCellClick(1, 1).handled, true);
  assert.deepEqual(e.heroes.map(h => h.currentHp), [140, 140, 140]);
  assert.deepEqual(e.enemies.map(u => u.currentHp), before);
});

test('Tactics defence with a healing definition heals the caster instead of behaving like an attack', () => {
  const e = make({ defense: { type: 'heal', healRatio: 0.25, dur: 1, reduce: 0.4 } }); e.heroes[0].currentHp = 80;
  e.selectAction('defense'); assert.equal(e.handleCellClick(1, 1).handled, true); assert.equal(e.heroes[0].currentHp, 130);
});

for (const effect of ['guard', 'buff']) test(`Tactics ${effect}: temporary modifier affects real damage, pauses, expires without changing base stats`, () => {
  const e = make({ secondary: { type: effect, cd: 1, duration: 1, buffMultiplier: 2, reduce: 0.5 } });
  const patient = e.heroes[1]; const base = JSON.stringify(patient.stats); const foe = e.enemies[0];
  const before = e.getDamagePreview(effect === 'guard' ? foe : patient, effect === 'guard' ? patient : foe, 'simple').damage;
  e.selectAction('secondary'); assert.equal(e.handleCellClick(1, 2).handled, true);
  const after = e.getDamagePreview(effect === 'guard' ? foe : patient, effect === 'guard' ? patient : foe, 'simple').damage;
  assert.ok(effect === 'guard' ? after < before : after > before);
  e.setPaused(true); ticks(e, 100); assert.equal(patient[effect === 'guard' ? 'tacticsGuardTicks' : 'tacticsBuffTicks'], 60);
  e.setPaused(false); ticks(e, 60);
  assert.equal(patient[effect === 'guard' ? 'tacticsGuardTicks' : 'tacticsBuffTicks'], 0); assert.equal(JSON.stringify(patient.stats), base);
});

for (const side of ['hero', 'enemy']) test(`Tactics ${side}: KO followed by revival cannot restore a pending AI attack`, () => {
  const e = make({ secondary: { type: 'bullet', dmg: 2, cd: 3, range: 6 }, special: { type: 'bullet', dmg: 3 } });
  const actor = side === 'hero' ? e.heroes[0] : e.enemies[0];
  const target = side === 'hero' ? e.enemies[0] : e.heroes[0];
  e.activeUnit = actor; e.activeUnitType = side; e.actionPhase = side === 'hero' ? 'move' : 'enemy_ai';
  if (side === 'hero') e.runHeroAI(); else e.runEnemyAI();
  assert.equal(e.actionPhase, 'resolving');
  e.applyDamage(target, actor, 10000); assert.equal(actor.currentHp, 0);
  actor.currentHp = 60; actor.state = 'idle'; actor.stateTimer = 0;
  const hp = target.currentHp; ticks(e, 32);
  assert.equal(target.currentHp, hp); assert.equal(e.actionPhase, 'end');
});

test('Tactics removed actor cannot complete its queued turn after roster replacement', () => {
  const e = make({ secondary: { type: 'bullet', dmg: 2, cd: 3, range: 6 } });
  e.runHeroAI(); const actor = e.heroes[0]; e.heroes = e.heroes.slice(1);
  const hp = e.enemies[0].currentHp; ticks(e, 32);
  assert.equal(e.enemies[0].currentHp, hp); assert.notEqual(e.activeUnit, null);
  ticks(e, 38); assert.notEqual(e.activeUnit, actor);
});

test('Tactics repeated auto command cannot queue multiple impacts for one turn', () => {
  const e = make({ secondary: { type: 'bullet', dmg: 2, cd: 3, range: 6 } });
  e.runHeroAI(); const count = e.timers.size; e.runHeroAI(); e.runHeroAI();
  assert.equal(e.timers.size, count);
});

test('Tactics end-turn double click advances once and cannot skip a pending AI attack', () => {
  const e = make(); assert.equal(e.skipActiveTurn(), true); assert.equal(e.skipActiveTurn(), false);
  assert.equal(e.turnsElapsed, 1); e.startTurn(); e.runHeroAI();
  assert.equal(e.skipActiveTurn(), false);
});

test('Tactics AI selects recoverable healing before damage', () => {
  const e = make(); const radiated = e.heroes[1], patient = e.heroes[2];
  radiated.currentHp = 95; radiated.statusEffects.radiated = 1000; patient.currentHp = 140;
  e.runHeroAI(); ticks(e, 30);
  assert.equal(patient.currentHp, 180); assert.equal(radiated.currentHp, 95);
  assert.deepEqual(e.enemies.map(u => u.currentHp), [200, 200]);
});

for (const value of [NaN, Infinity, -Infinity, undefined, null, '2', 1.5, -1, 100]) test(`Tactics invalid grid input ${String(value)} cannot run geometry or consume a turn`, () => {
  const e = make(); assert.equal(e.isInsideGrid(value, 1), false);
  assert.deepEqual(e.getCellsOnLine({ gridX: value, gridY: 1 }, e.enemies[0]), []);
  assert.equal(e.handleCellClick(value, 1).handled, false);
  assert.equal(e.turnsElapsed, 0);
});

test('Tactics large-unit movement checks the whole footprint, not only the centre', () => {
  const e = make(); const unit = e.enemies[0]; unit.tacticsFootprint = { width: 3, height: 2 };
  Object.assign(unit, { gridX: 4, gridY: 2 }); e.enemies[1].gridX = 7; e.enemies[1].gridY = 4;
  e.obstacles = [{ type: 'barrier', hp: 100, gridX: 2, gridY: 2 }];
  const cells = e.getReachableCells(unit, 2);
  assert.equal(cells.some(cell => cell.x === 3 && cell.y === 2), false);
  assert.ok(cells.some(cell => cell.x === 5 && cell.y === 2));
});

test('Tactics barrel chains run on simulation time even while the active hero is stunned', () => {
  const e = make(); e.heroes[0].state = 'hit'; e.heroes[0].stateTimer = 300;
  e.obstacles = [{ type: 'barrel', hp: 0, gridX: 3, gridY: 4 }, { type: 'barrel', hp: 100, gridX: 4, gridY: 4 }, { type: 'barrel', hp: 100, gridX: 5, gridY: 4 }];
  e.triggerBarrelExplosion(3, 4); ticks(e, 12);
  assert.equal(e.obstacles[2].hp, 0); assert.ok(e.heroes[0].stateTimer > 200);
});

for (const flatDefense of [0, 20, 60]) test(`Tactics preview and actual impact agree for flat enemy DEF ${flatDefense}, pickup shields and buffs`, () => {
  const e = make(); const attacker = e.heroes[0], target = e.enemies[0];
  attacker.simple.dmg = 10; attacker.tacticsBuffTicks = 60; attacker.tacticsBuffMultiplier = 1.25;
  target.def = flatDefense; target.battleItemShield = 7; target.tacticsGuardTicks = 60; target.tacticsGuardReduce = 0.2;
  const preview = e.getDamagePreview(attacker, target, 'simple'); const hp = target.currentHp;
  const random = Math.random; Math.random = () => 0.5;
  try { e.applyDamage(attacker, target, e.getActionBaseDamage(attacker, 'simple'), null, { actionType: 'simple' }); } finally { Math.random = random; }
  assert.equal(hp - target.currentHp, preview.damage); assert.ok(preview.min <= preview.damage && preview.max >= preview.damage);
});

test('Tactics zero-damage profile remains zero rather than acquiring fallback damage', () => {
  const e = make(); e.heroes[0].simple.dmg = 0;
  assert.equal(e.getActionBaseDamage(e.heroes[0], 'simple'), 0);
  assert.equal(e.getDamagePreview(e.heroes[0], e.enemies[0], 'simple').damage, 0);
});

test('Tactics revival validates the entire footprint, not only the corpse centre', () => {
  const e = make(); const corpse = e.heroes[1]; corpse.currentHp = 0; corpse.state = 'dead';
  corpse.tacticsFootprint = { width: 2, height: 1 };
  e.obstacles = [{ gridX: corpse.gridX + 1, gridY: corpse.gridY, type: 'barrier', hp: 20 }];
  e.selectAction('special');
  assert.equal(e.handleCellClick(corpse.gridX, corpse.gridY).handled, false);
  assert.equal(corpse.currentHp, 0); assert.equal(e.heroes[0].specialCharge, 100);
});

test('Tactics queued AI support does not heal a replacement occupant', () => {
  const e = make(); const patient = e.heroes[1]; patient.currentHp = 40;
  e.runHeroAI(); const replacement = { ...patient, id: 'replacement', currentHp: 60 };
  e.heroes[1] = replacement; ticks(e, 31);
  assert.equal(replacement.currentHp, 60); assert.equal(e.heroes[0].cooldown, 0);
});

test('Tactics removing a selected support skill costs no resource and does not crash', () => {
  const e = make(); const patient = e.heroes[1]; patient.currentHp = 40;
  e.selectAction('secondary'); delete e.heroes[0].secondary;
  assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, false);
  assert.equal(patient.currentHp, 40); assert.equal(e.heroes[0].cooldown, 0);
});

test('Tactics AI without useful support falls back to an offensive action', () => {
  const e = make(); const h = e.heroes[0]; h.specialCharge = 0;
  const initial = e.enemies.reduce((n, u) => n + u.currentHp, 0);
  e.runHeroAI(); ticks(e, 32);
  assert.equal(h.cooldown, 0);
  assert.ok(e.enemies.reduce((n, u) => n + u.currentHp, 0) < initial);
});

test('Tactics removing a prepared offensive AI skill does not throw or spend a charge', () => {
  const e = make({ secondary: { name: 'Shot', type: 'bullet', dmg: 2, cd: 4, tactics: { range: 6 } } });
  const h = e.heroes[0]; h.specialCharge = 0; e.runHeroAI(); delete h.secondary;
  const before = e.enemies.map(u => u.currentHp); ticks(e, 32);
  assert.equal(h.cooldown, 0); assert.deepEqual(e.enemies.map(u => u.currentHp), before);
});

test('Tactics complete intrinsic guard is preserved in preview and actual damage', () => {
  const e = make(); const defender = e.enemies[0];
  defender.state = 'defense'; defender.defense = { reduce: 1 }; defender.stateTimer = 500;
  assert.equal(e.getDamagePreview(e.heroes[0], defender).damage, 0);
  const hp = defender.currentHp; e.applyDamage(e.heroes[0], defender, 100);
  assert.equal(defender.currentHp, hp);
});

test('Tactics line support heals only allies along the selected grid segment', () => {
  const e = make({ secondary: { name: 'Line heal', type: 'heal', dmg: 2, targeting: { shape: 'line', range: 6 } } });
  const [caster, first, second] = e.heroes; first.currentHp = second.currentHp = 80;
  e.selectAction('secondary'); e.handleCellClick(second.gridX, second.gridY);
  assert.equal(first.currentHp, 120); assert.equal(second.currentHp, 120); assert.equal(caster.currentHp, 200);
});

test('Tactics cone support respects the authored angle and excludes a side ally', () => {
  const e = make({ secondary: { name: 'Cone heal', type: 'heal', dmg: 2, targeting: { shape: 'cone', range: 6, coneAngle: 30 } } });
  const [, first, second] = e.heroes; first.currentHp = second.currentHp = 80;
  first.gridX = 2; first.gridY = 2;
  e.selectAction('secondary'); e.handleCellClick(second.gridX, second.gridY);
  assert.equal(first.currentHp, 80); assert.equal(second.currentHp, 120);
});

test('Tactics OC medical and barricade summons use the existing authored support semantics', async () => {
  const { HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js');
  for (const [id, effect] of [['arca_mirelle', 'heal'], ['arca_loom', 'heal'], ['arca_bastion', 'guard'], ['arca_nova', 'buff']]) {
    const source = HEROES_DB.find(h => h.id === id); assert.ok(source);
    const e = make(source); const h = e.heroes[0], patient = e.heroes[1]; patient.currentHp = 40;
    assert.equal(e.getAttackProfile(h, 'secondary').effect, effect);
    e.selectAction('secondary');
    assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, true);
    if (effect === 'heal') assert.ok(patient.currentHp > 40);
    else if (effect === 'guard') assert.ok(patient.tacticsGuardTicks > 0);
    else assert.ok(patient.tacticsBuffTicks > 0);
  }
});
