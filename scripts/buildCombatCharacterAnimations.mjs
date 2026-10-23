import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-2026-10-18');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterAnimations.generated.json');
const PROVENANCE = path.resolve(DOCS, 'character-animation-provenance.json');
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const EXPECTED = ['cloud_ff7', 'tifa_ff7', 'aerith_ff7', 'barret_ff7', 'goku_dbz', 'vegeta_dbz', 'naruto_six_paths', 'sasuke_rinnegan'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const exists = file => fs.access(file).then(() => true, () => false);
const read = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
};
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);

async function frameReview(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048);
  const frameHashes = [], rows = [];
  for (let row = 0; row < 8; row++) {
    const rowHashes = [];
    for (let column = 0; column < 4; column++) {
      const rgba = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha > 0) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${file}: visible crop at ${row}/${column}`);
      }
      assert.ok(visible > 300, `${file}: empty phase ${PHASES[row]}`);
      const digest = hash(rgba); rowHashes.push(digest); frameHashes.push(digest);
    }
    assert.equal(new Set(rowHashes).size, 4, `${file}: repeated native frame in ${PHASES[row]}`);
    rows.push({ phase: PHASES[row], distinctFrames: 4, frameHashes: rowHashes });
  }
  return { distinctCells: new Set(frameHashes).size, phaseReviews: rows };
}

export async function checkCombatCharacterAnimations() {
  const manifest = await read(MANIFEST);
  const provenance = await read(PROVENANCE);
  assert.equal(manifest.entries.length, 8);
  assert.deepEqual([...manifest.entries.map(entry => entry.heroId)].sort(), [...EXPECTED].sort());
  for (const entry of manifest.entries) {
    assert.equal(HEROES_DB.find(hero => hero.id === entry.heroId)?.universe, entry.universe, entry.heroId);
    const file = path.resolve(ROOT, `public${entry.sheet}`);
    assert.equal(hash(await fs.readFile(file)), entry.sha256, entry.heroId);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, `public${entry.referenceAsset}`))), entry.referenceAssetSha256);
    assert.equal((await sharp(file).metadata()).hasAlpha, true);
    await frameReview(file);
    PHASES.forEach((phase, row) => { assert.equal(entry.phases[phase].row, row); assert.equal(entry.phases[phase].frames, 4); });
    assert.equal(entry.visualValidation.canon1to1Verified, false);
  }
  assert.ok(provenance.sources.length >= 8);
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null);
  }
  return { heroes: 8, phases: 64, frames: 256, alphaAndMargins: true, sourceHashes: true, fourDistinctFramesPerPhase: true };
}

export async function buildCombatCharacterAnimations() {
  const previous = await read(PROVENANCE, {});
  const records = await read(path.resolve(ROOT, '.tmp/combat-fidelity-character-generation.json'), previous.generationRecords);
  assert.equal(records?.length, 8, 'Eight actual native image generation records are required');
  await fs.mkdir(path.resolve(DOCS, 'character-animation-sources'), { recursive: true });
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId);
    const hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(record.universe, hero.universe);
    const chosen = record.correction?.file || record.file;
    const input = await exists(chosen) ? chosen : path.resolve(DOCS, 'character-animation-sources', `${heroId}.png`);
    const sourceBytes = await fs.readFile(input);
    const archived = path.resolve(DOCS, 'character-animation-sources', `${heroId}.png`);
    await fs.writeFile(archived, sourceBytes);
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const referenceAssetSha256 = hash(await fs.readFile(path.resolve(ROOT, `public${referenceAsset}`)));
    let originalSourceImage = null, originalSourceImageSha256 = null;
    if (record.correction) {
      const originalArchive = path.resolve(DOCS, 'character-animation-sources', `${heroId}-original.png`);
      const originalInput = await exists(record.file) ? record.file : originalArchive;
      const originalBytes = await fs.readFile(originalInput);
      await fs.writeFile(originalArchive, originalBytes);
      originalSourceImage = relative(originalArchive); originalSourceImageSha256 = hash(originalBytes);
      sources.push({ heroId, file: record.file, archivedPath: originalSourceImage, sha256: originalSourceImageSha256, prompt: record.prompt,
        referenceAsset, referenceAssetSha256, provider: 'OpenAI', model: null, generationId: null, operation: 'native-imagegen',
        accepted: !!record.correction.rows, usage: record.correction.rows ? 'preserved-native-phase-rows' : 'superseded-native-source',
        sourceRowsUsed: record.correction.rows ? PHASES.map((_, row) => row).filter(row => !record.correction.rows.includes(row)) : [],
        reason: record.correction.reason, supersededBy: relative(archived) });
    }
    sources.push({ ...record, file: chosen, prompt: record.correction?.prompt || record.prompt,
      archivedPath: relative(archived), sha256: hash(sourceBytes), referenceAsset, referenceAssetSha256,
      referencedImage: record.correction?.referencedImage || referenceAsset,
      referencedSourceSha256: originalSourceImageSha256 || referenceAssetSha256,
      provider: 'OpenAI', model: null, generationId: null, operation: record.correction ? 'native-imagegen-correction' : 'native-imagegen', originalGeneratedPath: chosen, accepted: true,
      sourceRowsUsed: record.correction?.rows || PHASES.map((_, row) => row) });
    const atlas = await segmentAtlas(input, 8);
    const preservedAtlas = record.correction?.rows ? await segmentAtlas(path.resolve(ROOT, originalSourceImage), 8) : null;
    const composites = [], normalizedRows = [];
    for (let row = 0; row < 8; row++) {
      const preserveOriginal = preservedAtlas && !record.correction.rows.includes(row);
      const rowSource = preserveOriginal ? preservedAtlas : atlas;
      const normalized = await normalizeRow(rowSource.rows[row]);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      normalizedRows.push({ phase: PHASES[row], sourceImage: preserveOriginal ? originalSourceImage : relative(archived),
        sourceImageSha256: preserveOriginal ? originalSourceImageSha256 : hash(sourceBytes), sourceRow: row,
        sourceBounds: rowSource.rows[row].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...rowSource.rows[row].seamReview });
    }
    const output = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const sheet = `/sprites/generated/combat-character-animations/${heroId}.png`;
    const file = path.resolve(ROOT, `public${sheet}`);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, output);
    const review = await frameReview(file);
    await sharp(output).resize(512, 1024, { kernel: sharp.kernel.nearest })
      .flatten({ background: '#131927' }).png()
      .toFile(path.resolve(DOCS, `character-animation-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, columns: 4, rows: 8, frames: 32,
      phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: phase === 'super' || phase === 'fatality' ? 12 : 8, loop: false }])),
      sha256: hash(output), alpha: true, sourceImage: relative(archived), sourceImageSha256: hash(sourceBytes), sourceDimensions: [atlas.width, atlas.height],
      referenceAsset, referenceAssetSha256, sourceWork: record.sourceWork, sourceReference: record.ability,
      originalSourceImage, originalSourceImageSha256, nativeCorrection: !!record.correction,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows: normalizedRows },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...review,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, fatalityIsExecution: false,
        notes: heroId === 'aerith_ff7' ? 'Great Gospel remains a healing/protective sequence, including the adapted finale; no damaging staff finisher is invented.'
          : heroId === 'barret_ff7' ? 'Catastrophe native correction uses takeoff, hover with cannon aimed down-right, descending energy and landing. Only finale/super rows use the correction; all other six original native rows are preserved. Independent visual review noted a small detached orange VFX fragment above-right of the third finale pose; it is present in the unaltered native source, remains inside its frame and is retained without raster repainting.'
          : heroId === 'sasuke_rinnegan' ? 'Indra’s Arrow uses the native illustrated violet Susanoo archer manifestation; Sasuke holds no invented physical bow.'
            : 'Original local costume and version retained; eight purpose-drawn sequences are gameplay adaptations, not certified source-game frames.' }
    });
  }
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', model: null, generationId: null,
    method: 'Actual native image_gen artwork conditioned with Sharp alpha segmentation, shared row scale and baseline. No procedural substitute frames, pasted aliases or repeated tiles are generated.',
    networkVerified: false, canon1to1Verified: false, generationRecords: records, sources, entries });
  return checkCombatCharacterAnimations();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterAnimations() : buildCombatCharacterAnimations())));
}
