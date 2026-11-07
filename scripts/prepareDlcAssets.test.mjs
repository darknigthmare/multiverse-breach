import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, renameSync,
  rmSync, symlinkSync, utimesSync, writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { prepareDlcAssets, readDlcPublicationEntries } from './prepareDlcAssets.mjs';

const STATE_PATH = '.tmp/dlc-publication-state.json';
const SCRIPT_PATH = fileURLToPath(new URL('./prepareDlcAssets.mjs', import.meta.url));
const LFS_POINTER = '\uFEFFversion https://git-lfs.github.com/spec/v1\r\noid sha256:' + 'a'.repeat(64) + '\r\nsize 1234\r\n';
const asset = (publicPath = '/images/halo.png', folder = 'Halo') => ({
  publicPath,
  sourcePath: 'DLC/' + folder + '/assets/' + publicPath.slice(1)
});

const createFixture = t => {
  const root = mkdtempSync(join(tmpdir(), 'multiverse-dlc-publication-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'DLC'));
  const write = (path, contents) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
  };
  const manifest = (entries, folder = 'Halo') => write('DLC/' + folder + '/assets.json',
    JSON.stringify({ schemaVersion: 1, assets: entries }, null, 2) + '\n');
  const read = path => readFileSync(join(root, path));
  return { root, write, manifest, read };
};

test('reads migrated mappings deterministically and ignores legacy public sources without writing', t => {
  const { root, manifest } = createFixture(t);
  manifest([{ sourcePath: 'public/shared.png', publicPath: '/shared.png' }]);
  assert.deepEqual(readDlcPublicationEntries({ root }), []);
  assert.equal(prepareDlcAssets({ root }).total, 0);
  assert.equal(existsSync(join(root, 'public')), false);
  assert.equal(existsSync(join(root, STATE_PATH)), false);
  manifest([asset('/z.png'), asset('/a.png')]);
  assert.deepEqual(readDlcPublicationEntries({ root }), [
    { ...asset('/a.png'), destinationPath: 'public/a.png' },
    { ...asset('/z.png'), destinationPath: 'public/z.png' }
  ]);
});

test('publishes exact binary bytes as independent files and is idempotent including the state file', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  const bytes = Buffer.from([0, 255, 128, 13, 10, 0, 65, 66, 67]);
  manifest([entry]);
  write(entry.sourcePath, bytes);
  const result = prepareDlcAssets({ root });
  assert.equal(result.complete, true);
  assert.equal(result.copied, 1);
  assert.equal(result.published, 1);
  assert.deepEqual(read('public' + entry.publicPath), bytes);
  assert.equal(lstatSync(join(root, 'public' + entry.publicPath)).isSymbolicLink(), false);
  const state = JSON.parse(read(STATE_PATH).toString());
  assert.equal(state.files[0].sha256, createHash('sha256').update(bytes).digest('hex'));
  const fixedTime = new Date('2001-01-01T00:00:00Z');
  for (const path of ['public' + entry.publicPath, STATE_PATH]) utimesSync(join(root, path), fixedTime, fixedTime);
  const second = prepareDlcAssets({ root });
  assert.equal(second.copied, 0);
  assert.equal(second.unchanged, 1);
  for (const path of ['public' + entry.publicPath, STATE_PATH]) {
    assert.equal(lstatSync(join(root, path)).mtimeMs, fixedTime.getTime());
  }
  write(entry.sourcePath, 'new source bytes');
  assert.deepEqual(read('public' + entry.publicPath), bytes, 'publication must not be a hard link');
  assert.equal(prepareDlcAssets({ root }).copied, 1);
  assert.equal(read('public' + entry.publicPath).toString(), 'new source bytes');
});

test('adopts an identical existing file but never overwrites a different unowned file', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  write(entry.sourcePath, 'same bytes');
  write('public' + entry.publicPath, 'same bytes');
  assert.equal(prepareDlcAssets({ root }).unchanged, 1);
  assert.equal(JSON.parse(read(STATE_PATH)).files.length, 1);
  const second = asset('/other.png');
  manifest([entry, second]);
  write(second.sourcePath, 'wanted bytes');
  write('public' + second.publicPath, 'local contents');
  const stateBefore = read(STATE_PATH);
  assert.throws(() => prepareDlcAssets({ root }), /collision.*preserving/i);
  assert.equal(read('public' + second.publicPath).toString(), 'local contents');
  assert.deepEqual(read(STATE_PATH), stateBefore);
});

test('prevalidates all destinations before publishing an earlier valid asset', t => {
  const { root, manifest, write, read } = createFixture(t);
  const first = asset('/a.png');
  const last = asset('/z.png');
  manifest([first, last]);
  write(first.sourcePath, 'first');
  write(last.sourcePath, 'last');
  write('public' + last.publicPath, 'local');
  assert.throws(() => prepareDlcAssets({ root }), /collision/i);
  assert.equal(existsSync(join(root, 'public' + first.publicPath)), false);
  assert.equal(read('public' + last.publicPath).toString(), 'local');
  assert.equal(existsSync(join(root, STATE_PATH)), false);
});

test('removes unchanged managed outputs when an entry is retired and preserves shared files', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  write(entry.sourcePath, 'published');
  write('public/shared.txt', 'shared');
  prepareDlcAssets({ root });
  manifest([]);
  const result = prepareDlcAssets({ root });
  assert.equal(result.removed, 1);
  assert.equal(existsSync(join(root, 'public' + entry.publicPath)), false);
  assert.equal(read(entry.sourcePath).toString(), 'published');
  assert.equal(read('public/shared.txt').toString(), 'shared');
  assert.deepEqual(JSON.parse(read(STATE_PATH)).files, []);
  assert.equal(prepareDlcAssets({ root }).removed, 0);
});

for (const owner of ['shared', 'pack']) {
  for (const changed of [false, true]) {
    test('releases a ' + (changed ? 'changed' : 'matching') + ' copy that becomes a canonical public source in ' + owner + ' metadata', t => {
      const { root, manifest, write, read } = createFixture(t);
      const released = asset('/shared.png');
      const retained = asset('/retained.png');
      const retired = asset('/retired.png');
      manifest([released, retained, retired]);
      for (const entry of [released, retained, retired]) write(entry.sourcePath, 'original');
      prepareDlcAssets({ root });

      const publicEntry = { sourcePath: 'public' + released.publicPath, publicPath: released.publicPath };
      manifest(owner === 'pack' ? [retained, publicEntry] : [retained]);
      if (owner === 'shared') write('DLC/shared-assets.json', JSON.stringify({ schemaVersion: 1, assets: [publicEntry] }));
      rmSync(join(root, released.sourcePath));
      const publicBytes = changed ? 'updated canonical source' : 'original';
      write(publicEntry.sourcePath, publicBytes);

      const result = prepareDlcAssets({ root });
      assert.equal(result.removed, 1, 'only the genuinely retired copy is removed');
      assert.equal(read(publicEntry.sourcePath).toString(), publicBytes);
      assert.equal(existsSync(join(root, 'public' + retired.publicPath)), false);
      assert.equal(read('public' + retained.publicPath).toString(), 'original');
      assert.deepEqual(JSON.parse(read(STATE_PATH)).files.map(entry => entry.publicPath), [retained.publicPath]);

      // Future edits/removal from metadata must not make the released source
      // subject to the generated-copy hash guard or cleanup again.
      write(publicEntry.sourcePath, 'subsequent canonical edit');
      manifest([retained]);
      if (owner === 'shared') write('DLC/shared-assets.json', JSON.stringify({ schemaVersion: 1, assets: [] }));
      assert.equal(prepareDlcAssets({ root, availableOnly: true }).removed, 0);
      assert.equal(read(publicEntry.sourcePath).toString(), 'subsequent canonical edit');
    });
  }
}

test('releasing a public source still protects a different modified retired copy and preserves state on failure', t => {
  const { root, manifest, write, read } = createFixture(t);
  const released = asset('/shared.png');
  const retired = asset('/retired.png');
  manifest([released, retired]);
  for (const entry of [released, retired]) write(entry.sourcePath, 'original');
  prepareDlcAssets({ root });
  const stateBefore = read(STATE_PATH);
  manifest([]);
  write('DLC/shared-assets.json', JSON.stringify({ schemaVersion: 1, assets: [
    { sourcePath: 'public' + released.publicPath, publicPath: released.publicPath }
  ] }));
  rmSync(join(root, released.sourcePath));
  write('public' + released.publicPath, 'updated canonical source');
  write('public' + retired.publicPath, 'local edits');
  for (const availableOnly of [false, true]) {
    assert.throws(() => prepareDlcAssets({ root, availableOnly }), /modified.*preserving/i);
    assert.equal(read('public' + released.publicPath).toString(), 'updated canonical source');
    assert.equal(read('public' + retired.publicPath).toString(), 'local edits');
    assert.deepEqual(read(STATE_PATH), stateBefore);
  }
});

test('conflicting public and DLC ownership cannot release or overwrite a managed copy', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  write(entry.sourcePath, 'original');
  prepareDlcAssets({ root });
  const stateBefore = read(STATE_PATH);
  write('DLC/shared-assets.json', JSON.stringify({ schemaVersion: 1, assets: [
    { sourcePath: 'public' + entry.publicPath, publicPath: entry.publicPath }
  ] }));
  write('public' + entry.publicPath, 'local edits');
  assert.throws(() => prepareDlcAssets({ root }), /Duplicate/);
  assert.equal(read('public' + entry.publicPath).toString(), 'local edits');
  assert.deepEqual(read(STATE_PATH), stateBefore);
});

test('a mismatched canonical public source cannot release a managed copy', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  write(entry.sourcePath, 'original');
  prepareDlcAssets({ root });
  const stateBefore = read(STATE_PATH);
  manifest([]);
  write('DLC/shared-assets.json', JSON.stringify({ schemaVersion: 1, assets: [
    { sourcePath: 'public/other.png', publicPath: entry.publicPath }
  ] }));
  assert.throws(() => prepareDlcAssets({ root }), /Public sourcePath must equal/);
  assert.equal(read('public' + entry.publicPath).toString(), 'original');
  assert.deepEqual(read(STATE_PATH), stateBefore);
});

test('recreates an absent managed copy without treating absence as an overwrite', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  write(entry.sourcePath, 'original');
  prepareDlcAssets({ root });
  rmSync(join(root, 'public' + entry.publicPath));
  assert.equal(prepareDlcAssets({ root }).copied, 1);
  assert.equal(read('public' + entry.publicPath).toString(), 'original');
});

for (const operation of ['update', 'retire', 'skip-missing']) {
  test('preserves a locally modified managed copy and state during ' + operation, t => {
    const { root, manifest, write, read } = createFixture(t);
    const entry = asset();
    manifest([entry]);
    write(entry.sourcePath, 'initial');
    prepareDlcAssets({ root });
    const stateBefore = read(STATE_PATH);
    write('public' + entry.publicPath, 'local edits');
    if (operation === 'retire') manifest([]);
    else if (operation === 'skip-missing') rmSync(join(root, entry.sourcePath));
    else write(entry.sourcePath, 'updated');
    assert.throws(() => prepareDlcAssets({ root, availableOnly: operation === 'skip-missing' }), /modified.*preserving/i);
    assert.equal(read('public' + entry.publicPath).toString(), 'local edits');
    assert.deepEqual(read(STATE_PATH), stateBefore);
  });
}

test('strict missing-source failure does not publish valid entries or clean retired entries', t => {
  const { root, manifest, write, read } = createFixture(t);
  const retired = asset('/retired.png');
  manifest([retired]);
  write(retired.sourcePath, 'retired');
  prepareDlcAssets({ root });
  const stateBefore = read(STATE_PATH);
  const available = asset('/a.png');
  const missing = asset('/z.png');
  manifest([available, missing]);
  write(available.sourcePath, 'available');
  assert.throws(() => prepareDlcAssets({ root }), /Missing DLC sources/);
  assert.equal(existsSync(join(root, 'public' + available.publicPath)), false);
  assert.equal(read('public' + retired.publicPath).toString(), 'retired');
  assert.deepEqual(read(STATE_PATH), stateBefore);
});

test('partial publication reports missing sources and LFS pointers while copying only hydrated assets', t => {
  const { root, manifest, write, read } = createFixture(t);
  const available = asset('/a.png');
  const missing = asset('/missing.png');
  const pointer = asset('/pointer.png');
  manifest([available, missing, pointer]);
  write(available.sourcePath, 'real binary');
  write(pointer.sourcePath, LFS_POINTER);
  assert.throws(() => prepareDlcAssets({ root }), error => {
    assert.deepEqual(error.missingSources, [missing.sourcePath]);
    assert.deepEqual(error.lfsPointers, [pointer.sourcePath]);
    return /Unhydrated Git LFS pointers/.test(error.message);
  });
  assert.equal(existsSync(join(root, 'public')), false);
  const result = prepareDlcAssets({ root, availableOnly: true });
  assert.equal(result.complete, false);
  assert.equal(result.total, 3);
  assert.equal(result.published, 1);
  assert.equal(result.copied, 1);
  assert.deepEqual(result.missingSources, [missing.sourcePath]);
  assert.deepEqual(result.lfsPointers, [pointer.sourcePath]);
  assert.equal(read('public' + available.publicPath).toString(), 'real binary');
  assert.equal(existsSync(join(root, 'public' + missing.publicPath)), false);
  assert.equal(existsSync(join(root, 'public' + pointer.publicPath)), false);
});

test('partial mode retains verified managed copies for temporarily missing sources', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  write(entry.sourcePath, 'v1');
  prepareDlcAssets({ root });
  const stateBefore = read(STATE_PATH);
  rmSync(join(root, entry.sourcePath));
  const result = prepareDlcAssets({ root, availableOnly: true });
  assert.equal(result.complete, false);
  assert.equal(result.removed, 0);
  assert.equal(read('public' + entry.publicPath).toString(), 'v1');
  assert.deepEqual(read(STATE_PATH), stateBefore);
  write(entry.sourcePath, 'v2');
  prepareDlcAssets({ root });
  assert.equal(read('public' + entry.publicPath).toString(), 'v2');
});

test('partial mode cannot hide an unowned destination collision behind a missing source', t => {
  const { root, manifest, write, read } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  write('public' + entry.publicPath, 'unowned');
  assert.throws(() => prepareDlcAssets({ root, availableOnly: true }), /collision/);
  assert.equal(read('public' + entry.publicPath).toString(), 'unowned');
  assert.equal(existsSync(join(root, STATE_PATH)), false);
});

for (const [name, invalid] of [
  ['public traversal', { publicPath: '/../outside', sourcePath: 'DLC/Halo/assets/../outside' }],
  ['source traversal', { publicPath: '/image.png', sourcePath: 'DLC/Halo/assets/../image.png' }],
  ['double slash', { publicPath: '//image.png', sourcePath: 'DLC/Halo/assets//image.png' }],
  ['backslash', { publicPath: '/images\\bad.png', sourcePath: 'DLC/Halo/assets/images\\bad.png' }],
  ['Windows drive', { publicPath: '/C:/bad.png', sourcePath: 'DLC/Halo/assets/C:/bad.png' }],
  ['control character', { publicPath: '/bad\n.png', sourcePath: 'DLC/Halo/assets/bad\n.png' }],
  ['wrong owning folder', { publicPath: '/image.png', sourcePath: 'DLC/Other/assets/image.png' }],
  ['mismatched suffix', { publicPath: '/image.png', sourcePath: 'DLC/Halo/assets/other.png' }]
]) {
  test('rejects unsafe publication metadata: ' + name, t => {
    const { root, manifest } = createFixture(t);
    manifest([invalid]);
    assert.throws(() => prepareDlcAssets({ root, availableOnly: true }), /canonical|must equal/);
    assert.equal(existsSync(join(root, 'public')), false);
  });
}

test('rejects duplicate public URLs across DLCs and file/directory collisions', t => {
  const { root, manifest } = createFixture(t);
  manifest([asset('/same.png')]);
  manifest([asset('/same.png', 'Alien')], 'Alien');
  assert.throws(() => readDlcPublicationEntries({ root }), /Duplicate/);
  manifest([], 'Alien');
  manifest([asset('/a'), asset('/a-b'), asset('/a/image.png')]);
  assert.throws(() => readDlcPublicationEntries({ root }), /file\/directory collision/);
  manifest([asset(), asset()]);
  assert.throws(() => readDlcPublicationEntries({ root }), /Duplicate/);
});

for (const location of ['source-file', 'source-parent', 'destination-file', 'destination-parent', 'manifest', 'state-file', 'state-parent']) {
  test('rejects symlinks before mutation, including in partial mode: ' + location, t => {
    const { root, manifest, write, read } = createFixture(t);
    const entry = asset();
    manifest([entry]);
    write(entry.sourcePath, 'source');
    write('foreign/kept.txt', 'do not change');
    if (location === 'source-file') {
      rmSync(join(root, entry.sourcePath));
      symlinkSync(join(root, 'foreign/kept.txt'), join(root, entry.sourcePath));
    } else if (location === 'source-parent') {
      renameSync(join(root, 'DLC/Halo/assets'), join(root, 'real-assets'));
      symlinkSync(join(root, 'real-assets'), join(root, 'DLC/Halo/assets'), 'dir');
    } else if (location === 'destination-file') {
      mkdirSync(join(root, 'public/images'), { recursive: true });
      symlinkSync(join(root, 'foreign/kept.txt'), join(root, 'public' + entry.publicPath));
    } else if (location === 'destination-parent') {
      mkdirSync(join(root, 'public'));
      symlinkSync(join(root, 'foreign'), join(root, 'public/images'), 'dir');
    } else if (location === 'manifest') {
      renameSync(join(root, 'DLC/Halo/assets.json'), join(root, 'foreign/manifest.json'));
      symlinkSync(join(root, 'foreign/manifest.json'), join(root, 'DLC/Halo/assets.json'));
    } else if (location === 'state-file') {
      mkdirSync(join(root, '.tmp'));
      symlinkSync(join(root, 'foreign/kept.txt'), join(root, STATE_PATH));
    } else {
      symlinkSync(join(root, 'foreign'), join(root, '.tmp'), 'dir');
    }
    assert.throws(() => prepareDlcAssets({ root }), /symlink\/junction/);
    assert.throws(() => prepareDlcAssets({ root, availableOnly: true }), /symlink\/junction/);
    assert.equal(read('foreign/kept.txt').toString(), 'do not change');
  });
}

test('partial mode still rejects a dangling destination link when its source is missing', t => {
  const { root, manifest } = createFixture(t);
  const entry = asset();
  manifest([entry]);
  mkdirSync(join(root, 'public/images'), { recursive: true });
  symlinkSync(join(root, 'absent-target'), join(root, 'public' + entry.publicPath));
  assert.throws(() => prepareDlcAssets({ root, availableOnly: true }), /symlink\/junction/);
});

test('rejects malformed state instead of trusting it for cleanup', t => {
  const { root, manifest, write, read } = createFixture(t);
  manifest([]);
  write('public/keep.txt', 'keep');
  write(STATE_PATH, JSON.stringify({
    schemaVersion: 1,
    files: [{ sourcePath: 'DLC/Halo/assets/../keep.txt', publicPath: '/../keep.txt', sha256: 'a'.repeat(64) }]
  }));
  assert.throws(() => prepareDlcAssets({ root }), /canonical/);
  assert.equal(read('public/keep.txt').toString(), 'keep');
});

test('CLI partial output is bounded and explicit; strict mode fails with unavailable sources', t => {
  const { root, manifest, write } = createFixture(t);
  const entries = Array.from({ length: 12 }, (_, index) => asset('/missing-' + String(index).padStart(2, '0') + '.png'));
  const available = asset('/available.png');
  const pointer = asset('/pointer.png');
  manifest([...entries, available, pointer]);
  write(available.sourcePath, 'available');
  write(pointer.sourcePath, LFS_POINTER);
  const partial = spawnSync(process.execPath, [SCRIPT_PATH, '--available'], { cwd: root, encoding: 'utf8' });
  assert.equal(partial.status, 0, partial.stderr);
  assert.match(partial.stdout, /Partial DLC asset publication/);
  assert.match(partial.stdout, /1\/14 ready/);
  assert.match(partial.stdout, /not a complete build\/deploy asset set/);
  assert.match(partial.stdout, /7 more missing source/);
  assert.ok(partial.stdout.length < 1800);
  const strict = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: root, encoding: 'utf8' });
  assert.equal(strict.status, 1);
  assert.match(strict.stderr, /Missing DLC sources/);
});
