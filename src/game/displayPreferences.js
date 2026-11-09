import { readStorageValue, writeStorageValue } from './safeStorage.js';

// Display preferences are deliberately separate from progression and cloud saves.
export const DISPLAY_PREFERENCES_KEY = 'multiverse_breach_display_v1';
export const DISPLAY_PREFERENCES_EVENT = 'multiverse:display-preferences';
export const DEFAULT_DISPLAY_PREFERENCES = Object.freeze({
  version: 1, textScale: 1, hudScale: 1, safeArea: 12,
  contrast: 'standard', motion: 'system'
});

const bounded = (value, fallback, min, max) => {
  const number = Number(value);
  return value === null || value === '' || !Number.isFinite(number)
    ? fallback : Math.min(max, Math.max(min, number));
};

export function normalizeDisplayPreferences(input) {
  const value = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  return {
    version: 1,
    textScale: bounded(value.textScale, 1, 1, 1.5),
    hudScale: bounded(value.hudScale, 1, 0.9, 1.4),
    safeArea: Math.round(bounded(value.safeArea, 12, 0, 32)),
    contrast: value.contrast === 'high' ? 'high' : 'standard',
    motion: ['system', 'reduced'].includes(value.motion) ? value.motion : 'system'
  };
}

// Canvas overlays read the same bounded values that the settings screen writes.
// In particular, a chosen 0 px margin is a value, not a missing CSS property.
export function readSceneHudPreferences(style) {
  const preferences = normalizeDisplayPreferences({
    hudScale: Number.parseFloat(style?.getPropertyValue?.('--game-hud-scale')),
    safeArea: Number.parseFloat(style?.getPropertyValue?.('--game-safe-area'))
  });
  return { hudScale: preferences.hudScale, safeArea: preferences.safeArea };
}

export function readDisplayPreferences(storage) {
  const stored = readStorageValue(DISPLAY_PREFERENCES_KEY, storage);
  try { return normalizeDisplayPreferences(stored.ok ? JSON.parse(stored.value) : null); }
  catch { return { ...DEFAULT_DISPLAY_PREFERENCES }; }
}

export function saveDisplayPreferences(value, storage) {
  return writeStorageValue(DISPLAY_PREFERENCES_KEY, JSON.stringify(normalizeDisplayPreferences(value)), storage);
}

export function applyDisplayPreferences(value, root = globalThis.document?.documentElement) {
  const preferences = normalizeDisplayPreferences(value);
  if (!root) return preferences;
  root.style.setProperty('--game-text-scale', String(preferences.textScale));
  root.style.setProperty('--game-hud-scale', String(preferences.hudScale));
  root.style.setProperty('--game-safe-area', `${preferences.safeArea}px`);
  root.dataset.gameContrast = preferences.contrast;
  root.dataset.gameMotion = preferences.motion;
  return preferences;
}
