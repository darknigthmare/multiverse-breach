import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadExactInstallBatchContract } from './missingAssetBatchRuntimeContract.mjs';

const DEFAULT_BATCH = 'docs/openai-generation-prompts-2026-08-25/asset-batch-500-wave-2.json';
const ALPHA_THRESHOLD = 12;
const ITEM_SIZE = 512;
const SHEET_SIZE = 1024;
const CELL_SIZE = 256;
const ITEM_GUARD = 24;
const CELL_GUARD = 12;

const sha256 = value => createHash('sha256').update(value).digest('hex');
const identityFor = entry => `${entry.kind}:${entry.id}`;

export const parseArguments = values => {
  const options = { batch: DEFAULT_BATCH };
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (!['--batch', '--install-batch'].includes(token)) {
      throw new Error(`Unknown argument: ${token}`);
    }
    const value = values[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`${token} requires a path`);
    if (token === '--batch') {
      options.batch = value;
    } else {
      if (options.installBatch) throw new Error('--install-batch can only be provided once');
      options.installBatch = value;
    }
    index += 1;
  }
  if (!options.installBatch) {
    throw new Error('--install-batch is required to audit the exact merged batch that was installed');
  }
  return options;
};

const readJsonl = file => readFileSync(file, 'utf8')
  .split(/\r?\n/u)
  .filter(Boolean)
  .map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${file}:${index + 1}: ${error.message}`);
    }
  });

const resolvePublicOutput = (root, output) => {
  const publicRoot = path.resolve(root, 'public');
  const file = path.resolve(publicRoot, String(output || '').replace(/^\/+/, ''));
  const relative = path.relative(publicRoot, file);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Output escapes public/: ${output}`);
  }
  return file;
};

const inspectItem = async file => {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let visiblePixels = 0;
  let guardPixels = 0;
  let hiddenRgbPixels = 0;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const alpha = data[offset + 3];
      if (alpha === 0 && (data[offset] !== 0 || data[offset + 1] !== 0 || data[offset + 2] !== 0)) {
        hiddenRgbPixels += 1;
      }
      if (alpha <= ALPHA_THRESHOLD) continue;
      visiblePixels += 1;
      if (
        x < ITEM_GUARD || x >= info.width - ITEM_GUARD
        || y < ITEM_GUARD || y >= info.height - ITEM_GUARD
      ) guardPixels += 1;
    }
  }
  return {
    visiblePixels,
    visibleRatio: visiblePixels / (info.width * info.height),
    guardPixels,
    hiddenRgbPixels
  };
};

const inspectSheet = async file => {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cellReports = [];
  const cellAlphaHashes = [];
  let hiddenRgbPixels = 0;
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const alphaBytes = Buffer.alloc(CELL_SIZE * CELL_SIZE);
      let visiblePixels = 0;
      let guardPixels = 0;
      for (let y = 0; y < CELL_SIZE; y += 1) {
        for (let x = 0; x < CELL_SIZE; x += 1) {
          const offset = (
            ((row * CELL_SIZE + y) * info.width) + column * CELL_SIZE + x
          ) * info.channels;
          const alpha = data[offset + 3];
          alphaBytes[y * CELL_SIZE + x] = alpha;
          if (alpha === 0 && (data[offset] !== 0 || data[offset + 1] !== 0 || data[offset + 2] !== 0)) {
            hiddenRgbPixels += 1;
          }
          if (alpha <= ALPHA_THRESHOLD) continue;
          visiblePixels += 1;
          if (
            x < CELL_GUARD || x >= CELL_SIZE - CELL_GUARD
            || y < CELL_GUARD || y >= CELL_SIZE - CELL_GUARD
          ) guardPixels += 1;
        }
      }
      cellReports.push({
        cell: row * 4 + column + 1,
        visiblePixels,
        guardPixels
      });
      cellAlphaHashes.push(sha256(alphaBytes));
    }
  }
  return {
    cellReports,
    occupiedCells: cellReports.filter(cell => cell.visiblePixels >= 400).length,
    uniqueCellAlphaHashes: new Set(cellAlphaHashes).size,
    hiddenRgbPixels
  };
};

export const audit = async ({ batch: batchArgument, installBatch: installBatchArgument }) => {
  const root = process.cwd();
  const batchPath = path.resolve(root, batchArgument);
  const ledgerPath = path.join(root, 'public', 'sprites', 'generated', 'openai-asset-ledger.jsonl');
  if (!existsSync(batchPath)) throw new Error(`Batch does not exist: ${batchPath}`);
  if (!existsSync(ledgerPath)) throw new Error(`Ledger does not exist: ${ledgerPath}`);

  const exactContract = await loadExactInstallBatchContract({
    batchPath,
    installBatchPath: path.resolve(root, installBatchArgument),
    cwd: root
  });
  const batch = exactContract.catalog.document;
  const generationJobsByIdentity = exactContract.jobsByIdentity;
  const installBatchPath = exactContract.installBatch.path;
  const ledger = readJsonl(ledgerPath);
  const ledgerByIdentity = new Map();
  const duplicateLedgerIdentities = [];
  for (const record of ledger) {
    const identity = identityFor(record);
    if (ledgerByIdentity.has(identity)) duplicateLedgerIdentities.push(identity);
    ledgerByIdentity.set(identity, record);
  }

  const invalid = [];
  const fileHashes = new Map();
  const generationIds = new Map();
  const counts = { item: 0, hero: 0 };
  for (const job of batch.jobs) {
    const identity = identityFor(job);
    const generationJob = generationJobsByIdentity.get(identity);
    const errors = [];
    counts[job.kind] = (counts[job.kind] || 0) + 1;
    const record = ledgerByIdentity.get(identity);
    if (!record) {
      invalid.push({ identity, output: job.output, errors: ['missing ledger record'] });
      continue;
    }
    if (record.output !== job.output) errors.push('ledger output differs from batch output');
    if (record.generation?.provider !== 'OpenAI') errors.push('provider is not OpenAI');
    if (record.generation?.interface !== 'built-in image_gen') errors.push('interface is not built-in image_gen');
    const generationId = String(record.generation?.generationId || '');
    if (!/^exec-[a-z0-9-]+$/iu.test(generationId)) errors.push('invalid built-in generation id');
    if (generationId !== generationJob.generationId) {
      errors.push('ledger generation id differs from exact install batch');
    }
    const priorGenerationOwner = generationIds.get(generationId);
    if (generationId && priorGenerationOwner && priorGenerationOwner !== identity) {
      errors.push(`generation id is shared with ${priorGenerationOwner}`);
    }
    generationIds.set(generationId, identity);
    if (record.catalogPromptSha256 !== generationJob.catalogPromptSha256) {
      errors.push('ledger catalog prompt hash differs from exact install batch');
    }
    if (record.generationPromptStatus !== 'recorded-verbatim') {
      errors.push('ledger generation prompt is not marked recorded-verbatim');
    }

    const promptFile = generationJob.generationPromptFile;
    if (!existsSync(promptFile)) {
      errors.push('generation prompt file is missing');
    } else {
      const generationPrompt = readFileSync(promptFile, 'utf8');
      const generationPromptSha256 = sha256(Buffer.from(generationPrompt, 'utf8'));
      if (generationPrompt !== record.generationPrompt) errors.push('ledger generation prompt is not verbatim');
      if (generationPromptSha256 !== generationJob.generationPromptSha256) errors.push('batch generation prompt hash mismatch');
      if (generationPromptSha256 !== record.generationPromptSha256) errors.push('ledger generation prompt hash mismatch');
    }

    const file = resolvePublicOutput(root, job.output);
    if (!existsSync(file)) {
      errors.push('runtime output is missing');
      invalid.push({ identity, output: job.output, errors });
      continue;
    }
    const encoded = readFileSync(file);
    const fileSha256 = sha256(encoded);
    if (fileSha256 !== record.image?.sha256) errors.push('runtime output hash differs from ledger');
    const priorFileOwner = fileHashes.get(fileSha256);
    if (priorFileOwner && priorFileOwner !== identity) errors.push(`bitmap is duplicated by ${priorFileOwner}`);
    fileHashes.set(fileSha256, identity);

    const metadata = await sharp(encoded, { animated: false, failOn: 'error' }).metadata();
    if (job.kind === 'item') {
      if (
        metadata.format !== 'png' || metadata.width !== ITEM_SIZE || metadata.height !== ITEM_SIZE
        || metadata.channels !== 4 || metadata.hasAlpha !== true
      ) errors.push('item is not a 512x512 RGBA PNG');
      else {
        const report = await inspectItem(file);
        if (report.visiblePixels < 1024) errors.push('item is effectively empty');
        if (report.visibleRatio > 0.72) errors.push(`item opaque ratio is too high (${report.visibleRatio.toFixed(3)})`);
        if (report.guardPixels > 0) errors.push(`item violates ${ITEM_GUARD}px guard (${report.guardPixels} pixels)`);
        if (report.hiddenRgbPixels > 0) errors.push(`item retains hidden RGB (${report.hiddenRgbPixels} pixels)`);
      }
      if (!String(record.processing?.operation || '').includes('item-normalization')) {
        errors.push('item normalization provenance is missing');
      }
    } else if (job.kind === 'hero') {
      if (
        metadata.format !== 'png' || metadata.width !== SHEET_SIZE || metadata.height !== SHEET_SIZE
        || metadata.channels !== 4 || metadata.hasAlpha !== true
      ) errors.push('hero is not a 1024x1024 RGBA PNG');
      else {
        const report = await inspectSheet(file);
        if (report.occupiedCells !== 16) errors.push(`hero has ${report.occupiedCells}/16 occupied cells`);
        if (report.uniqueCellAlphaHashes < 12) {
          errors.push(`hero has only ${report.uniqueCellAlphaHashes}/16 distinct alpha cells`);
        }
        const guardViolations = report.cellReports.reduce((sum, cell) => sum + cell.guardPixels, 0);
        if (guardViolations > 0) errors.push(`hero violates cell guards (${guardViolations} pixels)`);
        if (report.hiddenRgbPixels > 0) errors.push(`hero retains hidden RGB (${report.hiddenRgbPixels} pixels)`);
      }
      if (record.processing?.nonemptyCells !== 16 || record.processing?.minimumGuard < CELL_GUARD) {
        errors.push('strict 4x4 normalization provenance is invalid');
      }
    } else {
      errors.push(`unexpected kind in 500-asset batch: ${job.kind}`);
    }
    if (errors.length > 0) invalid.push({ identity, output: job.output, errors });
  }

  for (const duplicate of duplicateLedgerIdentities) {
    invalid.push({ identity: duplicate, output: null, errors: ['duplicate ledger identity'] });
  }
  const report = {
    id: 'multiverse-breach.missing-asset-batch-500-runtime-audit',
    status: invalid.length === 0 ? 'approved' : 'failed',
    batchId: batch.batchId,
    installBatchId: exactContract.installBatch.document.batchId,
    installBatch: path.relative(root, installBatchPath).replaceAll('\\', '/'),
    requested: batch.jobs.length,
    counts,
    verified: batch.jobs.length - new Set(invalid.map(entry => entry.identity)).size,
    uniqueRuntimeBitmaps: fileHashes.size,
    uniqueGenerationIds: generationIds.size,
    invalidCount: invalid.length,
    invalid
  };
  console.log(JSON.stringify(report, null, 2));
  if (invalid.length > 0) process.exitCode = 1;
  return report;
};

if (
  process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  audit(parseArguments(process.argv.slice(2))).catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
