import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authRecoveryMessage, consumeAuthCallback, createAuthRecoveryService, getAuthReturnUrl, isValidAuthEmail, validateRecoveryPassword } from '../src/game/authRecovery.js';

const now = 1792152000000;
const user = { id: 'recovery-test', email: 'player@example.test', email_confirmed_at: '2026-10-16T10:00:00Z' };
const response = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });
const service = (fetchImpl, extras = {}) => createAuthRecoveryService({ fetchImpl, now: () => now,
  configFactory: async () => ({ supabaseUrl: 'https://auth.example.test', supabaseAnonKey: 'public-test-key' }),
  locationFactory: () => ({ href: 'https://game.example.test/?redirect_to=https://evil.example/#access_token=not-real' }), ...extras });
const parse = href => { const calls = []; const result = consumeAuthCallback({ href }, { state: { x: 1 }, replaceState: (...args) => calls.push(args) }); return { result, calls }; };
const proof = { type: 'recovery', accessToken: 'synthetic-token', invalid: false };

for (const type of ['recovery', 'signup']) {
  test(`${type} implicit link strips credentials and preserves unrelated query parameters`, () => {
    const { result, calls } = parse(`https://game.example.test/?lang=en#type=${type}&access_token=synthetic&refresh_token=secret&expires_in=3600`);
    assert.equal(result.type, type); assert.equal(result.invalid, false); assert.equal(result.accessToken, 'synthetic');
    assert.equal('refreshToken' in result, false); assert.equal(calls[0][2], '/?lang=en');
  });
  test(`${type} hashed link is removed before server verification`, () => {
    const { result, calls } = parse(`https://game.example.test/?type=${type}&token_hash=synthetic-hash&lang=fr`);
    assert.equal(result.tokenHash, 'synthetic-hash'); assert.equal(result.invalid, false); assert.equal(calls[0][2], '/?lang=fr');
  });
}
for (const link of ['#type=recovery', '#type=recovery&access_token=a&token_hash=b', '#type=magiclink&access_token=a', '#type=signup&code=pkce', '?type=recovery&access_token=a#access_token=b', '#type=recovery&access_token=a&error=denied', '#error_description=expired&access_token=a']) {
  test(`invalid or ambiguous callback is never adopted: ${link}`, () => {
    const { result, calls } = parse(`https://game.example.test/${link}`);
    assert.equal(result.invalid, true); assert.doesNotMatch(calls[0][2], /access_token|token_hash|error_description|code=/);
  });
}
test('ordinary links are not rewritten as authentication callbacks', () => {
  assert.equal(parse('https://game.example.test/?category=heroes#collection').result, null);
});
test('cannot use credentials that fail URL cleanup', () => {
  const callback = consumeAuthCallback({ href: 'https://game.example.test/#type=recovery&access_token=secret' }, { replaceState() { throw new Error('denied'); } });
  assert.equal(callback.invalid, true); assert.equal(callback.accessToken, ''); assert.equal(callback.cleanupFailed, true);
});
test('callback redirect uses current origin and path only', () => {
  assert.equal(getAuthReturnUrl({ href: 'https://game.example.test/index.html?next=https://evil.test#secret' }), 'https://game.example.test/index.html');
  assert.equal(getAuthReturnUrl({ href: 'http://localhost:5173/' }), 'http://localhost:5173/');
  assert.throws(() => getAuthReturnUrl({ href: 'http://game.example.test/' }));
});
for (const email of ['', 'x', 'a@', 'a b@c.test', 'a@c', `${'a'.repeat(255)}@a.test`]) test(`invalid email is refused: ${email.slice(0, 12)}`, () => assert.equal(isValidAuthEmail(email), false));
test('password comparison does not trim the password', () => {
  assert.equal(validateRecoveryPassword('long password ', 'long password'), 'PASSWORD_MISMATCH');
  assert.equal(validateRecoveryPassword('short', 'short'), 'PASSWORD_LENGTH');
  assert.equal(validateRecoveryPassword('x'.repeat(129), 'x'.repeat(129)), 'PASSWORD_LENGTH');
  assert.equal(validateRecoveryPassword('long password ', 'long password '), null);
});
for (const kind of ['requestPasswordReset', 'resendConfirmation']) {
  test(`${kind} sends an email without a password or any save request`, async () => {
    const calls = [];
    const api = service(async (url, options) => { calls.push({ url, options }); return response({}); });
    const result = await api[kind](' player@example.test ');
    assert.equal(result.accepted, true); assert.equal(result.retryAt, now + 60000);
    assert.equal(calls.length, 1);
    const url = new URL(calls[0].url);
    assert.equal(url.pathname, `/auth/v1/${kind === 'requestPasswordReset' ? 'recover' : 'resend'}`);
    assert.equal(url.searchParams.get('redirect_to'), 'https://game.example.test/');
    assert.deepEqual(JSON.parse(calls[0].options.body), kind === 'requestPasswordReset' ? { email: user.email } : { email: user.email, type: 'signup' });
    await assert.rejects(api[kind](user.email), error => error.code === 'EMAIL_COOLDOWN');
    assert.equal(calls.length, 1);
  });
}
test('invalid redirects can fail repeatedly without caching a rejected operation forever', async () => {
  let location = 'http://bad.test/';
  const api = service(async () => response({}), { locationFactory: () => ({ href: location }) });
  await assert.rejects(api.requestPasswordReset(user.email));
  location = 'https://game.example.test/';
  assert.equal((await api.requestPasswordReset(user.email)).accepted, true);
});
test('email requests are coalesced while pending', async () => {
  let complete; let calls = 0;
  const api = service(() => { calls++; return new Promise(resolve => { complete = resolve; }); });
  const a = api.requestPasswordReset(user.email); const b = api.requestPasswordReset(user.email);
  await new Promise(resolve => setImmediate(resolve)); assert.equal(calls, 1);
  complete(response({})); assert.deepEqual(await a, await b);
});
test('server rate limit is respected and does not display raw server details', async () => {
  const api = service(async () => response({ message: 'private details' }, 429, { 'Retry-After': '120' }));
  await assert.rejects(api.requestPasswordReset(user.email), error => error.status === 429 && error.retryAt === now + 120000 && !authRecoveryMessage(error).includes('private'));
});
test('callback verifies user with the bearer token, never from JWT payload or local storage', async () => {
  const calls = [];
  const api = service(async (url, options) => { calls.push({ url, options }); return response(user); });
  const flow = api.createFlow(proof);
  assert.deepEqual(await flow.verify(), { type: 'recovery', email: user.email });
  assert.equal(calls.length, 1); assert.equal(calls[0].options.headers.Authorization, 'Bearer synthetic-token');
  assert.equal(new URL(calls[0].url).pathname, '/auth/v1/user');
});
test('StrictMode repeated verification consumes a hashed token exactly once', async () => {
  let verifies = 0; let users = 0;
  const api = service(async (url, options) => {
    if (url.endsWith('/verify')) { verifies++; assert.deepEqual(JSON.parse(options.body), { type: 'recovery', token_hash: 'one-use' }); return response({ access_token: 'verified-token', user }); }
    users++; return response(user);
  });
  const flow = api.createFlow({ type: 'recovery', tokenHash: 'one-use' });
  await Promise.all([flow.verify(), flow.verify()]); assert.equal(verifies, 1); assert.equal(users, 1);
});
test('recovery does not persist a session or call save endpoints; double submit updates only once', async () => {
  const calls = [];
  const flow = service(async (url, options) => { calls.push({ url, options }); return response(user); }).createFlow(proof);
  await flow.verify();
  await Promise.all([flow.changePassword('valid-new-password', 'valid-new-password'), flow.changePassword('valid-new-password', 'valid-new-password')]);
  assert.deepEqual(calls.map(call => [new URL(call.url).pathname, call.options.method || 'GET']), [['/auth/v1/user', 'GET'], ['/auth/v1/user', 'PUT']]);
  assert.deepEqual(JSON.parse(calls[1].options.body), { password: 'valid-new-password' });
  await assert.rejects(flow.changePassword('valid-new-password', 'valid-new-password'));
  assert.equal(calls.length, 2);
});
test('signup callback confirms email but cannot change a password', async () => {
  const flow = service(async () => response(user)).createFlow({ ...proof, type: 'signup' });
  assert.equal((await flow.verify()).type, 'signup');
  await assert.rejects(flow.changePassword('new-password', 'new-password'));
});
test('unconfirmed email is not presented as a confirmed signup', async () => {
  const flow = service(async () => response({ ...user, email_confirmed_at: null })).createFlow({ ...proof, type: 'signup' });
  await assert.rejects(flow.verify());
});
test('expired tokens cannot change a password', async () => {
  const calls = [];
  const flow = service(async (url, options) => { calls.push(options.method || 'GET'); return response({ message: 'expired' }, 401); }).createFlow(proof);
  await assert.rejects(flow.changePassword('new-password', 'new-password'));
  assert.deepEqual(calls, ['GET']);
});
test('password mismatch sends no request', async () => {
  let calls = 0;
  const flow = service(async () => { calls++; return response(user); }).createFlow(proof);
  await assert.rejects(flow.changePassword('new-password', 'wrong-password'));
  assert.equal(calls, 0);
});
test('abort cancels the underlying validation and prevents late adoption', async () => {
  let signal;
  const flow = service((_url, options) => { signal = options.signal; return new Promise(() => {}); }).createFlow(proof);
  const pending = flow.verify(); await new Promise(resolve => setImmediate(resolve));
  flow.dispose(); await assert.rejects(pending, { name: 'AbortError' }); assert.equal(signal.aborted, true);
});
test('a changed user in the response is not accepted as success', async () => {
  const flow = service(async (_url, options) => response(options.method === 'PUT' ? { ...user, id: 'other' } : user)).createFlow(proof);
  await assert.rejects(flow.changePassword('new-password', 'new-password'), error => error.code === 'INVALID_AUTH_CALLBACK');
});
test('a timed out password change is not automatically repeated', async () => {
  let writes = 0;
  const flow = service(async (_url, options) => options.method === 'PUT' ? (writes++, new Promise(() => {})) : response(user), { timeoutMs: 10 }).createFlow(proof);
  await assert.rejects(flow.changePassword('new-password', 'new-password'), error => error.code === 'REQUEST_TIMEOUT');
  assert.equal(writes, 1);
});
