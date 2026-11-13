import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseSync } from 'rolldown/utils';
import { auditDlcDistributionFiles } from './dlcDistribution.mjs';
import {
  assertDistributionDirectory, inspectDistributionPath, listDistributionFiles, readDistributionFile, slash,
} from './dlcDistributionFilesystem.mjs';

export const DLC_DISTRIBUTION_RECEIPT = 'DLC/distribution-receipt.json';
const GENERATED_ROOTS = new Set(['node_modules', '.git', 'dist']);
const SCRIPT_EXTENSION = /\.(?:[cm]?js|jsx|tsx?)$/;
const MODULE_EXTENSIONS = ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json'];
const COMMON_DLC_FILES = new Set(['DLC/index.js', 'DLC/content-identities.json', 'DLC/distribution.json', 'DLC/shared-assets.json']);
const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const canonical = (value) => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort(compare).map((key) => [key, item[key]])) : item);
const staticString = (node) => node?.type === 'Literal' && typeof node.value === 'string' ? node.value
  : node?.type === 'TemplateLiteral' && node.expressions.length === 0 ? node.quasis.map((part) => part.value.cooked).join('') : null;

function visit(root, callback) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object') continue;
    if (typeof node.type === 'string') callback(node);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) stack.push(...value);
      else if (value && typeof value === 'object') stack.push(value);
    }
  }
}

function resolveStaticImport(root, file, specifier, installedDirectories) {
  if (!specifier.startsWith('.') && !specifier.startsWith('/')) return null;
  let decoded;
  try { decoded = decodeURIComponent(specifier.split(/[?#]/, 1)[0]); }
  catch { throw new Error('Malformed runtime import in ' + file + ': ' + specifier); }
  if (!decoded || decoded.includes('\\') || decoded.includes(String.fromCharCode(0))) throw new Error('Unsafe runtime import in ' + file + ': ' + specifier);
  const target = decoded.startsWith('/') ? path.resolve(root, '.' + decoded) : path.resolve(root, path.dirname(file), decoded);
  const relative = slash(path.relative(root, target));
  if (!relative || relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) {
    throw new Error('Runtime import escapes the distribution: ' + file + ' -> ' + specifier);
  }
  if (relative.startsWith('DLC/') && !COMMON_DLC_FILES.has(relative)) {
    const directory = relative.split('/').slice(0, 2).join('/');
    if (!installedDirectories.has(directory)) throw new Error('Runtime import references an excluded DLC: ' + file + ' -> ' + specifier);
  }
  const candidates = [relative, ...MODULE_EXTENSIONS.map((extension) => relative + extension),
    ...MODULE_EXTENSIONS.map((extension) => relative + '/index' + extension)];
  for (const candidate of candidates) {
    try {
      const resolved = inspectDistributionPath(root, candidate, { optional: true });
      if (resolved) return candidate;
    } catch (error) {
      // An extensionless import may resolve to a directory with index.js.
      // A real symlink or non-directory ancestor must still fail immediately.
      if (!error.message.startsWith('Unexpected distribution file type: ' + candidate)) throw error;
    }
  }
  throw new Error('Missing static runtime import: ' + file + ' -> ' + specifier);
}

function auditRuntimeImports(root, files, receipt) {
  const installedDirectories = new Set(receipt.packs.map((pack) => pack.directory));
  const runtimeFiles = files.filter((file) => SCRIPT_EXTENSION.test(file)
    && (file.startsWith('src/') || file === 'DLC/index.js'
      || [...installedDirectories].some((directory) => file.startsWith(directory + '/'))));
  let importCount = 0;
  for (const file of runtimeFiles) {
    const source = readDistributionFile(root, file).toString('utf8');
    const lang = file.endsWith('.tsx') ? 'tsx' : file.endsWith('.ts') ? 'ts' : file.endsWith('.jsx') ? 'jsx' : 'js';
    const parsed = parseSync(file, source, { lang });
    if (parsed.errors.length) throw new Error('Invalid runtime source ' + file + ': ' + parsed.errors.map((error) => error.message).join('; '));
    const check = (node, dynamic = false) => {
      const specifier = staticString(node);
      if (specifier === null) {
        if (dynamic) throw new Error('Runtime import must use an explicit static path: ' + file);
        throw new Error('Invalid static runtime import: ' + file);
      }
      importCount += 1;
      resolveStaticImport(root, file, specifier, installedDirectories);
    };
    visit(parsed.program, (node) => {
      if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) check(node.source);
      if (node.type === 'ImportExpression') check(node.source, true);
      if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'require') check(node.arguments[0], true);
      if (node.type === 'CallExpression' && node.callee?.type === 'MemberExpression'
        && node.callee.object?.type === 'MetaProperty' && node.callee.object.meta?.name === 'import'
        && ['glob', 'globEager'].includes(node.callee.property?.name)) {
        throw new Error('Runtime import glob needs an explicit distribution contract: ' + file);
      }
      if (node.type === 'NewExpression' && node.callee?.name === 'URL' && node.arguments[1]?.type === 'MemberExpression'
        && node.arguments[1].object?.type === 'MetaProperty' && node.arguments[1].object.meta?.name === 'import'
        && node.arguments[1].property?.name === 'url') check(node.arguments[0], true);
    });
  }
  return { runtimeFileCount: runtimeFiles.length, importCount };
}

/** Audit every delivered source file and every materialized media file before build. */
export function auditDlcDistribution({ root = process.cwd() } = {}) {
  root = assertDistributionDirectory(root);
  const receipt = JSON.parse(readDistributionFile(root, DLC_DISTRIBUTION_RECEIPT).toString('utf8'));
  const media = auditDlcDistributionFiles({ root, receipt, layout: 'both', exact: true });
  const expected = new Set([DLC_DISTRIBUTION_RECEIPT,
    ...receipt.files.map((file) => file.path), ...receipt.assets.flatMap((asset) => [asset.sourcePath, asset.destinationPath])]);
  for (const required of COMMON_DLC_FILES) {
    if (!receipt.files.some((file) => file.path === required)) throw new Error('Distribution is missing common source attestation: ' + required);
  }
  const files = listDistributionFiles({ root, ignore: (file) => !file.includes('/') && GENERATED_ROOTS.has(file) });
  const extraPaths = files.filter((file) => !expected.has(file));
  const present = new Set(files);
  const missingPaths = [...expected].filter((file) => !present.has(file));
  if (extraPaths.length || missingPaths.length) {
    const error = new Error('Distribution source closure failed: ' + [
      extraPaths.length ? 'extra ' + extraPaths.slice(0, 8).join(', ') : '',
      missingPaths.length ? 'missing ' + missingPaths.slice(0, 8).join(', ') : '',
    ].filter(Boolean).join('; '));
    Object.assign(error, { code: 'INVALID_DLC_SOURCE_CLOSURE', extraPaths, missingPaths });
    throw error;
  }
  const profile = JSON.parse(readDistributionFile(root, 'DLC/distribution.json').toString('utf8'));
  if (canonical(profile) !== canonical(receipt.profile)) throw new Error('Distribution profile does not match its receipt.');
  const imports = auditRuntimeImports(root, files, receipt);
  return { receipt, ...media, sourceFileCount: receipt.files.length, deliveredFileCount: files.length, ...imports };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--root' || !args[1])) throw new Error('Usage: node scripts/auditDlcDistribution.mjs [--root EXPORT]');
    const { receipt, ...summary } = auditDlcDistribution({ root: args[1] ?? process.cwd() });
    console.log(JSON.stringify({ ...summary, profile: receipt.profile }));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
