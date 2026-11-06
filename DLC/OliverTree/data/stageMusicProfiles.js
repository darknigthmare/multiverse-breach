// Oliver Tree — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('electronicStage', {
    id: 'mus-oliver-tree',
    confidence: 'B',
    tempo: [104, 142],
    scaleName: 'minor',
    scale: SCALE_LIBRARY.minor,
    rootMidi: 43,
    chords: [0, 5, 3, 4],
    instrumentation: ['compressed-guitar-oscillator', 'distorted-alt-pop-bass', 'dry-breakbeat-noise', 'detuned-piano', 'wide-synth-pad', 'scooter-bell-pulse'],
    density: 0.82,
    restChance: 0.14,
    patterns: {
      lead: [1, 0, 0.65, 0, 0.82, 0.35, 0, 0.58, 1, 0, 0.55, 0.3, 0.76, 0, 0.45, 0],
      bass: [1, 0, 0, 0, 0.78, 0, 0.42, 0, 1, 0, 0, 0, 0.68, 0, 0.38, 0],
      drums: [1, 3, 3, 3, 2, 3, 4, 3, 1, 3, 3, 4, 2, 3, 3, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'demolition-intro', bars: 4, density: 0.5 },
      { name: 'ramp-run', bars: 8, density: 0.92 },
      { name: 'awkward-break', bars: 4, density: 0.42 },
      { name: 'scooter-surge', bars: 8, density: 1.05 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.72, 0, 0.42, 0, 1, 0, 0, 0.45, 0.82, 0, 0.5, 0], stinger: [0, 3, 7, 6, 12] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.4, 0.4, 0.5, 0.45, 0.7, 1.35] }
  }));
}
