import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  mergeInstallBatchFiles,
  parseMergeArguments
} from './mergeGeneratedBitmapInstallBatches.mjs';

const clone = value => structuredClone(value);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const PROMPT_CATALOG_SHA256 = sha256('prompt catalog fixture');

async function createFixture(context) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'merge-install-batches-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  const batchDirectory = path.join(root, 'batches');
  const sourceDirectory = path.join(root, 'sources');
  const promptDirectory = path.join(root, 'prompts');
  await Promise.all([
    mkdir(batchDirectory, { recursive: true }),
    mkdir(sourceDirectory, { recursive: true }),
    mkdir(promptDirectory, { recursive: true })
  ]);

  const makeJob = async ({
    tag,
    sequence,
    kind = 'item',
    id = tag,
    output = `/sprites/generated/items/tests/${id}.png`,
    generationId = `exec-${tag}`
  }) => {
    const source = path.join(sourceDirectory, `${tag}.png`);
    const prompt = path.join(promptDirectory, `${tag}.txt`);
    const generationPrompt = `prompt fixture ${tag}`;
    await Promise.all([
      writeFile(source, `png fixture ${tag}`),
      writeFile(prompt, generationPrompt, 'utf8')
    ]);
    return {
      sequence,
      kind,
      id,
      output,
      source: path.relative(batchDirectory, source),
      generationId,
      generationPromptFile: path.relative(batchDirectory, prompt),
      generationPromptSha256: sha256(generationPrompt),
      catalogPromptSha256: sha256(`catalog prompt fixture ${kind}:${id}`),
      replace: false
    };
  };

  const baseBeta = await makeJob({ tag: 'base-beta', sequence: 1, id: 'beta' });
  const baseAlpha = await makeJob({ tag: 'base-alpha', sequence: 2, id: 'alpha' });
  const correctedAlpha = await makeJob({
    tag: 'corrected-alpha',
    sequence: 2,
    id: 'alpha',
    output: baseAlpha.output
  });
  const addedGamma = await makeJob({ tag: 'added-gamma', sequence: 3, id: 'gamma' });
  const secondAlpha = await makeJob({
    tag: 'second-alpha',
    sequence: 2,
    id: 'alpha',
    output: baseAlpha.output
  });

  const basePath = path.join(batchDirectory, 'base.json');
  const firstOverlayPath = path.join(batchDirectory, 'overlay-1.json');
  const secondOverlayPath = path.join(batchDirectory, 'overlay-2.json');
  const outputPath = path.join(root, 'merged', 'install-batch.json');
  const catalogPath = path.join(batchDirectory, 'catalog.json');
  const writeBatch = async (file, batchId, jobs, overrides = {}) => {
    await writeFile(file, `${JSON.stringify({
      schemaVersion: 1,
      batchId,
      promptCatalogSha256: PROMPT_CATALOG_SHA256,
      counts: {
        total: jobs.length,
        complete: jobs.length,
        remaining: 0
      },
      jobs,
      ...overrides
    }, null, 2)}\n`, 'utf8');
  };
  await writeBatch(basePath, 'base-test', [baseAlpha, baseBeta]);
  await writeBatch(
    firstOverlayPath,
    'overlay-first-test',
    [addedGamma, correctedAlpha]
  );
  await writeBatch(secondOverlayPath, 'overlay-second-test', [secondAlpha]);
  await writeFile(catalogPath, `${JSON.stringify({
    schemaVersion: 1,
    batchId: 'catalog-test',
    promptCatalogSha256: PROMPT_CATALOG_SHA256,
    jobs: [baseBeta, baseAlpha, addedGamma].map(job => ({
      sequence: job.sequence,
      kind: job.kind,
      id: job.id,
      output: job.output,
      sourcePromptSha256: job.catalogPromptSha256
    }))
  }, null, 2)}\n`, 'utf8');

  return {
    root,
    batchDirectory,
    basePath,
    firstOverlayPath,
    secondOverlayPath,
    outputPath,
    catalogPath,
    writeBatch,
    jobs: {
      baseBeta,
      baseAlpha,
      correctedAlpha,
      addedGamma,
      secondAlpha
    }
  };
}

test('overlay replaces existing identities, adds missing jobs and writes deterministic order', async context => {
  const fixture = await createFixture(context);
  const result = await mergeInstallBatchFiles({
    basePath: fixture.basePath,
    overlayPaths: [fixture.firstOverlayPath],
    expectedCount: 3,
    outputPath: fixture.outputPath
  });

  assert.deepEqual(result, {
    batchId: 'base-test',
    expectedCount: 3,
    jobs: 3,
    overlays: 1,
    applications: 2,
    added: 1,
    replaced: 1,
    output: path.resolve(fixture.outputPath)
  });
  const merged = JSON.parse(await readFile(fixture.outputPath, 'utf8'));
  assert.deepEqual(
    merged.jobs.map(job => `${job.sequence}:${job.kind}:${job.id}`),
    ['1:item:beta', '2:item:alpha', '3:item:gamma']
  );
  assert.equal(merged.jobs[1].generationId, fixture.jobs.correctedAlpha.generationId);
  assert.equal(merged.jobs[1].output, fixture.jobs.baseAlpha.output);
  assert.equal(path.isAbsolute(merged.jobs[1].source), true);
  assert.equal(path.isAbsolute(merged.jobs[1].generationPromptFile), true);
  assert.deepEqual(merged.counts, { total: 3, complete: 3, remaining: 0 });
  assert.equal(
    (await readdir(path.dirname(fixture.outputPath))).some(name => name.endsWith('.tmp')),
    false
  );
});

test('successive overlays use last writer for the same identity', async context => {
  const fixture = await createFixture(context);
  await mergeInstallBatchFiles({
    basePath: fixture.basePath,
    overlayPaths: [fixture.firstOverlayPath, fixture.secondOverlayPath],
    expectedCount: 3,
    outputPath: fixture.outputPath
  });
  const merged = JSON.parse(await readFile(fixture.outputPath, 'utf8'));
  const alpha = merged.jobs.find(job => job.id === 'alpha');
  assert.equal(alpha.generationId, fixture.jobs.secondAlpha.generationId);
  assert.equal(alpha.source, path.resolve(
    fixture.batchDirectory,
    fixture.jobs.secondAlpha.source
  ));
});

test('malformed identity and output drift are rejected', async context => {
  const fixture = await createFixture(context);
  const invalidIdentityPath = path.join(fixture.batchDirectory, 'invalid-identity.json');
  const invalidIdentity = clone(fixture.jobs.correctedAlpha);
  invalidIdentity.id = '';
  await fixture.writeBatch(invalidIdentityPath, 'invalid-identity', [invalidIdentity]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [invalidIdentityPath],
      expectedCount: 2,
      outputPath: fixture.outputPath
    }),
    /jobs\[0\]\.id must be a non-empty string/u
  );

  const outputDriftPath = path.join(fixture.batchDirectory, 'output-drift.json');
  const outputDrift = clone(fixture.jobs.correctedAlpha);
  outputDrift.output = '/sprites/generated/items/tests/forbidden-drift.png';
  await fixture.writeBatch(outputDriftPath, 'output-drift', [outputDrift]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [outputDriftPath],
      expectedCount: 2,
      outputPath: fixture.outputPath
    }),
    /overlay cannot change output for item:alpha/u
  );
});

test('duplicate final generation ids are rejected', async context => {
  const fixture = await createFixture(context);
  const duplicatePath = path.join(fixture.batchDirectory, 'duplicate-generation.json');
  const duplicateGeneration = clone(fixture.jobs.correctedAlpha);
  duplicateGeneration.generationId = fixture.jobs.baseBeta.generationId;
  await fixture.writeBatch(duplicatePath, 'duplicate-generation', [
    duplicateGeneration,
    fixture.jobs.addedGamma
  ]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [duplicatePath],
      expectedCount: 3,
      outputPath: fixture.outputPath
    }),
    /Duplicate final generationId/u
  );
});

test('duplicate final outputs are rejected', async context => {
  const fixture = await createFixture(context);
  const duplicatePath = path.join(fixture.batchDirectory, 'duplicate-output.json');
  const duplicateOutput = clone(fixture.jobs.addedGamma);
  duplicateOutput.output = fixture.jobs.baseBeta.output;
  await fixture.writeBatch(duplicatePath, 'duplicate-output', [duplicateOutput]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [duplicatePath],
      expectedCount: 3,
      outputPath: fixture.outputPath
    }),
    /Duplicate final output/u
  );
});

test('duplicate and non-contiguous final sequences are rejected', async context => {
  const fixture = await createFixture(context);
  const collisionPath = path.join(fixture.batchDirectory, 'sequence-collision.json');
  const sequenceCollision = clone(fixture.jobs.addedGamma);
  sequenceCollision.sequence = fixture.jobs.baseAlpha.sequence;
  await fixture.writeBatch(collisionPath, 'sequence-collision', [sequenceCollision]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [collisionPath],
      expectedCount: 3,
      outputPath: fixture.outputPath
    }),
    /Duplicate final sequence 2/u
  );

  const gapPath = path.join(fixture.batchDirectory, 'sequence-gap.json');
  const sequenceGap = clone(fixture.jobs.addedGamma);
  sequenceGap.sequence = 4;
  await fixture.writeBatch(gapPath, 'sequence-gap', [sequenceGap]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [gapPath],
      expectedCount: 3,
      outputPath: fixture.outputPath
    }),
    /Final sequences must be contiguous 1\.\.3: expected 3, found 4/u
  );
});

test('missing source is rejected before output is written', async context => {
  const fixture = await createFixture(context);
  const missingSourcePath = path.join(fixture.batchDirectory, 'missing-source.json');
  const missingSource = clone(fixture.jobs.correctedAlpha);
  missingSource.source = 'missing.png';
  await fixture.writeBatch(missingSourcePath, 'missing-source', [missingSource]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [missingSourcePath],
      expectedCount: 2,
      outputPath: fixture.outputPath
    }),
    /item:alpha source does not exist or is not a file/u
  );
  await assert.rejects(readFile(fixture.outputPath), error => error.code === 'ENOENT');
});

test('missing generation prompt is rejected before output is written', async context => {
  const fixture = await createFixture(context);
  const missingPromptPath = path.join(fixture.batchDirectory, 'missing-prompt.json');
  const missingPrompt = clone(fixture.jobs.correctedAlpha);
  missingPrompt.generationPromptFile = 'missing.txt';
  await fixture.writeBatch(missingPromptPath, 'missing-prompt', [missingPrompt]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [missingPromptPath],
      expectedCount: 2,
      outputPath: fixture.outputPath
    }),
    /item:alpha generation prompt does not exist or is not a file/u
  );
  await assert.rejects(readFile(fixture.outputPath), error => error.code === 'ENOENT');
});

test('generation prompt bytes must match the exported provenance hash', async context => {
  const fixture = await createFixture(context);
  const promptDriftPath = path.join(fixture.batchDirectory, 'prompt-drift.json');
  const promptDrift = clone(fixture.jobs.correctedAlpha);
  promptDrift.generationPromptSha256 = '0'.repeat(64);
  await fixture.writeBatch(promptDriftPath, 'prompt-drift', [promptDrift]);
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [promptDriftPath],
      expectedCount: 2,
      outputPath: fixture.outputPath
    }),
    /item:alpha generation prompt hash mismatch/u
  );
});

test('null-catalog overlays may replace bound jobs but require catalog proof for additions', async context => {
  const fixture = await createFixture(context);
  const nullReplacementPath = path.join(fixture.batchDirectory, 'null-replacement.json');
  await fixture.writeBatch(
    nullReplacementPath,
    'null-replacement',
    [fixture.jobs.correctedAlpha],
    { promptCatalogSha256: null }
  );
  await mergeInstallBatchFiles({
    basePath: fixture.basePath,
    overlayPaths: [nullReplacementPath],
    expectedCount: 2,
    outputPath: fixture.outputPath
  });

  const nullAdditionPath = path.join(fixture.batchDirectory, 'null-addition.json');
  await fixture.writeBatch(
    nullAdditionPath,
    'null-addition',
    [fixture.jobs.addedGamma],
    { promptCatalogSha256: null }
  );
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [nullAdditionPath],
      expectedCount: 3,
      outputPath: fixture.outputPath
    }),
    /adding item:gamma from a null-catalog overlay requires --catalog/u
  );
  await mergeInstallBatchFiles({
    basePath: fixture.basePath,
    overlayPaths: [nullAdditionPath],
    catalogPath: fixture.catalogPath,
    expectedCount: 3,
    outputPath: fixture.outputPath
  });
});

test('invalid JSON, schema and incomplete expected count are rejected', async context => {
  const fixture = await createFixture(context);
  const invalidJsonPath = path.join(fixture.batchDirectory, 'invalid.json');
  await writeFile(invalidJsonPath, '{broken', 'utf8');
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [invalidJsonPath],
      expectedCount: 2,
      outputPath: fixture.outputPath
    }),
    /Invalid JSON/u
  );

  const invalidSchemaPath = path.join(fixture.batchDirectory, 'invalid-schema.json');
  await fixture.writeBatch(
    invalidSchemaPath,
    'invalid-schema',
    [fixture.jobs.correctedAlpha],
    { schemaVersion: 2 }
  );
  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [invalidSchemaPath],
      expectedCount: 2,
      outputPath: fixture.outputPath
    }),
    /schemaVersion must be 1/u
  );

  await assert.rejects(
    mergeInstallBatchFiles({
      basePath: fixture.basePath,
      overlayPaths: [fixture.firstOverlayPath],
      expectedCount: 4,
      outputPath: fixture.outputPath
    }),
    /Merged job count 3 does not match expectedCount 4/u
  );
});

test('CLI parser preserves repeated overlay order and requires expected count', () => {
  assert.deepEqual(parseMergeArguments([
    '--base', 'base.json',
    '--overlay', 'first.json',
    '--overlay=second.json',
    '--catalog', 'catalog.json',
    '--expected-count', '500',
    '--output', 'merged.json'
  ]), {
    basePath: 'base.json',
    overlayPaths: ['first.json', 'second.json'],
    catalogPath: 'catalog.json',
    expectedCount: 500,
    outputPath: 'merged.json'
  });
  assert.throws(
    () => parseMergeArguments([
      '--base', 'base.json',
      '--overlay', 'first.json',
      '--output', 'merged.json'
    ]),
    /Missing --expected-count/u
  );
});
