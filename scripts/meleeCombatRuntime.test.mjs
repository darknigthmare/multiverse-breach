import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CHARGED_ATTACK_DATA } from '../src/game/melee/meleeStateMachine.js';
import {
  MELEE_RUNTIME_DEFAULTS,
  absorbMeleeGuardHit,
  beginMeleeAction,
  beginMeleeCharge,
  beginMeleeLightCombo,
  beginMeleeShield,
  getMeleeHurtbox,
  initializeMeleeActorRuntime,
  isMeleeMovementLocked,
  performMeleeLedgeAction,
  releaseMeleeCharge,
  releaseMeleeShield,
  setMeleeCrouch,
  tickMeleeCombatActor,
  tryCatchMeleeLedge
} from '../src/game/melee/meleeCombatRuntime.js';

const makeActor = overrides => initializeMeleeActorRuntime({
  id: 'player_anchor',
  currentHp: 100,
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  facing: 1,
  airJumps: 0,
  ...overrides
});

const tickFor = (actor, seconds, hooks) => {
  let remaining = seconds;
  while (remaining > 0) {
    const step = Math.min(0.1, remaining);
    tickMeleeCombatActor(actor, step, hooks);
    remaining -= step;
  }
  return actor;
};

const platform = Object.freeze({ id: 'test-platform', x1: 100, x2: 200, y: 80 });

test('runtime initialization clamps mutable state and normalizes all metrics', () => {
  const actor = makeActor({
    comboStep: 99,
    comboWindow: -2,
    guardMeterMax: 80,
    guardMeter: 999,
    chargeHoldSeconds: -1,
    meleeMetrics: { perfectShields: 2, guardBreaks: '3', chargedHits: Number.NaN }
  });

  assert.equal(actor.state, 'idle');
  assert.equal(actor.comboStep, 2);
  assert.equal(actor.comboWindow, 0);
  assert.equal(actor.guardMeter, 80);
  assert.equal(actor.chargeHoldSeconds, 0);
  assert.deepEqual(actor.meleeMetrics, {
    perfectShields: 2,
    guardBreaks: 3,
    chargedHits: 0,
    ledgeRecoveries: 0,
    taunts: 0
  });
});

test('light combo advances light1, light2 and light3 through cancel windows', () => {
  const actor = makeActor();
  assert.equal(beginMeleeLightCombo(actor), true);
  assert.equal(actor.action.id, 'light1');
  assert.equal(actor.state, 'attackLight1');
  assert.equal(actor.comboStep, 0);

  tickFor(actor, 0.16);
  assert.equal(beginMeleeLightCombo(actor), true);
  assert.equal(actor.action.id, 'light2');
  assert.equal(actor.state, 'attackLight2');
  assert.equal(actor.comboStep, 1);

  tickFor(actor, 0.19);
  assert.equal(beginMeleeLightCombo(actor), true);
  assert.equal(actor.action.id, 'light3');
  assert.equal(actor.state, 'attackLight3');
  assert.equal(actor.comboStep, 2);
  assert.equal(isMeleeMovementLocked(actor), true);

  const { duration, recoveryDuration } = actor.action;
  tickFor(actor, duration + 0.1);
  assert.equal(actor.action, null);
  tickFor(actor, recoveryDuration + 0.1);
  assert.equal(actor.state, 'idle');
  assert.equal(isMeleeMovementLocked(actor), false);
});

test('charge enters hold loop, clamps, releases with scale and resolves one charged hit', () => {
  const actor = makeActor();
  assert.equal(beginMeleeCharge(actor), true);
  assert.equal(actor.charging, true);
  assert.equal(actor.state, CHARGED_ATTACK_DATA.startState);
  assert.equal(isMeleeMovementLocked(actor), true);

  tickFor(actor, CHARGED_ATTACK_DATA.startDuration);
  assert.equal(actor.state, CHARGED_ATTACK_DATA.loopState);
  tickFor(actor, CHARGED_ATTACK_DATA.maxHoldSeconds + 0.5);
  assert.equal(actor.chargeHoldSeconds, CHARGED_ATTACK_DATA.maxHoldSeconds);

  assert.equal(releaseMeleeCharge(actor), true);
  assert.equal(actor.state, CHARGED_ATTACK_DATA.releaseState);
  assert.equal(actor.action.id, 'charged');
  assert.equal(actor.action.powerScale, CHARGED_ATTACK_DATA.maximumScale);

  const resolved = [];
  const hooks = {
    resolveActionHit: (_source, action) => {
      resolved.push(action.id);
      return true;
    }
  };
  tickFor(actor, actor.action.hitAt + 0.02, hooks);
  tickFor(actor, 0.1, hooks);
  assert.deepEqual(resolved, ['charged']);
  assert.equal(actor.meleeMetrics.chargedHits, 1, 'a landed charged action must increment chargedHits');
});

test('crouched charge keeps a low hurtbox until release restores standing hurtbox', () => {
  const actor = makeActor();
  assert.equal(setMeleeCrouch(actor, true), true);
  tickFor(actor, 0.1);
  assert.equal(actor.state, 'crouchIdle');

  assert.equal(beginMeleeCharge(actor), true);
  assert.equal(actor.state, CHARGED_ATTACK_DATA.crouchState);
  assert.equal(actor.crouching, true);
  const crouchedHurtbox = getMeleeHurtbox(actor);
  assert.deepEqual(crouchedHurtbox, {
    left: 83,
    right: 117,
    top: 66,
    bottom: 100,
    width: 34,
    height: 34
  });

  tickFor(actor, CHARGED_ATTACK_DATA.startDuration + 0.3);
  assert.equal(actor.state, CHARGED_ATTACK_DATA.crouchState);
  assert.deepEqual(getMeleeHurtbox(actor), crouchedHurtbox);

  assert.equal(releaseMeleeCharge(actor), true);
  assert.equal(actor.state, CHARGED_ATTACK_DATA.releaseState);
  assert.equal(actor.crouching, false);
  const standingHurtbox = getMeleeHurtbox(actor);
  assert.deepEqual(standingHurtbox, {
    left: 85,
    right: 115,
    top: 42,
    bottom: 100,
    width: 30,
    height: 58
  });
  assert.ok(standingHurtbox.height > crouchedHurtbox.height);
});

test('perfect guard, regular reduction, finite break and delayed regeneration are deterministic', () => {
  const actor = makeActor();
  assert.equal(beginMeleeShield(actor), true);
  assert.equal(actor.state, 'shieldEnter');
  assert.equal(actor.perfectShieldWindow, MELEE_RUNTIME_DEFAULTS.perfectShieldSeconds);

  const perfect = absorbMeleeGuardHit(actor, { damage: 30, guardDamage: 20 });
  assert.deepEqual(perfect, {
    guarded: true,
    perfect: true,
    damageScale: 0,
    knockbackScale: 0
  });
  assert.equal(actor.guardMeter, actor.guardMeterMax - 2);
  assert.equal(actor.meleeMetrics.perfectShields, 1);
  assert.equal(actor.state, 'perfectShield');

  tickFor(actor, 0.17);
  assert.equal(actor.state, 'shieldHold');
  const beforeRegularHit = actor.guardMeter;
  const reduced = absorbMeleeGuardHit(actor, { damage: 20, guardDamage: 10 });
  assert.deepEqual(reduced, {
    guarded: true,
    perfect: false,
    damageScale: 0.24,
    knockbackScale: 0.3
  });
  assert.ok(actor.guardMeter < beforeRegularHit);
  assert.equal(actor.state, 'shieldHit');

  actor.guardMeter = 1;
  absorbMeleeGuardHit(actor, { damage: 10, guardDamage: 10 });
  assert.equal(actor.guarding, false);
  assert.equal(actor.guardMeter, 0);
  assert.equal(actor.state, 'shieldBreak');
  assert.equal(actor.shieldBreakTimer, MELEE_RUNTIME_DEFAULTS.shieldBreakSeconds);
  assert.equal(actor.meleeMetrics.guardBreaks, 1);
  assert.equal(isMeleeMovementLocked(actor), true);

  tickFor(actor, MELEE_RUNTIME_DEFAULTS.shieldBreakSeconds + 0.01);
  assert.equal(actor.shieldBreakTimer, 0);
  assert.equal(actor.state, 'idle');
  assert.equal(isMeleeMovementLocked(actor), false);

  const beforeRegen = actor.guardMeter;
  tickFor(actor, 0.1);
  assert.ok(actor.guardMeter > beforeRegen);
  assert.ok(actor.guardMeter <= actor.guardMeterMax);
});

test('shield release and passive drain break obey finite transitions', () => {
  const released = makeActor();
  beginMeleeShield(released);
  assert.equal(releaseMeleeShield(released), true);
  assert.equal(released.guarding, false);
  assert.equal(released.state, 'shieldExit');
  tickFor(released, 0.1);
  assert.equal(released.state, 'idle');
  assert.equal(releaseMeleeShield(released), false);

  const drained = makeActor({ guardMeter: 0.4 });
  beginMeleeShield(drained);
  tickFor(drained, 0.1);
  assert.equal(drained.guarding, false);
  assert.equal(drained.state, 'shieldBreak');
  assert.equal(drained.meleeMetrics.guardBreaks, 1);
});

test('crouch enter, idle and exit complete and block conflicting actions', () => {
  const actor = makeActor();
  assert.equal(setMeleeCrouch(actor, true), true);
  assert.equal(actor.crouching, true);
  assert.equal(actor.state, 'crouchEnter');
  tickFor(actor, 0.1);
  assert.equal(actor.state, 'crouchIdle');
  assert.equal(setMeleeCrouch(actor, true), true);

  assert.equal(beginMeleeAction(actor, 'crouchLight'), true);
  assert.equal(actor.state, 'crouchLight');
  assert.equal(setMeleeCrouch(actor, false), false);
  tickFor(actor, actor.action.duration + actor.action.recoveryDuration + 0.02);

  assert.equal(setMeleeCrouch(actor, false), true);
  assert.equal(actor.crouching, false);
  assert.equal(actor.state, 'crouchExit');
  tickFor(actor, 0.1);
  assert.equal(actor.state, 'idle');
});

test('descending actors catch ledges while upward, remote and regrab-locked actors do not', () => {
  const actor = makeActor({ x: 100, y: 100, vy: 2 });
  assert.deepEqual(tryCatchMeleeLedge(actor, [platform]), { platform, side: 'left' });
  assert.equal(actor.x, 93);
  assert.equal(actor.y, 106);
  assert.equal(actor.vx, 0);
  assert.equal(actor.vy, 0);
  assert.equal(actor.airJumps, 1);
  assert.equal(actor.state, 'ledgeCatch');
  assert.equal(actor.meleeMetrics.ledgeRecoveries, 1);

  assert.equal(tryCatchMeleeLedge(makeActor({ x: 100, y: 100, vy: -1 }), [platform]), null);
  assert.equal(tryCatchMeleeLedge(makeActor({ x: 50, y: 100, vy: 1 }), [platform]), null);
  assert.equal(tryCatchMeleeLedge(makeActor({ x: 100, y: 100, vy: 1, ledgeRegrabTimer: 0.2 }), [platform]), null);
});

test('ledge climb, drop, jump and attack detach with finite locks and correct facing', () => {
  const catchLeft = () => {
    const actor = makeActor({ x: 100, y: 100, vy: 2 });
    tryCatchMeleeLedge(actor, [platform]);
    return actor;
  };

  const climbed = catchLeft();
  assert.equal(performMeleeLedgeAction(climbed, 'climb'), true);
  assert.equal(climbed.ledge, null);
  assert.equal(climbed.state, 'ledgeClimb');
  assert.equal(climbed.x, 115);
  assert.equal(climbed.y, platform.y);
  tickFor(climbed, 0.4);
  assert.equal(climbed.state, 'idle');
  assert.equal(climbed.ledgeActionTimer, 0);

  const dropped = catchLeft();
  assert.equal(performMeleeLedgeAction(dropped, 'drop'), true);
  assert.equal(dropped.state, 'ledgeDrop');
  assert.equal(dropped.vy, 1.8);
  assert.equal(dropped.ledgeRegrabTimer, MELEE_RUNTIME_DEFAULTS.ledgeRegrabSeconds);

  const jumped = catchLeft();
  assert.equal(performMeleeLedgeAction(jumped, 'jump'), true);
  assert.equal(jumped.state, 'ledgeJump');
  assert.equal(jumped.vx, 3.4);
  assert.equal(jumped.vy, -6.7);

  const attacked = catchLeft();
  assert.equal(performMeleeLedgeAction(attacked, 'attack'), true);
  assert.equal(attacked.ledge, null);
  assert.equal(attacked.facing, 1);
  assert.equal(attacked.action.id, 'ledgeAttack');
  assert.equal(attacked.state, 'ledgeAttack');

  assert.equal(performMeleeLedgeAction(makeActor(), 'climb'), false);
  assert.equal(performMeleeLedgeAction(catchLeft(), 'unknown'), false);
});

test('taunt and runtime metrics remain finite across tracked actions', () => {
  const actor = makeActor({ meleeMetrics: {
    perfectShields: 1,
    guardBreaks: 2,
    chargedHits: 3,
    ledgeRecoveries: 4,
    taunts: 5
  } });
  assert.equal(beginMeleeAction(actor, 'taunt'), true);
  assert.equal(actor.meleeMetrics.taunts, 6);
  Object.values(actor.meleeMetrics).forEach(metric => assert.ok(Number.isFinite(metric)));
});
