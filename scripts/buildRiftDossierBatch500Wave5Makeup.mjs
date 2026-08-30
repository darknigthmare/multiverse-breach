import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA_VERSION = 1;
export const EXPECTED_JOB_COUNT = 3;
export const SOURCE_BATCH_SHA256 = '3b0e136cbb2c4cedcaf858d89c7471a04a6b3bd0b88b9acc4a72c7ced44b5292';
export const SOURCE_SEQUENCES = Object.freeze([211, 363, 385]);
export const BATCH_ID = 'assets-rift-dossier-wave-5-safety-makeup-2026-08-30';

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
export const sourceBatchPath = path.join(artifactRoot, 'asset-batch-500-wave-5-rift-dossiers.json');
export const batchJsonPath = path.join(artifactRoot, 'asset-batch-3-wave-5-rift-dossiers-makeup.json');
export const promptDirectory = path.join(artifactRoot, 'asset-batch-3-wave-5-rift-dossiers-makeup');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const promptContractSha256 = jobs => sha256(Buffer.from(JSON.stringify(
  jobs.map(job => ({ id: job.id, output: job.output, prompt: job.generationPrompt }))
), 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const SAFE_PROMPT_BY_SOURCE_SEQUENCE = Object.freeze({
  211: [
    'OpenAI image request: create one original 32-bit pixel-art rift-dossier thumbnail for the fan-made game Multiverse Breach.',
    'Operation: "Castle Wolfenstein Escape".',
    'Canonical Thread or universe: Wolfenstein.',
    'Gameplay mode: RPG.',
    'Final threat metadata only, never visualized as a person: Frau Engel.',
    'Safety policy: environment-only-no-characters.',
    'Project-runtime lore anchors (not independently researched): Castle Wolfenstein Escape | an unoccupied fictional stone fortress | iron gates, vaulted corridors, industrial conduits, cold mountain mist and a cyan breach.',
    'Create an original environment-only fan-art scene: an empty castle escape route with heavy masonry, sealed mechanical doors, worn floor plates, distant moonlit battlements and breach light, using no insignia or propaganda.',
    'Use a side-view 2.5D RPG camera with a broad central traversal lane and layered depth.',
    'Keep foreground, middle ground, exits and navigation space immediately readable at miniature size.',
    'No people, creatures, combat, weapons, humanoids, silhouettes, injuries, uniforms, emblems, readable text, logos, watermark, baked UI, decorative frame, copied key-art composition, photorealism, or real-person likeness.',
    'Landscape 16:9; the generated source will be installed as an optimized 640x360 RGB WebP thumbnail.'
  ].join(' '),
  363: [
    'OpenAI image request: create one original 32-bit pixel-art rift-dossier thumbnail for the fan-made game Multiverse Breach.',
    'Operation: "Fog Realm — évasion de l’Entity".',
    'Canonical Thread or universe: Dead by Daylight.',
    'Gameplay mode: Smash.',
    'Final encounter: environmental non-combat finale; no boss or hostile subject.',
    'Safety policy: environment-only-no-characters.',
    'Project-runtime lore anchors (not independently researched): Fog Realm — évasion de l’Entity | MacMillan Estate — Coal Tower Trial | an empty fog-bound industrial estate | a weathered coal tower, five idle repair machines, an open exit gate, timber floor edges and cyan breach light.',
    'Create an original environment-only fan-art scene focused on deserted machinery, gentle fog layers and a readable route to the gate.',
    'Use a strict side-view platform-traversal camera with readable floor edges, gaps and shallow parallax.',
    'Keep foreground, middle ground, exits and navigation space immediately readable at miniature size.',
    'No people, creatures, combat, weapons, humanoids, pursuers, hooks, restraints, attacks, injuries, readable text, logos, watermark, baked UI, decorative frame, copied key-art composition, photorealism, or real-person likeness.',
    'Landscape 16:9; the generated source will be installed as an optimized 640x360 RGB WebP thumbnail.'
  ].join(' '),
  385: [
    'OpenAI image request: create one original 32-bit pixel-art rift-dossier thumbnail for the fan-made game Multiverse Breach.',
    'Operation: "Savannah — convergence de la horde".',
    'Canonical Thread or universe: The Walking Dead — Telltale.',
    'Gameplay mode: Tactics.',
    'Final threat metadata only, never visualized as a creature: Savannah Walker Herd.',
    'Safety policy: environment-only-no-characters.',
    'Project-runtime lore anchors (not independently researched): Savannah — convergence de la horde | Savannah — rues en Graphic Black | deserted historic coastal streets | empty crossroads, brick facades, overgrown pavement, abandoned streetcar tracks, humid haze and a cyan breach.',
    'Create an original environment-only fan-art scene with high-contrast ink-like pixel shading, deep shadows and a clear route through the empty city, without copying official key art.',
    'Use an elevated three-quarter tactics camera with readable street obstacles, traversal lanes and a rectangular navigation grid.',
    'Keep foreground, middle ground, breach light and route choices immediately readable at miniature size.',
    'No people, creatures, combat, weapons, humanoids, crowds, remains, injuries, readable text, logos, watermark, baked UI, decorative frame, copied poster composition, photorealism, or real-person likeness.',
    'Landscape 16:9; the generated source will be installed as an optimized 640x360 RGB WebP thumbnail.'
  ].join(' ')
});

const promptFileFor = (sequence, sourceJob) => [
  'docs',
  'openai-generation-prompts-2026-08-25',
  'asset-batch-3-wave-5-rift-dossiers-makeup',
  `${String(sequence).padStart(3, '0')}-stage-${sourceJob.id}-environment-only.txt`
].join('/');

const loadSourceBatch = async () => {
  const bytes = await fs.readFile(sourceBatchPath);
  assert(sha256(bytes) === SOURCE_BATCH_SHA256, 'Wave 5 source batch SHA drifted');
  const document = JSON.parse(bytes.toString('utf8'));
  assert(document.jobs?.length === 500, 'Wave 5 source batch must contain exactly 500 jobs');
  return { bytes, document };
};

export const createBatch = async () => {
  const source = await loadSourceBatch();
  const sourceBySequence = new Map(source.document.jobs.map(job => [job.sequence, job]));
  const jobs = SOURCE_SEQUENCES.map((replacementOfSequence, index) => {
    const sourceJob = sourceBySequence.get(replacementOfSequence);
    assert(sourceJob, `Missing Wave 5 source sequence ${replacementOfSequence}`);
    const generationPrompt = SAFE_PROMPT_BY_SOURCE_SEQUENCE[replacementOfSequence];
    const generationPromptSha256 = sha256(Buffer.from(generationPrompt, 'utf8'));
    return {
      sequence: index + 1,
      replacementOfSequence,
      kind: sourceJob.kind,
      id: sourceJob.id,
      stageId: sourceJob.stageId,
      assetId: sourceJob.assetId,
      name: sourceJob.name,
      universe: sourceJob.universe,
      family: sourceJob.family,
      mode: sourceJob.mode,
      output: sourceJob.output,
      replace: sourceJob.replace,
      safetyPolicy: 'environment-only-no-characters',
      replacedPromptSha256: sourceJob.generationPromptSha256,
      sourcePromptSha256: generationPromptSha256,
      generationPromptSha256,
      promptFile: promptFileFor(index + 1, sourceJob),
      generationPrompt
    };
  });
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'stage',
    promptCatalogSha256: promptContractSha256(jobs),
    source: {
      batchId: source.document.batchId,
      batch: 'docs/openai-generation-prompts-2026-08-25/asset-batch-500-wave-5-rift-dossiers.json',
      batchSha256: SOURCE_BATCH_SHA256,
      terminalFailureSequences: [...SOURCE_SEQUENCES]
    },
    replacementPolicy: 'environment-only-no-characters',
    counts: { jobs: jobs.length, replacements: jobs.length },
    jobs
  };
};

const validateJob = async (job, index, sourceJob) => {
  assert(job.sequence === index + 1, `Non-contiguous makeup sequence at ${index + 1}`);
  assert(job.replacementOfSequence === SOURCE_SEQUENCES[index], 'Makeup source sequence drifted');
  assert(job.kind === sourceJob.kind && job.id === sourceJob.id, 'Makeup identity drifted');
  assert(job.output === sourceJob.output, `Makeup output drifted for ${job.id}`);
  assert(job.replacedPromptSha256 === sourceJob.generationPromptSha256, 'Replaced prompt SHA drifted');
  assert(job.safetyPolicy === 'environment-only-no-characters', 'Makeup safety policy drifted');
  assert(job.generationPrompt.includes('Safety policy: environment-only-no-characters.'), 'Safety marker missing');
  assert(job.generationPrompt.includes('No people, creatures, combat, weapons'), 'Safety exclusions missing');
  assert(job.generationPrompt.length >= 700, `Makeup prompt too short for ${job.id}`);
  const promptHash = sha256(Buffer.from(job.generationPrompt, 'utf8'));
  assert(promptHash === job.generationPromptSha256, `Makeup prompt hash drifted for ${job.id}`);
  assert(job.sourcePromptSha256 === promptHash, `Makeup catalog prompt hash drifted for ${job.id}`);
  const promptPath = path.resolve(projectRoot, job.promptFile);
  assert(promptPath.startsWith(promptDirectory), `Makeup prompt escapes its directory for ${job.id}`);
  assert((await fs.readFile(promptPath, 'utf8')) === job.generationPrompt, `Makeup prompt file drifted for ${job.id}`);
};

export const validateBatchArtifact = async () => {
  const [artifactBytes, source] = await Promise.all([
    fs.readFile(batchJsonPath),
    loadSourceBatch()
  ]);
  const artifact = JSON.parse(artifactBytes.toString('utf8'));
  assert(artifact.schemaVersion === SCHEMA_VERSION, 'Unexpected makeup schemaVersion');
  assert(artifact.batchId === BATCH_ID, 'Unexpected makeup batchId');
  assert(artifact.jobs?.length === EXPECTED_JOB_COUNT, 'Makeup must contain exactly three jobs');
  assert(artifact.source?.batchSha256 === SOURCE_BATCH_SHA256, 'Makeup source SHA drifted');
  assert(artifact.promptCatalogSha256 === promptContractSha256(artifact.jobs), 'Makeup prompt contract drifted');
  const sourceBySequence = new Map(source.document.jobs.map(job => [job.sequence, job]));
  await Promise.all(artifact.jobs.map((job, index) => (
    validateJob(job, index, sourceBySequence.get(job.replacementOfSequence))
  )));
  return { artifact, artifactSha256: sha256(artifactBytes) };
};

const writeBatchArtifact = async batch => {
  await fs.rm(promptDirectory, { recursive: true, force: true });
  await fs.mkdir(promptDirectory, { recursive: true });
  await Promise.all(batch.jobs.map(job => (
    fs.writeFile(path.resolve(projectRoot, job.promptFile), job.generationPrompt, 'utf8')
  )));
  await fs.writeFile(batchJsonPath, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
};

const main = async () => {
  if (process.argv.includes('--check')) {
    const { artifact, artifactSha256 } = await validateBatchArtifact();
    console.log(JSON.stringify({
      status: 'ok',
      mode: 'check',
      batchId: artifact.batchId,
      jobs: artifact.jobs.length,
      artifactSha256
    }, null, 2));
    return;
  }
  const batch = await createBatch();
  await writeBatchArtifact(batch);
  const { artifactSha256 } = await validateBatchArtifact();
  console.log(JSON.stringify({
    status: 'ok',
    mode: 'write',
    batchId: batch.batchId,
    jobs: batch.jobs.length,
    artifactSha256
  }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
