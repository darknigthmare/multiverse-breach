import { COMBAT_SOURCE_DEFINITIONS_WAVE11 } from './combat/combatSourceDefinitionsWave11.js';
import characterSpriteCorrectionsWave11A from './combat/characterSpriteCorrectionsWave11PartA.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave11B from './combat/characterSpriteCorrectionsWave11PartB.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave11C from './combat/characterSpriteCorrectionsWave11PartC.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave11D from './combat/characterSpriteCorrectionsWave11PartD.generated.json' with { type: 'json' };
import { LEGACY_POSE_FALLBACKS_WAVE11 } from './combat/characterLegacyFallbacksWave11.js';
import characterPresentationWave10D from './combat/characterAnimationsWave10PartD.generated.json' with { type: 'json' };
import { buildPresentationFallbacksWave10 } from './combat/characterPresentationFallbacksWave10.js';
import {
  getMeleeAnimationFrame,
  getMeleeAnimationManifest,
  getMeleeAnimationSheetSources,
  getMeleeSheetLayout
} from './melee/meleeAnimationManifest.js';
import characterSpriteCorrections from './combat/characterSpriteCorrections.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave2 from './combat/characterSpriteCorrectionsWave2.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave4 from './combat/characterSpriteCorrectionsWave4.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave5 from './combat/characterSpriteCorrectionsWave5.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave6A from './combat/characterSpriteCorrectionsWave6PartA.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave6B from './combat/characterSpriteCorrectionsWave6PartB.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave6C from './combat/characterSpriteCorrectionsWave6PartC.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave7A from './combat/characterSpriteCorrectionsWave7PartA.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave7B from './combat/characterSpriteCorrectionsWave7PartB.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave7C from './combat/characterSpriteCorrectionsWave7PartC.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave8B from './combat/characterSpriteCorrectionsWave8PartB.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave8A from './combat/characterSpriteCorrectionsWave8PartA.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave8C from './combat/characterSpriteCorrectionsWave8PartC.generated.json' with { type: 'json' };
import characterSpriteCorrectionsWave8D from './combat/characterSpriteCorrectionsWave8PartD.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave9B from './combat/characterSpriteCorrectionsWave9PartB.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave9C from './combat/characterSpriteCorrectionsWave9PartC.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave9A from './combat/characterSpriteCorrectionsWave9PartA.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave9D from './combat/characterSpriteCorrectionsWave9PartD.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave10A from './combat/characterSpriteCorrectionsWave10PartA.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave10B from './combat/characterSpriteCorrectionsWave10PartB.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave10C from './combat/characterSpriteCorrectionsWave10PartC.generated.json' with { type: 'json' };

import characterSpriteCorrectionsWave10D from './combat/characterSpriteCorrectionsWave10PartD.generated.json' with { type: 'json' };

const wave6BaseEntries = [...characterSpriteCorrectionsWave6A.entries, ...characterSpriteCorrectionsWave6B.entries, ...characterSpriteCorrectionsWave6C.entries];
const calibratedBaseEntries = [...wave6BaseEntries, ...characterSpriteCorrectionsWave7A.entries, ...characterSpriteCorrectionsWave7B.entries, ...characterSpriteCorrectionsWave7C.entries, ...characterSpriteCorrectionsWave8A.entries, ...characterSpriteCorrectionsWave8B.entries, ...characterSpriteCorrectionsWave8C.entries, ...characterSpriteCorrectionsWave8D.entries, ...characterSpriteCorrectionsWave9A.entries, ...characterSpriteCorrectionsWave9B.entries, ...characterSpriteCorrectionsWave9C.entries, ...characterSpriteCorrectionsWave9D.entries, ...characterSpriteCorrectionsWave10D.entries, ...characterSpriteCorrectionsWave10C.entries, ...characterSpriteCorrectionsWave10B.entries, ...characterSpriteCorrectionsWave10A.entries, ...characterSpriteCorrectionsWave11A.entries, ...characterSpriteCorrectionsWave11B.entries, ...characterSpriteCorrectionsWave11C.entries, ...characterSpriteCorrectionsWave11D.entries];
const correctedCharacterSprites = new Map([...characterSpriteCorrections.entries, ...characterSpriteCorrectionsWave2.entries, ...characterSpriteCorrectionsWave4.entries, ...characterSpriteCorrectionsWave5.entries, ...calibratedBaseEntries].map(entry => [entry.heroId, entry]));
const calmSupportSheetsWave11 = new Set(Object.entries(COMBAT_SOURCE_DEFINITIONS_WAVE11)
  .filter(([, source]) => source.effect === 'damage')
  .map(([id]) => correctedCharacterSprites.get(id)?.sheet || (id === 'harry_potter' ? '/sprites/generated/heroes/harry-potter/harry-potter.png' : null)).filter(Boolean));

const calibratedBaseLayouts = Object.fromEntries(calibratedBaseEntries.map(entry => [entry.sheet, {
  columns: entry.columns, rows: entry.rows,
  rowByState: Object.fromEntries(Object.entries(entry.states).map(([state, spec]) => [state, spec.row])),
  baseline: entry.normalization.baseline,
  renderScaleByRow: Object.fromEntries(entry.normalization.rows.map((row, index) => [index, row.renderScale ?? 1]))
}]));

const adaptedPresentationEntriesWave10 = buildPresentationFallbacksWave10(characterPresentationWave10D.entries);
const adaptedPresentationSpritesWave10 = new Map(adaptedPresentationEntriesWave10.map(entry => [entry.heroId, entry]));
const adaptedPresentationLayoutsWave10 = Object.fromEntries(adaptedPresentationEntriesWave10.map(entry => [entry.sheet, entry.layout]));

const blockedLegacySourcesWave11 = new Map([...LEGACY_POSE_FALLBACKS_WAVE11,
  { heroId: 'harry_potter', universe: 'Harry Potter', sheet: '/sprites/generated/heroes/harry-potter/harry-potter.png' }
].map(entry => [entry.heroId, entry]));

const legacyPoseFallbackLayoutsWave11 = Object.fromEntries(LEGACY_POSE_FALLBACKS_WAVE11.map(entry => [entry.sheet, entry.layout]));

export const SPRITE_SHEET_META = {
  frameWidth: 256,
  frameHeight: 256,
  columns: 4,
  rows: ['idle', 'run', 'attack', 'hit']
};

export const slugifyAsset = (value) => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

export const MIRELLE_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-mirelle-complete';
export const BASTION_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-bastion-complete';
export const NOVA_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-nova-complete';
export const MARROW_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-marrow-complete';
export const SERJ_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/system-of-a-down/serj-tankian-complete';
export const BUCKET_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/buckhead/bucket-guitar-echo-complete';
export const ARTHUR_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/kaamelott/arthur-kaamelott-complete';
export const HALO_COMPLETE_SPRITE_BASES = {
  masterchief: '/sprites/generated/heroes/halo/master-chief-complete',
  arbiter: '/sprites/generated/heroes/halo/arbiter-complete',
  johnson: '/sprites/generated/heroes/halo/avery-johnson-complete'
};

export const ROI_BURGONDE_BOSS_SPRITE = '/sprites/generated/bosses/kaamelott/roi-burgonde.png';

export const MIRELLE_COMPLETE_SPRITES = {
  rpg: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-rpg.png`,
  tactics: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-tactics.png`,
  meleeMovement: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-melee-movement.png`,
  meleeCombat: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-melee-combat.png`,
  nexusCollection: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-nexus-collection.png`,
  hudIcons: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-hud-icons.png`,
  hudAvatar: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-hud-avatar.png`,
  itemsVfx: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-items-vfx.png`,
  fpsHands: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-fps-hands.png`,
  fpsEffects: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-fps-effects.png`,
  fpsProjectile: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-fps-projectile.png`,
  kartDirections: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-directions.png`,
  kartActions: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-actions.png`,
  kartItems: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-items.png`,
  kartHudGarage: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-hud-garage.png`,
  kartTrackNexus: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-track-nexus.png`
};

export const MIRELLE_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: MIRELLE_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: MIRELLE_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: MIRELLE_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: MIRELLE_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusCollection', label: 'Nexus / collection', src: MIRELLE_COMPLETE_SPRITES.nexusCollection },
  { id: 'hudIcons', label: 'HUD / icones', src: MIRELLE_COMPLETE_SPRITES.hudIcons },
  { id: 'hudAvatar', label: 'HUD avatar', src: MIRELLE_COMPLETE_SPRITES.hudAvatar },
  { id: 'itemsVfx', label: 'Objets / VFX', src: MIRELLE_COMPLETE_SPRITES.itemsVfx },
  { id: 'fpsHands', label: 'FPS mains', src: MIRELLE_COMPLETE_SPRITES.fpsHands },
  { id: 'fpsEffects', label: 'FPS profondeur / projectiles', src: MIRELLE_COMPLETE_SPRITES.fpsEffects },
  { id: 'fpsProjectile', label: 'FPS projectile recadre', src: MIRELLE_COMPLETE_SPRITES.fpsProjectile },
  { id: 'kartDirections', label: 'Kart directions', src: MIRELLE_COMPLETE_SPRITES.kartDirections },
  { id: 'kartActions', label: 'Kart actions', src: MIRELLE_COMPLETE_SPRITES.kartActions },
  { id: 'kartItems', label: 'Kart objets', src: MIRELLE_COMPLETE_SPRITES.kartItems },
  { id: 'kartHudGarage', label: 'Kart HUD / garage', src: MIRELLE_COMPLETE_SPRITES.kartHudGarage },
  { id: 'kartTrackNexus', label: 'Kart circuit Nexus', src: MIRELLE_COMPLETE_SPRITES.kartTrackNexus }
];

export const SERJ_COMPLETE_SPRITES = {
  rpg: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-rpg.png`,
  tactics: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-tactics.png`,
  meleeMovement: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-melee-movement.png`,
  meleeCombat: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-melee-combat.png`,
  nexusHud: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-nexus-hud.png`,
  fps: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-fps.png`,
  kart: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-kart.png`
};

export const SERJ_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: SERJ_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: SERJ_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: SERJ_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: SERJ_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusHud', label: 'Nexus / HUD', src: SERJ_COMPLETE_SPRITES.nexusHud },
  { id: 'fps', label: 'FPS micro / effets', src: SERJ_COMPLETE_SPRITES.fps },
  { id: 'kart', label: 'Kart', src: SERJ_COMPLETE_SPRITES.kart }
];

export const BUCKET_COMPLETE_SPRITES = {
  rpg: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-rpg.png`,
  tactics: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-tactics.png`,
  meleeMovement: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-melee-movement.png`,
  meleeCombat: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-melee-combat.png`,
  nexusHud: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-nexus-hud.png`,
  fps: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-fps.png`,
  kart: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-kart.png`
};

export const BUCKET_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: BUCKET_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: BUCKET_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: BUCKET_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: BUCKET_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusHud', label: 'Nexus / HUD', src: BUCKET_COMPLETE_SPRITES.nexusHud },
  { id: 'fps', label: 'FPS guitare / effets', src: BUCKET_COMPLETE_SPRITES.fps },
  { id: 'kart', label: 'Kart', src: BUCKET_COMPLETE_SPRITES.kart }
];

export const ARTHUR_COMPLETE_SPRITES = {
  rpg: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-rpg.png`,
  tactics: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-tactics.png`,
  meleeMovement: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-melee-movement.png`,
  meleeCombat: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-melee-combat.png`,
  nexusHud: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-nexus-hud.png`,
  fps: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-fps.png`,
  kart: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-kart.png`
};

export const ARTHUR_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: ARTHUR_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: ARTHUR_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: ARTHUR_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: ARTHUR_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusHud', label: 'Nexus / HUD', src: ARTHUR_COMPLETE_SPRITES.nexusHud },
  { id: 'fps', label: 'FPS epee / effets', src: ARTHUR_COMPLETE_SPRITES.fps },
  { id: 'kart', label: 'Kart', src: ARTHUR_COMPLETE_SPRITES.kart }
];

export const BASTION_COMPLETE_SPRITES = {
  universal: `${BASTION_COMPLETE_SPRITE_BASE}/arca-bastion-universal-v1.png`
};

export const BASTION_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: BASTION_COMPLETE_SPRITES.universal }
];

export const NOVA_COMPLETE_SPRITES = {
  universal: `${NOVA_COMPLETE_SPRITE_BASE}/arca-nova-universal-v1.png`
};

export const NOVA_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: NOVA_COMPLETE_SPRITES.universal }
];

export const MARROW_COMPLETE_SPRITES = {
  universal: `${MARROW_COMPLETE_SPRITE_BASE}/arca-marrow-universal-v1.png`
};

export const MARROW_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: MARROW_COMPLETE_SPRITES.universal }
];

export const SABLE_COMPLETE_SPRITES = {
  universal: '/sprites/generated/heroes/nexus-de-convergence/arca-sable.png'
};

export const SABLE_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: SABLE_COMPLETE_SPRITES.universal }
];

export const LOOM_COMPLETE_SPRITES = {
  universal: '/sprites/generated/heroes/nexus-de-convergence/arca-loom.png'
};

export const LOOM_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: LOOM_COMPLETE_SPRITES.universal }
];

export const HALO_COMPLETE_SPRITES = {
  masterchief: `${HALO_COMPLETE_SPRITE_BASES.masterchief}/master-chief-universal.png`,
  arbiter: `${HALO_COMPLETE_SPRITE_BASES.arbiter}/arbiter-universal.png`,
  johnson: `${HALO_COMPLETE_SPRITE_BASES.johnson}/avery-johnson-universal.png`
};

export const HALO_COMPLETE_SPRITE_PACKS = {
  masterchief: [
    { id: 'universal', label: 'Halo / gameplay complet', src: HALO_COMPLETE_SPRITES.masterchief }
  ],
  arbiter: [
    { id: 'universal', label: 'Halo / gameplay complet', src: HALO_COMPLETE_SPRITES.arbiter }
  ],
  johnson: [
    { id: 'universal', label: 'Halo / gameplay complet', src: HALO_COMPLETE_SPRITES.johnson }
  ]
};

export const SPRITE_SHEET_LAYOUTS = {
  [BASTION_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 3, support: 4, special: 5, hit: 6, dead: 7 }
  },
  [NOVA_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 3, support: 4, special: 5, hit: 6, dead: 7 }
  },
  [MARROW_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 3, support: 4, special: 5, hit: 6, dead: 7 }
  },
  [SABLE_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, support: 2, special: 2, hit: 3, dead: 3 }
  },
  [LOOM_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, support: 2, special: 2, hit: 3, dead: 3 }
  },
  [MIRELLE_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 10, dead: 11 }
  },
  [MIRELLE_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 9, hit: 7, dead: 8 },
    trimByState: {
      idle: { bottom: 6 },
      run: { top: 6, bottom: 6 },
      attack: { top: 6, bottom: 6 },
      defense: { top: 6, bottom: 6 },
      hit: { top: 6, bottom: 6 },
      dead: { top: 6, bottom: 6 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [MIRELLE_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 2, defense: 6, hit: 7, dead: 8 },
    trimByState: {
      idle: { bottom: 6 },
      attack: { top: 6, bottom: 6 },
      defense: { top: 6, bottom: 6 },
      hit: { top: 6, bottom: 6 },
      dead: { top: 6, bottom: 6 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.nexusCollection]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 4, defense: 5, hit: 8, dead: 9 },
    trimByState: {
      run: { top: 38 },
      attack: { top: 18, bottom: 8 },
      defense: { top: 16, bottom: 10 },
      hit: { top: 20, bottom: 10 },
      dead: { top: 18 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.fpsHands]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 8, hit: 9, dead: 9 },
    trimByState: {
      reload: { top: 40, bottom: 6 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.fpsEffects]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, attack: 2, hit: 7, dead: 9 }
  },
  [MIRELLE_COMPLETE_SPRITES.kartDirections]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, hit: 3, dead: 3 }
  },
  [MIRELLE_COMPLETE_SPRITES.hudAvatar]: {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, hit: 0, dead: 0 }
  },
  [SERJ_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [SERJ_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [SERJ_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [SERJ_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 3, defense: 6, hit: 8, dead: 11 }
  },
  [SERJ_COMPLETE_SPRITES.nexusHud]: {
    columns: 5,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, hit: 4, dead: 4 }
  },
  [SERJ_COMPLETE_SPRITES.fps]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 6, hit: 7, dead: 8 }
  },
  [SERJ_COMPLETE_SPRITES.kart]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 2, attack: 5, defense: 3, hit: 6, dead: 6 }
  },
  [BUCKET_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [BUCKET_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [BUCKET_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [BUCKET_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 3, defense: 6, hit: 8, dead: 11 }
  },
  [BUCKET_COMPLETE_SPRITES.nexusHud]: {
    columns: 5,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, hit: 4, dead: 4 }
  },
  [BUCKET_COMPLETE_SPRITES.fps]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 6, hit: 7, dead: 8 }
  },
  [BUCKET_COMPLETE_SPRITES.kart]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 2, attack: 5, defense: 3, hit: 6, dead: 6 }
  },
  [ARTHUR_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 4, defense: 6, hit: 7, dead: 11 }
  },
  [ARTHUR_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 8 }
  },
  [ARTHUR_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [ARTHUR_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 2, defense: 5, hit: 7, dead: 8 }
  },
  [ARTHUR_COMPLETE_SPRITES.nexusHud]: {
    columns: 5,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, hit: 4, dead: 4 }
  },
  [ARTHUR_COMPLETE_SPRITES.fps]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 6, hit: 7, dead: 8 }
  },
  [ARTHUR_COMPLETE_SPRITES.kart]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 2, attack: 3, defense: 5, hit: 6, dead: 6 }
  },
  [HALO_COMPLETE_SPRITES.masterchief]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 4, hit: 6, dead: 7 }
  },
  [HALO_COMPLETE_SPRITES.arbiter]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 4, hit: 6, dead: 7 }
  },
  [HALO_COMPLETE_SPRITES.johnson]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 0, hit: 3, dead: 3 }
  },
  [ROI_BURGONDE_BOSS_SPRITE]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 7, hit: 9, dead: 11 }
  }
};

export const getHeroCompleteSpritePack = (hero) => {
  if (hero?.id === 'arca_mirelle') return MIRELLE_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_bastion') return BASTION_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_nova') return NOVA_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_marrow') return MARROW_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_sable') return SABLE_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_loom') return LOOM_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'serj_tankian') return SERJ_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'bucket_guitar_echo') return BUCKET_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arthur_kaamelott') return ARTHUR_COMPLETE_SPRITE_PACK;
  if (HALO_COMPLETE_SPRITE_PACKS[hero?.id]) return HALO_COMPLETE_SPRITE_PACKS[hero.id];
  return null;
};

const getHaloSpriteForContext = (hero) => HALO_COMPLETE_SPRITES[hero?.id] || null;

const getBastionSpriteForContext = (hero) => (
  hero?.id === 'arca_bastion' ? BASTION_COMPLETE_SPRITES.universal : null
);

const getOcUniversalSpriteForContext = (hero) => {
  if (hero?.id === 'arca_nova') return NOVA_COMPLETE_SPRITES.universal;
  if (hero?.id === 'arca_marrow') return MARROW_COMPLETE_SPRITES.universal;
  if (hero?.id === 'arca_sable') return SABLE_COMPLETE_SPRITES.universal;
  if (hero?.id === 'arca_loom') return LOOM_COMPLETE_SPRITES.universal;
  return null;
};

const getMirelleSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'arca_mirelle') return null;
  if (context === 'tactics') return MIRELLE_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? MIRELLE_COMPLETE_SPRITES.meleeMovement
      : MIRELLE_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection') return MIRELLE_COMPLETE_SPRITES.nexusCollection;
  if (context === 'hud') return MIRELLE_COMPLETE_SPRITES.hudAvatar;
  if (context === 'fps') return MIRELLE_COMPLETE_SPRITES.fpsHands;
  return MIRELLE_COMPLETE_SPRITES.rpg;
};

const getSerjSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'serj_tankian') return null;
  if (context === 'tactics') return SERJ_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? SERJ_COMPLETE_SPRITES.meleeMovement
      : SERJ_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection' || context === 'hud') return SERJ_COMPLETE_SPRITES.nexusHud;
  if (context === 'fps') return SERJ_COMPLETE_SPRITES.fps;
  if (context === 'kart' || context === 'race') return SERJ_COMPLETE_SPRITES.kart;
  return SERJ_COMPLETE_SPRITES.rpg;
};

const getBucketSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'bucket_guitar_echo') return null;
  if (context === 'tactics') return BUCKET_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? BUCKET_COMPLETE_SPRITES.meleeMovement
      : BUCKET_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection' || context === 'hud') return BUCKET_COMPLETE_SPRITES.nexusHud;
  if (context === 'fps') return BUCKET_COMPLETE_SPRITES.fps;
  if (context === 'kart' || context === 'race') return BUCKET_COMPLETE_SPRITES.kart;
  return BUCKET_COMPLETE_SPRITES.rpg;
};

const getArthurSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'arthur_kaamelott') return null;
  if (context === 'tactics') return ARTHUR_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? ARTHUR_COMPLETE_SPRITES.meleeMovement
      : ARTHUR_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection' || context === 'hud') return ARTHUR_COMPLETE_SPRITES.nexusHud;
  if (context === 'fps') return ARTHUR_COMPLETE_SPRITES.fps;
  if (context === 'kart' || context === 'race') return ARTHUR_COMPLETE_SPRITES.kart;
  return ARTHUR_COMPLETE_SPRITES.rpg;
};

const LEGACY_MELEE_STATE_ALIASES = Object.freeze({
  attack: 'attackLight1',
  defense: 'shieldHold',
  hit: 'hitStun',
  jump: 'jumpRise'
});

const normalizeHeroMeleeState = state => (
  LEGACY_MELEE_STATE_ALIASES[state] || state || 'idle'
);

export const getHeroMeleeAnimationFrame = (hero, elapsedMs = 0) => {
  const manifest = getMeleeAnimationManifest(hero?.sourceHeroId || hero?.sourceId || hero?.id);
  if (!manifest) return null;
  if (manifest.universe && manifest.universe !== hero?.universe) return null;
  const state = hero?.state === 'attack' && ['heavy', 'special'].includes(hero.action?.type)
    ? 'chargeRelease' : normalizeHeroMeleeState(hero?.state);
  const frame = getMeleeAnimationFrame(manifest, state, elapsedMs, { action: hero?.action });
  return frame ? { manifest, state, ...frame } : null;
};

export const getHeroMeleeSpriteSheetSrcs = heroOrId => (
  getMeleeAnimationSheetSources(heroOrId)
);

export const getHeroSpriteSheetSrc = (hero, context = 'auto') => {
  if (!hero?.id) return '';
  if (context === 'melee') {
    const meleeFrame = getHeroMeleeAnimationFrame(hero);
    if (meleeFrame?.animation?.sheet) return meleeFrame.animation.sheet;
  }
  const correctedSprite = correctedCharacterSprites.get(hero.sourceHeroId || hero.sourceId || hero.id);
  if (correctedSprite?.universe === hero.universe) return correctedSprite.sheet;
  const adaptedPresentation = adaptedPresentationSpritesWave10.get(hero.sourceHeroId || hero.sourceId || hero.id);
  if (adaptedPresentation?.universe === hero.universe) return adaptedPresentation.sheet;
  const blockedLegacySource = blockedLegacySourcesWave11.get(hero.sourceHeroId || hero.sourceId || hero.id);
  if (blockedLegacySource?.universe === hero.universe) return blockedLegacySource.sheet;
  const completeSprite = getMirelleSpriteForContext(hero, context);
  if (completeSprite) return completeSprite;
  const bastionSprite = getBastionSpriteForContext(hero);
  if (bastionSprite) return bastionSprite;
  const ocUniversalSprite = getOcUniversalSpriteForContext(hero);
  if (ocUniversalSprite) return ocUniversalSprite;
  const serjSprite = getSerjSpriteForContext(hero, context);
  if (serjSprite) return serjSprite;
  const bucketSprite = getBucketSpriteForContext(hero, context);
  if (bucketSprite) return bucketSprite;
  const arthurSprite = getArthurSpriteForContext(hero, context);
  if (arthurSprite) return arthurSprite;
  const haloSprite = getHaloSpriteForContext(hero, context);
  if (haloSprite) return haloSprite;
  return `/sprites/generated/heroes/${slugifyAsset(hero.universe)}/${slugifyAsset(hero.id)}.png`;
};

export const getEnemySpriteSheetSrc = (enemy) => {
  if (!enemy?.name) return '';
  if (enemy.spriteSource) return enemy.spriteSource;
  const universe = enemy.universe || enemy.sourceUniverse || 'unknown';
  return `/sprites/generated/bosses/${slugifyAsset(universe)}/${slugifyAsset(enemy.name)}.png`;
};

const ITEM_SPRITE_ALIASES = Object.freeze({
  evt_shaun_dont_stop_me: '/sprites/generated/items/shaun-of-the-dead/vinyl-record.png',
  evt_spawn_legion: '/sprites/generated/items/spawn/necroplasm-chain.png',
  evt_evil_dead_army: '/sprites/generated/items/evil-dead/boomstick.png',
  evt_panic_event_horde: '/sprites/generated/items/left-4-dead/rescue-radio.png'
});

export const getItemSpriteSrc = (item) => {
  if (!item?.id) return '';
  if (item.icon) return item.icon;
  if (ITEM_SPRITE_ALIASES[item.id]) return ITEM_SPRITE_ALIASES[item.id];
  const universe = item.universe || item.sourceUniverse || 'unknown';
  const itemId = item.sourceItemId || item.id;
  return `/sprites/generated/items/${slugifyAsset(universe)}/${slugifyAsset(itemId)}.png`;
};

// Explicit coarse bindings make movement/attacks readable on the legacy 4-row
// sheets. They are adaptations of existing poses, never dedicated new artwork.
export const COARSE_SPRITE_STATE_ALIASES = Object.freeze({
  walk: 'run', turn: 'idle',
  crouchEnter: 'defense', crouchIdle: 'defense', crouchExit: 'idle', crouchCharge: 'support',
  jumpStart: 'run', jumpRise: 'run', jumpApex: 'idle', fall: 'run', fastFall: 'run', land: 'idle', jump: 'run',
  attackLight1: 'attack', attackLight2: 'attack', attackLight3: 'attack', crouchLight: 'attack',
  chargeStart: 'support', chargeLoop: 'support', chargeRelease: 'special', chargeRecovery: 'idle', attackRecovery: 'idle',
  aerialNeutral: 'attack', aerialForward: 'attack', aerialDown: 'attack',
  shieldEnter: 'defense', shieldHold: 'defense', shieldHit: 'defense', perfectShield: 'defense', shieldBreak: 'hit', shieldExit: 'idle',
  ledgeCatch: 'hit', ledgeHang: 'idle', ledgeClimb: 'run', ledgeDrop: 'run', ledgeAttack: 'attack', ledgeJump: 'run',
  intro: 'idle', victory: 'idle', defeat: 'hit', roundVictory: 'idle', roundDefeat: 'hit', outro: 'run',
  taunt1: 'support', hitStun: 'hit', support: 'attack', special: 'attack'
});

const animationRowForState = (state) => {
  const coarse = COARSE_SPRITE_STATE_ALIASES[state] || state;
  const source = COARSE_SPRITE_STATE_ALIASES[coarse] || coarse;
  if (source === 'run') return 1;
  if (source === 'attack') return 2;
  if (source === 'hit' || source === 'dead') return 3;
  return 0;
};

const normalizeSpriteSrc = (src) => {
  const value = String(src || '');
  if (!value) return '';
  if (value.startsWith('/')) return value;
  try {
    return new URL(value).pathname;
  } catch {
    const spriteIndex = value.indexOf('/sprites/');
    return spriteIndex >= 0 ? value.slice(spriteIndex) : value;
  }
};

export const getSpriteSheetLayout = (src) => {
  const layout = (
  getMeleeSheetLayout(src)
  || legacyPoseFallbackLayoutsWave11[normalizeSpriteSrc(src)]
  || adaptedPresentationLayoutsWave10[normalizeSpriteSrc(src)]
  || calibratedBaseLayouts[normalizeSpriteSrc(src)]
  || SPRITE_SHEET_LAYOUTS[normalizeSpriteSrc(src)]
  || {
    columns: SPRITE_SHEET_META.columns,
    rows: SPRITE_SHEET_META.rows.length,
    rowByState: null
  }
  );
  if (!calmSupportSheetsWave11.has(normalizeSpriteSrc(src))) return layout;
  // Existing idle poses replace an offensive base row only for support/guard.
  // They remain reused poses, never separately generated support artwork.
  return { ...layout, rowByState: { idle: 0, run: 1, attack: 2, hit: 3, dead: 3, ...layout.rowByState, support: layout.rowByState?.idle ?? 0, defense: layout.rowByState?.idle ?? 0 },
    adaptedSupportStates: ['support', 'defense'] };
};

const animationRowForLayout = (state, layout) => {
  if (layout?.rowByState && Object.prototype.hasOwnProperty.call(layout.rowByState, state)) {
    return layout.rowByState[state];
  }
  if (layout?.rowByState && state === 'dead' && Object.prototype.hasOwnProperty.call(layout.rowByState, 'hit')) {
    return layout.rowByState.hit;
  }
  const alias = COARSE_SPRITE_STATE_ALIASES[state];
  if (alias && layout?.rowByState && Object.prototype.hasOwnProperty.call(layout.rowByState, alias)) return layout.rowByState[alias];
  return animationRowForState(state);
};

export const getSpriteStateResolution = (state, layout) => {
  const requestedState = state || 'idle';
  const reusedSupportPose = layout?.adaptedSupportStates?.includes(requestedState) === true;
  const explicit = !!layout?.rowByState && Object.prototype.hasOwnProperty.call(layout.rowByState, requestedState);
  const alias = COARSE_SPRITE_STATE_ALIASES[requestedState] || requestedState;
  const row = Math.max(0, Math.min((layout?.rows || SPRITE_SHEET_META.rows.length) - 1, animationRowForLayout(requestedState, layout)));
  const sourceState = explicit ? requestedState : layout?.rowByState && Object.prototype.hasOwnProperty.call(layout.rowByState, alias)
    ? alias : ['idle', 'run', 'attack', 'hit'][Math.min(row, 3)];
  return {
    requestedState, sourceState,
    row,
    explicit,
    dedicated: !reusedSupportPose && !(layout?.adaptedPresentationFallback || layout?.adaptedLegacyFallback) && explicit && Object.entries(layout.rowByState).every(([key, row]) => key === requestedState || row !== layout.rowByState[requestedState]),
    binding: (reusedSupportPose || layout?.adaptedPresentationFallback || layout?.adaptedLegacyFallback) ? 'adapted-existing-pose' : explicit ? 'explicit-sheet-row' : ['idle', 'run', 'attack', 'hit', 'dead'].includes(requestedState) ? 'legacy-coarse-row' : 'adapted-existing-pose',
    canonicalAnimationVerified: false,
    ...(reusedSupportPose ? { sourcePhase: 'idle', reusedSupportPoses: true } : {}),
    ...(layout?.adaptedPresentationFallback ? { sourcePhase: layout.sourcePhaseByState[requestedState] || layout.sourcePhaseByState[alias] || 'intro', reusedPresentationPoses: true } : {}),
    ...(layout?.adaptedLegacyFallback ? { sourcePhase: layout.sourcePhaseByState[requestedState] || layout.sourcePhaseByState[alias] || 'legacy-idle', reusedLegacyPoses: true } : {})
  };
};

export const getSpriteFrameForLayout = (state, animTime, layout) => {
  const row = Math.max(0, Math.min((layout?.rows || SPRITE_SHEET_META.rows.length) - 1, animationRowForLayout(state, layout)));
  return {
    row,
    col: Number.isInteger(layout?.fixedColumn) ? Math.max(0, Math.min((layout?.columns || 4) - 1, layout.fixedColumn)) : Math.floor(Math.max(0, Number(animTime) || 0) / 10) % (layout?.columns || SPRITE_SHEET_META.columns),
    trim: layout?.trimByState?.[state] || layout?.trimByState?.[COARSE_SPRITE_STATE_ALIASES[state]] || layout?.trimByRow?.[row] || layout?.trim || null
  };
};

export const getSpriteFrame = (state, animTime) => ({
  row: animationRowForState(state),
  col: Math.floor(animTime / 10) % SPRITE_SHEET_META.columns
});

export const buildSpritePrompt = ({ kind, name, universe, role, weapon, color, special }) => {
  const subject = kind === 'hero'
    ? `${name}, playable ${role || 'fighter'} from ${universe}`
    : `${name}, ${role || 'boss'} from ${universe}`;
  return [
    'Use case: stylized-concept',
    'Asset type: transparent game sprite sheet for a 2D canvas battle game',
    `Primary request: create a detailed pixel-art animation sheet for ${subject}.`,
    'Style/medium: highly detailed dark fantasy pixel art, close to the provided vendor reference: ornate edges, hand-painted pixel texture, strong silhouette, readable at small size.',
    'Composition/framing: 4 columns x 4 rows sprite sheet, equal cells, full body, three-quarter side battle angle facing right, centered in every cell.',
    'Animation rows: row 1 idle breathing, row 2 run/walk cycle, row 3 attack using the signature weapon or power, row 4 hit/recoil.',
    `Lore details: preserve iconic silhouette, outfit, colors, and equipment for ${name}; use ${weapon || 'signature weapon/power'}; special motif ${special || 'none'}.`,
    `Palette anchor: ${color || 'use lore-accurate colors'} with black outline and gold/purple micro-detail only where it fits the character.`,
    'Background: perfectly flat solid #00ff00 chroma key, no shadow, no floor, no text, no watermark.',
    'Constraints: one character only, no UI labels, no cropped body, no extra characters, consistent proportions across all 16 frames.'
  ].join('\n');
};
