// Packs only genuine image_gen drawings. No pose duplication, mirroring,
// interpolation, or procedural replacement of missing animation frames.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const sourceDir = 'docs/combat-fidelity-wave3-2026-10-18/tifa-sources';
const outputDir = 'public/sprites/generated/melee-tifa-wave3';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const fileHash = async p => hash(await fs.readFile(p));
const inputs = {
  'tifa-motion-a.native.png': '/workspace/generated_images/exec-986ef1de-2564-4e66-bc63-cc3d1006457e.png',
  'tifa-motion-b.native.png': '/workspace/generated_images/exec-eef9675a-4721-4993-92bf-50f9ecb2c804.png',
  'tifa-defense.native.png': '/workspace/generated_images/exec-4dfce372-4887-4483-a322-85297e8a15be.png',
  'tifa-motion-missing-rows.native.png': '/workspace/generated_images/exec-73a05fc3-a05a-46cc-bd71-df3d61309dd4.png'
};
await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
for (const [savedName, input] of Object.entries(inputs)) {
  const saved = path.join(sourceDir, savedName);
  try { await fs.access(saved); } catch { await fs.copyFile(input, saved); }
}
const references = [];
for (const [asset, name] of [
  ['public/sprites/generated/heroes/final-fantasy-vii/tifa-ff7.png', 'tifa-motion-reference-original.png'],
  ['public/sprites/generated/combat-character-animations/tifa_ff7.png', 'tifa-motion-reference-presentation.png']
]) {
  const savedImage = path.join(sourceDir, name);
  try { await fs.access(savedImage); } catch { await fs.copyFile(asset, savedImage); }
  references.push({ asset, sha256: await fileHash(savedImage), savedImage });
}

async function segment(file, rows) {
  const bytes = await fs.readFile(file);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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
  const expected = rows * 4;
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
      sourceImage: file, nativeRow: Math.floor(i / 4), nativeColumn: i % 4,
      sourceRect: { x: b.x0, y: b.y0, width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1 } })) };
}

// The initial native images contain seven populated rows. Their real row
// assignments are explicit; one genuine new row fills each missing state.
const specs = [
  { id: 'tifa-motion-a', states: ['idle', 'walk', 'run', 'turn', 'jumpStart', 'jumpRise', 'jumpApex', 'fall'],
    initialStates: ['idle', 'walk', 'run', 'turn', 'jumpStart', 'jumpRise', 'fall'], missing: 'jumpApex', patchRow: 0 },
  { id: 'tifa-motion-b', states: ['fastFall', 'land', 'crouchEnter', 'crouchIdle', 'crouchExit', 'crouchCharge', 'taunt1', 'hitStun'],
    initialStates: ['fastFall', 'land', 'crouchEnter', 'crouchExit', 'crouchCharge', 'taunt1', 'hitStun'], missing: 'crouchIdle', patchRow: 1 },
  { id: 'tifa-defense', states: ['shieldEnter', 'shieldHold', 'shieldHit', 'perfectShield', 'shieldBreak', 'shieldExit', 'dead', 'defeat'],
    initialStates: ['shieldEnter', 'shieldHold', 'shieldHit', 'perfectShield', 'shieldExit', 'dead', 'defeat'], missing: 'shieldBreak', patchRow: 2 }
];
const patch = await segment(path.join(sourceDir, 'tifa-motion-missing-rows.native.png'), 3);
const entries = [];
for (const spec of specs) {
  const native = await segment(path.join(sourceDir, `${spec.id}.native.png`), 7);
  const sources = [native, patch];
  const frames = spec.states.flatMap(state => {
    if (state === spec.missing) return patch.frames.slice(spec.patchRow * 4, spec.patchRow * 4 + 4);
    const row = spec.initialStates.indexOf(state);
    if (row < 0) throw new Error(`Missing explicit row assignment: ${state}`);
    return native.frames.slice(row * 4, row * 4 + 4);
  });
  const scales = new Map(sources.map(s => [s.file, Math.min(236 / Math.max(...s.frames.map(f => f.width)), 234 / Math.max(...s.frames.map(f => f.height)))]));
  const layers = [], records = [], hashes = [];
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i], scale = scales.get(f.sourceImage);
    const width = Math.max(1, Math.round(f.width * scale)), height = Math.max(1, Math.round(f.height * scale));
    const pixels = await sharp(f.raw, { raw: { width: f.width, height: f.height, channels: 4 } }).resize(width, height, { kernel: 'nearest' }).png().toBuffer();
    const x = Math.floor((256 - width) / 2), y = 244 - height;
    layers.push({ input: pixels, left: i % 4 * 256 + x, top: Math.floor(i / 4) * 256 + y });
    const sha256 = hash(pixels); hashes.push(sha256);
    records.push({ state: spec.states[Math.floor(i / 4)], frame: i % 4, sourceImage: f.sourceImage, nativeRow: f.nativeRow,
      nativeColumn: f.nativeColumn, sourceRect: f.sourceRect, scale, destinationRect: { x, y, width, height }, sha256 });
  }
  if (new Set(hashes).size !== 32) throw new Error(`Duplicate native pose in ${spec.id}`);
  const file = path.join(outputDir, `${spec.id}.png`);
  await sharp({ create: { width: 1024, height: 2048, channels: 4, background: '#00000000' } }).composite(layers).png().toFile(file);
  const prompts = [`${spec.id}.prompt.txt`, 'tifa-motion-missing-rows.prompt.txt'];
  entries.push({ id: spec.id, heroId: 'tifa_ff7', universe: 'Final Fantasy VII', sheet: `/${file.replace(/^public\//, '')}`,
    states: spec.states, stateOrder: spec.states, columns: 4, rows: 8,
    dimensions: { width: 1024, height: 2048, cellWidth: 256, cellHeight: 256 }, sha256: await fileHash(file),
    sourceImage: native.file, sourceHash: native.sha256,
    sourceImages: sources.map(s => ({ path: s.file, sha256: s.sha256, dimensions: { width: s.width, height: s.height }, columns: s.columns, rows: s.rows })),
    referenceAsset: references[0].asset, referenceHash: references[0].sha256, referenceAssets: references,
    frameOrderByState: Object.fromEntries(spec.states.map(state => [state, [0, 1, 2, 3]])),
    normalization: { method: 'Alpha-connected segmentation of genuine native drawings; uniform per-source nearest-neighbor scaling and transparent packing.',
      baseline: 244, baselineDefinition: 'bottom-exclusive alpha-bounds anchor in each 256px cell', margins: 10,
      alphaSegmentationThreshold: 24, alphaCleanup: 'Near-transparent background noise below threshold excluded; all original PNG sources remain unchanged.',
      sourceScaleFactors: Object.fromEntries(scales), frameOrder: [0, 1, 2, 3], frames: records,
      syntheticPoses: false, duplicatedFrames: 0, mirroredFrames: 0,
      nativeSourceStateOrder: spec.initialStates, correctionState: spec.missing, correctionNativeRow: spec.patchRow },
    visualValidation: { reviewed: true, completeRows: 8, distinctNativePoses: 32, wholeCharacterContained: true,
      facing: spec.id === 'tifa-motion-a' ? 'right; turn includes back/three-quarter body rotation and ends facing right' : 'right; dead ends in side-lying KO',
      outfit: 'FF7 1997 Tifa: white sleeveless top, black skirt, two suspenders, red gloves and wrist/forearm bands, red boots, long tied dark-brown hair.',
      weapons: 'none; unarmed physical martial movements and forearm/glove guards',
      correction: `Initial source has 28 real poses and omits ${spec.missing}; the final atlas adds four new native drawings from correction row ${spec.patchRow}.`,
      limitations: ['Original generated fan art and adapted movement, not official frames.', 'Minor perspective, hair, anatomy and apparent scale variations remain between the native sources.', 'Timing and pixel identity are not certified 1:1 with the 1997 game.'] },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, jobId: null, generationId: null, date: '2026-10-18', nativeArtwork: true,
      canonicalVerified: false, networkVerified: false, canon1to1Verified: false,
      prompts: await Promise.all(prompts.map(async name => ({ path: path.join(sourceDir, name), sha256: await fileHash(path.join(sourceDir, name)) }))),
      normalizationScript: path.join(sourceDir, 'normalize-tifa-motion-atlases.mjs') }
  });
}
const generationSpecs = [
  { image: 'tifa-motion-a.native.png', prompt: 'tifa-motion-a.prompt.txt', poses: 28, missingState: 'jumpApex' },
  { image: 'tifa-motion-b.native.png', prompt: 'tifa-motion-b.prompt.txt', poses: 28, missingState: 'crouchIdle' },
  { image: 'tifa-defense.native.png', prompt: 'tifa-defense.prompt.txt', poses: 28, missingState: 'shieldBreak' },
  { image: 'tifa-motion-missing-rows.native.png', prompt: 'tifa-motion-missing-rows.prompt.txt', poses: 12 }
];
const generations = await Promise.all(generationSpecs.map(async g => ({
  provider: 'OpenAI', tool: 'image_gen', model: null, jobId: null, generationId: null,
  sourceImage: path.join(sourceDir, g.image), sha256: await fileHash(path.join(sourceDir, g.image)),
  prompt: path.join(sourceDir, g.prompt), promptSha256: await fileHash(path.join(sourceDir, g.prompt)), retainedPoses: g.poses,
  missingState: g.missingState || null, referencedImages: references.map(r => ({ path: r.savedImage, sha256: r.sha256 })), rejected: false
})));
const registry = { schemaVersion: 1, date: '2026-10-18', heroId: 'tifa_ff7', universe: 'Final Fantasy VII',
  canonicalVerified: false, networkVerified: false, canon1to1Verified: false, entries, generations,
  nativeGenerationCalls: 4, deliveredNativePoses: 96,
  incompleteInitialSources: generationSpecs.filter(g => g.missingState).map(g => ({ sourceImage: path.join(sourceDir, g.image), expectedPoses: 32, actualPoses: 28, missingState: g.missingState, resolution: 'All 28 native poses retained; four genuinely new drawings fill the missing state.' })),
  rejectedSources: [] };
await fs.writeFile('src/game/combat/tifaMeleeMotion.generated.json', JSON.stringify(registry, null, 2) + '\n');
await fs.writeFile(path.join(sourceDir, 'provenance-motion.json'), JSON.stringify(registry, null, 2) + '\n');
console.log(JSON.stringify({ entries: entries.map(e => ({ id: e.id, states: e.states, sha256: e.sha256 })), nativeGenerationCalls: 4, deliveredNativePoses: 96 }));
