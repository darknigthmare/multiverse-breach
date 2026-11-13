import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';

// Closed source declarations only; no generation, assets or approval authority.
export const CG_SOURCE64_AMENDMENT_PATH = 'scripts/fixtures/cg-source64-amendment-2026-11-13.json';
export const CG_SOURCE64_AMENDMENT_SHA256 = '89383d483fb61e456156b2bd9e0ebf8c6082bd83bc0b327bb94d494f45209b42';
export const CG_SOURCE64_COMMIT = 'b9e616b331e4d93efcd63b607736ae6b6c59415b';
export const CG_SOURCE64_HISTORICAL_PLAN_SHA256 = 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e';
export const CG_SOURCE64_ACTOR_IDS = Object.freeze([
  "aerith_ff7",
  "alyx_vance",
  "arbiter",
  "ardyn_ff15",
  "ashley_williams",
  "barney",
  "barret_ff7",
  "buck",
  "buck_odst",
  "cloud_ff7",
  "cor_ff15",
  "cortana",
  "cortana_fragment",
  "dog_hl2",
  "eli_vance",
  "fang_ff13",
  "garrus",
  "gladiolus_ff15",
  "hope_ff13",
  "ignis_ff15",
  "irvine_ff8",
  "johnson",
  "kelly_087",
  "kleiner",
  "laguna_ff8",
  "liara",
  "lightning_ff13",
  "linda_058",
  "lunafreya_ff15",
  "masterchief",
  "mordin",
  "noble_six",
  "noctis_ff15",
  "prompto_ff15",
  "quake_franchise_bitterman",
  "quake_franchise_matthew_kane",
  "quake_franchise_ranger",
  "quistis_ff8",
  "redxiii_ff7",
  "rinoa_ff8",
  "sazh_ff13",
  "seifer_ff8",
  "selphie_ff8",
  "shepard",
  "shephard",
  "snow_ff13",
  "squall_ff8",
  "tali",
  "tifa_ff7",
  "unreal_1998_dante",
  "unreal_1998_gina",
  "unreal_1998_kurgan",
  "unreal_tournament_2004_frostbite",
  "unreal_tournament_2004_gorge",
  "unreal_tournament_2004_sapphire",
  "unreal_tournament_brock",
  "unreal_tournament_lauren",
  "unreal_tournament_malcom",
  "vanille_ff13",
  "vincent_ff7",
  "vortigaunt_ally",
  "wrex",
  "yuffie_ff7",
  "zell_ff8"
]);
const sourceFiles = Object.freeze([
  "src/game/heroes.js",
  "src/game/expandedUniverses.js",
  "src/game/loreAccuratePacks.js",
  "src/game/canonRosterWave.js",
  "src/game/canonRosterWavePartC.js",
  "src/game/canonRosterWavePartD.js",
  "src/game/canonRosterWavePartG.js",
  "src/game/canonRosterPackFactory.js",
  "src/game/canonicalCombatOverrides.js",
  "src/game/combatCanonExtensions.js",
  "src/game/combat/combatSourceDefinitionsWave12.js",
  "src/game/combat/combatSourceDefinitionsWave13.js",
  "src/game/combat/combatSourceDefinitionsWave14.js",
  "src/game/combat/combatSourceDefinitionsWave15.js",
  "src/game/combat/combatSourceDefinitionsWave16.js",
  "src/game/combat/combatSourceDefinitionsWave17.js",
  "src/game/combat/abilities/abilitiesCanonical.js",
  "src/game/combat/abilities/abilitiesWave14Definitions.js",
  "src/game/combat/abilities/abilitiesWave15PartA.js",
  "src/game/combat/abilities/abilitiesWave15PartB.js",
  "src/game/combat/abilities/abilitiesWave15PartC.js",
  "src/game/combat/abilities/rules.js",
  "DLC/FinalFantasyVII/data/heroes.js",
  "DLC/FinalFantasyVII/data/expandedUniverses.js",
  "DLC/FinalFantasyVII/data/actorSourceContracts.js",
  "DLC/FinalFantasyVIII/data/heroes.js",
  "DLC/FinalFantasyVIII/data/expandedUniverses.js",
  "DLC/FinalFantasyVIII/data/actorSourceContracts.js",
  "DLC/FinalFantasyXIII/data/heroes.js",
  "DLC/FinalFantasyXIII/data/expandedUniverses.js",
  "DLC/FinalFantasyXIII/data/actorSourceContracts.js",
  "DLC/FinalFantasyXV/data/heroes.js",
  "DLC/FinalFantasyXV/data/expandedUniverses.js",
  "DLC/FinalFantasyXV/data/actorSourceContracts.js",
  "DLC/HalfLife/data/heroes.js",
  "DLC/HalfLife/data/loreAccuratePacks.js",
  "DLC/Halo/data/heroes.js",
  "DLC/Halo/data/loreAccuratePacks.js",
  "DLC/MassEffect/data/heroes.js",
  "DLC/MassEffect/data/loreAccuratePacks.js",
  "DLC/Quake/data/canonRosterWavePartD.js",
  "DLC/Unreal/data/canonRosterWavePartC.js",
  "DLC/UnrealTournament/data/canonRosterWavePartC.js",
  "DLC/UnrealTournament2004/data/canonRosterWavePartG.js",
  "DLC/UnrealTournament2004/data/actorCatalogCombat.js",
  "src/game/cg/cgCatalog.js"
]);

const identityFields = Object.freeze(['incarnation', 'identityLock', 'equipment', 'sourceRefs', 'missing', 'adaptationNote']);
const entryFields = Object.freeze(['themeSource', 'themeContinuity', 'missing']);
const pilotIds = Object.freeze(['masterchief', 'arbiter']);
const digest = value => createHash('sha256').update(value).digest('hex');
const jsonHash = value => digest(JSON.stringify(value));
const clone = value => structuredClone(value);
const selected = (record, fields) => Object.fromEntries(fields.filter(key => Object.hasOwn(record, key)).map(key => [key, record[key]]));
const snapshotValue = (record, key) => Object.hasOwn(record, key) ? { present: true, value: record[key] } : { present: false };
const exact = (actual, expected, label) => assert.deepEqual(actual, expected, label);
const only = (records, predicate, label) => {
  const found = records.map((item, index) => ({ item, index })).filter(({ item }) => predicate(item));
  assert.equal(found.length, 1, `${label}: exactly one object required`);
  return found[0];
};
// Use published key order without copying any unapproved published values.
// Unknown current keys survive, so the final historical gate can reject them.
const ordered = (current, published) => Object.fromEntries([
  ...Object.keys(published).filter(key => Object.hasOwn(current, key)),
  ...Object.keys(current).filter(key => !Object.hasOwn(published, key))
].map(key => [key, current[key]]));
const restoreFields = (current, previous, fields, publishedParent) => {
  const restored = { ...current };
  for (const key of fields) {
    if (Object.hasOwn(previous, key)) restored[key] = clone(previous[key]);
    else delete restored[key];
  }
  return ordered(restored, publishedParent);
};
function readRegular(root, relative) {
  const file = path.join(path.resolve(root), relative);
  assert.ok(lstatSync(file).isFile(), `Source64 requires a regular pinned file: ${relative}`);
  assert.equal(realpathSync(file), file, `Source64 refuses symbolic source paths: ${relative}`);
  return readFileSync(file);
}

// Call only AFTER the pre-existing candidate/descriptor projections. Every
// unknown field survives the projection and remains under the full historical
// validator. This function never accepts paths, JSON patches or replacement
// records from its caller.
export function projectCgSource64Amendment({ root, published, projected, heroes, catalog }) {
  const bytes = readRegular(root, CG_SOURCE64_AMENDMENT_PATH);
  assert.equal(digest(bytes), CG_SOURCE64_AMENDMENT_SHA256, 'Source64 amendment changed; append a reviewed contract instead');
  const amendment = JSON.parse(bytes);
  assert.equal(amendment.schemaVersion, 1);
  assert.equal(amendment.kind, 'closed-runtime-source64-metadata-projection');
  assert.equal(amendment.sourceCommit, CG_SOURCE64_COMMIT);
  assert.equal(amendment.identityAuthority, false);
  assert.equal(amendment.changesGenerationHistory, false);
  assert.equal(amendment.source1to1Verified, false);
  assert.equal(amendment.visualFidelityApproved, false);
  exact(amendment.identityFields, identityFields, 'Source64 identity whitelist changed');
  exact(amendment.entryFields, entryFields, 'Source64 entry whitelist changed');
  exact(amendment.entries.map(entry => entry.characterId), CG_SOURCE64_ACTOR_IDS, 'Source64 exact cohort changed');
  assert.equal(amendment.entries.length, 64);
  exact(amendment.sourceFiles.map(pin => pin.path), sourceFiles, 'Source64 fixed source list changed');
  for (const pin of amendment.sourceFiles) {
    const source = readRegular(root, pin.path);
    assert.equal(source.length, pin.bytes, `Source64 source byte count changed: ${pin.path}`);
    assert.equal(digest(source), pin.sha256, `Source64 frozen b9e source changed: ${pin.path}`);
  }
  // Reject a changed runtime source before rereading/hashing the large historic
  // plan. Valid projections still pass every historical and metadata guard.
  for (const entry of amendment.entries) {
    const hero = only(heroes, hero => hero.id === entry.characterId, `Source64 runtime hero ${entry.characterId}`).item;
    assert.equal(hero.universe, entry.universe);
    assert.equal(jsonHash(hero), entry.runtimeHeroSha256, `Source64 runtime declaration changed: ${entry.characterId}`);
  }
  const historical = readRegular(root, 'docs/cg/roster-production-2026-10-18.json');
  assert.equal(digest(historical), CG_SOURCE64_HISTORICAL_PLAN_SHA256, 'Source64 historical plan changed');
  assert.equal(jsonHash(published), amendment.historicalObjectSha256, 'Source64 requires the complete unchanged published plan');
  exact(amendment.pilotSources.map(pin => pin.characterId), pilotIds, 'Source64 pilot source cohort changed');
  for (const pin of amendment.pilotSources) {
    const pilot = only(catalog, item => item.characterId === pin.characterId && item.type === 'characterSolo', `Source64 CG pilot ${pin.characterId}`).item;
    assert.equal(pilot.id, pin.id);
    assert.equal(jsonHash(pilot), pin.sha256, `Source64 CG pilot source changed: ${pin.characterId}`);
  }
  const result = { ...projected };
  for (const family of ['subjects', 'entries', 'backgrounds']) {
    assert.equal(projected[family].length, published[family].length, `Source64 ${family} count changed`);
    result[family] = projected[family].slice();
  }
  let entryCount = 0, backgroundCount = 0, runtimeProvenanceCount = 0;
  for (const entry of amendment.entries) {
    const id = entry.characterId;
    const previous = only(published.subjects, subject => subject.characterId === id, `Source64 historical subject ${id}`);
    const current = only(projected.subjects, subject => subject.characterId === id, `Source64 current subject ${id}`);
    assert.equal(current.index, previous.index, `Source64 subject order changed: ${id}`);
    for (const subject of [current.item, previous.item]) {
      assert.equal(subject.universe, entry.universe);
      assert.equal(subject.characterArcStageId, entry.characterArcStageId);
      assert.equal(subject.identity.visualFidelityApproved, false, `Source64 cannot approve identity: ${id}`);
    }
    exact(selected(previous.item.identity, identityFields), entry.subject.identity.previous, `Source64 historical identity changed: ${id}`);
    exact(selected(current.item.identity, identityFields), entry.subject.identity.current, `Source64 current identity changed: ${id}`);
    exact(previous.item.matrix.CG01.themeSource, entry.subject.cg01ThemeSource.previous, `Source64 historical CG01 source changed: ${id}`);
    exact(current.item.matrix.CG01.themeSource, entry.subject.cg01ThemeSource.current, `Source64 current CG01 source changed: ${id}`);
    let identity = restoreFields(current.item.identity, entry.subject.identity.previous, identityFields, previous.item.identity);
    const currentRuntime = snapshotValue(current.item.identity, 'currentRuntimeSource');
    const previousRuntime = snapshotValue(previous.item.identity, 'currentRuntimeSource');
    if (pilotIds.includes(id)) {
      exact(currentRuntime, entry.subject.currentRuntimeSource.current, `Source64 current pilot provenance changed: ${id}`);
      exact(previousRuntime, entry.subject.currentRuntimeSource.previous, `Source64 historical pilot provenance changed: ${id}`);
      assert.equal(currentRuntime.present, true);
      assert.equal(currentRuntime.value.actorId, id);
      assert.equal(currentRuntime.value.universe, entry.universe);
      assert.equal(currentRuntime.value.authority, false);
      assert.equal(currentRuntime.value.visualFidelityApproved, false);
      if (previousRuntime.present) identity.currentRuntimeSource = clone(previousRuntime.value);
      else delete identity.currentRuntimeSource;
      runtimeProvenanceCount++;
    } else {
      assert.equal(Object.hasOwn(entry.subject, 'currentRuntimeSource'), false, `Source64 unrelated runtime provenance contract: ${id}`);
      exact(currentRuntime, previousRuntime, `Source64 runtime provenance forbidden outside two pilots: ${id}`);
    }
    const matrix = ordered({ ...current.item.matrix,
      CG01: restoreFields(current.item.matrix.CG01, { themeSource: entry.subject.cg01ThemeSource.previous },
        ['themeSource'], previous.item.matrix.CG01) }, previous.item.matrix);
    const subject = ordered({ ...current.item, identity, matrix }, previous.item);
    exact(subject, previous.item, `Source64 subject changed outside the closed metadata fields: ${id}`);
    result.subjects[current.index] = subject;
    for (const [family, fields] of [['entries', entryFields], ['backgrounds', ['characterContext']]]) {
      const expected = entry[family];
      exact(projected[family].filter(item => item.characterId === id).map(item => item.id), expected.map(item => item.id), `Source64 ${family} cohort/order changed: ${id}`);
      exact(published[family].filter(item => item.characterId === id).map(item => item.id), expected.map(item => item.id), `Source64 historical ${family} cohort changed: ${id}`);
      for (const pin of expected) {
        const oldRecord = only(published[family], item => item.id === pin.id, `Source64 historical ${family} ${pin.id}`);
        const newRecord = only(projected[family], item => item.id === pin.id, `Source64 current ${family} ${pin.id}`);
        assert.equal(newRecord.index, oldRecord.index, `Source64 ${family} order changed: ${pin.id}`);
        for (const record of [newRecord.item, oldRecord.item]) {
          assert.equal(record.characterId, id);
          assert.equal(record.type, pin.type);
        }
        exact(selected(oldRecord.item, fields), pin.previous, `Source64 historical ${family} metadata changed: ${pin.id}`);
        exact(selected(newRecord.item, fields), pin.current, `Source64 current ${family} metadata changed: ${pin.id}`);
        const restored = restoreFields(newRecord.item, pin.previous, fields, oldRecord.item);
        exact(restored, oldRecord.item, `Source64 ${family} changed outside the closed metadata fields: ${pin.id}`);
        result[family][newRecord.index] = restored;
        if (family === 'entries') entryCount++; else backgroundCount++;
      }
    }
  }
  assert.equal(runtimeProvenanceCount, 2);
  return { projected: ordered(result, published), evidence: {
    mode: 'closed-source64-metadata-amendment-after-historical-projections', amendment: CG_SOURCE64_AMENDMENT_PATH,
    amendmentSha256: digest(bytes), sourceCommit: CG_SOURCE64_COMMIT, actorCount: 64,
    frozenSourceFiles: sourceFiles.length, sourceHeroPins: 64, entryCount, backgroundCount, runtimeProvenanceCount,
    changesGenerationHistory: false, changesDeliveredImages: false, changesRewardsOrApprovals: false,
    identityAuthority: false, visualFidelityApproved: false, fullSource1to1Verified: false
  } };
}
