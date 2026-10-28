import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceMosaicPlayer, resolveMosaicInteraction, isMosaicPositionBlocked } from '../src/game/mosaicCityRuntime.js';

const district = { worldW: 600, worldH: 500 };
const make = () => ({ player: { x: 100, y: 200, speed: 2.35, facing: 1 }, keys: {}, obstacles: [],
  npcs: [{ hero: { id: 'target' }, x: 480, y: 200 }, { hero: { id: 'bystander' }, x: 250, y: 200 }],
  destination: { x: 480, y: 200 }, pendingInteraction: { type: 'npc', id: 'target' } });
function walk(state, beforeStep = () => {}) {
  let traveled = 0;
  for (let i = 0; i < 1200; i++) {
    beforeStep(state, i);
    const previous = { ...state.player };
    traveled += advanceMosaicPlayer(state, district, 1000 / 60);
    assert.ok(Math.hypot(state.player.x - previous.x, state.player.y - previous.y) <= 2.35 + 1e-8, 'no teleport');
    assert.equal(isMosaicPositionBlocked(state.player, state.obstacles), false, 'scenery collision retained');
    for (const npc of state.npcs) assert.ok(Math.hypot(state.player.x - npc.x, state.player.y - npc.y) >= 28 - 1e-8, 'NPC collision retained');
    if (resolveMosaicInteraction(state.player, { npcs: state.npcs }, state.pendingInteraction)) return traveled;
  }
  assert.fail('target not reached by ordinary collision-safe steps');
}

test('automatic approach detours around a bystander instead of stopping against its body', () => {
  const state = make();
  const traveled = walk(state);
  assert.ok(traveled > 322);
  assert.equal(state.pendingInteraction.id, 'target');
  assert.ok(Math.hypot(state.player.x - 480, state.player.y - 200) <= 58);
});

test('approach follows the same walking target rather than its obsolete coordinates', () => {
  const state = make(); state.npcs.splice(1);
  walk(state, (s, i) => { s.npcs[0].y = 200 + Math.sin(i * 0.02) * 80; });
  assert.equal(state.pendingInteraction.id, 'target');
});

test('dynamic routes retain solid scenery and physical NPC collisions together', () => {
  const state = make();
  state.obstacles = [{ id: 'terminal', x: 320, y: 160, w: 40, h: 80 }];
  walk(state);
});

test('manual directions cancel the identity request without silently resuming pursuit', () => {
  const state = make(); state.keys = { arrowdown: true };
  advanceMosaicPlayer(state, district);
  assert.equal(state.pendingInteraction, null); assert.equal(state.destination, null);
  state.keys = {}; const previous = { ...state.player };
  advanceMosaicPlayer(state, district);
  assert.equal(state.player.x, previous.x); assert.equal(state.player.y, previous.y);
});

test('a removed resident cancels pursuit; it cannot retarget an unrelated identity', () => {
  const state = make(); state.npcs = state.npcs.filter(n => n.hero.id !== 'target');
  advanceMosaicPlayer(state, district);
  assert.equal(state.pendingInteraction, null); assert.equal(state.destination, null);
  assert.equal(state.player.x, 100); assert.equal(state.player.y, 200);
});

test('clearing a request for the terminal leaves the player idle after the target moves', () => {
  const state = make(); advanceMosaicPlayer(state, district);
  state.destination = null; state.pendingInteraction = null; state.keys = {};
  const previous = { ...state.player }; state.npcs[0].x -= 100;
  for (let i = 0; i < 60; i++) advanceMosaicPlayer(state, district);
  assert.equal(state.player.x, previous.x); assert.equal(state.player.y, previous.y);
});
