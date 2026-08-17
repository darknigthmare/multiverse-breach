import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';

const EXPECTED_SHEET_COUNT = CANON_ROSTER_WAVE.length * 10;
const SHEET_SIZE = 1024;
const CELL_SIZE = 256;
const CELL_COLUMNS = 4;
const CELL_ROWS = 4;
const CELL_GUARD_PIXELS = 12;
const VISIBLE_ALPHA_THRESHOLD = 0;
const CHROMA_CHANNEL_TOLERANCE = 32;

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const threatName = threat => typeof threat === 'string' ? threat : threat?.name;

const parseArguments = argv => {
  let reportMissing = false;
  const universes = [];
  for (const argument of argv) {
    if (argument === '--report-missing') {
      reportMissing = true;
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
  return { reportMissing, universes };
};

const makeExpectedSheet = ({ kind, universe, id, name }) => {
  const universeSlug = slugify(universe);
  const entitySlug = slugify(kind === 'hero' ? id : name);
  const directory = kind === 'hero' ? 'heroes' : 'bosses';
  const publicPath = `/sprites/generated/${directory}/${universeSlug}/${entitySlug}.png`;
  return {
    kind,
    universe,
    id: kind === 'hero' ? id : undefined,
    name,
    publicPath,
    filePath: path.join(repositoryRoot, 'public', ...publicPath.split('/').filter(Boolean))
  };
};

const collectExpectedSheets = (wave, expectedSheetCount = EXPECTED_SHEET_COUNT) => {
  if (!Array.isArray(wave)) throw new Error('CANON_ROSTER_WAVE must be an array.');
  const sheets = [];
  for (const entry of wave) {
    const universe = String(entry?.universe || '').trim();
    if (!universe) throw new Error('Every canon roster entry must declare a universe.');

    const heroes = [entry.hero, ...(entry.allies || [])];
    for (const hero of heroes) {
      if (!Array.isArray(hero) || !String(hero[0] || '').trim() || !String(hero[1] || '').trim()) {
        throw new Error(`${universe}: every hero tuple must provide a non-empty id and name.`);
      }
      sheets.push(makeExpectedSheet({
        kind: 'hero',
        universe,
        id: hero[0],
        name: hero[1]
      }));
    }

    const threatGroups = [
      ['enemy', entry.monsters || []],
      ['boss', entry.bosses || []],
      ['worldBoss', entry.worldBoss == null ? [] : [entry.worldBoss]]
    ];
    for (const [kind, threats] of threatGroups) {
      for (const threat of threats) {
        const name = String(threatName(threat) || '').trim();
        if (!name) throw new Error(`${universe}: every ${kind} must provide a non-empty name.`);
        sheets.push(makeExpectedSheet({ kind, universe, name }));
      }
    }
  }

  if (sheets.length !== expectedSheetCount) {
    throw new Error(
      `Selected canon roster wave must resolve to exactly ${expectedSheetCount} sprite sheets; found ${sheets.length}.`
    );
  }
  const paths = sheets.map(sheet => sheet.publicPath);
  if (new Set(paths).size !== paths.length) {
    const seen = new Set();
    const duplicates = [...new Set(paths.filter(publicPath => {
      if (seen.has(publicPath)) return true;
      seen.add(publicPath);
      return false;
    }))];
    throw new Error(`Duplicate expected sprite paths: ${duplicates.join(', ')}`);
  }
  return sheets;
};

const fileExists = async filePath => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const isNearChromaGreen = (red, green, blue) => (
  red <= CHROMA_CHANNEL_TOLERANCE
  && green >= 255 - CHROMA_CHANNEL_TOLERANCE
  && blue <= CHROMA_CHANNEL_TOLERANCE
);

const isNearChromaMagenta = (red, green, blue) => (
  red >= 255 - CHROMA_CHANNEL_TOLERANCE
  && green <= CHROMA_CHANNEL_TOLERANCE
  && blue >= 255 - CHROMA_CHANNEL_TOLERANCE
);

const hashCell = ({ data, width, channels, row, column }) => {
  const hash = createHash('sha256');
  const left = column * CELL_SIZE;
  const top = row * CELL_SIZE;
  for (let y = top; y < top + CELL_SIZE; y += 1) {
    const start = (y * width + left) * channels;
    hash.update(data.subarray(start, start + CELL_SIZE * channels));
  }
  return hash.digest('hex');
};

const inspectSheet = async expected => {
  const source = await readFile(expected.filePath);
  const fileSha256 = createHash('sha256').update(source).digest('hex');
  const image = sharp(source, { animated: false, failOn: 'error' });
  const metadata = await image.metadata();
  const errors = [];

  if (metadata.format !== 'png') errors.push(`format is ${metadata.format || 'unknown'}, expected png`);
  if (metadata.width !== SHEET_SIZE || metadata.height !== SHEET_SIZE) {
    errors.push(`dimensions are ${metadata.width || 0}x${metadata.height || 0}, expected 1024x1024`);
  }
  if (metadata.channels !== 4 || metadata.hasAlpha !== true) {
    errors.push(`channels are ${metadata.channels || 0} with hasAlpha=${Boolean(metadata.hasAlpha)}, expected RGBA`);
  }

  const report = {
    ...expected,
    filePath: path.relative(repositoryRoot, expected.filePath).replaceAll('\\', '/'),
    fileSha256,
    dimensions: `${metadata.width || 0}x${metadata.height || 0}`,
    channels: metadata.channels || 0,
    occupiedCells: 0,
    uniqueCellHashes: 0,
    minimumCellGuard: null,
    hiddenRgbPixels: 0,
    chromaGreenPixels: 0,
    chromaMagentaPixels: 0,
    errors
  };

  if (metadata.width !== SHEET_SIZE || metadata.height !== SHEET_SIZE || metadata.channels !== 4) {
    return report;
  }

  const { data, info } = await sharp(source, { animated: false, failOn: 'error' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.width !== SHEET_SIZE || info.height !== SHEET_SIZE || info.channels !== 4) {
    errors.push(`decoded raster is ${info.width}x${info.height}x${info.channels}, expected 1024x1024x4`);
    return report;
  }

  const occupiedCells = [];
  const cellHashes = [];
  let minimumCellGuard = CELL_SIZE;
  for (let row = 0; row < CELL_ROWS; row += 1) {
    for (let column = 0; column < CELL_COLUMNS; column += 1) {
      const left = column * CELL_SIZE;
      const top = row * CELL_SIZE;
      let visiblePixels = 0;
      let minX = CELL_SIZE;
      let minY = CELL_SIZE;
      let maxX = -1;
      let maxY = -1;
      let guardViolations = 0;

      for (let y = 0; y < CELL_SIZE; y += 1) {
        for (let x = 0; x < CELL_SIZE; x += 1) {
          const offset = ((top + y) * info.width + left + x) * info.channels;
          const red = data[offset];
          const green = data[offset + 1];
          const blue = data[offset + 2];
          const alpha = data[offset + 3];
          if (alpha === 0 && (red !== 0 || green !== 0 || blue !== 0)) report.hiddenRgbPixels += 1;
          if (alpha <= VISIBLE_ALPHA_THRESHOLD) continue;

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
          ) guardViolations += 1;
          if (isNearChromaGreen(red, green, blue)) report.chromaGreenPixels += 1;
          if (isNearChromaMagenta(red, green, blue)) report.chromaMagentaPixels += 1;
        }
      }

      const cellIndex = row * CELL_COLUMNS + column + 1;
      if (visiblePixels > 0) {
        occupiedCells.push(cellIndex);
        minimumCellGuard = Math.min(
          minimumCellGuard,
          minX,
          minY,
          CELL_SIZE - 1 - maxX,
          CELL_SIZE - 1 - maxY
        );
      }
      if (guardViolations > 0) {
        errors.push(`cell ${cellIndex} has ${guardViolations} visible pixels inside its 12px transparent guard`);
      }
      cellHashes.push(hashCell({ data, width: info.width, channels: info.channels, row, column }));
    }
  }

  report.occupiedCells = occupiedCells.length;
  report.uniqueCellHashes = new Set(cellHashes).size;
  report.minimumCellGuard = occupiedCells.length > 0 ? minimumCellGuard : null;
  if (report.occupiedCells !== CELL_COLUMNS * CELL_ROWS) {
    errors.push(`only ${report.occupiedCells}/16 cells are occupied`);
  }
  if (report.uniqueCellHashes !== CELL_COLUMNS * CELL_ROWS) {
    errors.push(`only ${report.uniqueCellHashes}/16 exact pixel cell hashes are distinct`);
  }
  if (report.hiddenRgbPixels > 0) {
    errors.push(`${report.hiddenRgbPixels} fully transparent pixels retain hidden RGB data`);
  }
  if (report.chromaGreenPixels > 0) {
    errors.push(`${report.chromaGreenPixels} visible pixels retain near-green chroma residue`);
  }
  if (report.chromaMagentaPixels > 0) {
    errors.push(`${report.chromaMagentaPixels} visible pixels retain near-magenta chroma residue`);
  }
  return report;
};

const audit = async ({ reportMissing, universes }) => {
  const requestedUniverses = new Set(universes);
  const selectedWave = requestedUniverses.size === 0
    ? CANON_ROSTER_WAVE
    : CANON_ROSTER_WAVE.filter(entry => requestedUniverses.has(entry.universe));
  const missingUniverses = [...requestedUniverses].filter(universe => (
    !CANON_ROSTER_WAVE.some(entry => entry.universe === universe)
  ));
  if (missingUniverses.length > 0) {
    throw new Error(`Unknown canon roster universe filter(s): ${missingUniverses.join(', ')}`);
  }
  const expectedSheetCount = requestedUniverses.size === 0
    ? EXPECTED_SHEET_COUNT
    : selectedWave.length * 10;
  const expectedSheets = collectExpectedSheets(selectedWave, expectedSheetCount);
  const missing = [];
  const sheets = [];
  for (const expected of expectedSheets) {
    if (!await fileExists(expected.filePath)) {
      missing.push({
        kind: expected.kind,
        universe: expected.universe,
        id: expected.id,
        name: expected.name,
        publicPath: expected.publicPath
      });
      continue;
    }
    try {
      sheets.push(await inspectSheet(expected));
    } catch (error) {
      sheets.push({
        kind: expected.kind,
        universe: expected.universe,
        id: expected.id,
        name: expected.name,
        publicPath: expected.publicPath,
        errors: [`cannot decode PNG: ${error.message}`]
      });
    }
  }

  const hashOwners = new Map();
  for (const sheet of sheets) {
    if (!sheet.fileSha256) continue;
    const owners = hashOwners.get(sheet.fileSha256) || [];
    owners.push(sheet.publicPath);
    hashOwners.set(sheet.fileSha256, owners);
  }
  const duplicateFileHashes = [...hashOwners.entries()]
    .filter(([, owners]) => owners.length > 1)
    .map(([sha256, owners]) => ({ sha256, publicPaths: owners }));
  for (const duplicate of duplicateFileHashes) {
    for (const sheet of sheets.filter(item => duplicate.publicPaths.includes(item.publicPath))) {
      sheet.errors.push(`file SHA-256 is duplicated by ${duplicate.publicPaths.filter(pathname => pathname !== sheet.publicPath).join(', ')}`);
    }
  }

  const invalid = sheets.filter(sheet => sheet.errors.length > 0);
  const failure = invalid.length > 0 || (!reportMissing && missing.length > 0);
  const report = {
    id: 'multiverse-breach.canon-roster-sprite-audit',
    status: failure ? 'failed' : missing.length > 0 ? 'incomplete' : 'approved',
    mode: reportMissing ? 'report-missing' : 'require-complete',
    expected: expectedSheetCount,
    present: sheets.length,
    valid: sheets.length - invalid.length,
    missingCount: missing.length,
    invalidCount: invalid.length,
    duplicateFileHashCount: duplicateFileHashes.length,
    contract: {
      dimensions: '1024x1024',
      channels: 'RGBA',
      cells: '4x4 of 256x256',
      occupiedCells: 16,
      distinctExactPixelCellHashes: 16,
      transparentCellGuardPixels: CELL_GUARD_PIXELS,
      hiddenRgbUnderAlphaZero: 0,
      visibleNearChromaGreenPixels: 0,
      visibleNearChromaMagentaPixels: 0,
      duplicateFileSha256: 0
    },
    missing,
    invalid: invalid.map(sheet => ({
      kind: sheet.kind,
      universe: sheet.universe,
      id: sheet.id,
      name: sheet.name,
      publicPath: sheet.publicPath,
      errors: sheet.errors
    })),
    duplicateFileHashes,
    sheets
  };
  console.log(JSON.stringify(report, null, 2));
  if (failure) process.exitCode = 1;
};

const options = parseArguments(process.argv.slice(2));
await audit(options);
