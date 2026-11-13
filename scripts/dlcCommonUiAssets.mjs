import { createRequire } from 'node:module';
import { assertDistributionDirectory, listDistributionFiles, readDistributionFile } from './dlcDistributionFilesystem.mjs';

const SCRIPT = /\.(?:[cm]?js|jsx|ts|tsx)$/;
const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const require = createRequire(import.meta.url);
let parseSync;

function visit(node, callback) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.type === 'string') callback(node);
  for (const [key, value] of Object.entries(node)) {
    if (key === 'parent') continue;
    if (Array.isArray(value)) value.forEach(child => visit(child, callback));
    else if (value && typeof value === 'object') visit(value, callback);
  }
}

function publicPaths(value, sourcePath) {
  const paths = new Set();
  const literal = value.trim();
  const candidates = [];
  // A complete string literal or quoted CSS URL can contain spaces. Keep its
  // filename together instead of mistaking a dotted prefix for a second file.
  if (/^\/(?!\/)/.test(literal) && !/\s+\//.test(literal)
    && !/\s+\d+(?:\.\d+)?[wx](?:\s*,|\s*$)/.test(literal)) candidates.push(literal);
  else {
    // URL lists such as srcSet retain their individual unquoted candidates.
    // The left boundary keeps an external URL's /images/... suffix out.
    for (const match of value.matchAll(/"(\/(?!\/)[^"\r\n]+)"|'(\/(?!\/)[^'\r\n]+)'|(?:^|[\s(=])(\/(?!\/)[^\s"'`()<>]+)(?=$|[\s"'`()<>])/g)) {
      candidates.push(match[1] ?? match[2] ?? match[3]);
    }
  }
  for (const candidate of candidates) {
    const raw = candidate.split(/[?#]/, 1)[0];
    if (raw.includes('${')) continue;
    let path;
    try { path = decodeURIComponent(raw); } catch {
      if (/\/[^/]+\.[a-z0-9]+$/i.test(raw)) throw new Error('Invalid common UI asset URL in ' + sourcePath + ': ' + raw);
      continue;
    }
    // Match after decoding: %2e and encoded extension letters still name the
    // same file and must not bypass the distribution inventory guard.
    if (!/\/[^/]+\.[a-z0-9]+$/i.test(path)) continue;
    if (/[\\:%?#]/.test(path) || [...path].some(character => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)
      || path.slice(1).split('/').some(part => !part || part === '.' || part === '..')) {
      throw new Error('Unsafe common UI asset URL in ' + sourcePath + ': ' + raw);
    }
    paths.add(path);
  }
  return paths;
}

/** Literal observations only; even a returned URL is not proof of reachability. */
export function extractStaticPublicAssetPaths({ sourcePath, source }) {
  const values = [];
  if (sourcePath.endsWith('.css')) values.push(source.replace(/\/\*[\s\S]*?\*\//g, ''));
  else if (sourcePath.endsWith('.json')) {
    const strings = value => {
      if (typeof value === 'string') values.push(value);
      else if (Array.isArray(value)) value.forEach(strings);
      else if (value && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) { values.push(key); strings(item); }
      }
    };
    strings(JSON.parse(source));
  } else {
    // The legacy asset publisher runs before npm ci in sparse CI checkouts.
    // Keep its import graph dependency-free; profile/UI audits still require
    // the real parser when they inspect JavaScript (Node 22 supports require ESM).
    parseSync ??= require('rolldown/utils').parseSync;
    const lang = sourcePath.endsWith('.tsx') ? 'tsx' : sourcePath.endsWith('.ts') ? 'ts' : sourcePath.endsWith('.jsx') ? 'jsx' : 'js';
    const parsed = parseSync(sourcePath, source, { lang });
    if (parsed.errors.length) throw new Error('Invalid common UI source ' + sourcePath + ': ' + parsed.errors.map(error => error.message).join('; '));
    visit(parsed.program, node => {
      if (node.type === 'Literal' && typeof node.value === 'string') values.push(node.value);
      if (node.type === 'TemplateLiteral' && node.expressions.length === 0 && node.quasis[0].value.cooked !== null) values.push(node.quasis[0].value.cooked);
    });
  }
  return [...new Set(values.flatMap(value => [...publicPaths(value, sourcePath)]))].sort(compare);
}

/**
 * Proven static public-file references in common UI source, without executing it.
 * This intentionally is not a dynamic dependency closure: partial templates,
 * registry lookups and game/engine consumers still require separate evidence.
 */
export function collectCommonUiAssetReferences({ root = process.cwd() } = {}) {
  const absolute = assertDistributionDirectory(root);
  const files = listDistributionFiles({
    root: absolute, relative: 'src',
    ignore: (file, entry) => entry.isDirectory() && file !== 'src/components' && !file.startsWith('src/components/'),
  }).filter(file => (file.startsWith('src/components/') && (SCRIPT.test(file) || file.endsWith('.css')))
    || /^src\/App\.(?:[cm]?js|jsx|ts|tsx)$/.test(file) || /^src\/[^/]+\.css$/.test(file));
  const references = [];
  for (const sourcePath of files) {
    const source = readDistributionFile(absolute, sourcePath).toString('utf8');
    for (const publicPath of extractStaticPublicAssetPaths({ sourcePath, source })) references.push({ publicPath, sourcePath });
  }
  return references.sort((a, b) => compare(a.publicPath, b.publicPath) || compare(a.sourcePath, b.sourcePath));
}
