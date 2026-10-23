import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd(), docs = 'docs/combat-fidelity-wave7-2026-10-20/ragna-sources';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const registry = JSON.parse(await fs.readFile('src/game/combat/ragnaMeleeCombat.generated.json', 'utf8'));
const provenance = JSON.parse(await fs.readFile(path.join(docs, 'provenance-combat.json'), 'utf8'));
assert.deepEqual(provenance.entries, registry.entries);
assert.equal(registry.entries.length, 3);
assert.equal(registry.entries.reduce((sum, e) => sum + e.activeRows, 0), 21);
assert.equal(registry.entries.reduce((sum, e) => sum + e.frames, 0), 84);
assert.equal(provenance.nativeSources.length, 5);
assert.equal(provenance.nativeSources.reduce((sum, s) => sum + s.selectedSourceRows.length * 4, 0), 84);
const sourceScales = new Map(), proportions = [];
for (const entry of registry.entries) {
  const bytes = await fs.readFile(path.join(root, 'public', entry.sheet));
  assert.equal(hash(bytes), entry.sha256);
  assert.equal(entry.visualValidation.stateRowsReviewed, true); assert.equal(entry.visualValidation.fourNativePosesPerStateReviewed, true);
  assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.source1to1Verified, false);
  assert.equal(entry.provenance.model, null); assert.equal(entry.provenance.generationId, null);
  assert.equal(entry.normalization.sharedScalePerSource, true); assert.equal(entry.normalization.sharedScalePerState, false);
  const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([info.width, info.height, info.channels], [1024, 2048, 4]);
  for (const row of entry.normalization.rows) {
    assert.equal(row.crossedOpaquePixels, 0); assert.equal(row.crossedVisiblePixels, 0);
    assert.equal(row.visualReview.manuallyInspected, true); assert.equal(new Set(row.nativeFrameRgbaSha256).size, 4);
    const c = row.statureCalibration;
    assert.ok(Math.abs(c.sourceBodyHeight * row.scale * row.renderScale - 190) < 1e-9);
    assert.equal(entry.states[row.state].renderScale, row.renderScale);
    const pair = { scale: row.scale, renderScale: row.renderScale, bodyHeight: c.sourceBodyHeight };
    if (sourceScales.has(row.sourceImage)) assert.deepEqual(pair, sourceScales.get(row.sourceImage), 'Every pose from one native source must share scale and body calibration');
    else sourceScales.set(row.sourceImage, pair);
    for (const [frame, b] of row.frameBounds.entries()) {
      assert.equal(b.output.height, Math.round(b.source.height * row.scale));
      assert.equal(b.output.width, Math.round(b.source.width * row.scale));
      if (['crouchLight', 'chargeLoop', 'aerialNeutral', 'aerialDown'].includes(row.state)) {
        const effectiveSilhouetteHeight = b.source.height * row.scale * row.renderScale;
        assert.ok(effectiveSilhouetteHeight < 190, `${row.state}/${frame}: compact pose inflated to standing height`);
        proportions.push({ state: row.state, frame, sourceHeight: b.source.height, outputHeight: b.output.height, scale: row.scale, renderScale: row.renderScale, effectiveSilhouetteHeight, standingBodyHeight: 190 });
      }
    }
  }
  for (let row = 0; row < 8; row++) {
    const unique = new Set();
    for (let frame = 0; frame < 4; frame++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const at = ((row * 256 + y) * 1024 + frame * 256 + x) * 4; data.copy(rgba, (y * 256 + x) * 4, at, at + 4);
        if (data[at + 3] > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(data[at + 3], 0, 'Full silhouette must remain inside transparent margins');
      }
      assert.ok(row < entry.activeRows ? visible > 1000 : visible === 0, 'Empty reserved cells are not poses'); unique.add(hash(rgba));
    }
    if (row < entry.activeRows) assert.equal(unique.size, 4);
  }
}
assert.equal(sourceScales.size, 5); assert.equal(proportions.length, 16);
await fs.writeFile(path.join(docs, 'natural-projection-checks-combat.json'), `${JSON.stringify({ targetEffectiveStandingBodyHeight: 190, commonScalePerSource: true,
  measurement: 'Full native silhouette height is an upper bound on compact body height; no weapon is removed to make a pose seem smaller. The same source scale and render factor preserve every original ratio.', checks: proportions }, null, 2)}\n`);
const ledge = registry.entries.find(e => e.id === 'ragna-ledge');
const { data, info } = await sharp(path.join(root, 'public', ledge.sheet)).raw().toBuffer({ resolveWithObject: true });
const measure = (state, frame, point) => {
  const rgba = Buffer.alloc(9 * 9 * 4); let visible = 0, darkGlove = 0, silverCuff = 0;
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
    const at = ((ledge.states[state].row * 256 + point.y + dy) * info.width + frame * 256 + point.x + dx) * 4;
    data.copy(rgba, ((dy + 4) * 9 + dx + 4) * 4, at, at + 4);
    const [r, g, b, a] = data.subarray(at, at + 4); if (a <= 24) continue;
    visible++; if (Math.max(r, g, b) < 100) darkGlove++;
    if (Math.min(r, g, b) > 80 && Math.max(r, g, b) - Math.min(r, g, b) < 65) silverCuff++;
  }
  return { radius: 4, x: point.x, y: point.y, visiblePixels: visible, darkGlovePixels: darkGlove, silverCuffPixels: silverCuff, rgbaSha256: hash(rgba), rgba };
};
const checks = [];
for (const state of ['ledgeCatch', 'ledgeHang', 'ledgeClimb']) for (const p of ledge.normalization.contactAnchorMeasurements[state]) {
  const palm = measure(state, p.frame, p), wrist = measure(state, p.frame, p.wrist);
  assert.equal(palm.visiblePixels, 81, `${state}/${p.frame}: palm outside native glove`); assert.ok(palm.darkGlovePixels >= 60);
  assert.equal(wrist.visiblePixels, 81, `${state}/${p.frame}: wrist outside native cuff`); assert.ok(wrist.silverCuffPixels >= 10);
  for (const q of [p, p.wrist]) { assert.equal(q.normalizedX, q.x / 256); assert.equal(q.normalizedY, q.y / 256); }
  for (const [kind, roi] of [['palm', palm], ['wrist', wrist]]) await sharp(roi.rgba, { raw: { width: 9, height: 9, channels: 4 } }).png().toFile(path.join(docs, `roi-${state}-${p.frame}-${kind}.png`));
  const { rgba: _p, ...palmRoi } = palm, { rgba: _w, ...wristRoi } = wrist;
  checks.push({ state, frame: p.frame, x: p.x, y: p.y, normalizedX: p.normalizedX, normalizedY: p.normalizedY, contact: p.contact, palmRoi, wristRoi, passed: true });
}
assert.equal(checks.length, 12); assert.equal(checks.filter(c => c.contact).length, 11);
await fs.writeFile(path.join(docs, 'grip-pixel-checks-combat.json'), `${JSON.stringify({ date: '2026-10-20', sheet: ledge.sheet, sha256: ledge.sha256, requiredFrames: 12, contactFrames: 11, rgbaRois: 24, allPassed: true,
  method: 'Manual inspection of actual black glove palms and adjoining silver/black cuffs, followed by 9×9 native RGBA/color checks. No sword fitting or red sleeve is used as a palm. Anchors are project measurements, not official game animation evidence.',
  contactMeaning: 'Catch0 explicitly reaches before contact. Remaining Catch/Hang/Climb primary anchors support the inferred edge. Climb1 uses the raised hand; free hands and released Drop/Jump poses have contact false.', checks }, null, 2)}\n`);
const files = [];
for (const file of [...provenance.nativeSources.map(s => s.path), ...provenance.references.map(s => s.path), `${docs}/native-prompts.json`, `${docs}/ragna-combat-correction-prompt.json`,
  `${docs}/ragna-aerial-intro-correction-prompt.json`, `${docs}/resolved-abilities-before-generation.json`, `${docs}/hand-measurements-combat.json`, `${docs}/actual-tool-calls-combat.json`]) {
  const bytes = await fs.readFile(file), recorded = [...provenance.nativeSources, ...provenance.references].find(s => s.path === file);
  if (recorded) assert.equal(hash(bytes), recorded.sha256);
  files.push({ path: file, sha256: hash(bytes), bytes: bytes.length });
}
assert.equal(files.length, 12);
const calls = JSON.parse(await fs.readFile(path.join(docs, 'actual-tool-calls-combat.json'), 'utf8')).calls;
assert.equal(calls.length, 5);
for (const call of calls) {
  assert.equal(call.model, null); assert.equal(call.generationId, null); assert.equal(call.toolCallId, null);
  assert.equal(hash(Buffer.from(call.prompt)), call.promptSha256);
  assert.equal(hash(await fs.readFile(call.output.archivedPath)), call.output.sha256);
  for (const ref of call.references) assert.equal(hash(await fs.readFile(ref.archivedPath)), ref.sha256);
}
await fs.writeFile(path.join(docs, 'source-archive-manifest-combat.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-20', nativeGenerations: 5, nativeSourceDrawings: 124,
  selectedNativePoses: 84, excludedReplacedOrCalibrationDrawings: 40, model: null, generationId: null, canonicalAnimationVerified: false, files }, null, 2)}\n`);
console.log(JSON.stringify({ states: 21, selectedNativePoses: 84, stableAtlases: 3, calibratedSources: 5, effectiveBodyHeight: 190, compactProjectionChecks: 16,
  measuredPalms: 12, measuredWrists: 12, contactPalms: 11, rgbaRois: 24, archivedFiles: 12, passed: true }));
