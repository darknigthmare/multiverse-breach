// Left 4 Dead — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('survivalHorror', {
    id: 'mus-left-4-dead',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [74, 150],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.1, 0.28, 0.12, 0.62, 0.1, 0.34, 0.12, 0.9, 0.1, 0.3, 0.12, 0.66, 0.1, 0.4, 0.14] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 38,
    chords: [0, 1, 5, 2],
    instrumentation: ['distant-infected-noise', 'safe-room-guitar-oscillator', 'heartbeat-sub', 'rooftop-wind-noise', 'horde-snare-clatter', 'rescue-radio-static', 'special-infected-stinger-synth'],
    density: 0.68,
    restChance: 0.24,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.38, 0, 0, 0.56, 0, 0.82, 0, 0, 0.44, 0, 0.64, 0, 0],
      bass: [1, 0, 0, 0, 0.58, 0, 0, 0, 0.9, 0, 0, 0, 0.7, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0, 1, 3, 2, 3, 1, 4, 3, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'safe-room-exit', bars: 4, density: 0.32 },
      { name: 'hospital-ascent', bars: 8, density: 0.66 },
      { name: 'crescendo-horde', bars: 6, density: 1.06 },
      { name: 'no-mercy-evacuation', bars: 8, density: 1.16 }
    ],
    boss: { pattern: [1, 0, 0.42, 0, 0.72, 0, 1, 0.5, 1, 0, 0.58, 0, 0.86, 0, 0.7, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.7, 0.58, 0.72, 0.62, 1.65] }
  }));
}
