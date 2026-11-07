import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { buildDlcAssetInventory, renderDlcPublicationIgnore, runDlcAssetManifestBuild } from './buildDlcAssetManifests.mjs';

const pack = (universe, folder, modules = []) => ({
  schemaVersion: 1, id: folder.toLowerCase(), universe, directory: `DLC/${folder}`,
  registration: universe === 'Cloud Meadow' ? 'artwork-only' : 'runtime', modules, assetManifest: 'assets.json'
});

test('partitions paths without claiming shared backgrounds, historical aliases, base or campaign artwork', () => {
  const packs = [pack('Halo', 'Halo'), pack('Predators', 'Predators'), pack('Cloud Meadow', 'CloudMeadow'), pack("Assassin's Creed", 'AssassinsCreed'), pack('Buckethead', 'Buckethead'), pack('The Matrix', 'TheMatrix')];
  const publicPaths = [
    'public/sprites/generated/heroes/halo/master-chief.png',
    'public/backgrounds/halo-tactics-openai.png',
    'public/sprites/generated/heroes/cloud-meadow/eve-reference.png',
    'public/boosters/assassins-creed.webp',
    'public/sprites/generated/heroes/buckhead/bucket-guitar-echo.png',
    'public/sprites/generated/bosses/matrix/breach-singularity-core.png',
    'public/sprites/generated/bosses/alien-1979/kane-s-son-big-chap.png',
    'public/sprites/generated/heroes/nexus-de-convergence/arca-mirelle.png',
    'public/cg/neon-requiem/campaign.png',
    'public/sprites/generated/sprite-manifest.json'
  ];
  const references = new Map([
    ['/backgrounds/halo-tactics-openai.png', ['Halo', 'Predators'].map(universe => ({ universe, basis: 'renderer-test' }))],
    ['/boosters/assassins-creed.webp', [{ universe: "Assassin's Creed", basis: 'booster-test' }]]
  ]);
  const { manifests, sharedManifest } = buildDlcAssetInventory({ packs, publicPaths, references, campaignUniverses: ['Neon Requiem'] });
  const assigned = [...manifests.values()].flatMap(manifest => manifest.assets);
  const all = [...assigned, ...sharedManifest.assets].map(asset => asset.sourcePath);
  assert.deepEqual(all.sort(), [...publicPaths].sort());
  assert.equal(new Set(all).size, publicPaths.length);
  assert.equal(assigned.length, 3);
  assert.equal(manifests.get('DLC/Halo').assets[0].classificationConfidence, 'medium');
  assert.equal(manifests.get('DLC/AssassinsCreed').assets[0].classificationConfidence, 'high');
  assert.equal(manifests.get('DLC/CloudMeadow').assets.length, 1);
  assert.equal(manifests.get('DLC/Buckethead').assets.length, 0);
  assert.equal(manifests.get('DLC/TheMatrix').assets.length, 0);
  for (const directory of ['DLC/Halo', 'DLC/Predators']) {
    assert.deepEqual(manifests.get(directory).sharedDependencies, ['/backgrounds/halo-tactics-openai.png']);
  }
  assert.equal(sharedManifest.distribution.unclaimedReasons['base-game'], 1);
  assert.equal(sharedManifest.distribution.unclaimedReasons['original-campaign'], 1);
  for (const asset of assigned) assert.equal(asset.sourcePath, `public${asset.publicPath}`);
});

test('a reference from another DLC keeps a directory-attributed file shared', () => {
  const { manifests, sharedManifest } = buildDlcAssetInventory({
    packs: [pack('Halo', 'Halo'), pack('Predators', 'Predators')],
    publicPaths: ['public/backgrounds/lore-stages/halo/rpg.webp'],
    references: new Map([['/backgrounds/lore-stages/halo/rpg.webp', [{ universe: 'Predators', basis: 'DLC/Predators/data/scenes.js' }]]])
  });
  assert.equal(manifests.get('DLC/Halo').assets.length, 0);
  assert.equal(sharedManifest.assets[0].reason, 'multiple-universe-references');
  assert.deepEqual(sharedManifest.assets[0].referencedBy, ['Halo', 'Predators']);
});

test('rejects duplicate, unsafe and ambiguous classification inputs', () => {
  const packs = [pack('Halo', 'Halo')];
  assert.throws(() => buildDlcAssetInventory({ packs, publicPaths: ['public/a.png', 'public/a.png'] }), /Duplicate public paths/);
  for (const publicPaths of [[], ['public/../secret'], ['public\\halo.png'], ['src/hero.js']]) {
    assert.throws(() => buildDlcAssetInventory({ packs, publicPaths }), /non-empty|canonical repository path|Expected public/);
  }
  assert.throws(() => buildDlcAssetInventory({
    packs: [pack('Café', 'CafeOne'), pack('Cafe', 'CafeTwo')], publicPaths: ['public/a.png']
  }), /Ambiguous universe directory slug/);
});

const createFixture = t => {
  const root = mkdtempSync(join(tmpdir(), 'multiverse-dlc-assets-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, content) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  };
  const halo = pack('Halo', 'Halo', [
    { path: 'data/requestedUniverseWave.js', runtimeAdapter: 'src/game/requestedUniverseWave.js' },
    { path: 'data/scenes.js', runtimeAdapter: 'src/game/scenes.js' }
  ]);
  write('DLC/Halo/manifest.json', JSON.stringify(halo));
  write('DLC/Halo/data/requestedUniverseWave.js', "export function createWave() { return {\n  key: 'halo_texture',\n}; }\n");
  write('DLC/Halo/data/scenes.js', "export const backdrop = '/backgrounds/halo-stage.png';\nexport function createOpenaiBackdropsRpg() { return '/backgrounds/shared.png'; }\n");
  write('src/game/originalUniversesManifest.json', JSON.stringify({ universes: [{ universe: 'Neon Requiem' }] }));
  write('src/game/portalBoosterCatalog.js', 'export const BOOSTER_ART_BY_UNIVERSE = {\n  "Halo": "/boosters/halo.webp"\n};\n');
  write('src/game/renderer.js', "import * as dlcHalo from '../../DLC/Halo/data/scenes.js';\nexport const OPENAI_BACKDROPS = {\n  RPG: {\n    Halo: dlcHalo.createOpenaiBackdropsRpg(),\n    'Neon Requiem': '/backgrounds/shared.png'\n  }\n};\n");
  write('src/game/recentUniverseTextureAssets.js', 'src: `/textures/recent-universes/${entry.key}-openai-atlas.webp`,\ntacticsSrc: `/textures/recent-universes/${entry.key}-openai-tactics-3q.webp`\n');
  const publicPaths = ['public/boosters/halo.webp', 'public/backgrounds/halo-stage.png', 'public/backgrounds/shared.png', 'public/textures/recent-universes/halo_texture-openai-atlas.webp'];
  for (const path of publicPaths) write(path, 'fixture');
  return { root, write, publicPaths };
};

test('write/check uses the Git index in a sparse checkout and detects staged inventory changes', t => {
  const { root } = createFixture(t);
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['add', '--', 'public'], { cwd: root });
  rmSync(join(root, 'public'), { recursive: true });

  assert.throws(() => runDlcAssetManifestBuild({ root }), /missing or stale/);
  const distribution = runDlcAssetManifestBuild({ root, write: true });
  assert.equal(distribution.inputSource, 'git-index');
  assert.equal(distribution.trackedPublicPaths, 4);
  assert.equal(distribution.assignedToDlc, 3);
  assert.deepEqual(runDlcAssetManifestBuild({ root }), distribution);
  const before = readFileSync(join(root, 'DLC/Halo/assets.json'), 'utf8');
  runDlcAssetManifestBuild({ root, write: true });
  assert.equal(readFileSync(join(root, 'DLC/Halo/assets.json'), 'utf8'), before);

  execFileSync('git', ['update-index', '--force-remove', 'public/boosters/halo.webp'], { cwd: root });
  assert.throws(() => runDlcAssetManifestBuild({ root }), /missing or stale/);
  assert.equal(runDlcAssetManifestBuild({ root, write: true }).trackedPublicPaths, 3);
  runDlcAssetManifestBuild({ root });
});

for (const metadata of ['absent', 'empty']) {
  test(`a source export with ${metadata} Git metadata validates the same inventories and rejects missing or added assets`, t => {
    const { root, write, publicPaths } = createFixture(t);
    execFileSync('git', ['init', '--quiet'], { cwd: root });
    execFileSync('git', ['add', '--', 'public'], { cwd: root });
    runDlcAssetManifestBuild({ root, write: true });
    const before = ['DLC/Halo/assets.json', 'DLC/shared-assets.json'].map(path => readFileSync(join(root, path), 'utf8'));
    rmSync(join(root, '.git'), { recursive: true });
    if (metadata === 'empty') mkdirSync(join(root, '.git'));

    const result = runDlcAssetManifestBuild({ root });
    assert.equal(result.inputSource, 'public-tree');
    assert.equal(result.trackedPublicPaths, publicPaths.length);
    assert.deepEqual(['DLC/Halo/assets.json', 'DLC/shared-assets.json'].map(path => readFileSync(join(root, path), 'utf8')), before);

    rmSync(join(root, publicPaths[0]));
    assert.throws(() => runDlcAssetManifestBuild({ root }), /missing or stale/);
    write(publicPaths[0], 'fixture');
    runDlcAssetManifestBuild({ root });
    write('public/unlisted.png', 'fixture');
    assert.throws(() => runDlcAssetManifestBuild({ root }), /missing or stale/);
  });
}

test('an export never uses a containing repository index, including with an empty .git directory', t => {
  const { root } = createFixture(t);
  runDlcAssetManifestBuild({ root, write: true });
  const parent = mkdtempSync(join(tmpdir(), 'multiverse-dlc-parent-'));
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const exportedRoot = join(parent, 'export');
  renameSync(root, exportedRoot);
  mkdirSync(join(parent, 'public'));
  writeFileSync(join(parent, 'public/parent-only.png'), 'parent fixture');
  execFileSync('git', ['init', '--quiet'], { cwd: parent });
  execFileSync('git', ['add', '--', 'public'], { cwd: parent });

  for (const emptyMetadata of [false, true]) {
    if (emptyMetadata) mkdirSync(join(exportedRoot, '.git'));
    const result = runDlcAssetManifestBuild({ root: exportedRoot });
    assert.equal(result.inputSource, 'public-tree');
    assert.equal(result.trackedPublicPaths, 4);
  }
});

test('canonical DLC sources retain public URLs and exclude generated copies from source exports', t => {
  const { root, write, publicPaths } = createFixture(t);
  const moved = [publicPaths[0], publicPaths[1], publicPaths[3]];
  write('.gitignore', 'node_modules\n');
  write('.vercelignore', '.env*\n');
  for (const path of moved) {
    const target = `DLC/Halo/assets/${path.slice('public/'.length)}`;
    mkdirSync(dirname(join(root, target)), { recursive: true });
    renameSync(join(root, path), join(root, target));
  }
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['add', '--', 'public', 'DLC'], { cwd: root });
  const result = runDlcAssetManifestBuild({ root, write: true });
  assert.equal(result.trackedPublicPaths, 4);
  assert.equal(result.assignedToDlc, 3);
  const manifest = JSON.parse(readFileSync(join(root, 'DLC/Halo/assets.json'), 'utf8'));
  for (const asset of manifest.assets) {
    assert.equal(asset.sourcePath, `DLC/Halo/assets${asset.publicPath}`);
    assert.ok(moved.includes(`public${asset.publicPath}`));
  }
  for (const ignorePath of ['.gitignore', '.vercelignore']) {
    const rules = readFileSync(join(root, ignorePath), 'utf8');
    for (const path of moved) assert.ok(rules.includes(`/${path}\n`));
    assert.ok(!rules.includes('/public/backgrounds/shared.png\n'));
  }
  assert.ok(readFileSync(join(root, '.gitignore'), 'utf8').startsWith('node_modules\n'));
  assert.ok(readFileSync(join(root, '.vercelignore'), 'utf8').startsWith('.env*\n'));
  runDlcAssetManifestBuild({ root });

  for (const path of moved) write(path, 'fixture');
  rmSync(join(root, '.git'), { recursive: true });
  const exported = runDlcAssetManifestBuild({ root });
  assert.equal(exported.inputSource, 'public-tree');
  assert.equal(exported.trackedPublicPaths, 4);
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'DLC/Halo/assets.json'), 'utf8')), manifest);

  rmSync(join(root, `DLC/Halo/assets/${moved[0].slice('public/'.length)}`));
  assert.throws(() => runDlcAssetManifestBuild({ root }), /missing or stale/);
});

test('publication ignore generation preserves unrelated rules and treats filenames literally', () => {
  const original = 'node_modules\n.env*\n';
  const output = renderDlcPublicationIgnore(original, ['/images/[mask]*?.png']);
  assert.ok(output.startsWith(original));
  assert.ok(output.includes('/public/images/\\[mask\\]\\*\\?.png'));
  assert.equal(renderDlcPublicationIgnore(output, ['/images/[mask]*?.png']), output);
  assert.throws(() => renderDlcPublicationIgnore(original, ['/../private']), /canonical repository path/);
  assert.throws(() => renderDlcPublicationIgnore('# BEGIN GENERATED DLC PUBLICATION\n', []), /Malformed/);
});
