import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

let vite;
let EngineTactics;
const engines = [];
const makeEngine = objective => {
  const hero = {
    id: 'mission-hero', name: 'Mission Hero', universe: 'Nexus de Convergence', category: 'objective-test',
    stats: { hp: 1000, atk: 100, def: 0, spd: 20 },
    simple: { name: 'Strike', type: 'melee', dmg: 1 }, secondary: { name: 'Shot', type: 'bullet', dmg: 1.5, cd: 3 },
    defense: { name: 'Guard', reduce: 0.4, dur: 2 }, special: { name: 'Burst', dmg: 2 }
  };
  const enemy = { id: 'mission-enemy', name: 'Mission Enemy', hp: 1000, atk: 10, def: 0, spd: 1, weapon: 'melee' };
  const engine = new EngineTactics(760, 420, [hero], { monsters: [enemy], bosses: [], customRoster: [enemy] },
    { add() {} }, () => {}, () => {},
    { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine);
  engine.objective = objective;
  engine.objectiveTarget = 2;
  engine.tiles = [];
  engine.obstacles = [];
  engine.protectedArtifact = { hp: 100, maxHp: 100, gridX: 3, gridY: 2 };
  engine.battlefield = { ...engine.battlefield, extractionZone: [{ x: 4, y: 2 }] };
  engine.enemies[0].currentHp = 0;
  return engine;
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

for (const objective of ['extract', 'portals', 'artifact', 'protect', 'control', 'disable', 'survive']) {
  test(`${objective} mission cannot win just by clearing its enemies`, () => {
    const engine = makeEngine(objective);
    engine.update();
    assert.equal(engine.gameOver, false);
    assert.equal(engine.objectiveProgress, 0);
    if (objective === 'extract') {
      engine.objectiveTarget = 1;
      Object.assign(engine.heroes[0], { gridX: 4, gridY: 2 });
    } else if (objective === 'portals') engine.sealedPortalKeys = new Set(['a', 'b']);
    else if (objective === 'artifact') engine.collectedArtifactKeys = new Set(['a', 'b']);
    else if (objective === 'control') {
      engine.tiles = [{ x: engine.heroes[0].gridX, y: engine.heroes[0].gridY, type: 'objective' }];
      engine.objectiveProgress = 1;
    } else if (objective === 'disable') engine.obstacles = [{ type: 'objective', hp: 0 }, { type: 'objective', hp: 0 }];
    else engine.turnsElapsed = 2;
    engine.updateTacticsObjective(objective === 'control');
    assert.equal(engine.gameOver, true);
    assert.equal(engine.battleResult, 'victory');
  });
}

test('rout mission still wins when its enemies are cleared', () => {
  const engine = makeEngine('rout');
  engine.update();
  assert.equal(engine.battleResult, 'victory');
});

test('destroyed protected artifact defeats even when every enemy was killed', () => {
  const engine = makeEngine('protect');
  engine.protectedArtifact.hp = 0;
  engine.update();
  assert.equal(engine.battleResult, 'defeat');
});

test('dead enemies at the end of the turn queue do not strand the remaining mission', () => {
  const engine = makeEngine('extract');
  engine.turnQueue = [{ unit: engine.enemies[0], type: 'enemy' }];
  engine.activeUnit = null;
  engine.startTurn();
  assert.equal(engine.activeUnit, engine.heroes[0]);
  assert.equal(engine.actionPhase, 'move');
});

test('completed mission ignores a late turn callback', () => {
  const engine = makeEngine('protect');
  engine.completeBattle('victory');
  const active = engine.activeUnit;
  const turns = engine.turnsElapsed;
  engine.turnQueue = [{ unit: engine.enemies[0], type: 'enemy' }];
  engine.enemies[0].currentHp = 100;
  engine.startTurn();
  engine.runEnemyAI();
  assert.equal(engine.activeUnit, active);
  assert.equal(engine.turnsElapsed, turns);
});

test('control progresses once per completed turn, never once per frame or damage event', () => {
  const engine = makeEngine('control');
  const hero = engine.heroes[0];
  engine.tiles = [{ x: hero.gridX, y: hero.gridY, type: 'objective' }];
  for (let frame = 0; frame < 120; frame++) engine.update();
  engine.updateTacticsObjective();
  assert.equal(engine.objectiveProgress, 0);
  engine.endActiveTurn();
  assert.equal(engine.objectiveProgress, 1);
  engine.updateTacticsObjective();
  assert.equal(engine.objectiveProgress, 1);
  engine.startTurn();
  engine.endActiveTurn();
  assert.equal(engine.battleResult, 'victory');
});

for (const objective of ['extract', 'portals', 'artifact', 'control']) {
  test(`auto battle finishes ${objective} after clearing enemies, including a detour`, () => {
    const engine = makeEngine(objective);
    engine.cols = 7;
    engine.rows = 5;
    engine.objectiveTarget = 1;
    engine.protectedArtifact = null;
    engine.schedule = () => null;
    engine.battlefield.extractionZone = [{ x: 4, y: 2 }];
    const type = { portals: 'portalSpawn', artifact: 'artifact', control: 'objective' }[objective];
    engine.tiles = [0, 1, 2, 3].map(y => ({ x: 3, y, type: 'blocked' }));
    if (type) engine.tiles.push({ x: 4, y: 2, type });
    Object.assign(engine.heroes[0], { gridX: 2, gridY: 2 });
    engine.turnQueue = [];
    for (let turn = 0; turn < 12 && !engine.gameOver; turn++) {
      engine.startTurn();
      engine.runHeroAI();
    }
    assert.equal(engine.battleResult, 'victory');
  });
}

test('auto battle disables the remaining devices after clearing enemies', () => {
  const engine = makeEngine('disable');
  engine.objectiveTarget = 1;
  engine.cols = 7;
  engine.rows = 5;
  engine.protectedArtifact = null;
  engine.tiles = [0, 1, 2, 3].map(y => ({ x: 3, y, type: 'blocked' }));
  engine.obstacles = [{ type: 'objective', gridX: 4, gridY: 2, hp: 200 }];
  engine.heroes[0].secondary.type = 'melee';
  engine.schedule = (callback, delay) => { if (delay === 500) callback(); return null; };
  Object.assign(engine.heroes[0], { gridX: 2, gridY: 2 });
  engine.turnQueue = [];
  for (let turn = 0; turn < 8 && !engine.gameOver; turn++) {
    engine.startTurn();
    engine.heroes[0].state = 'idle';
    engine.runHeroAI();
  }
  assert.equal(engine.obstacles[0].hp, 0);
  assert.equal(engine.battleResult, 'victory');
});

test('repeated end-turn input cannot advance a mission twice or schedule parallel turns', () => {
  const engine = makeEngine('control');
  const hero = engine.heroes[0];
  engine.tiles = [{ x: hero.gridX, y: hero.gridY, type: 'objective' }];
  engine.endActiveTurn();
  engine.endActiveTurn();
  assert.equal(engine.turnsElapsed, 1);
  assert.equal(engine.objectiveProgress, 1);
  assert.equal(engine.timers.size, 1);
});
