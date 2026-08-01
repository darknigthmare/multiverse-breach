import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFile, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const PIPELINE = path.join(SCRIPT_DIRECTORY, 'installRiftDossierThumbnail.ps1');
const SOURCE_ASSET = path.join(
  REPOSITORY_ROOT,
  'public',
  'images',
  'rift-dossiers',
  'openai',
  'mission-8801-name-lock-v1.png'
);
const POWERSHELL = process.platform === 'win32'
  ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  : 'pwsh';

function runPipeline(argumentsList) {
  return spawnSync(
    POWERSHELL,
    ['-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', PIPELINE, ...argumentsList],
    {
      cwd: REPOSITORY_ROOT,
      encoding: 'utf8',
      windowsHide: true
    }
  );
}

function inspectPng(buffer) {
  assert.deepEqual(
    [...buffer.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    'output must retain a PNG signature'
  );
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

test('rift dossier thumbnail pipeline is atomic, verifiable and refuses implicit overwrite', async (context) => {
  if (process.platform !== 'win32') {
    context.skip('System.Drawing fallback validation is Windows-specific.');
    return;
  }

  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'rift-dossier-pipeline-'));
  context.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const sourceCopy = path.join(temporaryRoot, 'imagegen-source.png');
  const destination = path.join(temporaryRoot, 'mission-test-v1.png');
  const ledger = path.join(temporaryRoot, 'provenance.jsonl');
  const promptSha256 = 'a'.repeat(64);
  await copyFile(SOURCE_ASSET, sourceCopy);

  const install = runPipeline([
    '-Source', sourceCopy,
    '-Destination', destination,
    '-Ledger', ledger,
    '-OutputPath', '/images/rift-dossiers/openai/mission-test-v1.png',
    '-AssetId', 'mission-test-v1',
    '-MissionId', '9999',
    '-PromptSha256', promptSha256,
    '-Width', '960',
    '-Height', '540'
  ]);
  assert.equal(install.status, 0, install.stderr || install.stdout);

  const sourceBuffer = await readFile(sourceCopy);
  const outputBuffer = await readFile(destination);
  const metadata = inspectPng(outputBuffer);
  assert.deepEqual(metadata, { width: 960, height: 540 });
  assert.ok(outputBuffer.length < sourceBuffer.length, 'thumbnail should be smaller than its source');

  const rows = (await readFile(ledger, 'utf8'))
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => JSON.parse(line));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].assetId, 'mission-test-v1');
  assert.equal(rows[0].generation.provider, 'OpenAI');
  assert.equal(rows[0].generation.interface, 'built-in image_gen');
  assert.equal(rows[0].generation.model, 'built-in/imagegen');
  assert.equal(rows[0].generation.promptSha256, promptSha256);
  assert.equal(rows[0].image.sha256, sha256(outputBuffer));

  const beforeRetry = await stat(destination);
  const retry = runPipeline([
    '-Source', sourceCopy,
    '-Destination', destination,
    '-Ledger', ledger,
    '-OutputPath', '/images/rift-dossiers/openai/mission-test-v1.png',
    '-AssetId', 'mission-test-v1',
    '-PromptSha256', promptSha256
  ]);
  assert.notEqual(retry.status, 0, 'implicit overwrite must fail');
  const afterRetry = await stat(destination);
  assert.equal(afterRetry.mtimeMs, beforeRetry.mtimeMs, 'failed retry must not touch destination');
  assert.equal(sha256(await readFile(destination)), sha256(outputBuffer));

  const verify = runPipeline([
    '-Destination', destination,
    '-Ledger', ledger,
    '-OutputPath', '/images/rift-dossiers/openai/mission-test-v1.png',
    '-AssetId', 'mission-test-v1',
    '-PromptSha256', promptSha256,
    '-VerifyOnly'
  ]);
  assert.equal(verify.status, 0, verify.stderr || verify.stdout);
  const verification = JSON.parse(verify.stdout);
  assert.equal(verification.verified, true);
  assert.equal(verification.width, 960);
  assert.equal(verification.height, 540);

  const replace = runPipeline([
    '-Source', sourceCopy,
    '-Destination', destination,
    '-Ledger', ledger,
    '-OutputPath', '/images/rift-dossiers/openai/mission-test-v1.png',
    '-AssetId', 'mission-test-v1',
    '-MissionId', '9999',
    '-PromptSha256', promptSha256,
    '-Width', '960',
    '-Height', '540',
    '-Replace'
  ]);
  assert.equal(replace.status, 0, replace.stderr || replace.stdout);
  const rowsAfterReplace = (await readFile(ledger, 'utf8'))
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => JSON.parse(line));
  assert.equal(rowsAfterReplace.length, 1, 'explicit replacement must replace, not duplicate, provenance');
  assert.equal(rowsAfterReplace[0].image.sha256, sha256(await readFile(destination)));

  const webpDestination = path.join(temporaryRoot, 'mission-test-webp-v1.webp');
  const webpPromptSha256 = 'b'.repeat(64);
  const webpInstall = runPipeline([
    '-Source', sourceCopy,
    '-Destination', webpDestination,
    '-Ledger', ledger,
    '-OutputPath', '/images/rift-dossiers/openai/mission-test-webp-v1.webp',
    '-AssetId', 'mission-test-webp-v1',
    '-MissionId', '10000',
    '-PromptSha256', webpPromptSha256,
    '-WebPQuality', '86'
  ]);
  assert.equal(webpInstall.status, 0, webpInstall.stderr || webpInstall.stdout);
  const webpSummary = JSON.parse(webpInstall.stdout);
  assert.equal(webpSummary.width, 640);
  assert.equal(webpSummary.height, 360);
  assert.ok(
    webpSummary.sharpAvailable || webpSummary.pillowAvailable,
    'at least one WebP processor must be available'
  );
  assert.equal(
    webpSummary.backend,
    webpSummary.sharpAvailable ? 'sharp' : 'pillow',
    'the installer must report the processor it actually selected'
  );

  const webpBuffer = await readFile(webpDestination);
  assert.equal(webpBuffer.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webpBuffer.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.ok(webpBuffer.length < sourceBuffer.length, 'WebP thumbnail should be smaller than its source');

  const webpVerify = runPipeline([
    '-Destination', webpDestination,
    '-Ledger', ledger,
    '-OutputPath', '/images/rift-dossiers/openai/mission-test-webp-v1.webp',
    '-AssetId', 'mission-test-webp-v1',
    '-PromptSha256', webpPromptSha256,
    '-VerifyOnly'
  ]);
  assert.equal(webpVerify.status, 0, webpVerify.stderr || webpVerify.stdout);
  const webpVerification = JSON.parse(webpVerify.stdout);
  assert.equal(webpVerification.verified, true);
  assert.equal(webpVerification.width, 640);
  assert.equal(webpVerification.height, 360);

  const finalRows = (await readFile(ledger, 'utf8'))
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => JSON.parse(line));
  assert.equal(finalRows.length, 2);
  const webpRow = finalRows.find(row => row.assetId === 'mission-test-webp-v1');
  assert.ok(webpRow);
  assert.equal(webpRow.processing.backend, webpSummary.backend);
  assert.equal(webpRow.processing.webpQuality, 86);
  assert.equal(webpRow.image.sha256, sha256(webpBuffer));
  await rm(temporaryRoot, { recursive: true, force: true });
});
