import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';

import { getBossesForUniverse, getWorldBossForUniverse } from '../src/game/enemies.js';
import { preserveEnemySpriteIdentity } from '../src/game/enemySpriteIdentity.js';
import { getEnemySpriteSheetSrc, getEnemySpriteSheetSources, getSpriteFrameForLayout, getSpriteSheetLayout } from '../src/game/spriteAssets.js';

const kraken = getWorldBossForUniverse('The Crownless Sea');
const phare = getBossesForUniverse('The Drowned Testament').find(enemy => enemy.id === 'drowned_testament:le_phare_qui_regarde');
const spriteCases = [
  {
    actor: kraken,
    sheet: '/sprites/generated/bosses/the-crownless-sea/kraken-sans-couronne',
    baseline: 183,
    visibleBottom: 151,
    stillSha: '933fc19f38eee5b72d3aed3c5d25bbee365ed924837562a8ff8625c15caeb946',
  },
  {
    actor: phare,
    sheet: '/sprites/generated/bosses/the-drowned-testament/le-phare-qui-regarde',
    baseline: 182,
    visibleBottom: 177,
    stillSha: 'b807f0f9bafde8cdf20c67fbb660eac6e940ee4bb3931e8743a16054947ed88c',
  },
];
const states = ['idle', 'run', 'attack', 'hit'];
const url = src => new URL('../public' + src, import.meta.url);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const cellSize = 192;

for (const { actor, sheet, baseline, visibleBottom, stillSha } of spriteCases) {
  const atlas = sheet + '-animated.png';
  const still = sheet + '.png';
  test(actor.name + ' selects its atlas and keeps the exact static image as fallback', async () => {
    assert.deepEqual(getEnemySpriteSheetSources(actor), [atlas, still]);
    const projected = { ...preserveEnemySpriteIdentity(actor), name: 'Echo', universe: 'Nexus de Convergence' };
    assert.deepEqual(getEnemySpriteSheetSources(projected), [atlas, still]);
    for (const change of [{ id: 'foreign' }, { name: 'Echo' }, { weapon: 'foreign' }, { universe: 'Nexus de Convergence' }]) {
      assert.notEqual(getEnemySpriteSheetSrc({ ...actor, ...change }), atlas);
    }
    for (const explicit of [still, '/sprites/explicitly-equipped.png']) {
      assert.deepEqual(getEnemySpriteSheetSources({ ...actor, spriteSource: explicit }), [explicit]);
    }
    const layout = getSpriteSheetLayout(still);
    assert.deepEqual([layout.columns, layout.rows], [1, 1]);
    assert.equal(hash(await readFile(url(still))), stillSha);
  });

  test(actor.name + ' reads sixteen distinct padded cells with a stable baseline', async () => {
    const path = url(atlas).pathname;
    const { width, height, hasAlpha } = await sharp(path).metadata();
    assert.deepEqual([width, height, hasAlpha], [768, 768, true]);
    const layout = getSpriteSheetLayout(atlas);
    assert.deepEqual([layout.columns, layout.rows, layout.baseline], [4, 4, baseline]);
    for (const [state, row] of [['special', 2], ['support', 0], ['defense', 0], ['dead', 3]]) {
      assert.equal(getSpriteFrameForLayout(state, 0, layout).row, row);
    }
    const hashes = new Set();
    for (const [row, state] of states.entries()) for (let col = 0; col < 4; col++) {
      assert.deepEqual(getSpriteFrameForLayout(state, col * 10, layout), { row, col, trim: null });
      const pixels = await sharp(path).extract({ left: col * cellSize, top: row * cellSize, width: cellSize, height: cellSize }).ensureAlpha().raw().toBuffer();
      let lastVisibleRow = -1;
      let visiblePixels = 0;
      for (let y = 0; y < cellSize; y++) for (let x = 0; x < cellSize; x++) {
        if (pixels[(y * cellSize + x) * 4 + 3] < 48) continue;
        lastVisibleRow = y;
        visiblePixels++;
        assert.ok(x >= 4 && x < cellSize - 4 && y >= 4 && y < cellSize - 4);
      }
      assert.equal(lastVisibleRow + 1, visibleBottom);
      assert.ok(visiblePixels > 11000 && visiblePixels < 17000);
      hashes.add(hash(pixels));
    }
    assert.equal(hashes.size, 16);
  });
}

test('the lighthouse beam expands across its attack row without appearing on the other rows', async () => {
  const path = url(spriteCases[1].sheet + '-animated.png').pathname;
  const glowByRow = [];
  for (let row = 0; row < 4; row++) {
    const counts = [];
    for (let col = 0; col < 4; col++) {
      // The lens is near x=96. Sample its outer beam, beyond the turret.
      const rgba = await sharp(path).extract({ left: col * cellSize + 104, top: row * cellSize + 20, width: 64, height: 40 }).ensureAlpha().raw().toBuffer();
      let count = 0;
      for (let i = 0; i < rgba.length; i += 4) {
        if (rgba[i + 3] >= 48 && rgba[i] >= 70 && rgba[i + 2] >= 115 && rgba[i + 2] >= 1.3 * rgba[i + 1]) count++;
      }
      counts.push(count);
    }
    glowByRow.push(counts);
  }
  for (const row of [0, 1, 3]) assert.ok(Math.max(...glowByRow[row]) < 250);
  const [startup, peakA, peakB, recovery] = glowByRow[2];
  assert.ok(startup > 500 && recovery > 500 && Math.min(peakA, peakB) > Math.max(startup, recovery) * 1.5);
});
