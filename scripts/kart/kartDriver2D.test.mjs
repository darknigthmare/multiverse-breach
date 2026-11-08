import assert from 'node:assert/strict';
import test from 'node:test';
import { EngineRace } from '../../src/game/engineRace.js';
import { getKartForHero } from '../../src/game/kart/kartRoster.js';
import { buildKartMesh } from '../../src/game/kart/kartModel.js';
import { getKartDriverBustBounds, getKartDriver2DPlacement } from '../../src/game/kart/kartDriver2D.js';
import { rasterKartFrame } from './buildKartAssets.mjs';

globalThis.Image = class { complete = false; naturalWidth = 0; };

const paddedCharacter = () => {
  const width = 314, height = 157, pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 7; y <= 155; y++) for (let x = 72; x <= 173; x++) pixels[(y * width + x) * 4 + 3] = 255;
  return { width, height, pixels };
};

test('the driver bust is measured from opaque character pixels rather than atlas-cell padding', () => {
  const { pixels, width, height } = paddedCharacter();
  assert.deepEqual(getKartDriverBustBounds(pixels, width, height), { x: 72, y: 7, width: 102, height: 101 });
  assert.deepEqual(getKartDriverBustBounds(pixels, width, height, 1), { x: 72, y: 7, width: 102, height: 149 });
  assert.equal(getKartDriverBustBounds(new Uint8ClampedArray(width * height * 4), width, height), null);
});

test('the upper quarter of the driver stays visible above the real kart mesh in all eight atlas views', () => {
  for (const heroId of ['masterchief', 'arca_bastion']) {
    const mesh = buildKartMesh(getKartForHero(heroId));
    for (let direction = 0; direction < 8; direction++) {
      const atlas = rasterKartFrame(mesh, direction);
      const seat = getKartDriver2DPlacement({ width: 102, height: 102 }, 64, 128, 128, 128, direction);
      let headPixels = 0, visibleHeadPixels = 0;
      // The head region of the tight crop must not sit behind an opaque rear
      // panel. Side margins do not count as head pixels in this check.
      for (let y = Math.ceil(seat.y); y < seat.y + seat.height * .25; y++) {
        for (let x = Math.ceil(seat.x + seat.width * .25); x < seat.x + seat.width * .75; x++) {
          headPixels++;
          if (x < 0 || y < 0 || x >= 128 || y >= 128 || atlas[(y * 128 + x) * 4 + 3] < 200) visibleHeadPixels++;
        }
      }
      assert.ok(headPixels > 20);
      assert.ok(visibleHeadPixels / headPixels > .85, `${heroId} view ${direction}: head hidden by chassis`);
      assert.ok(seat.y > -10 && seat.y + seat.height < 128, `${heroId}: keep the bust at the cockpit`);
    }
  }
});

test('the engine caches a correctly identified crop and clears it when disposed', () => {
  const spec = getKartForHero('masterchief');
  const engine = new EngineRace(960, 540, () => {}, undefined, {}, null, spec);
  const fixture = paddedCharacter();
  let reads = 0;
  const ownerDocument = {
    createElement: () => ({
      width: 0, height: 0,
      getContext: () => ({
        drawImage() {},
        getImageData() { reads++; return { data: fixture.pixels }; }
      })
    })
  };
  const source = spec.driverSprite.src;
  const image = { naturalWidth: 1254, naturalHeight: 1254 };
  const first = engine.getCharacterDriverBust(spec, source, image, ownerDocument);
  assert.equal(first.heroId, spec.heroId);
  assert.equal(first.source, source);
  assert.deepEqual([first.width, first.height], [102, 101]);
  assert.equal(engine.getCharacterDriverBust(spec, source, image, ownerDocument), first);
  assert.equal(reads, 1);
  assert.equal(engine.driverBusts.size, 1);
  engine.dispose();
  assert.equal(engine.driverBusts.size, 0);
});
