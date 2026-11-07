// Zombies Ate My Neighbors — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('retroArcade', {
    id: 'mus-zombies-ate-my-neighbors',
    confidence: 'B',
    tempo: [116, 154],
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 48,
    chords: [0, 3, 1, 5],
    instrumentation: ['cartoon-organ-pulse', 'chip-bass', 'noise-drum-kit', 'theremin-style-sine', 'b-movie-brass-stab', 'suburban-doorbell-pulse'],
    density: 0.86,
    restChance: 0.12,
    patterns: {
      lead: [1, 0.72, 0, 0.5, 1, 0.62, 0.38, 0],
      bass: [1, 0, 0.6, 0, 1, 0, 0.52, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'zombie-panic', bars: 6, density: 0.76 },
      { name: 'neighbor-rescue', bars: 8, density: 0.98 },
      { name: 'backyard-breath', bars: 4, density: 0.5 },
      { name: 'b-movie-surge', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.7, 0, 1, 0.45, 0.82, 0], stinger: [0, 6, 7, 3, 12] },
    victory: { intervals: [0, 4, 7, 10, 12, 16], beats: [0.35, 0.4, 0.5, 0.45, 0.65, 1.3] }
  }));
}
