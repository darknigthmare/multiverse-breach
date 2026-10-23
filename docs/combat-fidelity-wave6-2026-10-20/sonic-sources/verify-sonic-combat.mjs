import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd(), docs = 'docs/combat-fidelity-wave6-2026-10-20/sonic-sources';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const registry = JSON.parse(await fs.readFile(path.join(root, 'src/game/combat/sonicMeleeCombat.generated.json'), 'utf8'));
const provenance = JSON.parse(await fs.readFile(path.join(root, docs, 'provenance-combat.json'), 'utf8'));
assert.deepEqual(provenance.entries, registry.entries);
assert.equal(registry.entries.length, 3);
assert.equal(registry.entries.reduce((total, entry) => total + entry.activeRows, 0), 21);
assert.equal(registry.entries.reduce((total, entry) => total + entry.frames, 0), 84);
const proportions = [];
for (const entry of registry.entries) {
  const bytes = await fs.readFile(path.join(root, 'public', entry.sheet));
  assert.equal(hash(bytes), entry.sha256);
  assert.equal(entry.visualValidation.stateRowsReviewed, true);
  assert.equal(entry.visualValidation.fourNativePosesPerStateReviewed, true);
  assert.equal(entry.visualValidation.canon1to1Verified, false);
  assert.equal(entry.provenance.model, null); assert.equal(entry.provenance.generationId, null);
  assert.equal(entry.normalization.sharedScalePerSource, true);
  assert.equal(entry.normalization.sharedScalePerState, false);
  const calibration = entry.normalization.statureCalibration;
  assert.equal(calibration.normalizedBodyHeight, 190);
  assert.equal(calibration.safetyLimited, false);
  const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([info.width, info.height, info.channels], [1024, 2048, 4]);
  for (const row of entry.normalization.rows) {
    assert.equal(row.scale, calibration.scale, 'One common scale must preserve ball/crouch projection');
    assert.equal(row.crossedOpaquePixels, 0); assert.equal(row.crossedVisiblePixels, 0);
    assert.equal(row.visualReview.manuallyInspected, true);
    assert.equal(new Set(row.frameBounds.map(frame => frame.sourceFrameRgbaSha256)).size, 4);
    for (const [frame, bounds] of row.frameBounds.entries()) {
      assert.equal(bounds.output.height, Math.round(bounds.source.height * calibration.scale));
      assert.equal(bounds.output.width, Math.round(bounds.source.width * calibration.scale));
      if (row.state === 'chargeLoop' || (frame === 2 && ['attackLight1', 'attackLight2', 'attackLight3', 'crouchLight', 'chargeRelease', 'special', 'aerialNeutral', 'aerialForward', 'aerialDown'].includes(row.state))) {
        assert.ok(bounds.output.height < 190 * 0.8, `${row.state}/${frame}: curled body was inflated to standing height`);
        proportions.push({ atlas: entry.id, state: row.state, frame, sourceHeight: bounds.source.height, outputHeight: bounds.output.height, standingHeight: 190, commonScale: calibration.scale });
      }
    }
  }
  for (let row = 0; row < 8; row++) {
    const hashes = new Set();
    for (let col = 0; col < 4; col++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const at = ((row * 256 + y) * info.width + col * 256 + x) * 4;
        data.copy(rgba, (y * 256 + x) * 4, at, at + 4);
        if (data[at + 3] > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(data[at + 3], 0, 'Required transparent margins');
      }
      assert.ok(row < entry.activeRows ? visible > 1000 : visible === 0, 'Reserved transparent cells are never counted as poses');
      hashes.add(hash(rgba));
    }
    if (row < entry.activeRows) assert.equal(hashes.size, 4, 'Four actual distinct native frames per state');
  }
}
const ledge = registry.entries.find(entry => entry.id === 'sonic-ledge');
const { data, info } = await sharp(path.join(root, 'public', ledge.sheet)).raw().toBuffer({ resolveWithObject: true });
const measureRoi = (state, frame, point) => {
  const rgba = Buffer.alloc(9 * 9 * 4); let visible = 0, whiteGlove = 0;
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
    const at = ((ledge.states[state].row * 256 + point.y + dy) * info.width + frame * 256 + point.x + dx) * 4;
    data.copy(rgba, ((dy + 4) * 9 + dx + 4) * 4, at, at + 4);
    const [r, g, b, a] = data.subarray(at, at + 4);
    if (a <= 24) continue;
    visible++;
    if (Math.min(r, g, b) > 90 && Math.max(r, g, b) - Math.min(r, g, b) < 80) whiteGlove++;
  }
  return { radius: 4, x: point.x, y: point.y, visiblePixels: visible, whiteGlovePixels: whiteGlove, rgbaSha256: hash(rgba), rgba };
};
const checks = [];
for (const state of ['ledgeCatch', 'ledgeHang', 'ledgeClimb']) for (const point of ledge.normalization.contactAnchorMeasurements[state]) {
  const palm = measureRoi(state, point.frame, point), wrist = measureRoi(state, point.frame, point.wrist);
  assert.ok(palm.visiblePixels >= 60 && palm.whiteGlovePixels >= 30, `${state}/${point.frame}: supporting palm is outside white glove`);
  assert.ok(wrist.visiblePixels >= 60 && wrist.whiteGlovePixels >= 20, `${state}/${point.frame}: wrist is outside native glove cuff`);
  for (const p of [point, point.wrist]) { assert.equal(p.normalizedX, p.x / 256); assert.equal(p.normalizedY, p.y / 256); }
  for (const [kind, roi] of [['palm', palm], ['wrist', wrist]]) await sharp(roi.rgba, { raw: { width: 9, height: 9, channels: 4 } }).png()
    .toFile(path.join(root, docs, `roi-${state}-${point.frame}-${kind}.png`));
  const { rgba: _palm, ...palmRoi } = palm, { rgba: _wrist, ...wristRoi } = wrist;
  checks.push({ state, frame: point.frame, x: point.x, y: point.y, normalizedX: point.normalizedX, normalizedY: point.normalizedY, contact: point.contact, palmRoi, wristRoi, passed: true });
}
assert.equal(checks.length, 12);
assert.equal(checks.filter(check => check.contact).length, 11);
const report = { date: '2026-10-20', sheet: ledge.sheet, sha256: ledge.sha256, requiredStates: 3, requiredFrames: 12, contactFrames: 11, rgbaRois: 24, allPassed: true,
  method: 'Visual selection of native white-glove palms and adjoining glove wrists, followed by independent 9×9 alpha/color checks. The 24 PNG crops and raw RGBA hashes preserve actual inspected pixels; measurements are project anchors rather than official Sonic Adventure frames.',
  contactMeaning: 'Catch0 reaches before contact. Other Catch/Hang/Climb primary anchors support the inferred edge. Climb1 uses the raised support glove rather than the free fist near the chest. Drop/Jump release frames carry only their previous edge reference with contact false.', checks };
await fs.writeFile(path.join(root, docs, 'grip-pixel-checks.json'), `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'compact-body-proportions.json'), `${JSON.stringify({ standingHeight: 190, commonScalePerSource: true, inflatedRows: false, checks: proportions }, null, 2)}\n`);
const sourceFiles = [...provenance.nativeSources.map(source => source.path), ...provenance.references.map(reference => reference.path),
  `${docs}/native-prompts.json`, `${docs}/sonic-ledge-correction-prompt.json`, `${docs}/resolved-abilities-before-generation.json`];
const files = [];
for (const file of sourceFiles) {
  const bytes = await fs.readFile(path.join(root, file));
  const recorded = [...provenance.nativeSources, ...provenance.references].find(item => item.path === file);
  if (recorded) assert.equal(hash(bytes), recorded.sha256);
  files.push({ path: file, bytes: bytes.length, sha256: hash(bytes) });
}
assert.equal(files.length, 8);
assert.equal(provenance.nativeSources.find(source => source.id === 'sonic-combat-b').sha256, 'a223703ffe4bc261410381d9f7d94d2ba6bdd0378a918e54d88ef5fd3b110ca7');
await fs.writeFile(path.join(root, docs, 'source-archive-manifest.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-20', nativeGenerations: 4, model: null, generationId: null, canonicalAnimationVerified: false, files }, null, 2)}\n`);
console.log(JSON.stringify({ states: 21, nativePoses: 84, stableAtlases: 3, standingHeight: 190, compactBodyChecks: proportions.length, measuredHands: 12, contactHands: 11, rgbaRois: 24, archivedFiles: files.length, passed: true }));
