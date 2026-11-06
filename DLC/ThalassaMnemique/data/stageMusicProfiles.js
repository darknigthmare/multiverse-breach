// Thalassa Mnémique — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('nexusArchive', {
    id: 'mus-thalassa-mnemique',
    confidence: 'A-OC',
    sourcePolicy: 'original-procedural-only',
    tempo: [70, 108],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.38, 0.14, 0.7, 0.18, 0.34, 0.14, 0.58, 0.2] },
    scaleName: 'suspended',
    scale: SCALE_LIBRARY.suspended,
    rootMidi: 45,
    chords: [0, 3, 1, 4],
    instrumentation: ['submerged-glass-bell', 'pressure-hull-bass', 'mnemonic-sonar', 'waterphone-synth', 'breath-choir-pad', 'brass-lock-percussion'],
    density: 0.5,
    restChance: 0.3,
    padEveryBars: 2,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 1850, bass: 330, pad: 920, boss: 590, noise: 2700 },
    gains: { lead: 0.035, bass: 0.045, pad: 0.021, drums: 0.029, boss: 0.027 },
    patterns: {
      lead: [1, 0, 0, 0.42, 0, 0.72, 0, 0, 0.36, 0],
      bass: [1, 0, 0, 0, 0.62, 0, 0, 0, 0, 0],
      drums: [1, 0, 3, 0, 0, 2, 0, 4, 0, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'drowned-testimony', bars: 5, density: 0.28 },
      { name: 'archive-current', bars: 8, density: 0.58 },
      { name: 'names-return', bars: 5, density: 0.72 },
      { name: 'leviathan-rise', bars: 6, density: 0.94 }
    ],
    boss: { wave: 'sawtooth', gain: 0.028, octave: -1, pattern: [1, 0, 0, 0, 0.65, 0, 1, 0, 0, 0], stinger: [0, 5, 3, 10, 12] },
    victory: { wave: 'sine', intervals: [0, 2, 7, 10, 12], beats: [0.75, 0.5, 0.75, 0.75, 1.75] }
  }));
}
