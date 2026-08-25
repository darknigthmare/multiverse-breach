import { createHash, randomUUID } from 'node:crypto';
import {
  copyFile,
  mkdir,
  open,
  readFile,
  rename,
  rm,
  stat,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_BATCH_PATH = 'docs/openai-generation-prompts-2026-08-24/item-batch-500.json';
export const QUEUE_SCHEMA_VERSION = 1;

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const GENERATION_ID_PATTERN = /^exec-[A-Za-z0-9](?:[A-Za-z0-9-]{1,126})$/u;
const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const BATCH_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,126}[a-z0-9])?$/u;
const RESULT_STATUSES = new Set(['pending', 'failed', 'complete']);
const ALLOWED_ASSET_KINDS = new Set(['item', 'hero', 'enemy', 'boss', 'trial', 'finale', 'stage']);
const STALE_LOCK_MILLISECONDS = 30 * 60 * 1000;

const sha256 = value => createHash('sha256').update(value).digest('hex');
const nowIso = now => (typeof now === 'function' ? now() : new Date()).toISOString();

const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

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

const assertHash = (value, label) => {
  if (value != null && !HASH_PATTERN.test(String(value))) {
    throw new Error(`${label} must be a lowercase SHA-256 digest`);
  }
};

const safeJobId = value => {
  const slug = String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 96);
  if (!slug) throw new Error(`Job id cannot form a safe directory name: ${value}`);
  return slug;
};

const readJson = async file => {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`JSON file does not exist: ${file}`);
    throw error;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${file}: ${error.message}`);
  }
};

const atomicWriteJson = async (file, value) => {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = path.join(
    path.dirname(file),
    `.${path.basename(file)}.${process.pid}.${randomUUID()}.tmp`
  );
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx'
  });
  try {
    await rename(temporary, file);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
};

const statFile = async file => {
  try {
    const metadata = await stat(file);
    return metadata.isFile() ? metadata : null;
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
};

const assertPngSource = async file => {
  const metadata = await statFile(file);
  if (!metadata) throw new Error(`Source PNG does not exist or is not a file: ${file}`);
  if (path.extname(file).toLowerCase() !== '.png') {
    throw new Error(`Source must be a .png file: ${file}`);
  }
  const handle = await open(file, 'r');
  try {
    const header = Buffer.alloc(PNG_SIGNATURE.length);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    if (bytesRead !== header.length || !header.equals(PNG_SIGNATURE)) {
      throw new Error(`Source is not a valid PNG file: ${file}`);
    }
  } finally {
    await handle.close();
  }
  return metadata;
};

const sha256File = async file => sha256(await readFile(file));

const resolvePromptFile = (repositoryRoot, promptFile) => {
  if (typeof promptFile !== 'string' || !promptFile.trim()) {
    throw new Error('Every batch job must provide promptFile');
  }
  const resolved = path.resolve(repositoryRoot, promptFile);
  if (!isInside(repositoryRoot, resolved)) {
    throw new Error(`promptFile must stay inside the repository: ${promptFile}`);
  }
  return resolved;
};

export async function loadSpriteBatch(batchPath, options = {}) {
  const repositoryRoot = path.resolve(options.repositoryRoot || process.cwd());
  const absoluteBatchPath = path.resolve(repositoryRoot, batchPath || DEFAULT_BATCH_PATH);
  const batchFile = await readFile(absoluteBatchPath);
  let document;
  try {
    document = JSON.parse(batchFile.toString('utf8'));
  } catch (error) {
    throw new Error(`Invalid batch JSON in ${absoluteBatchPath}: ${error.message}`);
  }
  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('Batch JSON root must be an object');
  }
  if (!BATCH_ID_PATTERN.test(String(document.batchId || ''))) {
    throw new Error('batchId must be a safe lowercase filesystem identifier');
  }
  if (!Array.isArray(document.jobs) || document.jobs.length === 0) {
    throw new Error('Batch must contain at least one job');
  }

  const seenSequences = new Set();
  const seenIdentities = new Set();
  const seenOutputs = new Set();
  const jobs = [];
  for (const rawJob of document.jobs) {
    if (!rawJob || typeof rawJob !== 'object' || Array.isArray(rawJob)) {
      throw new Error('Every batch job must be an object');
    }
    const sequence = parsePositiveInteger(rawJob.sequence, 'job.sequence');
    const id = String(rawJob.id || '').trim();
    const kind = String(rawJob.kind || document.kind || 'item').trim();
    if (!id) throw new Error(`Job ${sequence} must provide id`);
    if (document.kind === 'mixed' && !rawJob.kind) {
      throw new Error(`Mixed batch job ${sequence}/${id} must provide kind explicitly`);
    }
    if (!kind || kind === 'mixed') throw new Error(`Job ${sequence}/${id} must provide a concrete kind`);
    if (!ALLOWED_ASSET_KINDS.has(kind)) throw new Error(`Unsupported job kind: ${kind}`);
    const identity = `${kind}:${id}`;
    const output = String(rawJob.output || '').trim();
    if (seenSequences.has(sequence)) throw new Error(`Duplicate job sequence: ${sequence}`);
    if (seenIdentities.has(identity)) throw new Error(`Duplicate job identity: ${identity}`);
    if (document.kind === 'mixed' && !output) {
      throw new Error(`Mixed batch job ${sequence}/${identity} must provide output`);
    }
    if (output && seenOutputs.has(output)) throw new Error(`Duplicate job output: ${output}`);
    seenSequences.add(sequence);
    seenIdentities.add(identity);
    if (output) seenOutputs.add(output);

    if (typeof rawJob.generationPrompt !== 'string' || !rawJob.generationPrompt) {
      throw new Error(`Job ${sequence}/${id} must provide generationPrompt`);
    }
    const promptFile = resolvePromptFile(repositoryRoot, rawJob.promptFile);
    const promptBytes = await readFile(promptFile);
    const generationPromptBytes = Buffer.from(rawJob.generationPrompt, 'utf8');
    if (!promptBytes.equals(generationPromptBytes)) {
      throw new Error(
        `Prompt file must be byte-identical to generationPrompt for job ${sequence}/${id}`
      );
    }
    const generationPromptSha256 = sha256(generationPromptBytes);
    assertHash(rawJob.generationPromptSha256, `Job ${sequence} generationPromptSha256`);
    if (
      rawJob.generationPromptSha256
      && rawJob.generationPromptSha256 !== generationPromptSha256
    ) {
      throw new Error(`generationPromptSha256 mismatch for job ${sequence}/${id}`);
    }
    assertHash(rawJob.sourcePromptSha256, `Job ${sequence} sourcePromptSha256`);

    jobs.push({
      ...rawJob,
      sequence,
      id,
      kind,
      promptFile: rawJob.promptFile,
      promptFileAbsolute: promptFile,
      generationPromptSha256,
      catalogPromptSha256: rawJob.sourcePromptSha256 || null,
      directorySlug: document.kind === 'mixed'
        ? safeJobId(`${kind}-${id}`)
        : safeJobId(id)
    });
  }
  jobs.sort((left, right) => left.sequence - right.sequence || left.id.localeCompare(right.id));

  return {
    document,
    repositoryRoot,
    batchPath: absoluteBatchPath,
    batchSha256: sha256(batchFile),
    batchId: String(document.batchId),
    kind: String(document.kind || 'item'),
    jobs
  };
}

const queuePaths = (batch, queueBase) => {
  const absoluteQueueBase = path.resolve(
    queueBase || path.join(batch.repositoryRoot, 'tmp', 'openai-sprite-batches')
  );
  const queueRoot = path.join(absoluteQueueBase, batch.batchId);
  if (!isInside(absoluteQueueBase, queueRoot)) throw new Error('Unsafe queue path');
  const width = Math.max(3, String(batch.jobs.at(-1)?.sequence || batch.jobs.length).length);
  const jobDirectory = job => path.join(
    queueRoot,
    'jobs',
    `${String(job.sequence).padStart(width, '0')}-${job.directorySlug}`
  );
  return {
    queueBase: absoluteQueueBase,
    queueRoot,
    metadata: path.join(queueRoot, 'queue.json'),
    installBatch: path.join(queueRoot, 'install-batch.json'),
    jobDirectory,
    result: job => path.join(jobDirectory(job), 'result.json'),
    lock: job => path.join(jobDirectory(job), '.lock')
  };
};

const queueMetadataFor = (batch, paths, createdAt) => ({
  schemaVersion: QUEUE_SCHEMA_VERSION,
  batchId: batch.batchId,
  kind: batch.kind,
  batchFile: isInside(batch.repositoryRoot, batch.batchPath)
    ? path.relative(batch.repositoryRoot, batch.batchPath).replaceAll('\\', '/')
    : batch.batchPath,
  batchSha256: batch.batchSha256,
  jobCount: batch.jobs.length,
  queueRoot: paths.queueRoot,
  createdAt
});

const validateQueueMetadata = (metadata, batch, paths) => {
  if (metadata.schemaVersion !== QUEUE_SCHEMA_VERSION) {
    throw new Error(`Unsupported queue schemaVersion: ${metadata.schemaVersion}`);
  }
  if (metadata.batchId !== batch.batchId) throw new Error('Queue batchId does not match batch JSON');
  if (metadata.kind !== batch.kind) throw new Error('Queue kind does not match batch JSON');
  if (metadata.batchSha256 !== batch.batchSha256) {
    throw new Error(
      'Batch JSON changed after queue initialization; use a new batchId to preserve resumability'
    );
  }
  if (metadata.jobCount !== batch.jobs.length) throw new Error('Queue job count does not match batch JSON');
  if (!samePath(metadata.queueRoot, paths.queueRoot)) throw new Error('Queue root metadata mismatch');
};

export async function initializeQueue(options = {}) {
  const batch = await loadSpriteBatch(options.batchPath, options);
  const paths = queuePaths(batch, options.queueBase);
  await mkdir(path.join(paths.queueRoot, 'jobs'), { recursive: true });

  const existingMetadataFile = await statFile(paths.metadata);
  if (existingMetadataFile) {
    const metadata = await readJson(paths.metadata);
    validateQueueMetadata(metadata, batch, paths);
    for (const job of batch.jobs) await mkdir(paths.jobDirectory(job), { recursive: true });
    return {
      command: 'init',
      batchId: batch.batchId,
      queueRoot: paths.queueRoot,
      jobs: batch.jobs.length,
      resumed: true,
      batchSha256: batch.batchSha256,
      createdAt: metadata.createdAt
    };
  }

  for (const job of batch.jobs) await mkdir(paths.jobDirectory(job), { recursive: true });
  const createdAt = nowIso(options.now);
  const metadata = queueMetadataFor(batch, paths, createdAt);
  await atomicWriteJson(paths.metadata, metadata);
  return {
    command: 'init',
    batchId: batch.batchId,
    queueRoot: paths.queueRoot,
    jobs: batch.jobs.length,
    resumed: false,
    batchSha256: batch.batchSha256,
    createdAt
  };
}

const loadQueueContext = async options => {
  const batch = await loadSpriteBatch(options.batchPath, options);
  const paths = queuePaths(batch, options.queueBase);
  const metadata = await readJson(paths.metadata);
  validateQueueMetadata(metadata, batch, paths);
  return { batch, paths, metadata };
};

const validateResult = (result, batch, job, paths) => {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error('result.json must contain an object');
  }
  if (result.schemaVersion !== QUEUE_SCHEMA_VERSION) throw new Error('Unsupported result schemaVersion');
  if (result.batchId !== batch.batchId) throw new Error('Result batchId mismatch');
  if (result.sequence !== job.sequence || result.kind !== job.kind || result.id !== job.id) throw new Error('Result job identity mismatch');
  if (!RESULT_STATUSES.has(result.status)) throw new Error(`Invalid result status: ${result.status}`);
  if (!Number.isSafeInteger(result.attempts) || result.attempts < 0) {
    throw new Error('Result attempts must be a non-negative integer');
  }
  if (!Number.isSafeInteger(result.retryCount) || result.retryCount < 0) {
    throw new Error('Result retryCount must be a non-negative integer');
  }
  if (result.status === 'complete') {
    if (!result.source?.rawPath || !isInside(paths.jobDirectory(job), path.resolve(result.source.rawPath))) {
      throw new Error('Complete result rawPath must stay inside its job directory');
    }
    assertHash(result.source.sha256, 'Result source.sha256');
    if (!GENERATION_ID_PATTERN.test(String(result.generationId || ''))) {
      throw new Error('Complete result generationId must match exec-*');
    }
  }
  return result;
};

const readJobState = async (context, job) => {
  const resultPath = context.paths.result(job);
  try {
    const result = validateResult(await readJson(resultPath), context.batch, job, context.paths);
    if (result.status === 'complete') {
      const rawMetadata = await statFile(result.source.rawPath);
      if (!rawMetadata || rawMetadata.size !== result.source.bytes) {
        return {
          status: 'invalid',
          result,
          error: 'Complete result raw PNG is missing or its byte count changed'
        };
      }
    }
    return { status: result.status, result, error: null };
  } catch (error) {
    if (error.message.startsWith('JSON file does not exist:')) {
      return { status: 'pending', result: null, error: null };
    }
    return { status: 'invalid', result: null, error: error.message };
  }
};

const collectStates = async context => {
  const states = [];
  for (const job of context.batch.jobs) {
    states.push({ job, ...(await readJobState(context, job)) });
  }
  return states;
};

const normalizeSelection = options => {
  let shardIndex = options.shardIndex == null ? null : Number(options.shardIndex);
  let shardCount = options.shardCount == null ? null : Number(options.shardCount);
  if (options.shard != null) {
    if (shardIndex != null || shardCount != null) throw new Error('Use --shard or shard index/count, not both');
    const match = /^(\d+)\/(\d+)$/u.exec(String(options.shard));
    if (!match) throw new Error('shard must use one-based N/TOTAL syntax, for example 1/10');
    shardIndex = Number(match[1]) - 1;
    shardCount = Number(match[2]);
  }
  if ((shardIndex == null) !== (shardCount == null)) {
    throw new Error('shardIndex and shardCount must be provided together');
  }
  if (shardCount != null) {
    if (!Number.isSafeInteger(shardCount) || shardCount < 1) throw new Error('shardCount must be positive');
    if (!Number.isSafeInteger(shardIndex) || shardIndex < 0 || shardIndex >= shardCount) {
      throw new Error('shardIndex must be zero-based and lower than shardCount');
    }
  }
  const from = options.from == null ? null : parsePositiveInteger(options.from, 'from');
  const to = options.to == null ? null : parsePositiveInteger(options.to, 'to');
  if (from != null && to != null && from > to) throw new Error('from cannot be greater than to');
  const limit = options.limit == null ? null : parsePositiveInteger(options.limit, 'limit');
  return { from, to, shardIndex, shardCount, limit };
};

const matchesSelection = (job, selection) => (
  (selection.from == null || job.sequence >= selection.from)
  && (selection.to == null || job.sequence <= selection.to)
  && (
    selection.shardCount == null
    || ((job.sequence - 1) % selection.shardCount) === selection.shardIndex
  )
);

const countStates = states => {
  const counts = {
    total: states.length,
    pending: 0,
    failed: 0,
    complete: 0,
    invalid: 0,
    attempts: 0,
    retries: 0,
    rawBytes: 0
  };
  for (const state of states) {
    counts[state.status] += 1;
    counts.attempts += state.result?.attempts || 0;
    counts.retries += state.result?.retryCount || 0;
    if (state.status === 'complete') counts.rawBytes += state.result.source.bytes;
  }
  return counts;
};

export async function listPendingJobs(options = {}) {
  const context = await loadQueueContext(options);
  const selection = normalizeSelection(options);
  const selectedStates = (await collectStates(context))
    .filter(state => matchesSelection(state.job, selection));
  const pendingStates = selectedStates.filter(state => state.status === 'pending');
  const returnedStates = selection.limit == null
    ? pendingStates
    : pendingStates.slice(0, selection.limit);
  return {
    command: 'pending',
    batchId: context.batch.batchId,
    queueRoot: context.paths.queueRoot,
    selection,
    counts: {
      ...countStates(selectedStates),
      returned: returnedStates.length
    },
    jobs: returnedStates.map(({ job, result }) => ({
      sequence: job.sequence,
      kind: job.kind,
      id: job.id,
      name: job.name || null,
      universe: job.universe || null,
      output: job.output || null,
      promptFile: job.promptFileAbsolute,
      generationPrompt: job.generationPrompt,
      generationPromptSha256: job.generationPromptSha256,
      catalogPromptSha256: job.catalogPromptSha256,
      referenceUrl: job.referenceUrl || null,
      referenceUrls: job.referenceUrls || [],
      visualAnchor: job.visualAnchor || null,
      attempts: result?.attempts || 0,
      retryCount: result?.retryCount || 0,
      resultFile: context.paths.result(job)
    }))
  };
}

const acquireJobLock = async (file, identity) => {
  await mkdir(path.dirname(file), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const handle = await open(file, 'wx');
      await handle.writeFile(`${JSON.stringify({ ...identity, pid: process.pid, acquiredAt: new Date().toISOString() })}\n`);
      return async () => {
        await handle.close();
        await rm(file, { force: true });
      };
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      const lockMetadata = await stat(file).catch(() => null);
      if (!lockMetadata || Date.now() - lockMetadata.mtimeMs > STALE_LOCK_MILLISECONDS) {
        await rm(file, { force: true });
        continue;
      }
      throw new Error(`Job is locked by another worker: ${file}`);
    }
  }
  throw new Error(`Unable to acquire job lock: ${file}`);
};

const getJob = (batch, sequenceValue) => {
  const sequence = parsePositiveInteger(sequenceValue, 'sequence');
  const job = batch.jobs.find(candidate => candidate.sequence === sequence);
  if (!job) throw new Error(`Unknown job sequence: ${sequence}`);
  return job;
};

const readMutableResult = async (context, job) => {
  const file = context.paths.result(job);
  if (!(await statFile(file))) return null;
  return validateResult(await readJson(file), context.batch, job, context.paths);
};

const baseResult = (context, job, previous) => ({
  schemaVersion: QUEUE_SCHEMA_VERSION,
  batchId: context.batch.batchId,
  sequence: job.sequence,
  kind: job.kind,
  id: job.id,
  generationPromptFile: job.promptFileAbsolute,
  promptSha256: job.generationPromptSha256,
  generationPromptSha256: job.generationPromptSha256,
  catalogPromptSha256: job.catalogPromptSha256,
  attempts: previous?.attempts || 0,
  retryCount: previous?.retryCount || 0,
  history: Array.isArray(previous?.history) ? [...previous.history] : []
});

const reserveAttemptDirectory = async (jobDirectory, startingAttempt) => {
  const attemptsRoot = path.join(jobDirectory, 'attempts');
  await mkdir(attemptsRoot, { recursive: true });
  let attempt = Math.max(1, startingAttempt);
  while (true) {
    const directory = path.join(attemptsRoot, String(attempt).padStart(3, '0'));
    try {
      await mkdir(directory);
      return { attempt, directory };
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      attempt += 1;
    }
  }
};

export async function ingestGeneratedResult(options = {}) {
  const context = await loadQueueContext(options);
  const job = getJob(context.batch, options.sequence);
  const source = path.resolve(options.source || '');
  if (!options.source) throw new Error('ingest requires source');
  if (!GENERATION_ID_PATTERN.test(String(options.generationId || ''))) {
    throw new Error('generationId must match exec-*');
  }
  const sourceMetadata = await assertPngSource(source);
  if (samePath(source, path.join(context.paths.jobDirectory(job), 'raw.png'))) {
    throw new Error('Source must be the original ImageGen PNG, not the queue destination');
  }
  const sourceSha256 = await sha256File(source);
  const release = await acquireJobLock(context.paths.lock(job), {
    command: 'ingest',
    batchId: context.batch.batchId,
    sequence: job.sequence
  });
  try {
    const previous = await readMutableResult(context, job);
    if (previous?.status === 'complete') {
      if (
        previous.generationId === options.generationId
        && previous.source?.sha256 === sourceSha256
        && await statFile(previous.source.rawPath)
      ) {
        return { command: 'ingest', resumed: true, result: previous };
      }
      throw new Error(`Job ${job.sequence}/${job.id} is already complete with a different result`);
    }
    if (previous?.status === 'failed') {
      throw new Error(`Job ${job.sequence}/${job.id} failed; record an explicit retry before ingesting again`);
    }

    const reservation = await reserveAttemptDirectory(
      context.paths.jobDirectory(job),
      (previous?.attempts || 0) + 1
    );
    const rawPath = path.join(reservation.directory, 'raw.png');
    const temporaryRaw = path.join(
      reservation.directory,
      `.raw.${process.pid}.${randomUUID()}.tmp.png`
    );
    await copyFile(source, temporaryRaw);
    try {
      const copiedMetadata = await assertPngSource(temporaryRaw);
      const copiedSha256 = await sha256File(temporaryRaw);
      if (copiedMetadata.size !== sourceMetadata.size || copiedSha256 !== sourceSha256) {
        throw new Error('Raw queue copy does not exactly match its source PNG');
      }
      await rename(temporaryRaw, rawPath);
    } catch (error) {
      await rm(temporaryRaw, { force: true });
      throw error;
    }

    const completedAt = nowIso(options.now);
    const result = {
      ...baseResult(context, job, previous),
      status: 'complete',
      attempts: reservation.attempt,
      generationId: String(options.generationId),
      source: {
        originalPath: source,
        rawPath,
        sha256: sourceSha256,
        bytes: sourceMetadata.size
      },
      lastError: null,
      completedAt,
      history: [
        ...(previous?.history || []),
        {
          event: 'completed',
          attempt: reservation.attempt,
          at: completedAt,
          generationId: String(options.generationId),
          sourceSha256
        }
      ]
    };
    await atomicWriteJson(context.paths.result(job), result);
    return { command: 'ingest', resumed: false, result };
  } finally {
    await release();
  }
}

export async function recordGenerationFailure(options = {}) {
  const context = await loadQueueContext(options);
  const job = getJob(context.batch, options.sequence);
  const message = String(options.error || '').trim();
  if (!message) throw new Error('fail requires a non-empty error message');
  if (options.generationId && !GENERATION_ID_PATTERN.test(String(options.generationId))) {
    throw new Error('generationId must match exec-* when provided');
  }
  const release = await acquireJobLock(context.paths.lock(job), {
    command: 'fail',
    batchId: context.batch.batchId,
    sequence: job.sequence
  });
  try {
    const previous = await readMutableResult(context, job);
    if (previous?.status === 'complete') throw new Error('Cannot fail a completed job');
    if (previous?.status === 'failed') throw new Error('Record a retry before another failed attempt');
    const failedAt = nowIso(options.now);
    const attempt = (previous?.attempts || 0) + 1;
    const failure = {
      message,
      at: failedAt,
      generationId: options.generationId ? String(options.generationId) : null
    };
    const result = {
      ...baseResult(context, job, previous),
      status: 'failed',
      attempts: attempt,
      generationId: failure.generationId,
      source: null,
      lastError: failure,
      failedAt,
      history: [
        ...(previous?.history || []),
        { event: 'failed', attempt, ...failure }
      ]
    };
    await atomicWriteJson(context.paths.result(job), result);
    return { command: 'fail', result };
  } finally {
    await release();
  }
}

export async function queueGenerationRetry(options = {}) {
  const context = await loadQueueContext(options);
  const job = getJob(context.batch, options.sequence);
  const release = await acquireJobLock(context.paths.lock(job), {
    command: 'retry',
    batchId: context.batch.batchId,
    sequence: job.sequence
  });
  try {
    const previous = await readMutableResult(context, job);
    if (!previous || previous.status !== 'failed') {
      throw new Error('Only a failed job can be queued for retry');
    }
    const queuedAt = nowIso(options.now);
    const reason = String(options.reason || 'manual retry').trim();
    const result = {
      ...baseResult(context, job, previous),
      status: 'pending',
      retryCount: previous.retryCount + 1,
      generationId: null,
      source: null,
      lastError: previous.lastError,
      retryQueuedAt: queuedAt,
      history: [
        ...(previous.history || []),
        {
          event: 'retry-queued',
          afterAttempt: previous.attempts,
          retry: previous.retryCount + 1,
          reason,
          at: queuedAt
        }
      ]
    };
    await atomicWriteJson(context.paths.result(job), result);
    return { command: 'retry', result };
  } finally {
    await release();
  }
}

export async function getQueueStatus(options = {}) {
  const context = await loadQueueContext(options);
  const states = await collectStates(context);
  const counts = countStates(states);
  const phase = counts.invalid > 0
    ? 'invalid'
    : counts.complete === counts.total
      ? 'complete'
      : counts.failed > 0
        ? 'blocked-on-failures'
        : counts.complete > 0 || counts.retries > 0
          ? 'in-progress'
          : 'initialized';
  return {
    command: 'status',
    schemaVersion: QUEUE_SCHEMA_VERSION,
    batchId: context.batch.batchId,
    batchSha256: context.batch.batchSha256,
    queueRoot: context.paths.queueRoot,
    phase,
    counts,
    nextPendingSequences: states
      .filter(state => state.status === 'pending')
      .slice(0, 20)
      .map(state => state.job.sequence),
    failed: states
      .filter(state => state.status === 'failed')
      .map(state => ({
        sequence: state.job.sequence,
        id: state.job.id,
        attempts: state.result.attempts,
        error: state.result.lastError?.message || null
      })),
    invalid: states
      .filter(state => state.status === 'invalid')
      .map(state => ({ sequence: state.job.sequence, id: state.job.id, error: state.error }))
  };
}

export async function exportInstallBatch(options = {}) {
  const context = await loadQueueContext(options);
  const states = await collectStates(context);
  const invalid = states.filter(state => state.status === 'invalid');
  if (invalid.length > 0) throw new Error('Cannot export while queue results are invalid');
  const complete = states.filter(state => state.status === 'complete');
  const output = path.resolve(options.output || context.paths.installBatch);
  const document = {
    schemaVersion: 1,
    batchId: context.batch.batchId,
    promptCatalogSha256: context.batch.document.promptCatalogSha256 || null,
    generatedAt: nowIso(options.now),
    counts: {
      total: states.length,
      complete: complete.length,
      remaining: states.length - complete.length
    },
    jobs: complete.map(({ job, result }) => ({
      sequence: job.sequence,
      kind: job.kind,
      id: job.id,
      output: job.output,
      source: result.source.rawPath,
      generationId: result.generationId,
      generationPromptFile: job.promptFileAbsolute,
      generationPromptSha256: job.generationPromptSha256,
      catalogPromptSha256: job.catalogPromptSha256,
      replace: false
    }))
  };
  await atomicWriteJson(output, document);
  return {
    command: 'export',
    batchId: context.batch.batchId,
    output,
    counts: document.counts
  };
}

export function parseQueueArguments(values) {
  const [command, ...rest] = values;
  if (!command || command.startsWith('--')) {
    throw new Error('First argument must be one of: init, pending, ingest, fail, retry, status, export');
  }
  const options = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith('--')) throw new Error(`Unknown argument: ${token}`);
    const equals = token.indexOf('=');
    const key = (equals === -1 ? token.slice(2) : token.slice(2, equals))
      .replace(/-([a-z])/gu, (_match, letter) => letter.toUpperCase());
    const value = equals === -1 ? rest[index + 1] : token.slice(equals + 1);
    if (value == null || (equals === -1 && value.startsWith('--'))) {
      throw new Error(`Missing value for ${token}`);
    }
    options[key] = value;
    if (equals === -1) index += 1;
  }
  options.batchPath = options.batch || DEFAULT_BATCH_PATH;
  return options;
}

export async function runQueueCommand(options) {
  switch (options.command) {
    case 'init': return initializeQueue(options);
    case 'pending': return listPendingJobs(options);
    case 'ingest': return ingestGeneratedResult(options);
    case 'fail': return recordGenerationFailure(options);
    case 'retry': return queueGenerationRetry(options);
    case 'status': return getQueueStatus(options);
    case 'export': return exportInstallBatch(options);
    default: throw new Error(`Unknown command: ${options.command}`);
  }
}

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  runQueueCommand(parseQueueArguments(process.argv.slice(2)))
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exitCode = 1;
    });
}
