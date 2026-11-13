// Exact actor source declarations for the November13 FF batch. No artwork approval.
import { ABILITIES_CANONICAL } from '../../../src/game/combat/abilities/abilitiesCanonical.js';
import { CANONICAL_COMBAT_OVERRIDES } from '../../../src/game/canonicalCombatOverrides.js';
const HEROES = Object.freeze({
  "squall_ff8": {
    "incarnation": "Final Fantasy VIII (1999), casual Balamb field outfit",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Young Squall with brown hair, scar between the eyes, black leather jacket with white fur collar, white shirt, black belts/trousers and Revolver gunblade. No SeeD dress uniform, Dissidia redesign or projectile bullets from a sword swing.",
    "equipment": [
      "Revolver gunblade"
    ],
    "weaponType": "sword",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-viii-base",
      "actorId": "squall_ff8",
      "universe": "Final Fantasy VIII",
      "incarnation": "Final Fantasy VIII (1999), casual Balamb field outfit",
      "currentName": "Lion Heart",
      "preparedName": "Renzokuken"
    },
    "special": {
      "name": "Lion Heart",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#8fb6ff"
    }
  },
  "rinoa_ff8": {
    "incarnation": "Final Fantasy VIII (1999), blue-knit Forest Owls field outfit",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Rinoa with dark shoulder-length hair, blue sleeveless knit duster with white wing motif, black top/shorts, black arm warmers and blue boots. Blaster Edge is mounted on her arm; Angelo remains a separate dog partner, not a laser cannon.",
    "equipment": [
      "Pinwheel Blaster Edge",
      "Angelo"
    ],
    "weaponType": "boomerang",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-viii-base",
      "actorId": "rinoa_ff8",
      "universe": "Final Fantasy VIII",
      "incarnation": "Final Fantasy VIII (1999), blue-knit Forest Owls field outfit",
      "currentName": "Wishing Star",
      "preparedName": "Angelo Cannon"
    },
    "special": {
      "name": "Wishing Star",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#b2d9ff"
    }
  },
  "quistis_ff8": {
    "incarnation": "Final Fantasy VIII (1999), original instructor field outfit",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Quistis has blond tied-back hair, glasses, peach sleeveless high-neck long outfit with belt, dark gloves and boots, and a whip. Preserve her glasses, whip and Blue Magic role; no rifle or gunblade.",
    "equipment": [
      "Chain Whip"
    ],
    "weaponType": "whip",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-viii-base",
      "actorId": "quistis_ff8",
      "universe": "Final Fantasy VIII",
      "incarnation": "Final Fantasy VIII (1999), original instructor field outfit",
      "currentName": "Shockwave Pulsar",
      "preparedName": "Laser Eye"
    },
    "special": {
      "name": "Shockwave Pulsar",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#6c93dc"
    }
  },
  "seifer_ff8": {
    "incarnation": "Final Fantasy VIII (1999), Dollet temporary-party coat",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Seifer has short blond hair, diagonal facial scar, long pale coat with red crosses on the sleeves, dark shirt and gloves, holding Hyperion one-handed. No Squall fur collar, SeeD dress uniform or firearm stance.",
    "equipment": [
      "Hyperion gunblade"
    ],
    "weaponType": "sword",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-viii-base",
      "actorId": "seifer_ff8",
      "universe": "Final Fantasy VIII",
      "incarnation": "Final Fantasy VIII (1999), Dollet temporary-party coat",
      "currentName": "No Mercy",
      "preparedName": "No Mercy"
    },
    "special": {
      "name": "No Mercy",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#d7dbdd"
    }
  },
  "laguna_ff8": {
    "incarnation": "Final Fantasy VIII (1999), young Galbadian soldier flashback outfit",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Young Laguna with shoulder-length dark hair, blue military jacket, light shirt, dark trousers, dog tags and a two-handed machine gun. No presidential suit or older grey-haired redesign.",
    "equipment": [
      "Galbadian machine gun"
    ],
    "weaponType": "gun",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-viii-base",
      "actorId": "laguna_ff8",
      "universe": "Final Fantasy VIII",
      "incarnation": "Final Fantasy VIII (1999), young Galbadian soldier flashback outfit",
      "currentName": "Desperado",
      "preparedName": "Desperado"
    },
    "special": {
      "name": "Desperado",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#5dade2"
    }
  },
  "zell_ff8": {
    "incarnation": "Final Fantasy VIII (1999), original Balamb casual outfit",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Zell has spiked blond hair and the dark tattoo on the left side of his face, short blue jacket with red trim, dark shorts, red gloves and red shoes. He fights with fists and kicks; no sword or projectile gun.",
    "equipment": [
      "Metal Knuckle"
    ],
    "weaponType": "melee",
    "special": {
      "name": "My Final Heaven",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#f4d03f"
    }
  },
  "selphie_ff8": {
    "incarnation": "Final Fantasy VIII (1999), original yellow field dress",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Selphie has short brown outward-flipped hair, sleeveless yellow zip-front dress and boots, using a linked nunchaku. No laser weapon or SeeD parade uniform; Slots outcomes are separate source commands.",
    "equipment": [
      "Flail nunchaku"
    ],
    "weaponType": "nunchaku"
  },
  "irvine_ff8": {
    "incarnation": "Final Fantasy VIII (1999), original Galbadian sharpshooter outfit",
    "referenceUrl": "https://na.finalfantasy.com/en/titles/finalfantasy8/",
    "visualAnchor": "Irvine has long brown tied-back hair, cowboy hat, long pale coat with fur collar, purple shirt, gloves and boots, carrying Valiant rifle. No pistol, gunblade or generic military helmet.",
    "equipment": [
      "Valiant rifle"
    ],
    "weaponType": "gun",
    "sourceSignatureDeclaration": {
      "audit": "ff-lot-040-2026-11-13",
      "sourceKey": "ff-viii-base",
      "actorId": "irvine_ff8",
      "universe": "Final Fantasy VIII",
      "incarnation": "Final Fantasy VIII (1999), original Galbadian sharpshooter outfit",
      "currentName": "Hyper Shot",
      "preparedName": "Quick Shot"
    },
    "special": {
      "name": "Hyper Shot",
      "type": "origin_aoe",
      "dmg": 4.5,
      "color": "#7f5c38"
    }
  }
});
const ENEMIES = Object.freeze({
  "Galbadian Soldier": {
    "incarnation": "Final Fantasy VIII (1999), standard Galbadian infantry",
    "referenceUrl": "https://guides.gamercorner.net/ffviii/monsters/g-soldier",
    "visualAnchor": "Original G-Soldier infantry with closed helmet, blue combat uniform, shoulder armor, boots and a sword. Its original attack family includes sword attacks and low-level magic; no Esthar cyborg limbs, elite red variant or carried rifle.",
    "weapon": "sword",
    "special": "Sword Attack"
  },
  "Bite Bug": {
    "incarnation": "Final Fantasy VIII (1999), Balamb-area Bite Bug",
    "referenceUrl": "https://guides.gamercorner.net/ffviii/monsters/bite-bug",
    "visualAnchor": "Small flying insect with rounded abdomen, large compound eyes, paired wings, thin legs and biting mouthparts. It hovers as the original Bite Bug rather than holding a gun, staff or human accessories.",
    "weapon": "bite",
    "special": "Bite"
  },
  "T-Rexaur": {
    "incarnation": "Final Fantasy VIII (1999), Balamb Garden training-center T-Rexaur",
    "referenceUrl": "https://guides.gamercorner.net/ffviii/monsters/t-rexaur",
    "visualAnchor": "Huge biped tyrannosaur with large toothed head, long balancing tail, two short forearms and powerful clawed feet. Keep the source creature anatomy and markings, without plate armor, gun or spellcasting staff.",
    "weapon": "bite",
    "special": "Tail Swipe"
  },
  "Edea Kramer": {
    "incarnation": "Final Fantasy VIII (1999), possessed Edea at Galbadia Garden",
    "referenceUrl": "https://guides.gamercorner.net/ffviii/monsters/edea/2",
    "visualAnchor": "Possessed sorceress Edea wears the original black gown, broad feathered collar and elaborate gold wire headdress. Preserve her long dark hair and sorceress silhouette; no Ultimecia wings, Griever anatomy or gunblade.",
    "weapon": "magic",
    "special": "Maelstrom"
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
  if (!kit || kit.universe !== "Final Fantasy VIII") throw new Error(`Cross-source FF actor: ${id}`);
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
