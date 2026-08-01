import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const TILE_SIZE = { width: 240, height: 320 };

const CHARACTERS = [
  ['nexus-de-convergence', 'player-anchor'],
  ['halo', 'masterchief'],
  ['halo', 'arbiter'],
  ['resident-evil', 'wesker'],
  ['resident-evil', 'jill'],
  ['resident-evil', 'leon']
];

const BASENAMES = [
  'character-solo-openai-v1-thumb.webp',
  'signature-weapon-openai-v1-thumb.webp',
  'decor-openai-v1-thumb.webp',
  'coherent-scene-openai-v1-thumb.webp',
  'action-scene-openai-v1-thumb.webp',
  'intro-pose-openai-v1-thumb.webp',
  'victory-pose-openai-v1-thumb.webp',
  'defeat-pose-openai-v1-thumb.webp'
];

const composites = [];
for (let row = 0; row < CHARACTERS.length; row += 1) {
  const [universeKey, characterKey] = CHARACTERS[row];
  for (let column = 0; column < BASENAMES.length; column += 1) {
    const inputPath = path.join(
      PROJECT_ROOT,
      'public',
      'cg',
      universeKey,
      characterKey,
      BASENAMES[column]
    );
    composites.push({
      input: await sharp(inputPath)
        .resize(TILE_SIZE.width, TILE_SIZE.height, { fit: 'cover' })
        .toBuffer(),
      left: column * TILE_SIZE.width,
      top: row * TILE_SIZE.height
    });
  }
}

const outputDirectory = path.join(PROJECT_ROOT, 'docs', 'cg', 'screenshots');
const outputPath = path.join(outputDirectory, 'cg-pilot-cg01-08-review-sheet.webp');
await mkdir(outputDirectory, { recursive: true });
await sharp({
  create: {
    width: BASENAMES.length * TILE_SIZE.width,
    height: CHARACTERS.length * TILE_SIZE.height,
    channels: 3,
    background: '#02090d'
  }
})
  .composite(composites)
  .webp({ quality: 90, effort: 6 })
  .toFile(outputPath);

console.log(`Planche de revue CG ecrite: ${outputPath}`);
