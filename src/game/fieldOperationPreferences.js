import { getBrowserStorage, readStorageValue, writeStorageValue } from './safeStorage.js';

export const FIELD_OPERATION_PREFERENCES_KEY = 'multiverse_breach_field_options_v1';
export const DEFAULT_FIELD_OPERATION_PREFERENCES = Object.freeze({
  schemaVersion: 1, reconnaissance: 'standard', relays: 'standard'
});
export function normalizeFieldOperationPreferences(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) && value.schemaVersion === 1 ? value : {};
  return { schemaVersion: 1,
    reconnaissance: source.reconnaissance === 'cross-check' ? 'cross-check' : 'standard',
    relays: source.relays === 'contested' ? 'contested' : 'standard' };
}
/** Preferences are not progression. Failed writes remain session-only, explicitly. */
export function createFieldOperationPreferenceStore(storageFactory = getBrowserStorage) {
  let current = { ...DEFAULT_FIELD_OPERATION_PREFERENCES };
  let volatile = false;
  const storage = () => { try { return storageFactory(); } catch { return null; } };
  return {
    read() {
      if (volatile) return { value: { ...current }, persisted: false };
      const result = readStorageValue(FIELD_OPERATION_PREFERENCES_KEY, storage());
      if (!result.ok) return { value: { ...current }, persisted: false };
      try {
        current = normalizeFieldOperationPreferences(result.value ? JSON.parse(result.value) : null);
        return { value: { ...current }, persisted: true };
      } catch {
        current = { ...DEFAULT_FIELD_OPERATION_PREFERENCES };
        return { value: { ...current }, persisted: false };
      }
    },
    write(value) {
      current = normalizeFieldOperationPreferences(value);
      const result = writeStorageValue(FIELD_OPERATION_PREFERENCES_KEY, JSON.stringify(current), storage());
      volatile = !result.ok;
      return { value: { ...current }, persisted: result.ok };
    }
  };
}
export const fieldOperationPreferenceStore = createFieldOperationPreferenceStore();
export const getFieldOperationPreferences = () => fieldOperationPreferenceStore.read().value;
