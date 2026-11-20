import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getBossesForUniverse, getWorldBossForUniverse } from '../src/game/enemies.js';
import { drawOriginalStaticBossMotion } from '../src/game/originalStaticBossMotion.js';
import { getEnemySpriteSheetSrc, getSpriteSheetLayout } from '../src/game/spriteAssets.js';

const bosses = [
  {
    actor: getBossesForUniverse('The Aether Crown').find(enemy => enemy.id === 'aether_crown:lord_pneuma'),
    path: '/sprites/generated/bosses/the-aether-crown/lord-pneuma.png',
    bytes: '318df8f542c3d45f14874b8d3babb48387d2bcaaec56991856c87b3c4725b4d4',
    crops: [[193, 40, 277, 207]],
  },
  {
    actor: getWorldBossForUniverse('Valedor: The Shattered Crown'),
    path: '/sprites/generated/bosses/valedor-the-shattered-crown/vaelgor-premier-wyrm.png',
    bytes: '83dc428eb64f01746eaacf2730b8463860c35007a6aacd30b51d5a5b152832fe',
    crops: [[494, 46, 79, 109], [261, 406, 92, 121], [757, 546, 100, 130]],
  },
  {
    actor: getBossesForUniverse('Yomi no Kage').find(enemy => enemy.id === 'yomi_no_kage:amas_des_huit_orochi'),
    path: '/sprites/generated/bosses/yomi-no-kage/amas-des-huit-orochi.png',
    bytes: 'e3ab279196e0d168d9256c8bffab2b5280c85ba1dfb2d43d6fdfe850d7dcd5cf',
    crops: [[403, 26, 185, 145], [268, 190, 90, 55], [739, 160, 102, 68]],
    crestRoots: [171, 245, 228],
  },
];
const worldRect = [0, 0, 126, 126];

function recordingContext() {
  const trace = [];
  const operations = ['save', 'restore', 'translate', 'scale', 'transform', 'rotate', 'beginPath', 'closePath',
    'moveTo', 'lineTo', 'rect', 'clip', 'drawImage'];
  return { trace, ctx: Object.fromEntries(operations.map(name => [name, (...args) => trace.push([name, ...args])])) };
}

for (const { actor, path, bytes, crops, crestRoots } of bosses) {
  const image = { src: 'http://localhost' + path, naturalWidth: 1024, naturalHeight: 1024 };
  test(actor.name + ' animates only the exact actor and still serves the original 1×1 bitmap', () => {
    const original = readFileSync(new URL('../public' + path, import.meta.url));
    assert.equal(createHash('sha256').update(original).digest('hex'), bytes);
    assert.equal(getEnemySpriteSheetSrc(actor), path);
    const layout = getSpriteSheetLayout(path);
    assert.deepEqual([layout.columns, layout.rows], [1, 1]);
    const { ctx, trace } = recordingContext();
    for (const changed of [{ id: 'other' }, { name: 'other' }, { weapon: 'other' },
      { universe: 'Nexus de Convergence' }, { sourceUniverse: 'other' }, { state: 'dead' }]) {
      assert.equal(drawOriginalStaticBossMotion(ctx, { ...actor, ...changed }, image, 20, ...worldRect), false);
    }
    assert.equal(drawOriginalStaticBossMotion(ctx, actor, { ...image, src: 'different' }, 20, ...worldRect), false);
    assert.equal(drawOriginalStaticBossMotion(ctx, actor, { ...image, naturalWidth: 512 }, 20, ...worldRect), false);
    assert.deepEqual(trace, []);
    const projected = { ...actor, name: 'Echo', universe: 'Nexus de Convergence', sourceUniverse: actor.universe, spriteSource: path };
    assert.equal(drawOriginalStaticBossMotion(ctx, projected, image, 20, ...worldRect), true);
    for (const side of ['p2', 'cpu-custom']) {
      trace.length = 0;
      const slot = { ...actor, id: `${side}:${actor.id}:0`, sourceId: actor.id };
      assert.equal(drawOriginalStaticBossMotion(ctx, slot, image, 20, ...worldRect), true);
      assert.equal(trace.filter(([op]) => op === 'drawImage').length, 1 + crops.length);
      assert.deepEqual(trace.filter(([op]) => op === 'drawImage').slice(1).map(([, , ...args]) => args.slice(0, 4)), crops);
      trace.length = 0;
      const replacement = { ...slot, id: `${side}:other:0` };
      assert.equal(drawOriginalStaticBossMotion(ctx, replacement, image, 20, ...worldRect), false);
      assert.equal(drawOriginalStaticBossMotion(ctx, { ...slot, sourceId: 'other' }, image, 20, ...worldRect), false);
      assert.deepEqual(trace, []);
    }
  });

  test(actor.name + ' preserves the body and gives the measured source regions distinct state motion', () => {
    const read = (state, time) => {
      const { ctx, trace } = recordingContext();
      assert.equal(drawOriginalStaticBossMotion(ctx, { ...actor, state }, image, time, ...worldRect), true);
      const draws = trace.filter(([op]) => op === 'drawImage');
      assert.deepEqual(draws, [
        ['drawImage', image, 0, 0, 1024, 1024],
        ...crops.map(rect => ['drawImage', image, ...rect, ...rect]),
      ]);
      assert.deepEqual(trace.filter(([op]) => op === 'clip'), [
        ['clip', 'evenodd'], ...crops.map(() => ['clip']),
      ]);
      assert.equal(trace.filter(([op]) => op === 'save').length, trace.filter(([op]) => op === 'restore').length);
      const movement = trace.filter(([op]) => ['transform', 'rotate'].includes(op));
      if (actor.name === 'Lord Pneuma') {
        const [[, xx, xy, yx, yy, dx, dy]] = movement;
        assert.deepEqual([xx, xy, yy, dy], [1, 0, 1, 0]);
        assert.equal(yx * 247 + dx, 0, 'the seam at the stream root is fixed');
        assert.ok(Math.abs(yx) <= 0.43);
      } else if (crestRoots) {
        assert.equal(movement.length, crestRoots.length);
        for (const [index, [op, xx, xy, yx, yy, dx, dy]] of movement.entries()) {
          const root = crestRoots[index];
          assert.equal(op, 'transform');
          assert.deepEqual([xx, xy], [1, 0]);
          assert.ok(Math.abs(yx * root + dx) < 1e-9 && Math.abs(yy * root + dy - root) < 1e-9);
          assert.ok(Math.abs(yx) <= 0.24 && yy >= 0.87 && yy <= 1.13);
        }
      } else {
        assert.equal(movement.length, 3);
        assert.ok(movement.every(([, angle]) => Math.abs(angle) <= 0.24));
      }
      return movement;
    };
    const states = ['idle', 'run', 'attack', 'hit'];
    const signatures = states.map(state => {
      const early = read(state, 13);
      assert.notDeepEqual(early, read(state, 29));
      return JSON.stringify(early);
    });
    assert.equal(new Set(signatures).size, states.length);
    assert.deepEqual(read('special', 13), read('attack', 13));
  });
}
