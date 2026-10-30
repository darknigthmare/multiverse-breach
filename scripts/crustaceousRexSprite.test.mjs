import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';
import { LORE_BOSS_OVERRIDES } from '../src/game/loreBossOverrides.js';
import {
  getEnemySpriteSheetSrc,
  getSpriteFrameForLayout,
  getSpriteSheetLayout
} from '../src/game/spriteAssets.js';

const output = '/sprites/generated/bosses/godzilla-the-animated-series/crustaceous-rex.png';
const provenancePath = 'docs/assets/CRUSTACEOUS_REX_STATIC_2026-10-29.json';
const atRoot = path => new URL(`../${path}`, import.meta.url);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const provenance = JSON.parse(await readFile(atRoot(provenancePath), 'utf8'));
const file = atRoot(`public${output}`);
const bytes = await readFile(file);
const metadata = await sharp(bytes, { animated: false, failOn: 'error' }).metadata();
const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
const manifest = JSON.parse(await readFile(atRoot('public/sprites/generated/sprite-manifest.json'), 'utf8'));
const availability = JSON.parse(await readFile(atRoot('public/sprites/generated/sprite-availability.json'), 'utf8'));
const universe = 'Godzilla The Animated Series';
const boss = LORE_BOSS_OVERRIDES[universe].find(entry => entry.name === 'Crustaceous Rex');
const states = ['idle', 'run', 'attack', 'defense', 'support', 'special', 'hit', 'dead'];

test('C-Rex is a real transparent single-frame PNG with recorded generation and reference review', async () => {
  const stat = await lstat(file);
  assert.ok(stat.isFile() && !stat.isSymbolicLink());
  assert.equal(bytes.readUInt32BE(16), 1254);
  assert.equal(bytes.readUInt32BE(20), 1254);
  assert.equal(bytes[24], 8, '8-bit PNG');
  assert.equal(bytes[25], 6, 'RGBA PNG');
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.width, 1254);
  assert.equal(metadata.height, 1254);
  assert.equal(metadata.channels, 4);
  assert.equal(metadata.hasAlpha, true);
  assert.ok((metadata.pages || 1) === 1);
  assert.equal(digest(bytes), provenance.image.sha256);
  assert.equal(bytes.length, provenance.image.bytes);
  assert.equal(provenance.image.width, info.width);
  assert.equal(provenance.image.height, info.height);
  assert.equal(provenance.image.channels, info.channels);
  assert.equal(provenance.output, output);
  assert.equal(provenance.generation.provider, 'OpenAI');
  assert.equal(provenance.generation.interface, 'built-in image_gen');
  assert.equal(digest(provenance.generation.prompt), provenance.generation.promptSha256);
  assert.equal(digest(provenance.generation.initial.prompt), provenance.generation.initial.promptSha256);
  assert.equal(provenance.generation.editTargetSha256, provenance.generation.initial.imageSha256);
  assert.equal(provenance.processing.bytesUnchangedFromGeneration, true);
  assert.equal(provenance.fileAvailable, true);
  assert.equal(provenance.animationStatus, 'pending');
  assert.equal(provenance.layout.animated, false);
  assert.equal(provenance.layout.frameCount, 1);
  assert.equal(provenance.canonicalFidelityApproved, false);
  assert.equal(provenance.visualReview.canonicalFidelityApproved, false);
  assert.equal(provenance.visualReview.exactOneToOneStatus, 'unverified');
  assert.equal(provenance.historicalAnimationLedgerModified, false);
  assert.equal(provenance.referenceImagesRedistributed, false);
});

test('the recorded alpha bounds retain the full silhouette and only negligible fringe is trimmed', () => {
  const bounds = { left: info.width, top: info.height, right: 0, bottom: 0 };
  let visiblePixels = 0;
  let fullyTransparentPixels = 0;
  let maximumAlphaOutsideRenderRectangle = 0;
  const rectangle = provenance.layout.sourceRectangle;
  assert.deepEqual(rectangle, { x: 0, y: 0, width: 1254, height: 1185 });
  assert.equal(provenance.processing.alphaBoundsThreshold, 1);
  for (let y = 0; y < info.height; y += 1) for (let x = 0; x < info.width; x += 1) {
    const alpha = data[(y * info.width + x) * info.channels + 3];
    if (!alpha) fullyTransparentPixels += 1;
    if (x >= rectangle.width || y >= rectangle.height) {
      maximumAlphaOutsideRenderRectangle = Math.max(maximumAlphaOutsideRenderRectangle, alpha);
    }
    if (alpha <= 1) continue;
    visiblePixels += 1;
    bounds.left = Math.min(bounds.left, x);
    bounds.top = Math.min(bounds.top, y);
    bounds.right = Math.max(bounds.right, x + 1);
    bounds.bottom = Math.max(bounds.bottom, y + 1);
  }
  assert.ok(visiblePixels > 0 && fullyTransparentPixels > 0);
  assert.equal(visiblePixels, provenance.processing.visiblePixels);
  assert.equal(fullyTransparentPixels, provenance.processing.fullyTransparentPixels);
  assert.deepEqual(bounds, provenance.processing.visibleAlphaBounds);
  assert.ok(bounds.left >= 12 && bounds.top >= 12);
  assert.ok(info.width - bounds.right >= 12, 'rightmost tentacle has padding');
  assert.equal(rectangle.height - bounds.bottom, 24, 'ground offset remains below all visible feet');
  assert.equal(maximumAlphaOutsideRenderRectangle, provenance.processing.maximumAlphaOutsideRenderRectangle);
  assert.ok(maximumAlphaOutsideRenderRectangle <= 1, 'no meaningful silhouette pixel is excluded');
});

test('the live boss, full catalog and UI index resolve the same reviewed static asset', () => {
  assert.ok(boss);
  assert.equal(boss.output, output);
  assert.equal(getEnemySpriteSheetSrc({ ...boss, universe }), output);
  const matches = manifest.entries.filter(entry => entry.output === output);
  assert.equal(matches.length, 1);
  const entry = matches[0];
  assert.equal(entry.id, provenance.id);
  assert.equal(entry.available, true);
  assert.equal(entry.source, 'openai');
  assert.equal(entry.provenanceStatus, 'recorded-static-imagegen');
  assert.equal(entry.provenanceRecord, provenancePath);
  assert.equal(entry.outputSha256, digest(bytes));
  assert.equal(entry.generationId, provenance.generation.generationId);
  assert.equal(entry.spritePrompt, provenance.generation.prompt);
  assert.equal(entry.referenceUrl, boss.referenceUrl);
  assert.equal(entry.visualAnchor, boss.visualAnchor);
  assert.deepEqual(entry.frame, { width: 1254, height: 1254, columns: 1, rows: ['idle'] });
  assert.equal(entry.frameCount, 1);
  assert.equal(entry.animated, false);
  assert.equal(entry.animationStatus, 'pending');
  assert.equal(entry.canonicalFidelityApproved, false);
  assert.equal(entry.exactOneToOneStatus, 'unverified');
  assert.deepEqual(entry.renderTrim, provenance.layout.trim);
  const indexed = availability.groups.filter(group => group.outputs.includes(output));
  assert.equal(indexed.length, 1);
  assert.equal(indexed[0].source, 'openai');
});

test('every boss state consumes the same whole source image rather than a 4 by 4 atlas cell', () => {
  for (const source of [output, `https://multiverse.test${output}?v=reviewed`]) {
    const layout = getSpriteSheetLayout(source);
    assert.equal(layout.columns, 1);
    assert.equal(layout.rows, 1);
    assert.deepEqual(layout.trim, { bottom: 69 });
    for (const state of states) for (const animTime of [0, 9, 10, 39, 400]) {
      assert.deepEqual(getSpriteFrameForLayout(state, animTime, layout), {
        row: 0, col: 0, trim: { bottom: 69 }
      }, `${state} at ${animTime}`);
    }
  }
});

test('the real generated-sprite draw routine keeps the silhouette grounded at game scales in both facings', async () => {
  const renderer = await readFile(atRoot('src/game/renderer.js'), 'utf8');
  const start = renderer.indexOf('const drawGeneratedSpriteSheet = ');
  const end = renderer.indexOf('export class ParticleSystem', start);
  assert.ok(start >= 0 && end > start, 'real renderer extraction markers');
  const image = {
    currentSrc: `https://multiverse.test${output}`, src: output,
    complete: true, naturalWidth: info.width, naturalHeight: info.height
  };
  // This focused test executes the production function; the browser fixture
  // separately verifies native image decoding and Canvas pixels via drawBoss.
  const draw = new Function('getCachedSpriteSheet', 'getSpriteSheetLayout',
    'getSpriteFrameForLayout', 'drawMirelleItemVfx',
    `${renderer.slice(start, end)}\nreturn drawGeneratedSpriteSheet;`)(
    src => { assert.equal(src, output); return { status: 'ready', image }; },
    getSpriteSheetLayout, getSpriteFrameForLayout, () => {}
  );
  const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
  for (const height of [96, 126, 240]) for (const facing of [-1, 1]) for (const state of states) {
    const calls = [];
    const context = {
      save() {}, restore() {},
      translate: (...args) => calls.push(['translate', ...args]),
      scale: (...args) => calls.push(['scale', ...args]),
      drawImage: (...args) => calls.push(['drawImage', ...args])
    };
    assert.equal(draw(context, 250, 300, { ...boss, universe, state }, 39,
      facing, height, getEnemySpriteSheetSrc, () => assert.fail('already loaded')), 'drawn');
    assert.deepEqual(calls[0], ['translate', 250, 300]);
    assert.deepEqual(calls[1], ['scale', facing, 1]);
    assert.equal(calls.length, 3);
    const [, actualImage, sx, sy, sw, sh, dx, dy, dw, dh] = calls[2];
    assert.equal(actualImage, image);
    assert.deepEqual([sx, sy, sw, sh], [0, 0, 1254, 1185]);
    assert.equal(context.imageSmoothingEnabled, false);
    assert.equal(context.filter, 'none');
    near(dx, -dw / 2);
    near(dw / sw, dh / sh);
    near(dh, height);
    near(dy + provenance.processing.visibleAlphaBounds.bottom * dh / sh, 0);
  }
});
