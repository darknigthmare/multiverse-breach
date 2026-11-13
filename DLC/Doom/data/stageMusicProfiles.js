// Doom — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('industrialMetal', {
    id: 'mus-doom',
    confidence: 'A',
    tempo: [132, 172],
    meter: { beats: 9, unit: 8, subdivisions: 1, accents: [1, 0.35, 0.7, 0.3, 0.85, 0.3, 0.72, 0.35, 0.62] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 4, 0],
    instrumentation: ['eight-string-oscillator-rig', 'distorted-modular-synth', 'metal-drum-noise', 'sub-bass', 'chain-impact', 'wordless-low-choir-pad'],
    density: 0.96,
    restChance: 0.06,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0.8, 0, 1, 0.65, 0, 0.85, 0.7, 0],
      bass: [1, 0.7, 0, 1, 0.55, 0, 0.8, 0.65, 0],
      drums: [1, 3, 2, 1, 3, 2, 1, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'industrial-build', bars: 4, density: 0.72 },
      { name: 'hell-assault', bars: 8, density: 1.08 },
      { name: 'mechanical-breakdown', bars: 4, density: 0.7 },
      { name: 'overload', bars: 8, density: 1.15 },
      { name: 'relentless-return', bars: 4, density: 1 }
    ],
    boss: { wave: 'square', pattern: [1, 0, 0.75, 1, 0, 0.7, 1, 0, 0.65], stinger: [0, 1, 6, 7, 12] },
    victory: { wave: 'sawtooth', intervals: [0, 3, 6, 7, 12], beats: [0.35, 0.35, 0.55, 0.45, 1.4] }
  }));
}
