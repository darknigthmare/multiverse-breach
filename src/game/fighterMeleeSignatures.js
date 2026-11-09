import { getFighterSupplementalDefinition } from './fighterSupplementalSignatures.js';
import { getFighterRangedDefinition } from './fighterRangedSignatures.js';
// Fighter contact scheduler: close combat plus explicitly listed direct-fire adaptations.
// No new roster/unlock or source choreography: one confirmed active opponent,
// native Fighter windup/recovery and damage budget, authored reach/contact count.
import { resolveSourceSignature, prepareSourceSignature } from './signatureSourceKits.js';

export const FIGHTER_MELEE_SIGNATURE_KEYS = Object.freeze([
  'cloud_ff7', 'tifa_ff7', 'squall_ff8',
  'naruto_uzumaki_young', 'sasuke_uchiha_young', 'naruto_six_paths', 'sasuke_rinnegan',
  'ahsoka_padawan', 'ahsoka_adult', 'ahsoka', 'aayla_secura', 'obi_wan', 'obiwan', 'yoda', 'darth_maul',
  'Star Wars::Tusken Sand Raider', 'Star Wars::Inquisitor Hunter',
  'Star Wars::Darth Maul Assassin', 'Star Wars::Darth Maul Phantom', 'Star Wars::Darth Vader Sith Lord',
  'Hexen::Ettin', 'Quake::Strogg Berserker',
  'Resident Evil::T-Virus Zombie', 'Resident Evil::Zombie Dog (Cerberus)',
  'Resident Evil::Ceiling-Clinging Licker', 'Resident Evil::Hunter Beta',
  'Resident Evil::Nemesis T-Type', 'Resident Evil::Mr. X T-00 Tyrant',
  'berserker_predator', 'Predator::Berserker Predator', 'Predators::Berserker Predator / Mr. Black',
  'Predators::Falconer Predator', 'fugitive_predator', 'The Predator::Fugitive Predator',
  'Predator::Feral Predator', 'arbiter', 'dog_hl2', 'Doom::Leaping Pinky Demon', 'Hexen::Centaur'
]);
const keys = new Set(FIGHTER_MELEE_SIGNATURE_KEYS);
const live = a => !!a && Number.isFinite(a.currentHp) && a.currentHp > 0 && a.state !== 'dead'
  && a.nonCombat !== true && a.combatEnabled !== false && a.combatEligible !== false && !a.nonCombatTrial;
const positioned = a => Number.isFinite(a?.x) && Number.isFinite(a?.y);
const identity = a => [a.sourceId || a.id, a.sourceUniverse || a.universe,
  a.canonicalName || a.name, a.incarnation, a.continuityScope];
const same = (a, b) => a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
const fields = a => [a?.name, a?.type, a?.dmg, a?.sourceSignatureKey];
const HIT_AT = 0.45;
const RECOVERY = 0.47;

export function getFighterContactDefinition(actor) {
  const ranged = getFighterRangedDefinition(actor) || getFighterSupplementalDefinition(actor);
  if (ranged) return ranged;
  if (actor?.fighterAttacks?.super || actor?.special?.fighterProfile) return null;
  const d = resolveSourceSignature(actor);
  return d && keys.has(d.key) && d.effect === 'damage' && d.delivery === 'melee'
    && d.kind === 'personal' && !d.projectile && !d.summonAgent
    && Number.isFinite(d.range) && d.range > 0
    && Number.isInteger(d.hits) && d.hits >= 1 && d.hits <= 32
    && Number.isFinite(d.hitGapTicks) && d.hitGapTicks > 0 ? d : null;
}
// Historical engine import retained; delivery is explicit on the returned definition.
export const getFighterMeleeDefinition = getFighterContactDefinition;
export function prepareFighterMelee(actor) {
  return getFighterMeleeDefinition(actor) ? prepareSourceSignature(actor) : null;
}

// Split the *full* native, defended damage budget, not its per-hit minimum.
// Distribute tenths deterministically so constant defences conserve the total.
export function splitFighterMeleeDamage(damage, contact) {
  if (!contact || !Number.isInteger(contact.total) || contact.total < 1 || contact.total > 32
    || !Number.isInteger(contact.index) || contact.index < 0 || contact.index >= contact.total) return damage;
  const tenths = Math.round(damage * 10);
  return (Math.round(tenths * (contact.index + 1) / contact.total)
    - Math.round(tenths * contact.index / contact.total)) / 10;
}

export function createFighterMeleeSignatures(engine) {
  let plans = new WeakMap();
  const lives = new WeakMap();
  let disposed = false;
  const generation = a => lives.get(a) || 0;
  const ticket = a => ({ actor: a, side: a.side, identity: identity(a), life: generation(a) });
  const valid = t => live(t.actor) && positioned(t.actor) && engine.isRosterFighter(t.actor)
    && engine.getActive(t.side) === t.actor && t.actor.side === t.side
    && same(identity(t.actor), t.identity) && generation(t.actor) === t.life;
  const locked = () => disposed || engine.disposed || engine.paused || engine.finished || engine.countdown > 0;
  const inRange = (a, b, d, facing = null) => positioned(a) && positioned(b)
    && Math.abs(b.x - a.x) <= d.range && Math.abs(b.x - a.x) >= (d.minRange || 0)
    && Math.abs(b.y - a.y) < 92
    && (facing === null || (b.x - a.x) * facing >= 0);
  const available = caster => {
    const d = getFighterMeleeDefinition(caster);
    const target = engine.getOpponent(caster?.side);
    return !locked() && engine.hitStop <= 0 && !!d && live(caster) && live(target)
      && engine.isRosterFighter(caster) && engine.isRosterFighter(target)
      && engine.getActive(caster.side) === caster && target.side !== caster.side
      && target.invulnerable <= 0 && inRange(caster, target, d);
  };
  const prepare = caster => {
    if (!available(caster)) return null;
    const d = getFighterMeleeDefinition(caster), target = engine.getOpponent(caster.side);
    const token = Object.freeze({ key: d.key, delivery: d.delivery });
    const gap = d.hitGapTicks / 60;
    const duration = HIT_AT + (d.hits - 1) * gap + RECOVERY;
    plans.set(token, { caster: ticket(caster), target: ticket(target), definition: d,
      skill: caster.special, fields: fields(caster.special), action: null, next: 0,
      facing: Math.sign(target.x - caster.x) || caster.facing, gap, duration });
    return { meleeSignature: token, range: d.range, hitAt: HIT_AT, duration };
  };
  const bind = (token, action) => {
    const p = plans.get(token);
    if (p && !p.action && action?.meleeSignature === token) p.action = action;
  };
  const advance = token => {
    const p = plans.get(token);
    if (!p || locked() || engine.hitStop > 0) return;
    const a = p.caster.actor, b = p.target.actor, action = p.action;
    if (!valid(p.caster) || !valid(p.target) || engine.getOpponent(p.caster.side) !== b
      || !action || a.action !== action || a.state !== 'attack' || action.meleeSignature !== token
      || a.special !== p.skill || !same(fields(a.special), p.fields)
      || getFighterMeleeDefinition(a) !== p.definition || action.facing !== p.facing
      || !Number.isFinite(action.elapsed) || action.elapsed < 0) {
      plans.delete(token);
      return;
    }
    while (p.next < p.definition.hits && action.elapsed + 1e-9 >= HIT_AT + p.next * p.gap) {
      const index = p.next++;
      // Never substitute a bench fighter or a new life between contacts.
      if (!valid(p.caster) || !valid(p.target)) { plans.delete(token); return; }
      if (inRange(a, b, p.definition, p.facing)) {
        const final = index === p.definition.hits - 1;
        engine.attemptHit(a, b, { ...action, base: 43, range: p.definition.range,
          guardDamage: 42 / p.definition.hits, knockback: final ? 330 : 0,
          meleeContact: Object.freeze({ index, total: p.definition.hits, final }), facing: p.facing });
      }
    }
    if (p.next === p.definition.hits) { action.resolved = true; plans.delete(token); }
  };
  const invalidate = actor => {
    if (actor && typeof actor === 'object') lives.set(actor, generation(actor) + 1);
  };
  return { available, prepare, bind, advance, onKnockout: invalidate, onDeparture: invalidate,
    dispose() { disposed = true; plans = new WeakMap(); } };
}
