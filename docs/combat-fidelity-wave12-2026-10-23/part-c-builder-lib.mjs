// Technical segmentation generalized from buildCombatEntityAssets.mjs. Only
// transparent seams, uniform scaling and packing: no synthesized body pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { HEROES_DB } from '../../src/game/heroes.js';
import { ABILITIES_WAVE12_PART_C } from '../../src/game/combat/abilities/abilitiesWave12PartC.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_C } from '../../src/game/combat/combatSourceDefinitionsWave12PartC.js';
const ROOT=path.resolve(import.meta.dirname,'../..');
const DOCS='docs/combat-fidelity-wave12-2026-10-23';
const PHASES=['intro','outro','roundVictory','roundDefeat','fatality','victory','defeat','super'];
const STATES=['idle','run','attack','hit'];
const read=p=>fs.readFile(path.resolve(ROOT,p));
const json=async p=>JSON.parse(await read(p));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const write=async(p,data)=>fs.writeFile(path.resolve(ROOT,p),JSON.stringify(data,null,2)+'\n');
function rowValleys(data, width, height, rowCount) {
  if (rowCount === 1) return [];
  const projection = Array.from({ length: height }, (_, y) => {
    let count = 0;
    for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3] > 24) count++;
    return count;
  });
  const smoothed = projection.map((_, y) => {
    let sum = 0;
    for (let dy = -2; dy <= 2; dy++) sum += projection[Math.max(0, Math.min(height - 1, y + dy))];
    return sum;
  });
  return Array.from({ length: rowCount - 1 }, (_, i) => {
    const expected = Math.round((i + 1) * height / rowCount);
    const radius = Math.round(height / rowCount * 0.44);
    const low = Math.max(1, expected - radius);
    const high = Math.min(height - 2, expected + radius);
    let minimum = Infinity;
    for (let y = low; y <= high; y++) minimum = Math.min(minimum, smoothed[y]);
    // Center a transparent gap instead of arbitrarily taking its first pixel.
    const choices = [];
    for (let y = low; y <= high; y++) if (smoothed[y] === minimum) choices.push(y);
    return choices[Math.floor(choices.length / 2)];
  });
}

// Dynamic programming finds the least opaque path through a bounded strip.
// This is alpha segmentation of native artwork, not replacement drawing.
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
  if (right < left || bottom < top) return null;
  return { left, top, width: right - left + 1, height: bottom - top + 1, pixels };
}

async function segmentAtlas(file, rowCount, columnCount) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 4);
  const { width, height } = info;
  const valleys = rowValleys(data, width, height, rowCount);
  const rowSeams = valleys.map(preferred => alphaSeam(width, Math.max(1, preferred - 30), Math.min(height - 2, preferred + 30), preferred,
    (x, y) => data[(y * width + x) * 4 + 3]));
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
    const columnSeams = Array.from({ length: columnCount - 1 }, (_, i) => i + 1).map(column => {
      const preferred = Math.round(column * width / columnCount);
      const radius = Math.round(width / columnCount * 0.43);
      return alphaSeam(rowHeight, preferred - radius, preferred + radius, preferred,
        (y, x) => rowData[(y * width + x) * 4 + 3]);
    });
    const frames = [];
    for (let column = 0; column < columnCount; column++) {
      const frameData = Buffer.alloc(rowData.length);
      for (let y = 0; y < rowHeight; y++) {
        const xStart = column === 0 ? 0 : columnSeams[column - 1][y];
        const xEnd = column === columnCount - 1 ? width : columnSeams[column][y];
        rowData.copy(frameData, (y * width + xStart) * 4, (y * width + xStart) * 4, (y * width + xEnd) * 4);
      }
      const bounds = boundsFor(frameData, width, rowHeight);
      frames.push({ data: frameData, width, height: rowHeight, bounds, centerX: (column + 0.5) * width / columnCount });
    }
    const seamSamples = columnSeams.flatMap(seam => [...seam].map((x, y) => rowData[(y * width + x) * 4 + 3]));
    rows.push({ frames, sourceBounds: { top: yStart, bottom: yEnd }, alphaValley: valleys[row] ?? null,
      seamReview: { crossedOpaquePixels: seamSamples.filter(alpha => alpha > 220).length, crossedVisiblePixels: seamSamples.filter(alpha => alpha > 24).length } });
  }
  return { width, height, rows, alpha: true, rowValleys: valleys };
}

async function reviewCells(bytes, labels) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, labels.length * 256);
  const cellHashes = [], rows = [];
  for (let row = 0; row < labels.length; row++) {
    const frameHashes = [], opaqueCounts = [];
    for (let col = 0; col < 4; col++) {
      const frame = Buffer.alloc(256 * 256 * 4); let opaque = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const at = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        if (data[at + 3] > 4) opaque++;
        if (data[at + 3] > 0) data.copy(frame, (y * 256 + x) * 4, at, at + 4);
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(data[at + 3], 0,
          `${labels[row]}/${col}: nonempty technical padding`);
      }
      assert.ok(opaque > 300, `${labels[row]}/${col}: empty pose`);
      frameHashes.push(sha(frame)); opaqueCounts.push(opaque);
    }
    assert.equal(new Set(frameHashes).size, 4, `${labels[row]}: copied cell`);
    cellHashes.push(...frameHashes); rows.push({ phase: labels[row], row, distinctFrames: 4, frameHashes, opaqueCounts });
  }
  assert.equal(new Set(cellHashes).size, cellHashes.length, 'Repeated pose across rows');
  return { distinctCells: cellHashes.length, cellHashes, phaseReviews: rows };
}

// Scale every source to one measured standing-body reference, then apply one
// common fit factor to this hero. A crouch is never stretched to standing height.
async function normalizedRow(row, scale) {
  const bottom = Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height));
  const layers = [], frameBounds = [];
  for (const [column, frame] of row.frames.entries()) {
    const b = frame.bounds, width = Math.max(1, Math.round(b.width * scale)), height = Math.max(1, Math.round(b.height * scale));
    const left = Math.round(128 + (b.left - frame.centerX) * scale);
    const top = Math.round(244 - (bottom - b.top) * scale);
    assert.ok(left >= 11 && top >= 11 && left + width <= 245 && top + height <= 245, 'Scaled body would be clipped');
    const input = await sharp(frame.data, { raw: { width: frame.width, height: frame.height, channels: 4 } })
      .extract({ left: b.left, top: b.top, width: b.width, height: b.height })
      .resize(width, height, { kernel: sharp.kernel.nearest }).png().toBuffer();
    layers.push({ input, left: column * 256 + left, top });
    frameBounds.push({ source: b, output: { left, top, width, height } });
  }
  const bytes = await sharp({ create: { width: 1024, height: 256, channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(layers).png({ compressionLevel: 9 }).toBuffer();
  return { bytes, frameBounds, scale, baseline: 244 };
}

export async function buildPartC(kind, { check = false } = {}) {
  assert.ok(['native', 'base'].includes(kind));
  const base = kind === 'base', labels = base ? STATES : PHASES;
  const plan = await json(`${DOCS}/part-c-generation-records.json`);
  const expectedIds = (await json(`${DOCS}/batch-plan-before.json`)).parts.C;
  assert.deepEqual(plan.records.map(record => record.heroId), expectedIds);
  const entries = [], provenanceSources = [], allCellHashes = new Set(), selectedCells = new Map();
  for (const record of plan.records) {
    assert.equal(record.reviewed, true, `${record.heroId}: independent source review is required`);
    const hero = HEROES_DB.find(hero => hero.id === record.heroId), kit = ABILITIES_WAVE12_PART_C[record.heroId];
    const definition = COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_C[record.heroId];
    assert.equal(hero.universe, definition.universe);
    const sources = new Map();
    for (const source of record.sources) {
      const bytes = await read(source.path), receipt = await json(source.receipt);
      assert.equal(receipt.hasImageUrl, true); assert.equal(receipt.generationArguments.transparent_background, true);
      assert.equal(sha(bytes), source.sha256, `${source.path}: archived source changed`);
      const metadata = await sharp(bytes).metadata();
      const segment = source.accepted ? await segmentAtlas(bytes, source.rows, source.columns) : null;
      const item = { ...source, heroId: hero.id, universe: hero.universe,
        width: metadata.width, height: metadata.height, provider: 'OpenAI', tool: 'image_gen',
        model: null, generationId: null, jobId: null, originalGeneratedPath: receipt.originalGeneratedPath,
        generationArguments: receipt.generationArguments,
        imagegenReferenceInputs: await Promise.all((receipt.generationArguments.referenced_image_paths || []).map(async p =>
          ({ path: p.replace(ROOT + '/', ''), sha256: sha(await read(p)) }))),
        sourceWork: definition.sourceWork, sourceReference: definition.sourceReference,
        source1to1Verified: false, networkVerified: false };
      provenanceSources.push(item); sources.set(source.key, { ...item, segment });
    }
    const mappings = [...record.nativeRows, ...record.baseRows];
    assert.equal(mappings.length, 12);
    const prepared = mappings.map((mapping, row) => {
      const source = sources.get(mapping.source); assert.equal(source?.accepted, true);
      const whole = source.segment.rows[mapping.sourceRow]; assert.ok(whole);
      assert.equal(whole.seamReview.crossedVisiblePixels, 0, `${hero.id}/${row}: visible pixels cross source seam`);
      const frames = mapping.sourceColumns.map(column => whole.frames[column]);
      assert.equal(frames.length, 4); assert.ok(frames.every(frame => frame?.bounds), `${hero.id}/${row}: selected source cell is empty`);
      for (const [i, frame] of frames.entries()) {
        const b = frame.bounds;
        assert.ok(b.left > 0 && b.left + b.width < source.width &&
          whole.sourceBounds.top + b.top > 0 && whole.sourceBounds.top + b.top + b.height < source.height,
        `${hero.id}/${row}/${i}: source silhouette touches canvas boundary`);
        const key = source.path + ':' + mapping.sourceRow + ':' + mapping.sourceColumns[i];
        assert.equal(selectedCells.has(key), false, `${hero.id}: source pose counted twice`);
        selectedCells.set(key, kind);
      }
      return { mapping, source, row: { ...whole, frames } };
    });
    let fitFactor = 1;
    for (const { source, row } of prepared) {
      assert.ok(source.referenceBodyHeight > 0);
      const scale = 190 / source.referenceBodyHeight;
      const top = Math.min(...row.frames.map(frame => frame.bounds.top));
      const bottom = Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height));
      const halfWidth = Math.max(...row.frames.map(frame => Math.max(frame.centerX - frame.bounds.left,
        frame.bounds.left + frame.bounds.width - frame.centerX)));
      fitFactor = Math.min(fitFactor, 224 / (halfWidth * 2 * scale), 224 / ((bottom - top) * scale));
    }
    const rows = [], composites = [], subset = base ? prepared.slice(8) : prepared.slice(0, 8);
    for (const [row, item] of subset.entries()) {
      const normalized = await normalizedRow(item.row, 190 / item.source.referenceBodyHeight * fitFactor);
      const { bytes: rowBytes, ...normalization } = normalized;
      composites.push({ input: rowBytes, left: 0, top: row * 256 });
      rows.push({ [base ? 'state' : 'phase']: labels[row], row, sourceImage: item.source.path,
        sourceImageSha256: item.source.sha256, sourceRow: item.mapping.sourceRow,
        sourceColumns: item.mapping.sourceColumns, sourceBounds: item.row.sourceBounds,
        sourceReferenceBodyHeight: item.source.referenceBodyHeight,
        targetReferenceBodyHeight: 190, sharedHeroFitFactor: fitFactor,
        renderScale: 1 / fitFactor,
        statureReview: { measurementKind: 'source-standing-body-reference',
          sourceBodyHeight: item.source.referenceBodyHeight,
          normalizedReferenceBodyHeight: 190 * fitFactor,
          restoredReferenceBodyHeight: 190,
          preservesNaturalPostureRatios: true,
          reason: 'Restore the common measured190px standing stature after conservative whole-equipment atlas packing; no anatomy or pose is stretched.' },
        ...normalization, ...item.row.seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: labels.length * 256, channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const review = await reviewCells(bytes, labels);
    for (const digest of review.cellHashes) { assert.equal(allCellHashes.has(digest), false); allCellHashes.add(digest); }
    const sheet = `/sprites/generated/combat-character-${base ? 'corrections' : 'animations'}-wave12-part-c/${hero.id}.png`;
    const active = subset.at(-1).source, archived = `${DOCS}/part-c-references/${hero.id}.png`;
    const referenceHash = sha(await read(`public${record.referenceAsset}`));
    assert.equal(sha(await read(archived)), referenceHash);
    entries.push({ id: hero.id, heroId: hero.id, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: labels.length * 256, columns: 4, rows: labels.length,
      frameWidth: 256, frameHeight: 256, frames: labels.length * 4,
      [base ? 'states' : 'phases']: Object.fromEntries(labels.map((phase, row) => [phase,
        { row, frames: 4, columns: 4, fps: phase === 'run' ? 10 : ['fatality', 'super'].includes(phase) ? 12 : 8,
          loop: base && ['idle', 'run'].includes(phase) }])),
      sha256: sha(bytes), alpha: true, sourceImage: active.path, sourceImageSha256: active.sha256,
      sourceDimensions: [active.width, active.height], generationArguments: active.generationArguments,
      sourceImages: [...sources.values()].map(({ segment: _segment, ...source }) => source),
      referenceAsset: record.referenceAsset, referenceAssetSha256: referenceHash, referenceImage: archived,
      sourceWork: definition.sourceWork, sourceReference: definition.sourceReference,
      abilityName: base ? kit.simple.name : kit.special.name, characterVersion: definition.sourceWork,
      provider: 'OpenAI', model: null, generationId: null, jobId: null,
      nativeCorrection: record.sources.length > 1,
      normalization: { method: 'alpha-valley-adaptive-seams-8-or-4columns-v1', baseline: 244,
        sharedStandingBodyReference: true, perHeroFitFactor: fitFactor, rows },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, technicalAlphaReviewed: true,
        ...review, canon1to1Verified: false, networkVerified: false, canonicalVerified: false,
        adaptedChoreography: true, fatalityIsExecution: false, sourceGameAsset: false, notes: record.reviewNotes } });
    if (check) assert.equal(sha(await read('public' + sheet)), sha(bytes), `${hero.id}: native reconstruction differs`);
    else {
      await fs.mkdir(path.dirname(path.resolve(ROOT, 'public' + sheet)), { recursive: true });
      await fs.writeFile(path.resolve(ROOT, 'public' + sheet), bytes);
      const contacts = path.resolve(ROOT, DOCS, `part-c-${kind}-contacts`);
      await fs.mkdir(contacts, { recursive: true });
      await sharp(bytes).resize(512, labels.length * 128, { kernel: sharp.kernel.nearest })
        .flatten({ background: '#141c2b' }).png().toFile(path.join(contacts, hero.id + '.png'));
    }
  }
  const registry = { schemaVersion: 1, source: 'OpenAI', entries };
  const registryPath = `src/game/combat/character${base ? 'SpriteCorrections' : 'Animations'}Wave12PartC.generated.json`;
  const provenancePath = `${DOCS}/${base ? 'base-' : ''}part-c-provenance.json`;
  const provenance = { schemaVersion: 1, date: '2026-10-23', part: 'C', kind,
    provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null,
    source1to1Verified: false, canon1to1Verified: false, networkVerified: false,
    method: 'Distinct native source cells only. Archived incorrect or clipped attempts are excluded. Technical alpha seams, source-calibrated uniform scaling and transparent packing; no redrawing, warping, mirroring or synthesized anatomy.',
    historicalReferences: 'Inspected old sprites are archived as context and counterexamples when their equipment or identity was incorrect; their existence is not proof of source accuracy.',
    selectedNativePoses: entries.reduce((n, entry) => n + entry.frames, 0),
    observedSourceCells: plan.records.reduce((n, record) => n + record.sources.reduce((m, source) => m + source.observedCells, 0), 0),
    sources: provenanceSources, records: plan.records, entries };
  if (check) {
    assert.deepEqual(await json(registryPath), registry);
    assert.deepEqual(await json(provenancePath), provenance);
  } else { await write(registryPath, registry); await write(provenancePath, provenance); }
  return { heroes: entries.length, rows: entries.length * labels.length, poses: allCellHashes.size,
    nativeSourceReconstruction: true, uniqueRgbaCells: true, alphaAndMargins: true,
    source1to1Verified: false, kind, check };
}

export { segmentAtlas as segmentPartCSource };

