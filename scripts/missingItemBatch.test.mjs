import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {
  BATCH_ID,
  CURRENT_PROMPT_POLICY_VERSION,
  RETRY_FIDELITY_LOCKS,
  RETRY_PROMPT_TARGETS,
  BATCH_SIZE,
  EXPECTED_BASELINE_MISSING_ITEMS,
  EXPECTED_GEAR_SHOP_MISSING,
  EXPECTED_LORE_OVERRIDE_MISSING,
  EXPECTED_CATALOG_EXTENSIONS,
  EXPECTED_REMAINING_MISSING_ITEMS,
  batchJsonPath,
  projectRoot,
  buildGenerationPrompt,
  validateBatchArtifact,
  validateRetryPromptArtifacts
} from './buildMissingItemBatch.mjs';

const readBatch = () => fs.readFile(batchJsonPath, 'utf8').then(JSON.parse);

test('frozen missing-item batch passes its full deterministic artifact check', async () => {
  const batch = await validateBatchArtifact();
  assert.equal(batch.batchId, BATCH_ID);
  assert.equal(batch.jobs.length, BATCH_SIZE);
});

test('batch covers all 80 Gear Shop gaps and all 198 lore-item gaps before catalog fill', async () => {
  const batch = await readBatch();
  const gearOutputs = new Set(batch.baseline.gearShopMissingOutputs);
  const loreOutputs = new Set(batch.baseline.loreOverrideMissingOutputs);
  const selectedOutputs = new Set(batch.jobs.map(job => job.output));

  assert.equal(gearOutputs.size, EXPECTED_GEAR_SHOP_MISSING);
  assert.equal(loreOutputs.size, EXPECTED_LORE_OVERRIDE_MISSING);
  assert.ok([...gearOutputs].every(output => selectedOutputs.has(output)));
  assert.ok([...loreOutputs].every(output => selectedOutputs.has(output)));

  const firstNonGearIndex = batch.jobs.findIndex(job => !gearOutputs.has(job.output));
  assert.equal(firstNonGearIndex, EXPECTED_GEAR_SHOP_MISSING);
  const loreOnlyInOrder = batch.baseline.loreOverrideMissingOutputs
    .filter(output => !gearOutputs.has(output));
  assert.deepEqual(
    batch.jobs
      .slice(firstNonGearIndex, firstNonGearIndex + loreOnlyInOrder.length)
      .map(job => job.output),
    loreOnlyInOrder
  );
});

test('500 unique jobs reduce the frozen 734-item union gap to exactly 234', async () => {
  const batch = await readBatch();
  assert.equal(batch.counts.baselineMissingItems, EXPECTED_BASELINE_MISSING_ITEMS);
  assert.equal(batch.counts.promptManifestExtensions, EXPECTED_CATALOG_EXTENSIONS);
  assert.equal(batch.catalogExtensions.length, EXPECTED_CATALOG_EXTENSIONS);
  assert.equal(batch.counts.remainingMissingItemsAfterBatch, EXPECTED_REMAINING_MISSING_ITEMS);
  assert.equal(
    batch.counts.baselineMissingItems - batch.jobs.length,
    EXPECTED_REMAINING_MISSING_ITEMS
  );
  assert.equal(new Set(batch.jobs.map(job => job.id)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.output)).size, BATCH_SIZE);
  assert.equal(new Set(batch.jobs.map(job => job.promptFile)).size, BATCH_SIZE);
});

test('all prompt documents are verbatim, transparent, safe and hash-bound', async () => {
  const batch = await readBatch();
  const promptContents = await Promise.all(batch.jobs.map(async job => ({
    job,
    content: await fs.readFile(path.resolve(projectRoot, ...job.promptFile.split('/')), 'utf8')
  })));

  assert.equal(promptContents.length, BATCH_SIZE);
  for (const { job, content } of promptContents) {
    assert.equal(content, job.generationPrompt, job.promptFile);
    assert.doesNotMatch(content, /#00ff00/iu, job.promptFile);
    assert.match(content, /genuine transparent alpha/iu, job.promptFile);
    assert.match(content, /32-bit RGBA PNG/iu, job.promptFile);
    assert.match(content, /nonsexual and non-gory/iu, job.promptFile);
    assert.match(content, /no text/iu, job.promptFile);
    assert.match(content, /no franchise logo/iu, job.promptFile);
  }
});



test('prompt policy v2 gives evt_ entries a coherent mini-diorama contract', () => {
  assert.equal(CURRENT_PROMPT_POLICY_VERSION, 2);
  const entry = {
    id: 'evt_test_breach',
    name: 'Test Breach',
    universe: 'Test Universe',
    output: '/sprites/generated/items/test/evt-test-breach.png',
    visualAnchor: 'A moonlit station with one required distant agent silhouette.',
    referenceUrl: 'https://example.com/canon',
    prompt: [
      'Use case: stylized-concept',
      'Asset type: transparent game item icon',
      'Primary request: create an item icon for Test Breach.',
      'Composition/framing: centered single item icon, generous padding, three-quarter top angle, no character.',
      'Background/output lock: genuine transparent alpha only.',
      'Constraints: one item only.'
    ].join('\n')
  };

  const prompt = buildGenerationPrompt(entry);
  assert.match(prompt, /transparent game event vignette/iu);
  assert.match(prompt, /compact pixel-art mini-diorama/iu);
  assert.match(prompt, /scenery and character, creature or agent silhouettes are explicitly allowed/iu);
  assert.match(prompt, /every required subject must remain visible/iu);
  assert.match(prompt, /transparent alpha around the compact diorama silhouette/iu);
  assert.doesNotMatch(prompt, /Composition lock: one item design only, no character/iu);
  assert.doesNotMatch(prompt, /centered single item icon[^\n]*no character/iu);

  const frozenPrompt = buildGenerationPrompt(entry, { policyVersion: 1 });
  assert.match(frozenPrompt, /Composition lock: one item design only, no character/iu);
});

test('four dedicated retry prompts are verbatim and lock every rejected lore detail', async () => {
  const records = await validateRetryPromptArtifacts();
  assert.deepEqual(records.map(record => record.id), RETRY_PROMPT_TARGETS.map(target => target.id));
  const byId = new Map(records.map(record => [record.id, record.prompt]));

  for (const target of RETRY_PROMPT_TARGETS) {
    assert.ok(byId.get(target.id).includes(RETRY_FIDELITY_LOCKS[target.id]));
  }

  assert.match(byId.get('evt_atomic_heart_collective_failure'), /Facility 3826[^\n]*red maintenance-network[^\n]*repair drones[^\n]*reactivating retrofuturist machines/iu);
  assert.match(byId.get('evt_squirrel_with_a_gun_breach_event'), /stylized realistic squirrel[^\n]*compact handgun[^\n]*bright suburban[^\n]*agent silhouettes/iu);
  assert.match(byId.get('evt_squirrel_with_a_gun_breach_event'), /no injury, no muzzle flash and no gore/iu);
  assert.match(byId.get('evt_friday_13th_breach_event'), /moonlit summer-camp[^\n]*pine trees[^\n]*wooden cabin[^\n]*lake reflections[^\n]*full moon[^\n]*masked slasher silhouette/iu);
  assert.match(byId.get('evt_friday_13th_breach_event'), /no victim, no attack, no blood and no gore/iu);
  assert.match(byId.get('scp_core'), /dark rectangular facility keycard[^\n]*horizontal orange stripe[^\n]*abstract clearance blocks/iu);
  assert.match(byId.get('scp_core'), /absolutely no SCP emblem[^\n]*no three inward-pointing arrows[^\n]*no logo/iu);
});
