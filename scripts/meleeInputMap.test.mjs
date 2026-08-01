import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  DEFAULT_GAMEPAD_MELEE_BINDINGS,
  MELEE_ACTIONS,
  MELEE_INPUT_MAP_VERSION,
  MELEE_INPUT_STORAGE_KEY,
  createDefaultMeleeInputMaps,
  diffMeleeActionEdges,
  formatMeleeInputCode,
  getMeleeActionsForCode,
  loadMeleeInputMaps,
  mergeMeleeInputSnapshots,
  normalizeMeleeInputMaps,
  readGamepadMeleeInput,
  readKeyboardMeleeInput,
  replaceMeleeBinding,
  saveMeleeInputMaps,
  toEngineHeldInput
} from '../src/game/melee/meleeInputMap.js';

const createStorage = initialValue => {
  const values = new Map();
  if (initialValue !== undefined) values.set(MELEE_INPUT_STORAGE_KEY, initialValue);
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    value: key => values.get(key)
  };
};

const gamepad = ({ axes = [0, 0], pressed = [], values = {} } = {}) => ({
  axes,
  buttons: Array.from({ length: 16 }, (_, index) => ({
    pressed: pressed.includes(index),
    value: values[index] || 0
  }))
});

test('storage fallback returns independent defaults for missing and invalid data', () => {
  const missing = loadMeleeInputMaps(createStorage());
  const invalid = loadMeleeInputMaps(createStorage('{invalid-json'));

  assert.equal(missing.version, MELEE_INPUT_MAP_VERSION);
  assert.deepEqual(invalid, missing);
  missing.player[MELEE_ACTIONS.jump].push('KeyW');
  assert.deepEqual(invalid.player[MELEE_ACTIONS.jump], ['Space']);
  assert.deepEqual(loadMeleeInputMaps(null).player[MELEE_ACTIONS.attackLight], ['KeyJ']);
});

test('legacy opponent storage migrates to cpu and invalid slots fall back safely', () => {
  const storage = createStorage(JSON.stringify({
    version: 0,
    player: {
      [MELEE_ACTIONS.jump]: [' KeyW ', 'KeyW', ''],
      [MELEE_ACTIONS.moveHorizontal]: { negative: [], positive: ['KeyE'] }
    },
    opponent: {
      [MELEE_ACTIONS.attackLight]: ['Digit7']
    }
  }));
  const migrated = loadMeleeInputMaps(storage);

  assert.equal(migrated.version, MELEE_INPUT_MAP_VERSION);
  assert.deepEqual(migrated.player[MELEE_ACTIONS.jump], ['KeyW']);
  assert.deepEqual(migrated.player[MELEE_ACTIONS.moveHorizontal].negative, ['KeyQ']);
  assert.deepEqual(migrated.player[MELEE_ACTIONS.moveHorizontal].positive, ['KeyE']);
  assert.deepEqual(migrated.cpu[MELEE_ACTIONS.attackLight], ['Digit7']);
  assert.deepEqual(migrated.cpu[MELEE_ACTIONS.jump], ['NumpadEnter']);
});

test('save and remap normalize data without mutating the source map', () => {
  const defaults = createDefaultMeleeInputMaps();
  const remappedAxis = replaceMeleeBinding(defaults, 'player', 'moveLeft', 'KeyA');
  const remappedAction = replaceMeleeBinding(remappedAxis, 'opponent', 'shield', 'ControlRight');

  assert.deepEqual(defaults.player[MELEE_ACTIONS.moveHorizontal].negative, ['KeyQ']);
  assert.deepEqual(remappedAction.player[MELEE_ACTIONS.moveHorizontal].negative, ['KeyA']);
  assert.deepEqual(remappedAction.cpu[MELEE_ACTIONS.shield], ['ControlRight']);
  assert.deepEqual(replaceMeleeBinding(remappedAction, 'player', 'unknown', 'KeyX'), remappedAction);

  const storage = createStorage();
  const saved = saveMeleeInputMaps({ player: remappedAction.player, opponent: remappedAction.cpu }, storage);
  assert.deepEqual(JSON.parse(storage.value(MELEE_INPUT_STORAGE_KEY)), saved);
  assert.equal(saved.version, MELEE_INPUT_MAP_VERSION);
});

test('keyboard input resolves axes, shared bindings and engine held input', () => {
  const maps = normalizeMeleeInputMaps();
  const snapshot = readKeyboardMeleeInput(
    new Set(['KeyQ', 'KeyS', 'KeyJ', 'ShiftRight', 'Space']),
    maps.player
  );

  assert.equal(snapshot.horizontal, -1);
  assert.equal(snapshot.vertical, 1);
  assert.equal(snapshot.actions[MELEE_ACTIONS.attackLight], true);
  assert.equal(snapshot.actions[MELEE_ACTIONS.shield], true);
  assert.equal(snapshot.actions[MELEE_ACTIONS.crouch], true);
  assert.equal(snapshot.actions[MELEE_ACTIONS.drop], true);
  assert.deepEqual(toEngineHeldInput(snapshot), {
    left: true,
    right: false,
    up: false,
    down: true,
    jump: true,
    crouch: true,
    guard: true
  });
  assert.deepEqual(
    getMeleeActionsForCode('KeyS', maps.player).sort(),
    [MELEE_ACTIONS.crouch, MELEE_ACTIONS.drop, MELEE_ACTIONS.moveVertical].sort()
  );
});

test('gamepad supports analog axes, deadzone fallback, buttons and ledge actions', () => {
  const analog = readGamepadMeleeInput(gamepad({
    axes: [0.72, -0.8],
    pressed: [
      DEFAULT_GAMEPAD_MELEE_BINDINGS.jump,
      DEFAULT_GAMEPAD_MELEE_BINDINGS.attackLight,
      DEFAULT_GAMEPAD_MELEE_BINDINGS.shield
    ]
  }));
  assert.equal(analog.horizontal, 0.72);
  assert.equal(analog.vertical, -0.8);
  assert.equal(analog.actions[MELEE_ACTIONS.jump], true);
  assert.equal(analog.actions[MELEE_ACTIONS.attackLight], true);
  assert.equal(analog.actions[MELEE_ACTIONS.ledgeAttack], true);
  assert.equal(analog.actions[MELEE_ACTIONS.shield], true);
  assert.equal(analog.actions[MELEE_ACTIONS.climb], true);

  const dpad = readGamepadMeleeInput(gamepad({ axes: [0.1, 0.1], pressed: [14, 13] }));
  assert.equal(dpad.horizontal, -1);
  assert.equal(dpad.vertical, 1);
  assert.equal(dpad.actions[MELEE_ACTIONS.crouch], true);
  assert.equal(dpad.actions[MELEE_ACTIONS.drop], true);

  const valuedButton = readGamepadMeleeInput(gamepad({ values: { 4: 0.8 } }));
  assert.equal(valuedButton.actions[MELEE_ACTIONS.special], true);
});

test('snapshot merge and action edges report presses and releases once', () => {
  const keyboard = {
    horizontal: -0.4,
    vertical: 0,
    actions: { [MELEE_ACTIONS.jump]: true, [MELEE_ACTIONS.shield]: true }
  };
  const pad = {
    horizontal: 0.8,
    vertical: -0.9,
    actions: { [MELEE_ACTIONS.attackLight]: true, [MELEE_ACTIONS.shield]: true }
  };
  const merged = mergeMeleeInputSnapshots(keyboard, null, pad);

  assert.equal(merged.horizontal, 0.8);
  assert.equal(merged.vertical, -0.9);
  assert.equal(merged.actions[MELEE_ACTIONS.jump], true);
  assert.equal(merged.actions[MELEE_ACTIONS.attackLight], true);

  const next = {
    ...merged,
    actions: { ...merged.actions, [MELEE_ACTIONS.jump]: false, [MELEE_ACTIONS.taunt]: true }
  };
  const edges = diffMeleeActionEdges(merged, next);
  assert.deepEqual(edges.pressed, [MELEE_ACTIONS.taunt]);
  assert.deepEqual(edges.released, [MELEE_ACTIONS.jump]);
  assert.deepEqual(diffMeleeActionEdges(next, next), { pressed: [], released: [] });
});

test('input code formatting remains readable for keyboard labels', () => {
  assert.equal(formatMeleeInputCode('KeyJ'), 'J');
  assert.equal(formatMeleeInputCode('ArrowLeft'), 'FLECHE LEFT');
  assert.equal(formatMeleeInputCode('ShiftLeft'), 'SHIFT G');
  assert.equal(formatMeleeInputCode('Space'), 'ESPACE');
});
