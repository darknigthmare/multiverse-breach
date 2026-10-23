// Reproducible segmentation and packing of real image_gen illustrations.
// This script never creates a pose, transforms a pose into another state,
// mirrors a frame, or fills a missing frame by duplication.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const sourceDir = 'docs/combat-fidelity-wave2-2026-10-18/cloud-sources';
const outputDir = 'public/sprites/generated/melee-cloud-wave2';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readHash = async file => hash(await fs.readFile(path.resolve(root, file)));
const imageInputs = {
  'cloud-motion-a.native.png': '/workspace/generated_images/exec-bdfac142-21e8-4a77-9af9-fe573d570b70.png',
  'cloud-motion-b.initial-rejected.png': '/workspace/generated_images/exec-2c4f148c-e528-4671-95e4-2a008b9f1124.png',
  'cloud-motion-b.corrected.png': '/workspace/generated_images/exec-1c96dcb3-6096-4503-bf24-6adaaa858666.png',
  'cloud-motion-b.patch-rows.png': '/workspace/generated_images/exec-3b91390c-af3e-4bb6-9837-ffdb7b00dee3.png',
  'cloud-weapon-retention.patch.png': '/workspace/generated_images/exec-7fab87cf-9a99-474d-9ed5-6d0fd9b3f6e1.png',
  'cloud-defense.native.png': '/workspace/generated_images/exec-97b7b957-3888-43b4-a5e2-e3a5adddb7fa.png'
};
await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
for (const [dest, input] of Object.entries(imageInputs)) {
  const saved = path.join(sourceDir, dest);
  try { await fs.access(saved); } catch { await fs.copyFile(input, saved); }
}
const referencePaths = [
  'public/sprites/generated/heroes/final-fantasy-vii/cloud-ff7.png',
  'public/sprites/generated/combat-character-animations/cloud_ff7.png'
];
const references = [];
for (let i = 0; i < referencePaths.length; i++) {
  const asset = referencePaths[i];
  const saved = path.join(sourceDir, `cloud-reference-${i === 0 ? 'original-hero' : 'native-presentation'}.png`);
  await fs.copyFile(asset, saved);
  references.push({ asset, sha256: await readHash(asset), savedImage: saved });
}
// The final native correction was conditioned on these intermediate atlases.
// Preserve their exact bytes before rebuilding the final packed atlases.
for (const id of ['cloud-motion-b', 'cloud-defense']) {
  const snapshot = path.join(sourceDir, `${id}.weapon-patch-reference.png`);
  try { await fs.access(snapshot); } catch { await fs.copyFile(path.join(outputDir, `${id}.png`), snapshot); }
}

// Alpha-connected components separate silhouettes even when the native model
// does not align the illustration to an exact rectangular input grid.
async function segment(file, rows) {
  const bytes = await fs.readFile(file);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const size = info.width * info.height;
  const labels = new Int32Array(size);
  labels.fill(-1);
  const queue = new Int32Array(size);
  const components = [];
  for (let start = 0; start < size; start++) {
    if (labels[start] >= 0 || data[start * 4 + 3] < 24) continue;
    const id = components.length;
    let head = 0, tail = 1, x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    queue[0] = start;
    labels[start] = id;
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
  const expected = rows * 4;
  const bodies = [...components].sort((a, b) => b.pixels - a.pixels).slice(0, expected);
  if (bodies.length !== expected || bodies.at(-1).pixels < bodies[0].pixels * 0.12) {
    throw new Error(`Expected ${expected} independent complete illustrations in ${file}`);
  }
  bodies.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const ordered = [];
  for (let row = 0; row < rows; row++) {
    ordered.push(...bodies.slice(row * 4, row * 4 + 4).sort((a, b) => (a.x0 + a.x1) - (b.x0 + b.x1)));
  }
  const bodyFrames = new Map(ordered.map((b, i) => [b.id, i]));
  const owner = components.map(comp => {
    if (bodyFrames.has(comp.id)) return bodyFrames.get(comp.id);
    const cx = (comp.x0 + comp.x1) / 2, cy = (comp.y0 + comp.y1) / 2;
    let closest = 0, best = Infinity;
    ordered.forEach((b, i) => {
      const dx = Math.max(b.x0 - cx, 0, cx - b.x1), dy = Math.max(b.y0 - cy, 0, cy - b.y1);
      const centerDistance = (cx - (b.x0 + b.x1) / 2) ** 2 + (cy - (b.y0 + b.y1) / 2) ** 2;
      const distance = dx * dx + dy * dy + 0.01 * centerDistance;
      if (distance < best) { best = distance; closest = i; }
    });
    return closest;
  });
  const bounds = ordered.map(() => ({ x0: info.width, y0: info.height, x1: -1, y1: -1 }));
  for (const c of components) {
    const b = bounds[owner[c.id]];
    b.x0 = Math.min(b.x0, c.x0); b.y0 = Math.min(b.y0, c.y0); b.x1 = Math.max(b.x1, c.x1); b.y1 = Math.max(b.y1, c.y1);
  }
  const buffers = bounds.map(b => Buffer.alloc((b.x1 - b.x0 + 1) * (b.y1 - b.y0 + 1) * 4));
  for (let at = 0; at < size; at++) {
    if (labels[at] < 0) continue;
    const frame = owner[labels[at]], b = bounds[frame], x = at % info.width, y = Math.floor(at / info.width);
    const out = ((y - b.y0) * (b.x1 - b.x0 + 1) + x - b.x0) * 4;
    data.copy(buffers[frame], out, at * 4, at * 4 + 4);
  }
  const frames = bounds.map((b, i) => ({
    raw: buffers[i], width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1,
    sourceRect: { x: b.x0, y: b.y0, width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1 },
    sourceImage: file, nativeRow: Math.floor(i / 4), nativeColumn: i % 4
  }));
  return { frames, file, width: info.width, height: info.height, sha256: hash(bytes) };
}

const specs = [
  { id: 'cloud-motion-a', source: 'cloud-motion-a.native.png', states: ['idle', 'walk', 'run', 'turn', 'jumpStart', 'jumpRise', 'jumpApex', 'fall'] },
  { id: 'cloud-motion-b', source: 'cloud-motion-b.corrected.png', states: ['fastFall', 'land', 'crouchEnter', 'crouchIdle', 'crouchExit', 'crouchCharge', 'taunt1', 'hitStun'] },
  { id: 'cloud-defense', source: 'cloud-defense.native.png', states: ['shieldEnter', 'shieldHold', 'shieldHit', 'perfectShield', 'shieldBreak', 'shieldExit', 'dead', 'defeat'] }
];
const entries = [];
for (const spec of specs) {
  const native = await segment(path.join(sourceDir, spec.source), 8);
  const sources = [native];
  const frames = [...native.frames];
  if (spec.id === 'cloud-motion-b') {
    const patch = await segment(path.join(sourceDir, 'cloud-motion-b.patch-rows.png'), 2);
    sources.push(patch);
    frames.splice(4, 4, ...patch.frames.slice(0, 4));
    frames.splice(12, 4, ...patch.frames.slice(4, 8));
  }
  if (spec.id === 'cloud-motion-b' || spec.id === 'cloud-defense') {
    const patch = await segment(path.join(sourceDir, 'cloud-weapon-retention.patch.png'), 2);
    sources.push(patch);
    if (spec.id === 'cloud-motion-b') frames.splice(20, 4, ...patch.frames.slice(0, 4));
    else frames.splice(16, 4, ...patch.frames.slice(4, 8));
  }
  // One uniform scale for all retained poses from a given native source. The
  // larger correction strip gets its own uniform scale; no per-pose squash.
  const scales = new Map(sources.map(s => {
    return [s.file, Math.min(236 / Math.max(...s.frames.map(f => f.width)), 234 / Math.max(...s.frames.map(f => f.height)))];
  }));
  const layers = [], frameRecords = [], frameHashes = [];
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i], scale = scales.get(f.sourceImage);
    const width = Math.max(1, Math.round(f.width * scale)), height = Math.max(1, Math.round(f.height * scale));
    const pixels = await sharp(f.raw, { raw: { width: f.width, height: f.height, channels: 4 } }).resize(width, height, { kernel: 'nearest' }).png().toBuffer();
    const left = Math.floor((256 - width) / 2), top = 244 - height;
    layers.push({ input: pixels, left: (i % 4) * 256 + left, top: Math.floor(i / 4) * 256 + top });
    frameHashes.push(hash(pixels));
    frameRecords.push({ state: spec.states[Math.floor(i / 4)], frame: i % 4, sourceImage: f.sourceImage,
      nativeRow: f.nativeRow, nativeColumn: f.nativeColumn, sourceRect: f.sourceRect, scale,
      destinationRect: { x: left, y: top, width, height }, sha256: hash(pixels) });
  }
  if (new Set(frameHashes).size !== 32) throw new Error(`Duplicate native frames in ${spec.id}`);
  const output = path.join(outputDir, `${spec.id}.png`);
  await sharp({ create: { width: 1024, height: 2048, channels: 4, background: '#00000000' } }).composite(layers).png().toFile(output);
  const prompts = [`${spec.id}.prompt.txt`, ...(spec.id === 'cloud-motion-b' ? ['cloud-motion-b.correction.prompt.txt', 'cloud-motion-b.patch-rows.prompt.txt'] : []), ...(spec.id === 'cloud-motion-b' || spec.id === 'cloud-defense' ? ['cloud-weapon-retention.patch.prompt.txt'] : [])];
  entries.push({
    id: spec.id, heroId: 'cloud_ff7', universe: 'Final Fantasy VII', sheet: `/${output.replace(/^public\//, '')}`,
    states: spec.states, columns: 4, rows: 8, dimensions: { width: 1024, height: 2048, cellWidth: 256, cellHeight: 256 },
    sha256: await readHash(output), sourceImage: native.file, sourceHash: native.sha256,
    sourceImages: sources.map(s => ({ path: s.file, sha256: s.sha256, dimensions: { width: s.width, height: s.height } })),
    referenceAsset: references[0].asset, referenceHash: references[0].sha256, referenceAssets: references,
    normalization: { method: 'alpha-connected component segmentation of genuine native artwork; nearest-neighbor uniform source scale and transparent packing',
      baseline: 244, baselineDefinition: 'bottom-exclusive alpha-bounds anchor in each 256px cell', margins: 10,
      alphaSegmentationThreshold: 24, alphaCleanup: 'Sub-threshold near-transparent background noise excluded; original PNG sources are preserved unchanged.',
      sourceScaleFactors: Object.fromEntries(scales), frameOrder: [0, 1, 2, 3], frames: frameRecords,
      transformations: ['segmentation', 'uniform nearest-neighbor scaling', 'transparent atlas packing'],
      syntheticPoses: false, duplicatedFrames: 0, mirroredFrames: 0 },
    visualValidation: { reviewed: true, distinctNativePoses: 32, completeRows: 8, wholeCharacterAndWeaponContained: true,
      facing: spec.id === 'cloud-motion-a' ? 'right except turn starts left and finishes right' : 'right; dead ends in side-lying knockout',
      outfit: 'FF7 1997 purple SOLDIER clothing, blond spiked hair, single left pauldron, brown boots and Buster Sword',
      guardEffect: 'physical sword guard and parry; small metal-contact sparks only; no magical barrier',
      limitations: ['Original generated fan art with adapted choreography, not official animation frames.', 'Timing, anatomy and pixel identity are not certified 1:1 to the 1997 game.', 'Minor changes in sword perspective, facial features and apparent body size remain between native source drawings.'],
      ...(spec.id === 'cloud-motion-b' ? { correction: 'The original attempt omitted crouchCharge. The corrected 32-pose source supplies 20 retained poses; eight newly drawn poses replace land/crouchIdle and four replace crouchCharge for sword retention and containment.' } : {}),
      ...(spec.id === 'cloud-defense' ? { correction: 'Four newly drawn native guard-break poses replace the original guard-break row to keep the sword visible in the open stagger.' } : {}) },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, date: '2026-10-18',
      nativeArtwork: true, canonicalVerified: false, networkVerified: false, canon1to1Verified: false,
      prompts: await Promise.all(prompts.map(async file => ({ path: path.join(sourceDir, file), sha256: await readHash(path.join(sourceDir, file)) }))),
      normalizationScript: path.join(sourceDir, 'normalize-motion-atlases.mjs') }
  });
}
const rejectedPath = path.join(sourceDir, 'cloud-motion-b.initial-rejected.png');
const sourceAsset = name => path.join(sourceDir, name);
const generationSpecs = [
  { image: 'cloud-motion-a.native.png', prompt: 'cloud-motion-a.prompt.txt', refs: references.map(r => r.savedImage), retainedPoses: 32 },
  { image: 'cloud-motion-b.initial-rejected.png', prompt: 'cloud-motion-b.prompt.txt', refs: references.map(r => r.savedImage), retainedPoses: 0, rejected: true },
  { image: 'cloud-defense.native.png', prompt: 'cloud-defense.prompt.txt', refs: references.map(r => r.savedImage), retainedPoses: 28 },
  { image: 'cloud-motion-b.corrected.png', prompt: 'cloud-motion-b.correction.prompt.txt', refs: [sourceAsset('cloud-motion-b.initial-rejected.png'), references[0].savedImage], retainedPoses: 20 },
  { image: 'cloud-motion-b.patch-rows.png', prompt: 'cloud-motion-b.patch-rows.prompt.txt', refs: [sourceAsset('cloud-motion-b.corrected.png'), references[0].savedImage], retainedPoses: 8 },
  { image: 'cloud-weapon-retention.patch.png', prompt: 'cloud-weapon-retention.patch.prompt.txt', refs: [sourceAsset('cloud-motion-b.weapon-patch-reference.png'), sourceAsset('cloud-defense.weapon-patch-reference.png')], retainedPoses: 8 }
];
const generations = await Promise.all(generationSpecs.map(async g => ({
  provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null,
  sourceImage: sourceAsset(g.image), sha256: await readHash(sourceAsset(g.image)),
  prompt: sourceAsset(g.prompt), promptSha256: await readHash(sourceAsset(g.prompt)), retainedPoses: g.retainedPoses,
  rejected: g.rejected || false,
  referencedImages: await Promise.all(g.refs.map(async file => ({ path: file, sha256: await readHash(file) })))
})));
const registry = { schemaVersion: 1, date: '2026-10-18', heroId: 'cloud_ff7', universe: 'Final Fantasy VII',
  canonicalVerified: false, networkVerified: false, canon1to1Verified: false, entries, generations,
  rejectedSources: [{ path: rejectedPath, sha256: await readHash(rejectedPath), reason: 'Only 28 native poses; crouchCharge row was omitted. Never used to fill the delivered atlas.' }],
  nativeGenerationCalls: 6, deliveredNativePoses: 96 };
await fs.writeFile('src/game/combat/cloudMeleeMotion.generated.json', JSON.stringify(registry, null, 2) + '\n');
await fs.writeFile(path.join(sourceDir, 'provenance.json'), JSON.stringify(registry, null, 2) + '\n');
console.log(JSON.stringify({ entries: entries.map(e => ({ id: e.id, states: e.states, sha256: e.sha256 })), deliveredNativePoses: 96 }));
