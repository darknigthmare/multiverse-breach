import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import { slugifyBoosterUniverse } from './buildPortalBoosterGenerationPlan.mjs';

const REPOSITORY_ROOT = path.resolve(import.meta.dirname, '..');
const TARGET_WIDTH = 640;
const TARGET_HEIGHT = 960;
const MINIMUM_BYTES = 50_000;
const MAXIMUM_BYTES = 800_000;

const parseArguments = argv => {
  const options = { input: '', universe: '' };
  for (const argument of argv) {
    if (argument.startsWith('--input=')) {
      options.input = argument.slice('--input='.length).trim();
    } else if (argument.startsWith('--universe=')) {
      options.universe = argument.slice('--universe='.length).trim();
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  if (!options.input) throw new Error('--input requires a generated PNG path.');
  if (!options.universe) throw new Error('--universe requires the exact runtime universe name.');
  return options;
};

const fileExists = async filePath => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const sha256 = source => createHash('sha256').update(source).digest('hex');

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  const inputPath = path.resolve(REPOSITORY_ROOT, options.input);
  const slug = slugifyBoosterUniverse(options.universe);
  if (!slug) throw new Error('The runtime universe name cannot produce an empty booster slug.');

  const outputPath = path.join(REPOSITORY_ROOT, 'public', 'boosters', `${slug}.webp`);
  if (await fileExists(outputPath)) {
    throw new Error(`${options.universe}: refusing to overwrite ${path.relative(REPOSITORY_ROOT, outputPath)}.`);
  }

  const input = await readFile(inputPath);
  const sourceMetadata = await sharp(input, { failOn: 'error' }).metadata();
  if (
    sourceMetadata.format !== 'png'
    || !sourceMetadata.width
    || !sourceMetadata.height
    || sourceMetadata.width < 900
    || sourceMetadata.height < 1300
    || Math.abs((sourceMetadata.width / sourceMetadata.height) - (2 / 3)) > 0.01
  ) {
    throw new Error(
      `${options.universe}: generated source must be a portrait 2:3 PNG of at least 900x1300; `
      + `received ${sourceMetadata.width}x${sourceMetadata.height} ${sourceMetadata.format}.`
    );
  }

  const runtime = await sharp(input, { failOn: 'error' })
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'fill' })
    .webp({ quality: 88, effort: 6 })
    .toBuffer();
  if (runtime.length < MINIMUM_BYTES || runtime.length > MAXIMUM_BYTES) {
    throw new Error(`${options.universe}: runtime booster size ${runtime.length} is outside ${MINIMUM_BYTES}-${MAXIMUM_BYTES} bytes.`);
  }

  const runtimeMetadata = await sharp(runtime, { failOn: 'error' }).metadata();
  if (
    runtimeMetadata.format !== 'webp'
    || runtimeMetadata.width !== TARGET_WIDTH
    || runtimeMetadata.height !== TARGET_HEIGHT
  ) {
    throw new Error(`${options.universe}: runtime conversion did not produce a 640x960 WebP.`);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, runtime, { flag: 'wx' });
  console.log(JSON.stringify({
    universe: options.universe,
    output: `/boosters/${path.basename(outputPath)}`,
    width: TARGET_WIDTH,
    height: TARGET_HEIGHT,
    bytes: runtime.length,
    sha256: sha256(runtime),
    source: {
      width: sourceMetadata.width,
      height: sourceMetadata.height,
      bytes: input.length,
      sha256: sha256(input)
    }
  }, null, 2));
};

main().catch(error => {
  console.error(`[install-generated-canon-booster] ${error.message}`);
  process.exitCode = 1;
});
