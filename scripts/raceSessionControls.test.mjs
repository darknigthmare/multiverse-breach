import assert from 'node:assert/strict';
import test from 'node:test';
import { createRaceRunGuard, createRaceTouchState } from '../src/game/raceSessionControls.js';

test('one mounted race accepts its completion only once', () => {
  const run = createRaceRunGuard();
  assert.equal(run.claim(), true);
  assert.equal(run.claim(), false);
  assert.equal(run.isActive(), true, 'result stays rendered until acknowledgement');
});
test('abandoned or failed races cannot report late rewards', () => {
  const run = createRaceRunGuard();
  run.dispose(); run.dispose();
  assert.equal(run.claim(), false);
  assert.equal(run.isActive(), false);
});
test('a restart owns a fresh receipt; an old callback stays invalid', () => {
  const old = createRaceRunGuard();
  const late = () => old.claim();
  old.dispose();
  const fresh = createRaceRunGuard();
  assert.equal(late(), false);
  assert.equal(fresh.claim(), true);
  assert.equal(late(), false);
  assert.equal(fresh.claim(), false);
});
test('held touch controls last until release, not a timed pulse', () => {
  const touch = createRaceTouchState();
  assert.equal(touch.hold(1, 'left'), true);
  assert.deepEqual(touch.snapshot(), { left: true });
  touch.release(1);
  assert.deepEqual(touch.snapshot(), {});
});
test('two thumbs retain independent steering and drift ownership', () => {
  const touch = createRaceTouchState();
  touch.hold(1, 'left'); touch.hold(2, 'space');
  assert.deepEqual(touch.snapshot(), { left: true, space: true });
  touch.release(1);
  assert.deepEqual(touch.snapshot(), { space: true });
});
test('releasing one of two pointers on a key does not clear the other', () => {
  const touch = createRaceTouchState();
  touch.hold(1, 'up'); touch.hold(2, 'up'); touch.release(1);
  assert.deepEqual(touch.snapshot(), { up: true });
  touch.release(2);
  assert.deepEqual(touch.snapshot(), {});
});
test('pointer ownership cannot mutate keyboard state or previous snapshots', () => {
  const keys = { left: true };
  const touch = createRaceTouchState();
  touch.hold(1, 'left'); const before = touch.snapshot();
  touch.release(1);
  assert.deepEqual({ ...keys, ...touch.snapshot() }, { left: true });
  assert.deepEqual(before, { left: true });
});
test('pause, lost focus and unmount can cancel every held pointer safely', () => {
  const touch = createRaceTouchState();
  touch.hold(1, 'left'); touch.hold(2, 'space'); touch.clear();
  touch.release(2); touch.clear();
  assert.deepEqual(touch.snapshot(), {});
  touch.hold(3, 'right');
  assert.deepEqual(touch.snapshot(), { right: true });
});
test('malformed pointer IDs and unknown controls do not create inputs', () => {
  const touch = createRaceTouchState();
  for (const id of [NaN, Infinity, null, '1', 0.5]) assert.equal(touch.hold(id, 'left'), false);
  assert.equal(touch.hold(1, '__proto__'), false);
  assert.deepEqual(touch.snapshot(), {});
});
