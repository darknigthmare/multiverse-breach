import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const docs = 'docs/combat-fidelity-wave5-2026-10-20/vegeta-sources';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const registry = JSON.parse(await fs.readFile(path.join(root, 'src/game/combat/vegetaMeleeCombat.generated.json'), 'utf8'));
const provenance = JSON.parse(await fs.readFile(path.join(root, docs, 'provenance-combat.json'), 'utf8'));
assert.deepEqual(provenance.entries, registry.entries);
assert.equal(registry.entries.length, 3);
assert.equal(registry.entries.reduce((total, entry) => total + entry.activeRows, 0), 21);
assert.equal(registry.entries.reduce((total, entry) => total + entry.frames, 0), 84);
for (const entry of registry.entries) {
  const bytes = await fs.readFile(path.join(root, 'public', entry.sheet));
  assert.equal(hash(bytes), entry.sha256);
  assert.equal(entry.visualValidation.stateRowsReviewed, true);
  assert.equal(entry.visualValidation.fourNativePosesPerStateReviewed, true);
  assert.equal(entry.visualValidation.canon1to1Verified, false);
  assert.equal(entry.provenance.model, null); assert.equal(entry.provenance.generationId, null);
  for (const row of entry.normalization.rows) {
    assert.equal(row.crossedOpaquePixels, 0); assert.equal(row.crossedVisiblePixels, 0);
    assert.equal(row.visualReview.manuallyInspected, true);
    assert.equal(new Set(row.nativeFrameRgbaSha256).size, 4);
    if (row.alphaOwnership) {
      assert.equal(row.alphaOwnership.nativeRowRgbaSha256Before, row.alphaOwnership.nativeRowRgbaSha256After);
      assert.equal(row.alphaOwnership.nativePixelsConserved, true);
      assert.equal(row.alphaOwnership.artworkRedrawn, false);
    }
  }
}
const ledge = registry.entries.find(entry => entry.id === 'vegeta-ledge');
const { data, info } = await sharp(path.join(root, 'public', ledge.sheet)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const measureRoi = (state, frame, point) => {
  const rgba = Buffer.alloc(9 * 9 * 4); let visible = 0, whiteGlove = 0;
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
    const x = point.x + dx, y = point.y + dy;
    const at = ((ledge.states[state].row * 256 + y) * info.width + frame * 256 + x) * 4;
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
  assert.ok(palm.visiblePixels >= 60, `${state}/${point.frame}: palm anchor is outside opaque glove artwork`);
  assert.ok(palm.whiteGlovePixels >= 30, `${state}/${point.frame}: palm ROI does not contain native white glove`);
  assert.ok(wrist.visiblePixels >= 60, `${state}/${point.frame}: wrist anchor is outside opaque gauntlet artwork`);
  assert.ok(wrist.whiteGlovePixels >= 20, `${state}/${point.frame}: wrist ROI does not contain native white gauntlet`);
  assert.equal(point.normalizedX, point.x / 256); assert.equal(point.normalizedY, point.y / 256);
  assert.equal(point.wrist.normalizedX, point.wrist.x / 256); assert.equal(point.wrist.normalizedY, point.wrist.y / 256);
  for (const [kind, roi] of [['palm', palm], ['wrist', wrist]]) await sharp(roi.rgba, { raw: { width: 9, height: 9, channels: 4 } }).png()
    .toFile(path.join(root, docs, `roi-${state}-${point.frame}-${kind}.png`));
  const { rgba: _palmRgba, ...palmRoi } = palm, { rgba: _wristRgba, ...wristRoi } = wrist;
  checks.push({ state, frame: point.frame, x: point.x, y: point.y, normalizedX: point.normalizedX, normalizedY: point.normalizedY,
    contact: point.contact, palmRoi, wristRoi, passed: true });
}
assert.equal(checks.length, 12);
assert.equal(checks.filter(check => check.contact).length, 11);
for (let y = 5 * 256; y < info.height; y++) for (let x = 0; x < info.width; x++) assert.equal(data[(y * info.width + x) * 4 + 3], 0);
const report = { date: '2026-10-20', sheet: ledge.sheet, sha256: ledge.sha256, requiredStates: 3, requiredFrames: 12, contactFrames: 11, allPassed: true,
  method: 'Manual visual selection of white-gloved palm and adjacent white-gauntlet wrist centers, then independent 9×9 alpha/color ROI checks. Native RGBA crop hashes and24 PNG crops preserve the checked pixels. Numeric checks locate artwork; they do not establish canonical anatomy or official source-game fidelity.',
  contactMeaning: 'Catch0 is explicitly pre-contact. Other Catch/Hang/Climb anchors support the inferred project edge. Released Drop/Jump frames carry the former edge reference with contact false.', checks };
await fs.writeFile(path.join(root, docs, 'grip-pixel-checks.json'), `${JSON.stringify(report, null, 2)}\n`);
const sourceFiles = [...provenance.nativeSources.map(source => source.path), ...provenance.references.map(reference => reference.path),
  `${docs}/native-prompts.json`, `${docs}/vegeta-charge-loop-correction-prompt.json`, `${docs}/vegeta-galick-spacing-correction-prompt.json`, `${docs}/resolved-abilities-before-generation.json`];
const files = [];
for (const file of sourceFiles) {
  const bytes = await fs.readFile(path.join(root, file));
  const recorded = [...provenance.nativeSources, ...provenance.references].find(item => item.path === file);
  if (recorded) assert.equal(hash(bytes), recorded.sha256);
  files.push({ path: file, bytes: bytes.length, sha256: hash(bytes) });
}
assert.equal(files.length, 11);
await fs.writeFile(path.join(root, docs, 'source-archive-manifest.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-20', nativeGenerations: 5, model: null, generationId: null, canonicalAnimationVerified: false, files }, null, 2)}\n`);
console.log(JSON.stringify({ states: 21, nativePoses: 84, stableAtlases: 3, measuredHands: 12, contactHands: 11, rgbaRois: 24, archivedFiles: files.length, passed: true }));
