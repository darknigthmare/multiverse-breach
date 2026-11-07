import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectAssetPath } from './dlcAssetPaths.mjs';

const statIfPresent = file => {
  try { return lstatSync(file); }
  catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
};

const publicSource = publicPath => {
  const projected = typeof publicPath === 'string' && publicPath.startsWith('/')
    ? projectAssetPath(`public${publicPath}`) : null;
  if (!projected || projected.publicPath !== publicPath) {
    throw new Error(`Expected a canonical public asset URL without traversal: ${JSON.stringify(publicPath)}`);
  }
  return projected.sourcePath;
};

const identity = value => typeof value === 'string' && value.trim() === value && value.length > 0
  && Array.from(value).every(character => character.codePointAt(0) >= 32 && character.codePointAt(0) !== 127);

/** Snapshot registered ownership; missing DLC metadata preserves legacy public/. */
export function createAssetSourceResolver(root = process.cwd()) {
  root = resolve(root);
  const byUniverse = new Map();
  const ids = new Set();
  const byUrl = new Map();
  const bySource = new Map();
  const readJson = (relative, optional = false) => {
    const file = resolve(root, relative);
    const stat = statIfPresent(file);
    if (!stat && optional) return null;
    if (!stat || !stat.isFile() || stat.isSymbolicLink()) {
      throw new Error(`Asset manifest must be a regular file without symlinks: ${relative}`);
    }
    let document;
    try { document = JSON.parse(readFileSync(file, 'utf8')); }
    catch { throw new Error(`Invalid JSON asset manifest: ${relative}`); }
    if (!document || typeof document !== 'object' || Array.isArray(document)) {
      throw new Error(`Invalid asset manifest object: ${relative}`);
    }
    return document;
  };
  const register = (asset, owner) => {
    const destination = publicSource(asset?.publicPath);
    const projected = projectAssetPath(asset?.sourcePath);
    if (!projected || projected.publicPath !== asset.publicPath) {
      throw new Error(`Asset source and public URL disagree in ${owner}: ${JSON.stringify(asset?.sourcePath)}`);
    }
    if (owner === 'DLC/shared-assets.json' ? projected.sourcePath !== destination
      : !projected.sourcePath.startsWith('public/') && !projected.sourcePath.startsWith(`${owner}/assets/`)) {
      throw new Error(`Asset source belongs to another physical owner in ${owner}: ${projected.sourcePath}`);
    }
    if (byUrl.has(asset.publicPath) || bySource.has(projected.sourcePath)) {
      throw new Error(`Duplicate asset source or public URL collision in ${owner}: ${asset.publicPath}`);
    }
    byUrl.set(asset.publicPath, projected.sourcePath);
    bySource.set(projected.sourcePath, asset.publicPath);
  };

  const dlcStat = statIfPresent(resolve(root, 'DLC'));
  if (dlcStat) {
    if (!dlcStat.isDirectory() || dlcStat.isSymbolicLink()) throw new Error('DLC/ must be a real directory without symlinks.');
    for (const entry of readdirSync(resolve(root, 'DLC'), { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const directory = `DLC/${entry.name}`;
      if (entry.isSymbolicLink() && /^[A-Za-z0-9]+$/.test(entry.name)) {
        throw new Error(`DLC directory cannot be a symlink: ${directory}`);
      }
      if (!entry.isDirectory()) continue;
      const manifest = readJson(`${directory}/manifest.json`, true);
      if (!manifest) continue;
      if (!/^[A-Za-z0-9]+$/.test(entry.name) || manifest.schemaVersion !== 1
        || manifest.directory !== directory || !identity(manifest.id) || !identity(manifest.universe)
        || (manifest.assetManifest ?? 'assets.json') !== 'assets.json') {
        throw new Error(`Invalid DLC identity manifest: ${directory}/manifest.json`);
      }
      if (byUniverse.has(manifest.universe) || ids.has(manifest.id)) {
        throw new Error(`Duplicate DLC universe or id: ${manifest.universe}`);
      }
      byUniverse.set(manifest.universe, directory);
      ids.add(manifest.id);
      const inventory = readJson(`${directory}/assets.json`);
      if (inventory.schemaVersion !== 1 || inventory.universe !== manifest.universe || !Array.isArray(inventory.assets)) {
        throw new Error(`Invalid DLC asset inventory: ${directory}/assets.json`);
      }
      for (const asset of inventory.assets) register(asset, directory);
    }
    const shared = readJson('DLC/shared-assets.json', true);
    if (shared) {
      if (shared.schemaVersion !== 1 || !Array.isArray(shared.assets)) throw new Error('Invalid shared asset inventory.');
      for (const asset of shared.assets) register(asset, 'DLC/shared-assets.json');
    }
  }

  return (publicPath, universe = null) => {
    const legacy = publicSource(publicPath);
    if (byUrl.has(publicPath)) return byUrl.get(publicPath);
    // An existing public file retains its location even before the next inventory
    // regeneration. Never bypass a symlink or a non-directory public ancestor.
    let current = root;
    const segments = legacy.split('/');
    let existingPublicFile = true;
    for (let index = 0; index < segments.length; index += 1) {
      current = resolve(current, segments[index]);
      const stat = statIfPresent(current);
      if (!stat) { existingPublicFile = false; break; }
      if (stat.isSymbolicLink()) throw new Error('Public asset paths cannot contain symlinks.');
      if (index < segments.length - 1 && !stat.isDirectory()) throw new Error('Public asset parent must be a directory.');
    }
    if (existingPublicFile) return legacy;
    const directory = byUniverse.get(universe);
    return directory ? `${directory}/assets${publicPath}` : legacy;
  };
}

const resolvers = new Map();

/** Cached convenience for scripts; use the factory to refresh changed manifests. */
export function resolveAssetSourcePath(root, publicPath, universe = null) {
  const key = resolve(root ?? process.cwd());
  if (!resolvers.has(key)) resolvers.set(key, createAssetSourceResolver(key));
  return resolvers.get(key)(publicPath, universe);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const options = {};
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === '--json' && !options.json) { options.json = true; continue; }
      const key = { '--root': 'root', '--public-path': 'publicPath', '--universe': 'universe' }[args[index]];
      if (!key || !args[index + 1] || args[index + 1].startsWith('--') || options[key] !== undefined) {
        throw new Error('Usage: node scripts/assetSourceResolver.mjs --public-path /asset/url [--universe "Exact universe"] [--root REPO] [--json]');
      }
      options[key] = args[index + 1];
      index += 1;
    }
    const sourcePath = resolveAssetSourcePath(options.root, options.publicPath, options.universe);
    process.stdout.write(`${options.json ? JSON.stringify({ sourcePath, publicPath: options.publicPath }) : sourcePath}\n`);
  } catch (error) {
    process.stderr.write(`Asset source resolution failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
