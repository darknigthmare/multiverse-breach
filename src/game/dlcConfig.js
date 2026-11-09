import { DLC_UNIVERSE_KEYS } from '../../DLC/index.js';
import { OC_DLC_PACKS, UNIVERSE_KEYS } from './ocDlcPacks';
import { ORIGINAL_CAMPAIGN_UNIVERSES } from './originalUniverseWave.js';

export const BASE_GAME_UNIVERSES = ['Nexus de Convergence'];

export const isBaseGameUniverse = (universe) => BASE_GAME_UNIVERSES.includes(universe);

export { ORIGINAL_CAMPAIGN_UNIVERSES };

export const isOriginalCampaignUniverse = (universe) => (
  ORIGINAL_CAMPAIGN_UNIVERSES.includes(universe)
);

// Keep the historical catalog order and return a new array for existing callers.
// Package registration describes content; activation remains a save-game choice.
export const getDlcUniverseKeys = () => [...DLC_UNIVERSE_KEYS];

export const migrateHiddenUniversesForOcDlc = (hiddenUniverses, fromVersion) => {
  const migrated = new Set(
    Array.isArray(hiddenUniverses)
      ? hiddenUniverses.filter(universe => typeof universe === 'string' && universe.trim())
      : []
  );
  if ((Number(fromVersion) || 0) < 7) {
    UNIVERSE_KEYS.forEach(universe => migrated.add(universe));
  }
  return [...migrated];
};

export const getEnabledOcDlcPackIds = (hiddenUniverses) => {
  const hidden = new Set(Array.isArray(hiddenUniverses) ? hiddenUniverses : []);
  return OC_DLC_PACKS
    .filter(pack => !hidden.has(pack.universe))
    .map(pack => pack.id);
};

export const buildOcDlcCampaignProgress = (completedStages, existingProgress = {}) => {
  const completed = new Set(Array.isArray(completedStages) ? completedStages : []);
  return Object.fromEntries(OC_DLC_PACKS.map(pack => {
    const stored = existingProgress?.[pack.id];
    const missionIds = (pack.missions || [])
      .map(mission => mission.id)
      .filter(stageId => completed.has(stageId));
    return [
      pack.id,
      {
        ...(stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}),
        missionIds
      }
    ];
  }));
};

export const DEFAULT_HIDDEN_UNIVERSES = [
  ...new Set([...getDlcUniverseKeys(), ...UNIVERSE_KEYS])
];
