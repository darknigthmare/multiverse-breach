// Rob Zombie — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('industrialMetal', {
    id: 'mus-rob-zombie',
    confidence: 'A',
    tempo: [104, 148],
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 4, 5],
    instrumentation: ['horror-guitar-oscillator', 'saturated-bass', 'massive-drums', 'grindhouse-synth', 'struck-steel', 'nonlexical-voice-pad'],
    density: 0.88,
    form: [
      { name: 'grindhouse-riff', bars: 8, density: 0.86 },
      { name: 'mechanical-stage', bars: 8, density: 1 },
      { name: 'horror-break', bars: 4, density: 0.55 },
      { name: 'monster-refrain', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.75, 0, 1, 0, 0.65, 0.8], stinger: [0, 1, 6, 10, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.45, 0.45, 0.6, 0.5, 1.4] }
  }));
}
