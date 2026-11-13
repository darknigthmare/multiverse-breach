// Saw — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('psychologicalHorror', {
    id: 'mus-saw',
    confidence: 'B',
    tempo: [64, 126],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.12, 0.38, 0.12, 0.74, 0.14, 0.34, 0.12, 0.62, 0.14] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 42,
    chords: [0, 1, 5, 2],
    instrumentation: ['trap-timer-click', 'rusted-chain-noise', 'prepared-piano', 'mechanical-ratchet-pulse', 'low-heartbeat-sub', 'tape-hiss', 'scraped-metal-synth'],
    density: 0.58,
    restChance: 0.3,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.44, 0, 0, 0.68, 0, 0.3, 0],
      bass: [1, 0, 0, 0, 0.72, 0, 0, 0, 0.5, 0],
      drums: [1, 3, 0, 4, 2, 3, 0, 4, 3, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'locked-room', bars: 6, density: 0.32 },
      { name: 'recorded-rule', bars: 5, density: 0.5 },
      { name: 'choice-window', bars: 5, density: 0.76 },
      { name: 'trap-cycle', bars: 6, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0.48, 0, 1, 0, 0.72, 0, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.65, 0.75, 0.65, 1.7] }
  }));
}
