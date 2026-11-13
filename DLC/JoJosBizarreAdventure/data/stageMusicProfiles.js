// JoJo's Bizarre Adventure — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('animeHeroic', {
    id: 'mus-jojo-s-bizarre-adventure',
    confidence: 'A',
    tempo: [122, 162],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 50,
    chords: [0, 3, 5, 1],
    instrumentation: ['dramatic-brass-synth', 'electric-guitar-oscillator', 'syncopated-toms', 'piano-stabs', 'wordless-choir-pad', 'funk-bass-synth'],
    density: 0.9,
    patterns: {
      lead: [1, 0, 0.8, 0.45, 1, 0.35, 0.7, 0],
      bass: [1, 0, 0.55, 0, 0.9, 0, 0.5, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'pose-and-tension', bars: 6, density: 0.62 },
      { name: 'stand-duel', bars: 8, density: 1.02 },
      { name: 'tactical-reversal', bars: 4, density: 0.7 },
      { name: 'decisive-rush', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.7, 0, 1, 0, 0.75, 0.5], stinger: [0, 6, 10, 3, 12] },
    victory: { intervals: [0, 3, 7, 10, 12, 15], beats: [0.4, 0.45, 0.5, 0.45, 0.65, 1.4] }
  }));
}
