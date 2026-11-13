// Fullmetal Alchemist — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('animeHeroic', {
    id: 'mus-fullmetal-alchemist',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [122, 158],
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 5, 3, 4],
    instrumentation: ['chamber-orchestra-synth', 'piano', 'military-snare-noise', 'warm-horn-synth', 'wordless-choir-pad', 'transmutation-pulse'],
    density: 0.78,
    form: [
      { name: 'research', bars: 8, density: 0.48 },
      { name: 'equivalent-exchange', bars: 8, density: 0.84 },
      { name: 'loss', bars: 4, density: 0.4 },
      { name: 'resolve', bars: 8, density: 1.02 }
    ],
    modeProfiles: {
      combat: {
        tempo: [128, 162],
        instrumentation: ['heroic-brass-synth', 'rapid-string-ostinato', 'military-snare-noise', 'piano-stabs', 'transmutation-impact', 'grounded-sub-bass'],
        density: 0.94,
        restChance: 0.08,
        patterns: {
          lead: [1, 0, 0.7, 0.4, 1, 0.32, 0.64, 0],
          bass: [1, 0, 0.55, 0, 0.9, 0, 0.48, 0],
          drums: [1, 3, 2, 3, 1, 4, 2, 3],
          pad: [1, 0, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'circle-drawn', bars: 2, density: 0.7 },
          { name: 'close-alchemy', bars: 6, density: 0.98 },
          { name: 'automail-counter', bars: 4, density: 1.08 },
          { name: 'equivalent-finisher', bars: 4, density: 1.16 }
        ]
      },
      melee: {
        tempo: [138, 172],
        meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.24, 0.52, 0.86, 0.28, 0.58] },
        instrumentation: ['agile-string-synth', 'short-brass-synth', 'rolling-toms', 'clockwork-bass', 'stone-spike-impact', 'automail-metal-hit'],
        density: 1,
        restChance: 0.05,
        patterns: {
          lead: [1, 0.48, 0, 0.88, 0.36, 0.68],
          bass: [1, 0, 0.58, 0.84, 0, 0.5],
          drums: [1, 3, 4, 2, 3, 4],
          pad: [1, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'central-platform', bars: 3, density: 0.76 },
          { name: 'transmuted-route', bars: 6, density: 1.02 },
          { name: 'automail-rush', bars: 4, density: 1.12 },
          { name: 'arena-reconstruction', bars: 4, density: 1.18 }
        ]
      },
      rpg: {
        tempo: [78, 116],
        meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.2, 0.48, 0.82, 0.22, 0.52] },
        instrumentation: ['warm-chamber-strings', 'travel-woodwind-synth', 'intimate-piano', 'soft-frame-drum', 'horn-horizon-pad', 'clockwork-tick'],
        density: 0.58,
        restChance: 0.3,
        patterns: {
          lead: [1, 0, 0.52, 0.76, 0, 0.42],
          bass: [1, 0, 0, 0.62, 0, 0],
          drums: [1, 0, 3, 2, 0, 3],
          pad: [1, 0, 0, 1, 0, 0]
        },
        form: [
          { name: 'amestris-road', bars: 8, density: 0.36 },
          { name: 'brothers-research', bars: 8, density: 0.56 },
          { name: 'memory-of-loss', bars: 4, density: 0.3 },
          { name: 'promise-forward', bars: 8, density: 0.78 }
        ]
      },
      tactics: {
        tempo: [92, 130],
        instrumentation: ['low-string-ostinato', 'military-snare-noise', 'muted-brass-synth', 'map-table-piano', 'clockwork-clicks', 'transmutation-grid-pulse'],
        density: 0.7,
        restChance: 0.18,
        patterns: {
          lead: [1, 0, 0.44, 0, 0.68, 0, 0.52, 0],
          bass: [1, 0, 0, 0, 0.7, 0, 0, 0],
          drums: [1, 3, 0, 3, 2, 3, 0, 4],
          pad: [1, 0, 0, 0, 1, 0, 0, 0]
        },
        form: [
          { name: 'central-command', bars: 4, density: 0.46 },
          { name: 'flame-alchemist-order', bars: 8, density: 0.7 },
          { name: 'homunculus-feint', bars: 4, density: 0.84 },
          { name: 'promised-day-maneuver', bars: 8, density: 1 }
        ]
      }
    },
    encounterProfiles: {
      boss: {
        tempo: [132, 168],
        meter: { beats: 3, unit: 4, subdivisions: 2, accents: [1, 0.18, 0.52, 0.84, 0.2, 0.62] },
        scaleName: 'harmonicMinor',
        scale: SCALE_LIBRARY.harmonicMinor,
        rootMidi: 43,
        chords: [0, 5, 1, 4],
        instrumentation: ['dark-orchestral-brass-synth', 'tremolo-string-cluster', 'ritual-snare-noise', 'low-piano', 'homunculus-pulse', 'nonlexical-choir-pad'],
        density: 1.06,
        restChance: 0.06,
        patterns: {
          lead: [1, 0, 0.62, 1, 0, 0.72],
          bass: [1, 0, 0, 0.88, 0, 0],
          drums: [1, 3, 4, 2, 3, 4],
          pad: [1, 0, 0, 1, 0, 0]
        },
        form: [
          { name: 'homunculus-reveal', bars: 3, density: 0.86 },
          { name: 'philosophers-stone', bars: 6, density: 1.08 },
          { name: 'human-resolve', bars: 4, density: 1.18 }
        ],
        boss: { pattern: [1, 0, 0.72, 1, 0, 0.8], stinger: [0, 6, 8, 11, 12] }
      },
      worldBoss: {
        tempo: [142, 176],
        meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.58, 0.92, 0.22, 0.68] },
        scaleName: 'ritualMinor',
        scale: SCALE_LIBRARY.ritualMinor,
        rootMidi: 38,
        chords: [0, 1, 4, 0],
        instrumentation: ['mass-orchestral-brass-synth', 'war-string-ostinato', 'cathedral-percussion-noise', 'pipe-organ-pad', 'nonlexical-mass-choir', 'earth-transmutation-rumble', 'human-counterpulse'],
        density: 1.16,
        restChance: 0.02,
        patterns: {
          lead: [1, 0, 0.78, 1, 0.48, 0.86],
          bass: [1, 0, 0, 1, 0, 0.62],
          drums: [1, 3, 4, 2, 3, 4],
          pad: [1, 0, 0, 1, 0, 0]
        },
        form: [
          { name: 'nationwide-circle', bars: 6, density: 1 },
          { name: 'gate-of-truth', bars: 3, density: 0.58 },
          { name: 'promised-day-counterattack', bars: 8, density: 1.24 }
        ],
        boss: { wave: 'square', pattern: [1, 0.62, 0.82, 1, 0.55, 0.9], stinger: [0, 1, 8, 13, 12] }
      }
    },
    boss: { pattern: [1, 0, 0.6, 0, 1, 0, 0.7, 0], stinger: [0, 6, 9, 3, 12] },
    victory: { intervals: [0, 4, 7, 9, 12], beats: [0.5, 0.5, 0.6, 0.55, 1.5] }
  }));
}
