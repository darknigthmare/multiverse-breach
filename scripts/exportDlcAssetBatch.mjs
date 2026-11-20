import { createHash } from 'node:crypto';
import { constants, createReadStream, createWriteStream } from 'node:fs';
import { lstat, mkdir, mkdtemp, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { verifyDlcAssetBatchPlan } from './dlcAssetBatches.mjs';
import { decodeDlcBatchAsset } from './dlcAssetBatchDecode.mjs';
import { projectAssetPath } from './dlcAssetPaths.mjs';
import { createDlcBatchAssetSource } from './dlcBatchAssetSource.mjs';
import { assertDistributionDirectory, inspectDistributionPath, listDistributionFiles, readDistributionFile } from './dlcDistributionFilesystem.mjs';

export const DLC_ASSET_BATCH_EXPORT_RECEIPT = 'batch-export.json';
const HASH = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const BATCH_ID = /^\d{5}$/;
const MAX_BATCH_BYTES = 256 * 1024 * 1024;
const digest = value => createHash('sha256').update(value).digest('hex');
const matches = (value, pattern) => typeof value === 'string' && pattern.test(value);
const sameDirectory = (actual, expected) => actual?.isDirectory() && actual.dev === expected.dev && actual.ino === expected.ino;
const readFlags = constants.O_RDONLY | constants.O_NOFOLLOW;
const writeFlags = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW;

function describeAsset({ sourcePath, publicPath, gitBlobOid, bytes, sha256, sourceKind, decode }) {
  return { sourcePath, publicPath, gitBlobOid, bytes, sha256, sourceKind, decode };
}

/** Hash and bound the copy in the same pass, or hash a previously delivered file. */
export async function verifyDlcAssetBatchBytes(input, { bytes, sha256, sourcePath }, destination, nativeGitOid) {
  const hash = createHash('sha256');
  const gitHash = nativeGitOid ? createHash('sha1').update(`blob ${bytes}\0`) : null;
  let length = 0;
  const verifyChunk = chunk => {
    length += chunk.length;
    if (length > bytes) throw new Error('Batch export payload exceeds expected length: ' + sourcePath);
    hash.update(chunk);
    gitHash?.update(chunk);
  };
  const stream = createReadStream(input, { flags: readFlags });
  if (destination) {
    const verifier = new Transform({ transform(chunk, _encoding, done) {
      try { verifyChunk(chunk); done(null, chunk); } catch (error) { done(error); }
    } });
    await pipeline(stream, verifier, createWriteStream(destination, { flags: writeFlags, mode: 0o644 }));
  } else {
    for await (const chunk of stream) verifyChunk(chunk);
  }
  if (length !== bytes || hash.digest('hex') !== sha256) throw new Error('Batch export payload differs: ' + sourcePath);
  if (gitHash && gitHash.digest('hex') !== nativeGitOid) throw new Error('Assembly payload differs from the planned Git blob: ' + sourcePath);
}

export function parseDlcAssetBatchExportReceipt(receiptBytes, expectedReceiptSha256) {
  const receiptSha256 = digest(receiptBytes);
  if (expectedReceiptSha256 !== undefined && expectedReceiptSha256 !== receiptSha256) {
    throw new Error('Batch export receipt hash differs from the pinned hash.');
  }
  const receipt = JSON.parse(receiptBytes);
  if (receipt?.schemaVersion !== 1 || receipt.kind !== 'dlc-asset-batch-export' || receipt.layout !== 'sources'
    || !matches(receipt.sourceRevision, COMMIT) || !matches(receipt.planSha256, HASH) || !matches(receipt.batchSha256, HASH)
    || !matches(receipt.runnerSha256, HASH) || !matches(receipt.batchId, BATCH_ID)
    || !Array.isArray(receipt.assets) || receipt.assets.length < 1 || receipt.assets.length > 40) {
    throw new Error('Invalid batch export receipt.');
  }
  const expectedFiles = new Set([DLC_ASSET_BATCH_EXPORT_RECEIPT]);
  const publicPaths = new Set();
  let bytes = 0;
  for (const asset of receipt.assets) {
    const projected = projectAssetPath(asset?.sourcePath);
    if (!projected || projected.publicPath !== asset.publicPath || expectedFiles.has(asset.sourcePath)
      || publicPaths.has(asset.publicPath) || !matches(asset.gitBlobOid, COMMIT) || !matches(asset.sha256, HASH)
      || !Number.isSafeInteger(asset.bytes) || asset.bytes < 0 || asset.bytes > MAX_BATCH_BYTES) {
      throw new Error('Invalid or duplicate asset in batch export receipt.');
    }
    expectedFiles.add(asset.sourcePath);
    publicPaths.add(asset.publicPath);
    bytes += asset.bytes;
  }
  if (bytes > MAX_BATCH_BYTES || receipt.payloadBytes !== bytes) throw new Error('Invalid batch export byte total.');
  return { receipt, receiptSha256, expectedFiles };
}

/** Verify a transferred batch. Pin receiptSha256 from the exporter to check provenance continuity. */
export async function auditDlcAssetBatchExport({ directory, expectedReceiptSha256 } = {}) {
  directory = assertDistributionDirectory(directory);
  const receiptBytes = readDistributionFile(directory, DLC_ASSET_BATCH_EXPORT_RECEIPT);
  const { receipt, receiptSha256, expectedFiles } = parseDlcAssetBatchExportReceipt(receiptBytes, expectedReceiptSha256);
  const actualFiles = listDistributionFiles({ root: directory });
  if (actualFiles.length !== expectedFiles.size || actualFiles.some(file => !expectedFiles.has(file))) {
    throw new Error('Batch export file inventory differs from receipt.');
  }
  for (const asset of receipt.assets) {
    await verifyDlcAssetBatchBytes(inspectDistributionPath(directory, asset.sourcePath), asset);
  }
  return { batchId: receipt.batchId, sourceRevision: receipt.sourceRevision, planSha256: receipt.planSha256,
    assets: receipt.assets.length, payloadBytes: receipt.payloadBytes, receiptSha256 };
}

/** Materialize one frozen lot, keeping exactly one working payload at a time. */
export async function exportDlcAssetBatch({ root = process.cwd(), plan, batchId, out, allowLfsFetch = false,
  verifiedHistoricalLfsMap } = {}) {
  root = assertDistributionDirectory(root);
  if (typeof out !== 'string' || !out.trim()) throw new Error('A new batch output directory is required.');
  const destination = path.resolve(out);
  const relative = path.relative(root, destination);
  if (!relative || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep))) {
    throw new Error('Batch output must be outside the canonical repository.');
  }
  const parent = assertDistributionDirectory(path.dirname(destination));
  if (inspectDistributionPath(parent, path.basename(destination), { optional: true, directory: true })) {
    throw new Error('Batch output already exists: ' + destination);
  }
  const id = typeof batchId === 'number' ? String(batchId) : batchId;
  if (!matches(id, /^\d{1,5}$/)) throw new Error('A single numeric batch ID is required.');
  await verifyDlcAssetBatchPlan({ root, plan });
  const batch = plan.batches.find(entry => entry.id === id.padStart(5, '0'));
  if (!batch) throw new Error('Unknown asset batch ID.');
  if (batch.exceedsAssetLimit || batch.assets.some(asset => asset.unavailableCode)) {
    throw new Error('Batch export has unavailable or oversized assets: ' + batch.id);
  }
  if (batch.assets.length < 1 || batch.assets.length > 40 || !Number.isSafeInteger(batch.payloadBytes)
    || batch.payloadBytes < 0 || batch.payloadBytes > MAX_BATCH_BYTES) throw new Error('Batch export exceeds delivery limits: ' + batch.id);
  const staging = await mkdtemp(path.join(parent, '.dlc-batch-export-'));
  const originalStaging = await lstat(staging);
  let provider, published = false;
  try {
    provider = await createDlcBatchAssetSource({ repoRoot: root, revision: plan.sourceRevision, parentTmpDir: tmpdir(),
      maxTempBytes: plan.limits.maxTempBytes, maxAssetBytes: plan.limits.maxAssetBytes, allowLfsFetch, verifiedHistoricalLfsMap });
    const assets = [];
    for (const asset of batch.assets) {
      const payload = await provider.materialize(asset.sourcePath, {
        expectedSha256: asset.expectedSha256 ?? undefined, expectedBytes: asset.payloadBytes,
      });
      try {
        await provider.verify(payload);
        if (payload.revision !== plan.sourceRevision || payload.gitBlobOid !== asset.gitBlobOid) {
          throw new Error('Batch export source differs from frozen plan: ' + asset.sourcePath);
        }
        const decode = plan.limits.decode === 'raster'
          ? await decodeDlcBatchAsset({ path: payload.path, sourcePath: asset.sourcePath, maxPixels: plan.limits.maxDecodePixels })
          : { status: 'NOT_APPLICABLE', scope: 'integrity-only; decoding disabled explicitly' };
        const entry = describeAsset({ ...payload, publicPath: asset.publicPath, decode });
        const file = path.join(staging, entry.sourcePath);
        await mkdir(path.dirname(file), { recursive: true });
        await verifyDlcAssetBatchBytes(payload.path, entry, file);
        assets.push(entry);
      } finally { await provider.cleanup([payload]); }
    }
    await provider.close(); provider = null;
    const receipt = { schemaVersion: 1, kind: 'dlc-asset-batch-export', layout: plan.layout, profile: plan.profile,
      sourceRevision: plan.sourceRevision, planSha256: plan.sha256, batchId: batch.id, batchSha256: batch.sha256,
      runnerSha256: plan.runner.implementationSha256, payloadBytes: batch.payloadBytes, assets };
    await writeFile(path.join(staging, DLC_ASSET_BATCH_EXPORT_RECEIPT), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
    const audit = await auditDlcAssetBatchExport({ directory: staging });
    if (!sameDirectory(await lstat(staging), originalStaging)) throw new Error('Batch staging directory changed before publication.');
    // Reserve the final path exclusively so concurrent exports cannot replace one another.
    await mkdir(destination);
    const reserved = await lstat(destination);
    try {
      await rename(staging, destination);
      published = true;
    } finally {
      if (!published) {
        const current = await lstat(destination).catch(() => null);
        if (sameDirectory(current, reserved)) await rmdir(destination);
      }
    }
    return { out: destination, ...audit };
  } finally {
    try { if (provider) await provider.close(); }
    finally {
      if (!published && sameDirectory(await lstat(staging).catch(() => null), originalStaging)) {
        await rm(staging, { recursive: true, force: true });
      }
    }
  }
}

const usage = `Usage: node scripts/exportDlcAssetBatch.mjs --plan PLAN.json --batch ID --out NEW_DIRECTORY [--allow-lfs] [--historical-lfs-map MAP.json]
       node scripts/exportDlcAssetBatch.mjs --check DIRECTORY [--expected-receipt-sha256 SHA256]

Export one canonical media batch at its source paths. This output contains media and a receipt for the batch.`;

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const { values: options } = parseArgs({ options: { plan: { type: 'string' }, batch: { type: 'string' }, out: { type: 'string' },
      'allow-lfs': { type: 'boolean' }, 'historical-lfs-map': { type: 'string' }, check: { type: 'string' },
      'expected-receipt-sha256': { type: 'string' }, help: { type: 'boolean' } } });
    const readJson = file => {
      const absolute = path.resolve(file);
      return JSON.parse(readDistributionFile(assertDistributionDirectory(path.dirname(absolute)), path.basename(absolute)));
    };
    if (options.help) console.log(usage);
    else if (options.check && Object.keys(options).every(key => ['check', 'expected-receipt-sha256'].includes(key))) {
      console.log(JSON.stringify(await auditDlcAssetBatchExport({ directory: options.check,
        expectedReceiptSha256: options['expected-receipt-sha256'] })));
    } else if (options.plan && options.batch && options.out && !options.check && !options['expected-receipt-sha256']) {
      console.log(JSON.stringify(await exportDlcAssetBatch({ plan: readJson(options.plan), batchId: options.batch, out: options.out,
        allowLfsFetch: options['allow-lfs'], verifiedHistoricalLfsMap: options['historical-lfs-map'] ? readJson(options['historical-lfs-map']) : undefined })));
    } else throw new Error(usage);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
