import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import sharp from 'sharp';
import { getWorldBossForUniverse } from '../src/game/enemies.js';
import { preserveEnemySpriteIdentity } from '../src/game/enemySpriteIdentity.js';
import { drawPachakutiFallback } from '../src/game/pachakutiWorldBossArt.js';
import { getEnemySpriteSheetSrc, getSpriteFrameForLayout, getSpriteSheetLayout } from '../src/game/spriteAssets.js';

const universe = 'Tawantinsuyu: The Split Sun';
const sprite = '/sprites/generated/bosses/tawantinsuyu-the-split-sun/pachakuti-du-soleil-noir.png';

test('the original catalog boss resolves the environmental atlas at its existing identity and gameplay values', () => {
  const boss = getWorldBossForUniverse(universe);
  assert.equal(boss.id, 'tawantinsuyu_split_sun:pachakuti_du_soleil_noir');
  assert.deepEqual([boss.hp, boss.atk, boss.def, boss.spd, boss.weapon], [1550, 34, 18, 3, 'world_power']);
  assert.equal(getEnemySpriteSheetSrc(boss), sprite);
  assert.notEqual(getEnemySpriteSheetSrc({ ...boss, universe: 'Nexus de Convergence' }), sprite);
  assert.notEqual(getEnemySpriteSheetSrc({ ...boss, name: 'Pachakuti' }), sprite);
});

test('the atlas has 16 distinct and unclipped poses on the shared game baseline', async () => {
  const image = readFileSync(new URL(`../public${sprite}`, import.meta.url));
  const raw = await sharp(image, { failOn: 'error' }).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([raw.info.width, raw.info.height, raw.info.channels], [1024, 1024, 4]);
  const layout = getSpriteSheetLayout(sprite);
  assert.deepEqual([layout.columns, layout.rows], [4, 4]);
  const hashes = new Set();
  for (const [row, state] of ['idle', 'run', 'attack', 'hit'].entries()) {
    for (let col = 0; col < 4; col++) {
      const frame = getSpriteFrameForLayout(state, col * 10, layout);
      assert.deepEqual([frame.row, frame.col], [row, col]);
      const data = await sharp(image).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).raw().toBuffer();
      let opaque = 0;
      let clear = 0;
      let bottom = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const alpha = data[(y * 256 + x) * 4 + 3];
        if (alpha === 0) clear++;
        if (alpha >= 64) {
          opaque++;
          bottom = y;
          assert.ok(x > 3 && x < 252 && y > 3 && y < 252, `row ${row}, col ${col}: clipping at ${x}, ${y}`);
        }
      }
      assert.ok(clear > 30000 && opaque > 7000, `row ${row}, col ${col}: bad alpha coverage`);
      assert.equal(bottom, 232);
      hashes.add(createHash('sha256').update(data).digest('hex'));
    }
  }
  assert.equal(hashes.size, 16);
});

test('the outage fallback is scoped to the original event and restores transform and stroke state', () => {
  const boss = getWorldBossForUniverse(universe);
  const events = [];
  const ctx = Object.fromEntries(['save', 'translate', 'scale', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'closePath', 'restore']
    .map(key => [key, (...args) => events.push([key, ...args])]));
  for (const mismatch of [
    { id: 'other:id' },
    { universe: 'Nexus de Convergence' },
    { universe: 'Nexus de Convergence', sourceUniverse: universe },
    { sourceUniverse: 'Nexus de Convergence', spriteSource: sprite },
    { weapon: 'gun' },
  ]) {
    assert.equal(drawPachakutiFallback(ctx, 0, 0, { ...boss, ...mismatch }, 126, -1), false);
  }
  assert.equal(events.length, 0);
  assert.equal(drawPachakutiFallback(ctx, 50, 90, { ...boss, state: 'special' }, 126, -1), true);
  assert.deepEqual(events.slice(0, 3), [['save'], ['translate', 50, 90], ['scale', -1, 1]]);
  assert.deepEqual(events.find(([op]) => op === 'arc'), ['arc', 0, -73, 23, 0, Math.PI * 2]);
  assert.deepEqual(events.at(-1), ['restore']);
  const projected = { ...preserveEnemySpriteIdentity(boss), universe: 'Nexus de Convergence', name: 'Pachakuti Echo' };
  assert.equal(drawPachakutiFallback(ctx, 0, 0, projected, 126, 1), true);
});
