import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getMosaicCameraPosition, restoreMosaicLocation, snapshotMosaicLocation } from '../src/game/immersiveHubState.js';
import { advanceMosaicPlayer } from '../src/game/mosaicCityRuntime.js';
import { MOSAIC_CHARACTER_MISSIONS, getMosaicCharacterMissionObjective, advanceMosaicCharacterMissionWalk,
  normalizeMosaicCharacterMissions } from '../src/game/mosaicCharacterMissions.js';

const district = Object.freeze({ id: 'universe-nexus', worldW: 1920, worldH: 1180, spawn: Object.freeze({ x: 820, y: 760 }) });
const districts = Object.freeze({ atrium: Object.freeze({ id: 'atrium', worldW: 1640, worldH: 1080, spawn: Object.freeze({ x: 780, y: 520 }) }), [district.id]: district });
const portrait = Object.freeze({ width: 250, height: 540 });
const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: ${actual} != ${expected}`);
const cameraEquals = (actual, expected, message) => {
  close(actual.x, expected.x, `${message} x`);
  close(actual.y, expected.y, `${message} y`);
};

test('the four observed portrait resume coordinates are centered in the actual 250 × 540 canvas', () => {
  // Tessera's full position is from the failed native frame. The other observed
  // horizontal positions reuse its vertical fixture to isolate the width bug.
  for (const [name, x, expectedX] of [
    ['Tessera', 668.16, 543.16], ['Mirelle', 689.50, 564.50],
    ['Quillon', 676.85, 551.85], ['Nadir', 1250.04, 1125.04]
  ]) {
    const player = Object.freeze({ x, y: 725.43 });
    const camera = getMosaicCameraPosition(player, district, portrait);
    cameraEquals(camera, { x: expectedX, y: 455.43 }, name);
    close(player.x - camera.x, 125, `${name} horizontal center`);
    close(player.y - camera.y, 270, `${name} vertical center`);
  }
  cameraEquals(getMosaicCameraPosition({ x: 668.16, y: 725.43 }, district), { x: 188.16, y: 455.43 }, 'legacy caller');
});

test('portrait, desktop, short landscape and a taller canvas use their real logical dimensions', () => {
  const player = Object.freeze({ x: 960, y: 590 });
  for (const [width, height, x, y] of [
    [250, 540, 835, 320], [960, 540, 480, 320],
    [1169, 540, 375.5, 320], [800, 800, 560, 190]
  ]) cameraEquals(getMosaicCameraPosition(player, district, { width, height }), { x, y }, `${width} × ${height}`);
});

test('camera framing stays within world bounds, including a canvas larger than the world', () => {
  for (const [player, viewport, expected] of [
    [{ x: 34, y: 58 }, portrait, { x: 0, y: 0 }],
    [{ x: 1886, y: 1130 }, portrait, { x: 1670, y: 640 }],
    [{ x: 1886, y: 1130 }, { width: 960, height: 540 }, { x: 960, y: 640 }],
    [{ x: 960, y: 590 }, { width: 2200, height: 1400 }, { x: 0, y: 0 }]
  ]) cameraEquals(getMosaicCameraPosition(player, district, viewport), expected, 'world edge');
  assert.deepEqual(getMosaicCameraPosition({ x: 80, y: 70 }, { worldW: 180, worldH: 160 }, portrait), { x: 0, y: 0 });
});

test('unmeasured or invalid viewport axes retain the historical fallback without coercion', () => {
  const player = { x: 668.16, y: 725.43 };
  const legacy = getMosaicCameraPosition(player, district);
  for (const viewport of [null, undefined, {}, { width: undefined, height: null }]) {
    assert.deepEqual(getMosaicCameraPosition(player, district, viewport), legacy);
  }
  for (const invalid of [0, -1, NaN, Infinity, -Infinity, '250', true]) {
    cameraEquals(getMosaicCameraPosition(player, district, { width: invalid, height: 400 }), { x: 188.16, y: 525.43 }, 'invalid width only');
    cameraEquals(getMosaicCameraPosition(player, district, { width: 250, height: invalid }), { x: 543.16, y: 455.43 }, 'invalid height only');
  }
});

test('restore reframes the clamped player without changing saved location, facing or snapshot fields', () => {
  const saved = Object.freeze({ districtId: district.id, zoneId: 'window-workbench', player: Object.freeze({ x: 668.16, y: 725.43, facing: -1 }) });
  const restored = restoreMosaicLocation(saved, districts, portrait);
  assert.deepEqual(restored.player, saved.player);
  cameraEquals(restored.camera, { x: 543.16, y: 455.43 }, 'restored portrait');
  assert.deepEqual(snapshotMosaicLocation(restored, restored.districtId, restored.zoneId), saved);
  assert.deepEqual(restoreMosaicLocation(saved, districts).player, restored.player);
  const bounded = restoreMosaicLocation({ districtId: district.id, player: { x: 9999, y: -500, facing: -1 } }, districts, portrait);
  assert.deepEqual(bounded.player, { x: 1886, y: 58, facing: -1 });
  assert.deepEqual(bounded.camera, { x: 1670, y: 0 });
  const missing = restoreMosaicLocation({ districtId: 'unavailable-dlc', zoneId: 'unavailable-place', player: { x: 42, y: 60 } }, districts, portrait);
  assert.equal(missing.districtId, 'atrium');
  assert.equal(missing.zoneId, 'atrium');
  assert.deepEqual(missing.player, { x: 780, y: 520, facing: 1 });
  assert.deepEqual(missing.camera, { x: 655, y: 250 });
});

// Run the production callback up to the first zone lookup. This executes the
// actual camera lifecycle and real movement, with only React refs and the
// browser scheduling boundary supplied by the harness.
const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const marker = '    const renderFrame = (timestamp = performance.now()) => {';
const start = hub.indexOf(marker);
const end = hub.indexOf('      let activeZone = district;', start);
assert.ok(start >= 0 && end > start, 'the City renderFrame prefix must exist');
const makeFrame = new Function('environment', `
  const { stateRef, sessionPausedRef, cityMenuRef, cameraViewportRef, canvas,
    district, currentDistrict, recordGuide, advanceMosaicPlayer,
    getMosaicCameraPosition, characterMissionCatalog, characterMissionsRef,
    advanceMosaicCharacterMissionWalk, getMosaicCharacterMissionObjective,
    commitCharacterMissions, lang, document, window } = environment;
  let lastFrame = null;
  let rafId;
  const loop = () => {};
  ${hub.slice(start, end)}
  };
  return renderFrame;
`);

const makeEnvironment = (canvas = { width: 250, height: 540 }) => {
  const saved = { districtId: district.id, zoneId: 'window-workbench', player: { x: 668.16, y: 725.43, facing: 1 } };
  // Deliberately begin with the historical camera so a missing first-frame
  // correction reproduces the native failure instead of being hidden by setup.
  const restored = restoreMosaicLocation(saved, districts);
  const movements = [];
  return {
    stateRef: { current: { ...restored, t: 0, player: { ...restored.player, speed: 2.35 }, keys: {}, npcs: [], destination: null } },
    sessionPausedRef: { current: false }, cityMenuRef: { current: false }, cameraViewportRef: { current: null },
    canvas, district, currentDistrict: district.id, movements,
    recordGuide: (event, distance) => movements.push({ event, distance }),
    advanceMosaicPlayer, getMosaicCameraPosition, document: { hidden: false },
    characterMissionCatalog: [], characterMissionsRef: { current: normalizeMosaicCharacterMissions() },
    advanceMosaicCharacterMissionWalk, getMosaicCharacterMissionObjective, lang: 'fr',
    commitCharacterMissions: () => { throw new Error('an unrelated camera frame cannot change a mission'); },
    window: { requestAnimationFrame: () => { throw new Error('an active prefix must not schedule a paused frame'); } }
  };
};

test('the real first render frame centers the restored Tessera before any movement or interpolation', () => {
  const environment = makeEnvironment();
  const state = environment.stateRef.current;
  const originalPlayer = { ...state.player };
  const camera = state.camera;
  const frame = makeFrame(environment);
  frame(1000);
  assert.equal(state.camera, camera, 'the existing camera object remains usable by the scene');
  cameraEquals(state.camera, { x: 543.16, y: 455.43 }, 'first real frame');
  assert.deepEqual(state.player, { ...originalPlayer, state: 'idle' });
  assert.deepEqual(environment.movements, [{ event: 'move', distance: 0 }]);
  assert.equal(state.t, 0);
  assert.equal(environment.cameraViewportRef.current.canvas, environment.canvas);
});

test('the real render frame snaps on portrait resize and then preserves the existing smooth follow', () => {
  const environment = makeEnvironment({ width: 1169, height: 540 });
  const frame = makeFrame(environment);
  const state = environment.stateRef.current;
  frame(1000);
  cameraEquals(state.camera, { x: 83.66, y: 455.43 }, 'landscape first frame');
  environment.canvas.width = 250;
  frame(1016);
  cameraEquals(state.camera, { x: 543.16, y: 455.43 }, 'resized portrait frame');
  assert.equal(environment.cameraViewportRef.current.width, 250);
  state.keys.d = true;
  frame(1016 + 1000 / 60);
  close(state.player.x, 670.51, 'real movement distance is unchanged');
  close(environment.movements.at(-1).distance, 2.35, 'real guide movement');
  close(state.camera.x, 543.442, 'ordinary frame retains the 0.12 follow blend');
  assert.ok(state.camera.x < state.player.x - 125, 'normal motion is followed smoothly instead of snapping every frame');
});

test('restarting the real effect callback keeps follow lag, while a replacement canvas reframes immediately', () => {
  const environment = makeEnvironment();
  const state = environment.stateRef.current;
  let frame = makeFrame(environment);
  frame(1000);
  state.keys.d = true;
  frame(1000 + 1000 / 60);
  const beforeRestart = { ...state.camera };
  const viewportMemory = environment.cameraViewportRef.current;
  frame = makeFrame(environment);
  frame(2000);
  assert.deepEqual(state.camera, beforeRestart, 'an effect restart with the same canvas must not resnap');
  assert.equal(environment.cameraViewportRef.current, viewportMemory);
  frame(2000 + 1000 / 60);
  close(state.player.x, 672.86, 'movement resumes after the restarted callback');
  close(state.camera.x, 543.97216, 'follow continues from its previous camera');
  environment.canvas = { width: 250, height: 540 };
  frame = makeFrame(environment);
  frame(3000);
  cameraEquals(state.camera, { x: 547.86, y: 455.43 }, 'new canvas with the same dimensions');
  assert.equal(environment.cameraViewportRef.current.canvas, environment.canvas);
});

test('the production frame earns one walked marker, follows the requested next place and freezes under every scene pause', () => {
  const environment = makeEnvironment();
  const source = MOSAIC_CHARACTER_MISSIONS.find(mission => mission.id === 'city-anchor-shared-beacon-v1');
  const mission = { ...source, districtId: district.id, anchorId: 'local-anchor' };
  const parent = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === mission.requiresMissionId);
  const index = mission.steps.findIndex(step => step.walk);
  const saved = { heroId: mission.heroId, universe: mission.universe, districtId: district.id,
    completedStepIds: mission.steps.slice(0, index).map(step => step.id), choiceId: 'apply',
    completed: false, storyRevision: 2, originStoryRevision: 2, originChoiceId: 'retain-origin' };
  environment.characterMissionCatalog = [mission];
  environment.characterMissionsRef.current = normalizeMosaicCharacterMissions({ activeId: mission.id, records: {
    [parent.id]: { heroId: parent.heroId, universe: parent.universe, districtId: district.id,
      completedStepIds: parent.steps.map(step => step.id), choiceId: 'retain-origin', completed: true, storyRevision: 2 },
    [mission.id]: saved
  } });
  const saves = [];
  environment.commitCharacterMissions = next => { saves.push(next); environment.characterMissionsRef.current = next; };
  environment.window.requestAnimationFrame = () => 1;
  const state = environment.stateRef.current;
  const current = getMosaicCharacterMissionObjective(environment.characterMissionsRef.current, mission);
  state.player.x = current.walk.next.x - 65; state.player.y = current.walk.next.y;
  state.destination = { x: current.walk.next.x, y: current.walk.next.y };
  state.pendingInteraction = { type: 'zone', id: current.targetId };
  const frame = makeFrame(environment);
  frame(1000);
  assert.equal(saves.length, 0, 'a first-frame restore is not movement');
  frame(1000 + 1000 / 60);
  assert.equal(saves.length, 1);
  const after = getMosaicCharacterMissionObjective(environment.characterMissionsRef.current, mission);
  assert.equal(after.walk.visited, 1); assert.equal(after.index, index);
  assert.deepEqual(state.destination, { x: after.walk.next.x, y: after.walk.next.y });
  close(state.player.x, current.walk.next.x - 65 + 2.35, 'the player was never placed at the next marker');
  assert.deepEqual(environment.characterMissionsRef.current.records[mission.id].completedStepIds, saved.completedStepIds);
  const frozen = JSON.stringify(environment.characterMissionsRef.current);
  const position = { x: state.player.x, y: state.player.y, facing: state.player.facing, speed: state.player.speed };
  const geometry = () => ({ x: state.player.x, y: state.player.y, facing: state.player.facing, speed: state.player.speed });
  for (const [owner, field] of [[environment.cityMenuRef, 'current'], [environment.sessionPausedRef, 'current'], [environment.document, 'hidden']]) {
    owner[field] = true; frame(7000);
    assert.equal(JSON.stringify(environment.characterMissionsRef.current), frozen);
    assert.deepEqual(geometry(), position);
    owner[field] = false; frame(9000);
    assert.equal(saves.length, 1, 'resuming never catches up the time spent in a menu');
    assert.deepEqual(geometry(), position);
    assert.equal(state.player.state, 'idle');
  }
});

test('manual walking earns the same checkpoint without creating a destination or an automatic interaction', () => {
  const environment = makeEnvironment();
  // Capture the real production branch with an earned observation, without
  // replacing the movement function or manufacturing player coordinates.
  const mission = { id: 'manual-walk', steps: [{ id: 'walk' }] };
  environment.characterMissionCatalog = [mission];
  environment.characterMissionsRef.current = { activeId: mission.id };
  environment.advanceMosaicCharacterMissionWalk = (progress, actualMission, movement) => {
    assert.equal(actualMission, mission);
    if (!movement.distance) return { changed: false, progress };
    assert.ok(movement.to.x > movement.from.x);
    return { changed: true, progress, walk: { next: { x: 1400, y: 790 } } };
  };
  environment.getMosaicCharacterMissionObjective = () => ({ step: { id: 'walk' }, walk: { completed: false } });
  environment.commitCharacterMissions = () => {};
  const state = environment.stateRef.current;
  state.keys.d = true;
  const frame = makeFrame(environment);
  frame(1000); frame(1000 + 1000 / 60);
  assert.equal(state.destination, null); assert.equal(state.pendingInteraction, null);
});
