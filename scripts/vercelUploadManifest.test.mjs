import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateVercelUploadManifest } from './auditVercelUploadManifest.mjs';
import { auditLocalPublicAssets, isGitLfsPointer, listGitTrackedPublicPaths, listPublicTreePaths } from './auditLocalPublicAssets.mjs';

const publicPaths = [
  'public/images/campaign-oc/chapter-01-atrium-v1.png',
  'public/backgrounds/lore-stages/nexus-de-convergence/rpg.webp',
  'public/backgrounds/lore-stages/nexus-de-convergence/tactics.webp'
];
const manifestFor = paths => ({ files: paths.map(path => ({ path, size: 123, sha: 'fixture' })) });

test('accepts every tracked public path plus unrelated upload files', () => {
  const manifest = manifestFor([...publicPaths, 'package.json']);
  manifest.files.push({ path: 'public/empty-file', size: 0 });
  assert.deepEqual(validateVercelUploadManifest(manifest, publicPaths), {
    manifestFileCount: 5, trackedPublicFileCount: 3, matchedPublicFileCount: 3
  });
});

test('an omitted backgrounds junction reports each missing tracked file', () => {
  assert.throws(() => validateVercelUploadManifest(manifestFor([publicPaths[0]]), publicPaths), error => {
    assert.equal(error.code, 'MISSING_PUBLIC_UPLOAD_FILES');
    assert.deepEqual(error.missingPaths, publicPaths.slice(1));
    assert.match(error.message, /missing 2 Git-tracked public file/);
    for (const path of publicPaths.slice(1)) assert.ok(error.message.includes(path));
    return true;
  });
});

test('coverage is case-sensitive exactly as on the Linux build host', () => {
  const manifest = manifestFor(publicPaths.map(path => path.replace('rpg.webp', 'RPG.webp')));
  assert.throws(() => validateVercelUploadManifest(manifest, publicPaths), error => {
    assert.deepEqual(error.missingPaths, [publicPaths[1]]);
    return true;
  });
});

test('rejects absolute paths, traversal and ambiguous separators anywhere in the upload', () => {
  for (const path of [
    '', '/public/image.png', '//server/share/image.png', 'C:/public/image.png', 'C:public/image.png',
    '\\\\server\\share\\image.png', '../secret', 'public/../secret', 'public/./image.png',
    'public\\image.png', 'public//image.png', 'public/image.png/', 'https://example.com/image.png',
    'public/image\n.png', 'public/image\0.png'
  ]) {
    assert.throws(() => validateVercelUploadManifest(manifestFor([...publicPaths, path]), publicPaths), /canonical relative path/);
  }
});

test('rejects malformed manifest objects and invalid file sizes', () => {
  for (const manifest of [null, {}, { files: {} }, { files: [null] }, { files: ['public/image.png'] }]) {
    assert.throws(() => validateVercelUploadManifest(manifest, publicPaths), /files array|file object/);
  }
  for (const size of [undefined, -1, 1.5, Infinity, '123']) {
    assert.throws(() => validateVercelUploadManifest({ files: [{ path: publicPaths[0], size }] }, publicPaths), /integer size/);
  }
});

test('rejects unsafe or empty Git path inputs instead of a vacuous pass', () => {
  const manifest = manifestFor(publicPaths);
  for (const paths of [[], null, 'public/file']) {
    assert.throws(() => validateVercelUploadManifest(manifest, paths), /non-empty list/);
  }
  assert.throws(() => validateVercelUploadManifest(manifest, ['public/../secret']), /canonical relative path/);
  assert.throws(() => validateVercelUploadManifest(manifest, ['src/main.js']), /under public/);
});

test('rejects duplicate upload or Git paths rather than hiding ambiguity', () => {
  assert.throws(() => validateVercelUploadManifest(manifestFor([...publicPaths, publicPaths[0]]), publicPaths), /Duplicate upload path/);
  assert.throws(() => validateVercelUploadManifest(manifestFor(publicPaths), [...publicPaths, publicPaths[0]]), /Duplicate Git-tracked path/);
});

test('the pure validator preserves frozen inputs, metadata, Unicode and spaces', () => {
  const paths = Object.freeze([...publicPaths, 'public/images/Entrée du Nexus.webp', 'public/images/entry two.webp']);
  const manifest = Object.freeze({ files: Object.freeze(manifestFor(paths).files.map(Object.freeze)) });
  assert.equal(validateVercelUploadManifest(manifest, paths).matchedPublicFileCount, 5);
  assert.equal(manifest.files[0].sha, 'fixture');
});

const pointer = `version https://git-lfs.github.com/spec/v1\noid sha256:${'a'.repeat(64)}\nsize 4096\n`;
const localAuditCli = fileURLToPath(new URL('./auditLocalPublicAssets.mjs', import.meta.url));
const uploadAuditCli = fileURLToPath(new URL('./auditVercelUploadManifest.mjs', import.meta.url));
const fixture = (t, files) => {
  const root = mkdtempSync(join(tmpdir(), 'multiverse-public-assets-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [path, contents] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
  }
  return root;
};
const trackPublicFiles = root => {
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['add', '--', 'public'], { cwd: root });
};

test('detects unresolved LFS headers with LF, CRLF or BOM without confusing image bytes', () => {
  assert.equal(isGitLfsPointer(pointer), true);
  assert.equal(isGitLfsPointer(Buffer.from(pointer.replaceAll('\n', '\r\n'))), true);
  assert.equal(isGitLfsPointer(`\uFEFF${pointer}`), true);
  assert.equal(isGitLfsPointer(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), false);
  assert.equal(isGitLfsPointer(`Documentation:\n${pointer}`), false);
  assert.equal(isGitLfsPointer('version https://git-lfs.github.com/spec/v10\n'), false);
});

test('local audit reports missing assets and LFS placeholders even when upload paths are complete', t => {
  const root = fixture(t, { [publicPaths[0]]: pointer, [publicPaths[1]]: Buffer.from([137, 80, 78, 71]) });
  assert.equal(validateVercelUploadManifest(manifestFor(publicPaths), publicPaths).matchedPublicFileCount, 3);
  assert.throws(() => auditLocalPublicAssets({ root, trackedPublicPaths: publicPaths }), error => {
    assert.equal(error.code, 'INVALID_LOCAL_PUBLIC_ASSETS');
    assert.deepEqual(error.lfsPointerPaths, [publicPaths[0]]);
    assert.deepEqual(error.missingPaths, [publicPaths[2]]);
    assert.match(error.message, /Unresolved Git LFS pointers/);
    return true;
  });
});

test('local audit accepts materialized regular files, Unicode and empty tracked metadata', t => {
  const paths = [...publicPaths, 'public/images/Entrée du Nexus.webp', 'public/empty-metadata'];
  const root = fixture(t, Object.fromEntries(paths.map(path => [path, path.endsWith('metadata') ? '' : Buffer.from([137, 80, 78, 71])])));
  assert.deepEqual(auditLocalPublicAssets({ root, trackedPublicPaths: paths }), { publicFileCount: 5 });
});

test('local audit rejects a directory symlink and file symlink before reading their targets', t => {
  const root = fixture(t, { 'materialized/rpg.webp': Buffer.from([137, 80, 78, 71]), 'public/metadata.json': '{}' });
  symlinkSync(join(root, 'materialized'), join(root, 'public/backgrounds'), 'dir');
  symlinkSync(join(root, 'materialized/rpg.webp'), join(root, 'public/image.webp'), 'file');
  const paths = ['public/backgrounds/rpg.webp', 'public/image.webp'];
  assert.throws(() => auditLocalPublicAssets({ root, trackedPublicPaths: paths }), error => {
    assert.deepEqual(error.symlinkPaths, paths);
    assert.match(error.message, /symlink\/junction/);
    return true;
  });
  assert.deepEqual(listPublicTreePaths(root), ['public/backgrounds', 'public/image.webp', 'public/metadata.json']);
});

test('local audit refuses non-file paths and invalid path inputs', t => {
  const root = fixture(t, { 'public/directory/nested-file': 'contents' });
  assert.throws(() => auditLocalPublicAssets({ root, trackedPublicPaths: ['public/directory'] }), error => {
    assert.deepEqual(error.nonFilePaths, ['public/directory']);
    return true;
  });
  for (const paths of [[], ['public/../outside'], ['/public/file'], ['public/file', 'public/file']]) {
    assert.throws(() => auditLocalPublicAssets({ root, trackedPublicPaths: paths }), /non-empty|canonical relative|Duplicate/);
  }
});

test('Git-tracked audit includes deleted local files rather than scanning only files still present', t => {
  const root = fixture(t, { 'public/present.webp': 'actual contents', 'public/deleted.webp': 'actual contents' });
  trackPublicFiles(root);
  rmSync(join(root, 'public/deleted.webp'));
  assert.deepEqual(listGitTrackedPublicPaths(root), ['public/deleted.webp', 'public/present.webp']);
  const result = spawnSync(process.execPath, [localAuditCli], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing public files/);
  assert.match(result.stderr, /public\/deleted\.webp/);
});

test('upload audit CLI blocks pointer files even when its manifest lists every tracked asset', t => {
  const paths = ['public/image.webp'];
  const root = fixture(t, { [paths[0]]: pointer });
  trackPublicFiles(root);
  const result = spawnSync(process.execPath, [uploadAuditCli], {
    cwd: root, input: JSON.stringify(manifestFor(paths)), encoding: 'utf8'
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unresolved Git LFS pointers/);
});

test('build audit can inspect uploaded archives without .git and states its coverage limit', t => {
  const root = fixture(t, { 'public/image.webp': Buffer.from([137, 80, 78, 71]) });
  const passed = spawnSync(process.execPath, [localAuditCli, '--build'], { cwd: root, encoding: 'utf8' });
  assert.equal(passed.status, 0, passed.stderr);
  assert.match(passed.stdout, /1 public-tree regular files/);
  assert.match(passed.stdout, /upload coverage must be checked locally/);
  writeFileSync(join(root, 'public/image.webp'), pointer);
  const rejected = spawnSync(process.execPath, [localAuditCli, '--build'], { cwd: root, encoding: 'utf8' });
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /Unresolved Git LFS pointers/);
});

test('build mode keeps Git coverage checks when repository metadata is present', t => {
  const root = fixture(t, { 'public/image.webp': 'actual contents' });
  trackPublicFiles(root);
  rmSync(join(root, 'public/image.webp'));
  const result = spawnSync(process.execPath, [localAuditCli, '--build'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing public files/);
});

test('build audit handles .git directories stripped by Vercel while still rejecting LFS pointers', t => {
  const root = fixture(t, { 'public/image.webp': Buffer.from([137, 80, 78, 71]) });
  mkdirSync(join(root, '.git'));
  const passed = spawnSync(process.execPath, [localAuditCli, '--build'], { cwd: root, encoding: 'utf8' });
  assert.equal(passed.status, 0, passed.stderr);
  assert.match(passed.stdout, /1 public-tree regular files/);
  assert.match(passed.stdout, /upload coverage must be checked locally/);
  assert.equal(passed.stderr, '');
  const strict = spawnSync(process.execPath, [localAuditCli], { cwd: root, encoding: 'utf8' });
  assert.equal(strict.status, 1);
  assert.match(strict.stderr, /not a git repository/);
  writeFileSync(join(root, 'public/image.webp'), pointer);
  const rejected = spawnSync(process.execPath, [localAuditCli, '--build'], { cwd: root, encoding: 'utf8' });
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /Unresolved Git LFS pointers/);
});

test('build audit handles .git links whose metadata was not included in the upload', t => {
  const root = fixture(t, {
    'public/image.webp': Buffer.from([137, 80, 78, 71]),
    '.git': 'gitdir: missing-worktree-metadata\n'
  });
  const passed = spawnSync(process.execPath, [localAuditCli, '--build'], { cwd: root, encoding: 'utf8' });
  assert.equal(passed.status, 0, passed.stderr);
  assert.match(passed.stdout, /1 public-tree regular files/);
  assert.equal(passed.stderr, '');
});
