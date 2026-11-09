// Rammstein — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('industrialMetal', {
    id: 'mus-rammstein',
    confidence: 'A',
    tempo: [104, 148],
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 4, 0],
    instrumentation: ['low-distorted-oscillator-guitar', 'saturated-bass', 'massive-drums', 'industrial-synth', 'struck-steel', 'nonlexical-low-voice-pad'],
    density: 0.9,
    patterns: {
      lead: [1, 0.7, 0, 0.8, 1, 0, 0.6, 0.85],
      bass: [1, 0.65, 0, 0.75, 1, 0, 0.55, 0.8],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'machine-riff-a', bars: 8, density: 0.9 },
      { name: 'pyro-riff-b', bars: 8, density: 1 },
      { name: 'steel-break', bars: 4, density: 0.58 },
      { name: 'frontline-refrain', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.8, 0, 1, 0, 0.75, 0.8], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.4, 0.45, 0.6, 0.5, 1.4] }
  }));
}
