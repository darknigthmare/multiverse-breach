import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHeroGenerationPrompt } from './buildMissingAssetBatch500Wave3.mjs';

export const SCHEMA_VERSION = 1;
export const BATCH_ID = 'assets-character-reference-remediation-334-wave-4-2026-08-28';
export const JOB_COUNT = 334;
export const MISSING_REFERENCE_COUNT = 170;
export const REJECTED_PLACEHOLDER_COUNT = 164;
export const QUALITY_REPORT_SHA256 = '8b4e7ba5eda74ac638fdf6be9a7a1b7c43851f53c273a78feb48a2408bb7eef2';
export const DOSSIER_CATALOG_SHA256 = '4ec9d22507bd169806cec41a21ec6d4aec9bcc593a01a7c6902f99d91ba31f7d';
export const PROMPT_CATALOG_SHA256 = '01d7f266de73e8c4193ff0a66b879e3b9ee3dacb05cf01d62a526b34af8f3c4d';
export const MISSING_OUTPUTS_SHA256 = '53128643702a7988ecc4c0532f4aee69b800ae3b77f1f44ced766d866df8e72c';
export const REJECTED_OUTPUTS_SHA256 = 'd2e518a62a5a3d89e59ff32be2a0af3cacd4a9b0502aa8944f7c22da76d972be';
export const REMEDIATION_PLAN_SHA256 = '602a4ba400b8efa4c8ddf1120ca09682f83e2c9f6b7b9b4c8923ca3dec555598';

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
const qualityReportPath = path.join(projectRoot, 'docs', 'rift-dossiers', 'character-reference-quality.json');
const dossierCatalogPath = path.join(projectRoot, 'docs', 'rift-dossiers', 'catalog.json');
const promptCatalogPath = path.join(projectRoot, 'public', 'sprites', 'generated', 'openai-sprite-prompts.jsonl');
export const batchJsonPath = path.join(artifactRoot, 'asset-batch-334-wave-4.json');
export const promptDirectory = path.join(artifactRoot, 'asset-batch-334-wave-4');

const SYNTHETIC_CATALOG_LINE = /^(?:Combat identity|Special motif|Palette anchor)\s*:/imu;
const sha256 = value => createHash('sha256').update(value).digest('hex');
const identityFor = entry => `${entry.kind}:${entry.id}`;
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const sameValues = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const compareText = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const slugify = value => String(value || 'asset')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'asset';

const readJsonl = bytes => bytes.toString('utf8')
  .split(/\r?\n/gu)
  .filter(Boolean)
  .map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${promptCatalogPath}:${index + 1}: ${error.message}`);
    }
  });

const promptFileFor = (sequence, entry) => [
  'docs',
  'openai-generation-prompts-2026-08-25',
  'asset-batch-334-wave-4',
  `${String(sequence).padStart(3, '0')}-hero-${slugify(entry.id).slice(0, 68)}-${sha256(entry.output).slice(0, 8)}.txt`
].join('/');

const indexUnique = (entries, keyFor, label) => {
  const result = new Map();
  for (const entry of entries) {
    const key = keyFor(entry);
    assert(!result.has(key), `${label} duplicate key: ${key}`);
    result.set(key, entry);
  }
  return result;
};

const loadInputs = async () => {
  const [qualityBytes, dossierBytes, promptBytes] = await Promise.all([
    fs.readFile(qualityReportPath),
    fs.readFile(dossierCatalogPath),
    fs.readFile(promptCatalogPath)
  ]);
  assert(sha256(qualityBytes) === QUALITY_REPORT_SHA256, 'Character-reference quality report drifted');
  assert(sha256(dossierBytes) === DOSSIER_CATALOG_SHA256, 'Rift-dossier catalog drifted');
  assert(sha256(promptBytes) === PROMPT_CATALOG_SHA256, 'OpenAI sprite prompt catalog drifted');
  return {
    quality: JSON.parse(qualityBytes.toString('utf8')),
    dossiers: JSON.parse(dossierBytes.toString('utf8')),
    prompts: readJsonl(promptBytes)
  };
};

const validateDossierAuthority = (qualityEntry, dossier) => {
  assert(dossier, `Missing character-arc dossier for quality entry ${qualityEntry.id}`);
  assert(dossier.famille === 'arc-personnage', `Wrong dossier family for quality entry ${qualityEntry.id}`);
  assert(dossier.personnage === qualityEntry.character, `Dossier character mismatch for quality entry ${qualityEntry.id}`);
  assert(sameValues(dossier.univers, qualityEntry.universes), `Dossier universe mismatch for quality entry ${qualityEntry.id}`);
  assert(Array.isArray(dossier.referenceUrls) && dossier.referenceUrls.length > 0, `Missing authority URL for quality entry ${qualityEntry.id}`);
  assert(Array.isArray(dossier.ancragesVisuels) && dossier.ancragesVisuels.length > 0, `Missing visual anchor for quality entry ${qualityEntry.id}`);
};

const selectionFor = ({ qualityEntry, referenceFile, promptEntry, dossier, replace, reason }) => {
  assert(promptEntry.kind === 'hero', `Wave 4 remediation requires kind=hero for ${promptEntry.output}`);
  validateDossierAuthority(qualityEntry, dossier);
  return {
    qualityEntry,
    referenceFile,
    promptEntry,
    dossier,
    replace,
    reason,
    output: promptEntry.output
  };
};

const buildSelections = state => {
  assert(state.quality.kind === 'rift-dossier-character-reference-quality-audit', 'Unexpected character-reference quality report');
  assert(state.quality.entries?.length === 1912, 'Unexpected character-reference entry count');
  assert(state.quality.referenceFiles?.length === 1742, 'Unexpected character-reference file count');

  const qualityById = indexUnique(state.quality.entries, entry => entry.id, 'Quality entry');
  const dossierById = indexUnique(
    state.dossiers.entrees.filter(entry => entry.famille === 'arc-personnage'),
    entry => entry.id,
    'Character-arc dossier'
  );
  const heroPrompts = state.prompts.filter(entry => entry.kind === 'hero');

  const missing = state.quality.entries
    .filter(entry => Array.isArray(entry.localReferences) && entry.localReferences.length === 0)
    .map(qualityEntry => {
      const matches = heroPrompts.filter(entry => (
        entry.name === qualityEntry.character
        && qualityEntry.universes.includes(entry.universe)
      ));
      assert(matches.length === 1, `Missing-reference entry must resolve to one hero prompt: ${qualityEntry.id}`);
      return selectionFor({
        qualityEntry,
        referenceFile: null,
        promptEntry: matches[0],
        dossier: dossierById.get(qualityEntry.id),
        replace: false,
        reason: 'missing-local-reference'
      });
    })
    .sort((left, right) => compareText(left.output, right.output));

  const rejected = state.quality.referenceFiles
    .filter(reference => reference.classification === 'rejected-placeholder')
    .map(referenceFile => {
      assert(referenceFile.usedByEntryCount === 1, `Rejected placeholder must serve one entry: ${referenceFile.path}`);
      assert(referenceFile.entryIds?.length === 1, `Rejected placeholder must expose one entry ID: ${referenceFile.path}`);
      const qualityEntry = qualityById.get(referenceFile.entryIds[0]);
      assert(qualityEntry, `Rejected placeholder quality entry is missing: ${referenceFile.path}`);
      assert(qualityEntry.classification === 'rejected-placeholder', `Rejected placeholder entry classification drifted: ${referenceFile.path}`);
      assert(qualityEntry.localReferences.includes(referenceFile.path), `Rejected placeholder path is absent from its entry: ${referenceFile.path}`);
      const matches = state.prompts.filter(entry => entry.output === referenceFile.path);
      assert(matches.length === 1, `Rejected placeholder must resolve to one prompt output: ${referenceFile.path}`);
      return selectionFor({
        qualityEntry,
        referenceFile,
        promptEntry: matches[0],
        dossier: dossierById.get(qualityEntry.id),
        replace: true,
        reason: 'rejected-placeholder'
      });
    })
    .sort((left, right) => compareText(left.output, right.output));

  assert(missing.length === MISSING_REFERENCE_COUNT, 'Unexpected missing-reference remediation count');
  assert(rejected.length === REJECTED_PLACEHOLDER_COUNT, 'Unexpected rejected-placeholder remediation count');
  const missingOutputs = missing.map(entry => entry.output);
  const rejectedOutputs = rejected.map(entry => entry.output);
  assert(sha256(JSON.stringify(missingOutputs)) === MISSING_OUTPUTS_SHA256, 'Frozen missing-reference output list drifted');
  assert(sha256(JSON.stringify(rejectedOutputs)) === REJECTED_OUTPUTS_SHA256, 'Frozen rejected-placeholder output list drifted');
  const selections = [...missing, ...rejected];
  const plan = selections.map(entry => ({ output: entry.output, replace: entry.replace }));
  assert(sha256(JSON.stringify(plan)) === REMEDIATION_PLAN_SHA256, 'Frozen Wave 4 remediation plan drifted');
  assert(selections.length === JOB_COUNT, 'Unexpected Wave 4 job count');
  assert(new Set(selections.map(entry => entry.output)).size === JOB_COUNT, 'Wave 4 outputs overlap');
  assert(new Set(selections.map(entry => entry.qualityEntry.id)).size === JOB_COUNT, 'Wave 4 quality entries overlap');
  assert(new Set(selections.map(entry => identityFor(entry.promptEntry))).size === JOB_COUNT, 'Wave 4 prompt identities overlap');
  return { missing, rejected, selections };
};

const buildJob = (selection, sequence) => {
  const { promptEntry, qualityEntry, dossier, referenceFile } = selection;
  const generationPrompt = buildHeroGenerationPrompt(promptEntry);
  assert(!SYNTHETIC_CATALOG_LINE.test(generationPrompt), `Synthetic catalog lore remains in ${promptEntry.output}`);
  assert(generationPrompt.includes('Canon authority lock:'), `Canon authority lock missing from ${promptEntry.output}`);
  assert(generationPrompt.includes('when a visual detail is uncertain, omit it instead of inventing it.'), `No-invention lock missing from ${promptEntry.output}`);
  return {
    sequence,
    kind: 'hero',
    id: promptEntry.id,
    name: promptEntry.name,
    universe: promptEntry.universe,
    output: promptEntry.output,
    frame: promptEntry.frame,
    replace: selection.replace,
    remediationReason: selection.reason,
    qualityEntryId: qualityEntry.id,
    rejectedSourceSha256: referenceFile?.metrics?.fileSha256 || null,
    catalogSource: 'openai-sprite-prompts',
    selectionTier: 'wave-4-character-reference-quality-remediation',
    referenceUrl: dossier.referenceUrls[0],
    referenceUrls: [...dossier.referenceUrls],
    visualAnchor: dossier.ancragesVisuels[0],
    visualAnchors: [...dossier.ancragesVisuels],
    sourcePromptSha256: sha256(Buffer.from(promptEntry.prompt, 'utf8')),
    generationPromptSha256: sha256(Buffer.from(generationPrompt, 'utf8')),
    promptFile: promptFileFor(sequence, promptEntry),
    generationPrompt
  };
};

export const createBatch = async () => {
  const state = await loadInputs();
  const { missing, rejected, selections } = buildSelections(state);
  const jobs = selections.map((selection, index) => buildJob(selection, index + 1));
  assert(new Set(jobs.map(identityFor)).size === JOB_COUNT, 'Wave 4 job identities are not unique');
  assert(new Set(jobs.map(job => job.output)).size === JOB_COUNT, 'Wave 4 job outputs are not unique');
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'hero',
    promptCatalogSha256: PROMPT_CATALOG_SHA256,
    sources: {
      characterReferenceQuality: {
        path: 'docs/rift-dossiers/character-reference-quality.json',
        sha256: QUALITY_REPORT_SHA256
      },
      riftDossierCatalog: {
        path: 'docs/rift-dossiers/catalog.json',
        sha256: DOSSIER_CATALOG_SHA256
      },
      spritePromptCatalog: {
        path: 'public/sprites/generated/openai-sprite-prompts.jsonl',
        sha256: PROMPT_CATALOG_SHA256
      }
    },
    selectionPolicy: [
      'select every quality entry with zero local references and map it by exact hero name plus universe',
      'select every high-confidence rejected-placeholder reference and map it by exact prompt output',
      'sort missing-reference outputs first, then rejected-placeholder outputs, each by ascending output path',
      'install missing-reference outputs with replace=false and rejected placeholders with replace=true',
      'generate only through the lore-corrected hero prompt builder with canon authority and no-invention locks'
    ],
    selectionHashes: {
      missingOutputsSha256: MISSING_OUTPUTS_SHA256,
      rejectedOutputsSha256: REJECTED_OUTPUTS_SHA256,
      remediationPlanSha256: REMEDIATION_PLAN_SHA256
    },
    counts: {
      jobs: jobs.length,
      missingLocalReferences: missing.length,
      rejectedPlaceholders: rejected.length,
      replaceFalse: jobs.filter(job => !job.replace).length,
      replaceTrue: jobs.filter(job => job.replace).length
    },
    jobs
  };
};

export const validateBatchArtifact = async () => {
  const artifact = await fs.readFile(batchJsonPath, 'utf8').then(JSON.parse);
  assert(artifact.schemaVersion === SCHEMA_VERSION, 'Wave 4 schema version drifted');
  assert(artifact.batchId === BATCH_ID, 'Wave 4 batch ID drifted');
  assert(artifact.kind === 'hero', 'Wave 4 kind drifted');
  assert(artifact.promptCatalogSha256 === PROMPT_CATALOG_SHA256, 'Wave 4 prompt-catalog hash drifted');
  assert(artifact.sources?.characterReferenceQuality?.sha256 === QUALITY_REPORT_SHA256, 'Wave 4 quality-report hash drifted');
  assert(artifact.sources?.riftDossierCatalog?.sha256 === DOSSIER_CATALOG_SHA256, 'Wave 4 dossier-catalog hash drifted');
  assert(artifact.sources?.spritePromptCatalog?.sha256 === PROMPT_CATALOG_SHA256, 'Wave 4 sprite-prompt hash drifted');
  assert(artifact.selectionHashes?.missingOutputsSha256 === MISSING_OUTPUTS_SHA256, 'Wave 4 missing-output hash drifted');
  assert(artifact.selectionHashes?.rejectedOutputsSha256 === REJECTED_OUTPUTS_SHA256, 'Wave 4 rejected-output hash drifted');
  assert(artifact.selectionHashes?.remediationPlanSha256 === REMEDIATION_PLAN_SHA256, 'Wave 4 remediation-plan hash drifted');
  assert(artifact.counts?.jobs === JOB_COUNT, 'Wave 4 job count drifted');
  assert(artifact.counts?.missingLocalReferences === MISSING_REFERENCE_COUNT, 'Wave 4 missing-reference count drifted');
  assert(artifact.counts?.rejectedPlaceholders === REJECTED_PLACEHOLDER_COUNT, 'Wave 4 rejected-placeholder count drifted');
  assert(artifact.counts?.replaceFalse === MISSING_REFERENCE_COUNT, 'Wave 4 replace=false count drifted');
  assert(artifact.counts?.replaceTrue === REJECTED_PLACEHOLDER_COUNT, 'Wave 4 replace=true count drifted');
  assert(Array.isArray(artifact.jobs) && artifact.jobs.length === JOB_COUNT, 'Wave 4 jobs drifted');
  assert(new Set(artifact.jobs.map(job => identityFor(job))).size === JOB_COUNT, 'Wave 4 artifact identities are not unique');
  assert(new Set(artifact.jobs.map(job => job.output)).size === JOB_COUNT, 'Wave 4 artifact outputs are not unique');
  assert(new Set(artifact.jobs.map(job => job.qualityEntryId)).size === JOB_COUNT, 'Wave 4 artifact quality entries are not unique');
  const missingOutputs = artifact.jobs.slice(0, MISSING_REFERENCE_COUNT).map(job => job.output);
  const rejectedOutputs = artifact.jobs.slice(MISSING_REFERENCE_COUNT).map(job => job.output);
  const remediationPlan = artifact.jobs.map(job => ({ output: job.output, replace: job.replace }));
  assert(sha256(JSON.stringify(missingOutputs)) === MISSING_OUTPUTS_SHA256, 'Wave 4 artifact missing outputs drifted');
  assert(sha256(JSON.stringify(rejectedOutputs)) === REJECTED_OUTPUTS_SHA256, 'Wave 4 artifact rejected outputs drifted');
  assert(sha256(JSON.stringify(remediationPlan)) === REMEDIATION_PLAN_SHA256, 'Wave 4 artifact remediation plan drifted');
  const promptFiles = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort(compareText);
  const expectedFiles = artifact.jobs.map(job => path.basename(job.promptFile)).sort(compareText);
  assert(sameValues(promptFiles, expectedFiles), 'Wave 4 prompt directory differs from the declared jobs');
  for (const [index, job] of artifact.jobs.entries()) {
    assert(job.sequence === index + 1, `Wave 4 sequence drifted for ${job.output}`);
    assert(job.replace === (index >= MISSING_REFERENCE_COUNT), `Wave 4 replace policy drifted for ${job.output}`);
    assert(job.kind === 'hero', `Wave 4 kind drifted for ${job.output}`);
    const promptFile = path.resolve(projectRoot, ...job.promptFile.split('/'));
    const bytes = await fs.readFile(promptFile);
    assert(bytes.equals(Buffer.from(job.generationPrompt, 'utf8')), `Prompt file is not verbatim for ${job.output}`);
    assert(sha256(bytes) === job.generationPromptSha256, `Generation prompt hash mismatch for ${job.output}`);
    assert(!SYNTHETIC_CATALOG_LINE.test(job.generationPrompt), `Synthetic catalog lore remains in ${job.output}`);
    assert(/genuine transparent alpha/iu.test(job.generationPrompt), `Transparent-alpha lock missing for ${job.output}`);
    assert(/exactly sixteen equal/iu.test(job.generationPrompt), `Sixteen-cell lock missing for ${job.output}`);
    assert(/Canon authority lock:/u.test(job.generationPrompt), `Canon authority lock missing for ${job.output}`);
    assert(/omit it instead of inventing it/u.test(job.generationPrompt), `No-invention lock missing for ${job.output}`);
  }
  return artifact;
};

const writeBatchArtifact = async batch => {
  await fs.rm(promptDirectory, { recursive: true, force: true });
  await fs.mkdir(promptDirectory, { recursive: true });
  await Promise.all(batch.jobs.map(job => (
    fs.writeFile(path.resolve(projectRoot, ...job.promptFile.split('/')), job.generationPrompt, 'utf8')
  )));
  await fs.writeFile(batchJsonPath, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
};

const main = async () => {
  if (process.argv.includes('--check')) {
    const batch = await validateBatchArtifact();
    console.log(JSON.stringify({ status: 'ok', mode: 'check', batchId: batch.batchId, jobs: batch.jobs.length }, null, 2));
    return;
  }
  const batch = await createBatch();
  await writeBatchArtifact(batch);
  await validateBatchArtifact();
  console.log(JSON.stringify({ status: 'ok', mode: 'write', batchId: batch.batchId, jobs: batch.jobs.length }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
