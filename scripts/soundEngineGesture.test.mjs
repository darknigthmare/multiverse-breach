import test from 'node:test';
import assert from 'node:assert/strict';

import { AUDIO_PREFERENCES_KEY } from '../src/game/audioPreferences.js';
import { SoundEngine } from '../src/game/soundEngine.js';

const createGain = () => ({
  gain: {
    value: null,
    setValueAtTime(value) {
      this.value = value;
    }
  },
  connect() {}
});

test('sound engine creates AudioContext only after an explicit gesture unlock', () => {
  let constructions = 0;
  class FakeAudioContext {
    constructor() {
      constructions += 1;
      this.currentTime = 0;
      this.state = 'running';
      this.destination = {};
    }

    createGain() {
      return createGain();
    }

    resume() {}
  }

  const previousWindow = globalThis.window;
  globalThis.window = { AudioContext: FakeAudioContext };
  const storage = {
    getItem: key => key === AUDIO_PREFERENCES_KEY
      ? JSON.stringify({ musicVolume: 0.4, sfxVolume: 0.6, muted: true })
      : null,
    setItem() {}
  };

  try {
    const engine = new SoundEngine({ storage });
    engine.playBgm('title');
    assert.equal(engine.bgmRequest.stage.titleIntro, true);
    assert.equal(engine.bgmRequest.stage.id, 'nexus-title');
    assert.equal(constructions, 0);

    engine.playBgm('hub');
    assert.equal(constructions, 0);
    assert.equal(engine.ctx, null);

    engine.unlockFromGesture();
    engine.unlockFromGesture();
    assert.equal(constructions, 1);
    assert.equal(engine.musicOutput.gain.value, 0.4);
    assert.equal(engine.sfxOutput.gain.value, 0.6);
    assert.equal(engine.masterOutput.gain.value, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});
