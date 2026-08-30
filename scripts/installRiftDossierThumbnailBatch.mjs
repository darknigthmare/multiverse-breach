import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const GENERATION_ID_PATTERN = /^exec-[A-Za-z0-9](?:[A-Za-z0-9-]{1,126})$/u;
const HASH_PATTERN = /^[a-f0-9]{64}$/u;

const sha256 = value => createHash('sha256').update(value).digest('hex');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};
const resolveInput = (value, base) => (
  path.isAbsolute(value) ? path.normalize(value) : path.resolve(base, value)
);
const resolvePublicOutput = (root, output) => {
  const publicRoot = path.resolve(root, 'public');
  const destination = path.resolve(publicRoot, String(output || '').replace(/^\/+/, ''));
  assert(isInside(publicRoot, destination), `Output escapes public/: ${output}`);
  return destination;
};
const readJsonl = async file => {
  try {
    return (await fs.readFile(file, 'utf8')).split(/\r?\n/gu).filter(Boolean).map(JSON.parse);
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
};
const fileExists = async file => fs.stat(file).then(value => value.isFile()).catch(error => {
  if (error?.code === 'ENOENT') return false;
  throw error;
});

export const parseArguments = values => {
  const options = {};
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (!token.startsWith('--')) throw new Error(`Unknown argument: ${token}`);
    const key = token.slice(2).replace(/-([a-z])/gu, (_match, letter) => letter.toUpperCase());
    const value = values[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${token}`);
    options[key] = value;
    index += 1;
  }
  if (!options.batch) throw new Error('--batch is required');
  return options;
};

export const buildInstallPlan = async ({ root = projectRoot, batchPath }) => {
  const absoluteBatchPath = path.resolve(root, batchPath);
  const batchDirectory = path.dirname(absoluteBatchPath);
  const batchBytes = await fs.readFile(absoluteBatchPath);
  const document = JSON.parse(batchBytes.toString('utf8'));
  assert(document.schemaVersion === 1, 'Install batch schemaVersion must be 1');
  assert(Array.isArray(document.jobs) && document.jobs.length > 0, 'Install batch contains no jobs');
  assert(HASH_PATTERN.test(String(document.promptCatalogSha256 || '')), 'Install batch requires promptCatalogSha256');

  const catalogPath = path.join(root, 'docs', 'rift-dossiers', 'catalog.json');
  const catalogBytes = await fs.readFile(catalogPath);
  const catalog = JSON.parse(catalogBytes.toString('utf8'));
  const catalogById = new Map(catalog.entrees.map(entry => [String(entry.id), entry]));
  const identities = new Set();
  const outputs = new Set();
  const jobs = [];

  for (const rawJob of document.jobs) {
    const id = String(rawJob.id || '');
    const label = `${rawJob.kind || 'unknown'}:${id || 'unknown'}`;
    assert(rawJob.kind === 'stage', `${label}: rift dossier batch jobs must use kind=stage`);
    assert(id, `${label}: id is required`);
    assert(!identities.has(label), `Duplicate install identity: ${label}`);
    identities.add(label);
    assert(rawJob.output && !outputs.has(rawJob.output), `Duplicate or missing install output: ${rawJob.output}`);
    outputs.add(rawJob.output);
    assert(GENERATION_ID_PATTERN.test(String(rawJob.generationId || '')), `${label}: invalid ImageGen generationId`);
    assert(HASH_PATTERN.test(String(rawJob.generationPromptSha256 || '')), `${label}: missing generation prompt hash`);
    assert(HASH_PATTERN.test(String(rawJob.catalogPromptSha256 || '')), `${label}: missing catalog prompt hash`);

    const entry = catalogById.get(id);
    assert(entry, `${label}: dossier catalog entry not found`);
    assert(entry.cheminCibleDedie === rawJob.output, `${label}: output differs from dossier catalog`);
    const promptFile = resolveInput(rawJob.generationPromptFile, batchDirectory);
    const prompt = await fs.readFile(promptFile, 'utf8');
    const promptHash = sha256(Buffer.from(prompt, 'utf8'));
    assert(prompt === entry.promptOpenAI, `${label}: generation prompt differs from dossier catalog`);
    assert(promptHash === rawJob.generationPromptSha256, `${label}: generation prompt hash mismatch`);
    assert(promptHash === rawJob.catalogPromptSha256, `${label}: catalog prompt hash mismatch`);
    const source = resolveInput(rawJob.source, batchDirectory);
    assert(await fileExists(source), `${label}: source PNG is missing`);
    assert(path.extname(source).toLowerCase() === '.png', `${label}: source must be PNG`);
    const destination = resolvePublicOutput(root, rawJob.output);
    const extension = path.extname(rawJob.output);
    assert(['.png', '.webp'].includes(extension.toLowerCase()), `${label}: unsupported destination format`);
    jobs.push({
      sequence: Number(rawJob.sequence),
      id,
      stageId: Number(id),
      assetId: path.basename(rawJob.output, extension),
      output: rawJob.output,
      source,
      destination,
      promptFile,
      prompt,
      promptSha256: promptHash,
      generationId: String(rawJob.generationId),
      replace: rawJob.replace === true
    });
  }
  jobs.sort((left, right) => left.sequence - right.sequence);
  assert(jobs.every((job, index) => job.sequence === index + 1), 'Install batch sequences must be contiguous');
  const selectedPromptContractSha256 = sha256(Buffer.from(JSON.stringify(
    jobs.map(job => ({ id: job.id, output: job.output, prompt: job.prompt }))
  ), 'utf8'));
  assert(
    selectedPromptContractSha256 === document.promptCatalogSha256,
    'Selected rift dossier prompt contract changed after batch planning'
  );
  return { document, batchPath: absoluteBatchPath, batchSha256: sha256(batchBytes), jobs };
};

const matchingLedgerEntry = (ledger, job) => {
  const matches = ledger.filter(entry => (
    entry.kind === 'rift-dossier-thumbnail'
    && entry.assetId === job.assetId
    && entry.output === job.output
  ));
  assert(matches.length <= 1, `Duplicate provenance entries for ${job.output}`);
  return matches[0] || null;
};

const verifyInstalledJob = async ({ ledger, job }) => {
  assert(await fileExists(job.destination), `Installed image is missing: ${job.output}`);
  const entry = matchingLedgerEntry(ledger, job);
  assert(entry, `Installed provenance is missing: ${job.output}`);
  assert(entry.generation?.provider === 'OpenAI', `Invalid provider for ${job.output}`);
  assert(entry.generation?.interface === 'built-in image_gen', `Invalid interface for ${job.output}`);
  assert(entry.generation?.generationId === job.generationId, `Generation id mismatch for ${job.output}`);
  assert(entry.generation?.promptSha256 === job.promptSha256, `Prompt hash mismatch for ${job.output}`);
  assert(entry.prompt === job.prompt, `Recorded prompt mismatch for ${job.output}`);
  const metadata = await sharp(job.destination).metadata();
  assert(metadata.width === 640 && metadata.height === 360, `Invalid dimensions for ${job.output}`);
  assert(metadata.format === path.extname(job.output).slice(1).toLowerCase(), `Invalid format for ${job.output}`);
  const bytes = await fs.readFile(job.destination);
  assert(sha256(bytes) === entry.image?.sha256, `Image SHA mismatch for ${job.output}`);
  return {
    sequence: job.sequence,
    stageId: job.stageId,
    output: job.output,
    generationId: job.generationId,
    sha256: entry.image.sha256,
    bytes: bytes.length
  };
};

const atomicWriteJson = async (file, value) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  try {
    await fs.rename(temporary, file);
  } catch (error) {
    await fs.rm(temporary, { force: true });
    throw error;
  }
};

const runSingleInstaller = ({ root, job }) => {
  const powershell = process.platform === 'win32' ? 'powershell.exe' : 'pwsh';
  const args = [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', path.join(root, 'scripts', 'installRiftDossierThumbnail.ps1'),
    '-Source', job.source,
    '-Destination', job.destination,
    '-AssetId', job.assetId,
    '-MissionId', String(job.stageId),
    '-PromptFile', job.promptFile,
    '-PromptSha256', job.promptSha256,
    '-GenerationId', job.generationId
  ];
  if (job.replace) args.push('-Replace');
  const result = spawnSync(powershell, args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Installer failed for ${job.output}: ${(result.stderr || result.stdout || '').trim()}`);
  }
};

export const installBatch = async ({ root = projectRoot, batchPath, resultsPath = null }) => {
  const plan = await buildInstallPlan({ root, batchPath });
  const ledgerPath = path.join(root, 'public', 'images', 'rift-dossiers', 'openai', 'openai-prompts.jsonl');
  const outputPath = resultsPath
    ? path.resolve(root, resultsPath)
    : `${plan.batchPath.slice(0, -5)}.install-results.json`;
  const records = [];
  const writeProgress = async (status, error = null) => atomicWriteJson(outputPath, {
    schemaVersion: 1,
    batchId: plan.document.batchId || null,
    batchSha256: plan.batchSha256,
    status,
    counts: { requested: plan.jobs.length, installed: records.length, remaining: plan.jobs.length - records.length },
    records,
    ...(error ? { error } : {}),
    updatedAt: new Date().toISOString()
  });
  await writeProgress('in-progress');
  try {
    for (const job of plan.jobs) {
      let ledger = await readJsonl(ledgerPath);
      const destinationExists = await fileExists(job.destination);
      const ledgerEntry = matchingLedgerEntry(ledger, job);
      if (destinationExists || ledgerEntry) {
        assert(destinationExists && ledgerEntry, `Partial pre-existing install for ${job.output}`);
        try {
          records.push(await verifyInstalledJob({ ledger, job }));
          await writeProgress('in-progress');
          continue;
        } catch (error) {
          if (!job.replace) throw error;
        }
      }
      runSingleInstaller({ root, job });
      ledger = await readJsonl(ledgerPath);
      records.push(await verifyInstalledJob({ ledger, job }));
      await writeProgress('in-progress');
    }
  } catch (error) {
    await writeProgress('failed', error instanceof Error ? error.message : String(error));
    throw error;
  }
  await writeProgress('complete');
  return { outputPath, records };
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  const result = await installBatch({
    root: projectRoot,
    batchPath: options.batch,
    resultsPath: options.results || null
  });
  console.log(JSON.stringify({ status: 'complete', output: result.outputPath, installed: result.records.length }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
