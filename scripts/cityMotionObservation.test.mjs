import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getMosaicZoneAnchor, getMosaicSceneObstacles, MOSAIC_INTERACTION_RANGE } from '../src/game/mosaicCityRuntime.js';

const source = readFileSync(new URL('./fixtures/cityExtinctionHarness.jsx', import.meta.url), 'utf8');
const start = source.indexOf('audit.cityZone = id => {');
const end = source.indexOf('\naudit.snapshot =', start);
assert.ok(start >= 0 && end > start, 'the browser must expose its actual read-only observer');
const makeObserver = new Function('audit', 'mode', 'getSceneFiber', 'getMosaicZoneAnchor', 'getMosaicSceneObstacles', 'MOSAIC_INTERACTION_RANGE',
  `${source.slice(start, end)}\nreturn audit.cityZone;`);
const marker = (extra = {}) => ({ id: 'city-nova-return-measurement-v1::inherited-route', action: 'character-mission',
  universe: 'Nexus de Convergence', x: 1248, y: 748, w: 64, h: 64, ...extra });
const fiber = (zones, obstacles) => ({ memoizedState: { memoizedState: [zones, []],
  next: { memoizedState: [obstacles, []], next: null } } });
function fixture({ zones = [marker()], live = zones, alternate = null, mode = 'city' } = {}) {
  const state = { t: 0, player: { x: 1305.14, y: 813.92, speed: 2.35 },
    obstacles: getMosaicSceneObstacles(null, live), pendingInteraction: null };
  const audit = { state: () => state };
  const root = { ...fiber(zones, alternate ? getMosaicSceneObstacles(null, zones) : state.obstacles),
    alternate: alternate && fiber(alternate, state.obstacles) };
  const observe = makeObserver(audit, mode, () => root, getMosaicZoneAnchor, getMosaicSceneObstacles, MOSAIC_INTERACTION_RANGE);
  return { observe, state, root };
}

test('a remounted scene exposes the actual nearby marker before its first tick without mutating it', () => {
  const f = fixture(), before = structuredClone(f.state);
  const observed = f.observe(marker().id);
  assert.deepEqual({ type: observed.type, id: observed.id, action: observed.action, universe: observed.universe },
    { type: 'zone', id: marker().id, action: 'character-mission', universe: 'Nexus de Convergence' });
  assert.equal(observed.x, 1280); assert.equal(observed.y, 780); assert.equal(observed.range, 72);
  assert.ok(observed.distance > 42 && observed.distance < 43);
  assert.equal(observed.source, 'live-zone-with-footprint');
  assert.deepEqual(observed.footprint, f.state.obstacles[0]);
  assert.notEqual(observed.footprint, f.state.obstacles[0]);
  assert.deepEqual(f.state, before);
});

test('a retained host fiber cannot replace the current terminal with an earlier branch position', () => {
  const current = marker(), stale = marker({ x: 600, y: 500 });
  const f = fixture({ zones: [stale], live: [current], alternate: [current] });
  assert.equal(f.observe(current.id).x, 1280);
  f.root.alternate = null;
  assert.equal(f.observe(current.id), null);
});

test('an identical old footprint cannot supply a stale action or universe from the retained fiber', () => {
  const current = marker(), stale = marker({ action: 'anchor', universe: 'Other' });
  const f = fixture({ zones: [stale], live: [current], alternate: [current] });
  assert.deepEqual(getMosaicSceneObstacles(null, [stale]), f.state.obstacles);
  const observed = f.observe(current.id);
  assert.equal(observed.action, 'character-mission');
  assert.equal(observed.universe, 'Nexus de Convergence');
  f.root.alternate = null;
  assert.equal(f.observe(current.id), null);
});

test('a wrong identity or changed physical footprint cannot establish proximity', () => {
  for (const mutation of [{ id: 'terminal-other' }, { x: 0 }, { y: 0 }, { w: 43 }, { h: 9 }]) {
    const f = fixture(); Object.assign(f.state.obstacles[0], mutation);
    assert.equal(f.observe(marker().id), null, JSON.stringify(mutation));
  }
  const f = fixture();
  assert.equal(f.observe('other-contract::inherited-route'), null);
  assert.equal(f.observe('city-nova-return-measurement-v1::crosscheck'), null);
  f.state.obstacles = [];
  assert.equal(f.observe(marker().id), null);
});

test('non-zones, incomplete geometry and FPS state cannot become City proximity evidence', () => {
  for (const mutation of [{ action: undefined }, { universe: undefined }, { x: NaN }, { w: undefined }]) {
    const f = fixture({ zones: [marker(mutation)], live: [marker()] });
    assert.equal(f.observe(marker().id), null);
  }
  const f = fixture({ mode: 'fps' });
  assert.equal(f.observe(marker().id), null);
});
