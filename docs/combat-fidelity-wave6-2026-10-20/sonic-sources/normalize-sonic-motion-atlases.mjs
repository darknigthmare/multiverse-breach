// Packs only genuine image_gen anatomy. Sharp performs segmentation, uniform
// source calibration, nearest-neighbor scaling and packing; it draws no poses.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const sourceDir = 'docs/combat-fidelity-wave6-2026-10-20/sonic-sources';
const outputDir = 'public/sprites/generated/melee-sonic-wave6';
const check = process.argv.includes('--check');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash = async file => hash(await fs.readFile(file));
const sourcePath = name => path.join(sourceDir, `${name}.native.png`);
const reference = {
  asset: 'public/sprites/generated/heroes/sonic/sonic-hedgehog.png',
  savedImage: path.join(sourceDir, 'sonic-motion-reference-original.png')
};
reference.sha256 = await fileHash(reference.savedImage);
if (!check) await fs.mkdir(outputDir, { recursive: true });

async function segmentRegion(file, nativeRow, top, bottom) {
  const bytes = await fs.readFile(file);
  const { data, info } = await sharp(bytes).extract({ left: 0, top, width: (await sharp(bytes).metadata()).width, height: bottom - top }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const size = info.width * info.height;
  const labels = new Int32Array(size); labels.fill(-1);
  const queue = new Int32Array(size), components = [];
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
        const n = ny * info.width + nx;
        if (labels[n] < 0 && data[n * 4 + 3] >= 24) { labels[n] = id; queue[tail++] = n; }
      }
    }
    components.push({ id, pixels: tail, x0, y0, x1, y1 });
  }
  const rows = 1, expected = 4;
  const bodies = [...components].sort((a, b) => b.pixels - a.pixels).slice(0, expected);
  if (bodies.length !== expected || bodies.at(-1).pixels < bodies[0].pixels * 0.12) throw new Error(`Missing independent native pose in ${file}`);
  bodies.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const ordered = [];
  for (let row = 0; row < rows; row++) ordered.push(...bodies.slice(row * 4, row * 4 + 4).sort((a, b) => (a.x0 + a.x1) - (b.x0 + b.x1)));
  const bodyFrames = new Map(ordered.map((b, i) => [b.id, i]));
  const owner = components.map(c => {
    if (bodyFrames.has(c.id)) return bodyFrames.get(c.id);
    const cx = (c.x0 + c.x1) / 2, cy = (c.y0 + c.y1) / 2;
    let selected = 0, best = Infinity;
    ordered.forEach((b, i) => {
      const dx = Math.max(b.x0 - cx, 0, cx - b.x1), dy = Math.max(b.y0 - cy, 0, cy - b.y1);
      const d = dx * dx + dy * dy + 0.01 * ((cx - (b.x0 + b.x1) / 2) ** 2 + (cy - (b.y0 + b.y1) / 2) ** 2);
      if (d < best) { best = d; selected = i; }
    });
    return selected;
  });
  const bounds = ordered.map(() => ({ x0: info.width, y0: info.height, x1: -1, y1: -1 }));
  for (const c of components) {
    const b = bounds[owner[c.id]];
    b.x0 = Math.min(b.x0, c.x0); b.y0 = Math.min(b.y0, c.y0); b.x1 = Math.max(b.x1, c.x1); b.y1 = Math.max(b.y1, c.y1);
  }
  const buffers = bounds.map(b => Buffer.alloc((b.x1 - b.x0 + 1) * (b.y1 - b.y0 + 1) * 4));
  for (let at = 0; at < size; at++) {
    if (labels[at] < 0) continue;
    const frame = owner[labels[at]], b = bounds[frame];
    const offset = ((Math.floor(at / info.width) - b.y0) * (b.x1 - b.x0 + 1) + at % info.width - b.x0) * 4;
    data.copy(buffers[frame], offset, at * 4, at * 4 + 4);
  }
  return { file, sha256: hash(bytes), width: info.width, height: info.height, rows, columns: 4,
    frames: bounds.map((b, i) => ({ raw: buffers[i], width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1,
      sourceImage: file, nativeRow, nativeColumn: i % 4,
      sourceRect: { x: b.x0, y: b.y0 + top, width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1 } })) };
}


const nativeSpecs = {
  'sonic-motion-a': {
    bounds: [0,251,489,711,945,1157,1348,1534,1774],
    // All five crowded turn attempts are rejected as a row. Their bodies are
    // not separated/reconstructed; a new native row supplies the four poses.
    excludedRows: [3], observedRowCounts: [4,4,4,5,4,4,4,4],
    calibration: { row: 0, column: 0, state: 'idle' }
  },
  'sonic-motion-b': {
    bounds: [0,190,415,650,890,1134,1305,1545,1774],
    excludedRows: [], observedRowCounts: [4,4,4,4,4,4,4,4],
    calibration: { row: 6, column: 0, state: 'taunt1' }
  },
  'sonic-defense': {
    bounds: [0,230,450,690,940,1220,1455,1774],
    excludedRows: [5], observedRowCounts: [4,4,4,4,4,4,4],
    calibration: { row: 4, column: 3, state: 'shieldExit' }
  },
  'sonic-motion-corrections': {
    bounds: [0,470,887], excludedRows: [], observedRowCounts: [4,4],
    calibration: { row: 0, column: 0, state: 'turn' }
  },
  'sonic-motion-ko-correction': {
    bounds: [0,724], excludedRows: [], observedRowCounts: [4],
    calibration: { row: 0, column: 0, state: 'dead', projectionRatio: 203 / 255, reference: 'Original defense dead c0 source height203 versus shieldExit c3 height255; preserve this genuinely lowered pose.' }
  }
};
const natives = new Map();
for (const [id, spec] of Object.entries(nativeSpecs)) {
  const file = sourcePath(id), metadata = await sharp(file).metadata();
  const frames = [];
  for (let row = 0; row < spec.bounds.length - 1; row++) {
    if (spec.excludedRows.includes(row)) continue;
    const segmented = await segmentRegion(file, row, spec.bounds[row], spec.bounds[row + 1]);
    frames.push(...segmented.frames);
  }
  const calibrationFrame = frames.find(frame => frame.nativeRow === spec.calibration.row && frame.nativeColumn === spec.calibration.column);
  if (!calibrationFrame) throw new Error(`Missing standing calibration in ${id}`);
  natives.set(id, { id, file, sha256: await fileHash(file), width: metadata.width, height: metadata.height,
    frames, ...spec, calibrationFrame, calibrationStandingHeight: calibrationFrame.height / (spec.calibration.projectionRatio || 1) });
}
// The same anatomical height is calibrated once for every source. An entire
// source retains one scale; compact balls, crouches and KOs are never row-fit.
// A shared safety cap is applied to all sources before anything is packed.
let standingHeight = 190; // Shared with the21-state combat batch; never enlarge balls per row.
for (const source of natives.values()) {
  const h = source.calibrationStandingHeight;
  standingHeight = Math.min(standingHeight,
    236 * h / Math.max(...source.frames.map(frame => frame.width)),
    234 * h / Math.max(...source.frames.map(frame => frame.height)));
}
standingHeight = Math.floor(standingHeight);
for (const source of natives.values()) source.scale = standingHeight / source.calibrationStandingHeight;

const specs = [
  { id: 'sonic-motion-a', states: ['idle','walk','run','turn','jumpStart','jumpRise','jumpApex','fall'],
    initialStates: ['idle','walk','run','turn','jumpStart','jumpRise','jumpApex','fall'],
    corrections: { turn: { source: 'sonic-motion-corrections', row: 0 } } },
  { id: 'sonic-motion-b', states: ['fastFall','land','crouchEnter','crouchIdle','crouchExit','crouchCharge','taunt1','hitStun'],
    initialStates: ['fastFall','land','crouchEnter','crouchIdle','crouchExit','crouchCharge','taunt1','hitStun'], corrections: {} },
  { id: 'sonic-defense', states: ['shieldEnter','shieldHold','shieldHit','perfectShield','shieldBreak','shieldExit','dead','defeat'],
    initialStates: ['shieldEnter','shieldHold','shieldHit','shieldBreak','shieldExit','dead','defeat'],
    corrections: { perfectShield: { source: 'sonic-motion-corrections', row: 1 }, dead: { source: 'sonic-motion-ko-correction', row: 0 } } }
];
const calibrationRecord = source => ({
  sourceImage: source.file, state: source.calibration.state,
  nativeRow: source.calibration.row, nativeColumn: source.calibration.column,
  sourceBodyBounds: source.calibrationFrame.sourceRect,
  sourceStandingBodyHeight: source.calibration.projectionRatio ? null : source.calibrationFrame.height,
  sourceMeasuredBodyHeight: source.calibrationFrame.height,
  equivalentSourceStandingBodyHeight: source.calibrationStandingHeight,
  sourcePoseProjectionRatio: source.calibration.projectionRatio || 1,
  projectionReference: source.calibration.reference || null,
  ...(source.calibration.projectionRatio ? { projectionBodyReference: { sourceImage: sourcePath('sonic-defense'), nativeRow:5, nativeColumn:0, bodyBounds:{x:25,y:1248,width:191,height:203}, bodyHeight:203, standingState:'shieldExit', standingNativeRow:4, standingNativeColumn:3, standingBodyBounds:{x:699,y:957,width:166,height:255}, standingBodyHeight:255 } } : {}),
  normalizedStandingBodyHeight: standingHeight,
  scale: source.scale, measurementKind: 'full-anatomy-source-calibration',
  excludesWeaponEffects: true, sameScaleForEveryPoseInSource: true
});
const entries = [];
for (const spec of specs) {
  const original = natives.get(spec.id);
  const patchSources = [...new Set(Object.values(spec.corrections).map(patch => patch.source))].map(id => natives.get(id));
  const sources = [original, ...patchSources];
  const frames = spec.states.flatMap(state => {
    const patch = spec.corrections[state];
    const source = patch ? natives.get(patch.source) : original;
    const row = patch ? patch.row : spec.initialStates.indexOf(state);
    const poses = source.frames.filter(frame => frame.nativeRow === row);
    if (poses.length !== 4) throw new Error(`Missing native poses for ${state}`);
    return poses.map(frame => ({ ...frame, state, scale: source.scale }));
  });
  const layers = [], records = [], hashes = [];
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i], width = Math.round(frame.width * frame.scale), height = Math.round(frame.height * frame.scale);
    if (width > 236 || height > 234) throw new Error(`Unsafe native silhouette: ${frame.state}`);
    const pixels = await sharp(frame.raw, { raw: { width: frame.width, height: frame.height, channels: 4 } })
      .resize(width, height, { kernel: 'nearest' }).png().toBuffer();
    const x = Math.floor((256 - width) / 2), y = 244 - height;
    layers.push({ input: pixels, left: i % 4 * 256 + x, top: Math.floor(i / 4) * 256 + y });
    const sha256 = hash(pixels); hashes.push(sha256);
    records.push({ state: frame.state, frame: i % 4, sourceImage: frame.sourceImage,
      nativeRow: frame.nativeRow, nativeColumn: frame.nativeColumn, sourceRect: frame.sourceRect,
      scale: frame.scale, destinationRect: { x, y, width, height }, sha256 });
  }
  if (new Set(hashes).size !== 32) throw new Error(`Duplicated native frame in ${spec.id}`);
  const file = path.join(outputDir, `${spec.id}.png`);
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: '#00000000' } }).composite(layers).png().toBuffer();
  if (check) { if (hash(await fs.readFile(file)) !== hash(bytes)) throw new Error(`Stale atlas: ${file}`); }
  else await fs.writeFile(file, bytes);
  const prompts = [`${spec.id}.prompt.txt`, ...patchSources.map(source => `${source.id}.prompt.txt`)];
  entries.push({ id: spec.id, heroId: 'sonic_hedgehog', universe: 'Sonic', sheet: `/${file.replace(/^public\//, '')}`,
    states: spec.states, stateOrder: spec.states, columns: 4, rows: 8,
    dimensions: { width: 1024, height: 2048, cellWidth: 256, cellHeight: 256 }, sha256: hash(bytes),
    sourceImage: original.file, sourceHash: original.sha256,
    sourceImages: sources.map(source => ({ path: source.file, sha256: source.sha256,
      dimensions: { width: source.width, height: source.height }, nominalColumns: 4,
      observedRowCounts: source.observedRowCounts, rows: source.bounds.length - 1 })),
    referenceAsset: reference.asset, referenceHash: reference.sha256, referenceAssets: [reference],
    frameOrderByState: Object.fromEntries(spec.states.map(state => [state, [0,1,2,3]])),
    normalization: { method: 'Alpha-connected segmentation within explicit source rows; common standing-anatomy calibration, one nearest-neighbor scale per source, and transparent packing.',
      baseline: 244, baselineDefinition: 'bottom-exclusive alpha-bounds anchor in each 256px cell', margins: 10,
      alphaSegmentationThreshold: 24, alphaCleanup: 'Near-transparent background noise below threshold excluded; original sources remain untouched.',
      rowFit: false, commonStandingBodyHeight: standingHeight, sourceStatureCalibration: sources.map(calibrationRecord),
      sourceScaleFactors: Object.fromEntries(sources.map(source => [source.file, source.scale])),
      sourceRowBounds: Object.fromEntries(sources.map(source => [source.file, source.bounds])),
      frameOrder: [0,1,2,3], frames: records, syntheticPoses: false, duplicatedFrames: 0, mirroredFrames: 0,
      sourceStandingVsCompactBody: records.filter(frame => ['idle','jumpRise','jumpApex','crouchCharge','taunt1','shieldExit'].includes(frame.state)).map(frame => ({ state: frame.state, frame: frame.frame, sourceHeight: frame.sourceRect.height, packedHeight: frame.destinationRect.height, ratioToCalibratedStanding: frame.destinationRect.height / standingHeight })),
      nativeSourceStateOrder: spec.initialStates, correctionRowsByState: spec.corrections,
      discardedNativeRows: spec.id === 'sonic-motion-a' ? [{ nativeRow: 3, visiblePoseAttempts: 5, reason: 'Five crowded turn bodies replaced by four new native poses.' }] : spec.id === 'sonic-defense' ? [{ nativeRow: 5, poses: 4, reason: 'Final KO shoe crosses the native canvas right edge at13 opaque pixels; whole row replaced natively.' }] : [] },
    visualValidation: { reviewed: true, completeRows: 8, distinctNativePoses: 32, wholeCharacterContained: true,
      facing: spec.id === 'sonic-motion-a' ? 'right; corrected turn begins left and ends right through two back-three-quarter orientations' : 'right; KO and exhaustion end low on the ground',
      outfit: 'Sonic Adventure base cobalt-blue Sonic, green eyes, six long back quills, peach arms/muzzle/chest, white gloves, red shoes with broad white strap and gold buckle; no SOAP shoes.',
      weapons: 'none', transformations: 'none; no Super Sonic, gold palette, Emerald transformation or Shadow power',
      spinBody: 'The compact quilled blue shapes are native drawings of Sonic rolled into his actual body, with quill/shoe/glove rotations; no circle effect replaces the anatomy.',
      stature: 'Calibrated standing-body anatomy has one common target across sources. No per-row fitting, so curled balls, crouches, leaned sprints and lying KOs keep their shorter native projection.',
      correction: spec.id === 'sonic-motion-a' ? 'Discard the crowded five-attempt turn row and retain four native corrective turn poses.' : spec.id === 'sonic-defense' ? 'Initial source contains seven rows; perfectShield comes from four new native evasions, and the native KO row is replaced by four new complete bodies because the original final shoe was clipped.' : 'All eight initial rows are retained.',
      limitations: ['Original generated pixel art and adapted choreography, not official frames.', 'Minor anatomy, quill perspective and native proportion variation remain; physical guard/evasion is a gameplay adaptation.', 'No source-game frame timing, pixel identity or 1:1 Sonic Adventure animation certification.'] },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, jobId: null, generationId: null,
      date: '2026-10-20', nativeArtwork: true, canonicalVerified: false, networkVerified: false, canon1to1Verified: false,
      prompts: await Promise.all(prompts.map(async name => ({ path: path.join(sourceDir, name), sha256: await fileHash(path.join(sourceDir, name)) }))),
      actualToolCalls: path.join(sourceDir, 'actual-tool-calls-motion.json'), actualToolCallsSha256: await fileHash(path.join(sourceDir, 'actual-tool-calls-motion.json')), normalizationScript: path.join(sourceDir, 'normalize-sonic-motion-atlases.mjs') }
  });
}
const generationSpecs = [
  { id: 'sonic-motion-a', retainedPoses: 28, visiblePoseAttempts: 33, discardedPoseAttempts: 5, correction: 'The complete crowded turn row is discarded and replaced natively.' },
  { id: 'sonic-motion-b', retainedPoses: 32, visiblePoseAttempts: 32, discardedPoseAttempts: 0 },
  { id: 'sonic-defense', retainedPoses: 24, visiblePoseAttempts: 28, discardedPoseAttempts: 4, missingState: 'perfectShield', correction: 'Whole native KO row replaced after detecting13 alpha pixels on the canvas edge through the final shoe.' },
  { id: 'sonic-motion-corrections', retainedPoses: 8, visiblePoseAttempts: 8, discardedPoseAttempts: 0 },
  { id: 'sonic-motion-ko-correction', retainedPoses: 4, visiblePoseAttempts: 4, discardedPoseAttempts: 0 }
];
const generations = await Promise.all(generationSpecs.map(async generation => ({ ...generation,
  provider: 'OpenAI', tool: 'image_gen', model: null, jobId: null, generationId: null,
  sourceImage: sourcePath(generation.id), sha256: await fileHash(sourcePath(generation.id)),
  prompt: path.join(sourceDir, `${generation.id}.prompt.txt`), promptSha256: await fileHash(path.join(sourceDir, `${generation.id}.prompt.txt`)),
  canonicalVerified: false, canon1to1Verified: false, rejected: false })));
const registry = { schemaVersion: 1, date: '2026-10-20', heroId: 'sonic_hedgehog', universe: 'Sonic',
  canonicalVerified: false, networkVerified: false, canon1to1Verified: false, entries, generations,
  nativeGenerationCalls: 5, deliveredNativePoses: 96,
  incompleteInitialSources: [{ sourceImage: sourcePath('sonic-motion-a'), requestedRows: 8, observedRowCounts: [4,4,4,5,4,4,4,4], rejectedNativeRow: 3, reason: 'Five crowded turn pose attempts, replaced by a new native four-pose strip row.' },
    { sourceImage: sourcePath('sonic-defense'), expectedPoses: 32, actualPoses: 28, missingState: 'perfectShield', resolution: 'Four new native poses from the second correction-strip row.' }],
  discardedFrames: [{ sourceImage: sourcePath('sonic-motion-a'), nativeRow: 3, visiblePoseAttempts: 5, reason: 'Crowded five-pose turn row replaced; no image reconstruction.' }, { sourceImage: sourcePath('sonic-defense'), nativeRow: 5, poses: 4, reason: 'KO row replaced natively because final shoe was clipped.' }],
  rejectedSources: [] };
const encoded = JSON.stringify(registry, null, 2) + '\n';
for (const target of ['src/game/combat/sonicMeleeMotion.generated.json', path.join(sourceDir, 'provenance-motion.json')]) {
  if (check) { if (await fs.readFile(target, 'utf8') !== encoded) throw new Error(`Stale provenance: ${target}`); }
  else await fs.writeFile(target, encoded);
}
console.log(JSON.stringify({ check, standingBodyHeight: standingHeight, entries: entries.map(entry => ({ id: entry.id, states: entry.states, sha256: entry.sha256 })), calibrations: [...natives.values()].map(calibrationRecord), nativeGenerationCalls: 5, deliveredNativePoses: 96 }));
