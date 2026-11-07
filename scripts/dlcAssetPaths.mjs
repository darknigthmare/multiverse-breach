import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';

const gitOptions = root => ({
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_NO_LAZY_FETCH: '1' },
  stdio: ['ignore', 'pipe', 'pipe']
});

/** Map a canonical physical asset source to its unchanged public URL. */
export function projectAssetPath(sourcePath) {
  if (typeof sourcePath !== 'string' || !sourcePath || /[\\:%?#]/.test(sourcePath)
    || Array.from(sourcePath).some(character => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)
    || sourcePath.split('/').some(segment => !segment || segment === '.' || segment === '..')) return null;
  const suffix = sourcePath.startsWith('public/')
    ? sourcePath.slice('public/'.length)
    : sourcePath.match(/^DLC\/[A-Za-z0-9]+\/assets\/(.+)$/)?.[1];
  return suffix ? { sourcePath, publicPath: `/${suffix}` } : null;
}

/** An exported project must never borrow a containing repository's index. */
export function hasOwnGitIndex(root = process.cwd()) {
  if (!existsSync(resolve(root, '.git'))) return false;
  const probe = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    ...gitOptions(root), stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000
  });
  // Direct uploads can leave an empty .git directory or an unusable worktree link.
  return probe.status === 0 && resolve(probe.stdout.trim()) === realpathSync(root);
}

const readGitPaths = root => {
  if (!hasOwnGitIndex(root)) {
    throw new Error(`Asset source root is not a git repository with its own usable index: ${root}`);
  }
  return execFileSync('git', ['ls-files', '--cached', '-z'], gitOptions(root)).split('\0').filter(Boolean);
};

const isAssetCandidate = sourcePath => sourcePath === 'public' || sourcePath.startsWith('public/')
  || /^DLC\/[^/]+\/assets(?:\/|$)/.test(sourcePath);

const entriesForSources = sourcePaths => {
  const byUrl = new Map();
  return sourcePaths.map(sourcePath => {
    const entry = projectAssetPath(sourcePath);
    if (!entry) {
      throw new Error(`Expected a canonical relative asset path under public/ or DLC/<Alnum>/assets/: ${JSON.stringify(sourcePath)}`);
    }
    const previous = byUrl.get(entry.publicPath);
    if (previous) {
      const error = new Error(`Asset URL collision for ${JSON.stringify(entry.publicPath)}: ${JSON.stringify(previous.sourcePath)} and ${JSON.stringify(sourcePath)}`);
      error.code = 'ASSET_PUBLIC_PATH_COLLISION';
      error.publicPath = entry.publicPath;
      error.sourcePaths = [previous.sourcePath, sourcePath];
      throw error;
    }
    byUrl.set(entry.publicPath, entry);
    return entry;
  });
};

/** Preserve sparse/deleted files in the inventory; no asset blobs are fetched. */
export function listGitAssetSources(root = process.cwd()) {
  return entriesForSources(readGitPaths(root).filter(isAssetCandidate).sort()).map(entry => entry.sourcePath);
}

const statIfPresent = path => {
  try { return lstatSync(path); }
  catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
};

const isRealDirectory = (root, path) => {
  const stat = statIfPresent(resolve(root, path));
  if (!stat) return false;
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`${path}/ must be a real directory, not a symlink, junction or file.`);
  }
  return true;
};

const walkAssetTree = (root, directory, sources) => {
  for (const entry of readdirSync(resolve(root, directory), { withFileTypes: true })) {
    const sourcePath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) walkAssetTree(root, sourcePath, sources);
    else {
      // Include leaf symlinks/non-files for the byte audit, but never follow them.
      if (!projectAssetPath(sourcePath)) {
        throw new Error(`Expected a canonical relative asset path: ${JSON.stringify(sourcePath)}`);
      }
      sources.push(sourcePath);
    }
  }
};

/** Scan an export; a generated public copy does not replace its DLC source. */
export function listMaterializedAssetSources(root = process.cwd()) {
  const publicSources = [];
  const dlcSources = [];
  if (isRealDirectory(root, 'public')) walkAssetTree(root, 'public', publicSources);
  if (isRealDirectory(root, 'DLC')) {
    for (const entry of readdirSync(resolve(root, 'DLC'), { withFileTypes: true })) {
      const directory = `DLC/${entry.name}`;
      if (entry.isSymbolicLink() && /^[A-Za-z0-9]+$/.test(entry.name)) {
        throw new Error(`${directory}/ must be a real directory, not a symlink or junction.`);
      }
      if (!entry.isDirectory()) continue;
      const assetsDirectory = `${directory}/assets`;
      if (!isRealDirectory(root, assetsDirectory)) continue;
      if (!/^[A-Za-z0-9]+$/.test(entry.name)) {
        throw new Error(`Expected an alphanumeric DLC folder: ${JSON.stringify(directory)}`);
      }
      walkAssetTree(root, assetsDirectory, dlcSources);
    }
  }
  // Multiple DLC owners are an error even when public/ also contains a copy.
  const dlcUrls = new Set(entriesForSources(dlcSources.sort()).map(entry => entry.publicPath));
  const sources = [...dlcSources, ...publicSources.filter(sourcePath => !dlcUrls.has(projectAssetPath(sourcePath).publicPath))].sort();
  return entriesForSources(sources).map(entry => entry.sourcePath);
}

export function listAssetSourceEntries(root = process.cwd()) {
  const fromGit = hasOwnGitIndex(root);
  const sources = fromGit ? listGitAssetSources(root) : listMaterializedAssetSources(root);
  return { entries: entriesForSources(sources), inputSource: fromGit ? 'git-index' : 'public-tree' };
}

/** Keep legacy inventory checks aware of public URLs without losing raw files. */
export function listTrackedRuntimePaths(root = process.cwd()) {
  const paths = readGitPaths(root);
  const assets = entriesForSources(paths.filter(isAssetCandidate));
  return [...new Set([...paths, ...assets.map(entry => `public${entry.publicPath}`)])].sort();
}
