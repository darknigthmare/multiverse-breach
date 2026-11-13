// Run after the four-pipe pass has stopped. Retains its original failed
// receipts and summary, retries only unavailable assets, and records a separate
// aggregate. Uses the exact same frozen plan and verifier as the first pass.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateDlcAssetBatch, validateDlcAssetBatches, verifyDlcAssetBatchPlan } from '../../../../scripts/dlcAssetBatches.mjs';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const here = path.dirname(fileURLToPath(import.meta.url));
const run = path.join(here, 'verified-v2');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const plan = read(path.join(run, 'all-plan.json'));
const firstPass = read(path.join(run, 'run-summary.json'));
if (firstPass.pendingBatches || firstPass.fatalCode || !firstPass.coreLfsCacheUnchanged
    || firstPass.temporaryDirectoriesLeft?.length) throw new Error('First pass must finish cleanly before retry.');
await verifyDlcAssetBatchPlan({ root, plan });
const receipts = plan.batches.map(batch => read(path.join(run, 'all', `batch-${batch.id}.json`)));
const failed = receipts.filter(receipt => receipt.status === 'UNAVAILABLE');
const archive = path.join(run, 'first-pass-failures');
fs.mkdirSync(archive, { recursive: true });
for (const receipt of failed) fs.copyFileSync(
  path.join(run, 'all', `batch-${receipt.batchId}.json`),
  path.join(archive, `batch-${receipt.batchId}.json`), fs.constants.COPYFILE_EXCL);
const history = read(path.join(here, '../historical-lfs/verified-historical-lfs-map.json'));
function cacheInventory() {
  const base = path.join(root, '.git/lfs/objects'), records = [];
  function visit(directory) {
    for (const name of fs.readdirSync(directory)) {
      const file = path.join(directory, name), stat = fs.lstatSync(file);
      if (stat.isDirectory() && !stat.isSymbolicLink()) visit(file);
      else records.push([path.relative(base, file), stat.size, stat.mtimeMs, stat.isSymbolicLink()]);
    }
  }
  visit(base); records.sort((a, b) => a[0].localeCompare(b[0]));
  return { files: records.length, bytes: records.reduce((n, record) => n + record[1], 0),
    sha256: createHash('sha256').update(JSON.stringify(records)).digest('hex') };
}
const cacheBefore = cacheInventory();
const temporaryBefore = new Set(fs.readdirSync('/tmp').filter(name => name.startsWith('multiverse-dlc-batch-')));
const attempts = [], started = Date.now();
for (const old of failed) {
  const next = await validateDlcAssetBatch({ root, plan, batchId: old.batchId,
    receiptDir: path.join(run, 'all'), allowLfsFetch: true, verifiedHistoricalLfsMap: history });
  const preserved = old.assets.filter(asset => asset.status === 'PASSED');
  const passedUnchanged = preserved.every(asset => {
    const found = next.assets.find(item => item.sourcePath === asset.sourcePath);
    return JSON.stringify(found) === JSON.stringify(asset);
  });
  attempts.push({ batchId: old.batchId, beforeReceiptSha256: old.sha256, afterReceiptSha256: next.sha256,
    retriedPaths: old.assets.filter(asset => asset.status !== 'PASSED').map(asset => asset.sourcePath),
    preservedPassedAssets: preserved.length, preservedPassedAssetsUnchanged: passedUnchanged, status: next.status });
  if (!passedUnchanged) throw new Error('Retry changed an already-passed asset.');
}
const resume = await validateDlcAssetBatches({ root, plan, receiptDir: path.join(run, 'all'), maxBatches: 1 });
const finalReceipts = plan.batches.map(batch => read(path.join(run, 'all', `batch-${batch.id}.json`)));
const assets = finalReceipts.flatMap(receipt => receipt.assets), kinds = {}, codes = {};
for (const asset of assets) {
  if (asset.sourceKind) kinds[asset.sourceKind] = (kinds[asset.sourceKind] || 0) + 1;
  if (asset.code) codes[asset.code] = (codes[asset.code] || 0) + 1;
}
const cacheAfter = cacheInventory();
const leftovers = fs.readdirSync('/tmp').filter(name => name.startsWith('multiverse-dlc-batch-') && !temporaryBefore.has(name));
const final = { scope: firstPass.scope, sourceRevision: plan.sourceRevision, planSha256: plan.sha256,
  runnerSha256: plan.runner.implementationSha256, firstPassSummary: 'run-summary.json',
  firstPassFailures: 'first-pass-failures/', retrySeconds: (Date.now() - started) / 1000, attempts, resume,
  batches: finalReceipts.length, passedBatches: resume.passedBatches, unavailableBatches: resume.unavailableBatches,
  pendingBatches: resume.pendingBatches, passedAssets: resume.passedAssets, unavailableAssets: resume.unavailableAssets,
  rasterDecoded: assets.filter(asset => asset.decode?.status === 'PASSED').length,
  integrityOnly: assets.filter(asset => asset.decode?.status === 'NOT_APPLICABLE').length,
  verifiedPayloadBytes: assets.filter(asset => asset.status === 'PASSED').reduce((sum, asset) => sum + asset.bytes, 0),
  sourceKinds: kinds, unavailableCodes: codes, coreLfsCacheBefore: cacheBefore, coreLfsCacheAfter: cacheAfter,
  coreLfsCacheUnchanged: cacheBefore.sha256 === cacheAfter.sha256 && cacheAfter.sha256 === firstPass.coreLfsCacheAfter.sha256,
  temporaryDirectoriesLeft: leftovers };
fs.writeFileSync(path.join(run, 'final-summary.json'), JSON.stringify(final, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(final));
if (final.pendingBatches || final.unavailableAssets || !final.coreLfsCacheUnchanged || leftovers.length) process.exitCode = 1;
