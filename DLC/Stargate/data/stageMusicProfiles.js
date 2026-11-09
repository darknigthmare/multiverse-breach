// Stargate — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-stargate',
    confidence: 'B',
    tempo: [86, 124],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.3, 0.48, 0.86, 0.32, 0.54] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 5, 3, 4],
    instrumentation: ['frame-drum-noise', 'low-brass-synth', 'wordless-choir-pad', 'plucked-string-synth', 'gate-metal-ring', 'subspace-pulse'],
    density: 0.68,
    restChance: 0.2,
    patterns: {
      lead: [1, 0, 0.52, 0.78, 0, 0.46],
      bass: [1, 0, 0, 0.74, 0, 0],
      drums: [1, 3, 3, 2, 3, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'chevron-lock', bars: 6, density: 0.42 },
      { name: 'offworld-patrol', bars: 8, density: 0.76 },
      { name: 'system-lord-contact', bars: 4, density: 0.96 },
      { name: 'iris-return', bars: 6, density: 0.58 }
    ],
    boss: { pattern: [1, 0, 0.5, 1, 0, 0.66], stinger: [0, 5, 7, 10, 12] },
    victory: { intervals: [0, 5, 7, 9, 12], beats: [0.6, 0.5, 0.6, 0.55, 1.45] }
  }));
}
