import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadExactInstallBatchContract } from './missingAssetBatchRuntimeContract.mjs';

const sha256 = value => createHash('sha256').update(value).digest('hex');

const writeJson = (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`);

async function createExactFixture(t, count = 500) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'exact500-runtime-contract-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const prompt = Buffer.from('verbatim generated prompt with final newline\n', 'utf8');
  const promptSha256 = sha256(prompt);
  const promptCatalogSha256 = 'a'.repeat(64);
  await writeFile(path.join(directory, 'prompt.txt'), prompt);
  await writeFile(path.join(directory, 'source.bin'), Buffer.from('source'));
  const catalog = {
    schemaVersion: 1,
    batchId: 'exact-catalog',
    promptCatalogSha256,
    jobs: Array.from({ length: count }, (_, index) => ({
      sequence: index + 1,
      kind: 'item',
      id: `asset-${String(index + 1).padStart(3, '0')}`,
      output: `/sprites/generated/items/test/asset-${index + 1}.png`,
      sourcePromptSha256: promptSha256
    }))
  };
  const install = {
    schemaVersion: 1,
    batchId: 'exact-install',
    promptCatalogSha256,
    jobs: catalog.jobs.map(job => ({
      ...job,
      source: 'source.bin',
      generationId: `exec-job-${job.sequence}`,
      generationPromptFile: 'prompt.txt',
      generationPromptSha256: promptSha256,
      catalogPromptSha256: job.sourcePromptSha256,
      replace: true
    }))
  };
  const catalogPath = path.join(directory, 'catalog.json');
  const installPath = path.join(directory, 'install.json');
  await writeJson(catalogPath, catalog);
  await writeJson(installPath, install);
  return { directory, catalogPath, installPath, catalog, install };
}

test('runtime contract accepts one ordered exact-500 install batch bound to the catalog', async t => {
  const fixture = await createExactFixture(t);
  const contract = await loadExactInstallBatchContract({
    batchPath: fixture.catalogPath,
    installBatchPath: fixture.installPath
  });
  assert.equal(contract.jobsByIdentity.size, 500);
  assert.equal(contract.generationIds.size, 500);
  assert.equal(contract.installBatch.jobs[0].sequence, 1);
  assert.equal(contract.installBatch.jobs[499].sequence, 500);
});

test('runtime contract rejects count, order, generation id and catalog provenance drift', async t => {
  const fixture = await createExactFixture(t);
  const cases = [
    {
      name: 'count',
      mutate: document => document.jobs.pop(),
      error: /expected exactly 500 install jobs/u
    },
    {
      name: 'order',
      mutate: document => document.jobs.reverse(),
      error: /ordered by contiguous sequence 1\.\.500/u
    },
    {
      name: 'generation-id',
      mutate: document => { document.jobs[1].generationId = document.jobs[0].generationId; },
      error: /duplicate generationId/u
    },
    {
      name: 'output',
      mutate: document => { document.jobs[0].output = '/sprites/generated/items/test/drift.png'; },
      error: /catalog output drift/u
    },
    {
      name: 'source-prompt',
      mutate: document => { document.jobs[0].catalogPromptSha256 = 'b'.repeat(64); },
      error: /catalog prompt hash drift/u
    }
  ];
  for (const scenario of cases) {
    const document = JSON.parse(await readFile(fixture.installPath, 'utf8'));
    scenario.mutate(document);
    const installPath = path.join(fixture.directory, `install-${scenario.name}.json`);
    await writeJson(installPath, document);
    await assert.rejects(
      loadExactInstallBatchContract({
        batchPath: fixture.catalogPath,
        installBatchPath: installPath
      }),
      scenario.error,
      scenario.name
    );
  }
});
