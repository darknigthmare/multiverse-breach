// Linkin Park — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('industrialMetal', {
    id: 'mus-linkin-park',
    confidence: 'A',
    tempo: [104, 148],
    scaleName: 'minor',
    scale: SCALE_LIBRARY.minor,
    rootMidi: 40,
    chords: [0, 5, 3, 4],
    instrumentation: ['low-guitar-oscillator', 'saturated-bass', 'massive-drums', 'digital-synth', 'turntable-like-noise-pulses', 'wordless-voice-pad'],
    density: 0.86,
    patterns: {
      lead: [1, 0, 0.65, 0.35, 1, 0, 0.55, 0.4],
      bass: [1, 0, 0.45, 0, 1, 0, 0.5, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'hybrid-riff-a', bars: 8, density: 0.82 },
      { name: 'electronic-riff-b', bars: 8, density: 0.96 },
      { name: 'fragile-break', bars: 4, density: 0.42 },
      { name: 'instrumental-release', bars: 8, density: 1.04 }
    ],
    boss: { pattern: [1, 0, 0.6, 0, 1, 0, 0.7, 0], stinger: [0, 6, 7, 3, 12] },
    victory: { intervals: [0, 3, 7, 9, 12], beats: [0.5, 0.5, 0.6, 0.55, 1.45] }
  }));
}
