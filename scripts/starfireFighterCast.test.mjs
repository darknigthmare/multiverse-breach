import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import test from 'node:test';

register('./sourceSceneTestLoader.mjs', import.meta.url);

const { EngineFighter } = await import('../src/game/engineFighter.js');
const { getHeroById } = await import('../src/game/heroes.js');
const { getStarfireFighterCastAtlas, getStarfireFighterCastFrame, getStarfireFighterProjectilePoint } =
  await import('../src/game/combat/starfireFighterCast.js');
const { drawStarfireFighterCast } = await import('../src/game/renderer.js');

const noop = () => {};
const targetHero = { id: 'training-target', name: 'Training', universe: 'Test', weaponType: 'melee',
  stats: { hp: 1000, atk: 18, def: 8, spd: 7 }, simple: { name: 'Training strike', type: 'melee', dmg: 1 } };
const hero = getHeroById('starfire_tt');
const mount = (side, source = hero) => {
  const engine = new EngineFighter(1100, 650, side === 'player' ? [source] : [targetHero],
    side === 'cpu' ? [source] : [targetHero], { add: noop }, noop, noop, { opponentControl: 'p2' });
  engine.countdown = 0;
  const actor = engine.getActive(side), target = engine.getOpponent(side);
  const direction = side === 'player' ? 1 : -1;
  actor.x = side === 'player' ? 280 : 820;
  target.x = actor.x + direction * 160;
  actor.meter = 100;
  return { engine, actor, target, direction };
};

for (const [side, command, expected] of [
  ['player', 'light', 'Green Starbolt'], ['cpu', 'super', 'Green Starbolt Volley']
]) test(`Starfire's ${command} draws its existing cast and lands through the real ${side} projectile`, () => {
  const { engine, actor, target, direction } = mount(side);
  try {
    assert.equal(engine.triggerSideAction(side, command), true);
    const action = actor.action;
    assert.equal(action.identity.name, expected);
    const beforeHp = target.currentHp;
    const pose = reduced => {
      const { row, col } = getStarfireFighterCastFrame(actor, reduced);
      return [row, col];
    };
    assert.deepEqual(pose(false), [1, 0]);
    engine.updateActions(action.hitAt * 0.75);
    assert.deepEqual(pose(false), [2, 1]);
    assert.deepEqual(pose(true), [1, 0]);
    assert.equal(engine.projectiles.length, 0);
    assert.equal(target.currentHp, beforeHp);
    engine.updateActions(action.hitAt * 0.25);
    assert.deepEqual(pose(false), [2, 2]);
    assert.deepEqual(pose(true), [2, 2]);
    assert.equal(engine.projectiles.length, 1);
    const projectile = engine.projectiles[0];
    assert.equal(projectile.canonParticleType, 'starbolt');
    assert.deepEqual([projectile.x, projectile.y], [actor.x + direction * 58, actor.y - 64]);
    assert.deepEqual(getStarfireFighterProjectilePoint(projectile), {
      x: Math.round(actor.x) + 83 * 142 / 256 * direction,
      y: Math.round(actor.y + 71 - 244 * 142 / 256) + 81 * 142 / 256 - 71
    });
    assert.equal(target.currentHp, beforeHp);
    for (let i = 0; i < 4; i++) engine.updateProjectiles(1 / 60);
    const flight = getStarfireFighterProjectilePoint(projectile);
    assert.ok(flight.y < projectile.y);
    assert.equal(target.currentHp, beforeHp);
    for (let i = 0; i < 25; i++) engine.updateProjectiles(1 / 60);
    assert.ok(target.currentHp < beforeHp);
    assert.equal(engine.projectiles.length, 0);
    engine.updateActions((action.duration - action.hitAt) * 0.8);
    assert.deepEqual(pose(false), [3, 3]);
    assert.deepEqual(pose(true), [3, 2]);
    engine.updateActions(action.duration);
    assert.equal(getStarfireFighterCastFrame(actor), null);
  } finally { engine.dispose(); }
});

test('the cast remains scoped to two actions and the exact original television incarnation', () => {
  const { engine, actor } = mount('player');
  try {
    const asset = getStarfireFighterCastAtlas(actor);
    assert.equal(asset.id, 'starfire_tt-wave16');
    const bytes = readFileSync(new URL(`../public${asset.sheet}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
    assert.equal(engine.triggerSideAction('player', 'heavy'), true);
    assert.equal(actor.action.identity.name, 'Tamaranean Flight Kick');
    assert.equal(getStarfireFighterCastFrame(actor), null);
    assert.equal(getStarfireFighterCastAtlas({ ...actor, incarnation: 'Teen Titans Go!' }), null);
    assert.equal(getStarfireFighterCastAtlas({ ...actor, sourceHeroId: actor.id, sourceId: 'raven_tt' }), null);
    assert.equal(getStarfireFighterCastAtlas({ ...actor, weaponType: 'gun' }), null);
  } finally { engine.dispose(); }
});

test('the Cast Canvas projects the reviewed full cell at the fixed baseline', () => {
  const { engine, actor } = mount('player');
  const nativeImage = globalThis.Image;
  const actions = [];
  globalThis.Image = class {
    complete = true;
    naturalWidth = 2048;
    naturalHeight = 1024;
    set src(value) { actions.push(['load', value]); this.onload(); }
  };
  const ctx = new Proxy({ globalAlpha: 1 }, { get(target, key) {
    return key in target ? target[key] : (...args) => actions.push([key, ...args]);
  } });
  try {
    assert.equal(drawStarfireFighterCast(ctx, actor, 142, false), false);
    assert.deepEqual(actions, []);
    assert.equal(engine.triggerSideAction('player', 'light'), true);
    engine.updateActions(actor.action.hitAt);
    assert.equal(drawStarfireFighterCast(ctx, actor, 142, false), true);
    const draw = actions.find(item => item[0] === 'drawImage');
    assert.deepEqual(draw.slice(2), [1024, 512, 512, 256, -142, -71, 284, 142]);
    const clipping = actions.find(item => item[0] === 'rect');
    assert.deepEqual(clipping, ['rect', Math.round(actor.x) - 142,
      Math.round(actor.y + 71 - 244 * 142 / 256) - 71, 352 * 142 / 256, 142]);
    assert.equal(actions.filter(item => item[0] === 'load').length, 1);
  } finally {
    if (nativeImage === undefined) delete globalThis.Image;
    else globalThis.Image = nativeImage;
    engine.dispose();
  }
});
