import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import { getKartForHero } from '../../src/game/kart/kartRoster.js';
import { buildKartMesh, kartColor } from '../../src/game/kart/kartModel.js';
import { applyKartLivery, recolorKartPixels, recolorKartAtlas, getKartRelativeDirection } from '../../src/game/kart/kartLivery.js';
import { exportKartAtlas } from './buildKartAssets.mjs';

const cosmetic = Object.freeze({ id: 'collection-paint-test', name: { fr: 'Livrée de test', en: 'Test livery' }, color: '#E04892', style: 'racer' });
const atlasPixels = async mesh => {
  const atlas = await exportKartAtlas(mesh);
  return sharp(atlas.png).ensureAlpha().raw().toBuffer();
};

test('a collection livery changes paint without replacing the pilot, chassis, motifs or sources', () => {
  const original = getKartForHero('masterchief');
  const originalColor = original.color;
  const painted = applyKartLivery(original, cosmetic);
  assert.equal(painted.color, '#e04892');
  assert.equal(original.color, originalColor);
  assert.equal(painted.livery.sourceColor, original.color);
  assert.equal(painted.livery.id, cosmetic.id);
  assert.equal(painted.heroId, original.heroId);
  for (const property of ['id', 'name', 'bodyStyle', 'signature', 'dimensions', 'driverSprite', 'sprite2D', 'modelAsset', 'accent', 'detailColor', 'statsPolicy']) {
    assert.equal(painted[property], original[property], property);
  }
  const sourceMesh = buildKartMesh(original), paintedMesh = buildKartMesh(painted);
  assert.deepEqual(paintedMesh.positions, sourceMesh.positions);
  assert.deepEqual(paintedMesh.normals, sourceMesh.normals);
  assert.deepEqual(paintedMesh.parts, sourceMesh.parts);
  assert.notDeepEqual(paintedMesh.colors, sourceMesh.colors);
  const expected = new Float32Array(kartColor(painted.color));
  assert.ok(paintedMesh.colors.some((_, index) => index % 4 === 0 && expected.every((value, channel) => paintedMesh.colors[index + channel] === value)));
  const replacement = applyKartLivery(painted, { ...cosmetic, color: '#2fa6d7' });
  assert.equal(replacement.livery.sourceColor, original.color);
  assert.deepEqual(applyKartLivery(replacement, null), original);
  assert.equal(applyKartLivery(original, { color: 'invalid' }), original);
  assert.equal(applyKartLivery(null, cosmetic), null);
});

test('all eight painted atlas views match a fresh render of the actual painted mesh, including shared paint/detail RGB', async () => {
  for (const heroId of ['arca_mirelle', 'masterchief', 'ripley', 'arca_nova', 'arthur_kaamelott', 'player_anchor']) {
    const original = getKartForHero(heroId), painted = applyKartLivery(original, cosmetic);
    const sourceMesh = buildKartMesh(original), paintedMesh = buildKartMesh(painted);
    const source = await atlasPixels(sourceMesh), target = await atlasPixels(paintedMesh);
    const before = Buffer.from(source), actual = recolorKartPixels(source, painted);
    assert.deepEqual(Buffer.from(actual), target, `${heroId}: exact geometry, light and paint parity across eight directions`);
    assert.deepEqual(source, before, `${heroId}: input atlas was not changed`);
    let paintedPixels = 0;
    for (let index = 0; index < source.length; index += 4) {
      assert.equal(actual[index + 3], source[index + 3], `${heroId}: alpha preserved`);
      if (source[index] !== actual[index] || source[index + 1] !== actual[index + 1] || source[index + 2] !== actual[index + 2]) paintedPixels += 1;
    }
    assert.ok(paintedPixels > 1000, `${heroId}: paint is materially visible`);
    for (const part of sourceMesh.parts.filter(part => part.kind === 'wheel')) {
      assert.deepEqual(paintedMesh.colors.subarray(part.start * 4, (part.start + part.count) * 4),
        sourceMesh.colors.subarray(part.start * 4, (part.start + part.count) * 4), `${heroId}: tyres and wheels stay original`);
    }
  }
});

test('no paint returns the original drawable and mismatched art pixels are never recoloured', async () => {
  const source = { width: 1024, height: 128 };
  const original = getKartForHero('masterchief');
  assert.equal(recolorKartAtlas(source, original), source);
  const painted = applyKartLivery(original, cosmetic);
  const pixels = await atlasPixels(buildKartMesh(original));
  // Deliberately unrelated art, with preserved alpha, must not receive paint
  // merely because it is drawn at the same screen coordinates as a mesh face.
  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = 255; pixels[index + 1] = 0; pixels[index + 2] = 255;
  }
  assert.deepEqual(Buffer.from(recolorKartPixels(pixels, painted)), pixels);
  assert.throws(() => recolorKartPixels(new Uint8ClampedArray(4), painted), /eight-view/);
});

test('relative opponent headings select the rear, side and front atlas directions across angle wrap', () => {
  for (const cameraAngle of [0, 1.4, -2.7, 12 * Math.PI]) {
    for (let direction = 0; direction < 8; direction += 1) {
      assert.equal(getKartRelativeDirection(cameraAngle + direction * Math.PI / 4, cameraAngle), direction);
    }
  }
  assert.equal(getKartRelativeDirection(-Math.PI / 4, 0), 7);
  assert.equal(getKartRelativeDirection(Math.PI * 2 - 0.01, 0), 0);
  assert.equal(getKartRelativeDirection(Number.NaN, 0), 0);
});
