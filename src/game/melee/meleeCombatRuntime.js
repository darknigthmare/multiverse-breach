import {
  CHARGED_ATTACK_DATA,
  cloneMeleeActionDefinition,
  isMeleeCancelOpen,
  tickMeleeState,
  transitionMeleeState
} from './meleeStateMachine.js';

export const MELEE_RUNTIME_DEFAULTS = Object.freeze({
  guardMeterMax: 100,
  guardDrainPerSecond: 9,
  guardRegenPerSecond: 16,
  guardRegenDelay: 0.65,
  perfectShieldSeconds: 0.09,
  shieldBreakSeconds: 1.1,
  ledgeRegrabSeconds: 0.5
});

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const meleePresentationStates = new Set(['intro', 'victory', 'defeat', 'dead']);

export const isMeleePresentationLocked = actor => meleePresentationStates.has(actor?.state);

const createMetrics = source => ({
  perfectShields: finite(source?.perfectShields),
  guardBreaks: finite(source?.guardBreaks),
  chargedHits: finite(source?.chargedHits),
  ledgeRecoveries: finite(source?.ledgeRecoveries),
  taunts: finite(source?.taunts)
});

export const initializeMeleeActorRuntime = actor => {
  if (!actor) return actor;
  actor.state = actor.state || 'idle';
  actor.previousState = actor.previousState || null;
  actor.stateElapsed = Math.max(0, finite(actor.stateElapsed));
  actor.stateNonce = Math.max(0, finite(actor.stateNonce));
  actor.action = actor.action || null;
  actor.queuedMeleeAction = actor.queuedMeleeAction || null;
  actor.comboStep = clamp(Math.floor(finite(actor.comboStep)), 0, 2);
  actor.comboWindow = Math.max(0, finite(actor.comboWindow));
  actor.meleeRecoveryTimer = Math.max(0, finite(actor.meleeRecoveryTimer));
  actor.charging = Boolean(actor.charging);
  actor.chargeHoldSeconds = Math.max(0, finite(actor.chargeHoldSeconds));
  actor.guarding = Boolean(actor.guarding);
  actor.guardMeterMax = Math.max(1, finite(actor.guardMeterMax, MELEE_RUNTIME_DEFAULTS.guardMeterMax));
  actor.guardMeter = clamp(finite(actor.guardMeter, actor.guardMeterMax), 0, actor.guardMeterMax);
  actor.guardRegenDelay = Math.max(0, finite(actor.guardRegenDelay));
  actor.perfectShieldWindow = Math.max(0, finite(actor.perfectShieldWindow));
  actor.shieldBreakTimer = Math.max(0, finite(actor.shieldBreakTimer));
  actor.crouching = Boolean(actor.crouching);
  actor.fastFallHeld = Boolean(actor.fastFallHeld);
  actor.ledge = actor.ledge || null;
  actor.ledgeRegrabTimer = Math.max(0, finite(actor.ledgeRegrabTimer));
  actor.ledgeActionTimer = Math.max(0, finite(actor.ledgeActionTimer));
  actor.meleeMetrics = createMetrics(actor.meleeMetrics);
  return actor;
};

const startDefinedAction = (actor, actionId, powerScale = 1) => {
  const definition = cloneMeleeActionDefinition(actionId);
  if (!definition) return false;
  actor.action = {
    ...definition,
    id: actionId,
    elapsed: 0,
    hitApplied: false,
    powerScale: Math.max(0, finite(powerScale, 1))
  };
  actor.charging = false;
  actor.chargeHoldSeconds = 0;
  transitionMeleeState(actor, definition.state, { force: true, restart: true });
  if (actionId === 'taunt') actor.meleeMetrics.taunts += 1;
  return true;
};

export const beginMeleeAction = (actor, actionId, options = {}) => {
  initializeMeleeActorRuntime(actor);
  if (!actor || actor.currentHp <= 0 || isMeleePresentationLocked(actor) || actor.shieldBreakTimer > 0 || actor.guarding || actor.ledge) return false;
  if (actor.action) {
    const nextDefinition = cloneMeleeActionDefinition(actionId);
    if (nextDefinition && isMeleeCancelOpen(actor, nextDefinition.state)) {
      return startDefinedAction(actor, actionId, options.powerScale);
    }
    if (options.queue) actor.queuedMeleeAction = actionId;
    return false;
  }
  return startDefinedAction(actor, actionId, options.powerScale);
};

export const beginMeleeLightCombo = actor => {
  initializeMeleeActorRuntime(actor);
  const nextStep = actor.comboWindow > 0 ? (actor.comboStep + 1) % 3 : 0;
  const actionId = `light${nextStep + 1}`;
  const started = beginMeleeAction(actor, actionId, { queue: true });
  if (started || actor.queuedMeleeAction === actionId) {
    actor.comboStep = nextStep;
    actor.comboWindow = 0.48;
  }
  return started;
};

export const beginMeleeCharge = actor => {
  initializeMeleeActorRuntime(actor);
  if (!actor || actor.currentHp <= 0 || isMeleePresentationLocked(actor) || actor.action || actor.guarding || actor.shieldBreakTimer > 0 || actor.ledge) return false;
  actor.charging = true;
  actor.chargeHoldSeconds = 0;
  const chargeState = actor.crouching ? CHARGED_ATTACK_DATA.crouchState : CHARGED_ATTACK_DATA.startState;
  transitionMeleeState(actor, chargeState, { force: true, restart: true });
  return true;
};

export const releaseMeleeCharge = actor => {
  initializeMeleeActorRuntime(actor);
  if (!actor?.charging) return false;
  const ratio = clamp(actor.chargeHoldSeconds / CHARGED_ATTACK_DATA.maxHoldSeconds, 0, 1);
  const powerScale = CHARGED_ATTACK_DATA.minimumScale
    + (CHARGED_ATTACK_DATA.maximumScale - CHARGED_ATTACK_DATA.minimumScale) * ratio;
  actor.charging = false;
  if (actor.state === CHARGED_ATTACK_DATA.crouchState) actor.crouching = false;
  return startDefinedAction(actor, 'charged', powerScale);
};

export const beginMeleeShield = actor => {
  initializeMeleeActorRuntime(actor);
  if (!actor || actor.currentHp <= 0 || isMeleePresentationLocked(actor) || actor.action || actor.guardMeter <= 0 || actor.shieldBreakTimer > 0 || actor.ledge) return false;
  if (!actor.guarding) {
    actor.guarding = true;
    actor.charging = false;
    actor.perfectShieldWindow = MELEE_RUNTIME_DEFAULTS.perfectShieldSeconds;
    actor.guardRegenDelay = MELEE_RUNTIME_DEFAULTS.guardRegenDelay;
    transitionMeleeState(actor, 'shieldEnter', { force: true, restart: true });
  }
  return true;
};

export const releaseMeleeShield = actor => {
  initializeMeleeActorRuntime(actor);
  if (!actor?.guarding) return false;
  actor.guarding = false;
  actor.perfectShieldWindow = 0;
  actor.guardRegenDelay = MELEE_RUNTIME_DEFAULTS.guardRegenDelay;
  transitionMeleeState(actor, 'shieldExit', { force: true, restart: true });
  return true;
};

export const cancelMeleeHeldInputs = actor => {
  initializeMeleeActorRuntime(actor);
  if (!actor) return false;
  actor.guarding = false;
  actor.charging = false;
  actor.crouching = false;
  actor.fastFallHeld = false;
  actor.jumpHeld = false;
  actor.perfectShieldWindow = 0;
  actor.chargeHoldSeconds = 0;
  actor.guardRegenDelay = MELEE_RUNTIME_DEFAULTS.guardRegenDelay;
  if (!actor.action && actor.shieldBreakTimer <= 0 && !actor.ledge && !isMeleePresentationLocked(actor)) {
    transitionMeleeState(actor, 'idle', { force: true });
  }
  return true;
};

export const setMeleeCrouch = (actor, active) => {
  initializeMeleeActorRuntime(actor);
  if (!actor || actor.currentHp <= 0 || isMeleePresentationLocked(actor) || actor.action || actor.guarding || actor.shieldBreakTimer > 0 || actor.ledge) return false;
  const next = Boolean(active);
  if (next === actor.crouching) return true;
  actor.crouching = next;
  transitionMeleeState(actor, next ? 'crouchEnter' : 'crouchExit', { force: true, restart: true });
  return true;
};

export const absorbMeleeGuardHit = (actor, values = {}) => {
  initializeMeleeActorRuntime(actor);
  if (!actor?.guarding || actor.shieldBreakTimer > 0) {
    return { guarded: false, perfect: false, damageScale: 1, knockbackScale: 1 };
  }

  const perfect = actor.perfectShieldWindow > 0;
  const guardDamage = perfect ? 2 : Math.max(1, finite(values.guardDamage, 8) + finite(values.damage) * 0.18);
  actor.guardMeter = clamp(actor.guardMeter - guardDamage, 0, actor.guardMeterMax);
  actor.guardRegenDelay = MELEE_RUNTIME_DEFAULTS.guardRegenDelay;
  actor.perfectShieldWindow = 0;

  if (perfect) {
    actor.meleeMetrics.perfectShields += 1;
    transitionMeleeState(actor, 'perfectShield', { force: true, restart: true });
    return { guarded: true, perfect: true, damageScale: 0, knockbackScale: 0 };
  }

  if (actor.guardMeter <= 0) {
    actor.guarding = false;
    actor.shieldBreakTimer = MELEE_RUNTIME_DEFAULTS.shieldBreakSeconds;
    actor.meleeMetrics.guardBreaks += 1;
    transitionMeleeState(actor, 'shieldBreak', { force: true, restart: true });
  } else {
    transitionMeleeState(actor, 'shieldHit', { force: true, restart: true });
  }
  return { guarded: true, perfect: false, damageScale: 0.24, knockbackScale: 0.3 };
};

export const tryCatchMeleeLedge = (actor, platforms = []) => {
  initializeMeleeActorRuntime(actor);
  if (!actor || actor.currentHp <= 0 || isMeleePresentationLocked(actor) || actor.ledge || actor.ledgeRegrabTimer > 0 || finite(actor.vy) < 0) return null;
  const candidate = platforms.find(platform => {
    const vertical = actor.y >= platform.y + 4 && actor.y <= platform.y + 42;
    const nearLeft = actor.x <= platform.x1 + 1 && Math.abs(actor.x - platform.x1) <= 13;
    const nearRight = actor.x >= platform.x2 - 1 && Math.abs(actor.x - platform.x2) <= 13;
    return vertical && (nearLeft || nearRight);
  });
  if (!candidate) return null;
  const side = Math.abs(actor.x - candidate.x1) <= Math.abs(actor.x - candidate.x2) ? 'left' : 'right';
  actor.ledge = { platform: candidate, side };
  actor.x = side === 'left' ? candidate.x1 - 7 : candidate.x2 + 7;
  actor.y = candidate.y + 26;
  actor.vx = 0;
  actor.vy = 0;
  actor.airJumps = Math.max(1, finite(actor.airJumps));
  actor.meleeMetrics.ledgeRecoveries += 1;
  transitionMeleeState(actor, 'ledgeCatch', { force: true, restart: true });
  return actor.ledge;
};

export const performMeleeLedgeAction = (actor, action) => {
  initializeMeleeActorRuntime(actor);
  if (!actor?.ledge || isMeleePresentationLocked(actor)) return false;
  const ledge = actor.ledge;
  const insideDirection = ledge.side === 'left' ? 1 : -1;
  if (action === 'climb') {
    actor.x += insideDirection * 22;
    actor.y = ledge.platform.y;
    actor.ledgeActionTimer = 0.34;
    transitionMeleeState(actor, 'ledgeClimb', { force: true, restart: true });
  } else if (action === 'drop') {
    actor.x -= insideDirection * 7;
    actor.vy = 1.8;
    actor.ledgeRegrabTimer = MELEE_RUNTIME_DEFAULTS.ledgeRegrabSeconds;
    transitionMeleeState(actor, 'ledgeDrop', { force: true, restart: true });
  } else if (action === 'attack') {
    actor.x += insideDirection * 15;
    actor.y = ledge.platform.y;
    actor.facing = insideDirection;
    actor.ledge = null;
    return beginMeleeAction(actor, 'ledgeAttack');
  } else if (action === 'jump') {
    actor.x += insideDirection * 9;
    actor.vx = insideDirection * 3.4;
    actor.vy = -6.7;
    actor.ledgeRegrabTimer = MELEE_RUNTIME_DEFAULTS.ledgeRegrabSeconds;
    transitionMeleeState(actor, 'ledgeJump', { force: true, restart: true });
  } else {
    return false;
  }
  actor.ledge = null;
  return true;
};

export const getMeleeHurtbox = actor => {
  const crouched = Boolean(actor?.crouching || String(actor?.state || '').startsWith('crouch'));
  const width = crouched ? 34 : 30;
  const height = crouched ? 34 : 58;
  const feetY = finite(actor?.y);
  const centerX = finite(actor?.x);
  return {
    left: centerX - width / 2,
    right: centerX + width / 2,
    top: feetY - height,
    bottom: feetY,
    width,
    height
  };
};

export const tickMeleeCombatActor = (actor, dt = 1 / 60, hooks = {}) => {
  initializeMeleeActorRuntime(actor);
  const step = clamp(finite(dt, 1 / 60), 0, 0.1);
  if (isMeleePresentationLocked(actor) && actor.state !== 'intro') {
    actor.stateElapsed += step;
    return actor;
  }
  if (actor.meleeRecoveryTimer > 0) {
    actor.stateElapsed += step;
    actor.meleeRecoveryTimer = Math.max(0, actor.meleeRecoveryTimer - step);
    if (actor.meleeRecoveryTimer === 0) transitionMeleeState(actor, 'idle', { force: true });
  } else {
    tickMeleeState(actor, step);
  }
  actor.comboWindow = Math.max(0, actor.comboWindow - step);
  actor.perfectShieldWindow = Math.max(0, actor.perfectShieldWindow - step);
  actor.ledgeRegrabTimer = Math.max(0, actor.ledgeRegrabTimer - step);
  actor.guardRegenDelay = Math.max(0, actor.guardRegenDelay - step);

  if (actor.ledgeActionTimer > 0) {
    actor.ledgeActionTimer = Math.max(0, actor.ledgeActionTimer - step);
    if (actor.ledgeActionTimer === 0 && actor.state === 'ledgeClimb') transitionMeleeState(actor, 'idle', { force: true });
  }

  if (actor.shieldBreakTimer > 0) {
    actor.shieldBreakTimer = Math.max(0, actor.shieldBreakTimer - step);
    actor.vx = 0;
    if (actor.shieldBreakTimer === 0) transitionMeleeState(actor, 'idle', { force: true });
  } else if (actor.guarding) {
    actor.guardMeter = clamp(actor.guardMeter - MELEE_RUNTIME_DEFAULTS.guardDrainPerSecond * step, 0, actor.guardMeterMax);
    if (actor.guardMeter <= 0) {
      actor.guarding = false;
      actor.shieldBreakTimer = MELEE_RUNTIME_DEFAULTS.shieldBreakSeconds;
      actor.meleeMetrics.guardBreaks += 1;
      transitionMeleeState(actor, 'shieldBreak', { force: true, restart: true });
    } else if (actor.state === 'shieldHold' || actor.state === 'shieldEnter') {
      transitionMeleeState(actor, 'shieldHold', { force: true });
    }
  } else if (actor.guardRegenDelay <= 0) {
    actor.guardMeter = clamp(actor.guardMeter + MELEE_RUNTIME_DEFAULTS.guardRegenPerSecond * step, 0, actor.guardMeterMax);
  }

  if (actor.charging) {
    actor.chargeHoldSeconds = clamp(actor.chargeHoldSeconds + step, 0, CHARGED_ATTACK_DATA.maxHoldSeconds);
    if (actor.chargeHoldSeconds >= CHARGED_ATTACK_DATA.startDuration && actor.state === CHARGED_ATTACK_DATA.startState) {
      transitionMeleeState(actor, CHARGED_ATTACK_DATA.loopState, { force: true, restart: true });
    }
  }

  if (actor.action) {
    actor.action.elapsed += step;
    if (!actor.action.hitApplied && actor.action.elapsed >= actor.action.hitAt) {
      actor.action.hitApplied = true;
      const resolvedHits = hooks.resolveActionHit?.(actor, actor.action);
      if (actor.action.id === 'charged' && resolvedHits) {
        actor.meleeMetrics.chargedHits += Math.max(1, Math.floor(finite(resolvedHits, 1)));
      }
    }
    if (actor.action.elapsed >= actor.action.duration) {
      const recoveryState = actor.action.recoveryState;
      const recoveryDuration = actor.action.recoveryDuration;
      const queued = actor.queuedMeleeAction;
      actor.action = null;
      actor.queuedMeleeAction = null;
      if (queued && queued.startsWith('light')) {
        startDefinedAction(actor, queued, 1);
      } else {
        actor.meleeRecoveryTimer = Math.max(0, finite(recoveryDuration));
        transitionMeleeState(actor, recoveryState, { force: true, restart: true });
      }
    }
  }

  return actor;
};

export const isMeleeMovementLocked = actor => Boolean(
  actor?.action
  || actor?.meleeRecoveryTimer > 0
  || actor?.charging
  || actor?.guarding
  || actor?.shieldBreakTimer > 0
  || actor?.ledge
  || actor?.ledgeActionTimer > 0
  || ['attackRecovery', 'chargeRecovery', 'hitStun'].includes(actor?.state)
  || isMeleePresentationLocked(actor)
);
