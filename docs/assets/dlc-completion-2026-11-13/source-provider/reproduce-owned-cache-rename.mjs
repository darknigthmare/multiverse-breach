// Diagnostic fixture only. Does not edit the provider, real assets or receipts.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import promises from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDlcBatchAssetSource } from '../../../../scripts/dlcBatchAssetSource.mjs';

const base = path.dirname(fileURLToPath(import.meta.url));
const providerPath = fileURLToPath(new URL('../../../../scripts/dlcBatchAssetSource.mjs', import.meta.url));
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dlc-cache-rename-repro-'));
const repo = path.join(root, 'repo'); fs.mkdirSync(repo);
const payload = Buffer.alloc(4096, 67), sha256 = createHash('sha256').update(payload).digest('hex');
const sourcePath = 'DLC/Halo/assets/rename-fixture.bin';
const git = (...args) => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8', env: { ...process.env, GIT_NO_LAZY_FETCH: '1' } });
  assert.equal(result.status, 0); return result.stdout.trim();
};
const write = (file, bytes) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); };
write(path.join(repo, sourcePath), `version https://git-lfs.github.com/spec/v1\noid sha256:${sha256}\nsize ${payload.length}\n`);
git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
git('add', '.'); git('commit', '-qm', 'deterministic rename fixture'); const revision = git('rev-parse', 'HEAD');
const fake = path.join(root, 'fake-lfs.mjs');
write(fake, `import fs from 'node:fs'; import path from 'node:path';
const args=process.argv.slice(2),storage=args.find(a=>a.startsWith('lfs.storage=')).slice(12);
for await (const chunk of process.stdin) {};
fs.mkdirSync(path.join(storage,'incomplete'),{recursive:true});fs.mkdirSync(path.join(storage,'objects'),{recursive:true});
const bytes=Buffer.alloc(4096,67);fs.writeFileSync(path.join(storage,'incomplete','transfer.tmp'),bytes);
process.stdout.write(bytes);setTimeout(()=>{},1000);
`);
const originalLstat = promises.lstat;
let source, observed = null, caughtCode = null, ownedRootCleaned = false;
try {
  source = await createDlcBatchAssetSource({ repoRoot: repo, revision, parentTmpDir: root,
    maxTempBytes: 1024 * 1024, maxAssetBytes: 1024 * 1024, allowLfsFetch: true }, {
    spawnLfs: (args, options) => spawn(process.execPath, [fake, ...args], options)
  });
  promises.lstat = async function (file, ...args) {
    if (!observed && String(file).endsWith(path.join('incomplete', 'transfer.tmp'))) {
      const old = fs.lstatSync(file), final = path.join(path.dirname(path.dirname(String(file))), 'objects', 'payload');
      const stack = new Error().stack;
      fs.renameSync(file, final); const after = fs.lstatSync(final);
      observed = { interceptedInsideMeasuredFiles: stack.includes('measuredFiles'),
        transition: 'owned incomplete file renamed atomically to owned object file',
        regularFile: old.isFile() && after.isFile(), sameInode: old.ino === after.ino,
        beforeInode: old.ino, afterInode: after.ino, payloadBytes: after.size,
        symlinkOrForeignFileIntroduced: false };
      try { await originalLstat(file, ...args); } catch (error) { observed.originalFilesystemError = error.code; throw error; }
    }
    return originalLstat(file, ...args);
  };
  syncBuiltinESMExports();
  try { await source.materialize(sourcePath); } catch (error) { caughtCode = error.code; }
  assert.equal(observed?.interceptedInsideMeasuredFiles, true);
  assert.equal(observed.originalFilesystemError, 'ENOENT');
  assert.equal(caughtCode, 'OWNER_GUARD_FAILED');
  promises.lstat = originalLstat; syncBuiltinESMExports();
  await source.close(); ownedRootCleaned = !fs.existsSync(source.ownedRoot);
  const report = { schemaVersion: 1, recordedAt: new Date().toISOString(), fixtureOnly: true,
    providerSha256: createHash('sha256').update(fs.readFileSync(providerPath)).digest('hex'),
    fixturePayloadSha256: sha256, fixturePayloadBytes: payload.length,
    caughtCode, observed, ownedRootCleaned, sourceProviderModified: false,
    realAssetsOrReceiptsModified: false, networkUsed: false,
    conclusion: 'The active cache-size monitor treats an ordinary atomic rename ENOENT as an ownership violation.' };
  fs.writeFileSync(path.join(base, 'owned-cache-rename-reproduction.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  promises.lstat = originalLstat; syncBuiltinESMExports();
  if (source && !ownedRootCleaned) { try { await source.close(); } catch {} }
  fs.rmSync(root, { recursive: true, force: true });
}
