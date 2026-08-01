import { getMissionArcId } from './missionAccessRules.js';

export const isFreeMissionReplay = stage => (
  stage?.missionDeployment?.replayFree === true
);

export const isArcReplayProgressionBypassed = (
  stage,
  { completedArcIds = [], arcReplayUnlockedIds = [] } = {}
) => {
  const arcId = getMissionArcId(stage);
  if (!arcId) return false;
  const arc = stage?.characterArc
    || stage?.trioArc
    || stage?.universeArc
    || stage?.fusionMission
    || null;
  const freeReplayAfterArc = stage?.requiredTeam?.freeReplayAfterArc
    ?? arc?.freeReplayAfterArc
    ?? true;
  if (freeReplayAfterArc === false) return false;
  return [...completedArcIds, ...arcReplayUnlockedIds]
    .some(completedArcId => String(completedArcId) === arcId);
};

export const canLaunchPreparedMission = stage => (
  stage?.missionDeployment?.allowed !== false
);

export const getPreparedMissionLaunchScreen = stage => (
  isFreeMissionReplay(stage) ? 'battle' : 'missionIntro'
);

export const getPreparedMissionCompletionScreen = stage => (
  isFreeMissionReplay(stage) ? 'hub' : 'missionOutro'
);

export const shouldGrantFirstClearMissionReward = (firstClear, rewardId) => (
  firstClear === true && typeof rewardId === 'string' && rewardId.trim().length > 0
);

export const isFirstClearMissionVictory = (result, stage, completedStages = []) => (
  result === 'victory'
  && Boolean(stage)
  && stage.isSurvival !== true
  && stage.countsTowardCampaign !== false
  && !isFreeMissionReplay(stage)
  && !completedStages.some(stageId => String(stageId) === String(stage.id))
);
