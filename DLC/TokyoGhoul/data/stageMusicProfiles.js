// Tokyo Ghoul — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('animeHeroic', {
    id: 'mus-tokyo-ghoul',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [86, 154],
    scaleName: 'minor',
    scale: SCALE_LIBRARY.minor,
    rootMidi: 45,
    chords: [0, 5, 1, 3],
    instrumentation: ['fragile-piano', 'chamber-string-synth', 'distorted-guitar-oscillator', 'electronic-pulse', 'sub-bass', 'kagune-swish-noise'],
    density: 0.76,
    restChance: 0.2,
    form: [
      { name: 'anteiku-calm', bars: 6, density: 0.36 },
      { name: 'predator-in-the-crowd', bars: 6, density: 0.68 },
      { name: 'divided-self', bars: 4, density: 0.48 },
      { name: 'kagune-awakening', bars: 8, density: 1.04 }
    ],
    modeProfiles: {
      combat: {
        tempo: [128, 160],
        meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.14, 0.35, 0.16, 0.7, 0.14, 0.42, 0.16, 0.9, 0.14, 0.32, 0.16, 0.68, 0.14, 0.48, 0.16] },
        instrumentation: ['distorted-guitar-oscillator', 'urgent-string-ostinato', 'breakbeat-noise', 'dark-piano-stabs', 'sub-bass', 'kagune-impact-noise'],
        density: 0.94,
        restChance: 0.08,
        patterns: {
          lead: [1, 0, 0.62, 0.28, 0.84, 0, 0.48, 0.3, 1, 0, 0.7, 0.34, 0.9, 0, 0.56, 0.24],
          bass: [1, 0, 0, 0, 0.72, 0, 0, 0, 1, 0, 0.46, 0, 0.8, 0, 0, 0],
          drums: [1, 3, 3, 4, 2, 3, 3, 4, 1, 3, 4, 3, 2, 3, 3, 4],
          pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'mask-reveal', bars: 2, density: 0.7 },
          { name: 'close-quarters-hunt', bars: 6, density: 1 },
          { name: 'quinque-kagune-clash', bars: 4, density: 1.1 },
          { name: 'survival-release', bars: 4, density: 1.16 }
        ]
      },
      melee: {
        tempo: [140, 174],
        meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.12, 0.4, 0.14, 0.68, 0.12, 0.5, 0.16, 0.92, 0.12, 0.34, 0.16, 0.72, 0.14, 0.55, 0.18] },
        instrumentation: ['angular-guitar-oscillator', 'staccato-string-synth', 'broken-beat-noise', 'elastic-bass', 'metal-platform-hit', 'kagune-dash-swish'],
        density: 1.02,
        restChance: 0.05,
        patterns: {
          lead: [1, 0.4, 0, 0.72, 0.9, 0.28, 0.58, 0, 1, 0.32, 0, 0.68, 0.86, 0.24, 0.52, 0],
          bass: [1, 0, 0.58, 0, 0.82, 0, 0.48, 0, 1, 0, 0.62, 0, 0.86, 0, 0.5, 0],
          drums: [1, 3, 4, 3, 2, 3, 4, 3, 1, 4, 3, 4, 2, 3, 4, 3],
          pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'rooftop-entry', bars: 2, density: 0.76 },
          { name: 'vertical-pursuit', bars: 6, density: 1.04 },
          { name: 'predator-counter', bars: 4, density: 1.14 },
          { name: 'last-platform', bars: 4, density: 1.2 }
        ]
      },
      rpg: {
        tempo: [64, 104],
        instrumentation: ['fragile-piano', 'solo-cello-synth', 'breath-pad', 'distant-city-noise', 'soft-electronic-pulse', 'low-heartbeat-sub'],
        density: 0.5,
        restChance: 0.36,
        patterns: {
          lead: [1, 0, 0, 0.42, 0, 0.58, 0, 0.3],
          bass: [1, 0, 0, 0, 0.5, 0, 0, 0],
          drums: [0, 0, 3, 0, 0, 0, 4, 0],
          pad: [1, 0, 0, 0, 1, 0, 0, 0]
        },
        form: [
          { name: 'quiet-cafe', bars: 8, density: 0.24 },
          { name: 'human-memory', bars: 8, density: 0.42 },
          { name: 'hunger-under-glass', bars: 6, density: 0.58 },
          { name: 'choice-between-worlds', bars: 8, density: 0.7 }
        ]
      },
      tactics: {
        tempo: [88, 126],
        meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.14, 0.44, 0.14, 0.76, 0.14, 0.38, 0.14, 0.62, 0.16] },
        instrumentation: ['clinical-string-pulse', 'muted-piano', 'ccg-radio-clicks', 'low-electronic-bass', 'measured-snare-noise', 'quinque-charge-pulse'],
        density: 0.68,
        restChance: 0.2,
        patterns: {
          lead: [1, 0, 0.38, 0, 0.62, 0, 0.46, 0, 0.7, 0],
          bass: [1, 0, 0, 0, 0.64, 0, 0, 0, 0.48, 0],
          drums: [1, 0, 3, 0, 2, 0, 3, 0, 4, 0],
          pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        },
        form: [
          { name: 'ward-surveillance', bars: 5, density: 0.44 },
          { name: 'ccg-formation', bars: 5, density: 0.66 },
          { name: 'ghoul-ambush', bars: 5, density: 0.86 },
          { name: 'containment-collapse', bars: 5, density: 1 }
        ]
      }
    },
    encounterProfiles: {
      boss: {
        tempo: [132, 170],
        meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.12, 0.48, 0.12, 0.82, 0.12, 0.4, 0.12, 0.72, 0.14] },
        scaleName: 'chromaticTension',
        scale: SCALE_LIBRARY.chromaticTension,
        rootMidi: 41,
        chords: [0, 1, 5, 2],
        instrumentation: ['dissonant-string-cluster', 'distorted-guitar-oscillator', 'heavy-breakbeat-noise', 'subharmonic-bass', 'kakuja-riser', 'metallic-scream-synth'],
        density: 1.08,
        restChance: 0.05,
        form: [
          { name: 'mask-of-the-predator', bars: 5, density: 0.9 },
          { name: 'kakuja-pressure', bars: 5, density: 1.12 },
          { name: 'fractured-will', bars: 5, density: 1.2 }
        ],
        boss: { wave: 'square', pattern: [1, 0, 0.72, 0, 1, 0, 0.8, 0, 0.58, 0], stinger: [0, 1, 6, 10, 13] }
      },
      worldBoss: {
        tempo: [146, 184],
        meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.52, 0.88, 0.2, 0.62] },
        scaleName: 'ritualMinor',
        scale: SCALE_LIBRARY.ritualMinor,
        rootMidi: 38,
        chords: [0, 1, 4, 2],
        instrumentation: ['mass-string-cluster', 'industrial-guitar-oscillator', 'cathedral-drum-noise', 'abyssal-sub-bass', 'nonlexical-tragedy-choir', 'city-collapse-noise', 'kagune-swarm-pulse'],
        density: 1.16,
        restChance: 0.02,
        patterns: {
          lead: [1, 0, 0.72, 1, 0, 0.82],
          bass: [1, 0, 0, 0.9, 0, 0],
          drums: [1, 3, 4, 2, 3, 4],
          pad: [1, 0, 0, 1, 0, 0]
        },
        form: [
          { name: 'ward-wide-calamity', bars: 6, density: 1.02 },
          { name: 'human-ghoul-lament', bars: 3, density: 0.56 },
          { name: 'one-eyed-catastrophe', bars: 8, density: 1.24 }
        ],
        boss: { wave: 'square', pattern: [1, 0, 0.82, 1, 0, 0.9], stinger: [0, 6, 1, 13, 7] }
      }
    },
    boss: { pattern: [1, 0, 0.62, 0, 1, 0, 0.7, 0], stinger: [0, 6, 1, 10, 13] },
    victory: { intervals: [0, 3, 7, 8, 12], beats: [0.62, 0.48, 0.68, 0.56, 1.55] }
  }));
}
