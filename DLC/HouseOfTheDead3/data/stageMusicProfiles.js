// House of the Dead 3 — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('survivalHorror', {
    id: 'mus-house-of-the-dead-3',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [88, 146],
    meter: { beats: 6, unit: 8, subdivisions: 2, accents: [1, 0.12, 0.38, 0.14, 0.72, 0.16, 0.44, 0.12, 0.88, 0.14, 0.5, 0.16] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 38,
    chords: [0, 1, 5, 2],
    instrumentation: ['shotgun-pump-click', 'efi-ventilation-noise', 'abandoned-facility-chain-hit', 'bioreactor-electric-pulse', 'ruined-concrete-impact', 'fate-wheel-metal-drone', 'partner-rescue-alarm'],
    density: 0.76,
    restChance: 0.2,
    waves: { lead: 'triangle', bass: 'square', pad: 'sawtooth', boss: 'sine' },
    patterns: {
      lead: [1, 0, 0.42, 0, 0.7, 0, 0.34, 0, 0.82, 0, 0.54, 0],
      bass: [1, 0, 0, 0, 0.68, 0, 1, 0, 0, 0, 0.58, 0],
      drums: [1, 0, 3, 0, 2, 4, 1, 0, 3, 0, 2, 4],
      pad: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'efi-facility-entry', bars: 6, density: 0.4 },
      { name: 'partner-rescue', bars: 6, density: 0.82 },
      { name: 'bioreactor-descent', bars: 8, density: 0.96 },
      { name: 'wheel-of-fate-overload', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.5, 0, 0.82, 1, 0, 0.62, 1, 0, 0.7, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.72, 0.58, 0.78, 0.64, 1.6] }
  }));
}
