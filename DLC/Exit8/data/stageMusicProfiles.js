// Exit 8 — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('psychologicalHorror', {
    id: 'mus-exit-8',
    confidence: 'B',
    tempo: [54, 94],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.08, 0.22, 0.08, 0.58, 0.08, 0.18, 0.08] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 47,
    chords: [0, 1, 0, 5],
    instrumentation: ['fluorescent-hum-sine', 'measured-footstep-noise', 'ventilation-drone', 'sign-chime-pulse', 'tile-reflection-delay', 'distant-train-rumble', 'anomaly-pulse'],
    density: 0.34,
    restChance: 0.5,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sine', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0, 0.34, 0, 0, 0],
      bass: [1, 0, 0, 0, 0, 0, 0.42, 0],
      drums: [0, 3, 0, 3, 0, 3, 0, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'normal-passage', bars: 8, density: 0.2 },
      { name: 'first-repeat', bars: 8, density: 0.4 },
      { name: 'anomaly-detected', bars: 4, density: 0.58 },
      { name: 'exit-or-return', bars: 8, density: 0.5 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.48, 0, 0.76, 0], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 1, 6, 7, 12], beats: [0.8, 0.7, 0.8, 0.7, 1.8] }
  }));
}
