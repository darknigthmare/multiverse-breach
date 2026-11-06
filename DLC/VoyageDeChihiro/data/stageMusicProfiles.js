// Voyage de Chihiro — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('arcaneFantasy', {
    id: 'mus-voyage-de-chihiro',
    confidence: 'B',
    tempo: [72, 118],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.42, 0.78, 0.2, 0.46] },
    scaleName: 'suspended',
    scale: SCALE_LIBRARY.suspended,
    rootMidi: 55,
    chords: [0, 3, 1, 4],
    instrumentation: ['water-drop-marimba', 'soft-piano-synth', 'breath-flute-sine', 'bathhouse-wood-percussion', 'steam-noise', 'small-spirit-bells', 'river-memory-pad'],
    density: 0.58,
    restChance: 0.28,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.48, 0.76, 0, 0.4],
      bass: [1, 0, 0, 0.64, 0, 0],
      drums: [1, 3, 0, 2, 3, 0],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'abandoned-tunnel', bars: 6, density: 0.34 },
      { name: 'bathhouse-work', bars: 8, density: 0.68 },
      { name: 'no-face-swell', bars: 5, density: 0.86 },
      { name: 'water-train-name-return', bars: 8, density: 0.46 }
    ],
    boss: { pattern: [1, 0, 0.42, 0.82, 0, 0.62], stinger: [0, 5, 7, 10, 12] },
    victory: { intervals: [0, 5, 7, 10, 12], beats: [0.6, 0.55, 0.65, 0.6, 1.55] }
  }));
}
