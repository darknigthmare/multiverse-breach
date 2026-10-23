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
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterSpriteCorrectionsWave4.generated.json');
const PROVENANCE = path.resolve(DOCS, 'base-provenance.json');
const EXPECTED = ['redxiii_ff7', 'vincent_ff7'];
const STATES = ['idle', 'run', 'attack', 'hit'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);

async function archive(file, output) {
  const bytes = await fs.readFile(await exists(file) ? file : output);
  await fs.mkdir(path.dirname(output), { recursive: true }); await fs.writeFile(output, bytes);
  return { input: output, path: relative(output), sha256: hash(bytes) };
}

async function review(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 1024);
  const all = [], stateReviews = [];
  for (let row = 0; row < 4; row++) {
    const frameHashes = [];
    for (let column = 0; column < 4; column++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${file}/${row}/${column}: visible crop`);
      }
      assert.ok(visible > 300); const digest = hash(rgba); frameHashes.push(digest); all.push(digest);
    }
    assert.equal(new Set(frameHashes).size, 4);
    stateReviews.push({ state: STATES[row], row, distinctFrames: 4, frameHashes, transparentMarginPixels: 10 });
  }
  assert.equal(new Set(all).size, 16); return { distinctCells: 16, stateReviews };
}

export async function checkCombatCharacterSpriteCorrectionsWave4() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  const provenance = JSON.parse(await fs.readFile(PROVENANCE, 'utf8'));
  assert.deepEqual(manifest.entries.map(entry => entry.heroId), EXPECTED);
  for (const entry of manifest.entries) {
    assert.equal(HEROES_DB.find(hero => hero.id === entry.heroId)?.universe, entry.universe);
    assert.equal(entry.columns, 4); assert.equal(entry.rows, 4); assert.equal(entry.frames, 16); assert.equal(entry.normalization.baseline, 244);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, `public${entry.sheet}`))), entry.sha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.referenceImage))), entry.referenceAssetSha256);
    STATES.forEach((state, row) => { assert.equal(entry.states[state].row, row); assert.equal(entry.states[state].frames, 4); });
    assert.equal(entry.model, null); assert.equal(entry.generationId, null);
    assert.equal(entry.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    const pixels = await review(path.resolve(ROOT, `public${entry.sheet}`));
    assert.deepEqual(pixels.stateReviews, entry.visualValidation.stateReviews);
    for (const reference of entry.nativeReferences) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.path))), reference.sha256);
  }
  assert.equal(provenance.sources.length, 3); assert.equal(provenance.sources.filter(source => source.accepted).length, 2);
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null);
    for (const reference of source.referencedImages) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.path))), reference.sha256);
    if (!source.accepted) assert.ok(source.reason.length > 60);
  }
  return { heroes: 2, states: 8, frames: 32, alphaAndMargins: true, actualNativeSources: 3, activeNativeSources: 2, sourceHashes: true };
}

export async function buildCombatCharacterSpriteCorrectionsWave4() {
  const previous = await fs.readFile(PROVENANCE, 'utf8').then(JSON.parse, () => null);
  const records = await fs.readFile(path.resolve(ROOT, '.tmp/combat-fidelity-wave4-base-generation.json'), 'utf8')
    .then(JSON.parse, () => previous?.generationRecords);
  assert.equal(records?.length, 2); await fs.mkdir(DOCS, { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId), hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(record.universe, hero.universe);
    const source = await archive(record.file, path.resolve(DOCS, 'base-sources', `${heroId}.png`));
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const reference = await archive(path.resolve(ROOT, `public${referenceAsset}`), path.resolve(DOCS, 'base-sources', `${heroId}-previous-reference.png`));
    const nativeReferences = [];
    for (const [index, file] of record.referenceImages.entries()) {
      nativeReferences.push(await archive(file, path.resolve(DOCS, 'base-sources', `${heroId}-generation-reference-${index + 1}.png`)));
    }
    sources.push({ heroId, archivedPath: source.path, sha256: source.sha256, originalGeneratedPath: record.file,
      prompt: record.prompt, referencedImages: nativeReferences.map(({ path: file, sha256 }) => ({ path: file, sha256 })),
      provider: 'OpenAI', model: null, generationId: null, jobId: null, operation: 'native-imagegen', accepted: true });
    for (const [index, attempt] of (record.unusedAttempts || []).entries()) {
      const unused = await archive(attempt.file, path.resolve(DOCS, 'base-sources', `${heroId}-unused-attempt-${index + 1}.png`));
      const attemptReference = await archive(attempt.referencedImage, path.resolve(DOCS, 'base-sources', `${heroId}-unused-attempt-${index + 1}-reference.png`));
      sources.push({ heroId, archivedPath: unused.path, sha256: unused.sha256, originalGeneratedPath: attempt.file,
        prompt: attempt.prompt, referencedImages: [{ path: attemptReference.path, sha256: attemptReference.sha256 }],
        provider: 'OpenAI', model: null, generationId: null, jobId: null, operation: 'native-imagegen-edit', accepted: false, reason: attempt.reason });
    }
    const atlas = await segmentAtlas(source.input, 4), composites = [], normalizedRows = [];
    for (let row = 0; row < 4; row++) {
      assert.equal(atlas.rows[row].seamReview.crossedOpaquePixels, 0);
      const normalized = await normalizeRow(atlas.rows[row]); composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      normalizedRows.push({ state: STATES[row], sourceImage: source.path, sourceImageSha256: source.sha256, sourceRow: row,
        sourceBounds: atlas.rows[row].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...atlas.rows[row].seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const sheet = `/sprites/generated/combat-character-corrections-wave4/${heroId}.png`, file = path.resolve(ROOT, `public${sheet}`);
    await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
    const pixels = await review(file);
    await sharp(bytes).resize(768, 768, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png().toFile(path.resolve(DOCS, `base-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet, width: 1024, height: 1024,
      frameWidth: 256, frameHeight: 256, columns: 4, rows: 4, frames: 16,
      states: Object.fromEntries(STATES.map((state, row) => [state, { row, frames: 4, columns: 4, fps: state === 'run' ? 10 : 8, loop: state === 'idle' || state === 'run' }])),
      sha256: hash(bytes), alpha: true, sourceImage: source.path, sourceImageSha256: source.sha256, sourceDimensions: [atlas.width, atlas.height],
      referenceAsset, referenceImage: reference.path, referenceAssetSha256: reference.sha256,
      nativeReferences: nativeReferences.map(({ path: ref, sha256 }) => ({ path: ref, sha256 })),
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, identityCorrection: record.identityCorrection,
      provider: 'OpenAI', model: null, generationId: null, jobId: null, canonicalVerified: false, canon1to1Verified: false, networkVerified: false,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerState: true, baseline: 244, rows: normalizedRows },
      visualValidation: { allFramesReviewed: true, identityReviewed: true, defaultFacing: 'right', ...pixels,
        quadruped: heroId === 'redxiii_ff7', tailFlameContained: heroId === 'redxiii_ff7',
        ...(heroId === 'vincent_ff7' ? { humanFormOnly: true, weaponHand: 'right', clawHand: 'left', goldClawFree: true } : {}),
        networkVerified: false, canon1to1Verified: false, notes: `${record.sourceReference} ${record.identityCorrection} No official source-game frames or certified1:1 appearance is claimed.` } });
  }
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', model: null, generationId: null, jobId: null,
    networkVerified: false, canon1to1Verified: false, generationRecords: records, sources, entries,
    method: 'Two new native4×4 base atlases; one additional native cleanup attempt is archived but unused after actual alpha inspection showed it was unnecessary. Sharp only extracts and uniformly scales genuine poses per state; no new poses, artistic replacements or raster mirroring are synthesized.' });
  return checkCombatCharacterSpriteCorrectionsWave4();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterSpriteCorrectionsWave4() : buildCombatCharacterSpriteCorrectionsWave4())));
}
