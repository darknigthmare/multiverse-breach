import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getQuarantinedCanonSprite } from '../src/game/canonicalSpriteQuarantine.js';
import { isCgReferenceImageAttested } from './cgSourceEvidence.mjs';
import { getCgQuarantineSelectionMessage, getCgQuarantineVisualFlags } from './cgReviewedQuarantineMetadata.mjs';

export const CG_CONTINUATION02_METADATA_AMENDMENT_PATH = 'scripts/fixtures/cg-continuation02-metadata-amendment-2026-11-13.json';
export const CG_CONTINUATION02_METADATA_AMENDMENT_SHA256 = '77a0bb8e02a1d24b5d2c38dadba6401cc9b11740a29b169c2dde844399b864f9';
export const CG_CONTINUATION02_SOURCE_COMMIT = '5baaae27bf23b845a5056eeab3c95fbe7b0d234e';
const historicalSha256 = 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e';
export const CG_CONTINUATION02_ACTOR_IDS = Object.freeze([
  'anya_stroud', 'atlas', 'baird', 'bill_l4d', 'carmine_cog', 'caroline_portal', 'carver', 'cave_johnson',
  'cave_johnson_echo', 'chell', 'coach_l4d', 'cole', 'dom', 'doug_rattmann', 'ellis_l4d', 'ellie', 'glados',
  'glados_core', 'hammond_ds', 'hoffman_cog', 'isaac', 'kait_diaz', 'kendra_daniels', 'marcus', 'nick_l4d',
  'nicole_brennan', 'pbody', 'rochelle_l4d', 'wheatley', 'zach_hammond', 'zoey_l4d'
]);
const sourceFiles = Object.freeze([
  'src/game/heroes.js', 'src/game/canonicalSpriteQuarantine.js', 'src/game/combat/combatSourceDefinitionsWave15PartC.js',
  'DLC/GearsOfWar/data/heroes.js', 'DLC/GearsOfWar/data/actorSourceContracts.js', 'DLC/GearsOfWar/data/loreAccuratePacks.js', 'DLC/GearsOfWar/data/loreWorldBossOverrides.js',
  'DLC/DeadSpace/data/heroes.js', 'DLC/DeadSpace/data/actorSourceContracts.js', 'DLC/DeadSpace/data/loreAccuratePacks.js',
  'DLC/Portal/data/heroes.js', 'DLC/Portal/data/sourceContracts20261113.js', 'DLC/Portal/data/loreAccuratePacks.js', 'DLC/Portal/data/loreWorldBossOverrides.js',
  'DLC/Left4Dead/data/heroes.js', 'DLC/Left4Dead/data/sourceContracts20261113.js', 'DLC/Left4Dead/data/expandedUniverses.js'
]);
export { sourceFiles as CG_CONTINUATION02_SOURCE_FILES };
const priorPins = Object.freeze({
  'scripts/fixtures/cg-source-metadata-amendment-2026-11-13.json': 'eba38c68b819869fc4cc31fd8b430c8562c9cc763fdc1c76a2ed632e30fbb0b4',
  'scripts/fixtures/cg-local-candidates-amendment-2026-11-09.json': '8777754e2c113b71661902e21529ec217440f9c15ac5f34467397441a34bd2a3',
  'scripts/fixtures/cg-current-descriptors-amendment-2026-11-09.json': '71891cbf57f7f6a580993301db9ee4ba9efc7ca0dd1e7b3d875e9975f31a2ce0',
  'scripts/fixtures/cg-source64-amendment-2026-11-13.json': '89383d483fb61e456156b2bd9e0ebf8c6082bd83bc0b327bb94d494f45209b42',
  'scripts/fixtures/cg-reviewed-availability-amendment-2026-11-13.json': '65fd79dc231ab247c15fc788b50e4edf7645bfff61cdb60610761aec6196699f',
  'scripts/fixtures/cg-reviewed-runtime-correction-amendment-2026-11-13.json': 'a535fe7b0420deef9f9b096926789d84157f4948593e9bff98d50b0193d72c3c'
});
const identityFields = Object.freeze(['incarnation', 'identityLock', 'equipment', 'sourceRefs', 'missing', 'adaptationNote']);
const entryFields = Object.freeze(['themeSource', 'themeContinuity', 'missing']);
const digest = value => createHash('sha256').update(value).digest('hex');
const jsonHash = value => digest(JSON.stringify(value));
const exact = (actual, expected, label) => assert.deepEqual(actual, expected, label);
const pick = (record, fields) => Object.fromEntries(fields.filter(key => Object.hasOwn(record, key)).map(key => [key, record[key]]));
const ordered = (current, previous) => Object.fromEntries([
  ...Object.keys(previous).filter(key => Object.hasOwn(current, key)),
  ...Object.keys(current).filter(key => !Object.hasOwn(previous, key))
].map(key => [key, current[key]]));
const restore = (record, previousValues, fields, historical) => {
  const result = { ...record };
  for (const key of fields) {
    if (Object.hasOwn(previousValues, key)) result[key] = structuredClone(previousValues[key]);
    else delete result[key];
  }
  return ordered(result, historical);
};
const only = (records, predicate, label) => {
  const found = records.map((item, index) => ({ item, index })).filter(({ item }) => predicate(item));
  assert.equal(found.length, 1, `${label}: exactly one object required`);
  return found[0];
};
const readRegular = (root, relative) => {
  const file = path.resolve(root, relative);
  assert.ok(lstatSync(file).isFile(), `Continuation02 requires a regular file: ${relative}`);
  assert.equal(realpathSync(file), file, `Continuation02 forbids symbolic source paths: ${relative}`);
  return readFileSync(file);
};

// Call only after all existing projections, then retain the complete historical
// serialization/report comparison. Nothing here grants source or art approval.
export function projectCgContinuation02MetadataAmendment({ root, published, projected, heroes }) {
  const fixtureBytes = readRegular(root, CG_CONTINUATION02_METADATA_AMENDMENT_PATH);
  assert.equal(digest(fixtureBytes), CG_CONTINUATION02_METADATA_AMENDMENT_SHA256, 'Closed continuation02 CG amendment changed');
  const contract = JSON.parse(fixtureBytes);
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.kind, 'closed-continuation02-current-target-metadata');
  assert.equal(contract.sourceCommit, CG_CONTINUATION02_SOURCE_COMMIT);
  assert.equal(contract.identityAuthority, false);
  assert.equal(contract.changesGenerationHistory, false);
  assert.equal(contract.visualFidelityApproved, false);
  assert.equal(contract.fullSource1to1Verified, false);
  assert.equal(contract.historicalPlanSha256, historicalSha256);
  exact(contract.identityFields, identityFields, 'Continuation02 identity whitelist changed');
  exact(contract.entryFields, entryFields, 'Continuation02 entry whitelist changed');
  exact(contract.actors.map(entry => entry.characterId), CG_CONTINUATION02_ACTOR_IDS, 'Continuation02 actor cohort changed');
  exact(contract.sourceFiles.map(pin => pin.path), sourceFiles, 'Continuation02 source file cohort changed');
  for (const pin of contract.sourceFiles) {
    const bytes = readRegular(root, pin.path);
    assert.equal(bytes.length, pin.bytes, `Continuation02 source byte count changed: ${pin.path}`);
    assert.equal(digest(bytes), pin.sha256, `Continuation02 frozen source changed: ${pin.path}`);
  }
  for (const entry of [...contract.actors, contract.quarantine]) {
    const hero = only(heroes, hero => hero.id === entry.characterId, `Continuation02 runtime ${entry.characterId}`).item;
    assert.equal(hero.universe, entry.universe);
    assert.equal(jsonHash(hero), entry.runtimeHeroSha256, `Continuation02 runtime declaration changed: ${entry.characterId}`);
  }
  for (const [file, sha256] of Object.entries(priorPins)) assert.equal(digest(readRegular(root, file)), sha256, `Prior CG amendment changed: ${file}`);
  assert.equal(digest(readRegular(root, 'docs/cg/roster-production-2026-10-18.json')), historicalSha256, 'Historical CG plan changed');
  assert.equal(jsonHash(published), contract.historicalObjectSha256, 'Continuation02 requires the complete unchanged historical plan');
  const result = { ...projected };
  for (const family of ['subjects', 'entries', 'backgrounds']) {
    assert.equal(projected[family].length, published[family].length, `Continuation02 ${family} count changed`);
    result[family] = projected[family].slice();
  }
  let entryCount = 0, backgroundCount = 0;
  for (const entry of contract.actors) {
    const id = entry.characterId;
    const old = only(published.subjects, item => item.characterId === id, `Continuation02 historical subject ${id}`);
    const now = only(projected.subjects, item => item.characterId === id, `Continuation02 current subject ${id}`);
    assert.equal(now.index, old.index, `Continuation02 subject order changed: ${id}`);
    for (const record of [old.item, now.item]) {
      assert.equal(record.universe, entry.universe);
      assert.equal(record.characterArcStageId, entry.characterArcStageId);
      assert.equal(record.identity.visualFidelityApproved, false, 'Continuation02 cannot approve identity');
    }
    exact(pick(old.item.identity, identityFields), entry.subject.identity.previous, `Continuation02 historical identity changed: ${id}`);
    exact(pick(now.item.identity, identityFields), entry.subject.identity.current, `Continuation02 current identity changed: ${id}`);
    exact(old.item.matrix.CG01.themeSource, entry.subject.cg01ThemeSource.previous, `Continuation02 historical CG01 source changed: ${id}`);
    exact(now.item.matrix.CG01.themeSource, entry.subject.cg01ThemeSource.current, `Continuation02 current CG01 source changed: ${id}`);
    const identity = restore(now.item.identity, entry.subject.identity.previous, identityFields, old.item.identity);
    const matrix = ordered({ ...now.item.matrix, CG01: restore(now.item.matrix.CG01,
      { themeSource: entry.subject.cg01ThemeSource.previous }, ['themeSource'], old.item.matrix.CG01) }, old.item.matrix);
    const subject = ordered({ ...now.item, identity, matrix }, old.item);
    exact(subject, old.item, `Continuation02 subject changed outside current-target fields: ${id}`);
    result.subjects[now.index] = subject;
    for (const [family, fields] of [['entries', entryFields], ['backgrounds', ['characterContext']]]) {
      const pins = entry[family];
      for (const source of [published, projected]) exact(source[family].filter(item => item.characterId === id).map(item => item.id), pins.map(pin => pin.id), `Continuation02 ${family} cohort/order changed: ${id}`);
      for (const pin of pins) {
        const previous = only(published[family], item => item.id === pin.id, `Continuation02 historical ${pin.id}`);
        const current = only(projected[family], item => item.id === pin.id, `Continuation02 current ${pin.id}`);
        assert.equal(current.index, previous.index, `Continuation02 ${family} order changed`);
        for (const record of [previous.item, current.item]) {
          assert.equal(record.characterId, id); assert.equal(record.type, pin.type);
        }
        exact(pick(previous.item, fields), pin.previous, `Continuation02 historical ${family} fields changed: ${pin.id}`);
        exact(pick(current.item, fields), pin.current, `Continuation02 current ${family} fields changed: ${pin.id}`);
        const restored = restore(current.item, pin.previous, fields, previous.item);
        exact(restored, previous.item, `Continuation02 ${family} changed outside current-target fields: ${pin.id}`);
        result[family][current.index] = restored;
        if (family === 'entries') entryCount++; else backgroundCount++;
      }
    }
  }
  const quarantine = contract.quarantine;
  assert.equal(quarantine.characterId, 'batman_tdk');
  const hero = only(heroes, hero => hero.id === quarantine.characterId, 'Batman runtime source').item;
  const gate = getQuarantinedCanonSprite(hero);
  exact(gate, quarantine.record, 'Batman quarantine must remain the exact reviewed runtime edition');
  assert.equal(getHeroSpriteSheetSrc(hero), '', 'Rejected Batman bitmap cannot be selected');
  assert.equal(quarantine.bitmap.path, gate.asset);
  assert.equal(quarantine.bitmap.sha256, gate.sha256);
  assert.equal(isCgReferenceImageAttested(root, quarantine.bitmap), true, 'Rejected Batman bitmap must remain byte-exact and readable as an archive');
  const previous = only(published.subjects, item => item.characterId === hero.id, 'Historical Batman subject');
  const current = only(projected.subjects, item => item.characterId === hero.id, 'Current Batman subject');
  assert.equal(previous.index, current.index);
  const warning = getCgQuarantineSelectionMessage(gate, null);
  assert.equal(previous.item.identity.localCandidates.length, 1);
  assert.equal(previous.item.identity.localCandidates[0].path, gate.asset);
  const missing = [...previous.item.identity.missing, warning];
  const identity = { ...previous.item.identity,
    localCandidates: previous.item.identity.localCandidates.map(candidate => ({ ...candidate, ...getCgQuarantineVisualFlags(candidate.path, gate, null) })),
    runtimeSpriteQuarantine: { characterId: hero.id, ...gate }, missing };
  exact(current.item, { ...previous.item, identity }, 'Only the exact Batman quarantine subject fields may change');
  result.subjects[current.index] = previous.item;
  const oldEntry = only(published.entries, item => item.characterId === hero.id && item.type === 'characterSolo', 'Historical Batman CG01');
  const nowEntry = only(projected.entries, item => item.id === oldEntry.item.id, 'Current Batman CG01');
  assert.equal(nowEntry.index, oldEntry.index);
  assert.equal(oldEntry.item.status, 'needs-reference');
  assert.equal(oldEntry.item.generatedImageCount, 0);
  assert.equal(oldEntry.item.galleryRegistered, false);
  assert.equal(oldEntry.item.currentAssets, null);
  exact(nowEntry.item, { ...oldEntry.item, missing }, 'Batman CG01 remains non-produced with only its quarantine warning');
  result.entries[nowEntry.index] = oldEntry.item;
  const oldBackground = only(published.backgrounds, item => item.characterId === hero.id && item.type === 'characterSolo', 'Historical Batman CG01 background');
  const nowBackground = only(projected.backgrounds, item => item.id === oldBackground.item.id, 'Current Batman CG01 background');
  assert.equal(nowBackground.index, oldBackground.index);
  exact(nowBackground.item, oldBackground.item, 'Batman quarantine cannot invent a new CG background');
  assert.equal(nowBackground.item.currentImageUsesThisBackground, false);
  return { projected: ordered(result, published), evidence: {
    mode: 'closed-continuation02-current-target-and-negative-quarantine', amendment: CG_CONTINUATION02_METADATA_AMENDMENT_PATH,
    amendmentSha256: digest(fixtureBytes), actorCount: contract.actors.length, frozenSourceFiles: sourceFiles.length,
    entryCount, backgroundCount, quarantinedActor: hero.id, quarantineObjectsVerified: 3,
    changesGenerationHistory: false, changesDeliveredImages: false, changesRewardsOrApprovals: false,
    identityAuthority: false, visualFidelityApproved: false, fullSource1to1Verified: false
  } };
}
