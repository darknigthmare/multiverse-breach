import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA_VERSION = 1;
export const EXPECTED_JOB_COUNT = 500;
export const EXPECTED_BASELINE = Object.freeze({
  total: 3_199,
  available: 503,
  pending: 2_696
});
export const BATCH_ID = 'assets-rift-dossier-pending-500-wave-5-2026-08-30';

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
const catalogPath = path.join(projectRoot, 'docs', 'rift-dossiers', 'catalog.json');
const registryPath = path.join(projectRoot, 'src', 'game', 'riftDossierAssets.json');
export const batchJsonPath = path.join(artifactRoot, 'asset-batch-500-wave-5-rift-dossiers.json');
export const promptDirectory = path.join(artifactRoot, 'asset-batch-500-wave-5-rift-dossiers');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const promptContractSha256 = jobs => sha256(Buffer.from(JSON.stringify(
  jobs.map(job => ({ id: job.id, output: job.output, prompt: job.generationPrompt }))
), 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const slugify = value => String(value || 'dossier')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'dossier';

const promptFileFor = (sequence, entry) => [
  'docs',
  'openai-generation-prompts-2026-08-25',
  'asset-batch-500-wave-5-rift-dossiers',
  `${String(sequence).padStart(3, '0')}-stage-${entry.id}-${slugify(entry.nom?.en || entry.nom?.fr).slice(0, 54)}.txt`
].join('/');

const loadBaseline = async () => {
  const [catalogBytes, registryBytes] = await Promise.all([
    fs.readFile(catalogPath),
    fs.readFile(registryPath)
  ]);
  return {
    catalogBytes,
    registryBytes,
    catalog: JSON.parse(catalogBytes.toString('utf8')),
    registry: JSON.parse(registryBytes.toString('utf8'))
  };
};

const buildJob = (entry, sequence) => {
  const generationPrompt = String(entry.promptOpenAI || '');
  const promptSha256 = sha256(Buffer.from(generationPrompt, 'utf8'));
  const extension = path.extname(entry.cheminCibleDedie);
  return {
    sequence,
    kind: 'stage',
    id: String(entry.id),
    stageId: Number(entry.id),
    assetId: path.basename(entry.cheminCibleDedie, extension),
    name: entry.nom?.en || entry.nom?.fr || `Rift dossier ${entry.id}`,
    universe: Array.isArray(entry.univers) ? entry.univers.join(' + ') : null,
    family: entry.famille,
    mode: entry.mode || null,
    output: entry.cheminCibleDedie,
    replace: false,
    sourcePromptSha256: promptSha256,
    generationPromptSha256: promptSha256,
    promptFile: promptFileFor(sequence, entry),
    generationPrompt
  };
};

export const createBatch = async () => {
  const state = await loadBaseline();
  const entries = state.catalog.entrees;
  const registryEntries = state.registry.entries;
  assert(Array.isArray(entries), 'Rift dossier catalog entries are missing');
  assert(Array.isArray(registryEntries), 'Rift dossier asset registry entries are missing');
  assert(entries.length === EXPECTED_BASELINE.total, 'Rift dossier catalog baseline count drifted');
  assert(registryEntries.length === entries.length, 'Catalog and registry entry counts differ');

  const registryByStageId = new Map();
  for (const registryEntry of registryEntries) {
    const stageId = Number(registryEntry.stageId);
    assert(!registryByStageId.has(stageId), `Duplicate registry stageId ${stageId}`);
    registryByStageId.set(stageId, registryEntry);
  }

  let available = 0;
  const pending = [];
  for (const entry of entries) {
    const registryEntry = registryByStageId.get(Number(entry.id));
    assert(registryEntry, `Missing registry entry for dossier ${entry.id}`);
    assert(
      registryEntry.assetPath === entry.cheminCibleDedie,
      `Dedicated target drift for dossier ${entry.id}`
    );
    if (registryEntry.status === 'available') available += 1;
    else if (registryEntry.status === 'pending') pending.push(entry);
    else throw new Error(`Unsupported registry status for dossier ${entry.id}: ${registryEntry.status}`);
  }
  assert(available === EXPECTED_BASELINE.available, 'Available dossier baseline drifted');
  assert(pending.length === EXPECTED_BASELINE.pending, 'Pending dossier baseline drifted');

  const selected = pending.slice(0, EXPECTED_JOB_COUNT);
  assert(selected.length === EXPECTED_JOB_COUNT, 'Wave 5 cannot select exactly 500 pending dossiers');
  const jobs = selected.map((entry, index) => buildJob(entry, index + 1));
  assert(jobs.every(job => job.family === 'expanded'), 'Wave 5 must remain inside the expanded dossier family');
  assert(jobs[0].stageId === 59, 'Wave 5 first frozen stage drifted');
  assert(jobs.at(-1).stageId === 34_420, 'Wave 5 last frozen stage drifted');
  assert(new Set(jobs.map(job => `${job.kind}:${job.id}`)).size === jobs.length, 'Duplicate Wave 5 job identity');
  assert(new Set(jobs.map(job => job.output)).size === jobs.length, 'Duplicate Wave 5 output');

  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'stage',
    promptCatalogSha256: promptContractSha256(jobs),
    source: {
      catalog: 'docs/rift-dossiers/catalog.json',
      catalogSha256: sha256(state.catalogBytes),
      registry: 'src/game/riftDossierAssets.json',
      registrySha256: sha256(state.registryBytes)
    },
    baseline: {
      ...EXPECTED_BASELINE,
      selectedPending: jobs.length,
      firstStageId: jobs[0].stageId,
      lastStageId: jobs.at(-1).stageId
    },
    selectionPolicy: [
      'take only registry entries whose dedicated OpenAI thumbnail status is pending',
      'preserve the canonical rift-dossier catalog order',
      'freeze exactly the first 500 pending entries without substituting identities',
      'install one 640x360 dedicated thumbnail and one provenance record per successful job'
    ],
    counts: {
      jobs: jobs.length,
      expanded: jobs.filter(job => job.family === 'expanded').length,
      replace: jobs.filter(job => job.replace).length
    },
    jobs
  };
};

const validateJob = async (job, index) => {
  assert(job.sequence === index + 1, `Non-contiguous Wave 5 sequence at ${index + 1}`);
  assert(job.kind === 'stage', `Unexpected kind at sequence ${job.sequence}`);
  assert(job.family === 'expanded', `Unexpected family at sequence ${job.sequence}`);
  assert(job.replace === false, `Wave 5 must not overwrite existing dossier ${job.id}`);
  assert(/^\/images\/rift-dossiers\/openai\/expanded\/.+\.webp$/u.test(job.output), `Invalid output for ${job.id}`);
  assert(typeof job.generationPrompt === 'string' && job.generationPrompt.length >= 400, `Prompt too short for ${job.id}`);
  assert(!job.generationPrompt.includes('[object Object]'), `Malformed prompt for ${job.id}`);
  const bytes = Buffer.from(job.generationPrompt, 'utf8');
  assert(sha256(bytes) === job.generationPromptSha256, `Prompt hash mismatch for ${job.id}`);
  assert(job.sourcePromptSha256 === job.generationPromptSha256, `Source prompt hash mismatch for ${job.id}`);
  const promptPath = path.resolve(projectRoot, ...job.promptFile.split('/'));
  assert(promptPath.startsWith(promptDirectory), `Prompt escapes Wave 5 directory for ${job.id}`);
  const promptBytes = await fs.readFile(promptPath);
  assert(promptBytes.equals(bytes), `Prompt file is not verbatim for ${job.id}`);
};

export const validateBatchArtifact = async () => {
  const artifactBytes = await fs.readFile(batchJsonPath);
  const artifact = JSON.parse(artifactBytes.toString('utf8'));
  assert(artifact.schemaVersion === SCHEMA_VERSION, 'Unexpected Wave 5 schemaVersion');
  assert(artifact.batchId === BATCH_ID, 'Unexpected Wave 5 batchId');
  assert(artifact.kind === 'stage', 'Wave 5 must be a stage batch');
  assert(artifact.jobs?.length === EXPECTED_JOB_COUNT, 'Wave 5 must contain exactly 500 jobs');
  assert(artifact.counts?.jobs === EXPECTED_JOB_COUNT, 'Wave 5 declared job count mismatch');
  assert(artifact.counts?.expanded === EXPECTED_JOB_COUNT, 'Wave 5 expanded count mismatch');
  assert(artifact.counts?.replace === 0, 'Wave 5 cannot contain replacements');
  assert(artifact.baseline?.total === EXPECTED_BASELINE.total, 'Wave 5 total baseline mismatch');
  assert(artifact.baseline?.available === EXPECTED_BASELINE.available, 'Wave 5 available baseline mismatch');
  assert(artifact.baseline?.pending === EXPECTED_BASELINE.pending, 'Wave 5 pending baseline mismatch');
  assert(artifact.baseline?.firstStageId === 59, 'Wave 5 first stage mismatch');
  assert(artifact.baseline?.lastStageId === 34_420, 'Wave 5 last stage mismatch');
  assert(new Set(artifact.jobs.map(job => `${job.kind}:${job.id}`)).size === EXPECTED_JOB_COUNT, 'Wave 5 identities are not unique');
  assert(new Set(artifact.jobs.map(job => job.output)).size === EXPECTED_JOB_COUNT, 'Wave 5 outputs are not unique');
  const files = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  const expectedFiles = artifact.jobs.map(job => path.basename(job.promptFile)).sort();
  assert(JSON.stringify(files) === JSON.stringify(expectedFiles), 'Wave 5 prompt directory differs from the manifest');
  await Promise.all(artifact.jobs.map((job, index) => validateJob(job, index)));
  return { artifact, artifactSha256: sha256(artifactBytes) };
};

const writeBatchArtifact = async batch => {
  await fs.rm(promptDirectory, { recursive: true, force: true });
  await fs.mkdir(promptDirectory, { recursive: true });
  await Promise.all(batch.jobs.map(job => (
    fs.writeFile(path.resolve(projectRoot, ...job.promptFile.split('/')), job.generationPrompt, 'utf8')
  )));
  await fs.writeFile(batchJsonPath, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
};

const main = async () => {
  if (process.argv.includes('--check')) {
    const { artifact, artifactSha256 } = await validateBatchArtifact();
    console.log(JSON.stringify({ status: 'ok', mode: 'check', batchId: artifact.batchId, jobs: artifact.jobs.length, artifactSha256 }, null, 2));
    return;
  }
  const batch = await createBatch();
  await writeBatchArtifact(batch);
  const { artifactSha256 } = await validateBatchArtifact();
  console.log(JSON.stringify({ status: 'ok', mode: 'write', batchId: batch.batchId, jobs: batch.jobs.length, artifactSha256 }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
