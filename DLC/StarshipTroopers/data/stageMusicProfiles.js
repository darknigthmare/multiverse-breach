// Starship Troopers — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-starship-troopers',
    confidence: 'B',
    tempo: [106, 150],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.3, 0.52, 0.9, 0.34, 0.58] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 5, 3, 4],
    instrumentation: ['synthetic-parade-brass', 'mobile-infantry-snare', 'drop-ship-engine-pulse', 'rifle-percussion-noise', 'arachnid-chatter', 'propaganda-broadcast-noise', 'bug-tunnel-sub'],
    density: 0.88,
    restChance: 0.1,
    patterns: {
      lead: [1, 0, 0.68, 0.94, 0, 0.58],
      bass: [1, 0, 0.48, 0.86, 0, 0.46],
      drums: [1, 3, 2, 1, 3, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'federal-briefing', bars: 4, density: 0.58 },
      { name: 'klendathu-drop', bars: 8, density: 1.04 },
      { name: 'whiskey-outpost-defense', bars: 8, density: 0.94 },
      { name: 'brain-bug-capture', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.62, 1, 0, 0.78], stinger: [0, 5, 7, 10, 12] },
    victory: { intervals: [0, 5, 7, 9, 12], beats: [0.45, 0.45, 0.55, 0.55, 1.35] }
  }));
}
