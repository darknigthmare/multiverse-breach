import { getBrowserStorage, readStorageValue, writeStorageValue } from './safeStorage.js';

export const AUDIO_PREFERENCES_KEY = 'multiverse_breach_audio_preferences_v1';

export const DEFAULT_AUDIO_PREFERENCES = Object.freeze({
  musicVolume: 0.7,
  sfxVolume: 0.8,
  muted: false
});

const clampVolume = (value, fallback) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(1, Math.max(0, numericValue));
};

export const normalizeAudioPreferences = (preferences = {}) => ({
  musicVolume: clampVolume(preferences.musicVolume, DEFAULT_AUDIO_PREFERENCES.musicVolume),
  sfxVolume: clampVolume(preferences.sfxVolume, DEFAULT_AUDIO_PREFERENCES.sfxVolume),
  muted: preferences.muted === true
});

export const readAudioPreferences = (storage = getBrowserStorage()) => {
  const { ok, value: raw } = readStorageValue(AUDIO_PREFERENCES_KEY, storage);
  if (!ok || !raw) return { ...DEFAULT_AUDIO_PREFERENCES };
  try {
    return normalizeAudioPreferences(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
};

export const writeAudioPreferences = (preferences, storage = getBrowserStorage()) => {
  const normalized = normalizeAudioPreferences(preferences);
  // Device preferences are best effort; audio remains usable in memory.
  writeStorageValue(AUDIO_PREFERENCES_KEY, JSON.stringify(normalized), storage);
  return normalized;
};
