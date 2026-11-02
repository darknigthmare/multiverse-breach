import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createProtectionEntityVisualWave16 as create, absorbProtectionEntityVisualWave16 as absorb,
  advanceProtectionEntityVisualWave16 as advance, sampleProtectionEntityVisualWave16 as sample } from '../src/game/combat/protectionEntityRuntimeWave16.js';
const actor = { id: 'p2:chalice:0', sourceId: 'cuphead_ms_chalice', universe: 'Cuphead', currentHp: 91, meter: 0 };
const protection = { kind: 'shield-pal-one-hit', active: true, charges: 1, ownerRuntimeId: actor.id };
test('Shield Pal visual admission preserves source identity and cannot add HP, meter or charges', () => {
  const before = JSON.stringify({ actor, protection }), state = create(actor, protection);
  assert.ok(state); assert.equal(state.ownerRuntimeId, actor.id);
  assert.equal(create({ ...actor, sourceId: 'cuphead_mugman' }, protection), null);
  assert.equal(create({ ...actor, universe: 'Other' }, protection), null);
  assert.equal(create(actor, { ...protection, ownerRuntimeId: 'other' }), null);
  assert.equal(JSON.stringify({ actor, protection }), before);
});
test('Shield Pal waits for the complete native cast, pauses and persists through arbitrarily many guard loops', () => {
  const state = create(actor, protection);
  assert.deepEqual(advance(state, 5, { casterAnimating: true }), state);
  assert.deepEqual(advance(state, 5, { paused: true }), state);
  const arrived = advance(state, .4); assert.equal(arrived.phase, 'guard');
  const guarding = advance(arrived, 100); assert.equal(guarding.phase, 'guard'); assert.equal(guarding.active, true);
  assert.equal(guarding.absorptionCount, 0);
});
test('One accepted absorption exposes all sixteen distinct cells and completes departure exactly once', () => {
  let state = create(actor, protection); const cells = new Set();
  for (let n = 0; n < 70; n++) { state = advance(state, 1 / 60); cells.add(sample(state).index); }
  state = absorb(state); assert.equal(state.absorptionCount, 1); assert.equal(absorb(state), state);
  for (let n = 0; n < 60; n++) { const frame = sample(state); if (frame) cells.add(frame.index); state = advance(state, 1 / 60, { shieldActive: false }); }
  assert.equal(state.active, false); assert.equal(state.phase, 'complete'); assert.equal(sample(state), null);
  assert.deepEqual([...cells].sort((a,b) => a-b), Array.from({ length: 16 }, (_, index) => index));
  assert.equal(absorb(state), state);
});
test('Death removes the visual without completing attacks or fabricating a replacement shield', () => {
  const state = advance(create(actor, protection), .5), dead = advance(state, 1, { ownerAlive: false });
  assert.equal(dead.active, false); assert.equal(dead.endedBy, 'owner-dead'); assert.equal(sample(dead), null);
  assert.equal(dead.absorptionCount, 0); assert.equal(protection.charges, 1);
});
