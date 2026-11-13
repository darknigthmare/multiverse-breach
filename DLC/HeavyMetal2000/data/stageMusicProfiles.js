// Heavy Metal 2000 — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('industrialMetal', {
    id: 'mus-heavy-metal-2000',
    confidence: 'B',
    tempo: [120, 164],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.32, 0.76, 0.28, 0.9, 0.34, 0.66] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 41,
    chords: [0, 1, 4, 3],
    instrumentation: ['distorted-oscillator-guitar', 'saturated-bass', 'wasteland-tom-noise', 'mining-chain-impact', 'cosmic-corruption-synth', 'engine-rumble', 'wordless-warrior-pad'],
    density: 0.92,
    restChance: 0.08,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'triangle', boss: 'square' },
    patterns: {
      lead: [1, 0.78, 0, 0.62, 1, 0, 0.7],
      bass: [1, 0.62, 0, 0.5, 0.88, 0, 0.56],
      drums: [1, 3, 2, 3, 1, 4, 2],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'eden-wasteland', bars: 6, density: 0.56 },
      { name: 'fakk2-pursuit', bars: 8, density: 1.02 },
      { name: 'loc-nar-warning', bars: 4, density: 0.76 },
      { name: 'tyler-fortress-assault', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.74, 1, 0, 0.64, 0.88], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.35, 0.4, 0.55, 0.5, 1.4] }
  }));
}
