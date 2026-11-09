import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB, EQUIP_ITEMS_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { getMosaicExhibits, getMosaicExhibitZones } from '../src/game/mosaicExhibits.js';
import { advanceMosaicPlayer, getMosaicZoneAnchor, getMosaicSceneObstacles, resolveMosaicInteraction } from '../src/game/mosaicCityRuntime.js';
import { MOSAIC_CHARACTER_MISSIONS, getMosaicCharacterMissionCatalog, normalizeMosaicCharacterMissions,
  getMosaicCharacterMissionObjective, getMosaicCharacterMissionZones, startMosaicCharacterMission,
  advanceMosaicCharacterMission, resolveMosaicCharacterMission, getMosaicCharacterMissionWorldObjects,
  getMosaicCharacterMissionPropZones, advanceMosaicCharacterMissionWalk } from '../src/game/mosaicCharacterMissions.js';
import { getMosaicMissionWalkSpec, getMosaicMissionWalkProgress, recordMosaicMissionWalk } from '../src/game/mosaicMissionWalks.js';

function contextFor(universe) {
  const residents = HEROES_DB.filter(hero => hero.universe === universe);
  const unlockedHeroIds = [createPlayerHero().id, ...residents.map(hero => hero.id)];
  const slug = universe === 'Nexus de Convergence' ? 'nexus-de-convergence' : universe.toLowerCase();
  const district = { id: `universe-${slug}`, universe, worldW: 1920, worldH: 1180, place: { type: 'city' } };
  const exhibits = getMosaicExhibits(EQUIP_ITEMS_DB, universe);
  const anchor = { id: `${district.id}-core`, universe, action: 'anchor', x: 760, y: 875, w: 400, h: 150 };
  return { district, residents, exhibits, anchor, unlockedHeroIds };
}
const context = contextFor('Nexus de Convergence');
const { exhibits, anchor, unlockedHeroIds: owned } = context;
const catalog = getMosaicCharacterMissionCatalog(context);
const allCatalog = ['Nexus de Convergence', 'Halo', 'Alien'].flatMap(universe => getMosaicCharacterMissionCatalog(contextFor(universe)));
function sceneFor(progress, mission) {
  const { district, anchor, residents, exhibits } = contextFor(mission.universe);
  const objective = getMosaicCharacterMissionObjective(progress, mission);
  const zones = [anchor, ...getMosaicExhibitZones(district, exhibits), ...getMosaicCharacterMissionZones(progress, allCatalog)];
  const objects = getMosaicCharacterMissionWorldObjects(progress, allCatalog, zones);
  return { zones, propZones: getMosaicCharacterMissionPropZones(objects, zones),
    npcs: residents.map((hero, index) => ({ hero, x: 720 + index * 38, y: 520 })), objective };
}
function resolved(progress, mission) {
  const scene = sceneFor(progress, mission), { targetId: id, targetType: type } = scene.objective;
  const target = type === 'npc' ? scene.npcs.find(npc => npc.hero.id === id) : getMosaicZoneAnchor(scene.zones.find(zone => zone.id === id));
  return resolveMosaicInteraction(target, scene, { type, id });
}

test('every Nexus identity and both DLC senders have distinct authored bilingual contracts', () => {
  assert.deepEqual(new Set(catalog.map(mission => mission.heroId)), new Set(owned));
  assert.equal(catalog.filter(mission => !mission.requiresMissionId).length, owned.length);
  assert.equal(catalog.filter(mission => mission.requiresMissionId).length, owned.length + 8);
  assert.equal(new Set(allCatalog.map(mission => mission.id)).size, allCatalog.length);
  assert.deepEqual(new Set(allCatalog.map(mission => mission.id)), new Set(MOSAIC_CHARACTER_MISSIONS.map(mission => mission.id)));
  for (const mission of allCatalog) {
    const { residents, exhibits, unlockedHeroIds } = contextFor(mission.universe);
    assert.ok(unlockedHeroIds.includes(mission.heroId));
    assert.equal(new Set(mission.steps.map(step => step.id)).size, mission.steps.length);
    const ending = mission.steps.at(-1);
    if (['src/game/mosaicCityDeliveries.js', 'src/game/mosaicCityRoutes.js'].includes(mission.contentFile)) {
      assert.equal(ending.type, 'npc'); assert.equal(ending.targetId, mission.heroId === 'player_anchor' ? 'arca_mirelle' : mission.heroId);
      assert.ok(ending.dialogue.fr && ending.dialogue.en);
    } else assert.equal(ending.type, 'anchor');
    assert.ok(mission.source.startsWith(mission.universe === 'Nexus de Convergence' ? 'src/game/' : `DLC/${mission.universe}/data/`));
    for (const step of mission.steps) {
      assert.ok(step.text.fr.length > 10 && step.text.en.length > 10);
      if (step.type === 'npc') assert.ok(residents.some(hero => hero.id === step.targetId));
      if (step.type === 'exhibit') assert.ok(exhibits.some(item => item.id === step.targetId));
      if (step.type === 'decision') {
        assert.equal(step.choices.filter(item => item.valid).length, 2);
        assert.equal(step.choices.filter(item => !item.valid).length, 1);
        for (const item of step.choices) assert.ok(item.result.fr && item.result.en && item.label.fr && item.label.en);
      }
    }
  }
});
test('DLC cases remain in their own districts and respect the exact owned incarnation', () => {
  for (const [universe, heroId] of [['Halo', 'masterchief'], ['Alien', 'ripley']]) {
    const ownContext = contextFor(universe);
    const cases = getMosaicCharacterMissionCatalog({ ...ownContext, unlockedHeroIds: [heroId] });
    assert.equal(cases.length, 2);
    assert.ok(cases.every(mission => mission.universe === universe && mission.heroId === heroId));
    assert.equal(getMosaicCharacterMissionCatalog({ ...ownContext, unlockedHeroIds: ['ripley_aliens'] }).length, 0);
    assert.equal(getMosaicCharacterMissionCatalog({ ...ownContext, residents: ownContext.residents.filter(hero => hero.id !== heroId) }).length, 0);
    assert.equal(getMosaicCharacterMissionCatalog({ ...ownContext, anchor: { ...ownContext.anchor, universe: 'Nexus de Convergence' } }).length, 0);
    assert.ok(cases.every(mission => mission.continuity.fr && mission.continuity.en));
  }
});
test('availability requires current district, owned sender, residents and every required exhibit', () => {
  assert.equal(getMosaicCharacterMissionCatalog({ ...context, unlockedHeroIds: [] }).length, 0);
  assert.equal(getMosaicCharacterMissionCatalog({ ...context, district: { ...context.district, universe: 'Halo' } }).length, 0);
  assert.equal(getMosaicCharacterMissionCatalog({ ...context, anchor: { ...anchor, action: 'talk' } }).length, 0);
  assert.deepEqual(new Set(getMosaicCharacterMissionCatalog({ ...context, unlockedHeroIds: ['player_anchor'] }).map(mission => mission.heroId)), new Set(['player_anchor']));
  const removed = getMosaicCharacterMissionCatalog({ ...context, exhibits: exhibits.filter(item => item.id !== 'nexus_anchor_coil') });
  assert.ok(!removed.some(mission => !mission.requiresMissionId && ['player_anchor', 'arca_mirelle'].includes(mission.heroId)));
  assert.ok(removed.some(mission => mission.heroId === 'arca_sable'));
});
function finishedPrerequisite(mission, route) {
  let progress = normalizeMosaicCharacterMissions();
  if (!mission.requiresMissionId) return progress;
  const previous = allCatalog.find(item => item.id === mission.requiresMissionId);
  assert.ok(previous, 'The prerequisite must be a real, available source contract');
  progress = finishedPrerequisite(previous, route);
  progress = startMosaicCharacterMission(progress, previous).progress;
  for (const step of previous.steps) {
    progress = step.type === 'decision'
      ? resolveMosaicCharacterMission(progress, previous, step.choices.filter(item => item.valid)[route].id).progress
      : advanceMosaicCharacterMission(progress, previous, resolved(progress, previous)).progress;
  }
  assert.equal(progress.records[previous.id].completed, true);
  return progress;
}
for (const mission of allCatalog) {
  for (const originRoute of mission.requiresMissionId ? [0, 1] : [null]) {
  for (const route of [0, 1]) test(`${mission.id}: origin ${originRoute}, physical steps, conclusion ${route + 1}, saved receipt and repeat refusal`, () => {
    const { district, anchor } = contextFor(mission.universe);
    let progress = startMosaicCharacterMission(finishedPrerequisite(mission, originRoute), mission).progress;
    const state = { player: { x: 820, y: 760, speed: 2.35 }, keys: {}, npcs: [], obstacles: [] };
    let moved = 0;
    for (let index = 0; index < mission.steps.length; index++) {
      let { objective, zones, propZones, npcs } = sceneFor(progress, mission);
      assert.equal(objective.index, index);
      assert.equal(progress.records[mission.id].completed, false);
      if (objective.step.type === 'decision') {
        const before = JSON.stringify(progress), invalid = objective.step.choices.find(item => !item.valid);
        const wrong = resolveMosaicCharacterMission(progress, mission, invalid.id);
        assert.equal(wrong.changed, false); assert.equal(JSON.stringify(wrong.progress), before);
        progress = resolveMosaicCharacterMission(progress, mission, objective.step.choices.filter(item => item.valid)[route].id).progress;
      } else {
        if (objective.walk) {
          const previousSteps = [...progress.records[mission.id].completedStepIds];
          const beforeWalk = JSON.stringify(progress);
          assert.equal(advanceMosaicCharacterMission(progress, mission, resolved(progress, mission)).reason, 'walk_pending');
          assert.equal(JSON.stringify(progress), beforeWalk, 'an interaction alone cannot invent a route');
          while (!getMosaicCharacterMissionObjective(progress, mission).walk.completed) {
            const currentScene = sceneFor(progress, mission), target = currentScene.objective.walk.next;
            state.npcs = currentScene.npcs;
            state.obstacles = getMosaicSceneObstacles(district, [...currentScene.zones, ...currentScene.propZones]);
            state.destination = { x: target.x, y: target.y }; state.destinationRoute = null;
            state.pendingInteraction = { type: 'zone', id: currentScene.objective.targetId };
            let earned = false;
            for (let tick = 0; tick < 1600 && !earned; tick++) {
              const from = { x: state.player.x, y: state.player.y };
              const distance = advanceMosaicPlayer(state, district, 1000 / 60);
              moved += distance;
              const result = advanceMosaicCharacterMissionWalk(progress, mission,
                { districtId: district.id, from, to: state.player, distance, elapsedMs: 1000 / 60, speed: state.player.speed });
              if (result.changed) { progress = result.progress; earned = true; }
            }
            assert.ok(earned, `${mission.id} ordinary walking must reach checkpoint ${target.id}`);
            assert.deepEqual(progress.records[mission.id].completedStepIds, previousSteps);
            const savedWalk = getMosaicCharacterMissionObjective(progress, mission).walk;
            const restored = normalizeMosaicCharacterMissions(sanitizeSaveCore({ activityProgress: { mosaicCharacterMissions: progress } }).activityProgress.mosaicCharacterMissions);
            assert.deepEqual(getMosaicCharacterMissionObjective(restored, mission).walk, savedWalk);
            progress = restored;
          }
          ({ objective, zones, propZones, npcs } = sceneFor(progress, mission));
        }
        const preferred = { type: objective.targetType, id: objective.targetId };
        state.npcs = npcs; state.obstacles = getMosaicSceneObstacles(district, [...zones, ...propZones]);
        state.destination = preferred.type === 'npc' ? npcs.find(npc => npc.hero.id === preferred.id) : getMosaicZoneAnchor(zones.find(zone => zone.id === preferred.id));
        state.pendingInteraction = preferred;
        let interaction = resolveMosaicInteraction(state.player, { zones, npcs }, preferred);
        for (let tick = 0; tick < 1600 && !interaction; tick++) {
          const distance = advanceMosaicPlayer(state, district, 1000 / 60);
          assert.ok(distance <= 2.35 + 1e-7);
          moved += distance;
          interaction = resolveMosaicInteraction(state.player, { zones, npcs }, preferred);
        }
        assert.ok(interaction, `ordinary walking must reach ${objective.step.id}`);
        const next = advanceMosaicCharacterMission(progress, mission, interaction);
        assert.equal(next.changed, true); progress = next.progress;
      }
      // Preserve state through the real save sanitizer at every checkpoint.
      const save = sanitizeSaveCore(JSON.parse(JSON.stringify({ gold: 37, inventory: ['retained'], activityProgress: { mosaicCharacterMissions: progress } })));
      assert.equal(save.gold, 37); assert.deepEqual(save.inventory, ['retained']);
      assert.deepEqual(save.activityProgress.mosaicCharacterMissions, progress);
      progress = normalizeMosaicCharacterMissions(save.activityProgress.mosaicCharacterMissions);
    }
    assert.ok(moved > 200);
    assert.equal(progress.activeId, null);
    assert.equal(getMosaicCharacterMissionObjective(progress, mission).status, 'completed');
    assert.equal(startMosaicCharacterMission(progress, mission).changed, false);
    assert.equal(advanceMosaicCharacterMission(progress, mission, { type: 'zone', id: anchor.id, target: anchor, distance: 0 }).changed, false);
    assert.equal(getMosaicCharacterMissionZones(progress, allCatalog).length, 0);
  });
  }
}

test('follow-ups require the full preceding report, preserve its choice, and change both physical destinations', () => {
  for (const mission of catalog.filter(item => item.requiresMissionId)) {
    const empty = normalizeMosaicCharacterMissions();
    assert.equal(getMosaicCharacterMissionObjective(empty, mission).status, 'locked');
    const refused = startMosaicCharacterMission(empty, mission);
    assert.equal(refused.reason, 'locked'); assert.equal(refused.progress, empty);
    assert.equal(getMosaicCharacterMissionZones({ ...empty, activeId: mission.id }, catalog).length, 0);
    const origins = [];
    for (const route of [0, 1]) {
      const completed = finishedPrerequisite(mission, route);
      const previous = completed.records[mission.requiresMissionId];
      const beforeReport = structuredClone(completed);
      beforeReport.records[mission.requiresMissionId].completedStepIds.pop();
      beforeReport.records[mission.requiresMissionId].completed = false;
      assert.equal(startMosaicCharacterMission(beforeReport, mission).reason, 'locked');
      let progress = startMosaicCharacterMission(completed, mission).progress;
      assert.deepEqual(progress.records[mission.requiresMissionId], previous);
      assert.equal(progress.records[mission.id].originChoiceId, previous.choiceId);
      progress = advanceMosaicCharacterMission(progress, mission, resolved(progress, mission)).progress;
      const zone = getMosaicCharacterMissionZones(progress, catalog)[0];
      assert.ok(zone); origins.push([zone.x, zone.y]);
      // Even a valid alternate receipt cannot silently rewrite an accepted route.
      const divergent = structuredClone(progress);
      divergent.records[mission.requiresMissionId] = finishedPrerequisite(mission, 1 - route).records[mission.requiresMissionId];
      assert.equal(getMosaicCharacterMissionObjective(divergent, mission).status, 'unavailable');
      assert.equal(startMosaicCharacterMission(divergent, mission).progress, divergent);
      const forged = structuredClone(completed);
      forged.records[mission.requiresMissionId].completedStepIds = ['report'];
      assert.equal(startMosaicCharacterMission(forged, mission).reason, 'locked');
      while (getMosaicCharacterMissionObjective(progress, mission).step.type !== 'decision') {
        progress = advanceMosaicCharacterMission(progress, mission, resolved(progress, mission)).progress;
      }
      const destinations = ['apply', 'hold'].map(choiceId => {
        const chosen = resolveMosaicCharacterMission(progress, mission, choiceId).progress;
        assert.equal(chosen.records[mission.id].completed, false, 'A choice alone is not a completed intervention');
        const target = getMosaicCharacterMissionZones(chosen, catalog)[0];
        assert.ok(target);
        const selected = getMosaicCharacterMissionObjective(chosen, mission).step;
        // A route can share its departure with the alternative. Its complete
        // ordered journey must still differ, not only the wording of a choice.
        return selected.walk ? selected.walk.points.map(point => [point.x, point.y]) : [target.x, target.y];
      });
      assert.notDeepEqual(destinations[0], destinations[1], 'Both decisions require different in-world checks');
    }
    assert.notDeepEqual(origins[0], origins[1], 'The previous ending must change the next physical route');
  }
});
test('remote, forged, mismatched and unordered interactions cannot record evidence', () => {
  const mission = catalog.find(item => item.heroId === 'arca_bastion');
  const progress = startMosaicCharacterMission(normalizeMosaicCharacterMissions(), mission).progress;
  const event = resolved(progress, mission);
  for (const invalid of [null, { id: event.id }, ...[undefined, -1, Infinity, NaN, 58.001].map(distance => ({ ...event, distance })),
    { ...event, id: 'other' }, { ...event, target: { ...event.target, hero: { ...event.target.hero, universe: 'Other' } } },
    { type: 'zone', id: anchor.id, target: anchor, distance: 0 }]) {
    assert.equal(advanceMosaicCharacterMission(progress, mission, invalid).changed, false);
  }
  assert.equal(resolveMosaicCharacterMission(progress, mission, 'name-debt').changed, false);
  assert.equal(advanceMosaicCharacterMission(normalizeMosaicCharacterMissions(), mission, event).changed, false);
});

function atNewRoute(choiceIndex = 0, missionId = 'city-anchor-shared-beacon-v1', originRoute = 0) {
  const mission = catalog.find(item => item.id === missionId);
  let progress = startMosaicCharacterMission(finishedPrerequisite(mission, originRoute), mission).progress;
  while (!getMosaicCharacterMissionObjective(progress, mission).walk) {
    const current = getMosaicCharacterMissionObjective(progress, mission).step;
    progress = current.type === 'decision'
      ? resolveMosaicCharacterMission(progress, mission, current.choices.filter(choice => choice.valid)[choiceIndex].id).progress
      : advanceMosaicCharacterMission(progress, mission, resolved(progress, mission)).progress;
  }
  return { mission, progress, step: getMosaicCharacterMissionObjective(progress, mission).step };
}

test('all route objects keep their mission and step identity at every checkpoint, across save and after the final operation', () => {
  for (const authored of catalog.filter(mission => mission.contentFile === 'src/game/mosaicCityRoutes.js')) {
    for (const origin of [0, 1]) for (const branch of [0, 1]) {
      let { mission, step, progress } = atNewRoute(branch, authored.id, origin);
      const expectedId = `${mission.id}::${step.id}`;
      const assertObject = (current, completed = false) => {
        const walk = getMosaicMissionWalkProgress(mission, step, current.records[mission.id]);
        for (const lang of ['fr', 'en']) {
          const object = getMosaicCharacterMissionWorldObjects(current, catalog, [], lang)
            .find(item => item.missionId === mission.id && item.stepId === step.id);
          assert.ok(object, `${expectedId} checkpoint ${walk.visited} must retain its world object`);
          assert.equal(object.id, expectedId);
          assert.equal(object.targetId, expectedId);
          assert.equal(object.sourceType, 'marker');
          assert.equal(object.universe, mission.universe);
          assert.equal(object.kind, step.operation.kind);
          assert.equal(object.label, step.operation.label[lang]);
          assert.equal(object.completedText, step.operation.completedText[lang]);
          assert.equal(object.appearance, step.operation.appearance);
          assert.equal(object.completed, completed);
          assert.equal(object.active, !completed);
          assert.equal(object.sequence, completed ? current.records[mission.id].operationReceipts[step.id].sequence : 0);
          assert.deepEqual({ x: object.x, y: object.y }, completed
            ? { x: step.x, y: step.y } : { x: walk.next.x, y: walk.next.y });
          assert.equal(object.propName, !completed && !walk.completed ? walk.next.label[lang] : step.operation.propName[lang]);
          assert.equal(object.statusLabel, completed ? lang === 'fr' ? 'Balisé' : 'Marked'
            : walk.completed ? step.operation.label[lang]
              : lang === 'fr' ? `Parcours ${walk.visited}/${walk.total} · rejoindre ce repère`
                : `Route ${walk.visited}/${walk.total} · reach this marker`);
        }
      };
      assertObject(progress);
      for (const point of step.walk.points) {
        const moved = advanceMosaicCharacterMissionWalk(progress, mission, {
          districtId: mission.districtId, from: { x: point.x - 2, y: point.y }, to: point,
          elapsedMs: 1000 / 60, distance: 2, speed: 2.35
        });
        assert.equal(moved.changed, true);
        progress = moved.progress;
        assertObject(progress);
        progress = normalizeMosaicCharacterMissions(sanitizeSaveCore({ activityProgress: {
          mosaicCharacterMissions: progress
        } }).activityProgress.mosaicCharacterMissions);
        assertObject(progress);
      }
      const completed = advanceMosaicCharacterMission(progress, mission, resolved(progress, mission));
      assert.equal(completed.changed, true);
      assertObject(completed.progress, true);
    }
  }
});

test('ordered reconnaissance rejects idle, remote, discontinuous, overlong and foreign movement samples without mutation', () => {
  const { mission, step, progress } = atNewRoute();
  const point = getMosaicMissionWalkSpec(step).points[0];
  const valid = { districtId: mission.districtId, from: { x: point.x - 2, y: point.y },
    to: { x: point.x, y: point.y }, elapsedMs: 1000 / 60, distance: 2, speed: 2.35 };
  const before = JSON.stringify(progress);
  const refused = [null, { ...valid, districtId: 'universe-halo' }, { ...valid, from: valid.to, distance: 0 },
    { ...valid, elapsedMs: 0 }, { ...valid, elapsedMs: 51 }, { ...valid, elapsedMs: NaN },
    { ...valid, from: { x: point.x - 900, y: point.y }, distance: 900 },
    { ...valid, distance: 3 }, { ...valid, speed: Infinity },
    { ...valid, from: { x: 0, y: 0 }, to: { x: 2, y: 0 } },
    { ...valid, from: { x: step.walk.points[1].x - 2, y: step.walk.points[1].y }, to: step.walk.points[1] }];
  for (const sample of refused) {
    assert.equal(advanceMosaicCharacterMissionWalk(progress, mission, sample).changed, false);
    assert.equal(JSON.stringify(progress), before);
  }
  for (const altered of [{ ...progress, activeId: null }, { ...progress, activeId: 'other-contract' }]) {
    assert.equal(advanceMosaicCharacterMissionWalk(altered, mission, valid).changed, false);
  }
  const result = advanceMosaicCharacterMissionWalk(progress, mission, valid);
  assert.equal(result.changed, true); assert.equal(result.walk.visited, 1);
  assert.equal(JSON.stringify(progress), before);
  assert.deepEqual(result.progress.records[mission.id].operationReceipts, progress.records[mission.id].operationReceipts);
  assert.deepEqual(result.progress.records[mission.id].completedStepIds, progress.records[mission.id].completedStepIds);
  assert.equal(advanceMosaicCharacterMissionWalk(result.progress, mission, valid).changed, false, 'the same place is not the next checkpoint');
});

test('route geometry, branch and inherited identity own checkpoints; incompatible receipts are retained but cannot illuminate a finished route', () => {
  const { mission, step, progress } = atNewRoute();
  const saved = progress.records[mission.id];
  let receipt = null;
  for (const point of step.walk.points) {
    receipt = recordMosaicMissionWalk(mission, step,
      { ...saved, walkReceipts: { [step.id]: receipt } },
      { districtId: mission.districtId, from: { x: point.x - 2, y: point.y }, to: point,
        elapsedMs: 1000 / 60, distance: 2, speed: 2.35 });
    assert.ok(receipt);
  }
  const complete = structuredClone(progress);
  complete.records[mission.id].walkReceipts = { [step.id]: receipt, futurePackWalk: { futureField: 'retained' } };
  const ready = getMosaicCharacterMissionObjective(complete, mission);
  assert.equal(ready.walk.completed, true);
  const result = advanceMosaicCharacterMission(complete, mission, resolved(complete, mission));
  assert.equal(result.changed, true);
  assert.deepEqual(result.progress.records[mission.id].operationReceipts[step.id].walkPointIds, step.walk.points.map(point => point.id));
  const completedObject = getMosaicCharacterMissionWorldObjects(result.progress, catalog).find(object => object.stepId === step.id);
  assert.equal(completedObject.completed, true);
  const invalidReceipts = [
    { ...receipt, missionId: 'other' }, { ...receipt, districtId: 'universe-halo' },
    { ...receipt, originChoiceId: 'ask-review' }, { ...receipt, originStoryRevision: 1 },
    { ...receipt, branchChoiceId: 'hold' }, { ...receipt, points: [...receipt.points].reverse() },
    { ...receipt, points: receipt.points.map((point, index) => index ? point : { ...point, x: point.x + 1 }) }
  ];
  for (const invalid of invalidReceipts) {
    const tampered = structuredClone(result.progress);
    tampered.records[mission.id].walkReceipts[step.id] = invalid;
    assert.equal(getMosaicMissionWalkProgress(mission, step, tampered.records[mission.id]).visited, 0);
    assert.ok(!getMosaicCharacterMissionWorldObjects(tampered, catalog).some(object => object.stepId === step.id && object.completed));
    assert.deepEqual(normalizeMosaicCharacterMissions(tampered).records[mission.id].walkReceipts, tampered.records[mission.id].walkReceipts);
  }
  const restored = normalizeMosaicCharacterMissions(sanitizeSaveCore({ activityProgress: { mosaicCharacterMissions: complete } }).activityProgress.mosaicCharacterMissions);
  assert.deepEqual(restored.records[mission.id].walkReceipts, complete.records[mission.id].walkReceipts);
  assert.equal(getMosaicCharacterMissionObjective({ ...restored, activeId: null }, mission).walk.visited, 4);
  assert.equal(recordMosaicMissionWalk(mission, step, complete.records[mission.id], { districtId: mission.districtId }), null);
});

test('malformed or overlapping walking places cannot turn a single presence into a route', () => {
  const { step } = atNewRoute();
  for (const walk of [null, { points: [] }, { points: [step.walk.points[0]] },
    { points: [...step.walk.points, ...step.walk.points] },
    { points: step.walk.points.map((point, index) => index === 1 ? { ...point, x: step.walk.points[0].x, y: step.walk.points[0].y } : point) },
    { points: step.walk.points.map((point, index) => index ? point : { ...point, label: { fr: 'Seul' } }) },
    { points: step.walk.points.map((point, index) => index ? point : { ...point, x: NaN }) }
  ]) assert.equal(getMosaicMissionWalkSpec({ ...step, walk }), null);
  assert.equal(getMosaicMissionWalkSpec({ ...step, type: 'npc' }), null);
  assert.equal(getMosaicMissionWalkSpec({ ...step, x: step.x + 1 }), null);
});
test('switching missions pauses one dossier without losing its completed steps or choices', () => {
  let progress = startMosaicCharacterMission(normalizeMosaicCharacterMissions(), catalog[0]).progress;
  progress = advanceMosaicCharacterMission(progress, catalog[0], resolved(progress, catalog[0])).progress;
  const first = structuredClone(progress.records[catalog[0].id]);
  progress = startMosaicCharacterMission(progress, catalog[1]).progress;
  assert.equal(getMosaicCharacterMissionObjective(progress, catalog[0]).status, 'paused');
  assert.equal(advanceMosaicCharacterMission(progress, catalog[0], resolved(progress, catalog[0])).changed, false);
  progress = startMosaicCharacterMission(progress, catalog[0]).progress;
  assert.deepEqual(progress.records[catalog[0].id], first);
});
test('unknown DLC records survive normalization; reordered steps and invalid conclusions cannot masquerade as completed', () => {
  const future = { heroId: 'future-guest', universe: 'Absent DLC', districtId: 'future-district', completedStepIds: ['welcome'], choiceId: null,
    completed: false, futureField: { keep: true } };
  const progress = normalizeMosaicCharacterMissions({ activeId: 'future-case', records: { 'future-case': future }, futureVersion: 4 });
  assert.deepEqual(progress.records['future-case'], future); assert.equal(progress.futureVersion, 4);
  const mission = catalog[0];
  for (const record of [
    { completedStepIds: ['report'], completed: true },
    { completedStepIds: mission.steps.map(step => step.id), completed: true, choiceId: 'replace-origin' },
    { completedStepIds: mission.steps.slice(0, 2).map(step => step.id), completed: true }
  ]) {
    const corrupt = normalizeMosaicCharacterMissions({ activeId: mission.id, records: { [mission.id]: {
      heroId: mission.heroId, universe: mission.universe, districtId: mission.districtId, ...record
    } } });
    assert.equal(getMosaicCharacterMissionObjective(corrupt, mission).status, 'unavailable');
    assert.equal(startMosaicCharacterMission(corrupt, mission).changed, false);
  }
  assert.equal(MOSAIC_CHARACTER_MISSIONS.length, allCatalog.length);
});
