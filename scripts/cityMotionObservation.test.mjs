import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getMosaicZoneAnchor, getMosaicSceneObstacles, MOSAIC_INTERACTION_RANGE } from '../src/game/mosaicCityRuntime.js';
import { MOSAIC_CHARACTER_MISSIONS, getMosaicCharacterMissionStep, localizeCityMission } from '../src/game/mosaicCharacterMissions.js';
import { getMosaicMissionOperation } from '../src/game/mosaicMissionOperations.js';

const source = readFileSync(new URL('./fixtures/cityExtinctionHarness.jsx', import.meta.url), 'utf8');
const start = source.indexOf('audit.cityZone = id => {');
const end = source.indexOf('\naudit.snapshot =', start);
assert.ok(start >= 0 && end > start, 'the browser must expose its actual read-only observer');
const makeObserver = new Function('audit', 'mode', 'getSceneFiber', 'getMosaicZoneAnchor', 'getMosaicSceneObstacles', 'MOSAIC_INTERACTION_RANGE', 'MOSAIC_CHARACTER_MISSIONS',
  'getMosaicCharacterMissionStep', 'getMosaicMissionOperation', 'localizeCityMission', 'lang',
  `${source.slice(start, end)}\nreturn audit;`);
const marker = (extra = {}) => ({ id: 'city-nova-return-measurement-v1::inherited-route', action: 'character-mission',
  universe: 'Nexus de Convergence', x: 1248, y: 748, w: 64, h: 64, ...extra });
const fiber = (zones, obstacles) => ({ memoizedState: { memoizedState: [zones, []],
  next: { memoizedState: [obstacles, []], next: null } } });
function fixture({ zones = [marker()], live = zones, alternate = null, mode = 'city', progress = null, lang = 'fr' } = {}) {
  const state = { t: 0, player: { x: 1305.14, y: 813.92, speed: 2.35 },
    obstacles: getMosaicSceneObstacles(null, live), pendingInteraction: null };
  const audit = { state: () => state, characterMissions: progress };
  const root = { ...fiber(zones, alternate ? getMosaicSceneObstacles(null, zones) : state.obstacles),
    alternate: alternate && fiber(alternate, state.obstacles) };
  const readers = makeObserver(audit, mode, () => root, getMosaicZoneAnchor, getMosaicSceneObstacles, MOSAIC_INTERACTION_RANGE, MOSAIC_CHARACTER_MISSIONS,
    getMosaicCharacterMissionStep, getMosaicMissionOperation, localizeCityMission, lang);
  return { observe: readers.cityZone, npc: readers.cityNpc, target: readers.cityContractTarget, operation: readers.cityContractOperation, audit, state, root };
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

function storyProgress(mission, originChoiceId, index, choiceId = null) {
  const parent = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === mission.requiresMissionId);
  const districtId = 'universe-nexus-de-convergence';
  return { activeId: mission.id, records: {
    [parent.id]: { heroId: parent.heroId, universe: parent.universe, districtId,
      completedStepIds: parent.steps.map(step => step.id), choiceId: originChoiceId, completed: true, storyRevision: 2 },
    [mission.id]: { heroId: mission.heroId, universe: mission.universe, districtId,
      completedStepIds: mission.steps.slice(0, index).map(step => step.id), choiceId, completed: false,
      storyRevision: 2, originChoiceId, originStoryRevision: 2, operationReceipts: {} }
  } };
}

test('the operation observer reads both effective origin branches without creating a receipt or changing the source', () => {
  const mission = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === 'city-nova-return-measurement-v1');
  const step = mission.steps.find(item => item.byOriginChoice), index = mission.steps.indexOf(step);
  const original = JSON.stringify(mission);
  const observations = [];
  for (const [origin, branch] of Object.entries(step.byOriginChoice)) {
    const progress = storyProgress(mission, origin, index);
    const f = fixture({ progress, lang: 'en' }), saved = JSON.stringify({ progress, state: f.state });
    const observed = f.operation({ missionId: mission.id, stepId: step.id, districtId: 'universe-nexus-de-convergence' });
    assert.equal(observed.source, 'effective-mission-step');
    assert.equal(observed.kind, branch.operation.kind);
    assert.equal(observed.propName, branch.operation.propName.en);
    assert.equal(observed.completedText, branch.operation.completedText.en);
    assert.equal(observed.x, branch.x); assert.equal(observed.y, branch.y);
    assert.equal(observed.originChoiceId, origin); assert.equal(observed.originStoryRevision, 2);
    assert.equal(observed.targetId, `${mission.id}::${step.id}`);
    assert.equal(observed.branchChoiceId, null);
    observations.push(`${observed.x}:${observed.y}:${observed.completedText}`);
    assert.equal(JSON.stringify({ progress, state: f.state }), saved);
    assert.deepEqual(progress.records[mission.id].operationReceipts, {});
  }
  assert.ok(new Set(observations).size > 1, 'The observed branch must retain its different place or outcome');
  assert.equal(JSON.stringify(mission), original);
});

test('the operation observer follows the selected intervention without retaining an earlier decision', () => {
  const mission = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === 'city-nova-return-measurement-v1');
  const step = mission.steps.find(item => item.byChoice), index = mission.steps.indexOf(step);
  const origin = Object.keys(mission.steps.find(item => item.byOriginChoice).byOriginChoice)[0];
  const f = fixture();
  for (const selected of ['apply', 'hold']) {
    f.audit.characterMissions = storyProgress(mission, origin, index, selected);
    const before = JSON.stringify(f.audit.characterMissions);
    const observed = f.operation({ missionId: mission.id, stepId: step.id, districtId: 'universe-nexus-de-convergence' });
    assert.equal(observed.branchChoiceId, selected);
    assert.equal(observed.label, step.byChoice[selected].operation.label.fr);
    assert.equal(observed.completedText, step.byChoice[selected].operation.completedText.fr);
    assert.equal(JSON.stringify(f.audit.characterMissions), before);
  }
});

test('old completed steps, conversations, decisions and missing targets never become operation observations', () => {
  const mission = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === 'city-anchor-signature-v1');
  const input = { missionId: mission.id, stepId: mission.steps[0].id, districtId: 'universe-nexus-de-convergence' };
  const progress = { activeId: mission.id, records: { [mission.id]: { heroId: mission.heroId, universe: mission.universe,
    districtId: input.districtId, completedStepIds: [input.stepId], completed: false, choiceId: null } } };
  const f = fixture({ progress }), before = JSON.stringify(progress);
  assert.equal(f.operation(input), null, 'An old display visit is not a newly performed repair');
  assert.equal(JSON.stringify(progress), before);
  assert.equal(f.operation({ ...input, stepId: 'resolution' }), null);
  assert.equal(f.operation({ ...input, missionId: 'absent' }), null);
  assert.equal(f.operation({ ...input, stepId: 'absent' }), null);
  assert.equal(f.operation({ ...input, missionId: 'city-mirelle-suture-v1', stepId: 'meet-arca_mirelle' }), null);
  assert.equal(fixture({ mode: 'fps' }).operation(input), null);
});
