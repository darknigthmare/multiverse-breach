import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { getExpandedStages } from '../src/game/expandedUniverses.js';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { applyEncounterOrDirectDamage } from '../src/game/encounterDamage.js';
import { PIRATES_CURSE_RULES, isCanonPiratesCurseStage } from '../src/game/canonPiratesCurseEncounter.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';

const stage = getExpandedStages().find(entry => entry.id === 269);
const engines = [];
let vite;
let EngineRpg;

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?canon-pirates-curse'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

function makeEngine({ stageOverride = {}, heroes = ['jack_sparrow_potc', 'will_turner_potc', 'elizabeth_swann_potc'], readyHeroes = true, suppressEnemyActions = true } = {}) {
  const selected = { ...stage, ...stageOverride };
  const data = resolveStageEnemyData({ stage: selected, ...ENEMIES_DB[selected.universe] });
  const calls = [];
  const sounds = [];
  const completions = [];
  const engine = new EngineRpg(760, 420, heroes.map(getHeroById), data,
    { add: (...args) => calls.push(args) }, sound => sounds.push(sound), result => completions.push(result), selected);
  engines.push(engine);
  if (suppressEnemyActions) engine.enemyGlobalRecovery = 99999;
  if (readyHeroes) engine.heroes.forEach(hero => { hero.atb = 100; });
  return Object.assign(engine, { calls, sounds, completions });
}
const advance = (engine, ticks) => { for (let index = 0; index < ticks; index++) engine.update(); };
const ready = actor => Object.assign(actor, { atb: 100, state: 'idle', stateTimer: 0, actionPending: false });
const boss = engine => engine.enemies.find(enemy => enemy.name === 'Hector Barbossa');
const crew = engine => engine.enemies.filter(enemy => enemy.name === 'Cursed Aztec Pirate');
const command = (engine, action, index = 0) => {
  ready(engine.heroes[index]);
  assert.equal(engine.triggerPiratesCurseAction(action, engine.heroes[index]), true);
  advance(engine, PIRATES_CURSE_RULES.commandImpactTicks);
};
const prepareRitual = engine => {
  command(engine, 'collect-final-coins');
  command(engine, 'coordinate-will');
};
const restoreChest = engine => {
  prepareRitual(engine);
  command(engine, 'restore-chest');
};
const openIsolatedMortalFixture = engine => {
  restoreChest(engine);
  advance(engine, 1);
  assert.equal(engine.gameOver, true);
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, true);
  assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp));
  // Only this engine fixture reopens a completed scene outside its cinematic.
  // This is not a second fight or a playable transition in source stage 269.
  engine.gameOver = false;
  engine.piratesCurseEncounter.sourceShotFired = false;
};

test('only saved stage 269 with its exact 2003 Isla de Muerta source lock receives the curse encounter', () => {
  assert.equal(isCanonPiratesCurseStage(stage), true);
  for (const override of [{ id: 270 }, { mode: 'Smash' }, { universe: 'Halo' }, { canonicalBossName: 'Davy Jones' },
    { incarnation: 'Dead Man’s Chest (2006)' }, { enemyRosterExclusive: false }, { customBattle: {} }, { isCustomBattle: true }, { isCustom: true }]) {
    assert.equal(isCanonPiratesCurseStage({ ...stage, ...override }), false);
  }
});

test('the constructor presents Barbossa and his cursed crew together without an impossible immortal preliminary wave', () => {
  const engine = makeEngine();
  assert.deepEqual(engine.enemies.map(enemy => enemy.name), ['Cursed Aztec Pirate', 'Cursed Aztec Pirate', 'Hector Barbossa']);
  assert.equal(engine.wave, 1);
  assert.equal(engine.maxWaves, 1);
  assert.deepEqual(crew(engine).map(enemy => [enemy.maxHp, enemy.atk, enemy.spd]), [[103, 13, 4], [103, 13, 4]]);
  assert.deepEqual([boss(engine).maxHp, boss(engine).atk, boss(engine).spd], [490, 22, 4]);
  assert.equal(engine.enemies.some(enemy => /Davy Jones|Calypso|Dutchman/.test(enemy.name)), false);
});

test('the objective snapshot identifies both final coins and the actual Will/Bootstrap and Jack donors', () => {
  const engine = makeEngine({ heroes: ['marcus', 'han_solo'] });
  const state = engine.getPiratesCurseEncounterState();
  assert.equal(state.phase, 'coins');
  assert.deepEqual([state.totalPieces, state.returnedPieces], [882, 880]);
  assert.deepEqual(state.sourceWill, { name: 'Will Turner', lineage: 'Bootstrap Bill Turner' });
  assert.deepEqual(state.sourceJack, { name: 'Jack Sparrow' });
  assert.deepEqual(state.commands, { collectFinalCoins: true, coordinateWill: false, restoreChest: false });
  assert.match(state.adaptation, /crossover squad.*No player injury/);
});

for (const name of ['Cursed Aztec Pirate', 'Hector Barbossa']) {
  test(`${name} cannot lose HP, receive status, spend a pickup shield or feed lifesteal before curse restitution`, () => {
    const engine = makeEngine();
    const target = engine.enemies.find(enemy => enemy.name === name);
    const hero = engine.heroes[0];
    hero.talent = 'lifedrain';
    hero.currentHp = 30;
    target.battleItemShield = 40;
    const hp = target.currentHp;
    assert.equal(engine.applyDamage(hero, target, 99999, 'infected'), 0);
    assert.equal(target.currentHp, hp);
    assert.equal(target.statusEffects.infected, 0);
    assert.equal(target.battleItemShield, 40);
    assert.equal(hero.currentHp, 30);
  });
}

test('manual attack preview communicates zero damage rather than predicting an impossible cursed death', () => {
  const engine = makeEngine();
  assert.equal(engine.beginTargeting(engine.heroes[0], 'simple'), true);
  const state = engine.getTargetingState();
  assert.equal(state.estimates[0].blockedByAztecCurse, true);
  assert.deepEqual([state.estimates[0].amount, state.estimates[0].min, state.estimates[0].max], [0, 0, 0]);
  assert.equal(engine.heroes[0].atb, 100);
});

test('confirmed ordinary sword contact spends ATB but cannot lift the curse or lower immortal HP', () => {
  const engine = makeEngine();
  const target = crew(engine)[0];
  const hp = target.currentHp;
  assert.equal(engine.beginTargeting(engine.heroes[0], 'simple'), true);
  assert.equal(engine.selectTarget(target.battleId), true);
  assert.equal(engine.confirmTargeting(), true);
  advance(engine, 18);
  assert.equal(target.currentHp, hp);
  assert.equal(engine.getPiratesCurseEncounterState().phase, 'coins');
  assert.equal(engine.heroes[0].atb < 100, true);
});

for (const context of [
  { kind: 'battle-item', absorbBattleItemShield: true },
  { kind: 'field-super' },
  { kind: 'anomaly', nonlethal: true }
]) {
  test(`external ${context.kind} damage respects the curse on Barbossa and every crew member`, () => {
    const engine = makeEngine();
    for (const target of engine.enemies) {
      target.battleItemShield = 30;
      const hp = target.currentHp;
      assert.equal(applyEncounterOrDirectDamage(engine, target, 99999, context), 0);
      assert.equal(target.currentHp, hp);
      assert.equal(target.battleItemShield, 30);
    }
    assert.equal(engine.gameOver, false);
    assert.equal(engine.piratesCurseEncounter.curseActive, true);
  });
}

test('infection and engine battlefield events cannot substitute for the ritual', () => {
  const engine = makeEngine();
  const hp = engine.enemies.map(enemy => enemy.currentHp);
  engine.enemies.forEach(enemy => { enemy.statusEffects.infected = 61; });
  engine.triggerFinalBossRandomEvent();
  advance(engine, 1);
  assert.deepEqual(engine.enemies.map(enemy => enemy.currentHp), hp);
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, true);
});

test('legacy direct HP deaths are repaired before wave and victory checks while the curse remains', () => {
  const engine = makeEngine();
  engine.enemies.forEach(enemy => Object.assign(enemy, { currentHp: 0, state: 'dead', stateTimer: 999 }));
  engine.update();
  assert.equal(engine.gameOver, false);
  assert.equal(engine.wave, 1);
  assert.ok(engine.enemies.every(enemy => enemy.currentHp === enemy.maxHp && enemy.state === 'idle'));
  assert.deepEqual(engine.completions, []);
});

test('time and a low HP threshold cannot automatically break the Aztec curse', () => {
  const engine = makeEngine();
  engine.enemies.forEach(enemy => { enemy.currentHp = 1; });
  advance(engine, 2400);
  assert.ok(engine.enemies.every(enemy => enemy.currentHp === 1));
  assert.equal(engine.getPiratesCurseEncounterState().phase, 'coins');
  assert.equal(engine.gameOver, false);
});

test('collecting coins consumes a turn and is established only when its queued source action lands', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', hero.battleId), true);
  assert.equal(hero.atb, 0);
  assert.equal(hero.actionPending, true);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, false);
  assert.equal(engine.getPiratesCurseEncounterState().commandPending, 'collect-final-coins');
  advance(engine, 17);
  assert.equal(engine.getPiratesCurseEncounterState().phase, 'coins');
  advance(engine, 1);
  assert.equal(engine.getPiratesCurseEncounterState().phase, 'offerings');
  assert.equal(engine.getPiratesCurseEncounterState().returnedPieces, 880);
  assert.equal(hero.actionPending, false);
});

test('coin collection alone cannot make Barbossa mortal', () => {
  const engine = makeEngine();
  command(engine, 'collect-final-coins');
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, true);
  assert.equal(engine.applyDamage(engine.heroes[0], boss(engine), 99999), 0);
  ready(engine.heroes[0]);
  assert.equal(engine.triggerPiratesCurseAction('restore-chest'), false);
  assert.equal(engine.heroes[0].atb, 100);
});

test('the actual Will and Jack contributions do not injure or substitute an unrelated crossover hero', () => {
  const engine = makeEngine({ heroes: ['marcus', 'han_solo'] });
  const hp = engine.heroes.map(hero => hero.currentHp);
  const stats = engine.heroes.map(hero => structuredClone(hero.stats));
  prepareRitual(engine);
  const state = engine.getPiratesCurseEncounterState();
  assert.equal(state.phase, 'restore');
  assert.equal(state.willBloodReady, true);
  assert.equal(state.jackBloodReady, true);
  assert.equal(state.curseActive, true);
  assert.deepEqual(engine.heroes.map(hero => hero.currentHp), hp);
  assert.deepEqual(engine.heroes.map(hero => hero.stats), stats);
});

test('arbitrary hero blood, Elizabeth blood and Jack-only substitutions cannot advance the Turner payment', () => {
  const engine = makeEngine();
  command(engine, 'collect-final-coins');
  ready(engine.heroes[0]);
  for (const action of ['offer-crossover-blood', 'offer-elizabeth-blood', 'offer-jack-blood', 'wrong-blood', 'restore-chest']) {
    assert.equal(engine.triggerPiratesCurseAction(action), false);
  }
  assert.equal(engine.heroes[0].atb, 100);
  assert.equal(engine.getPiratesCurseEncounterState().willBloodReady, false);
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, true);
});

test('the required source steps cannot be skipped or replayed for free effects', () => {
  const engine = makeEngine();
  for (const action of ['coordinate-will', 'restore-chest', 'invent-a-fourth-coin']) assert.equal(engine.triggerPiratesCurseAction(action), false);
  assert.equal(engine.heroes[0].atb, 100);
  command(engine, 'collect-final-coins');
  ready(engine.heroes[0]);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins'), false);
  assert.equal(engine.heroes[0].atb, 100);
});

test('pending assistant actions lock other ritual commands without spending a second hero turn', () => {
  const engine = makeEngine();
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', engine.heroes[0]), true);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', engine.heroes[1]), false);
  assert.equal(engine.triggerPiratesCurseAction('coordinate-will', engine.heroes[1]), false);
  assert.equal(engine.heroes[1].atb, 100);
});

test('ATB, state, pending action, death, pause and manual targeting all prevent environmental commands', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  for (const override of [{ atb: 99 }, { state: 'attack' }, { actionPending: true }, { currentHp: 0 }]) {
    ready(hero);
    hero.currentHp = hero.maxHp;
    Object.assign(hero, override);
    assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', hero), false);
  }
  ready(hero);
  hero.currentHp = hero.maxHp;
  engine.setPaused(true);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', hero), false);
  engine.setPaused(false);
  assert.equal(engine.beginTargeting(hero, 'simple'), true);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', hero), false);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, false);
});

test('pause and wait-mode manual targeting freeze the coin and chest impact timers', () => {
  const engine = makeEngine();
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', engine.heroes[0]), true);
  engine.setPaused(true);
  advance(engine, 200);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, false);
  engine.setPaused(false);
  assert.equal(engine.beginTargeting(engine.heroes[1], 'simple'), true);
  advance(engine, 200);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, false);
  engine.cancelTargeting();
  advance(engine, 18);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, true);
  command(engine, 'coordinate-will');
  ready(engine.heroes[0]);
  assert.equal(engine.triggerPiratesCurseAction('restore-chest', engine.heroes[0]), true);
  engine.setPaused(true);
  advance(engine, 200);
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, true);
  engine.setPaused(false);
  advance(engine, 18);
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, false);
  engine.setPaused(true);
  advance(engine, 200);
  assert.equal(boss(engine).currentHp, boss(engine).maxHp);
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, false);
  engine.setPaused(false);
  advance(engine, 1);
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, true);
});

test('a coordinator who dies before impact does not complete a missing source payment', () => {
  const engine = makeEngine();
  command(engine, 'collect-final-coins');
  ready(engine.heroes[0]);
  assert.equal(engine.triggerPiratesCurseAction('coordinate-will', engine.heroes[0]), true);
  engine.heroes[0].currentHp = 0;
  advance(engine, 18);
  assert.equal(engine.getPiratesCurseEncounterState().willBloodReady, false);
  assert.equal(engine.getPiratesCurseEncounterState().commandPending, null);
  command(engine, 'coordinate-will', 1);
  assert.equal(engine.getPiratesCurseEncounterState().willBloodReady, true);
});

test('restoring the paid medallions breaks the curse before the source Jack shot can kill Barbossa', () => {
  const engine = makeEngine();
  prepareRitual(engine);
  const hp = boss(engine).currentHp;
  ready(engine.heroes[0]);
  assert.equal(engine.triggerPiratesCurseAction('restore-chest'), true);
  advance(engine, 17);
  assert.equal(boss(engine).currentHp, hp);
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, true);
  assert.equal(engine.getPiratesCurseEncounterState().ritualPending, true);
  advance(engine, 1);
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, false);
  assert.equal(engine.getPiratesCurseEncounterState().returnedPieces, 882);
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotFired, true);
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, false);
  assert.equal(boss(engine).currentHp, hp);
  assert.equal(engine.gameOver, false);
  advance(engine, 1);
  assert.equal(boss(engine).currentHp, 0);
  assert.equal(boss(engine).state, 'dead');
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, true);
  assert.equal(engine.gameOver, true);
});

test('the source duel wins with the remaining crew alive and mortal rather than requiring extra deaths', () => {
  const engine = makeEngine();
  restoreChest(engine);
  advance(engine, 122);
  assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp && enemy.state !== 'dead'));
  assert.equal(engine.piratesCurseEncounter.curseActive, false);
  assert.deepEqual(engine.completions, ['victory']);
  advance(engine, 200);
  assert.deepEqual(engine.completions, ['victory']);
});

test('source victory checks reject a partial ritual even if a legacy effect clears all HP', () => {
  for (const missingCondition of ['willBloodReady', 'jackBloodReady', 'sourceShotResolved', 'returnedPieces']) {
    const engine = makeEngine();
    Object.assign(engine.piratesCurseEncounter, {
      curseActive: false, returnedPieces: 882, willBloodReady: true, jackBloodReady: true,
      sourceShotFired: true, sourceShotResolved: true,
      [missingCondition]: missingCondition === 'returnedPieces' ? 881 : false
    });
    engine.enemies.forEach(enemy => Object.assign(enemy, { currentHp: 0, state: 'dead' }));
    engine.update();
    assert.equal(engine.gameOver, false, `${missingCondition} was bypassed by a generic kill quota`);
    assert.deepEqual(engine.completions, []);
  }
});

test('an isolated post-finale mortal crew fixture accepts exact external damage independent of buffs or defense', () => {
  const engine = makeEngine();
  openIsolatedMortalFixture(engine);
  const pirate = crew(engine)[0];
  const hero = engine.heroes[0];
  Object.assign(hero, { rpgBuffTicks: 1000, rpgBuffMultiplier: 9 });
  pirate.def = 9999;
  const hp = pirate.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, pirate, 17, { kind: 'field-super', attacker: hero }), 17);
  assert.equal(pirate.currentHp, hp - 17);
});

test('an isolated post-finale mortal crew fixture accepts ordinary internally calculated damage', () => {
  const engine = makeEngine();
  openIsolatedMortalFixture(engine);
  const pirate = crew(engine)[0];
  const hp = pirate.currentHp;
  const dealt = engine.applyDamage(engine.heroes[0], pirate, 30, 'infected');
  assert.ok(dealt > 0);
  assert.equal(pirate.currentHp, hp - dealt);
  assert.equal(pirate.statusEffects.infected, 300);
});

test('an isolated post-finale mortal crew fixture consumes its pickup shield once and honors nonlethal anomalies', () => {
  const engine = makeEngine();
  openIsolatedMortalFixture(engine);
  const pirate = crew(engine)[0];
  pirate.battleItemShield = 30;
  const hp = pirate.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, pirate, 50, { kind: 'battle-item', absorbBattleItemShield: true }), 20);
  assert.equal(pirate.currentHp, hp - 20);
  assert.equal(pirate.battleItemShield, 0);
  assert.equal(applyEncounterOrDirectDamage(engine, pirate, 99999, { kind: 'anomaly', nonlethal: true }), hp - 21);
  assert.equal(pirate.currentHp, 1);
  assert.notEqual(pirate.state, 'dead');
});

for (const attackFirst of [false, true]) {
  test(`an actual queued BFG cannot kill crew when ${attackFirst ? 'BFG' : 'restitution'} is commanded first in the same turn`, () => {
    const engine = makeEngine({ heroes: ['will_turner_potc', 'doomslayer'] });
    prepareRitual(engine);
    const will = engine.heroes[0];
    const doom = engine.heroes[1];
    ready(will);
    ready(doom);
    doom.specialCharge = 100;
    const restore = () => assert.equal(engine.triggerPiratesCurseAction('restore-chest', will), true);
    const fire = () => assert.equal(engine.triggerAbility(doom, 'special'), true);
    if (attackFirst) { fire(); restore(); } else { restore(); fire(); }
    advance(engine, 18);
    assert.equal(engine.getPiratesCurseEncounterState().curseActive, false);
    assert.equal(engine.getPiratesCurseEncounterState().cinematicLocked, true);
    assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, false);
    assert.equal(boss(engine).currentHp, boss(engine).maxHp);
    assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp && enemy.state !== 'dead'));
    advance(engine, 1);
    assert.equal(engine.gameOver, true);
    assert.equal(boss(engine).currentHp, 0);
    assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp && enemy.state !== 'dead'));
    advance(engine, 121);
    assert.deepEqual(engine.completions, ['victory']);
  });
}

test('a real BFG impact due on the source shot tick cannot interleave an extra crew death', () => {
  const engine = makeEngine({ heroes: ['will_turner_potc', 'doomslayer'] });
  prepareRitual(engine);
  ready(engine.heroes[0]);
  assert.equal(engine.triggerPiratesCurseAction('restore-chest', engine.heroes[0]), true);
  advance(engine, 1);
  ready(engine.heroes[1]);
  engine.heroes[1].specialCharge = 100;
  assert.equal(engine.triggerAbility(engine.heroes[1], 'special'), true);
  advance(engine, 18);
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, true);
  assert.equal(engine.gameOver, true);
  assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp && enemy.state !== 'dead'));
});

test('a pre-existing infection cannot damage mortal crew during the restitution finale', () => {
  const engine = makeEngine();
  prepareRitual(engine);
  ready(engine.heroes[0]);
  assert.equal(engine.triggerPiratesCurseAction('restore-chest'), true);
  advance(engine, 17);
  crew(engine).forEach(enemy => { enemy.statusEffects.infected = 61; });
  advance(engine, 1);
  assert.equal(engine.getPiratesCurseEncounterState().curseActive, false);
  assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp && enemy.statusEffects.infected === 60));
  advance(engine, 1);
  assert.equal(engine.gameOver, true);
  assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp));
});

test('invalid external amounts and unrelated heroes are handled without changing source objectives', () => {
  const engine = makeEngine();
  for (const amount of [NaN, Infinity, 0, -5]) assert.equal(engine.applyEncounterDamage(boss(engine), amount), true);
  assert.equal(engine.applyEncounterDamage(engine.heroes[0], 40), false);
  assert.equal(engine.applyEncounterDamage({}, 40), false);
  assert.equal(engine.getPiratesCurseEncounterState().phase, 'coins');
});

test('other Pirates missions and custom Barbossa battles keep ordinary waves and ordinary HP damage', () => {
  for (const stageOverride of [{ id: 999 }, { customBattle: { singleRoster: false } }]) {
    const engine = makeEngine({ stageOverride });
    assert.equal(engine.piratesCurseEncounter, null);
    assert.equal(engine.getPiratesCurseEncounterState(), null);
    assert.equal(engine.triggerPiratesCurseAction('collect-final-coins'), false);
    assert.equal(engine.wave, 1);
    assert.equal(engine.maxWaves, 2);
    assert.ok(engine.applyDamage(engine.heroes[0], engine.enemies[0], 50) > 0);
    assert.equal(engine.applyEncounterDamage(engine.enemies[0], 50), false);
  }
});

test('the original source trio can complete the whole mission automatically from constructor ATB and unchanged stats', t => {
  t.mock.method(Math, 'random', () => 0.5);
  const engine = makeEngine({ readyHeroes: false, suppressEnemyActions: false });
  const stats = engine.heroes.map(hero => structuredClone(hero.stats));
  const maximumHp = engine.enemies.map(enemy => enemy.maxHp);
  engine.autoBattle = true;
  for (let frame = 0; frame < 20000 && !engine.gameOver; frame++) engine.update();
  assert.equal(engine.gameOver, true);
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, true);
  assert.equal(boss(engine).currentHp, 0);
  assert.ok(engine.heroes.every(hero => hero.currentHp > 0));
  assert.ok(crew(engine).every(enemy => enemy.currentHp === enemy.maxHp));
  assert.deepEqual(engine.heroes.map(hero => hero.stats), stats);
  assert.deepEqual(engine.enemies.map(enemy => enemy.maxHp), maximumHp);
  advance(engine, 121);
  assert.deepEqual(engine.completions, ['victory']);
});

test('a solo crossover hero naturally recharges ATB for all three steps and does not impersonate Will', t => {
  t.mock.method(Math, 'random', () => 0.5);
  const engine = makeEngine({ heroes: ['marcus'], readyHeroes: false, suppressEnemyActions: false });
  const stats = structuredClone(engine.heroes[0].stats);
  engine.autoBattle = true;
  for (let frame = 0; frame < 20000 && !engine.gameOver; frame++) engine.update();
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, true);
  assert.ok(engine.heroes[0].currentHp > 0);
  assert.deepEqual(engine.heroes[0].stats, stats);
  assert.deepEqual(engine.getPiratesCurseEncounterState().sourceWill, { name: 'Will Turner', lineage: 'Bootstrap Bill Turner' });
  advance(engine, 121);
  assert.deepEqual(engine.completions, ['victory']);
});

test('dispose clears queued assistant steps and exposes no usable ritual command', () => {
  const engine = makeEngine();
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins'), true);
  engine.dispose();
  advance(engine, 200);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, false);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', engine.heroes[1]), false);
});

test('the other RPG source encounter still exposes RAAM only via his own Kryll rules', () => {
  const selected = CANON_PRIORITY_STAGES.lightmassTrain;
  const data = resolveStageEnemyData({ stage: selected, ...ENEMIES_DB[selected.universe] });
  const engine = new EngineRpg(760, 420, [getHeroById('marcus')], data, { add() {} }, () => {}, () => {}, selected);
  engines.push(engine);
  engine.wave = 2;
  engine.spawnWave();
  ready(engine.heroes[0]);
  engine.enemyGlobalRecovery = 99999;
  const raam = engine.enemies.find(enemy => enemy.name === 'General RAAM');
  assert.equal(engine.getPiratesCurseEncounterState(), null);
  assert.equal(engine.applyDamage(engine.heroes[0], raam, 99999), 0);
  assert.equal(engine.triggerRaamEncounterAction('frag'), true);
  advance(engine, 18);
  assert.equal(engine.getRaamEncounterState().shieldActive, false);
  assert.ok(engine.applyDamage(engine.heroes[0], raam, 30) > 0);
});
