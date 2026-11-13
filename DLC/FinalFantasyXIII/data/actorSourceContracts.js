// Exact actor source declarations for the November13 FF batch. No artwork approval.
import { ABILITIES_CANONICAL } from '../../../src/game/combat/abilities/abilitiesCanonical.js';
import { CANONICAL_COMBAT_OVERRIDES } from '../../../src/game/canonicalCombatOverrides.js';
const HEROES = Object.freeze({
  "lightning_ff13": {
    "incarnation": "Final Fantasy XIII (2009), main-game Guardian Corps outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/characters/lightning",
    "visualAnchor": "Lightning has pink side-swept hair, pale sleeveless Guardian Corps coat, dark undershirt, short skirt, red cape, gloves and brown high boots, with Blazefire Saber. No XIII-2 Etro armor or Lightning Returns garb.",
    "equipment": [
      "Blazefire Saber"
    ],
    "weaponType": "sword",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-xiii-base",
      "actorId": "lightning_ff13",
      "universe": "Final Fantasy XIII",
      "incarnation": "Final Fantasy XIII (2009), main-game Guardian Corps outfit",
      "currentName": "Army of One",
      "preparedName": "Odin — Zantetsuken"
    },
    "special": {
      "name": "Army of One",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#f0a8d8"
    }
  },
  "fang_ff13": {
    "incarnation": "Final Fantasy XIII (2009), main-game Oerba l'Cie outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/characters/fang",
    "visualAnchor": "Oerba Yun Fang has dark wavy hair, blue draped sari-like outfit, fur pelt, jewelry, visible l'Cie brand and a long segmented spear. No firearm, Ragnarok body or borrowed Bahamut anatomy.",
    "equipment": [
      "Bladed Lance"
    ],
    "weaponType": "spear",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-xiii-base",
      "actorId": "fang_ff13",
      "universe": "Final Fantasy XIII",
      "incarnation": "Final Fantasy XIII (2009), main-game Oerba l'Cie outfit",
      "currentName": "Highwind",
      "preparedName": "Bahamut — Megaflare"
    },
    "special": {
      "name": "Highwind",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#ffcbfb"
    }
  },
  "vanille_ff13": {
    "incarnation": "Final Fantasy XIII (2009), main-game Oerba l'Cie outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/characters/vanille",
    "visualAnchor": "Oerba Dia Vanille has red-orange twin pigtails, pink halter top, short orange skirt, fur pelt and beads, with the branching Binding Rod and its flexible wires. No rifle, XIII sequel outfit or Hecatoncheir body parts.",
    "equipment": [
      "Binding Rod"
    ],
    "weaponType": "staff",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-xiii-base",
      "actorId": "vanille_ff13",
      "universe": "Final Fantasy XIII",
      "incarnation": "Final Fantasy XIII (2009), main-game Oerba l'Cie outfit",
      "currentName": "Death",
      "preparedName": "Hecatoncheir — Gaian Salvo"
    },
    "special": {
      "name": "Death",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#cd85b5"
    }
  },
  "snow_ff13": {
    "incarnation": "Final Fantasy XIII (2009), main-game NORA leader outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/characters/snow",
    "visualAnchor": "Snow is tall and muscular with blond hair under a dark knit cap, long pale coat, dark shirt, fingerless gloves and boots. Weapons are his power-enhancing emblems and fists; no rifle, XIII-2 fur costume or Lightning Returns long hair.",
    "equipment": [
      "Wild Bear emblem"
    ],
    "weaponType": "melee",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-xiii-base",
      "actorId": "snow_ff13",
      "universe": "Final Fantasy XIII",
      "incarnation": "Final Fantasy XIII (2009), main-game NORA leader outfit",
      "currentName": "Sovereign Fist",
      "preparedName": "Stiria & Nix — Diamond Dust"
    },
    "special": {
      "name": "Sovereign Fist",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#d7dbdd"
    }
  },
  "sazh_ff13": {
    "incarnation": "Final Fantasy XIII (2009), main-game pilot outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/characters/sazh",
    "visualAnchor": "Sazh has a rounded afro, goatee, green pilot coat over a light shirt, dark trousers and two pistols. His chocobo chick stays a small companion, not a projectile or offensive summoned animal.",
    "equipment": [
      "Vega 42 dual pistols"
    ],
    "weaponType": "gun",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-xiii-base",
      "actorId": "sazh_ff13",
      "universe": "Final Fantasy XIII",
      "incarnation": "Final Fantasy XIII (2009), main-game pilot outfit",
      "currentName": "Cold Blood",
      "preparedName": "Brynhildr — Múspell Flame"
    },
    "special": {
      "name": "Cold Blood",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#34495e"
    }
  },
  "hope_ff13": {
    "incarnation": "Final Fantasy XIII (2009), teenage main-game field outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/characters/hope",
    "visualAnchor": "Teenage Hope has silver hair, orange short jacket, patterned green scarf, light trousers and gloves, carrying Airwing boomerang. No adult XIII-2 model, gun or Alexander parts on his body.",
    "equipment": [
      "Airwing boomerang"
    ],
    "weaponType": "boomerang",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-xiii-base",
      "actorId": "hope_ff13",
      "universe": "Final Fantasy XIII",
      "incarnation": "Final Fantasy XIII (2009), teenage main-game field outfit",
      "currentName": "Last Resort",
      "preparedName": "Alexander — Divine Judgment"
    },
    "special": {
      "name": "Last Resort",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#d5dbdb"
    }
  }
});
const ENEMIES = Object.freeze({
  "PSICOM Soldier": {
    "incarnation": "Final Fantasy XIII (2009), PSICOM Warden infantry at the Hanging Edge",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/monsters/psicom-warden",
    "visualAnchor": "This previously generic PSICOM infantry slot targets the original PSICOM Warden: enclosed military helmet, armored uniform, carried firearm and human infantry proportions. No Cie'th growths, giant armor or unqualified later-game PSICOM variant.",
    "weapon": "rifle",
    "special": "Firearm Attack"
  },
  "Barthandelus": {
    "incarnation": "Final Fantasy XIII (2009), first fal'Cie form aboard the Palamecia",
    "referenceUrl": "https://guides.gamercorner.net/ffxiii/monsters/barthandelus/1",
    "visualAnchor": "Barthandelus in the first Palamecia battle is a huge white-and-gold fal'Cie construct with central face and four distinct side-head armor structures. No human Galenth Dysley robe, second/third-form body or generic floating core.",
    "weapon": "magic",
    "special": "Destrudo"
  }
});
const clone = value => JSON.parse(JSON.stringify(value));
const provenance = Object.freeze({
  sourceFidelityAudit: 'ff-lot-040-2026-11-13',
  canonStatus: 'Source edition declared individually; existing authored ability rules reused. Numeric effects, timing, poses and artwork remain adaptations requiring review.',
  source1to1Verified: false,
  artApproved: false,
  gameplayAdaptation: true
});
export function sourceHeroContract(id) {
  const record = HEROES[id];
  if (!record) throw new Error(`Unknown FF source actor: ${id}`);
  const kit = ABILITIES_CANONICAL[id];
  if (!kit || kit.universe !== "Final Fantasy XIII") throw new Error(`Cross-source FF actor: ${id}`);
  const special = record.special || CANONICAL_COMBAT_OVERRIDES[id]?.special || kit.special;
  return { ...provenance, ...clone(record),
    simple: clone(kit.simple), secondary: clone(kit.secondary), defense: clone(kit.defense),
    special: clone(special), sourceReference: kit.sourceReference,
    gameplayAdaptation: true };
}
export function sourceEnemyContract(name) {
  const record = ENEMIES[name];
  if (!record) throw new Error(`Unknown FF source enemy: ${name}`);
  return { ...provenance, ...clone(record) };
}
