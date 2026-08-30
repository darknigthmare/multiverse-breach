import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPLETION_BATCH_ID,
  EXPECTED_COUNT,
  FAILED_CORRECTION_SEQUENCES,
  FAILED_ORIGINAL_SEQUENCES,
  MAKEUP_BATCH_ID,
  SUCCESSFUL_CORRECTION_BATCH_ID,
  validateCompletionArtifacts
} from './buildCharacterReferenceWave4Completion.mjs';

test('wave 4 completion freezes the exact 301 plus 24 plus 9 composition', async () => {
  const { successful, completion } = await validateCompletionArtifacts();
  assert.equal(successful.batchId, SUCCESSFUL_CORRECTION_BATCH_ID);
  assert.equal(successful.sources.makeupBatch.batchId, MAKEUP_BATCH_ID);
  assert.equal(successful.counts.jobs, 24);
  assert.deepEqual(successful.excludedCorrectionSequences, FAILED_CORRECTION_SEQUENCES);
  assert.equal(completion.batchId, COMPLETION_BATCH_ID);
  assert.deepEqual(completion.failedOriginalSequences, FAILED_ORIGINAL_SEQUENCES);
  assert.deepEqual(completion.counts, {
    original: EXPECTED_COUNT,
    failedOriginal: 33,
    retainedOriginal: 301,
    replacement: 33,
    total: EXPECTED_COUNT
  });
});

test('wave 4 completion exposes one unique runtime identity and output per slot', async () => {
  const { completion } = await validateCompletionArtifacts();
  assert.equal(completion.jobs.length, EXPECTED_COUNT);
  assert.equal(new Set(completion.jobs.map(job => job.kind + ':' + job.id)).size, EXPECTED_COUNT);
  assert.equal(new Set(completion.jobs.map(job => job.output)).size, EXPECTED_COUNT);
  assert.equal(completion.sourceBatches.length, 3);
  assert.equal(completion.sourceBatches[1].jobCount, 24);
  assert.equal(completion.sourceBatches[2].jobCount, 9);
});
