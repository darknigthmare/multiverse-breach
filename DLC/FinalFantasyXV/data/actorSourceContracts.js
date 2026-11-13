// Exact actor source declarations for the November13 FF batch. No artwork approval.
import { ABILITIES_CANONICAL } from '../../../src/game/combat/abilities/abilitiesCanonical.js';
import { CANONICAL_COMBAT_OVERRIDES } from '../../../src/game/canonicalCombatOverrides.js';
import { ABILITIES_WAVE14_DEFINITIONS } from '../../../src/game/combat/abilities/abilitiesWave14Definitions.js';
const HEROES = Object.freeze({
  "noctis_ff15": {
    "incarnation": "Final Fantasy XV (2016), young pre-timeskip Prince's Fatigues",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/character/noctis/",
    "visualAnchor": "Young Noctis has spiky black hair, black short jacket and shirt, cropped dark trousers and boots, with Engine Blade. No ten-years-later beard, Kingly Raiment or Armiger Unleashed Royal Edition accessory.",
    "equipment": [
      "Engine Blade"
    ],
    "weaponType": "sword"
  },
  "gladiolus_ff15": {
    "incarnation": "Final Fantasy XV (2016), pre-timeskip Crownsguard outfit",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/character/gladiolus/",
    "visualAnchor": "Gladiolus is tall and muscular with brown tied-back hair, beard/scars, open black jacket showing chest and arm tattoos, dark trousers and a greatsword. No firearm or later-timeskip outfit.",
    "equipment": [
      "Two-Handed Sword"
    ],
    "weaponType": "sword"
  },
  "ignis_ff15": {
    "incarnation": "Final Fantasy XV (2016), sighted pre-Altissia Crownsguard outfit",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/character/ignis/",
    "visualAnchor": "Sighted Ignis has swept-up brown hair, glasses, dark tailored jacket and patterned shirt, gloves and dark trousers, using paired daggers. No rifle, post-Altissia eye scars or alternate Episode Ignis powers.",
    "equipment": [
      "Daggers"
    ],
    "weaponType": "slash"
  },
  "lunafreya_ff15": {
    "incarnation": "Final Fantasy XV (2016), living Oracle in white main-game dress",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/character/luna/",
    "visualAnchor": "Lunafreya has blond braided-up hair and a white sleeveless layered main-game dress with waist detail, holding the Oracle's trident as a ceremonial/support implement. No rifle, laser or wedding-dress replacement; healing and blessing remain non-offensive.",
    "equipment": [
      "Trident of the Oracle"
    ],
    "weaponType": "staff"
  },
  "prompto_ff15": {
    "incarnation": "Final Fantasy XV (2016), pre-timeskip Crownsguard outfit",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/character/prompto/",
    "visualAnchor": "Young Prompto has spiky blond hair and freckles, a sleeveless dark vest, patterned dark trousers and gloves, carrying a pistol and a separate camera. No Episode Prompto snow coat or camera used as a gun.",
    "equipment": [
      "Handgun",
      "camera"
    ],
    "weaponType": "gun"
  },
  "ardyn_ff15": {
    "incarnation": "Final Fantasy XV (2016), main-game chancellor outfit",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/character/ardyn/",
    "visualAnchor": "Adult Ardyn has auburn hair, dark fedora, layered black coat and patterned red scarf; one spectral royal blade is held locally. No Episode Ardyn historical royal armor or borrowed Astral body.",
    "equipment": [
      "Spectral royal blade"
    ],
    "weaponType": "sword"
  },
  "cor_ff15": {
    "incarnation": "Final Fantasy XV (2016), main-game Crownsguard marshal outfit",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/character/cor/",
    "visualAnchor": "Mature Cor has short dark-grey hair, black Crownsguard jacket, practical dark trousers and a physical katana. No Armiger, royal spectral weapon or invented magic wave.",
    "equipment": [
      "Kotetsu katana"
    ],
    "weaponType": "katana"
  }
});
const ENEMIES = Object.freeze({
  "MT Trooper": {
    "incarnation": "Final Fantasy XV (2016), Niflheim Magitek rifle infantry",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/screenshot/monster/",
    "visualAnchor": "Humanoid Niflheim Magitek infantry with enclosed helmet/faceplate, segmented artificial limbs, dark imperial armor and carried rifle. This slot selects rifle infantry, not the axe-bearing elite variant, a human Crownsguard or an Astral.",
    "weapon": "rifle",
    "special": "Magitek Rifle Fire"
  },
  "Iron Giant": {
    "incarnation": "Final Fantasy XV (2016), standard night-time Iron Giant daemon",
    "referenceUrl": "https://www.jp.square-enix.com/ff15/screenshot/monster/",
    "visualAnchor": "Large humanoid daemon in heavy dark iron armor and a horned enclosed helmet, carrying a massive physical greatsword. No Red Giant red color variant, ranged rifle or magical staff replacing the sword.",
    "weapon": "sword",
    "special": "Greatsword Sweep"
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
  const kit = ABILITIES_CANONICAL[id] || ABILITIES_WAVE14_DEFINITIONS[id];
  if (!kit || kit.universe !== "Final Fantasy XV") throw new Error(`Cross-source FF actor: ${id}`);
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
