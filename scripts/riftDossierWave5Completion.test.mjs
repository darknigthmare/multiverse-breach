import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { buildWave5Completion } from './buildRiftDossierWave5Completion.mjs';

const sha256 = value => createHash('sha256').update(value).digest('hex');

const writeJson = async (file, value) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const createFixture = async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rift-wave5-completion-'));
  const promptDirectory = path.join(root, 'prompts');
  await fs.mkdir(promptDirectory, { recursive: true });
  const originalPrompts = ['primary one', 'primary two', 'primary three', 'primary four'];
  const makeupPrompt = 'safe environment-only two';
  const visualPrompts = new Map([
    [2, 'visual correction after safety makeup two'],
    [4, 'visual correction after primary four']
  ]);
  const originalJobs = [];

  for (let index = 0; index < originalPrompts.length; index += 1) {
    const sequence = index + 1;
    const id = String(100 + sequence);
    const output = `/images/rift-dossiers/openai/expanded/stage-${id}.webp`;
    const prompt = originalPrompts[index];
    const promptFile = `prompts/primary-${sequence}.txt`;
    const promptHash = sha256(Buffer.from(prompt, 'utf8'));
    await fs.writeFile(path.join(root, promptFile), prompt, 'utf8');
    originalJobs.push({
      sequence,
      kind: 'stage',
      id,
      stageId: Number(id),
      assetId: `stage-${id}`,
      output,
      replace: false,
      sourcePromptSha256: promptHash,
      generationPromptSha256: promptHash,
      promptFile,
      generationPrompt: prompt
    });
  }

  const originalPath = path.join(root, 'original.json');
  await writeJson(originalPath, {
    schemaVersion: 1,
    batchId: 'fixture-primary',
    kind: 'stage',
    jobs: originalJobs
  });
  const originalBytes = await fs.readFile(originalPath);
  const makeupPromptFile = 'prompts/makeup-2.txt';
  const makeupPromptHash = sha256(Buffer.from(makeupPrompt, 'utf8'));
  await fs.writeFile(path.join(root, makeupPromptFile), makeupPrompt, 'utf8');
  const makeupJob = {
    sequence: 1,
    replacementOfSequence: 2,
    kind: 'stage',
    id: originalJobs[1].id,
    stageId: originalJobs[1].stageId,
    assetId: originalJobs[1].assetId,
    output: originalJobs[1].output,
    replace: false,
    replacedPromptSha256: originalJobs[1].generationPromptSha256,
    sourcePromptSha256: makeupPromptHash,
    generationPromptSha256: makeupPromptHash,
    promptFile: makeupPromptFile,
    generationPrompt: makeupPrompt
  };
  const makeupPath = path.join(root, 'makeup.json');
  await writeJson(makeupPath, {
    schemaVersion: 1,
    batchId: 'fixture-makeup',
    kind: 'stage',
    source: { batchSha256: sha256(originalBytes) },
    jobs: [makeupJob]
  });
  const makeupBytes = await fs.readFile(makeupPath);

  const visualJobs = [];
  for (const [originalSequence, prompt] of visualPrompts) {
    const sourceJob = originalJobs[originalSequence - 1];
    const fromMakeup = originalSequence === 2;
    const base = fromMakeup ? makeupJob : sourceJob;
    const promptFile = `prompts/visual-${originalSequence}.txt`;
    const promptHash = sha256(Buffer.from(prompt, 'utf8'));
    const sourceImageSha256 = sha256(Buffer.from(`source-${originalSequence}`, 'utf8'));
    await fs.writeFile(path.join(root, promptFile), prompt, 'utf8');
    visualJobs.push({
      sequence: visualJobs.length + 1,
      correctionVersion: 1,
      replacementOfSequence: originalSequence,
      kind: 'stage',
      id: sourceJob.id,
      stageId: sourceJob.stageId,
      assetId: sourceJob.assetId,
      output: sourceJob.output,
      replace: true,
      sourceLayer: fromMakeup ? 'wave-5-safety-makeup' : 'wave-5-primary',
      correctionOfBatchId: fromMakeup ? 'fixture-makeup' : 'fixture-primary',
      correctionOfSequence: base.sequence,
      correctionOfGenerationPromptSha256: base.generationPromptSha256,
      replacedPromptSha256: base.generationPromptSha256,
      sourcePromptSha256: promptHash,
      generationPromptSha256: promptHash,
      promptFile,
      generationPrompt: prompt,
      visualAuditIssue: `fixture-camera-contract-${originalSequence}`,
      successfulGeneration: {
        provider: 'OpenAI',
        interface: 'built-in image_gen',
        generationId: `exec-fixture-${originalSequence}`,
        sourceImage: {
          format: 'PNG',
          width: 1672,
          height: 941,
          sha256: sourceImageSha256
        }
      }
    });
  }
  const visualPath = path.join(root, 'visual.json');
  await writeJson(visualPath, {
    schemaVersion: 1,
    correctionVersion: 1,
    batchId: 'fixture-visual',
    kind: 'stage',
    sources: {
      wave5Primary: { sha256: sha256(originalBytes) },
      wave5SafetyMakeup: { sha256: sha256(makeupBytes) }
    },
    overlayOrder: ['wave-5-primary', 'wave-5-safety-makeup', 'wave-5-visual-corrections-v1'],
    jobs: visualJobs
  });

  const runtimeBytes = await sharp({
    create: { width: 640, height: 360, channels: 3, background: { r: 9, g: 24, b: 42 } }
  }).webp({ quality: 86 }).toBuffer();
  const runtimeSha256 = sha256(runtimeBytes);
  const catalogEntries = [];
  const ledgerEntries = [];
  for (const sourceJob of originalJobs) {
    const sequence = sourceJob.sequence;
    const visualJob = visualJobs.find(job => job.replacementOfSequence === sequence) || null;
    const selectedPrompt = visualJob?.generationPrompt || (sequence === 2 ? makeupPrompt : sourceJob.generationPrompt);
    const selectedPromptSha256 = sha256(Buffer.from(selectedPrompt, 'utf8'));
    const sourceImageSha256 = visualJob?.successfulGeneration.sourceImage.sha256
      || sha256(Buffer.from(`source-${sequence}`, 'utf8'));
    const generationId = visualJob?.successfulGeneration.generationId || `exec-fixture-primary-${sequence}`;
    catalogEntries.push({
      id: Number(sourceJob.id),
      cheminCibleDedie: sourceJob.output,
      promptOpenAI: selectedPrompt
    });
    const destination = path.join(root, 'public', sourceJob.output.replace(/^\/+/, ''));
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, runtimeBytes);
    ledgerEntries.push({
      schemaVersion: 1,
      kind: 'rift-dossier-thumbnail',
      assetId: sourceJob.assetId,
      output: sourceJob.output,
      sourceImage: {
        fileName: `source-${sequence}.png`,
        format: 'PNG',
        width: 1672,
        height: 941,
        sha256: sourceImageSha256
      },
      generation: {
        provider: 'OpenAI',
        interface: 'built-in image_gen',
        generationId,
        promptSha256: selectedPromptSha256
      },
      image: {
        format: 'WEBP',
        width: 640,
        height: 360,
        bytes: runtimeBytes.length,
        sha256: runtimeSha256
      },
      missionId: Number(sourceJob.id),
      prompt: selectedPrompt
    });
  }
  const catalogPath = path.join(root, 'catalog.json');
  await writeJson(catalogPath, { schemaVersion: 1, entrees: catalogEntries });
  const ledgerPath = path.join(root, 'ledger.jsonl');
  await fs.writeFile(ledgerPath, `${ledgerEntries.map(entry => JSON.stringify(entry)).join('\n')}\n`, 'utf8');

  return { root, originalPath, makeupPath, visualPath, catalogPath, ledgerPath };
};

const buildFixtureCompletion = fixture => buildWave5Completion({
  originalBatchPath: fixture.originalPath,
  makeupBatchPath: fixture.makeupPath,
  visualCorrectionsBatchPath: fixture.visualPath,
  catalogPath: fixture.catalogPath,
  ledgerPath: fixture.ledgerPath,
  expectedCount: 4,
  expectedReplacementCount: 1,
  expectedVisualCorrectionCount: 2,
  cwd: fixture.root
});

test('Wave 5 completion applies primary, makeup, then visual corrections to installed assets', async t => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.root, { recursive: true, force: true }));
  const document = await buildFixtureCompletion(fixture);
  assert.deepEqual(document.jobs.map(job => job.id), ['101', '102', '103', '104']);
  assert.deepEqual(document.jobs.map(job => job.sequence), [1, 2, 3, 4]);
  assert.deepEqual(
    document.jobs.map(job => job.completionSource.role),
    ['primary', 'visual-correction', 'primary', 'visual-correction']
  );
  assert.equal(document.jobs[1].completionSource.supersedes.role, 'makeup');
  assert.equal(document.jobs[3].completionSource.supersedes.role, 'primary');
  assert.deepEqual(document.counts, {
    requested: 4,
    primary: 2,
    makeup: 0,
    visualCorrections: 2,
    installed: 4,
    remaining: 0
  });
  assert.ok(document.jobs.every(job => job.runtimeImage.width === 640));
  assert.ok(document.jobs.every(job => job.runtimeImage.height === 360));
});

test('Wave 5 completion rejects a visual correction that does not chain from its selected source', async t => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.root, { recursive: true, force: true }));
  const visual = JSON.parse(await fs.readFile(fixture.visualPath, 'utf8'));
  visual.jobs[0].replacedPromptSha256 = '0'.repeat(64);
  await writeJson(fixture.visualPath, visual);
  await assert.rejects(buildFixtureCompletion(fixture), /Visual correction replaced prompt SHA drift/u);
});

test('Wave 5 completion rejects a catalog that stops before the visual overlay', async t => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.root, { recursive: true, force: true }));
  const catalog = JSON.parse(await fs.readFile(fixture.catalogPath, 'utf8'));
  catalog.entrees.find(entry => entry.id === 102).promptOpenAI = 'safe environment-only two';
  await writeJson(fixture.catalogPath, catalog);
  await assert.rejects(buildFixtureCompletion(fixture), /terminal overlay prompt/u);
});
