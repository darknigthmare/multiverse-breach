import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

let vite, EngineRpg, HEROES_DB, getRpgActionProfile;
const engines = [], noop = () => {};
const fixture = id => ({ id, name: id, universe: 'Control regression fixture', category: 'test', weaponType: 'sword',
  stats: { hp: 5000, atk: 30, def: 10, spd: 1 }, simple: { name: 'Fixture attack', type: 'melee', dmg: 1 },
  secondary: { name: 'Fixture technique', type: 'bullet', dmg: 1.2 },
  defense: { name: 'Fixture guard', type: 'shield', reduce: .5, dur: 2 },
  special: { name: 'Fixture special', type: 'bullet', dmg: 2 } });
const source = () => HEROES_DB.find(hero => hero.id === 'borderlands_2_maya_phaselock');
const tick = (engine, count = 1) => { for (let n = 0; n < count; n++) engine.update(); };
const make = (side = 'player') => {
  const engine = new EngineRpg(760, 420,
    side === 'player' ? [source(), fixture('player-ally')] : [fixture('player-one'), fixture('player-two')],
    { customRoster: side === 'enemy' ? [source(), fixture('enemy-ally')] : [fixture('enemy-one'), fixture('enemy-two')], monsters: [], bosses: [] },
    { add: noop }, noop, noop,
    { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engine.autoBattle = false; engine.enemyGlobalRecovery = 0;
  for (const actor of [...engine.heroes, ...engine.enemies]) { actor.atb = 100; actor.specialCharge = 100; }
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const target = side === 'player' ? engine.enemies[0] : engine.heroes[0];
  actor.x = actor.homeX = 200; actor.y = actor.homeY = 230;
  target.x = target.homeX = 450; target.y = target.homeY = 230;
  const profile = getRpgActionProfile(actor, 'special', side, engine);
  engines.push(engine); return { engine, actor, target, profile, side };
};
const cast = ({ engine, actor, target, side }) => {
  assert.equal(engine.beginTargeting(actor, 'special', side), true);
  assert.equal(engine.selectTarget(target.battleId), true);
  assert.equal(engine.confirmTargeting(), true);
  let remaining = 120;
  while (actor.actionPending && remaining-- > 0) engine.update();
  assert.equal(actor.actionPending, false);
};
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?control-w15'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js?control-w15'));
  ({ getRpgActionProfile } = await vite.ssrLoadModule('/src/game/rpgTargeting.js?control-w15'));
});
after(async () => { engines.forEach(engine => engine.dispose()); await vite?.close(); });

test('RPG Phaselock selects one enemy and carries bounded zero-damage control semantics', () => {
  const { engine, actor, target, profile } = make();
  assert.equal(profile.effect, 'control'); assert.equal(profile.delivery, 'control');
  assert.equal(profile.targetSide, 'enemy'); assert.equal(profile.shape, 'single');
  assert.equal(profile.multiplier, 0); assert.equal(profile.controlDuration, 2.4);
  assert.equal(profile.range, 480); assert.equal(profile.minTargets, 1); assert.equal(profile.maxTargets, 1);
  const context = engine.getActionContext(actor, 'special');
  assert.ok(context.eligibleTargets.includes(target)); assert.ok(!context.eligibleTargets.includes(engine.heroes[1]));
});
for (const side of ['player', 'enemy']) test(`RPG ${side} Phaselock spends a confirmed cast and restrains only its live enemy`, () => {
  const state = make(side), { engine, actor, target } = state;
  const before = [...engine.heroes, ...engine.enemies].map(unit => ({ unit, hp: unit.currentHp, guard: unit.rpgGuardTicks, buff: unit.rpgBuffTicks }));
  cast(state);
  assert.equal(actor.specialCharge, 0); assert.ok(actor.atb < 100);
  assert.ok(target.rpgControlTicks > 0 && target.rpgControlTicks <= 144); assert.equal(target.state, 'hit');
  assert.equal(engine.canUseAction(target, 'simple', side === 'player' ? 'enemy' : 'player'), false);
  for (const row of before) {
    assert.equal(row.unit.currentHp, row.hp); assert.equal(row.unit.rpgGuardTicks, row.guard); assert.equal(row.unit.rpgBuffTicks, row.buff);
    if (row.unit !== target) assert.ok(!row.unit.rpgControlTicks);
  }
});
test('RPG Phaselock freezes ATB, expires on simulation ticks and leaves no delayed cast after release', () => {
  const { engine, actor, target, profile } = make();
  // Queue a real opponent attack before applying the accepted control impact.
  assert.equal(engine.executeRpgAction(engine.getActionContext(target, 'simple', 'enemy'), [actor.battleId]), true);
  assert.equal(target.actionPending, true);
  const hp = actor.currentHp;
  engine.applyRpgImpact(actor, profile, [target], '#aa80ff', 'special');
  assert.equal(target.actionPending, false); assert.equal(engine.enemyActionLock, false);
  const atb = target.atb, remaining = target.rpgControlTicks;
  tick(engine, remaining - 1); assert.equal(target.atb, atb); assert.equal(target.rpgControlTicks, 1);
  assert.equal(actor.currentHp, hp);
  tick(engine); assert.equal(target.rpgControlTicks, 0); assert.equal(target.rpgControlSource, null); assert.equal(target.state, 'idle');
  tick(engine, 40); assert.equal(actor.currentHp, hp); assert.ok(target.atb > atb);
});
test('RPG pause and manual target selection freeze the control clock', () => {
  const { engine, actor, target, profile } = make();
  engine.applyRpgImpact(actor, profile, [target], '#aa80ff', 'special');
  const remaining = target.rpgControlTicks;
  engine.setPaused(true); tick(engine, 80); assert.equal(target.rpgControlTicks, remaining);
  engine.setPaused(false); assert.equal(engine.beginTargeting(engine.heroes[1], 'simple'), true);
  tick(engine, 80); assert.equal(target.rpgControlTicks, remaining);
  engine.cancelTargeting(); tick(engine); assert.equal(target.rpgControlTicks, remaining - 1);
});
test('RPG an accepted control cancels its victim’s active target selector', () => {
  const { engine, actor, target, profile } = make('enemy');
  engine.setTargetingWait(false);
  assert.equal(engine.beginTargeting(target, 'simple', 'player'), true);
  assert.equal(engine.targeting.actor, target);
  engine.applyRpgImpact(actor, profile, [target], '#aa80ff', 'special');
  assert.equal(engine.targeting, null); assert.equal(engine.confirmTargeting(), false);
  assert.ok(target.rpgControlTicks > 0);
});
for (const side of ['player', 'enemy']) test(`RPG ${side} secondary Phaselock keeps its shorter duration and real cooldown`, () => {
  const { engine, actor, target } = make(side);
  const context = engine.getActionContext(actor, 'secondary', side);
  assert.equal(context.profile.controlDuration, 1.2); assert.equal(context.profile.multiplier, 0);
  assert.equal(engine.executeRpgAction(context, [target.battleId]), true);
  assert.equal(actor.cooldown, 480);
  while (actor.actionPending) engine.update();
  assert.ok(target.rpgControlTicks > 0 && target.rpgControlTicks <= 72);
  actor.state = 'idle'; actor.stateTimer = 0; actor.atb = 100;
  assert.equal(engine.canUseAction(actor, 'secondary', side), false);
});
test('RPG rejects dead, boss, immune, invulnerable, already controlled and out-of-range targets without spending', () => {
  for (const mutate of [
    target => { target.currentHp = 0; }, target => { target.isBoss = true; },
    target => { target.controlImmune = true; }, target => { target.invulnerable = 1; },
    target => { target.rpgControlTicks = 60; }, target => { target.x = 700; }
  ]) {
    const { engine, actor, target } = make();
    const other = engine.enemies[1]; other.x = 759; other.y = 419;
    mutate(target); const before = { atb: actor.atb, charge: actor.specialCharge, cooldown: actor.cooldown };
    assert.equal(engine.getActionContext(actor, 'special').eligibleTargets.length, 0);
    assert.equal(engine.beginTargeting(actor, 'special'), false);
    assert.deepEqual({ atb: actor.atb, charge: actor.specialCharge, cooldown: actor.cooldown }, before);
  }
});
test('RPG control revalidates the accepted target at impact without acquiring a replacement', () => {
  for (const mutate of [target => { target.x = 750; }, target => { target.currentHp = 0; }, target => { target.controlImmune = true; }]) {
    const { engine, actor, target, profile } = make(); const other = engine.enemies[1];
    mutate(target); engine.applyRpgImpact(actor, profile, [target], '#aa80ff', 'special');
    assert.ok(!target.rpgControlTicks); assert.ok(!other.rpgControlTicks);
  }
});
test('RPG control does not cancel or overwrite independent guard, buff and item shield resources', () => {
  const { engine, actor, target, profile } = make();
  target.rpgGuardTicks = 77; target.rpgGuardReduce = .4; target.rpgBuffTicks = 88; target.rpgBuffMultiplier = 1.4;
  target.battleItemShield = 51; const hp = target.currentHp;
  engine.applyRpgImpact(actor, profile, [target], '#aa80ff', 'special');
  assert.equal(target.currentHp, hp); assert.equal(target.rpgGuardTicks, 77); assert.equal(target.rpgGuardReduce, .4);
  assert.equal(target.rpgBuffTicks, 88); assert.equal(target.rpgBuffMultiplier, 1.4); assert.equal(target.battleItemShield, 51);
});
test('RPG death ends Phaselock and a later revival cannot restore the old bind', () => {
  const { engine, actor, target, profile } = make();
  engine.applyRpgImpact(actor, profile, [target], '#aa80ff', 'special');
  assert.ok(target.rpgControlTicks > 0);
  engine.applyDamage(actor, target, target.maxHp * 100);
  assert.equal(target.currentHp, 0); assert.equal(target.rpgControlTicks, 0); assert.equal(target.rpgControlSource, null);
  engine.applyRpgImpact(engine.enemies[1], { effect: 'revive', delivery: 'support', multiplier: 0, reviveRatio: .3 }, [target], '#66ff99', 'special');
  assert.ok(target.currentHp > 0); assert.equal(target.rpgControlTicks, 0); assert.equal(target.state, 'idle');
});
test('RPG Phaselock projects a paused-safe lifted ring without changing ground coordinates', () => {
  const { engine, actor, target, profile } = make();
  engine.applyRpgImpact(actor, profile, [target], '#aa80ff', 'special');
  const original = JSON.stringify(target), calls = [], stack = [];
  const ctx = new Proxy({ globalAlpha: .8 }, { get(object, key) {
    if (key in object) return object[key];
    if (key === 'save') return () => stack.push(object.globalAlpha);
    if (key === 'restore') return () => { object.globalAlpha = stack.pop(); };
    return (...args) => calls.push([key, ...args]);
  }, set(object, key, value) { object[key] = value; return true; } });
  assert.equal(engine.drawRpgControl(ctx, target, 72, 16), true);
  assert.equal(calls.filter(row => row[0] === 'ellipse').length, 2); assert.equal(ctx.globalAlpha, .8);
  assert.equal(stack.length, 0); assert.equal(JSON.stringify(target), original);
});
