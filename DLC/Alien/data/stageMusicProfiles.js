// Alien — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('xenoHorror', {
    id: 'mus-alien',
    confidence: 'B',
    tempo: [62, 110],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.15, 0.42, 0.12, 0.68, 0.15, 0.35, 0.12, 0.6, 0.15] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 50,
    chords: [0, 5, 1, 2],
    instrumentation: ['microtonal-string-synth', 'treated-conch-sine', 'air-whistle-noise', 'muted-toms', 'subharmonic-drone', 'hull-metal'],
    density: 0.44,
    restChance: 0.4,
    form: [
      { name: 'cold-space-drift', bars: 9, density: 0.2 },
      { name: 'organism-detection', bars: 5, density: 0.48 },
      { name: 'industrial-pursuit', bars: 8, density: 0.9 },
      { name: 'airlock', bars: 2, density: 0.32 }
    ],
    boss: { wave: 'square', pattern: [1, 0, 0, 0, 0.5, 0, 1, 0, 0, 0], stinger: [0, 6, 1, 13, 7] },
    victory: { wave: 'sine', intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.75] }
  }));
}
