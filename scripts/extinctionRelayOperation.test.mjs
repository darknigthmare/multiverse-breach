import test from 'node:test';
import assert from 'node:assert/strict';
import { createExtinctionRelayOperation, interactExtinctionRelayOperation, tickExtinctionRelayOperation,
  getExtinctionRelayStatus, EXTINCTION_RELAY_REQUIRED_TICKS, EXTINCTION_RELAY_RANGE } from '../src/game/extinctionRelayOperation.js';

const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
function fixture() {
  const item = { id: 'beacon-1', type: 'beacon', wave: 1, wx: -1.7, wy: 6.55, used: false };
  const run = { runId: 'run-one', phase: 'running', t: 12, wave: 1, px: item.wx, py: item.wy,
    hp: 120, ammo: 24, kills: 3, beaconsStabilized: 0, loot: [item], rewards: null };
  const operation = createExtinctionRelayOperation({ enabled: true, runId: run.runId });
  return { item, run, operation };
}
function activated() {
  const setup = fixture();
  return { ...setup, operation: interactExtinctionRelayOperation(setup.operation, setup.run, setup.item).operation };
}
function advance(operation, run, count) {
  let next = operation;
  for (let i = 1; i <= count; i++) next = tickExtinctionRelayOperation(next, { ...run, t: run.t + i });
  return next;
}

test('disabled operation is a strict no-op, without reading legacy state or consuming RNG', t => {
  t.mock.method(Math, 'random', () => { throw new Error('Unexpected random draw'); });
  const unreadable = new Proxy({}, { get() { throw new Error('Disabled operation read gameplay state'); } });
  assert.equal(createExtinctionRelayOperation(), null);
  assert.equal(tickExtinctionRelayOperation(null, unreadable), null);
  const gate = interactExtinctionRelayOperation(null, unreadable, unreadable);
  assert.deepEqual(gate, { operation: null, handled: false, allowCollect: true, reason: 'disabled', feedback: '' });
  assert.equal(getExtinctionRelayStatus(null, 'beacon-1').status, 'disabled');
  for (const mode of ['last_signal', 'infestation', 'hunt', 'unknown']) {
    assert.equal(createExtinctionRelayOperation({ enabled: true, runId: 'same-run', mode }), null);
  }
  for (const enabled of [false, 'true', 1]) assert.equal(createExtinctionRelayOperation({ enabled, runId: 'same-run' }), null);
  assert.equal(createExtinctionRelayOperation({ enabled: true, runId: '' }), null);
});

test('ordinary loot keeps its existing path even when the relay option is enabled', () => {
  const { operation, run } = fixture();
  for (const type of ['normal', 'weapon', 'summon', 'ultimate']) {
    const gate = interactExtinctionRelayOperation(operation, run, { type });
    assert.equal(gate.operation, operation); assert.equal(gate.handled, false); assert.equal(gate.allowCollect, true);
  }
});

test('activation requires the current live beacon, run, tick and existing strict pickup radius', () => {
  const { operation, run, item } = fixture();
  for (const modified of [
    { ...run, runId: 'previous-run' }, { ...run, phase: 'ready' }, { ...run, phase: 'ended' },
    { ...run, paused: true }, { ...run, wave: 2 }, { ...run, loot: [] },
    { ...run, px: item.wx + EXTINCTION_RELAY_RANGE }, { ...run, px: Infinity },
    { ...run, t: -1 }, { ...run, t: 1.5 }, { ...run, t: Infinity }
  ]) {
    const gate = interactExtinctionRelayOperation(operation, modified, item);
    assert.equal(gate.operation, operation); assert.equal(gate.handled, true); assert.equal(gate.allowCollect, false);
  }
  assert.equal(interactExtinctionRelayOperation(operation, run, { ...item }).reason, 'invalid_beacon', 'an arbitrary copy is not the actual loot item');
  assert.equal(interactExtinctionRelayOperation(operation, run, item, { paused: true }).reason, 'paused');
  const inside = interactExtinctionRelayOperation(operation, { ...run, px: item.wx + 1.249 }, item);
  assert.equal(inside.reason, 'started'); assert.equal(inside.allowCollect, false);
});

test('activation does not change loot, counters, HP, ammo, rewards or the previous operation', () => {
  const { operation, run, item } = fixture();
  const before = JSON.stringify(run); freeze(run); freeze(operation);
  const result = interactExtinctionRelayOperation(operation, run, item, { lang: 'en' });
  assert.equal(JSON.stringify(run), before);
  assert.deepEqual(operation.beacons, {});
  assert.equal(result.operation.beacons[item.id].ticks, 0);
  assert.equal(result.operation.beacons[item.id].lastTick, run.t);
  assert.match(result.feedback, /^Synchronization started/);
  assert.equal(interactExtinctionRelayOperation(result.operation, run, item).operation, result.operation);
});

test('synchronization needs exactly 180 distinct active ticks and an explicit final interaction', () => {
  const { operation, run, item } = activated();
  const almost = advance(operation, run, EXTINCTION_RELAY_REQUIRED_TICKS - 1);
  assert.equal(getExtinctionRelayStatus(almost, item.id).status, 'synchronizing');
  assert.equal(getExtinctionRelayStatus(almost, item.id).ticks, 179);
  assert.equal(interactExtinctionRelayOperation(almost, { ...run, t: run.t + 179 }, item).allowCollect, false);
  const ready = tickExtinctionRelayOperation(almost, { ...run, t: run.t + 180 });
  const view = getExtinctionRelayStatus(ready, item.id, 'en');
  assert.equal(view.status, 'ready'); assert.equal(view.progress, 1); assert.equal(view.remainingSeconds, 0);
  assert.match(view.text, /Use E \/ LOOT/);
  assert.equal(item.used, false); assert.equal(run.beaconsStabilized, 0);
  const collected = interactExtinctionRelayOperation(ready, { ...run, t: run.t + 180 }, item);
  assert.equal(collected.allowCollect, true); assert.equal(collected.reason, 'secured');
  assert.equal(collected.operation.activeBeaconId, null);
  assert.equal(getExtinctionRelayStatus(collected.operation, item.id).status, 'secured');
  assert.equal(interactExtinctionRelayOperation(collected.operation, { ...run, t: run.t + 180 }, item).allowCollect, false);
  assert.equal(item.used, false, 'the existing collection path remains the only owner of item mutation');
});

test('a repeated, reversed or skipped tick cannot generate catch-up synchronization', () => {
  const { operation, run, item } = activated();
  assert.equal(tickExtinctionRelayOperation(operation, run), operation);
  assert.equal(tickExtinctionRelayOperation(operation, { ...run, t: run.t - 1 }), operation);
  const later = tickExtinctionRelayOperation(operation, { ...run, t: run.t + 10000 });
  assert.equal(later.beacons[item.id].ticks, 1);
  assert.equal(tickExtinctionRelayOperation(later, { ...run, t: run.t + 10000 }), later);
});

test('leaving the perimeter suspends progress and returning resumes without credit for absent ticks', () => {
  const { operation, run, item } = activated();
  let next = advance(operation, run, 70);
  next = tickExtinctionRelayOperation(next, { ...run, t: run.t + 71, px: item.wx + 1.25 });
  next = tickExtinctionRelayOperation(next, { ...run, t: run.t + 500, px: item.wx + 3 });
  assert.equal(next.beacons[item.id].ticks, 70);
  assert.equal(getExtinctionRelayStatus(next, item.id).remainingSeconds, 2);
  assert.equal(getExtinctionRelayStatus(next, item.id).inRange, false);
  assert.equal(getExtinctionRelayStatus(next, item.id).shortText, 'Reviens dans le périmètre');
  assert.match(getExtinctionRelayStatus(next, item.id, 'en').text, /^Synchronization suspended/);
  next = tickExtinctionRelayOperation(next, { ...run, t: run.t + 501 });
  assert.equal(next.beacons[item.id].ticks, 71);
  assert.equal(getExtinctionRelayStatus(next, item.id).inRange, true);
  assert.equal(getExtinctionRelayStatus(next, item.id, 'en').shortText, 'Hold your position');
  const ready = advance(next, { ...run, t: run.t + 501 }, 109);
  assert.equal(getExtinctionRelayStatus(ready, item.id).status, 'ready');
  assert.equal(interactExtinctionRelayOperation(ready, { ...run, px: item.wx + 2 }, item).reason, 'out_of_range');
});

test('pause, ended run, wrong owner and invalid time leave the operation frozen', () => {
  const { operation, run, item } = activated();
  const progress = freeze(advance(operation, run, 37));
  for (const modified of [
    { ...run, t: run.t + 38, paused: true }, { ...run, t: run.t + 38, phase: 'ended' },
    { ...run, t: run.t + 38, phase: 'ready' }, { ...run, t: run.t + 38, runId: 'next-run' },
    { ...run, t: NaN }, { ...run, t: Infinity }
  ]) assert.equal(tickExtinctionRelayOperation(progress, modified), progress);
  assert.equal(tickExtinctionRelayOperation(progress, { ...run, t: run.t + 38 }, { paused: true }), progress);
  assert.equal(progress.beacons[item.id].ticks, 37);
  assert.equal(tickExtinctionRelayOperation(progress, { ...run, t: run.t + 38 }).beacons[item.id].ticks, 38);
});

test('removed, consumed or previous-wave beacons cannot advance or be collected again', () => {
  const { operation, run, item } = activated();
  for (const modified of [
    { ...run, t: run.t + 1, loot: [] }, { ...run, t: run.t + 1, wave: 2 },
    { ...run, t: run.t + 1, loot: [{ ...item, used: true }] }
  ]) assert.equal(tickExtinctionRelayOperation(operation, modified).beacons[item.id].ticks, 0);
  const used = { ...item, used: true };
  assert.equal(interactExtinctionRelayOperation(operation, { ...run, loot: [used] }, used).allowCollect, false);
});

test('three waves synchronize independent stable IDs and a new run has no carried progress', () => {
  let { operation, run } = fixture();
  for (let wave = 1; wave <= 3; wave++) {
    const item = { id: `beacon-${wave}`, type: 'beacon', wave, wx: 0, wy: 5 };
    run = { ...run, wave, px: 0, py: 5, loot: [item], t: wave * 1000 };
    operation = interactExtinctionRelayOperation(operation, run, item).operation;
    operation = advance(operation, run, 180);
    operation = interactExtinctionRelayOperation(operation, { ...run, t: run.t + 180 }, item).operation;
    assert.equal(getExtinctionRelayStatus(operation, item.id).status, 'secured');
  }
  assert.deepEqual(Object.keys(operation.beacons), ['beacon-1', 'beacon-2', 'beacon-3']);
  const fresh = createExtinctionRelayOperation({ enabled: true, runId: 'fresh-run' });
  assert.deepEqual(fresh.beacons, {});
  assert.equal(fresh.activeBeaconId, null);
  assert.equal(tickExtinctionRelayOperation(operation, { ...run, runId: 'fresh-run', t: run.t + 1 }), operation);
});

test('the entire optional operation is deterministic without native time, timers or random draws', t => {
  t.mock.method(Math, 'random', () => { throw new Error('Unexpected random draw'); });
  t.mock.method(Date, 'now', () => { throw new Error('Unexpected wall clock read'); });
  t.mock.method(globalThis, 'setTimeout', () => { throw new Error('Unexpected timer'); });
  const play = () => {
    const { operation, run, item } = activated();
    return interactExtinctionRelayOperation(advance(operation, run, 180), { ...run, t: run.t + 180 }, item);
  };
  assert.deepEqual(play(), play());
});
