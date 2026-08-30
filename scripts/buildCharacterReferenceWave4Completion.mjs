import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCompletionCatalog } from './buildWave3CompletionCatalog.mjs';

export const ORIGINAL_BATCH_ID = 'assets-character-reference-remediation-334-wave-4-2026-08-28';
export const ORIGINAL_BATCH_SHA256 = 'e6216aa7dc58ea4f284ba02bd2869f7619684afc80ef734ef58bb08d3e5c4cc3';
export const CORRECTION_BATCH_ID = 'assets-character-reference-wave-4-corrections-33-2026-08-30';
export const CORRECTION_BATCH_SHA256 = '658c8d1fa413c88dc7718bd0fb2a9eeb4cbd9f4d8a372e55c68de8e32e5d461a';
export const MAKEUP_BATCH_ID = 'assets-character-reference-wave-4-corrections-makeup-9-2026-08-30';
export const MAKEUP_BATCH_SHA256 = '59c4626509d7e8bfda11babfae6a1c1bdaf12d2949fc209394e8652e7aaa8a1f';
export const SUCCESSFUL_CORRECTION_BATCH_ID = 'assets-character-reference-wave-4-corrections-successful-24-2026-08-30';
export const COMPLETION_BATCH_ID = 'assets-character-reference-wave-4-completed-334-2026-08-30';
export const EXPECTED_COUNT = 334;
export const FAILED_ORIGINAL_SEQUENCES = Object.freeze([
  15, 16, 17, 18, 75, 76, 77, 90, 91, 96, 97, 98, 114, 115, 119, 120, 121,
  122, 123, 131, 132, 143, 236, 237, 245, 246, 250, 251, 252, 311, 312, 313, 323
]);
export const FAILED_CORRECTION_SEQUENCES = Object.freeze([10, 11, 12, 17, 22, 25, 27, 29, 32]);

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
export const originalBatchPath = path.join(artifactRoot, 'asset-batch-334-wave-4.json');
export const correctionBatchPath = path.join(artifactRoot, 'asset-batch-33-wave-4-corrections.json');
export const makeupBatchPath = path.join(artifactRoot, 'asset-batch-9-wave-4-corrections-makeup.json');
export const successfulCorrectionBatchPath = path.join(artifactRoot, 'asset-batch-24-wave-4-corrections-successful.json');
export const completionBatchPath = path.join(artifactRoot, 'asset-batch-334-wave-4-completed.json');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const identityOf = job => job.kind + ':' + String(job.id);
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n', 'utf8');
const sameValues = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const readPinnedBatch = async (file, expectedId, expectedSha256, label) => {
  const bytes = await fs.readFile(file);
  assert(sha256(bytes) === expectedSha256, label + ' SHA-256 drifted');
  const batch = JSON.parse(bytes.toString('utf8'));
  assert(batch.schemaVersion === 1, label + ' schema drifted');
  assert(batch.batchId === expectedId, label + ' batch ID drifted');
  assert(Array.isArray(batch.jobs), label + ' jobs are missing');
  return batch;
};

const loadSources = async () => {
  const [original, correction, makeup] = await Promise.all([
    readPinnedBatch(originalBatchPath, ORIGINAL_BATCH_ID, ORIGINAL_BATCH_SHA256, 'Wave 4 original'),
    readPinnedBatch(correctionBatchPath, CORRECTION_BATCH_ID, CORRECTION_BATCH_SHA256, 'Wave 4 correction'),
    readPinnedBatch(makeupBatchPath, MAKEUP_BATCH_ID, MAKEUP_BATCH_SHA256, 'Wave 4 makeup')
  ]);
  assert(original.jobs.length === EXPECTED_COUNT, 'Wave 4 original count drifted');
  assert(correction.jobs.length === FAILED_ORIGINAL_SEQUENCES.length, 'Wave 4 correction count drifted');
  assert(makeup.jobs.length === FAILED_CORRECTION_SEQUENCES.length, 'Wave 4 makeup count drifted');
  assert(
    sameValues(correction.jobs.map(job => job.correctionOfSequence), FAILED_ORIGINAL_SEQUENCES),
    'Wave 4 correction-to-original sequence map drifted'
  );
  assert(
    sameValues(makeup.jobs.map(job => job.correctionOfSequence), FAILED_CORRECTION_SEQUENCES),
    'Wave 4 makeup-to-correction sequence map drifted'
  );
  assert(
    original.promptCatalogSha256 === correction.promptCatalogSha256
      && correction.promptCatalogSha256 === makeup.promptCatalogSha256,
    'Wave 4 prompt catalog provenance drifted'
  );
  return { original, correction, makeup };
};

export const createSuccessfulCorrectionBatch = async () => {
  const { correction, makeup } = await loadSources();
  const failed = new Set(FAILED_CORRECTION_SEQUENCES);
  const jobs = correction.jobs.filter(job => !failed.has(job.sequence));
  assert(jobs.length === 24, 'Wave 4 successful correction count drifted');
  const completeReplacementJobs = [...jobs, ...makeup.jobs];
  assert(completeReplacementJobs.length === FAILED_ORIGINAL_SEQUENCES.length, 'Wave 4 replacement total drifted');
  assert(new Set(completeReplacementJobs.map(identityOf)).size === completeReplacementJobs.length, 'Wave 4 replacement identities overlap');
  assert(new Set(completeReplacementJobs.map(job => job.output)).size === completeReplacementJobs.length, 'Wave 4 replacement outputs overlap');
  assert(
    new Set(completeReplacementJobs.map(job => job.originalWave4Sequence ?? job.correctionOfSequence)).size
      === FAILED_ORIGINAL_SEQUENCES.length,
    'Wave 4 replacement original sequence coverage overlaps'
  );
  return {
    schemaVersion: 1,
    batchId: SUCCESSFUL_CORRECTION_BATCH_ID,
    kind: correction.kind,
    promptCatalogSha256: correction.promptCatalogSha256,
    sources: {
      correctionBatch: { batchId: CORRECTION_BATCH_ID, sha256: CORRECTION_BATCH_SHA256 },
      makeupBatch: { batchId: MAKEUP_BATCH_ID, sha256: MAKEUP_BATCH_SHA256 }
    },
    completionPolicy: [
      'retain only the 24 completed first-pass correction jobs',
      'exclude the 9 terminal first-pass correction sequences replaced by the makeup batch',
      'preserve runtime identity, output, prompt hash, frame and replacement contract'
    ],
    excludedCorrectionSequences: [...FAILED_CORRECTION_SEQUENCES],
    counts: { source: correction.jobs.length, excluded: failed.size, jobs: jobs.length },
    jobs
  };
};

const createCompletionCatalogFromArtifacts = () => buildCompletionCatalog({
  originalBatch: originalBatchPath,
  failedSequences: FAILED_ORIGINAL_SEQUENCES,
  replacementBatches: [successfulCorrectionBatchPath, makeupBatchPath],
  repositoryRoot: projectRoot,
  completionBatchId: COMPLETION_BATCH_ID,
  expectedCount: EXPECTED_COUNT
});

export const writeCompletionArtifacts = async () => {
  const successful = await createSuccessfulCorrectionBatch();
  await fs.writeFile(successfulCorrectionBatchPath, jsonBytes(successful));
  const completion = createCompletionCatalogFromArtifacts();
  await fs.writeFile(completionBatchPath, jsonBytes(completion));
  return { successful, completion };
};

export const validateCompletionArtifacts = async () => {
  const expectedSuccessful = await createSuccessfulCorrectionBatch();
  const successfulBytes = await fs.readFile(successfulCorrectionBatchPath);
  assert(successfulBytes.equals(jsonBytes(expectedSuccessful)), 'Wave 4 successful correction artifact drifted');
  const expectedCompletion = createCompletionCatalogFromArtifacts();
  const completionBytes = await fs.readFile(completionBatchPath);
  assert(completionBytes.equals(jsonBytes(expectedCompletion)), 'Wave 4 completion catalog drifted');
  assert(expectedCompletion.counts.total === EXPECTED_COUNT, 'Wave 4 completion total drifted');
  assert(expectedCompletion.counts.retainedOriginal === 301, 'Wave 4 retained original count drifted');
  assert(expectedCompletion.counts.replacement === 33, 'Wave 4 replacement count drifted');
  assert(new Set(expectedCompletion.jobs.map(identityOf)).size === EXPECTED_COUNT, 'Wave 4 completion identities overlap');
  assert(new Set(expectedCompletion.jobs.map(job => job.output)).size === EXPECTED_COUNT, 'Wave 4 completion outputs overlap');
  return { successful: expectedSuccessful, completion: expectedCompletion };
};

const main = async () => {
  const result = process.argv.includes('--check')
    ? await validateCompletionArtifacts()
    : await writeCompletionArtifacts().then(validateCompletionArtifacts);
  console.log(JSON.stringify({
    status: 'ok',
    mode: process.argv.includes('--check') ? 'check' : 'write',
    batchId: result.completion.batchId,
    counts: result.completion.counts
  }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
