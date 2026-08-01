import {
  existsSync,
  readFileSync,
  readdirSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  DEFAULT_COSMETIC_UNIVERSE_ROOT,
  REQUIRED_COSMETIC_WEBPS
} from './syncCosmeticVisualCatalog.mjs';

export const CELL_GUARD_PIXELS = 12;
export const DEFAULT_GUARD_ALPHA_THRESHOLD = 16;
export const ATLAS_WIDTH = 1024;
export const ATLAS_HEIGHT = 256;
export const CELL_SIZE = 256;
export const CELL_COUNT = 4;

const DOSSIER_FILE = 'reference-dossier.json';
const P3_PORTAL_FILE = 'portal-effects-atlas-p3.webp';
const REQUIRED_PACK_FILES = Object.freeze([
  DOSSIER_FILE,
  ...Object.values(REQUIRED_COSMETIC_WEBPS).map(({ file }) => file)
]);
const STATIC_ATLAS_FILES = Object.freeze([
  Object.freeze({ kind: 'ko', file: 'ko-effects-atlas.webp' }),
  Object.freeze({ kind: 'intro', file: 'intro-poses-atlas.webp' }),
  Object.freeze({ kind: 'victory', file: 'victory-poses-atlas.webp' })
]);

const normalizedPath = value => String(value).replaceAll('\\', '/');

const parsePositiveInteger = (value, flag) => {
  if (!/^\d+$/.test(String(value || '')) || Number(value) < 1) {
    throw new Error(`${flag} must be a positive integer.`);
  }
  return Number(value);
};

export const parseCosmeticAtlasCellGuardArguments = argv => {
  const options = {
    guardAlphaThreshold: DEFAULT_GUARD_ALPHA_THRESHOLD,
    help: false,
    requiredCompleteCount: null,
    universes: []
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help') {
      options.help = true;
      continue;
    }
    if (argument === '--universe') {
      const universe = String(argv[index + 1] || '').trim();
      if (!universe || universe.startsWith('--')) {
        throw new Error('--universe requires an exact universe name or slug.');
      }
      options.universes.push(universe);
      index += 1;
      continue;
    }
    if (argument === '--guard-alpha-threshold') {
      const value = argv[index + 1];
      if (!/^\d+$/.test(String(value || '')) || Number(value) > 16) {
        throw new Error('--guard-alpha-threshold must be an integer from 0 to 16.');
      }
      options.guardAlphaThreshold = Number(value);
      index += 1;
      continue;
    }
    if (argument.startsWith('--guard-alpha-threshold=')) {
      const value = argument.slice('--guard-alpha-threshold='.length);
      if (!/^\d+$/.test(value) || Number(value) > 16) {
        throw new Error('--guard-alpha-threshold must be an integer from 0 to 16.');
      }
      options.guardAlphaThreshold = Number(value);
      continue;
    }
    if (argument.startsWith('--universe=')) {
      const universe = argument.slice('--universe='.length).trim();
      if (!universe) throw new Error('--universe requires an exact universe name or slug.');
      options.universes.push(universe);
      continue;
    }
    if (argument === '--require-complete') {
      const next = argv[index + 1];
      if (next && /^\d+$/.test(next)) {
        options.requiredCompleteCount = parsePositiveInteger(next, '--require-complete');
        index += 1;
      } else {
        options.requiredCompleteCount = 380;
      }
      continue;
    }
    if (argument.startsWith('--require-complete=')) {
      options.requiredCompleteCount = parsePositiveInteger(
        argument.slice('--require-complete='.length),
        '--require-complete'
      );
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  options.universes = [...new Set(options.universes)];
  return options;
};

export const collectCompleteAtlasGuardPacks = (
  universeRoot = DEFAULT_COSMETIC_UNIVERSE_ROOT
) => {
  if (!existsSync(universeRoot)) return { packs: [], incompleteSlugs: [], scanErrors: [] };
  const packs = [];
  const incompleteSlugs = [];
  const scanErrors = [];
  for (const directory of readdirSync(universeRoot, { withFileTypes: true })) {
    if (!directory.isDirectory()) continue;
    const slug = directory.name;
    const packDirectory = path.join(universeRoot, slug);
    const files = new Set(
      readdirSync(packDirectory, { withFileTypes: true })
        .filter(entry => entry.isFile())
        .map(entry => entry.name)
    );
    if (REQUIRED_PACK_FILES.some(file => !files.has(file))) {
      incompleteSlugs.push(slug);
      continue;
    }
    try {
      const dossier = JSON.parse(readFileSync(path.join(packDirectory, DOSSIER_FILE), 'utf8'));
      const universe = String(dossier?.universeKey || '').trim();
      if (!universe) throw new Error('dossier universeKey is required');
      packs.push({
        universe,
        slug,
        directory: packDirectory,
        portalFile: files.has(P3_PORTAL_FILE)
          ? P3_PORTAL_FILE
          : REQUIRED_COSMETIC_WEBPS.portalEffect.file
      });
    } catch (error) {
      scanErrors.push({ slug, message: error.message });
    }
  }
  packs.sort((left, right) => left.universe.localeCompare(right.universe, 'en'));
  incompleteSlugs.sort((left, right) => left.localeCompare(right, 'en'));
  return { packs, incompleteSlugs, scanErrors };
};

const guardEdgeBounds = guardPixels => Object.freeze({
  top: Object.freeze({ x: 0, y: 0, width: CELL_SIZE, height: guardPixels }),
  right: Object.freeze({
    x: CELL_SIZE - guardPixels,
    y: 0,
    width: guardPixels,
    height: CELL_SIZE
  }),
  bottom: Object.freeze({
    x: 0,
    y: CELL_SIZE - guardPixels,
    width: CELL_SIZE,
    height: guardPixels
  }),
  left: Object.freeze({ x: 0, y: 0, width: guardPixels, height: CELL_SIZE })
});

export const inspectAtlasCellGuards = ({
  data,
  width,
  height,
  channels,
  guardPixels = CELL_GUARD_PIXELS,
  guardAlphaThreshold = DEFAULT_GUARD_ALPHA_THRESHOLD
}) => {
  if (width !== ATLAS_WIDTH || height !== ATLAS_HEIGHT || channels < 4) {
    return {
      status: 'violation',
      dimensions: { width, height, channels },
      expectedDimensions: { width: ATLAS_WIDTH, height: ATLAS_HEIGHT, channels: 4 },
      cells: []
    };
  }
  const edgeBounds = guardEdgeBounds(guardPixels);
  const cells = [];
  for (let column = 0; column < CELL_COUNT; column += 1) {
    const edges = Object.fromEntries(Object.keys(edgeBounds).map(edge => [edge, {
      nonTransparentPixels: 0,
      maximumAlpha: 0,
      firstNonTransparentPixel: null
    }]));
    for (const [edge, bounds] of Object.entries(edgeBounds)) {
      const report = edges[edge];
      for (let y = bounds.y; y < bounds.y + bounds.height; y += 1) {
        for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
          const alpha = data[(y * width + column * CELL_SIZE + x) * channels + 3];
          if (alpha <= guardAlphaThreshold) continue;
          report.nonTransparentPixels += 1;
          report.maximumAlpha = Math.max(report.maximumAlpha, alpha);
          report.firstNonTransparentPixel ||= { x, y, alpha };
        }
      }
    }
    const violatingEdges = Object.entries(edges)
      .filter(([, report]) => report.nonTransparentPixels > 0)
      .map(([edge]) => edge);
    cells.push({
      column,
      status: violatingEdges.length === 0 ? 'ok' : 'violation',
      violatingEdges,
      edges
    });
  }
  return {
    status: cells.every(cell => cell.status === 'ok') ? 'ok' : 'violation',
    dimensions: { width, height, channels },
    expectedDimensions: { width: ATLAS_WIDTH, height: ATLAS_HEIGHT, channels: 4 },
    cells
  };
};

const inspectAtlasFile = async ({
  kind,
  file,
  filePath,
  guardPixels,
  guardAlphaThreshold
}) => {
  try {
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return {
      kind,
      file,
      ...inspectAtlasCellGuards({
        data,
        width: info.width,
        height: info.height,
        channels: info.channels,
        guardPixels,
        guardAlphaThreshold
      })
    };
  } catch (error) {
    return {
      kind,
      file,
      status: 'violation',
      decodeError: error.message,
      cells: []
    };
  }
};

export const auditCosmeticAtlasCellGuards = async ({
  universeRoot = DEFAULT_COSMETIC_UNIVERSE_ROOT,
  universes = [],
  requiredCompleteCount = null,
  guardPixels = CELL_GUARD_PIXELS,
  guardAlphaThreshold = DEFAULT_GUARD_ALPHA_THRESHOLD
} = {}) => {
  const scan = collectCompleteAtlasGuardPacks(universeRoot);
  const requested = new Set(universes.map(value => value.toLowerCase()));
  const selectedPacks = requested.size === 0
    ? scan.packs
    : scan.packs.filter(pack => (
      requested.has(pack.universe.toLowerCase()) || requested.has(pack.slug.toLowerCase())
    ));
  const matchedFilters = new Set();
  for (const pack of selectedPacks) {
    for (const filter of requested) {
      if (filter === pack.universe.toLowerCase() || filter === pack.slug.toLowerCase()) {
        matchedFilters.add(filter);
      }
    }
  }
  const globalViolations = scan.scanErrors.map(error => ({ type: 'scan-error', ...error }));
  if (requiredCompleteCount !== null && scan.packs.length !== requiredCompleteCount) {
    globalViolations.push({
      type: 'required-complete-count',
      expected: requiredCompleteCount,
      actual: scan.packs.length
    });
  }
  for (const filter of requested) {
    if (!matchedFilters.has(filter)) {
      globalViolations.push({ type: 'universe-filter-no-match', filter });
    }
  }

  const packReports = [];
  for (const pack of selectedPacks) {
    const atlasFiles = [
      { kind: 'portal', file: pack.portalFile },
      ...STATIC_ATLAS_FILES
    ];
    const atlases = await Promise.all(atlasFiles.map(atlas => inspectAtlasFile({
      ...atlas,
      filePath: path.join(pack.directory, atlas.file),
      guardPixels,
      guardAlphaThreshold
    })));
    packReports.push({
      universe: pack.universe,
      slug: pack.slug,
      status: atlases.every(atlas => atlas.status === 'ok') ? 'ok' : 'violation',
      atlases
    });
  }

  const atlases = packReports.flatMap(pack => pack.atlases);
  const cells = atlases.flatMap(atlas => atlas.cells || []);
  const violatingPacks = packReports.filter(pack => pack.status !== 'ok');
  const violatingAtlases = atlases.filter(atlas => atlas.status !== 'ok');
  const violatingCells = cells.filter(cell => cell.status !== 'ok');
  const edgeViolations = violatingCells.reduce(
    (sum, cell) => sum + cell.violatingEdges.length,
    0
  );
  const status = globalViolations.length === 0 && violatingPacks.length === 0
    ? 'ok'
    : 'violation';
  return {
    schemaVersion: 1,
    id: 'multiverse-breach.cosmetic-atlas-cell-guard-audit',
    status,
    contract: {
      atlasDimensions: `${ATLAS_WIDTH}x${ATLAS_HEIGHT}`,
      columns: CELL_COUNT,
      cellDimensions: `${CELL_SIZE}x${CELL_SIZE}`,
      transparentGuardPixels: guardPixels,
      guardAlphaThreshold,
      alphaRule: `alpha <= ${guardAlphaThreshold} is transparent; alpha >= ${guardAlphaThreshold + 1} violates the guard`
    },
    filters: {
      universes,
      requiredCompleteCount,
      guardAlphaThreshold
    },
    summary: {
      completePacks: scan.packs.length,
      incompletePacks: scan.incompleteSlugs.length,
      selectedPacks: packReports.length,
      atlasesAudited: atlases.length,
      cellsAudited: cells.length,
      passingPacks: packReports.length - violatingPacks.length,
      violatingPacks: violatingPacks.length,
      violatingAtlases: violatingAtlases.length,
      violatingCells: violatingCells.length,
      edgeViolations,
      globalViolations: globalViolations.length
    },
    root: normalizedPath(path.resolve(universeRoot)),
    incompleteSlugs: scan.incompleteSlugs,
    globalViolations,
    packs: packReports
  };
};

const usage = [
  'Usage: node scripts/cosmeticAtlasCellGuardAudit.mjs [options]',
  '  --universe <name-or-slug>  Repeatable exact pack filter',
  '  --guard-alpha-threshold N  Treat alpha <= N as transparent (0-16; default 16)',
  '  --require-complete[=N]     Require N complete packs; bare flag requires 380'
].join('\n');

const run = async () => {
  try {
    const options = parseCosmeticAtlasCellGuardArguments(process.argv.slice(2));
    if (options.help) {
      console.log(usage);
      return;
    }
    const report = await auditCosmeticAtlasCellGuards(options);
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== 'ok') process.exitCode = 1;
  } catch (error) {
    console.log(JSON.stringify({
      schemaVersion: 1,
      id: 'multiverse-breach.cosmetic-atlas-cell-guard-audit',
      status: 'error',
      message: error.message
    }, null, 2));
    process.exitCode = 2;
  }
};

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await run();
