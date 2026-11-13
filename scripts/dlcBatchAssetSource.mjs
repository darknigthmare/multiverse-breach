import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createReadStream, createWriteStream } from 'node:fs';
import { access, chmod, lstat, mkdir, mkdtemp, open, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { projectAssetPath } from './dlcAssetPaths.mjs';

const OPERATION_BYTES = 256 * 1024;
const snapshots = new Map();
const hexOid = value => typeof value === 'string' && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(value);
const safeEnv = () => ({ ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0',
  GIT_LFS_SKIP_SMUDGE: '0', GIT_LFS_SKIP_DOWNLOAD_ERRORS: '0' });

export class DlcBatchAssetSourceError extends Error {
  constructor(code, status = 'unavailable', details = {}) {
    super(code); this.name = 'DlcBatchAssetSourceError'; this.code = code; this.status = status;
    // Never attach subprocess stderr, URLs, environment variables or auth errors.
    this.details = Object.fromEntries(Object.entries(details).filter(([, value]) => typeof value === 'number' || typeof value === 'boolean'));
  }
}
const fail = (code, status, details) => new DlcBatchAssetSourceError(code, status, details);
const bytesOption = (value, name) => {
  if (!Number.isSafeInteger(value) || value < 0) throw fail(name, 'invalid');
  return value;
};
const gitHash = (bytes, oid) => createHash(oid.length === 40 ? 'sha1' : 'sha256')
  .update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

function exitOf(child, code) {
  let stderrBytes = 0, diagnostic = '';
  child.stderr?.on('data', chunk => { stderrBytes += chunk.length; if (diagnostic.length < 8192) diagnostic += chunk.toString('utf8').slice(0, 8192 - diagnostic.length); });
  return new Promise((resolve, reject) => {
    child.once('error', () => reject(fail('PROCESS_SPAWN_FAILED')));
    child.once('close', (exitCode, signal) => {
      if (exitCode === 0) { resolve(); return; }
      let safeCode = code;
      if (code === 'LFS_SMUDGE_FAILED') {
        if (/quota|bandwidth limit|rate limit|\b429\b/i.test(diagnostic)) safeCode = 'LFS_QUOTA_OR_RATE_LIMIT';
        else if (/\b401\b|\b403\b|authentication|authorization|could not read username|access denied/i.test(diagnostic)) safeCode = 'LFS_AUTH_OR_ACCESS_FAILED';
        else if (/unsupported|missing protocol|not implemented/i.test(diagnostic)) safeCode = 'LFS_ENDPOINT_UNSUPPORTED';
        else if (/\b404\b|not found|does not exist/i.test(diagnostic)) safeCode = 'LFS_ENDPOINT_OR_OBJECT_UNAVAILABLE';
        else if (/could not resolve|proxyconnect|connection refused|dial tcp|\btls\b|certificate/i.test(diagnostic)) safeCode = 'LFS_NETWORK_FAILED';
      }
      diagnostic = ''; reject(fail(safeCode, 'unavailable', { exitCode: exitCode ?? -1, signalled: Boolean(signal), stderrBytes }));
    });
  });
}

function stopProcess(child) {
  if (!child) return;
  try { if (process.platform !== 'win32' && child.spawnargs?.includes('smudge')) process.kill(-child.pid, 'SIGKILL'); else child.kill('SIGKILL'); }
  catch { try { child.kill('SIGKILL'); } catch { /* Already exited. */ } }
}

async function gitCapture(repoRoot, args, { input, maxBytes = 64 * 1024 * 1024 } = {}) {
  const child = spawn('git', args, { cwd: repoRoot, env: safeEnv(), stdio: ['pipe', 'pipe', 'pipe'] });
  const chunks = []; let size = 0, overflow = false;
  child.stdout.on('data', chunk => {
    size += chunk.length;
    if (size > maxBytes) { overflow = true; child.kill('SIGKILL'); } else chunks.push(chunk);
  });
  const done = exitOf(child, 'GIT_OBJECT_UNAVAILABLE');
  child.stdin.on('error', () => {}); child.stdin.end(input);
  try { await done; } catch (error) { if (overflow) throw fail('METADATA_LIMIT_EXCEEDED', 'budget'); throw error; }
  if (overflow) throw fail('METADATA_LIMIT_EXCEEDED', 'budget');
  return Buffer.concat(chunks);
}

function parsePointer(bytes) {
  const text = bytes.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!/^version https:\/\/git-lfs\.github\.com\/spec\/v1(?:\n|$)/.test(text)) return null;
  const lines = text.trimEnd().split('\n');
  const oid = lines.find(line => /^oid sha256:[a-f0-9]{64}$/.test(line))?.slice(11);
  const size = lines.find(line => /^size \d+$/.test(line))?.slice(5);
  if (!oid || size === undefined || !Number.isSafeInteger(Number(size))) throw fail('INVALID_LFS_POINTER', 'invalid');
  if (lines.length !== 3 || new Set(lines).size !== 3) throw fail('UNSUPPORTED_LFS_POINTER', 'invalid');
  return { oid, bytes: Number(size) };
}

async function sourceSnapshot(repoRoot, revision) {
  repoRoot = path.resolve(repoRoot);
  if (typeof revision !== 'string' || !revision || revision.startsWith('-')) throw fail('INVALID_REVISION', 'invalid');
  const commit = (await gitCapture(repoRoot, ['rev-parse', '--verify', '--end-of-options', `${revision}^{commit}`], { maxBytes: 1024 })).toString().trim();
  if (!hexOid(commit)) throw fail('INVALID_REVISION', 'invalid');
  const key = repoRoot + '\0' + commit;
  if (!snapshots.has(key)) snapshots.set(key, (async () => {
    const tree = await gitCapture(repoRoot, ['ls-tree', '-r', '-z', commit]);
    const byPath = new Map();
    for (const record of tree.toString().split('\0').filter(Boolean)) {
      const tab = record.indexOf('\t'), [mode, kind, oid] = record.slice(0, tab).split(' ');
      byPath.set(record.slice(tab + 1), { mode, kind, oid });
    }
    const rawCache = (await gitCapture(repoRoot, ['rev-parse', '--git-path', 'lfs/objects'], { maxBytes: 4096 })).toString().trim();
    return { repoRoot, revision: commit, byPath, metadata: new Map(), pointers: new Map(), coreLfsRoot: path.resolve(repoRoot, rawCache) };
  })());
  return snapshots.get(key);
}

async function inspect(snapshot, sourcePaths) {
  for (const sourcePath of sourcePaths) if (!projectAssetPath(sourcePath)) throw fail('INVALID_SOURCE_PATH', 'invalid');
  const fresh = [...new Set(sourcePaths)].filter(sourcePath => !snapshot.metadata.has(sourcePath));
  const candidates = fresh.filter(sourcePath => {
    const entry = snapshot.byPath.get(sourcePath);
    if (!entry || entry.kind !== 'blob' || !['100644', '100755'].includes(entry.mode)) {
      snapshot.metadata.set(sourcePath, { sourcePath, revision: snapshot.revision, status: 'unavailable', code: 'ASSET_NOT_IN_COMMIT' }); return false;
    }
    return true;
  });
  const oids = [...new Set(candidates.map(sourcePath => snapshot.byPath.get(sourcePath).oid))];
  const sizes = new Map();
  if (oids.length) {
    const output = await gitCapture(snapshot.repoRoot, ['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], { input: oids.join('\n') + '\n' });
    for (const line of output.toString().trimEnd().split('\n')) {
      const [oid, kind, size] = line.split(' ');
      if (kind === 'blob' && Number.isSafeInteger(Number(size))) sizes.set(oid, Number(size));
    }
    const small = oids.filter(oid => sizes.has(oid) && sizes.get(oid) <= 1024);
    if (small.length) {
      const output = await gitCapture(snapshot.repoRoot, ['cat-file', '--batch'], { input: small.join('\n') + '\n' });
      let offset = 0;
      for (const oid of small) {
        const end = output.indexOf(10, offset), fields = output.subarray(offset, end).toString().split(' '), size = Number(fields[2]);
        if (!Number.isSafeInteger(size) || size !== sizes.get(oid)) throw fail('GIT_BLOB_HASH_MISMATCH', 'invalid');
        const bytes = output.subarray(end + 1, end + 1 + size); offset = end + size + 2;
        if (gitHash(bytes, oid) !== oid) throw fail('GIT_BLOB_HASH_MISMATCH', 'invalid');
        try { const pointer = parsePointer(bytes); if (pointer) snapshot.pointers.set(oid, { ...pointer, raw: Buffer.from(bytes) }); }
        catch (error) { snapshot.pointers.set(oid, { error: error.code }); }
      }
    }
  }
  for (const sourcePath of candidates) {
    const oid = snapshot.byPath.get(sourcePath).oid, pointer = snapshot.pointers.get(oid);
    if (!sizes.has(oid) || pointer?.error) {
      snapshot.metadata.set(sourcePath, { sourcePath, revision: snapshot.revision, status: 'unavailable', code: pointer?.error || 'GIT_OBJECT_UNAVAILABLE' }); continue;
    }
    snapshot.metadata.set(sourcePath, { sourcePath, revision: snapshot.revision, status: 'available',
      gitBlobOid: oid, gitBlobBytes: sizes.get(oid), payloadBytes: pointer?.bytes ?? sizes.get(oid),
      expectedSha256: pointer?.oid ?? null, lfsPayloadOid: pointer?.oid ?? null,
      contentKind: pointer ? 'lfs-payload' : 'git-blob' });
  }
  return sourcePaths.map(sourcePath => ({ ...snapshot.metadata.get(sourcePath) }));
}

export async function inspectDlcBatchAssetSources({ repoRoot = process.cwd(), revision, sourcePaths } = {}) {
  if (!Array.isArray(sourcePaths)) throw fail('INVALID_SOURCE_PATH', 'invalid');
  const snapshot = await sourceSnapshot(repoRoot, revision);
  return { revision: snapshot.revision, assets: await inspect(snapshot, sourcePaths) };
}

async function measuredFiles(root) {
  let bytes = 0;
  const walk = async directory => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw fail('OWNER_GUARD_FAILED', 'invalid');
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile()) bytes += (await lstat(file)).size;
      else throw fail('OWNER_GUARD_FAILED', 'invalid');
    }
  };
  await walk(root); return bytes;
}

async function ownedInventory(root) {
  const entries = new Map();
  const walk = async directory => {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, item.name), relative = path.relative(root, file), stat = await lstat(file);
      if (stat.isSymbolicLink()) throw fail('OWNER_GUARD_FAILED', 'invalid');
      if (stat.isDirectory()) { entries.set(relative, `dir:${stat.dev}:${stat.ino}`); await walk(file); }
      else if (stat.isFile()) {
        const digest = createHash('sha256'); for await (const chunk of createReadStream(file)) digest.update(chunk);
        entries.set(relative, `file:${stat.dev}:${stat.ino}:${stat.size}:${digest.digest('hex')}`);
      } else throw fail('OWNER_GUARD_FAILED', 'invalid');
    }
  };
  await walk(root); return entries;
}

async function checkedRegular(file) {
  const parts = path.resolve(file).split(path.sep).filter(Boolean); let current = path.parse(path.resolve(file)).root;
  for (let index = 0; index < parts.length; index++) {
    current = path.join(current, parts[index]);
    let stat; try { stat = await lstat(current); } catch (error) { if (error.code === 'ENOENT') return null; throw fail('SOURCE_READ_FAILED'); }
    if (stat.isSymbolicLink() || (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) throw fail('SOURCE_READ_FAILED', 'invalid');
  }
  return lstat(file);
}

function historicalIndex(value) {
  if (value instanceof Map) return value;
  if (Array.isArray(value?.entries)) return new Map(value.entries.map(entry => [entry.sha256, entry]));
  return new Map(Object.entries(value || {}));
}

/** dependencies.spawnLfs is only a test seam; production uses the real Git LFS child. */
export async function createDlcBatchAssetSource({ repoRoot = process.cwd(), revision, parentTmpDir = tmpdir(),
  maxBytes, maxTempBytes, maxAssetBytes, coreLfsRoot, allowLfsFetch = false, verifiedHistoricalLfsMap, processTimeoutMs = 60000 } = {}, dependencies = {}) {
  const limit = bytesOption(maxBytes ?? maxTempBytes, 'INVALID_TEMP_BUDGET');
  if (maxBytes !== undefined && maxTempBytes !== undefined && maxBytes !== maxTempBytes) throw fail('INVALID_TEMP_BUDGET', 'invalid');
  const assetLimit = bytesOption(maxAssetBytes ?? limit, 'INVALID_ASSET_BUDGET');
  if (!Number.isSafeInteger(processTimeoutMs) || processTimeoutMs < 1) throw fail('INVALID_PROCESS_TIMEOUT', 'invalid');
  const snapshot = await sourceSnapshot(repoRoot, revision), history = historicalIndex(verifiedHistoricalLfsMap);
  parentTmpDir = path.resolve(parentTmpDir);
  const parentStat = await lstat(parentTmpDir);
  if (!parentStat.isDirectory() || parentStat.isSymbolicLink()) throw fail('OWNER_GUARD_FAILED', 'invalid');
  const ownedRoot = await mkdtemp(path.join(parentTmpDir, 'multiverse-dlc-batch-'));
  await chmod(ownedRoot, 0o700);
  const ownerId = randomUUID(), ownerStat = await lstat(ownedRoot), marker = path.join(ownedRoot, '.owner.json');
  await writeFile(marker, JSON.stringify({ schemaVersion: 1, ownerId, revision: snapshot.revision }) + '\n', { flag: 'wx', mode: 0o600 });
  await mkdir(path.join(ownedRoot, 'payloads')); await mkdir(path.join(ownedRoot, 'cache'));
  let closed = false, tail = Promise.resolve();
  let inventory = await ownedInventory(ownedRoot);
  const records = new Map();
  const queue = action => {
    const next = tail.then(action); tail = next.catch(() => {}); return next;
  };
  const ownerGuard = async () => {
    if (closed) throw fail('PROVIDER_CLOSED', 'invalid');
    let stat; try { stat = await lstat(ownedRoot); } catch { throw fail('OWNER_GUARD_FAILED', 'invalid'); }
    if (!stat.isDirectory() || stat.isSymbolicLink() || stat.ino !== ownerStat.ino || stat.dev !== ownerStat.dev) throw fail('OWNER_GUARD_FAILED', 'invalid');
    let saved; try { saved = JSON.parse(await readFile(marker, 'utf8')); } catch { throw fail('OWNER_GUARD_FAILED', 'invalid'); }
    if (saved.ownerId !== ownerId) throw fail('OWNER_GUARD_FAILED', 'invalid');
    const actual = await ownedInventory(ownedRoot);
    if (actual.size !== inventory.size || [...actual.keys()].some(key => !inventory.has(key))) throw fail('OWNER_GUARD_FAILED', 'invalid');
    for (const [relative, fingerprint] of inventory) if (actual.get(relative) !== fingerprint) {
      throw fail(relative.startsWith('payloads' + path.sep) ? 'OUTPUT_CHANGED' : 'OWNER_GUARD_FAILED', 'invalid');
    }
  };
  const baseBytes = await measuredFiles(ownedRoot);
  if (baseBytes > limit) { await rm(ownedRoot, { recursive: true }); throw fail('TEMP_BUDGET_EXCEEDED', 'budget'); }
  const metadata = async sourcePath => {
    const [entry] = await inspect(snapshot, [sourcePath]);
    if (entry.status !== 'available') throw fail(entry.code);
    return entry;
  };
  const receiptRecord = receipt => {
    const record = records.get(receipt?.receiptId);
    if (!record || receipt.ownerId !== ownerId || receipt.path !== record.path) throw fail('FOREIGN_RECEIPT', 'invalid');
    return record;
  };
  const verifyRecord = async record => {
    const stat = await checkedRegular(record.path);
    if (!stat || stat.size !== record.bytes) throw fail('OUTPUT_CHANGED', 'invalid');
    const hash = createHash('sha256'), rawHash = record.rawGitOid ? createHash(record.rawGitOid.length === 40 ? 'sha1' : 'sha256').update(`blob ${record.bytes}\0`) : null;
    for await (const chunk of createReadStream(record.path)) { hash.update(chunk); rawHash?.update(chunk); }
    if (hash.digest('hex') !== record.sha256 || (rawHash && rawHash.digest('hex') !== record.rawGitOid)) throw fail('OUTPUT_CHANGED', 'invalid');
    return { verified: true, bytes: record.bytes, sha256: record.sha256 };
  };
  const api = {
    revision: snapshot.revision, ownedRoot, maxBytes: limit, maxAssetBytes: assetLimit,
    readAssetMetadata: sourcePath => queue(async () => { await ownerGuard(); return metadata(sourcePath); }),
    materialize: (sourcePath, expected = {}) => queue(async () => {
      await ownerGuard(); const entry = await metadata(sourcePath);
      if (entry.payloadBytes > assetLimit) throw fail('MAX_ASSET_BYTES_EXCEEDED', 'budget', { bytes: entry.payloadBytes, limit: assetLimit });
      if (expected.expectedBytes !== undefined && expected.expectedBytes !== entry.payloadBytes) throw fail('EXPECTED_LENGTH_MISMATCH', 'invalid');
      if (expected.expectedSha256 !== undefined && !/^[a-f0-9]{64}$/.test(expected.expectedSha256)) throw fail('EXPECTED_SHA_MISMATCH', 'invalid');
      if (entry.expectedSha256 && expected.expectedSha256 && entry.expectedSha256 !== expected.expectedSha256) throw fail('EXPECTED_SHA_MISMATCH', 'invalid');
      let sourceKind = 'git-blob', corePath = null, rawGitOid = entry.contentKind === 'git-blob' ? entry.gitBlobOid : null;
      const pointer = snapshot.pointers.get(entry.gitBlobOid);
      if (pointer) {
        const cache = path.join(path.resolve(coreLfsRoot || snapshot.coreLfsRoot), pointer.oid.slice(0, 2), pointer.oid.slice(2, 4), pointer.oid);
        const stat = await checkedRegular(cache);
        if (stat?.size === entry.payloadBytes) { sourceKind = 'core-lfs-cache'; corePath = cache; }
        else {
          const historic = history.get(pointer.oid);
          if (historic?.verified === true && historic.sha256 === pointer.oid && historic.bytes === pointer.bytes && hexOid(historic.gitBlobOid)) {
            sourceKind = 'historical-git-lfs'; rawGitOid = historic.gitBlobOid;
          } else if (allowLfsFetch) sourceKind = 'fetched-lfs';
          else throw fail('LFS_UNAVAILABLE');
        }
      }
      const currentBytes = await measuredFiles(ownedRoot);
      const reservation = entry.payloadBytes * (sourceKind === 'fetched-lfs' ? 2 : 1) + (sourceKind === 'fetched-lfs' ? OPERATION_BYTES : 0);
      if (!Number.isSafeInteger(reservation) || currentBytes + reservation > limit) throw fail('TEMP_BUDGET_EXCEEDED', 'budget', { bytes: reservation, used: currentBytes, limit });
      const receiptId = randomUUID(), output = path.join(ownedRoot, 'payloads', receiptId), cacheRoot = path.join(ownedRoot, 'cache', receiptId);
      const hash = createHash('sha256'), rawHash = rawGitOid ? createHash(rawGitOid.length === 40 ? 'sha1' : 'sha256').update(`blob ${entry.payloadBytes}\0`) : null;
      let bytes = 0, head = Buffer.alloc(0), child = null, monitor = null, deadline = null, budgetError = null, cacheScanRunning = false;
      const transform = new Transform({ transform(chunk, _encoding, callback) {
        bytes += chunk.length;
        if (bytes > entry.payloadBytes || bytes > assetLimit) { callback(fail('LENGTH_MISMATCH', 'invalid', { bytes })); return; }
        if (head.length < 1024) head = Buffer.concat([head, chunk.subarray(0, 1024 - head.length)]);
        hash.update(chunk); rawHash?.update(chunk); callback(null, chunk);
      } });
      try {
        let input, completed = Promise.resolve();
        if (sourceKind === 'core-lfs-cache') input = createReadStream(corePath);
        else {
          let args = ['cat-file', 'blob', rawGitOid];
          if (sourceKind === 'fetched-lfs') {
            await mkdir(cacheRoot);
            args = ['-c', `lfs.storage=${cacheRoot}`, '-c', 'lfs.skipdownloaderrors=false', 'lfs', 'smudge', '--', sourcePath];
            if (dependencies.spawnLfs) child = dependencies.spawnLfs(args, { cwd: snapshot.repoRoot, env: safeEnv(), detached: process.platform !== 'win32', stdio: ['pipe', 'pipe', 'pipe'] });
            else {
              let prlimit = false; try { await access('/usr/bin/prlimit'); prlimit = process.platform === 'linux'; } catch { /* Stream and cache guards remain active. */ }
              child = prlimit ? spawn('/usr/bin/prlimit', [`--fsize=${Math.max(entry.payloadBytes, OPERATION_BYTES)}`, '--', 'git', ...args], { cwd: snapshot.repoRoot, env: safeEnv(), detached: process.platform !== 'win32', stdio: ['pipe', 'pipe', 'pipe'] })
                : spawn('git', args, { cwd: snapshot.repoRoot, env: safeEnv(), detached: process.platform !== 'win32', stdio: ['pipe', 'pipe', 'pipe'] });
            }
          } else child = spawn('git', args, { cwd: snapshot.repoRoot, env: safeEnv(), stdio: ['pipe', 'pipe', 'pipe'] });
          input = child.stdout; completed = exitOf(child, sourceKind === 'fetched-lfs' ? 'LFS_SMUDGE_FAILED' : 'GIT_OBJECT_UNAVAILABLE');
          deadline = setTimeout(() => { budgetError = fail('SOURCE_PROCESS_TIMEOUT'); stopProcess(child); }, processTimeoutMs); deadline.unref();
          child.stdin.on('error', () => {}); child.stdin.end(sourceKind === 'fetched-lfs' ? pointer.raw : undefined);
          if (sourceKind === 'fetched-lfs') monitor = setInterval(async () => {
            if (cacheScanRunning) return; cacheScanRunning = true;
            try { if (await measuredFiles(ownedRoot) > limit) { budgetError = fail('TEMP_BUDGET_EXCEEDED', 'budget'); stopProcess(child); } }
            catch { budgetError = fail('OWNER_GUARD_FAILED', 'invalid'); stopProcess(child); }
            finally { cacheScanRunning = false; }
          }, 25);
        }
        const writing = pipeline(input, transform, createWriteStream(output, { flags: 'wx', mode: 0o600 }));
        writing.catch(() => { stopProcess(child); });
        const results = await Promise.allSettled([writing, completed]);
        if (budgetError) throw budgetError;
        const rejected = results.find(result => result.status === 'rejected');
        if (rejected) throw rejected.reason;
        if (parsePointer(head)) throw fail('LFS_POINTER_FALLBACK', 'invalid');
        if (bytes !== entry.payloadBytes) throw fail('LENGTH_MISMATCH', 'invalid', { bytes, expected: entry.payloadBytes });
        const sha256 = hash.digest('hex');
        if ((entry.expectedSha256 && sha256 !== entry.expectedSha256) || (expected.expectedSha256 && sha256 !== expected.expectedSha256)) throw fail('SHA256_MISMATCH', 'invalid');
        if (rawHash && rawHash.digest('hex') !== rawGitOid) throw fail('GIT_BLOB_HASH_MISMATCH', 'invalid');
        if (await measuredFiles(ownedRoot) > limit) throw fail('TEMP_BUDGET_EXCEEDED', 'budget');
        const after = await ownedInventory(ownedRoot), allowed = [path.relative(ownedRoot, output), path.relative(ownedRoot, cacheRoot)];
        for (const [relative, fingerprint] of inventory) if (after.get(relative) !== fingerprint) throw fail('OWNER_GUARD_FAILED', 'invalid');
        for (const relative of after.keys()) if (!inventory.has(relative) && !allowed.some(prefix => relative === prefix || relative.startsWith(prefix + path.sep))) throw fail('OWNER_GUARD_FAILED', 'invalid');
        const record = { receiptId, ownerId, revision: snapshot.revision, sourcePath, path: output, bytes, sha256,
          gitBlobOid: entry.gitBlobOid, lfsPayloadOid: entry.lfsPayloadOid, sourceKind, rawGitOid,
          historicalGitBlobOid: sourceKind === 'historical-git-lfs' ? rawGitOid : null,
          gitBlobAuditVerified: true, payloadLengthVerified: true, payloadSha256Verified: true, cacheRoot: sourceKind === 'fetched-lfs' ? cacheRoot : null };
        inventory = after; records.set(receiptId, record); return { ...record };
      } catch (error) {
        stopProcess(child);
        await rm(output, { force: true }); await rm(cacheRoot, { recursive: true, force: true });
        if (error instanceof DlcBatchAssetSourceError) throw error;
        throw fail('SOURCE_STREAM_FAILED');
      } finally { if (monitor) clearInterval(monitor); if (deadline) clearTimeout(deadline); }
    }),
    verify: receipt => queue(async () => { await ownerGuard(); return verifyRecord(receiptRecord(receipt)); }),
    cleanup: receipts => queue(async () => {
      await ownerGuard(); if (!Array.isArray(receipts)) throw fail('FOREIGN_RECEIPT', 'invalid');
      const selected = receipts.map(receiptRecord);
      for (const record of selected) {
        await rm(record.path, { force: true });
        if (record.cacheRoot) await rm(record.cacheRoot, { recursive: true, force: true });
        records.delete(record.receiptId);
      }
      inventory = await ownedInventory(ownedRoot);
      return { cleaned: selected.length, ownedBytes: await measuredFiles(ownedRoot) };
    }),
    close: () => queue(async () => {
      if (closed) return { closed: true };
      await ownerGuard(); await rm(ownedRoot, { recursive: true }); closed = true; records.clear(); return { closed: true };
    })
  };
  return api;
}
