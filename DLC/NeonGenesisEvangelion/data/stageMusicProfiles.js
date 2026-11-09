// Neon Genesis Evangelion — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('militarySciFi', {
    id: 'mus-neon-genesis-evangelion',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [82, 144],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.22, 0.5, 0.2, 0.82, 0.22, 0.45, 0.2, 0.68, 0.2] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 48,
    chords: [0, 5, 1, 3],
    instrumentation: ['chamber-orchestra-synth', 'fragile-piano', 'angular-brass-synth', 'organ-pad', 'wordless-choir-cluster', 'hybrid-drums', 'clinical-synth'],
    density: 0.72,
    restChance: 0.2,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.6, 0, 0.8, 0, 0.45, 0, 0.72, 0],
      bass: [1, 0, 0, 0, 0.7, 0, 0, 0, 0.55, 0],
      drums: [1, 0, 3, 0, 2, 0, 3, 0, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'nerv-briefing', bars: 6, density: 0.46 },
      { name: 'synchronization', bars: 6, density: 0.76 },
      { name: 'angel-crisis', bars: 8, density: 1.02 },
      { name: 'human-introspection', bars: 4, density: 0.34 }
    ],
    modeProfiles: {
      combat: {
        tempo: [118, 152],
        instrumentation: ['operational-brass-synth', 'urgent-string-ostinato', 'hybrid-military-drums', 'analog-bass-pulse', 'warning-signal-noise', 'eva-servo-impact'],
        density: 0.94,
        restChance: 0.08,
        patterns: {
          lead: [1, 0, 0.66, 0.34, 1, 0, 0.58, 0.42],
          bass: [1, 0, 0, 0, 0.86, 0, 0.5, 0],
          drums: [1, 3, 2, 3, 1, 4, 2, 3],
          pad: [1, 0, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'nerv-sortie', bars: 4, density: 0.72 },
          { name: 'angel-contact', bars: 6, density: 1 },
          { name: 'at-field-clash', bars: 4, density: 1.1 },
          { name: 'critical-synchronization', bars: 4, density: 1.18 }
        ]
      },
      melee: {
        tempo: [132, 166],
        meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.22, 0.56, 0.24, 0.86, 0.28, 0.62] },
        instrumentation: ['angular-brass-synth', 'syncopated-string-synth', 'urban-drum-noise', 'analog-bass', 'concrete-impact', 'at-field-pulse'],
        density: 1,
        restChance: 0.05,
        patterns: {
          lead: [1, 0, 0.62, 0.82, 0, 0.7, 0.4],
          bass: [1, 0, 0.54, 0, 0.82, 0, 0.46],
          drums: [1, 3, 4, 2, 3, 4, 3],
          pad: [1, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'tokyo-3-rise', bars: 3, density: 0.74 },
          { name: 'vertical-evacuation', bars: 7, density: 1.02 },
          { name: 'unit-intercept', bars: 4, density: 1.12 },
          { name: 'berserk-edge', bars: 4, density: 1.2 }
        ]
      },
      rpg: {
        tempo: [58, 98],
        instrumentation: ['fragile-piano', 'solo-cello-synth', 'clinical-room-tone', 'soft-organ-pad', 'distant-train-noise', 'heartbeat-sub'],
        density: 0.44,
        restChance: 0.4,
        patterns: {
          lead: [1, 0, 0, 0.38, 0, 0, 0.56, 0],
          bass: [1, 0, 0, 0, 0.46, 0, 0, 0],
          drums: [0, 0, 3, 0, 0, 0, 4, 0],
          pad: [1, 0, 0, 0, 1, 0, 0, 0]
        },
        form: [
          { name: 'empty-platform', bars: 8, density: 0.2 },
          { name: 'pilot-room', bars: 8, density: 0.38 },
          { name: 'unspoken-distance', bars: 6, density: 0.28 },
          { name: 'decision-to-board', bars: 8, density: 0.62 }
        ]
      },
      tactics: {
        tempo: [88, 126],
        meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.5, 0.16, 0.82, 0.16, 0.44, 0.16, 0.68, 0.18] },
        instrumentation: ['countdown-string-ostinato', 'muted-brass-synth', 'command-snare-noise', 'geofront-sub-pulse', 'magi-computer-clicks', 'organ-tension-pad'],
        density: 0.72,
        restChance: 0.16,
        patterns: {
          lead: [1, 0, 0.46, 0, 0.72, 0, 0.5, 0, 0.78, 0],
          bass: [1, 0, 0, 0, 0.74, 0, 0, 0, 0.52, 0],
          drums: [1, 0, 3, 0, 2, 0, 3, 0, 4, 0],
          pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        },
        form: [
          { name: 'magi-analysis', bars: 5, density: 0.46 },
          { name: 'interception-plan', bars: 5, density: 0.7 },
          { name: 'power-limit-countdown', bars: 5, density: 0.9 },
          { name: 'operation-execution', bars: 5, density: 1.04 }
        ]
      }
    },
    encounterProfiles: {
      boss: {
        tempo: [118, 158],
        meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.14, 0.56, 0.14, 0.88, 0.14, 0.46, 0.14, 0.72, 0.16] },
        scaleName: 'chromaticTension',
        scale: SCALE_LIBRARY.chromaticTension,
        rootMidi: 41,
        chords: [0, 1, 5, 2],
        instrumentation: ['angular-orchestral-brass-synth', 'tremolo-string-cluster', 'massive-hybrid-drums', 'pipe-organ-pad', 'nonlexical-choir-cluster', 'at-field-pressure-noise'],
        density: 1.08,
        restChance: 0.04,
        patterns: {
          lead: [1, 0, 0.62, 0, 1, 0, 0.72, 0, 0.52, 0],
          bass: [1, 0, 0, 0, 0.86, 0, 0, 0, 0.58, 0],
          drums: [1, 0, 3, 4, 2, 0, 3, 4, 1, 4],
          pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        },
        form: [
          { name: 'angel-pattern-detected', bars: 5, density: 0.86 },
          { name: 'at-field-inversion', bars: 5, density: 1.1 },
          { name: 'eva-limit-break', bars: 5, density: 1.2 }
        ],
        boss: { wave: 'square', pattern: [1, 0, 0.74, 0, 1, 0, 0.82, 0, 0.62, 0], stinger: [0, 6, 1, 10, 13] }
      },
      worldBoss: {
        tempo: [126, 168],
        meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.58, 0.94, 0.22, 0.72] },
        scaleName: 'ritualMinor',
        scale: SCALE_LIBRARY.ritualMinor,
        rootMidi: 36,
        chords: [0, 1, 4, 2],
        instrumentation: ['apocalyptic-orchestral-brass-synth', 'mass-string-cluster', 'cathedral-percussion-noise', 'pipe-organ', 'nonlexical-apocalypse-choir', 'geofront-collapse-rumble', 'human-instrumentality-drone'],
        density: 1.18,
        restChance: 0.02,
        patterns: {
          lead: [1, 0, 0.78, 1, 0.5, 0.9],
          bass: [1, 0, 0, 1, 0, 0.68],
          drums: [1, 3, 4, 2, 3, 4],
          pad: [1, 0, 0, 1, 0, 0]
        },
        form: [
          { name: 'third-impact-threshold', bars: 6, density: 1.02 },
          { name: 'ego-boundary-collapse', bars: 3, density: 0.52 },
          { name: 'end-of-evangelion', bars: 8, density: 1.24 }
        ],
        boss: { wave: 'square', pattern: [1, 0.66, 0.84, 1, 0.58, 0.92], stinger: [0, 1, 6, 13, 12] }
      }
    },
    boss: { pattern: [1, 0, 0.55, 0, 1, 0, 0.65, 0, 0.5, 0], stinger: [0, 6, 1, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.5] }
  }));
}
