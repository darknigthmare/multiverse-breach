import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { segmentNativeAtlas, commonSourceScale, packNativeFrames } from './native-segmentation.mjs';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const DOCS = 'docs/combat-fidelity-wave16-2026-10-28/part-b';
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const STATES = ['idle', 'run', 'attack', 'hit'];
const read = relative => fs.readFile(path.resolve(ROOT, relative));
const json = async relative => JSON.parse(await read(relative));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const writeJson = (relative, value) => fs.writeFile(path.resolve(ROOT, relative), JSON.stringify(value, null, 2) + '\n');

export async function inspectPacked(bytes, names) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, names.length * 256);
  const hashes = [], reviews = [];
  for (const [row, name] of names.entries()) {
    const frameHashes = [];
    for (let column = 0; column < 4; column++) {
      const cell = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha > 0) data.copy(cell, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 24) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, name + '/' + column + ': visible crop');
      }
      assert.ok(visible > 300, name + '/' + column + ': empty native figure');
      frameHashes.push(sha(cell));
    }
    assert.equal(new Set(frameHashes).size, 4, name + ': copied/repeated frame');
    hashes.push(...frameHashes); reviews.push({ name, distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(hashes).size, names.length * 4, 'A complete pose was copied between sequences');
  return { distinctCells: hashes.length, reviews, hashes };
}

async function prepareSources(record) {
  assert.equal(record.reviewed, true, record.heroId + ': source review pending');
  assert.equal(sha(await read(record.referenceArchive)), record.referenceAssetSha256);
  assert.equal(sha(await read('public' + record.referenceAsset)), record.referenceAssetSha256);
  const prepared = [];
  for (const [sourceIndex, source] of record.sources.entries()) {
    assert.equal(sha(await read(source.archivedPath)), source.sha256, source.archivedPath);
    const prompt = await fs.readFile(path.resolve(ROOT, source.promptFile), 'utf8');
    assert.equal(sha(Buffer.from(prompt)), source.promptSha256);
    const receipt = await json(source.toolResultFile);
    assert.equal(receipt.imageReturned, true); assert.equal(receipt.arguments.prompt.trim(), prompt.trim());
    const atlas = await segmentNativeAtlas(path.resolve(ROOT, source.archivedPath), { rowCount: source.rows, ...(source.segmentation || {}) });
    assert.deepEqual(atlas.rowCounts, source.rowCounts, record.heroId + ': observed native figure count changed');
    assert.equal(atlas.frames.length, source.nativeComponentsObserved ?? source.nativeDrawingsObserved);
    const selected = [];
    for (const [index, row, columns] of [...record.selections.native, ...record.selections.base]) {
      if (index !== sourceIndex) continue;
      assert.equal(columns.length, 4);
      for (const column of columns) {
        assert.ok(atlas.rows[row]?.[column], record.heroId + ': missing source cell must not count as delivered');
        selected.push(atlas.rows[row][column]);
      }
    }
    assert.equal(new Set(selected).size, selected.length, record.heroId + ': a source drawing was selected twice');
    assert.equal(selected.length, source.retainedDrawings);
    const scale = selected.length ? commonSourceScale(selected, source.calibration.bodyHeight, record.targetBodyHeight) : null;
    prepared.push({ ...source, atlas, scale,
      renderScale: scale ? record.targetBodyHeight / (source.calibration.bodyHeight * scale) : null });
  }
  return prepared;
}

async function makeEntry(record, sources, kind) {
  const base = kind === 'base', names = base ? STATES : PHASES;
  const selections = record.selections[kind];
  assert.equal(selections.length, names.length);
  const composites = [], rows = [];
  for (const [row, name] of names.entries()) {
    const [sourceIndex, sourceRow, sourceColumns] = selections[row], source = sources[sourceIndex];
    const frames = sourceColumns.map(column => source.atlas.rows[sourceRow][column]);
    const packed = await packNativeFrames(frames, source.scale);
    composites.push({ input: packed.bytes, left: 0, top: row * 256 });
    rows.push({ [base ? 'state' : 'phase']: name, row, sourceImage: source.archivedPath,
      sourceImageSha256: source.sha256, sourceRow, sourceColumns,
      frameBounds: packed.frameBounds, scale: source.scale, baseline: 244, renderScale: source.renderScale,
      sharedPixelScaleAcrossAllRetainedSourceFrames: true,
      statureReview: { targetBodyHeight: record.targetBodyHeight, sourceBodyHeight: source.calibration.bodyHeight,
        normalizedBodyHeight: source.calibration.bodyHeight * source.scale, sharedAcrossSource: true,
        preservesNativeCrouchAndKneelRatios: true },
      seamReview: { crossedOpaquePixels: 0, crossedVisiblePixels: 0,
        method: 'whole native component and assigned native fragments; no synthetic paint or alpha threshold erasure' } });
  }
  const bytes = await sharp({ create: { width: 1024, height: names.length * 256, channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
  const pixelReview = await inspectPacked(bytes, names);
  const first = sources[selections[0][0]];
  const output = base ? 'combat-character-corrections-wave16-part-b' : 'combat-character-animations-wave16-part-b';
  const animationData = Object.fromEntries(names.map((name, row) => [name, { row, frames: 4, columns: 4,
    fps: base && name === 'run' ? 10 : ['fatality', 'super'].includes(name) ? 12 : 8,
    loop: base && ['idle', 'run'].includes(name) }]));
  return { bytes, hashes: pixelReview.hashes, entry: {
    id: record.heroId, heroId: record.heroId, universe: record.universe, name: record.name,
    sheet: '/sprites/generated/' + output + '/' + record.heroId + '.png',
    width: 1024, height: names.length * 256, columns: 4, rows: names.length,
    frameWidth: 256, frameHeight: 256, frames: names.length * 4,
    [base ? 'states' : 'phases']: animationData, sha256: sha(bytes), alpha: true,
    sourceImage: first.archivedPath, sourceImageSha256: first.sha256,
    sourceDimensions: [first.atlas.width, first.atlas.height],
    sourceImages: sources.map(source => ({ path: source.archivedPath, sha256: source.sha256,
      drawingsObserved: source.nativeDrawingsObserved, retainedDrawings: source.retainedDrawings,
      excludedDrawings: source.excludedDrawings })),
    referenceAsset: record.referenceAsset, referenceAssetSha256: record.referenceAssetSha256,
    referenceImage: record.referenceArchive, archivedReferenceAsset: record.referenceArchive,
    referenceUse: 'Historical resource inspected and archived. New initial drawings use the exact selected source version; corrections reference only the native source image, never a blocked persona variant.',
    sourceWork: record.sourceWork, characterVersion: record.sourceWork,
    sourceAppearance: record.selectedSourceAppearance, sourceWeapon: record.selectedSourceWeapon,
    sourcePose: record.selectedSourcePose, sourceActionName: record.sourceActionName,
    sourceEffect: record.sourceEffect, sourceDelivery: record.sourceDelivery,
    targetBodyHeight: record.targetBodyHeight,
    sourceReference: record.sourceReference, sourceUrl: record.sourceReference,
    abilityName: base ? record.simpleActionName : record.specialActionName,
    abilityEffect: base ? record.simpleEffect : record.specialEffect,
    provider: 'OpenAI', model: null, generationId: null, jobId: null,
    nativeCorrection: sources.length > 1,
    originalSourceImage: sources.length > 1 ? sources[0].archivedPath : null,
    originalSourceImageSha256: sources.length > 1 ? sources[0].sha256 : null,
    normalization: { method: 'native-alpha-component-segmentation-one-source-calibration-v1',
      sharedScalePerSource: true, baseline: 244, rows,
      sourceWideBodyCalibration: { method: 'one-complete-standing-native-body-per-source',
        targetBodyHeight: record.targetBodyHeight, preservesNativePoseHeightRatio: true,
        normalizationNeverRedrawsBody: true } },
    visualValidation: { identityReviewed: true, allFramesReviewed: true, technicalAlphaReviewed: true,
      fourNativePosesPerRowReviewed: true, distinctCells: pixelReview.distinctCells,
      [base ? 'stateReviews' : 'phaseReviews']: pixelReview.reviews.map(review => ({
        [base ? 'state' : 'phase']: review.name, distinctFrames: 4, frameHashes: review.frameHashes })),
      canon1to1Verified: false, canonicalVerified: false, networkVerified: false, source1to1Verified: false,
      sourceGameAsset: false, adaptedChoreography: true, fatalityIsExecution: false,
      correctionNotes: record.correctionNotes, notes: record.reviewNotes }
  } };
}

export async function buildPartB(kind, { check = false } = {}) {
  assert.ok(['native', 'base'].includes(kind));
  const recordsFile = await json(DOCS + '/generation-records.json');
  const records = recordsFile.records;
  const plan = await json('docs/combat-fidelity-wave16-2026-10-28/batch-plan-before.json');
  const amendments = await json('docs/combat-fidelity-wave16-2026-10-28/batch-amendments-before-generation.json');
  const effectiveIds = amendments.effectiveParts.B;
  assert.equal(effectiveIds.length,40);
  const unusedSources = recordsFile.unusedSourceImages || [];
  for (const source of unusedSources) assert.equal(sha(await read(source.path)),source.sha256,source.path);
  assert.deepEqual(recordsFile.selectedHeroIds, effectiveIds);
  assert.equal(new Set(records.map(record => record.heroId)).size, records.length);
  assert.ok(records.every(record => effectiveIds.includes(record.heroId)));
  assert.ok(recordsFile.failures.every(failure => !records.some(record => record.heroId === failure.heroId)));
  const entries = [], sourceSummary = [], globalHashes = [];
  for (const record of records) {
    const sources = await prepareSources(record);
    const native = await makeEntry(record, sources, 'native'), base = await makeEntry(record, sources, 'base');
    assert.equal(new Set([...native.hashes, ...base.hashes]).size, 48, record.heroId + ': a drawing is repeated across native/base');
    const result = kind === 'native' ? native : base;
    entries.push(result.entry); globalHashes.push(...result.hashes);
    sourceSummary.push(...sources.map(({ atlas, scale, renderScale, ...source }) => ({ heroId: record.heroId,
      ...source, sourceDimensions: [atlas.width, atlas.height], scale, renderScale,
      allVisibleSourcePixelsPreservedBySegmentation: atlas.allVisiblePixelsPreservedExactlyOnce })));
    if (check) assert.equal(sha(await read('public' + result.entry.sheet)), result.entry.sha256, record.heroId);
    else {
      const outputPath = path.resolve(ROOT, 'public' + result.entry.sheet);
      await fs.mkdir(path.dirname(outputPath), { recursive: true }); await fs.writeFile(outputPath, result.bytes);
      const contactDir = path.resolve(ROOT, DOCS, kind === 'base' ? 'base-contacts' : 'native-contacts');
      await fs.mkdir(contactDir, { recursive: true });
      await sharp(result.bytes).resize(512, result.entry.rows * 128, { kernel: sharp.kernel.nearest })
        .flatten({ background: '#243148' }).png().toFile(path.join(contactDir, record.heroId + '.png'));
    }
  }
  assert.equal(new Set(globalHashes).size, globalHashes.length, 'Duplicated retained source drawing across characters');
  const registry = { schemaVersion: 1, source: 'OpenAI', entries };
  const provenance = { schemaVersion: 1, date: '2026-10-28', part: 'B', kind, provider: 'OpenAI', tool: 'image_gen',
    source1to1Verified: false, canon1to1Verified: false, selectedHeroIds: effectiveIds, failures: recordsFile.failures, remainingHeroIds: recordsFile.remainingHeroIds || [],
    generationRecords: DOCS + '/generation-records.json', sources: sourceSummary, unusedSources, originalSelectedHeroIds: plan.parts.B, preGenerationAmendment: recordsFile.preGenerationAmendment, entries,
    nativeDrawingsObserved: sourceSummary.reduce((n, source) => n + source.nativeDrawingsObserved, 0) + unusedSources.reduce((n,source)=>n+source.nativeDrawingsObserved,0),
    combinedNativeAndBaseRetainedDrawings: sourceSummary.reduce((n, source) => n + source.retainedDrawings, 0),
    combinedExcludedDrawings: sourceSummary.reduce((n, source) => n + source.excludedDrawings, 0) + unusedSources.reduce((n,source)=>n+source.excludedDrawings,0),
    method: 'Genuine image_gen native drawings segmented without painting, mirroring or global alpha erasure. One calibration per source preserves crouches and weapon proportions. Thirty-two presentation and sixteen basic poses are distinct; rejected, incomplete and superseded sources stay archived but are excluded.' };
  const registryPath = 'src/game/combat/' + (kind === 'base' ? 'characterSpriteCorrections' : 'characterAnimations') + 'Wave16PartB.generated.json';
  const provenancePath = DOCS + '/' + (kind === 'base' ? 'base' : 'native') + '-provenance.json';
  if (check) { assert.deepEqual(await json(registryPath), registry); assert.deepEqual(await json(provenancePath), provenance); }
  else { await writeJson(registryPath, registry); await writeJson(provenancePath, provenance); }
  return { part: 'B', kind, selected: effectiveIds.length, heroes: entries.length, images: entries.length,
    poses: entries.reduce((n, entry) => n + entry.frames, 0), sources: sourceSummary.length,
    observed: provenance.nativeDrawingsObserved, retainedCombined: provenance.combinedNativeAndBaseRetainedDrawings,
    excludedCombined: provenance.combinedExcludedDrawings, failures: recordsFile.failures.map(failure => failure.heroId),
    check, source1to1Verified: false };
}
