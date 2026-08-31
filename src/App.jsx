import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import sound from './game/soundEngine';
import AudioControl from './components/AudioControl';
import NetworkStatusBadge from './components/NetworkStatusBadge';
import AuthPanel from './components/AuthPanel';
import IntroSequence from './components/IntroSequence';
import { EQUIP_ITEMS_DB, EVENT_ITEMS_DB, HEROES_DB } from './game/heroes';
import { getOpenAiBackdropSrc } from './game/renderer';
import { resolveActiveHudTheme } from './game/cosmeticVisualAssets';
import {
  CloudSaveConflictError,
  createCloudSave,
  getStoredSession,
  loadCloudSave,
  signInAccount,
  signOutAccount,
  signUpAccount,
  storeSession,
  updateCloudSave
} from './game/cloudSave';
import { createPlayerHero, PLAYER_HERO_ID } from './game/playerHero';
import {
  DEFAULT_HIDDEN_UNIVERSES,
  buildOcDlcCampaignProgress,
  getEnabledOcDlcPackIds,
  isBaseGameUniverse,
  migrateHiddenUniversesForOcDlc
} from './game/dlcConfig';
import {
  CHARACTER_NARRATIVE_ARCS,
  FUSION_MISSIONS,
  TRIO_NARRATIVE_ARCS,
  UNIVERSE_NARRATIVE_ARCS
} from './game/narrativeSystems';
import {
  DEFAULT_KART_CAREER,
  LEGACY_KART_CAREER_KEY,
  migrateLegacyKartCareer,
  normalizeKartCareer
} from './game/kartCareer';
import {
  awardMissionReputation,
  getReputationResourceMultiplier,
  normalizeReputationProgress
} from './game/factionProgression';
import {
  SPECIAL_EVENTS,
  buildSpecialEventStage,
  formatSpecialEventWindow,
  getActiveSpecialEvents,
  isSpecialEventActive,
  normalizeSpecialEventProgress,
  recordSpecialEventResult
} from './game/specialEvents';
import { migrateCardCollectionSave } from './game/cards/cardSaveMigration';
import { migrateArcReplayState } from './game/missions/arcReplayMigration';
import {
  canLaunchPreparedMission,
  getPreparedMissionCompletionScreen,
  getPreparedMissionLaunchScreen,
  isFirstClearMissionVictory,
  isFreeMissionReplay,
  shouldGrantFirstClearMissionReward
} from './game/missions/missionReplayPolicy';
import {
  CLOUD_SAVE_CONFLICT_ACTIONS,
  resolveCloudSaveConflict
} from './game/cloudSaveConflictPolicy';
import { getTraceContinuationScreen } from './game/titleNavigation';
import { applyBoosterRotationReroll } from './game/portalRotationReroll';
import { createLocalSaveGuard } from './game/localSaveGuard';
import { getTacticsBattlefield } from './game/tacticsBattlefields';
import { getTacticsEscortBriefing } from './game/tacticsEscort';
import {
  buildTitleRotationRoster,
  buildUnlockedAttractCards,
  buildUnlockedAttractStages,
  getLocalDayKey
} from './game/titlePresentation';
import {
  normalizeStageEventIntensity,
  normalizeStageTopologyId,
  normalizeStageVariant
} from './game/melee/stageTopologyCatalog';
import {
  OC_CAMPAIGN_ENDINGS,
  OC_CAMPAIGN_EPILOGUE,
  OC_CAMPAIGN_MISSIONS,
  OC_FINAL_MISSION_ID,
  OC_ORIGIN_LOCKS,
  getOcCampaignEnding,
  getOcCampaignMission
} from './game/ocCampaign';

const SAVE_KEY = 'multiverse_breach_save_v2';
const TUTORIAL_COMPANION_IDS = ['arca_mirelle', 'arca_bastion'];
const TITLE_PRESENTATION_MODES = Object.freeze(['RPG', 'Tactics', 'Smash']);
const OC_CAMPAIGN_SKIN_ID = 'char_player_anchor_palimpsest';
// These IDs mirror the existing Hub projection. They are frozen here so the
// v9 migration can recover completed legacy universe arcs without rewriting
// any stage or reward data in the dirty campaign worktree.
const ARC_REPLAY_DEFINITIONS = Object.freeze([
  ...CHARACTER_NARRATIVE_ARCS,
  ...TRIO_NARRATIVE_ARCS,
  ...FUSION_MISSIONS.map(mission => ({
    arcId: mission.id,
    finalStageId: mission.stageId
  })),
  ...UNIVERSE_NARRATIVE_ARCS.map((arc, index) => ({
    arcId: arc.id,
    finalStageId: 40000 + index
  }))
]);
const HubScreen = React.lazy(() => import('./components/HubScreen'));
const PortalScreen = React.lazy(() => import('./components/PortalScreen'));
const GameCanvas = React.lazy(() => import('./components/GameCanvas'));

const buildOcMainCampaignState = (completedStages = [], existingState = {}) => {
  const completed = new Set(
    (Array.isArray(completedStages) ? completedStages : []).map(stageId => String(stageId))
  );
  const completedMissionIds = OC_CAMPAIGN_MISSIONS
    .filter(mission => completed.has(String(mission.id)))
    .map(mission => mission.id);
  const completedMissionSet = new Set(completedMissionIds);
  const recoveredLockIds = OC_ORIGIN_LOCKS
    .filter(lock => completedMissionSet.has(lock.missionId))
    .map(lock => lock.id);
  const allowedEndingIds = new Set(OC_CAMPAIGN_ENDINGS.map(ending => ending.id));
  const finalMissionComplete = completedMissionSet.has(OC_FINAL_MISSION_ID);
  const endingId = finalMissionComplete && allowedEndingIds.has(existingState?.endingId)
    ? existingState.endingId
    : null;
  const endingHistory = finalMissionComplete
    ? [...new Set(
      (Array.isArray(existingState?.endingHistory) ? existingState.endingHistory : [])
        .filter(id => allowedEndingIds.has(id))
    )]
    : [];
  if (endingId && !endingHistory.includes(endingId)) endingHistory.push(endingId);
  const nextMission = OC_CAMPAIGN_MISSIONS.find(mission => !completedMissionSet.has(mission.id)) || null;
  const lastMission = [...OC_CAMPAIGN_MISSIONS]
    .reverse()
    .find(mission => completedMissionSet.has(mission.id)) || null;

  return {
    completedMissionIds,
    recoveredLockIds,
    lastMissionId: lastMission?.id || null,
    nextMissionId: nextMission?.id || null,
    finalMissionComplete,
    endingId,
    endingHistory,
    completedAt: endingId && typeof existingState?.completedAt === 'string'
      ? existingState.completedAt
      : null,
    epilogueSeen: Boolean(endingId && existingState?.epilogueSeen),
    completionRewardClaimed: Boolean(endingId && existingState?.completionRewardClaimed)
  };
};

const DEFAULT_SAVE = {
  saveVersion: 9,
  lang: 'fr',
  gold: 200,
  breachShards: 150,
  eventTokens: 10,
  playerProfile: { name: 'Ancre' },
  unlockedHeroes: [PLAYER_HERO_ID],
  heroLevels: { [PLAYER_HERO_ID]: 1 },
  activeTeam: [PLAYER_HERO_ID],
  completedStages: [],
  completedArcIds: [],
  arcReplayUnlockedIds: [],
  enabledContentPacks: [],
  campaignProgress: buildOcDlcCampaignProgress([], {}),
  ocCampaignState: buildOcMainCampaignState([], {}),
  heroTalents: {},
  heroSkins: {},
  portalStats: { pulls: 0, duplicateStreak: 0, history: [] },
  portalCollection: {
    cards: {},
    setProgress: {},
    threadDust: 0,
    duplicateMode: 'autoConvert',
    freeBoosterCredits: {},
    masterFrames: [],
    archives: [],
    hudThemes: [],
    karts: [],
    raceCareer: DEFAULT_KART_CAREER,
    battleMusic: [],
    stageMusic: [],
    fieldSupers: [],
    npcAssists: [],
    koEffects: [],
    portalEffects: [],
    introPoses: [],
    victoryPoses: [],
    profileBanners: [],
    profileTitles: [],
    activeHudTheme: null,
    activeKart: null,
    customLoadout: {
      archive: null,
      battleMusic: null,
      stageMusic: null,
      fieldSuper: null,
      npcAssist: null,
      koEffect: null,
      portalEffect: null,
      introPose: null,
      victoryPose: null,
      profileBanner: null,
      profileTitle: null
    },
    customBattlePreset: {
      mode: 'RPG',
      opponentControl: 'cpu',
      playerTeamIds: [],
      opponentTeamIds: [],
      enemyIds: [],
      stageArchiveId: null,
      battleMusicId: null,
      stageMusicId: null,
      fieldSuperId: null,
      difficulty: 'standard',
      items: true,
      hazards: true,
      stageVariant: 'lore',
      stageEventIntensity: 'full',
      stageTopologyId: 'auto',
      skipPreMatchInTraining: false
    }
  },
  publicProfile: { shareCode: null, title: 'Ancre Prime', visibility: 'private' },
  onboarding: {
    profileCreated: false,
    prologueCompleted: false,
    prologueStep: 0,
    introSeen: false
  },
  activityProgress: {
    dayKey: '',
    weekKey: '',
    claimedDaily: [],
    claimedWeekly: [],
    claimedMilestones: [],
    modeWins: {},
    itemActivations: 0,
    weeklyItemActivations: 0,
    dailyWins: 0,
    weeklyWins: 0,
    dailyModeWins: {},
    weeklyModeWins: {},
    lifetimeWins: 0,
    lifetimeAttempts: 0,
    seasonXp: 0,
    loginStreak: 0,
    lastSeenDay: '',
    defeatIntel: {},
    heroInstability: {},
    riftJournal: [],
    tutorialCompanionsUnlocked: false,
    activeSpecialEventId: null,
    reputationProgress: normalizeReputationProgress(),
    specialEventProgress: {}
  },
  inventory: ['nexus_anchor_coil'],
  equippedGear: {
    [PLAYER_HERO_ID]: null
  },
  equippedEventItems: {
    [PLAYER_HERO_ID]: null
  },
  hiddenUniverses: DEFAULT_HIDDEN_UNIVERSES,
  disabledAssets: {
    heroes: [],
    enemies: [],
    gear: [],
    stages: []
  }
};

const loadSave = () => {
  if (typeof window === 'undefined') return DEFAULT_SAVE;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    const legacyCareerRaw = window.localStorage.getItem(LEGACY_KART_CAREER_KEY);
    if (!raw && !legacyCareerRaw) return DEFAULT_SAVE;
    const parsed = raw ? JSON.parse(raw) : {};
    let legacyCareer = null;
    if (legacyCareerRaw) {
      try {
        legacyCareer = JSON.parse(legacyCareerRaw);
      } catch {
        legacyCareer = null;
      }
    }
    const migrated = migrateLegacyKartCareer(parsed, legacyCareer);
    return normalizeSavePayload(migrated, { existing: Boolean(raw) });
  } catch {
    return DEFAULT_SAVE;
  }
};

const saveGame = (payload, guard) => {
  if (typeof window === 'undefined') return { saved: false, reason: 'persistence-failed' };
  const result = guard.write(payload);
  if (!result.saved) return result;
  if (payload?.portalCollection?.raceCareer) {
    try { window.localStorage.removeItem(LEGACY_KART_CAREER_KEY); } catch { /* The full v9 save already contains this career. */ }
  }
  return result;
};

const appendUnique = (items = [], additions = []) => {
  const next = [...items];
  additions.forEach(item => {
    if (!next.includes(item)) next.push(item);
  });
  return next;
};

const hasMeaningfulTrace = payload => {
  if (!payload) return false;
  if (payload.onboarding?.profileCreated || payload.onboarding?.prologueCompleted) return true;
  if ((payload.completedStages || []).length > 0) return true;
  if ((payload.portalStats?.pulls || payload.portalStats?.packsOpened || 0) > 0) return true;
  if ((payload.activityProgress?.lifetimeAttempts || 0) > 0) return true;
  if ((payload.unlockedHeroes || []).some(heroId => heroId !== PLAYER_HERO_ID)) return true;
  // A payload from a legacy schema without onboarding metadata represents an
  // existing trace and must never be treated as an empty default.
  return !payload.onboarding;
};

const normalizeStoredCustomBattlePreset = (preset = {}) => {
  const uniqueIds = (value, limit) => (
    [...new Set(Array.isArray(value) ? value.filter(id => typeof id === 'string' && id.trim()) : [])]
      .slice(0, limit)
  );
  const optionalId = value => (typeof value === 'string' && value.trim() ? value : null);
  const explicitEventIntensity = Object.prototype.hasOwnProperty.call(preset, 'stageEventIntensity');
  const stageEventIntensity = !explicitEventIntensity && preset.hazards === false
    ? 'off'
    : normalizeStageEventIntensity(preset.stageEventIntensity);
  const stageTopologyId = preset.stageTopologyId === 'auto'
    ? 'auto'
    : normalizeStageTopologyId(preset.stageTopologyId) || 'auto';
  const mode = ['RPG', 'Tactics', 'Smash', 'Fighter'].includes(preset.mode) ? preset.mode : 'RPG';
  const opponentControl = ['cpu', 'p2'].includes(preset.opponentControl) ? preset.opponentControl : 'cpu';
  const requestedDifficulty = ['training', 'standard', 'expert'].includes(preset.difficulty) ? preset.difficulty : 'standard';
  const difficulty = opponentControl === 'p2' ? 'standard' : requestedDifficulty;
  return {
    mode,
    opponentControl,
    playerTeamIds: uniqueIds(preset.playerTeamIds, 3),
    opponentTeamIds: uniqueIds(preset.opponentTeamIds, 3),
    enemyIds: uniqueIds(preset.enemyIds, 6),
    stageArchiveId: optionalId(preset.stageArchiveId),
    battleMusicId: optionalId(preset.battleMusicId),
    stageMusicId: optionalId(preset.stageMusicId),
    fieldSuperId: optionalId(preset.fieldSuperId),
    difficulty,
    items: preset.items !== false,
    hazards: mode === 'Smash' ? true : preset.hazards !== false,
    stageVariant: normalizeStageVariant(preset.stageVariant),
    stageEventIntensity,
    stageTopologyId,
    skipPreMatchInTraining: opponentControl !== 'p2'
      && difficulty === 'training'
      && Boolean(preset.skipPreMatchInTraining)
  };
};

const normalizeSavePayload = (save = {}, { existing = false } = {}) => {
  const fromVersion = Number(save.saveVersion) || 0;
  const merged = { ...DEFAULT_SAVE, ...save };
  const onboarding = save.onboarding
    ? { ...DEFAULT_SAVE.onboarding, ...save.onboarding }
    : existing
      ? { profileCreated: true, prologueCompleted: true, prologueStep: 4, introSeen: true }
      : { ...DEFAULT_SAVE.onboarding };
  const legacyStarterIds = ['freeman', 'masterchief'];
  const hasOnlyLegacyStarterProgress = (
    (merged.portalStats?.pulls || 0) === 0
    && (merged.completedStages || []).length === 0
    && (merged.activityProgress?.lifetimeWins || 0) === 0
  );
  const hadHiddenUniverseData = Object.prototype.hasOwnProperty.call(save, 'hiddenUniverses');
  const mergedUnlockedHeroes = Array.isArray(merged.unlockedHeroes) ? merged.unlockedHeroes : [];
  const normalizedUnlockedHeroes = hasOnlyLegacyStarterProgress
    ? mergedUnlockedHeroes.filter(heroId => !legacyStarterIds.includes(heroId))
    : mergedUnlockedHeroes;
  const completedStages = new Set(Array.isArray(merged.completedStages) ? merged.completedStages : []);
  const completedStageIdSet = new Set([...completedStages].map(stageId => String(stageId)));
  const recoveredOcCampaignHeroes = OC_CAMPAIGN_MISSIONS
    .filter(mission => mission.rewardHeroId && completedStageIdSet.has(String(mission.id)))
    .map(mission => mission.rewardHeroId);
  const unlockedHeroesWithCampaignRewards = appendUnique(normalizedUnlockedHeroes, recoveredOcCampaignHeroes);
  const unlockedHeroes = unlockedHeroesWithCampaignRewards.includes(PLAYER_HERO_ID)
    ? unlockedHeroesWithCampaignRewards
    : [PLAYER_HERO_ID, ...unlockedHeroesWithCampaignRewards];
  const normalizedHeroLevels = {
    ...DEFAULT_SAVE.heroLevels,
    ...(merged.heroLevels || {}),
    ...Object.fromEntries(
      recoveredOcCampaignHeroes.map(heroId => [
        heroId,
        Math.max(1, Number(merged.heroLevels?.[heroId]) || 1)
      ])
    )
  };
  const mergedActiveTeam = Array.isArray(merged.activeTeam) ? merged.activeTeam : [];
  const normalizedActiveTeam = hasOnlyLegacyStarterProgress
    ? mergedActiveTeam.filter(heroId => !legacyStarterIds.includes(heroId))
    : mergedActiveTeam;
  const activeTeam = normalizedActiveTeam.includes(PLAYER_HERO_ID)
    ? normalizedActiveTeam.slice(0, 3)
    : [PLAYER_HERO_ID, ...normalizedActiveTeam.filter(id => id !== PLAYER_HERO_ID)].slice(0, 3);
  const shouldUseStoredHiddenUniverses = hadHiddenUniverseData
    && Array.isArray(merged.hiddenUniverses)
    && !(hasOnlyLegacyStarterProgress && merged.hiddenUniverses.length === 0);
  const storedHiddenUniverses = shouldUseStoredHiddenUniverses
    ? merged.hiddenUniverses
    : DEFAULT_HIDDEN_UNIVERSES;
  const inventory = Array.isArray(merged.inventory) ? merged.inventory : [];
  UNIVERSE_NARRATIVE_ARCS.forEach((arc, index) => {
    if (inventory.includes(`universe_arc_${arc.id}`)) completedStages.add(40000 + index);
  });
  TRIO_NARRATIVE_ARCS.forEach(arc => {
    if (inventory.includes(arc.rewardItemId)) completedStages.add(arc.stageId);
  });
  const hiddenUniverses = migrateHiddenUniversesForOcDlc(storedHiddenUniverses, fromVersion);
  const normalizedCompletedStages = [...new Set(
    [...completedStages].map(stageId => {
      if (typeof stageId !== 'string' || !stageId.trim()) return stageId;
      const numericStageId = Number(stageId);
      return Number.isSafeInteger(numericStageId) ? numericStageId : stageId;
    })
  )];
  const enabledContentPacks = getEnabledOcDlcPackIds(hiddenUniverses);
  const campaignProgress = buildOcDlcCampaignProgress(
    normalizedCompletedStages,
    merged.campaignProgress
  );
  const ocCampaignState = buildOcMainCampaignState(
    normalizedCompletedStages,
    merged.ocCampaignState
  );
  const normalizeCollectionIds = (entries) => (
    Array.isArray(entries)
      ? [...new Set(entries.filter(entry => typeof entry === 'string' && entry.trim()))]
      : []
  );
  const archives = Array.isArray(merged.portalCollection?.archives)
    ? merged.portalCollection.archives.filter(entry => entry?.id)
    : [];
  const hudThemes = Array.isArray(merged.portalCollection?.hudThemes)
    ? merged.portalCollection.hudThemes.filter(entry => entry?.id)
    : [];
  const karts = normalizeCollectionIds(merged.portalCollection?.karts);
  const raceCareer = normalizeKartCareer(merged.portalCollection?.raceCareer);
  const battleMusic = normalizeCollectionIds(merged.portalCollection?.battleMusic);
  const stageMusic = normalizeCollectionIds(merged.portalCollection?.stageMusic);
  const fieldSupers = normalizeCollectionIds(merged.portalCollection?.fieldSupers);
  const npcAssists = normalizeCollectionIds(merged.portalCollection?.npcAssists);
  const koEffects = normalizeCollectionIds(merged.portalCollection?.koEffects);
  const portalEffects = normalizeCollectionIds(merged.portalCollection?.portalEffects);
  const introPoses = normalizeCollectionIds(merged.portalCollection?.introPoses);
  const victoryPoses = normalizeCollectionIds(merged.portalCollection?.victoryPoses);
  const profileBanners = normalizeCollectionIds(merged.portalCollection?.profileBanners);
  const profileTitles = normalizeCollectionIds(merged.portalCollection?.profileTitles);
  const storedCustomLoadout = merged.portalCollection?.customLoadout || {};
  const customBattlePreset = normalizeStoredCustomBattlePreset(merged.portalCollection?.customBattlePreset);
  const normalizedSave = {
    ...merged,
    saveVersion: 9,
    lang: merged.lang === 'en' ? 'en' : 'fr',
    playerProfile: { ...DEFAULT_SAVE.playerProfile, ...(merged.playerProfile || {}) },
    onboarding,
    unlockedHeroes,
    activeTeam,
    heroLevels: normalizedHeroLevels,
    heroTalents: merged.heroTalents || {},
    heroSkins: merged.heroSkins || {},
    completedStages: normalizedCompletedStages,
    hiddenUniverses: hiddenUniverses.filter(universe => !isBaseGameUniverse(universe)),
    enabledContentPacks,
    campaignProgress,
    ocCampaignState,
    disabledAssets: {
      heroes: Array.isArray(merged.disabledAssets?.heroes) ? merged.disabledAssets.heroes : [],
      enemies: Array.isArray(merged.disabledAssets?.enemies) ? merged.disabledAssets.enemies : [],
      gear: Array.isArray(merged.disabledAssets?.gear) ? merged.disabledAssets.gear : [],
      stages: Array.isArray(merged.disabledAssets?.stages) ? merged.disabledAssets.stages : []
    },
    portalStats: { ...DEFAULT_SAVE.portalStats, ...(merged.portalStats || {}), history: (merged.portalStats?.history || []).slice(0, 100) },
    portalCollection: {
      cards: merged.portalCollection?.cards || {},
      setProgress: merged.portalCollection?.setProgress || {},
      threadDust: Math.max(0, Number(merged.portalCollection?.threadDust) || 0),
      duplicateMode: merged.portalCollection?.duplicateMode === 'keep' ? 'keep' : 'autoConvert',
      freeBoosterCredits: Object.fromEntries(
        Object.entries(merged.portalCollection?.freeBoosterCredits || {})
          .map(([setId, amount]) => [setId, Math.max(0, Math.floor(Number(amount) || 0))])
          .filter(([, amount]) => amount > 0)
      ),
      masterFrames: normalizeCollectionIds(merged.portalCollection?.masterFrames),
      archives,
      hudThemes,
      karts,
      raceCareer,
      battleMusic,
      stageMusic,
      fieldSupers,
      npcAssists,
      koEffects,
      portalEffects,
      introPoses,
      victoryPoses,
      profileBanners,
      profileTitles,
      activeHudTheme: hudThemes.some(theme => theme.id === merged.portalCollection?.activeHudTheme)
        ? merged.portalCollection.activeHudTheme
        : null,
      activeKart: karts.includes(merged.portalCollection?.activeKart)
        ? merged.portalCollection.activeKart
        : null,
      customLoadout: {
        archive: archives.some(archive => archive.id === storedCustomLoadout.archive)
          ? storedCustomLoadout.archive
          : null,
        battleMusic: battleMusic.includes(storedCustomLoadout.battleMusic)
          ? storedCustomLoadout.battleMusic
          : null,
        stageMusic: stageMusic.includes(storedCustomLoadout.stageMusic)
          ? storedCustomLoadout.stageMusic
          : null,
        fieldSuper: fieldSupers.includes(storedCustomLoadout.fieldSuper)
          ? storedCustomLoadout.fieldSuper
          : null,
        npcAssist: npcAssists.includes(storedCustomLoadout.npcAssist)
          ? storedCustomLoadout.npcAssist
          : null,
        koEffect: koEffects.includes(storedCustomLoadout.koEffect)
          ? storedCustomLoadout.koEffect
          : null,
        portalEffect: portalEffects.includes(storedCustomLoadout.portalEffect)
          ? storedCustomLoadout.portalEffect
          : null,
        introPose: introPoses.includes(storedCustomLoadout.introPose)
          ? storedCustomLoadout.introPose
          : null,
        victoryPose: victoryPoses.includes(storedCustomLoadout.victoryPose)
          ? storedCustomLoadout.victoryPose
          : null,
        profileBanner: profileBanners.includes(storedCustomLoadout.profileBanner)
          ? storedCustomLoadout.profileBanner
          : null,
        profileTitle: profileTitles.includes(storedCustomLoadout.profileTitle)
          ? storedCustomLoadout.profileTitle
          : null
      },
      customBattlePreset: {
        ...customBattlePreset,
        stageArchiveId: archives.some(archive => archive.id === customBattlePreset.stageArchiveId)
          ? customBattlePreset.stageArchiveId
          : null,
        battleMusicId: battleMusic.includes(customBattlePreset.battleMusicId)
          ? customBattlePreset.battleMusicId
          : null,
        stageMusicId: stageMusic.includes(customBattlePreset.stageMusicId)
          ? customBattlePreset.stageMusicId
          : null,
        fieldSuperId: fieldSupers.includes(customBattlePreset.fieldSuperId)
          ? customBattlePreset.fieldSuperId
          : null
      }
    },
    publicProfile: { ...DEFAULT_SAVE.publicProfile, ...(merged.publicProfile || {}) },
    activityProgress: {
      ...DEFAULT_SAVE.activityProgress,
      ...(merged.activityProgress || {}),
      reputationProgress: normalizeReputationProgress(merged.activityProgress?.reputationProgress),
      specialEventProgress: normalizeSpecialEventProgress(merged.activityProgress?.specialEventProgress)
    },
    equippedGear: { ...DEFAULT_SAVE.equippedGear, ...(merged.equippedGear || {}) },
    equippedEventItems: { ...DEFAULT_SAVE.equippedEventItems, ...(merged.equippedEventItems || {}) }
  };
  const withCardCollection = migrateCardCollectionSave(normalizedSave, { targetVersion: 9 });
  return migrateArcReplayState(
    withCardCollection,
    fromVersion < 9 ? ARC_REPLAY_DEFINITIONS : []
  );
};

const getProgressKeys = (date = new Date()) => {
  const dayKey = date.toISOString().slice(0, 10);
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((date - startOfYear) / 86400000) + startOfYear.getUTCDay() + 1) / 7);
  return { dayKey, weekKey: `${date.getUTCFullYear()}-W${weekNumber}` };
};

const getNextLoginStreak = (lastSeenDay, dayKey, currentStreak = 0) => {
  if (!lastSeenDay) return 1;
  if (lastSeenDay === dayKey) return currentStreak || 1;
  const last = new Date(`${lastSeenDay}T00:00:00Z`).getTime();
  const today = new Date(`${dayKey}T00:00:00Z`).getTime();
  return today - last === 86400000 ? (currentStreak || 0) + 1 : 1;
};

const getLocalizedStageText = (value, lang, fallback = '') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value[lang] || value.fr || value.en || fallback;
};

const getNonCombatStageDetails = (stage, lang) => {
  const isNonCombat = stage?.nonCombat === true
    || stage?.nC === true
    || Boolean(stage?.nonCombatTrial)
    || stage?.finalePolicy?.nonCombat === true
    || stage?.finalePolicy?.policy === 'nonCombatFinal';
  if (!isNonCombat) return null;

  const fallbackTitle = getLocalizedStageText(stage.displayName, lang, stage.name || stage.universe);
  const title = getLocalizedStageText(
    stage.nonCombatTrial?.title,
    lang,
    getLocalizedStageText(stage.finalePolicy?.name, lang, fallbackTitle)
  );
  const objective = getLocalizedStageText(
    stage.nonCombatTrial?.objective,
    lang,
    getLocalizedStageText(
      stage.finalePolicy?.objective,
      lang,
      stage.loreDescription || (lang === 'fr' ? `Reussir l epreuve ${title}.` : `Complete the ${title} trial.`)
    )
  );
  return { title, objective };
};

const getContactIntel = (stage, lang) => {
  const modifierName = stage?.modifier?.name?.[lang] || stage?.modifier?.id || (lang === 'fr' ? 'anomalie non classee' : 'unclassified anomaly');
  const source = stage?.sourceUniverses?.join(' / ') || stage?.universe || (lang === 'fr' ? 'Trame inconnue' : 'Unknown Thread');
  const nonCombatDetails = getNonCombatStageDetails(stage, lang);
  if (nonCombatDetails) {
    return lang === 'fr'
      ? `Donnees d epreuve: ${nonCombatDetails.title} / ${source} / objectif ${nonCombatDetails.objective}. A.R.C.A. conserve cette lecture pour la prochaine tentative.`
      : `Trial data: ${nonCombatDetails.title} / ${source} / objective ${nonCombatDetails.objective}. A.R.C.A. keeps this reading for the next attempt.`;
  }
  return lang === 'fr'
    ? `Donnees de contact: ${stage?.bossName || 'noyau hostile'} / ${source} / modificateur ${modifierName}. A.R.C.A. annonce une adaptation +5% HP sur la prochaine tentative.`
    : `Contact data: ${stage?.bossName || 'hostile core'} / ${source} / ${modifierName} modifier. A.R.C.A. grants +5% HP adaptation on the next attempt.`;
};

const getMissionNarrative = (stage, lang, isOutro, victory) => {
  if (stage.specialEventId) {
    if (!isOutro) {
      return getLocalizedStageText(
        stage.intro,
        lang,
        lang === 'fr'
          ? 'A.R.C.A. engage une operation saisonniere active.'
          : 'A.R.C.A. deploys an active seasonal operation.'
      );
    }
    if (victory) {
      return getLocalizedStageText(
        stage.outro,
        lang,
        lang === 'fr'
          ? 'L operation saisonniere est stabilisee et archivee.'
          : 'The seasonal operation is stabilized and archived.'
      );
    }
    const operationName = getLocalizedStageText(
      stage.displayName,
      lang,
      stage.name || stage.universe
    );
    return lang === 'fr'
      ? `${operationName} reste active. A.R.C.A. conserve les donnees de la tentative sans accorder la recompense saisonniere.`
      : `${operationName} remains active. A.R.C.A. keeps the attempt data without granting the seasonal reward.`;
  }
  if (stage.storyBeat) {
    if (!isOutro) {
      return stage.storyBeat.intro?.[lang]
        || stage.storyBeat.intro?.fr
        || stage.storyBeat.intro?.en
        || '';
    }
    if (victory) {
      return stage.storyBeat.outro?.[lang]
        || stage.storyBeat.outro?.fr
        || stage.storyBeat.outro?.en
        || '';
    }
    return lang === 'fr'
      ? `${stage.displayName?.fr || stage.name} reste instable. La cellule conserve les contradictions observees et recommencera sans fabriquer de victoire.`
      : `${stage.displayName?.en || stage.name} remains unstable. The cell preserves the observed contradictions and will try again without manufacturing a victory.`;
  }
  if (stage.tutorial) {
    if (!isOutro) {
      return lang === 'fr'
        ? 'La premiere ouverture reste dans l Atrium. A.R.C.A. projette une Marge Blanche contenue pour verifier que ta cellule peut se deplacer, employer un artefact puis rompre un noyau sans perdre sa coherence.'
        : 'The first opening remains inside the Atrium. A.R.C.A. projects a contained White Margin to verify that your cell can move, use an artifact, and break a core without losing coherence.';
    }
    return victory
      ? (lang === 'fr'
        ? 'La calibration est stable. Ta signature peut maintenant ouvrir des routes vers les Trames deplacees.'
        : 'Calibration is stable. Your signature can now open routes into displaced Threads.')
      : (lang === 'fr'
        ? 'A.R.C.A. interrompt la calibration avant toute perte de memoire. Les donnees de contact restent disponibles pour la prochaine tentative.'
        : 'A.R.C.A. stops calibration before any memory loss. Contact data remains available for the next attempt.');
  }
  if (stage.fusionMission) {
    if (!isOutro) return stage.fusionMission.decor[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.displayName.fr} est stabilisee. ${stage.rewardItemName.fr} rejoint l armurerie Nexus comme trace de recomposition.`
        : `${stage.displayName.en} is stabilized. ${stage.rewardItemName.en} enters the Nexus armory as a recomposition trace.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste dangereuse: les univers sources continuent de se contaminer.`
        : `${stage.displayName.en} remains dangerous: source universes keep contaminating each other.`);
  }
  if (stage.characterArc) {
    if (!isOutro) return stage.characterArc.intro[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.characterArc.outro.fr} ${stage.rewardItemName.fr} rejoint les archives personnelles comme signature stabilisee.`
        : `${stage.characterArc.outro.en} ${stage.rewardItemName.en} joins the personal archive as a stabilized signature.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste inachevee: la signature personnelle du heros n est pas encore assez stable.`
        : `${stage.displayName.en} remains unfinished: the hero personal signature is not stable enough yet.`);
  }
  if (stage.trioArc) {
    if (!isOutro) return stage.trioArc.intro[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.trioArc.outro.fr} ${stage.rewardItemName.fr} est gravee comme trace de cellule trio.`
        : `${stage.trioArc.outro.en} ${stage.rewardItemName.en} is engraved as a trio-cell trace.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste instable: la cellule trio n a pas encore trouve son rythme commun.`
        : `${stage.displayName.en} remains unstable: the trio cell has not found its shared rhythm yet.`);
  }
  if (stage.universeArc) {
    if (!isOutro) return stage.universeArc.intro[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.universeArc.outro.fr} ${stage.rewardItemName.fr} rejoint les archives d arcs univers.`
        : `${stage.universeArc.outro.en} ${stage.rewardItemName.en} joins the universe-arc archives.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} resiste encore: les univers sources ne resonneront pas ensemble sans nouvelle intervention.`
        : `${stage.displayName.en} still resists: its source universes will not resonate together without another intervention.`);
  }
  const lines = {
    'Alien': {
      intro: { fr: 'Le signal MU/TH/UR grince dans les couloirs. Chaque porte ouverte peut nourrir la ruche.', en: 'The MU/TH/UR signal grinds through the corridors. Every opened door can feed the hive.' },
      victory: { fr: 'La ruche recule, mais l acide grave encore les murs du Nexus.', en: 'The hive falls back, but acid still etches the Nexus walls.' }
    },
    'Predator': {
      intro: { fr: 'Les capteurs thermiques balayent la zone. Le clan attend une chasse digne du trophée.', en: 'Thermal sensors sweep the zone. The clan waits for a trophy-worthy hunt.' },
      victory: { fr: 'Le trophée est refusé à la breche: l honneur reste du cote de l escouade.', en: 'The breach is denied its trophy: honor stays with the squad.' }
    },
    'Stargate': {
      intro: { fr: 'Le vortex verrouille sept chevrons et projette le Nexus dans une coordonnee ancienne.', en: 'The vortex locks seven chevrons and throws the Nexus into ancient coordinates.' },
      victory: { fr: 'L iris se referme sur le signal hostile. La porte est stable.', en: 'The iris closes over the hostile signal. The gate is stable.' }
    },
    'Kaamelott': {
      intro: { fr: 'La Table Ronde tente un plan simple. Le Nexus detecte aussitot douze interpretations contradictoires.', en: 'The Round Table attempts a simple plan. The Nexus instantly detects twelve contradictory readings.' },
      victory: { fr: 'La breche capitule avant le prochain debat strategique.', en: 'The breach yields before the next strategic debate.' }
    },
    'Discworld': {
      intro: { fr: 'La magie octarine fuit entre deux regles de realite. Meme le Nexus hesite a classer le phenomene.', en: 'Octarine magic leaks between two rules of reality. Even the Nexus hesitates to classify it.' },
      victory: { fr: 'La realite est remise a peu pres droite, ce qui suffit pour aujourd hui.', en: 'Reality is set approximately straight, which is enough for today.' }
    },
    'Doom': {
      intro: { fr: 'Les sceaux infernaux cèdent. La seule diplomatie possible tient dans le canon.', en: 'Infernal seals fail. The only possible diplomacy fits inside a barrel.' },
      victory: { fr: 'Le front infernal est brise. Le Nexus archive la violence comme methode de stabilisation.', en: 'The infernal front breaks. The Nexus archives violence as a stabilization method.' }
    },
    'Hazbin Hotel': {
      intro: { fr: 'Le cabaret infernal transforme la breche en numero de redemption impossible.', en: 'The infernal cabaret turns the breach into an impossible redemption number.' },
      victory: { fr: 'Le rideau tombe, et meme la Singularity manque son rappel.', en: 'The curtain falls, and even the Singularity misses its encore.' }
    }
  };
  const profile = lines[stage.universe];
  if (profile) {
    if (!isOutro) return profile.intro[lang];
    return victory ? profile.victory[lang] : (lang === 'fr' ? `${stage.universe} reste instable, mais son pattern narratif est maintenant isole.` : `${stage.universe} remains unstable, but its narrative pattern is now isolated.`);
  }
  if (!isOutro) {
    return lang === 'fr'
      ? `Le Nexus isole une signature propre a ${stage.universe}. La scene se charge de symboles locaux avant l impact.`
      : `The Nexus isolates a signature unique to ${stage.universe}. The scene fills with local symbols before impact.`;
  }
  return victory
    ? (lang === 'fr' ? `${stage.universe} rejoint les archives actives du Nexus avec une signature stabilisee.` : `${stage.universe} joins the active Nexus archives with a stabilized signature.`)
    : (lang === 'fr' ? `${stage.universe} resiste encore, mais la prochaine ouverture sera plus lisible.` : `${stage.universe} still resists, but the next opening will be easier to read.`);
};

function MissionNarrativeScreen({ lang, stage, result, rewardSummary, onContinue }) {
  const isOutro = Boolean(result);
  const escortBriefing = useMemo(() => stage.mode === 'Tactics' && getTacticsBattlefield(stage).objective === 'escort' ? getTacticsEscortBriefing(stage, lang) : '', [stage, lang]);
  const victory = result === 'victory';
  const nonCombatDetails = getNonCombatStageDetails(stage, lang);
  const backdrop = stage.stageArt || stage.image || getOpenAiBackdropSrc(stage.universe, stage.mode);
  const modifierName = stage.modifier?.name?.[lang] || stage.modifier?.id || (lang === 'fr' ? 'Anomalie inconnue' : 'Unknown anomaly');
  const modifierDesc = stage.modifier?.desc?.[lang] || '';
  const rarity = stage.lootRarity?.label || 'Common';
  const title = nonCombatDetails
    ? isOutro
      ? victory
        ? (lang === 'fr' ? 'EPREUVE REUSSIE' : 'TRIAL COMPLETED')
        : (lang === 'fr' ? 'EPREUVE INACHEVEE' : 'TRIAL INCOMPLETE')
      : (lang === 'fr' ? 'SEQUENCE D EPREUVE' : 'TRIAL SEQUENCE')
    : isOutro
      ? victory
        ? (lang === 'fr' ? 'BRECHE STABILISEE' : 'BREACH STABILIZED')
        : (lang === 'fr' ? 'REPLI D ANCRE' : 'ANCHOR RETREAT')
      : (lang === 'fr' ? 'SEQUENCE NARRATIVE' : 'NARRATIVE SEQUENCE');
  const modeLine = nonCombatDetails
    ? (lang === 'fr'
      ? `La cellule suit les regles de l epreuve ${nonCombatDetails.title}. Objectif: ${nonCombatDetails.objective}`
      : `The squad follows the ${nonCombatDetails.title} trial rules. Objective: ${nonCombatDetails.objective}`)
    : stage.mode === 'RPG'
      ? (lang === 'fr' ? 'L escouade avance selon le protocole Resonance: initiative, charges et rupture du noyau.' : 'The squad advances under the Resonance protocol: initiative, charges, and core rupture.')
      : stage.mode === 'Tactics'
        ? (lang === 'fr' ? 'Le champ se decoupe en lignes d ancrage: chaque zone devient une decision de survie.' : 'The field splits into anchor lanes: every zone becomes a survival decision.')
        : (lang === 'fr' ? 'La breche explose en arene d impact ou les signatures frappent avant dissolution.' : 'The breach bursts into an impact arena where signatures strike before dissolution.');
  const narrativeLine = getMissionNarrative(stage, lang, isOutro, victory);
  const preparedBrief = Array.isArray(stage.launchBrief) ? stage.launchBrief.join(' ') : '';
  const preparedOutcome = Array.isArray(stage.outcomePreview)
    ? stage.outcomePreview.find((line) => (
      victory
        ? /^(victoire|victory)\s*:/i.test(line)
        : /^(defaite|défaite|defeat)\s*:/i.test(line)
    )) || ''
    : '';
  const introText = nonCombatDetails
    ? (lang === 'fr'
      ? `${narrativeLine} ${preparedBrief || `${modeLine} Le Nexus archive le titre et l objectif reels de cette epreuve.`}`
      : `${narrativeLine} ${preparedBrief || `${modeLine} The Nexus records this trial's authored title and objective.`}`)
    : lang === 'fr'
      ? `${narrativeLine} ${preparedBrief || `Les archives du Nexus detectent ${stage.bossName}, lie au pattern "${modifierName}". ${modeLine} Objectif: verrouiller les coordonnees avant que le Sans-Auteur n efface la memoire de cette Trame.`}`
      : `${narrativeLine} ${preparedBrief || `Nexus archives detect ${stage.bossName}, tied to the "${modifierName}" pattern. ${modeLine} Objective: lock the coordinates before the Authorless erases this Thread memory.`}`;
  const outroText = nonCombatDetails
    ? victory
      ? (lang === 'fr'
        ? `${narrativeLine} ${preparedOutcome || `Epreuve ${nonCombatDetails.title} reussie. Objectif valide: ${nonCombatDetails.objective}`}`
        : `${narrativeLine} ${preparedOutcome || `${nonCombatDetails.title} trial completed. Objective validated: ${nonCombatDetails.objective}`}`)
      : (lang === 'fr'
        ? `${narrativeLine} ${preparedOutcome || `Epreuve ${nonCombatDetails.title} inachevee. Objectif conserve: ${nonCombatDetails.objective}`}`
        : `${narrativeLine} ${preparedOutcome || `${nonCombatDetails.title} trial incomplete. Objective retained: ${nonCombatDetails.objective}`}`)
    : victory
      ? (lang === 'fr'
        ? `${narrativeLine} ${preparedOutcome || `Les donnees de ${stage.bossName} rejoignent le codex, la signature ${rarity} est indexee et les caches sont transferees a l armurerie.`}`
        : `${narrativeLine} ${preparedOutcome || `${stage.bossName} data enters the codex, ${rarity} signature is indexed, and caches are transferred to the armory.`}`)
      : (lang === 'fr'
        ? `${narrativeLine} ${preparedOutcome || `L escouade conserve les donnees de contact, mais ${stage.bossName} garde le controle local du signal.`}`
        : `${narrativeLine} ${preparedOutcome || `The squad keeps contact data, but ${stage.bossName} still controls the local signal.`}`);

  return (
    <div className="narrative-screen">
      <div className="narrative-backdrop" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,1,8,0.35), rgba(2,1,8,0.82)), url(${backdrop || ''})` }}>
        <div className="narrative-rift" />
        <div className="narrative-scanline" />
        <div className="narrative-copy">
          <div className="narrative-kicker">{title}</div>
          <h1>{stage.displayName?.[lang] || stage.universe}</h1>
          <h2>{stage.sourceUniverses ? stage.sourceUniverses.join(' / ') : stage.name}</h2>
          <p>{isOutro ? outroText : introText}</p>
          {escortBriefing && <div className="narrative-intel">{escortBriefing}</div>}
          {isOutro && rewardSummary && (
            <div className="narrative-intel" style={{ display: 'grid', gap: '6px' }}>
              <strong style={{ color: rewardSummary.result === 'victory' ? '#2ecc71' : '#ffeb3b' }}>
                {lang === 'fr' ? 'Transmission de stabilisation A.R.C.A.' : 'A.R.C.A. stabilization transmission'}
              </strong>
              <span>
                {lang === 'fr'
                  ? (nonCombatDetails
                    ? `Rapport d epreuve: ${nonCombatDetails.title} / objectif ${nonCombatDetails.objective}`
                    : `Rapport de mission: ${stage.mode} / ${stage.universe} / cible ${stage.bossName}.`)
                  : (nonCombatDetails
                    ? `Trial report: ${nonCombatDetails.title} / objective ${nonCombatDetails.objective}`
                    : `Mission report: ${stage.mode} / ${stage.universe} / target ${stage.bossName}.`)}
              </span>
              <span>
                {lang === 'fr'
                  ? `Ressources: +${rewardSummary.gold} or / +${rewardSummary.shards} fragments${rewardSummary.tokens ? ` / +${rewardSummary.tokens} jetons` : ''}.`
                  : `Resources: +${rewardSummary.gold} gold / +${rewardSummary.shards} shards${rewardSummary.tokens ? ` / +${rewardSummary.tokens} tokens` : ''}.`}
              </span>
              <span>
                {victory
                  ? (lang === 'fr'
                    ? 'Impact durable: la coordonnee est scellee, ses archives alimentent les arcs, collections et bonus Nexus.'
                    : 'Long-term impact: the coordinate is sealed, feeding arcs, collections, and Nexus bonuses.')
                  : (lang === 'fr'
                    ? 'Impact durable: la coordonnee reste ouverte, mais les donnees de contact ameliorent la prochaine tentative.'
                    : 'Long-term impact: the coordinate stays open, but contact data improves the next attempt.')}
              </span>
              <span>
                {lang === 'fr'
                  ? `Artefacts de terrain actives: ${rewardSummary.battleItemsUsed}.`
                  : `Field artifacts activated: ${rewardSummary.battleItemsUsed}.`}
              </span>
              {rewardSummary.firstClear && (
                <span>{lang === 'fr' ? 'Prime de premiere stabilisation gravee dans la Trame.' : 'First-stabilization prime engraved into the Thread.'}</span>
              )}
              {rewardSummary.consolation && (
                <span>{lang === 'fr' ? 'Cache de repli attribuee: la tentative progresse meme sans victoire.' : 'Retreat cache granted: the attempt still progresses without victory.'}</span>
              )}
              {rewardSummary.contactIntel && (
                <span>{rewardSummary.contactIntel}</span>
              )}
              {rewardSummary.adaptation && (
                <span>{lang === 'fr' ? 'Adaptation A.R.C.A.: prochaine tentative sur cette faille, +5% HP equipe.' : 'A.R.C.A. adaptation: next attempt on this rift, +5% team HP.'}</span>
              )}
              {rewardSummary.instability && (
                <span>{lang === 'fr' ? 'Instabilite douce: heros deployes a -5% stats pendant 1 mission.' : 'Soft instability: deployed heroes suffer -5% stats for 1 mission.'}</span>
              )}
              {rewardSummary.rewardItemName && (
                <span>{lang === 'fr' ? `Trace speciale archivee: ${rewardSummary.rewardItemName}.` : `Special trace archived: ${rewardSummary.rewardItemName}.`}</span>
              )}
              {rewardSummary.eventRewardName && (
                <span>{lang === 'fr' ? `Relique evenementielle archivee: ${rewardSummary.eventRewardName}.` : `Event relic archived: ${rewardSummary.eventRewardName}.`}</span>
              )}
              {rewardSummary.rewardHeroName && (
                <span>{lang === 'fr'
                  ? `Nouvelle recrue Cellule ZERO: ${rewardSummary.rewardHeroName}.`
                  : `New Cell ZERO recruit: ${rewardSummary.rewardHeroName}.`}</span>
              )}
              {rewardSummary.droppedItemName && (
                <span>{lang === 'fr' ? `Relique recuperee: ${rewardSummary.droppedItemName}.` : `Relic recovered: ${rewardSummary.droppedItemName}.`}</span>
              )}
              {rewardSummary.smashMasteryBonus > 0 && rewardSummary.battleSummary && (
                <span>{lang === 'fr'
                  ? `Maitrise melee: rang ${rewardSummary.battleSummary.grade}, +${rewardSummary.smashMasteryBonus} fragments de stabilisation.`
                  : `Melee mastery: grade ${rewardSummary.battleSummary.grade}, +${rewardSummary.smashMasteryBonus} stabilization shards.`}</span>
              )}
              {rewardSummary.tacticsMasteryBonus > 0 && rewardSummary.battleSummary && (
                <span>{lang === 'fr'
                  ? `Maitrise tactique: rang ${rewardSummary.battleSummary.grade}, +${rewardSummary.tacticsMasteryBonus} fragments de stabilisation.`
                  : `Tactics mastery: grade ${rewardSummary.battleSummary.grade}, +${rewardSummary.tacticsMasteryBonus} stabilization shards.`}</span>
              )}
            </div>
          )}
          <div className="narrative-tags">
            <span>{stage.mode}</span>
            <span>{modifierName}</span>
            <span>{nonCombatDetails?.title || stage.bossName}</span>
          </div>
          {modifierDesc && <div className="narrative-intel">{modifierDesc}</div>}
          <button onClick={onContinue} className="btn-retro narrative-button">
            {isOutro && victory && stage.campaignFinale
              ? (lang === 'fr' ? 'OUVRIR LE REGISTRE PRIMORDIAL' : 'OPEN THE PRIMORDIAL LEDGER')
              : isOutro
                ? (lang === 'fr' ? 'RETOUR AU HUB' : 'RETURN TO HUB')
              : (lang === 'fr' ? 'LANCER LA MISSION' : 'LAUNCH MISSION')}
          </button>
        </div>
      </div>
    </div>
  );
}

function OcCampaignEndingScreen({
  lang,
  playerProfile,
  previousEndingId,
  endingHistory = [],
  onComplete
}) {
  const [selectedEndingId, setSelectedEndingId] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const selectedEnding = selectedEndingId ? getOcCampaignEnding(selectedEndingId) : null;
  const scenes = selectedEnding?.scenes || [];
  const currentScene = scenes[sceneIndex] || null;
  const isLastScene = Boolean(selectedEnding && sceneIndex >= Math.max(0, scenes.length - 1));
  const localize = value => value?.[lang] || value?.fr || value?.en || '';
  const epilogueIntro = localize(OC_CAMPAIGN_EPILOGUE.intro);
  const endingBackdrop = getOcCampaignMission(OC_FINAL_MISSION_ID)?.image || '';

  const chooseEnding = (endingId) => {
    setSelectedEndingId(endingId);
    setSceneIndex(0);
    sound.playSfx('special');
  };

  if (!selectedEnding) {
    return (
      <div className="narrative-screen oc-ending-screen">
        <div
          className="narrative-backdrop oc-ending-backdrop"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2,1,8,0.58), rgba(2,1,8,0.94)), url(${endingBackdrop})`
          }}
        >
          <div className="narrative-rift" />
          <div className="narrative-scanline" />
          <main className="oc-ending-copy" aria-labelledby="oc-ending-title">
            <div className="narrative-kicker">
              {lang === 'fr' ? 'ACTE V · DECISION D ANCRE' : 'ACT V · ANCHOR DECISION'}
            </div>
            <h1 id="oc-ending-title">{localize(OC_CAMPAIGN_EPILOGUE.title)}</h1>
            <p>{epilogueIntro}</p>
            <div className="oc-ending-warning">
              {lang === 'fr'
                ? `${playerProfile?.name || 'Ancre'}, les quatre issues sont reelles. Aucune ne sera effacee de la Chronique.`
                : `${playerProfile?.name || 'Anchor'}, all four outcomes are real. None will be erased from the Chronicle.`}
            </div>
            <div className="oc-ending-grid">
              {OC_CAMPAIGN_ENDINGS.map(ending => {
                const wasSeen = endingHistory.includes(ending.id);
                const wasLast = previousEndingId === ending.id;
                return (
                  <button
                    key={ending.id}
                    type="button"
                    className={`oc-ending-choice${wasSeen ? ' seen' : ''}${wasLast ? ' previous' : ''}`}
                    style={{
                      '--ending-primary': ending.colors?.primary || '#39c5bb',
                      '--ending-secondary': ending.colors?.secondary || '#ffeb3b'
                    }}
                    onClick={() => chooseEnding(ending.id)}
                  >
                    <span>{localize(ending.shortLabel || ending.title)}</span>
                    <strong>{localize(ending.title)}</strong>
                    <p>{localize(ending.summary)}</p>
                    <em>
                      {wasLast
                        ? (lang === 'fr' ? 'DERNIERE FIN INSCRITE' : 'LAST RECORDED ENDING')
                        : wasSeen
                          ? (lang === 'fr' ? 'DEJA VUE' : 'ALREADY SEEN')
                          : (lang === 'fr' ? 'ISSUE NON INSCRITE' : 'UNRECORDED OUTCOME')}
                    </em>
                  </button>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className="narrative-screen oc-ending-screen"
      style={{
        '--ending-primary': selectedEnding.colors?.primary || '#39c5bb',
        '--ending-secondary': selectedEnding.colors?.secondary || '#ffeb3b'
      }}
    >
      <div
        className="narrative-backdrop oc-ending-backdrop"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2,1,8,0.64), rgba(2,1,8,0.94)), url(${endingBackdrop})`
        }}
      >
        <div className="narrative-rift" />
        <div className="narrative-scanline" />
        <main className="oc-ending-copy oc-ending-epilogue" aria-live="polite">
          <div className="narrative-kicker">
            {lang === 'fr' ? `EPILOGUE ${sceneIndex + 1}/${Math.max(1, scenes.length)}` : `EPILOGUE ${sceneIndex + 1}/${Math.max(1, scenes.length)}`}
          </div>
          <h1>{localize(selectedEnding.title)}</h1>
          {currentScene && (
            <blockquote className="oc-ending-scene">
              <strong>{localize(currentScene.speaker)}</strong>
              <p>{localize(currentScene.text)}</p>
            </blockquote>
          )}
          {isLastScene && (
            <section className="oc-ending-consequence">
              <span>{lang === 'fr' ? 'CONSEQUENCE PERSISTANTE' : 'PERSISTENT CONSEQUENCE'}</span>
              <p>{localize(selectedEnding.consequence)}</p>
              <b>{localize(selectedEnding.rewardItemName)}</b>
              <div className="oc-ending-credits">
                {(OC_CAMPAIGN_EPILOGUE.credits || []).map((credit, index) => (
                  <span key={`${credit.name}-${index}`}>
                    <small>{localize(credit.role)}</small>
                    {credit.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          <div className="oc-ending-actions">
            <button
              type="button"
              className="btn-retro"
              onClick={() => {
                if (sceneIndex > 0) {
                  setSceneIndex(index => index - 1);
                } else {
                  setSelectedEndingId(null);
                }
                sound.playSfx('click');
              }}
            >
              {sceneIndex > 0
                ? (lang === 'fr' ? 'SCENE PRECEDENTE' : 'PREVIOUS SCENE')
                : (lang === 'fr' ? 'AUTRE ISSUE' : 'OTHER OUTCOME')}
            </button>
            <button
              type="button"
              className="btn-retro narrative-button"
              onClick={() => {
                if (!isLastScene) {
                  setSceneIndex(index => index + 1);
                  sound.playSfx('coin');
                  return;
                }
                onComplete(selectedEnding.id);
              }}
            >
              {isLastScene
                ? (lang === 'fr' ? 'INSCRIRE CETTE FIN' : 'RECORD THIS ENDING')
                : (lang === 'fr' ? 'SCENE SUIVANTE' : 'NEXT SCENE')}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function NexusLoadingScreen({ lang, label }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle, #0e0722 0%, #03010b 100%)',
      color: '#39c5bb',
      fontFamily: '"Share Tech Mono", monospace',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{
        padding: '18px 22px',
        border: '1px solid rgba(57,197,187,0.35)',
        background: 'rgba(0,0,0,0.42)',
        borderRadius: '6px',
        boxShadow: '0 0 22px rgba(57,197,187,0.18)'
      }}>
        <div style={{ fontSize: '12px', color: '#ffeb3b', marginBottom: '8px', textTransform: 'uppercase' }}>
          {lang === 'fr' ? 'Synchronisation A.R.C.A.' : 'A.R.C.A. Sync'}
        </div>
        <div style={{ fontSize: '15px' }}>
          {label || (lang === 'fr' ? 'Chargement de la Trame...' : 'Loading Thread...')}
        </div>
      </div>
    </div>
  );
}

class CombatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Combat screen failed', error);
  }

  render() {
    const { error } = this.state;
    const { lang, onBack, children } = this.props;
    if (!error) return children;
    return (
      <div className="narrative-screen">
        <div className="narrative-backdrop" style={{ backgroundImage: 'linear-gradient(90deg, rgba(2,1,8,0.82), rgba(2,1,8,0.94))' }}>
          <div className="narrative-rift" />
          <div className="narrative-copy">
            <div className="narrative-kicker">{lang === 'fr' ? 'DIAGNOSTIC COMBAT' : 'COMBAT DIAGNOSTIC'}</div>
            <h1>{lang === 'fr' ? 'Simulation interrompue' : 'Simulation interrupted'}</h1>
            <p>
              {lang === 'fr'
                ? 'A.R.C.A. a coupe la breche avant un ecran noir complet. Retourne au hub puis relance la mission.'
                : 'A.R.C.A. cut the breach before a full black screen. Return to the hub and launch the mission again.'}
            </p>
            <div className="narrative-intel">{error.message}</div>
            <button onClick={onBack} className="btn-retro narrative-button">
              {lang === 'fr' ? 'RETOUR AU HUB' : 'RETURN TO HUB'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class HubErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Nexus hub screen failed', error, info?.componentStack || '');
  }

  render() {
    const { error } = this.state;
    const { lang, onBack, children } = this.props;
    if (!error) return children;
    return (
      <div className="narrative-screen">
        <div className="narrative-backdrop">
          <div className="narrative-rift" />
          <div className="narrative-copy">
            <div className="narrative-kicker">{lang === 'fr' ? 'REPLI D ARCHIVE A.R.C.A.' : 'A.R.C.A. ARCHIVE RETREAT'}</div>
            <h1>{lang === 'fr' ? 'Trace d interface interrompue' : 'Interface trace interrupted'}</h1>
            <p>
              {lang === 'fr'
                ? 'A.R.C.A. a isole l onglet fautif avant qu il ne fasse tomber toute la partie. La progression locale reste conservee.'
                : 'A.R.C.A. isolated the faulty tab before it could crash the whole game. Local progress remains preserved.'}
            </p>
            <div className="narrative-intel">{error.message}</div>
            <button onClick={onBack} className="btn-retro narrative-button">
              {lang === 'fr' ? 'RETOUR AU SIGNAL TITRE' : 'RETURN TO TITLE SIGNAL'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function App() {
  const [initialSave] = useState(loadSave);
  const localSaveGuardRef = useRef(null);
  if (!localSaveGuardRef.current && typeof window !== 'undefined') {
    let storage;
    try { storage = window.localStorage; } catch { /* The guard reports denied persistence without crashing the screen. */ }
    localSaveGuardRef.current = createLocalSaveGuard(storage, SAVE_KEY);
  }
  const [localSaveIssue, setLocalSaveIssue] = useState(null);
  const rotationTransactionRef = useRef(false);
  const getCurrentSaveRef = useRef(null);
  const cloudSaveTimerRef = useRef(null);
  const skipNextCloudSaveRef = useRef(false);
  const cloudUpdatedAtRef = useRef(null);
  const [lang, setLang] = useState(initialSave.lang); // FR default as requested, EN toggle
  const [currentScreen, setCurrentScreen] = useState('title');
  const [portalMode, setPortalMode] = useState('store');
  const [hubInitialTab, setHubInitialTab] = useState('missions');
  const [audioSettings, setAudioSettings] = useState(() => sound.getSettings());
  const [isOnline, setIsOnline] = useState(() => (
    typeof navigator === 'undefined' ? true : navigator.onLine
  ));
  const [titleDayKey, setTitleDayKey] = useState(() => getLocalDayKey());
  const [gold, setGold] = useState(initialSave.gold);
  const [breachShards, setBreachShards] = useState(initialSave.breachShards);
  const [eventTokens, setEventTokens] = useState(initialSave.eventTokens);
  const [playerProfile, setPlayerProfile] = useState(initialSave.playerProfile);
  const [unlockedHeroes, setUnlockedHeroes] = useState(initialSave.unlockedHeroes);
  const [heroLevels, setHeroLevels] = useState(initialSave.heroLevels);
  const [activeTeam, setActiveTeam] = useState(initialSave.activeTeam);
  const [completedStages, setCompletedStages] = useState(initialSave.completedStages);
  const [completedArcIds, setCompletedArcIds] = useState(initialSave.completedArcIds || []);
  const [arcReplayUnlockedIds, setArcReplayUnlockedIds] = useState(initialSave.arcReplayUnlockedIds || []);
  const [campaignProgress, setCampaignProgress] = useState(initialSave.campaignProgress);
  const [ocCampaignState, setOcCampaignState] = useState(initialSave.ocCampaignState);
  const [activeStage, setActiveStage] = useState(null);
  const [lastBattleResult, setLastBattleResult] = useState(null);
  const [lastBattleSummary, setLastBattleSummary] = useState(null);
  const [heroTalents, setHeroTalents] = useState(initialSave.heroTalents); // heroId -> talentId
  const [heroSkins, setHeroSkins] = useState(initialSave.heroSkins);
  const [hiddenUniverses, setHiddenUniverses] = useState(initialSave.hiddenUniverses);
  const [disabledAssets, setDisabledAssets] = useState(initialSave.disabledAssets);
  const [portalStats, setPortalStats] = useState(initialSave.portalStats);
  const [portalCollection, setPortalCollection] = useState(initialSave.portalCollection);
  const [publicProfile, setPublicProfile] = useState(initialSave.publicProfile);
  const [onboarding, setOnboarding] = useState(initialSave.onboarding);
  const [activityProgress, setActivityProgress] = useState(initialSave.activityProgress);

  // Inventory & Equipment
  const [inventory, setInventory] = useState(initialSave.inventory);
  const [equippedGear, setEquippedGear] = useState(initialSave.equippedGear);
  // Equipped Event Items (1 slot per hero)
  const [equippedEventItems, setEquippedEventItems] = useState(initialSave.equippedEventItems);
  const [account, setAccount] = useState(() => getStoredSession());
  const [cloudSyncState, setCloudSyncState] = useState(() => (
    getStoredSession() ? 'unreconciled' : 'detached'
  ));
  const [cloudStatus, setCloudStatus] = useState(() => (
    getStoredSession()
      ? 'Signature detectee. Reconciliation requise avant toute synchronisation.'
      : 'Trace locale active. Ancre une signature pour synchroniser.'
  ));
  const collectionBonusCount = inventory.filter(itemId => (
    itemId.startsWith('collection_reward_')
    || itemId.startsWith('arc_reward_')
    || itemId.startsWith('arc_')
    || itemId.startsWith('fusion_')
  )).length;
  const titleRotationRoster = useMemo(() => buildTitleRotationRoster({
    unlockedHeroIds: unlockedHeroes,
    heroes: [createPlayerHero(playerProfile), ...HEROES_DB],
    hiddenUniverses,
    disabledHeroIds: disabledAssets.heroes || [],
    dayKey: titleDayKey,
    maxItems: 6
  }), [unlockedHeroes, playerProfile, hiddenUniverses, disabledAssets.heroes, titleDayKey]);
  const titleRotation = useMemo(() => titleRotationRoster.map((entry, index) => {
    const preferredMode = TITLE_PRESENTATION_MODES[index % TITLE_PRESENTATION_MODES.length];
    const candidates = [preferredMode, ...TITLE_PRESENTATION_MODES.filter(mode => mode !== preferredMode)];
    const resolvedMode = candidates.find(mode => getOpenAiBackdropSrc(entry.universe, mode)) || preferredMode;
    return {
      ...entry,
      mode: resolvedMode,
      image: getOpenAiBackdropSrc(entry.universe, resolvedMode) || '/images/missions/fusion-rifts.webp'
    };
  }), [titleRotationRoster]);
  const titleAttractCards = useMemo(() => buildUnlockedAttractCards({
    history: portalStats.history || [],
    cards: portalCollection.cards || {},
    hiddenUniverses,
    maxItems: 6
  }), [portalStats.history, portalCollection.cards, hiddenUniverses]);
  const titleAttractStageRoster = useMemo(() => buildUnlockedAttractStages({
    completedStageIds: completedStages,
    journal: activityProgress.riftJournal || [],
    unlockedFallbackStages: onboarding.profileCreated
      ? [{
          stageId: 90000,
          title: lang === 'fr' ? 'Premiere directive - Faille de l Atrium' : 'First Directive - Atrium Rift',
          universe: 'Nexus de Convergence',
          mode: 'RPG'
        }]
      : [],
    hiddenUniverses,
    disabledStageIds: disabledAssets.stages || [],
    maxItems: 6
  }), [completedStages, activityProgress.riftJournal, onboarding.profileCreated, lang, hiddenUniverses, disabledAssets.stages]);
  const titleAttractStages = useMemo(() => titleAttractStageRoster.map(stage => ({
    ...stage,
    image: getOpenAiBackdropSrc(stage.universe, stage.mode) || '/images/missions/fusion-rifts.webp'
  })), [titleAttractStageRoster]);
  const titleEventDate = useMemo(() => {
    const [year, month, day] = String(titleDayKey).split('-').map(Number);
    return Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
      ? new Date(Date.UTC(year, month - 1, day, 12))
      : new Date(Date.UTC(1970, 0, 1, 12));
  }, [titleDayKey]);
  const activeTitleEvents = useMemo(() => getActiveSpecialEvents(titleEventDate), [titleEventDate]);
  const titleEventVariant = useMemo(() => {
    const activeEvent = activeTitleEvents.find(event => event.id === activityProgress.activeSpecialEventId);
    if (!activeEvent) return null;
    const stage = buildSpecialEventStage(activeEvent, titleEventDate);
    return {
      id: activeEvent.id,
      title: activeEvent.title?.[lang] || activeEvent.title?.fr || activeEvent.id,
      tokenCount: eventTokens,
      windowLabel: formatSpecialEventWindow(activeEvent, lang, titleEventDate.getUTCFullYear()),
      stageTitle: stage?.displayName?.[lang] || stage?.displayName?.fr || '',
      playable: stage?.missionDeployment?.allowed === true
    };
  }, [activeTitleEvents, activityProgress.activeSpecialEventId, eventTokens, lang, titleEventDate]);
  const titleEventOptions = useMemo(() => SPECIAL_EVENTS.map(event => ({
    id: event.id,
    title: event.title?.[lang] || event.title?.fr || event.id,
    active: isSpecialEventActive(event, titleEventDate),
    windowLabel: formatSpecialEventWindow(event, lang, titleEventDate.getUTCFullYear())
  })), [lang, titleEventDate]);
  const selectTitleEventVariant = useCallback(eventId => {
    const normalizedEventId = SPECIAL_EVENTS.some(event => (
      event.id === eventId && isSpecialEventActive(event, titleEventDate)
    )) ? eventId : null;
    setActivityProgress(previous => ({
      ...previous,
      activeSpecialEventId: normalizedEventId
    }));
    sound.playSfx(normalizedEventId ? 'confirm' : 'click');
  }, [titleEventDate]);

  const getCurrentSave = useCallback(() => {
    const normalizedCompletedArcIds = [...new Set(completedArcIds)];
    const normalizedReplayIds = [...new Set([
      ...arcReplayUnlockedIds,
      ...normalizedCompletedArcIds
    ])];
    return {
      saveVersion: 9,
      lang,
      gold,
      breachShards,
      eventTokens,
      playerProfile,
      unlockedHeroes,
      heroLevels,
      activeTeam,
      completedStages,
      completedArcIds: normalizedCompletedArcIds,
      arcReplayUnlockedIds: normalizedReplayIds,
      enabledContentPacks: getEnabledOcDlcPackIds(hiddenUniverses),
      campaignProgress: buildOcDlcCampaignProgress(completedStages, campaignProgress),
      ocCampaignState: buildOcMainCampaignState(completedStages, ocCampaignState),
      heroTalents,
      heroSkins,
      hiddenUniverses,
      disabledAssets,
      portalStats,
      portalCollection,
      publicProfile,
      onboarding,
      activityProgress,
      inventory,
      equippedGear,
      equippedEventItems
    };
  }, [lang, gold, breachShards, eventTokens, playerProfile, unlockedHeroes, heroLevels, activeTeam, completedStages, completedArcIds, arcReplayUnlockedIds, campaignProgress, ocCampaignState, heroTalents, heroSkins, hiddenUniverses, disabledAssets, portalStats, portalCollection, publicProfile, onboarding, activityProgress, inventory, equippedGear, equippedEventItems]);
  getCurrentSaveRef.current = getCurrentSave;

  const persistLocalSave = useCallback(payload => {
    const result = saveGame(payload, localSaveGuardRef.current);
    setLocalSaveIssue(result.saved ? null : result.reason);
    if (!result.saved) window.clearTimeout(cloudSaveTimerRef.current);
    return result;
  }, []);

  const rerollPortalRotation = useCallback(async request => {
    if (rotationTransactionRef.current) return { applied: false, reason: 'busy' };
    rotationTransactionRef.current = true;
    const commit = () => {
      const result = applyBoosterRotationReroll(getCurrentSaveRef.current(), request);
      if (!result.applied) return { applied: false, reason: result.reason };
      const persisted = persistLocalSave(result.save);
      if (!persisted.saved) return { applied: false, reason: persisted.reason };
      // Persist currency + selection together before updating either React state.
      getCurrentSaveRef.current = () => result.save;
      setGold(result.save.gold);
      setPortalStats(result.save.portalStats);
      return { applied: true, reason: null };
    };
    try {
      return navigator.locks?.request ? await navigator.locks.request(SAVE_KEY, commit) : commit();
    } catch {
      return { applied: false, reason: 'persistence-failed' };
    } finally {
      rotationTransactionRef.current = false;
    }
  }, [persistLocalSave]);

  useEffect(() => {
    let cancelled = false;
    const persistAndScheduleCloud = () => {
      if (cancelled) return;
      const payload = getCurrentSaveRef.current();
      if (!persistLocalSave(payload).saved) return;

      if (!account?.access_token || cloudSyncState !== 'ready' || !isOnline) return;
      if (skipNextCloudSaveRef.current) {
        skipNextCloudSaveRef.current = false;
        return;
      }

      window.clearTimeout(cloudSaveTimerRef.current);
      cloudSaveTimerRef.current = window.setTimeout(async () => {
        try {
          const row = await updateCloudSave(account, payload, cloudUpdatedAtRef.current);
          cloudUpdatedAtRef.current = row.updated_at;
          setCloudStatus(lang === 'fr' ? 'Trace Nexus synchronisee dans le cloud.' : 'Nexus trace synced to cloud.');
        } catch (err) {
          setCloudSyncState(err instanceof CloudSaveConflictError ? 'conflict' : 'suspended');
          setCloudStatus(`${lang === 'fr' ? 'Synchronisation Nexus impossible' : 'Nexus sync failed'}: ${err.message}`);
        }
      }, 1200);
    };
    if (navigator.locks?.request) {
      navigator.locks.request(SAVE_KEY, persistAndScheduleCloud).catch(() => setLocalSaveIssue('persistence-failed'));
    } else persistAndScheduleCloud();

    return () => { cancelled = true; window.clearTimeout(cloudSaveTimerRef.current); };
  }, [getCurrentSave, account, lang, cloudSyncState, isOnline, persistLocalSave]);

  useEffect(() => {
    const checkExternalSave = event => {
      if (event.key !== SAVE_KEY && event.key !== null) return;
      const result = localSaveGuardRef.current.check();
      if (!result.ok) { setLocalSaveIssue(result.reason); window.clearTimeout(cloudSaveTimerRef.current); }
    };
    window.addEventListener('storage', checkExternalSave);
    return () => window.removeEventListener('storage', checkExternalSave);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setCloudStatus(lang === 'fr'
        ? 'Hors ligne. La trace locale reste disponible; aucun envoi cloud ne sera tente.'
        : 'Offline. The local trace remains available; no cloud upload will be attempted.');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang]);

  useEffect(() => {
    let dayTimer = null;
    const scheduleNextLocalDay = () => {
      const now = new Date();
      setTitleDayKey(getLocalDayKey(now));
      const nextDay = new Date(now);
      nextDay.setHours(24, 0, 1, 0);
      dayTimer = window.setTimeout(scheduleNextLocalDay, Math.max(1000, nextDay.getTime() - now.getTime()));
    };
    scheduleNextLocalDay();
    return () => window.clearTimeout(dayTimer);
  }, []);

  useEffect(() => {
    const unlockAudio = () => sound.unlockFromGesture();
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    const { dayKey, weekKey } = getProgressKeys(titleEventDate);
    const scheduledEventId = getActiveSpecialEvents(titleEventDate)[0]?.id || null;
    setActivityProgress(prev => {
      if (
        prev.lastSeenDay === dayKey
        && prev.dayKey === dayKey
        && prev.weekKey === weekKey
        && prev.activeSpecialEventId === scheduledEventId
      ) return prev;
      return {
        ...prev,
        dayKey,
        weekKey,
        claimedDaily: prev.dayKey === dayKey ? (prev.claimedDaily || []) : [],
        claimedWeekly: prev.weekKey === weekKey ? (prev.claimedWeekly || []) : [],
        itemActivations: prev.dayKey === dayKey ? (prev.itemActivations || 0) : 0,
        weeklyItemActivations: prev.weekKey === weekKey ? (prev.weeklyItemActivations || 0) : 0,
        dailyWins: prev.dayKey === dayKey ? (prev.dailyWins || 0) : 0,
        weeklyWins: prev.weekKey === weekKey ? (prev.weeklyWins || 0) : 0,
        dailyModeWins: prev.dayKey === dayKey ? (prev.dailyModeWins || {}) : {},
        weeklyModeWins: prev.weekKey === weekKey ? (prev.weeklyModeWins || {}) : {},
        loginStreak: getNextLoginStreak(prev.lastSeenDay, dayKey, prev.loginStreak),
        lastSeenDay: dayKey,
        activeSpecialEventId: scheduledEventId
      };
    });
  }, [titleEventDate]);

  // La demande musicale est mise en attente; le moteur ne cree son contexte
  // qu apres la premiere interaction autorisee par le navigateur.
  useEffect(() => {
    if (currentScreen === 'title') {
      sound.playBgm('title');
    } else if (['profile', 'prologue', 'hub'].includes(currentScreen)) {
      sound.playBgm('hub');
    }
    return () => {
      sound.stopBgm();
    };
  }, [currentScreen]);

  const getStarterCellSnapshot = () => {
    const nextUnlockedHeroes = appendUnique(
      unlockedHeroes.includes(PLAYER_HERO_ID) ? unlockedHeroes : [PLAYER_HERO_ID, ...unlockedHeroes],
      TUTORIAL_COMPANION_IDS
    );
    const nextHeroLevels = {
      ...heroLevels,
      [PLAYER_HERO_ID]: heroLevels[PLAYER_HERO_ID] || 1,
      ...Object.fromEntries(TUTORIAL_COMPANION_IDS.map(heroId => [heroId, heroLevels[heroId] || 1]))
    };
    const withPlayer = activeTeam.includes(PLAYER_HERO_ID) ? activeTeam : [PLAYER_HERO_ID, ...activeTeam];
    return {
      unlockedHeroes: nextUnlockedHeroes,
      heroLevels: nextHeroLevels,
      activeTeam: appendUnique(withPlayer, TUTORIAL_COMPANION_IDS).slice(0, 3),
      activityProgress: { ...activityProgress, tutorialCompanionsUnlocked: true }
    };
  };

  const ensureStarterCell = () => {
    const starterCell = getStarterCellSnapshot();
    setUnlockedHeroes(starterCell.unlockedHeroes);
    setHeroLevels(starterCell.heroLevels);
    setActiveTeam(starterCell.activeTeam);
    setActivityProgress(starterCell.activityProgress);
    return starterCell;
  };

  const startOperation = () => {
    const nextProfile = { ...playerProfile, name: String(playerProfile?.name || '').trim() || 'Ancre' };
    const nextOnboarding = {
      ...onboarding,
      profileCreated: true,
      prologueCompleted: false,
      prologueStep: 0,
      introSeen: true
    };
    setPlayerProfile(nextProfile);
    setOnboarding(nextOnboarding);
    const starterCell = ensureStarterCell();
    setCurrentScreen('prologue');
    sound.playSfx('levelup');
    return { ...getCurrentSave(), ...starterCell, playerProfile: nextProfile, onboarding: nextOnboarding };
  };

  const replayPrologue = () => {
    setOnboarding(prev => ({ ...prev, prologueStep: 0, introSeen: true }));
    setCurrentScreen('prologue');
    sound.playSfx('special');
  };

  const movePrologue = (direction) => {
    setOnboarding(prev => ({
      ...prev,
      prologueStep: Math.max(0, Math.min(4, (Number(prev.prologueStep) || 0) + direction)),
      introSeen: true
    }));
    sound.playSfx(direction > 0 ? 'coin' : 'click');
  };

  const finishPrologue = () => {
    setOnboarding(prev => ({
      ...prev,
      profileCreated: true,
      prologueCompleted: true,
      prologueStep: 4,
      introSeen: true
    }));
    ensureStarterCell();
    setCurrentScreen('hub');
    sound.playSfx('levelup');
  };

  const handleLaunchStage = (stage) => {
    // Defense en profondeur : un appel programmatique ne contourne pas le
    // verrou de composition deja evalue par le Hub.
    if (!canLaunchPreparedMission(stage)) return;
    sound.playSfx('special');
    setActiveStage(stage);
    setLastBattleResult(null);
    setLastBattleSummary(null);
    // Les cinematiques de premier parcours ne sont pas rejouees une fois que
    // l arc a explicitement ouvert son mode equipe libre.
    setCurrentScreen(getPreparedMissionLaunchScreen(stage));
  };

  const launchTitleSpecialEvent = () => {
    const event = SPECIAL_EVENTS.find(candidate => candidate.id === activityProgress.activeSpecialEventId);
    if (!event) return;
    const stage = buildSpecialEventStage(event, titleEventDate);
    if (!stage?.missionDeployment?.allowed) return;
    handleLaunchStage(stage);
  };

  const handleBattleEnd = (result, report = {}) => {
    const battleItemsUsed = report.battleItemsUsed || 0;
    const battleSummary = report.battleSummary || null;
    const firstClear = isFirstClearMissionVictory(result, activeStage, completedStages);
    const summary = {
      result,
      gold: 0,
      shards: 0,
      tokens: 0,
      battleItemsUsed,
      firstClear,
      droppedItemName: null,
      rewardItemName: null,
      eventRewardName: null,
      rewardHeroName: null,
      consolation: false,
      contactIntel: null,
      adaptation: false,
      instability: false,
      battleSummary,
      smashMasteryBonus: 0
    };
    const createRiftJournalEntry = (entryResult, extra = {}) => {
      const source = activeStage.sourceUniverses?.join(' / ') || activeStage.universe;
      const title = activeStage.displayName?.[lang] || activeStage.name || activeStage.universe;
      const nonCombatDetails = getNonCombatStageDetails(activeStage, lang);
      return {
        id: `${activeStage.id}-${Date.now()}-${entryResult}`,
        at: new Date().toISOString(),
        stageId: activeStage.id,
        result: entryResult,
        universe: activeStage.universe,
        source,
        mode: activeStage.mode,
        title,
        text: entryResult === 'victory'
          ? (lang === 'fr'
            ? (nonCombatDetails
              ? `A.R.C.A. archive ${title}: epreuve ${nonCombatDetails.title} reussie, objectif "${nonCombatDetails.objective}" valide, coordonnee ${source} scellee dans la Trame Nexus.`
              : `A.R.C.A. archive ${title}: ${activeStage.bossName} neutralise, coordonnee ${source} scellee, consequence inscrite dans la Trame Nexus.`)
            : (nonCombatDetails
              ? `A.R.C.A. archives ${title}: ${nonCombatDetails.title} trial completed, objective "${nonCombatDetails.objective}" validated, ${source} coordinate sealed in the Nexus Thread.`
              : `A.R.C.A. archives ${title}: ${activeStage.bossName} neutralized, ${source} coordinate sealed, consequence written into the Nexus Thread.`))
          : (lang === 'fr'
            ? (nonCombatDetails
              ? `Repli sur ${title}: epreuve ${nonCombatDetails.title} inachevee, objectif "${nonCombatDetails.objective}" conserve par A.R.C.A. pour la prochaine tentative.`
              : `Repli sur ${title}: ${activeStage.bossName} conserve le signal local, mais A.R.C.A. garde les donnees de contact pour la prochaine tentative.`)
            : (nonCombatDetails
              ? `Retreat on ${title}: ${nonCombatDetails.title} trial incomplete; objective "${nonCombatDetails.objective}" retained by A.R.C.A. for the next attempt.`
              : `Retreat on ${title}: ${activeStage.bossName} keeps the local signal, but A.R.C.A. stores contact data for the next attempt.`)),
        ...extra
      };
    };

    if (result === 'victory' && activeStage) {
      // Award rewards
      const firstClearGold = firstClear ? 25 : 0;
      const firstClearShards = firstClear ? 10 : 0;
      const itemMasteryTokens = battleItemsUsed >= 3 ? 1 : 0;
      const seasonRewardBonus = Math.min(0.18, Math.floor((activityProgress.seasonXp || 0) / 500) * 0.02);
      const reputationShardMultiplier = getReputationResourceMultiplier(
        'shards',
        activityProgress.reputationProgress
      );
      const smashGradeBonus = activeStage.mode === 'Smash' && battleSummary?.mode === 'Smash'
        ? ({ S: 18, A: 12, B: 7, C: 3 }[battleSummary.grade] || 0)
        : 0;
      const tacticsGradeBonus = activeStage.mode === 'Tactics' && battleSummary?.mode === 'Tactics'
        ? ({ S: 16, A: 10, B: 6, C: 2 }[battleSummary.grade] || 0)
        : 0;
      summary.smashMasteryBonus = smashGradeBonus;
      summary.tacticsMasteryBonus = tacticsGradeBonus;
      summary.gold = Math.round(activeStage.goldPrize * (1 + seasonRewardBonus)) + firstClearGold;
      summary.shards = Math.round((
        Math.round(activeStage.shardPrize * (1 + seasonRewardBonus))
        + firstClearShards
        + smashGradeBonus
        + tacticsGradeBonus
      ) * reputationShardMultiplier);
      summary.tokens = (activeStage.tokenPrize || 0) + itemMasteryTokens;
      setGold(prev => prev + summary.gold);
      setBreachShards(prev => prev + summary.shards);
      
      if (summary.tokens > 0) {
        setEventTokens(prev => prev + summary.tokens);
      }

      if (firstClear) {
        const nextCompletedStages = appendUnique(completedStages, [activeStage.id]);
        setCompletedStages(nextCompletedStages);
        const replayState = migrateArcReplayState({
          completedStages: nextCompletedStages,
          completedArcIds,
          arcReplayUnlockedIds
        }, ARC_REPLAY_DEFINITIONS);
        setCompletedArcIds(replayState.completedArcIds);
        setArcReplayUnlockedIds(replayState.arcReplayUnlockedIds);
        const ocMission = getOcCampaignMission(activeStage.id);
        if (ocMission) {
          const campaignStages = appendUnique(completedStages, [activeStage.id]);
          setOcCampaignState(prev => buildOcMainCampaignState(campaignStages, {
            ...prev,
            lastMissionId: activeStage.id
          }));
        }
      }

      // Les traces et objets d evenement sont des recompenses de premiere
      // victoire. Les ressources de combat et les drops restent rejouables.
      if (shouldGrantFirstClearMissionReward(firstClear, activeStage.rewardItemId)) {
        setInventory(prev => prev.includes(activeStage.rewardItemId) ? prev : [...prev, activeStage.rewardItemId]);
        summary.rewardItemName = activeStage.rewardItemName?.[lang] || activeStage.rewardItemName?.en || activeStage.rewardItemId;
      }

      if (shouldGrantFirstClearMissionReward(firstClear, activeStage.eventRewardId)) {
        setInventory(prev => appendUnique(prev, [activeStage.eventRewardId]));
        const eventReward = Object.values(EVENT_ITEMS_DB).find(item => item.id === activeStage.eventRewardId);
        summary.eventRewardName = eventReward?.name?.[lang]
          || eventReward?.name?.fr
          || eventReward?.name?.en
          || activeStage.eventRewardId;
      }

      if (shouldGrantFirstClearMissionReward(firstClear, activeStage.rewardHeroId)) {
        const heroAlreadyUnlocked = unlockedHeroes.includes(activeStage.rewardHeroId);
        setUnlockedHeroes(prev => appendUnique(prev, [activeStage.rewardHeroId]));
        setHeroLevels(prev => ({
          ...prev,
          [activeStage.rewardHeroId]: Math.max(1, Number(prev[activeStage.rewardHeroId]) || 1)
        }));
        if (!heroAlreadyUnlocked) {
          summary.rewardHeroName = activeStage.rewardHeroName?.[lang]
            || activeStage.rewardHeroName?.fr
            || activeStage.rewardHeroName?.en
            || activeStage.rewardHeroId;
        }
      }

      const { dayKey, weekKey } = getProgressKeys();
      const seasonGain = 35
        + (firstClear ? 20 : 0)
        + (battleItemsUsed * 4)
        + (smashGradeBonus > 0 ? 8 : 0)
        + (tacticsGradeBonus > 0 ? 8 : 0)
        + (activeStage.isSurvival ? 15 : 0)
        + (activeStage.finalGameBoss ? 100 : 0);
      setActivityProgress(prev => ({
        ...prev,
        dayKey,
        weekKey,
        itemActivations: (prev.dayKey === dayKey ? (prev.itemActivations || 0) : 0) + battleItemsUsed,
        weeklyItemActivations: (prev.weekKey === weekKey ? (prev.weeklyItemActivations || 0) : 0) + battleItemsUsed,
        dailyWins: (prev.dayKey === dayKey ? (prev.dailyWins || 0) : 0) + 1,
        weeklyWins: (prev.weekKey === weekKey ? (prev.weeklyWins || 0) : 0) + 1,
        dailyModeWins: {
          ...(prev.dayKey === dayKey ? (prev.dailyModeWins || {}) : {}),
          [activeStage.mode]: ((prev.dayKey === dayKey ? prev.dailyModeWins?.[activeStage.mode] : 0) || 0) + 1,
          any: ((prev.dayKey === dayKey ? prev.dailyModeWins?.any : 0) || 0) + 1
        },
        weeklyModeWins: {
          ...(prev.weekKey === weekKey ? (prev.weeklyModeWins || {}) : {}),
          [activeStage.mode]: ((prev.weekKey === weekKey ? prev.weeklyModeWins?.[activeStage.mode] : 0) || 0) + 1,
          any: ((prev.weekKey === weekKey ? prev.weeklyModeWins?.any : 0) || 0) + 1
        },
        lifetimeWins: (prev.lifetimeWins || 0) + 1,
        lifetimeAttempts: (prev.lifetimeAttempts || 0) + 1,
        seasonXp: (prev.seasonXp || 0) + seasonGain,
        reputationProgress: awardMissionReputation(prev.reputationProgress, activeStage, {
          victory: true,
          firstClear
        }),
        specialEventProgress: recordSpecialEventResult(prev.specialEventProgress, activeStage, {
          result: 'victory',
          grade: battleSummary?.grade
        }),
        defeatIntel: Object.fromEntries(
          Object.entries(prev.defeatIntel || {}).filter(([stageId]) => String(stageId) !== String(activeStage.id))
        ),
        heroInstability: Object.fromEntries(
          Object.entries(prev.heroInstability || {})
            .map(([heroId, value]) => [heroId, activeTeam.includes(heroId) ? Math.max(0, (Number(value) || 0) - 1) : Number(value) || 0])
            .filter(([, value]) => value > 0)
        ),
        modeWins: {
          ...(prev.modeWins || {}),
          [activeStage.mode]: (prev.modeWins?.[activeStage.mode] || 0) + 1,
          any: (prev.modeWins?.any || 0) + 1
        },
        riftJournal: [
          createRiftJournalEntry('victory', {
            firstClear,
            rewardItemName: summary.rewardItemName,
            eventRewardName: summary.eventRewardName,
            rewardHeroName: summary.rewardHeroName,
            battleSummary,
            smashMasteryBonus: summary.smashMasteryBonus,
            tacticsMasteryBonus: summary.tacticsMasteryBonus,
            rewards: { gold: summary.gold, shards: summary.shards, tokens: summary.tokens }
          }),
          ...(prev.riftJournal || [])
        ].slice(0, 12)
      }));

      // Check if they dropped a random relic/item from the stage's universe
      const disabledGear = new Set(disabledAssets.gear || []);
      const universeGear = EQUIP_ITEMS_DB.filter(item => item.universe === activeStage.universe && !disabledGear.has(item.id));
      const rarityDropBonus = {
        common: 0,
        rare: 0.12,
        epic: 0.22,
        legendary: 0.32,
        anomaly: 0.42
      };
      const rarityId = activeStage.lootRarity?.id || 'common';
      if (universeGear.length > 0 && Math.random() < 0.6 + (rarityDropBonus[rarityId] || 0)) {
        const drop = universeGear[Math.floor(Math.random() * universeGear.length)];
        const dropId = ['legendary', 'anomaly'].includes(rarityId) ? `${drop.id}_plus` : drop.id;
        const alreadyOwnedCommon = rarityId === 'common' && inventory.includes(drop.id);
        if (!alreadyOwnedCommon) {
          summary.droppedItemName = `${drop.name?.[lang] || drop.name?.en || drop.id}${dropId.endsWith('_plus') ? ' +' : ''}`;
        }
        setInventory(prev => {
          if (rarityId === 'common' && prev.includes(drop.id)) return prev;
          return [...prev, dropId];
        });
      }
    } else if (result === 'defeat' && activeStage) {
      summary.consolation = true;
      summary.contactIntel = getContactIntel(activeStage, lang);
      summary.adaptation = true;
      summary.instability = true;
      summary.gold = Math.max(8, Math.round(activeStage.goldPrize * 0.18));
      summary.shards = Math.max(4, Math.round(activeStage.shardPrize * 0.22));
      setGold(prev => prev + summary.gold);
      setBreachShards(prev => prev + summary.shards);

      const { dayKey, weekKey } = getProgressKeys();
      setActivityProgress(prev => ({
        ...prev,
        dayKey,
        weekKey,
        defeatIntel: {
          ...(prev.defeatIntel || {}),
          [activeStage.id]: {
            stageId: activeStage.id,
            universe: activeStage.universe,
            sourceUniverses: activeStage.sourceUniverses || null,
            bossName: activeStage.bossName,
            modifierId: activeStage.modifier?.id || null,
            modifierName: activeStage.modifier?.name || null,
            attempts: ((prev.defeatIntel || {})[activeStage.id]?.attempts || 0) + 1,
            scannedAt: new Date().toISOString()
          }
        },
        heroInstability: {
          ...Object.fromEntries(
            Object.entries(prev.heroInstability || {})
              .filter(([heroId]) => !activeTeam.includes(heroId))
              .map(([heroId, value]) => [heroId, Math.max(0, Number(value) || 0)])
              .filter(([, value]) => value > 0)
          ),
          ...Object.fromEntries(activeTeam.map(heroId => [heroId, 1]))
        },
        itemActivations: (prev.dayKey === dayKey ? (prev.itemActivations || 0) : 0) + battleItemsUsed,
        weeklyItemActivations: (prev.weekKey === weekKey ? (prev.weeklyItemActivations || 0) : 0) + battleItemsUsed,
        lifetimeAttempts: (prev.lifetimeAttempts || 0) + 1,
        seasonXp: (prev.seasonXp || 0) + 12 + (battleItemsUsed * 2),
        reputationProgress: awardMissionReputation(prev.reputationProgress, activeStage, {
          victory: false,
          firstClear: false
        }),
        specialEventProgress: recordSpecialEventResult(prev.specialEventProgress, activeStage, {
          result: 'defeat',
          grade: battleSummary?.grade
        }),
        riftJournal: [
          createRiftJournalEntry('defeat', {
            contactIntel: summary.contactIntel,
            rewards: { gold: summary.gold, shards: summary.shards, tokens: 0 }
          }),
          ...(prev.riftJournal || [])
        ].slice(0, 12)
      }));
    }
    if (isFreeMissionReplay(activeStage)) {
      setLastBattleSummary(null);
      setLastBattleResult(null);
      setActiveStage(null);
      setCurrentScreen(getPreparedMissionCompletionScreen(activeStage));
      return;
    }
    setLastBattleSummary(result === 'quit' ? null : summary);
    setLastBattleResult(result);
    setCurrentScreen('missionOutro');
  };

  const closeMissionOutro = () => {
    if (lastBattleResult === 'victory' && activeStage?.id === OC_FINAL_MISSION_ID) {
      setCurrentScreen('campaignEnding');
      sound.playSfx('special');
      return;
    }
    setCurrentScreen('hub');
    setActiveStage(null);
    setLastBattleResult(null);
    setLastBattleSummary(null);
  };

  const replayOcCampaignEnding = () => {
    const finalMission = getOcCampaignMission(OC_FINAL_MISSION_ID);
    if (!finalMission || !completedStages.includes(OC_FINAL_MISSION_ID)) return;
    setActiveStage(finalMission);
    setLastBattleResult('victory');
    setLastBattleSummary(null);
    setCurrentScreen('campaignEnding');
    sound.playSfx('special');
  };

  const completeOcCampaignEnding = (endingId) => {
    const ending = getOcCampaignEnding(endingId);
    if (!ending) return;
    const completedAt = ocCampaignState?.completedAt || new Date().toISOString();
    const endingHistory = appendUnique(ocCampaignState?.endingHistory || [], [ending.id]);
    const campaignStages = appendUnique(completedStages, [OC_FINAL_MISSION_ID]);

    setOcCampaignState(prev => buildOcMainCampaignState(campaignStages, {
      ...prev,
      endingId: ending.id,
      endingHistory,
      completedAt,
      epilogueSeen: true,
      completionRewardClaimed: true
    }));
    setInventory(prev => appendUnique(prev, [ending.rewardItemId, OC_CAMPAIGN_SKIN_ID].filter(Boolean)));
    setHeroSkins(prev => ({ ...prev, [PLAYER_HERO_ID]: OC_CAMPAIGN_SKIN_ID }));
    setPublicProfile(prev => ({
      ...prev,
      title: ending.profileTitle?.[lang] || ending.profileTitle?.fr || ending.profileTitle?.en || prev.title
    }));
    setCurrentScreen('hub');
    setActiveStage(null);
    setLastBattleResult(null);
    setLastBattleSummary(null);
    sound.playSfx('levelup');
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'fr' : 'en';
    setLang(nextLang);
    sound.playSfx('coin');
  };

  const changeAudioSetting = (setting, value) => {
    const nextSettings = setting === 'musicVolume'
      ? sound.setMusicVolume(value)
      : sound.setSfxVolume(value);
    setAudioSettings(nextSettings);
  };

  const toggleMute = () => {
    sound.setMute(!audioSettings.muted);
    setAudioSettings(sound.getSettings());
  };

  const applySave = (save, { existing = true, navigateTo = 'hub', acceptExternalChange = false } = {}) => {
    const merged = normalizeSavePayload(save, { existing });
    // Automatic cloud restoration must never adopt another tab's newer trace.
    // Only an explicit import, reset or confirmed cloud choice can rebase it.
    const localStatus = acceptExternalChange
      ? localSaveGuardRef.current?.rebase()
      : localSaveGuardRef.current?.check();
    if (!localStatus?.ok) {
      window.clearTimeout(cloudSaveTimerRef.current);
      setLocalSaveIssue(localStatus?.reason || 'persistence-failed');
      throw new Error(localStatus?.reason || 'persistence-failed');
    }
    setLocalSaveIssue(null);
    setLang(merged.lang);
    setGold(merged.gold);
    setBreachShards(merged.breachShards);
    setEventTokens(merged.eventTokens);
    setPlayerProfile(merged.playerProfile || DEFAULT_SAVE.playerProfile);
    setUnlockedHeroes(merged.unlockedHeroes);
    setHeroLevels(merged.heroLevels);
    setActiveTeam(merged.activeTeam);
    setCompletedStages(merged.completedStages);
    setCompletedArcIds(merged.completedArcIds || []);
    setArcReplayUnlockedIds(merged.arcReplayUnlockedIds || []);
    setCampaignProgress(merged.campaignProgress || DEFAULT_SAVE.campaignProgress);
    setOcCampaignState(merged.ocCampaignState || DEFAULT_SAVE.ocCampaignState);
    setHeroTalents(merged.heroTalents);
    setHeroSkins(merged.heroSkins || {});
    setHiddenUniverses(merged.hiddenUniverses || []);
    setDisabledAssets(merged.disabledAssets || DEFAULT_SAVE.disabledAssets);
    setPortalStats(merged.portalStats || DEFAULT_SAVE.portalStats);
    setPortalCollection(merged.portalCollection || DEFAULT_SAVE.portalCollection);
    setPublicProfile(merged.publicProfile || DEFAULT_SAVE.publicProfile);
    setOnboarding(merged.onboarding || DEFAULT_SAVE.onboarding);
    setActivityProgress(merged.activityProgress || DEFAULT_SAVE.activityProgress);
    setInventory(merged.inventory);
    setEquippedGear(merged.equippedGear);
    setEquippedEventItems(merged.equippedEventItems);
    setActiveStage(null);
    setLastBattleResult(null);
    setLastBattleSummary(null);
    if (navigateTo) setCurrentScreen(navigateTo);
    return merged;
  };

  const exportSave = async () => {
    const raw = JSON.stringify(getCurrentSave());
    try {
      await navigator.clipboard.writeText(raw);
      window.alert(lang === 'fr' ? 'Trace Nexus copiee dans le presse-papiers.' : 'Nexus trace copied to clipboard.');
    } catch {
      window.prompt(lang === 'fr' ? 'Copie ta trace Nexus :' : 'Copy your Nexus trace:', raw);
    }
  };

  const importSave = () => {
    const raw = window.prompt(lang === 'fr' ? 'Colle ta trace Nexus exportee :' : 'Paste exported Nexus trace:');
    if (!raw) return;
    try {
      window.clearTimeout(cloudSaveTimerRef.current);
      if (account) setCloudSyncState('conflict');
      applySave(JSON.parse(raw), { existing: true, navigateTo: 'hub', acceptExternalChange: true });
      if (account) {
        setCloudStatus(lang === 'fr'
          ? 'Trace importee localement. Archive cloud preservee jusqu a un choix explicite.'
          : 'Trace imported locally. Cloud archive preserved until an explicit choice.');
      }
      sound.playSfx('levelup');
    } catch {
      window.alert(lang === 'fr' ? 'Trace Nexus invalide.' : 'Invalid Nexus trace.');
    }
  };

  const resetSave = () => {
    if (!window.confirm(lang === 'fr' ? 'Purger completement la trace Nexus ?' : 'Fully purge Nexus trace?')) return;
    window.clearTimeout(cloudSaveTimerRef.current);
    window.localStorage.removeItem(SAVE_KEY);
    window.localStorage.removeItem(LEGACY_KART_CAREER_KEY);
    setCloudSyncState(account ? 'conflict' : 'detached');
    cloudUpdatedAtRef.current = null;
    applySave({ ...DEFAULT_SAVE, lang }, { existing: false, navigateTo: 'title', acceptExternalChange: true });
    setCloudStatus(account
      ? (lang === 'fr' ? 'Trace locale purgee. Archive cloud preservee.' : 'Local trace purged. Cloud archive preserved.')
      : (lang === 'fr' ? 'Trace locale purgee.' : 'Local trace purged.'));
    sound.playSfx('click');
  };

  const reconcileCloudSave = async session => {
    window.clearTimeout(cloudSaveTimerRef.current);
    setCloudSyncState('reconciling');
    setCloudStatus(lang === 'fr' ? 'Comparaison des Traces locale et cloud...' : 'Comparing local and cloud Traces...');

    try {
      const row = await loadCloudSave(session);
      const localStatus = localSaveGuardRef.current?.check();
      if (!localStatus?.ok) {
        setLocalSaveIssue(localStatus?.reason || 'persistence-failed');
        throw new Error(localStatus?.reason || 'persistence-failed');
      }
      // Gameplay may have advanced while the network request was pending.
      const localPayload = getCurrentSaveRef.current();
      const cloudPayload = row?.payload || null;
      const resolution = resolveCloudSaveConflict({
        localPayload,
        cloudPayload,
        localHasTrace: hasMeaningfulTrace(localPayload),
        cloudHasTrace: hasMeaningfulTrace(cloudPayload)
      });

      if (resolution.action === CLOUD_SAVE_CONFLICT_ACTIONS.NOOP) {
        cloudUpdatedAtRef.current = row?.updated_at || null;
        skipNextCloudSaveRef.current = Boolean(row);
        setCloudSyncState(row ? 'ready' : 'empty');
        setCloudStatus(row
          ? (lang === 'fr' ? 'Traces identiques. Archive cloud verifiee.' : 'Traces match. Cloud archive verified.')
          : (lang === 'fr' ? 'Aucune Trace gravee dans le cloud.' : 'No Trace stored in the cloud.'));
        return { status: row ? 'equivalent' : 'no-trace', merged: null, row };
      }

      if (resolution.action === CLOUD_SAVE_CONFLICT_ACTIONS.UPLOAD_LOCAL) {
        const createdRow = await createCloudSave(session, localPayload);
        cloudUpdatedAtRef.current = createdRow.updated_at;
        skipNextCloudSaveRef.current = true;
        setCloudSyncState('ready');
        setCloudStatus(lang === 'fr' ? 'Trace locale gravee dans une nouvelle archive cloud.' : 'Local Trace stored in a new cloud archive.');
        return { status: 'uploaded-local', merged: null, row: createdRow };
      }

      if (resolution.action === CLOUD_SAVE_CONFLICT_ACTIONS.LOAD_CLOUD) {
        cloudUpdatedAtRef.current = row.updated_at;
        skipNextCloudSaveRef.current = true;
        const merged = applySave(cloudPayload, { existing: true, navigateTo: null });
        setCloudSyncState('ready');
        setCloudStatus(lang === 'fr' ? 'Archive cloud chargee; Trace locale restauree.' : 'Cloud archive loaded; local Trace restored.');
        return { status: 'loaded-cloud', merged, row };
      }

      setCloudSyncState('conflict');
      const acceptCloud = window.confirm(lang === 'fr'
        ? `Deux Traces differentes existent. Charger l archive cloud du ${new Date(row.updated_at).toLocaleString('fr-FR')} ?\n\nOK : charger le cloud.\nAnnuler : garder les deux Traces intactes et suspendre la synchronisation.`
        : `Two different Traces exist. Load the cloud archive from ${new Date(row.updated_at).toLocaleString('en-GB')}?\n\nOK: load cloud.\nCancel: keep both Traces intact and suspend sync.`);
      if (!acceptCloud) {
        setCloudStatus(lang === 'fr'
          ? 'Conflit conserve. Trace locale active, archive cloud intacte, envois suspendus.'
          : 'Conflict preserved. Local Trace active, cloud archive intact, uploads suspended.');
        return { status: 'conflict-preserved', merged: null, row };
      }

      cloudUpdatedAtRef.current = row.updated_at;
      skipNextCloudSaveRef.current = true;
      const merged = applySave(cloudPayload, { existing: true, navigateTo: null, acceptExternalChange: true });
      setCloudSyncState('ready');
      setCloudStatus(lang === 'fr' ? 'Choix confirme: archive cloud chargee.' : 'Choice confirmed: cloud archive loaded.');
      return { status: 'loaded-cloud', merged, row };
    } catch (err) {
      setCloudSyncState(err instanceof CloudSaveConflictError ? 'conflict' : 'suspended');
      setCloudStatus(`${lang === 'fr' ? 'Reconciliation cloud suspendue' : 'Cloud reconciliation suspended'}: ${err.message}`);
      throw err;
    }
  };

  const applyCloudSession = async (session, shouldLoadCloud = true) => {
    window.clearTimeout(cloudSaveTimerRef.current);
    storeSession(session);
    setAccount(session);
    setCloudSyncState(shouldLoadCloud ? 'reconciling' : 'unreconciled');
    setCloudStatus(lang === 'fr' ? 'Signature ancree. Verification de l archive Nexus...' : 'Signature anchored. Checking Nexus archive...');

    if (!shouldLoadCloud) return { status: 'unreconciled', merged: null, row: null };
    return reconcileCloudSave(session);
  };

  const handleSignIn = async (email, password) => {
    const session = await signInAccount(email, password);
    const reconciliation = await applyCloudSession(session, true);
    if (currentScreen === 'profile') {
      const effectiveOnboarding = reconciliation.merged?.onboarding || onboarding;
      if (reconciliation.status === 'no-trace') {
        const payload = startOperation();
        const row = reconciliation.row
          ? await updateCloudSave(session, payload, reconciliation.row.updated_at)
          : await createCloudSave(session, payload);
        cloudUpdatedAtRef.current = row.updated_at;
        skipNextCloudSaveRef.current = true;
        setCloudSyncState('ready');
      } else {
        setCurrentScreen(getTraceContinuationScreen(effectiveOnboarding));
      }
    }
    sound.playSfx('levelup');
    return session;
  };

  const handleSignUp = async (email, password) => {
    const session = await signUpAccount(email, password);
    if (!session?.access_token) {
      setCloudStatus(lang === 'fr' ? 'Signature creee. Confirme ton email puis ancre-la.' : 'Signature created. Confirm your email, then anchor it.');
      if (currentScreen === 'profile') startOperation();
      sound.playSfx('levelup');
      return session;
    }
    await applyCloudSession(session, false);
    const payload = currentScreen === 'profile' ? startOperation() : getCurrentSave();
    const row = await createCloudSave(session, payload);
    cloudUpdatedAtRef.current = row.updated_at;
    skipNextCloudSaveRef.current = true;
    setCloudSyncState('ready');
    setCloudStatus(lang === 'fr' ? 'Signature creee et trace gravee dans le Nexus.' : 'Signature created and trace engraved into the Nexus.');
    sound.playSfx('levelup');
    return session;
  };

  const handleSignOut = async () => {
    const current = account;
    storeSession(null);
    setAccount(null);
    setCloudSyncState('detached');
    cloudUpdatedAtRef.current = null;
    window.clearTimeout(cloudSaveTimerRef.current);
    setCloudStatus(lang === 'fr' ? 'Signature detachee. Trace locale active.' : 'Signature detached. Local trace active.');
    if (current?.access_token) {
      try {
        await signOutAccount(current);
      } catch {
        // Local sign-out should still complete if the remote token already expired.
      }
    }
    sound.playSfx('click');
  };

  const handleLoadCloud = async () => {
    if (!account) return;
    await reconcileCloudSave(account);
    sound.playSfx('coin');
  };

  const handleSaveCloud = async () => {
    if (!account) return;
    window.clearTimeout(cloudSaveTimerRef.current);
    setCloudSyncState('reconciling');
    try {
      const localPayload = getCurrentSave();
      const row = await loadCloudSave(account);
      if (!row) {
        const createdRow = await createCloudSave(account, localPayload);
        cloudUpdatedAtRef.current = createdRow.updated_at;
      } else {
        const equivalent = resolveCloudSaveConflict({
          localPayload,
          cloudPayload: row.payload,
          localHasTrace: hasMeaningfulTrace(localPayload),
          cloudHasTrace: hasMeaningfulTrace(row.payload)
        }).action === CLOUD_SAVE_CONFLICT_ACTIONS.NOOP;
        if (!equivalent) {
          const replaceCloud = window.confirm(lang === 'fr'
            ? `Remplacer explicitement l archive cloud du ${new Date(row.updated_at).toLocaleString('fr-FR')} par la Trace locale ?`
            : `Explicitly replace the cloud archive from ${new Date(row.updated_at).toLocaleString('en-GB')} with the local Trace?`);
          if (!replaceCloud) {
            setCloudSyncState('conflict');
            setCloudStatus(lang === 'fr' ? 'Envoi annule. Les deux Traces restent intactes.' : 'Upload cancelled. Both Traces remain intact.');
            return;
          }
        }
        const updatedRow = equivalent
          ? row
          : await updateCloudSave(account, localPayload, row.updated_at);
        cloudUpdatedAtRef.current = updatedRow.updated_at;
      }
      skipNextCloudSaveRef.current = true;
      setCloudSyncState('ready');
      setCloudStatus(lang === 'fr' ? 'Trace locale envoyee dans le cloud.' : 'Local Trace uploaded to cloud.');
      sound.playSfx('coin');
    } catch (err) {
      setCloudSyncState(err instanceof CloudSaveConflictError ? 'conflict' : 'suspended');
      setCloudStatus(`${lang === 'fr' ? 'Envoi cloud suspendu' : 'Cloud upload suspended'}: ${err.message}`);
      throw err;
    }
  };

  const startNewLocalTrace = () => {
    window.clearTimeout(cloudSaveTimerRef.current);
    window.localStorage.removeItem(SAVE_KEY);
    window.localStorage.removeItem(LEGACY_KART_CAREER_KEY);
    setCloudSyncState(account ? 'conflict' : 'detached');
    cloudUpdatedAtRef.current = null;
    applySave({ ...DEFAULT_SAVE, lang }, { existing: false, navigateTo: 'profile', acceptExternalChange: true });
    setCloudStatus(account
      ? (lang === 'fr' ? 'Nouvelle Trace locale. Archive cloud preservee, synchronisation suspendue.' : 'New local Trace. Cloud archive preserved, sync suspended.')
      : (lang === 'fr' ? 'Nouvelle Trace locale ouverte.' : 'New local Trace opened.'));
    sound.playSfx('click');
  };

  const continueTrace = async () => {
    let effectiveOnboarding = onboarding;
    if (account && cloudSyncState === 'unreconciled' && isOnline) {
      try {
        const reconciliation = await reconcileCloudSave(account);
        effectiveOnboarding = reconciliation.merged?.onboarding || onboarding;
      } catch {
        // A failed cloud check never blocks access to the preserved local Trace.
      }
    }
    setCurrentScreen(getTraceContinuationScreen(effectiveOnboarding));
    sound.playSfx('levelup');
  };

  const openTitleCollection = () => {
    setPortalMode('collection');
    setCurrentScreen('portal');
    sound.playSfx('click');
  };

  return (
    <>
      <AudioControl lang={lang} muted={audioSettings.muted} onToggleMute={toggleMute} />
      <NetworkStatusBadge lang={lang} isOnline={isOnline} />
      {localSaveIssue && <aside role="alert" style={{ position: 'fixed', zIndex: 50000, bottom: 16, left: 16, right: 16, padding: 16, background: '#3b1717', color: '#fff0df', border: '2px solid #ffb478' }}>
        <p>{localSaveIssue === 'save-conflict'
          ? (lang === 'fr' ? 'Une autre fenêtre a modifié la Trace. Sauvegarde automatique suspendue pour ne pas écraser sa progression. Exporte tes changements de cette fenêtre avant de recharger.' : 'Another window changed the Trace. Automatic saving is paused to preserve its progress. Export this window’s changes before reloading.')
          : (lang === 'fr' ? 'Sauvegarde locale impossible. Les achats de rotation sont bloqués. Exporte ta Trace avant de quitter ou de recharger.' : 'Local saving failed. Rotation purchases are blocked. Export your Trace before leaving or reloading.')}</p>
        <button type="button" className="btn-retro" onClick={exportSave}>{lang === 'fr' ? 'Exporter cette Trace' : 'Export this Trace'}</button>
        <button type="button" className="btn-retro" onClick={() => window.location.reload()}>{lang === 'fr' ? 'Recharger la sauvegarde conservée' : 'Reload preserved save'}</button>
      </aside>}
      {(currentScreen === 'hub' || (currentScreen === 'portal' && portalMode === 'store')) && (
        <AuthPanel
          lang={lang}
          account={account}
          cloudStatus={cloudStatus}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSignOut={handleSignOut}
          onLoadCloud={handleLoadCloud}
          onSaveCloud={handleSaveCloud}
          onToggleLanguage={toggleLanguage}
          onExportSave={exportSave}
          onImportSave={importSave}
          onResetSave={resetSave}
        />
      )}

      {/* Screen Router */}
      {['title', 'profile', 'prologue'].includes(currentScreen) && (
        <IntroSequence
          phase={currentScreen}
          lang={lang}
          playerProfile={playerProfile}
          setPlayerProfile={setPlayerProfile}
          onboarding={onboarding}
          account={account}
          cloudStatus={cloudStatus}
          progressSummary={{
            completedStages: completedStages.length,
            unlockedHeroes: unlockedHeroes.length,
            seasonLevel: Math.max(1, Math.floor((activityProgress.seasonXp || 0) / 250) + 1)
          }}
          onToggleLanguage={toggleLanguage}
          onContinue={continueTrace}
          onNewTrace={startNewLocalTrace}
          onOpenCollection={openTitleCollection}
          onBackToTitle={() => { setCurrentScreen('title'); sound.playSfx('click'); }}
          onStartLocal={startOperation}
          onReplayPrologue={replayPrologue}
          onPreviousPrologue={() => movePrologue(-1)}
          onNextPrologue={() => movePrologue(1)}
          onFinishPrologue={finishPrologue}
          onSkipPrologue={finishPrologue}
          authProps={{
            onSignIn: handleSignIn,
            onSignUp: handleSignUp,
            onSignOut: handleSignOut,
            onLoadCloud: handleLoadCloud,
            onSaveCloud: handleSaveCloud
          }}
          audioSettings={audioSettings}
          onChangeAudioSetting={changeAudioSetting}
          onToggleMute={toggleMute}
          titleRotation={titleRotation}
          attractStages={titleAttractStages}
          attractCards={titleAttractCards}
          eventVariant={titleEventVariant}
          eventOptions={titleEventOptions}
          activeEventId={activityProgress.activeSpecialEventId}
          onSelectEvent={selectTitleEventVariant}
          onLaunchEvent={launchTitleSpecialEvent}
        />
      )}

      {currentScreen === 'hub' && (
        <HubErrorBoundary lang={lang} onBack={() => setCurrentScreen('title')}>
          <Suspense fallback={<NexusLoadingScreen lang={lang} label={lang === 'fr' ? 'Ouverture du controle Nexus...' : 'Opening Nexus control...'} />}>
            <HubScreen
            lang={lang}
            initialTab={hubInitialTab}
            playerProfile={playerProfile}
            publicProfile={publicProfile}
            setPublicProfile={setPublicProfile}
            gold={gold}
            setGold={setGold}
            breachShards={breachShards}
            setBreachShards={setBreachShards}
            eventTokens={eventTokens}
            setEventTokens={setEventTokens}
            unlockedHeroes={unlockedHeroes}
            heroLevels={heroLevels}
            setHeroLevels={setHeroLevels}
            activeTeam={activeTeam}
            setActiveTeam={setActiveTeam}
            completedStages={completedStages}
            completedArcIds={completedArcIds}
            arcReplayUnlockedIds={arcReplayUnlockedIds}
            campaignProgress={ocCampaignState}
            inventory={inventory}
            setInventory={setInventory}
            equippedGear={equippedGear}
            setEquippedGear={setEquippedGear}
            equippedEventItems={equippedEventItems}
            setEquippedEventItems={setEquippedEventItems}
            heroTalents={heroTalents}
            setHeroTalents={setHeroTalents}
            heroSkins={heroSkins}
            setHeroSkins={setHeroSkins}
            hiddenUniverses={hiddenUniverses}
            setHiddenUniverses={setHiddenUniverses}
            disabledAssets={disabledAssets}
            setDisabledAssets={setDisabledAssets}
            activityProgress={activityProgress}
            setActivityProgress={setActivityProgress}
            portalCollection={portalCollection}
            setPortalCollection={setPortalCollection}
            onLaunchStage={handleLaunchStage}
            onReplayEnding={replayOcCampaignEnding}
            onGoToPortal={() => { sound.playSfx('click'); setPortalMode('store'); setCurrentScreen('portal'); }}
            />
          </Suspense>
        </HubErrorBoundary>
      )}

      {currentScreen === 'missionIntro' && activeStage && (
        <MissionNarrativeScreen
          lang={lang}
          stage={activeStage}
          onContinue={() => {
            sound.playSfx('special');
            setCurrentScreen('battle');
          }}
        />
      )}

      {currentScreen === 'battle' && activeStage && (
        <CombatErrorBoundary
          key={activeStage.id}
          lang={lang}
          onBack={() => {
            sound.stopBgm();
            setCurrentScreen('hub');
            setActiveStage(null);
          }}
        >
          <Suspense fallback={<NexusLoadingScreen lang={lang} label={lang === 'fr' ? 'Chargement du moteur de combat...' : 'Loading combat engine...'} />}>
            <GameCanvas
              lang={lang}
              playerProfile={playerProfile}
              activeTeam={activeTeam}
              stage={activeStage}
              heroLevels={heroLevels}
              equippedGear={equippedGear}
              equippedEventItems={equippedEventItems}
              heroTalents={heroTalents}
              heroSkins={heroSkins}
              completedStages={completedStages}
              reputationProgress={activityProgress.reputationProgress}
              collectionBonusCount={collectionBonusCount}
              hiddenUniverses={hiddenUniverses}
              disabledAssets={disabledAssets}
              hudTheme={resolveActiveHudTheme(portalCollection)}
              onBattleEnd={handleBattleEnd}
            />
          </Suspense>
        </CombatErrorBoundary>
      )}

      {currentScreen === 'missionOutro' && activeStage && (
        <MissionNarrativeScreen
          lang={lang}
          stage={activeStage}
          result={lastBattleResult}
          rewardSummary={lastBattleSummary}
          onContinue={closeMissionOutro}
        />
      )}

      {currentScreen === 'campaignEnding' && (
        <OcCampaignEndingScreen
          key={`oc-ending-${ocCampaignState?.endingId || 'unwritten'}`}
          lang={lang}
          playerProfile={playerProfile}
          previousEndingId={ocCampaignState?.endingId}
          endingHistory={ocCampaignState?.endingHistory}
          onComplete={completeOcCampaignEnding}
        />
      )}

      {currentScreen === 'portal' && (
        <Suspense fallback={<NexusLoadingScreen lang={lang} label={lang === 'fr' ? 'Ouverture du portail...' : 'Opening portal...'} />}>
          <PortalScreen
            lang={lang}
            gold={gold}
            onRerollRotation={rerollPortalRotation}
            onOpenAnchorProfile={() => { setHubInitialTab('anchorProfile'); setCurrentScreen('hub'); }}
            playerProfile={playerProfile}
            breachShards={breachShards}
            setBreachShards={setBreachShards}
            portalStats={portalStats}
            setPortalStats={setPortalStats}
            portalCollection={portalCollection}
            setPortalCollection={setPortalCollection}
            unlockedHeroes={unlockedHeroes}
            setUnlockedHeroes={setUnlockedHeroes}
            inventory={inventory}
            setInventory={setInventory}
            hiddenUniverses={hiddenUniverses}
            disabledAssets={disabledAssets}
            completedStages={completedStages}
            collectionOnly={portalMode === 'collection'}
            onBack={() => {
              sound.playSfx('click');
              setCurrentScreen(portalMode === 'collection' ? 'title' : 'hub');
            }}
          />
        </Suspense>
      )}
    </>
  );
}

App.normalizeSavePayload = normalizeSavePayload;

export default App;
