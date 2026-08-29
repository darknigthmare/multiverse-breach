import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHeroGenerationPrompt } from './buildMissingAssetBatch500Wave3.mjs';

export const SCHEMA_VERSION = 1;
export const BASELINE_OFFSET = 500;
export const REPLACEMENT_COUNT = 5;
export const FAILED_SOURCE_SEQUENCES = Object.freeze([72, 73, 74, 423, 447]);
export const BATCH_ID = 'assets-missing-500-wave-3-makeup-5-2026-08-28';

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
const sourceBatchPath = path.join(artifactRoot, 'asset-batch-500-wave-3.json');
const promptCatalogPath = path.join(projectRoot, 'public', 'sprites', 'generated', 'openai-sprite-prompts.jsonl');
export const batchJsonPath = path.join(artifactRoot, 'asset-batch-500-wave-3-makeup.json');
export const promptDirectory = path.join(artifactRoot, 'asset-batch-500-wave-3-makeup');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const identityFor = entry => `${entry.kind}:${entry.id}`;
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const slugify = value => String(value || 'asset')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'asset';

const readJsonl = bytes => bytes.toString('utf8')
  .split(/\r?\n/gu)
  .filter(Boolean)
  .map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${promptCatalogPath}:${index + 1}: ${error.message}`);
    }
  });

const promptFileFor = (sequence, entry) => [
  'docs',
  'openai-generation-prompts-2026-08-25',
  'asset-batch-500-wave-3-makeup',
  `${String(sequence).padStart(3, '0')}-hero-${slugify(entry.id).slice(0, 68)}-${sha256(entry.output).slice(0, 8)}.txt`
].join('/');

const buildJob = (entry, sequence) => {
  const generationPrompt = buildHeroGenerationPrompt(entry);
  return {
    sequence,
    kind: 'hero',
    id: entry.id,
    name: entry.name,
    universe: entry.universe,
    output: entry.output,
    frame: entry.frame,
    catalogSource: 'openai-sprite-prompts',
    selectionTier: 'wave-3-permanent-failure-makeup-catalog-order',
    referenceUrl: entry.referenceUrl || null,
    referenceUrls: Array.isArray(entry.referenceUrls) ? entry.referenceUrls : [],
    visualAnchor: entry.visualAnchor || null,
    sourcePromptSha256: sha256(Buffer.from(entry.prompt, 'utf8')),
    generationPromptSha256: sha256(Buffer.from(generationPrompt, 'utf8')),
    promptFile: promptFileFor(sequence, entry),
    generationPrompt
  };
};

const loadInputs = async () => {
  const [sourceBatchBytes, promptCatalogBytes] = await Promise.all([
    fs.readFile(sourceBatchPath),
    fs.readFile(promptCatalogPath)
  ]);
  const sourceBatch = JSON.parse(sourceBatchBytes.toString('utf8'));
  const promptCatalog = readJsonl(promptCatalogBytes);
  return {
    sourceBatch,
    sourceBatchSha256: sha256(sourceBatchBytes),
    promptCatalog,
    promptCatalogSha256: sha256(promptCatalogBytes)
  };
};

export const createBatch = async () => {
  const state = await loadInputs();
  assert(state.sourceBatch.jobs?.length === 500, 'Wave 3 source batch must contain exactly 500 jobs');
  assert(
    state.sourceBatch.promptCatalogSha256 === state.promptCatalogSha256,
    'Prompt catalog hash drifted after Wave 3 planning'
  );
  assert(
    FAILED_SOURCE_SEQUENCES.length === REPLACEMENT_COUNT,
    'Every permanent source failure must own exactly one replacement'
  );
  const sourceOutputs = new Set(state.sourceBatch.jobs.map(job => job.output));
  const selectedOutputs = state.sourceBatch.baseline?.missingHeroOutputs
    ?.slice(BASELINE_OFFSET, BASELINE_OFFSET + REPLACEMENT_COUNT) || [];
  assert(selectedOutputs.length === REPLACEMENT_COUNT, 'Frozen Wave 3 baseline cannot supply every replacement');
  assert(selectedOutputs.every(output => !sourceOutputs.has(output)), 'Makeup selection overlaps the original 500 jobs');
  const selected = selectedOutputs.map(output => {
    const matches = state.promptCatalog.filter(entry => entry.output === output);
    assert(matches.length === 1, `Makeup output must resolve to one prompt entry: ${output}`);
    return matches[0];
  });
  const jobs = selected.map((entry, index) => buildJob(entry, index + 1));
  assert(new Set(jobs.map(identityFor)).size === jobs.length, 'Duplicate makeup identity');
  assert(new Set(jobs.map(job => job.output)).size === jobs.length, 'Duplicate makeup output');
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'hero',
    promptCatalogSha256: state.promptCatalogSha256,
    sourceBatch: {
      batchId: state.sourceBatch.batchId,
      batchSha256: state.sourceBatchSha256,
      failedSequences: [...FAILED_SOURCE_SEQUENCES]
    },
    selectionPolicy: [
      'replace only permanent two-attempt failures from immutable Wave 3',
      'select still-missing heroes immediately after the original frozen 500 in catalog order',
      'preserve one successful installed asset per failed source job'
    ],
    counts: {
      jobs: jobs.length,
      selectedHeroes: jobs.length,
      replacedPermanentFailures: FAILED_SOURCE_SEQUENCES.length
    },
    jobs
  };
};

export const validateBatchArtifact = async () => {
  const [artifact, expected] = await Promise.all([
    fs.readFile(batchJsonPath, 'utf8').then(JSON.parse),
    createBatch()
  ]);
  assert(JSON.stringify(artifact) === JSON.stringify(expected), 'Wave 3 makeup artifact drifted from its frozen contract');
  const promptFiles = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  const expectedFiles = artifact.jobs.map(job => path.basename(job.promptFile)).sort();
  assert(JSON.stringify(promptFiles) === JSON.stringify(expectedFiles), 'Makeup prompt directory differs from the declared jobs');
  for (const job of artifact.jobs) {
    const promptFile = path.resolve(projectRoot, ...job.promptFile.split('/'));
    const bytes = await fs.readFile(promptFile);
    assert(bytes.equals(Buffer.from(job.generationPrompt, 'utf8')), `Prompt file is not verbatim for ${job.output}`);
    assert(sha256(bytes) === job.generationPromptSha256, `Generation prompt hash mismatch for ${job.output}`);
    assert(/genuine transparent alpha/iu.test(job.generationPrompt), `Transparent-alpha lock missing for ${job.output}`);
    assert(/exactly sixteen equal/iu.test(job.generationPrompt), `Sixteen-cell lock missing for ${job.output}`);
    assert(!/^(?:Combat identity|Special motif|Palette anchor)\s*:/imu.test(job.generationPrompt), `Synthetic lore remains in ${job.output}`);
  }
  return artifact;
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
    const batch = await validateBatchArtifact();
    console.log(JSON.stringify({ status: 'ok', mode: 'check', batchId: batch.batchId, jobs: batch.jobs.length }, null, 2));
    return;
  }
  const batch = await createBatch();
  await writeBatchArtifact(batch);
  await validateBatchArtifact();
  console.log(JSON.stringify({ status: 'ok', mode: 'write', batchId: batch.batchId, jobs: batch.jobs.length }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
