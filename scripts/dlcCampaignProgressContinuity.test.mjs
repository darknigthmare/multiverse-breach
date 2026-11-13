import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeDlcCampaignProgress } from '../src/game/dlcPlayerState.js';

const packs = [{ id: 'known', missionIds: [10, 11] }];

test('a known pack retains historical and future mission IDs absent from this catalog', () => {
  const stored = { known: { missionIds: [10, 99, 'future-phase'], choice: 'keep', futureField: { version: 2 } } };
  const before = structuredClone(stored);
  const result = mergeDlcCampaignProgress([10], stored, packs);
  assert.deepEqual(result.known.missionIds, [10, 99, 'future-phase']);
  assert.equal(result.known.choice, 'keep');
  assert.deepEqual(result.known.futureField, { version: 2 });
  assert.deepEqual(stored, before, 'normalization never changes the stored input');
});

test('current missions still follow completed stages and catalog order without restoring stale unlocks', () => {
  const stored = { known: { missionIds: [11, '10', 99] } };
  assert.deepEqual(mergeDlcCampaignProgress(['10'], stored, packs).known.missionIds, [10, 99]);
  assert.deepEqual(mergeDlcCampaignProgress([], stored, packs).known.missionIds, [99]);
  assert.deepEqual(mergeDlcCampaignProgress([11, 10], stored, packs).known.missionIds, [10, 11, 99]);
});

test('a newer save survives an older catalog round trip and resumes after catalog restoration', () => {
  const stored = { known: { missionIds: [10, 99], ending: 'future-ending' }, absent: { missionIds: [900], choice: 'dormant' } };
  const oldSave = JSON.parse(JSON.stringify(mergeDlcCampaignProgress([10, 99], stored, packs)));
  assert.deepEqual(oldSave, stored, 'serializing an older catalog keeps opaque progress');
  assert.deepEqual(mergeDlcCampaignProgress([10, 99], oldSave, packs), oldSave, 'older-catalog normalization is idempotent');
  const restored = mergeDlcCampaignProgress([10, 99], oldSave, [{ id: 'known', missionIds: [10, 11, 99] }]);
  assert.deepEqual(restored, stored);
});

test('refreshing known missions preserves dormant ID order and leaves unrelated records untouched', () => {
  const stored = { known: { missionIds: ['future-b', 11, 98, 'future-a'] }, futurePack: { missionIds: [800], payload: { keep: true } } };
  const result = mergeDlcCampaignProgress([10], stored, packs);
  assert.deepEqual(result.known.missionIds, [10, 'future-b', 98, 'future-a']);
  assert.deepEqual(result.futurePack, stored.futurePack);
  assert.deepEqual(mergeDlcCampaignProgress([10], { known: { missionIds: null, choice: 'keep' } }, packs).known, { missionIds: [10], choice: 'keep' });
});
