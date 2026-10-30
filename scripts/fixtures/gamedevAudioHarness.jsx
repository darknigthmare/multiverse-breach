import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import sound from '../../src/game/soundEngine.js';
import AudioControl from '../../src/components/AudioControl.jsx';

const stages = {
  a: { id: 'fixture-combat-a', name: 'Fixture combat A', universe: 'Nexus de Convergence', mode: 'Fighter' },
  b: { id: 'fixture-race-b', name: 'Fixture race B', universe: 'Nexus de Convergence', mode: 'Race' }
};

export default function AudioHarness() {
  const [settings, setSettings] = useState(() => sound.getSettings());
  const [action, setAction] = useState('ready');
  useEffect(() => {
    // Read the actual singleton. WebAudio nodes and scheduling stay native.
    window.__gamedevAudio = {
      read: () => ({
        unlocked: sound.unlocked,
        muted: sound.muted,
        context: sound.ctx?.state || null,
        scheduled: Boolean(sound.bgmInterval),
        sources: sound.activeSources.length,
        stage: sound.bgmRequest?.stage?.id || null,
        plan: sound.currentMusicPlan?.key || null,
        theme: sound.bgmTheme
      })
    };
    return () => { sound.stopBgm(); delete window.__gamedevAudio; };
  }, []);
  const run = (name, callback) => {
    callback();
    setSettings(sound.getSettings());
    setAction(name);
  };
  return <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
    <h1>Audio lifecycle fixture</h1>
    <p>Real SoundEngine and AudioControl; no audio quality or loudness assessment.</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <button data-testid="queue-a" onClick={() => run('queue-a', () => sound.playStageBgm(stages.a, 'battle'))}>Request scene A</button>
      <button data-testid="queue-b" onClick={() => run('queue-b', () => sound.playStageBgm(stages.b, 'finalLap'))}>Request scene B</button>
      <button data-testid="unlock" onClick={() => run('unlock', () => sound.unlockFromGesture())}>Enable audio</button>
      <button data-testid="stop" onClick={() => run('stop', () => sound.stopBgm())}>Stop scene music</button>
      <button data-testid="sfx" onClick={() => run('sfx', () => sound.playSfx('coin'))}>Play effect</button>
      <AudioControl muted={settings.muted} onToggleMute={() => run('mute', () => sound.setMute(!sound.muted))} />
    </div>
    <output data-testid="audio-action">{action}</output>
  </main>;
}

createRoot(document.getElementById('root')).render(<AudioHarness />);
