import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import {
  BATCH_ID,
  EXPECTED_BASELINE,
  EXPECTED_JOB_COUNT,
  batchJsonPath,
  projectRoot,
  validateBatchArtifact
} from './buildRiftDossierBatch500Wave5.mjs';
import { loadSpriteBatch } from './openAiSpriteBatchQueue.mjs';

test('Wave 5 freezes exactly the next 500 pending dedicated dossier thumbnails', async () => {
  const { artifact } = await validateBatchArtifact();
  assert.equal(artifact.batchId, BATCH_ID);
  assert.equal(artifact.jobs.length, EXPECTED_JOB_COUNT);
  assert.deepEqual(
    {
      total: artifact.baseline.total,
      available: artifact.baseline.available,
      pending: artifact.baseline.pending
    },
    EXPECTED_BASELINE
  );
  assert.equal(artifact.jobs[0].stageId, 59);
  assert.equal(artifact.jobs.at(-1).stageId, 34_420);
});

test('Wave 5 keeps every identity, output and prompt contract unique', async () => {
  const { artifact } = await validateBatchArtifact();
  assert.equal(new Set(artifact.jobs.map(job => `${job.kind}:${job.id}`)).size, EXPECTED_JOB_COUNT);
  assert.equal(new Set(artifact.jobs.map(job => job.output)).size, EXPECTED_JOB_COUNT);
  assert.ok(artifact.jobs.every(job => job.family === 'expanded'));
  assert.ok(artifact.jobs.every(job => job.output.endsWith('.webp')));
  assert.ok(artifact.jobs.every(job => job.replace === false));
  assert.ok(artifact.jobs.every(job => job.sourcePromptSha256 === job.generationPromptSha256));
});

test('the resumable OpenAI queue accepts all 500 Wave 5 dossier jobs', async () => {
  const batch = await loadSpriteBatch(path.relative(projectRoot, batchJsonPath), { repositoryRoot: projectRoot });
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.kind, 'stage');
  assert.equal(batch.jobs.length, EXPECTED_JOB_COUNT);
  assert.equal(batch.jobs[0].sequence, 1);
  assert.equal(batch.jobs.at(-1).sequence, EXPECTED_JOB_COUNT);
});
