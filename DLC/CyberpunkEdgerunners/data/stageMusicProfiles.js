// Cyberpunk: Edgerunners — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('cyberNetwork', {
    id: 'mus-cyberpunk-edgerunners',
    confidence: 'A',
    tempo: [108, 142],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 54,
    chords: [0, 5, 3, 1],
    instrumentation: ['fm-lead', 'modular-bass', 'breakbeat-noise', 'glass-pad', 'processed-percussion', 'network-clicks'],
    density: 0.82,
    form: [
      { name: 'night-city-infiltration', bars: 8, density: 0.56 },
      { name: 'traffic', bars: 8, density: 0.92 },
      { name: 'memory', bars: 4, density: 0.4 },
      { name: 'cyberware-assault', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.72, 0, 0, 0, 1, 0, 0.55, 0, 0.82, 0, 0, 0], stinger: [0, 6, 9, 1, 13] },
    victory: { intervals: [0, 3, 7, 10, 12, 15], beats: [0.45, 0.4, 0.5, 0.45, 0.7, 1.4] }
  }));
}
