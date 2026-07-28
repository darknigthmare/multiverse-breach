import { createHash } from 'node:crypto';
import {
  mkdir,
  open,
  readFile,
  readdir,
  rename,
  rm,
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
const EXPECTED_PLAN_ID = 'multiverse-breach-original-universes-openai-image-v2';
const EXPECTED_JOB_COUNT = 500;
const EXPECTED_GENERATOR = Object.freeze({
  provider: 'OpenAI',
  interface: 'built-in image_gen',
  model: 'built-in/imagegen'
});
const EXPECTED_CATEGORY_COUNTS = Object.freeze({
  booster: 20,
  backdrop: 20,
  stage: 60,
  hero: 60,
  enemy: 100,
  boss: 60,
  worldBoss: 20,
  gear: 60,
  battleItem: 100
});
const EXPECTED_ASPECT_RATIOS = Object.freeze({
  booster: '2:3',
  backdrop: '16:9',
  stage: '16:9',
  hero: '3:4',
  enemy: '3:4',
  boss: '3:4',
  worldBoss: '3:4',
  gear: '1:1',
  battleItem: '1:1'
});
const EXPECTED_IMAGE_GEOMETRY = Object.freeze({
  booster: { ratio: 2 / 3, minimumWidth: 900, minimumHeight: 1300 },
  backdrop: { ratio: 16 / 9, minimumWidth: 1500, minimumHeight: 800 },
  stage: { ratio: 16 / 9, minimumWidth: 1500, minimumHeight: 800 },
  hero: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  enemy: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  boss: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  worldBoss: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  gear: { ratio: 1, minimumWidth: 1200, minimumHeight: 1200 },
  battleItem: { ratio: 1, minimumWidth: 1200, minimumHeight: 1200 }
});
const ASPECT_RATIO_TOLERANCE = 0.002;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const TRANSACTION_PREFIX = '.refresh-plan-';

const LEDGER_TOP_LEVEL_KEYS = Object.freeze([
  'schemaVersion',
  'assetId',
  'worldKey',
  'universe',
  'category',
  'entityName',
  'destination',
  'repositoryPath',
  'generation',
  'lore',
  'image',
  'plan',
  'installedAt'
]);
const LEDGER_GENERATION_KEYS = Object.freeze([
  'provider',
  'interface',
  'model',
  'date',
  'promptSha256'
]);
const LEDGER_LORE_KEYS = Object.freeze([
  'sourceManifest',
  'sourceManifestSha256',
  'references'
]);
const LEDGER_IMAGE_KEYS = Object.freeze([
  'format',
  'sha256',
  'bytes',
  'width',
  'height',
  'bitDepth',
  'colorType',
  'sourceFileName'
]);
const LEDGER_PLAN_KEYS = Object.freeze(['id', 'sha256']);

function parseArguments(argv) {
  const options = {
    plan: DEFAULT_PLAN,
    ledgerRoot: DEFAULT_LEDGER_ROOT,
    check: false,
    help: false
  };

  const takeValue = (argument, value) => {
    if (typeof value !== 'string' || !value.trim() || value.startsWith('--')) {
      throw new Error(`${argument} requires a path.`);
    }
    return path.resolve(REPOSITORY_ROOT, value);
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--plan') {
      options.plan = takeValue(argument, argv[index + 1]);
      index += 1;
    } else if (argument === '--ledger-root') {
      options.ledgerRoot = takeValue(argument, argv[index + 1]);
      index += 1;
    } else if (argument === '--check') {
      options.check = true;
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
    'Usage: node scripts/refreshOriginalUniverseImageLedgerPlanSha.mjs [options]',
    '',
    'Options:',
    '  --plan <file>          Current 500-job OpenAI Image plan',
    '  --ledger-root <dir>    Per-asset provenance ledger directory',
    '  --check                Validate without writing; fail if plan links are stale',
    '  --help                 Show this help',
    '',
    'Write mode validates all 500 plan jobs, sidecars and PNG files before staging',
    'any replacement. Only sidecar plan.id and plan.sha256 may change.'
  ].join('\n'));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function canonicalJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function isCanonicalIsoDate(value) {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

function assertInsideRepository(absolutePath, label) {
  const resolved = path.resolve(absolutePath);
  const relative = path.relative(REPOSITORY_ROOT, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} must resolve inside the repository.`);
  }
  return resolved;
}

function resolveRepositoryPath(repositoryPath, label, errors, requiredPrefix = null) {
  if (
    typeof repositoryPath !== 'string'
    || !repositoryPath
    || repositoryPath.includes('\\')
    || path.posix.isAbsolute(repositoryPath)
    || repositoryPath.split('/').some(segment => !segment || segment === '.' || segment === '..')
    || (requiredPrefix !== null && !repositoryPath.startsWith(requiredPrefix))
  ) {
    errors.push(`${label} is not a safe repository-relative path`);
    return null;
  }

  const absolutePath = path.resolve(REPOSITORY_ROOT, ...repositoryPath.split('/'));
  const relative = path.relative(REPOSITORY_ROOT, absolutePath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    errors.push(`${label} resolves outside the repository`);
    return null;
  }
  return absolutePath;
}

function check(condition, message, errors) {
  if (!condition) errors.push(message);
}

function checkEqual(actual, expected, label, errors) {
  check(
    actual === expected,
    `${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    errors
  );
}

function checkArrayEqual(actual, expected, label, errors) {
  check(
    Array.isArray(actual) && JSON.stringify(actual) === JSON.stringify(expected),
    `${label} does not exactly match the current plan`,
    errors
  );
}

function checkExactKeys(value, expectedKeys, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  check(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} keys: expected ${expected.join(', ')}, received ${actual.join(', ')}`,
    errors
  );
}

function checkUnique(values, label, errors) {
  check(
    new Set(values).size === values.length,
    `${label} must contain ${values.length} distinct values`,
    errors
  );
}

function validationFailure(errors) {
  const shown = errors.slice(0, 100).map(error => `- ${error}`).join('\n');
  const omitted = errors.length > 100
    ? `\n- ... ${errors.length - 100} additional issue(s) omitted`
    : '';
  return new Error(`validation failed (${errors.length} issue(s))\n${shown}${omitted}`);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value = CRC_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function inspectPng(buffer, label) {
  if (buffer.length < 45 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${label} does not have a valid PNG signature`);
  }

  let offset = PNG_SIGNATURE.length;
  let header = null;
  let foundImageData = false;
  let foundEnd = false;
  let chunkIndex = 0;

  while (offset + 12 <= buffer.length) {
    const dataLength = buffer.readUInt32BE(offset);
    const typeBuffer = buffer.subarray(offset + 4, offset + 8);
    const type = typeBuffer.toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + dataLength;
    const chunkEnd = dataEnd + 4;

    if (chunkEnd > buffer.length) {
      throw new Error(`${label} has a ${type || 'unknown'} chunk outside file bounds`);
    }

    const expectedCrc = buffer.readUInt32BE(dataEnd);
    const actualCrc = crc32(Buffer.concat([
      typeBuffer,
      buffer.subarray(dataStart, dataEnd)
    ]));
    if (actualCrc !== expectedCrc) {
      throw new Error(`${label} has an invalid ${type || 'unknown'} CRC`);
    }

    if (chunkIndex === 0) {
      if (type !== 'IHDR' || dataLength !== 13) {
        throw new Error(`${label} must start with a 13-byte IHDR`);
      }
      header = {
        width: buffer.readUInt32BE(dataStart),
        height: buffer.readUInt32BE(dataStart + 4),
        bitDepth: buffer[dataStart + 8],
        colorType: buffer[dataStart + 9]
      };
      if (header.width < 1 || header.height < 1) {
        throw new Error(`${label} has invalid dimensions`);
      }
    } else if (type === 'IHDR') {
      throw new Error(`${label} contains more than one IHDR chunk`);
    }

    if (type === 'IDAT') foundImageData = true;
    offset = chunkEnd;
    chunkIndex += 1;

    if (type === 'IEND') {
      if (dataLength !== 0 || offset !== buffer.length) {
        throw new Error(`${label} must end with one empty IEND chunk`);
      }
      foundEnd = true;
      break;
    }
  }

  if (!header || !foundImageData || !foundEnd) {
    throw new Error(`${label} is missing IHDR, IDAT or final IEND data`);
  }
  return header;
}

function collectChangedPaths(before, after, prefix = '', changed = []) {
  if (Object.is(before, after)) return changed;

  if (Array.isArray(before) || Array.isArray(after)) {
    if (
      !Array.isArray(before)
      || !Array.isArray(after)
      || JSON.stringify(before) !== JSON.stringify(after)
    ) {
      changed.push(prefix);
    }
    return changed;
  }

  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) {
      collectChangedPaths(
        before[key],
        after[key],
        prefix ? `${prefix}.${key}` : key,
        changed
      );
    }
    return changed;
  }

  changed.push(prefix);
  return changed;
}

async function validateReferencedFile(repositoryPath, expectedSha, label, errors) {
  check(SHA256_PATTERN.test(expectedSha || ''), `${label}.sha256 is invalid`, errors);
  const absolutePath = resolveRepositoryPath(repositoryPath, `${label}.file`, errors);
  if (!absolutePath) return;

  try {
    const source = await readFile(absolutePath);
    checkEqual(sha256(source), expectedSha, `${label}.sha256`, errors);
  } catch (error) {
    errors.push(`${label}.file cannot be read: ${error.message}`);
  }
}

async function loadAndValidatePlan(planPath, errors) {
  let source;
  let plan;
  try {
    source = await readFile(planPath, 'utf8');
    plan = JSON.parse(source);
  } catch (error) {
    errors.push(`generation plan cannot be read as JSON: ${error.message}`);
    return null;
  }

  if (!isPlainObject(plan)) {
    errors.push('generation plan must be an object');
    return null;
  }
  checkEqual(plan.schemaVersion, 1, 'plan.schemaVersion', errors);
  checkEqual(plan.planId, EXPECTED_PLAN_ID, 'plan.planId', errors);
  checkEqual(plan.deterministic, true, 'plan.deterministic', errors);
  checkEqual(
    plan.generator?.provider,
    EXPECTED_GENERATOR.provider,
    'plan.generator.provider',
    errors
  );
  checkEqual(
    plan.generator?.interface,
    EXPECTED_GENERATOR.interface,
    'plan.generator.interface',
    errors
  );
  checkEqual(
    plan.generator?.model,
    EXPECTED_GENERATOR.model,
    'plan.generator.model',
    errors
  );
  checkEqual(plan.counts?.jobs, EXPECTED_JOB_COUNT, 'plan.counts.jobs', errors);
  checkEqual(plan.counts?.distinctPrompts, EXPECTED_JOB_COUNT, 'plan.counts.distinctPrompts', errors);
  checkEqual(
    plan.counts?.distinctDestinations,
    EXPECTED_JOB_COUNT,
    'plan.counts.distinctDestinations',
    errors
  );

  const jobs = Array.isArray(plan.jobs) ? plan.jobs : [];
  checkEqual(jobs.length, EXPECTED_JOB_COUNT, 'plan.jobs.length', errors);
  checkUnique(jobs.map(job => job?.assetId), 'plan asset IDs', errors);
  checkUnique(jobs.map(job => job?.destination), 'plan destinations', errors);
  checkUnique(jobs.map(job => job?.repositoryPath), 'plan repository paths', errors);
  checkUnique(jobs.map(job => job?.prompt), 'plan prompts', errors);
  checkUnique(jobs.map(job => job?.promptSha256), 'plan prompt hashes', errors);

  const worldCounts = new Map();
  for (const [index, job] of jobs.entries()) {
    const label = typeof job?.assetId === 'string'
      ? job.assetId
      : `plan.jobs[${index}]`;
    check(isPlainObject(job), `${label} must be an object`, errors);
    check(
      typeof job?.assetId === 'string' && job.assetId.trim() === job.assetId && job.assetId.length > 0,
      `${label}.assetId must be a non-empty canonical string`,
      errors
    );
    check(
      typeof job?.worldKey === 'string' && job.worldKey.length > 0,
      `${label}.worldKey must be recorded`,
      errors
    );
    check(
      typeof job?.universe === 'string' && job.universe.length > 0,
      `${label}.universe must be recorded`,
      errors
    );
    check(
      typeof job?.entityName === 'string' && job.entityName.length > 0,
      `${label}.entityName must be recorded`,
      errors
    );
    checkEqual(job?.format, 'PNG', `${label}.format`, errors);
    checkEqual(job?.generator, 'OpenAI built-in image_gen', `${label}.generator`, errors);
    checkEqual(job?.model, EXPECTED_GENERATOR.model, `${label}.model`, errors);
    checkEqual(
      job?.aspectRatio,
      EXPECTED_ASPECT_RATIOS[job?.category],
      `${label}.aspectRatio`,
      errors
    );
    check(
      typeof job?.prompt === 'string' && job.prompt.length > 0,
      `${label}.prompt must be recorded`,
      errors
    );
    check(
      SHA256_PATTERN.test(job?.promptSha256 || ''),
      `${label}.promptSha256 is invalid`,
      errors
    );
    checkEqual(
      sha256(typeof job?.prompt === 'string' ? job.prompt : ''),
      job?.promptSha256,
      `${label}.promptSha256`,
      errors
    );
    check(
      Array.isArray(job?.loreReferences)
      && job.loreReferences.every(reference => (
        typeof reference === 'string' && reference.startsWith('/')
      )),
      `${label}.loreReferences must be JSON pointers`,
      errors
    );

    const destinationIsSafe = (
      typeof job?.destination === 'string'
      && job.destination.startsWith('/')
      && job.destination.endsWith('.png')
      && !job.destination.includes('\\')
      && !job.destination.includes('//')
      && !job.destination.split('/').includes('..')
      && path.posix.normalize(job.destination) === job.destination
    );
    check(destinationIsSafe, `${label}.destination is not a safe public PNG path`, errors);
    checkEqual(
      job?.repositoryPath,
      destinationIsSafe ? `public${job.destination}` : null,
      `${label}.repositoryPath`,
      errors
    );
    if (typeof job?.repositoryPath === 'string') {
      resolveRepositoryPath(
        job.repositoryPath,
        `${label}.repositoryPath`,
        errors,
        'public/'
      );
    }

    if (typeof job?.worldKey === 'string') {
      worldCounts.set(job.worldKey, (worldCounts.get(job.worldKey) || 0) + 1);
    }
  }

  checkEqual(worldCounts.size, 20, 'plan distinct world count', errors);
  for (const [worldKey, count] of worldCounts) {
    checkEqual(count, 25, `${worldKey} plan job count`, errors);
  }
  for (const [category, expectedCount] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
    const actual = jobs.filter(job => job?.category === category).length;
    checkEqual(actual, expectedCount, `plan category ${category}`, errors);
    checkEqual(
      plan.counts?.byCategory?.[category],
      expectedCount,
      `plan.counts.byCategory.${category}`,
      errors
    );
  }

  await validateReferencedFile(
    plan.source?.manifest,
    plan.source?.manifestSha256,
    'plan source manifest',
    errors
  );
  if (plan.culturalRemediation !== undefined && plan.culturalRemediation !== null) {
    await validateReferencedFile(
      plan.culturalRemediation.file,
      plan.culturalRemediation.sha256,
      'plan cultural remediation',
      errors
    );
  }

  return {
    plan,
    source,
    sha256: sha256(source),
    jobs
  };
}

function validateLedgerAgainstJob(ledger, source, job, planData, image, label, errors) {
  checkExactKeys(ledger, LEDGER_TOP_LEVEL_KEYS, label, errors);
  checkExactKeys(ledger?.generation, LEDGER_GENERATION_KEYS, `${label}.generation`, errors);
  checkExactKeys(ledger?.lore, LEDGER_LORE_KEYS, `${label}.lore`, errors);
  checkExactKeys(ledger?.image, LEDGER_IMAGE_KEYS, `${label}.image`, errors);
  checkExactKeys(ledger?.plan, LEDGER_PLAN_KEYS, `${label}.plan`, errors);
  check(
    source === canonicalJson(ledger),
    `${label} is not canonically serialized as two-space JSON with a final LF`,
    errors
  );

  checkEqual(ledger?.schemaVersion, 1, `${label}.schemaVersion`, errors);
  for (const field of [
    'assetId',
    'worldKey',
    'universe',
    'category',
    'entityName',
    'destination',
    'repositoryPath'
  ]) {
    checkEqual(ledger?.[field], job[field], `${label}.${field}`, errors);
  }

  checkEqual(
    ledger?.generation?.provider,
    EXPECTED_GENERATOR.provider,
    `${label}.generation.provider`,
    errors
  );
  checkEqual(
    ledger?.generation?.interface,
    EXPECTED_GENERATOR.interface,
    `${label}.generation.interface`,
    errors
  );
  checkEqual(
    ledger?.generation?.model,
    EXPECTED_GENERATOR.model,
    `${label}.generation.model`,
    errors
  );
  checkEqual(
    ledger?.generation?.promptSha256,
    job.promptSha256,
    `${label}.generation.promptSha256`,
    errors
  );
  check(
    isCanonicalIsoDate(ledger?.generation?.date),
    `${label}.generation.date must be canonical ISO-8601`,
    errors
  );

  checkEqual(
    ledger?.lore?.sourceManifest,
    planData.plan.source?.manifest,
    `${label}.lore.sourceManifest`,
    errors
  );
  checkEqual(
    ledger?.lore?.sourceManifestSha256,
    planData.plan.source?.manifestSha256,
    `${label}.lore.sourceManifestSha256`,
    errors
  );
  checkArrayEqual(
    ledger?.lore?.references,
    job.loreReferences,
    `${label}.lore.references`,
    errors
  );

  check(
    typeof ledger?.plan?.id === 'string' && ledger.plan.id.trim() === ledger.plan.id
      && ledger.plan.id.length > 0,
    `${label}.plan.id must be a non-empty canonical string`,
    errors
  );
  check(
    SHA256_PATTERN.test(ledger?.plan?.sha256 || ''),
    `${label}.plan.sha256 is invalid`,
    errors
  );
  check(
    isCanonicalIsoDate(ledger?.installedAt),
    `${label}.installedAt must be canonical ISO-8601`,
    errors
  );

  checkEqual(ledger?.image?.format, 'PNG', `${label}.image.format`, errors);
  checkEqual(ledger?.image?.sha256, image.sha256, `${label}.image.sha256`, errors);
  checkEqual(ledger?.image?.bytes, image.bytes, `${label}.image.bytes`, errors);
  checkEqual(ledger?.image?.width, image.width, `${label}.image.width`, errors);
  checkEqual(ledger?.image?.height, image.height, `${label}.image.height`, errors);
  checkEqual(ledger?.image?.bitDepth, image.bitDepth, `${label}.image.bitDepth`, errors);
  checkEqual(ledger?.image?.colorType, image.colorType, `${label}.image.colorType`, errors);
  check(
    typeof ledger?.image?.sourceFileName === 'string'
      && ledger.image.sourceFileName.trim().length > 0,
    `${label}.image.sourceFileName must be recorded`,
    errors
  );
}

async function loadAndValidateSnapshot(options) {
  const errors = [];
  const planData = await loadAndValidatePlan(options.plan, errors);
  if (!planData || errors.length > 0) throw validationFailure(errors);

  const entriesDirectory = path.join(options.ledgerRoot, 'entries');
  let directoryEntries = [];
  try {
    directoryEntries = await readdir(entriesDirectory, { withFileTypes: true });
  } catch (error) {
    errors.push(`ledger entries directory cannot be read: ${error.message}`);
  }

  try {
    const ledgerRootEntries = await readdir(options.ledgerRoot, { withFileTypes: true });
    const abandoned = ledgerRootEntries
      .map(entry => entry.name)
      .filter(name => name.startsWith(TRANSACTION_PREFIX));
    check(
      abandoned.length === 0,
      `abandoned refresh transaction(s) require inspection: ${abandoned.join(', ')}`,
      errors
    );
  } catch (error) {
    errors.push(`ledger root cannot be read: ${error.message}`);
  }

  const expectedFileNames = new Set(
    planData.jobs.map(job => `${sha256(job.assetId || '')}.json`)
  );
  const actualFileNames = new Set(
    directoryEntries
      .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
      .map(entry => entry.name)
  );
  checkEqual(actualFileNames.size, EXPECTED_JOB_COUNT, 'ledger JSON file count', errors);
  for (const expected of expectedFileNames) {
    check(actualFileNames.has(expected), `missing provenance sidecar ${expected}`, errors);
  }
  for (const entry of directoryEntries) {
    check(
      entry.isFile() && expectedFileNames.has(entry.name),
      `unexpected ledger entries item ${entry.name}`,
      errors
    );
  }

  const snapshots = [];
  const imageHashes = [];
  for (const job of planData.jobs) {
    const fileName = `${sha256(job.assetId || '')}.json`;
    const entryPath = path.join(entriesDirectory, fileName);
    const lockPath = path.join(entriesDirectory, `${sha256(job.assetId || '')}.lock`);
    const imagePath = resolveRepositoryPath(
      job.repositoryPath,
      `${job.assetId}.repositoryPath`,
      errors,
      'public/'
    );

    let image = null;
    if (imagePath) {
      try {
        const buffer = await readFile(imagePath);
        const header = inspectPng(buffer, job.repositoryPath);
        image = {
          path: imagePath,
          sha256: sha256(buffer),
          bytes: buffer.length,
          ...header
        };
        imageHashes.push(image.sha256);

        const geometry = EXPECTED_IMAGE_GEOMETRY[job.category];
        check(Boolean(geometry), `${job.assetId} has no image geometry contract`, errors);
        if (geometry) {
          check(
            image.width >= geometry.minimumWidth && image.height >= geometry.minimumHeight,
            `${job.repositoryPath} is undersized for ${job.category}: `
              + `${image.width}x${image.height}`,
            errors
          );
          check(
            Math.abs((image.width / image.height) - geometry.ratio)
              <= ASPECT_RATIO_TOLERANCE,
            `${job.repositoryPath} has the wrong ${job.category} aspect ratio: `
              + `${image.width}x${image.height}`,
            errors
          );
        }
      } catch (error) {
        errors.push(`${job.repositoryPath} is not a valid readable PNG: ${error.message}`);
      }
    }

    let source;
    let ledger;
    if (actualFileNames.has(fileName)) {
      try {
        source = await readFile(entryPath, 'utf8');
        ledger = JSON.parse(source);
      } catch (error) {
        errors.push(`${fileName} cannot be read as JSON: ${error.message}`);
      }
    }

    if (!image || !source || !ledger) continue;
    const label = `ledger ${job.assetId}`;
    validateLedgerAgainstJob(
      ledger,
      source,
      job,
      planData,
      image,
      label,
      errors
    );

    const updated = {
      ...ledger,
      plan: {
        ...ledger.plan,
        id: planData.plan.planId,
        sha256: planData.sha256
      }
    };
    const changedPaths = collectChangedPaths(ledger, updated).sort();
    check(
      changedPaths.every(changedPath => (
        changedPath === 'plan.id' || changedPath === 'plan.sha256'
      )),
      `${label} refresh would change forbidden field(s): ${changedPaths.join(', ')}`,
      errors
    );

    snapshots.push({
      assetId: job.assetId,
      fileName,
      entryPath,
      lockPath,
      imagePath,
      imageSha256: image.sha256,
      imageBytes: image.bytes,
      source,
      sourceSha256: sha256(source),
      updatedSource: canonicalJson(updated),
      updatedSourceSha256: sha256(canonicalJson(updated)),
      stale: ledger.plan.id !== planData.plan.planId
        || ledger.plan.sha256 !== planData.sha256
    });
  }

  checkEqual(snapshots.length, EXPECTED_JOB_COUNT, 'validated ledger snapshot count', errors);
  checkUnique(imageHashes, 'installed PNG encoded hashes', errors);
  if (errors.length > 0) throw validationFailure(errors);

  return {
    planData,
    entriesDirectory,
    entries: snapshots.sort((left, right) => left.fileName.localeCompare(right.fileName))
  };
}

async function acquireAssetLocks(entries) {
  const locks = [];
  try {
    for (const entry of entries) {
      let handle;
      try {
        handle = await open(entry.lockPath, 'wx');
        await handle.writeFile(canonicalJson({
          operation: 'refresh-original-universe-ledger-plan',
          assetId: entry.assetId,
          processId: process.pid,
          acquiredAt: new Date().toISOString()
        }));
        locks.push({ handle, path: entry.lockPath });
      } catch (error) {
        if (handle) {
          await handle.close().catch(() => {});
          await unlink(entry.lockPath).catch(() => {});
        }
        throw new Error(`cannot acquire ${path.basename(entry.lockPath)}: ${error.message}`);
      }
    }
    return locks;
  } catch (error) {
    await releaseAssetLocks(locks);
    throw error;
  }
}

async function releaseAssetLocks(locks) {
  const failures = [];
  for (const lock of [...locks].reverse()) {
    await lock.handle.close().catch(error => {
      failures.push(`${path.basename(lock.path)} close: ${error.message}`);
    });
    await unlink(lock.path).catch(error => {
      if (error?.code !== 'ENOENT') {
        failures.push(`${path.basename(lock.path)} remove: ${error.message}`);
      }
    });
  }
  return failures;
}

async function verifySnapshotUnchanged(snapshot) {
  const errors = [];
  try {
    const planSource = await readFile(snapshot.planData.path || DEFAULT_PLAN, 'utf8');
    checkEqual(
      sha256(planSource),
      snapshot.planData.sha256,
      'generation plan changed after validation',
      errors
    );
  } catch (error) {
    errors.push(`generation plan cannot be re-read: ${error.message}`);
  }

  const expectedDirectoryNames = new Set(
    snapshot.entries.flatMap(entry => [entry.fileName, path.basename(entry.lockPath)])
  );
  try {
    const directoryEntries = await readdir(snapshot.entriesDirectory, { withFileTypes: true });
    for (const entry of directoryEntries) {
      check(
        entry.isFile() && expectedDirectoryNames.has(entry.name),
        `ledger entries directory changed after validation: ${entry.name}`,
        errors
      );
    }
    checkEqual(
      directoryEntries.length,
      expectedDirectoryNames.size,
      'ledger entries directory item count after locking',
      errors
    );
  } catch (error) {
    errors.push(`ledger entries directory cannot be re-read: ${error.message}`);
  }

  for (const entry of snapshot.entries) {
    try {
      const source = await readFile(entry.entryPath, 'utf8');
      checkEqual(
        sha256(source),
        entry.sourceSha256,
        `${entry.fileName} changed after validation`,
        errors
      );
    } catch (error) {
      errors.push(`${entry.fileName} cannot be re-read: ${error.message}`);
    }

    try {
      const image = await readFile(entry.imagePath);
      checkEqual(
        image.length,
        entry.imageBytes,
        `${entry.assetId} PNG byte count changed after validation`,
        errors
      );
      checkEqual(
        sha256(image),
        entry.imageSha256,
        `${entry.assetId} PNG changed after validation`,
        errors
      );
    } catch (error) {
      errors.push(`${entry.assetId} PNG cannot be re-read: ${error.message}`);
    }
  }

  if (errors.length > 0) throw validationFailure(errors);
}

async function stageUpdatedEntries(staleEntries, transactionRoot) {
  const stagedDirectory = path.join(transactionRoot, 'staged');
  const backupDirectory = path.join(transactionRoot, 'backups');
  await mkdir(stagedDirectory, { recursive: true });
  await mkdir(backupDirectory, { recursive: true });

  for (const entry of staleEntries) {
    const stagedPath = path.join(stagedDirectory, entry.fileName);
    await writeFile(stagedPath, entry.updatedSource, { encoding: 'utf8', flag: 'wx' });
    const stagedSource = await readFile(stagedPath, 'utf8');
    if (sha256(stagedSource) !== entry.updatedSourceSha256) {
      throw new Error(`staged sidecar verification failed for ${entry.fileName}`);
    }
  }

  return { stagedDirectory, backupDirectory };
}

async function unlinkIfPresent(filePath) {
  await unlink(filePath).catch(error => {
    if (error?.code !== 'ENOENT') throw error;
  });
}

async function rollbackReplacements(states) {
  const errors = [];
  for (const state of [...states].reverse()) {
    if (!state.originalMoved) continue;
    try {
      await unlinkIfPresent(state.entry.entryPath);
      await rename(state.backupPath, state.entry.entryPath);
      const restored = await readFile(state.entry.entryPath, 'utf8');
      if (sha256(restored) !== state.entry.sourceSha256) {
        throw new Error('restored content hash does not match the validated original');
      }
    } catch (error) {
      errors.push(`${state.entry.fileName}: ${error.message}`);
    }
  }
  return errors;
}

async function verifyCommittedSnapshot(snapshot) {
  const errors = [];
  try {
    const planSource = await readFile(snapshot.planData.path || DEFAULT_PLAN, 'utf8');
    checkEqual(
      sha256(planSource),
      snapshot.planData.sha256,
      'generation plan changed during commit',
      errors
    );
  } catch (error) {
    errors.push(`generation plan cannot be re-read after commit: ${error.message}`);
  }

  for (const entry of snapshot.entries) {
    try {
      const source = await readFile(entry.entryPath, 'utf8');
      const expectedSha = entry.stale ? entry.updatedSourceSha256 : entry.sourceSha256;
      checkEqual(
        sha256(source),
        expectedSha,
        `${entry.fileName} committed content`,
        errors
      );
    } catch (error) {
      errors.push(`${entry.fileName} cannot be verified after commit: ${error.message}`);
    }
  }
  if (errors.length > 0) throw validationFailure(errors);
}

async function commitStagedEntries(snapshot, staleEntries, directories) {
  const states = [];
  try {
    for (const entry of staleEntries) {
      const state = {
        entry,
        stagedPath: path.join(directories.stagedDirectory, entry.fileName),
        backupPath: path.join(directories.backupDirectory, entry.fileName),
        originalMoved: false,
        replacementInstalled: false
      };
      states.push(state);

      await rename(entry.entryPath, state.backupPath);
      state.originalMoved = true;
      await rename(state.stagedPath, entry.entryPath);
      state.replacementInstalled = true;
    }
    await verifyCommittedSnapshot(snapshot);
  } catch (error) {
    const rollbackErrors = await rollbackReplacements(states);
    if (rollbackErrors.length > 0) {
      const recoveryError = new Error(
        `${error.message}\nrollback also failed:\n`
          + rollbackErrors.map(message => `- ${message}`).join('\n')
      );
      recoveryError.preserveTransaction = true;
      throw recoveryError;
    }
    throw error;
  }
}

async function refreshPlanLinks(snapshot, ledgerRoot) {
  const staleEntries = snapshot.entries.filter(entry => entry.stale);
  if (staleEntries.length === 0) {
    console.log(
      '[refresh-original-universe-ledger-plan] OK: all 500 sidecars already link '
      + 'to the current plan.'
    );
    return;
  }

  const locks = await acquireAssetLocks(snapshot.entries);
  const transactionRoot = path.join(
    ledgerRoot,
    `${TRANSACTION_PREFIX}${process.pid}-${Date.now()}`
  );
  let preserveTransaction = false;
  let transactionCreated = false;

  try {
    await verifySnapshotUnchanged(snapshot);
    transactionCreated = true;
    const directories = await stageUpdatedEntries(staleEntries, transactionRoot);
    await verifySnapshotUnchanged(snapshot);
    await commitStagedEntries(snapshot, staleEntries, directories);
    await rm(transactionRoot, { recursive: true, force: true });
    transactionCreated = false;
  } catch (error) {
    preserveTransaction = error?.preserveTransaction === true;
    if (transactionCreated && !preserveTransaction) {
      await rm(transactionRoot, { recursive: true, force: true }).catch(() => {});
    }
    throw error;
  } finally {
    const releaseFailures = await releaseAssetLocks(locks);
    if (releaseFailures.length > 0) {
      console.warn(
        '[refresh-original-universe-ledger-plan] lock cleanup warning:\n'
          + releaseFailures.map(message => `- ${message}`).join('\n')
      );
    }
    if (preserveTransaction) {
      console.error(
        `[refresh-original-universe-ledger-plan] recovery data preserved at `
          + `${path.relative(REPOSITORY_ROOT, transactionRoot).split(path.sep).join('/')}`
      );
    }
  }

  console.log(
    `[refresh-original-universe-ledger-plan] OK: ${staleEntries.length} stale sidecar(s) `
      + `updated; all ${EXPECTED_JOB_COUNT} sidecars validated against plan `
      + `${snapshot.planData.sha256}.`
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  options.plan = assertInsideRepository(options.plan, '--plan');
  options.ledgerRoot = assertInsideRepository(options.ledgerRoot, '--ledger-root');
  const snapshot = await loadAndValidateSnapshot(options);
  snapshot.planData.path = options.plan;

  const staleEntries = snapshot.entries.filter(entry => entry.stale);
  if (options.check) {
    if (staleEntries.length > 0) {
      throw validationFailure([
        `${staleEntries.length} sidecar(s) do not link to current plan `
          + `${snapshot.planData.sha256}`
      ]);
    }
    console.log(
      `[refresh-original-universe-ledger-plan] CHECK OK: all ${EXPECTED_JOB_COUNT} `
        + `sidecars and PNGs validate against plan ${snapshot.planData.sha256}.`
    );
    return;
  }

  await refreshPlanLinks(snapshot, options.ledgerRoot);
}

main().catch(error => {
  console.error(`[refresh-original-universe-ledger-plan] ${error.message}`);
  process.exitCode = 1;
});
