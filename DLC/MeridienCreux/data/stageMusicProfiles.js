// Méridien Creux — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('cyberNetwork', {
    id: 'mus-meridien-creux',
    confidence: 'A-OC',
    sourcePolicy: 'original-procedural-only',
    tempo: [112, 148],
    meter: { beats: 7, unit: 8, subdivisions: 2, accents: [1, 0.18, 0.4, 0.16, 0.72, 0.16, 0.34, 0.18, 0.88, 0.16, 0.36, 0.18, 0.62, 0.2] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 49,
    chords: [0, 4, 1, 5],
    instrumentation: ['escapement-click-lead', 'ledger-pulse-bass', 'contraband-second-arpeggio', 'surgical-clock-pad', 'coin-edge-hi-hat', 'foundry-chime'],
    density: 0.82,
    restChance: 0.12,
    padEveryBars: 2,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'triangle', boss: 'square' },
    filters: { lead: 3000, bass: 610, pad: 1540, boss: 840, noise: 4400 },
    gains: { lead: 0.036, bass: 0.047, pad: 0.018, drums: 0.039, boss: 0.029 },
    patterns: {
      lead: [1, 0, 0.55, 0, 0.82, 0.3, 0, 1, 0, 0.46, 0, 0.74, 0, 0.34],
      bass: [1, 0, 0, 0, 0.68, 0, 0, 1, 0, 0, 0, 0.58, 0, 0],
      drums: [1, 3, 3, 3, 2, 3, 4, 1, 3, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'taxed-minute', bars: 4, density: 0.55 },
      { name: 'dial-pursuit', bars: 7, density: 0.92 },
      { name: 'stolen-tomorrow', bars: 4, density: 0.68 },
      { name: 'chronobank-revolt', bars: 7, density: 1.08 }
    ],
    boss: { wave: 'square', gain: 0.03, octave: -1, pattern: [1, 0, 0, 0.72, 0, 0, 1, 0, 0, 0.58, 0, 0, 0.82, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { wave: 'triangle', intervals: [0, 3, 7, 10, 15], beats: [0.4, 0.4, 0.55, 0.65, 1.4] }
  }));
}
