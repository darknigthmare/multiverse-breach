// War of the Worlds — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-war-of-the-worlds',
    confidence: 'B',
    tempo: [72, 126],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.42, 0.14, 0.74, 0.16, 0.34, 0.14, 0.62, 0.16] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 43,
    chords: [0, 1, 5, 2],
    instrumentation: ['low-brass-pressure-synth', 'bowed-metal-drone', 'distant-impact-toms', 'storm-noise', 'tremolo-string-synth', 'ash-wind-noise', 'subsonic-machine-resonance'],
    density: 0.58,
    restChance: 0.3,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.38, 0, 0, 0.64, 0, 0.3, 0],
      bass: [1, 0, 0, 0, 0, 0.72, 0, 0, 0, 0],
      drums: [1, 0, 3, 0, 0, 2, 0, 4, 0, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'buried-rumble', bars: 6, density: 0.3 },
      { name: 'street-flight', bars: 8, density: 0.82 },
      { name: 'basement-silence', bars: 4, density: 0.24 },
      { name: 'tripod-onslaught', bars: 8, density: 1.04 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.62, 0, 1, 0, 0, 0.5], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.6, 0.75, 0.55, 1.6] }
  }));
}
