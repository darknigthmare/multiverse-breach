import React from 'react';

export default function AudioControl({ lang = 'fr', muted = false, onToggleMute }) {
  return (
    <button
      type="button"
      onClick={onToggleMute}
      className={`global-audio-control ${muted ? 'is-muted' : ''}`}
      aria-pressed={muted}
      title={muted
        ? (lang === 'fr' ? 'Reactive la musique et les effets sonores.' : 'Enable music and sound effects.')
        : (lang === 'fr' ? 'Coupe la musique et les effets sonores.' : 'Mute music and sound effects.')}
    >
      <span>AUDIO</span>
      <strong>{muted ? 'OFF' : 'ON'}</strong>
    </button>
  );
}
