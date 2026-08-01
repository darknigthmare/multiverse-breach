const SUPABASE_SESSION_KEY = 'multiverse_breach_supabase_session_v1';
const CLOUD_GAME_KEY = 'multiverse_breach';
const CLOUD_SAVE_TABLE = 'multiverse_save_states';

export class CloudSaveConflictError extends Error {
  constructor(message = 'L archive cloud a change sur un autre appareil.') {
    super(message);
    this.name = 'CloudSaveConflictError';
  }
}

let cachedConfig = null;

const readEnvConfig = () => {
  const env = import.meta.env || {};
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
  return supabaseUrl && supabaseAnonKey ? { supabaseUrl, supabaseAnonKey } : null;
};

export const getStoredSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SUPABASE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const storeSession = (session) => {
  if (typeof window === 'undefined') return;
  if (!session) {
    window.localStorage.removeItem(SUPABASE_SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(session));
};

export const getSupabaseConfig = async () => {
  if (cachedConfig) return cachedConfig;

  const envConfig = readEnvConfig();
  if (envConfig) {
    cachedConfig = envConfig;
    return cachedConfig;
  }

  const res = await fetch('/api/supabase-config');
  if (!res.ok) {
    throw new Error('Configuration Supabase introuvable.');
  }
  const data = await res.json();
  if (!data.supabaseUrl || !data.supabaseAnonKey) {
    throw new Error('Configuration Supabase incomplete.');
  }
  cachedConfig = data;
  return cachedConfig;
};

const supabaseFetch = async (path, options = {}, accessToken = null) => {
  const { supabaseUrl, supabaseAnonKey } = await getSupabaseConfig();
  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken || supabaseAnonKey}`,
    ...(options.headers || {})
  };

  const res = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    let message = `Supabase error ${res.status}`;
    try {
      const data = await res.json();
      message = data.error_description || data.message || message;
    } catch {
      message = await res.text();
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const normalizeSession = (data) => {
  const source = data.session || data;
  return {
    access_token: source?.access_token,
    refresh_token: source?.refresh_token,
    expires_at: source?.expires_at,
    user: data.user || source?.user
  };
};

export const signUpAccount = async (email, password) => {
  const data = await supabaseFetch('/auth/v1/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return normalizeSession(data);
};

export const signInAccount = async (email, password) => {
  const data = await supabaseFetch('/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return normalizeSession(data);
};

export const signOutAccount = async (session) => {
  if (!session?.access_token) return;
  await supabaseFetch('/auth/v1/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, session.access_token);
};

export const loadCloudSave = async (session) => {
  if (!session?.user?.id || !session?.access_token) return null;
  const userId = encodeURIComponent(session.user.id);
  const gameKey = encodeURIComponent(CLOUD_GAME_KEY);
  const rows = await supabaseFetch(`/rest/v1/${CLOUD_SAVE_TABLE}?select=payload,updated_at&user_id=eq.${userId}&game_key=eq.${gameKey}&limit=1`, {
    method: 'GET'
  }, session.access_token);
  return rows?.[0] || null;
};

export const createCloudSave = async (session, payload) => {
  if (!session?.user?.id || !session?.access_token) return null;
  const rows = await supabaseFetch(`/rest/v1/${CLOUD_SAVE_TABLE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      user_id: session.user.id,
      game_key: CLOUD_GAME_KEY,
      payload
    })
  }, session.access_token);
  return rows?.[0] || null;
};

export const updateCloudSave = async (session, payload, expectedUpdatedAt) => {
  if (!session?.user?.id || !session?.access_token || !expectedUpdatedAt) {
    throw new CloudSaveConflictError();
  }
  const userId = encodeURIComponent(session.user.id);
  const gameKey = encodeURIComponent(CLOUD_GAME_KEY);
  const updatedAt = encodeURIComponent(expectedUpdatedAt);
  const rows = await supabaseFetch(`/rest/v1/${CLOUD_SAVE_TABLE}?user_id=eq.${userId}&game_key=eq.${gameKey}&updated_at=eq.${updatedAt}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({ payload })
  }, session.access_token);
  if (!rows?.length) throw new CloudSaveConflictError();
  return rows[0];
};
