import { createHash, randomUUID } from 'node:crypto';
import {
  closeSync, constants, copyFileSync, lstatSync, mkdirSync, openSync, readFileSync,
  readdirSync, readSync, renameSync, rmSync, unlinkSync, writeFileSync
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildDlcDistributionPlan } from './dlcDistribution.mjs';

const STATE_PATH = '.tmp/dlc-publication-state.json';
const LFS_HEADER = /^version https:\/\/git-lfs\.github\.com\/spec\/v1\r?(?:\n|$)/;
const compareEntries = (left, right) => left.destinationPath < right.destinationPath ? -1
  : left.destinationPath > right.destinationPath ? 1 : 0;

const safeRelativePath = (value, context) => {
  if (typeof value !== 'string' || !value || /[\\:]/.test(value)
    || Array.from(value).some(character => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)
    || value.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(context + ' must be a canonical relative path without traversal: ' + JSON.stringify(value));
  }
  return value;
};

const checkedRoot = root => {
  const absolute = resolve(root);
  const stat = lstatSync(absolute);
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error('DLC publication root must be a real directory, not a symlink: ' + absolute);
  }
  return absolute;
};

// Check every component, including a dangling link; never follow directory links.
const inspectPath = (root, relativePath, directory = false) => {
  safeRelativePath(relativePath, 'Asset path');
  const parts = relativePath.split('/');
  let stat;
  for (let index = 0; index < parts.length; index += 1) {
    const relative = parts.slice(0, index + 1).join('/');
    try { stat = lstatSync(resolve(root, relative)); }
    catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error('DLC publication refuses a symlink/junction: ' + relative);
    const needsDirectory = index < parts.length - 1 || directory;
    if (needsDirectory ? !stat.isDirectory() : !stat.isFile()) {
      throw new Error('DLC publication expected a regular ' + (needsDirectory ? 'directory: ' : 'file: ') + relative);
    }
  }
  return stat;
};

const publicationDestination = asset => {
  if (typeof asset.publicPath !== 'string' || !asset.publicPath.startsWith('/')) {
    throw new Error('DLC publicPath must start with one slash: ' + JSON.stringify(asset.publicPath));
  }
  const suffix = safeRelativePath(asset.publicPath.slice(1), 'DLC publicPath');
  safeRelativePath(asset.sourcePath, 'DLC sourcePath');
  return 'public/' + suffix;
};

const publicationEntry = (asset, folder) => {
  const destinationPath = publicationDestination(asset);
  safeRelativePath(folder, 'DLC folder');
  if (folder.includes('/')) throw new Error('DLC folder must be one path component: ' + folder);
  const expected = 'DLC/' + folder + '/assets/' + destinationPath.slice('public/'.length);
  if (asset.sourcePath !== expected) {
    throw new Error('DLC sourcePath must equal ' + expected + ', received ' + JSON.stringify(asset.sourcePath));
  }
  return { sourcePath: asset.sourcePath, publicPath: asset.publicPath, destinationPath };
};

const publicSourceEntry = asset => {
  const destinationPath = publicationDestination(asset);
  if (asset.sourcePath !== destinationPath) {
    throw new Error('Public sourcePath must equal ' + destinationPath + ', received ' + JSON.stringify(asset.sourcePath));
  }
  return { sourcePath: asset.sourcePath, publicPath: asset.publicPath, destinationPath };
};

const assertUniqueEntries = entries => {
  const sources = new Set();
  const destinations = new Set();
  for (const entry of entries) {
    if (sources.has(entry.sourcePath) || destinations.has(entry.destinationPath)) {
      throw new Error('Duplicate DLC publication source or public path: ' + entry.sourcePath + ' -> ' + entry.publicPath);
    }
    sources.add(entry.sourcePath);
    destinations.add(entry.destinationPath);
  }
  for (const destination of destinations) {
    let parent = destination;
    while (parent.includes('/')) {
      parent = parent.slice(0, parent.lastIndexOf('/'));
      if (destinations.has(parent)) throw new Error('DLC publication file/directory collision: ' + parent + ' and ' + destination);
    }
  }
};

const readDlcPublicationPlan = root => {
  root = checkedRoot(root);
  if (!inspectPath(root, 'DLC', true)) throw new Error('Missing DLC directory: ' + root);
  const entries = [];
  const publicSources = [];
  const readManifest = (manifestPath, folder = null) => {
    if (!inspectPath(root, manifestPath)) return;
    const manifest = JSON.parse(readFileSync(resolve(root, manifestPath), 'utf8'));
    if (!manifest || !Array.isArray(manifest.assets)) throw new Error('Expected an assets array in ' + manifestPath);
    for (const asset of manifest.assets) {
      if (!asset || typeof asset.sourcePath !== 'string') throw new Error('Expected an asset sourcePath in ' + manifestPath);
      if (folder && asset.sourcePath.startsWith('DLC/')) entries.push(publicationEntry(asset, folder));
      else publicSources.push(publicSourceEntry(asset));
    }
  };
  const folders = readdirSync(resolve(root, 'DLC'), { withFileTypes: true })
    .sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
  for (const folder of folders) {
    if (folder.isSymbolicLink()) throw new Error('DLC publication refuses a symlink/junction: DLC/' + folder.name);
    if (!folder.isDirectory()) continue;
    readManifest('DLC/' + folder.name + '/assets.json', folder.name);
  }
  readManifest('DLC/shared-assets.json');
  assertUniqueEntries([...entries, ...publicSources]);
  return {
    entries: entries.sort(compareEntries),
    publicSources: new Set(publicSources.map(entry => entry.destinationPath))
  };
};

/** Read migrated assets only; legacy public/ entries remain owned by the shared tree. */
const readSelectedPublicationPlan = (root, selection) => {
  if (selection === undefined) return readDlcPublicationPlan(root);
  const plan = buildDlcDistributionPlan({ root, selection });
  return {
    entries: plan.dlcAssets.map(({ sourcePath, publicPath, destinationPath }) =>
      ({ sourcePath, publicPath, destinationPath })),
    publicSources: new Set(plan.publicSourcePaths)
  };
};

export function readDlcPublicationEntries({ root = process.cwd(), selection } = {}) {
  return readSelectedPublicationPlan(root, selection).entries;
}

const hashFile = path => {
  const digest = createHash('sha256');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  const descriptor = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW || 0));
  let first = true;
  let lfsPointer = false;
  try {
    let length;
    while ((length = readSync(descriptor, buffer, 0, buffer.length, null)) > 0) {
      if (first) {
        lfsPointer = LFS_HEADER.test(buffer.subarray(0, Math.min(length, 256)).toString('utf8').replace(/^\uFEFF/, ''));
        first = false;
      }
      digest.update(buffer.subarray(0, length));
    }
  } finally { closeSync(descriptor); }
  return { sha256: digest.digest('hex'), lfsPointer };
};

const readState = root => {
  if (!inspectPath(root, STATE_PATH)) return { content: null, entries: [] };
  const content = readFileSync(resolve(root, STATE_PATH), 'utf8');
  const state = JSON.parse(content);
  if (!state || state.schemaVersion !== 1 || !Array.isArray(state.files)) {
    throw new Error('Invalid DLC publication state: ' + STATE_PATH);
  }
  const entries = state.files.map(file => {
    if (!file || typeof file.sourcePath !== 'string' || !/^[a-f0-9]{64}$/.test(file.sha256)) {
      throw new Error('Invalid DLC publication state entry: ' + STATE_PATH);
    }
    const entry = publicationEntry(file, file.sourcePath.split('/')[1]);
    return { ...entry, sha256: file.sha256 };
  });
  assertUniqueEntries(entries);
  return { content, entries };
};

const assertDestinationUnchanged = (root, entry, expectedHash) => {
  const stat = inspectPath(root, entry.destinationPath);
  const actualHash = stat ? hashFile(resolve(root, entry.destinationPath)).sha256 : null;
  if (actualHash !== expectedHash) {
    throw new Error('DLC publication destination changed; preserving local contents: ' + entry.destinationPath);
  }
};

const makeParentDirectory = (root, relativePath) => {
  const parent = relativePath.slice(0, relativePath.lastIndexOf('/'));
  inspectPath(root, parent, true);
  mkdirSync(resolve(root, parent), { recursive: true });
};

const publishCopy = (root, entry, expectedHash) => {
  inspectPath(root, entry.sourcePath);
  makeParentDirectory(root, entry.destinationPath);
  const destination = resolve(root, entry.destinationPath);
  const temporary = resolve(dirname(destination), '.dlc-publication-' + randomUUID() + '.tmp');
  try {
    copyFileSync(resolve(root, entry.sourcePath), temporary, constants.COPYFILE_EXCL | constants.COPYFILE_FICLONE);
    if (hashFile(temporary).sha256 !== entry.sha256) {
      throw new Error('DLC source changed during publication: ' + entry.sourcePath);
    }
    assertDestinationUnchanged(root, entry, expectedHash);
    renameSync(temporary, destination);
  } finally { rmSync(temporary, { force: true }); }
};

/** Materialize public URLs without overwriting or deleting locally changed copies. */
export function prepareDlcAssets({ root = process.cwd(), availableOnly = false, selection } = {}) {
  if (selection !== undefined && availableOnly) {
    throw new Error('DLC installation profiles require complete assets; availableOnly cannot be used with a selection.');
  }
  root = checkedRoot(root);
  const { entries, publicSources } = readSelectedPublicationPlan(root, selection);
  const previousState = readState(root);
  // A former generated copy can become the canonical public source when its
  // asset is shared. Release it from our state without hashing or removing it;
  // the source may legitimately have changed along with its ownership.
  const previous = new Map(previousState.entries
    .filter(entry => !publicSources.has(entry.destinationPath))
    .map(entry => [entry.destinationPath, entry]));
  const snapshots = new Map();
  const destinationHash = entry => {
    if (!snapshots.has(entry.destinationPath)) {
      const stat = inspectPath(root, entry.destinationPath);
      snapshots.set(entry.destinationPath, stat ? hashFile(resolve(root, entry.destinationPath)).sha256 : null);
    }
    return snapshots.get(entry.destinationPath);
  };
  // Validate retained ownership, including files removed from all manifests.
  for (const entry of previous.values()) {
    const actualHash = destinationHash(entry);
    if (actualHash !== null && actualHash !== entry.sha256) {
      throw new Error('Managed DLC copy was modified; preserving local contents: ' + entry.destinationPath);
    }
  }
  const next = new Map();
  const copies = [];
  const removals = [];
  const missingSources = [];
  const lfsPointers = [];
  let unchanged = 0;
  for (const entry of entries) {
    const existingHash = destinationHash(entry);
    const prior = previous.get(entry.destinationPath);
    const sourceStat = inspectPath(root, entry.sourcePath);
    const source = sourceStat ? hashFile(resolve(root, entry.sourcePath)) : null;
    if (!source || source.lfsPointer) {
      (source ? lfsPointers : missingSources).push(entry.sourcePath);
      if (existingHash !== null && !prior) {
        throw new Error('DLC destination collision: cannot verify an existing unowned file without a hydrated source: ' + entry.destinationPath);
      }
      if (prior) next.set(entry.destinationPath, prior);
      continue;
    }
    if (!prior && existingHash !== null && existingHash !== source.sha256) {
      throw new Error('DLC destination collision; preserving an existing different file: ' + entry.destinationPath);
    }
    const record = { ...entry, sha256: source.sha256 };
    next.set(entry.destinationPath, record);
    if (existingHash === source.sha256) unchanged += 1;
    else copies.push(record);
  }
  const currentDestinations = new Set(entries.map(entry => entry.destinationPath));
  for (const entry of previous.values()) {
    if (!currentDestinations.has(entry.destinationPath) && destinationHash(entry) !== null) removals.push(entry);
  }
  if (!availableOnly && (missingSources.length || lfsPointers.length)) {
    const detail = [
      missingSources.length ? 'Missing DLC sources (' + missingSources.length + '): ' + missingSources.slice(0, 5).join(', ') : '',
      lfsPointers.length ? 'Unhydrated Git LFS pointers (' + lfsPointers.length + '): ' + lfsPointers.slice(0, 5).join(', ') : ''
    ].filter(Boolean).join('\n');
    const error = new Error('DLC publication requires every source before build/dev.\n' + detail);
    Object.assign(error, { missingSources, lfsPointers });
    throw error;
  }

  const stateEntries = [...next.values()].sort(compareEntries)
    .map(({ sourcePath, publicPath, sha256 }) => ({ sourcePath, publicPath, sha256 }));
  const content = JSON.stringify({ schemaVersion: 1, files: stateEntries }, null, 2) + '\n';
  const writeState = (previousState.content !== null || stateEntries.length > 0) && content !== previousState.content;
  // All known missing-source, ownership, collision and symlink failures precede mutations.
  for (const entry of copies) publishCopy(root, entry, snapshots.get(entry.destinationPath));
  for (const entry of removals) {
    assertDestinationUnchanged(root, entry, entry.sha256);
    unlinkSync(resolve(root, entry.destinationPath));
  }
  if (writeState) {
    makeParentDirectory(root, STATE_PATH);
    inspectPath(root, STATE_PATH);
    const statePath = resolve(root, STATE_PATH);
    const temporary = resolve(dirname(statePath), '.dlc-publication-state-' + randomUUID() + '.tmp');
    try {
      writeFileSync(temporary, content, { flag: 'wx' });
      renameSync(temporary, statePath);
    } finally { rmSync(temporary, { force: true }); }
  }
  return {
    complete: missingSources.length === 0 && lfsPointers.length === 0,
    availableOnly,
    total: entries.length,
    published: entries.length - missingSources.length - lfsPointers.length,
    copied: copies.length,
    unchanged,
    removed: removals.length,
    missingSources,
    lfsPointers
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== '--available')) {
    throw new Error('Usage: node scripts/prepareDlcAssets.mjs [--available]');
  }
  const result = prepareDlcAssets({ availableOnly: args[0] === '--available' });
  const status = result.complete ? 'DLC asset publication complete' : 'Partial DLC asset publication (--available)';
  process.stdout.write(status + ': ' + result.published + '/' + result.total + ' ready, '
    + result.copied + ' copied, ' + result.unchanged + ' unchanged, ' + result.removed + ' removed.\n');
  if (!result.complete) {
    process.stdout.write('This is not a complete build/deploy asset set. Missing: ' + result.missingSources.length
      + '; unhydrated LFS pointers: ' + result.lfsPointers.length + '.\n');
    for (const [label, paths] of [['Missing', result.missingSources], ['LFS pointer', result.lfsPointers]]) {
      for (const path of paths.slice(0, 5)) process.stdout.write('- ' + label + ': ' + path + '\n');
      if (paths.length > 5) process.stdout.write('- ... ' + (paths.length - 5) + ' more ' + label.toLowerCase() + ' source(s).\n');
    }
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); }
  catch (error) {
    process.stderr.write('DLC asset publication failed: ' + error.message + '\n');
    process.exitCode = 1;
  }
}
