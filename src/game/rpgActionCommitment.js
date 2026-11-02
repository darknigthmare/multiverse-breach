// A committed native RPG action owns its skill and recipients' current lives.
// HP, combat buffs and positions remain live; this does not freeze a battlefield.
const PROFILE_FIELDS = Object.freeze([
  'effect', 'targetSide', 'shape', 'delivery', 'maxTargets', 'minTargets', 'range',
  'areaRadius', 'lineWidth', 'coneAngle', 'multiplier', 'duration',
  'buffMultiplier', 'healRatio', 'reviveRatio', 'guardReduce'
]);
const sideOf = (engine, actor) => engine.heroes.includes(actor) ? 'player'
  : engine.enemies.includes(actor) ? 'enemy' : null;
const sourceId = actor => actor.sourceId || actor.id || actor.canonicalName || actor.name;
const universe = actor => actor.sourceUniverse || actor.universe;
const life = (engine, actor) => engine.actorLifetimes.get(actor) || 0;
const ticket = (engine, actor) => ({ actor, side: sideOf(engine, actor),
  sourceId: sourceId(actor), universe: universe(actor), life: life(engine, actor) });
const sameTicket = (engine, saved) => saved.side !== null
  && sideOf(engine, saved.actor) === saved.side
  && sourceId(saved.actor) === saved.sourceId && universe(saved.actor) === saved.universe
  && life(engine, saved.actor) === saved.life;

export function captureRpgActionCommitment(engine, context, targets) {
  const { actor, abilityType, side, profile } = context;
  const caster = ticket(engine, actor);
  const action = actor[abilityType];
  const cooldown = profile.action.cd;
  const contract = PROFILE_FIELDS.map(key => profile[key]);
  const cleanses = Array.isArray(profile.cleanses) ? [...profile.cleanses] : profile.cleanses;
  const recipients = new Map(targets.map(target => [target, ticket(engine, target)]));
  const casterValid = () => {
    if (engine.disposed || engine.gameOver || !sameTicket(engine, caster)
      || !Number.isFinite(actor.currentHp) || actor.currentHp <= 0 || actor.state === 'dead'
      || actor[abilityType] !== action) return false;
    const current = engine.getActionContext(actor, abilityType, side).profile;
    if (!current || !Object.is(current.action.cd, cooldown)
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
