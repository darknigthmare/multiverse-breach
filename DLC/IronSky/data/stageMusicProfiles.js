// Iron Sky — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-iron-sky',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [104, 148],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.18, 0.58, 0.2, 0.9, 0.18, 0.52, 0.22] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 43,
    chords: [0, 5, 3, 4],
    instrumentation: ['retro-lunar-brass-synth', 'vacuum-tube-bass', 'marching-snare-noise', 'moonbase-radar-pulse', 'saucer-engine-hum', 'orbital-metal-impact', 'satirical-cabinet-organ'],
    density: 0.8,
    restChance: 0.14,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'triangle', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.6, 0.34, 0.9, 0, 0.5, 0.28],
      bass: [1, 0, 0.4, 0, 0.86, 0, 0.46, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'dark-side-hangar', bars: 6, density: 0.5 },
      { name: 'helium-three-raid', bars: 8, density: 0.88 },
      { name: 'saucer-orbit', bars: 4, density: 0.62 },
      { name: 'gotterdammerung-barrage', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.72, 0, 1, 0.42, 0.84, 0], stinger: [0, 5, 7, 11, 12] },
    victory: { intervals: [0, 5, 7, 9, 12, 16], beats: [0.4, 0.42, 0.52, 0.48, 0.72, 1.35] }
  }));
}
