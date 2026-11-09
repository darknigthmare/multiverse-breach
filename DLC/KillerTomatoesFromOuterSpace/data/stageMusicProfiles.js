// Killer Tomatoes from Outer Space — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('comedyOddity', {
    id: 'mus-killer-tomatoes-from-outer-space',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [118, 166],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.2, 0.54, 0.24, 0.84, 0.22, 0.48] },
    scaleName: 'wholeTone',
    scale: SCALE_LIBRARY.wholeTone,
    rootMidi: 50,
    chords: [0, 2, 1, 4],
    instrumentation: ['rubber-bass-synth', 'vegetable-splat-noise', 'kazoo-like-oscillator', 'government-lab-beep', 'parade-drum-noise', 'megaphone-click-pulse', 'rolling-produce-rumble'],
    density: 0.88,
    restChance: 0.1,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'triangle', boss: 'square' },
    patterns: {
      lead: [1, 0.58, 0, 0.72, 0, 0.44, 0.82],
      bass: [1, 0, 0.5, 0, 0.86, 0, 0.42],
      drums: [1, 3, 2, 3, 1, 4, 3],
      pad: [1, 0, 0, 0, 1, 0, 0]
    },
    form: [
      { name: 'government-lab-alert', bars: 7, density: 0.62 },
      { name: 'finletter-airdrop', bars: 8, density: 0.94 },
      { name: 'tomato-siege-street', bars: 7, density: 0.82 },
      { name: 'mutant-produce-panic', bars: 8, density: 1.1 }
    ],
    boss: { pattern: [1, 0, 0.62, 1, 0, 0.48, 0.86], stinger: [0, 2, 6, 8, 12] },
    victory: { intervals: [0, 2, 6, 10, 12, 14], beats: [0.3, 0.35, 0.45, 0.4, 0.6, 1.2] }
  }));
}
