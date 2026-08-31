import { OC_CAMPAIGN_ACTS, OC_CAMPAIGN_CHAPTERS, OC_CAMPAIGN_MISSIONS, OC_FINAL_MISSION_ID, getOcCampaignProgress } from './ocCampaign.js';

// UI projections consume the same canonical mission IDs as the campaign engine.
// Viewed transmissions, DLC victories and generic clear totals never advance an act.
export const getOcCampaignUiProgress = (completedStages = [], endingId = null) => {
  const progress = getOcCampaignProgress(completedStages, endingId);
  const completed = new Set(progress.completedMissionIds);
  const acts = OC_CAMPAIGN_ACTS.map(act => {
    const missions = OC_CAMPAIGN_MISSIONS.filter(mission => mission.actId === act.id);
    const firstIndex = OC_CAMPAIGN_MISSIONS.findIndex(mission => mission.id === missions[0]?.id);
    const unlocked = firstIndex >= 0 && OC_CAMPAIGN_MISSIONS.slice(0, firstIndex).every(mission => completed.has(mission.id));
    const completedCount = missions.filter(mission => completed.has(mission.id)).length;
    const missionsComplete = missions.length > 0 && completedCount === missions.length;
    const requiresEnding = missions.some(mission => mission.id === OC_FINAL_MISSION_ID);
    return {
      act, missions, unlocked, completedCount, totalCount: missions.length, missionsComplete,
      complete: unlocked && missionsComplete && (!requiresEnding || progress.complete),
      awaitingEnding: unlocked && missionsComplete && requiresEnding && !progress.complete
    };
  });
  const completedChapterCount = OC_CAMPAIGN_CHAPTERS.filter(chapter => {
    const missions = OC_CAMPAIGN_MISSIONS.filter(mission => mission.chapterId === chapter.id);
    return missions.length > 0 && missions.every(mission => completed.has(mission.id));
  }).length;
  return {
    progress,
    acts,
    completedChapterCount,
    totalChapterCount: OC_CAMPAIGN_CHAPTERS.length,
    conclusionStatus: progress.complete ? 'recorded' : progress.missionsComplete ? 'choice-required' : 'locked'
  };
};

export const getOcCampaignResumeTarget = ({ completedStages = [], endingId = null, stages = OC_CAMPAIGN_MISSIONS, isStageAvailable = () => true } = {}) => {
  const progress = getOcCampaignProgress(completedStages, endingId);
  const nextId = progress.nextMission?.id || (progress.missionsComplete ? OC_FINAL_MISSION_ID : null);
  const stage = stages.find(entry => String(entry?.id) === String(nextId)) || null;
  // Never skip a missing/disabled canonical operation to open a later one or DLC.
  if (!stage || !isStageAvailable(stage)) return { kind: 'blocked', stage: null, progress };
  return {
    kind: progress.nextMission ? 'mission' : progress.complete ? 'ending-replay' : 'ending-choice',
    stage,
    progress
  };
};
