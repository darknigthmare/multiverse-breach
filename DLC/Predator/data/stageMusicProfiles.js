// Predator — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('xenoHorror', {
    id: 'mus-predator',
    confidence: 'B',
    tempo: [96, 132],
    meter: { beats: 4, unit: 8, subdivisions: 3, accents: [1, 0.25, 0.25, 0.9, 0.25, 0.25, 0.7, 0.25, 0.55, 0.25, 0.65, 0.25] },
    scaleName: 'ritualMinor',
    scale: SCALE_LIBRARY.ritualMinor,
    rootMidi: 50,
    chords: [0, 3, 1, 4],
    instrumentation: ['tuned-toms', 'dry-snare', 'staccato-brass-synth', 'low-flute-sine', 'metal-clicks', 'thermal-synth'],
    density: 0.72,
    restChance: 0.18,
    waves: { lead: 'triangle', bass: 'square', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.5, 0.85, 0, 0.4, 0.7, 0, 0.55, 0, 0.65, 0],
      bass: [1, 0, 0, 0.8, 0, 0, 0.65, 0, 0, 0.7, 0, 0],
      drums: [1, 3, 3, 1, 3, 3, 2, 3, 3, 2, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'tracking', bars: 4, density: 0.5 },
      { name: 'camouflage', bars: 4, density: 0.4 },
      { name: 'ritual-hunt', bars: 6, density: 0.96 },
      { name: 'trophy', bars: 3, density: 0.64 }
    ],
    boss: { pattern: [1, 0, 0.45, 1, 0, 0.5, 0.8, 0, 0.5, 0.7, 0, 0.55], stinger: [0, 6, 7, 1, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.5, 0.75, 0.5, 0.75, 1.5] }
  }));
}
