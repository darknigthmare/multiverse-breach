import { createRequire } from 'node:module';
import { assertDistributionDirectory, inspectDistributionPath, listDistributionFiles, readDistributionFile } from './dlcDistributionFilesystem.mjs';

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

const HTML_MEDIA_ATTRIBUTES = new Map([
  ['img', ['src', 'srcset']], ['source', ['src', 'srcset']], ['video', ['src', 'poster']],
  ['audio', ['src']], ['track', ['src']], ['object', ['data']], ['embed', ['src']],
]);
const HTML_RESOURCE_LINKS = new Set(['icon', 'apple-touch-icon', 'mask-icon', 'manifest', 'stylesheet', 'preload', 'prefetch']);
const htmlEntities = value => value.replace(/&(#(?:x[0-9a-f]+|[0-9]+)|amp|quot|apos|lt|gt);/gi, (entity, name) => {
  if (name[0] !== '#') return ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' })[name.toLowerCase()];
  const hex = name[1]?.toLowerCase() === 'x';
  const code = Number.parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
});

/** Observe media-bearing HTML attributes only, never strings inside scripts or prose. */
function htmlAssetValues(source) {
  const values = [];
  // Script/title/textarea bodies use raw text rules. A quoted <img> in those
  // bodies does not request an image and must not become a local dependency.
  let html = source.replace(/<(script|title|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi, (_tag, css) => {
    values.push(css.replace(/\/\*[\s\S]*?\*\//g, ''));
    return '';
  });
  const tags = [];
  for (const match of html.matchAll(/<([a-z][a-z0-9:-]*)\b((?:[^<>"']|"[^"]*"|'[^']*')*)>/gi)) {
    const attributes = new Map();
    for (const attribute of match[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      const name = attribute[1].toLowerCase();
      // Browsers use the first duplicate attribute, including an empty value.
      if (!attributes.has(name)) attributes.set(name, htmlEntities(attribute[2] ?? attribute[3] ?? attribute[4] ?? ''));
    }
    tags.push({ name: match[1].toLowerCase(), attributes });
  }
  // A remote base makes even /root-relative media remote. Do not infer local
  // files for that document. Relative base paths do not affect /root URLs.
  const base = tags.find(tag => tag.name === 'base' && tag.attributes.has('href'))?.attributes.get('href')?.trim();
  if (base && /^(?:https?:)?\/\//i.test(base)) return [];
  for (const { name, attributes } of tags) {
    const requested = [...(HTML_MEDIA_ATTRIBUTES.get(name) || [])];
    if (name === 'input' && attributes.get('type')?.toLowerCase() === 'image') requested.push('src');
    if (name === 'link' && (attributes.get('rel') || '').toLowerCase().split(/\s+/).some(rel => HTML_RESOURCE_LINKS.has(rel))) {
      requested.push('href', 'imagesrcset');
    }
    for (const attribute of requested) {
      const value = attributes.get(attribute);
      // Vite owns /src imports in development HTML; these are source modules,
      // not files to copy into public. Root-relative public URLs stay literal.
      if (value && !value.trim().startsWith('/src/')) values.push(value);
    }
    if (attributes.has('style')) values.push(attributes.get('style'));
  }
  return values;
}

/** Literal observations only; even a returned URL is not proof of reachability. */
export function extractStaticPublicAssetPaths({ sourcePath, source }) {
  const values = [];
  if (sourcePath.endsWith('.html')) values.push(...htmlAssetValues(source));
  else if (sourcePath.endsWith('.css')) values.push(source.replace(/\/\*[\s\S]*?\*\//g, ''));
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
  if (inspectDistributionPath(absolute, 'index.html', { optional: true })) files.push('index.html');
  const references = [];
  for (const sourcePath of files) {
    const source = readDistributionFile(absolute, sourcePath).toString('utf8');
    for (const publicPath of extractStaticPublicAssetPaths({ sourcePath, source })) references.push({ publicPath, sourcePath });
  }
  return references.sort((a, b) => compare(a.publicPath, b.publicPath) || compare(a.sourcePath, b.sourcePath));
}
