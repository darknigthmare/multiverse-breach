import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BATCH_ID,
  FAILED_SEQUENCES,
  FAILED_SEQUENCE_LIST_SHA256,
  JOB_COUNT,
  SOURCE_BATCH_ID,
  SOURCE_BATCH_SHA256,
  validateBatchArtifact
} from './buildCharacterReferenceWave4Makeup.mjs';

test('wave 4 makeup freezes the nine first-pass terminal refusals', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.sources.correctionBatch.batchId, SOURCE_BATCH_ID);
  assert.equal(batch.sources.correctionBatch.sha256, SOURCE_BATCH_SHA256);
  assert.equal(batch.selectionHashes.failedSequenceListSha256, FAILED_SEQUENCE_LIST_SHA256);
  assert.equal(batch.jobs.length, JOB_COUNT);
  assert.deepEqual(batch.jobs.map(job => job.correctionOfSequence), FAILED_SEQUENCES);
});

test('wave 4 makeup keeps exact runtime outputs but uses distinct original prompts', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(new Set(batch.jobs.map(job => job.kind + ':' + job.id)).size, JOB_COUNT);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, JOB_COUNT);
  assert.equal(batch.jobs.filter(job => job.replace === false).length, 5);
  assert.equal(batch.jobs.filter(job => job.replace === true).length, 4);
  assert.ok(batch.jobs.every(job => /completely original/iu.test(job.generationPrompt)));
  assert.ok(batch.jobs.every(job => /no attack, weapon, fighting/iu.test(job.generationPrompt)));
  assert.ok(batch.jobs.every(job => job.selectionTier === 'wave-4-second-pass-distinct-original'));
});
