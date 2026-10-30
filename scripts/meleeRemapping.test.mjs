import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import * as input from '../src/game/melee/meleeInputMap.js';

const panel = readFileSync(new URL('../src/components/MeleeControlsPanel.jsx', import.meta.url), 'utf8');
const section = (start, end) => {
  const first = panel.indexOf(start), last = panel.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `Missing actual remapping boundary: ${start}`);
  return panel.slice(first, last);
};
const labels = section('const SLOT_LABELS = ', 'const STATE_LABELS = ');
const format = section('const formatCode = ', 'const readableState = ');
const copy = section('  const copy = isFrench', '  const titleId = ');
const callbacks = section('  const slotLabel = ', '  const renderBindings = ');
const blur = section('      onBlur={', '      style=')
  .slice('      onBlur={'.length).trim().slice(0, -1);

// Execute the real panel callbacks, labels and live announcements. Only React
// state bookkeeping is replaced; the actual mapping and persistence helpers run.
const createPanel = new Function('input', 'initialMaps', 'isFrench', `
  const { MELEE_REMAPPABLE_SLOTS, formatMeleeInputCode, findMeleeAxisConflict } = input;
  const trial = false;
  let normalizedMaps = input.normalizeMeleeInputMaps(initialMaps);
  let capture = null, announcement = '', resets = 0;
  const remaps = [], pending = [];
  const setCapture = value => pending.push(() => { capture = value; });
  const setAnnouncement = value => pending.push(() => { announcement = value; });
  const onRemap = (side, slot, code) => {
    remaps.push({ side, slot, code });
    pending.push(() => { normalizedMaps = input.replaceMeleeBinding(normalizedMaps, side, slot, code); });
  };
  const onReset = () => { resets++; pending.push(() => { normalizedMaps = input.createDefaultMeleeInputMaps(); }); };
  ${labels}
  ${format}
  ${copy}
  ${callbacks}
  const handleBlur = ${blur};
  const invoke = (callback, ...args) => {
    callback(...args);
    // React retains this render's captured values until the callback returns.
    while (pending.length) pending.shift()();
  };
  return {
    begin: (side, slot) => invoke(beginCapture, side, MELEE_REMAPPABLE_SLOTS.find(entry => entry.id === slot)),
    key: event => invoke(handleCaptureKey, event),
    blur: event => invoke(handleBlur, event),
    reset: () => invoke(resetBindings),
    read: () => ({ capture, announcement, maps: normalizedMaps, remaps, resets })
  };
`);
const fixture = ({ maps = input.createDefaultMeleeInputMaps(), lang = 'fr' } = {}) => createPanel(input, maps, lang === 'fr');
const key = (code, repeat = false) => ({
  code, repeat, prevented: false, stopped: false,
  preventDefault() { this.prevented = true; },
  stopPropagation() { this.stopped = true; }
});

for (const side of ['player', 'cpu']) {
  for (const [slot, action, opposite, expected] of [
    ['moveLeft', 'MoveHorizontal', 'positive', 1],
    ['moveRight', 'MoveHorizontal', 'negative', -1],
    ['moveUp', 'MoveVertical', 'positive', 1],
    ['moveDown', 'MoveVertical', 'negative', -1]
  ]) {
    test(`${side} cannot bind ${slot} to the opposite direction of its own axis`, () => {
      const maps = input.createDefaultMeleeInputMaps();
      const original = structuredClone(maps);
      const code = maps[side][action][opposite][0];
      const result = input.replaceMeleeBinding(maps, side, slot, code);
      assert.deepEqual(result, original);
      assert.deepEqual(maps, original, 'Refusing a binding must not mutate the caller');
      const snapshot = input.readKeyboardMeleeInput(new Set([code]), result[side]);
      assert.equal(snapshot[action === 'MoveHorizontal' ? 'horizontal' : 'vertical'], expected);
    });
  }
}

test('every existing alias of the opposite direction stays protected', () => {
  const maps = input.createDefaultMeleeInputMaps();
  maps.cpu.MoveHorizontal.negative = ['ArrowLeft', 'KeyA'];
  maps.cpu.MoveHorizontal.positive = ['ArrowRight', 'KeyD'];
  for (const code of ['ArrowRight', 'KeyD']) {
    assert.deepEqual(input.replaceMeleeBinding(maps, 'cpu', 'moveLeft', code), maps);
  }
});

test('free keys, contextual aliases and bindings on the other player remain supported', () => {
  const maps = input.createDefaultMeleeInputMaps();
  const changed = input.replaceMeleeBinding(maps, 'player', 'moveLeft', 'ArrowLeft');
  assert.equal(input.readKeyboardMeleeInput(new Set(['ArrowLeft']), changed.player).horizontal, -1);
  assert.equal(input.readKeyboardMeleeInput(new Set(['ArrowLeft']), changed.cpu).horizontal, -1);
  assert.deepEqual(input.getMeleeActionsForCode('KeyS', changed.player).sort(), ['MoveVertical', 'Crouch', 'Drop'].sort());
  assert.deepEqual(input.getMeleeActionsForCode('KeyJ', changed.player).sort(), ['AttackLight', 'LedgeAttack'].sort());
  assert.deepEqual(changed.cpu, maps.cpu);
  assert.deepEqual(changed.player.Pause, maps.player.Pause);
});

test('the legacy opponent side and normalized code cannot bypass refusal or persistence', () => {
  const maps = input.createDefaultMeleeInputMaps();
  const result = input.replaceMeleeBinding(maps, 'opponent', 'moveLeft', ' ArrowRight ');
  const values = new Map();
  const storage = { getItem: name => values.get(name) ?? null, setItem: (name, value) => values.set(name, value) };
  input.saveMeleeInputMaps(result, storage);
  assert.deepEqual(input.loadMeleeInputMaps(storage), maps);
});

for (const code of ['Enter', 'NumpadEnter', 'KeyW']) {
  test(`a held ${code} repeat cannot complete a newly opened capture`, () => {
    const f = fixture();
    f.begin('player', 'moveLeft');
    const event = key(code, true);
    f.key(event);
    assert.equal(event.prevented, true);
    assert.equal(event.stopped, true);
    assert.deepEqual(f.read().capture, { side: 'player', slot: 'moveLeft' });
    assert.deepEqual(f.read().remaps, []);
    assert.deepEqual(f.read().maps, input.createDefaultMeleeInputMaps());
    f.key(key('KeyA'));
    assert.equal(f.read().capture, null);
    assert.deepEqual(f.read().maps.player.MoveHorizontal.negative, ['KeyA']);
  });
}

for (const [lang, side, slot, conflict, fresh, expectedFeedback] of [
  ['fr', 'player', 'moveLeft', 'KeyD', 'KeyA', /GAUCHE.*D.*DROITE.*autre touche/],
  ['en', 'cpu', 'moveUp', 'ArrowDown', 'KeyW', /UP.*DOWN.*another key/]
]) {
  test(`${lang} conflict feedback keeps capture open and accepts a subsequent free key`, () => {
    const f = fixture({ lang });
    f.begin(side, slot);
    const event = key(conflict);
    f.key(event);
    assert.equal(event.prevented, true);
    assert.equal(event.stopped, true);
    assert.deepEqual(f.read().capture, { side, slot });
    assert.deepEqual(f.read().remaps, []);
    assert.deepEqual(f.read().maps, input.createDefaultMeleeInputMaps());
    assert.match(f.read().announcement, expectedFeedback);
    f.key(key(fresh));
    assert.equal(f.read().capture, null);
    assert.deepEqual(f.read().remaps, [{ side, slot, code: fresh }]);
  });
}

test('Escape cancels a rejected binding and stays consumed by the remapping panel', () => {
  const f = fixture();
  f.begin('player', 'moveLeft'); f.key(key('KeyD'));
  const event = key('Escape'); f.key(event);
  assert.equal(event.prevented, true); assert.equal(event.stopped, true);
  assert.equal(f.read().capture, null);
  assert.deepEqual(f.read().maps, input.createDefaultMeleeInputMaps());
  assert.equal(f.read().announcement, 'Remappage annule.');
});

test('moving focus inside the panel retains capture; leaving it cancels without rebinding', () => {
  const f = fixture(); f.begin('player', 'moveLeft');
  const currentTarget = { contains: target => target === 'inside' };
  f.blur({ currentTarget, relatedTarget: 'inside' });
  assert.deepEqual(f.read().capture, { side: 'player', slot: 'moveLeft' });
  f.blur({ currentTarget, relatedTarget: null });
  assert.equal(f.read().capture, null); assert.deepEqual(f.read().remaps, []);
});

test('reset cancels capture and restores the complete existing defaults', () => {
  const maps = input.replaceMeleeBinding(input.createDefaultMeleeInputMaps(), 'player', 'moveLeft', 'KeyA');
  const f = fixture({ maps }); f.begin('player', 'moveLeft'); f.reset();
  assert.equal(f.read().capture, null); assert.equal(f.read().resets, 1);
  assert.deepEqual(f.read().maps, input.createDefaultMeleeInputMaps());
});

test('a fresh Enter remains bindable after its activation press has been released', () => {
  const f = fixture(); f.begin('player', 'jump'); f.key(key('Enter'));
  assert.equal(f.read().capture, null);
  assert.deepEqual(f.read().maps.player.Jump, ['Enter']);
});

test('unidentified keys keep capture open without changing bindings', () => {
  const f = fixture(); f.begin('player', 'moveLeft'); const event = key('Unidentified'); f.key(event);
  assert.equal(event.prevented, true); assert.equal(event.stopped, true);
  assert.deepEqual(f.read().capture, { side: 'player', slot: 'moveLeft' });
  assert.deepEqual(f.read().remaps, []);
});

test('keyboard events outside an active capture remain untouched', () => {
  const f = fixture(); const event = key('KeyZ'); f.key(event);
  assert.equal(event.prevented, false); assert.equal(event.stopped, false);
  assert.deepEqual(f.read().remaps, []);
});
