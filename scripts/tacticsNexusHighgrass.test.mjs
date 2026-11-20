import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { TACTICS_NEXUS_HIGHGRASS_BATTLEFIELD as field } from '../src/game/tacticsNexusHighgrassBattlefield.js';
import {
  canOccupyTerrainSurface, findTerrainPath, getSurfacesAt, getTerrainNeighbors,
  normalizeTacticsTerrain, terrainLineOfSight, getTerrainUnitFootprint
} from '../src/game/tacticsTerrain.js';
import { TACTICS_TERRAIN_MATERIALS } from '../src/game/tacticsTerrainRenderer.js';
import { getTacticsEnvironmentProfile } from '../src/game/tacticsEnvironmentRenderer.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { getTacticsBattlefield, getTacticsPickupPositions, TACTICS_BATTLEFIELDS } = await import('../src/game/tacticsBattlefields.js');
const { buildCustomRuntimeStage, normalizeCustomBattlePreset } = await import('../src/game/customBattle.js');
const { EngineTactics } = await import('../src/game/engineTactics.js');

const cell = (x, y) => `${field.id}:ground:${x}:${y}`;
const relay = cell(7, 4);
const north = cell(3, 1);
const south = cell(4, 7);
const isBlocked = surface => field.obstacles.some(obstacle => obstacle.surfaceId === surface.id);
const human = { tacticsHeight: 1.6 };
const giant = { tacticsHeight: 3, tacticsFootprint: { width: 2, height: 2 } };
const options = { unit: human, isBlocked };

test('both western climbs and the eastern staircase physically reach the ridge', () => {
  const terrain = normalizeTacticsTerrain(field);
  for (const [blockedGate, routeGate, shape, expectedCost] of [
    [south, north, 'stairs', 15],
    [north, south, 'ramp', 16]
  ]) {
    const routes = { ...options, isBlocked: surface => isBlocked(surface) || surface.id === blockedGate };
    const approach = findTerrainPath(terrain, field.heroSpawns[0], relay, routes);
    assert.equal(approach.cost, expectedCost);
    assert.ok(approach.path.includes(routeGate));
    assert.equal(terrain.byId.get(routeGate).shape, shape);
    assert.ok(approach.transitions.some(link => link.to === routeGate && link.cost === 2));
    assert.ok(findTerrainPath(terrain, relay, field.heroSpawns[0], routes), 'a human can descend the same route');
  }
  const east = findTerrainPath(terrain, field.monsterSpawns[1], relay, options);
  assert.ok(east.path.includes(cell(10, 4)) && east.path.includes(cell(11, 4)));
  assert.ok(findTerrainPath(terrain, field.heroSpawns[1], relay, options));
  assert.ok(findTerrainPath(terrain, field.heroSpawns[2], relay, options));
  assert.equal(terrainLineOfSight(terrain, cell(2, 4), cell(10, 4), { obstacles: field.obstacles }), false);
});

test('the rock arch and the ford keep independent supports, clearance and movement costs', () => {
  const terrain = normalizeTacticsTerrain(field);
  const [ford, arch] = getSurfacesAt(terrain, 3, 4);
  assert.deepEqual([ford.z, arch.z], [-0.5, 3]);
  assert.equal(terrainLineOfSight(terrain, ford, arch), false);
  assert.equal(canOccupyTerrainSurface(terrain, ford, options), true);
  assert.equal(canOccupyTerrainSurface(terrain, ford, { unit: { tacticsHeight: 3 } }), false);
  assert.equal(getTerrainNeighbors(terrain, cell(2, 4), options).find(next => next.surfaceId === ford.id)?.cost, 2);
  assert.equal(getTerrainNeighbors(terrain, ford, options).some(next => next.surfaceId === arch.id || next.surfaceId === cell(4, 4)), false);
  assert.ok(findTerrainPath(terrain, ford, arch, options)?.path.length > 2);
  for (const surface of terrain.surfaces) assert.ok(TACTICS_TERRAIN_MATERIALS[surface.materialId], surface.id);
  const spawnCells = new Set();
  for (const [unit, spawns] of [
    [human, [...field.heroSpawns, ...field.monsterSpawns]],
    [giant, [...field.bossSpawns, field.worldBossSpawn]]
  ]) for (const spawn of spawns) {
    assert.ok(canOccupyTerrainSurface(terrain, spawn, { ...options, unit }), spawn.surfaceId);
    for (const support of getTerrainUnitFootprint(terrain, spawn, unit)) {
      assert.ok(!spawnCells.has(support.id), `overlapping spawn on ${support.id}`);
      spawnCells.add(support.id);
    }
  }
  for (const pickup of field.pickupSpawns) {
    assert.ok(!spawnCells.has(pickup.surfaceId));
    assert.ok(findTerrainPath(terrain, field.heroSpawns[0], pickup, options));
  }
});

const opponents = [{ id: 'highgrass-test-opponent', name: 'Test opponent', hp: 1000, atk: 1, spd: 1 }];
const enemyData = { monsters: opponents, bosses: [], customRoster: opponents };
const archive = { name: 'Archive from another mode', image: '/other-arena.png', universe: 'Doom' };
const makeStage = mode => buildCustomRuntimeStage({
  preset: normalizeCustomBattlePreset({ mode, opponentControl: 'p2', tacticsBattlefieldId: field.id }),
  archive, enemyData
});

test('Combat custom launches the dedicated Nexus terrain only in Tactics', () => {
  const stage = makeStage('Tactics');
  assert.equal(TACTICS_BATTLEFIELDS[field.id], field);
  assert.equal(stage.tacticsBattlefieldId, field.id);
  assert.equal(stage.universe, 'Nexus de Convergence');
  assert.equal(stage.image, null);
  assert.equal(getTacticsBattlefield(stage), field);
  assert.equal(getTacticsBattlefield({ ...stage, forceBaseArena: true }).id, 'training_grid');
  assert.deepEqual(getTacticsPickupPositions(stage).map(pickup => pickup.surfaceId), field.pickupSpawns.map(ref => ref.surfaceId));
  const environment = getTacticsEnvironmentProfile(field);
  assert.equal(environment.usesSharedBackdrop, false);
  assert.equal(environment.biome, 'alpine');
  assert.equal(environment.ground, field.tacticsPresentation.palette.ground);
  for (const mode of ['RPG', 'Smash', 'Fighter']) {
    const other = makeStage(mode);
    assert.equal(other.tacticsBattlefieldId, null);
    assert.equal(other.image, archive.image);
    assert.equal(getTacticsEnvironmentProfile(field, mode), null);
  }
});

test('normal turns spend AP on the ascent and holding the summit relay wins once', () => {
  const noop = () => {};
  const hero = {
    id: 'highgrass-test-hero', name: 'Test hero', universe: 'Nexus de Convergence',
    stats: { hp: 1000, atk: 25, def: 10, spd: 90 }, weaponType: 'rifle',
    simple: { name: 'Test shot', dmg: 1 }, secondary: { name: 'Test secondary', dmg: 1, cd: 2 },
    special: { name: 'Test super', dmg: 1 }, defense: { name: 'Test guard', reduce: 0.4, dur: 1 }
  };
  const outcomes = [];
  const stage = makeStage('Tactics');
  const engine = new EngineTactics(1040, 560, [hero], stage.customBattle.enemyData,
    { add: noop }, noop, (...args) => outcomes.push(args), stage);
  try {
    const actor = engine.heroes[0];
    const walk = [];
    for (let index = 0; index < 40 && !engine.gameOver; index += 1) {
      if (engine.activeUnit === actor && actor.surfaceId !== relay) {
        const route = engine.getReachableCells(actor, Infinity).find(entry => entry.surfaceId === relay);
        assert.ok(route?.path.length > 1);
        const reachable = new Map(engine.movementRange.map(cell => [cell.surfaceId, cell]));
        const target = route.path.slice(1).reverse().map(id => reachable.get(id)).find(Boolean);
        assert.ok(target, 'the planned path can advance with the real turn budget');
        assert.equal(engine.handleSurfaceClick(target.surfaceId).handled, true);
        assert.equal(engine.movementSpent, target.cost);
        for (let tick = 0; tick < 120 && actor.terrainMotion; tick += 1) engine.update();
        assert.equal(actor.terrainMotion, undefined);
        assert.equal(actor.surfaceId, target.surfaceId);
        walk.push(target.surfaceId);
      }
      const before = engine.objectiveProgress;
      engine.updateTacticsObjective();
      engine.updateTacticsObjective();
      assert.equal(engine.objectiveProgress, before);
      const serial = engine.turnSerial;
      engine.endActiveTurn();
      assert.equal(engine.objectiveProgress, actor.surfaceId === relay ? before + 1 : before);
      for (let tick = 0; tick < 60 && serial === engine.turnSerial && !engine.gameOver; tick += 1) engine.update();
      assert.ok(serial < engine.turnSerial || engine.gameOver, 'the next unit received a real turn');
    }
    assert.ok(walk.includes(north));
    assert.equal(actor.gridZ, 3);
    assert.equal(engine.objectiveProgress, 3);
    assert.equal(engine.battleResult, 'victory');
    for (let tick = 0; tick < 240; tick += 1) engine.update();
    assert.equal(outcomes.length, 1);
  } finally {
    engine.dispose();
  }
});
