import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA_VERSION = 1;
export const CORRECTION_VERSION = 1;
export const EXPECTED_JOB_COUNT = 2;
export const BATCH_ID = 'assets-rift-dossier-wave-5-visual-corrections-v1-2026-08-30';
export const SOURCE_BATCH_SHA256 = '3b0e136cbb2c4cedcaf858d89c7471a04a6b3bd0b88b9acc4a72c7ced44b5292';
export const MAKEUP_BATCH_SHA256 = 'eeb81c4e9dfb65da0ce33ca53b8907ae36439c8de57112e36624d2b3e41d37e3';

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
export const sourceBatchPath = path.join(artifactRoot, 'asset-batch-500-wave-5-rift-dossiers.json');
export const makeupBatchPath = path.join(artifactRoot, 'asset-batch-3-wave-5-rift-dossiers-makeup.json');
export const batchJsonPath = path.join(
  artifactRoot,
  'asset-batch-2-wave-5-rift-dossiers-visual-corrections-v1.json'
);
export const promptDirectory = path.join(
  artifactRoot,
  'asset-batch-2-wave-5-rift-dossiers-visual-corrections-v1'
);

const sha256 = value => createHash('sha256').update(value).digest('hex');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const promptContractSha256 = jobs => sha256(Buffer.from(JSON.stringify(
  jobs.map(job => ({ id: job.id, output: job.output, prompt: job.generationPrompt }))
), 'utf8'));

const PROMPT_33841 = `Create one original 32-bit pixel-art landscape thumbnail for the fan-made game Multiverse Breach, 16:9 composition intended for a final 640x360 RGB WebP.

Operation: “Savannah — convergence de la horde”. Universe continuity: The Walking Dead — Telltale. Gameplay mode: Tactics. This is a strict environment-only safety replacement: NEVER depict people, humanoids, silhouettes, creatures, walkers, remains, injuries, combat, weapons or crowds.

Show deserted historic Savannah coastal streets in an original fan-art interpretation: brick facades, humid haze, subtly overgrown pavement, abandoned streetcar tracks, empty crossroads and a cyan multiverse breach. Use an elevated three-quarter tactics environment with clear traversable lanes and obstacles aligned to an IMPLIED rectangular navigation lattice.

CRITICAL: the game renders its own interactive grid separately. Draw absolutely NO grid lines, squares, dotted paths, arrows, chevrons, route markings, icons, cursors, highlights, selection zones, tactical overlays, HUD, UI, text, logos, watermark or decorative frame. Navigation must be readable only through architecture, curbs, paving seams and streetcar tracks. Strong high-contrast ink-like pixel shading, layered foreground/midground/breach light, readable at thumbnail size. No photorealism, no copied official key art, no poster composition.`;

const PROMPT_34420 = `Create one original 32-bit pixel-art landscape thumbnail for the fan-made game Multiverse Breach, 16:9 composition intended for a final 640x360 RGB WebP.

Operation: “Blackout Infiltration”. Universe continuity: Interstellar Marines. Gameplay mode: RPG. Runtime lore anchors: The Vault Target Course, SARA Final Evaluation, CTR Rifle Unit, CTR Heavy Unit, Defective CTR, Sentry Grid Evaluation, NeuroGen Incident, Starcrown Assault. Preserve this military sci-fi continuity through an original fan-art scene; do not copy official key art.

CRITICAL CAMERA CONTRACT: strict orthographic side-on 2.5D RPG battle view. The camera axis is perpendicular to one continuous horizontal battle lane spanning the lower third. A readable party zone is on the left and the Starcrown Assault threat zone is on the right. Complete silhouettes are viewed in profile. Layered training-vault architecture recedes only as parallax behind the lane, with blackout emergency lights and a cyan breach.

Absolutely NO corridor aimed into the screen, NO central vanishing-point charge, NO frontal camera, NO over-the-shoulder, FPS, TPS or elevated tactics framing, and nobody aims toward the viewer. Broad uncluttered combat lane, strong foreground/midground/background separation, immediately readable at thumbnail size. No crosshair, markers, grid, baked UI, text, logos, watermark, decorative frame, photorealism, real-person likeness or copied poster composition.`;

const SPECS = Object.freeze([
  Object.freeze({
    sequence: 1,
    stageId: 33_841,
    sourceLayer: 'wave-5-safety-makeup',
    correctionOfBatchId: 'assets-rift-dossier-wave-5-safety-makeup-2026-08-30',
    correctionOfSequence: 3,
    wave5OriginalSequence: 385,
    replacedPromptSha256: 'b218078d2d68f1849d5fad8b6920d6ad3bb5fcce5eec47df940f78495c2c44f5',
    promptFileName: '001-stage-33841-remove-baked-grid-v1.txt',
    generationPrompt: PROMPT_33841,
    visualAuditIssue: 'baked-tactics-grid-conflicts-with-runtime-grid',
    correctionReason: 'Remove every baked tactical overlay while preserving an implied navigation lattice aligned with the separately rendered runtime grid.',
    generationId: 'exec-b812cfa3-0aec-42f0-a634-daf6aae6fb06',
    sourceImageSha256: 'eb195c6186a18d7e4ae92824f6d196ce1d7d5e5aaad339890f610fc03debe9e0',
    preflightFailures: [
      'A local referenced-image edit was blocked before ImageGen by a sandbox ACL preflight failure. It did not consume an ImageGen call; the successful result used the frozen text prompt.'
    ]
  }),
  Object.freeze({
    sequence: 2,
    stageId: 34_420,
    sourceLayer: 'wave-5-primary',
    correctionOfBatchId: 'assets-rift-dossier-pending-500-wave-5-2026-08-30',
    correctionOfSequence: 500,
    wave5OriginalSequence: 500,
    replacedPromptSha256: 'f726439622007b9e41ce14875e44d4234fd507f87f0ad78188ee19182de31cab',
    promptFileName: '002-stage-34420-orthographic-rpg-camera-v1.txt',
    generationPrompt: PROMPT_34420,
    visualAuditIssue: 'perspective-corridor-conflicts-with-rpg-side-view',
    correctionReason: 'Replace the forward-facing corridor with the strict side-on 2.5D battle lane required by RPG gameplay.',
    generationId: 'exec-733b0711-fdae-416b-a897-b978b1c037f4',
    sourceImageSha256: '90f27fcc37b9d03a28d315148ed3d1b71b33f7da96eb2aa7e699d53669b8dcf0',
    preflightFailures: []
  })
]);

const promptFileFor = spec => [
  'docs',
  'openai-generation-prompts-2026-08-25',
  'asset-batch-2-wave-5-rift-dossiers-visual-corrections-v1',
  spec.promptFileName
].join('/');

const readPinnedBatch = async ({ file, expectedSha256, expectedBatchId, label }) => {
  const bytes = await fs.readFile(file);
  assert(sha256(bytes) === expectedSha256, `${label} SHA drifted`);
  const document = JSON.parse(bytes.toString('utf8'));
  assert(document.schemaVersion === 1, `${label} schemaVersion drifted`);
  assert(document.batchId === expectedBatchId, `${label} batchId drifted`);
  assert(Array.isArray(document.jobs), `${label} jobs are missing`);
  return document;
};

const loadSources = async () => {
  const [primary, makeup] = await Promise.all([
    readPinnedBatch({
      file: sourceBatchPath,
      expectedSha256: SOURCE_BATCH_SHA256,
      expectedBatchId: 'assets-rift-dossier-pending-500-wave-5-2026-08-30',
      label: 'Wave 5 primary batch'
    }),
    readPinnedBatch({
      file: makeupBatchPath,
      expectedSha256: MAKEUP_BATCH_SHA256,
      expectedBatchId: 'assets-rift-dossier-wave-5-safety-makeup-2026-08-30',
      label: 'Wave 5 safety makeup batch'
    })
  ]);
  return { primary, makeup };
};

const sourceJobFor = (sources, spec) => {
  const document = spec.sourceLayer === 'wave-5-safety-makeup'
    ? sources.makeup
    : sources.primary;
  const sourceJob = document.jobs.find(job => job.sequence === spec.correctionOfSequence);
  assert(sourceJob, `Missing ${spec.sourceLayer} sequence ${spec.correctionOfSequence}`);
  assert(Number(sourceJob.id) === spec.stageId, `Source identity drifted for stage ${spec.stageId}`);
  assert(sourceJob.generationPromptSha256 === spec.replacedPromptSha256, `Source prompt drifted for stage ${spec.stageId}`);
  if (spec.sourceLayer === 'wave-5-safety-makeup') {
    assert(sourceJob.replacementOfSequence === spec.wave5OriginalSequence, `Makeup chain drifted for stage ${spec.stageId}`);
  }
  return sourceJob;
};

const buildJob = (sourceJob, spec) => {
  const generationPromptSha256 = sha256(Buffer.from(spec.generationPrompt, 'utf8'));
  return {
    sequence: spec.sequence,
    correctionVersion: CORRECTION_VERSION,
    replacementOfSequence: spec.wave5OriginalSequence,
    kind: sourceJob.kind,
    id: sourceJob.id,
    stageId: sourceJob.stageId,
    assetId: sourceJob.assetId,
    name: sourceJob.name,
    universe: sourceJob.universe,
    family: sourceJob.family,
    mode: sourceJob.mode,
    output: sourceJob.output,
    replace: true,
    sourceLayer: spec.sourceLayer,
    correctionOfBatchId: spec.correctionOfBatchId,
    correctionOfSequence: spec.correctionOfSequence,
    correctionOfGenerationPromptSha256: spec.replacedPromptSha256,
    replacedPromptSha256: spec.replacedPromptSha256,
    visualAuditIssue: spec.visualAuditIssue,
    correctionReason: spec.correctionReason,
    sourcePromptSha256: generationPromptSha256,
    generationPromptSha256,
    promptFile: promptFileFor(spec),
    generationPrompt: spec.generationPrompt,
    successfulGeneration: {
      provider: 'OpenAI',
      interface: 'built-in image_gen',
      generationId: spec.generationId,
      sourceImage: {
        format: 'PNG',
        width: 1672,
        height: 941,
        sha256: spec.sourceImageSha256
      }
    },
    attemptAudit: {
      maximumImageGenCalls: 2,
      usedImageGenCalls: 1,
      preflightFailures: spec.preflightFailures
    }
  };
};

export const createBatch = async () => {
  const sources = await loadSources();
  const jobs = SPECS.map(spec => buildJob(sourceJobFor(sources, spec), spec));
  assert(jobs.length === EXPECTED_JOB_COUNT, 'Visual correction count drifted');
  assert(new Set(jobs.map(job => `${job.kind}:${job.id}`)).size === EXPECTED_JOB_COUNT, 'Visual correction identities overlap');
  assert(new Set(jobs.map(job => job.output)).size === EXPECTED_JOB_COUNT, 'Visual correction outputs overlap');
  return {
    schemaVersion: SCHEMA_VERSION,
    correctionVersion: CORRECTION_VERSION,
    batchId: BATCH_ID,
    kind: 'stage',
    promptCatalogSha256: promptContractSha256(jobs),
    sources: {
      wave5Primary: {
        path: 'docs/openai-generation-prompts-2026-08-25/asset-batch-500-wave-5-rift-dossiers.json',
        batchId: sources.primary.batchId,
        sha256: SOURCE_BATCH_SHA256
      },
      wave5SafetyMakeup: {
        path: 'docs/openai-generation-prompts-2026-08-25/asset-batch-3-wave-5-rift-dossiers-makeup.json',
        batchId: sources.makeup.batchId,
        sha256: MAKEUP_BATCH_SHA256
      }
    },
    overlayOrder: ['wave-5-primary', 'wave-5-safety-makeup', 'wave-5-visual-corrections-v1'],
    correctionPolicy: [
      'select exactly the two Wave 5 thumbnails rejected by the post-generation visual gameplay audit',
      'apply this versioned correction layer after the safety makeup layer',
      'preserve runtime identity and output while replacing the installed image and catalog prompt',
      'pin the exact successful OpenAI generation ID, original PNG SHA-256 and source dimensions',
      'allow at most two ImageGen calls per job; preflight file-access failures are recorded separately'
    ],
    counts: {
      jobs: jobs.length,
      replaceTrue: jobs.filter(job => job.replace).length,
      safetyMakeupSources: jobs.filter(job => job.sourceLayer === 'wave-5-safety-makeup').length,
      primarySources: jobs.filter(job => job.sourceLayer === 'wave-5-primary').length
    },
    jobs
  };
};

const validateJob = async (job, index, spec, sources) => {
  const sourceJob = sourceJobFor(sources, spec);
  assert(job.sequence === index + 1, `Sequence drifted at ${index + 1}`);
  assert(job.correctionVersion === CORRECTION_VERSION, `Version drifted for ${job.id}`);
  assert(job.kind === 'stage' && Number(job.id) === spec.stageId, `Identity drifted at ${index + 1}`);
  assert(job.output === sourceJob.output && job.replace === true, `Install contract drifted for ${job.id}`);
  assert(job.sourceLayer === spec.sourceLayer, `Source layer drifted for ${job.id}`);
  assert(job.correctionOfBatchId === spec.correctionOfBatchId, `Source batch drifted for ${job.id}`);
  assert(job.correctionOfSequence === spec.correctionOfSequence, `Source sequence drifted for ${job.id}`);
  assert(job.replacementOfSequence === spec.wave5OriginalSequence, `Primary sequence drifted for ${job.id}`);
  assert(job.replacedPromptSha256 === spec.replacedPromptSha256, `Replaced prompt SHA drifted for ${job.id}`);
  assert(job.generationPrompt === spec.generationPrompt, `Prompt drifted for ${job.id}`);
  const promptBytes = Buffer.from(job.generationPrompt, 'utf8');
  const promptHash = sha256(promptBytes);
  assert(job.generationPromptSha256 === promptHash && job.sourcePromptSha256 === promptHash, `Prompt hash drifted for ${job.id}`);
  const promptPath = path.resolve(projectRoot, ...job.promptFile.split('/'));
  assert(promptPath.startsWith(promptDirectory), `Prompt escapes directory for ${job.id}`);
  assert((await fs.readFile(promptPath)).equals(promptBytes), `Prompt file is not verbatim for ${job.id}`);
  assert(job.successfulGeneration?.generationId === spec.generationId, `Generation ID drifted for ${job.id}`);
  assert(job.successfulGeneration?.provider === 'OpenAI' && job.successfulGeneration?.interface === 'built-in image_gen', `Provider drifted for ${job.id}`);
  assert(job.successfulGeneration?.sourceImage?.format === 'PNG', `Source format drifted for ${job.id}`);
  assert(job.successfulGeneration?.sourceImage?.width === 1672 && job.successfulGeneration?.sourceImage?.height === 941, `Source dimensions drifted for ${job.id}`);
  assert(job.successfulGeneration?.sourceImage?.sha256 === spec.sourceImageSha256, `Source PNG SHA drifted for ${job.id}`);
  assert(job.attemptAudit?.maximumImageGenCalls === 2 && job.attemptAudit?.usedImageGenCalls === 1, `Attempt budget drifted for ${job.id}`);
  assert(JSON.stringify(job.attemptAudit?.preflightFailures) === JSON.stringify(spec.preflightFailures), `Preflight audit drifted for ${job.id}`);
};

export const validateBatchArtifact = async () => {
  const [artifactBytes, sources] = await Promise.all([fs.readFile(batchJsonPath), loadSources()]);
  const artifact = JSON.parse(artifactBytes.toString('utf8'));
  assert(artifact.schemaVersion === SCHEMA_VERSION, 'Visual correction schemaVersion drifted');
  assert(artifact.correctionVersion === CORRECTION_VERSION, 'Visual correction version drifted');
  assert(artifact.batchId === BATCH_ID && artifact.kind === 'stage', 'Visual correction identity drifted');
  assert(artifact.sources?.wave5Primary?.sha256 === SOURCE_BATCH_SHA256, 'Primary source SHA drifted');
  assert(artifact.sources?.wave5SafetyMakeup?.sha256 === MAKEUP_BATCH_SHA256, 'Makeup source SHA drifted');
  assert(artifact.jobs?.length === EXPECTED_JOB_COUNT, 'Visual corrections must contain exactly two jobs');
  assert(artifact.counts?.jobs === 2 && artifact.counts?.replaceTrue === 2, 'Visual correction counts drifted');
  assert(artifact.counts?.safetyMakeupSources === 1 && artifact.counts?.primarySources === 1, 'Source partition drifted');
  assert(JSON.stringify(artifact.overlayOrder) === JSON.stringify(['wave-5-primary', 'wave-5-safety-makeup', 'wave-5-visual-corrections-v1']), 'Overlay order drifted');
  assert(artifact.promptCatalogSha256 === promptContractSha256(artifact.jobs), 'Prompt contract drifted');
  const files = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile()).map(entry => entry.name).sort();
  assert(JSON.stringify(files) === JSON.stringify(SPECS.map(spec => spec.promptFileName).sort()), 'Prompt directory drifted');
  await Promise.all(artifact.jobs.map((job, index) => validateJob(job, index, SPECS[index], sources)));
  return { artifact, artifactSha256: sha256(artifactBytes) };
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
    const { artifact, artifactSha256 } = await validateBatchArtifact();
    console.log(JSON.stringify({ status: 'ok', mode: 'check', batchId: artifact.batchId, jobs: artifact.jobs.length, artifactSha256 }, null, 2));
    return;
  }
  const batch = await createBatch();
  await writeBatchArtifact(batch);
  const { artifactSha256 } = await validateBatchArtifact();
  console.log(JSON.stringify({ status: 'ok', mode: 'write', batchId: batch.batchId, jobs: batch.jobs.length, artifactSha256 }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
