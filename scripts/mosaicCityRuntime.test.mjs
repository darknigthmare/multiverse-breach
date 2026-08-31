import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import {
  advanceMosaicGuide, advanceMosaicPlayer, clampMosaicPosition, createMosaicGuide,
  getMosaicDestinationView, getMosaicGuideStep, getMosaicInteractionTargets, getMosaicUniverseCatalog, getMosaicZoneAnchor,
  MOSAIC_CITY_ART, MOSAIC_WELCOME, resolveMosaicInteraction, transitionMosaicGuide
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
