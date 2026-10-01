import { execFileSync } from 'node:child_process';
import { closeSync, existsSync, lstatSync, openSync, readSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const LFS_HEADER_PATTERN = /^version https:\/\/git-lfs\.github\.com\/spec\/v1\r?(?:\n|$)/;

/** Inspect the header, without reading large image, audio or video files in full. */
export function isGitLfsPointer(header) {
  const text = Buffer.isBuffer(header) ? header.toString('utf8') : header;
  return typeof text === 'string' && LFS_HEADER_PATTERN.test(text.replace(/^\uFEFF/, ''));
}

function validatePublicPaths(paths) {
  if (!Array.isArray(paths) || !paths.length) {
    throw new Error('Expected a non-empty list of public files; restore the public/ directory before building.');
  }
  const unique = new Set();
  for (const path of paths) {
    if (typeof path !== 'string' || !path.startsWith('public/') || /[\\:]/.test(path)
      || Array.from(path).some(character => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)
      || path.split('/').some(segment => !segment || segment === '.' || segment === '..')) {
      throw new Error(`Expected a canonical relative path under public/ without traversal: ${JSON.stringify(path)}`);
    }
    if (unique.has(path)) throw new Error(`Duplicate public path: ${JSON.stringify(path)}`);
    unique.add(path);
  }
}

export function listGitTrackedPublicPaths(root = process.cwd()) {
  return execFileSync('git', ['ls-files', '-z', '--', 'public'], {
    cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']
  }).split('\0').filter(Boolean);
}

/** Vercel direct uploads omit .git. This scan verifies contents, not Git coverage. */
export function listPublicTreePaths(root = process.cwd()) {
  const publicDirectory = resolve(root, 'public');
  const publicStat = lstatSync(publicDirectory);
  if (publicStat.isSymbolicLink() || !publicStat.isDirectory()) {
    throw new Error('public/ must be a real directory, not a symlink or junction.');
  }
  const paths = [];
  const walk = directory => {
    for (const entry of readdirSync(resolve(root, directory), { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else paths.push(path); // Symlinks are audited, never followed during traversal.
    }
  };
  walk('public');
  return paths.sort();
}

const formatPaths = (label, paths) => paths.length ? [
  `${label} (${paths.length}):`,
  ...paths.slice(0, 20).map(path => `- ${path}`),
  ...(paths.length > 20 ? [`- ... ${paths.length - 20} more file(s)`] : [])
] : [];

/** Verify materialized local files; injected paths make filesystem checks testable. */
export function auditLocalPublicAssets({ root = process.cwd(), trackedPublicPaths = listGitTrackedPublicPaths(root) } = {}) {
  validatePublicPaths(trackedPublicPaths);
  const missingPaths = [];
  const lfsPointerPaths = [];
  const symlinkPaths = [];
  const nonFilePaths = [];
  const statCache = new Map();
  const statFor = path => {
    if (!statCache.has(path)) {
      try { statCache.set(path, lstatSync(resolve(root, path))); }
      catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') {
          throw new Error(`Cannot inspect ${path}: ${error.message}`, { cause: error });
        }
        statCache.set(path, null);
      }
    }
    return statCache.get(path);
  };
  for (const path of trackedPublicPaths) {
    const segments = path.split('/');
    let invalid = false;
    for (let index = 0; index < segments.length; index += 1) {
      const stat = statFor(segments.slice(0, index + 1).join('/'));
      if (!stat) { missingPaths.push(path); invalid = true; break; }
      if (stat.isSymbolicLink()) { symlinkPaths.push(path); invalid = true; break; }
      if (index === segments.length - 1 ? !stat.isFile() : !stat.isDirectory()) {
        nonFilePaths.push(path); invalid = true; break;
      }
    }
    if (invalid) continue;
    const header = Buffer.alloc(256);
    const fd = openSync(resolve(root, path), 'r');
    try {
      const length = readSync(fd, header, 0, header.length, 0);
      if (isGitLfsPointer(header.subarray(0, length))) lfsPointerPaths.push(path);
    } finally { closeSync(fd); }
  }
  if (missingPaths.length || lfsPointerPaths.length || symlinkPaths.length || nonFilePaths.length) {
    const error = new Error([
      'Local public assets are not ready for build or upload.',
      ...formatPaths('Missing public files', missingPaths.sort()),
      ...formatPaths('Unresolved Git LFS pointers', lfsPointerPaths.sort()),
      ...formatPaths('Paths containing a symlink/junction', symlinkPaths.sort()),
      ...formatPaths('Paths that are not regular files/directories', nonFilePaths.sort()),
      'Restore actual assets from Git LFS or an existing complete local copy. Do not upload pointer text as images.',
      'If Git LFS is blocked by quota, use a verified materialized copy for direct upload; this audit changes no quota or billing.'
    ].join('\n'));
    error.code = 'INVALID_LOCAL_PUBLIC_ASSETS';
    Object.assign(error, { missingPaths, lfsPointerPaths, symlinkPaths, nonFilePaths });
    throw error;
  }
  return { publicFileCount: trackedPublicPaths.length };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 1 || args[0] !== '--build')) {
    throw new Error('Usage: node scripts/auditLocalPublicAssets.mjs [--build]');
  }
  const root = process.cwd();
  const treeOnly = args[0] === '--build' && !existsSync(resolve(root, '.git'));
  const paths = treeOnly ? listPublicTreePaths(root) : listGitTrackedPublicPaths(root);
  const result = auditLocalPublicAssets({ root, trackedPublicPaths: paths });
  process.stdout.write(`Local public assets audit passed: ${result.publicFileCount} ${treeOnly ? 'public-tree' : 'Git-tracked public'} regular files, no LFS pointers.\n`);
  if (treeOnly) {
    process.stdout.write('Git metadata is absent: upload coverage must be checked locally before deployment with auditVercelUploadManifest.mjs.\n');
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); }
  catch (error) {
    process.stderr.write(`Local public assets audit failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
