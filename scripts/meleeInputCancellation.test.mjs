import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createSceneInputs } from '../src/game/sceneInputs.js';
import { readBrowserGamepads } from '../src/game/browserGamepads.js';
import { createMeleeGamepadInput } from '../src/game/melee/meleeGamepadInput.js';
import * as runtime from '../src/game/melee/meleeCombatRuntime.js';
import {
  MELEE_ACTIONS, MELEE_REMAPPABLE_SLOTS, createDefaultMeleeInputMaps,
  diffMeleeActionEdges, mergeMeleeInputSnapshots, readGamepadMeleeInput,
  readKeyboardMeleeInput
} from '../src/game/melee/meleeInputMap.js';

const canvasSource = readFileSync(process.env.MELEE_CANVAS_SOURCE
  || new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
const engineSource = readFileSync(process.env.MELEE_ENGINE_SOURCE
  || new URL('../src/game/engineSmash.js', import.meta.url), 'utf8');
const section = (source, start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `Missing real input route: ${start}`);
  return source.slice(first, last);
};
const init = section(canvasSource, '  const meleeTouchHeldRef = useRef(', '  const tacticsCameraPointerRef = ');
const snapshot = section(canvasSource, 'const getTouchMeleeSnapshot = ', 'const getStableNumericSeed = ');
const callbacks = section(canvasSource, '  const handleMeleeTouchAction = ', '  // Une pause pilotee par le shell');
const readerAndDispatcher = section(canvasSource, '    const readMeleeInput = ', '    let animTime = ');
const disconnectHandler = canvasSource.includes('    const handleGamepadDisconnected = ')
  ? section(canvasSource, '    const handleGamepadDisconnected = ', "    window.addEventListener('keydown'")
  : 'const handleGamepadDisconnected = () => {};';
const methods = section(engineSource, "  beginChargedMeleeAttack(side = 'player')", '  resolveMeleeActionHit(');
const RuntimeEngine = new Function(...Object.keys(runtime), `return class {
  constructor(actors) { this.actors = actors; this.gameOver = false; }
  getMeleeActor(side) { return this.actors[side]; }
  isMatchInputLocked() { return false; }
  ${methods}
}`)(...Object.values(runtime));

function fixture(t) {
  let pads = [], denied = false;
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    getGamepads() { if (denied) throw new DOMException('Test policy refusal', 'SecurityError'); return pads; }
  } });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
    else delete globalThis.navigator;
  });
  const actors = Object.fromEntries(['player', 'cpu'].map(side =>
    [side, runtime.initializeMeleeActorRuntime({ id: side, currentHp: 300, x: 0, y: 0, state: 'idle' })]));
  const engine = new RuntimeEngine(actors), hits = { player: 0, cpu: 0 };
  const env = {
    useRef: current => ({ current }), createSceneInputs, createMeleeGamepadInput,
    MELEE_TOUCH_SLOTS: MELEE_REMAPPABLE_SLOTS.map(slot => slot.id),
    MELEE_ACTIONS, diffMeleeActionEdges, mergeMeleeInputSnapshots,
    readGamepadMeleeInput, readKeyboardMeleeInput, readBrowserGamepads,
    engineRef: { current: engine }, keysPressed: { current: {} },
    meleePressedCodesRef: { current: new Set() },
    meleePreviousInputRef: { current: { player: null, cpu: null } },
    meleeInputMapsRef: { current: createDefaultMeleeInputMaps() }
  };
  const routes = new Function(...Object.keys(env), `${init}\n${snapshot}\n${callbacks}\n${disconnectHandler}\n${readerAndDispatcher}\n`
    + 'return { input: handleMeleeTouchAction, clear: clearMeleeControls, read: readMeleeInput, dispatch: dispatchMeleeInputEdges, disconnect: handleGamepadDisconnected };')(...Object.values(env));
  return {
    ...routes, actors, engine, hits, env,
    pads(next) { pads = next; }, deny(next) { denied = next; },
    key(code, down) { if (down) env.meleePressedCodesRef.current.add(code); else env.meleePressedCodesRef.current.delete(code); },
    step(side = 'player') { const current = routes.read(side); routes.dispatch(engine, side, current); return current; },
    advance(side = 'player', ticks = 60) {
      for (let tick = 0; tick < ticks; tick++) runtime.tickMeleeCombatActor(actors[side], 1 / 60, {
        resolveActionHit() { hits[side]++; return 1; }
      });
    }
  };
}

const pad = ({ id = 'test-pad', index = 0, connected = true, axes = [0, 0], buttons = [] } = {}) => ({
  id, index, connected, mapping: 'standard', axes,
  buttons: Array.from({ length: 18 }, (_, n) => ({ pressed: buttons.includes(n), value: buttons.includes(n) ? 1 : 0 }))
});
const assertCancelled = (f, side = 'player') => {
  assert.equal(f.actors[side].charging, false);
  assert.equal(f.actors[side].chargeHoldSeconds, 0);
  assert.equal(f.actors[side].action, null);
  f.advance(side);
  assert.equal(f.hits[side], 0, 'cancellation must never reach hit resolution');
};

test('a first observed held pad preserves normal charge and one natural release hit', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step();
  assert.equal(f.actors.player.charging, true);
  f.advance('player', 20);
  f.pads([pad()]); f.step();
  assert.equal(f.actors.player.action?.id, 'charged');
  f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

for (const [label, lose] of [
  ['missing slot', f => f.pads([null])],
  ['retained disconnected object', f => f.pads([pad({ connected: false, buttons: [3] })])],
  ['API refusal', f => f.deny(true)],
  ['replacement identity', f => f.pads([pad({ id: 'replacement', buttons: [3] })])]
]) {
  test(`a ${label} cancels a pad charge without committing an attack`, t => {
    const f = fixture(t);
    f.pads([pad({ buttons: [3] })]); f.step(); f.advance('player', 20);
    lose(f); f.step();
    assertCancelled(f);
  });
}

test('a returning held pad needs its own neutral sample and never blocks keyboard movement', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step();
  f.pads([]); f.step();
  f.pads([pad({ axes: [0.8, 0], buttons: [3] })]);
  f.key('KeyQ', true);
  const gated = f.step();
  assert.equal(gated.horizontal, -1);
  assert.equal(gated.actions[MELEE_ACTIONS.chargedAttack], false);
  assert.equal(f.actors.player.action, null);
  f.key('KeyQ', false);
  f.pads([pad()]); f.step();
  f.pads([pad({ buttons: [3] })]); f.step();
  assert.equal(f.actors.player.charging, true);
  f.pads([pad()]); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('a transient API refusal cannot turn a still-held button into a new charge', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step();
  f.deny(true); f.step();
  f.deny(false); f.step();
  assertCancelled(f);
  f.pads([pad()]); f.step();
  f.pads([pad({ buttons: [3] })]); f.step();
  assert.equal(f.actors.player.charging, true);
});

test('an initial API failure does not suppress the first observed pad connection', t => {
  const f = fixture(t);
  f.deny(true); f.step();
  f.pads([pad({ buttons: [3] })]); f.deny(false); f.step();
  assert.equal(f.actors.player.charging, true);
});

test('a keyboard charge owner survives pad loss and commits on its own release', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.key('KeyK', true); f.step();
  f.advance('player', 20);
  const heldSeconds = f.actors.player.chargeHoldSeconds;
  f.pads([]); f.step();
  assert.equal(f.actors.player.charging, true);
  assert.equal(f.actors.player.chargeHoldSeconds, heldSeconds);
  assert.equal(f.actors.player.action, null);
  f.key('KeyK', false); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('a touch charge owner survives pad loss and commits on its own release', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.input('chargedAttack', 'down', 'pointer:1'); f.step();
  f.pads([]); f.step();
  assert.equal(f.actors.player.charging, true);
  f.input('chargedAttack', 'up', 'pointer:1'); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('loss cancellation preserves a simultaneous shield command from another device', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step();
  f.pads([]); f.key('KeyI', true); f.step();
  assert.equal(f.actors.player.charging, false);
  assert.equal(f.actors.player.guarding, true);
  assert.equal(f.actors.player.action, null);
  f.key('KeyI', false); f.step();
  assert.equal(f.actors.player.guarding, false);
});

test('an existing keyboard shield owner survives pad loss without restarting the shield', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [7] })]); f.key('KeyI', true); f.step();
  f.advance('player', 10);
  const window = f.actors.player.perfectShieldWindow;
  f.pads([]); f.step();
  assert.equal(f.actors.player.guarding, true);
  assert.equal(f.actors.player.perfectShieldWindow, window);
  f.key('KeyI', false); f.step();
  assert.equal(f.actors.player.guarding, false);
});

test('player two pad loss cannot cancel player one charge or compact pad slots', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] }), pad({ index: 1, buttons: [3] })]);
  f.step(); f.step('cpu');
  f.pads([pad({ buttons: [3] }), null]); f.step(); f.step('cpu');
  assert.equal(f.actors.player.charging, true);
  assertCancelled(f, 'cpu');
  f.pads([null, pad({ index: 1, buttons: [3] })]); f.step(); f.step('cpu');
  assertCancelled(f);
  assert.equal(f.actors.cpu.charging, false, 'returning pad two is still gated');
  f.pads([null, pad({ index: 1 })]); f.step('cpu');
  f.pads([null, pad({ index: 1, buttons: [3] })]); f.step('cpu');
  assert.equal(f.actors.cpu.charging, true);
  assert.equal(f.actors.player.charging, false);
});

test('read-only samples cannot consume the loss before dispatch cancels it', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step();
  f.pads([]); f.read('player'); f.read('player'); f.step();
  assertCancelled(f);
});

test('a native disconnect callback catches an identical pad returning between polls', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step();
  f.disconnect({ gamepad: { index: 0 } });
  // No intervening empty getGamepads sample: same ID, slot and held button.
  f.pads([pad({ buttons: [3] })]); f.step();
  assertCancelled(f);
  f.pads([pad()]); f.step();
  f.pads([pad({ buttons: [3] })]); f.step();
  assert.equal(f.actors.player.charging, true);
});

test('disconnect callbacks for unassigned slots cannot cancel either player', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] }), pad({ index: 1, buttons: [3] })]); f.step(); f.step('cpu');
  for (const event of [{}, { gamepad: { index: 2 } }, { gamepad: { index: -1 } }]) f.disconnect(event);
  f.step(); f.step('cpu');
  assert.equal(f.actors.player.charging, true);
  assert.equal(f.actors.cpu.charging, true);
});

test('a final touch cancellation aborts charge instead of firing it', t => {
  const f = fixture(t);
  f.input('chargedAttack', 'down', 'pointer:1'); f.step(); f.advance('player', 20);
  f.input('chargedAttack', 'cancel', 'pointer:1'); f.step();
  assertCancelled(f);
});

test('read-only samples cannot consume a touch cancellation before dispatch', t => {
  const f = fixture(t);
  f.input('chargedAttack', 'down', 'pointer:1'); f.step();
  f.input('chargedAttack', 'cancel', 'pointer:1'); f.read('player'); f.read('player'); f.step();
  assertCancelled(f);
});

test('touch cancellation preserves another pointer owner and its later natural release', t => {
  const f = fixture(t);
  f.input('chargedAttack', 'down', 'pointer:1');
  f.input('chargedAttack', 'down', 'pointer:2'); f.step();
  f.input('chargedAttack', 'cancel', 'pointer:1'); f.step();
  assert.equal(f.actors.player.charging, true);
  f.input('chargedAttack', 'up', 'pointer:2'); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('cancelling one pointer then releasing its surviving co-owner before a frame still commits', t => {
  const f = fixture(t);
  f.input('chargedAttack', 'down', 'pointer:1');
  f.input('chargedAttack', 'down', 'pointer:2'); f.step();
  f.input('chargedAttack', 'cancel', 'pointer:1');
  f.input('chargedAttack', 'up', 'pointer:2'); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

for (const device of ['keyboard', 'gamepad']) {
  test(`touch cancellation preserves the ${device} owner and its later natural release`, t => {
    const f = fixture(t);
    if (device === 'keyboard') f.key('KeyK', true);
    else f.pads([pad({ buttons: [3] })]);
    f.input('chargedAttack', 'down', 'pointer:1'); f.step();
    f.input('chargedAttack', 'cancel', 'pointer:1'); f.step();
    assert.equal(f.actors.player.charging, true);
    if (device === 'keyboard') f.key('KeyK', false);
    else f.pads([pad()]);
    f.step(); f.advance();
    assert.equal(f.hits.player, 1);
  });
}

test('late cancellation of an absent pointer cannot cancel a later keyboard release', t => {
  const f = fixture(t);
  f.input('chargedAttack', 'down', 'pointer:old'); f.step();
  f.input('chargedAttack', 'cancel', 'pointer:old'); f.step();
  f.key('KeyK', true); f.step();
  assert.equal(f.actors.player.charging, true);
  f.key('KeyK', false);
  f.input('chargedAttack', 'cancel', 'pointer:old'); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('normal pointerup followed by lost capture commits exactly one attack', t => {
  const f = fixture(t);
  f.input('chargedAttack', 'down', 'pointer:1'); f.step();
  f.input('chargedAttack', 'up', 'pointer:1');
  f.input('chargedAttack', 'cancel', 'pointer:1'); f.step();
  assert.equal(f.actors.player.action?.id, 'charged');
  f.input('chargedAttack', 'cancel', 'pointer:1'); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('pause cleanup gates a held pad while allowing new independent keyboard input', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step();
  f.clear(); f.step();
  assertCancelled(f);
  f.key('KeyK', true); f.step();
  assert.equal(f.actors.player.charging, true);
  f.key('KeyK', false); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('a fresh touch charge works on the first post-clear frame while the pad is still held', t => {
  const f = fixture(t);
  f.pads([pad({ buttons: [3] })]); f.step(); f.clear();
  f.input('chargedAttack', 'down', 'pointer:new'); f.step();
  assert.equal(f.actors.player.charging, true);
  f.input('chargedAttack', 'up', 'pointer:new'); f.step(); f.advance();
  assert.equal(f.hits.player, 1);
});

test('scene ownership reports only an actually removed source', () => {
  const held = createSceneInputs(['chargedAttack']);
  held.hold('pointer:1', 'chargedAttack');
  assert.equal(held.release('pointer:1'), true);
  assert.equal(held.release('pointer:1'), false);
  assert.equal(held.release('pointer:missing'), false);
});

test('narrow charge cancellation preserves crouch, jump and fast-fall state', t => {
  const f = fixture(t), actor = f.actors.player;
  actor.crouching = true; actor.jumpHeld = true; actor.fastFallHeld = true;
  f.engine.beginChargedMeleeAttack(); f.advance('player', 20);
  assert.equal(actor.state, 'crouchCharge');
  assert.equal(f.engine.cancelChargedMeleeAttack(), true);
  assertCancelled(f);
  assert.equal(actor.crouching, true);
  assert.equal(actor.jumpHeld, true);
  assert.equal(actor.fastFallHeld, true);
  assert.equal(actor.state, 'crouchIdle');
});

test('narrow cancellation cannot erase a committed attack or an unrelated shield', t => {
  const f = fixture(t), actor = f.actors.player;
  f.engine.beginChargedMeleeAttack(); f.engine.releaseChargedMeleeAttack();
  const action = actor.action;
  assert.equal(f.engine.cancelChargedMeleeAttack(), false);
  assert.equal(actor.action, action);
  f.advance();
  assert.equal(f.hits.player, 1);
  f.engine.setMeleeShield('player', true);
  const window = actor.perfectShieldWindow;
  assert.equal(f.engine.cancelChargedMeleeAttack(), false);
  assert.equal(actor.guarding, true);
  assert.equal(actor.perfectShieldWindow, window);
});

test('narrow cancellation preserves a concurrent hit lock and does not change its timer', t => {
  const f = fixture(t), actor = f.actors.player;
  f.engine.beginChargedMeleeAttack();
  actor.state = 'hitStun'; actor.stateTimer = 12;
  assert.equal(f.engine.cancelChargedMeleeAttack(), true);
  assert.equal(actor.charging, false);
  assert.equal(actor.state, 'hitStun');
  assert.equal(actor.stateTimer, 12);
  assert.equal(actor.action, null);
});
