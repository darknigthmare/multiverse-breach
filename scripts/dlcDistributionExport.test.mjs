import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { auditDlcDistribution, DLC_DISTRIBUTION_RECEIPT } from './auditDlcDistribution.mjs';
import { exportDlcDistribution } from './exportDlcDistribution.mjs';

const EXPORT_SCRIPT = fileURLToPath(new URL('./exportDlcDistribution.mjs', import.meta.url));
const AUDIT_SCRIPT = fileURLToPath(new URL('./auditDlcDistribution.mjs', import.meta.url));
const profile = (packIds = []) => ({ schemaVersion: 1, mode: packIds.length ? 'selected' : 'base', packIds, sharedPolicy: 'preserve-all' });
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const write = (root, file, bytes) => {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), bytes);
};
const writeJson = (root, file, data) => write(root, file, JSON.stringify(data, null, 2) + '\n');
const fixture = (t) => {
  const parent = mkdtempSync(path.join(tmpdir(), 'multiverse-dlc-export-'));
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const root = path.join(parent, 'source');
  mkdirSync(root);
  const manifests = ['Halo', 'Drop'].map((universe, index) => ({
    schemaVersion: 1, id: universe.toLowerCase(), universe, directory: 'DLC/' + universe,
    registration: 'runtime', catalogOrder: index, assetManifest: 'assets.json',
    modules: [{ path: 'data/heroes.js', runtimeAdapter: 'src/game/catalog.js' }],
  }));
  for (const manifest of manifests) {
    writeJson(root, manifest.directory + '/manifest.json', manifest);
    write(root, manifest.directory + '/index.js',
      "export { default as manifest } from './manifest.json' with { type: 'json' };\nexport * as heroes from './data/heroes.js';\n");
    const binding = manifest.universe.toUpperCase() + '_HEROES';
    write(root, manifest.directory + '/data/heroes.js', 'export const ' + binding + ' = [{id:' + JSON.stringify(manifest.id) + '}];\n');
    const asset = { sourcePath: manifest.directory + '/assets/images/' + manifest.id + '.bin', publicPath: '/images/' + manifest.id + '.bin' };
    writeJson(root, manifest.directory + '/assets.json', { schemaVersion: 1, universe: manifest.universe,
      assets: [asset], sharedDependencies: ['/common.bin'] });
    write(root, asset.sourcePath, Buffer.from([0, 255, manifest.catalogOrder, 10]));
  }
  write(root, 'DLC/index.js', 'export const DLC_PACK_MANIFESTS = ' + JSON.stringify(manifests) + ';\n');
  writeJson(root, 'DLC/content-identities.json', { schemaVersion: 1, indexes: { universes: { Halo: 0, Drop: 1 } } });
  writeJson(root, 'DLC/shared-assets.json', { schemaVersion: 1, assets: [{ sourcePath: 'public/common.bin', publicPath: '/common.bin' }] });
  writeJson(root, 'DLC/distribution.json', { schemaVersion: 1, mode: 'all', packIds: [], sharedPolicy: 'preserve-all' });
  write(root, 'public/common.bin', Buffer.from([128, 0, 255]));
  write(root, 'src/game/catalog.js', [
    "import { HALO_HEROES } from '../../DLC/Halo/data/heroes.js';",
    "import { DROP_HEROES } from '../../DLC/Drop/data/heroes.js';",
    "import info from '../../docs/runtime.json';",
    "export const HEROES = [{ id: 'base' }, ...HALO_HEROES, ...DROP_HEROES];",
    'export const version = info.version;',
  ].join('\n') + '\n');
  write(root, 'src/App.jsx', "import { HEROES } from './game/catalog';\nimport './theme.css';\nexport default function App(){return <main>{HEROES.length}</main>;}\n");
  write(root, 'src/theme.css', 'body{color:#abc}\n');
  write(root, 'api/example.js', 'export default function handler(){return {ok:true};}\n');
  write(root, 'scripts/tool.mjs', "export const DLC_FIXTURE = 'DLC/';\nexport const loadTestFixture = file => import(file);\n");
  writeJson(root, 'docs/runtime.json', { version: 1 });
  write(root, 'docs/omitted.md', 'not a runtime JSON file\n');
  writeJson(root, 'config/dlc-profiles/base.json', profile());
  writeJson(root, 'config/dlc-profiles/halo.json', profile(['halo']));
  writeJson(root, 'package.json', { name: 'distribution-fixture', type: 'module', private: true });
  write(root, 'index.html', '<main id="root"></main><script type="module" src="/src/App.jsx"></script>\n');
  write(root, 'README.md', 'Fixture distribution\n');
  write(root, '.env', 'SECRET=never-copied\n');
  write(root, 'src/.env.local', 'SECRET=never-copied\n');
  write(root, 'src/node_modules/unwanted.js', 'ignored\n');
  write(root, '.git/unwanted', 'ignored\n');
  return { root, parent, out: path.join(parent, 'export') };
};
const runExport = (f, packIds = []) => exportDlcDistribution({ root: f.root, profile: profile(packIds), out: f.out });
const updateAttestedFile = (root, file, contents) => {
  write(root, file, contents);
  const receipt = JSON.parse(readFileSync(path.join(root, DLC_DISTRIBUTION_RECEIPT), 'utf8'));
  const entry = receipt.files.find((item) => item.path === file);
  assert.ok(entry);
  const bytes = Buffer.from(contents);
  Object.assign(entry, { sha256: digest(bytes), bytes: bytes.length });
  writeJson(root, DLC_DISTRIBUTION_RECEIPT, receipt);
};

for (const packIds of [[], ['halo'], ['halo', 'drop']]) {
  test('exports an autonomous source tree for ' + (packIds.join('+') || 'base'), async (t) => {
    const f = fixture(t);
    const result = runExport(f, packIds);
    assert.equal(result.audit.passed, true);
    assert.equal(result.packCount, packIds.length);
    const audit = auditDlcDistribution({ root: f.out });
    assert.equal(audit.packCount, packIds.length);
    assert.ok(audit.runtimeFileCount >= 2);
    for (const universe of ['Halo', 'Drop']) assert.equal(existsSync(path.join(f.out, 'DLC', universe)), packIds.includes(universe.toLowerCase()));
    for (const universe of ['Halo', 'Drop'].filter((name) => packIds.includes(name.toLowerCase()))) {
      const index = path.join('DLC', universe, 'index.js');
      assert.deepEqual(readFileSync(path.join(f.out, index)), readFileSync(path.join(f.root, index)));
      const imported = await import(pathToFileURL(path.join(f.out, index)).href);
      assert.equal(imported.manifest.id, universe.toLowerCase());
      assert.equal(imported.heroes[universe.toUpperCase() + '_HEROES'][0].id, universe.toLowerCase());
    }
    assert.deepEqual(readFileSync(path.join(f.out, 'DLC/index.js')), readFileSync(path.join(f.root, 'DLC/index.js')));
    assert.deepEqual(readFileSync(path.join(f.out, 'DLC/content-identities.json')), readFileSync(path.join(f.root, 'DLC/content-identities.json')));
    assert.equal(existsSync(path.join(f.out, 'docs/runtime.json')), true);
    assert.equal(existsSync(path.join(f.out, 'docs/omitted.md')), false);
    assert.equal(existsSync(path.join(f.out, 'api/example.js')), true);
    assert.deepEqual(readFileSync(path.join(f.out, 'scripts/tool.mjs')), readFileSync(path.join(f.root, 'scripts/tool.mjs')));
    for (const omitted of ['.env', '.git', 'src/.env.local', 'src/node_modules', '.tmp']) assert.equal(existsSync(path.join(f.out, omitted)), false);
    for (const asset of result.receipt.assets) {
      const original = readFileSync(path.join(f.root, asset.sourcePath));
      assert.equal(asset.sha256, digest(original));
      assert.deepEqual(readFileSync(path.join(f.out, asset.sourcePath)), original);
      assert.deepEqual(readFileSync(path.join(f.out, asset.destinationPath)), original);
    }
    assert.deepEqual(readdirSync(f.parent).sort(), ['export', 'source']);
    assert.equal(readFileSync(path.join(f.root, 'src/game/catalog.js'), 'utf8').includes('DROP_HEROES'), true);
    const exported = readFileSync(path.join(f.out, 'src/game/catalog.js'), 'utf8');
    assert.equal(exported.includes('DROP_HEROES'), packIds.includes('drop'));
    assert.equal(exported.includes('HALO_HEROES'), packIds.includes('halo'));
  });
}

test('all mode preserves all contributions and empty packIds in metadata', (t) => {
  const f = fixture(t);
  const result = exportDlcDistribution({ root: f.root,
    profile: { schemaVersion: 1, mode: 'all', packIds: [], sharedPolicy: 'preserve-all' }, out: f.out });
  assert.equal(result.packCount, 2);
  assert.equal(result.profile.mode, 'all');
  assert.deepEqual(result.profile.packIds, []);
  assert.deepEqual(readFileSync(path.join(f.root, 'src/game/catalog.js')), readFileSync(path.join(f.out, 'src/game/catalog.js')));
});

test('refuses an existing output and preserves its contents', (t) => {
  const f = fixture(t);
  write(f.out, 'keep.txt', 'keep');
  assert.throws(() => runExport(f), /already exists/);
  assert.equal(readFileSync(path.join(f.out, 'keep.txt'), 'utf8'), 'keep');
  assert.deepEqual(readdirSync(f.parent).sort(), ['export', 'source']);
});

test('rejects a destination nested inside the source before staging', (t) => {
  const f = fixture(t);
  assert.throws(() => exportDlcDistribution({ root: f.root, profile: profile(), out: path.join(f.root, 'export') }), /outside its source/);
  assert.equal(existsSync(path.join(f.root, 'export')), false);
});

test('strict media failures leave no destination or staging directory', (t) => {
  const f = fixture(t);
  rmSync(path.join(f.root, 'DLC/Halo/assets/images/halo.bin'));
  assert.throws(() => runExport(f, ['halo']), /ENOENT/);
  assert.deepEqual(readdirSync(f.parent), ['source']);
  assert.equal(runExport(f).packCount, 0);
});

test('audit failure cleans only the newly created staging directory', (t) => {
  const f = fixture(t);
  write(f.parent, 'unrelated/keep.txt', 'keep');
  write(f.root, 'src/broken.js', "import './missing.js';\n");
  assert.throws(() => runExport(f), /Missing static runtime import/);
  assert.equal(existsSync(f.out), false);
  assert.deepEqual(readdirSync(f.parent).sort(), ['source', 'unrelated']);
  assert.equal(readFileSync(path.join(f.parent, 'unrelated/keep.txt'), 'utf8'), 'keep');
});

test('audit rejects an unlisted JavaScript file anywhere in the delivered sources', (t) => {
  const f = fixture(t);
  runExport(f);
  write(f.out, 'src/injected.js', 'export const injected=true;\n');
  assert.throws(() => auditDlcDistribution({ root: f.out }),
    (error) => error.code === 'INVALID_DLC_SOURCE_CLOSURE' && error.extraPaths.includes('src/injected.js'));
});

test('audit rejects changed code and corrupted public or canonical media', (t) => {
  const f = fixture(t);
  runExport(f, ['halo']);
  const file = path.join(f.out, 'src/App.jsx');
  const original = readFileSync(file);
  writeFileSync(file, original + '\n// changed\n');
  assert.throws(() => auditDlcDistribution({ root: f.out }), /changed src\/App.jsx/);
  writeFileSync(file, original);
  for (const media of ['public/images/halo.bin', 'DLC/Halo/assets/images/halo.bin']) {
    const originalMedia = readFileSync(path.join(f.out, media));
    write(f.out, media, 'corrupted');
    assert.throws(() => auditDlcDistribution({ root: f.out }), /changed/);
    write(f.out, media, originalMedia);
  }
});

for (const [name, source, error] of [
  ['excluded pack import', "import '../../DLC/Drop/data/heroes.js';\n", /excluded DLC/],
  ['missing relative import', "import './missing.js';\n", /Missing static runtime import/],
  ['missing static dynamic import', "export const load = () => import('./missing.jsx');\n", /Missing static runtime import/],
  ['computed runtime import', 'export const load = file => import(file);\n', /explicit static path/],
  ['escape from source root', "import '../../../outside.js';\n", /escapes the distribution/],
  ['invalid JavaScript', 'export const = ;\n', /Invalid runtime source/],
]) {
  test('AST import audit rejects ' + name + ' even when its source hash is attested', (t) => {
    const f = fixture(t);
    runExport(f);
    updateAttestedFile(f.out, 'src/game/catalog.js', source);
    assert.throws(() => auditDlcDistribution({ root: f.out }), error);
  });
}

test('generated build directories are outside source closure, but new environment files are rejected', (t) => {
  const f = fixture(t);
  runExport(f);
  for (const directory of ['node_modules', '.git', 'dist']) write(f.out, directory + '/generated', 'generated');
  assert.equal(auditDlcDistribution({ root: f.out }).passed, true);
  write(f.out, '.env', 'unexpected');
  assert.throws(() => auditDlcDistribution({ root: f.out }), /source closure/);
});

test('symlinked source files and output ancestors are refused', (t) => {
  const f = fixture(t);
  symlinkSync(path.join(f.root, 'src/App.jsx'), path.join(f.root, 'src/linked.jsx'));
  assert.throws(() => runExport(f), /symlink/);
  rmSync(path.join(f.root, 'src/linked.jsx'));
  mkdirSync(path.join(f.parent, 'real'));
  symlinkSync(path.join(f.parent, 'real'), path.join(f.parent, 'linked'));
  assert.throws(() => exportDlcDistribution({ root: f.root, profile: profile(), out: path.join(f.parent, 'linked/export') }), /symlink/);
  assert.deepEqual(readdirSync(path.join(f.parent, 'real')), []);
});

test('an empty excluded pack directory is refused after export', (t) => {
  const f = fixture(t);
  runExport(f);
  mkdirSync(path.join(f.out, 'DLC/Drop'));
  assert.throws(() => auditDlcDistribution({ root: f.out }), /extra DLC\/Drop/);
});

test('CLI reads an explicit profile and emits a bounded audit summary', (t) => {
  const f = fixture(t);
  const exported = spawnSync(process.execPath, [EXPORT_SCRIPT, '--profile', 'config/dlc-profiles/halo.json', '--out', f.out],
    { cwd: f.root, encoding: 'utf8' });
  assert.equal(exported.status, 0, exported.stderr);
  assert.equal(JSON.parse(exported.stdout).packs, 1);
  const audited = spawnSync(process.execPath, [AUDIT_SCRIPT, '--root', f.out], { cwd: f.root, encoding: 'utf8' });
  assert.equal(audited.status, 0, audited.stderr);
  assert.equal(JSON.parse(audited.stdout).passed, true);
  const duplicate = spawnSync(process.execPath, [EXPORT_SCRIPT, '--profile', 'config/dlc-profiles/base.json', '--out', f.out],
    { cwd: f.root, encoding: 'utf8' });
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /already exists/);
});

test('an existing distribution cannot be re-exported as a false all installation', (t) => {
  const f = fixture(t);
  runExport(f);
  const receipt = readFileSync(path.join(f.out, DLC_DISTRIBUTION_RECEIPT));
  const out = path.join(f.parent, 'reexport');
  assert.throws(() => exportDlcDistribution({ root: f.out, out,
    profile: { schemaVersion: 1, mode: 'all', packIds: [], sharedPolicy: 'preserve-all' } }), /existing distribution cannot be an export source/);
  assert.equal(existsSync(out), false);
  assert.deepEqual(readFileSync(path.join(f.out, DLC_DISTRIBUTION_RECEIPT)), receipt);
  assert.deepEqual(readdirSync(f.parent).sort(), ['export', 'source']);
});

for (const kind of ['modification', 'addition']) {
  test('a concurrent source ' + kind + ' during transformation prevents publication and cleans staging', (t) => {
    const f = fixture(t);
    write(f.parent, 'unrelated/keep.txt', 'keep');
    let mutated = false;
    const originalRead = fs.readFileSync;
    const mocked = t.mock.method(fs, 'readFileSync', (...args) => {
      const value = originalRead(...args);
      if (!mutated && Buffer.isBuffer(value) && value.includes(Buffer.from('export const version = info.version;'))) {
        mutated = true;
        // App.jsx has already been copied when the catalogue is read for transformation.
        if (kind === 'modification') write(f.root, 'src/App.jsx', 'export default function App(){return null;}\n');
        else write(f.root, 'src/added-during-export.js', 'export const added = true;\n');
      }
      return value;
    });
    syncBuiltinESMExports();
    try {
      assert.throws(() => runExport(f), (error) => error.message === (kind === 'modification'
        ? 'Canonical source changed during distribution export: src/App.jsx'
        : 'Canonical source inventory changed during distribution export.'));
      assert.equal(mutated, true);
      assert.equal(existsSync(f.out), false);
      assert.deepEqual(readdirSync(f.parent).sort(), ['source', 'unrelated']);
      assert.equal(readFileSync(path.join(f.parent, 'unrelated/keep.txt'), 'utf8'), 'keep');
    } finally {
      mocked.mock.restore();
      syncBuiltinESMExports();
    }
  });
}
