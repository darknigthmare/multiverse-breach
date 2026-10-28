import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CLOUD_MEADOW_CHARACTERS, CLOUD_MEADOW_REFERENCE_SRC } from '../src/game/cloudMeadowCharacters.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceCrops = {
  cloud_meadow_eve: [61, 288, 117, 332],
  cloud_meadow_evan: [176, 277, 119, 342],
  cloud_meadow_dragon_female: [348, 32, 541, 590],
  cloud_meadow_dragon_male: [350, 553, 523, 624]
};

async function inspectImage(src, requireTransparency = true) {
  const bytes = await readFile(resolve(root, `public${src}`));
  const metadata = await sharp(bytes).metadata();
  if (metadata.format !== 'png') throw new Error(`${src}: expected PNG`);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width; let y0 = info.height; let x1 = -1; let y1 = -1;
  let transparentPixels = 0; let boundaryPixels = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const alpha = data[(y * info.width + x) * info.channels + info.channels - 1];
    if (alpha === 0) transparentPixels++;
    if (alpha > 16) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      if (x === 0 || y === 0 || x === info.width - 1 || y === info.height - 1) boundaryPixels++;
    }
  }
  if (x1 < 0) throw new Error(`${src}: empty image`);
  if (requireTransparency && (!metadata.hasAlpha || transparentPixels === 0)) throw new Error(`${src}: missing real transparency`);
  if (requireTransparency && boundaryPixels > 0) throw new Error(`${src}: visible pixels touch the frame boundary; check for clipped limbs/tail`);
  return {
    sha256: digest(bytes), bytes: bytes.length, width: info.width, height: info.height,
    hasAlpha: metadata.hasAlpha, transparentPixels, boundaryPixels,
    contentBounds: { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }
  };
}

const entries = await Promise.all(CLOUD_MEADOW_CHARACTERS.map(async character => ({
  ...character,
  referenceCrop: sourceCrops[character.id],
  image: await inspectImage(character.src)
})));
const reference = {
  src: CLOUD_MEADOW_REFERENCE_SRC,
  suppliedFilename: 'image(20261028-174228).png',
  suppliedOn: '2026-10-28',
  image: await inspectImage(CLOUD_MEADOW_REFERENCE_SRC, false)
};
const catalog = {
  schemaVersion: 1,
  universe: 'Cloud Meadow',
  counts: {
    characters: entries.length, images: entries.length,
    referenceBased: entries.filter(entry => entry.fidelityStatus === 'reference-based-generated').length,
    adapted: entries.filter(entry => entry.fidelityStatus === 'adapted-coverage').length,
    animationFramesPerImage: 1, pixelIdenticalCertified: 0
  },
  reference,
  sources: [{ url: 'https://www.patreon.com/CloudMeadow/about', purpose: 'Primary source naming protagonists Evan and Eve', checkedOn: '2026-10-28' }],
  limitations: [
    'Reference-guided generated images, not original source-game exports or pixel-identical certified reproductions.',
    'Female Dragon is an explicitly covered adaptation with an added opaque charcoal chest plate, absent from the supplied reference.',
    'One static full-body pose per character; no source-game movement/combat animation is claimed.',
    'Visual catalogue only; no invented combat stats, moves, unlocks, bosses or campaign.',
    'Dragon labels refer to the two species models in the supplied image, not verified individual names.',
    'Relative heights are approximate measurements from the reference, not canonical physical measurements.'
  ],
  entries
};
const manifest = {
  ...catalog,
  provenance: {
    generator: 'Built-in ImageGen',
    method: 'One separate reference-guided transparent edit per character',
    promptFile: 'docs/cloud-meadow/prompts.json',
    postProcessing: 'None: generated PNG bytes copied unchanged into the project.'
  }
};
for (const [name, value] of [
  ['public/reviews/cloud-meadow/catalog.json', catalog],
  ['docs/cloud-meadow/manifest.json', manifest]
]) {
  const output = resolve(root, name);
  const expected = `${JSON.stringify(value, null, 2)}\n`;
  if (process.argv.includes('--write')) {
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, expected);
  } else if (await readFile(output, 'utf8') !== expected) {
    throw new Error(`${name} is stale; run npm run cloud-meadow:review`);
  }
}
console.log(`Cloud Meadow: ${entries.length} complete transparent PNGs, source reference and review catalogue ${process.argv.includes('--write') ? 'written' : 'verified'}.`);
