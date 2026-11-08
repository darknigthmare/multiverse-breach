import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { HEROES_DB } from '../../src/game/heroes.js';
import { EXPANDED_UNIVERSES } from '../../src/game/expandedUniverses.js';
import { isUniverseInstalled } from '../../src/game/dlcInstallation.js';
import originalManifest from '../../src/game/originalUniversesManifest.json' with { type: 'json' };
import {
  createKartUniverseTracks, getKartUniverseTracks, getKartUniverseTrackId,
  getKartTrackCoverage, getKartTrackEnvironment, KART_CURATED_TRACK_DESIGNS,
  isKartLandmarkClearOfRoad
} from '../../src/game/kart/kartTracks.js';

globalThis.Image = class ImageStub {
  constructor() { this.complete = false; this.naturalWidth = 0; this.naturalHeight = 0; }
};
const { EngineRace, KART_TRACK_LAYOUTS } = await import('../../src/game/engineRace.js');
const tracks = Object.values(getKartUniverseTracks());
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const intersects = (a, b, c, d) => cross(a, b, c) * cross(a, b, d) < -1e-5
  && cross(c, d, a) * cross(c, d, b) < -1e-5;

test('every installed hero universe has one stable course, without list-index identities', () => {
  const universes = [...new Set(HEROES_DB.filter(hero => isUniverseInstalled(hero.universe)).map(hero => hero.universe))];
  assert.equal(tracks.length, universes.length);
  assert.equal(new Set(tracks.map(track => track.id)).size, tracks.length);
  assert.deepEqual(new Set(tracks.map(track => track.universe)), new Set(universes));
  const reorder = createKartUniverseTracks({ heroes: [...HEROES_DB].reverse() });
  for (const track of tracks) {
    assert.equal(track.id, getKartUniverseTrackId(track.universe));
    assert.ok(reorder[track.id]);
    assert.deepEqual(reorder[track.id].waypoints, track.waypoints);
  }
});

test('DLC installation and save visibility each exclude their own courses', () => {
  const onlyNexus = createKartUniverseTracks({ isInstalled: universe => universe === 'Nexus de Convergence' });
  assert.deepEqual(Object.values(onlyNexus).map(track => track.universe), ['Nexus de Convergence']);
  const withoutHalo = getKartUniverseTracks({ hiddenUniverses: ['Halo'] });
  assert.equal(withoutHalo[getKartUniverseTrackId('Halo')], undefined);
  assert.ok(withoutHalo[getKartUniverseTrackId('Alien')]);
  const allHidden = createKartUniverseTracks({ hiddenUniverses: [...new Set(HEROES_DB.map(hero => hero.universe))] });
  assert.equal(Object.keys(allHidden).length, 0);
  assert.equal(Object.keys(getKartUniverseTracks()).length, tracks.length, 'filtering must not mutate the installed catalog');
});

test('courses are closed, bounded, non-intersecting loops with a grid at checkpoint zero', () => {
  for (const track of tracks) {
    const points = track.waypoints;
    assert.ok(points.length >= 8, track.universe);
    assert.deepEqual([track.start.x, track.start.y], [points[0].x, points[0].y], track.universe);
    assert.deepEqual([track.start.x, track.start.y], [track.checkpoints[0].x, track.checkpoints[0].y], track.universe);
    for (let index = 0; index < points.length; index += 1) {
      const a = points[index], b = points[(index + 1) % points.length];
      assert.ok([a.x, a.y].every(Number.isFinite), track.universe);
      assert.ok(a.x - track.roadWidth / 2 >= 34 && a.x + track.roadWidth / 2 <= 926, track.universe);
      assert.ok(a.y - track.roadWidth / 2 >= 34 && a.y + track.roadWidth / 2 <= 506, track.universe);
      assert.ok(Math.hypot(b.x - a.x, b.y - a.y) > 45, track.universe);
      for (let other = index + 2; other < points.length; other += 1) {
        if (index === 0 && other === points.length - 1) continue;
        assert.equal(intersects(a, b, points[other], points[(other + 1) % points.length]), false,
          `${track.universe}: segments ${index} and ${other} cross`);
      }
    }
  }
});

test('checkpoints and usable course items lie on the same real simulation centerline', () => {
  for (const track of tracks) {
    const engine = new EngineRace(960, 540, () => {}, track.id);
    let previousProgress = -1;
    for (const checkpoint of track.checkpoints) {
      const anchor = engine.getClosestRoadPoint(checkpoint.x, checkpoint.y);
      assert.ok(anchor.distance < 0.001, track.universe);
      const progress = engine.getRouteProgress(anchor);
      assert.ok(progress >= previousProgress, `${track.universe}: checkpoints are out of order`);
      previousProgress = progress;
    }
    for (const point of [...track.boostPads, ...track.itemBoxes, ...track.hazards, ...track.surfaceZones]) {
      assert.ok(engine.getClosestRoadPoint(point.x, point.y).distance < 0.001, track.universe);
    }
    assert.ok(engine.track.pathMetrics.totalLength > 1300, track.universe);
  }
});

test('landmarks have finite explicit dimensions and leave the road unobstructed', () => {
  for (const track of tracks) {
    assert.ok(track.environment.landmarks.length >= 3, track.universe);
    for (const landmark of track.environment.landmarks) {
      assert.ok([landmark.x, landmark.z, landmark.width, landmark.height, landmark.depth].every(Number.isFinite), track.universe);
      assert.ok(landmark.width > 0 && landmark.depth > 0 && landmark.height > 0, track.universe);
      assert.equal(landmark.collision, false, track.universe);
      assert.equal(isKartLandmarkClearOfRoad(landmark, track), true, `${track.universe}: ${landmark.label}`);
    }
    for (const field of ['sky', 'ground', 'road', 'shoulder', 'fog', 'accent']) {
      assert.match(track.environment[field], /^#[0-9a-f]{6}$/i, `${track.universe}: ${field}`);
    }
  }
});

test('landmark clearance detects rotated footprints, not just their center point', () => {
  const track = { waypoints: [{ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 200 }, { x: 0, y: 200 }], roadWidth: 20 };
  assert.equal(isKartLandmarkClearOfRoad({ x: 100, z: 100, width: 20, depth: 20 }, track), true);
  assert.equal(isKartLandmarkClearOfRoad({ x: 100, z: 40, width: 120, depth: 10 }, track), true);
  assert.equal(isKartLandmarkClearOfRoad({ x: 100, z: 40, width: 120, depth: 10, rotation: Math.PI / 2 }, track), false);
  assert.equal(isKartLandmarkClearOfRoad({ x: 100, z: 0, width: 4, depth: 4 }, track), false);
});

test('art status never upgrades procedural or adapted scenery into verified 1:1 art', () => {
  const coverage = getKartTrackCoverage();
  assert.equal(coverage.fidelityVerified, 0);
  assert.ok(coverage.authored >= 30);
  assert.ok(coverage.prototypes > coverage.authored);
  for (const track of tracks) {
    assert.equal(track.fidelityReviewed, false);
    assert.equal(track.referenceReconstruction, false);
    assert.ok(track.environment.references.length >= 1, track.universe);
    for (const url of track.environment.references) {
      assert.match(url, /^https:\/\//, track.universe);
      const prefix = 'https://github.com/darknigthmare/multiverse-breach/blob/master/';
      if (url.startsWith(prefix)) {
        assert.ok(existsSync(new URL(`../../${url.slice(prefix.length)}`, import.meta.url)), `${track.universe}: ${url}`);
      }
    }
  }
});

test('authored franchise environments have distinctive geometry and do not share one recolored landmark set', () => {
  const signature = universe => getKartUniverseTracks()[getKartUniverseTrackId(universe)].environment.landmarks
    .filter(landmark => !landmark.decorative).map(landmark => [landmark.kind, landmark.width, landmark.height, landmark.depth]);
  assert.notDeepEqual(signature('Halo'), signature('Alien'));
  assert.notDeepEqual(signature('Star Wars'), signature('Stargate'));
  assert.notDeepEqual(signature('Sonic'), signature('Minecraft'));
  assert.notDeepEqual(signature('Naruto'), signature('Naruto Shippuden'));
  assert.ok(signature('Halo').some(([kind]) => kind === 'forerunner'));
  assert.ok(signature('Alien').some(([kind]) => kind === 'bulkhead'));
  assert.ok(signature('Sonic').some(([kind]) => kind === 'checker-hill'));
  assert.ok(signature('Minecraft').some(([kind]) => kind === 'voxel-tree'));
  for (const universe of Object.keys(KART_CURATED_TRACK_DESIGNS)) {
    assert.ok(getKartUniverseTracks()[getKartUniverseTrackId(universe)], `${universe} must exist in the installed roster`);
  }
});

test('the twenty original worlds retain the exact project palette and source location', () => {
  for (const world of originalManifest.universes) {
    const track = getKartUniverseTracks()[getKartUniverseTrackId(world.universe)];
    assert.ok(track, world.universe);
    assert.equal(track.environment.sky, world.visual.colors.sky[0], world.universe);
    assert.equal(track.environment.ground, world.visual.colors.floor, world.universe);
    assert.equal(track.environment.accent, world.visual.colors.accent, world.universe);
    assert.equal(track.sourceLocation, world.stages[0].name.fr, world.universe);
    assert.equal(track.fidelityStatus, 'original-unverified', world.universe);
  }
});

test('noncombat source packs remain peaceful rallies with no offensive pickup or hazard', () => {
  const peacefulUniverses = new Set(EXPANDED_UNIVERSES.filter(universe => universe.stageMeta?.nonCombat || universe.mode === 'Trial').map(universe => universe.universe));
  for (const track of tracks.filter(candidate => peacefulUniverses.has(candidate.universe))) {
    assert.equal(track.raceRules.contactItems, false, track.universe);
    assert.equal(track.itemBoxes.length, 0, track.universe);
    assert.equal(track.hazards.length, 0, track.universe);
    const engine = new EngineRace(960, 540, () => {}, track.id);
    engine.countdown = 0;
    for (const item of ['projectile', 'trap', 'mirror', 'pulse']) {
      engine.player.item = item;
      assert.equal(engine.useKartItem(engine.player), false, `${track.universe}: ${item}`);
    }
    assert.equal(engine.projectiles.length, 0, track.universe);
    assert.equal(engine.track.hazards.length, 0, track.universe);
  }
  assert.ok(peacefulUniverses.has('The Amazing Patate Show'));
});

test('no racer receives a free lap when moving from the rear grid across the starting line', () => {
  for (const universe of ['Nexus de Convergence', 'Halo', 'Alien', 'Star Wars']) {
    const engine = new EngineRace(960, 540, () => {}, getKartUniverseTrackId(universe));
    engine.setInput({ autoAccel: true });
    // Includes the real 2.6-second countdown and 1.4 seconds of real movement.
    for (let frame = 0; frame < 240; frame += 1) engine.update(1 / 60);
    for (const racer of [engine.player, ...engine.opponents]) {
      assert.equal(racer.lap, 0, `${universe}: ${racer.id} counted its first departure as a lap`);
    }
  }
});

test('the live race simulation completes every installed course with normal AI and items', () => {
  const failures = [];
  for (const track of tracks) {
    const engine = new EngineRace(960, 540, () => {}, track.id);
    engine.setInput({ autoAccel: true });
    for (let frame = 0; frame < 9000 && !engine.finished && !engine.opponents.some(racer => racer.finished); frame += 1) {
      engine.update(1 / 60);
    }
    if (!engine.finished && !engine.opponents.some(racer => racer.finished)) failures.push({
      universe: track.universe, layout: track.layoutKey,
      laps: [engine.player, ...engine.opponents].map(racer => racer.lap)
    });
    assert.ok([engine.player, ...engine.opponents].every(racer => [racer.x, racer.y, racer.speed, racer.angle].every(Number.isFinite)), track.universe);
  }
  assert.deepEqual(failures, []);
});

test('legacy Nexus IDs and snapshots keep their existing layouts, with a separate default 3D environment', () => {
  for (const track of Object.values(KART_TRACK_LAYOUTS)) {
    const before = JSON.stringify(track);
    const environment = getKartTrackEnvironment(track);
    assert.equal(environment.theme, 'nexus');
    assert.ok(environment.landmarks.length >= 3);
    assert.equal(JSON.stringify(track), before);
  }
});

test('starting a new race restores boxes, pickups and hazards without mutating the catalog', () => {
  const track = getKartUniverseTracks()[getKartUniverseTrackId('Halo')];
  const first = new EngineRace(960, 540, () => {}, track.id);
  first.track.itemBoxes[0].respawn = 99;
  first.track.fragmentPickups[0].collected = true;
  first.track.hazards.push({ x: 0, y: 0, r: 200, phase: 0 });
  const second = new EngineRace(960, 540, () => {}, track.id);
  assert.equal(second.track.itemBoxes[0].respawn, 0);
  assert.equal(second.track.fragmentPickups[0].collected, false);
  assert.equal(second.track.hazards.length, track.hazards.length);
  assert.equal(track.itemBoxes[0].respawn, 0);
});
