import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import sharp from 'sharp';
import { getMonstersForUniverse } from '../src/game/enemies.js';
import { preserveEnemySpriteIdentity } from '../src/game/enemySpriteIdentity.js';
import { getEnemySpriteSheetSrc, getEnemySpriteSheetSources, getSpriteFrameForLayout, getSpriteSheetLayout } from '../src/game/spriteAssets.js';

const universe = 'The Aether Crown';
const base = '/sprites/generated/bosses/the-aether-crown/aether-mite-swarm';
const stationary = `${base}.png`;
const animated = `${base}-animated.png`;
const actor = () => getMonstersForUniverse(universe).find(enemy => enemy.id === 'aether_crown:aether_mite_swarm');

test('the original swarm selects its animated atlas and keeps its static appearance when unavailable', () => {
  const mite = actor();
  assert.deepEqual([mite.hp, mite.atk, mite.def, mite.spd, mite.weapon], [96, 9, 5, 6, 'staff']);
  assert.equal(getEnemySpriteSheetSrc(mite), animated);
  assert.deepEqual(getEnemySpriteSheetSources(mite), [animated, stationary]);
  const projected = { ...preserveEnemySpriteIdentity(mite), name: 'Mite Echo', universe: 'Nexus de Convergence' };
  assert.deepEqual(getEnemySpriteSheetSources(projected), [animated, stationary]);
  for (const change of [{ id: 'unknown' }, { universe: 'Nexus de Convergence' }, { name: 'Different Mite' }, { weapon: 'laser' }]) {
    assert.notEqual(getEnemySpriteSheetSrc({ ...mite, ...change }), animated);
  }
  assert.deepEqual(getEnemySpriteSheetSources({ ...mite, spriteSource: '/sprites/selected.png' }), ['/sprites/selected.png']);
  assert.deepEqual([getSpriteSheetLayout(stationary).columns, getSpriteSheetLayout(stationary).rows], [1, 1]);
});

test('the four game states reach sixteen distinct cells and retain the same hover anchor', async () => {
  const path = new URL(`../public${animated}`, import.meta.url).pathname;
  const dimensions = await sharp(path).metadata();
  assert.deepEqual([dimensions.width, dimensions.height, dimensions.hasAlpha], [1024, 1024, true]);
  const hashes = new Set();
  const layout = getSpriteSheetLayout(animated);
  for (const [row, state] of ['idle', 'run', 'attack', 'hit'].entries()) for (let col = 0; col < 4; col++) {
    const frame = getSpriteFrameForLayout(state, col * 10, layout);
    assert.deepEqual([frame.row, frame.col], [row, col]);
    const pixels = await sharp(path).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).raw().toBuffer();
    let bottom = -1;
    let visible = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      if (pixels[(y * 256 + x) * 4 + 3] < 48) continue;
      bottom = y;
      visible++;
      assert.ok(x >= 4 && x < 252 && y >= 4 && y < 252);
    }
    assert.equal(bottom, 231);
    assert.ok(visible > 4500 && visible < 45000);
    hashes.add(createHash('sha256').update(pixels).digest('hex'));
  }
  assert.equal(hashes.size, 16);
});
