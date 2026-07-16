import { REQUESTED_UNIVERSE_WAVE } from './requestedUniverseWave.js';

const LEVEL_OVERRIDES = {
  'Chainsaw Man': { pattern: 'asphalt', melee: 'city_rooftops', tactics: 'horror_chokepoint' },
  'Cyberpunk: Edgerunners': { pattern: 'circuit', melee: 'city_rooftops', tactics: 'cyber_vertical_node' },
  'Demon Slayer': { pattern: 'wood', melee: 'arcane_ruins', tactics: 'ruined_highground' },
  Parasyte: { pattern: 'organic', melee: 'containment_lab', tactics: 'facility_lockdown' },
  'Steins;Gate': { pattern: 'lab', melee: 'city_rooftops', tactics: 'facility_lockdown' },
  'Zero Escape: The Nonary Games': { pattern: 'steel', melee: 'containment_lab', tactics: 'facility_lockdown' },
  "JoJo's Bizarre Adventure": { pattern: 'stone', melee: 'triplat_duel', tactics: 'boss_command_zone' },
  'Rurouni Kenshin': { pattern: 'wood', melee: 'triplat_duel', tactics: 'ruined_highground' },
  'Tokyo Ghoul': { pattern: 'concrete', melee: 'city_rooftops', tactics: 'urban_crossfire' },
  'Cowboy Bebop': { pattern: 'hangar', melee: 'city_rooftops', tactics: 'urban_crossfire' },
  'Dragon Ball Z': { pattern: 'crater', melee: 'boss_coliseum', tactics: 'boss_command_zone' },
  'Elfen Lied': { pattern: 'concrete', melee: 'split_pit', tactics: 'horror_chokepoint' },
  'Fullmetal Alchemist': { pattern: 'alchemy', melee: 'arcane_ruins', tactics: 'war_frontline' },
  Gantz: { pattern: 'glass', melee: 'city_rooftops', tactics: 'urban_crossfire' },
  'Psycho-Pass': { pattern: 'glass', melee: 'city_rooftops', tactics: 'urban_crossfire' },
  Mashle: { pattern: 'stone', melee: 'arcane_ruins', tactics: 'ruined_highground' },
  'Solo Leveling': { pattern: 'dungeon', melee: 'arcane_ruins', tactics: 'portal_lockdown' },
  'Frieren: Beyond Journeys End': { pattern: 'moss', melee: 'arcane_ruins', tactics: 'ruined_highground' },
  'Deadman Wonderland': { pattern: 'prison', melee: 'split_pit', tactics: 'horror_chokepoint' },
  Devilman: { pattern: 'infernal', melee: 'split_pit', tactics: 'horror_chokepoint' },
  'Neon Genesis Evangelion': { pattern: 'armor', melee: 'boss_coliseum', tactics: 'boss_command_zone' },
  Naruto: { pattern: 'ninja', melee: 'arcane_ruins', tactics: 'ruined_highground' },
  'Naruto Shippuden': { pattern: 'wetStone', melee: 'triplat_duel', tactics: 'war_frontline' },
  'Boruto: Naruto Next Generations': { pattern: 'concrete', melee: 'city_rooftops', tactics: 'urban_crossfire' },
  'Boruto: Two Blue Vortex': { pattern: 'roots', melee: 'arcane_ruins', tactics: 'portal_lockdown' },
  'One Punch Man': { pattern: 'asphalt', melee: 'boss_coliseum', tactics: 'boss_command_zone' },
  'Sword Art Online: Gun Gale Online': { pattern: 'sand', melee: 'war_front', tactics: 'war_frontline' },
  'Sword Art Online': { pattern: 'stone', melee: 'arcane_ruins', tactics: 'artifact_bastion' },
  'Les Aventures de Saturnin': { pattern: 'miniature', melee: 'absurd_party', tactics: 'nexus_escort_route' },
  'MagiC JacK': { pattern: 'studio', melee: 'absurd_party', tactics: 'urban_crossfire' },
  'Teen Titans': { pattern: 'alloy', melee: 'city_rooftops', tactics: 'cyber_vertical_node' },
  Godzilla: { pattern: 'crater', melee: 'boss_coliseum', tactics: 'boss_command_zone' }
};

const normalizeHex = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;

const adjustHex = (hex, amount) => {
  const value = normalizeHex(hex, '#39c5bb').slice(1);
  const channels = [0, 2, 4].map(index => Math.max(0, Math.min(255, parseInt(value.slice(index, index + 2), 16) + amount)));
  return `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
};

const variantForMode = (entry, mode) => (entry.stageVariants || [])
  .map(variant => Array.isArray(variant)
    ? { mode: variant[0], name: variant[1], difficulty: variant[2], bossName: variant[3] }
    : variant)
  .find(variant => variant.mode === mode);

const stageNameForMode = (entry, mode) => {
  if (entry.mode === mode) return entry.stage;
  return variantForMode(entry, mode)?.name || entry.stage;
};

const buildMaterial = (entry, pattern) => {
  const base = normalizeHex(entry.colors?.[0], '#18212b');
  const shadow = normalizeHex(entry.colors?.[1], '#030507');
  const accent = normalizeHex(entry.colors?.[2], '#39c5bb');
  return {
    id: `${entry.key}-${pattern}`,
    pattern,
    base,
    shadow,
    mid: adjustHex(base, 28),
    edge: accent,
    detail: adjustHex(accent, 42),
    danger: entry.faction === 'horror' ? '#ff5448' : entry.faction === 'arcane' ? '#ffd166' : '#ff7a3d'
  };
};

const buildLevelProfile = (entry) => {
  const override = LEVEL_OVERRIDES[entry.universe] || { pattern: 'alloy', melee: 'training_flat', tactics: 'training_grid' };
  const material = buildMaterial(entry, override.pattern);
  const meleeName = stageNameForMode(entry, 'Smash');
  const rpgName = stageNameForMode(entry, 'RPG');
  const tacticsName = stageNameForMode(entry, 'Tactics');
  return {
    key: entry.key,
    universe: entry.universe,
    recent: true,
    motif: entry.motif,
    material,
    combat: {
      name: meleeName,
      layout: 'duel_flat',
      floorTexture: `${entry.key}-combat-floor`,
      horizon: 0.69
    },
    melee: {
      name: meleeName,
      layout: override.melee,
      platformTexture: `${entry.key}-melee-platform`,
      separatePlatformTexture: true
    },
    rpg: {
      name: rpgName,
      floorTexture: `${entry.key}-rpg-floor`,
      horizon: 0.47,
      heroLanes: [
        { x: 0.14, y: 0.58 },
        { x: 0.19, y: 0.69 },
        { x: 0.24, y: 0.80 }
      ],
      enemyLanes: [
        { x: 0.76, y: 0.58 },
        { x: 0.81, y: 0.69 },
        { x: 0.86, y: 0.80 }
      ],
      bossLanes: [
        { x: 0.76, y: 0.64 },
        { x: 0.84, y: 0.77 }
      ],
      worldBoss: { x: 0.80, y: 0.72 }
    },
    tactics: {
      name: tacticsName,
      battlefieldId: override.tactics,
      tileTexture: `${entry.key}-tactics-tile`,
      gridAligned: true
    }
  };
};

export const RECENT_UNIVERSE_LEVELS = Object.fromEntries(
  REQUESTED_UNIVERSE_WAVE.map(entry => [entry.universe, buildLevelProfile(entry)])
);

export const RECENT_UNIVERSE_NAMES = Object.freeze(Object.keys(RECENT_UNIVERSE_LEVELS));

export function getRecentUniverseLevelProfile(universe) {
  return RECENT_UNIVERSE_LEVELS[universe] || null;
}

export function getRecentModeLevel(universe, mode) {
  const profile = getRecentUniverseLevelProfile(universe);
  if (!profile) return null;
  if (mode === 'Smash' || mode === 'Melee') return profile.melee;
  if (mode === 'RPG') return profile.rpg;
  if (mode === 'Tactics') return profile.tactics;
  if (mode === 'Combat' || mode === 'Fighter') return profile.combat;
  return null;
}
