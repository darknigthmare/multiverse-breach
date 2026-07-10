import React, { useState } from 'react';
import sound from '../game/soundEngine';

export default function AudioControl() {
  const [muted, setMuted] = useState(sound.muted);

  const toggleMute = () => {
    const nextState = !muted;
    setMuted(nextState);
    sound.setMute(nextState);
  };

  return (
    <button
      type="button"
      onClick={toggleMute}
      className={`global-audio-control ${muted ? 'is-muted' : ''}`}
      aria-pressed={muted}
      title={muted ? 'Reactive la musique et les effets sonores.' : 'Coupe la musique et les effets sonores.'}
    >
      <span>AUDIO</span>
      <strong>{muted ? 'OFF' : 'ON'}</strong>
    </button>
  );
}
