import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildCompletionCatalog,
  buildCompletionInstallBatch,
  parseCompletionArguments,
  WAVE_3_COMPLETION_SIZE
} from './buildWave3CompletionCatalog.mjs';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const PROMPT_CATALOG_SHA256 = sha256('synthetic-prompt-catalog');
const CATALOG_PROMPT_SHA256 = sha256('synthetic-catalog-prompt');

const createWorkspace = async context => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'wave3-completion-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  const promptDirectory = path.join(root, 'prompts');
  const sourceDirectory = path.join(root, 'sources');
  await mkdir(promptDirectory, { recursive: true });
  await mkdir(sourceDirectory, { recursive: true });
  const prompt = 'Exact synthetic ImageGen prompt\n';
  const promptFile = path.join(promptDirectory, 'shared.txt');
  const source = path.join(sourceDirectory, 'shared.png');
  await writeFile(promptFile, prompt, 'utf8');
  await writeFile(source, Buffer.from('synthetic-png-source'));
  return {
    root,
    prompt,
    promptFile,
    promptFileRelative: 'prompts/shared.txt',
    promptSha256: sha256(prompt),
    source
  };
};

const plannedJob = (fixture, sequence, prefix = 'original') => ({
  sequence,
  kind: 'hero',
  id: `${prefix}_${sequence}`,
  name: `${prefix} ${sequence}`,
  universe: 'Synthetic',
  output: `/sprites/generated/heroes/synthetic/${prefix}-${sequence}.png`,
  sourcePromptSha256: CATALOG_PROMPT_SHA256,
  generationPromptSha256: fixture.promptSha256,
  promptFile: fixture.promptFileRelative,
  generationPrompt: fixture.prompt
});

const writeBatch = async (fixture, name, jobs, overrides = {}) => {
  const file = path.join(fixture.root, `${name}.json`);
  await writeFile(file, JSON.stringify({
    schemaVersion: 1,
    batchId: name,
    kind: 'mixed',
    promptCatalogSha256: PROMPT_CATALOG_SHA256,
    jobs,
    ...overrides
  }, null, 2) + '\n');
  return file;
};

const installJob = (fixture, planned, generationId) => ({
  sequence: planned.sequence,
  kind: planned.kind,
  id: planned.id,
  output: planned.output,
  source: fixture.source,
  generationId,
  generationPromptFile: fixture.promptFile,
  generationPromptSha256: fixture.promptSha256,
  catalogPromptSha256: CATALOG_PROMPT_SHA256,
  replace: false
});

const writeInstallFragment = async (fixture, name, jobs, overrides = {}) => {
  const file = path.join(fixture.root, `${name}.install.json`);
  await writeFile(file, JSON.stringify({
    schemaVersion: 1,
    batchId: name,
    promptCatalogSha256: PROMPT_CATALOG_SHA256,
    counts: { total: jobs.length, complete: jobs.length, remaining: 0 },
    jobs,
    ...overrides
  }, null, 2) + '\n');
  return file;
};

test('builds the deterministic exact 500-success Wave 3 catalog', async context => {
  const fixture = await createWorkspace(context);
  const originalJobs = Array.from(
    { length: WAVE_3_COMPLETION_SIZE },
    (_unused, index) => plannedJob(fixture, index + 1)
  );
  const replacementJobs = [
    plannedJob(fixture, 1, 'makeup'),
    plannedJob(fixture, 2, 'makeup')
  ];
  const originalBatch = await writeBatch(fixture, 'wave-3-original', originalJobs);
  const replacementBatch = await writeBatch(fixture, 'wave-3-makeup', replacementJobs);
  const input = {
    originalBatch,
    failedSequences: [499, 2],
    replacementBatches: [replacementBatch],
    repositoryRoot: fixture.root
  };

  const first = buildCompletionCatalog(input);
  const second = buildCompletionCatalog(input);

  assert.deepEqual(first, second);
  assert.deepEqual(first.counts, {
    original: 500,
    failedOriginal: 2,
    retainedOriginal: 498,
    replacement: 2,
    total: 500
  });
  assert.deepEqual(first.failedOriginalSequences, [2, 499]);
  assert.deepEqual(first.jobs.map(job => job.sequence), Array.from({ length: 500 }, (_v, i) => i + 1));
  assert.equal(first.jobs[0].id, 'original_1');
  assert.equal(first.jobs[1].id, 'original_3');
  assert.equal(first.jobs[497].id, 'original_500');
  assert.equal(first.jobs[498].id, 'makeup_1');
  assert.equal(first.jobs[499].id, 'makeup_2');
  assert.deepEqual(first.jobs[498].completionSource, {
    role: 'replacement',
    batchId: 'wave-3-makeup',
    batchSha256: sha256(await readFile(replacementBatch)),
    sourceSequence: 1
  });
});

test('assembles shuffled partial exports into one ordered install batch with source provenance', async context => {
  const fixture = await createWorkspace(context);
  const originalJobs = [1, 2, 3].map(sequence => plannedJob(fixture, sequence));
  const replacementJobs = [plannedJob(fixture, 1, 'makeup')];
  const originalBatch = await writeBatch(fixture, 'original-small', originalJobs);
  const replacementBatch = await writeBatch(fixture, 'makeup-small', replacementJobs);
  const completionCatalog = buildCompletionCatalog({
    originalBatch,
    failedSequences: [2],
    replacementBatches: [replacementBatch],
    repositoryRoot: fixture.root,
    expectedCount: 3
  });
  const originalFragment = await writeInstallFragment(fixture, 'original-export', [
    installJob(fixture, originalJobs[2], 'exec-generation-003'),
    installJob(fixture, originalJobs[0], 'exec-generation-001')
  ]);
  const replacementFragment = await writeInstallFragment(fixture, 'makeup-export', [
    installJob(fixture, replacementJobs[0], 'exec-generation-004')
  ]);

  const installBatch = buildCompletionInstallBatch({
    completionCatalog,
    installFragments: [replacementFragment, originalFragment],
    repositoryRoot: fixture.root
  });

  assert.deepEqual(installBatch.counts, { total: 3, complete: 3, remaining: 0 });
  assert.deepEqual(installBatch.jobs.map(job => job.id), [
    'original_1',
    'original_3',
    'makeup_1'
  ]);
  assert.deepEqual(installBatch.jobs.map(job => job.sequence), [1, 2, 3]);
  assert.equal(installBatch.jobs[0].sourceSha256, sha256(await readFile(fixture.source)));
  assert.equal(installBatch.jobs[2].generationSource.batchId, 'makeup-export');
  assert.equal(
    installBatch.completionCatalogSha256,
    sha256(Buffer.from(JSON.stringify(completionCatalog, null, 2) + '\n'))
  );
});

test('rejects replacement cardinality, cross-catalog fragments and duplicate generation ids', async context => {
  const fixture = await createWorkspace(context);
  const originalJobs = [1, 2, 3].map(sequence => plannedJob(fixture, sequence));
  const originalBatch = await writeBatch(fixture, 'original-errors', originalJobs);
  const emptyReplacement = await writeBatch(
    fixture,
    'makeup-too-many',
    [plannedJob(fixture, 1, 'makeup'), plannedJob(fixture, 2, 'makeup')]
  );
  assert.throws(() => buildCompletionCatalog({
    originalBatch,
    failedSequences: [2],
    replacementBatches: [emptyReplacement],
    repositoryRoot: fixture.root,
    expectedCount: 3
  }), /Replacement job count must equal failed original count/u);

  const replacementBatch = await writeBatch(
    fixture,
    'makeup-errors',
    [plannedJob(fixture, 1, 'makeup')]
  );
  const completionCatalog = buildCompletionCatalog({
    originalBatch,
    failedSequences: [2],
    replacementBatches: [replacementBatch],
    repositoryRoot: fixture.root,
    expectedCount: 3
  });
  const allJobs = [
    installJob(fixture, originalJobs[0], 'exec-duplicate-generation'),
    installJob(fixture, originalJobs[2], 'exec-duplicate-generation'),
    installJob(fixture, plannedJob(fixture, 1, 'makeup'), 'exec-generation-makeup')
  ];
  const duplicateFragment = await writeInstallFragment(fixture, 'duplicate-generations', allJobs);
  assert.throws(() => buildCompletionInstallBatch({
    completionCatalog,
    installFragments: [duplicateFragment],
    repositoryRoot: fixture.root
  }), /Duplicate generationId/u);

  const wrongCatalogFragment = await writeInstallFragment(
    fixture,
    'wrong-catalog',
    [installJob(fixture, originalJobs[0], 'exec-generation-one')],
    { promptCatalogSha256: sha256('another catalog') }
  );
  assert.throws(() => buildCompletionInstallBatch({
    completionCatalog,
    installFragments: [wrongCatalogFragment],
    repositoryRoot: fixture.root
  }), /promptCatalogSha256 mismatch/u);
});

test('rejects missing sources and contractual generation prompt hash drift', async context => {
  const fixture = await createWorkspace(context);
  const originalJobs = [plannedJob(fixture, 1)];
  const originalBatch = await writeBatch(fixture, 'original-source-check', originalJobs);
  const completionCatalog = buildCompletionCatalog({
    originalBatch,
    failedSequences: [],
    repositoryRoot: fixture.root,
    expectedCount: 1
  });
  const missingSource = installJob(fixture, originalJobs[0], 'exec-missing-source');
  missingSource.source = path.join(fixture.root, 'does-not-exist.png');
  const missingSourceFragment = await writeInstallFragment(
    fixture,
    'missing-source',
    [missingSource]
  );
  assert.throws(() => buildCompletionInstallBatch({
    completionCatalog,
    installFragments: [missingSourceFragment],
    repositoryRoot: fixture.root
  }), /source does not exist/u);

  const drifted = installJob(fixture, originalJobs[0], 'exec-prompt-drift');
  drifted.generationPromptSha256 = sha256('drifted prompt');
  const driftedFragment = await writeInstallFragment(fixture, 'prompt-drift', [drifted]);
  assert.throws(() => buildCompletionInstallBatch({
    completionCatalog,
    installFragments: [driftedFragment],
    repositoryRoot: fixture.root
  }), /generation prompt file hash mismatch/u);
});

test('parses repeated replacement and install fragment options deterministically', () => {
  assert.deepEqual(parseCompletionArguments([
    '--original-batch', 'original.json',
    '--replacement-batch=makeup-a.json',
    '--replacement-batch', 'makeup-b.json',
    '--install-fragment', 'original-install.json',
    '--install-fragment=makeup-install.json',
    '--failed-sequences', '2,4',
    '--expected-count', '334',
    '--catalog-output', 'completion.json'
  ]), {
    replacementBatches: ['makeup-a.json', 'makeup-b.json'],
    installFragments: ['original-install.json', 'makeup-install.json'],
    originalBatch: 'original.json',
    failedSequences: '2,4',
    expectedCount: '334',
    catalogOutput: 'completion.json'
  });
});
