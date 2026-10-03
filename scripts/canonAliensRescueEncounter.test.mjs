import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { applyEncounterOrDirectDamage } from '../src/game/encounterDamage.js';
import { getAliensHiveHeroLoadout } from '../src/game/canonAliensRescueEncounter.js';
import { drawAliensRescueEncounter } from '../src/game/canonAliensRescueEncounterPresentation.js';

let vite;
let EngineSmash;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?aliens-rescue-mechanics'));
});
after(async () => { await vite?.close(); });

function makeEngine({ stage = CANON_PRIORITY_STAGES.hadleysQueen, queen = true,
  heroIds = ['ripley_aliens'], durable = true } = {}) {
  const configuration = { ...stage, disableHazards: true, stageEventIntensity: 'off' };
  const data = resolveStageEnemyData({ stage: configuration, ...ENEMIES_DB[configuration.universe] });
  const cues = [];
  const completions = [];
  const particles = [];
  const engine = new EngineSmash(960, 540, heroIds.map(getHeroById), data,
    { add: (...args) => particles.push(args) }, cue => cues.push(cue), (...args) => completions.push(args), configuration);
  engine.syncPreMatchFromServer(3000);
  engine.completeMeleeIntros();
  if (durable) engine.heroes.forEach(hero => { hero.maxHp = 50000; hero.currentHp = 50000; });
  engine.testEvidence = { data, cues, completions, particles };
  if (queen && !stage.customBattle) {
    while (engine.wave < engine.maxWaves) {
      engine.enemies.forEach(enemy => Object.assign(enemy, { currentHp: 0, stateTimer: 0, state: 'dead' }));
      engine.update();
      assert.equal(engine.gameOver, false);
    }
  }
  return engine;
}

function moveTo(hero, point) {
  Object.assign(hero, { x: point.x, y: point.y, vx: 0, vy: 0, state: 'idle', action: null,
    hitStunTimer: 0, recoveryLock: 0, guarding: false, ledge: null });
}
function rescue(engine) {
  moveTo(engine.heroes[0], engine.aliensRescueEncounter.rescuePoint);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), true);
}
const advance = (engine, ticks) => { for (let tick = 0; tick < ticks; tick++) engine.update(); };

test('the source hive keeps its stage, rewards, waves, Queen identity and original enemy statistics', () => {
  const engine = makeEngine();
  assert.equal(engine.stage.id, 3);
  assert.equal(engine.stage.goldPrize, 45);
  assert.equal(engine.stage.shardPrize, 15);
  assert.equal(engine.maxWaves, 4);
  assert.equal(engine.arena.objective, 'rescue_escape');
  assert.equal(engine.objectiveTarget, 2);
  assert.equal(engine.aliensRescueEncounter.queen.name, 'Alien Queen');
  assert.equal(engine.aliensRescueEncounter.queen.maxHp, engine.testEvidence.data.bosses[0].hp);
  assert.equal(engine.aliensRescueEncounter.queen.atk, engine.testEvidence.data.bosses[0].atk);
  assert.equal(engine.nihilanthEncounter, null);
});

test('Newt is a spatial rescue marker with no HP, combat state or attack targeting entry', () => {
  const engine = makeEngine();
  const point = engine.aliensRescueEncounter.rescuePoint;
  assert.deepEqual(Object.keys(point).sort(), ['radius', 'x', 'y']);
  assert.deepEqual(engine.getEncounterTargets(), engine.enemies);
  assert.ok(!engine.heroes.some(hero => /newt/i.test(hero.name)));
  assert.ok(!engine.enemies.some(enemy => /newt/i.test(enemy.name)));
});

test('only Ripley Aliens in this source hive exchanges Sulaco equipment without mutating even frozen source data', () => {
  const source = getHeroById('ripley_aliens');
  const before = JSON.stringify(source);
  const frozen = Object.freeze({ ...source,
    stats: Object.freeze({ ...source.stats }), equipment: Object.freeze([...source.equipment]),
    simple: Object.freeze({ ...source.simple }), secondary: Object.freeze({ ...source.secondary }),
    defense: Object.freeze({ ...source.defense }), special: Object.freeze({ ...source.special }) });
  const engine = makeEngine();
  const contextual = getAliensHiveHeroLoadout(engine.aliensRescueEncounter, frozen);
  const hero = engine.heroes[0];
  assert.equal(hero.defense.name, 'Hive Cover');
  assert.equal(hero.defense.reduce, source.defense.reduce);
  assert.equal(hero.defense.dur, source.defense.dur);
  assert.equal(hero.special.name, 'M41A Grenade');
  assert.equal(hero.special.type, 'explosive');
  assert.equal(hero.special.dmg, source.special.dmg);
  assert.ok(!hero.equipment.some(item => /power.loader/i.test(item)));
  assert.deepEqual(contextual.stats, frozen.stats);
  assert.notEqual(contextual.special, frozen.special);
  assert.equal(JSON.stringify(source), before);
  assert.equal(getHeroById('ripley_aliens').special.name, 'Power Loader Smash');
  assert.equal(getAliensHiveHeroLoadout(engine.aliensRescueEncounter, getHeroById('ripley')), getHeroById('ripley'));
  assert.equal(getAliensHiveHeroLoadout(null, frozen), frozen);
  const other = makeEngine({ stage: { ...CANON_PRIORITY_STAGES.hadleysQueen, id: 303 } });
  assert.equal(other.heroes[0].defense.name, 'Power Loader Block');
  assert.equal(other.heroes[0].special.name, 'Power Loader Smash');
});

test('Ripley’s hive grenade is a directional ranged action with a local projectile, not a loader strike or global effect', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  const queen = engine.aliensRescueEncounter.queen;
  Object.assign(hero, { x: queen.x - 220, y: queen.y, facing: 1, state: 'idle', specialCharge: 100 });
  const hp = queen.currentHp;
  engine.testEvidence.particles.length = 0;
  assert.equal(engine.triggerAbility(hero, 'special'), true);
  assert.ok(queen.currentHp < hp);
  assert.ok(queen.currentHp > 0);
  assert.equal(hero.specialCharge, 0);
  assert.ok(engine.testEvidence.particles.some(args => args[7] === 'thrown_prop' && args[2] > 0));
  assert.ok(!engine.testEvidence.particles.some(args => ['glitch', 'laser_line'].includes(args[7])));
  Object.assign(hero, { state: 'idle', specialCharge: 100, facing: -1 });
  const after = queen.currentHp;
  engine.triggerAbility(hero, 'special');
  assert.equal(queen.currentHp, after);
  Object.assign(hero, { state: 'idle', specialCharge: 100, facing: 1, x: queen.x - 330 });
  engine.triggerAbility(hero, 'special');
  assert.equal(queen.currentHp, after);
});

test('Ripley’s source hive rifle and incinerator use local gunfire and flames in normal and timed Melee delivery', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  const queen = engine.aliensRescueEncounter.queen;
  Object.assign(hero, { x: queen.x - 220, y: queen.y, facing: 1, state: 'idle' });
  engine.testEvidence.particles.length = 0;
  const before = queen.currentHp;
  assert.equal(engine.triggerAbility(hero, 'simple'), true);
  assert.ok(queen.currentHp < before);
  assert.ok(engine.testEvidence.particles.some(args => args[7] === 'bullet'));
  Object.assign(hero, { state: 'idle', cooldown: 0 });
  const after = queen.currentHp;
  engine.testEvidence.particles.length = 0;
  engine.triggerAbility(hero, 'secondary');
  assert.equal(queen.currentHp, after, 'the short incinerator cannot reach a 220 pixel target');
  Object.assign(hero, { state: 'idle', cooldown: 0, x: queen.x - 110 });
  engine.triggerAbility(hero, 'secondary');
  assert.ok(queen.currentHp < after);
  assert.ok(engine.testEvidence.particles.some(args => args[7] === 'flame'));
  assert.ok(!engine.testEvidence.particles.some(args => args[7] === 'laser_line'));
  Object.assign(hero, { state: 'idle', x: queen.x - 220 });
  engine.testEvidence.particles.length = 0;
  assert.equal(engine.resolveMeleeActionHit(hero, {
    id: 'special', range: 60, base: 42, knockback: 10, guardDamage: 8, powerScale: 1
  }), 1);
  assert.ok(engine.testEvidence.particles.some(args => args[7] === 'thrown_prop'));
});

test('regular waves do not award rescue progress and the interaction opens on the actual Queen wave', () => {
  const engine = makeEngine({ queen: false });
  const runtime = engine.aliensRescueEncounter;
  assert.equal(runtime.phase, 'search');
  moveTo(engine.heroes[0], runtime.rescuePoint);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), false);
  assert.equal(engine.objectiveProgress, 0);
  while (engine.wave < engine.maxWaves) {
    engine.enemies.forEach(enemy => Object.assign(enemy, { currentHp: 0, stateTimer: 0 }));
    engine.update();
  }
  assert.equal(runtime.phase, 'rescue');
  assert.equal(engine.objectiveProgress, 0);
  assert.match(engine.getObjectiveText(), /repère NEWT/i);
});

test('rescue requires the living party actor to reach the marker rather than a remote UI command', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), false);
  moveTo(hero, engine.aliensRescueEncounter.rescuePoint);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt', { ...hero }), false);
  hero.currentHp = 0;
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), false);
  hero.currentHp = hero.maxHp;
  assert.equal(engine.triggerAliensRescueAction('rescue-newt', hero.id), true);
  assert.equal(engine.aliensRescueEncounter.carrierId, hero.id);
  assert.equal(engine.objectiveProgress, 1);
  assert.equal(engine.gameOver, false);
});

test('rescue and evacuation refuse pre-match, pause and hit lock', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  moveTo(hero, engine.aliensRescueEncounter.rescuePoint);
  engine.setPaused(true);
  assert.equal(engine.getAliensRescueEncounterState().commands.rescueNewt, false);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), false);
  const before = engine.objectiveTick;
  engine.update();
  assert.equal(engine.objectiveTick, before);
  engine.setPaused(false);
  hero.state = 'hitStun';
  hero.hitStunTimer = 10;
  assert.equal(engine.getAliensRescueEncounterState().commands.rescueNewt, false);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), false);
  moveTo(hero, engine.aliensRescueEncounter.rescuePoint);
  engine.syncPreMatchFromServer(0);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), false);
});

test('autoBattle selects Newt’s actual living carrier after a nonleader rescues her', () => {
  const engine = makeEngine({ heroIds: ['freeman', 'ripley_aliens'], durable: false });
  const carrier = engine.heroes[1];
  moveTo(carrier, engine.aliensRescueEncounter.rescuePoint);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt', carrier), true);
  assert.notEqual(engine.activeHeroId, carrier.id);
  engine.autoBattle = true;
  for (let tick = 0; tick < 1400 && !engine.gameOver; tick++) engine.update();
  assert.equal(engine.activeHeroId, carrier.id);
  assert.equal(engine.aliensRescueEncounter.carrierId, carrier.id);
  assert.equal(engine.meleeOutcomeResult, 'victory');
  assert.ok(carrier.currentHp > 0);
});

test('evacuation cannot happen before rescue, from the nest, or with the wrong carrier', () => {
  const engine = makeEngine({ heroIds: ['ripley', 'freeman'] });
  const runtime = engine.aliensRescueEncounter;
  moveTo(engine.heroes[0], runtime.exitPoint);
  assert.equal(engine.triggerAliensRescueAction('evacuate'), false);
  rescue(engine);
  assert.equal(engine.triggerAliensRescueAction('evacuate'), false);
  moveTo(engine.heroes[1], runtime.exitPoint);
  assert.equal(engine.triggerAliensRescueAction('evacuate', engine.heroes[1]), false);
  assert.equal(engine.gameOver, false);
});

test('successful spatial rescue and evacuation wins with the source Queen still alive', () => {
  const engine = makeEngine();
  const runtime = engine.aliensRescueEncounter;
  rescue(engine);
  moveTo(engine.heroes[0], runtime.exitPoint);
  assert.equal(engine.triggerAliensRescueAction('evacuate'), true);
  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'victory');
  assert.ok(runtime.queen.currentHp > 0);
  assert.equal(engine.defeatedEnemies, 0);
  assert.equal(engine.getCombatSummary().objectivePct, 100);
  assert.equal(engine.getCombatSummary().canonicalEncounter.phase, 'complete');
  advance(engine, 121);
  assert.equal(engine.testEvidence.completions.length, 1);
  assert.equal(engine.testEvidence.completions[0][0], 'victory');
  assert.equal(engine.triggerAliensRescueAction('evacuate'), false);
});

test('a carrier loss is defeat even when another living hero stands at the exit', () => {
  const engine = makeEngine({ heroIds: ['ripley', 'freeman'] });
  rescue(engine);
  engine.heroes[0].currentHp = 0;
  moveTo(engine.heroes[1], engine.aliensRescueEncounter.exitPoint);
  engine.update();
  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'defeat');
  assert.equal(engine.aliensRescueEncounter.complete, false);
});

test('ordinary melee damage can hurt the Queen but cannot kill her or complete the mission', () => {
  const engine = makeEngine();
  const queen = engine.aliensRescueEncounter.queen;
  const before = queen.currentHp;
  const dealt = engine.applyDamage(engine.heroes[0], queen, 100000, 0);
  assert.equal(dealt, before - 1);
  assert.equal(queen.currentHp, 1);
  assert.notEqual(queen.state, 'dead');
  assert.equal(engine.defeatedEnemies, 0);
  advance(engine, 90);
  assert.equal(engine.gameOver, false);
  assert.equal(engine.objectiveProgress, 0);
});

test('external fixed damage respects the nonlethal Queen floor without combat variance', () => {
  const engine = makeEngine();
  const queen = engine.aliensRescueEncounter.queen;
  const before = queen.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, queen, 13.5, { kind: 'anomaly' }), 13.5);
  assert.equal(queen.currentHp, before - 13.5);
  assert.equal(applyEncounterOrDirectDamage(engine, queen, 100000, { kind: 'field-super' }), before - 14.5);
  assert.equal(queen.currentHp, 1);
  assert.equal(engine.gameOver, false);
});

test('battle item shield is opt-in for fixed Queen damage and paused commands do not consume it', () => {
  const engine = makeEngine();
  const queen = engine.aliensRescueEncounter.queen;
  queen.battleItemShield = 30;
  const hp = queen.currentHp;
  engine.setPaused(true);
  assert.equal(engine.applyEncounterDamage(queen, 10, { directDamage: true, absorbBattleItemShield: true }), true);
  assert.equal(queen.currentHp, hp);
  assert.equal(queen.battleItemShield, 30);
  engine.setPaused(false);
  applyEncounterOrDirectDamage(engine, queen, 10, { kind: 'anomaly' });
  assert.equal(queen.currentHp, hp - 10);
  assert.equal(queen.battleItemShield, 30);
  applyEncounterOrDirectDamage(engine, queen, 10, { kind: 'battle-item', absorbBattleItemShield: true });
  assert.equal(queen.currentHp, hp - 10);
  assert.equal(queen.battleItemShield, 20);
});

test('the source Queen cannot turn a Smash ringout into the later Sulaco airlock finale', () => {
  const engine = makeEngine();
  const runtime = engine.aliensRescueEncounter;
  Object.assign(runtime.queen, { x: 600, y: engine.height + 200, vx: 30, vy: 10 });
  const hp = runtime.queen.currentHp;
  engine.applyPhysics(runtime.queen);
  assert.equal(runtime.queen.currentHp, hp);
  assert.equal(runtime.queen.x, runtime.queenAnchor.x);
  assert.equal(runtime.queen.y, runtime.queenAnchor.y);
  assert.notEqual(runtime.queen.state, 'dead');
  assert.equal(engine.gameOver, false);
});

test('accidentally emptied boss arrays cannot bypass rescue with generic final-wave victory', () => {
  const engine = makeEngine();
  engine.enemies = [];
  engine.update();
  assert.equal(engine.gameOver, false);
  assert.equal(engine.objectiveProgress, 0);
  assert.equal(engine.aliensRescueEncounter.rescued, false);
});

test('the rendered source markers and carrier notice are real canvas elements with restored state', () => {
  const engine = makeEngine();
  const calls = [];
  const ctx = new Proxy({}, { get(_target, prop) {
    return (...args) => calls.push([prop, ...args]);
  } });
  drawAliensRescueEncounter(ctx, engine.aliensRescueEncounter, engine.heroes, 0, 960, 540, 'fr');
  assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === 'NEWT'));
  assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === 'EVACUATION'));
  assert.ok(calls.some(call => call[0] === 'arc'));
  assert.equal(calls[0][0], 'save');
  assert.equal(calls.at(-1)[0], 'restore');
  rescue(engine);
  calls.length = 0;
  drawAliensRescueEncounter(ctx, engine.aliensRescueEncounter, engine.heroes, 0, 960, 540, 'en');
  assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === 'NEWT WITH YOU'));
  assert.ok(!calls.some(call => call[0] === 'fillText' && call[1] === 'NEWT'));
});

test('autoBattle actually walks the authored rescue and evacuation route with original Ripley and Queen stats', () => {
  const engine = makeEngine({ durable: false });
  const hp = engine.heroes[0].maxHp;
  const queenHp = engine.aliensRescueEncounter.queen.currentHp;
  engine.autoBattle = true;
  for (let tick = 0; tick < 1400 && !engine.gameOver; tick++) engine.update();
  assert.equal(engine.heroes[0].maxHp, hp);
  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'victory');
  assert.equal(engine.aliensRescueEncounter.complete, true);
  assert.ok(engine.heroes[0].currentHp > 0);
  assert.equal(engine.aliensRescueEncounter.queen.currentHp, queenHp);
});

test('autoBattle crosses the original combat waves before rescuing Newt and escaping', () => {
  const engine = makeEngine({ durable: false, queen: false,
    heroIds: ['ripley_aliens', 'freeman', 'han_solo'] });
  const originalStats = engine.heroes.map(hero => ({ ...hero.stats }));
  engine.autoBattle = true;
  for (let tick = 0; tick < 7000 && !engine.gameOver; tick++) engine.update();
  assert.deepEqual(engine.heroes.map(hero => hero.stats), originalStats);
  assert.equal(engine.wave, engine.maxWaves);
  assert.equal(engine.meleeOutcomeResult, 'victory');
  assert.equal(engine.aliensRescueEncounter.complete, true);
  assert.ok(engine.aliensRescueEncounter.queen.currentHp > 0);
  assert.equal(engine.defeatedEnemies, 5);
});

test('non-source Alien stages retain their existing elimination and lethal damage', () => {
  const stage = { ...CANON_PRIORITY_STAGES.hadleysQueen, id: 303 };
  const engine = makeEngine({ stage });
  assert.equal(engine.aliensRescueEncounter, null);
  assert.equal(engine.getAliensRescueEncounterState(), null);
  assert.equal(engine.arena.objective, 'boss');
  assert.equal(engine.applyEncounterDamage(engine.enemies[0], 100000), false);
  engine.applyDamage(engine.heroes[0], engine.enemies[0], 100000, 0);
  assert.equal(engine.enemies[0].currentHp, 0);
  advance(engine, 61);
  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'victory');
});

test('custom battles borrowing stage 3 do not acquire Newt, nonlethal Queen damage or rescue objectives', () => {
  const stage = { ...CANON_PRIORITY_STAGES.hadleysQueen,
    customBattle: { singleRoster: true, opponentControl: 'cpu' } };
  const engine = makeEngine({ stage });
  assert.equal(engine.aliensRescueEncounter, null);
  assert.equal(engine.getAliensRescueEncounterState(), null);
  assert.equal(engine.triggerAliensRescueAction('rescue-newt'), false);
  assert.equal(engine.applyEncounterDamage(engine.enemies[0], 100000), false);
});

test('different incarnations, modes, rosters and custom flags never acquire the source rescue rules', () => {
  for (const patch of [
    { incarnation: 'Alien: Resurrection (1997)' }, { mode: 'RPG' },
    { enemyRosterExclusive: false }, { canonicalBossName: 'Newborn' },
    { isCustomBattle: true }, { isCustom: true }, { forceBaseArena: true }
  ]) {
    const engine = makeEngine({ stage: { ...CANON_PRIORITY_STAGES.hadleysQueen, ...patch }, queen: false });
    assert.equal(engine.aliensRescueEncounter, null, JSON.stringify(patch));
    assert.equal(engine.getAliensRescueEncounterState(), null);
    assert.equal(engine.applyEncounterDamage(engine.enemies[0], 100000), false);
  }
});

test('Nihilanth retains all three crystals, body nonlethal gating and an exposed brain kill', () => {
  const engine = makeEngine({ stage: CANON_PRIORITY_STAGES.xenNihilanth });
  assert.equal(engine.aliensRescueEncounter, null);
  const runtime = engine.nihilanthEncounter;
  assert.equal(runtime.crystals.length, 3);
  for (const crystal of runtime.crystals) engine.applyEncounterDamage(crystal, 1000);
  engine.applyDamage(engine.heroes[0], runtime.boss, 100000, 0);
  assert.equal(runtime.boss.currentHp, 1);
  advance(engine, 240);
  assert.equal(runtime.headOpen, true);
  engine.applyEncounterDamage(runtime.brain, 100000);
  advance(engine, 61);
  assert.equal(engine.meleeOutcomeResult, 'victory');
});
