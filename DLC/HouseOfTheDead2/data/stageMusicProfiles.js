// House of the Dead 2 — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('survivalHorror', {
    id: 'mus-house-of-the-dead-2',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [104, 158],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.22, 0.62, 0.3, 0.86, 0.24, 0.5] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 45,
    chords: [0, 4, 1, 5],
    instrumentation: ['venetian-bell-synth', 'canal-water-noise', 'ams-reload-click', 'arcade-breakbeat-noise', 'goldman-glass-pad', 'tarot-creature-stinger', 'emperor-core-pulse'],
    density: 0.86,
    restChance: 0.12,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'sine', boss: 'triangle' },
    patterns: {
      lead: [1, 0.58, 0, 0.72, 0.36, 0, 0.66],
      bass: [1, 0, 0.48, 0, 0.82, 0, 0.44],
      drums: [1, 3, 2, 1, 4, 3, 2],
      pad: [1, 0, 0, 0, 1, 0, 0]
    },
    form: [
      { name: 'venice-civilian-rescue', bars: 7, density: 0.56 },
      { name: 'canal-creature-pursuit', bars: 8, density: 0.9 },
      { name: 'goldman-tower-ascent', bars: 7, density: 1 },
      { name: 'emperor-type-alpha', bars: 8, density: 1.14 }
    ],
    boss: { pattern: [1, 0, 0.58, 1, 0, 0.78, 0.46], stinger: [0, 4, 6, 9, 13] },
    victory: { intervals: [0, 4, 7, 11, 12, 16], beats: [0.3, 0.36, 0.46, 0.42, 0.64, 1.2] }
  }));
}
