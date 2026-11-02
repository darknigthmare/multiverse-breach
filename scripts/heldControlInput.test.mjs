import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHeldControlInput } from '../src/game/heldControlInput.js';
import { createSceneInputs } from '../src/game/sceneInputs.js';

const event = extra => ({
  button: 0, pointerId: 1, defaultPrevented: false, repeat: false,
  preventDefault() { this.defaultPrevented = true; },
  stopPropagation() { this.stopped = true; },
  ...extra
});
const key = (code, extra) => event({ code, key: code === 'Space' ? ' ' : 'Enter', ...extra });
function fixture() {
  const inputs = createSceneInputs(['guard', 'left']);
  const captures = new Set(), events = [];
  let disabled = false;
  const target = {
    setPointerCapture: id => captures.add(id),
    hasPointerCapture: id => captures.has(id),
    releasePointerCapture: id => captures.delete(id)
  };
  const makeControl = (sourcePrefix, action) => createHeldControlInput({
    sourcePrefix, isDisabled: () => disabled,
    onInput(source, phase) {
      events.push({ source, phase });
      if (phase === 'down') inputs.hold(source, action);
      else inputs.release(source);
    }
  });
  return { inputs, captures, target, events, makeControl,
    control: makeControl('guard', 'guard'),
    pointer: (pointerId, extra) => event({ pointerId, currentTarget: target, ...extra }),
    disable: () => { disabled = true; }, enable: () => { disabled = false; }
  };
}

test('two pointers keep the action until its final physical owner releases', () => {
  for (const reversed of [false, true]) {
    const f = fixture(), first = reversed ? 2 : 1, last = reversed ? 1 : 2;
    f.control.onPointerDown(f.pointer(1)); f.control.onPointerDown(f.pointer(2));
    assert.equal(f.captures.size, 2);
    f.control.onPointerUp(f.pointer(first));
    assert.deepEqual(f.inputs.snapshot(), { guard: true });
    f.control.onLostPointerCapture(f.pointer(first));
    assert.deepEqual(f.inputs.snapshot(), { guard: true });
    f.control.onPointerUp(f.pointer(last));
    assert.deepEqual(f.inputs.snapshot(), {});
    assert.equal(f.captures.size, 0);
    assert.equal(f.events.length, 4, 'lost capture cannot emit a second release');
  }
});

test('Space, Enter, NumpadEnter and a pointer have independent owners', () => {
  const f = fixture();
  f.control.onPointerDown(f.pointer(1));
  for (const code of ['Space', 'Enter', 'NumpadEnter']) f.control.onKeyDown(key(code));
  f.control.onKeyDown(key('Space', { repeat: true }));
  assert.equal(f.events.length, 4);
  f.control.onKeyUp(key('Enter'));
  f.control.onKeyUp(key('NumpadEnter'));
  assert.deepEqual(f.inputs.snapshot(), { guard: true });
  f.control.onKeyUp(key('Space', { key: 'Unidentified' }));
  assert.deepEqual(f.inputs.snapshot(), { guard: true });
  f.control.onPointerUp(f.pointer(1));
  assert.deepEqual(f.inputs.snapshot(), {});
});

test('button blur releases its keyboard activation while retaining live pointers', () => {
  const f = fixture();
  f.control.onPointerDown(f.pointer(1)); f.control.onKeyDown(key('Space'));
  f.control.onBlur();
  assert.deepEqual(f.inputs.snapshot(), { guard: true });
  assert.equal(f.captures.size, 1);
  f.control.onPointerUp(f.pointer(1));
  assert.deepEqual(f.inputs.snapshot(), {});
  f.control.onKeyUp(key('Space'));
  assert.equal(f.events.length, 4, 'late key release stays inert');
});

test('pointer cancellation is source-specific, even across separate buttons', () => {
  const f = fixture(), left = f.makeControl('left', 'left');
  f.control.onPointerDown(f.pointer(1)); f.control.onPointerDown(f.pointer(2));
  left.onPointerDown(f.pointer(3));
  f.control.onPointerCancel(f.pointer(2));
  f.control.onLostPointerCapture(f.pointer(2));
  f.control.onPointerUp(f.pointer(999));
  assert.deepEqual(f.inputs.snapshot(), { guard: true, left: true });
  f.control.onLostPointerCapture(f.pointer(1));
  assert.deepEqual(f.inputs.snapshot(), { left: true });
  left.onPointerUp(f.pointer(3));
  assert.deepEqual(f.inputs.snapshot(), {});
});

test('right clicks, disabled controls, consumed events and stray repeats acquire nothing', () => {
  const f = fixture();
  f.control.onPointerDown(f.pointer(1, { button: 2 }));
  f.control.onPointerDown(f.pointer(1, { defaultPrevented: true }));
  f.control.onKeyDown(key('Space', { repeat: true }));
  f.control.onKeyDown(key('Enter', { defaultPrevented: true }));
  const ordinary = key('KeyQ', { key: 'q' }); f.control.onKeyDown(ordinary);
  assert.equal(ordinary.defaultPrevented, false);
  f.disable();
  f.control.onPointerDown(f.pointer(1)); f.control.onKeyDown(key('Space'));
  assert.deepEqual(f.events, []);
});

test('reset clears all owners once, releases capture and requires a fresh press', () => {
  const f = fixture();
  f.control.onPointerDown(f.pointer(1)); f.control.onKeyDown(key('Space'));
  f.control.clear(); f.control.clear();
  assert.deepEqual(f.inputs.snapshot(), {});
  assert.equal(f.captures.size, 0);
  f.control.onPointerUp(f.pointer(1)); f.control.onKeyUp(key('Space'));
  f.control.onKeyDown(key('Space', { repeat: true }));
  assert.equal(f.events.length, 4);
  f.control.onKeyDown(key('Space'));
  assert.deepEqual(f.inputs.snapshot(), { guard: true });
});

test('scene reset does not suppress a new owner or restore an older held source', () => {
  const f = fixture();
  f.control.onPointerDown(f.pointer(1));
  f.inputs.clear(); // A tag or engine replacement does not remount the button.
  f.control.onPointerDown(f.pointer(2));
  f.control.onPointerUp(f.pointer(1));
  assert.deepEqual(f.inputs.snapshot(), { guard: true });
  f.control.onPointerUp(f.pointer(2));
  assert.deepEqual(f.inputs.snapshot(), {});
});

test('window release fallback works if pointer capture is unavailable', () => {
  const f = fixture();
  f.target.setPointerCapture = () => { throw new Error('Pointer capture unavailable'); };
  f.control.onPointerDown(f.pointer(1));
  f.control.onPointerUp(f.pointer(1, { currentTarget: {} }));
  assert.deepEqual(f.inputs.snapshot(), {});
  assert.equal(f.events.at(-1).phase, 'up');
});
