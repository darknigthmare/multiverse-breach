import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
import { drawTacticsPhaselock } from '../src/game/tacticsControl.js';

let vite, EngineTactics, maya, resolveCombatAbility;
const engines = [], noop = () => {};
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, watch: null } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js?phaselock-w15'));
  const { HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js');
  ({ resolveCombatAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  maya = HEROES_DB.find(hero => hero.id === 'borderlands_2_maya_phaselock'); assert.ok(maya);
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => vite?.close());
const fixture = id => ({ id, name: id, universe: 'Nexus de Convergence', category: 'fixture', weaponType: 'rifle', primaryColor: '#70adbf',
  stats: { hp: 10000, atk: 20, def: 5, spd: 1 },
  simple: { name: 'Fixture shot', type: 'bullet', dmg: 1, tactics: { delivery: 'ranged', shape: 'single', range: 4, minRange: 1 } },
  secondary: { name: 'Fixture heavy shot', type: 'bullet', dmg: 2, cd: 3 }, special: { name: 'Fixture damage', type: 'bullet', dmg: 3 }, defense: { name: 'Fixture guard', type: 'guard', dur: 1, reduce: 0.3 } });
const stopTimers = e => { for (const timer of e.timers) clearTimeout(timer); e.timers.clear(); };
function place(e, unit, x, y, layer = 'ground') {
  Object.assign(unit, { gridX: x, gridY: y });
  if (e.verticalTerrain) { const surface = e.terrain.byId.get(`${layer}:${x}:${y}`); assert.ok(surface); Object.assign(unit, { gridZ: surface.z, surfaceId: surface.id }); }
  e.syncActorsToCamera();
}
function turn(e, unit, side) {
  stopTimers(e); e.activeUnit = unit; e.activeUnitType = side; e.actionPhase = 'move';
  e.movementBudget = 2; e.movementSpent = 0; e.selectedAction = null; e.selectedActionExplicit = false;
  e.calculateMovementRange();
}
function make(field, side) {
  const fixtures = [fixture('victim-a'), fixture('victim-b')];
  const players = side === 'hero' ? [maya, fixture('ally')] : fixtures;
  const opponents = side === 'hero' ? fixtures : [maya, fixture('enemy-ally')];
  const e = new EngineTactics(1050, 700, players, { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, noop, noop,
    { mode: 'Tactics', universe: 'Nexus de Convergence', tacticsBattlefieldId: field, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e); stopTimers(e); e.obstacles = [];
  const actor = (side === 'hero' ? e.heroes : e.enemies)[0], victims = side === 'hero' ? e.enemies : e.heroes;
  const ally = (side === 'hero' ? e.heroes : e.enemies)[1], y = e.verticalTerrain ? 5 : 2;
  place(e, actor, 2, y); place(e, victims[0], 3, y); place(e, victims[1], 5, y); place(e, ally, 1, y);
  actor.specialCharge = 100; actor.cooldown = 0; turn(e, actor, side);
  return { e, actor, target: victims[0], bystander: victims[1], ally, side, y };
}
const click = (e, unit) => e.handleCellClick(unit.gridX, unit.gridY, unit.surfaceId);

for (const field of ['training_grid', 'nexus_skybridge']) for (const side of ['hero', 'enemy']) {
  test(`${field}/${side}: real Maya Phaselock accepts one opposing body, charges once and changes no HP/guard/buff`, () => {
    const { e, actor, target, bystander, ally } = make(field, side), profile = e.getAttackProfile(actor, 'special');
    assert.equal(profile.effect, 'control'); assert.equal(profile.delivery, 'control'); assert.equal(profile.controlKind, 'phaselock');
    assert.equal(profile.targetSide, 'enemy'); assert.equal(profile.shape, 'single'); assert.equal(profile.maxTargets, 1); assert.equal(profile.range, 4);
    assert.equal(profile.controlTurns, 1); assert.equal(e.getActionBaseDamage(actor, 'special'), 0);
    const hp = [...e.heroes, ...e.enemies].map(unit => unit.currentHp), beforeTurns = e.turnsElapsed;
    target.tacticsGuardTicks = 90; target.tacticsGuardReduce = 0.3; target.tacticsBuffTicks = 80;
    let damageCalls = 0; const damage = e.applyDamage.bind(e); e.applyDamage = (...args) => { damageCalls++; return damage(...args); };
    assert.equal(e.selectAction('special'), true); assert.equal(click(e, target).handled, true);
    assert.equal(actor.specialCharge, 0); assert.equal(e.turnsElapsed, beforeTurns + 1); assert.equal(damageCalls, 0);
    assert.deepEqual([...e.heroes, ...e.enemies].map(unit => unit.currentHp), hp);
    assert.equal(target.tacticsGuardTicks, 90); assert.equal(target.tacticsBuffTicks, 80);
    assert.equal(target.tacticsControl.kind, 'phaselock'); assert.equal(target.tacticsControl.remainingTurns, 1);
    assert.equal(e.isTacticsControlled(ally), false); assert.equal(e.isTacticsControlled(bystander), false);
    assert.equal(e.isTacticsControlled(actor), false); assert.equal(click(e, target).handled, false); assert.equal(actor.specialCharge, 0);
  });
  test(`${field}/${side}: control survives frames and pause, blocks movement/actions, skips one target turn then expires`, () => {
    const { e, actor, target, side: actorSide } = make(field, side), targetSide = actorSide === 'hero' ? 'enemy' : 'hero';
    assert.equal(e.applyProfiledAttack(actor, target, 'special', 999999, null, actorSide).length, 1);
    const status = JSON.stringify(target.tacticsControl);
    for (let tick = 0; tick < 500; tick++) e.update();
    assert.equal(JSON.stringify(target.tacticsControl), status, 'Tactics control expires on the target turn, never a frame timer');
    turn(e, target, targetSide); target.specialCharge = 100;
    assert.deepEqual(e.getReachableCells(target, 99), []); assert.equal(e.selectAction('simple'), false); assert.equal(click(e, actor).handled, false);
    assert.deepEqual(e.applyProfiledAttack(target, actor, 'simple', 999999, null, targetSide), []);
    const before = e.turnsElapsed, hp = actor.currentHp;
    e.setPaused(true); e.turnQueue = [{ unit: target, type: targetSide }, { unit: actor, type: actorSide }]; e.startTurn();
    for (let tick = 0; tick < 100; tick++) e.update();
    assert.equal(e.turnsElapsed, before); assert.equal(actor.currentHp, hp); assert.equal(JSON.stringify(target.tacticsControl), status);
    e.setPaused(false); e.startTurn(); stopTimers(e);
    assert.equal(e.turnsElapsed, before + 1); assert.equal(e.actionPhase, 'end'); assert.equal(e.activeUnit, target);
    assert.equal(e.isTacticsControlled(target), true); assert.equal(target.tacticsControl.remainingTurns, 0);
    e.setPaused(true); e.startTurn(); assert.equal(e.isTacticsControlled(target), true);
    e.setPaused(false); e.startTurn(); stopTimers(e); assert.equal(e.activeUnit, actor); assert.equal(e.isTacticsControlled(target), false);
    e.turnQueue = [{ unit: target, type: targetSide }]; e.startTurn(); stopTimers(e);
    assert.equal(e.activeUnit, target); assert.equal(e.actionPhase, 'move'); assert.ok(e.movementRange.length > 0); assert.equal(e.selectAction('simple'), true);
  });
  test(`${field}/${side}: stale, dead, removed, friendly, empty and scenery targets preserve charge and turn`, () => {
    for (const invalid of ['out-of-range', 'dead', 'removed', 'friendly', 'empty', 'scenery']) {
      const { e, actor, target, ally, y } = make(field, side); assert.equal(e.selectAction('special'), true);
      const old = { gridX: target.gridX, gridY: target.gridY, surfaceId: target.surfaceId }, before = e.turnsElapsed;
      let destination = old;
      if (invalid === 'out-of-range') place(e, actor, 0, 0);
      if (invalid === 'dead') target.currentHp = 0;
      if (invalid === 'removed') (side === 'hero' ? e.enemies : e.heroes).splice(0, 1);
      if (invalid === 'friendly') destination = ally;
      if (invalid === 'empty' || invalid === 'scenery') {
        place(e, target, 6, y);
        if (invalid === 'scenery') e.obstacles.push({ id: 'fixture-device', gridX: old.gridX, gridY: old.gridY, surfaceId: old.surfaceId, hp: 100, maxHp: 100, type: 'objective' });
      }
      assert.equal(click(e, destination).handled, false, invalid); assert.equal(actor.specialCharge, 100, invalid); assert.equal(e.turnsElapsed, before, invalid);
      assert.equal(e.isTacticsControlled(target), false, invalid); assert.equal(e.movementSpent, 0, invalid);
      if (invalid === 'removed' || invalid === 'dead') assert.deepEqual(e.applyProfiledAttack(actor, target, 'special', 99999, null, side), [], invalid);
    }
  });
  test(`${field}/${side}: paused contact has no effect or charge and resumes through the real command`, () => {
    const { e, actor, target } = make(field, side); assert.equal(e.selectAction('special'), true); const turns = e.turnsElapsed;
    e.setPaused(true); assert.equal(click(e, target).handled, false); assert.deepEqual(e.applyProfiledAttack(actor, target, 'special', 9999, null, side), []);
    assert.equal(actor.specialCharge, 100); assert.equal(e.turnsElapsed, turns); assert.equal(e.isTacticsControlled(target), false);
    e.setPaused(false); assert.equal(click(e, target).handled, true); assert.equal(actor.specialCharge, 0); assert.equal(e.isTacticsControlled(target), true);
  });
  test(`${field}/${side}: secondary control uses its real cooldown and rejects boss, immune, invulnerable or already bound bodies`, () => {
    for (const reason of ['valid', 'boss', 'immune', 'invulnerable', 'already-controlled']) {
      const { e, actor, target } = make(field, side); actor.specialCharge = 47;
      if (reason === 'boss') target.isBoss = true;
      if (reason === 'immune') target.controlImmune = true;
      if (reason === 'invulnerable') target.invulnerable = 1;
      if (reason === 'already-controlled') assert.equal(e.applyProfiledAttack(actor, target, 'special', 99999, null, side).length, 1);
      const before = e.turnsElapsed, hp = target.currentHp, status = JSON.stringify(target.tacticsControl);
      assert.equal(e.selectAction('secondary'), true); const accepted = click(e, target).handled;
      assert.equal(target.currentHp, hp); assert.equal(accepted, reason === 'valid');
      if (accepted) { assert.equal(actor.specialCharge, 72); assert.equal(actor.cooldown, 8 * 60); assert.equal(target.tacticsControl.remainingTurns, 1); assert.equal(e.turnsElapsed, before + 1); }
      else { assert.equal(actor.specialCharge, 47); assert.equal(actor.cooldown, 0); assert.equal(e.turnsElapsed, before); assert.equal(JSON.stringify(target.tacticsControl), status); }
    }
  });
  test(`${field}/${side}: a contact on the active victim interrupts its current turn and invalidates pending AI`, () => {
    const { e, actor, target } = make(field, side), targetSide = side === 'hero' ? 'enemy' : 'hero';
    turn(e, target, targetSide); target.specialCharge = 100; assert.equal(e.selectAction('special'), true);
    const before = e.turnsElapsed, position = [target.gridX, target.gridY, target.surfaceId], hp = actor.currentHp;
    assert.equal(e.applyProfiledAttack(actor, target, 'special', 99999, null, side).length, 1); stopTimers(e);
    assert.equal(e.turnsElapsed, before + 1); assert.equal(e.actionPhase, 'end'); assert.equal(e.selectedAction, null);
    assert.equal(e.isTacticsControlled(target), true); assert.equal(target.tacticsControl.remainingTurns, 0);
    e.runEnemyAI(); e.runHeroAI(); assert.deepEqual([target.gridX, target.gridY, target.surfaceId], position); assert.equal(actor.currentHp, hp);
    assert.equal(target.specialCharge, 100); assert.equal(e.selectAction('simple'), false);
  });
}

for (const side of ['hero', 'enemy']) test(`vertical/${side}: opaque slabs and real 3D range reject Phaselock without taking charge`, () => {
  const { e, actor, target } = make('nexus_skybridge', side);
  place(e, actor, 4, 3); place(e, target, 4, 3, 'bridge'); turn(e, actor, side); assert.equal(e.selectAction('special'), true);
  const before = e.turnsElapsed; assert.equal(e.canAttackCell(actor, target, 'special'), false); assert.equal(click(e, target).handled, false);
  assert.deepEqual(e.applyProfiledAttack(actor, target, 'special', 99999, null, side), []); assert.equal(actor.specialCharge, 100); assert.equal(e.turnsElapsed, before);
  place(e, actor, 0, 6); place(e, target, 7, 3, 'bridge'); assert.equal(e.canAttackCell(actor, target, 'special'), false);
  assert.equal(click(e, target).handled, false); assert.equal(actor.specialCharge, 100); assert.equal(e.isTacticsControlled(target), false);
});

for (const side of ['hero', 'enemy']) test(`vertical/${side}: lethal damage ends Phaselock before real revival without removing independent statuses`, () => {
  const { e, actor, target, bystander, y } = make('nexus_skybridge', side), targetSide = side === 'hero' ? 'enemy' : 'hero';
  place(e, bystander, 4, y);
  bystander.secondary = { name: 'Fixture return', type: 'revive', dmg: 0, cd: 4,
    targeting: { effect: 'revive', targetSide: 'ally', delivery: 'support', shape: 'single', range: 760, reviveRatio: .3 } };
  target.tacticsGuardTicks = 90; target.tacticsGuardReduce = .3; target.tacticsBuffTicks = 80; target.statusEffects.glitched = 77;
  assert.equal(e.applyProfiledAttack(actor, target, 'special', 0, null, side).length, 1); assert.equal(e.isTacticsControlled(target), true);
  const costs = [actor.specialCharge, actor.cooldown, bystander.specialCharge, bystander.cooldown], turns = e.turnsElapsed;
  e.applyDamage(actor, target, target.maxHp * 100, null, { ignoreCover: true });
  assert.equal(target.currentHp, 0); assert.equal(target.tacticsControl, undefined, 'Death must discard the bind immediately, before startTurn');
  const revived = e.applyProfiledAttack(bystander, target, 'secondary', 0, null, targetSide);
  assert.equal(revived.length, 1); assert.equal(target.currentHp, Math.round(target.maxHp * .3));
  assert.equal(target.tacticsControl, undefined); assert.equal(e.isTacticsControlled(target), false); assert.equal(target.state, 'idle');
  assert.equal(target.tacticsGuardTicks, 90); assert.equal(target.tacticsBuffTicks, 80); assert.equal(target.statusEffects.glitched, 77);
  assert.deepEqual([actor.specialCharge, actor.cooldown, bystander.specialCharge, bystander.cooldown], costs); assert.equal(e.turnsElapsed, turns);
});

for (const side of ['hero', 'enemy']) for (const slot of ['secondary', 'special']) test(`vertical/${side}: real Maya AI ${slot} pays the authored cost and restrains its opposing body`, () => {
  const { e, actor, target } = make('nexus_skybridge', side);
  actor.specialCharge = slot === 'special' ? 100 : 20; actor.cooldown = 0; e.movementBudget = 0;
  const impact = [], apply = e.applyProfiledAttack.bind(e), beforeHp = [...e.heroes, ...e.enemies].map(unit => unit.currentHp), turns = e.turnsElapsed;
  e.applyProfiledAttack = (source, target, action, ...args) => {
    if (source === actor) impact.push({ action, cooldown: actor.cooldown, charge: actor.specialCharge });
    return apply(source, target, action, ...args);
  };
  if (side === 'hero') e.runHeroAI(); else e.runEnemyAI();
  for (let frames = 0; e.turnsElapsed === turns && frames < 150; frames++) e.update();
  stopTimers(e); assert.equal(e.turnsElapsed, turns + 1); assert.equal(impact.length, 1); assert.equal(impact[0].action, slot);
  assert.equal(impact[0].cooldown, slot === 'secondary' ? 480 : 0); assert.equal(actor.specialCharge, slot === 'special' ? 0 : 45);
  assert.equal(e.isTacticsControlled(target), true); assert.deepEqual([...e.heroes, ...e.enemies].map(unit => unit.currentHp), beforeHp);
});

for (const side of ['hero', 'enemy']) test(`vertical/${side}: conventional AI retains its prior damage action and resource rules`, () => {
  const { e, actor, target } = make('nexus_skybridge', side);
  Object.assign(actor, fixture('conventional-ai-' + side)); actor.specialCharge = 20; actor.cooldown = 0; e.movementBudget = 0;
  const impacts = [], apply = e.applyProfiledAttack.bind(e), hp = target.currentHp, turns = e.turnsElapsed;
  e.applyProfiledAttack = (source, target, action, ...args) => {
    if (source === actor) impacts.push({ action, cooldown: actor.cooldown });
    return apply(source, target, action, ...args);
  };
  if (side === 'hero') e.runHeroAI(); else e.runEnemyAI();
  for (let frames = 0; e.turnsElapsed === turns && frames < 150; frames++) e.update();
  stopTimers(e); assert.equal(e.turnsElapsed, turns + 1); assert.equal(impacts.length, 1);
  assert.equal(impacts[0].action, side === 'hero' ? 'secondary' : 'enemy'); assert.equal(impacts[0].cooldown, side === 'hero' ? 180 : 0);
  assert.equal(actor.specialCharge, 35); assert.ok(target.currentHp < hp); assert.equal(e.isTacticsControlled(target), false);
});

test('vertical Phaselock interrupts a real in-progress route at an actual support and never fires its old completion', () => {
  const { e, actor, target } = make('nexus_skybridge', 'hero');
  place(e, actor, 1, 5); turn(e, target, 'enemy'); const start = target.surfaceId;
  const result = e.handleCellClick(4, 5, 'ground:4:5'); assert.equal(result.handled, true); assert.ok(target.terrainMotion);
  let staleCompletions = 0; const old = target.terrainMotion.onComplete; target.terrainMotion.onComplete = () => { staleCompletions++; old?.(); };
  const spent = e.movementSpent; assert.equal(e.applyProfiledAttack(actor, target, 'special', 99999, null, 'hero').length, 1); stopTimers(e);
  assert.equal(target.terrainMotion, undefined); assert.equal(target.terrainRenderPosition, undefined); assert.equal(target.surfaceId, start);
  for (let i = 0; i < 100; i++) e.update(); assert.equal(staleCompletions, 0); assert.equal(e.movementSpent, spent); assert.equal(target.surfaceId, start);
});

test('Phaselock is an opt-in Maya control; conventional fixture damage keeps its normal combat profile', () => {
  const { e, target } = make('training_grid', 'hero'); e.normalizeEnemyActions(target);
  const p = resolveCombatAbility(fixture('conventional-profile'), 'special');
  assert.equal(p.effect, 'damage'); assert.notEqual(e.getAttackProfile(target, 'special').delivery, 'control'); assert.ok(e.getActionBaseDamage(target, 'special') > 0);
});

test('the held-body marker draws finite geometry at the actual support without changing control, HP or coordinates', () => {
  const unit = { currentHp: 100, x: 200, y: 180, surfaceId: 'ground:4:5', tacticsControl: { kind: 'phaselock', remainingTurns: 1, releasePending: false } };
  const before = structuredClone(unit), ellipses = [], stack = [];
  const ctx = { globalAlpha: 1, save() { stack.push(this.globalAlpha); }, restore() { this.globalAlpha = stack.pop(); },
    beginPath() {}, stroke() {}, ellipse(...args) { assert.ok(args.every(Number.isFinite)); ellipses.push(args); } };
  assert.equal(drawTacticsPhaselock(ctx, unit, 72), true); assert.equal(ellipses.length, 2);
  assert.equal(ellipses[0][0], unit.x); assert.equal(ellipses[0][1], unit.y - 72 * 0.45);
  assert.deepEqual(unit, before); assert.equal(stack.length, 0); assert.equal(ctx.globalAlpha, 1);
  delete unit.tacticsControl; assert.equal(drawTacticsPhaselock(ctx, unit, 72), false); assert.equal(ellipses.length, 2);
});
