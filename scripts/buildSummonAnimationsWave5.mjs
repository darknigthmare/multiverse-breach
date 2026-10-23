import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave5-2026-10-20');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/summonAnimationsWave5.generated.json');
const PROVENANCE = path.resolve(DOCS, 'ifrit-provenance.json');
const PHASES = ['arrival', 'preparation', 'attack', 'recovery'];
const KEY = 'Final Fantasy VII::Ifrit::Hellfire';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);
const read = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
};

async function reviewFrames(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 1024);
  const allHashes = [], phaseReviews = [];
  for (let row = 0; row < 4; row++) {
    const frameHashes = [], visiblePixels = [];
    for (let column = 0; column < 4; column++) {
      const frame = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(frame, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${PHASES[row]}/${column}: visible crop`);
      }
      assert.ok(visible > 300); const digest = hash(frame); frameHashes.push(digest); allHashes.push(digest); visiblePixels.push(visible);
    }
    assert.equal(new Set(frameHashes).size, 4, `Repeated ${PHASES[row]} cell`);
    phaseReviews.push({ phase: PHASES[row], row, distinctFrames: 4, frameHashes, visiblePixels, transparentMarginPixels: 10 });
  }
  assert.equal(new Set(allHashes).size, 16);
  return { distinctCells: 16, phaseReviews };
}

async function archive(file, output) {
  const input = await exists(file) ? file : output;
  const bytes = await fs.readFile(input); await fs.mkdir(path.dirname(output), { recursive: true }); await fs.writeFile(output, bytes);
  return { file: output, archivedPath: relative(output), sha256: hash(bytes), bytes };
}

export async function checkSummonAnimationsWave5() {
  const manifest = await read(MANIFEST), provenance = await read(PROVENANCE);
  assert.equal(manifest.entries.length, 1); const entry = manifest.entries[0];
  assert.equal(entry.id, 'ifrit-ff7-hellfire'); assert.equal(entry.key, KEY);
  assert.equal(entry.universe, 'Final Fantasy VII'); assert.equal(entry.entityName, 'Ifrit'); assert.equal(entry.actionName, 'Hellfire');
  assert.equal(entry.rows, 4); assert.equal(entry.columns, 4); assert.equal(entry.frames, 16);
  assert.equal(entry.normalization.baseline, 244);
  const file = path.resolve(ROOT, `public${entry.sheet}`);
  assert.equal(hash(await fs.readFile(file)), entry.sha256); assert.equal((await sharp(file).metadata()).hasAlpha, true);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.referenceImage))), entry.referenceAssetSha256);
  assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
  assert.equal(entry.model, null); assert.equal(entry.generationId, null); assert.equal(entry.jobId, null);
  PHASES.forEach((phase, row) => { assert.equal(entry.phases[phase].row, row); assert.equal(entry.phases[phase].frames, 4); assert.equal(entry.phases[phase].loop, false); });
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.promptFile))), source.promptSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.referenceImage))), source.referencedSourceSha256);
  }
  const review = await reviewFrames(file); assert.deepEqual(review.phaseReviews, entry.visualValidation.phaseReviews);
  return { summons: 1, frames: 16, phases: 4, alphaAndMargins: true, distinctNativeCells: true, actualNativeSources: provenance.sources.length, sourceHashes: true };
}

export async function buildSummonAnimationsWave5() {
  const previous = await read(PROVENANCE, {});
  const record = await read(path.resolve(ROOT, '.tmp/combat-fidelity-wave5-ifrit-generation.json'), previous.generationRecord);
  assert.equal(record?.id, 'ifrit-ff7-hellfire'); assert.equal(record.key, KEY);
  await fs.mkdir(DOCS, { recursive: true });
  const source = await archive(record.file, path.resolve(DOCS, 'ifrit-source.png'));
  const reference = await archive(path.resolve(ROOT, `public${record.referenceAsset}`), path.resolve(DOCS, 'ifrit-reference.png'));
  const promptFile = path.resolve(DOCS, 'ifrit-prompt.txt'); await fs.writeFile(promptFile, record.prompt);
  const atlas = await segmentAtlas(source.file, 4);
  const composites = [], normalizedRows = [];
  for (let row = 0; row < 4; row++) {
    assert.equal(atlas.rows[row].seamReview.crossedOpaquePixels, 0);
    const normalized = await normalizeRow(atlas.rows[row]);
    composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
    normalizedRows.push({ phase: PHASES[row], sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceRow: row,
      sourceBounds: atlas.rows[row].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
      frameBounds: normalized.frameBounds, ...atlas.rows[row].seamReview });
  }
  const bytes = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites).png({ compressionLevel: 9 }).toBuffer();
  const sheet = '/sprites/generated/summon-animations-wave5/ifrit.png';
  const file = path.resolve(ROOT, `public${sheet}`); await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
  const review = await reviewFrames(file);
  await sharp(bytes).resize(768, 768, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png().toFile(path.resolve(DOCS, 'ifrit-contact.png'));
  const entry = { id: record.id, key: KEY, universe: record.universe, entityName: record.entityName, actionName: record.actionName,
    sourceHeroId: 'cloud_ff7', sheet, width: 1024, height: 1024, frameWidth: 256, frameHeight: 256, columns: 4, rows: 4, frames: 16,
    phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: 8, loop: false }])),
    sha256: hash(bytes), alpha: true, assetMissing: false, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceDimensions: [atlas.width, atlas.height],
    referenceAsset: record.referenceAsset, referenceImage: reference.archivedPath, referenceAssetSha256: reference.sha256,
    sourceWork: record.sourceWork, sourceReference: record.sourceReference,
    provider: 'OpenAI', model: null, generationId: null, jobId: null, canonicalVerified: false, canon1to1Verified: false, networkVerified: false,
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows: normalizedRows },
    visualValidation: { identityReviewed: true, allFramesReviewed: true, fullBodyAndHornsContained: true, clawsAndManeReviewed: true,
      originalGameVersion: 'Final Fantasy VII (1997)', noFinalFantasyXIVOrXVIRedesign: true, defaultFacing: 'right', ...review,
      canon1to1Verified: false, networkVerified: false, adaptedChoreography: true,
      notes: 'Sixteen genuine native drawings of the red-brown horned, dark-maned FFVII Ifrit interpretation. Preparation opens the glowing mouth; attack emits a contained fire breath/flame-wave; recovery lowers the body. No official source-game frame fidelity, punch-only Hellfire replacement or extra gameplay hit is claimed.' } };
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries: [entry] });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-20', provider: 'OpenAI', model: null, generationId: null, jobId: null,
    generationRecord: record, networkVerified: false, canon1to1Verified: false,
    method: 'One actual new native image_gen summon atlas referenced to the existing four-pose Ifrit design. Sharp only segments alpha-separated genuine poses, normalizes shared scale/baseline per phase and packs the delivered PNG. All earlier sources and the original four-frame Ifrit PNG remain unchanged.',
    sources: [{ id: record.id, archivedPath: source.archivedPath, sha256: source.sha256, originalGeneratedPath: record.file,
      prompt: record.prompt, promptFile: relative(promptFile), promptSha256: hash(Buffer.from(record.prompt)),
      referenceImage: reference.archivedPath, referencedSourceSha256: reference.sha256, provider: 'OpenAI', model: null,
      generationId: null, jobId: null, operation: 'native-imagegen-summon', accepted: true }], entries: [entry] });
  return checkSummonAnimationsWave5();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkSummonAnimationsWave5() : buildSummonAnimationsWave5())));
}
