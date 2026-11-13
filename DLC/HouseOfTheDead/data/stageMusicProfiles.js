// House of the Dead — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('survivalHorror', {
    id: 'mus-house-of-the-dead',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [82, 142],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.1, 0.3, 0.12, 0.72, 0.1, 0.42, 0.14, 0.9, 0.1, 0.34, 0.12, 0.68, 0.1, 0.46, 0.14] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 40,
    chords: [0, 1, 5, 4],
    instrumentation: ['curien-mansion-organ-synth', 'ams-pistol-mechanism-click', 'specimen-tank-bubble-noise', 'gothic-string-pulse', 'laboratory-metal-impact', 'tarot-boss-stinger', 'underground-drone'],
    density: 0.7,
    restChance: 0.22,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.48, 0, 0.76, 0, 0.34, 0, 0.92, 0, 0.56, 0, 0.7, 0, 0.4, 0],
      bass: [1, 0, 0, 0, 0.64, 0, 0, 0, 0.86, 0, 0, 0, 0.58, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0, 1, 3, 2, 0, 1, 4, 3, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'curien-mansion-arrival', bars: 4, density: 0.34 },
      { name: 'researcher-rescue-route', bars: 8, density: 0.68 },
      { name: 'dbr-underground-laboratory', bars: 6, density: 0.88 },
      { name: 'magician-type-zero', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.46, 0, 0.78, 0, 1, 0.52, 1, 0, 0.62, 0, 0.84, 0, 0.7, 0], stinger: [0, 1, 8, 11, 13] },
    victory: { intervals: [0, 3, 7, 11, 12], beats: [0.62, 0.5, 0.68, 0.56, 1.5] }
  }));
}
