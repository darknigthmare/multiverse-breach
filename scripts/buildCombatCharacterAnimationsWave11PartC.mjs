import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = 'docs/combat-fidelity-wave11-2026-10-23';
const PRESENTATION_HEROES = ["lilith_borderlands", "mordecai_borderlands", "roland_bl", "brick_bl", "claptrap_borderlands", "max", "furiosa", "nux", "toast_mm", "capable_mm"];
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const SUPER_NAMES = ["Phasewalk de Lilith", "Tir de précision de Mordecai", "Rafale du fusil de Roland", "Berserk de Brick", "Appel de service de Claptrap", "Décharge du fusil scié de Max", "Tir de précision de Furiosa", "Réparation du moteur par Nux", "Vérification des munitions par Toast", "Assistance au passage de Capable"];
const file = relative => path.resolve(ROOT, relative);
const read = relative => fs.readFile(file(relative));
const json = async relative => JSON.parse(await read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const write = (relative, data) => fs.writeFile(file(relative), `${JSON.stringify(data, null, 2)}\n`);

async function reviewPixels(bytes, labels) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, labels.length * 256);
  assert.equal((await sharp(bytes).metadata()).hasAlpha, true);
  const reviews = [], all = [];
  for (const [row, label] of labels.entries()) {
    const frameHashes = [];
    for (let col = 0; col < 4; col++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${label}/${col}: clipped pose`);
      }
      assert.ok(visible > 300, `${label}/${col}: empty pose`); frameHashes.push(hash(rgba));
    }
    assert.equal(new Set(frameHashes).size, 4, `${label}: repeated frame`);
    all.push(...frameHashes); reviews.push({ [labels.length === 8 ? 'phase' : 'state']: label, row, distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(all).size, labels.length * 4, 'reused pose between rows');
  return { distinctCells: all.length, [labels.length === 8 ? 'phaseReviews' : 'stateReviews']: reviews };
}

async function sourcesFor(record, prefix) {
  return Promise.all(record.sources.map(async source => {
    const bytes = await read(source.archivedPath), metadata = await sharp(bytes).metadata();
    return { ...source, heroId: record.heroId, universe: record.universe, sourceWork: record.sourceWork,
      ability: record.ability, sha256: hash(bytes), sourceDimensions: [metadata.width, metadata.height],
      prompt: (await read(source.promptFile)).toString(), provider: 'OpenAI', tool: 'image_gen',
      model: null, generationId: null, jobId: null, transparentBackgroundRequested: true,
      generationArguments: source.generationArguments,
      referenceAsset: record.referenceAsset, referenceAssetSha256: hash(await read(`public${record.referenceAsset}`)),
      referenceArchive: `${DOCS}/${prefix}references/${record.heroId}.png`,
      referenceArchiveSha256: hash(await read(`${DOCS}/${prefix}references/${record.heroId}.png`)),
      imagegenReferenceInputs: await Promise.all(source.referenceImages.map(async input => ({ path: input, sha256: hash(await read(input)) }))),
      sourceReference: record.sourceReference, visuallyReviewed: record.reviewed,
      networkVerified: false, canon1to1Verified: false };
  }));
}

// Technical alpha segmentation of unequal human/loader rows. The seven reviewed
// native alpha-gap guides prevent the generic equal-row prior selecting one gap twice.
function alphaSeam(length, low, high, preferred, alphaAt) {
  const span = high - low + 1;
  let previous = new Float64Array(span);
  const parents = Array.from({ length }, () => new Int16Array(span));
  const cost = (step, value) => {
    const alpha = alphaAt(step, value);
    return alpha * alpha + (value - preferred) ** 2 * 0.035;
  };
  for (let v = 0; v < span; v++) previous[v] = cost(0, low + v);
  for (let step = 1; step < length; step++) {
    const current = new Float64Array(span);
    for (let v = 0; v < span; v++) {
      let best = Infinity;
      let bestParent = v;
      for (let dv = -2; dv <= 2; dv++) {
        const p = v + dv;
        if (p < 0 || p >= span) continue;
        const candidate = previous[p] + Math.abs(dv) * 1.5;
        if (candidate < best) { best = candidate; bestParent = p; }
      }
      current[v] = best + cost(step, low + v);
      parents[step][v] = bestParent;
    }
    previous = current;
  }
  let at = 0;
  for (let v = 1; v < span; v++) if (previous[v] < previous[at]) at = v;
  const result = new Int32Array(length);
  for (let step = length - 1; step >= 0; step--) {
    result[step] = low + at;
    at = parents[step][at];
  }
  return result;
}

function boundsFor(data, width, height) {
  let left = width, top = height, right = -1, bottom = -1, pixels = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] <= 4) continue;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y); pixels++;
  }
  assert.ok(right >= left && bottom >= top, 'Native frame has no visible subject');
  return { left, top, width: right - left + 1, height: bottom - top + 1, pixels };
}

async function segmentGuidedAtlas(file, rowCount, guides) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 4);
  const { width, height } = info;
  const valleys = guides;
  assert.equal(valleys.length, rowCount - 1);
  const rowSeams = valleys.map(preferred => alphaSeam(width, Math.max(1, preferred - 30), Math.min(height - 2, preferred + 30), preferred,
    (x, y) => data[(y * width + x) * 4 + 3]));
  const rowSeamSamples = rowSeams.flatMap(seam => [...seam].map((y, x) => data[(y * width + x) * 4 + 3]));
  assert.equal(rowSeamSamples.filter(a => a > 220).length, 0, "Guided row seam crosses opaque native pixels");
  const rows = [];
  for (let row = 0; row < rowCount; row++) {
    const yStart = row === 0 ? 0 : Math.min(...rowSeams[row - 1]);
    const yEnd = row === rowCount - 1 ? height : Math.max(...rowSeams[row]) + 1;
    const rowHeight = yEnd - yStart;
    const rowData = Buffer.alloc(width * rowHeight * 4);
    for (let y = yStart; y < yEnd; y++) for (let x = 0; x < width; x++) {
      if (row > 0 && y < rowSeams[row - 1][x]) continue;
      if (row < rowCount - 1 && y >= rowSeams[row][x]) continue;
      const sourceOffset = (y * width + x) * 4;
      data.copy(rowData, ((y - yStart) * width + x) * 4, sourceOffset, sourceOffset + 4);
    }
    const columnSeams = [1, 2, 3].map(column => {
      const preferred = Math.round(column * width / 4);
      const radius = Math.round(width / 4 * 0.37);
      return alphaSeam(rowHeight, preferred - radius, preferred + radius, preferred,
        (y, x) => rowData[(y * width + x) * 4 + 3]);
    });
    const frames = [];
    for (let column = 0; column < 4; column++) {
      const frameData = Buffer.alloc(rowData.length);
      for (let y = 0; y < rowHeight; y++) {
        const xStart = column === 0 ? 0 : columnSeams[column - 1][y];
        const xEnd = column === 3 ? width : columnSeams[column][y];
        rowData.copy(frameData, (y * width + xStart) * 4, (y * width + xStart) * 4, (y * width + xEnd) * 4);
      }
      const bounds = boundsFor(frameData, width, rowHeight);
      frames.push({ data: frameData, width, height: rowHeight, bounds, centerX: (column + 0.5) * width / 4 });
    }
    const seamSamples = columnSeams.flatMap(seam => [...seam].map((x, y) => rowData[(y * width + x) * 4 + 3]));
    rows.push({ frames, sourceBounds: { top: yStart, bottom: yEnd }, alphaValley: valleys[row] ?? null,
      seamReview: { crossedOpaquePixels: seamSamples.filter(alpha => alpha > 220).length, crossedVisiblePixels: seamSamples.filter(alpha => alpha > 24).length } });
  }
  return { width, height, rows, alpha: true, rowValleys: valleys };
}

async function segmentNativeSource(source) {
  const atlas = source.rowCuts
    ? await segmentGuidedAtlas(file(source.archivedPath), source.nativeRowCount, source.rowCuts.slice(1, -1))
    : await segmentAtlas(file(source.archivedPath), source.nativeRowCount);
  // Retained source rows must be whole. Archived rejected/cropped rows may
  // remain in the same immutable source; their explicit exclusion is audited.
  for (const index of source.sourceRowsUsed || atlas.rows.map((_, i) => i)) {
    const row = atlas.rows[index]; let clipped = 0;
    for (const frame of row.frames) for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) {
      if (x !== 0 && x !== frame.width - 1 && !(row.sourceBounds.top === 0 && y === 0) && !(row.sourceBounds.bottom === atlas.height && y === frame.height - 1)) continue;
      if (frame.data[(y * frame.width + x) * 4 + 3] > 24) clipped++;
    }
    assert.equal(clipped, 0, `${source.archivedPath}/row${index}: source edge clips retained subject`);
  }
  return atlas;
}

export async function buildNativeWave11PartC({ base = false, check = false, draft = false } = {}) {
  const EXPECTED = PRESENTATION_HEROES;
  const labels = base ? ['idle', 'run', 'attack', 'hit'] : PHASES, prefix = base ? 'base-part-c-' : 'part-c-';
  const registryPath = `src/game/combat/${base ? 'characterSpriteCorrections' : 'characterAnimations'}Wave11PartC.generated.json`;
  const provenancePath = `${DOCS}/${prefix}provenance.json`, recordsPath = `${DOCS}/${prefix}generation-records.json`;
  const { records } = await json(recordsPath);
  assert.deepEqual(records.map(record => record.heroId), EXPECTED);
  if (check) {
    const registry = await json(registryPath), provenance = await json(provenancePath), unique = new Set(), atlases = new Map();
    assert.deepEqual(registry.entries.map(entry => entry.heroId), EXPECTED);
    assert.equal(provenance.sources.length, records.reduce((total, record) => total + record.sources.length, 0));
    for (const source of provenance.sources) {
      assert.equal(hash(await read(source.archivedPath)), source.sha256);
      assert.equal((await read(source.promptFile)).toString(), source.prompt);
      assert.equal(source.generationArguments.prompt, source.prompt); assert.equal(source.generationArguments.transparent_background, true);
      assert.equal(hash(await read(source.referenceArchive)), source.referenceArchiveSha256);
      for (const input of source.imagegenReferenceInputs) assert.equal(hash(await read(input.path)), input.sha256);
      assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
    }
    if (!base) {
      const evidence = provenance.nativeEmitterMeasurements;
      assert.equal(hash(await read(evidence.path)), evidence.sha256);
      assert.equal(hash(await read(evidence.anchorsPath)), evidence.anchorsSha256);
      const anchors = await json(evidence.anchorsPath), proof = await json(evidence.path);
      assert.equal(proof.measurements.length, 24);
      assert.deepEqual(Object.keys(anchors).sort(), ["mordecai_borderlands", "roland_bl", "max", "furiosa"].sort());
      for (const measured of proof.measurements) {
        const entry = registry.entries.find(e => e.heroId === measured.heroId), point = anchors[measured.heroId][measured.phase][measured.column];
        assert.deepEqual(point, measured.point); assert.equal(entry.sha256, measured.normalizedPngSha256);
        const raw = await sharp(await read(`public${entry.sheet}`)).ensureAlpha().raw().toBuffer(), row = entry.phases[measured.phase].row, roi = Buffer.alloc(9 * 9 * 4); let i = 0;
        for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
          const at = ((row * 256 + point.y + dy) * 1024 + measured.column * 256 + point.x + dx) * 4;
          raw.copy(roi, i++ * 4, at, at + 4);
        }
        assert.equal(hash(roi), measured.rgbaSha256);
        assert.ok(raw[((row * 256 + point.y) * 1024 + measured.column * 256 + point.x) * 4 + 3] > 24);
      }
    }
    for (const [index, entry] of registry.entries.entries()) {
      assert.equal(entry.universe, HEROES_DB.find(hero => hero.id === entry.heroId).universe);
      assert.equal(entry.abilityName, resolveCombatAbility(HEROES_DB.find(hero => hero.id === entry.heroId), base ? 'simple' : 'special').name);
      if (!base) assert.equal(entry.abilityName, SUPER_NAMES[index]);
      const bytes = await read(`public${entry.sheet}`); assert.equal(hash(bytes), entry.sha256);
      const review = await reviewPixels(bytes, labels), key = base ? 'stateReviews' : 'phaseReviews';
      assert.deepEqual(review[key], entry.visualValidation[key]);
      for (const row of review[key]) for (const digest of row.frameHashes) { assert.equal(unique.has(digest), false); unique.add(digest); }
      const composites = [];
      for (const [row, label] of labels.entries()) {
        const source = entry.normalization.rows[row], declared = records[index].rows[row];
        const lineage = provenance.sources.find(value => value.heroId === entry.heroId && value.key === declared.source);
        assert.ok(lineage?.accepted); assert.equal(source.sourceImage, lineage.archivedPath); assert.equal(source.sourceRow, declared.sourceRow);
        assert.equal(hash(await read(source.sourceImage)), source.sourceImageSha256); assert.equal(source.crossedOpaquePixels, 0);
        const measured = records[index].statureByRow?.[label];
        assert.deepEqual(source.renderScale, measured?.renderScale); assert.deepEqual(source.statureReview, measured?.statureReview);
        if (measured) {
          const roi = measured.statureReview;
          assert.equal(roi.measurementKind, 'visual-body-roi'); assert.equal(roi.excludesWeaponEffects, true);
          assert.equal(roi.bodyBounds[3], roi.normalizedBodyHeight); assert.equal(roi.referenceBodyBounds[3], roi.referenceBodyHeight);
          assert.ok(measured.renderScale >= 0.5 && measured.renderScale <= 3);
          assert.ok(roi.nativeComparableBodyHeight > 0 && roi.nativeReferenceBodyHeight > 0);
          assert.ok(Math.abs(measured.renderScale * roi.normalizedBodyHeight - roi.referenceBodyHeight * (roi.referenceRenderScale ?? 1) * roi.nativeComparableBodyHeight / roi.nativeReferenceBodyHeight) < 1);
        }
        if (!atlases.has(source.sourceImage)) atlases.set(source.sourceImage, await segmentNativeSource(lineage));
        const normalized = await normalizeRow(atlases.get(source.sourceImage).rows[source.sourceRow]);
        composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      }
      const rebuilt = await sharp({ create: { width: 1024, height: labels.length * 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
      assert.equal(hash(rebuilt), entry.sha256, `${entry.heroId}: source-row reconstruction differs`);
      assert.equal(hash(await read(`public${entry.referenceAsset}`)), entry.referenceAssetSha256);
      assert.equal(entry.visualValidation.identityReviewed, true); assert.equal(entry.visualValidation.allFramesReviewed, true);
      assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    }
    assert.equal(unique.size, EXPECTED.length * labels.length * 4);
    return { heroes: EXPECTED.length, rows: labels.length * EXPECTED.length, poses: unique.size, nativeSources: provenance.sources.length,
      distinctRgbaPoses: unique.size, sourceAndReferenceHashes: true, nativeRowReconstructionMatches: true,
      alphaAndMargins: true, visualReviewComplete: registry.entries.every(entry => entry.visualValidation.identityReviewed && entry.visualValidation.allFramesReviewed), canon1to1Verified: false, networkVerified: false };
  }
  const entries = [], sources = [];
  for (const [index, record] of records.entries()) {
    const hero = HEROES_DB.find(value => value.id === record.heroId); assert.equal(hero?.universe, record.universe);
    const ability = resolveCombatAbility(hero, base ? 'simple' : 'special'); if (!base && !draft) assert.equal(ability.name, SUPER_NAMES[index]);
    const nativeSources = await sourcesFor(record, prefix); sources.push(...nativeSources);
    const atlases = new Map(), composites = [], rows = [];
    for (const [row, label] of labels.entries()) {
      const declared = record.rows[row], source = nativeSources.find(source => source.key === declared.source); assert.ok(source?.accepted);
      if (!atlases.has(source.key)) atlases.set(source.key, await segmentNativeSource(source));
      const selected = atlases.get(source.key).rows[declared.sourceRow];
      assert.equal(selected.seamReview.crossedOpaquePixels, 0, `${hero.id}/${label}: opaque native silhouette crosses cell seam`);
      const normalized = await normalizeRow(selected); composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      rows.push({ [base ? 'state' : 'phase']: label, row, sourceImage: source.archivedPath, sourceImageSha256: source.sha256,
        sourceRow: declared.sourceRow, sourceBounds: selected.sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selected.seamReview, ...(record.statureByRow?.[label] || {}) });
    }
    const bytes = await sharp({ create: { width: 1024, height: labels.length * 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const review = await reviewPixels(bytes, labels), sheet = `/sprites/generated/${base ? 'combat-character-corrections' : 'combat-character-animations'}-wave11/${record.heroId}.png`;
    await fs.mkdir(path.dirname(file(`public${sheet}`)), { recursive: true }); await fs.writeFile(file(`public${sheet}`), bytes);
    await sharp(bytes).resize(512, labels.length * 128, { kernel: sharp.kernel.nearest }).flatten({ background: '#141c2b' }).png().toFile(file(`${DOCS}/${prefix}contacts/${record.heroId}.png`));
    const active = nativeSources.find(source => source.key === record.rows.at(-1).source), initial = nativeSources[0];
    entries.push({ id: hero.id, heroId: hero.id, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: labels.length * 256, columns: 4, rows: labels.length, frameWidth: 256, frameHeight: 256, frames: labels.length * 4,
      [base ? 'states' : 'phases']: Object.fromEntries(labels.map((label, row) => [label, { row, frames: 4, columns: 4, fps: base ? label === 'run' ? 10 : 8 : ['fatality', 'super'].includes(label) ? 12 : 8, loop: base && ['idle', 'run'].includes(label) }])),
      sha256: hash(bytes), alpha: true, sourceImage: active.archivedPath, sourceImageSha256: active.sha256, sourceDimensions: active.sourceDimensions,
      generationArguments: active.generationArguments,
      referenceAsset: record.referenceAsset, referenceAssetSha256: initial.referenceAssetSha256, referenceImage: initial.referenceArchive,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: ability.name, characterVersion: record.version,
      provider: 'OpenAI', model: null, generationId: null, jobId: null, nativeCorrection: nativeSources.length > 1,
      originalSourceImage: nativeSources.length > 1 ? initial.archivedPath : null, originalSourceImageSha256: nativeSources.length > 1 ? initial.sha256 : null,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', [base ? 'sharedScalePerState' : 'sharedScalePerPhase']: true, baseline: 244, rows },
      visualValidation: { identityReviewed: record.reviewed, allFramesReviewed: record.reviewed, technicalAlphaReviewed: true, ...review,
        canon1to1Verified: false, networkVerified: false, canonicalVerified: false, adaptedChoreography: true, fatalityIsExecution: false, sourceGameAsset: false,
        notes: record.reviewNotes || `${record.version} Native generated artwork and adapted choreography, not official frames or1:1 verified animation.` } });
  }
  await write(registryPath, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(provenancePath, { schemaVersion: 1, date: '2026-10-23', part: 'C', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null,
    networkVerified: false, canon1to1Verified: false, method: 'Real native image_gen artwork, including declared corrective attempts. Sharp only segments existing alpha silhouettes, uniformly scales source rows, pads and packs genuine distinct poses. No procedural anatomy, mirrors or synthesized duplicate cells. Source-row lineage and rejected attempts are retained. Renderer-only measured body/pilot-ROI scales retain native posture ratios; bent poses remain bent.',
    sourceAccess: 'Local old sprites and effective kits inspected before generation. Borderlands2009 and FuryRoad2015 facts and access limits are archived in part-c-source-facts.json. Incorrect old Roland/Brick/Toast versions are counterexamples, not visual authority. Prompt-based new native identities and accepted native references are distinguished from historical context. No official frames or provider IDs are fabricated.',
    ...(!base && !draft ? { nativeEmitterMeasurements: { path: `${DOCS}/part-c-muzzle-measurements.json`, sha256: hash(await read(`${DOCS}/part-c-muzzle-measurements.json`)), anchorsPath: 'src/game/combat/nativeSuperAnchorsWave11PartC.generated.json', anchorsSha256: hash(await read('src/game/combat/nativeSuperAnchorsWave11PartC.generated.json')) } } : {}),
    generationRecords: records, unavailableAttempts: (await json(recordsPath)).unavailableAttempts || [], sources, entries,
    renderStatureCorrections: entries.flatMap(entry => entry.normalization.rows.filter(row => row.statureReview).map(row => ({ heroId: entry.heroId, row: row.row, renderScale: row.renderScale, statureReview: row.statureReview, unchangedPngSha256: entry.sha256 }))) });
  return draft ? { draft: true, entries: entries.length } : buildNativeWave11PartC({ base, check: true });
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) console.log(JSON.stringify(await buildNativeWave11PartC({ check: process.argv.includes('--check'), draft: process.argv.includes('--draft') })));
