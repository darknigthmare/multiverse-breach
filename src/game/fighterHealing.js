// Fighter adaptation of the existing source-authored Healing Wind contract.
// It heals the living three-member cell; it is not a new limit, revive or cleanse.
import { resolveSourceSignature, prepareSourceSignature } from './signatureSourceKits.js';
import { getCombatHealingAmount, applyCombatHealing } from './combatHealing.js';
const sourceId = actor => actor?.sourceId || actor?.id;
const universe = actor => actor?.sourceUniverse || actor?.universe;
const living = actor => !!actor && Number.isFinite(actor.currentHp) && actor.currentHp > 0
  && Number.isFinite(actor.maxHp) && actor.maxHp > 0 && actor.state !== 'dead'
  && actor.nonCombat !== true && actor.combatEnabled !== false && actor.combatEligible !== false && !actor.nonCombatTrial;

export function getFighterHealingDefinition(actor) {
  if (actor?.fighterAttacks?.super || actor?.special?.fighterProfile) return null;
  const d = resolveSourceSignature(actor);
  return d?.key === 'aerith_ff7' && d.effect === 'heal' && d.shape === 'group'
    && Number.isFinite(d.healRatio) && d.healRatio > 0 ? d : null;
}
export function prepareFighterHealing(actor) {
  return getFighterHealingDefinition(actor) ? prepareSourceSignature(actor) : null;
}

export function createFighterHealing(engine) {
  const lives = new WeakMap();
  let plans = new WeakMap();
  let disposed = false;
  const generation = actor => lives.get(actor) || 0;
  const team = caster => engine.getTeam(caster?.side)?.fighters || [];
  const candidates = caster => team(caster).filter(living);
  const recoverable = (target, d) => getCombatHealingAmount(target, target.maxHp * d.healRatio);
  const available = caster => {
    const d = getFighterHealingDefinition(caster);
    return !disposed && !!d && living(caster) && engine.getActive(caster.side) === caster
      && candidates(caster).some(target => recoverable(target, d) > 0);
  };
  const prepare = caster => {
    if (!available(caster)) return null;
    const d = getFighterHealingDefinition(caster);
    const token = Object.freeze({ key: d.key });
    plans.set(token, { caster, action: caster.special, definition: d, side: caster.side,
      sourceId: sourceId(caster), universe: universe(caster), generation: generation(caster),
      // Capture living recipients, not current HP: a valid recipient injured
      // during windup remains eligible; a newly revived replacement does not.
      targets: candidates(caster).map(target => ({ target, generation: generation(target),
        sourceId: sourceId(target), universe: universe(target) })) });
    return token;
  };
  const apply = token => {
    const plan = token && plans.get(token);
    if (!plan || disposed || engine.disposed || engine.paused || engine.finished || engine.countdown > 0) return [];
    plans.delete(token);
    const { caster, definition: d } = plan;
    if (caster.action?.healing !== token || caster.state !== 'attack'
      || !living(caster) || engine.getActive(plan.side) !== caster || caster.side !== plan.side
      || caster.special !== plan.action || generation(caster) !== plan.generation
      || sourceId(caster) !== plan.sourceId || universe(caster) !== plan.universe
      || getFighterHealingDefinition(caster) !== d || caster.special?.type !== 'heal'
      || caster.special.healRatio !== d.healRatio) return [];
    const results = [];
    for (const entry of plan.targets) {
      const target = entry.target;
      if (!living(target) || !team(caster).includes(target) || target.side !== plan.side
        || generation(target) !== entry.generation || sourceId(target) !== entry.sourceId
        || universe(target) !== entry.universe) continue;
      const amount = applyCombatHealing(target, target.maxHp * d.healRatio);
      if (amount > 0) results.push({ target, amount });
    }
    return results;
  };
  return { available, prepare, apply,
    onKnockout(actor) { if (actor && typeof actor === 'object') lives.set(actor, generation(actor) + 1); },
    dispose() { disposed = true; plans = new WeakMap(); } };
}
