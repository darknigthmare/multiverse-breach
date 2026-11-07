import { DLC_UNIVERSE_KEYS } from '../../DLC/index.js';
import { OC_DLC_SAVE_METADATA } from './dlcContentIdentity.js';
import { mergeDlcCampaignProgress } from './dlcPlayerState.js';
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
    OC_DLC_SAVE_METADATA.forEach(pack => migrated.add(pack.universe));
  }
  return [...migrated];
};

export const getEnabledOcDlcPackIds = (hiddenUniverses) => {
  const hidden = new Set(Array.isArray(hiddenUniverses) ? hiddenUniverses : []);
  return OC_DLC_SAVE_METADATA
    .filter(pack => !hidden.has(pack.universe))
    .map(pack => pack.id);
};

export const buildOcDlcCampaignProgress = (completedStages, existingProgress = {}) => {
  return mergeDlcCampaignProgress(completedStages, existingProgress, OC_DLC_SAVE_METADATA);
};

export const DEFAULT_HIDDEN_UNIVERSES = [
  ...new Set([...getDlcUniverseKeys(), ...OC_DLC_SAVE_METADATA.map(pack => pack.universe)])
];
