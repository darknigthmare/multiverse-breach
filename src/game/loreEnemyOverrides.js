// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcAlteredBeast from '../../DLC/AlteredBeast/data/loreEnemyOverrides.js';
import * as dlcChickenRun from '../../DLC/ChickenRun/data/loreEnemyOverrides.js';
import * as dlcCloverfield from '../../DLC/Cloverfield/data/loreEnemyOverrides.js';
import * as dlcCthulhu from '../../DLC/Cthulhu/data/loreEnemyOverrides.js';
import * as dlcDandadan from '../../DLC/Dandadan/data/loreEnemyOverrides.js';
import * as dlcDefiance from '../../DLC/Defiance/data/loreEnemyOverrides.js';
import * as dlcEccoTheDolphin from '../../DLC/EccoTheDolphin/data/loreEnemyOverrides.js';
import * as dlcEvilDead from '../../DLC/EvilDead/data/loreEnemyOverrides.js';
import * as dlcFlashback from '../../DLC/Flashback/data/loreEnemyOverrides.js';
import * as dlcGremlins from '../../DLC/Gremlins/data/loreEnemyOverrides.js';
import * as dlcH2G2 from '../../DLC/H2G2/data/loreEnemyOverrides.js';
import * as dlcJetSetRadio from '../../DLC/JetSetRadio/data/loreEnemyOverrides.js';
import * as dlcHeavyMetal2000 from '../../DLC/HeavyMetal2000/data/loreEnemyOverrides.js';
import * as dlcSharknado from '../../DLC/Sharknado/data/loreEnemyOverrides.js';
import * as dlcGodzillaTheAnimatedSeries from '../../DLC/GodzillaTheAnimatedSeries/data/loreEnemyOverrides.js';
import * as dlcPeeWee from '../../DLC/PeeWee/data/loreEnemyOverrides.js';
import * as dlcTheThing from '../../DLC/TheThing/data/loreEnemyOverrides.js';
import * as dlcKillerTomatoesFromOuterSpace from '../../DLC/KillerTomatoesFromOuterSpace/data/loreEnemyOverrides.js';
import * as dlcLostPlanet2 from '../../DLC/LostPlanet2/data/loreEnemyOverrides.js';
import * as dlcMarsAttacks from '../../DLC/MarsAttacks/data/loreEnemyOverrides.js';
import * as dlcMoonwalker from '../../DLC/Moonwalker/data/loreEnemyOverrides.js';
import * as dlcOverlordAnime from '../../DLC/OverlordAnime/data/loreEnemyOverrides.js';
import * as dlcPlaneteHurlante from '../../DLC/PlaneteHurlante/data/loreEnemyOverrides.js';
import * as dlcReAnimator from '../../DLC/ReAnimator/data/loreEnemyOverrides.js';
import * as dlcREC from '../../DLC/REC/data/loreEnemyOverrides.js';
import * as dlcRogerRabbit from '../../DLC/RogerRabbit/data/loreEnemyOverrides.js';
import * as dlcSCPFoundation from '../../DLC/SCPFoundation/data/loreEnemyOverrides.js';
import * as dlcSecretOfMonkeyIsland from '../../DLC/SecretOfMonkeyIsland/data/loreEnemyOverrides.js';
import * as dlcShaunOfTheDead from '../../DLC/ShaunOfTheDead/data/loreEnemyOverrides.js';
import * as dlcSinister from '../../DLC/Sinister/data/loreEnemyOverrides.js';
import * as dlcSplatterhouse from '../../DLC/Splatterhouse/data/loreEnemyOverrides.js';
import * as dlcSquidGame from '../../DLC/SquidGame/data/loreEnemyOverrides.js';
import * as dlcStarshipTroopers from '../../DLC/StarshipTroopers/data/loreEnemyOverrides.js';
import * as dlcStreetsOfRage from '../../DLC/StreetsOfRage/data/loreEnemyOverrides.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/loreEnemyOverrides.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/loreEnemyOverrides.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/loreEnemyOverrides.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/loreEnemyOverrides.js';
import * as dlcVoyageDeChihiro from '../../DLC/VoyageDeChihiro/data/loreEnemyOverrides.js';
import * as dlcZombiesAteMyNeighbors from '../../DLC/ZombiesAteMyNeighbors/data/loreEnemyOverrides.js';

export const LORE_ENEMY_FALLBACK_SLOTS = Object.freeze({
  RIFT_DRONE: "Rift Drone",
  BREACH_STALKER: "Breach Stalker",
  ANOMALY_PACK: "Anomaly Pack",
});

const {
  RIFT_DRONE,
  BREACH_STALKER,
  ANOMALY_PACK,
} = LORE_ENEMY_FALLBACK_SLOTS;

const SLOT_ORDER = Object.freeze([
  RIFT_DRONE,
  BREACH_STALKER,
  ANOMALY_PACK,
]);

const EMPTY_OVERRIDES = Object.freeze([]);

export const slugifyLoreEnemyAsset = (value) => {
  const slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "unknown";
};

const candidate = (
  fallbackSlot,
  name,
  weapon,
  special,
  loreFr,
  loreEn,
  referenceUrl,
  visualAnchor,
) => [
  fallbackSlot,
  name,
  weapon,
  special,
  loreFr,
  loreEn,
  referenceUrl,
  visualAnchor,
];

const buildSpritePrompt = (name, special, visualAnchor) => (
  `Pixel art sprite sheet 4x4, 256 px cells, three-quarter RPG view facing right. ${name}. ` +
  `${visualAnchor} Row 1 idle; row 2 movement; row 3 ${special}; row 4 hit reaction. ` +
  "Keep the same anatomy, colors and equipment in all 16 frames. " +
  "Full body centered, flat #00ff00 background, no text, shadow or crop."
);

const defineUniverse = (universe, candidates) => {
  const seenSlots = new Set();
  const universeSlug = slugifyLoreEnemyAsset(universe);

  const entries = candidates.map((source) => {
    const [
      fallbackSlot,
      name,
      weapon,
      special,
      loreFr,
      loreEn,
      referenceUrl,
      visualAnchor,
    ] = source;

    if (!SLOT_ORDER.includes(fallbackSlot)) {
      throw new Error(`Unknown lore enemy fallback slot: ${fallbackSlot}`);
    }
    if (seenSlots.has(fallbackSlot)) {
      throw new Error(`Duplicate lore enemy fallback slot for ${universe}: ${fallbackSlot}`);
    }
    if (
      !name ||
      !weapon ||
      !special ||
      !loreFr ||
      !loreEn ||
      !referenceUrl?.startsWith("https://") ||
      !visualAnchor
    ) {
      throw new Error(`Incomplete lore enemy override for ${universe}: ${name || fallbackSlot}`);
    }

    seenSlots.add(fallbackSlot);

    return Object.freeze({
      fallbackSlot,
      name,
      weapon,
      special,
      lore: Object.freeze({
        fr: loreFr,
        en: loreEn,
      }),
      referenceUrl,
      visualAnchor,
      spritePrompt: buildSpritePrompt(name, special, visualAnchor),
      output: `/sprites/generated/bosses/${universeSlug}/${slugifyLoreEnemyAsset(name)}.png`,
    });
  });

  entries.sort(
    (left, right) =>
      SLOT_ORDER.indexOf(left.fallbackSlot) - SLOT_ORDER.indexOf(right.fallbackSlot),
  );

  return Object.freeze(entries);
};

export const LORE_ENEMY_OVERRIDES = Object.freeze({
  "Altered Beast": dlcAlteredBeast.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Chicken Run": dlcChickenRun.createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }),

  Cloverfield: dlcCloverfield.createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }),

  Cthulhu: dlcCthulhu.createLoreEnemyOverrides({ ANOMALY_PACK, RIFT_DRONE, candidate, defineUniverse }),

  Dandadan: dlcDandadan.createLoreEnemyOverrides({ ANOMALY_PACK, RIFT_DRONE, candidate, defineUniverse }),

  Defiance: dlcDefiance.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Ecco the Dolphin": dlcEccoTheDolphin.createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Evil Dead": dlcEvilDead.createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  Flashback: dlcFlashback.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  Gremlins: dlcGremlins.createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  H2G2: dlcH2G2.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Jet Set Radio": dlcJetSetRadio.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Heavy Metal 2000": dlcHeavyMetal2000.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  Sharknado: dlcSharknado.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Godzilla The Animated Series": dlcGodzillaTheAnimatedSeries.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Pee-wee": dlcPeeWee.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "The Thing": dlcTheThing.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Killer Tomatoes from Outer Space": dlcKillerTomatoesFromOuterSpace.createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Lost Planet 2": dlcLostPlanet2.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Mars Attacks": dlcMarsAttacks.createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }),

  Moonwalker: dlcMoonwalker.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Overlord Anime": dlcOverlordAnime.createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Planete Hurlante": dlcPlaneteHurlante.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Re-Animator": dlcReAnimator.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  REC: dlcREC.createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }),

  "Roger Rabbit": dlcRogerRabbit.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "SCP Foundation": dlcSCPFoundation.createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Secret of Monkey Island": dlcSecretOfMonkeyIsland.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Shaun of the Dead": dlcShaunOfTheDead.createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }),

  Sinister: dlcSinister.createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }),

  Splatterhouse: dlcSplatterhouse.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Squid Game": dlcSquidGame.createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Starship Troopers": dlcStarshipTroopers.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Streets of Rage": dlcStreetsOfRage.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Team Fortress 2": dlcTeamFortress2.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "House of the Dead": dlcHouseOfTheDead.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "House of the Dead 2": dlcHouseOfTheDead2.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "House of the Dead 3": dlcHouseOfTheDead3.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),

  "Voyage de Chihiro": dlcVoyageDeChihiro.createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }),

  "Zombies Ate My Neighbors": dlcZombiesAteMyNeighbors.createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }),
});

export const getLoreEnemyOverrides = (universe) => (
  LORE_ENEMY_OVERRIDES[universe] ?? EMPTY_OVERRIDES
);

export const getLoreEnemyOverride = (universe, fallbackSlot) => (
  getLoreEnemyOverrides(universe).find((entry) => entry.fallbackSlot === fallbackSlot) ?? null
);
