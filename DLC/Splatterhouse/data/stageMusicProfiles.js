// Splatterhouse — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('survivalHorror', {
    id: 'mus-splatterhouse',
    confidence: 'B',
    tempo: [66, 118],
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 39,
    chords: [0, 1, 5, 2],
    instrumentation: ['detuned-organ-synth', 'prepared-piano', 'low-string-drone', 'struck-chain-noise', 'arcade-toms', 'subharmonic-pulse'],
    density: 0.58,
    restChance: 0.3,
    patterns: {
      lead: [1, 0, 0.45, 0, 0.72, 0, 0.35, 0],
      bass: [1, 0, 0, 0, 0.8, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'west-mansion', bars: 8, density: 0.32 },
      { name: 'mask-awakening', bars: 4, density: 0.68 },
      { name: 'brutal-advance', bars: 8, density: 1 },
      { name: 'altar-breath', bars: 4, density: 0.45 }
    ],
    boss: { pattern: [1, 0, 0, 0, 1, 0, 0.65, 0], stinger: [0, 1, 6, 7, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.6, 0.5, 0.75, 0.6, 1.5] }
  }));
}
