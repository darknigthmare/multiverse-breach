import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { atomicWriteJson } from './mergeGeneratedBitmapInstallBatches.mjs';

export const WAVE_5_COMPLETION_SIZE = 500;
export const WAVE_5_REPLACEMENT_SIZE = 3;
export const WAVE_5_VISUAL_CORRECTION_SIZE = 2;
export const COMPLETION_BATCH_ID = 'assets-rift-dossier-wave-5-completed-2026-08-30';

const scriptPath = fileURLToPath(import.meta.url);
const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const GENERATION_ID_PATTERN = /^exec-[A-Za-z0-9](?:[A-Za-z0-9-]{1,126})$/u;
const REQUIRED_OVERLAY_ORDER = Object.freeze([
  'wave-5-primary',
  'wave-5-safety-makeup',
  'wave-5-visual-corrections-v1'
]);

const sha256 = value => createHash('sha256').update(value).digest('hex');
const identityOf = job => `${job.kind}:${String(job.id)}`;
const outputKey = value => String(value).replaceAll('\\', '/').toLowerCase();
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};
const assertUnique = (values, label) => {
  const seen = new Set();
  for (const value of values) {
    assert(!seen.has(value), `Duplicate ${label}: ${value}`);
    seen.add(value);
  }
};
const promptContractSha256 = jobs => sha256(Buffer.from(JSON.stringify(
  jobs.map(job => ({ id: String(job.id), output: job.output, prompt: job.prompt }))
), 'utf8'));

const readJsonDocument = async (cwd, file, label) => {
  const absolute = path.isAbsolute(file) ? path.normalize(file) : path.resolve(cwd, file);
  const bytes = await fs.readFile(absolute);
  let document;
  try {
    document = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`Cannot parse ${label} ${absolute}: ${error.message}`);
  }
  assert(document && typeof document === 'object' && !Array.isArray(document), `${label} must be an object`);
  return { absolute, bytes, sha256: sha256(bytes), document };
};

const validateContiguousSequences = (jobs, label) => {
  const ordered = [...jobs].sort((left, right) => left.sequence - right.sequence);
  ordered.forEach((job, index) => {
    assert(job.sequence === index + 1, `${label} sequences must be contiguous 1..${jobs.length}`);
  });
  return ordered;
};

const validatePlannedBatch = ({ loaded, expectedCount, label }) => {
  const jobs = loaded.document.jobs;
  assert(loaded.document.schemaVersion === 1, `${label} schemaVersion must be 1`);
  assert(Array.isArray(jobs) && jobs.length === expectedCount, `${label} must contain exactly ${expectedCount} jobs`);
  assertUnique(jobs.map(identityOf), `${label} identity`);
  assertUnique(jobs.map(job => outputKey(job.output)), `${label} output`);
  assertUnique(jobs.map(job => job.sequence), `${label} sequence`);
  return validateContiguousSequences(jobs, label);
};

const readLedger = async file => {
  const text = await fs.readFile(file, 'utf8');
  const entries = text.split(/\r?\n/gu).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`Cannot parse provenance ledger line ${index + 1}: ${error.message}`);
    }
  });
  const byOutput = new Map();
  for (const entry of entries) {
    if (entry.kind !== 'rift-dossier-thumbnail' || !entry.output) continue;
    assert(!byOutput.has(entry.output), `Duplicate provenance output in ledger: ${entry.output}`);
    byOutput.set(entry.output, entry);
  }
  return byOutput;
};

const validatePrompt = async ({ root, planned, label }) => {
  assert(typeof planned.promptFile === 'string' && planned.promptFile.length > 0, `${label} promptFile is missing`);
  const promptFile = path.resolve(root, planned.promptFile);
  assert(isInside(root, promptFile), `${label} prompt escapes repository root`);
  const prompt = await fs.readFile(promptFile, 'utf8');
  const promptSha256 = sha256(Buffer.from(prompt, 'utf8'));
  assert(prompt === planned.generationPrompt, `${label} prompt file differs from the planned prompt`);
  assert(promptSha256 === planned.generationPromptSha256, `${label} planned prompt SHA drifted`);
  assert(promptSha256 === planned.sourcePromptSha256, `${label} catalog prompt SHA drifted`);
  return { promptFile: planned.promptFile.replaceAll('\\', '/'), prompt, promptSha256 };
};

const validateInstalledAsset = async ({ root, sourceJob, selected, prompt, promptSha256, ledgerEntry }) => {
  const label = identityOf(sourceJob);
  assert(ledgerEntry, `Installed provenance is missing for ${sourceJob.output}`);
  assert(ledgerEntry.assetId === sourceJob.assetId, `Installed assetId drifted for ${label}`);
  assert(Number(ledgerEntry.missionId) === Number(sourceJob.id), `Installed missionId drifted for ${label}`);
  assert(ledgerEntry.generation?.provider === 'OpenAI', `Installed provider drifted for ${label}`);
  assert(ledgerEntry.generation?.interface === 'built-in image_gen', `Installed interface drifted for ${label}`);
  assert(GENERATION_ID_PATTERN.test(String(ledgerEntry.generation?.generationId || '')), `Installed generationId is invalid for ${label}`);
  assert(ledgerEntry.generation?.promptSha256 === promptSha256, `Installed prompt SHA drifted for ${label}`);
  assert(ledgerEntry.prompt === prompt, `Installed prompt text drifted for ${label}`);
  assert(HASH_PATTERN.test(String(ledgerEntry.sourceImage?.sha256 || '')), `Source PNG SHA is invalid for ${label}`);
  assert(ledgerEntry.sourceImage?.format === 'PNG', `Source format drifted for ${label}`);
  assert(ledgerEntry.sourceImage?.width === 1672 && ledgerEntry.sourceImage?.height === 941, `Source dimensions drifted for ${label}`);

  if (selected.successfulGeneration) {
    assert(
      ledgerEntry.generation.generationId === selected.successfulGeneration.generationId,
      `Visual correction generationId drifted for ${label}`
    );
    assert(
      ledgerEntry.sourceImage.sha256 === selected.successfulGeneration.sourceImage?.sha256,
      `Visual correction source PNG SHA drifted for ${label}`
    );
  }

  const publicRoot = path.resolve(root, 'public');
  const destination = path.resolve(publicRoot, sourceJob.output.replace(/^\/+/, ''));
  assert(isInside(publicRoot, destination), `Completion output escapes public/: ${sourceJob.output}`);
  const bytes = await fs.readFile(destination);
  const metadata = await sharp(bytes).metadata();
  const runtimeSha256 = sha256(bytes);
  assert(metadata.format === 'webp', `Installed format drifted for ${label}`);
  assert(metadata.width === 640 && metadata.height === 360, `Installed dimensions drifted for ${label}`);
  assert(ledgerEntry.image?.format === 'WEBP', `Ledger runtime format drifted for ${label}`);
  assert(ledgerEntry.image?.width === 640 && ledgerEntry.image?.height === 360, `Ledger runtime dimensions drifted for ${label}`);
  assert(ledgerEntry.image?.bytes === bytes.length, `Ledger runtime byte count drifted for ${label}`);
  assert(ledgerEntry.image?.sha256 === runtimeSha256, `Ledger runtime SHA drifted for ${label}`);
  return {
    format: 'WEBP',
    width: 640,
    height: 360,
    bytes: bytes.length,
    sha256: runtimeSha256
  };
};

export async function buildWave5Completion({
  originalBatchPath,
  makeupBatchPath,
  visualCorrectionsBatchPath,
  catalogPath,
  ledgerPath = 'public/images/rift-dossiers/openai/openai-prompts.jsonl',
  expectedCount = WAVE_5_COMPLETION_SIZE,
  expectedReplacementCount = WAVE_5_REPLACEMENT_SIZE,
  expectedVisualCorrectionCount = WAVE_5_VISUAL_CORRECTION_SIZE,
  cwd = process.cwd()
}) {
  assert(Number.isInteger(expectedCount) && expectedCount > 0, 'expectedCount must be positive');
  assert(
    Number.isInteger(expectedReplacementCount)
      && expectedReplacementCount > 0
      && expectedReplacementCount < expectedCount,
    'expectedReplacementCount must be between 1 and expectedCount - 1'
  );
  assert(
    Number.isInteger(expectedVisualCorrectionCount)
      && expectedVisualCorrectionCount > 0
      && expectedVisualCorrectionCount <= expectedCount,
    'expectedVisualCorrectionCount must be between 1 and expectedCount'
  );

  const root = path.resolve(cwd);
  const [original, makeup, visual, catalog] = await Promise.all([
    readJsonDocument(root, originalBatchPath, 'original batch'),
    readJsonDocument(root, makeupBatchPath, 'makeup batch'),
    readJsonDocument(root, visualCorrectionsBatchPath, 'visual corrections batch'),
    readJsonDocument(root, catalogPath, 'rift dossier catalog')
  ]);
  const ledgerAbsolute = path.isAbsolute(ledgerPath) ? path.normalize(ledgerPath) : path.resolve(root, ledgerPath);
  const ledgerByOutput = await readLedger(ledgerAbsolute);

  const originalJobs = validatePlannedBatch({ loaded: original, expectedCount, label: 'Original Wave 5 batch' });
  const makeupJobs = validatePlannedBatch({ loaded: makeup, expectedCount: expectedReplacementCount, label: 'Wave 5 makeup batch' });
  const visualJobs = validatePlannedBatch({ loaded: visual, expectedCount: expectedVisualCorrectionCount, label: 'Wave 5 visual corrections batch' });
  assert(makeup.document.source?.batchSha256 === original.sha256, 'Wave 5 makeup does not pin the supplied original batch');
  assert(visual.document.correctionVersion === 1, 'Wave 5 visual correction version must be 1');
  assert(
    JSON.stringify(visual.document.overlayOrder) === JSON.stringify(REQUIRED_OVERLAY_ORDER),
    'Wave 5 visual overlay order drifted'
  );
  assert(visual.document.sources?.wave5Primary?.sha256 === original.sha256, 'Visual corrections do not pin the supplied primary batch');
  assert(visual.document.sources?.wave5SafetyMakeup?.sha256 === makeup.sha256, 'Visual corrections do not pin the supplied makeup batch');
  assert(catalog.document.schemaVersion === 1, 'Rift dossier catalog schemaVersion must be 1');
  assert(Array.isArray(catalog.document.entrees), 'Rift dossier catalog entries are missing');

  const originalBySequence = new Map(originalJobs.map(job => [job.sequence, job]));
  const makeupByOriginalSequence = new Map();
  for (const job of makeupJobs) {
    const originalSequence = Number(job.replacementOfSequence);
    const sourceJob = originalBySequence.get(originalSequence);
    assert(sourceJob, `Makeup replacementOfSequence ${originalSequence} is absent from original Wave 5`);
    assert(!makeupByOriginalSequence.has(originalSequence), `Duplicate makeup replacementOfSequence ${originalSequence}`);
    assert(identityOf(job) === identityOf(sourceJob), `Makeup identity drift at original sequence ${originalSequence}`);
    assert(outputKey(job.output) === outputKey(sourceJob.output), `Makeup output drift at original sequence ${originalSequence}`);
    assert(job.replacedPromptSha256 === sourceJob.generationPromptSha256, `Makeup replaced prompt SHA drift at original sequence ${originalSequence}`);
    assert(job.sourcePromptSha256 === job.generationPromptSha256, `Makeup catalog prompt SHA drift at original sequence ${originalSequence}`);
    makeupByOriginalSequence.set(originalSequence, job);
  }

  const visualByOriginalSequence = new Map();
  for (const job of visualJobs) {
    const originalSequence = Number(job.replacementOfSequence);
    const sourceJob = originalBySequence.get(originalSequence);
    const base = makeupByOriginalSequence.get(originalSequence) || sourceJob;
    assert(sourceJob, `Visual correction replacementOfSequence ${originalSequence} is absent from original Wave 5`);
    assert(!visualByOriginalSequence.has(originalSequence), `Duplicate visual replacementOfSequence ${originalSequence}`);
    assert(identityOf(job) === identityOf(sourceJob), `Visual correction identity drift at original sequence ${originalSequence}`);
    assert(outputKey(job.output) === outputKey(sourceJob.output), `Visual correction output drift at original sequence ${originalSequence}`);
    const expectedSourceLayer = makeupByOriginalSequence.has(originalSequence)
      ? 'wave-5-safety-makeup'
      : 'wave-5-primary';
    assert(job.sourceLayer === expectedSourceLayer, `Visual correction source layer drift at original sequence ${originalSequence}`);
    assert(job.correctionOfBatchId === (base === sourceJob ? original.document.batchId : makeup.document.batchId), `Visual correction source batch drift at original sequence ${originalSequence}`);
    assert(job.correctionOfSequence === base.sequence, `Visual correction source sequence drift at original sequence ${originalSequence}`);
    assert(job.replacedPromptSha256 === base.generationPromptSha256, `Visual correction replaced prompt SHA drift at original sequence ${originalSequence}`);
    assert(job.correctionOfGenerationPromptSha256 === base.generationPromptSha256, `Visual correction chain SHA drift at original sequence ${originalSequence}`);
    assert(job.sourcePromptSha256 === job.generationPromptSha256, `Visual correction catalog prompt SHA drift at original sequence ${originalSequence}`);
    visualByOriginalSequence.set(originalSequence, job);
  }

  const catalogById = new Map();
  for (const entry of catalog.document.entrees) {
    const id = String(entry.id);
    assert(!catalogById.has(id), `Duplicate rift dossier catalog id ${id}`);
    catalogById.set(id, entry);
  }

  const jobs = [];
  for (const sourceJob of originalJobs) {
    const makeupJob = makeupByOriginalSequence.get(sourceJob.sequence) || null;
    const visualJob = visualByOriginalSequence.get(sourceJob.sequence) || null;
    const selected = visualJob || makeupJob || sourceJob;
    const selectedPrompt = await validatePrompt({
      root,
      planned: selected,
      label: `${visualJob ? 'Visual correction' : makeupJob ? 'Makeup' : 'Primary'} ${identityOf(sourceJob)}`
    });
    const catalogEntry = catalogById.get(String(sourceJob.id));
    assert(catalogEntry, `Rift dossier catalog is missing stage ${sourceJob.id}`);
    assert(catalogEntry.cheminCibleDedie === sourceJob.output, `Catalog output drift for stage ${sourceJob.id}`);
    assert(catalogEntry.promptOpenAI === selectedPrompt.prompt, `Catalog has not applied the terminal overlay prompt for stage ${sourceJob.id}`);
    const ledgerEntry = ledgerByOutput.get(sourceJob.output);
    const runtimeImage = await validateInstalledAsset({
      root,
      sourceJob,
      selected,
      prompt: selectedPrompt.prompt,
      promptSha256: selectedPrompt.promptSha256,
      ledgerEntry
    });

    let completionSource;
    if (visualJob) {
      completionSource = {
        role: 'visual-correction',
        batchId: visual.document.batchId,
        correctionVersion: visual.document.correctionVersion,
        replacementOfSequence: sourceJob.sequence,
        supersedes: {
          role: makeupJob ? 'makeup' : 'primary',
          batchId: makeupJob ? makeup.document.batchId : original.document.batchId,
          sourceSequence: makeupJob ? makeupJob.sequence : sourceJob.sequence
        },
        visualAuditIssue: visualJob.visualAuditIssue
      };
    } else if (makeupJob) {
      completionSource = {
        role: 'makeup',
        batchId: makeup.document.batchId,
        replacementOfSequence: sourceJob.sequence,
        sourceSequence: makeupJob.sequence
      };
    } else {
      completionSource = {
        role: 'primary',
        batchId: original.document.batchId,
        sourceSequence: sourceJob.sequence
      };
    }

    jobs.push({
      sequence: sourceJob.sequence,
      kind: sourceJob.kind,
      id: String(sourceJob.id),
      stageId: Number(sourceJob.id),
      assetId: sourceJob.assetId,
      output: sourceJob.output,
      generationId: ledgerEntry.generation.generationId,
      generationPromptFile: selectedPrompt.promptFile,
      generationPromptSha256: selectedPrompt.promptSha256,
      catalogPromptSha256: selectedPrompt.promptSha256,
      sourceImage: ledgerEntry.sourceImage,
      runtimeImage,
      completionSource,
      prompt: selectedPrompt.prompt
    });
  }

  validateContiguousSequences(jobs, 'Wave 5 completion');
  assertUnique(jobs.map(identityOf), 'completion identity');
  assertUnique(jobs.map(job => outputKey(job.output)), 'completion output');
  assertUnique(jobs.map(job => job.generationId), 'completion generationId');
  assert(jobs.length === expectedCount, `Wave 5 completion must contain exactly ${expectedCount} jobs`);
  const roleCount = role => jobs.filter(job => job.completionSource.role === role).length;
  const counts = {
    requested: expectedCount,
    primary: roleCount('primary'),
    makeup: roleCount('makeup'),
    visualCorrections: roleCount('visual-correction'),
    installed: jobs.length,
    remaining: 0
  };
  assert(counts.visualCorrections === expectedVisualCorrectionCount, 'Visual correction completion count drifted');
  assert(
    counts.makeup + visualJobs.filter(job => job.sourceLayer === 'wave-5-safety-makeup').length === expectedReplacementCount,
    'Makeup completion coverage drifted'
  );

  return {
    schemaVersion: 1,
    batchId: COMPLETION_BATCH_ID,
    promptCatalogSha256: promptContractSha256(jobs),
    completionPolicy: 'apply-primary-then-safety-makeup-then-versioned-visual-corrections-and-verify-installed-openai-provenance',
    overlayOrder: [...REQUIRED_OVERLAY_ORDER],
    sourceBatches: [
      { role: 'primary', batchId: original.document.batchId, batchSha256: original.sha256 },
      { role: 'makeup', batchId: makeup.document.batchId, batchSha256: makeup.sha256 },
      { role: 'visual-correction', batchId: visual.document.batchId, batchSha256: visual.sha256 }
    ],
    counts,
    jobs: jobs.map(({ prompt: _prompt, ...job }) => job)
  };
}

const parseArguments = values => {
  const options = {};
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (token === '--check') {
      options.check = true;
      continue;
    }
    if (!token.startsWith('--')) throw new Error(`Unknown argument: ${token}`);
    const key = token.slice(2).replace(/-([a-z])/gu, (_match, letter) => letter.toUpperCase());
    const value = values[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${token}`);
    options[key] = value;
    index += 1;
  }
  return options;
};

export async function runCli(values = process.argv.slice(2)) {
  const options = parseArguments(values);
  for (const key of [
    'originalBatch',
    'makeupBatch',
    'visualCorrectionsBatch',
    'catalog',
    'ledger',
    'output'
  ]) {
    assert(options[key], `Missing --${key.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`)}`);
  }
  const cwd = path.resolve(options.cwd || process.cwd());
  const document = await buildWave5Completion({
    originalBatchPath: options.originalBatch,
    makeupBatchPath: options.makeupBatch,
    visualCorrectionsBatchPath: options.visualCorrectionsBatch,
    catalogPath: options.catalog,
    ledgerPath: options.ledger,
    cwd
  });
  const output = path.resolve(cwd, options.output);
  const expectedBytes = Buffer.from(`${JSON.stringify(document, null, 2)}\n`, 'utf8');
  if (options.check) {
    const currentBytes = await fs.readFile(output);
    assert(currentBytes.equals(expectedBytes), 'Wave 5 completion artifact drifted');
  } else {
    await atomicWriteJson(output, document);
  }
  console.log(JSON.stringify({
    status: 'ok',
    mode: options.check ? 'check' : 'write',
    output,
    batchId: document.batchId,
    promptCatalogSha256: document.promptCatalogSha256,
    counts: document.counts
  }, null, 2));
  return { output, document };
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  runCli().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
