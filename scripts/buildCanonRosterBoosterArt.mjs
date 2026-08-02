import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';

const BOOSTER_WIDTH = 640;
const BOOSTER_HEIGHT = 960;
const MINIMUM_OUTPUT_BYTES = 50 * 1024;
const SHEET_SIZE = 1024;
const CELL_SIZE = 256;
const CELL_COUNT = 16;
const CELL_GUARD_PIXELS = 12;
const CHROMA_TOLERANCE = 32;
const EXPECTED_BOOSTER_COUNT = 31;

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const boosterDirectory = path.join(repositoryRoot, 'public', 'boosters');

const STABLE_BOOSTER_SLUGS = Object.freeze({
  "Avatar (Na'vi)": 'avatar-navi',
  'SCP Foundation': 'scp-foundation',
  Skibidi: 'skibidi',
  Skyline: 'skyline',
  'Kill Bill': 'kill-bill'
});

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const parseArguments = argv => {
  let force = false;
  const universes = [];
  for (const argument of argv) {
    if (argument === '--force') {
      force = true;
      continue;
    }
    if (argument.startsWith('--universe=')) {
      const universe = argument.slice('--universe='.length).trim();
      if (!universe) throw new Error('--universe requires a non-empty runtime universe name.');
      universes.push(universe);
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return { force, universes };
};

const exists = async filePath => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const sha256 = source => createHash('sha256').update(source).digest('hex');

const threatName = threat => typeof threat === 'string' ? threat : threat?.name;

const spritePath = ({ universe, heroId, name }) => {
  const directory = heroId ? 'heroes' : 'bosses';
  const entitySlug = slugify(heroId || name);
  return path.join(
    repositoryRoot,
    'public',
    'sprites',
    'generated',
    directory,
    slugify(universe),
    `${entitySlug}.png`
  );
};

const boosterTitle = entry => {
  if (typeof entry.title === 'string' && entry.title.trim()) return entry.title.trim();
  if (entry.title?.en) return String(entry.title.en).trim();
  return String(entry.universe).trim();
};

const makePlans = wave => {
  if (!Array.isArray(wave) || wave.length !== EXPECTED_BOOSTER_COUNT) {
    throw new Error(`CANON_ROSTER_WAVE must contain exactly ${EXPECTED_BOOSTER_COUNT} entries.`);
  }
  const plans = wave.map(entry => {
    const universe = String(entry?.universe || '').trim();
    if (!universe) throw new Error('Every canon roster entry must declare a universe.');
    const heroes = [entry.hero, ...(entry.allies || [])].slice(0, 3);
    if (heroes.length !== 3 || heroes.some(hero => !Array.isArray(hero) || !String(hero[0] || '').trim())) {
      throw new Error(`${universe}: three hero tuples with non-empty ids are required.`);
    }
    const worldBoss = String(threatName(entry.worldBoss) || '').trim();
    if (!worldBoss) throw new Error(`${universe}: a named world boss is required.`);
    const slug = STABLE_BOOSTER_SLUGS[universe] || slugify(universe);
    return {
      entry,
      universe,
      title: boosterTitle(entry),
      slug,
      outputPath: path.join(boosterDirectory, `${slug}.webp`),
      sources: [
        ...heroes.map((hero, index) => ({
          role: `hero-${index + 1}`,
          preferredCell: index,
          filePath: spritePath({ universe, heroId: hero[0] })
        })),
        {
          role: 'world-boss',
          preferredCell: 10,
          filePath: spritePath({ universe, name: worldBoss })
        }
      ]
    };
  });
  const outputPaths = plans.map(plan => plan.outputPath);
  if (new Set(outputPaths).size !== outputPaths.length) {
    throw new Error('Canon roster booster output paths must be unique.');
  }
  return plans;
};

const isNearChroma = (red, green, blue) => (
  (red <= CHROMA_TOLERANCE
    && green >= 255 - CHROMA_TOLERANCE
    && blue <= CHROMA_TOLERANCE)
  || (red >= 255 - CHROMA_TOLERANCE
    && green <= CHROMA_TOLERANCE
    && blue >= 255 - CHROMA_TOLERANCE)
);

const hashCell = ({ data, width, channels, row, column }) => {
  const hash = createHash('sha256');
  for (let y = row * CELL_SIZE; y < (row + 1) * CELL_SIZE; y += 1) {
    const start = (y * width + column * CELL_SIZE) * channels;
    hash.update(data.subarray(start, start + CELL_SIZE * channels));
  }
  return hash.digest('hex');
};

const inspectSpriteSheet = async filePath => {
  if (!await exists(filePath)) throw new Error('file is missing');
  const source = await readFile(filePath);
  const metadata = await sharp(source, { animated: false, failOn: 'error' }).metadata();
  const errors = [];
  if (metadata.format !== 'png') errors.push(`format ${metadata.format || 'unknown'} is not PNG`);
  if (metadata.width !== SHEET_SIZE || metadata.height !== SHEET_SIZE) {
    errors.push(`dimensions ${metadata.width || 0}x${metadata.height || 0} are not 1024x1024`);
  }
  if (metadata.channels !== 4 || metadata.hasAlpha !== true) errors.push('sheet is not RGBA');
  if (errors.length > 0) throw new Error(errors.join('; '));

  const { data, info } = await sharp(source, { animated: false, failOn: 'error' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cells = [];
  const cellHashes = [];
  let hiddenRgbPixels = 0;
  let chromaPixels = 0;
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      let minX = CELL_SIZE;
      let minY = CELL_SIZE;
      let maxX = -1;
      let maxY = -1;
      let visiblePixels = 0;
      let guardPixels = 0;
      for (let y = 0; y < CELL_SIZE; y += 1) {
        for (let x = 0; x < CELL_SIZE; x += 1) {
          const offset = (
            ((row * CELL_SIZE + y) * info.width + column * CELL_SIZE + x) * info.channels
          );
          const red = data[offset];
          const green = data[offset + 1];
          const blue = data[offset + 2];
          const alpha = data[offset + 3];
          if (alpha === 0 && (red !== 0 || green !== 0 || blue !== 0)) hiddenRgbPixels += 1;
          if (alpha === 0) continue;
          visiblePixels += 1;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          if (
            x < CELL_GUARD_PIXELS
            || y < CELL_GUARD_PIXELS
            || x >= CELL_SIZE - CELL_GUARD_PIXELS
            || y >= CELL_SIZE - CELL_GUARD_PIXELS
          ) guardPixels += 1;
          if (isNearChroma(red, green, blue)) chromaPixels += 1;
        }
      }
      const index = row * 4 + column;
      if (visiblePixels === 0) errors.push(`cell ${index + 1} is empty`);
      if (guardPixels > 0) errors.push(`cell ${index + 1} violates its 12px transparent guard`);
      cells.push({
        index,
        visiblePixels,
        bounds: visiblePixels > 0 ? {
          left: column * CELL_SIZE + minX,
          top: row * CELL_SIZE + minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1
        } : null
      });
      cellHashes.push(hashCell({ data, width: info.width, channels: info.channels, row, column }));
    }
  }
  if (new Set(cellHashes).size !== CELL_COUNT) errors.push('the 16 cells do not have distinct exact pixel hashes');
  if (hiddenRgbPixels > 0) errors.push(`${hiddenRgbPixels} transparent pixels retain hidden RGB`);
  if (chromaPixels > 0) errors.push(`${chromaPixels} visible pixels retain near-chroma colors`);
  if (errors.length > 0) throw new Error(errors.join('; '));
  return { filePath, sourceSha256: sha256(source), cells };
};

const preflightSources = async plans => {
  const validations = new Map();
  const errors = [];
  for (const plan of plans) {
    for (const source of plan.sources) {
      if (validations.has(source.filePath)) continue;
      try {
        validations.set(source.filePath, await inspectSpriteSheet(source.filePath));
      } catch (error) {
        errors.push(`${plan.universe} ${source.role}: ${path.relative(repositoryRoot, source.filePath)}: ${error.message}`);
      }
    }
  }
  if (errors.length > 0) {
    throw new Error(`Sprite preflight failed; no booster was written:\n${errors.join('\n')}`);
  }
  return validations;
};

const parseHexColor = value => {
  const match = String(value || '').trim().match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);
  if (!match) throw new Error(`Invalid roster color: ${value}`);
  const full = match[1].length === 3
    ? [...match[1]].map(character => character.repeat(2)).join('')
    : match[1];
  return [0, 2, 4].map(offset => Number.parseInt(full.slice(offset, offset + 2), 16));
};

const clamp = value => Math.max(0, Math.min(255, Math.round(value)));
const mix = (first, second, amount) => first.map((channel, index) => (
  clamp(channel + (second[index] - channel) * amount)
));

const seedFor = value => {
  let hash = 0x811c9dc5;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const randomGenerator = initialSeed => {
  let state = initialSeed || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
};

const buildPixelBackground = async plan => {
  if (!Array.isArray(plan.entry.colors) || plan.entry.colors.length < 3) {
    throw new Error(`${plan.universe}: colors must provide top, bottom and accent values.`);
  }
  const top = parseHexColor(plan.entry.colors[0]);
  const bottom = parseHexColor(plan.entry.colors[1]);
  const accent = parseHexColor(plan.entry.colors[2]);
  const width = 160;
  const height = 240;
  const pixels = Buffer.alloc(width * height * 3);
  const random = randomGenerator(seedFor(`${plan.slug}:${plan.title}`));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const vertical = y / (height - 1);
      let color = mix(top, bottom, vertical);
      const variation = (random() - 0.5) * 34;
      color = color.map(channel => clamp(channel + variation));
      if ((x * 3 + y * 2 + seedFor(plan.slug)) % 43 < 2) color = mix(color, accent, 0.32);
      if (random() > 0.992 && y < height * 0.7) color = mix(color, accent, 0.74);
      const offset = (y * width + x) * 3;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
    }
  }
  return sharp(pixels, { raw: { width, height, channels: 3 } })
    .resize(BOOSTER_WIDTH, BOOSTER_HEIGHT, { kernel: sharp.kernel.nearest })
    .png()
    .toBuffer();
};

const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const wrapTitle = title => {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  const targetLength = Math.max(12, Math.ceil(String(title).length / 3));
  const lines = [];
  for (const word of words) {
    const current = lines.at(-1);
    if (!current || (current.length + word.length + 1 > targetLength && lines.length < 3)) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  }
  while (lines.length > 3) {
    lines[lines.length - 2] = `${lines[lines.length - 2]} ${lines.pop()}`;
  }
  return lines;
};

const buildOverlay = plan => {
  const accent = plan.entry.colors[2];
  return Buffer.from(`
    <svg width="640" height="960" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="12" width="616" height="936" rx="8" fill="none" stroke="${escapeXml(accent)}" stroke-width="8"/>
      <rect x="28" y="28" width="584" height="164" fill="#05070ddd"/>
      <rect x="28" y="760" width="584" height="172" fill="#05070d99"/>
      <path d="M28 220H180L228 268H412L460 220H612V236H468L420 284H220L172 236H28Z" fill="${escapeXml(accent)}" fill-opacity="0.46"/>
      <path d="M28 728H174L206 696H434L466 728H612V744H472L440 712H200L168 744H28Z" fill="${escapeXml(accent)}" fill-opacity="0.58"/>
    </svg>
  `);
};

const buildTitle = plan => {
  const lines = wrapTitle(plan.title);
  const longest = Math.max(...lines.map(line => line.length));
  const fontSize = Math.max(25, Math.min(56, Math.floor(550 / Math.max(8, longest * 0.61))));
  const lineHeight = Math.round(fontSize * 1.08);
  const firstY = 70 - ((lines.length - 1) * lineHeight) / 2;
  const tspans = lines.map((line, index) => (
    `<tspan x="320" y="${Math.round(firstY + index * lineHeight)}">${escapeXml(line)}</tspan>`
  )).join('');
  return Buffer.from(`
    <svg width="640" height="190" xmlns="http://www.w3.org/2000/svg">
      <text text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="${fontSize}" font-weight="800"
        fill="#ffffff" stroke="#05070d" stroke-width="7" paint-order="stroke fill" letter-spacing="1">${tspans}</text>
      <text x="320" y="164" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="18" font-weight="700"
        fill="${escapeXml(plan.entry.colors[2])}" stroke="#05070d" stroke-width="3" paint-order="stroke fill">ORIGINAL FAN-MADE GAME ART</text>
    </svg>
  `);
};

const renderCell = async ({ validation, preferredCell, width, height }) => {
  const cell = validation.cells[preferredCell] || validation.cells.find(candidate => candidate.visiblePixels > 0);
  if (!cell?.bounds) throw new Error(`${validation.filePath}: no occupied source cell is available.`);
  return sharp(validation.filePath, { animated: false, failOn: 'error' })
    .extract(cell.bounds)
    .resize(width, height, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.nearest
    })
    .png()
    .toBuffer();
};

const composeBooster = async (plan, validations) => {
  const background = await buildPixelBackground(plan);
  const worldBoss = await renderCell({
    validation: validations.get(plan.sources[3].filePath),
    preferredCell: plan.sources[3].preferredCell,
    width: 460,
    height: 430
  });
  const heroes = [];
  for (let index = 0; index < 3; index += 1) {
    heroes.push(await renderCell({
      validation: validations.get(plan.sources[index].filePath),
      preferredCell: plan.sources[index].preferredCell,
      width: 220,
      height: 310
    }));
  }
  const output = await sharp(background)
    .composite([
      { input: buildOverlay(plan), left: 0, top: 0 },
      { input: worldBoss, left: 90, top: 245 },
      { input: heroes[0], left: 5, top: 610 },
      { input: heroes[1], left: 210, top: 590 },
      { input: heroes[2], left: 415, top: 610 },
      { input: buildTitle(plan), left: 0, top: 24 }
    ])
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  if (output.length <= MINIMUM_OUTPUT_BYTES) {
    throw new Error(`${plan.universe}: composed output is only ${output.length} bytes; expected more than 50 KB.`);
  }
  const metadata = await sharp(output, { failOn: 'error' }).metadata();
  if (metadata.format !== 'webp' || metadata.width !== BOOSTER_WIDTH || metadata.height !== BOOSTER_HEIGHT) {
    throw new Error(`${plan.universe}: generated booster is not a 640x960 WebP.`);
  }
  return output;
};

const inspectExistingBooster = async plan => {
  const source = await readFile(plan.outputPath);
  const metadata = await sharp(source, { failOn: 'error' }).metadata();
  if (
    metadata.format !== 'webp'
    || metadata.width !== BOOSTER_WIDTH
    || metadata.height !== BOOSTER_HEIGHT
    || source.length <= MINIMUM_OUTPUT_BYTES
  ) {
    throw new Error(`${plan.universe}: existing booster is invalid; rerun with --force after reviewing it.`);
  }
  return source;
};

const main = async () => {
  const { force, universes } = parseArguments(process.argv.slice(2));
  if (force) {
    throw new Error(
      'Derived sprite-composite boosters are disabled. Runtime booster art must be an independently generated and visually reviewed OpenAI foil-pack asset.'
    );
  }
  const allPlans = makePlans(CANON_ROSTER_WAVE);
  const requestedUniverses = new Set(universes);
  const plans = requestedUniverses.size === 0
    ? allPlans
    : allPlans.filter(plan => requestedUniverses.has(plan.universe));
  const missingUniverses = [...requestedUniverses].filter(universe => (
    !allPlans.some(plan => plan.universe === universe)
  ));
  if (missingUniverses.length > 0) {
    throw new Error(`Unknown canon roster universe filter(s): ${missingUniverses.join(', ')}`);
  }
  const validations = await preflightSources(plans);
  const outputs = [];

  for (const plan of plans) {
    if (!force && await exists(plan.outputPath)) {
      outputs.push({ plan, source: await inspectExistingBooster(plan), action: 'skipped' });
    } else if (force) {
      outputs.push({ plan, source: await composeBooster(plan, validations), action: 'written' });
    } else {
      throw new Error(
        `${plan.universe}: missing independently generated OpenAI booster at ${plan.outputPath}. `
        + 'The sprite-composite fallback is intentionally disabled.'
      );
    }
  }

  const hashOwners = new Map();
  for (const output of outputs) {
    const digest = sha256(output.source);
    const owner = hashOwners.get(digest);
    if (owner) {
      throw new Error(`Booster output for ${output.plan.universe} duplicates ${owner}; no new booster was written.`);
    }
    hashOwners.set(digest, output.plan.universe);
  }

  await mkdir(boosterDirectory, { recursive: true });
  for (const output of outputs.filter(item => item.action === 'written')) {
    await writeFile(output.plan.outputPath, output.source, { flag: force ? 'w' : 'wx' });
  }

  console.log(JSON.stringify({
    status: 'approved',
    source: 'independently-generated-openai-booster-art',
    rightsTreatment: 'original fan-made OpenAI game art only; no official bitmap asset used',
    force,
    written: outputs.filter(output => output.action === 'written').map(output => (
      `/boosters/${path.basename(output.plan.outputPath)}`
    )),
    skipped: outputs.filter(output => output.action === 'skipped').map(output => (
      `/boosters/${path.basename(output.plan.outputPath)}`
    ))
  }, null, 2));
};

await main();
