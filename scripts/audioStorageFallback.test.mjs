import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_AUDIO_PREFERENCES,
  readAudioPreferences,
  writeAudioPreferences
} from '../src/game/audioPreferences.js';

const withDeniedBrowserStorage = async callback => {
  const descriptors = new Map(['window', 'localStorage'].map(
    key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]
  ));
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: globalThis
  });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('Storage access denied', 'SecurityError');
    }
  });

  try {
    return await callback();
  } finally {
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
};

test('audio preference helpers tolerate a denied browser storage getter', async () => {
  await withDeniedBrowserStorage(() => {
    assert.deepEqual(readAudioPreferences(), DEFAULT_AUDIO_PREFERENCES);
    assert.deepEqual(
      writeAudioPreferences({ musicVolume: 0.25, sfxVolume: 0.6, muted: true }),
      { musicVolume: 0.25, sfxVolume: 0.6, muted: true }
    );
  });
});

test('audio singleton loads and retains settings in memory when storage is denied', async () => {
  await withDeniedBrowserStorage(async () => {
    const moduleUrl = new URL('../src/game/soundEngine.js', import.meta.url);
    moduleUrl.searchParams.set('storage-fallback', 'denied');
    const { default: sound } = await import(moduleUrl.href);

    assert.deepEqual(sound.getSettings(), DEFAULT_AUDIO_PREFERENCES);
    assert.equal(sound.ctx, null);
    assert.equal(sound.unlocked, false);

    sound.setMusicVolume(0.25);
    sound.setSfxVolume(0.6);
    sound.setMute(true);

    assert.deepEqual(sound.getSettings(), {
      musicVolume: 0.25,
      sfxVolume: 0.6,
      muted: true
    });
    assert.equal(sound.ctx, null);
    assert.equal(sound.unlocked, false);
  });
});

test('audio preference helpers tolerate storage read and write failures', () => {
  let readAttempts = 0;
  let writeAttempts = 0;
  const storage = {
    getItem() {
      readAttempts += 1;
      throw new DOMException('Storage access denied', 'SecurityError');
    },
    setItem() {
      writeAttempts += 1;
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
    }
  };

  assert.deepEqual(readAudioPreferences(storage), DEFAULT_AUDIO_PREFERENCES);
  assert.deepEqual(
    writeAudioPreferences({ musicVolume: 0.25, sfxVolume: 0.6, muted: true }, storage),
    { musicVolume: 0.25, sfxVolume: 0.6, muted: true }
  );
  assert.equal(readAttempts, 1);
  assert.equal(writeAttempts, 1);
});
