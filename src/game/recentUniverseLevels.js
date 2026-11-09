// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcChainsawMan from '../../DLC/ChainsawMan/data/recentUniverseLevels.js';
import * as dlcCyberpunkEdgerunners from '../../DLC/CyberpunkEdgerunners/data/recentUniverseLevels.js';
import * as dlcDemonSlayer from '../../DLC/DemonSlayer/data/recentUniverseLevels.js';
import * as dlcParasyte from '../../DLC/Parasyte/data/recentUniverseLevels.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/recentUniverseLevels.js';
import * as dlcZeroEscapeTheNonaryGames from '../../DLC/ZeroEscapeTheNonaryGames/data/recentUniverseLevels.js';
import * as dlcJoJosBizarreAdventure from '../../DLC/JoJosBizarreAdventure/data/recentUniverseLevels.js';
import * as dlcRurouniKenshin from '../../DLC/RurouniKenshin/data/recentUniverseLevels.js';
import * as dlcTokyoGhoul from '../../DLC/TokyoGhoul/data/recentUniverseLevels.js';
import * as dlcCowboyBebop from '../../DLC/CowboyBebop/data/recentUniverseLevels.js';
import * as dlcDragonBallZ from '../../DLC/DragonBallZ/data/recentUniverseLevels.js';
import * as dlcElfenLied from '../../DLC/ElfenLied/data/recentUniverseLevels.js';
import * as dlcFullmetalAlchemist from '../../DLC/FullmetalAlchemist/data/recentUniverseLevels.js';
import * as dlcGantz from '../../DLC/Gantz/data/recentUniverseLevels.js';
import * as dlcPsychoPass from '../../DLC/PsychoPass/data/recentUniverseLevels.js';
import * as dlcMashle from '../../DLC/Mashle/data/recentUniverseLevels.js';
import * as dlcSoloLeveling from '../../DLC/SoloLeveling/data/recentUniverseLevels.js';
import * as dlcFrierenBeyondJourneysEnd from '../../DLC/FrierenBeyondJourneysEnd/data/recentUniverseLevels.js';
import * as dlcDeadmanWonderland from '../../DLC/DeadmanWonderland/data/recentUniverseLevels.js';
import * as dlcDevilman from '../../DLC/Devilman/data/recentUniverseLevels.js';
import * as dlcNeonGenesisEvangelion from '../../DLC/NeonGenesisEvangelion/data/recentUniverseLevels.js';
import * as dlcNaruto from '../../DLC/Naruto/data/recentUniverseLevels.js';
import * as dlcNarutoShippuden from '../../DLC/NarutoShippuden/data/recentUniverseLevels.js';
import * as dlcBorutoNarutoNextGenerations from '../../DLC/BorutoNarutoNextGenerations/data/recentUniverseLevels.js';
import * as dlcBorutoTwoBlueVortex from '../../DLC/BorutoTwoBlueVortex/data/recentUniverseLevels.js';
import * as dlcOnePunchMan from '../../DLC/OnePunchMan/data/recentUniverseLevels.js';
import * as dlcSwordArtOnlineGunGaleOnline from '../../DLC/SwordArtOnlineGunGaleOnline/data/recentUniverseLevels.js';
import * as dlcSwordArtOnline from '../../DLC/SwordArtOnline/data/recentUniverseLevels.js';
import * as dlcLesAventuresDeSaturnin from '../../DLC/LesAventuresDeSaturnin/data/recentUniverseLevels.js';
import * as dlcMagiCJacK from '../../DLC/MagiCJacK/data/recentUniverseLevels.js';
import * as dlcTeenTitans from '../../DLC/TeenTitans/data/recentUniverseLevels.js';
import * as dlcGodzilla from '../../DLC/Godzilla/data/recentUniverseLevels.js';

import { REQUESTED_UNIVERSE_WAVE } from './requestedUniverseWave.js';

const LEVEL_OVERRIDES = {
  'Chainsaw Man': dlcChainsawMan.createLevelOverrides(),
  'Cyberpunk: Edgerunners': dlcCyberpunkEdgerunners.createLevelOverrides(),
  'Demon Slayer': dlcDemonSlayer.createLevelOverrides(),
  Parasyte: dlcParasyte.createLevelOverrides(),
  'Steins;Gate': dlcSteinsGate.createLevelOverrides(),
  'Zero Escape: The Nonary Games': dlcZeroEscapeTheNonaryGames.createLevelOverrides(),
  "JoJo's Bizarre Adventure": dlcJoJosBizarreAdventure.createLevelOverrides(),
  'Rurouni Kenshin': dlcRurouniKenshin.createLevelOverrides(),
  'Tokyo Ghoul': dlcTokyoGhoul.createLevelOverrides(),
  'Cowboy Bebop': dlcCowboyBebop.createLevelOverrides(),
  'Dragon Ball Z': dlcDragonBallZ.createLevelOverrides(),
  'Elfen Lied': dlcElfenLied.createLevelOverrides(),
  'Fullmetal Alchemist': dlcFullmetalAlchemist.createLevelOverrides(),
  Gantz: dlcGantz.createLevelOverrides(),
  'Psycho-Pass': dlcPsychoPass.createLevelOverrides(),
  Mashle: dlcMashle.createLevelOverrides(),
  'Solo Leveling': dlcSoloLeveling.createLevelOverrides(),
  'Frieren: Beyond Journeys End': dlcFrierenBeyondJourneysEnd.createLevelOverrides(),
  'Deadman Wonderland': dlcDeadmanWonderland.createLevelOverrides(),
  Devilman: dlcDevilman.createLevelOverrides(),
  'Neon Genesis Evangelion': dlcNeonGenesisEvangelion.createLevelOverrides(),
  Naruto: dlcNaruto.createLevelOverrides(),
  'Naruto Shippuden': dlcNarutoShippuden.createLevelOverrides(),
  'Boruto: Naruto Next Generations': dlcBorutoNarutoNextGenerations.createLevelOverrides(),
  'Boruto: Two Blue Vortex': dlcBorutoTwoBlueVortex.createLevelOverrides(),
  'One Punch Man': dlcOnePunchMan.createLevelOverrides(),
  'Sword Art Online: Gun Gale Online': dlcSwordArtOnlineGunGaleOnline.createLevelOverrides(),
  'Sword Art Online': dlcSwordArtOnline.createLevelOverrides(),
  'Les Aventures de Saturnin': dlcLesAventuresDeSaturnin.createLevelOverrides(),
  'MagiC JacK': dlcMagiCJacK.createLevelOverrides(),
  'Teen Titans': dlcTeenTitans.createLevelOverrides(),
  Godzilla: dlcGodzilla.createLevelOverrides()
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
