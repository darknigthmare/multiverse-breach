export const MISSION_TEAM_SIZE = 3;
export const UNIVERSE_ARC_FINAL_STAGE_BASE_ID = 40000;
// 46000-46999 is reserved for generated arc phases; 41001-41004 already
// belongs to authored trio arcs and 47001+ to standalone OC acts.
export const UNIVERSE_ARC_PHASE_STAGE_BASE_ID = 46000;

const uniqueStrings = values => {
  const seen = new Set();
  return (Array.isArray(values) ? values : [])
    .map(value => String(value || '').trim())
    .filter(value => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
};

/**
 * Builds balanced deployment windows that can all fit in the combat squad.
 * Four sources become 2+2, five become 3+2, and the original order is kept.
 */
export const partitionMissionSources = (sourceUniverses, maxTeamSize = MISSION_TEAM_SIZE) => {
  const sources = uniqueStrings(sourceUniverses);
  if (!sources.length) return [];
  if (!Number.isInteger(maxTeamSize) || maxTeamSize < 1) return [];

  const phaseCount = Math.ceil(sources.length / maxTeamSize);
  const baseSize = Math.floor(sources.length / phaseCount);
  const largerPhaseCount = sources.length % phaseCount;
  const phases = [];
  let cursor = 0;
  for (let phaseIndex = 0; phaseIndex < phaseCount; phaseIndex += 1) {
    const phaseSize = baseSize + (phaseIndex < largerPhaseCount ? 1 : 0);
    phases.push(sources.slice(cursor, cursor + phaseSize));
    cursor += phaseSize;
  }
  return phases;
};

const createRequiredTeam = (arc, sourceUniverses) => {
  const policy = {
    arcId: arc.id,
    firstClearOnly: arc.firstClearOnly !== false,
    freeReplayAfterArc: arc.freeReplayAfterArc !== false
  };
  if (sourceUniverses.length === 1) {
    return {
      type: 'universe',
      universe: sourceUniverses[0],
      allowAnchor: arc.allowAnchor === true,
      ...policy
    };
  }
  return {
    type: 'sources',
    sourceUniverses,
    allowAnchor: arc.allowAnchor === true,
    ...policy
  };
};

/**
 * Projects one lore arc into one or more playable deployment phases. The last
 * phase always retains the legacy 40000+index ID used by save migrations.
 */
export const projectUniverseArcDeploymentPhases = (
  arc,
  arcIndex,
  { maxTeamSize = MISSION_TEAM_SIZE } = {}
) => {
  if (!arc || typeof arc !== 'object' || !String(arc.id || '').trim()) return [];
  if (!Number.isInteger(arcIndex) || arcIndex < 0) return [];

  const allSourceUniverses = uniqueStrings(arc.universes);
  const sourcePhases = partitionMissionSources(allSourceUniverses, maxTeamSize);
  let previousArcStageId = null;

  return sourcePhases.map((sourceUniverses, phaseIndex) => {
    const isArcFinalPhase = phaseIndex === sourcePhases.length - 1;
    const runtimeStageId = isArcFinalPhase
      ? UNIVERSE_ARC_FINAL_STAGE_BASE_ID + arcIndex
      : UNIVERSE_ARC_PHASE_STAGE_BASE_ID + (arcIndex * 10) + phaseIndex;
    const universeArc = {
      ...arc,
      universes: sourceUniverses,
      allUniverses: allSourceUniverses
    };
    const phase = {
      runtimeStageId,
      arcId: arc.id,
      arcPhaseIndex: phaseIndex,
      arcPhaseCount: sourcePhases.length,
      isArcFinalPhase,
      previousArcStageId,
      sourceUniverses,
      allSourceUniverses,
      universeArc,
      requiredTeam: createRequiredTeam(arc, sourceUniverses)
    };
    previousArcStageId = runtimeStageId;
    return phase;
  });
};
