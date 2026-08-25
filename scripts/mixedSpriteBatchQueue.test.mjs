import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadSpriteBatch } from './openAiSpriteBatchQueue.mjs';

const sha256 = value => createHash('sha256').update(value).digest('hex');

const createFixture = async jobs => {
  const root = await mkdtemp(path.join(tmpdir(), 'mixed-sprite-queue-'));
  await mkdir(path.join(root, 'prompts'), { recursive: true });
  const normalized = [];
  for (const [index, input] of jobs.entries()) {
    const generationPrompt = input.generationPrompt || `prompt-${index + 1}`;
    const promptFile = `prompts/${index + 1}.txt`;
    await writeFile(path.join(root, ...promptFile.split('/')), generationPrompt, 'utf8');
    normalized.push({
      sequence: index + 1,
      kind: input.kind,
      id: input.id,
      output: input.output,
      promptFile,
      generationPrompt,
      generationPromptSha256: sha256(generationPrompt),
      sourcePromptSha256: sha256(`source-${index + 1}`)
    });
  }
  const batchPath = path.join(root, 'batch.json');
  await writeFile(batchPath, JSON.stringify({
    schemaVersion: 1,
    batchId: 'mixed-queue-test',
    kind: 'mixed',
    jobs: normalized
  }), 'utf8');
  return { root, batchPath };
};

test('mixed queue accepts the same raw ID across distinct concrete kinds', async t => {
  const fixture = await createFixture([
    { kind: 'item', id: 'shared', output: '/sprites/generated/items/shared.png' },
    { kind: 'hero', id: 'shared', output: '/sprites/generated/heroes/shared.png' }
  ]);
  t.after(() => rm(fixture.root, { recursive: true, force: true }));
  const batch = await loadSpriteBatch(fixture.batchPath, { repositoryRoot: fixture.root });
  assert.equal(batch.jobs.length, 2);
  assert.notEqual(batch.jobs[0].directorySlug, batch.jobs[1].directorySlug);
  assert.deepEqual(batch.jobs.map(job => job.kind), ['item', 'hero']);
});

test('mixed queue rejects a duplicate kind:id identity', async t => {
  const fixture = await createFixture([
    { kind: 'hero', id: 'duplicate', output: '/sprites/generated/heroes/a.png' },
    { kind: 'hero', id: 'duplicate', output: '/sprites/generated/heroes/b.png' }
  ]);
  t.after(() => rm(fixture.root, { recursive: true, force: true }));
  await assert.rejects(
    loadSpriteBatch(fixture.batchPath, { repositoryRoot: fixture.root }),
    /Duplicate job identity: hero:duplicate/u
  );
});

test('mixed queue rejects duplicate outputs and missing concrete kinds', async t => {
  const duplicateOutput = await createFixture([
    { kind: 'item', id: 'one', output: '/sprites/generated/shared.png' },
    { kind: 'hero', id: 'two', output: '/sprites/generated/shared.png' }
  ]);
  t.after(() => rm(duplicateOutput.root, { recursive: true, force: true }));
  await assert.rejects(
    loadSpriteBatch(duplicateOutput.batchPath, { repositoryRoot: duplicateOutput.root }),
    /Duplicate job output/u
  );

  const missingKind = await createFixture([
    { id: 'missing-kind', output: '/sprites/generated/heroes/missing-kind.png' }
  ]);
  t.after(() => rm(missingKind.root, { recursive: true, force: true }));
  await assert.rejects(
    loadSpriteBatch(missingKind.batchPath, { repositoryRoot: missingKind.root }),
    /must provide kind explicitly/u
  );
});
