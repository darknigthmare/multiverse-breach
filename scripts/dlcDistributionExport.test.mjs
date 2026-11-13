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
import { exportDlcDistribution, inspectDlcExportSources } from './exportDlcDistribution.mjs';

const EXPORT_SCRIPT = fileURLToPath(new URL('./exportDlcDistribution.mjs', import.meta.url));
const AUDIT_SCRIPT = fileURLToPath(new URL('./auditDlcDistribution.mjs', import.meta.url));
const profile = (packIds = []) => ({ schemaVersion: 1, mode: packIds.length ? 'selected' : 'base', packIds, sharedPolicy: 'preserve-all' });
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const CANONICAL_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4nGN023LnPwMDAwMTAxQAACryAtmZNLxsAAAAAElFTkSuQmCC', 'base64');
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

for (const [label, selected] of [['base', []], ['Halo', ['halo']], ['mixed', ['halo', 'drop']], ['all', null]]) {
  test('HTML shared media keeps canonical PNG bytes and its original URL in ' + label, t => {
    const f = fixture(t);
    const publicPath = '/icons/menu art.png';
    const sourcePath = 'public' + publicPath;
    const inventory = JSON.parse(readFileSync(path.join(f.root, 'DLC/shared-assets.json')));
    inventory.assets.push({ sourcePath, publicPath });
    writeJson(f.root, 'DLC/shared-assets.json', inventory);
    write(f.root, sourcePath, CANONICAL_PNG);
    const html = '<link rel="icon" href="/icons/menu%20art.png?revision=1&amp;theme=dark#icon"><main id="root"></main><script type="module" src="/src/App.jsx"></script>\n';
    write(f.root, 'index.html', html);
    const result = exportDlcDistribution({ root: f.root, out: f.out,
      profile: selected === null ? { ...profile(), mode: 'all' } : profile(selected) });
    const media = result.receipt.assets.find(asset => asset.publicPath === publicPath);
    assert.equal(media.sha256, digest(CANONICAL_PNG));
    assert.equal(media.sourcePath, sourcePath);
    assert.deepEqual(readFileSync(path.join(f.out, media.destinationPath)), CANONICAL_PNG);
    assert.deepEqual(readFileSync(path.join(f.root, sourcePath)), CANONICAL_PNG);
    assert.equal(readFileSync(path.join(f.out, 'index.html'), 'utf8'), html);
    assert.equal(auditDlcDistribution({ root: f.out }).passed, true);
  });
}

test('an entry image owned by an omitted DLC cannot silently leave a broken base distribution', t => {
  const f = fixture(t);
  const publicPath = '/icons/halo.png';
  const sourcePath = 'DLC/Halo/assets' + publicPath;
  const inventory = JSON.parse(readFileSync(path.join(f.root, 'DLC/Halo/assets.json')));
  inventory.assets.push({ sourcePath, publicPath });
  writeJson(f.root, 'DLC/Halo/assets.json', inventory);
  write(f.root, sourcePath, CANONICAL_PNG);
  write(f.root, 'index.html', '<link rel="icon" href="/icons/halo.png?revision=1#icon">');
  assert.throws(() => runExport(f), /Common UI asset would be excluded: index.html -> \/icons\/halo.png/);
  assert.deepEqual(readdirSync(f.parent), ['source']);
  const selected = runExport(f, ['halo']);
  assert.deepEqual(readFileSync(path.join(selected.out, 'public' + publicPath)), CANONICAL_PNG);
});

for (const [label, selected] of [['base', []], ['Halo', ['halo']], ['mixed', ['halo', 'drop']], ['all', null]]) {
  test('explicit runtime documentation preserves required JSON/modules and canonical media in ' + label, async t => {
    const f = fixture(t);
    const historical = JSON.stringify({ archivedResearch: true, unneededPayload: 'history'.repeat(100) });
    write(f.root, 'docs/research/unused.json', historical);
    write(f.root, 'docs/runtime/entry.mjs', "import info from '../runtime.json' with {type:'json'};export const version=info.version;\n");
    write(f.root, 'src/runtime-check.mjs', "export {version} from '../docs/runtime/entry.mjs';\n");
    write(f.root, 'src/profile-check.mjs', "export {default as installation} from '../DLC/distribution.json' with {type:'json'};\n");
    const provenance = '{"provenancePath":"docs/research/unused.json","canonicalArchive":{"title":"Nexus"}}';
    write(f.root, 'src/canonicalArchive.json', provenance);
    const result = exportDlcDistribution({ root: f.root, out: f.out, documentation: 'runtime',
      profile: selected === null ? { ...profile(), mode: 'all' } : profile(selected) });
    assert.equal(result.audit.passed, true);
    assert.equal(result.documentation.mode, 'runtime');
    assert.equal(result.documentation.copiedFiles, 2);
    assert.equal(result.documentation.omittedJsonFiles, 1);
    assert.equal(result.documentation.omittedJsonBytes, Buffer.byteLength(historical));
    assert.equal(existsSync(path.join(f.out, 'docs/research/unused.json')), false);
    assert.equal(readFileSync(path.join(f.out, 'src/canonicalArchive.json'), 'utf8'), provenance);
    const runtime = await import(pathToFileURL(path.join(f.out, 'src/runtime-check.mjs')).href);
    assert.equal(runtime.version, 1);
    const { installation } = await import(pathToFileURL(path.join(f.out, 'src/profile-check.mjs')).href);
    assert.equal(installation.mode, selected === null ? 'all' : selected.length ? 'selected' : 'base');
    assert.deepEqual(installation.packIds, selected || []);
    for (const asset of result.receipt.assets) {
      assert.deepEqual(readFileSync(path.join(f.out, asset.destinationPath)), readFileSync(path.join(f.root, asset.sourcePath)));
    }
  });
}

test('default documentation keeps historical JSON and rejects invalid explicit modes before staging', t => {
  const f = fixture(t);
  writeJson(f.root, 'docs/research/historical.json', { preserved: true });
  assert.throws(() => exportDlcDistribution({ root: f.root, out: f.out, profile: profile(), documentation: 'unknown' }), /Documentation mode must be all or runtime/);
  assert.deepEqual(readdirSync(f.parent), ['source']);
  const result = runExport(f);
  assert.equal(result.documentation.mode, 'all');
  assert.equal(result.documentation.omittedJsonFiles, 0);
  assert.equal(existsSync(path.join(f.out, 'docs/research/historical.json')), true);
});

test('CLI runtime documentation is explicit and reports omitted research bytes', t => {
  const f = fixture(t);
  const history = '{"researchOnly":true}';
  write(f.root, 'docs/research/unused.json', history);
  const result = spawnSync(process.execPath, [EXPORT_SCRIPT, '--profile', 'config/dlc-profiles/base.json', '--out', f.out,
    '--documentation', 'runtime'], { cwd: f.root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.documentation.mode, 'runtime');
  assert.equal(report.documentation.omittedJsonFiles, 1);
  assert.equal(report.documentation.omittedJsonBytes, Buffer.byteLength(history));
  assert.equal(existsSync(path.join(f.out, 'docs/runtime.json')), true);
  assert.equal(existsSync(path.join(f.out, 'docs/research/unused.json')), false);
});

test('read-only source inspection uses the runtime export closure without requiring materialized media', t => {
  const f = fixture(t);
  const original = readFileSync(path.join(f.root, 'src/game/catalog.js'));
  const history = '{"researchOnly":true}'; write(f.root, 'docs/research/unused.json', history);
  rmSync(path.join(f.root, 'DLC/Halo/assets/images/halo.bin'));
  rmSync(path.join(f.root, 'public/common.bin'));
  for (const selected of [[], ['halo'], ['halo', 'drop'], null]) {
    const report = inspectDlcExportSources({ root: f.root, documentation: 'runtime',
      profile: selected === null ? { ...profile(), mode: 'all' } : profile(selected) });
    assert.equal(report.documentation.omittedJsonFiles, 1);
    assert.equal(report.documentation.omittedJsonBytes, Buffer.byteLength(history));
    assert.ok(report.sourceFiles.includes('docs/runtime.json'));
    assert.ok(!report.sourceFiles.includes('docs/research/unused.json'));
    assert.equal(report.sourceFileCount, report.sourceFiles.length);
    assert.ok(report.sourceBytes > 0);
  }
  assert.deepEqual(readFileSync(path.join(f.root, 'src/game/catalog.js')), original);
  assert.deepEqual(readdirSync(f.parent), ['source']);
  assert.equal(existsSync(path.join(f.root, 'public/common.bin')), false);
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
  assert.equal(JSON.parse(exported.stdout).sourceRevision, null);
  assert.equal(Object.hasOwn(JSON.parse(readFileSync(path.join(f.out, DLC_DISTRIBUTION_RECEIPT))), 'sourceRevision'), false);
  const audited = spawnSync(process.execPath, [AUDIT_SCRIPT, '--root', f.out], { cwd: f.root, encoding: 'utf8' });
  assert.equal(audited.status, 0, audited.stderr);
  assert.equal(JSON.parse(audited.stdout).passed, true);
  const duplicate = spawnSync(process.execPath, [EXPORT_SCRIPT, '--profile', 'config/dlc-profiles/base.json', '--out', f.out],
    { cwd: f.root, encoding: 'utf8' });
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /already exists/);
});

test('CLI pins an explicit complete source revision without changing standalone export defaults', (t) => {
  const f = fixture(t), sourceRevision = '1234567890abcdef1234567890abcdef12345678';
  const exported = spawnSync(process.execPath, [EXPORT_SCRIPT, '--profile', 'config/dlc-profiles/halo.json',
    '--out', f.out, '--source-revision', sourceRevision], { cwd: f.root, encoding: 'utf8' });
  assert.equal(exported.status, 0, exported.stderr);
  assert.equal(JSON.parse(exported.stdout).sourceRevision, sourceRevision);
  assert.equal(auditDlcDistribution({ root: f.out }).receipt.sourceRevision, sourceRevision);
});

test('CLI rejects invalid or repeated revisions before creating output parents or staging', (t) => {
  const f = fixture(t), out = path.join(f.parent, 'not-created', 'edition');
  for (const revision of ['HEAD', 'abc123', 'A'.repeat(40), 'g'.repeat(40), 'a'.repeat(41)]) {
    const result = spawnSync(process.execPath, [EXPORT_SCRIPT, '--profile', 'config/dlc-profiles/halo.json',
      '--out', out, '--source-revision', revision], { cwd: f.root, encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /source-revision.*full lowercase Git/);
    assert.deepEqual(readdirSync(f.parent), ['source']);
  }
  const duplicate = spawnSync(process.execPath, [EXPORT_SCRIPT, '--profile', 'config/dlc-profiles/halo.json',
    '--out', out, '--source-revision', '1'.repeat(40), '--source-revision', '2'.repeat(40)],
  { cwd: f.root, encoding: 'utf8' });
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /duplicate export option/);
  assert.deepEqual(readdirSync(f.parent), ['source']);
});

test('CLI export help explains standalone and differential use without requiring a source checkout', (t) => {
  const f = fixture(t);
  const result = spawnSync(process.execPath, [EXPORT_SCRIPT, '--help'], { cwd: f.parent, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--source-revision FULL_GIT_SHA/);
  assert.match(result.stdout, /Without --source-revision.*standalone builds/);
  assert.deepEqual(readdirSync(f.parent), ['source']);
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
