import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const columns = 4;
const rows = 4;
const outputSize = 1024;
const outputCell = 256;
const outputGuard = 12;
const threshold = 12;
const sourceFringe = 4;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const kindDirectories = { hero: 'heroes', enemy: 'bosses', boss: 'bosses', trial: 'bosses', finale: 'bosses' };
const digestPattern = /^[a-f0-9]{64}$/u;
const outputPattern = /^\/sprites\/generated\/(heroes|bosses)\/[a-z0-9-]+\/[a-z0-9-]+\.png$/u;
const manifestPattern = /^docs\/audits\/[a-z0-9-]+\.json$/u;
const safeLabel = value => typeof value === 'string' && value.trim() && value.length <= 160
  && Array.from(value).every(character => character.codePointAt(0) >= 32 && character.codePointAt(0) !== 127);
const exists = async file => {
  try { await fs.lstat(file); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; }
};

const localInput = async (input, base, label, expectedHash) => {
  const inputPath = typeof input === 'string' ? input : input?.path;
  const expected = expectedHash || (typeof input === 'object' ? input?.sha256 : null);
  if (typeof inputPath !== 'string' || !inputPath || /^(?:[a-z]+:|\/\/)/iu.test(inputPath)
    || inputPath.split(/[\\/]/u).some(segment => segment === '..')
    || !digestPattern.test(expected || '')) throw new Error(`Invalid ${label} path or SHA-256.`);
  const file = path.resolve(base, inputPath);
  let bytes;
  try {
    const stat = await fs.lstat(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error();
    bytes = await fs.readFile(file);
  } catch { throw new Error(`${label} must be an existing regular file.`); }
  if (!bytes.length || sha256(bytes) !== expected) throw new Error(`${label} SHA-256 mismatch.`);
  return { file, bytes, sha256: expected };
};

const safeDestination = async (root, relative) => {
  if (path.isAbsolute(relative) || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Invalid destination.');
  const segments = relative.split('/');
  let current = root;
  for (const segment of segments) {
    current = path.join(current, segment);
    if (await exists(current)) {
      const stat = await fs.lstat(current);
      if (stat.isSymbolicLink()) throw new Error('Destination paths cannot contain symlinks.');
    }
  }
  if (await exists(current)) throw new Error(`Refusing to overwrite ${relative}.`);
  return current;
};

const readPng = async bytes => {
  const metadata = await sharp(bytes, { animated: false, failOn: 'error' }).metadata();
  if (metadata.format !== 'png' || metadata.channels !== 4 || metadata.pages > 1) throw new Error('Character source must be a real, static RGBA PNG.');
  const decoded = await sharp(bytes, { animated: false, failOn: 'error' }).raw().toBuffer({ resolveWithObject: true });
  if (decoded.info.channels !== 4) throw new Error('Character PNG did not decode to RGBA.');
  return { ...decoded, metadata };
};

const boundsFor = pixels => {
  let left = Infinity;
  let top = Infinity;
  let right = -1;
  let bottom = -1;
  for (const [x, y] of pixels) {
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  return right < left ? null : { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
};
const bboxDistance = (first, second) => Math.hypot(
  Math.max(first.left - second.right, second.left - first.right, 0),
  Math.max(first.top - second.bottom, second.top - first.bottom, 0)
);
const expandVisibleBounds = (bounds, width, height) => {
  const left = Math.max(0, bounds.left - sourceFringe);
  const top = Math.max(0, bounds.top - sourceFringe);
  const right = Math.min(width - 1, bounds.right + sourceFringe);
  const bottom = Math.min(height - 1, bounds.bottom + sourceFringe);
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
};
const insideBounds = (x, y, bounds) => x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
const resizeNearestRgba = (pixels, sourceWidth, sourceHeight, width, height) => {
  const resized = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.min(sourceHeight - 1, Math.floor((y + 0.5) * sourceHeight / height));
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor((x + 0.5) * sourceWidth / width));
      const sourceOffset = (sourceY * sourceWidth + sourceX) * 4;
      pixels.copy(resized, (y * width + x) * 4, sourceOffset, sourceOffset + 4);
    }
  }
  return resized;
};

const strictFrames = ({ data, info }) => {
  const xEdges = Array.from({ length: 5 }, (_, index) => Math.round(index * info.width / columns));
  const yEdges = Array.from({ length: 5 }, (_, index) => Math.round(index * info.height / rows));
  const frames = [];
  let sourceVisiblePixels = 0;
  let minimumSourceGuard = Infinity;
  let softAlphaOutsideFrameDiscarded = 0;
  let softAlphaPixelsPreserved = 0;
  for (let cell = 0; cell < 16; cell += 1) {
    const column = cell % columns;
    const row = Math.floor(cell / columns);
    const baseX = xEdges[column];
    const baseY = yEdges[row];
    const cellWidth = xEdges[column + 1] - baseX;
    const cellHeight = yEdges[row + 1] - baseY;
    const visible = [];
    const all = [];
    for (let y = 0; y < cellHeight; y += 1) for (let x = 0; x < cellWidth; x += 1) {
      const index = ((baseY + y) * info.width + baseX + x) * 4;
      if (data[index + 3]) all.push([x, y, index]);
      if (data[index + 3] > threshold) visible.push([x, y]);
    }
    if (visible.length < 64) throw new Error(`Source cell ${cell + 1} is empty or effectively empty.`);
    const bounds = boundsFor(visible);
    const guard = Math.min(bounds.left, bounds.top, cellWidth - 1 - bounds.right, cellHeight - 1 - bounds.bottom);
    if (guard < 2) throw new Error(`Source cell ${cell + 1} is clipped or lacks its 2 px guard.`);
    sourceVisiblePixels += visible.length;
    minimumSourceGuard = Math.min(minimumSourceGuard, guard);
    const usefulBounds = expandVisibleBounds(bounds, cellWidth, cellHeight);
    const retained = all.filter(([x, y]) => insideBounds(x, y, usefulBounds));
    softAlphaOutsideFrameDiscarded += all.length - retained.length;
    softAlphaPixelsPreserved += retained.length - visible.length;
    frames.push({ cell, pixels: retained, visiblePixels: visible.length, visibleBounds: bounds,
      bounds: usefulBounds, coordinateSpace: 'cell' });
  }
  return { frames, measurements: { mode: 'strict-grid', sourceVisiblePixels, assignedVisiblePixels: sourceVisiblePixels,
    minimumSourceGuard, sourceGridCells: 16, sourceGridEdges: { x: xEdges, y: yEdges },
    softAlphaOutsideFrameDiscarded, softAlphaPixelsPreserved } };
};

const collectComponents = ({ data, info }) => {
  const width = info.width;
  const height = info.height;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  const components = [];
  let sourceVisiblePixels = 0;
  for (let index = 0; index < width * height; index += 1) {
    if (visited[index] || data[index * 4 + 3] <= threshold) continue;
    let head = 0; let tail = 1; queue[0] = index; visited[index] = 1;
    const pixels = [];
    let sumX = 0; let sumY = 0;
    while (head < tail) {
      const current = queue[head++];
      const x = current % width; const y = Math.floor(current / width);
      pixels.push([x, y, current * 4]); sumX += x; sumY += y;
      for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
        if (!dx && !dy) continue;
        const nx = x + dx; const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const next = ny * width + nx;
        if (!visited[next] && data[next * 4 + 3] > threshold) { visited[next] = 1; queue[tail++] = next; }
      }
    }
    const bounds = boundsFor(pixels);
    if (bounds.left === 0 || bounds.top === 0 || bounds.right === width - 1 || bounds.bottom === height - 1) throw new Error('Source has visible pixels on its external border; a silhouette may be clipped.');
    sourceVisiblePixels += pixels.length;
    components.push({ pixels, area: pixels.length, bounds, centroid: { x: sumX / pixels.length, y: sumY / pixels.length } });
  }
  return { components, sourceVisiblePixels };
};

const componentFrames = decoded => {
  const { data, info } = decoded;
  const cellWidth = info.width / columns;
  const cellHeight = info.height / rows;
  const { components, sourceVisiblePixels } = collectComponents(decoded);
  const ranked = [...components].sort((a, b) => b.area - a.area);
  const bodies = ranked.filter(component => component.area >= 64).slice(0, 16);
  if (bodies.length !== 16) throw new Error('Component layout requires 16 intact dominant bodies.');
  const centers = Array.from({ length: 16 }, (_, cell) => ({ cell,
    x: (cell % columns + 0.5) * cellWidth, y: (Math.floor(cell / columns) + 0.5) * cellHeight }));
  const byCell = new Map();
  for (const body of bodies) {
    const nearest = centers.map(center => ({ ...center,
      distance: Math.hypot((center.x - body.centroid.x) / cellWidth, (center.y - body.centroid.y) / cellHeight) }))
      .sort((a, b) => a.distance - b.distance);
    if (nearest[1].distance - nearest[0].distance < 0.04) throw new Error('Ambiguous dominant body between grid centers.');
    if (byCell.has(nearest[0].cell)) throw new Error('Dominant bodies do not occupy 16 distinct frame centers.');
    const centersInside = centers.filter(center => center.x >= body.bounds.left && center.x <= body.bounds.right
      && center.y >= body.bounds.top && center.y <= body.bounds.bottom).length;
    if (centersInside > 1 || body.bounds.width > cellWidth * 1.75 || body.bounds.height > cellHeight * 1.75) throw new Error('A dominant component spans multiple frame centers or is fused.');
    body.cell = nearest[0].cell;
    body.assigned = [...body.pixels];
    byCell.set(body.cell, body);
  }
  const bodySet = new Set(bodies);
  const minimumBodyArea = Math.min(...bodies.map(body => body.area));
  const satellites = components.filter(component => !bodySet.has(component));
  for (const satellite of satellites) {
    if (satellite.area >= minimumBodyArea * 0.75) throw new Error('Additional large component cannot safely be treated as a satellite.');
    const nearest = bodies.map(body => ({ body, distance: bboxDistance(satellite.bounds, body.bounds) }))
      .sort((a, b) => a.distance - b.distance);
    if (nearest[1].distance - nearest[0].distance < Math.max(2, Math.min(cellWidth, cellHeight) * 0.01)
      || nearest[0].distance > Math.hypot(cellWidth, cellHeight) * 0.8) throw new Error('Ambiguous or distant satellite component.');
    for (const pixel of satellite.pixels) nearest[0].body.assigned.push(pixel);
  }
  const assignedVisiblePixels = bodies.reduce((sum, body) => sum + body.assigned.length, 0);
  if (assignedVisiblePixels !== sourceVisiblePixels) throw new Error('Component layout lost visible source pixels.');
  // Bounds derive only from alpha > 12. A four-pixel fringe keeps weak edge
  // pixels near the actual silhouette, without letting remote alpha noise
  // shrink the body or shift its visible baseline during format packing.
  const opaqueBounds = bodies.map(body => {
    const bounds = boundsFor(body.assigned);
    body.visibleBounds = bounds;
    body.usefulBounds = expandVisibleBounds(bounds, info.width, info.height);
    return { body, bounds };
  });
  const opaqueOwners = new Uint8Array(info.width * info.height);
  for (const body of bodies) for (const pixel of body.assigned) opaqueOwners[pixel[2] / 4] = body.cell + 1;
  let softAlphaPixels = 0;
  let softAlphaAmbiguities = 0;
  let softAlphaOutsideFrameDiscarded = 0;
  for (let y = 0; y < info.height; y += 1) for (let x = 0; x < info.width; x += 1) {
    const index = (y * info.width + x) * 4;
    if (!data[index + 3] || data[index + 3] > threshold) continue;
    const eligible = opaqueBounds.filter(entry => insideBounds(x, y, entry.body.usefulBounds));
    if (!eligible.length) { softAlphaOutsideFrameDiscarded += 1; continue; }
    const eligibleCells = new Set(eligible.map(entry => entry.body.cell));
    const point = { left: x, right: x, top: y, bottom: y };
    let nearestDistance = Infinity;
    let candidateCells = new Set();
    for (let dy = -4; dy <= 4; dy += 1) for (let dx = -4; dx <= 4; dx += 1) {
      const nx = x + dx; const ny = y + dy;
      if (nx < 0 || nx >= info.width || ny < 0 || ny >= info.height) continue;
      const owner = opaqueOwners[ny * info.width + nx];
      if (!owner || !eligibleCells.has(owner - 1)) continue;
      const distance = dx * dx + dy * dy;
      if (distance < nearestDistance) { nearestDistance = distance; candidateCells = new Set([owner - 1]); }
      else if (distance === nearestDistance) candidateCells.add(owner - 1);
    }
    let body;
    if (candidateCells.size === 1) body = byCell.get([...candidateCells][0]);
    else {
      const nearest = eligible.filter(entry => !candidateCells.size || candidateCells.has(entry.body.cell))
        .map(entry => ({ ...entry, distance: bboxDistance(point, entry.bounds),
          centroidDistance: Math.hypot(x - entry.body.centroid.x, y - entry.body.centroid.y) }))
        .sort((a, b) => a.distance - b.distance || a.centroidDistance - b.centroidDistance);
      if (candidateCells.size > 1 || nearest[1]?.distance === nearest[0].distance) softAlphaAmbiguities += 1;
      body = nearest[0].body;
    }
    body.assigned.push([x, y, index]);
    softAlphaPixels += 1;
  }
  const frames = Array.from({ length: 16 }, (_, cell) => {
    const body = byCell.get(cell);
    const pixels = body.assigned;
    return { cell, pixels, bounds: body.usefulBounds, visibleBounds: body.visibleBounds,
      visiblePixels: pixels.filter(pixel => data[pixel[2] + 3] > threshold).length,
      coordinateSpace: 'source', dominantBounds: body.bounds };
  });
  return { frames, measurements: { mode: 'component-layout', sourceVisiblePixels, assignedVisiblePixels,
    softAlphaPixelsPreserved: softAlphaPixels, softAlphaOutsideFrameDiscarded,
    softAlphaAmbiguitiesForReview: softAlphaAmbiguities,
    dominantBodies: 16, satellites: satellites.length,
    crossesVirtualBoundaries: frames.filter(frame => Math.floor(frame.visibleBounds.left / cellWidth) !== Math.floor(frame.visibleBounds.right / cellWidth)
      || Math.floor(frame.visibleBounds.top / cellHeight) !== Math.floor(frame.visibleBounds.bottom / cellHeight)).map(frame => frame.cell + 1),
    componentAssignment: 'dominant centroid to distinct grid centers; satellites to nearest dominant bbox; original internal coordinates preserved' } };
};

export const normalizeReferencedCharacterPng = async (bytes, { componentLayout = false } = {}) => {
  const decoded = await readPng(bytes);
  if (decoded.info.width < 64 || decoded.info.height < 64
    || decoded.info.width > 4096 || decoded.info.height > 4096) throw new Error('Source PNG must support an explicit 4 by 4 layout.');
  const extracted = componentLayout ? componentFrames(decoded) : strictFrames(decoded);
  const maximumWidth = Math.max(...extracted.frames.map(frame => frame.bounds.width));
  const maximumHeight = Math.max(...extracted.frames.map(frame => frame.bounds.height));
  const uniformScale = Math.min((outputCell - outputGuard * 2) / maximumWidth,
    (outputCell - outputGuard * 2) / maximumHeight);
  const output = Buffer.alloc(outputSize * outputSize * 4);
  const frameMeasurements = [];
  for (const frame of extracted.frames) {
    const pixels = Buffer.alloc(frame.bounds.width * frame.bounds.height * 4);
    for (const [x, y, index] of frame.pixels) {
      const destination = ((y - frame.bounds.top) * frame.bounds.width + x - frame.bounds.left) * 4;
      decoded.data.copy(pixels, destination, index, index + 4);
    }
    const width = Math.max(1, Math.round(frame.bounds.width * uniformScale));
    const height = Math.max(1, Math.round(frame.bounds.height * uniformScale));
    // Direct RGBA sampling avoids premultiply/unpremultiply rounding that can
    // alter the original RGB values of weak-alpha fringe pixels.
    const resized = resizeNearestRgba(pixels, frame.bounds.width, frame.bounds.height, width, height);
    const left = (frame.cell % columns) * outputCell + Math.floor((outputCell - width) / 2);
    const top = Math.floor(frame.cell / columns) * outputCell + outputCell - outputGuard - height;
    for (let y = 0; y < height; y += 1) resized.copy(output, ((top + y) * outputSize + left) * 4, y * width * 4, (y + 1) * width * 4);
    frameMeasurements.push({ cell: frame.cell + 1, sourceBounds: frame.bounds, sourceVisibleBounds: frame.visibleBounds,
      sourceVisiblePixels: frame.visiblePixels,
      normalizedWidth: width, normalizedHeight: height });
  }
  const buffer = await sharp(output, { raw: { width: outputSize, height: outputSize, channels: 4 } })
    .png({ compressionLevel: 9 }).toBuffer();
  const geometry = await inspectReferencedCharacterPng(buffer);
  return { buffer, source: { width: decoded.info.width, height: decoded.info.height, format: 'png', channels: 4 },
    processing: { operation: 'visible-alpha-bounds+4px-fringe+referenced-frame-extraction+common-nearest-scale+4x4-packing', ...extracted.measurements,
      alphaBoundsThreshold: threshold, sourceFringePixels: sourceFringe,
      softAlphaNormalization: 'Keep alpha 1-12 inside each visible alpha>12 bbox expanded by 4 source pixels; discard only alpha 1-12 outside those bounds. No alpha>12 source pixel is removed before resize.',
      uniformScale, maximumSourceFrameWidth: maximumWidth, maximumSourceFrameHeight: maximumHeight,
      frameMeasurements, ...geometry } };
};

export const inspectReferencedCharacterPng = async bytes => {
  const { data, info } = await readPng(bytes);
  if (info.width !== outputSize || info.height !== outputSize) throw new Error('Installed sheet must be 1024 by 1024 RGBA PNG.');
  let minimumGuard = outputCell;
  const visiblePixelsByCell = [];
  const visibleFootBaselinesByCell = [];
  for (let cell = 0; cell < 16; cell += 1) {
    let visible = 0;
    let visibleBottom = -1;
    for (let y = 0; y < outputCell; y += 1) for (let x = 0; x < outputCell; x += 1) {
      const index = ((Math.floor(cell / columns) * outputCell + y) * info.width + cell % columns * outputCell + x) * 4;
      if (data[index + 3] <= threshold) continue;
      visible += 1;
      visibleBottom = Math.max(visibleBottom, y);
      const guard = Math.min(x, y, outputCell - 1 - x, outputCell - 1 - y);
      if (guard < outputGuard) throw new Error(`Installed cell ${cell + 1} violates the 12 px guard.`);
      minimumGuard = Math.min(minimumGuard, guard);
    }
    if (!visible) throw new Error(`Installed cell ${cell + 1} is empty.`);
    visiblePixelsByCell.push(visible);
    visibleFootBaselinesByCell.push(visibleBottom);
  }
  return { nonemptyCells: 16, minimumGuard, visiblePixelsByCell, visibleFootBaselinesByCell };
};

const publicRecord = (job, source, reference, normalized, proof) => ({
  kind: job.kind, id: job.id, name: job.name, universe: job.universe, output: job.output,
  source: { provider: 'OpenAI', interface: 'built-in image_gen', assertion: 'declared by the private input plan' },
  sourceImage: { sha256: source.sha256, bytes: source.bytes.length, ...normalized.source },
  reference: { output: reference.output, sha256: reference.sha256, bytes: reference.bytes.length, format: 'png' },
  image: { sha256: sha256(normalized.buffer), bytes: normalized.buffer.length, width: outputSize, height: outputSize, channels: 4, format: 'png' },
  ...(proof ? { privateEvidence: { sha256: proof.sha256, publiclyAvailable: false } } : {}),
  processing: normalized.processing, fileAvailable: true,
  provenanceStatus: proof ? 'private-evidence-recorded' : 'declared-tool-source-without-private-proof-file',
  visualReview: { status: typeof job.visualReview === 'string' ? job.visualReview : job.visualReview.status,
    canonicalFidelityApproved: false }, canonicalFidelityApproved: false
});

export const installReferencedCharacterImages = async ({ root = defaultRoot, manifestPath, publicManifestPath,
  componentLayout = false, hooks = {} } = {}) => {
  root = path.resolve(root);
  if (!manifestPattern.test(publicManifestPath || '')) throw new Error('Public manifest must be a new JSON file under docs/audits/.');
  const planFile = path.resolve(manifestPath);
  let document;
  try { document = JSON.parse(await fs.readFile(planFile, 'utf8')); }
  catch { throw new Error('Private manifest must be an existing valid JSON file.'); }
  if (document.schemaVersion !== 1 || !Array.isArray(document.jobs) || !document.jobs.length) throw new Error('Expected a private schemaVersion 1 jobs manifest.');
  const publicDestination = await safeDestination(root, publicManifestPath);
  const identities = new Set();
  const outputs = new Set();
  const prepared = [];
  for (const job of document.jobs) {
    if (!job || !kindDirectories[job.kind] || !/^[a-z0-9_:-]+$/u.test(job.id || '')
      || !safeLabel(job.name) || !safeLabel(job.universe)
      || !outputPattern.test(job.output || '') || job.output.split('/')[3] !== kindDirectories[job.kind]
      || job.provider !== 'OpenAI' || job.interface !== 'built-in image_gen') throw new Error('Invalid character job identity, output or declared provider.');
    const review = typeof job.visualReview === 'string' ? job.visualReview : job.visualReview?.status;
    if (!['pending', 'close-to-reference'].includes(review)
      || (job.canonicalFidelityApproved ?? job.visualReview?.canonicalFidelityApproved) !== false) throw new Error('Explicit pending/close-to-reference review and no 1:1 certification are required.');
    const identity = `${job.kind}:${job.id}`;
    if (identities.has(identity) || outputs.has(job.output)) throw new Error('Duplicate job identity or output.');
    identities.add(identity); outputs.add(job.output);
    const destination = await safeDestination(root, `public${job.output}`);
    const source = await localInput(job.source, path.dirname(planFile), 'source', job.sourceSha256);
    const declaredReference = typeof job.reference === 'string' ? job.reference : job.reference?.path;
    const mappedReference = typeof declaredReference === 'string' && /^\/(?:images|sprites)\//u.test(declaredReference)
      ? path.join(root, 'public', declaredReference.slice(1)) : declaredReference;
    const reference = await localInput(typeof job.reference === 'object'
      ? { ...job.reference, path: mappedReference } : mappedReference,
    path.dirname(planFile), 'reference', job.referenceSha256);
    const referenceRelative = path.relative(path.join(root, 'public'), reference.file).split(path.sep).join('/');
    if (!/^(?:images|sprites)\/[a-z0-9_./-]+\.png$/iu.test(referenceRelative)
      || referenceRelative.split('/').some(segment => segment === '.' || segment === '..')) throw new Error('Reference must exist inside the repository public image tree.');
    let referenceParent = path.join(root, 'public');
    for (const segment of referenceRelative.split('/')) {
      if ((await fs.lstat(referenceParent)).isSymbolicLink()) throw new Error('Reference paths cannot contain symlinks.');
      referenceParent = path.join(referenceParent, segment);
    }
    reference.output = `/${referenceRelative}`;
    if (path.extname(source.file).toLowerCase() !== '.png' || path.extname(reference.file).toLowerCase() !== '.png') throw new Error('Source and reference must be PNG files.');
    const referenceMetadata = await sharp(reference.bytes, { animated: false, failOn: 'error' }).metadata();
    if (referenceMetadata.format !== 'png' || referenceMetadata.pages > 1) throw new Error('Reference must be a real static PNG.');
    const proof = job.proofFile ? await localInput(job.proofFile, path.dirname(planFile), 'private evidence', job.proofSha256) : null;
    const normalized = await normalizeReferencedCharacterPng(source.bytes, {
      componentLayout: componentLayout || job.componentLayout === true || job.component === true
    });
    prepared.push({ destination, buffer: normalized.buffer, record: publicRecord(job, source, reference, normalized, proof) });
  }
  const publicDocument = { schemaVersion: 1, scope: 'New referenced PNG character sheets; historical generation records are unchanged.',
    policy: { privatePromptsAndIdentifiersPublished: false, canonicalFidelityApproved: false,
      generationIsBashCommand: false, normalization: 'format packing only; no synthesized, duplicated or recolored poses' },
    entries: prepared.map(asset => asset.record) };
  const manifestBytes = Buffer.from(`${JSON.stringify(publicDocument, null, 2)}\n`);
  const created = [];
  const writeNew = async (file, bytes) => {
    const handle = await fs.open(file, 'wx');
    created.push(file);
    try { await handle.writeFile(bytes); await handle.sync(); } finally { await handle.close(); }
  };
  try {
    for (let index = 0; index < prepared.length; index += 1) {
      const asset = prepared[index];
      await safeDestination(root, `public${asset.record.output}`);
      await fs.mkdir(path.dirname(asset.destination), { recursive: true });
      await writeNew(asset.destination, asset.buffer);
      await hooks.afterAssetWrite?.(index, asset);
    }
    await safeDestination(root, publicManifestPath);
    await fs.mkdir(path.dirname(publicDestination), { recursive: true });
    await writeNew(publicDestination, manifestBytes);
    await hooks.beforeFinalAudit?.();
    await auditReferencedCharacterImages({ root, manifestPath: publicManifestPath });
  } catch (error) {
    for (const file of created.reverse()) await fs.rm(file, { force: true });
    throw error;
  }
  return { installed: prepared.length, publicManifestPath, outputs: prepared.map(asset => asset.record.output) };
};

export const auditReferencedCharacterImages = async ({ root = defaultRoot, manifestPath } = {}) => {
  root = path.resolve(root);
  const manifest = JSON.parse(await fs.readFile(path.resolve(root, manifestPath), 'utf8'));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.entries) || !manifest.entries.length) throw new Error('Invalid public character image manifest.');
  const serialized = JSON.stringify(manifest);
  if (/"(?:generationId|generationPrompt|catalogPrompt|prompt|historicalPrompt|historicalGenerationId|currentLocalReferencePaths|proofFile)"\s*:/u.test(serialized)) throw new Error('Public manifest contains private generation fields.');
  for (const entry of manifest.entries) {
    if (!outputPattern.test(entry.output || '') || entry.canonicalFidelityApproved !== false
      || entry.visualReview?.canonicalFidelityApproved !== false
      || !digestPattern.test(entry.image?.sha256 || '') || !digestPattern.test(entry.sourceImage?.sha256 || '')
      || !digestPattern.test(entry.reference?.sha256 || '')
      || !/^\/(?:images|sprites)\/[a-z0-9_./-]+\.png$/iu.test(entry.reference?.output || '')
      || entry.reference.output.split('/').some(segment => segment === '.' || segment === '..')) throw new Error('Invalid public image record.');
    const referenceFile = path.join(root, 'public', entry.reference.output.slice(1));
    const referenceStat = await fs.lstat(referenceFile);
    if (!referenceStat.isFile() || referenceStat.isSymbolicLink()) throw new Error('Actual public reference must be a regular PNG file.');
    const referenceBytes = await fs.readFile(referenceFile);
    if (sha256(referenceBytes) !== entry.reference.sha256 || referenceBytes.length !== entry.reference.bytes) throw new Error('Actual public reference PNG differs from the manifest.');
    const file = path.join(root, 'public', entry.output.slice(1));
    const stat = await fs.lstat(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Installed PNG must be a regular file.');
    const bytes = await fs.readFile(file);
    if (sha256(bytes) !== entry.image.sha256 || bytes.length !== entry.image.bytes) throw new Error('Installed PNG SHA-256 or byte count differs from the public manifest.');
    const geometry = await inspectReferencedCharacterPng(bytes);
    if (geometry.minimumGuard !== entry.processing?.minimumGuard
      || JSON.stringify(geometry.visiblePixelsByCell) !== JSON.stringify(entry.processing?.visiblePixelsByCell)
      || JSON.stringify(geometry.visibleFootBaselinesByCell) !== JSON.stringify(entry.processing?.visibleFootBaselinesByCell)
      || entry.processing?.nonemptyCells !== 16
      || entry.processing?.sourceFringePixels !== sourceFringe
      || entry.processing?.alphaBoundsThreshold !== threshold
      || entry.processing?.sourceVisiblePixels !== entry.processing?.assignedVisiblePixels) throw new Error('Public source/packing measurements differ from the installed PNG.');
  }
  return { verified: manifest.entries.length, canonicalFidelityApproved: false, historicalLedgerModified: false };
};

const main = async () => {
  const args = process.argv.slice(2);
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === '--component-layout') { options.componentLayout = true; continue; }
    if (flag === '--help') {
      console.log('Usage: node scripts/installReferencedCharacterImages.mjs --manifest PRIVATE.json --public-manifest docs/audits/NEW.json [--component-layout] [--root REPO]\nAudit: node scripts/installReferencedCharacterImages.mjs --audit docs/audits/NEW.json [--root REPO]\nPrivate jobs need kind/id/name/universe/output/source/reference and SHA-256 for both inputs; declared provider/interface, explicit visualReview, canonicalFidelityApproved:false. Private proofFile+proofSha256 are optional. This command installs existing image_gen PNGs; it does not generate images.');
      return;
    }
    const fields = { '--root': 'root', '--manifest': 'manifestPath', '--public-manifest': 'publicManifestPath', '--audit': 'auditPath' };
    if (!fields[flag] || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error('Unknown flag or missing argument.');
    options[fields[flag]] = args[++index];
  }
  if (options.auditPath && options.manifestPath) throw new Error('Choose installation or audit.');
  const result = options.auditPath
    ? await auditReferencedCharacterImages({ root: options.root, manifestPath: options.auditPath })
    : await installReferencedCharacterImages(options);
  console.log(JSON.stringify(result));
};
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
