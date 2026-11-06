import { readFileSync, readdirSync, existsSync, lstatSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const isRelativeFile = value => typeof value === 'string'
  && /^(?:data|runtime)\/[A-Za-z0-9_./-]+\.js$/.test(value)
  && value.split('/').every(part => part && part !== '.' && part !== '..');

function listModuleFiles(directory, prefix = '') {
  const directoryStat = lstatSync(directory, { throwIfNoEntry: false });
  if (!directoryStat) return [];
  if (directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) throw new Error(`DLC module directories must be regular directories: ${directory}`);
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) return listModuleFiles(path.join(directory, entry.name), `${relative}/`);
    if (entry.isSymbolicLink()) throw new Error(`DLC modules must be regular files: ${directory}/${entry.name}`);
    return entry.isFile() && /\.[cm]?jsx?$/.test(entry.name) ? [relative] : [];
  });
}

function assertRegularModule(packageDirectory, relative) {
  const segments = relative.split('/');
  let current = packageDirectory;
  for (const [index, segment] of segments.entries()) {
    current = path.join(current, segment);
    const stat = lstatSync(current, { throwIfNoEntry: false });
    if (!stat) throw new Error(`Missing DLC module: ${packageDirectory}/${relative}`);
    if (index === segments.length - 1) {
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`DLC modules must be regular files: ${current}`);
    } else if (!stat.isDirectory() || stat.isSymbolicLink()) {
      throw new Error(`DLC module directories must be regular directories: ${current}`);
    }
  }
}

/** Read package identities without importing the game or downloading assets. */
export function readDlcManifests(root = PROJECT_ROOT) {
  const directory = path.join(root, 'DLC');
  const identities = new Set();
  const universes = new Set();
  const orders = new Set();
  const folders = new Set();
  const entries = readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isSymbolicLink()) throw new Error(`DLC packages must not be symbolic links: DLC/${entry.name}`);
  }
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const file = path.join(directory, entry.name, 'manifest.json');
      if (!existsSync(file)) throw new Error(`DLC/${entry.name} is missing manifest.json`);
      const manifest = JSON.parse(readFileSync(file, 'utf8'));
      if (manifest.schemaVersion !== 1 || !/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(manifest.id || '')
        || typeof manifest.universe !== 'string' || !manifest.universe.trim()
        || !/^[A-Za-z0-9]+$/.test(entry.name)
        || manifest.directory !== `DLC/${entry.name}`
        || !['runtime', 'artwork-only'].includes(manifest.registration)
        || !Number.isSafeInteger(manifest.catalogOrder) || manifest.catalogOrder < 0
        || manifest.assetManifest !== 'assets.json'
        || !Array.isArray(manifest.modules) || !manifest.modules.length) {
        throw new Error(`Invalid DLC identity or module contract: ${file}`);
      }
      for (const [set, value, label] of [
        [identities, manifest.id, 'ID'], [universes, manifest.universe, 'universe'],
        [orders, manifest.catalogOrder, 'catalog order'], [folders, entry.name.toLowerCase(), 'case-insensitive folder']
      ]) {
        if (set.has(value)) throw new Error(`Duplicate DLC ${label}: ${value}`);
        set.add(value);
      }
      const modulePaths = new Set();
      for (const module of manifest.modules) {
        if (!isRelativeFile(module.path) || modulePaths.has(module.path)) throw new Error(`Invalid or duplicate module in ${file}: ${module.path}`);
        modulePaths.add(module.path);
        assertRegularModule(path.join(directory, entry.name), module.path);
        if (module.runtimeAdapter != null && (typeof module.runtimeAdapter !== 'string'
          || !/^src\/game\/[A-Za-z0-9_/-]+\.js$/.test(module.runtimeAdapter)
          || module.runtimeAdapter.split('/').includes('..')
          || !lstatSync(path.join(root, module.runtimeAdapter), { throwIfNoEntry: false })?.isFile())) throw new Error(`Invalid runtime adapter in ${file}: ${module.runtimeAdapter}`);
      }
      const files = ['data', 'runtime'].flatMap(kind => listModuleFiles(path.join(directory, entry.name, kind), `${kind}/`));
      const unlisted = files.filter(relative => !modulePaths.has(relative));
      if (unlisted.length) throw new Error(`Unlisted DLC modules in ${manifest.directory}: ${unlisted.join(', ')}`);
      return manifest;
    })
    .sort((a, b) => a.catalogOrder - b.catalogOrder);
}

export function renderDlcRegistry(manifests) {
  const imports = manifests.map((manifest, index) => `import pack${index} from './${manifest.directory.slice(4)}/manifest.json' with { type: 'json' };`);
  return [
    '// Generated by scripts/buildDlcRegistry.mjs. Edit each package manifest, then run npm run dlc:registry:write.',
    '// This registry contains metadata only; it does not activate, unlock or download a DLC.',
    ...imports, '',
    'export const DLC_PACK_MANIFESTS = Object.freeze([',
    ...manifests.map((_, index) => `  pack${index},`),
    '].map(pack => Object.freeze({',
    '  ...pack,',
    '  modules: Object.freeze(pack.modules.map(module => Object.freeze({ ...module })))',
    '})));', '',
    "export const DLC_UNIVERSE_KEYS = Object.freeze(DLC_PACK_MANIFESTS.filter(pack => pack.registration === 'runtime').map(pack => pack.universe));",
    'const manifestsByUniverse = new Map(DLC_PACK_MANIFESTS.map(pack => [pack.universe, pack]));',
    'export const getDlcManifest = universe => manifestsByUniverse.get(universe) || null;', ''
  ].join('\n');
}

export function renderPackageIndex(manifest) {
  const namespaces = new Set();
  const lines = manifest.modules.map(module => {
    const name = path.basename(module.path, '.js');
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) || namespaces.has(name)) throw new Error(`Ambiguous module namespace in ${manifest.directory}: ${name}`);
    namespaces.add(name);
    return `export * as ${name} from './${module.path}';`;
  });
  return [
    '// Generated package entry point. Shared constructors remain supplied by the runtime adapters.',
    "export { default as manifest } from './manifest.json' with { type: 'json' };",
    ...lines, ''
  ].join('\n');
}

export function synchronizeDlcRegistry({ root = PROJECT_ROOT, write = false } = {}) {
  const manifests = readDlcManifests(root);
  const files = [
    ['DLC/index.js', renderDlcRegistry(manifests)],
    ...manifests.map(manifest => [`${manifest.directory}/index.js`, renderPackageIndex(manifest)])
  ];
  const stale = [];
  for (const [relative, expected] of files) {
    const file = path.join(root, relative);
    if (!existsSync(file) || readFileSync(file, 'utf8') !== expected) {
      if (write) writeFileSync(file, expected);
      else stale.push(relative);
    }
  }
  if (stale.length) throw new Error(`DLC registry is stale. Run npm run dlc:registry:write.\n${stale.join('\n')}`);
  return { packages: manifests.length, runtimeUniverses: manifests.filter(pack => pack.registration === 'runtime').length, generatedFiles: files.length };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.slice(2).some(arg => !['--write', '--check'].includes(arg)) || (process.argv.includes('--write') && process.argv.includes('--check'))) throw new Error('Usage: node scripts/buildDlcRegistry.mjs [--check | --write]');
    const result = synchronizeDlcRegistry({ write: process.argv.includes('--write') });
    console.log(`DLC registry: ${result.packages} packages, ${result.runtimeUniverses} registered universes, ${result.generatedFiles} entry points verified.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
