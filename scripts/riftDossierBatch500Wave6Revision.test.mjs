import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test, { afterEach } from 'node:test';
import sharp from 'sharp';
import {
  BATCH_ID, REPLACEMENT_STAGE_IDS, batchRelativePath, createBatch, getJobVisualReview,
  inspectBatchProgress, revisionRelativeDirectory, sha256, validateBatchArtifact,
  validateVisualReviewRecords, visualReviewRelativePath, writeBatchArtifact
} from './buildRiftDossierBatch500Wave6.mjs';
import { applyRevision, proposeRevision } from './reviseRiftDossierBatch500Wave6.mjs';

// Entirely synthetic fixtures. These tests never revise the real Wave 6 or its images.
const tempBase = process.env.RIFT_DOSSIER_TEST_TMPDIR || os.tmpdir();
const roots = [];
const catalogPath = 'docs/rift-dossiers/catalog.json';
const registryPath = 'src/game/riftDossierAssets.json';
const ledgerPath = 'public/images/rift-dossiers/openai/openai-prompts.jsonl';
const write = async (root, relative, value) => {
  const destination = path.resolve(root, relative);
  const local = path.relative(root, destination);
  assert(local && !local.startsWith('..') && !path.isAbsolute(local));
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, value);
};
const read = (root, relative) => fs.readFile(path.join(root, relative));
const readJson = async (root, relative) => JSON.parse(await read(root, relative));
const fixturePrompt = id => `SYNTHETIC REVISION FIXTURE ${id}. This is an isolated test scene, never a production generation request. Preserve the fictional environment and identity in a readable landscape composition. `.repeat(4);
const entry = (id, family = 'expanded') => ({ id, nom: { en: `Fixture ${id}` }, univers: ['Synthetic fixture'], famille: family, mode: 'RPG', cheminCibleDedie: `/images/rift-dossiers/openai/${family}/stage-${id}-fixture.webp`, promptOpenAI: fixturePrompt(id) });

const createFixture = async () => {
  const root = await fs.mkdtemp(path.join(tempBase, 'wave6-revision-test-'));
  roots.push(root);
  const arcs = [...REPLACEMENT_STAGE_IDS];
  for (let id = 9300; arcs.length < 190; id++) if (id !== 9469) arcs.push(id);
  const selected = [...Array.from({ length: 309 }, (_, index) => entry(34421 + index)), ...[...arcs, 9469].map(id => entry(id, 'arc-personnage'))];
  const catalog = { entrees: [...Array.from({ length: 994 }, (_, index) => entry(1_000_000 + index)), ...selected, ...Array.from({ length: 1705 }, (_, index) => entry(2_000_000 + index))] };
  const registry = { entries: catalog.entrees.map((value, index) => ({ stageId: value.id, assetPath: value.cheminCibleDedie, status: index < 994 ? 'available' : 'pending' })) };
  const ledger = [];
  for (const id of REPLACEMENT_STAGE_IDS) {
    const target = selected.find(value => value.id === id);
    const bytes = Buffer.from(`Synthetic old image ${id}`);
    ledger.push({ kind: 'rift-dossier-thumbnail', missionId: id, output: target.cheminCibleDedie, generation: { provider: 'OpenAI', interface: 'built-in image_gen', generationId: `exec-fixture-old-${id}`, promptSha256: sha256(`Synthetic historical prompt ${id}`) }, image: { sha256: sha256(bytes) } });
    await write(root, `public${target.cheminCibleDedie}`, bytes);
  }
  await write(root, catalogPath, JSON.stringify(catalog));
  await write(root, registryPath, JSON.stringify(registry));
  await write(root, ledgerPath, ledger.map(value => JSON.stringify(value)).join('\n'));
  const batch = await createBatch({ root });
  await writeBatchArtifact(batch, { root });
  const pixels = await sharp({ create: { width: 640, height: 360, channels: 3, background: '#234567' } }).webp().toBuffer();
  for (const job of batch.jobs.slice(0, 4)) {
    await write(root, `public${job.output}`, pixels);
    ledger.push({ kind: 'rift-dossier-thumbnail', missionId: job.stageId, output: job.output, prompt: job.generationPrompt, generation: { provider: 'OpenAI', interface: 'built-in image_gen', generationId: `exec-fixture-installed-${job.id}`, promptSha256: job.generationPromptSha256 }, image: { sha256: sha256(pixels) } });
    registry.entries.find(value => value.stageId === job.stageId).status = 'available';
  }
  await write(root, registryPath, JSON.stringify(registry));
  await write(root, ledgerPath, ledger.map(value => JSON.stringify(value)).join('\n'));
  const reviews = [{ id: batch.jobs[4].id, promptSha256: batch.jobs[4].generationPromptSha256, stage: 'subject-scene', status: 'approved', reviewer: 'synthetic reviewer', reviewedAt: '2026-09-01T10:00:00.000Z', notes: 'Synthetic previous subject-scene review, not a production approval.', sources: [{ kind: 'project-canon', reference: 'fixture://old-canon', notes: 'Synthetic prior anchors.' }] }];
  await write(root, visualReviewRelativePath, JSON.stringify({ schemaVersion: 1, batchId: BATCH_ID, records: reviews }));
  return { root, batch, catalog, registry, ledger, reviews };
};

const requestFor = async (fixture, ids, revisionId = 'fixture-first', suffix = 'First explicitly revised synthetic subject and scene.') => {
  const { root } = fixture;
  const { artifact, artifactSha256 } = await validateBatchArtifact({ root });
  const catalog = await readJson(root, catalogPath);
  const changes = ids.map(id => {
    const job = artifact.jobs.find(value => value.id === String(id));
    const current = catalog.entrees.find(value => String(value.id) === String(id));
    current.promptOpenAI += ` ${suffix}`;
    current.politiqueReferences = 'synthetic-official-reference-policy';
    current.referenceUrls = ['https://example.invalid/synthetic-reference'];
    current.referencesLocalesOpenAI = ['fixture-only-reference.webp'];
    return { id: String(id), priorPromptSha256: job.generationPromptSha256, newPromptSha256: sha256(current.promptOpenAI), reason: 'Explicit synthetic correction of subject and scene; no production lore invented.', sources: [{ kind: 'official-url', reference: 'https://example.invalid/synthetic-reference', notes: 'Only a synthetic primary-reference fixture.' }] };
  });
  await write(root, catalogPath, JSON.stringify(catalog));
  return { schemaVersion: 1, batchId: BATCH_ID, revisionId, expectedArtifactSha256: artifactSha256, author: 'synthetic-test-operator', createdAt: '2026-09-01T11:00:00.000Z', changes };
};

afterEach(async () => {
  // No test shares a fixture; release its 500 archived prompts immediately.
  for (const root of roots.splice(0)) {
    const relative = path.relative(path.resolve(tempBase), path.resolve(root));
    assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
    assert(path.basename(root).startsWith('wave6-revision-test-'));
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('explicit revision preserves the frozen 500, four installed jobs, historic proofs and original prompts', async () => {
  const fixture = await createFixture();
  const { root, batch, reviews } = fixture;
  const protectedFiles = [batchRelativePath, registryPath, ledgerPath, visualReviewRelativePath, ...batch.jobs.slice(0, 4).flatMap(job => [job.promptFile, `public${job.output}`])];
  const snapshots = new Map(await Promise.all(protectedFiles.map(async file => [file, await read(root, file)])));
  const request = await requestFor(fixture, [REPLACEMENT_STAGE_IDS[0], batch.jobs[5].id, batch.jobs[4].id]);
  request.changes[1].sources[0].kind = 'reference-url';
  const plan = await proposeRevision(request, { root });
  assert.equal(plan.request.changes.find(change => change.id === batch.jobs[5].id).sources[0].kind, 'reference-url');
  assert.deepEqual(plan.request.changes.map(change => change.id), [batch.jobs[4].id, batch.jobs[5].id, String(REPLACEMENT_STAGE_IDS[0])]);
  await assert.rejects(() => fs.stat(path.join(root, revisionRelativeDirectory)), { code: 'ENOENT' });
  assert.deepEqual(await read(root, batchRelativePath), snapshots.get(batchRelativePath));
  const result = await applyRevision(plan, { root });
  assert.equal(result.applied, true);
  const { artifact: revised } = await validateBatchArtifact({ root });
  assert.equal(revised.jobs.length, 500);
  assert.deepEqual(revised.baseline, batch.baseline);
  assert.deepEqual(revised.source, batch.source);
  assert.deepEqual(revised.counts, batch.counts);
  assert.deepEqual(revised.jobs.map(job => [job.id, job.sequence, job.output]), batch.jobs.map(job => [job.id, job.sequence, job.output]));
  assert.deepEqual(revised.jobs.slice(0, 4), batch.jobs.slice(0, 4));
  const revisedJob = revised.jobs[4];
  assert.equal(revisedJob.referencePolicy, 'synthetic-official-reference-policy');
  assert.deepEqual(revisedJob.referenceUrls, ['https://example.invalid/synthetic-reference']);
  assert.deepEqual(revisedJob.localOpenAiReferences, ['fixture-only-reference.webp']);
  assert.equal(getJobVisualReview(revisedJob, { records: reviews }).status, 'subject-scene-required');
  assert.deepEqual(revised.jobs.find(job => job.replace).replacement, batch.jobs.find(job => job.replace).replacement);
  for (const [file, bytes] of snapshots) if (file !== batchRelativePath) assert.deepEqual(await read(root, file), bytes, file);
  assert.equal((await read(root, batch.jobs[4].promptFile)).toString(), batch.jobs[4].generationPrompt);
  assert.deepEqual(await read(root, `${plan.revision.directory}/before.json`), snapshots.get(batchRelativePath));
  assert.equal((await fs.readdir(path.join(root, plan.revision.directory, 'before-prompts'))).length, 500);
  const progress = await inspectBatchProgress(revised, { root });
  assert.deepEqual(progress.counts, { pending: 482, 'replacement-required': 14, installed: 4, blocked: 0 });
  const afterBytes = await read(root, batchRelativePath);
  const afterMtime = (await fs.stat(path.join(root, batchRelativePath))).mtimeMs;
  assert.equal((await applyRevision(plan, { root })).reused, true);
  assert.deepEqual(await read(root, batchRelativePath), afterBytes);
  assert.equal((await fs.stat(path.join(root, batchRelativePath))).mtimeMs, afterMtime);
});

test('empty, duplicate, unknown, unhashed or undocumented requests fail before any artifact mutation', async () => {
  const fixture = await createFixture();
  const request = await requestFor(fixture, [fixture.batch.jobs[4].id]);
  const original = await read(fixture.root, batchRelativePath);
  for (const mutate of [
    value => { value.changes = []; }, value => { value.changes.push(structuredClone(value.changes[0])); },
    value => { value.changes[0].id = '99999999'; }, value => { value.expectedArtifactSha256 = sha256('stale'); },
    value => { value.changes[0].priorPromptSha256 = sha256('stale prompt'); }, value => { value.changes[0].newPromptSha256 = sha256('wrong current prompt'); },
    value => { value.changes[0].newPromptSha256 = value.changes[0].priorPromptSha256; },
    value => { value.changes[0].reason = ''; }, value => { value.changes[0].sources = []; },
    value => { value.changes[0].sources[0].reference = 'http://example.invalid'; },
    value => { value.revisionId = '../outside'; }, value => { value.createdAt = 'unknown'; }
  ]) {
    const invalid = structuredClone(request);
    mutate(invalid);
    await assert.rejects(() => proposeRevision(invalid, { root: fixture.root }));
    assert.deepEqual(await read(fixture.root, batchRelativePath), original);
  }
});

test('installed jobs and partial-image blocked jobs cannot be revised', async () => {
  const fixture = await createFixture();
  const installed = fixture.batch.jobs[0];
  const request = await requestFor(fixture, [installed.id]);
  await assert.rejects(() => proposeRevision(request, { root: fixture.root }), /Cannot revise installed job/);
  assert.deepEqual(await readJson(fixture.root, batchRelativePath), fixture.batch);
  const second = await createFixture();
  const job = second.batch.jobs[4];
  const pendingRequest = await requestFor(second, [job.id]);
  await write(second.root, `public${job.output}`, Buffer.from('Synthetic interrupted image without proof'));
  await assert.rejects(() => proposeRevision(pendingRequest, { root: second.root }), /Cannot revise blocked job/);
});

test('unselected catalog drift and changes to output, mode or family never enter a revision', async () => {
  const fixture = await createFixture();
  const request = await requestFor(fixture, [fixture.batch.jobs[4].id]);
  const baseline = await readJson(fixture.root, catalogPath);
  for (const mutate of [
    catalog => { catalog.entrees.find(value => String(value.id) === fixture.batch.jobs[5].id).promptOpenAI += ' Unselected canonical drift.'; },
    catalog => { catalog.entrees.find(value => String(value.id) === fixture.batch.jobs[4].id).cheminCibleDedie += '.other'; },
    catalog => { catalog.entrees.find(value => String(value.id) === fixture.batch.jobs[4].id).mode = 'TACTICS'; },
    catalog => { catalog.entrees.find(value => String(value.id) === fixture.batch.jobs[4].id).famille = 'arc-personnage'; }
  ]) {
    const changed = structuredClone(baseline);
    mutate(changed);
    await write(fixture.root, catalogPath, JSON.stringify(changed));
    await assert.rejects(() => proposeRevision(request, { root: fixture.root }), /drift/);
  }
});

test('a changed proposal or changed live source snapshot is rejected at apply', async () => {
  const fixture = await createFixture();
  const request = await requestFor(fixture, [fixture.batch.jobs[4].id]);
  const plan = await proposeRevision(request, { root: fixture.root });
  const altered = structuredClone(plan);
  altered.request.changes[0].reason += ' Mutated after proposal.';
  await assert.rejects(() => applyRevision(altered, { root: fixture.root }), /plan changed/);
  const original = await read(fixture.root, batchRelativePath);
  await write(fixture.root, ledgerPath, `${(await read(fixture.root, ledgerPath)).toString()}\n`);
  await assert.rejects(() => applyRevision(plan, { root: fixture.root }), /snapshot changed/);
  assert.deepEqual(await read(fixture.root, batchRelativePath), original);
});

test('an interrupted archive resumes identically, while divergent archive bytes fail closed', async () => {
  const fixture = await createFixture();
  const request = await requestFor(fixture, [fixture.batch.jobs[4].id]);
  const plan = await proposeRevision(request, { root: fixture.root });
  const original = await read(fixture.root, batchRelativePath);
  const archive = `${plan.revision.directory}/before.json`;
  await write(fixture.root, archive, 'Synthetic unexpected archive content');
  await assert.rejects(() => applyRevision(plan, { root: fixture.root }), /Refusing divergent revision archive/);
  assert.deepEqual(await read(fixture.root, batchRelativePath), original);
  await write(fixture.root, archive, original);
  assert.equal((await applyRevision(plan, { root: fixture.root })).applied, true);
  await validateBatchArtifact({ root: fixture.root });
});

test('second revision keeps history verifiable and forbids reusing ids or resurrecting an old prompt hash', async () => {
  const fixture = await createFixture();
  const first = await requestFor(fixture, [fixture.batch.jobs[4].id]);
  await applyRevision(await proposeRevision(first, { root: fixture.root }), { root: fixture.root });
  const second = await requestFor(fixture, [fixture.batch.jobs[5].id], 'fixture-second', 'Second independently traced synthetic scene correction.');
  const secondPlan = await proposeRevision(second, { root: fixture.root });
  await applyRevision(secondPlan, { root: fixture.root });
  const { artifact, artifactSha256 } = await validateBatchArtifact({ root: fixture.root });
  assert.equal(artifact.revision.sequence, 2);
  assert.deepEqual(artifact.jobs.slice(0, 4), fixture.batch.jobs.slice(0, 4));
  const catalog = await readJson(fixture.root, catalogPath);
  const job = artifact.jobs[4];
  catalog.entrees.find(value => String(value.id) === job.id).promptOpenAI = fixture.batch.jobs[4].generationPrompt;
  await write(fixture.root, catalogPath, JSON.stringify(catalog));
  const rollback = { ...first, revisionId: 'fixture-third', expectedArtifactSha256: artifactSha256, changes: [{ ...first.changes[0], priorPromptSha256: job.generationPromptSha256, newPromptSha256: fixture.batch.jobs[4].generationPromptSha256 }] };
  await assert.rejects(() => proposeRevision(rollback, { root: fixture.root }), /hash already used/);
  await assert.rejects(() => proposeRevision({ ...rollback, revisionId: first.revisionId }, { root: fixture.root }), /Revision id was already used/);
});

test('archive corruption is detected by the standard check, not hidden by the active prompt', async () => {
  const fixture = await createFixture();
  const request = await requestFor(fixture, [fixture.batch.jobs[4].id]);
  const plan = await proposeRevision(request, { root: fixture.root });
  await applyRevision(plan, { root: fixture.root });
  const record = await readJson(fixture.root, `${plan.revision.directory}/revision.json`);
  await write(fixture.root, record.archive.beforePrompts[0].file, 'Synthetic archive tampering');
  await assert.rejects(() => validateBatchArtifact({ root: fixture.root }), /Archived prompt changed/);
});

test('revision checks still validate the original text of every frozen prompt file', async () => {
  const fixture = await createFixture();
  const job = fixture.batch.jobs[4];
  const request = await requestFor(fixture, [job.id]);
  await applyRevision(await proposeRevision(request, { root: fixture.root }), { root: fixture.root });
  await write(fixture.root, job.promptFile, 'Synthetic original-file corruption hidden by a revised active prompt');
  await assert.rejects(() => validateBatchArtifact({ root: fixture.root }), /Original prompt file drift/);
});

test('secondary review references require HTTPS and keep their non-official qualification', () => {
  const record = { id: '34441', promptSha256: sha256('synthetic prompt'), stage: 'subject-scene', status: 'approved', reviewer: 'synthetic reviewer', reviewedAt: '2026-09-01T10:00:00.000Z', notes: 'Synthetic secondary sources crosschecked; this fixture is not a production approval.', sources: [{ kind: 'reference-url', reference: 'https://example.invalid/reference', notes: 'Secondary evidence, not official publisher material.' }] };
  assert.equal(validateVisualReviewRecords([record])[0].sources[0].kind, 'reference-url');
  record.sources[0].reference = 'http://example.invalid/reference';
  assert.throws(() => validateVisualReviewRecords([record]), /HTTPS/);
});
