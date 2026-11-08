import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getMosaicZoneAnchor, getMosaicSceneObstacles, MOSAIC_INTERACTION_RANGE } from '../src/game/mosaicCityRuntime.js';
import { MOSAIC_CHARACTER_MISSIONS } from '../src/game/mosaicCharacterMissions.js';

const source = readFileSync(new URL('./fixtures/cityExtinctionHarness.jsx', import.meta.url), 'utf8');
const start = source.indexOf('audit.cityZone = id => {');
const end = source.indexOf('\naudit.snapshot =', start);
assert.ok(start >= 0 && end > start, 'the browser must expose its actual read-only observer');
const makeObserver = new Function('audit', 'mode', 'getSceneFiber', 'getMosaicZoneAnchor', 'getMosaicSceneObstacles', 'MOSAIC_INTERACTION_RANGE', 'MOSAIC_CHARACTER_MISSIONS',
  `${source.slice(start, end)}\nreturn audit;`);
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
  const readers = makeObserver(audit, mode, () => root, getMosaicZoneAnchor, getMosaicSceneObstacles, MOSAIC_INTERACTION_RANGE, MOSAIC_CHARACTER_MISSIONS);
  return { observe: readers.cityZone, npc: readers.cityNpc, target: readers.cityContractTarget, state, root };
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

function residentFixture(mode = 'city') {
  const f = fixture({ mode });
  f.state.player = { x: 891.0711610626, y: 932.9589320104402, speed: 2.35 };
  f.state.npcs = [{ hero: { id: 'arca_marrow', universe: 'Nexus de Convergence' },
    x: 900.3892541725363, y: 976.1949496042841 }];
  return f;
}
test('a resident already beside the player is observed before dialogue without moving either actor', () => {
  const f = residentFixture(), before = structuredClone(f.state);
  const observed = f.npc('arca_marrow');
  assert.deepEqual({ type: observed.type, id: observed.id, action: observed.action, universe: observed.universe, range: observed.range },
    { type: 'npc', id: 'arca_marrow', action: 'talk', universe: 'Nexus de Convergence', range: 58 });
  assert.ok(Math.abs(observed.distance - 44.22872456425377) < 1e-9);
  assert.equal(observed.source, 'live-npc');
  assert.deepEqual(f.state, before);
});
test('resident evidence preserves its observed coordinates even if that resident later moves', () => {
  const f = residentFixture(), before = f.npc('arca_marrow');
  f.state.npcs[0].x += 300;
  const after = f.npc('arca_marrow');
  assert.equal(before.x, 900.3892541725363);
  assert.ok(before.distance < 58 && after.distance > 58);
  assert.notEqual(before, after);
});
test('a different, incomplete or absent resident cannot supply proximity, nor can an FPS scene', () => {
  const f = residentFixture();
  assert.equal(f.npc('arca_nova'), null);
  f.state.npcs[0].hero.universe = undefined;
  assert.equal(f.npc('arca_marrow'), null);
  f.state.npcs[0].hero.universe = 'Nexus de Convergence';
  f.state.npcs[0].x = NaN;
  assert.equal(f.npc('arca_marrow'), null);
  f.state.npcs = null;
  assert.equal(f.npc('arca_marrow'), null);
  assert.equal(residentFixture('fps').npc('arca_marrow'), null);
});
test('declared targets cover the irregular return-marrow name and every physical interaction type', () => {
  const f = fixture(), districtId = 'universe-nexus-de-convergence', universe = 'Nexus de Convergence';
  const before = JSON.stringify(MOSAIC_CHARACTER_MISSIONS);
  for (const [missionId, stepId, type, id, action, range] of [
    ['city-marrow-distinct-choices-v1', 'return-marrow', 'npc', 'arca_marrow', 'talk', 58],
    ['city-anchor-signature-v1', 'inspect-nexus_anchor_coil', 'zone', `${districtId}::exhibit::nexus_anchor_coil`, 'exhibit', 72],
    ['city-nova-return-measurement-v1', 'inherited-route', 'zone', 'city-nova-return-measurement-v1::inherited-route', 'character-mission', 72],
    ['city-marrow-independent-answers-v1', 'report', 'zone', `${districtId}-core`, 'anchor', 72]
  ]) assert.deepEqual(f.target({ missionId, stepId, districtId }), { type, id, action, universe, range });
  assert.equal(f.target({ missionId: 'city-marrow-independent-answers-v1', stepId: 'resolution', districtId }), null);
  assert.equal(f.target({ missionId: 'absent', stepId: 'report', districtId }), null);
  assert.equal(f.target({ missionId: 'city-marrow-independent-answers-v1', stepId: 'absent', districtId }), null);
  assert.equal(JSON.stringify(MOSAIC_CHARACTER_MISSIONS), before);
});
