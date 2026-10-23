import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave8-2026-10-20');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterSpriteCorrectionsWave8PartA.generated.json');
const PROVENANCE = path.resolve(DOCS, 'base-part-a-provenance.json');
const PLANNED = ['robin_tt', 'cyborg_tt', 'raven_tt', 'starfire_tt', 'beast_boy_tt'];
const EXPECTED = ['cyborg_tt', 'beast_boy_tt'];
const BLOCKED = ['robin_tt', 'raven_tt', 'starfire_tt'];
const STATES = ['idle', 'run', 'attack', 'hit'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);

const BODY_MEASUREMENTS_BY_HERO = JSON.parse(await fs.readFile(path.resolve(DOCS, 'base-part-a-stature-measurements.json'), 'utf8'));
const round = value => Math.round(value * 1e6) / 1e6;
function applyStature(entry) {
  const measurements = BODY_MEASUREMENTS_BY_HERO[entry.heroId];
  assert.ok(measurements, `Missing explicit body calibration for ${entry.heroId}`);
  const reference = entry.normalization.rows[0];
  const referenceBodyHeight = measurements.referenceBodyBounds[3];
  const nativeReferenceBodyHeight = measurements.nativeReferenceRowBodyBounds[3];
  const referenceRenderScale = measurements.calibrationTargetBodyHeight / referenceBodyHeight;
  for (const row of entry.normalization.rows) {
    const measured = measurements.rows[row.state], normalizedBodyHeight = measured.bodyBounds[3];
    const nativeComparableBodyHeight = measured.nativeRowBodyBounds[3];
    const expectedBodyHeight = referenceBodyHeight * referenceRenderScale * nativeComparableBodyHeight / nativeReferenceBodyHeight;
    row.renderScale = round(expectedBodyHeight / normalizedBodyHeight);
    assert.ok(row.renderScale >= .5 && row.renderScale <= 3);
    const absolute = (bounds, source) => [bounds[0], bounds[1] + source.sourceBounds.top, bounds[2], bounds[3]];
    row.statureReview = { referencePhase: 'idle', referenceState: 'idle', referenceColumn: measurements.referenceColumn, sourceComparableColumn: measured.column,
      referenceBodyHeight, normalizedBodyHeight, nativeReferenceBodyHeight, nativeComparableBodyHeight, referenceRenderScale,
      referenceRenderedBodyHeight: measurements.calibrationTargetBodyHeight, calibrationTargetBodyHeight: measurements.calibrationTargetBodyHeight,
      bodyBounds: measured.bodyBounds, referenceBodyBounds: measurements.referenceBodyBounds,
      nativeBodyBounds: absolute(measured.nativeRowBodyBounds, row), nativeReferenceBodyBounds: absolute(measurements.nativeReferenceRowBodyBounds, reference),
      nativeSourceImage: row.sourceImage, nativeSourceImageSha256: row.sourceImageSha256,
      nativeReferenceSourceImage: reference.sourceImage, nativeReferenceSourceImageSha256: reference.sourceImageSha256,
      measurementKind: 'visual-body-roi', excludesWeaponEffects: true, visualRoiApproximation: true,
      expectedBodyHeight: round(expectedBodyHeight), correctedBodyHeight: round(normalizedBodyHeight * row.renderScale),
      ratioFormula: '(referenceBodyHeight / normalizedBodyHeight) * (nativeComparableBodyHeight / nativeReferenceBodyHeight) * (referenceRenderScale ?? 1)',
      sourceDensityCalibration: { kind: 'independent-native-source-standing-body', targetPresentationBodyHeight: measurements.calibrationTargetBodyHeight,
        note: measurements.sourceDensityNote },
      posturePreserved: true, scaleAroundBaseline: 244, changesBitmap: false, source1to1Verified: false, reason: measurements.reason, bodyForm: measurements.bodyForm };
  }
  entry.normalization.renderScaleMethod = 'explicit-visual-body-roi-with-native-posture-ratio-v1';
  entry.normalization.renderScaleDoesNotModifyBitmap = true;
  entry.visualValidation.statureScaleReviewed = true;
  return entry;
}
const statureReview = entries => entries.flatMap(entry => entry.normalization.rows.map(row => ({ heroId: entry.heroId, state: row.state, renderScale: row.renderScale, ...row.statureReview })));

export async function updateCombatCharacterSpriteCorrectionsWave8PartAStature() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  const provenance = JSON.parse(await fs.readFile(PROVENANCE, 'utf8'));
  manifest.entries.forEach(applyStature); provenance.entries = manifest.entries;
  provenance.statureReview = statureReview(manifest.entries);
  await write(MANIFEST, manifest); await write(PROVENANCE, provenance);
  await write(path.resolve(DOCS, 'base-part-a-stature-review.json'), provenance.statureReview);
  return checkCombatCharacterSpriteCorrectionsWave8PartA();
}

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

export async function checkCombatCharacterSpriteCorrectionsWave8PartA() {
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
    const expected = applyStature(structuredClone(entry));
    assert.deepEqual(entry.normalization.rows, expected.normalization.rows);
    entry.normalization.rows.forEach(row => assert.ok(Math.abs(row.statureReview.correctedBodyHeight - row.statureReview.expectedBodyHeight) < 0.001));
    for (const reference of entry.nativeReferences) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.path))), reference.sha256);
  }
  assert.equal(provenance.sources.filter(source => source.accepted).length, 2);
  assert.deepEqual(manifest.missingVisualHeroIds, BLOCKED);
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.promptFile))), source.promptSha256);
    for (const reference of source.referencedImages) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.path))), reference.sha256);
    if (!source.accepted) assert.ok(source.reason.length > 60);
  }
  assert.deepEqual(provenance.statureReview, statureReview(manifest.entries));
  return { heroes: 2, states: 8, frames: 32, missingVisualHeroIds: BLOCKED, alphaAndMargins: true, actualNativeSources: provenance.sources.length, activeNativeSources: 2, sourceHashes: true }; 
}

export async function buildCombatCharacterSpriteCorrectionsWave8PartA() {
  const previous = await fs.readFile(PROVENANCE, 'utf8').then(JSON.parse, () => null);
  const records = await fs.readFile(path.resolve(ROOT, '.tmp/combat-fidelity-wave8-base-part-a-generation.json'), 'utf8')
    .then(JSON.parse, () => previous?.generationRecords);
  assert.equal(records?.length, 2); await fs.mkdir(DOCS, { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId), hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(record.universe, hero.universe);
    const original = await archive(record.file, path.resolve(DOCS, 'base-part-a-sources', `${heroId}.png`));
    const source = record.correction ? await archive(record.correction.file, path.resolve(DOCS, 'base-part-a-sources', `${heroId}-corrected.png`)) : original;
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const reference = await archive(path.resolve(ROOT, `public${referenceAsset}`), path.resolve(DOCS, 'base-part-a-sources', `${heroId}-previous-reference.png`));
    let nativeReferences = [];
    for (const [generationIndex, generation] of [record, ...(record.correction ? [record.correction] : [])].entries()) {
      const nativeSource = generationIndex ? source : original;
      const promptFile = path.resolve(DOCS, 'base-part-a-sources', `${heroId}-prompt-${generationIndex + 1}.txt`);
      await fs.writeFile(promptFile, generation.prompt);
      const refs = [];
      for (const [index, file] of generation.referenceImages.entries()) refs.push(await archive(file, path.resolve(DOCS, 'base-part-a-sources', `${heroId}-generation-${generationIndex + 1}-reference-${index + 1}.png`)));
      const accepted = !record.correction || generationIndex > 0;
      sources.push({ heroId, archivedPath: nativeSource.path, sha256: nativeSource.sha256, originalGeneratedPath: generation.file,
        prompt: generation.prompt, promptFile: relative(promptFile), promptSha256: hash(Buffer.from(generation.prompt)), referencedImages: refs.map(({ path: file, sha256 }) => ({ path: file, sha256 })),
        generationArguments: { prompt: generation.prompt, transparent_background: true, ...(generation.referenceImages.length ? { referenced_image_paths: generation.referenceImages } : {}) },
        provider: 'OpenAI', model: null, generationId: null, jobId: null, operation: generationIndex ? 'native-imagegen-correction' : 'native-imagegen', accepted,
        reason: record.correction?.reason || null, sourceWork: record.sourceWork, sourceReference: record.sourceReference, canon1to1Verified: false, networkVerified: false });
      if (accepted) nativeReferences = refs;
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
    const sheet = `/sprites/generated/combat-character-corrections-wave8-part-a/${heroId}.png`, file = path.resolve(ROOT, `public${sheet}`);
    await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
    const pixels = await review(file);
    await sharp(bytes).resize(768, 768, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png().toFile(path.resolve(DOCS, `base-part-a-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet, width: 1024, height: 1024,
      frameWidth: 256, frameHeight: 256, columns: 4, rows: 4, frames: 16,
      states: Object.fromEntries(STATES.map((state, row) => [state, { row, frames: 4, columns: 4, fps: state === 'run' ? 10 : 8, loop: state === 'idle' || state === 'run' }])),
      sha256: hash(bytes), alpha: true, sourceImage: source.path, sourceImageSha256: source.sha256, sourceDimensions: [atlas.width, atlas.height],
      originalSourceImage: record.correction ? original.path : null, originalSourceImageSha256: record.correction ? original.sha256 : null, nativeCorrection: !!record.correction,
      referenceAsset, referenceImage: reference.path, referenceAssetSha256: reference.sha256,
      nativeReferences: nativeReferences.map(({ path: ref, sha256 }) => ({ path: ref, sha256 })),
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, identityCorrection: record.identityCorrection, bodyForm: record.bodyForm,
      provider: 'OpenAI', model: null, generationId: null, jobId: null, canonicalVerified: false, canon1to1Verified: false, networkVerified: false,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerState: true, baseline: 244, rows: normalizedRows },
      visualValidation: { allFramesReviewed: true, identityReviewed: true, defaultFacing: 'right', ...pixels,
        weaponReviewed: true, versionReviewed: true, allBodiesPresent: true,
        networkVerified: false, canon1to1Verified: false, notes: `${record.sourceReference} ${record.identityCorrection} No official source-game frames or certified1:1 appearance is claimed.` } });
  }
  entries.forEach(applyStature);
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', plannedHeroIds: PLANNED, missingVisualHeroIds: BLOCKED, entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-20', provider: 'OpenAI', model: null, generationId: null, jobId: null,
    networkVerified: false, canon1to1Verified: false, plannedHeroIds: PLANNED, missingVisualHeroIds: BLOCKED, generationRecords: records, sources, entries,
    statureReview: statureReview(entries),
    method: 'Two accepted native4×4 Teen Titans 2003 base atlases, Cyborg and the explicit full green gorilla form of Beast Boy. Three other planned identities remain missing after generation refusals. The old sheets are archived identity counterexamples; the exact native input references are listed separately. Sharp only extracts and uniformly scales genuine poses per state; no new poses, artistic replacements or raster mirroring are synthesized.' });
  await write(path.resolve(DOCS, 'base-part-a-stature-review.json'), statureReview(entries));
  return checkCombatCharacterSpriteCorrectionsWave8PartA();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const operation = process.argv.includes('--check') ? checkCombatCharacterSpriteCorrectionsWave8PartA
    : process.argv.includes('--metadata-only') ? updateCombatCharacterSpriteCorrectionsWave8PartAStature : buildCombatCharacterSpriteCorrectionsWave8PartA;
  console.log(JSON.stringify(await operation()));
}
