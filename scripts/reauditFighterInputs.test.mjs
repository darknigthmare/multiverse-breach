import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { synchronizeFighterControlOwners as syncOwners } from '../src/game/fighterControlOwnership.js';
let vite, Fighter;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
});
after(async () => { await vite?.close(); });
const hero = id => ({ id, name: id, universe: 'QA', stats: { hp: 300, atk: 10, def: 1, spd: 10 }, simple: { name: 'Strike', dmg: 1 }, special: { name: 'Super', dmg: 2 } });
function fixture() {
  const e = new Fighter(900, 500, [hero('a'), hero('b')], [hero('c'), hero('d')], { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
  e.countdown = 0;
  return e;
}
for (const side of ['player', 'cpu']) for (const control of ['guard', 'down']) {
  test(`${side}: pause immediately releases ${control} without waiting for a frame`, () => {
    const e = fixture();
    try {
      e.setSideInput(side, { [control]: true }); e.update(1 / 60);
      const a = e.getActive(side), field = control === 'guard' ? 'guarding' : 'crouching';
      assert.equal(a[field], true);
      e.setPaused(true);
      assert.equal(a[field], false); assert.deepEqual(e.inputs[side], {});
      e.setPaused(false); e.update(1 / 60);
      assert.equal(a[field], false);
    } finally { e.dispose(); }
  });
}
for (const side of ['player', 'cpu']) {
  test(`${side}: accepted tag drops old held controls and preserves the other player's controls`, () => {
    const e = fixture();
    try {
      const other = side === 'player' ? 'cpu' : 'player';
      e.setSideInput(side, { guard: true, right: true }); e.setSideInput(other, { down: true });
      e.update(1 / 60); const opposite = structuredClone(e.inputs[other]);
      const departing = e.getActive(side), reserve = e.getTeam(side).fighters[1];
      reserve.guarding = true; reserve.crouching = true;
      assert.equal(e.requestTag(side, 1), true);
      assert.deepEqual(e.inputs[side], {}); assert.deepEqual(e.inputs[other], opposite);
      assert.equal(departing.guarding, false); assert.equal(reserve.guarding, false); assert.equal(reserve.crouching, false);
      assert.equal(e.playerInput, e.inputs.player);
    } finally { e.dispose(); }
  });
  test(`${side}: rejected tag keeps controls, actor and cooldown intact`, () => {
    const e = fixture();
    try {
      e.setSideInput(side, { guard: true }); const a = e.getActive(side);
      e.hitStop = 0.07; const input = structuredClone(e.inputs[side]);
      for (const forced of [false, true]) assert.equal(e.requestTag(side, 1, forced), false);
      assert.equal(e.getActive(side), a); assert.deepEqual(e.inputs[side], input);
      assert.equal(e.getTeam(side).tagCooldown, 0);
    } finally { e.dispose(); }
  });
  test(`${side}: UI buffers cannot reapply departing fighter's controls after a native or forced tag`, () => {
    for (const forced of [false, true]) {
      const e = fixture();
      try {
        const buffer = { current: { player: {}, cpu: {} } }, owners = { current: null };
        syncOwners(e, buffer, owners);
        buffer.current[side] = { guard: true, left: true };
        const other = side === 'player' ? 'cpu' : 'player'; buffer.current[other] = { right: true };
        e.setSideInput(side, buffer.current[side]);
        assert.equal(e.requestTag(side, 1, forced), true);
        syncOwners(e, buffer, owners); // same call made after every simulation step
        e.setSideInput(side, buffer.current[side]);
        assert.deepEqual(buffer.current[side], {}); assert.equal(e.inputs[side].guard, false);
        assert.deepEqual(buffer.current[other], { right: true });
        // A fresh input after the tag does belong to the new actor.
        buffer.current[side] = { down: true }; syncOwners(e, buffer, owners);
        assert.equal(buffer.current[side].down, true);
      } finally { e.dispose(); }
    }
  });
}
test('clearing input never cancels a pending attack, removes hitstun or changes momentum', () => {
  const e = fixture();
  try {
    const a = e.getActive('player'); a.meter = 100;
    assert.equal(e.tryAction('player', 'heavy'), true);
    const action = a.action; a.guarding = true; a.crouching = true; a.vx = -120; a.vy = -50; a.hitstun = 0.6;
    e.clearInputs();
    assert.equal(a.action, action); assert.equal(a.hitstun, 0.6); assert.equal(a.state, 'attack');
    assert.equal(a.vx, -120); assert.equal(a.vy, -50); assert.equal(a.guarding, false); assert.equal(a.crouching, false);
  } finally { e.dispose(); }
});
test('owner guard resets for a new engine, never follows an old disposed engine', () => {
  const old = fixture(), next = fixture();
  try {
    const buffer = { current: { player: {}, cpu: {} } }, owners = { current: null };
    syncOwners(old, buffer, owners); buffer.current.player.guard = true;
    old.dispose(); syncOwners(next, buffer, owners);
    assert.equal(owners.current.engine, next); assert.deepEqual(buffer.current.player, {});
    buffer.current.player.right = true; syncOwners(old, buffer, owners);
    assert.equal(buffer.current.player.right, true); assert.equal(owners.current.engine, next);
  } finally { old.dispose(); next.dispose(); }
});
test('invalid side is not silently cleared as P1 and opponent alias remains supported', () => {
  const e = fixture();
  try {
    e.setSideInput('player', { left: true }); e.setSideInput('cpu', { guard: true });
    const before = structuredClone(e.inputs);
    assert.equal(e.clearSideInput('__proto__'), false); assert.deepEqual(e.inputs, before);
    assert.equal(e.clearSideInput('opponent'), true); assert.deepEqual(e.inputs.cpu, {});
    assert.deepEqual(e.inputs.player, before.player);
  } finally { e.dispose(); }
});
test('finished fighter inputs cannot become a new attack during the result delay', () => {
  const e = fixture();
  try {
    e.getActive('player').meter = 100;
    e.finish('victory');
    assert.equal(e.setSideInput('player', { guard: true }), false);
    assert.equal(e.tryAction('player', 'super'), false);
    assert.equal(e.requestTag('player', 1, true), false);
    assert.equal(e.getActive('player').guarding, false);
  } finally { e.dispose(); }
});
for (const side of ['player', 'cpu']) {
  for (const condition of ['ready', 'pause', 'countdown', 'hit-stop', 'action', 'cooldown', 'ko-reserve', 'stale-dead-reserve']) {
    test(`${side}: roster snapshot advertises the exact tag gate (${condition}) without mutation`, () => {
      const e = fixture();
      try {
        const a = e.getActive(side), team = e.getTeam(side); a.meter = 100;
        if (condition === 'pause') e.setPaused(true);
        if (condition === 'countdown') e.countdown = 1;
        if (condition === 'hit-stop') e.hitStop = 0.07;
        if (condition === 'action') e.tryAction(side, 'heavy');
        if (condition === 'cooldown') team.tagCooldown = 2;
        if (condition === 'ko-reserve') team.fighters[1].currentHp = 0;
        if (condition === 'stale-dead-reserve') team.fighters[1].state = 'dead';
        const state = JSON.stringify({ team, stats: e.stats, inputs: e.inputs });
        const snapshot = e.getSnapshot()[side];
        assert.equal(snapshot.fighters[0].canTag, false);
        assert.equal(snapshot.fighters[1].canTag, condition === 'ready');
        assert.equal(snapshot.commandReady, e.canAct(a));
        assert.equal(e.canTag(side, 1), condition === 'ready');
        assert.equal(JSON.stringify({ team, stats: e.stats, inputs: e.inputs }), state);
        assert.equal(e.requestTag(side, 1), condition === 'ready');
      } finally { e.dispose(); }
    });
  }
}
