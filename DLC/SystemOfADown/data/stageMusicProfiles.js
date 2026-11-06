// System of a Down — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('industrialMetal', {
    id: 'mus-system-of-a-down',
    confidence: 'A',
    tempo: [108, 152],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.25, 0.65, 0.25, 0.82, 0.3, 0.58] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 5, 0],
    instrumentation: ['agile-distorted-oscillator-guitar', 'saturated-bass', 'sharp-drum-noise', 'angular-synth', 'struck-metal', 'nonlexical-voice-pad'],
    density: 0.94,
    patterns: {
      lead: [1, 0.75, 0, 1, 0.6, 0, 0.85],
      bass: [1, 0.65, 0, 0.9, 0.55, 0, 0.75],
      drums: [1, 3, 2, 1, 3, 2, 4],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'angular-riff-a', bars: 8, density: 0.92 },
      { name: 'tempo-rupture-b', bars: 8, density: 1.08 },
      { name: 'suspended-break', bars: 4, density: 0.48 },
      { name: 'collective-impact', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.8, 1, 0, 0.75, 0.7], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.35, 0.4, 0.55, 0.45, 1.35] }
  }));
}
