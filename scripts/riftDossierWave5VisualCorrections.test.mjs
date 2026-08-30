import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import {
  BATCH_ID,
  CORRECTION_VERSION,
  EXPECTED_JOB_COUNT,
  batchJsonPath,
  projectRoot,
  validateBatchArtifact
} from './buildRiftDossierWave5VisualCorrections.mjs';
import { loadSpriteBatch } from './openAiSpriteBatchQueue.mjs';

test('Wave 5 visual correction v1 freezes the two audited identities', async () => {
  const { artifact } = await validateBatchArtifact();
  assert.equal(artifact.batchId, BATCH_ID);
  assert.equal(artifact.correctionVersion, CORRECTION_VERSION);
  assert.equal(artifact.jobs.length, EXPECTED_JOB_COUNT);
  assert.deepEqual(artifact.jobs.map(job => job.id), ['33841', '34420']);
  assert.deepEqual(artifact.jobs.map(job => job.replacementOfSequence), [385, 500]);
  assert.deepEqual(artifact.jobs.map(job => job.sourceLayer), ['wave-5-safety-makeup', 'wave-5-primary']);
  assert.ok(artifact.jobs.every(job => job.replace === true));
});

test('Wave 5 visual correction prompts lock runtime grid and camera contracts', async () => {
  const { artifact } = await validateBatchArtifact();
  const [tactics, rpg] = artifact.jobs;
  assert.match(tactics.generationPrompt, /game renders its own interactive grid separately/iu);
  assert.match(tactics.generationPrompt, /absolutely NO grid lines/iu);
  assert.match(tactics.generationPrompt, /IMPLIED rectangular navigation lattice/iu);
  assert.match(rpg.generationPrompt, /strict orthographic side-on 2\.5D RPG battle view/iu);
  assert.match(rpg.generationPrompt, /NO corridor aimed into the screen/iu);
  assert.match(rpg.generationPrompt, /party zone is on the left/iu);
  const queueBatch = await loadSpriteBatch(path.relative(projectRoot, batchJsonPath), { repositoryRoot: projectRoot });
  assert.equal(queueBatch.jobs.length, EXPECTED_JOB_COUNT);
  assert.ok(queueBatch.jobs.every(job => job.catalogPromptSha256 === job.generationPromptSha256));
});

test('Wave 5 visual correction provenance pins PNGs and the two-call ceiling', async () => {
  const { artifact } = await validateBatchArtifact();
  assert.deepEqual(
    artifact.jobs.map(job => job.successfulGeneration.generationId),
    ['exec-b812cfa3-0aec-42f0-a634-daf6aae6fb06', 'exec-733b0711-fdae-416b-a897-b978b1c037f4']
  );
  assert.deepEqual(
    artifact.jobs.map(job => job.successfulGeneration.sourceImage.sha256),
    ['eb195c6186a18d7e4ae92824f6d196ce1d7d5e5aaad339890f610fc03debe9e0', '90f27fcc37b9d03a28d315148ed3d1b71b33f7da96eb2aa7e699d53669b8dcf0']
  );
  assert.ok(artifact.jobs.every(job => job.successfulGeneration.sourceImage.width === 1672));
  assert.ok(artifact.jobs.every(job => job.successfulGeneration.sourceImage.height === 941));
  assert.ok(artifact.jobs.every(job => job.attemptAudit.maximumImageGenCalls === 2));
  assert.ok(artifact.jobs.every(job => job.attemptAudit.usedImageGenCalls === 1));
  assert.equal(artifact.jobs[0].attemptAudit.preflightFailures.length, 1);
  assert.match(artifact.jobs[0].attemptAudit.preflightFailures[0], /sandbox ACL preflight failure/iu);
  assert.deepEqual(artifact.jobs[1].attemptAudit.preflightFailures, []);
});
