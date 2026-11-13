import path from 'node:path';
import { parseSync } from 'rolldown/utils';
import { assertDistributionDirectory, inspectDistributionPath, readDistributionFile, slash } from './dlcDistributionFilesystem.mjs';

const SCRIPT = /\.(?:[cm]?js|jsx|tsx?)$/;
const EXTENSIONS = ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json'];
const staticString = node => node?.type === 'Literal' && typeof node.value === 'string' ? node.value
  : node?.type === 'TemplateLiteral' && node.expressions.length === 0 ? node.quasis.map(part => part.value.cooked).join('') : null;
const ignored = file => file.split('/').some(part => part === '.git' || part === 'node_modules' || part === '.env' || part.startsWith('.env.'));

function visit(program, callback) {
  const pending = [program];
  while (pending.length) {
    const node = pending.pop();
    if (!node || typeof node !== 'object') continue;
    if (typeof node.type === 'string') callback(node);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) pending.push(...value);
      else if (value && typeof value === 'object') pending.push(value);
    }
  }
}

function resolveLocalImport(root, file, specifier, generatedFiles) {
  if (!specifier.startsWith('.') && !specifier.startsWith('/')) return null;
  let decoded;
  try { decoded = decodeURIComponent(specifier.split(/[?#]/, 1)[0]); }
  catch { throw new Error('Malformed runtime documentation import: ' + file + ' -> ' + specifier); }
  if (!decoded || /[\\\u0000]/.test(decoded)) throw new Error('Unsafe runtime documentation import: ' + file + ' -> ' + specifier);
  const absolute = decoded.startsWith('/') ? path.resolve(root, '.' + decoded) : path.resolve(root, path.dirname(file), decoded);
  const relative = slash(path.relative(root, absolute));
  if (!relative || relative === '..' || relative.startsWith('../') || path.isAbsolute(relative) || ignored(relative)) {
    throw new Error('Runtime documentation import leaves the allowed source tree: ' + file + ' -> ' + specifier);
  }
  // The selected profile is authored by the exporter, never copied from the
  // canonical installation. It may legitimately be absent from source.
  if (generatedFiles.has(relative)) return relative;
  const candidates = [relative, ...EXTENSIONS.map(extension => relative + extension), ...EXTENSIONS.map(extension => relative + '/index' + extension)];
  for (const candidate of candidates) {
    try {
      if (inspectDistributionPath(root, candidate, { optional: true })) return candidate;
    } catch (error) {
      // An extensionless target can be a directory with an index module.
      if (!error.message.startsWith('Unexpected distribution file type: ' + candidate)) throw error;
    }
  }
  throw new Error('Missing runtime documentation import: ' + file + ' -> ' + specifier);
}

/**
 * Keep files needed by production imports, including JSON and modules under
 * docs/. Provenance strings inside JSON are data, not executable dependencies.
 * This intentionally does not promise the historical research/audit corpus.
 */
export function collectDlcRuntimeDocumentation({ root = process.cwd(), sourceFiles, transformSource = (_file, source) => source } = {}) {
  root = assertDistributionDirectory(root);
  if (!Array.isArray(sourceFiles)) throw new Error('Runtime documentation requires an explicit source inventory.');
  const selected = new Set(sourceFiles);
  const directories = new Set(sourceFiles.filter(file => /^DLC\/[^/]+\//.test(file)).map(file => file.split('/').slice(0, 2).join('/')));
  const common = new Set(['DLC/index.js', 'DLC/content-identities.json', 'DLC/distribution.json', 'DLC/shared-assets.json']);
  const generatedFiles = new Set(['DLC/distribution.json']);
  const pending = sourceFiles.filter(file => SCRIPT.test(file) && (file.startsWith('src/') || file.startsWith('api/') || file.startsWith('DLC/') || file === 'vite.config.js'));
  const inspected = new Set();
  const added = new Set();
  while (pending.length) {
    const file = pending.pop();
    if (inspected.has(file)) continue;
    inspected.add(file);
    const source = transformSource(file, readDistributionFile(root, file).toString('utf8'));
    const parsed = parseSync(file, source, { lang: file.endsWith('.tsx') ? 'tsx' : file.endsWith('.ts') ? 'ts' : file.endsWith('.jsx') ? 'jsx' : 'js' });
    if (parsed.errors.length) throw new Error('Invalid runtime documentation source ' + file + ': ' + parsed.errors.map(error => error.message).join('; '));
    const include = (node, dynamic = false) => {
      const specifier = staticString(node);
      if (specifier === null) throw new Error((dynamic ? 'Computed runtime import has no static documentation closure: ' : 'Invalid runtime documentation import: ') + file);
      const target = resolveLocalImport(root, file, specifier, generatedFiles);
      if (!target) return;
      if (generatedFiles.has(target)) return;
      if (target.startsWith('DLC/') && !common.has(target) && !directories.has(target.split('/').slice(0, 2).join('/'))) {
        throw new Error('Runtime documentation import references an excluded DLC: ' + file + ' -> ' + specifier);
      }
      if (!selected.has(target)) added.add(target);
      if (SCRIPT.test(target)) pending.push(target);
    };
    visit(parsed.program, node => {
      if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) include(node.source);
      if (node.type === 'ImportExpression') include(node.source, true);
      if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'require') include(node.arguments[0], true);
      if (node.type === 'CallExpression' && node.callee?.type === 'MemberExpression' && node.callee.object?.type === 'MetaProperty'
        && node.callee.object.meta?.name === 'import' && ['glob', 'globEager'].includes(node.callee.property?.name)) {
        throw new Error('Runtime import glob has no static documentation closure: ' + file);
      }
      if (node.type === 'NewExpression' && node.callee?.name === 'URL' && node.arguments[1]?.type === 'MemberExpression'
        && node.arguments[1].object?.type === 'MetaProperty' && node.arguments[1].object.meta?.name === 'import' && node.arguments[1].property?.name === 'url') include(node.arguments[0], true);
    });
  }
  return { files: [...added].sort(), inspectedModules: inspected.size };
}
