// Silent Hill — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('psychologicalHorror', {
    id: 'mus-silent-hill',
    confidence: 'A',
    tempo: [58, 102],
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 45,
    chords: [0, 1, 4, 2],
    instrumentation: ['clean-baritone-pluck', 'detuned-piano', 'struck-sheet-metal', 'analog-drone', 'radio-breath', 'abrasive-string-synth'],
    density: 0.4,
    restChance: 0.42,
    form: [
      { name: 'acoustic-fog', bars: 8, density: 0.24 },
      { name: 'guilty-memory', bars: 8, density: 0.42 },
      { name: 'industrial-otherworld', bars: 4, density: 0.92 },
      { name: 'altered-return', bars: 8, density: 0.55 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.85, 0, 0, 0], stinger: [0, 1, 6, 12, 7] },
    victory: { intervals: [0, 3, 6, 7, 12], beats: [0.75, 0.75, 0.5, 0.75, 1.75] }
  }));
}
