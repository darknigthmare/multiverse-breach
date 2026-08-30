import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA_VERSION = 1;
export const BATCH_ID = 'assets-character-reference-wave-4-corrections-makeup-9-2026-08-30';
export const SOURCE_BATCH_ID = 'assets-character-reference-wave-4-corrections-33-2026-08-30';
export const SOURCE_BATCH_SHA256 = '658c8d1fa413c88dc7718bd0fb2a9eeb4cbd9f4d8a372e55c68de8e32e5d461a';
export const FAILED_SEQUENCE_LIST_SHA256 = '5fc58bbae2853b57ec3fcbdd77913c425aff327f60120aa15fba0746cdb973b4';
export const JOB_COUNT = 9;
export const FAILED_SEQUENCES = Object.freeze([10, 11, 12, 17, 22, 25, 27, 29, 32]);

const DIRECTIONS = Object.freeze({
  10: 'small lemon-yellow clockwork service orb with two asymmetrical cyan sensor windows, teal apron-like armor panels, four tiny caster feet and a red tool token',
  11: 'tall saffron-orange rectangular service automaton with two cyan square sensors, navy utility panels, telescopic legs and an unlettered maintenance tablet',
  12: 'medium golden spherical sound-check drone with one cyan hexagonal sensor, indigo side plates, three short legs and a small harmless chime bar',
  17: 'compact gunmetal eight-legged laboratory rover with one smooth dome sensor, teal stabilizer lights, a white lab beacon and no organic anatomy',
  22: 'original adult rooftop rescue technician with an uncovered original face, charcoal high-collared short coat, silver wraparound visor, blue forensic scanner and coiled climbing line; no mask, cape or emblem',
  25: 'original adult magical-academy cartographer with tousled dark hair, square spectacles, navy academic coat, practical trousers, boots, a brass star compass and closed map; no wand or facial scar',
  27: 'original adult rooftop rescue engineer with an uncovered original face, slate-grey reinforced coat, white-lens safety visor, orange rope spool and compact analysis tablet; no mask, cape or emblem',
  29: 'original adult stage illusionist with warm peach skin, dark teal swept hair, plum formal coat, silver scarf, blank cards and a lavender silk ribbon; friendly and non-threatening',
  32: 'tall nonhuman obsidian observatory automaton with a faceted rectangular helmet, cyan horizontal visor, charcoal shoulder mantle and ruby calibration rod emitting a short gentle glow'
});

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
export const sourceBatchPath = path.join(artifactRoot, 'asset-batch-33-wave-4-corrections.json');
export const batchJsonPath = path.join(artifactRoot, 'asset-batch-9-wave-4-corrections-makeup.json');
export const promptDirectory = path.join(artifactRoot, 'asset-batch-9-wave-4-corrections-makeup');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const sameValues = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const slugify = value => String(value || 'asset')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'asset';

const buildPrompt = direction => [
  'Use case: stylized-concept',
  'Asset type: safety-first transparent production sprite sheet for a 2D canvas game',
  'Primary request: invent a completely original storybook-animation character from this standalone art direction: ' + direction + '.',
  'Originality lock: do not depict, imitate, name or reproduce any existing franchise character, celebrity, actor, trademark costume, signature logo or protected exact likeness.',
  'Style: polished detailed 32-bit-era pixel art, crisp clusters, controlled highlights, clean dark outlines and a readable complete silhouette.',
  'Sheet geometry: one square PNG, exact 4 columns x 4 rows, exactly sixteen equal isolated nonempty cells, one complete centered full-body pose per cell, consistent elevated three-quarter side angle facing right, consistent scale and lighting.',
  'Animation rows: row 1 four calm idle poses; row 2 four readable travel poses; row 3 four harmless work, navigation or presentation demonstrations using only the described safe prop; row 4 four gentle balance-reset poses ending in composed recovery.',
  'Continuity: keep the same wholly original body shape, face or sensor arrangement, outfit or armor colors and safe prop in every cell.',
  'Cell lock: head and feet or full chassis, clothing or panels, prop and any compact soft light must remain entirely inside its own cell with transparent breathing room.',
  'Output lock: genuine transparent alpha around every pose in a 32-bit RGBA PNG; no background, floor, cast shadow, checkerboard, chroma key, opaque panel or visible grid.',
  'Safety lock: fully clothed or fully enclosed, wholesome and non-threatening; no attack, weapon, fighting, injury, threat, gore, victim, nudity or sexualization.',
  'Branding lock: no text, letters, numbers, logo, watermark, signature, UI, poster or copied key art.',
  'Production target: a square source sheet normalized to 1024 x 1024, yielding sixteen 256 x 256 cells.'
].join('\n');

const loadSource = async () => {
  const bytes = await fs.readFile(sourceBatchPath);
  assert(sha256(bytes) === SOURCE_BATCH_SHA256, 'Wave 4 correction source batch drifted');
  const source = JSON.parse(bytes.toString('utf8'));
  assert(source.batchId === SOURCE_BATCH_ID, 'Wave 4 correction source ID drifted');
  assert(Array.isArray(source.jobs) && source.jobs.length === 33, 'Wave 4 correction source count drifted');
  assert(sha256(JSON.stringify(FAILED_SEQUENCES)) === FAILED_SEQUENCE_LIST_SHA256, 'Wave 4 makeup failure list drifted');
  return source;
};

const promptFileFor = (sequence, job, hash) => [
  'docs',
  'openai-generation-prompts-2026-08-25',
  'asset-batch-9-wave-4-corrections-makeup',
  String(sequence).padStart(3, '0') + '-hero-' + slugify(job.id).slice(0, 64) + '-original-' + hash.slice(0, 8) + '.txt'
].join('/');

export const createBatch = async () => {
  const source = await loadSource();
  const sourceBySequence = new Map(source.jobs.map(job => [job.sequence, job]));
  const jobs = FAILED_SEQUENCES.map((sourceSequence, index) => {
    const sourceJob = sourceBySequence.get(sourceSequence);
    const direction = DIRECTIONS[sourceSequence];
    assert(sourceJob && direction, 'Missing Wave 4 makeup source for ' + sourceSequence);
    const generationPrompt = buildPrompt(direction);
    const generationPromptSha256 = sha256(Buffer.from(generationPrompt, 'utf8'));
    return {
      ...sourceJob,
      sequence: index + 1,
      promptFile: promptFileFor(index + 1, sourceJob, generationPromptSha256),
      generationPrompt,
      generationPromptSha256,
      selectionTier: 'wave-4-second-pass-distinct-original',
      visualAnchor: {
        physical: direction,
        outfit: 'fully clothed or fully enclosed original design',
        role: 'wholesome work, navigation or presentation helper',
        equipment: 'harmless described prop only'
      },
      correctionReason: 'Second-pass, strongly distinct original design after a terminal 2/2 safety refusal.',
      correctionOfBatchId: SOURCE_BATCH_ID,
      correctionOfSequence: sourceSequence,
      correctionOfGenerationPromptSha256: sourceJob.generationPromptSha256,
      originalWave4Sequence: sourceJob.correctionOfSequence
    };
  });
  assert(jobs.length === JOB_COUNT, 'Wave 4 makeup count drifted');
  assert(new Set(jobs.map(job => job.kind + ':' + job.id)).size === JOB_COUNT, 'Wave 4 makeup identities overlap');
  assert(new Set(jobs.map(job => job.output)).size === JOB_COUNT, 'Wave 4 makeup outputs overlap');
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'hero',
    promptCatalogSha256: source.promptCatalogSha256,
    sources: {
      correctionBatch: {
        path: 'docs/openai-generation-prompts-2026-08-25/asset-batch-33-wave-4-corrections.json',
        batchId: SOURCE_BATCH_ID,
        sha256: SOURCE_BATCH_SHA256
      }
    },
    correctionPolicy: [
      'select exactly the 9 terminal safety refusals from the first correction batch',
      'replace each prompt with a standalone strongly distinct original design',
      'preserve runtime identity, output, frame and replace contracts',
      'allow at most two OpenAI image calls per job and never substitute a runtime identity'
    ],
    selectionHashes: { failedSequenceListSha256: FAILED_SEQUENCE_LIST_SHA256 },
    counts: {
      jobs: jobs.length,
      replaceFalse: jobs.filter(job => !job.replace).length,
      replaceTrue: jobs.filter(job => job.replace).length
    },
    jobs
  };
};

export const validateBatchArtifact = async () => {
  const [source, artifact] = await Promise.all([
    loadSource(),
    fs.readFile(batchJsonPath, 'utf8').then(JSON.parse)
  ]);
  assert(artifact.schemaVersion === SCHEMA_VERSION, 'Wave 4 makeup schema drifted');
  assert(artifact.batchId === BATCH_ID, 'Wave 4 makeup batch ID drifted');
  assert(artifact.sources?.correctionBatch?.sha256 === SOURCE_BATCH_SHA256, 'Wave 4 makeup source hash drifted');
  assert(artifact.selectionHashes?.failedSequenceListSha256 === FAILED_SEQUENCE_LIST_SHA256, 'Wave 4 makeup list hash drifted');
  assert(artifact.counts?.jobs === JOB_COUNT, 'Wave 4 makeup count drifted');
  assert(artifact.counts?.replaceFalse === 5 && artifact.counts?.replaceTrue === 4, 'Wave 4 makeup replace policy drifted');
  assert(Array.isArray(artifact.jobs) && artifact.jobs.length === JOB_COUNT, 'Wave 4 makeup jobs drifted');
  const sourceBySequence = new Map(source.jobs.map(job => [job.sequence, job]));
  const promptFiles = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  assert(sameValues(promptFiles, artifact.jobs.map(job => path.basename(job.promptFile)).sort()), 'Wave 4 makeup prompt files drifted');
  for (const [index, job] of artifact.jobs.entries()) {
    const sourceSequence = FAILED_SEQUENCES[index];
    const sourceJob = sourceBySequence.get(sourceSequence);
    assert(job.sequence === index + 1 && job.correctionOfSequence === sourceSequence, 'Wave 4 makeup order drifted');
    assert(job.id === sourceJob.id && job.output === sourceJob.output, 'Wave 4 makeup runtime identity drifted');
    assert(job.replace === sourceJob.replace && sameValues(job.frame, sourceJob.frame), 'Wave 4 makeup install contract drifted');
    assert(job.originalWave4Sequence === sourceJob.correctionOfSequence, 'Wave 4 original sequence drifted');
    assert(job.correctionOfGenerationPromptSha256 === sourceJob.generationPromptSha256, 'Wave 4 makeup source prompt hash drifted');
    const bytes = await fs.readFile(path.resolve(projectRoot, ...job.promptFile.split('/')));
    assert(bytes.equals(Buffer.from(job.generationPrompt, 'utf8')), 'Wave 4 makeup prompt is not verbatim');
    assert(sha256(bytes) === job.generationPromptSha256, 'Wave 4 makeup prompt hash mismatch');
    assert(/completely original/iu.test(job.generationPrompt), 'Wave 4 makeup originality lock missing');
    assert(/exactly sixteen equal/iu.test(job.generationPrompt), 'Wave 4 makeup sheet lock missing');
    assert(/genuine transparent alpha/iu.test(job.generationPrompt), 'Wave 4 makeup alpha lock missing');
    assert(/no attack, weapon, fighting/iu.test(job.generationPrompt), 'Wave 4 makeup safety lock missing');
    assert(!job.generationPrompt.includes(sourceJob.name), 'Wave 4 makeup leaked source name');
    assert(!job.generationPrompt.includes(sourceJob.universe), 'Wave 4 makeup leaked source universe');
  }
  return artifact;
};

const writeBatch = async batch => {
  await fs.rm(promptDirectory, { recursive: true, force: true });
  await fs.mkdir(promptDirectory, { recursive: true });
  await Promise.all(batch.jobs.map(job => (
    fs.writeFile(path.resolve(projectRoot, ...job.promptFile.split('/')), job.generationPrompt, 'utf8')
  )));
  await fs.writeFile(batchJsonPath, JSON.stringify(batch, null, 2) + '\n', 'utf8');
};

const main = async () => {
  if (process.argv.includes('--check')) {
    const batch = await validateBatchArtifact();
    console.log(JSON.stringify({ status: 'ok', mode: 'check', batchId: batch.batchId, jobs: batch.jobs.length }, null, 2));
    return;
  }
  const batch = await createBatch();
  await writeBatch(batch);
  await validateBatchArtifact();
  console.log(JSON.stringify({ status: 'ok', mode: 'write', batchId: batch.batchId, jobs: batch.jobs.length }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
  });
}
