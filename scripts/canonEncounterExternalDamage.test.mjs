import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { applyEncounterOrDirectDamage } from '../src/game/encounterDamage.js';
import { grantCombatEventBuff } from '../src/game/combatEventBuffs.js';

let vite;
let EngineRpg;
let EngineTactics;
let EngineSmash;
const engines = [];
const selectedEnemies = stage => resolveStageEnemyData({ stage, ...ENEMIES_DB[stage.universe] });
const particles = { add() {} };

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });

function makeRpg({ expose = false, finale = true } = {}) {
  const stage = CANON_PRIORITY_STAGES.lightmassTrain;
  const engine = new EngineRpg(760, 420, [getHeroById('marcus')], selectedEnemies(stage), particles, () => {}, () => {}, stage);
  engines.push(engine);
  if (finale) { engine.wave = 2; engine.spawnWave(); }
  engine.enemyGlobalRecovery = 99999;
  engine.heroes[0].atb = 100;
  if (expose) {
    assert.equal(engine.triggerRaamEncounterAction('frag', engine.heroes[0]), true);
    for (let tick = 0; tick < 18; tick++) engine.update();
    assert.equal(engine.getRaamEncounterState().shieldActive, false);
  }
  return engine;
}

function makeTactics(stage = CANON_PRIORITY_STAGES.metropolisScarab) {
  const engine = new EngineTactics(760, 420, [getHeroById('masterchief')], selectedEnemies(stage), particles, () => {}, () => {}, stage);
  engines.push(engine);
  engine.timers.forEach(timer => clearTimeout(timer));
  engine.timers.clear();
  engine.schedule = () => null;
  return engine;
}

function makeSmash({ finale = true } = {}) {
  const stage = { ...CANON_PRIORITY_STAGES.xenNihilanth, disableHazards: true, stageEventIntensity: 'off' };
  const engine = new EngineSmash(960, 540, [getHeroById('arca_mirelle')], selectedEnemies(stage), particles, () => {}, () => {}, stage);
  engines.push(engine);
  engine.syncPreMatchFromServer(3000);
  engine.completeMeleeIntros();
  Object.assign(engine.heroes[0], { maxHp: 50000, currentHp: 50000 });
  if (finale) {
    while (engine.wave < engine.maxWaves) {
      engine.enemies.forEach(enemy => Object.assign(enemy, { currentHp: 0, state: 'dead', stateTimer: 0 }));
      engine.update();
      assert.equal(engine.gameOver, false);
    }
    assert.ok(engine.nihilanthEncounter.boss);
  }
  return engine;
}

const raam = engine => engine.enemies.find(enemy => enemy.name === 'General RAAM');
const advance = (engine, ticks) => { for (let tick = 0; tick < ticks; tick++) engine.update(); };
function exposeBrainThroughExternalDamage(engine) {
  const runtime = engine.nihilanthEncounter;
  runtime.crystals.forEach(crystal => {
    assert.equal(applyEncounterOrDirectDamage(engine, crystal, 1000, { kind: 'field-super' }), crystal.maxHp);
  });
  const before = runtime.boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.boss, 999999, { kind: 'field-super' }), before - 1);
  advance(engine, 240);
  assert.equal(runtime.headOpen, true);
  assert.ok(engine.getEncounterTargets().includes(runtime.brain));
}

for (const context of [
  { kind: 'battle-item', absorbBattleItemShield: true },
  { kind: 'field-super' },
  { kind: 'anomaly', nonlethal: true }
]) {
  test(`${context.kind} damage respects shielded RAAM without consuming pickup protection`, () => {
    const engine = makeRpg();
    const boss = raam(engine);
    boss.battleItemShield = 30;
    const hp = boss.currentHp;
    assert.equal(applyEncounterOrDirectDamage(engine, boss, 100000, context), 0);
    assert.equal(boss.currentHp, hp);
    assert.equal(boss.battleItemShield, 30);
    assert.equal(engine.getRaamEncounterState().shieldActive, true, 'external explosions must not disperse Kryll');
  });
}

test('external damage against exposed RAAM is an exact HP loss, independent of attack buffs and defense', () => {
  const engine = makeRpg({ expose: true });
  const boss = raam(engine);
  const hero = engine.heroes[0];
  grantCombatEventBuff(hero, 'quad_damage');
  Object.assign(hero, { rpgBuffTicks: 1000, rpgBuffMultiplier: 5 });
  const before = boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, boss, 40, { kind: 'field-super', attacker: hero, directDamage: false }), 40);
  assert.equal(boss.currentHp, before - 40);
});

test('an exposed RAAM battle-item hit consumes its pickup shield exactly once', () => {
  const engine = makeRpg({ expose: true });
  const boss = raam(engine);
  boss.battleItemShield = 30;
  const before = boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, boss, 50, { kind: 'battle-item', absorbBattleItemShield: true }), 20);
  assert.equal(boss.currentHp, before - 20);
  assert.equal(boss.battleItemShield, 0);
});

test('field-super damage does not silently consume optional pickup shields', () => {
  const engine = makeRpg({ expose: true });
  const boss = raam(engine);
  boss.battleItemShield = 30;
  assert.equal(applyEncounterOrDirectDamage(engine, boss, 40, { kind: 'field-super' }), 40);
  assert.equal(boss.battleItemShield, 30);
});

test('a nonlethal anomaly cannot kill exposed RAAM even with an amplified attacker', () => {
  const engine = makeRpg({ expose: true });
  const boss = raam(engine);
  const hero = engine.heroes[0];
  boss.currentHp = 10;
  Object.assign(hero, { rpgBuffTicks: 1000, rpgBuffMultiplier: 5 });
  grantCombatEventBuff(hero, 'quad_damage');
  assert.equal(applyEncounterOrDirectDamage(engine, boss, 999999, { kind: 'anomaly', nonlethal: true, attacker: hero }), 9);
  assert.equal(boss.currentHp, 1);
  assert.notEqual(boss.state, 'dead');
  assert.equal(applyEncounterOrDirectDamage(engine, boss, 999999, { kind: 'anomaly', nonlethal: true }), 0);
  assert.equal(boss.currentHp, 1);
});

test('lethal external damage can finish exposed RAAM and reports the actual HP loss', () => {
  const engine = makeRpg({ expose: true });
  const boss = raam(engine);
  const hp = boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, boss, 999999, { kind: 'field-super' }), hp);
  assert.equal(boss.currentHp, 0);
  assert.equal(boss.state, 'dead');
  engine.update();
  assert.equal(engine.gameOver, true);
});

test('the original Locust wave remains on the direct fallback rather than receiving RAAM immunity', () => {
  const engine = makeRpg({ finale: false });
  const enemy = engine.enemies[0];
  const hp = enemy.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, enemy, 20, { kind: 'field-super' }), 20);
  assert.equal(enemy.currentHp, hp - 20);
});

test('external battle items, field supers and anomalies cannot damage the Scarab hull or spend its shield', () => {
  const engine = makeTactics();
  const hull = engine.scarabEncounter.hull;
  hull.battleItemShield = 30;
  for (const context of [{ kind: 'battle-item', absorbBattleItemShield: true }, { kind: 'field-super' }, { kind: 'anomaly', nonlethal: true }]) {
    assert.equal(applyEncounterOrDirectDamage(engine, hull, 999999, context), 0);
  }
  assert.equal(hull.currentHp, hull.maxHp);
  assert.equal(hull.battleItemShield, 30);
  assert.equal(engine.gameOver, false);
});

test('external damage kills Scarab crew but never skips the actual boarding requirement', () => {
  const engine = makeTactics();
  for (const crew of engine.scarabEncounter.crew) {
    const hp = crew.currentHp;
    assert.equal(applyEncounterOrDirectDamage(engine, crew, 999999, { kind: 'field-super' }), hp);
    assert.equal(crew.state, 'dead');
  }
  engine.update();
  assert.equal(engine.gameOver, false);
  for (let turn = 0; turn < 18 && !engine.gameOver; turn++) {
    if (engine.activeUnitType === 'hero') {
      const next = engine.getObjectiveRouteMove(engine.activeUnit);
      assert.ok(next);
      assert.equal(engine.handleCellClick(next.x, next.y).handled, true);
    }
    if (!engine.gameOver) { engine.endActiveTurn(); engine.startTurn(); }
  }
  assert.equal(engine.battleResult, 'victory');
  assert.equal(engine.scarabEncounter.boarded, true);
  assert.equal(engine.scarabEncounter.hull.currentHp, engine.scarabEncounter.hull.maxHp);
});

test('the direct Tactics crew fallback applies shield absorption once and honors nonlethal anomalies', () => {
  const engine = makeTactics();
  const crew = engine.scarabEncounter.crew[0];
  crew.battleItemShield = 30;
  const hp = crew.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, crew, 50, { kind: 'battle-item', absorbBattleItemShield: true }), 20);
  assert.equal(crew.currentHp, hp - 20);
  assert.equal(crew.battleItemShield, 0);
  assert.equal(applyEncounterOrDirectDamage(engine, crew, 99999, { kind: 'anomaly', nonlethal: true }), hp - 21);
  assert.equal(crew.currentHp, 1);
  assert.notEqual(crew.state, 'dead');
});

test('REX retains the ordinary fixed direct-loss fallback', () => {
  const engine = makeTactics(CANON_PRIORITY_STAGES.shadowMoses);
  const boss = engine.enemies.find(enemy => enemy.isBoss);
  const hp = boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, boss, 40, { kind: 'field-super' }), 40);
  assert.equal(boss.currentHp, hp - 40);
});

test('external Nihilanth body damage is fixed but cannot bypass the lethal brain requirement', () => {
  const engine = makeSmash();
  const runtime = engine.nihilanthEncounter;
  grantCombatEventBuff(engine.heroes[0], 'quad_damage');
  const before = runtime.boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.boss, 40, { kind: 'field-super' }), 40);
  assert.equal(runtime.boss.currentHp, before - 40);
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.boss, 999999, { kind: 'field-super' }), before - 41);
  assert.equal(runtime.boss.currentHp, 1);
  assert.equal(runtime.headOpen, false);
  assert.equal(engine.gameOver, false);
});

test('external damage reaches actual healing crystals and reports their destruction accurately', () => {
  const engine = makeSmash();
  const crystal = engine.nihilanthEncounter.crystals[0];
  assert.equal(applyEncounterOrDirectDamage(engine, crystal, 40, { kind: 'field-super' }), 40);
  assert.equal(crystal.currentHp, 20);
  assert.equal(applyEncounterOrDirectDamage(engine, crystal, 1000, { kind: 'field-super' }), 20);
  assert.equal(crystal.currentHp, 0);
  assert.equal(crystal.state, 'dead');
  assert.ok(!engine.getEncounterTargets().includes(crystal));
  assert.equal(engine.defeatedEnemies, 0, 'a healing crystal is not a defeated enemy');
});

test('an optional crystal pickup shield is consumed once before fixed damage', () => {
  const engine = makeSmash();
  const crystal = engine.nihilanthEncounter.crystals[0];
  crystal.battleItemShield = 20;
  assert.equal(applyEncounterOrDirectDamage(engine, crystal, 50, { kind: 'battle-item', absorbBattleItemShield: true }), 30);
  assert.equal(crystal.currentHp, 30);
  assert.equal(crystal.battleItemShield, 0);
});

test('a hidden brain cannot be used as an external-damage shortcut', () => {
  const engine = makeSmash();
  const runtime = engine.nihilanthEncounter;
  const hp = runtime.boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.brain, 999999, { kind: 'battle-item', absorbBattleItemShield: true }), 0);
  assert.equal(runtime.boss.currentHp, hp);
  assert.equal(runtime.headOpen, false);
});

test('external hits synchronize the exposed brain proxy and its actual boss HP', () => {
  const engine = makeSmash();
  exposeBrainThroughExternalDamage(engine);
  const runtime = engine.nihilanthEncounter;
  const hp = runtime.boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.brain, 40, { kind: 'field-super' }), 40);
  assert.equal(runtime.boss.currentHp, hp - 40);
  assert.equal(runtime.brain.currentHp, runtime.boss.currentHp);
});

test('a lethal external brain hit reports real damage, marks the proxy dead and counts one boss defeat', () => {
  const engine = makeSmash();
  exposeBrainThroughExternalDamage(engine);
  const runtime = engine.nihilanthEncounter;
  const hp = runtime.boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.brain, 999999, { kind: 'field-super' }), hp);
  assert.equal(runtime.boss.currentHp, 0);
  assert.equal(runtime.brain.currentHp, 0);
  assert.equal(runtime.brain.state, 'dead');
  assert.equal(engine.defeatedEnemies, 1);
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.brain, 999999, { kind: 'field-super' }), 0);
  assert.equal(engine.defeatedEnemies, 1);
});

test('an anomaly remains nonlethal on the open brain and cannot award a boss defeat', () => {
  const engine = makeSmash();
  exposeBrainThroughExternalDamage(engine);
  const runtime = engine.nihilanthEncounter;
  grantCombatEventBuff(engine.heroes[0], 'quad_damage');
  const hp = runtime.boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.brain, 999999, { kind: 'anomaly', nonlethal: true }), hp - 1);
  assert.equal(runtime.boss.currentHp, 1);
  assert.equal(runtime.brain.currentHp, 1);
  assert.notEqual(runtime.boss.state, 'dead');
  assert.equal(engine.defeatedEnemies, 0);
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.brain, 999999, { kind: 'anomaly', nonlethal: true }), 0);
});

test('an open brain battle-item hit consumes boss pickup protection exactly once', () => {
  const engine = makeSmash();
  exposeBrainThroughExternalDamage(engine);
  const runtime = engine.nihilanthEncounter;
  runtime.boss.battleItemShield = 30;
  const hp = runtime.boss.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, runtime.brain, 50, { kind: 'battle-item', absorbBattleItemShield: true }), 20);
  assert.equal(runtime.boss.currentHp, hp - 20);
  assert.equal(runtime.brain.currentHp, runtime.boss.currentHp);
  assert.equal(runtime.boss.battleItemShield, 0);
});

test('the preceding Xen wave retains direct damage before the source boss attaches', () => {
  const engine = makeSmash({ finale: false });
  const enemy = engine.enemies[0];
  const hp = enemy.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, enemy, 20, { kind: 'field-super' }), 20);
  assert.equal(enemy.currentHp, hp - 20);
  assert.equal(engine.nihilanthEncounter.boss, null);
});

test('invalid or already-dead targets cannot consume a shield or damage a source encounter', () => {
  const engine = makeTactics();
  const crew = engine.scarabEncounter.crew[0];
  crew.battleItemShield = 30;
  const hp = crew.currentHp;
  for (const amount of [NaN, Infinity, -1, 0, undefined]) {
    assert.equal(applyEncounterOrDirectDamage(engine, crew, amount, { absorbBattleItemShield: true }), 0);
  }
  assert.equal(crew.currentHp, hp);
  assert.equal(crew.battleItemShield, 30);
  assert.equal(applyEncounterOrDirectDamage(engine, null, 100), 0);
  crew.currentHp = 0;
  assert.equal(applyEncounterOrDirectDamage(engine, crew, 100, { absorbBattleItemShield: true }), 0);
  assert.equal(crew.battleItemShield, 30);
});
