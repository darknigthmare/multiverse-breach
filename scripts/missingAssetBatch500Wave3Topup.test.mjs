import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASELINE_OFFSET,
  BATCH_ID,
  FAILED_SOURCE_SEQUENCES,
  FINAL_FAILED_SOURCE_SEQUENCES,
  MAKEUP_COVERED_SOURCE_SEQUENCES,
  REPLACEMENT_COUNT,
  createBatch,
  validateBatchArtifact
} from './buildMissingAssetBatch500Wave3Topup.mjs';

test('wave 3 top-up freezes every final failure and excludes the five makeup5 replacements', async () => {
  const batch = await createBatch();
  assert.equal(batch.batchId, BATCH_ID);
  assert.deepEqual([...FINAL_FAILED_SOURCE_SEQUENCES], [
    72, 73, 74, 133, 156, 157, 158, 423, 447, 489, 490, 491, 492, 493
  ]);
  assert.deepEqual([...MAKEUP_COVERED_SOURCE_SEQUENCES], [72, 73, 74, 423, 447]);
  assert.deepEqual([...FAILED_SOURCE_SEQUENCES], [133, 156, 157, 158, 489, 490, 491, 492, 493]);
  assert.deepEqual(batch.sourceBatch.failedSequences, [...FAILED_SOURCE_SEQUENCES]);
  assert.equal(batch.jobs.length, REPLACEMENT_COUNT);
  assert.equal(batch.counts.finalPermanentFailures, 14);
  assert.equal(batch.counts.alreadyCoveredByMakeup, 5);
  assert.equal(batch.counts.replacedPermanentFailures, 9);
});

test('wave 3 top-up maps baseline indices 505 through 513 one-for-one in catalog order', async () => {
  const batch = await createBatch();
  assert.equal(BASELINE_OFFSET, 505);
  assert.deepEqual(batch.jobs.map(job => job.id), [
    'teddy_helsing',
    'rick_riker_sm',
    'trey_sm',
    'jill_johnson_sm',
    'ezio_auditore_ac',
    'desmond_miles_ac',
    'kassandra_ac',
    'sheldon_cooper_tbbt',
    'leonard_hofstadter_tbbt'
  ]);
  assert.deepEqual(batch.jobs.map(job => job.sequence), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(batch.jobs.map(job => job.baselineIndex), [505, 506, 507, 508, 509, 510, 511, 512, 513]);
  assert.deepEqual(batch.jobs.map(job => job.replacesSourceSequence), [...FAILED_SOURCE_SEQUENCES]);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, REPLACEMENT_COUNT);
});

test('wave 3 top-up prompts preserve lore, alpha and 4x4 production locks', async () => {
  const batch = await createBatch();
  for (const job of batch.jobs) {
    assert.match(job.generationPrompt, /genuine transparent alpha/iu);
    assert.match(job.generationPrompt, /4 columns x 4 rows/iu);
    assert.match(job.generationPrompt, /nonsexual and non-gory/iu);
    assert.doesNotMatch(job.generationPrompt, /^(?:Combat identity|Special motif|Palette anchor)\s*:/imu);
  }
});

test('checked-in wave 3 top-up artifact and all prompts validate verbatim', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(batch.jobs.length, REPLACEMENT_COUNT);
});
