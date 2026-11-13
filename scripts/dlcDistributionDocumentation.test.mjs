import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { collectDlcRuntimeDocumentation } from './dlcDistributionDocumentation.mjs';

function fixture(t) {
  const parent = mkdtempSync(path.join(tmpdir(), 'dlc-runtime-docs-'));
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const root = path.join(parent, 'source'); mkdirSync(root);
  const write = (file, data) => {
    const target = path.join(root, file); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, data);
  };
  return { root, parent, write };
}

test('runtime documentation follows transitive imports, reexports, literal dynamic imports and config helpers', t => {
  const f = fixture(t);
  f.write('src/main.js', "import '../docs/runtime/entry.mjs';\nexport const metadata = { evidence: 'docs/research/unused.json' };\n");
  f.write('docs/runtime/entry.mjs', "export { default as data } from './data.json' with { type: 'json' };\nexport * from './nested';\nexport const load = () => import(`./lazy.json`, { with: { type: 'json' } });\n");
  f.write('docs/runtime/nested/index.mjs', 'export const value=1;\n');
  f.write('docs/runtime/data.json', '{"evidence":"docs/research/unused.json"}');
  f.write('docs/runtime/lazy.json', '{"value":2}');
  f.write('docs/research/unused.json', '{"historical":true}');
  f.write('api/handler.js', "import info from '../docs/api.json' with {type:'json'}; export default()=>info;\n");
  f.write('docs/api.json', '{}');
  f.write('DLC/Halo/data/heroes.js', "import info from '../../../docs/halo.json' with {type:'json'};export const heroes=info;\n");
  f.write('docs/halo.json', '{}');
  f.write('vite.config.js', "import './scripts/build-helper.mjs';export default{};\n");
  f.write('scripts/build-helper.mjs', "export { default } from '../docs/build.json' with { type:'json' };\n");
  f.write('docs/build.json', '{}');
  f.write('scripts/research.mjs', "import '../docs/research/not-a-production-dependency.mjs';\n");
  const result = collectDlcRuntimeDocumentation({ root: f.root, sourceFiles: ['src/main.js', 'api/handler.js',
    'DLC/Halo/data/heroes.js', 'vite.config.js', 'scripts/build-helper.mjs', 'scripts/research.mjs'] });
  assert.deepEqual(result.files, ['docs/api.json', 'docs/build.json', 'docs/halo.json', 'docs/runtime/data.json',
    'docs/runtime/entry.mjs', 'docs/runtime/lazy.json', 'docs/runtime/nested/index.mjs']);
  assert.equal(result.inspectedModules, 7);
});

for (const [label, source, pattern] of [
  ['missing local import', "import '../docs/missing.json';", /Missing runtime documentation import/],
  ['computed import', 'export const load=path=>import(path);', /Computed runtime import has no static documentation closure/],
  ['import glob', "export const docs=import.meta.glob('../docs/*.json');", /glob has no static documentation closure/],
  ['parent escape', "import '../../outside.json';", /leaves the allowed source tree/],
  ['environment input', "import '../.env.local';", /leaves the allowed source tree/],
]) {
  test('runtime documentation refuses ' + label + ' instead of claiming an unknown closure', t => {
    const f = fixture(t); f.write('src/main.js', source);
    writeFileSync(path.join(f.parent, 'outside.json'), '{}');
    f.write('.env.local', 'FIXTURE_ONLY=not-exported');
    assert.throws(() => collectDlcRuntimeDocumentation({ root: f.root, sourceFiles: ['src/main.js'] }), pattern);
  });
}

test('runtime documentation refuses symlinked inputs and untransformed excluded DLC imports', t => {
  const f = fixture(t);
  f.write('docs/real.json', '{}');
  symlinkSync(path.join(f.root, 'docs/real.json'), path.join(f.root, 'docs/link.json'));
  f.write('src/main.js', "import '../docs/link.json' with { type:'json' };\n");
  assert.throws(() => collectDlcRuntimeDocumentation({ root: f.root, sourceFiles: ['src/main.js'] }), /symlink/);
  f.write('DLC/Drop/data/value.js', 'export const value=1;');
  f.write('src/main.js', "import '../DLC/Drop/data/value.js';\n");
  assert.throws(() => collectDlcRuntimeDocumentation({ root: f.root, sourceFiles: ['src/main.js'] }), /excluded DLC/);
  assert.deepEqual(collectDlcRuntimeDocumentation({ root: f.root, sourceFiles: ['src/main.js'], transformSource: () => 'export const value=0;' }).files, []);
});

test('the generated installation profile is not copied as canonical documentation', t => {
  const f = fixture(t);
  f.write('src/main.js', "import profile from '../DLC/distribution.json' with { type:'json' };export default profile;\n");
  assert.deepEqual(collectDlcRuntimeDocumentation({ root: f.root, sourceFiles: ['src/main.js'] }).files, []);
  f.write('DLC/distribution.json', '{"sourceProfile":"must-not-be-copied"}');
  assert.deepEqual(collectDlcRuntimeDocumentation({ root: f.root, sourceFiles: ['src/main.js'] }).files, []);
});
