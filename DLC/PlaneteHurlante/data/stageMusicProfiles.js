// Planete Hurlante — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('xenoHorror', {
    id: 'mus-planete-hurlante',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [78, 128],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.12, 0.36, 0.7, 0.14, 0.48, 0.82] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 38,
    chords: [0, 1, 5, 2],
    instrumentation: ['sirius-six-radio-static', 'burrowing-metal-scrape', 'geiger-click-pulse', 'trench-drum-noise', 'cold-alloy-pad', 'teddy-mechanism-tick', 'radioactive-wind-drone'],
    density: 0.58,
    restChance: 0.32,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.34, 0, 0.62, 0, 0.46],
      bass: [1, 0, 0, 0.68, 0, 0, 0.42],
      drums: [1, 0, 3, 0, 2, 0, 4],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'new-alamo-watch', bars: 7, density: 0.3 },
      { name: 'sirius-six-trench', bars: 8, density: 0.68 },
      { name: 'teddy-decoy', bars: 5, density: 0.44 },
      { name: 'type-three-reveal', bars: 8, density: 0.98 }
    ],
    boss: { pattern: [1, 0, 0.46, 0, 0.74, 1, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.78, 0.62, 0.82, 0.68, 1.75] }
  }));
}
