import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { mkdtempSync, readFileSync, writeFileSync, renameSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { createCloudSaveClient, isCloudOperationCancelled, SUPABASE_SESSION_KEY } from '../src/game/cloudSave.js';
import { writeAvailabilityAtomic } from './buildSpriteAvailability.mjs';
import { applyCombatHealing } from '../src/game/combatHealing.js';

const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const fixedNow = 1792144800000;
const session = (id = 'audit-a', access = 'test-access-a') => ({ user: { id }, access_token: access, refresh_token: 'test-refresh', expires_at: fixedNow / 1000 + 3600 });
const tick = () => new Promise(resolve => setImmediate(resolve));

for (const scenario of ['same-user', 'other-user', 'logout', 'corrupt']) {
  test(`disk-loaded identity handles ${scenario} cross-tab event during a committed PATCH`, async () => {
    const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const bus = new EventTarget();
    Object.defineProperty(globalThis, 'window', { configurable: true, value: bus });
    const disk = new Map([[SUPABASE_SESSION_KEY, JSON.stringify(session())]]);
    const storage = { getItem: key => disk.get(key) ?? null, setItem: (key, value) => disk.set(key, value), removeItem: key => disk.delete(key) };
    const pending = deferred(); const started = deferred();
    const api = createCloudSaveClient({ storageFactory: () => storage, now: () => fixedNow,
      configFactory: () => ({ supabaseUrl: 'https://audit.example.test', supabaseAnonKey: 'public-test' }),
      fetchImpl: async (_url, options) => { assert.equal(options.method, 'PATCH'); started.resolve(); return pending.promise; } });
    let unsubscribe;
    try {
      const loaded = api.getStoredSession();
      const events = [];
      unsubscribe = api.subscribeSession((value, info) => events.push([value?.user?.id, info.reason]));
      const saving = api.updateCloudSave(loaded, { gold: 45 }, 'version-1');
      await started.promise;
      if (scenario === 'same-user') disk.set(SUPABASE_SESSION_KEY, JSON.stringify(session('audit-a', 'test-access-b')));
      else if (scenario === 'other-user') disk.set(SUPABASE_SESSION_KEY, JSON.stringify(session('audit-b')));
      else if (scenario === 'corrupt') disk.set(SUPABASE_SESSION_KEY, '{broken');
      else disk.delete(SUPABASE_SESSION_KEY);
      const event = new Event('storage'); Object.defineProperty(event, 'key', { value: SUPABASE_SESSION_KEY }); bus.dispatchEvent(event);
      pending.resolve(new Response(JSON.stringify([{ payload: { gold: 45 }, updated_at: 'version-2' }])));
      if (scenario === 'same-user') {
        assert.equal((await saving).updated_at, 'version-2', 'same user refresh must not discard the accepted server version');
        assert.equal(api.getStoredSession().access_token, 'test-access-b');
      } else await assert.rejects(saving, isCloudOperationCancelled);
      assert.equal(events.length, 1);
    } finally {
      unsubscribe?.();
      if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow); else delete globalThis.window;
    }
  });
}

test('session subscription seeds a persisted identity without a separate initial read', async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const bus = new EventTarget(); Object.defineProperty(globalThis, 'window', { configurable: true, value: bus });
  let raw = JSON.stringify(session()); const pending = deferred(); let unsubscribe;
  const api = createCloudSaveClient({ storageFactory: () => ({ getItem: () => raw }), now: () => fixedNow,
    configFactory: () => ({ supabaseUrl: 'https://audit.example.test', supabaseAnonKey: 'public-test' }), fetchImpl: () => pending.promise });
  try {
    unsubscribe = api.subscribeSession(() => {});
    const load = api.loadCloudSave(session()); await tick();
    raw = JSON.stringify(session('audit-a', 'new-token'));
    const event = new Event('storage'); Object.defineProperty(event, 'key', { value: SUPABASE_SESSION_KEY }); bus.dispatchEvent(event);
    pending.resolve(new Response('[]')); assert.equal(await load, null);
  } finally { unsubscribe?.(); if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow); else delete globalThis.window; }
});

for (const failure of [null, 'write', 'rename']) {
  test(`sprite index replacement is atomic (${failure || 'success'})`, () => {
    const directory = mkdtempSync(join(tmpdir(), 'multiverse-index-'));
    const output = pathToFileURL(join(directory, 'sprite-availability.json'));
    const original = '{"count":5}\n'; const next = '{"count":6}\n';
    writeFileSync(output, original);
    try {
      const fs = {
        writeFileSync: (temporary, text, options) => {
          assert.equal(readFileSync(output, 'utf8'), original);
          if (failure === 'write') { writeFileSync(temporary, '{'); throw new Error('disk full'); }
          writeFileSync(temporary, text, options);
        },
        renameSync: (temporary, final) => { assert.equal(readFileSync(output, 'utf8'), original); if (failure === 'rename') throw new Error('rename denied'); renameSync(temporary, final); }, rmSync
      };
      if (failure) assert.throws(() => writeAvailabilityAtomic(output, next, fs)); else writeAvailabilityAtomic(output, next, fs);
      assert.equal(readFileSync(output, 'utf8'), failure ? original : next);
      assert.deepEqual(readdirSync(directory), ['sprite-availability.json']);
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
}

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const importSource = appSource.slice(appSource.indexOf('  const importSave ='), appSource.indexOf('  const prepareLocalReset ='));
for (const lang of ['fr', 'en']) for (const failure of [null, 'backup-failed', 'invalid']) {
  test(`actual import handler ${lang}/${failure || 'success'} leaves cloud untouched until local adoption`, () => {
    const events = []; const alerts = [];
    const run = new Function('window', 'lang', 'normalizeSavePayload', 'applySave', 'invalidateCloudOperations', 'account', 'setCloudSyncState', 'setCloudStatus', 'sound', `${importSource}; return importSave;`)(
      { prompt: () => failure === 'invalid' ? '{broken' : '{"gold":10}', alert: message => alerts.push(message) }, lang,
      value => value, () => { events.push('apply'); if (failure === 'backup-failed') throw new Error(failure); }, () => events.push('invalidate'), session(),
      state => events.push(state), () => events.push('status'), { playSfx: () => events.push('sound') });
    run();
    if (!failure) { assert.deepEqual(events, ['apply', 'invalidate', 'conflict', 'status', 'sound']); assert.equal(alerts.length, 0); }
    else { assert.deepEqual(events, failure === 'backup-failed' ? ['apply'] : []); assert.equal(alerts.length, 1); assert.match(alerts[0], failure === 'backup-failed' ? /secours|Backup failed/ : /invalide|Invalid/); }
  });
}

for (const hp of [NaN, Infinity, -Infinity, undefined, '40']) {
  test(`shared healing rejects malformed HP (${String(hp)}) without mutating its target`, () => {
    const hero = { currentHp: hp, maxHp: 100, statusEffects: {} }; const before = hero.currentHp;
    assert.equal(applyCombatHealing(hero, 25), 0); assert.ok(Object.is(hero.currentHp, before));
  });
}

let vite; let EngineSmash; const engines = [];
before(async () => { vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } }); ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js')); });
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });
const makeSmash = () => {
  const hero = { id: 'player_anchor', name: 'Test Anchor', universe: 'Nexus de Convergence', category: 'anchor', primaryColor: '#39c5bb',
    stats: { hp: 180, atk: 18, def: 0, spd: 8 }, simple: { name: 'Hit', dmg: 1 }, secondary: { name: 'Burst', dmg: 1.3, cd: 3 }, defense: { name: 'Guard', reduce: 0.4, dur: 1 }, special: { name: 'Special', dmg: 2 } };
  const threat = { id: 'test-threat', name: 'Test Threat', hp: 160, atk: 16, def: 0, spd: 8, weapon: 'melee' };
  const engine = new EngineSmash(760,420,[hero],{ monsters:[threat], bosses:[], customRoster:[threat], worldBoss:null }, { add() {} }, () => {}, () => {},
    { universe:'Nexus de Convergence',mode:'Smash', customBattle:{ singleRoster:true,opponentControl:'cpu' } });
  engine.syncPreMatchFromServer(3000); engines.push(engine); return engine;
};
test('a fallen ally never counts as a defeated enemy or as objective progress in Smash', () => {
  const engine = makeSmash();
  engine.applyDamage(engine.enemies[0], engine.heroes[0], 100000);
  assert.equal(engine.heroes[0].currentHp, 0);
  assert.equal(engine.defeatedEnemies, 0);
});
test('Smash damage totals and returned damage exclude overkill', () => {
  const engine = makeSmash(); const target = engine.enemies[0]; target.currentHp = 7;
  assert.equal(engine.applyDamage(engine.heroes[0], target, 100000), 7);
  assert.equal(engine.damageDealt, 7); assert.equal(engine.defeatedEnemies, 1);
  const velocity = target.vx;
  assert.equal(engine.applyDamage(engine.heroes[0], target, 100000), 0);
  assert.equal(engine.damageDealt, 7); assert.equal(engine.defeatedEnemies, 1); assert.equal(target.vx, velocity);
});
test('Smash damage taken cannot exceed an ally remaining HP', () => {
  const engine = makeSmash(); engine.heroes[0].currentHp = 3;
  assert.equal(engine.applyDamage(engine.enemies[0], engine.heroes[0], 100000), 3);
  assert.equal(engine.damageTaken, 3);
});
for (const damage of [NaN, Infinity, -50]) test(`Smash rejects invalid damage ${damage}`, () => {
  const engine = makeSmash(); const before = engine.enemies[0].currentHp;
  assert.equal(engine.applyDamage(engine.heroes[0], engine.enemies[0], damage), 0);
  assert.equal(engine.enemies[0].currentHp, before);
});
