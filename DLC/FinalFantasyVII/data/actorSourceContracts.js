// Exact actor source declarations for the November13 FF batch. No artwork approval.
import { ABILITIES_CANONICAL } from '../../../src/game/combat/abilities/abilitiesCanonical.js';
import { CANONICAL_COMBAT_OVERRIDES } from '../../../src/game/canonicalCombatOverrides.js';
const HEROES = Object.freeze({
  "cloud_ff7": {
    "incarnation": "Final Fantasy VII (1997), original battle model and default SOLDIER-style outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/characters/cloud/1",
    "visualAnchor": "Adult Cloud with spiky blond hair, blue-green eyes, sleeveless dark violet SOLDIER-style clothing, single left metal pauldron, brown harness/gloves/boots and Buster Sword. No Advent Children sleeve, Fenrir gear or Remake-only costume.",
    "equipment": [
      "Buster Sword"
    ],
    "weaponType": "sword",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-vii-base",
      "actorId": "cloud_ff7",
      "universe": "Final Fantasy VII",
      "incarnation": "Final Fantasy VII (1997), original battle model and default SOLDIER-style outfit",
      "currentName": "Omnislash",
      "preparedName": "Omnislash"
    },
    "special": {
      "name": "Omnislash",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#6dff8d"
    }
  },
  "tifa_ff7": {
    "incarnation": "Final Fantasy VII (1997), original battle model and Seventh Heaven outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/characters/tifa",
    "visualAnchor": "Adult Tifa with long dark hair, white cropped tank top, black mini skirt, suspenders, red gloves and red boots; bare-handed martial arts. No Remake pleated skirt or Advent Children leather suit.",
    "equipment": [
      "Leather Glove"
    ],
    "weaponType": "melee",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-vii-base",
      "actorId": "tifa_ff7",
      "universe": "Final Fantasy VII",
      "incarnation": "Final Fantasy VII (1997), original battle model and Seventh Heaven outfit",
      "currentName": "Final Heaven",
      "preparedName": "Beat Rush"
    },
    "special": {
      "name": "Final Heaven",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#90ffb0"
    }
  },
  "aerith_ff7": {
    "incarnation": "Final Fantasy VII (1997), living party member in original pink dress",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/characters/aeris",
    "visualAnchor": "Aerith with long brown braid and pink ribbon, short red bolero jacket, pink button-front dress, brown boots and Guard Stick. She uses a staff and healing Limits; no rifle, white wing or later-film costume.",
    "equipment": [
      "Guard Stick"
    ],
    "weaponType": "staff",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-vii-base",
      "actorId": "aerith_ff7",
      "universe": "Final Fantasy VII",
      "incarnation": "Final Fantasy VII (1997), living party member in original pink dress",
      "currentName": "Great Gospel",
      "preparedName": "Healing Wind"
    },
    "special": {
      "name": "Great Gospel",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#4adc6a"
    }
  },
  "barret_ff7": {
    "incarnation": "Final Fantasy VII (1997), original AVALANCHE field outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/characters/barret",
    "visualAnchor": "Large muscular dark-skinned Barret with flat-top hair and beard, sleeveless brown vest, green trousers, heavy boots, dog tags and the gun-arm replacing his right forearm. No sunglasses-only Remake model or human right hand gripping a rifle.",
    "equipment": [
      "Gatling Gun gun-arm"
    ],
    "weaponType": "gun",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-vii-base",
      "actorId": "barret_ff7",
      "universe": "Final Fantasy VII",
      "incarnation": "Final Fantasy VII (1997), original AVALANCHE field outfit",
      "currentName": "Catastrophe",
      "preparedName": "Catastrophe"
    },
    "special": {
      "name": "Catastrophe",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#566573"
    }
  },
  "redxiii_ff7": {
    "incarnation": "Final Fantasy VII (1997), original Nanaki quadruped model",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/characters/red-xiii",
    "visualAnchor": "Red XIII/Nanaki is a red-furred quadruped with a dark mane, one scarred eye, tattoo XIII, bracelets and a flame-tipped tail. Preserve four-legged locomotion and his head ornaments; no humanoid body, sword or gun.",
    "equipment": [
      "Mythril Clip"
    ],
    "weaponType": "melee",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-vii-base",
      "actorId": "redxiii_ff7",
      "universe": "Final Fantasy VII",
      "incarnation": "Final Fantasy VII (1997), original Nanaki quadruped model",
      "currentName": "Cosmo Memory",
      "preparedName": "Cosmo Memory"
    },
    "special": {
      "name": "Cosmo Memory",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#c0392b"
    }
  },
  "yuffie_ff7": {
    "incarnation": "Final Fantasy VII (1997), original Wutai ninja outfit",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/characters/yuffie",
    "visualAnchor": "Teenage Yuffie with short dark hair, green sleeveless crop top, light shorts, headband, asymmetric arm protection and large four-point shuriken. No INTERmission moogle cloak or later Dirge outfit.",
    "equipment": [
      "4-point Shuriken"
    ],
    "weaponType": "shuriken",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-vii-base",
      "actorId": "yuffie_ff7",
      "universe": "Final Fantasy VII",
      "incarnation": "Final Fantasy VII (1997), original Wutai ninja outfit",
      "currentName": "All Creation",
      "preparedName": "All Creation"
    },
    "special": {
      "name": "All Creation",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#27ae60"
    }
  },
  "vincent_ff7": {
    "incarnation": "Final Fantasy VII (1997), original red-cloaked party member",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/characters/vincent",
    "visualAnchor": "Vincent has long black hair and red headband, red high-collared ragged cape, black clothing and gold left gauntlet/boots, carrying the original Quicksilver handgun. No three-barrel Cerberus from Dirge of Cerberus.",
    "equipment": [
      "Quicksilver"
    ],
    "weaponType": "gun"
  }
});
const ENEMIES = Object.freeze({
  "Midgar Zolom": {
    "incarnation": "Final Fantasy VII (1997), marsh serpent encounter near Mythril Mine",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/monsters/midgar-zolom",
    "visualAnchor": "Enormous limbless swamp serpent with long coiled body, raised neck, broad fanged head and segmented belly. Preserve the snake body without humanoid torso, arms, rifles or Remake Midgardsormr redesign.",
    "weapon": "bite",
    "sourceTechniqueName": "Beta"
  },
  "Shinra Guard": {
    "incarnation": "Final Fantasy VII (1997), Midgar MP security infantry",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/monsters/mp",
    "visualAnchor": "Shinra MP infantry in the original Midgar security uniform, enclosed helmet with red optics, torso/shoulder armor, trousers and carried firearm. No SOLDIER sword, Remake-only heavy shield or uncovered civilian face.",
    "weapon": "rifle",
    "special": "Machine Gun"
  },
  "Sweeper Machine": {
    "incarnation": "Final Fantasy VII (1997), Midgar Sweeper machine",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/monsters/sweeper",
    "visualAnchor": "Original Sweeper is a squat bipedal industrial combat machine with armored central chassis, two mechanical legs and paired gun arms. No scorpion tail, human rider or Guard Scorpion body.",
    "weapon": "machine_gun",
    "sourceTechniqueName": "Machine Gun"
  },
  "Jenova BIRTH": {
    "incarnation": "Final Fantasy VII (1997), Jenova-BIRTH cargo-ship battle",
    "referenceUrl": "https://guides.gamercorner.net/ffvii/monsters/jenova-birth",
    "visualAnchor": "Jenova-BIRTH is the original cargo-ship form, with alien upper body, long red hair and multiple large fleshy tentacles. Keep its appendages separate and avoid Jenova-LIFE/DEATH palettes, SYNTHESIS lower body or a carried gun.",
    "weapon": "tentacles",
    "special": "Tail Laser"
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
  if (!kit || kit.universe !== "Final Fantasy VII") throw new Error(`Cross-source FF actor: ${id}`);
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
