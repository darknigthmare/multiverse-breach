import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { getSpriteSheetLayout, getSpriteFrameForLayout } from '../src/game/spriteAssets.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = await fs.realpath(path.join(root, 'public'));
const manifestPath = process.argv[2];
assert(manifestPath, 'Usage: node scripts/auditReferencedStaticCharacters.mjs MANIFEST');
const manifest = JSON.parse(await fs.readFile(path.resolve(root, manifestPath), 'utf8'));
assert.equal(manifest.schemaVersion, 1);
assert(manifest.entries?.length > 0);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const publicFile = async output => {
  assert(/^\/(sprites|images)\//.test(output) && !output.includes('..') && !output.includes('\\'));
  const requested = path.join(publicRoot, output);
  const actual = await fs.realpath(requested);
  assert(actual.startsWith(publicRoot + path.sep), 'Public path escapes its root');
  assert.equal((await fs.lstat(requested)).isSymbolicLink(), false);
  return fs.readFile(actual);
};
const outputs = new Set();
for (const entry of manifest.entries) {
  assert(!outputs.has(entry.output), 'Duplicate static image');
  outputs.add(entry.output);
  assert.equal(entry.canonicalFidelityApproved, false);
  assert.equal(entry.visualReview.status, 'close-to-reference');
  assert.deepEqual(entry.layout, { columns: 1, rows: 1, frameCount: 1, animated: false });
  assert.equal(entry.animationStatus, 'pending');
  assert.equal(entry.privateEvidence.publiclyAvailable, false);
  assert(/^[a-f0-9]{64}$/.test(entry.privateEvidence.sha256));
  const image = await publicFile(entry.output);
  assert.equal(digest(image), entry.image.sha256);
  assert.equal(image.length, entry.image.bytes);
  const reference = await publicFile(entry.reference.output);
  assert.equal(digest(reference), entry.reference.sha256);
  const metadata = await sharp(image).metadata();
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1024);
  assert.equal(metadata.channels, 4);
  assert(!metadata.pages || metadata.pages === 1);
  const { data, info } = await sharp(image).raw().toBuffer({ resolveWithObject: true });
  let guard = Infinity, visible = 0, transparent = 0;
  for (let pixel = 0; pixel < data.length / 4; pixel++) {
    const alpha = data[pixel * 4 + 3];
    if (alpha === 0) transparent++;
    if (alpha <= 12) continue;
    visible++;
    const x = pixel % info.width, y = Math.floor(pixel / info.width);
    guard = Math.min(guard, x, y, info.width - 1 - x, info.height - 1 - y);
  }
  assert(visible > 0 && transparent > 0 && guard >= 12, 'Static figure empty or lacks padding');
  assert.equal(guard, entry.processing.outputGuard);
  assert.equal(visible, entry.processing.visiblePixels);
  assert(entry.processing.sourceGuard >= 2);
  assert.equal(entry.processing.artworkSynthesized, false);
  const layout = getSpriteSheetLayout(entry.output);
  assert.equal(layout.columns, 1);
  assert.equal(layout.rows, 1);
  for (const state of ['idle', 'run', 'attack', 'defense', 'support', 'special', 'hit', 'dead']) {
    for (const time of [0, 10, 20, 30, 1000]) {
      const frame = getSpriteFrameForLayout(state, time, layout);
      assert.equal(frame.col, 0);
      assert.equal(frame.row, 0);
      assert.equal(frame.trim, null);
    }
  }
}
console.log(JSON.stringify({ passed: true, staticCharacters: outputs.size, animationsPending: outputs.size, canonicalFidelityApproved: false }));
