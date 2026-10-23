// Image_gen drew every pose. Sharp only segments, scales and packs originals.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const sourceDir = 'docs/combat-fidelity-wave7-2026-10-20/ragna-sources';
const outputDir = 'public/sprites/generated/melee-ragna-wave7';
const check = process.argv.includes('--check');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash = async file => hash(await fs.readFile(file));
const sourcePath = id => path.join(sourceDir, `${id}.native.png`);
const reference = {
  asset: 'public/sprites/generated/heroes/blazblue/ragna.png',
  savedImage: path.join(sourceDir, 'ragna-motion-reference-original.png')
};
reference.sha256 = await fileHash(reference.savedImage);

const specifications = [
  { id: 'ragna-motion-a', states: ['idle','walk','run','turn','jumpStart','jumpRise','jumpApex','fall'],
    calibration: { row: 0, column: 0, state: 'idle', bodyBounds: { x: 86, y: 11, width: 128, height: 196 } } },
  { id: 'ragna-motion-b', states: ['fastFall','land','crouchEnter','crouchIdle','crouchExit','crouchCharge','taunt1','hitStun'],
    calibration: { row: 6, column: 0, state: 'taunt1', bodyBounds: { x: 69, y: 1304, width: 119, height: 219 } } },
  { id: 'ragna-defense', states: ['shieldEnter','shieldHold','shieldHit','perfectShield','shieldBreak','shieldExit','dead','defeat'],
    calibration: { row: 5, column: 3, state: 'shieldExit', bodyBounds: { x: 721, y: 1188, width: 137, height: 216 } } }
];

async function segmentSource(file) {
  const bytes = await fs.readFile(file);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const size = info.width * info.height;
  const labels = new Int32Array(size).fill(-1), queue = new Int32Array(size), components = [];
  for (let start = 0; start < size; start++) {
    if (labels[start] >= 0 || data[start * 4 + 3] < 24) continue;
    const id = components.length;
    let head = 0, tail = 1, x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    queue[0] = start; labels[start] = id;
    while (head < tail) {
      const at = queue[head++], x = at % info.width, y = Math.floor(at / info.width);
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= info.width || ny >= info.height) continue;
        const next = ny * info.width + nx;
        if (labels[next] < 0 && data[next * 4 + 3] >= 24) { labels[next] = id; queue[tail++] = next; }
      }
    }
    components.push({ id, pixels: tail, x0, y0, x1, y1 });
  }
  // Segment whole connected bodies before assigning rows. In source B the
  // uppermost landing hair and a fast-fall boot overlap in Y but not in X;
  // horizontal row cuts would cut real anatomy. No pixel is reconstructed.
  const bodies = [...components].sort((a, b) => b.pixels - a.pixels).slice(0, 32);
  if (bodies.length !== 32 || bodies.at(-1).pixels < 1000) throw new Error(`Incomplete native source ${file}`);
  bodies.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const ordered = [];
  for (let row = 0; row < 8; row++) ordered.push(...bodies.slice(row * 4, row * 4 + 4).sort((a, b) => (a.x0 + a.x1) - (b.x0 + b.x1)));
  const bodyFrames = new Map(ordered.map((body, i) => [body.id, i]));
  const owner = components.map(component => {
    if (bodyFrames.has(component.id)) return bodyFrames.get(component.id);
    const cx = (component.x0 + component.x1) / 2, cy = (component.y0 + component.y1) / 2;
    let selected = 0, best = Infinity;
    ordered.forEach((body, i) => {
      const dx = Math.max(body.x0 - cx, 0, cx - body.x1), dy = Math.max(body.y0 - cy, 0, cy - body.y1);
      const distance = dx * dx + dy * dy + 0.01 * ((cx - (body.x0 + body.x1) / 2) ** 2 + (cy - (body.y0 + body.y1) / 2) ** 2);
      if (distance < best) { best = distance; selected = i; }
    });
    return selected;
  });
  const bounds = ordered.map(() => ({ x0: info.width, y0: info.height, x1: -1, y1: -1 }));
  for (const component of components) {
    const target = bounds[owner[component.id]];
    target.x0 = Math.min(target.x0, component.x0); target.y0 = Math.min(target.y0, component.y0);
    target.x1 = Math.max(target.x1, component.x1); target.y1 = Math.max(target.y1, component.y1);
  }
  const buffers = bounds.map(bound => Buffer.alloc((bound.x1 - bound.x0 + 1) * (bound.y1 - bound.y0 + 1) * 4));
  for (let at = 0; at < size; at++) {
    if (labels[at] < 0) continue;
    const frame = owner[labels[at]], bound = bounds[frame];
    const offset = ((Math.floor(at / info.width) - bound.y0) * (bound.x1 - bound.x0 + 1) + at % info.width - bound.x0) * 4;
    data.copy(buffers[frame], offset, at * 4, at * 4 + 4);
  }
  const edgePixels = { top: 0, bottom: 0, left: 0, right: 0 };
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] < 24) continue;
    if (y === 0) edgePixels.top++;
    if (y === info.height - 1) edgePixels.bottom++;
    if (x === 0) edgePixels.left++;
    if (x === info.width - 1) edgePixels.right++;
  }
  if (Object.values(edgePixels).some(Boolean)) throw new Error(`Native canvas clips a pose: ${file}`);
  return { file, sha256: hash(bytes), width: info.width, height: info.height, edgePixels,
    frames: bounds.map((bound, i) => ({ raw: buffers[i], width: bound.x1 - bound.x0 + 1, height: bound.y1 - bound.y0 + 1,
      sourceImage: file, nativeRow: Math.floor(i / 4), nativeColumn: i % 4,
      sourceRect: { x: bound.x0, y: bound.y0, width: bound.x1 - bound.x0 + 1, height: bound.y1 - bound.y0 + 1 } })) };
}

const standingBodyHeight = 190;
const entries = [], generations = [], calibrations = [];
if (!check) await fs.mkdir(outputDir, { recursive: true });
for (const specification of specifications) {
  const source = await segmentSource(sourcePath(specification.id));
  const calibration = specification.calibration;
  const scale = standingBodyHeight / calibration.bodyBounds.height;
  const calibrationFrame = source.frames[calibration.row * 4 + calibration.column];
  if (calibration.bodyBounds.y < calibrationFrame.sourceRect.y || calibration.bodyBounds.y + calibration.bodyBounds.height > calibrationFrame.sourceRect.y + calibrationFrame.sourceRect.height) throw new Error('Invalid body-only calibration');
  const stature = { sourceImage: source.file, state: calibration.state, nativeRow: calibration.row, nativeColumn: calibration.column,
    sourceBodyBounds: calibration.bodyBounds, sourceStandingBodyHeight: calibration.bodyBounds.height,
    normalizedStandingBodyHeight: standingBodyHeight, scale, measurementKind: 'visual-body-roi',
    excludesWeaponEffects: true, sameScaleForEveryPoseInSource: true,
    reason: 'Measure white-hair crown through boot soles on a complete upright pose; lateral Blood-Scythe blade excluded. A single source-wide scale preserves real crouch and fallen-body projections.' };
  calibrations.push(stature);
  const layers = [], frames = [], hashes = [];
  for (let i = 0; i < source.frames.length; i++) {
    const frame = source.frames[i], width = Math.round(frame.width * scale), height = Math.round(frame.height * scale);
    if (width > 236 || height > 234) throw new Error(`Unsafe silhouette ${specification.id} frame${i}; never row-fit`);
    const pixels = await sharp(frame.raw, { raw: { width: frame.width, height: frame.height, channels: 4 } }).resize(width, height, { kernel: 'nearest' }).png().toBuffer();
    const x = Math.floor((256 - width) / 2), y = 244 - height, sha256 = hash(pixels);
    layers.push({ input: pixels, left: i % 4 * 256 + x, top: Math.floor(i / 4) * 256 + y });
    hashes.push(sha256);
    frames.push({ state: specification.states[Math.floor(i / 4)], frame: i % 4,
      sourceImage: source.file, nativeRow: frame.nativeRow, nativeColumn: frame.nativeColumn,
      sourceRect: frame.sourceRect, scale, destinationRect: { x, y, width, height }, sha256 });
  }
  if (new Set(hashes).size !== 32) throw new Error(`Duplicate pose in ${specification.id}`);
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: '#00000000' } }).composite(layers).png().toBuffer();
  const output = path.join(outputDir, `${specification.id}.png`);
  if (check) { if (await fileHash(output) !== hash(bytes)) throw new Error(`Stale atlas ${output}`); }
  else await fs.writeFile(output, bytes);
  const prompt = path.join(sourceDir, `${specification.id}.prompt.txt`);
  const sourceRecord = { path: source.file, sha256: source.sha256, dimensions: { width: source.width, height: source.height },
    nominalColumns: 4, observedRowCounts: [4,4,4,4,4,4,4,4], rows: 8 };
  entries.push({ id: specification.id, heroId: 'ragna', universe: 'BlazBlue', sheet: `/${output.replace(/^public\//, '')}`,
    states: specification.states, stateOrder: specification.states, columns: 4, rows: 8,
    dimensions: { width: 1024, height: 2048, cellWidth: 256, cellHeight: 256 }, sha256: hash(bytes),
    sourceImage: source.file, sourceHash: source.sha256, sourceImages: [sourceRecord],
    referenceAsset: reference.asset, referenceHash: reference.sha256, referenceAssets: [reference],
    frameOrderByState: Object.fromEntries(specification.states.map(state => [state, [0,1,2,3]])),
    normalization: { method: 'Alpha-connected whole-pose segmentation; order complete bodies into8 rows of4, source-wide body-only calibration, nearest-neighbor scale and transparent packing.',
      baseline: 244, baselineDefinition: 'bottom-exclusive complete pose alpha-bounds anchor in each256px cell; upright boot soles meet this anchor', margins: 10,
      alphaSegmentationThreshold: 24, alphaCleanup: 'Exclude near-transparent background noise below24; archived originals are untouched.',
      rowFit: false, commonStandingBodyHeight: standingBodyHeight, sourceStatureCalibration: [stature], sourceScaleFactors: { [source.file]: scale },
      frameOrder: [0,1,2,3], frames, syntheticPoses: false, duplicatedFrames: 0, mirroredFrames: 0,
      sourceCanvasEdgePixels: source.edgePixels, nativeSourceStateOrder: specification.states, correctionRowsByState: {}, discardedNativeRows: [],
      sourceStandingVsCompactBody: frames.filter(frame => ['idle','crouchEnter','crouchIdle','crouchExit','taunt1','shieldExit','dead','defeat'].includes(frame.state)).map(frame => ({ state: frame.state, frame: frame.frame, sourceHeight: frame.sourceRect.height, packedHeight: frame.destinationRect.height, ratioToCalibratedStanding: frame.destinationRect.height / standingBodyHeight })) },
    visualValidation: { reviewed: true, completeRows: 8, distinctNativePoses: 32, wholeCharacterContained: true,
      facing: specification.id === 'ragna-motion-a' ? 'Right by default; turn native row3 begins left, passes through back three-quarter orientations, and ends right, chronological0123.' : 'Right by default; falling and defeat poses retain their drawn projection.',
      outfit: 'Ragna CSE2011: white spiky hair, red long coat/black straps/silver buckles, black underclothes/trousers, red-black boots, black gloves/silver details.',
      weapons: 'Blood-Scythe drawn as a thick gray mechanical broad sword, dark spine and red grip; one physical weapon per character, carried and physically braced.',
      handedness: 'Prompt fixes anatomical right Azure Grimoire and red right/green left eye; left-hand or two-hand sword carry selected for coherent choreography, not asserted exclusive canon. Small profile eyes/occluded grips cannot verify every anatomical side. Runtime P2 mirroring is an adaptation.',
      transformations: 'No Black Beast, monster arm, new transformation, beam or procedural body.',
      stature: '190px upright body calibration excluding lateral weapon; one source-wide scale. Actual knee flexion, leaps, low crouches, kneeling and lying KOs remain lower.',
      limitations: ['Original image-generated pixel art and adapted movement/guard choreography, not official extracted frames.', 'Pixel-level anatomy, sword silhouette, hand contacts, costume and heterochromia are interpreted and cannot certify1:1 canon.', 'Shield states use physical sword defense; source-game Barrier mechanics and exact frame timings are not reproduced.'] },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, jobId: null, generationId: null, date: '2026-10-20',
      nativeArtwork: true, canonicalVerified: false, networkVerified: false, canon1to1Verified: false,
      sourceWork: 'BlazBlue: Continuum Shift Extend (2011)', prompts: [{ path: prompt, sha256: await fileHash(prompt) }],
      actualToolCalls: path.join(sourceDir, 'actual-tool-calls-motion.json'), actualToolCallsSha256: await fileHash(path.join(sourceDir, 'actual-tool-calls-motion.json')),
      normalizationScript: path.join(sourceDir, 'normalize-ragna-motion-atlases.mjs') } });
  generations.push({ id: specification.id, provider: 'OpenAI', tool: 'image_gen', model: null, jobId: null, generationId: null,
    sourceImage: source.file, sha256: source.sha256, prompt, promptSha256: await fileHash(prompt),
    visiblePoseAttempts: 32, retainedPoses: 32, discardedPoseAttempts: 0, canonicalVerified: false, canon1to1Verified: false, rejected: false });
}
const registry = { schemaVersion: 1, date: '2026-10-20', heroId: 'ragna', universe: 'BlazBlue', sourceWork: 'BlazBlue: Continuum Shift Extend (2011)',
  canonicalVerified: false, networkVerified: false, canon1to1Verified: false, entries, generations,
  nativeGenerationCalls: 3, deliveredNativePoses: 96, incompleteInitialSources: [], discardedFrames: [], rejectedSources: [] };
const encoded = JSON.stringify(registry, null, 2) + '\n';
for (const target of ['src/game/combat/ragnaMeleeMotion.generated.json', path.join(sourceDir, 'provenance-motion.json')]) {
  if (check) { if (await fs.readFile(target, 'utf8') !== encoded) throw new Error(`Stale provenance ${target}`); }
  else await fs.writeFile(target, encoded);
}
console.log(JSON.stringify({ check, standingBodyHeight, entries: entries.map(entry => ({ id: entry.id, states: entry.states, sha256: entry.sha256 })), calibrations, nativeGenerationCalls: 3, deliveredNativePoses: 96 }));
