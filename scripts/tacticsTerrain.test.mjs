import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  normalizeTacticsTerrain, getTerrainSurface, getSurfacesAt, terrainSurfaceRef,
  getTerrainHeightAt, getTerrainNeighbors, getTerrainUnitFootprint, canOccupyTerrainSurface,
  reachableTerrainSurfaces, findTerrainPath, terrainLineOfSight,
  terrainAttackDistance, terrainHeightAdvantage, terrainCoverReduction
} from '../src/game/tacticsTerrain.js';
import { TACTICS_VERTICAL_BATTLEFIELDS } from '../src/game/tacticsVerticalBattlefields.js';

const skybridge = () => normalizeTacticsTerrain(TACTICS_VERTICAL_BATTLEFIELDS.nexus_skybridge);
const human = { tacticsHeight: 1.6 };
const giant = { tacticsHeight: 3, tacticsFootprint: { width: 2, height: 2 } };

test('legacy high tiles keep their flat altitude and declared terrain costs', () => {
  const field = { id: 'old-flat', cols: 3, rows: 2, tiles: [{ x: 1, y: 0, type: 'high' }, { x: 1, y: 1, type: 'blocked' }] };
  const before = JSON.stringify(field);
  const terrain = normalizeTacticsTerrain(field);
  assert.equal(terrain.vertical, false);
  assert.equal(terrain.surfaces.length, 6);
  assert.equal(getTerrainSurface(terrain, { x: 1, y: 0 }).z, 0);
  assert.equal(getTerrainSurface(terrain, { x: 1, y: 0 }).legacyTerrainType, 'high');
  assert.equal(findTerrainPath(terrain, { x: 0, y: 0 }, { x: 2, y: 0 }).cost, 3);
  assert.equal(canOccupyTerrainSurface(terrain, { x: 1, y: 1 }), false);
  assert.equal(JSON.stringify(field), before, 'normalization must not mutate historical battlefield definitions');
});

test('bridge and lower floor retain distinct identities and ambiguous XY is refused', () => {
  const terrain = skybridge();
  assert.deepEqual(getSurfacesAt(terrain, 4, 3).map(surface => surface.id), ['ground:4:3', 'bridge:4:3']);
  assert.equal(getTerrainSurface(terrain, { x: 4, y: 3 }), null);
  assert.equal(getTerrainSurface(terrain, { gridX: 4, gridY: 3, z: 0 }).id, 'ground:4:3');
  assert.equal(getTerrainSurface(terrain, { gridX: 4, gridY: 3, gridZ: 3 }).id, 'bridge:4:3');
  assert.equal(getTerrainSurface(terrain, { surfaceId: 'missing', x: 0, y: 0 }), null, 'an invalid explicit identity must not silently rebind');
  assert.equal(getTerrainSurface(terrain, { id: 'hero-id', gridX: 0, gridY: 0 }).id, 'ground:0:0');
  assert.deepEqual(terrainSurfaceRef(getTerrainSurface(terrain, 'bridge:4:3')), { surfaceId: 'bridge:4:3', x: 4, y: 3, z: 3 });
});

test('ascending to the skybridge follows the authored staircase and spends its exact cost', () => {
  const terrain = skybridge();
  const path = findTerrainPath(terrain, 'ground:0:3', 'bridge:4:3', { unit: human });
  assert.deepEqual(path.path, ['ground:0:3', 'stairs:1:3', 'stairs:2:3', 'stairs:3:3', 'bridge:4:3']);
  assert.equal(path.cost, 7);
  assert.deepEqual(path.transitions.map(step => step.kind), ['stairs', 'stairs', 'stairs', 'stairs']);
  assert.equal(path.transitions.reduce((sum, step) => sum + step.cost, 0), path.cost);
  assert.equal(findTerrainPath(terrain, 'ground:4:3', 'bridge:4:3', { budget: 2 }), null);
  assert.equal(getTerrainNeighbors(terrain, 'ground:4:3').some(next => next.surfaceId === 'bridge:4:3'), false);
  assert.equal(getTerrainNeighbors(terrain, 'ground:1:2').some(next => next.surfaceId === 'stairs:1:3'), false, 'a staircase is entered from its authored ends, not through its flank');
});

test('a weighted alternate route relaxes costs rather than locking the first visited node', () => {
  const terrain = normalizeTacticsTerrain({ cols: 3, rows: 2, tiles: [{ x: 1, y: 0, moveCost: 5 }] });
  const result = findTerrainPath(terrain, 'legacy:0:0', 'legacy:2:0');
  assert.equal(result.cost, 4);
  assert.deepEqual(result.path, ['legacy:0:0', 'legacy:0:1', 'legacy:1:1', 'legacy:2:1', 'legacy:2:0']);
  const reachable = reachableTerrainSurfaces(terrain, 'legacy:0:0', 4);
  assert.equal(reachable.find(entry => entry.surfaceId === 'legacy:2:0').cost, 4);
  assert.equal(new Set(reachable.map(entry => entry.surfaceId)).size, reachable.length);
});

test('the same material or layer name does not connect separated elevations', () => {
  const terrain = normalizeTacticsTerrain({ cols: 2, rows: 1, surfaces: [
    { id: 'cliff', x: 0, y: 0, z: 3, materialId: 'stone', layerId: 'shared' },
    { id: 'low', x: 1, y: 0, z: 0, materialId: 'stone', layerId: 'shared' }
  ] });
  assert.equal(findTerrainPath(terrain, 'cliff', 'low'), null);
  assert.equal(findTerrainPath(terrain, 'low', 'cliff'), null);
});

test('jumping is a declared movement capability and a walk link cannot teleport', () => {
  const field = { cols: 3, rows: 1, surfaces: [
    { id: 'left', x: 0, y: 0, z: 0 }, { id: 'right', x: 2, y: 0, z: 0 }
  ], links: [{ from: 'left', to: 'right', kind: 'jump', cost: 2 }] };
  const terrain = normalizeTacticsTerrain(field);
  assert.equal(findTerrainPath(terrain, 'left', 'right'), null);
  assert.equal(findTerrainPath(terrain, 'left', 'right', { unit: { tacticsTraversal: { canJump: true } } }).cost, 2);
  assert.throws(() => normalizeTacticsTerrain({ ...field, links: [{ from: 'left', to: 'right', kind: 'walk' }] }), /adjacent/);
});

test('a unit under a bridge occupies the lower surface without blocking its deck', () => {
  const terrain = skybridge();
  const options = { unit: human, isOccupied: surface => surface.id === 'ground:5:3' };
  assert.equal(canOccupyTerrainSurface(terrain, 'ground:5:3', options), false);
  assert.equal(canOccupyTerrainSurface(terrain, 'bridge:5:3', options), true);
  const path = findTerrainPath(terrain, 'bridge:4:3', 'bridge:6:3', options);
  assert.equal(path.cost, 2);
  assert.deepEqual(path.path, ['bridge:4:3', 'bridge:5:3', 'bridge:6:3']);
});

test('headroom tests the thin bridge underside and large footprints require actual support', () => {
  const terrain = skybridge();
  assert.equal(getTerrainSurface(terrain, 'bridge:4:3').solidBottom, 2.72);
  assert.equal(canOccupyTerrainSurface(terrain, 'ground:4:3', { unit: human }), true);
  assert.equal(canOccupyTerrainSurface(terrain, 'ground:4:3', { unit: { tacticsHeight: 2.72 } }), true);
  assert.equal(canOccupyTerrainSurface(terrain, 'ground:4:3', { unit: { tacticsHeight: 2.73 } }), false);
  assert.equal(canOccupyTerrainSurface(terrain, 'bridge:4:3', { unit: { tacticsHeight: 3 } }), true);
  assert.equal(canOccupyTerrainSurface(terrain, 'bridge:4:3', { unit: giant }), false, 'a two-cell-wide boss cannot stand on an unsupported one-cell-wide deck');
});

test('sight passes below and above a bridge, while its actual slab blocks an inter-floor shot', () => {
  const terrain = skybridge();
  assert.equal(terrainLineOfSight(terrain, 'ground:4:2', 'ground:4:4'), true);
  assert.equal(terrainLineOfSight(terrain, 'bridge:4:3', 'bridge:7:3'), true);
  assert.equal(terrainLineOfSight(terrain, 'ground:4:3', 'bridge:4:3'), false);
  assert.equal(terrainLineOfSight(terrain, 'bridge:4:3', 'ground:4:3'), false);
  assert.equal(terrainLineOfSight(terrain, 'ground:4:3', 'bridge:4:3', { pierceObstacles: true }), false);
  assert.equal(terrainLineOfSight(terrain, 'ground:4:3', 'bridge:4:3', { pierceTerrain: true }), true);
});

test('obstacles and intervening units block only the height occupied by their real volume', () => {
  const terrain = skybridge();
  const source = 'ground:4:3', target = 'ground:6:3';
  const highObstacle = { surfaceId: 'bridge:5:3', hp: 80, tacticsHeight: 1.4 };
  const lowObstacle = { surfaceId: 'ground:5:3', hp: 80, tacticsHeight: 1.4 };
  assert.equal(terrainLineOfSight(terrain, source, target, { obstacles: [highObstacle] }), true);
  assert.equal(terrainLineOfSight(terrain, source, target, { obstacles: [lowObstacle] }), false);
  assert.equal(terrainLineOfSight(terrain, source, target, { obstacles: [lowObstacle], pierceObstacles: true }), true);
  const unit = { surfaceId: 'bridge:5:3', currentHp: 100 };
  assert.equal(terrainLineOfSight(terrain, source, target, { units: [unit], blocksOnUnits: true }), true);
  unit.surfaceId = 'ground:5:3';
  assert.equal(terrainLineOfSight(terrain, source, target, { units: [unit], blocksOnUnits: true }), false);
  assert.equal(terrainLineOfSight(terrain, source, target, { units: [unit], blocksOnUnits: true, pierceUnits: true }), true);
});

test('ramp and stair heights agree with the drawn slope and four physical treads', () => {
  const stairs = getTerrainSurface(skybridge(), 'stairs:1:3');
  assert.equal(getTerrainHeightAt(stairs, 1, 3.5), 0);
  assert.equal(getTerrainHeightAt(stairs, 1.1, 3.5), 0.25);
  assert.equal(getTerrainHeightAt(stairs, 1.4, 3.5), 0.5);
  assert.equal(getTerrainHeightAt(stairs, 1.9, 3.5), 1);
  const ruins = normalizeTacticsTerrain(TACTICS_VERTICAL_BATTLEFIELDS.ruined_terraces);
  const ramp = getTerrainSurface(ruins, 'ramp:2:3');
  assert.equal(getTerrainHeightAt(ramp, 2.1, 3.5), 0.10000000000000009);
  assert.equal(getTerrainHeightAt(ramp, 3, 3.5), 1);
});

test('attack distance and height advantage use Z rather than the screen row', () => {
  const terrain = skybridge();
  assert.equal(terrainAttackDistance(terrain, 'ground:4:3', 'bridge:4:3', { maxVertical: 0.75 }), Infinity);
  assert.equal(terrainAttackDistance(terrain, 'ground:4:3', 'bridge:4:3', { spatial: true }), 3);
  assert.equal(terrainHeightAdvantage(terrain, 'bridge:4:3', 'ground:4:3').multiplier, 1.15);
  assert.equal(terrainHeightAdvantage(terrain, 'ground:4:3', 'bridge:4:3').multiplier, 1);
  assert.equal(terrainCoverReduction(terrain, 'ground:4:2', 'bridge:4:3'), 0.2);
  assert.equal(terrainCoverReduction(terrain, 'bridge:5:3', 'bridge:4:3'), 0);
});

test('malformed and duplicate surface definitions fail before a battle can use them', () => {
  assert.throws(() => normalizeTacticsTerrain({ cols: 1, rows: 1, surfaces: [
    { id: 'duplicate', x: 0, y: 0 }, { id: 'duplicate', x: 0, y: 0, z: 3 }
  ] }), /Duplicate/);
  assert.throws(() => normalizeTacticsTerrain({ cols: 1, rows: 1, surfaces: [{ id: 'outside', x: 1, y: 0 }] }), /outside/);
  assert.throws(() => normalizeTacticsTerrain({ cols: 1, rows: 1, surfaces: [{ id: 'bad', x: 0, y: 0, cornerZ: [0, 1, 2] }] }), /corner/);
});

for (const field of Object.values(TACTICS_VERTICAL_BATTLEFIELDS)) {
  test(`${field.id} has real access routes, bound resources and room for two-by-two bosses`, () => {
    const terrain = normalizeTacticsTerrain(field);
    const actorSpawns = [...field.heroSpawns, ...field.monsterSpawns, ...field.bossSpawns, field.worldBossSpawn];
    const bindings = [...actorSpawns, ...field.extractionZone, ...field.pickupSpawns, ...field.obstacles];
    const occupied = new Set();
    for (const binding of bindings) {
      const support = getTerrainSurface(terrain, binding);
      assert.ok(support, binding.surfaceId);
      assert.equal(support.x, binding.x ?? binding.gridX);
      assert.equal(support.y, binding.y ?? binding.gridY);
      assert.equal(canOccupyTerrainSurface(terrain, support.id, { unit: human }), true, support.id);
    }
    const spawnBodies = [
      ...field.heroSpawns.map(spawn => [spawn, human]), ...field.monsterSpawns.map(spawn => [spawn, human]),
      ...field.bossSpawns.map(spawn => [spawn, giant]), [field.worldBossSpawn, giant],
      ...field.obstacles.map(spawn => [spawn, human])
    ];
    for (const [spawn, unit] of spawnBodies) {
      for (const support of getTerrainUnitFootprint(terrain, spawn, unit)) {
        assert.equal(occupied.has(support.id), false, `overlapping spawn footprint ${support.id}`);
        occupied.add(support.id);
      }
    }
    for (const pickup of field.pickupSpawns) assert.equal(occupied.has(pickup.surfaceId), false, `occupied pickup ${pickup.surfaceId}`);
    for (const spawn of [...field.bossSpawns, field.worldBossSpawn]) {
      assert.equal(canOccupyTerrainSurface(terrain, spawn, { unit: giant }), true, `large boss ${spawn.surfaceId}`);
    }
    for (const goal of field.extractionZone) {
      const route = findTerrainPath(terrain, field.heroSpawns[1], goal, { unit: human });
      assert.ok(route && route.transitions.some(link => ['stairs', 'ramp'].includes(link.kind)), goal.surfaceId);
    }
    assert.equal(field.source.source1to1Verified, false);
  });
}
