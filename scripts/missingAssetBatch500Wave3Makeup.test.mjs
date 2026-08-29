import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FAILED_SOURCE_SEQUENCES,
  REPLACEMENT_COUNT,
  createBatch,
  validateBatchArtifact
} from './buildMissingAssetBatch500Wave3Makeup.mjs';

test('wave 3 makeup replaces the five permanent failures with the next five missing heroes', async () => {
  const batch = await createBatch();
  assert.equal(batch.jobs.length, REPLACEMENT_COUNT);
  assert.deepEqual(batch.sourceBatch.failedSequences, [...FAILED_SOURCE_SEQUENCES]);
  assert.deepEqual(batch.jobs.map(job => job.id), [
    'manny_iceage',
    'sid_iceage',
    'diego_iceage',
    'stan_helsing',
    'nadine_helsing'
  ]);
  assert.deepEqual(batch.jobs.map(job => job.sequence), [1, 2, 3, 4, 5]);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, REPLACEMENT_COUNT);
});

test('wave 3 makeup prompts preserve the same lore, alpha and 4x4 production locks', async () => {
  const batch = await createBatch();
  for (const job of batch.jobs) {
    assert.match(job.generationPrompt, /genuine transparent alpha/iu);
    assert.match(job.generationPrompt, /4 columns x 4 rows/iu);
    assert.match(job.generationPrompt, /nonsexual and non-gory/iu);
    assert.doesNotMatch(job.generationPrompt, /^(?:Combat identity|Special motif|Palette anchor)\s*:/imu);
  }
});

test('checked-in wave 3 makeup artifact and all prompts validate verbatim', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(batch.jobs.length, REPLACEMENT_COUNT);
});
