// Death Note — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('stealthTactical', {
    id: 'mus-death-note',
    confidence: 'B',
    tempo: [74, 130],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.46, 0.72, 0.2, 0.58, 0.3] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 45,
    chords: [0, 5, 1, 4],
    instrumentation: ['clockwork-tick', 'pen-scratch-noise', 'dry-keyboard-pluck', 'interrogation-string-synth', 'low-wordless-choir-pad', 'shinigami-air-noise', 'notebook-page-rustle'],
    density: 0.65,
    restChance: 0.22,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.52, 0.74, 0, 0.46, 0.62],
      bass: [1, 0, 0, 0.68, 0, 0, 0.44],
      drums: [1, 3, 0, 2, 3, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'evidence-board', bars: 7, density: 0.42 },
      { name: 'hidden-name', bars: 7, density: 0.64 },
      { name: 'counter-deduction', bars: 7, density: 0.82 },
      { name: 'yellow-box-confrontation', bars: 7, density: 1 }
    ],
    boss: { pattern: [1, 0, 0.55, 0, 1, 0, 0.7], stinger: [0, 1, 11, 6, 12] },
    victory: { intervals: [0, 3, 7, 11, 12], beats: [0.55, 0.5, 0.65, 0.55, 1.5] }
  }));
}
