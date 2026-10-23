import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { segmentAtlas, normalizeRow } from '../../../scripts/buildCombatEntityAssets.mjs';

const root = process.cwd();
const docs = 'docs/combat-fidelity-wave3-2026-10-18/tifa-sources';
const output = 'public/sprites/generated/melee-tifa-wave3';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const plans = JSON.parse(await fs.readFile(path.join(root, docs, 'native-prompts.json'), 'utf8')).plans;
const loopPrompt = JSON.parse(await fs.readFile(path.join(root, docs, 'tifa-charge-loop-correction-prompt.json'), 'utf8'));
const sources = {
  'tifa-combat-a': { file: '/workspace/generated_images/exec-679a055d-80a4-429a-a8b4-5142efd5be97.png', rows: 7 },
  'tifa-combat-b': { file: '/workspace/generated_images/exec-46e5e717-864b-4c22-bc1a-5233b7e8ff57.png', rows: 8 },
  'tifa-ledge': { file: '/workspace/generated_images/exec-503ccb81-5dd8-43f1-8f49-049c4be0d5c1.png', rows: 5 },
  'tifa-charge-loop-correction': { file: '/workspace/generated_images/exec-227e6ab5-da89-4900-b996-12a6d5e2e0e4.png', rows: 1 }
};
// Approximate leading palm centers measured on the actual normalized crops.
// A released frame carries the previous edge reference, with contact=false;
// its free hands remain listed separately and are not invented as contacts.
const grips = {
  ledgeCatch: [[228, 35, false, [[135, 126, false]]], [188, 31, true, [[200, 88, false]]], [176, 31, true, [[153, 31, true]]], [165, 32, true, [[141, 33, true]]]],
  ledgeHang: [[156, 24, true, [[130, 24, true]]], [162, 25, true, [[182, 92, false]]], [171, 25, true, [[146, 25, true]]], [171, 24, true, []]],
  ledgeClimb: [[192, 76, true, [[126, 114, false]]], [210, 103, true, [[172, 103, true]]], [212, 205, true, [[153, 131, false]]], [229, 205, true, [[145, 209, true]]]],
  ledgeDrop: [[158, 31, true, [[131, 31, true]]], [159, 28, true, [[227, 52, false]]], [159, 28, false, [[190, 41, false], [90, 41, false]]], [159, 28, false, [[210, 139, false], [95, 149, false]]]],
  ledgeJump: [[160, 25, true, [[132, 25, true]]], [177, 35, true, [[224, 53, false]]], [177, 35, false, [[194, 31, false], [93, 114, false]]], [177, 35, false, [[199, 39, false], [76, 113, false]]]]
};
const stateReview = {
  attackLight1: 'Guard, partial jab, full jab with rotated shoulder, retracted guard; unarmed red gloves and different elbow/hip postures.',
  attackLight2: 'Rear fist chamber, forward coil, extended cross with changed shoulder alignment, compact guard.',
  attackLight3: 'Low fist and deep knee bend, rising elbow, high uppercut with straightened torso, recovered high guard.',
  crouchLight: 'Low guard, horizontal body punch, opposite bent-arm low strike and crouched recovery, with real bent knees.',
  chargeStart: 'Upright guard, wide rear-fist chamber, deeper torso coil and low prepared stance; no projectile or glow.',
  chargeLoop: 'Corrective native row: rear-weighted chamber, deep symmetric squat, crossed bent forearms and staggered high guard. All arms stay bent; no release punch or duplicated pose.',
  chargeRelease: 'Beat Rush: low prepared guard, extended first punch, opposite shoulder cross and retracted low follow-through. Physical fists, not Final Heaven energy.',
  chargeRecovery: 'Low forward follow-through, rising torso with gloves at waist, compact chest guard, stabilized boxing guard.',
  attackRecovery: 'Extended follow-through, retracting elbow and hip, low guard, compact raised guard.',
  special: 'Beat Rush physical alternating punch sequence: low guard, first extended straight, torso-rotated cross, low final body-punch posture. No weapon, energy blast or Final Heaven substitution.',
  aerialNeutral: 'Tucked airborne guard, horizontal roundhouse, higher diagonal kick and re-tucked falling guard; different leg anatomies without painted ground.',
  aerialForward: 'Raised airborne knee, extending forward boot with rear leg tucked, full forward kick and retracted airborne guard.',
  aerialDown: 'Knees tucked, descending boot extended, lower heel with forward torso and re-tucked falling guard.',
  intro: 'Relaxed hands, first glove adjustment, opposite glove adjustment with raised elbow, widened boxing stance.',
  victory: 'Relaxed low hands, raised bent elbows, full overhead celebration, single raised glove and other hand at waist.',
  ledgeAttack: 'One-hand overhead suspension, pulling elbow and raised knee, free punch while lower palm braces, crouched two-fist recovery above the inferred edge.',
  ledgeCatch: 'Reach, one-glove hook, two-glove catch with tucked knees, settled hanging pose; both red gloves and complete boots inspected in individual crops.',
  ledgeHang: 'Two-hand hang, one-hand supported inward shift, two-hand knee tuck, one-hand supported leg swing; each pose genuinely suspended.',
  ledgeClimb: 'Raised bent supporting hand, forward pressing palms, low planted palm lifting hips, two planted palms below crouched torso. Contacts measured per frame.',
  ledgeDrop: 'Two-hand hang, one remaining upper grip, two released open hands, lowering arms and freefall with hair rising.',
  ledgeJump: 'Tucked hang, braced push with one remaining grip, released upward launch and tucked airborne recovery.'
};
const archive = async (file, destination) => {
  let bytes;
  try { bytes = await fs.readFile(file); }
  catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await fs.readFile(path.join(root, destination)); }
  await fs.writeFile(path.join(root, destination), bytes);
  return { bytes, path: destination, sha256: hash(bytes), originalGeneratedPath: file };
};
await fs.mkdir(path.join(root, output), { recursive: true });
const referenceAsset = '/sprites/generated/heroes/final-fantasy-vii/tifa-ff7.png';
const previousAtlas = '/sprites/generated/combat-character-animations/tifa_ff7.png';
const reference = await archive(path.join(root, 'public', referenceAsset), `${docs}/tifa-reference.png`);
const previous = await archive(path.join(root, 'public', previousAtlas), `${docs}/tifa-previous-presentation-reference.png`);
const native = {};
for (const [id, spec] of Object.entries(sources)) {
  const archived = await archive(spec.file, `${docs}/${id}-source.png`);
  native[id] = { ...archived, atlas: await segmentAtlas(path.join(root, archived.path), spec.rows), sourceRows: spec.rows };
}
const entries = [];
const reviews = [];
for (const plan of plans) {
  const original = native[plan.id];
  const overlays = [], rows = [];
  for (let row = 0; row < plan.states.length; row++) {
    const state = plan.states[row];
    const source = plan.id === 'tifa-combat-a' && state === 'chargeLoop' ? native['tifa-charge-loop-correction'] : original;
    const sourceRow = source !== original ? 0 : plan.id === 'tifa-combat-a' && row > 5 ? row - 1 : row;
    const segmented = source.atlas.rows[sourceRow];
    assert.ok(segmented, `${plan.id}/${state}: explicit native row missing`);
    const normalized = await normalizeRow(segmented);
    overlays.push({ input: normalized.bytes, left: 0, top: row * 256 });
    rows.push({ state, row, sourceImage: source.path, sourceImageSha256: source.sha256, sourceRow, sourceBounds: segmented.sourceBounds,
      scale: normalized.scale, baseline: normalized.baseline, frameBounds: normalized.frameBounds, ...segmented.seamReview,
      visualReview: { manuallyInspected: true, fourDistinctNativePoses: true, action: stateReview[state] } });
    await fs.writeFile(path.join(root, docs, `${plan.id}-row-${row}.png`), normalized.bytes);
  }
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(overlays).png({ compressionLevel: 9 }).toBuffer();
  const sheet = `/sprites/generated/melee-tifa-wave3/${plan.id}.png`;
  await fs.writeFile(path.join(root, 'public', sheet), bytes);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048); assert.equal(info.channels, 4);
  const checks = [];
  for (let row = 0; row < 8; row++) {
    const unique = new Set();
    for (let col = 0; col < 4; col++) {
      let visible = 0;
      const frame = Buffer.alloc(256 * 256 * 4);
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const index = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        data.copy(frame, (y * 256 + x) * 4, index, index + 4);
        if (data[index + 3] > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(data[index + 3], 0, `${plan.id}/${row}/${col}: unsafe output edge`);
      }
      if (row < plan.states.length) assert.ok(visible > 1000, `${plan.id}/${row}/${col}: missing native pose`);
      else assert.equal(visible, 0, `${plan.id}/${row}/${col}: inactive cells must remain truly transparent`);
      unique.add(hash(frame));
      checks.push({ row, col, visiblePixels: visible, sha256: hash(frame) });
    }
    if (row < plan.states.length) assert.equal(unique.size, 4, `${plan.id}/${row}: duplicate frame`);
  }
  entries.push({ id: plan.id, heroId: 'tifa_ff7', universe: 'Final Fantasy VII', sheet,
    states: Object.fromEntries(plan.states.map((state, row) => [state, { row, frames: 4, columns: 4, fps: ['chargeLoop', 'ledgeHang'].includes(state) ? 8 : 12, loop: ['chargeLoop', 'ledgeHang', 'victory'].includes(state) }])),
    stateOrder: plan.states, columns: 4, rows: 8, activeRows: plan.states.length, frames: plan.states.length * 4,
    dimensions: { width: 1024, height: 2048, frameWidth: 256, frameHeight: 256 }, width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, alpha: true, sha256: hash(bytes),
    sourceImage: original.path, sourceImageSha256: original.sha256, sourceDimensions: [original.atlas.width, original.atlas.height], originalSourceRows: original.sourceRows,
    referenceAsset, referenceAssetSha256: reference.sha256, archivedReferenceAsset: reference.path,
    previousAtlasReference: previousAtlas, previousAtlasReferenceSha256: previous.sha256,
    sourceWork: 'Final Fantasy VII (1997)',
    sourceReference: plan.id === 'tifa-ledge' ? 'Tifa original outfit and unarmed identity from FFVII; five ledge states are explicit project traversal adaptations, not canonical FFVII gameplay animations.' : 'Tifa fights unarmed in FFVII; Direct de Tifa is the current simple slot and Beat Rush is the current secondary. special and chargeRelease preserve physical alternating Beat Rush punches. Final Heaven remains the separate prioritized 100% super.',
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', frameSize: 256, padding: 12, sharedScalePerState: true, baseline: 244, rows,
      emptyRows: Array.from({ length: 8 - plan.states.length }, (_, i) => plan.states.length + i),
      contactAnchorMeasurements: plan.id === 'tifa-ledge' ? Object.fromEntries(Object.entries(grips).map(([state, frames]) => [state, frames.map(([x, y, contact, supportHands], frame) => ({ frame, x, y, normalizedX: x / 256, normalizedY: y / 256, baseline: 'ledgeGrip', contact,
        supportHands: supportHands.map(([handX, handY, handContact]) => ({ x: handX, y: handY, normalizedX: handX / 256, normalizedY: handY / 256, contact: handContact })),
        measurement: !contact && ['ledgeDrop', 'ledgeJump'].includes(state) ? 'Carried edge reference after release, not an invented hand contact; free hands listed separately.' : 'Manually inspected approximate palm center in native normalized pixels, not a canonical source-game anchor.' }))])) : {} },
    visualValidation: { identityReviewed: true, stateRowsReviewed: true, fourNativePosesPerStateReviewed: true, technicalAlphaReviewed: true, fullOutputSilhouetteContained: true, canon1to1Verified: false, networkVerified: false,
      notes: 'Base and previous presentation references inspected before generation. All normalized state rows and 20 individual ledge crops reviewed. Missing chargeLoop supplied by four genuinely held native poses. Per-frame palm anchors for catch/hang/climb, release contacts marked false. No inactive row counted as art.' },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, date: '2026-10-18', sourceGameAsset: false, nativeGeneratedArtwork: true, canonicalAnimationVerified: false,
      generatedSourcePath: original.originalGeneratedPath, promptFile: `${docs}/native-prompts.json`, prompt: plan.prompt, promptSha256: hash(Buffer.from(plan.prompt)), referenceImagesInspectedBeforeGeneration: true,
      nativeCorrections: plan.id === 'tifa-combat-a' ? [{ sourceImage: native['tifa-charge-loop-correction'].path, sourceImageSha256: native['tifa-charge-loop-correction'].sha256, generatedSourcePath: sources['tifa-charge-loop-correction'].file, sourceRow: 0, selectedState: 'chargeLoop', promptFile: `${docs}/tifa-charge-loop-correction-prompt.json`, prompt: loopPrompt.prompt, reason: loopPrompt.reason }] : [],
      conditioning: 'Only exported entity-builder alpha segmentation and nearest-neighbor normalization, transparent atlas assembly and technical crop/contact output. No procedural poses, copied frames, limbs or equipment redrawn by code.' }
  });
  reviews.push({ id: plan.id, rows, checks });
  await sharp({ create: { width: 1024, height: plan.states.length * 256, channels: 4, background: { r: 28, g: 34, b: 44, alpha: 1 } } }).composite(overlays).png().toFile(path.join(root, docs, `${plan.id}-review-contact.png`));
  if (plan.id === 'tifa-ledge') for (let row = 0; row < plan.states.length; row++) for (let col = 0; col < 4; col++) await sharp(bytes).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).png().toFile(path.join(root, docs, `grip-${plan.states[row]}-${col}.png`));
}
await fs.writeFile(path.join(root, 'src/game/combat/tifaMeleeCombat.generated.json'), `${JSON.stringify({ schemaVersion: 1, source: 'OpenAI', entries }, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'technical-review.json'), `${JSON.stringify({ date: '2026-10-18', reviews }, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'provenance-combat.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, plannedGenerations: 3, correctiveGenerations: 1, canonicalAnimationVerified: false, networkVerified: false,
  generationClaim: 'Three native image_gen calls produced the initial atlases; a fourth native call supplied the missing four chargeLoop poses. No generation IDs or model names are inferred from output filenames.',
  nativeSources: Object.entries(native).map(([id, value]) => ({ id, path: value.path, sha256: value.sha256, bytes: value.bytes.length, dimensions: [value.atlas.width, value.atlas.height], sourceRows: value.sourceRows, originalGeneratedPath: value.originalGeneratedPath })),
  references: [{ path: reference.path, sha256: reference.sha256, originalAsset: referenceAsset }, { path: previous.path, sha256: previous.sha256, originalAsset: previousAtlas }], entries }, null, 2)}\n`);
console.log(JSON.stringify({ atlases: entries.map(({ id, activeRows, frames, sha256 }) => ({ id, activeRows, frames, sha256 })), states: 21, nativePoses: 84, technicalChecks: true }));
