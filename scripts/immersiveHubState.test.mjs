import { createSceneInputs } from '../src/game/sceneInputs.js';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRaceKeyboardState, createRaceRunGuard } from '../src/game/raceSessionControls.js';
import { advanceMosaicPlayer } from '../src/game/mosaicCityRuntime.js';
import { applyExtinctionReport, compareGearBoosts, getSceneCanvasSize, getSceneHudLayout, getSceneHudRect, normalizeExtinctionReport, normalizeHubNavigation, restoreMosaicLocation, snapshotMosaicLocation } from '../src/game/immersiveHubState.js';
import { applyDisplayPreferences, DISPLAY_PREFERENCES_EVENT, readSceneHudPreferences } from '../src/game/displayPreferences.js';
import { placeMosaicMissionObjectLabel } from '../src/game/mosaicMissionOperations.js';

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

test('measured HUD bounds project through the actual canvas offset and backing size in every format', () => {
  for (const [width, height] of [[390, 844], [844, 390], [1365, 900]]) {
    const canvasRect = { left: 17, top: 59, width, height }, size = getSceneCanvasSize(width, height, 540);
    for (const titleHeight of [99, 173]) {
      const overlay = { left: 49, top: 143, width: Math.min(320, width - 64), height: titleHeight };
      const before = structuredClone({ canvasRect, overlay, size });
      const projected = getSceneHudRect(canvasRect, overlay, size);
      assert.ok(Math.abs(projected.x * width / size.width - 32) < 1e-9);
      assert.ok(Math.abs(projected.y * height / size.height - 84) < 1e-9);
      assert.ok(Math.abs(projected.width * width / size.width - overlay.width) < 1e-9);
      assert.ok(Math.abs(projected.height * height / size.height - titleHeight) < 1e-9,
        'the measured title height must not be replaced by a fixed language-dependent height');
      assert.deepEqual({ canvasRect, overlay, size }, before);
    }
  }
  const canvasRect = { left: 20, top: 50, width: 400, height: 300 }, size = { width: 800, height: 600 };
  assert.deepEqual(getSceneHudRect(canvasRect, { left: 10, top: 40, width: 80, height: 70 }, size),
    { x: 0, y: 0, width: 140, height: 120 });
  for (const overlay of [null, { left: 500, top: 50, width: 80, height: 70 },
    { left: 20, top: 50, width: 0, height: 20 }, { left: NaN, top: 50, width: 80, height: 70 }]) {
    assert.equal(getSceneHudRect(canvasRect, overlay, size), null);
  }
  assert.equal(getSceneHudRect(canvasRect, canvasRect, { width: 800, height: 0 }), null);
});

test('the production viewport hook measures committed title text and preference changes before painting, then disconnects', () => {
  // Run the actual hook with controlled lifecycle/DOM services. Native CI checks
  // the painted cartouches against independently measured browser rectangles.
  const source = readFileSync(new URL('../src/components/useSceneViewport.js', import.meta.url), 'utf8');
  const declaration = source.slice(source.indexOf('export default function')).replace('export default ', '');
  const fixture = (withOverlay = true, enabled = true, initial = {}) => {
    let pendingEffect, dependencies, cleanup, observer, styleObserver, canvasMeasurements = 0;
    let canvasBounds = initial.canvas || { left: 0, top: 0, width: 844, height: 390 };
    let overlayBounds = initial.overlay || { left: 12, top: 64, width: 320, height: 99 };
    const listeners = new Map(), observed = [], layout = { current: null };
    const canvas = { getBoundingClientRect: () => { canvasMeasurements++; return canvasBounds; } };
    const overlay = { getBoundingClientRect: () => overlayBounds };
    const properties = new Map([['--game-safe-area', `${initial.safeArea ?? 12}px`],
      ['--game-hud-scale', String(initial.hudScale ?? 1)]]), mutations = [];
    const root = { dataset: {}, style: { getPropertyValue: name => properties.get(name) || '',
      setProperty(name, value) {
        properties.set(name, value);
        if (name === '--game-safe-area') overlayBounds = { ...overlayBounds,
          left: Number.parseFloat(value), top: 52 + Number.parseFloat(value) };
        mutations.push({ type: 'attributes', target: root, attributeName: 'style' });
      } } };
    const createHook = new Function('env', `const { useRef, useEffect, useLayoutEffect, ResizeObserver, MutationObserver, window, document,
      getComputedStyle, readSceneHudPreferences, DISPLAY_PREFERENCES_EVENT, getSceneCanvasSize,
      getSceneHudLayout, getSceneHudRect } = env; ${declaration}; return useSceneViewport;`);
    const scheduleEffect = phase => (callback, nextDependencies) => {
      if (!dependencies || nextDependencies.some((value, index) => !Object.is(value, dependencies[index]))) {
        pendingEffect = { phase, callback, dependencies: nextDependencies };
      }
    };
    const hook = createHook({ useRef: () => layout,
      useEffect: scheduleEffect('passive'), useLayoutEffect: scheduleEffect('layout'),
      ResizeObserver: class { constructor(callback) { this.callback = callback; observer = this; }
        observe(element) { observed.push(element); } disconnect() { this.disconnected = true; } },
      MutationObserver: class { constructor(callback) { this.callback = callback; styleObserver = this; }
        observe(element, options) { this.element = element; this.options = options; }
        disconnect() { this.disconnected = true; } },
      window: { addEventListener: (name, callback) => listeners.set(name, callback),
        removeEventListener: (name, callback) => { assert.equal(listeners.get(name), callback); listeners.delete(name); } },
      document: { documentElement: root }, getComputedStyle: () => root.style,
      readSceneHudPreferences, DISPLAY_PREFERENCES_EVENT,
      getSceneCanvasSize, getSceneHudLayout, getSceneHudRect });
    const canvasRef = { current: canvas }, overlayRef = withOverlay ? { current: overlay } : null;
    const flushEffect = phase => {
      if (pendingEffect?.phase !== phase) return;
      const effect = pendingEffect; pendingEffect = null;
      cleanup?.();
      dependencies = effect.dependencies;
      cleanup = effect.callback();
    };
    const commit = contentKey => {
      hook(canvasRef, 540, enabled, overlayRef, contentKey);
      flushEffect('layout');
    };
    commit(initial.contentKey || 'initial title');
    flushEffect('passive');
    return { layout, get cleanup() { return cleanup; }, get observer() { return observer; },
      get styleObserver() { return styleObserver; }, get canvasMeasurements() { return canvasMeasurements; },
      observed, listeners, canvas, overlay, root,
      commitTitle: (contentKey, height) => { overlayBounds = { ...overlayBounds, height }; commit(contentKey); },
      flushMutations: () => { const records = mutations.splice(0);
        if (records.length && styleObserver?.element && !styleObserver.disconnected) styleObserver.callback(records); },
      wrapTitle: () => { overlayBounds = { ...overlayBounds, height: 173 }; observer.callback(); },
      hideCanvas: () => { canvasBounds = { ...canvasBounds, width: 0 }; observer.callback(); } };
  };
  const city = fixture();
  assert.deepEqual(city.observed, [city.canvas, city.overlay]);
  assert.ok(Math.abs(city.layout.current.occlusionRect.height - 99 * 540 / 390) < 1e-9);
  // Native fixture order: mount at the default margin, then write root CSS.
  // The title moves (+20,+20) without resizing or dispatching a preference event.
  city.root.style.setProperty('--game-hud-scale', '1.4');
  city.root.style.setProperty('--game-safe-area', '32px');
  city.flushMutations();
  assert.ok(Math.abs(city.layout.current.occlusionRect.x - 32 * city.canvas.width / 844) < 1e-9,
    'the first draw after a root style mutation must use the new horizontal position');
  assert.ok(Math.abs(city.layout.current.occlusionRect.y - 84 * 540 / 390) < 1e-9);
  assert.equal(city.styleObserver.element, city.root);
  assert.deepEqual(city.styleObserver.options, { attributes: true, attributeFilter: ['style', 'class'] });
  // A storage listener can run before GameDisplayPreferencesSync applies CSS.
  city.listeners.get('storage')();
  applyDisplayPreferences({ safeArea: 12 }, city.root);
  city.flushMutations();
  assert.ok(Math.abs(city.layout.current.occlusionRect.x - 12 * city.canvas.width / 844) < 1e-9);
  assert.ok(Math.abs(city.layout.current.occlusionRect.y - 64 * 540 / 390) < 1e-9);
  city.wrapTitle();
  assert.ok(Math.abs(city.layout.current.occlusionRect.height - 173 * 540 / 390) < 1e-9);
  applyDisplayPreferences({ safeArea: 32 }, city.root);
  city.listeners.get(DISPLAY_PREFERENCES_EVENT)();
  assert.ok(Math.abs(city.layout.current.occlusionRect.x - 32 * city.canvas.width / 844) < 1e-9);
  city.hideCanvas();
  assert.equal(city.layout.current, null, 'a hidden canvas cannot retain stale occlusion geometry');
  city.cleanup();
  assert.equal(city.observer.disconnected, true);
  assert.equal(city.styleObserver.disconnected, true);
  assert.equal(city.listeners.size, 0);
  city.root.style.setProperty('--game-safe-area', '12px'); city.flushMutations();
  assert.equal(city.layout.current, null);

  // Native 5451123 Nexus EN portrait frames 2790 -> 2791: leaving the Mission
  // Beacon changes only the committed zone text, growing its DOM title 83 -> 97.
  // The scene can call loop() synchronously in a passive effect before any
  // ResizeObserver notification. Its simulation time/player/camera are unchanged.
  const titleKey = zone => JSON.stringify(['MOSAIC CITY', 'Nexus de Convergence District', zone]);
  const portrait = fixture(true, true, {
    canvas: { left: 0, top: 0, width: 390, height: 844 },
    overlay: { left: 32, top: 88, width: 202.453125, height: 83 },
    contentKey: titleKey('Mission Beacon'), safeArea: 32, hudScale: 1.4
  });
  const frame = { t: 324.2399999999992, player: { x: 1311.1859234283456, y: 709.183402377607 },
    camera: { x: 1171.3171225403116, y: 447.9346906263877 } };
  const beforeFrame = structuredClone(frame);
  const world = rect => ({ ...rect, x: rect.x + frame.camera.x, y: rect.y + frame.camera.y });
  const playerRects = [
    { x: 100.8687744140625, y: 215.9375, width: 78, height: 78 },
    { x: 132.64710506897063, y: 213.62498003125336, width: 15.2216796875, height: 9 },
    { x: 121.86878475647063, y: 282.24870999479447, width: 36, height: 7 }
  ].map(world);
  const paint = () => {
    const rect = placeMosaicMissionObjectLabel({ anchor: { x: 1380, y: 660 }, width: 188, height: 57,
      viewport: { ...frame.camera, width: 250, height: 540 },
      protectedRects: [...playerRects, world(portrait.layout.current.occlusionRect)] });
    assert.ok(rect);
    // The native Canvas matrix stores these camera translations at float32 precision.
    return { ...rect, x: rect.x - Math.fround(frame.camera.x), y: rect.y - Math.fround(frame.camera.y) };
  };
  assert.ok(Math.abs(paint().y - 117.40758118196379) < 1e-9, 'reproduce the pre-commit cartouche');
  const previousObserver = portrait.observer, previousStyleObserver = portrait.styleObserver;
  portrait.commitTitle(titleKey('Nexus de Convergence District'), 97);
  const afterCommit = paint(), actualHudBottom = (88 + 97) * 540 / 844;
  assert.ok(afterCommit.y >= actualHudBottom,
    'the first synchronous scene draw after a text commit must clear the new title before ResizeObserver');
  assert.ok(Math.abs(afterCommit.y - 126.36492715352777) < 1e-9);
  assert.deepEqual(frame, beforeFrame, 'presentation refresh does not advance or reposition the scene');
  assert.equal(previousObserver.disconnected, true);
  assert.equal(previousStyleObserver.disconnected, true);
  const measurements = portrait.canvasMeasurements;
  portrait.commitTitle(titleKey('Nexus de Convergence District'), 97);
  assert.equal(portrait.canvasMeasurements, measurements, 'unchanged title text needs no extra DOM measurement');
  portrait.cleanup();
  assert.equal(portrait.observer.disconnected, true);
  assert.equal(portrait.styleObserver.disconnected, true);
  assert.equal(portrait.listeners.size, 0);
  assert.equal(portrait.layout.current, null);

  const otherScene = fixture(false);
  assert.deepEqual(otherScene.observed, [otherScene.canvas]);
  assert.equal(otherScene.styleObserver, undefined, 'scenes without the DOM overlay do not observe root mutations');
  assert.equal(otherScene.layout.current.occlusionRect, null);
  assert.ok(otherScene.layout.current.fpsRadar);
  otherScene.cleanup();
  assert.equal(otherScene.layout.current, null);
  const disabled = fixture(true, false);
  assert.equal(disabled.layout.current, null);
  assert.equal(disabled.observed.length, 0);
  assert.equal(disabled.styleObserver, undefined);
  assert.equal(disabled.cleanup, undefined);
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
  const keyboardStateRef = { current: createRaceKeyboardState() };
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
  const raceKey = new Function('runGuard', 'sessionPausedRef', 'document', 'engine', 'CONTROL_KEYS', 'normalizeKey', 'keysRef', 'keyboardStateRef', `return (${readHandler(race)});`)(createRaceRunGuard(), pause, { hidden: false }, engine, controls, normalizeKey, keysRef, keyboardStateRef);
  const raceKeyUp = new Function('sessionPausedRef', 'engine', 'CONTROL_KEYS', 'normalizeKey', 'keysRef', 'keyboardStateRef', `return (${readHandler(race, 'const onKeyUp = ')});`)(pause, engine, controls, normalizeKey, keysRef, keyboardStateRef);
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
  assert.equal(Boolean(keysRef.current.w), false);
  const beforeTyping = prevents;
  for (const tag of ['INPUT', 'SELECT', 'TEXTAREA']) raceKey(event('w', tag));
  raceKey(event('w', 'DIV', true));
  assert.equal(prevents, beforeTyping);
  assert.equal(Boolean(keysRef.current.w), false);
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

