// Futurama — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('electronicStage', {
    id: 'mus-futurama',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [112, 158],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.24, 0.54, 0.84, 0.26, 0.66, 0.38] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 50,
    chords: [0, 4, 2, 5],
    instrumentation: ['retro-future-brass-synth', 'planet-express-engine-bass', 'delivery-tube-percussion', 'robot-joint-clicks', 'new-new-york-traffic-noise', 'holophonor-like-synth', 'hypnosis-pulse'],
    density: 0.88,
    restChance: 0.1,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'sine', boss: 'triangle' },
    patterns: {
      lead: [1, 0.58, 0, 0.76, 0.38, 0, 0.68],
      bass: [1, 0, 0.48, 0, 0.82, 0, 0.5],
      drums: [1, 3, 2, 1, 3, 4, 2],
      pad: [1, 0, 0, 0, 1, 0, 0]
    },
    form: [
      { name: 'planet-express-briefing', bars: 7, density: 0.58 },
      { name: 'new-new-york-delivery', bars: 8, density: 0.9 },
      { name: 'robot-mafia-intercept', bars: 7, density: 1 },
      { name: 'hypnotoad-singularity', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.58, 1, 0, 0.72, 0.48], stinger: [0, 4, 6, 9, 13] },
    victory: { intervals: [0, 4, 6, 11, 12, 16], beats: [0.3, 0.36, 0.46, 0.42, 0.62, 1.2] }
  }));
}
