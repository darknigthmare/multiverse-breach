import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const SCHEMA_VERSION = 1;
export const EXPECTED_JOB_COUNT = 500;
export const EXPECTED_BASELINE = Object.freeze({ total: 3199, available: 994, pending: 2205 });
export const EXPECTED_FAMILIES = Object.freeze({ expanded: 309, 'arc-personnage': 191 });
export const REPLACEMENT_STAGE_IDS = Object.freeze([9210, 9211, 9212, 9214, 9216, 9217, 9220, 9222, 9223, 9225, 9226, 9229, 9230, 9231]);
export const BATCH_ID = 'assets-rift-dossier-pending-500-wave-6-2026-08-31';
const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactDirectory = 'docs/openai-generation-prompts-2026-08-31';
export const batchRelativePath = `${artifactDirectory}/asset-batch-500-wave-6-rift-dossiers.json`;
export const promptRelativeDirectory = `${artifactDirectory}/asset-batch-500-wave-6-rift-dossiers`;
export const visualReviewRelativePath = `${artifactDirectory}/asset-batch-500-wave-6-visual-reviews.json`;
export const revisionRelativeDirectory = `${artifactDirectory}/asset-batch-500-wave-6-revisions`;
export const batchJsonPath = path.join(projectRoot, batchRelativePath);
export const promptDirectory = path.join(projectRoot, promptRelativeDirectory);
const catalogRelativePath = 'docs/rift-dossiers/catalog.json';
const registryRelativePath = 'src/game/riftDossierAssets.json';
const ledgerRelativePath = 'public/images/rift-dossiers/openai/openai-prompts.jsonl';
const HASH = /^[a-f0-9]{64}$/;
const GENERATION = /^exec-[A-Za-z0-9](?:[A-Za-z0-9-]{1,126})$/;
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const promptContractSha256 = jobs => sha256(JSON.stringify(jobs.map(job => ({ id: job.id, output: job.output, prompt: job.generationPrompt }))));
const slugify = value => String(value || 'dossier').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const ledgerFor = (ledger, output) => ledger.filter(entry => entry.output === output);
const exists = file => fs.stat(file).then(stat => stat.isFile()).catch(error => { if (error.code === 'ENOENT') return false; throw error; });
const publicPath = (root, output) => {
  assert.match(output, /^\/images\/rift-dossiers\/openai\/(expanded|arc-personnage)\/[^/]+\.webp$/);
  assert(!output.includes('..'), `Invalid output ${output}`);
  return path.join(root, 'public', output.slice(1));
};
const parseLedger = bytes => bytes.toString('utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);

export const selectPendingEntries = (catalog, registry, limit = EXPECTED_JOB_COUNT) => {
  assert(Array.isArray(catalog.entrees), 'Missing dossier catalog');
  assert(Array.isArray(registry.entries), 'Missing dossier registry');
  assert.equal(registry.entries.length, catalog.entrees.length, 'Catalog/registry counts differ');
  const byId = new Map();
  const registryOutputs = new Set();
  for (const entry of registry.entries) {
    const id = String(entry.stageId);
    assert(!byId.has(id), `Duplicate registry stage ${id}`);
    assert(!registryOutputs.has(entry.assetPath), `Duplicate registry output ${entry.assetPath}`);
    assert(['available', 'pending'].includes(entry.status), `Unsupported registry status ${id}`);
    byId.set(id, entry);
    registryOutputs.add(entry.assetPath);
  }
  const ids = new Set();
  const outputs = new Set();
  const pending = [];
  for (const entry of catalog.entrees) {
    const id = String(entry.id);
    assert(!ids.has(id), `Duplicate catalog stage ${id}`);
    assert(!outputs.has(entry.cheminCibleDedie), `Duplicate catalog output ${entry.cheminCibleDedie}`);
    ids.add(id);
    outputs.add(entry.cheminCibleDedie);
    assert.equal(byId.get(id)?.assetPath, entry.cheminCibleDedie, `Registry target drift for ${id}`);
    if (byId.get(id).status === 'pending') pending.push(entry);
  }
  assert(pending.length >= limit, `Cannot select ${limit} pending dossiers`);
  return pending.slice(0, limit);
};

export const replacementEvidenceFor = (entry, imageSha256, ledger) => {
  assert(REPLACEMENT_STAGE_IDS.includes(Number(entry.id)), `Unexpected existing pending output ${entry.id}`);
  const matches = ledgerFor(ledger, entry.cheminCibleDedie);
  assert.equal(matches.length, 1, `Replacement ${entry.id} requires unique provenance`);
  const proof = matches[0];
  assert.equal(proof.kind, 'rift-dossier-thumbnail');
  assert.equal(String(proof.missionId), String(entry.id), `Replacement mission mismatch ${entry.id}`);
  assert.equal(proof.generation?.provider, 'OpenAI');
  assert.equal(proof.generation?.interface, 'built-in image_gen');
  assert.match(proof.generation?.generationId || '', GENERATION);
  assert.equal(proof.image?.sha256, imageSha256, `Existing image drift for ${entry.id}`);
  assert.match(proof.generation?.promptSha256 || '', HASH);
  // Legacy entries legitimately retain only the original prompt hash. Never invent their missing text.
  if (Object.hasOwn(proof, 'prompt')) {
    assert.equal(typeof proof.prompt, 'string', `Existing prompt proof mismatch ${entry.id}`);
    assert.equal(sha256(proof.prompt), proof.generation.promptSha256, `Existing prompt proof mismatch ${entry.id}`);
  }
  assert.notEqual(proof.generation.promptSha256, sha256(entry.promptOpenAI), `Replacement ${entry.id} is already current`);
  return {
    reason: 'catalog-prompt-mismatch',
    previousImageSha256: imageSha256,
    previousPromptSha256: proof.generation.promptSha256,
    previousGenerationId: proof.generation.generationId,
    requiresNewOpenAiGeneration: true,
    preservePriorProvenance: true
  };
};

export const createBatch = async ({ root = projectRoot } = {}) => {
  const [catalogBytes, registryBytes, ledgerBytes] = await Promise.all([catalogRelativePath, registryRelativePath, ledgerRelativePath].map(file => fs.readFile(path.join(root, file))));
  const catalog = JSON.parse(catalogBytes);
  const registry = JSON.parse(registryBytes);
  const ledger = parseLedger(ledgerBytes);
  const selected = selectPendingEntries(catalog, registry);
  const available = registry.entries.filter(entry => entry.status === 'available').length;
  assert.deepEqual({ total: catalog.entrees.length, available, pending: registry.entries.length - available }, EXPECTED_BASELINE, 'Wave 6 initial snapshot drifted; never silently refill its 500 jobs');
  const jobs = [];
  for (const [index, entry] of selected.entries()) {
    const output = entry.cheminCibleDedie;
    const destination = publicPath(root, output);
    const present = await exists(destination);
    const replacement = present ? replacementEvidenceFor(entry, sha256(await fs.readFile(destination)), ledger) : null;
    assert(present || !REPLACEMENT_STAGE_IDS.includes(Number(entry.id)), `Missing replacement source ${entry.id}`);
    assert(present || ledgerFor(ledger, output).length === 0, `Unexpected provenance without image for ${entry.id}`);
    const sequence = index + 1;
    const generationPrompt = entry.promptOpenAI;
    jobs.push({
      sequence, kind: 'stage', id: String(entry.id), stageId: Number(entry.id),
      assetId: path.basename(output, '.webp'),
      name: entry.nom?.en || entry.nom?.fr || `Dossier ${entry.id}`,
      universe: entry.univers.join(' + '), family: entry.famille, mode: entry.mode || null,
      output, replace: present, replacement,
      reviewRequirements: { subjectAndSceneBeforeGeneration: true, generatedRasterBeforeInstall: true },
      referencePolicy: entry.politiqueReferences || 'project-runtime-lore',
      referenceUrls: entry.referenceUrls || [], localOpenAiReferences: entry.referencesLocalesOpenAI || [],
      sourcePromptSha256: sha256(generationPrompt), generationPromptSha256: sha256(generationPrompt),
      promptFile: `${promptRelativeDirectory}/${String(sequence).padStart(3, '0')}-stage-${entry.id}-${slugify(entry.nom?.en || entry.nom?.fr).slice(0, 54)}.txt`,
      generationPrompt
    });
  }
  const batch = {
    schemaVersion: SCHEMA_VERSION, batchId: BATCH_ID, kind: 'stage',
    promptCatalogSha256: promptContractSha256(jobs),
    source: {
      catalog: catalogRelativePath, catalogSha256: sha256(catalogBytes),
      registry: registryRelativePath, registrySha256: sha256(registryBytes),
      ledger: ledgerRelativePath, ledgerSha256: sha256(ledgerBytes)
    },
    baseline: { ...EXPECTED_BASELINE, selectedPending: jobs.length, firstStageId: jobs[0].stageId, lastStageId: jobs.at(-1).stageId },
    selectionPolicy: [
      'freeze the first 500 pending entries in canonical catalog order once',
      '309 expanded plus 191 character arcs, including exactly 14 explicit stale-prompt replacements',
      'reuse the frozen manifest after partial installation; never replace completed jobs with new identities',
      'only a new built-in OpenAI ImageGen result, exact prompt, 640x360 RGB WebP and matching provenance count as installed',
      'preserve the old image and provenance when installing a replacement; never relabel an old generation',
      'planning and technical installation do not establish visual fidelity; explicit subject/scene and generated-raster reviews are mandatory'
    ],
    counts: { jobs: jobs.length, expanded: jobs.filter(job => job.family === 'expanded').length, 'arc-personnage': jobs.filter(job => job.family === 'arc-personnage').length, replace: jobs.filter(job => job.replace).length, new: jobs.filter(job => !job.replace).length },
    jobs
  };
  validateBatch(batch, catalog);
  return batch;
};

export const validateBatch = (batch, catalog = null) => {
  assert.equal(batch.schemaVersion, SCHEMA_VERSION);
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.kind, 'stage');
  if (batch.revision !== undefined) {
    assert(Number.isSafeInteger(batch.revision.sequence) && batch.revision.sequence > 0, 'Invalid revision sequence');
    assert.match(batch.revision.id || '', /^[a-z0-9][a-z0-9-]{0,63}$/);
    assert.match(batch.revision.beforeArtifactSha256 || '', HASH);
    assert.equal(batch.revision.recordFile, `${revisionRelativeDirectory}/${String(batch.revision.sequence).padStart(4, '0')}-${batch.revision.id}/revision.json`);
  }
  assert.equal(batch.jobs?.length, EXPECTED_JOB_COUNT);
  assert.deepEqual(batch.counts, { jobs: 500, expanded: 309, 'arc-personnage': 191, replace: 14, new: 486 });
  assert.deepEqual({ total: batch.baseline.total, available: batch.baseline.available, pending: batch.baseline.pending }, EXPECTED_BASELINE);
  assert.equal(batch.baseline.selectedPending, EXPECTED_JOB_COUNT);
  assert.equal(batch.baseline.firstStageId, 34421);
  assert.equal(batch.baseline.lastStageId, 9469);
  assert.equal(batch.jobs[0].stageId, 34421);
  assert.equal(batch.jobs.at(-1).stageId, 9469);
  assert.equal(new Set(batch.jobs.map(job => job.id)).size, 500, 'Duplicate Wave 6 identity');
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, 500, 'Duplicate Wave 6 output');
  assert.equal(new Set(batch.jobs.map(job => job.promptFile)).size, 500, 'Duplicate Wave 6 prompt file');
  assert.deepEqual(batch.jobs.filter(job => job.replace).map(job => job.stageId), REPLACEMENT_STAGE_IDS);
  assert.equal(promptContractSha256(batch.jobs), batch.promptCatalogSha256, 'Wave 6 prompt contract changed');
  const catalogById = catalog ? new Map(catalog.entrees.map(entry => [String(entry.id), entry])) : null;
  for (const [index, job] of batch.jobs.entries()) {
    assert.equal(job.sequence, index + 1);
    assert.equal(job.kind, 'stage');
    assert.equal(job.id, String(job.stageId));
    assert.equal(job.family, index < 309 ? 'expanded' : 'arc-personnage');
    assert.deepEqual(job.reviewRequirements, { subjectAndSceneBeforeGeneration: true, generatedRasterBeforeInstall: true });
    publicPath(projectRoot, job.output);
    assert(job.output.includes(`/${job.family}/`));
    const initialPrompt = path.dirname(job.promptFile) === promptRelativeDirectory;
    const versionedPrompt = job.promptFile.startsWith(`${revisionRelativeDirectory}/`) && /^\d{4,}-[a-z0-9][a-z0-9-]{0,63}\/prompts\/stage-\d+-[a-f0-9]{64}\.txt$/.test(job.promptFile.slice(revisionRelativeDirectory.length + 1));
    assert((initialPrompt || (batch.revision && versionedPrompt)) && !job.promptFile.includes('..') && job.promptFile.endsWith('.txt'), `Invalid prompt path ${job.id}`);
    assert.equal(typeof job.generationPrompt, 'string');
    assert(job.generationPrompt.length >= 400 && !job.generationPrompt.includes('[object Object]'));
    assert.equal(sha256(job.generationPrompt), job.generationPromptSha256);
    assert.equal(job.sourcePromptSha256, job.generationPromptSha256);
    if (job.replace) {
      assert.equal(job.replacement?.reason, 'catalog-prompt-mismatch');
      assert.match(job.replacement.previousImageSha256, HASH);
      assert.match(job.replacement.previousPromptSha256, HASH);
      assert.match(job.replacement.previousGenerationId, GENERATION);
      assert.notEqual(job.replacement.previousPromptSha256, job.generationPromptSha256);
      assert.equal(job.replacement.requiresNewOpenAiGeneration, true);
      assert.equal(job.replacement.preservePriorProvenance, true);
    } else assert.equal(job.replacement, null);
    if (catalogById) {
      const current = catalogById.get(job.id);
      assert.equal(current?.cheminCibleDedie, job.output, `Current catalog target drift ${job.id}`);
      assert.equal(current?.promptOpenAI, job.generationPrompt, `Current catalog prompt drift ${job.id}`);
    }
  }
  return batch;
};

// checkCatalog=false is reserved for an explicit revision proposal: intrinsic history remains fully checked.
export const validateBatchArtifact = async ({ root = projectRoot, checkCatalog = true } = {}) => {
  const [artifactBytes, catalogBytes] = await Promise.all([batchRelativePath, catalogRelativePath].map(file => fs.readFile(path.join(root, file))));
  const artifact = validateBatch(JSON.parse(artifactBytes), checkCatalog ? JSON.parse(catalogBytes) : null);
  const initialArtifact = artifact.revision
    ? await (await import('./reviseRiftDossierBatch500Wave6.mjs')).validateRevisionChain(artifact, { root, artifactBytes })
    : artifact;
  for (const job of artifact.jobs) assert.equal(await fs.readFile(path.join(root, job.promptFile), 'utf8'), job.generationPrompt, `Prompt file drift ${job.id}`);
  if (artifact.revision) {
    // Revised jobs use new active paths, but their original files remain part of
    // the frozen production evidence. An intact archive must not conceal edits.
    await Promise.all(initialArtifact.jobs.map(async job => {
      assert.equal(await fs.readFile(path.join(root, job.promptFile), 'utf8'), job.generationPrompt, `Original prompt file drift ${job.id}`);
    }));
  }
  const files = (await fs.readdir(path.join(root, promptRelativeDirectory))).sort();
  assert.deepEqual(files, initialArtifact.jobs.map(job => path.basename(job.promptFile)).sort(), 'Wave 6 prompt directory mismatch');
  return { artifact, artifactSha256: sha256(artifactBytes) };
};

// No delete/rebuild: identical files are reused, divergent content fails closed.
export const writeBatchArtifact = async (batch, { root = projectRoot } = {}) => {
  validateBatch(batch);
  const writeOnce = async (relative, content) => {
    const destination = path.join(root, relative);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    try { await fs.writeFile(destination, content, { encoding: 'utf8', flag: 'wx' }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; assert.equal(await fs.readFile(destination, 'utf8'), content, `Refusing to overwrite ${relative}`); }
  };
  for (const job of batch.jobs) await writeOnce(job.promptFile, job.generationPrompt);
  await writeOnce(batchRelativePath, `${JSON.stringify(batch, null, 2)}\n`);
};

export const classifyJobState = (job, { imageSha256 = null, ledger = [], metadata = null } = {}) => {
  const proofs = ledgerFor(ledger, job.output);
  if (!imageSha256 && proofs.length === 0) return job.replace ? 'blocked' : 'pending';
  if (!imageSha256 || proofs.length !== 1) return 'blocked';
  const proof = proofs[0];
  const validIdentity = proof.kind === 'rift-dossier-thumbnail' && String(proof.missionId) === job.id && proof.generation?.provider === 'OpenAI' && proof.generation?.interface === 'built-in image_gen' && GENERATION.test(proof.generation?.generationId || '') && proof.image?.sha256 === imageSha256;
  if (!validIdentity) return 'blocked';
  const actualReplacement = !job.replace || (proof.generation.generationId !== job.replacement.previousGenerationId && imageSha256 !== job.replacement.previousImageSha256);
  if (actualReplacement && proof.generation.promptSha256 === job.generationPromptSha256 && proof.prompt === job.generationPrompt && metadata?.width === 640 && metadata?.height === 360 && metadata?.format === 'webp' && metadata?.channels === 3) return 'installed';
  const oldPromptMatches = !Object.hasOwn(proof, 'prompt') || (typeof proof.prompt === 'string' && sha256(proof.prompt) === proof.generation.promptSha256);
  if (job.replace && imageSha256 === job.replacement.previousImageSha256 && proof.generation.promptSha256 === job.replacement.previousPromptSha256 && proof.generation.generationId === job.replacement.previousGenerationId && oldPromptMatches) return 'replacement-required';
  return 'blocked';
};

// Review records are explicit operator observations, never inferred from the presence of a prompt or bitmap.
export const validateVisualReviewRecords = records => {
  assert(Array.isArray(records), 'Visual review records must be an array');
  for (const record of records) {
    assert(/^\d+$/.test(String(record.id)), 'Visual review requires a stage identity');
    assert.match(record.promptSha256 || '', HASH, 'Visual review requires the exact reviewed prompt hash');
    assert(['subject-scene', 'raster'].includes(record.stage), 'Unsupported visual review stage');
    assert(['approved', 'rejected'].includes(record.status), 'Visual reviews require an explicit decision');
    assert(typeof record.reviewer === 'string' && record.reviewer.trim(), 'Visual review requires a reviewer');
    assert(typeof record.reviewedAt === 'string' && Number.isFinite(Date.parse(record.reviewedAt)), 'Visual review requires its actual review timestamp');
    assert(typeof record.notes === 'string' && record.notes.trim().length >= 20, 'Visual review requires concrete subject/scene observations');
    if (record.stage === 'subject-scene') {
      assert(Array.isArray(record.sources) && record.sources.length > 0, 'Subject/scene review requires source references');
      for (const source of record.sources) {
        assert(['official-url', 'reference-url', 'project-canon'].includes(source.kind), 'Review source must distinguish official references, crosschecked references and project canon');
        assert(typeof source.reference === 'string' && source.reference.trim(), 'Missing review source');
        if (source.kind === 'official-url' || source.kind === 'reference-url') assert(/^https:\/\//.test(source.reference), 'Web reference must be an HTTPS URL');
        assert(typeof source.notes === 'string' && source.notes.trim(), 'Review source requires the supported semantic anchors');
      }
    } else {
      assert.match(record.generationId || '', GENERATION, 'Raster review requires the actual built-in generation id');
      assert.match(record.sourceSha256 || '', HASH, 'Raster review requires the actual reviewed PNG hash');
    }
  }
  return records;
};

export const readVisualReviewRecords = async ({ root = projectRoot } = {}) => {
  const file = path.join(root, visualReviewRelativePath);
  if (!await exists(file)) return [];
  const document = JSON.parse(await fs.readFile(file, 'utf8'));
  assert.equal(document.schemaVersion, SCHEMA_VERSION);
  assert.equal(document.batchId, BATCH_ID);
  return validateVisualReviewRecords(document.records);
};

export const getJobVisualReview = (job, { records = [], generationId = null, sourceSha256 = null } = {}) => {
  validateVisualReviewRecords(records);
  const relevant = records.filter(record => String(record.id) === job.id && record.promptSha256 === job.generationPromptSha256);
  const subject = relevant.filter(record => record.stage === 'subject-scene').at(-1);
  if (!subject) return { status: 'subject-scene-required', subjectApproved: false, approved: false };
  if (subject.status !== 'approved') return { status: 'subject-scene-rejected', subjectApproved: false, approved: false };
  const raster = relevant.filter(record => record.stage === 'raster' && (!generationId || record.generationId === generationId) && (!sourceSha256 || record.sourceSha256 === sourceSha256)).at(-1);
  if (!raster || Date.parse(raster.reviewedAt) < Date.parse(subject.reviewedAt)) return { status: 'raster-required', subjectApproved: true, approved: false };
  return { status: raster.status === 'approved' ? 'approved' : 'raster-rejected', subjectApproved: true, approved: raster.status === 'approved' };
};

export const inspectBatchProgress = async (batch, { root = projectRoot } = {}) => {
  const ledger = parseLedger(await fs.readFile(path.join(root, ledgerRelativePath)));
  const records = await readVisualReviewRecords({ root });
  const jobs = [];
  for (const job of batch.jobs) {
    const destination = publicPath(root, job.output);
    const present = await exists(destination);
    const bytes = present ? await fs.readFile(destination) : null;
    const metadata = bytes ? await sharp(bytes).metadata().catch(() => null) : null;
    const production = classifyJobState(job, { ledger, imageSha256: bytes ? sha256(bytes) : null, metadata });
    const proof = ledgerFor(ledger, job.output).find(entry => entry.generation?.promptSha256 === job.generationPromptSha256);
    const visualReview = getJobVisualReview(job, { records, generationId: proof?.generation?.generationId, sourceSha256: proof?.sourceImage?.sha256 });
    const complete = production === 'installed' && HASH.test(proof?.sourceImage?.sha256 || '') && visualReview.approved;
    const awaitingProduction = ['pending', 'replacement-required'].includes(production);
    jobs.push({ id: job.id, sequence: job.sequence, status: production, production, visualReview: visualReview.status, canGenerate: awaitingProduction && visualReview.subjectApproved && !visualReview.approved, canInstall: awaitingProduction && visualReview.approved, complete, output: job.output, promptFile: job.promptFile });
  }
  return { batchId: batch.batchId, counts: Object.fromEntries(['pending', 'replacement-required', 'installed', 'blocked'].map(status => [status, jobs.filter(job => job.status === status).length])), visualReviewCounts: Object.fromEntries(['subject-scene-required', 'subject-scene-rejected', 'raster-required', 'raster-rejected', 'approved'].map(status => [status, jobs.filter(job => job.visualReview === status).length])), complete: jobs.filter(job => job.complete).length, jobs };
};

// Build only the JSON contract; this function never generates or installs an image.
export const createInstallManifest = async (batch, completions, { root = projectRoot } = {}) => {
  validateBatch(batch);
  assert(Array.isArray(completions) && completions.length > 0, 'No actual generation supplied');
  const reviewRecords = await readVisualReviewRecords({ root });
  const selected = await Promise.all(completions.map(async completion => {
    const job = batch.jobs.find(entry => entry.id === String(completion.id));
    assert(job, `Unknown Wave 6 job ${completion.id}`);
    assert.match(completion.generationId || '', GENERATION, 'An actual built-in ImageGen generation id is required');
    assert.equal(path.extname(completion.source || '').toLowerCase(), '.png', 'Actual source must be PNG');
    const sourceSha256 = sha256(await fs.readFile(path.resolve(root, completion.source)));
    const visualReview = getJobVisualReview(job, { records: reviewRecords, generationId: completion.generationId, sourceSha256 });
    assert(visualReview.approved, `Wave 6 ${job.id} requires approved subject/scene and exact generated-PNG reviews before install (${visualReview.status})`);
    let replacementArchive = null;
    if (job.replace) {
      assert.notEqual(completion.generationId, job.replacement.previousGenerationId, 'A replacement cannot reuse the old generation id');
      assert(completion.replacementArchive?.image && completion.replacementArchive?.ledger, `Durable image and ledger backups required before replacing ${job.id}`);
      const image = path.resolve(root, completion.replacementArchive.image);
      const ledger = path.resolve(root, completion.replacementArchive.ledger);
      const [imageReal, ledgerReal] = await Promise.all([fs.realpath(image), fs.realpath(ledger)]);
      const [liveImageReal, liveLedgerReal] = await Promise.all([fs.realpath(publicPath(root, job.output)), fs.realpath(path.join(root, ledgerRelativePath))]);
      assert.notEqual(imageReal, liveImageReal, 'Image backup is the live output');
      assert.notEqual(ledgerReal, liveLedgerReal, 'Ledger backup is the live ledger');
      const [imageBytes, ledgerBytes] = await Promise.all([fs.readFile(image), fs.readFile(ledger)]);
      assert.deepEqual(replacementEvidenceFor({ id: job.id, cheminCibleDedie: job.output, promptOpenAI: job.generationPrompt }, sha256(imageBytes), parseLedger(ledgerBytes)), job.replacement, `Durable replacement backup mismatch ${job.id}`);
      const [liveImageBytes, liveLedgerBytes] = await Promise.all([fs.readFile(liveImageReal), fs.readFile(liveLedgerReal)]);
      const liveLedger = parseLedger(liveLedgerBytes);
      const liveState = classifyJobState(job, { imageSha256: sha256(liveImageBytes), ledger: liveLedger, metadata: await sharp(liveImageBytes).metadata().catch(() => null) });
      assert(['replacement-required', 'installed'].includes(liveState), `Replacement live state drift ${job.id}`);
      if (liveState === 'installed') {
        const installed = ledgerFor(liveLedger, job.output)[0];
        assert(installed.generation.generationId === completion.generationId && installed.sourceImage?.sha256 === sourceSha256, `Replacement ${job.id} was already installed from a different generation`);
      }
      replacementArchive = { image, ledger, imageSha256: sha256(imageBytes), ledgerSha256: sha256(ledgerBytes) };
    }
    return { job, completion, replacementArchive, sourceSha256 };
  }));
  assert.equal(new Set(selected.map(({ job }) => job.id)).size, selected.length, 'Duplicate install selection');
  return {
    schemaVersion: 1, batchId: `${BATCH_ID}-install`, sourceBatchId: BATCH_ID,
    promptCatalogSha256: promptContractSha256(selected.map(({ job }) => job)),
    jobs: selected.map(({ job, completion, replacementArchive, sourceSha256 }, index) => ({
      sequence: index + 1, sourceSequence: job.sequence, kind: 'stage', id: job.id, output: job.output,
      source: path.resolve(root, completion.source), generationId: completion.generationId,
      generationPromptFile: path.join(root, job.promptFile), generationPromptSha256: job.generationPromptSha256,
      catalogPromptSha256: job.sourcePromptSha256, replace: job.replace,
      visualReview: { status: 'approved', ledger: path.join(root, visualReviewRelativePath), sourceSha256 },
      ...(job.replacement ? { replacementPrecondition: job.replacement, replacementArchive } : {})
    }))
  };
};

const main = async () => {
  const mode = process.argv[2] || '--write';
  assert(['--write', '--check', '--status'].includes(mode), `Unknown mode ${mode}`);
  const reused = await exists(batchJsonPath);
  if (mode === '--write' && !reused) await writeBatchArtifact(await createBatch());
  const { artifact, artifactSha256 } = await validateBatchArtifact();
  if (mode === '--status') {
    const progress = await inspectBatchProgress(artifact);
    console.log(JSON.stringify({ batchId: BATCH_ID, counts: progress.counts, visualReviewCounts: progress.visualReviewCounts, complete: progress.complete, nextJobs: progress.jobs.filter(job => ['pending', 'replacement-required'].includes(job.status)).slice(0, 3), nextGenerationJobs: progress.jobs.filter(job => job.canGenerate).slice(0, 3), nextInstallJobs: progress.jobs.filter(job => job.canInstall).slice(0, 3), blocked: progress.jobs.filter(job => job.status === 'blocked') }, null, 2));
    if (progress.counts.blocked) process.exitCode = 1;
  } else console.log(JSON.stringify({ status: 'ok', mode, reused, batchId: BATCH_ID, counts: artifact.counts, artifactSha256 }, null, 2));
};
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
