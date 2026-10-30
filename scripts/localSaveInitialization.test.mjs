import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createLocalSaveGuard } from '../src/game/localSaveGuard.js';
import { readLocalSaveSnapshot, backupLocalSave, getSaveBackupKey } from '../src/game/saveRecovery.js';
import { getBrowserStorage, readStorageValue, removeStorageValue } from '../src/game/safeStorage.js';

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const section = (start, end) => {
  const first = app.indexOf(start), last = app.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `Missing App local-save boundary: ${start}`);
  return app.slice(first, last);
};
const loadSource = section('const loadSave = () => {', 'const saveGame =');
const saveSource = section('const saveGame =', 'const appendUnique =');
const initializeSource = section('  const [initialLoad] = useState(loadSave);', '  const [localSaveIssue, setLocalSaveIssue]');
const persistSource = section('  const persistLocalSave = useCallback(payload => {', '  const rerollPortalRotation =');
const applySource = section('  const applySave = ', '  const exportSave =');
const resetSource = section('  const prepareLocalReset = ', '  const resetSave =');
const saveKey = 'local-save-initialization-test';
const defaults = () => ({ gold: 0, completedStages: [], unlockedHeroes: ['player_anchor'] });
const trace = gold => ({ ...defaults(), gold });

// Execute App's current load, initialization, persistence and explicit local
// recovery routes. Only React bookkeeping, navigation and unrelated catalog
// migration are replaced; storage helpers and guard behavior remain real.
function fixture(t, { raw = JSON.stringify(trace(100)), afterLoad, failInitialRead = false,
  failInitialGetter = false, failBackup = false, normalize = value => structuredClone(value) } = {}) {
  const values = new Map(raw === null ? [] : [[saveKey, raw]]);
  const writes = [];
  let reads = 0, acquisitions = 0;
  const disk = {
    getItem(key) {
      if (key === saveKey && ++reads === 1 && failInitialRead) throw new Error('SecurityError');
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (key === getSaveBackupKey(saveKey) && failBackup) throw new Error('QuotaExceededError');
      values.set(key, String(value));
      writes.push({ key, value: String(value) });
    },
    removeItem(key) { values.delete(key); }
  };
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    get localStorage() {
      if (++acquisitions === 1 && failInitialGetter) throw new Error('SecurityError');
      return disk;
    },
    clearTimeout() {}
  } });
  t.after(() => {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow);
    else delete globalThis.window;
  });
  const state = {}, currentSave = { current: null };
  const env = {
    createLocalSaveGuard, readLocalSaveSnapshot, backupLocalSave,
    getBrowserStorage, readStorageValue, removeStorageValue,
    SAVE_KEY: saveKey, LEGACY_KART_CAREER_KEY: 'local-save-initialization-legacy',
    DEFAULT_SAVE: defaults(),
    migrateLegacyKartCareer: value => value, normalizeSavePayload: normalize,
    useRef: value => ({ current: value }), useCallback: fn => fn,
    useState(initializer) {
      const loaded = initializer();
      // A second browsing context may write between payload acquisition and
      // guard construction. This deterministic interleaving uses no accounts.
      afterLoad?.(disk, values);
      return [loaded];
    },
    getCurrentSaveRef: currentSave,
    cloudSaveTimerRef: { current: null },
    battleGateRef: { current: { invalidate() {} } },
    hubNavigationRef: { current: null }, battleOutcomeRef: { current: null },
    invalidateCloudOperations() {}
  };
  for (const name of new Set([...`${persistSource}\n${applySource}\n${resetSource}`.matchAll(/\b(set[A-Z]\w+)\(/g)].map(match => match[1]))) {
    env[name] = value => { state[name] = value; };
  }
  const routes = new Function(...Object.keys(env), `
    ${loadSource}
    ${saveSource}
    ${initializeSource}
    ${persistSource}
    ${applySource}
    ${resetSource}
    return { initialLoad, guard: localSaveGuardRef.current, persistLocalSave, applySave, prepareLocalReset };
  `)(...Object.values(env));
  return { ...routes, disk, state, writes, currentSave,
    raw: () => values.get(saveKey) ?? null,
    backup: () => values.get(getSaveBackupKey(saveKey)) ?? null,
    saveLoaded: () => routes.persistLocalSave(routes.initialLoad.payload) };
}

for (const [name, initial, replacement] of [
  ['an updated trace', JSON.stringify(trace(100)), JSON.stringify(trace(250))],
  ['a trace created after an empty load', null, JSON.stringify(trace(250))],
  ['a trace removed after loading', JSON.stringify(trace(100)), null]
]) {
  test(`startup never overwrites ${name} adopted by another tab after loading`, t => {
    const f = fixture(t, { raw: initial, afterLoad(_disk, values) {
      if (replacement === null) values.delete(saveKey);
      else values.set(saveKey, replacement);
    } });
    assert.deepEqual(f.saveLoaded(), { saved: false, reason: 'save-conflict' });
    assert.equal(f.raw(), replacement);
    assert.equal(f.state.setLocalSaveIssue, 'save-conflict');
    assert.equal(f.writes.length, 0);
  });
}

for (const failure of ['failInitialRead', 'failInitialGetter']) {
  test(`startup ${failure} stays blocked after storage access recovers`, t => {
    const raw = JSON.stringify(trace(250));
    const f = fixture(t, { raw, [failure]: true });
    assert.equal(f.initialLoad.issue, 'persistence-failed');
    assert.equal(f.initialLoad.payload.gold, 0);
    for (let retry = 0; retry < 2; retry++) {
      assert.deepEqual(f.saveLoaded(), { saved: false, reason: 'persistence-failed' });
      assert.equal(f.raw(), raw);
    }
    assert.equal(f.state.setLocalSaveIssue, 'persistence-failed');
    assert.equal(f.writes.length, 0);
  });
}

test('a stable loaded trace still persists new progression normally', t => {
  const f = fixture(t);
  assert.deepEqual(f.saveLoaded(), { saved: true });
  assert.equal(f.writes.length, 0, 'Identical payload remains a successful no-op');
  assert.deepEqual(f.persistLocalSave(trace(125)), { saved: true });
  assert.equal(JSON.parse(f.raw()).gold, 125);
  assert.equal(f.state.setLocalSaveIssue, null);
});

test('a genuinely empty successful load may create its first save', t => {
  const f = fixture(t, { raw: null });
  assert.equal(f.initialLoad.issue, null);
  assert.deepEqual(f.saveLoaded(), { saved: true });
  assert.deepEqual(JSON.parse(f.raw()), defaults());
  assert.equal(f.writes.length, 1);
});

test('migration retains exact loaded bytes and then writes the normalized trace', t => {
  const original = '{ "gold": 100 }';
  const f = fixture(t, { raw: original, normalize: value => ({ ...value, saveVersion: 9 }) });
  assert.equal(f.initialLoad.issue, null);
  assert.equal(f.backup(), original);
  assert.equal(f.raw(), original);
  assert.deepEqual(f.saveLoaded(), { saved: true });
  assert.deepEqual(JSON.parse(f.raw()), { gold: 100, saveVersion: 9 });
  assert.equal(f.backup(), original);
});

test('explicit local import can recover a blocked start after backing up the existing trace', t => {
  const original = JSON.stringify(trace(250));
  const f = fixture(t, { raw: original, failInitialRead: true });
  assert.equal(f.saveLoaded().saved, false);
  const imported = f.applySave(trace(900), { existing: true, navigateTo: null, acceptExternalChange: true });
  assert.equal(f.backup(), original);
  assert.deepEqual(f.persistLocalSave(imported), { saved: true });
  assert.equal(JSON.parse(f.raw()).gold, 900);
  assert.equal(f.state.setLocalSaveIssue, null);
});

test('explicit local reset can recover a blocked start without losing its backup', t => {
  const original = JSON.stringify(trace(250));
  const f = fixture(t, { raw: original, failInitialRead: true });
  assert.equal(f.saveLoaded().saved, false);
  assert.equal(f.prepareLocalReset(), true);
  assert.equal(f.backup(), original);
  assert.equal(f.raw(), null);
  const reset = f.applySave(defaults(), { existing: false, navigateTo: null, acceptExternalChange: true, allowVolatile: true });
  assert.deepEqual(f.persistLocalSave(reset), { saved: true });
  assert.deepEqual(JSON.parse(f.raw()), defaults());
  assert.equal(f.backup(), original);
});

for (const [issue, options] of [
  ['invalid-save', { raw: '{broken' }],
  ['backup-failed', { raw: '{ "gold": 250 }', failBackup: true }]
]) {
  test(`startup preserves the existing ${issue} quarantine`, t => {
    const f = fixture(t, options);
    assert.equal(f.initialLoad.issue, issue);
    assert.deepEqual(f.saveLoaded(), { saved: false, reason: issue });
    assert.equal(f.raw(), options.raw);
    assert.equal(f.writes.length, 0);
  });
}
