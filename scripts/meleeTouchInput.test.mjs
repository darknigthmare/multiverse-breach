import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createSceneInputs } from '../src/game/sceneInputs.js';
import { readBrowserGamepads } from '../src/game/browserGamepads.js';
import {
  MELEE_ACTIONS, MELEE_REMAPPABLE_SLOTS, createDefaultMeleeInputMaps,
  diffMeleeActionEdges, mergeMeleeInputSnapshots, readGamepadMeleeInput,
  readKeyboardMeleeInput
} from '../src/game/melee/meleeInputMap.js';

const source = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `Missing real GameCanvas route: ${start}`);
  return source.slice(first, last);
};
const init = section('  const meleeTouchHeldRef = useRef(', '  const meleeNeutralGateRef = ');
const snapshot = section('const getTouchMeleeSnapshot = ', 'const getStableNumericSeed = ');
const callbacks = section('  const handleMeleeTouchAction = ', '  // Une pause pilotee par le shell');
const reader = section('    const readMeleeInput = ', '    const dispatchMeleeInputEdges = ');
const dispatcher = section('    const dispatchMeleeInputEdges = ', '    let animTime = ');
const cleanup = section("    return () => {\n      window.removeEventListener('keydown', handleKeyDown);", '  // eslint-disable-next-line react-hooks/exhaustive-deps')
  .replace('return () =>', 'const cleanup = () =>');

let vite, Smash;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash: Smash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
});
after(async () => { await vite?.close(); });

const hero = id => ({ id, name: id, universe: 'QA', stats: { hp: 300, atk: 10, def: 1, spd: 10 }, simple: { dmg: 1 } });

// Execute the current component's callbacks, reader, edge dispatch and cleanup.
// Rendering, browser listeners and unrelated timers are inert; melee rules use
// the real EngineSmash and the existing keyboard/gamepad mapping helpers.
function fixture() {
  const engine = new Smash(900, 500, [hero('player')], { customRoster: [hero('opponent')] },
    { add() {} }, () => {}, () => {}, { disableHazards: true, customBattle: { opponentControl: 'p2', singleRoster: true } });
  engine.syncPreMatchFromServer(3000);
  assert.equal(engine.isMatchInputLocked(), false);
  const noop = () => {}, clock = {};
  const env = {
    useRef: current => ({ current }), createSceneInputs,
    MELEE_TOUCH_SLOTS: MELEE_REMAPPABLE_SLOTS.map(slot => slot.id),
    MELEE_ACTIONS, diffMeleeActionEdges, mergeMeleeInputSnapshots, readGamepadMeleeInput, readKeyboardMeleeInput, readBrowserGamepads,
    engineRef: { current: engine }, keysPressed: { current: {} },
    meleePressedCodesRef: { current: new Set() },
    meleePreviousInputRef: { current: { player: null, cpu: null } },
    meleeNeutralGateRef: { current: { player: false, cpu: false } },
    meleeInputMapsRef: { current: createDefaultMeleeInputMaps() },
    navigator: { getGamepads: () => [] }, window: { removeEventListener: noop },
    document: { removeEventListener: noop }, handleKeyDown: noop, handleKeyUp: noop, handleVisibilityChange: noop,
    cancelAnimationFrame: noop, frameId: 1, simulationClock: clock, simulationClockRef: { current: clock },
    clearManagedTimer: noop, battleItemLogTimerRef: {}, battleAnomalyTimerRef: {}, customPresentationTimerRef: {},
    knockoutActorStateRef: { current: { heroes: new Map(), enemies: new Map() } }, sound: { stopBgm: noop }
  };
  const routes = new Function(...Object.keys(env), `${init}\n${snapshot}\n${callbacks}\n${reader}\n${dispatcher}\n`
    + `const clearMeleeInput = clearMeleeControls;\n${cleanup}\n`
    + 'return { input: handleMeleeTouchAction, clear: clearMeleeControls, read: readMeleeInput, dispatch: dispatchMeleeInputEdges, cleanup };')(...Object.values(env));
  return {
    ...routes, env, engine, actor: engine.getActiveHero(),
    step(side = 'player') { return routes.dispatch(env.engineRef.current, side, routes.read(side)); }
  };
}

test('two pointer owners keep movement until the final release', () => {
  const f = fixture();
  f.input('moveLeft', 'down', 'button:left:pointer:1');
  f.input('moveLeft', 'down', 'button:left:pointer:2');
  assert.equal(f.read('player').horizontal, -1);
  f.input('moveLeft', 'up', 'button:left:pointer:2');
  assert.equal(f.read('player').horizontal, -1);
  f.input('moveLeft', 'up', 'button:left:pointer:1');
  assert.equal(f.read('player').horizontal, 0);
});

test('guard remains active in the real engine while another pointer holds it', () => {
  const f = fixture();
  f.input('shield', 'down', 'pointer:1'); f.step();
  f.input('shield', 'down', 'pointer:2'); f.step();
  assert.equal(f.actor.guarding, true);
  f.input('shield', 'up', 'pointer:2'); f.step();
  assert.equal(f.actor.guarding, true);
  f.input('shield', 'up', 'pointer:1'); f.step();
  assert.equal(f.actor.guarding, false);
});

test('a charged attack commits only when its last pointer owner releases', () => {
  const f = fixture();
  f.input('chargedAttack', 'down', 'pointer:1'); f.step();
  f.input('chargedAttack', 'down', 'pointer:2'); f.step();
  assert.equal(f.actor.charging, true);
  f.input('chargedAttack', 'up', 'pointer:2'); f.step();
  assert.equal(f.actor.charging, true);
  assert.equal(f.actor.action, null);
  f.input('chargedAttack', 'up', 'pointer:1'); f.step();
  assert.equal(f.actor.charging, false);
  assert.equal(f.actor.action?.id, 'charged');
  const action = f.actor.action;
  f.input('chargedAttack', 'cancel', 'pointer:1'); f.step();
  assert.equal(f.actor.action, action, 'lost capture following pointerup must not commit again');
});

test('Space, Enter and numpad Enter remain independent virtual-button owners', () => {
  const f = fixture();
  for (const code of ['Space', 'Enter', 'NumpadEnter']) f.input('shield', 'down', `keyboard:${code}`);
  f.step();
  f.input('shield', 'up', 'keyboard:Enter'); f.step();
  assert.equal(f.actor.guarding, true);
  f.input('shield', 'up', 'keyboard:NumpadEnter'); f.step();
  assert.equal(f.actor.guarding, true);
  f.input('shield', 'up', 'keyboard:Space'); f.step();
  assert.equal(f.actor.guarding, false);
});

test('keyboard focus cancellation does not release a pointer on the same button', () => {
  const f = fixture();
  f.input('shield', 'down', 'pointer:1');
  f.input('shield', 'down', 'keyboard:Space'); f.step();
  f.input('shield', 'cancel', 'keyboard:Space'); f.step();
  assert.equal(f.actor.guarding, true);
  f.input('shield', 'up', 'pointer:1'); f.step();
  assert.equal(f.actor.guarding, false);
});

test('pointer cancellation and duplicate lost capture release only their own source', () => {
  const f = fixture();
  f.input('moveRight', 'down', 'pointer:1');
  f.input('moveRight', 'down', 'pointer:2');
  f.input('moveRight', 'cancel', 'pointer:1');
  f.input('moveRight', 'cancel', 'pointer:1');
  assert.equal(f.read('player').horizontal, 1);
  f.input('moveRight', 'cancel', 'pointer:2');
  assert.equal(f.read('player').horizontal, 0);
});

test('late cancellation from one action cannot release another action using the same source label', () => {
  const f = fixture();
  f.input('moveLeft', 'down', 'pointer:1');
  f.input('shield', 'down', 'pointer:1'); f.step();
  f.input('moveLeft', 'cancel', 'pointer:1'); f.step();
  assert.equal(f.read('player').horizontal, 0);
  assert.equal(f.actor.guarding, true);
});

test('touch release preserves a real keyboard binding and the other player input', () => {
  const f = fixture();
  f.env.meleePressedCodesRef.current.add('ShiftLeft');
  f.env.meleePressedCodesRef.current.add('Numpad0');
  f.input('shield', 'down', 'pointer:1'); f.step(); f.step('cpu');
  f.input('shield', 'up', 'pointer:1'); f.step();
  assert.equal(f.actor.guarding, true);
  assert.equal(f.engine.getActiveOpponent().guarding, true);
  f.env.meleePressedCodesRef.current.delete('ShiftLeft'); f.step();
  assert.equal(f.actor.guarding, false);
  assert.equal(f.engine.getActiveOpponent().guarding, true);
});

test('source-less virtual callers remain compatible and separate from pointer owners', () => {
  const f = fixture();
  f.input('moveLeft', 'down');
  f.input('moveLeft', 'down', 'pointer:1');
  f.input('moveLeft', 'up');
  assert.equal(f.read('player').horizontal, -1);
  f.input('moveLeft', 'up', 'pointer:1');
  assert.equal(f.read('player').horizontal, 0);
});

test('the existing reset cancels charging and clears every source without firing an attack', () => {
  const f = fixture();
  f.env.keysPressed.current.KeyK = true;
  f.env.meleePressedCodesRef.current.add('Numpad0');
  f.input('chargedAttack', 'down', 'pointer:1'); f.step(); f.step('cpu');
  assert.equal(f.actor.charging, true);
  assert.equal(f.engine.getActiveOpponent().guarding, true);
  f.clear();
  assert.equal(f.actor.charging, false);
  assert.equal(f.actor.action, null);
  assert.equal(f.engine.getActiveOpponent().guarding, false);
  assert.deepEqual(f.env.keysPressed.current, {});
  assert.equal(f.env.meleePressedCodesRef.current.size, 0);
  assert.equal(Object.values(f.read('player').actions).some(Boolean), false);
  assert.equal(Object.values(f.read('cpu').actions).some(Boolean), false);
  assert.deepEqual(f.env.meleeNeutralGateRef.current, { player: true, cpu: true });
});

test('after reset, a fresh pointer works and an old late release cannot erase it', () => {
  const f = fixture();
  f.input('moveLeft', 'down', 'pointer:old');
  f.clear(); f.step();
  assert.equal(f.env.meleeNeutralGateRef.current.player, false);
  f.input('moveRight', 'down', 'pointer:fresh');
  f.input('moveLeft', 'up', 'pointer:old');
  assert.equal(f.read('player').horizontal, 1, 'the old left hold must not be reconstructed');
  f.input('moveRight', 'down', 'pointer:second');
  f.input('moveRight', 'up', 'pointer:fresh');
  assert.equal(f.read('player').horizontal, 1);
});

test('real stage/roster effect cleanup clears the previous engine and owner registry', () => {
  const f = fixture();
  f.input('chargedAttack', 'down', 'pointer:old'); f.step();
  assert.equal(f.actor.charging, true);
  f.cleanup();
  assert.equal(f.env.engineRef.current, null);
  assert.equal(f.actor.charging, false);
  assert.equal(f.actor.action, null);
  assert.equal(Object.values(f.read('player').actions).some(Boolean), false);
  f.input('moveRight', 'down', 'pointer:fresh');
  f.input('chargedAttack', 'cancel', 'pointer:old');
  assert.equal(f.read('player').horizontal, 1);
  assert.equal(f.read('player').actions[MELEE_ACTIONS.chargedAttack], false);
});
