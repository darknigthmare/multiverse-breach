import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMosaicReconnaissanceDossier, normalizeMosaicReconnaissance,
  startMosaicReconnaissance, advanceMosaicReconnaissance, getMosaicReconnaissanceObjective } from '../src/game/mosaicReconnaissance.js';
import { advanceMosaicPlayer, getMosaicSceneObstacles, getMosaicZoneAnchor, resolveMosaicInteraction } from '../src/game/mosaicCityRuntime.js';
import { getMosaicResidentCatalog } from '../src/game/mosaicResidents.js';
import { getMosaicExhibits, getMosaicExhibitZones } from '../src/game/mosaicExhibits.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';

const district = { id: 'universe-nexus', universe: 'Nexus', worldW: 1920, worldH: 1180 };
const resident = { id: 'nexus-resident', universe: 'Nexus', name: 'Resident', nonCombat: true };
const item = { id: 'nexus-relic', universe: 'Nexus', name: { fr: 'Relique', en: 'Relic' } };
const anchor = { id: 'universe-nexus-core', universe: 'Nexus', action: 'anchor', x: 760, y: 875, w: 400, h: 150 };
const exhibits = getMosaicExhibits([item], 'Nexus');
const display = getMosaicExhibitZones(district, exhibits)[0];
const dossier = buildMosaicReconnaissanceDossier({ district, residents: [resident], exhibits, anchor });
const npc = { hero: resident, x: 680, y: 490 };
const npcEvent = () => resolveMosaicInteraction({ x: 680, y: 490 }, { npcs: [npc] });
const zoneEvent = zone => resolveMosaicInteraction(getMosaicZoneAnchor(zone), { zones: [zone] });
const start = () => startMosaicReconnaissance(normalizeMosaicReconnaissance(), dossier).progress;
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

test('dossier eligibility uses only owned local residents and enabled local displays, including peaceful residents', () => {
  const heroes = [resident, { id: 'unowned', universe: 'Nexus' }, { id: 'visitor', universe: 'Elsewhere' }, { id: 'player_anchor', universe: 'Nexus' }];
  const items = [item, { id: 'disabled', universe: 'Nexus' }, { id: 'foreign', universe: 'Elsewhere' }];
  const input = freeze({ district, residents: getMosaicResidentCatalog(heroes, [resident.id, 'visitor', 'player_anchor'], 'Nexus'),
    exhibits: getMosaicExhibits(items, 'Nexus', { disabled: ['disabled'], inventory: [] }), anchor });
  const before = JSON.stringify(input);
  const result = buildMosaicReconnaissanceDossier(input);
  assert.deepEqual(result.residentIds, [resident.id]);
  assert.deepEqual(result.exhibitIds, [item.id]);
  assert.equal(result.anchorId, anchor.id);
  assert.equal(result.id, 'mosaic-recon:universe-nexus');
  assert.equal(JSON.stringify(input), before);
  assert.ok(Object.isFrozen(result) && Object.isFrozen(result.residentIds));
});

test('missing local content or a mismatched anchor never creates an unusable dossier', () => {
  const base = { district, residents: [resident], exhibits, anchor };
  for (const overrides of [
    { district: { id: 'atrium' } }, { residents: [] }, { exhibits: [] },
    { residents: [{ id: 'visitor', universe: 'Elsewhere' }] },
    { residents: [{ id: 'player_anchor', universe: 'Nexus' }] },
    { exhibits: [{ id: 'foreign', universe: 'Elsewhere' }] }, { anchor: null },
    { anchor: { ...anchor, universe: 'Elsewhere' } }, { anchor: { ...anchor, action: 'mission' } }
  ]) assert.equal(buildMosaicReconnaissanceDossier({ ...base, ...overrides }), null);
  assert.equal(buildMosaicReconnaissanceDossier(), null);
});

test('acceptance is explicit and a repeated accept is idempotent', () => {
  const empty = freeze(normalizeMosaicReconnaissance());
  assert.equal(advanceMosaicReconnaissance(empty, dossier, npcEvent()).reason, 'inactive');
  const accepted = startMosaicReconnaissance(empty, dossier, 'en');
  assert.equal(accepted.changed, true);
  assert.equal(accepted.reason, 'started');
  assert.equal(accepted.objective.step, 'resident');
  assert.equal(accepted.objective.status, 'active');
  assert.deepEqual(accepted.objective.targetIds, [resident.id]);
  assert.equal(startMosaicReconnaissance(accepted.progress, dossier).progress, accepted.progress);
  assert.deepEqual(empty.dossiers, {});
});

test('a directory selection, missing range evidence, or a distant NPC cannot advance reconnaissance', () => {
  const progress = freeze(start());
  const interaction = npcEvent();
  for (const distance of [undefined, NaN, Infinity, -1, 58.001]) {
    const result = advanceMosaicReconnaissance(progress, dossier, { ...interaction, distance });
    assert.equal(result.progress, progress);
    assert.equal(result.reason, 'out_of_range');
  }
  assert.equal(advanceMosaicReconnaissance(progress, dossier, resident).changed, false);
  assert.equal(advanceMosaicReconnaissance(progress, dossier, { ...interaction, distance: 58 }).reason, 'resident_recorded');
});

test('target identity, universe and ordered interaction are required at every step', () => {
  const progress = freeze(start()), interaction = npcEvent();
  const wrong = [zoneEvent(display), zoneEvent(anchor),
    { ...interaction, id: 'unowned' },
    { ...interaction, target: { ...npc, hero: { ...resident, universe: 'Elsewhere' } } }];
  for (const event of wrong) assert.equal(advanceMosaicReconnaissance(progress, dossier, event).reason, 'wrong_target');
  const spoken = advanceMosaicReconnaissance(progress, dossier, interaction).progress;
  assert.equal(advanceMosaicReconnaissance(spoken, dossier, interaction).changed, false);
  assert.equal(advanceMosaicReconnaissance(spoken, dossier, zoneEvent(anchor)).reason, 'wrong_target');
  const forged = { ...zoneEvent(display), target: { ...display, exhibitId: 'foreign' } };
  assert.equal(advanceMosaicReconnaissance(spoken, dossier, forged).changed, false);
  const wrongZone = { ...display, id: 'unrelated-display' };
  assert.equal(advanceMosaicReconnaissance(spoken, dossier, zoneEvent(wrongZone)).changed, false);
  assert.equal(advanceMosaicReconnaissance(spoken, dossier, { ...zoneEvent(display), distance: 72.01 }).changed, false);
});

test('ordinary movement reaches all three objectives, validates each in order, and archives only once', () => {
  let progress = start();
  const scene = { npcs: [npc], zones: [display, anchor] };
  const state = { player: { x: 820, y: 760, speed: 2.35 }, keys: {}, npcs: [npc],
    obstacles: getMosaicSceneObstacles(district, scene.zones), destination: null };
  for (const [type, id, destination, expected] of [
    ['npc', resident.id, npc, 'resident_recorded'],
    ['zone', display.id, getMosaicZoneAnchor(display), 'exhibit_recorded'],
    ['zone', anchor.id, getMosaicZoneAnchor(anchor), 'completed']
  ]) {
    state.destination = { x: destination.x, y: destination.y };
    state.pendingInteraction = { type, id };
    let interaction = null, moves = 0;
    for (let i = 0; i < 1600 && !interaction; i++) {
      const before = { ...state.player };
      advanceMosaicPlayer(state, district, 1000 / 60);
      const distance = Math.hypot(state.player.x - before.x, state.player.y - before.y);
      assert.ok(distance <= 2.35 + 1e-8, 'walking must not teleport to the objective');
      if (distance > 0) moves++;
      interaction = resolveMosaicInteraction(state.player, scene, { type, id });
    }
    assert.ok(interaction && moves > 0, `objective ${id} was not reached by walking`);
    const result = advanceMosaicReconnaissance(freeze(progress), dossier, interaction);
    assert.equal(result.reason, expected);
    progress = result.progress;
  }
  assert.equal(progress.activeDistrictId, null);
  assert.deepEqual(progress.dossiers[district.id], { universe: 'Nexus', residentId: resident.id, exhibitId: item.id, completed: true });
  const repeated = advanceMosaicReconnaissance(progress, dossier, zoneEvent(anchor));
  assert.equal(repeated.progress, progress);
  assert.equal(repeated.reason, 'already_completed');
  assert.equal(startMosaicReconnaissance(progress, dossier).changed, false);
});

test('switching dossiers preserves partial work and requires explicitly resuming it', () => {
  const other = buildMosaicReconnaissanceDossier({ district: { id: 'universe-halo', universe: 'Halo' },
    residents: [{ id: 'chief', universe: 'Halo' }], exhibits: [{ id: 'shield', universe: 'Halo' }],
    anchor: { id: 'universe-halo-core', action: 'anchor', universe: 'Halo' } });
  const spoken = advanceMosaicReconnaissance(start(), dossier, npcEvent()).progress;
  const switched = startMosaicReconnaissance(spoken, other).progress;
  assert.equal(getMosaicReconnaissanceObjective(switched, dossier).status, 'paused');
  assert.equal(advanceMosaicReconnaissance(switched, dossier, zoneEvent(display)).reason, 'inactive');
  const resumed = startMosaicReconnaissance(switched, dossier);
  assert.equal(resumed.reason, 'resumed');
  assert.equal(resumed.objective.step, 'exhibit');
  assert.deepEqual(resumed.progress.dossiers['universe-halo'], switched.dossiers['universe-halo']);
});

test('temporary absence, JSON serialization and save sanitation preserve all district records and existing economy', () => {
  const spoken = advanceMosaicReconnaissance(start(), dossier, npcEvent()).progress;
  const progress = normalizeMosaicReconnaissance({ ...spoken, dossiers: { ...spoken.dossiers,
    'uninstalled-district': { universe: 'Unavailable Pack', residentId: 'old-resident', exhibitId: 'old-relic', completed: true } } });
  const hidden = getMosaicReconnaissanceObjective(progress, null, 'en');
  assert.equal(hidden.status, 'unavailable');
  assert.equal(startMosaicReconnaissance(progress, null).progress, progress);
  const save = { gold: 310, breachShards: 27, eventTokens: 8, inventory: ['owned', 'owned'],
    unlockedHeroes: ['player_anchor'], activityProgress: { seasonXp: 55, mosaicReconnaissance: progress } };
  const roundTrip = sanitizeSaveCore(JSON.parse(JSON.stringify(save)), { now: new Date('2026-11-07T12:00:00Z') });
  assert.deepEqual(roundTrip.activityProgress.mosaicReconnaissance, progress);
  assert.deepEqual(normalizeMosaicReconnaissance(roundTrip.activityProgress.mosaicReconnaissance), progress);
  assert.equal(roundTrip.activityProgress.seasonXp, 55);
  assert.equal(roundTrip.gold, 310); assert.equal(roundTrip.breachShards, 27); assert.equal(roundTrip.eventTokens, 8);
  assert.deepEqual(roundTrip.inventory, ['owned', 'owned']);
  assert.equal(getMosaicReconnaissanceObjective(progress, dossier).step, 'exhibit');
});

test('malformed progress cannot skip prerequisites and never binds a retained record to another universe', () => {
  const safe = normalizeMosaicReconnaissance({ activeDistrictId: district.id, dossiers: {
    [district.id]: { universe: 'Nexus', residentId: null, exhibitId: item.id, completed: true }, broken: [] } });
  assert.equal(safe.dossiers[district.id].completed, false);
  assert.equal(safe.dossiers[district.id].exhibitId, null);
  assert.equal(getMosaicReconnaissanceObjective(safe, dossier).step, 'resident');
  assert.deepEqual(normalizeMosaicReconnaissance(null), { version: 1, activeDistrictId: null, dossiers: {} });
  const mismatched = { ...safe, dossiers: { [district.id]: { ...safe.dossiers[district.id], universe: 'Other identity' } } };
  assert.equal(startMosaicReconnaissance(mismatched, dossier).progress, mismatched);
  assert.equal(advanceMosaicReconnaissance(mismatched, dossier, npcEvent()).reason, 'unavailable');
});

test('French and English objectives expose the actual world targets without sharing mutable target arrays', () => {
  let progress = start();
  const residentView = getMosaicReconnaissanceObjective(progress, dossier, 'en');
  assert.match(residentView.text, /^Talk to/);
  residentView.targetIds.push('not-an-objective');
  assert.deepEqual(dossier.residentIds, [resident.id]);
  progress = advanceMosaicReconnaissance(progress, dossier, npcEvent()).progress;
  const exhibitView = getMosaicReconnaissanceObjective(progress, dossier, 'fr');
  assert.equal(exhibitView.index, 1); assert.equal(exhibitView.total, 3);
  assert.deepEqual(exhibitView.targetIds, [display.id]);
  assert.match(exhibitView.text, /^Examine/);
  progress = advanceMosaicReconnaissance(progress, dossier, zoneEvent(display)).progress;
  assert.deepEqual(getMosaicReconnaissanceObjective(progress, dossier).targetIds, [anchor.id]);
  const result = advanceMosaicReconnaissance(progress, dossier, zoneEvent(anchor), 'en');
  assert.equal(result.objective.index, 3); assert.equal(result.objective.status, 'completed');
  assert.match(result.feedback, /^Report submitted/);
});
