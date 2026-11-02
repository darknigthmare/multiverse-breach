import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createSceneInputs, emptySceneAim } from '../src/game/sceneInputs.js';
import { advanceMosaicPlayer } from '../src/game/mosaicCityRuntime.js';

const source = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const cityStart = source.indexOf('function MosaicCityHub(');
const fpsStart = source.indexOf('function ExtinctionRoyale(');
assert.ok(cityStart >= 0 && fpsStart > cityStart, 'Missing actual City/FPS components');
const section = (start, end, from) => {
  const first = source.indexOf(start, from), last = source.indexOf(end, first + start.length);
  assert.ok(first >= from && last > first, `Missing actual scene route: ${start}`);
  return source.slice(first, last);
};
const cityHandlers = section('    const onKeyDown = event => {', '    window.addEventListener(', cityStart);
const fpsHandlers = section('    const onKeyDown = (event) => {', '    window.addEventListener(', fpsStart);
const cityVirtual = section('  const setVirtualKey = ', '  const clearCityDestination = ', cityStart);
const fpsVirtual = section('  const setMoveKey = ', '  const activateRoleSkill = ', fpsStart);
const fpsMovement = section('        const keys = state.moveKeys || {};', '        state.enemies = ', fpsStart);
const cityPause = section('    sessionPausedRef.current = sessionPaused;', '  }, [commitGuide, sessionPaused]);', cityStart);
const cityMenu = section('    if (!cityMenuOpen && !runtimeError) return;', '  }, [cityMenuOpen, runtimeError]);', cityStart);
const fpsPause = section('    sessionPausedRef.current = sessionPaused;', '  }, [sessionPaused]);', fpsStart);
const fpsMenu = section('    if (!intelOpen) return;', '  }, [intelOpen]);', fpsStart);
const noop = () => {};
const event = (key, code, extra = {}) => ({
  key, code, repeat: false, defaultPrevented: false,
  target: { tagName: 'CANVAS', closest: () => null },
  preventDefault() { this.defaultPrevented = true; },
  ...extra
});

// Run the current component callbacks, pause/menu effects and simulation input
// handoff. Only React bookkeeping and unrelated discrete effects are stubbed.
function fixture(mode) {
  const city = mode === 'city';
  const actions = city
    ? ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'q']
    : ['forward', 'back', 'strafeLeft', 'strafeRight', 'turnLeft', 'turnRight'];
  const calls = { interaction: 0, fire: 0, reload: 0, loot: 0, skill: 0 };
  const state = city
    ? { keys: {}, player: { x: 500, y: 500, speed: 2.35 }, destination: null, pendingInteraction: null, npcs: [], obstacles: [] }
    : { phase: 'running', moveKeys: {}, px: 0, py: 0, angle: 0, vx: 0, vy: 0, turnVel: 0 };
  const env = {
    sceneInputsRef: { current: createSceneInputs(actions) }, stateRef: { current: state },
    sessionPausedRef: { current: false }, sessionPaused: false,
    simulationClockRef: { current: null },
    cityMenuRef: { current: false }, cityMenuOpen: false, runtimeError: null,
    intelRef: { current: false }, intelOpen: false,
    document: { hidden: false }, guideRef: { current: {} }, commitGuide: noop,
    aimPointerRef: { current: emptySceneAim() }, emptySceneAim,
    useCallback: fn => fn,
    interactWithNearby: () => calls.interaction++, fire: () => calls.fire++,
    reload: () => calls.reload++, collectLoot: () => calls.loot++, activateRoleSkill: () => calls.skill++
  };
  const evaluate = body => new Function(...Object.keys(env), body)(...Object.values(env));
  const routes = evaluate((city ? cityVirtual + cityHandlers : fpsVirtual + fpsHandlers)
    + `return { down: onKeyDown, up: onKeyUp, clear: ${city ? 'clearInput' : 'clearMovement'}, visibility: onVisibilityChange, touch: ${city ? 'setVirtualKey' : 'setVirtualMove'} };`);
  const step = city
    ? () => advanceMosaicPlayer(state, { worldW: 1920, worldH: 1180 }, 1000 / 60)
    : () => new Function('state', 'selectedHero', fpsMovement)(state, { stats: { spd: 6 }, category: 'marine' });
  return {
    ...routes, state, env, calls, step,
    keys: () => city ? state.keys : state.moveKeys,
    position: () => city ? [state.player.x, state.player.y] : [state.px, state.py],
    pause(active) { env.sessionPaused = active; evaluate(city ? cityPause : fpsPause); },
    menu(active) {
      if (city) { env.cityMenuOpen = active; env.cityMenuRef.current = active; }
      else { env.intelOpen = active; env.intelRef.current = active; }
      evaluate(city ? cityMenu : fpsMenu);
    }
  };
}

for (const mode of ['city', 'fps']) {
  test(`${mode}: aliases and a touch remain independent through physical releases`, () => {
    const f = fixture(mode), action = mode === 'city' ? 'z' : 'forward';
    f.down(event('z', 'KeyW')); f.down(event('ArrowUp', 'ArrowUp'));
    f.touch('pointer:3', action, true);
    f.up(event('z', 'KeyW')); f.up(event('ArrowUp', 'ArrowUp'));
    assert.deepEqual(f.keys(), { [action]: true });
    const before = f.position(); f.step();
    assert.notDeepEqual(f.position(), before, 'The real movement code still reads the remaining owner');
    f.touch('pointer:3', action, false); assert.deepEqual(f.keys(), {});
  });

  test(`${mode}: blur cleanup requires a fresh key press before movement resumes`, () => {
    const f = fixture(mode);
    f.down(event('z', 'KeyW')); f.step(); f.clear();
    const stopped = f.position();
    f.down(event('z', 'KeyW', { repeat: true })); f.step();
    assert.deepEqual(f.keys(), {});
    assert.deepEqual(f.position(), stopped, 'A repeat must not restart movement after cleanup');
    const arrowRepeat = event('ArrowUp', 'ArrowUp', { repeat: true });
    f.down(arrowRepeat);
    assert.equal(arrowRepeat.defaultPrevented, true, 'Ignored movement repeats must not scroll the active game page');
    assert.deepEqual(f.keys(), {});
    f.up(event('z', 'KeyW')); f.down(event('z', 'KeyW')); f.step();
    assert.notDeepEqual(f.position(), stopped);
  });

  test(`${mode}: pause and local menu cleanup cannot be undone by keyboard repeat`, () => {
    for (const suspend of ['pause', 'menu']) {
      const f = fixture(mode);
      f.down(event('z', 'KeyW')); f.step();
      f[suspend](true); assert.deepEqual(f.keys(), {});
      f.down(event('z', 'KeyW')); assert.deepEqual(f.keys(), {});
      f[suspend](false);
      const stopped = f.position();
      f.down(event('z', 'KeyW', { repeat: true })); f.step();
      assert.deepEqual(f.keys(), {}, suspend);
      assert.deepEqual(f.position(), stopped, suspend);
      f.up(event('z', 'KeyW')); f.down(event('z', 'KeyW')); f.step();
      assert.notDeepEqual(f.position(), stopped, suspend);
    }
  });

  test(`${mode}: hidden-page cleanup does not revive a held movement on return`, () => {
    const f = fixture(mode);
    f.down(event('z', 'KeyW')); f.step();
    f.env.document.hidden = true; f.visibility();
    assert.deepEqual(f.keys(), {});
    f.env.document.hidden = false; f.visibility();
    f.down(event('z', 'KeyW', { repeat: true }));
    assert.deepEqual(f.keys(), {});
    f.up(event('z', 'KeyW')); f.down(event('z', 'KeyW'));
    assert.ok(Object.keys(f.keys()).length);
  });

  test(`${mode}: release follows the physical key after character and focus change`, () => {
    for (const releasedKey of ['@', 'Unidentified', 'Escape']) {
      const f = fixture(mode), action = mode === 'city' ? 'arrowup' : 'forward';
      f.down(event('q', 'KeyQ')); f.down(event('ArrowUp', 'ArrowUp'));
      f.up(event(releasedKey, 'KeyQ', { defaultPrevented: true, target: { tagName: 'INPUT' } }));
      assert.deepEqual(f.keys(), { [action]: true });
      f.up(event('ArrowUp', 'ArrowUp')); assert.deepEqual(f.keys(), {});
    }
  });

  test(`${mode}: UI input remains filtered without preventing owner cleanup`, () => {
    const f = fixture(mode);
    for (const extra of [{ defaultPrevented: true }, { target: { tagName: 'INPUT' } }, { target: { isContentEditable: true } }]) {
      f.down(event('q', 'KeyQ', extra)); assert.deepEqual(f.keys(), {});
    }
    f.down(event('q', 'KeyQ'));
    f.up(event('q', 'KeyQ', { target: { tagName: 'TEXTAREA' } }));
    assert.deepEqual(f.keys(), {});
  });
}

test('City interaction remains a single action per initial keydown', () => {
  const f = fixture('city');
  f.down(event('e', 'KeyE')); f.down(event('e', 'KeyE', { repeat: true }));
  assert.equal(f.calls.interaction, 1);
  f.pause(true); f.down(event('e', 'KeyE'));
  assert.equal(f.calls.interaction, 1);
});

test('FPS movement filtering preserves the existing fire and discrete action routes', () => {
  const f = fixture('fps');
  for (const [key, code, action] of [[' ', 'Space', 'fire'], ['r', 'KeyR', 'reload'], ['e', 'KeyE', 'loot'], ['Shift', 'ShiftLeft', 'skill']]) {
    f.down(event(key, code)); f.down(event(key, code, { repeat: true }));
    assert.equal(f.calls[action], 2, `Existing ${action} repeat routing stays unchanged`);
  }
  f.down(event('Enter', 'Enter', { target: { closest: () => ({ tagName: 'BUTTON' }) } }));
  assert.equal(f.calls.fire, 2, 'Button activation does not also fire the FPS weapon');
});
