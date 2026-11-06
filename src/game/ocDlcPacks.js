import { THALASSA_PACK } from '../../DLC/ThalassaMnemique/data/ocDlcPacks.js';
import { MERIDIEN_PACK } from '../../DLC/MeridienCreux/data/ocDlcPacks.js';
import { VIRIDIENNE_PACK } from '../../DLC/ViridienneUltime/data/ocDlcPacks.js';
import { ORIGINAL_CONTENT_NOTICE } from './content/ocDlcFactories.js';

export const OC_DLC_PACKS = [
  THALASSA_PACK,
  MERIDIEN_PACK,
  VIRIDIENNE_PACK
];

function missionToStageMetadata(mission) {
  return {
    id: mission.id,
    stageId: mission.id,
    contentPackId: mission.contentPackId,
    ocDlc: true,
    dlcStage: true,
    contentOrigin: 'oc',
    standalone: true,
    campaignDependency: null,
    previousStageId: mission.previousStageId,
    mode: mission.mode,
    difficulty: mission.difficulty,
    tacticsBattlefieldId: mission.tacticsBattlefieldId,
    smashArenaId: mission.smashArenaId,
    name: mission.name.fr,
    displayName: mission.displayName,
    bossName: mission.bossName,
    bossNameLocalized: mission.bossNameLocalized,
    enemyRoster: mission.enemyRoster,
    enemyRosterExclusive: mission.enemyRosterExclusive,
    intro: mission.intro,
    scenes: mission.scenes,
    outro: mission.outro,
    storyBeat: mission.storyBeat,
    objective: mission.objective,
    stakes: mission.stakes,
    consequence: mission.consequence,
    reward: mission.reward,
    rewardItemId: mission.rewardItemId,
    rewardItemName: mission.rewardItemName,
    eventRewardId: mission.eventRewardId,
    goldPrize: mission.goldPrize,
    shardPrize: mission.shardPrize,
    tokenPrize: mission.tokenPrize
  };
}

export const OC_DLC_UNIVERSES = OC_DLC_PACKS.map(pack => {
  const [primaryMission, ...variantMissions] = pack.missions;
  const primaryStage = missionToStageMetadata(primaryMission);

  return {
    key: pack.universeKey,
    universe: pack.universe,
    mediaType: pack.mediaType,
    faction: pack.faction,
    contentPackId: pack.contentPackId,
    contentOrigin: 'oc',
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE,
    ocDlc: true,
    standalone: true,
    numberedAct: false,
    campaignDependency: null,
    requiredCampaignStageIds: [],
    actLabel: pack.actLabel,
    packTitle: pack.title,
    title: pack.title,
    desc: pack.desc,
    theme: pack.theme.en,
    themeLocalized: pack.theme,
    motif: pack.motif,
    colors: pack.colors,
    decor: pack.decor,
    hero: pack.heroes[0],
    allies: pack.heroes.slice(1),
    monsters: pack.monsters,
    bosses: pack.bosses,
    worldBoss: pack.worldBoss,
    gear: pack.gear,
    event: pack.event,
    missions: pack.missions,
    stageId: primaryMission.id,
    stageName: primaryStage.name,
    mode: primaryStage.mode,
    difficulty: primaryStage.difficulty,
    bossName: primaryStage.bossName,
    displayName: primaryStage.displayName,
    previousStageId: null,
    tacticsBattlefieldId: primaryStage.tacticsBattlefieldId,
    smashArenaId: primaryStage.smashArenaId,
    enemyRoster: primaryStage.enemyRoster,
    enemyRosterExclusive: primaryStage.enemyRosterExclusive,
    storyBeat: primaryStage.storyBeat,
    intro: primaryStage.intro,
    scenes: primaryStage.scenes,
    outro: primaryStage.outro,
    objective: primaryStage.objective,
    stakes: primaryStage.stakes,
    consequence: primaryStage.consequence,
    reward: primaryStage.reward,
    rewardItemId: primaryStage.rewardItemId,
    rewardItemName: primaryStage.rewardItemName,
    eventRewardId: primaryStage.eventRewardId,
    goldPrize: primaryStage.goldPrize,
    shardPrize: primaryStage.shardPrize,
    tokenPrize: primaryStage.tokenPrize,
    stageVariants: variantMissions.map(missionToStageMetadata)
  };
});

export const OC_DLC_UNIVERSE_KEYS = OC_DLC_PACKS.map(pack => pack.universe);
export const UNIVERSE_KEYS = OC_DLC_UNIVERSE_KEYS;
export const OC_DLC_PACK_IDS = OC_DLC_PACKS.map(pack => pack.id);
export const OC_DLC_STAGE_IDS = OC_DLC_PACKS.flatMap(pack => pack.missions.map(mission => mission.id));

export function getOcDlcPack(packId) {
  return OC_DLC_PACKS.find(pack => pack.id === packId) || null;
}

export function getOcDlcPackByUniverse(universe) {
  return OC_DLC_PACKS.find(pack => (
    pack.universe === universe || pack.universeKey === universe
  )) || null;
}

export function getOcDlcMission(stageOrId) {
  const rawId = typeof stageOrId === 'object' && stageOrId !== null
    ? stageOrId.id ?? stageOrId.stageId
    : stageOrId;
  const stageId = Number(rawId);
  if (!Number.isFinite(stageId)) return null;

  for (const pack of OC_DLC_PACKS) {
    const mission = pack.missions.find(entry => entry.id === stageId);
    if (mission) return mission;
  }
  return null;
}

export function isOcDlcStage(stageOrId) {
  return getOcDlcMission(stageOrId) !== null;
}

function getCompletedStageIds(completionState) {
  const source = completionState?.completedStages
    ?? completionState?.stageIds
    ?? completionState
    ?? [];

  if (source instanceof Set) {
    return new Set([...source].map(entry => Number(entry?.id ?? entry?.stageId ?? entry)));
  }

  if (Array.isArray(source)) {
    return new Set(source.map(entry => Number(entry?.id ?? entry?.stageId ?? entry)));
  }

  if (typeof source === 'object') {
    return new Set(
      Object.entries(source)
        .filter(([, completed]) => Boolean(completed))
        .map(([stageId]) => Number(stageId))
    );
  }

  return new Set();
}

export function isOcDlcMissionUnlocked(stageOrId, completionState = []) {
  const mission = getOcDlcMission(stageOrId);
  if (!mission) return false;
  if (mission.previousStageId === null) return true;

  return getCompletedStageIds(completionState).has(mission.previousStageId);
}
