import { createHash } from 'node:crypto';
import { readdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { ORIGINAL_UNIVERSE_DEFINITIONS } from '../src/game/originalUniverseWave.js';
import { slugifyBoosterUniverse } from './buildPortalBoosterGenerationPlan.mjs';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const LEDGER_ROOT = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-ledger',
  'entries'
);
const MANIFEST_PATH = path.join(
  REPOSITORY_ROOT,
  'public',
  'boosters',
  'original-worlds',
  'runtime-manifest.json'
);
const SOURCE_PREFIX = '/boosters/original-worlds/v2/';
const TARGET_WIDTH = 640;
const TARGET_HEIGHT = 960;
const MINIMUM_BYTES = 50_000;
const MAXIMUM_BYTES = 800_000;
const checkOnly = process.argv.slice(2).includes('--check');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const repositoryPathFromPublicPath = publicPath => path.join(
  REPOSITORY_ROOT,
  'public',
  ...publicPath.split('/').filter(Boolean)
);

const writeAtomically = async (destination, value) => {
  const temporaryPath = `${destination}.tmp-${process.pid}-${Date.now()}`;
  try {
    await writeFile(temporaryPath, value);
    await rename(temporaryPath, destination);
  } catch (error) {
    try {
      await unlink(temporaryPath);
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') throw cleanupError;
    }
    throw error;
  }
};

const ledgerEntries = await Promise.all(
  (await readdir(LEDGER_ROOT))
    .filter(fileName => fileName.endsWith('.json'))
    .map(async fileName => ({
      fileName,
      entry: JSON.parse(await readFile(path.join(LEDGER_ROOT, fileName), 'utf8'))
    }))
);
const boosterLedgerByWorldKey = new Map(
  ledgerEntries
    .filter(({ entry }) => entry.category === 'booster')
    .map(({ fileName, entry }) => [entry.worldKey, { fileName, entry }])
);

if (boosterLedgerByWorldKey.size !== ORIGINAL_UNIVERSE_DEFINITIONS.length) {
  throw new Error(
    `Expected ${ORIGINAL_UNIVERSE_DEFINITIONS.length} OpenAI booster ledgers, found ${boosterLedgerByWorldKey.size}.`
  );
}

const outputs = [];
for (const definition of ORIGINAL_UNIVERSE_DEFINITIONS) {
  const sourcePublicPath = `${SOURCE_PREFIX}${definition.key}.png`;
  const runtimePublicPath = `/boosters/${slugifyBoosterUniverse(definition.universe)}.webp`;
  const sourcePath = repositoryPathFromPublicPath(sourcePublicPath);
  const runtimePath = repositoryPathFromPublicPath(runtimePublicPath);
  const ledger = boosterLedgerByWorldKey.get(definition.key);
  if (!ledger) throw new Error(`${definition.universe}: missing OpenAI source ledger.`);

  const source = await readFile(sourcePath);
  const sourceMetadata = await sharp(source, { failOn: 'error' }).metadata();
  if (
    sourceMetadata.format !== 'png'
    || sourceMetadata.width !== 1024
    || sourceMetadata.height !== 1536
  ) {
    throw new Error(
      `${definition.universe}: source must remain 1024x1536 PNG, received `
      + `${sourceMetadata.width}x${sourceMetadata.height} ${sourceMetadata.format}.`
    );
  }
  if (
    ledger.entry.destination !== sourcePublicPath
    || ledger.entry.repositoryPath !== `public${sourcePublicPath}`
    || ledger.entry.generation?.provider !== 'OpenAI'
    || ledger.entry.image?.sha256 !== sha256(source)
  ) {
    throw new Error(`${definition.universe}: source PNG does not match its OpenAI provenance ledger.`);
  }

  const runtime = await sharp(source, { failOn: 'error' })
    .resize({
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      fit: 'inside',
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true
    })
    .toColourspace('srgb')
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toBuffer();
  const runtimeMetadata = await sharp(runtime, { failOn: 'error' }).metadata();
  if (
    runtimeMetadata.format !== 'webp'
    || runtimeMetadata.width !== TARGET_WIDTH
    || runtimeMetadata.height !== TARGET_HEIGHT
    || runtime.length < MINIMUM_BYTES
    || runtime.length > MAXIMUM_BYTES
  ) {
    throw new Error(`${definition.universe}: invalid 640x960 WebP runtime derivative.`);
  }

  if (checkOnly) {
    const installed = await readFile(runtimePath);
    if (!installed.equals(runtime)) {
      throw new Error(`${definition.universe}: runtime WebP is missing or stale.`);
    }
  } else {
    await writeAtomically(runtimePath, runtime);
  }

  const fileStats = checkOnly ? await stat(runtimePath) : { size: runtime.length };
  outputs.push({
    worldKey: definition.key,
    universe: definition.universe,
    source: {
      publicPath: sourcePublicPath,
      repositoryPath: `public${sourcePublicPath}`,
      provenanceLedger: `docs/original-universes/openai-image-v2-ledger/entries/${ledger.fileName}`,
      sha256: sha256(source),
      bytes: source.length,
      width: sourceMetadata.width,
      height: sourceMetadata.height,
      format: 'PNG'
    },
    runtime: {
      publicPath: runtimePublicPath,
      repositoryPath: `public${runtimePublicPath}`,
      sha256: sha256(runtime),
      bytes: fileStats.size,
      width: runtimeMetadata.width,
      height: runtimeMetadata.height,
      format: 'WebP'
    }
  });
}

const manifest = {
  schemaVersion: 1,
  contractId: 'multiverse-breach-original-booster-runtime-v1',
  derivedAt: '2026-08-22',
  sourceContract: {
    provider: 'OpenAI',
    format: 'PNG',
    width: 1024,
    height: 1536,
    preserved: true
  },
  runtimeContract: {
    format: 'WebP',
    width: TARGET_WIDTH,
    height: TARGET_HEIGHT,
    resize: 'aspect-preserving-inside',
    crop: false,
    quality: 88
  },
  entries: outputs
};
const encodedManifest = `${JSON.stringify(manifest, null, 2)}\n`;

if (checkOnly) {
  const installedManifest = await readFile(MANIFEST_PATH, 'utf8');
  if (installedManifest !== encodedManifest) {
    throw new Error('Original-universe runtime booster manifest is missing or stale.');
  }
} else {
  await writeAtomically(MANIFEST_PATH, encodedManifest);
}

console.log(JSON.stringify({
  mode: checkOnly ? 'check' : 'write',
  sourcesPreserved: outputs.length,
  runtimeBoosters: outputs.length,
  format: 'WebP',
  dimensions: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
  manifest: path.relative(REPOSITORY_ROOT, MANIFEST_PATH).replaceAll('\\', '/')
}, null, 2));
