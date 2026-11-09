// A committed native RPG action owns its skill and recipients' current lives.
// HP, combat buffs and positions remain live; this does not freeze a battlefield.
const PROFILE_FIELDS = Object.freeze([
  'effect', 'targetSide', 'shape', 'delivery', 'maxTargets', 'minTargets', 'range',
  'areaRadius', 'lineWidth', 'coneAngle', 'multiplier', 'duration',
  'buffMultiplier', 'healRatio', 'reviveRatio', 'guardReduce'
]);
const sideOf = (engine, actor) => engine.heroes.includes(actor) ? 'player'
  : engine.enemies.includes(actor) ? 'enemy' : null;
const sourceId = actor => actor.sourceHeroId || actor.sourceId || actor.id || actor.canonicalName || actor.name;
const universe = actor => actor.sourceUniverse || actor.universe;
const life = (engine, actor) => engine.actorLifetimes.get(actor) || 0;
const ticket = (engine, actor) => ({ actor, side: sideOf(engine, actor),
  sourceId: sourceId(actor), universe: universe(actor), life: life(engine, actor) });
const sameTicket = (engine, saved) => saved.side !== null
  && sideOf(engine, saved.actor) === saved.side
  && sourceId(saved.actor) === saved.sourceId && universe(saved.actor) === saved.universe
  && life(engine, saved.actor) === saved.life;

// Only source mechanics that can change a committed action are recorded here.
// Runtime counters, positions, presentation objects and callbacks stay live.
const SOURCE_FIELDS = Object.freeze([
  'sourceHeroId', 'universe', 'slot', 'kind', 'effect', 'targetSide', 'multiplier', 'duration', 'excludeSelf', 'nonlethal', 'controlKind',
  'controlDuration', 'controlTurns', 'tacticsTurns', 'effectDuration', 'authorization',
  'controlAuthorization', 'channelDuration', 'controlChannelDuration',
  'requiresExplicitTargetEligibility', 'invulnerabilityKind',
  'invulnerabilityDuration', 'shieldKind', 'shieldHits', 'counterKind',
  'counterWindowDuration', 'counterMultiplier', 'counterRange',
  'counterRequiresIncomingContact', 'postSequenceStunDuration',
  'sourceMediGunWave17', 'sourceUberWave17', 'sourceGoldenLuteWave17',
  'sourceOkarunAllOutWave17', 'maxAllOutUses', 'informationOnly', 'sourceSligRifle'
]);
const SEQUENCE_FIELDS = Object.freeze(['kind', 'hitCount', 'firstAt', 'lastAt', 'nativeRecoveryAfter']);
const scalar = value => value == null || ['string', 'number', 'boolean'].includes(typeof value) ? value : undefined;
const sourceValues = (profile, action) => {
  const layers = [profile, profile?.targeting, profile?.action, profile?.action?.targeting,
    profile?.sourceAbility, profile?.sourceAbility?.targeting, action, action?.targeting];
  // These source admissions use an exact selected action name as gameplay data.
  const namedSource = ['team_fortress_2_medic', 'beyond_good_evil_jade'].includes(profile?.sourceHeroId);
  return layers.flatMap(layer => {
    const sequence = layer?.hitSequence;
    const window = sequence?.releaseWindow;
    return [...SOURCE_FIELDS.map(key => scalar(layer?.[key])), namedSource ? scalar(layer?.name) : undefined,
      ...SEQUENCE_FIELDS.map(key => scalar(sequence?.[key])), scalar(window),
      scalar(window?.start), scalar(window?.end),
      scalar(layer?.animationDuration), scalar(layer?.hitAt)];
  });
};
export function captureSourceActionContract(profile, action) {
  const values = sourceValues(profile, action);
  return (current, currentAction) => {
    const next = sourceValues(current, currentAction);
    return values.every((value, index) => Object.is(value, next[index]));
  };
}

export function captureRpgActionCommitment(engine, context, targets) {
  const { actor, abilityType, side, profile } = context;
  const caster = ticket(engine, actor);
  const action = actor[abilityType];
  const cooldown = profile.action.cd;
  const sourceContractMatches = captureSourceActionContract(profile, action);
  const contract = PROFILE_FIELDS.map(key => profile[key]);
  const cleanses = Array.isArray(profile.cleanses) ? [...profile.cleanses] : profile.cleanses;
  const recipients = new Map(targets.map(target => [target, ticket(engine, target)]));
  const casterValid = () => {
    if (engine.disposed || engine.gameOver || !sameTicket(engine, caster)
      || !Number.isFinite(actor.currentHp) || actor.currentHp <= 0 || actor.state === 'dead'
      || actor[abilityType] !== action) return false;
    const current = engine.getActionContext(actor, abilityType, side).profile;
    if (!current || !sourceContractMatches(current, actor[abilityType]) || !Object.is(current.action.cd, cooldown)
      || !PROFILE_FIELDS.every((key, index) => Object.is(current[key], contract[index]))) return false;
    return Array.isArray(cleanses)
      ? Array.isArray(current.cleanses) && cleanses.length === current.cleanses.length
        && cleanses.every((value, index) => Object.is(value, current.cleanses[index]))
      : Object.is(cleanses, current.cleanses);
  };
  return {
    casterValid,
    accepts(target) {
      const saved = recipients.get(target);
      if (!saved || !sameTicket(engine, saved) || !Number.isFinite(target.currentHp)) return false;
      // Revival belongs to the confirmed death, not to a later KO after revival.
      return profile.effect === 'revive' ? target.currentHp <= 0
        : target.currentHp > 0 && target.state !== 'dead';
    }
  };
}
