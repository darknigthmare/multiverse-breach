import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test, { after, before } from 'node:test';
import sharp from 'sharp';
import {
  BATCH_ID,
  EXPECTED_BASELINE,
  EXPECTED_FAMILIES,
  EXPECTED_JOB_COUNT,
  REPLACEMENT_STAGE_IDS,
  batchRelativePath,
  classifyJobState,
  createBatch,
  createInstallManifest,
  getJobVisualReview,
  inspectBatchProgress,
  promptContractSha256,
  replacementEvidenceFor,
  readVisualReviewRecords,
  selectPendingEntries,
  sha256,
  validateBatch,
  validateBatchArtifact,
  validateVisualReviewRecords,
  visualReviewRelativePath,
  writeBatchArtifact
} from './buildRiftDossierBatch500Wave6.mjs';
import { loadSpriteBatch } from './openAiSpriteBatchQueue.mjs';

// All authored text, provenance ids and image bytes below are synthetic test data.
// No real Wave 6 prompt, manifest, ledger or public asset is written by this suite.
const tempBase = process.env.RIFT_DOSSIER_TEST_TMPDIR || os.tmpdir();
const temporaryRoots = [];
const catalogPath = 'docs/rift-dossiers/catalog.json';
const registryPath = 'src/game/riftDossierAssets.json';
const ledgerPath = 'public/images/rift-dossiers/openai/openai-prompts.jsonl';
const rgbWebpMetadata = { width: 640, height: 360, channels: 3, format: 'webp' };

const createTemporaryRoot = async () => {
  await fs.access(tempBase);
  const root = await fs.mkdtemp(path.join(tempBase, 'rift-wave6-test-'));
  temporaryRoots.push(root);
  return root;
};

const writeFixtureFile = async (root, relative, content) => {
  const target = path.resolve(root, relative);
  const withinRoot = path.relative(root, target);
  assert(withinRoot && !withinRoot.startsWith('..') && !path.isAbsolute(withinRoot));
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
};

const fixturePrompt = id => `SYNTHETIC TEST FIXTURE ${id}. Landscape environmental dossier; this text is not a production generation request. Preserve the supplied fictional scene, geometry and readable negative space. `.repeat(4);
const fixtureEntry = (id, family = 'expanded') => ({
  id,
  nom: { en: `Fixture ${id}`, fr: `Fixture ${id}` },
  univers: ['Synthetic test universe'],
  famille: family,
  mode: 'fixture',
  cheminCibleDedie: `/images/rift-dossiers/openai/${family}/stage-${id}-fixture-v1.webp`,
  promptOpenAI: fixturePrompt(id)
});

const createFixture = () => {
  const expanded = Array.from({ length: 309 }, (_, index) => fixtureEntry(34421 + index));
  const arcIds = [...REPLACEMENT_STAGE_IDS];
  for (let id = 9300; arcIds.length < 190; id += 1) {
    if (id !== 9469) arcIds.push(id);
  }
  const arcs = [...arcIds, 9469].map(id => fixtureEntry(id, 'arc-personnage'));
  const selected = [...expanded, ...arcs];
  const available = Array.from({ length: 994 }, (_, index) => fixtureEntry(1_000_000 + index));
  const later = Array.from({ length: 1705 }, (_, index) => fixtureEntry(2_000_000 + index));
  const catalog = { entrees: [...available, ...selected, ...later] };
  const registry = {
    entries: catalog.entrees.map((entry, index) => ({
      stageId: entry.id,
      assetPath: entry.cheminCibleDedie,
      status: index < available.length ? 'available' : 'pending'
    }))
  };
  const oldImages = new Map();
  const ledger = REPLACEMENT_STAGE_IDS.map((id, index) => {
    const entry = selected.find(value => value.id === id);
    const bytes = Buffer.from(`synthetic previous bitmap bytes ${id}`, 'utf8');
    oldImages.set(entry.cheminCibleDedie, bytes);
    const prompt = `Synthetic archived prompt ${id}; deliberately older than the current fixture.`;
    return {
      kind: 'rift-dossier-thumbnail',
      missionId: id,
      assetId: path.basename(entry.cheminCibleDedie, '.webp'),
      output: entry.cheminCibleDedie,
      ...(index % 2 === 0 ? {} : { prompt }),
      generation: {
        provider: 'OpenAI',
        interface: 'built-in image_gen',
        generationId: `exec-fixture-previous-${id}`,
        promptSha256: sha256(prompt)
      },
      image: { sha256: sha256(bytes) }
    };
  });
  return { catalog, registry, selected, ledger, oldImages };
};

const writeFixture = async (root, fixture) => {
  await writeFixtureFile(root, catalogPath, JSON.stringify(fixture.catalog));
  await writeFixtureFile(root, registryPath, JSON.stringify(fixture.registry));
  await writeFixtureFile(root, ledgerPath, fixture.ledger.map(entry => JSON.stringify(entry)).join('\n'));
  for (const [output, bytes] of fixture.oldImages) {
    await writeFixtureFile(root, `public${output}`, bytes);
  }
};

const installedProof = (job, imageSha256 = sha256(`synthetic installed bitmap ${job.id}`)) => ({
  kind: 'rift-dossier-thumbnail',
  missionId: job.stageId,
  assetId: job.assetId,
  output: job.output,
  prompt: job.generationPrompt,
  generation: {
    provider: 'OpenAI',
    interface: 'built-in image_gen',
    generationId: `exec-fixture-current-${job.id}`,
    promptSha256: job.generationPromptSha256
  },
  image: { sha256: imageSha256 }
});

const subjectReview = (job, overrides = {}) => ({
  id: job.id,
  promptSha256: job.generationPromptSha256,
  stage: 'subject-scene',
  status: 'approved',
  reviewer: 'synthetic-test-reviewer',
  reviewedAt: '2026-08-31T10:00:00.000Z',
  notes: 'Synthetic subject and scene anchors checked against the fixture reference.',
  sources: [{ kind: 'project-canon', reference: 'fixture://scene-contract', notes: 'Synthetic identity and environmental anchors only.' }],
  ...overrides
});

const rasterReview = (job, generationId, sourceSha256, overrides = {}) => ({
  id: job.id,
  promptSha256: job.generationPromptSha256,
  stage: 'raster',
  status: 'approved',
  reviewer: 'synthetic-test-reviewer',
  reviewedAt: '2026-08-31T10:01:00.000Z',
  notes: 'Synthetic raster composition, subject placement and image content checked.',
  generationId,
  sourceSha256,
  ...overrides
});

const writeVisualReviews = (root, records, overrides = {}) => writeFixtureFile(
  root,
  visualReviewRelativePath,
  JSON.stringify({ schemaVersion: 1, batchId: BATCH_ID, records, ...overrides })
);

const createReviewedReplacementFixture = async () => {
  const root = await createTemporaryRoot();
  const job = batch.jobs.find(value => value.replace);
  const oldImageBytes = fixture.oldImages.get(job.output);
  const oldLedgerText = fixture.ledger.map(proof => JSON.stringify(proof)).join('\n');
  const replacementArchive = { image: 'archives/previous-image.webp', ledger: 'archives/previous-ledger.jsonl' };
  await writeFixtureFile(root, `public${job.output}`, oldImageBytes);
  await writeFixtureFile(root, ledgerPath, oldLedgerText);
  await writeFixtureFile(root, replacementArchive.image, oldImageBytes);
  await writeFixtureFile(root, replacementArchive.ledger, oldLedgerText);
  const source = 'raw/synthetic-replacement.png';
  const png = await sharp({ create: { width: 640, height: 360, channels: 3, background: '#456789' } }).png().toBuffer();
  await writeFixtureFile(root, source, png);
  const generationId = `exec-fixture-reviewed-replacement-${job.id}`;
  await writeVisualReviews(root, [subjectReview(job), rasterReview(job, generationId, sha256(png))]);
  return {
    root, job, oldImageBytes, oldLedgerText, png,
    completion: { id: job.id, source, generationId, replacementArchive }
  };
};

let fixture;
let fixtureRoot;
let batch;
before(async () => {
  fixture = createFixture();
  fixtureRoot = await createTemporaryRoot();
  await writeFixture(fixtureRoot, fixture);
  batch = await createBatch({ root: fixtureRoot });
});

after(async () => {
  for (const root of temporaryRoots) {
    const relative = path.relative(path.resolve(tempBase), path.resolve(root));
    assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
    assert(path.basename(root).startsWith('rift-wave6-test-'));
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('Wave 6 selects the first pending entries in catalog order, not registry order', () => {
  const shuffledRegistry = { entries: [...fixture.registry.entries].reverse() };
  assert.deepEqual(selectPendingEntries(fixture.catalog, shuffledRegistry), fixture.selected);
  assert.equal(selectPendingEntries(fixture.catalog, fixture.registry, 1)[0].id, 34421);
});

for (const [label, mutate, expected] of [
  ['duplicate registry identity', value => { value.registry.entries[1].stageId = value.registry.entries[0].stageId; }, /Duplicate registry stage/],
  ['duplicate registry output', value => { value.registry.entries[1].assetPath = value.registry.entries[0].assetPath; }, /Duplicate registry output/],
  ['duplicate catalog identity', value => { value.catalog.entrees[1].id = value.catalog.entrees[0].id; }, /Duplicate catalog stage/],
  ['duplicate catalog output', value => { value.catalog.entrees[1].cheminCibleDedie = value.catalog.entrees[0].cheminCibleDedie; }, /Duplicate catalog output/],
  ['registry target drift', value => { value.registry.entries[0].assetPath = '/images/rift-dossiers/openai/expanded/drift.webp'; }, /Registry target drift/],
  ['unsupported registry status', value => { value.registry.entries[0].status = 'complete'; }, /Unsupported registry status/],
  ['catalog and registry count drift', value => { value.registry.entries.pop(); }, /Catalog\/registry counts differ/]
]) {
  test(`Wave 6 rejects ${label} before planning`, () => {
    const input = { catalog: structuredClone(fixture.catalog), registry: structuredClone(fixture.registry) };
    mutate(input);
    assert.throws(() => selectPendingEntries(input.catalog, input.registry), expected);
  });
}

test('Wave 6 never quietly returns a smaller pending selection', () => {
  assert.throws(() => selectPendingEntries(fixture.catalog, fixture.registry, 2206), /Cannot select 2206/);
});

test('Wave 6 freezes 500 jobs: 309 expanded, 191 character arcs and exactly 14 replacements', () => {
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.jobs.length, EXPECTED_JOB_COUNT);
  assert.deepEqual(batch.counts, { jobs: 500, ...EXPECTED_FAMILIES, replace: 14, new: 486 });
  assert.deepEqual(
    { total: batch.baseline.total, available: batch.baseline.available, pending: batch.baseline.pending },
    EXPECTED_BASELINE
  );
  assert.equal(batch.jobs[0].stageId, 34421);
  assert.equal(batch.jobs.at(-1).stageId, 9469);
  assert.deepEqual(batch.jobs.filter(job => job.replace).map(job => job.stageId), REPLACEMENT_STAGE_IDS);
  assert.equal(new Set(batch.jobs.map(job => job.id)).size, 500);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, 500);
  assert.equal(new Set(batch.jobs.map(job => job.promptFile)).size, 500);
  assert.equal(promptContractSha256(batch.jobs), batch.promptCatalogSha256);
  assert.equal(validateBatch(batch, fixture.catalog), batch);
});

test('all 14 replacement records preserve verifiable old image and stale prompt evidence', () => {
  for (const job of batch.jobs.filter(value => value.replace)) {
    const entry = fixture.selected.find(value => String(value.id) === job.id);
    const proof = fixture.ledger.find(value => value.output === job.output);
    const evidence = replacementEvidenceFor(entry, sha256(fixture.oldImages.get(job.output)), fixture.ledger);
    assert.deepEqual(evidence, job.replacement);
    assert.equal(evidence.previousPromptSha256, proof.generation.promptSha256);
    if (Object.hasOwn(proof, 'prompt')) assert.equal(evidence.previousPromptSha256, sha256(proof.prompt));
    assert.notEqual(evidence.previousPromptSha256, job.generationPromptSha256);
    assert.equal(evidence.previousGenerationId, proof.generation.generationId);
    assert.equal(evidence.requiresNewOpenAiGeneration, true);
    assert.equal(evidence.preservePriorProvenance, true);
  }
});

test('replacement evidence rejects missing, duplicate, altered and already-current proofs', () => {
  const entry = fixture.selected.find(value => value.id === REPLACEMENT_STAGE_IDS[0]);
  const original = fixture.ledger.find(value => value.output === entry.cheminCibleDedie);
  const imageHash = original.image.sha256;
  assert.throws(() => replacementEvidenceFor(entry, imageHash, []), /unique provenance/);
  assert.throws(() => replacementEvidenceFor(entry, imageHash, [original, original]), /unique provenance/);
  assert.throws(() => replacementEvidenceFor(entry, sha256('tampered bitmap'), [original]), /Existing image drift/);
  const wrongMission = structuredClone(original);
  wrongMission.missionId += 1;
  assert.throws(() => replacementEvidenceFor(entry, imageHash, [wrongMission]), /mission mismatch/);
  const tamperedPrompt = structuredClone(original);
  tamperedPrompt.prompt = 'Deliberately incorrect archived fixture text';
  assert.throws(() => replacementEvidenceFor(entry, imageHash, [tamperedPrompt]), /prompt proof mismatch/);
  const currentPrompt = structuredClone(original);
  currentPrompt.prompt = entry.promptOpenAI;
  currentPrompt.generation.promptSha256 = sha256(entry.promptOpenAI);
  assert.throws(() => replacementEvidenceFor(entry, imageHash, [currentPrompt]), /already current/);
  assert.throws(() => replacementEvidenceFor(fixture.selected[0], imageHash, [original]), /Unexpected existing pending output/);
});

for (const [label, mutate, expected] of [
  ['identities', value => { value.jobs[1].id = value.jobs[0].id; }, /Duplicate Wave 6 identity/],
  ['outputs', value => { value.jobs[1].output = value.jobs[0].output; }, /Duplicate Wave 6 output/],
  ['prompt paths', value => { value.jobs[1].promptFile = value.jobs[0].promptFile; }, /Duplicate Wave 6 prompt file/],
  ['prompt text', value => { value.jobs[0].generationPrompt += ' changed'; }, /prompt contract changed/]
]) {
  test(`frozen Wave 6 validation rejects changed ${label}`, () => {
    const altered = structuredClone(batch);
    mutate(altered);
    assert.throws(() => validateBatch(altered), expected);
  });
}

test('a new job is pending only when both image and provenance are absent', () => {
  const job = batch.jobs[0];
  const proof = installedProof(job);
  assert.equal(classifyJobState(job), 'pending');
  assert.equal(classifyJobState(job, { ledger: [proof] }), 'blocked');
  assert.equal(classifyJobState(job, { imageSha256: proof.image.sha256 }), 'blocked');
});

test('an unchanged authenticated old generation remains replacement-required, never installed', () => {
  const job = batch.jobs.find(value => value.replace);
  const proof = fixture.ledger.find(value => value.output === job.output);
  assert.equal(classifyJobState(job), 'blocked');
  assert.equal(classifyJobState(job, { ledger: [proof], imageSha256: proof.image.sha256 }), 'replacement-required');
  assert.equal(classifyJobState(job, { ledger: [proof], imageSha256: proof.image.sha256, metadata: rgbWebpMetadata }), 'replacement-required');
});

test('legacy hash-only provenance stays historical evidence without inventing prompt text', () => {
  const job = batch.jobs.find(value => value.replace);
  const entry = fixture.selected.find(value => String(value.id) === job.id);
  const proof = structuredClone(fixture.ledger.find(value => value.output === job.output));
  assert.equal(Object.hasOwn(proof, 'prompt'), false);
  const evidence = replacementEvidenceFor(entry, proof.image.sha256, [proof]);
  assert.equal(evidence.previousPromptSha256, proof.generation.promptSha256);
  assert.equal(Object.hasOwn(evidence, 'prompt'), false);
  assert.equal(classifyJobState(job, { ledger: [proof], imageSha256: proof.image.sha256, metadata: rgbWebpMetadata }), 'replacement-required');

  const requalified = structuredClone(proof);
  requalified.generation.promptSha256 = job.generationPromptSha256;
  requalified.prompt = job.generationPrompt;
  assert.equal(classifyJobState(job, { ledger: [requalified], imageSha256: proof.image.sha256, metadata: rgbWebpMetadata }), 'blocked');

  const newProofWithoutPrompt = installedProof(job);
  delete newProofWithoutPrompt.prompt;
  assert.equal(classifyJobState(job, { ledger: [newProofWithoutPrompt], imageSha256: newProofWithoutPrompt.image.sha256, metadata: rgbWebpMetadata }), 'blocked');
  for (const invalidText of [null, 123, 'Incorrect text added to a historical hash-only entry']) {
    const malformed = { ...proof, prompt: invalidText };
    assert.throws(() => replacementEvidenceFor(entry, proof.image.sha256, [malformed]));
    assert.equal(classifyJobState(job, { ledger: [malformed], imageSha256: proof.image.sha256, metadata: rgbWebpMetadata }), 'blocked');
  }
});

test('a matching current RGB WebP is installed for new jobs and genuinely new replacements', () => {
  for (const job of [batch.jobs[0], batch.jobs.find(value => value.replace)]) {
    const proof = installedProof(job);
    assert.equal(classifyJobState(job, { ledger: [proof], imageSha256: proof.image.sha256, metadata: rgbWebpMetadata }), 'installed');
  }
});

test('duplicate provenance, wrong identity, provider, generation id or image hash blocks installation', () => {
  const job = batch.jobs[0];
  const proof = installedProof(job);
  const state = { ledger: [proof, proof], imageSha256: proof.image.sha256, metadata: rgbWebpMetadata };
  assert.equal(classifyJobState(job, state), 'blocked');
  for (const mutate of [
    value => { value.kind = 'hero'; },
    value => { value.missionId += 1; },
    value => { value.generation.provider = 'Other'; },
    value => { value.generation.interface = 'unverified'; },
    value => { value.generation.generationId = 'placeholder'; },
    value => { value.image.sha256 = sha256('different bytes'); }
  ]) {
    const altered = structuredClone(proof);
    mutate(altered);
    assert.equal(classifyJobState(job, { ...state, ledger: [altered] }), 'blocked');
  }
});

test('wrong prompt, dimensions, format or alpha channels never qualify as installed', () => {
  const job = batch.jobs[0];
  const proof = installedProof(job);
  const state = { ledger: [proof], imageSha256: proof.image.sha256, metadata: rgbWebpMetadata };
  for (const metadata of [null, { ...rgbWebpMetadata, width: 639 }, { ...rgbWebpMetadata, height: 361 }, { ...rgbWebpMetadata, format: 'png' }, { ...rgbWebpMetadata, channels: 4 }]) {
    assert.equal(classifyJobState(job, { ...state, metadata }), 'blocked');
  }
  const wrongText = { ...proof, prompt: `${proof.prompt} altered` };
  assert.equal(classifyJobState(job, { ...state, ledger: [wrongText] }), 'blocked');
  const wrongHash = structuredClone(proof);
  wrongHash.generation.promptSha256 = sha256('different prompt');
  assert.equal(classifyJobState(job, { ...state, ledger: [wrongHash] }), 'blocked');
});

test('relabeling an old replacement image or generation id cannot manufacture a new generation', () => {
  const job = batch.jobs.find(value => value.replace);
  for (const [reuseImage, reuseGeneration] of [[true, false], [false, true], [true, true]]) {
    const imageHash = reuseImage ? job.replacement.previousImageSha256 : sha256('synthetic new replacement');
    const proof = installedProof(job, imageHash);
    if (reuseGeneration) proof.generation.generationId = job.replacement.previousGenerationId;
    assert.equal(classifyJobState(job, { ledger: [proof], imageSha256: imageHash, metadata: rgbWebpMetadata }), 'blocked');
  }
});

test('visual approval requires both a subject-scene review and an exact generated-raster review', () => {
  const job = batch.jobs[0];
  const generationId = 'exec-fixture-reviewed-raster';
  const sourceSha256 = sha256('synthetic reviewed png bytes');
  const subject = subjectReview(job);
  const raster = rasterReview(job, generationId, sourceSha256);
  const inspect = records => getJobVisualReview(job, { records, generationId, sourceSha256 });
  assert.deepEqual(inspect([]), { status: 'subject-scene-required', subjectApproved: false, approved: false });
  assert.equal(inspect([subject]).status, 'raster-required');
  assert.equal(inspect([raster]).status, 'subject-scene-required');
  assert.deepEqual(inspect([subject, raster]), { status: 'approved', subjectApproved: true, approved: true });
});

test('reviews for a different prompt, identity, source PNG or generation cannot approve this job', () => {
  const job = batch.jobs[0];
  const generationId = 'exec-fixture-reviewed-raster';
  const sourceSha256 = sha256('synthetic reviewed png bytes');
  const subject = subjectReview(job);
  const raster = rasterReview(job, generationId, sourceSha256);
  for (const records of [
    [{ ...subject, id: batch.jobs[1].id }, raster],
    [{ ...subject, promptSha256: sha256('old prompt') }, raster],
    [subject, { ...raster, promptSha256: sha256('old prompt') }],
    [subject, { ...raster, sourceSha256: sha256('another png') }],
    [subject, { ...raster, generationId: 'exec-fixture-other-generation' }]
  ]) {
    assert.equal(getJobVisualReview(job, { records, generationId, sourceSha256 }).approved, false);
  }
});

test('rejected or out-of-date visual reviews block approval until both current reviews pass', () => {
  const job = batch.jobs[0];
  const generationId = 'exec-fixture-reviewed-raster';
  const sourceSha256 = sha256('synthetic reviewed png bytes');
  const subject = subjectReview(job);
  const raster = rasterReview(job, generationId, sourceSha256);
  const inspect = records => getJobVisualReview(job, { records, generationId, sourceSha256 });
  assert.equal(inspect([{ ...subject, status: 'rejected' }, raster]).status, 'subject-scene-rejected');
  assert.equal(inspect([subject, { ...raster, status: 'rejected' }]).status, 'raster-rejected');
  assert.equal(inspect([subject, raster, { ...subject, reviewedAt: '2026-08-31T10:02:00.000Z' }]).status, 'raster-required');
  assert.equal(inspect([subject, raster, { ...raster, status: 'rejected', reviewedAt: '2026-08-31T10:03:00.000Z' }]).approved, false);
});

test('visual review records require concrete observations and source-specific proof', () => {
  const job = batch.jobs[0];
  const subject = subjectReview(job);
  const raster = rasterReview(job, 'exec-fixture-reviewed-raster', sha256('synthetic png'));
  assert.equal(validateVisualReviewRecords([subject, raster]).length, 2);
  assert.throws(() => validateVisualReviewRecords([{ ...subject, notes: 'done' }]), /concrete subject\/scene/);
  assert.throws(() => validateVisualReviewRecords([{ ...subject, sources: [] }]), /source references/);
  assert.throws(() => validateVisualReviewRecords([{ ...subject, sources: [{ kind: 'official-url', reference: 'http://example.invalid', notes: 'Synthetic reference' }] }]), /HTTPS/);
  assert.throws(() => validateVisualReviewRecords([{ ...subject, reviewedAt: 'unknown' }]), /timestamp/);
  assert.throws(() => validateVisualReviewRecords([{ ...subject, reviewer: '' }]), /reviewer/);
  assert.throws(() => validateVisualReviewRecords([{ ...raster, generationId: 'placeholder' }]), /actual built-in generation/);
  assert.throws(() => validateVisualReviewRecords([{ ...raster, sourceSha256: 'unknown' }]), /actual reviewed PNG/);
});

test('temporary visual-review ledgers start empty and reject another batch or schema', async () => {
  const root = await createTemporaryRoot();
  assert.deepEqual(await readVisualReviewRecords({ root }), []);
  const records = [subjectReview(batch.jobs[0])];
  await writeVisualReviews(root, records);
  assert.deepEqual(await readVisualReviewRecords({ root }), records);
  await writeVisualReviews(root, records, { batchId: 'another-wave' });
  await assert.rejects(() => readVisualReviewRecords({ root }));
  await writeVisualReviews(root, records, { schemaVersion: 2 });
  await assert.rejects(() => readVisualReviewRecords({ root }));
});

test('one-job import contracts require both approvals bound to the exact source PNG', async () => {
  const root = await createTemporaryRoot();
  const job = batch.jobs[0];
  const source = 'raw/synthetic-source.png';
  const png = await sharp({ create: { width: 640, height: 360, channels: 3, background: '#345678' } }).png().toBuffer();
  await writeFixtureFile(root, source, png);
  const generationId = 'exec-fixture-reviewed-import';
  const completion = { id: job.id, source, generationId };
  const subject = subjectReview(job);
  const raster = rasterReview(job, generationId, sha256(png));
  await assert.rejects(() => createInstallManifest(batch, [completion], { root }), /subject\/scene and exact generated-PNG reviews/);
  for (const records of [[subject], [raster], [subject, { ...raster, sourceSha256: sha256('different png') }]]) {
    await writeVisualReviews(root, records);
    await assert.rejects(() => createInstallManifest(batch, [completion], { root }), /reviews before install/);
  }
  await writeVisualReviews(root, [subject, raster]);
  const manifest = await createInstallManifest(batch, [completion], { root });
  assert.equal(manifest.jobs.length, 1);
  assert.equal(manifest.jobs[0].sequence, 1);
  assert.equal(manifest.jobs[0].id, job.id);
  assert.equal(manifest.jobs[0].replace, false);
  assert.equal(manifest.jobs[0].source, path.resolve(root, source));
  assert.equal(manifest.jobs[0].visualReview.sourceSha256, sha256(png));
  assert.equal(manifest.promptCatalogSha256, promptContractSha256([job]));
});

test('replacement import accepts distinct durable archives with matching historical hashes', async () => {
  const { root, job, completion, oldImageBytes, oldLedgerText } = await createReviewedReplacementFixture();
  const manifest = await createInstallManifest(batch, [completion], { root });
  assert.equal(manifest.jobs.length, 1);
  assert.equal(manifest.jobs[0].replace, true);
  assert.equal(manifest.jobs[0].sequence, 1);
  assert.equal(manifest.jobs[0].sourceSequence, job.sequence);
  assert.deepEqual(manifest.jobs[0].replacementPrecondition, job.replacement);
  assert.deepEqual(manifest.jobs[0].replacementArchive, {
    image: path.resolve(root, completion.replacementArchive.image),
    ledger: path.resolve(root, completion.replacementArchive.ledger),
    imageSha256: sha256(oldImageBytes),
    ledgerSha256: sha256(oldLedgerText)
  });
  assert.deepEqual(await fs.readFile(path.join(root, `public${job.output}`)), oldImageBytes);
  assert.equal(await fs.readFile(path.join(root, ledgerPath), 'utf8'), oldLedgerText);
});

test('replacement import refuses missing archives or backup references to the live files', async () => {
  const { root, job, completion } = await createReviewedReplacementFixture();
  const withoutArchive = { ...completion };
  delete withoutArchive.replacementArchive;
  await assert.rejects(() => createInstallManifest(batch, [withoutArchive], { root }), /Durable image and ledger backups required/);
  const liveImageReference = {
    ...completion,
    replacementArchive: { ...completion.replacementArchive, image: `public${job.output}` }
  };
  await assert.rejects(() => createInstallManifest(batch, [liveImageReference], { root }), /Image backup is the live output/);
  const liveLedgerReference = {
    ...completion,
    replacementArchive: { ...completion.replacementArchive, ledger: ledgerPath }
  };
  await assert.rejects(() => createInstallManifest(batch, [liveLedgerReference], { root }), /Ledger backup is the live ledger/);
});

test('valid old archives never authorize overwriting a drifted or differently generated live replacement', async () => {
  const { root, job, completion, oldImageBytes, oldLedgerText, png } = await createReviewedReplacementFixture();
  await writeFixtureFile(root, `public${job.output}`, Buffer.from('synthetic live image drift'));
  await assert.rejects(() => createInstallManifest(batch, [completion], { root }), /Replacement live state drift/);

  await writeFixtureFile(root, `public${job.output}`, oldImageBytes);
  const driftedLedger = structuredClone(fixture.ledger);
  driftedLedger.find(proof => proof.output === job.output).generation.generationId = 'exec-fixture-unexpected-live-generation';
  await writeFixtureFile(root, ledgerPath, driftedLedger.map(proof => JSON.stringify(proof)).join('\n'));
  await assert.rejects(() => createInstallManifest(batch, [completion], { root }), /Replacement live state drift/);
  assert.equal(await fs.readFile(path.join(root, completion.replacementArchive.ledger), 'utf8'), oldLedgerText);

  const installedPixels = await sharp(png).webp().toBuffer();
  const competingProof = installedProof(job, sha256(installedPixels));
  competingProof.sourceImage = { sha256: sha256(png) };
  const liveLedger = [...fixture.ledger.filter(proof => proof.output !== job.output), competingProof];
  await writeFixtureFile(root, `public${job.output}`, installedPixels);
  await writeFixtureFile(root, ledgerPath, liveLedger.map(proof => JSON.stringify(proof)).join('\n'));
  await assert.rejects(() => createInstallManifest(batch, [completion], { root }), /already installed from a different generation/);

  competingProof.generation.generationId = completion.generationId;
  competingProof.sourceImage.sha256 = sha256('another synthetic source PNG');
  await writeFixtureFile(root, ledgerPath, liveLedger.map(proof => JSON.stringify(proof)).join('\n'));
  await assert.rejects(() => createInstallManifest(batch, [completion], { root }), /already installed from a different generation/);

  competingProof.sourceImage.sha256 = sha256(png);
  await writeFixtureFile(root, ledgerPath, liveLedger.map(proof => JSON.stringify(proof)).join('\n'));
  const resumed = await createInstallManifest(batch, [completion], { root });
  assert.equal(resumed.jobs[0].generationId, completion.generationId);
  assert.deepEqual(await fs.readFile(path.join(root, completion.replacementArchive.image)), oldImageBytes);
});

test('a frozen temporary artifact is idempotent, queue-compatible and refuses divergent rewrites', async () => {
  const root = await createTemporaryRoot();
  await writeFixtureFile(root, catalogPath, JSON.stringify(fixture.catalog));
  await writeBatchArtifact(batch, { root });
  const artifactPath = path.join(root, batchRelativePath);
  const beforeBytes = await fs.readFile(artifactPath);
  const beforeStat = await fs.stat(artifactPath);
  await writeBatchArtifact(batch, { root });
  assert.deepEqual(await fs.readFile(artifactPath), beforeBytes);
  assert.equal((await fs.stat(artifactPath)).mtimeMs, beforeStat.mtimeMs);
  const { artifact, artifactSha256 } = await validateBatchArtifact({ root });
  assert.equal(artifactSha256, sha256(beforeBytes));
  assert.deepEqual(artifact.jobs.map(job => job.id), batch.jobs.map(job => job.id));
  const queued = await loadSpriteBatch(batchRelativePath, { repositoryRoot: root });
  assert.equal(queued.batchId, BATCH_ID);
  assert.equal(queued.jobs.length, 500);
  assert.deepEqual(queued.jobs.map(job => job.sequence), batch.jobs.map(job => job.sequence));
  assert.deepEqual(queued.jobs.map(job => job.output), batch.jobs.map(job => job.output));
  assert.equal(queued.jobs.filter(job => job.replace).length, 14);

  const promptPath = path.join(root, batch.jobs[0].promptFile);
  await writeFixtureFile(root, batch.jobs[0].promptFile, 'Deliberately divergent temporary fixture');
  await assert.rejects(() => writeBatchArtifact(batch, { root }), /Refusing to overwrite/);
  assert.equal(await fs.readFile(promptPath, 'utf8'), 'Deliberately divergent temporary fixture');
  await assert.rejects(() => loadSpriteBatch(batchRelativePath, { repositoryRoot: root }), /byte-identical/);
  await assert.rejects(() => validateBatchArtifact({ root }), /Prompt file drift/);
});

test('catalog prompt drift blocks a pending frozen job without rewriting or refilling its manifest', async () => {
  const root = await createTemporaryRoot();
  await writeFixtureFile(root, catalogPath, JSON.stringify(fixture.catalog));
  await writeBatchArtifact(batch, { root });
  const artifactPath = path.join(root, batchRelativePath);
  const originalBytes = await fs.readFile(artifactPath);
  const changedCatalog = structuredClone(fixture.catalog);
  const pendingJob = batch.jobs[0];
  changedCatalog.entrees.find(entry => String(entry.id) === pendingJob.id).promptOpenAI += ' Explicitly revised canonical fixture scene.';
  await writeFixtureFile(root, catalogPath, JSON.stringify(changedCatalog));
  await assert.rejects(() => validateBatchArtifact({ root }), new RegExp(`Current catalog prompt drift ${pendingJob.id}`));
  const unchangedBytes = await fs.readFile(artifactPath);
  assert.deepEqual(unchangedBytes, originalBytes);
  const frozen = JSON.parse(unchangedBytes);
  assert.equal(frozen.jobs.length, 500);
  assert.deepEqual(frozen.jobs.map(job => job.id), batch.jobs.map(job => job.id));
  assert.deepEqual(frozen.baseline, batch.baseline);
  assert.equal(await fs.readFile(path.join(root, pendingJob.promptFile), 'utf8'), pendingJob.generationPrompt);
});

test('partial installation reports progress without refilling or changing the frozen 500 jobs', async () => {
  const root = await createTemporaryRoot();
  await writeFixture(root, fixture);
  await writeBatchArtifact(batch, { root });
  const originalArtifact = await fs.readFile(path.join(root, batchRelativePath));
  const initial = await inspectBatchProgress(batch, { root });
  assert.deepEqual(initial.counts, { pending: 486, 'replacement-required': 14, installed: 0, blocked: 0 });
  assert.equal(initial.complete, 0);
  assert.equal(initial.visualReviewCounts['subject-scene-required'], 500);
  assert.ok(initial.jobs.every(job => !job.canGenerate && !job.complete));

  // This tiny synthetic raster exists only in the disposable fixture tree.
  const pixels = await sharp({ create: { width: 640, height: 360, channels: 3, background: '#234567' } }).webp().toBuffer();
  const pixelHash = sha256(pixels);
  const selected = [batch.jobs[0], batch.jobs.find(job => job.replace)];
  const outputs = new Set(selected.map(job => job.output));
  const ledger = [...fixture.ledger.filter(proof => !outputs.has(proof.output)), ...selected.map(job => installedProof(job, pixelHash))];
  for (const job of selected) await writeFixtureFile(root, `public${job.output}`, pixels);
  await writeFixtureFile(root, ledgerPath, ledger.map(proof => JSON.stringify(proof)).join('\n'));
  const partial = await inspectBatchProgress(batch, { root });
  assert.deepEqual(partial.counts, { pending: 485, 'replacement-required': 13, installed: 2, blocked: 0 });
  assert.equal(partial.complete, 0);
  assert.ok(partial.jobs.filter(job => job.production === 'installed').every(job => !job.complete));
  assert.deepEqual(partial.jobs.map(job => [job.id, job.sequence, job.output]), initial.jobs.map(job => [job.id, job.sequence, job.output]));

  const reviewedJob = selected[0];
  const reviewedProof = ledger.find(proof => proof.output === reviewedJob.output);
  reviewedProof.sourceImage = { sha256: sha256('synthetic reviewed source PNG') };
  await writeFixtureFile(root, ledgerPath, ledger.map(proof => JSON.stringify(proof)).join('\n'));
  await writeVisualReviews(root, [
    subjectReview(reviewedJob),
    rasterReview(reviewedJob, reviewedProof.generation.generationId, reviewedProof.sourceImage.sha256),
    subjectReview(batch.jobs[2]),
    subjectReview(batch.jobs[3]),
    rasterReview(batch.jobs[3], 'exec-fixture-approved-pending', sha256('synthetic approved pending source PNG'))
  ]);
  const reviewed = await inspectBatchProgress(batch, { root });
  assert.deepEqual(reviewed.counts, partial.counts);
  assert.equal(reviewed.complete, 1);
  assert.equal(reviewed.visualReviewCounts.approved, 2);
  assert.equal(reviewed.jobs[0].complete, true);
  assert.equal(reviewed.jobs[2].visualReview, 'raster-required');
  assert.equal(reviewed.jobs[2].canGenerate, true);
  assert.equal(reviewed.jobs[2].canInstall, false);
  assert.equal(reviewed.jobs[2].complete, false);
  assert.equal(reviewed.jobs[3].production, 'pending');
  assert.equal(reviewed.jobs[3].visualReview, 'approved');
  assert.equal(reviewed.jobs[3].canGenerate, false);
  assert.equal(reviewed.jobs[3].canInstall, true);
  assert.equal(reviewed.jobs[3].complete, false);

  const registry = structuredClone(fixture.registry);
  for (const entry of registry.entries) {
    if (selected.some(job => job.stageId === entry.stageId)) entry.status = 'available';
  }
  await writeFixtureFile(root, registryPath, JSON.stringify(registry));
  await assert.rejects(() => createBatch({ root }), /initial snapshot drifted/);
  const { artifact } = await validateBatchArtifact({ root });
  assert.deepEqual(artifact.jobs.map(job => job.id), batch.jobs.map(job => job.id));
  assert.deepEqual(await fs.readFile(path.join(root, batchRelativePath)), originalArtifact);

  await writeFixtureFile(root, `public${batch.jobs[1].output}`, pixels);
  const interrupted = await inspectBatchProgress(artifact, { root });
  assert.deepEqual(interrupted.counts, { pending: 484, 'replacement-required': 13, installed: 2, blocked: 1 });
  assert.equal(interrupted.jobs[1].status, 'blocked');
  assert.equal(interrupted.jobs.length, 500);
});
