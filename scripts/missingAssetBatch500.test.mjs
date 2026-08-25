import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BATCH_ID,
  BATCH_SIZE,
  EXPECTED_BASELINE_MISSING_HEROES,
  EXPECTED_BASELINE_MISSING_ITEMS,
  EXPECTED_REMAINING_HEROES,
  HERO_JOB_COUNT,
  ITEM_JOB_COUNT,
  batchJsonPath,
  buildHeroGenerationPrompt,
  validateBatchArtifact
} from './buildMissingAssetBatch500.mjs';

const batchPromise = validateBatchArtifact();

test('wave 2 selects every remaining item then exactly 266 missing heroes', async () => {
  const batch = await batchPromise;
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.jobs.length, BATCH_SIZE);
  assert.equal(batch.counts.selectedItems, ITEM_JOB_COUNT);
  assert.equal(batch.counts.selectedHeroes, HERO_JOB_COUNT);
  assert.equal(batch.counts.baselineMissingItems, EXPECTED_BASELINE_MISSING_ITEMS);
  assert.equal(batch.counts.baselineMissingHeroes, EXPECTED_BASELINE_MISSING_HEROES);
  assert.equal(batch.counts.remainingMissingItemsAfterBatch, 0);
  assert.equal(batch.counts.remainingMissingHeroesAfterBatch, EXPECTED_REMAINING_HEROES);
  assert.deepEqual(batch.jobs.slice(0, ITEM_JOB_COUNT).map(job => job.kind), Array(ITEM_JOB_COUNT).fill('item'));
  assert.deepEqual(batch.jobs.slice(ITEM_JOB_COUNT).map(job => job.kind), Array(HERO_JOB_COUNT).fill('hero'));
});

test('wave 2 selection is queue-safe and output-unique', async () => {
  const batch = await batchPromise;
  assert.equal(new Set(batch.jobs.map(job => job.sequence)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.id)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => `${job.kind}:${job.id}`)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.promptFile)).size, BATCH_SIZE);
  assert.equal(batch.jobs[0].id, 'putt_putt_toolbox');
  assert.equal(batch.jobs[ITEM_JOB_COUNT - 1].id, 'torbahead_loop_marker');
  assert.equal(batch.jobs[ITEM_JOB_COUNT].id, 'naru');
  assert.equal(batch.jobs.at(-1).id, 'janine_gb');
});

test('hero prompt locks identity, aliases, strict 4x4 geometry and alpha', () => {
  const prompt = buildHeroGenerationPrompt({
    kind: 'hero',
    id: 'hero_variant',
    name: 'Hero Variant',
    universe: 'Test Universe',
    output: '/sprites/generated/heroes/test/hero-variant.png',
    prompt: [
      'Use case: stylized-concept',
      'Style/medium: legacy style',
      'Composition/framing: legacy framing',
      'Background: perfectly flat solid #00ff00 chroma key.',
      'Constraints: legacy constraints.'
    ].join('\n')
  });
  assert.match(prompt, /exactly sixteen equal nonempty cells/iu);
  assert.match(prompt, /4 columns x 4 rows/iu);
  assert.match(prompt, /genuine transparent alpha/iu);
  assert.match(prompt, /dedicated runtime identity hero_variant/iu);
  assert.match(prompt, /not a photorealistic actor likeness/iu);
  assert.match(prompt, /nonsexual and non-gory/iu);
  assert.match(prompt, /no franchise logo/iu);
  assert.doesNotMatch(prompt, /#00ff00/iu);
});

test('checked-in wave 2 artifact and all prompt files validate verbatim', async () => {
  const artifact = JSON.parse(await readFile(batchJsonPath, 'utf8'));
  const validated = await validateBatchArtifact();
  assert.equal(validated.batchId, artifact.batchId);
  assert.equal(validated.jobs.length, BATCH_SIZE);
});
