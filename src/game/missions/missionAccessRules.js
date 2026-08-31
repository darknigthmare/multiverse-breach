export const REQUIRED_TEAM_TYPES = Object.freeze({
  CHARACTER: 'character',
  EXACT: 'exact',
  UNIVERSE: 'universe',
  SOURCES: 'sources'
});

export const MISSION_ACCESS_REASON_CODES = Object.freeze({
  BASE_ACCESS_BLOCKED: 'baseAccessBlocked',
  ACTIVE_HERO_REQUIRED: 'activeHeroRequired',
  HERO_RESERVED_FOR_MISSION: 'heroReservedForMission',
  EXACT_TEAM_INCOMPLETE: 'exactTeamIncomplete',
  EXACT_TEAM_FOREIGN: 'exactTeamForeign',
  EXACT_TEAM_INVALID: 'exactTeamInvalid',
  TEAM_SIZE_EXCEEDED: 'teamSizeExceeded',
  UNIVERSE_COUNT_REQUIRED: 'universeCountRequired',
  UNIVERSE_FOREIGN_HERO: 'universeForeignHero',
  UNIVERSE_ROSTER_UNAVAILABLE: 'universeRosterUnavailable',
  SOURCE_UNIVERSE_REQUIRED: 'sourceUniverseRequired',
  SOURCE_RULE_INVALID: 'sourceRuleInvalid'
});

const ANCHOR_HERO_ID = 'player_anchor';
const DEFAULT_MAX_TEAM_SIZE = 3;

const toId = value => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
};

const uniqueIds = values => {
  const seen = new Set();
  return (Array.isArray(values) ? values : [])
    .map(toId)
    .filter(value => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
};

const normalizedKey = value => String(value || '').trim().toLocaleLowerCase('en');

const sameUniverse = (left, right) => normalizedKey(left) === normalizedKey(right);

const getNestedArc = stage => (
  stage?.characterArc
  || stage?.trioArc
  || stage?.universeArc
  || stage?.fusionMission
  || (stage?.fusion && typeof stage.fusion === 'object' ? stage.fusion : null)
  || null
);

export const getMissionArcId = stage => {
  const arc = getNestedArc(stage);
  return toId(stage?.arcId || arc?.arcId || arc?.id);
};

const createHeroLookup = heroDb => {
  if (heroDb instanceof Map) {
    return new Map(
      [...heroDb.entries()]
        .map(([key, hero]) => [toId(hero?.id || key), hero])
        .filter(([id]) => id)
    );
  }

  const entries = Array.isArray(heroDb)
    ? heroDb
    : (heroDb && typeof heroDb === 'object' ? Object.values(heroDb) : []);

  return new Map(
    entries
      .map(hero => [toId(hero?.id), hero])
      .filter(([id]) => id)
  );
};

const getHeroName = (heroId, heroLookup, lang) => {
  const hero = heroLookup.get(heroId);
  const name = hero?.name;
  if (typeof name === 'string' && name.trim()) return name.trim();
  if (name && typeof name === 'object') {
    return name[lang] || name.en || name.fr || heroId;
  }
  return heroId;
};

const localizedList = (values, lang) => {
  if (values.length <= 1) return values[0] || '';
  const conjunction = lang === 'fr' ? ' et ' : ' and ';
  return `${values.slice(0, -1).join(', ')}${conjunction}${values.at(-1)}`;
};

const getRulePolicy = (rule, arcId) => ({
  firstClearOnly: rule?.firstClearOnly !== false,
  freeReplayAfterArc: rule?.freeReplayAfterArc !== false,
  ...(uniqueIds(rule?.excludedHeroIds).length
    ? { excludedHeroIds: uniqueIds(rule.excludedHeroIds) }
    : {}),
  ...(arcId ? { arcId } : {})
});

const normalizeRequiredTeam = (rule, fallbackArcId = '') => {
  if (!rule || typeof rule !== 'object') return null;

  const type = toId(rule.type);
  const arcId = toId(rule.arcId || fallbackArcId);
  const policy = getRulePolicy(rule, arcId);

  if (type === REQUIRED_TEAM_TYPES.CHARACTER) {
    const heroId = toId(rule.heroId);
    return heroId
      ? { type, heroId, allowAnchor: rule.allowAnchor === true, ...policy }
      : null;
  }

  if (type === REQUIRED_TEAM_TYPES.EXACT) {
    const heroIds = uniqueIds(rule.heroIds);
    return heroIds.length
      ? { type, heroIds, ...policy }
      : null;
  }

  if (type === REQUIRED_TEAM_TYPES.UNIVERSE) {
    const universe = toId(rule.universe);
    const minCount = Number(rule.minCount);
    return universe
      ? {
          type,
          universe,
          ...(Number.isInteger(minCount) && minCount > 0 ? { minCount } : {}),
          allowAnchor: rule.allowAnchor === true,
          ...policy
        }
      : null;
  }

  if (type === REQUIRED_TEAM_TYPES.SOURCES) {
    const sourceUniverses = uniqueIds(rule.sourceUniverses || rule.sources || rule.universes);
    return sourceUniverses.length
      ? {
          type,
          sourceUniverses,
          allowAnchor: rule.allowAnchor === true,
          ...policy
        }
      : null;
  }

  return null;
};

const getPlayableUniverseCount = (heroDb, universe) => {
  const lookup = createHeroLookup(heroDb);
  return [...lookup.values()].filter(hero => (
    hero?.playable !== false
    && toId(hero?.id) !== ANCHOR_HERO_ID
    && sameUniverse(hero?.universe, universe)
  )).length;
};

/**
 * Derives only facts already carried by the mission/arc metadata. It never
 * fabricates a hero or a source universe. An explicit requiredTeam wins.
 */
export const deriveRequiredTeam = (stage, { heroDb } = {}) => {
  if (!stage || typeof stage !== 'object') return null;

  const arcId = getMissionArcId(stage);
  const explicit = normalizeRequiredTeam(stage.requiredTeam, arcId);
  if (explicit) return explicit;

  if (stage.characterArc?.heroId) {
    return normalizeRequiredTeam({
      type: REQUIRED_TEAM_TYPES.CHARACTER,
      heroId: stage.characterArc.heroId,
      allowAnchor: stage.characterArc.allowAnchor === true,
      firstClearOnly: stage.characterArc.firstClearOnly,
      freeReplayAfterArc: stage.characterArc.freeReplayAfterArc
    }, arcId);
  }

  if (Array.isArray(stage.trioArc?.heroIds) && stage.trioArc.heroIds.length) {
    return normalizeRequiredTeam({
      type: REQUIRED_TEAM_TYPES.EXACT,
      heroIds: stage.trioArc.heroIds,
      firstClearOnly: stage.trioArc.firstClearOnly,
      freeReplayAfterArc: stage.trioArc.freeReplayAfterArc
    }, arcId);
  }

  const universeArcUniverses = uniqueIds(
    stage.universeArc?.universes
    || (stage.universeArc?.universe ? [stage.universeArc.universe] : [])
  );
  if (universeArcUniverses.length === 1) {
    const universe = universeArcUniverses[0];
    const explicitMinCount = Number(stage.universeArc?.minCount);
    const playableCount = getPlayableUniverseCount(heroDb, universe);
    return normalizeRequiredTeam({
      type: REQUIRED_TEAM_TYPES.UNIVERSE,
      universe,
      ...(Number.isInteger(explicitMinCount) && explicitMinCount > 0
        ? { minCount: explicitMinCount }
        : (playableCount > 0 ? { minCount: Math.min(DEFAULT_MAX_TEAM_SIZE, playableCount) } : {})),
      allowAnchor: stage.universeArc?.allowAnchor === true,
      firstClearOnly: stage.universeArc?.firstClearOnly,
      freeReplayAfterArc: stage.universeArc?.freeReplayAfterArc
    }, arcId);
  }
  if (universeArcUniverses.length > 1) {
    return normalizeRequiredTeam({
      type: REQUIRED_TEAM_TYPES.SOURCES,
      sourceUniverses: universeArcUniverses,
      allowAnchor: stage.universeArc?.allowAnchor === true,
      firstClearOnly: stage.universeArc?.firstClearOnly,
      freeReplayAfterArc: stage.universeArc?.freeReplayAfterArc
    }, arcId);
  }

  const fusion = stage.fusionMission
    || (stage.fusion && typeof stage.fusion === 'object' ? stage.fusion : null);
  const sourceUniverses = uniqueIds(
    stage.sourceUniverses
    || fusion?.sourceUniverses
    || fusion?.universes
  );
  if (sourceUniverses.length) {
    return normalizeRequiredTeam({
      type: REQUIRED_TEAM_TYPES.SOURCES,
      sourceUniverses,
      allowAnchor: fusion?.allowAnchor === true || stage.allowAnchor === true,
      firstClearOnly: fusion?.firstClearOnly,
      freeReplayAfterArc: fusion?.freeReplayAfterArc
    }, arcId);
  }

  return null;
};

const readContext = (context = {}, heroDbOverride) => {
  const source = context?.save && typeof context.save === 'object'
    ? { ...context.save, ...context }
    : context;
  const heroDb = heroDbOverride || source.heroDb || [];
  const heroLookup = createHeroLookup(heroDb);
  const activeTeam = uniqueIds(source.activeTeam);
  const ownershipValues = source.ownedHeroIds || source.unlockedHeroes;
  const hasOwnershipData = Array.isArray(ownershipValues) || ownershipValues instanceof Set;
  const ownedHeroIds = new Set(hasOwnershipData ? [...ownershipValues].map(toId).filter(Boolean) : heroLookup.keys());
  const eligibilityValues = source.eligibleHeroIds;
  const hasEligibilityData = Array.isArray(eligibilityValues) || eligibilityValues instanceof Set;
  const eligibleHeroIds = new Set(
    hasEligibilityData ? [...eligibilityValues].map(toId).filter(Boolean) : heroLookup.keys()
  );
  activeTeam.forEach(heroId => ownedHeroIds.add(heroId));

  return {
    ...source,
    heroDb,
    heroLookup,
    activeTeam,
    activeSet: new Set(activeTeam),
    ownedHeroIds,
    hasOwnershipData,
    eligibleHeroIds,
    hasEligibilityData,
    completedArcIds: new Set(uniqueIds([
      ...(source.completedArcIds || []),
      ...(source.arcReplayUnlockedIds || [])
    ])),
    maxTeamSize: Number.isInteger(source.maxTeamSize) && source.maxTeamSize > 0
      ? source.maxTeamSize
      : DEFAULT_MAX_TEAM_SIZE
  };
};

const heroIsAvailable = (heroId, environment) => (
  environment.activeSet.has(heroId)
  || environment.ownedHeroIds.has(heroId)
) && environment.eligibleHeroIds.has(heroId);

const getSortedAvailableHeroes = environment => (
  [...environment.heroLookup.values()]
    .filter(hero => hero?.playable !== false)
    .filter(hero => heroIsAvailable(toId(hero?.id), environment))
    .sort((left, right) => toId(left?.id).localeCompare(toId(right?.id), 'en'))
);

const missingActiveHero = (heroId, environment) => ({
  type: 'activeHero',
  heroId,
  owned: environment.ownedHeroIds.has(heroId),
  eligible: environment.eligibleHeroIds.has(heroId),
  status: !environment.ownedHeroIds.has(heroId)
    ? 'notOwned'
    : (environment.eligibleHeroIds.has(heroId) ? 'reserve' : 'ineligible')
});

const composeCharacterTeam = (rule, environment) => {
  const requiredAvailable = heroIsAvailable(rule.heroId, environment);
  let team = environment.activeTeam.slice(0, environment.maxTeamSize);
  if (!team.includes(rule.heroId) && requiredAvailable) {
    if (team.length < environment.maxTeamSize) {
      team.push(rule.heroId);
    } else {
      let replacementIndex = team.length - 1;
      if (rule.allowAnchor && team[replacementIndex] === ANCHOR_HERO_ID) {
        replacementIndex = team.findIndex(heroId => heroId !== ANCHOR_HERO_ID);
      }
      if (replacementIndex >= 0) team[replacementIndex] = rule.heroId;
    }
  }
  team = uniqueIds(team).slice(0, environment.maxTeamSize);
  return {
    composed: requiredAvailable && team.includes(rule.heroId),
    team,
    missing: requiredAvailable ? [] : [missingActiveHero(rule.heroId, environment)],
    preservedAnchor: rule.allowAnchor && environment.activeSet.has(ANCHOR_HERO_ID) && team.includes(ANCHOR_HERO_ID)
  };
};

const composeExactTeam = (rule, environment) => {
  const excludedHeroIds = new Set(rule.excludedHeroIds || []);
  const deployableHeroIds = rule.heroIds.filter(heroId => !excludedHeroIds.has(heroId));
  const missing = deployableHeroIds
    .filter(heroId => !heroIsAvailable(heroId, environment))
    .map(heroId => missingActiveHero(heroId, environment));
  missing.push(...rule.heroIds
    .filter(heroId => excludedHeroIds.has(heroId))
    .map(heroId => ({ type: 'reservedHero', heroId })));
  const validSize = deployableHeroIds.length === environment.maxTeamSize
    && deployableHeroIds.length === rule.heroIds.length;
  return {
    composed: validSize && missing.length === 0,
    team: deployableHeroIds.slice(0, environment.maxTeamSize),
    missing,
    preservedAnchor: deployableHeroIds.includes(ANCHOR_HERO_ID) && environment.activeSet.has(ANCHOR_HERO_ID)
  };
};

const composeUniverseTeam = (rule, environment) => {
  const roster = getSortedAvailableHeroes(environment)
    .filter(hero => toId(hero?.id) !== ANCHOR_HERO_ID && sameUniverse(hero?.universe, rule.universe));
  const catalogCount = [...environment.heroLookup.values()].filter(hero => (
    hero?.playable !== false
    && toId(hero?.id) !== ANCHOR_HERO_ID
    && sameUniverse(hero?.universe, rule.universe)
  )).length;
  const minCount = Number.isInteger(rule.minCount) && rule.minCount > 0
    ? rule.minCount
    : Math.min(environment.maxTeamSize, catalogCount);
  const preserveAnchor = rule.allowAnchor && environment.activeSet.has(ANCHOR_HERO_ID);
  const team = environment.activeTeam.filter(heroId => {
    const hero = environment.heroLookup.get(heroId);
    return (heroId === ANCHOR_HERO_ID && preserveAnchor)
      || (environment.eligibleHeroIds.has(heroId) && sameUniverse(hero?.universe, rule.universe));
  }).slice(0, environment.maxTeamSize);

  if (preserveAnchor && !team.includes(ANCHOR_HERO_ID) && team.length < environment.maxTeamSize) {
    team.unshift(ANCHOR_HERO_ID);
  }
  for (const hero of roster) {
    const heroId = toId(hero?.id);
    const signatureCount = team.filter(id => sameUniverse(environment.heroLookup.get(id)?.universe, rule.universe)).length;
    if (signatureCount >= minCount || team.length >= environment.maxTeamSize) break;
    if (!team.includes(heroId)) team.push(heroId);
  }

  const signatureCount = team.filter(heroId => sameUniverse(
    environment.heroLookup.get(heroId)?.universe,
    rule.universe
  )).length;
  return {
    composed: minCount > 0 && signatureCount >= minCount,
    team: uniqueIds(team).slice(0, environment.maxTeamSize),
    missing: signatureCount >= minCount
      ? []
      : [{
          type: 'universeCount',
          universe: rule.universe,
          required: minCount,
          current: signatureCount,
          missingCount: Math.max(0, minCount - signatureCount)
        }],
    preservedAnchor: preserveAnchor && team.includes(ANCHOR_HERO_ID)
  };
};

const composeSourcesTeam = (rule, environment) => {
  const availableHeroes = getSortedAvailableHeroes(environment);
  const preserveAnchor = rule.allowAnchor && environment.activeSet.has(ANCHOR_HERO_ID);
  const team = preserveAnchor ? [ANCHOR_HERO_ID] : [];
  const missing = [];

  for (const universe of rule.sourceUniverses) {
    const activeCandidate = environment.activeTeam.find(heroId => (
      !team.includes(heroId)
      && environment.eligibleHeroIds.has(heroId)
      && sameUniverse(environment.heroLookup.get(heroId)?.universe, universe)
    ));
    const rosterCandidate = availableHeroes.find(hero => (
      !team.includes(toId(hero?.id))
      && sameUniverse(hero?.universe, universe)
    ));
    const heroId = activeCandidate || toId(rosterCandidate?.id);
    if (!heroId || team.length >= environment.maxTeamSize) {
      missing.push({ type: 'sourceUniverse', universe });
      continue;
    }
    team.push(heroId);
  }

  for (const heroId of environment.activeTeam) {
    if (team.length >= environment.maxTeamSize) break;
    if (!team.includes(heroId)) team.push(heroId);
  }

  return {
    composed: missing.length === 0 && rule.sourceUniverses.length <= environment.maxTeamSize,
    team: uniqueIds(team).slice(0, environment.maxTeamSize),
    missing,
    preservedAnchor: preserveAnchor && team.includes(ANCHOR_HERO_ID)
  };
};

const composeRule = (rule, environment) => {
  // Reserved NPC identities cannot re-enter the suggested deployment, even
  // when they were already selected or remain owned in the player's roster.
  const reserved = new Set(rule?.excludedHeroIds || []);
  if (reserved.size) {
    environment = {
      ...environment,
      activeTeam: environment.activeTeam.filter(heroId => !reserved.has(heroId)),
      activeSet: new Set([...environment.activeSet].filter(heroId => !reserved.has(heroId))),
      eligibleHeroIds: new Set([...environment.eligibleHeroIds].filter(heroId => !reserved.has(heroId)))
    };
  }
  if (!rule) {
    return {
      composed: true,
      team: environment.activeTeam.slice(0, environment.maxTeamSize),
      missing: [],
      preservedAnchor: environment.activeSet.has(ANCHOR_HERO_ID)
    };
  }
  if (rule.type === REQUIRED_TEAM_TYPES.CHARACTER) return composeCharacterTeam(rule, environment);
  if (rule.type === REQUIRED_TEAM_TYPES.EXACT) return composeExactTeam(rule, environment);
  if (rule.type === REQUIRED_TEAM_TYPES.UNIVERSE) return composeUniverseTeam(rule, environment);
  if (rule.type === REQUIRED_TEAM_TYPES.SOURCES) return composeSourcesTeam(rule, environment);
  return { composed: false, team: [], missing: [], preservedAnchor: false };
};

/**
 * Produces the deterministic team shown by “Composer automatiquement”.
 */
export const autoComposeMissionTeam = (stageOrRule, context = {}, heroDbOverride) => {
  const environment = readContext(context, heroDbOverride);
  const rule = stageOrRule?.type
    ? normalizeRequiredTeam(stageOrRule, stageOrRule.arcId)
    : deriveRequiredTeam(stageOrRule, { heroDb: environment.heroDb });
  return composeRule(rule, environment);
};

const normalizeLocalizedMessage = message => {
  if (typeof message === 'string' && message.trim()) {
    return { fr: message.trim(), en: message.trim() };
  }
  if (message && typeof message === 'object') {
    const fr = toId(message.fr || message.en);
    const en = toId(message.en || message.fr);
    if (fr || en) return { fr: fr || en, en: en || fr };
  }
  return null;
};

const getBaseAccess = context => {
  const base = context.baseAccess;
  if (base === undefined || base === null) {
    return { allowed: true, reasons: [], missing: [], message: null };
  }
  if (typeof base === 'boolean') {
    return { allowed: base, reasons: [], missing: [], message: null };
  }
  const allowed = base.allowed ?? base.unlocked ?? true;
  const reasons = Array.isArray(base.reasons)
    ? base.reasons.slice()
    : (base.reason ? [{ code: base.reason, type: 'baseAccess' }] : []);
  return {
    allowed: allowed !== false,
    reasons,
    missing: Array.isArray(base.missing) ? base.missing.slice() : [],
    message: normalizeLocalizedMessage(base.message)
  };
};

const makeMessage = ({ allowed, replayFree, reasons, rule, environment }) => {
  if (allowed && replayFree) {
    return {
      fr: 'ARC TERMINÉ — ÉQUIPE LIBRE',
      en: 'ARC COMPLETE — FREE TEAM'
    };
  }
  if (allowed) {
    return rule
      ? { fr: 'Équipe canon prête.', en: 'Canonical team ready.' }
      : { fr: 'Mission disponible.', en: 'Mission available.' };
  }

  const reason = reasons[0] || {};
  if (reason.code === MISSION_ACCESS_REASON_CODES.HERO_RESERVED_FOR_MISSION) {
    return {
      fr: `${getHeroName(reason.heroId, environment.heroLookup, 'fr')} est la cible protégée de cette mission et ne peut pas être déployé dans la Cellule active.`,
      en: `${getHeroName(reason.heroId, environment.heroLookup, 'en')} is this mission’s protected target and cannot be deployed in the active Cell.`
    };
  }
  if (reason.code === MISSION_ACCESS_REASON_CODES.ACTIVE_HERO_REQUIRED) {
    return {
      fr: `${getHeroName(reason.heroId, environment.heroLookup, 'fr')} doit être dans la Cellule active.`,
      en: `${getHeroName(reason.heroId, environment.heroLookup, 'en')} must be in the active Cell.`
    };
  }
  if (reason.code === MISSION_ACCESS_REASON_CODES.EXACT_TEAM_INCOMPLETE) {
    const namesFr = reason.heroIds.map(heroId => getHeroName(heroId, environment.heroLookup, 'fr'));
    const namesEn = reason.heroIds.map(heroId => getHeroName(heroId, environment.heroLookup, 'en'));
    return {
      fr: `Trio incomplet : ${localizedList(namesFr, 'fr')} ${namesFr.length > 1 ? 'manquent' : 'manque'}.`,
      en: `Incomplete trio: ${localizedList(namesEn, 'en')} ${namesEn.length > 1 ? 'are' : 'is'} missing.`
    };
  }
  if (reason.code === MISSION_ACCESS_REASON_CODES.EXACT_TEAM_FOREIGN) {
    const namesFr = reason.heroIds.map(heroId => getHeroName(heroId, environment.heroLookup, 'fr'));
    const namesEn = reason.heroIds.map(heroId => getHeroName(heroId, environment.heroLookup, 'en'));
    return {
      fr: `Ce trio exige exactement ses trois signatures ; retire ${localizedList(namesFr, 'fr')}.`,
      en: `This trio requires exactly its three signatures; remove ${localizedList(namesEn, 'en')}.`
    };
  }
  if (reason.code === MISSION_ACCESS_REASON_CODES.UNIVERSE_COUNT_REQUIRED) {
    return {
      fr: `Cette mission demande ${reason.required} signatures ${reason.universe} ; équipe actuelle : ${reason.current}/${reason.required}.`,
      en: `This mission requires ${reason.required} ${reason.universe} signatures; current team: ${reason.current}/${reason.required}.`
    };
  }
  if (reason.code === MISSION_ACCESS_REASON_CODES.UNIVERSE_FOREIGN_HERO) {
    const namesFr = reason.heroIds.map(heroId => getHeroName(heroId, environment.heroLookup, 'fr'));
    const namesEn = reason.heroIds.map(heroId => getHeroName(heroId, environment.heroLookup, 'en'));
    return {
      fr: `Équipe non canon : retire ${localizedList(namesFr, 'fr')} de cette mission ${rule?.universe || ''}.`.trim(),
      en: `Non-canonical team: remove ${localizedList(namesEn, 'en')} from this ${rule?.universe || ''} mission.`.trim()
    };
  }
  if (reason.code === MISSION_ACCESS_REASON_CODES.SOURCE_UNIVERSE_REQUIRED) {
    return {
      fr: `Composition incomplète : une signature de ${localizedList(reason.universes, 'fr')} est requise.`,
      en: `Incomplete composition: one signature from ${localizedList(reason.universes, 'en')} is required.`
    };
  }
  if (reason.code === MISSION_ACCESS_REASON_CODES.TEAM_SIZE_EXCEEDED) {
    return {
      fr: `La Cellule active est limitée à ${reason.maximum} signatures.`,
      en: `The active Cell is limited to ${reason.maximum} signatures.`
    };
  }
  if (
    reason.code === MISSION_ACCESS_REASON_CODES.EXACT_TEAM_INVALID
    || reason.code === MISSION_ACCESS_REASON_CODES.SOURCE_RULE_INVALID
    || reason.code === MISSION_ACCESS_REASON_CODES.UNIVERSE_ROSTER_UNAVAILABLE
  ) {
    return {
      fr: 'La composition canon ne peut pas être déterminée avec les données disponibles.',
      en: 'The canonical composition cannot be determined from the available data.'
    };
  }
  return {
    fr: 'Conditions de possession, niveau ou progression non remplies.',
    en: 'Ownership, level, or progression requirements are not met.'
  };
};

const makeResult = ({
  allowed,
  replayFree = false,
  rule,
  arcId,
  reasons = [],
  missing = [],
  composition,
  environment,
  message
}) => ({
  allowed,
  unlocked: allowed,
  replayFree,
  arcReplayUnlocked: replayFree,
  canonicalTeamRequired: Boolean(rule) && !replayFree,
  arcId: arcId || null,
  requiredTeam: rule,
  reasons,
  missing,
  suggestedTeam: composition?.team || [],
  canAutoCompose: composition?.composed === true,
  message: message || makeMessage({ allowed, replayFree, reasons, rule, environment })
});

/**
 * Evaluates only deployment composition. Ownership, hero level and clear-count
 * checks remain owned by the caller and enter through context.baseAccess.
 */
export const evaluateMissionAccess = (stage, context = {}, heroDbOverride) => {
  const environment = readContext(context, heroDbOverride);
  const rule = deriveRequiredTeam(stage, { heroDb: environment.heroDb });
  const arcId = toId(rule?.arcId || getMissionArcId(stage));
  const composition = composeRule(rule, environment);
  const baseAccess = getBaseAccess(environment);

  if (!baseAccess.allowed) {
    const reasons = baseAccess.reasons.length
      ? baseAccess.reasons
      : [{ code: MISSION_ACCESS_REASON_CODES.BASE_ACCESS_BLOCKED, type: 'baseAccess' }];
    return makeResult({
      allowed: false,
      rule,
      arcId,
      reasons,
      missing: baseAccess.missing,
      composition,
      environment,
      message: baseAccess.message
    });
  }

  // Replay relaxes companion composition, never the identity of an NPC.
  const reservedHeroId = rule?.excludedHeroIds?.find(heroId => environment.activeSet.has(heroId));
  if (reservedHeroId) {
    return makeResult({
      allowed: false,
      rule,
      arcId,
      reasons: [{ code: MISSION_ACCESS_REASON_CODES.HERO_RESERVED_FOR_MISSION, type: 'reservedHero', heroId: reservedHeroId }],
      composition,
      environment
    });
  }

  const replayFree = Boolean(
    arcId
    && rule?.freeReplayAfterArc !== false
    && environment.completedArcIds.has(arcId)
  );
  if (replayFree) {
    return makeResult({
      allowed: true,
      replayFree: true,
      rule,
      arcId,
      composition,
      environment
    });
  }

  if (!rule) {
    return makeResult({ allowed: true, rule: null, arcId, composition, environment });
  }

  const reasons = [];
  const missing = [];
  if (environment.activeTeam.length > environment.maxTeamSize) {
    reasons.push({
      code: MISSION_ACCESS_REASON_CODES.TEAM_SIZE_EXCEEDED,
      type: 'teamSize',
      maximum: environment.maxTeamSize,
      current: environment.activeTeam.length
    });
  }

  if (rule.type === REQUIRED_TEAM_TYPES.CHARACTER) {
    if (!environment.activeSet.has(rule.heroId) || !environment.eligibleHeroIds.has(rule.heroId)) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.ACTIVE_HERO_REQUIRED,
        type: 'activeHero',
        heroId: rule.heroId
      });
      missing.push(missingActiveHero(rule.heroId, environment));
    }
  } else if (rule.type === REQUIRED_TEAM_TYPES.EXACT) {
    if (rule.heroIds.length !== environment.maxTeamSize) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.EXACT_TEAM_INVALID,
        type: 'configuration',
        requiredCount: rule.heroIds.length,
        maximum: environment.maxTeamSize
      });
    }
    const missingHeroIds = rule.heroIds.filter(heroId => (
      !environment.activeSet.has(heroId) || !environment.eligibleHeroIds.has(heroId)
    ));
    const foreignHeroIds = environment.activeTeam.filter(heroId => !rule.heroIds.includes(heroId));
    if (missingHeroIds.length) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.EXACT_TEAM_INCOMPLETE,
        type: 'activeHero',
        heroIds: missingHeroIds
      });
      missing.push(...missingHeroIds.map(heroId => missingActiveHero(heroId, environment)));
    }
    if (foreignHeroIds.length) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.EXACT_TEAM_FOREIGN,
        type: 'foreignHero',
        heroIds: foreignHeroIds
      });
    }
  } else if (rule.type === REQUIRED_TEAM_TYPES.UNIVERSE) {
    const rosterCount = [...environment.heroLookup.values()].filter(hero => (
      hero?.playable !== false
      && toId(hero?.id) !== ANCHOR_HERO_ID
      && sameUniverse(hero?.universe, rule.universe)
    )).length;
    const minCount = Number.isInteger(rule.minCount) && rule.minCount > 0
      ? rule.minCount
      : Math.min(environment.maxTeamSize, rosterCount);
    if (minCount <= 0) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.UNIVERSE_ROSTER_UNAVAILABLE,
        type: 'configuration',
        universe: rule.universe
      });
    }
    const signatureCount = environment.activeTeam.filter(heroId => sameUniverse(
      environment.heroLookup.get(heroId)?.universe,
      rule.universe
    ) && environment.eligibleHeroIds.has(heroId)).length;
    const foreignHeroIds = environment.activeTeam.filter(heroId => {
      if (rule.allowAnchor && heroId === ANCHOR_HERO_ID) return false;
      return !sameUniverse(environment.heroLookup.get(heroId)?.universe, rule.universe);
    });
    if (signatureCount < minCount) {
      const countMissing = {
        type: 'universeCount',
        universe: rule.universe,
        required: minCount,
        current: signatureCount,
        missingCount: Math.max(0, minCount - signatureCount)
      };
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.UNIVERSE_COUNT_REQUIRED,
        ...countMissing
      });
      missing.push(countMissing);
    }
    if (foreignHeroIds.length) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.UNIVERSE_FOREIGN_HERO,
        type: 'foreignHero',
        heroIds: foreignHeroIds,
        universe: rule.universe
      });
    }
  } else if (rule.type === REQUIRED_TEAM_TYPES.SOURCES) {
    if (rule.sourceUniverses.length > environment.maxTeamSize) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.SOURCE_RULE_INVALID,
        type: 'configuration',
        requiredCount: rule.sourceUniverses.length,
        maximum: environment.maxTeamSize
      });
    }
    const missingUniverses = rule.sourceUniverses.filter(universe => (
      !environment.activeTeam.some(heroId => sameUniverse(
        environment.heroLookup.get(heroId)?.universe,
        universe
      ) && environment.eligibleHeroIds.has(heroId))
    ));
    if (missingUniverses.length) {
      reasons.push({
        code: MISSION_ACCESS_REASON_CODES.SOURCE_UNIVERSE_REQUIRED,
        type: 'sourceUniverse',
        universes: missingUniverses
      });
      missing.push(...missingUniverses.map(universe => ({ type: 'sourceUniverse', universe })));
    }
  }

  return makeResult({
    allowed: reasons.length === 0,
    rule,
    arcId,
    reasons,
    missing,
    composition,
    environment
  });
};
