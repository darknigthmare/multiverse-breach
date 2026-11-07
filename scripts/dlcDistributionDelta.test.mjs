import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createDlcDistributionDelta, inspectDlcDistributionDelta, applyDlcDistributionDelta } from './dlcDistributionDelta.mjs';
import { auditDlcDistribution, DLC_DISTRIBUTION_RECEIPT } from './auditDlcDistribution.mjs';
import { createDeltaFixture } from './fixtures/dlcDeltaFixture.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function ready(t) {
  const f=createDeltaFixture(t),delta=path.join(f.parent,'delta'),out=path.join(f.parent,'installed');
  const result=createDlcDistributionDelta({base:f.base,target:f.halo,out:delta});
  return {...f,delta,out,result,apply:extra=>applyDlcDistributionDelta({base:f.base,delta,out,expectedManifestSha256:result.manifestSha256,...extra}),
    inspect:extra=>inspectDlcDistributionDelta({base:f.base,delta,expectedManifestSha256:result.manifestSha256,...extra})};
}
function modifyManifest(f,mutate) {
  const file=path.join(f.delta,'delta.json'),manifest=JSON.parse(readFileSync(file)); mutate(manifest);
  const raw=JSON.stringify(manifest);writeFileSync(file,raw);return hash(raw);
}
function treeSignature(root) {
  const entries = [];
  const walk = relative => {
    for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const name = relative ? relative + '/' + entry.name : entry.name;
      if (entry.isDirectory()) { entries.push([name + '/']); walk(name); }
      else entries.push([name, hash(readFileSync(path.join(root, name)))]);
    }
  };
  walk('');
  return entries;
}
function replaceTargetFile(f, name, bytes) {
  bytes = Buffer.from(bytes);
  const manifest = JSON.parse(readFileSync(path.join(f.delta, 'delta.json')));
  const entry = manifest.files.find(file => file.path === name);
  assert.ok(entry);
  delete entry.basePath;
  Object.assign(entry, { sha256: hash(bytes), bytes: bytes.length, blob: hash(bytes) });
  writeFileSync(path.join(f.delta, 'blobs', entry.blob), bytes);
  if (name === DLC_DISTRIBUTION_RECEIPT) manifest.targetReceiptSha256 = entry.sha256;
  const used = new Set(manifest.files.filter(file => file.blob).map(file => file.blob));
  for (const blob of readdirSync(path.join(f.delta, 'blobs'))) if (!used.has(blob)) rmSync(path.join(f.delta, 'blobs', blob));
  const raw = JSON.stringify(manifest);
  writeFileSync(path.join(f.delta, 'delta.json'), raw);
  return hash(raw);
}
test('base to Halo reuses shared bytes, deduplicates publication and reconstructs an independent audited tree',t=>{
  const f=ready(t),manifest=JSON.parse(readFileSync(path.join(f.delta,'delta.json')));
  const common=readFileSync(path.join(f.base,'public/common.bin'));
  assert.equal(existsSync(path.join(f.delta,'blobs',hash(common))),false);
  assert.ok(f.result.payloadBytes<common.length);assert.ok(f.result.reusedFileCount>0);
  const source=manifest.files.find(file=>file.path==='DLC/Halo/assets/images/halo.bin');
  const published=manifest.files.find(file=>file.path==='public/images/halo.bin');
  assert.equal(source.blob,published.blob);
  const result=f.apply();assert.equal(result.passed,true);assert.deepEqual(result.packs,['halo']);
  assert.equal(auditDlcDistribution({root:f.out}).passed,true);
  assert.deepEqual(readFileSync(path.join(f.out,DLC_DISTRIBUTION_RECEIPT)),readFileSync(path.join(f.halo,DLC_DISTRIBUTION_RECEIPT)));
  writeFileSync(path.join(f.out,'public/common.bin'),'changed output');
  assert.deepEqual(readFileSync(path.join(f.base,'public/common.bin')),common);
});
test('Halo removal reconstructs base only and leaves the original installation intact',t=>{
  const f=createDeltaFixture(t),delta=path.join(f.parent,'remove'),out=path.join(f.parent,'base-again');
  const result=createDlcDistributionDelta({base:f.halo,target:f.base,out:delta});
  const applied=applyDlcDistributionDelta({base:f.halo,delta,out,expectedManifestSha256:result.manifestSha256});
  assert.deepEqual(applied.packs,[]);assert.equal(existsSync(path.join(out,'DLC/Halo')),false);
  assert.equal(existsSync(path.join(out,'public/images/halo.bin')),false);
  assert.equal(auditDlcDistribution({root:f.halo}).passed,true);
});
test('a trusted manifest hash is mandatory; mismatched bytes never produce an output',t=>{
  const f=ready(t);
  for(const expectedManifestSha256 of [undefined,'','0'.repeat(64)]) assert.throws(()=>f.apply({expectedManifestSha256}),/SHA-256|integrity/);
  assert.equal(existsSync(f.out),false);
});
test('corrupted payload fails and cleans only temporary output',t=>{
  const f=ready(t),blob=readdirSync(path.join(f.delta,'blobs'))[0];
  writeFileSync(path.join(f.delta,'blobs',blob),'corrupt');
  assert.throws(()=>f.apply(),/integrity/);assert.equal(existsSync(f.out),false);
  assert.equal(readdirSync(f.parent).some(name=>name.startsWith('.dlc-delta-')),false);
  assert.equal(auditDlcDistribution({root:f.base}).passed,true);
});
test('modified base media cannot be reused',t=>{
  const f=ready(t);writeFileSync(path.join(f.base,'public/common.bin'),'tampered');
  assert.throws(()=>f.apply(),/Invalid DLC distribution/);assert.equal(existsSync(f.out),false);
});
test('different canonical source revisions are refused',t=>{
  const f=createDeltaFixture(t),other=f.exported('different',['halo'],'2'.repeat(40));
  assert.throws(()=>createDlcDistributionDelta({base:f.base,target:other,out:path.join(f.parent,'delta')}),/source revisions/);
});
test('existing outputs and overlapping paths are refused',t=>{
  const f=ready(t);mkdirSync(f.out);writeFileSync(path.join(f.out,'keep'),'keep');
  assert.throws(()=>f.apply(),/already exists/);assert.equal(readFileSync(path.join(f.out,'keep'),'utf8'),'keep');
  assert.throws(()=>f.apply({out:path.join(f.base,'nested')}),/overlaps/);
});
test('unexpected payload files are not imported',t=>{
  const f=ready(t);writeFileSync(path.join(f.delta,'surprise.js'),'bad');
  assert.throws(()=>f.apply(),/closure/);assert.equal(existsSync(f.out),false);
});
test('symlinked payloads are refused',t=>{
  const f=ready(t),file=path.join(f.delta,'blobs',readdirSync(path.join(f.delta,'blobs'))[0]);
  rmSync(file);symlinkSync(path.join(f.base,'public/common.bin'),file);
  assert.throws(()=>f.apply(),/symlink/);assert.equal(existsSync(f.out),false);
});
test('dangling output symlinks are refused',t=>{
  const f=ready(t);symlinkSync(path.join(f.parent,'absent'),f.out);
  assert.throws(()=>f.apply(),/already exists/);
});
for(const [name,mutate,pattern] of [
  ['traversal',m=>{m.files[0].path='../outside';},/Unsafe/],
  ['duplicate',m=>{m.files.splice(1,0,m.files[0]);},/unique/],
  ['missing receipt',m=>{m.files=m.files.filter(f=>f.path!==DLC_DISTRIBUTION_RECEIPT);},/receipt/],
  ['unattested reuse',m=>{const f=m.files.find(f=>f.basePath);f.basePath='not-attested';},/unattested/],
  ['incompatible base',m=>{m.baseReceiptSha256='0'.repeat(64);},/Incompatible/],
  ['unmanaged secret',m=>{m.files[0].path='.env.local';},/Unmanaged/]
]) test('even a repinned malformed manifest refuses '+name,t=>{
  const f=ready(t),expectedManifestSha256=modifyManifest(f,mutate);
  assert.throws(()=>f.apply({expectedManifestSha256}),pattern);assert.equal(existsSync(f.out),false);
});
test('CLI creates and applies the same verified delta, and rejects duplicate arguments',t=>{
  const f=createDeltaFixture(t),delta=path.join(f.parent,'cli-delta'),out=path.join(f.parent,'cli-out');
  const script=fileURLToPath(new URL('./dlcDistributionDelta.mjs',import.meta.url));
  const run=args=>spawnSync(process.execPath,[script,...args],{encoding:'utf8'});
  const created=run(['create','--base',f.base,'--target',f.halo,'--out',delta]);assert.equal(created.status,0,created.stderr);
  const applied=run(['apply','--base',f.base,'--delta',delta,'--out',out,'--sha256',JSON.parse(created.stdout).manifestSha256]);
  assert.equal(applied.status,0,applied.stderr);assert.equal(JSON.parse(applied.stdout).passed,true);
  assert.notEqual(run(['create','--base',f.base,'--base',f.base]).status,0);
});

test('inspection verifies inputs without any writes and distinguishes transfer from reconstructed file bytes', t => {
  const f = ready(t), beforeBase = treeSignature(f.base), beforeDelta = treeSignature(f.delta);
  const originalOpen = fs.openSync;
  const blocked = ['mkdirSync', 'mkdtempSync', 'writeFileSync', 'writeSync', 'renameSync', 'rmSync', 'unlinkSync', 'appendFileSync']
    .map(name => t.mock.method(fs, name, () => { throw new Error('Inspection attempted a write: ' + name); }));
  blocked.push(t.mock.method(fs, 'openSync', (...args) => {
    const flags = args[1];
    if (typeof flags === 'number' && flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_TRUNC)) {
      throw new Error('Inspection attempted a writable open');
    }
    return originalOpen(...args);
  }));
  syncBuiltinESMExports();
  let report;
  try { report = f.inspect(); }
  finally { blocked.forEach(method => method.mock.restore()); syncBuiltinESMExports(); }
  assert.equal(report.status, 'inputs-verified');
  assert.equal(Object.hasOwn(report, 'passed'), false, 'Input inspection must not claim a completed target audit');
  assert.deepEqual(report.pendingChecks, ['reconstructed-target-distribution-audit', 'standalone-build', 'browser-playthrough-and-saves']);
  assert.ok(Object.values(report.checks).every(value => value === 'verified'));
  assert.deepEqual(report.selection, { addedPackIds: ['halo'], removedPackIds: [], retainedPackIds: [] });
  assert.equal(report.transfer.compression, 'none');
  assert.equal(report.transfer.payloadBytes, f.result.payloadBytes);
  assert.equal(report.transfer.changedBlobCount, f.result.changedBlobCount);
  assert.equal(report.transfer.manifestBytes, readFileSync(path.join(f.delta, 'delta.json')).length);
  assert.equal(report.transfer.packageBytes, report.transfer.payloadBytes + report.transfer.manifestBytes);
  const manifest = JSON.parse(readFileSync(path.join(f.delta, 'delta.json')));
  assert.equal(report.reconstruction.fileContentBytes, manifest.files.reduce((sum, file) => sum + file.bytes, 0));
  assert.equal(report.reconstruction.fileCount, manifest.files.length);
  assert.equal(report.reconstruction.reusedBytes, f.result.reusedBytes);
  assert.equal(report.reconstruction.reusedFileCount, f.result.reusedFileCount);
  assert.equal(report.reconstruction.includesFilesystemOverhead, false);
  assert.equal(report.reconstruction.baseIsRetained, true);
  assert.ok(report.reconstruction.fileContentBytes > report.transfer.packageBytes);
  assert.deepEqual(treeSignature(f.base), beforeBase);
  assert.deepEqual(treeSignature(f.delta), beforeDelta);
  assert.equal(existsSync(f.out), false);
});

for (const [name, corrupt, pattern] of [
  ['changed payload bytes', f => {
    writeFileSync(path.join(f.delta, 'blobs', readdirSync(path.join(f.delta, 'blobs'))[0]), 'changed');
    return f.result.manifestSha256;
  }, /integrity/],
  ['unexpected payload file', f => {
    writeFileSync(path.join(f.delta, 'extra.txt'), 'extra');
    return f.result.manifestSha256;
  }, /closure/],
  ['incomplete target file list', f => modifyManifest(f, manifest => {
    manifest.files = manifest.files.filter(file => file.path !== 'public/common.bin');
  }), /target file list/],
  ['invalid target receipt selection', f => {
    const receipt = JSON.parse(readFileSync(path.join(f.halo, DLC_DISTRIBUTION_RECEIPT)));
    receipt.profile.packIds = ['drop'];
    return replaceTargetFile(f, DLC_DISTRIBUTION_RECEIPT, JSON.stringify(receipt));
  }, /Unknown DLC pack ID|selection mismatch/],
  ['mismatched target receipt revision', f => {
    const receipt = JSON.parse(readFileSync(path.join(f.halo, DLC_DISTRIBUTION_RECEIPT)));
    receipt.sourceRevision = '2'.repeat(40);
    return replaceTargetFile(f, DLC_DISTRIBUTION_RECEIPT, JSON.stringify(receipt));
  }, /target receipt revision/],
  ['mismatched target profile bytes', f => {
    const receipt = JSON.parse(readFileSync(path.join(f.halo, DLC_DISTRIBUTION_RECEIPT)));
    const bytes = Buffer.from(JSON.stringify({ schemaVersion: 1, mode: 'base', packIds: [], sharedPolicy: 'preserve-all' }));
    replaceTargetFile(f, 'DLC/distribution.json', bytes);
    Object.assign(receipt.files.find(file => file.path === 'DLC/distribution.json'), { sha256: hash(bytes), bytes: bytes.length });
    return replaceTargetFile(f, DLC_DISTRIBUTION_RECEIPT, JSON.stringify(receipt));
  }, /target profile/],
]) test('inspection and application both reject ' + name + ' before creating a directory', t => {
  const f = ready(t), beforeBase = treeSignature(f.base), expectedManifestSha256 = corrupt(f);
  const names = readdirSync(f.parent).sort();
  assert.throws(() => f.inspect({ expectedManifestSha256 }), pattern);
  assert.throws(() => f.apply({ expectedManifestSha256 }), pattern);
  assert.deepEqual(readdirSync(f.parent).sort(), names);
  assert.equal(existsSync(f.out), false);
  assert.deepEqual(treeSignature(f.base), beforeBase);
});

test('inspection handles a delta with no changed blobs and no selection change', t => {
  const f = createDeltaFixture(t), delta = path.join(f.parent, 'identity-delta');
  const result = createDlcDistributionDelta({ base: f.base, target: f.base, out: delta });
  const report = inspectDlcDistributionDelta({ base: f.base, delta, expectedManifestSha256: result.manifestSha256 });
  assert.equal(report.transfer.changedBlobCount, 0);
  assert.equal(report.transfer.payloadBytes, 0);
  assert.equal(report.reconstruction.reusedFileCount, report.reconstruction.fileCount);
  assert.deepEqual(report.selection, { addedPackIds: [], removedPackIds: [], retainedPackIds: [] });
});

test('CLI exports pinned editions, inspects and applies Halo, then returns to the exact base with original trees retained', t => {
  const f = createDeltaFixture(t);
  const exportScript = fileURLToPath(new URL('./exportDlcDistribution.mjs', import.meta.url));
  const deltaScript = fileURLToPath(new URL('./dlcDistributionDelta.mjs', import.meta.url));
  const sourceRevision = '1234567890abcdef1234567890abcdef12345678';
  const run = (script, args) => {
    const result = spawnSync(process.execPath, [script, ...args], { cwd: f.source, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  const base = path.join(f.parent, 'cli-base'), halo = path.join(f.parent, 'cli-halo');
  for (const [profile, out] of [['base', base], ['halo', halo]]) {
    const result = run(exportScript, ['--profile', 'config/dlc-profiles/' + profile + '.json', '--out', out, '--source-revision', sourceRevision]);
    assert.equal(result.sourceRevision, sourceRevision);
    assert.equal(auditDlcDistribution({ root: out }).receipt.sourceRevision, sourceRevision);
  }
  const beforeBase = treeSignature(base), beforeHalo = treeSignature(halo);
  const delta = path.join(f.parent, 'cli-add-halo'), installed = path.join(f.parent, 'cli-installed');
  const created = run(deltaScript, ['create', '--base', base, '--target', halo, '--out', delta]);
  const inspection = run(deltaScript, ['inspect', '--base', base, '--delta', delta, '--sha256', created.manifestSha256]);
  assert.deepEqual(inspection.selection.addedPackIds, ['halo']);
  assert.equal(existsSync(installed), false);
  const applied = run(deltaScript, ['apply', '--base', base, '--delta', delta, '--out', installed, '--sha256', created.manifestSha256]);
  assert.equal(applied.passed, true);
  assert.deepEqual(treeSignature(installed), beforeHalo);
  const removal = path.join(f.parent, 'cli-remove-halo'), restored = path.join(f.parent, 'cli-base-restored');
  const reverse = run(deltaScript, ['create', '--base', installed, '--target', base, '--out', removal]);
  const rollback = run(deltaScript, ['inspect', '--base', installed, '--delta', removal, '--sha256', reverse.manifestSha256]);
  assert.deepEqual(rollback.selection.removedPackIds, ['halo']);
  assert.deepEqual(rollback.to.packIds, []);
  run(deltaScript, ['apply', '--base', installed, '--delta', removal, '--out', restored, '--sha256', reverse.manifestSha256]);
  assert.deepEqual(treeSignature(restored), beforeBase);
  assert.deepEqual(treeSignature(base), beforeBase);
  assert.deepEqual(treeSignature(halo), beforeHalo);
  assert.deepEqual(treeSignature(installed), beforeHalo);
  assert.equal(auditDlcDistribution({ root: restored }).passed, true);
});

test('a normal unpinned CLI export remains valid and gives an actionable diagnostic when used for a delta', t => {
  const f = createDeltaFixture(t), out = path.join(f.parent, 'standalone'), delta = path.join(f.parent, 'not-created');
  const exporter = fileURLToPath(new URL('./exportDlcDistribution.mjs', import.meta.url));
  const deltaScript = fileURLToPath(new URL('./dlcDistributionDelta.mjs', import.meta.url));
  const exported = spawnSync(process.execPath, [exporter, '--profile', 'config/dlc-profiles/base.json', '--out', out],
    { cwd: f.source, encoding: 'utf8' });
  assert.equal(exported.status, 0, exported.stderr);
  assert.equal(JSON.parse(exported.stdout).sourceRevision, null);
  assert.equal(auditDlcDistribution({ root: out }).passed, true);
  const result = spawnSync(process.execPath, [deltaScript, 'create', '--base', out, '--target', f.halo, '--out', delta],
    { cwd: f.source, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /export again with --source-revision/);
  assert.equal(existsSync(delta), false);
});

test('CLI inspection requires a trusted pin and accepts no output or duplicate options; help creates nothing', t => {
  const f = ready(t), script = fileURLToPath(new URL('./dlcDistributionDelta.mjs', import.meta.url));
  const names = readdirSync(f.parent).sort();
  const run = args => spawnSync(process.execPath, [script, ...args], { cwd: f.parent, encoding: 'utf8' });
  const common = ['inspect', '--base', f.base, '--delta', f.delta];
  for (const args of [common, [...common, '--sha256', '0'.repeat(64)],
    [...common, '--sha256', f.result.manifestSha256, '--out', f.out],
    [...common, '--sha256', f.result.manifestSha256, '--base', f.base]]) {
    assert.equal(run(args).status, 1);
  }
  const help = run(['--help']);
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /inspect --base DIR --delta DIR --sha256 TRUSTED_HASH/);
  assert.match(help.stdout, /without writing/);
  assert.match(help.stdout, /does not audit the reconstructed target/);
  assert.deepEqual(readdirSync(f.parent).sort(), names);
});
