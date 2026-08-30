import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA_VERSION = 1;
export const BATCH_ID = 'assets-character-reference-wave-4-corrections-33-2026-08-30';
export const SOURCE_BATCH_ID = 'assets-character-reference-remediation-334-wave-4-2026-08-28';
export const SOURCE_BATCH_SHA256 = 'e6216aa7dc58ea4f284ba02bd2869f7619684afc80ef734ef58bb08d3e5c4cc3';
export const FAILED_SEQUENCE_LIST_SHA256 = '75c9745cbe2fa3cda9673f3edf9730af91bde2001f45e4e3939bd471920fc4a7';
export const JOB_COUNT = 33;
export const TECHNICAL_RETRY_COUNT = 9;
export const SAFE_REWRITE_COUNT = 24;

export const FAILED_SEQUENCES = Object.freeze([
  15, 16, 17, 18, 75, 76, 77, 90, 91, 96, 97, 98, 114, 115, 119, 120, 121,
  122, 123, 131, 132, 143, 236, 237, 245, 246, 250, 251, 252, 311, 312, 313, 323
]);

export const TECHNICAL_RETRY_SEQUENCES = Object.freeze([
  15, 16, 17, 18, 121, 122, 123, 236, 237
]);

const SAFE_DIRECTIONS = Object.freeze({
  75: 'small bright-yellow anthropomorphic farm duck, orange beak and webbed feet, green farm vest, red neckerchief, wicker seed basket, cheerful waddling storybook helper',
  76: 'young Hawaiian child adventurer, warm brown skin, long straight black hair, loose knee-length red dress with cream leaf motifs, flat sandals, handmade map and soft signal light; entirely age-appropriate problem-solving',
  77: 'small blue alien helper, oversized ears, dark oval eyes, rounded muzzle, four compact arms, plain red utility harness and harmless calibration beacon',
  90: 'original adult rhythm performer, medium-brown skin, shoulder-length dark curls, black stage jacket, white shirt, cropped black trousers, white socks, black loafers and plain fedora; no resemblance to any real person',
  91: 'original adult rhythm guard, dark skin, short curls, navy military-inspired stage coat with silver piping, black trousers, boots, plain brimmed hat and illuminated tempo baton; no resemblance to any real person',
  96: 'very short yellow cylindrical workshop helper, two large brown eyes, silver dual-lens goggles, plain blue overalls, black gloves and boots, small red calibration button',
  97: 'tall slim yellow cylindrical workshop helper, two attentive eyes, silver dual-lens goggles, plain blue overalls, black gloves and boots, compact unlettered clipboard',
  98: 'medium-height yellow cylindrical workshop helper, one large brown eye, single silver goggle, plain blue overalls, black gloves and boots, small brown four-string practice instrument',
  114: 'original adult seafaring rogue, sun-warmed skin, dark braided hair, thin moustache, tricorn, cream shirt, dark long coat, burgundy sash, trousers, boots, compass and sea chart; no actor likeness',
  115: 'tall white cartoon rabbit, very long ears, large blue eyes, red stage overalls, blue bow tie, yellow gloves, oversized brown shoes and unlettered clapperboard',
  119: 'compact chrome cybernetic spider, eight articulated legs, dark chassis, cyan sensor lenses, abstract cyan circuitry and harmless short-range alignment light',
  120: 'compact bronze cybernetic spider, eight articulated legs, dark chassis, amber sensor lenses, heat-shield plates and safe warm-orange inspection lamp with no flame',
  131: 'original hooded young adult mystical guardian, pale grey-violet skin, short dark-violet hair, indigo bodysuit, boots, belt, deep-purple cloak and harmless meditation crystal',
  132: 'original orange-skinned adult cosmic guardian, long auburn hair, green eyes, fully covered purple space suit, silver bracers, boots and harmless green star-light',
  143: 'original adult nocturnal city guardian, black cowl, opaque white lenses, matte-black and graphite armor, scalloped cape, utility belt, boots and blue forensic scanner; no emblem or actor likeness',
  245: 'original adult wizard student, messy dark hair, round spectacles, small lightning-shaped brow scar, fully covering black academic robe, white shirt, red-and-gold tie, dark trousers, shoes and wooden practice wand',
  246: 'original adult wizard scholar, warm brown skin, thick chestnut curls, focused brown eyes, fully covering black academic robe, white shirt, burgundy tie, practical shoes, practice wand and closed reference book',
  250: 'original adult nocturnal urban guardian, broad armored silhouette, black cowl, white lenses, graphite segmented suit, long black cape, utility belt and forensic tablet; no emblem or exact protected likeness',
  251: 'original adult colorful urban acrobat, pale skin, blonde twin ponytails, blue eyes, fully covering red-and-black tactical suit, short utility jacket, gloves, boots and soft foam training batons',
  252: 'original adult pale circus trickster, swept green hair, narrow expressive eyes, purple tailcoat, green waistcoat, striped trousers, gloves, shoes, blank cards and purple silk handkerchief',
  311: 'original adult space smuggler, tousled brown hair, alert eyes, cream shirt, black vest, navy trousers with red side stripe, utility belt, tall boots and navigation scanner; no actor likeness',
  312: 'original adult desert guardian, sandy-blond hair, blue eyes, cream tunic, tan belt, dark trousers, wrapped boots, short brown cloak and calm blue training light blade',
  313: 'original tall black-armored space sentinel, glossy domed helmet, triangular breathing grille, broad shoulders, chest control lights, long cape and slow red training light blade; no exact protected likeness',
  323: 'original adult dark gothic guardian, enclosed angular black helmet, heavy charcoal armor, weathered coat-cape, utility straps, boots, red forensic lamp and folded rescue line; no emblem or weapon'
});

const scriptPath = fileURLToPath(import.meta.url);
export const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const artifactRoot = path.join(projectRoot, 'docs', 'openai-generation-prompts-2026-08-25');
export const sourceBatchPath = path.join(artifactRoot, 'asset-batch-334-wave-4.json');
export const batchJsonPath = path.join(artifactRoot, 'asset-batch-33-wave-4-corrections.json');
export const promptDirectory = path.join(artifactRoot, 'asset-batch-33-wave-4-corrections');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const sameValues = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const technicalSequenceSet = new Set(TECHNICAL_RETRY_SEQUENCES);
const slugify = value => String(value || 'asset')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'asset';

const promptFileFor = (sequence, job, hash) => [
  'docs',
  'openai-generation-prompts-2026-08-25',
  'asset-batch-33-wave-4-corrections',
  String(sequence).padStart(3, '0') + '-hero-' + slugify(job.id).slice(0, 64) + '-safe-' + hash.slice(0, 8) + '.txt'
].join('/');

const buildSafePrompt = direction => [
  'Use case: stylized-concept',
  'Asset type: moderation-safe transparent production sprite sheet for a 2D canvas battle game',
  'Primary request: create one wholly original pixel-art character interpretation described only by this art direction: ' + direction + '. Do not imitate or reproduce any exact protected character design or real person.',
  'Creative identity: use a unique hand-illustrated face, proportions, costume details and silhouette derived only from the descriptive traits above.',
  'Style and medium: polished detailed 32-bit-era pixel art with crisp clusters, controlled highlights, clean dark outlines, readable full-body silhouettes and an original storybook-animation character design.',
  'Composition and framing: one square PNG arranged as exactly 4 columns x 4 rows, exactly sixteen equal isolated nonempty cells; one complete full-body pose centered in each cell; consistent elevated three-quarter side battle angle facing right, scale, proportions, pixel density and light direction.',
  'Animation plan: row 1 contains four calm identity-specific idle poses; row 2 contains four readable travel poses; row 3 contains four harmless practice or problem-solving poses with compact non-threatening light effects; row 4 contains four gentle balance-reset poses: notice, brace, soft step back and composed recovery.',
  'Continuity lock: keep exactly the same original physical traits, outfit colors and harmless props in every cell.',
  'Cell lock: each cell presents exactly one complete pose with head, feet, clothing, props and compact light effects comfortably inside its own boundaries and surrounded by transparent breathing room.',
  'Background and output lock: preserve genuine transparent alpha around every pose in a 32-bit RGBA PNG; a service fallback field may be a single flat edge-connected neutral color suitable for clean production normalization.',
  'Positive safety lock: wholesome, age appropriate and fully clothed presentation; calm practice or problem-solving only; no attack, injury, threat, gore, realistic weapon use or sexualization.',
  'Likeness lock: no real-person likeness and no protected exact likeness; keep the result visibly original while honoring only the descriptive art direction.',
  'Branding lock: an entirely unlettered image with plain costume surfaces, abstract unreadable geometric motifs and no text, logo, watermark, UI or copied key art.',
  'Output lock: one square source sheet prepared for production normalization to 1024 x 1024, yielding sixteen 256 x 256 cells with complete centered silhouettes.'
].join('\n');

const loadFrozenSource = async () => {
  const bytes = await fs.readFile(sourceBatchPath);
  assert(sha256(bytes) === SOURCE_BATCH_SHA256, 'Frozen Wave 4 source batch drifted');
  const source = JSON.parse(bytes.toString('utf8'));
  assert(source.batchId === SOURCE_BATCH_ID, 'Frozen Wave 4 source batch ID drifted');
  assert(Array.isArray(source.jobs) && source.jobs.length === 334, 'Frozen Wave 4 source job count drifted');
  assert(sha256(JSON.stringify(FAILED_SEQUENCES)) === FAILED_SEQUENCE_LIST_SHA256, 'Frozen failed sequence list drifted');
  return source;
};

const buildJob = (sourceJob, sequence) => {
  const technicalRetry = technicalSequenceSet.has(sourceJob.sequence);
  const direction = SAFE_DIRECTIONS[sourceJob.sequence];
  assert(technicalRetry || direction, 'Missing moderation-safe direction for Wave 4 sequence ' + sourceJob.sequence);
  const generationPrompt = technicalRetry ? sourceJob.generationPrompt : buildSafePrompt(direction);
  const generationPromptSha256 = sha256(Buffer.from(generationPrompt, 'utf8'));
  return {
    ...sourceJob,
    sequence,
    promptFile: promptFileFor(sequence, sourceJob, generationPromptSha256),
    generationPrompt,
    generationPromptSha256,
    selectionTier: technicalRetry ? 'wave-4-technical-retry' : 'wave-4-safe-original-moderation-rewrite',
    visualAnchor: technicalRetry
      ? sourceJob.visualAnchor
      : { physical: direction, outfit: 'fully clothed original design', role: 'moderation-safe original interpretation', equipment: 'harmless practice props only' },
    correctionReason: technicalRetry
      ? 'Exact prompt retry after a technical orchestration failure.'
      : 'Original non-resembling, fully clothed and harmless animation rewrite after moderation failure.',
    correctionOfBatchId: SOURCE_BATCH_ID,
    correctionOfSequence: sourceJob.sequence,
    correctionOfGenerationPromptSha256: sourceJob.generationPromptSha256
  };
};

export const createBatch = async () => {
  const source = await loadFrozenSource();
  const jobsBySequence = new Map(source.jobs.map(job => [job.sequence, job]));
  const jobs = FAILED_SEQUENCES.map((sourceSequence, index) => {
    const sourceJob = jobsBySequence.get(sourceSequence);
    assert(sourceJob, 'Frozen Wave 4 job is missing for sequence ' + sourceSequence);
    return buildJob(sourceJob, index + 1);
  });
  assert(jobs.length === JOB_COUNT, 'Wave 4 correction job count drifted');
  assert(new Set(jobs.map(job => job.kind + ':' + job.id)).size === JOB_COUNT, 'Wave 4 correction identities overlap');
  assert(new Set(jobs.map(job => job.output)).size === JOB_COUNT, 'Wave 4 correction outputs overlap');
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    kind: 'hero',
    promptCatalogSha256: source.promptCatalogSha256,
    sources: {
      wave4Batch: {
        path: 'docs/openai-generation-prompts-2026-08-25/asset-batch-334-wave-4.json',
        batchId: SOURCE_BATCH_ID,
        sha256: SOURCE_BATCH_SHA256
      }
    },
    correctionPolicy: [
      'select exactly the 33 terminal Wave 4 failures by frozen source sequence',
      'reuse the exact prompt only for the 9 technical orchestration failures',
      'replace the 24 moderation failures with original non-resembling, fully clothed and harmless descriptive prompts',
      'preserve every runtime identity, output path, frame contract and replace flag',
      'allow at most two OpenAI image calls per correction job and never substitute a different runtime identity'
    ],
    selectionHashes: { failedSequenceListSha256: FAILED_SEQUENCE_LIST_SHA256 },
    counts: {
      jobs: jobs.length,
      technicalRetries: jobs.filter(job => technicalSequenceSet.has(job.correctionOfSequence)).length,
      safeRewrites: jobs.filter(job => !technicalSequenceSet.has(job.correctionOfSequence)).length,
      replaceFalse: jobs.filter(job => !job.replace).length,
      replaceTrue: jobs.filter(job => job.replace).length
    },
    jobs
  };
};

export const validateBatchArtifact = async () => {
  const [source, artifact] = await Promise.all([
    loadFrozenSource(),
    fs.readFile(batchJsonPath, 'utf8').then(JSON.parse)
  ]);
  assert(artifact.schemaVersion === SCHEMA_VERSION, 'Wave 4 correction schema drifted');
  assert(artifact.batchId === BATCH_ID, 'Wave 4 correction batch ID drifted');
  assert(artifact.kind === 'hero', 'Wave 4 correction kind drifted');
  assert(artifact.sources?.wave4Batch?.sha256 === SOURCE_BATCH_SHA256, 'Wave 4 correction source hash drifted');
  assert(artifact.selectionHashes?.failedSequenceListSha256 === FAILED_SEQUENCE_LIST_SHA256, 'Wave 4 correction list hash drifted');
  assert(artifact.counts?.jobs === JOB_COUNT, 'Wave 4 correction count drifted');
  assert(artifact.counts?.technicalRetries === TECHNICAL_RETRY_COUNT, 'Wave 4 technical retry count drifted');
  assert(artifact.counts?.safeRewrites === SAFE_REWRITE_COUNT, 'Wave 4 safe rewrite count drifted');
  assert(artifact.counts?.replaceFalse === 22, 'Wave 4 correction replace=false count drifted');
  assert(artifact.counts?.replaceTrue === 11, 'Wave 4 correction replace=true count drifted');
  assert(Array.isArray(artifact.jobs) && artifact.jobs.length === JOB_COUNT, 'Wave 4 correction jobs drifted');
  assert(new Set(artifact.jobs.map(job => job.kind + ':' + job.id)).size === JOB_COUNT, 'Wave 4 correction artifact identities overlap');
  assert(new Set(artifact.jobs.map(job => job.output)).size === JOB_COUNT, 'Wave 4 correction artifact outputs overlap');
  const sourceBySequence = new Map(source.jobs.map(job => [job.sequence, job]));
  const promptFiles = (await fs.readdir(promptDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .sort();
  const expectedPromptFiles = artifact.jobs.map(job => path.basename(job.promptFile)).sort();
  assert(sameValues(promptFiles, expectedPromptFiles), 'Wave 4 correction prompt directory drifted');
  for (const [index, job] of artifact.jobs.entries()) {
    const sourceSequence = FAILED_SEQUENCES[index];
    const sourceJob = sourceBySequence.get(sourceSequence);
    assert(job.sequence === index + 1, 'Wave 4 correction sequence drifted at index ' + index);
    assert(job.correctionOfSequence === sourceSequence, 'Wave 4 correction source sequence drifted at index ' + index);
    assert(job.correctionOfBatchId === SOURCE_BATCH_ID, 'Wave 4 correction source batch drifted for ' + job.output);
    assert(job.correctionOfGenerationPromptSha256 === sourceJob.generationPromptSha256, 'Wave 4 original prompt hash drifted for ' + job.output);
    assert(job.id === sourceJob.id && job.kind === sourceJob.kind, 'Wave 4 correction identity drifted for sequence ' + sourceSequence);
    assert(job.output === sourceJob.output, 'Wave 4 correction output drifted for sequence ' + sourceSequence);
    assert(job.replace === sourceJob.replace, 'Wave 4 correction replace flag drifted for ' + job.output);
    assert(sameValues(job.frame, sourceJob.frame), 'Wave 4 correction frame contract drifted for ' + job.output);
    const bytes = await fs.readFile(path.resolve(projectRoot, ...job.promptFile.split('/')));
    assert(bytes.equals(Buffer.from(job.generationPrompt, 'utf8')), 'Wave 4 correction prompt file is not verbatim for ' + job.output);
    assert(sha256(bytes) === job.generationPromptSha256, 'Wave 4 correction prompt hash mismatch for ' + job.output);
    if (technicalSequenceSet.has(sourceSequence)) {
      assert(job.generationPrompt === sourceJob.generationPrompt, 'Technical retry prompt changed for ' + job.output);
      assert(job.selectionTier === 'wave-4-technical-retry', 'Technical retry tier drifted for ' + job.output);
    } else {
      assert(job.generationPrompt !== sourceJob.generationPrompt, 'Moderation-safe prompt was not rewritten for ' + job.output);
      assert(job.selectionTier === 'wave-4-safe-original-moderation-rewrite', 'Moderation-safe tier drifted for ' + job.output);
      assert(/exactly sixteen equal/iu.test(job.generationPrompt), 'Sixteen-cell lock missing for ' + job.output);
      assert(/genuine transparent alpha/iu.test(job.generationPrompt), 'Transparent-alpha lock missing for ' + job.output);
      assert(/no real-person likeness and no protected exact likeness/iu.test(job.generationPrompt), 'Likeness lock missing for ' + job.output);
      assert(/no attack, injury, threat, gore/iu.test(job.generationPrompt), 'Positive safety lock missing for ' + job.output);
      assert(!job.generationPrompt.includes(sourceJob.name), 'Protected source name leaked into safe prompt for ' + job.output);
      assert(!job.generationPrompt.includes(sourceJob.universe), 'Protected source universe leaked into safe prompt for ' + job.output);
    }
  }
  return artifact;
};

const writeBatchArtifact = async batch => {
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
