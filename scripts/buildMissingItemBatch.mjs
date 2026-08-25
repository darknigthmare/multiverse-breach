import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPANDED_EVENT_SHOP_ITEMS } from '../src/game/expandedUniverses.js';
import { LORE_ITEM_OVERRIDES } from '../src/game/loreItemOverrides.js';
import { getItemSpriteSrc } from '../src/game/spriteAssets.js';
import { STATIC_GEAR_SHOP_ITEMS } from './gearShopInventory.mjs';

export const BATCH_SIZE = 500;
export const EXPECTED_BASELINE_MISSING_ITEMS = 734;
export const EXPECTED_GEAR_SHOP_MISSING = 80;
export const EXPECTED_LORE_OVERRIDE_MISSING = 198;
export const EXPECTED_CATALOG_EXTENSIONS = 0;
export const EXPECTED_REMAINING_MISSING_ITEMS = 234;
export const BATCH_ID = 'items-missing-500-2026-08-24';
export const CURRENT_PROMPT_POLICY_VERSION = 2;

export const RETRY_PROMPT_TARGETS = Object.freeze([
  Object.freeze({ sequence: 1, id: 'evt_atomic_heart_collective_failure' }),
  Object.freeze({ sequence: 56, id: 'evt_squirrel_with_a_gun_breach_event' }),
  Object.freeze({ sequence: 78, id: 'evt_friday_13th_breach_event' }),
  Object.freeze({ sequence: 155, id: 'scp_core' })
]);

export const RETRY_FIDELITY_LOCKS = Object.freeze({
  evt_atomic_heart_collective_failure: 'Retry fidelity lock: show a compact Facility 3826 industrial-route mini-diorama with a luminous red maintenance-network lattice, multiple small repair drones and visibly reactivating retrofuturist machines; every listed element must be legible together.',
  evt_squirrel_with_a_gun_breach_event: 'Retry fidelity lock: show one stylized realistic squirrel clearly holding its recognizable compact handgun as a non-firing prop, inside a bright suburban street-and-yard mini-diorama, with distant dark-suited agent silhouettes; playful action only, no injury, no muzzle flash and no gore.',
  evt_friday_13th_breach_event: 'Retry fidelity lock: show a moonlit summer-camp mini-diorama with pine trees, one wooden cabin, lake reflections, a full moon and one distant symbolic masked slasher silhouette; no victim, no attack, no blood and no gore.',
  scp_core: 'Retry fidelity lock: exactly one dark rectangular facility keycard with a single horizontal orange stripe and simple abstract clearance blocks; absolutely no SCP emblem, no circular seal, no three inward-pointing arrows, no logo, no text, no letters and no numbers.'
});

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
export const batchRoot = path.join(
  projectRoot,
  'docs',
  'openai-generation-prompts-2026-08-24'
);
export const batchJsonPath = path.join(batchRoot, 'item-batch-500.json');
export const promptDirectory = path.join(batchRoot, 'item-batch-500');
export const retryPromptDirectory = path.join(promptDirectory, 'retries');
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

const slugify = value => String(value || 'item')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'item';

const unique = values => [...new Set(values.filter(Boolean))];

const pickAgreementFields = entry => Object.fromEntries(
  AGREEMENT_FIELDS
    .filter(field => entry[field] !== undefined)
    .map(field => [field, entry[field]])
);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

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

const readJsonl = async filePath => (
  (await fs.readFile(filePath, 'utf8'))
    .split(/\r?\n/gu)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`${filePath}:${index + 1}: ${error.message}`);
      }
    })
);

const indexUniqueByOutput = (entries, label) => {
  const result = new Map();
  for (const entry of entries) {
    assert(entry.output, `${label}: entry ${entry.id || '<unknown>'} has no output`);
    assert(!result.has(entry.output), `${label}: duplicate output ${entry.output}`);
    result.set(entry.output, entry);
  }
  return result;
};

const collectGearShopOutputs = () => unique([
  ...STATIC_GEAR_SHOP_ITEMS,
  ...EXPANDED_EVENT_SHOP_ITEMS
].map(getItemSpriteSrc));

const collectLoreOverrideItems = () => (
  Object.values(LORE_ITEM_OVERRIDES)
    .filter(policy => policy.status !== 'disabled')
    .flatMap(policy => policy.allItems || [])
);

const collectLoreOverrideOutputs = () => unique(
  collectLoreOverrideItems().map(item => item.icon)
);

const buildLoreCatalogEntry = item => ({
  kind: 'item',
  id: item.id,
  name: item.name?.en || item.name?.fr || item.id,
  universe: item.universe,
  output: item.icon,
  frame: { width: 512, height: 512, columns: 1, rows: ['icon'] },
  referenceUrl: item.referenceUrl,
  visualAnchor: item.visualAnchor,
  curatedPrompt: true,
  catalogSource: 'lore-item-override-extension',
  prompt: item.iconPrompt || item.prompt
});

const compareCatalogAndManifestEntry = (catalogEntry, manifestEntry) => {
  assert(manifestEntry, `Manifest entry missing for ${catalogEntry.output}`);
  const catalogContract = JSON.stringify(pickAgreementFields(catalogEntry));
  const manifestContract = JSON.stringify(pickAgreementFields(manifestEntry));
  assert(
    catalogContract === manifestContract,
    `Prompt/manifest disagreement for ${catalogEntry.output}`
  );
};

export const buildGenerationPrompt = (entry, { policyVersion = CURRENT_PROMPT_POLICY_VERSION } = {}) => {
  const sourceLines = String(entry.prompt || '')
    .replace(/\r\n?/gu, '\n')
    .split('\n');
  assert(sourceLines.some(line => line.trim()), `Empty catalog prompt for ${entry.output}`);

  const eventEntry = policyVersion >= 2 && /^evt_/u.test(String(entry.id || ''));
  const retryFidelityLock = policyVersion >= 2
    ? RETRY_FIDELITY_LOCKS[entry.id] || null
    : null;

  const transparentLock = eventEntry
    ? [
        'Background/output lock: genuine transparent alpha around the compact diorama silhouette only (32-bit RGBA);',
        'no chroma-key color, no green-screen fill, no checkerboard pattern, no baked full-canvas backdrop',
        'and no rectangular background plate.'
      ].join(' ')
    : [
        'Background/output lock: genuine transparent alpha only (32-bit RGBA);',
        'no chroma-key color, no green-screen fill, no checkerboard pattern, no baked backdrop,',
        'no floor plane and no cast shadow outside the item silhouette.'
      ].join(' ');
  const adaptedSource = sourceLines.map(line => {
    if (/#00ff00/iu.test(line)) return transparentLock;
    if (!eventEntry) return line;
    if (/^Asset type:/iu.test(line)) {
      return 'Asset type: transparent game event vignette for a 2D canvas battle game';
    }
    if (/^Primary request:/iu.test(line)) {
      return `Primary request: create a compact pixel-art mini-diorama for ${entry.name} from ${entry.universe}, preserving the complete event action and every required subject in the visual anchor.`;
    }
    if (/^Composition\/framing:/iu.test(line)) {
      return 'Composition/framing: centered compact environmental mini-diorama with generous transparent padding; scenery, creatures and distant character silhouettes are allowed when required by the visual anchor.';
    }
    if (/^Background\/output lock:/iu.test(line)) return transparentLock;
    if (/^Constraints:/iu.test(line)) {
      return 'Constraints: one cohesive event vignette only; include every location, prop, machine, creature or silhouette required by the visual anchor; no unrelated subjects, UI labels, readable logos or full-canvas backdrop.';
    }
    return line;
  });

  const referenceUrls = unique([
    entry.referenceUrl,
    ...(Array.isArray(entry.referenceUrls) ? entry.referenceUrls : [])
  ]);

  return [
    ...adaptedSource,
    '',
    'Production override — this block has priority over any conflicting catalog instruction:',
    eventEntry
      ? 'Event asset lock: produce exactly one compact, centered environmental mini-diorama at 512 x 512 pixels as highly detailed 32-bit-era pixel art in a 32-bit RGBA PNG, with generous transparent padding and a cohesive silhouette readable in the Gear Shop UI; do not reduce the event to one isolated prop.'
      : 'Asset lock: produce exactly one isolated, centered item icon at 512 x 512 pixels as highly detailed 32-bit-era pixel art in a 32-bit RGBA PNG, with generous transparent padding and a silhouette readable in the Gear Shop UI.',
    entry.visualAnchor
      ? `Reference-locked visual anchor (preserve these identifying physical details): ${entry.visualAnchor}`
      : 'Reference-locked visual anchor: preserve the item identity and physical details stated in the source prompt.',
    ...(retryFidelityLock ? [retryFidelityLock] : []),
    referenceUrls.length > 0
      ? `Canonical reference source(s), for factual visual guidance only: ${referenceUrls.join(' | ')}`
      : 'Canonical reference source: use only the lore and visual facts already stated in the source prompt.',
    eventEntry
      ? 'Canon-fidelity lock: keep the event recognizable through its canonical or explicitly supplied location, palette, props, action and every subject or silhouette required by the visual anchor; create an original fan-made rendering rather than copying official artwork.'
      : 'Canon-fidelity lock: keep the item recognizable through its canonical or explicitly supplied visual anchor, materials, shape, palette and function; create an original fan-made rendering rather than copying official artwork.',
    eventEntry
      ? 'Composition lock: one compact event scene only; scenery and character, creature or agent silhouettes are explicitly allowed when the visual anchor requires them, and every required subject must remain visible; no unrelated characters, no close-up hands or anatomy, no collage, no duplicate scene, no UI frame and no cropped diorama.'
      : 'Composition lock: one item design only, no character, no hands, no anatomy, no scenery, no collage, no duplicate, no UI frame and no cropped silhouette.',
    transparentLock,
    'Universal safety lock: completely nonsexual and non-gory; no nudity, erotic framing, exposed anatomy, wounds, blood, viscera, torture or graphic body horror. Convert any unsafe source motif into a clean symbolic prop while preserving its gameplay identity.',
    'Branding lock: no text, no letters, no numbers, no caption, no readable symbol used as writing, no franchise logo, no product logo, no UI label, no signature and no watermark.'
  ].join('\n');
};

const promptFileFor = (sequence, entry) => {
  const shortId = slugify(entry.id).slice(0, 72);
  const suffix = sha256(entry.output).slice(0, 8);
  return [
    'docs',
    'openai-generation-prompts-2026-08-24',
    'item-batch-500',
    `${String(sequence).padStart(3, '0')}-${shortId}-${suffix}.txt`
  ].join('/');
};

const loadCatalogState = async () => {
  const [promptCatalog, spriteManifest] = await Promise.all([
    readJsonl(promptCatalogPath),
    fs.readFile(spriteManifestPath, 'utf8').then(JSON.parse)
  ]);
  const catalogPromptItems = promptCatalog.filter(entry => entry.kind === 'item');
  const catalogManifestItems = (spriteManifest.entries || []).filter(entry => entry.kind === 'item');
  const catalogPromptOutputs = new Set(catalogPromptItems.map(entry => entry.output));
  const loreItemsOutsideCatalog = collectLoreOverrideItems()
    .filter(item => !catalogPromptOutputs.has(item.icon));
  const extensionPromptItems = (await Promise.all(loreItemsOutsideCatalog.map(async item => ({
    item,
    available: await isFile(localPathForOutput(item.icon))
  }))))
    .filter(({ available }) => !available)
    .map(({ item }) => buildLoreCatalogEntry(item));
  assert(
    extensionPromptItems.length === EXPECTED_CATALOG_EXTENSIONS,
    `Expected ${EXPECTED_CATALOG_EXTENSIONS} lore prompt/manifest extensions, received ${extensionPromptItems.length}`
  );
  const extensionManifestItems = extensionPromptItems.map(entry => ({
    ...pickAgreementFields(entry),
    available: false,
    source: null,
    provenanceStatus: 'missing',
    catalogSource: entry.catalogSource
  }));
  const promptItems = [...catalogPromptItems, ...extensionPromptItems];
  const manifestItems = [...catalogManifestItems, ...extensionManifestItems];
  const promptByOutput = indexUniqueByOutput(promptItems, 'Prompt catalog plus lore extension');
  const manifestByOutput = indexUniqueByOutput(manifestItems, 'Sprite manifest plus lore extension');

  for (const entry of promptItems) {
    compareCatalogAndManifestEntry(entry, manifestByOutput.get(entry.output));
  }

  return {
    promptItems,
    promptByOutput,
    manifestItems,
    manifestByOutput,
    extensionPromptItems,
    extensionManifestItems
  };
};

const buildSelection = ({ promptItems, promptByOutput, manifestByOutput }, missingOutputs) => {
  const missingSet = new Set(missingOutputs);
  const gearShopMissingOutputs = collectGearShopOutputs().filter(output => missingSet.has(output));
  const loreOverrideMissingOutputs = collectLoreOverrideOutputs().filter(output => missingSet.has(output));

  assert(
    gearShopMissingOutputs.length === EXPECTED_GEAR_SHOP_MISSING,
    `Expected ${EXPECTED_GEAR_SHOP_MISSING} missing Gear Shop items, received ${gearShopMissingOutputs.length}`
  );
  assert(
    loreOverrideMissingOutputs.length === EXPECTED_LORE_OVERRIDE_MISSING,
    `Expected ${EXPECTED_LORE_OVERRIDE_MISSING} missing lore override items, received ${loreOverrideMissingOutputs.length}`
  );

  const orderedOutputs = [];
  const selected = new Set();
  const append = output => {
    if (!missingSet.has(output) || selected.has(output) || orderedOutputs.length >= BATCH_SIZE) return;
    assert(promptByOutput.has(output), `No item prompt for selected output ${output}`);
    assert(manifestByOutput.has(output), `No item manifest entry for selected output ${output}`);
    selected.add(output);
    orderedOutputs.push(output);
  };

  gearShopMissingOutputs.forEach(append);
  loreOverrideMissingOutputs.forEach(append);
  promptItems.forEach(entry => append(entry.output));

  assert(orderedOutputs.length === BATCH_SIZE, `Expected ${BATCH_SIZE} selected items, received ${orderedOutputs.length}`);
  return { orderedOutputs, gearShopMissingOutputs, loreOverrideMissingOutputs };
};

export const createBatch = async () => {
  const state = await loadCatalogState();
  const availability = await Promise.all(state.promptItems.map(async entry => ({
    entry,
    available: await isFile(localPathForOutput(entry.output))
  })));

  for (const { entry, available } of availability) {
    const manifestEntry = state.manifestByOutput.get(entry.output);
    assert(
      Boolean(manifestEntry.available) === available,
      `Filesystem/manifest availability disagreement for ${entry.output}`
    );
  }

  const missingOutputs = availability
    .filter(({ available }) => !available)
    .map(({ entry }) => entry.output);
  assert(
    missingOutputs.length === EXPECTED_BASELINE_MISSING_ITEMS,
    `Expected ${EXPECTED_BASELINE_MISSING_ITEMS} missing item prompts, received ${missingOutputs.length}`
  );

  const selection = buildSelection(state, missingOutputs);
  const gearSet = new Set(selection.gearShopMissingOutputs);
  const loreSet = new Set(selection.loreOverrideMissingOutputs);
  const jobs = selection.orderedOutputs.map((output, index) => {
    const entry = state.promptByOutput.get(output);
    const generationPrompt = buildGenerationPrompt(entry, {
      policyVersion: CURRENT_PROMPT_POLICY_VERSION
    });
    const sequence = index + 1;
    const promptFile = promptFileFor(sequence, entry);
    return {
      sequence,
      id: entry.id,
      name: entry.name,
      universe: entry.universe,
      output: entry.output,
      catalogSource: entry.catalogSource || 'openai-sprite-prompts',
      selectionTier: gearSet.has(output)
        ? 'gear-shop-missing'
        : loreSet.has(output)
          ? 'lore-item-override-missing'
          : 'item-catalog-order',
      coverage: {
        gearShopMissingAtSelection: gearSet.has(output),
        loreItemOverrideMissingAtSelection: loreSet.has(output)
      },
      referenceUrl: entry.referenceUrl || null,
      referenceUrls: Array.isArray(entry.referenceUrls) ? entry.referenceUrls : [],
      visualAnchor: entry.visualAnchor || null,
      sourcePromptSha256: sha256(Buffer.from(entry.prompt, 'utf8')),
      generationPromptSha256: sha256(Buffer.from(generationPrompt, 'utf8')),
      promptFile,
      generationPrompt
    };
  });

  assert(new Set(jobs.map(job => job.id)).size === jobs.length, 'Selected jobs contain duplicate IDs');
  assert(new Set(jobs.map(job => job.output)).size === jobs.length, 'Selected jobs contain duplicate outputs');

  const selectedSet = new Set(selection.orderedOutputs);
  const remainingMissingOutputs = missingOutputs.filter(output => !selectedSet.has(output));
  assert(
    remainingMissingOutputs.length === EXPECTED_REMAINING_MISSING_ITEMS,
    `Expected ${EXPECTED_REMAINING_MISSING_ITEMS} remaining missing items, received ${remainingMissingOutputs.length}`
  );

  return {
    schemaVersion: CURRENT_PROMPT_POLICY_VERSION,
    batchId: BATCH_ID,
    kind: 'item',
    selectionPolicy: [
      'currently missing Gear Shop expanded/static outputs in runtime order',
      'currently missing LORE_ITEM_OVERRIDES outputs in registry order',
      'remaining currently missing kind=item prompt entries in catalog order',
      'deduplicate by output and stop at exactly 500 jobs'
    ],
    counts: {
      jobs: jobs.length,
      baselineMissingItems: missingOutputs.length,
      gearShopMissingCovered: selection.gearShopMissingOutputs.length,
      loreOverrideMissingCovered: selection.loreOverrideMissingOutputs.length,
      promptManifestExtensions: state.extensionPromptItems.length,
      remainingMissingItemsAfterBatch: remainingMissingOutputs.length
    },
    baseline: {
      missingItemOutputs: missingOutputs,
      missingItemOutputsSha256: sha256(JSON.stringify(missingOutputs)),
      gearShopMissingOutputs: selection.gearShopMissingOutputs,
      loreOverrideMissingOutputs: selection.loreOverrideMissingOutputs,
      promptManifestExtensionOutputs: state.extensionPromptItems.map(entry => entry.output)
    },
    catalogExtensions: state.extensionPromptItems.map((entry, index) => ({
      reason: 'Missing LORE_ITEM_OVERRIDES output absent from the main item prompt catalog at batch creation.',
      promptEntry: entry,
      manifestEntry: state.extensionManifestItems[index]
    })),
    jobs
  };
};

const expectedSelectionFromBaseline = (batch, promptItems) => {
  const baselineMissing = new Set(batch.baseline.missingItemOutputs);
  const result = [];
  const seen = new Set();
  const append = output => {
    if (!baselineMissing.has(output) || seen.has(output) || result.length >= BATCH_SIZE) return;
    seen.add(output);
    result.push(output);
  };
  batch.baseline.gearShopMissingOutputs.forEach(append);
  batch.baseline.loreOverrideMissingOutputs.forEach(append);
  promptItems.forEach(entry => append(entry.output));
  return result;
};

export const validateBatchArtifact = async () => {
  const [batch, state] = await Promise.all([
    fs.readFile(batchJsonPath, 'utf8').then(JSON.parse),
    loadCatalogState()
  ]);
  assert([1, CURRENT_PROMPT_POLICY_VERSION].includes(batch.schemaVersion), `Unsupported batch schema ${batch.schemaVersion}`);
  assert(batch.batchId === BATCH_ID, `Unexpected batch ID ${batch.batchId}`);
  assert(batch.kind === 'item', `Unexpected batch kind ${batch.kind}`);
  assert(batch.jobs.length === BATCH_SIZE, `Expected ${BATCH_SIZE} jobs, received ${batch.jobs.length}`);
  assert(batch.counts.jobs === BATCH_SIZE, 'Batch count does not match jobs');
  assert(batch.counts.baselineMissingItems === EXPECTED_BASELINE_MISSING_ITEMS, 'Unexpected baseline missing-item count');
  assert(batch.counts.gearShopMissingCovered === EXPECTED_GEAR_SHOP_MISSING, 'Unexpected Gear Shop coverage count');
  assert(batch.counts.loreOverrideMissingCovered === EXPECTED_LORE_OVERRIDE_MISSING, 'Unexpected lore override coverage count');
  assert(batch.counts.promptManifestExtensions === EXPECTED_CATALOG_EXTENSIONS, 'Unexpected prompt/manifest extension count');
  assert(batch.catalogExtensions.length === EXPECTED_CATALOG_EXTENSIONS, 'Incomplete catalog-extension documentation');
  assert(batch.baseline.promptManifestExtensionOutputs.length === EXPECTED_CATALOG_EXTENSIONS, 'Incomplete catalog-extension output list');
  assert(batch.counts.remainingMissingItemsAfterBatch === EXPECTED_REMAINING_MISSING_ITEMS, 'Unexpected remaining missing-item count');
  assert(batch.baseline.missingItemOutputs.length === EXPECTED_BASELINE_MISSING_ITEMS, 'Incomplete baseline missing-output list');
  assert(batch.baseline.gearShopMissingOutputs.length === EXPECTED_GEAR_SHOP_MISSING, 'Incomplete Gear Shop baseline list');
  assert(batch.baseline.loreOverrideMissingOutputs.length === EXPECTED_LORE_OVERRIDE_MISSING, 'Incomplete lore baseline list');
  assert(
    batch.baseline.missingItemOutputsSha256 === sha256(JSON.stringify(batch.baseline.missingItemOutputs)),
    'Baseline missing-output hash mismatch'
  );

  const expectedExtensions = state.extensionPromptItems.map(entry => entry.output);
  assert(
    JSON.stringify(batch.baseline.promptManifestExtensionOutputs) === JSON.stringify(expectedExtensions),
    'Lore prompt/manifest extension outputs drifted'
  );
  assert(
    JSON.stringify(batch.catalogExtensions.map(extension => extension.promptEntry)) === JSON.stringify(state.extensionPromptItems),
    'Documented lore prompt extensions drifted'
  );
  assert(
    JSON.stringify(batch.catalogExtensions.map(extension => extension.manifestEntry)) === JSON.stringify(state.extensionManifestItems),
    'Documented lore manifest extensions drifted'
  );

  const gearInventory = new Set(collectGearShopOutputs());
  const loreInventory = new Set(collectLoreOverrideOutputs());
  assert(batch.baseline.gearShopMissingOutputs.every(output => gearInventory.has(output)), 'Batch contains a non-Gear-Shop coverage output');
  assert(batch.baseline.loreOverrideMissingOutputs.every(output => loreInventory.has(output)), 'Batch contains a non-lore-override coverage output');

  const expectedOutputs = expectedSelectionFromBaseline(batch, state.promptItems);
  assert(expectedOutputs.length === BATCH_SIZE, 'Frozen baseline cannot produce 500 jobs');
  assert(
    JSON.stringify(batch.jobs.map(job => job.output)) === JSON.stringify(expectedOutputs),
    'Batch order no longer matches Gear Shop, lore override and catalog priority'
  );

  const idSet = new Set();
  const outputSet = new Set();
  const promptFileSet = new Set();
  for (const [index, job] of batch.jobs.entries()) {
    assert(job.sequence === index + 1, `Invalid sequence for ${job.output}`);
    assert(!idSet.has(job.id), `Duplicate batch ID ${job.id}`);
    assert(!outputSet.has(job.output), `Duplicate batch output ${job.output}`);
    assert(!promptFileSet.has(job.promptFile), `Duplicate prompt file ${job.promptFile}`);
    idSet.add(job.id);
    outputSet.add(job.output);
    promptFileSet.add(job.promptFile);

    const promptEntry = state.promptByOutput.get(job.output);
    const manifestEntry = state.manifestByOutput.get(job.output);
    assert(promptEntry, `Catalog prompt missing for ${job.output}`);
    compareCatalogAndManifestEntry(promptEntry, manifestEntry);
    assert(job.id === promptEntry.id, `Job/catalog ID disagreement for ${job.output}`);
    assert(job.catalogSource === (promptEntry.catalogSource || 'openai-sprite-prompts'), `Job/catalog source disagreement for ${job.output}`);
    assert(job.sourcePromptSha256 === sha256(Buffer.from(promptEntry.prompt, 'utf8')), `Source prompt hash mismatch for ${job.output}`);

    const expectedPrompt = buildGenerationPrompt(promptEntry, {
      policyVersion: batch.schemaVersion
    });
    assert(job.generationPrompt === expectedPrompt, `Generation prompt drift for ${job.output}`);
    assert(!/#00ff00/iu.test(job.generationPrompt), `Chroma-key instruction remains in ${job.output}`);
    assert(/genuine transparent alpha/iu.test(job.generationPrompt), `Transparent-alpha lock missing for ${job.output}`);
    assert(/nonsexual and non-gory/iu.test(job.generationPrompt), `Safety lock missing for ${job.output}`);
    assert(/no text/iu.test(job.generationPrompt) && /no franchise logo/iu.test(job.generationPrompt), `Text/logo lock missing for ${job.output}`);
    assert(job.generationPromptSha256 === sha256(Buffer.from(job.generationPrompt, 'utf8')), `Generation prompt hash mismatch for ${job.output}`);

    const promptFilePath = path.resolve(projectRoot, ...job.promptFile.split('/'));
    assert(promptFilePath.startsWith(`${promptDirectory}${path.sep}`), `Prompt path escapes batch directory: ${job.promptFile}`);
    const promptFileContent = await fs.readFile(promptFilePath, 'utf8');
    assert(promptFileContent === job.generationPrompt, `Prompt file is not verbatim for ${job.output}`);
    assert(sha256(Buffer.from(promptFileContent, 'utf8')) === job.generationPromptSha256, `Prompt file hash mismatch for ${job.output}`);
  }

  const files = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  const expectedFiles = batch.jobs.map(job => path.basename(job.promptFile)).sort();
  const undeclaredFiles = files.filter(file => !expectedFiles.includes(file));
  assert(
    undeclaredFiles.every(file => /retry/iu.test(file)),
    `Prompt directory contains undeclared non-retry files: ${undeclaredFiles.join(', ')}`
  );
  assert(
    expectedFiles.every(file => files.includes(file)),
    'Prompt directory must contain every one of the 500 declared files'
  );
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

const retryPromptFileFor = target => path.join(
  retryPromptDirectory,
  `${String(target.sequence).padStart(3, '0')}-${target.id}-retry.txt`
);

export const writeRetryPromptArtifacts = async () => {
  const state = await loadCatalogState();
  await fs.mkdir(retryPromptDirectory, { recursive: true });
  const records = RETRY_PROMPT_TARGETS.map(target => {
    const entry = state.promptItems.find(candidate => candidate.id === target.id);
    assert(entry, `Retry prompt catalog entry missing for ${target.id}`);
    return {
      ...target,
      output: entry.output,
      promptFile: retryPromptFileFor(target),
      prompt: buildGenerationPrompt(entry)
    };
  });
  await Promise.all(records.map(record => fs.writeFile(record.promptFile, record.prompt, 'utf8')));
  return records;
};

export const validateRetryPromptArtifacts = async () => {
  const state = await loadCatalogState();
  const records = await Promise.all(RETRY_PROMPT_TARGETS.map(async target => {
    const entry = state.promptItems.find(candidate => candidate.id === target.id);
    assert(entry, `Retry prompt catalog entry missing for ${target.id}`);
    const promptFile = retryPromptFileFor(target);
    const prompt = await fs.readFile(promptFile, 'utf8');
    const expectedPrompt = buildGenerationPrompt(entry);
    assert(prompt === expectedPrompt, `Retry prompt is not verbatim for ${target.id}`);
    return { ...target, output: entry.output, promptFile, prompt };
  }));
  const files = (await fs.readdir(retryPromptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  const expectedFiles = RETRY_PROMPT_TARGETS.map(target => path.basename(retryPromptFileFor(target))).sort();
  assert(JSON.stringify(files) === JSON.stringify(expectedFiles), 'Retry prompt directory must contain exactly the four declared files');
  return records;
};

const main = async () => {
  if (process.argv.includes('--write-retry-prompts')) {
    await writeRetryPromptArtifacts();
    const records = await validateRetryPromptArtifacts();
    console.log(JSON.stringify({
      status: 'ok',
      mode: 'write-retry-prompts',
      promptPolicyVersion: CURRENT_PROMPT_POLICY_VERSION,
      promptFiles: records.map(record => path.relative(projectRoot, record.promptFile).replaceAll('\\', '/'))
    }, null, 2));
    return;
  }

  if (process.argv.includes('--check')) {
    const batch = await validateBatchArtifact();
    console.log(JSON.stringify({
      status: 'ok',
      mode: 'check',
      batchId: batch.batchId,
      ...batch.counts,
      promptFiles: batch.jobs.length
    }, null, 2));
    return;
  }

  const batch = await createBatch();
  await writeBatchArtifact(batch);
  await validateBatchArtifact();
  console.log(JSON.stringify({
    status: 'ok',
    mode: 'write',
    batchId: batch.batchId,
    ...batch.counts,
    promptFiles: batch.jobs.length,
    batchJson: path.relative(projectRoot, batchJsonPath).replaceAll('\\', '/')
  }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}








