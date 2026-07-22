// Original procedural music profiles. These describe musical language only:
// no canonical melody, recording, sample, or protected score data is embedded.

const SCALE_LIBRARY = {
  dorian: [0, 2, 3, 5, 7, 9, 10],
  minor: [0, 2, 3, 5, 7, 8, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  wholeTone: [0, 2, 4, 6, 8, 10],
  suspended: [0, 2, 5, 7, 10],
  chromaticTension: [0, 1, 3, 6, 7, 10],
  ritualMinor: [0, 1, 5, 7, 8],
  heroicMinor: [0, 2, 3, 5, 7, 9, 11]
};

const cloneArray = value => Array.isArray(value) ? [...value] : value;

const mergeProfile = (base, override = {}) => ({
  ...base,
  ...override,
  tempo: cloneArray(override.tempo || base.tempo),
  scale: cloneArray(override.scale || base.scale),
  chords: cloneArray(override.chords || base.chords),
  instrumentation: cloneArray(override.instrumentation || base.instrumentation),
  form: (override.form || base.form).map(section => ({ ...section })),
  meter: { ...base.meter, ...(override.meter || {}) },
  waves: { ...base.waves, ...(override.waves || {}) },
  filters: { ...base.filters, ...(override.filters || {}) },
  gains: { ...base.gains, ...(override.gains || {}) },
  patterns: {
    ...base.patterns,
    ...(override.patterns || {}),
    lead: cloneArray(override.patterns?.lead || base.patterns.lead),
    bass: cloneArray(override.patterns?.bass || base.patterns.bass),
    drums: cloneArray(override.patterns?.drums || base.patterns.drums),
    pad: cloneArray(override.patterns?.pad || base.patterns.pad)
  },
  boss: {
    ...base.boss,
    ...(override.boss || {}),
    pattern: cloneArray(override.boss?.pattern || base.boss.pattern),
    stinger: cloneArray(override.boss?.stinger || base.boss.stinger)
  },
  victory: {
    ...base.victory,
    ...(override.victory || {}),
    intervals: cloneArray(override.victory?.intervals || base.victory.intervals),
    beats: cloneArray(override.victory?.beats || base.victory.beats)
  }
});

const BASE_PROFILE = {
  id: 'family-nexus-archive',
  family: 'nexusArchive',
  confidence: 'A-OC',
  sourcePolicy: 'original-procedural-only',
  tempo: [84, 112],
  meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.35, 0.62, 0.3, 0.8, 0.32, 0.58, 0.3] },
  scaleName: 'dorian',
  scale: SCALE_LIBRARY.dorian,
  rootMidi: 50,
  chords: [0, 3, 1, 4],
  instrumentation: ['soft-piano', 'glass-marimba', 'chamber-pad', 'granular-pulse', 'light-metal'],
  density: 0.62,
  restChance: 0.2,
  padEveryBars: 2,
  waves: { lead: 'triangle', bass: 'sine', pad: 'sine', boss: 'sawtooth' },
  filters: { lead: 2100, bass: 520, pad: 1200, boss: 860, noise: 1900 },
  gains: { lead: 0.042, bass: 0.038, pad: 0.022, drums: 0.026, boss: 0.022 },
  patterns: {
    lead: [1, 0, 0.75, 0, 1, 0.35, 0.65, 0],
    bass: [1, 0, 0, 0, 0.85, 0, 0, 0],
    drums: [1, 3, 0, 3, 2, 3, 0, 3],
    pad: [1, 0, 0, 0, 0, 0, 0, 0]
  },
  form: [
    { name: 'intro', bars: 4, density: 0.42 },
    { name: 'archive-a', bars: 8, density: 0.72 },
    { name: 'memory-b', bars: 8, density: 0.58 },
    { name: 'rift-c', bars: 4, density: 0.86 }
  ],
  boss: {
    wave: 'sawtooth',
    gain: 0.024,
    octave: -1,
    pattern: [1, 0, 0, 0, 0.7, 0, 0, 0],
    stinger: [0, 6, 1, 10, 12]
  },
  victory: {
    wave: 'triangle',
    intervals: [0, 3, 7, 9, 12],
    beats: [0.5, 0.5, 0.75, 0.5, 1.5]
  }
};

export const MUSIC_PROFILE_FAMILIES = {
  nexusArchive: mergeProfile(BASE_PROFILE),
  militarySciFi: mergeProfile(BASE_PROFILE, {
    id: 'family-military-scifi',
    family: 'militarySciFi',
    confidence: 'family',
    tempo: [96, 136],
    scaleName: 'dorian',
    rootMidi: 50,
    chords: [0, 4, 5, 3],
    instrumentation: ['low-brass-synth', 'string-ostinato', 'snare-noise', 'toms', 'sub-pulse'],
    density: 0.76,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'triangle', boss: 'sawtooth' },
    filters: { lead: 1500, bass: 430, pad: 980, boss: 720, noise: 1250 },
    gains: { lead: 0.04, bass: 0.048, pad: 0.02, drums: 0.04, boss: 0.028 },
    patterns: {
      lead: [1, 0, 0.75, 0.35, 1, 0, 0.55, 0.35],
      bass: [1, 0, 0.55, 0, 1, 0, 0.55, 0],
      drums: [1, 3, 2, 3, 1, 3, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'briefing', bars: 4, density: 0.5 },
      { name: 'advance', bars: 8, density: 0.88 },
      { name: 'pressure', bars: 4, density: 0.68 },
      { name: 'counterattack', bars: 8, density: 1 }
    ],
    boss: { pattern: [1, 0, 0.8, 0, 1, 0, 0.7, 0], stinger: [0, 7, 5, 10, 12] },
    victory: { intervals: [0, 5, 7, 10, 12], beats: [0.5, 0.5, 0.5, 0.75, 1.5] }
  }),
  xenoHorror: mergeProfile(BASE_PROFILE, {
    id: 'family-xeno-horror',
    family: 'xenoHorror',
    confidence: 'family',
    tempo: [68, 112],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.2, 0.45, 0.15, 0.72, 0.18, 0.38, 0.15, 0.62, 0.18] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 50,
    chords: [0, 1, 5, 2],
    instrumentation: ['microtonal-string-synth', 'air-noise', 'hull-metal', 'subharmonic-drone', 'muted-toms'],
    density: 0.48,
    restChance: 0.34,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sawtooth', boss: 'square' },
    filters: { lead: 2600, bass: 360, pad: 680, boss: 520, noise: 3100 },
    gains: { lead: 0.032, bass: 0.046, pad: 0.018, drums: 0.032, boss: 0.027 },
    patterns: {
      lead: [1, 0, 0, 0.45, 0, 0, 0.7, 0, 0.35, 0],
      bass: [1, 0, 0, 0, 0, 0.65, 0, 0, 0, 0],
      drums: [1, 0, 3, 0, 0, 2, 0, 4, 0, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'drift', bars: 6, density: 0.3 },
      { name: 'detection', bars: 5, density: 0.52 },
      { name: 'pursuit', bars: 8, density: 0.86 },
      { name: 'airlock', bars: 2, density: 0.38 }
    ],
    boss: { wave: 'square', pattern: [1, 0, 0, 0, 0.65, 0, 1, 0, 0, 0], stinger: [0, 6, 1, 13, 7] },
    victory: { wave: 'sine', intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.5] }
  }),
  survivalHorror: mergeProfile(BASE_PROFILE, {
    id: 'family-survival-horror',
    family: 'survivalHorror',
    confidence: 'family',
    tempo: [72, 116],
    scaleName: 'minor',
    scale: SCALE_LIBRARY.minor,
    rootMidi: 52,
    chords: [0, 1, 5, 3],
    instrumentation: ['prepared-piano', 'abrasive-strings', 'ventilation-noise', 'low-woodwind-synth', 'metal-impact'],
    density: 0.5,
    restChance: 0.3,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    filters: { lead: 1700, bass: 390, pad: 760, boss: 620, noise: 2300 },
    gains: { lead: 0.036, bass: 0.043, pad: 0.018, drums: 0.03, boss: 0.027 },
    patterns: {
      lead: [1, 0, 0.55, 0, 0, 0.3, 0.7, 0],
      bass: [1, 0, 0, 0, 0.7, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'exploration', bars: 6, density: 0.34 },
      { name: 'alert', bars: 6, density: 0.68 },
      { name: 'inventory-breath', bars: 4, density: 0.28 },
      { name: 'survival-combat', bars: 6, density: 0.88 }
    ],
    boss: { pattern: [1, 0, 0, 0, 1, 0, 0.55, 0], stinger: [0, 1, 6, 7, 13] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.75, 0.5, 0.75, 0.75, 1.5] }
  }),
  psychologicalHorror: mergeProfile(BASE_PROFILE, {
    id: 'family-psychological-horror',
    family: 'psychologicalHorror',
    confidence: 'family',
    tempo: [58, 102],
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 45,
    chords: [0, 1, 4, 2],
    instrumentation: ['detuned-piano', 'baritone-pluck', 'radio-noise', 'sheet-metal', 'analog-drone'],
    density: 0.42,
    restChance: 0.4,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    filters: { lead: 1350, bass: 320, pad: 610, boss: 480, noise: 3400 },
    gains: { lead: 0.032, bass: 0.04, pad: 0.02, drums: 0.028, boss: 0.024 },
    patterns: {
      lead: [1, 0, 0, 0.3, 0, 0, 0.65, 0],
      bass: [1, 0, 0, 0, 0, 0, 0.6, 0],
      drums: [0, 3, 0, 0, 4, 0, 0, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'fog', bars: 8, density: 0.28 },
      { name: 'memory', bars: 8, density: 0.46 },
      { name: 'otherworld', bars: 4, density: 0.9 },
      { name: 'altered-return', bars: 8, density: 0.58 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.8, 0, 0, 0], stinger: [0, 1, 6, 12, 7] },
    victory: { intervals: [0, 3, 6, 7, 12], beats: [0.75, 0.75, 0.5, 0.75, 1.75] }
  }),
  cyberNetwork: mergeProfile(BASE_PROFILE, {
    id: 'family-cyber-network',
    family: 'cyberNetwork',
    confidence: 'family',
    tempo: [108, 146],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.2, 0.35, 0.2, 0.7, 0.2, 0.42, 0.2, 0.9, 0.2, 0.35, 0.2, 0.68, 0.2, 0.48, 0.2] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 54,
    chords: [0, 3, 5, 1],
    instrumentation: ['fm-lead', 'modular-bass', 'glass-pad', 'breakbeat-noise', 'network-clicks'],
    density: 0.78,
    restChance: 0.16,
    padEveryBars: 2,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 2600, bass: 620, pad: 1700, boss: 980, noise: 4200 },
    gains: { lead: 0.035, bass: 0.041, pad: 0.018, drums: 0.034, boss: 0.025 },
    patterns: {
      lead: [1, 0, 0.55, 0, 0.8, 0, 0.35, 0, 1, 0, 0.6, 0.25, 0.75, 0, 0.45, 0],
      bass: [1, 0, 0, 0, 0.7, 0, 0, 0, 1, 0, 0.35, 0, 0.7, 0, 0, 0],
      drums: [1, 3, 3, 3, 2, 3, 3, 3, 1, 3, 3, 4, 2, 3, 3, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'infiltration', bars: 4, density: 0.58 },
      { name: 'traffic', bars: 8, density: 0.92 },
      { name: 'memory', bars: 4, density: 0.48 },
      { name: 'assault', bars: 8, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.7, 0, 0, 0, 1, 0, 0.55, 0, 0.8, 0, 0, 0], stinger: [0, 6, 9, 1, 13] },
    victory: { intervals: [0, 3, 7, 10, 12, 15], beats: [0.5, 0.5, 0.5, 0.5, 0.75, 1.25] }
  }),
  industrialMetal: mergeProfile(BASE_PROFILE, {
    id: 'family-industrial-metal',
    family: 'industrialMetal',
    confidence: 'family',
    tempo: [110, 154],
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 4, 0],
    instrumentation: ['distorted-oscillator-guitar', 'saturated-bass', 'massive-drums', 'industrial-synth', 'struck-steel'],
    density: 0.88,
    restChance: 0.1,
    padEveryBars: 4,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'sawtooth', boss: 'square' },
    filters: { lead: 1180, bass: 510, pad: 720, boss: 430, noise: 1600 },
    gains: { lead: 0.044, bass: 0.052, pad: 0.014, drums: 0.047, boss: 0.03 },
    patterns: {
      lead: [1, 0.65, 0, 0.8, 1, 0, 0.55, 0.85],
      bass: [1, 0.65, 0, 0.75, 1, 0, 0.55, 0.75],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'riff-a', bars: 8, density: 0.9 },
      { name: 'riff-b', bars: 8, density: 1 },
      { name: 'breakdown', bars: 4, density: 0.62 },
      { name: 'instrumental-refrain', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.8, 0, 1, 0, 0.7, 0.8], stinger: [0, 1, 6, 7, 12] },
    victory: { wave: 'sawtooth', intervals: [0, 3, 7, 10, 12], beats: [0.5, 0.5, 0.75, 0.5, 1.5] }
  }),
  electronicStage: mergeProfile(BASE_PROFILE, {
    id: 'family-electronic-stage',
    family: 'electronicStage',
    confidence: 'family',
    tempo: [118, 138],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.2, 0.3, 0.2, 0.72, 0.2, 0.35, 0.2, 1, 0.2, 0.3, 0.2, 0.72, 0.2, 0.35, 0.2] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 45,
    chords: [0, 3, 5, 4],
    instrumentation: ['analog-lead', 'sidechain-bass', 'dry-clap', 'arpeggiator', 'hybrid-strings'],
    density: 0.82,
    waves: { lead: 'sawtooth', bass: 'sine', pad: 'triangle', boss: 'square' },
    filters: { lead: 2900, bass: 580, pad: 1800, boss: 920, noise: 4700 },
    gains: { lead: 0.037, bass: 0.045, pad: 0.019, drums: 0.036, boss: 0.024 },
    patterns: {
      lead: [1, 0, 0.6, 0, 0.8, 0, 0.65, 0, 1, 0, 0.6, 0, 0.8, 0, 0.45, 0],
      bass: [1, 0, 0, 0, 0.75, 0, 0, 0, 1, 0, 0, 0, 0.75, 0, 0, 0],
      drums: [1, 3, 3, 3, 2, 3, 3, 3, 1, 3, 3, 3, 2, 3, 3, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'intro', bars: 4, density: 0.45 },
      { name: 'stage-a', bars: 8, density: 0.88 },
      { name: 'build', bars: 4, density: 0.74 },
      { name: 'drop', bars: 8, density: 1.08 },
      { name: 'break', bars: 4, density: 0.48 },
      { name: 'return', bars: 8, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.8, 0, 0, 0, 1, 0, 0, 0, 0.8, 0, 0.55, 0], stinger: [0, 7, 10, 3, 12] },
    victory: { intervals: [0, 3, 7, 10, 12, 15], beats: [0.5, 0.5, 0.5, 0.5, 0.75, 1.25] }
  }),
  animeHeroic: mergeProfile(BASE_PROFILE, {
    id: 'family-anime-heroic',
    family: 'animeHeroic',
    confidence: 'family',
    tempo: [122, 162],
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 5, 3, 4],
    instrumentation: ['chamber-orchestra-synth', 'electric-guitar-oscillator', 'contextual-toms', 'piano', 'wordless-choir-pad'],
    density: 0.82,
    waves: { lead: 'triangle', bass: 'square', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 2400, bass: 520, pad: 1500, boss: 820, noise: 1900 },
    gains: { lead: 0.042, bass: 0.043, pad: 0.021, drums: 0.038, boss: 0.027 },
    patterns: {
      lead: [1, 0, 0.75, 0.4, 1, 0, 0.65, 0.35],
      bass: [1, 0, 0, 0, 0.85, 0, 0.45, 0],
      drums: [1, 3, 2, 3, 1, 3, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'preparation', bars: 4, density: 0.54 },
      { name: 'duel', bars: 8, density: 0.94 },
      { name: 'emotion', bars: 4, density: 0.5 },
      { name: 'breakthrough', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.65, 0, 1, 0, 0.75, 0], stinger: [0, 7, 9, 3, 12] },
    victory: { intervals: [0, 4, 7, 9, 12, 16], beats: [0.5, 0.5, 0.5, 0.5, 0.75, 1.5] }
  }),
  arcaneFantasy: mergeProfile(BASE_PROFILE, {
    id: 'family-arcane-fantasy',
    family: 'arcaneFantasy',
    confidence: 'family',
    tempo: [88, 132],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.3, 0.55, 0.85, 0.3, 0.5] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 50,
    chords: [0, 5, 3, 4],
    instrumentation: ['harp-pluck', 'woodwind-synth', 'frame-drum', 'string-pad', 'bell'],
    density: 0.68,
    waves: { lead: 'triangle', bass: 'sine', pad: 'triangle', boss: 'sawtooth' },
    filters: { lead: 2300, bass: 430, pad: 1450, boss: 710, noise: 1800 },
    gains: { lead: 0.04, bass: 0.038, pad: 0.022, drums: 0.031, boss: 0.026 },
    patterns: {
      lead: [1, 0, 0.6, 0.85, 0, 0.45],
      bass: [1, 0, 0, 0.7, 0, 0],
      drums: [1, 3, 3, 2, 3, 3],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'quest', bars: 4, density: 0.55 },
      { name: 'discovery', bars: 8, density: 0.72 },
      { name: 'ritual', bars: 4, density: 0.82 },
      { name: 'confrontation', bars: 8, density: 1 }
    ],
    boss: { pattern: [1, 0, 0.55, 0.9, 0, 0.55], stinger: [0, 5, 8, 11, 12] },
    victory: { intervals: [0, 4, 7, 11, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.5] }
  }),
  stealthTactical: mergeProfile(BASE_PROFILE, {
    id: 'family-stealth-tactical',
    family: 'stealthTactical',
    confidence: 'family',
    tempo: [86, 132],
    meter: { beats: 5, unit: 8, subdivisions: 2, accents: [1, 0.2, 0.45, 0.2, 0.72, 0.2, 0.4, 0.2, 0.62, 0.2] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 49,
    chords: [0, 1, 3, 5],
    instrumentation: ['pizzicato-string-synth', 'stealth-pulse', 'muted-snare', 'fretless-bass-synth', 'sonar-ping'],
    density: 0.58,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 1650, bass: 440, pad: 1120, boss: 760, noise: 2600 },
    gains: { lead: 0.036, bass: 0.04, pad: 0.018, drums: 0.03, boss: 0.026 },
    patterns: {
      lead: [1, 0, 0.45, 0, 0, 0.65, 0, 0.35, 0, 0.55],
      bass: [1, 0, 0, 0, 0.65, 0, 0, 0, 0.45, 0],
      drums: [1, 0, 3, 0, 0, 2, 0, 3, 0, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'stealth', bars: 8, density: 0.38 },
      { name: 'suspicion', bars: 4, density: 0.58 },
      { name: 'alert', bars: 8, density: 0.96 },
      { name: 'withdrawal', bars: 4, density: 0.48 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.6, 0, 1, 0, 0.45, 0], stinger: [0, 1, 7, 6, 13] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.5, 0.5, 0.75, 0.75, 1.5] }
  }),
  comedyOddity: mergeProfile(BASE_PROFILE, {
    id: 'family-comedy-oddity',
    family: 'comedyOddity',
    confidence: 'family',
    tempo: [104, 148],
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 48,
    chords: [0, 1, 4, 5],
    instrumentation: ['bouncy-marimba', 'rubber-bass', 'toy-percussion', 'bright-synth', 'comic-slide'],
    density: 0.74,
    waves: { lead: 'square', bass: 'triangle', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 3200, bass: 650, pad: 1900, boss: 900, noise: 3800 },
    gains: { lead: 0.036, bass: 0.038, pad: 0.016, drums: 0.032, boss: 0.023 },
    patterns: {
      lead: [1, 0.4, 0, 0.75, 1, 0, 0.5, 0.7],
      bass: [1, 0, 0.5, 0, 0.8, 0, 0.45, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'setup', bars: 4, density: 0.62 },
      { name: 'escalation', bars: 8, density: 0.9 },
      { name: 'wrong-turn', bars: 4, density: 0.48 },
      { name: 'payoff', bars: 8, density: 1 }
    ],
    boss: { pattern: [1, 0, 0.65, 0, 0.85, 0, 0.55, 0], stinger: [0, 6, 7, 3, 12] },
    victory: { intervals: [0, 4, 7, 11, 12, 16], beats: [0.4, 0.4, 0.55, 0.4, 0.65, 1.4] }
  }),
  retroArcade: mergeProfile(BASE_PROFILE, {
    id: 'family-retro-arcade',
    family: 'retroArcade',
    confidence: 'family',
    tempo: [124, 168],
    scaleName: 'suspended',
    scale: SCALE_LIBRARY.suspended,
    rootMidi: 48,
    chords: [0, 3, 4, 1],
    instrumentation: ['pulse-lead', 'chip-bass', 'noise-drums', 'arpeggio', 'triangle-pad'],
    density: 0.9,
    waves: { lead: 'square', bass: 'square', pad: 'triangle', boss: 'sawtooth' },
    filters: { lead: 4200, bass: 880, pad: 2100, boss: 1200, noise: 5200 },
    gains: { lead: 0.034, bass: 0.036, pad: 0.014, drums: 0.03, boss: 0.022 },
    patterns: {
      lead: [1, 0.7, 0.45, 0.8, 1, 0.65, 0.5, 0.85],
      bass: [1, 0, 0.65, 0, 1, 0, 0.55, 0],
      drums: [1, 3, 2, 3, 1, 3, 2, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'ready', bars: 2, density: 0.7 },
      { name: 'round-a', bars: 8, density: 1 },
      { name: 'bonus', bars: 4, density: 0.78 },
      { name: 'round-b', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.7, 0, 1, 0, 0.8, 0], stinger: [0, 6, 7, 10, 12] },
    victory: { intervals: [0, 4, 7, 12, 16], beats: [0.35, 0.35, 0.5, 0.65, 1.3] }
  })
};

const detailedOverride = (family, override) => mergeProfile(MUSIC_PROFILE_FAMILIES[family], override);

export const MUSIC_PROFILE_OVERRIDES = {
  'Nexus de Convergence': detailedOverride('nexusArchive', {
    id: 'mus-nexus-de-convergence',
    confidence: 'A-OC',
    tempo: [84, 112],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.25, 0.62, 0.2, 0.82, 0.2, 0.48, 0.25] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 50,
    chords: [0, 4, 1, 3],
    instrumentation: ['felt-piano-synth', 'rubbed-glass-pad', 'digital-marimba', 'chamber-strings-synth', 'cyan-granular-pulse', 'light-metal'],
    density: 0.6,
    restChance: 0.22,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.55, 0, 0.82, 0.3, 0, 0.5],
      bass: [1, 0, 0, 0, 0.72, 0, 0, 0],
      drums: [1, 3, 0, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'arca-intro', bars: 4, density: 0.38 },
      { name: 'atrium', bars: 8, density: 0.68 },
      { name: 'fragile-memory', bars: 8, density: 0.54 },
      { name: 'breach', bars: 4, density: 0.9 }
    ],
    boss: { wave: 'sawtooth', pattern: [1, 0, 0, 0, 0.7, 0, 0.5, 0], stinger: [0, 5, 1, 10, 12] },
    victory: { wave: 'triangle', intervals: [0, 3, 7, 9, 12], beats: [0.5, 0.5, 0.75, 0.5, 1.5] }
  }),
  Halo: detailedOverride('militarySciFi', {
    id: 'mus-halo',
    confidence: 'A',
    tempo: [88, 124],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.28, 0.45, 0.82, 0.3, 0.48] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 52,
    chords: [0, 4, 1, 5],
    instrumentation: ['wordless-low-choir-pad', 'wide-string-synth', 'timpani-noise', 'military-snare', 'space-pad', 'low-bell'],
    density: 0.68,
    patterns: {
      lead: [1, 0, 0.55, 0.8, 0, 0.5],
      bass: [1, 0, 0, 0.75, 0, 0],
      drums: [1, 3, 3, 2, 3, 3],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'ring-contemplation', bars: 8, density: 0.42 },
      { name: 'frontline-march', bars: 8, density: 0.82 },
      { name: 'ancient-threat', bars: 4, density: 0.7 },
      { name: 'choral-return', bars: 4, density: 0.9 }
    ],
    boss: { pattern: [1, 0, 0.45, 1, 0, 0.6], stinger: [0, 7, 5, 10, 12] },
    victory: { intervals: [0, 5, 7, 9, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.5] }
  }),
  Stargate: detailedOverride('militarySciFi', {
    id: 'mus-stargate',
    confidence: 'B',
    tempo: [86, 124],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.3, 0.48, 0.86, 0.32, 0.54] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 5, 3, 4],
    instrumentation: ['frame-drum-noise', 'low-brass-synth', 'wordless-choir-pad', 'plucked-string-synth', 'gate-metal-ring', 'subspace-pulse'],
    density: 0.68,
    restChance: 0.2,
    patterns: {
      lead: [1, 0, 0.52, 0.78, 0, 0.46],
      bass: [1, 0, 0, 0.74, 0, 0],
      drums: [1, 3, 3, 2, 3, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'chevron-lock', bars: 6, density: 0.42 },
      { name: 'offworld-patrol', bars: 8, density: 0.76 },
      { name: 'system-lord-contact', bars: 4, density: 0.96 },
      { name: 'iris-return', bars: 6, density: 0.58 }
    ],
    boss: { pattern: [1, 0, 0.5, 1, 0, 0.66], stinger: [0, 5, 7, 10, 12] },
    victory: { intervals: [0, 5, 7, 9, 12], beats: [0.6, 0.5, 0.6, 0.55, 1.45] }
  }),
  'Resident Evil': detailedOverride('survivalHorror', {
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
  }),
  'Silent Hill': detailedOverride('psychologicalHorror', {
    id: 'mus-silent-hill',
    confidence: 'A',
    tempo: [58, 102],
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 45,
    chords: [0, 1, 4, 2],
    instrumentation: ['clean-baritone-pluck', 'detuned-piano', 'struck-sheet-metal', 'analog-drone', 'radio-breath', 'abrasive-string-synth'],
    density: 0.4,
    restChance: 0.42,
    form: [
      { name: 'acoustic-fog', bars: 8, density: 0.24 },
      { name: 'guilty-memory', bars: 8, density: 0.42 },
      { name: 'industrial-otherworld', bars: 4, density: 0.92 },
      { name: 'altered-return', bars: 8, density: 0.55 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.85, 0, 0, 0], stinger: [0, 1, 6, 12, 7] },
    victory: { intervals: [0, 3, 6, 7, 12], beats: [0.75, 0.75, 0.5, 0.75, 1.75] }
  }),
  Doom: detailedOverride('industrialMetal', {
    id: 'mus-doom',
    confidence: 'A',
    tempo: [132, 172],
    meter: { beats: 9, unit: 8, subdivisions: 1, accents: [1, 0.35, 0.7, 0.3, 0.85, 0.3, 0.72, 0.35, 0.62] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 4, 0],
    instrumentation: ['eight-string-oscillator-rig', 'distorted-modular-synth', 'metal-drum-noise', 'sub-bass', 'chain-impact', 'wordless-low-choir-pad'],
    density: 0.96,
    restChance: 0.06,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0.8, 0, 1, 0.65, 0, 0.85, 0.7, 0],
      bass: [1, 0.7, 0, 1, 0.55, 0, 0.8, 0.65, 0],
      drums: [1, 3, 2, 1, 3, 2, 1, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'industrial-build', bars: 4, density: 0.72 },
      { name: 'hell-assault', bars: 8, density: 1.08 },
      { name: 'mechanical-breakdown', bars: 4, density: 0.7 },
      { name: 'overload', bars: 8, density: 1.15 },
      { name: 'relentless-return', bars: 4, density: 1 }
    ],
    boss: { wave: 'square', pattern: [1, 0, 0.75, 1, 0, 0.7, 1, 0, 0.65], stinger: [0, 1, 6, 7, 12] },
    victory: { wave: 'sawtooth', intervals: [0, 3, 6, 7, 12], beats: [0.35, 0.35, 0.55, 0.45, 1.4] }
  }),
  Alien: detailedOverride('xenoHorror', {
    id: 'mus-alien',
    confidence: 'B',
    tempo: [62, 110],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.15, 0.42, 0.12, 0.68, 0.15, 0.35, 0.12, 0.6, 0.15] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 50,
    chords: [0, 5, 1, 2],
    instrumentation: ['microtonal-string-synth', 'treated-conch-sine', 'air-whistle-noise', 'muted-toms', 'subharmonic-drone', 'hull-metal'],
    density: 0.44,
    restChance: 0.4,
    form: [
      { name: 'cold-space-drift', bars: 9, density: 0.2 },
      { name: 'organism-detection', bars: 5, density: 0.48 },
      { name: 'industrial-pursuit', bars: 8, density: 0.9 },
      { name: 'airlock', bars: 2, density: 0.32 }
    ],
    boss: { wave: 'square', pattern: [1, 0, 0, 0, 0.5, 0, 1, 0, 0, 0], stinger: [0, 6, 1, 13, 7] },
    victory: { wave: 'sine', intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.75] }
  }),
  Predator: detailedOverride('xenoHorror', {
    id: 'mus-predator',
    confidence: 'B',
    tempo: [96, 132],
    meter: { beats: 4, unit: 8, subdivisions: 3, accents: [1, 0.25, 0.25, 0.9, 0.25, 0.25, 0.7, 0.25, 0.55, 0.25, 0.65, 0.25] },
    scaleName: 'ritualMinor',
    scale: SCALE_LIBRARY.ritualMinor,
    rootMidi: 50,
    chords: [0, 3, 1, 4],
    instrumentation: ['tuned-toms', 'dry-snare', 'staccato-brass-synth', 'low-flute-sine', 'metal-clicks', 'thermal-synth'],
    density: 0.72,
    restChance: 0.18,
    waves: { lead: 'triangle', bass: 'square', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.5, 0.85, 0, 0.4, 0.7, 0, 0.55, 0, 0.65, 0],
      bass: [1, 0, 0, 0.8, 0, 0, 0.65, 0, 0, 0.7, 0, 0],
      drums: [1, 3, 3, 1, 3, 3, 2, 3, 3, 2, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'tracking', bars: 4, density: 0.5 },
      { name: 'camouflage', bars: 4, density: 0.4 },
      { name: 'ritual-hunt', bars: 6, density: 0.96 },
      { name: 'trophy', bars: 3, density: 0.64 }
    ],
    boss: { pattern: [1, 0, 0.45, 1, 0, 0.5, 0.8, 0, 0.5, 0.7, 0, 0.55], stinger: [0, 6, 7, 1, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.5, 0.75, 0.5, 0.75, 1.5] }
  }),
  'The Matrix': detailedOverride('cyberNetwork', {
    id: 'mus-the-matrix',
    confidence: 'A',
    tempo: [112, 146],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.25, 0.75, 0.2, 0.7, 0.25, 0.8, 0.2] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 54,
    chords: [0, 5, 1, 3],
    instrumentation: ['clustered-brass-synth', 'staccato-strings', 'prepared-piano', 'dry-breakbeat', 'fm-synth', 'data-pulses'],
    density: 0.8,
    patterns: {
      lead: [1, 0, 0.72, 0, 0.7, 0, 0.85, 0],
      bass: [1, 0, 0.55, 0, 0.9, 0, 0.5, 0],
      drums: [1, 3, 3, 2, 1, 3, 2, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'source-code', bars: 8, density: 0.62 },
      { name: 'simulation-pursuit', bars: 8, density: 1 },
      { name: 'choice', bars: 4, density: 0.44 },
      { name: 'reconfiguration', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.75, 0, 1, 0, 0.7, 0], stinger: [0, 6, 9, 1, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.5, 0.5, 0.5, 0.75, 1.5] }
  }),
  Portal: detailedOverride('cyberNetwork', {
    id: 'mus-portal',
    confidence: 'A',
    tempo: [92, 124],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.18, 0.55, 0.15, 0.8, 0.18, 0.5, 0.15] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 48,
    chords: [0, 1, 5, 3],
    instrumentation: ['synthetic-marimba', 'prepared-piano', 'modular-beeps', 'sine-bass', 'minimal-electronic-drums', 'servo-noise'],
    density: 0.58,
    restChance: 0.28,
    waves: { lead: 'square', bass: 'sine', pad: 'triangle', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.55, 0, 0.85, 0, 0.4, 0],
      bass: [1, 0, 0, 0, 0.75, 0, 0, 0],
      drums: [1, 3, 0, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'test', bars: 8, density: 0.5 },
      { name: 'solution', bars: 8, density: 0.72 },
      { name: 'facility-failure', bars: 4, density: 0.38 },
      { name: 'next-chamber', bars: 8, density: 0.8 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.8, 0, 0.45, 0], stinger: [0, 6, 8, 2, 12] },
    victory: { intervals: [0, 4, 6, 11, 12], beats: [0.45, 0.45, 0.6, 0.5, 1.4] }
  }),
  'Metal Gear': detailedOverride('stealthTactical', {
    id: 'mus-metal-gear',
    confidence: 'A',
    tempo: [86, 132],
    meter: { beats: 5, unit: 8, subdivisions: 2, accents: [1, 0.18, 0.45, 0.18, 0.72, 0.18, 0.38, 0.18, 0.62, 0.18] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 49,
    chords: [0, 1, 3, 5],
    instrumentation: ['pizzicato-string-synth', 'stealth-synth', 'muted-snare', 'muted-toms', 'fretless-bass-synth', 'low-piano', 'sonar-pulse'],
    density: 0.56,
    form: [
      { name: 'infiltration', bars: 8, density: 0.34 },
      { name: 'suspicion', bars: 4, density: 0.55 },
      { name: 'alert', bars: 8, density: 0.98 },
      { name: 'withdrawal', bars: 4, density: 0.45 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.55, 0, 1, 0, 0.45, 0], stinger: [0, 1, 7, 6, 13] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.5, 0.5, 0.75, 0.75, 1.5] }
  }),
  'Gears of War': detailedOverride('militarySciFi', {
    id: 'mus-gears-of-war',
    confidence: 'A',
    tempo: [96, 138],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.28, 0.48, 0.9, 0.3, 0.55] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 50,
    chords: [0, 4, 3, 5],
    instrumentation: ['low-brass-synth', 'string-ostinato', 'military-snare', 'heavy-toms', 'sub-synth', 'radio-noise', 'wordless-choir-pad'],
    density: 0.8,
    patterns: {
      lead: [1, 0, 0.65, 0.9, 0, 0.55],
      bass: [1, 0, 0, 0.85, 0, 0.45],
      drums: [1, 3, 2, 1, 3, 2],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'front-briefing', bars: 8, density: 0.48 },
      { name: 'squad-advance', bars: 8, density: 0.92 },
      { name: 'sacrifice', bars: 4, density: 0.5 },
      { name: 'counterattack', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.55, 1, 0, 0.7], stinger: [0, 7, 5, 10, 12] },
    victory: { intervals: [0, 5, 7, 10, 12], beats: [0.5, 0.5, 0.5, 0.75, 1.5] }
  }),
  'Chainsaw Man': detailedOverride('animeHeroic', {
    id: 'mus-chainsaw-man',
    confidence: 'A',
    tempo: [122, 162],
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 5, 1, 4],
    instrumentation: ['chamber-orchestra-synth', 'abrasive-guitar-oscillator', 'impact-toms', 'intimate-piano', 'wordless-choir-pad', 'unstable-synth'],
    density: 0.86,
    restChance: 0.12,
    form: [
      { name: 'uneasy-preparation', bars: 8, density: 0.48 },
      { name: 'devil-duel', bars: 8, density: 1.02 },
      { name: 'human-emotion', bars: 4, density: 0.42 },
      { name: 'violent-breakthrough', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.75, 0, 1, 0, 0.8, 0.4], stinger: [0, 6, 7, 3, 12] },
    victory: { intervals: [0, 3, 7, 9, 12], beats: [0.45, 0.45, 0.55, 0.55, 1.4] }
  }),
  'Demon Slayer': detailedOverride('animeHeroic', {
    id: 'mus-demon-slayer',
    confidence: 'A',
    tempo: [122, 162],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.25, 0.48, 0.86, 0.28, 0.52] },
    scaleName: 'ritualMinor',
    scale: SCALE_LIBRARY.ritualMinor,
    rootMidi: 50,
    chords: [0, 3, 4, 1],
    instrumentation: ['chamber-string-synth', 'plucked-string-oscillator', 'ritual-toms', 'piano', 'wordless-choir-pad', 'breath-noise'],
    density: 0.8,
    patterns: {
      lead: [1, 0, 0.62, 0.9, 0, 0.55],
      bass: [1, 0, 0, 0.8, 0, 0],
      drums: [1, 3, 3, 2, 3, 3],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'breathing-preparation', bars: 8, density: 0.5 },
      { name: 'blade-duel', bars: 8, density: 0.94 },
      { name: 'memory', bars: 4, density: 0.44 },
      { name: 'technique-release', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.6, 1, 0, 0.7], stinger: [0, 5, 8, 11, 12] },
    victory: { intervals: [0, 5, 7, 11, 12], beats: [0.6, 0.45, 0.65, 0.5, 1.5] }
  }),
  "JoJo's Bizarre Adventure": detailedOverride('animeHeroic', {
    id: 'mus-jojo-s-bizarre-adventure',
    confidence: 'A',
    tempo: [122, 162],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 50,
    chords: [0, 3, 5, 1],
    instrumentation: ['dramatic-brass-synth', 'electric-guitar-oscillator', 'syncopated-toms', 'piano-stabs', 'wordless-choir-pad', 'funk-bass-synth'],
    density: 0.9,
    patterns: {
      lead: [1, 0, 0.8, 0.45, 1, 0.35, 0.7, 0],
      bass: [1, 0, 0.55, 0, 0.9, 0, 0.5, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'pose-and-tension', bars: 6, density: 0.62 },
      { name: 'stand-duel', bars: 8, density: 1.02 },
      { name: 'tactical-reversal', bars: 4, density: 0.7 },
      { name: 'decisive-rush', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.7, 0, 1, 0, 0.75, 0.5], stinger: [0, 6, 10, 3, 12] },
    victory: { intervals: [0, 3, 7, 10, 12, 15], beats: [0.4, 0.45, 0.5, 0.45, 0.65, 1.4] }
  }),
  'Fullmetal Alchemist': detailedOverride('animeHeroic', {
    id: 'mus-fullmetal-alchemist',
    confidence: 'A',
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
    boss: { pattern: [1, 0, 0.6, 0, 1, 0, 0.7, 0], stinger: [0, 6, 9, 3, 12] },
    victory: { intervals: [0, 4, 7, 9, 12], beats: [0.5, 0.5, 0.6, 0.55, 1.5] }
  }),
  'Neon Genesis Evangelion': detailedOverride('militarySciFi', {
    id: 'mus-neon-genesis-evangelion',
    confidence: 'A',
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
    boss: { pattern: [1, 0, 0.55, 0, 1, 0, 0.65, 0, 0.5, 0], stinger: [0, 6, 1, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.5, 0.75, 0.5, 1.5] }
  }),
  Rammstein: detailedOverride('industrialMetal', {
    id: 'mus-rammstein',
    confidence: 'A',
    tempo: [104, 148],
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 4, 0],
    instrumentation: ['low-distorted-oscillator-guitar', 'saturated-bass', 'massive-drums', 'industrial-synth', 'struck-steel', 'nonlexical-low-voice-pad'],
    density: 0.9,
    patterns: {
      lead: [1, 0.7, 0, 0.8, 1, 0, 0.6, 0.85],
      bass: [1, 0.65, 0, 0.75, 1, 0, 0.55, 0.8],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'machine-riff-a', bars: 8, density: 0.9 },
      { name: 'pyro-riff-b', bars: 8, density: 1 },
      { name: 'steel-break', bars: 4, density: 0.58 },
      { name: 'frontline-refrain', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.8, 0, 1, 0, 0.75, 0.8], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.4, 0.45, 0.6, 0.5, 1.4] }
  }),
  'System of a Down': detailedOverride('industrialMetal', {
    id: 'mus-system-of-a-down',
    confidence: 'A',
    tempo: [108, 152],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.25, 0.65, 0.25, 0.82, 0.3, 0.58] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 5, 0],
    instrumentation: ['agile-distorted-oscillator-guitar', 'saturated-bass', 'sharp-drum-noise', 'angular-synth', 'struck-metal', 'nonlexical-voice-pad'],
    density: 0.94,
    patterns: {
      lead: [1, 0.75, 0, 1, 0.6, 0, 0.85],
      bass: [1, 0.65, 0, 0.9, 0.55, 0, 0.75],
      drums: [1, 3, 2, 1, 3, 2, 4],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'angular-riff-a', bars: 8, density: 0.92 },
      { name: 'tempo-rupture-b', bars: 8, density: 1.08 },
      { name: 'suspended-break', bars: 4, density: 0.48 },
      { name: 'collective-impact', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.8, 1, 0, 0.75, 0.7], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.35, 0.4, 0.55, 0.45, 1.35] }
  }),
  'Rob Zombie': detailedOverride('industrialMetal', {
    id: 'mus-rob-zombie',
    confidence: 'A',
    tempo: [104, 148],
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 40,
    chords: [0, 1, 4, 5],
    instrumentation: ['horror-guitar-oscillator', 'saturated-bass', 'massive-drums', 'grindhouse-synth', 'struck-steel', 'nonlexical-voice-pad'],
    density: 0.88,
    form: [
      { name: 'grindhouse-riff', bars: 8, density: 0.86 },
      { name: 'mechanical-stage', bars: 8, density: 1 },
      { name: 'horror-break', bars: 4, density: 0.55 },
      { name: 'monster-refrain', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.75, 0, 1, 0, 0.65, 0.8], stinger: [0, 1, 6, 10, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.45, 0.45, 0.6, 0.5, 1.4] }
  }),
  'Linkin Park': detailedOverride('industrialMetal', {
    id: 'mus-linkin-park',
    confidence: 'A',
    tempo: [104, 148],
    scaleName: 'minor',
    scale: SCALE_LIBRARY.minor,
    rootMidi: 40,
    chords: [0, 5, 3, 4],
    instrumentation: ['low-guitar-oscillator', 'saturated-bass', 'massive-drums', 'digital-synth', 'turntable-like-noise-pulses', 'wordless-voice-pad'],
    density: 0.86,
    patterns: {
      lead: [1, 0, 0.65, 0.35, 1, 0, 0.55, 0.4],
      bass: [1, 0, 0.45, 0, 1, 0, 0.5, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'hybrid-riff-a', bars: 8, density: 0.82 },
      { name: 'electronic-riff-b', bars: 8, density: 0.96 },
      { name: 'fragile-break', bars: 4, density: 0.42 },
      { name: 'instrumental-release', bars: 8, density: 1.04 }
    ],
    boss: { pattern: [1, 0, 0.6, 0, 1, 0, 0.7, 0], stinger: [0, 6, 7, 3, 12] },
    victory: { intervals: [0, 3, 7, 9, 12], beats: [0.5, 0.5, 0.6, 0.55, 1.45] }
  }),
  'Daft Punk': detailedOverride('electronicStage', {
    id: 'mus-daft-punk',
    confidence: 'A',
    tempo: [118, 136],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 45,
    chords: [0, 3, 5, 4],
    instrumentation: ['sidechain-sine-bass', 'analog-synth', 'wordless-vocoder-pad', 'dry-clap-noise', 'arpeggiator', 'hybrid-string-pad'],
    density: 0.84,
    form: [
      { name: 'filtered-intro', bars: 4, density: 0.4 },
      { name: 'club-a', bars: 8, density: 0.86 },
      { name: 'original-build', bars: 4, density: 0.7 },
      { name: 'synthetic-drop', bars: 8, density: 1.08 },
      { name: 'glass-break', bars: 4, density: 0.45 },
      { name: 'alive-return', bars: 8, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.8, 0, 0, 0, 1, 0, 0, 0, 0.8, 0, 0.55, 0], stinger: [0, 7, 10, 3, 12] },
    victory: { intervals: [0, 3, 7, 10, 12, 15], beats: [0.4, 0.4, 0.5, 0.45, 0.65, 1.35] }
  }),
  'Oliver Tree': detailedOverride('electronicStage', {
    id: 'mus-oliver-tree',
    confidence: 'B',
    tempo: [104, 142],
    scaleName: 'minor',
    scale: SCALE_LIBRARY.minor,
    rootMidi: 43,
    chords: [0, 5, 3, 4],
    instrumentation: ['compressed-guitar-oscillator', 'distorted-alt-pop-bass', 'dry-breakbeat-noise', 'detuned-piano', 'wide-synth-pad', 'scooter-bell-pulse'],
    density: 0.82,
    restChance: 0.14,
    patterns: {
      lead: [1, 0, 0.65, 0, 0.82, 0.35, 0, 0.58, 1, 0, 0.55, 0.3, 0.76, 0, 0.45, 0],
      bass: [1, 0, 0, 0, 0.78, 0, 0.42, 0, 1, 0, 0, 0, 0.68, 0, 0.38, 0],
      drums: [1, 3, 3, 3, 2, 3, 4, 3, 1, 3, 3, 4, 2, 3, 3, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'demolition-intro', bars: 4, density: 0.5 },
      { name: 'ramp-run', bars: 8, density: 0.92 },
      { name: 'awkward-break', bars: 4, density: 0.42 },
      { name: 'scooter-surge', bars: 8, density: 1.05 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.72, 0, 0.42, 0, 1, 0, 0, 0.45, 0.82, 0, 0.5, 0], stinger: [0, 3, 7, 6, 12] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.4, 0.4, 0.5, 0.45, 0.7, 1.35] }
  }),
  'Hazbin Hotel': detailedOverride('comedyOddity', {
    id: 'mus-hazbin-hotel',
    confidence: 'B',
    tempo: [96, 144],
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 48,
    chords: [0, 4, 1, 5],
    instrumentation: ['cabaret-piano-synth', 'upright-bass-synth', 'muted-brass-synth', 'brushed-drum-noise', 'theater-organ-pad', 'infernal-bell', 'wordless-ensemble-pad'],
    density: 0.8,
    restChance: 0.14,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.72, 0.35, 0.9, 0, 0.58, 0.42],
      bass: [1, 0, 0.52, 0, 0.82, 0, 0.48, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'lobby-overture', bars: 6, density: 0.54 },
      { name: 'pentagram-cabaret', bars: 8, density: 0.94 },
      { name: 'redemption-bridge', bars: 4, density: 0.46 },
      { name: 'infernal-finale', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.65, 0, 1, 0.4, 0.72, 0], stinger: [0, 6, 10, 3, 12] },
    victory: { intervals: [0, 4, 7, 11, 12, 16], beats: [0.4, 0.45, 0.5, 0.45, 0.65, 1.35] }
  }),
  Vocaloid: detailedOverride('electronicStage', {
    id: 'mus-vocaloid',
    confidence: 'B',
    tempo: [124, 164],
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 54,
    chords: [0, 4, 1, 5],
    instrumentation: ['bright-pulse-lead', 'sidechain-sine-bass', 'glass-marimba', 'rapid-arpeggiator', 'four-on-floor-noise-kit', 'wordless-formant-pad', 'digital-crowd-pulse'],
    density: 0.9,
    restChance: 0.08,
    patterns: {
      lead: [1, 0, 0.62, 0.35, 0.88, 0, 0.55, 0.3, 1, 0, 0.68, 0.4, 0.82, 0.3, 0.5, 0],
      bass: [1, 0, 0, 0, 0.78, 0, 0, 0, 1, 0, 0.42, 0, 0.76, 0, 0, 0],
      drums: [1, 3, 3, 3, 2, 3, 3, 4, 1, 3, 3, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'projection-intro', bars: 4, density: 0.52 },
      { name: 'digital-stage-a', bars: 8, density: 0.96 },
      { name: 'audience-build', bars: 4, density: 0.78 },
      { name: 'mirai-release', bars: 8, density: 1.1 },
      { name: 'encore-return', bars: 4, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0.45, 0.82, 0, 0.52, 0, 1, 0, 0.42, 0, 0.86, 0, 0.58, 0], stinger: [0, 6, 11, 4, 12] },
    victory: { intervals: [0, 4, 6, 11, 12, 16], beats: [0.35, 0.4, 0.45, 0.45, 0.65, 1.3] }
  }),
  Splatterhouse: detailedOverride('survivalHorror', {
    id: 'mus-splatterhouse',
    confidence: 'B',
    tempo: [66, 118],
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 39,
    chords: [0, 1, 5, 2],
    instrumentation: ['detuned-organ-synth', 'prepared-piano', 'low-string-drone', 'struck-chain-noise', 'arcade-toms', 'subharmonic-pulse'],
    density: 0.58,
    restChance: 0.3,
    patterns: {
      lead: [1, 0, 0.45, 0, 0.72, 0, 0.35, 0],
      bass: [1, 0, 0, 0, 0.8, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'west-mansion', bars: 8, density: 0.32 },
      { name: 'mask-awakening', bars: 4, density: 0.68 },
      { name: 'brutal-advance', bars: 8, density: 1 },
      { name: 'altar-breath', bars: 4, density: 0.45 }
    ],
    boss: { pattern: [1, 0, 0, 0, 1, 0, 0.65, 0], stinger: [0, 1, 6, 7, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.6, 0.5, 0.75, 0.6, 1.5] }
  }),
  'Streets of Rage': detailedOverride('retroArcade', {
    id: 'mus-streets-of-rage',
    confidence: 'B',
    tempo: [118, 156],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 45,
    chords: [0, 3, 5, 4],
    instrumentation: ['fm-style-bass-synth', 'pulse-lead', 'pcm-style-drum-noise', 'digital-marimba', 'short-house-chord', 'urban-noise-pulse'],
    density: 0.9,
    restChance: 0.1,
    patterns: {
      lead: [1, 0, 0.72, 0.4, 1, 0.35, 0.68, 0],
      bass: [1, 0.55, 0, 0.7, 1, 0.45, 0, 0.72],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'wood-oak-intro', bars: 4, density: 0.64 },
      { name: 'street-brawl-a', bars: 8, density: 0.98 },
      { name: 'syndicate-break', bars: 4, density: 0.62 },
      { name: 'street-brawl-b', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.72, 0, 1, 0.45, 0.8, 0], stinger: [0, 3, 7, 10, 12] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.35, 0.4, 0.5, 0.45, 0.65, 1.3] }
  }),
  'Toy Soldiers': detailedOverride('militarySciFi', {
    id: 'mus-toy-soldiers',
    confidence: 'B',
    tempo: [94, 130],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.25, 0.5, 0.86, 0.28, 0.52] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 50,
    chords: [0, 4, 3, 5],
    instrumentation: ['miniature-brass-synth', 'tin-drum-noise', 'toy-piano', 'clockwork-tick', 'small-string-ostinato', 'wooden-table-resonance'],
    density: 0.72,
    patterns: {
      lead: [1, 0, 0.58, 0.82, 0, 0.48],
      bass: [1, 0, 0, 0.78, 0, 0],
      drums: [1, 3, 3, 2, 3, 3],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'tabletop-briefing', bars: 6, density: 0.46 },
      { name: 'trench-advance', bars: 8, density: 0.88 },
      { name: 'wind-up-respite', bars: 4, density: 0.42 },
      { name: 'toybox-counterattack', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.5, 1, 0, 0.68], stinger: [0, 5, 7, 10, 12] },
    victory: { intervals: [0, 5, 7, 9, 12], beats: [0.55, 0.45, 0.55, 0.6, 1.4] }
  }),
  'Zombies Ate My Neighbors': detailedOverride('retroArcade', {
    id: 'mus-zombies-ate-my-neighbors',
    confidence: 'B',
    tempo: [116, 154],
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 48,
    chords: [0, 3, 1, 5],
    instrumentation: ['cartoon-organ-pulse', 'chip-bass', 'noise-drum-kit', 'theremin-style-sine', 'b-movie-brass-stab', 'suburban-doorbell-pulse'],
    density: 0.86,
    restChance: 0.12,
    patterns: {
      lead: [1, 0.72, 0, 0.5, 1, 0.62, 0.38, 0],
      bass: [1, 0, 0.6, 0, 1, 0, 0.52, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'zombie-panic', bars: 6, density: 0.76 },
      { name: 'neighbor-rescue', bars: 8, density: 0.98 },
      { name: 'backyard-breath', bars: 4, density: 0.5 },
      { name: 'b-movie-surge', bars: 8, density: 1.06 }
    ],
    boss: { pattern: [1, 0, 0.7, 0, 1, 0.45, 0.82, 0], stinger: [0, 6, 7, 3, 12] },
    victory: { intervals: [0, 4, 7, 10, 12, 16], beats: [0.35, 0.4, 0.5, 0.45, 0.65, 1.3] }
  }),
  'Spy x Family': detailedOverride('stealthTactical', {
    id: 'mus-spy-x-family',
    confidence: 'B',
    tempo: [102, 144],
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 53,
    chords: [0, 3, 4, 1],
    instrumentation: ['pizzicato-chamber-synth', 'brushed-snare-noise', 'muted-brass-synth', 'celesta-pulse', 'upright-bass-synth', 'covert-clock-tick', 'wordless-family-pad'],
    density: 0.76,
    restChance: 0.18,
    patterns: {
      lead: [1, 0, 0.62, 0.35, 0.82, 0, 0.48, 0.28],
      bass: [1, 0, 0.42, 0, 0.76, 0, 0.36, 0],
      drums: [1, 3, 0, 3, 2, 3, 4, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'eden-briefing', bars: 6, density: 0.5 },
      { name: 'covert-tail', bars: 8, density: 0.88 },
      { name: 'family-breath', bars: 4, density: 0.42 },
      { name: 'operation-strix-surge', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.52, 0, 1, 0.38, 0.72, 0], stinger: [0, 3, 7, 6, 12] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.4, 0.45, 0.5, 0.5, 0.7, 1.35] }
  }),
  'War of the Worlds': detailedOverride('militarySciFi', {
    id: 'mus-war-of-the-worlds',
    confidence: 'B',
    tempo: [72, 126],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.42, 0.14, 0.74, 0.16, 0.34, 0.14, 0.62, 0.16] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 43,
    chords: [0, 1, 5, 2],
    instrumentation: ['low-brass-pressure-synth', 'bowed-metal-drone', 'distant-impact-toms', 'storm-noise', 'tremolo-string-synth', 'ash-wind-noise', 'subsonic-machine-resonance'],
    density: 0.58,
    restChance: 0.3,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.38, 0, 0, 0.64, 0, 0.3, 0],
      bass: [1, 0, 0, 0, 0, 0.72, 0, 0, 0, 0],
      drums: [1, 0, 3, 0, 0, 2, 0, 4, 0, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'buried-rumble', bars: 6, density: 0.3 },
      { name: 'street-flight', bars: 8, density: 0.82 },
      { name: 'basement-silence', bars: 4, density: 0.24 },
      { name: 'tripod-onslaught', bars: 8, density: 1.04 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.62, 0, 1, 0, 0, 0.5], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.6, 0.75, 0.55, 1.6] }
  }),
  Ghostbusters: detailedOverride('comedyOddity', {
    id: 'mus-ghostbusters',
    confidence: 'B',
    tempo: [112, 148],
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 48,
    chords: [0, 4, 1, 5],
    instrumentation: ['elastic-bass-synth', 'paranormal-sine-pulse', 'theater-organ-synth', 'dry-brass-stab-synth', 'electro-drum-noise', 'proton-click-noise', 'wordless-choir-pad'],
    density: 0.84,
    restChance: 0.12,
    patterns: {
      lead: [1, 0, 0.7, 0.38, 0.92, 0, 0.56, 0.42],
      bass: [1, 0.52, 0, 0.42, 0.88, 0, 0.48, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'firehouse-call', bars: 6, density: 0.58 },
      { name: 'ectoplasm-chase', bars: 8, density: 0.96 },
      { name: 'containment-warning', bars: 4, density: 0.52 },
      { name: 'rooftop-crossrip', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.68, 0, 1, 0.45, 0.78, 0], stinger: [0, 6, 10, 3, 12] },
    victory: { intervals: [0, 4, 7, 11, 12, 16], beats: [0.35, 0.4, 0.5, 0.45, 0.7, 1.3] }
  }),
  Tremors: detailedOverride('xenoHorror', {
    id: 'mus-tremors',
    confidence: 'B',
    tempo: [90, 134],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.22, 0.48, 0.84, 0.26, 0.54] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 45,
    chords: [0, 1, 4, 3],
    instrumentation: ['dry-desert-guitar-oscillator', 'hand-tom-noise', 'tremolo-low-string-synth', 'underground-rumble', 'corrugated-metal-hit', 'whistling-wind-noise', 'low-harmonica-like-synth'],
    density: 0.68,
    restChance: 0.24,
    patterns: {
      lead: [1, 0, 0.48, 0.76, 0, 0.42],
      bass: [1, 0, 0, 0.82, 0, 0],
      drums: [1, 3, 0, 2, 3, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'desert-stillness', bars: 6, density: 0.34 },
      { name: 'ground-ripple', bars: 8, density: 0.76 },
      { name: 'rock-island-stand', bars: 4, density: 0.5 },
      { name: 'graboid-breakout', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.45, 1, 0, 0.7], stinger: [0, 1, 5, 8, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.55, 0.45, 0.65, 0.55, 1.45] }
  }),
  'Cyberpunk: Edgerunners': detailedOverride('cyberNetwork', {
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
  }),
  Parasyte: detailedOverride('xenoHorror', {
    id: 'mus-parasyte',
    confidence: 'B',
    tempo: [92, 142],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.5, 0.18, 0.76, 0.16, 0.42, 0.16, 0.64, 0.18] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 46,
    chords: [0, 1, 4, 2],
    instrumentation: ['elastic-string-synth', 'wet-percussion-noise', 'heartbeat-sub', 'school-bell-fragment', 'cold-piano-pulse', 'blade-swish-noise', 'human-memory-pad'],
    density: 0.7,
    restChance: 0.23,
    patterns: {
      lead: [1, 0, 0.4, 0, 0.72, 0, 0, 0.52, 0, 0.32],
      bass: [1, 0, 0, 0, 0.76, 0, 0, 0, 0.48, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0, 3, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'ordinary-morning', bars: 6, density: 0.32 },
      { name: 'right-hand-awakening', bars: 8, density: 0.72 },
      { name: 'human-question', bars: 4, density: 0.3 },
      { name: 'parasite-counterstrike', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0, 0.54, 0, 1, 0, 0, 0.7, 0], stinger: [0, 1, 7, 6, 12] },
    victory: { intervals: [0, 3, 7, 8, 12], beats: [0.6, 0.45, 0.65, 0.55, 1.5] }
  }),
  Uzumaki: detailedOverride('psychologicalHorror', {
    id: 'mus-uzumaki',
    confidence: 'B',
    tempo: [58, 108],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.12, 0.34, 0.1, 0.58, 0.12, 0.42, 0.1, 0.72, 0.12] },
    scaleName: 'wholeTone',
    scale: SCALE_LIBRARY.wholeTone,
    rootMidi: 41,
    chords: [0, 1, 2, 1],
    instrumentation: ['spiral-organ-drone', 'bowed-metal-synth', 'distant-sea-noise', 'wood-creak-pulse', 'detuned-bell', 'breath-noise', 'subterranean-rumble'],
    density: 0.48,
    restChance: 0.34,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.3, 0, 0, 0.48, 0, 0.24, 0],
      bass: [1, 0, 0, 0, 0, 0.62, 0, 0, 0, 0],
      drums: [1, 0, 0, 3, 0, 2, 0, 0, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'fogbound-town', bars: 8, density: 0.24 },
      { name: 'pattern-recognition', bars: 8, density: 0.52 },
      { name: 'coiling-street', bars: 6, density: 0.68 },
      { name: 'spiral-city-collapse', bars: 8, density: 0.94 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.46, 0, 0, 0, 0.78, 0], stinger: [0, 2, 6, 8, 12] },
    victory: { intervals: [0, 2, 6, 8, 12], beats: [0.8, 0.7, 0.85, 0.65, 1.7] }
  })
};

const LOOKUP_ALIASES = {
  nexus: 'Nexus de Convergence',
  'nexus de convergence': 'Nexus de Convergence',
  matrix: 'The Matrix',
  'the matrix': 'The Matrix',
  'resident evil': 'Resident Evil',
  'silent hill': 'Silent Hill',
  'system of a down': 'System of a Down',
  soad: 'System of a Down',
  'cyberpunk edgerunners': 'Cyberpunk: Edgerunners',
  'jojo bizarre adventure': "JoJo's Bizarre Adventure",
  'jojos bizarre adventure': "JoJo's Bizarre Adventure",
  'jo jo bizarre adventure': "JoJo's Bizarre Adventure",
  evangelion: 'Neon Genesis Evangelion',
  'full metal alchemist': 'Fullmetal Alchemist'
};

const FAMILY_RULES = [
  { id: 'psychologicalHorror', test: /silent|uzumaki|ring|grudge|sinister|another|siren head|exit 8|hell house|from\b/ },
  { id: 'xenoHorror', test: /alien|predator|prometheus|xenomorph|yautja|thing\b|cloverfield|tremor|kaiju/ },
  { id: 'survivalHorror', test: /resident evil|biohazard|zombie|chucky|saw\b|terrifier|evil dead|hellraiser|dead space|house of the dead|puppet master|collector|rec\b|toxic avenger/ },
  { id: 'stealthTactical', test: /metal gear|splinter|stealth|spy\b|tactical|infiltration/ },
  { id: 'industrialMetal', test: /rammstein|system of a down|rob zombie|linkin park|metal\b|doom|tenacious|buckethead|little big|aural vampire/ },
  { id: 'electronicStage', test: /daft punk|vocaloid|concert|music|stage|moonwalker|michael jackson|blackpink|babymetal/ },
  { id: 'cyberNetwork', test: /matrix|cyber|digital|ghost in the shell|gunnm|chappie|tron|portal|computer|robot|m3gan|edgerunners|psycho-pass/ },
  { id: 'militarySciFi', test: /halo|gears|stargate|star wars|mass effect|starship|war of the worlds|defiance|metal slug|xcom|soldier|war\b|evangelion|gundam/ },
  { id: 'animeHeroic', test: /chainsaw|demon slayer|jojo|fullmetal|naruto|boruto|dragon ball|one punch|solo leveling|frieren|tokyo ghoul|cowboy bebop|dandadan|death note|sword art|attack on titan|inuyasha|negima|tanya|spy x family|dungeon meshi|overlord|gantz|elfen lied|devilman|deadman|mashle|cells at work/ },
  { id: 'arcaneFantasy', test: /fantasy|magic|discworld|kaamelott|dungeon|hazbin|frieren|inuyasha|spirited away|chihiro|lord of the rings|harry potter|spawn|overlord/ },
  { id: 'comedyOddity', test: /comedy|spoof|scary movie|kaamelott|cafe|inconnus|cite de la peur|visiteurs|tuche|pingu|sausage|rubber|velocipastor|killer tomato|sharknado|pee wee|kun pow|h2g2|feebles|roger rabbit|saturnin|solar opposites/ },
  { id: 'retroArcade', test: /arcade|retro|pixel|nes|onechanbara|yugioh|yu-gi-oh|street fighter|tekken|mortal kombat|blazblue|guilty gear/ }
];

const STATE_MODIFIERS = {
  hub: { tempo: 0.82, density: 0.52, percussion: 0.4, formScale: 0.5 },
  grid: { tempo: 0.86, density: 0.48, percussion: 0.45, formScale: 0.42 },
  battle: { tempo: 1, density: 1, percussion: 1, formScale: 1 },
  boss: { tempo: 1.08, density: 1.2, percussion: 1.2, formScale: 0.72, bossLayer: true, stinger: 'boss' },
  race: { tempo: 1.07, density: 1.08, percussion: 1.12, formScale: 0.7 },
  lastLap: { tempo: 1.17, density: 1.22, percussion: 1.28, formScale: 0.48, stinger: 'boss' },
  result: { tempo: 0.84, density: 0.5, percussion: 0.42, formScale: 0.36, stinger: 'victory' },
  victory: { tempo: 0.92, density: 0.58, percussion: 0.5, formScale: 0.32, stinger: 'victory' },
  defeat: { tempo: 0.72, density: 0.36, percussion: 0.25, formScale: 0.32, stinger: 'defeat' }
};

const MODE_MODIFIERS = {
  rpg: { tempo: 0.96, density: 0.94 },
  tactics: { tempo: 0.9, density: 0.84 },
  smash: { tempo: 1.08, density: 1.08 },
  fighter: { tempo: 1.06, density: 1.1 },
  combat: { tempo: 1.06, density: 1.08 },
  fps: { tempo: 1.04, density: 1.04 },
  race: { tempo: 1.06, density: 1.06 }
};

const toLookupKey = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' and ')
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .trim()
  .toLowerCase();

export const normalizeMusicUniverse = value => {
  const raw = String(value || '').trim();
  if (!raw) return 'Nexus de Convergence';
  const key = toLookupKey(raw);
  if (LOOKUP_ALIASES[key]) return LOOKUP_ALIASES[key];
  if (/^resident evil(?:\b| )/.test(key)) return 'Resident Evil';
  if (/^silent hill(?:\b| )/.test(key)) return 'Silent Hill';
  if (/^halo(?:\b| )/.test(key)) return 'Halo';
  if (/^doom(?:\b| )/.test(key)) return 'Doom';
  if (/^(?:alien|aliens)(?:\b| )/.test(key) && !key.includes('predator')) return 'Alien';
  if (/^(?:the )?predator(?:\b| )/.test(key)) return 'Predator';
  if (/^the matrix(?:\b| )/.test(key)) return 'The Matrix';
  if (/^portal(?:\b| )/.test(key)) return 'Portal';
  if (/^metal gear(?:\b| )/.test(key) && !key.includes('rising')) return 'Metal Gear';
  return raw;
};

export const hashMusicSeed = value => {
  let hash = 2166136261;
  for (const char of String(value ?? '')) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 1;
};

const createRng = seed => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const resolveFamilyId = stage => {
  const context = toLookupKey([
    stage?.universe,
    ...(Array.isArray(stage?.sourceUniverses) ? stage.sourceUniverses : []),
    stage?.name,
    stage?.family,
    ...(Array.isArray(stage?.tags) ? stage.tags : [])
  ].filter(Boolean).join(' '));
  return FAMILY_RULES.find(rule => rule.test.test(context))?.id || 'nexusArchive';
};

const resolveUniverseProfile = (universe, stage) => {
  const normalized = normalizeMusicUniverse(universe);
  if (MUSIC_PROFILE_OVERRIDES[normalized]) return MUSIC_PROFILE_OVERRIDES[normalized];
  return MUSIC_PROFILE_FAMILIES[resolveFamilyId({ ...stage, universe: normalized, sourceUniverses: [] })] || MUSIC_PROFILE_FAMILIES.nexusArchive;
};

const blendProfiles = (profiles, universes) => {
  const primary = profiles[0] || MUSIC_PROFILE_FAMILIES.nexusArchive;
  if (profiles.length < 2) return primary;
  const secondary = profiles[1];
  return mergeProfile(primary, {
    id: `fusion-${profiles.map(profile => profile.id).join('-')}`,
    family: `${primary.family}+${secondary.family}`,
    confidence: profiles.every(profile => profile.confidence === 'A' || profile.confidence === 'A-OC' || profile.confidence === 'B')
      ? 'fusion-trusted'
      : 'fusion-family',
    tempo: [
      Math.round((primary.tempo[0] * 2 + secondary.tempo[0]) / 3),
      Math.round((primary.tempo[1] * 2 + secondary.tempo[1]) / 3)
    ],
    instrumentation: [...new Set([...primary.instrumentation.slice(0, 4), ...secondary.instrumentation.slice(0, 3)])],
    density: Math.min(1, (primary.density * 2 + secondary.density) / 3 + 0.04),
    waves: { ...primary.waves, bass: secondary.waves.bass, boss: secondary.waves.boss },
    filters: {
      ...primary.filters,
      bass: Math.round((primary.filters.bass + secondary.filters.bass) / 2),
      boss: Math.round((primary.filters.boss + secondary.filters.boss) / 2)
    },
    boss: {
      ...primary.boss,
      wave: secondary.boss.wave || secondary.waves.boss,
      stinger: [...primary.boss.stinger.slice(0, 3), ...secondary.boss.stinger.slice(-2)]
    },
    sourceLabel: universes.join(' / ')
  });
};

const normalizeState = value => {
  const key = toLookupKey(value);
  if (key === 'countdown' || key === 'preflight' || key === 'starting grid') return 'grid';
  if (key === 'running' || key === 'kart') return 'race';
  if (key === 'last lap' || key === 'finallap') return 'lastLap';
  if (key === 'finished' || key === 'results') return 'result';
  if (key === 'combat') return 'battle';
  return STATE_MODIFIERS[value] ? value : 'battle';
};

const scaleDegreeToMidi = (rootMidi, scale, degree, octave = 0) => {
  const length = Math.max(1, scale.length);
  const wrapped = ((degree % length) + length) % length;
  const octaveShift = Math.floor(degree / length);
  return rootMidi + scale[wrapped] + (octave + octaveShift) * 12;
};

const getSourceUniverses = stage => {
  if (stage?.dlcSuppressedArena || stage?.forceBaseArena || stage?.musicSuppressed) {
    return ['Nexus de Convergence'];
  }
  const raw = Array.isArray(stage?.sourceUniverses) && stage.sourceUniverses.length
    ? stage.sourceUniverses
    : [stage?.universe];
  const normalized = raw.map(normalizeMusicUniverse).filter(Boolean);
  return [...new Set(normalized.length ? normalized : ['Nexus de Convergence'])];
};

const getBossKey = stage => String(
  stage?.bossName
  || stage?.worldBoss?.name
  || stage?.boss?.name
  || stage?.boss
  || ''
).trim();

const buildSequence = (profile, seed, stateConfig, modeConfig) => {
  const rng = createRng(seed);
  const meter = profile.meter;
  const stepsPerBar = meter.beats * meter.subdivisions;
  const formScale = stateConfig.formScale || 1;
  const sections = profile.form.map(section => ({
    ...section,
    bars: Math.max(1, Math.round(section.bars * formScale))
  }));
  const density = Math.min(1.25, profile.density * stateConfig.density * modeConfig.density);
  let melodyDegree = Math.floor(rng() * profile.scale.length);
  let absoluteBar = 0;
  const steps = [];

  sections.forEach(section => {
    for (let bar = 0; bar < section.bars; bar += 1) {
      const chordDegree = profile.chords[absoluteBar % profile.chords.length] || 0;
      for (let stepInBar = 0; stepInBar < stepsPerBar; stepInBar += 1) {
        const patternIndex = stepInBar % profile.patterns.lead.length;
        const pulse = profile.patterns.lead[patternIndex] || 0;
        const sectionDensity = Math.max(0.08, density * section.density);
        const allowLead = pulse > 0 && rng() < Math.min(0.98, pulse * sectionDensity) && rng() > profile.restChance;
        if (allowLead) {
          const directionRoll = rng();
          melodyDegree += directionRoll < 0.18 ? -2 : directionRoll < 0.46 ? -1 : directionRoll < 0.7 ? 0 : directionRoll < 0.9 ? 1 : 2;
          melodyDegree = Math.max(-profile.scale.length, Math.min(profile.scale.length * 2, melodyDegree));
        }
        const bassPulse = profile.patterns.bass[stepInBar % profile.patterns.bass.length] || 0;
        const padPulse = profile.patterns.pad[stepInBar % profile.patterns.pad.length] || 0;
        const drumCode = profile.patterns.drums[stepInBar % profile.patterns.drums.length] || 0;
        const bossPulse = profile.boss.pattern[stepInBar % profile.boss.pattern.length] || 0;
        const accent = meter.accents?.[stepInBar % meter.accents.length] || 0.35;
        const padStart = stepInBar === 0 && absoluteBar % Math.max(1, profile.padEveryBars) === 0 && padPulse > 0;
        steps.push({
          section: section.name,
          accent,
          lead: allowLead ? scaleDegreeToMidi(profile.rootMidi, profile.scale, melodyDegree, 1) : null,
          bass: bassPulse > 0 && rng() < Math.min(1, bassPulse * density)
            ? scaleDegreeToMidi(profile.rootMidi, profile.scale, chordDegree, -1)
            : null,
          chord: padStart
            ? [
                scaleDegreeToMidi(profile.rootMidi, profile.scale, chordDegree, 0),
                scaleDegreeToMidi(profile.rootMidi, profile.scale, chordDegree + 2, 0),
                scaleDegreeToMidi(profile.rootMidi, profile.scale, chordDegree + 4, 0)
              ]
            : null,
          drum: drumCode > 0 && rng() < Math.min(1, density * stateConfig.percussion) ? drumCode : 0,
          boss: bossPulse > 0
            ? scaleDegreeToMidi(profile.rootMidi, profile.scale, chordDegree, profile.boss.octave || -1)
            : null
        });
      }
      absoluteBar += 1;
    }
  });
  return { sections, steps, stepsPerBar };
};

export const resolveStageMusicProfile = (stage = {}, requestedState = 'battle') => {
  const state = normalizeState(requestedState || stage.musicState);
  const sourceUniverses = getSourceUniverses(stage);
  const profiles = sourceUniverses.map(universe => resolveUniverseProfile(universe, stage));
  const profile = blendProfiles(profiles, sourceUniverses);
  const mode = String(stage.mode || 'RPG');
  const modeKey = toLookupKey(mode);
  const modeConfig = MODE_MODIFIERS[modeKey] || { tempo: 1, density: 1 };
  const stateConfig = STATE_MODIFIERS[state] || STATE_MODIFIERS.battle;
  const bossKey = getBossKey(stage);
  const hasBoss = Boolean(
    bossKey
    || stage.isBoss
    || stage.bossActive
    || stage.finalGameBoss
    || stage.worldBoss
    || (Array.isArray(stage.tags) && stage.tags.includes('bossArena'))
  );
  const seedSource = [
    stage.id || 'unknown-stage',
    stage.name || 'unnamed-stage',
    sourceUniverses.join('+'),
    mode,
    bossKey || 'no-boss',
    state
  ].join('|');
  const seed = hashMusicSeed(seedSource);
  const tempoRng = createRng(seed ^ 0xA53C9E71);
  const tempoBase = profile.tempo[0] + (profile.tempo[1] - profile.tempo[0]) * tempoRng();
  const tempo = Math.max(48, Math.min(196, Math.round(tempoBase * modeConfig.tempo * stateConfig.tempo)));
  const sequence = buildSequence(profile, seed, stateConfig, modeConfig);
  const bossLayerEnabled = Boolean(stateConfig.bossLayer || stage.bossActive || stage.finalGameBoss);
  const key = [
    profile.id,
    sourceUniverses.join('+'),
    modeKey || 'rpg',
    state,
    seed,
    bossLayerEnabled ? 'boss-layer' : 'base-layer'
  ].join('|');

  return {
    key,
    seed,
    profileId: profile.id,
    family: profile.family,
    confidence: profile.confidence,
    sourcePolicy: profile.sourcePolicy,
    universe: sourceUniverses[0],
    sourceUniverses,
    mode,
    state,
    hasBoss,
    bossKey,
    bossLayerEnabled,
    tempo,
    meter: { ...profile.meter },
    scaleName: profile.scaleName,
    tonalCenterMidi: profile.rootMidi,
    instrumentation: [...profile.instrumentation],
    density: Math.min(1.25, profile.density * stateConfig.density * modeConfig.density),
    waves: { ...profile.waves },
    filters: { ...profile.filters },
    gains: { ...profile.gains },
    sections: sequence.sections,
    stepsPerBar: sequence.stepsPerBar,
    steps: sequence.steps,
    stepDurationBeats: (4 / profile.meter.unit) / profile.meter.subdivisions,
    stinger: stateConfig.stinger,
    boss: {
      ...profile.boss,
      stinger: [...profile.boss.stinger]
    },
    victory: {
      ...profile.victory,
      intervals: [...profile.victory.intervals],
      beats: [...profile.victory.beats]
    }
  };
};

export const NEXUS_MUSIC_PROFILE = MUSIC_PROFILE_OVERRIDES['Nexus de Convergence'];
