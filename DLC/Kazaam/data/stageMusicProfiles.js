// Kazaam — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('electronicStage', {
    id: 'mus-kazaam',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [94, 134],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.14, 0.28, 0.16, 0.72, 0.14, 0.36, 0.16, 0.9, 0.14, 0.3, 0.16, 0.68, 0.14, 0.4, 0.18] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 48,
    chords: [0, 3, 5, 1],
    instrumentation: ['boombox-sub-synth', 'synthetic-handclap', 'wish-chime-pulse', 'basketball-bounce-noise', 'urban-brass-synth', 'rooftop-wind-pad', 'genie-sparkle-arpeggiator'],
    density: 0.78,
    restChance: 0.16,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'sine', boss: 'triangle' },
    patterns: {
      lead: [1, 0, 0.5, 0, 0.76, 0.32, 0, 0.46, 1, 0, 0.58, 0.28, 0.7, 0, 0.4, 0],
      bass: [1, 0, 0.38, 0, 0.72, 0, 0.46, 0, 1, 0, 0.34, 0, 0.66, 0, 0.42, 0],
      drums: [1, 3, 3, 3, 2, 3, 4, 3, 1, 3, 3, 4, 2, 3, 3, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'abandoned-theater', bars: 4, density: 0.48 },
      { name: 'boombox-awakening', bars: 8, density: 0.82 },
      { name: 'wish-cascade', bars: 4, density: 0.68 },
      { name: 'rooftop-contract-showdown', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.54, 0, 0.82, 0.38, 0, 0.66, 1, 0, 0.46, 0, 0.76, 0.34, 0, 0.58], stinger: [0, 3, 7, 10, 15] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.38, 0.4, 0.48, 0.45, 0.68, 1.3] }
  }));
}
