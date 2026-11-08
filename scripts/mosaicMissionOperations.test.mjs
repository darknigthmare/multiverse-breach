import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB, EQUIP_ITEMS_DB } from '../src/game/heroes.js';
import { getMosaicExhibits, getMosaicExhibitZones } from '../src/game/mosaicExhibits.js';
import { getMosaicZoneAnchor, getMosaicSceneObstacles, resolveMosaicInteraction, isMosaicPositionBlocked } from '../src/game/mosaicCityRuntime.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { MOSAIC_CHARACTER_MISSION_LEGACY, MOSAIC_CHARACTER_MISSIONS, normalizeMosaicCharacterMissions,
  getMosaicCharacterMissionCatalog, getMosaicCharacterMissionObjective, getMosaicCharacterMissionStep,
  getMosaicCharacterMissionZones, getMosaicCharacterMissionWorldObjects, getMosaicCharacterMissionPropZones,
  startMosaicCharacterMission, restartMosaicCharacterMission, acceptMosaicCharacterMissionRequest,
  advanceMosaicCharacterMission, resolveMosaicCharacterMission } from '../src/game/mosaicCharacterMissions.js';
import { getMosaicMissionOperation, drawMosaicMissionObject, drawMosaicMissionObjectProp,
  drawMosaicMissionObjectLabel, selectMosaicMissionObjectLabel, placeMosaicMissionObjectLabel } from '../src/game/mosaicMissionOperations.js';

function context(universe = 'Nexus de Convergence') {
  const district = { id: `test-${universe}`, universe, worldW: 1920, worldH: 1180 };
  const residents = HEROES_DB.filter(hero => hero.universe === universe);
  const exhibits = getMosaicExhibits(EQUIP_ITEMS_DB, universe);
  const anchor = { id: `${district.id}-core`, universe, action: 'anchor', x: 760, y: 875, w: 400, h: 150 };
  const missions = getMosaicCharacterMissionCatalog({ district, residents, exhibits, anchor,
    unlockedHeroIds: ['player_anchor', ...residents.map(hero => hero.id)] });
  return { district, residents, missions, baseZones: [anchor, ...getMosaicExhibitZones(district, exhibits)] };
}
const c = context();
const first = c.missions.find(mission => mission.heroId === 'arca_mirelle' && !mission.requiresMissionId);
function scene(c, progress) {
  const zones = [...c.baseZones, ...getMosaicCharacterMissionZones(progress, c.missions)];
  return { zones, npcs: c.residents.map((hero, i) => ({ hero, x: 600 + i * 30, y: 650 })) };
}
function atStep(c, progress, mission) {
  const current = getMosaicCharacterMissionObjective(progress, mission), live = scene(c, progress);
  const target = current.targetType === 'npc' ? live.npcs.find(npc => npc.hero.id === current.targetId)
    : getMosaicZoneAnchor(live.zones.find(zone => zone.id === current.targetId));
  return resolveMosaicInteraction(target, live, { type: current.targetType, id: current.targetId });
}
function finish(c, progress, mission, choiceIndex = 0) {
  while (getMosaicCharacterMissionObjective(progress, mission).status === 'active') {
    const step = getMosaicCharacterMissionObjective(progress, mission).step;
    progress = step.type === 'decision'
      ? resolveMosaicCharacterMission(progress, mission, step.choices.filter(choice => choice.valid)[choiceIndex].id).progress
      : advanceMosaicCharacterMission(progress, mission, atStep(c, progress, mission)).progress;
  }
  return progress;
}

test('a resident can give the quest on site, and accepting counts only that real encounter', () => {
  const empty = normalizeMosaicCharacterMissions(), live = scene(c, empty);
  const npc = live.npcs.find(person => person.hero.id === first.heroId);
  const interaction = resolveMosaicInteraction(npc, live, { type: 'npc', id: first.heroId });
  for (const wrong of [null, { ...interaction, distance: 58.01 }, { ...interaction, distance: -1 },
    { ...interaction, id: 'other' }, { ...interaction, target: { ...npc, hero: { ...npc.hero, universe: 'Other' } } }]) {
    const result = acceptMosaicCharacterMissionRequest(empty, first, wrong);
    assert.equal(result.changed, false); assert.equal(result.progress, empty);
  }
  const accepted = acceptMosaicCharacterMissionRequest(empty, first, interaction);
  assert.equal(accepted.changed, true);
  assert.deepEqual(accepted.progress.records[first.id].completedStepIds, [first.steps[0].id]);
  assert.deepEqual(accepted.progress.records[first.id].operationReceipts, {});
  assert.equal(getMosaicCharacterMissionObjective(accepted.progress, first).index, 1);
});

test('world equipment changes only after the right physical operation and survives real save sanitizing', () => {
  let progress = startMosaicCharacterMission(normalizeMosaicCharacterMissions(), first).progress;
  while (!getMosaicMissionOperation(getMosaicCharacterMissionObjective(progress, first).step)) {
    progress = advanceMosaicCharacterMission(progress, first, atStep(c, progress, first)).progress;
  }
  const step = getMosaicCharacterMissionObjective(progress, first).step;
  const interaction = atStep(c, progress, first), before = JSON.stringify(progress);
  assert.equal(getMosaicCharacterMissionWorldObjects(progress, c.missions, scene(c, progress).zones).filter(item => item.completed).length, 0);
  for (const wrong of [{ ...interaction, distance: 72.001 }, { ...interaction, id: 'wrong' }]) {
    assert.equal(advanceMosaicCharacterMission(progress, first, wrong).changed, false);
    assert.equal(JSON.stringify(progress), before);
  }
  progress = advanceMosaicCharacterMission(progress, first, interaction).progress;
  const receipt = progress.records[first.id].operationReceipts[step.id];
  assert.equal(receipt.targetId, interaction.id);
  assert.equal(receipt.kind, step.operation.kind);
  assert.deepEqual({ x: receipt.x, y: receipt.y }, getMosaicZoneAnchor(interaction.target));
  assert.equal(receipt.originChoiceId, null); assert.equal(receipt.branchChoiceId, null);
  const save = sanitizeSaveCore(JSON.parse(JSON.stringify({ gold: 81, inventory: ['retained-item'], activityProgress: { mosaicCharacterMissions: progress } })));
  assert.equal(save.gold, 81); assert.deepEqual(save.inventory, ['retained-item']);
  const restored = normalizeMosaicCharacterMissions(save.activityProgress.mosaicCharacterMissions);
  const objects = getMosaicCharacterMissionWorldObjects(restored, c.missions, scene(c, restored).zones);
  assert.equal(objects.find(item => item.stepId === step.id)?.completed, true);
  assert.deepEqual(restored.records[first.id].operationReceipts[step.id], receipt);
  assert.equal(advanceMosaicCharacterMission(restored, first, interaction).changed, false);
});

test('a legacy completion preserves its actual words and cannot manufacture repaired objects', () => {
  const legacy = MOSAIC_CHARACTER_MISSION_LEGACY.find(mission => mission.id === first.id);
  const record = { heroId: first.heroId, universe: first.universe, districtId: first.districtId,
    completedStepIds: legacy.steps.map(step => step.id), choiceId: legacy.steps.find(step => step.type === 'decision').choices[0].id,
    completed: true, futureData: { keep: ['untouched'] } };
  const progress = normalizeMosaicCharacterMissions({ activeId: null, lastMissionId: first.id, records: { [first.id]: record } });
  const copy = JSON.stringify(progress);
  assert.equal(getMosaicCharacterMissionObjective(progress, first).legacy, true);
  assert.equal(getMosaicCharacterMissionObjective(progress, first).storyTitle, legacy.title.fr);
  assert.equal(getMosaicCharacterMissionObjective(progress, first).resolution, legacy.steps.find(step => step.type === 'decision').choices[0].result.fr);
  for (let i = 0; i < first.steps.length; i++) assert.deepEqual(getMosaicCharacterMissionStep(progress, first, i).text, legacy.steps[i].text);
  assert.deepEqual(getMosaicCharacterMissionWorldObjects(progress, c.missions, scene(c, progress).zones), []);
  assert.equal(JSON.stringify(progress), copy);
  const replay = restartMosaicCharacterMission(progress, first).progress;
  assert.deepEqual(replay.records[first.id].previousStory, record);
  assert.deepEqual(replay.records[first.id].completedStepIds, []);
  assert.equal(getMosaicCharacterMissionObjective(replay, first).legacy, false);
  assert.equal(restartMosaicCharacterMission(replay, first).changed, false);
  const finished = finish(c, replay, first);
  assert.deepEqual(finished.records[first.id].previousStory, record);
  assert.ok(Object.keys(finished.records[first.id].operationReceipts).length);
});

test('an interrupted legacy visit retains its past observations and records only new interventions', () => {
  const old = { heroId: first.heroId, universe: first.universe, districtId: first.districtId,
    completedStepIds: first.steps.slice(0, 2).map(step => step.id), choiceId: null, completed: false };
  let progress = normalizeMosaicCharacterMissions({ activeId: first.id, records: { [first.id]: old } });
  const legacy = MOSAIC_CHARACTER_MISSION_LEGACY.find(mission => mission.id === first.id);
  assert.deepEqual(getMosaicCharacterMissionStep(progress, first, 1).text, legacy.steps[1].text);
  const next = getMosaicCharacterMissionObjective(progress, first).step;
  assert.ok(getMosaicMissionOperation(next));
  progress = advanceMosaicCharacterMission(progress, first, atStep(c, progress, first)).progress;
  assert.deepEqual(getMosaicCharacterMissionStep(progress, first, 1).text, legacy.steps[1].text);
  assert.deepEqual(getMosaicCharacterMissionStep(progress, first, 2).text, first.steps[2].text);
  assert.deepEqual(Object.keys(progress.records[first.id].operationReceipts), [next.id]);
});

test('wrong receipt identities, changed marker positions and removed DLC cannot repaint a scene', () => {
  const completed = finish(c, startMosaicCharacterMission(normalizeMosaicCharacterMissions(), first).progress, first);
  const step = first.steps.find(item => item.type === 'marker' && getMosaicMissionOperation(item));
  for (const change of [{ missionId: 'other' }, { universe: 'Other' }, { targetId: 'wrong' }, { kind: 'unknown' }, { version: 99 },
    { x: 9999 }, { y: NaN }, { branchChoiceId: 'apply' }, { sequence: 0 }]) {
    const forged = structuredClone(completed);
    Object.assign(forged.records[first.id].operationReceipts[step.id], change);
    assert.equal(getMosaicCharacterMissionWorldObjects(forged, c.missions, scene(c, forged).zones).some(item => item.stepId === step.id), false);
  }
  assert.deepEqual(getMosaicCharacterMissionWorldObjects(completed, [], []), []);
  assert.equal(getMosaicCharacterMissionObjective(completed, first).canReplayStory, false);
});

test('operation receipts belong to the actual inherited route and final branch', () => {
  const followup = c.missions.find(mission => mission.requiresMissionId === first.id);
  const parent = finish(c, startMosaicCharacterMission(normalizeMosaicCharacterMissions(), first).progress, first);
  const completed = finish(c, startMosaicCharacterMission(parent, followup).progress, followup);
  const step = followup.steps.find(item => item.byChoice);
  const saved = completed.records[followup.id], receipt = saved.operationReceipts[step.id];
  assert.equal(receipt.originChoiceId, parent.records[first.id].choiceId);
  assert.equal(receipt.originStoryRevision, saved.originStoryRevision);
  assert.equal(receipt.branchChoiceId, saved.choiceId);
  const visible = progress => getMosaicCharacterMissionWorldObjects(progress, c.missions, scene(c, progress).zones)
    .some(item => item.missionId === followup.id && item.stepId === step.id && item.completed);
  assert.equal(visible(completed), true);
  for (const change of [{ branchChoiceId: 'hold' }, { originChoiceId: 'isolate-relay' }, { originStoryRevision: 1 }, { x: receipt.x + 1 }]) {
    const altered = structuredClone(completed);
    Object.assign(altered.records[followup.id].operationReceipts[step.id], change);
    assert.equal(visible(altered), false);
  }
  const otherBranch = structuredClone(completed);
  otherBranch.records[followup.id].choiceId = 'hold';
  assert.equal(visible(otherBranch), false);
  assert.equal(getMosaicCharacterMissionObjective(otherBranch, followup).status, 'completed');
});

test('replaying a parent keeps its completed sequel readable and a replayed sequel uses the new choice', () => {
  const followup = c.missions.find(mission => mission.requiresMissionId === first.id);
  const oldRecord = (mission, originChoiceId) => ({ heroId: mission.heroId, universe: mission.universe, districtId: mission.districtId,
    completedStepIds: mission.steps.map(step => step.id), choiceId: mission.steps.find(step => step.type === 'decision').choices[0].id,
    ...(originChoiceId ? { originChoiceId } : {}), completed: true });
  const oldParent = oldRecord(first), oldSequel = oldRecord(followup, oldParent.choiceId);
  const progress = normalizeMosaicCharacterMissions({ records: { [first.id]: oldParent, [followup.id]: oldSequel } });
  const originalResolution = getMosaicCharacterMissionObjective(progress, followup).originResolution;
  const sameChoice = finish(c, restartMosaicCharacterMission(progress, first).progress, first);
  assert.equal(sameChoice.records[first.id].choiceId, oldParent.choiceId);
  assert.equal(getMosaicCharacterMissionObjective(sameChoice, followup).originResolution, originalResolution);
  assert.equal(getMosaicCharacterMissionObjective(sameChoice, followup).prerequisite.storyRevision, 1);
  let replay = restartMosaicCharacterMission(progress, first).progress;
  assert.equal(getMosaicCharacterMissionObjective(replay, followup).status, 'completed');
  assert.equal(getMosaicCharacterMissionObjective(replay, followup).originResolution, originalResolution);
  replay = finish(c, replay, first, 1);
  assert.notEqual(replay.records[first.id].choiceId, oldParent.choiceId);
  assert.equal(getMosaicCharacterMissionObjective(replay, followup).status, 'completed');
  assert.equal(getMosaicCharacterMissionObjective(replay, followup).originResolution, originalResolution);
  const replayedSequel = restartMosaicCharacterMission(replay, followup).progress;
  assert.deepEqual(replayedSequel.records[followup.id].previousStory, oldSequel);
  assert.equal(replayedSequel.records[followup.id].originChoiceId, replay.records[first.id].choiceId);
  assert.equal(replayedSequel.records[followup.id].originStoryRevision, 2);
  assert.equal(getMosaicCharacterMissionObjective(replayedSequel, followup).status, 'active');
});

test('completed equipment remains in the district while another resident’s adventure is followed', () => {
  const completed = finish(c, startMosaicCharacterMission(normalizeMosaicCharacterMissions(), first).progress, first);
  const before = getMosaicCharacterMissionWorldObjects(completed, c.missions, scene(c, completed).zones);
  assert.ok(before.length);
  const other = c.missions.find(mission => mission.heroId !== first.heroId && !mission.requiresMissionId && mission.steps[0].type === 'npc');
  const following = startMosaicCharacterMission(completed, other).progress;
  assert.deepEqual(getMosaicCharacterMissionWorldObjects(following, c.missions, scene(c, following).zones), before);
  const finished = finish(c, following, other);
  const previousLast = Math.max(...Object.values(completed.records[first.id].operationReceipts).map(receipt => receipt.sequence));
  assert.ok(Object.values(finished.records[other.id].operationReceipts).every(receipt => receipt.sequence > previousLast));
  assert.equal(new Set(getMosaicCharacterMissionWorldObjects(finished, c.missions, scene(c, finished).zones)
    .map(object => `${object.x}:${object.y}`)).size, getMosaicCharacterMissionWorldObjects(finished, c.missions, scene(c, finished).zones).length);
});

test('finished props retain a collision footprint without becoming repeatable interactions', () => {
  const completed = finish(c, startMosaicCharacterMission(normalizeMosaicCharacterMissions(), first).progress, first);
  const live = scene(c, completed);
  const objects = getMosaicCharacterMissionWorldObjects(completed, c.missions, live.zones);
  const props = getMosaicCharacterMissionPropZones(objects, live.zones);
  assert.ok(props.length);
  const obstacles = getMosaicSceneObstacles(c.district, [...live.zones, ...props]);
  for (const prop of props) {
    const center = getMosaicZoneAnchor(prop);
    assert.equal(isMosaicPositionBlocked({ x: center.x, y: center.y - 11 }, obstacles), true);
    assert.equal(resolveMosaicInteraction(center, live, { type: 'zone', id: prop.id }), null);
  }
});

test('drawing six types of equipment is read-only and keeps restored/unfinished states distinct', () => {
  const snapshots = new Map();
  for (const kind of ['repair', 'scan', 'recover', 'secure', 'beacon', 'route']) {
    for (const completed of [false, true]) {
      const calls = [];
      const context = new Proxy({ measureText: value => ({ width: value.length * 6 }) }, {
        get(target, name) { return target[name] || ((...args) => calls.push([name, ...args])); },
        set(target, name, value) { target[name] = value; calls.push([name, value]); return true; }
      });
      const object = { kind, sourceType: 'marker', completed, x: 500, y: 600, propName: 'Relais de secours', statusLabel: 'Rétablir le courant' };
      const before = structuredClone(object);
      drawMosaicMissionObject(context, object, 30, true, true);
      assert.deepEqual(object, before);
      assert.deepEqual(calls.at(-1), ['restore']);
      snapshots.set(`${kind}/${completed}`, JSON.stringify(calls));
    }
    assert.notEqual(snapshots.get(`${kind}/false`), snapshots.get(`${kind}/true`));
  }
  assert.equal(new Set(snapshots.values()).size, 12);
});

const rectsOverlap = (a, b, gap = 0) => a.x < b.x + b.width + gap && a.x + a.width > b.x - gap
  && a.y < b.y + b.height + gap && a.y + a.height > b.y - gap;
const within = (rect, viewport, padding = 8) => rect.x >= viewport.x + padding && rect.y >= viewport.y + padding
  && rect.x + rect.width <= viewport.x + viewport.width - padding
  && rect.y + rect.height <= viewport.y + viewport.height - padding;

function observedCanvas() {
  const calls = [], stack = [];
  const state = { fillStyle: '#000000', font: '10px sans-serif', textAlign: 'left', textBaseline: 'alphabetic' };
  const ctx = new Proxy({
    measureText: value => ({ width: String(value).length * 6 }),
    save() { stack.push({ ...state }); calls.push(['save']); },
    restore() {
      const previous = stack.pop();
      for (const key of Object.keys(state)) delete state[key];
      Object.assign(state, previous); calls.push(['restore']);
    },
    fillRect(...args) { calls.push(['fillRect', state.fillStyle, ...args]); },
    fillText(...args) { calls.push(['fillText', state.fillStyle, ...args]); }
  }, {
    get(target, name) { return target[name] || state[name] || ((...args) => calls.push([name, ...args])); },
    set(_target, name, value) { state[name] = value; return true; }
  });
  return { ctx, calls, state, stack };
}

test('one visible nearby active operation takes precedence without hiding completed equipment from later inspection', () => {
  const player = { x: 500, y: 400 }, viewport = { x: 140, y: 130, width: 720, height: 540 };
  const finished = { missionId: 'past', stepId: 'repair', targetId: 'past-repair', x: 510, y: 400, completed: true };
  const active = { missionId: 'current', stepId: 'deliver', targetId: 'current-deliver', x: 580, y: 400, active: true };
  const outside = { missionId: 'later', x: 800, y: 400, active: true };
  const objects = [finished, outside, active], before = structuredClone(objects);
  assert.equal(selectMosaicMissionObjectLabel(objects, player, { viewport }), active);
  assert.equal(selectMosaicMissionObjectLabel([outside, finished], player, { viewport }), finished);
  assert.equal(selectMosaicMissionObjectLabel([finished], { x: 399.99, y: 400 }, { viewport }), null);
  assert.equal(selectMosaicMissionObjectLabel([{ ...active, x: 100 }], { x: 145, y: 400 }, { viewport }), null);
  assert.deepEqual(objects, before);
});

test('equidistant label selection is stable and malformed positions cannot win', () => {
  const player = { x: 200, y: 200 };
  const a = { missionId: 'a', stepId: 'scan', x: 210, y: 200 };
  const b = { missionId: 'b', stepId: 'scan', x: 190, y: 200 };
  const malformed = { missionId: 'bad', active: true, x: NaN, y: 200 };
  assert.equal(selectMosaicMissionObjectLabel([b, malformed, a], player), a);
  assert.equal(selectMosaicMissionObjectLabel([a, malformed, b], player), a);
  assert.equal(selectMosaicMissionObjectLabel([a], { x: Infinity, y: 200 }), null);
  assert.equal(selectMosaicMissionObjectLabel([a], player, { range: -1 }), null);
  assert.equal(selectMosaicMissionObjectLabel([a], player, { viewport: { x: 0, y: 0, width: 0, height: 300 } }), null);
});

test('label placement protects a wide avatar, carried silhouette and its full text at camera edges', () => {
  for (const viewport of [{ x: 330.3, y: 300.7, width: 720, height: 540 }, { x: 0, y: 0, width: 390, height: 844 },
    { x: 800, y: 600, width: 844, height: 390 }]) {
    for (const position of ['center', 'top-left', 'bottom-right']) {
      const player = position === 'center' ? { x: viewport.x + viewport.width / 2, y: viewport.y + viewport.height / 2 }
        : position === 'top-left' ? { x: viewport.x + 85, y: viewport.y + 85 }
          : { x: viewport.x + viewport.width - 85, y: viewport.y + viewport.height - 85 };
      const protectedRects = [
        { x: player.x - 78, y: player.y - 55.4, width: 156, height: 96 },
        { x: player.x + 12, y: player.y - 36.5, width: 29, height: 34 },
        { x: player.x - 95, y: player.y - 78, width: 190, height: 17 }
      ];
      const input = { anchor: { x: player.x - 60, y: player.y - 14 }, width: 188, height: 87, viewport, protectedRects };
      const before = structuredClone(input), rect = placeMosaicMissionObjectLabel(input);
      assert.ok(rect, `${position}: an ordinary viewport must retain room for its operation label`);
      assert.ok(within(rect, viewport));
      assert.ok(protectedRects.every(protectedRect => !rectsOverlap(rect, protectedRect, 8)));
      assert.deepEqual(input, before);
      assert.deepEqual(placeMosaicMissionObjectLabel(input), rect);
    }
  }
});

test('an impossible or malformed label layout yields no unsafe overlay', () => {
  const base = { anchor: { x: 200, y: 150 }, width: 188, height: 72,
    viewport: { x: 0, y: 0, width: 400, height: 300 }, protectedRects: [] };
  for (const change of [{ width: 500 }, { height: 301 }, { width: NaN }, { gap: -1 },
    { anchor: { x: Infinity, y: 150 } }, { protectedRects: [{ x: 0, y: 0, width: 400, height: 300 }] },
    { protectedRects: [{ x: 100, y: NaN, width: 20, height: 40 }] }]) {
    assert.equal(placeMosaicMissionObjectLabel({ ...base, ...change }), null);
  }
});

test('separate prop painting emits no cartouches and one label pass draws only its selected state', () => {
  const objects = [
    { kind: 'recover', sourceType: 'marker', completed: true, x: 500, y: 400, propName: 'Lampe récupérée', statusLabel: 'Récupéré' },
    { kind: 'beacon', sourceType: 'marker', active: true, x: 550, y: 410, propName: 'Poste de veille', statusLabel: 'Déposer la lampe' }
  ];
  const before = structuredClone(objects), { ctx, calls, state, stack } = observedCanvas();
  const initialCanvas = { ...state }, viewport = { x: 200, y: 150, width: 720, height: 540 };
  for (const object of objects) drawMosaicMissionObjectProp(ctx, object, 30, true, true);
  assert.equal(calls.filter(call => call[0] === 'fillRect' && call[1] === 'rgba(5,12,18,0.94)').length, 0);
  assert.equal(calls.filter(call => call[0] === 'fillText').length, 0);
  const candidate = selectMosaicMissionObjectLabel(objects, { x: 510, y: 420 }, { viewport });
  const rect = drawMosaicMissionObjectLabel(ctx, candidate, { viewport,
    protectedRects: [{ x: 465, y: 342, width: 100, height: 110 }] });
  const labels = calls.filter(call => call[0] === 'fillRect' && call[1] === 'rgba(5,12,18,0.94)');
  assert.equal(labels.length, 1);
  assert.deepEqual(labels[0].slice(2), [rect.x, rect.y, rect.width, rect.height]);
  assert.ok(calls.some(call => call[0] === 'fillText' && call[2] === 'Poste de veille'));
  assert.ok(calls.some(call => call[0] === 'fillText' && call[2] === 'Déposer la lampe'));
  assert.ok(!calls.some(call => call[0] === 'fillText' && call[2] === 'Lampe récupérée'));
  assert.deepEqual(objects, before);
  assert.equal(stack.length, 0);
  assert.deepEqual(state, initialCanvas);
});

test('narrow labels retain their complete source text without overflowing their measured rectangle', () => {
  const { ctx, calls } = observedCanvas();
  const object = { x: 70, y: 200, propName: 'Sonde N4 conservée', statusLabel: 'Rétablissementsansraccourcinioubli', completed: true };
  const viewport = { x: 0, y: 0, width: 160, height: 400 };
  const rect = drawMosaicMissionObjectLabel(ctx, object, { viewport });
  assert.ok(rect && within(rect, viewport));
  const text = calls.filter(call => call[0] === 'fillText');
  assert.equal(text.map(call => call[2]).join('').replaceAll(' ', ''), `${object.propName}${object.statusLabel}`.replaceAll(' ', ''));
  assert.ok(text.every(call => ctx.measureText(call[2]).width <= rect.width - 14));
  assert.ok(text.every(call => call[3] >= rect.x && call[3] <= rect.x + rect.width
    && call[4] > rect.y && call[4] < rect.y + rect.height));
});

test('choosing and drawing a completed operation leaves saved receipts and collision footprints unchanged', () => {
  const progress = finish(c, startMosaicCharacterMission(normalizeMosaicCharacterMissions(), first).progress, first);
  const live = scene(c, progress), objects = getMosaicCharacterMissionWorldObjects(progress, c.missions, live.zones);
  const before = structuredClone({ progress, objects, props: getMosaicCharacterMissionPropZones(objects, live.zones) });
  const object = objects[0], player = { x: object.x + 60, y: object.y + 30 };
  const viewport = { x: object.x - 300, y: object.y - 250, width: 720, height: 540 };
  const { ctx } = observedCanvas();
  for (const prop of objects) drawMosaicMissionObjectProp(ctx, prop, 30, true, true);
  const selected = selectMosaicMissionObjectLabel(objects, player, { viewport });
  assert.ok(selected?.completed);
  drawMosaicMissionObjectLabel(ctx, selected, { viewport, protectedRects: [{ x: player.x - 48, y: player.y - 60, width: 96, height: 124 }] });
  assert.deepEqual({ progress, objects, props: getMosaicCharacterMissionPropZones(objects, live.zones) }, before);
});

test('new narrative definitions retain all legacy mission and step identities', () => {
  assert.deepEqual(MOSAIC_CHARACTER_MISSIONS.slice(0, MOSAIC_CHARACTER_MISSION_LEGACY.length).map(item => item.id),
    MOSAIC_CHARACTER_MISSION_LEGACY.map(item => item.id));
  for (const legacy of MOSAIC_CHARACTER_MISSION_LEGACY) {
    const mission = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === legacy.id);
    assert.equal(mission.heroId, legacy.heroId); assert.equal(mission.universe, legacy.universe);
    assert.deepEqual(mission.steps.map(step => [step.id, step.type, step.targetId]), legacy.steps.map(step => [step.id, step.type, step.targetId]));
    const choices = mission.steps.find(step => step.type === 'decision').choices;
    assert.deepEqual(choices.map(choice => [choice.id, choice.valid]), legacy.steps.find(step => step.type === 'decision').choices.map(choice => [choice.id, choice.valid]));
  }
});
