// House of 1000 Corpses — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('survivalHorror', {
    id: 'mus-house-of-1000-corpses',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [82, 132],
    meter: { beats: 12, unit: 8, subdivisions: 1, accents: [1, 0.14, 0.32, 0.7, 0.12, 0.38, 0.86, 0.16, 0.3, 0.62, 0.12, 0.46] },
    scaleName: 'ritualMinor',
    scale: SCALE_LIBRARY.ritualMinor,
    rootMidi: 40,
    chords: [0, 1, 4, 1],
    instrumentation: ['detuned-carnival-organ', 'rusted-guitar-oscillator', 'film-projector-flutter', 'cellar-chain-noise', 'funhouse-drum-kit', 'calliope-pressure-synth', 'dusty-room-drone'],
    density: 0.62,
    restChance: 0.26,
    waves: { lead: 'square', bass: 'triangle', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.42, 0, 0.66, 0, 0.3, 0, 0.74, 0, 0.38, 0],
      bass: [1, 0, 0, 0, 0.62, 0, 0, 0, 0.8, 0, 0, 0],
      drums: [1, 0, 3, 2, 0, 4, 1, 0, 3, 2, 0, 4],
      pad: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'roadside-attraction', bars: 6, density: 0.38 },
      { name: 'murder-ride', bars: 8, density: 0.76 },
      { name: 'firefly-supper', bars: 4, density: 0.52 },
      { name: 'doctor-satan-descent', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0, 0.5, 0, 0.82, 1, 0, 0.36, 0, 0.72, 0], stinger: [0, 1, 6, 8, 13] },
    victory: { intervals: [0, 1, 5, 8, 12], beats: [0.7, 0.55, 0.8, 0.65, 1.65] }
  }));
}
