import { createHash } from 'node:crypto';
import { closeSync, lstatSync, openSync, readFileSync, readSync, statfsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { buildDlcDistributionPlan, readDlcDistributionManifests, resolveDlcSelection } from './dlcDistribution.mjs';
import { inspectDistributionPath } from './dlcDistributionFilesystem.mjs';

const RESERVE = 256 * 1024 * 1024;
const OPERATIONS = ['canonical-hydration', 'source-cache', 'export', 'export-build'];
const sum = (items, key) => items.reduce((total, item) => total + (item[key] ?? 0), 0);
const blocks = bytes => Math.ceil(bytes / 4096) * 4096;
const integer = (value, name) => {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isSafeInteger(number) || number < 0) throw new Error(name + ' must be a nonnegative safe integer.');
  return number;
};

function git(root, args, input) {
  const result = spawnSync('git', args, {
    cwd: root, input, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' }
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Local Git inspection failed: git ' + args[0]);
  return result.stdout;
}

function pointer(bytes) {
  const text = bytes.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!/^version https:\/\/git-lfs\.github\.com\/spec\/v1(?:\n|$)/.test(text)) return null;
  const oid = text.match(/^oid sha256:([a-f0-9]{64})$/m)?.[1];
  const size = text.match(/^size (\d+)$/m)?.[1];
  if (!oid || size === undefined || !Number.isSafeInteger(Number(size))) return { malformed: true };
  return { oid, bytes: Number(size) };
}

function prefix(file, length = 1024) {
  const fd = openSync(file, 'r');
  try {
    const buffer = Buffer.alloc(length);
    return buffer.subarray(0, readSync(fd, buffer, 0, length, 0));
  } finally { closeSync(fd); }
}

function sha256(file) {
  const hash = createHash('sha256'), buffer = Buffer.alloc(1024 * 1024);
  const fd = openSync(file, 'r');
  try {
    let count;
    while ((count = readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, count));
    return hash.digest('hex');
  } finally { closeSync(fd); }
}

function localSource(root, relative) {
  try {
    const file = inspectDistributionPath(root, relative, { optional: true });
    if (!file) return { state: 'absent', materialized: false };
    const stat = lstatSync(file), lfs = pointer(prefix(file));
    return { state: lfs ? 'lfs-pointer' : 'regular-file', materialized: !lfs,
      bytes: stat.size, lfs, file };
  } catch (error) {
    return { state: 'unsafe-path', materialized: false, error: error.message };
  }
}

function localGit(root, assets) {
  // A standalone export must not accidentally borrow a containing repository.
  let top;
  try { top = git(root, ['rev-parse', '--show-toplevel']).trim(); } catch { return null; }
  if (path.resolve(top) !== root) return null;
  const index = new Map();
  const indexText = git(root, ['ls-files', '--stage', '-z']);
  for (const record of indexText.split('\0').filter(Boolean)) {
    const tab = record.indexOf('\t'), [mode, oid, stage] = record.slice(0, tab).split(' ');
    if (stage === '0') index.set(record.slice(tab + 1), { mode, oid });
  }
  const oids = [...new Set(assets.map(asset => index.get(asset.sourcePath)?.oid).filter(Boolean))].sort();
  const objects = new Map();
  if (oids.length) {
    for (const line of git(root, ['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], oids.join('\n') + '\n').trimEnd().split('\n')) {
      const [oid, kind, bytes] = line.split(' ');
      objects.set(oid, kind === 'blob' ? { kind, bytes: integer(bytes, 'Git blob size') } : { kind: 'unavailable' });
    }
    const small = oids.filter(oid => objects.get(oid)?.bytes <= 1024);
    if (small.length) {
      // Buffer encoding preserves arbitrary binary small blobs while decoding pointers only.
      const result = spawnSync('git', ['cat-file', '--batch'], {
        cwd: root, input: small.join('\n') + '\n', maxBuffer: 16 * 1024 * 1024,
        env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' }
      });
      if (result.error || result.status !== 0) throw new Error('Local Git small-blob inspection failed.');
      let offset = 0;
      for (const oid of small) {
        const end = result.stdout.indexOf(10, offset), header = result.stdout.subarray(offset, end).toString().split(' ');
        const length = integer(header[2], 'Git small-blob size');
        objects.get(oid).lfs = pointer(result.stdout.subarray(end + 1, end + 1 + length));
        offset = end + length + 2;
      }
    }
  }
  let head = null;
  try { head = git(root, ['rev-parse', '--verify', 'HEAD']).trim(); } catch { /* An unborn fixture still has a usable index. */ }
  return { index, objects, head, indexSha256: createHash('sha256').update(indexText).digest('hex'),
    cacheRoot: path.resolve(root, git(root, ['rev-parse', '--git-path', 'lfs/objects']).trim()) };
}

function cachedPayload(cacheRoot, lfs, checked) {
  if (!cacheRoot || !lfs?.oid) return { state: 'unavailable' };
  const cacheKey = `${lfs.oid}:${lfs.bytes}`;
  if (checked.has(cacheKey)) return checked.get(cacheKey);
  let result;
  try {
    const relative = `${lfs.oid.slice(0, 2)}/${lfs.oid.slice(2, 4)}/${lfs.oid}`;
    const file = inspectDistributionPath(cacheRoot, relative, { optional: true });
    if (!file) result = { state: 'absent' };
    else if (lstatSync(file).size !== lfs.bytes) result = { state: 'invalid-size' };
    else result = { state: sha256(file) === lfs.oid ? 'verified-sha256' : 'invalid-sha256' };
  } catch (error) { result = { state: 'unsafe-or-unavailable', error: error.message }; }
  checked.set(cacheKey, result);
  return result;
}

function volume(directory) {
  const fs = statfsSync(directory);
  return { root: directory, availableBytes: Number(fs.bavail) * Number(fs.bsize), blockSize: Number(fs.bsize) };
}

/** Read-only preflight. Only an explicitly requested CLI JSON report is written. */
export function auditDlcMaterialization({ root = process.cwd(), profile = { schemaVersion: 1, mode: 'all', packIds: [], sharedPolicy: 'preserve-all' },
  storageRoot = root, operation = 'canonical-hydration', reserveBytes = RESERVE, extraBytes = null, lfsCache } = {}) {
  root = path.resolve(root); storageRoot = path.resolve(storageRoot);
  reserveBytes = integer(reserveBytes, 'reserveBytes');
  if (extraBytes !== null) extraBytes = integer(extraBytes, 'extraBytes');
  if (!OPERATIONS.includes(operation)) throw new Error('Unknown storage operation: ' + operation);
  const selection = resolveDlcSelection({ manifests: readDlcDistributionManifests({ root }), profile });
  const plan = buildDlcDistributionPlan({ root, selection });
  const tracked = localGit(root, plan.assets), checkedCache = new Map();
  const cacheRoot = lfsCache ? path.resolve(lfsCache) : tracked?.cacheRoot;
  const entries = plan.assets.map(asset => {
    const local = localSource(root, asset.sourcePath), trackedFile = tracked?.index.get(asset.sourcePath);
    const blob = tracked?.objects.get(trackedFile?.oid);
    const lfs = blob?.lfs || local.lfs;
    const malformed = Boolean(lfs?.malformed);
    const nativeSizeChanged = Boolean(local.materialized && blob?.kind === 'blob' && !lfs && local.bytes !== blob.bytes);
    const payloadBytes = malformed ? null : lfs ? lfs.bytes : local.materialized ? local.bytes : blob?.bytes ?? null;
    const localLfsVerified = local.materialized && lfs?.oid ? local.bytes === lfs.bytes && sha256(local.file) === lfs.oid : null;
    const materialized = local.materialized && localLfsVerified !== false;
    const cache = lfs ? cachedPayload(cacheRoot, lfs, checkedCache) : null;
    const gitNative = blob?.kind === 'blob' && !lfs && !nativeSizeChanged;
    const identity = lfs?.oid ? { algorithm: 'sha256', value: lfs.oid }
      : gitNative ? { algorithm: trackedFile.oid.length === 64 ? 'git-object-sha256' : 'git-object-sha1', value: trackedFile.oid } : null;
    return { sourcePath: asset.sourcePath, publicPath: asset.publicPath, ownerPackId: asset.ownerPackId,
      localState: localLfsVerified === false ? 'invalid-lfs-payload' : local.state, materialized, localBytes: local.bytes ?? null,
      localPathError: local.error ?? null, gitObjectId: trackedFile?.oid ?? null,
      gitObjectState: blob?.kind ?? (tracked ? 'untracked' : 'no-own-git-index'),
      gitBlobBytes: blob?.bytes ?? null, expectedPayloadBytes: payloadBytes, contentIdentity: identity,
      nativeWorkingFileSizeDiffersFromIndex: nativeSizeChanged, localLfsPayloadSha256Verified: localLfsVerified,
      lfsPointer: Boolean(lfs), malformedLfsPointer: malformed, lfsCacheState: cache?.state ?? null,
      recoverableWithoutNetwork: materialized || gitNative || cache?.state === 'verified-sha256' };
  });
  const missing = entries.filter(entry => !entry.materialized), dlc = entries.filter(entry => entry.ownerPackId !== null);
  const distinct = new Map();
  for (const entry of entries) {
    const key = entry.contentIdentity ? `${entry.contentIdentity.algorithm}:${entry.contentIdentity.value}` : `path:${entry.sourcePath}`;
    if (distinct.has(key) && distinct.get(key) !== entry.expectedPayloadBytes) throw new Error('Inconsistent payload sizes for content identity: ' + key);
    distinct.set(key, entry.expectedPayloadBytes);
  }
  const allSizesKnown = entries.every(entry => entry.expectedPayloadBytes !== null);
  const payloadBytes = sum(entries, 'expectedPayloadBytes'), canonicalDlcBytes = sum(dlc, 'expectedPayloadBytes');
  const estimates = {
    'canonical-hydration': sum(missing, 'expectedPayloadBytes'),
    'source-cache': [...distinct.values()].reduce((n, bytes) => n + (bytes ?? 0), 0),
    export: payloadBytes + canonicalDlcBytes,
    'export-build': 2 * payloadBytes + canonicalDlcBytes
  };
  const canonicalVolume = volume(root), externalVolume = volume(storageRoot);
  const targetVolume = operation === 'canonical-hydration' ? canonicalVolume : externalVolume;
  const mediaBytes = estimates[operation];
  const allocatedMediaBytes = operation === 'canonical-hydration'
    ? missing.reduce((n, entry) => n + blocks(entry.expectedPayloadBytes ?? 0), 0)
    : operation === 'source-cache' ? [...distinct.values()].reduce((n, bytes) => n + blocks(bytes ?? 0), 0)
      : entries.reduce((n, entry) => n + blocks(entry.expectedPayloadBytes ?? 0) * (operation === 'export-build' ? 2 : 1)
        + (entry.ownerPackId === null ? 0 : blocks(entry.expectedPayloadBytes ?? 0)), 0);
  const budgetComplete = allSizesKnown && (operation === 'canonical-hydration' || extraBytes !== null);
  const requiredBytes = allocatedMediaBytes + (extraBytes ?? 0) + reserveBytes;
  return {
    schemaVersion: 1, recordedAt: new Date().toISOString(), root, profile, operation,
    readOnly: true, networkAllowed: false, lazyFetchAllowed: false, productionBuildVerified: false,
    sourceGitHead: tracked?.head ?? null, gitIndexSnapshotSha256: tracked?.indexSha256 ?? null, lfsCacheRoot: cacheRoot ?? null,
    counts: { ...plan.counts, materializedSources: entries.length - missing.length, missingOrUnhydratedSources: missing.length,
      nativeGitBlobs: entries.filter(entry => entry.gitObjectState === 'blob' && !entry.lfsPointer).length,
      lfsPointers: entries.filter(entry => entry.lfsPointer).length,
      verifiedLocalLfsCache: entries.filter(entry => entry.lfsCacheState === 'verified-sha256').length,
      uncachedOrInvalidLfsPayloads: entries.filter(entry => entry.lfsPointer && entry.lfsCacheState !== 'verified-sha256').length,
      remoteLfsPayloadsRequired: entries.filter(entry => entry.lfsPointer && !entry.materialized && entry.lfsCacheState !== 'verified-sha256').length,
      recoverableWithoutNetwork: entries.filter(entry => entry.recoverableWithoutNetwork).length },
    sizes: { allSizesKnown, payloadBytes, missingOrUnhydratedPayloadBytes: sum(missing, 'expectedPayloadBytes'),
      deduplicatedByContentIdentityBytes: estimates['source-cache'], nativeGitObjectBytes: sum(entries.filter(entry => !entry.lfsPointer), 'gitBlobBytes'),
      lfsPayloadBytes: sum(entries.filter(entry => entry.lfsPointer), 'expectedPayloadBytes'),
      uncachedOrInvalidLfsPayloadBytes: sum(entries.filter(entry => entry.lfsPointer && entry.lfsCacheState !== 'verified-sha256'), 'expectedPayloadBytes'),
      remoteLfsPayloadBytesRequired: sum(entries.filter(entry => entry.lfsPointer && !entry.materialized && entry.lfsCacheState !== 'verified-sha256'), 'expectedPayloadBytes'),
      currentPipelineMediaOnlyEstimates: estimates },
    budget: { operation, volume: targetVolume, sourceVolume: canonicalVolume, storageVolume: externalVolume,
      mediaLogicalBytes: mediaBytes, mediaAllocated4KiBBytes: allocatedMediaBytes, extraBytes, reserveBytes,
      requiredBytes, mediaLowerBoundFits: allSizesKnown && requiredBytes <= targetVolume.availableBytes,
      completeBudgetKnown: budgetComplete,
      caveat: 'Export/build estimates exclude code, documentation, dependencies, receipts and compiled JavaScript unless included explicitly in extraBytes. No reflink, cross-filesystem hardlink or pruning is assumed.' },
    requiredSourcesMaterialized: missing.length === 0,
    strictPass: missing.length === 0 && budgetComplete && requiredBytes <= targetVolume.availableBytes,
    approval: { canonicalFidelityApproved: false, actorBacklogClosed: false },
    contentHashSemantics: 'Git object IDs hash Git blob headers plus bytes; they are not payload SHA-256. LFS identities are payload SHA-256. Deduplication uses these explicit identity namespaces; cross-namespace equality is not assumed.',
    limitations: ['Native regular working files are checked for availability and size, not compared byte-for-byte with staged Git objects. Materialized LFS payloads are verified with SHA-256.',
      'This preflight does not attest gameplay, source fidelity, publication collision freedom or a production build.',
      'Only Git blobs of at most 1024 bytes are read to identify valid LFS pointers; large native blob content is not decompressed.'],
    entries
  };
}

const USAGE = 'Usage: node scripts/auditDlcMaterialization.mjs [--root DIR] [--profile FILE | --mode all|base|selected --pack ID] [--shared-policy preserve-all|reviewed-dependencies] [--operation canonical-hydration|source-cache|export|export-build] [--storage-root DIR] [--lfs-cache DIR] [--reserve-bytes N] [--extra-bytes N] [--json NEW_FILE] [--strict]';

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2), options = {}, packs = [];
    let profileFile, mode, sharedPolicy, reportFile, strictFlag = false;
    if (args.length === 1 && ['--help', '-h'].includes(args[0])) { console.log(USAGE); process.exit(0); }
    const seen = new Set();
    for (let index = 0; index < args.length; index++) {
      const flag = args[index];
      if (flag === '--strict' && !strictFlag) { strictFlag = true; continue; }
      const value = args[++index];
      if (!value || value.startsWith('--') || (flag !== '--pack' && seen.has(flag))) throw new Error(USAGE);
      seen.add(flag);
      const key = { '--root': 'root', '--storage-root': 'storageRoot', '--lfs-cache': 'lfsCache', '--operation': 'operation',
        '--reserve-bytes': 'reserveBytes', '--extra-bytes': 'extraBytes' }[flag];
      if (key) options[key] = ['reserveBytes', 'extraBytes'].includes(key) ? integer(value, flag) : value;
      else if (flag === '--profile') profileFile = value;
      else if (flag === '--mode') mode = value;
      else if (flag === '--shared-policy') sharedPolicy = value;
      else if (flag === '--pack') packs.push(value);
      else if (flag === '--json') reportFile = value;
      else throw new Error(USAGE);
    }
    if (profileFile && (mode || sharedPolicy || packs.length)) throw new Error('Use either --profile or explicit profile flags.');
    options.profile = profileFile ? JSON.parse(readFileSync(path.resolve(options.root || process.cwd(), profileFile), 'utf8'))
      : { schemaVersion: 1, mode: mode || (packs.length ? 'selected' : 'all'), packIds: packs, sharedPolicy: sharedPolicy || 'preserve-all' };
    const report = auditDlcMaterialization(options);
    if (reportFile) writeFileSync(path.resolve(reportFile), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
    console.log(JSON.stringify({ ...report, entries: undefined }, null, 2));
    // Source profiles are strict by default. --strict is an explicit equivalent,
    // never an invitation to consider absent media available when omitted.
    if (!report.strictPass) process.exitCode = 1;
  } catch (error) { console.error('DLC materialization preflight failed: ' + error.message); process.exitCode = 1; }
}
