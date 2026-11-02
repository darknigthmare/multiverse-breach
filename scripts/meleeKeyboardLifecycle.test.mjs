import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  MELEE_ACTIONS, createDefaultMeleeInputMaps, diffMeleeActionEdges,
  getMeleeActionsForCode, readKeyboardMeleeInput
} from '../src/game/melee/meleeInputMap.js';
import {
  initializeMeleeActorRuntime, beginMeleeCharge, releaseMeleeCharge, cancelMeleeCharge,
  beginMeleeShield, releaseMeleeShield, cancelMeleeHeldInputs
} from '../src/game/melee/meleeCombatRuntime.js';

const source = readFileSync(process.env.GAMECANVAS_KEYBOARD_SOURCE
  || new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `Missing GameCanvas keyboard route: ${start}`);
  return source.slice(first, last);
};
const handlers = section('    const handleKeyDown = ', '    const clearMeleeInput = ');
const dispatcher = section('    const dispatchMeleeInputEdges = ', '    let animTime = ');
const event = (code, extra = {}) => ({
  code, key: code === 'Space' ? ' ' : code === 'KeyK' ? 'k' : code,
  repeat: false, defaultPrevented: false,
  target: { tagName: 'CANVAS', closest: () => null },
  preventDefault() { this.defaultPrevented = true; },
  ...extra
});

// Execute the real keyboard handlers and edge dispatcher. The keyboard mapper
// and charge/shield state machine are also real. React, rendering, gamepads and
// the full engine are outside this focused fixture; cleared ownership is set up
// explicitly to exercise key events arriving on either side of the next frame.
function fixture({ mode = 'Smash', p2 = true, custom = {} } = {}) {
  const actors = Object.fromEntries(['player', 'cpu'].map(side => [side,
    initializeMeleeActorRuntime({ id: `keyboard-${side}`, currentHp: 100, state: 'idle' })]));
  const calls = [];
  const engine = {
    beginChargedMeleeAttack(side) { calls.push(['begin', side]); return beginMeleeCharge(actors[side]); },
    releaseChargedMeleeAttack(side) { calls.push(['release', side]); return releaseMeleeCharge(actors[side]); },
    cancelChargedMeleeAttack(side) { return cancelMeleeCharge(actors[side]); },
    setMeleeShield(side, active) { return active ? beginMeleeShield(actors[side]) : releaseMeleeShield(actors[side]); },
    triggerMeleeAction(side, action) { calls.push(['action', side, action]); },
    setActiveHero(id) { calls.push(['hero', id]); },
    getTargetingState() { return null; },
    getSelectedEnemy() { return {}; },
    beginTargeting(_actor, ability) { calls.push(['target', ability]); }
  };
  const env = {
    MELEE_ACTIONS, diffMeleeActionEdges, getMeleeActionsForCode,
    sessionPausedRef: { current: false }, document: { hidden: false },
    engineRef: { current: engine }, stage: { mode },
    battleConfig: { opponentControl: p2 ? 'p2' : 'cpu', ...custom }, activeTeam: ['one', 'two'],
    keysPressed: { current: {} }, meleePressedCodesRef: { current: new Set() },
    meleeInputMapsRef: { current: createDefaultMeleeInputMaps() },
    meleePreviousInputRef: { current: { player: null, cpu: null } },
    // Supplied for the baseline dispatcher; production now gates gamepads at
    // their own source, so fresh keyboard commands need no aggregate gate.
    meleeNeutralGateRef: { current: { player: false, cpu: false } },
    window: { dispatchEvent() {} }, KeyboardEvent: class { constructor(_type, properties) { Object.assign(this, properties); } },
    activateCustomFieldSuper: side => calls.push(['field', side]),
    activateCustomAssist: side => calls.push(['assist', side]),
    activateFirstBattleItem: () => calls.push(['item']), setRpgTargeting() {}, rpgUnitId: actor => actor.id
  };
  const routes = new Function(...Object.keys(env), `${handlers}\n${dispatcher}\n`
    + 'return { down: handleKeyDown, up: handleKeyUp, dispatch: dispatchMeleeInputEdges };')(...Object.values(env));
  const read = side => readKeyboardMeleeInput(env.meleePressedCodesRef.current, env.meleeInputMapsRef.current[side]);
  return {
    ...routes, env, actors, calls, read,
    step(side = 'player') { return routes.dispatch(engine, side, read(side)); },
    prepareClearedOwnership({ awaitingFrame = false } = {}) {
      for (const actor of Object.values(actors)) cancelMeleeHeldInputs(actor);
      env.keysPressed.current = {};
      env.meleePressedCodesRef.current.clear();
      env.meleePreviousInputRef.current = { player: null, cpu: null };
      env.meleeNeutralGateRef.current = { player: awaitingFrame, cpu: awaitingFrame };
    }
  };
}

for (const [side, code] of [['player', 'KeyK'], ['cpu', 'Numpad2']]) {
  test(`${side}: a repeated key after a cleared frame cannot restart or release a charge`, () => {
    const f = fixture();
    f.down(event(code)); f.step(side);
    assert.equal(f.actors[side].charging, true);
    f.prepareClearedOwnership();
    const repeated = event(code, { repeat: true });
    f.down(repeated); f.step(side);
    assert.equal(repeated.defaultPrevented, true);
    assert.equal(f.env.meleePressedCodesRef.current.size, 0);
    assert.deepEqual(f.env.keysPressed.current, {});
    assert.equal(f.actors[side].charging, false);
    f.up(event(code)); f.step(side);
    assert.equal(f.actors[side].action, null);
    assert.equal(f.calls.filter(call => call[0] === 'release').length, 0);
    f.down(event(code)); f.step(side);
    assert.equal(f.actors[side].charging, true, 'A fresh physical press still works');
    f.up(event(code)); f.step(side);
    assert.equal(f.actors[side].action?.id, 'charged');
  });
}

test('a repeat before the first resumed frame does not block a fresh charge', () => {
  const f = fixture();
  f.down(event('KeyQ'));
  f.prepareClearedOwnership({ awaitingFrame: true });
  f.down(event('KeyQ', { repeat: true }));
  f.step();
  f.down(event('KeyK')); f.step();
  assert.equal(f.actors.player.charging, true);
  assert.equal(f.env.meleePressedCodesRef.current.has('KeyQ'), false);
});

test('a fresh key before the first resumed frame is admitted immediately', () => {
  const f = fixture();
  f.prepareClearedOwnership({ awaitingFrame: true });
  f.down(event('KeyK')); f.step();
  assert.equal(f.actors.player.charging, true);
});

test('ordinary repeat preserves the current held command without a second charge edge', () => {
  const f = fixture();
  f.down(event('KeyK')); f.step();
  f.actors.player.chargeHoldSeconds = 0.5;
  f.down(event('KeyK', { repeat: true })); f.step();
  assert.equal(f.actors.player.chargeHoldSeconds, 0.5);
  assert.equal(f.calls.filter(call => call[0] === 'begin').length, 1);
  f.up(event('KeyK')); f.step(); f.step();
  assert.equal(f.calls.filter(call => call[0] === 'release').length, 1);
  assert.equal(f.actors.player.action?.id, 'charged');
});

test('mapped Space and P2 arrows consume orphaned repeats without page scrolling', () => {
  const f = fixture();
  for (const code of ['Space', 'ArrowRight']) {
    const repeated = event(code, { repeat: true });
    f.down(repeated);
    assert.equal(repeated.defaultPrevented, true, code);
    assert.equal(f.env.meleePressedCodesRef.current.has(code), false);
  }
  const unusedArrow = event('ArrowRight', { repeat: true });
  fixture({ p2: false }).down(unusedArrow);
  assert.equal(unusedArrow.defaultPrevented, false, 'An inactive P2 binding is not consumed');
});

test('custom bindings also consume orphaned repeats while unrelated keys remain free', () => {
  const f = fixture();
  f.env.meleeInputMapsRef.current.player[MELEE_ACTIONS.chargedAttack] = ['KeyV'];
  const custom = event('KeyV', { repeat: true });
  f.down(custom); f.step();
  assert.equal(custom.defaultPrevented, true);
  assert.equal(f.actors.player.charging, false);
  const unrelated = event('KeyB', { repeat: true });
  f.down(unrelated);
  assert.equal(unrelated.defaultPrevented, false);
  assert.equal(f.env.meleePressedCodesRef.current.size, 0);
});

test('orphaned repeats do not retrigger field super, assist, item or team-selection side effects', () => {
  const f = fixture({ p2: false, custom: { fieldSuper: {}, cosmetics: { npcAssist: {} } } });
  for (const [code, key] of [['KeyT', 't'], ['KeyY', 'y'], ['KeyO', 'o'], ['Digit1', '1']]) {
    f.down(event(code, { key, repeat: true }));
  }
  assert.deepEqual(f.calls, []);
  assert.deepEqual(f.env.keysPressed.current, {});
});

test('keys first pressed during pause or a hidden document require a new press on return', () => {
  for (const condition of ['paused', 'hidden']) {
    const f = fixture();
    if (condition === 'paused') f.env.sessionPausedRef.current = true;
    else f.env.document.hidden = true;
    f.down(event('KeyK')); f.step();
    assert.equal(f.actors.player.charging, false);
    f.env.sessionPausedRef.current = false;
    f.env.document.hidden = false;
    f.down(event('KeyK', { repeat: true })); f.step();
    assert.equal(f.actors.player.charging, false, condition);
    f.up(event('KeyK')); f.down(event('KeyK')); f.step();
    assert.equal(f.actors.player.charging, true, condition);
  }
});

test('keys first pressed in editable UI cannot start combat merely by repeating over the canvas', () => {
  const f = fixture();
  f.down(event('KeyK', { target: { tagName: 'INPUT' } }));
  f.down(event('KeyK', { repeat: true })); f.step();
  assert.equal(f.actors.player.charging, false);
  assert.equal(f.env.meleePressedCodesRef.current.size, 0);
  f.down(event('KeyK')); f.step();
  assert.equal(f.actors.player.charging, true);
  f.up(event('Unidentified', { code: 'KeyK', target: { tagName: 'TEXTAREA' }, defaultPrevented: true }));
  f.step();
  assert.equal(f.actors.player.action?.id, 'charged', 'Physical release still reaches ownership cleanup');
});

test('the repeat filter preserves RPG input admission and its existing discrete targeting guard', () => {
  const f = fixture({ mode: 'RPG' });
  f.down(event('KeyK', { repeat: true }));
  assert.equal(f.env.meleePressedCodesRef.current.has('KeyK'), true);
  assert.equal(f.env.keysPressed.current.KeyK, true);
  assert.equal(f.calls.some(call => call[0] === 'target'), false);
  f.up(event('KeyK'));
  f.down(event('KeyK'));
  assert.equal(f.calls.filter(call => call[0] === 'target').length, 1);
});
