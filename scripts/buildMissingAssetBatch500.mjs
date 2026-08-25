import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildGenerationPrompt as buildItemGenerationPrompt } from './buildMissingItemBatch.mjs';

export const BATCH_SIZE = 500;
export const ITEM_JOB_COUNT = 234;
export const HERO_JOB_COUNT = 266;
export const EXPECTED_BASELINE_MISSING_ITEMS = 234;
export const EXPECTED_BASELINE_MISSING_HEROES = 936;
export const EXPECTED_REMAINING_ITEMS = 0;
export const EXPECTED_REMAINING_HEROES = 670;
export const BATCH_ID = 'assets-missing-500-wave-2-2026-08-25';
export const SCHEMA_VERSION = 1;

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
export const batchRoot = path.join(
  projectRoot,
  'docs',
  'openai-generation-prompts-2026-08-25'
);
export const batchJsonPath = path.join(batchRoot, 'asset-batch-500-wave-2.json');
export const promptDirectory = path.join(batchRoot, 'asset-batch-500-wave-2');
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

const identityFor = entry => `${entry.kind}:${entry.id}`;

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

const heroTransparentLock = [
  'Background/output lock: genuine transparent alpha in every cell and around every full-body frame (32-bit RGBA);',
  'no chroma-key color, no green-screen fill, no checkerboard pattern, no baked backdrop,',
  'no floor plane, no cast shadow outside the silhouette and no opaque panel.'
].join(' ');

export const buildHeroGenerationPrompt = entry => {
  assert(entry?.kind === 'hero', `Hero prompt requires kind=hero for ${entry?.output || '<unknown>'}`);
  const sourceLines = String(entry.prompt || '')
    .replace(/\r\n?/gu, '\n')
    .split('\n');
  assert(sourceLines.some(line => line.trim()), `Empty hero catalog prompt for ${entry.output}`);

  const adaptedSource = sourceLines.map(line => {
    if (/^Style\/medium:/iu.test(line)) {
      return 'Style/medium: polished highly detailed 32-bit-era pixel art with crisp clusters, controlled hand-painted highlights, a clean dark outline and a readable full-body silhouette faithful to the named continuity.';
    }
    if (/^Composition\/framing:/iu.test(line)) {
      return 'Composition/framing: exact 4 columns x 4 rows, exactly sixteen equal isolated cells, one full-body frame centered in each cell, consistent elevated three-quarter side battle angle facing right, scale, proportions and light direction.';
    }
    if (/^Background:/iu.test(line)) return heroTransparentLock;
    if (/^Constraints:/iu.test(line)) {
      return 'Constraints: exactly one character identity across all sixteen cells; no extra character, duplicate body in one cell, cropped body, merged cells, visible grid, UI label, text, logo or watermark.';
    }
    return line;
  });

  return [
    ...adaptedSource,
    '',
    'Production override — this block has priority over any conflicting catalog instruction:',
    'Sheet lock: produce one square transparent PNG containing exactly a 4 columns x 4 rows animation sheet; exactly sixteen equal nonempty cells; the production normalizer will deliver a 1024 x 1024 sheet with sixteen 256 x 256 cells.',
    `Identity lock: preserve the recognizable canonical or explicitly adapted silhouette, outfit, equipment, palette, role and attitude of ${entry.name} from ${entry.universe}; create an original fan-made pixel-art interpretation, not copied key art and not a photorealistic actor likeness.`,
    `Roster-variant lock: this is the dedicated runtime identity ${entry.id}; if another catalog entry represents the same canonical character, keep the same lore identity but distinguish this sheet through animation timing and pose cadence only, without inventing a new costume, power or continuity.`,
    'Animation choreography lock: row 1 contains four calm idle-breathing frames; row 2 contains four readable walk/run frames; row 3 contains four signature attack or ability frames using only the stated equipment/power; row 4 contains four non-gory hit/recoil-and-recovery frames.',
    'Cell lock: every cell contains exactly one complete full-body pose; keep feet, head, weapon and effects inside that cell with transparent breathing room; consistent identity, facing, scale and pixel density across all sixteen cells; no frame may cross a cell boundary.',
    heroTransparentLock,
    'Universal safety lock: completely nonsexual and non-gory; practical lore-appropriate clothing; no nudity, erotic framing, exposed anatomy, wounds, blood, viscera, torture or graphic body horror; attacks remain clean game-animation poses with no victim.',
    'Branding lock: no text, no letters, no numbers, no caption, no franchise logo, no product logo, no UI label, no signature and no watermark.'
  ].join('\n');
};

export const buildGenerationPrompt = entry => (
  entry.kind === 'item'
    ? buildItemGenerationPrompt(entry)
    : buildHeroGenerationPrompt(entry)
);

const promptFileFor = (sequence, entry) => {
  const shortId = slugify(entry.id).slice(0, 68);
  const suffix = sha256(entry.output).slice(0, 8);
  return [
    'docs',
    'openai-generation-prompts-2026-08-25',
    'asset-batch-500-wave-2',
    `${String(sequence).padStart(3, '0')}-${entry.kind}-${shortId}-${suffix}.txt`
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
    spriteManifest,
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
  return availability.filter(({ fileAvailable }) => !fileAvailable).map(({ entry }) => entry);
};

const buildJob = (entry, sequence) => {
  const generationPrompt = buildGenerationPrompt(entry);
  return {
    sequence,
    kind: entry.kind,
    id: entry.id,
    name: entry.name,
    universe: entry.universe,
    output: entry.output,
    frame: entry.frame,
    catalogSource: 'openai-sprite-prompts',
    selectionTier: entry.kind === 'item'
      ? 'finish-currently-missing-items'
      : 'currently-missing-heroes-catalog-order',
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

  const selected = [
    ...missingItems,
    ...missingHeroes.slice(0, HERO_JOB_COUNT)
  ];
  assert(selected.length === BATCH_SIZE, `Expected ${BATCH_SIZE} selected assets, received ${selected.length}`);
  const jobs = selected.map((entry, index) => buildJob(entry, index + 1));
  assert(new Set(jobs.map(job => `${job.kind}:${job.id}`)).size === jobs.length, 'Duplicate batch identity');
  assert(new Set(jobs.map(job => job.id)).size === jobs.length, 'Queue-incompatible duplicate batch ID');
  assert(new Set(jobs.map(job => job.output)).size === jobs.length, 'Duplicate batch output');

  const baselineItemOutputs = missingItems.map(entry => entry.output);
  const baselineHeroOutputs = missingHeroes.map(entry => entry.output);
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'mixed',
    promptCatalogSha256: state.promptCatalogSha256,
    selectionPolicy: [
      'all currently missing kind=item prompt entries in catalog order',
      'then currently missing kind=hero prompt entries in catalog order',
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
  assert(batch.kind === 'mixed', `Unexpected batch kind ${batch.kind}`);
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

  const expectedOutputs = [
    ...batch.baseline.missingItemOutputs,
    ...batch.baseline.missingHeroOutputs.slice(0, HERO_JOB_COUNT)
  ];
  assert(expectedOutputs.length === BATCH_SIZE, 'Frozen baseline cannot produce 500 jobs');
  assert(
    JSON.stringify(batch.jobs.map(job => job.output)) === JSON.stringify(expectedOutputs),
    'Batch order no longer matches the frozen item-then-hero policy'
  );

  const ids = new Set();
  const identities = new Set();
  const outputs = new Set();
  const promptFiles = new Set();
  for (const [index, job] of batch.jobs.entries()) {
    assert(job.sequence === index + 1, `Invalid sequence for ${job.output}`);
    assert(['item', 'hero'].includes(job.kind), `Unsupported job kind ${job.kind}`);
    assert(!ids.has(job.id), `Queue-incompatible duplicate ID ${job.id}`);
    assert(!identities.has(`${job.kind}:${job.id}`), `Duplicate identity ${job.kind}:${job.id}`);
    assert(!outputs.has(job.output), `Duplicate output ${job.output}`);
    assert(!promptFiles.has(job.promptFile), `Duplicate prompt file ${job.promptFile}`);
    ids.add(job.id);
    identities.add(`${job.kind}:${job.id}`);
    outputs.add(job.output);
    promptFiles.add(job.promptFile);

    const identity = identityFor(job);
    const promptEntry = state.promptByIdentity.get(identity);
    const manifestEntry = state.manifestByIdentity.get(identity);
    assert(promptEntry, `Catalog prompt missing for ${job.output}`);
    compareCatalogAndManifestEntry(promptEntry, manifestEntry);
    assert(job.kind === promptEntry.kind, `Job kind drift for ${job.output}`);
    assert(job.id === promptEntry.id, `Job ID drift for ${job.output}`);
    assert(job.sourcePromptSha256 === sha256(Buffer.from(promptEntry.prompt, 'utf8')), `Source prompt hash mismatch for ${job.output}`);
    const expectedPrompt = buildGenerationPrompt(promptEntry);
    assert(job.generationPrompt === expectedPrompt, `Generation prompt drift for ${job.output}`);
    assert(job.generationPromptSha256 === sha256(Buffer.from(expectedPrompt, 'utf8')), `Generation prompt hash mismatch for ${job.output}`);
    assert(!/#00ff00/iu.test(expectedPrompt), `Chroma-key instruction remains in ${job.output}`);
    assert(/genuine transparent alpha/iu.test(expectedPrompt), `Transparent-alpha lock missing for ${job.output}`);
    assert(/nonsexual and non-gory/iu.test(expectedPrompt), `Safety lock missing for ${job.output}`);
    assert(/no text/iu.test(expectedPrompt) && /no franchise logo/iu.test(expectedPrompt), `Branding lock missing for ${job.output}`);
    if (job.kind === 'hero') {
      assert(/exactly sixteen equal/iu.test(expectedPrompt), `Sixteen-cell lock missing for ${job.output}`);
      assert(/4 columns x 4 rows/iu.test(expectedPrompt), `4x4 lock missing for ${job.output}`);
      assert(job.frame?.width === 256 && job.frame?.height === 256, `Hero frame geometry drift for ${job.output}`);
    } else {
      assert(/512 x 512 pixels/iu.test(expectedPrompt), `Item dimension lock missing for ${job.output}`);
      assert(job.frame?.width === 512 && job.frame?.height === 512, `Item frame geometry drift for ${job.output}`);
    }

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
