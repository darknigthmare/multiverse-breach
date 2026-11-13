import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { assertDlcBuildDirectory, auditDlcBuiltMedia, buildDlcDistribution } from './buildDlcDistribution.mjs';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4nGN023LnPwMDAwMTAxQAACryAtmZNLxsAAAAAElFTkSuQmCC', 'base64');
const OTHER_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGO8E2Xzn4GBgYGJAQoAJegCdUefwNAAAAAASUVORK5CYII=', 'base64');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

function fixture(t) {
  const parent = mkdtempSync(path.join(tmpdir(), 'dlc-build-output-'));
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const root = path.join(parent, 'export');
  mkdirSync(root);
  const write = (file, bytes = PNG) => {
    const target = path.join(root, file);
    mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, bytes);
  };
  return { root, parent, write };
}
const asset = (publicPath = '/images/canonical.png') => ({ publicPath, bytes: PNG.length, sha256: sha(PNG) });

test('build output accepts an absent or regular dist without creating or emptying it', t => {
  const f = fixture(t);
  assert.equal(assertDlcBuildDirectory({ root: f.root }), path.join(f.root, 'dist'));
  assert.equal(existsSync(path.join(f.root, 'dist')), false);
  f.write('dist/keep.txt', 'keep');
  assert.equal(assertDlcBuildDirectory({ root: f.root }), path.join(f.root, 'dist'));
  assert.equal(readFileSync(path.join(f.root, 'dist/keep.txt'), 'utf8'), 'keep');
});

test('a dist symlink is refused by the build entry point before Vite can empty its target', async t => {
  const f = fixture(t);
  const outside = path.join(f.parent, 'unrelated'); mkdirSync(outside);
  writeFileSync(path.join(outside, 'keep.txt'), 'keep');
  symlinkSync(outside, path.join(f.root, 'dist'));
  // No receipt/config exists: this must fail on the output guard, before any
  // source audit or real build, and must preserve the unrelated directory.
  await assert.rejects(buildDlcDistribution({ root: f.root }), /symlink/);
  assert.equal(readFileSync(path.join(outside, 'keep.txt'), 'utf8'), 'keep');
});

test('build output rejects files and symlinked root ancestors', t => {
  const f = fixture(t);
  f.write('dist', 'keep');
  assert.throws(() => assertDlcBuildDirectory({ root: f.root }), /Unexpected distribution file type/);
  assert.equal(readFileSync(path.join(f.root, 'dist'), 'utf8'), 'keep');
  const alias = path.join(f.parent, 'alias'); symlinkSync(f.root, alias);
  assert.throws(() => assertDlcBuildDirectory({ root: alias }), /must not contain symlinks/);
});

test('built publication retains the exact canonical PNG bytes and refuses changed or missing images', t => {
  const f = fixture(t);
  f.write('dist/images/canonical.png');
  f.write('dist/assets/app.js', 'export{};');
  assert.deepEqual(auditDlcBuiltMedia({ root: f.root, assets: [asset()] }), { media: 1, files: 2 });
  assert.deepEqual(readFileSync(path.join(f.root, 'dist/images/canonical.png')), PNG);
  f.write('dist/images/canonical.png', OTHER_PNG);
  assert.throws(() => auditDlcBuiltMedia({ root: f.root, assets: [asset()] }), /Built distribution media differs/);
  rmSync(path.join(f.root, 'dist/images/canonical.png'));
  assert.throws(() => auditDlcBuiltMedia({ root: f.root, assets: [asset()] }), /ENOENT/);
});

test('built publication refuses symlinked media ancestors even when the target bytes match', t => {
  const f = fixture(t);
  const outside = path.join(f.parent, 'images'); mkdirSync(outside);
  writeFileSync(path.join(outside, 'canonical.png'), PNG);
  mkdirSync(path.join(f.root, 'dist')); symlinkSync(outside, path.join(f.root, 'dist/images'));
  assert.throws(() => auditDlcBuiltMedia({ root: f.root, assets: [asset()] }), /symlink/);
  assert.deepEqual(readFileSync(path.join(outside, 'canonical.png')), PNG);
});
