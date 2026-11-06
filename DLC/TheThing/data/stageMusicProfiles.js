// The Thing — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('xenoHorror', {
    id: 'mus-the-thing',
    confidence: 'B',
    tempo: [56, 108],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.1, 0.32, 0.1, 0.66, 0.12, 0.28, 0.1, 0.54, 0.12] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 43,
    chords: [0, 1, 5, 2],
    instrumentation: ['antarctic-wind-noise', 'irregular-sub-pulse', 'detuned-string-synth', 'outpost-metal-resonance', 'blood-test-copper-click', 'flamethrower-ignition-noise', 'isolated-piano-tone'],
    density: 0.46,
    restChance: 0.42,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.32, 0, 0, 0.58, 0, 0.24, 0],
      bass: [1, 0, 0, 0, 0, 0.68, 0, 0, 0, 0],
      drums: [0, 3, 0, 0, 4, 0, 3, 0, 2, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'whiteout-isolation', bars: 8, density: 0.22 },
      { name: 'suspicion-circle', bars: 8, density: 0.46 },
      { name: 'blood-test', bars: 5, density: 0.7 },
      { name: 'assimilation-breakout', bars: 8, density: 0.98 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.52, 0, 1, 0, 0.44, 0], stinger: [0, 6, 1, 13, 7] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.8, 0.65, 0.8, 0.65, 1.8] }
  }));
}
