import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { getCombatEventDamageMultiplier, getCombatEventSpeedMultiplier } from '../src/game/combatEventBuffs.js';
import { applyMeleeHitStun } from '../src/game/melee/meleeCombatRuntime.js';

let vite;
let engineTypes;
const engines = [];
const noop = () => {};
const makeEngine = mode => {
  const hero = {
    id: 'effect-hero', name: 'Effect Hero', category: 'effect-test', universe: 'Nexus de Convergence',
    stats: { hp: 1000, atk: 100, def: 0, spd: 5 },
    simple: { name: 'Strike', type: 'melee', dmg: 1 },
    secondary: { name: 'Shot', type: 'bullet', dmg: 1.5, cd: 3 },
    defense: { name: 'Guard', reduce: 0.4, dur: 2 }, special: { name: 'Burst', dmg: 2 }
  };
  const enemy = { id: 'effect-enemy', name: 'Effect Enemy', hp: 10000, atk: 10, def: 0, spd: 1, weapon: 'melee' };
  const calls = [];
  const engine = new engineTypes[mode](760, 420, [hero], { monsters: [enemy], bosses: [], customRoster: [enemy] },
    { add: (...args) => calls.push(args) }, noop, noop,
    { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engine.particleCalls = calls;
  if (mode === 'Smash') engine.syncPreMatchFromServer(3000);
  engines.push(engine);
  return engine;
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  const [{ EngineRpg }, { EngineTactics }, { EngineSmash }] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineRpg.js'), vite.ssrLoadModule('/src/game/engineTactics.js'), vite.ssrLoadModule('/src/game/engineSmash.js')
  ]);
  engineTypes = { RPG: EngineRpg, Tactics: EngineTactics, Smash: EngineSmash };
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });

for (const mode of ['RPG', 'Tactics', 'Smash']) {
  test(`${mode} squad healing never damages an irradiated hero already above the healing cap`, () => {
    const engine = makeEngine(mode);
    const hero = engine.heroes[0];
    hero.currentHp = 800;
    hero.statusEffects.radiated = 300;
    engine.triggerCombatEvent('heal_squad');
    assert.equal(hero.currentHp, 800);
    assert.equal(engine.particleCalls.some(call => call[8] === '+150'), false, 'reported healing that was not received');
    hero.currentHp = 480;
    engine.triggerCombatEvent('heal_squad');
    assert.equal(hero.currentHp, 500);
    assert.ok(engine.particleCalls.some(call => call[8] === '+20'));
    hero.statusEffects.radiated = 0;
    engine.triggerCombatEvent('heal_squad');
    assert.equal(hero.currentHp, 650);
    hero.currentHp = 0;
    engine.triggerCombatEvent('heal_squad');
    assert.equal(hero.currentHp, 0, 'squad heal revived a dead hero');
  });
}

for (const mode of ['RPG', 'Tactics', 'Smash']) {
  test(`${mode} trap paralysis lasts the authored five seconds despite its impact and follow-up hits`, () => {
    const engine = makeEngine(mode);
    const enemy = engine.enemies[0];
    engine.triggerCombatEvent('trap_snap');
    assert.equal(enemy.state, 'hit');
    assert.equal(enemy.stateTimer, 300);
    engine.applyDamage(engine.heroes[0], enemy, 10);
    assert.equal(enemy.stateTimer, 300, 'ordinary hit shortened the paralysis');
    for (let frame = 0; frame < 299; frame++) engine.update();
    assert.equal(enemy.state, 'hit');
    assert.equal(enemy.stateTimer, 1);
    engine.update();
    assert.equal(enemy.state, 'idle');
    assert.equal(enemy.stateTimer, 0);
  });
}

test('Tactics paralysis blocks manual movement and AI until recovery', () => {
  const engine = makeEngine('Tactics');
  const enemy = engine.enemies[0];
  engine.triggerCombatEvent('trap_snap');
  engine.activeUnit = enemy;
  engine.activeUnitType = 'enemy';
  engine.actionPhase = 'move';
  engine.calculateMovementRange();
  assert.deepEqual(engine.handleCellClick(enemy.gridX, enemy.gridY), { handled: false, reason: 'stunned' });
  const position = { x: enemy.gridX, y: enemy.gridY };
  engine.runEnemyAI();
  assert.deepEqual({ x: enemy.gridX, y: enemy.gridY }, position);
  assert.equal(enemy.stateTimer, 300);
});

test('Tactics defers an already scheduled action when its active unit is paralyzed', async () => {
  const engine = makeEngine('Tactics');
  const enemy = engine.enemies[0];
  engine.activeUnit = enemy;
  engine.activeUnitType = 'enemy';
  let executed = false;
  engine.schedule(() => { executed = true; }, 1);
  engine.triggerCombatEvent('trap_snap');
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(executed, false);
  for (let frame = 0; frame < 300; frame++) engine.update();
  await new Promise(resolve => setTimeout(resolve, 70));
  assert.equal(executed, true);
});

test('Tactics scheduled transitions continue when a previously paralyzed active unit dies', async () => {
  const engine = makeEngine('Tactics');
  const enemy = engine.enemies[0];
  engine.activeUnit = enemy;
  engine.activeUnitType = 'enemy';
  engine.triggerCombatEvent('trap_snap');
  enemy.currentHp = 0;
  let executed = false;
  engine.schedule(() => { executed = true; }, 1);
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(executed, true);
});

const measureDamage = (engine, mode) => {
  const enemy = engine.enemies[0];
  enemy.currentHp = 1000000;
  enemy.state = 'idle';
  enemy.stateTimer = 0;
  enemy.guarding = false;
  enemy.def = 0;
  if (enemy.stats) enemy.stats.def = 0;
  const random = Math.random;
  Math.random = () => 0.5;
  try {
    if (mode === 'Smash') engine.applyDamage(engine.heroes[0], enemy, 100, 0);
    else if (mode === 'Tactics') engine.applyDamage(engine.heroes[0], enemy, 100, null, { ignoreCover: true });
    else engine.applyDamage(engine.heroes[0], enemy, 100);
    return 1000000 - enemy.currentHp;
  } finally { Math.random = random; }
};

for (const mode of ['RPG', 'Tactics', 'Smash']) {
  for (const [effect, damageScale, speedScale, duration] of [['quad_damage', 2, 1, 600], ['magia_erebea', 1.5, 1.2, 900]]) {
    test(`${mode} ${effect} grants its offensive effect for the authored duration without stat drift or false guard`, () => {
      const engine = makeEngine(mode);
      const hero = engine.heroes[0];
      const stats = structuredClone(hero.stats);
      const baseDamage = measureDamage(engine, mode);
      engine.triggerCombatEvent(effect);
      assert.equal(hero.state, 'idle');
      assert.equal(hero.stateTimer, 0);
      assert.equal(getCombatEventSpeedMultiplier(hero), speedScale);
      assert.equal(measureDamage(engine, mode), baseDamage * damageScale);
      for (let frame = 0; frame < duration - 1; frame++) engine.update();
      assert.equal(hero.combatEventBuffs[effect], 1);
      assert.equal(measureDamage(engine, mode), baseDamage * damageScale);
      engine.update();
      assert.equal(getCombatEventDamageMultiplier(hero), 1);
      assert.equal(getCombatEventSpeedMultiplier(hero), 1);
      assert.equal(measureDamage(engine, mode), baseDamage);
      assert.deepEqual(hero.stats, stats);
    });
  }

  test(`${mode} repeated event power-ups refresh one source and distinct power-ups expire independently`, () => {
    const engine = makeEngine(mode);
    const hero = engine.heroes[0];
    const stats = structuredClone(hero.stats);
    engine.triggerCombatEvent('quad_damage');
    for (let frame = 0; frame < 100; frame++) engine.update();
    engine.triggerCombatEvent('quad_damage');
    assert.equal(hero.combatEventBuffs.quad_damage, 600);
    assert.equal(getCombatEventDamageMultiplier(hero), 2);
    engine.triggerCombatEvent('magia_erebea');
    assert.equal(measureDamage(engine, mode), 300);
    for (let frame = 0; frame < 600; frame++) engine.update();
    assert.equal(getCombatEventDamageMultiplier(hero), 1.5);
    assert.equal(getCombatEventSpeedMultiplier(hero), 1.2);
    assert.equal(measureDamage(engine, mode), 150);
    for (let frame = 0; frame < 300; frame++) engine.update();
    assert.equal(measureDamage(engine, mode), 100);
    assert.deepEqual(hero.stats, stats);
  });
}

test('RPG event buff preview matches actual damage and combines with an independent support skill', () => {
  const engine = makeEngine('RPG');
  const hero = engine.heroes[0];
  hero.atb = 100;
  hero.rpgBuffTicks = 100;
  hero.rpgBuffMultiplier = 1.2;
  engine.triggerCombatEvent('quad_damage');
  assert.equal(engine.beginTargeting(hero, 'simple'), true);
  const preview = engine.getTargetingState().estimates[0];
  assert.equal(preview.amount, 240);
  assert.equal(measureDamage(engine, 'RPG'), preview.amount);
});

test('RPG Magia Erebea increases effective speed used by the ATB gauge', () => {
  const engine = makeEngine('RPG');
  const hero = engine.heroes[0];
  hero.atb = 0;
  engine.update();
  assert.equal(hero.atb, hero.stats.spd * 0.05 + 0.15);
  hero.atb = 0;
  engine.triggerCombatEvent('magia_erebea');
  engine.update();
  assert.equal(hero.atb, hero.stats.spd * 1.2 * 0.05 + 0.15);
});

test('Tactics Magia Erebea affects speed ordering for the next round', () => {
  const engine = makeEngine('Tactics');
  const hero = engine.heroes[0];
  engine.enemies[0].spd = 5.5;
  engine.rebuildTurnQueue();
  assert.equal(engine.turnQueue[0].type, 'enemy');
  engine.triggerCombatEvent('magia_erebea');
  engine.rebuildTurnQueue();
  assert.equal(engine.turnQueue[0].unit, hero);
});

test('Smash Magia Erebea increases running speed, and expiration restores it', () => {
  const engine = makeEngine('Smash');
  const hero = engine.heroes[0];
  engine.updateLocalVersusMovement(hero, engine.enemies[0], { right: true }, 'p1');
  const speed = hero.vx;
  engine.triggerCombatEvent('magia_erebea');
  engine.updateLocalVersusMovement(hero, engine.enemies[0], { right: true }, 'p1');
  assert.equal(hero.vx, speed * 1.2);
  for (let frame = 0; frame < 900; frame++) engine.update();
  engine.updateLocalVersusMovement(hero, engine.enemies[0], { right: true }, 'p1');
  assert.equal(hero.vx, speed);
});

test('Smash trap interrupts a committed P2 attack and its queued follow-up instead of resolving it later', () => {
  const engine = makeEngine('Smash');
  const hero = engine.heroes[0];
  const enemy = engine.enemies[0];
  Object.assign(enemy, { x: hero.x + 30, y: hero.y, facing: -1 });
  assert.equal(engine.triggerMeleeAction('p2', 'AttackLight'), true);
  enemy.queuedMeleeAction = 'light2';
  assert.ok(enemy.action);
  engine.triggerCombatEvent('trap_snap');
  assert.equal(enemy.action, null);
  assert.equal(enemy.queuedMeleeAction, null);
  const hp = hero.currentHp;
  for (let frame = 0; frame < 300; frame++) engine.update();
  assert.equal(hero.currentHp, hp, 'interrupted attack still resolved');
  assert.equal(engine.triggerMeleeAction('p2', 'AttackLight'), true, 'P2 did not regain control after recovery');
});

test('Smash paralysis rejects held, semantic and legacy controls without consuming charge or dropping its state', () => {
  const engine = makeEngine('Smash');
  const enemy = engine.enemies[0];
  enemy.specialCharge = 100;
  engine.triggerCombatEvent('trap_snap');
  const x = enemy.x;
  for (const action of ['AttackLight', 'ChargedAttack', 'Special', 'Shield', 'Taunt']) {
    assert.equal(engine.triggerMeleeAction('p2', action), false, action);
  }
  assert.equal(engine.beginChargedMeleeAttack('p2'), false);
  assert.equal(engine.releaseChargedMeleeAttack('p2'), false);
  assert.equal(engine.setMeleeShield('p2', true), false);
  assert.equal(engine.triggerOpponentAbility('special'), false);
  engine.clearMeleeInputState('p2');
  engine.update({}, { right: true, jump: true, down: true, guard: true });
  assert.equal(enemy.state, 'hit');
  assert.equal(enemy.stateTimer, 299);
  assert.equal(enemy.x, x);
  assert.equal(enemy.specialCharge, 100);
});

test('Smash airborne paralysis survives physics and denies fast-fall, jumping and ledge recovery', () => {
  const engine = makeEngine('Smash');
  const enemy = engine.enemies[0];
  enemy.y = engine.groundY - 80;
  engine.triggerCombatEvent('facehugger_stun');
  const y = enemy.y;
  for (let frame = 0; frame < 60; frame++) {
    engine.update({}, { right: true, jump: true, down: true });
    assert.equal(enemy.state, 'hit');
    assert.equal(enemy.stateTimer, 299 - frame);
    assert.equal(enemy.fastFallHeld, false);
  }
  assert.notEqual(enemy.y, y, 'gravity stopped along with controls');
});

test('Smash death takes priority over paralysis and reaches the terminal battle result', () => {
  const engine = makeEngine('Smash');
  const enemy = engine.enemies[0];
  engine.triggerCombatEvent('trap_snap');
  enemy.currentHp = 1;
  engine.applyDamage(engine.heroes[0], enemy, 10000, 0);
  assert.equal(enemy.state, 'dead');
  assert.equal(applyMeleeHitStun(enemy, 300), false);
  engine.update();
  assert.equal(engine.gameOver, true);
  assert.equal(engine.localVersusResult, 'victory');
});

test('Smash ordinary hits cannot shorten the remaining shield-break vulnerability', () => {
  const engine = makeEngine('Smash');
  const enemy = engine.enemies[0];
  enemy.state = 'shieldBreak';
  enemy.shieldBreakTimer = 1.1;
  engine.applyDamage(engine.heroes[0], enemy, 10, 0);
  assert.equal(enemy.stateTimer, 66);
  assert.equal(enemy.shieldBreakTimer, 0, 'left a second clock capable of overwriting hit stun');
  for (let frame = 0; frame < 65; frame++) engine.update();
  assert.equal(engine.triggerMeleeAction('p2', 'AttackLight'), false);
  engine.update();
  assert.equal(engine.triggerMeleeAction('p2', 'AttackLight'), true);
});
