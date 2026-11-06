// Uzumaki — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('psychologicalHorror', {
    id: 'mus-uzumaki',
    confidence: 'B',
    tempo: [58, 108],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.12, 0.34, 0.1, 0.58, 0.12, 0.42, 0.1, 0.72, 0.12] },
    scaleName: 'wholeTone',
    scale: SCALE_LIBRARY.wholeTone,
    rootMidi: 41,
    chords: [0, 1, 2, 1],
    instrumentation: ['spiral-organ-drone', 'bowed-metal-synth', 'distant-sea-noise', 'wood-creak-pulse', 'detuned-bell', 'breath-noise', 'subterranean-rumble'],
    density: 0.48,
    restChance: 0.34,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.3, 0, 0, 0.48, 0, 0.24, 0],
      bass: [1, 0, 0, 0, 0, 0.62, 0, 0, 0, 0],
      drums: [1, 0, 0, 3, 0, 2, 0, 0, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'fogbound-town', bars: 8, density: 0.24 },
      { name: 'pattern-recognition', bars: 8, density: 0.52 },
      { name: 'coiling-street', bars: 6, density: 0.68 },
      { name: 'spiral-city-collapse', bars: 8, density: 0.94 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.46, 0, 0, 0, 0.78, 0], stinger: [0, 2, 6, 8, 12] },
    victory: { intervals: [0, 2, 6, 8, 12], beats: [0.8, 0.7, 0.85, 0.65, 1.7] }
  }));
}
