import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave4-2026-10-18');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterFormsWave4.generated.json');
const PROVENANCE = path.resolve(DOCS, 'chaos-provenance.json');
const STATES = ['idle', 'run', 'attack', 'hit'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);

async function reviewFrames(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 1024);
  const allHashes = [], stateReviews = [];
  for (let row = 0; row < 4; row++) {
    const frameHashes = [], visiblePixels = [];
    for (let column = 0; column < 4; column++) {
      const frame = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(frame, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${STATES[row]}/${column}: visible crop`);
      }
      assert.ok(visible > 300); const digest = hash(frame); frameHashes.push(digest); allHashes.push(digest); visiblePixels.push(visible);
    }
    assert.equal(new Set(frameHashes).size, 4, `Repeated ${STATES[row]} cell`);
    stateReviews.push({ state: STATES[row], row, distinctFrames: 4, frameHashes, visiblePixels, transparentMarginPixels: 10 });
  }
  assert.equal(new Set(allHashes).size, 16);
  return { distinctCells: 16, stateReviews };
}

export async function checkCombatCharacterFormsWave4() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  const provenance = JSON.parse(await fs.readFile(PROVENANCE, 'utf8'));
  assert.equal(manifest.entries.length, 1); const entry = manifest.entries[0];
  assert.equal(entry.id, 'vincent-chaos'); assert.equal(entry.heroId, 'vincent_ff7');
  assert.equal(entry.universe, HEROES_DB.find(hero => hero.id === 'vincent_ff7').universe);
  assert.equal(entry.rows, 4); assert.equal(entry.columns, 4); assert.equal(entry.frames, 16);
  assert.equal(entry.normalization.baseline, 244);
  const file = path.resolve(ROOT, `public${entry.sheet}`);
  assert.equal(hash(await fs.readFile(file)), entry.sha256);
  assert.equal((await sharp(file).metadata()).hasAlpha, true);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.referenceImage))), entry.referenceAssetSha256);
  assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
  assert.equal(entry.model, null); assert.equal(entry.generationId, null);
  STATES.forEach((state, row) => { assert.equal(entry.states[state].row, row); assert.equal(entry.states[state].frames, 4); });
  assert.deepEqual(provenance.generationRecord.referencedImages, []);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, provenance.sources[0].archivedPath))), provenance.sources[0].sha256);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, provenance.sources[0].promptFile))), provenance.sources[0].promptSha256);
  const review = await reviewFrames(file);
  assert.deepEqual(review.stateReviews, entry.visualValidation.stateReviews);
  return { forms: 1, frames: 16, states: 4, alphaAndMargins: true, distinctNativeCells: true, actualNativeSources: 1, sourceHashes: true };
}

export async function buildCombatCharacterFormsWave4() {
  const previous = await fs.readFile(PROVENANCE, 'utf8').then(JSON.parse, () => null);
  const record = await fs.readFile(path.resolve(ROOT, '.tmp/combat-fidelity-wave4-chaos-generation.json'), 'utf8')
    .then(JSON.parse, () => previous?.generationRecord);
  assert.equal(record?.heroId, 'vincent_ff7'); assert.equal(record.id, 'vincent-chaos');
  await fs.mkdir(DOCS, { recursive: true });
  const sourcePath = path.resolve(DOCS, 'chaos-source.png');
  const input = await exists(record.file) ? record.file : sourcePath;
  const sourceBytes = await fs.readFile(input); await fs.writeFile(sourcePath, sourceBytes);
  const contextPath = path.resolve(DOCS, 'chaos-context-vincent-reference.png');
  const contextInput = await exists(record.contextReference) ? record.contextReference : contextPath;
  const contextBytes = await fs.readFile(contextInput); await fs.writeFile(contextPath, contextBytes);
  const promptPath = path.resolve(DOCS, 'chaos-prompt.txt'); await fs.writeFile(promptPath, record.prompt);
  const atlas = await segmentAtlas(sourcePath, 4);
  const composites = [], normalizedRows = [];
  for (let row = 0; row < 4; row++) {
    assert.equal(atlas.rows[row].seamReview.crossedOpaquePixels, 0);
    const normalized = await normalizeRow(atlas.rows[row]);
    composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
    normalizedRows.push({ state: STATES[row], sourceImage: relative(sourcePath), sourceImageSha256: hash(sourceBytes), sourceRow: row,
      sourceBounds: atlas.rows[row].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
      frameBounds: normalized.frameBounds, ...atlas.rows[row].seamReview });
  }
  const bytes = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites).png({ compressionLevel: 9 }).toBuffer();
  const sheet = '/sprites/generated/combat-character-forms-wave4/vincent-chaos.png';
  const file = path.resolve(ROOT, `public${sheet}`); await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
  const review = await reviewFrames(file);
  await sharp(bytes).resize(768, 768, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png().toFile(path.resolve(DOCS, 'chaos-contact.png'));
  const entry = { id: 'vincent-chaos', heroId: 'vincent_ff7', universe: 'Final Fantasy VII', name: 'Chaos', sheet,
    width: 1024, height: 1024, frameWidth: 256, frameHeight: 256, columns: 4, rows: 4, frames: 16,
    states: Object.fromEntries(STATES.map((state, row) => [state, { row, frames: 4, columns: 4, fps: state === 'run' ? 10 : 8, loop: state === 'idle' || state === 'run' }])),
    sha256: hash(bytes), alpha: true, sourceImage: relative(sourcePath), sourceImageSha256: hash(sourceBytes), sourceDimensions: [atlas.width, atlas.height],
    referenceAsset: '/sprites/generated/heroes/final-fantasy-vii/vincent-ff7.png', referenceImage: relative(contextPath), referenceAssetSha256: hash(contextBytes),
    referenceUsage: 'The local human Vincent bitmap was inspected as continuity context only. No reference image was passed to this brand-new Chaos image_gen call; its original1997 demon silhouette was specified in the prompt.',
    sourceWork: record.sourceWork, sourceReference: record.sourceReference, formAttackName: 'Chaos Saber', abilityName: 'Chaos',
    provider: 'OpenAI', model: null, generationId: null, jobId: null, canonicalVerified: false, canon1to1Verified: false, networkVerified: false,
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerState: true, baseline: 244, rows: normalizedRows },
    visualValidation: { identityReviewed: true, allFramesReviewed: true, wingsFullyContained: true, demonBodyRatherThanHumanOverlay: true,
      originalGameVersion: 'Final Fantasy VII (1997)', noDirgeOfCerberusWeaponOrCostume: true, defaultFacing: 'right', ...review,
      canon1to1Verified: false, networkVerified: false, adaptedChoreography: true,
      notes: 'Classical bald horned dark demon with hoof-like feet, unarmed claws and complete red-brown bat wings. No human Vincent costume, pistol, cape or technological Dirge redesign. The attack row is an adapted Chaos Saber claw-sweep motif; no separate Killmove technique, Satan/Stan Slam or instant-death gameplay is invented.' } };
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries: [entry] });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', model: null, generationId: null, jobId: null,
    generationRecord: record, networkVerified: false, canon1to1Verified: false,
    method: 'One actual new native image_gen creature atlas with no reference-image input. Sharp only extracts alpha-separated genuine poses, normalizes shared scale/baseline per state and packs the delivered PNG.',
    sources: [{ id: 'vincent-chaos', archivedPath: relative(sourcePath), sha256: hash(sourceBytes), originalGeneratedPath: record.file,
      prompt: record.prompt, promptFile: relative(promptPath), promptSha256: hash(Buffer.from(record.prompt)), referencedImages: [],
      reviewedContextImage: relative(contextPath), reviewedContextImageSha256: hash(contextBytes), provider: 'OpenAI', model: null,
      generationId: null, jobId: null, operation: 'native-imagegen-new-form', accepted: true }], entries: [entry] });
  return checkCombatCharacterFormsWave4();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterFormsWave4() : buildCombatCharacterFormsWave4())));
}
