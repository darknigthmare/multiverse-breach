// From — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('psychologicalHorror', {
    id: 'mus-from',
    confidence: 'B',
    tempo: [66, 116],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.16, 0.38, 0.76, 0.18, 0.44] },
    scaleName: 'ritualMinor',
    scale: SCALE_LIBRARY.ritualMinor,
    rootMidi: 43,
    chords: [0, 1, 4, 1],
    instrumentation: ['detuned-porch-pluck', 'bowed-fiddle-like-synth', 'talisman-wood-click', 'forest-night-noise', 'colony-house-bell', 'low-cello-synth', 'jukebox-static', 'smiling-whisper-noise'],
    density: 0.52,
    restChance: 0.34,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.42, 0.68, 0, 0.36],
      bass: [1, 0, 0, 0.62, 0, 0],
      drums: [1, 0, 3, 2, 0, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'road-loop', bars: 8, density: 0.3 },
      { name: 'daylight-repair', bars: 6, density: 0.46 },
      { name: 'colony-house-dusk', bars: 4, density: 0.68 },
      { name: 'night-creatures', bars: 8, density: 0.94 }
    ],
    boss: { pattern: [1, 0, 0.42, 0.82, 0, 0.64], stinger: [0, 1, 6, 10, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.7, 0.6, 0.75, 0.65, 1.7] }
  }));
}
