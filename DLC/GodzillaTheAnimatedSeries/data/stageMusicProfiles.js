// Godzilla The Animated Series — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-godzilla-the-animated-series',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [96, 146],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.14, 0.46, 0.16, 0.8, 0.18, 0.36, 0.14, 0.68, 0.18] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 41,
    chords: [0, 5, 4, 3],
    instrumentation: ['heat-lab-sequencer', 'harbor-sonar-pulse', 'seismograph-clicks', 'heavy-response-toms', 'mutant-frequency-synth', 'synthetic-titan-brass', 'jamaica-bay-wind-noise'],
    density: 0.82,
    restChance: 0.16,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.56, 0, 0.76, 0.36, 0, 0.62, 0, 0.44],
      bass: [1, 0, 0, 0, 0.82, 0, 0.5, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 1, 0, 4, 0, 2],
      pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    form: [
      { name: 'jamaica-bay-scan', bars: 5, density: 0.46 },
      { name: 'heat-mobilization', bars: 8, density: 0.84 },
      { name: 'mutation-pursuit', bars: 5, density: 0.94 },
      { name: 'manhattan-waterfront-titan', bars: 8, density: 1.1 }
    ],
    boss: { pattern: [1, 0, 0, 0.58, 0, 1, 0, 0.74, 0, 0.42], stinger: [0, 5, 9, 7, 12] },
    victory: { intervals: [0, 5, 7, 11, 12], beats: [0.48, 0.5, 0.6, 0.54, 1.45] }
  }));
}
