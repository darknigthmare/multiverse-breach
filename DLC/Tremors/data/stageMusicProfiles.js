// Tremors — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('xenoHorror', {
    id: 'mus-tremors',
    confidence: 'B',
    tempo: [90, 134],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.22, 0.48, 0.84, 0.26, 0.54] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 45,
    chords: [0, 1, 4, 3],
    instrumentation: ['dry-desert-guitar-oscillator', 'hand-tom-noise', 'tremolo-low-string-synth', 'underground-rumble', 'corrugated-metal-hit', 'whistling-wind-noise', 'low-harmonica-like-synth'],
    density: 0.68,
    restChance: 0.24,
    patterns: {
      lead: [1, 0, 0.48, 0.76, 0, 0.42],
      bass: [1, 0, 0, 0.82, 0, 0],
      drums: [1, 3, 0, 2, 3, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'desert-stillness', bars: 6, density: 0.34 },
      { name: 'ground-ripple', bars: 8, density: 0.76 },
      { name: 'rock-island-stand', bars: 4, density: 0.5 },
      { name: 'graboid-breakout', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.45, 1, 0, 0.7], stinger: [0, 1, 5, 8, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.55, 0.45, 0.65, 0.55, 1.45] }
  }));
}
