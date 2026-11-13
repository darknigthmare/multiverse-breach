import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { register } from 'node:module';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { CG_CATALOG } = await import('../src/game/cg/cgCatalog.js');
const { buildCgRosterProductionMetadataPlan, serializeCgRosterProductionPlan, buildCgRosterProductionReport } = await import('./buildCgRosterProductionPlan.mjs');
const { loadCgPublishedDeliveryMetadata, CG_PUBLISHED_DELIVERY_METADATA_PINS } = await import('./cgPublishedDeliveryMetadata.mjs');
const { validateCgRosterProductionSnapshot, CG_LOCAL_CANDIDATE_AMENDMENT_SHA256, CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256,
  CG_SOURCE_METADATA_AMENDMENT_SHA256 } = await import('./cgRosterPlanSnapshot.mjs');
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = file => readFileSync(new URL('../' + file, import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const metadata = loadCgPublishedDeliveryMetadata(ROOT);
let resultPromise;
const result = () => resultPromise ||= buildCgRosterProductionMetadataPlan();
const validate = plan => validateCgRosterProductionSnapshot({ root: ROOT, rebuilt: plan,
  heroes: HEROES_DB, catalog: CG_CATALOG, serialize: serializeCgRosterProductionPlan, buildReport: buildCgRosterProductionReport });

test('the separate source-plan API explicitly checks metadata and preserves all 1436 published delivery declarations', async () => {
  const envelope = await result();
  assert.equal(envelope.validationScope, 'metadata-only');
  assert.equal(envelope.physicalMediaChecked, false);
  assert.deepEqual(envelope.deliveryMetadataPins, CG_PUBLISHED_DELIVERY_METADATA_PINS);
  assert.equal(envelope.plan.summary.generated, 1436);
  assert.equal(envelope.plan.entries.length, 3248);
  assert.equal(envelope.plan.subjects.length, 1912);
  metadata.assertDeliveredEntries(envelope.plan);
});

test('the historical snapshot is exact after closed candidate, descriptor, current-source, availability and Revan amendments', async () => {
  const proof = validate((await result()).plan);
  assert.equal(proof.mode, 'github-2333-source-metadata-amendment');
  assert.equal(proof.candidateSubjects, 604);
  assert.equal(proof.descriptorFields, 211);
  assert.equal(proof.amendmentSha256, CG_SOURCE_METADATA_AMENDMENT_SHA256);
  assert.equal(proof.deliveredEntriesPreserved, 1436);
  assert.equal(proof.deliveredDescriptorEntriesPreserved, 30);
  assert.equal(proof.historicalCgMediaRevalidated, false);
  assert.equal(proof.reviewedRuntimeCorrection.objectsVerified, 3);
  assert.equal(proof.reviewedRuntimeCorrection.visualFidelityApproved, false);
  assert.ok(proof.currentSourceMetadataAmendment);
  assert.ok(proof.historicalReferenceAvailabilityAmendment);
  assert.equal(hash(read('scripts/fixtures/cg-local-candidates-amendment-2026-11-09.json')), CG_LOCAL_CANDIDATE_AMENDMENT_SHA256);
  assert.equal(hash(read('scripts/fixtures/cg-current-descriptors-amendment-2026-11-09.json')), CG_CURRENT_DESCRIPTOR_AMENDMENT_SHA256);
});

test('metadata reconstruction cannot rewrite prompts, paths, references, approvals, revisions or delivery totals', async t => {
  const plan = (await result()).plan;
  const index = plan.entries.findIndex(entry => entry.generatedImageCount === 1);
  const mutate = edit => {
    const entries = plan.entries.slice();
    entries[index] = structuredClone(entries[index]);
    edit(entries[index]);
    return { ...plan, entries };
  };
  const mutations = {
    prompt: entry => { entry.promptBrief = 'Unreviewed replacement prompt'; },
    assetPath: entry => { entry.currentAssets.source.path = '/cg/unreviewed/replacement.png'; },
    reference: entry => { entry.sourceEvidence = 'docs/cg/unreviewed-reference.json'; },
    approval: entry => { entry.fidelityReview = 'approved-1-to-1'; },
    revision: entry => { entry.currentRevisionId = 'unreviewed-revision'; },
    deliveryCount: entry => { entry.generatedImageCount = 2; },
    gallery: entry => { entry.galleryRegistered = false; }
  };
  for (const [name, edit] of Object.entries(mutations)) await t.test(name, () => {
    assert.throws(() => metadata.assertDeliveredEntries(mutate(edit)), /delivered CG entry changed/);
  });
  await t.test('new delivery', () => {
    const extra = { ...plan.entries[index], id: 'cg:unreviewed:new-delivery' };
    assert.throws(() => metadata.assertDeliveredEntries({ ...plan, entries: [...plan.entries, extra] }), /cannot add or remove CG deliveries/);
  });
  await t.test('removed delivery', () => {
    assert.throws(() => metadata.assertDeliveredEntries({ ...plan, entries: plan.entries.filter((_, at) => at !== index) }), /cannot add or remove CG deliveries/);
  });
});

test('metadata-only revision lookup rejects a different owner, revision or output path', () => {
  const published = JSON.parse(read('docs/cg/roster-production-2026-10-18.json'));
  const registry = JSON.parse(read('src/game/cg/cgRevisions.generated.json'));
  const revision = registry.revisions.find(record => published.entries.some(entry => entry.id === record.cgId && entry.currentRevisionId === record.revisionId));
  assert.ok(revision);
  const frozen = published.entries.find(entry => entry.id === revision.cgId);
  const definition = { id: frozen.id, type: frozen.type }, hero = { id: frozen.characterId };
  const version = { revisionId: revision.revisionId, sourcePath: revision.sourcePath, imagePath: revision.imagePath, thumbnailPath: revision.thumbnailPath };
  assert.deepEqual(metadata.assetsForRevision(definition, hero, version, revision), frozen.currentAssets);
  assert.throws(() => metadata.assetsForRevision(definition, { id: 'unreviewed-owner' }, version, revision));
  assert.throws(() => metadata.assetsForRevision(definition, hero, { ...version, revisionId: 'unreviewed-revision' }, revision));
  assert.throws(() => metadata.assetsForRevision(definition, hero, { ...version, sourcePath: '/cg/unreviewed/path.png' }, revision));
});

test('the exact snapshot projection rejects changed candidate owners, paths and fidelity approval', async () => {
  const plan = (await result()).plan;
  const index = plan.subjects.findIndex(subject => subject.characterId === 'marcus');
  const mutate = edit => {
    const subjects = plan.subjects.slice(); subjects[index] = structuredClone(subjects[index]); edit(subjects[index]);
    return { ...plan, subjects };
  };
  assert.throws(() => validate(mutate(subject => { subject.characterId = 'unreviewed-owner'; })), /subject ID\/order changed/);
  assert.throws(() => validate(mutate(subject => { subject.universe = 'Unrelated source'; })), /source universe changed/);
  assert.throws(() => validate(mutate(subject => { subject.identity.localCandidates[0].path = '/sprites/unreviewed.png'; })), /current candidate declaration changed/);
  assert.throws(() => validate(mutate(subject => { subject.identity.visualFidelityApproved = true; })), /cannot approve CG fidelity/);
});
