import assert from 'node:assert/strict';
import test from 'node:test';
import { validateVercelUploadManifest } from './auditVercelUploadManifest.mjs';

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
