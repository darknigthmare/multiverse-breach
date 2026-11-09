import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB, EQUIP_ITEMS_DB } from '../src/game/heroes.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { getMosaicExhibits, getMosaicExhibitZones } from '../src/game/mosaicExhibits.js';
import { getMosaicZoneAnchor, resolveMosaicInteraction } from '../src/game/mosaicCityRuntime.js';
import { getMosaicCharacterMissionCatalog, getMosaicCharacterMissionObjective, getMosaicCharacterMissionZones,
  getMosaicCharacterMissionWorldObjects, getMosaicCharacterMissionCargo, normalizeMosaicCharacterMissions,
  startMosaicCharacterMission, advanceMosaicCharacterMission, resolveMosaicCharacterMission } from '../src/game/mosaicCharacterMissions.js';
import { drawMosaicMissionCargo } from '../src/game/mosaicMissionCargo.js';
import { drawMosaicMissionObject } from '../src/game/mosaicMissionOperations.js';

const universe = 'Nexus de Convergence';
const district = { id: 'universe-nexus-de-convergence', universe, worldW: 1920, worldH: 1180 };
const residents = HEROES_DB.filter(hero => hero.universe === universe);
const exhibits = getMosaicExhibits(EQUIP_ITEMS_DB, universe);
const anchor = { id: `${district.id}-core`, universe, action: 'anchor', x: 760, y: 875, w: 400, h: 150 };
const catalog = getMosaicCharacterMissionCatalog({ district, residents, exhibits, anchor,
  unlockedHeroIds: ['player_anchor', ...residents.map(hero => hero.id)] });
const deliveries = catalog.filter(mission => mission.contentFile === 'src/game/mosaicCityDeliveries.js');
const baseZones = [anchor, ...getMosaicExhibitZones(district, exhibits)];
const npcs = residents.map((hero, index) => ({ hero, x: 600 + 30 * index, y: 520 }));
const objective = (progress, mission) => getMosaicCharacterMissionObjective(progress, mission);
function interaction(progress, mission) {
  const current = objective(progress, mission), zones = [...baseZones, ...getMosaicCharacterMissionZones(progress, catalog)];
  const position = current.targetType === 'npc' ? npcs.find(npc => npc.hero.id === current.targetId)
    : getMosaicZoneAnchor(zones.find(zone => zone.id === current.targetId));
  return resolveMosaicInteraction(position, { npcs, zones }, { type: current.targetType, id: current.targetId });
}
function step(progress, mission, route = 0) {
  const current = objective(progress, mission).step;
  const result = current.type === 'decision'
    ? resolveMosaicCharacterMission(progress, mission, current.choices.filter(choice => choice.valid)[route].id)
    : advanceMosaicCharacterMission(progress, mission, interaction(progress, mission));
  assert.equal(result.changed, true, `${mission.id}/${current.id}: ${result.feedback}`);
  return result.progress;
}
function finish(progress, mission, route = 0) {
  for (let count = 0; count < 32 && objective(progress, mission).status === 'active'; count++) progress = step(progress, mission, route);
  assert.equal(objective(progress, mission).status, 'completed');
  return progress;
}
function start(mission, route = 0, progress = normalizeMosaicCharacterMissions()) {
  if (mission.requiresMissionId && !progress.records[mission.requiresMissionId]?.completed) {
    const parent = catalog.find(candidate => candidate.id === mission.requiresMissionId);
    progress = finish(start(parent, route, progress), parent, route);
  }
  const result = startMosaicCharacterMission(progress, mission);
  assert.equal(result.changed, true);
  return result.progress;
}
function beforeTake(mission, route = 0, progress) {
  progress = start(mission, route, progress);
  for (let count = 0; count < 32 && objective(progress, mission).step?.cargo?.action !== 'take'; count++) progress = step(progress, mission, route);
  assert.equal(objective(progress, mission).step.cargo.action, 'take');
  return progress;
}
function roundTrip(progress) {
  const core = sanitizeSaveCore(JSON.parse(JSON.stringify({ gold: 57, inventory: ['existing-item'],
    activityProgress: { mosaicCharacterMissions: progress } })));
  assert.equal(core.gold, 57); assert.deepEqual(core.inventory, ['existing-item']);
  assert.deepEqual(core.activityProgress.mosaicCharacterMissions, progress);
  return normalizeMosaicCharacterMissions(core.activityProgress.mosaicCharacterMissions);
}

for (const mission of deliveries) for (const origin of [0, 1]) for (const route of [0, 1]) {
  test(`${mission.id}: origin ${origin}, choice ${route}, physical carrying and return to the resident`, () => {
    let progress = start(mission, origin), taken = 0, delivered = 0;
    const expectedPairs = mission.heroId === 'arca_quillon' ? 2 : 1;
    for (let count = 0; count < 32 && objective(progress, mission).status === 'active'; count++) {
      const current = objective(progress, mission).step, cargo = current.cargo;
      const held = getMosaicCharacterMissionCargo(progress);
      if (cargo?.action === 'take') { assert.equal(held, null); taken++; }
      if (cargo?.action === 'deliver') { assert.equal(held.id, cargo.id); assert.equal(held.missionId, mission.id); delivered++; }
      progress = step(progress, mission, route);
      const after = getMosaicCharacterMissionCargo(progress);
      if (cargo?.action === 'take') {
        assert.equal(after.id, cargo.id); assert.equal(after.label, cargo.label.fr);
        assert.equal(getMosaicCharacterMissionCargo(progress, 'en').label, cargo.label.en);
        const paused = { ...progress, activeId: null };
        assert.deepEqual(getMosaicCharacterMissionCargo(paused), after, 'A journal selection cannot drop the object');
        assert.deepEqual(getMosaicCharacterMissionCargo(roundTrip(paused)), after, 'The object survives remount while paused');
      }
      if (cargo?.action === 'deliver') assert.equal(after, null);
      progress = roundTrip(progress);
    }
    assert.equal(objective(progress, mission).status, 'completed');
    assert.equal(taken, expectedPairs); assert.equal(delivered, expectedPairs);
    assert.equal(getMosaicCharacterMissionCargo(progress), null);
    assert.equal(mission.steps.at(-1).targetId, mission.heroId);
    const receipts = Object.values(progress.records[mission.id].operationReceipts).filter(receipt => receipt.cargoId);
    assert.equal(receipts.length, expectedPairs * 2);
    assert.equal(new Set(receipts.map(receipt => receipt.sequence)).size, receipts.length);
    assert.equal(startMosaicCharacterMission(progress, mission).changed, false);
  });
}

test('the four additions keep their actual preceding chapter and each has a distinct personal request', () => {
  assert.equal(deliveries.length, 4);
  assert.equal(new Set(deliveries.map(mission => mission.request.fr)).size, 4);
  for (const mission of deliveries) {
    const parent = catalog.find(candidate => candidate.id === mission.requiresMissionId);
    assert.equal(mission.heroId, parent.heroId);
    assert.equal(mission.chapter, (parent.chapter || 1) + 1);
    assert.equal(objective(normalizeMosaicCharacterMissions(), mission).status, 'locked');
  }
});

test('a remote click, altered marker geometry and the journal cannot pick up an object', () => {
  const mission = deliveries[0], progress = beforeTake(mission), before = JSON.stringify(progress);
  const valid = interaction(progress, mission);
  for (const invalid of [null, { ...valid, distance: 72.001 }, { ...valid, id: 'other' },
    { ...valid, target: { ...valid.target, x: valid.target.x + 1 } },
    { ...valid, target: { ...valid.target, missionId: deliveries[1].id } },
    { ...valid, target: { ...valid.target, universe: 'Halo' } }]) {
    assert.equal(advanceMosaicCharacterMission(progress, mission, invalid).changed, false);
    assert.equal(getMosaicCharacterMissionCargo(progress), null);
  }
  getMosaicCharacterMissionWorldObjects(progress, catalog, baseZones);
  assert.equal(JSON.stringify(progress), before);
});

test('one object occupies the carrying slot until its own delivery, including across mission changes', () => {
  const first = deliveries[0], second = deliveries[1];
  let progress = beforeTake(first);
  progress = step(progress, first);
  const held = getMosaicCharacterMissionCargo(progress);
  progress = beforeTake(second, 0, progress);
  const before = JSON.stringify(progress), blocked = advanceMosaicCharacterMission(progress, second, interaction(progress, second));
  assert.equal(blocked.reason, 'cargo_occupied'); assert.equal(blocked.changed, false);
  assert.ok(blocked.feedback.includes(held.label)); assert.equal(JSON.stringify(blocked.progress), before);
  assert.deepEqual(getMosaicCharacterMissionCargo(progress), held);
  progress = startMosaicCharacterMission(progress, first).progress;
  progress = step(progress, first);
  assert.equal(getMosaicCharacterMissionCargo(progress), null);
  progress = startMosaicCharacterMission(progress, second).progress;
  progress = step(progress, second);
  assert.equal(getMosaicCharacterMissionCargo(progress).missionId, second.id);
});

test('delivery requires the matching pickup receipt, not merely a completed step or another resident’s object', () => {
  const mission = deliveries[0];
  const waiting = step(beforeTake(mission), mission);
  const held = getMosaicCharacterMissionCargo(waiting), takeId = held.stepId;
  const valid = interaction(waiting, mission);
  for (const change of [null, { cargoId: 'quillon-spare-rotor' }, { cargoAction: 'deliver' },
    { missionId: deliveries[1].id }, { sequence: 0 }, { districtId: 'other-district' },
    { originChoiceId: waiting.records[mission.id].originChoiceId === 'apply' ? 'hold' : 'apply' },
    { x: 1 }, { version: 99 }]) {
    const altered = structuredClone(waiting);
    if (change) Object.assign(altered.records[mission.id].operationReceipts[takeId], change);
    else delete altered.records[mission.id].operationReceipts[takeId];
    const before = JSON.stringify(altered);
    assert.equal(getMosaicCharacterMissionCargo(altered), null);
    const result = advanceMosaicCharacterMission(altered, mission, valid);
    assert.equal(result.reason, 'cargo_missing'); assert.equal(result.changed, false);
    assert.equal(JSON.stringify(result.progress), before);
  }
  const delivered = step(waiting, mission), stale = structuredClone(delivered);
  delete stale.records[mission.id].operationReceipts['place-watch-lamp'];
  assert.deepEqual(getMosaicCharacterMissionCargo(stale), held, 'A missing delivery cannot silently discard a carried object');
});

test('unknown DLC progress and archived receipts are preserved without creating cargo', () => {
  const mission = deliveries[0], carrying = step(beforeTake(mission), mission);
  const source = carrying.records[mission.id];
  const progress = normalizeMosaicCharacterMissions({ records: {
    'absent-dlc-mission': { heroId: 'absent-hero', universe: 'Absent pack', districtId: 'absent-district',
      completedStepIds: [], choiceId: null, completed: false, futureReceipt: source.operationReceipts },
    [mission.id]: { ...source, completedStepIds: [], operationReceipts: {}, previousStory: source }
  } });
  assert.equal(getMosaicCharacterMissionCargo(progress), null);
  assert.deepEqual(roundTrip(progress), progress);
});

test('carried silhouettes follow the avatar transform, display the item and do not mutate the save', () => {
  for (const mission of [...deliveries, catalog.find(item => item.id === 'city-bastion-bulwark-relief-v1')]) {
    const progress = step(beforeTake(mission), mission), cargo = getMosaicCharacterMissionCargo(progress);
    const original = JSON.stringify(progress), drawings = [];
    for (const player of [{ x: 500, y: 620 }, { x: 580, y: 710 }]) {
      const calls = [], context = new Proxy({ measureText: value => ({ width: value.length * 6 }) }, {
        get(target, name) { return target[name] || ((...args) => calls.push([name, ...args])); },
        set(target, name, value) { target[name] = value; calls.push([name, value]); return true; }
      });
      drawMosaicMissionCargo(context, cargo, player, 44, true);
      assert.deepEqual(calls.find(call => call[0] === 'translate'), ['translate', player.x, player.y]);
      assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === cargo.label));
      assert.deepEqual(calls.at(-1), ['restore']); drawings.push(calls);
    }
    assert.notDeepEqual(drawings[0], drawings[1]);
    assert.equal(JSON.stringify(progress), original);
  }
});

test('the repaired pump visibly gains water and the lamp, reflector and brace retain their own silhouettes', () => {
  const snapshots = new Map();
  for (const appearance of ['lamp', 'pump', 'rotor', 'probe', 'reflector', 'brace']) {
    const calls = [], context = new Proxy({ measureText: value => ({ width: value.length * 6 }) }, {
      get(target, name) { return target[name] || ((...args) => calls.push([name, ...args])); },
      set(target, name, value) { target[name] = value; calls.push([name, value]); return true; }
    });
    drawMosaicMissionObject(context, { appearance, sourceType: 'marker', kind: 'beacon', completed: true,
      x: 500, y: 600, propName: appearance, statusLabel: 'En service' }, 45, true, true);
    snapshots.set(appearance, JSON.stringify(calls));
    if (appearance === 'pump') assert.ok(calls.some(call => call[0] === 'fillStyle' && call[1] === '#4aa7c6'));
  }
  assert.equal(new Set(snapshots.values()).size, 6);
});

test('an absent DLC receipt at MAX_SAFE_INTEGER is preserved without breaking a real pickup and delivery', () => {
  const mission = deliveries[0];
  let progress = beforeTake(mission);
  const unknown = { heroId: 'absent-hero', universe: 'Absent pack', districtId: 'absent-district',
    completedStepIds: [], choiceId: null, completed: false,
    operationReceipts: { future: { sequence: Number.MAX_SAFE_INTEGER, futureField: 'retain unchanged' } } };
  progress.records['absent-dlc-mission'] = structuredClone(unknown);
  progress = step(progress, mission);
  const carried = getMosaicCharacterMissionCargo(progress);
  assert.equal(carried.id, 'mirelle-watch-lamp');
  assert.ok(Number.isSafeInteger(carried.sequence));
  assert.deepEqual(progress.records['absent-dlc-mission'], unknown);
  progress = roundTrip(progress);
  progress = step(progress, mission);
  assert.equal(getMosaicCharacterMissionCargo(progress), null);
  assert.deepEqual(progress.records['absent-dlc-mission'], unknown);
  const delivery = progress.records[mission.id].operationReceipts['place-watch-lamp'];
  assert.ok(Number.isSafeInteger(delivery.sequence) && delivery.sequence > carried.sequence);
});

test('a validated known receipt at MAX_SAFE_INTEGER refuses the next pickup before consuming its step', () => {
  const mission = deliveries[0], progress = beforeTake(mission);
  const receipt = Object.values(progress.records[mission.id].operationReceipts)[0];
  assert.ok(receipt && receipt.missionId === mission.id, 'prepare a genuine preceding operation');
  receipt.sequence = Number.MAX_SAFE_INTEGER;
  const before = structuredClone(progress), target = interaction(progress, mission);
  const result = advanceMosaicCharacterMission(progress, mission, target);
  assert.equal(result.changed, false);
  assert.deepEqual(result.progress, before);
  assert.equal(objective(result.progress, mission).step.id, 'take-watch-lamp');
  assert.equal(getMosaicCharacterMissionCargo(result.progress), null);
  assert.equal(result.progress.records[mission.id].operationReceipts['take-watch-lamp'], undefined);
});

test('the four residents retain distinct material results together after their stories and a save reload', () => {
  let progress = normalizeMosaicCharacterMissions();
  for (const mission of deliveries) progress = finish(start(mission, 0, progress), mission);
  progress = roundTrip(progress);
  const world = getMosaicCharacterMissionWorldObjects(progress, catalog, baseZones);
  for (const [mission, stepId] of deliveries.map(mission => [mission, ({
    arca_mirelle: 'watch-through-outage', arca_quillon: 'fill-refuge-container',
    arca_nadir: 'bring-n4-to-table', arca_tessera: 'check-chosen-light'
  })[mission.heroId]])) {
    assert.ok(world.some(object => object.missionId === mission.id && object.stepId === stepId && object.completed),
      `${mission.heroId}'s physical result must survive other residents' adventures`);
  }
});

test('Mirelle’s installed lamp stays lit while the uncompleted outage check is active', () => {
  const mission = deliveries.find(item => item.heroId === 'arca_mirelle');
  let progress = start(mission);
  while (objective(progress, mission).step.id !== 'watch-through-outage') progress = step(progress, mission);
  const objects = getMosaicCharacterMissionWorldObjects(progress, catalog, baseZones);
  const lamp = objects.find(object => object.missionId === mission.id && object.stepId === 'watch-through-outage');
  assert.equal(lamp.active, true); assert.equal(lamp.completed, false); assert.equal(lamp.powered, true);
  assert.equal(progress.records[mission.id].operationReceipts['watch-through-outage'], undefined);
  const calls = [], ctx = new Proxy({ measureText: value => ({ width: value.length * 6 }) }, {
    get(target, name) { return target[name] || ((...args) => calls.push([name, ...args])); },
    set(target, name, value) { target[name] = value; calls.push([name, value]); return true; }
  });
  drawMosaicMissionObject(ctx, lamp, 50, true, true);
  assert.ok(calls.some(call => call[0] === 'fillStyle' && call[1] === '#ffe4a3'));
  const missing = structuredClone(progress);
  delete missing.records[mission.id].operationReceipts['place-watch-lamp'];
  const withoutDeposit = getMosaicCharacterMissionWorldObjects(missing, catalog, baseZones)
    .find(object => object.missionId === mission.id && object.stepId === 'watch-through-outage');
  assert.equal(withoutDeposit.powered, undefined, 'A menu or a missing delivery cannot light the lamp');
  progress = step(progress, mission);
  assert.equal(getMosaicCharacterMissionWorldObjects(progress, catalog, baseZones)
    .find(object => object.missionId === mission.id && object.stepId === 'watch-through-outage').completed, true);
});
