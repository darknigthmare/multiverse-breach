// Steins;Gate — definitions consumed by src/game/stageMusicProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }) {
  return (detailedOverride('cyberNetwork', {
    id: 'mus-steins-gate',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [74, 126],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.16, 0.48, 0.2, 0.76, 0.18, 0.56] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 49,
    chords: [0, 3, 1, 5],
    instrumentation: ['analog-lab-piano-synth', 'cathode-tube-hum', 'world-line-sequencer-pulse', 'worn-tape-pad', 'relay-click-percussion', 'telephone-dial-noise'],
    density: 0.68,
    restChance: 0.24,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.46, 0, 0.72, 0.32, 0],
      bass: [1, 0, 0, 0.58, 0, 0, 0.42],
      drums: [1, 0, 3, 0, 2, 0, 4],
      pad: [1, 0, 0, 0, 1, 0, 0]
    },
    form: [
      { name: 'future-gadget-routine', bars: 7, density: 0.36 },
      { name: 'd-mail-anomaly', bars: 7, density: 0.62 },
      { name: 'world-line-displacement', bars: 7, density: 0.82 },
      { name: 'reading-steiner-resolve', bars: 7, density: 0.96 }
    ],
    modeProfiles: {
      combat: {
        tempo: [128, 158],
        meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.12, 0.36, 0.14, 0.72, 0.12, 0.46, 0.16, 0.92, 0.12, 0.34, 0.14, 0.68, 0.12, 0.52, 0.16] },
        instrumentation: ['serrated-analog-sequencer', 'overdriven-synth-bass', 'compressed-noise-drums', 'lab-bench-metal-hits', 'world-line-sync-pulse', 'phone-relay-clicks'],
        density: 0.94,
        restChance: 0.08,
        patterns: {
          lead: [1, 0, 0.62, 0.28, 0.86, 0, 0.52, 0.34, 1, 0, 0.7, 0.3, 0.9, 0, 0.58, 0.26],
          bass: [1, 0, 0, 0, 0.78, 0, 0.46, 0, 1, 0, 0, 0, 0.7, 0, 0.5, 0],
          drums: [1, 3, 3, 4, 2, 3, 4, 3, 1, 3, 4, 3, 2, 3, 3, 4],
          pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'rounder-breach', bars: 2, density: 0.7 },
          { name: 'lab-countermeasure', bars: 6, density: 0.98 },
          { name: 'time-leap-reversal', bars: 4, density: 1.08 },
          { name: 'convergence-break', bars: 4, density: 1.16 }
        ]
      },
      melee: {
        tempo: [142, 174],
        meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.2, 0.54, 0.24, 0.88, 0.28, 0.66] },
        instrumentation: ['fast-analog-arpeggiator', 'elastic-synth-bass', 'clipped-drum-machine', 'radio-kaikan-metal-hit', 'divergent-glitch-pulse', 'rooftop-wind-noise'],
        density: 1.02,
        restChance: 0.05,
        patterns: {
          lead: [1, 0.48, 0, 0.82, 0.34, 0.72, 0.44],
          bass: [1, 0, 0.58, 0, 0.84, 0, 0.5],
          drums: [1, 3, 4, 2, 3, 4, 3],
          pad: [1, 0, 0, 0, 0, 0, 0]
        },
        form: [
          { name: 'radio-kaikan-approach', bars: 3, density: 0.76 },
          { name: 'rooftop-feint', bars: 7, density: 1.04 },
          { name: 'divergence-rebound', bars: 4, density: 1.14 },
          { name: 'platform-escape', bars: 4, density: 1.2 }
        ]
      },
      rpg: {
        tempo: [66, 104],
        meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.46, 0.18, 0.76, 0.16, 0.4, 0.18] },
        instrumentation: ['worn-electric-piano-synth', 'warm-analog-pad', 'muted-bell-synth', 'soft-tape-hiss', 'cathode-tube-hum', 'lab-clock-pulse'],
        density: 0.48,
        restChance: 0.38,
        patterns: {
          lead: [1, 0, 0, 0.42, 0, 0.56, 0, 0.3],
          bass: [1, 0, 0, 0, 0.48, 0, 0, 0],
          drums: [0, 0, 3, 0, 0, 0, 4, 0],
          pad: [1, 0, 0, 0, 1, 0, 0, 0]
        },
        form: [
          { name: 'future-gadget-lab', bars: 8, density: 0.24 },
          { name: 'd-mail-observation', bars: 8, density: 0.42 },
          { name: 'reading-steiner-afterimage', bars: 6, density: 0.34 },
          { name: 'lab-member-resolve', bars: 8, density: 0.66 }
        ]
      },
      tactics: {
        tempo: [92, 128],
        meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.14, 0.44, 0.14, 0.78, 0.14, 0.38, 0.14, 0.64, 0.16] },
        instrumentation: ['dry-piano-stabs', 'low-analog-sequencer', 'encrypted-modem-clicks', 'measured-electronic-snare', 'sern-surveillance-drone', 'divergence-grid-pulse'],
        density: 0.7,
        restChance: 0.2,
        patterns: {
          lead: [1, 0, 0.38, 0, 0.64, 0, 0.48, 0, 0.72, 0],
          bass: [1, 0, 0, 0, 0.66, 0, 0, 0, 0.5, 0],
          drums: [1, 0, 3, 0, 2, 0, 3, 0, 4, 0],
          pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        },
        form: [
          { name: 'sern-signal-trace', bars: 5, density: 0.44 },
          { name: 'rounder-route-analysis', bars: 5, density: 0.66 },
          { name: 'ibn-access-window', bars: 5, density: 0.84 },
          { name: 'world-line-extraction', bars: 5, density: 1 }
        ]
      }
    },
    encounterProfiles: {
      boss: {
        tempo: [124, 162],
        meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.12, 0.5, 0.14, 0.84, 0.14, 0.42, 0.14, 0.7, 0.16] },
        scaleName: 'phrygian',
        scale: SCALE_LIBRARY.phrygian,
        rootMidi: 41,
        chords: [0, 1, 4, 0],
        instrumentation: ['serrated-analog-ostinato', 'low-piano-cluster', 'rounder-radio-noise', 'gated-industrial-drums', 'tension-string-synth', 'convergence-lock-pulse'],
        density: 1.06,
        restChance: 0.05,
        patterns: {
          lead: [1, 0, 0.62, 0, 1, 0, 0.72, 0, 0.54, 0],
          bass: [1, 0, 0, 0, 0.84, 0, 0, 0, 0.58, 0],
          drums: [1, 0, 3, 4, 2, 0, 3, 4, 1, 4],
          pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        },
        form: [
          { name: 'rounder-shadow', bars: 5, density: 0.84 },
          { name: 'sern-breach', bars: 5, density: 1.08 },
          { name: 'forced-convergence', bars: 5, density: 1.18 }
        ],
        boss: { wave: 'square', pattern: [1, 0, 0.74, 0, 1, 0, 0.82, 0, 0.62, 0], stinger: [0, 1, 6, 10, 13] }
      },
      worldBoss: {
        tempo: [138, 176],
        meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.58, 0.26, 0.92, 0.3, 0.7] },
        scaleName: 'chromaticTension',
        scale: SCALE_LIBRARY.chromaticTension,
        rootMidi: 37,
        chords: [0, 1, 5, 2],
        instrumentation: ['layered-world-line-oscillators', 'divergence-meter-counterpulse', 'time-machine-subharmonic', 'nonlexical-cathode-choir-pad', 'temporal-glitch-noise', 'attractor-field-phase-pulse', 'operation-skuld-analog-riser'],
        density: 1.18,
        restChance: 0.02,
        patterns: {
          lead: [1, 0, 0.78, 1, 0.5, 0.88, 0.62],
          bass: [1, 0, 0, 0.92, 0, 0, 0.68],
          drums: [1, 3, 4, 2, 3, 4, 3],
          pad: [1, 0, 0, 1, 0, 0, 0]
        },
        form: [
          { name: 'beta-attractor-lock', bars: 7, density: 1.02 },
          { name: 'observed-history-feint', bars: 4, density: 0.58 },
          { name: 'operation-skuld', bars: 7, density: 1.18 },
          { name: 'steins-gate-world-line', bars: 7, density: 1.24 }
        ],
        boss: { wave: 'square', pattern: [1, 0.64, 0.84, 1, 0.56, 0.92, 0.72], stinger: [0, 1, 6, 13, 12] }
      }
    },
    boss: { pattern: [1, 0, 0.56, 0, 1, 0, 0.68], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.7, 0.5, 0.68, 0.54, 1.6] }
  }));
}
