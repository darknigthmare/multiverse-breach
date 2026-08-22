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
  },
  modeProfiles: {
    ...(base.modeProfiles || {}),
    ...(override.modeProfiles || {})
  },
  encounterProfiles: {
    ...(base.encounterProfiles || {}),
    ...(override.encounterProfiles || {})
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
  'Thalassa Mnémique': detailedOverride('nexusArchive', {
    id: 'mus-thalassa-mnemique',
    confidence: 'A-OC',
    sourcePolicy: 'original-procedural-only',
    tempo: [70, 108],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.38, 0.14, 0.7, 0.18, 0.34, 0.14, 0.58, 0.2] },
    scaleName: 'suspended',
    scale: SCALE_LIBRARY.suspended,
    rootMidi: 45,
    chords: [0, 3, 1, 4],
    instrumentation: ['submerged-glass-bell', 'pressure-hull-bass', 'mnemonic-sonar', 'waterphone-synth', 'breath-choir-pad', 'brass-lock-percussion'],
    density: 0.5,
    restChance: 0.3,
    padEveryBars: 2,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 1850, bass: 330, pad: 920, boss: 590, noise: 2700 },
    gains: { lead: 0.035, bass: 0.045, pad: 0.021, drums: 0.029, boss: 0.027 },
    patterns: {
      lead: [1, 0, 0, 0.42, 0, 0.72, 0, 0, 0.36, 0],
      bass: [1, 0, 0, 0, 0.62, 0, 0, 0, 0, 0],
      drums: [1, 0, 3, 0, 0, 2, 0, 4, 0, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'drowned-testimony', bars: 5, density: 0.28 },
      { name: 'archive-current', bars: 8, density: 0.58 },
      { name: 'names-return', bars: 5, density: 0.72 },
      { name: 'leviathan-rise', bars: 6, density: 0.94 }
    ],
    boss: { wave: 'sawtooth', gain: 0.028, octave: -1, pattern: [1, 0, 0, 0, 0.65, 0, 1, 0, 0, 0], stinger: [0, 5, 3, 10, 12] },
    victory: { wave: 'sine', intervals: [0, 2, 7, 10, 12], beats: [0.75, 0.5, 0.75, 0.75, 1.75] }
  }),
  'Méridien Creux': detailedOverride('cyberNetwork', {
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
  }),
  'Viridienne Ultime': detailedOverride('arcaneFantasy', {
    id: 'mus-viridienne-ultime',
    confidence: 'A-OC',
    sourcePolicy: 'original-procedural-only',
    tempo: [92, 132],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.28, 0.5, 0.84, 0.3, 0.56] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 53,
    chords: [0, 1, 4, 5],
    instrumentation: ['root-harp-pluck', 'seed-glass-marimba', 'leaf-breath-pad', 'orbit-frame-drum', 'comet-bell', 'photosynthetic-bass'],
    density: 0.66,
    restChance: 0.2,
    padEveryBars: 2,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sine', boss: 'sawtooth' },
    filters: { lead: 2550, bass: 450, pad: 1760, boss: 730, noise: 2300 },
    gains: { lead: 0.041, bass: 0.039, pad: 0.023, drums: 0.032, boss: 0.027 },
    patterns: {
      lead: [1, 0, 0.58, 0.86, 0, 0.48],
      bass: [1, 0, 0, 0.7, 0, 0],
      drums: [1, 3, 4, 2, 3, 4],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'star-seed-germination', bars: 6, density: 0.38 },
      { name: 'branching-orbits', bars: 8, density: 0.7 },
      { name: 'federated-roots', bars: 6, density: 0.82 },
      { name: 'many-suns-bloom', bars: 8, density: 1 }
    ],
    boss: { wave: 'sawtooth', gain: 0.027, octave: -1, pattern: [1, 0, 0.64, 0, 1, 0.52], stinger: [0, 6, 11, 7, 14] },
    victory: { wave: 'triangle', intervals: [0, 4, 7, 11, 14], beats: [0.6, 0.5, 0.75, 0.55, 1.6] }
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
  'Dragon Ball Z': detailedOverride('animeHeroic', {
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
  }),
  'Tokyo Ghoul': detailedOverride('animeHeroic', {
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
  }),
  'Fullmetal Alchemist': detailedOverride('animeHeroic', {
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
  }),
  'Neon Genesis Evangelion': detailedOverride('militarySciFi', {
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
  }),
  'Steins;Gate': detailedOverride('cyberNetwork', {
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
  'Heavy Metal 2000': detailedOverride('industrialMetal', {
    id: 'mus-heavy-metal-2000',
    confidence: 'B',
    tempo: [120, 164],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.32, 0.76, 0.28, 0.9, 0.34, 0.66] },
    scaleName: 'phrygian',
    scale: SCALE_LIBRARY.phrygian,
    rootMidi: 41,
    chords: [0, 1, 4, 3],
    instrumentation: ['distorted-oscillator-guitar', 'saturated-bass', 'wasteland-tom-noise', 'mining-chain-impact', 'cosmic-corruption-synth', 'engine-rumble', 'wordless-warrior-pad'],
    density: 0.92,
    restChance: 0.08,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'triangle', boss: 'square' },
    patterns: {
      lead: [1, 0.78, 0, 0.62, 1, 0, 0.7],
      bass: [1, 0.62, 0, 0.5, 0.88, 0, 0.56],
      drums: [1, 3, 2, 3, 1, 4, 2],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'eden-wasteland', bars: 6, density: 0.56 },
      { name: 'fakk2-pursuit', bars: 8, density: 1.02 },
      { name: 'loc-nar-warning', bars: 4, density: 0.76 },
      { name: 'tyler-fortress-assault', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.74, 1, 0, 0.64, 0.88], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 3, 7, 10, 12], beats: [0.35, 0.4, 0.55, 0.5, 1.4] }
  }),
  'Exit 8': detailedOverride('psychologicalHorror', {
    id: 'mus-exit-8',
    confidence: 'B',
    tempo: [54, 94],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.08, 0.22, 0.08, 0.58, 0.08, 0.18, 0.08] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 47,
    chords: [0, 1, 0, 5],
    instrumentation: ['fluorescent-hum-sine', 'measured-footstep-noise', 'ventilation-drone', 'sign-chime-pulse', 'tile-reflection-delay', 'distant-train-rumble', 'anomaly-pulse'],
    density: 0.34,
    restChance: 0.5,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sine', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0, 0.34, 0, 0, 0],
      bass: [1, 0, 0, 0, 0, 0, 0.42, 0],
      drums: [0, 3, 0, 3, 0, 3, 0, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'normal-passage', bars: 8, density: 0.2 },
      { name: 'first-repeat', bars: 8, density: 0.4 },
      { name: 'anomaly-detected', bars: 4, density: 0.58 },
      { name: 'exit-or-return', bars: 8, density: 0.5 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.48, 0, 0.76, 0], stinger: [0, 1, 6, 7, 12] },
    victory: { intervals: [0, 1, 6, 7, 12], beats: [0.8, 0.7, 0.8, 0.7, 1.8] }
  }),
  'The Thing': detailedOverride('xenoHorror', {
    id: 'mus-the-thing',
    confidence: 'B',
    tempo: [56, 108],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.1, 0.32, 0.1, 0.66, 0.12, 0.28, 0.1, 0.54, 0.12] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 43,
    chords: [0, 1, 5, 2],
    instrumentation: ['antarctic-wind-noise', 'irregular-sub-pulse', 'detuned-string-synth', 'outpost-metal-resonance', 'blood-test-copper-click', 'flamethrower-ignition-noise', 'isolated-piano-tone'],
    density: 0.46,
    restChance: 0.42,
    waves: { lead: 'sine', bass: 'triangle', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.32, 0, 0, 0.58, 0, 0.24, 0],
      bass: [1, 0, 0, 0, 0, 0.68, 0, 0, 0, 0],
      drums: [0, 3, 0, 0, 4, 0, 3, 0, 2, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'whiteout-isolation', bars: 8, density: 0.22 },
      { name: 'suspicion-circle', bars: 8, density: 0.46 },
      { name: 'blood-test', bars: 5, density: 0.7 },
      { name: 'assimilation-breakout', bars: 8, density: 0.98 }
    ],
    boss: { pattern: [1, 0, 0, 0, 0.52, 0, 1, 0, 0.44, 0], stinger: [0, 6, 1, 13, 7] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.8, 0.65, 0.8, 0.65, 1.8] }
  }),
  'Starship Troopers': detailedOverride('militarySciFi', {
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
  }),
  'Voyage de Chihiro': detailedOverride('arcaneFantasy', {
    id: 'mus-voyage-de-chihiro',
    confidence: 'B',
    tempo: [72, 118],
    meter: { beats: 6, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.42, 0.78, 0.2, 0.46] },
    scaleName: 'suspended',
    scale: SCALE_LIBRARY.suspended,
    rootMidi: 55,
    chords: [0, 3, 1, 4],
    instrumentation: ['water-drop-marimba', 'soft-piano-synth', 'breath-flute-sine', 'bathhouse-wood-percussion', 'steam-noise', 'small-spirit-bells', 'river-memory-pad'],
    density: 0.58,
    restChance: 0.28,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.48, 0.76, 0, 0.4],
      bass: [1, 0, 0, 0.64, 0, 0],
      drums: [1, 3, 0, 2, 3, 0],
      pad: [1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'abandoned-tunnel', bars: 6, density: 0.34 },
      { name: 'bathhouse-work', bars: 8, density: 0.68 },
      { name: 'no-face-swell', bars: 5, density: 0.86 },
      { name: 'water-train-name-return', bars: 8, density: 0.46 }
    ],
    boss: { pattern: [1, 0, 0.42, 0.82, 0, 0.62], stinger: [0, 5, 7, 10, 12] },
    victory: { intervals: [0, 5, 7, 10, 12], beats: [0.6, 0.55, 0.65, 0.6, 1.55] }
  }),
  'Death Note': detailedOverride('stealthTactical', {
    id: 'mus-death-note',
    confidence: 'B',
    tempo: [74, 130],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.18, 0.46, 0.72, 0.2, 0.58, 0.3] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 45,
    chords: [0, 5, 1, 4],
    instrumentation: ['clockwork-tick', 'pen-scratch-noise', 'dry-keyboard-pluck', 'interrogation-string-synth', 'low-wordless-choir-pad', 'shinigami-air-noise', 'notebook-page-rustle'],
    density: 0.65,
    restChance: 0.22,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.52, 0.74, 0, 0.46, 0.62],
      bass: [1, 0, 0, 0.68, 0, 0, 0.44],
      drums: [1, 3, 0, 2, 3, 4, 0],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'evidence-board', bars: 7, density: 0.42 },
      { name: 'hidden-name', bars: 7, density: 0.64 },
      { name: 'counter-deduction', bars: 7, density: 0.82 },
      { name: 'yellow-box-confrontation', bars: 7, density: 1 }
    ],
    boss: { pattern: [1, 0, 0.55, 0, 1, 0, 0.7], stinger: [0, 1, 11, 6, 12] },
    victory: { intervals: [0, 3, 7, 11, 12], beats: [0.55, 0.5, 0.65, 0.55, 1.5] }
  }),
  Saw: detailedOverride('psychologicalHorror', {
    id: 'mus-saw',
    confidence: 'B',
    tempo: [64, 126],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.12, 0.38, 0.12, 0.74, 0.14, 0.34, 0.12, 0.62, 0.14] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 42,
    chords: [0, 1, 5, 2],
    instrumentation: ['trap-timer-click', 'rusted-chain-noise', 'prepared-piano', 'mechanical-ratchet-pulse', 'low-heartbeat-sub', 'tape-hiss', 'scraped-metal-synth'],
    density: 0.58,
    restChance: 0.3,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.44, 0, 0, 0.68, 0, 0.3, 0],
      bass: [1, 0, 0, 0, 0.72, 0, 0, 0, 0.5, 0],
      drums: [1, 3, 0, 4, 2, 3, 0, 4, 3, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'locked-room', bars: 6, density: 0.32 },
      { name: 'recorded-rule', bars: 5, density: 0.5 },
      { name: 'choice-window', bars: 5, density: 0.76 },
      { name: 'trap-cycle', bars: 6, density: 1 }
    ],
    boss: { pattern: [1, 0, 0, 0.48, 0, 1, 0, 0.72, 0, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.75, 0.65, 0.75, 0.65, 1.7] }
  }),
  From: detailedOverride('psychologicalHorror', {
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
  }),
  'House of 1000 Corpses': detailedOverride('survivalHorror', {
    id: 'mus-house-of-1000-corpses',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [82, 132],
    meter: { beats: 12, unit: 8, subdivisions: 1, accents: [1, 0.14, 0.32, 0.7, 0.12, 0.38, 0.86, 0.16, 0.3, 0.62, 0.12, 0.46] },
    scaleName: 'ritualMinor',
    scale: SCALE_LIBRARY.ritualMinor,
    rootMidi: 40,
    chords: [0, 1, 4, 1],
    instrumentation: ['detuned-carnival-organ', 'rusted-guitar-oscillator', 'film-projector-flutter', 'cellar-chain-noise', 'funhouse-drum-kit', 'calliope-pressure-synth', 'dusty-room-drone'],
    density: 0.62,
    restChance: 0.26,
    waves: { lead: 'square', bass: 'triangle', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.42, 0, 0.66, 0, 0.3, 0, 0.74, 0, 0.38, 0],
      bass: [1, 0, 0, 0, 0.62, 0, 0, 0, 0.8, 0, 0, 0],
      drums: [1, 0, 3, 2, 0, 4, 1, 0, 3, 2, 0, 4],
      pad: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'roadside-attraction', bars: 6, density: 0.38 },
      { name: 'murder-ride', bars: 8, density: 0.76 },
      { name: 'firefly-supper', bars: 4, density: 0.52 },
      { name: 'doctor-satan-descent', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0, 0.5, 0, 0.82, 1, 0, 0.36, 0, 0.72, 0], stinger: [0, 1, 6, 8, 13] },
    victory: { intervals: [0, 1, 5, 8, 12], beats: [0.7, 0.55, 0.8, 0.65, 1.65] }
  }),
  'Iron Sky': detailedOverride('militarySciFi', {
    id: 'mus-iron-sky',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [104, 148],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.18, 0.58, 0.2, 0.9, 0.18, 0.52, 0.22] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 43,
    chords: [0, 5, 3, 4],
    instrumentation: ['retro-lunar-brass-synth', 'vacuum-tube-bass', 'marching-snare-noise', 'moonbase-radar-pulse', 'saucer-engine-hum', 'orbital-metal-impact', 'satirical-cabinet-organ'],
    density: 0.8,
    restChance: 0.14,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'triangle', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.6, 0.34, 0.9, 0, 0.5, 0.28],
      bass: [1, 0, 0.4, 0, 0.86, 0, 0.46, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'dark-side-hangar', bars: 6, density: 0.5 },
      { name: 'helium-three-raid', bars: 8, density: 0.88 },
      { name: 'saucer-orbit', bars: 4, density: 0.62 },
      { name: 'gotterdammerung-barrage', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.72, 0, 1, 0.42, 0.84, 0], stinger: [0, 5, 7, 11, 12] },
    victory: { intervals: [0, 5, 7, 9, 12, 16], beats: [0.4, 0.42, 0.52, 0.48, 0.72, 1.35] }
  }),
  'Killer Tomatoes from Outer Space': detailedOverride('comedyOddity', {
    id: 'mus-killer-tomatoes-from-outer-space',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [118, 166],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.2, 0.54, 0.24, 0.84, 0.22, 0.48] },
    scaleName: 'wholeTone',
    scale: SCALE_LIBRARY.wholeTone,
    rootMidi: 50,
    chords: [0, 2, 1, 4],
    instrumentation: ['rubber-bass-synth', 'vegetable-splat-noise', 'kazoo-like-oscillator', 'government-lab-beep', 'parade-drum-noise', 'megaphone-click-pulse', 'rolling-produce-rumble'],
    density: 0.88,
    restChance: 0.1,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'triangle', boss: 'square' },
    patterns: {
      lead: [1, 0.58, 0, 0.72, 0, 0.44, 0.82],
      bass: [1, 0, 0.5, 0, 0.86, 0, 0.42],
      drums: [1, 3, 2, 3, 1, 4, 3],
      pad: [1, 0, 0, 0, 1, 0, 0]
    },
    form: [
      { name: 'government-lab-alert', bars: 7, density: 0.62 },
      { name: 'finletter-airdrop', bars: 8, density: 0.94 },
      { name: 'tomato-siege-street', bars: 7, density: 0.82 },
      { name: 'mutant-produce-panic', bars: 8, density: 1.1 }
    ],
    boss: { pattern: [1, 0, 0.62, 1, 0, 0.48, 0.86], stinger: [0, 2, 6, 8, 12] },
    victory: { intervals: [0, 2, 6, 10, 12, 14], beats: [0.3, 0.35, 0.45, 0.4, 0.6, 1.2] }
  }),
  Sharknado: detailedOverride('comedyOddity', {
    id: 'mus-sharknado',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [126, 174],
    meter: { beats: 6, unit: 8, subdivisions: 2, accents: [1, 0.14, 0.38, 0.16, 0.72, 0.18, 0.94, 0.16, 0.42, 0.14, 0.68, 0.2] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 45,
    chords: [0, 4, 3, 5],
    instrumentation: ['surf-guitar-oscillator', 'storm-wind-noise', 'rotor-chop-pulse', 'chainsaw-like-synth', 'lifeguard-whistle-sine', 'floodwater-impact', 'airborne-shark-rush-noise'],
    density: 0.94,
    restChance: 0.08,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'triangle', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.5, 0.72, 0, 0.42, 1, 0, 0.62, 0.38, 0.76, 0],
      bass: [1, 0, 0.44, 0, 0.8, 0, 1, 0, 0.5, 0, 0.72, 0],
      drums: [1, 3, 2, 3, 1, 4, 1, 3, 2, 4, 1, 3],
      pad: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'santa-monica-warning', bars: 6, density: 0.68 },
      { name: 'freeway-flood', bars: 8, density: 0.96 },
      { name: 'airborne-shark-swarm', bars: 6, density: 1.04 },
      { name: 'eye-of-the-sharknado', bars: 8, density: 1.14 }
    ],
    boss: { pattern: [1, 0, 0.6, 0, 0.82, 1, 0, 0.46, 0.74, 0, 1, 0.52], stinger: [0, 5, 7, 10, 14] },
    victory: { intervals: [0, 4, 7, 9, 12, 16], beats: [0.3, 0.32, 0.4, 0.38, 0.58, 1.15] }
  }),
  'Godzilla The Animated Series': detailedOverride('militarySciFi', {
    id: 'mus-godzilla-the-animated-series',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [96, 146],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.14, 0.46, 0.16, 0.8, 0.18, 0.36, 0.14, 0.68, 0.18] },
    scaleName: 'heroicMinor',
    scale: SCALE_LIBRARY.heroicMinor,
    rootMidi: 41,
    chords: [0, 5, 4, 3],
    instrumentation: ['heat-lab-sequencer', 'harbor-sonar-pulse', 'seismograph-clicks', 'heavy-response-toms', 'mutant-frequency-synth', 'synthetic-titan-brass', 'jamaica-bay-wind-noise'],
    density: 0.82,
    restChance: 0.16,
    waves: { lead: 'sawtooth', bass: 'square', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.56, 0, 0.76, 0.36, 0, 0.62, 0, 0.44],
      bass: [1, 0, 0, 0, 0.82, 0, 0.5, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 1, 0, 4, 0, 2],
      pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    form: [
      { name: 'jamaica-bay-scan', bars: 5, density: 0.46 },
      { name: 'heat-mobilization', bars: 8, density: 0.84 },
      { name: 'mutation-pursuit', bars: 5, density: 0.94 },
      { name: 'manhattan-waterfront-titan', bars: 8, density: 1.1 }
    ],
    boss: { pattern: [1, 0, 0, 0.58, 0, 1, 0, 0.74, 0, 0.42], stinger: [0, 5, 9, 7, 12] },
    victory: { intervals: [0, 5, 7, 11, 12], beats: [0.48, 0.5, 0.6, 0.54, 1.45] }
  }),
  'Pee-wee': detailedOverride('comedyOddity', {
    id: 'mus-pee-wee',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [108, 152],
    meter: { beats: 5, unit: 8, subdivisions: 2, accents: [1, 0.16, 0.5, 0.2, 0.86, 0.18, 0.38, 0.16, 0.7, 0.2] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 55,
    chords: [0, 4, 1, 5],
    instrumentation: ['bicycle-bell-pulse', 'playhouse-organ-synth', 'chair-spring-twang', 'toy-xylophone', 'clockwork-footstep-click', 'rubber-horn-noise', 'bright-workshop-pad'],
    density: 0.84,
    restChance: 0.12,
    waves: { lead: 'square', bass: 'triangle', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0.62, 0, 0.44, 0.86, 0, 0.52, 0.32, 0.72, 0],
      bass: [1, 0, 0.46, 0, 0.74, 0, 0.4, 0, 0.66, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3, 1, 3],
      pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    form: [
      { name: 'playhouse-morning', bars: 5, density: 0.58 },
      { name: 'bicycle-workshop', bars: 8, density: 0.88 },
      { name: 'roadside-detour', bars: 5, density: 0.7 },
      { name: 'stolen-bike-dream-chase', bars: 8, density: 1.04 }
    ],
    boss: { pattern: [1, 0, 0.58, 0.8, 0, 1, 0, 0.46, 0.72, 0], stinger: [0, 4, 6, 11, 12] },
    victory: { intervals: [0, 4, 6, 9, 12, 16], beats: [0.28, 0.34, 0.42, 0.38, 0.56, 1.15] }
  }),
  'Planete Hurlante': detailedOverride('xenoHorror', {
    id: 'mus-planete-hurlante',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [78, 128],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.12, 0.36, 0.7, 0.14, 0.48, 0.82] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 38,
    chords: [0, 1, 5, 2],
    instrumentation: ['sirius-six-radio-static', 'burrowing-metal-scrape', 'geiger-click-pulse', 'trench-drum-noise', 'cold-alloy-pad', 'teddy-mechanism-tick', 'radioactive-wind-drone'],
    density: 0.58,
    restChance: 0.32,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.34, 0, 0.62, 0, 0.46],
      bass: [1, 0, 0, 0.68, 0, 0, 0.42],
      drums: [1, 0, 3, 0, 2, 0, 4],
      pad: [1, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'new-alamo-watch', bars: 7, density: 0.3 },
      { name: 'sirius-six-trench', bars: 8, density: 0.68 },
      { name: 'teddy-decoy', bars: 5, density: 0.44 },
      { name: 'type-three-reveal', bars: 8, density: 0.98 }
    ],
    boss: { pattern: [1, 0, 0.46, 0, 0.74, 1, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.78, 0.62, 0.82, 0.68, 1.75] }
  }),
  Kazaam: detailedOverride('electronicStage', {
    id: 'mus-kazaam',
    confidence: 'B',
    sourcePolicy: 'original-procedural-only',
    tempo: [94, 134],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.14, 0.28, 0.16, 0.72, 0.14, 0.36, 0.16, 0.9, 0.14, 0.3, 0.16, 0.68, 0.14, 0.4, 0.18] },
    scaleName: 'dorian',
    scale: SCALE_LIBRARY.dorian,
    rootMidi: 48,
    chords: [0, 3, 5, 1],
    instrumentation: ['boombox-sub-synth', 'synthetic-handclap', 'wish-chime-pulse', 'basketball-bounce-noise', 'urban-brass-synth', 'rooftop-wind-pad', 'genie-sparkle-arpeggiator'],
    density: 0.78,
    restChance: 0.16,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'sine', boss: 'triangle' },
    patterns: {
      lead: [1, 0, 0.5, 0, 0.76, 0.32, 0, 0.46, 1, 0, 0.58, 0.28, 0.7, 0, 0.4, 0],
      bass: [1, 0, 0.38, 0, 0.72, 0, 0.46, 0, 1, 0, 0.34, 0, 0.66, 0, 0.42, 0],
      drums: [1, 3, 3, 3, 2, 3, 4, 3, 1, 3, 3, 4, 2, 3, 3, 3],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'abandoned-theater', bars: 4, density: 0.48 },
      { name: 'boombox-awakening', bars: 8, density: 0.82 },
      { name: 'wish-cascade', bars: 4, density: 0.68 },
      { name: 'rooftop-contract-showdown', bars: 8, density: 1.02 }
    ],
    boss: { pattern: [1, 0, 0.54, 0, 0.82, 0.38, 0, 0.66, 1, 0, 0.46, 0, 0.76, 0.34, 0, 0.58], stinger: [0, 3, 7, 10, 15] },
    victory: { intervals: [0, 3, 7, 9, 12, 15], beats: [0.38, 0.4, 0.48, 0.45, 0.68, 1.3] }
  }),
  'House of the Dead': detailedOverride('survivalHorror', {
    id: 'mus-house-of-the-dead',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [82, 142],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.1, 0.3, 0.12, 0.72, 0.1, 0.42, 0.14, 0.9, 0.1, 0.34, 0.12, 0.68, 0.1, 0.46, 0.14] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 40,
    chords: [0, 1, 5, 4],
    instrumentation: ['curien-mansion-organ-synth', 'ams-pistol-mechanism-click', 'specimen-tank-bubble-noise', 'gothic-string-pulse', 'laboratory-metal-impact', 'tarot-boss-stinger', 'underground-drone'],
    density: 0.7,
    restChance: 0.22,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0.48, 0, 0.76, 0, 0.34, 0, 0.92, 0, 0.56, 0, 0.7, 0, 0.4, 0],
      bass: [1, 0, 0, 0, 0.64, 0, 0, 0, 0.86, 0, 0, 0, 0.58, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0, 1, 3, 2, 0, 1, 4, 3, 0],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'curien-mansion-arrival', bars: 4, density: 0.34 },
      { name: 'researcher-rescue-route', bars: 8, density: 0.68 },
      { name: 'dbr-underground-laboratory', bars: 6, density: 0.88 },
      { name: 'magician-type-zero', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.46, 0, 0.78, 0, 1, 0.52, 1, 0, 0.62, 0, 0.84, 0, 0.7, 0], stinger: [0, 1, 8, 11, 13] },
    victory: { intervals: [0, 3, 7, 11, 12], beats: [0.62, 0.5, 0.68, 0.56, 1.5] }
  }),
  'House of the Dead 2': detailedOverride('survivalHorror', {
    id: 'mus-house-of-the-dead-2',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [104, 158],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.22, 0.62, 0.3, 0.86, 0.24, 0.5] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 45,
    chords: [0, 4, 1, 5],
    instrumentation: ['venetian-bell-synth', 'canal-water-noise', 'ams-reload-click', 'arcade-breakbeat-noise', 'goldman-glass-pad', 'tarot-creature-stinger', 'emperor-core-pulse'],
    density: 0.86,
    restChance: 0.12,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'sine', boss: 'triangle' },
    patterns: {
      lead: [1, 0.58, 0, 0.72, 0.36, 0, 0.66],
      bass: [1, 0, 0.48, 0, 0.82, 0, 0.44],
      drums: [1, 3, 2, 1, 4, 3, 2],
      pad: [1, 0, 0, 0, 1, 0, 0]
    },
    form: [
      { name: 'venice-civilian-rescue', bars: 7, density: 0.56 },
      { name: 'canal-creature-pursuit', bars: 8, density: 0.9 },
      { name: 'goldman-tower-ascent', bars: 7, density: 1 },
      { name: 'emperor-type-alpha', bars: 8, density: 1.14 }
    ],
    boss: { pattern: [1, 0, 0.58, 1, 0, 0.78, 0.46], stinger: [0, 4, 6, 9, 13] },
    victory: { intervals: [0, 4, 7, 11, 12, 16], beats: [0.3, 0.36, 0.46, 0.42, 0.64, 1.2] }
  }),
  'House of the Dead 3': detailedOverride('survivalHorror', {
    id: 'mus-house-of-the-dead-3',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [88, 146],
    meter: { beats: 6, unit: 8, subdivisions: 2, accents: [1, 0.12, 0.38, 0.14, 0.72, 0.16, 0.44, 0.12, 0.88, 0.14, 0.5, 0.16] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 38,
    chords: [0, 1, 5, 2],
    instrumentation: ['shotgun-pump-click', 'efi-ventilation-noise', 'abandoned-facility-chain-hit', 'bioreactor-electric-pulse', 'ruined-concrete-impact', 'fate-wheel-metal-drone', 'partner-rescue-alarm'],
    density: 0.76,
    restChance: 0.2,
    waves: { lead: 'triangle', bass: 'square', pad: 'sawtooth', boss: 'sine' },
    patterns: {
      lead: [1, 0, 0.42, 0, 0.7, 0, 0.34, 0, 0.82, 0, 0.54, 0],
      bass: [1, 0, 0, 0, 0.68, 0, 1, 0, 0, 0, 0.58, 0],
      drums: [1, 0, 3, 0, 2, 4, 1, 0, 3, 0, 2, 4],
      pad: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'efi-facility-entry', bars: 6, density: 0.4 },
      { name: 'partner-rescue', bars: 6, density: 0.82 },
      { name: 'bioreactor-descent', bars: 8, density: 0.96 },
      { name: 'wheel-of-fate-overload', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.5, 0, 0.82, 1, 0, 0.62, 1, 0, 0.7, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.72, 0.58, 0.78, 0.64, 1.6] }
  }),
  'The Simpsons': detailedOverride('comedyOddity', {
    id: 'mus-the-simpsons',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [104, 148],
    meter: { beats: 4, unit: 4, subdivisions: 2, accents: [1, 0.2, 0.52, 0.22, 0.88, 0.18, 0.46, 0.24] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 53,
    chords: [0, 4, 1, 5],
    instrumentation: ['cartoon-brass-synth', 'springfield-organ-pulse', 'sector-7g-key-click', 'nuclear-warning-bell', 'rubber-bass-synth', 'comic-orchestra-hit', 'reactor-hum-pad'],
    density: 0.82,
    restChance: 0.14,
    waves: { lead: 'square', bass: 'triangle', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0.62, 0, 0.44, 0.86, 0, 0.54, 0.3],
      bass: [1, 0, 0.42, 0, 0.74, 0, 0.48, 0],
      drums: [1, 3, 2, 3, 1, 4, 2, 3],
      pad: [1, 0, 0, 0, 1, 0, 0, 0]
    },
    form: [
      { name: 'springfield-shift', bars: 4, density: 0.54 },
      { name: 'sector-7g-incident', bars: 8, density: 0.86 },
      { name: 'burns-scheme', bars: 4, density: 0.72 },
      { name: 'reactor-meltdown-gag', bars: 8, density: 1.08 }
    ],
    boss: { pattern: [1, 0, 0.64, 0, 1, 0.42, 0.8, 0], stinger: [0, 4, 6, 11, 12] },
    victory: { intervals: [0, 4, 6, 9, 12, 16], beats: [0.3, 0.34, 0.44, 0.4, 0.62, 1.2] }
  }),
  Futurama: detailedOverride('electronicStage', {
    id: 'mus-futurama',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [112, 158],
    meter: { beats: 7, unit: 8, subdivisions: 1, accents: [1, 0.24, 0.54, 0.84, 0.26, 0.66, 0.38] },
    scaleName: 'lydian',
    scale: SCALE_LIBRARY.lydian,
    rootMidi: 50,
    chords: [0, 4, 2, 5],
    instrumentation: ['retro-future-brass-synth', 'planet-express-engine-bass', 'delivery-tube-percussion', 'robot-joint-clicks', 'new-new-york-traffic-noise', 'holophonor-like-synth', 'hypnosis-pulse'],
    density: 0.88,
    restChance: 0.1,
    waves: { lead: 'square', bass: 'sawtooth', pad: 'sine', boss: 'triangle' },
    patterns: {
      lead: [1, 0.58, 0, 0.76, 0.38, 0, 0.68],
      bass: [1, 0, 0.48, 0, 0.82, 0, 0.5],
      drums: [1, 3, 2, 1, 3, 4, 2],
      pad: [1, 0, 0, 0, 1, 0, 0]
    },
    form: [
      { name: 'planet-express-briefing', bars: 7, density: 0.58 },
      { name: 'new-new-york-delivery', bars: 8, density: 0.9 },
      { name: 'robot-mafia-intercept', bars: 7, density: 1 },
      { name: 'hypnotoad-singularity', bars: 8, density: 1.12 }
    ],
    boss: { pattern: [1, 0, 0.58, 1, 0, 0.72, 0.48], stinger: [0, 4, 6, 9, 13] },
    victory: { intervals: [0, 4, 6, 11, 12, 16], beats: [0.3, 0.36, 0.46, 0.42, 0.62, 1.2] }
  }),
  'Final Fantasy VII': detailedOverride('animeHeroic', {
    id: 'mus-final-fantasy-vii',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [86, 142],
    meter: { beats: 5, unit: 4, subdivisions: 2, accents: [1, 0.16, 0.46, 0.18, 0.8, 0.2, 0.4, 0.16, 0.7, 0.22] },
    scaleName: 'harmonicMinor',
    scale: SCALE_LIBRARY.harmonicMinor,
    rootMidi: 40,
    chords: [0, 5, 1, 4],
    instrumentation: ['mako-reactor-sub-pulse', 'synthetic-string-ensemble', 'industrial-snare-noise', 'metal-catwalk-impact', 'materia-glass-arpeggiator', 'low-brass-synth', 'lifestream-air-pad'],
    density: 0.78,
    restChance: 0.16,
    waves: { lead: 'triangle', bass: 'square', pad: 'sine', boss: 'sawtooth' },
    patterns: {
      lead: [1, 0, 0.48, 0, 0.78, 0.34, 0, 0.58, 0, 0.42],
      bass: [1, 0, 0, 0, 0.82, 0, 0.46, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 1, 0, 4, 0, 2],
      pad: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    form: [
      { name: 'reactor-one-infiltration', bars: 5, density: 0.44 },
      { name: 'mako-core-descent', bars: 8, density: 0.8 },
      { name: 'shinra-counterattack', bars: 5, density: 0.96 },
      { name: 'jenova-reunion', bars: 8, density: 1.1 }
    ],
    boss: { pattern: [1, 0, 0.52, 0, 0.86, 1, 0, 0.64, 0, 0.44], stinger: [0, 1, 8, 11, 13] },
    victory: { intervals: [0, 3, 7, 11, 12], beats: [0.5, 0.48, 0.62, 0.56, 1.5] }
  }),
  'Left 4 Dead': detailedOverride('survivalHorror', {
    id: 'mus-left-4-dead',
    confidence: 'A',
    sourcePolicy: 'original-procedural-only',
    tempo: [74, 150],
    meter: { beats: 4, unit: 4, subdivisions: 4, accents: [1, 0.1, 0.28, 0.12, 0.62, 0.1, 0.34, 0.12, 0.9, 0.1, 0.3, 0.12, 0.66, 0.1, 0.4, 0.14] },
    scaleName: 'chromaticTension',
    scale: SCALE_LIBRARY.chromaticTension,
    rootMidi: 38,
    chords: [0, 1, 5, 2],
    instrumentation: ['distant-infected-noise', 'safe-room-guitar-oscillator', 'heartbeat-sub', 'rooftop-wind-noise', 'horde-snare-clatter', 'rescue-radio-static', 'special-infected-stinger-synth'],
    density: 0.68,
    restChance: 0.24,
    waves: { lead: 'triangle', bass: 'sine', pad: 'sawtooth', boss: 'square' },
    patterns: {
      lead: [1, 0, 0, 0.38, 0, 0, 0.56, 0, 0.82, 0, 0, 0.44, 0, 0.64, 0, 0],
      bass: [1, 0, 0, 0, 0.58, 0, 0, 0, 0.9, 0, 0, 0, 0.7, 0, 0, 0],
      drums: [1, 0, 3, 0, 2, 0, 4, 0, 1, 3, 2, 3, 1, 4, 3, 4],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    form: [
      { name: 'safe-room-exit', bars: 4, density: 0.32 },
      { name: 'hospital-ascent', bars: 8, density: 0.66 },
      { name: 'crescendo-horde', bars: 6, density: 1.06 },
      { name: 'no-mercy-evacuation', bars: 8, density: 1.16 }
    ],
    boss: { pattern: [1, 0, 0.42, 0, 0.72, 0, 1, 0.5, 1, 0, 0.58, 0, 0.86, 0, 0.7, 0], stinger: [0, 1, 6, 10, 13] },
    victory: { intervals: [0, 3, 6, 10, 12], beats: [0.7, 0.58, 0.72, 0.62, 1.65] }
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
  dbz: 'Dragon Ball Z',
  'dragon ball z': 'Dragon Ball Z',
  'tokyo ghoul re': 'Tokyo Ghoul',
  evangelion: 'Neon Genesis Evangelion',
  'neon genesis evangelion': 'Neon Genesis Evangelion',
  'full metal alchemist': 'Fullmetal Alchemist',
  'fullmetal alchemist brotherhood': 'Fullmetal Alchemist',
  'steins gate': 'Steins;Gate'
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

const MODE_PROFILE_ALIASES = {
  combat: 'combat',
  fighter: 'combat',
  melee: 'melee',
  smash: 'melee',
  rpg: 'rpg',
  tactics: 'tactics'
};

const resolveEncounterVariant = (stage, state) => {
  const tags = Array.isArray(stage?.tags) ? stage.tags.map(toLookupKey) : [];
  const isWorldBoss = Boolean(
    stage?.worldBoss
    || stage?.isWorldBoss
    || stage?.finalGameBoss
    || tags.includes('world boss')
    || tags.includes('worldboss')
  );
  if (isWorldBoss) return 'worldBoss';

  const isBoss = Boolean(
    state === 'boss'
    || stage?.bossActive
    || stage?.isBoss
    || tags.includes('boss arena')
    || tags.includes('bossarena')
  );
  return isBoss ? 'boss' : 'standard';
};

const resolveProfileArrangement = (baseProfile, modeKey, state, stage) => {
  const requestedModeVariant = MODE_PROFILE_ALIASES[modeKey] || modeKey;
  const modeOverride = baseProfile.modeProfiles?.[requestedModeVariant];
  const modeProfile = modeOverride ? mergeProfile(baseProfile, modeOverride) : baseProfile;
  const encounterVariant = resolveEncounterVariant(stage, state);
  const encounterOverride = encounterVariant === 'standard'
    ? null
    : modeProfile.encounterProfiles?.[encounterVariant];
  return {
    profile: encounterOverride ? mergeProfile(modeProfile, encounterOverride) : modeProfile,
    modeVariant: modeOverride ? requestedModeVariant : 'generic',
    encounterVariant: encounterOverride ? encounterVariant : 'standard'
  };
};

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

const PROCEDURAL_UNIVERSE_PROFILE_CACHE = new Map();
const clampMusicValue = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const rotateMusicArray = (values, offset) => {
  if (!Array.isArray(values) || values.length < 2) return cloneArray(values);
  const shift = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
};
const musicSeedVariation = (universe, label, radius) => (
  (hashMusicSeed(`${universe}|${label}`) % (radius * 2 + 1)) - radius
);

export const buildProceduralUniverseProfile = universe => {
  const normalized = normalizeMusicUniverse(universe);
  if (PROCEDURAL_UNIVERSE_PROFILE_CACHE.has(normalized)) {
    return PROCEDURAL_UNIVERSE_PROFILE_CACHE.get(normalized);
  }

  const familyId = resolveFamilyId({ universe: normalized, sourceUniverses: [] });
  const familyProfile = MUSIC_PROFILE_FAMILIES[familyId] || MUSIC_PROFILE_FAMILIES.nexusArchive;
  const rotate = (values, label) => rotateMusicArray(
    values,
    hashMusicSeed(`${normalized}|${label}`)
  );
  const profile = mergeProfile(familyProfile, {
    id: `universe-${toLookupKey(normalized).replaceAll(' ', '-')}`,
    family: familyProfile.family,
    confidence: 'procedural-universe',
    sourcePolicy: 'original-procedural-only',
    tempo: [
      familyProfile.tempo[0] + musicSeedVariation(normalized, 'tempo-low', 4),
      familyProfile.tempo[1] + musicSeedVariation(normalized, 'tempo-high', 4)
    ],
    rootMidi: familyProfile.rootMidi + musicSeedVariation(normalized, 'root', 2),
    chords: rotate(familyProfile.chords, 'chords'),
    instrumentation: rotate(familyProfile.instrumentation, 'instrumentation'),
    density: clampMusicValue(
      familyProfile.density + musicSeedVariation(normalized, 'density', 6) / 100,
      0.2,
      1
    ),
    restChance: clampMusicValue(
      familyProfile.restChance + musicSeedVariation(normalized, 'rest', 4) / 100,
      0.04,
      0.6
    ),
    patterns: {
      lead: rotate(familyProfile.patterns.lead, 'lead-pattern'),
      bass: rotate(familyProfile.patterns.bass, 'bass-pattern'),
      drums: rotate(familyProfile.patterns.drums, 'drum-pattern'),
      pad: rotate(familyProfile.patterns.pad, 'pad-pattern')
    }
  });
  PROCEDURAL_UNIVERSE_PROFILE_CACHE.set(normalized, profile);
  return profile;
};

const resolveUniverseProfile = universe => {
  const normalized = normalizeMusicUniverse(universe);
  if (MUSIC_PROFILE_OVERRIDES[normalized]) return MUSIC_PROFILE_OVERRIDES[normalized];
  return buildProceduralUniverseProfile(normalized);
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
  const baseProfile = blendProfiles(profiles, sourceUniverses);
  const mode = String(stage.mode || 'RPG');
  const modeKey = toLookupKey(mode);
  const {
    profile,
    modeVariant,
    encounterVariant
  } = resolveProfileArrangement(baseProfile, modeKey, state, stage);
  const modeConfig = MODE_MODIFIERS[modeKey] || { tempo: 1, density: 1 };
  const stateConfig = STATE_MODIFIERS[state] || STATE_MODIFIERS.battle;
  const bossKey = getBossKey(stage);
  const hasBoss = Boolean(
    bossKey
    || stage.isBoss
    || stage.bossActive
    || stage.finalGameBoss
    || stage.worldBoss
    || encounterVariant !== 'standard'
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
  const bossLayerEnabled = Boolean(
    stateConfig.bossLayer
    || stage.bossActive
    || stage.finalGameBoss
    || encounterVariant !== 'standard'
  );
  const key = [
    profile.id,
    sourceUniverses.join('+'),
    modeKey || 'rpg',
    modeVariant,
    encounterVariant,
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
    modeVariant,
    encounterVariant,
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
