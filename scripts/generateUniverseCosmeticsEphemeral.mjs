#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import {
  access,
  cp,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  statfs,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

export const DEFAULT_CODEX_DESKTOP_EXE = String.raw`C:\Users\chuck\AppData\Local\OpenAI\Codex\bin\d7e8094cfb76a267\codex.exe`;
export const MINIMUM_SYSTEM_DISK_FREE_BYTES = 5n * 1024n * 1024n * 1024n;
export const DEFAULT_CELL_GUARD_PIXELS = 24;
export const MINIMUM_CELL_GUARD_PIXELS = 12;
export const DEFAULT_GUARD_ALPHA_THRESHOLD = 16;
export const DEFAULT_UI_ROW_GUARD_PIXELS = 12;
export const EXPECTED_WEBP_FILES = Object.freeze([
  'hud-theme.webp',
  'intro-poses-atlas.webp',
  'ko-effects-atlas.webp',
  'portal-effects-atlas.webp',
  'profile-banner.webp',
  'profile-title.webp',
  'victory-poses-atlas.webp'
]);

const defaultManifestPath = path.join(
  projectRoot,
  'tmp',
  'imagegen',
  'universe-cosmetics',
  'manifest.json'
);
const defaultLedgerPath = path.join(
  projectRoot,
  'tmp',
  'imagegen',
  'universe-cosmetics',
  'ledger.json'
);
const rejectedBackupRoot = path.join(
  projectRoot,
  'tmp',
  'imagegen',
  'universe-cosmetics',
  'rejected-backups'
);
const finalRoot = path.join(
  projectRoot,
  'public',
  'visuals',
  'cosmetics',
  'openai',
  'universes'
);
const atlasProcessorPath = path.join(projectRoot, 'scripts', 'processUniverseCosmeticAtlas.py');
const atlasNormalizerPath = path.join(projectRoot, 'scripts', 'normalizeUniverseCosmeticAtlas.py');
const codeHome = process.env.CODEX_HOME
  ? path.resolve(process.env.CODEX_HOME)
  : path.join(process.env.USERPROFILE || process.env.HOME || '', '.codex');
const defaultChromaHelperPath = path.join(
  codeHome,
  'skills',
  '.system',
  'imagegen',
  'scripts',
  'remove_chroma_key.py'
);

const HELP = `Usage:
  node scripts/generateUniverseCosmeticsEphemeral.mjs --manifest <manifest.json> [options]

Options:
  --universe <name-or-slug>  Process one universe; may be repeated
  --limit <count>            Limit the selected jobs
  --resume                   Skip jobs already complete in the ledger
  --require-lead-reference   Select only jobs with an approved leadReferencePath
  --allow-unresearched       Allow jobs explicitly marked needsWebResearch=true
  --replace-existing         Safely replace existing packs for explicit --universe filters only
  --cell-guard <12-64>       Transparent guard inside animation cells (default: 24px)
  --guard-alpha-threshold <0-16>
                             Maximum chroma-residue alpha treated as transparent (default: 16)
  --ui-row-guard <12-64>     Vertical transparent guard for UI rows 0-1 (default: 12px)
  --reuse-failed-artifact    Reprocess a retained failed alpha atlas; explicit --universe only
  --input-atlas <absolute-png>
                             Process one existing raw atlas without Codex/ImageGen
  --no-normalize-atlas       Disable geometric six-band normalization (enabled by default)
  --concurrency <1-4>        Concurrent ephemeral workers (default: 1)
  --ledger <path>            Resume ledger (default: tmp/imagegen/universe-cosmetics/ledger.json)
  --temp-root <path>         Intermediate root (default: E: when it has 5 GiB, otherwise tmp)
  --help                     Show this help

Environment:
  CODEX_DESKTOP_EXE                  Codex Desktop executable override
  UNIVERSE_COSMETICS_TEMP_ROOT       Intermediate root override
  PYTHON_EXE                         Python executable (default: python)
  IMAGEGEN_CHROMA_HELPER             remove_chroma_key.py override
`;

export const slugify = (value) => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

export const buildLedgerRunNamespace = (ledgerPath, manifestHash) => createHash('sha256')
  .update(path.resolve(ledgerPath))
  .update('\0')
  .update(manifestHash)
  .digest('hex')
  .slice(0, 16);

export const buildJobRoot = ({ tempRoot, runNamespace, slug, attempt }) => {
  if (!/^[a-f0-9]{8,64}$/.test(runNamespace)) {
    throw new Error('Invalid ledger run namespace');
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid job slug');
  if (!Number.isInteger(attempt) || attempt < 1) throw new Error('Invalid job attempt');
  return path.join(path.resolve(tempRoot), 'runs', runNamespace, slug, `attempt-${attempt}`);
};

const parsePositiveInteger = (value, label, maximum = Number.MAX_SAFE_INTEGER) => {
  if (!/^\d+$/.test(String(value))) {
    throw new Error(`${label} must be a positive integer`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new Error(`${label} must be between 1 and ${maximum}`);
  }
  return parsed;
};

const takeValue = (argv, index, flag) => {
  const argument = argv[index];
  const equalsIndex = argument.indexOf('=');
  if (equalsIndex !== -1) {
    const value = argument.slice(equalsIndex + 1);
    if (!value) throw new Error(`${flag} requires a value`);
    return { value, nextIndex: index };
  }
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
  return { value, nextIndex: index + 1 };
};

export const parseArguments = (argv) => {
  const options = {
    manifestPath: defaultManifestPath,
    ledgerPath: defaultLedgerPath,
    universes: [],
    concurrency: 1,
    limit: null,
    resume: false,
    requireLeadReference: false,
    allowUnresearched: false,
    replaceExisting: false,
    cellGuardPixels: DEFAULT_CELL_GUARD_PIXELS,
    guardAlphaThreshold: DEFAULT_GUARD_ALPHA_THRESHOLD,
    uiRowGuardPixels: DEFAULT_UI_ROW_GUARD_PIXELS,
    reuseFailedArtifact: false,
    inputAtlasPath: null,
    normalizeAtlas: true,
    tempRoot: process.env.UNIVERSE_COSMETICS_TEMP_ROOT || null,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help') {
      options.help = true;
      continue;
    }
    if (argument === '--resume') {
      options.resume = true;
      continue;
    }
    if (argument === '--require-lead-reference') {
      options.requireLeadReference = true;
      continue;
    }
    if (argument === '--allow-unresearched') {
      options.allowUnresearched = true;
      continue;
    }
    if (argument === '--replace-existing') {
      options.replaceExisting = true;
      continue;
    }
    if (argument === '--reuse-failed-artifact') {
      options.reuseFailedArtifact = true;
      continue;
    }
    if (argument === '--no-normalize-atlas') {
      options.normalizeAtlas = false;
      continue;
    }
    const [flag] = argument.split('=', 1);
    if (![
      '--manifest',
      '--ledger',
      '--universe',
      '--concurrency',
      '--limit',
      '--temp-root',
      '--cell-guard',
      '--guard-alpha-threshold',
      '--ui-row-guard',
      '--input-atlas'
    ].includes(flag)) {
      throw new Error(`Unknown option: ${argument}`);
    }
    const { value, nextIndex } = takeValue(argv, index, flag);
    index = nextIndex;
    if (flag === '--manifest') options.manifestPath = path.resolve(value);
    if (flag === '--ledger') options.ledgerPath = path.resolve(value);
    if (flag === '--universe') options.universes.push(value);
    if (flag === '--concurrency') {
      options.concurrency = parsePositiveInteger(value, '--concurrency', 4);
    }
    if (flag === '--limit') options.limit = parsePositiveInteger(value, '--limit');
    if (flag === '--temp-root') options.tempRoot = path.resolve(value);
    if (flag === '--input-atlas') options.inputAtlasPath = value;
    if (flag === '--cell-guard') {
      options.cellGuardPixels = parsePositiveInteger(value, '--cell-guard', 64);
      if (options.cellGuardPixels < MINIMUM_CELL_GUARD_PIXELS) {
        throw new Error(`--cell-guard must be between ${MINIMUM_CELL_GUARD_PIXELS} and 64`);
      }
    }
    if (flag === '--guard-alpha-threshold') {
      if (!/^\d+$/.test(value)) {
        throw new Error('--guard-alpha-threshold must be between 0 and 16');
      }
      options.guardAlphaThreshold = Number(value);
      if (!Number.isSafeInteger(options.guardAlphaThreshold) || options.guardAlphaThreshold > 16) {
        throw new Error('--guard-alpha-threshold must be between 0 and 16');
      }
    }
    if (flag === '--ui-row-guard') {
      options.uiRowGuardPixels = parsePositiveInteger(value, '--ui-row-guard', 64);
      if (options.uiRowGuardPixels < 12) {
        throw new Error('--ui-row-guard must be between 12 and 64');
      }
    }
  }
  if (options.replaceExisting && options.universes.length === 0 && !options.help) {
    throw new Error('--replace-existing requires at least one explicit --universe filter');
  }
  if (options.reuseFailedArtifact && options.universes.length === 0 && !options.help) {
    throw new Error('--reuse-failed-artifact requires at least one explicit --universe filter');
  }
  if (options.inputAtlasPath && !options.help) {
    if (options.universes.length !== 1) {
      throw new Error('--input-atlas requires exactly one explicit --universe filter');
    }
    if (!path.isAbsolute(options.inputAtlasPath)) {
      throw new Error('--input-atlas must be an absolute local PNG path');
    }
    if (path.extname(options.inputAtlasPath).toLowerCase() !== '.png') {
      throw new Error('--input-atlas accepts PNG files only');
    }
    options.inputAtlasPath = path.resolve(options.inputAtlasPath);
  }
  if (options.inputAtlasPath && options.reuseFailedArtifact) {
    throw new Error('--input-atlas cannot be combined with --reuse-failed-artifact');
  }
  return options;
};

const manifestCandidates = (manifest) => {
  if (Array.isArray(manifest)) return manifest;
  const collection = manifest.jobs
    || manifest.universes
    || manifest.packs
    || manifest.entries
    || manifest.portals;
  if (Array.isArray(collection)) return collection;
  if (collection && typeof collection === 'object') {
    return Object.entries(collection).map(([universe, value]) => ({
      universe,
      ...(value && typeof value === 'object' ? value : {})
    }));
  }
  throw new Error('Manifest must be an array or expose jobs/universes/packs/entries/portals');
};

const firstNonEmptyString = (...values) => values.find(value => (
  typeof value === 'string' && value.trim()
))?.trim();

export const normalizeManifest = (manifest) => {
  const seenSlugs = new Set();
  return manifestCandidates(manifest).map((record, index) => {
    if (!record || typeof record !== 'object') {
      throw new Error(`Manifest job ${index + 1} must be an object`);
    }
    const embeddedDossier = record.dossier && typeof record.dossier === 'object'
      ? record.dossier
      : {};
    const source = { ...embeddedDossier, ...record };
    const universe = firstNonEmptyString(
      source.universeKey,
      source.universeName,
      source.universe,
      source.name,
      source.key
    );
    const prompt = firstNonEmptyString(source.generationPrompt, source.prompt);
    if (!universe) throw new Error(`Manifest job ${index + 1} is missing its universe`);
    if (!prompt) throw new Error(`${universe}: generation prompt is missing`);
    if (source.generationAllowed === false) {
      throw new Error(`${universe}: generationAllowed is false`);
    }
    const slug = firstNonEmptyString(source.slug) || slugify(universe);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`${universe}: invalid slug ${slug}`);
    }
    if (seenSlugs.has(slug)) throw new Error(`Duplicate manifest slug: ${slug}`);
    seenSlugs.add(slug);
    return { universe, slug, prompt, source };
  });
};

export const selectJobs = (jobs, options, ledger = { jobs: {} }) => {
  const filters = new Set(options.universes.map(value => value.toLocaleLowerCase('en')));
  const selected = jobs.filter((job) => {
    if (options.requireLeadReference && !firstNonEmptyString(job.source.leadReferencePath)) {
      return false;
    }
    if (job.source.needsWebResearch === true && !options.allowUnresearched) {
      return false;
    }
    if (filters.size > 0) {
      const matches = filters.has(job.universe.toLocaleLowerCase('en'))
        || filters.has(job.slug.toLocaleLowerCase('en'));
      if (!matches) return false;
    }
    if (
      options.resume
      && ['complete', 'replaced', 'skipped-existing'].includes(ledger.jobs?.[job.slug]?.status)
    ) {
      return false;
    }
    return true;
  });
  return options.limit === null ? selected : selected.slice(0, options.limit);
};

export const resolveSourceMode = ({ inputAtlasPath, reuseFailedArtifact }) => {
  if (inputAtlasPath) return 'local-input';
  if (reuseFailedArtifact) return 'failed-artifact-reuse';
  return 'imagegen-worker';
};

export const buildCodexArguments = (lastMessagePath, leadReferencePath = null) => {
  const args = [
    'exec',
    '--ephemeral',
    '--ignore-user-config',
    '--enable',
    'image_generation',
    '-c',
    'model_reasoning_effort=low',
    '-s',
    'read-only'
  ];
  if (leadReferencePath) {
    if (!path.isAbsolute(leadReferencePath)) {
      throw new Error('The Codex image reference must be an absolute repository path');
    }
    args.push('-i', leadReferencePath);
  }
  args.push(
    '--output-last-message',
    lastMessagePath,
    '-'
  );
  if (args.includes('--json')) throw new Error('Internal error: JSON event streaming is forbidden');
  return args;
};

export const buildWorkerPrompt = (job) => {
  const hasLeadReference = Boolean(job.source?.leadReferencePath);
  const identitySensitiveReference = /\bThread Echo\b/i.test(job.source?.leadHeroName || '')
    || ['movie', 'music', 'series', 'web'].includes(
      String(job.source?.medium || '').trim().toLowerCase()
    );
  const referenceInstructions = hasLeadReference
    ? identitySensitiveReference
      ? `Image 1 is an attached visual reference only, never an edit target. It depicts source material for the approved anonymous lead${job.source.leadHeroName ? ` (${job.source.leadHeroName})` : ''}. In the single image_gen call, include Image 1 as image context/reference (num_last_images_to_include=1), but use it strictly for source-grounded role, costume, carried equipment, palette and broad silhouette. Never reproduce or infer its face, facial geometry, body biometrics, performer identity or real-person likeness; create a wholly original anonymous identity. Generate a new atlas; do not edit Image 1.`
      : `Image 1 is an attached visual reference only, never an edit target. It depicts the approved fictional lead${job.source.leadHeroName ? ` (${job.source.leadHeroName})` : ''}. In the single image_gen call, include Image 1 as image context/reference (num_last_images_to_include=1) so the pose rows reproduce its approved fictional design identity as faithfully as the production prompt permits. Generate a new atlas; do not edit Image 1.`
    : 'No lead image is attached. Do not request image context in the image_gen call.';
  return `You are one isolated OpenAI ImageGen production worker.
Call the built-in image_gen tool exactly once. Do not call image_gen a second time, do not call any other tool, and do not use an API or SDK.
${referenceInstructions}
Pass the production prompt below to that single image_gen call without adding, removing, or creatively changing requirements.
When the tool completes, return exactly one plain-text line containing the absolute local file path selected from the tool result:
OUTPUT_PATH=<absolute-path>
Do not use Markdown and do not include any other text.

--- BEGIN EXACT PRODUCTION PROMPT ---
${job.prompt}
--- END EXACT PRODUCTION PROMPT ---`;
};

export const resolveLeadReferencePath = (referencePath, repositoryRoot = projectRoot) => {
  if (referencePath === null || referencePath === undefined || referencePath === '') return null;
  if (typeof referencePath !== 'string') throw new Error('leadReferencePath must be a string or null');
  const trimmed = referencePath.trim();
  let resolved;
  if (/^[\\/]/.test(trimmed) && !/^[a-z]:[\\/]/i.test(trimmed)) {
    resolved = path.resolve(repositoryRoot, 'public', trimmed.replace(/^[\\/]+/, ''));
  } else {
    resolved = path.isAbsolute(trimmed)
      ? path.resolve(trimmed)
      : path.resolve(repositoryRoot, trimmed);
  }
  const relative = path.relative(repositoryRoot, resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`leadReferencePath must stay inside the repository: ${referencePath}`);
  }
  return resolved;
};

export const parseOutputPath = (message) => {
  const workerMessage = String(message);
  const matches = [...workerMessage.matchAll(/^\s*OUTPUT_PATH\s*=\s*(.+?)\s*$/gmi)];
  if (matches.length !== 1) {
    if (/\b(?:safety|policy)\b.{0,80}\b(?:block(?:ed)?|refus(?:ed|al))\b|\bblock(?:ed)?\b.{0,80}\b(?:safety|policy)\b/is.test(workerMessage)) {
      throw new Error(
        'ImageGen safety blocked: the ephemeral worker did not produce an image path. The failed job remains in the ledger for a prompt-safe retry.'
      );
    }
    throw new Error(`Expected exactly one OUTPUT_PATH line, received ${matches.length}`);
  }
  const outputPath = matches[0][1]
    .trim()
    .replace(/^`(.+)`$/, '$1')
    .replace(/^"(.+)"$/, '$1');
  if (!outputPath || /[\r\n]/.test(outputPath)) throw new Error('OUTPUT_PATH is empty or invalid');
  if (/^(?:UNAVAILABLE(?:_|$)|SAFETY(?:_|$)|POLICY(?:_|$)|BLOCKED(?:_|$))/i.test(outputPath)) {
    throw new Error(
      `ImageGen safety blocked: worker returned ${outputPath}. No pack was promoted; the failed job remains resumable in the ledger.`
    );
  }
  if (!path.isAbsolute(outputPath)) {
    throw new Error(`OUTPUT_PATH must be an absolute local path, received: ${outputPath}`);
  }
  return outputPath;
};

export const assertMinimumFreeSpace = (
  availableBytes,
  minimumBytes = MINIMUM_SYSTEM_DISK_FREE_BYTES
) => {
  const available = BigInt(availableBytes);
  if (available < minimumBytes) {
    const availableGiB = (Number(available) / (1024 ** 3)).toFixed(2);
    throw new Error(`C: has ${availableGiB} GiB free; at least 5.00 GiB is required before every job`);
  }
};

const availableBytes = async (root) => {
  const stats = await statfs(root, { bigint: true });
  return stats.bavail * stats.bsize;
};

const ensureSystemDiskCapacity = async () => {
  assertMinimumFreeSpace(await availableBytes('C:\\'));
};

const selectTempRoot = async (configuredRoot) => {
  if (configuredRoot) return path.resolve(configuredRoot);
  if (process.platform === 'win32') {
    try {
      const free = await availableBytes('E:\\');
      if (free >= MINIMUM_SYSTEM_DISK_FREE_BYTES) {
        return String.raw`E:\Codex-Temp\multiverse-cosmetics`;
      }
    } catch {
      // E: is optional; the workspace tmp fallback remains resumable.
    }
  }
  return path.join(projectRoot, 'tmp', 'imagegen', 'universe-cosmetics', 'work');
};

export const runProcess = ({ command, args, cwd = projectRoot, env = process.env, input = null }) => (
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    let outputTail = '';
    const capture = (chunk, destination) => {
      const text = chunk.toString();
      destination.write(text);
      outputTail = `${outputTail}${text}`.slice(-16_384);
    };
    child.stdout.on('data', chunk => capture(chunk, process.stdout));
    child.stderr.on('data', chunk => capture(chunk, process.stderr));
    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (code === 0) {
        resolve({ code, outputTail });
        return;
      }
      reject(new Error(
        `${path.basename(command)} exited with ${code ?? `signal ${signal}`}\n${outputTail}`
      ));
    });
    if (input === null) child.stdin.end();
    else child.stdin.end(input, 'utf8');
  })
);

const exists = async (target) => access(target).then(() => true, () => false);

const resolveGeneratedPath = (outputPath) => (
  path.isAbsolute(outputPath) ? outputPath : path.resolve(projectRoot, outputPath)
);

const assertGeneratedFile = async (generatedPath) => {
  const details = await stat(generatedPath);
  if (!details.isFile() || details.size < 10_000) {
    throw new Error(`Generated output is not a plausible image file: ${generatedPath}`);
  }
};

const assertCellGuardPixels = (cellGuardPixels) => {
  if (
    !Number.isInteger(cellGuardPixels)
    || cellGuardPixels < MINIMUM_CELL_GUARD_PIXELS
    || cellGuardPixels > 64
  ) {
    throw new Error(
      `Animation cell guard must be between ${MINIMUM_CELL_GUARD_PIXELS} and 64 pixels`
    );
  }
};

const assertGuardAlphaThreshold = (guardAlphaThreshold) => {
  if (
    !Number.isInteger(guardAlphaThreshold)
    || guardAlphaThreshold < 0
    || guardAlphaThreshold > 16
  ) {
    throw new Error('Animation guard alpha threshold must be between 0 and 16');
  }
};

const assertImageDimensions = (metadata, expectedWidth, expectedHeight, label) => {
  if (metadata.width !== expectedWidth || metadata.height !== expectedHeight) {
    throw new Error(
      `${label}: expected exactly ${expectedWidth}x${expectedHeight}, received ${metadata.width}x${metadata.height}`
    );
  }
};

export const validateAtlasSourceDimensions = async (sourcePath) => {
  const source = await readFile(sourcePath);
  const metadata = await sharp(source, { failOn: 'error' }).metadata();
  assertImageDimensions(metadata, 1024, 1536, 'Universe cosmetic atlas source');
  return metadata;
};

const validateCellGuard = ({
  data,
  width,
  channels,
  cellX,
  cellY,
  row,
  column,
  guard,
  alphaThreshold,
  label
}) => {
  const alphaAt = (x, y) => data[(y * width + x) * channels + 3];
  const ranges = [
    { side: 'top', x0: cellX, x1: cellX + 256, y0: cellY, y1: cellY + guard },
    {
      side: 'bottom',
      x0: cellX,
      x1: cellX + 256,
      y0: cellY + 256 - guard,
      y1: cellY + 256
    },
    { side: 'left', x0: cellX, x1: cellX + guard, y0: cellY, y1: cellY + 256 },
    {
      side: 'right',
      x0: cellX + 256 - guard,
      x1: cellX + 256,
      y0: cellY,
      y1: cellY + 256
    }
  ];
  for (const range of ranges) {
    for (let y = range.y0; y < range.y1; y += 1) {
      for (let x = range.x0; x < range.x1; x += 1) {
        const alpha = alphaAt(x, y);
        if (alpha > alphaThreshold) {
          throw new Error(
            `${label}: transparent cell guard violation in row ${row}, column ${column}, ${range.side} edge at (${x},${y}), alpha=${alpha}; allowed chroma residue <=${alphaThreshold}, required guard=${guard}px`
          );
        }
      }
    }
  }
};

const readGuardedImage = async (imagePath, expectedWidth, expectedHeight, label) => {
  const source = await readFile(imagePath);
  const metadata = await sharp(source, { failOn: 'error' }).metadata();
  assertImageDimensions(metadata, expectedWidth, expectedHeight, label);
  if (metadata.hasAlpha !== true) throw new Error(`${label}: alpha channel is required`);
  const { data, info } = await sharp(source, { failOn: 'error' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) throw new Error(`${label}: expected four RGBA channels`);
  return { data, info };
};

const validateUiRowGuards = ({
  data,
  width,
  channels,
  guard,
  alphaThreshold,
  label
}) => {
  if (!Number.isInteger(guard) || guard < 12 || guard > 64) {
    throw new Error('UI row guard must be between 12 and 64 pixels');
  }
  const alphaAt = (x, y) => data[(y * width + x) * channels + 3];
  for (let row = 0; row <= 1; row += 1) {
    const rowY = row * 256;
    const bands = [
      { side: 'top', y0: rowY, y1: rowY + guard },
      { side: 'bottom', y0: rowY + 256 - guard, y1: rowY + 256 }
    ];
    for (const band of bands) {
      for (let y = band.y0; y < band.y1; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const alpha = alphaAt(x, y);
          if (alpha > alphaThreshold) {
            throw new Error(
              `${label}: UI row guard violation in row ${row}, ${band.side} edge at (${x},${y}), alpha=${alpha}; allowed chroma residue <=${alphaThreshold}, required vertical guard=${guard}px`
            );
          }
        }
      }
    }
  }
};

export const validateAlphaAtlasGuards = async (
  alphaAtlasPath,
  cellGuardPixels = DEFAULT_CELL_GUARD_PIXELS,
  guardAlphaThreshold = DEFAULT_GUARD_ALPHA_THRESHOLD,
  uiRowGuardPixels = DEFAULT_UI_ROW_GUARD_PIXELS
) => {
  assertCellGuardPixels(cellGuardPixels);
  assertGuardAlphaThreshold(guardAlphaThreshold);
  const label = 'Universe cosmetic alpha atlas';
  const { data, info } = await readGuardedImage(alphaAtlasPath, 1024, 1536, label);
  validateUiRowGuards({
    data,
    width: info.width,
    channels: info.channels,
    guard: uiRowGuardPixels,
    alphaThreshold: guardAlphaThreshold,
    label
  });
  for (let row = 2; row <= 5; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      validateCellGuard({
        data,
        width: info.width,
        channels: info.channels,
        cellX: column * 256,
        cellY: row * 256,
        row,
        column,
        guard: cellGuardPixels,
        alphaThreshold: guardAlphaThreshold,
        label
      });
    }
  }
};

const animationFinalRows = Object.freeze([
  ['portal-effects-atlas.webp', 2],
  ['ko-effects-atlas.webp', 3],
  ['intro-poses-atlas.webp', 4],
  ['victory-poses-atlas.webp', 5]
]);

export const validateFinalAnimationGuards = async (
  packDirectory,
  cellGuardPixels = DEFAULT_CELL_GUARD_PIXELS,
  guardAlphaThreshold = DEFAULT_GUARD_ALPHA_THRESHOLD
) => {
  assertCellGuardPixels(cellGuardPixels);
  assertGuardAlphaThreshold(guardAlphaThreshold);
  for (const [filename, sourceRow] of animationFinalRows) {
    const label = filename;
    const { data, info } = await readGuardedImage(
      path.join(packDirectory, filename),
      1024,
      256,
      label
    );
    for (let column = 0; column < 4; column += 1) {
      validateCellGuard({
        data,
        width: info.width,
        channels: info.channels,
        cellX: column * 256,
        cellY: 0,
        row: sourceRow,
        column,
        guard: cellGuardPixels,
        alphaThreshold: guardAlphaThreshold,
        label
      });
    }
  }
};

export const validateWebpPack = async (packDirectory) => {
  const entries = await readdir(packDirectory, { withFileTypes: true });
  const webpFiles = entries
    .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === '.webp')
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right, 'en'));
  if (webpFiles.length !== 7 || JSON.stringify(webpFiles) !== JSON.stringify(EXPECTED_WEBP_FILES)) {
    throw new Error(
      `${packDirectory}: expected exactly seven sealed WebPs (${EXPECTED_WEBP_FILES.join(', ')})`
    );
  }
  for (const filename of webpFiles) {
    const details = await stat(path.join(packDirectory, filename));
    if (!details.isFile() || details.size === 0) throw new Error(`${filename}: output is empty`);
  }
  return webpFiles;
};

const cleanObject = value => Object.fromEntries(
  Object.entries(value).filter(([, entry]) => entry !== undefined)
);

export const buildReferenceDossier = (job, manifestMeta = {}) => {
  const source = job.source;
  const officialReferenceUrls = source.officialReferenceUrls || source.referenceUrls;
  const inheritedReview = source.review && typeof source.review === 'object'
    ? source.review
    : {};
  const generatedAt = new Date().toISOString();
  return cleanObject({
    universeKey: job.universe,
    universeName: firstNonEmptyString(source.universeName) || job.universe,
    continuityId: source.continuityId,
    installment: source.installment,
    releaseYear: source.releaseYear,
    medium: source.medium,
    rightsClass: source.rightsClass,
    officialReferenceUrls,
    canonicalMotif: source.canonicalMotif,
    canonicalStage: source.canonicalStage || source.canonicalMotif,
    visualAnchors: source.visualAnchors,
    heroAnchors: source.heroAnchors,
    leadHeroName: source.leadHeroName,
    leadReferencePath: source.leadReferencePath,
    localReferencePaths: source.localReferencePaths,
    motifs: source.motifs,
    materials: source.materials,
    palette: source.palette,
    mustAvoid: source.mustAvoid,
    referenceConfidence: source.referenceConfidence || 'medium',
    generationAllowed: true,
    mode: 'built-in-imagegen-ephemeral-worker',
    sourceManifest: cleanObject({
      id: manifestMeta.id,
      schemaVersion: manifestMeta.schemaVersion,
      promptVersion: manifestMeta.promptVersion
    }),
    review: {
      ...inheritedReview,
      alpha: true,
      distinctFrames: true,
      processedAt: generatedAt
    },
    generationPrompt: job.prompt
  });
};

export const promoteCompletePack = async (
  stagingPack,
  destination,
  {
    cellGuardPixels = DEFAULT_CELL_GUARD_PIXELS,
    guardAlphaThreshold = DEFAULT_GUARD_ALPHA_THRESHOLD
  } = {}
) => {
  const webpFiles = await validateWebpPack(stagingPack);
  await validateFinalAnimationGuards(stagingPack, cellGuardPixels, guardAlphaThreshold);
  const dossierPath = path.join(stagingPack, 'reference-dossier.json');
  await stat(dossierPath);
  if (await exists(destination)) throw new Error(`Refusing to overwrite existing pack: ${destination}`);

  await mkdir(path.dirname(destination), { recursive: true });
  const promotionDirectory = path.join(
    path.dirname(destination),
    `.${path.basename(destination)}-promote-${process.pid}-${randomUUID()}`
  );
  await mkdir(promotionDirectory, { recursive: false });
  try {
    for (const filename of [...webpFiles, 'reference-dossier.json']) {
      await copyFile(path.join(stagingPack, filename), path.join(promotionDirectory, filename));
    }
    await validateWebpPack(promotionDirectory);
    if (await exists(destination)) throw new Error(`Refusing to overwrite existing pack: ${destination}`);
    await rename(promotionDirectory, destination);
  } catch (error) {
    await rm(promotionDirectory, { recursive: true, force: true });
    throw error;
  }
};

const backupTimestamp = date => date.toISOString().replace(/[-:.]/g, '');

export const replaceCompletePack = async (
  stagingPack,
  destination,
  backupRoot = rejectedBackupRoot,
  {
    renameDirectory = rename,
    now = new Date(),
    cellGuardPixels = DEFAULT_CELL_GUARD_PIXELS,
    guardAlphaThreshold = DEFAULT_GUARD_ALPHA_THRESHOLD
  } = {}
) => {
  const webpFiles = await validateWebpPack(stagingPack);
  await validateFinalAnimationGuards(stagingPack, cellGuardPixels, guardAlphaThreshold);
  await stat(path.join(stagingPack, 'reference-dossier.json'));
  if (!(await exists(destination))) {
    throw new Error(`Cannot replace a pack that does not exist: ${destination}`);
  }

  await mkdir(backupRoot, { recursive: true });
  const backupDirectory = path.join(
    backupRoot,
    `${path.basename(destination)}-${backupTimestamp(now)}`
  );
  if (await exists(backupDirectory)) {
    throw new Error(`Rejected-pack backup already exists: ${backupDirectory}`);
  }
  try {
    await cp(destination, backupDirectory, {
      recursive: true,
      force: false,
      errorOnExist: true
    });
  } catch (error) {
    await rm(backupDirectory, { recursive: true, force: true });
    throw error;
  }

  const destinationParent = path.dirname(destination);
  const transactionId = `${process.pid}-${randomUUID()}`;
  const promotionDirectory = path.join(
    destinationParent,
    `.${path.basename(destination)}-replace-${transactionId}`
  );
  const runtimeRollbackDirectory = path.join(
    destinationParent,
    `.${path.basename(destination)}-rollback-${transactionId}`
  );
  await mkdir(promotionDirectory, { recursive: false });
  let runtimeMoved = false;
  try {
    for (const filename of [...webpFiles, 'reference-dossier.json']) {
      await copyFile(path.join(stagingPack, filename), path.join(promotionDirectory, filename));
    }
    await validateWebpPack(promotionDirectory);
    await renameDirectory(destination, runtimeRollbackDirectory);
    runtimeMoved = true;
    await renameDirectory(promotionDirectory, destination);
    runtimeMoved = false;
    try {
      await rm(runtimeRollbackDirectory, { recursive: true, force: true });
    } catch (error) {
      console.warn(
        `Replacement installed, but runtime rollback temp could not be removed: ${error instanceof Error ? error.message : error}`
      );
    }
    return { backupDirectory };
  } catch (error) {
    if (runtimeMoved) {
      try {
        await renameDirectory(runtimeRollbackDirectory, destination);
        runtimeMoved = false;
      } catch (restoreError) {
        throw new Error(
          `Pack replacement failed and runtime rollback also failed. Preserved backup: ${backupDirectory}. Replacement error: ${error instanceof Error ? error.message : error}. Rollback error: ${restoreError instanceof Error ? restoreError.message : restoreError}`
        );
      }
    }
    throw error;
  } finally {
    await rm(promotionDirectory, { recursive: true, force: true });
  }
};

const atomicWriteJson = async (destination, value) => {
  await mkdir(path.dirname(destination), { recursive: true });
  const temporaryPath = `${destination}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rm(destination, { force: true });
  await rename(temporaryPath, destination);
};

const loadLedger = async ({ ledgerPath, manifestPath, manifestHash, runNamespace }) => {
  const current = await readFile(ledgerPath, 'utf8').then(JSON.parse, () => null);
  if (current) {
    if (current.schemaVersion !== 1) throw new Error('Unsupported cosmetic generation ledger schema');
    if (current.manifestHash !== manifestHash) {
      throw new Error('Ledger belongs to a different manifest; select a different --ledger path');
    }
    if (current.runNamespace && current.runNamespace !== runNamespace) {
      throw new Error('Ledger run namespace does not match its path/hash identity');
    }
    current.runNamespace = runNamespace;
    return current;
  }
  return {
    schemaVersion: 1,
    manifestPath,
    manifestHash,
    runNamespace,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    jobs: {}
  };
};

const sanitizedChatGptEnvironment = () => {
  const env = { ...process.env, NO_COLOR: '1' };
  for (const key of ['OPENAI_API_KEY', 'OPENAI_API_KEY_PATH', 'CODEX_API_KEY']) delete env[key];
  return env;
};

export const resolveFailedArtifactReuse = async ({
  job,
  tempRoot,
  ledgerJob,
  runNamespace
}) => {
  if (!ledgerJob || ledgerJob.status !== 'failed') {
    throw new Error(`${job.universe}: --reuse-failed-artifact requires ledger status failed`);
  }
  if (!Number.isInteger(ledgerJob.attempts) || ledgerJob.attempts < 1) {
    throw new Error(`${job.universe}: failed ledger entry has no valid source attempt`);
  }
  if (!job.source || typeof job.prompt !== 'string' || !job.prompt.trim()) {
    throw new Error(`${job.universe}: manifest dossier/prompt source is unavailable`);
  }
  const retainedTempRoot = ledgerJob.tempRoot
    ? path.resolve(ledgerJob.tempRoot)
    : path.resolve(tempRoot);
  const namespacedJobRoot = runNamespace
    ? buildJobRoot({
      tempRoot: retainedTempRoot,
      runNamespace,
      slug: job.slug,
      attempt: ledgerJob.attempts
    })
    : null;
  const candidates = [
    ledgerJob.retainedAlphaPath,
    namespacedJobRoot && path.join(namespacedJobRoot, 'atlas-alpha.png'),
    path.join(retainedTempRoot, job.slug, `attempt-${ledgerJob.attempts}`, 'atlas-alpha.png')
  ].filter(Boolean).map(candidate => path.resolve(candidate));
  let alphaPath = null;
  for (const candidate of [...new Set(candidates)]) {
    try {
      const details = await stat(candidate);
      if (details.isFile()) {
        alphaPath = candidate;
        break;
      }
    } catch {
      // Try the retained pointer, namespaced path, then the legacy path.
    }
  }
  if (!alphaPath) {
    throw new Error(
      `${job.universe}: retained failed alpha source is unavailable; checked ${candidates.join(', ')}`
    );
  }
  const jobRoot = path.dirname(alphaPath);
  return { attempt: ledgerJob.attempts, jobRoot, alphaPath };
};

export const processUniverseCosmeticJob = async ({
  job,
  attempt,
  tempRoot,
  manifestMeta,
  codexExecutable,
  pythonExecutable,
  chromaHelperPath,
  replaceExisting,
  cellGuardPixels,
  guardAlphaThreshold,
  uiRowGuardPixels,
  reuseContext,
  runNamespace,
  normalizeAtlas,
  inputAtlasPath = null,
  runtimeRoot = finalRoot,
  processRunner = runProcess,
  systemDiskGuard = ensureSystemDiskCapacity
}) => {
  await systemDiskGuard();
  const destination = path.join(runtimeRoot, job.slug);
  const destinationExists = await exists(destination);
  if (destinationExists && !replaceExisting) return { status: 'skipped-existing', destination };
  if (!destinationExists && replaceExisting) {
    throw new Error(`${job.universe}: --replace-existing requires an existing runtime pack`);
  }

  const jobRoot = buildJobRoot({ tempRoot, runNamespace, slug: job.slug, attempt });
  const messagesDirectory = path.join(projectRoot, 'tmp', 'imagegen', 'universe-cosmetics', 'messages');
  const lastMessagePath = path.join(messagesDirectory, `${job.slug}-attempt-${attempt}.txt`);
  const rawDirectory = path.join(jobRoot, 'raw');
  const rawPath = path.join(rawDirectory, 'atlas-source.png');
  const alphaPath = path.join(jobRoot, 'atlas-alpha.png');
  const keyedAlphaPath = path.join(jobRoot, 'atlas-alpha-keyed.png');
  const reusedNormalizedAlphaPath = path.join(jobRoot, 'atlas-alpha-reuse-normalized.png');
  const stagingRoot = path.join(jobRoot, 'staging');
  const stagingPack = path.join(stagingRoot, job.slug);
  let processingAlphaPath = alphaPath;
  if (reuseContext) {
    await mkdir(jobRoot, { recursive: true });
    if (path.resolve(reuseContext.alphaPath) !== path.resolve(alphaPath)) {
      await copyFile(reuseContext.alphaPath, alphaPath);
    }
    if (normalizeAtlas) {
      await processRunner({
        command: pythonExecutable,
        args: [
          atlasNormalizerPath,
          '--input', alphaPath,
          '--out', reusedNormalizedAlphaPath,
          '--alpha-threshold', String(guardAlphaThreshold),
          '--ui-guard', String(Math.max(16, uiRowGuardPixels)),
          '--cell-guard', String(cellGuardPixels)
        ]
      });
      processingAlphaPath = reusedNormalizedAlphaPath;
    }
    await validateAlphaAtlasGuards(
      processingAlphaPath,
      cellGuardPixels,
      guardAlphaThreshold,
      uiRowGuardPixels
    );
    await rm(stagingRoot, { recursive: true, force: true });
    await mkdir(stagingRoot, { recursive: true });
  } else {
    const directories = [
      mkdir(rawDirectory, { recursive: true }),
      mkdir(stagingRoot, { recursive: true })
    ];
    if (!inputAtlasPath) directories.push(mkdir(messagesDirectory, { recursive: true }));
    await Promise.all(directories);
    if (inputAtlasPath) {
      if (!path.isAbsolute(inputAtlasPath) || path.extname(inputAtlasPath).toLowerCase() !== '.png') {
        throw new Error('Local input atlas must be an absolute PNG path');
      }
      await validateAtlasSourceDimensions(inputAtlasPath);
      await copyFile(inputAtlasPath, rawPath);
    } else {
      const leadReferencePath = resolveLeadReferencePath(job.source.leadReferencePath);
      if (leadReferencePath) await access(leadReferencePath);
      const codexArgs = buildCodexArguments(lastMessagePath, leadReferencePath);
      await processRunner({
        command: codexExecutable,
        args: codexArgs,
        input: buildWorkerPrompt(job),
        env: sanitizedChatGptEnvironment()
      });
      const lastMessage = await readFile(lastMessagePath, 'utf8');
      const generatedPath = resolveGeneratedPath(parseOutputPath(lastMessage));
      await assertGeneratedFile(generatedPath);
      await copyFile(generatedPath, rawPath);
    }
    await validateAtlasSourceDimensions(rawPath);
    await processRunner({
      command: pythonExecutable,
      args: [
        chromaHelperPath,
        '--input', rawPath,
        '--out', normalizeAtlas ? keyedAlphaPath : alphaPath,
        '--auto-key', 'border',
        '--soft-matte',
        '--transparent-threshold', '12',
        '--opaque-threshold', '220',
        '--despill'
      ]
    });
    if (normalizeAtlas) {
      await processRunner({
        command: pythonExecutable,
        args: [
          atlasNormalizerPath,
          '--input', keyedAlphaPath,
          '--out', alphaPath,
          '--alpha-threshold', String(guardAlphaThreshold),
          '--ui-guard', String(Math.max(16, uiRowGuardPixels)),
          '--cell-guard', String(cellGuardPixels)
        ]
      });
    }
    await validateAlphaAtlasGuards(
      alphaPath,
      cellGuardPixels,
      guardAlphaThreshold,
      uiRowGuardPixels
    );
  }
  await processRunner({
    command: pythonExecutable,
    args: [
      atlasProcessorPath,
      '--input', processingAlphaPath,
      '--universe', job.universe,
      '--out-root', stagingRoot,
      '--hud-source', firstNonEmptyString(job.source.hudSource) || 'both',
      '--clear-hud-safe-area'
    ]
  });
  await validateWebpPack(stagingPack);
  await writeFile(
    path.join(stagingPack, 'reference-dossier.json'),
    `${JSON.stringify(buildReferenceDossier(job, manifestMeta), null, 2)}\n`,
    'utf8'
  );
  const promotionResult = (replaceExisting
    ? await replaceCompletePack(stagingPack, destination, rejectedBackupRoot, {
      cellGuardPixels,
      guardAlphaThreshold
    })
    : await promoteCompletePack(stagingPack, destination, {
      cellGuardPixels,
      guardAlphaThreshold
    })) || {};
  try {
    await rm(jobRoot, { recursive: true, force: true });
  } catch (error) {
    console.warn(
      `${job.universe}: pack promoted, but its isolated job temp could not be removed: ${error instanceof Error ? error.message : error}`
    );
  }
  return {
    status: replaceExisting ? 'replaced' : 'complete',
    destination,
    ...promotionResult
  };
};

const runPool = async (jobs, concurrency, handler) => {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor];
      cursor += 1;
      await handler(job);
    }
  });
  await Promise.all(workers);
};

export const run = async (argv = process.argv.slice(2)) => {
  const options = parseArguments(argv);
  if (options.help) {
    console.log(HELP);
    return;
  }
  const manifestSource = await readFile(options.manifestPath, 'utf8');
  const manifest = JSON.parse(manifestSource);
  const manifestHash = createHash('sha256').update(manifestSource).digest('hex');
  const runNamespace = buildLedgerRunNamespace(options.ledgerPath, manifestHash);
  const ledger = await loadLedger({
    ledgerPath: options.ledgerPath,
    manifestPath: options.manifestPath,
    manifestHash,
    runNamespace
  });
  const jobs = selectJobs(normalizeManifest(manifest), options, ledger);
  if (options.inputAtlasPath && jobs.length !== 1) {
    throw new Error('--input-atlas explicit --universe filter must match exactly one manifest job');
  }
  const tempRoot = await selectTempRoot(options.tempRoot);
  const codexExecutable = process.env.CODEX_DESKTOP_EXE || DEFAULT_CODEX_DESKTOP_EXE;
  const pythonExecutable = process.env.PYTHON_EXE || 'python';
  const chromaHelperPath = process.env.IMAGEGEN_CHROMA_HELPER || defaultChromaHelperPath;
  const setup = [access(atlasProcessorPath), mkdir(tempRoot, { recursive: true })];
  if (options.normalizeAtlas) setup.push(access(atlasNormalizerPath));
  if (!options.reuseFailedArtifact) {
    setup.push(access(chromaHelperPath));
  }
  if (!options.reuseFailedArtifact && !options.inputAtlasPath) {
    setup.push(access(codexExecutable));
  }
  if (options.inputAtlasPath) {
    setup.push(validateAtlasSourceDimensions(options.inputAtlasPath));
  }
  await Promise.all(setup);

  const reuseContexts = new Map();
  if (options.reuseFailedArtifact) {
    for (const job of jobs) {
      reuseContexts.set(job.slug, await resolveFailedArtifactReuse({
        job,
        tempRoot,
        ledgerJob: ledger.jobs[job.slug],
        runNamespace
      }));
    }
  }

  let ledgerWrite = Promise.resolve();
  const persistLedger = () => {
    ledger.updatedAt = new Date().toISOString();
    ledgerWrite = ledgerWrite.then(() => atomicWriteJson(options.ledgerPath, ledger));
    return ledgerWrite;
  };
  await persistLedger();
  const failures = [];
  const sourceMode = resolveSourceMode(options);
  console.log(`Selected ${jobs.length} universe cosmetic job(s); concurrency=${options.concurrency}`);
  console.log(`Intermediate root: ${tempRoot}`);

  await runPool(jobs, options.concurrency, async (job) => {
    const previous = ledger.jobs[job.slug] || {};
    const reuseContext = reuseContexts.get(job.slug) || null;
    const attempt = reuseContext?.attempt || (previous.attempts || 0) + 1;
    ledger.jobs[job.slug] = {
      ...previous,
      universe: job.universe,
      status: 'running',
      attempts: attempt,
      artifactReuses: (previous.artifactReuses || 0) + (reuseContext ? 1 : 0),
      sourceMode,
      inputAtlasPath: options.inputAtlasPath || undefined,
      tempRoot,
      runNamespace,
      startedAt: new Date().toISOString()
    };
    await persistLedger();
    try {
      const result = await processUniverseCosmeticJob({
        job,
        attempt,
        tempRoot,
        manifestMeta: manifest,
        codexExecutable,
        pythonExecutable,
        chromaHelperPath,
        replaceExisting: options.replaceExisting,
        cellGuardPixels: options.cellGuardPixels,
        guardAlphaThreshold: options.guardAlphaThreshold,
        uiRowGuardPixels: options.uiRowGuardPixels,
        reuseContext,
        runNamespace,
        normalizeAtlas: options.normalizeAtlas,
        inputAtlasPath: options.inputAtlasPath
      });
      ledger.jobs[job.slug] = {
        ...ledger.jobs[job.slug],
        ...result,
        error: undefined,
        failedAt: undefined,
        retainedJobRoot: undefined,
        retainedAlphaPath: undefined,
        completedAt: new Date().toISOString()
      };
      console.log(`${job.universe}: ${result.status}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const failedJobRoot = buildJobRoot({ tempRoot, runNamespace, slug: job.slug, attempt });
      const failedAlphaPath = path.join(failedJobRoot, 'atlas-alpha.png');
      const alphaRetained = await exists(failedAlphaPath);
      ledger.jobs[job.slug] = {
        ...ledger.jobs[job.slug],
        status: 'failed',
        failedAt: new Date().toISOString(),
        retainedJobRoot: alphaRetained ? failedJobRoot : undefined,
        retainedAlphaPath: alphaRetained ? failedAlphaPath : undefined,
        error: message
      };
      failures.push({ universe: job.universe, error: message });
      console.error(`${job.universe}: failed: ${message}`);
    }
    await persistLedger();
  });
  await ledgerWrite;
  if (failures.length > 0) {
    throw new Error(`${failures.length} universe cosmetic job(s) failed; rerun with --resume`);
  }
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
