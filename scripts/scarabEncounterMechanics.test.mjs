import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { createScarabBoardingEncounter } from '../src/game/canonScarabEncounter.js';

let vite;
let EngineTactics;
const engines = [];
const makeEngine = (stage = CANON_PRIORITY_STAGES.metropolisScarab, options = {}) => {
  const particles = [];
  const hero = getHeroById('masterchief');
  const selectedHero = options.originalStats ? hero : { ...hero, category: 'scarab-test',
    stats: { ...hero.stats, hp: 5000, atk: 1000, spd: 20 } };
  const engine = new EngineTactics(760, 420, [selectedHero],
  resolveStageEnemyData({ stage, ...ENEMIES_DB[stage.universe] }),
  { add(...args) { particles.push(args); } }, () => {}, () => {}, stage);
  engines.push(engine);
  engine.timers.forEach(timer => clearTimeout(timer));
  engine.timers.clear();
  engine.schedule = options.synchronousCombat
    ? (callback, delay) => { if ([400, 500].includes(delay)) callback(); return null; }
    : () => null;
  engine.testParticles = particles;
  return engine;
};

const nextHeroTurn = engine => {
  for (let turn = 0; turn < 12 && !engine.gameOver; turn++) {
    engine.startTurn();
    if (engine.activeUnitType === 'hero') return;
    engine.endActiveTurn();
  }
};

const boardWithPlayerInput = engine => {
  for (let turn = 0; turn < 12 && !engine.scarabEncounter.boarded; turn++) {
    assert.equal(engine.activeUnitType, 'hero');
    const next = engine.getObjectiveRouteMove(engine.activeUnit);
    assert.ok(next, 'the boarding catwalk must be reachable');
    assert.equal(engine.handleCellClick(next.x, next.y).handled, true);
    if (!engine.gameOver) { engine.endActiveTurn(); nextHeroTurn(engine); }
  }
  assert.equal(engine.scarabEncounter.boarded, true);
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

test('the real stage 2 resolves an invulnerable Protos hull and its Grunt/Elite crew', () => {
  const engine = makeEngine();
  assert.equal(engine.objective, 'scarab_boarding');
  assert.deepEqual(engine.scarabEncounter.crew.map(enemy => enemy.name), ['Covenant Grunt', 'Elite Minor']);
  assert.equal(engine.scarabEncounter.hull.name, 'Covenant Scarab Mech');
  assert.equal(engine.scarabEncounter.hull.currentHp, ENEMIES_DB.Halo.worldBoss.hp);
  assert.equal(engine.objectiveTarget, 3);
  assert.equal(engine.enemies.find(enemy => enemy.name === 'Jackal Sniper').gridX, 3);
  assert.equal(engine.stage.id, 2);
  assert.equal(engine.stage.goldPrize, 40);
  assert.equal(engine.stage.shardPrize, 15);
});

test('weapon hits, specials and combat events cannot destroy Scarab hull HP', () => {
  const engine = makeEngine();
  const hull = engine.scarabEncounter.hull;
  const hp = hull.currentHp;
  engine.applyDamage(engine.heroes[0], hull, 999999, 'infected', { ignoreCover: true });
  assert.equal(hull.currentHp, hp);
  assert.equal(engine.damageDealt, 0);
  assert.equal(hull.statusEffects.infected, 0);
  assert.equal(engine.getDamagePreview(engine.heroes[0], hull, 'special').damage, 0);
  engine.triggerCombatEvent('fatman_nuke');
  assert.equal(hull.currentHp, hp);
  assert.equal(engine.gameOver, false, 'clearing the crew before boarding cannot win');
  assert.ok(engine.testParticles.some(particle => particle.at(-1) === 'COQUE IMMUNE'));
});

test('the optional damage hook protects external item damage and declines ordinary enemies', () => {
  const engine = makeEngine();
  const hull = engine.scarabEncounter.hull;
  assert.equal(engine.applyEncounterDamage(hull, 999999, { kind: 'item' }), true);
  assert.equal(hull.currentHp, hull.maxHp);
  assert.equal(engine.applyEncounterDamage(engine.scarabEncounter.crew[0], 10, { kind: 'item' }), false);
});

test('damage over time, tile hazards and hazard pulses do not drain the Protos hull', () => {
  const engine = makeEngine();
  const hull = engine.scarabEncounter.hull;
  hull.statusEffects.infected = 61;
  hull.statusEffects.glitched = 100;
  hull.state = 'hit'; hull.stateTimer = 300;
  engine.tiles.push({ x: hull.gridX, y: hull.gridY, type: 'hazard' });
  engine.applyStartTileEffect(hull);
  engine.applyHazardPulse();
  for (let frame = 0; frame < 70; frame++) engine.update();
  assert.equal(hull.currentHp, hull.maxHp);
  assert.deepEqual(hull.statusEffects, { infected: 0, glitched: 0, radiated: 0 });
  assert.equal(hull.state, 'idle');
});

test('the hull is stationary, resists forced movement and keeps its source crew on the deck', () => {
  const engine = makeEngine();
  const hull = engine.scarabEncounter.hull;
  const original = { x: hull.gridX, y: hull.gridY };
  assert.deepEqual(engine.getReachableCells(hull, 20), [{ ...original, cost: 0 }]);
  engine.pushUnitHorizontally(hull, -3);
  assert.deepEqual({ x: hull.gridX, y: hull.gridY }, original);
  assert.ok(engine.getReachableCells(engine.scarabEncounter.crew[0], 20).every(cell => cell.x >= 5));
});

test('normal player cell input boards through the catwalk and records the boarding hero once', () => {
  const engine = makeEngine();
  assert.match(engine.getObjectiveText('en'), /board Scarab/);
  assert.equal(engine.isBlockedTile(4, 2), true);
  assert.equal(engine.isBlockedTile(4, 1), false);
  boardWithPlayerInput(engine);
  assert.equal(engine.scarabEncounter.boardedBy, engine.heroes[0].id);
  assert.equal(engine.objectiveProgress, 1);
  assert.equal(engine.objectiveEvents, 1);
  assert.equal(engine.gameOver, false);
  assert.match(engine.getObjectiveText('en'), /clear Scarab crew \(2\)/);
  for (let frame = 0; frame < 20; frame++) engine.updateTacticsObjective();
  assert.equal(engine.objectiveEvents, 1);
});

test('the real canvas objective draws BOARD before boarding and living CREW afterward', () => {
  const engine = makeEngine();
  const drawn = [];
  const ctx = new Proxy({ fillText(text) { drawn.push(text); } }, {
    get(target, key) { return key in target ? target[key] : () => {}; }
  });
  engine.drawTacticsObjectiveZones(ctx, 0);
  assert.deepEqual(drawn, ['BOARD']);
  boardWithPlayerInput(engine);
  drawn.length = 0;
  engine.drawTacticsObjectiveZones(ctx, 0);
  assert.deepEqual(drawn, ['CREW', 'CREW']);
  engine.applyDamage(engine.heroes[0], engine.scarabEncounter.crew[0], 999999);
  drawn.length = 0;
  engine.drawTacticsObjectiveZones(ctx, 0);
  assert.deepEqual(drawn, ['CREW']);
});

test('boarding alone and eliminating only one crew member leave the mission active', () => {
  const engine = makeEngine();
  boardWithPlayerInput(engine);
  engine.applyDamage(engine.heroes[0], engine.scarabEncounter.crew[0], 999999);
  engine.update();
  assert.equal(engine.objectiveProgress, 2);
  assert.equal(engine.gameOver, false);
});

test('neutralizing boarded crew wins while the hull and urban sniper remain alive', () => {
  const engine = makeEngine();
  boardWithPlayerInput(engine);
  engine.scarabEncounter.crew.forEach(crew => engine.applyDamage(engine.heroes[0], crew, 999999));
  assert.equal(engine.battleResult, 'victory');
  assert.equal(engine.scarabEncounter.hull.currentHp, engine.scarabEncounter.hull.maxHp);
  assert.ok(engine.enemies.find(enemy => enemy.name === 'Jackal Sniper').currentHp > 0);
  const summary = engine.getCombatSummary();
  assert.equal(summary.objectivePct, 100);
  assert.equal(summary.sourceEncounter.crewTotal, 2);
  assert.equal(summary.sourceEncounter.hullDestroyed, false);
  assert.equal(summary.sourceEncounter.completed, true);
});

test('crew can be shot before boarding, but victory still requires normal boarding input', () => {
  const engine = makeEngine();
  engine.scarabEncounter.crew.forEach(crew => engine.applyDamage(engine.heroes[0], crew, 999999));
  engine.update();
  assert.equal(engine.objectiveProgress, 2);
  assert.equal(engine.gameOver, false);
  boardWithPlayerInput(engine);
  assert.equal(engine.battleResult, 'victory');
});

test('the actual hero and enemy AI can complete boarding and crew neutralization', () => {
  const engine = makeEngine(CANON_PRIORITY_STAGES.metropolisScarab, { synchronousCombat: true });
  const hp = engine.scarabEncounter.hull.currentHp;
  for (let turn = 0; turn < 120 && !engine.gameOver; turn++) {
    engine.activeUnit.state = 'idle';
    engine.activeUnit.stateTimer = 0;
    if (engine.activeUnitType === 'hero') engine.runHeroAI();
    else engine.runEnemyAI();
    for (let frame = 0; frame < 35 && !engine.gameOver; frame++) engine.update();
    engine.startTurn();
  }
  assert.equal(engine.battleResult, 'victory');
  assert.equal(engine.scarabEncounter.boarded, true);
  assert.equal(engine.scarabEncounter.hull.currentHp, hp);
});

test('Master Chief can board and clear the crew through actual AI with his original statistics', t => {
  let seed = 1;
  t.mock.method(Math, 'random', () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  });
  const engine = makeEngine(CANON_PRIORITY_STAGES.metropolisScarab, {
    synchronousCombat: true, originalStats: true
  });
  const originalStats = structuredClone(getHeroById('masterchief').stats);
  assert.deepEqual(engine.heroes[0].stats, originalStats);
  assert.equal(engine.heroes[0].maxHp, originalStats.hp);
  for (let turn = 0; turn < 180 && !engine.gameOver; turn++) {
    engine.activeUnit.state = 'idle';
    engine.activeUnit.stateTimer = 0;
    if (engine.activeUnitType === 'hero') engine.runHeroAI();
    else engine.runEnemyAI();
    for (let frame = 0; frame < 35 && !engine.gameOver; frame++) engine.update();
    engine.startTurn();
  }
  assert.equal(engine.battleResult, 'victory');
  assert.equal(engine.scarabEncounter.boarded, true);
  assert.ok(engine.scarabEncounter.crew.every(crew => crew.currentHp <= 0));
  assert.equal(engine.scarabEncounter.hull.currentHp, ENEMIES_DB.Halo.worldBoss.hp);
  assert.ok(engine.heroes[0].currentHp > 0);
  assert.deepEqual(engine.heroes[0].stats, originalStats);
  assert.equal(engine.heroes[0].maxHp, originalStats.hp);
});

test('the entire defeated squad loses even if crew was neutralized', () => {
  const engine = makeEngine();
  engine.scarabEncounter.crew.forEach(crew => { crew.currentHp = 0; });
  engine.heroes.forEach(hero => { hero.currentHp = 0; });
  engine.update();
  assert.equal(engine.battleResult, 'defeat');
});

test('a missing crew cannot certify an empty boarding encounter as victory', () => {
  const stage = CANON_PRIORITY_STAGES.metropolisScarab;
  const encounter = createScarabBoardingEncounter(stage, { id: stage.tacticsBattlefieldId }, [{ name: 'Covenant Scarab Mech' }]);
  assert.equal(encounter.complete, false);
  assert.deepEqual(encounter.crew, []);
});

test('Shadow Moses REX remains an ordinary damageable commander encounter', () => {
  const engine = makeEngine(CANON_PRIORITY_STAGES.shadowMoses);
  assert.equal(engine.scarabEncounter, null);
  assert.equal(engine.objective, 'commander');
  const rex = engine.enemies.find(enemy => enemy.isBoss);
  assert.equal(engine.applyEncounterDamage(rex, 10), false);
  const hp = rex.currentHp;
  engine.applyDamage(engine.heroes[0], rex, 10);
  assert.ok(rex.currentHp < hp);
  assert.equal(engine.stage.id, 12);
});

test('custom matches do not inherit campaign-only hull immunity', () => {
  const stage = { ...CANON_PRIORITY_STAGES.metropolisScarab, customBattle: { opponentControl: 'p2' } };
  const engine = makeEngine(stage);
  assert.equal(engine.scarabEncounter, null);
  const hull = engine.enemies.find(enemy => enemy.name === 'Covenant Scarab Mech');
  const hp = hull.currentHp;
  engine.applyDamage(engine.heroes[0], hull, 10);
  assert.ok(hull.currentHp < hp);
});

test('restarting stage 2 clears boarding progress without mutating its shared battlefield', () => {
  const first = makeEngine();
  boardWithPlayerInput(first);
  const second = makeEngine();
  assert.equal(second.scarabEncounter.boarded, false);
  assert.equal(second.objectiveProgress, 0);
  assert.equal(second.tiles.filter(tile => tile.x === 4 && tile.type === 'blocked').length, 5);
});
