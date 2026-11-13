import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { buildInstallPlan, installBatch, parseArguments } from './installRiftDossierThumbnailBatch.mjs';

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

  const writeJson = async (relative, value) => {
    const file = path.join(root, relative);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(value));
  };
  const canonicalSource = 'DLC/Halo/assets' + output;
  await writeJson('DLC/Halo/manifest.json', {
    schemaVersion: 1, id: 'halo', universe: 'Halo', directory: 'DLC/Halo', assetManifest: 'assets.json'
  });
  await writeJson('DLC/Halo/assets.json', {
    schemaVersion: 1, universe: 'Halo', assets: [{ publicPath: output, sourcePath: canonicalSource }]
  });
  catalog.entrees[0].univers = ['Halo'];
  await writeJson('docs/rift-dossiers/catalog.json', catalog);
  const migrated = await buildInstallPlan({ root, batchPath });
  assert.equal(migrated.jobs[0].destination, path.join(root, canonicalSource));
  assert.equal(migrated.jobs[0].output, output);
  assert.equal(migrated.jobs[0].promptSha256, promptSha);

  // A verified retry reads the canonical image and the unchanged shared ledger.
  const image = await sharp({ create: {
    width: 640, height: 360, channels: 3, background: { r: 20, g: 40, b: 60 }
  } }).webp().toBuffer();
  await fs.mkdir(path.dirname(path.join(root, canonicalSource)), { recursive: true });
  await fs.writeFile(path.join(root, canonicalSource), image);
  const ledgerPath = path.join(root, 'public/images/rift-dossiers/openai/openai-prompts.jsonl');
  await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
  await fs.writeFile(ledgerPath, JSON.stringify({
    kind: 'rift-dossier-thumbnail', assetId: migrated.jobs[0].assetId, output, prompt,
    generation: {
      provider: 'OpenAI', interface: 'built-in image_gen',
      generationId: batch.jobs[0].generationId, promptSha256: promptSha
    },
    image: { sha256: sha256(image) }
  }) + '\n');
  const installed = await installBatch({ root, batchPath });
  assert.equal(installed.records[0].output, output);
  await assert.rejects(() => fs.stat(path.join(root, 'public' + output)), { code: 'ENOENT' });

  // New URLs need one exact owning universe; declared shared ownership wins.
  await writeJson('DLC/Halo/assets.json', { schemaVersion: 1, universe: 'Halo', assets: [] });
  assert.equal((await buildInstallPlan({ root, batchPath })).jobs[0].destination, path.join(root, canonicalSource));
  await writeJson('DLC/shared-assets.json', {
    schemaVersion: 1, assets: [{ publicPath: output, sourcePath: 'public' + output }]
  });
  assert.equal((await buildInstallPlan({ root, batchPath })).jobs[0].destination, path.join(root, 'public' + output));
  await writeJson('DLC/shared-assets.json', { schemaVersion: 1, assets: [] });
  catalog.entrees[0].univers = ['Halo', 'Alien'];
  await writeJson('docs/rift-dossiers/catalog.json', catalog);
  assert.equal((await buildInstallPlan({ root, batchPath })).jobs[0].destination, path.join(root, 'public' + output));

  const malformed = structuredClone(batch);
  malformed.jobs[0].generationPromptSha256 = '0'.repeat(64);
  await fs.writeFile(batchPath, `${JSON.stringify(malformed, null, 2)}\n`);
  await assert.rejects(() => buildInstallPlan({ root, batchPath }), /generation prompt hash mismatch/u);
});
