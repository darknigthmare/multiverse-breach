// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcThalassaMnemique from '../../DLC/ThalassaMnemique/data/stageMusicProfiles.js';
import * as dlcMeridienCreux from '../../DLC/MeridienCreux/data/stageMusicProfiles.js';
import * as dlcViridienneUltime from '../../DLC/ViridienneUltime/data/stageMusicProfiles.js';
import * as dlcHalo from '../../DLC/Halo/data/stageMusicProfiles.js';
import * as dlcStargate from '../../DLC/Stargate/data/stageMusicProfiles.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/stageMusicProfiles.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/stageMusicProfiles.js';
import * as dlcDoom from '../../DLC/Doom/data/stageMusicProfiles.js';
import * as dlcAlien from '../../DLC/Alien/data/stageMusicProfiles.js';
import * as dlcPredator from '../../DLC/Predator/data/stageMusicProfiles.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/stageMusicProfiles.js';
import * as dlcPortal from '../../DLC/Portal/data/stageMusicProfiles.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/stageMusicProfiles.js';
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/stageMusicProfiles.js';
import * as dlcChainsawMan from '../../DLC/ChainsawMan/data/stageMusicProfiles.js';
import * as dlcDemonSlayer from '../../DLC/DemonSlayer/data/stageMusicProfiles.js';
import * as dlcJoJosBizarreAdventure from '../../DLC/JoJosBizarreAdventure/data/stageMusicProfiles.js';
import * as dlcDragonBallZ from '../../DLC/DragonBallZ/data/stageMusicProfiles.js';
import * as dlcTokyoGhoul from '../../DLC/TokyoGhoul/data/stageMusicProfiles.js';
import * as dlcFullmetalAlchemist from '../../DLC/FullmetalAlchemist/data/stageMusicProfiles.js';
import * as dlcNeonGenesisEvangelion from '../../DLC/NeonGenesisEvangelion/data/stageMusicProfiles.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/stageMusicProfiles.js';
import * as dlcRammstein from '../../DLC/Rammstein/data/stageMusicProfiles.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/stageMusicProfiles.js';
import * as dlcRobZombie from '../../DLC/RobZombie/data/stageMusicProfiles.js';
import * as dlcLinkinPark from '../../DLC/LinkinPark/data/stageMusicProfiles.js';
import * as dlcDaftPunk from '../../DLC/DaftPunk/data/stageMusicProfiles.js';
import * as dlcOliverTree from '../../DLC/OliverTree/data/stageMusicProfiles.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/stageMusicProfiles.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/stageMusicProfiles.js';
import * as dlcSplatterhouse from '../../DLC/Splatterhouse/data/stageMusicProfiles.js';
import * as dlcStreetsOfRage from '../../DLC/StreetsOfRage/data/stageMusicProfiles.js';
import * as dlcToySoldiers from '../../DLC/ToySoldiers/data/stageMusicProfiles.js';
import * as dlcZombiesAteMyNeighbors from '../../DLC/ZombiesAteMyNeighbors/data/stageMusicProfiles.js';
import * as dlcSpyXFamily from '../../DLC/SpyXFamily/data/stageMusicProfiles.js';
import * as dlcWarOfTheWorlds from '../../DLC/WarOfTheWorlds/data/stageMusicProfiles.js';
import * as dlcGhostbusters from '../../DLC/Ghostbusters/data/stageMusicProfiles.js';
import * as dlcTremors from '../../DLC/Tremors/data/stageMusicProfiles.js';
import * as dlcHeavyMetal2000 from '../../DLC/HeavyMetal2000/data/stageMusicProfiles.js';
import * as dlcExit8 from '../../DLC/Exit8/data/stageMusicProfiles.js';
import * as dlcTheThing from '../../DLC/TheThing/data/stageMusicProfiles.js';
import * as dlcStarshipTroopers from '../../DLC/StarshipTroopers/data/stageMusicProfiles.js';
import * as dlcVoyageDeChihiro from '../../DLC/VoyageDeChihiro/data/stageMusicProfiles.js';
import * as dlcDeathNote from '../../DLC/DeathNote/data/stageMusicProfiles.js';
import * as dlcSaw from '../../DLC/Saw/data/stageMusicProfiles.js';
import * as dlcFrom from '../../DLC/From/data/stageMusicProfiles.js';
import * as dlcHouseOf1000Corpses from '../../DLC/HouseOf1000Corpses/data/stageMusicProfiles.js';
import * as dlcIronSky from '../../DLC/IronSky/data/stageMusicProfiles.js';
import * as dlcKillerTomatoesFromOuterSpace from '../../DLC/KillerTomatoesFromOuterSpace/data/stageMusicProfiles.js';
import * as dlcSharknado from '../../DLC/Sharknado/data/stageMusicProfiles.js';
import * as dlcGodzillaTheAnimatedSeries from '../../DLC/GodzillaTheAnimatedSeries/data/stageMusicProfiles.js';
import * as dlcPeeWee from '../../DLC/PeeWee/data/stageMusicProfiles.js';
import * as dlcPlaneteHurlante from '../../DLC/PlaneteHurlante/data/stageMusicProfiles.js';
import * as dlcKazaam from '../../DLC/Kazaam/data/stageMusicProfiles.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/stageMusicProfiles.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/stageMusicProfiles.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/stageMusicProfiles.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/stageMusicProfiles.js';
import * as dlcFuturama from '../../DLC/Futurama/data/stageMusicProfiles.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/stageMusicProfiles.js';
import * as dlcLeft4Dead from '../../DLC/Left4Dead/data/stageMusicProfiles.js';
import * as dlcCyberpunkEdgerunners from '../../DLC/CyberpunkEdgerunners/data/stageMusicProfiles.js';
import * as dlcParasyte from '../../DLC/Parasyte/data/stageMusicProfiles.js';
import * as dlcUzumaki from '../../DLC/Uzumaki/data/stageMusicProfiles.js';

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
  'Thalassa Mnémique': dlcThalassaMnemique.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Méridien Creux': dlcMeridienCreux.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Viridienne Ultime': dlcViridienneUltime.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Halo: dlcHalo.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Stargate: dlcStargate.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Resident Evil': dlcResidentEvil.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Silent Hill': dlcSilentHill.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Doom: dlcDoom.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Alien: dlcAlien.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Predator: dlcPredator.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'The Matrix': dlcTheMatrix.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Portal: dlcPortal.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Metal Gear': dlcMetalGear.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Gears of War': dlcGearsOfWar.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Chainsaw Man': dlcChainsawMan.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Demon Slayer': dlcDemonSlayer.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  "JoJo's Bizarre Adventure": dlcJoJosBizarreAdventure.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Dragon Ball Z': dlcDragonBallZ.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Tokyo Ghoul': dlcTokyoGhoul.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Fullmetal Alchemist': dlcFullmetalAlchemist.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Neon Genesis Evangelion': dlcNeonGenesisEvangelion.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Steins;Gate': dlcSteinsGate.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Rammstein: dlcRammstein.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'System of a Down': dlcSystemOfADown.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Rob Zombie': dlcRobZombie.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Linkin Park': dlcLinkinPark.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Daft Punk': dlcDaftPunk.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Oliver Tree': dlcOliverTree.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Hazbin Hotel': dlcHazbinHotel.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Vocaloid: dlcVocaloid.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Splatterhouse: dlcSplatterhouse.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Streets of Rage': dlcStreetsOfRage.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Toy Soldiers': dlcToySoldiers.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Zombies Ate My Neighbors': dlcZombiesAteMyNeighbors.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Spy x Family': dlcSpyXFamily.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'War of the Worlds': dlcWarOfTheWorlds.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Ghostbusters: dlcGhostbusters.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Tremors: dlcTremors.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Heavy Metal 2000': dlcHeavyMetal2000.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Exit 8': dlcExit8.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'The Thing': dlcTheThing.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Starship Troopers': dlcStarshipTroopers.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Voyage de Chihiro': dlcVoyageDeChihiro.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Death Note': dlcDeathNote.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Saw: dlcSaw.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  From: dlcFrom.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'House of 1000 Corpses': dlcHouseOf1000Corpses.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Iron Sky': dlcIronSky.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Killer Tomatoes from Outer Space': dlcKillerTomatoesFromOuterSpace.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Sharknado: dlcSharknado.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Godzilla The Animated Series': dlcGodzillaTheAnimatedSeries.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Pee-wee': dlcPeeWee.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Planete Hurlante': dlcPlaneteHurlante.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Kazaam: dlcKazaam.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'House of the Dead': dlcHouseOfTheDead.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'House of the Dead 2': dlcHouseOfTheDead2.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'House of the Dead 3': dlcHouseOfTheDead3.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'The Simpsons': dlcTheSimpsons.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Futurama: dlcFuturama.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Final Fantasy VII': dlcFinalFantasyVII.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Left 4 Dead': dlcLeft4Dead.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  'Cyberpunk: Edgerunners': dlcCyberpunkEdgerunners.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Parasyte: dlcParasyte.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride }),
  Uzumaki: dlcUzumaki.createMusicProfileOverrides({ SCALE_LIBRARY, detailedOverride })
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
