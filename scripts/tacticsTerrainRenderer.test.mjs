import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  TACTICS_TERRAIN_MATERIALS, drawTacticsTerrain, getSurfaceMaterialNeighbors,
  getSurfacePolygon, getTerrainDrawList, getTerrainSceneDrawList,
  hitTestTacticsSurface, terrainPolygonContains
} from '../src/game/tacticsTerrainRenderer.js';

const project = (x, y, z) => ({ x: 180 + (x - y) * 40, y: 150 + (x + y) * 20 - z * 30 });
const frontProject = (x, y, z) => ({ x: 60 + x * 60, y: 170 + y * 45 - z * 30 });
const surface = (id, x, y, z, extra = {}) => ({
  id, x, y, z, cornerZ: [z, z, z, z], solidBottom: z - 0.25,
  materialId: 'nexus-floor', type: 'normal', walkable: true, layerId: id, ...extra
});
const terrain = (...surfaces) => ({ vertical: true, surfaces });
const centerOf = polygon => ({ x: polygon.reduce((n, point) => n + point.x, 0) / polygon.length, y: polygon.reduce((n, point) => n + point.y, 0) / polygon.length });

test('terrain corners, ramp heights and inset selection share the supplied camera projection', () => {
  const ramp = surface('ramp', 2, 1, 1.5, { cornerZ: [1, 2, 2, 1], shape: 'ramp' });
  const polygon = getSurfacePolygon(ramp, project);
  assert.deepEqual(polygon, [project(2, 1, 1), project(3, 1, 2), project(3, 2, 2), project(2, 2, 1)]);
  const inset = getSurfacePolygon(ramp, project, 4);
  assert.ok(inset.every(point => terrainPolygonContains(polygon, point.x, point.y)));
  const shifted = getSurfacePolygon(ramp, (x, y, z) => { const p = project(x, y, z); return { x: p.x * 1.8 + 27, y: p.y * 1.8 - 53 }; });
  assert.deepEqual(shifted, polygon.map(point => ({ x: point.x * 1.8 + 27, y: point.y * 1.8 - 53 })));
});

test('an elevated bridge has only its thin fascia and distinct underside, leaving the passage empty', () => {
  const ground = surface('ground', 2, 2, 0, { materialId: 'ancient-stone', solidBottom: -1 });
  const bridge = surface('bridge', 2, 2, 3, { materialId: 'nexus-metal', solidBottom: 2.72, shape: 'slab' });
  const faces = getTerrainDrawList(terrain(ground, bridge), { project });
  const bridgeFaces = faces.filter(face => face.surfaceId === 'bridge');
  assert.ok(bridgeFaces.some(face => face.kind === 'top'));
  assert.ok(bridgeFaces.some(face => face.kind === 'underside'));
  assert.ok(bridgeFaces.filter(face => face.kind === 'side').length >= 1);
  assert.ok(bridgeFaces.every(face => face.zMin >= 2.72 && face.zMax <= 3));
  assert.notEqual(TACTICS_TERRAIN_MATERIALS['nexus-metal'].top, TACTICS_TERRAIN_MATERIALS['nexus-metal'].underside);
});

test('only the exposed interval of a cliff is drawn beside solid ground or an adjacent thin slab', () => {
  const cliff = surface('cliff', 0, 0, 3, { solidBottom: -1, materialId: 'ancient-stone' });
  const neighbor = surface('neighbor', 0, 1, 1, { solidBottom: -1 });
  const exposed = getTerrainDrawList(terrain(cliff, neighbor), { project }).filter(face => face.surfaceId === 'cliff' && face.edge === 'south');
  assert.ok(exposed.length > 0);
  assert.ok(exposed.every(face => face.zMin >= 1 && face.zMax === 3));
  neighbor.z = 2; neighbor.cornerZ = [2, 2, 2, 2]; neighbor.solidBottom = 1.8;
  const split = getTerrainDrawList(terrain(cliff, neighbor), { project }).filter(face => face.surfaceId === 'cliff' && face.edge === 'south');
  assert.equal(split.length, 2);
  assert.deepEqual(split.map(face => [face.zMin, face.zMax]).sort((a, b) => a[0] - b[0]), [[-1, 1.8], [2, 3]]);
});

test('material joins follow touching elevations and never join a bridge to a lower floor', () => {
  const left = surface('left', 0, 0, 0, { materialId: 'grass' });
  const rightFloor = surface('right-floor', 1, 0, 0, { materialId: 'grass' });
  const rightBridge = surface('right-bridge', 1, 0, 3, { materialId: 'nexus-metal', solidBottom: 2.72 });
  assert.equal(getSurfaceMaterialNeighbors(terrain(left, rightBridge, rightFloor), left).east, rightFloor);
  assert.equal(getSurfaceMaterialNeighbors(terrain(left, rightBridge), left).east, null);
});

test('stairs use separate horizontal treads and closed stepped side walls rather than one sloping image', () => {
  const stairs = surface('stairs', 0, 0, 0.5, { shape: 'stairs', direction: 'west', stepCount: 4, cornerZ: [1, 0, 0, 1], solidBottom: -0.3 });
  const faces = getTerrainDrawList(terrain(stairs), { project });
  const tops = faces.filter(face => face.kind === 'top');
  assert.equal(tops.length, 4);
  assert.deepEqual(tops.map(face => face.zMin).sort((a, b) => a - b), [0.25, 0.5, 0.75, 1]);
  assert.ok(tops.every(face => face.zMin === face.zMax));
  assert.equal(faces.filter(face => face.kind === 'side' && face.edge === 'south').length, 4);
  assert.ok(faces.some(face => face.kind === 'riser'));
});

test('picking chooses the visible bridge, rejects foreground walls and exposes the floor under a level cut', () => {
  const ground = surface('ground', 1, 2, 0, { solidBottom: -1 });
  const bridge = surface('bridge', 1, 2, 3, { solidBottom: 2.72 });
  const map = terrain(ground, bridge), center = centerOf(getSurfacePolygon(bridge, frontProject));
  assert.equal(hitTestTacticsSurface(map, center.x, center.y, { project: frontProject }).id, 'bridge');
  const groundCenter = centerOf(getSurfacePolygon(ground, frontProject));
  assert.equal(hitTestTacticsSurface(map, groundCenter.x, groundCenter.y, { project: frontProject, cutLevel: 0 }).id, 'ground');
  const wall = getTerrainDrawList(map, { project: frontProject }).find(face => face.surfaceId === 'bridge' && face.kind === 'side');
  const wallCenter = centerOf(wall.polygon);
  assert.equal(hitTestTacticsSurface(map, wallCenter.x, wallCenter.y, { project: frontProject }), null);
  assert.equal(getTerrainDrawList(map, { project: frontProject, cutLevel: 0 }).some(face => face.surfaceId === 'bridge'), false);
});

test('the shared painter graph masks an actor under the bridge while keeping its upper actor visible', () => {
  const ground = surface('ground', 1, 1, 0, { solidBottom: -1 });
  const bridge = surface('bridge', 1, 1, 1.3, { solidBottom: 1.1 });
  const actors = [
    { id: 'lower', surfaceId: 'ground', x: 1, y: 1, height: 1.7 },
    { id: 'upper', surfaceId: 'bridge', x: 1, y: 1, height: 1.7 }
  ];
  const commands = getTerrainSceneDrawList(terrain(ground, bridge), { project, actors });
  const lower = commands.findIndex(command => command.type === 'actor' && command.actor.id === 'lower');
  const upper = commands.findIndex(command => command.type === 'actor' && command.actor.id === 'upper');
  const bridgeTop = commands.findIndex(command => command.surfaceId === 'bridge' && command.kind === 'top');
  const groundTop = commands.findIndex(command => command.surfaceId === 'ground' && command.kind === 'top');
  assert.ok(groundTop < lower && lower < bridgeTop && bridgeTop < upper);
  assert.equal(new Set(commands.map(command => command.id)).size, commands.length);
});

test('surface overlays execute inside terrain ordering before a higher bridge and its actor', () => {
  const calls = [], noop = () => {};
  const ctx = new Proxy({ lineWidth: 1 }, { get: (target, key) => key in target ? target[key] : noop, set: (target, key, value) => { target[key] = value; return true; } });
  const ground = surface('ground', 1, 1, 0), bridge = surface('bridge', 1, 1, 1.3, { solidBottom: 1.1 });
  drawTacticsTerrain(ctx, terrain(ground, bridge), {
    project, actors: [{ id: 'upper', surfaceId: 'bridge', x: 1, y: 1 }],
    drawSurfaceOverlay: (_ctx, tile) => calls.push(`overlay:${tile.id}`),
    drawActor: (_ctx, actor) => calls.push(`actor:${actor.id}`)
  });
  assert.deepEqual(calls, ['overlay:ground', 'overlay:bridge', 'actor:upper']);
});

test('cover edges are visible open railings ordered behind and in front of the standing actor', () => {
  const bridge = surface('bridge', 1, 1, 3, {
    solidBottom: 2.72, coverEdges: { north: { height: 0.7 }, south: { height: 0.7 } }
  });
  const commands = getTerrainSceneDrawList(terrain(bridge), {
    project: frontProject, actors: [{ id: 'upper', surfaceId: 'bridge', x: 1, y: 1 }]
  });
  const actor = commands.findIndex(command => command.type === 'actor');
  const backRail = commands.findIndex(command => command.kind === 'railing' && command.edge === 'north');
  const frontRail = commands.findIndex(command => command.kind === 'railing' && command.edge === 'south');
  assert.ok(backRail < actor && actor < frontRail);
  for (const rail of commands.filter(command => command.kind === 'railing')) assert.deepEqual([rail.zMin, rail.zMax], [3, 3.7]);
  const center = centerOf(getSurfacePolygon(bridge, frontProject));
  assert.equal(hitTestTacticsSurface(terrain(bridge), center.x, center.y, { project: frontProject }).id, 'bridge');
});
