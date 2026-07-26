import { createHash } from 'node:crypto';
import { readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { BOOSTER_ART_BY_UNIVERSE } from '../src/game/portalBoosterCatalog.js';

const projectRoot = path.resolve(import.meta.dirname, '..');
const defaultManifest = path.join(
  projectRoot,
  'tmp',
  'booster-generation',
  'catalog.generated.entries.json'
);
const catalogPath = path.join(projectRoot, 'src', 'game', 'portalBoosterCatalog.js');

const parseArguments = (argv) => {
  const options = {
    manifest: defaultManifest,
    write: false,
    allowPartial: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--manifest') {
      options.manifest = path.resolve(projectRoot, argv[index + 1]);
      index += 1;
    } else if (argument === '--write') {
      options.write = true;
    } else if (argument === '--allow-partial') {
      options.allowPartial = true;
    } else if (argument === '--help' || argument === '-h') {
      console.log([
        'Usage: node scripts/syncPortalBoosterCatalog.mjs [options]',
        '',
        'Default mode validates and previews the merge without changing the catalogue.',
        '',
        'Options:',
        '  --manifest <file>   Generated catalogue manifest',
        '  --write             Apply the validated merge atomically',
        '  --allow-partial     Permit a deliberately partial manifest',
        '  --help              Show this help'
      ].join('\n'));
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
};

const sha256File = async (filePath) => {
  const contents = await readFile(filePath);
  return createHash('sha256').update(contents).digest('hex');
};

const validateManifestEntry = async (entry) => {
  if (
    !entry
    || typeof entry.universe !== 'string'
    || !entry.output?.startsWith('/boosters/')
    || !entry.output.endsWith('.webp')
    || entry.output.includes('..')
  ) {
    throw new Error(`Invalid catalogue entry: ${JSON.stringify(entry)}`);
  }
  if (entry.width !== 640 || entry.height !== 960) {
    throw new Error(`${entry.universe}: expected validated dimensions 640x960`);
  }

  const assetPath = path.join(
    projectRoot,
    'public',
    ...entry.output.split('/').filter(Boolean)
  );
  const assetStats = await stat(assetPath);
  if (!assetStats.isFile() || assetStats.size < 50_000 || assetStats.size > 800_000) {
    throw new Error(`${entry.universe}: invalid asset size ${assetStats.size}`);
  }
  if (entry.bytes !== assetStats.size) {
    throw new Error(`${entry.universe}: manifest byte size differs from asset`);
  }
  const assetHash = await sha256File(assetPath);
  if (assetHash !== entry.sha256) {
    throw new Error(`${entry.universe}: manifest hash differs from asset`);
  }
};

const renderCatalogObject = (mapping) => {
  const collator = new Intl.Collator('fr', { sensitivity: 'base', numeric: true });
  const entries = Object.entries(mapping)
    .sort(([left], [right]) => collator.compare(left, right))
    .map(([universe, publicPath]) => (
      `  ${JSON.stringify(universe)}: ${JSON.stringify(publicPath)}`
    ));
  return `export const BOOSTER_ART_BY_UNIVERSE = {\n${entries.join(',\n')}\n};`;
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  const manifest = JSON.parse(await readFile(options.manifest, 'utf8'));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.entries)) {
    throw new Error('Manifest must use schemaVersion 1 and contain entries.');
  }
  if (!manifest.complete && !options.allowPartial) {
    throw new Error('Refusing an incomplete manifest without --allow-partial.');
  }

  const mergedMapping = { ...BOOSTER_ART_BY_UNIVERSE };
  const pathOwners = new Map(
    Object.entries(mergedMapping).map(([universe, publicPath]) => [publicPath, universe])
  );
  const seenManifestUniverses = new Set();
  const seenManifestPaths = new Set();

  for (const entry of manifest.entries) {
    await validateManifestEntry(entry);
    if (seenManifestUniverses.has(entry.universe)) {
      throw new Error(`Duplicate manifest universe: ${entry.universe}`);
    }
    if (seenManifestPaths.has(entry.output)) {
      throw new Error(`Duplicate manifest path: ${entry.output}`);
    }
    seenManifestUniverses.add(entry.universe);
    seenManifestPaths.add(entry.output);

    const currentPath = mergedMapping[entry.universe];
    if (currentPath && currentPath !== entry.output) {
      throw new Error(
        `${entry.universe}: catalogue already uses ${currentPath}, not ${entry.output}`
      );
    }
    const currentOwner = pathOwners.get(entry.output);
    if (currentOwner && currentOwner !== entry.universe) {
      throw new Error(
        `${entry.output}: already belongs to ${currentOwner}, not ${entry.universe}`
      );
    }
    mergedMapping[entry.universe] = entry.output;
    pathOwners.set(entry.output, entry.universe);
  }

  const source = await readFile(catalogPath, 'utf8');
  const objectPattern = /export const BOOSTER_ART_BY_UNIVERSE = \{[\s\S]*?\n\};/;
  if (!objectPattern.test(source)) {
    throw new Error('Could not locate BOOSTER_ART_BY_UNIVERSE object.');
  }
  const updatedSource = source.replace(objectPattern, renderCatalogObject(mergedMapping));

  if (options.write && updatedSource !== source) {
    const temporaryPath = `${catalogPath}.tmp-${process.pid}-${Date.now()}`;
    await writeFile(temporaryPath, updatedSource, 'utf8');
    await rename(temporaryPath, catalogPath);
  }

  console.log(JSON.stringify({
    mode: options.write ? 'write' : 'check',
    manifest: path.relative(projectRoot, options.manifest),
    currentEntries: Object.keys(BOOSTER_ART_BY_UNIVERSE).length,
    generatedEntries: manifest.entries.length,
    mergedEntries: Object.keys(mergedMapping).length,
    changed: updatedSource !== source
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
