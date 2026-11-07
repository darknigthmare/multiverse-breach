import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Extract App's production normalization and serialization, without loading its
// UI. Tests can supply an empty runtime catalog while retaining historical IDs.
export default function createDlcSaveFixturePlugin(root) {
  const virtualId = 'virtual:dlc-save-profile';
  return {
    name: 'dlc-save-profile-fixture',
    resolveId(id) { if (id === virtualId) return '\0' + virtualId; },
    async load(id) {
      if (id !== '\0' + virtualId) return;
      const app = await readFile(resolve(root, 'src/App.jsx'), 'utf8');
      const section = (start, end) => {
        const first = app.indexOf(start);
        const last = app.indexOf(end, first + start.length);
        if (first < 0 || last <= first) throw new Error('Missing DLC save fixture boundary: ' + start);
        return app.slice(first, last);
      };
      const definitions = section('const ARC_REPLAY_DEFINITIONS =', 'const HubScreen =');
      const defaults = section('const buildOcMainCampaignState =', 'const loadSave =');
      const append = section('const appendUnique =', 'const hasMeaningfulTrace =');
      const normalize = section('const normalizeStoredCustomBattlePreset =', 'const getNextLoginStreak =');
      const serialize = section('  const getCurrentSave = useCallback(', '  getCurrentSaveRef.current = getCurrentSave;');
      const stateKeys = serialize.match(/\}, \[([^\]]+)\]\);\s*$/)?.[1];
      if (!stateKeys) throw new Error('Missing App serialization state dependency list');
      return `
        import { sanitizeSaveCore } from '/src/game/saveValidation.js';
        import { KNOWN_DLC_HERO_IDS, KNOWN_ARC_REPLAY_DEFINITIONS, getStableUniverseArcStageId } from '/src/game/dlcContentIdentity.js';
        import { DEFAULT_HIDDEN_UNIVERSES, buildOcDlcCampaignProgress, getEnabledOcDlcPackIds, isBaseGameUniverse, migrateHiddenUniversesForOcDlc } from '/src/game/dlcConfig.js';
        import { HEROES_DB as LOADED_HEROES } from '/src/game/heroes.js';
        import { PLAYER_HERO_ID } from '/src/game/playerHero.js';
        import { CHARACTER_NARRATIVE_ARCS as LOADED_CHARACTER_ARCS, TRIO_NARRATIVE_ARCS as LOADED_TRIO_ARCS, UNIVERSE_NARRATIVE_ARCS as LOADED_UNIVERSE_ARCS, FUSION_MISSIONS as LOADED_FUSIONS } from '/src/game/narrativeSystems.js';
        import { DEFAULT_KART_CAREER, normalizeKartCareer } from '/src/game/kartCareer.js';
        import { normalizeReputationProgress } from '/src/game/factionProgression.js';
        import { normalizeSpecialEventProgress } from '/src/game/specialEvents.js';
        import { migrateCardCollectionSave } from '/src/game/cards/cardSaveMigration.js';
        import { migrateArcReplayState } from '/src/game/missions/arcReplayMigration.js';
        import { normalizeStageEventIntensity, normalizeStageTopologyId, normalizeStageVariant } from '/src/game/melee/stageTopologyCatalog.js';
        import { OC_CAMPAIGN_ENDINGS, OC_CAMPAIGN_MISSIONS, OC_FINAL_MISSION_ID, OC_ORIGIN_LOCKS } from '/src/game/ocCampaign.js';
        export function createSaveProfileHarness({
          heroes = LOADED_HEROES,
          characterArcs = LOADED_CHARACTER_ARCS,
          trioArcs = LOADED_TRIO_ARCS,
          universeArcs = LOADED_UNIVERSE_ARCS,
          fusionMissions = LOADED_FUSIONS
        } = {}) {
          const HEROES_DB = heroes;
          const CHARACTER_NARRATIVE_ARCS = characterArcs;
          const TRIO_NARRATIVE_ARCS = trioArcs;
          const UNIVERSE_NARRATIVE_ARCS = universeArcs;
          const FUSION_MISSIONS = fusionMissions;
          ${definitions}
          ${defaults}
          ${append}
          ${normalize}
          return {
            normalize: normalizeSavePayload,
            defaults: DEFAULT_SAVE,
            heroes,
            universeArcs,
            serialize(save) {
              const { ${stateKeys} } = save;
              const useCallback = callback => callback;
              ${serialize}
              return getCurrentSave();
            }
          };
        }
      `;
    }
  };
}
