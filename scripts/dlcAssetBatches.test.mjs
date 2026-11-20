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
import { applyDlcAssetBatch, auditDlcAssetBatchAssembly } from './applyDlcAssetBatch.mjs';

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

test('portable CLI assembles selected batches, verifies the tree and reuses completed bytes', async t => {
  const f = fixture(t, { extras: 2 });
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(['halo']), limits: { maxAssets: 2 } });
  const exports = [];
  for (const [i, batch] of plan.batches.entries()) {
    exports.push(await exportDlcAssetBatch({ root: f.root, plan, batchId: batch.id, out: path.join(f.parent, 'lot-' + i) }));
  }
  const out = path.join(f.parent, 'assembly');
  const script = fileURLToPath(new URL('./applyDlcAssetBatch.mjs', import.meta.url));
  const run = args => spawnSync(process.execPath, [script, ...args], { cwd: f.parent, encoding: 'utf8' });
  const assemble = delivery => run(['--batch', delivery.out, '--out', out, '--receipt-sha256', delivery.receiptSha256]);
  const planPath = path.join(f.parent, 'plan.json');
  writeFileSync(planPath, JSON.stringify(plan));
  const checkComplete = () => run(['--check', out, '--plan', planPath, '--expected-plan-sha256', plan.sha256, '--require-complete']);
  for (const [i, delivery] of exports.entries()) {
    const applied = assemble(delivery);
    assert.equal(applied.status, 0, applied.stderr);
    assert.equal(JSON.parse(applied.stdout).copiedAssets, 2);
    if (i === 0) {
      const blocked = checkComplete();
      assert.equal(blocked.status, 1, blocked.stderr);
      const result = JSON.parse(blocked.stdout);
      assert.deepEqual(result.pendingBatches, []);
      assert.deepEqual(result.coverage.missingBatchIds, ['00001']);
      assert.equal(result.coverage.mediaPlanComplete, false);
    }
  }
  const reapplied = assemble(exports[0]);
  assert.equal(reapplied.status, 0, reapplied.stderr);
  assert.equal(JSON.parse(reapplied.stdout).copiedAssets, 0);
  assert.equal(JSON.parse(reapplied.stdout).reusedAssets, 2);
  const checked = run(['--check', out, '--expected-plan-sha256', plan.sha256]);
  assert.equal(checked.status, 0, checked.stderr);
  assert.deepEqual(JSON.parse(checked.stdout), { sourceRevision: f.revision, planSha256: plan.sha256, appliedBatches: 2,
    pendingBatches: [], presentAssets: 4, payloadBytes: 4 * PNG.length });
  const complete = checkComplete();
  assert.equal(complete.status, 0, complete.stderr);
  assert.deepEqual(JSON.parse(complete.stdout).coverage, { plannedBatches: 2, plannedAssets: 4, plannedPayloadBytes: 4 * PNG.length,
    unavailableAssets: 0, missingBatchIds: [], mediaPlanComplete: true });
  writeFileSync(planPath, JSON.stringify({ ...plan, assetCount: plan.assetCount - 1 }));
  const alteredPlan = checkComplete();
  assert.equal(alteredPlan.status, 1);
  assert.match(alteredPlan.stderr, /pinned plan hash/);
  assert.deepEqual(readFileSync(path.join(out, 'DLC/Halo/assets/images/halo.png')), PNG);
  assert.equal(existsSync(path.join(out, 'public/images/halo.png')), false);
});

test('an interrupted assembly resumes missing assets and preserves conflicting files and plans', async t => {
  const f = fixture(t, { extras: 2 });
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(['halo']), limits: { maxAssets: 2 } });
  const out = path.join(f.parent, 'assembly');
  const apply = item => applyDlcAssetBatch({ directory: item.out, expectedReceiptSha256: item.receiptSha256, out });
  const select = (plan, batchId, name) => exportDlcAssetBatch({ root: f.root, plan, batchId, out: path.join(f.parent, name) });
  const first = await select(plan, 0, 'first');
  const next = await select(plan, 1, 'next');
  const foreignPlan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(['drop']) });
  const foreign = await select(foreignPlan, 0, 'foreign');
  const user = path.join(f.parent, 'user');
  mkdirSync(user); writeFileSync(path.join(user, 'keep'), 'keep');
  await assert.rejects(applyDlcAssetBatch({ directory: first.out, expectedReceiptSha256: first.receiptSha256, out: user }), /files without a journal/);
  assert.deepEqual(readdirSync(user), ['keep']);
  await apply(first);
  await assert.rejects(apply(foreign), /Assembly journal differs: state.json/);
  const [available, conflicting] = plan.batches[1].assets.map(asset => path.join(out, asset.sourcePath));
  const sentinel = Buffer.alloc(PNG.length);
  mkdirSync(path.dirname(conflicting), { recursive: true }); writeFileSync(conflicting, sentinel);
  await assert.rejects(apply(next), /Batch export payload differs/);
  assert.deepEqual(readFileSync(conflicting), sentinel);
  assert.deepEqual(readFileSync(available), PNG);
  rmSync(conflicting);
  assert.deepEqual((await auditDlcAssetBatchAssembly({ directory: out, expectedPlanSha256: plan.sha256 })).pendingBatches, ['00001']);
  const resumed = await apply(next);
  assert.equal(resumed.copiedAssets, 1);
  assert.equal(resumed.reusedAssets, 1);
  const after = await auditDlcAssetBatchAssembly({ directory: out });
  assert.deepEqual(after.pendingBatches, []);
  assert.equal(after.appliedBatches, 2);
  assert.equal(after.presentAssets, 4);
});

test('concurrent appends with different sources for one public URL leave one intact batch', async t => {
  const f = fixture(t, { extras: 1 });
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile(), limits: { maxAssets: 1 } });
  const exportAsset = batchId => exportDlcAssetBatch({ root: f.root, plan, batchId, out: path.join(f.parent, 'lot-' + batchId) });
  const first = await exportAsset(0);
  const second = await exportAsset(1);
  const firstAsset = JSON.parse(readFileSync(path.join(first.out, 'batch-export.json'))).assets[0];
  const secondReceiptFile = path.join(second.out, 'batch-export.json');
  const changed = JSON.parse(readFileSync(secondReceiptFile));
  rmSync(path.join(second.out, changed.assets[0].sourcePath));
  const privateSource = 'DLC/Drop/assets' + firstAsset.publicPath;
  const privateFile = path.join(second.out, privateSource);
  mkdirSync(path.dirname(privateFile), { recursive: true });
  writeFileSync(privateFile, PNG);
  changed.assets = [{ ...firstAsset, sourcePath: privateSource }];
  const altered = JSON.stringify(changed);
  writeFileSync(secondReceiptFile, altered);
  second.receiptSha256 = hash(altered);
  const out = path.join(f.parent, 'assembly');
  const outcomes = await Promise.allSettled([first, second].map(item => applyDlcAssetBatch({ directory: item.out,
    expectedReceiptSha256: item.receiptSha256, out })));
  assert.equal(outcomes.filter(item => item.status === 'fulfilled').length, 1);
  assert.match(outcomes.find(item => item.status === 'rejected').reason.message, /New batch media collide/);
  const audit = await auditDlcAssetBatchAssembly({ directory: out, expectedPlanSha256: plan.sha256 });
  assert.deepEqual(audit.pendingBatches, []);
  assert.equal(audit.appliedBatches, 1);
  assert.equal(audit.presentAssets, 1);
});

test('plan coverage compares native bytes and rejects a locally coherent replacement', async t => {
  const f = fixture(t);
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision: f.revision, profile: profile() });
  const lot = await exportDlcAssetBatch({ root: f.root, plan, batchId: 0, out: path.join(f.parent, 'lot') });
  const out = path.join(f.parent, 'assembly');
  await applyDlcAssetBatch({ directory: lot.out, expectedReceiptSha256: lot.receiptSha256, out });
  const options = { directory: out, expectedPlanSha256: plan.sha256, plan };
  assert.equal((await auditDlcAssetBatchAssembly(options)).coverage.mediaPlanComplete, true);
  const intentPath = path.join(out, '.dlc-batches/intent-00000.json');
  const intent = JSON.parse(readFileSync(intentPath));
  const asset = intent.assets[0];
  const replacement = Buffer.alloc(PNG.length);
  writeFileSync(path.join(out, asset.sourcePath), replacement);
  asset.sha256 = hash(replacement);
  const changed = JSON.stringify(intent);
  writeFileSync(intentPath, changed);
  writeFileSync(path.join(out, '.dlc-batches/batch-00000.done'), hash(changed) + '\n');
  await assert.rejects(auditDlcAssetBatchAssembly(options), /differs from the planned Git blob/);
  intent.assets[0].gitBlobOid = '1'.repeat(40);
  const wrongIdentity = JSON.stringify(intent);
  writeFileSync(intentPath, wrongIdentity);
  writeFileSync(path.join(out, '.dlc-batches/batch-00000.done'), hash(wrongIdentity) + '\n');
  await assert.rejects(auditDlcAssetBatchAssembly(options), /differs from planned media/);
});

test('a compact distribution publishes complete assembled media without hydrating its source checkout', async t => {
  const f = fixture(t);
  const selected = profile(['halo']);
  const realMedia = process.env.DLC_ASSEMBLY_REAL_MEDIA_FIXTURE === '1';
  const commonMedia = realMedia ? readFileSync(new URL('../public/favicon.png', import.meta.url)) : PNG;
  const packMedia = realMedia ? readFileSync(new URL('../DLC/Halo/assets/sprites/generated/heroes/halo/noble-six.png', import.meta.url)) : PNG;
  f.write('public/images/common.png', commonMedia);
  f.write('DLC/Halo/assets/images/halo.png', packMedia);
  f.json('config/dlc-profiles/halo.json', selected);
  f.json('package.json', { type: 'module', name: 'compact-dlc-fixture' });
  f.json('DLC/content-identities.json', { schemaVersion: 1, indexes: { universes: { Halo: 0, Drop: 1 } } });
  const manifests = ['Halo', 'Drop'].map(universe => {
    const directory = 'DLC/' + universe;
    const manifest = JSON.parse(readFileSync(path.join(f.root, directory, 'manifest.json')));
    manifest.modules = [{ path: 'data/runtime.js', runtimeAdapter: 'src/game/catalog.js' }];
    f.json(directory + '/manifest.json', manifest);
    f.write(directory + '/index.js', 'export * from "./data/runtime.js";\n');
    f.write(directory + '/data/runtime.js', `export const ${universe.toUpperCase()}_MEDIA = ["/images/${manifest.id}.png"];\n`);
    return manifest;
  });
  f.write('DLC/index.js', 'export const DLC_PACK_MANIFESTS=' + JSON.stringify(manifests) + ';\n');
  f.write('src/game/catalog.js', [
    'import { HALO_MEDIA } from "../../DLC/Halo/data/runtime.js";',
    'import { DROP_MEDIA } from "../../DLC/Drop/data/runtime.js";',
    'export const MEDIA = [...HALO_MEDIA, ...DROP_MEDIA];',
  ].join('\n') + '\n');
  f.write('vite.config.js', 'export default {};\n');
  const html = '<link rel="icon" href="/images/common.png"><main></main><script type="module" src="/src/main.js"></script>';
  f.write('index.html', html);
  f.write('src/main.js', 'import { MEDIA } from "./game/catalog.js";\nfor (const src of MEDIA) {\n'
    + '  const image = new Image(); image.src = src; document.querySelector("main").append(image);\n}\n');
  f.git(['add', '.']); f.git(['commit', '-qm', 'Compact distribution fixture']);
  const revision = f.git(['rev-parse', 'HEAD']);
  const plan = await createDlcAssetBatchPlan({ root: f.root, revision, profile: selected, limits: { maxAssets: 1 } });
  const assembly = path.join(f.parent, 'assembly');
  const { exportDlcDistribution, exportDlcDistributionFromAssembly } = await import('./exportDlcDistribution.mjs');
  const { buildDlcDistribution } = await import('./buildDlcDistribution.mjs');
  const out = path.join(f.parent, 'distribution');
  const options = { root: f.root, profile: selected, sourceRevision: revision, documentation: 'runtime', out };
  const media = { ...options, assemblyRoot: assembly, mediaPlan: plan, mediaPlanSha256: plan.sha256 };
  for (const [index, batch] of plan.batches.entries()) {
    const lot = await exportDlcAssetBatch({ root: f.root, plan, batchId: batch.id, out: path.join(f.parent, 'lot-' + batch.id) });
    await applyDlcAssetBatch({ directory: lot.out, out: assembly, expectedReceiptSha256: lot.receiptSha256 });
    if (index === 0) {
      await assert.rejects(exportDlcDistributionFromAssembly(media), /do not cover the pinned distribution plan/);
      assert.equal(existsSync(out), false);
    }
  }
  const legacy = exportDlcDistribution({ ...options, out: path.join(f.parent, 'checkout-distribution') });
  const checkoutMedia = plan.batches.flatMap(batch => batch.assets).map(({ sourcePath }) => path.join(f.root, sourcePath));
  for (const file of checkoutMedia) rmSync(file);
  assert.throws(() => exportDlcDistribution(options), /ENOENT/);
  await assert.rejects(exportDlcDistributionFromAssembly({ ...media, profile: profile() }), /profile differs/);
  f.write('index.html', '<!-- changed after freezing -->\n' + html);
  await assert.rejects(exportDlcDistributionFromAssembly(media), /Source snapshot differs from the media plan: index.html/);
  f.write('index.html', html);
  const planPath = path.join(f.parent, 'media-plan.json');
  writeFileSync(planPath, JSON.stringify(plan));
  const script = fileURLToPath(new URL('./exportDlcDistribution.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [script, '--profile', 'config/dlc-profiles/halo.json', '--out', out,
    '--source-revision', revision, '--documentation', 'runtime', '--media-assembly', assembly,
    '--media-plan', planPath, '--media-plan-sha256', plan.sha256], { cwd: f.root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).mediaPlanSha256, plan.sha256);
  assert.deepEqual(JSON.parse(readFileSync(path.join(out, 'DLC/distribution-receipt.json'))), legacy.receipt);
  assert.ok(checkoutMedia.every(file => !existsSync(file)));
  const built = await buildDlcDistribution({ root: out });
  assert.equal(built.packs, 1);
  assert.equal(built.media, 2);
  assert.equal(built.dlcModuleCount, 1);
  assert.ok(built.javascriptBytes > 0);
  assert.deepEqual(readFileSync(path.join(out, 'dist/images/common.png')), commonMedia);
  assert.deepEqual(readFileSync(path.join(out, 'dist/images/halo.png')), packMedia);
  assert.equal(existsSync(path.join(out, 'dist/images/drop.png')), false);
  assert.ok(checkoutMedia.every(file => !existsSync(file)));
});
