import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { extinctionEnemyLabel, formatRaceObjective, sceneJournalPreview } from '../src/game/scenePresentation.js';
import { EngineRace } from '../src/game/engineRace.js';
import { snapshotMosaicLocation } from '../src/game/immersiveHubState.js';
import { advanceMosaicPlayer, clampMosaicPosition, getMosaicInteractionTargets, getMosaicNavigationObstacles, getMosaicZoneAnchor,
  getMosaicSceneObstacles, isMosaicPositionBlocked, resolveMosaicInteraction } from '../src/game/mosaicCityRuntime.js';
import { MOSAIC_CHARACTER_MISSIONS, normalizeMosaicCharacterMissions, getMosaicCharacterMissionObjective,
  getMosaicCharacterMissionZones, advanceMosaicCharacterMissionWalk } from '../src/game/mosaicCharacterMissions.js';
import { getMosaicMissionWalkApproach, MOSAIC_WALK_RANGE, recordMosaicMissionWalk } from '../src/game/mosaicMissionWalks.js';

for (const [type, fr, en] of [
  ['podium', 'Finir dans le podium', 'Finish on the podium'],
  ['beatRival', 'Battre le rival cible: Loom-07', 'Beat the target rival: Loom-07'],
  ['collectFragments', 'Recuperer les fragments: 2/4', 'Collect fragments: 2/4'],
  ['closePortals', 'Fermer les portails: 2/4', 'Close the portals: 2/4'],
  ['timeLimit', 'Sceller avant surcharge: 10s', 'Seal before overload: 10s']
]) test(`race objective ${type}: both languages, immutable state`, () => {
  const objective = Object.freeze({type, label:'old french label', collected:2, required:4, seconds:92, rivalName:'Loom-07'});
  assert.equal(formatRaceObjective(objective, 82, 'fr'), fr);
  assert.equal(formatRaceObjective(objective, 82, 'en'), en);
});
test('race objective tolerates absent/custom objectives and clamps expired countdown', () => {
  assert.equal(formatRaceObjective(null,0,'en'), 'Free race');
  assert.equal(formatRaceObjective({type:'custom',label:'Custom rule'},0,'en'),'Custom rule');
  assert.equal(formatRaceObjective({type:'timeLimit',seconds:10},22,'en'),'Seal before overload: 0s');
});
test('race engine changes presentation without resetting time, position or objective progress', () => {
  const race = Object.create(EngineRace.prototype);
  Object.assign(race, {lang:'fr',time:10,player:{x:40,y:50},objective:{type:'collectFragments',collected:2,required:4}});
  const state = structuredClone({time:race.time,player:race.player,objective:race.objective});
  assert.equal(race.getObjectiveStatus(),'Recuperer les fragments: 2/4');
  race.lang='en';
  assert.equal(race.getObjectiveStatus(),'Collect fragments: 2/4');
  assert.deepEqual({time:race.time,player:race.player,objective:race.objective},state);
});
test('all six Extinction names are localized without changing the gameplay IDs', () => {
  const kinds=['Traqueur','Sniper','Briseur','Essaim','Champion de Trame','Drone Protecteur'];
  assert.deepEqual(kinds.map(k=>extinctionEnemyLabel(k,'en')),['Stalker','Sniper','Breaker','Swarm','Thread Champion','Shield Drone']);
  assert.equal(extinctionEnemyLabel('unknown','en'),'unknown');
  assert.equal(extinctionEnemyLabel('Champion de Trame','fr'),'Champion de Trame');
});
test('journal preview preserves short text and makes truncation explicit', () => {
  assert.equal(sceneJournalPreview('  Ancre\n stable  '),'Ancre stable');
  assert.equal(sceneJournalPreview(null),'');
  const full='Mirelle donne une transmission longue '.repeat(10);
  const short=sceneJournalPreview(full);
  assert.ok(short.endsWith('…'));
  assert.ok(Array.from(short).length<=88);
  assert.equal(full,'Mirelle donne une transmission longue '.repeat(10));
  assert.equal(sceneJournalPreview('🪐'.repeat(30),16),'🪐'.repeat(15)+'…');
});
test('all city service exits snapshot position and release commands before navigation', () => {
  const source=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  const start=source.indexOf('  const openCityService = useCallback(');
  const end=source.indexOf('\n  const interactWithNearby',start);
  assert.ok(start >= 0 && end > start, 'the real City service callback is available');
  const code=source.slice(start,end);
  for (const [destination, options] of [
    ['missions', undefined], ['codex', undefined],
    ['battleRoyale', { fieldOperation: 'nexus-witness-return-v1' }]
  ]) {
    const state = { player: { x: 820.123, y: 760.456, facing: -1 },
      destination: { x: 900, y: 810 }, pendingInteraction: { type: 'zone', id: 'terminal' },
      keys: { w: true } };
    const original = structuredClone(state), events = [], held = new Set(['keyboard:w']);
    let saved;
    const env = {
      useCallback: callback => callback, stateRef: { current: state },
      sceneInputsRef: { current: { clear() { held.clear(); events.push('release'); } } },
      currentDistrictRef: { current: 'universe-nexus-de-convergence' },
      currentZoneRef: { current: 'terminal' }, snapshotMosaicLocation,
      locationCallbackRef: { current(checkpoint) {
        assert.equal(held.size, 0);
        assert.deepEqual(state.keys, {});
        assert.equal(state.destination, null);
        assert.equal(state.pendingInteraction, null);
        saved = checkpoint; events.push('checkpoint');
      } },
      setCityMenuOpen(open) { assert.equal(open, false); events.push('close'); }
    };
    const open = new Function(...Object.keys(env), `${code}; return openCityService;`)(...Object.values(env));
    open(null, destination, options);
    assert.deepEqual(state, original, 'an unavailable service must leave the scene alone');
    assert.deepEqual(events, []);
    open((actualDestination, actualOptions) => {
      assert.deepEqual(events, ['release', 'checkpoint', 'close']);
      assert.equal(actualDestination, destination);
      assert.equal(actualOptions, options, 'optional operation data reaches its destination unchanged');
      events.push('navigate');
      state.player.x = 0;
    }, destination, options);
    assert.deepEqual(events, ['release', 'checkpoint', 'close', 'navigate']);
    assert.deepEqual(saved, { districtId: 'universe-nexus-de-convergence', zoneId: 'terminal',
      player: { x: 820.12, y: 760.46, facing: -1 } }, 'the departure checkpoint is independent of later navigation');
  }
  assert.match(source,/openCityService\(onOpenMissions, zone.universe\)/);
  assert.match(source,/openCityService\(onOpenCodex, zone.universe\)/);
  assert.match(source,/openCityService\(onOpenService, zone.action\)/);
  assert.match(source,/openCityService\(onOpenService, 'battleRoyale', \{ fieldOperation: NEXUS_FIELD_OPERATION_ID \}\)/);
});
test('journal full text and explicit 60-second Infestation brief remain present', () => {
  const source=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  assert.match(source, /ref=\{journalRef\}[\s\S]*?<span>\{hubLog\}<\/span>/);
  assert.match(source, /className="mosaic-world-log" onClick=\{openTransmission\}/);
  assert.match(source, /Infestation: survive the swarms for 60 seconds/);
});

test('actual City entry callbacks distinguish an offered adventure, its transmission and the guide', () => {
  const source = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  const start = source.indexOf('  const openJournal =');
  const end = source.indexOf('\n  useEffect(() => {', start);
  assert.ok(start > 0 && end > start);
  const state = { section: 'district', mission: null, hero: 'arca_mirelle', exchange: { missionId: 'city-mirelle-suture-v1' }, open: false };
  const journalFocusRequestedRef = { current: false }, transmissionFocusRequestedRef = { current: false }, guideFocusRequestedRef = { current: false };
  const focus = [];
  const env = {
    setTerminalSection: value => { state.section = value; },
    setJournalMissionId: value => { state.mission = value; },
    setConversationHeroId: value => { state.hero = value; },
    setMissionConversation: value => { state.exchange = value; },
    setCityMenuOpen: value => { state.open = value; },
    journalFocusRequestedRef, transmissionFocusRequestedRef, guideFocusRequestedRef,
    cityTerminalButtonRef: { current: { focus: options => focus.push(options) } }
  };
  const callbacks = new Function(...Object.keys(env), `${source.slice(start, end)}; return { openJournal, openTransmission, openGuideDetails };`)(...Object.values(env));
  callbacks.openJournal('city-mirelle-suture-v1');
  assert.deepEqual(state, { section: 'journal', mission: 'city-mirelle-suture-v1', hero: null, exchange: null, open: true });
  assert.equal(journalFocusRequestedRef.current, true);
  assert.equal(transmissionFocusRequestedRef.current, false);
  callbacks.openTransmission();
  assert.equal(state.section, 'transmissions');
  assert.equal(transmissionFocusRequestedRef.current, true);
  assert.equal(journalFocusRequestedRef.current, false);
  callbacks.openGuideDetails();
  assert.equal(state.section, 'guide');
  assert.equal(guideFocusRequestedRef.current, true);
  assert.equal(transmissionFocusRequestedRef.current, false);
  assert.deepEqual(focus, [{ preventScroll: true }], 'guide keeps a durable focus return target');
  callbacks.openJournal({ type: 'click' });
  assert.equal(state.mission, null, 'an event is never treated as a saved mission ID');
  assert.equal(guideFocusRequestedRef.current, false);
});

function pocketFocusContext(kind = 'journal') {
  const source = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  const start = source.indexOf('  useEffect(() => {\n    if (!cityMenuOpen || (!journalFocusRequestedRef.current');
  const close = source.indexOf('  const closeCityMenu =', start);
  const end = source.indexOf('\n  useEffect(() => {', close);
  const section = source.match(/onSectionChange=\{section => \{([\s\S]*?)\}\} panels=/);
  assert.ok(start > 0 && close > start && end > close && section, 'production focus effect, close and section callbacks are available');
  const refs = { journalFocusRequestedRef: { current: kind === 'journal' },
    transmissionFocusRequestedRef: { current: kind === 'transmissions' },
    guideFocusRequestedRef: { current: kind === 'guide' } };
  const calls = [], state = { open: true, section: kind };
  let frame, cleanup;
  const node = name => ({ scrollIntoView: options => calls.push({ name, action: 'scroll', options }),
    focus: options => calls.push({ name, action: 'focus', options }) });
  const title = node('journal');
  const env = { ...refs, cityMenuOpen: true, conversationHeroId: null, terminalSection: kind,
    useEffect: effect => { cleanup = effect(); }, useCallback: callback => callback,
    requestAnimationFrame: callback => { frame = callback; return 41; },
    cancelAnimationFrame: id => calls.push({ action: 'cancel', id }),
    expeditionJournalRef: { current: { ...node('fallback'), querySelector: () => title } },
    journalRef: { current: node('transmissions') }, guideDetailsRef: { current: node('guide') },
    exhibitFocusPending: { current: true },
    setTerminalSection: value => { state.section = value; }, setCityMenuOpen: value => { state.open = value; } };
  const callbacks = new Function(...Object.keys(env), `${source.slice(start, end)}; return {
    close: closeCityMenu, section: section => {${section[1]}} };`)(...Object.values(env));
  return { refs, calls, state, callbacks, runFrame: () => frame(), cleanup: () => cleanup() };
}

test('a pending City focus cannot return to a hidden journal after a manual tab change', () => {
  for (const kind of ['journal', 'transmissions', 'guide']) {
    const context = pocketFocusContext(kind);
    context.callbacks.section('district');
    assert.equal(context.state.section, 'district');
    assert.ok(Object.values(context.refs).every(ref => ref.current === false));
    context.runFrame(); // Deliberately before React runs the passive cleanup.
    assert.deepEqual(context.calls, [], 'a cancelled request cannot scroll or steal the new tab focus');
    context.cleanup();
    assert.deepEqual(context.calls, [{ action: 'cancel', id: 41 }]);
  }
});

test('closing the City terminal cancels its pending focus before the next effect', () => {
  for (const kind of ['journal', 'transmissions', 'guide']) {
    const context = pocketFocusContext(kind);
    context.callbacks.close();
    assert.equal(context.state.open, false);
    assert.ok(Object.values(context.refs).every(ref => ref.current === false));
    context.runFrame();
    assert.deepEqual(context.calls, [], 'closing keeps the modal return target in control');
  }
});

test('live City focus requests still reach each contextual destination once', () => {
  for (const kind of ['journal', 'transmissions', 'guide']) {
    const context = pocketFocusContext(kind);
    context.runFrame();
    assert.deepEqual(context.calls, [
      { name: kind, action: 'scroll', options: { block: 'nearest' } },
      { name: kind, action: 'focus', options: { preventScroll: true } }
    ]);
    assert.ok(Object.values(context.refs).every(ref => ref.current === false));
    context.runFrame();
    assert.equal(context.calls.length, 2, 'the consumed request is not a fallback journal request');
  }
});

function walkingPointerContext() {
  const district = { id: 'universe-nexus-de-convergence', worldW: 1920, worldH: 1180, portals: [] };
  const mission = { ...MOSAIC_CHARACTER_MISSIONS.find(item => item.id === 'city-anchor-shared-beacon-v1'),
    districtId: district.id, anchorId: 'local-anchor' };
  const parent = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === mission.requiresMissionId);
  const index = mission.steps.findIndex(step => step.walk);
  const progress = normalizeMosaicCharacterMissions({ activeId: mission.id, records: {
    [parent.id]: { heroId: parent.heroId, universe: parent.universe, districtId: district.id,
      completedStepIds: parent.steps.map(step => step.id), choiceId: 'retain-origin', completed: true, storyRevision: 2 },
    [mission.id]: { heroId: mission.heroId, universe: mission.universe, districtId: district.id,
      completedStepIds: mission.steps.slice(0, index).map(step => step.id), choiceId: 'apply', completed: false,
      storyRevision: 2, originStoryRevision: 2, originChoiceId: 'retain-origin' }
  } });
  const point = getMosaicCharacterMissionObjective(progress, mission).walk.next;
  const zones = getMosaicCharacterMissionZones(progress, [mission]);
  const state = { player: { x: point.x, y: point.y, speed: 2.35 }, camera: { x: 800, y: 500 },
    keys: {}, npcs: [], obstacles: getMosaicSceneObstacles(district, zones), destination: null,
    destinationRoute: { points: [{ x: 100, y: 100 }] }, pendingInteraction: null };
  const interactions = [], messages = [];
  const env = { sessionPausedRef: { current: false }, cityMenuRef: { current: false }, stateRef: { current: state },
    canvasRef: { current: { width: 960, height: 540, focus() {},
      getBoundingClientRect: () => ({ left: 13, top: 17, width: 480, height: 270 }) } },
    district, zones, getMosaicInteractionTargets, resolveMosaicInteraction, clampMosaicPosition,
    getMosaicMissionWalkApproach, getMosaicCharacterMissionObjective, characterMissionCatalog: [mission],
    characterMissionsRef: { current: progress }, lang: 'fr', sceneInputsRef: { current: { clear() {} } },
    interactWithNearby: value => interactions.push(value), setHubLog: value => messages.push(value), sound: { playSfx() {} } };
  const source = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  const start = source.indexOf('  const moveToPointer = event => {');
  const end = source.indexOf('  const setVirtualKey', start);
  assert.ok(start > 0 && end > start, 'the production City pointer callback is available');
  const pointer = new Function(...Object.keys(env), `${source.slice(start, end)}; return moveToPointer;`)(...Object.values(env));
  const click = (target = point) => pointer({ pointerType: 'mouse', button: 0,
    clientX: 13 + (target.x - state.camera.x) / 2, clientY: 17 + (target.y - state.camera.y) / 2, preventDefault() {} });
  return { district, mission, progress, point, zones, state, env, interactions, messages, click };
}

function runJournalApproach(context, overrides = {}) {
  const source = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  const start = source.indexOf('    if (!reconnaissanceTarget) return;');
  const end = source.indexOf('  }, [reconnaissanceTarget', start);
  assert.ok(start > 0 && end > start, 'the production deferred City approach is available');
  let queued = { districtId: context.district.id,
    id: getMosaicCharacterMissionObjective(context.progress, context.mission).targetId };
  const env = { ...context.env, currentDistrict: context.district.id, sessionPaused: false,
    runtimeError: null, cityMenuOpen: false, reconnaissanceTarget: queued,
    getMosaicZoneAnchor, setReconnaissanceTarget: value => { queued = value; }, ...overrides };
  new Function(...Object.keys(env), source.slice(start, end))(...Object.values(env));
  return queued;
}

test('the journal approach requests a real step from a restored route marker foot and waits until the terminal closes', () => {
  for (const [x, y] of [[0, 9], [0, 0], [0, 44], [-30, 0], [-64, 0], [-65, 0], [-70, 0], [-72, 0], [-73, 0]]) {
    const context = walkingPointerContext();
    const { district, mission, progress, point, state, interactions } = context;
    Object.assign(state.player, { x: point.x + x, y: point.y + y });
    const beforePlayer = structuredClone(state.player), beforeProgress = JSON.stringify(progress);
    const deferred = runJournalApproach(context, { cityMenuOpen: true });
    assert.equal(deferred.id, getMosaicCharacterMissionObjective(progress, mission).targetId);
    assert.equal(state.destination, null, 'an open terminal never starts the requested walk');
    assert.equal(runJournalApproach(context), null, 'closing consumes the deferred request');
    assert.deepEqual(state.player, beforePlayer, 'the journal approach never places the player');
    assert.equal(JSON.stringify(progress), beforeProgress, 'the journal approach never awards a waypoint');
    assert.ok(state.destination, `journal approach must retain a destination at offset ${x},${y}`);
    assert.ok(Math.hypot(state.destination.x - state.player.x, state.destination.y - state.player.y) > 1,
      'the destination must differ from the restored player, even at the walkable foot');
    assert.ok(Math.hypot(state.destination.x - point.x, state.destination.y - point.y) <= MOSAIC_WALK_RANGE);
    assert.equal(state.destinationRoute, null, 'an earlier route cannot own the new request');
    const distanceAtResume = advanceMosaicPlayer(state, district, 0);
    assert.equal(distanceAtResume, 0);
    assert.equal(advanceMosaicCharacterMissionWalk(progress, mission, { districtId: district.id,
      from: beforePlayer, to: state.player, distance: distanceAtResume, elapsedMs: 0, speed: state.player.speed }).changed, false);
    let earned = null;
    for (let frame = 0; frame < 120 && !earned; frame++) {
      const from = { x: state.player.x, y: state.player.y };
      const distance = advanceMosaicPlayer(state, district, 1000 / 60);
      assert.ok(distance <= state.player.speed + 1e-7);
      const result = advanceMosaicCharacterMissionWalk(progress, mission, { districtId: district.id,
        from, to: state.player, distance, elapsedMs: 1000 / 60, speed: state.player.speed });
      if (result.changed) earned = result;
    }
    assert.ok(earned, `journal approach must produce a real route waypoint at offset ${x},${y}`);
    assert.equal(earned.walk.visited, 1);
    assert.deepEqual(earned.progress.records[mission.id].completedStepIds, progress.records[mission.id].completedStepIds);
    assert.deepEqual(earned.progress.records[mission.id].operationReceipts, progress.records[mission.id].operationReceipts);
    assert.deepEqual(interactions, []);
    assert.equal(JSON.stringify(progress), beforeProgress);
  }
});

test('the deferred journal approach reports a blocked route and preserves ordinary service destinations', () => {
  const context = walkingPointerContext();
  const { district, state, point, progress, zones, messages } = context;
  Object.assign(state.player, { x: point.x - 200, y: point.y });
  state.obstacles.push({ id: 'closed-wall', x: point.x - 100, y: 0, w: 20, h: district.worldH });
  const beforePlayer = structuredClone(state.player), beforeProgress = JSON.stringify(progress);
  assert.equal(runJournalApproach(context), null);
  assert.equal(state.destination, null);
  assert.equal(state.destinationRoute, null);
  assert.equal(state.pendingInteraction, null);
  assert.deepEqual(state.player, beforePlayer);
  assert.equal(JSON.stringify(progress), beforeProgress);
  assert.equal(messages.length, 1);
  assert.match(messages[0], /bloqué/);

  const service = { id: 'local-archive', action: 'codex', x: 1450, y: 700, w: 64, h: 64 };
  zones.push(service);
  runJournalApproach(context, { reconnaissanceTarget: { districtId: district.id, id: service.id } });
  assert.deepEqual(state.destination, getMosaicZoneAnchor(service));
  assert.deepEqual(state.pendingInteraction, { type: 'zone', id: service.id });
  assert.equal(messages.length, 1, 'an unrelated service never borrows the active route refusal');
  assert.equal(JSON.stringify(progress), beforeProgress);
});

test('clicking a nearby unfinished route requests real movement, including the restored marker centre and its foot', () => {
  for (const [x, y] of [[0, 0], [0, 44], [-30, 0], [-64, 0], [-65, 0], [-70, 0], [-72, 0], [-73, 0]]) {
    const { district, mission, progress, point, state, interactions, click } = walkingPointerContext();
    Object.assign(state.player, { x: point.x + x, y: point.y + y });
    const beforePlayer = structuredClone(state.player), beforeProgress = JSON.stringify(progress);
    click();
    assert.deepEqual(interactions, [], `an unfinished marker must request walking at offset ${x},${y}`);
    assert.deepEqual(state.player, beforePlayer, 'a click never places the player');
    assert.equal(JSON.stringify(progress), beforeProgress, 'a click never awards a checkpoint');
    assert.equal(state.pendingInteraction.id, getMosaicCharacterMissionObjective(progress, mission).targetId);
    assert.equal(state.destinationRoute, null, 'the ordinary path planner must refresh the destination');
    assert.ok(Math.hypot(state.destination.x - point.x, state.destination.y - point.y) <= MOSAIC_WALK_RANGE);
    assert.ok(Math.hypot(state.destination.x - state.player.x, state.destination.y - state.player.y) > 1);
    assert.equal(isMosaicPositionBlocked(state.destination, getMosaicNavigationObstacles(state)), false);
    const stationary = advanceMosaicPlayer(state, district, 0);
    assert.equal(stationary, 0);
    assert.equal(advanceMosaicCharacterMissionWalk(progress, mission, { districtId: district.id,
      from: beforePlayer, to: state.player, distance: stationary, elapsedMs: 0, speed: state.player.speed }).changed, false);
    let earned = null;
    for (let frame = 0; frame < 120 && !earned; frame++) {
      const from = { x: state.player.x, y: state.player.y };
      const distance = advanceMosaicPlayer(state, district, 1000 / 60);
      assert.ok(distance <= state.player.speed + 1e-7, 'ordinary movement keeps its speed budget');
      const next = advanceMosaicCharacterMissionWalk(progress, mission, { districtId: district.id,
        from, to: state.player, distance, elapsedMs: 1000 / 60, speed: state.player.speed });
      if (next.changed) earned = next;
    }
    assert.ok(earned, `ordinary collision-aware walking reaches the marker from offset ${x},${y}`);
    assert.equal(earned.walk.visited, 1);
    assert.deepEqual(earned.progress.records[mission.id].completedStepIds, progress.records[mission.id].completedStepIds);
    assert.deepEqual(earned.progress.records[mission.id].operationReceipts, progress.records[mission.id].operationReceipts);
    assert.equal(JSON.stringify(progress), beforeProgress);
  }
});

test('route approaches respect world edges, residents and a genuinely blocked path', () => {
  const { district, state, point, progress, click, messages, interactions } = walkingPointerContext();
  state.npcs = [{ hero: { id: 'passer-by' }, x: point.x, y: point.y + 44 }];
  state.pendingInteraction = { type: 'npc', id: 'passer-by' };
  const beforeProgress = JSON.stringify(progress);
  click();
  assert.ok(state.destination);
  assert.equal(isMosaicPositionBlocked(state.destination, getMosaicNavigationObstacles(state)), false,
    'an old NPC target must not be omitted from the new approach obstacles');
  for (const target of [{ x: 34, y: 58 }, { x: district.worldW - 34, y: district.worldH - 50 }]) {
    const edgeState = { player: { ...target }, npcs: [], obstacles: [] };
    const destination = getMosaicMissionWalkApproach(edgeState, target, district);
    assert.ok(destination);
    assert.deepEqual(clampMosaicPosition(destination, district), destination);
    assert.ok(Math.hypot(destination.x - target.x, destination.y - target.y) > 1);
    assert.ok(Math.hypot(destination.x - target.x, destination.y - target.y) <= MOSAIC_WALK_RANGE);
    assert.deepEqual(edgeState.player, target);
  }
  state.npcs = [];
  Object.assign(state.player, { x: point.x - 200, y: point.y });
  state.obstacles.push({ id: 'closed-wall', x: point.x - 100, y: 0, w: 20, h: district.worldH });
  const beforePlayer = structuredClone(state.player);
  click();
  assert.equal(state.destination, null);
  assert.equal(state.pendingInteraction, null);
  assert.equal(state.destinationRoute, null);
  assert.deepEqual(state.player, beforePlayer);
  assert.equal(JSON.stringify(progress), beforeProgress);
  assert.deepEqual(interactions, []);
  assert.equal(messages.length, 1, 'a blocked approach gives feedback instead of fabricating progress');
});

test('the production pointer keeps unrelated services and a completed route final interaction intact', () => {
  const context = walkingPointerContext();
  const { district, mission, progress, state, env, interactions, zones, click } = context;
  const service = { id: 'local-archive', action: 'codex', x: 1450, y: 700, w: 64, h: 64 };
  zones.push(service);
  const servicePoint = { x: service.x + service.w / 2, y: service.y + service.h / 2 };
  Object.assign(state.player, servicePoint);
  click(servicePoint);
  assert.deepEqual(interactions.pop(), { type: 'zone', id: service.id });
  const saved = progress.records[mission.id];
  const step = getMosaicCharacterMissionObjective(progress, mission).step;
  for (const target of step.walk.points) saved.walkReceipts = { [step.id]: recordMosaicMissionWalk(mission, step, saved,
    { districtId: district.id, from: { x: target.x - 2, y: target.y }, to: target,
      distance: 2, elapsedMs: 1000 / 60, speed: 2.35 }) };
  const objective = getMosaicCharacterMissionObjective(env.characterMissionsRef.current, mission);
  assert.equal(objective.walk.completed, true);
  zones.splice(0, zones.length, ...getMosaicCharacterMissionZones(progress, [mission]));
  Object.assign(state.player, { x: objective.walk.next.x, y: objective.walk.next.y + 40 });
  click(objective.walk.next);
  assert.deepEqual(interactions.pop(), { type: 'zone', id: objective.targetId });
  assert.equal(interactions.length, 0);
});
