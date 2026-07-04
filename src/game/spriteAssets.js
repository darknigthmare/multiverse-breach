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

export const SPRITE_SHEET_LAYOUTS = {
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
  }
};

export const getHeroCompleteSpritePack = (hero) => {
  if (hero?.id !== 'arca_mirelle') return null;
  return MIRELLE_COMPLETE_SPRITE_PACK;
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

export const getHeroSpriteSheetSrc = (hero, context = 'auto') => {
  if (!hero?.id) return '';
  const completeSprite = getMirelleSpriteForContext(hero, context);
  if (completeSprite) return completeSprite;
  return `/sprites/generated/heroes/${slugifyAsset(hero.universe)}/${slugifyAsset(hero.id)}.png`;
};

export const getEnemySpriteSheetSrc = (enemy) => {
  if (!enemy?.name) return '';
  const universe = enemy.universe || enemy.sourceUniverse || 'unknown';
  return `/sprites/generated/bosses/${slugifyAsset(universe)}/${slugifyAsset(enemy.name)}.png`;
};

export const getItemSpriteSrc = (item) => {
  if (!item?.id) return '';
  const universe = item.universe || item.sourceUniverse || 'unknown';
  return `/sprites/generated/items/${slugifyAsset(universe)}/${slugifyAsset(item.id)}.png`;
};

const animationRowForState = (state) => {
  if (state === 'run') return 1;
  if (state === 'attack') return 2;
  if (state === 'hit' || state === 'dead') return 3;
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

export const getSpriteSheetLayout = (src) => SPRITE_SHEET_LAYOUTS[normalizeSpriteSrc(src)] || {
  columns: SPRITE_SHEET_META.columns,
  rows: SPRITE_SHEET_META.rows.length,
  rowByState: null
};

const animationRowForLayout = (state, layout) => {
  if (layout?.rowByState && Object.prototype.hasOwnProperty.call(layout.rowByState, state)) {
    return layout.rowByState[state];
  }
  if (layout?.rowByState && state === 'dead' && Object.prototype.hasOwnProperty.call(layout.rowByState, 'hit')) {
    return layout.rowByState.hit;
  }
  return animationRowForState(state);
};

export const getSpriteFrameForLayout = (state, animTime, layout) => {
  const row = Math.max(0, Math.min((layout?.rows || SPRITE_SHEET_META.rows.length) - 1, animationRowForLayout(state, layout)));
  return {
    row,
    col: Math.floor(animTime / 10) % (layout?.columns || SPRITE_SHEET_META.columns),
    trim: layout?.trimByState?.[state] || layout?.trimByRow?.[row] || layout?.trim || null
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
