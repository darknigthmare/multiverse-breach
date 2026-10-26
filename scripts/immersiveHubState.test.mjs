import { createSceneInputs } from '../src/game/sceneInputs.js';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRaceRunGuard } from '../src/game/raceSessionControls.js';
import { advanceMosaicPlayer } from '../src/game/mosaicCityRuntime.js';
import { applyExtinctionReport, compareGearBoosts, getSceneHudLayout, normalizeExtinctionReport, normalizeHubNavigation, restoreMosaicLocation, snapshotMosaicLocation } from '../src/game/immersiveHubState.js';

const districts = {
  atrium: { id: 'atrium', worldW: 1640, worldH: 1080, spawn: { x: 780, y: 520 } },
  forge: { id: 'forge', worldW: 1640, worldH: 980, spawn: { x: 820, y: 260 } },
  'universe-halo': { id: 'universe-halo', worldW: 1920, worldH: 1180, spawn: { x: 820, y: 760 } }
};

test('leaving a walked city district and restoring it preserves position, facing and district', () => {
  const state = { player: { x: 815, y: 311, speed: 2.35, facing: -1 }, keys: { arrowdown: true }, npcs: [], destination: null };
  for (let frame = 0; frame < 120; frame++) advanceMosaicPlayer(state, districts.forge, 1000 / 60);
  const saved = snapshotMosaicLocation(state, 'forge', 'gear');
  const reloaded = restoreMosaicLocation(JSON.parse(JSON.stringify(saved)), districts);
  assert.equal(reloaded.districtId, 'forge');
  assert.equal(reloaded.zoneId, 'gear');
  assert.deepEqual(reloaded.player, { x: 815, y: 593, facing: -1 });
  assert.equal('keys' in saved, false);
  assert.equal('destination' in saved, false);
  assert.equal('npcs' in saved, false);
});

test('a hidden/unavailable district falls back safely while valid world positions are clamped', () => {
  const missing = restoreMosaicLocation({ districtId: 'locked-world', zoneId: 'locked-terminal', player: { x: 999, y: 100 } }, districts);
  assert.equal(missing.districtId, 'atrium');
  assert.deepEqual(missing.player, { x: 780, y: 520, facing: 1 });
  const clamped = restoreMosaicLocation({ districtId: 'forge', player: { x: -500, y: 9999 } }, districts);
  assert.deepEqual(clamped.player, { x: 34, y: 930, facing: 1 });
  const corrupt = restoreMosaicLocation({ districtId: 'forge', player: { x: NaN, y: Infinity } }, districts);
  assert.deepEqual(corrupt.player, { x: 820, y: 260, facing: 1 });
});

const result = (overrides = {}) => ({
  reason: 'completed', runId: 'extinction-run-1', at: '2026-10-25T12:00:00Z', mode: 'extraction',
  result: 'victory', kills: 12, waves: 3, rewards: { gold: 172, shards: 45, modeXp: 210, title: 'Extraction réussie' }, ...overrides
});

test('Extinction persists mode XP, receipts and a journal entry without overwriting existing progression', () => {
  const previous = { seasonXp: 940, dailyWins: 3, mosaicLocation: { districtId: 'forge' }, riftJournal: [{ id: 'story-1' }], extinctionCareer: { xp: 20, runs: 1, wins: 0, receipts: ['older-run'] } };
  const updated = applyExtinctionReport(previous, result());
  assert.equal(updated.seasonXp, 940);
  assert.equal(updated.dailyWins, 3);
  assert.equal(updated.mosaicLocation, previous.mosaicLocation);
  assert.equal(updated.extinctionCareer.xp, 230);
  assert.equal(updated.extinctionCareer.runs, 2);
  assert.equal(updated.extinctionCareer.wins, 1);
  assert.deepEqual(updated.extinctionCareer.receipts, ['older-run', 'extinction-run-1']);
  assert.deepEqual(updated.riftJournal.map(entry => entry.id), ['extinction-run-1', 'story-1']);
  assert.equal(applyExtinctionReport(updated, result()), updated);
  assert.equal(applyExtinctionReport(JSON.parse(JSON.stringify(updated)), result()).extinctionCareer.xp, 230);
});

test('abandonment and malformed reports cannot award XP or rewards', () => {
  const progress = { seasonXp: 200 };
  for (const report of [null, {}, result({ reason: 'abandoned' }), result({ runId: null }), result({ result: 'unknown' })]) {
    assert.equal(applyExtinctionReport(progress, report), progress);
    assert.equal(normalizeExtinctionReport(report), null);
  }
  const safe = normalizeExtinctionReport(result({ rewards: { gold: Infinity, shards: -20, modeXp: '12' } }));
  assert.deepEqual(safe.rewards, { gold: 0, shards: 0, modeXp: 12, title: '' });
});

// Exercise the real Hub completion callback, including all three React setters.
// This catches the original loss of displayed gold/shards and premature session exit.
const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');

test('canvas map/radar bounds respect portrait, short landscape and desktop at both HUD scale extremes', () => {
  for (const [width, height] of [[360, 800], [844, 390], [1366, 768]]) {
    for (const hudScale of [0.9, 1.4]) {
      const safeArea = 32;
      const city = getSceneHudLayout({ width, height, logicalHeight: 540, hudScale, safeArea });
      const fps = getSceneHudLayout({ width, height, logicalHeight: 430, hudScale, safeArea });
      const map = Object.fromEntries(Object.entries(city.cityMinimap).map(([key, value]) => [key, value / city.unitsPerCssPixel]));
      const radar = Object.fromEntries(Object.entries(fps.fpsRadar).map(([key, value]) => [key, value / fps.unitsPerCssPixel]));
      assert.ok(map.x >= safeArea && map.y > 56);
      assert.ok(map.x + map.width <= width - safeArea + 0.001);
      assert.ok(map.y + map.height <= height - safeArea + 0.001);
      if (width <= 760) assert.ok(map.y + map.height <= height - safeArea - 64 * hudScale + 0.001, 'map clears the touch control row');
      assert.ok(radar.y - radar.radius >= 56 + safeArea - 0.001, 'radar clears the dedicated toolbar');
      assert.ok(radar.x + radar.radius <= width - safeArea + 0.001);
      assert.ok(radar.y + radar.radius < height - safeArea);
    }
  }
});

test('real scene handlers resume W/E with button focus while reserving native activation and text entry', () => {
  const race = readFileSync(new URL('../src/components/RaceMode.jsx', import.meta.url), 'utf8');
  const readHandler = (source, marker = 'const onKeyDown = ') => {
    const start = source.indexOf(marker) + marker.length;
    return source.slice(start, source.indexOf('\n    };', start) + '\n    }'.length);
  };
  let prevents = 0, fires = 0, items = 0, collected = 0, cityInteractions = 0;
  const moves = [];
  const keysRef = { current: {} };
  const pause = { current: true };
  const event = (key, tagName = 'CANVAS', editable = false) => ({ key,
    target: { tagName, isContentEditable: editable, closest: selector => (
      (tagName === 'BUTTON' && selector.includes('button'))
      || (tagName === 'A' && selector.includes('a[href]'))
      || (['INPUT', 'SELECT', 'TEXTAREA'].includes(tagName) && selector.includes(tagName.toLowerCase()))
    ) ? {} : null },
    preventDefault() { prevents++; }
  });
  const engine = { finished: false, useItem() { items++; }, recoverPlayer() {} };
  const controls = new Set([' ', 'w', 'e', 'ArrowUp']);
  const normalizeKey = key => key === ' ' ? 'space' : key === 'ArrowUp' ? 'up' : key;
  const raceKey = new Function('runGuard', 'sessionPausedRef', 'document', 'engine', 'CONTROL_KEYS', 'normalizeKey', 'keysRef', `return (${readHandler(race)});`)(createRaceRunGuard(), pause, { hidden: false }, engine, controls, normalizeKey, keysRef);
  const raceKeyUp = new Function('sessionPausedRef', 'engine', 'CONTROL_KEYS', 'normalizeKey', 'keysRef', `return (${readHandler(race, 'const onKeyUp = ')});`)(pause, engine, controls, normalizeKey, keysRef);
  raceKey(event('e', 'BUTTON'));
  assert.equal(items, 0, 'garage pauses game commands');
  pause.current = false;
  raceKey(event('w', 'BUTTON'));
  raceKey(event('e', 'BUTTON'));
  raceKey(event('ArrowUp', 'BUTTON'));
  assert.equal(keysRef.current.w, true, 'movement resumes after focus returns to the garage button');
  assert.equal(keysRef.current.up, true);
  assert.equal(items, 1, 'E remains a game command on the focused pause/garage button');
  const beforeNative = prevents;
  raceKey(event(' ', 'BUTTON'));
  raceKeyUp(event(' ', 'BUTTON'));
  raceKey(event('Enter', 'BUTTON'));
  raceKey(event('Enter', 'A'));
  assert.equal(prevents, beforeNative, 'Space/Enter keep native activation');
  raceKeyUp(event('w', 'BUTTON'));
  assert.equal(keysRef.current.w, false);
  const beforeTyping = prevents;
  for (const tag of ['INPUT', 'SELECT', 'TEXTAREA']) raceKey(event('w', tag));
  raceKey(event('w', 'DIV', true));
  assert.equal(prevents, beforeTyping);
  assert.equal(keysRef.current.w, false);
  raceKey(event(' '));
  assert.equal(keysRef.current.space, true, 'canvas Space still drifts');

  const extinction = hub.slice(hub.indexOf('  const handleCanvasFire ='));
  const extinctionKey = new Function('intelRef', 'sessionPausedRef', 'stateRef', 'setMoveKey', 'fire', 'reload', 'collectLoot', 'activateRoleSkill', `return (${readHandler(extinction)});`)({ current: false }, pause, { current: { phase: 'running' } }, (...args) => moves.push(args), () => { fires++; }, () => {}, () => { collected++; }, () => {});
  extinctionKey(event('w', 'BUTTON'));
  extinctionKey(event('e', 'BUTTON'));
  assert.deepEqual(moves, [['forward', true, 'keyboard:w']]);
  assert.equal(collected, 1);
  const beforeFpsNative = prevents;
  extinctionKey(event(' ', 'BUTTON'));
  extinctionKey(event('Enter', 'BUTTON'));
  extinctionKey(event('Enter', 'A'));
  extinctionKey(event('w', 'INPUT'));
  extinctionKey(event('w', 'DIV', true));
  assert.equal(prevents, beforeFpsNative);
  assert.equal(fires, 0);
  assert.equal(moves.length, 1);
  extinctionKey(event(' '));
  assert.equal(fires, 1, 'canvas Space still fires');

  const city = hub.slice(hub.indexOf('function MosaicCityHub('), hub.indexOf('function ExtinctionRoyale('));
  const cityState = { current: { keys: {}, destination: {}, pendingInteraction: {} } };
  const cityKey = new Function('sceneInputsRef', 'sessionPausedRef', 'cityMenuRef', 'stateRef', 'interactWithNearby', `return (${readHandler(city)});`)({ current: createSceneInputs(['w','e','arrowup']) }, pause, { current: false }, cityState, () => { cityInteractions++; });
  cityKey(event('w', 'BUTTON'));
  cityKey(event('e', 'BUTTON'));
  assert.equal(cityState.current.keys.w, true);
  assert.equal(cityInteractions, 1);
  const beforeCityNative = prevents;
  cityKey(event(' ', 'BUTTON'));
  cityKey(event('Enter', 'BUTTON'));
  cityKey(event('e', 'INPUT'));
  cityKey(event('e', 'DIV', true));
  assert.equal(prevents, beforeCityNative);
  assert.equal(cityInteractions, 1);
});

test('the real pause focus trap yields to a modal that made its parent inert', () => {
  const start = hub.indexOf('const trapPauseFocus = ') + 'const trapPauseFocus = '.length;
  const body = hub.slice(start, hub.indexOf('\n    };', start) + '\n    }'.length);
  let inert = true, focused = 0, prevented = 0;
  const first = { focus: () => { focused++; } };
  const dialog = { closest: () => inert ? {} : null, contains: () => false };
  const trap = new Function('dialog', 'document', 'getFocusableControls', `return (${body});`)(dialog, { activeElement: {} }, () => [first]);
  const event = { key: 'Tab', preventDefault: () => { prevented++; } };
  trap(event);
  assert.equal(focused, 0);
  assert.equal(prevented, 0);
  inert = false;
  trap({ ...event, defaultPrevented: true });
  assert.equal(focused, 0);
  trap(event);
  assert.equal(focused, 1);
  assert.equal(prevented, 1);
});

test('UI memory restores mission, arc, filters and catalog cursors without save data or a running session', () => {
  const navigation = normalizeHubNavigation({
    activeTab: 'missions', missionScreen: 'universeArcs', missionWorkspaceView: 'map',
    narrativeGroupView: 'missions', missionSeed: 1024, mediaFilter: 'game', missionModeFilter: 'Tactics',
    briefingStageId: 42, selectedNarrativeArcId: 'halo-arc', selectedNarrativeGroupId: 'universe-Halo',
    directoryQuery: 'Halo', directoryStatus: 'available', narrativeGroupQuery: 'Halo', selectedHeroId: 'mirelle',
    catalogViews: { roster: { page: 4, pageSize: 12, query: 'Mirelle', category: 'mage', status: 'active' } },
    activeGameMode: 'custom', pauseMenuOpen: true, gold: 99999, completedStages: [42], engine: { running: true }
  });
  const remounted = normalizeHubNavigation(navigation);
  assert.deepEqual(remounted, navigation);
  assert.equal(remounted.briefingStageId, 42);
  assert.equal(remounted.selectedNarrativeArcId, 'halo-arc');
  assert.equal(remounted.selectedNarrativeGroupId, 'universe-Halo');
  assert.equal(remounted.directoryQuery, 'Halo');
  assert.equal(remounted.directoryStatus, 'available');
  assert.equal(remounted.catalogViews.roster.page, 4);
  assert.equal(remounted.catalogViews.roster.query, 'Mirelle');
  assert.notEqual(remounted.catalogViews.roster, navigation.catalogViews.roster);
  for (const excluded of ['activeGameMode', 'pauseMenuOpen', 'gold', 'completedStages', 'engine']) {
    assert.equal(Object.hasOwn(remounted, excluded), false);
  }
  const invalid = normalizeHubNavigation({ missionScreen: 'removed-screen', briefingStageId: {}, missionSeed: Infinity, catalogViews: { roster: { page: -8, pageSize: 999, query: {} } } });
  assert.equal(invalid.missionScreen, 'index');
  assert.equal(invalid.briefingStageId, null);
  assert.deepEqual(invalid.catalogViews.roster, { page: 1, pageSize: 24, query: '', category: 'all', status: 'all' });
});

test('real launch handler writes mission context before navigation and never bypasses access checks', () => {
  const memory = { current: null };
  const navigationSnapshot = normalizeHubNavigation({ missionScreen: 'universeArcs', selectedNarrativeArcId: 'halo-arc', selectedNarrativeGroupId: 'universe-Halo', mediaFilter: 'game', directoryQuery: 'Halo' });
  const rememberStart = hub.indexOf('const rememberHubNavigation = useCallback(') + 'const rememberHubNavigation = useCallback('.length;
  const rememberEnd = hub.indexOf('\n  }, [hubNavigationRef, navigationSnapshot]', rememberStart) + '\n  }'.length;
  const remember = new Function('hubNavigationRef', 'navigationSnapshot', 'normalizeHubNavigation', `return (${hub.slice(rememberStart, rememberEnd)});`)(memory, navigationSnapshot, normalizeHubNavigation);
  const launchStart = hub.indexOf('const launchStage = ') + 'const launchStage = '.length;
  const launchEnd = hub.indexOf('\n  };', launchStart) + '\n  }'.length;
  const launches = [];
  const launch = new Function('getMissionDeployment', 'notifyNexus', 'lang', 'getLockedReason', 'sound', 'rememberHubNavigation', 'onLaunchStage', 'prepareStage', `return (${hub.slice(launchStart, launchEnd)});`)(
    stage => ({ allowed: !stage.locked }), () => {}, 'fr', () => 'Verrouillée', { playSfx() {} }, remember,
    stage => { assert.equal(memory.current.briefingStageId, stage.id); launches.push(stage.id); }, stage => stage
  );
  launch({ id: 9, locked: true });
  assert.equal(memory.current, null);
  assert.deepEqual(launches, []);
  launch({ id: 42 });
  const remounted = normalizeHubNavigation(memory.current);
  assert.equal(remounted.briefingStageId, 42);
  assert.equal(remounted.missionScreen, 'universeArcs');
  assert.equal(remounted.selectedNarrativeGroupId, 'universe-Halo');
  assert.equal(remounted.directoryQuery, 'Halo');
  assert.deepEqual(launches, [42]);
});

test('real category effect preserves restored selection on mount, and resets only on a category change', () => {
  const start = hub.indexOf('    const entryRequest = missionEntryRequestRef.current;');
  const end = hub.indexOf('\n  }, [missionScreen]);', start);
  assert.ok(start > 0 && end > start);
  const previousMissionScreenRef = { current: 'universeArcs' };
  const missionEntryRequestRef = { current: null };
  const updates = {};
  const names = ['setSelectedNarrativeArcId', 'setSelectedNarrativeGroupId', 'setNarrativeGroupView', 'setMissionWorkspaceView', 'setMissionModeFilter', 'setDirectoryQuery', 'setDirectoryStatus', 'setNarrativeGroupQuery', 'setMediaFilter', 'setBriefingStageId'];
  const runEffect = missionScreen => new Function('previousMissionScreenRef', 'missionEntryRequestRef', 'missionScreen', ...names, hub.slice(start, end))(
    previousMissionScreenRef, missionEntryRequestRef, missionScreen, ...names.map(name => value => { updates[name] = value; })
  );
  runEffect('universeArcs');
  assert.deepEqual(updates, {});
  missionEntryRequestRef.current = { groupId: 'universe-Halo' };
  runEffect('universeArcs');
  assert.equal(updates.setSelectedNarrativeGroupId, 'universe-Halo');
  assert.equal(missionEntryRequestRef.current, null);
  runEffect('universeMissions');
  assert.equal(updates.setSelectedNarrativeGroupId, null);
  assert.equal(updates.setSelectedNarrativeArcId, null);
  assert.equal(updates.setBriefingStageId, null);
  assert.equal(updates.setMissionWorkspaceView, 'missions');

  // The Directive shortcut changes category and selects a mission in one event.
  // Its queued intent must survive the reset effect that follows that event.
  const directiveStart = hub.indexOf('const openMissionDirective = ') + 'const openMissionDirective = '.length;
  const directiveEnd = hub.indexOf('\n  };', directiveStart) + '\n  }'.length;
  const routeSetters = ['setActiveTab', 'setMissionScreen', 'setMissionWorkspaceView', 'setBriefingStageId', 'setSelectedNarrativeArcId', 'setSelectedNarrativeGroupId'];
  const openDirective = new Function('nextUnclearedStage', 'missionScreen', 'recommendedMissionScreen', 'missionEntryRequestRef', 'sound', ...routeSetters, `return (${hub.slice(directiveStart, directiveEnd)});`)(
    { id: 42, universeArc: { id: 'halo-arc' } }, 'universeMissions', 'universeArcs', missionEntryRequestRef, { playSfx() {} },
    ...routeSetters.map(name => value => { updates[name] = value; })
  );
  openDirective();
  runEffect('universeArcs');
  assert.equal(updates.setActiveTab, 'missions');
  assert.equal(updates.setMissionScreen, 'universeArcs');
  assert.equal(updates.setSelectedNarrativeArcId, 'halo-arc');
  assert.equal(updates.setBriefingStageId, 42);
  assert.equal(updates.setMissionWorkspaceView, 'map');
});

const callbackStart = hub.indexOf('const finishExtinctionSession = useCallback(') + 'const finishExtinctionSession = useCallback('.length;
const callbackEnd = hub.indexOf('\n  }, [activityProgress.extinctionCareer?.receipts', callbackStart) + '\n  }'.length;
const callbackSource = hub.slice(callbackStart, callbackEnd);
assert.ok(callbackSource.startsWith('(report = {}) => {') && callbackSource.endsWith('}'));

test('real Hub callback credits wallets once and keeps results until acknowledgement', () => {
  let gold = 300, shards = 80, progress = { extinctionCareer: { receipts: [] } };
  const exits = [];
  const finish = new Function('normalizeExtinctionReport', 'applyExtinctionReport', 'extinctionReceiptsRef', 'activityProgress', 'setGold', 'setBreachShards', 'setActivityProgress', 'finishDedicatedGame', `return (${callbackSource});`)(
    normalizeExtinctionReport, applyExtinctionReport, { current: new Set() }, progress,
    update => { gold = update(gold); }, update => { shards = update(shards); },
    update => { progress = update(progress); }, mode => exits.push(mode)
  );
  finish(result());
  finish(result());
  assert.equal(gold, 472);
  assert.equal(shards, 125);
  assert.equal(progress.extinctionCareer.xp, 210);
  assert.deepEqual(exits, []);
  finish({ reason: 'acknowledged' });
  assert.deepEqual(exits, ['extinction']);
  finish(result({ runId: 'extinction-defeat', result: 'defeat', rewards: { gold: 22, shards: 9, modeXp: 51, title: 'Repli' } }));
  assert.equal(gold, 494);
  assert.equal(shards, 134);
  assert.equal(progress.extinctionCareer.wins, 1);
  assert.equal(progress.extinctionCareer.runs, 2);
});

test('gear comparison includes both gained stats and bonuses lost by replacing the slot', () => {
  assert.deepEqual(compareGearBoosts({ boost: { atk: 10, spd: 2 } }, { boost: { hp: 45, atk: 7 } }), [
    { stat: 'atk', before: 7, after: 10, delta: 3 },
    { stat: 'spd', before: 0, after: 2, delta: 2 },
    { stat: 'hp', before: 45, after: 0, delta: -45 }
  ]);
});
