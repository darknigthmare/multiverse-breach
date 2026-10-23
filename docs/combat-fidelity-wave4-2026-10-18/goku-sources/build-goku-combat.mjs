import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { segmentAtlas, normalizeRow } from '../../../scripts/buildCombatEntityAssets.mjs';

const root = process.cwd();
const docs = 'docs/combat-fidelity-wave4-2026-10-18/goku-sources';
const output = 'public/sprites/generated/melee-goku-wave4';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const plans = JSON.parse(await fs.readFile(path.join(root, docs, 'native-prompts.json'), 'utf8')).plans;
const correctionPrompt = JSON.parse(await fs.readFile(path.join(root, docs, 'goku-missing-and-catch-correction-prompt.json'), 'utf8'));
const sourcePlan = {
  'goku-combat-a': { file: '/workspace/generated_images/exec-34395728-581c-4b70-9a52-b08c850da5c5.png', rows: 7 },
  'goku-combat-b': { file: '/workspace/generated_images/exec-affdf021-86ca-41ec-8e44-972c0f428834.png', rows: 8 },
  'goku-ledge': { file: '/workspace/generated_images/exec-75020e94-dbc5-4ec4-b5f2-4253880f3de0.png', rows: 5 },
  'goku-missing-and-catch-correction': { file: '/workspace/generated_images/exec-bfa314df-6931-45fa-997e-f9884248fda5.png', rows: 2 }
};
// A detached native orb can lie across the nominal column boundary while the
// alpha seam assigns it to the next character. Reassign those existing RGBA
// components to their source palm pose; never paint or erase artwork pixels.
function reassignOrbComponents(row, requiredPixels) {
  const from = row.frames[3], to = row.frames[2];
  const composite = () => {
    const bytes = Buffer.alloc(from.data.length);
    for (const frame of row.frames) for (let i = 0; i < bytes.length; i += 4) if (frame.data[i + 3]) frame.data.copy(bytes, i, i, i + 4);
    return bytes;
  };
  const before = composite(), visited = new Uint8Array(from.width * from.height), moved = [];
  for (let y = 0; y < from.height; y++) for (let x = 0; x < from.width; x++) {
    const first = y * from.width + x;
    if (visited[first] || from.data[first * 4 + 3] <= 4) continue;
    const pixels = [first]; visited[first] = 1;
    let left = x, right = x, top = y, bottom = y, yellow = 0;
    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i], px = p % from.width, py = Math.floor(p / from.width), offset = p * 4;
      left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
      if (from.data[offset] > 180 && from.data[offset + 1] > 140 && from.data[offset + 2] < 160) yellow++;
      for (const [nx, ny] of [[px - 1, py], [px + 1, py], [px, py - 1], [px, py + 1]]) {
        if (nx < 0 || nx >= from.width || ny < 0 || ny >= from.height) continue;
        const next = ny * from.width + nx;
        if (!visited[next] && from.data[next * 4 + 3] > 4) { visited[next] = 1; pixels.push(next); }
      }
    }
    if (!(pixels.length < 5000 && left >= 660 && right <= 712 && top >= 55 && bottom <= 115 && yellow > 0 && yellow / pixels.length >= 0.2)) continue;
    for (const pixel of pixels) {
      const at = pixel * 4;
      assert.equal(to.data[at + 3], 0, 'Native alpha ownership overlaps');
      from.data.copy(to.data, at, at, at + 4);
      from.data.fill(0, at, at + 4);
    }
    moved.push({ sourceColumn: 3, destinationColumn: 2, left, top, width: right - left + 1, height: bottom - top + 1, nativePixelsTransferred: pixels.length });
  }
  // The orb's outer alpha fringe can touch an unrelated red source outline,
  // so finish with its visually inspected source ROI. This region contains
  // only the detached projectile, no part of the recovery character's body.
  const [left, top, right, bottom] = requiredPixels >= 900 ? [660, 55, 717, 115] : [697, 87, 710, 111];
  let fringePixels = 0;
  for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
    const at = (y * from.width + x) * 4;
    if (!from.data[at + 3]) continue;
    assert.equal(to.data[at + 3], 0, 'Native orb ROI overlaps another pose');
    from.data.copy(to.data, at, at, at + 4); from.data.fill(0, at, at + 4); fringePixels++;
  }
  moved.push({ sourceColumn: 3, destinationColumn: 2, left, top, width: right - left + 1, height: bottom - top + 1, nativePixelsTransferred: fringePixels, operation: 'Native projectile outer-alpha ownership ROI; no anatomy pixels in region.' });
  assert.ok(moved.reduce((sum, item) => sum + item.nativePixelsTransferred, 0) >= requiredPixels, 'Expected detached native Kikoha component was not found');
  for (const frame of [from, to]) {
    let left = frame.width, right = -1, top = frame.height, bottom = -1, pixels = 0;
    for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) if (frame.data[(y * frame.width + x) * 4 + 3] > 4) {
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); pixels++;
    }
    frame.bounds = { left, top, width: right - left + 1, height: bottom - top + 1, pixels };
  }
  const after = composite(); assert.deepEqual(after, before, 'Alpha segmentation must conserve every native RGBA artwork pixel');
  return { method: 'native-detached-component-alpha-ownership', operation: 'Assign existing gold orb and fringe from the following recovery cell to the preceding open-palm release cell.', moved, nativeRowRgbaSha256Before: hash(before), nativeRowRgbaSha256After: hash(after), nativePixelsConserved: true, artworkRedrawn: false };
}
const archive = async (file, destination) => {
  let bytes;
  try { bytes = await fs.readFile(file); }
  catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await fs.readFile(path.join(root, destination)); }
  await fs.writeFile(path.join(root, destination), bytes);
  return { bytes, path: destination, sha256: hash(bytes), originalGeneratedPath: file };
};
const stateReview = {
  attackLight1: 'Bent guard, partly extended jab, full straight punch with shoulder turn, retracted guard; no weapon or ki effect.',
  attackLight2: 'Rear fist chamber, forward shoulder/knee drive, full cross and retracted stance; real hip and elbow changes.',
  attackLight3: 'Low bent knees and fist, rising elbow, high uppercut with straightened torso and settled high guard.',
  crouchLight: 'Wide low martial guard, body-level straight, rotated compact low punch and retracted crouched posture.',
  chargeStart: 'Guard, open palm beside chest, coiled torso with palm drawn back, low open-palm readiness. No cupped hip charge or beam.',
  chargeLoop: 'Corrective row: rear-weighted folded palm, deep symmetric squat, bent-elbow shoulder palm with hip turn, compact raised guard. Held postures without orb or release punch.',
  chargeRelease: 'Kikoha: rear open palm, partial one-palm extension with small gold orb, full open palm and detached round orb, bent-elbow recovery. No Kamehameha posture or beam.',
  chargeRecovery: 'Low forward follow-through, retracted low elbow, rising torso and stable two-fist martial guard.',
  attackRecovery: 'Forward punch follow-through, rotated retracting elbow, rising fists and compact recovered guard.',
  special: 'One-handed Kikoha: prepared palm, orb touching one open palm, extended palm with separate small round projectile, retracted guard. Kamehameha remains the distinct 100% super.',
  aerialNeutral: 'Airborne knee tuck, horizontal kick, higher diagonal kick and re-tucked falling guard.',
  aerialForward: 'Tucked flying windup, partial extending fist, full airborne straight punch and recovered knee tuck.',
  aerialDown: 'Raised paired fists with tucked legs, folded downward elbows, extended downward hammer fists and re-tucked falling guard.',
  intro: 'Relaxed hands, respectful forward bow, open-handed readiness and staggered martial guard.',
  victory: 'Relaxed stance, hand scratching behind head, high open-hand wave and settled waist guard.',
  ledgeAttack: 'One-hand overhead hang, bent supporting elbow with raised knee, free forward punch while lower palm braces, crouched two-fist recovery.',
  ledgeCatch: 'Corrective native row: reaching hand, one overhead grip plus the other reaching, two overhead grips with knee tuck, settled bent-elbow hang. Exactly two arms in each pose.',
  ledgeHang: 'Two-hand suspension, one bent elbow and swinging legs, high tucked knee with extended hands, settled suspended legs.',
  ledgeClimb: 'Raised bent supporting hands, chest-high pull with raised knee, palms pressing below torso and low crouch above inferred edge.',
  ledgeDrop: 'Two overhead grips, one remaining grip with open free hand, both released open hands, lowered freefalling arms.',
  ledgeJump: 'Tucked two-hand hang, braced upward push, released upward launch and recovering airborne arc.'
};
const palm = (x, y, contact) => ({ x, y, normalizedX: x / 256, normalizedY: y / 256, contact });
const grip = (frame, x, y, contact, supportHands = [], released = false) => ({
  frame, ...palm(x, y, contact), baseline: 'ledgeGrip', supportHands,
  measurement: released
    ? 'Carried edge reference after release, not an invented hand contact; free palms listed separately.'
    : 'Manually inspected approximate palm center in normalized native pixels, not a canonical source-game anchor.'
});
const gripPoints = {
  ledgeCatch: [
    grip(0, 227, 29, false, [palm(139, 128, false)]),
    grip(1, 198, 32, true, [palm(211, 62, false)]),
    grip(2, 154, 33, true, [palm(108, 33, true)]),
    grip(3, 159, 34, true, [palm(113, 34, true)])
  ],
  ledgeHang: [
    grip(0, 150, 25, true, [palm(94, 25, true)]),
    grip(1, 102, 24, true, [palm(193, 50, false)]),
    grip(2, 173, 25, true, [palm(98, 25, true)]),
    grip(3, 172, 25, true, [palm(111, 25, true)])
  ],
  ledgeClimb: [
    grip(0, 183, 54, true, [palm(92, 54, true)]),
    grip(1, 88, 56, true),
    grip(2, 218, 198, true, [palm(139, 196, true)]),
    grip(3, 202, 199, true, [palm(101, 199, true)])
  ],
  ledgeDrop: [
    grip(0, 155, 24, true, [palm(94, 24, true)]),
    grip(1, 92, 24, true, [palm(218, 71, false)]),
    grip(2, 92, 24, false, [palm(191, 36, false), palm(73, 34, false)], true),
    grip(3, 92, 24, false, [palm(204, 141, false), palm(59, 128, false)], true)
  ],
  ledgeJump: [
    grip(0, 155, 26, true, [palm(91, 26, true)]),
    grip(1, 165, 25, true, [palm(88, 25, true)]),
    grip(2, 165, 25, false, [palm(212, 35, false), palm(34, 113, false)], true),
    grip(3, 165, 25, false, [palm(207, 111, false), palm(33, 103, false)], true)
  ]
};
await fs.mkdir(path.join(root, output), { recursive: true });
const referenceAsset = '/sprites/generated/heroes/dragon-ball-z/goku-dbz.png';
const previousAtlas = '/sprites/generated/combat-character-animations/goku_dbz.png';
const reference = await archive(path.join(root, 'public', referenceAsset), `${docs}/goku-reference.png`);
const previous = await archive(path.join(root, 'public', previousAtlas), `${docs}/goku-previous-presentation-reference.png`);
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
    const corrected = plan.id === 'goku-combat-a' && state === 'chargeLoop' ? 0 : plan.id === 'goku-ledge' && state === 'ledgeCatch' ? 1 : null;
    const source = corrected === null ? original : sources['goku-missing-and-catch-correction'];
    const sourceRow = corrected ?? (plan.id === 'goku-combat-a' && row > 5 ? row - 1 : row);
    const segmented = source.atlas.rows[sourceRow];
    assert.ok(segmented, `${plan.id}/${state}: explicit native row missing`);
    const alphaOwnership = plan.id === 'goku-combat-b' && state === 'special' ? reassignOrbComponents(segmented, 900)
      : plan.id === 'goku-combat-a' && state === 'chargeRelease' ? reassignOrbComponents(segmented, 10) : null;
    const normalized = await normalizeRow(segmented);
    overlays.push({ input: normalized.bytes, left: 0, top: row * 256 });
    rows.push({ state, row, sourceImage: source.path, sourceImageSha256: source.sha256, sourceRow, sourceBounds: segmented.sourceBounds,
      scale: normalized.scale, baseline: normalized.baseline, frameBounds: normalized.frameBounds, ...segmented.seamReview,
      alphaOwnership,
      visualReview: { manuallyInspected: true, fourDistinctNativePoses: true, action: stateReview[state] } });
    await fs.writeFile(path.join(root, docs, `${plan.id}-row-${row}.png`), normalized.bytes);
  }
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(overlays).png({ compressionLevel: 9 }).toBuffer();
  const sheet = `/sprites/generated/melee-goku-wave4/${plan.id}.png`;
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
      unique.add(hash(frame)); frameChecks.push({ row, col, visiblePixels: visible, sha256: hash(frame) });
    }
    if (row < plan.states.length) assert.equal(unique.size, 4, `${plan.id}/${row}: duplicate native frame`);
  }
  const selectedCorrection = plan.id === 'goku-combat-a' ? { state: 'chargeLoop', row: 0 } : plan.id === 'goku-ledge' ? { state: 'ledgeCatch', row: 1 } : null;
  entries.push({ id: plan.id, heroId: 'goku_dbz', universe: 'Dragon Ball Z', sheet,
    states: Object.fromEntries(plan.states.map((state, row) => [state, { row, frames: 4, columns: 4, fps: ['chargeLoop', 'ledgeHang'].includes(state) ? 8 : 12, loop: ['chargeLoop', 'ledgeHang', 'victory'].includes(state) }])),
    stateOrder: plan.states, columns: 4, rows: 8, activeRows: plan.states.length, frames: plan.states.length * 4,
    dimensions: { width: 1024, height: 2048, frameWidth: 256, frameHeight: 256 }, width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, alpha: true, sha256: hash(bytes),
    sourceImage: original.path, sourceImageSha256: original.sha256, sourceDimensions: [original.atlas.width, original.atlas.height], originalSourceRows: original.sourceRows,
    referenceAsset, referenceAssetSha256: reference.sha256, archivedReferenceAsset: reference.path, previousAtlasReference: previousAtlas, previousAtlasReferenceSha256: previous.sha256,
    sourceWork: 'Dragon Ball Z — adult black-haired Son Goku',
    sourceReference: plan.id === 'goku-ledge' ? 'Adult DBZ Goku identity with five explicit project ledge-traversal adaptations, not canonical source-game movement frames. Bare hands, blue wrists and no painted platform.' : 'Current simple slot Enchaînement de poings de Son Goku and secondary Kikoha de Son Goku were resolved before prompts. special and chargeRelease use one-handed round palm projectiles. The distinct 100% Kamehameha super is not redrawn or substituted.',
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', frameSize: 256, padding: 12, sharedScalePerState: true, baseline: 244, rows,
      emptyRows: Array.from({ length: 8 - plan.states.length }, (_, i) => plan.states.length + i),
      contactAnchorMeasurements: plan.id === 'goku-ledge' ? gripPoints : {} },
    visualValidation: { identityReviewed: true, stateRowsReviewed: true, fourNativePosesPerStateReviewed: true, technicalAlphaReviewed: true, fullOutputSilhouetteContained: true, canon1to1Verified: false, networkVerified: false, notes: 'All 21 normalized rows, three final atlases and all 20 individual ledge crops were visually inspected. Missing chargeLoop and three-arm ledgeCatch source row were replaced by native corrective poses. Kikoha is an open-palm orb; the separate Kamehameha super is preserved. Palm coordinates are measured project anchors, not certified source-game contacts.' },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, date: '2026-10-18', sourceGameAsset: false, nativeGeneratedArtwork: true, canonicalAnimationVerified: false, generatedSourcePath: original.originalGeneratedPath,
      promptFile: `${docs}/native-prompts.json`, prompt: plan.prompt, promptSha256: hash(Buffer.from(plan.prompt)), referenceImagesInspectedBeforeGeneration: true,
      nativeCorrections: selectedCorrection ? [{ sourceImage: sources['goku-missing-and-catch-correction'].path, sourceImageSha256: sources['goku-missing-and-catch-correction'].sha256, generatedSourcePath: sourcePlan['goku-missing-and-catch-correction'].file,
        sourceRow: selectedCorrection.row, selectedState: selectedCorrection.state, promptFile: `${docs}/goku-missing-and-catch-correction-prompt.json`, prompt: correctionPrompt.prompt, reason: correctionPrompt.reason }] : [],
      conditioning: 'Exported entity-builder alpha segmentation and nearest-neighbor normalization, transparent atlas assembly and technical crop/contact output. Detached native gold orb components are reassigned to their preceding palm-release cell; source RGBA pixel hashes prove no artwork added or erased. No procedural poses, copied frames or code-redrawn limbs.' }
  });
  reviews.push({ id: plan.id, rows, frameChecks });
  await sharp({ create: { width: 1024, height: plan.states.length * 256, channels: 4, background: { r: 28, g: 34, b: 44, alpha: 1 } } }).composite(overlays).png().toFile(path.join(root, docs, `${plan.id}-review-contact.png`));
  if (plan.id === 'goku-ledge') for (let row = 0; row < plan.states.length; row++) for (let col = 0; col < 4; col++) await sharp(bytes).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).png().toFile(path.join(root, docs, `grip-${plan.states[row]}-${col}.png`));
}
await fs.writeFile(path.join(root, 'src/game/combat/gokuMeleeCombat.generated.json'), `${JSON.stringify({ schemaVersion: 1, source: 'OpenAI', entries }, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'technical-review.json'), `${JSON.stringify({ date: '2026-10-18', reviews }, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'provenance-combat.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, plannedGenerations: 3, correctiveGenerations: 1, canonicalAnimationVerified: false, networkVerified: false,
  generationClaim: 'Three native image_gen calls produced the initial atlases. A fourth native call supplied missing chargeLoop and corrected ledgeCatch poses. No model or generation ID is inferred from local filenames.',
  nativeSources: Object.entries(sources).map(([id, source]) => ({ id, path: source.path, sha256: source.sha256, bytes: source.bytes.length, dimensions: [source.atlas.width, source.atlas.height], sourceRows: source.sourceRows, originalGeneratedPath: source.originalGeneratedPath })),
  references: [{ path: reference.path, sha256: reference.sha256, originalAsset: referenceAsset }, { path: previous.path, sha256: previous.sha256, originalAsset: previousAtlas }], entries }, null, 2)}\n`);
console.log(JSON.stringify({ atlases: entries.map(({ id, activeRows, frames, sha256 }) => ({ id, activeRows, frames, sha256 })), states: 21, nativePoses: 84, technicalChecks: true }));
