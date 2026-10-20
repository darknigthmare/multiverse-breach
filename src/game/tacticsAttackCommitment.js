// Native tactical AI commits a skill and its recipients, not a frozen board.
// Live range/cover/buffs still apply; a replacement skill or life cannot inherit
// the windup. Human attacks remain immediate at their native confirmation point.
import { getTacticsSupportProfile } from './tacticsSupport.js';
import { getBlackPearlSourceAmmunition } from './canonBlackPearlSourceKits.js';

const PROFILE_FIELDS = Object.freeze([
  'actionType', 'delivery', 'shape', 'range', 'minRange', 'areaRadius', 'axes',
  'directions', 'pierceUnits', 'pierceObstacles', 'blocksOnUnits',
  'requiresLineOfSight', 'maxTargets', 'powerful'
]);
const ACTION_FIELDS = Object.freeze(['type', 'dmg', 'cd']);
const identity = unit => [unit.sourceId || unit.id || unit.canonicalName || unit.name,
  unit.sourceUniverse || unit.universe, unit.incarnation, unit.continuityScope];
const sameValues = (a, b) => a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
const kindOf = (engine, unit) => engine.heroes.includes(unit) ? 'hero'
  : engine.enemies.includes(unit) ? 'enemy' : engine.obstacles.includes(unit) ? 'obstacle'
    : engine.protectedArtifact === unit ? 'artifact' : engine.escortUnit === unit ? 'escort' : null;
const lifetime = (engine, unit) => engine.actorLifetimes.get(unit) || 0;
const save = (engine, unit) => ({ unit, kind: kindOf(engine, unit), identity: identity(unit), life: lifetime(engine, unit) });
const valid = (engine, record) => {
  if (!record || !record.kind || kindOf(engine, record.unit) !== record.kind
    || !sameValues(identity(record.unit), record.identity) || lifetime(engine, record.unit) !== record.life) return false;
  const hp = ['obstacle', 'artifact'].includes(record.kind) ? record.unit.hp : record.unit.currentHp;
  return Number.isFinite(hp) && hp > 0 && record.unit.state !== 'dead';
};

export function canUseTacticsAttack(engine, actor, actionType) {
  if (!['simple', 'secondary', 'special', 'enemy'].includes(actionType)
    || !engine.isActiveCombatant(actor) || engine.disposed || engine.paused || engine.gameOver
    || getTacticsSupportProfile(actor, actionType)) return false;
  const action = engine.getActionDefinition(actor, actionType);
  if (!action || typeof action !== 'object' || Array.isArray(action)
    || (action.dmg != null && (!Number.isFinite(action.dmg) || action.dmg < 0))) return false;
  const amount = engine.getActionBaseDamage(actor, actionType);
  if (!Number.isFinite(amount) || amount < 0
    || (actionType === 'enemy' && (!Number.isFinite(actor.atk) || actor.atk < 0))) return false;
  if (actionType === 'special' && (!Number.isFinite(actor.specialCharge) || actor.specialCharge < 100)) return false;
  if (actionType === 'secondary' && (!Number.isFinite(actor.cooldown) || actor.cooldown > 0
    || !Number.isFinite(action.cd ?? 3) || (action.cd ?? 3) < 0)) return false;
  const ammunition = getBlackPearlSourceAmmunition(actor, actionType);
  return !ammunition || (Number.isFinite(actor.sourceAmmoRemaining) && actor.sourceAmmoRemaining > 0);
}

export function captureTacticsAttackCommitment(engine, actor, actionType, entries, side) {
  const action = engine.getActionDefinition(actor, actionType);
  const caster = save(engine, actor);
  const profile = engine.getAttackProfile(actor, actionType);
  const values = PROFILE_FIELDS.map(key => profile[key]);
  const actionValues = ACTION_FIELDS.map(key => action?.[key]);
  const recipients = new Map(entries.map(({ unit }) => [unit, save(engine, unit)]));
  const canResolve = () => {
    if (caster.kind !== side || !valid(engine, caster) || !canUseTacticsAttack(engine, actor, actionType)
      || engine.getActionDefinition(actor, actionType) !== action
      || !sameValues(ACTION_FIELDS.map(key => action?.[key]), actionValues)) return false;
    const current = engine.getAttackProfile(actor, actionType);
    return sameValues(PROFILE_FIELDS.map(key => current[key]), values);
  };
  return {
    canResolve,
    accepts(unit) { return valid(engine, recipients.get(unit)); }
  };
}
