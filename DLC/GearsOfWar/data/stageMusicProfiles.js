// Gears of War — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-gears-of-war',
    confidence: 'A',
    tempo: [96, 138],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.28, 0.48, 0.9, 0.3, 0.55] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 50,
    chords: [0, 4, 3, 5],
    instrumentation: ['low-brass-synth', 'string-ostinato', 'military-snare', 'heavy-toms', 'sub-synth', 'radio-noise', 'wordless-choir-pad'],
    density: 0.8,
    patterns: {
      lead: [1, 0, 0.65, 0.9, 0, 0.55],
      bass: [1, 0, 0, 0.85, 0, 0.45],
      drums: [1, 3, 2, 1, 3, 2],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'front-briefing', bars: 8, density: 0.48 },
      { name: 'squad-advance', bars: 8, density: 0.92 },
      { name: 'sacrifice', bars: 4, density: 0.5 },
      { name: 'counterattack', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.55, 1, 0, 0.7], stinger: [0, 7, 5, 10, 12] },
    victory: { intervals: [0, 5, 7, 10, 12], beats: [0.5, 0.5, 0.5, 0.75, 1.5] }
  }));
}
