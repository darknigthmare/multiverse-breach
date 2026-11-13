import { createHash } from 'node:crypto';
import { closeSync, constants, fstatSync, openSync, readFileSync, readSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { collectCommonUiAssetReferences, extractStaticPublicAssetPaths } from './dlcCommonUiAssets.mjs';
import { readDlcDistributionManifests } from './dlcDistribution.mjs';
import { assertDistributionDirectory, inspectDistributionPath, listDistributionFiles, readDistributionFile } from './dlcDistributionFilesystem.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SOURCE = /\.(?:[cm]?js|jsx|ts|tsx|css|json)$/;
const hash = value => createHash('sha256').update(value).digest('hex');
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const INDIRECT_CONSUMERS = [
  { sourcePath: 'src/game/stageLoreProfiles.js', marker: 'const basePath = `/backgrounds/lore-stages/${slug}`;', limitation: 'Universe slugs and mode filenames construct URLs; literal observations do not enumerate their combinations.' },
  { sourcePath: 'src/game/spriteAssets.js', marker: 'export const slugifyAsset =', limitation: 'Hero, universe, variant and animation inputs select or construct sprite paths.' },
  { sourcePath: 'src/game/generatedStageAssets.js', marker: 'registry.byProfile?.[universe]?.[normalizedMode]', limitation: 'Runtime universe and mode select registry entries; this report does not prove which keys are reachable.' },
  { sourcePath: 'src/game/renderer.js', marker: 'OPENAI_BACKDROPS[mode]?.[universe]', limitation: 'Dynamic registry lookup and mode fallback require a separate reachability proof before removing a shared backdrop.' },
  { sourcePath: 'src/components/cards/cardArtPresentation.js', marker: 'const src = art.thumbnail || art.image || art.sheet || null;', limitation: 'UI artwork receives computed values from callers; a literal scan does not establish all callers or variants.' },
];

function mediaSize(root, relative) {
  const file = inspectDistributionPath(root, relative);
  const fd = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const bytes = fstatSync(fd).size;
    const header = Buffer.alloc(Math.min(bytes, 256));
    readSync(fd, header, 0, header.length, 0);
    if (/^\uFEFF?\s*version https:\/\/git-lfs\.github\.com\/spec\/v1/.test(header.toString('utf8'))) {
      throw new Error('Shared coverage requires materialized media, not an LFS pointer: ' + relative);
    }
    return bytes;
  } finally { closeSync(fd); }
}

function groupAssets(assets, key) {
  const groups = new Map();
  for (const asset of assets) {
    const name = key(asset);
    const group = groups.get(name) || { name, files: 0, bytes: 0 };
    group.files += 1;
    group.bytes += asset.bytes;
    groups.set(name, group);
  }
  return [...groups.values()].sort((a, b) => b.bytes - a.bytes || compare(a.name, b.name));
}

/** Metadata and literal observations, never a pruning authorization or dependency graph. */
export function buildDlcSharedAssetCoverage({ root = ROOT } = {}) {
  root = assertDistributionDirectory(root);
  const inventoryBytes = readDistributionFile(root, 'DLC/shared-assets.json');
  const inventory = JSON.parse(inventoryBytes);
  const manifests = readDlcDistributionManifests({ root });
  const files = [...new Set([
    ...listDistributionFiles({ root, relative: 'src' }).filter(file => SOURCE.test(file)),
    ...manifests.flatMap(pack => pack.modules.map(module => pack.directory + '/' + module.path)),
  ])].sort(compare);
  const consumers = new Map();
  const sourceDigests = [];
  const sourceText = new Map();
  for (const sourcePath of files) {
    const source = readDistributionFile(root, sourcePath).toString('utf8');
    sourceText.set(sourcePath, source);
    sourceDigests.push({ sourcePath, sha256: hash(source) });
    for (const publicPath of extractStaticPublicAssetPaths({ sourcePath, source })) {
      if (!consumers.has(publicPath)) consumers.set(publicPath, []);
      consumers.get(publicPath).push(sourcePath);
    }
  }
  const commonUiReferences = collectCommonUiAssetReferences({ root });
  const commonPaths = new Set(commonUiReferences.map(entry => entry.publicPath));
  const assets = inventory.assets.map(asset => ({ ...asset, bytes: mediaSize(root, asset.sourcePath) }));
  const multiUniverseAssets = assets.filter(asset => asset.reason === 'multiple-universe-references').map(asset => ({
    publicPath: asset.publicPath, sourcePath: asset.sourcePath, bytes: asset.bytes,
    declaredUniverses: asset.referencedBy || [], declaredBasis: asset.basis || [],
    literalSourceFiles: consumers.get(asset.publicPath) || [],
    commonUiReference: commonPaths.has(asset.publicPath),
    retention: commonPaths.has(asset.publicPath) ? 'common-ui-reference' : 'dynamic-closure-unproven',
    mayPrune: false,
  })).sort((a, b) => compare(a.publicPath, b.publicPath));
  const indirectConsumers = INDIRECT_CONSUMERS.filter(entry => sourceText.has(entry.sourcePath)).map(entry => {
    const source = sourceText.get(entry.sourcePath);
    const offset = source.indexOf(entry.marker);
    if (offset < 0) throw new Error('Reviewed indirect consumer changed; inspect before refreshing coverage: ' + entry.sourcePath);
    return { ...entry, line: source.slice(0, offset).split('\n').length, sha256: hash(source) };
  });
  const assetsWithLiteral = assets.filter(asset => consumers.has(asset.publicPath));
  const candidates = multiUniverseAssets.filter(asset => !asset.commonUiReference
    && asset.literalSourceFiles.length && asset.literalSourceFiles.every(file => file.startsWith('DLC/')));
  return {
    schemaVersion: 1,
    scope: 'Non-exhaustive static observations from src JS/JSX/TS/TSX/CSS/JSON and declared DLC modules; no execution, call graph, runtime-key closure, public JSON traversal, or proof of exclusive ownership.',
    policy: 'preserve-all',
    decision: 'No shared resource is removed. DLC-only literal occurrences are investigation candidates, not proof that base or another pack cannot request the resource.',
    inputs: { sharedManifestSha256: hash(inventoryBytes), catalogueSha256: hash(JSON.stringify(manifests)),
      sourceInventorySha256: hash(JSON.stringify(sourceDigests)), sourceFiles: files.length,
      mediaMeasurement: 'Regular canonical files measured once by stat; the first 256 bytes reject LFS pointers. No generated public copy is counted twice and media payloads are not rehashed.' },
    totals: { sharedFiles: assets.length, sharedBytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
      assetsWithLiteral: assetsWithLiteral.length, bytesWithLiteral: assetsWithLiteral.reduce((sum, asset) => sum + asset.bytes, 0),
      commonUiReferences: commonUiReferences.length, commonUiAssets: commonPaths.size,
      dlcOnlyLiteralCandidates: candidates.length, dlcOnlyLiteralCandidateBytes: candidates.reduce((sum, asset) => sum + asset.bytes, 0),
      approvedForRemoval: 0 },
    byReason: groupAssets(assets, asset => asset.reason || 'unspecified'),
    byFamily: groupAssets(assets, asset => asset.publicPath.split('/').slice(1, 3).join('/')),
    byExtension: groupAssets(assets, asset => extname(asset.publicPath).toLowerCase() || '(none)'),
    commonUiReferences, multiUniverseAssets, indirectConsumers,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const options = {};
    for (let index = 2; index < process.argv.length; index += 2) {
      const key = process.argv[index];
      if (!['--root', '--out', '--check'].includes(key) || !process.argv[index + 1] || options[key]) {
        throw new Error('Usage: node scripts/dlcSharedAssetCoverage.mjs [--root ROOT] [--out REPORT | --check REPORT]');
      }
      options[key] = process.argv[index + 1];
    }
    if (options['--out'] && options['--check']) throw new Error('Choose --out or --check, not both.');
    const report = buildDlcSharedAssetCoverage({ root: options['--root'] || ROOT });
    const serialized = JSON.stringify(report, null, 2) + '\n';
    if (options['--out']) writeFileSync(resolve(options['--out']), serialized);
    if (options['--check'] && readFileSync(resolve(options['--check']), 'utf8') !== serialized) throw new Error('Shared asset coverage report is stale; review and regenerate it.');
    console.log(JSON.stringify(options['--out'] || options['--check'] ? report.totals : report, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
