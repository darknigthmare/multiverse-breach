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
      onClick={toggleMute}
      className="global-audio-control"
      title={muted ? 'Reactive la musique et les effets sonores.' : 'Coupe la musique et les effets sonores.'}
      style={{
        background: 'rgba(20, 20, 30, 0.75)',
        border: '1px solid #39c5bb',
        borderRadius: '4px',
        color: '#39c5bb',
        padding: '8px 12px',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 0 10px rgba(57, 197, 187, 0.3)',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#39c5bb';
        e.target.style.color = '#111';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(20, 20, 30, 0.75)';
        e.target.style.color = '#39c5bb';
      }}
    >
      <span>{muted ? '🔇' : '🔊'}</span>
      <span>{muted ? 'MUTED' : 'MUSIC ON'}</span>
    </button>
  );
}
