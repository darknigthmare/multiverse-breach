// Parasyte — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('xenoHorror', {
    id: 'mus-parasyte',
    confidence: 'B',
    tempo: [92, 142],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.5, 0.18, 0.76, 0.16, 0.42, 0.16, 0.64, 0.18] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 46,
    chords: [0, 1, 4, 2],
    instrumentation: ['elastic-string-synth', 'wet-percussion-noise', 'heartbeat-sub', 'school-bell-fragment', 'cold-piano-pulse', 'blade-swish-noise', 'human-memory-pad'],
    density: 0.7,
    restChance: 0.23,
    patterns: {
      lead: [1, 0, 0.4, 0, 0.72, 0, 0, 0.52, 0, 0.32],
      bass: [1, 0, 0, 0, 0.76, 0, 0, 0, 0.48, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0, 3, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'ordinary-morning', bars: 6, density: 0.32 },
      { name: 'right-hand-awakening', bars: 8, density: 0.72 },
      { name: 'human-question', bars: 4, density: 0.3 },
      { name: 'parasite-counterstrike', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0, 0.54, 0, 1, 0, 0, 0.7, 0], stinger: [0, 1, 7, 6, 12] },
    victory: { intervals: [0, 3, 7, 8, 12], beats: [0.6, 0.45, 0.65, 0.55, 1.5] }
  }));
}
