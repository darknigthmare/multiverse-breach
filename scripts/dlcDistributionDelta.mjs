import { createHash } from 'node:crypto';
import { closeSync, constants, lstatSync, mkdirSync, mkdtempSync, openSync, readSync,
  renameSync, rmSync, writeFileSync, writeSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditDlcDistribution, DLC_DISTRIBUTION_RECEIPT } from './auditDlcDistribution.mjs';
import { validateDlcDistributionReceipt } from './dlcDistribution.mjs';
import { assertDistributionDirectory, inspectDistributionPath, listDistributionFiles,
  readDistributionFile, safeDistributionPath } from './dlcDistributionFilesystem.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const HASH = /^[a-f0-9]{64}$/;
const REVISION = /^[a-f0-9]{40}$/;
const sortPaths = (a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
const equal = (a, b) => a?.sha256 === b?.sha256 && a?.bytes === b?.bytes;
const within = (parent, child) => child === parent || child.startsWith(parent + path.sep);
const keysEqual = (object, keys) => object && typeof object === 'object' && !Array.isArray(object)
  && Object.keys(object).sort().join('|') === [...keys].sort().join('|');
const canonical = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);

function allowedPath(value) {
  safeDistributionPath(value);
  if (value.split('/').some(part => ['.git', 'node_modules', 'dist'].includes(part)
    || part === '.env' || part.startsWith('.env.'))) throw new Error('Unmanaged path in delta: ' + value);
  return value;
}
function deliveredFiles(receipt, receiptBytes) {
  const files = new Map();
  const add = (name, value) => {
    allowedPath(name);
    if (!HASH.test(value.sha256) || !Number.isSafeInteger(value.bytes) || value.bytes < 0) throw new Error('Invalid file digest');
    if (files.has(name) && !equal(files.get(name), value)) throw new Error('Conflicting delivered path: ' + name);
    files.set(name, { path: name, sha256: value.sha256, bytes: value.bytes });
  };
  for (const file of receipt.files) add(file.path, file);
  for (const asset of receipt.assets) { add(asset.sourcePath, asset); add(asset.destinationPath, asset); }
  add(DLC_DISTRIBUTION_RECEIPT, { sha256: digest(receiptBytes), bytes: receiptBytes.length });
  return files;
}
function snapshot(root) {
  root = assertDistributionDirectory(root);
  const audit = auditDlcDistribution({ root });
  const raw = readDistributionFile(root, DLC_DISTRIBUTION_RECEIPT);
  const receipt = JSON.parse(raw);
  if (JSON.stringify(receipt) !== JSON.stringify(audit.receipt)) throw new Error('Receipt changed during audit');
  if (!REVISION.test(receipt.sourceRevision || '')) {
    throw new Error('Delta requires a pinned sourceRevision; export again with --source-revision FULL_GIT_SHA. Standalone builds do not require it.');
  }
  return { root, receipt, raw, receiptSha256: digest(raw), files: deliveredFiles(receipt, raw) };
}
function assertUnchanged(before) {
  if (snapshot(before.root).receiptSha256 !== before.receiptSha256) throw new Error('Distribution receipt changed during operation');
}
/** Inspect bytes without buffering a media file or creating any output. */
function verifyPayloadFile(root, relative, expected) {
  const source = inspectDistributionPath(root, allowedPath(relative));
  const input = openSync(source, constants.O_RDONLY | constants.O_NOFOLLOW);
  const hash = createHash('sha256');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  let bytes = 0;
  try {
    let count;
    while ((count = readSync(input, buffer, 0, buffer.length, null)) > 0) {
      if (bytes === 0 && /^\uFEFF?version https:\/\/git-lfs\.github\.com\/spec\/v1(?:\r?\n|$)/.test(buffer.subarray(0, count).toString('utf8'))) {
        throw new Error('Git LFS pointer is not a materialized delta file: ' + relative);
      }
      hash.update(buffer.subarray(0, count)); bytes += count;
    }
  } finally { closeSync(input); }
  if (bytes !== expected.bytes || hash.digest('hex') !== expected.sha256) throw new Error('Delta file integrity mismatch: ' + relative);
}
/** Streaming copy, exclusive output creation, no links, verified bytes. */
function copyVerified(root, relative, destinationRoot, destinationRelative, expected) {
  const source = inspectDistributionPath(root, allowedPath(relative));
  const destination = path.join(destinationRoot, allowedPath(destinationRelative));
  mkdirSync(path.dirname(destination), { recursive: true });
  const input = openSync(source, constants.O_RDONLY | constants.O_NOFOLLOW);
  let output;
  const hash = createHash('sha256');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  let bytes = 0;
  try {
    output = openSync(destination, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o644);
    let count;
    while ((count = readSync(input, buffer, 0, buffer.length, null)) > 0) {
      hash.update(buffer.subarray(0, count)); bytes += count;
      let offset = 0;
      while (offset < count) {
        const written = writeSync(output, buffer, offset, count - offset);
        if (!written) throw new Error('Incomplete delta copy');
        offset += written;
      }
    }
  } finally { closeSync(input); if (output !== undefined) closeSync(output); }
  if (bytes !== expected.bytes || hash.digest('hex') !== expected.sha256) throw new Error('Delta file integrity mismatch: ' + relative);
}
function freshOutput(out, forbiddenRoots) {
  if (typeof out !== 'string' || !out.trim()) throw new Error('A fresh output directory is required');
  const destination = path.resolve(out);
  const parent = assertDistributionDirectory(path.dirname(destination));
  if (forbiddenRoots.some(root => within(root, destination) || within(destination, root))) throw new Error('Output overlaps an input distribution');
  // The destination parent must not be concurrently mutated by another writer.
  try { lstatSync(destination); throw new Error('Output already exists: ' + destination); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  return { destination, staging: mkdtempSync(path.join(parent, '.dlc-delta-')) };
}
function publish(staging, destination) {
  try { lstatSync(destination); throw new Error('Output appeared during operation'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  renameSync(staging, destination);
}
/** Package changed content between two audited exports of the same source revision. */
export function createDlcDistributionDelta({ base, target, out }) {
  const from = snapshot(base), to = snapshot(target);
  if (from.receipt.sourceRevision !== to.receipt.sourceRevision) throw new Error('Cannot mix source revisions in a DLC delta');
  const available = new Map();
  for (const file of [...from.files.values()].sort(sortPaths)) available.set(file.sha256 + ':' + file.bytes, file.path);
  const files = [...to.files.values()].sort(sortPaths).map(file => {
    const basePath = available.get(file.sha256 + ':' + file.bytes);
    return { ...file, ...(basePath === undefined ? { blob: file.sha256 } : { basePath }) };
  });
  const manifest = { schemaVersion: 1, kind: 'dlc-distribution-delta', sourceRevision: to.receipt.sourceRevision,
    baseReceiptSha256: from.receiptSha256, targetReceiptSha256: to.receiptSha256, files };
  const bytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  const { staging, destination } = freshOutput(out, [from.root, to.root]);
  let published = false;
  try {
    const copied = new Set(); let payloadBytes = 0;
    for (const file of files) if (file.blob && !copied.has(file.blob)) {
      copyVerified(to.root, file.path, staging, 'blobs/' + file.blob, file);
      copied.add(file.blob); payloadBytes += file.bytes;
    }
    writeFileSync(path.join(staging, 'delta.json'), bytes, { flag: 'wx' });
    assertUnchanged(from); assertUnchanged(to);
    publish(staging, destination); published = true;
    return { out: destination, manifestSha256: digest(bytes), sourceRevision: manifest.sourceRevision,
      fileCount: files.length, changedBlobCount: copied.size, payloadBytes, manifestBytes: bytes.length,
      reusedFileCount: files.filter(file => file.basePath !== undefined).length,
      reusedBytes: files.filter(file => file.basePath !== undefined).reduce((sum, file) => sum + file.bytes, 0) };
  } finally { if (!published) rmSync(staging, { recursive: true, force: true }); }
}
function validateManifest(value, from) {
  if (!keysEqual(value, ['schemaVersion','kind','sourceRevision','baseReceiptSha256','targetReceiptSha256','files'])
    || value.schemaVersion !== 1 || value.kind !== 'dlc-distribution-delta'
    || value.sourceRevision !== from.receipt.sourceRevision || value.baseReceiptSha256 !== from.receiptSha256
    || !HASH.test(value.targetReceiptSha256) || !Array.isArray(value.files) || !value.files.length) throw new Error('Incompatible DLC delta manifest');
  let previous = '';
  const names = new Set();
  for (const file of value.files) {
    const fromBase = Object.hasOwn(file || {}, 'basePath');
    if (!keysEqual(file, ['path','sha256','bytes',fromBase ? 'basePath' : 'blob'])
      || !HASH.test(file.sha256) || !Number.isSafeInteger(file.bytes) || file.bytes < 0) throw new Error('Invalid delta entry');
    allowedPath(file.path);
    if (file.path <= previous) throw new Error('Delta paths must be unique and sorted');
    previous = file.path; names.add(file.path);
    if (fromBase) {
      allowedPath(file.basePath);
      if (!equal(from.files.get(file.basePath), file)) throw new Error('Delta reuses an unattested or changed base file');
    } else if (file.blob !== file.sha256) throw new Error('Invalid delta blob key');
  }
  for (const name of names) {
    const parts = name.split('/');
    for (let i = 1; i < parts.length; i++) if (names.has(parts.slice(0,i).join('/'))) throw new Error('Delta file/directory collision');
  }
  const receipt = value.files.find(file => file.path === DLC_DISTRIBUTION_RECEIPT);
  if (!receipt || receipt.sha256 !== value.targetReceiptSha256) throw new Error('Delta target receipt is missing');
}
function assertPackageClosure(delta, expected) {
  const present = listDistributionFiles({ root: delta });
  if (present.length !== expected.size || present.some(file => !expected.has(file))) {
    throw new Error('DLC delta payload closure failed');
  }
}
function readTargetFile({ delta, from, entries }, name) {
  const entry = entries.get(name);
  if (!entry) throw new Error('Delta target file is missing: ' + name);
  const raw = readDistributionFile(entry.basePath === undefined ? delta : from.root,
    entry.basePath === undefined ? 'blobs/' + entry.blob : entry.basePath);
  if (raw.length !== entry.bytes || digest(raw) !== entry.sha256) throw new Error('Delta file integrity mismatch: ' + name);
  return raw;
}
/** Shared by inspection and reconstruction; no staging directory or other write. */
function prepareDlcDistributionDelta({ base, delta, expectedManifestSha256 }) {
  if (!HASH.test(expectedManifestSha256 || '')) throw new Error('A trusted manifest SHA-256 is required');
  delta = assertDistributionDirectory(delta);
  const raw = readDistributionFile(delta, 'delta.json');
  if (digest(raw) !== expectedManifestSha256) throw new Error('DLC delta manifest integrity mismatch');
  const manifest = JSON.parse(raw);
  const from = snapshot(base);
  validateManifest(manifest, from);
  const blobs = new Map();
  for (const file of manifest.files) if (file.blob) {
    if (blobs.has(file.blob) && !equal(blobs.get(file.blob), file)) throw new Error('Conflicting delta blob declaration');
    blobs.set(file.blob, file);
  }
  const expectedPackage = new Set(['delta.json', ...[...blobs.keys()].map(blob => 'blobs/' + blob)]);
  assertPackageClosure(delta, expectedPackage);
  for (const [blob, file] of blobs) verifyPayloadFile(delta, 'blobs/' + blob, file);
  const entries = new Map(manifest.files.map(file => [file.path, file]));
  const input = { delta, from, entries };
  const receiptBytes = readTargetFile(input, DLC_DISTRIBUTION_RECEIPT);
  const targetReceipt = JSON.parse(receiptBytes);
  validateDlcDistributionReceipt(targetReceipt);
  if (targetReceipt.sourceRevision !== manifest.sourceRevision) throw new Error('Delta target receipt revision mismatch');
  const targetFiles = deliveredFiles(targetReceipt, receiptBytes);
  if (targetFiles.size !== entries.size || [...entries].some(([name, file]) => !equal(targetFiles.get(name), file))) {
    throw new Error('Delta target file list does not match its receipt');
  }
  const targetProfile = JSON.parse(readTargetFile(input, 'DLC/distribution.json'));
  if (canonical(targetProfile) !== canonical(targetReceipt.profile)) throw new Error('Delta target profile does not match its receipt');
  assertUnchanged(from);
  if (digest(readDistributionFile(delta, 'delta.json')) !== expectedManifestSha256) throw new Error('Delta changed during input verification');
  assertPackageClosure(delta, expectedPackage);
  return { ...input, raw, manifest, blobs, targetReceipt };
}
const totalBytes = files => files.reduce((total, file) => {
  const value = total + file.bytes;
  if (!Number.isSafeInteger(value)) throw new Error('Delta byte total exceeds the supported integer range');
  return value;
}, 0);

/** Report verified inputs only; the reconstructed tree still needs its strict audit and build. */
export function inspectDlcDistributionDelta(options) {
  const { raw, manifest, from, entries, blobs, targetReceipt } = prepareDlcDistributionDelta(options);
  const sourceIds = from.receipt.packs.map(pack => pack.id), targetIds = targetReceipt.packs.map(pack => pack.id);
  const sourceSet = new Set(sourceIds), targetSet = new Set(targetIds);
  const payloadBytes = totalBytes([...blobs.values()]);
  const reused = manifest.files.filter(file => file.basePath !== undefined);
  return {
    schemaVersion: 1, kind: 'dlc-delta-inspection', status: 'inputs-verified',
    sourceRevision: manifest.sourceRevision, manifestSha256: digest(raw),
    baseReceiptSha256: manifest.baseReceiptSha256, targetReceiptSha256: manifest.targetReceiptSha256,
    checks: {
      baseDistributionAudit: 'verified', manifestHash: 'verified', payloadClosure: 'verified',
      payloadDigests: 'verified', targetReceiptSchema: 'verified', targetReceiptFileList: 'verified', targetProfile: 'verified',
    },
    pendingChecks: ['reconstructed-target-distribution-audit', 'standalone-build', 'browser-playthrough-and-saves'],
    from: { profile: from.receipt.profile, packIds: sourceIds },
    to: { profile: targetReceipt.profile, packIds: targetIds },
    selection: {
      addedPackIds: targetIds.filter(id => !sourceSet.has(id)),
      removedPackIds: sourceIds.filter(id => !targetSet.has(id)),
      retainedPackIds: targetIds.filter(id => sourceSet.has(id)),
    },
    transfer: { compression: 'none', changedBlobCount: blobs.size, payloadBytes,
      manifestBytes: raw.length, packageBytes: payloadBytes + raw.length },
    reconstruction: {
      fileCount: entries.size, fileContentBytes: totalBytes(manifest.files), includesFilesystemOverhead: false,
      baseIsRetained: true, reusedFileCount: reused.length, reusedBytes: totalBytes(reused),
      addedPathCount: manifest.files.filter(file => !from.files.has(file.path)).length,
      removedPathCount: [...from.files.keys()].filter(name => !entries.has(name)).length,
      changedPathCount: manifest.files.filter(file => from.files.has(file.path) && !equal(from.files.get(file.path), file)).length,
    },
  };
}

/** Reconstruct an independent source distribution; never patch the live tree or saves. */
export function applyDlcDistributionDelta({ base, delta, out, expectedManifestSha256 }) {
  const prepared = prepareDlcDistributionDelta({ base, delta, expectedManifestSha256 });
  const { from, manifest } = prepared;
  delta = prepared.delta;
  const { staging, destination } = freshOutput(out, [from.root, delta]);
  let published = false;
  try {
    for (const file of manifest.files) {
      copyVerified(file.basePath === undefined ? delta : from.root,
        file.basePath === undefined ? 'blobs/' + file.blob : file.basePath, staging, file.path, file);
    }
    const audited = snapshot(staging);
    if (audited.receiptSha256 !== manifest.targetReceiptSha256 || audited.receipt.sourceRevision !== manifest.sourceRevision
      || audited.files.size !== manifest.files.length
      || manifest.files.some(file => !equal(audited.files.get(file.path), file))) throw new Error('Reconstructed distribution does not match target receipt');
    assertUnchanged(from);
    if (digest(readDistributionFile(delta, 'delta.json')) !== expectedManifestSha256) throw new Error('Delta changed during reconstruction');
    publish(staging, destination); published = true;
    return { passed: true, out: destination, sourceRevision: manifest.sourceRevision,
      targetReceiptSha256: manifest.targetReceiptSha256, fileCount: audited.files.size, packs: audited.receipt.packs.map(pack => pack.id) };
  } finally { if (!published) rmSync(staging, { recursive: true, force: true }); }
}
const DELTA_USAGE = [
  'Usage: node scripts/dlcDistributionDelta.mjs create --base DIR --target DIR --out NEW_DIR',
  '       node scripts/dlcDistributionDelta.mjs inspect --base DIR --delta DIR --sha256 TRUSTED_HASH',
  '       node scripts/dlcDistributionDelta.mjs apply --base DIR --delta DIR --out NEW_DIR --sha256 TRUSTED_HASH',
  '',
  'Base and target must be audited source exports of the same full sourceRevision.',
  'Use exportDlcDistribution.mjs --source-revision FULL_GIT_SHA when producing them.',
  'inspect verifies the base, manifest, payload bytes and target receipt/profile without writing.',
  'It does not audit the reconstructed target, build the game or run browser/save checks.',
  'apply reconstructs a fresh source directory and then strictly audits that target.',
  'Payload/package bytes are uncompressed. Reconstructed file bytes exclude filesystem overhead;',
  'the original base remains on disk. Removal uses a delta toward the desired smaller edition.',
].join('\n');

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const [action, ...args] = process.argv.slice(2), options = {};
    if (['--help', '-h'].includes(action) && !args.length) {
      console.log(DELTA_USAGE);
    } else {
      const allowed = action === 'create' ? ['base','target','out']
        : action === 'apply' ? ['base','delta','out','sha256']
          : action === 'inspect' ? ['base','delta','sha256'] : [];
      for (let i = 0; i < args.length; i += 2) {
        const key = args[i].slice(2), value = args[i+1];
        if (!args[i].startsWith('--') || !allowed.includes(key) || Object.hasOwn(options,key) || !value || value.startsWith('--')) throw new Error('Invalid delta CLI arguments');
        options[key] = value;
      }
      if (!allowed.length || allowed.some(key => !options[key])) throw new Error(DELTA_USAGE);
      const result = action === 'create' ? createDlcDistributionDelta(options)
        : action === 'inspect' ? inspectDlcDistributionDelta({ ...options, expectedManifestSha256: options.sha256 })
          : applyDlcDistributionDelta({ ...options, expectedManifestSha256: options.sha256 });
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
