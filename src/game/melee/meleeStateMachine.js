export const MELEE_STATES = Object.freeze([
  'idle', 'walk', 'run', 'turn',
  'crouchEnter', 'crouchIdle', 'crouchExit', 'crouchCharge',
  'jumpStart', 'jumpRise', 'jumpApex', 'fall', 'fastFall', 'land',
  'attackLight1', 'attackLight2', 'attackLight3', 'crouchLight',
  'chargeStart', 'chargeLoop', 'chargeRelease', 'chargeRecovery', 'attackRecovery',
  'special', 'aerialNeutral', 'aerialForward', 'aerialDown',
  'shieldEnter', 'shieldHold', 'shieldHit', 'perfectShield', 'shieldBreak', 'shieldExit',
  'ledgeCatch', 'ledgeHang', 'ledgeClimb', 'ledgeDrop', 'ledgeAttack', 'ledgeJump',
  'intro', 'victory', 'defeat', 'taunt1', 'hitStun', 'dead'
]);

export const MELEE_STATE_PRIORITY = Object.freeze({
  movement: 10,
  attackRecovery: 20,
  shieldBreak: 30,
  hitStun: 40,
  dead: 50
});

const recoveryStates = new Set(['attackRecovery', 'chargeRecovery', 'shieldHit', 'perfectShield']);
const shieldBreakStates = new Set(['shieldBreak']);
const hitStates = new Set(['hitStun']);
const deadStates = new Set(['dead', 'defeat']);

export const getMeleeStatePriority = state => {
  if (deadStates.has(state)) return MELEE_STATE_PRIORITY.dead;
  if (hitStates.has(state)) return MELEE_STATE_PRIORITY.hitStun;
  if (shieldBreakStates.has(state)) return MELEE_STATE_PRIORITY.shieldBreak;
  if (recoveryStates.has(state)) return MELEE_STATE_PRIORITY.attackRecovery;
  return MELEE_STATE_PRIORITY.movement;
};

export const MELEE_CANCEL_WINDOWS = Object.freeze({
  attackLight1: [{ from: 0.16, to: 0.31, into: ['attackLight2', 'jumpStart'] }],
  attackLight2: [{ from: 0.19, to: 0.34, into: ['attackLight3', 'jumpStart'] }],
  attackLight3: [{ from: 0.28, to: 0.4, into: ['special'] }],
  crouchLight: [{ from: 0.2, to: 0.34, into: ['crouchIdle', 'jumpStart'] }],
  chargeRelease: [{ from: 0.34, to: 0.48, into: ['special'] }],
  ledgeAttack: [{ from: 0.3, to: 0.46, into: ['jumpStart'] }]
});

export const MELEE_TRANSITION_DATA = Object.freeze({
  intro: { duration: 0.4, completeInto: 'idle' },
  crouchEnter: { duration: 0.1, completeInto: 'crouchIdle' },
  crouchExit: { duration: 0.1, completeInto: 'idle' },
  shieldEnter: { duration: 0.08, completeInto: 'shieldHold' },
  shieldExit: { duration: 0.1, completeInto: 'idle' },
  perfectShield: { duration: 0.16, completeInto: 'shieldHold' },
  shieldHit: { duration: 0.12, completeInto: 'shieldHold' },
  land: { duration: 0.1, completeInto: 'idle' },
  ledgeCatch: { duration: 0.16, completeInto: 'ledgeHang' },
  attackRecovery: { duration: 0.12, completeInto: 'idle' },
  chargeRecovery: { duration: 0.16, completeInto: 'idle' }
});

const action = (state, values) => Object.freeze({
  state,
  recoveryState: 'attackRecovery',
  recoveryDuration: 0.12,
  cancelWindows: MELEE_CANCEL_WINDOWS[state] || [],
  ...values
});

export const MELEE_ACTION_DEFINITIONS = Object.freeze({
  light1: action('attackLight1', { duration: 0.28, hitAt: 0.11, base: 9.5, range: 78, guardDamage: 9, knockback: 105 }),
  light2: action('attackLight2', { duration: 0.31, hitAt: 0.12, base: 11.7, range: 82, guardDamage: 10, knockback: 133 }),
  light3: action('attackLight3', { duration: 0.36, hitAt: 0.14, base: 13.9, range: 88, guardDamage: 12, knockback: 161 }),
  crouchLight: action('crouchLight', { duration: 0.34, hitAt: 0.13, base: 10.5, range: 86, guardDamage: 10, knockback: 92 }),
  heavy: action('chargeRelease', { duration: 0.5, hitAt: 0.23, base: 17, range: 96, guardDamage: 19, knockback: 205, recoveryState: 'chargeRecovery', recoveryDuration: 0.18 }),
  charged: action('chargeRelease', { duration: 0.58, hitAt: 0.26, base: 18, range: 104, guardDamage: 24, knockback: 225, recoveryState: 'chargeRecovery', recoveryDuration: 0.2 }),
  special: action('special', { duration: 0.64, hitAt: 0.28, base: 23, range: 132, guardDamage: 24, knockback: 245, meterCost: 30, recoveryDuration: 0.18 }),
  super: action('special', { duration: 0.92, hitAt: 0.45, base: 43, range: Infinity, guardDamage: 42, knockback: 330, meterCost: 100, recoveryDuration: 0.24 }),
  aerialNeutral: action('aerialNeutral', { duration: 0.38, hitAt: 0.14, base: 11.5, range: 84, guardDamage: 8, knockback: 120 }),
  aerialForward: action('aerialForward', { duration: 0.46, hitAt: 0.19, base: 15, range: 104, guardDamage: 13, knockback: 178 }),
  aerialDown: action('aerialDown', { duration: 0.52, hitAt: 0.2, base: 16, range: 88, guardDamage: 14, knockback: 205 }),
  taunt: action('taunt1', { duration: 0.82, hitAt: Infinity, base: 0, range: 0, guardDamage: 0, knockback: 0, recoveryState: 'idle', recoveryDuration: 0 }),
  ledgeAttack: action('ledgeAttack', { duration: 0.48, hitAt: 0.2, base: 13, range: 104, guardDamage: 12, knockback: 150 })
});

export const CHARGED_ATTACK_DATA = Object.freeze({
  startState: 'chargeStart',
  loopState: 'chargeLoop',
  crouchState: 'crouchCharge',
  releaseState: 'chargeRelease',
  startDuration: 0.16,
  maxHoldSeconds: 1.6,
  minimumScale: 0.72,
  maximumScale: 1.62
});

export const canTransitionMeleeState = (fighter, nextState, options = {}) => {
  if (!fighter || !MELEE_STATES.includes(nextState)) return false;
  if (options.force || fighter.state === nextState) return true;
  const currentPriority = getMeleeStatePriority(fighter.state);
  const nextPriority = getMeleeStatePriority(nextState);
  if (nextPriority >= MELEE_STATE_PRIORITY.hitStun) return nextPriority >= currentPriority;
  if (currentPriority >= MELEE_STATE_PRIORITY.shieldBreak) return false;
  if (fighter.action && !options.cancelled) return false;
  return true;
};

export const transitionMeleeState = (fighter, nextState, options = {}) => {
  if (!canTransitionMeleeState(fighter, nextState, options)) return false;
  if (fighter.state !== nextState || options.restart) {
    fighter.previousState = fighter.state;
    fighter.state = nextState;
    fighter.stateElapsed = 0;
    fighter.stateNonce = (fighter.stateNonce || 0) + 1;
  }
  return true;
};

export const tickMeleeState = (fighter, dt) => {
  if (!fighter) return null;
  fighter.stateElapsed = Math.max(0, Number(fighter.stateElapsed) || 0) + Math.max(0, Number(dt) || 0);
  const transition = MELEE_TRANSITION_DATA[fighter.state];
  if (transition && fighter.stateElapsed >= transition.duration && !fighter.action) {
    transitionMeleeState(fighter, transition.completeInto, { force: true });
    return transition.completeInto;
  }
  return null;
};

export const isMeleeCancelOpen = (fighter, nextState) => (
  (MELEE_CANCEL_WINDOWS[fighter?.state] || []).some(window => (
    Number(fighter?.stateElapsed) >= window.from
    && Number(fighter?.stateElapsed) <= window.to
    && window.into.includes(nextState)
  ))
);

export const cloneMeleeActionDefinition = id => {
  const definition = MELEE_ACTION_DEFINITIONS[id];
  return definition ? { ...definition, cancelWindows: [...definition.cancelWindows] } : null;
};
