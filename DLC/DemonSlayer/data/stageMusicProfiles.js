// Demon Slayer — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('animeHeroic', {
    id: 'mus-demon-slayer',
    confidence: 'A',
    tempo: [122, 162],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.25, 0.48, 0.86, 0.28, 0.52] },
    scaleName: 'ritualMinor',
    scale: SCALE_LIBRARY.ritualMinor,
    rootMidi: 50,
    chords: [0, 3, 4, 1],
    instrumentation: ['chamber-string-synth', 'plucked-string-oscillator', 'ritual-toms', 'piano', 'wordless-choir-pad', 'breath-noise'],
    density: 0.8,
    patterns: {
      lead: [1, 0, 0.62, 0.9, 0, 0.55],
      bass: [1, 0, 0, 0.8, 0, 0],
      drums: [1, 3, 3, 2, 3, 3],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'breathing-preparation', bars: 8, density: 0.5 },
      { name: 'blade-duel', bars: 8, density: 0.94 },
      { name: 'memory', bars: 4, density: 0.44 },
      { name: 'technique-release', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.6, 1, 0, 0.7], stinger: [0, 5, 8, 11, 12] },
    victory: { intervals: [0, 5, 7, 11, 12], beats: [0.6, 0.45, 0.65, 0.5, 1.5] }
  }));
}
