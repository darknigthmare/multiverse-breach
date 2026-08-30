import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildInstallPlan, parseArguments } from './installRiftDossierThumbnailBatch.mjs';

const sha256 = value => createHash('sha256').update(value).digest('hex');

test('batch installer argument parser requires an explicit install batch', () => {
  assert.deepEqual(parseArguments(['--batch', 'install.json', '--results', 'results.json']), {
    batch: 'install.json',
    results: 'results.json'
  });
  assert.throws(() => parseArguments([]), /--batch is required/u);
});

test('batch installer validates dossier identity, prompt, output and provenance before mutation', async context => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rift-batch-plan-'));
  context.after(() => fs.rm(root, { recursive: true, force: true }));
  const prompt = 'OpenAI image request: exact verified dossier prompt. '.repeat(12);
  const output = '/images/rift-dossiers/openai/expanded/stage-59-test-v1.webp';
  const catalog = { entrees: [{ id: 59, cheminCibleDedie: output, promptOpenAI: prompt }] };
  const catalogBytes = Buffer.from(`${JSON.stringify(catalog, null, 2)}\n`);
  const catalogPath = path.join(root, 'docs', 'rift-dossiers', 'catalog.json');
  const promptPath = path.join(root, 'prompts', '059.txt');
  const sourcePath = path.join(root, 'raw', '059.png');
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.mkdir(path.dirname(promptPath), { recursive: true });
  await fs.mkdir(path.dirname(sourcePath), { recursive: true });
  await fs.writeFile(catalogPath, catalogBytes);
  await fs.writeFile(promptPath, prompt);
  await fs.writeFile(sourcePath, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const promptSha = sha256(Buffer.from(prompt));
  const selectedPromptContractSha = sha256(Buffer.from(JSON.stringify([
    { id: '59', output, prompt }
  ])));
  const batch = {
    schemaVersion: 1,
    batchId: 'fixture-rift-install',
    promptCatalogSha256: selectedPromptContractSha,
    jobs: [{
      sequence: 1,
      kind: 'stage',
      id: '59',
      output,
      source: sourcePath,
      generationId: 'exec-dataurl-1234567890abcdef1234567890abcdef',
      generationPromptFile: promptPath,
      generationPromptSha256: promptSha,
      catalogPromptSha256: promptSha,
      replace: false
    }]
  };
  const batchPath = path.join(root, 'install.json');
  await fs.writeFile(batchPath, `${JSON.stringify(batch, null, 2)}\n`);
  const plan = await buildInstallPlan({ root, batchPath });
  assert.equal(plan.jobs.length, 1);
  assert.equal(plan.jobs[0].stageId, 59);
  assert.equal(plan.jobs[0].assetId, 'stage-59-test-v1');
  assert.equal(plan.jobs[0].promptSha256, promptSha);
  assert.ok(plan.jobs[0].destination.startsWith(path.join(root, 'public')));

  const malformed = structuredClone(batch);
  malformed.jobs[0].generationPromptSha256 = '0'.repeat(64);
  await fs.writeFile(batchPath, `${JSON.stringify(malformed, null, 2)}\n`);
  await assert.rejects(() => buildInstallPlan({ root, batchPath }), /generation prompt hash mismatch/u);
});
