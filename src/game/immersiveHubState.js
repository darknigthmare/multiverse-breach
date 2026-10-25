import { clampMosaicPosition } from './mosaicCityRuntime.js';
import { CATALOG_PAGE_SIZES, createCatalogView } from './catalogPagination.js';

const nonNegativeInteger = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;

const hubNavigationDefaults = {
  activeTab: 'missions', missionScreen: 'index', missionWorkspaceView: 'campaign',
  narrativeGroupView: 'chapters', mediaFilter: 'all', missionModeFilter: 'all',
  directoryQuery: '', directoryStatus: 'all', narrativeGroupQuery: '',
  squadUniverse: '', inventoryFilter: 'all', codexView: 'canon',
  registrySection: 'milestones', adminUniverseSearch: ''
};
const hubMissionScreens = new Set(['index', 'story', 'ocDlc', 'originalWorlds', 'universeMissions', 'factionArcs', 'universeArcs', 'personalArcs', 'trioArcs', 'fusionMissions', 'trials']);

// A parent-owned ref remembers interface choices across briefing/battle mounts.
// This whitelist deliberately excludes saves, modal visibility and simulations.
export const normalizeHubNavigation = (memory = {}) => {
  const source = memory && typeof memory === 'object' ? memory : {};
  const next = Object.fromEntries(Object.entries(hubNavigationDefaults).map(([key, fallback]) => [
    key, typeof source[key] === 'string' ? source[key] : fallback
  ]));
  if (!hubMissionScreens.has(next.missionScreen)) next.missionScreen = 'index';
  for (const key of ['selectedHeroId', 'briefingStageId', 'selectedNarrativeArcId', 'selectedNarrativeGroupId']) {
    const value = source[key];
    next[key] = typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)) ? value : null;
  }
  next.missionSeed = Number.isFinite(source.missionSeed) ? source.missionSeed : null;
  next.showMissionArchive = source.showMissionArchive === true;
  next.catalogViews = Object.fromEntries(['roster', 'reserve', 'arsenalHeroes', 'inventory', 'shop'].map(key => {
    const saved = source.catalogViews?.[key];
    const view = createCatalogView();
    if (saved && typeof saved === 'object') {
      for (const field of ['query', 'category', 'status']) {
        if (typeof saved[field] === 'string') view[field] = saved[field];
      }
      if (Number.isFinite(saved.page)) view.page = Math.max(1, Math.trunc(saved.page));
      if (CATALOG_PAGE_SIZES.includes(saved.pageSize)) view.pageSize = saved.pageSize;
    }
    return [key, view];
  }));
  return next;
};

// Canvas HUD overlays use CSS-pixel bounds, independent of the logical camera.
// In portrait, the city map sits above the touch controls instead of behind them.
export const getSceneCanvasSize = (width, height, logicalHeight) => ({
  width: Math.max(1, Math.round(logicalHeight * width / Math.max(1, height))),
  height: logicalHeight
});

export const getSceneHudLayout = ({ width, height, logicalHeight, hudScale = 1, safeArea = 12 }) => {
  const units = logicalHeight / Math.max(1, height);
  const scale = Math.max(0.9, Math.min(1.4, hudScale));
  const edge = Math.max(12, Math.min(32, safeArea));
  const mapWidth = Math.min(154 * scale, width * 0.34);
  const mapHeight = mapWidth * 92 / 154;
  const mapBottom = edge + (width <= 760 ? 64 * scale : 0);
  const radarRadius = Math.min(42 * scale, width * 0.13);
  return {
    unitsPerCssPixel: units,
    cityMinimap: {
      x: (width - edge - mapWidth) * units,
      y: (height - mapBottom - mapHeight) * units,
      width: mapWidth * units,
      height: mapHeight * units
    },
    fpsRadar: {
      x: (width - edge - radarRadius) * units,
      y: (56 + edge + radarRadius) * units,
      radius: radarRadius * units
    }
  };
};

// Save only navigation state, never transient input, NPCs or a running simulation.
export const restoreMosaicLocation = (saved, districts) => {
  const district = districts[saved?.districtId] || districts.atrium;
  const validPosition = districts[saved?.districtId]
    && Number.isFinite(saved?.player?.x) && Number.isFinite(saved?.player?.y);
  const player = clampMosaicPosition(validPosition ? saved.player : district.spawn, district);
  return {
    districtId: district.id,
    zoneId: validPosition && typeof saved.zoneId === 'string' ? saved.zoneId : district.id,
    player: { ...player, facing: saved?.player?.facing === -1 ? -1 : 1 },
    camera: {
      x: Math.max(0, Math.min(district.worldW - 960, player.x - 480)),
      y: Math.max(0, Math.min(district.worldH - 540, player.y - 270))
    }
  };
};

export const snapshotMosaicLocation = (state, districtId, zoneId) => ({
  districtId,
  zoneId,
  player: {
    x: Math.round(state.player.x * 100) / 100,
    y: Math.round(state.player.y * 100) / 100,
    facing: state.player.facing === -1 ? -1 : 1
  }
});

export const normalizeExtinctionReport = report => {
  if (!report?.runId || report.reason !== 'completed' || !['victory', 'defeat'].includes(report.result)) return null;
  return {
    ...report,
    runId: String(report.runId),
    rewards: {
      gold: nonNegativeInteger(report.rewards?.gold),
      shards: nonNegativeInteger(report.rewards?.shards),
      modeXp: nonNegativeInteger(report.rewards?.modeXp),
      title: String(report.rewards?.title || '')
    }
  };
};

// The receipt is persisted with progression. Re-delivery never awards a run twice.
// This function is pure because React may evaluate a state updater more than once.
export const applyExtinctionReport = (progress = {}, rawReport) => {
  const report = normalizeExtinctionReport(rawReport);
  const career = progress.extinctionCareer || {};
  const receipts = Array.isArray(career.receipts) ? career.receipts : [];
  if (!report || receipts.includes(report.runId)) return progress;
  return {
    ...progress,
    extinctionCareer: {
      ...career,
      xp: nonNegativeInteger(career.xp) + report.rewards.modeXp,
      runs: nonNegativeInteger(career.runs) + 1,
      wins: nonNegativeInteger(career.wins) + (report.result === 'victory' ? 1 : 0),
      receipts: [...receipts, report.runId],
      lastReport: report
    },
    riftJournal: [{
      id: report.runId,
      at: report.at,
      source: 'Zone d Extinction',
      universe: 'Nexus de Convergence',
      title: report.rewards.title,
      text: `${report.mode} · ${report.kills || 0} K.O. · ${report.waves || 1} waves`,
      result: report.result,
      rewards: report.rewards
    }, ...(progress.riftJournal || [])].slice(0, 12)
  };
};

// Equipment boosts are additive before the combat rules apply their multipliers.
// Show those exact slot deltas; do not pretend they are final combat attributes.
export const compareGearBoosts = (candidate, equipped) => [...new Set([
  ...Object.keys(candidate?.boost || {}), ...Object.keys(equipped?.boost || {})
])].filter(stat => Number.isFinite(Number(candidate?.boost?.[stat] || 0))
  && Number.isFinite(Number(equipped?.boost?.[stat] || 0)))
  .map(stat => ({ stat, before: Number(equipped?.boost?.[stat] || 0), after: Number(candidate?.boost?.[stat] || 0), delta: Number(candidate?.boost?.[stat] || 0) - Number(equipped?.boost?.[stat] || 0) }));
