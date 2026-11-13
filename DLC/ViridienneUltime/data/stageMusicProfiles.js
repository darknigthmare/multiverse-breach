// Viridienne Ultime — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('arcaneFantasy', {
    id: 'mus-viridienne-ultime',
    confidence: 'A-OC',
    sourcePolicy: 'original-procedural-only',
    tempo: [92, 132],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.28, 0.5, 0.84, 0.3, 0.56] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 53,
    chords: [0, 1, 4, 5],
    instrumentation: ['root-harp-pluck', 'seed-glass-marimba', 'leaf-breath-pad', 'orbit-frame-drum', 'comet-bell', 'photosynthetic-bass'],
    density: 0.66,
    restChance: 0.2,
    padEveryBars: 2,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 2550, bass: 450, pad: 1760, boss: 730, noise: 2300 },
    gains: { lead: 0.041, bass: 0.039, pad: 0.023, drums: 0.032, boss: 0.027 },
    patterns: {
      lead: [1, 0, 0.58, 0.86, 0, 0.48],
      bass: [1, 0, 0, 0.7, 0, 0],
      drums: [1, 3, 4, 2, 3, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'star-seed-germination', bars: 6, density: 0.38 },
      { name: 'branching-orbits', bars: 8, density: 0.7 },
      { name: 'federated-roots', bars: 6, density: 0.82 },
      { name: 'many-suns-bloom', bars: 8, density: 1 }
    ],
    boss: { wave: 'sawtooth', gain: 0.027, octave: -1, pattern: [1, 0, 0.64, 0, 1, 0.52], stinger: [0, 6, 11, 7, 14] },
    victory: { wave: 'triangle', intervals: [0, 4, 7, 11, 14], beats: [0.6, 0.5, 0.75, 0.55, 1.6] }
  }));
}
