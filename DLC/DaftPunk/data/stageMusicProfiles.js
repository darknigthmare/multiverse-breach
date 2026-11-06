// Daft Punk — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('electronicStage', {
    id: 'mus-daft-punk',
    confidence: 'A',
    tempo: [118, 136],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 45,
    chords: [0, 3, 5, 4],
    instrumentation: ['sidechain-sine-bass', 'analog-synth', 'wordless-vocoder-pad', 'dry-clap-noise', 'arpeggiator', 'hybrid-string-pad'],
    density: 0.84,
    form: [
      { name: 'filtered-intro', bars: 4, density: 0.4 },
      { name: 'club-a', bars: 8, density: 0.86 },
      { name: 'original-build', bars: 4, density: 0.7 },
      { name: 'synthetic-drop', bars: 8, density: 1.08 },
      { name: 'glass-break', bars: 4, density: 0.45 },
      { name: 'alive-return', bars: 8, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.8, 0, 0, 0, 1, 0, 0, 0, 0.8, 0, 0.55, 0], stinger: [0, 7, 10, 3, 12] },
    victory: { intervals: [0, 3, 7, 10, 12, 15], beats: [0.4, 0.4, 0.5, 0.45, 0.65, 1.35] }
  }));
}
