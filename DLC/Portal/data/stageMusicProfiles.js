// Portal — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('cyberNetwork', {
    id: 'mus-portal',
    confidence: 'A',
    tempo: [92, 124],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.18, 0.55, 0.15, 0.8, 0.18, 0.5, 0.15] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 48,
    chords: [0, 1, 5, 3],
    instrumentation: ['synthetic-marimba', 'prepared-piano', 'modular-beeps', 'sine-bass', 'minimal-electronic-drums', 'servo-noise'],
    density: 0.58,
    restChance: 0.28,
    waves: { lead: 'square', bass: 'sine', pad: 'triangle', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.55, 0, 0.85, 0, 0.4, 0],
      bass: [1, 0, 0, 0, 0.75, 0, 0, 0],
      drums: [1, 3, 0, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'test', bars: 8, density: 0.5 },
      { name: 'solution', bars: 8, density: 0.72 },
      { name: 'facility-failure', bars: 4, density: 0.38 },
      { name: 'next-chamber', bars: 8, density: 0.8 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.8, 0, 0.45, 0], stinger: [0, 6, 8, 2, 12] },
    victory: { intervals: [0, 4, 6, 11, 12], beats: [0.45, 0.45, 0.6, 0.5, 1.4] }
  }));
}
