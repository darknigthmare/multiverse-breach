import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  CHARGED_ATTACK_DATA,
  MELEE_ACTION_DEFINITIONS,
  MELEE_CANCEL_WINDOWS,
  MELEE_STATE_PRIORITY,
  MELEE_STATES,
  MELEE_TRANSITION_DATA,
  canTransitionMeleeState,
  cloneMeleeActionDefinition,
  getMeleeStatePriority,
  isMeleeCancelOpen,
  tickMeleeState,
  transitionMeleeState
} from '../src/game/melee/meleeStateMachine.js';

const EXPECTED_P4_STATES = [
  'idle', 'walk', 'run', 'turn',
  'crouchEnter', 'crouchIdle', 'crouchExit', 'crouchLight', 'crouchCharge',
  'jumpStart', 'jumpRise', 'jumpApex', 'fall', 'fastFall', 'land',
  'attackLight1', 'attackLight2', 'attackLight3',
  'chargeStart', 'chargeLoop', 'chargeRelease', 'chargeRecovery', 'attackRecovery',
  'special', 'aerialNeutral', 'aerialForward', 'aerialDown',
  'shieldEnter', 'shieldHold', 'shieldHit', 'perfectShield', 'shieldBreak', 'shieldExit',
  'ledgeCatch', 'ledgeHang', 'ledgeClimb', 'ledgeDrop', 'ledgeAttack', 'ledgeJump',
  'intro', 'victory', 'defeat', 'taunt1', 'hitStun', 'dead'
];

test('P4 exposes the complete unique 45-state roster', () => {
  assert.equal(new Set(MELEE_STATES).size, MELEE_STATES.length);
  assert.deepEqual([...MELEE_STATES].sort(), EXPECTED_P4_STATES.sort());
  assert.equal(MELEE_STATES.length, 45);
});

test('state priorities enforce dead, hit stun, shield break and recovery ordering', () => {
  assert.equal(getMeleeStatePriority('idle'), MELEE_STATE_PRIORITY.movement);
  assert.equal(getMeleeStatePriority('chargeRecovery'), MELEE_STATE_PRIORITY.attackRecovery);
  assert.equal(getMeleeStatePriority('perfectShield'), MELEE_STATE_PRIORITY.attackRecovery);
  assert.equal(getMeleeStatePriority('shieldBreak'), MELEE_STATE_PRIORITY.shieldBreak);
  assert.equal(getMeleeStatePriority('hitStun'), MELEE_STATE_PRIORITY.hitStun);
  assert.equal(getMeleeStatePriority('defeat'), MELEE_STATE_PRIORITY.dead);
  assert.equal(getMeleeStatePriority('dead'), MELEE_STATE_PRIORITY.dead);

  assert.equal(canTransitionMeleeState({ state: 'hitStun' }, 'idle'), false);
  assert.equal(canTransitionMeleeState({ state: 'hitStun' }, 'dead'), true);
  assert.equal(canTransitionMeleeState({ state: 'dead' }, 'hitStun'), false);
  assert.equal(canTransitionMeleeState({ state: 'shieldBreak' }, 'run'), false);
  assert.equal(canTransitionMeleeState({ state: 'shieldBreak' }, 'hitStun'), true);
});

test('transition validation handles invalid states, action locks, force and restart', () => {
  const actor = { state: 'idle', stateElapsed: 0.7, stateNonce: 2, action: { id: 'light1' } };
  assert.equal(canTransitionMeleeState(actor, 'not-a-state'), false);
  assert.equal(transitionMeleeState(actor, 'run'), false);
  assert.equal(actor.state, 'idle');

  assert.equal(transitionMeleeState(actor, 'run', { force: true }), true);
  assert.equal(actor.previousState, 'idle');
  assert.equal(actor.state, 'run');
  assert.equal(actor.stateElapsed, 0);
  assert.equal(actor.stateNonce, 3);

  actor.stateElapsed = 0.5;
  assert.equal(transitionMeleeState(actor, 'run'), true);
  assert.equal(actor.stateElapsed, 0.5);
  assert.equal(transitionMeleeState(actor, 'run', { restart: true, force: true }), true);
  assert.equal(actor.stateElapsed, 0);
  assert.equal(actor.stateNonce, 4);
});

test('finite transition states complete at their declared boundaries', () => {
  Object.entries(MELEE_TRANSITION_DATA).forEach(([state, transition]) => {
    const actor = { state, stateElapsed: 0, stateNonce: 0, action: null };
    assert.equal(tickMeleeState(actor, transition.duration / 2), null, state);
    assert.equal(actor.state, state, state);
    assert.equal(tickMeleeState(actor, transition.duration / 2), transition.completeInto, state);
    assert.equal(actor.state, transition.completeInto, state);
    assert.equal(actor.stateElapsed, 0, state);
  });

  const actionLocked = { state: 'land', stateElapsed: 0, action: { id: 'air' } };
  tickMeleeState(actionLocked, MELEE_TRANSITION_DATA.land.duration);
  assert.equal(actionLocked.state, 'land');
});

test('cancel windows include boundaries and reject unrelated or late transitions', () => {
  Object.entries(MELEE_CANCEL_WINDOWS).forEach(([state, windows]) => {
    windows.forEach(window => {
      const actor = { state, stateElapsed: window.from };
      window.into.forEach(nextState => assert.equal(isMeleeCancelOpen(actor, nextState), true));
      actor.stateElapsed = window.to;
      window.into.forEach(nextState => assert.equal(isMeleeCancelOpen(actor, nextState), true));
      actor.stateElapsed = window.from - 0.001;
      window.into.forEach(nextState => assert.equal(isMeleeCancelOpen(actor, nextState), false));
      actor.stateElapsed = window.to + 0.001;
      window.into.forEach(nextState => assert.equal(isMeleeCancelOpen(actor, nextState), false));
      assert.equal(isMeleeCancelOpen(actor, 'dead'), false);
    });
  });
});

test('action definitions and charged attack contract remain complete and clone-safe', () => {
  ['light1', 'light2', 'light3', 'crouchLight', 'heavy', 'charged', 'special', 'super',
    'aerialNeutral', 'aerialForward', 'aerialDown', 'taunt', 'ledgeAttack'].forEach(id => {
    const definition = MELEE_ACTION_DEFINITIONS[id];
    assert.ok(definition, id);
    assert.ok(MELEE_STATES.includes(definition.state), id);
    assert.ok(definition.duration > 0, id);
    assert.ok(definition.recoveryDuration >= 0, id);
    assert.ok(Array.isArray(definition.cancelWindows), id);
  });

  const clone = cloneMeleeActionDefinition('light1');
  assert.notStrictEqual(clone, MELEE_ACTION_DEFINITIONS.light1);
  assert.notStrictEqual(clone.cancelWindows, MELEE_ACTION_DEFINITIONS.light1.cancelWindows);
  clone.cancelWindows.push({ from: 0, to: 1, into: ['dead'] });
  assert.equal(MELEE_ACTION_DEFINITIONS.light1.cancelWindows.length, 1);
  assert.equal(cloneMeleeActionDefinition('unknown'), null);

  assert.equal(CHARGED_ATTACK_DATA.startState, 'chargeStart');
  assert.equal(CHARGED_ATTACK_DATA.loopState, 'chargeLoop');
  assert.equal(CHARGED_ATTACK_DATA.releaseState, 'chargeRelease');
  assert.ok(CHARGED_ATTACK_DATA.minimumScale < CHARGED_ATTACK_DATA.maximumScale);
  assert.ok(CHARGED_ATTACK_DATA.startDuration < CHARGED_ATTACK_DATA.maxHoldSeconds);
});
