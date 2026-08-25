import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

import {
  atomicWriteTextFile,
  installBatchFile,
  normalizeGeneratedSource,
  parseArguments,
  recomposeNineRadialTiles,
  removeEnclosedNeutralBackground,
  sha256Buffer
} from './installGeneratedBitmapBatch.mjs';

const createFixture = async (t, suffix) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sprite-batch-' + suffix + '-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const generatedRoot = path.join(root, 'public', 'sprites', 'generated');
  mkdirSync(generatedRoot, { recursive: true });
  const prompt = [
    'Use case: stylized-concept',
    'Asset type: transparent game item icon',
    'Primary request: one red test relic',
    'Background: transparent',
    'Constraints: one item, no text'
  ].join('\n');
  const entry = {
    kind: 'item',
    id: 'green-edge-relic',
    universe: 'Installer Test',
    name: 'Green Edge Relic',
    output: '/sprites/generated/items/installer-test/green-edge-relic.png',
    prompt
  };
  const promptCatalog = JSON.stringify(entry) + '\n';
  const promptPath = path.join(generatedRoot, 'openai-sprite-prompts.jsonl');
  const ledgerPath = path.join(generatedRoot, 'openai-asset-ledger.jsonl');
  writeFileSync(promptPath, promptCatalog, 'utf8');
  writeFileSync(ledgerPath, '', 'utf8');

  const sourcePath = path.join(root, 'opaque-green-source.png');
  await sharp({
    create: {
      width: 96,
      height: 96,
      channels: 4,
      background: { r: 0, g: 255, b: 0, alpha: 1 }
    }
  }).composite([{
    input: {
      create: {
        width: 36,
        height: 44,
        channels: 4,
        background: { r: 220, g: 32, b: 24, alpha: 1 }
      }
    },
    left: 30,
    top: 26
  }]).png().toFile(sourcePath);

  const generationPrompt = prompt + '\nActual transparency; remove any chroma background.';
  const generationPromptPath = path.join(root, 'generation-prompt.txt');
  writeFileSync(generationPromptPath, generationPrompt, 'utf8');
  const batchPath = path.join(root, 'install-batch.json');
  const resultsPath = path.join(root, 'install-results.json');
  writeFileSync(batchPath, JSON.stringify({
    schemaVersion: 1,
    batchId: 'test-' + suffix,
    promptCatalogSha256: sha256Buffer(Buffer.from(promptCatalog, 'utf8')),
    jobs: [{
      kind: entry.kind,
      id: entry.id,
      source: sourcePath,
      generationId: 'exec-test-green-edge-relic',
      generationPromptFile: generationPromptPath,
      generationPromptSha256: sha256Buffer(Buffer.from(generationPrompt, 'utf8')),
      catalogPromptSha256: sha256Buffer(Buffer.from(prompt, 'utf8')),
      replace: false
    }]
  }, null, 2), 'utf8');
  return {
    root,
    entry,
    prompt,
    generationPrompt,
    sourcePath,
    batchPath,
    resultsPath,
    ledgerPath,
    outputPath: path.join(root, 'public', entry.output.replace(/^\/+/, ''))
  };
};

const createEnclosedNeutralFixture = () => {
  const width = 64;
  const height = 64;
  const data = Buffer.alloc(width * height * 4);
  const setPixel = (x, y, color) => {
    const offset = (y * width + x) * 4;
    data[offset] = color[0];
    data[offset + 1] = color[1];
    data[offset + 2] = color[2];
    data[offset + 3] = color[3] ?? 255;
  };
  const checkerAt = (x, y) => (
    (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0
      ? [244, 244, 244, 255]
      : [252, 252, 252, 255]
  );
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) setPixel(x, y, checkerAt(x, y));
  }
  for (let y = 8; y <= 55; y += 1) {
    for (let x = 8; x <= 55; x += 1) setPixel(x, y, [176, 32, 24, 255]);
  }
  for (let y = 20; y <= 43; y += 1) {
    for (let x = 20; x <= 43; x += 1) setPixel(x, y, checkerAt(x, y));
  }
  for (let y = 20; y <= 50; y += 1) {
    for (let x = 10; x <= 18; x += 1) setPixel(x, y, [220, 230, 245, 255]);
  }
  return {
    data,
    width,
    height,
    cavityPixels: 24 * 24,
    lightSampleOffset: (35 * width + 14) * 4
  };
};

const createEightSegmentRadialFixture = async (segmentCount = 8) => {
  const width = 512;
  const height = 512;
  const center = 255.5;
  const data = Buffer.alloc(width * height * 4);
  const radialStep = Math.PI * 2 / segmentCount;
  const radialBoundary = radialStep / 2;
  const gapHalfWidth = 0.035;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const distance = Math.hypot(x - center, y - center);
      let color = null;
      if (distance >= 45 && distance <= 80) {
        color = [42, 38, 32, 255];
      } else if (distance >= 100 && distance <= 215) {
        const angle = Math.atan2(y - center, x - center);
        const relative = (
          ((angle - radialBoundary) % radialStep) + radialStep
        ) % radialStep;
        const gapDistance = Math.min(relative, radialStep - relative);
        color = gapDistance <= gapHalfWidth
          ? [244, 244, 244, 255]
          : [72, 66, 54, 255];
      }
      if (!color) continue;
      const offset = (y * width + x) * 4;
      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = color[3];
    }
  }
  return {
    buffer: await sharp(data, {
      raw: { width, height, channels: 4 }
    }).png().toBuffer(),
    backgroundKeys: [[244, 244, 244], [252, 252, 252]],
    center
  };
};

test('batch install removes opaque edge-connected chroma green and records exact provenance', async (t) => {
  const fixture = await createFixture(t, 'green');
  const result = await installBatchFile({
    root: fixture.root,
    batchPath: fixture.batchPath,
    resultsPath: fixture.resultsPath
  });

  assert.equal(result.status, 'complete');
  assert.deepEqual(result.counts, { requested: 1, installed: 1, failed: 0 });
  const metadata = await sharp(fixture.outputPath).metadata();
  assert.equal(metadata.width, 512);
  assert.equal(metadata.height, 512);
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.channels, 4);

  const decoded = await sharp(fixture.outputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => decoded.data[(y * decoded.info.width + x) * 4 + 3];
  assert.equal(alphaAt(0, 0), 0);
  assert.ok(alphaAt(256, 256) > 240);

  const ledger = readFileSync(fixture.ledgerPath, 'utf8')
    .trim()
    .split(/\r?\n/u)
    .map(line => JSON.parse(line));
  assert.equal(ledger.length, 1);
  assert.equal(ledger[0].generationPrompt, fixture.generationPrompt);
  assert.equal(ledger[0].generationPromptStatus, 'recorded-verbatim');
  assert.equal(
    ledger[0].generationPromptSha256,
    sha256Buffer(Buffer.from(fixture.generationPrompt, 'utf8'))
  );
  assert.equal(ledger[0].generation.interface, 'built-in image_gen');
  assert.ok(ledger[0].processing.backgroundModes.includes('chroma-green'));
  assert.ok(ledger[0].processing.removedBackgroundPixels > 0);
  assert.equal(ledger[0].image.sha256, result.records[0].outputSha256);

  const persistedResult = JSON.parse(readFileSync(fixture.resultsPath, 'utf8'));
  assert.equal(persistedResult.status, 'complete');
  assert.equal(persistedResult.records[0].id, fixture.entry.id);
});

test('opt-in repair removes a large enclosed neutral checker cavity only', () => {
  const fixture = createEnclosedNeutralFixture();
  const repaired = removeEnclosedNeutralBackground(
    Buffer.from(fixture.data),
    fixture.width,
    fixture.height,
    [[244, 244, 244], [252, 252, 252]]
  );

  assert.equal(repaired.removedComponents, 1);
  assert.equal(repaired.removedPixels, fixture.cavityPixels);
  const cavityOffset = (30 * fixture.width + 30) * 4;
  assert.equal(repaired.data[cavityOffset + 3], 0);
  assert.equal(repaired.data[fixture.lightSampleOffset], 220);
  assert.equal(repaired.data[fixture.lightSampleOffset + 1], 230);
  assert.equal(repaired.data[fixture.lightSampleOffset + 2], 245);
  assert.equal(repaired.data[fixture.lightSampleOffset + 3], 255);
});

test('large light regions that are not very close to checker keys are preserved', () => {
  const fixture = createEnclosedNeutralFixture();
  const repaired = removeEnclosedNeutralBackground(
    Buffer.from(fixture.data),
    fixture.width,
    fixture.height,
    [[244, 244, 244], [252, 252, 252]]
  );
  let preservedLightPixels = 0;
  for (let y = 20; y <= 50; y += 1) {
    for (let x = 10; x <= 18; x += 1) {
      if (repaired.data[(y * fixture.width + x) * 4 + 3] === 255) {
        preservedLightPixels += 1;
      }
    }
  }
  assert.equal(preservedLightPixels, 9 * 31);
});

test('a legitimate 16x16 neutral two-tone rectangle is not mistaken for a checker grid', () => {
  const width = 32;
  const height = 32;
  const data = Buffer.alloc(width * height * 4);
  for (let y = 8; y < 24; y += 1) {
    for (let x = 8; x < 24; x += 1) {
      const offset = (y * width + x) * 4;
      const tone = x < 16 ? 244 : 252;
      data[offset] = tone;
      data[offset + 1] = tone;
      data[offset + 2] = tone;
      data[offset + 3] = 255;
    }
  }
  const repaired = removeEnclosedNeutralBackground(
    Buffer.from(data),
    width,
    height,
    [[244, 244, 244], [252, 252, 252]]
  );
  assert.equal(repaired.removedPixels, 0);
  assert.equal(repaired.removedComponents, 0);
  for (let y = 8; y < 24; y += 1) {
    for (let x = 8; x < 24; x += 1) {
      assert.equal(repaired.data[(y * width + x) * 4 + 3], 255);
    }
  }
});

test('radial recomposition creates nine separate tiles and preserves the central socket', async () => {
  const fixture = await createEightSegmentRadialFixture();
  const before = await sharp(fixture.buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const recomposed = await recomposeNineRadialTiles(
    fixture.buffer,
    fixture.backgroundKeys
  );
  const after = await sharp(recomposed.buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  assert.equal(recomposed.processing.reason, 'exact-nine-pillar-canon-lock');
  assert.equal(recomposed.processing.inputTopology.outerTiles, 8);
  assert.equal(recomposed.processing.outputTopology.outerTiles, 9);
  assert.equal(recomposed.processing.count, 9);
  assert.equal(recomposed.processing.rotationDegrees, 40);
  assert.equal(recomposed.processing.tangentialScale, 0.85);
  assert.equal(recomposed.processing.overlapPixels, 0);
  assert.deepEqual(
    recomposed.processing.angularEvidence.map(sample => sample.runs),
    [9, 9, 9, 9, 9, 9]
  );
  assert.ok(recomposed.processing.angularEvidence.every(sample => (
    sample.minimumGapSamples >= 4
  )));

  const centerOffset = (Math.floor(fixture.center) * before.info.width + Math.floor(fixture.center)) * 4;
  assert.equal(before.data[centerOffset + 3], 0);
  assert.equal(after.data[centerOffset + 3], 0);
  for (let y = 0; y < before.info.height; y += 1) {
    for (let x = 0; x < before.info.width; x += 1) {
      if (Math.hypot(x - fixture.center, y - fixture.center) > 80) {
        continue;
      }
      const offset = (y * before.info.width + x) * 4;
      assert.deepEqual(
        [...after.data.subarray(offset, offset + 4)],
        [...before.data.subarray(offset, offset + 4)]
      );
    }
  }
});

test('radial recomposition refuses a topology other than one center plus eight tiles', async () => {
  const fixture = await createEightSegmentRadialFixture(7);
  await assert.rejects(
    recomposeNineRadialTiles(fixture.buffer, fixture.backgroundKeys),
    /expected one central ring and eight outer tiles|component topology differs/
  );
});

test('item normalization is byte-identical by default and reports opt-in repair', async (t) => {
  const fixture = createEnclosedNeutralFixture();
  const root = mkdtempSync(path.join(os.tmpdir(), 'sprite-enclosed-neutral-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = path.join(root, 'enclosed-neutral.png');
  await sharp(fixture.data, {
    raw: { width: fixture.width, height: fixture.height, channels: 4 }
  }).png().toFile(source);

  const implicitDefault = await normalizeGeneratedSource(source, 'item');
  const explicitDefault = await normalizeGeneratedSource(source, 'item', {
    repairEnclosedNeutralBackground: false,
    recomposeNineRadialTiles: false
  });
  const repaired = await normalizeGeneratedSource(source, 'item', {
    repairEnclosedNeutralBackground: true
  });

  assert.equal(
    sha256Buffer(implicitDefault.buffer),
    sha256Buffer(explicitDefault.buffer)
  );
  assert.equal(
    Object.hasOwn(implicitDefault.processing, 'enclosedNeutralBackgroundRepair'),
    false
  );
  assert.equal(
    repaired.processing.enclosedNeutralBackgroundRepair.removedPixels,
    fixture.cavityPixels
  );
  assert.equal(
    repaired.processing.enclosedNeutralBackgroundRepair.removedComponents,
    1
  );
  assert.notEqual(sha256Buffer(repaired.buffer), sha256Buffer(implicitDefault.buffer));
});

test('batch jobs propagate the explicit enclosed-neutral repair option', async (t) => {
  const fixture = await createFixture(t, 'enclosed-neutral-batch');
  const imageFixture = createEnclosedNeutralFixture();
  await sharp(imageFixture.data, {
    raw: {
      width: imageFixture.width,
      height: imageFixture.height,
      channels: 4
    }
  }).png().toFile(fixture.sourcePath);
  const batch = JSON.parse(readFileSync(fixture.batchPath, 'utf8'));
  batch.jobs[0].repairEnclosedNeutralBackground = true;
  writeFileSync(fixture.batchPath, JSON.stringify(batch, null, 2), 'utf8');

  await installBatchFile({
    root: fixture.root,
    batchPath: fixture.batchPath,
    resultsPath: fixture.resultsPath
  });
  const ledger = readFileSync(fixture.ledgerPath, 'utf8')
    .trim()
    .split(/\r?\n/u)
    .map(line => JSON.parse(line));
  const repair = ledger[0].processing.enclosedNeutralBackgroundRepair;
  assert.equal(repair.enabled, true);
  assert.equal(repair.removedPixels, imageFixture.cavityPixels);
  assert.equal(repair.removedComponents, 1);
  assert.equal(repair.minimumComponentPixels, 256);
});

test('failed atomic ledger commit rolls back the runtime asset and preserves the old ledger', async (t) => {
  const fixture = await createFixture(t, 'rollback');
  const originalLedger = JSON.stringify({
    schemaVersion: 2,
    kind: 'item',
    id: 'preexisting-ledger-record',
    output: '/unchanged.png'
  }) + '\n';
  writeFileSync(fixture.ledgerPath, originalLedger, 'utf8');

  await assert.rejects(
    installBatchFile({
      root: fixture.root,
      batchPath: fixture.batchPath,
      resultsPath: fixture.resultsPath,
      hooks: {
        beforeLedgerRename: () => {
          throw new Error('simulated ledger commit failure');
        }
      }
    }),
    /simulated ledger commit failure/
  );

  assert.equal(readFileSync(fixture.ledgerPath, 'utf8'), originalLedger);
  assert.equal(existsSync(fixture.outputPath), false);
  assert.equal(
    existsSync(fixture.ledgerPath + '.install.lock'),
    false
  );
  const persistedResult = JSON.parse(readFileSync(fixture.resultsPath, 'utf8'));
  assert.equal(persistedResult.status, 'failed');
  assert.match(persistedResult.error, /simulated ledger commit failure/);
});

test('staging creation failure releases the installer lock', async (t) => {
  const fixture = await createFixture(t, 'staging-lock');
  await assert.rejects(
    installBatchFile({
      root: fixture.root,
      batchPath: fixture.batchPath,
      resultsPath: fixture.resultsPath,
      hooks: {
        createStagingRoot: () => {
          throw new Error('simulated staging creation failure');
        }
      }
    }),
    /simulated staging creation failure/
  );
  assert.equal(
    existsSync(fixture.ledgerPath + '.install.lock'),
    false
  );
});

test('one atomic rename can commit a 500-record ledger payload without partial lines', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sprite-ledger-500-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const ledgerPath = path.join(root, 'openai-asset-ledger.jsonl');
  writeFileSync(ledgerPath, '{"old":true}\n', 'utf8');
  const records = Array.from({ length: 500 }, (_, index) => ({
    schemaVersion: 2,
    kind: 'item',
    id: 'batch-item-' + String(index + 1).padStart(3, '0')
  }));
  const payload = records.map(record => JSON.stringify(record)).join('\n') + '\n';
  let renameCount = 0;
  atomicWriteTextFile(ledgerPath, payload, {
    beforeRename: () => {
      renameCount += 1;
      assert.equal(readFileSync(ledgerPath, 'utf8'), '{"old":true}\n');
    }
  });

  assert.equal(renameCount, 1);
  const installed = readFileSync(ledgerPath, 'utf8')
    .trim()
    .split(/\r?\n/u)
    .map(line => JSON.parse(line));
  assert.equal(installed.length, 500);
  assert.equal(installed[0].id, 'batch-item-001');
  assert.equal(installed[499].id, 'batch-item-500');
  assert.equal(
    readdirSync(root).some(name => name.includes('.tmp-')),
    false
  );
});

test('legacy single-asset CLI flags keep their existing key/value contract', () => {
  assert.deepEqual(parseArguments([
    '--source', 'source.png',
    '--kind', 'item',
    '--id', 'sample',
    '--generation-id', 'exec-sample',
    '--generation-prompt-file', 'prompt.txt',
    '--replace', 'true'
  ]), {
    source: 'source.png',
    kind: 'item',
    id: 'sample',
    'generation-id': 'exec-sample',
    'generation-prompt-file': 'prompt.txt',
    replace: 'true'
  });
});

test('single-asset CLI accepts both explicit opt-in transformations', () => {
  const args = parseArguments([
    '--source', 'source.png',
    '--kind', 'item',
    '--id', 'sample',
    '--generation-id', 'exec-sample',
    '--repair-enclosed-neutral-background', 'true',
    '--recompose-nine-radial-tiles', 'true'
  ]);
  assert.equal(args['repair-enclosed-neutral-background'], 'true');
  assert.equal(args['recompose-nine-radial-tiles'], 'true');
});
