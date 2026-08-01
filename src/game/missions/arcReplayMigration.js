const ARC_KEYS = [
  'characterArc',
  'trioArc',
  'universeArc',
  'fusionMission',
  'fusion'
];

const COLLECTION_KEYS = [
  'arcs',
  'characterArcs',
  'trioArcs',
  'universeArcs',
  'fusionMissions',
  'fusions'
];

const toArcId = value => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
};

const isStageId = value => (
  (typeof value === 'number' && Number.isFinite(value))
  || (typeof value === 'string' && value.trim().length > 0)
);

const stageKey = value => isStageId(value) ? String(value).trim() : '';

const uniqueArcIds = values => {
  const seen = new Set();
  const result = [];
  for (const value of Array.isArray(values) ? values : []) {
    const id = toArcId(value);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
};

const uniqueStageIds = values => {
  const seen = new Set();
  const result = [];
  for (const value of Array.isArray(values) ? values : []) {
    const key = stageKey(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
};

const getNestedArc = definition => {
  for (const key of ARC_KEYS) {
    const value = definition?.[key];
    if (value && typeof value === 'object') return value;
  }
  return null;
};

const readStageId = stage => {
  if (isStageId(stage)) return stage;
  if (!stage || typeof stage !== 'object') return null;
  const value = stage.runtimeStageId
    ?? stage.finalStageId
    ?? stage.stageId
    ?? stage.missionId
    ?? stage.id;
  return isStageId(value) ? value : null;
};

const getDeclaredFinalStages = source => {
  if (!source || typeof source !== 'object') return [];

  const explicitMany = uniqueStageIds([
    ...(Array.isArray(source.finalStageIds) ? source.finalStageIds : []),
    ...(Array.isArray(source.bossStageIds) ? source.bossStageIds : [])
  ]);
  if (explicitMany.length) return explicitMany;

  const explicit = source.finalStageId
    ?? source.bossStageId
    ?? source.finalMissionId
    ?? readStageId(source.finalStage);
  if (isStageId(explicit)) return [explicit];

  const stages = Array.isArray(source.stages) ? source.stages : [];
  if (stages.length) {
    const markedFinal = stages.filter(stage => (
      stage
      && typeof stage === 'object'
      && (
        stage.final === true
        || stage.isFinal === true
        || stage.finalBoss === true
        || stage.bossStage === true
      )
    ));
    const selected = markedFinal.length ? markedFinal : [stages.at(-1)];
    return uniqueStageIds(selected.map(readStageId));
  }

  return [];
};

const looksLikeDefinition = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (getNestedArc(value)) return true;
  if (toArcId(value.arcId || value.id) && (
    isStageId(value.stageId)
    || isStageId(value.finalStageId)
    || isStageId(value.bossStageId)
    || Array.isArray(value.finalStageIds)
    || Array.isArray(value.stages)
  )) return true;
  return false;
};

/**
 * Accepts either one arc/stage, an array, or named arc collections. Collection
 * order is retained so migrations produce stable arrays.
 */
export const normalizeArcDefinitions = suppliedArcs => {
  if (!suppliedArcs) return [];
  if (Array.isArray(suppliedArcs)) {
    return suppliedArcs.flatMap(normalizeArcDefinitions);
  }
  if (looksLikeDefinition(suppliedArcs)) return [suppliedArcs];
  if (typeof suppliedArcs !== 'object') return [];

  const namedCollections = COLLECTION_KEYS
    .filter(key => Object.prototype.hasOwnProperty.call(suppliedArcs, key))
    .flatMap(key => normalizeArcDefinitions(suppliedArcs[key]));
  if (namedCollections.length) return namedCollections;

  return Object.values(suppliedArcs).flatMap(normalizeArcDefinitions);
};

/**
 * Returns only explicit final/boss IDs. It never derives a stage ID from the
 * arc position in a catalog.
 */
export const getArcReplayDescriptor = definition => {
  if (!definition || typeof definition !== 'object') return null;
  const nestedArc = getNestedArc(definition);
  const arc = nestedArc || definition;
  const arcId = toArcId(definition.arcId || arc.arcId || arc.id);
  if (!arcId) return null;

  let finalStageIds = getDeclaredFinalStages(definition);
  if (!finalStageIds.length) finalStageIds = getDeclaredFinalStages(arc);

  // A projected stage wraps its arc and carries the runtime stage ID itself.
  if (!finalStageIds.length && nestedArc) {
    const projectedStageId = readStageId(definition);
    if (isStageId(projectedStageId)) finalStageIds = [projectedStageId];
  }

  // Raw character/trio/fusion arcs use stageId as their single final stage.
  if (!finalStageIds.length && !nestedArc && isStageId(arc.stageId)) {
    finalStageIds = [arc.stageId];
  }

  finalStageIds = uniqueStageIds(finalStageIds);
  return finalStageIds.length ? { arcId, finalStageIds } : null;
};

export const deriveCompletedArcIds = (completedStages, suppliedArcs) => {
  const completedStageKeys = new Set(
    (Array.isArray(completedStages) ? completedStages : [])
      .map(stageKey)
      .filter(Boolean)
  );
  const result = [];
  const seen = new Set();

  for (const definition of normalizeArcDefinitions(suppliedArcs)) {
    const descriptor = getArcReplayDescriptor(definition);
    if (!descriptor || seen.has(descriptor.arcId)) continue;
    if (!descriptor.finalStageIds.some(id => completedStageKeys.has(stageKey(id)))) continue;
    seen.add(descriptor.arcId);
    result.push(descriptor.arcId);
  }
  return result;
};

/**
 * Adds replay metadata without touching rewards, inventory, or completedStages.
 * Applying it repeatedly with the same inputs returns equivalent data.
 */
export const migrateArcReplayState = (save = {}, suppliedArcs = []) => {
  const source = save && typeof save === 'object' ? save : {};
  const existingCompleted = uniqueArcIds(source.completedArcIds);
  const derivedCompleted = deriveCompletedArcIds(source.completedStages, suppliedArcs);
  const completedArcIds = uniqueArcIds([...existingCompleted, ...derivedCompleted]);
  const arcReplayUnlockedIds = uniqueArcIds([
    ...(Array.isArray(source.arcReplayUnlockedIds) ? source.arcReplayUnlockedIds : []),
    ...completedArcIds
  ]);

  return {
    ...source,
    completedArcIds,
    arcReplayUnlockedIds
  };
};

export const migrateArcReplayProgress = migrateArcReplayState;
