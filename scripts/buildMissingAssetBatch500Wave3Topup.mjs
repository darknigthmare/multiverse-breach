import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHeroGenerationPrompt } from './buildMissingAssetBatch500Wave3.mjs';
import {
  BASELINE_OFFSET as MAKEUP_BASELINE_OFFSET,
  BATCH_ID as MAKEUP_BATCH_ID,
  FAILED_SOURCE_SEQUENCES as MAKEUP_FAILED_SOURCE_SEQUENCES
} from './buildMissingAssetBatch500Wave3Makeup.mjs';

export const SCHEMA_VERSION = 1;
export const BASELINE_OFFSET = 505;
export const FINAL_FAILED_SOURCE_SEQUENCES = Object.freeze([
  72, 73, 74, 133, 156, 157, 158, 423, 447, 489, 490, 491, 492, 493
]);
export const MAKEUP_COVERED_SOURCE_SEQUENCES = Object.freeze([
  ...MAKEUP_FAILED_SOURCE_SEQUENCES
]);
export const FAILED_SOURCE_SEQUENCES = Object.freeze(
  FINAL_FAILED_SOURCE_SEQUENCES.filter(
    sequence => !MAKEUP_COVERED_SOURCE_SEQUENCES.includes(sequence)
  )
);
export const REPLACEMENT_COUNT = FAILED_SOURCE_SEQUENCES.length;
export const BATCH_ID = 'assets-missing-500-wave-3-topup-2026-08-28';

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
const sourceBatchPath = path.join(artifactRoot, 'asset-batch-500-wave-3.json');
const makeupBatchPath = path.join(artifactRoot, 'asset-batch-500-wave-3-makeup.json');
const promptCatalogPath = path.join(projectRoot, 'public', 'sprites', 'generated', 'openai-sprite-prompts.jsonl');
export const batchJsonPath = path.join(artifactRoot, 'asset-batch-500-wave-3-topup.json');
export const promptDirectory = path.join(artifactRoot, 'asset-batch-500-wave-3-topup');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const identityFor = entry => `${entry.kind}:${entry.id}`;
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const sameValues = (left, right) => JSON.stringify(left) === JSON.stringify(right);
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
  'asset-batch-500-wave-3-topup',
  `${String(sequence).padStart(3, '0')}-hero-${slugify(entry.id).slice(0, 68)}-${sha256(entry.output).slice(0, 8)}.txt`
].join('/');

const buildJob = (entry, sequence, sourceSequence, baselineIndex) => {
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
    selectionTier: 'wave-3-final-failure-topup-catalog-order',
    replacesSourceSequence: sourceSequence,
    baselineIndex,
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
  const [sourceBatchBytes, makeupBatchBytes, promptCatalogBytes] = await Promise.all([
    fs.readFile(sourceBatchPath),
    fs.readFile(makeupBatchPath),
    fs.readFile(promptCatalogPath)
  ]);
  return {
    sourceBatch: JSON.parse(sourceBatchBytes.toString('utf8')),
    sourceBatchSha256: sha256(sourceBatchBytes),
    makeupBatch: JSON.parse(makeupBatchBytes.toString('utf8')),
    makeupBatchSha256: sha256(makeupBatchBytes),
    promptCatalog: readJsonl(promptCatalogBytes),
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
  assert(state.makeupBatch.batchId === MAKEUP_BATCH_ID, 'Unexpected Wave 3 makeup batch');
  assert(
    sameValues(state.makeupBatch.sourceBatch?.failedSequences, MAKEUP_COVERED_SOURCE_SEQUENCES),
    'Wave 3 makeup failure coverage drifted'
  );
  assert(
    MAKEUP_BASELINE_OFFSET + state.makeupBatch.jobs.length === BASELINE_OFFSET,
    'Top-up baseline must begin immediately after Wave 3 makeup5'
  );
  assert(
    new Set(FINAL_FAILED_SOURCE_SEQUENCES).size === FINAL_FAILED_SOURCE_SEQUENCES.length,
    'Final Wave 3 failure snapshot contains duplicates'
  );
  assert(
    MAKEUP_COVERED_SOURCE_SEQUENCES.every(sequence => FINAL_FAILED_SOURCE_SEQUENCES.includes(sequence)),
    'Wave 3 makeup5 covers a sequence absent from the final failure snapshot'
  );
  assert(REPLACEMENT_COUNT === 9, 'Top-up must replace exactly nine uncovered final failures');
  assert(
    FINAL_FAILED_SOURCE_SEQUENCES.length
      === MAKEUP_COVERED_SOURCE_SEQUENCES.length + REPLACEMENT_COUNT,
    'Final failures must partition exactly between makeup5 and top-up'
  );

  const sourceOutputs = new Set(state.sourceBatch.jobs.map(job => job.output));
  const makeupOutputs = new Set(state.makeupBatch.jobs.map(job => job.output));
  const expectedMakeupOutputs = state.sourceBatch.baseline?.missingHeroOutputs
    ?.slice(MAKEUP_BASELINE_OFFSET, BASELINE_OFFSET) || [];
  assert(
    sameValues(state.makeupBatch.jobs.map(job => job.output), expectedMakeupOutputs),
    'Wave 3 makeup5 no longer owns frozen baseline indices 500..504'
  );
  const selectedOutputs = state.sourceBatch.baseline?.missingHeroOutputs
    ?.slice(BASELINE_OFFSET, BASELINE_OFFSET + REPLACEMENT_COUNT) || [];
  assert(selectedOutputs.length === REPLACEMENT_COUNT, 'Frozen Wave 3 baseline cannot supply every top-up replacement');
  assert(selectedOutputs.every(output => !sourceOutputs.has(output)), 'Top-up selection overlaps the original 500 jobs');
  assert(selectedOutputs.every(output => !makeupOutputs.has(output)), 'Top-up selection overlaps Wave 3 makeup5');

  const selected = selectedOutputs.map(output => {
    const matches = state.promptCatalog.filter(entry => entry.output === output);
    assert(matches.length === 1, `Top-up output must resolve to one prompt entry: ${output}`);
    return matches[0];
  });
  const jobs = selected.map((entry, index) => buildJob(
    entry,
    index + 1,
    FAILED_SOURCE_SEQUENCES[index],
    BASELINE_OFFSET + index
  ));
  assert(new Set(jobs.map(identityFor)).size === jobs.length, 'Duplicate top-up identity');
  assert(new Set(jobs.map(job => job.output)).size === jobs.length, 'Duplicate top-up output');
  assert(
    sameValues(jobs.map(job => job.replacesSourceSequence), FAILED_SOURCE_SEQUENCES),
    'Every uncovered final failure must own exactly one top-up replacement'
  );

  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'hero',
    promptCatalogSha256: state.promptCatalogSha256,
    sourceBatch: {
      batchId: state.sourceBatch.batchId,
      batchSha256: state.sourceBatchSha256,
      failedSequences: [...FAILED_SOURCE_SEQUENCES],
      finalFailedSequences: [...FINAL_FAILED_SOURCE_SEQUENCES],
      makeupCoveredFailedSequences: [...MAKEUP_COVERED_SOURCE_SEQUENCES]
    },
    makeupBatch: {
      batchId: state.makeupBatch.batchId,
      batchSha256: state.makeupBatchSha256,
      jobs: state.makeupBatch.jobs.length
    },
    selectionPolicy: [
      'freeze the original Wave 3 terminal failures only after pending reached zero',
      'exclude the five terminal failures already covered by Wave 3 makeup5',
      'select still-missing heroes from frozen baseline index 505 in catalog order',
      'map exactly one replacement hero to each uncovered terminal failure'
    ],
    baseline: {
      startIndex: BASELINE_OFFSET,
      endIndexInclusive: BASELINE_OFFSET + REPLACEMENT_COUNT - 1
    },
    counts: {
      jobs: jobs.length,
      selectedHeroes: jobs.length,
      finalPermanentFailures: FINAL_FAILED_SOURCE_SEQUENCES.length,
      alreadyCoveredByMakeup: MAKEUP_COVERED_SOURCE_SEQUENCES.length,
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
  assert(JSON.stringify(artifact) === JSON.stringify(expected), 'Wave 3 top-up artifact drifted from its frozen contract');
  const promptFiles = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  const expectedFiles = artifact.jobs.map(job => path.basename(job.promptFile)).sort();
  assert(JSON.stringify(promptFiles) === JSON.stringify(expectedFiles), 'Top-up prompt directory differs from the declared jobs');
  for (const [index, job] of artifact.jobs.entries()) {
    const promptFile = path.resolve(projectRoot, ...job.promptFile.split('/'));
    const bytes = await fs.readFile(promptFile);
    assert(bytes.equals(Buffer.from(job.generationPrompt, 'utf8')), `Prompt file is not verbatim for ${job.output}`);
    assert(sha256(bytes) === job.generationPromptSha256, `Generation prompt hash mismatch for ${job.output}`);
    assert(job.replacesSourceSequence === FAILED_SOURCE_SEQUENCES[index], `Source failure mapping drifted for ${job.output}`);
    assert(job.baselineIndex === BASELINE_OFFSET + index, `Baseline index drifted for ${job.output}`);
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
