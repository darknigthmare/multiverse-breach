import test from 'node:test';
import assert from 'node:assert/strict';
import { getContainedCanvasViewport, clientToCombatPoint, clientToCombatDelta, createCombatCompletionGate } from '../src/game/combatViewport.js';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
for (const [name, rect] of [
  ['desktop, with the dedicated toolbar', { left: 0, top: 56, width: 1920, height: 1024 }],
  ['portrait phone with safe margins', { left: 0, top: 56, width: 390, height: 788 }],
  ['short landscape phone', { left: 0, top: 56, width: 852, height: 337 }],
  ['ultrawide desktop', { left: 0, top: 56, width: 3440, height: 1384 }],
  ['embedded view with an offset', { left: 27, top: 94, width: 720, height: 470 }]
]) {
  test(`canvas input preserves arena coordinates: ${name}`, () => {
    const viewport = getContainedCanvasViewport(rect, 1040, 460);
    near(viewport.width / viewport.height, 1040 / 460);
    assert.ok(viewport.width <= rect.width && viewport.height <= rect.height);
    for (const original of [{ x: 0, y: 0 }, { x: 520, y: 230 }, { x: 39, y: 317 }, { x: 1039.5, y: 459.5 }]) {
      const point = clientToCombatPoint(viewport.left + original.x * viewport.scale, viewport.top + original.y * viewport.scale, rect, 1040, 460);
      assert.ok(point);
      near(point.x, original.x); near(point.y, original.y);
    }
    const delta = clientToCombatDelta(31, -42, rect, 1040, 460);
    near(delta.x * viewport.scale, 31); near(delta.y * viewport.scale, -42);
  });
}

test('decorative letterboxes and right/bottom edges cannot select or command a unit', () => {
  const portrait = { left: 0, top: 56, width: 390, height: 788 };
  const tall = getContainedCanvasViewport(portrait, 1040, 460);
  assert.equal(clientToCombatPoint(100, 100, portrait, 1040, 460), null);
  assert.equal(clientToCombatPoint(100, 800, portrait, 1040, 460), null);
  assert.equal(clientToCombatPoint(tall.left + tall.width, tall.top, portrait, 1040, 460), null);
  assert.equal(clientToCombatPoint(tall.left, tall.top + tall.height + 0.01, portrait, 1040, 460), null);
  const wide = { left: 0, top: 0, width: 3440, height: 800 };
  assert.equal(clientToCombatPoint(10, 400, wide, 1040, 460), null);
  assert.equal(clientToCombatPoint(3430, 400, wide, 1040, 460), null);
});

test('a hidden or invalid canvas refuses pointer transforms', () => {
  for (const rect of [null, { left: 0, top: 0, width: 0, height: 200 }, { left: NaN, top: 0, width: 200, height: 200 }]) {
    assert.equal(getContainedCanvasViewport(rect, 1040, 460), null);
    assert.equal(clientToCombatPoint(20, 20, rect, 1040, 460), null);
    assert.equal(clientToCombatDelta(20, 20, rect, 1040, 460), null);
  }
  assert.equal(clientToCombatPoint(NaN, 20, { left: 0, top: 0, width: 1040, height: 460 }, 1040, 460), null);
});

for (const result of ['victory', 'defeat']) {
  test(`${result} is acknowledged once and cannot become a retreat`, () => {
    const gate = createCombatCompletionGate(), events = [];
    const report = { battleSummary: { score: 4200 }, battleItemsUsed: 2 };
    const receive = (...args) => events.push(args);
    assert.equal(gate.complete(result), true);
    assert.equal(gate.complete(result === 'victory' ? 'defeat' : 'victory'), false);
    assert.equal(gate.submit('quit', {}, receive), false);
    assert.equal(gate.submit(result === 'victory' ? 'defeat' : 'victory', {}, receive), false);
    assert.equal(gate.submit(result, report, receive), true);
    assert.equal(gate.submit(result, report, receive), false);
    assert.deepEqual(events, [[result, report]]);
  });
}

test('an unfinished battle can be abandoned once without manufacturing rewards', () => {
  const gate = createCombatCompletionGate(), events = [];
  assert.equal(gate.complete('quit'), false);
  assert.equal(gate.submit('quit', {}, null), false);
  assert.equal(gate.submit('invalid', {}, () => {}), false);
  assert.equal(gate.submit('victory', {}, () => {}), false);
  assert.equal(gate.submit('defeat', {}, () => {}), false);
  assert.equal(gate.submit('quit', {}, result => events.push(result)), true);
  assert.equal(gate.complete('victory'), false);
  assert.equal(gate.submit('quit', {}, result => events.push(result)), false);
  assert.deepEqual(events, ['quit']);
});
