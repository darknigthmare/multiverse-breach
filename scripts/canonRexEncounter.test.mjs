import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { createRexEncounter, REX_SOURCE_INCARNATION } from '../src/game/canonRexEncounter.js';
import { applyEncounterOrDirectDamage } from '../src/game/encounterDamage.js';
import { grantBattleItemShield } from '../src/game/battleItemShield.js';
import { applyCanonBlackPearlSourceKit } from '../src/game/canonBlackPearlSourceKits.js';

let vite;
let EngineTactics;
const engines = [];
const makeEngine = ({ stage = CANON_PRIORITY_STAGES.shadowMoses, heroes = [getHeroById('snake')], boosted = false } = {}) => {
  const squad = boosted ? heroes.map(hero => ({ ...hero, category: 'rex-isolation-fixture',
    stats: { ...hero.stats, hp: 5000, atk: 1000, spd: 30 } })) : heroes;
  const particles = [];
  const engine = new EngineTactics(760, 420, squad,
    resolveStageEnemyData({ stage, ...ENEMIES_DB[stage.universe] }),
    { add(...args) { particles.push(args); } }, () => {}, () => {}, stage);
  engines.push(engine);
  engine.timers.forEach(timer => clearTimeout(timer)); engine.timers.clear();
  // Skip animation waits only; enemy actions and every damage rule still run.
  engine.schedule = (callback, delay) => { if ([400, 500].includes(delay)) callback(); return null; };
  engine.testParticles = particles;
  return engine;
};
const settle = engine => { for (let i = 0; i < 36 && !engine.gameOver; i++) engine.update(); };
const nextHeroTurn = engine => {
  settle(engine);
  for (let i = 0; i < 20 && !engine.gameOver; i++) {
    engine.startTurn();
    if (engine.activeUnitType === 'hero') return;
    engine.runEnemyAI(); settle(engine);
  }
};
const moveTowardLegalShot = engine => {
  const hero = engine.activeUnit;
  const body = engine.rexEncounter.body;
  const candidates = engine.getReachableCells(hero, engine.movementBudget - engine.movementSpent)
    .map(cell => {
      const probe = { ...hero, gridX: cell.x, gridY: cell.y, _tacticsSourceUnit: hero };
      const profile = engine.getAttackProfile(probe, 'rex_stinger');
      const shot = engine.canAttackCell(probe, body, profile)
        && engine.getAttackTargets(probe, body, 'rex_stinger', 'hero').some(entry => entry.unit === body);
      return { cell, score: (shot ? 1000 : 0) - Math.abs(body.gridX - cell.x) - Math.abs(body.gridY - cell.y) };
    }).sort((a, b) => b.score - a.score);
  assert.ok(candidates[0]);
  assert.equal(engine.handleCellClick(candidates[0].cell.x, candidates[0].cell.y).handled, true);
};
const prepareLegalShot = engine => {
  for (let turn = 0; turn < 12 && !engine.gameOver; turn++) {
    if (engine.actionPhase === 'move') moveTowardLegalShot(engine);
    if (engine.getRexEncounterState().targetLegal) return;
    engine.endActiveTurn(); nextHeroTurn(engine);
  }
  assert.fail('normal movement must reach a legal Stinger line');
};
const fireThroughPlayerInput = engine => {
  assert.equal(engine.activeUnitType, 'hero');
  prepareLegalShot(engine);
  assert.equal(engine.selectRexStingerTarget(), true);
  const body = engine.rexEncounter.body;
  const beforeHp = engine.activeUnit.currentHp;
  return { ...engine.handleCellClick(body.gridX, body.gridY), beforeHp };
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

test('source stage 12 retains source roster templates and rewards but requires two REX targets', () => {
  const engine = makeEngine();
  const source = ENEMIES_DB['Metal Gear'].bosses.find(enemy => enemy.name === 'Metal Gear REX Shadow');
  assert.equal(engine.objective, 'rex_weakpoints');
  assert.equal(engine.objectiveTarget, 2);
  assert.equal(engine.rexEncounter.body.maxHp, source.hp);
  assert.equal(engine.rexEncounter.body.currentHp, 720);
  assert.equal(engine.rexEncounter.body.atk, source.atk);
  assert.equal(engine.rexEncounter.body.spd, source.spd);
  assert.equal(engine.stage.goldPrize, 90); assert.equal(engine.stage.shardPrize, 30);
  assert.deepEqual(engine.enemies.map(enemy => enemy.name), ['Genome Soldier Patrol', 'Genome Soldier Patrol', 'Genome Soldier Patrol', 'Metal Gear REX Shadow']);
  const state = engine.getRexEncounterState();
  assert.equal(state.phase, 'radome'); assert.equal(state.radomeHp, 360); assert.equal(state.cockpitHp, 360);
  assert.equal(state.bodyProtected, true); assert.equal(state.grayFoxAssistance, false);
  assert.equal(state.liquidSurvives, true);
});

test('source encounter guards mode, incarnation, universe, exclusive roster, boss and all custom flags', () => {
  const stage = CANON_PRIORITY_STAGES.shadowMoses;
  const engine = makeEngine();
  for (const patch of [
    { id: 2 }, { universe: 'Halo' }, { mode: 'RPG' }, { incarnation: 'Metal Gear Solid 4' },
    { enemyRosterExclusive: false }, { canonicalBossName: 'Metal Gear RAY' },
    { customBattle: {} }, { isCustomBattle: true }, { isCustom: true },
    { forceBaseArena: true }, { dlcSuppressedArena: true }
  ]) assert.equal(createRexEncounter({ ...stage, ...patch }, engine.battlefield, engine.enemies), null);
  assert.equal(createRexEncounter(stage, { ...engine.battlefield, id: 'generic' }, engine.enemies), null);
  assert.equal(createRexEncounter(stage, engine.battlefield, []), null);
  assert.equal(createRexEncounter(stage, engine.battlefield, [{ ...engine.rexEncounter.body, incarnation: 'Metal Gear Solid 4' }]), null);
  assert.equal(createRexEncounter(stage, engine.battlefield, [{ ...engine.rexEncounter.body, canonicalName: 'Metal Gear RAY' }]), null);
  assert.equal(engine.getCombatSummary().sourceEncounter.sourceIncarnation, REX_SOURCE_INCARNATION);
});

test('Stinger mission action preserves squad equipment and selects a legal single-target profile', () => {
  const sourceHero = getHeroById('snake');
  const engine = makeEngine();
  assert.equal(engine.heroes[0].weapon, sourceHero.weapon);
  assert.deepEqual(engine.heroes[0].secondary, sourceHero.secondary);
  assert.equal(engine.selectRexStingerTarget(), true);
  assert.equal(engine.selectedAction, 'rex_stinger');
  const profile = engine.getAttackProfile(engine.activeUnit, 'rex_stinger');
  assert.equal(profile.range, 6); assert.equal(profile.minRange, 2);
  assert.equal(profile.shape, 'single'); assert.equal(profile.maxTargets, 1);
  assert.equal(profile.requiresLineOfSight, true);
  assert.equal(engine.rexEncounter.missileShots, 0, 'selection never fires a missile');
  assert.equal(engine.selectRexStingerTarget(), true);
  assert.equal(engine.selectedAction, null); assert.equal(engine.actionPhase, 'move');
});

test('out-of-range or wrong-cell selections spend no missile, damage or turn', () => {
  const engine = makeEngine({ boosted: true });
  const body = engine.rexEncounter.body;
  assert.equal(engine.selectRexStingerTarget(), true);
  assert.equal(engine.handleCellClick(body.gridX, body.gridY).handled, false);
  assert.equal(engine.handleCellClick(0, 0).reason, 'rex-target-required');
  assert.equal(engine.turnsElapsed, 0); assert.equal(engine.rexEncounter.radomeHp, 360);
  assert.equal(engine.rexEncounter.missileShots, 0); assert.equal(engine.damageDealt, 0);
});

test('actual reachable-cell movement and a visible target click damage the radome, without spill into cockpit', () => {
  const engine = makeEngine({ boosted: true });
  const shot = fireThroughPlayerInput(engine);
  assert.equal(shot.handled, true); assert.equal(shot.action, 'rex_stinger');
  assert.equal(engine.rexEncounter.radomeHp, 0);
  assert.equal(engine.rexEncounter.cockpitHp, 360, 'overflow never shortcuts the phase transition');
  assert.equal(engine.damageDealt, 360, 'only actual target loss counts');
  assert.equal(engine.rexEncounter.body.currentHp, 720);
  assert.equal(engine.getRexEncounterState().phase, 'cockpit');
  assert.equal(engine.getRexEncounterState().grayFoxAssistance, true);
  assert.equal(engine.objectiveProgress, 1); assert.equal(engine.gameOver, false);
  assert.ok(engine.turnsElapsed >= 1);
  assert.ok(engine.testParticles.some(args => args.at(-1) === 'GRAY FOX : COCKPIT OUVERT'));
});

test('the second phase disables REX without killing Liquid or requiring the soldiers to die', () => {
  const engine = makeEngine({ boosted: true });
  assert.equal(fireThroughPlayerInput(engine).handled, true);
  nextHeroTurn(engine);
  assert.equal(fireThroughPlayerInput(engine).handled, true);
  assert.equal(engine.gameOver, true); assert.equal(engine.battleResult, 'victory');
  const summary = engine.getCombatSummary();
  assert.equal(summary.sourceEncounter.rexDisabled, true);
  assert.equal(summary.sourceEncounter.liquidSurvives, true);
  assert.equal(summary.sourceEncounter.completed, true);
  assert.equal(engine.rexEncounter.body.currentHp, 720);
  assert.equal(engine.enemies.filter(enemy => !enemy.isBoss).every(enemy => enemy.currentHp > 0), true);
  assert.match(engine.getObjectiveText('en'), /disabled; Liquid survives/);
  assert.equal(engine.objectiveProgress, 2);
  assert.equal(engine.selectRexStingerTarget(), false);
});

test('normal attacks, profiled specials and every external damage kind cannot drain REX or consume a shield', () => {
  const engine = makeEngine({ boosted: true });
  const body = engine.rexEncounter.body;
  grantBattleItemShield(body, 50);
  const shield = body.battleItemShield;
  const hero = engine.heroes[0]; hero.talent = 'lifedrain'; hero.currentHp -= 100;
  const hp = hero.currentHp;
  engine.applyDamage(hero, body, 999999, 'infected', { ignoreCover: true });
  assert.equal(hero.currentHp, hp, 'blocked attacks never generate lifedrain');
  for (const kind of ['battle-item', 'field-super', 'anomaly', 'ringout', 'hazard-pulse']) {
    assert.equal(applyEncounterOrDirectDamage(engine, body, 999999, { kind, absorbBattleItemShield: true }), 0);
    assert.equal(body.currentHp, 720);
  }
  assert.equal(applyEncounterOrDirectDamage(engine, body, 999999, { nonlethal: true }), 0);
  assert.equal(body.battleItemShield, shield);
  assert.equal(engine.damageDealt, 0); assert.equal(engine.rexEncounter.radomeHp, 360);
  assert.deepEqual(body.statusEffects, { infected: 0, glitched: 0, radiated: 0 });
  assert.equal(engine.getDamagePreview(hero, body, 'special').damage, 0);
});

test('ordinary enemy fixed external loss, optional shields and nonlethal floors are preserved', () => {
  const engine = makeEngine();
  const enemy = engine.enemies.find(actor => !actor.isBoss);
  const hp = enemy.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, enemy, 9, { kind: 'field-super' }), 9);
  assert.equal(enemy.currentHp, hp - 9);
  grantBattleItemShield(enemy, 6);
  assert.equal(applyEncounterOrDirectDamage(engine, enemy, 9, { absorbBattleItemShield: true }), 3);
  assert.equal(applyEncounterOrDirectDamage(engine, enemy, 999999, { nonlethal: true }), hp - 13);
  assert.equal(enemy.currentHp, 1); assert.equal(engine.gameOver, false);
});

test('tile hazards, pulses, infection and forced movement cannot substitute for target damage', () => {
  const engine = makeEngine();
  const body = engine.rexEncounter.body;
  const position = { x: body.gridX, y: body.gridY };
  body.statusEffects.infected = 61; body.statusEffects.glitched = 70;
  engine.tiles.push({ x: body.gridX, y: body.gridY, type: 'hazard' });
  engine.applyStartTileEffect(body); engine.applyHazardPulse();
  for (let i = 0; i < 80; i++) engine.update();
  engine.pushUnitHorizontally(body, -20);
  assert.deepEqual({ x: body.gridX, y: body.gridY }, position);
  assert.deepEqual(engine.getReachableCells(body, 20), [{ ...position, cost: 0 }]);
  assert.equal(body.currentHp, 720); assert.equal(engine.rexEncounter.radomeHp, 360);
  assert.deepEqual(body.statusEffects, { infected: 0, glitched: 0, radiated: 0 });
});

test('pauses, stunned actors, committed turns, enemy turns and disposed battles reject selection and fire', () => {
  const engine = makeEngine({ boosted: true });
  moveTowardLegalShot(engine);
  const body = engine.rexEncounter.body;
  engine.setPaused(true);
  assert.equal(engine.selectRexStingerTarget(), false);
  assert.equal(engine.handleCellClick(body.gridX, body.gridY).handled, false);
  engine.setPaused(false);
  engine.activeUnit.state = 'hit'; engine.activeUnit.stateTimer = 10;
  assert.equal(engine.selectRexStingerTarget(), false);
  engine.activeUnit.state = 'idle'; engine.activeUnit.stateTimer = 0;
  assert.equal(engine.selectRexStingerTarget(), true);
  engine.actionPhase = 'end'; assert.equal(engine.fireRexStingerAtCell(body.gridX, body.gridY).handled, false);
  engine.actionPhase = 'action'; engine.activeUnitType = 'enemy'; assert.equal(engine.selectRexStingerTarget(), false);
  engine.dispose(); assert.equal(engine.selectRexStingerTarget(), false);
  assert.equal(engine.rexEncounter.missileShots, 0);
});

test('a blocked firing line and the two-cell minimum deny an otherwise selected shot', () => {
  const engine = makeEngine({ boosted: true });
  prepareLegalShot(engine);
  const body = engine.rexEncounter.body;
  assert.equal(engine.selectRexStingerTarget(), true);
  assert.equal(engine.getRexEncounterState().targetLegal, true);
  // Explicit geometry-isolation fixtures: no progression claim is made from these edits.
  const hero = engine.activeUnit;
  hero.gridX = body.gridX - 1; hero.gridY = body.gridY;
  assert.equal(engine.fireRexStingerAtCell(body.gridX, body.gridY).handled, false);
  hero.gridX = body.gridX - 2;
  engine.obstacles.push({ gridX: body.gridX - 1, gridY: body.gridY, hp: 100, type: 'barrier' });
  assert.equal(engine.fireRexStingerAtCell(body.gridX, body.gridY).handled, false);
  assert.equal(engine.rexEncounter.missileShots, 0);
});

test('lifedrain uses actual phase loss and does not heal from missile overflow', () => {
  const engine = makeEngine({ boosted: true });
  const hero = engine.heroes[0]; hero.talent = 'lifedrain'; hero.currentHp -= 200;
  const shot = fireThroughPlayerInput(engine);
  assert.equal(shot.damage, 360);
  assert.equal(hero.currentHp, shot.beforeHp + 36);
});

test('generic HP zero edits cannot bypass either REX phase', () => {
  const engine = makeEngine();
  engine.rexEncounter.body.currentHp = 0; engine.rexEncounter.body.state = 'dead';
  engine.enemies.filter(enemy => !enemy.isBoss).forEach(enemy => { enemy.currentHp = 0; });
  engine.updateTacticsObjective();
  assert.equal(engine.gameOver, false); assert.equal(engine.rexEncounter.body.currentHp, 720);
  assert.equal(engine.rexEncounter.phase, 'radome'); assert.equal(engine.objectiveProgress, 0);
});

test('canvas phase markers change from RADOME to COCKPIT and never imply a Liquid kill', () => {
  const engine = makeEngine({ boosted: true });
  const drawn = [];
  const ctx = new Proxy({ fillText(text) { drawn.push(text); } }, { get(target, key) { return key in target ? target[key] : () => {}; } });
  engine.drawTacticsObjectiveZones(ctx, 0); assert.deepEqual(drawn, ['RADOME']);
  fireThroughPlayerInput(engine);
  drawn.length = 0; engine.drawTacticsObjectiveZones(ctx, 0); assert.deepEqual(drawn, ['COCKPIT']);
});

for (const auto of [false, true]) test(`unmodified squad stats finish both source targets through ${auto ? 'legal AI movement and attacks' : 'normal manual cell input'}`, () => {
  const heroes = ['snake', 'masterchief', 'leon'].map(getHeroById);
  const source = heroes.map(hero => ({ id: hero.id, stats: { ...hero.stats } }));
  const engine = makeEngine({ heroes });
  for (let i = 0; i < 100 && !engine.gameOver; i++) {
    if (engine.activeUnitType === 'hero') {
      if (auto) engine.runHeroAI();
      else {
        const result = fireThroughPlayerInput(engine);
        if (!result.handled) engine.endActiveTurn();
      }
    } else engine.runEnemyAI();
    settle(engine);
    if (!engine.gameOver) engine.startTurn();
  }
  assert.equal(engine.battleResult, 'victory');
  assert.equal(engine.rexEncounter.body.currentHp, 720);
  assert.equal(engine.rexEncounter.radomeHp, 0); assert.equal(engine.rexEncounter.cockpitHp, 0);
  assert.equal(engine.rexEncounter.grayFoxAssistance, true);
  assert.ok(engine.rexEncounter.missileShots >= 6);
  assert.ok(engine.heroes.some(hero => hero.currentHp > 0));
  for (const original of source) assert.equal(engine.heroes.find(hero => hero.id === original.id).stats.hp, original.stats.hp);
});

const makeJackEngine = (patch = {}) => makeEngine({
  stage: { ...CANON_PRIORITY_STAGES.shadowMoses, customBattle: {} },
  heroes: [{ ...applyCanonBlackPearlSourceKit(getHeroById('jack_sparrow_potc')), ...patch }], boosted: true
});
const positionJackForShot = engine => {
  for (let turn = 0; turn < 12 && !engine.gameOver; turn++) {
    const actor = engine.activeUnit;
    const moves = engine.getReachableCells(actor, engine.movementBudget - engine.movementSpent)
      .map(cell => {
        const probe = { ...actor, gridX: cell.x, gridY: cell.y, _tacticsSourceUnit: actor };
        const targets = engine.enemies.filter(enemy => enemy.currentHp > 0
          && engine.canAttackCell(probe, enemy, engine.getAttackProfile(probe, 'secondary')));
        const nearest = Math.min(...engine.enemies.map(enemy => Math.abs(enemy.gridX - cell.x) + Math.abs(enemy.gridY - cell.y)));
        return { cell, targets, score: (targets.length ? 1000 : 0) - nearest };
      }).sort((a, b) => b.score - a.score);
    assert.equal(engine.handleCellClick(moves[0].cell.x, moves[0].cell.y).handled, true);
    if (moves[0].targets.length) return moves[0].targets[0];
    engine.endActiveTurn(); nextHeroTurn(engine);
  }
  assert.fail('Jack must reach a normal four-cell pistol target');
};

test('Jack 2003 gets one reserved flintlock shot per new Tactics battle, reset only at construction', () => {
  const engine = makeJackEngine({ sourceAmmoRemaining: 0 });
  const jack = engine.heroes[0];
  assert.equal(jack.sourceAmmoRemaining, 1);
  assert.equal(jack.secondary.name, 'Reserved Flintlock Pistol Shot');
  const target = positionJackForShot(engine);
  assert.equal(engine.selectAction('secondary'), true);
  const result = engine.handleCellClick(target.gridX, target.gridY);
  assert.equal(result.handled, true); assert.equal(result.action, 'secondary');
  assert.equal(jack.sourceAmmoRemaining, 0);
  nextHeroTurn(engine);
  jack.cooldown = 0; // Resource-isolation fixture: resetting cooldown must not reset ammunition.
  const turns = engine.turnsElapsed;
  const charge = jack.specialCharge;
  assert.equal(engine.selectAction('secondary'), false);
  engine.selectedAction = 'secondary'; engine.actionPhase = 'action'; engine.calculateAttackRange();
  assert.equal(engine.handleCellClick(engine.enemies[0].gridX, engine.enemies[0].gridY).handled, false);
  assert.equal(engine.turnsElapsed, turns); assert.equal(jack.cooldown, 0); assert.equal(jack.specialCharge, charge);
  assert.equal(jack.sourceAmmoRemaining, 0);
  const newBattle = makeJackEngine({ sourceAmmoRemaining: jack.sourceAmmoRemaining });
  assert.equal(newBattle.heroes[0].sourceAmmoRemaining, 1);
});

test('invalid range, empty anchors and obstructed pistol lines consume no Jack ammunition', () => {
  const engine = makeJackEngine();
  const jack = engine.heroes[0];
  assert.equal(engine.selectAction('secondary'), true);
  assert.equal(engine.handleCellClick(8, 0).handled, false);
  assert.equal(jack.sourceAmmoRemaining, 1); assert.equal(jack.cooldown, 0); assert.equal(engine.turnsElapsed, 0);
  assert.deepEqual(engine.applyProfiledAttack(jack, { gridX: 8, gridY: 0 }, 'secondary', 999), []);
  assert.equal(jack.sourceAmmoRemaining, 1);
  engine.cancelSelectedAction();
  const target = positionJackForShot(engine);
  // Deliberately blocked geometry fixture isolates caller and profiled-hit validation.
  jack.gridX = target.gridX - 2; jack.gridY = target.gridY;
  engine.obstacles.push({ gridX: target.gridX - 1, gridY: target.gridY, type: 'barrier', hp: 100 });
  assert.deepEqual(engine.applyProfiledAttack(jack, target, 'secondary', 999), []);
  assert.equal(jack.sourceAmmoRemaining, 1);
});

test('Jack simple sword and special feint leave the reserved shot intact, while stale/depleted AI chooses sword', () => {
  const engine = makeJackEngine();
  const jack = engine.heroes[0];
  const target = positionJackForShot(engine);
  engine.applyProfiledAttack(jack, target, 'simple', 0);
  engine.applyProfiledAttack(jack, target, 'special', 0);
  assert.equal(jack.sourceAmmoRemaining, 1);
  jack.sourceAmmoRemaining = 0; jack.cooldown = 0; jack.specialCharge = 0;
  engine.cancelSelectedAction();
  let action;
  const apply = engine.applyProfiledAttack.bind(engine);
  engine.applyProfiledAttack = (...args) => { action = args[2]; return apply(...args); };
  engine.runHeroAI();
  assert.equal(action, 'simple'); assert.equal(jack.sourceAmmoRemaining, 0);
});

test('other Jack incarnations, missing/wrong universes and unreviewed profiles have no source ammo restriction', () => {
  for (const patch of [{ incarnation: 'Dead Man s Chest (2006)' }, { universe: 'Wrong Universe' },
    { universe: undefined }, { canonCombatPresentation: false }]) {
    const engine = makeJackEngine({ sourceAmmoRemaining: 0, ...patch });
    assert.equal(engine.heroes[0].sourceAmmoRemaining, 0, 'unmatched actors retain existing unrelated fields');
    assert.equal(engine.selectAction('secondary'), true);
  }
});

test('the duplicate custom enemy Jack receives an independent source reserve', () => {
  const jack = applyCanonBlackPearlSourceKit(getHeroById('jack_sparrow_potc'));
  const stage = { id: 'jack-p2-isolation', universe: 'Metal Gear', mode: 'Tactics', customBattle: { opponentControl: 'p2', singleRoster: true } };
  const engine = new EngineTactics(760, 420, [{ ...jack, stats: { ...jack.stats, spd: 100 } }],
    { customRoster: [{ ...jack, id: 'p2:jack_sparrow_potc:0', sourceId: jack.id, sourceAmmoRemaining: 0 }] },
    { add() {} }, () => {}, () => {}, stage);
  engines.push(engine); engine.timers.forEach(timer => clearTimeout(timer)); engine.timers.clear(); engine.schedule = () => null;
  assert.equal(engine.heroes[0].sourceAmmoRemaining, 1);
  assert.equal(engine.enemies[0].sourceAmmoRemaining, 1);
  engine.heroes[0].sourceAmmoRemaining = 0;
  assert.equal(engine.enemies[0].sourceAmmoRemaining, 1);
});

test('normal asynchronous engine timers complete REX with unchanged squad statistics', { timeout: 90000 }, async () => {
  const heroes = ['snake', 'masterchief', 'leon'].map(getHeroById);
  const stage = CANON_PRIORITY_STAGES.shadowMoses;
  let completed;
  const completion = new Promise(resolve => { completed = resolve; });
  const engine = new EngineTactics(760, 420, heroes,
    resolveStageEnemyData({ stage, ...ENEMIES_DB[stage.universe] }),
    { add() {} }, () => {}, (result, summary) => completed({ result, summary }), stage);
  engines.push(engine);
  engine.autoBattle = true;
  if (engine.activeUnitType === 'hero') engine.runHeroAI();
  // Normal frame cadence and original 400/500/600ms engine callbacks: no
  // source HP, ATB, coordinates, actor cooldowns or scheduling are overridden.
  const frames = setInterval(() => engine.update(), 16);
  let timeout;
  try {
    const outcome = await Promise.race([completion, new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error(JSON.stringify({ turns: engine.turnsElapsed,
        unit: engine.activeUnit?.id || engine.activeUnit?.name, type: engine.activeUnitType,
        phase: engine.actionPhase, actorState: engine.activeUnit?.state, timers: engine.timers.size,
        encounter: engine.getRexEncounterState(), heroes: engine.heroes.map(hero => ({ id: hero.id, hp: hero.currentHp })) }))), 75000);
    })]);
    assert.equal(outcome.result, 'victory');
    assert.equal(outcome.summary.sourceEncounter.rexDisabled, true);
    assert.equal(outcome.summary.sourceEncounter.liquidSurvives, true);
    assert.equal(engine.rexEncounter.body.currentHp, 720);
    assert.ok(engine.rexEncounter.missileShots >= 6);
    for (const hero of heroes) assert.equal(engine.heroes.find(actor => actor.id === hero.id).stats.hp, hero.stats.hp);
  } finally { clearInterval(frames); clearTimeout(timeout); }
});
