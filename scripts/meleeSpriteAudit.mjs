import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { PLAYER_ANCHOR_MELEE_SHEETS } from '../src/game/melee/meleeAnimationManifest.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reports = [];

for (const [sheetId, publicPath] of Object.entries(PLAYER_ANCHOR_MELEE_SHEETS)) {
  const filePath = path.join(repositoryRoot, 'public', publicPath.replace(/^\//, ''));
  const image = sharp(filePath, { animated: false });
  const metadata = await image.metadata();
  assert.equal(metadata.width, 1024, `${sheetId}: atlas width must be 1024`);
  assert.equal(metadata.height, 1024, `${sheetId}: atlas height must be 1024`);
  assert.equal(metadata.hasAlpha, true, `${sheetId}: atlas must have alpha`);

  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
  let residualGreenPixels = 0;
  let externalBoundaryPixels = 0;
  let internalBoundaryPixels = 0;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const alpha = data[offset + 3];
      if (alpha > 12 && green > 160 && green > red * 1.25 && green > blue * 1.35) residualGreenPixels += 1;
      if (alpha > 12 && (x === 0 || y === 0 || x === 1023 || y === 1023)) externalBoundaryPixels += 1;
      if (alpha > 12 && ([255, 256, 511, 512, 767, 768].includes(x) || [255, 256, 511, 512, 767, 768].includes(y))) {
        internalBoundaryPixels += 1;
      }
    }
  }

  assert.equal(residualGreenPixels, 0, `${sheetId}: chroma-key residue remains`);
  assert.equal(externalBoundaryPixels, 0, `${sheetId}: sprite touches the atlas boundary`);
  assert.equal(internalBoundaryPixels, 0, `${sheetId}: sprite crosses a cell boundary`);

  const cellHashes = [];
  let minimumMargin = 256;
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const left = col * 256;
      const top = row * 256;
      let minX = 256;
      let minY = 256;
      let maxX = -1;
      let maxY = -1;
      let visiblePixels = 0;
      const cellAlpha = Buffer.alloc(256 * 256);
      for (let y = 0; y < 256; y += 1) {
        for (let x = 0; x < 256; x += 1) {
          const alpha = alphaAt(left + x, top + y);
          cellAlpha[y * 256 + x] = alpha;
          if (alpha <= 12) continue;
          visiblePixels += 1;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      assert.ok(visiblePixels > 400, `${sheetId}: cell ${row * 4 + col + 1} is empty`);
      minimumMargin = Math.min(minimumMargin, minX, minY, 255 - maxX, 255 - maxY);
      cellHashes.push(crypto.createHash('sha256').update(cellAlpha).digest('hex'));
    }
  }
  assert.ok(minimumMargin >= 8, `${sheetId}: minimum cell margin ${minimumMargin}px is unsafe`);
  assert.ok(new Set(cellHashes).size >= 12, `${sheetId}: too many duplicate animation cells`);

  reports.push({ sheetId, publicPath, minimumMargin, uniqueCells: new Set(cellHashes).size });
}

console.log(JSON.stringify({
  characterId: 'player_anchor',
  status: 'approved',
  sheets: reports
}, null, 2));
