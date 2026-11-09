import assert from 'node:assert/strict';
import { before, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { drawNativeProjectileRegionWave17, registerNativeProjectileRegionRendererWave17 } from '../src/game/combat/nativeProjectileRegionWave17.js';

// Portable admission checks only. Actual decoding, pixels and mirroring are
// verified separately by the standalone Chromium test and runtime matrices.
let atlas, region;
before(async () => {
  const registry = JSON.parse(await readFile('src/game/combat/characterAnimationsWave17PartC.generated.json'));
  const anchors = JSON.parse(await readFile('src/game/combat/nativeSuperAnchorsWave17PartC.generated.json'));
  atlas = registry.entries.find(entry => entry.heroId === 'joe_gomamon');
  region = anchors.joe_gomamon?.projectileRegion;
  assert.ok(atlas && region, 'Actual Joe/Gomamon atlas and reviewed fish rectangle are still pending');
});

test('the admitted three-fish region is bound to the real native PNG and its super release cell', async () => {
  assert.equal(region.reviewed, true); assert.equal(region.newDrawing, false);
  assert.equal(region.kind, 'actual-native-fish-group'); assert.equal(region.fishCount, 3);
  assert.equal(region.phase, 'super'); assert.equal(region.row, 7);
  assert.equal(region.column, 2); assert.equal(region.col, 2); assert.equal(region.coordinateSpace, 'atlas');
  assert.equal(region.sheet, atlas.sheet); assert.equal(region.atlasSha256, atlas.sha256);
  const bytes = await readFile('public' + atlas.sheet), dimensions = await sharp(bytes).metadata();
  assert.equal(createHash('sha256').update(bytes).digest('hex'), region.atlasSha256);
  assert.equal(dimensions.width, 1024); assert.equal(dimensions.height, 2048);
  const { left, top, width, height } = region.rect;
  assert.ok([left, top, width, height].every(Number.isInteger));
  assert.ok(left >= 512 && top >= 1792 && width > 0 && height > 0 && left + width <= 768 && top + height <= 2048);
  const crop = await sharp(bytes).extract(region.rect).ensureAlpha().raw().toBuffer();
  assert.ok(crop.some((alpha, index) => index % 4 === 3 && alpha > 24), 'The reviewed source rectangle is empty');
});

test('only the exact reviewed rectangle reaches the renderer callback, with each committed facing intact', () => {
  const calls = [], context = {}, before = JSON.stringify(region);
  registerNativeProjectileRegionRendererWave17((...args) => { calls.push(args); return true; });
  for (const facing of [1, -1]) assert.equal(drawNativeProjectileRegionWave17(context, region, 200, 250, .5, facing), true);
  assert.equal(calls.length, 2);
  for (const [index, args] of calls.entries()) {
    assert.equal(args[0], context); assert.equal(args[1], region);
    assert.deepEqual(args.slice(2), [200, 250, .5, index ? -1 : 1]);
  }
  assert.equal(JSON.stringify(region), before);
});

test('twenty-three altered source bindings, body crops and invalid projections never reach the renderer', () => {
  let calls = 0;
  registerNativeProjectileRegionRendererWave17(() => { calls++; return true; });
  const variants = [null, { ...region, reviewed: false }, { ...region, reviewed: 'yes' }, { ...region, newDrawing: true },
    { ...region, kind: 'orb' }, { ...region, fishCount: 2 }, { ...region, phase: 'fatality' }, { ...region, row: 6 },
    { ...region, column: 1 }, { ...region, col: 1 }, { ...region, coordinateSpace: 'cell' },
    { ...region, atlasSha256: '0'.repeat(64) }, { ...region, sheet: region.sheet + '.unbound' },
    { ...region, rect: { left: 512, top: 1792, width: 256, height: 256 } },
    { ...region, rect: { ...region.rect, left: 768 } }, { ...region, rect: { ...region.rect, top: 1791 } },
    { ...region, rect: { ...region.rect, width: region.rect.width - 1 } },
    { ...region, rect: { ...region.rect, left: region.rect.left + .25 } }];
  for (const candidate of variants) assert.equal(drawNativeProjectileRegionWave17({}, candidate, 200, 250, .5, 1), false);
  for (const [x, y, scale, facing] of [[NaN, 250, 1, 1], [200, Infinity, 1, 1], [200, 250, 0, 1], [200, 250, NaN, 1], [200, 250, 1, 0]])
    assert.equal(drawNativeProjectileRegionWave17({}, region, x, y, scale, facing), false);
  assert.equal(variants.length + 5, 23); assert.equal(calls, 0);
});

test('an unavailable renderer does not manufacture a replacement projectile', () => {
  registerNativeProjectileRegionRendererWave17(null);
  assert.equal(drawNativeProjectileRegionWave17({}, region, 200, 250, .5, 1), false);
});
