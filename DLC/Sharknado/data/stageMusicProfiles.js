// Sharknado — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('comedyOddity', {
    id: 'mus-sharknado',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [126, 174],
    meter: { beats: 6, unit: 8, subdivisions: 2, accents: [1, 0.14, 0.38, 0.16, 0.72, 0.18, 0.94, 0.16, 0.42, 0.14, 0.68, 0.2] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 45,
    chords: [0, 4, 3, 5],
    instrumentation: ['surf-guitar-oscillator', 'storm-wind-noise', 'rotor-chop-pulse', 'chainsaw-like-synth', 'lifeguard-whistle-sine', 'floodwater-impact', 'airborne-shark-rush-noise'],
    density: 0.94,
    restChance: 0.08,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'triangle', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.5, 0.72, 0, 0.42, 1, 0, 0.62, 0.38, 0.76, 0],
      bass: [1, 0, 0.44, 0, 0.8, 0, 1, 0, 0.5, 0, 0.72, 0],
      drums: [1, 3, 2, 3, 1, 4, 1, 3, 2, 4, 1, 3],
      pad: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'santa-monica-warning', bars: 6, density: 0.68 },
      { name: 'freeway-flood', bars: 8, density: 0.96 },
      { name: 'airborne-shark-swarm', bars: 6, density: 1.04 },
      { name: 'eye-of-the-sharknado', bars: 8, density: 1.14 }
    ],
    boss: { pattern: [1, 0, 0.6, 0, 0.82, 1, 0, 0.46, 0.74, 0, 1, 0.52], stinger: [0, 5, 7, 10, 14] },
    victory: { intervals: [0, 4, 7, 9, 12, 16], beats: [0.3, 0.32, 0.4, 0.38, 0.58, 1.15] }
  }));
}
