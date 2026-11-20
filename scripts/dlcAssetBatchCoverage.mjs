import { createHash } from 'node:crypto';
import { projectAssetPath } from './dlcAssetPaths.mjs';

const HASH = /^[a-f0-9]{64}$/;
const GIT_OID = /^[a-f0-9]{40}$/;
const matches = (value, pattern) => typeof value === 'string' && pattern.test(value);
const count = value => Number.isSafeInteger(value) && value >= 0;
// Published v1 plan seals sort object keys while preserving list order.
const canonical = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const seal = body => createHash('sha256').update(canonical(body)).digest('hex');

/** Match installed receipts to the original trusted plan without consulting Git or the media cache. */
export function inspectDlcAssetBatchCoverage({ plan, expectedPlanSha256, state, batchEntries }) {
  if (!matches(expectedPlanSha256, HASH)) throw new Error('The original batch plan SHA-256 is required.');
  const { sha256, ...body } = plan ?? {};
  if (sha256 !== expectedPlanSha256 || seal(body) !== expectedPlanSha256) throw new Error('Batch plan differs from the pinned plan hash.');
  if (plan.schemaVersion !== 1 || plan.kind !== 'dlc-asset-batch-plan' || plan.layout !== 'sources'
    || plan.sourceRevision !== state.sourceRevision || plan.runner?.implementationSha256 !== state.runnerSha256
    || canonical(plan.profile) !== canonical(state.profile) || !Array.isArray(plan.batches)) {
    throw new Error('Batch plan differs from the assembly identity.');
  }

  const batches = new Map();
  const sourcePaths = new Set();
  const publicPaths = new Set();
  const nativeGitOids = new Map();
  let payloadBytes = 0, unavailableAssets = 0;
  for (const [index, batch] of plan.batches.entries()) {
    if (batch?.id !== String(index).padStart(5, '0') || !matches(batch.sha256, HASH)
      || !Array.isArray(batch.assets) || batch.assets.length < 1 || batch.assets.length > 40) throw new Error('Invalid planned batch.');
    batches.set(batch.id, batch);
    let batchBytes = 0, hasUnavailableAsset = false;
    for (const asset of batch.assets) {
      const projected = projectAssetPath(asset?.sourcePath);
      if (!projected || projected.publicPath !== asset.publicPath || sourcePaths.has(asset.sourcePath) || publicPaths.has(asset.publicPath)) {
        throw new Error('Invalid or duplicate planned media: ' + batch.id);
      }
      sourcePaths.add(asset.sourcePath);
      publicPaths.add(asset.publicPath);
      if (asset.contentKind === 'unavailable' && asset.payloadBytes === null) {
        unavailableAssets++;
        hasUnavailableAsset = true;
        continue;
      }
      if (!count(asset.payloadBytes) || !matches(asset.gitBlobOid, GIT_OID)) throw new Error('Invalid planned payload identity: ' + asset.sourcePath);
      if (asset.contentKind === 'git-blob' && asset.expectedSha256 === null) nativeGitOids.set(asset.sourcePath, asset.gitBlobOid);
      else if (asset.contentKind !== 'lfs-payload' || !matches(asset.expectedSha256, HASH)) throw new Error('Invalid planned payload identity: ' + asset.sourcePath);
      batchBytes += asset.payloadBytes;
    }
    if (batch.payloadBytes !== (hasUnavailableAsset ? null : batchBytes)) throw new Error('Invalid planned batch byte total: ' + batch.id);
    payloadBytes += batchBytes;
  }
  if (sourcePaths.size !== plan.assetCount || payloadBytes !== plan.payloadBytes || unavailableAssets !== plan.unknownPayloadAssets) {
    throw new Error('Invalid planned media totals.');
  }

  for (const [id, { receipt }] of batchEntries) {
    const batch = batches.get(id);
    if (!batch || receipt.batchSha256 !== batch.sha256 || receipt.assets.length !== batch.assets.length) {
      throw new Error('Assembly receipt differs from planned batch: ' + id);
    }
    for (const [index, asset] of receipt.assets.entries()) {
      const expected = batch.assets[index];
      if (asset.sourcePath !== expected.sourcePath || asset.publicPath !== expected.publicPath || asset.gitBlobOid !== expected.gitBlobOid
        || asset.bytes !== expected.payloadBytes || (expected.expectedSha256 && asset.sha256 !== expected.expectedSha256)) {
        throw new Error('Assembly receipt differs from planned media: ' + expected.sourcePath);
      }
    }
  }
  const missingBatchIds = [...batches.keys()].filter(id => !batchEntries.has(id));
  return { nativeGitOids, coverage: { plannedBatches: batches.size, plannedAssets: sourcePaths.size, plannedPayloadBytes: payloadBytes,
    unavailableAssets, missingBatchIds, mediaPlanComplete: missingBatchIds.length === 0 && unavailableAssets === 0
      && [...batchEntries.values()].every(batch => batch.done) } };
}
