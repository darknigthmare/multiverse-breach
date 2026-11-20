import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getBossesForUniverse, getWorldBossForUniverse } from '../src/game/enemies.js';
import { drawOriginalStaticBossMotion } from '../src/game/originalStaticBossMotion.js';
import { getEnemySpriteSheetSrc, getSpriteSheetLayout } from '../src/game/spriteAssets.js';
import { BRIAR_QUEEN } from '../src/game/originalBriarQueenGuard.js';

const oblique = {
  actor: getBossesForUniverse('Ilyr Concordat').find(enemy => enemy.id === 'ilyr_concordat:cuirasse_nul_oblique'),
  path: '/sprites/generated/bosses/ilyr-concordat/cuirasse-nul-oblique.png',
  bytes: 'd8fc3b1c20506f0b246f63b0bf48c11d4a33a713d57bc141eb07a6186256f1dd',
  crops: [[246, 152, 169, 234], [480, 259, 139, 80]],
  hinges: [[[263, 386], [402, 386]], [[480, 339], [599, 309]]],
};
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
  oblique,
];
const worldRect = [0, 0, 126, 126];

function recordingContext() {
  const trace = [];
  const operations = ['save', 'restore', 'translate', 'scale', 'transform', 'rotate', 'beginPath', 'closePath',
    'moveTo', 'lineTo', 'rect', 'clip', 'drawImage'];
  return { trace, ctx: Object.fromEntries(operations.map(name => [name, (...args) => trace.push([name, ...args])])) };
}

for (const { actor, path, bytes, crops } of bosses) {
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
}

for (const { actor, path, crops, crestRoots } of bosses.filter(boss => boss !== oblique)) {
  const image = { src: 'http://localhost' + path, naturalWidth: 1024, naturalHeight: 1024 };
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

test('Oblique deploys its own articulated plates with the accepted RPG guard window', () => {
  const { actor, path, crops, hinges } = oblique;
  const image = { src: 'http://localhost' + path, naturalWidth: 1024, naturalHeight: 1024 };
  function pose(motion, time = 0) {
    const { ctx, trace } = recordingContext();
    const fighter = { ...actor, state: 'idle', ...motion };
    assert.equal(drawOriginalStaticBossMotion(ctx, fighter, image, time, ...worldRect), true);
    assert.deepEqual(trace.filter(([op]) => op === 'drawImage'), [
      ['drawImage', image, 0, 0, 1024, 1024],
      ...crops.map(rect => ['drawImage', image, ...rect, ...rect]),
    ]);
    assert.deepEqual(trace.filter(([op]) => op === 'clip'), [['clip', 'evenodd'], ['clip'], ['clip']]);
    assert.equal(trace.filter(([op]) => op === 'save').length, trace.filter(([op]) => op === 'restore').length);
    const transforms = trace.filter(([op]) => op === 'transform').map(([, ...matrix]) => matrix);
    assert.equal(transforms.length, hinges.length);
    for (const [index, [a, b, c, d, e, f]] of transforms.entries()) {
      for (const [x, y] of hinges[index]) {
        assert.ok(Math.abs(a * x + c * y + e - x) < 1e-9);
        assert.ok(Math.abs(b * x + d * y + f - y) < 1e-9);
      }
    }
    return transforms;
  }

  const anticipation = { state: 'special', actionPending: true, rpgSpecialDurationTicks: 45,
    rpgSpecialImpactProgress: 18 / 45 };
  const rest = pose({ rpgGuardTicks: 0 });
  const charging = pose({ ...anticipation, stateTimer: 33 });
  const deployed = pose({ rpgGuardTicks: 180 });
  const folding = pose({ rpgGuardTicks: 15 });
  assert.notDeepEqual(pose({}, 25), rest, 'the resting tension is subtle live motion');
  assert.deepEqual(pose({ ...anticipation, stateTimer: 45 }), rest);
  assert.deepEqual(pose({ ...anticipation, stateTimer: 33, actionPending: false }), rest);
  assert.deepEqual(pose({ rpgGuardTicks: 30 }, 25), deployed);
  assert.deepEqual(pose({ state: 'defense' }), deployed);
  assert.ok(0 > charging[0][2] && charging[0][2] > deployed[0][2]);
  assert.ok(0 > folding[0][2] && folding[0][2] > deployed[0][2]);
  assert.ok(folding[1][2] > 0 && folding[1][2] < deployed[1][2]);
});

test('the Briar Queen grows three source crowns in place and folds them on the guard clock', () => {
  const actor = getBossesForUniverse(BRIAR_QUEEN.universe).find(enemy => enemy.id === BRIAR_QUEEN.id);
  const image = { src: 'http://localhost' + BRIAR_QUEEN.sheet, naturalWidth: 1024, naturalHeight: 1024 };
  const original = readFileSync(new URL('../public' + BRIAR_QUEEN.sheet, import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'), '7a795b230657eb182c360ab427cd8d41390d7085f8467020610e9c55b9c07315');
  assert.equal(getEnemySpriteSheetSrc(actor), BRIAR_QUEEN.sheet);
  const layout = getSpriteSheetLayout(BRIAR_QUEEN.sheet);
  assert.deepEqual([layout.columns, layout.rows], [1, 1]);
  const cuts = [[80, 386, 245, 298], [582, 32, 284, 264], [709, 394, 243, 269]];
  const hinges = [[[325, 474], [325, 619]], [[790, 296], [630, 296]], [[709, 608], [713, 435]]];
  function pose(motion, time = 0, source = actor, bitmap = image) {
    const { ctx, trace } = recordingContext();
    if (!drawOriginalStaticBossMotion(ctx, { ...source, state: 'idle', ...motion }, bitmap, time, ...worldRect)) {
      assert.deepEqual(trace, []);
      return null;
    }
    assert.deepEqual(trace.filter(([op]) => op === 'drawImage'), [
      ['drawImage', image, 0, 0, 1024, 1024],
      ...cuts.map(rect => ['drawImage', image, ...rect, ...rect])
    ]);
    const matrices = trace.filter(([op]) => op === 'transform').map(([, ...matrix]) => matrix);
    assert.equal(matrices.length, hinges.length);
    assert.deepEqual(trace.filter(([op]) => op === 'clip'), [['clip', 'evenodd'], ['clip'], ['clip'], ['clip']]);
    for (const [index, [a, b, c, d, e, f]] of matrices.entries()) {
      for (const [x, y] of hinges[index]) {
        assert.ok(Math.abs(a * x + c * y + e - x) < 1e-9);
        assert.ok(Math.abs(b * x + d * y + f - y) < 1e-9);
      }
    }
    return matrices;
  }
  const cast = { state: 'special', actionPending: true, rpgBriarGuardPreparing: true,
    rpgSpecialDurationTicks: 45, rpgSpecialImpactProgress: 18 / 45 };
  const guard = { rpgBriarGuardApplied: true, rpgGuardTicks: 179 };
  assert.equal(pose({}), null);
  assert.equal(pose({ rpgGuardTicks: 180 }), null);
  assert.equal(pose({ ...guard, state: 'dead' }), null);
  assert.equal(pose(guard, 0, { ...actor, id: 'other' }), null);
  assert.equal(pose(guard, 0, { ...actor, weapon: 'staff' }), null);
  assert.equal(pose(guard, 0, actor, { ...image, src: 'other.png' }), null);
  assert.equal(pose(guard, 0, actor, { ...image, naturalHeight: 512 }), null);
  assert.equal(pose({ ...cast, stateTimer: 45 }), null);
  assert.equal(pose({ ...cast, stateTimer: 33, actionPending: false }), null);
  const before = pose({ ...cast, stateTimer: 28 });
  const applied = pose(guard);
  const folding = pose({ ...guard, rpgGuardTicks: 18 });
  assert.deepEqual(pose(guard, 30), applied, 'visual progress uses only simulation, including a paused battle');
  assert.notDeepEqual(pose({ ...guard, rpgGuardTicks: 168 }), applied);
  assert.ok(before[0][0] > folding[0][0] && applied[0][0] > before[0][0]);
  assert.ok(before[1][3] > folding[1][3] && applied[1][3] > before[1][3]);
  assert.equal(pose({ ...guard, rpgGuardTicks: 0 }), null);
});
