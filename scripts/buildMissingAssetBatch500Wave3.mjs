import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHeroGenerationPrompt as buildBaseHeroGenerationPrompt } from './buildMissingAssetBatch500.mjs';

const SYNTHETIC_CATALOG_LINE = /^(?:Combat identity|Special motif|Palette anchor)\s*:/iu;

const sanitizeHeroCatalogPrompt = prompt => String(prompt || '')
  .replace(/\r\n?/gu, '\n')
  .split('\n')
  .filter(line => !SYNTHETIC_CATALOG_LINE.test(line.trim()))
  .map(line => {
    if (/^Primary request:/iu.test(line)) {
      return 'Primary request: create a detailed pixel-art animation sheet for the named playable roster character from the named continuity.';
    }
    if (/^Animation rows:/iu.test(line)) {
      return 'Animation rows: row 1 idle breathing, row 2 walk/run cycle, row 3 uses only equipment or abilities explicitly established elsewhere in this prompt; otherwise use four unarmed guard, dodge, or movement frames with no weapon, tool, projectile, aura, effect, named power, or performance; row 4 clean non-gory hit/recoil.';
    }
    if (/^Lore lock:/iu.test(line)) {
      return 'Lore lock: preserve only canon-established silhouette, body proportions, era-appropriate outfit, defining colors and attitude for the named character in the named continuity; include equipment only when explicitly canon-established, otherwise none; do not invent a redesign, class, faction, power or palette.';
    }
    return line;
  })
  .join('\n');

const replaceRequiredLine = (prompt, pattern, replacement, label) => {
  if (!pattern.test(prompt)) throw new Error(`Missing ${label} in hero production prompt`);
  return prompt.replace(pattern, replacement);
};

export const buildHeroGenerationPrompt = entry => {
  const basePrompt = buildBaseHeroGenerationPrompt({
    ...entry,
    prompt: sanitizeHeroCatalogPrompt(entry?.prompt)
  });
  const withCanonAuthority = basePrompt.replace(
    'Production override — this block has priority over any conflicting catalog instruction:',
    [
      'Production override — this block has priority over any conflicting catalog instruction:',
      'Canon authority lock: the named character and named continuity are the sole identity source. Ignore synthetic gameplay classes, generic weapon assignments, generated hex palettes and invented motifs. Do not mix adaptations or eras; when a visual detail is uncertain, omit it instead of inventing it.'
    ].join('\n')
  );
  const withIdentityLock = replaceRequiredLine(
    withCanonAuthority,
    /^Identity lock:.*$/mu,
    `Identity lock: preserve the recognizable canon-established silhouette, body proportions, era-appropriate outfit, defining colors and attitude of ${entry.name} from ${entry.universe}; include equipment only when explicitly canon-established, otherwise none; create original fan-made pixel art, not copied key art, a redesign or a photorealistic actor likeness.`,
    'identity lock'
  );
  const withAnimationLock = replaceRequiredLine(
    withIdentityLock,
    /^Animation choreography lock:.*$/mu,
    'Animation choreography lock: row 1 contains four calm idle-breathing frames; row 2 contains four readable walk/run frames; row 3 uses only equipment or abilities explicitly established elsewhere in this prompt; otherwise use four unarmed guard, dodge, or movement frames with no weapon, tool, projectile, aura, effect, named power, or performance; row 4 contains four non-gory hit/recoil-and-recovery frames.',
    'animation choreography lock'
  );
  const withCellLock = replaceRequiredLine(
    withAnimationLock,
    /^Cell lock:.*$/mu,
    'Cell lock: every cell contains exactly one complete full-body pose; keep the complete pose and any explicitly canon-established equipment or effect inside that cell with transparent breathing room; consistent identity, facing, scale and pixel density across all sixteen cells; no frame may cross a cell boundary.',
    'cell lock'
  );
  return replaceRequiredLine(
    withCellLock,
    /^Universal safety lock:.*$/mu,
    'Universal safety lock: completely nonsexual and non-gory; preserve the established outfit without erotic emphasis; no nudity, exposed anatomy, wounds, blood, viscera, torture or graphic body horror; actions remain clean game-animation poses with no victim.',
    'universal safety lock'
  );
};

export const BATCH_SIZE = 500;
export const ITEM_JOB_COUNT = 0;
export const HERO_JOB_COUNT = 500;
export const EXPECTED_BASELINE_MISSING_ITEMS = 0;
export const EXPECTED_BASELINE_MISSING_HEROES = 670;
export const EXPECTED_REMAINING_ITEMS = 0;
export const EXPECTED_REMAINING_HEROES = 170;
export const BATCH_ID = 'assets-missing-500-wave-3-lore-corrected-2026-08-26';
export const SCHEMA_VERSION = 1;

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
export const batchRoot = path.join(
  projectRoot,
  'docs',
  'openai-generation-prompts-2026-08-25'
);
export const batchJsonPath = path.join(batchRoot, 'asset-batch-500-wave-3.json');
export const promptDirectory = path.join(batchRoot, 'asset-batch-500-wave-3');
const promptCatalogPath = path.join(
  projectRoot,
  'public',
  'sprites',
  'generated',
  'openai-sprite-prompts.jsonl'
);
const spriteManifestPath = path.join(
  projectRoot,
  'public',
  'sprites',
  'generated',
  'sprite-manifest.json'
);

const AGREEMENT_FIELDS = Object.freeze([
  'kind',
  'id',
  'name',
  'universe',
  'output',
  'frame',
  'referenceUrl',
  'referenceUrls',
  'visualAnchor'
]);

const sha256 = value => createHash('sha256').update(value).digest('hex');

const slugify = value => String(value || 'asset')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'asset';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const identityFor = entry => `${entry.kind}:${entry.id}`;

const pickAgreementFields = entry => Object.fromEntries(
  AGREEMENT_FIELDS
    .filter(field => entry[field] !== undefined)
    .map(field => [field, entry[field]])
);

const localPathForOutput = output => path.join(
  projectRoot,
  'public',
  String(output || '').replace(/^\/+/, '')
);

const isFile = async filePath => {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
};

const readJsonlWithBytes = async filePath => {
  const bytes = await fs.readFile(filePath);
  const entries = bytes.toString('utf8')
    .split(/\r?\n/gu)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`${filePath}:${index + 1}: ${error.message}`);
      }
    });
  return { bytes, entries };
};

const indexUniqueByIdentity = (entries, label) => {
  const result = new Map();
  for (const entry of entries) {
    assert(entry.kind, `${label}: ${entry.id || '<unknown>'} has no kind`);
    assert(entry.id, `${label}: entry has no id`);
    assert(entry.output, `${label}: ${entry.id || '<unknown>'} has no output`);
    const identity = identityFor(entry);
    assert(!result.has(identity), `${label}: duplicate identity ${identity}`);
    result.set(identity, entry);
  }
  return result;
};

const compareCatalogAndManifestEntry = (catalogEntry, manifestEntry) => {
  assert(manifestEntry, `Manifest entry missing for ${catalogEntry.output}`);
  assert(
    JSON.stringify(pickAgreementFields(catalogEntry)) === JSON.stringify(pickAgreementFields(manifestEntry)),
    `Prompt/manifest disagreement for ${catalogEntry.output}`
  );
};

const promptFileFor = (sequence, entry) => {
  const shortId = slugify(entry.id).slice(0, 68);
  const suffix = sha256(entry.output).slice(0, 8);
  return [
    'docs',
    'openai-generation-prompts-2026-08-25',
    'asset-batch-500-wave-3',
    `${String(sequence).padStart(3, '0')}-hero-${shortId}-${suffix}.txt`
  ].join('/');
};

const loadCatalogState = async () => {
  const [catalog, spriteManifest] = await Promise.all([
    readJsonlWithBytes(promptCatalogPath),
    fs.readFile(spriteManifestPath, 'utf8').then(JSON.parse)
  ]);
  const promptByIdentity = indexUniqueByIdentity(catalog.entries, 'Prompt catalog');
  const manifestByIdentity = indexUniqueByIdentity(spriteManifest.entries || [], 'Sprite manifest');
  assert(promptByIdentity.size === manifestByIdentity.size, 'Prompt/manifest entry count mismatch');
  for (const entry of catalog.entries) {
    compareCatalogAndManifestEntry(entry, manifestByIdentity.get(identityFor(entry)));
  }
  return {
    promptCatalog: catalog.entries,
    promptCatalogSha256: sha256(catalog.bytes),
    promptByIdentity,
    manifestByIdentity
  };
};

const currentMissingEntries = async (state, kind) => {
  const candidates = state.promptCatalog.filter(entry => entry.kind === kind);
  const availability = await Promise.all(candidates.map(async entry => ({
    entry,
    fileAvailable: await isFile(localPathForOutput(entry.output))
  })));
  for (const { entry, fileAvailable } of availability) {
    const manifestEntry = state.manifestByIdentity.get(identityFor(entry));
    assert(
      Boolean(manifestEntry.available) === fileAvailable,
      `Filesystem/manifest availability disagreement for ${entry.output}`
    );
  }
  return availability
    .filter(({ fileAvailable }) => !fileAvailable)
    .map(({ entry }) => entry);
};

const buildJob = (entry, sequence) => {
  const generationPrompt = buildHeroGenerationPrompt(entry);
  return {
    sequence,
    kind: 'hero',
    id: entry.id,
    name: entry.name,
    universe: entry.universe,
    output: entry.output,
    frame: entry.frame,
    catalogSource: 'openai-sprite-prompts',
    selectionTier: 'currently-missing-heroes-catalog-order',
    referenceUrl: entry.referenceUrl || null,
    referenceUrls: Array.isArray(entry.referenceUrls) ? entry.referenceUrls : [],
    visualAnchor: entry.visualAnchor || null,
    sourcePromptSha256: sha256(Buffer.from(entry.prompt, 'utf8')),
    generationPromptSha256: sha256(Buffer.from(generationPrompt, 'utf8')),
    promptFile: promptFileFor(sequence, entry),
    generationPrompt
  };
};

export const createBatch = async () => {
  const state = await loadCatalogState();
  const [missingItems, missingHeroes] = await Promise.all([
    currentMissingEntries(state, 'item'),
    currentMissingEntries(state, 'hero')
  ]);
  assert(
    missingItems.length === EXPECTED_BASELINE_MISSING_ITEMS,
    `Expected ${EXPECTED_BASELINE_MISSING_ITEMS} missing items, received ${missingItems.length}`
  );
  assert(
    missingHeroes.length === EXPECTED_BASELINE_MISSING_HEROES,
    `Expected ${EXPECTED_BASELINE_MISSING_HEROES} missing heroes, received ${missingHeroes.length}`
  );

  const selected = missingHeroes.slice(0, HERO_JOB_COUNT);
  assert(selected.length === BATCH_SIZE, `Expected ${BATCH_SIZE} selected assets, received ${selected.length}`);
  const jobs = selected.map((entry, index) => buildJob(entry, index + 1));
  assert(new Set(jobs.map(job => identityFor(job))).size === jobs.length, 'Duplicate batch identity');
  assert(new Set(jobs.map(job => job.id)).size === jobs.length, 'Queue-incompatible duplicate batch ID');
  assert(new Set(jobs.map(job => job.output)).size === jobs.length, 'Duplicate batch output');

  const baselineItemOutputs = missingItems.map(entry => entry.output);
  const baselineHeroOutputs = missingHeroes.map(entry => entry.output);
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'hero',
    promptCatalogSha256: state.promptCatalogSha256,
    selectionPolicy: [
      'currently missing kind=hero prompt entries in catalog order',
      'deduplicate by kind:id and output',
      'stop at exactly 500 jobs'
    ],
    counts: {
      jobs: jobs.length,
      selectedItems: ITEM_JOB_COUNT,
      selectedHeroes: HERO_JOB_COUNT,
      baselineMissingItems: baselineItemOutputs.length,
      baselineMissingHeroes: baselineHeroOutputs.length,
      remainingMissingItemsAfterBatch: EXPECTED_REMAINING_ITEMS,
      remainingMissingHeroesAfterBatch: EXPECTED_REMAINING_HEROES
    },
    baseline: {
      missingItemOutputs: baselineItemOutputs,
      missingItemOutputsSha256: sha256(JSON.stringify(baselineItemOutputs)),
      missingHeroOutputs: baselineHeroOutputs,
      missingHeroOutputsSha256: sha256(JSON.stringify(baselineHeroOutputs))
    },
    jobs
  };
};

export const validateBatchArtifact = async () => {
  const [batch, state] = await Promise.all([
    fs.readFile(batchJsonPath, 'utf8').then(JSON.parse),
    loadCatalogState()
  ]);
  assert(batch.schemaVersion === SCHEMA_VERSION, `Unsupported batch schema ${batch.schemaVersion}`);
  assert(batch.batchId === BATCH_ID, `Unexpected batch ID ${batch.batchId}`);
  assert(batch.kind === 'hero', `Unexpected batch kind ${batch.kind}`);
  assert(batch.promptCatalogSha256 === state.promptCatalogSha256, 'Prompt catalog hash drifted');
  assert(batch.jobs.length === BATCH_SIZE, `Expected ${BATCH_SIZE} jobs, received ${batch.jobs.length}`);
  assert(batch.counts.jobs === BATCH_SIZE, 'Batch count does not match jobs');
  assert(batch.counts.selectedItems === ITEM_JOB_COUNT, 'Unexpected selected item count');
  assert(batch.counts.selectedHeroes === HERO_JOB_COUNT, 'Unexpected selected hero count');
  assert(batch.counts.baselineMissingItems === EXPECTED_BASELINE_MISSING_ITEMS, 'Unexpected item baseline');
  assert(batch.counts.baselineMissingHeroes === EXPECTED_BASELINE_MISSING_HEROES, 'Unexpected hero baseline');
  assert(batch.counts.remainingMissingItemsAfterBatch === EXPECTED_REMAINING_ITEMS, 'Unexpected remaining items');
  assert(batch.counts.remainingMissingHeroesAfterBatch === EXPECTED_REMAINING_HEROES, 'Unexpected remaining heroes');
  assert(batch.baseline.missingItemOutputs.length === EXPECTED_BASELINE_MISSING_ITEMS, 'Incomplete item baseline');
  assert(batch.baseline.missingHeroOutputs.length === EXPECTED_BASELINE_MISSING_HEROES, 'Incomplete hero baseline');
  assert(
    batch.baseline.missingItemOutputsSha256 === sha256(JSON.stringify(batch.baseline.missingItemOutputs)),
    'Item baseline hash mismatch'
  );
  assert(
    batch.baseline.missingHeroOutputsSha256 === sha256(JSON.stringify(batch.baseline.missingHeroOutputs)),
    'Hero baseline hash mismatch'
  );

  const expectedOutputs = batch.baseline.missingHeroOutputs.slice(0, HERO_JOB_COUNT);
  assert(expectedOutputs.length === BATCH_SIZE, 'Frozen baseline cannot produce 500 jobs');
  assert(
    JSON.stringify(batch.jobs.map(job => job.output)) === JSON.stringify(expectedOutputs),
    'Batch order no longer matches the frozen hero-only policy'
  );

  const ids = new Set();
  const identities = new Set();
  const outputs = new Set();
  const promptFiles = new Set();
  for (const [index, job] of batch.jobs.entries()) {
    assert(job.sequence === index + 1, `Invalid sequence for ${job.output}`);
    assert(job.kind === 'hero', `Unsupported job kind ${job.kind}`);
    assert(!ids.has(job.id), `Queue-incompatible duplicate ID ${job.id}`);
    assert(!identities.has(identityFor(job)), `Duplicate identity ${identityFor(job)}`);
    assert(!outputs.has(job.output), `Duplicate output ${job.output}`);
    assert(!promptFiles.has(job.promptFile), `Duplicate prompt file ${job.promptFile}`);
    ids.add(job.id);
    identities.add(identityFor(job));
    outputs.add(job.output);
    promptFiles.add(job.promptFile);

    const promptEntry = state.promptByIdentity.get(identityFor(job));
    const manifestEntry = state.manifestByIdentity.get(identityFor(job));
    assert(promptEntry, `Catalog prompt missing for ${job.output}`);
    compareCatalogAndManifestEntry(promptEntry, manifestEntry);
    assert(job.id === promptEntry.id, `Job ID drift for ${job.output}`);
    assert(job.output === promptEntry.output, `Job output drift for ${job.output}`);
    assert(job.sourcePromptSha256 === sha256(Buffer.from(promptEntry.prompt, 'utf8')), `Source prompt hash mismatch for ${job.output}`);
    const expectedPrompt = buildHeroGenerationPrompt(promptEntry);
    assert(job.generationPrompt === expectedPrompt, `Generation prompt drift for ${job.output}`);
    assert(job.generationPromptSha256 === sha256(Buffer.from(expectedPrompt, 'utf8')), `Generation prompt hash mismatch for ${job.output}`);
    assert(!/#00ff00/iu.test(expectedPrompt), `Chroma-key instruction remains in ${job.output}`);
    assert(/genuine transparent alpha/iu.test(expectedPrompt), `Transparent-alpha lock missing for ${job.output}`);
    assert(/nonsexual and non-gory/iu.test(expectedPrompt), `Safety lock missing for ${job.output}`);
    assert(/no text/iu.test(expectedPrompt) && /no franchise logo/iu.test(expectedPrompt), `Branding lock missing for ${job.output}`);
    assert(/exactly sixteen equal/iu.test(expectedPrompt), `Sixteen-cell lock missing for ${job.output}`);
    assert(/4 columns x 4 rows/iu.test(expectedPrompt), `4x4 lock missing for ${job.output}`);
    assert(job.frame?.width === 256 && job.frame?.height === 256, `Hero frame geometry drift for ${job.output}`);

    const promptFilePath = path.resolve(projectRoot, ...job.promptFile.split('/'));
    assert(promptFilePath.startsWith(`${promptDirectory}${path.sep}`), `Prompt path escapes batch directory: ${job.promptFile}`);
    const promptBytes = await fs.readFile(promptFilePath);
    assert(promptBytes.equals(Buffer.from(expectedPrompt, 'utf8')), `Prompt file is not verbatim for ${job.output}`);
  }

  const files = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  const expectedFiles = batch.jobs.map(job => path.basename(job.promptFile)).sort();
  assert(JSON.stringify(files) === JSON.stringify(expectedFiles), 'Prompt directory must contain exactly 500 declared files');
  return batch;
};

const writeBatchArtifact = async batch => {
  await fs.mkdir(batchRoot, { recursive: true });
  await fs.rm(promptDirectory, { recursive: true, force: true });
  await fs.mkdir(promptDirectory, { recursive: true });
  await Promise.all(batch.jobs.map(job => (
    fs.writeFile(path.resolve(projectRoot, ...job.promptFile.split('/')), job.generationPrompt, 'utf8')
  )));
  await fs.writeFile(batchJsonPath, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
};

const summary = (batch, mode) => ({
  status: 'ok',
  mode,
  batchId: batch.batchId,
  ...batch.counts,
  promptFiles: batch.jobs.length,
  batchJson: path.relative(projectRoot, batchJsonPath).replaceAll('\\', '/')
});

const main = async () => {
  if (process.argv.includes('--check')) {
    const batch = await validateBatchArtifact();
    console.log(JSON.stringify(summary(batch, 'check'), null, 2));
    return;
  }
  const batch = await createBatch();
  await writeBatchArtifact(batch);
  await validateBatchArtifact();
  console.log(JSON.stringify(summary(batch, 'write'), null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
