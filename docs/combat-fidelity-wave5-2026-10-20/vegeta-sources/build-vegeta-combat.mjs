import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { segmentAtlas, normalizeRow } from '../../../scripts/buildCombatEntityAssets.mjs';

const root = process.cwd();
const docs = 'docs/combat-fidelity-wave5-2026-10-20/vegeta-sources';
const output = 'public/sprites/generated/melee-vegeta-wave5';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = async file => JSON.parse(await fs.readFile(path.join(root, docs, file), 'utf8'));
const { plans } = await readJson('native-prompts.json');
const correction = await readJson('vegeta-charge-loop-correction-prompt.json');
const beamCorrection = await readJson('vegeta-galick-spacing-correction-prompt.json');
const sourcePlan = {
  'vegeta-combat-a': { file: '/workspace/generated_images/exec-dd5487f6-599e-40dd-80aa-147d717454e4.png', rows: 8 },
  'vegeta-combat-b': { file: '/workspace/generated_images/exec-402ebf77-29d9-47ba-9fbc-1ac04910f9ae.png', rows: 8 },
  'vegeta-ledge': { file: '/workspace/generated_images/exec-3ad45ff1-7859-4834-a631-10d0ca4709c5.png', rows: 5 },
  'vegeta-charge-loop-correction': { file: '/workspace/generated_images/exec-0bf5fe9b-4ec7-41c3-85d1-984a71559999.png', rows: 1 },
  'vegeta-galick-spacing-correction': { file: '/workspace/generated_images/exec-d3f86f0b-7310-40eb-a1e5-f2a4f66ab0be.png', rows: 2 }
};
const stateReview = {
  attackLight1: 'Guard, partly extended lead glove, full straight jab and retracted guard with distinct shoulders and knees.',
  attackLight2: 'Rear fist low, rear shoulder driving forward, full cross and retracted high guard.',
  attackLight3: 'Low fist/squat, rising bent elbow, high extended uppercut with raised torso and settled high guard.',
  crouchLight: 'Low two-fist guard, partial low punch, full waist-height low punch and retracted crouched guard.',
  chargeStart: 'Guard, hands open beside rear head, paired palms beside rear shoulder and deeper coiled held posture. No beam or transformation.',
  chargeLoop: 'Corrective native row: paired gloves remain beside rear cheek/shoulder in all four poses; wide squat, deeper squat, lifted rear elbows and forward torso compression. No release or ordinary guard pose.',
  chargeRelease: 'Galick Gun: paired palms beside rear head, halfway two-palm thrust with purple charge, fully extended paired-palm purple beam and recoiled guard. No single-palm projectile or yellow Final Flash.',
  chargeRecovery: 'Low paired-palm follow-through, retracted bent elbows in deeper squat, rising torso with separating fists and stable guard.',
  attackRecovery: 'Straight punch follow-through, retracting shoulder/elbow, rising compact fists and low recovered guard.',
  special: 'Secondary Galick Gun: both gloves gathered beside rear cheek, two-palm thrust with purple charge, extended paired-palm purple beam and retracted guard. Existing yellow Final Flash super is separate.',
  aerialNeutral: 'Tucked knees, horizontal kick, upward diagonal extended kick and retracted airborne knees.',
  aerialForward: 'Chambered fist and tucked legs, partial airborne fist extension, full flying punch and curled recovery.',
  aerialDown: 'Raised paired gloves, forward/downward elbow fold, downward paired hammer fists and tucked falling guard.',
  intro: 'Arms crossed, uncrossed forward open palm, lifted proud chin and two-fist fighting stance.',
  victory: 'Low guard, raised right fist, crossed arms with lifted chin and hand-at-hip proud recovery.',
  ledgeAttack: 'One-hand overhead suspension, raised-knee pull-up, free forward punch while support glove presses below torso, crouched guard.',
  ledgeCatch: 'Pre-contact reaching right glove with other fist near chest, one overhead grip with other reaching glove, two overhead grips with tucked knees and settled flexed-elbow suspension. Exactly two arms.',
  ledgeHang: 'Two overhead grips with straight legs, one-hand supported swinging legs, overhead grip with raised knee and tucked settled hang.',
  ledgeClimb: 'Hands gripping beside head with tucked knees, chest-high pull and raised knee, both palms pressing below waist with hip lifted, crouch above former edge with two low planted palms.',
  ledgeDrop: 'Two overhead grips, one remaining grip and released free palm, two open released palms with falling legs and free fall with lowered arms.',
  ledgeJump: 'Tucked two-hand hang, bent-elbow coil/push, released rising body with raised knee and released forward upward arc.'
};
const finalVisualReview = true;
const palm = (x, y, contact) => ({ x, y, normalizedX: x / 256, normalizedY: y / 256, contact });
const grip = (frame, x, y, contact, supportHands = [], released = false) => ({ frame, ...palm(x, y, contact), baseline: 'ledgeGrip', supportHands,
  measurement: released ? 'Carried edge reference after release, not a hand contact; actual free gloves listed separately.'
    : 'Manually reviewed approximate white-glove palm center in normalized native pixels. Project contact anchor, not an official source-game measurement.' });
const contactAnchorMeasurements = {
  ledgeCatch: [
    grip(0, 225, 42, false, [palm(140, 135, false)]),
    grip(1, 207, 28, true, [palm(225, 103, false)]),
    grip(2, 186, 32, true, [palm(141, 33, true)]),
    grip(3, 162, 33, true, [palm(116, 33, true)])
  ],
  ledgeHang: [
    grip(0, 163, 25, true, [palm(122, 25, true)]),
    grip(1, 135, 25, true, [palm(200, 112, false)]),
    grip(2, 189, 25, true, [palm(147, 25, true)]),
    grip(3, 152, 25, true, [palm(114, 25, true)])
  ],
  ledgeClimb: [
    grip(0, 193, 78, true, [palm(84, 78, true)]),
    grip(1, 210, 78, true, [palm(99, 77, true)]),
    grip(2, 223, 207, true, [palm(128, 207, true)]),
    grip(3, 197, 216, true, [palm(151, 216, true)])
  ],
  ledgeDrop: [
    grip(0, 161, 31, true, [palm(124, 31, true)]),
    grip(1, 126, 28, true, [palm(220, 119, false)]),
    grip(2, 126, 28, false, [palm(192, 42, false), palm(98, 38, false)], true),
    grip(3, 126, 28, false, [palm(188, 159, false), palm(109, 158, false)], true)
  ],
  ledgeJump: [
    grip(0, 172, 28, true, [palm(123, 29, true)]),
    grip(1, 175, 34, true, [palm(120, 60, true)]),
    grip(2, 175, 34, false, [palm(208, 33, false), palm(64, 58, false)], true),
    grip(3, 175, 34, false, [palm(226, 102, false), palm(74, 92, false)], true)
  ]
};
const wristCenters = {
  ledgeCatch: [[213, 61], [202, 49], [186, 52], [162, 54]],
  ledgeHang: [[163, 42], [133, 43], [189, 43], [153, 43]],
  ledgeClimb: [[198, 91], [216, 93], [212, 188], [184, 201]]
};
for (const [state, centers] of Object.entries(wristCenters)) for (const [frame, [x, y]] of centers.entries()) {
  contactAnchorMeasurements[state][frame].wrist = { x, y, normalizedX: x / 256, normalizedY: y / 256,
    measurement: 'Manually inspected white-gauntlet wrist center adjacent to the supporting palm; not a skin-contact claim.' };
}

// A detached, one-pixel purple native beam tip can be assigned to the next
// cell by the alpha seam. Transfer existing RGBA ownership only inside the
// inspected empty gap, far from the recovery body. No source pixel is redrawn.
function assignBeamTip(row, sourceRow) {
  const from = row.frames[3], to = row.frames[2];
  const composite = () => {
    const bytes = Buffer.alloc(from.data.length);
    for (const frame of row.frames) for (let i = 0; i < bytes.length; i += 4) if (frame.data[i + 3]) frame.data.copy(bytes, i, i, i + 4);
    return bytes;
  };
  const before = composite();
  const roi = sourceRow === 0 ? { left: 1330, top: 180, right: 1390, bottom: 265 } : { left: 1330, top: 150, right: 1390, bottom: 230 };
  let movedPixels = 0, visiblePixels = 0;
  for (let y = roi.top; y <= roi.bottom; y++) for (let x = roi.left; x <= roi.right; x++) {
    const at = (y * from.width + x) * 4;
    if (!from.data[at + 3]) continue;
    assert.equal(to.data[at + 3], 0, 'Beam gap overlaps another native pose');
    if (from.data[at + 3] > 4) visiblePixels++;
    from.data.copy(to.data, at, at, at + 4); from.data.fill(0, at, at + 4); movedPixels++;
  }
  assert.ok(visiblePixels >= 10 && visiblePixels < 100, 'Unexpected native beam-tip ownership');
  for (const frame of [from, to]) {
    let left = frame.width, right = -1, top = frame.height, bottom = -1, pixels = 0;
    for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) if (frame.data[(y * frame.width + x) * 4 + 3] > 4) {
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); pixels++;
    }
    frame.bounds = { left, top, width: right - left + 1, height: bottom - top + 1, pixels };
  }
  const after = composite(); assert.deepEqual(after, before, 'Technical ownership must conserve every native visible RGBA pixel');
  return { method: 'native-beam-tip-alpha-ownership', sourceColumn: 3, destinationColumn: 2, sourceRoi: roi, movedPixels, visiblePixels,
    nativeRowRgbaSha256Before: hash(before), nativeRowRgbaSha256After: hash(after), nativePixelsConserved: true, artworkRedrawn: false };
}

await fs.mkdir(path.join(root, output), { recursive: true });
const archive = async (file, destination) => {
  let bytes;
  try { bytes = await fs.readFile(file); }
  catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await fs.readFile(path.join(root, destination)); }
  await fs.writeFile(path.join(root, destination), bytes);
  return { bytes, path: destination, sha256: hash(bytes), originalGeneratedPath: file };
};
const referenceAsset = '/sprites/generated/heroes/dragon-ball-z/vegeta-dbz.png';
const previousAtlas = '/sprites/generated/combat-character-animations/vegeta_dbz.png';
const reference = await archive(path.join(root, 'public', referenceAsset), `${docs}/vegeta-reference.png`);
const previous = await archive(path.join(root, 'public', previousAtlas), `${docs}/vegeta-previous-presentation-reference.png`);
const sources = {};
for (const [id, spec] of Object.entries(sourcePlan)) {
  const archived = await archive(spec.file, `${docs}/${id}-source.png`);
  sources[id] = { ...archived, atlas: await segmentAtlas(path.join(root, archived.path), spec.rows), sourceRows: spec.rows };
}
const entries = [], reviews = [];
for (const plan of plans) {
  const original = sources[plan.id], overlays = [], rows = [];
  for (let row = 0; row < plan.states.length; row++) {
    const state = plan.states[row];
    const isChargeCorrection = state === 'chargeLoop';
    const isBeamCorrection = state === 'chargeRelease' || state === 'special';
    const source = isChargeCorrection ? sources['vegeta-charge-loop-correction']
      : isBeamCorrection ? sources['vegeta-galick-spacing-correction'] : original;
    const sourceRow = isChargeCorrection || state === 'chargeRelease' ? 0 : state === 'special' ? 1 : row;
    const segmented = source.atlas.rows[sourceRow];
    assert.ok(segmented, `${plan.id}/${state}: explicit native row missing`);
    assert.equal(segmented.seamReview.crossedOpaquePixels, 0, `${state}: anatomy crosses alpha seam`);
    assert.equal(segmented.seamReview.crossedVisiblePixels, 0, `${state}: visible artwork crosses alpha seam`);
    const alphaOwnership = isBeamCorrection ? assignBeamTip(segmented, sourceRow) : null;
    const normalized = await normalizeRow(segmented);
    overlays.push({ input: normalized.bytes, left: 0, top: row * 256 });
    rows.push({ state, row, sourceImage: source.path, sourceImageSha256: source.sha256, sourceRow,
      sourceBounds: segmented.sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
      frameBounds: normalized.frameBounds, ...segmented.seamReview,
      alphaOwnership,
      nativeFrameRgbaSha256: segmented.frames.map(frame => hash(frame.data)),
      visualReview: { manuallyInspected: finalVisualReview, fourDistinctNativePoses: finalVisualReview, action: stateReview[state] } });
    await fs.writeFile(path.join(root, docs, `${plan.id}-row-${row}.png`), normalized.bytes);
  }
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(overlays).png({ compressionLevel: 9 }).toBuffer();
  const sheet = `/sprites/generated/melee-vegeta-wave5/${plan.id}.png`;
  await fs.writeFile(path.join(root, 'public', sheet), bytes);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048); assert.equal(info.channels, 4);
  const frameChecks = [];
  for (let row = 0; row < 8; row++) {
    const unique = new Set();
    for (let col = 0; col < 4; col++) {
      let visible = 0;
      const frame = Buffer.alloc(256 * 256 * 4);
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const at = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        data.copy(frame, (y * 256 + x) * 4, at, at + 4);
        if (data[at + 3] > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(data[at + 3], 0, `${plan.id}/${row}/${col}: unsafe output edge`);
      }
      if (row < plan.states.length) assert.ok(visible > 1000, `${plan.id}/${row}/${col}: missing native pose`);
      else assert.equal(visible, 0, `${plan.id}/${row}/${col}: inactive cells must be transparent`);
      unique.add(hash(frame)); frameChecks.push({ row, col, visiblePixels: visible, rgbaSha256: hash(frame) });
    }
    if (row < plan.states.length) assert.equal(unique.size, 4, `${plan.id}/${row}: duplicate native frame`);
  }
  entries.push({ id: plan.id, heroId: 'vegeta_dbz', universe: 'Dragon Ball Z', sheet,
    states: Object.fromEntries(plan.states.map((state, row) => [state, { row, frames: 4, columns: 4, fps: ['chargeLoop', 'ledgeHang'].includes(state) ? 8 : 12, loop: ['chargeLoop', 'ledgeHang', 'victory'].includes(state) }])),
    stateOrder: plan.states, columns: 4, rows: 8, activeRows: plan.states.length, frames: plan.states.length * 4,
    dimensions: { width: 1024, height: 2048, frameWidth: 256, frameHeight: 256 }, width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, alpha: true, sha256: hash(bytes),
    sourceImage: original.path, sourceImageSha256: original.sha256, sourceDimensions: [original.atlas.width, original.atlas.height], originalSourceRows: original.sourceRows,
    referenceAsset, referenceAssetSha256: reference.sha256, archivedReferenceAsset: reference.path, previousAtlasReference: previousAtlas, previousAtlasReferenceSha256: previous.sha256,
    sourceWork: 'Dragon Ball Z — adult black-haired Vegeta in blue sleeveless training clothes',
    sourceReference: plan.id === 'vegeta-ledge'
      ? 'Five project ledge-traversal adaptations using real white glove support and no painted platform. Not source-game canonical movement frames.'
      : 'Current simple slot Enchaînement de poings de Vegeta and secondary Galick Gun resolved before prompts. special and chargeRelease use the purple two-handed shoulder-level Galick Gun beam. Yellow Final Flash remains the separate existing 100% super animation.',
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', frameSize: 256, padding: 12, sharedScalePerState: true, baseline: 244, rows,
      emptyRows: Array.from({ length: 8 - plan.states.length }, (_, i) => plan.states.length + i), contactAnchorMeasurements: plan.id === 'vegeta-ledge' ? contactAnchorMeasurements : {} },
    visualValidation: { identityReviewed: true, stateRowsReviewed: finalVisualReview, fourNativePosesPerStateReviewed: finalVisualReview, technicalAlphaReviewed: true, fullOutputSilhouetteContained: true, canon1to1Verified: false, networkVerified: false,
      notes: finalVisualReview ? 'All 21 normalized rows, three final atlases and 20 ledge crops visually inspected. White-gloved contact points measured from native pixels. Project adaptations, not certified canonical animation.' : 'Native sources inspected. Final normalized row/hand-contact review pending; flags remain false until reviewed.' },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, date: '2026-10-20', sourceGameAsset: false, nativeGeneratedArtwork: true, canonicalAnimationVerified: false, generatedSourcePath: original.originalGeneratedPath,
      promptFile: `${docs}/native-prompts.json`, prompt: plan.prompt, promptSha256: hash(Buffer.from(plan.prompt)), referenceImagesInspectedBeforeGeneration: true,
      nativeCorrections: [...(plan.id === 'vegeta-combat-a' ? [{ sourceImage: sources['vegeta-charge-loop-correction'].path, sourceImageSha256: sources['vegeta-charge-loop-correction'].sha256,
        generatedSourcePath: sourcePlan['vegeta-charge-loop-correction'].file, sourceRow: 0, selectedState: 'chargeLoop', replacedOriginalSourceRow: 5,
        promptFile: `${docs}/vegeta-charge-loop-correction-prompt.json`, prompt: correction.prompt, reason: correction.reason }] : []),
        ...(['vegeta-combat-a', 'vegeta-combat-b'].includes(plan.id) ? [{ sourceImage: sources['vegeta-galick-spacing-correction'].path, sourceImageSha256: sources['vegeta-galick-spacing-correction'].sha256,
          generatedSourcePath: sourcePlan['vegeta-galick-spacing-correction'].file, sourceRow: plan.id === 'vegeta-combat-a' ? 0 : 1,
          selectedState: plan.id === 'vegeta-combat-a' ? 'chargeRelease' : 'special', replacedOriginalSourceRow: plan.id === 'vegeta-combat-a' ? 6 : 1,
          promptFile: `${docs}/vegeta-galick-spacing-correction-prompt.json`, prompt: beamCorrection.prompt, reason: beamCorrection.reason }] : [])],
      conditioning: 'Native image_gen artwork; exported entity-builder alpha segmentation and nearest-neighbor normalization, transparent atlas packing and technical contact crops only. Detached purple tip RGBA pixels inside an inspected empty gap are assigned to the firing cell, with identical full native-row hashes before/after. No code-redrawn body, synthetic pose, copied frame or generated substitute.' }
  });
  reviews.push({ id: plan.id, rows, frameChecks });
  await sharp({ create: { width: 1024, height: plan.states.length * 256, channels: 4, background: { r: 28, g: 34, b: 44, alpha: 1 } } }).composite(overlays).png().toFile(path.join(root, docs, `${plan.id}-review-contact.png`));
  if (plan.id === 'vegeta-ledge') for (let row = 0; row < plan.states.length; row++) for (let col = 0; col < 4; col++) await sharp(bytes).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).png().toFile(path.join(root, docs, `grip-${plan.states[row]}-${col}.png`));
}
await fs.writeFile(path.join(root, 'src/game/combat/vegetaMeleeCombat.generated.json'), `${JSON.stringify({ schemaVersion: 1, source: 'OpenAI', entries }, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'technical-review.json'), `${JSON.stringify({ date: '2026-10-20', reviews }, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'provenance-combat.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-20', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, plannedGenerations: 3, correctiveGenerations: 2, canonicalAnimationVerified: false, networkVerified: false,
  generationClaim: 'Three initial native image_gen atlases. Two corrective native calls supplied chargeLoop and cleanly separated chargeRelease/special. 72 initial poses plus12 corrective native poses make84 selected poses; initial sources and the12 excluded poses remain archived. No model or generation ID is inferred from filenames.',
  nativeSources: Object.entries(sources).map(([id, source]) => ({ id, path: source.path, sha256: source.sha256, bytes: source.bytes.length, dimensions: [source.atlas.width, source.atlas.height], sourceRows: source.sourceRows, originalGeneratedPath: source.originalGeneratedPath })),
  references: [{ path: reference.path, sha256: reference.sha256, originalAsset: referenceAsset }, { path: previous.path, sha256: previous.sha256, originalAsset: previousAtlas }], entries }, null, 2)}\n`);
console.log(JSON.stringify({ atlases: entries.map(({ id, activeRows, frames, sha256 }) => ({ id, activeRows, frames, sha256 })), states: 21, nativePoses: 84, technicalChecks: true, finalVisualReview }));
