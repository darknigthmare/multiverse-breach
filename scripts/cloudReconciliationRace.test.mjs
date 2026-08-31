import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createLocalSaveGuard } from '../src/game/localSaveGuard.js';
import { CLOUD_SAVE_CONFLICT_ACTIONS, resolveCloudSaveConflict } from '../src/game/cloudSaveConflictPolicy.js';
import { CloudSaveConflictError } from '../src/game/cloudSave.js';
import { PLAYER_HERO_ID } from '../src/game/playerHero.js';

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const extractDeclaration = (name, nextName) => {
  const start = appSource.indexOf(`const ${name} =`);
  const end = appSource.indexOf(`const ${nextName} =`, start);
  assert.ok(start >= 0 && end > start, `${name} closure remains extractable from App`);
  return appSource.slice(start, end).trim();
};
const traceSource = extractDeclaration('hasMeaningfulTrace', 'normalizeStoredCustomBattlePreset');
const applySource = extractDeclaration('applySave', 'exportSave');
const reconcileSource = extractDeclaration('reconcileCloudSave', 'applyCloudSession');
const setterNames = [...new Set([...`${applySource}\n${reconcileSource}`.matchAll(/\b(set[A-Z]\w+)\(/g)].map(match => match[1]))];
const saveKey = 'cloud-race-test-save';
const cloudRow = payload => ({ payload, updated_at: '2026-08-31T12:00:00.000Z' });
const emptySave = () => ({
  saveVersion: 9, lang: 'fr', gold: 0, completedStages: [], unlockedHeroes: [PLAYER_HERO_ID],
  onboarding: { profileCreated: false, prologueCompleted: false }
});
const meaningfulSave = (gold = 100) => ({ ...emptySave(), gold, onboarding: { profileCreated: true, prologueCompleted: true } });

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((accept, decline) => { resolve = accept; reject = decline; });
  return { promise, resolve, reject };
};

const createHarness = (initialPayload = emptySave(), { confirmation = false } = {}) => {
  const values = new Map([[saveKey, JSON.stringify(initialPayload)]]);
  const storage = {
    writes: 0,
    failRead: false,
    getItem(key) {
      if (this.failRead) throw new Error('SecurityError');
      return values.get(key) ?? null;
    },
    setItem(key, value) { this.writes++; values.set(key, String(value)); }
  };
  const guard = createLocalSaveGuard(storage, saveKey);
  const calls = { check: 0, rebase: 0, confirm: 0, normalize: 0, reads: 0, uploads: [], setters: [] };
  const guardedRef = { current: {
    check() { calls.check++; return guard.check(); },
    rebase() { calls.rebase++; return guard.rebase(); },
    write: guard.write
  } };
  let currentPayload = structuredClone(initialPayload);
  const snapshotBeforeNetwork = structuredClone(initialPayload);
  const pendingCloud = deferred();
  const state = {};
  const dependencies = {
    window: {
      localStorage: storage,
      clearTimeout() {},
      confirm() { calls.confirm++; return typeof confirmation === 'function' ? confirmation() : confirmation; }
    },
    lang: 'fr',
    PLAYER_HERO_ID,
    DEFAULT_SAVE: emptySave(),
    localSaveGuardRef: guardedRef,
    cloudSaveTimerRef: { current: null },
    cloudUpdatedAtRef: { current: null },
    skipNextCloudSaveRef: { current: false },
    // Deliberately retain the old render's snapshot: reading this after await is a bug.
    getCurrentSave: () => structuredClone(snapshotBeforeNetwork),
    getCurrentSaveRef: { current: () => { calls.reads++; return structuredClone(currentPayload); } },
    loadCloudSave: () => pendingCloud.promise,
    createCloudSave: async (_session, payload) => {
      calls.uploads.push(structuredClone(payload));
      return cloudRow(payload);
    },
    resolveCloudSaveConflict,
    CLOUD_SAVE_CONFLICT_ACTIONS,
    CloudSaveConflictError,
    // Migration is independent of the race; these tests preserve its IO contract.
    normalizeSavePayload: payload => { calls.normalize++; return structuredClone(payload); }
  };
  for (const setter of setterNames) {
    dependencies[setter] = value => {
      calls.setters.push({ name: setter, value });
      state[setter] = value;
    };
  }
  // These are App's exact closures and meaningful-trace predicate, not replicas.
  const closures = new Function(...Object.keys(dependencies), `
    ${traceSource}
    ${applySource}
    ${reconcileSource}
    return { applySave, reconcileCloudSave };
  `)(...Object.values(dependencies));
  return {
    ...closures, calls, state, guard, storage, pendingCloud, guardedRef,
    refs: dependencies,
    raw: () => values.get(saveKey),
    replaceCurrent(payload) { currentPayload = structuredClone(payload); },
    writeCurrent(payload) {
      assert.deepEqual(guard.write(payload), { saved: true });
      currentPayload = structuredClone(payload);
    },
    externalWrite(payload) {
      const anotherTab = createLocalSaveGuard(storage, saveKey);
      assert.deepEqual(anotherTab.write(payload), { saved: true });
    }
  };
};

const assertNoSaveApplied = harness => {
  assert.equal(harness.calls.setters.some(call => call.name === 'setGold'), false);
  assert.equal(harness.calls.setters.some(call => call.name === 'setPlayerProfile'), false);
  assert.equal(harness.calls.setters.some(call => call.name === 'setCompletedStages'), false);
};

test('another tab saving during cloud load aborts reconciliation without rebasing or overwriting', async () => {
  const harness = createHarness();
  const pending = harness.reconcileCloudSave({ access_token: 'test-only' });
  const otherTabPayload = meaningfulSave(700);
  harness.externalWrite(otherTabPayload);
  harness.pendingCloud.resolve(cloudRow(meaningfulSave(900)));
  await assert.rejects(pending, /save-conflict/);

  assert.equal(harness.raw(), JSON.stringify(otherTabPayload));
  assert.equal(harness.storage.writes, 1, 'only the other tab wrote storage');
  assert.equal(harness.calls.rebase, 0);
  assert.equal(harness.calls.confirm, 0, 'an automatic race must not manufacture import authorization');
  assert.equal(harness.calls.reads, 0, 'reject stale storage before deciding from local React state');
  assert.equal(harness.calls.uploads.length, 0);
  assert.equal(harness.state.setLocalSaveIssue, 'save-conflict');
  assertNoSaveApplied(harness);
  assert.deepEqual(harness.guard.check(), { ok: false, reason: 'save-conflict' });
});

test('local gameplay updated while cloud load awaits is uploaded from the fresh ref, not the old render', async () => {
  const harness = createHarness(meaningfulSave(100));
  const pending = harness.reconcileCloudSave({ access_token: 'test-only' });
  const fresh = { ...meaningfulSave(65), completedStages: ['newly-completed-stage'] };
  harness.writeCurrent(fresh);
  harness.pendingCloud.resolve(null);
  const result = await pending;

  assert.equal(result.status, 'uploaded-local');
  assert.deepEqual(harness.calls.uploads, [fresh]);
  assert.equal(harness.calls.reads, 1);
  assert.equal(harness.calls.rebase, 0);
  assert.equal(harness.state.setCloudSyncState, 'ready');
  assertNoSaveApplied(harness);
});

test('new local progress made during load prevents automatic replacement by a previously eligible cloud trace', async () => {
  const harness = createHarness(emptySave());
  const pending = harness.reconcileCloudSave({ access_token: 'test-only' });
  harness.replaceCurrent(meaningfulSave(55));
  harness.pendingCloud.resolve(cloudRow(meaningfulSave(900)));
  const result = await pending;

  assert.equal(result.status, 'conflict-preserved');
  assert.equal(harness.calls.confirm, 1);
  assert.equal(harness.calls.reads, 1);
  assert.equal(harness.calls.rebase, 0);
  assert.equal(harness.calls.uploads.length, 0);
  assert.equal(harness.state.setCloudSyncState, 'conflict');
  assertNoSaveApplied(harness);
});

test('automatic cloud restoration succeeds with an unchanged baseline and never rebases', async () => {
  const harness = createHarness(emptySave());
  const cloud = meaningfulSave(900);
  const pending = harness.reconcileCloudSave({ access_token: 'test-only' });
  harness.pendingCloud.resolve(cloudRow(cloud));
  const result = await pending;

  assert.equal(result.status, 'loaded-cloud');
  assert.deepEqual(result.merged, cloud);
  assert.equal(harness.state.setGold, 900);
  assert.deepEqual(harness.state.setCompletedStages, cloud.completedStages);
  assert.equal(harness.state.setCloudSyncState, 'ready');
  assert.equal(harness.calls.confirm, 0);
  assert.equal(harness.calls.rebase, 0);
  assert.ok(harness.calls.check >= 2, 'reconciliation and application both validate the baseline');
  // Emulate the subsequent autosave effect using the same guard, without a rebase.
  assert.deepEqual(harness.guard.write(result.merged), { saved: true });
  assert.equal(harness.raw(), JSON.stringify(cloud));
});

test('applySave refuses implicit external changes but an explicitly authorized adoption succeeds', () => {
  const harness = createHarness(meaningfulSave(100));
  const other = meaningfulSave(700);
  const requested = meaningfulSave(900);
  harness.externalWrite(other);

  assert.throws(() => harness.applySave(requested), /save-conflict/);
  assert.equal(harness.calls.rebase, 0);
  assert.equal(harness.raw(), JSON.stringify(other));
  assertNoSaveApplied(harness);

  const merged = harness.applySave(requested, { existing: true, navigateTo: null, acceptExternalChange: true });
  assert.equal(harness.calls.rebase, 1);
  assert.equal(harness.state.setGold, 900);
  assert.equal(harness.state.setLocalSaveIssue, null);
  assert.deepEqual(harness.guard.write(merged), { saved: true });
  assert.equal(harness.raw(), JSON.stringify(requested));
});

test('confirmed divergent cloud choice is explicitly authorized and remains usable', async () => {
  const harness = createHarness(meaningfulSave(100), { confirmation: true });
  const pending = harness.reconcileCloudSave({ access_token: 'test-only' });
  const cloud = meaningfulSave(900);
  harness.pendingCloud.resolve(cloudRow(cloud));
  const result = await pending;

  assert.equal(result.status, 'loaded-cloud');
  assert.equal(harness.calls.confirm, 1);
  assert.equal(harness.calls.rebase, 1);
  assert.equal(harness.state.setGold, 900);
  assert.equal(harness.state.setCloudSyncState, 'ready');
  assert.deepEqual(harness.guard.write(result.merged), { saved: true });
});

test('storage becoming inaccessible during cloud load fails closed without touching player state', async () => {
  const harness = createHarness();
  const pending = harness.reconcileCloudSave({ access_token: 'test-only' });
  harness.storage.failRead = true;
  harness.pendingCloud.resolve(cloudRow(meaningfulSave(900)));
  await assert.rejects(pending, /persistence-failed/);

  assert.equal(harness.calls.rebase, 0);
  assert.equal(harness.calls.uploads.length, 0);
  assert.equal(harness.state.setLocalSaveIssue, 'persistence-failed');
  assertNoSaveApplied(harness);
});

test('missing guard cannot authorize even an explicit application', () => {
  const harness = createHarness();
  harness.guardedRef.current = null;
  assert.throws(() => harness.applySave(meaningfulSave(), { acceptExternalChange: true }), /persistence-failed/);
  assert.equal(harness.state.setLocalSaveIssue, 'persistence-failed');
  assertNoSaveApplied(harness);
});
