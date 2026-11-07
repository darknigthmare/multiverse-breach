// Streets of Rage — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('retroArcade', {
    id: 'mus-streets-of-rage',
    confidence: 'B',
    tempo: [118, 156],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 45,
    chords: [0, 3, 5, 4],
    instrumentation: ['fm-style-bass-synth', 'pulse-lead', 'pcm-style-drum-noise', 'digital-marimba', 'short-house-chord', 'urban-noise-pulse'],
    density: 0.9,
    restChance: 0.1,
    patterns: {
      lead: [1, 0, 0.72, 0.4, 1, 0.35, 0.68, 0],
      bass: [1, 0.55, 0, 0.7, 1, 0.45, 0, 0.72],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'wood-oak-intro', bars: 4, density: 0.64 },
      { name: 'street-brawl-a', bars: 8, density: 0.98 },
      { name: 'syndicate-break', bars: 4, density: 0.62 },
      { name: 'street-brawl-b', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.72, 0, 1, 0.45, 0.8, 0], stinger: [0, 3, 7, 10, 12] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.35, 0.4, 0.5, 0.45, 0.65, 1.3] }
  }));
}
