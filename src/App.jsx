import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import sound from './game/soundEngine';
import AudioControl from './components/AudioControl';
import AuthPanel from './components/AuthPanel';
import IntroSequence from './components/IntroSequence';
import { EQUIP_ITEMS_DB, EVENT_ITEMS_DB } from './game/heroes';
import { getOpenAiBackdropSrc } from './game/renderer';
import { getStoredSession, loadCloudSave, saveCloudSave, signInAccount, signOutAccount, signUpAccount, storeSession } from './game/cloudSave';
import { PLAYER_HERO_ID } from './game/playerHero';
import {
  DEFAULT_HIDDEN_UNIVERSES,
  buildOcDlcCampaignProgress,
  getEnabledOcDlcPackIds,
  isBaseGameUniverse,
  migrateHiddenUniversesForOcDlc
} from './game/dlcConfig';
import { TRIO_NARRATIVE_ARCS, UNIVERSE_NARRATIVE_ARCS } from './game/narrativeSystems';
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
const OC_CAMPAIGN_SKIN_ID = 'char_player_anchor_palimpsest';
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
  saveVersion: 8,
  lang: 'fr',
  gold: 200,
  breachShards: 150,
  eventTokens: 10,
  playerProfile: { name: 'Ancre' },
  unlockedHeroes: [PLAYER_HERO_ID],
  heroLevels: { [PLAYER_HERO_ID]: 1 },
  activeTeam: [PLAYER_HERO_ID],
  completedStages: [],
  enabledContentPacks: [],
  campaignProgress: buildOcDlcCampaignProgress([], {}),
  ocCampaignState: buildOcMainCampaignState([], {}),
  heroTalents: {},
  heroSkins: {},
  portalStats: { pulls: 0, duplicateStreak: 0, history: [] },
  portalCollection: {
    archives: [],
    hudThemes: [],
    karts: [],
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
      hazards: true
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
    tutorialCompanionsUnlocked: false
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
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw);
    return normalizeSavePayload(parsed, { existing: true });
  } catch {
    return DEFAULT_SAVE;
  }
};

const saveGame = (payload) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
};

const appendUnique = (items = [], additions = []) => {
  const next = [...items];
  additions.forEach(item => {
    if (!next.includes(item)) next.push(item);
  });
  return next;
};

const normalizeStoredCustomBattlePreset = (preset = {}) => {
  const uniqueIds = (value, limit) => (
    [...new Set(Array.isArray(value) ? value.filter(id => typeof id === 'string' && id.trim()) : [])]
      .slice(0, limit)
  );
  const optionalId = value => (typeof value === 'string' && value.trim() ? value : null);
  return {
    mode: ['RPG', 'Tactics', 'Smash', 'Fighter'].includes(preset.mode) ? preset.mode : 'RPG',
    opponentControl: ['cpu', 'p2'].includes(preset.opponentControl) ? preset.opponentControl : 'cpu',
    playerTeamIds: uniqueIds(preset.playerTeamIds, 3),
    opponentTeamIds: uniqueIds(preset.opponentTeamIds, 3),
    enemyIds: uniqueIds(preset.enemyIds, 6),
    stageArchiveId: optionalId(preset.stageArchiveId),
    battleMusicId: optionalId(preset.battleMusicId),
    stageMusicId: optionalId(preset.stageMusicId),
    fieldSuperId: optionalId(preset.fieldSuperId),
    difficulty: ['training', 'standard', 'expert'].includes(preset.difficulty) ? preset.difficulty : 'standard',
    items: preset.items !== false,
    hazards: preset.hazards !== false
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
  return {
    ...merged,
    saveVersion: 8,
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
    portalStats: { ...DEFAULT_SAVE.portalStats, ...(merged.portalStats || {}), history: (merged.portalStats?.history || []).slice(0, 30) },
    portalCollection: {
      archives,
      hudThemes,
      karts,
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
    activityProgress: { ...DEFAULT_SAVE.activityProgress, ...(merged.activityProgress || {}) },
    equippedGear: { ...DEFAULT_SAVE.equippedGear, ...(merged.equippedGear || {}) },
    equippedEventItems: { ...DEFAULT_SAVE.equippedEventItems, ...(merged.equippedEventItems || {}) }
  };
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

const getContactIntel = (stage, lang) => {
  const modifierName = stage?.modifier?.name?.[lang] || stage?.modifier?.id || (lang === 'fr' ? 'anomalie non classee' : 'unclassified anomaly');
  const source = stage?.sourceUniverses?.join(' / ') || stage?.universe || (lang === 'fr' ? 'Trame inconnue' : 'Unknown Thread');
  return lang === 'fr'
    ? `Donnees de contact: ${stage?.bossName || 'noyau hostile'} / ${source} / modificateur ${modifierName}. A.R.C.A. annonce une adaptation +5% HP sur la prochaine tentative.`
    : `Contact data: ${stage?.bossName || 'hostile core'} / ${source} / ${modifierName} modifier. A.R.C.A. grants +5% HP adaptation on the next attempt.`;
};

const getMissionNarrative = (stage, lang, isOutro, victory) => {
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
  const victory = result === 'victory';
  const backdrop = stage.stageArt || stage.image || getOpenAiBackdropSrc(stage.universe, stage.mode);
  const modifierName = stage.modifier?.name?.[lang] || stage.modifier?.id || (lang === 'fr' ? 'Anomalie inconnue' : 'Unknown anomaly');
  const modifierDesc = stage.modifier?.desc?.[lang] || '';
  const rarity = stage.lootRarity?.label || 'Common';
  const title = isOutro
    ? victory
      ? (lang === 'fr' ? 'BRECHE STABILISEE' : 'BREACH STABILIZED')
      : (lang === 'fr' ? 'REPLI D ANCRE' : 'ANCHOR RETREAT')
    : (lang === 'fr' ? 'SEQUENCE NARRATIVE' : 'NARRATIVE SEQUENCE');
  const modeLine = stage.mode === 'RPG'
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
  const introText = lang === 'fr'
    ? `${narrativeLine} ${preparedBrief || `Les archives du Nexus detectent ${stage.bossName}, lie au pattern "${modifierName}". ${modeLine} Objectif: verrouiller les coordonnees avant que le Sans-Auteur n efface la memoire de cette Trame.`}`
    : `${narrativeLine} ${preparedBrief || `Nexus archives detect ${stage.bossName}, tied to the "${modifierName}" pattern. ${modeLine} Objective: lock the coordinates before the Authorless erases this Thread memory.`}`;
  const outroText = victory
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
          {isOutro && rewardSummary && (
            <div className="narrative-intel" style={{ display: 'grid', gap: '6px' }}>
              <strong style={{ color: rewardSummary.result === 'victory' ? '#2ecc71' : '#ffeb3b' }}>
                {lang === 'fr' ? 'Transmission de stabilisation A.R.C.A.' : 'A.R.C.A. stabilization transmission'}
              </strong>
              <span>
                {lang === 'fr'
                  ? `Rapport de mission: ${stage.mode} / ${stage.universe} / cible ${stage.bossName}.`
                  : `Mission report: ${stage.mode} / ${stage.universe} / target ${stage.bossName}.`}
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
            <span>{stage.bossName}</span>
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
  const initialSave = loadSave();
  const cloudSaveTimerRef = useRef(null);
  const skipNextCloudSaveRef = useRef(false);
  const [lang, setLang] = useState(initialSave.lang); // FR default as requested, EN toggle
  const [currentScreen, setCurrentScreen] = useState('title');
  const [gold, setGold] = useState(initialSave.gold);
  const [breachShards, setBreachShards] = useState(initialSave.breachShards);
  const [eventTokens, setEventTokens] = useState(initialSave.eventTokens);
  const [playerProfile, setPlayerProfile] = useState(initialSave.playerProfile);
  const [unlockedHeroes, setUnlockedHeroes] = useState(initialSave.unlockedHeroes);
  const [heroLevels, setHeroLevels] = useState(initialSave.heroLevels);
  const [activeTeam, setActiveTeam] = useState(initialSave.activeTeam);
  const [completedStages, setCompletedStages] = useState(initialSave.completedStages);
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
  const [cloudStatus, setCloudStatus] = useState(() => (
    getStoredSession()
      ? 'Signature detectee. La trace locale reste active, cloud disponible.'
      : 'Trace locale active. Ancre une signature pour synchroniser.'
  ));
  const collectionBonusCount = inventory.filter(itemId => (
    itemId.startsWith('collection_reward_')
    || itemId.startsWith('arc_reward_')
    || itemId.startsWith('arc_')
    || itemId.startsWith('fusion_')
  )).length;

  const getCurrentSave = useCallback(() => ({
    saveVersion: 8,
    lang,
    gold,
    breachShards,
    eventTokens,
    playerProfile,
    unlockedHeroes,
    heroLevels,
    activeTeam,
    completedStages,
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
  }), [lang, gold, breachShards, eventTokens, playerProfile, unlockedHeroes, heroLevels, activeTeam, completedStages, campaignProgress, ocCampaignState, heroTalents, heroSkins, hiddenUniverses, disabledAssets, portalStats, portalCollection, publicProfile, onboarding, activityProgress, inventory, equippedGear, equippedEventItems]);

  useEffect(() => {
    const payload = getCurrentSave();
    saveGame(payload);

    if (!account?.access_token) return;
    if (skipNextCloudSaveRef.current) {
      skipNextCloudSaveRef.current = false;
      return;
    }

    window.clearTimeout(cloudSaveTimerRef.current);
    cloudSaveTimerRef.current = window.setTimeout(async () => {
      try {
        await saveCloudSave(account, payload);
        setCloudStatus(lang === 'fr' ? 'Trace Nexus synchronisee dans le cloud.' : 'Nexus trace synced to cloud.');
      } catch (err) {
        setCloudStatus(`${lang === 'fr' ? 'Synchronisation Nexus impossible' : 'Nexus sync failed'}: ${err.message}`);
      }
    }, 1200);

    return () => window.clearTimeout(cloudSaveTimerRef.current);
  }, [getCurrentSave, account, lang]);

  useEffect(() => {
    const { dayKey, weekKey } = getProgressKeys();
    setActivityProgress(prev => {
      if (prev.lastSeenDay === dayKey && prev.dayKey === dayKey && prev.weekKey === weekKey) return prev;
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
        lastSeenDay: dayKey
      };
    });
  }, []);

  // Play ambient music
  useEffect(() => {
    sound.init();
    if (['title', 'profile', 'prologue', 'hub'].includes(currentScreen)) {
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
    sound.playSfx('special');
    setActiveStage(stage);
    setLastBattleResult(null);
    setLastBattleSummary(null);
    setCurrentScreen('missionIntro');
  };

  const handleBattleEnd = (result, report = {}) => {
    const battleItemsUsed = report.battleItemsUsed || 0;
    const battleSummary = report.battleSummary || null;
    const firstClear = result === 'victory'
      && activeStage
      && !activeStage.isSurvival
      && !completedStages.includes(activeStage.id);
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
      return {
        id: `${activeStage.id}-${Date.now()}-${entryResult}`,
        at: new Date().toISOString(),
        stageId: activeStage.id,
        result: entryResult,
        universe: activeStage.universe,
        source,
        title,
        text: entryResult === 'victory'
          ? (lang === 'fr'
            ? `A.R.C.A. archive ${title}: ${activeStage.bossName} neutralise, coordonnee ${source} scellee, consequence inscrite dans la Trame Nexus.`
            : `A.R.C.A. archives ${title}: ${activeStage.bossName} neutralized, ${source} coordinate sealed, consequence written into the Nexus Thread.`)
          : (lang === 'fr'
            ? `Repli sur ${title}: ${activeStage.bossName} conserve le signal local, mais A.R.C.A. garde les donnees de contact pour la prochaine tentative.`
            : `Retreat on ${title}: ${activeStage.bossName} keeps the local signal, but A.R.C.A. stores contact data for the next attempt.`),
        ...extra
      };
    };

    if (result === 'victory' && activeStage) {
      // Award rewards
      const firstClearGold = firstClear ? 25 : 0;
      const firstClearShards = firstClear ? 10 : 0;
      const itemMasteryTokens = battleItemsUsed >= 3 ? 1 : 0;
      const seasonRewardBonus = Math.min(0.18, Math.floor((activityProgress.seasonXp || 0) / 500) * 0.02);
      const smashGradeBonus = activeStage.mode === 'Smash' && battleSummary?.mode === 'Smash'
        ? ({ S: 18, A: 12, B: 7, C: 3 }[battleSummary.grade] || 0)
        : 0;
      const tacticsGradeBonus = activeStage.mode === 'Tactics' && battleSummary?.mode === 'Tactics'
        ? ({ S: 16, A: 10, B: 6, C: 2 }[battleSummary.grade] || 0)
        : 0;
      summary.smashMasteryBonus = smashGradeBonus;
      summary.tacticsMasteryBonus = tacticsGradeBonus;
      summary.gold = Math.round(activeStage.goldPrize * (1 + seasonRewardBonus)) + firstClearGold;
      summary.shards = Math.round(activeStage.shardPrize * (1 + seasonRewardBonus)) + firstClearShards + smashGradeBonus + tacticsGradeBonus;
      summary.tokens = (activeStage.tokenPrize || 0) + itemMasteryTokens;
      setGold(prev => prev + summary.gold);
      setBreachShards(prev => prev + summary.shards);
      
      if (summary.tokens > 0) {
        setEventTokens(prev => prev + summary.tokens);
      }

      if (firstClear) {
        setCompletedStages(prev => [...prev, activeStage.id]);
        const ocMission = getOcCampaignMission(activeStage.id);
        if (ocMission) {
          const campaignStages = appendUnique(completedStages, [activeStage.id]);
          setOcCampaignState(prev => buildOcMainCampaignState(campaignStages, {
            ...prev,
            lastMissionId: activeStage.id
          }));
        }
      }

      if (activeStage.rewardItemId) {
        setInventory(prev => prev.includes(activeStage.rewardItemId) ? prev : [...prev, activeStage.rewardItemId]);
        summary.rewardItemName = activeStage.rewardItemName?.[lang] || activeStage.rewardItemName?.en || activeStage.rewardItemId;
      }

      if (activeStage.eventRewardId) {
        setInventory(prev => appendUnique(prev, [activeStage.eventRewardId]));
        const eventReward = Object.values(EVENT_ITEMS_DB).find(item => item.id === activeStage.eventRewardId);
        summary.eventRewardName = eventReward?.name?.[lang]
          || eventReward?.name?.fr
          || eventReward?.name?.en
          || activeStage.eventRewardId;
      }

      if (activeStage.rewardHeroId) {
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
        riftJournal: [
          createRiftJournalEntry('defeat', {
            contactIntel: summary.contactIntel,
            rewards: { gold: summary.gold, shards: summary.shards, tokens: 0 }
          }),
          ...(prev.riftJournal || [])
        ].slice(0, 12)
      }));
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

  const applySave = (save, { existing = true, navigateTo = 'hub' } = {}) => {
    const merged = normalizeSavePayload(save, { existing });
    setLang(merged.lang);
    setGold(merged.gold);
    setBreachShards(merged.breachShards);
    setEventTokens(merged.eventTokens);
    setPlayerProfile(merged.playerProfile || DEFAULT_SAVE.playerProfile);
    setUnlockedHeroes(merged.unlockedHeroes);
    setHeroLevels(merged.heroLevels);
    setActiveTeam(merged.activeTeam);
    setCompletedStages(merged.completedStages);
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
      applySave(JSON.parse(raw), { existing: true, navigateTo: 'hub' });
      sound.playSfx('levelup');
    } catch {
      window.alert(lang === 'fr' ? 'Trace Nexus invalide.' : 'Invalid Nexus trace.');
    }
  };

  const resetSave = () => {
    if (!window.confirm(lang === 'fr' ? 'Purger completement la trace Nexus ?' : 'Fully purge Nexus trace?')) return;
    window.localStorage.removeItem(SAVE_KEY);
    applySave(DEFAULT_SAVE, { existing: false, navigateTo: 'title' });
    sound.playSfx('click');
  };

  const applyCloudSession = async (session, shouldLoadCloud = true) => {
    storeSession(session);
    setAccount(session);
    setCloudStatus(lang === 'fr' ? 'Signature ancree. Verification de l archive Nexus...' : 'Signature anchored. Checking Nexus archive...');

    if (!shouldLoadCloud) return null;

    const row = await loadCloudSave(session);
    if (row?.payload) {
      skipNextCloudSaveRef.current = true;
      const merged = applySave(row.payload, { existing: true, navigateTo: null });
      setCloudStatus(lang === 'fr' ? 'Archive Nexus chargee.' : 'Nexus archive loaded.');
      return merged;
    } else {
      await saveCloudSave(session, getCurrentSave());
      setCloudStatus(lang === 'fr' ? 'Nouvelle archive Nexus gravee depuis cette trace.' : 'New Nexus archive engraved from this trace.');
      return null;
    }
  };

  const handleSignIn = async (email, password) => {
    const session = await signInAccount(email, password);
    const merged = await applyCloudSession(session, true);
    if (currentScreen === 'profile') {
      if (merged?.onboarding?.prologueCompleted) {
        setCurrentScreen('hub');
      } else if (merged?.onboarding?.profileCreated) {
        setCurrentScreen('prologue');
      } else if (merged) {
        setCurrentScreen('profile');
      } else {
        startOperation();
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
    await saveCloudSave(session, payload);
    setCloudStatus(lang === 'fr' ? 'Signature creee et trace gravee dans le Nexus.' : 'Signature created and trace engraved into the Nexus.');
    sound.playSfx('levelup');
    return session;
  };

  const handleSignOut = async () => {
    const current = account;
    storeSession(null);
    setAccount(null);
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
    const row = await loadCloudSave(account);
    if (!row?.payload) {
      setCloudStatus(lang === 'fr' ? 'Aucune archive Nexus trouvee.' : 'No Nexus archive found.');
      return;
    }
    skipNextCloudSaveRef.current = true;
    applySave(row.payload, { existing: true, navigateTo: null });
    setCloudStatus(lang === 'fr' ? 'Archive Nexus chargee.' : 'Nexus archive loaded.');
    sound.playSfx('coin');
  };

  const handleSaveCloud = async () => {
    if (!account) return;
    await saveCloudSave(account, getCurrentSave());
    setCloudStatus(lang === 'fr' ? 'Trace envoyee dans le cloud.' : 'Trace uploaded to cloud.');
    sound.playSfx('coin');
  };

  return (
    <>
      <AudioControl />
      {['hub', 'portal'].includes(currentScreen) && (
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
          onOpenProfile={() => { setCurrentScreen('profile'); sound.playSfx('click'); }}
          onContinue={() => { setCurrentScreen('hub'); sound.playSfx('levelup'); }}
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
        />
      )}

      {currentScreen === 'hub' && (
        <HubErrorBoundary lang={lang} onBack={() => setCurrentScreen('title')}>
          <Suspense fallback={<NexusLoadingScreen lang={lang} label={lang === 'fr' ? 'Ouverture du controle Nexus...' : 'Opening Nexus control...'} />}>
            <HubScreen
            lang={lang}
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
            onGoToPortal={() => { sound.playSfx('click'); setCurrentScreen('portal'); }}
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
              collectionBonusCount={collectionBonusCount}
              hiddenUniverses={hiddenUniverses}
              disabledAssets={disabledAssets}
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
            onBack={() => { sound.playSfx('click'); setCurrentScreen('hub'); }}
          />
        </Suspense>
      )}
    </>
  );
}

App.normalizeSavePayload = normalizeSavePayload;

export default App;
