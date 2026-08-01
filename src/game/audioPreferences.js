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

export const readAudioPreferences = (storage = globalThis?.localStorage) => {
  if (!storage?.getItem) return { ...DEFAULT_AUDIO_PREFERENCES };
  try {
    const raw = storage.getItem(AUDIO_PREFERENCES_KEY);
    return raw
      ? normalizeAudioPreferences(JSON.parse(raw))
      : { ...DEFAULT_AUDIO_PREFERENCES };
  } catch {
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
};

export const writeAudioPreferences = (preferences, storage = globalThis?.localStorage) => {
  const normalized = normalizeAudioPreferences(preferences);
  if (!storage?.setItem) return normalized;
  try {
    storage.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify(normalized));
  } catch {
    // Device preferences are best effort; audio remains usable in memory.
  }
  return normalized;
};
