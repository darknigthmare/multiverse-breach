import { getBrowserStorage, readStorageValue, writeStorageValue } from './safeStorage.js';
export const getSaveBackupKey = key => `${key}_backup_v1`;

export function backupLocalSave(key, storage = getBrowserStorage()) {
  const result = readStorageValue(key, storage);
  if (!result.ok || result.value === null) return result;
  return writeStorageValue(getSaveBackupKey(key), result.value, storage);
}

export function readLocalSaveSnapshot(key, normalize, defaults, storage = getBrowserStorage()) {
  const result = readStorageValue(key, storage);
  if (!result.ok) return { payload: defaults, issue: 'persistence-failed', raw: null };
  if (result.value === null) return { payload: defaults, issue: null, raw: null };
  try {
    const parsed = JSON.parse(result.value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new TypeError('Invalid save root');
    const payload = normalize(parsed);
    if (JSON.stringify(payload) !== result.value) {
      const backup = backupLocalSave(key, storage);
      if (!backup.ok) return { payload, issue: 'backup-failed', raw: result.value };
    }
    return { payload, issue: null, raw: result.value };
  } catch {
    // The original bytes remain in place. Automatic persistence must stay blocked.
    return { payload: defaults, issue: 'invalid-save', raw: result.value };
  }
}
