// Dragon Ball Z — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('animeHeroic', {
    id: 'mus-dragon-ball-z',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [112, 166],
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 4, 5, 3],
    instrumentation: ['martial-brass-synth', 'agile-string-ostinato', 'electric-bass-oscillator', 'battle-toms', 'woodwind-synth', 'ki-energy-pulse'],
    density: 0.86,
    restChance: 0.12,
    form: [
      { name: 'distant-challenge', bars: 4, density: 0.54 },
      { name: 'rising-power', bars: 8, density: 0.9 },
      { name: 'aerial-exchange', bars: 8, density: 1.02 },
      { name: 'heroic-reversal', bars: 8, density: 1.1 }
    ],
    modeProfiles: {
      combat: {
        tempo: [132, 168],
        instrumentation: ['martial-brass-synth', 'low-string-ostinato', 'electric-bass-oscillator', 'arena-toms', 'ki-impact-noise', 'short-woodwind-synth'],
        density: 0.96,
        restChance: 0.08,
        patterns: {
          lead: [1, 0, 0.78, 0.45, 1, 0.35, 0.7, 0.5],
          bass: [1, 0, 0.58, 0, 0.92, 0, 0.62, 0],
          drums: [1, 3, 2, 3, 1, 4, 2, 3],
          pad: [1, 0, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'fighter-standoff', bars: 2, density: 0.72 },
          { name: 'ki-exchange', bars: 6, density: 1 },
          { name: 'counter-rush', bars: 4, density: 1.08 },
          { name: 'decisive-finisher', bars: 4, density: 1.16 }
        ]
      },
      melee: {
        tempo: [142, 178],
        instrumentation: ['bright-brass-synth', 'rapid-string-ostinato', 'slap-bass-oscillator', 'aerial-toms', 'launch-impact-noise', 'energy-dash-pulse'],
        density: 1.02,
        restChance: 0.05,
        patterns: {
          lead: [1, 0.55, 0.82, 0, 1, 0.48, 0.76, 0.42],
          bass: [1, 0, 0.7, 0, 1, 0, 0.66, 0],
          drums: [1, 3, 2, 4, 1, 3, 2, 4],
          pad: [1, 0, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'arena-launch', bars: 2, density: 0.8 },
          { name: 'platform-pursuit', bars: 6, density: 1.04 },
          { name: 'aerial-combo', bars: 4, density: 1.14 },
          { name: 'ring-out-pressure', bars: 4, density: 1.2 }
        ]
      },
      rpg: {
        tempo: [86, 132],
        instrumentation: ['warm-string-pad', 'travel-woodwind-synth', 'soft-brass-synth', 'hand-drum-noise', 'rounded-bass', 'distant-ki-shimmer'],
        density: 0.64,
        restChance: 0.25,
        patterns: {
          lead: [1, 0, 0.52, 0, 0.72, 0.3, 0, 0.46],
          bass: [1, 0, 0, 0, 0.68, 0, 0, 0],
          drums: [1, 0, 3, 0, 2, 0, 3, 0],
          pad: [1, 0, 0, 0, 1, 0, 0, 0]
        },
        form: [
          { name: 'capsule-road', bars: 8, density: 0.42 },
          { name: 'training-ground', bars: 8, density: 0.66 },
          { name: 'enemy-signal', bars: 4, density: 0.8 },
          { name: 'heroic-response', bars: 8, density: 0.94 }
        ]
      },
      tactics: {
        tempo: [96, 138],
        meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.18, 0.48, 0.18, 0.78, 0.18, 0.42, 0.18, 0.62, 0.18] },
        instrumentation: ['muted-brass-synth', 'low-string-pulse', 'scouter-clicks', 'measured-toms', 'sub-bass-oscillator', 'ki-grid-pulse'],
        density: 0.72,
        restChance: 0.18,
        patterns: {
          lead: [1, 0, 0.45, 0, 0.68, 0, 0.52, 0, 0.74, 0],
          bass: [1, 0, 0, 0, 0.72, 0, 0, 0, 0.5, 0],
          drums: [1, 0, 3, 0, 2, 0, 3, 0, 4, 0],
          pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        },
        form: [
          { name: 'scouter-read', bars: 5, density: 0.48 },
          { name: 'formation-step', bars: 5, density: 0.68 },
          { name: 'flanking-flight', bars: 5, density: 0.86 },
          { name: 'decisive-move', bars: 5, density: 1 }
        ]
      }
    },
    encounterProfiles: {
      boss: {
        tempo: [148, 182],
        scaleName: 'phrygian',
        scale: SCALE_LIBRARY.phrygian,
        rootMidi: 41,
        chords: [0, 1, 4, 0],
        instrumentation: ['menacing-brass-synth', 'tremolo-string-oscillator', 'heavy-battle-toms', 'distorted-bass', 'transformation-riser', 'ki-storm-noise'],
        density: 1.1,
        restChance: 0.05,
        form: [
          { name: 'villain-transformation', bars: 4, density: 0.9 },
          { name: 'overwhelming-power', bars: 6, density: 1.12 },
          { name: 'last-reserve', bars: 4, density: 1.2 }
        ],
        boss: { pattern: [1, 0, 0.82, 0, 1, 0.55, 0.78, 0], stinger: [0, 1, 6, 7, 12] }
      },
      worldBoss: {
        tempo: [156, 190],
        scaleName: 'chromaticTension',
        scale: SCALE_LIBRARY.chromaticTension,
        rootMidi: 38,
        chords: [0, 1, 5, 2],
        instrumentation: ['cataclysmic-brass-synth', 'mass-string-ostinato', 'planetary-toms', 'subharmonic-bass', 'nonlexical-hero-choir', 'energy-storm-noise', 'final-counterpulse'],
        density: 1.18,
        restChance: 0.02,
        form: [
          { name: 'planetary-cataclysm', bars: 4, density: 1.02 },
          { name: 'survivor-silence', bars: 2, density: 0.5 },
          { name: 'united-counterattack', bars: 8, density: 1.24 }
        ],
        boss: { wave: 'square', pattern: [1, 0.72, 0, 1, 0.58, 0, 1, 0.84], stinger: [0, 6, 1, 13, 12] }
      }
    },
    boss: { pattern: [1, 0, 0.72, 0, 1, 0, 0.76, 0], stinger: [0, 7, 9, 3, 12] },
    victory: { intervals: [0, 4, 7, 9, 12, 16], beats: [0.4, 0.42, 0.48, 0.45, 0.68, 1.35] }
  }));
}
