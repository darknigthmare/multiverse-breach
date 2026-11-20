import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import childProcess from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createDlcAssetBatchPlan, DLC_BATCH_MIB, validateDlcAssetBatch, validateDlcAssetBatches, verifyDlcAssetBatchPlan } from './dlcAssetBatches.mjs';
import { auditDlcAssetBatchExport, exportDlcAssetBatch } from './exportDlcAssetBatch.mjs';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4nGN023LnPwMDAwMTAxQAACryAtmZNLxsAAAAAElFTkSuQmCC', 'base64');
const hash = value => createHash('sha256').update(value).digest('hex');
const canonical = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const reseal = value => { const { sha256: _old, ...body } = value; return { ...body, sha256: hash(canonical(body)) }; };
const profile = (ids = []) => ({ schemaVersion: 1, mode: ids === 'all' ? 'all' : ids.length ? 'selected' : 'base', packIds: ids === 'all' ? [] : ids, sharedPolicy: 'preserve-all' });
const script = fileURLToPath(new URL('./dlcAssetBatches.mjs', import.meta.url));

function fixture(t, { lfs = false, extras = 0, oversized = false, corrupt = false } = {}) {
  const parent = mkdtempSync(path.join(tmpdir(), 'dlc-batches-test-'));
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const root = path.join(parent, 'source'); mkdirSync(root);
  const write = (file, bytes) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), bytes); };
  const json = (file, value) => write(file, JSON.stringify(value) + '\n');
  const git = args => execFileSync('git', ['-C', root, ...args], { env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_LFS_SKIP_SMUDGE: '1' }, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  git(['init', '-q']); git(['config', 'user.name', 'Batch fixture']); git(['config', 'user.email', 'fixture@example.invalid']);
  write('.gitattributes', '* -filter -diff\n');
  const manifests = ['Halo', 'Drop'].map((universe, index) => ({ schemaVersion: 1, id: universe.toLowerCase(), universe,
    directory: 'DLC/' + universe, registration: 'runtime', catalogOrder: index, assetManifest: 'assets.json', modules: [] }));
  for (const manifest of manifests) {
    json(manifest.directory + '/manifest.json', manifest);
    const publicPath = '/images/' + manifest.id + '.png', sourcePath = manifest.directory + '/assets' + publicPath;
    json(manifest.directory + '/assets.json', { schemaVersion: 1, universe: manifest.universe, assets: [{ sourcePath, publicPath }], sharedDependencies: ['/images/common.png'] });
    write(sourcePath, PNG);
  }
  write('DLC/index.js', 'export const DLC_PACK_MANIFESTS=' + JSON.stringify(manifests) + ';\n');
  const assets = [{ sourcePath: 'public/images/common.png', publicPath: '/images/common.png' }];
  write('public/images/common.png', corrupt ? PNG.subarray(0, 30) : PNG);
  for (let index = 0; index < extras; index++) {
    const publicPath = '/images/extra-' + String(index).padStart(3, '0') + '.png';
    assets.push({ sourcePath: 'public' + publicPath, publicPath }); write('public' + publicPath, PNG);
  }
  const lfsOid = hash(PNG);
  if (lfs || oversized) {
    assets.push({ sourcePath: 'public/images/lfs.png', publicPath: '/images/lfs.png' });
    write('public/images/lfs.png', `version https://git-lfs.github.com/spec/v1\noid sha256:${lfsOid}\nsize ${oversized ? 300 * DLC_BATCH_MIB : PNG.length}\n`);
  }
  json('DLC/shared-assets.json', { schemaVersion: 1, assets });
  write('index.html', '<link rel="icon" href="/images/common.png?rev=1">');
  git(['add', '.']);
  git(['commit', '-qm', 'Frozen fixture']);
  return { root, parent, write, json, git, revision: git(['rev-parse', 'HEAD']), receipts: path.join(parent, 'receipts'), lfsOid };
}

test('base, selected, mixed and all plans select canonical frozen inventories and enforce count caps', async t => {
  const f = fixture(t, { extras: 42 });
  for (const [ids, count] of [[[], 43], [['halo'], 44], [['halo', 'drop'], 45], ['all', 45]]) {
    const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(ids) });
    assert.equal(plan.assetCount, count);
    assert.ok(plan.batches.every(batch => batch.assets.length <= 40 && batch.payloadBytes <= 128 * DLC_BATCH_MIB));
    assert.equal(plan.layout, 'sources');
    assert.equal(plan.runner.workingTreeVersion, 'actual-files-differ-from-recorded-git-head');
    assert.ok(plan.runner.actualRunnerFileSha256 && plan.runner.implementationSha256);
    assert.equal((await verifyDlcAssetBatchPlan({ root: f.root, plan })).sha256, plan.sha256);
  }
  await assert.rejects(createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(), limits: { maxAssets: 41 } }), /Invalid batch limits/);
});

test('one real PNG lot validates, decodes, cleans temporary payloads and resumes idempotently', async t => {
  const f = fixture(t);
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(['halo']) });
  const first = await validateDlcAssetBatch({ root: f.root, plan, batchId: 0, receiptDir: f.receipts });
  assert.equal(first.status, 'PASSED');
  assert.ok(first.assets.every(asset => asset.sha256 === hash(PNG) && asset.decode.status === 'PASSED' && asset.decode.width === 2));
  assert.ok(readdirSync(f.receipts).every(file => file.endsWith('.json')));
  const again = await validateDlcAssetBatch({ root: f.root, plan, batchId: 0, receiptDir: f.receipts });
  assert.equal(again.reused, true);
  assert.deepEqual(readFileSync(path.join(f.root, 'public/images/common.png')), PNG);
});

test('unavailable LFS does not block later lots and retry reuses verified successful asset results', async t => {
  const f = fixture(t, { lfs: true });
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile() });
  const first = await validateDlcAssetBatch({ root: f.root, plan, batchId: 0, receiptDir: f.receipts });
  assert.equal(first.status, 'UNAVAILABLE');
  assert.equal(first.assets[0].status, 'PASSED');
  assert.equal(first.assets[1].status, 'UNAVAILABLE');
  const cache = path.join(f.root, '.git/lfs/objects', f.lfsOid.slice(0, 2), f.lfsOid.slice(2, 4), f.lfsOid);
  mkdirSync(path.dirname(cache), { recursive: true }); writeFileSync(cache, PNG);
  const second = await validateDlcAssetBatch({ root: f.root, plan, batchId: 0, receiptDir: f.receipts });
  assert.equal(second.status, 'PASSED');
  assert.deepEqual(second.assets[0], first.assets[0]);
  assert.equal(second.assets[1].sha256, f.lfsOid);
  assert.equal(readFileSync(cache).length, PNG.length);
});

test('size and decode failures are explicit UNAVAILABLE results with no permanent payloads', async t => {
  const f = fixture(t, { oversized: true, corrupt: true });
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile() });
  assert.equal(plan.batches.length, 2);
  const result = await validateDlcAssetBatches({ root: f.root, plan, receiptDir: f.receipts });
  assert.equal(result.unavailableBatches, 2);
  assert.equal(result.pendingBatches, 0);
  assert.equal(result.unavailableAssets, 2);
  assert.ok(!Object.hasOwn(result, 'ready'));
  const capped = JSON.parse(readFileSync(path.join(f.receipts, 'batch-00001.json')));
  assert.equal(capped.assets[0].code, 'MAX_ASSET_BYTES_EXCEEDED');
  const out = path.join(f.parent, 'oversized-export');
  await assert.rejects(exportDlcAssetBatch({ root: f.root, plan, batchId: 1, out }), /unavailable or oversized assets/);
  assert.deepEqual(readdirSync(f.parent).sort(), ['receipts', 'source']);
});

test('tampered manifests and receipts, changed options and unowned receipt files fail before cleanup', async t => {
  const f = fixture(t);
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile() });
  await validateDlcAssetBatch({ root: f.root, plan, batchId: 0, receiptDir: f.receipts });
  const altered = structuredClone(plan);
  altered.batches[0].assets[0].publicPath = '/generic.png'; altered.batches[0] = reseal(altered.batches[0]);
  await assert.rejects(verifyDlcAssetBatchPlan({ root: f.root, plan: reseal(altered) }), /differs from frozen Git metadata/);
  const changed = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(), limits: { maxAssets: 3 } });
  await assert.rejects(validateDlcAssetBatch({ root: f.root, plan: changed, batchId: 0, receiptDir: f.receipts }), /different plan or options/);
  const user = path.join(f.receipts, 'user-notes.txt'); writeFileSync(user, 'keep');
  await assert.rejects(validateDlcAssetBatch({ root: f.root, plan, batchId: 0, receiptDir: f.receipts }), /unowned user files/);
  assert.equal(readFileSync(user, 'utf8'), 'keep'); rmSync(user);
  const receiptPath = path.join(f.receipts, 'batch-00000.json');
  const receipt = JSON.parse(readFileSync(receiptPath)); receipt.assets[0].sha256 = 'f'.repeat(64);
  writeFileSync(receiptPath, JSON.stringify(receipt));
  await assert.rejects(validateDlcAssetBatch({ root: f.root, plan, batchId: 0, receiptDir: f.receipts }), /integrity differs/);
});

test('bounded passes continue from pending lots and CLI rejects an invalid bound', async t => {
  const f = fixture(t, { extras: 2 });
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(), limits: { maxAssets: 1 } });
  const first = await validateDlcAssetBatches({ root: f.root, plan, receiptDir: f.receipts, maxBatches: 1 });
  assert.equal(first.passedBatches, 1); assert.equal(first.pendingBatches, 2);
  const rest = await validateDlcAssetBatches({ root: f.root, plan, receiptDir: f.receipts });
  assert.equal(rest.passedBatches, 3); assert.equal(rest.pendingBatches, 0);
  await assert.rejects(validateDlcAssetBatches({ root: f.root, plan, receiptDir: f.receipts, maxBatches: Number.NaN }), /positive integer/);
  const cli = spawnSync(process.execPath, [script, 'validate', '--plan', 'unused.json', '--receipts', f.receipts, '--unknown', 'oops'], { cwd: f.root, encoding: 'utf8' });
  assert.notEqual(cli.status, 0); assert.match(cli.stderr, /Unknown or duplicate/);
});

test('a loaded plan is canonically checked once across two batches and cached mutations still fail', async t => {
  const f = fixture(t, { extras: 1 });
  const created = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(), limits: { maxAssets: 1 } });
  const loaded = JSON.parse(JSON.stringify(created));
  let snapshots = 0;
  const execute = childProcess.execFileSync;
  const mock = t.mock.method(childProcess, 'execFileSync', (command, args, ...rest) => {
    if (command === 'git' && args.includes('ls-tree')) snapshots++;
    return execute(command, args, ...rest);
  });
  syncBuiltinESMExports();
  try {
    await validateDlcAssetBatch({ root: f.root, plan: loaded, batchId: 0, receiptDir: f.receipts });
    await validateDlcAssetBatch({ root: f.root, plan: loaded, batchId: 1, receiptDir: f.receipts });
    assert.equal(snapshots, 1, 'only the first loaded-plan check extracts canonical metadata');
    loaded.batches[0].assets[0].publicPath = '/tampered.png';
    await assert.rejects(verifyDlcAssetBatchPlan({ root: f.root, plan: loaded }), /integrity differs/);
  } finally { mock.mock.restore(); syncBuiltinESMExports(); }
  const originalRead = fs.readFileSync;
  const changedCode = t.mock.method(fs, 'readFileSync', (...args) => {
    const value = originalRead(...args);
    return String(args[0]) === script ? Buffer.concat([Buffer.from(value), Buffer.from('\n// simulated changed runner\n')]) : value;
  });
  syncBuiltinESMExports();
  try { await assert.rejects(verifyDlcAssetBatchPlan({ root: f.root, plan: created }), /Actual runner files changed/); }
  finally { changedCode.mock.restore(); syncBuiltinESMExports(); }
});

test('CLI plans and validates a real canonical PNG batch then resumes without materializing it again', t => {
  const f = fixture(t);
  const planPath = path.join(f.parent, 'plan.json');
  const run = args => spawnSync(process.execPath, [script, ...args], { cwd: f.root, encoding: 'utf8' });
  const planned = run(['plan', '--revision', f.revision, '--profile', 'base', '--out', planPath]);
  assert.equal(planned.status, 0, planned.stderr);
  assert.equal(JSON.parse(planned.stdout).assets, 1);
  const first = run(['validate', '--plan', planPath, '--receipts', f.receipts, '--batch', 'all', '--max-batches', '1']);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(JSON.parse(first.stdout).passedBatches, 1);
  const again = run(['validate', '--plan', planPath, '--receipts', f.receipts, '--batch', 'all']);
  assert.equal(again.status, 0, again.stderr);
  assert.equal(JSON.parse(again.stdout).attemptedBatches, 0);
  const receipt = JSON.parse(readFileSync(path.join(f.receipts, 'batch-00000.json')));
  assert.equal(receipt.assets[0].sha256, hash(PNG));
});

test('CLI exports canonical private and shared assets when they are missing from the checkout', async t => {
  const f = fixture(t);
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(['halo']) });
  const planPath = path.join(f.parent, 'plan.json');
  writeFileSync(planPath, JSON.stringify(plan));
  const privateAsset = 'DLC/Halo/assets/images/halo.png';
  rmSync(path.join(f.root, privateAsset));
  const out = path.join(f.parent, 'portable-batch');
  const exporter = fileURLToPath(new URL('./exportDlcAssetBatch.mjs', import.meta.url));
  const run = args => spawnSync(process.execPath, [exporter, ...args], { cwd: f.root, encoding: 'utf8' });
  const exported = run(['--plan', planPath, '--batch', '00000', '--out', out]);
  assert.equal(exported.status, 0, exported.stderr);
  const { receiptSha256, assets, payloadBytes } = JSON.parse(exported.stdout);
  assert.equal(assets, 2);
  assert.equal(payloadBytes, 2 * PNG.length);
  assert.deepEqual(readFileSync(path.join(out, privateAsset)), PNG);
  assert.deepEqual(readFileSync(path.join(out, 'public/images/common.png')), PNG);
  assert.equal(existsSync(path.join(out, 'public/images/halo.png')), false, 'private payload is exported once');
  assert.equal(existsSync(path.join(f.root, privateAsset)), false);
  const checked = run(['--check', out, '--expected-receipt-sha256', receiptSha256]);
  assert.equal(checked.status, 0, checked.stderr);
  assert.equal(JSON.parse(checked.stdout).receiptSha256, receiptSha256);
  const receipt = JSON.parse(readFileSync(path.join(out, 'batch-export.json')));
  assert.deepEqual(receipt.assets.map(asset => [asset.sourcePath, asset.publicPath, asset.decode.status, asset.sha256]), [
    ['public/images/common.png', '/images/common.png', 'PASSED', hash(PNG)],
    [privateAsset, '/images/halo.png', 'PASSED', hash(PNG)],
  ]);
});

test('unavailable LFS aborts batch export without a partial delivery and a verified cache allows retry', async t => {
  const f = fixture(t, { lfs: true });
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile() });
  const out = path.join(f.parent, 'portable-batch');
  const options = { root: f.root, plan, batchId: 0, out };
  await assert.rejects(exportDlcAssetBatch(options), { code: 'LFS_UNAVAILABLE' });
  assert.deepEqual(readdirSync(f.parent), ['source']);
  const cache = path.join(f.root, '.git/lfs/objects', f.lfsOid.slice(0, 2), f.lfsOid.slice(2, 4), f.lfsOid);
  mkdirSync(path.dirname(cache), { recursive: true }); writeFileSync(cache, PNG);
  assert.equal((await exportDlcAssetBatch(options)).assets, 2);
  const receipt = JSON.parse(readFileSync(path.join(out, 'batch-export.json')));
  assert.equal(receipt.assets.find(asset => asset.publicPath === '/images/lfs.png').sourceKind, 'core-lfs-cache');
  assert.deepEqual(readFileSync(path.join(out, 'public/images/lfs.png')), PNG);
  assert.deepEqual(readFileSync(cache), PNG);
  assert.match(readFileSync(path.join(f.root, 'public/images/lfs.png'), 'utf8'), /^version https:\/\/git-lfs/);
});

test('batch output commits once under concurrency and portable audits detect tampering', async t => {
  const f = fixture(t);
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile() });
  const out = path.join(f.parent, 'portable-batch');
  const options = { root: f.root, plan, batchId: 0, out };
  const outcomes = await Promise.allSettled([exportDlcAssetBatch(options), exportDlcAssetBatch(options)]);
  const delivered = outcomes.filter(result => result.status === 'fulfilled');
  assert.equal(delivered.length, 1);
  assert.deepEqual(readdirSync(f.parent).sort(), ['portable-batch', 'source']);
  const expectedReceiptSha256 = delivered[0].value.receiptSha256;
  const media = path.join(out, 'public/images/common.png');
  const receipt = path.join(out, 'batch-export.json');
  const original = readFileSync(receipt);
  writeFileSync(receipt, Buffer.concat([original, Buffer.from('\n')]));
  await assert.rejects(auditDlcAssetBatchExport({ directory: out, expectedReceiptSha256 }), /receipt hash differs/);
  writeFileSync(receipt, JSON.stringify({ ...JSON.parse(original), batchId: 12345 }));
  await assert.rejects(auditDlcAssetBatchExport({ directory: out }), /Invalid batch export receipt/);
  writeFileSync(receipt, original);
  writeFileSync(media, Buffer.alloc(PNG.length));
  await assert.rejects(auditDlcAssetBatchExport({ directory: out, expectedReceiptSha256 }), /payload differs/);
  rmSync(media);
  symlinkSync(path.join(f.root, 'public/images/common.png'), media);
  await assert.rejects(auditDlcAssetBatchExport({ directory: out, expectedReceiptSha256 }), /refuses a symlink/);
  rmSync(media);
  writeFileSync(media, PNG);
  writeFileSync(path.join(out, 'unrecorded.png'), PNG);
  await assert.rejects(auditDlcAssetBatchExport({ directory: out, expectedReceiptSha256 }), /file inventory differs/);
});
