import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CLOUD_SAVE_CONFLICT_ACTIONS,
  CLOUD_SAVE_CONFLICT_REASONS,
  areCloudSavePayloadsEquivalent,
  resolveCloudSaveConflict
} from '../src/game/cloudSaveConflictPolicy.js';

test('no meaningful trace is a no-op', () => {
  assert.deepEqual(resolveCloudSaveConflict(), {
    action: CLOUD_SAVE_CONFLICT_ACTIONS.NOOP,
    reason: CLOUD_SAVE_CONFLICT_REASONS.NO_TRACE,
    requiresConfirmation: false
  });
});

test('a local trace without a cloud trace is uploaded', () => {
  const result = resolveCloudSaveConflict({
    localPayload: { saveVersion: 9, completedStages: ['stage-1'] },
    cloudPayload: null
  });

  assert.equal(result.action, CLOUD_SAVE_CONFLICT_ACTIONS.UPLOAD_LOCAL);
  assert.equal(result.reason, CLOUD_SAVE_CONFLICT_REASONS.LOCAL_TRACE_ONLY);
  assert.equal(result.requiresConfirmation, false);
});

test('a cloud trace without a local trace is loaded', () => {
  const result = resolveCloudSaveConflict({
    localPayload: null,
    cloudPayload: { saveVersion: 9, completedStages: ['stage-2'] }
  });

  assert.equal(result.action, CLOUD_SAVE_CONFLICT_ACTIONS.LOAD_CLOUD);
  assert.equal(result.reason, CLOUD_SAVE_CONFLICT_REASONS.CLOUD_TRACE_ONLY);
  assert.equal(result.requiresConfirmation, false);
});

test('trace flags distinguish a default payload from meaningful progress', () => {
  const defaultLocalPayload = { saveVersion: 9, onboarding: { profileCreated: false } };
  const cloudPayload = { saveVersion: 9, onboarding: { profileCreated: true } };

  assert.equal(resolveCloudSaveConflict({
    localPayload: defaultLocalPayload,
    cloudPayload,
    localHasTrace: false,
    cloudHasTrace: true
  }).action, CLOUD_SAVE_CONFLICT_ACTIONS.LOAD_CLOUD);

  assert.equal(resolveCloudSaveConflict({
    localPayload: cloudPayload,
    cloudPayload: defaultLocalPayload,
    localHasTrace: true,
    cloudHasTrace: false
  }).action, CLOUD_SAVE_CONFLICT_ACTIONS.UPLOAD_LOCAL);
});

test('equivalent traces are a no-op regardless of object key order', () => {
  const localPayload = {
    saveVersion: 9,
    playerProfile: { name: 'Ancre' },
    completedStages: ['stage-1', 'stage-2']
  };
  const cloudPayload = {
    completedStages: ['stage-1', 'stage-2'],
    playerProfile: { name: 'Ancre' },
    saveVersion: 9
  };

  assert.equal(areCloudSavePayloadsEquivalent(localPayload, cloudPayload), true);
  assert.deepEqual(resolveCloudSaveConflict({ localPayload, cloudPayload }), {
    action: CLOUD_SAVE_CONFLICT_ACTIONS.NOOP,
    reason: CLOUD_SAVE_CONFLICT_REASONS.EQUIVALENT_TRACES,
    requiresConfirmation: false
  });
});

test('array order remains meaningful during equivalence checks', () => {
  assert.equal(areCloudSavePayloadsEquivalent(
    { activeTeam: ['arca_mirelle', 'arca_bastion'] },
    { activeTeam: ['arca_bastion', 'arca_mirelle'] }
  ), false);
});

test('two divergent meaningful traces require confirmation', () => {
  const localPayload = {
    saveVersion: 9,
    completedStages: ['stage-local'],
    modifiedAt: '2026-08-01T20:00:00.000Z'
  };
  const cloudPayload = {
    saveVersion: 9,
    completedStages: ['stage-cloud'],
    modifiedAt: '2026-08-01T10:00:00.000Z'
  };

  const result = resolveCloudSaveConflict({ localPayload, cloudPayload });

  assert.deepEqual(result, {
    action: CLOUD_SAVE_CONFLICT_ACTIONS.REQUIRE_CONFIRMATION,
    reason: CLOUD_SAVE_CONFLICT_REASONS.DIVERGENT_TRACES,
    requiresConfirmation: true
  });
  assert.equal('preferredPayload' in result, false, 'policy must not select an overwrite target');
});

test('the policy does not mutate either payload', () => {
  const localPayload = { nested: { z: 1, a: 2 } };
  const cloudPayload = { nested: { a: 2, z: 1 } };
  const localBefore = structuredClone(localPayload);
  const cloudBefore = structuredClone(cloudPayload);

  resolveCloudSaveConflict({ localPayload, cloudPayload });

  assert.deepEqual(localPayload, localBefore);
  assert.deepEqual(cloudPayload, cloudBefore);
});
