import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getBossesForUniverse } from '../src/game/enemies.js';
import { drawTwelveBellJudgesMotion } from '../src/game/twelveBellJudgesMotion.js';

const universe = 'Meridian Clockwork';
const judge = getBossesForUniverse(universe).find(enemy => enemy.id === 'meridian_clockwork:the_twelve_bell_judges');
const sheet = '/sprites/generated/bosses/meridian-clockwork/the-twelve-bell-judges.png';
const image = { src: 'http://localhost' + sheet, naturalWidth: 1024, naturalHeight: 1024 };
const size = [0, 0, 126, 126];

function canvas() {
  const traces = [];
  const ctx = Object.fromEntries(['save', 'restore', 'translate', 'scale', 'rotate', 'beginPath', 'closePath',
    'moveTo', 'lineTo', 'rect', 'clip', 'drawImage'].map(op => [op, (...args) => traces.push([op, ...args])]));
  return { ctx, traces };
}

test('only the exact boss and archived sheet receive cutout animation', () => {
  const { ctx, traces } = canvas();
  const bytes = readFileSync(new URL(`../public${sheet}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '29bc77091a8feeae6cf908dde3768468267fdca3a214d6f063ba46448ee5c6ec');
  for (const actor of [{ ...judge, id: 'other' }, { ...judge, weapon: 'staff' },
    { ...judge, universe: 'The Aether Crown' }, { ...judge, universe: 'The Aether Crown', sourceUniverse: universe },
    { ...judge, state: 'dead' }]) {
    assert.equal(drawTwelveBellJudgesMotion(ctx, actor, image, 20, ...size), false);
  }
  assert.equal(drawTwelveBellJudgesMotion(ctx, judge, { ...image, naturalHeight: 512 }, 20, ...size), false);
  assert.equal(drawTwelveBellJudgesMotion(ctx, judge, { ...image, src: 'different' }, 20, ...size), false);
  assert.deepEqual(traces, []);
  const projection = { ...judge, universe: 'Nexus de Convergence', sourceUniverse: universe, spriteSource: sheet };
  assert.equal(drawTwelveBellJudgesMotion(ctx, projection, image, 20, ...size), true);
});

test('rest, movement, ringing and impact transform exactly two independent bells', () => {
  const angles = new Set();
  for (const state of ['idle', 'run', 'attack', 'hit']) {
    const { ctx, traces } = canvas();
    assert.equal(drawTwelveBellJudgesMotion(ctx, { ...judge, state }, image, 23, ...size), true);
    const draws = traces.filter(([op]) => op === 'drawImage');
    assert.deepEqual(draws.map(([, original, ...src]) => [original, ...src.slice(0, 4)]), [
      [image, 0, 0, 1024, 1024], [image, 202, 733, 121, 146], [image, 452, 763, 122, 149],
    ]);
    assert.deepEqual(traces.filter(([op]) => op === 'clip'), [['clip', 'evenodd'], ['clip'], ['clip']]);
    assert.equal(traces.filter(([op]) => op === 'save').length, traces.filter(([op]) => op === 'restore').length);
    const radians = traces.filter(([op]) => op === 'rotate').map(([, rad]) => rad);
    assert.equal(radians.length, 2);
    assert.ok(radians.every(rad => Math.abs(rad) <= 0.31));
    angles.add(radians.join(','));
  }
  assert.equal(angles.size, 4);
});
