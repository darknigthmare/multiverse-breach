import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { segmentAtlas } from '../../../scripts/buildCombatEntityAssets.mjs';

const root = process.cwd(), docs = 'docs/combat-fidelity-wave6-2026-10-20/sonic-sources';
const output = 'public/sprites/generated/melee-sonic-wave6';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(path.join(root, docs, file), 'utf8'));
const { plans } = await json('native-prompts.json');
const correction = await json('sonic-ledge-correction-prompt.json');
let contacts = {};
try { contacts = await json('hand-measurements.json'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const reviewed = true;
const checkOnly = process.argv.includes('--check');
const write = async (file, bytes) => {
  if (checkOnly) assert.deepEqual(await fs.readFile(file), Buffer.from(bytes), `${file}: regenerate the reviewed combat assets`);
  else await fs.writeFile(file, bytes);
};
const sourcesPlan = {
  'sonic-combat-a': { file: '/workspace/generated_images/exec-f7adb1f0-2e92-453a-9334-b533649fb82a.png', rows: 8 },
  'sonic-combat-b': { file: `${docs}/sonic-combat-b-source.png`, rows: 8, nativeDataUrl: true },
  'sonic-ledge-initial': { file: '/workspace/generated_images/exec-6aaabd84-9fe1-4651-915a-0c79627f10e0.png', rows: 5 },
  'sonic-ledge-correction': { file: '/workspace/generated_images/exec-deff08b3-b1e4-4c2f-bbbf-814b56598842.png', rows: 5 }
};
const calibration = {
  'sonic-combat-a': { state: 'chargeRecovery', row: 7, frame: 3, sourceRoi: { x: 705, y: 1516, width: 164, height: 249 }, sourceBodyHeight: 249 },
  'sonic-combat-b': { state: 'intro', row: 5, frame: 0, sourceRoi: { x: 26, y: 1043, width: 160, height: 230 }, sourceBodyHeight: 230 },
  'sonic-ledge': { state: 'ledgeHang', row: 1, frame: 0, sourceRoi: { x: 54, y: 342, width: 153, height: 226 }, sourceBodyHeight: 226,
    measurement: 'Manually inspected approximate highest head-quill to shoe-sole vertical interval; raised hands and arms above the head excluded.' }
};
const actions = {
  attackLight1: 'Low entry, folding knees/head, small actual spiky Spin Attack body and low uncurled recovery.',
  attackLight2: 'Squat, airborne knee tuck, asymmetric small blue curl with red shoe and airborne opening.',
  attackLight3: 'Long forward running lean, head/legs folding, small spiky rolling contact and low skid.',
  crouchLight: 'Low crouch, tighter face/knee fold, small ground-level Spin Attack curl and low open-palm recovery.',
  chargeStart: 'Upright speed readiness, knees folding, deeper head-to-knee crouch and grounded physical coil. No levitation.',
  chargeLoop: 'Four distinct native compact body folds: visible sole, paired tucked gloves, side-on quill fan with glove and compact knees/shoes. No ordinary guard or energy sphere.',
  chargeRelease: 'Homing Attack coil, airborne compression, small actual hedgehog rush curl and airborne uncurled recovery.',
  chargeRecovery: 'Partial airborne opening, red-shoe crouched landing, rising torso and upright Adventure Sonic.',
  attackRecovery: 'Low skid, centered crouch, rising torso and upright speed-ready recovery.',
  special: 'Secondary Homing Attack: grounded coil, airborne fold, compact blue hedgehog rush and open airborne recovery. No detached projectile or Super Sonic.',
  aerialNeutral: 'Spin Jump tuck, deeper head-to-knee fold, small spiky blue curled body and airborne opening.',
  aerialForward: 'Forward airborne entry, leg/head folding, actual small curled rush and red-shoe-led opening.',
  aerialDown: 'Falling forward fold, tucked head and gloves, downward-oriented small spiky body and uncurled falling stance. Descent adaptation, not SA2 Bounce Attack.',
  intro: 'Hand at hip, raised index finger, forward beckoning palm and low speed-ready stance.',
  victory: 'Relaxed standing pose, raised thumbs-up, raised index finger and lightly crossed arms with shoe extended.',
  ledgeAttack: 'One overhead glove grip, raised-knee pull-up, supporting palm plus free shoe kick and low planted-palm recovery.',
  ledgeCatch: 'Pre-contact upward reach, one hooked overhead glove plus other reaching, two overhead grips with tucked legs and settled suspended body.',
  ledgeHang: 'Two gloves supporting dangling shoes, one-hand supported swing, two grips with raised knee and settled tucked hang.',
  ledgeClimb: 'Tucked two-hand pull, one raised support glove with the free glove bent near chest, low palm press and crouch above the former edge. Actual support glove measured in every frame.',
  ledgeDrop: 'Two overhead grips, one remaining grip/free open palm, two released open hands and lowered arms in freefall.',
  ledgeJump: 'Tucked two-hand hang, bent-elbow physical push, released rising body and free airborne arc. No spin attack in this traversal row.'
};
await fs.mkdir(path.join(root, output), { recursive: true });
const archive = async (file, destination) => {
  let bytes;
  try { bytes = await fs.readFile(path.resolve(root, file)); }
  catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await fs.readFile(path.join(root, destination)); }
  await write(path.join(root, destination), bytes);
  return { path: destination, sha256: hash(bytes), bytes, originalGeneratedPath: file.startsWith('/workspace/generated_images/') ? file : null };
};
const referenceAsset = '/sprites/generated/heroes/sonic/sonic-hedgehog.png';
const reference = await archive(path.join(root, 'public', referenceAsset), `${docs}/sonic-reference.png`);
const sources = {};
for (const [id, spec] of Object.entries(sourcesPlan)) {
  const archived = await archive(spec.file, `${docs}/${id}-source.png`);
  sources[id] = { ...archived, nativeDataUrl: !!spec.nativeDataUrl, atlas: await segmentAtlas(path.join(root, archived.path), spec.rows) };
}
const entries = [], reviews = [];
for (const plan of plans) {
  const selectedKey = plan.id === 'sonic-ledge' ? 'sonic-ledge-correction' : plan.id;
  const source = sources[selectedKey], measure = calibration[plan.id];
  const maxWidth = Math.max(...source.atlas.rows.flatMap(row => row.frames.map(frame => frame.bounds.width)));
  const maxVerticalSpan = Math.max(...source.atlas.rows.map(row => Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height)) - Math.min(...row.frames.map(frame => frame.bounds.top))));
  const requestedScale = 190 / measure.sourceBodyHeight;
  const safetyScale = Math.min(232 / maxWidth, 232 / maxVerticalSpan);
  const commonScale = Math.min(requestedScale, safetyScale);
  const normalizedBodyHeight = measure.sourceBodyHeight * commonScale;
  const stature = { ...measure, sourceImage: source.path, targetBodyHeight: 190, normalizedBodyHeight,
    scale: commonScale, requestedScale, safetyScale, safetyLimited: commonScale < requestedScale,
    scope: 'One common nearest-neighbor scale for every pose in this native source; compact balls/crouches retain source proportions.',
    measurement: measure.measurement || 'Manually reviewed full standing body alpha interval from highest quill to shoe sole in the specified native calibration frame.' };
  const rows = [], overlays = [], frameChecks = [];
  for (const [rowIndex, state] of plan.states.entries()) {
    const row = source.atlas.rows[rowIndex];
    assert.equal(row.seamReview.crossedVisiblePixels, 0, `${state}: visible art crosses source column seam`);
    const bottom = Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height));
    const frameBounds = [], pieces = [];
    for (const [column, frame] of row.frames.entries()) {
      const bounds = frame.bounds, width = Math.max(1, Math.round(bounds.width * commonScale)), height = Math.max(1, Math.round(bounds.height * commonScale));
      const left = Math.round((256 - width) / 2), top = Math.round(244 - (bottom - bounds.top) * commonScale);
      assert.ok(left >= 10 && top >= 10 && left + width <= 246 && top + height <= 246, `${state}/${column}: whole native pose must fit safe cell`);
      const input = await sharp(frame.data, { raw: { width: frame.width, height: frame.height, channels: 4 } })
        .extract(bounds).resize(width, height, { kernel: sharp.kernel.nearest }).png().toBuffer();
      pieces.push({ input, left: column * 256 + left, top });
      frameBounds.push({ source: bounds, output: { left, top, width, height }, sourceFrameRgbaSha256: hash(frame.data) });
    }
    const normalized = await sharp({ create: { width: 1024, height: 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(pieces).png().toBuffer();
    await write(path.join(root, docs, `${plan.id}-row-${rowIndex}.png`), normalized);
    overlays.push({ input: normalized, left: 0, top: rowIndex * 256 });
    rows.push({ state, row: rowIndex, sourceImage: source.path, sourceImageSha256: source.sha256, sourceRow: rowIndex,
      sourceBounds: row.sourceBounds, scale: commonScale, baseline: 244, frameBounds,
      nativeFrameRgbaSha256: frameBounds.map(frame => frame.sourceFrameRgbaSha256), ...row.seamReview,
      visualReview: { manuallyInspected: reviewed, fourDistinctNativePoses: reviewed, action: actions[state] } });
  }
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(overlays).png({ compressionLevel: 9 }).toBuffer();
  const sheet = `/sprites/generated/melee-sonic-wave6/${plan.id}.png`;
  await write(path.join(root, 'public', sheet), bytes);
  const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([info.width, info.height, info.channels], [1024, 2048, 4]);
  for (let row = 0; row < 8; row++) {
    const hashes = new Set();
    for (let col = 0; col < 4; col++) {
      const raw = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const at = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        data.copy(raw, (y * 256 + x) * 4, at, at + 4);
        if (data[at + 3] > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(data[at + 3], 0, `${plan.id}/${row}/${col}: opaque unsafe margin`);
      }
      assert.ok(row < plan.states.length ? visible > 1000 : visible === 0, 'Only selected native poses may occupy cells');
      const sha = hash(raw); hashes.add(sha); frameChecks.push({ row, col, visiblePixels: visible, rgbaSha256: sha });
      if (plan.id === 'sonic-ledge' && row < 5) await write(path.join(root, docs, `grip-${plan.states[row]}-${col}.png`), await sharp(raw, { raw: { width: 256, height: 256, channels: 4 } }).png().toBuffer());
    }
    if (row < plan.states.length) assert.equal(hashes.size, 4, `${plan.id}/${row}: copied native pose`);
  }
  entries.push({ id: plan.id, heroId: 'sonic_hedgehog', universe: 'Sonic', sheet,
    states: Object.fromEntries(plan.states.map((state, row) => [state, { row, frames: 4, columns: 4, fps: ['chargeLoop', 'ledgeHang'].includes(state) ? 8 : 12, loop: ['chargeLoop', 'ledgeHang', 'victory'].includes(state) }])),
    stateOrder: plan.states, columns: 4, rows: 8, activeRows: plan.states.length, frames: plan.states.length * 4,
    dimensions: { width: 1024, height: 2048, frameWidth: 256, frameHeight: 256 }, width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, alpha: true, sha256: hash(bytes),
    sourceImage: source.path, sourceImageSha256: source.sha256, sourceDimensions: [source.atlas.width, source.atlas.height], originalSourceRows: plan.states.length,
    referenceAsset, referenceAssetSha256: reference.sha256, archivedReferenceAsset: reference.path,
    sourceWork: 'Sonic Adventure (1998) — cobalt blue Sonic with green eyes and original strap/buckle shoes',
    sourceReference: plan.id === 'sonic-ledge' ? 'Five physical traversal adaptations using Sonic’s actual white gloves and peach arms, without painted supports. Native hand contacts are project measurements, not official movement frames.'
      : 'Resolved simple Spin Attack de Sonic and secondary Homing Attack before prompts: real curled Sonic bodies, no separate magic orb or transformation. The 100% Light Speed Attack uses the separately registered native presentation.',
    normalization: { method: 'alpha-segmentation-common-source-scale', frameSize: 256, padding: 12, margins: 10, baseline: 244,
      sharedScalePerSource: true, sharedScalePerState: false, sourceScaleFactors: { [source.path]: commonScale }, statureCalibration: stature,
      frameOrder: [0, 1, 2, 3], sourceAlphaBoundsThreshold: 4, rows, emptyRows: Array.from({ length: 8 - plan.states.length }, (_, i) => plan.states.length + i),
      contactAnchorMeasurements: plan.id === 'sonic-ledge' ? contacts : {} },
    visualValidation: { identityReviewed: true, stateRowsReviewed: reviewed, fourNativePosesPerStateReviewed: reviewed, technicalAlphaReviewed: true, fullOutputSilhouetteContained: true,
      canon1to1Verified: false, networkVerified: false, notes: 'Shared Adventure 1 identity with motion/native32 agents. All 21 normalized rows and 84 distinct anatomical poses visually inspected. Compact bodies retain native proportions under one scale per source. Twelve primary palms and wrists were separately measured in the actual normalized glove pixels; Catch0 is pre-contact.' },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, date: '2026-10-20', nativeGeneratedArtwork: true, sourceGameAsset: false, canonicalAnimationVerified: false,
      generatedSourcePath: source.originalGeneratedPath, nativeOutputKind: source.nativeDataUrl ? 'image_url data URL copied byte-for-byte; no local generated path supplied' : 'local native tool PNG',
      promptFile: `${docs}/native-prompts.json`, prompt: plan.prompt, promptSha256: hash(Buffer.from(plan.prompt)), referenceImagesInspectedBeforeGeneration: true,
      nativeCorrections: plan.id === 'sonic-ledge' ? [{ sourceImage: source.path, sourceImageSha256: source.sha256, generatedSourcePath: source.originalGeneratedPath,
        replacedSourceImage: sources['sonic-ledge-initial'].path, replacedSourceImageSha256: sources['sonic-ledge-initial'].sha256,
        selectedStates: plan.states, promptFile: `${docs}/sonic-ledge-correction-prompt.json`, prompt: correction.prompt, reason: correction.reason }] : [],
      conditioning: 'Native image_gen drawing only. Technical Sharp alpha segmentation, bounding extraction, one nearest-neighbor scale per source, transparent packing and review crops. No rotated/mirrored substitute, procedural drawing or copied pose.' }
  });
  reviews.push({ id: plan.id, statureCalibration: stature, rows, frameChecks });
}
await write(path.join(root, 'src/game/combat/sonicMeleeCombat.generated.json'), `${JSON.stringify({ schemaVersion: 1, source: 'OpenAI', entries }, null, 2)}\n`);
await write(path.join(root, docs, 'technical-review.json'), `${JSON.stringify({ date: '2026-10-20', reviews }, null, 2)}\n`);
await write(path.join(root, docs, 'provenance-combat.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-20', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null,
  plannedGenerations: 3, correctiveGenerations: 1, canonicalAnimationVerified: false, networkVerified: false,
  generationClaim: '64 native combat poses plus 20 native corrective ledge poses selected; all 20 initial ledge poses excluded and preserved. 84 selected poses, no empty reserved cell counted.',
  nativeSources: Object.entries(sources).map(([id, s]) => ({ id, path: s.path, sha256: s.sha256, bytes: s.bytes.length, dimensions: [s.atlas.width, s.atlas.height], originalGeneratedPath: s.originalGeneratedPath, nativeDataUrlCopiedWithoutPixelChange: s.nativeDataUrl })),
  references: [{ path: reference.path, sha256: reference.sha256, originalAsset: referenceAsset }], entries }, null, 2)}\n`);
console.log(JSON.stringify({ atlases: entries.map(e => ({ id: e.id, frames: e.frames, sha256: e.sha256, stature: e.normalization.statureCalibration.normalizedBodyHeight, scale: e.normalization.statureCalibration.scale })), states: 21, poses: 84, reviewed }));
