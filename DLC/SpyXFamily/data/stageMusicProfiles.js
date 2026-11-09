// Spy x Family — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('stealthTactical', {
    id: 'mus-spy-x-family',
    confidence: 'B',
    tempo: [102, 144],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 53,
    chords: [0, 3, 4, 1],
    instrumentation: ['pizzicato-chamber-synth', 'brushed-snare-noise', 'muted-brass-synth', 'celesta-pulse', 'upright-bass-synth', 'covert-clock-tick', 'wordless-family-pad'],
    density: 0.76,
    restChance: 0.18,
    patterns: {
      lead: [1, 0, 0.62, 0.35, 0.82, 0, 0.48, 0.28],
      bass: [1, 0, 0.42, 0, 0.76, 0, 0.36, 0],
      drums: [1, 3, 0, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'eden-briefing', bars: 6, density: 0.5 },
      { name: 'covert-tail', bars: 8, density: 0.88 },
      { name: 'family-breath', bars: 4, density: 0.42 },
      { name: 'operation-strix-surge', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.52, 0, 1, 0.38, 0.72, 0], stinger: [0, 3, 7, 6, 12] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.4, 0.45, 0.5, 0.5, 0.7, 1.35] }
  }));
}
