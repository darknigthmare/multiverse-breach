import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { WAVE_17_IDS } from '../src/game/combat/cohortWave17.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';

test('all960 W17 super/finale anchors bind actual visible pixels in the correct current source cells', async () => {
  const anchors = Object.assign({}, ...['A', 'B', 'C'].map(part => JSON.parse(readFileSync(
    new URL(`../src/game/combat/nativeSuperAnchorsWave17Part${part}.generated.json`, import.meta.url)))));
  assert.deepEqual(Object.keys(anchors).sort(), [...WAVE_17_IDS].sort(), 'Missing, extra or withheld anatomical bindings');
  const assets = new Map(getCharacterAnimationAssets().map(entry => [entry.heroId, entry]));
  let count = 0;
  for (const id of WAVE_17_IDS) {
    const asset = assets.get(id);
    assert.ok(asset?.sheet.includes('wave17'), id + ': missing current native32 artwork');
    const bytes = readFileSync(new URL('../public' + asset.sheet, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, id);
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const phase of ['super', 'fatality']) {
      const points = anchors[id][phase], row = asset.phases[phase].row;
      assert.equal(points.length, 4, id + '/' + phase);
      for (const [col, point] of points.entries()) {
        assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y), id + '/' + phase + '/' + col);
        assert.ok(point.x >= 10 && point.x < 246 && point.y >= 10 && point.y < 246, id + ': anchor outside safe source cell');
        let visible = 0;
        for (let y = Math.round(point.y) - 4; y <= Math.round(point.y) + 4; y++)
          for (let x = Math.round(point.x) - 4; x <= Math.round(point.x) + 4; x++)
            if (data[((row * 256 + y) * info.width + col * 256 + x) * 4 + 3] > 24) visible++;
        assert.ok(visible >= 3, id + '/' + phase + '/' + col + ': anchor floats outside its real anatomy/equipment');
        count++;
      }
    }
  }
  assert.equal(count, 960);
});
