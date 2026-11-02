import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRaceKeyboardState, createRaceRunGuard, createRaceTouchState } from '../src/game/raceSessionControls.js';

const source = readFileSync(new URL('../src/components/RaceMode.jsx', import.meta.url), 'utf8');
const prelude = source.slice(source.indexOf('const CONTROL_KEYS ='), source.indexOf('const formatRaceTime ='));
const between = (startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `missing real source region: ${startMarker}`);
  return source.slice(start + startMarker.length, end);
};
const functionSource = (name, indentation = '    ') => {
  const startMarker = `${indentation}const ${name} = `;
  return between(startMarker, `\n${indentation}};`) + `\n${indentation}}`;
};
const event = (key, code, extra = {}) => ({
  key, code, repeat: false, defaultPrevented: false,
  target: { tagName: 'CANVAS', isContentEditable: false, closest: () => null },
  preventDefault() { this.defaultPrevented = true; },
  ...extra
});

// Execute the real component handlers and lifecycle bodies, including its real
// key normalization. No duplicate test mapping can hide an AZERTY alias bug.
const fixture = () => {
  const calls = { items: 0, recoveries: 0 };
  const runGuard = createRaceRunGuard();
  const simulationClock = { reset() {} };
  const engine = {
    finished: false, setInput() {},
    useItem() { calls.items++; }, recoverPlayer() { calls.recoveries++; }
  };
  const noop = () => {};
  const env = {
    runGuard, runGuardRef: { current: runGuard },
    engine, engineRef: { current: engine }, sessionPausedRef: { current: false },
    sessionPaused: false, raceMenuOpen: false,
    document: { hidden: false, removeEventListener: noop },
    window: { removeEventListener: noop }, cancelAnimationFrame: noop, animationId: 1,
    keysRef: { current: {} }, keyboardStateRef: { current: createRaceKeyboardState() },
    touchStateRef: { current: createRaceTouchState() }, keyPulseRef: { current: {} },
    simulationClock, simulationClockRef: { current: simulationClock },
    sessionExitRequestRef: { current: 0 }, sessionExitRequest: 1,
    setRaceMenuOpen: noop, setRaceStarted: noop, setSummary: noop, setSnapshot: noop,
    setRuntimeError: noop, setRaceNonce: noop, setTrackId: noop,
    onSessionStart: noop, onSessionEndRef: { current: noop },
    summary: null, pilotId: 'pilot', trackId: 'atrium',
    raceMusicStateRef: { current: 'running' }, raceMusicStage: {},
    sound: { stopBgm: noop, playStageBgm: noop }
  };
  const evaluate = body => new Function(...Object.keys(env), prelude + '\n' + body)(...Object.values(env));
  const getFunction = (name, indentation) => evaluate(`return (${functionSource(name, indentation)});`);
  env.clearInputs = getFunction('clearInputs');
  env.onKeyDown = getFunction('onKeyDown');
  env.onKeyUp = getFunction('onKeyUp');
  env.onVisibilityChange = getFunction('onVisibilityChange');
  return { calls, env, evaluate, getFunction, down: env.onKeyDown, up: env.onKeyUp };
};

test('Q/ArrowLeft and Z/ArrowUp stay held until their final physical key is released', () => {
  for (const [key, code, arrow, action] of [
    ['q', 'KeyQ', 'ArrowLeft', 'left'], ['z', 'KeyZ', 'ArrowUp', 'up']
  ]) {
    for (const releaseAliasFirst of [true, false]) {
      const f = fixture();
      f.down(event(arrow, arrow));
      f.down(event(key, code));
      f.up(releaseAliasFirst ? event(key, code) : event(arrow, arrow));
      assert.equal(f.env.keysRef.current[action], true);
      f.up(releaseAliasFirst ? event(arrow, arrow) : event(key, code));
      assert.deepEqual(f.env.keysRef.current, {});
    }
  }
});

test('keyup releases the recorded physical action after character, case or focus changes', () => {
  for (const releasedKey of ['Q', 'a', 'Unidentified']) {
    const f = fixture();
    f.down(event('q', 'KeyQ'));
    f.down(event('z', 'KeyZ'));
    f.up(event(releasedKey, 'KeyQ', {
      defaultPrevented: true, target: { tagName: 'INPUT', isContentEditable: false }
    }));
    assert.deepEqual(f.env.keysRef.current, { up: true });
    f.up(event('Z', 'KeyZ'));
    assert.deepEqual(f.env.keysRef.current, {});
  }
});

test('source identity keeps left/right modifier positions separate without adding bindings', () => {
  for (const withCode of [true, false]) {
    const keyboard = createRaceKeyboardState();
    const left = event('Shift', withCode ? 'ShiftLeft' : undefined, { location: 1 });
    const right = event('Shift', withCode ? 'ShiftRight' : undefined, { location: 2 });
    keyboard.hold(left, 'left'); keyboard.hold(right, 'left');
    keyboard.release(left);
    assert.deepEqual(keyboard.snapshot(), { left: true });
    keyboard.release(right);
    assert.deepEqual(keyboard.snapshot(), {});
  }
});

test('keyboard releases cannot cancel touch or virtual pulses in the merged engine input', () => {
  const f = fixture();
  f.down(event('q', 'KeyQ'));
  f.env.touchStateRef.current.hold(7, 'left');
  f.up(event('q', 'KeyQ'));
  assert.deepEqual(f.env.keysRef.current, {});
  assert.deepEqual({ ...f.env.keysRef.current, ...f.env.touchStateRef.current.snapshot(), space: true }, { left: true, space: true });
  f.env.touchStateRef.current.release(7);
  assert.deepEqual(f.env.touchStateRef.current.snapshot(), {});
});

test('E and R are one-shot commands and never enter the held keyboard snapshot', () => {
  const f = fixture();
  for (const [key, code] of [['e', 'KeyE'], ['r', 'KeyR']]) {
    f.down(event(key, code)); f.down(event(key, code, { repeat: true })); f.up(event(key, code));
  }
  assert.deepEqual(f.calls, { items: 1, recoveries: 1 });
  assert.deepEqual(f.env.keyboardStateRef.current.snapshot(), {});
  assert.deepEqual(f.env.keysRef.current, {});
});

test('forms, consumed events, paused/hidden/ended sessions do not acquire controls', () => {
  const f = fixture();
  for (const tagName of ['INPUT', 'TEXTAREA', 'SELECT']) {
    for (const [key, code] of [['q', 'KeyQ'], ['e', 'KeyE'], ['r', 'KeyR']]) {
      f.down(event(key, code, { target: { tagName } }));
    }
  }
  f.down(event('q', 'KeyQ', { target: { tagName: 'DIV', isContentEditable: true } }));
  f.down(event('q', 'KeyQ', { defaultPrevented: true }));
  f.down(event('q', 'KeyQ', { repeat: true }));
  f.env.sessionPausedRef.current = true; f.down(event('q', 'KeyQ'));
  f.env.sessionPausedRef.current = false;
  f.env.document.hidden = true; f.down(event('q', 'KeyQ')); f.env.document.hidden = false;
  f.env.engine.finished = true; f.down(event('q', 'KeyQ')); f.env.engine.finished = false;
  f.env.runGuard.dispose(); f.down(event('q', 'KeyQ'));
  assert.deepEqual(f.calls, { items: 0, recoveries: 0 });
  assert.deepEqual(f.env.keyboardStateRef.current.snapshot(), {});
  assert.deepEqual(f.env.keysRef.current, {});
});

test('Space keeps native button activation, while canvas Space still drifts', () => {
  const f = fixture();
  const native = event(' ', 'Space', { target: { tagName: 'BUTTON', closest: selector => selector.includes('button') ? {} : null } });
  f.down(native);
  assert.equal(native.defaultPrevented, false);
  assert.deepEqual(f.env.keysRef.current, {});
  f.down(event(' ', 'Space'));
  assert.deepEqual(f.env.keysRef.current, { space: true });
});

const pauseBody = source.match(/useEffect\(\(\) => \{\s*(sessionPausedRef\.current = sessionPaused \|\| raceMenuOpen;[\s\S]*?)\}, \[sessionPaused, raceMenuOpen\]\);/)?.[1];
assert.ok(pauseBody, 'missing real race pause effect');
const cleanupBody = between("document.addEventListener('visibilitychange', onVisibilityChange);", '\n  }, [raceStarted, trackId, raceNonce]);');
const exitBody = between('  // Le retour au hub', '\n  }, [sessionExitRequest]);').split('useEffect(() => {')[1];
const errorBody = between("console.error('Race render loop failed', error);", '\n      }');

const resets = [
  ['shell pause', f => { f.env.sessionPaused = true; f.evaluate(pauseBody); }],
  ['garage pause', f => { f.env.raceMenuOpen = true; f.evaluate(pauseBody); }],
  ['window blur', f => f.env.clearInputs()],
  ['hidden tab', f => { f.env.document.hidden = true; f.env.onVisibilityChange(); }],
  ['restart', f => f.getFunction('resetRace', '  ')()],
  ['track change', f => f.getFunction('selectTrack', '  ')('atrium')],
  ['start', f => f.getFunction('startRace', '  ')()],
  ['return to grid', f => f.getFunction('returnToGrid', '  ')()],
  ['confirmed exit', f => f.evaluate(exitBody)],
  ['render failure', f => f.evaluate(errorBody)],
  ['unmount', f => f.evaluate(cleanupBody)()]
];

for (const [name, reset] of resets) {
  test(`${name} clears every keyboard owner and late releases stay neutral`, () => {
    const f = fixture();
    f.down(event('ArrowLeft', 'ArrowLeft')); f.down(event('q', 'KeyQ'));
    f.down(event('ArrowUp', 'ArrowUp')); f.down(event('z', 'KeyZ'));
    assert.deepEqual(f.env.keysRef.current, { left: true, up: true });
    reset(f);
    assert.deepEqual(f.env.keyboardStateRef.current.snapshot(), {});
    assert.deepEqual(f.env.keysRef.current, {});
    f.up(event('q', 'KeyQ')); f.up(event('ArrowUp', 'ArrowUp'));
    assert.deepEqual(f.env.keysRef.current, {});
  });
}

test('resume does not replay held repeats; a fresh press acquires control again', () => {
  const f = fixture();
  f.down(event('q', 'KeyQ'));
  f.env.sessionPaused = true; f.evaluate(pauseBody);
  f.env.sessionPaused = false; f.evaluate(pauseBody);
  f.down(event('q', 'KeyQ', { repeat: true }));
  assert.deepEqual(f.env.keysRef.current, {});
  f.up(event('q', 'KeyQ'));
  f.down(event('q', 'KeyQ'));
  assert.deepEqual(f.env.keysRef.current, { left: true });
});

test('malformed sources and one-shot action names cannot create held inputs', () => {
  const keyboard = createRaceKeyboardState();
  for (const value of [null, {}, { key: '' }]) assert.equal(keyboard.hold(value, 'left'), false);
  assert.equal(keyboard.hold(event('e', 'KeyE'), 'e'), false);
  assert.equal(keyboard.hold(event('r', 'KeyR'), 'r'), false);
  assert.deepEqual(keyboard.snapshot(), {});
});
