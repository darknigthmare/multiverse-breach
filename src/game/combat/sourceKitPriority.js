import { SIGNATURE_SOURCE_KITS } from '../signatureSourceKits.js';
import { COMBAT_ABILITY_OVERRIDES } from './abilities/catalog.js';
import { CANONICAL_COMBAT_OVERRIDES } from '../canonicalCombatOverrides.js';
import { CANONICAL_COMBAT_EXTENSIONS } from '../combatCanonExtensions.js';
import { COMBAT_CAPABILITY_COMPLETION } from './completion/catalog.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE10 } from './combatSourceDefinitionsWave10.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE11 } from './combatSourceDefinitionsWave11.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12 } from './combatSourceDefinitionsWave12.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE13 } from './combatSourceDefinitionsWave13.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE14 } from './combatSourceDefinitionsWave14.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 } from './combatSourceDefinitionsWave15.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE16 } from './combatSourceDefinitionsWave16.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from './combatSourceDefinitionsWave17.js';
import { CANON_FOLLOWUP_SOURCE_KITS } from '../canonFollowupSourceKits.js';

// Only these explicitly reviewed source versions own native action dispatch.
// An older basic-ability catalog entry alone must not disable a newly sourced
// signature, an enemy signature, or an unrelated incarnation's adapter.
const sources = new Map();
for (const [wave, definitions] of [
  [10, COMBAT_SOURCE_DEFINITIONS_WAVE10], [11, COMBAT_SOURCE_DEFINITIONS_WAVE11],
  [12, COMBAT_SOURCE_DEFINITIONS_WAVE12], [13, COMBAT_SOURCE_DEFINITIONS_WAVE13],
  [14, COMBAT_SOURCE_DEFINITIONS_WAVE14], [15, COMBAT_SOURCE_DEFINITIONS_WAVE15],
  [16, COMBAT_SOURCE_DEFINITIONS_WAVE16], [17, COMBAT_SOURCE_DEFINITIONS_WAVE17]
]) for (const [id, source] of Object.entries(definitions)) sources.set(id, { wave, source });

// These overlaps need a source decision, rather than whichever adapter runs last.
// Liquid's final REX duel is more specific than W13's general Shadow Moses kit.
// W15 True Ogre deliberately strikes only with the left claw and preserves the
// single right-arm viper; the later broad beast/serpent-arm adapter cannot widen it.
// Current P0 Raven/Starfire use their exact original-team source kit; historical
// W16 actors retain their reviewed action and emitter choices.
const overlapPriority = Object.freeze({
  liquid_snake: 'canon-followup-final-rex-duel',
  true_ogre_tekken: 'wave15-left-claw-single-viper',
  raven_tt: 'wave16-selected-source',
  starfire_tt: 'wave16-selected-source'
});

// GitHub 2333c2c0 source editions, independently pinned in
// scripts/fixtures/githubStarWarsRaw2333c2c0.json. Match identity, incarnation,
// equipment and actions together: an alias or a familiar name is insufficient.
// W13's frozen actors remain eligible for their own historical source kits.
const currentStarWarsEditions = Object.freeze({
  "ahsoka_padawan": {
    "incarnation": "The Clone Wars - early Padawan, age fourteen",
    "weaponType": "lightsaber",
    "equipment": [
      "Green Lightsaber"
    ],
    "actions": {
      "simple": [
        "Reverse-Grip Green Saber",
        "melee"
      ],
      "secondary": [
        "Padawan Force Leap",
        "force"
      ],
      "defense": [
        "Shien Deflection",
        "shield"
      ],
      "special": [
        "Skyguy Battlefield Lesson",
        "force_aoe"
      ]
    },
    "preparedSignature": "Padawan Lightsaber Combination"
  },
  "ahsoka": {
    "incarnation": "The Clone Wars - Season 7, Siege of Mandalore",
    "weaponType": "dual_lightsaber",
    "equipment": [
      "Twin Blue Lightsabers"
    ],
    "actions": {
      "simple": [
        "Twin Blue Saber Cut",
        "melee"
      ],
      "secondary": [
        "Mandalore Throne-Room Counter",
        "force"
      ],
      "defense": [
        "Order 66 Deflection",
        "shield"
      ],
      "special": [
        "Siege of Mandalore Break",
        "force_aoe"
      ]
    },
    "preparedSignature": "Mandalore Twin Sabers"
  },
  "ahsoka_adult": {
    "incarnation": "Star Wars Rebels - Fulcrum era (adult former Jedi)",
    "weaponType": "dual_lightsaber",
    "equipment": [
      "Twin White Lightsabers"
    ],
    "actions": {
      "simple": [
        "White Saber Crosscut",
        "melee"
      ],
      "secondary": [
        "Fulcrum Route Read",
        "force"
      ],
      "defense": [
        "Fulcrum Evasive Guard",
        "dodge"
      ],
      "special": [
        "Fulcrum Twin-Saber Sweep",
        "light_aoe"
      ]
    },
    "preparedSignature": "White Sabers Combination"
  },
  "aayla_secura": {
    "incarnation": "The Clone Wars - Aayla Secura as Jedi General",
    "weaponType": "lightsaber",
    "equipment": [
      "Blue Lightsaber"
    ],
    "actions": {
      "simple": [
        "Blue Saber Advance",
        "melee"
      ],
      "secondary": [
        "Felucia Flank",
        "force"
      ],
      "defense": [
        "Jedi General Guard",
        "shield"
      ],
      "special": [
        "Commander Bly Formation",
        "force_aoe"
      ]
    },
    "preparedSignature": "Aayla Lightsaber Combination"
  },
  "darth_maul": {
    "incarnation": "The Clone Wars - Season 7, Siege of Mandalore (The Phantom Apprentice)",
    "weaponType": "double_lightsaber",
    "equipment": [
      "Double-Bladed Red Lightsaber (The Clone Wars S7)"
    ],
    "bodyProsthetics": [
      "Mandalorian-Issue Humanoid Cybernetic Legs"
    ],
    "actions": {
      "simple": [
        "Mandalore Twin-Blade Assault",
        "melee"
      ],
      "secondary": [
        "Dathomirian Force Choke",
        "force"
      ],
      "defense": [
        "Cybernetic Spin Parry",
        "shield"
      ],
      "special": [
        "Shadow Collective Dominion",
        "dark_aoe"
      ]
    },
    "preparedSignature": "Maul Double-Bladed Saber"
  },
  "darth_revan": {
    "incarnation": "Star Wars: Knights of the Old Republic I - masked Darth Revan (Legends Sith)",
    "weaponType": "lightsaber",
    "equipment": [
      "Red Lightsaber"
    ],
    "actions": {
      "simple": [
        "Red Saber Judgment",
        "melee"
      ],
      "secondary": [
        "Force Reversal",
        "force"
      ],
      "defense": [
        "Revanite Mask Focus",
        "shield"
      ],
      "special": [
        "Star Forge Command",
        "force_aoe"
      ]
    }
  },
  "darth_talon": {
    "incarnation": "Star Wars: Legacy (Legends) - One Sith Hand of Darth Krayt",
    "weaponType": "lightsaber",
    "equipment": [
      "Red Lightsaber",
      "Forearm and Bicep Armor",
      "Leg Armor"
    ],
    "actions": {
      "simple": [
        "One Sith Saber Cut",
        "melee"
      ],
      "secondary": [
        "Twi lek Hunter Lunge",
        "force"
      ],
      "defense": [
        "Sith Tattoo Focus",
        "dodge"
      ],
      "special": [
        "Hand of Darth Krayt",
        "dark_aoe"
      ]
    }
  }
});
const exactEquipment = (actual, expected) => Array.isArray(actual)
  && actual.length === expected.length && expected.every(item => actual.includes(item));
function matchesCurrentStarWarsEdition(actor, id, universe) {
  const edition = currentStarWarsEditions[id];
  if (!edition || universe !== 'Star Wars' || actor.incarnation !== edition.incarnation
    || actor.weaponType !== edition.weaponType || !exactEquipment(actor.equipment, edition.equipment)
    || edition.bodyProsthetics && !exactEquipment(actor.bodyProsthetics, edition.bodyProsthetics)) return false;
  return Object.entries(edition.actions).every(([slot, [name, type]]) => {
    const action = actor[slot];
    if (action?.name === name && action.type === type) return true;
    // Battle-local signature preparation changes only the special's name and
    // delivery. It must not make the basics fall back to another source edition.
    return slot === 'special' && edition.preparedSignature
      && action?.sourceSignatureKey === id && action.name === edition.preparedSignature
      && action.type === 'melee';
  });
}

// These current master incarnations explicitly exclude the older reviewed kit.
// Historical actors without this exact incarnation/equipment keep their source.
export function prefersCurrentCanonCombatKit(actor) {
  const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  const universe = actor?.sourceUniverse || actor?.universe;
  if (!actor || actor.universe && actor.universe !== universe) return false;
  if (matchesCurrentStarWarsEdition(actor, id, universe)) return true;
  const selected = actor.canonCombatPresentation === true && ['raven_tt', 'starfire_tt'].includes(id) && universe === 'Teen Titans'
    ? { incarnation: 'Teen Titans (2003-2006 animated series) - original Jump City team',
      equipment: id === 'raven_tt' ? ['Mystical Powers', 'Hooded Purple Cloak'] : ['Tamaranean Starbolts', 'Purple Animated-Series Costume'] }
    : id === 'ripley' && universe === 'Alien'
    ? { incarnation: 'Alien (1979) - Nostromo / Narcissus', equipment: ['Nostromo improvised flamethrower', 'Narcissus harpoon gun'] }
    : id === 'darth_maul' && universe === 'Star Wars'
      ? { incarnation: 'The Clone Wars - ruler of Mandalore', equipment: ['Double-Bladed Red Lightsaber', 'Cybernetic Legs', 'Mandalore Command Seal'] }
      : null;
  return !!selected && actor.incarnation === selected.incarnation
    && Array.isArray(actor.equipment) && selected.equipment.every(item => actor.equipment.includes(item));
}

// A prepared legacy signature is an explicit existing action version. Current
// catalog actors carry no such key and keep their reviewed native source kit.
export function hasPreparedLegacyCombatSource(actor, slot = 'special') {
  if (!actor || slot !== 'special') return false;
  const id = actor.sourceHeroId || actor.sourceId || actor.id;
  const selected = sources.get(id), universe = actor.sourceUniverse || actor.universe;
  // Resolve only at call time: signatureSourceKits also consumes this policy.
  const legacy = SIGNATURE_SOURCE_KITS[id];
  return !!selected && !!legacy && legacy.actorId === id && legacy.universe === universe
    && (!legacy.requiredContinuity || actor.continuityScope === legacy.requiredContinuity)
    && universe === selected.source.universe
    && (!actor.universe || actor.universe === universe)
    && actor.special?.sourceSignatureKey === id;
}

export function resolveSelectedCombatSource(actor, slot = 'special') {
  if (!actor || !['simple', 'secondary', 'defense', 'special'].includes(slot)
    || hasPreparedLegacyCombatSource(actor, slot) || prefersCurrentCanonCombatKit(actor)) return null;
  const id = actor.sourceHeroId || actor.sourceId || actor.id;
  const selected = sources.get(id);
  const universe = actor.sourceUniverse || actor.universe;
  let authored = COMBAT_ABILITY_OVERRIDES[id];
  if (!selected || universe !== selected.source.universe || authored?.universe !== universe
    || actor.universe && actor.universe !== universe) return null;
  const revision = /^wave(\d+)-explicit-source-version$/.exec(authored.versionRevision || '');
  if (revision && Number(revision[1]) !== selected.wave) return null;
  if (slot === 'special' && !authored.special) {
    // This exact current source-locked super supersedes only the historical
    // metadata-only W10 super; its compatible reviewed basics remain selected.
    if (selected.wave === 10 && id === 'ripley_aliens' && actor.incarnation === 'Aliens (1986) - LV-426 / Sulaco'
      && actor.canonStatus === 'source-locked-gameplay-adaptation' && typeof actor.referenceUrl === 'string'
      && Array.isArray(actor.equipment)
      && ['M41A pulse rifle', 'M240 incinerator', 'Caterpillar P-5000 power loader'].every(item => actor.equipment.includes(item))
      && actor.special?.name === 'Power Loader Smash' && actor.special.type === 'melee_aoe') return null;
    // Some reviewed versions retain their existing canonical super while
    // revising only basic actions. Use the same authored-super order as the
    // shared resolver, with the exact reviewed action and wave still required.
    const canonical = CANONICAL_COMBAT_OVERRIDES[id] || CANONICAL_COMBAT_EXTENSIONS[id] || COMBAT_CAPABILITY_COMPLETION[id];
    if (!revision || canonical?.universe !== universe || canonical.special?.name !== selected.source.name
      || typeof canonical.special?.type !== 'string') return null;
    authored = { ...canonical, ...authored, special: canonical.special,
      sourceUrl: authored.sourceUrl || canonical.sourceUrl,
      sourceReference: [canonical.sourceReference, authored.sourceReference].filter(Boolean).join(' ') };
  }
  if (!authored[slot] || typeof authored[slot] !== 'object') return null;
  let action = authored[slot], effectiveAuthored = authored, source = selected.source;
  const priority = overlapPriority[id] || `wave${selected.wave}-selected-source`;
  const followup = id === 'liquid_snake' ? CANON_FOLLOWUP_SOURCE_KITS[id] : null;
  if (followup && actor.canonCombatPresentation === true && actor.incarnation === followup.incarnation) {
    // Refine source labels/identity while retaining the reviewed local contact,
    // resource budget and timings. This remains one physical action, not a
    // second canonical attack or an aircraft reinforcement.
    action = { ...action, name: followup[slot].name, type: followup[slot].type,
      ...(followup[slot].canonPresentation ? { canonPresentation: { ...followup[slot].canonPresentation } } : {}) };
    effectiveAuthored = { ...authored, sourceWork: followup.incarnation,
      sourceUrl: followup.referenceUrl,
      sourceReference: `${followup.incarnation}. ${followup.visualAnchor} ${followup.canonStatus}`,
      [slot]: action };
    source = { ...source, name: followup.special.name, sourceWork: followup.incarnation,
      sourceReference: followup.referenceUrl, appearance: followup.visualAnchor,
      weaponType: followup.weaponType, source1to1Verified: false, networkVerified: false };
  }
  return { id, universe, source, authored: effectiveAuthored, action,
    priority, sourceWave: selected.wave };
}

export const hasSelectedCombatSource = (actor, slot = 'special') => !!resolveSelectedCombatSource(actor, slot);
