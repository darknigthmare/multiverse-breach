import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PORTAL_VISUAL_MANIFEST } from '../src/game/visuals/portalVisualCatalog.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const publicRoot = path.join(projectRoot, 'public');
const expectedAtlas = Object.freeze({
  width: 1024,
  height: 256,
  columns: 4,
  rows: 1,
  frames: 4,
  frameWidth: 256,
  frameHeight: 256
});
const allowedRightsClasses = new Set([
  'original',
  'project-original',
  'third-party',
  'cc-by-sa',
  'real-person-persona'
]);
const alphaVisibleThreshold = 16;
const maximumCornerAlpha = 8;
const minimumVisibleRatio = 0.001;
const maximumVisibleRatio = 0.96;
const maximumChromaFringeRatio = 0.001;

const assertText = (value, label) => {
  assert.ok(typeof value === 'string' && value.trim().length > 0, `${label}: missing text`);
};

const assertTextArray = (value, label, { allowEmpty = false } = {}) => {
  assert.ok(Array.isArray(value), `${label}: expected an array`);
  if (!allowEmpty) assert.ok(value.length > 0, `${label}: array must not be empty`);
  for (const [index, item] of value.entries()) {
    assertText(item, `${label}[${index}]`);
  }
};

const resolvePublicFile = (publicPath, label, expectedPattern) => {
  assertText(publicPath, label);
  assert.match(publicPath, expectedPattern, `${label}: invalid public path`);
  assert.equal(path.posix.normalize(publicPath), publicPath, `${label}: path is not normalized`);
  const repositoryPath = path.resolve(publicRoot, ...publicPath.split('/').filter(Boolean));
  const relative = path.relative(publicRoot, repositoryPath);
  assert.ok(
    relative.length > 0 && !relative.startsWith('..') && !path.isAbsolute(relative),
    `${label}: path escapes public/`
  );
  return repositoryPath;
};

const pixelOffset = (info, x, y) => (y * info.width + x) * info.channels;

const alphaAt = (data, info, x, y) => data[pixelOffset(info, x, y) + 3];

const hashFramePixels = (data, info, frameIndex) => {
  const hash = createHash('sha256');
  const startX = frameIndex * expectedAtlas.frameWidth;
  for (let y = 0; y < expectedAtlas.frameHeight; y += 1) {
    const start = pixelOffset(info, startX, y);
    hash.update(data.subarray(start, start + expectedAtlas.frameWidth * info.channels));
  }
  return hash.digest('hex');
};

const auditFramePixels = (data, info, frameIndex, label) => {
  const startX = frameIndex * expectedAtlas.frameWidth;
  let visiblePixels = 0;
  let exactChromaPixels = 0;
  let chromaFringePixels = 0;

  for (let y = 0; y < expectedAtlas.frameHeight; y += 1) {
    for (let localX = 0; localX < expectedAtlas.frameWidth; localX += 1) {
      const x = startX + localX;
      const offset = pixelOffset(info, x, y);
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const alpha = data[offset + 3];
      if (alpha <= alphaVisibleThreshold) continue;
      visiblePixels += 1;
      if (red <= 8 && green >= 248 && blue <= 8) exactChromaPixels += 1;
      if (
        green >= 220
        && green - red >= 140
        && green - blue >= 140
      ) {
        chromaFringePixels += 1;
      }
    }
  }

  const cellPixels = expectedAtlas.frameWidth * expectedAtlas.frameHeight;
  const visibleRatio = visiblePixels / cellPixels;
  const chromaFringeRatio = visiblePixels === 0 ? 0 : chromaFringePixels / visiblePixels;
  assert.ok(
    visibleRatio > minimumVisibleRatio,
    `${label}: frame ${frameIndex} is effectively empty (${visibleRatio.toFixed(6)})`
  );
  assert.ok(
    visibleRatio < maximumVisibleRatio,
    `${label}: frame ${frameIndex} lacks useful transparency (${visibleRatio.toFixed(6)})`
  );
  assert.equal(
    exactChromaPixels,
    0,
    `${label}: frame ${frameIndex} retained exact #00ff00 chroma pixels`
  );
  assert.ok(
    chromaFringeRatio <= maximumChromaFringeRatio,
    `${label}: frame ${frameIndex} retained chroma fringe (${chromaFringeRatio.toFixed(6)})`
  );

  return {
    frame: frameIndex,
    visiblePercent: Number((visibleRatio * 100).toFixed(2)),
    chromaFringePercent: Number((chromaFringeRatio * 100).toFixed(4)),
    pixelSha256: hashFramePixels(data, info, frameIndex)
  };
};

const auditDossier = (dossier, record, label) => {
  assert.equal(dossier.universeKey, record.universe, `${label}: universeKey mismatch`);
  assertText(dossier.universeName, `${label}.universeName`);
  assert.equal(dossier.continuityId, record.continuityId, `${label}: continuityId mismatch`);
  assertText(dossier.installment, `${label}.installment`);
  assertText(dossier.medium, `${label}.medium`);
  assert.ok(allowedRightsClasses.has(dossier.rightsClass), `${label}: invalid rightsClass`);
  assert.equal(dossier.generationAllowed, true, `${label}: generation is not approved`);
  assert.match(dossier.referenceConfidence, /^(medium|high)$/, `${label}: invalid confidence`);
  assertText(dossier.canonicalStage, `${label}.canonicalStage`);
  assertTextArray(dossier.heroAnchors, `${label}.heroAnchors`);
  assertTextArray(dossier.motifs, `${label}.motifs`);
  assertTextArray(dossier.materials, `${label}.materials`);
  assertTextArray(dossier.palette, `${label}.palette`);
  assertTextArray(dossier.mustAvoid, `${label}.mustAvoid`);
  assertTextArray(
    dossier.officialReferenceUrls,
    `${label}.officialReferenceUrls`,
    { allowEmpty: dossier.rightsClass === 'original' || dossier.rightsClass === 'project-original' }
  );
  if (dossier.rightsClass !== 'original' && dossier.rightsClass !== 'project-original') {
    assert.ok(Number.isInteger(dossier.releaseYear), `${label}.releaseYear: expected an integer`);
  }
  assertText(dossier.prompt || dossier.generationPrompt, `${label}.generationPrompt`);

  assert.deepEqual(record.motifs, dossier.motifs, `${label}: motifs drift`);
  assert.deepEqual(record.materials, dossier.materials, `${label}: materials drift`);
  assert.deepEqual(record.palette, dossier.palette, `${label}: palette drift`);
  assert.deepEqual(record.mustAvoid, dossier.mustAvoid, `${label}: mustAvoid drift`);
  assert.deepEqual(
    record.officialReferenceUrls,
    dossier.officialReferenceUrls,
    `${label}: officialReferenceUrls drift`
  );
};

assert.ok(Array.isArray(PORTAL_VISUAL_MANIFEST), 'portal manifest must be an array');
assert.ok(PORTAL_VISUAL_MANIFEST.length >= 4, 'portal manifest must expose the four P3 pilots');

const seenUniverses = new Set();
const seenSheets = new Set();
const reports = [];

for (const [index, record] of PORTAL_VISUAL_MANIFEST.entries()) {
  const label = `portal[${index}]`;
  assertText(record.universe, `${label}.universe`);
  assert.ok(!seenUniverses.has(record.universe), `${label}: duplicate universe`);
  seenUniverses.add(record.universe);
  assertText(record.continuityId, `${label}.continuityId`);
  assert.equal(record.status, 'approved', `${label}: only approved assets belong in the manifest`);

  assert.ok(record.atlas && typeof record.atlas === 'object', `${label}.atlas: missing contract`);
  assert.equal(record.atlas.source, 'openai', `${label}.atlas.source: expected openai`);
  assert.equal(record.atlas.width, expectedAtlas.width, `${label}.atlas.width`);
  assert.equal(record.atlas.height, expectedAtlas.height, `${label}.atlas.height`);
  assert.equal(record.atlas.columns, expectedAtlas.columns, `${label}.atlas.columns`);
  assert.equal(record.atlas.rows, expectedAtlas.rows, `${label}.atlas.rows`);
  assert.equal(record.atlas.frames, expectedAtlas.frames, `${label}.atlas.frames`);
  assert.equal(record.atlas.frameWidth, expectedAtlas.frameWidth, `${label}.atlas.frameWidth`);
  assert.equal(record.atlas.frameHeight, expectedAtlas.frameHeight, `${label}.atlas.frameHeight`);
  assert.equal(record.source, 'openai', `${label}.source: expected openai`);
  assertText(record.promptVersion, `${label}.promptVersion`);
  assertTextArray(record.motifs, `${label}.motifs`);
  assertTextArray(record.materials, `${label}.materials`);
  assertTextArray(record.palette, `${label}.palette`);
  assertTextArray(record.mustAvoid, `${label}.mustAvoid`);
  assertTextArray(
    record.officialReferenceUrls,
    `${label}.officialReferenceUrls`,
    { allowEmpty: true }
  );
  assert.ok(record.review && typeof record.review === 'object', `${label}.review: missing`);
  for (const gate of ['lore', 'composition', 'alpha', 'distinctFrames']) {
    assert.equal(record.review[gate], true, `${label}.review.${gate}: not approved`);
  }
  assert.ok(
    Number.isFinite(Date.parse(record.review.approvedAt)),
    `${label}.review.approvedAt: invalid date`
  );

  const atlasPath = resolvePublicFile(
    record.atlas.sheet,
    `${label}.atlas.sheet`,
    /^\/visuals\/cosmetics\/openai\/universes\/[^/]+\/portal-effects-atlas-p3\.webp$/
  );
  assert.ok(!seenSheets.has(record.atlas.sheet), `${label}: duplicate atlas sheet`);
  seenSheets.add(record.atlas.sheet);
  const dossierPath = resolvePublicFile(
    record.referenceDossier,
    `${label}.referenceDossier`,
    /^\/visuals\/cosmetics\/openai\/universes\/[^/]+\/reference-dossier\.json$/
  );
  assert.equal(
    path.dirname(dossierPath),
    path.dirname(atlasPath),
    `${label}: atlas and dossier must share a directory`
  );

  const dossier = JSON.parse(await readFile(dossierPath, 'utf8'));
  auditDossier(dossier, record, `${label}.dossier`);

  const image = sharp(atlasPath, { failOn: 'error' });
  const imageMetadata = await image.metadata();
  assert.equal(imageMetadata.format, 'webp', `${label}: expected WebP`);
  assert.equal(imageMetadata.width, expectedAtlas.width, `${label}: decoded width`);
  assert.equal(imageMetadata.height, expectedAtlas.height, `${label}: decoded height`);
  assert.equal(imageMetadata.hasAlpha, true, `${label}: alpha channel is required`);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, expectedAtlas.width, `${label}: raw width`);
  assert.equal(info.height, expectedAtlas.height, `${label}: raw height`);
  assert.equal(info.channels, 4, `${label}: expected RGBA pixels`);
  for (const [x, y] of [
    [0, 0],
    [info.width - 1, 0],
    [0, info.height - 1],
    [info.width - 1, info.height - 1]
  ]) {
    assert.ok(
      alphaAt(data, info, x, y) <= maximumCornerAlpha,
      `${label}: atlas corner is not transparent at ${x}:${y}`
    );
  }

  const frameReports = [];
  const frameHashes = new Set();
  for (let frameIndex = 0; frameIndex < expectedAtlas.frames; frameIndex += 1) {
    const frameReport = auditFramePixels(data, info, frameIndex, label);
    frameReports.push(frameReport);
    frameHashes.add(frameReport.pixelSha256);
  }
  assert.equal(frameHashes.size, expectedAtlas.frames, `${label}: frames must have distinct pixels`);
  reports.push({
    universe: record.universe,
    sheet: record.atlas.sheet,
    dossier: record.referenceDossier,
    dimensions: `${info.width}x${info.height}`,
    frames: frameReports
  });
}

console.log(JSON.stringify({
  status: 'ok',
  auditedPortals: reports.length,
  portals: reports
}, null, 2));
