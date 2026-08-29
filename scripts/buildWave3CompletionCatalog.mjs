import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const WAVE_3_COMPLETION_SIZE = 500;

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const GENERATION_ID_PATTERN = /^exec-[a-z0-9](?:[a-z0-9-]{1,126})$/iu;

const HELP = [
  'Usage:',
  '  node scripts/buildWave3CompletionCatalog.mjs \\',
  '    --original-batch <batch.json> \\',
  '    --failed-sequences <72,73,...> \\',
  '    --replacement-batch <batch.json> [--replacement-batch <batch.json> ...] \\',
  '    --catalog-output <completion.json> \\',
  '    [--install-fragment <install-batch.json> ... --install-output <install.json>] \\',
  '    [--expected-count <positive integer>]',
  '',
  'The original batch must contain exactly --expected-count jobs (default 500). Replacement batches must',
  'contain exactly as many jobs as failed original sequences. Options accepting',
  'multiple files can be repeated. --failed-sequences-file accepts a JSON array.'
].join('\n');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const sha256File = file => sha256(readFileSync(file));
const identityOf = job => `${job.kind}:${String(job.id)}`;
const outputKey = output => String(output).replaceAll('\\', '/').toLowerCase();

const assertHash = (value, label) => {
  if (!HASH_PATTERN.test(String(value || ''))) {
    throw new Error(`${label} must be a lowercase SHA-256 hash`);
  }
};

const assertUnique = (values, label) => {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
};

const readJsonDocument = (file, label) => {
  const absolute = path.resolve(file);
  let document;
  try {
    document = JSON.parse(readFileSync(absolute, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read ${label} ${absolute}: ${error.message}`);
  }
  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error(`${label} root must be an object: ${absolute}`);
  }
  return { absolute, document, sha256: sha256File(absolute) };
};

const resolveRepositoryFile = (repositoryRoot, value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required`);
  const resolved = path.isAbsolute(value)
    ? path.normalize(value)
    : path.resolve(repositoryRoot, value);
  if (!existsSync(resolved)) throw new Error(`${label} does not exist: ${resolved}`);
  return resolved;
};

const validatePlannedBatch = ({ file, repositoryRoot, role }) => {
  const loaded = readJsonDocument(file, `${role} batch`);
  const document = loaded.document;
  if (document.schemaVersion !== 1) throw new Error(`${role} batch schemaVersion must be 1`);
  if (typeof document.batchId !== 'string' || !document.batchId.trim()) {
    throw new Error(`${role} batch requires batchId`);
  }
  assertHash(document.promptCatalogSha256, `${role} batch promptCatalogSha256`);
  if (!Array.isArray(document.jobs) || document.jobs.length === 0) {
    throw new Error(`${role} batch contains no jobs`);
  }

  const jobs = document.jobs.map((job, index) => {
    const label = `${role} batch job ${index + 1}`;
    if (!job || typeof job !== 'object' || Array.isArray(job)) {
      throw new Error(`${label} must be an object`);
    }
    if (!Number.isInteger(job.sequence) || job.sequence < 1) {
      throw new Error(`${label} requires a positive integer sequence`);
    }
    for (const key of ['kind', 'id', 'output', 'promptFile']) {
      if (job[key] == null || String(job[key]).trim() === '') {
        throw new Error(`${label} requires ${key}`);
      }
    }
    assertHash(job.generationPromptSha256, `${label} generationPromptSha256`);
    assertHash(job.sourcePromptSha256, `${label} sourcePromptSha256`);
    const promptFileAbsolute = resolveRepositoryFile(
      repositoryRoot,
      job.promptFile,
      `${label} promptFile`
    );
    const promptFileSha256 = sha256File(promptFileAbsolute);
    if (promptFileSha256 !== job.generationPromptSha256) {
      throw new Error(`${label} generation prompt file hash mismatch`);
    }
    if (typeof job.generationPrompt !== 'string' || job.generationPrompt.length === 0) {
      throw new Error(`${label} requires generationPrompt`);
    }
    if (sha256(Buffer.from(job.generationPrompt, 'utf8')) !== job.generationPromptSha256) {
      throw new Error(`${label} generationPrompt hash mismatch`);
    }
    return { ...job, promptFileAbsolute };
  });
  assertUnique(jobs.map(job => job.sequence), `${role} sequence`);
  assertUnique(jobs.map(identityOf), `${role} identity`);
  assertUnique(jobs.map(job => outputKey(job.output)), `${role} output`);
  jobs.sort((left, right) => left.sequence - right.sequence || identityOf(left).localeCompare(identityOf(right)));
  return {
    ...loaded,
    batchId: document.batchId,
    promptCatalogSha256: document.promptCatalogSha256,
    jobs
  };
};

const normalizeFailedSequences = (values, originalSequences) => {
  if (!Array.isArray(values)) throw new Error('failedSequences must be an array');
  const normalized = values.map(value => {
    const sequence = Number(value);
    if (!Number.isInteger(sequence) || sequence < 1) {
      throw new Error(`Invalid failed original sequence: ${value}`);
    }
    if (!originalSequences.has(sequence)) {
      throw new Error(`Failed original sequence is not in the original batch: ${sequence}`);
    }
    return sequence;
  }).sort((left, right) => left - right);
  assertUnique(normalized, 'failed original sequence');
  return normalized;
};

const publicPlannedJob = ({ job, sourceBatch, role, sequence }) => {
  const { sequence: sourceSequence, promptFileAbsolute: _promptFileAbsolute, ...contract } = job;
  return {
    sequence,
    ...contract,
    completionSource: {
      role,
      batchId: sourceBatch.batchId,
      batchSha256: sourceBatch.sha256,
      sourceSequence
    }
  };
};

export const buildCompletionCatalog = ({
  originalBatch,
  failedSequences,
  replacementBatches = [],
  repositoryRoot = process.cwd(),
  completionBatchId = null,
  expectedCount = WAVE_3_COMPLETION_SIZE
}) => {
  if (!Number.isInteger(expectedCount) || expectedCount < 1) {
    throw new Error('expectedCount must be a positive integer');
  }
  const root = path.resolve(repositoryRoot);
  const original = validatePlannedBatch({ file: originalBatch, repositoryRoot: root, role: 'original' });
  if (original.jobs.length !== expectedCount) {
    throw new Error(`Original batch must contain exactly ${expectedCount} jobs`);
  }
  const failed = normalizeFailedSequences(
    failedSequences,
    new Set(original.jobs.map(job => job.sequence))
  );
  const replacements = replacementBatches.map((file, index) => validatePlannedBatch({
    file,
    repositoryRoot: root,
    role: `replacement ${index + 1}`
  }));
  const allBatches = [original, ...replacements];
  for (const batch of allBatches) {
    if (batch.promptCatalogSha256 !== original.promptCatalogSha256) {
      throw new Error(
        `promptCatalogSha256 mismatch for batch ${batch.batchId}: `
        + `${batch.promptCatalogSha256} != ${original.promptCatalogSha256}`
      );
    }
  }
  const replacementJobs = replacements.flatMap(batch => (
    batch.jobs.map(job => ({ job, sourceBatch: batch }))
  ));
  if (replacementJobs.length !== failed.length) {
    throw new Error(
      `Replacement job count must equal failed original count: `
      + `${replacementJobs.length} != ${failed.length}`
    );
  }
  const failedSet = new Set(failed);
  const retained = original.jobs
    .filter(job => !failedSet.has(job.sequence))
    .map(job => ({ job, sourceBatch: original, role: 'original' }));
  const selected = [
    ...retained,
    ...replacementJobs.map(entry => ({ ...entry, role: 'replacement' }))
  ];
  if (selected.length !== expectedCount) {
    throw new Error(`Completion catalog must contain exactly ${expectedCount} jobs`);
  }
  assertUnique(selected.map(entry => identityOf(entry.job)), 'completion identity');
  assertUnique(selected.map(entry => outputKey(entry.job.output)), 'completion output');

  const jobs = selected.map((entry, index) => publicPlannedJob({
    ...entry,
    sequence: index + 1
  }));
  const batchId = completionBatchId || `${original.batchId}-completion`;
  if (typeof batchId !== 'string' || !batchId.trim()) throw new Error('completionBatchId is invalid');
  return {
    schemaVersion: 1,
    batchId,
    kind: 'mixed',
    promptCatalogSha256: original.promptCatalogSha256,
    completionPolicy: 'retain-successful-originals-then-append-exact-replacements',
    counts: {
      original: original.jobs.length,
      failedOriginal: failed.length,
      retainedOriginal: retained.length,
      replacement: replacementJobs.length,
      total: jobs.length
    },
    failedOriginalSequences: failed,
    sourceBatches: allBatches.map((batch, index) => ({
      role: index === 0 ? 'original' : 'replacement',
      batchId: batch.batchId,
      batchSha256: batch.sha256,
      jobCount: batch.jobs.length
    })),
    jobs
  };
};

const validateInstallFragment = ({ file, promptCatalogSha256 }) => {
  const loaded = readJsonDocument(file, 'install fragment');
  const document = loaded.document;
  if (document.schemaVersion !== 1) throw new Error('Install fragment schemaVersion must be 1');
  if (document.promptCatalogSha256 !== promptCatalogSha256) {
    throw new Error(`Install fragment promptCatalogSha256 mismatch: ${loaded.absolute}`);
  }
  if (!Array.isArray(document.jobs) || document.jobs.length === 0) {
    throw new Error(`Install fragment contains no jobs: ${loaded.absolute}`);
  }
  return document.jobs.map((job, index) => {
    const label = `Install fragment ${path.basename(loaded.absolute)} job ${index + 1}`;
    if (!job || typeof job !== 'object' || Array.isArray(job)) {
      throw new Error(`${label} must be an object`);
    }
    for (const key of [
      'kind',
      'id',
      'output',
      'source',
      'generationId',
      'generationPromptFile',
      'generationPromptSha256',
      'catalogPromptSha256'
    ]) {
      if (job[key] == null || String(job[key]).trim() === '') {
        throw new Error(`${label} requires ${key}`);
      }
    }
    if (!GENERATION_ID_PATTERN.test(String(job.generationId))) {
      throw new Error(`${label} has invalid built-in image_gen generationId`);
    }
    assertHash(job.generationPromptSha256, `${label} generationPromptSha256`);
    assertHash(job.catalogPromptSha256, `${label} catalogPromptSha256`);
    const baseDirectory = path.dirname(loaded.absolute);
    const source = path.isAbsolute(job.source)
      ? path.normalize(job.source)
      : path.resolve(baseDirectory, job.source);
    const generationPromptFile = path.isAbsolute(job.generationPromptFile)
      ? path.normalize(job.generationPromptFile)
      : path.resolve(baseDirectory, job.generationPromptFile);
    if (!existsSync(source)) throw new Error(`${label} source does not exist: ${source}`);
    if (!existsSync(generationPromptFile)) {
      throw new Error(`${label} generationPromptFile does not exist: ${generationPromptFile}`);
    }
    if (sha256File(generationPromptFile) !== job.generationPromptSha256) {
      throw new Error(`${label} generation prompt file hash mismatch`);
    }
    return {
      ...job,
      source,
      generationPromptFile,
      sourceSha256: sha256File(source),
      fragmentBatchId: document.batchId || null,
      fragmentSha256: loaded.sha256
    };
  });
};

export const buildCompletionInstallBatch = ({
  completionCatalog,
  installFragments
}) => {
  if (!completionCatalog || typeof completionCatalog !== 'object') {
    throw new Error('completionCatalog must be an object');
  }
  if (!Array.isArray(completionCatalog.jobs) || completionCatalog.jobs.length === 0) {
    throw new Error('completionCatalog contains no jobs');
  }
  assertHash(completionCatalog.promptCatalogSha256, 'completion promptCatalogSha256');
  if (!Array.isArray(installFragments) || installFragments.length === 0) {
    throw new Error('At least one install fragment is required');
  }
  const fragmentJobs = installFragments.flatMap(file => validateInstallFragment({
    file,
    promptCatalogSha256: completionCatalog.promptCatalogSha256
  }));
  assertUnique(fragmentJobs.map(identityOf), 'install identity');
  assertUnique(fragmentJobs.map(job => outputKey(job.output)), 'install output');
  assertUnique(fragmentJobs.map(job => String(job.generationId).toLowerCase()), 'generationId');

  const plannedByIdentity = new Map(completionCatalog.jobs.map(job => [identityOf(job), job]));
  for (const fragmentJob of fragmentJobs) {
    if (!plannedByIdentity.has(identityOf(fragmentJob))) {
      throw new Error(`Install fragment contains an unplanned identity: ${identityOf(fragmentJob)}`);
    }
  }
  if (fragmentJobs.length !== completionCatalog.jobs.length) {
    throw new Error(
      `Install fragments must provide exactly ${completionCatalog.jobs.length} jobs: `
      + `received ${fragmentJobs.length}`
    );
  }
  const fragmentByIdentity = new Map(fragmentJobs.map(job => [identityOf(job), job]));
  const jobs = completionCatalog.jobs.map((planned, index) => {
    const identity = identityOf(planned);
    const installed = fragmentByIdentity.get(identity);
    if (!installed) throw new Error(`Install fragments are missing completion identity: ${identity}`);
    if (outputKey(installed.output) !== outputKey(planned.output)) {
      throw new Error(`${identity}: install output differs from completion catalog`);
    }
    if (installed.generationPromptSha256 !== planned.generationPromptSha256) {
      throw new Error(`${identity}: generation prompt hash differs from completion catalog`);
    }
    if (installed.catalogPromptSha256 !== planned.sourcePromptSha256) {
      throw new Error(`${identity}: catalog prompt hash differs from completion catalog`);
    }
    return {
      sequence: index + 1,
      kind: installed.kind,
      id: installed.id,
      output: planned.output,
      source: installed.source,
      sourceSha256: installed.sourceSha256,
      generationId: installed.generationId,
      generationPromptFile: installed.generationPromptFile,
      generationPromptSha256: installed.generationPromptSha256,
      catalogPromptSha256: installed.catalogPromptSha256,
      replace: installed.replace === true,
      ...(installed.repairEnclosedNeutralBackground === true
        ? { repairEnclosedNeutralBackground: true }
        : {}),
      ...(installed.recomposeNineRadialTiles === true
        ? { recomposeNineRadialTiles: true }
        : {}),
      completionSource: planned.completionSource,
      generationSource: {
        batchId: installed.fragmentBatchId,
        fragmentSha256: installed.fragmentSha256
      }
    };
  });
  assertUnique(jobs.map(identityOf), 'completion install identity');
  assertUnique(jobs.map(job => outputKey(job.output)), 'completion install output');
  assertUnique(jobs.map(job => String(job.generationId).toLowerCase()), 'completion generationId');
  const catalogBytes = Buffer.from(JSON.stringify(completionCatalog, null, 2) + '\n', 'utf8');
  return {
    schemaVersion: 1,
    batchId: completionCatalog.batchId,
    promptCatalogSha256: completionCatalog.promptCatalogSha256,
    completionCatalogSha256: sha256(catalogBytes),
    counts: {
      total: jobs.length,
      complete: jobs.length,
      remaining: 0
    },
    jobs
  };
};

const writeJsonAtomic = (file, document) => {
  const absolute = path.resolve(file);
  mkdirSync(path.dirname(absolute), { recursive: true });
  const temporary = `${absolute}.tmp-${process.pid}`;
  try {
    writeFileSync(temporary, JSON.stringify(document, null, 2) + '\n', 'utf8');
    renameSync(temporary, absolute);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
  return absolute;
};

export const parseCompletionArguments = values => {
  const options = { replacementBatches: [], installFragments: [] };
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (token === '--help' || token === '-h') {
      options.help = true;
      continue;
    }
    if (!token.startsWith('--')) throw new Error(`Unknown argument: ${token}`);
    const equals = token.indexOf('=');
    const key = equals === -1 ? token.slice(2) : token.slice(2, equals);
    const value = equals === -1 ? values[index + 1] : token.slice(equals + 1);
    if (value == null || (equals === -1 && value.startsWith('--'))) {
      throw new Error(`Missing value for ${token}`);
    }
    if (equals === -1) index += 1;
    if (key === 'replacement-batch') options.replacementBatches.push(value);
    else if (key === 'install-fragment') options.installFragments.push(value);
    else options[key.replace(/-([a-z])/gu, (_match, letter) => letter.toUpperCase())] = value;
  }
  return options;
};

const readFailedSequenceFile = file => {
  const value = JSON.parse(readFileSync(path.resolve(file), 'utf8'));
  if (!Array.isArray(value)) throw new Error('--failed-sequences-file must contain a JSON array');
  return value;
};

const parseFailedSequences = options => {
  if (options.failedSequences && options.failedSequencesFile) {
    throw new Error('Use either --failed-sequences or --failed-sequences-file, not both');
  }
  if (options.failedSequencesFile) return readFailedSequenceFile(options.failedSequencesFile);
  if (options.failedSequences == null || options.failedSequences.trim() === '') return [];
  return options.failedSequences.split(',').map(value => value.trim()).filter(Boolean);
};

export const runCompletionCli = (argv = process.argv.slice(2)) => {
  const options = parseCompletionArguments(argv);
  if (options.help) {
    console.log(HELP);
    return null;
  }
  for (const key of ['originalBatch', 'catalogOutput']) {
    if (!options[key]) throw new Error(`Missing --${key.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`)}`);
  }
  if ((options.installFragments.length > 0) !== Boolean(options.installOutput)) {
    throw new Error('--install-fragment and --install-output must be provided together');
  }
  const repositoryRoot = path.resolve(options.repositoryRoot || process.cwd());
  const expectedCount = options.expectedCount == null
    ? WAVE_3_COMPLETION_SIZE
    : Number(options.expectedCount);
  if (!Number.isInteger(expectedCount) || expectedCount < 1) {
    throw new Error('--expected-count must be a positive integer');
  }
  const catalog = buildCompletionCatalog({
    originalBatch: options.originalBatch,
    failedSequences: parseFailedSequences(options),
    replacementBatches: options.replacementBatches,
    repositoryRoot,
    completionBatchId: options.completionBatchId || null,
    expectedCount
  });
  const catalogOutput = writeJsonAtomic(options.catalogOutput, catalog);
  let installOutput = null;
  if (options.installFragments.length > 0) {
    const installBatch = buildCompletionInstallBatch({
      completionCatalog: catalog,
      installFragments: options.installFragments,
      repositoryRoot
    });
    installOutput = writeJsonAtomic(options.installOutput, installBatch);
  }
  const result = {
    catalogOutput,
    installOutput,
    counts: catalog.counts
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runCompletionCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
