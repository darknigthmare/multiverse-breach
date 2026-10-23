import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const docs = 'docs/combat-fidelity-wave4-2026-10-18/goku-sources';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const registry = JSON.parse(await fs.readFile(path.join(root, 'src/game/combat/gokuMeleeCombat.generated.json'), 'utf8'));
const provenance = JSON.parse(await fs.readFile(path.join(root, docs, 'provenance-combat.json'), 'utf8'));
assert.deepEqual(provenance.entries, registry.entries);
assert.equal(registry.entries.reduce((total, entry) => total + entry.activeRows, 0), 21);
assert.equal(registry.entries.reduce((total, entry) => total + entry.frames, 0), 84);
for (const entry of registry.entries) {
  const bytes = await fs.readFile(path.join(root, 'public', entry.sheet));
  assert.equal(hash(bytes), entry.sha256);
  assert.equal(entry.visualValidation.stateRowsReviewed, true);
  assert.equal(entry.visualValidation.fourNativePosesPerStateReviewed, true);
  assert.equal(entry.visualValidation.canon1to1Verified, false);
  for (const row of entry.normalization.rows) {
    assert.equal(row.crossedOpaquePixels, 0);
    assert.equal(row.crossedVisiblePixels, 0);
    assert.equal(row.visualReview.manuallyInspected, true);
    if (row.alphaOwnership) {
      assert.equal(row.alphaOwnership.nativeRowRgbaSha256Before, row.alphaOwnership.nativeRowRgbaSha256After);
      assert.equal(row.alphaOwnership.nativePixelsConserved, true);
    }
  }
}
const ledge = registry.entries.find(entry => entry.id === 'goku-ledge');
const { data, info } = await sharp(path.join(root, 'public', ledge.sheet)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const checks = [];
for (const state of ['ledgeCatch', 'ledgeHang', 'ledgeClimb']) {
  for (const point of ledge.normalization.contactAnchorMeasurements[state]) {
    const row = ledge.states[state].row;
    let visiblePalmPixels = 0, skinPalmPixels = 0, blueWristNearbyPixels = 0;
    for (let dy = -24; dy <= 24; dy++) for (let dx = -24; dx <= 24; dx++) {
      const x = point.x + dx, y = point.y + dy;
      if (x < 0 || y < 0 || x >= 256 || y >= 256) continue;
      const at = ((row * 256 + y) * info.width + point.frame * 256 + x) * 4;
      const [r, g, b, a] = data.subarray(at, at + 4);
      if (a <= 24) continue;
      if (Math.abs(dx) <= 4 && Math.abs(dy) <= 4) {
        visiblePalmPixels++;
        if (r > 110 && g > 55 && b < 190 && r > g * 1.05 && r > b * 1.2) skinPalmPixels++;
      }
      if (b > 45 && b > r * 1.25 && b > g * 0.8) blueWristNearbyPixels++;
    }
    assert.ok(visiblePalmPixels >= 55, `${state}/${point.frame}: anchor must be on opaque palm artwork`);
    assert.ok(skinPalmPixels >= 20, `${state}/${point.frame}: native skin must be visible in palm ROI`);
    assert.ok(blueWristNearbyPixels >= 8, `${state}/${point.frame}: native blue wrist must be near the measured palm`);
    assert.equal(point.normalizedX, point.x / 256);
    assert.equal(point.normalizedY, point.y / 256);
    checks.push({ state, frame: point.frame, x: point.x, y: point.y, normalizedX: point.normalizedX, normalizedY: point.normalizedY, contact: point.contact,
      palmRoi: { radius: 4, visiblePixels: visiblePalmPixels, skinPixels: skinPalmPixels },
      wristRoi: { radius: 24, bluePixels: blueWristNearbyPixels }, passed: true });
  }
}
assert.equal(checks.length, 12);
const pixelReview = { date: '2026-10-18', sheet: ledge.sheet, sha256: ledge.sha256,
  method: 'Manual visual palm selection followed by independent 9×9 opaque/skin ROI and 49×49 nearby blue-wrist pixel checks. Color thresholds verify pixel location only; they do not certify canonical anatomy or source-game fidelity.',
  contactMeaning: 'Inferred project edge support. Catch frame 0 is a reaching palm with contact false. Drop/jump released frames carry the former edge reference with contact false.',
  requiredStates: 3, requiredFrames: 12, allPassed: true, checks };
await fs.writeFile(path.join(root, docs, 'grip-pixel-checks.json'), `${JSON.stringify(pixelReview, null, 2)}\n`);
const sourceFiles = [
  ...provenance.nativeSources.map(source => source.path),
  ...provenance.references.map(reference => reference.path),
  `${docs}/native-prompts.json`, `${docs}/goku-missing-and-catch-correction-prompt.json`, `${docs}/resolved-abilities-before-generation.json`
];
const files = [];
for (const file of sourceFiles) {
  const bytes = await fs.readFile(path.join(root, file));
  const recorded = [...provenance.nativeSources, ...provenance.references].find(item => item.path === file);
  if (recorded) assert.equal(hash(bytes), recorded.sha256);
  files.push({ path: file, bytes: bytes.length, sha256: hash(bytes) });
}
await fs.writeFile(path.join(root, docs, 'source-archive-manifest.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-18', nativeGenerations: 4, model: null, generationId: null, canonicalAnimationVerified: false, files }, null, 2)}\n`);
console.log(JSON.stringify({ states: 21, nativePoses: 84, stableAtlases: 3, requiredPalmPixelChecks: checks.length, archivedFiles: files.length, passed: true }));
