import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const hubSourcePath = path.join(projectRoot, 'src/components/HubScreen.jsx');
const outputPath = path.join(projectRoot, 'docs/rift-dossiers/catalog.json');
const riftDossierLedgerPath = path.join(
  projectRoot,
  'public/images/rift-dossiers/openai/openai-prompts.jsonl'
);
const spriteManifestPath = path.join(projectRoot, 'public/sprites/generated/sprite-manifest.json');
const characterReferenceQualityPath = path.join(
  projectRoot,
  'docs/rift-dossiers/character-reference-quality.json'
);
const wave5SafetyMakeupPath = path.join(
  projectRoot,
  'docs/openai-generation-prompts-2026-08-25/asset-batch-3-wave-5-rift-dossiers-makeup.json'
);
const wave5VisualCorrectionsPath = path.join(
  projectRoot,
  'docs/openai-generation-prompts-2026-08-25/asset-batch-2-wave-5-rift-dossiers-visual-corrections-v1.json'
);
const WAVE_5_SOURCE_BATCH_SHA256 = '3b0e136cbb2c4cedcaf858d89c7471a04a6b3bd0b88b9acc4a72c7ced44b5292';
const WAVE_5_SAFETY_MAKEUP_SHA256 = 'eeb81c4e9dfb65da0ce33ca53b8907ae36439c8de57112e36624d2b3e41d37e3';
const WAVE_5_VISUAL_CORRECTIONS_SHA256 = 'd6d4da80f210567998df3c5c822b8b1caa160de9b5640ec1afaac5193e12091c';
const checkOnly = process.argv.includes('--check');
const refreshCharacterReferenceAudit = process.argv.includes('--refresh-character-reference-audit');
assert.equal(
  checkOnly && refreshCharacterReferenceAudit,
  false,
  '--check and --refresh-character-reference-audit cannot be combined'
);
const researchedReferencePaths = [
  'franchises-a.json',
  'franchises-b.json',
  'franchises-c.json',
  'original-universes.json'
]
  .map(fileName => path.join(projectRoot, 'docs/rift-dossiers/references', fileName));
const subjectReferencePaths = [
  'stage-subjects-static-a.json',
  'stage-subjects-static-b.json',
  'stage-subjects-special.json',
  'stage-subjects-character-core.json',
  'stage-subjects-expanded-172-185.json',
  'stage-subjects-expanded-186-200.json',
  'stage-subjects-expanded-201-215.json',
  'stage-subjects-expanded-216-230.json',
  'stage-subjects-expanded-231-245.json',
  'stage-subjects-expanded-246-275.json',
  'stage-subjects-expanded-276-305.json',
  'stage-subjects-expanded-306-335.json',
  'stage-subjects-expanded-336-365.json',
  'stage-subjects-expanded-high-01.json',
  'stage-subjects-expanded-high-02.json',
  'stage-subjects-expanded-high-03.json',
  'stage-subjects-expanded-high-04.json',
  'stage-subjects-expanded-high-05.json',
  'stage-subjects-expanded-high-06.json'
]
  .map(fileName => path.join(projectRoot, 'docs/rift-dossiers/references', fileName));

const EXPECTED_COUNTS = Object.freeze({
  'campagne-oc': 12,
  expanded: 1175,
  statique: 39,
  fusion: 16,
  'arc-univers': 41,
  'arc-personnage': 1912,
  trio: 4
});

const EXPECTED_TOTAL = Object.values(EXPECTED_COUNTS)
  .reduce((total, count) => total + count, 0);

const CAMERA_BY_MODE = Object.freeze({
  RPG: 'Use a side-view 2.5D RPG camera with a broad central battle lane and layered depth.',
  Tactics: 'Use an elevated three-quarter tactics camera with readable cover, traversal lanes, and a rectangular combat grid.',
  Smash: 'Use a strict side-view platform-combat camera with readable floor edges, traversal gaps, and shallow parallax.'
});

const APPROVED_CHARACTER_REFERENCE_PROMPT_MARKER = 'Approved local character reference supplied:';
const NO_CHARACTER_REFERENCE_PROMPT_MARKER = 'No local character bitmap is supplied.';
const CHARACTER_SEMANTIC_PROMPT_MARKER = 'Available semantic character descriptors from project canon:';

const campaignPromptByMissionId = new Map(
  (existsSync(riftDossierLedgerPath)
    ? readFileSync(riftDossierLedgerPath, 'utf8')
      .split(/\r?\n/u)
      .filter(Boolean)
      .map(line => JSON.parse(line))
    : [])
    .filter(entry => Number.isInteger(entry.missionId) && typeof entry.prompt === 'string')
    .map(entry => [entry.missionId, entry.prompt])
);

const TUTORIAL_90000_PROMPT = [
  'Use case: stylized-concept',
  'Asset type: dedicated 16:9 gameplay thumbnail for an A.R.C.A. rift dossier',
  'Primary request: Create unique key art for stage 90000, “Atrium Anchor Calibration”, an original Nexus de Convergence RPG tutorial. Show a newly awakened Anchor calibrating a circular causal console in the central Atrium of the Mosaic City while the pale boss “Echo of the White Margin” forms beyond a controlled cyan rift. The scene must clearly read as a supervised first directive, not the later Name Lock operation.',
  'Input image: style reference only; do not copy its composition or objects.',
  'Scene/backdrop: vast original mosaic archive-city atrium, safe training perimeter, inactive civilian galleries, one calibration console, thin white fracture at the far end.',
  'Style/medium: premium hand-crafted 32-bit era pixel-art game key art, crisp intentional pixels, dense environmental storytelling, original fan-made universe aesthetic.',
  'Composition/framing: cinematic wide landscape, strong central depth, readable at small thumbnail size, console and trainee in foreground, boss silhouette and rift in background, no decorative frame.',
  'Lighting/mood: controlled cyan and warm amber instrumentation against a threatening white glow; cautious initiation.',
  'Constraints: entirely original imagery; no text, no letters, no UI, no logos, no watermark; no photorealism; no duplicated triptych composition from the reference.'
].join('\n');

const decodeSingleQuotedSourceString = value => (
  value.replace(/\\(['\\])/g, '$1')
);

const normalizeLocalizedName = value => {
  if (typeof value === 'string') {
    return { fr: value, en: value };
  }

  const fr = String(value?.fr || value?.en || '').trim();
  const en = String(value?.en || value?.fr || '').trim();
  assert.ok(fr && en, 'Every dossier must have a French and English name');
  return { fr, en };
};

const getLocalizedText = (value, language, fallback = '') => {
  if (typeof value === 'string') return value;
  return String(value?.[language] || value?.en || value?.fr || fallback).trim();
};

const uniqueStrings = values => (
  [...new Set(values.filter(Boolean).map(value => String(value).trim()).filter(Boolean))]
);

const sha256 = value => createHash('sha256').update(value).digest('hex');

const loadWave5SafetyPromptOverrides = () => {
  if (!existsSync(wave5SafetyMakeupPath)) return new Map();
  const bytes = readFileSync(wave5SafetyMakeupPath);
  assert.equal(
    sha256(bytes),
    WAVE_5_SAFETY_MAKEUP_SHA256,
    'Wave 5 safety makeup artifact SHA drifted'
  );
  const document = JSON.parse(bytes.toString('utf8'));
  assert.equal(document.schemaVersion, 1, 'Wave 5 safety makeup schemaVersion drifted');
  assert.equal(
    document.source?.batchSha256,
    WAVE_5_SOURCE_BATCH_SHA256,
    'Wave 5 safety makeup source batch SHA drifted'
  );
  assert.equal(document.jobs?.length, 3, 'Wave 5 safety makeup must contain exactly three jobs');
  const overrides = new Map();
  for (const job of document.jobs) {
    const id = Number(job.id);
    assert.ok(Number.isInteger(id), 'Wave 5 safety makeup stage id must be an integer');
    assert.equal(job.kind, 'stage', `Wave 5 safety makeup ${id} must use kind=stage`);
    assert.equal(
      job.safetyPolicy,
      'environment-only-no-characters',
      `Wave 5 safety makeup ${id} has an unsupported policy`
    );
    assert.ok(!overrides.has(id), `Duplicate Wave 5 safety makeup stage ${id}`);
    assert.equal(
      sha256(Buffer.from(job.generationPrompt, 'utf8')),
      job.generationPromptSha256,
      `Wave 5 safety makeup ${id} prompt hash mismatch`
    );
    const promptFile = path.resolve(projectRoot, job.promptFile);
    assert.equal(
      readFileSync(promptFile, 'utf8'),
      job.generationPrompt,
      `Wave 5 safety makeup ${id} prompt file drifted`
    );
    overrides.set(id, job);
  }
  return overrides;
};

const wave5SafetyPromptOverrides = loadWave5SafetyPromptOverrides();

const applyWave5SafetyPromptOverrides = entries => {
  if (wave5SafetyPromptOverrides.size === 0) return;
  const entryById = new Map(entries.map(entry => [entry.id, entry]));
  for (const [id, override] of wave5SafetyPromptOverrides) {
    const entry = entryById.get(id);
    assert.ok(entry, `Wave 5 safety makeup stage ${id} is absent from the dossier catalog`);
    assert.equal(entry.famille, 'expanded', `Wave 5 safety makeup ${id} must remain expanded`);
    assert.equal(entry.cheminCibleDedie, override.output, `Wave 5 safety makeup ${id} output drifted`);
    assert.equal(
      sha256(Buffer.from(entry.promptOpenAI, 'utf8')),
      override.replacedPromptSha256,
      `Wave 5 safety makeup ${id} no longer replaces its audited source prompt`
    );
    entry.promptOpenAI = override.generationPrompt;
    entry.promptSafetyOverride = {
      policy: override.safetyPolicy,
      sourceBatchSha256: WAVE_5_SOURCE_BATCH_SHA256,
      replacementOfSequence: override.replacementOfSequence,
      replacedPromptSha256: override.replacedPromptSha256
    };
  }
};

const loadWave5VisualPromptOverrides = () => {
  if (!existsSync(wave5VisualCorrectionsPath)) {
    return { batchId: null, overrides: new Map() };
  }
  const bytes = readFileSync(wave5VisualCorrectionsPath);
  assert.equal(
    sha256(bytes),
    WAVE_5_VISUAL_CORRECTIONS_SHA256,
    'Wave 5 visual correction artifact SHA drifted'
  );
  const document = JSON.parse(bytes.toString('utf8'));
  assert.equal(document.schemaVersion, 1, 'Wave 5 visual correction schemaVersion drifted');
  assert.equal(document.correctionVersion, 1, 'Wave 5 visual correction version drifted');
  assert.equal(
    document.batchId,
    'assets-rift-dossier-wave-5-visual-corrections-v1-2026-08-30',
    'Wave 5 visual correction batchId drifted'
  );
  assert.equal(document.kind, 'stage', 'Wave 5 visual correction must use kind=stage');
  assert.equal(
    document.sources?.wave5Primary?.sha256,
    WAVE_5_SOURCE_BATCH_SHA256,
    'Wave 5 visual correction primary source SHA drifted'
  );
  assert.equal(
    document.sources?.wave5SafetyMakeup?.sha256,
    WAVE_5_SAFETY_MAKEUP_SHA256,
    'Wave 5 visual correction safety source SHA drifted'
  );
  assert.deepEqual(
    document.overlayOrder,
    ['wave-5-primary', 'wave-5-safety-makeup', 'wave-5-visual-corrections-v1'],
    'Wave 5 visual correction overlay order drifted'
  );
  assert.equal(document.jobs?.length, 2, 'Wave 5 visual correction must contain two jobs');

  const expected = new Map([
    [33841, {
      sequence: 1,
      sourceLayer: 'wave-5-safety-makeup',
      replacedPromptSha256: 'b218078d2d68f1849d5fad8b6920d6ad3bb5fcce5eec47df940f78495c2c44f5',
      generationPromptSha256: '8def69a4a17130dc65bdea5e987adb2dd110b8a29019993912430a1983544983',
      visualAuditIssue: 'baked-tactics-grid-conflicts-with-runtime-grid'
    }],
    [34420, {
      sequence: 2,
      sourceLayer: 'wave-5-primary',
      replacedPromptSha256: 'f726439622007b9e41ce14875e44d4234fd507f87f0ad78188ee19182de31cab',
      generationPromptSha256: 'e32ecd502994b20f37844940c56aa23ce00e6a2ecbdfa54478e0ff0d0713b0eb',
      visualAuditIssue: 'perspective-corridor-conflicts-with-rpg-side-view'
    }]
  ]);
  const overrides = new Map();
  for (const job of document.jobs) {
    const id = Number(job.id);
    const contract = expected.get(id);
    assert.ok(contract, `Unexpected Wave 5 visual correction stage ${job.id}`);
    assert.equal(job.sequence, contract.sequence, `Wave 5 visual correction sequence drifted for ${id}`);
    assert.equal(job.correctionVersion, 1, `Wave 5 visual correction version drifted for ${id}`);
    assert.equal(job.kind, 'stage', `Wave 5 visual correction ${id} must use kind=stage`);
    assert.equal(job.family, 'expanded', `Wave 5 visual correction ${id} must remain expanded`);
    assert.equal(job.replace, true, `Wave 5 visual correction ${id} must replace its asset`);
    assert.equal(job.sourceLayer, contract.sourceLayer, `Wave 5 visual correction source layer drifted for ${id}`);
    assert.equal(
      job.replacedPromptSha256,
      contract.replacedPromptSha256,
      `Wave 5 visual correction replaced prompt drifted for ${id}`
    );
    assert.equal(
      job.generationPromptSha256,
      contract.generationPromptSha256,
      `Wave 5 visual correction prompt SHA drifted for ${id}`
    );
    assert.equal(job.sourcePromptSha256, job.generationPromptSha256, `Wave 5 visual correction catalog SHA drifted for ${id}`);
    assert.equal(job.visualAuditIssue, contract.visualAuditIssue, `Wave 5 visual audit issue drifted for ${id}`);
    assert.ok(!overrides.has(id), `Duplicate Wave 5 visual correction stage ${id}`);
    assert.equal(
      sha256(Buffer.from(job.generationPrompt, 'utf8')),
      job.generationPromptSha256,
      `Wave 5 visual correction prompt hash mismatch for ${id}`
    );
    const promptFile = path.resolve(projectRoot, job.promptFile);
    const promptDirectory = path.join(
      path.dirname(wave5VisualCorrectionsPath),
      path.basename(wave5VisualCorrectionsPath, '.json')
    );
    const promptRelativePath = path.relative(promptDirectory, promptFile);
    assert.ok(
      promptRelativePath
        && !promptRelativePath.startsWith(`..${path.sep}`)
        && promptRelativePath !== '..'
        && !path.isAbsolute(promptRelativePath),
      `Wave 5 visual correction prompt escapes its artifact directory for ${id}`
    );
    assert.equal(
      readFileSync(promptFile, 'utf8'),
      job.generationPrompt,
      `Wave 5 visual correction prompt file drifted for ${id}`
    );
    assert.equal(job.successfulGeneration?.provider, 'OpenAI', `Wave 5 visual correction provider drifted for ${id}`);
    assert.equal(
      job.successfulGeneration?.interface,
      'built-in image_gen',
      `Wave 5 visual correction interface drifted for ${id}`
    );
    assert.match(
      job.successfulGeneration?.generationId || '',
      /^exec-[A-Za-z0-9-]+$/u,
      `Wave 5 visual correction generationId drifted for ${id}`
    );
    assert.equal(job.successfulGeneration?.sourceImage?.format, 'PNG', `Wave 5 visual correction source format drifted for ${id}`);
    assert.equal(job.successfulGeneration?.sourceImage?.width, 1672, `Wave 5 visual correction source width drifted for ${id}`);
    assert.equal(job.successfulGeneration?.sourceImage?.height, 941, `Wave 5 visual correction source height drifted for ${id}`);
    assert.match(
      job.successfulGeneration?.sourceImage?.sha256 || '',
      /^[a-f0-9]{64}$/u,
      `Wave 5 visual correction source SHA drifted for ${id}`
    );
    assert.equal(job.attemptAudit?.maximumImageGenCalls, 2, `Wave 5 visual correction call budget drifted for ${id}`);
    assert.ok(
      Number.isInteger(job.attemptAudit?.usedImageGenCalls)
        && job.attemptAudit.usedImageGenCalls >= 1
        && job.attemptAudit.usedImageGenCalls <= job.attemptAudit.maximumImageGenCalls,
      `Wave 5 visual correction used call count drifted for ${id}`
    );
    overrides.set(id, job);
  }
  assert.deepEqual([...overrides.keys()], [...expected.keys()], 'Wave 5 visual correction identity set drifted');
  return { batchId: document.batchId, overrides };
};

const wave5VisualPromptOverrides = loadWave5VisualPromptOverrides();

const applyWave5VisualPromptOverrides = entries => {
  if (!wave5VisualPromptOverrides.overrides?.size) return;
  const entryById = new Map(entries.map(entry => [entry.id, entry]));
  for (const [id, override] of wave5VisualPromptOverrides.overrides) {
    const entry = entryById.get(id);
    assert.ok(entry, `Wave 5 visual correction stage ${id} is absent from the dossier catalog`);
    assert.equal(entry.famille, 'expanded', `Wave 5 visual correction ${id} must remain expanded`);
    assert.equal(entry.cheminCibleDedie, override.output, `Wave 5 visual correction ${id} output drifted`);
    assert.equal(
      sha256(Buffer.from(entry.promptOpenAI, 'utf8')),
      override.replacedPromptSha256,
      `Wave 5 visual correction ${id} no longer replaces the active layered prompt`
    );
    entry.promptOpenAI = override.generationPrompt;
    entry.promptVisualCorrection = {
      version: override.correctionVersion,
      batchId: wave5VisualPromptOverrides.batchId,
      batchSha256: WAVE_5_VISUAL_CORRECTIONS_SHA256,
      sourceLayer: override.sourceLayer,
      replacementOfSequence: override.replacementOfSequence,
      visualAuditIssue: override.visualAuditIssue,
      correctionReason: override.correctionReason,
      replacedPromptSha256: override.replacedPromptSha256,
      generationPromptSha256: override.generationPromptSha256,
      generationId: override.successfulGeneration.generationId,
      sourceImageSha256: override.successfulGeneration.sourceImage.sha256
    };
  }
};

const normalizePublicAssetPath = value => {
  const normalized = String(value || '').trim().replaceAll('\\', '/');
  return normalized ? `/${normalized.replace(/^\/+/, '')}` : '';
};

const flattenVisualAnchor = (value, label = null) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap(item => flattenVisualAnchor(item, label));
  }
  if (typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => flattenVisualAnchor(item, key));
  }
  const text = String(value).trim();
  return text ? [`${label ? `${label}: ` : ''}${text}`] : [];
};

const slugify = value => (
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
);

const buildTargetPath = ({ id, famille, nom, existingPath }) => {
  if (existingPath) return existingPath;

  const titleSlug = slugify(nom.en).slice(0, 96).replace(/-+$/g, '') || 'dossier';
  return `/images/rift-dossiers/openai/${famille}/stage-${id}-${titleSlug}-v1.webp`;
};

const buildOpenAiPrompt = ({
  nom,
  univers,
  mode,
  boss,
  nonCombatPolicy = null,
  nonCombatObjective = null,
  visualAnchors = [],
  bossVisualAnchor = null,
  characterName = null,
  characterDescriptors = [],
  hasApprovedCharacterReference = false,
  referencePolicy = 'authoritative-public'
}) => {
  const localizedTitle = nom.fr === nom.en
    ? `"${nom.en}"`
    : `"${nom.en}" (dossier FR: "${nom.fr}")`;
  const camera = CAMERA_BY_MODE[mode]
    || 'Use a gameplay-readable 16:9 arena camera appropriate to the named mode.';

  const promptParts = [
    'OpenAI image request: create one original 32-bit pixel-art rift-dossier thumbnail for the fan-made game Multiverse Breach.',
    `Operation: ${localizedTitle}.`,
    `Canonical Thread or universe: ${univers.join(' + ')}.`,
    `Gameplay mode: ${mode}.`
  ];
  if (nonCombatPolicy) {
    promptParts.push(
      'Final encounter: non-combat finale; no boss or hostile subject.',
      `Interactive objective: ${nonCombatObjective}.`
    );
  } else {
    promptParts.push(`Final threat or boss: ${boss}.`);
  }
  if (characterName) {
    promptParts.push(`Character focus: ${characterName}.`);
    if (hasApprovedCharacterReference) {
      promptParts.push(
        `${APPROVED_CHARACTER_REFERENCE_PROMPT_MARKER} use the approved project sprite for character identity and costume cues only; do not treat it as authority for the scene, anatomy, pose, lighting, or environment.`,
        'Never copy the supplied sprite-sheet layout, repeated poses, transparent or black background, pixel placement, or framing.'
      );
    } else {
      promptParts.push(
        NO_CHARACTER_REFERENCE_PROMPT_MARKER,
        'Do not imply or invent an input image; establish character fidelity from the named canonical identity, the verified universe anchors, and the semantic descriptors below.'
      );
    }
    promptParts.push(
      `${CHARACTER_SEMANTIC_PROMPT_MARKER} ${characterDescriptors.join(' | ')}.`
    );
  }
  if (visualAnchors.length > 0) {
    promptParts.push(
      referencePolicy === 'project-runtime-lore'
        ? `Project-runtime lore anchors (not independently researched): ${visualAnchors.join(' | ')}.`
        : `Verified visual anchors researched before generation: ${visualAnchors.join(' | ')}.`
    );
  }
  if (bossVisualAnchor) {
    promptParts.push(
      `Verified boss or specific subject fidelity: ${bossVisualAnchor}.`
    );
  }
  promptParts.push(
    'Build a unique scene around recognizable environmental motifs and the threat defining silhouette, preserving canonical visual logic through an original fan-art composition instead of copying official key art.',
    camera,
    'Keep the foreground, middle ground, breach light, and combat space immediately readable at miniature size.',
    'No readable text, logos, watermark, baked UI, decorative frame, copied poster composition, photorealism, or real-person likeness.',
    'Landscape 16:9; the generated source will be installed as an optimized 640x360 RGB WebP thumbnail.'
  );
  return promptParts.join(' ');
};

const makeEntry = ({
  id,
  famille,
  nom,
  univers,
  mode,
  boss,
  nonCombatPolicy = null,
  nonCombatObjective = null,
  existingPath = null,
  promptOverride = null,
  visualAnchors = [],
  referenceUrls = [],
  bossVisualAnchor = null,
  bossReferenceUrls = [],
  localReferencePaths = [],
  localReferenceCandidatePaths = [],
  characterName = null,
  characterDescriptors = [],
  referencePolicy = 'authoritative-public'
}) => {
  const normalizedName = normalizeLocalizedName(nom);
  const normalizedUniverses = uniqueStrings(
    univers.flatMap(universe => (Array.isArray(universe) ? universe : [universe]))
  );
  const normalizedBoss = String(boss || '').trim();
  const normalizedNonCombatObjective = getLocalizedText(nonCombatObjective, 'en');
  const normalizedMode = String(mode || '').trim();
  const normalizedVisualAnchors = uniqueStrings(visualAnchors);
  const normalizedBossVisualAnchor = String(bossVisualAnchor || '').trim() || null;
  const normalizedBossReferenceUrls = uniqueStrings(bossReferenceUrls);
  const normalizedReferenceUrls = uniqueStrings([
    ...referenceUrls,
    ...normalizedBossReferenceUrls
  ]);
  const normalizedLocalReferencePaths = uniqueStrings(
    localReferencePaths.map(normalizePublicAssetPath)
  );
  const normalizedLocalReferenceCandidatePaths = uniqueStrings(
    localReferenceCandidatePaths.map(normalizePublicAssetPath)
  );
  const normalizedCharacterDescriptors = uniqueStrings(characterDescriptors);
  assert.ok(
    ['authoritative-public', 'project-runtime-lore'].includes(referencePolicy),
    `${famille}:${id}: unsupported reference policy ${referencePolicy}`
  );

  assert.ok(Number.isInteger(id), `${famille}: dossier id must be an integer`);
  assert.ok(normalizedUniverses.length > 0, `${famille}:${id}: missing universe`);
  assert.ok(normalizedMode, `${famille}:${id}: missing mode`);
  if (nonCombatPolicy) {
    assert.ok(
      normalizedNonCombatObjective,
      `${famille}:${id}: non-combat finale is missing its objective`
    );
  } else {
    assert.ok(normalizedBoss, `${famille}:${id}: missing boss`);
  }

  const promptInput = {
    nom: normalizedName,
    univers: normalizedUniverses,
    mode: normalizedMode,
    boss: normalizedBoss,
    nonCombatPolicy,
    nonCombatObjective: normalizedNonCombatObjective,
    visualAnchors: normalizedVisualAnchors,
    bossVisualAnchor: normalizedBossVisualAnchor,
    characterName,
    characterDescriptors: normalizedCharacterDescriptors,
    hasApprovedCharacterReference: normalizedLocalReferencePaths.length > 0,
    referencePolicy
  };

  return {
    id,
    famille,
    nom: normalizedName,
    univers: normalizedUniverses,
    mode: normalizedMode,
    ...(nonCombatPolicy
      ? {
          boss: null,
          finalePolicy: nonCombatPolicy,
          objectifFinale: normalizeLocalizedName(nonCombatObjective)
        }
      : { boss: normalizedBoss }),
    personnage: characterName || null,
    ancragesVisuels: normalizedVisualAnchors,
    referenceUrls: normalizedReferenceUrls,
    bossVisualAnchor: normalizedBossVisualAnchor,
    bossReferenceUrls: normalizedBossReferenceUrls,
    politiqueReferences: referencePolicy,
    referencesLocalesOpenAI: normalizedLocalReferencePaths,
    ...(famille === 'arc-personnage'
      ? { candidatsReferencesLocalesAudit: normalizedLocalReferenceCandidatePaths }
      : {}),
    cheminCibleDedie: buildTargetPath({
      id,
      famille,
      nom: normalizedName,
      existingPath
    }),
    promptOpenAI: promptOverride || buildOpenAiPrompt(promptInput)
  };
};

const readStaticStages = () => {
  const hubSource = readFileSync(hubSourcePath, 'utf8');
  const registryStart = hubSource.indexOf('const STAGES = [');
  const registryEnd = hubSource.indexOf('];', registryStart);

  assert.ok(registryStart >= 0 && registryEnd > registryStart, 'Unable to locate the static STAGES registry');

  const registrySource = hubSource.slice(registryStart, registryEnd + 2);
  const stagePattern = /\{\s*id:\s*(\d+),\s*name:\s*'((?:\\.|[^'\\])*)',\s*universe:\s*'((?:\\.|[^'\\])*)',\s*mode:\s*'((?:\\.|[^'\\])*)',[^\r\n]*?bossName:\s*'((?:\\.|[^'\\])*)'/g;
  const stages = [];

  for (const match of registrySource.matchAll(stagePattern)) {
    const id = Number(match[1]);
    if (id < 1 || id > 38) continue;

    stages.push({
      id,
      name: decodeSingleQuotedSourceString(match[2]),
      universe: decodeSingleQuotedSourceString(match[3]),
      mode: decodeSingleQuotedSourceString(match[4]),
      bossName: decodeSingleQuotedSourceString(match[5])
    });
  }

  const tutorialMatch = registrySource.match(
    /\{\s*id:\s*90000,\s*name:\s*'((?:\\.|[^'\\])*)',[\s\S]*?universe:\s*'((?:\\.|[^'\\])*)',\s*mode:\s*'((?:\\.|[^'\\])*)',[\s\S]*?bossName:\s*'((?:\\.|[^'\\])*)'/
  );
  assert.ok(tutorialMatch, 'Static tutorial stage 90000 is missing');
  stages.push({
    id: 90000,
    name: decodeSingleQuotedSourceString(tutorialMatch[1]),
    universe: decodeSingleQuotedSourceString(tutorialMatch[2]),
    mode: decodeSingleQuotedSourceString(tutorialMatch[3]),
    bossName: decodeSingleQuotedSourceString(tutorialMatch[4])
  });

  stages.sort((left, right) => left.id - right.id);
  assert.equal(stages.length, EXPECTED_COUNTS.statique, 'Static stage count drifted');
  assert.deepEqual(
    stages.map(stage => stage.id),
    [...Array.from({ length: 38 }, (_, index) => index + 1), 90000],
    'Static stages must cover IDs 1 through 38 and tutorial 90000 exactly once'
  );

  return stages;
};

const loadExportedData = async () => {
  const vite = await createServer({
    root: projectRoot,
    configFile: false,
    cacheDir: path.join(os.tmpdir(), 'multiverse-breach-rift-catalog-vite'),
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });

  try {
    const [
      campaignModule,
      expandedModule,
      narrativeModule,
      heroesModule,
      stageLoreModule,
      spriteAssetsModule
    ] = await Promise.all([
      vite.ssrLoadModule('/src/game/ocCampaign.js?rift-dossier-catalog'),
      vite.ssrLoadModule('/src/game/expandedUniverses.js?rift-dossier-catalog'),
      vite.ssrLoadModule('/src/game/narrativeSystems.js?rift-dossier-catalog'),
      vite.ssrLoadModule('/src/game/heroes.js?rift-dossier-catalog'),
      vite.ssrLoadModule('/src/game/stageLoreProfiles.js?rift-dossier-catalog'),
      vite.ssrLoadModule('/src/game/spriteAssets.js?rift-dossier-catalog')
    ]);

    return {
      campaignMissions: campaignModule.OC_CAMPAIGN_MISSIONS,
      expandedStages: expandedModule.getExpandedStages(),
      expandedUniverseSignatures: expandedModule.EXPANDED_UNIVERSE_SIGNATURES,
      getResolvedLoreWorldBossPolicy: expandedModule.getResolvedLoreWorldBossPolicy,
      fusionMissions: narrativeModule.FUSION_MISSIONS,
      universeArcs: narrativeModule.UNIVERSE_NARRATIVE_ARCS,
      characterArcs: narrativeModule.CHARACTER_NARRATIVE_ARCS,
      trioArcs: narrativeModule.TRIO_NARRATIVE_ARCS,
      heroes: heroesModule.HEROES_DB,
      stageLoreProfiles: stageLoreModule.STAGE_LORE_PROFILES,
      getStageLoreProfile: stageLoreModule.getStageLoreProfile,
      getHeroSpriteSheetSrc: spriteAssetsModule.getHeroSpriteSheetSrc
    };
  } finally {
    await vite.close();
  }
};

const loadResearchedReferences = () => {
  const references = [];
  for (const referencePath of researchedReferencePaths) {
    if (!existsSync(referencePath)) continue;
    const document = JSON.parse(readFileSync(referencePath, 'utf8'));
    const entries = Array.isArray(document) ? document : document.entries;
    assert.ok(Array.isArray(entries), `${referencePath}: expected an array or entries array`);
    references.push(...entries);
  }
  return references;
};

const loadSubjectReferences = () => {
  const references = [];
  const seenKeys = new Set();
  for (const referencePath of subjectReferencePaths) {
    if (!existsSync(referencePath)) continue;
    const document = JSON.parse(readFileSync(referencePath, 'utf8'));
    const entries = Array.isArray(document) ? document : document.entries;
    assert.ok(Array.isArray(entries), `${referencePath}: expected an array or entries array`);
    for (const reference of entries) {
      const key = `${reference.family}:${reference.id}`;
      assert.ok(!seenKeys.has(key), `${referencePath}: duplicate subject reference ${key}`);
      seenKeys.add(key);
      references.push(reference);
    }
  }
  return references;
};

const loadCharacterReferenceQuality = ({ allowStale = false } = {}) => {
  assert.equal(
    existsSync(characterReferenceQualityPath),
    true,
    `Missing character-reference quality report ${characterReferenceQualityPath}`
  );
  const report = JSON.parse(readFileSync(characterReferenceQualityPath, 'utf8'));
  assert.equal(report.schemaVersion, 1, 'Unsupported character-reference quality schema');
  assert.equal(
    report.kind,
    'rift-dossier-character-reference-quality-audit',
    'Unexpected character-reference quality report kind'
  );
  if (!allowStale) {
    assert.equal(
      report.summary?.characterArcEntryCount,
      EXPECTED_COUNTS['arc-personnage'],
      'Character-reference report entry count drifted'
    );
  }
  assert.ok(Array.isArray(report.referenceFiles), 'Character-reference report omits referenceFiles');
  assert.ok(Array.isArray(report.entries), 'Character-reference report omits entries');

  const classificationByPath = new Map();
  for (const reference of report.referenceFiles) {
    const referencePath = normalizePublicAssetPath(reference.path);
    assert.ok(referencePath, 'Character-reference report contains an empty path');
    assert.equal(
      classificationByPath.has(referencePath),
      false,
      `Duplicate character-reference quality path ${referencePath}`
    );
    assert.ok(
      ['approved', 'rejected-placeholder', 'needs-review'].includes(reference.classification),
      `${referencePath}: unsupported character-reference classification ${reference.classification}`
    );
    classificationByPath.set(referencePath, reference.classification);
  }

  const entryById = new Map();
  for (const entry of report.entries) {
    assert.equal(
      entryById.has(entry.id),
      false,
      `Duplicate character-reference report entry ${entry.id}`
    );
    entryById.set(entry.id, entry);
  }

  return { report, classificationByPath, entryById };
};

const buildCharacterDescriptors = ({ hero, arc, heroUniverse }) => {
  const signatureTechniques = uniqueStrings([
    hero?.simple?.name,
    hero?.secondary?.name,
    hero?.defense?.name,
    hero?.special?.name
  ]);
  return uniqueStrings([
    `named identity: ${hero?.name || arc.title?.en || arc.heroId}`,
    `canonical home universe: ${heroUniverse}`,
    hero?.category ? `combat role or archetype: ${hero.category}` : null,
    hero?.weaponType ? `signature equipment archetype: ${hero.weaponType}` : null,
    hero?.primaryColor ? `project primary palette cue: ${hero.primaryColor}` : null,
    hero?.secondaryColor ? `project secondary palette cue: ${hero.secondaryColor}` : null,
    signatureTechniques.length > 0
      ? `signature techniques or posture cues: ${signatureTechniques.join(', ')}`
      : null
  ]);
};

const buildCatalog = async () => {
  const source = await loadExportedData();
  const staticStages = readStaticStages();
  const heroById = new Map(source.heroes.map(hero => [hero.id, hero]));
  const spriteManifest = JSON.parse(readFileSync(spriteManifestPath, 'utf8'));
  const heroSpriteById = new Map(
    (spriteManifest.entries || [])
      .filter(entry => entry.kind === 'hero' && entry.available && entry.id && entry.output)
      .map(entry => [entry.id, entry.output])
  );
  const researchedReferenceByUniverse = new Map(
    loadResearchedReferences().map(reference => [reference.universe, reference])
  );
  const subjectReferenceByDossier = new Map(
    loadSubjectReferences().map(reference => [
      `${reference.family}:${reference.id}`,
      reference
    ])
  );
  const characterReferenceQuality = loadCharacterReferenceQuality({
    allowStale: refreshCharacterReferenceAudit
  });
  const profileByUniverse = new Map(
    Object.values(source.stageLoreProfiles).map(profile => [profile.key, profile])
  );

  const getVisualReferences = ({
    universes,
    explicitReferences = [],
    includeUniverseReferences = true
  }) => {
    const normalizedUniverses = uniqueStrings(
      universes.flatMap(universe => (Array.isArray(universe) ? universe : [universe]))
    );
    const compatibleExplicitReferences = explicitReferences
      .filter(Boolean)
      .filter(reference => {
        const referenceUniverses = uniqueStrings(
          [reference.universe, reference.universes]
            .filter(Boolean)
            .flatMap(universe => (Array.isArray(universe) ? universe : [universe]))
        );
        return referenceUniverses.length === 0
          || referenceUniverses.some(universe => normalizedUniverses.includes(universe));
      });
    const references = [
      ...compatibleExplicitReferences,
      ...(includeUniverseReferences
        ? normalizedUniverses.flatMap(universe => [
            profileByUniverse.get(universe),
            researchedReferenceByUniverse.get(universe)
          ].filter(Boolean))
        : [])
    ];
    return {
      visualAnchors: uniqueStrings(references.flatMap(reference => [
        ...flattenVisualAnchor(reference.canonicalName),
        ...flattenVisualAnchor(reference.canonicalLocationOrMotif),
        ...flattenVisualAnchor(reference.visualAnchor)
      ])),
      referenceUrls: uniqueStrings(
        references.flatMap(reference => reference.referenceUrls || [])
      )
    };
  };

  const entriesByFamily = {
    'campagne-oc': source.campaignMissions
      .map(stage => {
        const campaignPromptOverride = campaignPromptByMissionId.get(stage.id);
        assert.ok(
          campaignPromptOverride,
          `Campaign mission ${stage.id} is missing its authoritative OpenAI prompt`
        );
        const visualReferences = getVisualReferences({
          universes: [stage.universe],
          explicitReferences: [{
            canonicalName: getLocalizedText(stage.location, 'en', stage.name),
            visualAnchor: getLocalizedText(stage.objective, 'en', stage.name),
            referenceUrls: []
          }]
        });
        return makeEntry({
          id: stage.id,
          famille: 'campagne-oc',
          nom: stage.displayName || stage.name,
          univers: [stage.universe],
          mode: stage.mode,
          boss: stage.bossName,
          existingPath: stage.dossierArt,
          promptOverride: campaignPromptOverride,
          ...visualReferences
        });
      })
      .sort((left, right) => left.id - right.id),

    expanded: source.expandedStages
      .map(stage => {
        const internalSetting = stage.setting || stage.production?.setting;
        const universeSignature = source.expandedUniverseSignatures[stage.universe];
        const finalePolicy = stage.finalePolicy
          || source.getResolvedLoreWorldBossPolicy(stage.universe)
          || universeSignature?.worldBossPolicy
          || null;
        const nonCombatPolicy = ['nonCombatFinal', 'stageSetpiece'].includes(finalePolicy?.policy)
          ? finalePolicy.policy
          : null;
        const bossName = nonCombatPolicy
          ? null
          : stage.bossName || universeSignature?.bossName || universeSignature?.worldBoss;
        const subjectReference = subjectReferenceByDossier.get(`expanded:${stage.id}`);
        const visualReferences = getVisualReferences({
          universes: [stage.universe],
          explicitReferences: [
            stage.stageLore,
            internalSetting
              ? {
                  canonicalName: getLocalizedText(internalSetting, 'en', stage.name),
                  visualAnchor: getLocalizedText(internalSetting, 'fr', stage.name),
                  referenceUrls: []
                }
              : null
          ]
        });
        const subjectVisualAnchors = Array.isArray(subjectReference?.visualAnchors)
          && subjectReference.visualAnchors.length > 0
          ? subjectReference.visualAnchors
          : visualReferences.visualAnchors;
        const referencePolicy = visualReferences.referenceUrls.length > 0
          || (subjectReference?.bossReferenceUrls || []).length > 0
          ? 'authoritative-public'
          : 'project-runtime-lore';
        const resolvedVisualAnchors = subjectVisualAnchors.length > 0
          ? subjectVisualAnchors
          : uniqueStrings([
              stage.name,
              universeSignature?.stageName,
              universeSignature?.theme,
              universeSignature?.worldBoss,
              ...(universeSignature?.monsters || []),
              ...(universeSignature?.bosses || [])
            ]);
        return makeEntry({
          id: stage.id,
          famille: 'expanded',
          nom: stage.displayName || stage.name,
          univers: [stage.universe],
          mode: stage.mode,
          boss: bossName,
          nonCombatPolicy,
          nonCombatObjective: finalePolicy?.objective,
          existingPath: stage.stageArt,
          bossVisualAnchor: subjectReference?.bossVisualAnchor,
          bossReferenceUrls: subjectReference?.bossReferenceUrls,
          visualAnchors: resolvedVisualAnchors,
          referenceUrls: visualReferences.referenceUrls,
          referencePolicy
        });
      })
      .sort((left, right) => left.id - right.id),

    statique: staticStages
      .map(stage => {
        const visualReferences = getVisualReferences({ universes: [stage.universe] });
        const subjectReference = subjectReferenceByDossier.get(`statique:${stage.id}`);
        return makeEntry({
          id: stage.id,
          famille: 'statique',
          nom: stage.name,
          univers: [stage.universe],
          mode: stage.mode,
          boss: stage.bossName,
          promptOverride: stage.id === 90000 ? TUTORIAL_90000_PROMPT : null,
          bossVisualAnchor: subjectReference?.bossVisualAnchor,
          bossReferenceUrls: subjectReference?.bossReferenceUrls,
          ...visualReferences
        });
      }),

    fusion: source.fusionMissions
      .map(mission => {
        const universes = mission.universes || [mission.primaryUniverse];
        const subjectReference = subjectReferenceByDossier.get(`fusion:${mission.stageId}`);
        const visualReferences = getVisualReferences({
          universes,
          explicitReferences: [source.getStageLoreProfile(mission.stageId)]
        });
        return makeEntry({
          id: mission.stageId,
          famille: 'fusion',
          nom: mission.title,
          univers: universes,
          mode: mission.mode,
          boss: mission.bossName,
          bossVisualAnchor: subjectReference?.bossVisualAnchor,
          bossReferenceUrls: subjectReference?.bossReferenceUrls,
          ...visualReferences
        });
      })
      .sort((left, right) => left.id - right.id),

    'arc-univers': source.universeArcs
      .map((arc, index) => {
        const id = 40000 + index;
        const stageProfile = source.getStageLoreProfile(id);
        const subjectReference = subjectReferenceByDossier.get(`arc-univers:${id}`);
        const visualReferences = getVisualReferences({
          universes: arc.universes,
          explicitReferences: [stageProfile],
          includeUniverseReferences: !stageProfile?.exclusiveVisualReference
        });
        return makeEntry({
          id,
          famille: 'arc-univers',
          nom: arc.title,
          univers: arc.universes,
          mode: ['RPG', 'Tactics', 'Smash'][index % 3],
          boss: arc.bossName || `${normalizeLocalizedName(arc.title).fr} Core`,
          bossVisualAnchor: subjectReference?.bossVisualAnchor,
          bossReferenceUrls: subjectReference?.bossReferenceUrls,
          ...visualReferences
        });
      })
      .sort((left, right) => left.id - right.id),

    'arc-personnage': source.characterArcs
      .map(arc => {
        const heroUniverse = arc.heroId === 'player_anchor'
          ? 'Nexus de Convergence'
          : heroById.get(arc.heroId)?.universe;
        const hero = heroById.get(arc.heroId);
        const resolvedHeroSprite = hero ? source.getHeroSpriteSheetSrc(hero, 'rpg') : null;
        const resolvedHeroSpriteFile = resolvedHeroSprite
          ? path.join(projectRoot, 'public', resolvedHeroSprite.replace(/^\//, ''))
          : null;
        const localReferencePath = (
          resolvedHeroSpriteFile && existsSync(resolvedHeroSpriteFile)
            ? resolvedHeroSprite
            : heroSpriteById.get(arc.heroId)
        );
        const localReferenceCandidatePaths = localReferencePath
          ? [normalizePublicAssetPath(localReferencePath)]
          : [];
        const reportedEntry = characterReferenceQuality.entryById.get(arc.stageId);
        if (!refreshCharacterReferenceAudit) {
          assert.ok(
            reportedEntry,
            `Character arc ${arc.stageId} is missing from the character-reference report`
          );
          assert.deepEqual(
            uniqueStrings((reportedEntry.localReferences || []).map(normalizePublicAssetPath)),
            localReferenceCandidatePaths,
            `Character arc ${arc.stageId} local-reference candidates drifted; refresh the quality audit`
          );
        }
        const approvedLocalReferencePaths = refreshCharacterReferenceAudit
          ? []
          : localReferenceCandidatePaths.filter(referencePath => {
            const classification = characterReferenceQuality.classificationByPath.get(referencePath);
            assert.ok(
              classification,
              `${referencePath}: candidate is missing from the character-reference quality report`
            );
            return classification === 'approved';
          });
        const visualReferences = getVisualReferences({ universes: [heroUniverse] });
        const subjectReference = subjectReferenceByDossier.get(`arc-personnage:${arc.stageId}`);
        const subjectVisualAnchors = Array.isArray(subjectReference?.visualAnchors)
          && subjectReference.visualAnchors.length > 0
          ? subjectReference.visualAnchors
          : visualReferences.visualAnchors;
        const characterDescriptors = buildCharacterDescriptors({ hero, arc, heroUniverse });
        const referencePolicy = visualReferences.referenceUrls.length > 0
          || (subjectReference?.bossReferenceUrls || []).length > 0
          ? 'authoritative-public'
          : 'project-runtime-lore';
        const resolvedVisualAnchors = subjectVisualAnchors.length > 0
          ? subjectVisualAnchors
          : characterDescriptors;

        assert.ok(heroUniverse, `Character arc ${arc.id} does not resolve hero ${arc.heroId}`);
        return makeEntry({
          id: arc.stageId,
          famille: 'arc-personnage',
          nom: arc.title,
          univers: [heroUniverse],
          mode: arc.mode,
          boss: arc.bossName,
          characterName: hero?.name || arc.title?.en || arc.heroId,
          characterDescriptors,
          bossVisualAnchor: subjectReference?.bossVisualAnchor,
          bossReferenceUrls: subjectReference?.bossReferenceUrls,
          localReferencePaths: approvedLocalReferencePaths,
          localReferenceCandidatePaths,
          visualAnchors: resolvedVisualAnchors,
          referenceUrls: visualReferences.referenceUrls,
          referencePolicy
        });
      })
      .sort((left, right) => left.id - right.id),

    trio: source.trioArcs
      .map(arc => {
        const subjectReference = subjectReferenceByDossier.get(`trio:${arc.stageId}`);
        const visualReferences = getVisualReferences({
          universes: arc.universes,
          explicitReferences: [source.getStageLoreProfile(arc.stageId)]
        });
        return makeEntry({
          id: arc.stageId,
          famille: 'trio',
          nom: arc.title,
          univers: arc.universes,
          mode: arc.mode,
          boss: arc.bossName,
          bossVisualAnchor: subjectReference?.bossVisualAnchor,
          bossReferenceUrls: subjectReference?.bossReferenceUrls,
          ...visualReferences
        });
      })
      .sort((left, right) => left.id - right.id)
  };

  const entries = Object.keys(EXPECTED_COUNTS)
    .flatMap(family => entriesByFamily[family]);

  applyWave5SafetyPromptOverrides(entries);
  applyWave5VisualPromptOverrides(entries);

  const counts = Object.fromEntries(
    Object.keys(EXPECTED_COUNTS)
      .map(family => [family, entriesByFamily[family].length])
  );

  return {
    schemaVersion: 1,
    generateur: 'scripts/buildRiftDossierCatalog.mjs',
    contratImage: {
      source: 'openai',
      style: '32-bit pixel art',
      largeur: 640,
      hauteur: 360,
      format: 'webp',
      espaceCouleur: 'RGB'
    },
    total: entries.length,
    comptesParFamille: counts,
    entrees: entries
  };
};

const validateCatalog = catalog => {
  assert.equal(catalog.total, EXPECTED_TOTAL, 'Rift dossier total drifted');
  assert.deepEqual(catalog.comptesParFamille, EXPECTED_COUNTS, 'Rift dossier family counts drifted');
  assert.equal(catalog.entrees.length, EXPECTED_TOTAL, 'Catalog entry count does not match total');

  const ids = new Set();
  const targets = new Set();
  const characterReferenceQuality = loadCharacterReferenceQuality({
    allowStale: refreshCharacterReferenceAudit
  });

  for (const entry of catalog.entrees) {
    const usesEnvironmentOnlySafetyPrompt = entry.promptSafetyOverride?.policy
      === 'environment-only-no-characters';
    const usesAuthoritativeCampaignPrompt = entry.famille === 'campagne-oc'
      && campaignPromptByMissionId.get(entry.id) === entry.promptOpenAI;
    assert.equal(ids.has(entry.id), false, `Duplicate playable stage id ${entry.id}`);
    assert.equal(
      targets.has(entry.cheminCibleDedie),
      false,
      `Duplicate dedicated target ${entry.cheminCibleDedie}`
    );
    assert.match(
      entry.cheminCibleDedie,
      /^\/(?:images\/rift-dossiers\/openai\/.+-v1\.(?:png|webp)|images\/oc-worlds\/v2\/.+\/stages\/.+\.png)$/,
      `${entry.id}: invalid dedicated target`
    );
    assert.ok(entry.promptOpenAI.length >= 400, `${entry.id}: OpenAI prompt is too short`);
    if (usesAuthoritativeCampaignPrompt) {
      assert.ok(
        entry.promptOpenAI.includes(String(entry.id)),
        `${entry.id}: authoritative campaign prompt omits mission id`
      );
    } else {
      assert.ok(
        entry.promptOpenAI.includes(entry.nom.en),
        `${entry.id}: prompt omits operation name`
      );
    }
    assert.ok(entry.ancragesVisuels.length > 0, `${entry.id}: missing visual anchors`);
    if (entry.politiqueReferences === 'project-runtime-lore') {
      assert.ok(
        ['expanded', 'arc-personnage'].includes(entry.famille),
        `${entry.id}: runtime-lore fallback is restricted to expanded stages and character arcs`
      );
      assert.equal(
        entry.referenceUrls.length,
        0,
        `${entry.id}: runtime-lore fallback must not mask available public references`
      );
      if (entry.promptVisualCorrection) {
        assert.ok(
          ['wave-5-primary', 'wave-5-safety-makeup'].includes(entry.promptVisualCorrection.sourceLayer),
          `${entry.id}: visual correction does not preserve a pinned runtime-lore source layer`
        );
      } else {
        assert.ok(
          entry.promptOpenAI.includes('Project-runtime lore anchors (not independently researched):'),
          `${entry.id}: prompt does not disclose runtime-only lore provenance`
        );
      }
    } else {
      assert.ok(entry.referenceUrls.length > 0, `${entry.id}: missing source references`);
    }
    assert.equal(
      entry.promptOpenAI.includes('[object Object]'),
      false,
      `${entry.id}: serialized object leaked into prompt`
    );
    if (usesEnvironmentOnlySafetyPrompt) {
      assert.ok(
        entry.promptOpenAI.includes('Safety policy: environment-only-no-characters.')
          || (
            entry.promptVisualCorrection
            && entry.promptOpenAI.includes('strict environment-only safety replacement')
          ),
        `${entry.id}: safety makeup prompt omits its audited policy marker`
      );
      assert.ok(
        entry.promptOpenAI.includes('No people, creatures, combat, weapons')
          || (
            entry.promptVisualCorrection
            && entry.promptOpenAI.includes('NEVER depict people')
            && entry.promptOpenAI.includes('combat, weapons')
          ),
        `${entry.id}: safety makeup prompt does not explicitly exclude unsafe subjects`
      );
    }
    if (entry.promptVisualCorrection) {
      assert.equal(
        sha256(Buffer.from(entry.promptOpenAI, 'utf8')),
        entry.promptVisualCorrection.generationPromptSha256,
        `${entry.id}: active visual correction prompt hash drifted`
      );
      assert.equal(
        entry.promptVisualCorrection.batchSha256,
        WAVE_5_VISUAL_CORRECTIONS_SHA256,
        `${entry.id}: visual correction batch SHA drifted`
      );
      assert.match(
        entry.promptVisualCorrection.generationId,
        /^exec-[A-Za-z0-9-]+$/u,
        `${entry.id}: visual correction generation ID drifted`
      );
    }
    if (['statique', 'fusion', 'trio'].includes(entry.famille)) {
      assert.ok(entry.bossVisualAnchor, `${entry.famille}:${entry.id}: missing boss visual anchor`);
      assert.ok(
        entry.bossReferenceUrls.length > 0,
        `${entry.famille}:${entry.id}: missing boss references`
      );
    }
    if (entry.id !== 90000 && !usesAuthoritativeCampaignPrompt) {
      if (['nonCombatFinal', 'stageSetpiece'].includes(entry.finalePolicy)) {
        assert.equal(entry.boss, null, `${entry.id}: non-combat finale must not declare a boss`);
        assert.ok(
          entry.promptOpenAI.includes('no boss or hostile subject'),
          `${entry.id}: non-combat prompt does not explicitly exclude a boss`
        );
        if (!usesEnvironmentOnlySafetyPrompt) {
          assert.ok(
            entry.promptOpenAI.includes(entry.objectifFinale.en),
            `${entry.id}: non-combat prompt omits its objective`
          );
        }
      } else if (!usesEnvironmentOnlySafetyPrompt) {
        assert.ok(entry.promptOpenAI.includes(entry.boss), `${entry.id}: prompt omits boss`);
      }
    }
    if (!usesAuthoritativeCampaignPrompt) {
      entry.univers.forEach(universe => {
        assert.ok(
          entry.promptOpenAI.includes(universe),
          `${entry.id}: prompt omits universe ${universe}`
        );
      });
    }
    if (entry.famille === 'arc-personnage') {
      const approvedReferences = entry.referencesLocalesOpenAI || [];
      const candidateReferences = entry.candidatsReferencesLocalesAudit || [];
      const expectedApprovedReferences = refreshCharacterReferenceAudit
        ? []
        : candidateReferences.filter(referencePath => (
          characterReferenceQuality.classificationByPath.get(referencePath) === 'approved'
        ));
      assert.deepEqual(
        approvedReferences,
        expectedApprovedReferences,
        `${entry.id}: OpenAI local references do not exactly match approved audit candidates`
      );
      for (const referencePath of approvedReferences) {
        assert.equal(
          characterReferenceQuality.classificationByPath.get(referencePath),
          'approved',
          `${entry.id}: non-approved local reference exposed to OpenAI: ${referencePath}`
        );
      }
      assert.equal(
        approvedReferences.some(referencePath => (
          characterReferenceQuality.classificationByPath.get(referencePath)
          === 'rejected-placeholder'
        )),
        false,
        `${entry.id}: rejected placeholder exposed to OpenAI`
      );
      if (!refreshCharacterReferenceAudit) {
        for (const referencePath of candidateReferences) {
          assert.ok(
            characterReferenceQuality.classificationByPath.has(referencePath),
            `${entry.id}: unaudited local-reference candidate ${referencePath}`
          );
        }
      }
      assert.ok(
        entry.promptOpenAI.includes(CHARACTER_SEMANTIC_PROMPT_MARKER),
        `${entry.id}: character prompt omits semantic descriptors`
      );
      if (approvedReferences.length > 0) {
        assert.ok(
          entry.promptOpenAI.includes(APPROVED_CHARACTER_REFERENCE_PROMPT_MARKER),
          `${entry.id}: approved character reference is not disclosed honestly in prompt`
        );
        assert.equal(
          entry.promptOpenAI.includes(NO_CHARACTER_REFERENCE_PROMPT_MARKER),
          false,
          `${entry.id}: prompt falsely says no character reference is supplied`
        );
      } else {
        assert.ok(
          entry.promptOpenAI.includes(NO_CHARACTER_REFERENCE_PROMPT_MARKER),
          `${entry.id}: prompt does not disclose absence of a local character reference`
        );
        assert.equal(
          entry.promptOpenAI.includes(APPROVED_CHARACTER_REFERENCE_PROMPT_MARKER),
          false,
          `${entry.id}: prompt falsely claims an approved character reference`
        );
      }
    }

    ids.add(entry.id);
    targets.add(entry.cheminCibleDedie);
  }

  return catalog;
};

const serializeCatalog = catalog => `${JSON.stringify(catalog, null, 2)}\n`;

const catalog = validateCatalog(await buildCatalog());
const serializedCatalog = serializeCatalog(catalog);
if (checkOnly) {
  assert.equal(existsSync(outputPath), true, `Missing generated catalog ${outputPath}`);
  assert.equal(
    readFileSync(outputPath, 'utf8'),
    serializedCatalog,
    'Generated rift dossier catalog is stale; run this script without --check'
  );
} else {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serializedCatalog, 'utf8');
}

const action = checkOnly ? 'validated' : 'generated';
console.log(`Rift dossier catalog ${action}: ${catalog.total} entries`);
Object.entries(catalog.comptesParFamille)
  .forEach(([family, count]) => console.log(`- ${family}: ${count}`));
console.log(path.relative(projectRoot, outputPath).replaceAll(path.sep, '/'));
