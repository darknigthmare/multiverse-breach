// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcMetalGear from '../../DLC/MetalGear/data/canonFollowupSourceKits.js';
import * as dlcMetalGearRising from '../../DLC/MetalGearRising/data/canonFollowupSourceKits.js';
import * as dlcTekken from '../../DLC/Tekken/data/canonFollowupSourceKits.js';

// Follow-up identity corrections are kept separate from the frozen P0 wave.
// Descriptions select an incarnation and physical props; no candidate source
// URL or existing/new artwork is certified as having passed a 1:1 review here.
const DAMAGE_ADAPTATION = 'Physical source-described action adapted to game damage; exact source choreography is not certified.';
const ACTION_KEYS = ['simple', 'secondary', 'defense', 'special'];
const MELEE_PROFILES = Object.freeze({ shape: 'single', delivery: 'melee' });
const melee = name => ({
  name, type: 'melee', canonStatus: DAMAGE_ADAPTATION,
  attackProfile: MELEE_PROFILES,
  tacticsProfile: { range: 1 },
  smashProfile: { range: 70, verticalRange: 35, shape: 'single', delivery: 'melee', maxTargets: 1 },
  canonPresentation: { kind: 'melee' }
});
const guard = name => ({ name, type: 'shield', canonStatus: DAMAGE_ADAPTATION });
const lock = details => ({
  canonCombatPresentation: true,
  canonicalFidelityApproved: false,
  canonStatus: 'Description-based incarnation and equipment correction; combat values and sequences are game adaptations, not a 1:1 fidelity approval.',
  sourceReviewStatus: 'description-based; independent source review pending',
  referenceReviewStatus: 'candidate URLs; not read or visually reviewed for this correction',
  visualReviewStatus: 'pending',
  mechanicsReviewStatus: 'Physical contact and targeting adapted to the game; exact source choreography and timings pending.',
  ...details,
  referenceUrl: details.referenceUrls[0],
  simpleName: details.simple.name,
  secondaryName: details.secondary.name,
  defenseName: details.defense.name,
  specialName: details.special.name
});

export const CANON_FOLLOWUP_SOURCE_KITS = Object.freeze({
  liquid_snake: dlcMetalGear.createCanonFollowupSourceKits({ guard, lock, melee }),
  mistral_mgr: dlcMetalGearRising.createCanonFollowupSourceKits({ guard, lock, melee }),
  true_ogre_tekken: dlcTekken.createCanonFollowupSourceKits({ guard, lock, melee })
});

export const CANON_FOLLOWUP_SOURCE_KIT_IDS = Object.freeze(Object.keys(CANON_FOLLOWUP_SOURCE_KITS));

export function applyCanonFollowupSourceKit(hero) {
  const source = Object.hasOwn(CANON_FOLLOWUP_SOURCE_KITS, hero?.id)
    ? CANON_FOLLOWUP_SOURCE_KITS[hero.id] : null;
  if (!source || (hero.universe && hero.universe !== source.sourceUniverse)) return hero;
  const result = {
    ...hero, ...source,
    referenceUrls: [...source.referenceUrls], equipment: [...source.equipment],
    sourceAbilities: [...source.sourceAbilities], loreLocalized: { ...source.loreLocalized }
  };
  for (const key of ACTION_KEYS) {
    const action = { ...hero[key], ...source[key] };
    // Existing save identities and authored balance own damage and resources.
    for (const [field, value] of Object.entries(hero[key] || {})) {
      if (typeof value === 'number') action[field] = value;
    }
    for (const profile of ['attackProfile', 'tacticsProfile', 'smashProfile', 'canonPresentation']) {
      if (action[profile]) action[profile] = { ...action[profile] };
    }
    result[key] = action;
  }
  return result;
}
