import test from 'node:test';
import assert from 'node:assert/strict';

import { canContinueTrace, getTraceContinuationScreen } from '../src/game/titleNavigation.js';

test('a missing trace opens profile creation and cannot continue', () => {
  const onboarding = { profileCreated: false, prologueCompleted: false, prologueStep: 0 };
  assert.equal(canContinueTrace(onboarding), false);
  assert.equal(getTraceContinuationScreen(onboarding), 'profile');
});

test('an incomplete prologue resumes without rewriting its step', () => {
  const onboarding = { profileCreated: true, prologueCompleted: false, prologueStep: 3 };
  assert.equal(getTraceContinuationScreen(onboarding), 'prologue');
  assert.equal(onboarding.prologueStep, 3);
});

test('a completed trace continues to the hub', () => {
  assert.equal(getTraceContinuationScreen({ profileCreated: true, prologueCompleted: true }), 'hub');
});
