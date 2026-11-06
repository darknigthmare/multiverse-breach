// Metal Gear — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('stealthTactical', {
    id: 'mus-metal-gear',
    confidence: 'A',
    tempo: [86, 132],
    meter: { beats: 5, unit: 8, subdivisions: 2, accents: [1, 0.18, 0.45, 0.18, 0.72, 0.18, 0.38, 0.18, 0.62, 0.18] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 49,
    chords: [0, 1, 3, 5],
    instrumentation: ['pizzicato-string-synth', 'stealth-synth', 'muted-snare', 'muted-toms', 'fretless-bass-synth', 'low-piano', 'sonar-pulse'],
    density: 0.56,
    form: [
      { name: 'infiltration', bars: 8, density: 0.34 },
      { name: 'suspicion', bars: 4, density: 0.55 },
      { name: 'alert', bars: 8, density: 0.98 },
      { name: 'withdrawal', bars: 4, density: 0.45 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.55, 0, 1, 0, 0.45, 0], stinger: [0, 1, 7, 6, 13] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.5, 0.5, 0.75, 0.75, 1.5] }
  }));
}
