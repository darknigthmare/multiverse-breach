export const MELEE_INPUT_MAP_VERSION = 1;
export const MELEE_INPUT_STORAGE_KEY = 'multiverseBreach.meleeInputMap.v1';

export const MELEE_ACTIONS = Object.freeze({
  moveHorizontal: 'MoveHorizontal',
  moveVertical: 'MoveVertical',
  jump: 'Jump',
  crouch: 'Crouch',
  attackLight: 'AttackLight',
  chargedAttack: 'ChargedAttack',
  special: 'Special',
  shield: 'Shield',
  taunt: 'Taunt',
  climb: 'Climb',
  drop: 'Drop',
  ledgeAttack: 'LedgeAttack',
  pause: 'Pause'
});

const uniqueCodes = values => [...new Set(
  (Array.isArray(values) ? values : [values])
    .map(value => String(value || '').trim())
    .filter(Boolean)
)];

const playerDefaults = {
  [MELEE_ACTIONS.moveHorizontal]: { negative: ['KeyQ'], positive: ['KeyD'] },
  [MELEE_ACTIONS.moveVertical]: { negative: ['KeyZ'], positive: ['KeyS'] },
  [MELEE_ACTIONS.jump]: ['Space'],
  [MELEE_ACTIONS.crouch]: ['KeyS'],
  [MELEE_ACTIONS.attackLight]: ['KeyJ'],
  [MELEE_ACTIONS.chargedAttack]: ['KeyK'],
  [MELEE_ACTIONS.special]: ['KeyL'],
  [MELEE_ACTIONS.shield]: ['KeyI', 'ShiftLeft', 'ShiftRight'],
  [MELEE_ACTIONS.taunt]: ['KeyU'],
  [MELEE_ACTIONS.climb]: ['KeyZ'],
  [MELEE_ACTIONS.drop]: ['KeyS'],
  [MELEE_ACTIONS.ledgeAttack]: ['KeyJ'],
  [MELEE_ACTIONS.pause]: ['Escape']
};

const opponentDefaults = {
  [MELEE_ACTIONS.moveHorizontal]: { negative: ['ArrowLeft'], positive: ['ArrowRight'] },
  [MELEE_ACTIONS.moveVertical]: { negative: ['ArrowUp'], positive: ['ArrowDown'] },
  [MELEE_ACTIONS.jump]: ['NumpadEnter'],
  [MELEE_ACTIONS.crouch]: ['ArrowDown'],
  [MELEE_ACTIONS.attackLight]: ['Numpad1'],
  [MELEE_ACTIONS.chargedAttack]: ['Numpad2'],
  [MELEE_ACTIONS.special]: ['Numpad3'],
  [MELEE_ACTIONS.shield]: ['Numpad0'],
  [MELEE_ACTIONS.taunt]: ['NumpadDecimal'],
  [MELEE_ACTIONS.climb]: ['ArrowUp'],
  [MELEE_ACTIONS.drop]: ['ArrowDown'],
  [MELEE_ACTIONS.ledgeAttack]: ['Numpad1'],
  [MELEE_ACTIONS.pause]: ['Escape']
};

const cloneValue = value => JSON.parse(JSON.stringify(value));

export const DEFAULT_MELEE_INPUT_MAPS = Object.freeze({
  version: MELEE_INPUT_MAP_VERSION,
  player: playerDefaults,
  cpu: opponentDefaults
});

export const MELEE_REMAPPABLE_SLOTS = Object.freeze([
  { id: 'moveLeft', action: MELEE_ACTIONS.moveHorizontal, polarity: 'negative' },
  { id: 'moveRight', action: MELEE_ACTIONS.moveHorizontal, polarity: 'positive' },
  { id: 'moveUp', action: MELEE_ACTIONS.moveVertical, polarity: 'negative' },
  { id: 'moveDown', action: MELEE_ACTIONS.moveVertical, polarity: 'positive' },
  { id: 'jump', action: MELEE_ACTIONS.jump },
  { id: 'crouch', action: MELEE_ACTIONS.crouch },
  { id: 'attackLight', action: MELEE_ACTIONS.attackLight },
  { id: 'chargedAttack', action: MELEE_ACTIONS.chargedAttack },
  { id: 'special', action: MELEE_ACTIONS.special },
  { id: 'shield', action: MELEE_ACTIONS.shield },
  { id: 'taunt', action: MELEE_ACTIONS.taunt },
  { id: 'climb', action: MELEE_ACTIONS.climb },
  { id: 'drop', action: MELEE_ACTIONS.drop },
  { id: 'ledgeAttack', action: MELEE_ACTIONS.ledgeAttack },
  { id: 'pause', action: MELEE_ACTIONS.pause }
]);

const normalizeSideMap = (source, defaults) => {
  const candidate = source && typeof source === 'object' ? source : {};
  return Object.fromEntries(Object.values(MELEE_ACTIONS).map(action => {
    const fallback = defaults[action];
    if (action === MELEE_ACTIONS.moveHorizontal || action === MELEE_ACTIONS.moveVertical) {
      const axis = candidate[action] && typeof candidate[action] === 'object' ? candidate[action] : {};
      return [action, {
        negative: uniqueCodes(axis.negative).length ? uniqueCodes(axis.negative) : [...fallback.negative],
        positive: uniqueCodes(axis.positive).length ? uniqueCodes(axis.positive) : [...fallback.positive]
      }];
    }
    const codes = uniqueCodes(candidate[action]);
    return [action, codes.length ? codes : [...fallback]];
  }));
};

export const normalizeMeleeInputMaps = source => ({
  version: MELEE_INPUT_MAP_VERSION,
  player: normalizeSideMap(source?.player, playerDefaults),
  cpu: normalizeSideMap(source?.cpu || source?.opponent, opponentDefaults)
});

export const createDefaultMeleeInputMaps = () => normalizeMeleeInputMaps(cloneValue(DEFAULT_MELEE_INPUT_MAPS));

export const loadMeleeInputMaps = (storage = globalThis?.localStorage) => {
  if (!storage?.getItem) return createDefaultMeleeInputMaps();
  try {
    const parsed = JSON.parse(storage.getItem(MELEE_INPUT_STORAGE_KEY) || 'null');
    return normalizeMeleeInputMaps(parsed);
  } catch {
    return createDefaultMeleeInputMaps();
  }
};

export const saveMeleeInputMaps = (maps, storage = globalThis?.localStorage) => {
  const normalized = normalizeMeleeInputMaps(maps);
  if (storage?.setItem) storage.setItem(MELEE_INPUT_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const replaceMeleeBinding = (maps, side, slot, code) => {
  const normalized = normalizeMeleeInputMaps(maps);
  const resolvedSide = side === 'cpu' || side === 'opponent' ? 'cpu' : 'player';
  const target = MELEE_REMAPPABLE_SLOTS.find(entry => entry.id === slot);
  const nextCode = String(code || '').trim();
  if (!target || !nextCode) return normalized;
  const next = cloneValue(normalized);
  if (target.polarity) next[resolvedSide][target.action][target.polarity] = [nextCode];
  else next[resolvedSide][target.action] = [nextCode];
  return normalizeMeleeInputMaps(next);
};

const hasAnyCode = (pressedCodes, values) => values.some(code => pressedCodes.has(code));

export const readKeyboardMeleeInput = (pressed, sideMap) => {
  const pressedCodes = pressed instanceof Set ? pressed : new Set(pressed || []);
  const map = normalizeSideMap(sideMap, playerDefaults);
  const horizontal = (hasAnyCode(pressedCodes, map[MELEE_ACTIONS.moveHorizontal].positive) ? 1 : 0)
    - (hasAnyCode(pressedCodes, map[MELEE_ACTIONS.moveHorizontal].negative) ? 1 : 0);
  const vertical = (hasAnyCode(pressedCodes, map[MELEE_ACTIONS.moveVertical].positive) ? 1 : 0)
    - (hasAnyCode(pressedCodes, map[MELEE_ACTIONS.moveVertical].negative) ? 1 : 0);
  const actions = Object.fromEntries(Object.values(MELEE_ACTIONS).map(action => {
    if (action === MELEE_ACTIONS.moveHorizontal) return [action, horizontal !== 0];
    if (action === MELEE_ACTIONS.moveVertical) return [action, vertical !== 0];
    return [action, hasAnyCode(pressedCodes, map[action])];
  }));
  return { horizontal, vertical, actions };
};

export const getMeleeActionsForCode = (code, sideMap) => {
  const snapshot = readKeyboardMeleeInput(new Set([code]), sideMap);
  return Object.entries(snapshot.actions).filter(([, active]) => active).map(([action]) => action);
};

export const toEngineHeldInput = snapshot => ({
  left: Number(snapshot?.horizontal) < -0.35,
  right: Number(snapshot?.horizontal) > 0.35,
  up: Number(snapshot?.vertical) < -0.35,
  down: Number(snapshot?.vertical) > 0.35 || Boolean(snapshot?.actions?.[MELEE_ACTIONS.crouch]),
  jump: Boolean(snapshot?.actions?.[MELEE_ACTIONS.jump]),
  crouch: Boolean(snapshot?.actions?.[MELEE_ACTIONS.crouch]),
  guard: Boolean(snapshot?.actions?.[MELEE_ACTIONS.shield])
});

export const DEFAULT_GAMEPAD_MELEE_BINDINGS = Object.freeze({
  jump: 0,
  taunt: 1,
  attackLight: 2,
  chargedAttack: 3,
  special: 4,
  shield: 7,
  crouch: 13
});

export const readGamepadMeleeInput = (gamepad, deadzone = 0.28) => {
  const axisX = Number(gamepad?.axes?.[0]) || 0;
  const axisY = Number(gamepad?.axes?.[1]) || 0;
  const pressed = index => Boolean(gamepad?.buttons?.[index]?.pressed || Number(gamepad?.buttons?.[index]?.value) > 0.5);
  const horizontal = Math.abs(axisX) >= deadzone ? axisX : (pressed(15) ? 1 : pressed(14) ? -1 : 0);
  const vertical = Math.abs(axisY) >= deadzone ? axisY : (pressed(13) ? 1 : pressed(12) ? -1 : 0);
  return {
    horizontal,
    vertical,
    actions: {
      [MELEE_ACTIONS.moveHorizontal]: horizontal !== 0,
      [MELEE_ACTIONS.moveVertical]: vertical !== 0,
      [MELEE_ACTIONS.jump]: pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.jump),
      [MELEE_ACTIONS.crouch]: vertical > 0.55 || pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.crouch),
      [MELEE_ACTIONS.attackLight]: pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.attackLight),
      [MELEE_ACTIONS.chargedAttack]: pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.chargedAttack),
      [MELEE_ACTIONS.special]: pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.special),
      [MELEE_ACTIONS.shield]: pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.shield),
      [MELEE_ACTIONS.taunt]: pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.taunt),
      [MELEE_ACTIONS.climb]: vertical < -0.55,
      [MELEE_ACTIONS.drop]: vertical > 0.55,
      [MELEE_ACTIONS.ledgeAttack]: pressed(DEFAULT_GAMEPAD_MELEE_BINDINGS.attackLight),
      [MELEE_ACTIONS.pause]: pressed(9)
    }
  };
};

export const mergeMeleeInputSnapshots = (...snapshots) => {
  const valid = snapshots.filter(Boolean);
  return {
    horizontal: valid.reduce((value, snapshot) => Math.abs(snapshot.horizontal || 0) > Math.abs(value) ? snapshot.horizontal : value, 0),
    vertical: valid.reduce((value, snapshot) => Math.abs(snapshot.vertical || 0) > Math.abs(value) ? snapshot.vertical : value, 0),
    actions: Object.fromEntries(Object.values(MELEE_ACTIONS).map(action => [
      action,
      valid.some(snapshot => Boolean(snapshot.actions?.[action]))
    ]))
  };
};

export const diffMeleeActionEdges = (previous, current) => {
  const before = previous?.actions || {};
  const after = current?.actions || {};
  return {
    pressed: Object.values(MELEE_ACTIONS).filter(action => after[action] && !before[action]),
    released: Object.values(MELEE_ACTIONS).filter(action => !after[action] && before[action])
  };
};

export const formatMeleeInputCode = code => String(code || '')
  .replace(/^Key/, '')
  .replace(/^Digit/, '')
  .replace('Arrow', 'FLECHE ')
  .replace('ShiftLeft', 'SHIFT G')
  .replace('ShiftRight', 'SHIFT D')
  .replace('Space', 'ESPACE')
  .toUpperCase();
