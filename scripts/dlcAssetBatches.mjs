import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { constants, existsSync, lstatSync, mkdirSync, mkdtempSync, openSync, closeSync, readFileSync, readdirSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildDlcDistributionPlan, readDlcDistributionManifests, resolveDlcSelection } from './dlcDistribution.mjs';
import { assertDistributionDirectory, readDistributionFile, safeDistributionPath } from './dlcDistributionFilesystem.mjs';
import { createDlcBatchAssetSource, inspectDlcBatchAssetSources } from './dlcBatchAssetSource.mjs';
import { decodeDlcBatchAsset } from './dlcAssetBatchDecode.mjs';

export const DLC_BATCH_MIB = 1024 * 1024;
const VERSION = 'dlc-asset-batches-v1';
const REVISION = /^[a-f0-9]{40}$/;
const HASH = /^[a-f0-9]{64}$/;
const ownFile = fileURLToPath(import.meta.url);
const canonicalPlans = new WeakMap();
const runnerGitMatches = new Map();
const digest = value => createHash('sha256').update(value).digest('hex');
const canonical = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const sealed = value => ({ ...value, sha256: digest(canonical(value)) });
const checkedSealed = value => {
  const { sha256, ...body } = value || {};
  if (!HASH.test(sha256 || '') || digest(canonical(body)) !== sha256) throw new Error('Batch manifest or receipt integrity differs.');
  return body;
};
const git = (root, args, maxBuffer = 100 * DLC_BATCH_MIB) => execFileSync('git', ['-C', root, ...args], {
  maxBuffer, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_NO_LAZY_FETCH: '1', GIT_LFS_SKIP_SMUDGE: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
});
function codeIdentity(root, gitHeadAtPlanCreation) {
  gitHeadAtPlanCreation ||= git(root, ['rev-parse', 'HEAD']).toString().trim();
  const files = ['dlcAssetBatches.mjs', 'dlcBatchAssetSource.mjs', 'dlcAssetBatchDecode.mjs', 'dlcDistribution.mjs',
    'dlcDistributionFilesystem.mjs', 'dlcAssetPaths.mjs', 'dlcCommonUiAssets.mjs', 'dlcSharedAssetDependencies.mjs'].map(name => {
    const file = 'scripts/' + name;
    const sha256 = digest(readFileSync(path.join(path.dirname(ownFile), name)));
    const key = root + ':' + gitHeadAtPlanCreation + ':' + file + ':' + sha256;
    if (!runnerGitMatches.has(key)) {
      let matches = false;
      try { matches = digest(git(root, ['show', gitHeadAtPlanCreation + ':' + file])) === sha256; } catch { /* An uncommitted runner has no frozen Git blob. */ }
      runnerGitMatches.set(key, matches);
    }
    const matchesGitHead = runnerGitMatches.get(key);
    return { path: file, sha256, matchesGitHead };
  });
  return { version: VERSION, gitHeadAtPlanCreation, actualRunnerFileSha256: files[0].sha256,
    implementationSha256: digest(canonical(files)), files,
    workingTreeVersion: files.every(file => file.matchesGitHead) ? 'matches-recorded-git-head' : 'actual-files-differ-from-recorded-git-head' };
}

function limitsOf(value = {}) {
  const limits = { maxAssets: 40, maxBatchBytes: 128 * DLC_BATCH_MIB, maxAssetBytes: 128 * DLC_BATCH_MIB,
    maxTempBytes: 512 * DLC_BATCH_MIB, maxDecodePixels: 33554432, decode: 'raster', ...value };
  if (Object.keys(limits).some(key => !['maxAssets', 'maxBatchBytes', 'maxAssetBytes', 'maxTempBytes', 'maxDecodePixels', 'decode'].includes(key))
    || !Number.isSafeInteger(limits.maxAssets) || limits.maxAssets < 1 || limits.maxAssets > 40
    || !Number.isSafeInteger(limits.maxBatchBytes) || limits.maxBatchBytes < 1 || limits.maxBatchBytes > 256 * DLC_BATCH_MIB
    || !Number.isSafeInteger(limits.maxAssetBytes) || limits.maxAssetBytes < 1 || limits.maxAssetBytes > 256 * DLC_BATCH_MIB
    || !Number.isSafeInteger(limits.maxTempBytes) || limits.maxTempBytes < 1 || limits.maxTempBytes > 512 * DLC_BATCH_MIB
    || !Number.isSafeInteger(limits.maxDecodePixels) || limits.maxDecodePixels < 1 || !['raster', 'none'].includes(limits.decode)) {
    throw new Error('Invalid batch limits: at most 40 assets, 256 MiB per asset/batch and 512 MiB temporary storage.');
  }
  return limits;
}

function metadataSnapshot(root, revision, profile) {
  if (!REVISION.test(revision || '') || git(root, ['rev-parse', '--verify', revision + '^{commit}']).toString().trim() !== revision) throw new Error('A complete frozen source commit is required.');
  const rows = git(root, ['ls-tree', '-rz', '--long', revision, '--', 'DLC', 'src', 'index.html']).toString().split('\0').filter(Boolean);
  const files = rows.map(row => { const separator = row.indexOf('\t'); const [mode, type, oid, size] = row.slice(0, separator).trim().split(/\s+/); return { path: row.slice(separator + 1), mode, type, oid, bytes: Number(size) }; })
    .filter(file => /^(?:DLC\/(?:index\.js|shared-assets\.json|shared-asset-dependencies\.json)|DLC\/[^/]+\/(?:manifest|assets)\.json|index\.html)$/.test(file.path)
      || /^(?:src\/components\/.*\.(?:[cm]?js|jsx|tsx?|css)|src\/App\.(?:[cm]?js|jsx|tsx?)|src\/[^/]+\.css)$/.test(file.path)
      || (profile.sharedPolicy === 'reviewed-dependencies' && /^(?:src\/.*\.(?:[cm]?js|jsx|tsx?|json|css)|DLC\/[^/]+\/(?:data|runtime)\/.*\.(?:[cm]?js|jsx|tsx?|json|css))$/.test(file.path)))
    .sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  if (files.some(file => file.type !== 'blob' || file.mode === '120000') || files.reduce((sum, file) => sum + file.bytes, 0) > 100 * DLC_BATCH_MIB) throw new Error('Frozen metadata snapshot exceeds its 100 MiB regular-file boundary.');
  const directory = mkdtempSync(path.join(tmpdir(), 'dlc-batch-metadata-'));
  const inventory = [];
  try {
    for (const file of files) {
      safeDistributionPath(file.path);
      const bytes = git(root, ['show', revision + ':' + file.path]);
      if (bytes.length !== file.bytes) throw new Error('Frozen metadata length changed.');
      mkdirSync(path.dirname(path.join(directory, file.path)), { recursive: true });
      writeFileSync(path.join(directory, file.path), bytes, { flag: 'wx' });
      inventory.push({ path: file.path, gitBlobOid: file.oid, bytes: bytes.length, sha256: digest(bytes) });
    }
    const selection = resolveDlcSelection({ manifests: readDlcDistributionManifests({ root: directory }), profile });
    const plan = buildDlcDistributionPlan({ root: directory, selection });
    return { assets: plan.assets, profile: { schemaVersion: 1, mode: selection.mode,
      packIds: selection.mode === 'selected' ? selection.packIds : [], sharedPolicy: selection.sharedPolicy }, inventory };
  } finally {
    const owned = new Set(inventory.map(file => file.path));
    const directories = new Set(['']);
    for (const file of owned) { let parent = path.posix.dirname(file); while (parent !== '.') { directories.add(parent); parent = path.posix.dirname(parent); } }
    const inspect = relative => {
      for (const entry of readdirSync(path.join(directory, relative), { withFileTypes: true })) {
        const file = relative ? relative + '/' + entry.name : entry.name;
        if (entry.isSymbolicLink() || (entry.isDirectory() ? !directories.has(file) : !entry.isFile() || !owned.has(file))) throw new Error('Frozen metadata snapshot contains unowned files; no cleanup performed.');
        if (entry.isDirectory()) inspect(file);
      }
    };
    inspect(''); rmSync(directory, { recursive: true, force: true });
  }
}

/** Metadata only: asset payloads remain in Git/LFS and are never exported here. */
export async function createDlcAssetBatchPlan({ root = process.cwd(), revision, profile, limits, gitHeadAtPlanCreation } = {}) {
  root = assertDistributionDirectory(root);
  limits = limitsOf(limits);
  const runner = codeIdentity(root, gitHeadAtPlanCreation);
  if (!REVISION.test(runner.gitHeadAtPlanCreation)) throw new Error('Invalid recorded Git head.');
  const snapshot = metadataSnapshot(root, revision, profile);
  const inspected = await inspectDlcBatchAssetSources({ repoRoot: root, revision, sourcePaths: snapshot.assets.map(asset => asset.sourcePath) });
  if (inspected.revision !== revision) throw new Error('Source provider returned a different frozen commit.');
  const metadata = new Map(inspected.assets.map(asset => [asset.sourcePath, asset]));
  const assets = snapshot.assets.map(asset => {
    const info = metadata.get(asset.sourcePath);
    if (!info || info.revision !== revision) throw new Error('Invalid frozen asset metadata: ' + asset.sourcePath);
    if (info.status === 'unavailable') return { ...asset, gitBlobOid: null, gitBlobBytes: null, payloadBytes: null,
      expectedSha256: null, lfsPayloadOid: null, contentKind: 'unavailable', unavailableCode: /^[A-Z0-9_]+$/.test(info.code || '') ? info.code : 'ASSET_METADATA_UNAVAILABLE' };
    if (!Number.isSafeInteger(info.payloadBytes) || info.payloadBytes < 0) throw new Error('Invalid frozen asset metadata: ' + asset.sourcePath);
    return { ...asset, gitBlobOid: info.gitBlobOid, gitBlobBytes: info.gitBlobBytes, payloadBytes: info.payloadBytes,
      expectedSha256: info.expectedSha256, lfsPayloadOid: info.lfsPayloadOid, contentKind: info.contentKind };
  });
  const batches = [];
  let current = [], bytes = 0;
  const flush = () => {
    if (!current.length) return;
    const value = { id: String(batches.length).padStart(5, '0'), assets: current, payloadBytes: bytes,
      oversized: bytes > limits.maxBatchBytes, exceedsAssetLimit: current.some(asset => asset.payloadBytes > limits.maxAssetBytes),
      stagedByteUpperBound: current.reduce((sum, asset) => sum + (asset.payloadBytes !== null && asset.payloadBytes <= limits.maxAssetBytes ? asset.payloadBytes : 0), 0) };
    batches.push(sealed(value)); current = []; bytes = 0;
  };
  for (const asset of assets) {
    if (asset.unavailableCode) { flush(); current = [asset]; bytes = null; flush(); continue; }
    if (asset.payloadBytes > limits.maxBatchBytes) { flush(); current = [asset]; bytes = asset.payloadBytes; flush(); continue; }
    if (current.length && (current.length >= limits.maxAssets || bytes + asset.payloadBytes > limits.maxBatchBytes)) flush();
    current.push(asset); bytes += asset.payloadBytes;
  }
  flush();
  const plan = sealed({ schemaVersion: 1, kind: 'dlc-asset-batch-plan', sourceRevision: revision, runner,
    profile: snapshot.profile, layout: 'sources', limits, inventory: snapshot.inventory,
    assetCount: assets.length, payloadBytes: assets.reduce((sum, asset) => sum + (asset.payloadBytes ?? 0), 0), unknownPayloadAssets: assets.filter(asset => asset.payloadBytes === null).length, batches });
  canonicalPlans.set(plan, root + ':' + plan.sha256 + ':' + runner.implementationSha256);
  return plan;
}

export async function verifyDlcAssetBatchPlan({ root = process.cwd(), plan } = {}) {
  root = assertDistributionDirectory(root);
  checkedSealed(plan);
  if (plan?.kind !== 'dlc-asset-batch-plan' || plan.layout !== 'sources' || plan.schemaVersion !== 1) throw new Error('Unsupported asset batch plan.');
  const actualCode = codeIdentity(root, plan.runner?.gitHeadAtPlanCreation).implementationSha256;
  if (actualCode !== plan.runner?.implementationSha256) throw new Error('Actual runner files changed since the batch plan was created.');
  const key = root + ':' + plan.sha256 + ':' + actualCode;
  if (canonicalPlans.get(plan) === key) return plan;
  const actual = await createDlcAssetBatchPlan({ root, revision: plan.sourceRevision, profile: plan.profile,
    limits: plan.limits, gitHeadAtPlanCreation: plan.runner?.gitHeadAtPlanCreation });
  if (canonical(actual) !== canonical(plan)) throw new Error('Batch plan differs from frozen Git metadata, options or runner code.');
  canonicalPlans.set(plan, key); return plan;
}

function ensureState(directory, plan) {
  if (typeof directory !== 'string' || !directory) throw new Error('An explicit owned receipt directory is required.');
  const parent = path.dirname(path.resolve(directory));
  assertDistributionDirectory(parent);
  if (!existsSync(directory)) mkdirSync(directory);
  assertDistributionDirectory(directory);
  const marker = path.join(directory, 'state.json');
  if (!existsSync(marker)) {
    if (readdirSync(directory).length) throw new Error('Receipt directory contains unowned user files.');
    writeFileSync(marker, JSON.stringify(sealed({ schemaVersion: 1, kind: 'dlc-asset-batch-state', planSha256: plan.sha256, owner: randomUUID() })) + '\n', { flag: 'wx' });
  }
  const state = JSON.parse(readDistributionFile(directory, 'state.json'));
  checkedSealed(state);
  if (state.kind !== 'dlc-asset-batch-state' || state.planSha256 !== plan.sha256 || typeof state.owner !== 'string') throw new Error('Receipt state belongs to a different plan or options.');
  const ids = new Set(plan.batches.map(batch => batch.id));
  for (const file of readdirSync(directory)) {
    const id = file.match(/^(?:batch-|\.batch-)(\d{5})(?:\.json|\.lock)$/)?.[1];
    if (file !== 'state.json' && !(id && ids.has(id)) && !file.startsWith('.receipt-' + state.owner + '-')) throw new Error('Receipt directory contains unowned user files.');
    if (!lstatSync(path.join(directory, file)).isFile() || lstatSync(path.join(directory, file)).isSymbolicLink()) throw new Error('Receipt state must contain regular owned files only.');
  }
  return state;
}

function readReceipt(directory, batch, plan) {
  const file = path.join(directory, 'batch-' + batch.id + '.json');
  if (!existsSync(file)) return null;
  const receipt = JSON.parse(readDistributionFile(directory, path.basename(file)));
  checkedSealed(receipt);
  if (receipt.kind !== 'dlc-asset-batch-receipt' || receipt.planSha256 !== plan.sha256 || receipt.batchSha256 !== batch.sha256
    || receipt.sourceRevision !== plan.sourceRevision || receipt.runnerSha256 !== plan.runner.implementationSha256
    || receipt.layout !== plan.layout || canonical(receipt.profile) !== canonical(plan.profile)
    || !['PASSED', 'UNAVAILABLE'].includes(receipt.status) || receipt.assets.length !== batch.assets.length) throw new Error('Batch receipt does not match its frozen plan.');
  receipt.assets.forEach((asset, index) => {
    const expected = batch.assets[index];
    if (asset.sourcePath !== expected.sourcePath || asset.gitBlobOid !== expected.gitBlobOid || asset.expectedBytes !== expected.payloadBytes
      || !['PASSED', 'UNAVAILABLE'].includes(asset.status) || (asset.status === 'PASSED' && (!HASH.test(asset.sha256 || '') || asset.bytes !== expected.payloadBytes
        || (expected.expectedSha256 && asset.sha256 !== expected.expectedSha256)))) throw new Error('Batch receipt asset differs from its canonical plan.');
  });
  if ((receipt.status === 'PASSED') !== receipt.assets.every(asset => asset.status === 'PASSED')) throw new Error('Batch receipt status differs from its asset results.');
  return receipt;
}

function lockBatch(directory, batch, state) {
  const file = path.join(directory, '.batch-' + batch.id + '.lock');
  if (existsSync(file)) {
    const previous = JSON.parse(readDistributionFile(directory, path.basename(file)));
    if (previous.owner !== state.owner || previous.kind !== 'dlc-asset-batch-lock' || !Number.isSafeInteger(previous.pid)) throw new Error('Unowned batch lock; no cleanup performed.');
    let alive = true;
    try { process.kill(previous.pid, 0); } catch (error) { if (error.code === 'ESRCH') alive = false; else throw error; }
    if (alive) throw new Error('Batch is already being validated.');
    unlinkSync(file);
  }
  const lock = JSON.stringify({ kind: 'dlc-asset-batch-lock', owner: state.owner, pid: process.pid, nonce: randomUUID() });
  writeFileSync(file, lock, { flag: 'wx' });
  return () => { if (readFileSync(file, 'utf8') !== lock) throw new Error('Batch lock changed; no cleanup performed.'); unlinkSync(file); };
}

function atomicReceipt(directory, batch, receipt, state) {
  const temporary = path.join(directory, '.receipt-' + state.owner + '-' + randomUUID());
  const descriptor = openSync(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
  try { writeFileSync(descriptor, JSON.stringify(receipt) + '\n'); } finally { closeSync(descriptor); }
  try { renameSync(temporary, path.join(directory, 'batch-' + batch.id + '.json')); }
  finally { if (existsSync(temporary)) unlinkSync(temporary); }
}

/** Validate one bounded lot, then discard every verified temporary payload. */
export async function validateDlcAssetBatch({ root = process.cwd(), plan, batchId, receiptDir, allowLfsFetch = false,
  verifiedHistoricalLfsMap } = {}) {
  await verifyDlcAssetBatchPlan({ root, plan });
  const batch = plan.batches.find(batch => batch.id === String(batchId).padStart(5, '0'));
  if (!batch) throw new Error('Unknown asset batch ID.');
  checkedSealed(batch);
  const state = ensureState(receiptDir, plan);
  const release = lockBatch(receiptDir, batch, state);
  let provider;
  try {
    const previous = readReceipt(receiptDir, batch, plan);
    if (previous?.status === 'PASSED') return { ...previous, reused: true };
    provider = await createDlcBatchAssetSource({ repoRoot: root, revision: plan.sourceRevision, parentTmpDir: tmpdir(),
      maxTempBytes: plan.limits.maxTempBytes, maxAssetBytes: plan.limits.maxAssetBytes, allowLfsFetch, verifiedHistoricalLfsMap });
    const results = [];
    for (const [index, asset] of batch.assets.entries()) {
      if (previous?.assets[index]?.status === 'PASSED') { results.push(previous.assets[index]); continue; }
      let payload;
      const item = { sourcePath: asset.sourcePath, publicPath: asset.publicPath, gitBlobOid: asset.gitBlobOid, expectedBytes: asset.payloadBytes };
      try {
        if (asset.unavailableCode) throw Object.assign(new Error('Canonical asset metadata is unavailable.'), { code: asset.unavailableCode });
        if (asset.payloadBytes > plan.limits.maxAssetBytes) throw Object.assign(new Error('Asset exceeds explicit per-asset limit.'), { code: 'MAX_ASSET_BYTES_EXCEEDED' });
        payload = await provider.materialize(asset.sourcePath, { expectedSha256: asset.expectedSha256 || undefined, expectedBytes: asset.payloadBytes });
        await provider.verify(payload);
        if (payload.revision !== plan.sourceRevision || payload.gitBlobOid !== asset.gitBlobOid || payload.bytes !== asset.payloadBytes
          || !HASH.test(payload.sha256 || '') || (asset.expectedSha256 && payload.sha256 !== asset.expectedSha256)) throw Object.assign(new Error('Materialized payload differs from frozen plan.'), { code: 'PAYLOAD_PLAN_MISMATCH' });
        const decoded = plan.limits.decode === 'raster' ? await decodeDlcBatchAsset({ path: payload.path, sourcePath: asset.sourcePath, maxPixels: plan.limits.maxDecodePixels })
          : { status: 'NOT_APPLICABLE', scope: 'integrity-only; decoding disabled explicitly' };
        results.push({ ...item, status: 'PASSED', bytes: payload.bytes, sha256: payload.sha256, sourceKind: payload.sourceKind, decode: decoded });
      } catch (error) {
        if (['OWNER_GUARD_FAILED', 'FOREIGN_RECEIPT', 'OUTPUT_CHANGED'].includes(error.code)) throw error;
        results.push({ ...item, status: 'UNAVAILABLE', code: /^[A-Z0-9_]+$/.test(error.code || '') ? error.code : 'ASSET_VALIDATION_FAILED' });
      } finally { if (payload) await provider.cleanup([payload]); }
    }
    await provider.close(); provider = null;
    ensureState(receiptDir, plan);
    const receipt = sealed({ schemaVersion: 1, kind: 'dlc-asset-batch-receipt', scope: 'Canonical payload integrity and optional raster decoding; no production deployment or artwork fidelity approval.',
      planSha256: plan.sha256, batchSha256: batch.sha256, sourceRevision: plan.sourceRevision, runnerSha256: plan.runner.implementationSha256,
      profile: plan.profile, layout: plan.layout, batchId: batch.id, status: results.every(asset => asset.status === 'PASSED') ? 'PASSED' : 'UNAVAILABLE', assets: results });
    atomicReceipt(receiptDir, batch, receipt, state); return receipt;
  } finally { try { if (provider) await provider.close(); } finally { release(); } }
}

export async function validateDlcAssetBatches({ root = process.cwd(), plan, receiptDir, maxBatches = Infinity, retryUnavailable = false, ...options } = {}) {
  if (maxBatches !== Infinity && (!Number.isSafeInteger(maxBatches) || maxBatches < 1)) throw new Error('maxBatches must be a positive integer.');
  await verifyDlcAssetBatchPlan({ root, plan });
  ensureState(receiptDir, plan);
  let attempted = 0;
  for (const batch of plan.batches) {
    const previous = readReceipt(receiptDir, batch, plan);
    if (previous?.status === 'PASSED' || (previous && !retryUnavailable)) continue;
    if (attempted >= maxBatches) break;
    await validateDlcAssetBatch({ ...options, root, plan, receiptDir, batchId: batch.id }); attempted++;
  }
  const receipts = plan.batches.map(batch => readReceipt(receiptDir, batch, plan)).filter(Boolean);
  return { scope: 'Batch validation only; not production readiness.', planSha256: plan.sha256, attemptedBatches: attempted,
    passedBatches: receipts.filter(receipt => receipt.status === 'PASSED').length,
    unavailableBatches: receipts.filter(receipt => receipt.status === 'UNAVAILABLE').length,
    pendingBatches: plan.batches.length - receipts.length,
    passedAssets: receipts.flatMap(receipt => receipt.assets).filter(asset => asset.status === 'PASSED').length,
    unavailableAssets: receipts.flatMap(receipt => receipt.assets).filter(asset => asset.status === 'UNAVAILABLE').length };
}

const usage = 'Usage: dlcAssetBatches.mjs plan --revision SHA --profile all|base|PACK[,PACK]|FILE.json --out NEW_PLAN.json [--max-assets 40] [--max-batch-mib 128] [--max-asset-mib 128]\n       dlcAssetBatches.mjs validate --plan PLAN.json --receipts OWNED_DIRECTORY [--batch ID|all] [--max-batches N] [--retry-unavailable] [--allow-lfs]';
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const [command, ...args] = process.argv.slice(2);
    if (['--help', '-h'].includes(command)) { console.log(usage); }
    else {
      const flags = {};
      const allowed = new Set(command === 'plan' ? ['--revision', '--profile', '--out', '--max-assets', '--max-batch-mib', '--max-asset-mib', '--max-temp-mib', '--decode']
        : ['--plan', '--receipts', '--batch', '--max-batches', '--retry-unavailable', '--allow-lfs', '--historical-lfs-map']);
      for (let index = 0; index < args.length; index++) {
        const key = args[index];
        if (!allowed.has(key) || Object.hasOwn(flags, key)) throw new Error('Unknown or duplicate batch option.');
        flags[key] = ['--allow-lfs', '--retry-unavailable'].includes(key) ? true : args[++index];
        if (flags[key] === undefined || flags[key] === '' || (typeof flags[key] === 'string' && flags[key].startsWith('--'))) throw new Error('Missing batch option value.');
      }
      if (command === 'plan') {
        const selected = flags['--profile'];
        if (!selected || !flags['--out'] || !flags['--revision']) throw new Error(usage);
        const profile = selected.endsWith('.json') ? JSON.parse(readFileSync(selected, 'utf8'))
          : { schemaVersion: 1, mode: ['all', 'base'].includes(selected) ? selected : 'selected', packIds: ['all', 'base'].includes(selected) ? [] : selected.split(','), sharedPolicy: 'preserve-all' };
        const plan = await createDlcAssetBatchPlan({ revision: flags['--revision'], profile, limits: {
          maxAssets: Number(flags['--max-assets'] || 40), maxBatchBytes: Number(flags['--max-batch-mib'] || 128) * DLC_BATCH_MIB,
          maxAssetBytes: Number(flags['--max-asset-mib'] || 128) * DLC_BATCH_MIB,
          maxTempBytes: Number(flags['--max-temp-mib'] || 512) * DLC_BATCH_MIB, decode: flags['--decode'] || 'raster' } });
        writeFileSync(flags['--out'], JSON.stringify(plan) + '\n', { flag: 'wx' });
        console.log(JSON.stringify({ planSha256: plan.sha256, batches: plan.batches.length, assets: plan.assetCount, payloadBytes: plan.payloadBytes, sourceRevision: plan.sourceRevision }));
      } else if (command === 'validate') {
        if (!flags['--plan'] || !flags['--receipts']) throw new Error(usage);
        const plan = JSON.parse(readFileSync(flags['--plan'], 'utf8'));
        const options = { plan, receiptDir: flags['--receipts'], allowLfsFetch: Boolean(flags['--allow-lfs']),
          verifiedHistoricalLfsMap: flags['--historical-lfs-map'] ? JSON.parse(readFileSync(flags['--historical-lfs-map'], 'utf8')) : undefined };
        const result = flags['--batch'] && flags['--batch'] !== 'all' ? await validateDlcAssetBatch({ ...options, batchId: flags['--batch'] })
          : await validateDlcAssetBatches({ ...options, maxBatches: flags['--max-batches'] ? Number(flags['--max-batches']) : Infinity, retryUnavailable: Boolean(flags['--retry-unavailable']) });
        console.log(JSON.stringify(result));
      } else throw new Error(usage);
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
