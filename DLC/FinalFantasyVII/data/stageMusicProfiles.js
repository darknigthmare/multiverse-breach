// Final Fantasy VII — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('animeHeroic', {
    id: 'mus-final-fantasy-vii',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [86, 142],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.46, 0.18, 0.8, 0.2, 0.4, 0.16, 0.7, 0.22] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 40,
    chords: [0, 5, 1, 4],
    instrumentation: ['mako-reactor-sub-pulse', 'synthetic-string-ensemble', 'industrial-snare-noise', 'metal-catwalk-impact', 'materia-glass-arpeggiator', 'low-brass-synth', 'lifestream-air-pad'],
    density: 0.78,
    restChance: 0.16,
    waves: { lead: 'triangle', bass: 'square', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.48, 0, 0.78, 0.34, 0, 0.58, 0, 0.42],
      bass: [1, 0, 0, 0, 0.82, 0, 0.46, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 1, 0, 4, 0, 2],
      pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    form: [
      { name: 'reactor-one-infiltration', bars: 5, density: 0.44 },
      { name: 'mako-core-descent', bars: 8, density: 0.8 },
      { name: 'shinra-counterattack', bars: 5, density: 0.96 },
      { name: 'jenova-reunion', bars: 8, density: 1.1 }
    ],
    boss: { pattern: [1, 0, 0.52, 0, 0.86, 1, 0, 0.64, 0, 0.44], stinger: [0, 1, 8, 11, 13] },
    victory: { intervals: [0, 3, 7, 11, 12], beats: [0.5, 0.48, 0.62, 0.56, 1.5] }
  }));
}
