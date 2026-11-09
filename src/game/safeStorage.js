/** Keep unavailable persistence distinct from an empty save. No silent success. */
export function getBrowserStorage() {
  try { return typeof window === 'undefined' ? null : window.localStorage; }
  catch { return null; }
}

export function readStorageValue(key, storage = getBrowserStorage()) {
  try {
    if (!storage) return { ok: false, value: null, reason: 'persistence-failed' };
    return { ok: true, value: storage.getItem(key), reason: null };
  } catch { return { ok: false, value: null, reason: 'persistence-failed' }; }
}

export function writeStorageValue(key, value, storage = getBrowserStorage()) {
  try {
    if (!storage || typeof value !== 'string') return { ok: false, reason: 'persistence-failed' };
    storage.setItem(key, value);
    return { ok: true, reason: null };
  } catch { return { ok: false, reason: 'persistence-failed' }; }
}

export function removeStorageValue(key, storage = getBrowserStorage()) {
  try {
    if (!storage) return { ok: false, reason: 'persistence-failed' };
    storage.removeItem(key);
    return { ok: true, reason: null };
  } catch { return { ok: false, reason: 'persistence-failed' }; }
}
