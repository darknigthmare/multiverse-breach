import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { faceGridUnitToward, getGridFacingBonus, getGridFacingVector } from '../src/game/tacticalFacing.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const noop = () => {};
const particles = { add: noop };
const disposableEngines = [];
let vite;
let EngineTactics;
let EngineFighter;
let EngineSmash;

before(async () => {
  vite = await createServer({
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });
  [{ EngineTactics }, { EngineFighter }, { EngineSmash }] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineTactics.js?facing-regressions'),
    vite.ssrLoadModule('/src/game/engineFighter.js?facing-regressions'),
    vite.ssrLoadModule('/src/game/engineSmash.js?facing-regressions')
  ]);
});
afterEach(() => disposableEngines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

const makeHero = (id = 'hero') => ({
  id, name: id, universe: 'Nexus de Convergence', category: 'facing-test',
  primaryColor: '#39c5bb', secondaryColor: '#ffea00', weaponType: 'melee',
  stats: { hp: 180, atk: 18, def: 9, spd: 15 },
  simple: { name: 'Strike', dmg: 1 },
  secondary: { name: 'Burst', dmg: 1.3, cd: 3 },
  defense: { name: 'Guard', reduce: 0.4, dur: 1 },
  special: { name: 'Rupture', dmg: 1.8 }
});
const makeThreat = () => ({
  id: 'threat', name: 'Threat', universe: 'Nexus de Convergence',
  hp: 200, atk: 16, def: 7, spd: 8, color: '#e74c3c', weapon: 'melee'
});
const makeEnemyData = () => {
  const threat = makeThreat();
  return { monsters: [threat], bosses: [], worldBoss: null, customRoster: [threat] };
};
const makeStage = (mode, opponentControl = 'p2') => ({
  id: 'facing-tests', universe: 'Nexus de Convergence', mode,
  customBattle: { opponentControl, singleRoster: true }
});
const makeTactics = () => {
  const engine = new EngineTactics(760, 420, [makeHero()], makeEnemyData(), particles, noop, noop, makeStage('Tactics'));
  disposableEngines.push(engine);
  engine.obstacles = [];
  engine.tiles = [];
  engine.cols = 8;
  engine.rows = 5;
  engine.escortUnit = null;
  engine.protectedArtifact = null;
  engine.objective = 'rout';
  Object.assign(engine.heroes[0], { gridX: 2, gridY: 2, facing: 1, facingVector: { x: 1, y: 0 } });
  Object.assign(engine.enemies[0], { gridX: 5, gridY: 2, facing: -1, facingVector: { x: -1, y: 0 } });
  engine.activeUnit = engine.heroes[0];
  engine.activeUnitType = 'hero';
  engine.actionPhase = 'move';
  engine.movementBudget = 2;
  engine.movementSpent = 0;
  engine.calculateMovementRange();
  return engine;
};
const makeFighter = () => {
  const engine = new EngineFighter(960, 540, [makeHero()], [makeHero('cpu')], particles, noop, noop, { opponentControl: 'p2' });
  engine.countdown = 0;
  engine.getActive('player').meter = 100;
  engine.getActive('cpu').meter = 100;
  return engine;
};

for (const vector of [
  { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
  { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }
]) {
  test(`Tactics distinguishes front/back/flank for heading ${vector.x},${vector.y}`, () => {
    const defender = { gridX: 3, gridY: 3, facing: 1 };
    faceGridUnitToward(defender, { x: 3 + vector.x, y: 3 + vector.y });
    assert.deepEqual(getGridFacingVector(defender), vector);
    assert.equal(getGridFacingBonus({ gridX: 3 + vector.x, gridY: 3 + vector.y }, defender).bonus, 0);
    assert.deepEqual(getGridFacingBonus({ gridX: 3 - vector.x, gridY: 3 - vector.y }, defender), { bonus: 0.25, label: 'BACK' });
    assert.deepEqual(getGridFacingBonus({ gridX: 3 - vector.y, gridY: 3 + vector.x }, defender), { bonus: 0.12, label: 'FLANK' });
  });
}

test('Tactics does not award back/flank bonuses on objects or zero-length attacks', () => {
  assert.equal(getGridFacingBonus({ gridX: 1, gridY: 2 }, { gridX: 2, gridY: 2, hp: 40 }).bonus, 0);
  assert.equal(getGridFacingBonus({ gridX: 2, gridY: 2 }, { gridX: 2, gridY: 2, facing: 1 }).bonus, 0);
  assert.equal(getGridFacingBonus({ gridX: 3, gridY: 6 }, { gridX: 2, gridY: 2, facingVector: { x: 1, y: -1 } }).label, 'BACK');
});

test('Tactics vertical moves and attacks record north/south without arbitrary sprite flips', () => {
  const engine = makeTactics();
  const hero = engine.heroes[0];
  Object.assign(engine.enemies[0], { gridX: 2, gridY: 0 });
  assert.equal(engine.handleCellClick(2, 1).handled, true);
  assert.deepEqual(engine.getFacingVector(hero), { x: 0, y: -1 });
  assert.equal(hero.facing, 1);
  const hit = engine.handleCellClick(2, 0);
  assert.equal(hit.handled, true);
  assert.equal(hit.type, 'action');
  assert.deepEqual(engine.getFacingVector(hero), { x: 0, y: -1 });
});

test('Tactics P2 movements use the same two-dimensional heading as P1', () => {
  const engine = makeTactics();
  engine.activeUnit = engine.enemies[0];
  engine.activeUnitType = 'enemy';
  engine.calculateMovementRange();
  assert.equal(engine.handleCellClick(5, 3).handled, true);
  assert.deepEqual(engine.getFacingVector(engine.activeUnit), { x: 0, y: 1 });
  assert.equal(engine.activeUnit.facing, -1);
});

test('Tactics turn entry and reinforcements face the actual opposing squad', () => {
  const engine = makeTactics();
  const hero = engine.heroes[0];
  const enemy = engine.enemies[0];
  Object.assign(hero, { gridX: 6, gridY: 3 });
  Object.assign(enemy, { gridX: 6, gridY: 0 });
  engine.turnQueue = [{ unit: enemy, type: 'enemy' }];
  engine.startTurn();
  assert.deepEqual(engine.getFacingVector(enemy), { x: 0, y: 1 });
  engine.findOpenTacticsSpawn = () => ({ x: 1, y: 3 });
  engine.spawnTacticsReinforcement();
  const reinforcement = engine.enemies.at(-1);
  assert.equal(reinforcement.facing, 1);
  assert.deepEqual(engine.getFacingVector(reinforcement), { x: 1, y: 0 });
});

test('Tactics escort preserves vertical travel heading', () => {
  const engine = makeTactics();
  engine.objective = 'escort';
  engine.escortUnit = { gridX: 3, gridY: 2, currentHp: 120, facing: -1 };
  engine.battlefield = { ...engine.battlefield, extractionZone: [{ x: 3, y: 0 }] };
  engine.advanceEscortUnit();
  assert.equal(engine.escortUnit.gridY, 1);
  assert.deepEqual(engine.getFacingVector(engine.escortUnit), { x: 0, y: -1 });
  assert.equal(engine.escortUnit.facing, -1);
});

test('Tactics forced movement stops before terrain and occupants, preserving facing', () => {
  const engine = makeTactics();
  const enemy = engine.enemies[0];
  Object.assign(enemy, { gridX: 3, gridY: 1 });
  engine.tiles = [{ x: 5, y: 1, type: 'blocked' }];
  engine.pushUnitHorizontally(enemy, 2);
  assert.equal(enemy.gridX, 4);
  assert.equal(enemy.facing, -1);
  assert.deepEqual(engine.getFacingVector(enemy), { x: -1, y: 0 });
  engine.tiles = [];
  Object.assign(engine.heroes[0], { gridX: 5, gridY: 1 });
  engine.pushUnitHorizontally(enemy, 2);
  assert.equal(enemy.gridX, 4);
});

test('Tactics forced movement checks the whole boss footprint', () => {
  const engine = makeTactics();
  const enemy = engine.enemies[0];
  Object.assign(enemy, { gridX: 3, gridY: 1, tacticsFootprint: { width: 2, height: 2 } });
  engine.obstacles = [{ gridX: 5, gridY: 2, hp: 50 }];
  engine.pushUnitHorizontally(enemy, 2);
  assert.equal(enemy.gridX, 3);
});

test('Fighter commits toward the rival after crossing and does not turn mid-swing', () => {
  const engine = makeFighter();
  const player = engine.getActive('player');
  const cpu = engine.getActive('cpu');
  Object.assign(player, { x: 500, facing: 1 });
  Object.assign(cpu, { x: 430, facing: -1 });
  assert.equal(engine.tryAction('player', 'light'), true);
  assert.equal(player.facing, -1);
  assert.equal(player.action.facing, -1);
  const hp = cpu.currentHp;
  cpu.x = 570;
  engine.resolveSpacing();
  engine.updateActions(0.12);
  assert.equal(player.facing, -1);
  assert.equal(cpu.currentHp, hp, 'a committed strike must not hit an opponent who crossed behind it');
});

test('Fighter refreshes guard facing before same-frame hit resolution', () => {
  const engine = makeFighter();
  const player = engine.getActive('player');
  const cpu = engine.getActive('cpu');
  Object.assign(player, { x: 500, facing: 1 });
  Object.assign(cpu, { x: 430 });
  engine.setSideInput('player', { guard: true });
  engine.updateControlledSide('player', 1 / 60);
  assert.equal(player.facing, -1);
  assert.equal(player.guarding, true);
});

for (const guardFacing of [-1, 1]) {
  test(`Fighter projectile guard and knockback follow incoming travel with defender facing ${guardFacing}`, () => {
    const engine = makeFighter();
    const owner = engine.getActive('player');
    const target = engine.getActive('cpu');
    Object.assign(owner, { x: 200, facing: 1 });
    Object.assign(target, { x: 500, facing: guardFacing, guarding: true });
    engine.spawnProjectile(owner, { type: 'special', facing: 1, base: 23, guardDamage: 24, knockback: 245 });
    // The owner crosses/turns after firing; the bolt still arrives from left.
    Object.assign(owner, { x: 650, facing: -1 });
    engine.projectiles[0].x = 490;
    engine.updateProjectiles(0.02);
    assert.equal(engine.projectiles.length, 0);
    assert.ok(target.vx > 0, 'knockback must follow projectile travel, not owner facing');
    assert.equal(target.guard < 100, guardFacing === -1);
    assert.equal(target.hitstun > 0, guardFacing === 1);
  });
}

test('Fighter projectile K.O. direction survives an owner turn', () => {
  const engine = makeFighter();
  const owner = engine.getActive('player');
  const target = engine.getActive('cpu');
  Object.assign(owner, { x: 650, facing: -1 });
  Object.assign(target, { x: 500, currentHp: 1 });
  engine.projectiles.push({ side: 'player', owner, x: 490, y: target.y - 64, vx: 520, radius: 13, life: 1, action: { type: 'special', base: 23, guardDamage: 24, knockback: 245 } });
  engine.updateProjectiles(0.02);
  assert.equal(target.currentHp, 0);
  assert.ok(target.vx > 0);
});

test('Smash campaign enemies keep their committed attack pose and facing through recovery', () => {
  const engine = new EngineSmash(760, 420, [makeHero()], makeEnemyData(), particles, noop, noop, makeStage('Smash', 'cpu'));
  engine.syncPreMatchFromServer(3000);
  const hero = engine.getActiveHero();
  const enemy = engine.enemies[0];
  Object.assign(hero, { x: 280, y: engine.groundY, state: 'idle' });
  Object.assign(enemy, { x: 340, y: engine.groundY, state: 'attack', stateTimer: 20, facing: 1, cooldown: 60 });
  engine.update({});
  assert.equal(enemy.state, 'attack');
  assert.equal(enemy.stateTimer, 19);
  assert.equal(enemy.facing, 1, 'the rival crossing behind must not cancel attack recovery');
  enemy.stateTimer = 1;
  engine.update({});
  assert.equal(enemy.facing, -1, 'the enemy may face the rival again after recovery');
});
