import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave5-2026-10-20');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterAnimationsWave5PartA.generated.json');
const PROVENANCE = path.resolve(DOCS, 'part-a-provenance.json');
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const EXPECTED = ['masterchief', 'arbiter', 'johnson', 'doomslayer', 'doom_marine_classic'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);
const read = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
};

// Manually reviewed body rectangles, excluding projecting weapons, smoke and
// energy effects. Native rectangles use x across the source atlas and y within
// the segmented row; applyStatureMetadata records their absolute atlas y too.
// Their heights describe each actual pose, so a lunge/kneel is not stretched
// to the height of a standing reference. These are approximate visual ROIs,
// not an automatic semantic body segmentation or a source-game certification.
const STATURE_MEASUREMENTS = {
  masterchief: {
    referenceColumn: 0, referenceBodyBounds: [54, 27, 145, 217], nativeReferenceRowBodyBounds: [57, 68, 105, 157],
    fatality: { column: 3, bodyBounds: [66, 130, 116, 114], nativeRowBodyBounds: [695, 29, 153, 150] },
    super: { column: 3, bodyBounds: [68, 131, 119, 110], nativeRowBodyBounds: [697, 37, 156, 144] },
    reason: 'Compare the visible helmet-to-boots recovery body with the intro guard. Omit the launcher muzzle and smoke above the helmet; retain the lower kneeling charge/fire poses in fatality columns1–2.'
  },
  arbiter: {
    referenceColumn: 3, referenceBodyBounds: [12, 26, 156, 217], nativeReferenceRowBodyBounds: [683, 65, 126, 175],
    fatality: { column: 3, bodyBounds: [70, 124, 96, 120], nativeRowBodyBounds: [698, 19, 130, 163] },
    super: { column: 3, bodyBounds: [63, 104, 101, 136], nativeRowBodyBounds: [693, 43, 129, 173] },
    reason: 'Compare ceremonial helmet, torso and digitigrade feet in the forward sword guards; exclude both projecting plasma prongs. Preserve the naturally lower native fatality recovery (163px versus175px), and the much lower extended lunge in column2.'
  },
  johnson: {
    referenceColumn: 0, referenceBodyBounds: [67, 12, 134, 232], nativeReferenceRowBodyBounds: [74, 34, 118, 205],
    fatality: { column: 3, bodyBounds: [73, 110, 101, 134], nativeRowBodyBounds: [819, 6, 142, 188] },
    super: { column: 3, bodyBounds: [79, 110, 86, 132], nativeRowBodyBounds: [818, 11, 136, 210] },
    reason: 'Use the uncovered gray-haired head, Marine torso and boots in recovery, not the elevated laser launcher obscuring the face in the first charge pose. Keep the 188px native lowered recovery relative to the205px intro; do not lift a kneeling pose to standing height.'
  },
  doomslayer: {
    referenceColumn: 0, referenceBodyBounds: [50, 42, 151, 202], nativeReferenceRowBodyBounds: [46, 56, 125, 167],
    fatality: { column: 0, bodyBounds: [66, 117, 113, 126], nativeRowBodyBounds: [28, 26, 150, 167] },
    super: { column: 0, bodyBounds: [60, 121, 122, 123], nativeRowBodyBounds: [22, 25, 160, 161] },
    reason: 'Both samples stand with the heavy gun at the waist. Measure the Praetor helmet/shoulder equipment down to the boots, excluding the gun aperture and green orb. The161px native super posture remains shorter than the167px intro, rather than being forced upright.'
  },
  doom_marine_classic: {
    referenceColumn: 0, referenceBodyBounds: [43, 14, 157, 230], nativeReferenceRowBodyBounds: [39, 17, 133, 195],
    fatality: { column: 0, bodyBounds: [60, 92, 112, 152], nativeRowBodyBounds: [19, 9, 151, 204] },
    super: { column: 0, bodyBounds: [61, 100, 101, 144], nativeRowBodyBounds: [19, 9, 139, 197] },
    reason: 'The gray helmet, bare arms and boots are visible in all three standing samples. The original BFG stays at the waist; its muzzle and third-column projectile do not determine the measured body height. Preserve the small native stance-height differences (195/204/197px).'
  }
};
const round = value => Math.round(value * 1e6) / 1e6;

function applyStatureMetadata(entry) {
  const measurement = STATURE_MEASUREMENTS[entry.heroId];
  assert.ok(measurement, `Missing explicit stature review: ${entry.heroId}`);
  const reference = entry.normalization.rows[0];
  const referenceBodyHeight = measurement.referenceBodyBounds[3];
  const nativeReferenceBodyHeight = measurement.nativeReferenceRowBodyBounds[3];
  for (const row of entry.normalization.rows) {
    row.renderScale = 1;
    delete row.statureReview;
    const sample = measurement[row.phase];
    if (!sample) continue;
    const normalizedBodyHeight = sample.bodyBounds[3];
    const nativeComparableBodyHeight = sample.nativeRowBodyBounds[3];
    const expectedBodyHeight = referenceBodyHeight * nativeComparableBodyHeight / nativeReferenceBodyHeight;
    row.renderScale = round(expectedBodyHeight / normalizedBodyHeight);
    assert.ok(row.renderScale >= 0.5 && row.renderScale <= 3);
    const absoluteBounds = (bounds, sourceRow) => [bounds[0], bounds[1] + sourceRow.sourceBounds.top, bounds[2], bounds[3]];
    row.statureReview = {
      referencePhase: 'intro', referenceColumn: measurement.referenceColumn, referenceBodyHeight,
      sourceComparableColumn: sample.column, normalizedBodyHeight, nativeComparableBodyHeight, nativeReferenceBodyHeight,
      reason: measurement.reason, measurementKind: 'visual-body-roi',
      bodyBounds: [...sample.bodyBounds], referenceBodyBounds: [...measurement.referenceBodyBounds], excludesWeaponEffects: true,
      nativeBodyBounds: absoluteBounds(sample.nativeRowBodyBounds, row),
      nativeReferenceBodyBounds: absoluteBounds(measurement.nativeReferenceRowBodyBounds, reference),
      nativeSourceImage: row.sourceImage, nativeSourceImageSha256: row.sourceImageSha256,
      nativeReferenceSourceImage: reference.sourceImage, nativeReferenceSourceImageSha256: reference.sourceImageSha256,
      coordinateSpaces: { bodyBounds: 'local normalized256px cell', nativeBodyBounds: 'absolute archived native atlas pixels' },
      ratioFormula: '(referenceBodyHeight / normalizedBodyHeight) * (nativeComparableBodyHeight / nativeReferenceBodyHeight)',
      expectedBodyHeight: round(expectedBodyHeight), correctedBodyHeight: round(normalizedBodyHeight * row.renderScale),
      posturePreserved: true, visualRoiApproximation: true, scaleAroundBaseline: 244,
      changesBitmap: false, source1to1Verified: false
    };
  }
  entry.normalization.renderScaleMethod = 'explicit-visual-body-roi-with-native-posture-ratio-v1';
  entry.normalization.renderScaleDoesNotModifyBitmap = true;
  entry.visualValidation.statureScaleReviewed = true;
  entry.visualValidation.statureNotes = 'Canvas-only whole-cell scaling around baseline244 reverses the weapon/effect-driven packing reduction. Approximate reviewed body ROIs and retained native stance-height ratios determine the factors; no PNG, source rectangle, anatomy or animation pose is modified.';
  return entry;
}

function statureProvenance(entries) {
  return { method: 'explicit-visual-body-roi-with-native-posture-ratio-v1', date: '2026-10-20',
    source1to1Verified: false, modifiesBitmap: false, rendererAnchorBaseline: 244,
    ratioFormula: '(referenceBodyHeight / normalizedBodyHeight) * (nativeComparableBodyHeight / nativeReferenceBodyHeight)',
    measuredRows: entries.flatMap(entry => entry.normalization.rows.filter(row => row.statureReview)
      .map(row => ({ heroId: entry.heroId, phase: row.phase, renderScale: row.renderScale, ...row.statureReview }))) };
}

export async function updateCombatCharacterAnimationsWave5PartAStature() {
  const manifest = await read(MANIFEST), provenance = await read(PROVENANCE);
  // Metadata-only mode deliberately never opens a PNG for writing.
  manifest.entries.forEach(applyStatureMetadata);
  provenance.entries = manifest.entries;
  provenance.statureReview = statureProvenance(manifest.entries);
  await write(MANIFEST, manifest); await write(PROVENANCE, provenance);
  await write(path.resolve(DOCS, 'part-a-stature-review.json'), provenance.statureReview);
  return checkCombatCharacterAnimationsWave5PartA();
}

async function reviewFrames(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048);
  const allHashes = [], phaseReviews = [];
  for (let row = 0; row < 8; row++) {
    const frameHashes = [];
    for (let column = 0; column < 4; column++) {
      const rgba = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${file}: cut edge at ${PHASES[row]}/${column}`);
      }
      assert.ok(visible > 300, `${file}: empty cell ${PHASES[row]}/${column}`);
      const digest = hash(rgba); frameHashes.push(digest); allHashes.push(digest);
    }
    assert.equal(new Set(frameHashes).size, 4, `${file}: repeated ${PHASES[row]} pose`);
    phaseReviews.push({ phase: PHASES[row], distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(allHashes).size, 32);
  return { distinctCells: 32, phaseReviews };
}

async function archive(file, output) {
  const input = await exists(file) ? file : output;
  const bytes = await fs.readFile(input);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, bytes);
  return { input: output, archivedPath: relative(output), bytes, sha256: hash(bytes) };
}

export async function checkCombatCharacterAnimationsWave5PartA() {
  const manifest = await read(MANIFEST);
  const provenance = await read(PROVENANCE);
  assert.deepEqual(manifest.entries.map(entry => entry.heroId), EXPECTED);
  for (const entry of manifest.entries) {
    const hero = HEROES_DB.find(item => item.id === entry.heroId);
    assert.equal(hero?.universe, entry.universe);
    assert.equal(resolveCombatAbility(hero, 'special').name, entry.abilityName);
    const file = path.resolve(ROOT, `public${entry.sheet}`);
    assert.equal(hash(await fs.readFile(file)), entry.sha256);
    assert.equal((await sharp(file).metadata()).hasAlpha, true);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.referenceImage))), entry.referenceAssetSha256);
    for (let row = 0; row < PHASES.length; row++) {
      assert.equal(entry.phases[PHASES[row]].row, row); assert.equal(entry.phases[PHASES[row]].frames, 4);
      const normalized = entry.normalization.rows[row];
      assert.equal(hash(await fs.readFile(path.resolve(ROOT, normalized.sourceImage))), normalized.sourceImageSha256);
      assert.ok(Number.isInteger(normalized.sourceRow)); assert.equal(normalized.crossedOpaquePixels, 0);
      const expected = applyStatureMetadata(structuredClone(entry)).normalization.rows[row];
      assert.equal(normalized.renderScale, expected.renderScale);
      assert.deepEqual(normalized.statureReview, expected.statureReview);
      if (normalized.statureReview) {
        const review = normalized.statureReview;
        assert.ok(Math.abs(review.correctedBodyHeight - review.expectedBodyHeight) < 0.001);
        assert.equal(review.normalizedBodyHeight, review.bodyBounds[3]);
        assert.equal(review.nativeComparableBodyHeight, review.nativeBodyBounds[3]);
        assert.equal(review.nativeReferenceBodyHeight, review.nativeReferenceBodyBounds[3]);
      }
    }
    assert.equal(entry.visualValidation.canon1to1Verified, false);
    assert.equal(entry.visualValidation.networkVerified, false);
    assert.equal(entry.visualValidation.eidolonPresent, false);
    await reviewFrames(file);
  }
  assert.ok(provenance.sources.length >= 5);
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.promptFile))), source.promptSha256);
    assert.ok(source.prompt.length > 100);
  }
  assert.deepEqual(provenance.statureReview, statureProvenance(manifest.entries));
  return { heroes: 5, phases: 40, frames: 160, alphaAndMargins: true, sourceAndReferenceHashes: true,
    fourDistinctFramesPerPhase: true, namedSupers: true, nativeSources: provenance.sources.length, canvasStatureRows: 10, pixelsUnmodifiedByStatureReview: true };
}

export async function buildCombatCharacterAnimationsWave5PartA() {
  const previous = await read(PROVENANCE, {});
  const records = await read(path.resolve(ROOT, '.tmp/combat-fidelity-wave5-part-a-generation.json'), previous.generationRecords);
  assert.equal(records?.length, 5, 'Five actual native generation records are required');
  await fs.mkdir(DOCS, { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId);
    const hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(record.universe, hero.universe);
    const ability = resolveCombatAbility(hero, 'special');
    assert.equal(ability.name, record.ability);
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const reference = await archive(path.resolve(ROOT, `public${referenceAsset}`), path.resolve(DOCS, 'part-a-sources', `${heroId}-reference.png`));
    const base = await archive(record.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-original.png`));
    const addSource = async (archived, generation, usage, accepted, targetRowsUsed, reason) => {
      const sourceIndex = sources.filter(source => source.heroId === heroId).length;
      const promptFile = path.resolve(DOCS, 'part-a-sources', `${heroId}-prompt-${sourceIndex + 1}.txt`);
      await fs.writeFile(promptFile, generation.prompt);
      const refFile = generation.referencedImage || path.resolve(ROOT, `public${referenceAsset}`);
      const actualReference = await archive(refFile, path.resolve(DOCS, 'part-a-sources', `${heroId}-generation-reference-${sourceIndex + 1}.png`));
      sources.push({ heroId, archivedPath: archived.archivedPath, sha256: archived.sha256, originalGeneratedPath: generation.file,
        prompt: generation.prompt, promptFile: relative(promptFile), promptSha256: hash(Buffer.from(generation.prompt)),
        referenceImage: actualReference.archivedPath, referencedSourceSha256: actualReference.sha256, referenceAsset, referenceAssetSha256: reference.sha256,
        provider: 'OpenAI', model: null, generationId: null, jobId: null, operation: sourceIndex ? 'native-imagegen-correction' : 'native-imagegen',
        accepted, usage, targetRowsUsed, reason: reason || null, sourceWork: record.sourceWork, sourceReference: record.sourceReference,
        canon1to1Verified: false, networkVerified: false });
    };
    await addSource(base, record, record.correction ? 'superseded-native-source' : 'preserved-native-phase-rows', !record.correction,
      record.correction ? [] : PHASES.map((_, row) => row).filter(row => !(record.missingRow && row === 6)),
      record.correction?.reason || record.missingRow?.reason);
    for (const [index, prior] of (record.correction?.previousCorrections || []).entries()) {
      const archived = await archive(prior.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-rejected-correction-${index + 1}.png`));
      await addSource(archived, prior, 'rejected-native-correction', false, [], prior.reason);
    }
    const correction = record.correction ? await archive(record.correction.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-corrected.png`)) : null;
    if (correction) await addSource(correction, record.correction, 'complete-native-redraw', true, PHASES.map((_, row) => row), record.correction.reason);
    const missing = record.missingRow ? await archive(record.missingRow.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-defeat-row.png`)) : null;
    if (missing) await addSource(missing, record.missingRow, 'missing-native-defeat-row', true, [6], record.missingRow.reason);
    const source = correction || base;
    const atlas = await segmentAtlas(source.input, record.correction ? 8 : (record.sourceRows || 8));
    const missingAtlas = missing ? await segmentAtlas(missing.input, 1) : null;
    const composites = [], normalizedRows = [];
    for (let row = 0; row < PHASES.length; row++) {
      const selectedAtlas = missing && row === 6 ? missingAtlas : atlas;
      const selectedSource = missing && row === 6 ? missing : source;
      const selectedRow = missing && row === 6 ? 0 : (missing && row === 7 ? 6 : row);
      assert.equal(selectedAtlas.rows[selectedRow].seamReview.crossedOpaquePixels, 0, `${heroId}/${PHASES[row]}: seam crosses opaque artwork`);
      const normalized = await normalizeRow(selectedAtlas.rows[selectedRow]);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      normalizedRows.push({ phase: PHASES[row], sourceImage: selectedSource.archivedPath, sourceImageSha256: selectedSource.sha256,
        sourceRow: selectedRow, sourceBounds: selectedAtlas.rows[selectedRow].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selectedAtlas.rows[selectedRow].seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const sheet = `/sprites/generated/combat-character-animations-wave5/${heroId}.png`;
    const file = path.resolve(ROOT, `public${sheet}`);
    await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
    const review = await reviewFrames(file);
    await sharp(bytes).resize(512, 1024, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png()
      .toFile(path.resolve(DOCS, `part-a-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, columns: 4, rows: 8, frames: 32,
      phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: phase === 'fatality' || phase === 'super' ? 12 : 8, loop: false }])),
      sha256: hash(bytes), alpha: true, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceDimensions: [atlas.width, atlas.height],
      referenceAsset, referenceImage: reference.archivedPath, referenceAssetSha256: reference.sha256,
      originalSourceImage: correction ? base.archivedPath : null, originalSourceImageSha256: correction ? base.sha256 : null, nativeCorrection: !!(record.correction || record.missingRow),
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: record.ability, identityCorrection: record.identityCorrection,
      sourceAbility: { id: ability.id, name: ability.name, effect: ability.effect, delivery: ability.delivery, duration: ability.duration, hitAt: ability.hitAt },
      provider: 'OpenAI', model: null, generationId: null, jobId: null,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows: normalizedRows },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...review,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, fatalityIsExecution: false, eidolonPresent: false, defaultFacing: 'right',
        weaponReviewed: true, versionReviewed: true, allBodiesPresent: true,
        notes: `${record.sourceReference} ${record.identityCorrection} This is original generated choreography; official pixels and source-game cinematic fidelity are not certified.` } });
  }
  entries.forEach(applyStatureMetadata);
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-20', part: 'A', provider: 'OpenAI', model: null, generationId: null,
    method: 'Five actual native image_gen character atlases, with any necessary native corrections archived separately. Sharp only segments via alpha valleys/adaptive transparent seams, scales uniformly within each phase and packs genuine poses; no poses or substitute art are synthesized in code.',
    networkVerified: false, canon1to1Verified: false, generationRecords: records, sources, entries, statureReview: statureProvenance(entries) });
  await write(path.resolve(DOCS, 'part-a-stature-review.json'), statureProvenance(entries));
  return checkCombatCharacterAnimationsWave5PartA();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const operation = process.argv.includes('--check') ? checkCombatCharacterAnimationsWave5PartA
    : process.argv.includes('--metadata-only') ? updateCombatCharacterAnimationsWave5PartAStature : buildCombatCharacterAnimationsWave5PartA;
  console.log(JSON.stringify(await operation()));
}
