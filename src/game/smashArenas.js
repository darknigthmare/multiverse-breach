import { EXPANDED_UNIVERSE_SIGNATURES } from './expandedUniverses';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';
import {
  decoratePlatformsForTopology,
  resolveStageTopologyProfile
} from './melee/stageTopologyCatalog';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const platform = (x1, x2, y, kind = 'main', passThrough = kind !== 'main') => ({
  x1,
  x2,
  y,
  kind,
  passThrough
});

const scaledPlatform = (width, height, left, right, y, kind, passThrough) => platform(
  Math.round(width * left),
  Math.round(width * right),
  Math.round(height * y),
  kind,
  passThrough
);

const objectiveNode = (width, height, x, y, type, id) => ({
  id,
  type,
  x: Math.round(width * x),
  y: Math.round(height * y),
  radius: type === 'portal' ? 42 : 34,
  progress: 0,
  collected: false,
  sealed: false
});

export const SMASH_ARENA_LAYOUTS = {
  training_flat: {
    id: 'training_flat',
    label: { fr: 'Plateforme d ancrage', en: 'Anchor Platform' },
    tags: ['wide', 'starter'],
    objective: 'waves',
    objectiveTarget: 4,
    gravity: 0.24,
    jump: -7.7,
    dropDelay: 520,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.08, 0.92, 0.76, 'main', false),
      scaledPlatform(width, height, 0.36, 0.64, 0.49, 'soft')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.76 },
        { x: width * 0.23, y: height * 0.76 },
        { x: width * 0.28, y: height * 0.76 }
      ],
      enemies: [
        { x: width * 0.84, y: height * 0.76 },
        { x: width * 0.72, y: height * 0.49 },
        { x: width * 0.12, y: height * 0.76 }
      ],
      boss: { x: width * 0.78, y: height * 0.76 }
    }),
    pickups: (width, height) => [
      { x: width * 0.22, y: height * 0.69 },
      { x: width * 0.42, y: height * 0.43 },
      { x: width * 0.58, y: height * 0.43 },
      { x: width * 0.74, y: height * 0.69 },
      { x: width * 0.50, y: height * 0.69 }
    ]
  },
  triplat_duel: {
    id: 'triplat_duel',
    label: { fr: 'Arena duel a trois etages', en: 'Three-Tier Duel Arena' },
    tags: ['duel', 'platformHeavy'],
    objective: 'waves',
    objectiveTarget: 4,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.07, 0.93, 0.76, 'main', false),
      scaledPlatform(width, height, 0.14, 0.34, 0.52, 'soft'),
      scaledPlatform(width, height, 0.66, 0.86, 0.52, 'soft'),
      scaledPlatform(width, height, 0.39, 0.61, 0.35, 'soft')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.76 },
        { x: width * 0.25, y: height * 0.52 },
        { x: width * 0.32, y: height * 0.76 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.76 },
        { x: width * 0.74, y: height * 0.52 },
        { x: width * 0.50, y: height * 0.35 }
      ],
      boss: { x: width * 0.80, y: height * 0.76 }
    }),
    pickups: (width, height) => [
      { x: width * 0.24, y: height * 0.46 },
      { x: width * 0.50, y: height * 0.29 },
      { x: width * 0.76, y: height * 0.46 },
      { x: width * 0.35, y: height * 0.69 },
      { x: width * 0.65, y: height * 0.69 }
    ]
  },
  vertical_tower: {
    id: 'vertical_tower',
    label: { fr: 'Tour de projection', en: 'Projection Tower' },
    tags: ['vertical', 'platformHeavy'],
    objective: 'capture',
    objectiveTarget: 100,
    gravity: 0.23,
    jump: -8.2,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.1, 0.9, 0.8, 'main', false),
      scaledPlatform(width, height, 0.12, 0.33, 0.61, 'soft'),
      scaledPlatform(width, height, 0.67, 0.88, 0.61, 'soft'),
      scaledPlatform(width, height, 0.38, 0.62, 0.43, 'soft'),
      scaledPlatform(width, height, 0.2, 0.42, 0.27, 'soft'),
      scaledPlatform(width, height, 0.58, 0.8, 0.27, 'soft')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.8 },
        { x: width * 0.28, y: height * 0.61 },
        { x: width * 0.42, y: height * 0.43 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.8 },
        { x: width * 0.76, y: height * 0.61 },
        { x: width * 0.68, y: height * 0.27 }
      ],
      boss: { x: width * 0.50, y: height * 0.43 }
    }),
    pickups: (width, height) => [
      { x: width * 0.22, y: height * 0.55 },
      { x: width * 0.50, y: height * 0.37 },
      { x: width * 0.78, y: height * 0.55 },
      { x: width * 0.31, y: height * 0.21 },
      { x: width * 0.69, y: height * 0.21 }
    ]
  },
  split_pit: {
    id: 'split_pit',
    label: { fr: 'Faille a fosse centrale', en: 'Central Pit Rift' },
    tags: ['hazard', 'pit', 'chaotic'],
    objective: 'survival',
    objectiveTarget: 900,
    dropDelay: 460,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.06, 0.42, 0.76, 'main', false),
      scaledPlatform(width, height, 0.58, 0.94, 0.76, 'main', false),
      scaledPlatform(width, height, 0.34, 0.66, 0.52, 'soft'),
      scaledPlatform(width, height, 0.12, 0.28, 0.36, 'soft'),
      scaledPlatform(width, height, 0.72, 0.88, 0.36, 'soft')
    ],
    hazards: (width, height) => [
      { id: 'pit_flux', type: 'rift', x1: width * 0.43, x2: width * 0.57, y: height * 0.74, damage: 3, knockX: 4, knockY: -6, cadence: 110 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.76 },
        { x: width * 0.25, y: height * 0.76 },
        { x: width * 0.38, y: height * 0.52 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.76 },
        { x: width * 0.62, y: height * 0.52 },
        { x: width * 0.76, y: height * 0.36 }
      ],
      boss: { x: width * 0.78, y: height * 0.76 }
    }),
    pickups: (width, height) => [
      { x: width * 0.24, y: height * 0.69 },
      { x: width * 0.50, y: height * 0.46 },
      { x: width * 0.76, y: height * 0.69 },
      { x: width * 0.20, y: height * 0.30 },
      { x: width * 0.80, y: height * 0.30 }
    ]
  },
  asym_hunt: {
    id: 'asym_hunt',
    label: { fr: 'Terrain de chasse asymetrique', en: 'Asymmetric Hunt Ground' },
    tags: ['asymmetric', 'loreArena'],
    objective: 'hunt',
    objectiveTarget: 3,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.05, 0.95, 0.78, 'main', false),
      scaledPlatform(width, height, 0.13, 0.45, 0.58, 'soft'),
      scaledPlatform(width, height, 0.55, 0.82, 0.43, 'soft'),
      scaledPlatform(width, height, 0.24, 0.4, 0.29, 'soft')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.16, y: height * 0.78 },
        { x: width * 0.26, y: height * 0.58 },
        { x: width * 0.34, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.84, y: height * 0.78 },
        { x: width * 0.68, y: height * 0.43 },
        { x: width * 0.30, y: height * 0.29 }
      ],
      boss: { x: width * 0.68, y: height * 0.43 }
    }),
    pickups: (width, height) => [
      { x: width * 0.30, y: height * 0.52 },
      { x: width * 0.68, y: height * 0.37 },
      { x: width * 0.33, y: height * 0.23 },
      { x: width * 0.82, y: height * 0.71 },
      { x: width * 0.18, y: height * 0.71 }
    ]
  },
  boss_coliseum: {
    id: 'boss_coliseum',
    label: { fr: 'Colisee de champion', en: 'Champion Coliseum' },
    tags: ['bossArena', 'wide'],
    objective: 'boss',
    objectiveTarget: 3,
    gravity: 0.25,
    jump: -7.4,
    maxWaves: 3,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.04, 0.96, 0.78, 'main', false),
      scaledPlatform(width, height, 0.18, 0.36, 0.55, 'soft'),
      scaledPlatform(width, height, 0.64, 0.82, 0.55, 'soft')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.78 },
        { x: width * 0.25, y: height * 0.78 },
        { x: width * 0.32, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.80, y: height * 0.78 },
        { x: width * 0.72, y: height * 0.55 },
        { x: width * 0.28, y: height * 0.55 }
      ],
      boss: { x: width * 0.72, y: height * 0.78 }
    }),
    pickups: (width, height) => [
      { x: width * 0.22, y: height * 0.71 },
      { x: width * 0.30, y: height * 0.49 },
      { x: width * 0.70, y: height * 0.49 },
      { x: width * 0.78, y: height * 0.71 },
      { x: width * 0.50, y: height * 0.71 }
    ]
  },
  oc_authorless_finale: {
    id: 'oc_authorless_finale',
    label: { fr: 'Seuil des trois propositions', en: 'Threshold of Three Propositions' },
    tags: ['bossArena', 'portalSpawn', 'loreArena', 'wide'],
    // The portals stage the Authorless propositions, but only defeating the
    // canonical final boss can complete this arena.
    objective: 'boss',
    objectiveTarget: 3,
    gravity: 0.23,
    jump: -7.6,
    maxWaves: 3,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.04, 0.96, 0.80, 'main', false),
      scaledPlatform(width, height, 0.12, 0.32, 0.57, 'soft'),
      scaledPlatform(width, height, 0.40, 0.60, 0.40, 'anchor'),
      scaledPlatform(width, height, 0.68, 0.88, 0.57, 'soft')
    ],
    objectiveNodes: (width, height) => [
      objectiveNode(width, height, 0.20, 0.80, 'portal', 'proposal_memory'),
      objectiveNode(width, height, 0.50, 0.40, 'portal', 'proposal_contradiction'),
      objectiveNode(width, height, 0.80, 0.80, 'portal', 'proposal_choice')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.80 },
        { x: width * 0.28, y: height * 0.57 },
        { x: width * 0.38, y: height * 0.80 }
      ],
      enemies: [
        { x: width * 0.80, y: height * 0.80 },
        { x: width * 0.50, y: height * 0.40 },
        { x: width * 0.20, y: height * 0.80 }
      ],
      boss: { x: width * 0.76, y: height * 0.80 }
    }),
    pickups: (width, height) => [
      { x: width * 0.26, y: height * 0.51 },
      { x: width * 0.44, y: height * 0.34 },
      { x: width * 0.56, y: height * 0.34 },
      { x: width * 0.74, y: height * 0.51 },
      { x: width * 0.50, y: height * 0.73 }
    ]
  },
  concert_stage: {
    id: 'concert_stage',
    label: { fr: 'Scene de resonance', en: 'Resonance Stage' },
    tags: ['duel', 'hazard', 'loreArena'],
    objective: 'tempo',
    objectiveTarget: 100,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.05, 0.95, 0.77, 'main', false),
      scaledPlatform(width, height, 0.1, 0.32, 0.55, 'speaker'),
      scaledPlatform(width, height, 0.68, 0.9, 0.55, 'speaker'),
      scaledPlatform(width, height, 0.42, 0.58, 0.38, 'lightRig')
    ],
    hazards: (width, height) => [
      { id: 'pyro_left', type: 'flame', x1: width * 0.31, x2: width * 0.38, y: height * 0.76, damage: 2, cadence: 170 },
      { id: 'pyro_right', type: 'flame', x1: width * 0.62, x2: width * 0.69, y: height * 0.76, damage: 2, cadence: 170 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.77 },
        { x: width * 0.25, y: height * 0.55 },
        { x: width * 0.34, y: height * 0.77 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.77 },
        { x: width * 0.78, y: height * 0.55 },
        { x: width * 0.50, y: height * 0.38 }
      ],
      boss: { x: width * 0.50, y: height * 0.77 }
    }),
    pickups: (width, height) => [
      { x: width * 0.21, y: height * 0.49 },
      { x: width * 0.50, y: height * 0.32 },
      { x: width * 0.79, y: height * 0.49 },
      { x: width * 0.35, y: height * 0.70 },
      { x: width * 0.65, y: height * 0.70 }
    ]
  },
  containment_lab: {
    id: 'containment_lab',
    label: { fr: 'Laboratoire de confinement', en: 'Containment Lab' },
    tags: ['hazard', 'loreArena'],
    objective: 'cleanse',
    objectiveTarget: 100,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.06, 0.94, 0.77, 'main', false),
      scaledPlatform(width, height, 0.12, 0.38, 0.55, 'soft'),
      scaledPlatform(width, height, 0.62, 0.88, 0.55, 'soft'),
      scaledPlatform(width, height, 0.39, 0.61, 0.38, 'soft')
    ],
    hazards: (width, height) => [
      { id: 'bio_cordon', type: 'toxin', x1: width * 0.44, x2: width * 0.56, y: height * 0.76, damage: 2, status: 'infected', cadence: 135 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.77 },
        { x: width * 0.28, y: height * 0.55 },
        { x: width * 0.36, y: height * 0.77 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.77 },
        { x: width * 0.75, y: height * 0.55 },
        { x: width * 0.50, y: height * 0.38 }
      ],
      boss: { x: width * 0.76, y: height * 0.77 }
    }),
    pickups: (width, height) => [
      { x: width * 0.25, y: height * 0.49 },
      { x: width * 0.50, y: height * 0.32 },
      { x: width * 0.75, y: height * 0.49 },
      { x: width * 0.30, y: height * 0.70 },
      { x: width * 0.70, y: height * 0.70 }
    ]
  },
  hive_corridor: {
    id: 'hive_corridor',
    label: { fr: 'Couloir de ruche acide', en: 'Acid Hive Corridor' },
    tags: ['hazard', 'loreArena', 'asymmetric'],
    objective: 'survival',
    objectiveTarget: 900,
    gravity: 0.24,
    jump: -7.6,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.05, 0.95, 0.78, 'main', false),
      scaledPlatform(width, height, 0.12, 0.36, 0.58, 'soft'),
      scaledPlatform(width, height, 0.48, 0.76, 0.47, 'soft'),
      scaledPlatform(width, height, 0.22, 0.44, 0.33, 'soft'),
      scaledPlatform(width, height, 0.72, 0.9, 0.3, 'soft')
    ],
    hazards: (width, height) => [
      { id: 'acid_left', type: 'acid', x1: width * 0.36, x2: width * 0.45, y: height * 0.77, damage: 2, status: 'infected', cadence: 150 },
      { id: 'acid_right', type: 'acid', x1: width * 0.76, x2: width * 0.84, y: height * 0.77, damage: 2, status: 'infected', cadence: 180 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.16, y: height * 0.78 },
        { x: width * 0.25, y: height * 0.58 },
        { x: width * 0.34, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.84, y: height * 0.78 },
        { x: width * 0.63, y: height * 0.47 },
        { x: width * 0.80, y: height * 0.3 }
      ],
      boss: { x: width * 0.72, y: height * 0.47 }
    }),
    pickups: (width, height) => [
      { x: width * 0.24, y: height * 0.52 },
      { x: width * 0.60, y: height * 0.41 },
      { x: width * 0.34, y: height * 0.27 },
      { x: width * 0.82, y: height * 0.24 },
      { x: width * 0.55, y: height * 0.71 }
    ]
  },
  city_rooftops: {
    id: 'city_rooftops',
    label: { fr: 'Toits urbains en rupture', en: 'Fractured City Rooftops' },
    tags: ['urban', 'mobile', 'loreArena'],
    objective: 'capture',
    objectiveTarget: 100,
    gravity: 0.245,
    jump: -7.9,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.05, 0.36, 0.79, 'main', false),
      scaledPlatform(width, height, 0.45, 0.95, 0.76, 'main', false),
      scaledPlatform(width, height, 0.16, 0.43, 0.56, 'soft'),
      scaledPlatform(width, height, 0.58, 0.84, 0.48, 'soft'),
      scaledPlatform(width, height, 0.36, 0.57, 0.33, 'soft')
    ],
    hazards: (width, height) => [
      { id: 'neon_gap', type: 'rift', x1: width * 0.37, x2: width * 0.45, y: height * 0.77, damage: 2, knockX: 3, knockY: -5, cadence: 150 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.16, y: height * 0.79 },
        { x: width * 0.25, y: height * 0.56 },
        { x: width * 0.34, y: height * 0.79 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.76 },
        { x: width * 0.70, y: height * 0.48 },
        { x: width * 0.46, y: height * 0.33 }
      ],
      boss: { x: width * 0.74, y: height * 0.76 }
    }),
    pickups: (width, height) => [
      { x: width * 0.24, y: height * 0.50 },
      { x: width * 0.47, y: height * 0.27 },
      { x: width * 0.71, y: height * 0.42 },
      { x: width * 0.22, y: height * 0.72 },
      { x: width * 0.76, y: height * 0.69 }
    ]
  },
  absurd_party: {
    id: 'absurd_party',
    label: { fr: 'Plateau absurde instable', en: 'Unstable Absurd Stage' },
    tags: ['chaotic', 'comedy', 'loreArena'],
    objective: 'tempo',
    objectiveTarget: 100,
    gravity: 0.235,
    jump: -8.0,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.06, 0.94, 0.78, 'main', false),
      scaledPlatform(width, height, 0.10, 0.31, 0.57, 'prop'),
      scaledPlatform(width, height, 0.39, 0.60, 0.45, 'prop'),
      scaledPlatform(width, height, 0.69, 0.90, 0.57, 'prop'),
      scaledPlatform(width, height, 0.25, 0.42, 0.29, 'prop'),
      scaledPlatform(width, height, 0.58, 0.75, 0.29, 'prop')
    ],
    hazards: (width, height) => [
      { id: 'gag_flux_left', type: 'gag', x1: width * 0.23, x2: width * 0.33, y: height * 0.77, damage: 1, knockX: 5, knockY: -4, cadence: 95 },
      { id: 'gag_flux_right', type: 'gag', x1: width * 0.67, x2: width * 0.77, y: height * 0.77, damage: 1, knockX: 5, knockY: -4, cadence: 125 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.78 },
        { x: width * 0.28, y: height * 0.57 },
        { x: width * 0.39, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.78 },
        { x: width * 0.74, y: height * 0.57 },
        { x: width * 0.50, y: height * 0.45 }
      ],
      boss: { x: width * 0.50, y: height * 0.45 }
    }),
    pickups: (width, height) => [
      { x: width * 0.20, y: height * 0.51 },
      { x: width * 0.50, y: height * 0.39 },
      { x: width * 0.80, y: height * 0.51 },
      { x: width * 0.33, y: height * 0.23 },
      { x: width * 0.67, y: height * 0.23 }
    ]
  },
  arcane_ruins: {
    id: 'arcane_ruins',
    label: { fr: 'Ruines arcaniques en hauteur', en: 'Arcane High Ruins' },
    tags: ['arcane', 'platformHeavy', 'loreArena'],
    objective: 'capture',
    objectiveTarget: 100,
    gravity: 0.23,
    jump: -8.15,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.08, 0.92, 0.80, 'main', false),
      scaledPlatform(width, height, 0.13, 0.35, 0.60, 'rune'),
      scaledPlatform(width, height, 0.65, 0.87, 0.60, 'rune'),
      scaledPlatform(width, height, 0.39, 0.61, 0.43, 'rune'),
      scaledPlatform(width, height, 0.20, 0.42, 0.27, 'rune'),
      scaledPlatform(width, height, 0.58, 0.80, 0.27, 'rune')
    ],
    hazards: (width, height) => [
      { id: 'rune_surge', type: 'rune', x1: width * 0.43, x2: width * 0.57, y: height * 0.79, damage: 2, status: 'glitched', cadence: 160 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.17, y: height * 0.80 },
        { x: width * 0.28, y: height * 0.60 },
        { x: width * 0.42, y: height * 0.43 }
      ],
      enemies: [
        { x: width * 0.83, y: height * 0.80 },
        { x: width * 0.74, y: height * 0.60 },
        { x: width * 0.69, y: height * 0.27 }
      ],
      boss: { x: width * 0.50, y: height * 0.43 }
    }),
    pickups: (width, height) => [
      { x: width * 0.24, y: height * 0.54 },
      { x: width * 0.50, y: height * 0.37 },
      { x: width * 0.76, y: height * 0.54 },
      { x: width * 0.31, y: height * 0.21 },
      { x: width * 0.69, y: height * 0.21 }
    ]
  },
  war_front: {
    id: 'war_front',
    label: { fr: 'Front tactique fracture', en: 'Fractured Tactical Front' },
    tags: ['wide', 'cover', 'loreArena'],
    objective: 'waves',
    objectiveTarget: 4,
    gravity: 0.255,
    jump: -7.5,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.04, 0.96, 0.78, 'main', false),
      scaledPlatform(width, height, 0.10, 0.28, 0.60, 'cover'),
      scaledPlatform(width, height, 0.36, 0.55, 0.50, 'cover'),
      scaledPlatform(width, height, 0.68, 0.88, 0.60, 'cover'),
      scaledPlatform(width, height, 0.44, 0.62, 0.32, 'cover')
    ],
    hazards: (width, height) => [
      { id: 'orbital_warning', type: 'blast', x1: width * 0.48, x2: width * 0.59, y: height * 0.77, damage: 3, knockX: 4, knockY: -6, cadence: 180 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.16, y: height * 0.78 },
        { x: width * 0.25, y: height * 0.60 },
        { x: width * 0.34, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.84, y: height * 0.78 },
        { x: width * 0.77, y: height * 0.60 },
        { x: width * 0.52, y: height * 0.32 }
      ],
      boss: { x: width * 0.76, y: height * 0.78 }
    }),
    pickups: (width, height) => [
      { x: width * 0.19, y: height * 0.54 },
      { x: width * 0.45, y: height * 0.44 },
      { x: width * 0.78, y: height * 0.54 },
      { x: width * 0.53, y: height * 0.26 },
      { x: width * 0.62, y: height * 0.71 }
    ]
  },
  artifact_bastion: {
    id: 'artifact_bastion',
    label: { fr: 'Bastion d artefact A.R.C.A.', en: 'A.R.C.A. Artifact Bastion' },
    tags: ['defense', 'loreArena', 'platformHeavy'],
    objective: 'protect',
    objectiveTarget: 720,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.06, 0.94, 0.78, 'main', false),
      scaledPlatform(width, height, 0.18, 0.38, 0.57, 'soft'),
      scaledPlatform(width, height, 0.62, 0.82, 0.57, 'soft'),
      scaledPlatform(width, height, 0.40, 0.60, 0.42, 'anchor')
    ],
    objectiveNodes: (width, height) => [
      objectiveNode(width, height, 0.50, 0.42, 'artifact', 'anchor_artifact')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.24, y: height * 0.78 },
        { x: width * 0.44, y: height * 0.42 },
        { x: width * 0.32, y: height * 0.57 }
      ],
      enemies: [
        { x: width * 0.84, y: height * 0.78 },
        { x: width * 0.76, y: height * 0.57 },
        { x: width * 0.16, y: height * 0.78 }
      ],
      boss: { x: width * 0.78, y: height * 0.78 }
    }),
    pickups: (width, height) => [
      { x: width * 0.30, y: height * 0.71 },
      { x: width * 0.46, y: height * 0.36 },
      { x: width * 0.70, y: height * 0.51 },
      { x: width * 0.82, y: height * 0.71 },
      { x: width * 0.20, y: height * 0.51 }
    ]
  },
  artifact_sweep: {
    id: 'artifact_sweep',
    label: { fr: 'Chasse aux fragments Nexus', en: 'Nexus Fragment Sweep' },
    tags: ['mobile', 'loreArena', 'chaotic'],
    objective: 'collect',
    objectiveTarget: 3,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.06, 0.94, 0.78, 'main', false),
      scaledPlatform(width, height, 0.12, 0.34, 0.58, 'soft'),
      scaledPlatform(width, height, 0.42, 0.58, 0.42, 'soft'),
      scaledPlatform(width, height, 0.66, 0.88, 0.58, 'soft'),
      scaledPlatform(width, height, 0.22, 0.40, 0.28, 'soft'),
      scaledPlatform(width, height, 0.60, 0.78, 0.28, 'soft')
    ],
    objectiveNodes: (width, height) => [
      objectiveNode(width, height, 0.24, 0.52, 'shard', 'shard_a'),
      objectiveNode(width, height, 0.50, 0.36, 'shard', 'shard_b'),
      objectiveNode(width, height, 0.76, 0.52, 'shard', 'shard_c')
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.16, y: height * 0.78 },
        { x: width * 0.24, y: height * 0.58 },
        { x: width * 0.34, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.84, y: height * 0.78 },
        { x: width * 0.72, y: height * 0.58 },
        { x: width * 0.64, y: height * 0.28 }
      ],
      boss: { x: width * 0.80, y: height * 0.78 }
    }),
    pickups: (width, height) => [
      { x: width * 0.22, y: height * 0.52 },
      { x: width * 0.50, y: height * 0.36 },
      { x: width * 0.78, y: height * 0.52 },
      { x: width * 0.31, y: height * 0.22 },
      { x: width * 0.69, y: height * 0.22 }
    ]
  },
  portal_lockdown: {
    id: 'portal_lockdown',
    label: { fr: 'Verrouillage de portails hostiles', en: 'Hostile Portal Lockdown' },
    tags: ['portalSpawn', 'hazard', 'loreArena'],
    objective: 'portals',
    objectiveTarget: 3,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.05, 0.95, 0.78, 'main', false),
      scaledPlatform(width, height, 0.14, 0.36, 0.57, 'soft'),
      scaledPlatform(width, height, 0.64, 0.86, 0.57, 'soft'),
      scaledPlatform(width, height, 0.40, 0.60, 0.37, 'soft')
    ],
    objectiveNodes: (width, height) => [
      objectiveNode(width, height, 0.18, 0.78, 'portal', 'portal_left'),
      objectiveNode(width, height, 0.50, 0.37, 'portal', 'portal_top'),
      objectiveNode(width, height, 0.82, 0.78, 'portal', 'portal_right')
    ],
    hazards: (width, height) => [
      { id: 'portal_surge', type: 'rift', x1: width * 0.45, x2: width * 0.55, y: height * 0.77, damage: 2, status: 'glitched', cadence: 125 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.28, y: height * 0.78 },
        { x: width * 0.36, y: height * 0.57 },
        { x: width * 0.44, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.78 },
        { x: width * 0.50, y: height * 0.37 },
        { x: width * 0.18, y: height * 0.78 }
      ],
      boss: { x: width * 0.82, y: height * 0.78 }
    }),
    pickups: (width, height) => [
      { x: width * 0.31, y: height * 0.51 },
      { x: width * 0.50, y: height * 0.31 },
      { x: width * 0.69, y: height * 0.51 },
      { x: width * 0.24, y: height * 0.71 },
      { x: width * 0.76, y: height * 0.71 }
    ]
  },
  boss_overload: {
    id: 'boss_overload',
    label: { fr: 'Surcharge de champion', en: 'Champion Overload' },
    tags: ['bossArena', 'survival', 'loreArena'],
    objective: 'overload',
    objectiveTarget: 960,
    maxWaves: 4,
    platforms: (width, height) => [
      scaledPlatform(width, height, 0.04, 0.96, 0.78, 'main', false),
      scaledPlatform(width, height, 0.18, 0.34, 0.56, 'soft'),
      scaledPlatform(width, height, 0.66, 0.82, 0.56, 'soft'),
      scaledPlatform(width, height, 0.43, 0.57, 0.38, 'soft')
    ],
    hazards: (width, height) => [
      { id: 'overload_left', type: 'blast', x1: width * 0.14, x2: width * 0.24, y: height * 0.77, damage: 2, knockX: 5, knockY: -5, cadence: 150 },
      { id: 'overload_right', type: 'blast', x1: width * 0.76, x2: width * 0.86, y: height * 0.77, damage: 2, knockX: 5, knockY: -5, cadence: 170 }
    ],
    spawns: (width, height) => ({
      heroes: [
        { x: width * 0.18, y: height * 0.78 },
        { x: width * 0.26, y: height * 0.78 },
        { x: width * 0.34, y: height * 0.78 }
      ],
      enemies: [
        { x: width * 0.82, y: height * 0.78 },
        { x: width * 0.73, y: height * 0.56 },
        { x: width * 0.50, y: height * 0.38 }
      ],
      boss: { x: width * 0.74, y: height * 0.78 }
    }),
    pickups: (width, height) => [
      { x: width * 0.23, y: height * 0.71 },
      { x: width * 0.30, y: height * 0.50 },
      { x: width * 0.70, y: height * 0.50 },
      { x: width * 0.50, y: height * 0.32 },
      { x: width * 0.78, y: height * 0.71 }
    ]
  }
};

const ALIEN_UNIVERSES = ['Alien', 'Aliens', 'Alien 3', 'Alien Resurrection', 'Alien: Covenant', 'Alien: Romulus', 'Prometheus', 'Alien vs Predator', 'Aliens vs Predator: Requiem'];
const MUSIC_UNIVERSES = ['Vocaloid', 'Rammstein', 'System of a Down', 'Rob Zombie', 'Daft Punk', 'Oliver Tree', 'Linkin Park', 'Michael Jackson', 'Moonwalker', 'Die Antwoord', 'Tenacious D'];
const HORROR_LAB_UNIVERSES = ['Resident Evil', 'Dino Crisis', 'Toxic Avenger', 'The Thing', 'Virus', 'House of the Dead', 'Rec', 'Re-Animator'];
const HUNT_UNIVERSES = ['Predator', 'Predator 2', 'Predators', 'Prey', 'The Predator', 'Predator: Badlands', 'Predator: Killer of Killers', 'Alien vs Predator', 'Aliens vs Predator: Requiem'];
const VERTICAL_UNIVERSES = ['Ghost in the Shell', 'The Matrix', 'Digital Circus', 'Portal', 'Halo', 'Attack on Titan', 'Dandadan', 'Gunnm', 'Unreal'];
const PIT_UNIVERSES = ['Silent Hill', 'Hellraiser', 'Saw', 'Slender Man', 'Uzumaki', 'From', 'Terrifier', 'Chucky', 'Evil Dead'];
const DUEL_UNIVERSES = ['Guilty Gear', 'BlazBlue', 'Yu-Gi-Oh', 'Kung Pow', 'Onechanbara', 'Star Wars', 'Joker New 52', 'The Batman Who Laughs'];
const BOSS_UNIVERSES = ['Godzilla The Animated Series', 'Cloverfield', 'Tremors', 'War of the Worlds - Steven Spielberg', 'The War of the Worlds', 'Mars Attacks', 'Skyline'];
const ARCANE_UNIVERSES = ['Discworld', 'Kaamelott', 'Dungeon Meshi', 'Negima!', 'Rosario + Vampire', 'Overlord the Anime', 'Inuyasha', 'Voyage de Chihiro', 'Hazbin Hotel'];
const ABSURD_UNIVERSES = ['Velocipastor', 'Rubber', 'Sausage Party', 'Spermageddon', 'Killer Tomatoes from Outer Space', 'Sharknado', 'Pingu', 'Pee-wee', 'Kung Pow', 'Les Feebles', 'Kazaam', 'Spoof Movie', 'Grrrrrrrrrrrrrrrrr', 'Les Tuche', 'Camera Cafe', 'Samantha Oups', 'Les Chevaliers du Fiel', 'Les Inconnus', 'La Cite de la Peur', 'Les Visiteurs'];
const WAR_FRONT_UNIVERSES = ['Halo', 'Borderlands', 'Starship Troopers', 'Defiance', 'Banlieue 13', 'Doom', 'Mass Effect', 'Gears of War', 'Stargate', 'Warhammer 40K', 'Terminator'];
const CITY_UNIVERSES = ['Ghostbusters', 'Le Cinquieme Element', 'M3GAN', 'Malcolm in the Middle', 'The Visitor from the Future', 'Camera Cafe', 'La Cite de la Peur', 'Roger Rabbit'];

const getUniverseSignature = (universe) => EXPANDED_UNIVERSE_SIGNATURES[universe] || null;

const getStageSearchText = (stage = {}, signature = null) => [
  stage.universe,
  stage.name,
  stage.displayName?.fr,
  stage.displayName?.en,
  stage.bossName,
  stage.description,
  signature?.mediaType,
  signature?.faction,
  signature?.theme,
  signature?.stageName,
  signature?.bossName
].filter(Boolean).join(' ').toLowerCase();

const textMatches = (text, patterns) => patterns.some(pattern => pattern.test(text));
const hasExpandedFaction = (signature, faction) => signature?.faction === faction;
const hasExpandedMedia = (signature, mediaType) => signature?.mediaType === mediaType;

function getArenaIdForStage(stage = {}) {
  const universe = stage.universe || '';
  const signature = getUniverseSignature(universe);
  const recentProfile = stage.forceBaseArena || stage.dlcSuppressedArena
    ? null
    : getRecentUniverseLevelProfile(universe);
  const missionText = [
    stage.name,
    stage.displayName?.fr,
    stage.displayName?.en,
    stage.bossName,
    stage.description
  ].filter(Boolean).join(' ').toLowerCase();
  const searchText = getStageSearchText(stage, signature);
  if (stage.forceBaseArena || stage.dlcSuppressedArena) return 'training_flat';
  if (stage.smashArenaId && SMASH_ARENA_LAYOUTS[stage.smashArenaId]) return stage.smashArenaId;
  if (stage.isSurvival) return 'split_pit';
  if (textMatches(missionText, [/artifact/, /artefact/, /anchor/, /ancrage/, /relic defense/, /protect/])) return 'artifact_bastion';
  if (textMatches(missionText, [/fragment/, /collect/, /recuper/, /sweep/, /cache/])) return 'artifact_sweep';
  if (textMatches(missionText, [/portal/, /portail/, /spawn gate/, /lockdown/])) return 'portal_lockdown';
  if (textMatches(missionText, [/overload/, /surcharge/, /reactor/, /core meltdown/])) return 'boss_overload';
  if (recentProfile?.melee?.layout) return recentProfile.melee.layout;
  if (ALIEN_UNIVERSES.includes(universe)) return 'hive_corridor';
  if (BOSS_UNIVERSES.includes(universe) || textMatches(searchText, [/kaiju/, /titan/, /colossal/, /behemoth/, /tripod/, /scarab/, /godzilla/, /cloverfield/])) return 'boss_coliseum';
  if (MUSIC_UNIVERSES.includes(universe)) return 'concert_stage';
  if (HORROR_LAB_UNIVERSES.includes(universe) || textMatches(searchText, [/laboratory/, /lab/, /infection/, /virus/, /mutation/, /toxic/, /biohazard/])) return 'containment_lab';
  if (HUNT_UNIVERSES.includes(universe)) return 'asym_hunt';
  if (PIT_UNIVERSES.includes(universe) || textMatches(searchText, [/nightmare/, /spiral/, /curse/, /haunt/, /grudge/, /ring/, /sinister/])) return 'split_pit';
  if (VERTICAL_UNIVERSES.includes(universe) || textMatches(searchText, [/tower/, /skyline/, /vertical/, /cyber/, /matrix/, /titan wall/])) return 'vertical_tower';
  if (DUEL_UNIVERSES.includes(universe)) return 'triplat_duel';
  if (WAR_FRONT_UNIVERSES.includes(universe) || hasExpandedFaction(signature, 'sciFi') || textMatches(searchText, [/war/, /marine/, /soldier/, /battle/, /front/, /trooper/, /covenant/, /borderlands/])) return 'war_front';
  if (ARCANE_UNIVERSES.includes(universe) || hasExpandedFaction(signature, 'arcane') || textMatches(searchText, [/arcane/, /magic/, /dungeon/, /castle/, /grail/, /wizard/, /witch/, /vampire/])) return 'arcane_ruins';
  if (ABSURD_UNIVERSES.includes(universe) || hasExpandedFaction(signature, 'absurd') || textMatches(searchText, [/absurd/, /comedy/, /parody/, /gag/, /party/, /food/, /toy/, /rubber/, /pneu/, /pingu/])) return 'absurd_party';
  if (CITY_UNIVERSES.includes(universe) || hasExpandedMedia(signature, 'series') || textMatches(searchText, [/city/, /gotham/, /office/, /rooftop/, /urban/, /police/, /cafe/])) return 'city_rooftops';
  if (stage.difficulty === 'Very Hard' || stage.difficulty === 'Hard') return 'boss_coliseum';
  return 'training_flat';
}

export function createSmashArena(stage, width, height) {
  const arenaId = getArenaIdForStage(stage);
  const base = SMASH_ARENA_LAYOUTS[arenaId] || SMASH_ARENA_LAYOUTS.training_flat;
  const topologyProfile = resolveStageTopologyProfile(stage, base.id);
  const recentProfile = stage.forceBaseArena || stage.dlcSuppressedArena
    ? null
    : getRecentUniverseLevelProfile(stage.universe);
  const topologyPlatforms = decoratePlatformsForTopology(
    base.platforms(width, height),
    topologyProfile,
    width,
    height
  );
  const platforms = topologyPlatforms.map(p => ({
    ...p,
    x1: clamp(p.x1, 12, width - 24),
    x2: clamp(p.x2, 24, width - 12),
    y: clamp(p.y, 58, height - 24),
    textureId: recentProfile?.melee?.platformTexture || null,
    surface: recentProfile?.material || null
  }));
  const spawnData = base.spawns(width, height);
  const safePickups = base.pickups(width, height).map(pos => ({
    x: Math.round(clamp(pos.x, 36, width - 36)),
    y: Math.round(clamp(pos.y, 46, height - 38))
  }));
  const objectiveNodes = base.objectiveNodes ? base.objectiveNodes(width, height).map(node => ({
    ...node,
    x: Math.round(clamp(node.x, 36, width - 36)),
    y: Math.round(clamp(node.y, 46, height - 38))
  })) : [];
  return {
    ...base,
    platforms,
    objectiveNodes,
    hazards: base.hazards ? base.hazards(width, height) : [],
    spawns: spawnData,
    pickups: safePickups,
    groundY: platforms[0]?.y || Math.round(height * 0.76),
    levelProfile: recentProfile?.melee || null,
    topologyId: topologyProfile.topologyId,
    stageVariant: topologyProfile.variant,
    eventIntensity: topologyProfile.eventIntensity,
    requestedEventIntensity: topologyProfile.requestedIntensity,
    topologyProfile,
    theme: getSmashArenaTheme(stage, base)
  };
}

export function getSmashPickupPositions(stage, width = 760, height = 360) {
  return createSmashArena(stage, width, height).pickups;
}

export function getSmashArenaTheme(stage = {}, arena = {}) {
  const universe = stage.universe || '';
  const recentProfile = stage.forceBaseArena || stage.dlcSuppressedArena
    ? null
    : getRecentUniverseLevelProfile(universe);
  if (recentProfile) return {
    material: recentProfile.material.pattern,
    accent: recentProfile.material.edge,
    secondary: recentProfile.material.detail,
    danger: recentProfile.material.danger,
    surface: recentProfile.material,
    platformTexture: recentProfile.melee.platformTexture,
    levelName: recentProfile.melee.name
  };
  if (arena.id === 'oc_authorless_finale') return { material: 'palimpsest', accent: '#f3eee2', secondary: '#7df9ff', danger: '#ff5b6e' };
  if (ALIEN_UNIVERSES.includes(universe) || arena.id === 'hive_corridor') return { material: 'hive', accent: '#86ffb0', secondary: '#1a5f4a', danger: '#b6ff38' };
  if (MUSIC_UNIVERSES.includes(universe) || arena.id === 'concert_stage') return { material: 'concert', accent: '#ff4fd8', secondary: '#ffe15a', danger: '#ff5b2e' };
  if (HORROR_LAB_UNIVERSES.includes(universe) || arena.id === 'containment_lab') return { material: 'lab', accent: '#61ff59', secondary: '#d7fff0', danger: '#61ff59' };
  if (HUNT_UNIVERSES.includes(universe) || arena.id === 'asym_hunt') return { material: 'jungle', accent: '#9cff5a', secondary: '#c49a5a', danger: '#ff653d' };
  if (PIT_UNIVERSES.includes(universe) || arena.id === 'split_pit') return { material: 'horror', accent: '#b9b09d', secondary: '#7a241f', danger: '#d72f2f' };
  if (VERTICAL_UNIVERSES.includes(universe) || arena.id === 'vertical_tower') return { material: 'cyber', accent: '#39c5bb', secondary: '#8dffea', danger: '#00ff66' };
  if (DUEL_UNIVERSES.includes(universe) || arena.id === 'triplat_duel') return { material: 'duel', accent: '#f2c744', secondary: '#b56dff', danger: '#ff4d4d' };
  if (arena.id === 'boss_coliseum') return { material: 'coliseum', accent: '#ff9f43', secondary: '#f8d28a', danger: '#ff3b30' };
  if (arena.id === 'city_rooftops') return { material: 'city', accent: '#4fd7ff', secondary: '#ffd166', danger: '#ff5b5b' };
  if (arena.id === 'absurd_party') return { material: 'absurd', accent: '#ff6bd6', secondary: '#f7ff5a', danger: '#39ff88' };
  if (arena.id === 'arcane_ruins') return { material: 'arcane', accent: '#d6a8ff', secondary: '#ffe08a', danger: '#ff7a3d' };
  if (arena.id === 'war_front') return { material: 'war', accent: '#8fb3ff', secondary: '#c8d3d8', danger: '#ff9f43' };
  return { material: 'nexus', accent: '#39c5bb', secondary: '#8dffea', danger: '#ff4500' };
}

export function getSmashObjectiveText(arena, lang = 'fr') {
  const objectives = {
    waves: { fr: 'Tenir les vagues et briser le champion local.', en: 'Hold the waves and break the local champion.' },
    survival: { fr: 'Survivre a la pression de terrain sans perdre l escouade.', en: 'Survive field pressure without losing the squad.' },
    hunt: { fr: 'Lire les hauteurs, couper la traque et forcer le predateur a sortir.', en: 'Read the high ground, cut the hunt, and force the predator out.' },
    boss: { fr: 'Ouvrir l arene, gerer les renforts, puis isoler le boss.', en: 'Open the arena, manage reinforcements, then isolate the boss.' },
    overload: { fr: 'Abattre le champion avant que la zone de projection ne surcharge.', en: 'Break the champion before the projection zone overloads.' },
    tempo: { fr: 'Garder le tempo, eviter la pyrotechnie et charger les specials.', en: 'Keep tempo, avoid pyrotechnics, and charge specials.' },
    cleanse: { fr: 'Nettoyer les vagues avant que le cordon ne contamine la zone.', en: 'Clean waves before the cordon contaminates the zone.' },
    capture: { fr: 'Controler les etages pour empecher les renforts de dominer la hauteur.', en: 'Control levels to keep reinforcements from owning high ground.' },
    protect: { fr: 'Proteger l artefact d ancrage jusqu a stabilisation A.R.C.A.', en: 'Protect the anchor artifact until A.R.C.A. stabilization.' },
    collect: { fr: 'Recuperer trois fragments Nexus avant que les renforts ne verrouillent la zone.', en: 'Recover three Nexus fragments before reinforcements lock the zone.' },
    portals: { fr: 'Nettoyer les portails de renfort hostile au contact direct.', en: 'Clean hostile reinforcement portals by direct contact.' }
  };
  return (objectives[arena?.objective] || objectives.waves)[lang];
}

export function getSmashObjectiveLabel(arena, lang = 'fr') {
  const labels = {
    waves: { fr: 'Vagues', en: 'Waves' },
    survival: { fr: 'Survie', en: 'Survival' },
    hunt: { fr: 'Traque', en: 'Hunt' },
    boss: { fr: 'Boss', en: 'Boss' },
    overload: { fr: 'Surcharge', en: 'Overload' },
    tempo: { fr: 'Tempo', en: 'Tempo' },
    cleanse: { fr: 'Cordon', en: 'Cordon' },
    capture: { fr: 'Controle', en: 'Control' },
    protect: { fr: 'Artefact', en: 'Artifact' },
    collect: { fr: 'Fragments', en: 'Fragments' },
    portals: { fr: 'Portails', en: 'Portals' }
  };
  return (labels[arena?.objective] || labels.waves)[lang];
}
