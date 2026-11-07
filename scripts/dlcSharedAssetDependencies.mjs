import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { extractStaticPublicAssetPaths } from './dlcCommonUiAssets.mjs';
import { inspectDistributionPath, listDistributionFiles, readDistributionFile } from './dlcDistributionFilesystem.mjs';

export const DLC_SHARED_DEPENDENCIES = 'DLC/shared-asset-dependencies.json';
export const REVIEWED_SHARED_POLICY = 'reviewed-dependencies';
const SCRIPT = /\.(?:[cm]?js|jsx|tsx?)$/;
const DATA = /\.(?:[cm]?js|jsx|tsx?|json|css)$/;
const require = createRequire(import.meta.url);
let parseSync;
const hash = value => createHash('sha256').update(value).digest('hex');
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const plainObject = value => value && typeof value === 'object' && !Array.isArray(value);

function visit(node, callback) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.type === 'string') callback(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => visit(child, callback));
    else if (value && typeof value === 'object') visit(value, callback);
  }
}
function parse(sourcePath, source) {
  // Asset preparation also imports this module before npm ci. The historical
  // preserve-all path must remain dependency-free; only reviewed pruning parses.
  parseSync ??= require('rolldown/utils').parseSync;
  const lang = sourcePath.endsWith('.tsx') ? 'tsx' : sourcePath.endsWith('.ts') ? 'ts' : sourcePath.endsWith('.jsx') ? 'jsx' : 'js';
  const result = parseSync(sourcePath, source, { lang });
  if (result.errors.length) throw new Error('Invalid shared dependency source: ' + sourcePath);
  return result.program;
}
function stringValue(node) {
  if (node?.type === 'ParenthesizedExpression') return stringValue(node.expression);
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis[0].value.cooked;
  if (node?.type === 'BinaryExpression' && node.operator === '+') {
    const left = stringValue(node.left), right = stringValue(node.right);
    if (left !== null && right !== null) return left + right;
  }
  return null;
}
const propertyName = node => node && !node.computed ? node.key?.name ?? stringValue(node.key) : null;
function declaration(program, name) {
  for (const item of program.body) {
    const node = item.type === 'ExportNamedDeclaration' ? item.declaration : item;
    if (node?.type === 'FunctionDeclaration' && node.id?.name === name) return node;
    if (node?.type === 'VariableDeclaration') {
      const found = node.declarations.find(entry => entry.id?.name === name);
      if (found) return found;
    }
  }
  throw new Error('Missing reviewed backdrop declaration: ' + name);
}
const cleanAst = node => JSON.stringify(node, (key, value) =>
  ['start', 'end', 'loc', 'range', 'raw', 'comments', 'leadingComments', 'trailingComments', 'extra'].includes(key) ? undefined : value);

// These are reviewed producers of backdrop URLs. A changed algorithm requires
// reviewing its reachable URLs before changing the recorded fingerprint.
const REVIEWED_RESOLVERS = {
  getter: '629b6aa14a80aa1873381c94c30caeed86a4b0f57917faa1601b91802382f91d',
  extension: 'f2709923afea57c612c7b68180aa60b23b911342b6b637d5ca698428a911707c',
  loreBuilder: '8c11760857ab00eb77cc013c4a23b5aa5914d77bb30064621ba288c42026b679',
  generatedModule: 'bef4698beb0d0aca6f681328dc3c46fd3361a2ebda9df8c7ff30657ba2bef05e',
};

/** Explicit opt-in declarations. Unknown shared assets are always retained. */
export function readDlcSharedDependencies({ root, required = false } = {}) {
  if (!inspectDistributionPath(root, DLC_SHARED_DEPENDENCIES, { optional: true })) {
    if (required) throw new Error('Reviewed shared policy requires ' + DLC_SHARED_DEPENDENCIES);
    return null;
  }
  const data = JSON.parse(readDistributionFile(root, DLC_SHARED_DEPENDENCIES));
  if (!plainObject(data) || data.schemaVersion !== 1 || !Array.isArray(data.assets)
    || Object.keys(data).some(key => !['schemaVersion', 'assets'].includes(key))) {
    throw new Error('Invalid shared dependency manifest');
  }
  let previous = '';
  for (const asset of data.assets) {
    if (!plainObject(asset) || Object.keys(asset).sort().join('|') !== 'family|packIds|publicPath'
      || asset.family !== 'openai-backdrop' || typeof asset.publicPath !== 'string'
      || !/^\/backgrounds\/[a-z0-9-]+-openai\.png$/.test(asset.publicPath)
      || asset.publicPath <= previous || !Array.isArray(asset.packIds) || !asset.packIds.length
      || asset.packIds.some(id => typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id))
      || !same(asset.packIds, [...new Set(asset.packIds)].sort(compare))) {
      throw new Error('Invalid or duplicate reviewed shared dependency: ' + JSON.stringify(asset?.publicPath));
    }
    previous = asset.publicPath;
  }
  return data;
}

export function selectDlcSharedAssets({ assets, selection, dependencies }) {
  if (selection.sharedPolicy !== REVIEWED_SHARED_POLICY) return { retained: assets, excluded: [] };
  if (!dependencies) throw new Error('Missing reviewed shared dependency manifest');
  const installed = new Set(selection.packIds);
  const optional = new Map(dependencies.assets.map(asset => [asset.publicPath, asset]));
  const retained = [], excluded = [];
  for (const asset of assets) {
    const requirement = optional.get(asset.publicPath);
    // All means all installed catalogue entries, not all metadata declarations:
    // an unknown dependency must first fail the source closure check.
    (requirement && !requirement.packIds.some(id => installed.has(id)) ? excluded : retained).push(asset);
  }
  return { retained, excluded };
}

/**
 * Prove the reviewed OpenAI backdrop family against current, possibly transformed
 * sources: finite registry factories, their consumers, generated registries and
 * the only dynamic /backgrounds/ constructor. This is not a general asset pruner.
 */
export function assertDlcSharedDependencyClosure({ root, manifests, sharedAssets, dependencies }) {
  if (!dependencies) throw new Error('Missing reviewed shared dependency manifest');
  const optional = new Map(dependencies.assets.map(asset => [asset.publicPath, asset]));
  const shared = new Set(sharedAssets.map(asset => asset.publicPath));
  for (const asset of dependencies.assets) if (!shared.has(asset.publicPath)) {
    throw new Error('Reviewed dependency is not a shared canonical asset: ' + asset.publicPath);
  }
  const byModule = new Map(manifests.flatMap(pack => pack.modules.map(module =>
    [pack.directory + '/' + module.path, { pack, module }])));
  const present = new Set(manifests.map(pack => pack.id));
  const sources = new Map(), programs = new Map();
  const sourceOf = file => {
    if (!sources.has(file)) sources.set(file, readDistributionFile(root, file).toString('utf8'));
    return sources.get(file);
  };
  const programOf = file => {
    if (!programs.has(file)) programs.set(file, parse(file, sourceOf(file)));
    return programs.get(file);
  };
  const catalogSource = sourceOf('DLC/index.js');
  const catalogProgram = programOf('DLC/index.js');
  let catalogNode;
  try { catalogNode = declaration(catalogProgram, 'manifests'); }
  catch { catalogNode = declaration(catalogProgram, 'DLC_PACK_MANIFESTS'); }
  if (catalogNode.init?.type !== 'ArrayExpression') throw new Error('Shared dependency review requires complete static DLC identities');
  const catalog = JSON.parse(catalogSource.slice(catalogNode.init.start, catalogNode.init.end));
  const catalogIds = new Set(catalog.map(pack => pack.id));
  for (const asset of dependencies.assets) {
    if (asset.packIds.some(id => !catalogIds.has(id))) throw new Error('Unknown pack in shared dependency manifest: ' + asset.publicPath);
  }
  const rendererPath = 'src/game/renderer.js';
  const renderer = programOf(rendererPath);
  const registry = declaration(renderer, 'OPENAI_BACKDROPS');
  const getter = declaration(renderer, 'getOpenAiBackdropSrc');
  const extensions = renderer.body.filter(node => node.type === 'ExpressionStatement'
    && sourceOf(rendererPath).slice(node.start, node.end).startsWith('Object.entries(FEATURED_BACKDROPS)'));
  if (extensions.length !== 1) throw new Error('Reviewed backdrop registry extension changed');
  const loreBuilder = declaration(programOf('src/game/stageLoreProfiles.js'), 'buildModes');
  const generatedSource = sourceOf('src/game/generatedStageAssets.js');
  const observedResolvers = { getter: hash(cleanAst(getter)), extension: hash(cleanAst(extensions[0])),
    loreBuilder: hash(cleanAst(loreBuilder)), generatedModule: hash(generatedSource) };
  if (!same(observedResolvers, REVIEWED_RESOLVERS)) {
    throw new Error('Reviewed backdrop resolver changed; review dynamic URL closure before exporting: ' + JSON.stringify(observedResolvers));
  }
  const registryRegions = [registry, getter, extensions[0]];
  visit(renderer, node => {
    if (node.type === 'Identifier' && node.name === 'OPENAI_BACKDROPS'
      && !registryRegions.some(region => region.start <= node.start && region.end >= node.end)) {
      throw new Error('Unreviewed access to OPENAI_BACKDROPS');
    }
  });
  const imports = new Map(renderer.body.filter(node => node.type === 'ImportDeclaration').flatMap(node =>
    node.specifiers.filter(specifier => specifier.type === 'ImportNamespaceSpecifier').map(specifier =>
      [specifier.local.name, path.posix.normalize(path.posix.join('src/game', node.source.value))])));
  const consumers = new Map([...optional.keys()].map(url => [url, []]));
  const allowedLiterals = new Map();
  if (registry.init?.type !== 'ObjectExpression') throw new Error('Backdrop registry must remain a finite object');
  for (const modeProperty of registry.init.properties) {
    const mode = propertyName(modeProperty);
    if (!['RPG', 'Tactics', 'Smash'].includes(mode) || modeProperty.value?.type !== 'ObjectExpression') {
      throw new Error('Unsupported backdrop mode registry');
    }
    for (const property of modeProperty.value.properties) {
      const universe = propertyName(property);
      const value = property.value;
      const direct = stringValue(value);
      if (direct !== null) {
        if (optional.has(direct)) throw new Error('Common renderer owns a reviewed optional asset: ' + direct);
        continue;
      }
      const sourcePath = imports.get(value?.callee?.object?.name);
      const owner = byModule.get(sourcePath);
      const functionName = value?.callee?.property?.name;
      if (!universe || value?.type !== 'CallExpression' || value.arguments.length
        || value.callee?.type !== 'MemberExpression' || value.callee.computed
        || !owner || owner.module.runtimeAdapter !== rendererPath || owner.pack.universe !== universe
        || functionName !== 'createOpenaiBackdrops' + (mode === 'RPG' ? 'Rpg' : mode)) {
        throw new Error('Unreviewed backdrop registry contribution: ' + universe);
      }
      const factory = declaration(programOf(sourcePath), functionName);
      const body = factory.body?.body;
      if (factory.params.length || body?.length !== 1 || body[0].type !== 'ReturnStatement'
        || stringValue(body[0].argument) === null) throw new Error('Backdrop factory is no longer static: ' + sourcePath);
      const publicPath = stringValue(body[0].argument);
      if (optional.has(publicPath)) {
        consumers.get(publicPath).push({ packId: owner.pack.id, universe, mode, sourcePath, functionName });
        const entries = allowedLiterals.get(sourcePath) || [];
        entries.push(body[0].argument);
        allowedLiterals.set(sourcePath, entries);
      }
    }
  }
  for (const asset of dependencies.assets) {
    const expected = asset.packIds.filter(id => present.has(id));
    const observed = [...new Set(consumers.get(asset.publicPath).map(entry => entry.packId))].sort(compare);
    if (!same(observed, expected)) throw new Error('Shared backdrop consumers differ from reviewed manifest: ' + asset.publicPath);
  }

  const files = new Set([
    ...listDistributionFiles({ root, relative: 'src' }).filter(file => DATA.test(file)),
    ...listDistributionFiles({ root, relative: 'public' }).filter(file => DATA.test(file)),
    ...byModule.keys(),
  ]);
  // Include data imported from outside src (for example an attested docs JSON),
  // without mistaking every editorial/audit JSON for a runtime dependency.
  for (const file of files) {
    if (!DATA.test(file)) continue;
    const source = sourceOf(file);
    if (SCRIPT.test(file)) {
      const program = programOf(file);
      for (const item of program.body) {
        if (item.type === 'ImportDeclaration' && item.source?.value?.endsWith('.json') && item.source.value.startsWith('.')) {
          const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(file), item.source.value));
          if (!dependency.startsWith('DLC/')) files.add(dependency);
        }
      }
      visit(program, node => {
        const value = stringValue(node);
        if (value === 'OPENAI_BACKDROPS' && file !== rendererPath) {
          throw new Error('Unreviewed external backdrop registry access: ' + file);
        }
        if (value !== null && (value.includes('/backgrounds/') || value.includes('%'))) {
          const urls = extractStaticPublicAssetPaths({ sourcePath: 'value.json', source: JSON.stringify(value) });
          for (const url of urls) if (optional.has(url)
            && !(allowedLiterals.get(file) || []).some(region => region.start <= node.start && region.end >= node.end)) {
            throw new Error('Unreviewed shared backdrop consumer: ' + file + ' -> ' + url);
          }
        }
        if (value !== null && /^\/backgrounds(?:\/|$)/.test(value)
          && !/^\/backgrounds\/[^?#]+\.[a-z0-9]+(?:[?#].*)?$/i.test(value)
          && !(file === 'src/game/stageLoreProfiles.js' && loreBuilder.start <= node.start && loreBuilder.end >= node.end)) {
          throw new Error('Unreviewed dynamic backdrop URL: ' + file);
        }
        if (node.type === 'TemplateLiteral' && node.expressions.length
          && node.quasis.some(part => part.value.cooked?.includes('/backgrounds/'))
          && !(file === 'src/game/stageLoreProfiles.js' && loreBuilder.start <= node.start && loreBuilder.end >= node.end)) {
          throw new Error('Unreviewed dynamic backdrop URL: ' + file);
        }
        if (node.type === 'BinaryExpression' && node.operator === '+' && value === null
          && [stringValue(node.left), stringValue(node.right)].some(part => part?.includes('/backgrounds/'))) {
          throw new Error('Unreviewed dynamic backdrop URL: ' + file);
        }
        if (node.type === 'Identifier' && node.name === 'OPENAI_BACKDROPS' && file !== rendererPath) {
          throw new Error('Unreviewed external backdrop registry access: ' + file);
        }
      });
    } else {
      for (const url of extractStaticPublicAssetPaths({ sourcePath: file, source })) if (optional.has(url)) {
        throw new Error('Unreviewed shared backdrop data or style consumer: ' + file + ' -> ' + url);
      }
    }
  }
  const sourceInventorySha256 = hash(JSON.stringify([...sources].sort(([a], [b]) => compare(a, b))
    .map(([sourcePath, source]) => ({ sourcePath, sha256: hash(source) }))));
  return { family: 'openai-backdrop', sourceFiles: sources.size, sourceInventorySha256, resolvers: observedResolvers,
    assets: dependencies.assets.map(asset => ({ ...asset, consumers: consumers.get(asset.publicPath) })) };
}
