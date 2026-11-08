import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB, EQUIP_ITEMS_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { getMosaicExhibits, getMosaicExhibitZones } from '../src/game/mosaicExhibits.js';
import { advanceMosaicPlayer, getMosaicZoneAnchor, getMosaicSceneObstacles, resolveMosaicInteraction } from '../src/game/mosaicCityRuntime.js';
import { MOSAIC_CHARACTER_MISSIONS, getMosaicCharacterMissionCatalog, normalizeMosaicCharacterMissions,
  getMosaicCharacterMissionObjective, getMosaicCharacterMissionZones, startMosaicCharacterMission,
  advanceMosaicCharacterMission, resolveMosaicCharacterMission } from '../src/game/mosaicCharacterMissions.js';

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
  return { zones: [anchor, ...getMosaicExhibitZones(district, exhibits), ...getMosaicCharacterMissionZones(progress, allCatalog)],
    npcs: residents.map((hero, index) => ({ hero, x: 720 + index * 38, y: 520 })), objective };
}
function resolved(progress, mission) {
  const scene = sceneFor(progress, mission), { targetId: id, targetType: type } = scene.objective;
  const target = type === 'npc' ? scene.npcs.find(npc => npc.hero.id === id) : getMosaicZoneAnchor(scene.zones.find(zone => zone.id === id));
  return resolveMosaicInteraction(target, scene, { type, id });
}

test('every Nexus identity and both DLC senders have distinct authored bilingual contracts', () => {
  assert.deepEqual(new Set(catalog.map(mission => mission.heroId)), new Set(owned));
  assert.equal(catalog.length, owned.length);
  assert.equal(new Set(allCatalog.map(mission => mission.id)).size, allCatalog.length);
  assert.deepEqual(new Set(allCatalog.map(mission => mission.id)), new Set(MOSAIC_CHARACTER_MISSIONS.map(mission => mission.id)));
  for (const mission of allCatalog) {
    const { residents, exhibits, unlockedHeroIds } = contextFor(mission.universe);
    assert.ok(unlockedHeroIds.includes(mission.heroId));
    assert.equal(new Set(mission.steps.map(step => step.id)).size, mission.steps.length);
    assert.equal(mission.steps.at(-1).type, 'anchor');
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
  assert.deepEqual(getMosaicCharacterMissionCatalog({ ...context, unlockedHeroIds: ['player_anchor'] }).map(mission => mission.heroId), ['player_anchor']);
  const removed = getMosaicCharacterMissionCatalog({ ...context, exhibits: exhibits.filter(item => item.id !== 'nexus_anchor_coil') });
  assert.ok(!removed.some(mission => ['player_anchor', 'arca_mirelle'].includes(mission.heroId)));
  assert.ok(removed.some(mission => mission.heroId === 'arca_sable'));
});
for (const mission of allCatalog) {
  for (const route of [0, 1]) test(`${mission.id}: physical steps, conclusion ${route + 1}, saved receipt and repeat refusal`, () => {
    const { district, anchor } = contextFor(mission.universe);
    let progress = startMosaicCharacterMission(normalizeMosaicCharacterMissions(), mission).progress;
    const state = { player: { x: 820, y: 760, speed: 2.35 }, keys: {}, npcs: [], obstacles: [] };
    let moved = 0;
    for (let index = 0; index < mission.steps.length; index++) {
      const { objective, zones, npcs } = sceneFor(progress, mission);
      assert.equal(objective.index, index);
      assert.equal(progress.records[mission.id].completed, false);
      if (objective.step.type === 'decision') {
        const before = JSON.stringify(progress), invalid = objective.step.choices.find(item => !item.valid);
        const wrong = resolveMosaicCharacterMission(progress, mission, invalid.id);
        assert.equal(wrong.changed, false); assert.equal(JSON.stringify(wrong.progress), before);
        progress = resolveMosaicCharacterMission(progress, mission, objective.step.choices.filter(item => item.valid)[route].id).progress;
      } else {
        const preferred = { type: objective.targetType, id: objective.targetId };
        state.npcs = npcs; state.obstacles = getMosaicSceneObstacles(district, zones);
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
