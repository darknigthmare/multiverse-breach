import { CloudHttpError, requestCloudJson } from './cloudTransport.js';
import { getBrowserStorage, readStorageValue, writeStorageValue, removeStorageValue } from './safeStorage.js';

export const SUPABASE_SESSION_KEY = 'multiverse_breach_supabase_session_v1';
const CLOUD_GAME_KEY = 'multiverse_breach';
const CLOUD_SAVE_TABLE = 'multiverse_save_states';
const REFRESH_MARGIN_SECONDS = 60;

export class CloudSaveConflictError extends Error {
  constructor(message = 'L archive cloud a change sur un autre appareil.') {
    super(message);
    this.name = 'CloudSaveConflictError';
  }
}

export class CloudOperationCancelledError extends Error {
  constructor() {
    super('Operation cloud devenue obsolete.');
    this.name = 'CloudOperationCancelledError';
    this.code = 'STALE_CLOUD_OPERATION';
  }
}

export const isCloudOperationCancelled = error => error?.code === 'STALE_CLOUD_OPERATION' || error?.name === 'AbortError';

const readEnvConfig = () => {
  const env = import.meta.env || {};
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
  return supabaseUrl && supabaseAnonKey ? { supabaseUrl, supabaseAnonKey } : null;
};

// JWT expiry is used only for scheduling. Authorization remains server-side.
const tokenExpiry = token => {
  try {
    const part = String(token).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const exp = JSON.parse(atob(part.padEnd(Math.ceil(part.length / 4) * 4, '='))).exp;
    return Number.isFinite(exp) ? exp : undefined;
  } catch { return undefined; }
};

export function normalizeCloudSession(data = {}, now = Date.now()) {
  const source = data?.session || data || {};
  const expiresAt = Number(source.expires_at);
  const expiresIn = Number(source.expires_in);
  return {
    access_token: source.access_token,
    refresh_token: source.refresh_token,
    expires_at: Number.isFinite(expiresAt) && expiresAt > 0 ? expiresAt
      : Number.isFinite(expiresIn) && expiresIn > 0 ? Math.floor(now / 1000) + expiresIn
        : tokenExpiry(source.access_token),
    user: data?.user || source.user
  };
}

/** Factory keeps transport/session tests isolated without a real account. */
export function createCloudSaveClient({
  fetchImpl = (...args) => globalThis.fetch(...args),
  storageFactory = getBrowserStorage,
  configFactory = readEnvConfig,
  now = () => Date.now(),
  timeoutMs = 12000,
  lock = (name, callback) => globalThis.navigator?.locks?.request
    ? globalThis.navigator.locks.request(name, callback) : callback()
} = {}) {
  let cachedConfig = null;
  let configRequest = null;
  let memorySession = null;
  let memoryOnly = false;
  let generation = 0;
  const refreshes = new Map();
  const listeners = new Set();
  const json = (url, options) => requestCloudJson(url, options, { fetchImpl, timeoutMs });
  const assertCurrent = expected => { if (expected !== generation) throw new CloudOperationCancelledError(); };
  const invalidateCloudRequests = () => { generation++; };

  const getStoredSession = () => {
    if (memoryOnly) return memorySession;
    const result = readStorageValue(SUPABASE_SESSION_KEY, storageFactory());
    if (!result.ok) return memorySession;
    try {
      const parsed = result.value ? JSON.parse(result.value) : null;
      return parsed?.access_token && parsed?.user?.id ? normalizeCloudSession(parsed, now()) : null;
    } catch { return null; }
  };

  const persistSession = (session, reason) => {
    memorySession = session ? normalizeCloudSession(session, now()) : null;
    const result = memorySession
      ? writeStorageValue(SUPABASE_SESSION_KEY, JSON.stringify(memorySession), storageFactory())
      : removeStorageValue(SUPABASE_SESSION_KEY, storageFactory());
    // A failed delete must not resurrect the old disk session in this window.
    memoryOnly = !result.ok;
    listeners.forEach(listener => listener(memorySession, { ...result, reason }));
    return result;
  };

  const storeSession = session => {
    invalidateCloudRequests();
    return persistSession(session, 'session-change');
  };

  const subscribeSession = listener => {
    listeners.add(listener);
    const handleStorage = event => {
      if (event.key !== SUPABASE_SESSION_KEY && event.key !== null) return;
      if (memoryOnly) return;
      const previous = memorySession;
      const session = getStoredSession();
      if (previous?.user?.id !== session?.user?.id) invalidateCloudRequests();
      memorySession = session;
      listener(session, { ok: true, reason: 'external-session' });
    };
    globalThis.window?.addEventListener?.('storage', handleStorage);
    return () => {
      listeners.delete(listener);
      globalThis.window?.removeEventListener?.('storage', handleStorage);
    };
  };

  const getSupabaseConfig = async () => {
    if (cachedConfig) return cachedConfig;
    if (!configRequest) {
      configRequest = (async () => {
        const data = configFactory() || await json('/api/supabase-config');
        if (!data?.supabaseUrl || !data?.supabaseAnonKey) throw new Error('Configuration Supabase incomplete.');
        const url = new URL(data.supabaseUrl);
        if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
          throw new Error('Configuration Supabase non securisee.');
        }
        cachedConfig = { supabaseUrl: data.supabaseUrl.replace(/\/$/, ''), supabaseAnonKey: data.supabaseAnonKey };
        return cachedConfig;
      })().finally(() => { configRequest = null; });
    }
    return configRequest;
  };

  const supabaseFetch = async (path, options = {}, accessToken = null) => {
    const expected = generation;
    const { supabaseUrl, supabaseAnonKey } = await getSupabaseConfig();
    assertCurrent(expected);
    return json(`${supabaseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken || supabaseAnonKey}`
      }
    });
  };

  const refreshAccountSession = async (requested, { force = false, signal } = {}) => {
    signal?.throwIfAborted();
    const expected = generation;
    const stored = getStoredSession();
    if (stored && stored.user.id !== requested?.user?.id) throw new CloudOperationCancelledError();
    const session = stored?.user?.id === requested?.user?.id ? stored : requested;
    if (!session?.access_token || !session?.user?.id) throw new CloudHttpError('Reconnecte ta signature cloud.', 401, 'SESSION_REQUIRED');
    const expiry = Number(session.expires_at) || tokenExpiry(session.access_token);
    // A newer token from another request/tab already satisfies a forced retry.
    if ((!force || session.access_token !== requested.access_token)
      && (!expiry || expiry > Math.floor(now() / 1000) + REFRESH_MARGIN_SECONDS)) return session;
    if (!session.refresh_token) throw new CloudHttpError('Session expiree. Reconnecte ta signature cloud.', 401, 'SESSION_EXPIRED');
    const key = `${session.user.id}:${session.refresh_token}`;
    if (!refreshes.has(key)) {
      const request = Promise.resolve(lock(`${SUPABASE_SESSION_KEY}:refresh`, async () => {
        assertCurrent(expected);
        const latest = getStoredSession();
        if (latest && latest.user.id !== session.user.id) throw new CloudOperationCancelledError();
        if (latest && latest.access_token !== session.access_token
          && (!latest.expires_at || latest.expires_at > Math.floor(now() / 1000) + REFRESH_MARGIN_SECONDS)) return latest;
        const data = await supabaseFetch('/auth/v1/token?grant_type=refresh_token', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: latest?.refresh_token || session.refresh_token })
        });
        assertCurrent(expected);
        const fresh = normalizeCloudSession(data, now());
        if (!fresh.access_token || !fresh.refresh_token || fresh.user?.id !== session.user.id) {
          throw new CloudHttpError('Renouvellement de session invalide.', 401, 'SESSION_MISMATCH');
        }
        persistSession(fresh, 'token-refresh');
        return fresh;
      })).finally(() => { refreshes.delete(key); });
      refreshes.set(key, request);
    }
    // Canceling one consumer does not cancel a renewal shared with another.
    const fresh = await refreshes.get(key);
    assertCurrent(expected);
    signal?.throwIfAborted();
    return fresh;
  };

  const authenticatedFetch = async (path, options, session) => {
    const expected = generation;
    let fresh = await refreshAccountSession(session, { signal: options.signal });
    assertCurrent(expected);
    let result;
    try { result = await supabaseFetch(path, options, fresh.access_token); }
    catch (error) {
      assertCurrent(expected);
      if (error.status !== 401 || !fresh.refresh_token) throw error;
      fresh = await refreshAccountSession(fresh, { force: true, signal: options.signal });
      assertCurrent(expected);
      // Retry only an explicitly rejected authentication, never a timed-out write.
      result = await supabaseFetch(path, options, fresh.access_token);
    }
    assertCurrent(expected);
    return result;
  };

  const credentialsRequest = async (path, email, password) => {
    const expected = generation;
    const data = await supabaseFetch(path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    assertCurrent(expected);
    return normalizeCloudSession(data, now());
  };
  const signInAccount = (email, password) => credentialsRequest('/auth/v1/token?grant_type=password', email, password);
  const signUpAccount = (email, password) => credentialsRequest('/auth/v1/signup', email, password);
  const signOutAccount = async session => {
    if (!session?.access_token) return;
    await supabaseFetch('/auth/v1/logout?scope=local', { method: 'POST' }, session.access_token);
  };
  const loadCloudSave = async (session, options = {}) => {
    if (!session?.user?.id || !session?.access_token) return null;
    const userId = encodeURIComponent(session.user.id);
    const gameKey = encodeURIComponent(CLOUD_GAME_KEY);
    const rows = await authenticatedFetch(`/rest/v1/${CLOUD_SAVE_TABLE}?select=payload,updated_at&user_id=eq.${userId}&game_key=eq.${gameKey}&limit=1`, { ...options, method: 'GET' }, session);
    if (!Array.isArray(rows)) throw new CloudHttpError('Archive cloud illisible.', 200, 'INVALID_SAVE_RESPONSE');
    return rows[0] || null;
  };
  const createCloudSave = async (session, payload, options = {}) => {
    if (!session?.user?.id || !session?.access_token) return null;
    const rows = await authenticatedFetch(`/rest/v1/${CLOUD_SAVE_TABLE}`, {
      ...options, method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ user_id: session.user.id, game_key: CLOUD_GAME_KEY, payload })
    }, session);
    if (!Array.isArray(rows) || !rows[0]?.updated_at) throw new CloudHttpError('Creation de sauvegarde non confirmee.', 200, 'INVALID_SAVE_RESPONSE');
    return rows[0];
  };
  const updateCloudSave = async (session, payload, expectedUpdatedAt, options = {}) => {
    if (!session?.user?.id || !session?.access_token || !expectedUpdatedAt) throw new CloudSaveConflictError();
    const userId = encodeURIComponent(session.user.id);
    const gameKey = encodeURIComponent(CLOUD_GAME_KEY);
    const updatedAt = encodeURIComponent(expectedUpdatedAt);
    const rows = await authenticatedFetch(`/rest/v1/${CLOUD_SAVE_TABLE}?user_id=eq.${userId}&game_key=eq.${gameKey}&updated_at=eq.${updatedAt}`, {
      ...options, method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ payload })
    }, session);
    if (!Array.isArray(rows)) throw new CloudHttpError('Confirmation cloud illisible.', 200, 'INVALID_SAVE_RESPONSE');
    if (!rows.length) throw new CloudSaveConflictError();
    if (!rows[0]?.updated_at) throw new CloudHttpError('Version cloud absente.', 200, 'INVALID_SAVE_RESPONSE');
    return rows[0];
  };

  return { getStoredSession, storeSession, subscribeSession, getSupabaseConfig,
    refreshAccountSession, invalidateCloudRequests, signInAccount, signUpAccount,
    signOutAccount, loadCloudSave, createCloudSave, updateCloudSave };
}

export const { getStoredSession, storeSession, subscribeSession, getSupabaseConfig,
  refreshAccountSession, invalidateCloudRequests, signInAccount, signUpAccount,
  signOutAccount, loadCloudSave, createCloudSave, updateCloudSave } = createCloudSaveClient();
