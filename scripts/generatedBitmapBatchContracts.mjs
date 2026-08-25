import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const HASH_PATTERN = /^[a-f0-9]{64}$/u;

const isPlainObject = value => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
);

const identityFor = job => `${job.kind}:${job.id}`;
const sha256 = value => createHash('sha256').update(value).digest('hex');
const normalizedOutputKey = output => path.posix.normalize(output.replaceAll('\\', '/'));

const requiredTrimmedString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (value !== value.trim()) throw new Error(`${label} cannot contain surrounding whitespace`);
  return value;
};

const positiveInteger = (value, label) => {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
};

export const requiredSha256 = (value, label) => {
  const normalized = requiredTrimmedString(value, label);
  if (!HASH_PATTERN.test(normalized)) {
    throw new Error(`${label} must be a lowercase SHA-256 digest`);
  }
  return normalized;
};

export async function assertInstallBatchProvenance(batch) {
  for (const job of batch.jobs) {
    const identity = identityFor(job);
    requiredSha256(
      job.generationPromptSha256,
      `${batch.path}: ${identity} generationPromptSha256`
    );
    requiredSha256(
      job.catalogPromptSha256,
      `${batch.path}: ${identity} catalogPromptSha256`
    );
    const promptSha256 = sha256(await readFile(job.generationPromptFile));
    if (promptSha256 !== job.generationPromptSha256) {
      throw new Error(`${batch.path}: ${identity} generation prompt hash mismatch`);
    }
  }
}

export async function loadGenerationCatalog(catalogPath, options = {}) {
  const cwd = options.cwd || process.cwd();
  const expectedCount = positiveInteger(options.expectedCount, 'expectedCount');
  const absolutePath = path.resolve(cwd, catalogPath);
  let document;
  try {
    document = JSON.parse(await readFile(absolutePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`Catalog does not exist: ${absolutePath}`);
    throw new Error(`Invalid catalog JSON in ${absolutePath}: ${error.message}`);
  }
  if (!isPlainObject(document) || document.schemaVersion !== 1) {
    throw new Error(`${absolutePath}: catalog schemaVersion must be 1`);
  }
  const promptCatalogSha256 = requiredSha256(
    document.promptCatalogSha256,
    `${absolutePath}: promptCatalogSha256`
  );
  if (!Array.isArray(document.jobs) || document.jobs.length !== expectedCount) {
    throw new Error(`${absolutePath}: catalog must contain exactly ${expectedCount} jobs`);
  }

  const jobsByIdentity = new Map();
  const outputs = new Set();
  const sequences = new Set();
  for (let index = 0; index < document.jobs.length; index += 1) {
    const rawJob = document.jobs[index];
    const label = `${absolutePath}: jobs[${index}]`;
    if (!isPlainObject(rawJob)) throw new Error(`${label} must be an object`);
    const job = {
      sequence: positiveInteger(rawJob.sequence, `${label}.sequence`),
      kind: requiredTrimmedString(rawJob.kind, `${label}.kind`),
      id: requiredTrimmedString(rawJob.id, `${label}.id`),
      output: requiredTrimmedString(rawJob.output, `${label}.output`),
      catalogPromptSha256: requiredSha256(
        rawJob.sourcePromptSha256,
        `${label}.sourcePromptSha256`
      )
    };
    const identity = identityFor(job);
    if (jobsByIdentity.has(identity)) {
      throw new Error(`${absolutePath}: duplicate catalog identity: ${identity}`);
    }
    const outputKey = normalizedOutputKey(job.output);
    if (outputs.has(outputKey)) {
      throw new Error(`${absolutePath}: duplicate catalog output: ${job.output}`);
    }
    if (sequences.has(job.sequence)) {
      throw new Error(`${absolutePath}: duplicate catalog sequence: ${job.sequence}`);
    }
    jobsByIdentity.set(identity, job);
    outputs.add(outputKey);
    sequences.add(job.sequence);
  }
  for (let sequence = 1; sequence <= expectedCount; sequence += 1) {
    if (!sequences.has(sequence)) {
      throw new Error(`${absolutePath}: catalog sequences must be contiguous 1..${expectedCount}`);
    }
  }
  return { absolutePath, document, promptCatalogSha256, jobsByIdentity };
}

export const assertCatalogContract = (job, catalog, label) => {
  const identity = identityFor(job);
  const catalogJob = catalog.jobsByIdentity.get(identity);
  if (!catalogJob) throw new Error(`${label}: ${identity} is absent from --catalog`);
  if (job.sequence !== catalogJob.sequence) {
    throw new Error(`${label}: catalog sequence drift for ${identity}`);
  }
  if (job.output !== catalogJob.output) {
    throw new Error(`${label}: catalog output drift for ${identity}`);
  }
  if (job.catalogPromptSha256 !== catalogJob.catalogPromptSha256) {
    throw new Error(`${label}: catalog prompt hash drift for ${identity}`);
  }
};
