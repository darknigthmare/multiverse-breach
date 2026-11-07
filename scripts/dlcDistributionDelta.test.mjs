import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createDlcDistributionDelta, applyDlcDistributionDelta } from './dlcDistributionDelta.mjs';
import { auditDlcDistribution, DLC_DISTRIBUTION_RECEIPT } from './auditDlcDistribution.mjs';
import { createDeltaFixture } from './fixtures/dlcDeltaFixture.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function ready(t) {
  const f=createDeltaFixture(t),delta=path.join(f.parent,'delta'),out=path.join(f.parent,'installed');
  const result=createDlcDistributionDelta({base:f.base,target:f.halo,out:delta});
  return {...f,delta,out,result,apply:extra=>applyDlcDistributionDelta({base:f.base,delta,out,expectedManifestSha256:result.manifestSha256,...extra})};
}
function modifyManifest(f,mutate) {
  const file=path.join(f.delta,'delta.json'),manifest=JSON.parse(readFileSync(file)); mutate(manifest);
  const raw=JSON.stringify(manifest);writeFileSync(file,raw);return hash(raw);
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
