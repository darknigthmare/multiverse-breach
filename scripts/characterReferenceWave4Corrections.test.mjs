import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BATCH_ID,
  FAILED_SEQUENCES,
  FAILED_SEQUENCE_LIST_SHA256,
  JOB_COUNT,
  SAFE_REWRITE_COUNT,
  SOURCE_BATCH_ID,
  SOURCE_BATCH_SHA256,
  TECHNICAL_RETRY_COUNT,
  TECHNICAL_RETRY_SEQUENCES,
  validateBatchArtifact
} from './buildCharacterReferenceWave4Corrections.mjs';

test('wave 4 correction batch freezes the exact 33 terminal failures', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.sources.wave4Batch.batchId, SOURCE_BATCH_ID);
  assert.equal(batch.sources.wave4Batch.sha256, SOURCE_BATCH_SHA256);
  assert.equal(batch.selectionHashes.failedSequenceListSha256, FAILED_SEQUENCE_LIST_SHA256);
  assert.equal(batch.jobs.length, JOB_COUNT);
  assert.deepEqual(batch.jobs.map(job => job.correctionOfSequence), FAILED_SEQUENCES);
});

test('wave 4 correction batch separates technical retries from safe rewrites', async () => {
  const batch = await validateBatchArtifact();
  const technical = batch.jobs.filter(job => job.selectionTier === 'wave-4-technical-retry');
  const safe = batch.jobs.filter(job => job.selectionTier === 'wave-4-safe-original-moderation-rewrite');
  assert.equal(technical.length, TECHNICAL_RETRY_COUNT);
  assert.equal(safe.length, SAFE_REWRITE_COUNT);
  assert.deepEqual(technical.map(job => job.correctionOfSequence), TECHNICAL_RETRY_SEQUENCES);
  assert.ok(safe.every(job => /wholly original/iu.test(job.generationPrompt)));
  assert.ok(safe.every(job => /fully clothed/iu.test(job.generationPrompt)));
  assert.ok(safe.every(job => /no protected exact likeness/iu.test(job.generationPrompt)));
});

test('wave 4 correction jobs preserve runtime install contracts', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(new Set(batch.jobs.map(job => job.kind + ':' + job.id)).size, JOB_COUNT);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, JOB_COUNT);
  assert.equal(batch.jobs.filter(job => job.replace === false).length, 22);
  assert.equal(batch.jobs.filter(job => job.replace === true).length, 11);
  assert.ok(batch.jobs.every(job => job.frame.columns === 4));
  assert.ok(batch.jobs.every(job => job.frame.rows.length === 4));
});
