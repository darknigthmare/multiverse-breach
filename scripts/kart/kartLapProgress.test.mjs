import test from 'node:test';
import assert from 'node:assert/strict';
import { EngineRace, KART_TRACK_LAYOUTS } from '../../src/game/engineRace.js';
import { getKartUniverseTrackId } from '../../src/game/kart/kartTracks.js';

globalThis.Image = class { complete = false; naturalWidth = 0; };

function race(id = 'nexus_archive_loop') {
  const engine = new EngineRace(960, 540, () => {}, id);
  engine.countdown = 0;
  return engine;
}

function pointAt(engine, progress) {
  const p = ((progress % 1) + 1) % 1;
  const metrics = engine.track.pathMetrics;
  const target = p * metrics.totalLength;
  let segment = metrics.segmentLengths.length - 1;
  for (let i = 0; i < metrics.segmentLengths.length; i++) {
    if (target < metrics.cumulative[i] + metrics.segmentLengths[i]) { segment = i; break; }
  }
  const t = (target - metrics.cumulative[segment]) / metrics.segmentLengths[segment];
  const a = engine.track.waypoints[segment], b = engine.track.waypoints[(segment + 1) % engine.track.waypoints.length];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
    angle: Math.atan2(b.y - a.y, b.x - a.x), segment, t };
}

function seedAt(engine, kart, progress) {
  const point = pointAt(engine, progress);
  Object.assign(kart, { x: point.x, y: point.y, angle: point.angle, speed: 180 });
  engine.reanchorKartRoute(kart, point);
}

// Move through the actual connected polyline with small physical steps. No
// private gate/lap fields are set by this helper: updateCheckpoints earns them.
function driveRoad(engine, kart, from, to) {
  const steps = Math.max(1, Math.ceil(Math.abs(to - from) / 0.002));
  for (let i = 1; i <= steps; i++) {
    const point = pointAt(engine, from + (to - from) * i / steps);
    Object.assign(kart, { x: point.x, y: point.y, angle: point.angle, speed: to > from ? 180 : -180 });
    engine.updateCheckpoints(kart);
  }
}

function arriveAtPortal(engine, kart, zone) {
  const road = engine.getClosestRoadPoint(zone.x, zone.y);
  Object.assign(kart, { x: zone.x, y: zone.y, angle: road.angle, speed: 180, portalCooldown: 0 });
  engine.applySurfaceZones(kart);
  engine.updateCheckpoints(kart);
}

for (const id of Object.keys(KART_TRACK_LAYOUTS)) {
  test(`the player finishes the legacy ${id} with normal auto acceleration, items and opponents`, () => {
    const results = [];
    const engine = new EngineRace(960, 540, result => results.push(result), id);
    engine.setInput({ autoAccel: true });
    let drivenDistance = 0;
    const lapTimes = [];
    for (let tick = 0; tick < 9000 && !engine.finished; tick++) {
      const { x, y, lap } = engine.player;
      engine.update(1 / 60);
      const step = Math.hypot(engine.player.x - x, engine.player.y - y);
      if (step < 20) drivenDistance += step; // Teleport distance is not driving.
      if (engine.player.lap > lap) lapTimes.push(engine.time);
    }
    assert.equal(engine.player.lap, engine.track.laps);
    assert.equal(engine.finished, true);
    assert.equal(results.length, 1);
    assert.ok(engine.player.finishTime > 10);
    if (id === 'nexus_suture_eight') {
      assert.ok(drivenDistance > engine.track.pathMetrics.totalLength * engine.track.laps * 0.8,
        'the backwards portal must not farm laps on the short exit-to-entrance loop');
      lapTimes.forEach((time, i) => assert.ok(time - (lapTimes[i - 1] || 0) > 8));
    }
    for (let tick = 0; tick < 120; tick++) engine.update(1 / 60);
    assert.equal(results.length, 1);
  });
}

test('the figure-eight crossing keeps both approaches on their connected road branch', () => {
  const engine = race('nexus_suture_eight');
  const kart = engine.player;
  for (const incoming of [3, 7]) {
    const metrics = engine.track.pathMetrics;
    const start = (metrics.cumulative[incoming] + metrics.segmentLengths[incoming] * 0.65) / metrics.totalLength;
    const end = (metrics.cumulative[incoming + 1] + 38) / metrics.totalLength;
    seedAt(engine, kart, start);
    const steps = 70;
    for (let i = 1; i <= steps; i++) {
      const point = pointAt(engine, start + (end - start) * i / steps);
      Object.assign(kart, { x: point.x, y: point.y, angle: point.angle });
      const anchor = engine.getKartRoadAnchor(kart);
      assert.ok([incoming, incoming + 1].includes(anchor.segment), `incoming ${incoming} jumped to ${anchor.segment}`);
      const ahead = engine.getTrackPointAhead(anchor, 30);
      assert.ok([incoming, incoming + 1].includes(ahead.segmentIndex));
      for (let read = 0; read < 8; read++) {
        assert.equal(engine.getKartRoadAnchor(kart).segment, anchor.segment,
          'camera/telemetry reads must not advance the chosen branch while stationary');
      }
    }
  }
});

test('recovery stays on the second branch of the eight and cannot award a lap', () => {
  const engine = race('nexus_suture_eight');
  const kart = engine.player;
  const metrics = engine.track.pathMetrics;
  seedAt(engine, kart, (metrics.cumulative[7] + metrics.segmentLengths[7] * 0.92) / metrics.totalLength);
  Object.assign(kart, { x: 480, y: 276 }); // Exactly shared by branches 3/4 and 7/8.
  assert.equal(engine.getClosestRoadPoint(kart.x, kart.y).segment, 3);
  assert.equal(engine.recoverKart(kart), true);
  assert.ok([7, 8].includes(kart.routeSegment));
  engine.updateCheckpoints(kart);
  assert.equal(kart.lap, 0);
});

test('mirror across the line preserves each racers receipts without inventing a lap', () => {
  const engine = race(getKartUniverseTrackId('Halo'));
  engine.setInput({ autoAccel: true });
  for (let tick = 0; tick < 3000 && !(engine.player.lapArmed && engine.player.routeProgress > 0.9); tick++) engine.update(1 / 60);
  assert.equal(engine.player.lap, 0);
  assert.equal(engine.player.lapArmed, true);
  const target = engine.opponents[0];
  engine.opponents = [target];
  seedAt(engine, target, 0.02);
  const ownGates = engine.player.nextLapGate, targetGates = target.nextLapGate;
  engine.updateProgressAndRanks();
  Object.assign(engine.player, { item: 'mirror', itemCooldown: 0 });
  assert.equal(engine.useKartItem(engine.player), true);
  assert.ok(Math.abs(engine.player.routeProgress - 0.02) < 0.005);
  for (let i = 0; i < 30; i++) {
    engine.updateCheckpoints(engine.player);
    engine.updateCheckpoints(target);
  }
  assert.equal(engine.player.lap, 0);
  assert.equal(engine.player.nextLapGate, ownGates);
  assert.equal(target.nextLapGate, targetGates);
});

test('a recovery just across the line establishes a baseline instead of spending an armed lap', () => {
  const engine = race();
  const kart = engine.player;
  seedAt(engine, kart, 0.005);
  driveRoad(engine, kart, 0.005, 0.99);
  assert.equal(kart.lapArmed, true);
  const next = pointAt(engine, 0.005);
  Object.assign(kart, { x: next.x, y: next.y, recoveryCooldown: 0 });
  assert.equal(engine.recoverKart(kart), true);
  engine.updateCheckpoints(kart);
  assert.equal(kart.lap, 0);
  assert.equal(kart.previousRouteProgress, kart.routeProgress);
});

test('reversing over the start line then driving forward cannot redeem old gates', () => {
  const engine = race();
  const kart = engine.player;
  seedAt(engine, kart, 0.005);
  driveRoad(engine, kart, 0.005, 0.94);
  assert.equal(kart.lapArmed, true);
  driveRoad(engine, kart, 0.94, -0.015);
  assert.equal(kart.lapArmed, false);
  driveRoad(engine, kart, -0.015, 0.02);
  assert.equal(kart.lap, 0);
  driveRoad(engine, kart, 0.02, 1.02);
  assert.equal(kart.lap, 1);
});

test('a declared forward portal credits its skipped ordered gates only once', () => {
  const engine = race('anchor_market_dash');
  const kart = engine.player;
  const zone = engine.track.surfaceZones.find(zone => zone.type === 'portal');
  const entry = engine.getRouteProgress(engine.getClosestRoadPoint(zone.x, zone.y));
  const exit = engine.getRouteProgress(engine.getClosestRoadPoint(zone.exit.x, zone.exit.y));
  seedAt(engine, kart, 0.005);
  driveRoad(engine, kart, 0.005, entry);
  assert.equal(kart.nextLapGate, 1);
  arriveAtPortal(engine, kart, zone);
  assert.equal(kart.nextLapGate, 4);
  assert.equal(kart.lap, 0);
  for (let i = 0; i < 30; i++) engine.updateCheckpoints(kart);
  assert.equal(kart.nextLapGate, 4);
  driveRoad(engine, kart, exit, 1.02);
  assert.equal(kart.lap, 1);
});

test('a backwards portal gives no gates or laps, cannot loop farm, and unlocks next lap', () => {
  const engine = race('nexus_suture_eight');
  const kart = engine.player;
  const zone = engine.track.surfaceZones.find(zone => zone.type === 'portal');
  const entry = engine.getRouteProgress(engine.getClosestRoadPoint(zone.x, zone.y));
  const exit = engine.getRouteProgress(engine.getClosestRoadPoint(zone.exit.x, zone.exit.y));
  seedAt(engine, kart, 0.005);
  driveRoad(engine, kart, 0.005, entry);
  const earnedGates = kart.nextLapGate;
  arriveAtPortal(engine, kart, zone);
  assert.equal(kart.x, zone.exit.x);
  assert.equal(kart.lap, 0);
  assert.equal(kart.nextLapGate, earnedGates);
  driveRoad(engine, kart, exit, entry);
  for (let i = 0; i < 30; i++) {
    arriveAtPortal(engine, kart, zone);
    assert.equal(kart.x, zone.x, 'the consumed backwards portal is traversable for the rest of this lap');
    assert.equal(kart.lap, 0);
  }
  driveRoad(engine, kart, entry, 1.02);
  assert.equal(kart.lap, 1);
  driveRoad(engine, kart, 0.02, entry);
  arriveAtPortal(engine, kart, zone);
  assert.equal(kart.x, zone.exit.x);
  assert.equal(kart.lap, 1);
});

test('a portal crossing the start requires explicit topology and the preceding ordered gates', () => {
  for (const hasPriorGates of [false, true]) {
    const engine = race('portal_hairpin_ritual');
    const kart = engine.player;
    const zone = engine.track.surfaceZones.filter(zone => zone.type === 'portal')[1];
    zone.crossesStart = true; // An explicitly authored forward connection.
    const entry = engine.getRouteProgress(engine.getClosestRoadPoint(zone.x, zone.y));
    seedAt(engine, kart, hasPriorGates ? 0.005 : entry);
    if (hasPriorGates) driveRoad(engine, kart, 0.005, entry);
    arriveAtPortal(engine, kart, zone);
    assert.equal(kart.lap, hasPriorGates ? 1 : 0);
    for (let i = 0; i < 30; i++) engine.updateCheckpoints(kart);
    assert.equal(kart.lap, hasPriorGates ? 1 : 0);
  }
});

test('the low-speed off-road assist is restricted to automatic acceleration', () => {
  const engines = [race('fragment_frostway'), race('fragment_frostway')];
  const originalAngles = [];
  engines.forEach((engine, i) => {
    const kart = engine.player;
    seedAt(engine, kart, 0.88);
    Object.assign(kart, { x: 759, y: 506, angle: Math.PI / 2, speed: 26 });
    engine.opponents = [];
    engine.track.surfaceZones = [];
    engine.track.hazards = [];
    engine.track.boostPads = [];
    engine.track.itemBoxes = [];
    originalAngles[i] = kart.angle;
    engine.setInput(i === 0 ? { up: true } : { autoAccel: true });
    engine.updateKart(kart, 1 / 60);
  });
  assert.equal(engines[0].player.angle, originalAngles[0]);
  assert.notEqual(engines[1].player.angle, originalAngles[1]);
});
