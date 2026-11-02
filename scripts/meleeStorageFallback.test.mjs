import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MELEE_ACTIONS, MELEE_INPUT_STORAGE_KEY, createDefaultMeleeInputMaps,
  loadMeleeInputMaps, saveMeleeInputMaps, replaceMeleeBinding, readKeyboardMeleeInput
} from '../src/game/melee/meleeInputMap.js';

const blockedStorage = run => {
  const descriptors = Object.fromEntries(['window', 'localStorage'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.defineProperty(globalThis, 'window', { configurable: true, value: globalThis });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new DOMException('Storage is denied', 'SecurityError'); }
  });
  try { run(); } finally {
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
};

test('a denied browser storage getter does not block loading or applying combat bindings', () => {
  blockedStorage(() => {
    const loaded = loadMeleeInputMaps();
    assert.deepEqual(loaded, createDefaultMeleeInputMaps());
    const remapped = replaceMeleeBinding(loaded, 'player', 'moveLeft', 'KeyA');
    const applied = saveMeleeInputMaps(remapped);
    assert.equal(readKeyboardMeleeInput(new Set(['KeyA']), applied.player).horizontal, -1);
    assert.equal(readKeyboardMeleeInput(new Set(['KeyQ']), applied.player).horizontal, 0);
    assert.deepEqual(loaded.player[MELEE_ACTIONS.moveHorizontal].negative, ['KeyQ']);
  });
});

test('a full or denied storage keeps the returned remap usable without changing persisted data', () => {
  for (const name of ['QuotaExceededError', 'SecurityError']) {
    const original = createDefaultMeleeInputMaps();
    const values = new Map([[MELEE_INPUT_STORAGE_KEY, JSON.stringify(original)], ['progression', 'preserved']]);
    const storage = {
      getItem: key => values.get(key),
      setItem() { throw new DOMException('Storage write failed', name); }
    };
    const remapped = replaceMeleeBinding(loadMeleeInputMaps(storage), 'cpu', 'shield', 'ControlRight');
    const applied = saveMeleeInputMaps(remapped, storage);
    assert.equal(readKeyboardMeleeInput(new Set(['ControlRight']), applied.cpu).actions[MELEE_ACTIONS.shield], true);
    assert.deepEqual(JSON.parse(values.get(MELEE_INPUT_STORAGE_KEY)), original);
    assert.equal(values.get('progression'), 'preserved');
  }
});

test('blocked storage methods fall back to independent defaults and do not block reset', () => {
  const storage = {
    get getItem() { throw new DOMException('Read is denied', 'SecurityError'); },
    get setItem() { throw new DOMException('Write is denied', 'SecurityError'); }
  };
  const first = loadMeleeInputMaps(storage);
  first.player[MELEE_ACTIONS.jump].push('KeyW');
  const second = loadMeleeInputMaps(storage);
  assert.deepEqual(second.player[MELEE_ACTIONS.jump], ['Space']);
  assert.deepEqual(saveMeleeInputMaps(createDefaultMeleeInputMaps(), storage), createDefaultMeleeInputMaps());
});
