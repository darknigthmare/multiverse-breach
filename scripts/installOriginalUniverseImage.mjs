import { createHash } from 'node:crypto';
import { constants as fileConstants } from 'node:fs';
import {
  copyFile,
  mkdir,
  open,
  readFile,
  rename,
  stat,
  unlink,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const DEFAULT_PLAN = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-plan.json'
);
const DEFAULT_LEDGER_ROOT = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-ledger'
);
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function parseArguments(argv) {
  const options = {
    source: null,
    assetId: null,
    destination: null,
    plan: DEFAULT_PLAN,
    ledgerRoot: DEFAULT_LEDGER_ROOT,
    generationDate: null,
    replace: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const nextValue = argv[index + 1];
    if (argument === '--source') {
      options.source = nextValue;
      index += 1;
    } else if (argument === '--asset-id') {
      options.assetId = nextValue;
      index += 1;
    } else if (argument === '--destination') {
      options.destination = nextValue;
      index += 1;
    } else if (argument === '--plan') {
      options.plan = path.resolve(REPOSITORY_ROOT, nextValue || '');
      index += 1;
    } else if (argument === '--ledger-root') {
      options.ledgerRoot = path.resolve(REPOSITORY_ROOT, nextValue || '');
      index += 1;
    } else if (argument === '--date') {
      options.generationDate = nextValue;
      index += 1;
    } else if (argument === '--replace') {
      options.replace = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function printHelp() {
  console.log([
    'Usage:',
    '  node scripts/installOriginalUniverseImage.mjs \\',
    '    --source <generated.png> \\',
    '    --asset-id <plan assetId> \\',
    '    --destination </public/url/from/plan.png> [options]',
    '',
    'Options:',
    '  --plan <file>          Generation plan (default: docs/original-universes/openai-image-v2-plan.json)',
    '  --ledger-root <dir>    Per-asset provenance ledger directory',
    '  --date <ISO date>      Image generation date; defaults to the installation time',
    '  --replace              Explicitly replace a previously installed destination',
    '  --help                 Show this help',
    '',
    'Concurrency:',
    '  Provenance is one atomic sidecar per asset under <ledger-root>/entries/<assetId sha256>.json.',
    '  A matching exclusive .lock file prevents two installers from writing the same asset concurrently.',
    '  Different assets never update a shared JSON file, so parallel installers cannot lose ledger entries.'
  ].join('\n'));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function assertInsideRepository(absolutePath, label) {
  const relative = path.relative(REPOSITORY_ROOT, absolutePath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} must resolve to a file inside the repository.`);
  }
  return absolutePath;
}

function normalizeDestination(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('--destination is required.');
  }

  const supplied = value.trim().replace(/\\/g, '/');
  let repositoryPath;
  let publicPath;

  if (supplied.startsWith('/')) {
    publicPath = supplied.replace(/\/+/g, '/');
    repositoryPath = `public${publicPath}`;
  } else {
    repositoryPath = supplied.replace(/^\.\//, '').replace(/\/+/g, '/');
    if (!repositoryPath.startsWith('public/')) {
      throw new Error(
        '--destination must be a plan public path beginning with "/" or a repository path beginning with "public/".'
      );
    }
    publicPath = repositoryPath.slice('public'.length);
  }

  if (path.posix.extname(publicPath).toLowerCase() !== '.png') {
    throw new Error('--destination must end in .png.');
  }

  const absolutePath = assertInsideRepository(
    path.resolve(REPOSITORY_ROOT, ...repositoryPath.split('/')),
    '--destination'
  );
  return { publicPath, repositoryPath, absolutePath };
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

function inspectPng(buffer) {
  if (buffer.length < 45 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('Source does not have a valid PNG signature.');
  }

  let offset = PNG_SIGNATURE.length;
  let header = null;
  let foundEnd = false;
  let chunkIndex = 0;

  while (offset + 12 <= buffer.length) {
    const dataLength = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const chunkEnd = offset + 12 + dataLength;
    if (chunkEnd > buffer.length) {
      throw new Error(`Malformed PNG: ${type || 'unknown'} chunk exceeds file bounds.`);
    }

    if (chunkIndex === 0) {
      if (type !== 'IHDR' || dataLength !== 13) {
        throw new Error('Malformed PNG: first chunk must be a 13-byte IHDR.');
      }
      const width = buffer.readUInt32BE(offset + 8);
      const height = buffer.readUInt32BE(offset + 12);
      if (width < 1 || height < 1) {
        throw new Error('Malformed PNG: dimensions must be positive.');
      }
      header = {
        width,
        height,
        bitDepth: buffer[offset + 16],
        colorType: buffer[offset + 17]
      };
    }

    offset = chunkEnd;
    chunkIndex += 1;
    if (type === 'IEND') {
      if (dataLength !== 0 || offset !== buffer.length) {
        throw new Error('Malformed PNG: IEND must be the final empty chunk.');
      }
      foundEnd = true;
      break;
    }
  }

  if (!header || !foundEnd) {
    throw new Error('Malformed PNG: missing IHDR or final IEND chunk.');
  }
  return header;
}

async function validateSource(sourceValue) {
  if (typeof sourceValue !== 'string' || !sourceValue.trim()) {
    throw new Error('--source is required.');
  }
  const sourcePath = path.resolve(sourceValue);
  if (path.extname(sourcePath).toLowerCase() !== '.png') {
    throw new Error('--source must point to a .png file.');
  }
  const sourceStats = await stat(sourcePath).catch(error => {
    if (error?.code === 'ENOENT') {
      throw new Error(`Source PNG does not exist: ${sourcePath}.`);
    }
    throw error;
  });
  if (!sourceStats.isFile()) {
    throw new Error(`Source PNG is not a regular file: ${sourcePath}.`);
  }

  const buffer = await readFile(sourcePath);
  const png = inspectPng(buffer);
  return {
    path: sourcePath,
    buffer,
    stats: sourceStats,
    png,
    sha256: sha256(buffer)
  };
}

function normalizeGenerationDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error('--date must be a valid ISO date or date-time.');
  }
  return date.toISOString();
}

async function loadAndValidatePlan(planPath) {
  const source = await readFile(planPath, 'utf8');
  const plan = JSON.parse(source);
  if (!Array.isArray(plan.jobs) || plan.jobs.length !== 500) {
    throw new Error('Generation plan must contain exactly 500 jobs.');
  }
  if (
    plan.generator?.interface !== 'built-in image_gen'
    || plan.generator?.model !== 'built-in/imagegen'
  ) {
    throw new Error('Generation plan is not declared for OpenAI built-in image_gen.');
  }

  const manifestPath = assertInsideRepository(
    path.resolve(REPOSITORY_ROOT, plan.source?.manifest || ''),
    'Plan source manifest'
  );
  const currentManifest = await readFile(manifestPath);
  if (sha256(currentManifest) !== plan.source?.manifestSha256) {
    throw new Error(
      'The current lore manifest no longer matches the plan. Rebuild the 500-prompt plan before installing images.'
    );
  }
  return { plan, source, sha256: sha256(source) };
}

function findAndValidateJob(plan, assetId, destination) {
  if (typeof assetId !== 'string' || !assetId.trim()) {
    throw new Error('--asset-id is required.');
  }
  const matches = plan.jobs.filter(job => job.assetId === assetId);
  if (matches.length !== 1) {
    throw new Error(
      matches.length === 0
        ? `Unknown asset id: ${assetId}.`
        : `Plan contains duplicate asset id: ${assetId}.`
    );
  }

  const job = matches[0];
  if (job.destination !== destination.publicPath) {
    throw new Error(
      `Destination mismatch for ${assetId}: expected ${job.destination}, received ${destination.publicPath}.`
    );
  }
  if (job.repositoryPath !== destination.repositoryPath) {
    throw new Error(`Repository destination mismatch for ${assetId}.`);
  }
  if (sha256(job.prompt) !== job.promptSha256) {
    throw new Error(`Prompt hash mismatch in plan for ${assetId}.`);
  }
  if (
    job.generator !== 'OpenAI built-in image_gen'
    || job.model !== 'built-in/imagegen'
  ) {
    throw new Error(`Unsupported generator provenance for ${assetId}.`);
  }
  return job;
}

async function replacePathAtomically(temporaryPath, destinationPath, allowReplace) {
  const destinationExists = await isFile(destinationPath);
  if (destinationExists && !allowReplace) {
    throw new Error(
      `Destination already exists: ${path.relative(REPOSITORY_ROOT, destinationPath)}. Use --replace only for an intentional regeneration.`
    );
  }

  if (!destinationExists) {
    await rename(temporaryPath, destinationPath);
    return;
  }

  const backupPath = `${destinationPath}.backup-${process.pid}-${Date.now()}`;
  await rename(destinationPath, backupPath);
  try {
    await rename(temporaryPath, destinationPath);
  } catch (error) {
    await rename(backupPath, destinationPath).catch(() => {});
    throw error;
  }
  await unlink(backupPath);
}

async function installImage(source, destination, allowReplace) {
  await mkdir(path.dirname(destination.absolutePath), { recursive: true });
  const temporaryPath = `${destination.absolutePath}.install-${process.pid}-${Date.now()}`;
  await copyFile(source.path, temporaryPath, fileConstants.COPYFILE_EXCL);
  try {
    await replacePathAtomically(temporaryPath, destination.absolutePath, allowReplace);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

async function writeJsonAtomically(outputPath, value, allowReplace) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx'
  });
  try {
    await replacePathAtomically(temporaryPath, outputPath, allowReplace);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

async function acquireAssetLock(lockPath, assetId) {
  await mkdir(path.dirname(lockPath), { recursive: true });
  let lock;
  try {
    lock = await open(lockPath, 'wx');
  } catch (error) {
    if (error?.code === 'EEXIST') {
      throw new Error(
        `Asset ${assetId} is already being installed by another process (${path.basename(lockPath)} exists).`
      );
    }
    throw error;
  }
  await lock.writeFile(JSON.stringify({
    assetId,
    processId: process.pid,
    acquiredAt: new Date().toISOString()
  }));
  return lock;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const destination = normalizeDestination(options.destination);
  const source = await validateSource(options.source);
  if (path.resolve(source.path) === path.resolve(destination.absolutePath)) {
    throw new Error('Source and destination must be different files.');
  }

  const planData = await loadAndValidatePlan(options.plan);
  const job = findAndValidateJob(planData.plan, options.assetId, destination);
  const generationDate = normalizeGenerationDate(options.generationDate);
  const ledgerRoot = assertInsideRepository(
    path.resolve(options.ledgerRoot),
    '--ledger-root'
  );
  const entryHash = sha256(job.assetId);
  const entriesDirectory = path.join(ledgerRoot, 'entries');
  const entryPath = path.join(entriesDirectory, `${entryHash}.json`);
  const lockPath = path.join(entriesDirectory, `${entryHash}.lock`);
  const lock = await acquireAssetLock(lockPath, job.assetId);

  try {
    await installImage(source, destination, options.replace);
    const installedAt = new Date().toISOString();
    const ledgerEntry = {
      schemaVersion: 1,
      assetId: job.assetId,
      worldKey: job.worldKey,
      universe: job.universe,
      category: job.category,
      entityName: job.entityName,
      destination: job.destination,
      repositoryPath: job.repositoryPath,
      generation: {
        provider: 'OpenAI',
        interface: 'built-in image_gen',
        model: 'built-in/imagegen',
        date: generationDate,
        promptSha256: job.promptSha256
      },
      lore: {
        sourceManifest: planData.plan.source.manifest,
        sourceManifestSha256: planData.plan.source.manifestSha256,
        references: job.loreReferences
      },
      image: {
        format: 'PNG',
        sha256: source.sha256,
        bytes: source.stats.size,
        width: source.png.width,
        height: source.png.height,
        bitDepth: source.png.bitDepth,
        colorType: source.png.colorType,
        sourceFileName: path.basename(source.path)
      },
      plan: {
        id: planData.plan.planId,
        sha256: planData.sha256
      },
      installedAt
    };
    await writeJsonAtomically(entryPath, ledgerEntry, options.replace);

    console.log(JSON.stringify({
      installed: job.assetId,
      destination: job.repositoryPath,
      imageSha256: source.sha256,
      promptSha256: job.promptSha256,
      model: 'built-in/imagegen',
      ledgerEntry: path.relative(REPOSITORY_ROOT, entryPath).split(path.sep).join('/')
    }, null, 2));
  } finally {
    await lock.close().catch(() => {});
    await unlink(lockPath).catch(() => {});
  }
}

main().catch(error => {
  console.error(`[install-original-universe-image] ${error.message}`);
  process.exitCode = 1;
});
