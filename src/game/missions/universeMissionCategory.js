// Standalone franchise battles need an entry in the mission menu alongside arcs.
// Visibility, team requirements and unlock checks remain with their existing owners.
export function isUniverseCombatMission(stage, { isMainCampaign = false } = {}) {
  return Boolean(stage && Number.isFinite(Number(stage.id)) && stage.universe
    && !isMainCampaign && !stage.baseGameStage && !stage.ocDlc
    && stage.campaignDependency !== 'originalCampaign'
    && !stage.tutorial && !stage.finalGameBoss && !stage.metaStage
    && !stage.universeArc && !stage.characterArc && !stage.trioArc && !stage.fusionMission
    && !stage.nonCombatTrial && !stage.nonCombat && !stage.nC);
}
