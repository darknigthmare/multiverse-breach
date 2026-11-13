import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseAst } from 'rolldown/parseAst';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';
import { DLC_PROFILE_ADAPTER_CONTRACTS } from './dlcProfileAdapters.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifest = (id, directory, filename = 'entries.js', adapter = 'src/catalog.js') => ({
  id, directory: 'DLC/' + directory, modules: [{ path: 'data/' + filename, runtimeAdapter: adapter }]
});
const fixtures = [manifest('drop', 'Drop'), manifest('keep', 'Keep')];
const dataModule = source => import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const makeTransformer = installedPackIds => createDlcProfileTransformer({ root, manifests: fixtures, installedPackIds });
const imports = "import * as gone from '../DLC/Drop/data/entries.js';\n";
const transformFixture = (source, installed = []) => makeTransformer(installed).transform(imports + source, path.join(root, 'src/catalog.js')).code;

test('all profile returns the original source unchanged', () => {
  const source = imports + 'export const values = [gone.create()];\n';
  assert.equal(makeTransformer(['drop', 'keep']).transform(source, path.join(root, 'src/catalog.js')), null);
});

test('array pruning removes entries and spreads without sparse holes or order changes', async () => {
  for (const expression of [
    '[gone.create()]', '[gone.create(),]', '[...gone.create(),]',
    '[gone.create(), 1, 2]', '[1, gone.create(), 2]', '[1, 2, gone.create(),]',
    '[gone.create(), gone.create(), 1, gone.create(), 2, gone.create(),]'
  ]) {
    const module = await dataModule(transformFixture('export const values = ' + expression + ';'));
    const expected = expression.includes('1') ? [1, 2] : [];
    assert.deepEqual(module.values, expected, expression);
    assert.equal(Object.keys(module.values).length, module.values.length, expression);
  }
});

test('JSX runtime modules retain their React source while optional contributions are removed', () => {
  const source = imports + 'export const values = [gone.create()]; export default () => <div>{values.length}</div>;';
  const result = makeTransformer([]).transform(source, path.join(root, 'src/Catalog.jsx'));
  assert.ok(!result.code.includes('gone.create'));
  assert.equal(parseAst(result.code, { lang: 'jsx' }, 'Catalog.jsx').body.at(-1).type, 'ExportDefaultDeclaration');
});

test('dictionary keys are removed instead of receiving empty data objects', async () => {
  const source = [
    'export const values = Object.freeze({',
    '  gone: gone.create(),',
    '  kept: { value: 1 },',
    '  ...gone.create(),',
    '  another: gone.create(),',
    '});'
  ].join('\n');
  const module = await dataModule(transformFixture(source));
  assert.deepEqual(module.values, { kept: { value: 1 } });
  assert.equal(Object.hasOwn(module.values, 'gone'), false);
});

test('private factory values and aliases are removed at their contribution sites', async () => {
  const source = [
    'const first = gone.create(), kept = 42, last = gone.create();',
    'const alias = first;',
    'export const values = [alias, kept, ...last];',
    'export const entries = { first, kept, tail: last };'
  ].join('\n');
  const module = await dataModule(transformFixture(source));
  assert.deepEqual(module.values, [42]);
  assert.deepEqual(module.entries, { kept: 42 });
});

test('named constant imports are omitted without evaluating an absent pack', async () => {
  const source = "import { PACK } from '../DLC/Drop/data/entries.js';\nexport const packs = [PACK];";
  const result = makeTransformer([]).transform(source, path.join(root, 'src/catalog.js'));
  assert.deepEqual((await dataModule(result.code)).packs, []);
  assert.equal(result.removedImports, 1);
  assert.deepEqual(result.omittedPackIds, ['drop']);
});

test('a selected profile executes with the excluded directory physically absent', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'dlc-source-profile-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.mkdir(path.join(directory, 'DLC/Keep/data'), { recursive: true });
  await fs.mkdir(path.join(directory, 'src'), { recursive: true });
  await fs.writeFile(path.join(directory, 'package.json'), '{"type":"module"}\n');
  await fs.writeFile(path.join(directory, 'DLC/Keep/data/entries.js'), "export const create = () => ({ id: 'retained', score: 7 });\n");
  const source = imports + "import * as kept from '../DLC/Keep/data/entries.js';\nexport const values = [gone.create(), kept.create()];";
  const transformer = createDlcProfileTransformer({ root: directory, manifests: fixtures, installedPackIds: ['keep'] });
  const target = path.join(directory, 'src/catalog.js');
  await fs.writeFile(target, transformer.transform(source, target).code);
  const loaded = await import(pathToFileURL(target));
  assert.deepEqual(loaded.values, [{ id: 'retained', score: 7 }]);
  await assert.rejects(fs.stat(path.join(directory, 'DLC/Drop')), { code: 'ENOENT' });
});

test('unknown uses, exports, side effects and shadowed bindings fail closed', () => {
  const cases = [
    'export const result = gone.create();',
    'export const values = consume(gone.create());',
    'export const values = gone.DATA;',
    'export function read(gone) { return gone.create(); }',
    'const value = gone.create(); export { value };',
    'const value = gone.create(); export const values = [value.id];'
  ];
  for (const source of cases) assert.throws(() => transformFixture(source), /\[dlc-profile\]/, source);
  assert.throws(() => makeTransformer([]).transform("import '../DLC/Drop/data/entries.js';", path.join(root, 'src/catalog.js')), /Side-effect/);
  assert.throws(() => makeTransformer([]).transform("export * from '../DLC/Drop/data/entries.js';", path.join(root, 'src/catalog.js')), /explicit absence contract/);
});

test('a retained factory cannot silently lose an excluded dependency', () => {
  const source = imports + "import * as kept from '../DLC/Keep/data/entries.js';\nexport const values = [kept.create({ dependency: gone.create() })];";
  assert.throws(() => makeTransformer(['keep']).transform(source, path.join(root, 'src/catalog.js')), /depends on an excluded pack/);
});

test('excluded dynamic imports, globs and graph entries are rejected', () => {
  const transformer = makeTransformer(['keep']);
  assert.throws(() => transformer.transform("export const load = () => import('../DLC/Drop/data/entries.js');", path.join(root, 'src/catalog.js')), /Dynamic import/);
  assert.throws(() => transformer.transform("const packs = import.meta.glob('../DLC/*/data/*.js');", path.join(root, 'src/catalog.js')), /globs/);
  assert.throws(() => transformer.transform('export const value = 1;', path.join(root, 'DLC/Drop/data/entries.js')), /Excluded DLC module/);
  // Included pack modules can use relative paths that do not spell out DLC/.
  assert.throws(() => transformer.transform("import * as other from '../../Drop/data/entries.js'; export const value = other.create();", path.join(root, 'DLC/Keep/data/entries.js')), /explicit absence contract/);
});

test('independent complete identity metadata remains available in reduced profiles', () => {
  const source = "import identity from '../DLC/content-identities.json' with { type: 'json' }; export { identity };";
  assert.equal(makeTransformer([]).transform(source, path.join(root, 'src/catalog.js')), null);
});

test('manifest and installation identities are validated', () => {
  assert.throws(() => makeTransformer(['typo']), /Unknown installed DLC/);
  assert.throws(() => createDlcProfileTransformer({ root, manifests: [...fixtures, fixtures[0]], installedPackIds: [] }), /Duplicate DLC/);
  assert.throws(() => makeTransformer([]).transform("import x from '../DLC/Drop/data/unlisted.js';", path.join(root, 'src/catalog.js')), /not declared/);
});

test('explicit wardrobe exports keep a stable empty public interface', async () => {
  const manifests = [
    manifest('payday', 'Payday', 'wardrobeOfficialR13.js', 'src/game/wardrobeOfficialR13.js'),
    manifest('magicka', 'Magicka', 'wardrobeOfficialR13.js', 'src/game/wardrobeOfficialR13.js')
  ];
  const source = [
    "import * as dlcPayday from '../../DLC/Payday/data/wardrobeOfficialR13.js';",
    "import * as dlcMagicka from '../../DLC/Magicka/data/wardrobeOfficialR13.js';",
    'export const PAYDAY_WEARERS_R13 = dlcPayday.createWearers();',
    'export const MAGICKA_WEARERS_R13 = dlcMagicka.createWearers();',
    'export const PAYDAY_NAMED_PACKS_R13 = dlcPayday.createNamedPacks();'
  ].join('\n');
  const transformer = createDlcProfileTransformer({ root, manifests, installedPackIds: [] });
  const loaded = await dataModule(transformer.transform(source, path.join(root, 'src/game/wardrobeOfficialR13.js')).code);
  assert.deepEqual(loaded.PAYDAY_WEARERS_R13, []);
  assert.deepEqual(loaded.MAGICKA_WEARERS_R13, []);
  assert.deepEqual(loaded.PAYDAY_NAMED_PACKS_R13, []);
  assert.ok(Object.isFrozen(loaded.PAYDAY_NAMED_PACKS_R13));
});

function exportNames(source, filename) {
  return parseAst(source, null, filename).body.flatMap(node => {
    if (node.type !== 'ExportNamedDeclaration') return [];
    if (node.declaration?.type === 'VariableDeclaration') return node.declaration.declarations.map(value => value.id.name);
    if (node.declaration?.id) return [node.declaration.id.name];
    return node.specifiers.map(value => value.exported.name);
  }).sort();
}

test('every explicit adapter has exactly the actual module export surface', async () => {
  assert.equal(DLC_PROFILE_ADAPTER_CONTRACTS.length, 13);
  for (const contract of DLC_PROFILE_ADAPTER_CONTRACTS) {
    const original = await fs.readFile(path.join(root, contract.module), 'utf8');
    assert.deepEqual(exportNames(contract.code, contract.adapter), exportNames(original, contract.module), contract.adapter);
  }
});

test('absence contracts preserve shared combat defaults without mutating actors', async () => {
  const load = async adapter => dataModule(DLC_PROFILE_ADAPTER_CONTRACTS.find(entry => entry.adapter === 'src/game/' + adapter + '.js').code);
  const alien = await load('canonAliensRescueEncounter');
  const actor = Object.freeze({ id: 'nexus', currentHp: 50 });
  assert.equal(alien.getAliensHiveHeroLoadout(null, actor), actor);
  assert.equal(alien.createAliensRescueEncounter({ id: 3, universe: 'Alien' }), null);
  assert.equal(alien.attachAliensRescueQueen({}, actor), false);
  const rex = await load('canonRexAttackPatterns');
  const encounter = Object.freeze({ complete: false, chaffRemaining: 3 });
  assert.equal(rex.activateRexChaff(encounter), false);
  assert.equal(rex.getRexAttackIntent(encounter), null);
  rex.finishRexAttack(encounter);
  const pirates = await load('canonPiratesCurseEncounter');
  pirates.repairPiratesCursedHeroes(encounter, Object.freeze([actor]));
  assert.equal(pirates.isPiratesCurseProtected(encounter, actor, [actor]), false);
  const discipline = await load('disciplineSprites');
  assert.deepEqual(discipline.getDisciplineSpriteSources(actor), []);
  assert.equal(discipline.getDisciplineSpriteLayout('/sprites/test.png'), null);
  assert.equal(discipline.createDisciplineSpriteRegistry([]).entries.length, 0);
  assert.throws(() => discipline.createDisciplineSpriteRegistry([{ id: 'uninstalled' }]), /not installed/);
});

test('every repository aggregate can be assembled for base and representative selections', async () => {
  const directories = await fs.readdir(path.join(root, 'DLC'), { withFileTypes: true });
  const manifests = [];
  for (const directory of directories.filter(entry => entry.isDirectory())) {
    try {
      manifests.push(JSON.parse(await fs.readFile(path.join(root, 'DLC', directory.name, 'manifest.json'), 'utf8')));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  assert.ok(manifests.length >= 505, 'run repository-wide source coverage in the complete source checkout');
  const adapters = [...new Set(manifests.flatMap(pack => pack.modules.map(module => module.runtimeAdapter)))];
  const sources = await Promise.all(adapters.map(async adapter => [adapter, await fs.readFile(path.join(root, adapter), 'utf8')]));
  for (const selected of [[], ['halo'], ['alien', 'aliens'], ['payday', 'magicka']]) {
    const transformer = createDlcProfileTransformer({ root, manifests, installedPackIds: selected });
    let removed = 0;
    for (const [adapter, source] of sources) {
      const result = transformer.transform(source, path.join(root, adapter));
      if (!result) continue;
      parseAst(result.code, null, adapter);
      removed += result.removedImports;
      const remaining = parseAst(result.code, null, adapter).body.filter(node => node.type === 'ImportDeclaration' && node.source.value.includes('/DLC/'));
      for (const node of remaining) {
        const directory = node.source.value.split('/DLC/')[1].split('/')[0];
        const pack = manifests.find(candidate => candidate.directory === 'DLC/' + directory);
        assert.ok(!pack || selected.includes(pack.id), adapter + ': ' + node.source.value);
      }
    }
    assert.ok(removed > 1500, 'representative profiles actually prune module imports');
  }
});

test('shared sprite brief prefix remains identical through its historical compatibility API', async () => {
  const common = await import('../src/game/loreSpritePromptPrefix.js');
  const legacy = await import('../DLC/DoomSweeperSafeApocalypse/data/loreBossOverrides.js');
  assert.equal(legacy.createSpritePromptPrefix(), common.LORE_SPRITE_PROMPT_PREFIX);
  assert.ok(common.LORE_SPRITE_PROMPT_PREFIX.startsWith('Use case: stylized-concept.'));
  assert.ok(common.LORE_SPRITE_PROMPT_PREFIX.endsWith('no duplicate subject.'));
});
