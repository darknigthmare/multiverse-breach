import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import createDlcSaveFixturePlugin from './fixtures/dlcSaveFixturePlugin.mjs';
import { createDlcInstallation } from '../src/game/dlcInstallation.js';
import { DLC_PACK_MANIFESTS, DLC_UNIVERSE_KEYS } from '../DLC/index.js';
import { KNOWN_DLC_HERO_IDS, KNOWN_ARC_REPLAY_DEFINITIONS, OC_DLC_SAVE_METADATA, getStableContentIndex, getStableUniverseArcStageId } from '../src/game/dlcContentIdentity.js';
import { getRuntimeHiddenUniverses, isStageContentAvailable, mergeDlcCampaignProgress, projectPlayableTeam, updateInstalledUniverseVisibility } from '../src/game/dlcPlayerState.js';
import { projectUniverseArcDeploymentPhases } from '../src/game/missions/missionStageProjection.js';
import { getProgressKeys } from '../src/game/progressCalendar.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const installation = mode => createDlcInstallation({
  manifests: DLC_PACK_MANIFESTS,
  profile: { schemaVersion: 1, mode, packIds: [], sharedPolicy: 'preserve-all' }
});
const base = installation('base');
const complete = installation('all');
const clone = value => JSON.parse(JSON.stringify(value));
let vite;
let fullSave;
let baseSave;

before(async () => {
  vite = await createServer({
    configFile: false, root, logLevel: 'silent',
    server: { middlewareMode: true },
    plugins: [createDlcSaveFixturePlugin(root)]
  });
  const { createSaveProfileHarness } = await vite.ssrLoadModule('virtual:dlc-save-profile');
  fullSave = createSaveProfileHarness();
  baseSave = createSaveProfileHarness({
    heroes: [], characterArcs: [], trioArcs: [], universeArcs: [], fusionMissions: []
  });
});
after(async () => { await vite?.close(); });

const sampleTrace = version => ({
  saveVersion: version,
  gold: 913, breachShards: 85, eventTokens: 7,
  unlockedHeroes: ['player_anchor', 'masterchief', 'neris_vale', 'future_owned_hero'],
  activeTeam: ['masterchief', 'player_anchor', 'neris_vale'],
  heroLevels: { player_anchor: 7, masterchief: 23, neris_vale: 11, future_owned_hero: 9 },
  heroTalents: { masterchief: 'spartan_training' },
  heroSkins: { masterchief: 'historical_skin' },
  inventory: ['assault_rifle', 'assault_rifle', 'future_owned_relic'],
  equippedGear: { masterchief: 'assault_rifle' },
  equippedEventItems: { neris_vale: 'thalassa_event' },
  completedStages: [47001, 47002],
  completedArcIds: ['future_completed_arc'],
  arcReplayUnlockedIds: ['future_completed_arc'],
  hiddenUniverses: ['Halo', 'Future universe'],
  campaignProgress: { future_pack: { missionIds: [99881], ending: 'preserved' } },
  portalStats: { pulls: 2, packsOpened: 1, history: [] },
  portalCollection: {
    cards: { future_card: { owned: 2 } },
    karts: ['future_kart'], activeKart: 'future_kart',
    battleMusic: ['future_track'],
    customLoadout: { battleMusic: 'future_track' }
  },
  activityProgress: { ...getProgressKeys(), lastSeenDay: getProgressKeys().dayKey, lifetimeWins: 4, heroInstability: { masterchief: 2 } },
  onboarding: { profileCreated: true, prologueCompleted: true, introSeen: true }
});

test('actual App normalization and serialization retain dormant data through a base-only round trip', () => {
  assert.ok(KNOWN_DLC_HERO_IDS.includes('masterchief'));
  assert.ok(KNOWN_DLC_HERO_IDS.includes('neris_vale'));
  const raw = sampleTrace(9);
  const full = fullSave.normalize(clone(raw), { existing: true });
  const withoutPacks = baseSave.normalize(clone(raw), { existing: true });
  assert.deepEqual(withoutPacks, full, 'installation must not alter the cloud save payload');
  const persisted = clone(baseSave.serialize(withoutPacks));
  const restored = fullSave.normalize(persisted, { existing: true });
  const reserialized = fullSave.serialize(restored);
  assert.deepEqual(reserialized, fullSave.serialize(full));
  for (const key of ['activeTeam', 'unlockedHeroes', 'heroLevels', 'heroTalents', 'heroSkins', 'inventory', 'equippedGear', 'equippedEventItems', 'hiddenUniverses']) {
    assert.deepEqual(reserialized[key], full[key], key);
  }
  assert.equal(reserialized.inventory.filter(id => id === 'assault_rifle').length, 2);
  assert.deepEqual(reserialized.campaignProgress.future_pack, raw.campaignProgress.future_pack);
  assert.equal(reserialized.portalCollection.activeKart, 'future_kart');
  assert.equal(reserialized.portalCollection.customLoadout.battleMusic, 'future_track');
  assert.equal('installedPackIds' in persisted, false);
});

for (const version of [6, 8]) {
  test('legacy v' + version + ' save migrates identically with complete and absent runtime catalogs', () => {
    const arc = KNOWN_ARC_REPLAY_DEFINITIONS.find(entry => entry.rewardItemId?.startsWith('universe_arc_'));
    assert.ok(arc);
    const raw = sampleTrace(version);
    raw.inventory.push(arc.rewardItemId);
    raw.completedArcIds = [];
    raw.arcReplayUnlockedIds = [];
    const full = fullSave.normalize(clone(raw), { existing: true });
    const partial = baseSave.normalize(clone(raw), { existing: true });
    assert.deepEqual(partial, full);
    assert.ok(partial.completedArcIds.includes(arc.arcId));
    for (const stageId of arc.finalStageIds) assert.ok(partial.completedStages.includes(stageId));
    if (version < 7) {
      for (const pack of OC_DLC_SAVE_METADATA) assert.ok(partial.hiddenUniverses.includes(pack.universe));
    }
    const restored = fullSave.normalize(clone(baseSave.serialize(partial)), { existing: true });
    assert.deepEqual(fullSave.serialize(restored), fullSave.serialize(full));
  });
}

test('runtime squad falls back to the Anchor without rewriting the saved slots', () => {
  const trace = fullSave.normalize(sampleTrace(9), { existing: true });
  const before = structuredClone(trace);
  const options = { heroes: fullSave.heroes, unlockedHeroIds: trace.unlockedHeroes, hiddenUniverses: [], isUniverseInstalled: base.isUniverseInstalled };
  assert.deepEqual(projectPlayableTeam(trace.activeTeam, options), ['player_anchor']);
  assert.deepEqual(trace, before);
  assert.deepEqual(projectPlayableTeam(trace.activeTeam, { ...options, isUniverseInstalled: complete.isUniverseInstalled }), trace.activeTeam);
  assert.deepEqual(projectPlayableTeam(trace.activeTeam, { ...options, isUniverseInstalled: complete.isUniverseInstalled, hiddenUniverses: ['Halo'] }), ['player_anchor', 'neris_vale']);
  assert.deepEqual(projectPlayableTeam(['unowned', 'missing', 'masterchief'], { ...options, heroes: [...fullSave.heroes, { id: 'unowned', universe: 'Nexus de Convergence' }], unlockedHeroIds: [], isUniverseInstalled: complete.isUniverseInstalled }), ['player_anchor']);
});

test('show/hide installed content preserves absent and future reserve preferences', () => {
  const original = ['Halo', 'Future universe'];
  assert.deepEqual(updateInstalledUniverseVisibility(original, DLC_UNIVERSE_KEYS, false, base.isUniverseInstalled), original);
  const hidden = getRuntimeHiddenUniverses(original, DLC_UNIVERSE_KEYS, base.isUniverseInstalled);
  assert.ok(hidden.includes('Halo'));
  assert.ok(hidden.length > original.length);
  assert.deepEqual(original, ['Halo', 'Future universe']);
  const restored = getRuntimeHiddenUniverses(original, DLC_UNIVERSE_KEYS, complete.isUniverseInstalled);
  assert.deepEqual(restored, original);
  const selected = createDlcInstallation({
    manifests: DLC_PACK_MANIFESTS,
    profile: { schemaVersion: 1, mode: 'selected', packIds: ['halo'], sharedPolicy: 'preserve-all' }
  });
  assert.deepEqual(updateInstalledUniverseVisibility(original, DLC_UNIVERSE_KEYS, false, selected.isUniverseInstalled), ['Future universe']);
  assert.equal(base.isUniverseInstalled('Cloud Meadow'), false, 'artwork-only pack uses the same visibility gate');
  assert.equal(base.isUniverseInstalled('Nexus de Convergence'), true);
});

test('unloaded and future OC campaign records survive progress rebuilding', () => {
  const original = { dormant: { missionIds: [12], choice: 'keep' }, future: { missionIds: [99], flag: true } };
  const actual = mergeDlcCampaignProgress([10, '11'], original, [{ id: 'included', missionIds: [10, 11, 12] }]);
  assert.deepEqual(actual.dormant, original.dormant);
  assert.deepEqual(actual.future, original.future);
  assert.deepEqual(actual.included.missionIds, [10, 11]);
  assert.deepEqual(original, { dormant: { missionIds: [12], choice: 'keep' }, future: { missionIds: [99], flag: true } });
});

test('a multi-universe phase cannot bypass missing or reserved sources', () => {
  const stage = { universe: 'Nexus de Convergence', sourceUniverses: ['Nexus de Convergence'], allSourceUniverses: ['Nexus de Convergence', 'Halo'] };
  assert.equal(isStageContentAvailable(stage, { isUniverseInstalled: base.isUniverseInstalled }), false);
  assert.equal(isStageContentAvailable(stage, { isUniverseInstalled: complete.isUniverseInstalled, hiddenUniverses: ['Halo'] }), false);
  assert.equal(isStageContentAvailable(stage, { isUniverseInstalled: complete.isUniverseInstalled }), true);
  assert.equal(isStageContentAvailable(null), false);
});

test('selected arc retains the complete catalog final and phase identities', () => {
  const arc = fullSave.universeArcs.find(entry => entry.universes.length > 3);
  assert.ok(arc);
  const index = getStableContentIndex('universeArcs', arc.id, 0);
  const original = projectUniverseArcDeploymentPhases(arc, index);
  const selected = [arc].flatMap((entry, runtimeIndex) => projectUniverseArcDeploymentPhases(entry, getStableContentIndex('universeArcs', entry.id, runtimeIndex)));
  assert.deepEqual(selected.map(phase => phase.runtimeStageId), original.map(phase => phase.runtimeStageId));
  assert.equal(selected.at(-1).runtimeStageId, getStableUniverseArcStageId(arc.id, 0));
});
