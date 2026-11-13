import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { auditDlcMaterialization } from './auditDlcMaterialization.mjs';

const SCRIPT = fileURLToPath(new URL('./auditDlcMaterialization.mjs', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const profile = (mode = 'all', packIds = []) => ({ schemaVersion: 1, mode, packIds, sharedPolicy: 'preserve-all' });
const write = (root, file, bytes) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), bytes); };
const json = (root, file, value) => write(root, file, JSON.stringify(value) + '\n');
const git = (root, ...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_NO_LAZY_FETCH: '1' } });
  assert.equal(result.status, 0, result.stderr); return result.stdout;
};
const pointer = bytes => `version https://git-lfs.github.com/spec/v1\noid sha256:${hash(bytes)}\nsize ${bytes.length}\n`;
const fixture = t => {
  const root = mkdtempSync(path.join(tmpdir(), 'multiverse-materialization-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const shared = { sourcePath: 'public/common.bin', publicPath: '/common.bin' };
  const assets = ['native-a', 'native-b', 'cached', 'uncached'].map(key => ({ sourcePath: `DLC/Halo/assets/${key}.bin`, publicPath: `/${key}.bin` }));
  json(root, 'DLC/Halo/manifest.json', { schemaVersion: 1, id: 'halo', universe: 'Halo', directory: 'DLC/Halo',
    registration: 'runtime', catalogOrder: 1, modules: [], assetManifest: 'assets.json' });
  json(root, 'DLC/Halo/assets.json', { schemaVersion: 1, universe: 'Halo', assets, sharedDependencies: ['/common.bin'] });
  json(root, 'DLC/shared-assets.json', { schemaVersion: 1, assets: [shared] });
  write(root, 'src/App.jsx', 'export default function App(){return null;}\n');
  const native = Buffer.from('identical native sprite\n'), cached = Buffer.from('cached binary\0payload'), uncached = Buffer.alloc(8192, 125);
  write(root, shared.sourcePath, Buffer.from([0, 255, 8, 3]));
  assets.slice(0, 2).forEach(asset => write(root, asset.sourcePath, native));
  write(root, assets[2].sourcePath, pointer(cached)); write(root, assets[3].sourcePath, pointer(uncached));
  git(root, 'init', '-q'); git(root, 'config', 'core.autocrlf', 'false'); git(root, 'add', '.');
  assets.slice(0, 3).forEach(asset => rmSync(path.join(root, asset.sourcePath)));
  const cachedPath = `.git/lfs/objects/${hash(cached).slice(0, 2)}/${hash(cached).slice(2, 4)}/${hash(cached)}`;
  write(root, cachedPath, cached);
  return { root, shared, assets, native, cached, uncached, cachedPath };
};
const snapshot = root => {
  const files = {};
  const walk = directory => {
    for (const item of readdirSync(path.join(root, directory), { withFileTypes: true })) {
      const file = path.posix.join(directory, item.name);
      if (item.isDirectory()) walk(file);
      else if (item.isFile()) files[file] = hash(readFileSync(path.join(root, file)));
    }
  };
  walk(''); return files;
};

test('missing real Git blobs, hydrated cache and unresolved LFS payloads have different identities and sizes', t => {
  const f = fixture(t), before = snapshot(f.root);
  const report = auditDlcMaterialization({ root: f.root, reserveBytes: 0 });
  assert.equal(report.counts.publishedAssets, 5);
  assert.equal(report.counts.materializedSources, 1);
  assert.equal(report.counts.missingOrUnhydratedSources, 4);
  assert.equal(report.counts.verifiedLocalLfsCache, 1);
  assert.equal(report.counts.uncachedOrInvalidLfsPayloads, 1);
  assert.equal(report.counts.recoverableWithoutNetwork, 4);
  assert.equal(report.sizes.payloadBytes, 4 + 2 * f.native.length + f.cached.length + f.uncached.length);
  assert.equal(report.sizes.deduplicatedByContentIdentityBytes, report.sizes.payloadBytes - f.native.length);
  assert.equal(report.sizes.uncachedOrInvalidLfsPayloadBytes, f.uncached.length, 'measure payload, not pointer-text bytes');
  assert.equal(report.requiredSourcesMaterialized, false);
  assert.equal(report.strictPass, false, 'recoverability is not a materialized build');
  assert.deepEqual(report.entries.find(entry => entry.publicPath === '/cached.bin').contentIdentity, { algorithm: 'sha256', value: hash(f.cached) });
  assert.equal(report.entries.find(entry => entry.publicPath === '/native-a.bin').contentIdentity.algorithm, 'git-object-sha1');
  assert.deepEqual(snapshot(f.root), before, 'Git index, source files and LFS cache remain untouched');
});

test('same-size corrupted LFS cache fails SHA verification and cannot count as locally recoverable', t => {
  const f = fixture(t); write(f.root, f.cachedPath, Buffer.alloc(f.cached.length, 42));
  const report = auditDlcMaterialization({ root: f.root, reserveBytes: 0 });
  assert.equal(report.entries.find(entry => entry.publicPath === '/cached.bin').lfsCacheState, 'invalid-sha256');
  assert.equal(report.counts.verifiedLocalLfsCache, 0);
  assert.equal(report.counts.uncachedOrInvalidLfsPayloads, 2);
  assert.equal(report.strictPass, false);
});

test('truncated LFS headers and missing pointer fields never become materialized image data', t => {
  const f = fixture(t);
  for (const bytes of ['version https://git-lfs.github.com/spec/v1',
    'version https://git-lfs.github.com/spec/v1\n',
    '\uFEFFversion https://git-lfs.github.com/spec/v1\r\noid sha256:' + 'a'.repeat(64) + '\r\n']) {
    write(f.root, f.shared.sourcePath, bytes);
    const report = auditDlcMaterialization({ root: f.root, profile: profile('base'), reserveBytes: 0 });
    assert.equal(report.entries[0].localState, 'lfs-pointer');
    assert.equal(report.entries[0].malformedLfsPointer, true);
    assert.equal(report.requiredSourcesMaterialized, false); assert.equal(report.strictPass, false);
    assert.equal(report.sizes.allSizesKnown, false);
  }
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4nGN023LnPwMDAwMTAxQAACryAtmZNLxsAAAAAElFTkSuQmCC', 'base64');
  write(f.root, f.shared.sourcePath, png);
  const realImage = auditDlcMaterialization({ root: f.root, profile: profile('base'), reserveBytes: 0 });
  assert.equal(realImage.entries[0].lfsPointer, false); assert.equal(realImage.requiredSourcesMaterialized, true);
});

test('hydrated LFS files require payload SHA verification and changed-size native files lose the old dedup identity', t => {
  const f = fixture(t);
  write(f.root, f.assets[0].sourcePath, Buffer.from('new longer native sprite payload'));
  write(f.root, f.assets[1].sourcePath, f.native);
  write(f.root, f.assets[2].sourcePath, f.cached);
  write(f.root, f.assets[3].sourcePath, f.uncached);
  const report = auditDlcMaterialization({ root: f.root, reserveBytes: 0 });
  const changed = report.entries.find(entry => entry.publicPath === '/native-a.bin');
  assert.equal(changed.nativeWorkingFileSizeDiffersFromIndex, true); assert.equal(changed.contentIdentity, null);
  assert.equal(changed.expectedPayloadBytes, Buffer.byteLength('new longer native sprite payload'));
  assert.equal(report.requiredSourcesMaterialized, true); assert.equal(report.counts.remoteLfsPayloadsRequired, 0);
  assert.equal(report.strictPass, true);
  write(f.root, f.assets[3].sourcePath, Buffer.alloc(f.uncached.length, 1));
  const corrupt = auditDlcMaterialization({ root: f.root, reserveBytes: 0 });
  assert.equal(corrupt.entries.find(entry => entry.publicPath === '/uncached.bin').localState, 'invalid-lfs-payload');
  assert.equal(corrupt.requiredSourcesMaterialized, false); assert.equal(corrupt.strictPass, false);
});

test('base selection excludes optional DLC; export budgets never silently omit non-media costs', t => {
  const f = fixture(t);
  const base = auditDlcMaterialization({ root: f.root, profile: profile('base'), reserveBytes: 0 });
  assert.equal(base.counts.publishedAssets, 1); assert.equal(base.requiredSourcesMaterialized, true); assert.equal(base.strictPass, true);
  const incomplete = auditDlcMaterialization({ root: f.root, profile: profile('base'), operation: 'export-build', reserveBytes: 0 });
  assert.equal(incomplete.sizes.currentPipelineMediaOnlyEstimates['export-build'], 8);
  assert.equal(incomplete.budget.completeBudgetKnown, false); assert.equal(incomplete.strictPass, false);
  const declared = auditDlcMaterialization({ root: f.root, profile: profile('base'), operation: 'export-build', extraBytes: 0, reserveBytes: 0 });
  assert.equal(declared.budget.completeBudgetKnown, true); assert.equal(declared.strictPass, true);
  const impossible = auditDlcMaterialization({ root: f.root, profile: profile('base'), reserveBytes: Number.MAX_SAFE_INTEGER });
  assert.equal(impossible.budget.mediaLowerBoundFits, false); assert.equal(impossible.strictPass, false);
});

test('a standalone source export reports unknown missing payloads and never borrows a parent Git index', t => {
  const f = fixture(t); rmSync(path.join(f.root, '.git'), { recursive: true });
  const report = auditDlcMaterialization({ root: f.root, reserveBytes: 0 });
  assert.equal(report.entries.find(entry => entry.publicPath === '/native-a.bin').gitObjectState, 'no-own-git-index');
  assert.equal(report.sizes.allSizesKnown, false); assert.equal(report.strictPass, false);
  assert.equal(auditDlcMaterialization({ root: f.root, profile: profile('base'), reserveBytes: 0 }).strictPass, true);
});

test('symlinked sources are blocked without reading through them', t => {
  const f = fixture(t); write(f.root, 'outside.bin', 'outside-file-must-not-change');
  symlinkSync(path.join(f.root, 'outside.bin'), path.join(f.root, f.assets[0].sourcePath));
  const report = auditDlcMaterialization({ root: f.root, reserveBytes: 0 });
  assert.equal(report.entries.find(entry => entry.publicPath === '/native-a.bin').localState, 'unsafe-path');
  assert.equal(report.requiredSourcesMaterialized, false); assert.equal(report.strictPass, false);
  assert.equal(readFileSync(path.join(f.root, 'outside.bin'), 'utf8'), 'outside-file-must-not-change');
});

test('missing promisor Git objects stay missing without invoking a remote helper', t => {
  const f = fixture(t), fakeOid = 'f'.repeat(40), marker = path.join(f.root, 'remote-was-called');
  git(f.root, 'update-index', '--add', '--info-only', '--cacheinfo', `100644,${fakeOid},${f.assets[0].sourcePath}`);
  git(f.root, 'config', 'remote.origin.url', 'materializationtrap::unused');
  git(f.root, 'config', 'remote.origin.promisor', 'true');
  git(f.root, 'config', 'extensions.partialClone', 'origin');
  write(f.root, 'helpers/git-remote-materializationtrap', `#!/bin/sh\nprintf called > '${marker}'\nexit 1\n`);
  const result = spawnSync('chmod', ['+x', path.join(f.root, 'helpers/git-remote-materializationtrap')]); assert.equal(result.status, 0);
  const oldPath = process.env.PATH, oldProtocol = process.env.GIT_ALLOW_PROTOCOL;
  try {
    process.env.PATH = path.join(f.root, 'helpers') + path.delimiter + oldPath;
    process.env.GIT_ALLOW_PROTOCOL = 'materializationtrap';
    const report = auditDlcMaterialization({ root: f.root, reserveBytes: 0 });
    const unavailable = report.entries.find(entry => entry.publicPath === '/native-a.bin');
    assert.equal(unavailable.gitObjectState, 'unavailable'); assert.equal(unavailable.expectedPayloadBytes, null);
    assert.equal(report.strictPass, false); assert.equal(existsSync(marker), false, 'no lazy fetch or remote helper invocation');
  } finally {
    process.env.PATH = oldPath;
    if (oldProtocol === undefined) delete process.env.GIT_ALLOW_PROTOCOL; else process.env.GIT_ALLOW_PROTOCOL = oldProtocol;
  }
});

test('strict CLI writes only an explicit new report, exits nonzero for missing media and refuses overwrite', t => {
  const f = fixture(t), before = snapshot(f.root), reportFile = path.join(f.root, 'preflight.json');
  const byDefault = spawnSync(process.execPath, [SCRIPT, '--root', f.root, '--mode', 'selected', '--pack', 'halo'], { encoding: 'utf8' });
  assert.equal(byDefault.status, 1, 'source profiles are strict even without the explicit --strict flag');
  const result = spawnSync(process.execPath, [SCRIPT, '--root', f.root, '--mode', 'selected', '--pack', 'halo',
    '--strict', '--reserve-bytes', '0', '--json', reportFile], { encoding: 'utf8' });
  assert.equal(result.status, 1, result.stderr);
  const report = JSON.parse(readFileSync(reportFile, 'utf8'));
  assert.equal(report.requiredSourcesMaterialized, false); assert.equal(report.networkAllowed, false);
  const after = snapshot(f.root); delete after['preflight.json']; assert.deepEqual(after, before);
  const original = readFileSync(reportFile);
  const again = spawnSync(process.execPath, [SCRIPT, '--root', f.root, '--mode', 'base', '--json', reportFile], { encoding: 'utf8' });
  assert.equal(again.status, 1); assert.deepEqual(readFileSync(reportFile), original);
});
