import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import sound from '../../src/game/soundEngine.js';
import AudioControl from '../../src/components/AudioControl.jsx';
import MeleeControlsPanel from '../../src/components/MeleeControlsPanel.jsx';
import {
  createDefaultMeleeInputMaps, loadMeleeInputMaps, readKeyboardMeleeInput,
  replaceMeleeBinding, saveMeleeInputMaps
} from '../../src/game/melee/meleeInputMap.js';

export default function StorageHarness() {
  const [audio, setAudio] = useState(() => sound.getSettings());
  const [maps, setMaps] = useState(() => loadMeleeInputMaps());
  return <main style={{ padding: 16, background: '#10151f', color: '#fff', minHeight: '100vh' }}>
    <h1>Audio and control storage fixture</h1>
    <AudioControl muted={audio.muted} onToggleMute={() => {
      sound.setMute(!audio.muted);
      setAudio(sound.getSettings());
    }} />
    <label>Volume musique
      <input type="range" min="0" max="1" step="0.1" value={audio.musicVolume}
        onChange={event => setAudio(sound.setMusicVolume(event.target.value))} />
    </label>
    <MeleeControlsPanel maps={maps} presentation="settings"
      onRemap={(side, slot, code) => setMaps(previous => saveMeleeInputMaps(replaceMeleeBinding(previous, side, slot, code)))}
      onReset={() => setMaps(saveMeleeInputMaps(createDefaultMeleeInputMaps()))} />
    <output data-testid="storage-settings" data-muted={String(audio.muted)}
      data-music-volume={audio.musicVolume} data-audio-started={String(Boolean(sound.ctx))}
      data-left-a={readKeyboardMeleeInput(new Set(['KeyA']), maps.player).horizontal}
      data-left-q={readKeyboardMeleeInput(new Set(['KeyQ']), maps.player).horizontal}>Ready</output>
  </main>;
}

createRoot(document.getElementById('root')).render(<StorageHarness />);
