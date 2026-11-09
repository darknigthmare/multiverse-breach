// Toy Soldiers — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-toy-soldiers',
    confidence: 'B',
    tempo: [94, 130],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.25, 0.5, 0.86, 0.28, 0.52] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 4, 3, 5],
    instrumentation: ['miniature-brass-synth', 'tin-drum-noise', 'toy-piano', 'clockwork-tick', 'small-string-ostinato', 'wooden-table-resonance'],
    density: 0.72,
    patterns: {
      lead: [1, 0, 0.58, 0.82, 0, 0.48],
      bass: [1, 0, 0, 0.78, 0, 0],
      drums: [1, 3, 3, 2, 3, 3],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'tabletop-briefing', bars: 6, density: 0.46 },
      { name: 'trench-advance', bars: 8, density: 0.88 },
      { name: 'wind-up-respite', bars: 4, density: 0.42 },
      { name: 'toybox-counterattack', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.5, 1, 0, 0.68], stinger: [0, 5, 7, 10, 12] },
    victory: { intervals: [0, 5, 7, 9, 12], beats: [0.55, 0.45, 0.55, 0.6, 1.4] }
  }));
}
