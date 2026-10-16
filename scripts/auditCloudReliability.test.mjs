import assert from 'node:assert/strict';
import test from 'node:test';
import { CloudHttpError, requestCloudJson } from '../src/game/cloudTransport.js';
import { createCloudSaveClient, normalizeCloudSession, CloudSaveConflictError, isCloudOperationCancelled, SUPABASE_SESSION_KEY } from '../src/game/cloudSave.js';

const deferred = () => { let resolve; let reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status });
const now = 1792144800000;
const session = (overrides = {}) => ({ user: { id: 'player-a' }, access_token: 'token-a', refresh_token: 'refresh-a', expires_at: now / 1000 + 3600, ...overrides });
const storage = () => { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }; };
const client = (fetchImpl, extra = {}) => createCloudSaveClient({ fetchImpl, storageFactory: () => null, configFactory: () => ({ supabaseUrl: 'https://example.supabase.co', supabaseAnonKey: 'public-test-key' }), now: () => now, ...extra });

for (const [status, body, expected] of [[503, 'Service unavailable', /Service unavailable/], [502, '', /HTTP 502/], [500, '<html>Proxy failed</html>', /HTTP 500/], [401, '{"message":"Expired JWT"}', /Expired JWT/]]) {
  test(`HTTP ${status} ${body.slice(0, 12)} preserves the status without rereading the body`, async () => {
    const response = new Response(body, { status });
    await assert.rejects(requestCloudJson('https://example.test', {}, { fetchImpl: async () => response }), error => error instanceof CloudHttpError && error.status === status && expected.test(error.message));
    assert.equal(response.bodyUsed, true);
  });
}
test('empty successful response is supported', async () => assert.equal(await requestCloudJson('x', {}, { fetchImpl: async () => new Response(null, { status: 204 }) }), null));
test('invalid JSON on success is not silently accepted', async () => {
  await assert.rejects(requestCloudJson('x', {}, { fetchImpl: async () => new Response('<html>not a save</html>') }), error => error.code === 'INVALID_JSON');
});
test('a request deadline aborts the underlying fetch', async () => {
  let signal;
  await assert.rejects(requestCloudJson('x', {}, { timeoutMs: 10, fetchImpl: (_url, options) => { signal = options.signal; return new Promise(() => {}); } }), error => error.code === 'REQUEST_TIMEOUT');
  assert.equal(signal.aborted, true);
});
test('deadline also covers a response body that never finishes', async () => {
  await assert.rejects(requestCloudJson('x', {}, { timeoutMs: 10, fetchImpl: async () => ({ text: () => new Promise(() => {}) }) }), error => error.code === 'REQUEST_TIMEOUT');
});
test('pre-canceled requests never call fetch', async () => {
  let calls = 0;
  const abort = new AbortController(); abort.abort();
  await assert.rejects(requestCloudJson('x', { signal: abort.signal }, { fetchImpl: async () => { calls++; return json({}); } }), { name: 'AbortError' });
  assert.equal(calls, 0);
});
test('normalization supports REST expires_in and JWT expiry', () => {
  assert.equal(normalizeCloudSession({ ...session(), expires_at: undefined, expires_in: 3600 }, now).expires_at, now / 1000 + 3600);
  const jwt = `header.${Buffer.from(JSON.stringify({ exp: 1234567890 })).toString('base64url')}.signature`;
  assert.equal(normalizeCloudSession({ access_token: jwt }, now).expires_at, 1234567890);
});
for (const failing of ['getItem', 'setItem', 'removeItem']) {
  test(`session storage denial in ${failing} does not crash login/logout`, () => {
    const disk = storage(); disk[failing] = () => { throw new DOMException('Denied', 'SecurityError'); };
    const api = client(async () => json([]), { storageFactory: () => disk });
    assert.doesNotThrow(() => api.getStoredSession());
    assert.doesNotThrow(() => api.storeSession(session()));
    assert.doesNotThrow(() => api.storeSession(null));
    assert.equal(api.getStoredSession(), null);
  });
}
test('failed session persistence remains usable in memory', async () => {
  const api = client(async (_url, options) => { assert.equal(options.headers.Authorization, 'Bearer token-a'); return json([]); });
  assert.equal(api.storeSession(session()).ok, false);
  assert.equal(api.getStoredSession().user.id, 'player-a');
  assert.equal(await api.loadCloudSave(session()), null);
});
test('expired token is renewed once for concurrent reads and the rotated credentials persist', async () => {
  const pending = deferred(); const disk = storage(); let renewals = 0; let reads = 0;
  const old = session({ expires_at: now / 1000 - 10 });
  const api = client(async (url, options) => {
    if (url.includes('grant_type=refresh_token')) { renewals++; assert.equal(JSON.parse(options.body).refresh_token, 'refresh-a'); return pending.promise; }
    reads++; assert.equal(options.headers.Authorization, 'Bearer token-b'); return json([]);
  }, { storageFactory: () => disk });
  api.storeSession(old);
  const one = api.loadCloudSave(old); const two = api.loadCloudSave(old);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(renewals, 1);
  pending.resolve(json({ ...session(), access_token: 'token-b', refresh_token: 'refresh-b', expires_at: undefined, expires_in: 3600 }));
  await Promise.all([one, two]);
  assert.equal(reads, 2);
  assert.equal(api.getStoredSession().refresh_token, 'refresh-b');
});
test('a 401 triggers exactly one refresh and one authenticated retry', async () => {
  let renewals = 0; let reads = 0;
  const api = client(async (url, options) => {
    if (url.includes('refresh_token')) { renewals++; return json({ ...session(), access_token: 'fresh', refresh_token: 'rotated' }); }
    reads++;
    return options.headers.Authorization === 'Bearer fresh' ? json([]) : json({ message: 'Expired' }, 401);
  });
  api.storeSession(session());
  await api.loadCloudSave(session());
  assert.equal(renewals, 1); assert.equal(reads, 2);
});
test('a rejected fresh token is not retried indefinitely', async () => {
  let renewals = 0;
  const api = client(async url => url.includes('refresh_token') ? (renewals++, json({ ...session(), access_token: 'fresh', refresh_token: 'rotated' })) : json({ message: 'Denied' }, 401));
  api.storeSession(session());
  await assert.rejects(api.loadCloudSave(session()), error => error.status === 401);
  assert.equal(renewals, 1);
});
test('timed-out writes are never automatically replayed', async () => {
  let writes = 0;
  const api = client(() => { writes++; return new Promise(() => {}); }, { timeoutMs: 10 });
  api.storeSession(session());
  await assert.rejects(api.updateCloudSave(session(), { gold: 1 }, 'version-1'), error => error.code === 'REQUEST_TIMEOUT');
  assert.equal(writes, 1);
});
test('sign-out during refresh cannot restore the old session', async () => {
  const pending = deferred();
  const api = client(async () => pending.promise);
  const old = session({ expires_at: 1 }); api.storeSession(old);
  const read = api.loadCloudSave(old);
  await new Promise(resolve => setImmediate(resolve));
  api.storeSession(null);
  pending.resolve(json(session({ access_token: 'fresh', refresh_token: 'fresh-refresh' })));
  await assert.rejects(read, isCloudOperationCancelled);
  assert.equal(api.getStoredSession(), null);
});
test('a response from an invalidated trace is discarded', async () => {
  const pending = deferred(); const api = client(async () => pending.promise); api.storeSession(session());
  const read = api.loadCloudSave(session()); await new Promise(resolve => setImmediate(resolve));
  api.invalidateCloudRequests(); pending.resolve(json([{ payload: { gold: 999 }, updated_at: 'old' }]));
  await assert.rejects(read, isCloudOperationCancelled);
});
test('changing account during a pending login does not adopt its response', async () => {
  const pending = deferred(); const api = client(async () => pending.promise);
  const login = api.signInAccount('a@example.test', 'test-password');
  await new Promise(resolve => setImmediate(resolve));
  api.storeSession(session({ user: { id: 'player-b' } })); pending.resolve(json(session()));
  await assert.rejects(login, isCloudOperationCancelled);
  assert.equal(api.getStoredSession().user.id, 'player-b');
});
test('a canceled request waiting for config never sends a write', async () => {
  const pending = deferred(); let writes = 0;
  const api = client(async url => { if (url === '/api/supabase-config') return pending.promise; writes++; return json([]); }, { configFactory: () => null });
  api.storeSession(session());
  const write = api.updateCloudSave(session(), {}, 'version-1');
  await new Promise(resolve => setImmediate(resolve));
  api.invalidateCloudRequests(); pending.resolve(json({ supabaseUrl: 'https://example.supabase.co', supabaseAnonKey: 'public' }));
  await assert.rejects(write, isCloudOperationCancelled); assert.equal(writes, 0);
});
test('CAS conflicts remain conflicts instead of a blind upsert', async () => {
  const api = client(async (url, options) => {
    assert.match(url, /updated_at=eq.version-1/); assert.equal(options.method, 'PATCH'); return json([]);
  }); api.storeSession(session());
  await assert.rejects(api.updateCloudSave(session(), {}, 'version-1'), CloudSaveConflictError);
});
test('refresh rejects a mismatching user identity', async () => {
  const api = client(async () => json(session({ user: { id: 'another-user' } })));
  const old = session({ expires_at: 1 }); api.storeSession(old);
  await assert.rejects(api.loadCloudSave(old), error => error.code === 'SESSION_MISMATCH');
});
test('session notification distinguishes token renewal from explicit login', async () => {
  const api = client(async () => json(session({ access_token: 'new', refresh_token: 'new' })));
  const reasons = []; const unsubscribe = api.subscribeSession((_value, detail) => reasons.push(detail.reason));
  api.storeSession(session({ expires_at: 1 }));
  await api.refreshAccountSession(api.getStoredSession()); unsubscribe(); api.storeSession(null);
  assert.deepEqual(reasons, ['session-change', 'token-refresh']);
});
test('another tab rotated credentials are adopted inside the refresh lock', async () => {
  const disk = storage(); let fetches = 0;
  const fresh = session({ access_token: 'other-tab', refresh_token: 'other-tab-refresh' });
  const api = client(async () => { fetches++; return json([]); }, { storageFactory: () => disk,
    lock: async (_name, callback) => { disk.setItem(SUPABASE_SESSION_KEY, JSON.stringify(fresh)); return callback(); }
  }); const old = session({ expires_at: 1 }); api.storeSession(old);
  const result = await api.refreshAccountSession(old);
  assert.equal(result.access_token, 'other-tab'); assert.equal(fetches, 0);
});
