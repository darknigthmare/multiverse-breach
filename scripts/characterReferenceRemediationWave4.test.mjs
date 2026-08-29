import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BATCH_ID,
  DOSSIER_CATALOG_SHA256,
  JOB_COUNT,
  MISSING_OUTPUTS_SHA256,
  MISSING_REFERENCE_COUNT,
  PROMPT_CATALOG_SHA256,
  QUALITY_REPORT_SHA256,
  REJECTED_OUTPUTS_SHA256,
  REJECTED_PLACEHOLDER_COUNT,
  REMEDIATION_PLAN_SHA256,
  validateBatchArtifact
} from './buildCharacterReferenceRemediationWave4.mjs';

test('wave 4 freezes all three audited inputs and the exact 334-output plan', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.jobs.length, JOB_COUNT);
  assert.equal(batch.counts.missingLocalReferences, MISSING_REFERENCE_COUNT);
  assert.equal(batch.counts.rejectedPlaceholders, REJECTED_PLACEHOLDER_COUNT);
  assert.equal(batch.sources.characterReferenceQuality.sha256, QUALITY_REPORT_SHA256);
  assert.equal(batch.sources.riftDossierCatalog.sha256, DOSSIER_CATALOG_SHA256);
  assert.equal(batch.sources.spritePromptCatalog.sha256, PROMPT_CATALOG_SHA256);
  assert.equal(batch.selectionHashes.missingOutputsSha256, MISSING_OUTPUTS_SHA256);
  assert.equal(batch.selectionHashes.rejectedOutputsSha256, REJECTED_OUTPUTS_SHA256);
  assert.equal(batch.selectionHashes.remediationPlanSha256, REMEDIATION_PLAN_SHA256);
});

test('wave 4 order and replace policy are stable and collision-free', async () => {
  const batch = await validateBatchArtifact();
  const missing = batch.jobs.slice(0, MISSING_REFERENCE_COUNT);
  const rejected = batch.jobs.slice(MISSING_REFERENCE_COUNT);
  assert.equal(missing.length, 170);
  assert.equal(rejected.length, 164);
  assert.equal(missing.every(job => job.replace === false && job.remediationReason === 'missing-local-reference'), true);
  assert.equal(rejected.every(job => job.replace === true && job.remediationReason === 'rejected-placeholder'), true);
  assert.deepEqual(batch.jobs.map(job => job.sequence), Array.from({ length: JOB_COUNT }, (_value, index) => index + 1));
  assert.deepEqual(missing.map(job => job.output), [...missing.map(job => job.output)].sort());
  assert.deepEqual(rejected.map(job => job.output), [...rejected.map(job => job.output)].sort());
  assert.equal(new Set(batch.jobs.map(job => `${job.kind}:${job.id}`)).size, JOB_COUNT);
  assert.equal(new Set(batch.jobs.map(job => job.id)).size, JOB_COUNT);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, JOB_COUNT);
  assert.equal(new Set(batch.jobs.map(job => job.qualityEntryId)).size, JOB_COUNT);
  assert.equal(missing[0].output, '/sprites/generated/heroes/aegea-war-of-the-moirai/doros-bronzehand.png');
  assert.equal(missing.at(-1).output, '/sprites/generated/heroes/zero-escape-the-nonary-games/sigma-klim.png');
  assert.equal(rejected[0].output, '/sprites/generated/heroes/alien-3/dillon-a3.png');
  assert.equal(rejected.at(-1).output, '/sprites/generated/heroes/yu-gi-oh/kaiba.png');
});

test('wave 4 jobs retain audited authority and lore-corrected production locks', async () => {
  const batch = await validateBatchArtifact();
  for (const job of batch.jobs) {
    assert.equal(job.kind, 'hero');
    assert.equal(job.frame.width, 256);
    assert.equal(job.frame.height, 256);
    assert.equal(job.frame.columns, 4);
    assert.deepEqual(job.frame.rows, ['idle', 'run', 'attack', 'hit']);
    assert.equal(job.referenceUrls.length > 0, true);
    assert.equal(job.visualAnchors.length > 0, true);
    assert.match(job.generationPrompt, /genuine transparent alpha/iu);
    assert.match(job.generationPrompt, /4 columns x 4 rows/iu);
    assert.match(job.generationPrompt, /Canon authority lock:/u);
    assert.match(job.generationPrompt, /omit it instead of inventing it/u);
    assert.doesNotMatch(job.generationPrompt, /^(?:Combat identity|Special motif|Palette anchor)\s*:/imu);
  }
});

test('checked-in wave 4 artifact and all 334 prompts validate verbatim', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(batch.jobs.length, JOB_COUNT);
});
