import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import {
  BATCH_ID,
  EXPECTED_JOB_COUNT,
  SOURCE_SEQUENCES,
  batchJsonPath,
  projectRoot,
  validateBatchArtifact
} from './buildRiftDossierBatch500Wave5Makeup.mjs';
import { loadSpriteBatch } from './openAiSpriteBatchQueue.mjs';

test('Wave 5 makeup freezes exactly the three terminal failures', async () => {
  const { artifact } = await validateBatchArtifact();
  assert.equal(artifact.batchId, BATCH_ID);
  assert.equal(artifact.jobs.length, EXPECTED_JOB_COUNT);
  assert.deepEqual(artifact.jobs.map(job => job.replacementOfSequence), SOURCE_SEQUENCES);
  assert.deepEqual(artifact.jobs.map(job => job.id), ['499', '33731', '33841']);
  assert.equal(new Set(artifact.jobs.map(job => job.output)).size, EXPECTED_JOB_COUNT);
});

test('Wave 5 makeup uses audited environment-only prompts accepted by the queue', async () => {
  const { artifact } = await validateBatchArtifact();
  assert.ok(artifact.jobs.every(job => job.safetyPolicy === 'environment-only-no-characters'));
  assert.ok(artifact.jobs.every(job => job.generationPrompt.includes('No people, creatures, combat, weapons')));
  assert.ok(artifact.jobs.every(job => job.sourcePromptSha256 === job.generationPromptSha256));
  const batch = await loadSpriteBatch(path.relative(projectRoot, batchJsonPath), {
    repositoryRoot: projectRoot
  });
  assert.equal(batch.jobs.length, EXPECTED_JOB_COUNT);
  assert.deepEqual(batch.jobs.map(job => job.sequence), [1, 2, 3]);
});
