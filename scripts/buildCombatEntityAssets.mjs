import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = 'docs/combat-completion-2026-10-18';
const REGISTRY = 'src/game/combat/entityAssets.generated.json';
const PROVENANCE = `${DOCS}/entity-assets-provenance.json`;
const FRAME_SIZE = 256;
const PADDING = 12;
const PHASES = ['idle', 'preparation', 'impact', 'recovery'];
const NATIVE_SOURCES = {
  1: '/workspace/generated_images/exec-754ea89f-5308-40e5-b1b5-5696c70b76c1.png',
  2: '/workspace/generated_images/exec-f3a8c382-e31e-4401-9277-f904f67db152.png',
  3: '/workspace/generated_images/exec-5f749cb9-f4d3-44f6-ae96-8fbe8d9d22c8.png',
  4: '/workspace/generated_images/exec-f533acde-a062-4426-9618-637c85012e96.png'
};
const readJson = async (file, fallback = null) => {
  try { return JSON.parse(await fs.readFile(path.resolve(ROOT, file), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
};
const exists = async file => fs.access(file).then(() => true, () => false);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = async (file, value) => {
  await fs.mkdir(path.dirname(path.resolve(ROOT, file)), { recursive: true });
  await fs.writeFile(path.resolve(ROOT, file), `${JSON.stringify(value, null, 2)}\n`);
};

// A source atlas is not a regular grid: e.g. Tessera is taller than the drones.
// Locate low-alpha row valleys, then curve each seam through transparent pixels
// so a raised antenna or a spell fringe need not be cut by a horizontal line.
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
  assert.ok(right >= left && bottom >= top, 'Native frame has no visible subject');
  return { left, top, width: right - left + 1, height: bottom - top + 1, pixels };
}

export async function segmentAtlas(file, rowCount) {
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

export async function normalizeRow(row) {
  const top = Math.min(...row.frames.map(frame => frame.bounds.top));
  const bottom = Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height));
  const halfWidth = Math.max(...row.frames.map(frame => Math.max(frame.centerX - frame.bounds.left, frame.bounds.left + frame.bounds.width - frame.centerX)));
  const sourceWidth = Math.ceil(halfWidth * 2);
  const sourceHeight = bottom - top;
  const scale = Math.min((FRAME_SIZE - PADDING * 2) / sourceWidth, (FRAME_SIZE - PADDING * 2) / sourceHeight);
  const prepared = [];
  const frameBounds = [];
  for (let index = 0; index < row.frames.length; index++) {
    const frame = row.frames[index];
    const b = frame.bounds;
    const resizedWidth = Math.max(1, Math.round(b.width * scale));
    const resizedHeight = Math.max(1, Math.round(b.height * scale));
    const input = await sharp(frame.data, { raw: { width: frame.width, height: frame.height, channels: 4 } })
      .extract({ left: b.left, top: b.top, width: b.width, height: b.height })
      .resize(resizedWidth, resizedHeight, { kernel: sharp.kernel.nearest }).png().toBuffer();
    const left = Math.round(FRAME_SIZE / 2 + (b.left - frame.centerX) * scale);
    const outputTop = Math.round(FRAME_SIZE - PADDING - (bottom - b.top) * scale);
    assert.ok(left >= PADDING - 1 && outputTop >= PADDING - 1, 'Frame exceeds normalization padding');
    assert.ok(left + resizedWidth <= FRAME_SIZE - PADDING + 1 && outputTop + resizedHeight <= FRAME_SIZE - PADDING + 1, 'Subject would be clipped');
    prepared.push({ input, left: index * FRAME_SIZE + left, top: outputTop });
    frameBounds.push({ source: b, output: { left, top: outputTop, width: resizedWidth, height: resizedHeight } });
  }
  const bytes = await sharp({ create: { width: FRAME_SIZE * 4, height: FRAME_SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(prepared).png({ compressionLevel: 9 }).toBuffer();
  return { bytes, frameBounds, scale, baseline: FRAME_SIZE - PADDING };
}

async function archiveSource(file, target) {
  const bytes = await fs.readFile(file);
  const destination = path.resolve(ROOT, DOCS, 'sources', target);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
  return { path: path.relative(ROOT, destination).split(path.sep).join('/'), sha256: sha256(bytes), bytes: bytes.length };
}

export async function checkCombatEntityAssets() {
  const registry = await readJson(REGISTRY);
  const provenance = await readJson(PROVENANCE);
  assert.ok(registry && provenance, 'Build native entity assets first');
  assert.equal(registry.entries.length, 28);
  const sourceRecords = [...provenance.nativeSources, ...provenance.corrections.flatMap(record => [record, ...(record.previousAttempts || [])])];
  for (const record of sourceRecords) {
    const file = path.resolve(ROOT, record.path || record.archivedPath);
    assert.equal(sha256(await fs.readFile(file)), record.sha256, `Native archive changed: ${file}`);
    assert.equal(record.model, null); assert.equal(record.generationId, null);
  }
  const unique = new Set();
  for (const entry of registry.entries) {
    assert.ok(!unique.has(entry.key), `Duplicate entity key ${entry.key}`); unique.add(entry.key);
    assert.equal(entry.key, `${entry.universe}::${entry.entityName}::${entry.actionName}`);
    const file = path.resolve(ROOT, `public${entry.sheet}`);
    const bytes = await fs.readFile(file);
    assert.equal(sha256(bytes), entry.sha256, entry.id);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 1024, entry.id); assert.equal(metadata.height, 256, entry.id); assert.equal(metadata.hasAlpha, true, entry.id);
    assert.equal(entry.assetMissing, false); assert.deepEqual(entry.phases, PHASES);
    assert.equal(entry.visualValidation.canon1to1Verified, false);
    const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
    for (let frame = 0; frame < 4; frame++) {
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const a = data[(y * info.width + frame * 256 + x) * 4 + 3];
        if (a > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(a, 0, `${entry.id}: clipped output edge`);
      }
      assert.ok(visible > 300, `${entry.id}: empty phase ${frame}`);
    }
    const source = await fs.readFile(path.resolve(ROOT, entry.sourceAtlas));
    assert.equal(sha256(source), entry.sourceAtlasSha256, `${entry.id}: native source changed`);
  }
  return { entities: registry.entries.length, mappedCallers: registry.entries.reduce((sum, entry) => sum + entry.callers.length, 0), nativeSources: provenance.nativeSources.length, corrections: provenance.corrections.length, checked: true };
}

export async function buildCombatEntityAssets() {
  const previous = await readJson(PROVENANCE, {});
  const plan = await readJson('.tmp/combat-completion/entity-plan.json', previous.plan);
  assert.equal(plan?.length, 28, 'Expected the explicit 28-entity plan');
  const prompts = await readJson('.tmp/combat-completion/entity-native-prompts.json', previous.nativePrompts);
  assert.equal(prompts?.length, 4, 'Exact original generation prompts are required');
  const corrections = await readJson('.tmp/combat-completion/entity-corrections.json', previous.corrections || []);
  const nativeSources = [];
  const batches = new Map();
  for (const batch of [1, 2, 3, 4]) {
    const original = NATIVE_SOURCES[batch];
    const archived = previous.nativeSources?.find(record => record.batch === batch)?.path;
    const file = await exists(original) ? original : path.resolve(ROOT, archived || `${DOCS}/sources/native-batch-${batch}.png`);
    const record = await archiveSource(file, `native-batch-${batch}.png`);
    nativeSources.push({ batch, ...record, originalGeneratedPath: original, provider: 'OpenAI', generationId: null, model: null, prompt: prompts[batch - 1] });
    batches.set(batch, await segmentAtlas(file, 7));
  }
  const correctionSources = [];
  const correctedRows = new Map();
  for (const correction of corrections) {
    const file = await exists(correction.file) ? correction.file : path.resolve(ROOT, correction.archivedPath || `${DOCS}/sources/correction-${correction.id}.png`);
    const archive = await archiveSource(file, `correction-${correction.id}.png`);
    const source = await segmentAtlas(file, 1);
    correctedRows.set(correction.id, { row: source.rows[0], source, archive });
    const previousAttempts = [];
    for (let index = 0; index < (correction.previousAttempts || []).length; index++) {
      const attempt = correction.previousAttempts[index];
      const attemptFile = await exists(attempt.file) ? attempt.file : path.resolve(ROOT, attempt.archivedPath || `${DOCS}/sources/attempt-${correction.id}-${index + 1}.png`);
      const attemptArchive = await archiveSource(attemptFile, `attempt-${correction.id}-${index + 1}.png`);
      previousAttempts.push({ ...attempt, archivedPath: attemptArchive.path, sha256: attemptArchive.sha256, provider: 'OpenAI', generationId: null, model: null });
    }
    correctionSources.push({ ...correction, archivedPath: archive.path, sha256: archive.sha256, bytes: archive.bytes, provider: 'OpenAI', model: null, generationId: null,
      previousAttempts,
      referencedSourceSha256: nativeSources.find(item => NATIVE_SOURCES[item.batch] === correction.referencedImage)?.sha256
        || previousAttempts.find(item => item.file === correction.referencedImage)?.sha256 || null });
  }
  const entries = [];
  for (const entity of plan) {
    const correction = correctedRows.get(entity.id);
    const atlas = correction?.source || batches.get(entity.batch);
    const row = correction?.row || atlas.rows[entity.row];
    const normalized = await normalizeRow(row);
    const file = path.resolve(ROOT, `public${entity.assetPath}`);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, normalized.bytes);
    const native = nativeSources.find(source => source.batch === entity.batch);
    const sourceAtlas = correction?.archive.path || native.path;
    entries.push({ id: entity.id, key: entity.key, universe: entity.universe, entityName: entity.entityName, actionName: entity.actionName,
      sourceHeroId: entity.sourceHeroId, callers: entity.callers, sheet: entity.assetPath, frames: 4, columns: 4, rows: 1,
      frameWidth: 256, frameHeight: 256, width: 1024, height: 256, alpha: true, assetMissing: false, phases: PHASES,
      sha256: sha256(normalized.bytes), sourceAtlas, sourceAtlasSha256: correction?.archive.sha256 || native.sha256, sourceBatch: entity.batch,
      originalSourceAtlas: native.path, originalSourceAtlasSha256: native.sha256, originalSourceRow: entity.row,
      sourceRow: correction ? 0 : entity.row, nativeCorrection: !!correction, sourceDimensions: [atlas.width, atlas.height],
      sourceWork: entity.sourceWork, sourceReference: entity.sourceReference,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', padding: PADDING, sharedScale: normalized.scale, baseline: normalized.baseline, sourceBounds: row.sourceBounds, frameBounds: normalized.frameBounds, ...row.seamReview },
      visualValidation: { identityReviewed: true, technicalAlphaReviewed: true, fourPhasesReviewed: true, fullOutputSilhouetteContained: true,
        canon1to1Verified: false, networkVerified: false, sourceDesign: 'native-generated-adaptation',
        notes: entity.id === 'jojo-gold-experience' ? 'Native correction replaces leaf creation with the requested physical Muda Muda punching action.'
          : entity.id === 'ff7-bahamut' ? 'Native correction contains the entire wing silhouette; no edge-clipped source row is used.'
            : entity.id === 'tawantinsuyu-relay' ? 'Native correction restores exactly four adult messengers in each pose and transparent margin around the last recovery figure.'
            : 'Native identity and four action phases visually inspected; source-game exactness is not certified.' }
    });
  }
  await writeJson(REGISTRY, { schemaVersion: 1, source: 'OpenAI', entries });
  await writeJson(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', model: null, generationId: null,
    generationClaim: 'Actual native image_gen calls produced the archived PNG sources. No generation UUID or model name was inferred from filenames.',
    conditioning: 'Sharp extracts native artwork using alpha projections and adaptive transparent seams, applies a shared scale and baseline, and packages four transparent 256px frames. No procedural substitute artwork is drawn.',
    fidelity: { networkVerified: false, canon1to1Verified: false, sourceGameAssets: false, generatedAdaptations: true },
    nativePrompts: prompts, nativeSources, corrections: correctionSources, plan, entries });
  const checked = await checkCombatEntityAssets();
  const montage = [];
  for (let index = 0; index < entries.length; index++) montage.push({ input: path.resolve(ROOT, `public${entries[index].sheet}`), left: 0, top: index * 256 });
  await sharp({ create: { width: 1024, height: entries.length * 256, channels: 4, background: { r: 18, g: 24, b: 35, alpha: 1 } } })
    .composite(montage).png().toFile(path.resolve(ROOT, DOCS, 'entity-assets-contact-sheet.png'));
  for (let batch = 1; batch <= 4; batch++) {
    await sharp(path.resolve(ROOT, DOCS, 'entity-assets-contact-sheet.png'))
      .extract({ left: 0, top: (batch - 1) * 1792, width: 1024, height: 1792 })
      .png().toFile(path.resolve(ROOT, DOCS, `entity-assets-contact-batch-${batch}.png`));
  }
  return checked;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatEntityAssets() : buildCombatEntityAssets())));
}
