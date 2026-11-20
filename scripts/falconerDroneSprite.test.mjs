import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { preserveEnemySpriteIdentity } from '../src/game/enemySpriteIdentity.js';
import { getEnemySpriteSheetSrc, getSpriteFrameForLayout, getSpriteSheetLayout } from '../src/game/spriteAssets.js';

test('the Predators 2010 reconnaissance drone loads its exact sixteen supplied poses', async () => {
  const template = ENEMIES_DB.Predators.monsters.find(enemy => enemy.name === 'Falconer Drone');
  assert.match(template.incarnation, /^Predators \(2010\)/);
  const actor = { ...template, universe: 'Predators' };
  const source = getEnemySpriteSheetSrc(actor);
  const bytes = await readFile(new URL(source));
  const digest = input => createHash('sha256').update(input).digest('hex');
  assert.equal(digest(bytes), '649aee37f1a42fe652ae06217be0a6025e455ca1269b7b3197426650e71bc544');
  const { width, height, hasAlpha } = await sharp(bytes).metadata();
  assert.deepEqual([width, height, hasAlpha], [1024, 1024, true]);
  const layout = getSpriteSheetLayout(source);
  assert.deepEqual([layout.columns, layout.rows], [4, 4]);
  const poses = new Set();
  for (const [row, state] of ['idle', 'run', 'attack', 'hit'].entries()) {
    for (let col = 0; col < 4; col++) {
      const frame = getSpriteFrameForLayout(state, col * 10, layout);
      assert.deepEqual([frame.row, frame.col], [row, col]);
      const cell = await sharp(bytes).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).raw().toBuffer();
      poses.add(digest(cell));
    }
  }
  assert.equal(poses.size, 16);
  const projected = { ...preserveEnemySpriteIdentity(actor), name: 'Echo', universe: 'Nexus de Convergence' };
  assert.equal(getEnemySpriteSheetSrc(projected), source);
  const other = ENEMIES_DB.Predator.monsters.find(enemy => enemy.name === 'Falconer Drone');
  assert.equal(getEnemySpriteSheetSrc({ ...other, universe: 'Predator' }), '/sprites/generated/bosses/predator/falconer-drone.png');
});
