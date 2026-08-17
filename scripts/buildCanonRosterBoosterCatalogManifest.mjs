import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import { BOOSTER_ART_BY_UNIVERSE } from '../src/game/portalBoosterCatalog.js';
import { slugifyBoosterUniverse } from './buildPortalBoosterGenerationPlan.mjs';

const REPOSITORY_ROOT = path.resolve(import.meta.dirname, '..');
const DEFAULT_OUTPUT = path.join(
  REPOSITORY_ROOT,
  'tmp',
  'booster-generation',
  'canon-roster.generated.entries.json'
);

const sha256 = source => createHash('sha256').update(source).digest('hex');

const parseArguments = argv => {
  let output = DEFAULT_OUTPUT;
  for (const argument of argv) {
    if (argument.startsWith('--out=')) {
      output = path.resolve(REPOSITORY_ROOT, argument.slice('--out='.length).trim());
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return { output };
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  const missingCatalogEntries = CANON_ROSTER_WAVE.filter(entry => (
    !BOOSTER_ART_BY_UNIVERSE[entry.universe]
  ));
  const entries = [];
  const hashOwners = new Map();

  for (const rosterEntry of missingCatalogEntries) {
    const universe = rosterEntry.universe;
    const publicPath = `/boosters/${slugifyBoosterUniverse(universe)}.webp`;
    const filePath = path.join(REPOSITORY_ROOT, 'public', ...publicPath.split('/').filter(Boolean));
    const [source, fileStats, metadata] = await Promise.all([
      readFile(filePath),
      stat(filePath),
      sharp(filePath, { failOn: 'error' }).metadata()
    ]);
    if (
      !fileStats.isFile()
      || fileStats.size < 50_000
      || fileStats.size > 800_000
      || metadata.format !== 'webp'
      || metadata.width !== 640
      || metadata.height !== 960
    ) {
      throw new Error(`${universe}: ${publicPath} is not a validated 640x960 WebP booster.`);
    }
    const digest = sha256(source);
    const hashOwner = hashOwners.get(digest);
    if (hashOwner) throw new Error(`${universe}: runtime booster duplicates ${hashOwner}.`);
    hashOwners.set(digest, universe);
    entries.push({
      universe,
      output: publicPath,
      width: 640,
      height: 960,
      bytes: fileStats.size,
      sha256: digest
    });
  }

  const manifest = {
    schemaVersion: 1,
    complete: true,
    source: 'independently-generated-and-visually-reviewed-openai-canon-roster-boosters',
    entries
  };
  await mkdir(path.dirname(options.output), { recursive: true });
  await writeFile(options.output, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    status: 'approved',
    output: path.relative(REPOSITORY_ROOT, options.output).split(path.sep).join('/'),
    entries: entries.length,
    uniqueHashes: hashOwners.size
  }, null, 2));
};

main().catch(error => {
  console.error(`[build-canon-roster-booster-catalog-manifest] ${error.message}`);
  process.exitCode = 1;
});
