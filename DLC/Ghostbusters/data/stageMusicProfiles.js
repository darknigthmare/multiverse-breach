// Ghostbusters — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('comedyOddity', {
    id: 'mus-ghostbusters',
    confidence: 'B',
    tempo: [112, 148],
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 48,
    chords: [0, 4, 1, 5],
    instrumentation: ['elastic-bass-synth', 'paranormal-sine-pulse', 'theater-organ-synth', 'dry-brass-stab-synth', 'electro-drum-noise', 'proton-click-noise', 'wordless-choir-pad'],
    density: 0.84,
    restChance: 0.12,
    patterns: {
      lead: [1, 0, 0.7, 0.38, 0.92, 0, 0.56, 0.42],
      bass: [1, 0.52, 0, 0.42, 0.88, 0, 0.48, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'firehouse-call', bars: 6, density: 0.58 },
      { name: 'ectoplasm-chase', bars: 8, density: 0.96 },
      { name: 'containment-warning', bars: 4, density: 0.52 },
      { name: 'rooftop-crossrip', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.68, 0, 1, 0.45, 0.78, 0], stinger: [0, 6, 10, 3, 12] },
    victory: { intervals: [0, 4, 7, 11, 12, 16], beats: [0.35, 0.4, 0.5, 0.45, 0.7, 1.3] }
  }));
}
