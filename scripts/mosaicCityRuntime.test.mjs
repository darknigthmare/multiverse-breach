import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import {
  advanceMosaicGuide, advanceMosaicPlayer, clampMosaicPosition, createMosaicGuide,
  findMosaicWalkablePosition, getMosaicDestinationView, getMosaicDrawDepth, getMosaicGuideStep, getMosaicInteractionTargets,
  getMosaicScenery, getMosaicSceneObstacles, getMosaicUniverseCatalog, getMosaicZoneAnchor, isMosaicPositionBlocked, isMosaicSegmentClear,
  MOSAIC_CITY_ART, MOSAIC_PERSON_FOOT_OFFSET, MOSAIC_WELCOME, planMosaicPath, resolveMosaicInteraction, transitionMosaicGuide
} from '../src/game/mosaicCityRuntime.js';
import { createPlayerHero } from '../src/game/playerHero.js';

const district = { worldW: 2000, worldH: 1000 };
const makeState = (keys = {}) => ({ player: { x: 100, y: 100, facing: 1, speed: 2.35 }, keys, npcs: [], destination: null });
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} ~= ${expected}`);
const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const city = hub.slice(hub.indexOf('function MosaicCityHub('), hub.indexOf('const EXTINCTION_BEACON_TARGET'));

test('walking speed is identical at 30, 60, 120 and 144 Hz', () => {
  for (const hz of [30, 60, 120, 144]) {
    const state = makeState({ arrowright: true });
    for (let frame = 0; frame < hz; frame++) advanceMosaicPlayer(state, district, 1000 / hz);
    near(state.player.x, 241);
    near(state.player.y, 100);
    assert.equal(state.player.state, 'run');
  }
});

test('diagonal walking is normalized and AZERTY keys work', () => {
  const state = makeState({ q: true, z: true });
  advanceMosaicPlayer(state, district, 1000 / 60);
  near(Math.hypot(state.player.x - 100, state.player.y - 100), 2.35);
  assert.ok(state.player.x < 100 && state.player.y < 100);
  assert.equal(state.player.facing, -1);
});

test('vertical movement and blocked walking preserve horizontal facing', () => {
  const state = makeState({ arrowup: true });
  state.player.facing = -1;
  advanceMosaicPlayer(state, district);
  assert.equal(state.player.facing, -1);
  state.player.x = district.worldW - 34;
  state.keys = { arrowright: true };
  advanceMosaicPlayer(state, district);
  assert.equal(state.player.facing, -1);
  assert.equal(state.player.state, 'idle');
});

test('click destinations are clamped and never overshot', () => {
  assert.deepEqual(clampMosaicPosition({ x: -500, y: 8000 }, district), { x: 34, y: 950 });
  const state = makeState();
  state.destination = { x: 101, y: 100 };
  advanceMosaicPlayer(state, district, 50);
  near(state.player.x, 101);
  assert.equal(state.destination, null);
  state.destination = { x: -500, y: -500 };
  for (let frame = 0; frame < 200; frame++) advanceMosaicPlayer(state, district);
  near(state.player.x, 34);
  near(state.player.y, 58);
  assert.equal(state.destination, null);
});

test('collision substeps prevent tunneling through NPC bodies and allow escaping overlaps', () => {
  const state = makeState({ arrowright: true });
  state.player.speed = 20;
  state.npcs = [{ x: 140, y: 100 }];
  advanceMosaicPlayer(state, district, 50);
  assert.ok(state.player.x <= 112, `did not pass through NPC: ${state.player.x}`);
  state.player.x = 130;
  state.keys = { arrowleft: true };
  advanceMosaicPlayer(state, district);
  assert.ok(state.player.x < 130);
});

test('collision slides along an NPC instead of canceling the whole movement', () => {
  const state = makeState({ arrowright: true, arrowdown: true });
  state.npcs = [{ x: 127, y: 100 }];
  advanceMosaicPlayer(state, district);
  near(state.player.x, 100);
  assert.ok(state.player.y > 100);
});

test('solid scenery and terminal footprints align with the rendered ground; floor markings remain traversable', () => {
  const cityDistrict = { ...district, universe: 'Resident Evil', place: { type: 'city' } };
  const buildings = getMosaicScenery(cityDistrict);
  const obstacles = getMosaicSceneObstacles(cityDistrict, [{ id: 'memory', action: 'codex', x: 80, y: 80, w: 40, h: 40 }, { id: 'plaza', action: 'talk' }]);
  assert.equal(buildings.length, 9);
  assert.equal(obstacles.length, 10);
  buildings.forEach((building, index) => {
    assert.equal(obstacles[index].x, building.x);
    assert.equal(obstacles[index].w, building.w);
    assert.equal(obstacles[index].y + obstacles[index].h + MOSAIC_PERSON_FOOT_OFFSET, getMosaicDrawDepth(building));
  });
  assert.deepEqual(obstacles.at(-1), { id: 'terminal-memory', x: 78, y: 84, w: 44, h: 10 });
  for (const type of ['fog', 'gate', 'industrial', 'military', 'reactor']) {
    assert.deepEqual(getMosaicSceneObstacles({ ...cityDistrict, place: { type } }), []);
  }
  assert.deepEqual(getMosaicSceneObstacles(district), []);
});

test('scenery collision prevents fast tunneling, permits sliding and lets an existing overlap escape', () => {
  const state = makeState({ arrowright: true });
  state.obstacles = [{ x: 140, y: 80, w: 44, h: 36 }];
  state.player.speed = 20;
  advanceMosaicPlayer(state, district, 50);
  assert.ok(state.player.x <= 126);
  assert.equal(isMosaicPositionBlocked(state.player, state.obstacles), false);
  state.player.x = 125;
  state.keys = { arrowright: true, arrowdown: true };
  advanceMosaicPlayer(state, district, 1000 / 60);
  assert.ok(state.player.y > 100, 'blocked horizontal movement still slides vertically');
  state.player.x = 135;
  state.player.y = 100;
  state.keys = { arrowleft: true };
  advanceMosaicPlayer(state, district);
  assert.ok(state.player.x < 135, 'an existing footprint overlap can walk back out');
});

test('people are occluded behind raised scenery and drawn in front after passing its base', () => {
  const zone = { x: 80, y: 80, w: 40, h: 40 };
  const terminal = { type: 'terminal', zone };
  const behind = { y: 70 };
  const inFront = { y: 120 };
  const sorted = [inFront, terminal, behind].sort((a, b) => getMosaicDrawDepth(a) - getMosaicDrawDepth(b));
  assert.deepEqual(sorted, [behind, terminal, inFront]);
  const building = { type: 'building', y: 250, h: 250 };
  assert.ok(getMosaicDrawDepth({ y: 450 }) < getMosaicDrawDepth(building));
  assert.ok(getMosaicDrawDepth({ y: 520 }) > getMosaicDrawDepth(building));
  assert.match(city, /getMosaicDrawDepth\(a\) - getMosaicDrawDepth\(b\)/);
  assert.match(city, /isMosaicPositionBlocked\(npc, sceneObstacles\)/);
});

test('a walking NPC cannot cut through a terminal corner when resuming its routine after a collision', () => {
  const cityDistrict = { ...district, universe: 'Resident Evil', place: { type: 'city' } };
  const zone = { id: 'breach', action: 'mission', x: 1245, y: 710, w: 430, h: 205 };
  const obstacles = getMosaicSceneObstacles(cityDistrict, [zone]);
  const previous = { x: 1496.3319504673655, y: 786.882143261712 };
  const next = { x: 1479.1064833089995, y: 782.4411013791156 };
  assert.equal(isMosaicPositionBlocked(previous, obstacles), false);
  assert.equal(isMosaicPositionBlocked(next, obstacles), false);
  assert.equal(isMosaicSegmentClear(previous, next, obstacles), false, 'free endpoints can still cross the solid corner');
  assert.equal(isMosaicSegmentClear(previous, { x: previous.x + 1, y: previous.y }, obstacles), true);
  const source = city.slice(city.indexOf('      state.npcs.forEach(npc => {'), city.indexOf('      const nearest = state.npcs'));
  const npc = { ...previous, baseX: 1525, baseY: 765, phase: 6 * 0.73, routine: 'walk' };
  const state = { t: 1375, player: { x: 820, y: 760 }, npcs: [npc] };
  new Function('state', 'district', 'sceneObstacles', 'clampMosaicPosition', 'isMosaicPositionBlocked', 'isMosaicSegmentClear', source)(state, cityDistrict, obstacles, clampMosaicPosition, isMosaicPositionBlocked, isMosaicSegmentClear);
  assert.equal(npc.x, previous.x);
  assert.equal(npc.y, previous.y);
  assert.equal(npc.sceneState, 'idle');
});

test('tap movement walks around a solid obstacle without cutting its corners', () => {
  const state = makeState();
  state.player.y = 120;
  state.obstacles = [{ x: 180, y: 70, w: 40, h: 100 }];
  state.destination = { x: 300, y: 120 };
  const route = planMosaicPath(state.player, state.destination, district, state.obstacles);
  assert.ok(route.length >= 3, 'a wall between start and destination requires a detour');
  let traveled = 0;
  for (let frame = 0; frame < 500 && state.destination; frame++) {
    traveled += advanceMosaicPlayer(state, district);
    assert.equal(isMosaicPositionBlocked(state.player, state.obstacles), false);
  }
  assert.equal(state.destination, null);
  assert.ok(Math.hypot(state.player.x - 300, state.player.y - 120) <= 0.5);
  assert.ok(traveled > 200, 'the player follows the detour instead of teleporting through the wall');
});

test('tap on a solid terminal reaches a walkable interaction point', () => {
  const zone = { id: 'codex', action: 'codex', x: 80, y: 80, w: 40, h: 40 };
  const state = makeState();
  state.player.x = 50;
  state.obstacles = getMosaicSceneObstacles(district, [zone]);
  state.destination = getMosaicZoneAnchor(zone);
  state.pendingInteraction = { type: 'zone', id: zone.id };
  const safe = findMosaicWalkablePosition(state.destination, district, state.obstacles);
  assert.equal(isMosaicPositionBlocked(safe, state.obstacles), false);
  for (let frame = 0; frame < 200 && state.destination; frame++) {
    advanceMosaicPlayer(state, district);
    assert.equal(isMosaicPositionBlocked(state.player, state.obstacles), false);
  }
  assert.equal(resolveMosaicInteraction(state.player, { zones: [zone] }, state.pendingInteraction)?.id, 'codex');
});

test('unreachable click destinations stop safely and clear the pending action', () => {
  const boundedDistrict = { worldW: 600, worldH: 600 };
  const state = makeState();
  state.obstacles = [{ x: 200, y: 0, w: 40, h: 600 }];
  state.destination = { x: 300, y: 100 };
  state.pendingInteraction = { type: 'portal', id: 'behind-wall' };
  assert.deepEqual(planMosaicPath(state.player, state.destination, boundedDistrict, state.obstacles), []);
  assert.equal(advanceMosaicPlayer(state, boundedDistrict), 0);
  assert.equal(state.destination, null);
  assert.equal(state.pendingInteraction, null);
  assert.equal(state.player.x, 100);
});

test('clock restart frames preserve click movement; manual input cancels its route', () => {
  const state = makeState();
  state.destination = { x: 300, y: 100 };
  state.pendingInteraction = { type: 'portal', id: 'next' };
  advanceMosaicPlayer(state, district, 0);
  assert.deepEqual(state.destination, { x: 300, y: 100 });
  assert.equal(state.player.x, 100);
  advanceMosaicPlayer(state, district);
  assert.ok(state.player.x > 100);
  state.keys = { arrowdown: true };
  advanceMosaicPlayer(state, district);
  assert.equal(state.destination, null);
  assert.equal(state.destinationRoute, null);
  assert.equal(state.pendingInteraction, null);
  assert.ok(state.player.y > 100);
});

test('idle and delayed frames cannot invent movement or huge catch-up travel', () => {
  const idle = makeState();
  assert.equal(advanceMosaicPlayer(idle, district, 5000), 0);
  assert.equal(idle.player.state, 'idle');
  const walking = makeState({ d: true });
  near(advanceMosaicPlayer(walking, district, 5000), 7.05);
});

const scene = {
  portals: [{ id: 'next', x: 900, y: 900 }],
  npcs: [{ hero: { id: 'guide' }, x: 100, y: 150 }],
  zones: [{ id: 'missions', action: 'mission', x: 400, y: 200, w: 800, h: 400 }]
};

test('interactions require actual proximity; a whole room is not an interaction radius', () => {
  assert.equal(resolveMosaicInteraction({ x: 100, y: 100 }, scene)?.id, 'guide');
  assert.equal(resolveMosaicInteraction({ x: 420, y: 210 }, scene), null);
  assert.deepEqual(getMosaicZoneAnchor(scene.zones[0]), { x: 800, y: 400 });
  assert.equal(resolveMosaicInteraction({ x: 800, y: 450 }, scene)?.id, 'missions');
  assert.equal(resolveMosaicInteraction({ x: 900, y: 830 }, scene)?.id, 'next');
  assert.equal(resolveMosaicInteraction({ x: 900, y: 825 }, scene), null);
});

test('clicking a distant target never substitutes a nearer unrelated interaction', () => {
  assert.equal(resolveMosaicInteraction({ x: 100, y: 100 }, scene, { type: 'portal', id: 'next' }), null);
  assert.equal(resolveMosaicInteraction({ x: 100, y: 100 }, scene, { type: 'npc', id: 'guide' })?.id, 'guide');
  const crowded = { ...scene, zones: [{ id: 'mission', action: 'mission', x: 60, y: 90, w: 100, h: 100 }] };
  assert.equal(resolveMosaicInteraction({ x: 100, y: 100 }, crowded, { type: 'zone', id: 'mission' })?.id, 'mission');
});

test('passive talk scenery is not exposed as a conflicting terminal', () => {
  const targets = getMosaicInteractionTargets({ zones: [{ id: 'rest', action: 'talk' }, { id: 'floor' }] });
  assert.deepEqual(targets, []);
});

test('the Archives Codex terminal opens the actual global archive only after approach', () => {
  const zonesSource = city.slice(city.indexOf("if (currentDistrict === 'archives')"), city.indexOf("if (currentDistrict === 'forge')"));
  const zones = new Function('currentDistrict', 'lang', `${zonesSource}; return [];`)('archives', 'fr');
  const zone = zones.find(entry => entry.id === 'codex');
  assert.equal(zone.action, 'codex');
  assert.equal(zone.universe, null, 'the global archive does not request an invented A.R.C.A. universe');
  const stateRef = { current: makeState() };
  const opened = [];
  const source = city.slice(city.indexOf('const interactWithNearby ='), city.indexOf('  useEffect(() => {\n    const onKeyDown'));
  const args = {
    useCallback: callback => callback, sessionPausedRef: { current: false }, stateRef,
    resolveMosaicInteraction, district: { portals: [] }, zones, lang: 'fr',
    setHubLog: () => {}, recordGuide: () => {}, switchDistrict: () => {},
    onOpenCodex: universe => opened.push(universe), onOpenMissions: () => assert.fail('Codex cannot open missions'),
    playerName: 'Ancre', universeStageStats: {}, sound: { playSfx: () => {} }, setSelectedHeroId: () => {},
    setWelcomeIndex: () => {}, setWelcomeOpen: () => {}, MOSAIC_WELCOME
  };
  const interact = new Function(...Object.keys(args), `${source}; return interactWithNearby;`)(...Object.values(args));
  interact({ type: 'zone', id: zone.id });
  assert.deepEqual(opened, []);
  Object.assign(stateRef.current.player, getMosaicZoneAnchor(zone));
  interact({ type: 'zone', id: zone.id });
  assert.deepEqual(opened, [null]);
});

test('onboarding advances through walking, interaction and freely selected objective', () => {
  let guide = createMosaicGuide();
  assert.equal(getMosaicGuideStep(guide), 'move');
  assert.equal(advanceMosaicGuide(guide, 'objective'), guide);
  guide = advanceMosaicGuide(guide, 'move', 69);
  assert.equal(getMosaicGuideStep(guide), 'move');
  guide = advanceMosaicGuide(guide, 'move', 1);
  assert.equal(getMosaicGuideStep(guide), 'interact');
  guide = advanceMosaicGuide(guide, 'interact');
  assert.equal(getMosaicGuideStep(guide), 'objective');
  guide = advanceMosaicGuide(guide, 'objective');
  assert.equal(getMosaicGuideStep(guide), 'done');
  assert.equal(Object.hasOwn(guide, 'missionId'), false);
});

test('walking to the Atrium guide reaches stage two before automatic conversation', () => {
  const state = makeState();
  state.player.x = 780;
  state.player.y = 520;
  state.npcs = [{ hero: { id: 'arca_mirelle' }, x: 910, y: 520 }];
  state.destination = { x: 910, y: 520 };
  let guide = createMosaicGuide();
  for (let frame = 0; frame < 100 && !resolveMosaicInteraction(state.player, state); frame++) {
    guide = advanceMosaicGuide(guide, 'move', advanceMosaicPlayer(state, district));
  }
  assert.equal(getMosaicGuideStep(guide), 'interact');
  assert.equal(resolveMosaicInteraction(state.player, state)?.id, 'arca_mirelle');
});

test('Nexus banner and anchor sprite refer to existing project bitmaps', () => {
  assert.ok(existsSync(new URL(`../public${MOSAIC_CITY_ART}`, import.meta.url)));
  const hero = createPlayerHero({ name: 'Test Anchor' });
  const manifest = JSON.parse(readFileSync(new URL('../public/sprites/generated/sprite-manifest.json', import.meta.url), 'utf8'));
  const entries = Array.isArray(manifest) ? manifest : manifest.entries;
  const anchor = entries.find(entry => entry.kind === 'hero' && entry.id === hero.id);
  assert.equal(anchor.universe, hero.universe);
  assert.equal(anchor.output, '/sprites/generated/heroes/nexus-de-convergence/player-anchor.png');
  assert.ok(existsSync(new URL(`../public${anchor.output}`, import.meta.url)));
  assert.ok(anchor.frame.rows.includes('idle') && anchor.frame.rows.includes('run'));
  assert.match(hub, /className="mosaic-city-entry"[\s\S]*?<img src=\{MOSAIC_CITY_ART\}/);
  assert.match(city, /hero: playerAvatar, isPlayer: true/);
});

test('city controls retain proximity validation, focus loss cleanup and cancellable touch controls', () => {
  assert.match(city, /resolveMosaicInteraction\(stateRef\.current\.player, scene, preferred\)/);
  assert.match(city, /pendingInteraction = preferred/);
  assert.match(city, /sessionPausedRef\.current \|\| document\.hidden/);
  assert.match(city, /onClockVisibilityChange = \(\) => \{ lastFrame = null;/);
  assert.match(city, /addEventListener\('blur', clearInput\)/);
  assert.match(city, /onLostPointerCapture=/);
  assert.match(city, /aria-describedby="mosaic-city-controls-help"/);
  assert.match(city, /interactWithNearby\(\{ type: 'zone', id: nearZoneData\.id \}\)/);
  const pointerHandler = city.slice(city.indexOf('const moveToPointer'), city.indexOf('const setVirtualKey'));
  assert.doesNotMatch(pointerHandler, /switchDistrict\(/);
});

test('leaving a universe room preserves context without starting an arbitrary mission', () => {
  const invocation = hub.slice(hub.lastIndexOf('<MosaicCityHub'), hub.lastIndexOf('<ExtinctionRoyale'));
  assert.match(invocation, /setSelectedNarrativeGroupId\(universe \? `universe-\$\{universe\}` : null\)/);
  assert.match(invocation, /openUniverseArchive\(universe\)/);
  assert.doesNotMatch(invocation, /onStartBattle|launchMission|startBattle/);
});

test('all 525 owned authorized universe destinations remain indexed beyond former hero and room limits', () => {
  const heroes = Array.from({ length: 525 }, (_, index) => ({ id: `owned-${index}`, universe: `Univers ${String(index).padStart(3, '0')}` }));
  const catalog = getMosaicUniverseCatalog(heroes, heroes.map(hero => hero.id));
  assert.equal(catalog.length, 525);
  assert.ok(catalog.includes('Univers 524'));
  const visited = [];
  const first = getMosaicDestinationView(catalog);
  for (let page = 0; page < first.pageCount; page++) {
    const view = getMosaicDestinationView(catalog, { page });
    assert.ok(view.items.length <= 9);
    visited.push(...view.items);
  }
  assert.deepEqual(visited, catalog);
  assert.match(city, /Object\.fromEntries\(unlockedUniverses\.map\(universe/);
  assert.doesNotMatch(city, /ownedHeroes[^\n]*slice\(0, 24\)|unlockedUniverses[^\n]*slice\(0, (?:10|18)\)/);
});

test('destination authorization never opens unowned or filtered worlds through a fallback list', () => {
  const catalog = getMosaicUniverseCatalog([
    { id: 'owned', universe: 'Available' },
    { id: 'duplicate', universe: 'Available' },
    { id: 'locked', universe: 'Locked' },
    null,
    { id: 'malformed', universe: null }
  ], ['owned', 'duplicate', 'filtered-out', 'malformed']);
  assert.deepEqual(catalog, ['Available']);
  assert.deepEqual(getMosaicUniverseCatalog([], ['filtered-out']), []);
  assert.deepEqual(getMosaicUniverseCatalog([{ id: 'locked', universe: 'Halo' }], []), []);
  assert.match(city, /getMosaicUniverseCatalog\(safeHeroes, unlockedHeroes\)/);
});

test('destination search is accent-insensitive, includes late entries and clamps filtered page indices', () => {
  const catalog = ['A.R.C.A.', 'Quartier Étoilé', 'Trame finale'];
  const view = getMosaicDestinationView(catalog, { query: '  etoile  ', page: 500 });
  assert.deepEqual(view.items, ['Quartier Étoilé']);
  assert.equal(view.page, 0);
  assert.equal(view.total, 3);
  assert.equal(view.matching, 1);
  assert.deepEqual(getMosaicDestinationView(catalog, { query: 'finale' }).items, ['Trame finale']);
  const empty = getMosaicDestinationView(catalog, { query: 'not available', page: -20 });
  assert.equal(empty.page, 0);
  assert.equal(empty.pageCount, 1);
  assert.deepEqual(empty.items, []);
});

test('tutorial pause persists and resumes the actual partial walking checkpoint', () => {
  let guide = advanceMosaicGuide(createMosaicGuide(), 'move', 36);
  guide = transitionMosaicGuide(guide, 'pause');
  const saved = JSON.parse(JSON.stringify(guide));
  guide = createMosaicGuide(saved);
  assert.equal(guide.status, 'paused');
  assert.equal(guide.distance, 36);
  assert.equal(advanceMosaicGuide(guide, 'move', 100), guide);
  assert.equal(advanceMosaicGuide(guide, 'interact'), guide);
  guide = transitionMosaicGuide(guide, 'resume');
  guide = advanceMosaicGuide(guide, 'move', 34);
  assert.equal(getMosaicGuideStep(guide), 'interact');
});

test('skipping is not completing; replay resets only city checkpoints and grants no gameplay rewards', () => {
  let guide = advanceMosaicGuide(createMosaicGuide(), 'move', 70);
  guide = advanceMosaicGuide(guide, 'interact');
  guide = transitionMosaicGuide(guide, 'skip');
  assert.equal(guide.status, 'skipped');
  assert.equal(guide.objectiveOpened, false);
  assert.equal(advanceMosaicGuide(guide, 'objective'), guide);
  guide = createMosaicGuide(JSON.parse(JSON.stringify(guide)));
  assert.equal(guide.status, 'skipped');
  assert.equal(getMosaicGuideStep(guide), 'objective');
  guide = transitionMosaicGuide(guide, 'restart');
  assert.equal(guide.status, 'active');
  assert.equal(getMosaicGuideStep(guide), 'move');
  for (const forbidden of ['gold', 'reward', 'activeTeam', 'equippedGear', 'combatCompleted', 'equipmentCompleted']) assert.equal(Object.hasOwn(guide, forbidden), false);
});

test('welcome replay or reading cannot validate movement, interactions, equipment or combat', () => {
  const welcomeRead = transitionMosaicGuide(createMosaicGuide(), 'welcome-read');
  assert.equal(welcomeRead.welcomeSeen, true);
  assert.equal(getMosaicGuideStep(welcomeRead), 'move');
  assert.equal(welcomeRead.distance, 0);
  assert.equal(welcomeRead.interacted, false);
  assert.equal(welcomeRead.objectiveOpened, false);
  assert.equal(transitionMosaicGuide(welcomeRead, 'restart').welcomeSeen, true);
  assert.equal(MOSAIC_WELCOME.title.fr, 'Une ville qui se souvient');
  assert.equal(MOSAIC_WELCOME.lines.fr.length, 3);
  assert.match(MOSAIC_WELCOME.lines.fr.join(' '), /Mirelle.*Nexus.*A\.R\.C\.A\./);
});

test('tutorial normalization rejects impossible order and unrelated completion flags', () => {
  const guide = createMosaicGuide({ distance: NaN, moved: false, interacted: true, objectiveOpened: true, combatCompleted: true, equipmentCompleted: true, status: 'completed' });
  assert.equal(getMosaicGuideStep(guide), 'move');
  assert.equal(guide.status, 'active');
  assert.equal(Object.hasOwn(guide, 'combatCompleted'), false);
  assert.equal(Object.hasOwn(guide, 'equipmentCompleted'), false);
  assert.deepEqual(createMosaicGuide(null), createMosaicGuide());
  assert.deepEqual(createMosaicGuide('completed'), createMosaicGuide());
});

test('actual recording callback persists real movement checkpoints and stops when guide is paused', () => {
  const source = city.slice(city.indexOf('const recordGuide ='), city.indexOf('const controlGuide ='));
  const guideRef = { current: createMosaicGuide() };
  const saved = [];
  const commitGuide = guide => { guideRef.current = createMosaicGuide(guide); saved.push(guideRef.current); };
  const record = new Function('useCallback', 'guideRef', 'advanceMosaicGuide', 'getMosaicGuideStep', 'commitGuide', `${source}; return recordGuide;`)(callback => callback, guideRef, advanceMosaicGuide, getMosaicGuideStep, commitGuide);
  record('move', 0);
  record('interact');
  assert.equal(saved.length, 0, 'neither idle frames nor premature clicks mark a checkpoint');
  record('move', 10);
  assert.equal(saved.length, 0);
  record('move', 5);
  assert.equal(saved.length, 0, 'partial walking stays in a ref until a milestone or explicit flush');
  assert.equal(guideRef.current.distance, 15);
  guideRef.current = transitionMosaicGuide(guideRef.current, 'pause');
  record('move', 200);
  record('objective');
  assert.equal(saved.length, 0);
  guideRef.current = transitionMosaicGuide(guideRef.current, 'resume');
  record('move', 55);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].distance, 70);
});

test('actual catalog button only queues walking to an authorized visible portal', () => {
  const source = city.slice(city.indexOf('const approachDistrictPortal ='), city.indexOf('const welcomeLanguage ='));
  const stateRef = { current: makeState() };
  const portal = { id: 'to-last', universe: 'Last available world', x: 500, y: 300 };
  const gallery = { ...district, portals: [portal] };
  const approach = new Function('sessionPausedRef', 'currentDistrict', 'district', 'clearCityDestination', 'stateRef', 'clampMosaicPosition', 'setHubLog', 'lang', `${source}; return approachDistrictPortal;`)({ current: false }, 'threads', gallery, () => { stateRef.current.destination = null; stateRef.current.pendingInteraction = null; }, stateRef, clampMosaicPosition, () => {}, 'fr');
  approach('Locked world');
  assert.equal(stateRef.current.destination, null);
  approach(portal.universe);
  assert.deepEqual(stateRef.current.destination, { x: 500, y: 300 });
  assert.deepEqual(stateRef.current.pendingInteraction, { type: 'portal', id: 'to-last' });
  assert.equal(stateRef.current.player.x, 100, 'catalog selection never teleports');
  assert.equal(stateRef.current.player.y, 100);
  assert.doesNotMatch(source, /recordGuide|switchDistrict|setActiveTeam|setEquippedGear/);
});

test('city persists only its tutorial field and exposes pause, resume, skip, restart and welcome replay', () => {
  const invocation = hub.slice(hub.lastIndexOf('<MosaicCityHub'), hub.lastIndexOf('<ExtinctionRoyale'));
  assert.match(invocation, /tutorialProgress=\{activityProgress\.mosaicTutorial\}/);
  assert.match(invocation, /\.\.\.previous, mosaicTutorial/);
  assert.doesNotMatch(invocation, /setGold|setActiveTeam|setEquippedGear|setInventory/);
  for (const command of ['pause', 'resume', 'skip', 'restart', 'welcome-read']) assert.ok(city.includes(`controlGuide('${command}')`), command);
  assert.match(city, /guideProgressCallbackRef\.current\?\.\(snapshot\)/);
});
