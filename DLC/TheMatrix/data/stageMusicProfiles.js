// The Matrix — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('cyberNetwork', {
    id: 'mus-the-matrix',
    confidence: 'A',
    tempo: [112, 146],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.25, 0.75, 0.2, 0.7, 0.25, 0.8, 0.2] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 54,
    chords: [0, 5, 1, 3],
    instrumentation: ['clustered-brass-synth', 'staccato-strings', 'prepared-piano', 'dry-breakbeat', 'fm-synth', 'data-pulses'],
    density: 0.8,
    patterns: {
      lead: [1, 0, 0.72, 0, 0.7, 0, 0.85, 0],
      bass: [1, 0, 0.55, 0, 0.9, 0, 0.5, 0],
      drums: [1, 3, 3, 2, 1, 3, 2, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'source-code', bars: 8, density: 0.62 },
      { name: 'simulation-pursuit', bars: 8, density: 1 },
      { name: 'choice', bars: 4, density: 0.44 },
      { name: 'reconfiguration', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.75, 0, 1, 0, 0.7, 0], stinger: [0, 6, 9, 1, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.5, 0.5, 0.5, 0.75, 1.5] }
  }));
}
