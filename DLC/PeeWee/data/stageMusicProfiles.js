// Pee-wee — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('comedyOddity', {
    id: 'mus-pee-wee',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [108, 152],
    meter: { beats: 5, unit: 8, subdivisions: 2, accents: [1, 0.16, 0.5, 0.2, 0.86, 0.18, 0.38, 0.16, 0.7, 0.2] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 55,
    chords: [0, 4, 1, 5],
    instrumentation: ['bicycle-bell-pulse', 'playhouse-organ-synth', 'chair-spring-twang', 'toy-xylophone', 'clockwork-footstep-click', 'rubber-horn-noise', 'bright-workshop-pad'],
    density: 0.84,
    restChance: 0.12,
    waves: { lead: 'square', bass: 'triangle', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0.62, 0, 0.44, 0.86, 0, 0.52, 0.32, 0.72, 0],
      bass: [1, 0, 0.46, 0, 0.74, 0, 0.4, 0, 0.66, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3, 1, 3],
      pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    form: [
      { name: 'playhouse-morning', bars: 5, density: 0.58 },
      { name: 'bicycle-workshop', bars: 8, density: 0.88 },
      { name: 'roadside-detour', bars: 5, density: 0.7 },
      { name: 'stolen-bike-dream-chase', bars: 8, density: 1.04 }
    ],
    boss: { pattern: [1, 0, 0.58, 0.8, 0, 1, 0, 0.46, 0.72, 0], stinger: [0, 4, 6, 11, 12] },
    victory: { intervals: [0, 4, 6, 9, 12, 16], beats: [0.28, 0.34, 0.42, 0.38, 0.56, 1.15] }
  }));
}
