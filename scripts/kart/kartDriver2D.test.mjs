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

test('the engine isolates one source cell before cropping each identified bust, caches it, and clears it on dispose', () => {
  for (const heroId of ['masterchief', 'arca_mirelle']) {
    const original = getKartForHero(heroId);
    // A test-only fallback deliberately has a different grid, a nonzero row
    // and column, and pixel trims. It must never reuse the primary layout.
    const fallback = { src: '/test/arca-mirelle-fallback-6x5.png', columns: 6, rows: 5,
      col: 4, row: 3, trim: { left: 3, right: 5, top: 7, bottom: 2 }, upperBodyRatio: .6 };
    const candidates = heroId === 'arca_mirelle'
      ? [...original.driverSprite.candidates, fallback] : original.driverSprite.candidates;
    const spec = { ...original, driverSprite: { ...original.driverSprite, candidates } };
    const engine = new EngineRace(960, 540, () => {}, undefined, {}, null, spec);
    let reads = 0;
    const draws = [];
    const ownerDocument = {
      createElement: () => {
        const canvas = { width: 0, height: 0 };
        canvas.getContext = () => ({
          drawImage(...args) { draws.push({ canvas, args }); },
          getImageData(...args) {
            reads++;
            assert.deepEqual(args, [0, 0, canvas.width, canvas.height]);
            const data = new Uint8ClampedArray(canvas.width * canvas.height * 4);
            canvas.alphaRect = { x: 10, y: 8, width: Math.floor(canvas.width * .4), height: canvas.height - 16 };
            const r = canvas.alphaRect;
            for (let y = r.y; y < r.y + r.height; y++) for (let x = r.x; x < r.x + r.width; x++) data[(y * canvas.width + x) * 4 + 3] = 255;
            return { data };
          }
        });
        return canvas;
      }
    };
    for (const [index, frame] of candidates.entries()) {
      const image = frame === fallback
        ? { naturalWidth: 1800, naturalHeight: 1000 }
        : { naturalWidth: 1254, naturalHeight: 1254 };
      const first = engine.getCharacterDriverBust(spec, frame.src, image, ownerDocument);
      const cellDraw = draws[index * 2], bustDraw = draws[index * 2 + 1];
      assert.equal(draws.length, (index + 1) * 2, 'exactly one cell extraction and one bust crop');
      assert.equal(cellDraw.args[0], image, 'read the requested source image');
      const fw = image.naturalWidth / frame.columns, fh = image.naturalHeight / frame.rows;
      const trim = frame.trim || {};
      const expectedCell = [frame.col * fw + (trim.left || 0), frame.row * fh + (trim.top || 0),
        fw - (trim.left || 0) - (trim.right || 0), fh - (trim.top || 0) - (trim.bottom || 0)];
      assert.deepEqual(cellDraw.args.slice(1, 5), expectedCell, `${heroId}: isolate the requested atlas cell`);
      const [sx, sy, sw, sh] = cellDraw.args.slice(1, 5);
      assert.ok(sx >= frame.col * fw && sx + sw <= (frame.col + 1) * fw + 1e-8);
      assert.ok(sy >= frame.row * fh && sy + sh <= (frame.row + 1) * fh + 1e-8);
      assert.deepEqual(cellDraw.args.slice(5), [0, 0, cellDraw.canvas.width, cellDraw.canvas.height]);
      assert.equal(bustDraw.args[0], cellDraw.canvas, 'crop the isolated cell, never the whole atlas');
      const alpha = cellDraw.canvas.alphaRect;
      const expectedBust = [alpha.x, alpha.y, alpha.width, Math.round(alpha.height * frame.upperBodyRatio)];
      assert.deepEqual(bustDraw.args.slice(1, 5), expectedBust);
      assert.deepEqual(bustDraw.args.slice(5), [0, 0, expectedBust[2], expectedBust[3]]);
      assert.equal(first.image, bustDraw.canvas);
      assert.equal(first.heroId, spec.heroId);
      assert.equal(first.source, frame.src);
      assert.deepEqual([first.width, first.height], expectedBust.slice(2));
      assert.equal(engine.getCharacterDriverBust(spec, frame.src, image, ownerDocument), first);
      assert.equal(reads, index + 1);
      assert.equal(draws.length, (index + 1) * 2, 'cached frames do not reread or redraw an atlas');
      assert.equal(engine.driverBusts.size, index + 1);
    }
    engine.dispose();
    assert.equal(engine.driverBusts.size, 0);
  }
});
