// Halo — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-halo',
    confidence: 'A',
    tempo: [88, 124],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.28, 0.45, 0.82, 0.3, 0.48] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 52,
    chords: [0, 4, 1, 5],
    instrumentation: ['wordless-low-choir-pad', 'wide-string-synth', 'timpani-noise', 'military-snare', 'space-pad', 'low-bell'],
    density: 0.68,
    patterns: {
      lead: [1, 0, 0.55, 0.8, 0, 0.5],
      bass: [1, 0, 0, 0.75, 0, 0],
      drums: [1, 3, 3, 2, 3, 3],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'ring-contemplation', bars: 8, density: 0.42 },
      { name: 'frontline-march', bars: 8, density: 0.82 },
      { name: 'ancient-threat', bars: 4, density: 0.7 },
      { name: 'choral-return', bars: 4, density: 0.9 }
    ],
    boss: { pattern: [1, 0, 0.45, 1, 0, 0.6], stinger: [0, 7, 5, 10, 12] },
    victory: { intervals: [0, 5, 7, 9, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.5] }
  }));
}
