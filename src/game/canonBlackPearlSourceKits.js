// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcPiratesOfTheCaribbean from '../../DLC/PiratesOfTheCaribbean/data/canonBlackPearlSourceKits.js';

// Playable incarnations from the 2003 film. These profiles replace generated
// class powers; damage, cooldowns and distances remain combat adaptations.
export const BLACK_PEARL_FILM_INCARNATION = 'Pirates of the Caribbean: The Curse of the Black Pearl (2003)';
export const BLACK_PEARL_JACK_INCARNATION = `${BLACK_PEARL_FILM_INCARNATION} - Captain Jack Sparrow`;
export const BLACK_PEARL_SOURCE_UNIVERSE = 'Pirates of the Caribbean';
export const BLACK_PEARL_SOURCE_REFERENCES = Object.freeze([
  'https://movies.disney.com/pirates-of-the-caribbean-the-curse-of-the-black-pearl',
  'https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/',
  'https://en.wikipedia.org/wiki/Pirates_of_the_Caribbean:_The_Curse_of_the_Black_Pearl'
]);

const ACTION_KEYS = ['simple', 'secondary', 'defense', 'special'];
const ADAPTATION = 'Physical source action translated into numerical game damage. Targeting distance, cooldown and choreography are combat adaptations.';
const contact = (name, dmg = 1, extra = {}) => ({
  name, type: 'melee', dmg,
  attackProfile: { shape: 'single', delivery: 'melee' },
  tacticsProfile: { range: 1, shape: 'single', maxTargets: 1 },
  smashProfile: { range: 70, verticalRange: 35, shape: 'single', maxTargets: 1, delivery: 'melee' },
  canonPresentation: { kind: 'melee' }, canonStatus: ADAPTATION, ...extra
});
const sidestep = name => ({ name, type: 'dodge', dur: 2, reduce: 0.75,
  canonStatus: 'Physical evasion translated into timed game damage reduction; no magical barrier.' });
const lock = details => ({
  ...details,
  canonCombatPresentation: true,
  referenceUrl: BLACK_PEARL_SOURCE_REFERENCES[0],
  referenceUrls: [...BLACK_PEARL_SOURCE_REFERENCES, ...(details.additionalReferences || [])],
  canonStatus: '2003 source identity and equipment locked; numerical combat and choreography are game adaptations, not visual fidelity approval.',
  sourceReviewStatus: 'reference-supported; exact scene choreography review pending',
  visualReviewStatus: 'pending',
  mechanicsReviewStatus: 'Source weapons replace class powers; numerical damage and reusable combat sequences remain adaptations.'
});

export const CANON_BLACK_PEARL_SOURCE_KITS = Object.freeze({
  jack_sparrow_potc: dlcPiratesOfTheCaribbean.createCanonBlackPearlSourceKits({ BLACK_PEARL_JACK_INCARNATION, contact, lock, sidestep }),
  will_turner_potc: dlcPiratesOfTheCaribbean.createCanonBlackPearlSourceKits2({ BLACK_PEARL_FILM_INCARNATION, contact, lock }),
  elizabeth_swann_potc: dlcPiratesOfTheCaribbean.createCanonBlackPearlSourceKits3({ BLACK_PEARL_FILM_INCARNATION, contact, lock, sidestep })
});

export const CANON_BLACK_PEARL_SOURCE_KIT_IDS = Object.freeze(Object.keys(CANON_BLACK_PEARL_SOURCE_KITS));

export function applyCanonBlackPearlSourceKit(hero) {
  const source = Object.hasOwn(CANON_BLACK_PEARL_SOURCE_KITS, hero?.id)
    && (!hero.universe || hero.universe === BLACK_PEARL_SOURCE_UNIVERSE)
    ? CANON_BLACK_PEARL_SOURCE_KITS[hero.id] : null;
  if (!source) return hero;
  const result = {
    ...hero, ...source,
    referenceUrls: [...source.referenceUrls], equipment: [...source.equipment],
    sourceAbilities: [...source.sourceAbilities], loreLocalized: { ...source.loreLocalized },
    ...(source.sourceProps ? { sourceProps: [...source.sourceProps] } : {}),
    ...(source.sourceAmmunition ? { sourceAmmunition: {
      ...source.sourceAmmunition, actionIds: [...source.sourceAmmunition.actionIds]
    } } : {})
  };
  for (const key of ACTION_KEYS) {
    const action = { ...hero[key], ...source[key] };
    // Existing saves and authored balance retain every numerical resource.
    for (const [number, value] of Object.entries(hero[key] || {})) {
      if (typeof value === 'number') action[number] = value;
    }
    for (const profile of ['attackProfile', 'tacticsProfile', 'smashProfile', 'canonPresentation']) {
      if (action[profile]) action[profile] = { ...action[profile] };
    }
    result[key] = action;
  }
  return result;
}

export function getBlackPearlSourceAmmunition(actor, actionType) {
  const sourceId = String(actor?.sourceId || actor?.id || '')
    .replace(/^(?:p2|cpu-custom):/, '').replace(/:\d+$/, '');
  if (sourceId !== 'jack_sparrow_potc'
    || actor?.incarnation !== BLACK_PEARL_JACK_INCARNATION
    || actor?.canonCombatPresentation !== true
    || actor.universe !== BLACK_PEARL_SOURCE_UNIVERSE) return null;
  const policy = CANON_BLACK_PEARL_SOURCE_KITS.jack_sparrow_potc.sourceAmmunition;
  if (actionType && !policy.actionIds.includes(actionType)) return null;
  return { ...policy, actionIds: [...policy.actionIds] };
}

export function getCanonBlackPearlSourcePlaque(hero) {
  const source = Object.hasOwn(CANON_BLACK_PEARL_SOURCE_KITS, hero?.id)
    && (!hero.universe || hero.universe === BLACK_PEARL_SOURCE_UNIVERSE)
    ? CANON_BLACK_PEARL_SOURCE_KITS[hero.id] : null;
  if (!source) return null;
  return {
    origin: { fr: source.incarnation, en: source.incarnation },
    dossier: { ...source.loreLocalized },
    doctrine: {
      fr: `${source.equipment.join(', ')}. Les valeurs et enchaînements sont adaptés au jeu ; revue visuelle en attente.${source.sourceAmmunition ? ' Un seul tir par bataille ; la réserve est rétablie uniquement à la création d’une nouvelle bataille, adaptation du jeu.' : ''}`,
      en: `${source.equipment.join(', ')}. Values and sequences adapt the source to combat; visual review remains pending.${source.sourceAmmunition ? ' One shot per battle; the reserve resets only when creating a new battle, a game adaptation.' : ''}`
    }
  };
}
