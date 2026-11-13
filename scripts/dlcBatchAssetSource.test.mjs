import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createDlcBatchAssetSource, inspectDlcBatchAssetSources } from './dlcBatchAssetSource.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const pointer = bytes => `version https://git-lfs.github.com/spec/v1\noid sha256:${hash(bytes)}\nsize ${bytes.length}\n`;
const git = (root, ...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_LFS_SKIP_SMUDGE: '1' } });
  assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
};
const write = (root, file, bytes) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), bytes); };
const fixture = t => {
  const parent = mkdtempSync(path.join(tmpdir(), 'multiverse-batch-source-test-')), root = path.join(parent, 'repo'); mkdirSync(root);
  const providers = [];
  t.after(async () => { for (const source of providers) { try { await source.close(); } catch { /* Deliberately damaged fixture owner. */ } } rmSync(parent, { recursive: true, force: true }); });
  git(root, 'init', '-q'); git(root, 'config', 'user.name', 'Fixture'); git(root, 'config', 'user.email', 'fixture@example.invalid');
  git(root, 'config', 'core.autocrlf', 'false');
  const historical = Buffer.from('a historical payload, verified by exact hash\0');
  write(root, 'public/old.bin', historical); git(root, 'add', '.'); git(root, 'commit', '-qm', 'historical fixture');
  const historicalOid = git(root, 'rev-parse', 'HEAD:public/old.bin'); git(root, 'rm', '-q', 'public/old.bin');
  const raw = Buffer.alloc(16384, 19), cached = Buffer.from('cached exact media\0'), remote = Buffer.alloc(4096, 76);
  const files = { raw: 'DLC/Halo/assets/raw.bin', cached: 'DLC/Halo/assets/cached.bin', remote: 'DLC/Halo/assets/remote.bin', historical: 'DLC/Halo/assets/historical.bin', malformed: 'DLC/Halo/assets/malformed.bin' };
  write(root, files.raw, raw); write(root, files.cached, pointer(cached)); write(root, files.remote, pointer(remote));
  write(root, files.historical, pointer(historical)); write(root, files.malformed, 'version https://git-lfs.github.com/spec/v1');
  git(root, 'add', '.'); git(root, 'commit', '-qm', 'current fixture'); const revision = git(root, 'rev-parse', 'HEAD');
  const cachePath = `.git/lfs/objects/${hash(cached).slice(0, 2)}/${hash(cached).slice(2, 4)}/${hash(cached)}`;
  write(root, cachePath, cached);
  const fake = path.join(parent, 'fake-lfs.mjs');
  writeFileSync(fake, `import fs from 'node:fs'; import path from 'node:path';
const args=process.argv.slice(2), storage=args.find(a=>a.startsWith('lfs.storage=')).slice(12);
const input=[]; for await(const chunk of process.stdin)input.push(chunk); const original=Buffer.concat(input);
const correct=Buffer.from(${JSON.stringify(remote.toString('base64'))},'base64'), mode=process.env.BATCH_TEST_MODE;
if(mode==='failure'){process.stderr.write('sensitive-auth-text-never-in-receipts');process.exit(9);}
if(mode==='hang')await new Promise(()=>{setInterval(()=>{},1000);});
fs.mkdirSync(path.join(storage,'objects'),{recursive:true});
fs.writeFileSync(path.join(storage,'objects','payload'),mode==='cache-overflow'?Buffer.alloc(2*1024*1024):correct);
process.stdout.write(mode==='fallback'?original:mode==='corrupt'?Buffer.alloc(correct.length,99):mode==='overlong'?Buffer.alloc(correct.length+1024):correct);
`);
  const spawnLfs = mode => (args, options) => spawn(process.execPath, [fake, ...args], { ...options, env: { ...options.env, BATCH_TEST_MODE: mode } });
  return { root, parent, revision, raw, cached, remote, historical, historicalOid, cachePath, files, spawnLfs, providers };
};
const provider = async (f, extra = {}, dependencies = {}) => {
  const source = await createDlcBatchAssetSource({ repoRoot: f.root, revision: f.revision, parentTmpDir: f.parent,
    maxBytes: 1024 * 1024, maxAssetBytes: 1024 * 1024, ...extra }, dependencies);
  f.providers.push(source); return source;
};

test('bulk immutable metadata distinguishes raw blobs, valid pointers, missing assets and malformed pointers without materializing', async t => {
  const f = fixture(t), before = readdirSync(f.parent).sort();
  const info = await inspectDlcBatchAssetSources({ repoRoot: f.root, revision: f.revision, sourcePaths: [...Object.values(f.files), 'public/old.bin'] });
  assert.equal(info.revision, f.revision);
  const raw = info.assets.find(asset => asset.sourcePath === f.files.raw), remote = info.assets.find(asset => asset.sourcePath === f.files.remote);
  assert.equal(raw.payloadBytes, f.raw.length); assert.equal(raw.expectedSha256, null);
  assert.equal(remote.payloadBytes, f.remote.length); assert.equal(remote.expectedSha256, hash(f.remote));
  assert.equal(info.assets.find(asset => asset.sourcePath === f.files.malformed).code, 'INVALID_LFS_POINTER');
  assert.equal(info.assets.find(asset => asset.sourcePath === 'public/old.bin').code, 'ASSET_NOT_IN_COMMIT');
  assert.deepEqual(readdirSync(f.parent).sort(), before);
});

test('native streaming and core cache reuse verify exact bytes; cleanup owns only its own temporary files', async t => {
  const f = fixture(t), coreBefore = readFileSync(path.join(f.root, f.cachePath)), indexBefore = readFileSync(path.join(f.root, '.git/index'));
  const source = await provider(f); t.after(() => source.close());
  const raw = await source.materialize(f.files.raw, { expectedBytes: f.raw.length, expectedSha256: hash(f.raw) });
  assert.equal(raw.sourceKind, 'git-blob'); assert.deepEqual(readFileSync(raw.path), f.raw);
  assert.equal((await source.verify(raw)).verified, true);
  const cached = await source.materialize(f.files.cached);
  assert.equal(cached.sourceKind, 'core-lfs-cache'); assert.equal(cached.sha256, hash(f.cached));
  await assert.rejects(source.cleanup([{ ...raw, ownerId: 'foreign' }]), error => error.code === 'FOREIGN_RECEIPT');
  await source.cleanup([raw, cached]); assert.equal(existsSync(raw.path), false); assert.equal(existsSync(cached.path), false);
  assert.deepEqual(readFileSync(path.join(f.root, f.cachePath)), coreBefore); assert.deepEqual(readFileSync(path.join(f.root, '.git/index')), indexBefore);
  await source.close(); assert.equal(existsSync(source.ownedRoot), false);
});

test('historical Git fallback must match payload SHA, pointer length and historical blob identity', async t => {
  const f = fixture(t), source = await provider(f, { verifiedHistoricalLfsMap: { entries: [{ sha256: hash(f.historical), gitBlobOid: f.historicalOid, bytes: f.historical.length, verified: true }] } });
  t.after(() => source.close());
  const receipt = await source.materialize(f.files.historical);
  assert.equal(receipt.sourceKind, 'historical-git-lfs'); assert.equal(receipt.historicalGitBlobOid, f.historicalOid);
  assert.equal(receipt.sha256, hash(f.historical)); assert.equal((await source.verify(receipt)).verified, true);
  await source.cleanup([receipt]);
  const wrong = await provider(f, { verifiedHistoricalLfsMap: { [hash(f.historical)]: { sha256: hash(f.historical), gitBlobOid: git(f.root, 'rev-parse', `HEAD:${f.files.raw}`), bytes: f.historical.length, verified: true } } });
  t.after(() => wrong.close());
  await assert.rejects(wrong.materialize(f.files.historical), error => ['LENGTH_MISMATCH', 'GIT_BLOB_HASH_MISMATCH', 'SHA256_MISMATCH'].includes(error.code));
});

test('asset size, aggregate temporary budget and unavailable LFS fail before unbounded writes', async t => {
  const f = fixture(t), small = await provider(f, { maxAssetBytes: 10 }); t.after(() => small.close());
  await assert.rejects(small.materialize(f.files.raw), error => error.code === 'MAX_ASSET_BYTES_EXCEEDED');
  const tight = await provider(f, { maxBytes: 1000 }); t.after(() => tight.close());
  await assert.rejects(tight.materialize(f.files.raw), error => error.code === 'TEMP_BUDGET_EXCEEDED');
  await assert.rejects(tight.materialize(f.files.remote), error => error.code === 'LFS_UNAVAILABLE');
  const remoteTight = await provider(f, { maxBytes: 8192, allowLfsFetch: true }, { spawnLfs: f.spawnLfs('good') }); t.after(() => remoteTight.close());
  await assert.rejects(remoteTight.materialize(f.files.remote), error => error.code === 'TEMP_BUDGET_EXCEEDED');
});

test('isolated smudge creates only owned cache/output, verifies real fixture hashes and cleans them after receipt', async t => {
  const f = fixture(t), before = readdirSync(path.join(f.root, '.git/lfs/objects')).sort();
  const source = await provider(f, { allowLfsFetch: true }, { spawnLfs: f.spawnLfs('good') }); t.after(() => source.close());
  const receipt = await source.materialize(f.files.remote);
  assert.equal(receipt.sourceKind, 'fetched-lfs'); assert.equal(receipt.sha256, hash(f.remote));
  assert.equal(receipt.cacheRoot.startsWith(source.ownedRoot + path.sep), true);
  assert.deepEqual(readFileSync(receipt.path), f.remote); assert.equal((await source.verify(receipt)).verified, true);
  await source.cleanup([receipt]); assert.equal(existsSync(receipt.cacheRoot), false);
  assert.deepEqual(readdirSync(path.join(f.root, '.git/lfs/objects')).sort(), before);
});

test('smudge pointer fallback, same-size corruption, overlong media and auth errors never yield an accepted receipt', async t => {
  const f = fixture(t);
  for (const [mode, codes] of [['fallback', ['LFS_POINTER_FALLBACK']], ['corrupt', ['SHA256_MISMATCH']],
    ['overlong', ['LENGTH_MISMATCH']], ['failure', ['LFS_SMUDGE_FAILED']], ['cache-overflow', ['TEMP_BUDGET_EXCEEDED']]]) {
    const source = await provider(f, { allowLfsFetch: true }, { spawnLfs: f.spawnLfs(mode) });
    try {
      await assert.rejects(source.materialize(f.files.remote), error => {
        assert.equal(codes.includes(error.code), true, `${mode}: ${error.code}`);
        assert.equal(JSON.stringify(error).includes('sensitive-auth-text'), false); return true;
      });
      assert.deepEqual(readdirSync(path.join(source.ownedRoot, 'payloads')), []);
      assert.deepEqual(readdirSync(path.join(source.ownedRoot, 'cache')), []);
    } finally { await source.close(); }
  }
});

test('output tampering and ownership-marker replacement block verification/cleanup rather than touching foreign data', async t => {
  const f = fixture(t), source = await provider(f), receipt = await source.materialize(f.files.raw);
  writeFileSync(receipt.path, Buffer.alloc(receipt.bytes, 2));
  await assert.rejects(source.verify(receipt), error => error.code === 'OUTPUT_CHANGED');
  await assert.rejects(source.cleanup([receipt]), error => error.code === 'OUTPUT_CHANGED');
  writeFileSync(receipt.path, f.raw);
  await source.cleanup([receipt]);
  const foreign = path.join(f.parent, 'foreign.bin'); writeFileSync(foreign, 'must remain');
  await assert.rejects(source.cleanup([{ ...receipt, path: foreign }]), error => error.code === 'FOREIGN_RECEIPT');
  writeFileSync(path.join(source.ownedRoot, '.owner.json'), '{}');
  await assert.rejects(source.close(), error => error.code === 'OWNER_GUARD_FAILED');
  assert.equal(readFileSync(foreign, 'utf8'), 'must remain');
  // Fixture teardown owns this deliberately invalidated test directory.
});

test('an unknown file added inside the owned root blocks cleanup and close before any deletion', async t => {
  const f = fixture(t), source = await provider(f), receipt = await source.materialize(f.files.raw);
  const foreign = path.join(source.ownedRoot, 'user-file.txt'); writeFileSync(foreign, 'user content must remain');
  await assert.rejects(source.cleanup([receipt]), error => error.code === 'OWNER_GUARD_FAILED');
  await assert.rejects(source.close(), error => error.code === 'OWNER_GUARD_FAILED');
  assert.equal(existsSync(receipt.path), true); assert.equal(readFileSync(foreign, 'utf8'), 'user content must remain');
});

test('a same-size corrupted canonical cache is never changed or accepted by the source provider', async t => {
  const f = fixture(t), corrupt = Buffer.alloc(f.cached.length, 9); writeFileSync(path.join(f.root, f.cachePath), corrupt);
  const source = await provider(f);
  await assert.rejects(source.materialize(f.files.cached), error => error.code === 'SHA256_MISMATCH');
  assert.deepEqual(readFileSync(path.join(f.root, f.cachePath)), corrupt);
  assert.deepEqual(readdirSync(path.join(source.ownedRoot, 'payloads')), []);
});

test('a stalled smudge is terminated within its deadline and owned output/cache are removed', async t => {
  const f = fixture(t), source = await provider(f, { allowLfsFetch: true, processTimeoutMs: 100 }, { spawnLfs: f.spawnLfs('hang') });
  await assert.rejects(source.materialize(f.files.remote), error => error.code === 'SOURCE_PROCESS_TIMEOUT');
  assert.deepEqual(readdirSync(path.join(source.ownedRoot, 'payloads')), []);
  assert.deepEqual(readdirSync(path.join(source.ownedRoot, 'cache')), []);
});

test('source path traversal and source symlinks never become production payloads', async t => {
  const f = fixture(t);
  await assert.rejects(inspectDlcBatchAssetSources({ repoRoot: f.root, revision: f.revision, sourcePaths: ['../outside'] }), error => error.code === 'INVALID_SOURCE_PATH');
  mkdirSync(path.join(f.root, 'public'), { recursive: true });
  symlinkSync(path.join(f.root, f.files.raw), path.join(f.root, 'public/link.bin'));
  git(f.root, 'add', 'public/link.bin'); git(f.root, 'commit', '-qm', 'symbolic fixture');
  const info = await inspectDlcBatchAssetSources({ repoRoot: f.root, revision: 'HEAD', sourcePaths: ['public/link.bin'] });
  assert.equal(info.assets[0].code, 'ASSET_NOT_IN_COMMIT');
});
