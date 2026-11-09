import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { register } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { projectExportAssetTree } from './exportAssetTree.mjs';

// Load the real catalog probes using the existing Vite-compatible Node loader.
register('./sourceSceneTestLoader.mjs', import.meta.url);
const { inspectItemAsset, validateEquipmentSources } = await import('./exportEquipmentWorkbookData.mjs');
const { inspectActorRaster } = await import('../src/game/actorFidelityBacklog.js');

const blob = (sha = 'a'.repeat(40), size = 123) => ({ type: 'blob', mode: '100644', sha, size });
const sourceHash = contents => {
  const bytes = Buffer.from(contents);
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
};

test('historical public trees keep their original paths and blob metadata', () => {
  const media = blob(), source = blob('b'.repeat(40));
  const tree = new Map([['public/sprites/hero.png', media], ['src/game/heroes.js', source]]);
  const index = projectExportAssetTree(tree);
  assert.deepEqual(index, tree);
  assert.notEqual(index, tree);
  assert.equal(index.get('src/game/heroes.js'), source);
  assert.equal(inspectActorRaster('/sprites/hero.png', 'auto', 'idle', index).gitBlob, media.sha);
  assert.deepEqual(inspectItemAsset('/sprites/hero.png', index), {
    iconPath: '/sprites/hero.png', iconStatus: 'PRESENT_DANS_GIT', iconBlob: media.sha, iconBytes: 123
  });
});

test('DLC source paths produce the same actor and equipment probes as public paths', () => {
  const media = blob();
  const legacy = new Map([['public/sprites/hero.png', media]]);
  const physical = new Map([['DLC/Halo/assets/sprites/hero.png', media]]);
  const projected = projectExportAssetTree(physical);
  assert.equal(projected.get('DLC/Halo/assets/sprites/hero.png'), media);
  assert.equal(projected.get('public/sprites/hero.png'), media);
  assert.equal(physical.has('public/sprites/hero.png'), false);
  const layout = { columns: 4, rows: 4 };
  const inspectActor = tree => inspectActorRaster('/sprites/hero.png?v=2#idle', 'auto', 'idle', tree, layout);
  assert.deepEqual(inspectActor(projected), inspectActor(legacy));
  assert.equal(inspectActor(projected).artApproved, false);
  assert.deepEqual(inspectItemAsset('/sprites/hero.png?v=2#idle', projected), inspectItemAsset('/sprites/hero.png?v=2#idle', legacy));
});

test('supplied trees alone decide presence, including encoded Unicode URLs and unknown sizes', () => {
  const index = projectExportAssetTree(new Map([
    ['DLC/Halo/assets/cg/Entrée du Nexus.png', blob('c'.repeat(40), null)],
    ['public/shared.png', blob()]
  ]));
  const result = inspectItemAsset('/cg/Entr%C3%A9e%20du%20Nexus.png?version=1', index);
  assert.equal(result.iconPath, '/cg/Entrée du Nexus.png');
  assert.equal(result.iconStatus, 'PRESENT_DANS_GIT');
  assert.equal(result.iconBytes, null);
  assert.equal(inspectItemAsset('/shared.png', index).iconStatus, 'PRESENT_DANS_GIT');
  assert.equal(inspectItemAsset('/sprites/absent.png', index).iconStatus, 'ABSENT_DANS_GIT');
  assert.equal(inspectActorRaster('/sprites/absent.png', 'auto', 'idle', index).status, 'MISSING_IN_GIT');
  assert.equal(inspectItemAsset('/cg/%2e%2e/secret.png', index).iconStatus, 'CHEMIN_INVALIDE');
});

for (const paths of [
  ['public/hero.png', 'DLC/Halo/assets/hero.png'],
  ['DLC/Halo/assets/hero.png', 'DLC/Doom/assets/hero.png']
]) {
  test(`colliding exported sources are rejected: ${paths.join(' / ')}`, () => {
    for (const order of [paths, [...paths].reverse()]) {
      // Identical blob hashes do not make two owners unambiguous.
      const tree = new Map(order.map(sourcePath => [sourcePath, blob()]));
      assert.throws(() => projectExportAssetTree(tree), error => {
        assert.equal(error.code, 'ASSET_PUBLIC_PATH_COLLISION');
        assert.equal(error.publicPath, '/hero.png');
        assert.deepEqual(error.sourcePaths, order);
        return true;
      });
    }
  });
}

test('invalid asset source paths fail instead of disappearing from the export', () => {
  for (const filename of ['public/../secret.png', 'public/sprites/%2e%2e/hero.png', 'DLC/Half-Life/assets/hero.png', 'DLC/Halo/assets/./hero.png']) {
    assert.throws(() => projectExportAssetTree(new Map([[filename, blob()]])), /Invalid asset source path/);
  }
});

test('DLC catalog modules and manifests remain source entries, not public assets', () => {
  const tree = new Map([
    ['DLC/Halo/assets.json', blob()], ['DLC/Halo/data/heroes.js', blob()],
    ['DLC/Halo/manifest.json', blob()], ['DLC/_registry.js', blob()]
  ]);
  assert.deepEqual(projectExportAssetTree(tree), tree);
});

const sourceFixture = (t, extras = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'multiverse-equipment-export-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const tree = new Map();
  const write = (filename, contents) => {
    mkdirSync(dirname(join(root, filename)), { recursive: true });
    writeFileSync(join(root, filename), contents);
  };
  for (const [filename, contents] of Object.entries({
    'src/game/heroes.js': 'export const heroes = [];\n',
    'src/App.jsx': 'export default function App() {}\n',
    'src/components/HubScreen.jsx': 'export default function Hub() {}\n',
    ...extras
  })) {
    write(filename, contents);
    tree.set(filename, blob(sourceHash(contents), Buffer.byteLength(contents)));
  }
  return { root, tree, write };
};

test('equipment source verification still supports a historical checkout without DLC', t => {
  const { root, tree } = sourceFixture(t);
  const sources = validateEquipmentSources(tree, root);
  assert.deepEqual(sources.map(row => row.path).sort(), [...tree.keys()].sort());
  for (const source of sources) assert.equal(source.gitBlob, tree.get(source.path).sha);
});

test('equipment source verification pins DLC definitions and notices changed data', t => {
  const { root, tree, write } = sourceFixture(t, {
    'DLC/Halo/data/heroes.js': 'export const hero = { id: "chief" };\n',
    'DLC/Halo/runtime/encounter.js': 'export const enabled = true;\n',
    'DLC/Halo/manifest.json': '{"universe":"Halo"}\n',
    'DLC/_registry.js': 'export const registry = [];\n'
  });
  assert.equal(validateEquipmentSources(tree, root).length, tree.size);
  write('DLC/Halo/data/heroes.js', 'export const hero = { id: "different" };\n');
  assert.throws(() => validateEquipmentSources(tree, root), /Source differs from pinned commit: DLC\/Halo\/data\/heroes\.js/);
});

test('equipment source verification rejects omitted and unpinned DLC source modules', t => {
  const filename = 'DLC/Halo/data/heroes.js';
  const { root, tree, write } = sourceFixture(t, { [filename]: 'export const hero = {};\n' });
  rmSync(join(root, filename));
  assert.throws(() => validateEquipmentSources(tree, root), /Source missing from checkout: DLC\/Halo\/data\/heroes\.js/);
  write(filename, 'export const hero = {};\n');
  write('DLC/Halo/data/extra.js', 'export const extra = {};\n');
  assert.throws(() => validateEquipmentSources(tree, root), /Source differs from pinned commit: DLC\/Halo\/data\/extra\.js/);
});

test('equipment source validation never demands materialized media or treats asset JSON as runtime code', t => {
  const { root, tree } = sourceFixture(t, {
    'DLC/Halo/data/heroes.js': 'export const hero = {};\n',
    'DLC/Halo/assets/reviews/catalog.json': '{"mediaOnly":true}\n'
  });
  const absentMedia = 'DLC/Halo/assets/sprites/hero.png';
  tree.set(absentMedia, blob());
  const before = validateEquipmentSources(tree, root);
  assert.ok(before.some(row => row.path === 'DLC/Halo/data/heroes.js'));
  assert.ok(before.every(row => !row.path.startsWith('DLC/Halo/assets/')));
  rmSync(join(root, 'DLC/Halo/assets'), { recursive: true });
  assert.deepEqual(validateEquipmentSources(tree, root), before);
});
