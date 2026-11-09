import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createSceneInputs } from '../src/game/sceneInputs.js';
import { readBrowserGamepads } from '../src/game/browserGamepads.js';
import { createMeleeGamepadInput } from '../src/game/melee/meleeGamepadInput.js';
import {
  MELEE_ACTIONS, MELEE_REMAPPABLE_SLOTS, createDefaultMeleeInputMaps,
  mergeMeleeInputSnapshots, readGamepadMeleeInput, readKeyboardMeleeInput
} from '../src/game/melee/meleeInputMap.js';

const source = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `Missing GameCanvas input boundary: ${start}`);
  return source.slice(first, last);
};
const reader = section('    const readMeleeInput = ', '    const dispatchMeleeInputEdges = ');
const touchSnapshot = section('const getTouchMeleeSnapshot = ', 'const getStableNumericSeed = ');

function platform(t, descriptor) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  if (descriptor) Object.defineProperty(globalThis, 'navigator', { configurable: true, ...descriptor });
  else delete globalThis.navigator;
  t.after(() => {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
    else delete globalThis.navigator;
  });
}

const denied = () => { throw new DOMException('Gamepad access denied by the test platform', 'SecurityError'); };
const pad = ({ index = 0, axes = [0, 0], buttons = [] } = {}) => ({
  id: `controlled-pad-${index}`, index, connected: true, axes,
  buttons: Array.from({ length: 18 }, (_, button) => ({ pressed: buttons.includes(button), value: buttons.includes(button) ? 1 : 0 }))
});

// Execute the current component reader and real mapping/scene-input helpers.
// Only React refs and the browser's optional platform API are controlled.
function fixture() {
  const codes = new Set();
  const held = Object.fromEntries(['player', 'cpu'].map(side => [side, createSceneInputs(MELEE_REMAPPABLE_SLOTS.map(slot => slot.id))]));
  const env = {
    MELEE_ACTIONS, mergeMeleeInputSnapshots, readGamepadMeleeInput, readKeyboardMeleeInput, readBrowserGamepads,
    meleeInputMapsRef: { current: createDefaultMeleeInputMaps() },
    meleePressedCodesRef: { current: codes }, meleeTouchHeldRef: { current: held },
    meleeTouchCancelVersionRef: { current: { player: 0, cpu: 0 } },
    meleeGamepadInputRef: { current: { player: createMeleeGamepadInput(), cpu: createMeleeGamepadInput() } }
  };
  const read = new Function(...Object.keys(env), `${touchSnapshot}\n${reader}\nreturn readMeleeInput;`)(...Object.values(env));
  return { read, codes, held };
}

for (const [name, descriptor] of [
  ['no navigator', null],
  ['no gamepad API', { value: {} }],
  ['a throwing navigator getter', { get: denied }],
  ['a throwing gamepad API getter', { value: Object.defineProperty({}, 'getGamepads', { get: denied }) }],
  ['a rejected gamepad method', { value: { getGamepads: denied } }]
]) {
  test(`${name} keeps the actual keyboard and touch reader usable for both players`, t => {
    platform(t, descriptor);
    const f = fixture();
    f.codes.add('KeyQ'); f.codes.add('ArrowRight');
    f.held.player.hold('touch-p1', 'shield'); f.held.cpu.hold('touch-p2', 'chargedAttack');
    for (let sample = 0; sample < 3; sample++) {
      const player = f.read('player'), cpu = f.read('cpu');
      assert.equal(player.horizontal, -1);
      assert.equal(player.actions[MELEE_ACTIONS.shield], true);
      assert.equal(cpu.horizontal, 1);
      assert.equal(cpu.actions[MELEE_ACTIONS.chargedAttack], true);
      assert.deepEqual(readBrowserGamepads(), []);
    }
    f.codes.clear(); f.held.player.clear(); f.held.cpu.clear();
    for (const side of ['player', 'cpu']) assert.equal(Object.values(f.read(side).actions).some(Boolean), false);
  });
}

test('native array holes, receiver and player indices are preserved', t => {
  const pads = [null, pad({ index: 1, axes: [0.8, 0], buttons: [7] }), null, null];
  const native = { getGamepads() { assert.equal(this, native); return pads; } };
  platform(t, { value: native });
  assert.equal(readBrowserGamepads(), pads, 'Do not compact or clone the platform array');
  const f = fixture();
  assert.equal(f.read('player').horizontal, 0);
  assert.equal(Object.values(f.read('player').actions).some(Boolean), false);
  assert.equal(f.read('cpu').horizontal, 0.8);
  assert.equal(f.read('cpu').actions[MELEE_ACTIONS.shield], true);
});

test('available pads still merge with independent keyboard and touch sources', t => {
  platform(t, { value: { getGamepads: () => [pad({ axes: [0.8, 0], buttons: [2] }), pad({ index: 1, axes: [-0.7, 0], buttons: [3] })] } });
  const f = fixture();
  f.codes.add('Space'); f.held.player.hold('touch', 'shield');
  assert.equal(f.read('player').horizontal, 0.8);
  assert.equal(f.read('player').actions[MELEE_ACTIONS.attackLight], true);
  assert.equal(f.read('player').actions[MELEE_ACTIONS.jump], true);
  assert.equal(f.read('player').actions[MELEE_ACTIONS.shield], true);
  assert.equal(f.read('cpu').horizontal, -0.7);
  assert.equal(f.read('cpu').actions[MELEE_ACTIONS.chargedAttack], true);
});

test('a later successful poll is usable after a transient failure', t => {
  let reject = true;
  platform(t, { value: { getGamepads() { if (reject) return denied(); return [pad({ axes: [-0.8, 0], buttons: [4] })]; } } });
  const f = fixture();
  f.held.player.hold('touch', 'shield');
  assert.equal(f.read('player').actions[MELEE_ACTIONS.shield], true);
  assert.equal(f.read('player').horizontal, 0);
  reject = false;
  assert.equal(f.read('player').horizontal, -0.8);
  assert.equal(f.read('player').actions[MELEE_ACTIONS.special], true);
  assert.equal(f.read('player').actions[MELEE_ACTIONS.shield], true);
});

function summonFixture() {
  const tick = source.slice(source.indexOf('    const tick = '));
  const first = tick.indexOf("          if (stage.mode === 'RPG') {");
  const last = tick.indexOf('          let meleeHeldP1 = ', first);
  assert.ok(first >= 0 && last > first, 'Missing actual RPG gamepad polling route');
  const calls = [], held = { current: { player: true, enemy: true } };
  const engine = {
    targeting: null, scene: false,
    getTargetingState() { return this.targeting; },
    isSummonSceneActive() { return this.scene; },
    getSelectedHero() { return { id: 'player-actor' }; },
    getSelectedEnemy() { return { id: 'enemy-actor' }; },
    summon(actor, side) { calls.push([actor.id, side]); }
  };
  const poll = new Function('readBrowserGamepads', 'stage', 'engine', 'rpgSummonGamepadHeldRef', 'battleConfig', 'setRpgTargeting',
    `return () => { ${tick.slice(first, last)} };`)(readBrowserGamepads, { mode: 'RPG' }, engine, held, { opponentControl: 'p2' }, () => {});
  return { poll, calls, held, engine };
}

test('RPG summon shoulders require neutral input independently for each camp after reset', t => {
  let pads = [pad({ buttons: [5] }), pad({ index: 1, buttons: [5] })];
  platform(t, { value: { getGamepads: () => pads } });
  const f = summonFixture();
  f.poll(); assert.deepEqual(f.calls, []);
  pads[0] = pad(); f.poll();
  pads[0] = pad({ buttons: [5] }); f.poll(); f.poll();
  assert.deepEqual(f.calls, [['player-actor', 'player']]);
  pads[1] = pad({ index: 1 }); f.poll();
  pads[1] = pad({ index: 1, buttons: [5] }); f.poll();
  assert.deepEqual(f.calls, [['player-actor', 'player'], ['enemy-actor', 'enemy']]);
  f.held.current = { player: true, enemy: true };
  f.poll(); assert.equal(f.calls.length, 2);
});

test('RPG summon polling retries denied access and requires neutral after missing or disconnected pads', t => {
  let reject = true, pads = [pad({ buttons: [5] })];
  platform(t, { value: { getGamepads() { return reject ? denied() : pads; } } });
  const f = summonFixture();
  f.poll(); reject = false; f.poll(); assert.deepEqual(f.calls, []);
  pads = [pad()]; f.poll(); pads = [pad({ buttons: [5] })]; f.poll();
  assert.equal(f.calls.length, 1);
  for (const missing of [[], [{ ...pad(), connected: false }]]) {
    pads = missing; f.poll(); pads = [pad({ buttons: [5] })]; f.poll();
    assert.equal(f.calls.length, 1);
  }
  pads = [pad()]; f.poll(); pads = [pad({ buttons: [5] })]; f.poll();
  assert.equal(f.calls.length, 2);
});

test('RPG summon polling cannot enqueue a held shoulder during targeting or a summon scene', t => {
  let pads = [pad()];
  platform(t, { value: { getGamepads: () => pads } });
  const f = summonFixture(); f.poll();
  for (const blocked of ['targeting', 'scene']) {
    f.engine[blocked] = true; pads = [pad({ buttons: [5] })]; f.poll();
    f.engine[blocked] = false; f.poll(); assert.deepEqual(f.calls, []);
    pads = [pad()]; f.poll();
  }
  pads = [pad({ buttons: [5] })]; f.poll();
  assert.deepEqual(f.calls, [['player-actor', 'player']]);
});
