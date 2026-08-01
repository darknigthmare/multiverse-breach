import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const readArgument = name => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
};

const input = readArgument('--input');
const output = readArgument('--output');

if (!input || !output) {
  console.error('Usage: node scripts/normalizeMeleeSpriteAtlas.mjs --input atlas.webp --output atlas.webp');
  process.exit(1);
}

const metadata = await sharp(input).metadata();
if (!metadata.width || !metadata.height || metadata.width % 4 !== 0 || metadata.height % 4 !== 0) {
  throw new Error(`Atlas must be divisible into a strict 4x4 grid: ${metadata.width}x${metadata.height}`);
}

const sourceCellWidth = metadata.width / 4;
const sourceCellHeight = metadata.height / 4;
const composites = [];

for (let row = 0; row < 4; row += 1) {
  for (let col = 0; col < 4; col += 1) {
    const frame = await sharp(input)
      .extract({
        left: col * sourceCellWidth,
        top: row * sourceCellHeight,
        width: sourceCellWidth,
        height: sourceCellHeight
      })
      .resize(256, 256, { fit: 'fill', kernel: sharp.kernel.nearest })
      .png()
      .toBuffer();
    composites.push({ input: frame, left: col * 256, top: row * 256 });
  }
}

await fs.mkdir(path.dirname(output), { recursive: true });
const temporaryOutput = `${output}.normalizing-${process.pid}.webp`;
await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
  .composite(composites)
  .webp({ lossless: true, effort: 6 })
  .toFile(temporaryOutput);
await fs.rename(temporaryOutput, output);

console.log(JSON.stringify({
  input,
  output,
  sourceSize: [metadata.width, metadata.height],
  finalSize: [1024, 1024],
  sourceCell: [sourceCellWidth, sourceCellHeight],
  finalCell: [256, 256]
}, null, 2));
