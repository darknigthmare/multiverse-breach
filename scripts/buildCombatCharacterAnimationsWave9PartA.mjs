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
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave9-2026-10-22');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterAnimationsWave9PartA.generated.json');
const PROVENANCE = path.resolve(DOCS, 'part-a-provenance.json');
const ANCHORS = path.resolve(ROOT, 'src/game/combat/nativeSuperAnchorsWave9PartA.generated.json');
const ANCHOR_MEASUREMENTS = path.resolve(DOCS, 'part-a-native-super-anchor-review.json');
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const PLANNED = ['marcus', 'dom', 'cole', 'baird', 'hoffman_cog'];
const EXPECTED = [...PLANNED];
const BLOCKED = [];
const phasesFor = entry => Object.keys(entry.phases);

async function measuredAnchorTable(entries) {
  const measurements = await read(ANCHOR_MEASUREMENTS);
  const table = {};
  for (const measurement of measurements.entries) {
    const entry = entries.find(item => item.heroId === measurement.heroId);
    assert.equal(entry?.sha256, measurement.sheetSha256, `${measurement.heroId}: anchor source changed`);
    assert.equal(resolveCombatAbility(HEROES_DB.find(hero => hero.id === measurement.heroId), 'special').effect, 'damage');
    table[measurement.heroId] = {};
    for (const phase of ['super', 'fatality']) {
      const points = measurement.anchors[phase];
      assert.equal(points.length, 4);
      table[measurement.heroId][phase] = points.map(point => {
        if (point === null) return null;
        assert.ok(!Array.isArray(point) && Number.isFinite(point.x) && Number.isFinite(point.y), 'Anchor contract requires an object {x,y}');
        assert.ok(point.x >= 0 && point.x < 256 && point.y >= 0 && point.y < 256);
        return { x: point.x, y: point.y };
      });
      assert.equal(table[measurement.heroId][phase][3], null);
    }
  }
  assert.deepEqual(Object.keys(table), ['marcus', 'dom', 'cole']);
  return table;
}

export async function updateCombatCharacterAnimationsWave9PartAAnchors() {
  const manifest = await read(MANIFEST);
  await write(ANCHORS, await measuredAnchorTable(manifest.entries));
  return checkCombatCharacterAnimationsWave9PartA();
}
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
const STATURE_MEASUREMENTS = JSON.parse(await fs.readFile(path.resolve(DOCS, 'part-a-stature-measurements.json'), 'utf8'));

const round = value => Math.round(value * 1e6) / 1e6;

function applyStatureMetadata(entry) {
  const measurement = STATURE_MEASUREMENTS[entry.heroId];
  assert.ok(measurement, `Missing explicit stature review: ${entry.heroId}`);
  for (const row of entry.normalization.rows) {
    row.renderScale = 1; delete row.statureReview;
    const sample = measurement[row.phase]; if (!sample) continue;
    const referencePhase = sample.referencePhase || measurement.referencePhase || 'intro';
    const reference = entry.normalization.rows.find(row => row.phase === referencePhase);
    const referenceBodyBounds = sample.referenceBodyBounds || measurement.referenceBodyBounds;
    const referenceBodyHeight = referenceBodyBounds[3];
    const referenceNativeBounds = sample.nativeReferenceRowBodyBounds || measurement.nativeReferenceRowBodyBounds;
    const nativeReferenceBodyHeight = referenceNativeBounds[3];
    const nativeReferenceRow = sample.nativeReferencePhase ? entry.normalization.rows.find(row => row.phase === sample.nativeReferencePhase) : reference;
    const normalizedBodyHeight = sample.bodyBounds[3], nativeComparableBodyHeight = sample.nativeRowBodyBounds[3];
    const target = sample.calibrationTargetBodyHeight ?? measurement.calibrationTargetBodyHeight ?? referenceBodyHeight;
    const referenceRenderScale = target / referenceBodyHeight;
    const expectedBodyHeight = target * nativeComparableBodyHeight / nativeReferenceBodyHeight;
    row.renderScale = round(expectedBodyHeight / normalizedBodyHeight);
    assert.ok(row.renderScale >= .5 && row.renderScale <= 3, `${entry.heroId}/${row.phase}: review scale`);
    const absolute = (bounds, sourceRow) => [bounds[0] + (sourceRow.sourceCrop?.left || 0), bounds[1] + sourceRow.sourceBounds.top + (sourceRow.sourceCrop?.top || 0), bounds[2], bounds[3]];
    row.statureReview = {
      referencePhase, referenceColumn: sample.referenceColumn ?? measurement.referenceColumn,
      referenceBodyHeight, sourceComparableColumn: sample.column, normalizedBodyHeight, nativeComparableBodyHeight, nativeReferenceBodyHeight,
      referenceRenderScale, referenceRenderedBodyHeight: round(target), calibrationTargetBodyHeight: round(target),
      bodyForm: sample.bodyForm || measurement.bodyForm || 'source-character-body',
      reason: sample.reason || measurement.reason, measurementKind: 'visual-body-roi',
      bodyBounds: [...sample.bodyBounds], referenceBodyBounds: [...referenceBodyBounds], excludesWeaponEffects: true,
      nativeBodyBounds: absolute(sample.nativeRowBodyBounds, row), nativeReferenceBodyBounds: absolute(referenceNativeBounds, nativeReferenceRow),
      nativeReferenceColumn: sample.nativeReferenceColumn ?? measurement.referenceColumn,
      ...(sample.sourceDensityCalibration ? { sourceDensityCalibration: sample.sourceDensityCalibration } : {}),
      nativeSourceImage: row.sourceImage, nativeSourceImageSha256: row.sourceImageSha256,
      nativeReferenceSourceImage: nativeReferenceRow.sourceImage, nativeReferenceSourceImageSha256: nativeReferenceRow.sourceImageSha256,
      coordinateSpaces: { bodyBounds: 'local normalized256px cell', nativeBodyBounds: 'absolute archived native atlas pixels' },
      ratioFormula: '(referenceBodyHeight / normalizedBodyHeight) * (nativeComparableBodyHeight / nativeReferenceBodyHeight) * (referenceRenderScale ?? 1)',
      expectedBodyHeight: round(expectedBodyHeight), correctedBodyHeight: round(normalizedBodyHeight * row.renderScale),
      posturePreserved: true, visualRoiApproximation: true, scaleAroundBaseline: 244, changesBitmap: false, source1to1Verified: false
    };
  }
  entry.normalization.renderScaleMethod = 'explicit-visual-body-roi-with-native-posture-ratio-v1';
  entry.normalization.renderScaleDoesNotModifyBitmap = true;
  entry.visualValidation.statureScaleReviewed = true;
  entry.visualValidation.statureNotes = 'Canvas-only whole-cell scaling around baseline244; each GoW2 adult has an explicit190px standing body reference, excluding the weapon and muzzle effects. Native bends and source density differences are preserved, never replaced by synthetic anatomy.';
  return entry;
}

function statureProvenance(entries) {
  return { method: 'explicit-visual-body-roi-with-native-posture-ratio-v1', date: '2026-10-22',
    source1to1Verified: false, modifiesBitmap: false, rendererAnchorBaseline: 244,
    ratioFormula: '(referenceBodyHeight / normalizedBodyHeight) * (nativeComparableBodyHeight / nativeReferenceBodyHeight) * (referenceRenderScale ?? 1)',
    measuredRows: entries.flatMap(entry => entry.normalization.rows.filter(row => row.statureReview)
      .map(row => ({ heroId: entry.heroId, phase: row.phase, renderScale: row.renderScale, ...row.statureReview }))) };
}

export async function updateCombatCharacterAnimationsWave9PartAStature() {
  const manifest = await read(MANIFEST), provenance = await read(PROVENANCE);
  // Metadata-only mode deliberately never opens a PNG for writing.
  manifest.entries.forEach(applyStatureMetadata);
  provenance.entries = manifest.entries;
  provenance.statureReview = statureProvenance(manifest.entries);
  await write(MANIFEST, manifest); await write(PROVENANCE, provenance);
  await write(path.resolve(DOCS, 'part-a-stature-review.json'), provenance.statureReview);
  return checkCombatCharacterAnimationsWave9PartA();
}

async function reviewFrames(file, phases) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, phases.length * 256);
  const allHashes = [], phaseReviews = [];
  for (let row = 0; row < phases.length; row++) {
    const frameHashes = [];
    for (let column = 0; column < 4; column++) {
      const rgba = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${file}: cut edge at ${phases[row]}/${column}`);
      }
      assert.ok(visible > 300, `${file}: empty cell ${phases[row]}/${column}`);
      const digest = hash(rgba); frameHashes.push(digest); allHashes.push(digest);
    }
    assert.equal(new Set(frameHashes).size, 4, `${file}: repeated ${phases[row]} pose`);
    phaseReviews.push({ phase: phases[row], distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(allHashes).size, phases.length * 4);
  return { distinctCells: phases.length * 4, phaseReviews };
}

async function archive(file, output) {
  const input = await exists(file) ? file : output;
  const bytes = await fs.readFile(input);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, bytes);
  return { input: output, archivedPath: relative(output), bytes, sha256: hash(bytes) };
}

export async function checkCombatCharacterAnimationsWave9PartA() {
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
    for (const reference of entry.additionalReferences || []) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.archivedPath))), reference.sha256);
    const phases = phasesFor(entry);
    assert.deepEqual(phases, PHASES);
    assert.equal(entry.frames, phases.length * 4); assert.equal(entry.height, phases.length * 256);
    for (let row = 0; row < phases.length; row++) {
      assert.equal(entry.phases[phases[row]].row, row); assert.equal(entry.phases[phases[row]].frames, 4);
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
    await reviewFrames(file, phasesFor(entry));
  }
  assert.ok(provenance.sources.length >= 5);
  assert.deepEqual(manifest.missingVisualHeroIds, BLOCKED);
  assert.deepEqual(provenance.missingVisualHeroIds, BLOCKED);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, provenance.rejectedRequests.path))), provenance.rejectedRequests.sha256);
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.promptFile))), source.promptSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.referenceImage))), source.referencedSourceSha256);
    for (const reference of source.nativeReferences || []) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.path))), reference.sha256);
    for (const reference of source.additionalReferences || []) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.archivedPath))), reference.sha256);
    assert.ok(source.prompt.length > 100);
  }
  assert.deepEqual(provenance.statureReview, statureProvenance(manifest.entries));
  assert.deepEqual(await read(ANCHORS), await measuredAnchorTable(manifest.entries));
  return { heroes: 5, full32Count: 5, partialCount: 0, partialPoses: 0, phases: 40, frames: 160, missingVisualHeroIds: BLOCKED, alphaAndMargins: true, sourceAndReferenceHashes: true,
    fourDistinctFramesPerPhase: true, namedSupers: true, nativeSources: provenance.sources.length, canvasStatureRows: manifest.entries.flatMap(entry => entry.normalization.rows).filter(row => row.statureReview).length, pixelsUnmodifiedByStatureReview: true };
}

export async function buildCombatCharacterAnimationsWave9PartA() {
  const previous = await read(PROVENANCE, {});
  const records = await read(path.resolve(ROOT, '.tmp/combat-fidelity-wave9-part-a-generation.json'), previous.generationRecords);
  assert.equal(records?.length, 5, 'Five actual accepted native identities are required');
  await fs.mkdir(DOCS, { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId);
    const hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(record.universe, hero.universe);
    const ability = resolveCombatAbility(hero, 'special');
    const phases = record.retainedPhases || PHASES;
    assert.equal(ability.name, record.ability);
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const reference = await archive(path.resolve(ROOT, `public${referenceAsset}`), path.resolve(DOCS, 'part-a-sources', `${heroId}-reference.png`));
    const additionalReferences = [];
    for (const [index, extraAsset] of (record.extraRefs || []).entries()) {
      const extra = await archive(path.resolve(ROOT, `public${extraAsset}`), path.resolve(DOCS, 'part-a-sources', `${heroId}-additional-reference-${index + 1}.png`));
      additionalReferences.push({ referenceAsset: extraAsset, archivedPath: extra.archivedPath, sha256: extra.sha256 });
    }
    const base = await archive(record.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-original.png`));
    const addSource = async (archived, generation, usage, accepted, targetRowsUsed, reason) => {
      const sourceIndex = sources.filter(source => source.heroId === heroId).length;
      const promptFile = path.resolve(DOCS, 'part-a-sources', `${heroId}-prompt-${sourceIndex + 1}.txt`);
      await fs.writeFile(promptFile, generation.prompt);
      const refFile = generation.referencedImage || generation.referenceImages?.[0] || path.resolve(ROOT, `public${referenceAsset}`);
      const actualReference = await archive(refFile, path.resolve(DOCS, 'part-a-sources', `${heroId}-generation-reference-${sourceIndex + 1}.png`));
      const nativeReferences = [];
      for (const [referenceIndex, referenceFile] of (generation.referenceImages || [refFile]).entries()) {
        const archivedReference = await archive(referenceFile, path.resolve(DOCS, 'part-a-sources', `${heroId}-generation-${sourceIndex + 1}-reference-${referenceIndex + 1}.png`));
        nativeReferences.push({ path: archivedReference.archivedPath, sha256: archivedReference.sha256 });
      }
      sources.push({ heroId, nativeReferences, archivedPath: archived.archivedPath, sha256: archived.sha256, originalGeneratedPath: generation.file,
        prompt: generation.prompt, promptFile: relative(promptFile), promptSha256: hash(Buffer.from(generation.prompt)),
        referenceImage: actualReference.archivedPath, referencedSourceSha256: actualReference.sha256, referenceAsset, referenceAssetSha256: reference.sha256,
        additionalReferences: sourceIndex === 0 ? additionalReferences : [],
        provider: 'OpenAI', model: null, generationId: null, jobId: null, operation: sourceIndex ? 'native-imagegen-correction' : 'native-imagegen',
        generationArguments: { prompt: generation.prompt, transparent_background: true, ...((generation.referenceImages || []).length ? { referenced_image_paths: generation.referenceImages } : {}) },
        accepted, usage, targetRowsUsed, retainedPhases: targetRowsUsed.map(row => phases[row]),
        sourceRowsUsed: targetRowsUsed.map(row => generation === record ? record.sourceRowByPhase?.[phases[row]] ?? row : (generation.targetRows?.indexOf(row) ?? row)),
        omittedSourceRows: generation === record ? record.omittedSourceRows || [] : [],
        sourceRowByPhase: generation === record ? record.sourceRowByPhase || null : null, reason: reason || null, sourceWork: record.sourceWork, sourceReference: record.sourceReference,
        canon1to1Verified: false, networkVerified: false });
    };
    await addSource(base, record, record.correction ? 'superseded-native-source' : 'preserved-native-phase-rows', !record.correction,
      record.correction ? [] : phases.map((phase, row) => row).filter(row => !record.rowsPatch?.targetRows.includes(PHASES.indexOf(phases[row]))),
      record.correction?.reason || record.missingRow?.reason);
    for (const [index, prior] of (record.correction?.previousCorrections || []).entries()) {
      const archived = await archive(prior.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-rejected-correction-${index + 1}.png`));
      await addSource(archived, prior, 'rejected-native-correction', false, [], prior.reason);
    }
    const correction = record.correction ? await archive(record.correction.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-corrected.png`)) : null;
    if (correction) await addSource(correction, record.correction, 'complete-native-redraw', true, PHASES.map((_, row) => row).filter(row => !record.rowsPatch?.targetRows.includes(row)), record.correction.reason);
    const missing = record.missingRow ? await archive(record.missingRow.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-missing-${PHASES[record.missingRow.targetRow]}-row.png`)) : null;
    if (missing) await addSource(missing, record.missingRow, 'missing-native-phase-row', true, [record.missingRow.targetRow], record.missingRow.reason);
    const rowsPatch = record.rowsPatch ? await archive(record.rowsPatch.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-technique-rows-corrected.png`)) : null;
    if (rowsPatch) await addSource(rowsPatch, record.rowsPatch, 'native-technique-rows-correction', true, record.rowsPatch.targetRows, record.rowsPatch.reason);
    const patchAtlas = rowsPatch ? await segmentAtlas(rowsPatch.input, record.rowsPatch.targetRows.length) : null;
    const source = correction || base;
    const originalMetadata = await sharp(source.input).metadata();
    let sourceInput = source.input;
    let transparentMarginExtraction = null;
    if (record.sourceCrop) {
      const { data, info } = await sharp(source.input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let maxDiscardedAlpha = 0, discardedNonzeroPixels = 0;
      const c = record.sourceCrop;
      for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (x < c.left || x >= c.left + c.width || y < c.top || y >= c.top + c.height) {
        const alpha = data[(y * info.width + x) * 4 + 3]; maxDiscardedAlpha = Math.max(maxDiscardedAlpha, alpha); if (alpha) discardedNonzeroPixels++;
      }
      assert.ok(maxDiscardedAlpha <= 4, 'Outer extraction must not remove visible artwork');
      sourceInput = await sharp(source.input).extract(c).png().toBuffer();
      transparentMarginExtraction = { sourceCrop: c, maxDiscardedAlpha, discardedNonzeroPixels, originalUnchanged: true, reason: 'Remove asymmetric empty outer margins before adaptive four-column extraction; no body or visible effect is removed.' };
    }
    const atlas = await segmentAtlas(sourceInput, record.correction ? 8 : (record.sourceRows || 8));
    const missingAtlas = missing ? await segmentAtlas(missing.input, 1) : null;
    const composites = [], normalizedRows = [];
    for (let row = 0; row < phases.length; row++) {
      const phase = phases[row], fullRow = PHASES.indexOf(phase);
      const patchIndex = record.rowsPatch?.targetRows.indexOf(fullRow) ?? -1;
      const selectedAtlas = patchIndex >= 0 ? patchAtlas : missing && row === record.missingRow.targetRow ? missingAtlas : atlas;
      const selectedSource = patchIndex >= 0 ? rowsPatch : missing && row === record.missingRow.targetRow ? missing : source;
      const selectedRow = patchIndex >= 0 ? patchIndex : record.sourceRowByPhase?.[phase] ?? (missing && row === record.missingRow.targetRow ? 0 : (missing && row > record.missingRow.targetRow ? row - 1 : row));
      assert.equal(selectedAtlas.rows[selectedRow].seamReview.crossedOpaquePixels, 0, `${heroId}/${phases[row]}: seam crosses opaque artwork`);
      const frameOrder = record.frameOrderByPhase?.[phase] || [0, 1, 2, 3];
      assert.deepEqual([...frameOrder].sort(), [0, 1, 2, 3]);
      const extractionRow = { ...selectedAtlas.rows[selectedRow], frames: frameOrder.map(column => selectedAtlas.rows[selectedRow].frames[column]) };
      const normalized = await normalizeRow(extractionRow);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      normalizedRows.push({ phase, sourceCrop: selectedSource === source ? record.sourceCrop || null : null, sourceImage: selectedSource.archivedPath, sourceImageSha256: selectedSource.sha256,
        sourceRow: selectedRow, frameSourceColumns: frameOrder, sourceBounds: selectedAtlas.rows[selectedRow].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selectedAtlas.rows[selectedRow].seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: phases.length * 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const sheet = `/sprites/generated/combat-character-animations-wave9/${heroId}.png`;
    const file = path.resolve(ROOT, `public${sheet}`);
    await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
    const review = await reviewFrames(file, phases);
    await sharp(bytes).resize(512, phases.length * 128, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png()
      .toFile(path.resolve(DOCS, `part-a-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: phases.length * 256, frameWidth: 256, frameHeight: 256, columns: 4, rows: phases.length, frames: phases.length * 4,
      partial: phases.length !== 8, completePhases: phases.length === 8, missingPhases: PHASES.filter(phase => !phases.includes(phase)),
      phases: Object.fromEntries(phases.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: phase === 'fatality' || phase === 'super' ? 12 : 8, loop: false }])),
      sha256: hash(bytes), alpha: true, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceDimensions: [originalMetadata.width, originalMetadata.height], segmentedDimensions: [atlas.width, atlas.height], transparentMarginExtraction,
      referenceAsset, referenceImage: reference.archivedPath, referenceAssetSha256: reference.sha256, additionalReferences,
      originalSourceImage: correction ? base.archivedPath : null, originalSourceImageSha256: correction ? base.sha256 : null, nativeCorrection: !!(record.correction || record.missingRow || record.rowsPatch),
      retainedSourceRows: normalizedRows.filter(row => row.sourceImage === source.archivedPath).map(row => row.sourceRow), rejectedSourceRows: record.omittedSourceRows || [],
      frameOrderByPhase: record.frameOrderByPhase || null, sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: record.ability, identityCorrection: record.identityCorrection,
      bodyFormsByPhase: record.bodyFormsByPhase || null,
      sourceAbility: { id: ability.id, name: ability.name, effect: ability.effect, delivery: ability.delivery, duration: ability.duration, hitAt: ability.hitAt },
      provider: 'OpenAI', model: null, generationId: null, jobId: null,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows: normalizedRows },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...review,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, fatalityIsExecution: false, eidolonPresent: false, defaultFacing: 'right',
        weaponReviewed: true, versionReviewed: true, allBodiesPresent: true,
        notes: `${record.sourceReference} ${record.identityCorrection} This is original generated choreography; official pixels and source-game cinematic fidelity are not certified.` } });
  }
  entries.forEach(applyStatureMetadata);
  const rejectedRequests = { path: relative(path.resolve(DOCS, 'part-a-rejected-requests.json')), sha256: hash(await fs.readFile(path.resolve(DOCS, 'part-a-rejected-requests.json'))) };
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', plannedHeroIds: PLANNED, missingVisualHeroIds: BLOCKED, full32Count: 5, partialCount: 0, partialPoses: 0, entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-22', part: 'A', provider: 'OpenAI', model: null, generationId: null,
    plannedHeroIds: PLANNED, missingVisualHeroIds: BLOCKED, full32Count: 5, partialCount: 0, partialPoses: 0, rejectedRequests,
    method: 'Five complete native GoW2 character32 atlases extracted from five actual accepted image_gen sources, with any necessary native corrections archived separately. Sharp only segments via alpha valleys/adaptive transparent seams, scales uniformly within each phase and packs genuine poses; no poses or substitute art are synthesized in code. Technique row corrections use their own explicit source-row mapping; source density differences are reviewed as body ROIs before canvas-only scale metadata.',
    networkVerified: false, canon1to1Verified: false, generationRecords: records, sources, entries, statureReview: statureProvenance(entries) });
  await write(path.resolve(DOCS, 'part-a-stature-review.json'), statureProvenance(entries));
  await write(ANCHORS, await measuredAnchorTable(entries));
  return checkCombatCharacterAnimationsWave9PartA();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const operation = process.argv.includes('--check') ? checkCombatCharacterAnimationsWave9PartA
    : process.argv.includes('--anchors-only') ? updateCombatCharacterAnimationsWave9PartAAnchors
      : process.argv.includes('--metadata-only') ? updateCombatCharacterAnimationsWave9PartAStature : buildCombatCharacterAnimationsWave9PartA;
  console.log(JSON.stringify(await operation()));
}
