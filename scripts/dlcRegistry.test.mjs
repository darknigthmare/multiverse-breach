import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';
import { DLC_PACK_MANIFESTS, DLC_UNIVERSE_KEYS, getDlcManifest } from '../DLC/index.js';
import { PROJECT_ROOT, readDlcManifests, synchronizeDlcRegistry } from './buildDlcRegistry.mjs';

let vite;
let lore;
let dlc;

before(async () => {
  vite = await createServer({ configFile: false, root: PROJECT_ROOT, logLevel: 'silent', server: { middlewareMode: true } });
  [lore, dlc] = await Promise.all([
    vite.ssrLoadModule('/src/game/lore.js'),
    vite.ssrLoadModule('/src/game/dlcConfig.js')
  ]);
});

after(async () => { await vite?.close(); });

test('DLC registration covers the runtime lore catalog in its existing order', () => {
  const expected = Object.keys(lore.LORE_DB).filter(universe => !dlc.isBaseGameUniverse(universe) && !dlc.isOriginalCampaignUniverse(universe));
  assert.deepEqual(DLC_UNIVERSE_KEYS, expected);
  assert.deepEqual(dlc.getDlcUniverseKeys(), expected);
  assert.notStrictEqual(dlc.getDlcUniverseKeys(), dlc.getDlcUniverseKeys());
  for (const universe of [...dlc.BASE_GAME_UNIVERSES, ...dlc.ORIGINAL_CAMPAIGN_UNIVERSES]) {
    assert.equal(getDlcManifest(universe), null, `Base content must not be registered as DLC: ${universe}`);
  }
});

test('artwork-only packages stay outside unlocks and saved hidden-universe defaults', () => {
  const cloudMeadow = getDlcManifest('Cloud Meadow');
  assert.ok(cloudMeadow, 'Existing Cloud Meadow artwork has a package');
  assert.equal(cloudMeadow.registration, 'artwork-only');
  assert.equal(DLC_UNIVERSE_KEYS.includes(cloudMeadow.universe), false);
  assert.equal(dlc.DEFAULT_HIDDEN_UNIVERSES.includes(cloudMeadow.universe), false);
  assert.equal(Object.hasOwn(lore.LORE_DB, cloudMeadow.universe), false);
});

test('every package module is declared and generated entry points match manifests', () => {
  const manifests = readDlcManifests();
  assert.deepEqual(manifests, DLC_PACK_MANIFESTS);
  const result = synchronizeDlcRegistry();
  assert.equal(result.packages, manifests.length);
  assert.equal(result.runtimeUniverses, DLC_UNIVERSE_KEYS.length);
  assert.equal(result.generatedFiles, manifests.length + 1);
  for (const manifest of manifests) {
    assert.ok(Object.isFrozen(getDlcManifest(manifest.universe)));
    assert.ok(Object.isFrozen(getDlcManifest(manifest.universe).modules));
    for (const module of manifest.modules) {
      const source = readFileSync(path.join(PROJECT_ROOT, manifest.directory, module.path), 'utf8');
      // Authored content must live in the package. A forwarding wrapper back to
      // the aggregate would merely disguise the old monolithic ownership.
      assert.doesNotMatch(source, /export\s+\*\s+from\s+['"][^'"]*\/src\/game\//, `${manifest.directory}/${module.path}`);
    }
  }
});

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'multiverse-dlc-registry-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, 'src/game'), { recursive: true });
  writeFileSync(path.join(root, 'src/game/catalog.js'), 'export const entries = [];\n');
  const add = (folder, overrides = {}) => {
    const directory = `DLC/${folder}`;
    mkdirSync(path.join(root, directory, 'data'), { recursive: true });
    writeFileSync(path.join(root, directory, 'data/catalog.js'), 'export const entry = {};\n');
    const manifest = {
      schemaVersion: 1, id: folder.toLowerCase(), universe: folder, directory,
      registration: 'runtime', catalogOrder: 0,
      modules: [{ path: 'data/catalog.js', runtimeAdapter: 'src/game/catalog.js' }],
      assetManifest: 'assets.json', ...overrides
    };
    writeFileSync(path.join(root, directory, 'manifest.json'), `${JSON.stringify(manifest)}\n`);
    return manifest;
  };
  return { root, add };
}

test('an omitted content file fails registry validation', t => {
  const { root, add } = fixture(t);
  add('Example');
  writeFileSync(path.join(root, 'DLC/Example/data/forgotten.js'), 'export const hero = {};\n');
  assert.throws(() => readDlcManifests(root), /Unlisted DLC modules.*forgotten\.js/);
});

test('duplicate universe keys and ambiguous catalog order are rejected', t => {
  const { root, add } = fixture(t);
  add('First');
  add('Second', { universe: 'First', catalogOrder: 1 });
  assert.throws(() => readDlcManifests(root), /Duplicate DLC universe/);
  add('Second', { catalogOrder: 0 });
  assert.throws(() => readDlcManifests(root), /Duplicate DLC catalog order/);
});

test('case-only folder collisions are rejected before crossing operating systems', t => {
  const { root, add } = fixture(t);
  add('Example');
  add('example', { id: 'example-lower', universe: 'Other universe', catalogOrder: 1 });
  assert.throws(() => readDlcManifests(root), /Duplicate DLC case-insensitive folder/);
});

test('package paths cannot escape their directory or name missing modules', t => {
  const { root, add } = fixture(t);
  add('Example', { modules: [{ path: 'data/../../src/game/catalog.js' }] });
  assert.throws(() => readDlcManifests(root), /Invalid or duplicate module/);
  add('Example', { modules: [{ path: 'data/missing.js' }] });
  assert.throws(() => readDlcManifests(root), /Missing DLC module/);
});

test('a declared JavaScript module must be a regular file', t => {
  const { root, add } = fixture(t);
  add('Example');
  const modulePath = path.join(root, 'DLC/Example/data/catalog.js');
  rmSync(modulePath);
  mkdirSync(modulePath);
  assert.throws(() => readDlcManifests(root), /DLC modules must be regular files/);
  rmSync(modulePath, { recursive: true });
  symlinkSync(path.join(root, 'src/game/catalog.js'), modulePath);
  assert.throws(() => readDlcManifests(root), /DLC modules must be regular files/);
});

test('data and runtime roots cannot be symbolic links outside their package', t => {
  for (const kind of ['data', 'runtime']) {
    const { root, add } = fixture(t);
    add('Example');
    const contentRoot = path.join(root, 'DLC/Example', kind);
    rmSync(contentRoot, { recursive: true, force: true });
    symlinkSync(path.join(root, 'src/game'), contentRoot);
    assert.throws(() => readDlcManifests(root), /DLC module directories must be regular directories/);
  }
});

test('a symbolic link at package level is rejected instead of silently omitted', t => {
  const { root, add } = fixture(t);
  add('Example');
  symlinkSync(path.join(root, 'DLC/Example'), path.join(root, 'DLC/Alias'));
  assert.throws(() => readDlcManifests(root), /DLC packages must not be symbolic links: DLC\/Alias/);
});

test('a newly declared pack is detected until all registry entry points are regenerated', t => {
  const { root, add } = fixture(t);
  add('First');
  synchronizeDlcRegistry({ root, write: true });
  add('Second', { catalogOrder: 1 });
  assert.throws(() => synchronizeDlcRegistry({ root }), /DLC registry is stale/);
  synchronizeDlcRegistry({ root, write: true });
  assert.equal(synchronizeDlcRegistry({ root }).packages, 2);
});
