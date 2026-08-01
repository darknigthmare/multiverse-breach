import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const TILE = { width: 240, height: 320 };
const GUTTER_WIDTH = 170;
const HEADER_HEIGHT = 58;

const ROWS = [
  {
    name: 'ANCHOR', universe: 'nexus-de-convergence', character: 'player-anchor',
    assets: [null, null, 'goofy', 'alignment-swap', null, 'zombie-version', 'first-step']
  },
  {
    name: 'CHIEF', universe: 'halo', character: 'masterchief',
    assets: [null, null, 'goofy', 'alignment-swap', 'iconic-outfit-swap', 'zombie-version', 'first-step']
  },
  {
    name: 'ARBITER', universe: 'halo', character: 'arbiter',
    assets: [null, null, 'goofy', 'alignment-swap', 'iconic-outfit-swap', 'zombie-version', 'future-experienced']
  },
  {
    name: 'WESKER', universe: 'resident-evil', character: 'wesker',
    assets: ['beach-family', 'maid-service', 'goofy', 'alignment-swap', 'gender-swap', 'zombie-version', 'first-step']
  },
  {
    name: 'JILL', universe: 'resident-evil', character: 'jill',
    assets: ['beach-family', 'maid-service', 'goofy', 'alignment-swap', 'gender-swap', 'zombie-version', 'future-experienced']
  },
  {
    name: 'LEON', universe: 'resident-evil', character: 'leon',
    assets: ['beach-family', 'maid-service', 'goofy', 'alignment-swap', 'gender-swap', 'zombie-version', 'future-experienced']
  }
];

const svg = ({ width, height, text, subtext = '', background = '#071015', color = '#7df9ff' }) => Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${background}"/>
    <text x="50%" y="48%" text-anchor="middle" dominant-baseline="middle"
      fill="${color}" font-family="Arial, sans-serif" font-size="22" font-weight="700">${text}</text>
    ${subtext ? `<text x="50%" y="58%" text-anchor="middle" dominant-baseline="middle" fill="#82979b" font-family="Arial, sans-serif" font-size="12">${subtext}</text>` : ''}
  </svg>
`);

const composites = [];
for (let column = 0; column < 7; column += 1) {
  composites.push({
    input: svg({ width: TILE.width, height: HEADER_HEIGHT, text: `CG${String(column + 9).padStart(2, '0')}` }),
    left: GUTTER_WIDTH + column * TILE.width,
    top: 0
  });
}

for (let row = 0; row < ROWS.length; row += 1) {
  const definition = ROWS[row];
  composites.push({
    input: svg({ width: GUTTER_WIDTH, height: TILE.height, text: definition.name, color: '#d9b86b' }),
    left: 0,
    top: HEADER_HEIGHT + row * TILE.height
  });

  for (let column = 0; column < definition.assets.length; column += 1) {
    const basename = definition.assets[column];
    const left = GUTTER_WIDTH + column * TILE.width;
    const top = HEADER_HEIGHT + row * TILE.height;
    if (!basename) {
      composites.push({
        input: svg({ width: TILE.width, height: TILE.height, text: 'N/A', subtext: 'coherence gate', background: '#03090d', color: '#62757a' }),
        left,
        top
      });
      continue;
    }

    const inputPath = path.join(
      PROJECT_ROOT, 'public', 'cg', definition.universe, definition.character,
      `${basename}-openai-v1-thumb.webp`
    );
    composites.push({
      input: await sharp(inputPath).resize(TILE.width, TILE.height, { fit: 'cover' }).toBuffer(),
      left,
      top
    });
  }
}

const outputDirectory = path.join(PROJECT_ROOT, 'docs', 'cg', 'screenshots');
const outputPath = path.join(outputDirectory, 'cg-pilot-cg09-15-review-sheet.webp');
await mkdir(outputDirectory, { recursive: true });
await sharp({
  create: {
    width: GUTTER_WIDTH + 7 * TILE.width,
    height: HEADER_HEIGHT + ROWS.length * TILE.height,
    channels: 3,
    background: '#02090d'
  }
})
  .composite(composites)
  .webp({ quality: 90, effort: 6 })
  .toFile(outputPath);

console.log(`Planche de revue CG09-15 ecrite: ${outputPath}`);
