// Vocaloid — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('electronicStage', {
    id: 'mus-vocaloid',
    confidence: 'B',
    tempo: [124, 164],
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 54,
    chords: [0, 4, 1, 5],
    instrumentation: ['bright-pulse-lead', 'sidechain-sine-bass', 'glass-marimba', 'rapid-arpeggiator', 'four-on-floor-noise-kit', 'wordless-formant-pad', 'digital-crowd-pulse'],
    density: 0.9,
    restChance: 0.08,
    patterns: {
      lead: [1, 0, 0.62, 0.35, 0.88, 0, 0.55, 0.3, 1, 0, 0.68, 0.4, 0.82, 0.3, 0.5, 0],
      bass: [1, 0, 0, 0, 0.78, 0, 0, 0, 1, 0, 0.42, 0, 0.76, 0, 0, 0],
      drums: [1, 3, 3, 3, 2, 3, 3, 4, 1, 3, 3, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'projection-intro', bars: 4, density: 0.52 },
      { name: 'digital-stage-a', bars: 8, density: 0.96 },
      { name: 'audience-build', bars: 4, density: 0.78 },
      { name: 'mirai-release', bars: 8, density: 1.1 },
      { name: 'encore-return', bars: 4, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0.45, 0.82, 0, 0.52, 0, 1, 0, 0.42, 0, 0.86, 0, 0.58, 0], stinger: [0, 6, 11, 4, 12] },
    victory: { intervals: [0, 4, 6, 11, 12, 16], beats: [0.35, 0.4, 0.45, 0.45, 0.65, 1.3] }
  }));
}
