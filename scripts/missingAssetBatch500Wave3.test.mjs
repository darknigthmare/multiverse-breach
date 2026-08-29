import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BATCH_ID,
  BATCH_SIZE,
  EXPECTED_BASELINE_MISSING_HEROES,
  EXPECTED_REMAINING_HEROES,
  HERO_JOB_COUNT,
  batchJsonPath,
  buildHeroGenerationPrompt,
  validateBatchArtifact
} from './buildMissingAssetBatch500Wave3.mjs';

const batchPromise = validateBatchArtifact();

test('wave 3 selects exactly 500 currently missing heroes', async () => {
  const batch = await batchPromise;
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.kind, 'hero');
  assert.equal(batch.jobs.length, BATCH_SIZE);
  assert.equal(batch.counts.selectedHeroes, HERO_JOB_COUNT);
  assert.equal(batch.counts.baselineMissingHeroes, EXPECTED_BASELINE_MISSING_HEROES);
  assert.equal(batch.counts.remainingMissingHeroesAfterBatch, EXPECTED_REMAINING_HEROES);
  assert.deepEqual(batch.jobs.map(job => job.kind), Array(BATCH_SIZE).fill('hero'));
});

test('wave 3 selection is deterministic and queue-safe', async () => {
  const batch = await batchPromise;
  assert.equal(new Set(batch.jobs.map(job => job.sequence)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.id)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.promptFile)).size, BATCH_SIZE);
  assert.equal(batch.jobs[0].id, 'dana_barrett_gb');
  assert.equal(batch.jobs.at(-1).id, 'knuckles_echidna');
  assert.match(batch.jobs[0].output, /dana-barrett-gb\.png$/u);
  assert.match(batch.jobs.at(-1).output, /knuckles-echidna\.png$/u);
});

test('wave 3 embeds strict production prompts verbatim', async () => {
  const batch = await batchPromise;
  for (const job of batch.jobs) {
    assert.match(job.generationPrompt, /exactly sixteen equal nonempty cells/iu);
    assert.match(job.generationPrompt, /4 columns x 4 rows/iu);
    assert.match(job.generationPrompt, /genuine transparent alpha/iu);
    assert.match(job.generationPrompt, /nonsexual and non-gory/iu);
    assert.match(job.generationPrompt, /Canon authority lock:/iu);
    assert.match(job.generationPrompt, /otherwise use four unarmed guard, dodge, or movement frames with no weapon, tool, projectile, aura, effect, named power, or performance/iu);
    assert.doesNotMatch(job.generationPrompt, /^(?:Combat identity|Special motif|Palette anchor)\s*:/imu);
    assert.doesNotMatch(job.generationPrompt, /Origin Burst/iu);
    assert.doesNotMatch(job.generationPrompt, /signature action|signature attack|tool-use|natural to that character|characteristic gesture|stated equipment\/power/iu);
    assert.doesNotMatch(job.generationPrompt, /#[0-9a-f]{6}\s+and\s+#[0-9a-f]{6}/iu);
    assert.doesNotMatch(job.generationPrompt, /explicitly adapted/iu);
    assert.doesNotMatch(job.generationPrompt, /#00ff00/iu);
  }
});

test('wave 3 removes known synthetic lore assignments', async () => {
  const batch = await batchPromise;
  const knuckles = batch.jobs.find(job => job.id === 'knuckles_echidna');
  const dana = batch.jobs.find(job => job.id === 'dana_barrett_gb');
  assert.ok(knuckles);
  assert.ok(dana);
  assert.doesNotMatch(knuckles.generationPrompt, /marine using gun|#cfb51b/iu);
  assert.doesNotMatch(dana.generationPrompt, /horror using slash|Rooftop Temple Seal/iu);
});

test('wave 3 filters standalone synthetic motif lines and defaults to neutral movement', () => {
  const prompt = buildHeroGenerationPrompt({
    kind: 'hero',
    id: 'mock_character',
    name: 'Mock Character',
    universe: 'Mock Continuity',
    output: '/sprites/generated/heroes/mock-character.png',
    prompt: [
      'Use case: stylized-concept',
      'Asset type: transparent game sprite sheet for a 2D canvas battle game',
      'Primary request: create a sheet for Mock Character, hero from Mock Continuity.',
      'Animation rows: invented source choreography.',
      'Lore lock: invented source lore.',
      'Combat identity: marine using gun.',
      'Special motif: Mock Origin Burst.',
      'Palette anchor: #abcdef and #abcdef.',
      'Background: transparent.',
      'Constraints: no text.'
    ].join('\n')
  });
  assert.doesNotMatch(prompt, /marine using gun|Mock Origin Burst|#abcdef/iu);
  assert.doesNotMatch(prompt, /^(?:Combat identity|Special motif|Palette anchor)\s*:/imu);
  assert.match(prompt, /otherwise use four unarmed guard, dodge, or movement frames/iu);
  assert.match(prompt, /include equipment only when explicitly canon-established, otherwise none/iu);
});

test('checked-in wave 3 artifact and all 500 prompt files validate', async () => {
  const artifact = JSON.parse(await readFile(batchJsonPath, 'utf8'));
  const validated = await validateBatchArtifact();
  assert.equal(validated.batchId, artifact.batchId);
  assert.equal(validated.jobs.length, BATCH_SIZE);
});
