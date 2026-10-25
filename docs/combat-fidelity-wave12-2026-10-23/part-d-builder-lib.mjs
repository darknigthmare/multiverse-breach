// Technical segmentation and packing of archived, genuinely generated pixels.
// No drawing, pose interpolation, mirroring or anatomy reconstruction occurs.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_D as DEFINITIONS } from '../../src/game/combat/combatSourceDefinitionsWave12PartD.js';
import { ABILITIES_WAVE12_PART_D as ABILITIES } from '../../src/game/combat/abilities/abilitiesWave12PartD.js';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DOCS = 'docs/combat-fidelity-wave12-2026-10-23';
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const STATES = ['idle', 'run', 'attack', 'hit'];
const file = relative => path.resolve(ROOT, relative);
const read = relative => fs.readFile(file(relative));
const json = async relative => JSON.parse(await read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const writeJson = (relative, value) => fs.writeFile(file(relative), JSON.stringify(value, null, 2) + '\n');

function seam(length, low, high, preferred, alphaAt) {
  const span = high - low + 1, parents = Array.from({ length }, () => new Int16Array(span));
  const cost = (step, value) => alphaAt(step, value) ** 2 + (value - preferred) ** 2 * 0.035;
  let previous = Float64Array.from({ length: span }, (_, i) => cost(0, low + i));
  for (let step = 1; step < length; step++) {
    const current = new Float64Array(span);
    for (let i = 0; i < span; i++) {
      let best = Infinity, parent = i;
      for (let di = -2; di <= 2; di++) {
        const k = i + di;
        if (k < 0 || k >= span) continue;
        const candidate = previous[k] + Math.abs(di) * 1.5;
        if (candidate < best) { best = candidate; parent = k; }
      }
      current[i] = best + cost(step, low + i); parents[step][i] = parent;
    }
    previous = current;
  }
  let i = 0;
  for (let k = 1; k < span; k++) if (previous[k] < previous[i]) i = k;
  const result = new Int32Array(length);
  for (let step = length - 1; step >= 0; step--) { result[step] = low + i; i = parents[step][i]; }
  return result;
}

function visibleBounds(data, width, height) {
  let left = width, top = height, right = -1, bottom = -1, pixels = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] <= 4) continue;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y); pixels++;
  }
  assert.ok(right >= left && bottom >= top, 'Empty native drawing');
  return { left, top, width: right - left + 1, height: bottom - top + 1, pixels };
}

async function segment(source) {
  const bytes = await read(source.path);
  assert.equal(hash(bytes), source.sha256, source.path + ': source changed');
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const projection = Array.from({ length: height }, (_, y) => {
    let count = 0;
    for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3] > 24) count++;
    return count;
  });
  const valleys = Array.from({ length: source.rows - 1 }, (_, i) => {
    const expected = Math.round((i + 1) * height / source.rows), radius = Math.round(height / source.rows * 0.35);
    let minimum = Infinity, choices = [];
    for (let y = Math.max(1, expected - radius); y <= Math.min(height - 2, expected + radius); y++) {
      const count = projection[y];
      if (count < minimum) { minimum = count; choices = [y]; }
      else if (count === minimum) choices.push(y);
    }
    return choices[Math.floor(choices.length / 2)];
  });
  const rowSeams = valleys.map(v => seam(width, Math.max(1, v - 18), Math.min(height - 2, v + 18), v,
    (x, y) => data[(y * width + x) * 4 + 3]));
  const rows = [];
  for (let row = 0; row < source.rows; row++) {
    const y0 = row === 0 ? 0 : Math.min(...rowSeams[row - 1]);
    const y1 = row === source.rows - 1 ? height : Math.max(...rowSeams[row]) + 1;
    const rowHeight = y1 - y0, rgba = Buffer.alloc(width * rowHeight * 4);
    for (let y = y0; y < y1; y++) for (let x = 0; x < width; x++) {
      if (row > 0 && y < rowSeams[row - 1][x]) continue;
      if (row < source.rows - 1 && y >= rowSeams[row][x]) continue;
      const at = (y * width + x) * 4;
      data.copy(rgba, ((y - y0) * width + x) * 4, at, at + 4);
    }
    const hints = source.columnCutHintsByRow?.[row];
    const count = hints ? hints.length + 1 : source.columns;
    const columnSeams = Array.from({ length: count - 1 }, (_, i) => {
      const preferred = hints?.[i] ?? Math.round((i + 1) * width / count);
      const radius = Math.min(30, Math.round(width / count * 0.3));
      return seam(rowHeight, preferred - radius, preferred + radius, preferred,
        (y, x) => rgba[(y * width + x) * 4 + 3]);
    });
    const columnCrossings = columnSeams.flatMap(s => [...s].map((x, y) => rgba[(y * width + x) * 4 + 3])).filter(a => a > 24).length;
    assert.equal(columnCrossings, 0, source.path + ': column seam crosses native artwork');
    const rowCrossings = [row > 0 ? rowSeams[row - 1] : null, row < source.rows - 1 ? rowSeams[row] : null]
      .filter(Boolean).flatMap(s => [...s].map((y, x) => data[(y * width + x) * 4 + 3])).filter(a => a > 24).length;
    assert.equal(rowCrossings, 0, source.path + ': row ' + row + ' seam crosses native artwork; valleys=' + valleys.join(','));
    const frames = [];
    for (let column = 0; column < count; column++) {
      const pixels = Buffer.alloc(rgba.length);
      for (let y = 0; y < rowHeight; y++) {
        const x0 = column === 0 ? 0 : columnSeams[column - 1][y];
        const x1 = column === count - 1 ? width : columnSeams[column][y];
        rgba.copy(pixels, (y * width + x0) * 4, (y * width + x0) * 4, (y * width + x1) * 4);
      }
      frames.push({ data: pixels, width, height: rowHeight, bounds: visibleBounds(pixels, width, rowHeight),
        centerX: source.columnCentersByRow?.[row]?.[column] ?? (column + 0.5) * width / count,
        row, column, sourceBounds: { top: y0, bottom: y1 }, columnCrossings, rowCrossings });
    }
    rows.push(frames);
  }
  return { rows, width, height, bytes };
}

async function normalize(record) {
  assert.equal(record.reviewed, true, record.heroId + ': visual review pending');
  const sources = await Promise.all(record.sources.map(segment));
  const selected = record.poseSelections.map(selection => ({ ...selection,
    frame: sources[selection.source].rows[selection.row][selection.column] }));
  assert.equal(selected.length, 48);
  const sourceScales = sources.map((source, index) => {
    const calibration = source.rows[0][0].bounds.height;
    let scale = 192 / calibration;
    for (const selection of selected.filter(s => s.source === index)) {
      const frame = selection.frame, b = frame.bounds;
      const half = Math.max(frame.centerX - b.left, b.left + b.width - frame.centerX);
      scale = Math.min(scale, 230 / (2 * half), 230 / b.height);
    }
    return { scale, bodyHeight: calibration, normalizedBodyHeight: calibration * scale };
  });
  const frames = [];
  for (const selection of selected) {
    const frame = selection.frame, b = frame.bounds, scale = sourceScales[selection.source].scale;
    const width = Math.max(1, Math.round(b.width * scale)), height = Math.max(1, Math.round(b.height * scale));
    const left = Math.round(128 + (b.left - frame.centerX) * scale), top = 244 - height;
    assert.ok(left >= 10 && top >= 10 && left + width <= 246 && top + height <= 246,
      `${record.heroId}/${selection.row}/${selection.column}: margin clipped`);
    const input = await sharp(frame.data, { raw: { width: frame.width, height: frame.height, channels: 4 } })
      .extract({ left: b.left, top: b.top, width: b.width, height: b.height })
      .resize(width, height, { kernel: 'nearest' }).png().toBuffer();
    frames.push({ input, left, top, source: selection.source, sourceRow: selection.row, sourceColumn: selection.column,
      sourceBounds: { ...b, top: b.top + frame.sourceBounds.top },
      output: { left, top, width, height }, scale });
  }
  return { frames, sources, sourceScales };
}

async function pack(record, normalized, kind) {
  const base = kind === 'base', names = base ? STATES : PHASES, offset = base ? 32 : 0;
  const composites = [], frameDetails = [];
  for (let i = 0; i < names.length * 4; i++) {
    const f = normalized.frames[offset + i];
    composites.push({ input: f.input, left: i % 4 * 256 + f.left, top: Math.floor(i / 4) * 256 + f.top });
    const { input: _input, ...detail } = f; frameDetails.push(detail);
  }
  const bytes = await sharp({ create: { width: 1024, height: names.length * 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites).png({ compressionLevel: 9 }).toBuffer();
  const raw = await sharp(bytes).ensureAlpha().raw().toBuffer(), hashes = [];
  for (let i = 0; i < names.length * 4; i++) {
    const cell = await sharp(bytes).extract({ left: i % 4 * 256, top: Math.floor(i / 4) * 256, width: 256, height: 256 }).raw().toBuffer();
    hashes.push(hash(cell));
    let visible = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const a = raw[((Math.floor(i / 4) * 256 + y) * 1024 + i % 4 * 256 + x) * 4 + 3];
      if (a > 4) visible++;
      if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(a, 0, record.heroId + ': nontransparent margin');
    }
    assert.ok(visible > 300, record.heroId + ': empty pose');
  }
  assert.equal(new Set(hashes).size, names.length * 4, record.heroId + ': duplicated retained pose');
  const first = record.sources[0], definition = DEFINITIONS[record.heroId];
  const layout = Object.fromEntries(names.map((name, row) => [name, { row, frames: 4, columns: 4,
    fps: base && name === 'run' ? 10 : ['super', 'fatality'].includes(name) ? 12 : 8,
    loop: base && ['idle', 'run'].includes(name) }]));
  const entry = { id: record.heroId, heroId: record.heroId, universe: definition.universe, name: record.name,
    sheet: `/sprites/generated/combat-character-${base ? 'corrections' : 'animations'}-wave12-part-d/${record.heroId}.png`,
    width: 1024, height: names.length * 256, columns: 4, rows: names.length,
    frameWidth: 256, frameHeight: 256, frames: names.length * 4, [base ? 'states' : 'phases']: layout,
    sha256: hash(bytes), alpha: true, sourceImage: first.path, sourceImageSha256: first.sha256,
    sourceDimensions: [normalized.sources[0].width, normalized.sources[0].height],
    sourceImages: record.sources.map(source => ({ path: source.path, sha256: source.sha256 })),
    referenceAsset: record.referenceAsset, referenceAssetSha256: record.referenceAssetSha256,
    referenceImage: record.referenceArchive, sourceWork: definition.sourceWork,
    sourceReference: ABILITIES[record.heroId].sourceReference, characterVersion: record.version,
    abilityName: base ? ABILITIES[record.heroId].simple.name : definition.name,
    abilityEffect: base ? ABILITIES[record.heroId].simple.targeting.effect : definition.effect,
    provider: 'OpenAI', model: null, generationId: null, jobId: null,
    normalization: { method: 'alpha-seams-shared-scale-per-native-source', sharedScalePerSource: true,
      sourceScales: normalized.sourceScales, baseline: 244,
      rows: names.map((name, row) => {
        const frames = frameDetails.slice(row * 4, row * 4 + 4);
        const primary = record.sources[frames[0].source];
        return { [base ? 'state' : 'phase']: name, row, frames,
          sourceImage: primary.path, sourceImageSha256: primary.sha256,
          sourceImages: [...new Set(frames.map(frame => frame.source))].map(index => ({
            path: record.sources[index].path, sha256: record.sources[index].sha256 })) };
      }) },
    visualValidation: { identityReviewed: true, allFramesReviewed: true, technicalAlphaReviewed: true,
      fourNativePosesPerRowReviewed: true, distinctCells: hashes.length,
      [base ? 'stateReviews' : 'phaseReviews']: names.map((name, row) => ({ [base ? 'state' : 'phase']: name,
        distinctFrames: 4, frameHashes: hashes.slice(row * 4, row * 4 + 4) })),
      canon1to1Verified: false, canonicalVerified: false, networkVerified: false,
      source1to1Verified: false, sourceGameAsset: false, adaptedChoreography: true, fatalityIsExecution: false,
      notes: record.reviewNotes } };
  return { bytes, entry };
}

export async function buildPartD(kind, { check = false } = {}) {
  assert.ok(['native', 'base'].includes(kind));
  const doc = await json(`${DOCS}/part-d-generation-records.json`);
  const records = doc.records.filter(record => record.status === 'accepted-reviewed');
  assert.deepEqual(doc.records.filter(record => record.status === 'blocked-explicit-refusal').map(record => record.heroId), ['morty']);
  assert.equal(records.length, 9);
  const entries = [];
  for (const record of records) {
    assert.equal(hash(await read(record.referenceArchive)), record.referenceAssetSha256);
    for (const source of record.sources) assert.equal((await read(source.promptFile)).toString(), source.prompt);
    const result = await pack(record, await normalize(record), kind); entries.push(result.entry);
    if (check) assert.equal(hash(await read('public' + result.entry.sheet)), result.entry.sha256, record.heroId + ': reconstruction changed');
    else {
      await fs.mkdir(path.dirname(file('public' + result.entry.sheet)), { recursive: true });
      await fs.writeFile(file('public' + result.entry.sheet), result.bytes);
      await sharp(result.bytes).resize(512, result.entry.rows * 128, { kernel: 'nearest' }).flatten({ background: '#172032' })
        .png().toFile(file(`${DOCS}/part-d-contacts/${record.heroId}-${kind}.png`));
    }
  }
  const registry = { schemaVersion: 1, source: 'OpenAI', entries };
  const registryPath = `src/game/combat/character${kind === 'base' ? 'SpriteCorrections' : 'Animations'}Wave12PartD.generated.json`;
  const provenancePath = `${DOCS}/${kind === 'base' ? 'base-' : ''}part-d-provenance.json`;
  const provenance = { schemaVersion: 1, date: '2026-10-23', wave: 12, part: 'D', kind, provider: 'OpenAI', tool: 'image_gen',
    source1to1Verified: false, sourceGameAsset: false, networkVerified: false,
    sourceRecords: `${DOCS}/part-d-generation-records.json`, refusals: `${DOCS}/part-d-request-failures.json`,
    method: 'Genuinely generated native drawings, alpha-seam segmentation, uniform scale per source, transparent packing. No procedural anatomy, pose interpolation, mirrored replacement or duplicated retained drawing.',
    blockedHeroIds: ['morty'], entries };
  if (check) {
    assert.deepEqual(await json(registryPath), registry);
    assert.deepEqual(await json(provenancePath), provenance);
  } else { await writeJson(registryPath, registry); await writeJson(provenancePath, provenance); }
  return { part: 'D', kind, heroes: entries.length, images: entries.length,
    poses: entries.reduce((n, entry) => n + entry.frames, 0), check, blockedHeroIds: ['morty'], source1to1Verified: false };
}
