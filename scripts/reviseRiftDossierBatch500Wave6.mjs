import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BATCH_ID, batchRelativePath, inspectBatchProgress, projectRoot, promptContractSha256,
  revisionRelativeDirectory, sha256, validateBatch, validateBatchArtifact
} from './buildRiftDossierBatch500Wave6.mjs';

const HASH = /^[a-f0-9]{64}$/;
const REVISION_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const catalogPath = 'docs/rift-dossiers/catalog.json';
const registryPath = 'src/game/riftDossierAssets.json';
const ledgerPath = 'public/images/rift-dossiers/openai/openai-prompts.jsonl';
const changedFields = ['generationPrompt', 'generationPromptSha256', 'sourcePromptSha256', 'promptFile', 'referencePolicy', 'referenceUrls', 'localOpenAiReferences'];
const jsonBytes = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
const exists = file => fs.stat(file).then(() => true).catch(error => { if (error.code === 'ENOENT') return false; throw error; });
const within = (root, relative) => {
  const target = path.resolve(root, relative);
  const local = path.relative(path.resolve(root), target);
  assert(local && !local.startsWith('..') && !path.isAbsolute(local), `Path outside revision workspace: ${relative}`);
  return target;
};
const directoryFor = (sequence, id) => `${revisionRelativeDirectory}/${String(sequence).padStart(4, '0')}-${id}`;
const immutableJob = job => Object.fromEntries(Object.entries(job).filter(([key]) => !changedFields.includes(key)));
const immutableBatch = batch => Object.fromEntries(Object.entries(batch).filter(([key]) => !['jobs', 'revision', 'promptCatalogSha256'].includes(key)));

const validateRequest = request => {
  assert.equal(request.schemaVersion, 1, 'Unsupported revision request schema');
  assert.equal(request.batchId, BATCH_ID, 'Wrong revision batch');
  assert.match(request.revisionId || '', REVISION_ID, 'Invalid revision id');
  assert.match(request.expectedArtifactSha256 || '', HASH, 'Expected artifact hash required');
  assert(typeof request.author === 'string' && request.author.trim(), 'Revision author required');
  assert(typeof request.createdAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(request.createdAt) && Number.isFinite(Date.parse(request.createdAt)), 'Actual ISO revision timestamp required');
  assert(Array.isArray(request.changes) && request.changes.length > 0, 'Empty revision is forbidden');
  assert(request.changes.length <= 500, 'Revision exceeds the frozen selection');
  assert.equal(new Set(request.changes.map(change => String(change.id))).size, request.changes.length, 'Duplicate revision identity');
  for (const change of request.changes) {
    assert(/^\d+$/.test(String(change.id)), 'Invalid revised identity');
    assert.match(change.priorPromptSha256 || '', HASH, 'Prior prompt hash required');
    assert.match(change.newPromptSha256 || '', HASH, 'New prompt hash required');
    assert.notEqual(change.newPromptSha256, change.priorPromptSha256, 'Unchanged prompt is not a revision');
    assert(typeof change.reason === 'string' && change.reason.trim().length >= 20, 'Concrete revision reason required');
    assert(Array.isArray(change.sources) && change.sources.length > 0, 'Revision sources required');
    for (const source of change.sources) {
      assert(['official-url', 'reference-url', 'project-canon'].includes(source.kind), 'Invalid revision source kind');
      assert(typeof source.reference === 'string' && source.reference.trim(), 'Revision source reference required');
      if (source.kind === 'official-url' || source.kind === 'reference-url') assert(/^https:\/\//.test(source.reference), 'Web revision source requires HTTPS');
      assert(typeof source.notes === 'string' && source.notes.trim(), 'Revision source anchors required');
    }
  }
  return request;
};

const validatePlan = plan => {
  assert.equal(plan.schemaVersion, 1);
  assert.equal(plan.kind, 'wave6-prompt-revision-plan');
  assert.equal(plan.batchId, BATCH_ID);
  validateRequest(plan.request);
  assert(Number.isSafeInteger(plan.revision?.sequence) && plan.revision.sequence > 0, 'Invalid planned revision sequence');
  assert.equal(plan.revision.id, plan.request.revisionId);
  assert.equal(plan.revision.directory, directoryFor(plan.revision.sequence, plan.revision.id));
  assert.equal(plan.snapshot.beforeArtifactSha256, plan.request.expectedArtifactSha256);
  for (const hash of Object.values(plan.snapshot)) assert.match(hash, HASH, 'Invalid revision snapshot hash');
  assert.match(plan.afterArtifactSha256 || '', HASH);
  assert.match(plan.promptCatalogSha256 || '', HASH);
  const { planSha256, ...payload } = plan;
  assert.equal(sha256(JSON.stringify(payload)), planSha256, 'Revision plan changed after proposal');
  return plan;
};

const validateTransition = (before, after, plan) => {
  validateBatch(before);
  validateBatch(after);
  assert.deepEqual(immutableBatch(after), immutableBatch(before), 'Revision mutated the frozen baseline or batch metadata');
  assert.equal((before.revision?.sequence || 0) + 1, plan.revision.sequence, 'Revision sequence skipped or reused');
  assert.deepEqual(after.revision, {
    sequence: plan.revision.sequence, id: plan.revision.id,
    beforeArtifactSha256: plan.snapshot.beforeArtifactSha256,
    recordFile: `${plan.revision.directory}/revision.json`
  }, 'Revision metadata mismatch');
  const changes = new Map(plan.request.changes.map(change => [String(change.id), change]));
  assert.deepEqual(after.jobs.map(job => [job.id, job.sequence, job.output]), before.jobs.map(job => [job.id, job.sequence, job.output]), 'Revision reordered or replaced a frozen identity/output');
  for (const [index, job] of after.jobs.entries()) {
    const previous = before.jobs[index];
    const change = changes.get(job.id);
    if (!change) { assert.deepEqual(job, previous, `Unselected job mutation ${job.id}`); continue; }
    assert.deepEqual(immutableJob(job), immutableJob(previous), `Revision mutated immutable job fields ${job.id}`);
    assert.equal(previous.generationPromptSha256, change.priorPromptSha256, `Prior prompt mismatch ${job.id}`);
    assert.equal(job.generationPromptSha256, change.newPromptSha256, `New prompt mismatch ${job.id}`);
    assert.equal(job.promptFile, `${plan.revision.directory}/prompts/stage-${job.id}-${change.newPromptSha256}.txt`);
  }
  assert.equal(after.promptCatalogSha256, plan.promptCatalogSha256);
};

const beforePromptArchive = (before, directory) => before.jobs.map(job => ({
  id: job.id, sha256: job.generationPromptSha256,
  file: `${directory}/before-prompts/stage-${job.id}-${job.generationPromptSha256}.txt`
}));

// Called by the normal builder whenever the active artifact has a revision.
// Every previous artifact and prompt is an immutable, byte-checked archive.
export const validateRevisionChain = async (artifact, { root = projectRoot, artifactBytes = jsonBytes(artifact) } = {}) => {
  let current = artifact;
  let bytes = artifactBytes;
  let remaining = 500;
  while (current.revision) {
    assert(remaining-- > 0, 'Revision chain limit exceeded');
    const record = JSON.parse(await fs.readFile(within(root, current.revision.recordFile), 'utf8'));
    assert.equal(record.schemaVersion, 1);
    assert.equal(record.kind, 'wave6-prompt-revision');
    assert.equal(record.batchId, BATCH_ID);
    const plan = validatePlan(record.plan);
    const directory = plan.revision.directory;
    assert.equal(current.revision.recordFile, `${directory}/revision.json`);
    assert.equal(sha256(bytes), plan.afterArtifactSha256, 'Revision after-artifact hash mismatch');
    assert.equal(record.archive.beforeArtifact, `${directory}/before.json`);
    assert.equal(record.archive.afterArtifact, `${directory}/after.json`);
    assert((await fs.readFile(within(root, record.archive.afterArtifact))).equals(bytes), 'Archived after-artifact differs');
    const previousBytes = await fs.readFile(within(root, record.archive.beforeArtifact));
    assert.equal(sha256(previousBytes), plan.snapshot.beforeArtifactSha256, 'Archived before-artifact hash mismatch');
    const previous = validateBatch(JSON.parse(previousBytes));
    validateTransition(previous, current, plan);
    assert.deepEqual(record.archive.beforePrompts, beforePromptArchive(previous, directory), 'Before-prompt archive mapping changed');
    await Promise.all(record.archive.beforePrompts.map(async (entry, index) => {
      const text = await fs.readFile(within(root, entry.file), 'utf8');
      assert.equal(text, previous.jobs[index].generationPrompt, `Archived prompt changed ${entry.id}`);
      assert.equal(sha256(text), entry.sha256);
    }));
    const revised = current.jobs.filter(job => plan.request.changes.some(change => String(change.id) === job.id));
    await Promise.all(revised.map(async job => assert.equal(await fs.readFile(within(root, job.promptFile), 'utf8'), job.generationPrompt, `Revised prompt changed ${job.id}`)));
    assert.deepEqual((await fs.readdir(within(root, `${directory}/prompts`))).sort(), revised.map(job => path.basename(job.promptFile)).sort(), 'Revision prompt directory mismatch');
    current = previous;
    bytes = previousBytes;
  }
  return validateBatch(current);
};

const computeRevision = async (rawRequest, { root = projectRoot } = {}) => {
  validateRequest(rawRequest);
  const { artifact: before, artifactSha256 } = await validateBatchArtifact({ root, checkCatalog: false });
  assert.equal(artifactSha256, rawRequest.expectedArtifactSha256, 'Stale revision base artifact');
  const request = structuredClone(rawRequest);
  const indices = new Map(before.jobs.map((job, index) => [job.id, index]));
  for (const change of request.changes) {
    change.id = String(change.id);
    assert(indices.has(change.id), `Unknown frozen job ${change.id}`);
  }
  request.changes.sort((a, b) => indices.get(a.id) - indices.get(b.id));
  const [catalogBytes, registryBytes, ledgerBytes, beforeBytes] = await Promise.all([catalogPath, registryPath, ledgerPath, batchRelativePath].map(file => fs.readFile(within(root, file))));
  assert.equal(sha256(beforeBytes), artifactSha256, 'Artifact changed during revision proposal');
  const catalog = JSON.parse(catalogBytes);
  const registry = JSON.parse(registryBytes);
  assert(Array.isArray(catalog.entrees) && Array.isArray(registry.entries));
  assert.equal(new Set(catalog.entrees.map(entry => String(entry.id))).size, catalog.entrees.length, 'Duplicate catalog identity');
  assert.equal(new Set(registry.entries.map(entry => String(entry.stageId))).size, registry.entries.length, 'Duplicate registry identity');
  const entries = new Map(catalog.entrees.map(entry => [String(entry.id), entry]));
  const registryEntries = new Map(registry.entries.map(entry => [String(entry.stageId), entry]));
  const changes = new Map(request.changes.map(change => [change.id, change]));
  const progress = await inspectBatchProgress(before, { root });
  const states = new Map(progress.jobs.map(job => [job.id, job.production]));
  // Returning to a historical hash would silently resurrect old approvals: require a genuinely new prompt.
  const previousHashes = new Map(request.changes.map(change => [change.id, new Set()]));
  let history = before;
  while (true) {
    for (const [id, hashes] of previousHashes) hashes.add(history.jobs[indices.get(id)].generationPromptSha256);
    if (!history.revision) break;
    history = JSON.parse(await fs.readFile(within(root, `${path.posix.dirname(history.revision.recordFile)}/before.json`), 'utf8'));
    assert.notEqual(history.revision?.id, request.revisionId, 'Revision id was already used');
  }
  assert.notEqual(before.revision?.id, request.revisionId, 'Revision id was already used');
  const sequence = (before.revision?.sequence || 0) + 1;
  const directory = directoryFor(sequence, request.revisionId);
  const after = structuredClone(before);
  for (const job of after.jobs) {
    const entry = entries.get(job.id);
    const registered = registryEntries.get(job.id);
    assert.equal(entry?.cheminCibleDedie, job.output, `Catalog output drift ${job.id}`);
    assert.equal(registered?.assetPath, job.output, `Registry output drift ${job.id}`);
    assert.equal(entry?.famille, job.family, `Catalog family drift ${job.id}`);
    assert.equal(entry?.mode || null, job.mode, `Catalog mode drift ${job.id}`);
    const change = changes.get(job.id);
    if (!change) { assert.equal(entry.promptOpenAI, job.generationPrompt, `Unselected catalog prompt drift ${job.id}`); continue; }
    assert(['pending', 'replacement-required'].includes(states.get(job.id)), `Cannot revise ${states.get(job.id)} job ${job.id}; installed jobs require a separate replacement decision`);
    assert.equal(registered.status, 'pending', `Cannot revise available registry job ${job.id}`);
    assert.equal(job.generationPromptSha256, change.priorPromptSha256, `Prior prompt mismatch ${job.id}`);
    assert.equal(typeof entry.promptOpenAI, 'string', `Missing canonical prompt ${job.id}`);
    assert.equal(sha256(entry.promptOpenAI), change.newPromptSha256, `New prompt differs from current catalog ${job.id}`);
    assert(!previousHashes.get(job.id).has(change.newPromptSha256), `Prompt hash already used in this job history ${job.id}`);
    job.generationPrompt = entry.promptOpenAI;
    job.generationPromptSha256 = change.newPromptSha256;
    job.sourcePromptSha256 = change.newPromptSha256;
    job.promptFile = `${directory}/prompts/stage-${job.id}-${change.newPromptSha256}.txt`;
    job.referencePolicy = entry.politiqueReferences || 'project-runtime-lore';
    job.referenceUrls = entry.referenceUrls || [];
    job.localOpenAiReferences = entry.referencesLocalesOpenAI || [];
  }
  after.revision = { sequence, id: request.revisionId, beforeArtifactSha256: artifactSha256, recordFile: `${directory}/revision.json` };
  after.promptCatalogSha256 = promptContractSha256(after.jobs);
  validateBatch(after, catalog);
  const payload = {
    schemaVersion: 1, kind: 'wave6-prompt-revision-plan', batchId: BATCH_ID, request,
    revision: { sequence, id: request.revisionId, directory },
    snapshot: { beforeArtifactSha256: artifactSha256, catalogSha256: sha256(catalogBytes), registrySha256: sha256(registryBytes), ledgerSha256: sha256(ledgerBytes) },
    afterArtifactSha256: sha256(jsonBytes(after)), promptCatalogSha256: after.promptCatalogSha256
  };
  const plan = { ...payload, planSha256: sha256(JSON.stringify(payload)) };
  validateTransition(before, after, plan);
  return { plan, before, beforeBytes, after };
};

export const proposeRevision = async (request, options = {}) => (await computeRevision(request, options)).plan;

const writeOnce = async (root, relative, bytes) => {
  const target = within(root, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  try { await fs.writeFile(target, bytes, { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    // Compare bytes without formatting a potentially multi-megabyte assertion diff.
    assert((await fs.readFile(target)).equals(Buffer.from(bytes)), `Refusing divergent revision archive ${relative}`);
  }
};

export const applyRevision = async (rawPlan, { root = projectRoot } = {}) => {
  const plan = validatePlan(rawPlan);
  const lockPath = within(root, `${revisionRelativeDirectory}/apply.lock`);
  await fs.mkdir(path.dirname(lockPath), { recursive: true });
  const lock = await fs.open(lockPath, 'wx').catch(error => { if (error.code === 'EEXIST') throw new Error('Wave 6 revision lock exists; inspect the interrupted operation before retrying'); throw error; });
  let temporaryPath = null;
  try {
    await lock.writeFile(JSON.stringify({ revisionId: plan.request.revisionId, planSha256: plan.planSha256 }));
    const currentBytes = await fs.readFile(within(root, batchRelativePath));
    if (sha256(currentBytes) === plan.afterArtifactSha256) {
      await validateBatchArtifact({ root });
      const record = JSON.parse(await fs.readFile(within(root, `${plan.revision.directory}/revision.json`), 'utf8'));
      assert.deepEqual(record.plan, plan, 'Applied revision has a different plan');
      return { applied: false, reused: true, artifactSha256: plan.afterArtifactSha256, revision: plan.revision };
    }
    const prepared = await computeRevision(plan.request, { root });
    assert.deepEqual(prepared.plan, plan, 'Revision source snapshot changed after proposal');
    const directory = plan.revision.directory;
    const archive = {
      beforeArtifact: `${directory}/before.json`, afterArtifact: `${directory}/after.json`,
      beforePrompts: beforePromptArchive(prepared.before, directory)
    };
    await writeOnce(root, archive.beforeArtifact, prepared.beforeBytes);
    for (const [index, entry] of archive.beforePrompts.entries()) await writeOnce(root, entry.file, prepared.before.jobs[index].generationPrompt);
    for (const change of plan.request.changes) {
      const job = prepared.after.jobs.find(entry => entry.id === change.id);
      await writeOnce(root, job.promptFile, job.generationPrompt);
    }
    const afterBytes = jsonBytes(prepared.after);
    await writeOnce(root, archive.afterArtifact, afterBytes);
    await writeOnce(root, `${directory}/revision.json`, jsonBytes({ schemaVersion: 1, kind: 'wave6-prompt-revision', batchId: BATCH_ID, plan, archive }));
    await validateRevisionChain(prepared.after, { root, artifactBytes: afterBytes });
    // Serialize revision operators and recheck the live catalog, registry, ledger and job states immediately before activation.
    assert.deepEqual((await computeRevision(plan.request, { root })).plan, plan, 'Revision source snapshot changed before activation');
    temporaryPath = within(root, `${batchRelativePath}.${plan.request.revisionId}.tmp`);
    await writeOnce(root, path.relative(root, temporaryPath), afterBytes);
    assert.equal(sha256(await fs.readFile(within(root, batchRelativePath))), plan.snapshot.beforeArtifactSha256, 'Concurrent artifact change before activation');
    await fs.rename(temporaryPath, within(root, batchRelativePath));
    temporaryPath = null;
    await validateBatchArtifact({ root });
    return { applied: true, reused: false, artifactSha256: plan.afterArtifactSha256, revision: plan.revision };
  } finally {
    await lock.close();
    if (temporaryPath && await exists(temporaryPath)) await fs.unlink(temporaryPath);
    await fs.unlink(lockPath);
  }
};

const main = async () => {
  const [mode, input, outputFlag, output] = process.argv.slice(2);
  assert(['--propose', '--apply'].includes(mode) && input, 'Usage: --propose request.json [--out plan.json] | --apply plan.json');
  const document = JSON.parse(await fs.readFile(path.resolve(projectRoot, input), 'utf8'));
  if (mode === '--apply') {
    assert(!outputFlag, 'Apply does not accept an output or force option');
    console.log(JSON.stringify(await applyRevision(document), null, 2));
  } else {
    const plan = await proposeRevision(document);
    if (outputFlag) {
      assert.equal(outputFlag, '--out');
      assert(output, 'Missing proposal output path');
      await writeOnce(projectRoot, output, jsonBytes(plan));
      console.log(JSON.stringify({ proposed: true, path: output, planSha256: plan.planSha256, jobs: plan.request.changes.length }, null, 2));
    } else console.log(JSON.stringify(plan, null, 2));
  }
};
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
