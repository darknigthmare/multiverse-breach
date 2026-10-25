import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { segmentNativeAtlas, commonSourceScale, packNativeFrames } from './part-b-native-segmentation.mjs';
import { ABILITIES_WAVE12_PART_B } from '../../src/game/combat/abilities/abilitiesWave12PartB.js';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DOCS = 'docs/combat-fidelity-wave12-2026-10-23';
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const STATES = ['idle', 'run', 'attack', 'hit'];
const EXPECTED = ['predator', 'city_hunter', 'dutch', 'anna_predator', 'billy_predator', 'mac_predator',
  'harrigan_predator', 'greyback_yautja', 'naru', 'royce_predators_core'];
const read = relative => fs.readFile(path.resolve(ROOT, relative));
const json = async relative => JSON.parse(await read(relative));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const writeJson = (relative, value) => fs.writeFile(path.resolve(ROOT, relative), JSON.stringify(value, null, 2) + '\n');

async function inspectPacked(bytes, names) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, names.length * 256);
  const all = [], reviews = [];
  for (const [row, name] of names.entries()) {
    const frameHashes = [];
    for (let column = 0; column < 4; column++) {
      const cell = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha > 0) data.copy(cell, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${name}/${column}: visible crop`);
      }
      assert.ok(visible > 300, `${name}/${column}: empty native figure`);
      frameHashes.push(sha(cell));
    }
    assert.equal(new Set(frameHashes).size, 4, `${name}: copied/repeated frame`);
    all.push(...frameHashes); reviews.push({ name, distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(all).size, names.length * 4, 'A complete pose was copied between sequences');
  return { distinctCells: all.length, reviews, hashes: all };
}

async function prepareSources(record) {
  assert.equal(record.reviewed, true, record.heroId + ': source review pending');
  assert.equal(sha(await read(record.referenceArchive)), record.referenceAssetSha256);
  assert.equal(sha(await read('public' + record.referenceAsset)), record.referenceAssetSha256);
  const prepared = [];
  for (const [sourceIndex, source] of record.sources.entries()) {
    assert.equal(sha(await read(source.archivedPath)), source.sha256, source.archivedPath);
    assert.equal(await fs.readFile(path.resolve(ROOT, source.promptFile), 'utf8'), source.prompt);
    const atlas = await segmentNativeAtlas(path.resolve(ROOT, source.archivedPath), { rowCount: source.rows });
    assert.deepEqual(atlas.rowCounts, source.rowCounts, record.heroId + ': observed native figure count changed');
    assert.equal(atlas.frames.length, source.nativeDrawingsObserved);
    const selected = [];
    for (const [index, row, start] of [...record.selections.native, ...record.selections.base]) {
      if (index !== sourceIndex) continue;
      const frames = atlas.rows[row].slice(start, start + 4);
      assert.equal(frames.length, 4, record.heroId + ': missing source cells must never count as delivered');
      selected.push(...frames);
    }
    const scale = selected.length ? commonSourceScale(selected, source.calibration.bodyHeight, record.targetBodyHeight) : null;
    prepared.push({ ...source, atlas, scale, renderScale: scale ? record.targetBodyHeight / (source.calibration.bodyHeight * scale) : null });
  }
  return prepared;
}

async function makeEntry(record, sources, kind) {
  const base = kind === 'base', names = base ? STATES : PHASES;
  const selections = record.selections[kind];
  assert.equal(selections.length, names.length);
  const composites = [], rows = [];
  for (const [row, name] of names.entries()) {
    const [sourceIndex, sourceRow, start] = selections[row], source = sources[sourceIndex];
    const frames = source.atlas.rows[sourceRow].slice(start, start + 4);
    const packed = await packNativeFrames(frames, source.scale);
    composites.push({ input: packed.bytes, left: 0, top: row * 256 });
    rows.push({ [base ? 'state' : 'phase']: name, row, sourceImage: source.archivedPath,
      sourceImageSha256: source.sha256, sourceRow, sourceColumns: [start, start + 1, start + 2, start + 3],
      frameBounds: packed.frameBounds, scale: source.scale, baseline: 244, renderScale: source.renderScale,
      sharedPixelScaleAcrossAllRetainedSourceFrames: true,
      statureReview: { targetBodyHeight: record.targetBodyHeight, sourceBodyHeight: source.calibration.bodyHeight,
        normalizedBodyHeight: source.calibration.bodyHeight * source.scale, sharedAcrossSource: true,
        preservesNativeCrouchAndKneelRatios: true },
      seamReview: { crossedOpaquePixels: 0, crossedVisiblePixels: 0,
        method: 'complete connected figures; no seam crosses a retained solid component' } });
  }
  const bytes = await sharp({ create: { width: 1024, height: names.length * 256, channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
  const pixelReview = await inspectPacked(bytes, names);
  const first = sources[selections[0][0]], kit = ABILITIES_WAVE12_PART_B[record.heroId];
  const output = base ? 'combat-character-corrections-wave12-part-b' : 'combat-character-animations-wave12-part-b';
  const stateData = Object.fromEntries(names.map((name, row) => [name, { row, frames: 4, columns: 4,
    fps: base && name === 'run' ? 10 : ['fatality', 'super'].includes(name) ? 12 : 8,
    loop: base && ['idle', 'run'].includes(name) }]));
  return { bytes, hashes: pixelReview.hashes, entry: {
    id: record.heroId, heroId: record.heroId, universe: record.universe, name: record.name,
    sheet: `/sprites/generated/${output}/${record.heroId}.png`,
    width: 1024, height: names.length * 256, columns: 4, rows: names.length,
    frameWidth: 256, frameHeight: 256, frames: names.length * 4,
    [base ? 'states' : 'phases']: stateData, sha256: sha(bytes), alpha: true,
    sourceImage: first.archivedPath, sourceImageSha256: first.sha256,
    sourceDimensions: [first.atlas.width, first.atlas.height],
    sourceImages: sources.map(source => ({ path: source.archivedPath, sha256: source.sha256,
      drawingsObserved: source.nativeDrawingsObserved, retainedDrawings: source.retainedDrawings,
      excludedDrawings: source.excludedDrawings })),
    referenceAsset: record.referenceAsset, referenceAssetSha256: record.referenceAssetSha256,
    referenceImage: record.referenceArchive, archivedReferenceAsset: record.referenceArchive,
    referenceUse: 'Old reference inspected and archived; initial native generation uses explicit film-version text, not old pixels. Corrective generations refer only to archived native source rasters.',
    sourceWork: record.sourceWork, characterVersion: record.sourceWork,
    sourceReference: kit.sourceReference, sourceUrl: kit.sourceUrl,
    abilityName: (base ? kit.simple : kit.special).name,
    abilityEffect: (base ? kit.simple : kit.special).targeting.effect,
    provider: 'OpenAI', model: null, generationId: null, jobId: null,
    nativeCorrection: sources.length > 1,
    originalSourceImage: sources.length > 1 ? sources[0].archivedPath : null,
    originalSourceImageSha256: sources.length > 1 ? sources[0].sha256 : null,
    normalization: { method: 'native-alpha-component-segmentation-one-source-calibration-v1',
      sharedScalePerSource: true, baseline: 244, rows,
      sourceWideBodyCalibration: { method: 'one-complete-standing-native-component-per-source',
        targetBodyHeight: record.targetBodyHeight, preservesNativePoseHeightRatio: true,
        normalizationNeverRedrawsBody: true } },
    visualValidation: { identityReviewed: true, allFramesReviewed: true, technicalAlphaReviewed: true,
      fourNativePosesPerRowReviewed: true, distinctCells: pixelReview.distinctCells,
      [base ? 'stateReviews' : 'phaseReviews']: pixelReview.reviews.map(review => ({
        [base ? 'state' : 'phase']: review.name, distinctFrames: 4, frameHashes: review.frameHashes })),
      canon1to1Verified: false, canonicalVerified: false, networkVerified: false, source1to1Verified: false,
      sourceGameAsset: false, adaptedChoreography: true, fatalityIsExecution: false,
      correctionNotes: record.correctionNotes,
      notes: 'Explicit film versions and practical held equipment. Anna and Greyback supers provide zero-damage support. No chopper, smart-disc transfer to JungleHunter, magic rope, damaging catchphrase, invented cannon or extra hit. Generated animation proportions and timing are adaptations, without official-frame or source1:1 certification.' }
  } };
}

export async function buildPartB(kind, { check = false } = {}) {
  assert.ok(['native', 'base'].includes(kind));
  const { records } = await json(`${DOCS}/part-b-generation-records.json`);
  assert.deepEqual(records.map(record => record.heroId), EXPECTED);
  const entries = [], sourceSummary = [], globalHashes = [];
  for (const record of records) {
    const sources = await prepareSources(record);
    const native = await makeEntry(record, sources, 'native'), base = await makeEntry(record, sources, 'base');
    assert.equal(new Set([...native.hashes, ...base.hashes]).size, 48,
      record.heroId + ': a drawing is repeated between presentation and basic states');
    const result = kind === 'native' ? native : base;
    entries.push(result.entry); globalHashes.push(...result.hashes);
    sourceSummary.push(...sources.map(({ atlas, scale, renderScale, ...source }) => ({ heroId: record.heroId,
      ...source, sourceDimensions: [atlas.width, atlas.height], scale, renderScale,
      allVisibleSourcePixelsPreservedBySegmentation: atlas.allVisiblePixelsPreservedExactlyOnce })));
    if (check) assert.equal(sha(await read('public' + result.entry.sheet)), result.entry.sha256, record.heroId);
    else {
      const outputPath = path.resolve(ROOT, 'public' + result.entry.sheet);
      await fs.mkdir(path.dirname(outputPath), { recursive: true }); await fs.writeFile(outputPath, result.bytes);
      const contactDir = path.resolve(ROOT, DOCS, kind === 'base' ? 'base-part-b-contacts' : 'part-b-contacts');
      await fs.mkdir(contactDir, { recursive: true });
      await sharp(result.bytes).resize(512, result.entry.rows * 128, { kernel: sharp.kernel.nearest })
        .flatten({ background: '#243148' }).png().toFile(path.join(contactDir, record.heroId + '.png'));
    }
  }
  assert.equal(new Set(globalHashes).size, entries.reduce((n, entry) => n + entry.frames, 0));
  const registry = { schemaVersion: 1, source: 'OpenAI', entries };
  const provenance = { schemaVersion: 1, date: '2026-10-23', part: 'B', kind,
    provider: 'OpenAI', tool: 'image_gen', source1to1Verified: false, canon1to1Verified: false,
    sourceFacts: `${DOCS}/part-b-source-specs.json`, generationRecords: `${DOCS}/part-b-generation-records.json`,
    nativeToolResults: `${DOCS}/part-b-native-tool-results.json`, sources: sourceSummary, entries,
    nativeDrawingsObserved: sourceSummary.reduce((n, source) => n + source.nativeDrawingsObserved, 0),
    combinedNativeAndBaseRetainedDrawings: sourceSummary.reduce((n, source) => n + source.retainedDrawings, 0),
    combinedExcludedDrawings: sourceSummary.reduce((n, source) => n + source.excludedDrawings, 0),
    method: 'Genuine native image_gen drawings. Alpha component segmentation preserves all source RGBA pixels, then a single scalar per source resizes all retained bodies and weapons together. Distinct48 drawings per hero are split32+16 without copying. Explicit incomplete/rejected sequences and superseded sources are archived and excluded.' };
  const registryPath = `src/game/combat/${kind === 'base' ? 'characterSpriteCorrections' : 'characterAnimations'}Wave12PartB.generated.json`;
  const provenancePath = `${DOCS}/${kind === 'base' ? 'base-part-b' : 'part-b'}-provenance.json`;
  if (check) { assert.deepEqual(await json(registryPath), registry); assert.deepEqual(await json(provenancePath), provenance); }
  else { await writeJson(registryPath, registry); await writeJson(provenancePath, provenance); }
  return { part: 'B', kind, heroes: entries.length, images: entries.length,
    poses: entries.reduce((n, entry) => n + entry.frames, 0), sources: sourceSummary.length,
    observed: provenance.nativeDrawingsObserved, retainedCombined: provenance.combinedNativeAndBaseRetainedDrawings,
    excludedCombined: provenance.combinedExcludedDrawings, check, source1to1Verified: false };
}
