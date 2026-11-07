// Chainsaw Man — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('animeHeroic', {
    id: 'mus-chainsaw-man',
    confidence: 'A',
    tempo: [122, 162],
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 5, 1, 4],
    instrumentation: ['chamber-orchestra-synth', 'abrasive-guitar-oscillator', 'impact-toms', 'intimate-piano', 'wordless-choir-pad', 'unstable-synth'],
    density: 0.86,
    restChance: 0.12,
    form: [
      { name: 'uneasy-preparation', bars: 8, density: 0.48 },
      { name: 'devil-duel', bars: 8, density: 1.02 },
      { name: 'human-emotion', bars: 4, density: 0.42 },
      { name: 'violent-breakthrough', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.75, 0, 1, 0, 0.8, 0.4], stinger: [0, 6, 7, 3, 12] },
    victory: { intervals: [0, 3, 7, 9, 12], beats: [0.45, 0.45, 0.55, 0.55, 1.4] }
  }));
}
