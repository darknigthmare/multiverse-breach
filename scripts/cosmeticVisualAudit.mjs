import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import {
  OPENAI_COSMETIC_VISUALS,
  UNIVERSE_COSMETIC_VISUAL_PACKS
} from '../src/game/cosmeticVisualAssets.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const expectedAssets = Object.freeze({
  hudTheme: { width: 1536, height: 1024, atlas: false },
  profileTitle: { width: 1536, height: 1024, atlas: false },
  profileBanner: { width: 1536, height: 1024, atlas: false },
  portalEffect: { width: 1024, height: 1024, atlas: true },
  koEffect: { width: 1024, height: 1024, atlas: true },
  introPose: { width: 1024, height: 1024, atlas: true },
  victoryPose: { width: 1024, height: 1024, atlas: true }
});

const paeth = (left, above, upperLeft) => {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  if (aboveDistance <= upperLeftDistance) return above;
  return upperLeft;
};

const decodeRgbaPng = (source, label) => {
  assert.ok(source.subarray(0, 8).equals(pngSignature), `${label}: invalid PNG signature`);
  let offset = pngSignature.length;
  let header;
  const idat = [];

  while (offset + 12 <= source.length) {
    const length = source.readUInt32BE(offset);
    const type = source.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    assert.ok(dataEnd + 4 <= source.length, `${label}: malformed ${type} chunk`);
    const data = source.subarray(dataStart, dataEnd);
    if (type === 'IHDR') {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12]
      };
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset = dataEnd + 4;
  }

  assert.ok(header, `${label}: missing IHDR`);
  assert.equal(header.bitDepth, 8, `${label}: expected 8-bit PNG`);
  assert.equal(header.colorType, 6, `${label}: expected RGBA PNG`);
  assert.equal(header.compression, 0, `${label}: unsupported PNG compression`);
  assert.equal(header.filter, 0, `${label}: unsupported PNG filter method`);
  assert.equal(header.interlace, 0, `${label}: interlaced PNG is not supported`);
  assert.ok(idat.length > 0, `${label}: missing IDAT`);

  const bytesPerPixel = 4;
  const stride = header.width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idat));
  assert.equal(
    inflated.length,
    (stride + 1) * header.height,
    `${label}: unexpected decoded byte count`
  );
  const pixels = Buffer.alloc(stride * header.height);
  let inputOffset = 0;

  for (let y = 0; y < header.height; y += 1) {
    const filterType = inflated[inputOffset];
    inputOffset += 1;
    assert.ok(filterType <= 4, `${label}: unsupported row filter ${filterType}`);
    const rowOffset = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const encoded = inflated[inputOffset];
      inputOffset += 1;
      const left = x >= bytesPerPixel ? pixels[rowOffset + x - bytesPerPixel] : 0;
      const above = y > 0 ? pixels[rowOffset + x - stride] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel
        ? pixels[rowOffset + x - stride - bytesPerPixel]
        : 0;
      let predictor = 0;
      if (filterType === 1) predictor = left;
      else if (filterType === 2) predictor = above;
      else if (filterType === 3) predictor = Math.floor((left + above) / 2);
      else if (filterType === 4) predictor = paeth(left, above, upperLeft);
      pixels[rowOffset + x] = (encoded + predictor) & 0xff;
    }
  }

  return { ...header, pixels, stride };
};

const alphaAt = (image, x, y) => image.pixels[y * image.stride + x * 4 + 3];

const getVisibleRatio = (image, bounds = {}) => {
  const startX = bounds.x || 0;
  const startY = bounds.y || 0;
  const width = bounds.width || image.width;
  const height = bounds.height || image.height;
  let visible = 0;
  for (let y = startY; y < startY + height; y += 1) {
    for (let x = startX; x < startX + width; x += 1) {
      if (alphaAt(image, x, y) > 16) visible += 1;
    }
  }
  return visible / (width * height);
};

const hashCell = (image, x, y, width, height) => {
  const hash = createHash('sha256');
  for (let row = y; row < y + height; row += 1) {
    const start = row * image.stride + x * 4;
    hash.update(image.pixels.subarray(start, start + width * 4));
  }
  return hash.digest('hex');
};

const encodedHashes = new Set();
const reports = [];

const decodeWebpHeader = (source, label) => {
  assert.equal(source.toString('ascii', 0, 4), 'RIFF', `${label}: missing RIFF`);
  assert.equal(source.toString('ascii', 8, 12), 'WEBP', `${label}: missing WEBP`);
  let offset = 12;
  while (offset + 8 <= source.length) {
    const type = source.toString('ascii', offset, offset + 4);
    const length = source.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    assert.ok(dataEnd <= source.length, `${label}: malformed ${type} chunk`);
    if (type === 'VP8X') {
      assert.ok(length >= 10, `${label}: malformed VP8X header`);
      const flags = source[dataStart];
      const width = 1
        + source[dataStart + 4]
        + (source[dataStart + 5] << 8)
        + (source[dataStart + 6] << 16);
      const height = 1
        + source[dataStart + 7]
        + (source[dataStart + 8] << 8)
        + (source[dataStart + 9] << 16);
      return { width, height, hasAlpha: Boolean(flags & 0x10) };
    }
    offset = dataEnd + (length % 2);
  }
  throw new Error(`${label}: extended WebP header not found`);
};

for (const [kind, contract] of Object.entries(expectedAssets)) {
  const asset = OPENAI_COSMETIC_VISUALS[kind];
  assert.ok(asset, `${kind}: missing runtime asset contract`);
  assert.equal(asset.source, 'openai', `${kind}: source must be OpenAI`);
  const publicPath = asset.image || asset.sheet;
  assert.match(publicPath, /^\/visuals\/cosmetics\/openai\/.+\.png$/);
  const repositoryPath = path.join(projectRoot, 'public', ...publicPath.split('/').filter(Boolean));
  const source = readFileSync(repositoryPath);
  assert.ok(source.length > 100_000, `${kind}: suspiciously small generated image`);
  encodedHashes.add(createHash('sha256').update(source).digest('hex'));

  const image = decodeRgbaPng(source, kind);
  assert.equal(image.width, contract.width, `${kind}: incorrect width`);
  assert.equal(image.height, contract.height, `${kind}: incorrect height`);
  for (const [x, y] of [
    [0, 0],
    [image.width - 1, 0],
    [0, image.height - 1],
    [image.width - 1, image.height - 1]
  ]) {
    assert.ok(alphaAt(image, x, y) <= 8, `${kind}: chroma-key corner is not transparent`);
  }

  const visibleRatio = getVisibleRatio(image);
  assert.ok(visibleRatio > 0.005, `${kind}: generated image is effectively empty`);
  assert.ok(visibleRatio < 0.92, `${kind}: generated image lacks useful transparency`);

  if (contract.atlas) {
    assert.equal(asset.columns, 4, `${kind}: atlas must expose four columns`);
    assert.equal(asset.rows, 4, `${kind}: atlas must expose four rows`);
    assert.equal(asset.frames, 4, `${kind}: atlas must expose four frames`);
    assert.deepEqual(
      [...new Set(Object.values(asset.rowByStyle))].sort((a, b) => a - b),
      [0, 1, 2, 3],
      `${kind}: style rows must cover the full atlas`
    );
    const frameWidth = image.width / asset.columns;
    const frameHeight = image.height / asset.rows;
    const frameHashes = new Set();
    for (let row = 0; row < asset.rows; row += 1) {
      for (let column = 0; column < asset.columns; column += 1) {
        const bounds = {
          x: column * frameWidth,
          y: row * frameHeight,
          width: frameWidth,
          height: frameHeight
        };
        const frameVisibleRatio = getVisibleRatio(image, bounds);
        assert.ok(
          frameVisibleRatio > 0.001,
          `${kind}: atlas cell ${row}:${column} is empty`
        );
        assert.ok(
          frameVisibleRatio < 0.96,
          `${kind}: atlas cell ${row}:${column} retained its chroma background`
        );
        frameHashes.add(hashCell(image, bounds.x, bounds.y, bounds.width, bounds.height));
      }
    }
    assert.equal(frameHashes.size, 16, `${kind}: atlas cells must be visually distinct`);
  }

  reports.push({
    kind,
    file: path.relative(projectRoot, repositoryPath).replaceAll('\\', '/'),
    dimensions: `${image.width}x${image.height}`,
    visiblePercent: Number((visibleRatio * 100).toFixed(2))
  });
}

assert.equal(encodedHashes.size, 7, 'the seven OpenAI cosmetic masters must be distinct files');

const universePackReports = [];
const expectedUniverseAssets = Object.freeze({
  hudTheme: { width: 1024, heights: [256, 512], atlas: false },
  profileTitle: { width: 1024, height: 256, atlas: false },
  profileBanner: { width: 1024, height: 256, atlas: false },
  portalEffect: { width: 1024, height: 256, atlas: true },
  koEffect: { width: 1024, height: 256, atlas: true },
  introPose: { width: 1024, height: 256, atlas: true },
  victoryPose: { width: 1024, height: 256, atlas: true }
});

for (const [universe, pack] of Object.entries(UNIVERSE_COSMETIC_VISUAL_PACKS)) {
  assert.ok(Object.isFrozen(pack), `${universe}: cosmetic pack must be frozen`);
  const packHashes = new Set();
  const assetReports = [];

  for (const [kind, contract] of Object.entries(expectedUniverseAssets)) {
    const asset = pack[kind];
    assert.ok(asset, `${universe}:${kind}: missing runtime contract`);
    assert.equal(asset.source, 'openai', `${universe}:${kind}: invalid source`);
    const publicPath = asset.image || asset.sheet;
    assert.match(
      publicPath,
      /^\/visuals\/cosmetics\/openai\/universes\/[^/]+\/.+\.webp$/
    );
    const repositoryPath = path.join(
      projectRoot,
      'public',
      ...publicPath.split('/').filter(Boolean)
    );
    const source = readFileSync(repositoryPath);
    assert.ok(source.length > 10_000, `${universe}:${kind}: suspiciously small`);
    const header = decodeWebpHeader(source, `${universe}:${kind}`);
    assert.equal(header.width, contract.width, `${universe}:${kind}: width`);
    if (contract.heights) {
      assert.ok(
        contract.heights.includes(header.height),
        `${universe}:${kind}: unsupported height`
      );
    } else {
      assert.equal(header.height, contract.height, `${universe}:${kind}: height`);
    }
    assert.equal(header.width, asset.width, `${universe}:${kind}: contract width`);
    assert.equal(header.height, asset.height, `${universe}:${kind}: contract height`);
    assert.equal(header.hasAlpha, true, `${universe}:${kind}: alpha is required`);

    const hash = createHash('sha256').update(source).digest('hex');
    packHashes.add(hash);
    if (contract.atlas) {
      assert.equal(asset.columns, 4, `${universe}:${kind}: columns`);
      assert.equal(asset.rows, 1, `${universe}:${kind}: rows`);
      assert.equal(asset.frames, 4, `${universe}:${kind}: frames`);
      assert.equal(asset.row, 0, `${universe}:${kind}: row`);
    }
    assetReports.push({
      kind,
      file: path.relative(projectRoot, repositoryPath).replaceAll('\\', '/'),
      dimensions: `${header.width}x${header.height}`,
      bytes: source.length
    });
  }

  assert.equal(
    packHashes.size,
    7,
    `${universe}: the seven universe variants must be distinct files`
  );
  const hudRepositoryPath = path.join(
    projectRoot,
    'public',
    ...pack.hudTheme.image.split('/').filter(Boolean)
  );
  const dossierPath = path.join(path.dirname(hudRepositoryPath), 'reference-dossier.json');
  const dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
  assert.equal(dossier.universeKey, universe, `${universe}: dossier key mismatch`);
  assert.equal(dossier.generationAllowed, true, `${universe}: generation not approved`);
  assert.match(dossier.referenceConfidence, /^(medium|high)$/);
  assert.match(dossier.mode, /^built-in-imagegen/);
  assert.ok(
    typeof dossier.prompt === 'string'
      || typeof dossier.generationPrompt === 'string',
    `${universe}: final prompt is missing`
  );
  if (dossier.rightsClass === 'third-party') {
    assert.ok(
      Array.isArray(dossier.officialReferenceUrls)
        && dossier.officialReferenceUrls.length > 0,
      `${universe}: official reference URLs are required`
    );
  }
  universePackReports.push({
    universe,
    dossier: path.relative(projectRoot, dossierPath).replaceAll('\\', '/'),
    assets: assetReports
  });
}

console.log(JSON.stringify({
  status: 'ok',
  masters: reports,
  universePacks: universePackReports
}, null, 2));
