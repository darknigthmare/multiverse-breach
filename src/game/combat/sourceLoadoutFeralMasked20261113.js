// The current GitHub Feral selects only its intact masked appearance, right
// wrist blades and left forearm shield. Lot 3's separate combistick version
// remains unchanged. These are physical game actions, not film choreography.
export const FERAL_MASKED_SOURCE_LOADOUT_KEY = 'prey-2022-feral-masked-wrist-shield-20261113';
const incarnation = 'Prey (2022) - masked Feral Predator, intact default appearance';
const referenceUrl = 'https://www.20thcenturystudios.com/movies/prey';
const equipment = ['Bone biomask', 'Right-wrist twin blades', 'Left-forearm folding shield'];
const defaults = Object.freeze({
  simple: Object.freeze({ name: 'Feral Predator Signature Strike', type: 'melee', dmg: 1 }),
  secondary: Object.freeze({ name: 'Feral Predator Breach Technique', type: 'signature', cd: 8, dmg: 2.2 }),
  defense: Object.freeze({ name: 'Feral Predator Guard', type: 'shield', dur: 2, reduce: 0.75 }),
  special: Object.freeze({ name: 'Feral Predator Origin Burst', type: 'origin_aoe', dmg: 4.5, color: '#6a5c44' })
});
const sameAction = (actual, expected) => actual && typeof actual === 'object' && !Array.isArray(actual)
  && Object.keys(actual).length === Object.keys(expected).length
  && Object.entries(expected).every(([key, value]) => Object.hasOwn(actual, key) && Object.is(actual[key], value));

const contact = (name, dmg, range, animationDuration, hitAt, extra = {}) => Object.freeze({
  name, type: 'melee', dmg, color: '#bbac7e', animationDuration, hitAt, ...extra,
  targeting: Object.freeze({ effect: 'damage', targetSide: 'enemy', delivery: 'melee', shape: 'single', range, maxTargets: 1 }),
  tactics: Object.freeze({ effect: 'damage', targetSide: 'enemy', delivery: 'melee', shape: 'single',
    range: 1, minRange: 1, maxTargets: 1, requiresLineOfSight: true, pierceUnits: false, pierceObstacles: false })
});
const loadout = Object.freeze({
  universe: 'Prey', sourceWork: incarnation, sourceUrl: referenceUrl,
  sourceReference: 'Selected Prey (2022) masked Feral loadout: anatomical right-wrist twin blades and left-forearm folding shield. Physical contact and self-guard only; no combistick, guided launcher or plasma weapon is granted. Player-controlled combat is a game adaptation, not a canon cooperative encounter. Durations, reach, damage and cooldown are local game tuning, not film measurements.',
  identityBasis: 'explicit-source-loadout-adaptation', sourceLoadoutKey: FERAL_MASKED_SOURCE_LOADOUT_KEY,
  source1to1Verified: false, canonicalVerified: false, networkVerified: false, gameplayAdaptation: true,
  simple: contact('Taille des lames du poignet droit', 1, 80, 0.36, 0.14),
  secondary: contact('Revers court des deux lames du Feral', 2.2, 90, 0.58, 0.24, { cd: 8 }),
  defense: Object.freeze({
    name: 'Garde du bouclier de l’avant-bras gauche', type: 'shield', dmg: 0, dur: 2, reduce: 0.75,
    color: '#bbac7e', animationDuration: 0.45, hitAt: 0.16,
    targeting: Object.freeze({ effect: 'guard', targetSide: 'self', delivery: 'support', shape: 'single',
      range: 1, maxTargets: 1, duration: 2, reduce: 0.75 }),
    tactics: Object.freeze({ effect: 'guard', targetSide: 'self', delivery: 'support', shape: 'single',
      range: 0, minRange: 0, maxTargets: 1 })
  }),
  special: contact('Assaut des lames du poignet droit', 4.5, 100, 0.9, 0.36, { meterCost: 100 })
});

/** Admit only the unchanged default actions attached to this exact source loadout. */
export function resolveMaskedFeralSourceLoadout(actor) {
  if (!actor || (actor.sourceHeroId || actor.sourceId || actor.id) !== 'feral_predator'
    || actor.universe !== 'Prey' || actor.sourceUniverse && actor.sourceUniverse !== 'Prey'
    || [actor.sourceHeroId, actor.sourceId].some(id => id && id !== 'feral_predator')
    || actor.incarnation !== incarnation || actor.sourceIncarnation && actor.sourceIncarnation !== incarnation
    || actor.continuityScope && actor.continuityScope !== incarnation
    || actor.referenceUrl !== referenceUrl || actor.canonStatus !== 'source-locked-gameplay-adaptation'
    || actor.weaponType !== 'slash'
    || !Array.isArray(actor.equipment) || actor.equipment.length !== equipment.length
    || equipment.some(item => actor.equipment.filter(value => value === item).length !== 1)
    || actor.sourceSignatureKey != null
    || ['rpgAttacks', 'tacticsAttacks', 'smashAttacks', 'fighterAttacks'].some(key => actor[key])
    || !Object.entries(defaults).every(([slot, action]) => sameAction(actor[slot], action))) return null;
  return loadout;
}

export const isMaskedFeralSourceLoadoutProfile = profile => profile?.sourceHeroId === 'feral_predator'
  && profile.universe === 'Prey' && profile.provenance?.kind === 'explicit-source-loadout-adaptation'
  && profile.provenance?.sourceLoadoutKey === FERAL_MASKED_SOURCE_LOADOUT_KEY;
