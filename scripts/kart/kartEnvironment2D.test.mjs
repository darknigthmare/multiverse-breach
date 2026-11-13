import test from 'node:test';
import assert from 'node:assert/strict';
import { EngineRace } from '../../src/game/engineRace.js';
import { getKartUniverseTrackId, getKartTrackEnvironment } from '../../src/game/kart/kartTracks.js';

globalThis.Image = class { complete = false; naturalWidth = 0; };

function recordCanvas() {
  const calls = [];
  const context = new Proxy({ globalAlpha: 1 }, {
    get(target, key) {
      if (key in target) return target[key];
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return (...args) => {
        const stops = [];
        const gradient = { addColorStop: (...stop) => stops.push(stop), stops };
        calls.push({ kind: key, args, stops });
        return gradient;
      };
      return (...args) => {
        assert.ok(args.filter(arg => typeof arg === 'number').every(Number.isFinite), `${key}: nonfinite canvas coordinate`);
        calls.push({ kind: key, args, fill: target.fillStyle, stroke: target.strokeStyle });
      };
    },
    set(target, key, value) { target[key] = value; return true; }
  });
  return { context, calls };
}

for (const universe of ['Halo', 'Alien', 'Sonic', 'Star Wars']) {
  test(`${universe} sprite view uses its shared environment and never the Nexus image`, () => {
    const engine = new EngineRace(960, 540, () => {}, getKartUniverseTrackId(universe));
    const nexusImage = { complete: true, naturalWidth: 1024 };
    engine.images.trackNexus = nexusImage;
    const environment = getKartTrackEnvironment(engine.track);
    const { context, calls } = recordCanvas();
    const initial = { time: engine.time, lap: engine.player.lap, x: engine.player.x, y: engine.player.y };
    engine.drawRaceCameraBackdrop(context);
    engine.drawFallbackRearRoad(context);
    engine.drawUniverseRaceLandmarks(context);
    assert.equal(calls.some(call => call.kind === 'drawImage' && call.args[0] === nexusImage), false);
    assert.ok(calls.some(call => call.kind === 'createLinearGradient' && call.stops.some(([, color]) => color === environment.sky)));
    assert.ok(calls.some(call => call.kind === 'createLinearGradient' && call.stops.some(([, color]) => color === environment.ground)));
    assert.ok(calls.some(call => call.kind === 'fill' && call.fill === environment.road));
    assert.ok(calls.some(call => call.kind === 'fill' && call.fill === environment.shoulder));
    assert.deepEqual({ time: engine.time, lap: engine.player.lap, x: engine.player.x, y: engine.player.y }, initial);
    if (universe === 'Halo') assert.ok(calls.some(call => call.kind === 'ellipse'), 'Installation 04 has its ring in the 2D sky');
  });
}

test('the six historical courses retain their existing Nexus backdrop and road palette', () => {
  for (const id of ['nexus_archive_loop', 'nexus_suture_eight', 'anchor_market_dash', 'fragment_frostway', 'portal_hairpin_ritual', 'overload_bossway']) {
    const engine = new EngineRace(960, 540, () => {}, id);
    const nexusImage = { complete: true, naturalWidth: 1024 };
    engine.images.trackNexus = nexusImage;
    const { context, calls } = recordCanvas();
    engine.drawRaceCameraBackdrop(context);
    engine.drawFallbackRearRoad(context);
    assert.ok(calls.some(call => call.kind === 'drawImage' && call.args[0] === nexusImage), id);
    assert.ok(calls.some(call => call.kind === 'fill' && call.fill === '#303443'), id);
    assert.equal(engine.getUniverseLandmarkProjections().length, 0);
  }
});

test('landmarks retain world identities and remain outside the continuous sprite road', () => {
  const engine = new EngineRace(960, 540, () => {}, getKartUniverseTrackId('Halo'));
  const environment = getKartTrackEnvironment(engine.track);
  const snapshot = JSON.stringify(environment.landmarks);
  const seen = new Set();
  for (let step = 0; step < 10; step += 1) {
    engine.player.angle = step / 10 * Math.PI * 2;
    for (const { landmark, projection } of engine.getUniverseLandmarkProjections()) {
      assert.ok(environment.landmarks.includes(landmark));
      assert.ok([projection.x, projection.y, projection.width, projection.height].every(Number.isFinite));
      const center = engine.width / 2 + engine.getRoadCurveOffset(projection.t);
      const verge = 42 + (470 - 42) * projection.t ** 1.08;
      assert.ok(Math.abs(projection.x - center) >= verge + projection.width * .42 + 7.9);
      seen.add(landmark.kind);
    }
  }
  assert.ok(seen.has('forerunner'), 'the shared Forerunner entry is projected as course scenery');
  assert.equal(JSON.stringify(environment.landmarks), snapshot, 'rendering does not relocate the simulation or 3D landmarks');
});

test('Forerunner, Alien bulkheads and Green Hill shapes produce distinct 2D silhouettes', () => {
  const results = [];
  for (const [universe, kind] of [['Halo', 'forerunner'], ['Alien', 'bulkhead'], ['Sonic', 'checker-hill']]) {
    const engine = new EngineRace(960, 540, () => {}, getKartUniverseTrackId(universe));
    const landmark = getKartTrackEnvironment(engine.track).landmarks.find(entry => entry.kind === kind);
    assert.ok(landmark, kind);
    const { context, calls } = recordCanvas();
    engine.drawUniverseLandmark2D(context, landmark, { x: 150, y: 250, width: 100, height: 140 });
    results.push(JSON.stringify(calls.filter(call => ['moveTo', 'lineTo', 'fillRect'].includes(call.kind)).map(call => [call.kind, call.args])));
  }
  assert.equal(new Set(results).size, 3);
});
