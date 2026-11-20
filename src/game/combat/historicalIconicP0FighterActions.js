import { getBlackPearlSourceAmmunition } from '../canonBlackPearlSourceKits.js';
import { resolveCanonHeroAttackEffect } from '../canonHeroAttackEffects.js';
import { CANON_P0_SOURCE_KITS } from '../canonP0SourceKits.js';

const universes = Object.freeze({
  jack_sparrow_potc: 'Pirates of the Caribbean',
  lilo_pelekai: 'Lilo & Stitch',
  roger_rabbit: 'Roger Rabbit'
});

const getActorId = actor => actor?.sourceHeroId || actor?.sourceId || actor?.id;

function matchesSource(actor, id, source) {
  return !!source && actor.canonCombatPresentation === true && actor.universe === universes[id]
    && actor.incarnation === source.incarnation && (!actor.sourceUniverse || actor.sourceUniverse === actor.universe)
    && (!actor.sourceId || actor.sourceId === id) && actor.weaponType === source.weaponType
    && Array.isArray(actor.equipment) && source.equipment.every(prop => actor.equipment.includes(prop));
}

export function getHistoricalFighterReservedShot(actor) {
  const id = getActorId(actor);
  if (id !== 'jack_sparrow_potc') return null;
  const source = CANON_P0_SOURCE_KITS[id];
  if (!matchesSource(actor, id, source) || actor.secondary?.name !== source.secondary.name
    || actor.secondary?.type !== source.secondary.type || actor.secondary?.canonPresentation?.kind !== 'flintlock') return null;
  return getBlackPearlSourceAmmunition({ ...actor, sourceId: id }, 'secondary');
}

export function resolveHistoricalIconicP0FighterAction(actor, identity) {
  const slot = identity?.sourceAbility?.slot;
  if (!['simple', 'secondary'].includes(slot) || identity.effect !== 'damage'
    || identity.provenance?.identityAuthored) return null;
  const id = getActorId(actor);
  const source = Object.hasOwn(universes, id) ? CANON_P0_SOURCE_KITS[id] : null;
  if (!matchesSource(actor, id, source) || identity.sourceHeroId !== id || identity.universe !== actor.universe) return null;
  const action = source[slot];
  if (actor[slot]?.name !== action.name || actor[slot]?.type !== action.type
    || identity.sourceAbility.name !== action.name || identity.sourceAbility.type !== action.type) return null;

  const feedback = resolveCanonHeroAttackEffect({ ...actor, sourceId: id }, identity.sourceAbility);
  const expectedKind = action.type === 'flash' ? 'cameraFlash' : action.canonPresentation?.kind;
  if (!feedback || feedback.kind !== expectedKind) return null;
  const reservedShot = expectedKind === 'flintlock';
  if (reservedShot && !getHistoricalFighterReservedShot(actor)) return null;
  return {
    feedback,
    reservedShot,
    range: action.smashProfile.range,
    delivery: feedback.kind === 'cameraFlash' ? 'beam' : identity.delivery
  };
}
