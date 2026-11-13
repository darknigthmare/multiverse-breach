import assert from 'node:assert/strict';
import { projectCgReviewedRuntimeAmendment } from './cgReviewedRuntimeAmendment.mjs';
import { projectCgSource64Amendment } from './cgSource64Amendment.mjs';
import { projectCgReviewedAvailabilityAmendment } from './cgReviewedAvailabilityAmendment.mjs';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { CG_PUBLISHED_DELIVERY_METADATA_PINS, loadCgPublishedDeliveryMetadata } from './cgPublishedDeliveryMetadata.mjs';

// This append-only amendment changes current unqualified local-candidate
// metadata only. It cannot rewrite inspected CG evidence or generation history.
export const CG_LOCAL_CANDIDATE_AMENDMENT_PATH = 'scripts/fixtures/cg-local-candidates-amendment-2026-11-09.json';
export const CG_LOCAL_CANDIDATE_AMENDMENT_SHA256 = '8777754e2c113b71661902e21529ec217440f9c15ac5f34467397441a34bd2a3';
const digest = value => createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const exact = (actual, expected, label) => {
  assert.equal(digest(JSON.stringify(actual)), digest(JSON.stringify(expected)), label);
  assert.deepEqual(actual, expected, label);
};

export function verifyCgCandidateAsset(root, pin) {
  assert.match(pin?.path || '', /^\/sprites\/[a-zA-Z0-9/_.,+-]+\.png$/);
  assert.equal(pin.path.includes('..'), false, 'Candidate path traversal');
  const file = path.join(root, 'public', pin.path.slice(1));
  assert.ok(lstatSync(file).isFile(), `Candidate must remain a real regular public image: ${pin.path}`);
  const bytes = readFileSync(file);
  assert.equal(bytes.length, pin.bytes, `Candidate byte count changed: ${pin.path}`);
  assert.equal(digest(bytes), pin.sha256, `Candidate image changed: ${pin.path}`);
  assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `Candidate is not PNG: ${pin.path}`);
  assert.equal(bytes.readUInt32BE(16), pin.width, `Candidate width changed: ${pin.path}`);
  assert.equal(bytes.readUInt32BE(20), pin.height, `Candidate height changed: ${pin.path}`);
}

export function validateCgLocalCandidateAmendment({ root, rebuilt, published, publishedText, reportText }) {
  const bytes = readFileSync(path.join(root, CG_LOCAL_CANDIDATE_AMENDMENT_PATH));
  assert.equal(digest(bytes), CG_LOCAL_CANDIDATE_AMENDMENT_SHA256, 'Current candidate amendment changed; append a reviewed amendment instead of rewriting its pins');
  const amendment = JSON.parse(bytes);
  assert.equal(amendment.schemaVersion, 1);
  assert.equal(amendment.subjectCount, 606);
  assert.equal(amendment.entries.length, 606);
  assert.equal(amendment.identityAuthority, false);
  assert.equal(amendment.changesGenerationHistory, false);
  assert.equal(amendment.source1to1Verified, false);
  exact(amendment.projectionFields, ['subjects[].identity.localCandidates'], 'Candidate amendment may project only localCandidates');
  assert.equal(digest(publishedText), amendment.historicalPlan.sha256, 'Historical CG production plan changed');
  assert.equal(digest(reportText), amendment.historicalReport.sha256, 'Historical CG production report changed');
  assert.equal(amendment.historicalPlan.path, 'docs/cg/roster-production-2026-10-18.json');
  assert.equal(amendment.historicalReport.path, 'docs/cg/roster-production-2026-10-18.md');
  return projectCgCandidateEntries({ root, rebuilt, published, entries: amendment.entries });
}

function projectCgCandidateEntries({ root, rebuilt, published, entries }) {
  assert.equal(rebuilt.subjects.length, published.subjects.length, 'CG subject count changed');
  const projected = structuredClone(rebuilt);
  const indices = new Map(published.subjects.map((subject, index) => [subject.characterId, index]));
  assert.equal(indices.size, published.subjects.length, 'Duplicate historical CG subject');
  const dossiers = new Map(readJson(path.join(root, 'docs/rift-dossiers/catalog.json')).entrees
    .filter(entry => entry.famille === 'arc-personnage').map(entry => [entry.id, entry]));
  const nativeRegistries = new Map(), subjectIds = [];
  for (const entry of entries) {
    assert.ok(!subjectIds.includes(entry.characterId), 'Duplicate amended CG owner');
    const index = indices.get(entry.characterId);
    assert.notEqual(index, undefined, `Unknown amended CG owner: ${entry.characterId}`);
    const frozen = published.subjects[index], current = rebuilt.subjects[index];
    assert.equal(current?.characterId, entry.characterId, 'Current CG subject ID/order changed');
    for (const subject of [frozen, current]) {
      assert.equal(subject.universe, entry.universe, `${entry.characterId}: CG source universe changed`);
      assert.equal(subject.characterArcStageId, entry.characterArcStageId, `${entry.characterId}: CG source stage changed`);
      assert.equal(subject.identity.visualFidelityApproved, false, `${entry.characterId}: candidate artwork cannot approve CG fidelity`);
    }
    exact(frozen.identity.localCandidates, entry.previousLocalCandidates, `${entry.characterId}: historical candidate declaration changed`);
    exact(current.identity.localCandidates, entry.currentLocalCandidates, `${entry.characterId}: current candidate declaration changed`);
    assert.equal(entry.previousLocalCandidates.length, 1);
    assert.equal(entry.currentLocalCandidates.length, 1);
    for (const list of [entry.previousLocalCandidates, entry.currentLocalCandidates]) {
      assert.equal(list[0].exists, true, `${entry.characterId}: candidate image must exist`);
      assert.equal(list[0].role, 'historical-project-image-not-source-fidelity-approval');
    }
    assert.equal(entry.previousPublicFile.path, entry.previousLocalCandidates[0].path);
    assert.equal(entry.currentPublicFile.path, entry.currentLocalCandidates[0].path);
    verifyCgCandidateAsset(root, entry.previousPublicFile);
    verifyCgCandidateAsset(root, entry.currentPublicFile);
    const dossier = dossiers.get(entry.characterArcStageId);
    assert.ok(dossier, `${entry.characterId}: current source dossier missing`);
    exact([...new Set([...(dossier.candidatsReferencesLocalesAudit || []), ...(dossier.referencesLocalesOpenAI || [])].filter(Boolean))],
      entry.currentLocalCandidates.map(candidate => candidate.path), `${entry.characterId}: current dossier candidate links differ`);
    assert.match(entry.nativeRegistry.path, /^src\/game\/combat\/character(?:SpriteCorrections|Animations)[a-zA-Z0-9.]*\.generated\.json$/);
    let registry = nativeRegistries.get(entry.nativeRegistry.path);
    if (!registry) {
      const registryBytes = readFileSync(path.join(root, entry.nativeRegistry.path));
      assert.equal(digest(registryBytes), entry.nativeRegistry.sha256, `Native candidate registry changed: ${entry.nativeRegistry.path}`);
      registry = { document: JSON.parse(registryBytes), sha256: digest(registryBytes) };
      nativeRegistries.set(entry.nativeRegistry.path, registry);
    }
    assert.equal(registry.sha256, entry.nativeRegistry.sha256, `${entry.characterId}: native registry pin differs from its verified bytes`);
    const matches = (registry.document.entries || []).filter(native => native.heroId === entry.characterId && native.sheet === entry.currentPublicFile.path);
    assert.equal(matches.length, 1, `${entry.characterId}: native candidate must have exactly one source owner`);
    const native = matches[0];
    const actual = Object.fromEntries(['heroId', 'universe', 'sheet', 'sha256', 'width', 'height', 'frameWidth', 'frameHeight', 'columns', 'rows', 'sourceWork']
      .map(key => [key, native[key] ?? null]));
    actual.frames = Number.isInteger(native.frames) ? native.frames : Array.isArray(native.frames) ? native.frames.length : null;
    exact(actual, entry.nativeEntry, `${entry.characterId}: native candidate identity/layout changed`);
    assert.equal(native.universe, entry.universe);
    assert.equal(native.sha256, entry.currentPublicFile.sha256);
    assert.equal(native.width, entry.currentPublicFile.width);
    assert.equal(native.height, entry.currentPublicFile.height);
    projected.subjects[index].identity.localCandidates = structuredClone(entry.previousLocalCandidates);
    subjectIds.push(entry.characterId);
  }
  return { projected, subjectIds, nativeRegistryCount: nativeRegistries.size };
}


export const CG_CURRENT_DESCRIPTOR_AMENDMENT_PATH = 'scripts/fixtures/cg-current-descriptors-amendment-2026-11-09.json';
export const CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256 = '71891cbf57f7f6a580993301db9ee4ba9efc7ca0dd1e7b3d875e9975f31a2ce0';
const jsonData = value => JSON.parse(JSON.stringify(value));
function verifyFrozenCgFile(root, pin) {
  assert.match(pin.sha256 || '', /^[a-f0-9]{64}$/);
  assert.equal(pin.path.split('/').includes('..'), false, 'Frozen CG source path traversal');
  const file = pin.path.startsWith('/')
    ? path.resolve(root, 'public', pin.path.slice(1)) : path.resolve(root, pin.path);
  assert.ok(file.startsWith(path.resolve(root) + path.sep), 'Frozen CG source escaped the project');
  assert.ok(lstatSync(file).isFile(), `Frozen CG source must remain a regular file: ${pin.path}`);
  const bytes = readFileSync(file);
  assert.equal(bytes.length, pin.bytes, `Frozen CG source byte count changed: ${pin.path}`);
  assert.equal(digest(bytes), pin.sha256, `Frozen CG source changed: ${pin.path}`);
}
const descriptorValue = (plan, fieldPath) => fieldPath.split('.').slice(1)
  .reduce((value, key) => value?.[key], plan);
function restoreDescriptorValue(plan, fieldPath, previous) {
  const keys = fieldPath.split('.').slice(1), key = keys.pop();
  const parent = keys.reduce((value, part) => value?.[part], plan);
  assert.ok(parent && Object.hasOwn(parent, key), `Pinned descriptor field missing: ${fieldPath}`);
  parent[key] = structuredClone(previous);
}

function validateCurrentDescriptorAmendment({ root, rebuilt, published, projected, heroes, currentAmendment = null, verifyHistoricalCgBitmaps = true }) {
  const bytes = readFileSync(path.join(root, CG_CURRENT_DESCRIPTOR_AMENDMENT_PATH));
  assert.equal(digest(bytes), CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256, 'Current descriptor amendment changed; append a reviewed record instead');
  const amendment = currentAmendment || JSON.parse(bytes);
  assert.equal(amendment.schemaVersion, 1);
  assert.equal(amendment.fieldCount, 211);
  assert.equal(amendment.changes.length, 211);
  assert.equal(amendment.identityAuthority, false);
  assert.equal(amendment.changesGenerationHistory, false);
  assert.equal(amendment.source1to1Verified, false);
  assert.equal(amendment.priorCandidateAmendment.path, CG_LOCAL_CANDIDATE_AMENDMENT_PATH);
  assert.equal(amendment.priorCandidateAmendment.sha256, CG_LOCAL_CANDIDATE_AMENDMENT_SHA256);
  for (const pin of [amendment.historicalPlan, amendment.historicalReport, amendment.priorCandidateAmendment]) verifyFrozenCgFile(root, pin);
  const currentSubjects = new Map(rebuilt.subjects.map(subject => [subject.characterId, subject]));
  const historicalSubjects = new Map(published.subjects.map(subject => [subject.characterId, subject]));
  const projectedSubjects = new Map(projected.subjects.map(subject => [subject.characterId, subject]));
  const byHero = new Map(heroes.map(hero => [hero.id, hero]));
  const dossiers = new Map(readJson(path.join(root, 'docs/rift-dossiers/catalog.json')).entrees
    .filter(entry => entry.famille === 'arc-personnage').map(entry => [entry.id, entry]));
  const riftPins = new Map();
  for (const pin of amendment.currentRiftSourcePins) {
    assert.ok(!riftPins.has(pin.characterId), 'Duplicate current descriptor owner');
    const current = currentSubjects.get(pin.characterId), frozen = historicalSubjects.get(pin.characterId);
    const hero = byHero.get(pin.characterId);
    assert.ok(current && frozen && hero, `Unknown current descriptor owner: ${pin.characterId}`);
    for (const subject of [current, frozen]) {
      assert.equal(subject.universe, pin.universe, `${pin.characterId}: current descriptor universe changed`);
      assert.equal(subject.characterArcStageId, pin.characterArcStageId, `${pin.characterId}: current descriptor stage changed`);
    }
    assert.equal(hero.universe, pin.universe);
    assert.equal(hero.name, pin.currentCharacterName);
    assert.equal(current.characterName, pin.currentCharacterName);
    const dossier = dossiers.get(pin.characterArcStageId);
    assert.ok(dossier, `${pin.characterId}: current descriptor dossier missing`);
    exact(Object.fromEntries(['id', 'famille', 'univers', 'personnage', 'nom', 'referenceUrls', 'ancragesVisuels']
      .map(key => [key, dossier[key] ?? null])), pin.dossier, `${pin.characterId}: current descriptor source declarations changed`);
    riftPins.set(pin.characterId, pin);
  }
  // These thirty delivered CG records retain every prompt, inspected-reference
  // limitation and asset. A current runtime 'sword' descriptor cannot prove a
  // full Rebellion blade that the historical evidence only shows as a hilt.
  assert.equal(amendment.deliveredEntries.length, 30);
  exact(amendment.deliveredDescriptorScope.characters,
    ['horizon_zero_dawn_aloy', 'devil_may_cry_dante'], 'Only the two declared delivered descriptor owners may be amended');
  for (const qualified of amendment.qualifiedIdentities) {
    const frozen = historicalSubjects.get(qualified.characterId), current = projectedSubjects.get(qualified.characterId);
    assert.ok(frozen && current);
    assert.equal(current.universe, qualified.universe);
    assert.equal(current.characterArcStageId, qualified.characterArcStageId);
    exact(jsonData(current.identity), frozen.identity, `${qualified.characterId}: qualified identity metadata changed`);
    exact(frozen.identity.equipment, qualified.identityEquipment, `${qualified.characterId}: qualified equipment changed`);
    exact(frozen.identity.identityVisualReferences, qualified.identityVisualReferences, `${qualified.characterId}: qualified identity references changed`);
    exact(frozen.identity.sourceEvidenceFiles, qualified.sourceEvidenceFiles, `${qualified.characterId}: inspected source receipts changed`);
  }
  const oldEntries = new Map(published.entries.map(entry => [entry.id, entry]));
  const newEntries = new Map(rebuilt.entries.map(entry => [entry.id, entry]));
  const roster = readJson(path.join(root, 'src/game/cg/cgRosterArtwork.generated.json'));
  const rosterEntries = new Map(roster.entries.map(entry => [entry.id, entry]));
  for (const pin of amendment.deliveredEntries) {
    const frozen = oldEntries.get(pin.id), current = newEntries.get(pin.id), receipt = rosterEntries.get(pin.id);
    assert.ok(frozen && current && receipt, `Delivered CG source disappeared: ${pin.id}`);
    assert.equal(frozen.characterId, pin.characterId);
    assert.equal(digest(JSON.stringify(frozen)), pin.frozenEntrySha256, `Frozen delivered CG entry changed: ${pin.id}`);
    exact(jsonData(current), frozen, `Delivered CG entry changed: ${pin.id}`);
    assert.equal(frozen.promptBrief, pin.promptBrief, `Delivered CG prompt changed: ${pin.id}`);
    assert.equal(current.generatedImageCount, 1);
    exact(current.currentAssets, pin.currentAssets, `Delivered CG assets changed: ${pin.id}`);
    assert.equal(current.sourceEvidence, pin.sourceEvidence);
    assert.equal(receipt.characterId, pin.characterId);
    for (const field of ['promptId', 'promptFile', 'referenceReviewFile']) assert.equal(receipt[field], pin[field], `CG generation receipt changed: ${pin.id}`);
  }
  for (const pin of amendment.frozenEvidenceFiles) verifyFrozenCgFile(root, pin);
  if (verifyHistoricalCgBitmaps) for (const pin of amendment.frozenAssets) verifyFrozenCgFile(root, pin);
  const pomni = amendment.pomni, oldPomni = historicalSubjects.get(pomni.characterId), currentPomni = currentSubjects.get(pomni.characterId);
  const pomniHero = byHero.get(pomni.characterId);
  assert.equal(pomni.characterId, 'pomni'); assert.equal(pomni.universe, 'Digital Circus');
  assert.equal(oldPomni.characterName, pomni.previousName);
  assert.equal(currentPomni.characterName, pomni.currentName);
  assert.equal(pomniHero.name, pomni.currentName);
  assert.equal(pomniHero.legacyRosterName, pomni.legacyRosterName);
  for (const subject of [oldPomni, currentPomni]) {
    assert.equal(subject.universe, pomni.universe); assert.equal(subject.characterArcStageId, pomni.characterArcStageId);
    assert.equal(subject.identity.evidenceStatus, 'needs-reference');
    assert.equal(subject.identity.visualFidelityApproved, false);
    exact(subject.identity.identityVisualReferences || [], [], 'Unproduced Pomni cannot gain qualified image evidence');
  }
  const oldPomniEntries = published.entries.filter(entry => entry.characterId === pomni.characterId);
  const currentPomniEntries = rebuilt.entries.filter(entry => entry.characterId === pomni.characterId);
  assert.equal(oldPomniEntries.length, 1); assert.equal(currentPomniEntries.length, 1);
  for (const entry of [...oldPomniEntries, ...currentPomniEntries]) {
    assert.equal(entry.id, pomni.unproducedEntryId); assert.equal(entry.generatedImageCount, 0);
    assert.equal(entry.currentAssets, null); assert.equal(entry.galleryRegistered, false);
    assert.equal(entry.status, 'needs-reference');
  }
  const seen = new Set(), kinds = new Map();
  for (const change of amendment.changes) {
    assert.ok(!seen.has(change.path), 'Duplicate current descriptor field'); seen.add(change.path);
    assert.match(change.path, /^plan\.(?:subjects|entries|backgrounds)\.\d+\.[a-zA-Z0-9.]+$/);
    const keys = change.path.split('.'), family = keys[1], index = Number(keys[2]);
    const current = rebuilt[family]?.[index], frozen = published[family]?.[index];
    assert.ok(current && frozen);
    assert.equal(current.characterId, change.characterId); assert.equal(frozen.characterId, change.characterId);
    assert.equal(current.id || current.characterId, change.objectId); assert.equal(frozen.id || frozen.characterId, change.objectId);
    const source = riftPins.get(change.characterId);
    assert.ok(source, `Current descriptor has no pinned actor source: ${change.characterId}`);
    assert.equal(source.universe, change.universe); assert.equal(source.characterArcStageId, change.characterArcStageId);
    if (change.kind === 'pomni-unproduced-planning-label') {
      assert.equal(change.characterId, 'pomni');
      assert.ok(['plan.subjects.41.characterName', 'plan.entries.288.promptBrief', 'plan.backgrounds.288.characterContext'].includes(change.path));
    } else {
      assert.ok(['runtime-equipment-descriptor', 'runtime-technique-descriptor'].includes(change.kind));
      assert.equal(family, 'backgrounds'); assert.equal(keys[3], 'sourceContext');
      assert.equal(Number(keys[4]), change.kind === 'runtime-equipment-descriptor' ? 3 : 6);
      exact(current.sourceContext, source.dossier.ancragesVisuels,
        `${change.characterId}: current game-derived context no longer matches its pinned Rift declaration`);
      assert.equal(current.currentImageUsesThisBackground, frozen.currentImageUsesThisBackground,
        `${change.characterId}: descriptor metadata cannot change background-use history`);
    }
    exact(descriptorValue(published, change.path), change.previous, `Historical descriptor changed: ${change.path}`);
    exact(descriptorValue(rebuilt, change.path), change.current, `Current descriptor changed: ${change.path}`);
    restoreDescriptorValue(projected, change.path, change.previous);
    kinds.set(change.kind, (kinds.get(change.kind) || 0) + 1);
  }
  assert.equal(kinds.get('pomni-unproduced-planning-label'), 3);
  assert.equal(kinds.get('runtime-equipment-descriptor'), 207);
  assert.equal(kinds.get('runtime-technique-descriptor'), 1);
  return { fields: seen.size, characters: riftPins.size, deliveredEntriesPreserved: amendment.deliveredEntries.length };
}

// Both the CLI and its test use this same validator. The pre-existing private
// evidence projection below remains strict, including every original receipt,
// fallback declaration, unproduced-cell constraint and complete final bytes.
export function validateCgRosterProductionSnapshot({ root, rebuilt, heroes: HEROES_DB, catalog: CG_CATALOG,
  serialize: serializeCgRosterProductionPlan, buildReport: buildCgRosterProductionReport, diagnostic = () => {} }) {
  const ROOT = path.resolve(root);
  const publishedText = readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.json'), 'utf8');
  const reportText = readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.md'), 'utf8');
  const digest = value => createHash('sha256').update(value).digest('hex');
  const assertExact = (actual, expected, label) => {
    assert.equal(digest(actual), digest(expected), label);
    assert.ok(actual === expected, label);
  };
  const plan = JSON.parse(publishedText);
  assertExact(buildCgRosterProductionReport(plan), reportText, 'Frozen CG plan must still render its original Markdown byte-for-byte');
  if (digest(publishedText) === CG_GITHUB_2333_PUBLISHED_SHA256) {
    const reviewedRuntime = projectCgReviewedRuntimeAmendment({ root: ROOT, rebuilt, published: plan, publishedText, heroes: HEROES_DB });
    const historical = validateCgGithub2333Snapshot({ root: ROOT, rebuilt: reviewedRuntime.projected, heroes: HEROES_DB, catalog: CG_CATALOG, published: plan, publishedText, reportText,
      serialize: serializeCgRosterProductionPlan, buildReport: buildCgRosterProductionReport, diagnostic });
    return { ...historical, reviewedRuntimeCorrection: reviewedRuntime.evidence };
  }
  const candidateProjection = validateCgLocalCandidateAmendment({ root: ROOT, rebuilt, published: plan, publishedText, reportText });
  const projected = candidateProjection.projected;
  const descriptorProjection = validateCurrentDescriptorAmendment({ root: ROOT, rebuilt, published: plan, projected, heroes: HEROES_DB });
  const rebuiltText = serializeCgRosterProductionPlan(projected);
  if (digest(rebuiltText) === digest(publishedText)) {
    assertExact(rebuiltText, publishedText, 'Complete workspace plan must reproduce byte-for-byte');
    assertExact(buildCgRosterProductionReport(projected), reportText, 'Concise report must reproduce byte-for-byte');
    diagnostic('Historical production snapshot remains byte-exact after both pinned current-reference metadata amendments; no private-source projection used.');
    return { mode: 'candidate-metadata-amendment', candidateSubjects: candidateProjection.subjectIds.length, amendmentSha256: CG_LOCAL_CANDIDATE_AMENDMENT_SHA256, descriptorFields: descriptorProjection.fields, descriptorAmendmentSha256: CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256, deliveredEntriesPreserved: descriptorProjection.deliveredEntriesPreserved, missingPrivateSubjects: [], unproducedCg01: [] };
  }

  // Published inspection history can outlive a private research checkout. Only
  // these known subjects may lose physically absent private image aliases.
  const privateSourceSubjects = new Set(['predator', 'miku', 'noble_six', 'buck', 'bishop', 'sam_carter', 'rin', 'meiko']);
  const unproducedFoundations = new Set(['miku', 'noble_six', 'buck', 'sam_carter', 'rin']);
  const preservation = JSON.parse(readFileSync(path.join(ROOT,
    'docs/cg/Multiverse_Breach_Fidelite_CG.preservation-validation.json'), 'utf8'));
  const sourcePins = preservation.productionRebuild.frozenInputSignatures;
  const fallbackBytes = readFileSync(path.join(ROOT, 'scripts/fixtures/cg-private-source-fallbacks.json'));
  assert.equal(digest(fallbackBytes), 'e6e906db182c881c25649c6c79772c08282ebaf90878dfb900b78ac4d86624fe',
    'Unqualified fallback contract changed; review its readable values and source inputs explicitly');
  const fallbacks = JSON.parse(fallbackBytes);
  assert.equal(fallbacks.notIdentityAuthority, true);
  const dossiers = JSON.parse(readFileSync(path.join(ROOT, 'docs/rift-dossiers/catalog.json'), 'utf8')).entrees;
  const p0 = JSON.parse(readFileSync(path.join(ROOT, 'docs/audits/fidelity-p0-wave4-2026-10-01.json'), 'utf8')).entries;
  const pick = (object, fields) => Object.fromEntries(fields.filter(key => Object.hasOwn(object, key))
    .map(key => [key, object[key]]));
  const imageFile = reference => /^\/(?:sprites|cg|visuals|images)\//.test(reference.path)
    ? path.join(ROOT, 'public', reference.path.slice(1)) : path.resolve(ROOT, reference.path);
  const projectedIds = [], lostQualification = new Set();
  assert.equal(rebuilt.subjects.length, plan.subjects.length);
  for (const [index, published] of plan.subjects.entries()) {
    const current = projected.subjects[index];
    assert.equal(current.characterId, published.characterId, `Subject order changed at ${index}`);
    const references = published.identity.identityVisualReferences || [];
    const missing = references.filter(reference => !existsSync(imageFile(reference)));
    if (!missing.length) continue;
    const id = published.characterId;
    assert.ok(privateSourceSubjects.has(id), `${id}: unexpected missing identity bitmap`);
    assert.ok(missing.every(reference => /(?:^|\/)\.tmp\//.test(reference.path)), `${id}: a public bitmap is missing`);
    assert.ok(published.identity.sourceEvidenceFiles?.length, `${id}: missing public source receipts`);
    // Validate receipt bytes before allowing any metadata projection. Changed
    // source declarations are a regression even when their images are absent.
    for (const file of published.identity.sourceEvidenceFiles) {
      assert.ok(file.startsWith('docs/cg/'), `${id}: source receipt must be public`);
      assert.match(sourcePins[file] || '', /^[a-f0-9]{64}$/, `${id}: source receipt has no frozen public pin`);
      const bytes = readFileSync(path.join(ROOT, file));
      assert.equal(digest(bytes), sourcePins[file], `${id}: source receipt changed: ${file}`);
      const source = JSON.parse(bytes);
      assert.equal(source.characterId || source.heroId, id, `${id}: wrong source receipt owner`);
    }
    const available = references.filter(reference => existsSync(imageFile(reference)));
    for (const reference of available) {
      assert.ok(statSync(imageFile(reference)).isFile(), `${id}: identity bitmap is not a file`);
      assert.equal(digest(readFileSync(imageFile(reference))), reference.sha256, `${id}: identity bitmap changed`);
    }
    assertExact(JSON.stringify(current.identity.identityVisualReferences || []), JSON.stringify(available),
      `${id}: current identity references must be exactly the available published subset`);
    assert.equal(current.identity.visualFidelityApproved, false, `${id}: unavailable evidence cannot approve fidelity`);
    if (available.length) {
      const expected = { ...published.identity, identityVisualReferences: available };
      assertExact(JSON.stringify(current.identity), JSON.stringify(expected), `${id}: available-source identity metadata changed`);
      projected.subjects[index].identity = published.identity;
    } else {
      assert.equal(current.identity.evidenceStatus, 'needs-reference', `${id}: absent images cannot qualify identity`);
      assert.ok(current.identity.missing.some(value => value.startsWith('Ouvrir une référence visuelle source')),
        `${id}: missing images must remain an explicit production prerequisite`);
      assert.deepEqual(Object.keys(current.identity), Object.keys(published.identity)
        .filter(key => !['sourceEvidenceFiles', 'identityVisualReferences'].includes(key)), `${id}: unexpected identity fields`);
      const contract = fallbacks.cases[id];
      assert.ok(contract, `${id}: no reviewed unqualified fallback contract`);
      assert.equal(digest(JSON.stringify(contract.expectedIdentity)), contract.expectedIdentitySha256);
      assert.deepEqual(contract.publicSourceReceipts, published.identity.sourceEvidenceFiles.map(file =>
        ({ path: file, sha256: sourcePins[file] })), `${id}: fallback source-receipt contract changed`);
      const hero = HEROES_DB.find(item => item.id === id);
      const dossier = dossiers.find(item => item.id === published.characterArcStageId);
      const pilot = CG_CATALOG.find(item => item.characterId === id && item.type === 'characterSolo');
      assert.ok(hero && dossier, `${id}: fallback source declarations are missing`);
      const inputs = {
        hero: pick(hero, fallbacks.heroInputFields),
        dossier: { id: dossier.id, lockPresent: Boolean(dossier.verrouSourcePersonnage),
          verrouSourcePersonnage: dossier.verrouSourcePersonnage
            ? pick(dossier.verrouSourcePersonnage, fallbacks.dossierLockInputFields) : null,
          referenceUrls: dossier.referenceUrls || [] },
        pilot: pilot ? pick(pilot, ['id', 'continuityId', 'sourceRefs', 'promptSummary']) : null,
        p0: p0.some(item => item.id === id)
      };
      assert.equal(digest(JSON.stringify(inputs)), contract.sourceInputsSha256,
        `${id}: public HEROES/dossier/pilot/P0 fallback inputs changed`);
      assertExact(JSON.stringify(inputs), JSON.stringify(contract.sourceInputs),
        `${id}: readable public fallback declarations differ from their contract`);
      for (const field of fallbacks.expectedFields) {
        assert.ok(Object.hasOwn(current.identity, field), `${id}.identity.${field}: fallback field missing`);
        assertExact(JSON.stringify(current.identity[field]), JSON.stringify(contract.expectedIdentity[field]),
          `${id}.identity.${field}: fallback metadata changed before projection`);
      }
      const availabilityFields = new Set(['incarnation', 'identityLock', 'equipment', 'sourceRefs',
        'evidenceStatus', 'sourceEvidenceFiles', 'identityVisualReferences', 'missing']);
      projected.subjects[index].identity = Object.fromEntries(Object.keys(published.identity).map(key =>
        [key, availabilityFields.has(key) ? published.identity[key] : current.identity[key]]));
      lostQualification.add(id);
    }
    projectedIds.push(id);
  }
  assert.ok(projectedIds.length > 0, 'Plan drift has no physically absent, pinned private source explanation');
  const projectedCells = [];
  for (const [index, published] of plan.entries.entries()) {
    const current = rebuilt.entries[index];
    assert.equal(current?.id, published.id, `Entry order changed at ${index}`);
    if (!lostQualification.has(published.characterId) || published.type !== 'characterSolo'
      || published.generatedImageCount !== 0) continue;
    const id = published.characterId;
    assert.ok(unproducedFoundations.has(id), `${id}: unexpected unproduced CG01 projection`);
    for (const entry of [published, current]) {
      assert.equal(entry.status, 'needs-reference', `${id}: delivered or blocked cells cannot be projected`);
      assert.equal(entry.generatedImageCount, 0);
      assert.equal(entry.galleryRegistered, false);
      assert.equal(entry.currentAssets, null);
      assert.equal(entry.themeStatus, 'needs-reference');
    }
    const subjectIndex = rebuilt.subjects.findIndex(subject => subject.characterId === id);
    const identity = rebuilt.subjects[subjectIndex].identity;
    assert.deepEqual(current.themeSource, [...new Set([...identity.sourceRefs, 'docs/cg/CG_PILOT_REFERENCE_AUDIT.md'])]);
    assert.equal(current.themeContinuity, identity.incarnation);
    assert.deepEqual(current.missing, identity.missing);
    for (const field of ['themeSource', 'themeContinuity', 'missing']) projected.entries[index][field] = published[field];
    const currentCell = rebuilt.subjects[subjectIndex].matrix.CG01;
    const publishedCell = plan.subjects[subjectIndex].matrix.CG01;
    assert.equal(currentCell.entryId, published.id);
    assert.equal(currentCell.generatedImageCount, 0);
    assert.equal(currentCell.status, 'needs-reference');
    assert.deepEqual(currentCell.themeSource, current.themeSource);
    assert.deepEqual(publishedCell.themeSource, published.themeSource);
    // CG01 mirrors only themeSource into the matrix; every other cell field,
    // all delivered artwork, and the remaining matrix stay byte-exact below.
    projected.subjects[subjectIndex].matrix.CG01.themeSource = publishedCell.themeSource;
    projectedCells.push(id);
  }
  assert.equal(projectedCells.length, new Set(projectedCells).size);
  const projectedText = serializeCgRosterProductionPlan(projected);
  const firstDifference = (actual, expected, location = 'plan') => {
    if (actual === expected) return null;
    if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') return location;
    const keys = Object.keys(expected);
    if (Object.keys(actual).join('\0') !== keys.join('\0')) return `${location}.keys`;
    for (const key of keys) {
      const changed = firstDifference(actual[key], expected[key], `${location}.${key}`);
      if (changed) return changed;
    }
    return null;
  };
  const unexpectedPath = digest(projectedText) === digest(publishedText) ? null : firstDifference(projected, plan);
  assertExact(projectedText, publishedText,
    `Plan changed outside pinned current-reference metadata and private-source availability amendments${unexpectedPath ? ` at ${unexpectedPath}` : ''}`);
  assertExact(buildCgRosterProductionReport(projected), reportText,
    'Concise report must remain exact after the validated source-availability projection');
  diagnostic(`Pinned private sources unavailable for ${projectedIds.join(', ')}; derived unproduced CG01 only: ${projectedCells.join(', ')}; current candidate metadata amended for ${candidateProjection.subjectIds.length} exact native owners and ${descriptorProjection.fields} exact descriptor fields; delivered CG records unchanged.`);
  return { mode: 'candidate-metadata-and-source-availability-amendment', candidateSubjects: candidateProjection.subjectIds.length, amendmentSha256: CG_LOCAL_CANDIDATE_AMENDMENT_SHA256, descriptorFields: descriptorProjection.fields, descriptorAmendmentSha256: CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256, deliveredEntriesPreserved: descriptorProjection.deliveredEntriesPreserved, missingPrivateSubjects: projectedIds, unproducedCg01: projectedCells };
}

export const CG_GITHUB_2333_PUBLISHED_SHA256 = 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e';
export const CG_SOURCE_METADATA_AMENDMENT_PATH = 'scripts/fixtures/cg-source-metadata-amendment-2026-11-13.json';
export const CG_SOURCE_METADATA_AMENDMENT_SHA256 = 'eba38c68b819869fc4cc31fd8b430c8562c9cc763fdc1c76a2ed632e30fbb0b4';

function validateCgGithub2333Snapshot({ root, rebuilt, heroes, catalog, published, publishedText, reportText, serialize, buildReport, diagnostic }) {
  const bytes = readFileSync(path.join(root, CG_SOURCE_METADATA_AMENDMENT_PATH));
  assert.equal(digest(bytes), CG_SOURCE_METADATA_AMENDMENT_SHA256, 'Nov13 CG source metadata amendment changed; append a reviewed amendment');
  const amendment = JSON.parse(bytes);
  assert.equal(amendment.schemaVersion, 1);
  assert.equal(amendment.upstreamMaster, '2333c2c0c524414c6c7ab84ca86d7e3e40c187ac');
  assert.equal(amendment.identityAuthority, false);
  assert.equal(amendment.changesGenerationHistory, false);
  assert.equal(amendment.source1to1Verified, false);
  assert.equal(amendment.captureValidationScope, 'metadata-only');
  assert.equal(amendment.historicalCgMediaRevalidated, false);
  assert.equal(amendment.historicalPlan.path, 'docs/cg/roster-production-2026-10-18.json');
  assert.equal(amendment.historicalReport.path, 'docs/cg/roster-production-2026-10-18.md');
  assert.equal(digest(publishedText), amendment.historicalPlan.sha256);
  assert.equal(digest(reportText), amendment.historicalReport.sha256);
  assert.equal(amendment.priorCandidateAmendment.path, CG_LOCAL_CANDIDATE_AMENDMENT_PATH);
  assert.equal(amendment.priorCandidateAmendment.sha256, CG_LOCAL_CANDIDATE_AMENDMENT_SHA256);
  assert.equal(amendment.priorDescriptorAmendment.path, CG_CURRENT_DESCRIPTOR_AMENDMENT_PATH);
  assert.equal(amendment.priorDescriptorAmendment.sha256, CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256);
  for (const pin of [amendment.historicalPlan, amendment.historicalReport, amendment.priorCandidateAmendment, amendment.priorDescriptorAmendment]) verifyFrozenCgFile(root, pin);
  const priorCandidates = readJson(path.join(root, amendment.priorCandidateAmendment.path));
  const priorDescriptors = readJson(path.join(root, amendment.priorDescriptorAmendment.path));
  assert.equal(priorCandidates.entries.length, 606);
  assert.equal(priorDescriptors.changes.length, 211);
  assert.equal(amendment.candidateSubjectCount, 604);
  assert.equal(amendment.candidateSelection.length, 604);
  assert.equal(amendment.descriptorFieldCount, 211);
  assert.equal(amendment.descriptorChanges.length, 211);
  const seen = new Set();
  const entries = amendment.candidateSelection.map(selection => {
    assert.ok(Number.isInteger(selection.priorEntryIndex));
    const entry = priorCandidates.entries[selection.priorEntryIndex];
    assert.ok(entry, 'Unknown prior candidate index');
    for (const key of ['characterId', 'universe', 'characterArcStageId']) assert.equal(selection[key], entry[key], 'Candidate receipt binding changed');
    assert.ok(!seen.has(entry.characterId), 'Duplicate selected current CG candidate');
    seen.add(entry.characterId);
    return entry;
  });
  assert.equal(amendment.excludedPriorCandidateOwners.length, 2);
  exact(amendment.excludedPriorCandidateOwners.map(entry => entry.characterId), ['hicks', 'darth_revan'], 'Only current Hicks and quarantined Revan leave the prior candidate projection');
  const oldSubjects = new Map(published.subjects.map(subject => [subject.characterId, subject]));
  const currentSubjects = new Map(rebuilt.subjects.map(subject => [subject.characterId, subject]));
  for (const excluded of amendment.excludedPriorCandidateOwners) {
    assert.ok(!seen.has(excluded.characterId));
    seen.add(excluded.characterId);
    for (const subject of [oldSubjects.get(excluded.characterId), currentSubjects.get(excluded.characterId)]) {
      assert.ok(subject, 'Excluded candidate source disappeared');
      assert.equal(subject.universe, excluded.universe);
      assert.equal(subject.characterArcStageId, excluded.characterArcStageId);
      exact(subject.identity.localCandidates, excluded.publishedLocalCandidates, 'Excluded candidate must retain its published correction/quarantine');
      if (excluded.runtimeSpriteQuarantine) exact(subject.identity.runtimeSpriteQuarantine, excluded.runtimeSpriteQuarantine, 'Rejected source sprite quarantine changed');
    }
  }
  exact([...seen].sort(), priorCandidates.entries.map(entry => entry.characterId).sort(), 'Prior candidate owner partition changed');
  const candidateProjection = projectCgCandidateEntries({ root, rebuilt, published, entries });
  const oldChanges = new Map(priorDescriptors.changes.map(change => [change.path, change]));
  const seenChanges = new Set();
  for (const change of amendment.descriptorChanges) {
    const previous = oldChanges.get(change.previousAmendmentPath);
    assert.ok(previous, 'Unknown prior descriptor amendment field');
    assert.ok(!seenChanges.has(change.previousAmendmentPath), 'Duplicate prior descriptor amendment field');
    seenChanges.add(change.previousAmendmentPath);
    const oldKeys = previous.path.split('.'), newKeys = change.path.split('.');
    assert.equal(newKeys[1], oldKeys[1], 'Descriptor family cannot change');
    assert.equal(newKeys.slice(3).join('.'), oldKeys.slice(3).join('.'), 'Descriptor suffix cannot change');
    exact(change, { ...previous, previousAmendmentPath: previous.path, path: change.path }, 'Only descriptor row indices may move after the new published deliveries');
  }
  assert.equal(seenChanges.size, oldChanges.size);
  assert.equal(amendment.updatedEvidenceFiles.length, 1);
  const updatedEvidence = amendment.updatedEvidenceFiles[0];
  const registryPath = 'src/game/cg/cgRosterArtwork.generated.json';
  assert.equal(updatedEvidence.previous.path, registryPath);
  assert.equal(updatedEvidence.current.path, registryPath);
  exact(updatedEvidence.previous, priorDescriptors.frozenEvidenceFiles.find(pin => pin.path === registryPath), 'Original registry evidence pin changed');
  assert.equal(updatedEvidence.current.sha256, CG_PUBLISHED_DELIVERY_METADATA_PINS[registryPath], 'Only the exact newer published registry may replace that evidence pin');
  verifyFrozenCgFile(root, updatedEvidence.current);
  const currentDescriptors = { ...priorDescriptors,
    historicalPlan: amendment.historicalPlan, historicalReport: amendment.historicalReport,
    frozenEvidenceFiles: priorDescriptors.frozenEvidenceFiles.map(pin => pin.path === registryPath ? updatedEvidence.current : pin),
    changes: amendment.descriptorChanges };
  const descriptorProjection = validateCurrentDescriptorAmendment({ root, rebuilt, published,
    projected: candidateProjection.projected, heroes, currentAmendment: currentDescriptors,
    // The published declaration pins all historical CG output metadata. The
    // production builder independently requires actual pixels; this snapshot
    // comparison never pretends a partial checkout revalidated those bitmaps.
    verifyHistoricalCgBitmaps: false });
  const deliveryMetadata = loadCgPublishedDeliveryMetadata(root);
  deliveryMetadata.assertDeliveredEntries(rebuilt);
  assert.equal(amendment.unchangedGeneratedEntries, 1436);
  const source64Projection = projectCgSource64Amendment({ root, published,
    projected: candidateProjection.projected, heroes, catalog });
  const availabilityProjection = projectCgReviewedAvailabilityAmendment({ root, published,
    projected: source64Projection.projected, heroes, catalog });
  const projectedText = serialize(availabilityProjection.projected);
  assert.equal(digest(projectedText), digest(publishedText), 'Plan changed outside pinned current-reference metadata amendments for GitHub 2333c2c0');
  assert.equal(projectedText, publishedText, 'Projected GitHub 2333c2c0 plan must remain byte-exact');
  assert.equal(buildReport(availabilityProjection.projected), reportText, 'Projected GitHub 2333c2c0 report must remain byte-exact');
  diagnostic('GitHub 2333c2c0 snapshot is byte-exact after closed candidate, descriptor, current-source and historical-reference-availability projections; all 1436 published delivery declarations are preserved. Snapshot comparison does not revalidate historical CG pixels.');
  return { mode: 'github-2333-source-metadata-amendment', candidateSubjects: candidateProjection.subjectIds.length,
    amendmentSha256: CG_SOURCE_METADATA_AMENDMENT_SHA256, descriptorFields: descriptorProjection.fields,
    descriptorAmendmentSha256: CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256,
    deliveredEntriesPreserved: 1436, deliveredDescriptorEntriesPreserved: descriptorProjection.deliveredEntriesPreserved,
    publishedPlanSha256: CG_GITHUB_2333_PUBLISHED_SHA256,
    currentSourceMetadataAmendment: source64Projection.evidence,
    historicalReferenceAvailabilityAmendment: availabilityProjection.evidence,
    historicalCgMediaRevalidated: false, missingPrivateSubjects: [], unproducedCg01: [] };
}
