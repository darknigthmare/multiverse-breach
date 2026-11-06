import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { buildDlcAssetInventory, runDlcAssetManifestBuild } from './buildDlcAssetManifests.mjs';

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

test('write/check uses the Git index in a sparse checkout and detects staged inventory changes', t => {
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
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['add', '--', 'public'], { cwd: root });
  rmSync(join(root, 'public'), { recursive: true });

  assert.throws(() => runDlcAssetManifestBuild({ root }), /missing or stale/);
  const distribution = runDlcAssetManifestBuild({ root, write: true });
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
