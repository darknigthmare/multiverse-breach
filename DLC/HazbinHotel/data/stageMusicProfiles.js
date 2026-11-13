// Hazbin Hotel — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('comedyOddity', {
    id: 'mus-hazbin-hotel',
    confidence: 'B',
    tempo: [96, 144],
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 48,
    chords: [0, 4, 1, 5],
    instrumentation: ['cabaret-piano-synth', 'upright-bass-synth', 'muted-brass-synth', 'brushed-drum-noise', 'theater-organ-pad', 'infernal-bell', 'wordless-ensemble-pad'],
    density: 0.8,
    restChance: 0.14,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.72, 0.35, 0.9, 0, 0.58, 0.42],
      bass: [1, 0, 0.52, 0, 0.82, 0, 0.48, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'lobby-overture', bars: 6, density: 0.54 },
      { name: 'pentagram-cabaret', bars: 8, density: 0.94 },
      { name: 'redemption-bridge', bars: 4, density: 0.46 },
      { name: 'infernal-finale', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.65, 0, 1, 0.4, 0.72, 0], stinger: [0, 6, 10, 3, 12] },
    victory: { intervals: [0, 4, 7, 11, 12, 16], beats: [0.4, 0.45, 0.5, 0.45, 0.65, 1.35] }
  }));
}
