import { randomUUID } from 'node:crypto';
import {
  mkdir,
  open,
  readFile,
  rename,
  rm,
  stat
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertCatalogContract,
  assertInstallBatchProvenance,
  loadGenerationCatalog,
  requiredSha256
} from './generatedBitmapBatchContracts.mjs';

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const GENERATION_ID_PATTERN = /^exec-[A-Za-z0-9](?:[A-Za-z0-9-]{1,126})$/u;
const ALLOWED_ASSET_KINDS = new Set([
  'item',
  'hero',
  'enemy',
  'boss',
  'trial',
  'finale',
  'stage'
]);
const MAXIMUM_JOB_COUNT = 500;

export const HELP = `Usage:
  node scripts/mergeGeneratedBitmapInstallBatches.mjs \\
    --base <install-batch.json> \\
    --overlay <correction-install-batch.json> [--overlay <next.json> ...] \\
    [--catalog <original-generation-manifest.json>] \
    --expected-count <count> \\
    --output <merged-install-batch.json>

Overlays are applied from left to right. A later job replaces an earlier job
with the same kind:id. New identities may complete a partial base export.
Existing identities cannot change sequence or output.`;

const isPlainObject = value => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
);

const compareText = (left, right) => (
  left < right ? -1 : left > right ? 1 : 0
);

const compareJobs = (left, right) => (
  left.sequence - right.sequence
  || compareText(left.kind, right.kind)
  || compareText(left.id, right.id)
);

const identityFor = job => `${job.kind}:${job.id}`;

const normalizedOutputKey = output => path.posix.normalize(output.replaceAll('\\', '/'));

const samePath = (left, right) => {
  const normalize = value => {
    const resolved = path.resolve(value);
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
  };
  return normalize(left) === normalize(right);
};

const parsePositiveInteger = (value, label) => {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
};

const assertOptionalHash = (value, label) => {
  if (value != null && !HASH_PATTERN.test(String(value))) {
    throw new Error(`${label} must be a lowercase SHA-256 digest or null`);
  }
};

const readJson = async file => {
  let bytes;
  try {
    bytes = await readFile(file);
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`JSON file does not exist: ${file}`);
    throw error;
  }
  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${file}: ${error.message}`);
  }
};

const assertExistingFile = async (file, label) => {
  let metadata;
  try {
    metadata = await stat(file);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(`${label} does not exist or is not a file: ${file}`);
    }
    throw error;
  }
  if (!metadata.isFile()) {
    throw new Error(`${label} does not exist or is not a file: ${file}`);
  }
};

const requiredTrimmedString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (value !== value.trim()) throw new Error(`${label} cannot contain surrounding whitespace`);
  return value;
};

const normalizeJob = (rawJob, batchDirectory, label) => {
  if (!isPlainObject(rawJob)) throw new Error(`${label} must be an object`);
  const sequence = parsePositiveInteger(rawJob.sequence, `${label}.sequence`);
  const kind = requiredTrimmedString(rawJob.kind, `${label}.kind`);
  const id = requiredTrimmedString(rawJob.id, `${label}.id`);
  const output = requiredTrimmedString(rawJob.output, `${label}.output`);
  const generationId = requiredTrimmedString(
    rawJob.generationId,
    `${label}.generationId`
  );
  if (!ALLOWED_ASSET_KINDS.has(kind)) throw new Error(`${label}.kind is unsupported: ${kind}`);
  if (!GENERATION_ID_PATTERN.test(generationId)) {
    throw new Error(`${label}.generationId must match exec-*`);
  }
  const sourceValue = requiredTrimmedString(rawJob.source, `${label}.source`);
  const promptValue = requiredTrimmedString(
    rawJob.generationPromptFile,
    `${label}.generationPromptFile`
  );
  if (rawJob.replace != null && typeof rawJob.replace !== 'boolean') {
    throw new Error(`${label}.replace must be a boolean when present`);
  }
  assertOptionalHash(rawJob.generationPromptSha256, `${label}.generationPromptSha256`);
  assertOptionalHash(rawJob.catalogPromptSha256, `${label}.catalogPromptSha256`);
  return {
    ...rawJob,
    sequence,
    kind,
    id,
    output,
    generationId,
    source: path.resolve(batchDirectory, sourceValue),
    generationPromptFile: path.resolve(batchDirectory, promptValue)
  };
};

export async function loadInstallBatch(batchPath, options = {}) {
  const absolutePath = path.resolve(options.cwd || process.cwd(), batchPath);
  const document = await readJson(absolutePath);
  if (!isPlainObject(document)) throw new Error(`${absolutePath}: JSON root must be an object`);
  if (document.schemaVersion !== 1) {
    throw new Error(`${absolutePath}: schemaVersion must be 1`);
  }
  requiredTrimmedString(document.batchId, `${absolutePath}: batchId`);
  assertOptionalHash(
    document.promptCatalogSha256,
    `${absolutePath}: promptCatalogSha256`
  );
  if (!Array.isArray(document.jobs) || document.jobs.length === 0) {
    throw new Error(`${absolutePath}: jobs must be a non-empty array`);
  }
  if (document.jobs.length > MAXIMUM_JOB_COUNT) {
    throw new Error(
      `${absolutePath}: jobs cannot exceed ${MAXIMUM_JOB_COUNT} entries`
    );
  }

  const batchDirectory = path.dirname(absolutePath);
  const jobs = document.jobs.map((rawJob, index) => normalizeJob(
    rawJob,
    batchDirectory,
    `${absolutePath}: jobs[${index}]`
  ));
  const identities = new Set();
  const outputs = new Set();
  for (const job of jobs) {
    const identity = identityFor(job);
    if (identities.has(identity)) {
      throw new Error(`${absolutePath}: duplicate job identity: ${identity}`);
    }
    identities.add(identity);
    const outputKey = normalizedOutputKey(job.output);
    if (outputs.has(outputKey)) {
      throw new Error(`${absolutePath}: duplicate job output: ${job.output}`);
    }
    outputs.add(outputKey);
  }
  await Promise.all(jobs.flatMap(job => [
    assertExistingFile(job.source, `${absolutePath}: ${identityFor(job)} source`),
    assertExistingFile(
      job.generationPromptFile,
      `${absolutePath}: ${identityFor(job)} generation prompt`
    )
  ]));
  return {
    path: absolutePath,
    document,
    jobs,
    promptCatalogSha256: document.promptCatalogSha256 ?? null
  };
}

const assertFinalUniqueness = jobs => {
  const identities = new Set();
  const outputs = new Map();
  const generationIds = new Map();
  const sequences = new Map();
  for (const job of jobs) {
    const identity = identityFor(job);
    if (identities.has(identity)) throw new Error(`Duplicate final identity: ${identity}`);
    identities.add(identity);

    const sequenceOwner = sequences.get(job.sequence);
    if (sequenceOwner) {
      throw new Error(
        `Duplicate final sequence ${job.sequence}: ${sequenceOwner} and ${identity}`
      );
    }
    sequences.set(job.sequence, identity);

    const outputKey = normalizedOutputKey(job.output);
    const outputOwner = outputs.get(outputKey);
    if (outputOwner) {
      throw new Error(`Duplicate final output ${job.output}: ${outputOwner} and ${identity}`);
    }
    outputs.set(outputKey, identity);

    const generationOwner = generationIds.get(job.generationId);
    if (generationOwner) {
      throw new Error(
        `Duplicate final generationId ${job.generationId}: ${generationOwner} and ${identity}`
      );
    }
    generationIds.set(job.generationId, identity);
  }
  const orderedSequences = [...sequences.keys()].sort((left, right) => left - right);
  for (let index = 0; index < orderedSequences.length; index += 1) {
    const expectedSequence = index + 1;
    if (orderedSequences[index] !== expectedSequence) {
      throw new Error(
        `Final sequences must be contiguous 1..${jobs.length}: `
        + `expected ${expectedSequence}, found ${orderedSequences[index]}`
      );
    }
  }
};

export async function buildMergedInstallBatch({
  basePath,
  overlayPaths,
  catalogPath = null,
  expectedCount,
  cwd = process.cwd()
}) {
  const normalizedExpectedCount = parsePositiveInteger(expectedCount, 'expectedCount');
  if (normalizedExpectedCount > MAXIMUM_JOB_COUNT) {
    throw new Error(`expectedCount cannot exceed ${MAXIMUM_JOB_COUNT}`);
  }
  if (!Array.isArray(overlayPaths) || overlayPaths.length === 0) {
    throw new Error('At least one overlay is required');
  }

  const base = await loadInstallBatch(basePath, { cwd });
  await assertInstallBatchProvenance(base);
  const basePromptCatalogSha256 = requiredSha256(
    base.promptCatalogSha256,
    `${base.path}: base promptCatalogSha256`
  );
  if (base.jobs.length > normalizedExpectedCount) {
    throw new Error(
      `Base contains ${base.jobs.length} jobs, above expectedCount ${normalizedExpectedCount}`
    );
  }
  const catalog = catalogPath
    ? await loadGenerationCatalog(catalogPath, {
        cwd,
        expectedCount: normalizedExpectedCount
      })
    : null;
  if (catalog && catalog.promptCatalogSha256 !== basePromptCatalogSha256) {
    throw new Error(`${catalog.absolutePath}: promptCatalogSha256 differs from base export`);
  }
  if (catalog) {
    for (const job of base.jobs) assertCatalogContract(job, catalog, base.path);
  }
  const overlays = [];
  for (const overlayPath of overlayPaths) {
    const overlay = await loadInstallBatch(overlayPath, { cwd });
    await assertInstallBatchProvenance(overlay);
    if (
      overlay.promptCatalogSha256
      && overlay.promptCatalogSha256 !== basePromptCatalogSha256
    ) {
      throw new Error(
        `${overlay.path}: promptCatalogSha256 differs from base export`
      );
    }
    if (catalog) {
      for (const job of overlay.jobs) assertCatalogContract(job, catalog, overlay.path);
    }
    overlays.push(overlay);
  }

  const jobsByIdentity = new Map();
  const contractsByIdentity = new Map();
  for (const job of base.jobs) {
    const identity = identityFor(job);
    jobsByIdentity.set(identity, job);
    contractsByIdentity.set(identity, {
      output: job.output,
      sequence: job.sequence,
      catalogPromptSha256: job.catalogPromptSha256
    });
  }

  let applications = 0;
  const addedIdentities = new Set();
  const replacedIdentities = new Set();
  for (const overlay of overlays) {
    for (const job of overlay.jobs) {
      const identity = identityFor(job);
      const contract = contractsByIdentity.get(identity);
      if (contract) {
        if (job.output !== contract.output) {
          throw new Error(
            `${overlay.path}: overlay cannot change output for ${identity}: `
            + `${contract.output} -> ${job.output}`
          );
        }
        if (job.sequence !== contract.sequence) {
          throw new Error(
            `${overlay.path}: overlay cannot change sequence for ${identity}: `
            + `${contract.sequence} -> ${job.sequence}`
          );
        }
        if (job.catalogPromptSha256 !== contract.catalogPromptSha256) {
          throw new Error(
            `${overlay.path}: overlay cannot change catalogPromptSha256 for ${identity}`
          );
        }
        replacedIdentities.add(identity);
      } else {
        if (!overlay.promptCatalogSha256 && !catalog) {
          throw new Error(
            `${overlay.path}: adding ${identity} from a null-catalog overlay requires --catalog`
          );
        }
        contractsByIdentity.set(identity, {
          output: job.output,
          sequence: job.sequence,
          catalogPromptSha256: job.catalogPromptSha256
        });
        addedIdentities.add(identity);
      }
      jobsByIdentity.set(identity, job);
      applications += 1;
    }
  }

  const jobs = [...jobsByIdentity.values()].sort(compareJobs);
  if (jobs.length !== normalizedExpectedCount) {
    throw new Error(
      `Merged job count ${jobs.length} does not match expectedCount ${normalizedExpectedCount}`
    );
  }
  assertFinalUniqueness(jobs);

  return {
    document: {
      ...base.document,
      counts: {
        total: jobs.length,
        complete: jobs.length,
        remaining: 0
      },
      jobs
    },
    base,
    overlays,
    summary: {
      batchId: base.document.batchId,
      expectedCount: normalizedExpectedCount,
      jobs: jobs.length,
      overlays: overlays.length,
      applications,
      added: addedIdentities.size,
      replaced: replacedIdentities.size
    }
  };
}

export async function atomicWriteJson(file, value) {
  const absolutePath = path.resolve(file);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(absolutePath),
    `.${path.basename(absolutePath)}.${process.pid}.${randomUUID()}.tmp`
  );
  let handle = null;
  try {
    handle = await open(temporaryPath, 'wx');
    await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await handle.sync();
    await handle.close();
    handle = null;
    await rename(temporaryPath, absolutePath);
  } catch (error) {
    if (handle) await handle.close().catch(() => {});
    await rm(temporaryPath, { force: true });
    throw error;
  }
  return absolutePath;
}

export async function mergeInstallBatchFiles({
  basePath,
  overlayPaths,
  catalogPath = null,
  expectedCount,
  outputPath,
  cwd = process.cwd()
}) {
  const absoluteOutputPath = path.resolve(cwd, outputPath);
  const inputPaths = [basePath, ...(overlayPaths || []), ...(catalogPath ? [catalogPath] : [])]
    .map(file => path.resolve(cwd, file));
  if (inputPaths.some(file => samePath(file, absoluteOutputPath))) {
    throw new Error('output must differ from every input batch path');
  }
  const merged = await buildMergedInstallBatch({
    basePath,
    overlayPaths,
    catalogPath,
    expectedCount,
    cwd
  });
  await atomicWriteJson(absoluteOutputPath, merged.document);
  return {
    ...merged.summary,
    output: absoluteOutputPath
  };
}

export function parseMergeArguments(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const parsed = { overlayPaths: [] };
  const seenSingles = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`Unknown argument: ${token}`);
    const equalsIndex = token.indexOf('=');
    const key = equalsIndex === -1 ? token.slice(2) : token.slice(2, equalsIndex);
    const value = equalsIndex === -1 ? argv[index + 1] : token.slice(equalsIndex + 1);
    if (!['base', 'overlay', 'catalog', 'output', 'expected-count'].includes(key)) {
      throw new Error(`Unknown argument: --${key}`);
    }
    if (!value || (equalsIndex === -1 && value.startsWith('--'))) {
      throw new Error(`Missing value for --${key}`);
    }
    if (equalsIndex === -1) index += 1;
    if (key === 'overlay') {
      parsed.overlayPaths.push(value);
      continue;
    }
    if (seenSingles.has(key)) throw new Error(`--${key} can only be provided once`);
    seenSingles.add(key);
    if (key === 'base') parsed.basePath = value;
    if (key === 'output') parsed.outputPath = value;
    if (key === 'catalog') parsed.catalogPath = value;
    if (key === 'expected-count') parsed.expectedCount = parsePositiveInteger(
      value,
      '--expected-count'
    );
  }
  for (const [property, flag] of [
    ['basePath', '--base'],
    ['outputPath', '--output'],
    ['expectedCount', '--expected-count']
  ]) {
    if (parsed[property] == null) throw new Error(`Missing ${flag}`);
  }
  if (parsed.overlayPaths.length === 0) throw new Error('At least one --overlay is required');
  return parsed;
}

export async function runCli(argv = process.argv.slice(2), options = {}) {
  const args = parseMergeArguments(argv);
  if (args.help) {
    console.log(HELP);
    return null;
  }
  const result = await mergeInstallBatchFiles({
    ...args,
    cwd: options.cwd || process.cwd()
  });
  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (
  process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  runCli().catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
