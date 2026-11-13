// Resident Evil — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('survivalHorror', {
    id: 'mus-resident-evil',
    confidence: 'A',
    tempo: [72, 116],
    scaleName: 'minor',
    scale: SCALE_LIBRARY.minor,
    rootMidi: 52,
    chords: [0, 1, 5, 2],
    instrumentation: ['sul-ponticello-string-synth', 'prepared-piano', 'synth-bass', 'low-woodwind-synth', 'metal-impact', 'ventilation-noise'],
    density: 0.48,
    restChance: 0.34,
    form: [
      { name: 'contaminated-exploration', bars: 6, density: 0.3 },
      { name: 'biohazard-alert', bars: 6, density: 0.68 },
      { name: 'inventory-breath', bars: 4, density: 0.25 },
      { name: 'ammunition-crisis', bars: 6, density: 0.9 }
    ],
    boss: { pattern: [1, 0, 0, 0, 1, 0, 0.65, 0], stinger: [0, 1, 6, 7, 13] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.75, 0.5, 0.75, 0.75, 1.5] }
  }));
}
