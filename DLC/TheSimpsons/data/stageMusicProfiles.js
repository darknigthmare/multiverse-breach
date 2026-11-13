// The Simpsons — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('comedyOddity', {
    id: 'mus-the-simpsons',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [104, 148],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.2, 0.52, 0.22, 0.88, 0.18, 0.46, 0.24] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 53,
    chords: [0, 4, 1, 5],
    instrumentation: ['cartoon-brass-synth', 'springfield-organ-pulse', 'sector-7g-key-click', 'nuclear-warning-bell', 'rubber-bass-synth', 'comic-orchestra-hit', 'reactor-hum-pad'],
    density: 0.82,
    restChance: 0.14,
    waves: { lead: 'square', bass: 'triangle', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0.62, 0, 0.44, 0.86, 0, 0.54, 0.3],
      bass: [1, 0, 0.42, 0, 0.74, 0, 0.48, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'springfield-shift', bars: 4, density: 0.54 },
      { name: 'sector-7g-incident', bars: 8, density: 0.86 },
      { name: 'burns-scheme', bars: 4, density: 0.72 },
      { name: 'reactor-meltdown-gag', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.64, 0, 1, 0.42, 0.8, 0], stinger: [0, 4, 6, 11, 12] },
    victory: { intervals: [0, 4, 6, 9, 12, 16], beats: [0.3, 0.34, 0.44, 0.4, 0.62, 1.2] }
  }));
}
