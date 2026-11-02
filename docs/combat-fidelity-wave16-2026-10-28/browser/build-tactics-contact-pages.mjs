import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { repositoryRoot, waveDirectory, readJson, readBytes, sha, writeJson } from './presentation-input-integrity.mjs';

const preliminary = process.argv.includes('--preliminary');
const reportPath = waveDirectory + '/browser/tactics-engine-' + (preliminary ? 'preliminary' : 'contracts') + '.json';
const report = await readJson(reportPath);
assert.equal(report.passed, true);
assert.equal(report.preliminary, preliminary);
if (!preliminary) assert.equal(report.productionInputsStableDuringRun, true);
const reportSha256 = sha(await readBytes(reportPath));
const base = path.posix.dirname(report.artifacts[0].path);
const destination = base + '/contact-pages';
await fs.mkdir(repositoryRoot + '/' + destination, { recursive: true });
const pages = [];
const sourceCaptures = [];
for (const artifact of report.artifacts) {
  assert.equal(sha(await readBytes(artifact.path)), artifact.sha256);
  const metadata = await sharp(repositoryRoot + '/' + artifact.path).metadata();
  sourceCaptures.push({ ...artifact, width: metadata.width, height: metadata.height });
}
// Whole source captures are packed without editing their pixels. Each tile
// records its source hash and exact placement so a reviewer can trace every
// image viewed through a contact page back to the browser capture.
const groups = [];
const ordinary = sourceCaptures.filter(capture => capture.height <= 1000 && capture.width <= 1400);
for (let index = 0; index < ordinary.length; index += 4) groups.push(ordinary.slice(index, index + 4));
for (const capture of sourceCaptures.filter(capture => !ordinary.includes(capture))) groups.push([capture]);
for (const group of groups) {
  const cellWidth = Math.max(...group.map(capture => capture.width));
  const cellHeight = Math.max(...group.map(capture => capture.height));
  const columns = group.length === 1 ? 1 : 2, rows = Math.ceil(group.length / columns);
  const width = cellWidth * columns, height = cellHeight * rows;
  const tiles = group.map((capture, offset) => ({ sourceCapture: capture.path,
    sourceSha256: capture.sha256, x: offset % columns * cellWidth,
    y: Math.floor(offset / columns) * cellHeight, width: capture.width, height: capture.height }));
  const packed = Buffer.alloc(width * height * 4);
  for (const tile of tiles) {
    const { data, info } = await sharp(await readBytes(tile.sourceCapture)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.channels, 4);
    for (let row = 0; row < tile.height; row++) data.copy(packed,
      ((tile.y + row) * width + tile.x) * 4, row * tile.width * 4, (row + 1) * tile.width * 4);
  }
  const output = await sharp(packed, { raw: { width, height, channels: 4 } }).png().toBuffer();
  const outputPath = destination + '/page-' + pages.length + '.png';
  await fs.writeFile(repositoryRoot + '/' + outputPath, output);
  pages.push({ path: outputPath, sha256: sha(output), width, height, tiles });
}
const result = { schemaVersion: 1, preliminary, createdAt: new Date().toISOString(),
  report: { path: reportPath, sha256: reportSha256 }, sourceCaptures, pages,
  counts: { captures: sourceCaptures.length, pages: pages.length },
  wholeCapturePixelsUnchanged: true, visualReviewClaimed: false,
  notes: 'Packing proof only. This manifest makes no claim that any capture was inspected; author and independent reviews are recorded separately after opening the pages.' };
await writeJson(destination + '/manifest.json', result);
await writeJson(waveDirectory + '/browser/tactics-engine-contact-pages-' + (preliminary ? 'preliminary' : 'final') + '.json', result);
console.log(JSON.stringify({ preliminary, ...result.counts, manifest: destination + '/manifest.json' }));
