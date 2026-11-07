import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createAssetSourceResolver, resolveAssetSourcePath } from './assetSourceResolver.mjs';

const fixture = t => {
  const root = mkdtempSync(join(tmpdir(), 'asset-source-resolver-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (relative, value) => {
    mkdirSync(dirname(join(root, relative)), { recursive: true });
    writeFileSync(join(root, relative), typeof value === 'string' ? value : JSON.stringify(value));
  };
  const pack = (folder, universe, assets = [], id = folder.toLowerCase()) => {
    write(`DLC/${folder}/manifest.json`, { schemaVersion: 1, id, universe, directory: `DLC/${folder}`, assetManifest: 'assets.json' });
    write(`DLC/${folder}/assets.json`, { schemaVersion: 1, universe, assets });
  };
  return { root, write, pack };
};

test('repositories without DLC metadata retain public paths and the convenience API', t => {
  const { root } = fixture(t);
  const resolveSource = createAssetSourceResolver(root);
  assert.equal(resolveSource('/images/Entrée du Nexus.png', 'Halo'), 'public/images/Entrée du Nexus.png');
  assert.equal(resolveAssetSourcePath(root, '/sprites/hero.png'), 'public/sprites/hero.png');
});

test('registered URL ownership and shared sources take priority over an optional universe hint', t => {
  const { root, write, pack } = fixture(t);
  pack('Halo', 'Halo', [{ publicPath: '/sprites/hero.png', sourcePath: 'DLC/Halo/assets/sprites/hero.png' }]);
  pack('HalfLife', 'Half-Life');
  write('DLC/shared-assets.json', { schemaVersion: 1, assets: [{ publicPath: '/images/shared.png', sourcePath: 'public/images/shared.png' }] });
  write('public/sprites/hero.png', 'generated copy must not own the URL');
  const resolveSource = createAssetSourceResolver(root);
  assert.equal(resolveSource('/sprites/hero.png'), 'DLC/Halo/assets/sprites/hero.png');
  assert.equal(resolveSource('/sprites/hero.png', 'Half-Life'), 'DLC/Halo/assets/sprites/hero.png');
  assert.equal(resolveSource('/images/shared.png', 'Halo'), 'public/images/shared.png');
  assert.equal(resolveSource('/sprites/new.png', 'Half-Life'), 'DLC/HalfLife/assets/sprites/new.png');
  assert.equal(resolveSource('/sprites/new.png', 'half-life'), 'public/sprites/new.png');
  assert.equal(resolveSource('/sprites/new.png'), 'public/sprites/new.png');
});

test('an existing public file outside the inventory keeps overwrite protection', t => {
  const { root, write, pack } = fixture(t);
  pack('Halo', 'Halo');
  write('public/sprites/existing.png', 'old source');
  const resolveSource = createAssetSourceResolver(root);
  assert.equal(resolveSource('/sprites/existing.png', 'Halo'), 'public/sprites/existing.png');
  assert.equal(resolveSource('/sprites/new.png', 'Halo'), 'DLC/Halo/assets/sprites/new.png');
});

test('unsafe URLs cannot produce repository paths', t => {
  const { root } = fixture(t);
  const resolveSource = createAssetSourceResolver(root);
  for (const url of [null, '', '/', 'images/a.png', 'https://example.com/a.png', '//host/a.png',
    '/images/../secret', '/images/./a.png', '/images//a.png', '/images/a.png/', '/images\\a.png',
    '/images/%2e%2e/secret', '/images/a.png?x=1', '/images/a.png#x', '/images/a\0.png']) {
    assert.throws(() => resolveSource(url, 'Halo'), /canonical public asset URL/);
  }
});

test('manifest paths must be canonical, match their URL and remain with their declared owner', t => {
  const { root, pack } = fixture(t);
  for (const asset of [
    { publicPath: '/images/a.png', sourcePath: '../private/a.png' },
    { publicPath: '/images/a.png', sourcePath: 'DLC/Halo/assets/../private/a.png' },
    { publicPath: '/images/a.png', sourcePath: 'DLC/Halo/assets/images/b.png' },
    { publicPath: '/images/a.png', sourcePath: 'DLC/HalfLife/assets/images/a.png' }
  ]) {
    pack('Halo', 'Halo', [asset]);
    assert.throws(() => createAssetSourceResolver(root), /disagree|physical owner/);
  }
});

test('duplicate URL ownership across packs or a shared manifest is rejected', t => {
  const { root, write, pack } = fixture(t);
  pack('Halo', 'Halo', [{ publicPath: '/images/a.png', sourcePath: 'DLC/Halo/assets/images/a.png' }]);
  pack('HalfLife', 'Half-Life', [{ publicPath: '/images/a.png', sourcePath: 'DLC/HalfLife/assets/images/a.png' }]);
  assert.throws(() => createAssetSourceResolver(root), /collision/);
  pack('HalfLife', 'Half-Life');
  write('DLC/shared-assets.json', { schemaVersion: 1, assets: [{ publicPath: '/images/a.png', sourcePath: 'public/images/a.png' }] });
  assert.throws(() => createAssetSourceResolver(root), /collision/);
});

test('duplicate universe identities, IDs and mismatched inventory identities are rejected', t => {
  const { root, write, pack } = fixture(t);
  pack('Halo', 'Halo');
  pack('AnotherHalo', 'Halo');
  assert.throws(() => createAssetSourceResolver(root), /Duplicate DLC/);
  pack('AnotherHalo', 'Another Halo', [], 'halo');
  assert.throws(() => createAssetSourceResolver(root), /Duplicate DLC/);
  pack('AnotherHalo', 'Another Halo');
  write('DLC/AnotherHalo/assets.json', { schemaVersion: 1, universe: 'Wrong universe', assets: [] });
  assert.throws(() => createAssetSourceResolver(root), /Invalid DLC asset inventory/);
});

test('shared inventory cannot assign a private or DLC file as a common public source', t => {
  const { root, write } = fixture(t);
  write('DLC/shared-assets.json', { schemaVersion: 1, assets: [{ publicPath: '/images/a.png', sourcePath: 'DLC/Halo/assets/images/a.png' }] });
  assert.throws(() => createAssetSourceResolver(root), /physical owner/);
});

test('symlinked manifests and public ancestors cannot bypass ownership or destination checks', t => {
  const { root, write, pack } = fixture(t);
  pack('Halo', 'Halo');
  write('private/inventory.json', { schemaVersion: 1, universe: 'Halo', assets: [] });
  rmSync(join(root, 'DLC/Halo/assets.json'));
  symlinkSync(join(root, 'private/inventory.json'), join(root, 'DLC/Halo/assets.json'));
  assert.throws(() => createAssetSourceResolver(root), /without symlinks/);
  rmSync(join(root, 'DLC/Halo/assets.json'));
  pack('Halo', 'Halo');
  mkdirSync(join(root, 'public'));
  symlinkSync(join(root, 'private'), join(root, 'public/images'), 'dir');
  const resolveSource = createAssetSourceResolver(root);
  assert.throws(() => resolveSource('/images/new.png', 'Halo'), /symlinks/);
});

test('CLI exposes one relative path or one JSON record for shell integrations', t => {
  const { root, pack } = fixture(t);
  pack('Halo', 'Halo');
  const cli = fileURLToPath(new URL('./assetSourceResolver.mjs', import.meta.url));
  const args = [cli, '--root', root, '--public-path', '/images/new.png', '--universe', 'Halo'];
  assert.equal(execFileSync(process.execPath, args, { encoding: 'utf8' }), 'DLC/Halo/assets/images/new.png\n');
  const json = execFileSync(process.execPath, [...args, '--json'], { encoding: 'utf8' });
  assert.equal(json.split('\n').length, 2);
  assert.deepEqual(JSON.parse(json), { sourcePath: 'DLC/Halo/assets/images/new.png', publicPath: '/images/new.png' });
  const failed = spawnSync(process.execPath, [cli, '--root', root, '--public-path', '/../secret'], { encoding: 'utf8' });
  assert.equal(failed.status, 1);
  assert.equal(failed.stdout, '');
});
