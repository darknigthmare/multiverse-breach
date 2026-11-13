import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import {
  hasOwnGitIndex, listAssetSourceEntries, listGitAssetSources,
  listMaterializedAssetSources, listTrackedRuntimePaths, projectAssetPath
} from './dlcAssetPaths.mjs';

const fixture = (t, files = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'multiverse-asset-paths-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, contents = 'fixture') => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
  };
  for (const [path, contents] of Object.entries(files)) write(path, contents);
  return { root, write };
};

const track = (root, paths = ['.']) => {
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['add', '--', ...paths], { cwd: root });
};

test('projects both physical layouts without changing URL spelling or Unicode', () => {
  for (const [sourcePath, publicPath] of [
    ['public/boosters/halo.webp', '/boosters/halo.webp'],
    ['DLC/Halo/assets/boosters/halo.webp', '/boosters/halo.webp'],
    ['DLC/Halo2/assets/cg/Entrée du Nexus.png', '/cg/Entrée du Nexus.png'],
    ['DLC/CloudMeadow/assets/reviews/cloud-meadow/catalog.json', '/reviews/cloud-meadow/catalog.json']
  ]) assert.deepEqual(projectAssetPath(sourcePath), { sourcePath, publicPath });

  for (const sourcePath of [
    undefined, null, 3, '', 'public', 'public/', 'src/game/hero.js', 'DLC/Halo/assets.json',
    'DLC/Halo/data/hero.js', 'DLC/Halo/assets/', 'DLC/Half-Life/assets/image.png',
    'DLC/Haló/assets/image.png', '/public/image.png', 'public//image.png',
    'public/../secret', 'public/./image.png', 'DLC/Halo/assets/../secret',
    'DLC/../assets/image.png', 'public/image.png/', 'public\\image.png',
    'public/C:drive.png', 'public/image\n.png', 'public/image\0.png',
    'public/%2e%2e/secret', 'public/image.png?version=1', 'public/image.png#fragment'
  ]) assert.equal(projectAssetPath(sourcePath), null, String(sourcePath));
});

test('an export never borrows its parent Git index, even with an empty .git directory', t => {
  const { root, write } = fixture(t, {
    'public/parent.png': 'parent',
    'export/public/child.png': 'child',
    'export/DLC/Halo/assets/hero.png': 'DLC child'
  });
  track(root, ['public']);
  const exportedRoot = join(root, 'export');
  assert.equal(hasOwnGitIndex(root), true);
  for (const emptyMetadata of [false, true]) {
    if (emptyMetadata) mkdirSync(join(exportedRoot, '.git'));
    assert.equal(hasOwnGitIndex(exportedRoot), false);
    assert.throws(() => listGitAssetSources(exportedRoot), /own usable index/);
    assert.throws(() => listTrackedRuntimePaths(exportedRoot), /own usable index/);
    assert.deepEqual(listAssetSourceEntries(exportedRoot), {
      entries: [
        { sourcePath: 'DLC/Halo/assets/hero.png', publicPath: '/hero.png' },
        { sourcePath: 'public/child.png', publicPath: '/child.png' }
      ],
      inputSource: 'public-tree'
    });
  }
  rmSync(join(exportedRoot, '.git'), { recursive: true });
  write('export/.git', 'gitdir: missing-worktree-metadata\n');
  assert.equal(hasOwnGitIndex(exportedRoot), false);
  assert.equal(listAssetSourceEntries(exportedRoot).inputSource, 'public-tree');
});

test('Git inventory preserves absent assets and adds legacy aliases without losing raw source files', t => {
  const files = {
    'public/shared.webp': 'base',
    'DLC/Halo/assets/sprites/hero.png': 'DLC',
    'DLC/Halo/assets.json': '{}',
    'DLC/Halo/data/heroes.js': 'export const heroes = [];',
    'src/main.js': 'export {};'
  };
  const { root, write } = fixture(t, files);
  track(root);
  rmSync(join(root, 'DLC/Halo/assets/sprites/hero.png'));
  write('public/untracked.webp');
  assert.deepEqual(listGitAssetSources(root), ['DLC/Halo/assets/sprites/hero.png', 'public/shared.webp']);
  assert.deepEqual(listAssetSourceEntries(root), {
    entries: [
      { sourcePath: 'DLC/Halo/assets/sprites/hero.png', publicPath: '/sprites/hero.png' },
      { sourcePath: 'public/shared.webp', publicPath: '/shared.webp' }
    ],
    inputSource: 'git-index'
  });
  assert.deepEqual(listTrackedRuntimePaths(root), [...Object.keys(files), 'public/sprites/hero.png'].sort());
});

test('two tracked sources claiming one public URL are rejected rather than deduplicated', t => {
  const { root } = fixture(t, {
    'public/sprites/hero.png': 'public original',
    'DLC/Halo/assets/sprites/hero.png': 'DLC original'
  });
  track(root);
  assert.throws(() => listAssetSourceEntries(root), error => {
    assert.equal(error.code, 'ASSET_PUBLIC_PATH_COLLISION');
    assert.equal(error.publicPath, '/sprites/hero.png');
    assert.deepEqual(error.sourcePaths, ['DLC/Halo/assets/sprites/hero.png', 'public/sprites/hero.png']);
    return true;
  });
  assert.throws(() => listTrackedRuntimePaths(root), /Asset URL collision/);
});

test('an unsafe tracked asset path is rejected, not omitted from coverage', t => {
  const { root } = fixture(t, { 'DLC/Half-Life/assets/image.png': 'wrong physical folder' });
  track(root);
  assert.throws(() => listGitAssetSources(root), /canonical relative asset path/);
});

test('a materialized export prefers the canonical DLC source over its generated public copy', t => {
  const { root } = fixture(t, {
    'public/base.png': 'base',
    'public/sprites/hero.png': 'generated copy',
    'DLC/Halo/assets/sprites/hero.png': 'canonical source',
    'DLC/Halo/assets.json': '{}',
    'DLC/Halo/data/heroes.js': 'export const heroes = [];'
  });
  assert.deepEqual(listMaterializedAssetSources(root), ['DLC/Halo/assets/sprites/hero.png', 'public/base.png']);
  assert.deepEqual(listAssetSourceEntries(root), {
    entries: [
      { sourcePath: 'DLC/Halo/assets/sprites/hero.png', publicPath: '/sprites/hero.png' },
      { sourcePath: 'public/base.png', publicPath: '/base.png' }
    ],
    inputSource: 'public-tree'
  });
});

test('materialized DLC collisions are rejected even if a generated public copy exists', t => {
  const { root } = fixture(t, {
    'public/hero.png': 'copy',
    'DLC/Halo/assets/hero.png': 'first owner',
    'DLC/Doom/assets/hero.png': 'second owner'
  });
  assert.throws(() => listMaterializedAssetSources(root), error => {
    assert.equal(error.code, 'ASSET_PUBLIC_PATH_COLLISION');
    assert.equal(error.publicPath, '/hero.png');
    return true;
  });
});

test('materialized scans do not follow leaf symlinks and retain them for the byte audit', t => {
  const { root } = fixture(t, {
    'outside/image.png': 'must not traverse',
    'public/base.png': 'base',
    'DLC/Halo/assets/real.png': 'DLC'
  });
  symlinkSync(join(root, 'outside'), join(root, 'public/linked'), 'dir');
  symlinkSync(join(root, 'outside/image.png'), join(root, 'DLC/Halo/assets/linked.png'), 'file');
  assert.deepEqual(listMaterializedAssetSources(root), [
    'DLC/Halo/assets/linked.png', 'DLC/Halo/assets/real.png', 'public/base.png', 'public/linked'
  ]);
});

for (const linkedRoot of ['public', 'DLC', 'DLC/Halo', 'DLC/Halo/assets']) {
  test(`materialized scans reject a symlink at the ${linkedRoot} root`, t => {
    const { root } = fixture(t, { 'outside/image.png': 'must not traverse' });
    mkdirSync(dirname(join(root, linkedRoot)), { recursive: true });
    symlinkSync(join(root, 'outside'), join(root, linkedRoot), 'dir');
    assert.throws(() => listMaterializedAssetSources(root), /real directory.*symlink/);
  });
}

test('materialized scanning supports a DLC-only archive and an empty inventory', t => {
  const { root, write } = fixture(t);
  assert.deepEqual(listMaterializedAssetSources(root), []);
  write('DLC/Halo/assets/hero.png');
  assert.deepEqual(listMaterializedAssetSources(root), ['DLC/Halo/assets/hero.png']);
});
