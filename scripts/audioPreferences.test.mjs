import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AUDIO_PREFERENCES_KEY,
  DEFAULT_AUDIO_PREFERENCES,
  normalizeAudioPreferences,
  readAudioPreferences,
  writeAudioPreferences
} from '../src/game/audioPreferences.js';

const createStorage = (initialValue = null) => {
  const values = new Map();
  if (initialValue !== null) values.set(AUDIO_PREFERENCES_KEY, initialValue);
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    read: key => values.get(key)
  };
};

test('audio preferences clamp independent buses and normalize mute', () => {
  assert.deepEqual(normalizeAudioPreferences({ musicVolume: 3, sfxVolume: -2, muted: 1 }), {
    musicVolume: 1,
    sfxVolume: 0,
    muted: false
  });
});

test('audio preferences survive storage round trips', () => {
  const storage = createStorage();
  writeAudioPreferences({ musicVolume: 0.25, sfxVolume: 0.9, muted: true }, storage);
  assert.deepEqual(readAudioPreferences(storage), {
    musicVolume: 0.25,
    sfxVolume: 0.9,
    muted: true
  });
});

test('corrupt storage falls back to safe defaults', () => {
  const storage = createStorage('{broken');
  assert.deepEqual(readAudioPreferences(storage), { ...DEFAULT_AUDIO_PREFERENCES });
});
