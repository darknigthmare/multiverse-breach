import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { isPhaselockProfile, canPhaselockTarget, applyPhaselockControl, tickCombatControl, isCombatControlled } from '../src/game/combat/combatControlWave15.js';
let vite, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, tickMeleeCombatActor, beginMeleeAction;
const engines = [], noop = () => {};
const dummy = id => ({ id, name: id, universe: 'W15 control fixtures', weaponType: 'fists',
  stats: { hp: 1000, atk: 12, def: 8, spd: 5 }, simple: { name: 'Fixture strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Fixture technique', type: 'melee', dmg: 1 }, defense: { name: 'Fixture guard', type: 'shield', reduce: .5 }, special: { name: 'Fixture super', type: 'melee', dmg: 2 } });
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ tickMeleeCombatActor, beginMeleeAction } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });
function fixture(mode, side) {
  const maya = heroes.find(hero => hero.id === 'borderlands_2_maya_phaselock'); assert.ok(maya);
  const own = [maya], enemies = [dummy('bound-target'), dummy('late-target')];
  const players = side === 'player' ? own : enemies, opponents = side === 'player' ? enemies : own;
  const engine = mode === 'fighter'
    ? new EngineFighter(1200, 500, players, opponents, { add: noop }, noop, noop, { opponentControl: 'p2' })
    : new EngineSmash(1200, 500, players, { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, noop, noop,
      { universe: 'Nexus de Convergence', mode: 'Smash', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine);
  if (mode === 'fighter') { engine.countdown = 0; engine.presentation = null; }
  else engine.syncPreMatchFromServer(3000);
  const ownSide = side === 'player' ? 'player' : 'cpu', opposite = ownSide === 'player' ? 'cpu' : 'player';
  const actor = mode === 'fighter' ? engine.getActive(ownSide) : (side === 'player' ? engine.heroes : engine.enemies)[0];
  const targets = mode === 'fighter' ? engine.getTeam(opposite).fighters : side === 'player' ? engine.enemies : engine.heroes;
  const facing = side === 'player' ? 1 : -1;
  for (const unit of [actor, ...targets]) { unit.currentHp = unit.maxHp = 1000; unit.y = engine.groundY; unit.vx = unit.vy = 0; unit.action = null; unit.state = 'idle'; unit.isBoss = false; }
  actor.x = facing > 0 ? 300 : 900; actor.facing = facing; actor.specialCharge = actor.meter = 100;
  targets.forEach((target, index) => { target.x = actor.x + facing * (100 + index * 500); target.facing = -facing; });
  return { mode, side, ownSide, opposite, actor, targets, target: targets[0], engine, facing, profile: resolveMeleeSuper(actor) };
}
const commit = c => c.mode === 'fighter' ? c.engine.triggerSideAction(c.ownSide, 'super') : c.engine.triggerMeleeSuper(c.actor);
const meter = c => c.mode === 'fighter' ? c.actor.meter : c.actor.specialCharge;
function advance(c, seconds, { physics = true } = {}) {
  for (let elapsed = 0; elapsed < seconds - 1e-9;) {
    const dt = Math.min(1 / 60, seconds - elapsed);
    if (c.mode === 'fighter') {
      c.engine.updatePassive(dt); c.engine.updateActions(dt); c.engine.updateProjectiles(dt);
      if (physics) for (const actor of [c.actor, ...c.targets]) c.engine.applyPhysics(actor, dt);
    } else {
      for (const actor of [c.actor, ...c.targets]) tickMeleeCombatActor(actor, dt, { resolveActionHit: (source, action) => c.engine.resolveMeleeActionHit(source, action) });
      if (physics) for (const actor of [c.actor, ...c.targets]) { actor.vy += c.engine.gravity * dt * 60; c.engine.applyPhysics(actor); }
    }
    elapsed += dt;
  }
}

test('W15 Phaselock admits only Maya control/control enemy single0dmg and keeps range/opaque-floor geometry', () => {
  const c = fixture('melee', 'player');
  assert.equal(c.profile.effect, 'control'); assert.equal(c.profile.delivery, 'control'); assert.equal(c.profile.targetSide, 'enemy');
  assert.equal(c.profile.shape, 'single'); assert.equal(c.profile.multiplier, 0); assert.equal(c.profile.range, 480);
  assert.equal(c.profile.controlKind, 'phaselock'); assert.equal(c.profile.controlDuration, 2.4); assert.equal(c.profile.controlTurns, 1);
  assert.equal(isPhaselockProfile(c.profile), true);
  for (const change of [{ sourceHeroId: 'other' }, { universe: 'other' }, { effect: 'guard' }, { multiplier: 1 }, { shape: 'group' }, { targetSide: 'ally' }])
    assert.equal(isPhaselockProfile({ ...c.profile, ...change }), false);
  assert.equal(canPhaselockTarget(c.actor, c.target, c.profile), true);
  const slab = { x1: c.actor.x + 20, x2: c.target.x - 20, y: c.actor.y - 32, thickness: 8 };
  assert.equal(canPhaselockTarget(c.actor, c.target, c.profile, { platforms: [slab] }), false);
  assert.equal(canPhaselockTarget(c.actor, c.target, c.profile, { platforms: [{ ...slab, lineOfSightTransparent: true }] }), true);
});

for (const mode of ['melee', 'fighter']) for (const side of ['player', 'opponent']) {
  test(`W15 ${mode} ${side}: rejected dead/immune/boss/invulnerable/out-of-range target keeps full meter`, () => {
    for (const reason of ['dead', 'boss', 'immune', 'invulnerable', 'range']) {
      const c = fixture(mode, side);
      if (reason === 'dead') c.target.currentHp = 0;
      if (reason === 'boss') c.target.isBoss = true;
      if (reason === 'immune') c.target.controlImmune = true;
      if (reason === 'invulnerable') c.target.invulnerable = 1;
      if (reason === 'range') c.target.x = c.actor.x + c.facing * 481;
      c.targets.slice(1).forEach(target => { target.x = c.actor.x + c.facing * 800; });
      assert.equal(commit(c), false, reason); assert.equal(meter(c), 100); assert.equal(c.actor.action, null);
      assert.equal(Boolean(c.target.combatControl), false);
    }
  });
  test(`W15 ${mode} ${side}: one accepted bind cancels windup, suspends movement and actions, expires on simulation time with no damage or protective buff`, () => {
    const c = fixture(mode, side), { target, actor, engine } = c;
    target.battleItemShield = 333; target.guard = 53; target.guardMeter = 53;
    target.superBuffSeconds = 10; target.superGuardSeconds = 10;
    target.meleeSuperSupport = { effect: 'buff', remaining: 10, buffMultiplier: 1.2 };
    target.action = { id: 'light1', type: 'light', duration: 1.2, hitAt: .75, elapsed: 0, hitApplied: false, resolved: false, base: 20, range: 160, guardDamage: 0, knockback: 0, facing: -c.facing };
    const hp = [actor.currentHp, target.currentHp], initialY = target.y;
    assert.equal(commit(c), true); assert.equal(meter(c), 0); assert.equal(commit(c), false);
    advance(c, .3); assert.equal(isCombatControlled(target), false); assert.deepEqual([actor.currentHp, target.currentHp], hp);
    advance(c, .2); assert.equal(isCombatControlled(target), true); assert.ok(target.y < initialY);
    assert.equal(target.action, null); assert.equal(target.battleItemShield, 333);
    assert.ok(target.superBuffSeconds > 0 && target.superGuardSeconds > 0); assert.ok(target.meleeSuperSupport.remaining > 0);
    assert.equal(actor.superGuardSeconds || 0, 0); assert.equal(actor.meleeSuperSupport, undefined);
    const hold = { x: target.x, y: target.y, remaining: target.combatControl.remaining };
    const frozen = JSON.stringify({ actor, target, projectiles: engine.projectiles });
    for (let index = 0; index < 40; index++) {
      if (mode === 'fighter') { engine.updatePassive(0); engine.updateActions(0); engine.updateProjectiles(0); }
      else for (const unit of [actor, target]) tickMeleeCombatActor(unit, 0, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
    }
    assert.equal(JSON.stringify({ actor, target, projectiles: engine.projectiles }), frozen, 'zero simulation time preserves status and pending actions');
    target.vx = c.facing * 100; target.vy = -100;
    if (mode === 'fighter') { assert.equal(engine.tryAction(c.opposite, 'light'), false); assert.equal(engine.tryJump(target), false); engine.applyPhysics(target, 1 / 60); }
    else { assert.equal(beginMeleeAction(target, 'light1'), false); engine.applyPhysics(target); }
    assert.equal(target.x, hold.x); assert.equal(target.y, hold.y); assert.equal(target.vx, 0); assert.equal(target.vy, 0);
    advance(c, 1); assert.deepEqual([actor.currentHp, target.currentHp], hp, 'cancelled attack never fires after its old hitAt');
    assert.equal(isCombatControlled(target), true); assert.equal(target.battleItemShield, 333);
    advance(c, 1.5); assert.equal(isCombatControlled(target), false); assert.equal(target.combatControl, null);
    assert.deepEqual([actor.currentHp, target.currentHp], hp); assert.equal(target.battleItemShield, 333);
    advance(c, 1.2); assert.deepEqual([actor.currentHp, target.currentHp], hp, 'release never resurrects the cancelled attack');
    if (mode === 'fighter') assert.equal(engine.canAct(target), true);
    else assert.equal(beginMeleeAction(target, 'light1'), true);
  });
  test(`W15 ${mode} ${side}: a moved/dead/newly immune committed target is revalidated without acquiring a late target`, () => {
    for (const reason of ['range', 'dead', 'immune']) {
      const c = fixture(mode, side); assert.equal(commit(c), true); assert.equal(meter(c), 0);
      if (reason === 'range') c.target.x = c.actor.x + c.facing * 800;
      if (reason === 'dead') c.target.currentHp = 0;
      if (reason === 'immune') c.target.controlImmune = true;
      if (c.targets[1]) c.targets[1].x = c.actor.x + c.facing * 80;
      advance(c, .5, { physics: false });
      assert.equal(isCombatControlled(c.target), false); assert.equal(isCombatControlled(c.targets[1]), false);
      assert.equal(c.actor.action?.visualConfirmedContact, undefined); assert.equal(meter(c), 0);
    }
  });
}

test('W15 Melee Phaselock rechecks a newly occluding floor before impact and keeps the accepted action target', () => {
  const c = fixture('melee', 'player'); assert.equal(commit(c), true);
  c.target.y -= 240; c.engine.platforms.push({ x1: c.actor.x - 10, x2: c.target.x + 10, y: c.actor.y - 120, thickness: 12 });
  advance(c, .5, { physics: false });
  assert.equal(isCombatControlled(c.target), false); assert.equal(c.actor.action?.visualConfirmedContact, undefined);
});

test('W15 controlled death clears only the bind and never revives or consumes a shield', () => {
  const c = fixture('fighter', 'player'); assert.equal(applyPhaselockControl(c.target, c.profile, c.actor), true);
  c.target.battleItemShield = 333; c.target.currentHp = 0; tickCombatControl(c.target, 1 / 60);
  assert.equal(c.target.combatControl, null); assert.equal(c.target.currentHp, 0); assert.equal(c.target.battleItemShield, 333);
});

for (const mode of ['melee', 'fighter']) for (const side of ['player', 'opponent']) test(`W15 ${mode} ${side}: secondary bind validates before cooldown and releases after1.2 simulation seconds`, () => {
  const c = fixture(mode, side), { actor, target } = c;
  const secondary = () => mode === 'fighter' ? c.engine.triggerSideAction(c.ownSide, 'heavy') : c.engine.triggerAuthoredMeleeAbility(actor, 'secondary');
  target.x = actor.x + c.facing * 700;
  assert.equal(secondary(), false); assert.equal(meter(c), 100);
  assert.equal(mode === 'fighter' ? actor.abilityCooldowns.secondary : actor.cooldown || 0, 0);
  target.x = actor.x + c.facing * 100;
  assert.equal(secondary(), true); assert.equal(meter(c), 100);
  assert.ok((mode === 'fighter' ? actor.abilityCooldowns.secondary : actor.cooldown) > 0);
  advance(c, .7); assert.equal(isCombatControlled(target), true);
  assert.equal(target.combatControl.duration, 1.2); assert.equal(target.currentHp, 1000);
  advance(c, 1.3); assert.equal(isCombatControlled(target), false); assert.equal(target.currentHp, 1000);
});

for (const mode of ['melee', 'fighter']) test(`W15 ${mode}: actual lethal damage clears Phaselock before any later revival`, () => {
  const c = fixture(mode, 'player'); assert.equal(applyPhaselockControl(c.target, c.profile, c.actor), true);
  if (mode === 'fighter') c.engine.applyHit(c.actor, c.target, { type: 'heavy', base: 1000000, range: 200, guardDamage: 0, knockback: 0 });
  else c.engine.applyDamage(c.actor, c.target, 1000000, 0);
  assert.equal(c.target.currentHp, 0); assert.equal(c.target.combatControl, null);
  c.target.currentHp = 1000; c.target.state = 'idle';
  assert.equal(isCombatControlled(c.target), false); const x = c.target.x;
  c.target.vx = 10; if (mode === 'fighter') c.engine.applyPhysics(c.target, .1); else c.engine.applyPhysics(c.target);
  assert.notEqual(c.target.x, x, 'a revived actor was rebound by stale control state');
});
