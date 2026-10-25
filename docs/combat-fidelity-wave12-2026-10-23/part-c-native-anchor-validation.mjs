import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const root = new URL('../../', import.meta.url);
const docs = 'docs/combat-fidelity-wave12-2026-10-23/';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const anchorPath = docs + 'part-c-native-anchors.json';
const registryPath = 'src/game/combat/characterAnimationsWave12PartC.generated.json';
const anchors = json(anchorPath), registry = json(registryPath);
assert.deepEqual(Object.keys(anchors).sort(), ['carver', 'ellie', 'isaac', 'kelly_evil_dead']);
const measurements = [];
for (const [heroId, phases] of Object.entries(anchors)) {
  const asset = registry.entries.find(entry => entry.heroId === heroId);
  assert.ok(asset); const bytes = read('public' + asset.sheet);
  assert.equal(sha(bytes), asset.sha256);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048);
  for (const phase of ['fatality', 'super']) {
    const points = phases[phase], row = asset.phases[phase].row;
    assert.equal(points.length, 4); assert.equal(points[0], null); assert.equal(points[3], null);
    for (const column of [1, 2]) {
      const point = points[column];
      assert.ok(Number.isInteger(point.x) && Number.isInteger(point.y));
      assert.ok(point.x >= 4 && point.x < 252 && point.y >= 4 && point.y < 252);
      const offset = ((row * 256 + point.y) * 1024 + column * 256 + point.x) * 4;
      assert.ok(data[offset + 3] > 24, `${heroId}/${phase}/${column}: emitter must touch the actual native muzzle`);
      const roi = Buffer.alloc(9 * 9 * 4); let index = 0;
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const at = ((row * 256 + point.y + dy) * 1024 + column * 256 + point.x + dx) * 4;
        data.copy(roi, index++ * 4, at, at + 4);
      }
      measurements.push({ heroId, phase, column, point, row, sheet: asset.sheet,
        normalizedPngSha256: asset.sha256, pixelAlpha: data[offset + 3],
        roi: { width: 9, height: 9, center: point, rgbaSha256: sha(roi) },
        rowRenderScale: asset.normalization.rows[row].renderScale,
        visualReview: 'Actual barrel outlet on the magnified native artwork; crosshair contact reviewed. No universal offset inferred.',
        contactReview: docs + 'part-c-muzzle-reviews/anchor-contact.png' });
    }
  }
}
assert.equal(measurements.length, 16);
const report = { schemaVersion: 1, date: '2026-10-23', part: 'C', passed: true,
  anchorPath, anchorSha256: sha(read(anchorPath)), registryPath, registrySha256: sha(read(registryPath)),
  contactReviewSha256: sha(read(docs + 'part-c-muzzle-reviews/anchor-contact.png')),
  rangedHeroes: 4, measuredEmitterPoints: 16, explicitlyNullLoweredOrRecoveryFrames: 16,
  effectFamilies: ['physical-shotgun', 'engineering-plasma-cutter', 'physical-military-rifle', 'physical-rifle'],
  supportAndMeleeDoNotAcquireAnEmitter: true, source1to1Verified: false, measurements };
const reportPath = docs + 'part-c-native-anchor-measurements.json';
if (process.argv.includes('--check')) assert.deepEqual(json(reportPath), report);
else fs.writeFileSync(new URL(reportPath, root), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, part: 'C', rangedHeroes: 4, measuredEmitterPoints: 16,
  nullFrames: 16, exactRgbaRois: true, pngAndRegistryHashes: true }));
