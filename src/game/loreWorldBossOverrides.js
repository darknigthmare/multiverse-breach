// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcAlien from '../../DLC/Alien/data/loreWorldBossOverrides.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/loreWorldBossOverrides.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/loreWorldBossOverrides.js';
import * as dlcEccoTheDolphin from '../../DLC/EccoTheDolphin/data/loreWorldBossOverrides.js';
import * as dlcStargate from '../../DLC/Stargate/data/loreWorldBossOverrides.js';
import * as dlcPortal from '../../DLC/Portal/data/loreWorldBossOverrides.js';
import * as dlcYuGiOh from '../../DLC/YuGiOh/data/loreWorldBossOverrides.js';
import * as dlcBlazBlue from '../../DLC/BlazBlue/data/loreWorldBossOverrides.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/loreWorldBossOverrides.js';
import * as dlcFallout from '../../DLC/Fallout/data/loreWorldBossOverrides.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/loreWorldBossOverrides.js';
import * as dlcRickMorty from '../../DLC/RickMorty/data/loreWorldBossOverrides.js';
import * as dlcDigimon from '../../DLC/Digimon/data/loreWorldBossOverrides.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/loreWorldBossOverrides.js';
import * as dlcDiscworld from '../../DLC/Discworld/data/loreWorldBossOverrides.js';
import * as dlcTheBatmanWhoLaughs from '../../DLC/TheBatmanWhoLaughs/data/loreWorldBossOverrides.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/loreWorldBossOverrides.js';
import * as dlcPrometheus from '../../DLC/Prometheus/data/loreWorldBossOverrides.js';
import * as dlcAlienCovenant from '../../DLC/AlienCovenant/data/loreWorldBossOverrides.js';
import * as dlcAlienVsPredator from '../../DLC/AlienVsPredator/data/loreWorldBossOverrides.js';
import * as dlcAliensVsPredatorRequiem from '../../DLC/AliensVsPredatorRequiem/data/loreWorldBossOverrides.js';
import * as dlcDungeonMeshi from '../../DLC/DungeonMeshi/data/loreWorldBossOverrides.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/loreWorldBossOverrides.js';
import * as dlcBreakingBad from '../../DLC/BreakingBad/data/loreWorldBossOverrides.js';
import * as dlcAttackOnTitan from '../../DLC/AttackOnTitan/data/loreWorldBossOverrides.js';
import * as dlcCellsAtWork from '../../DLC/CellsAtWork/data/loreWorldBossOverrides.js';
import * as dlcToxicAvenger from '../../DLC/ToxicAvenger/data/loreWorldBossOverrides.js';
import * as dlcSausageParty from '../../DLC/SausageParty/data/loreWorldBossOverrides.js';
import * as dlcSpyXFamily from '../../DLC/SpyXFamily/data/loreWorldBossOverrides.js';
import * as dlcTenaciousD from '../../DLC/TenaciousD/data/loreWorldBossOverrides.js';
import * as dlcGhostbusters from '../../DLC/Ghostbusters/data/loreWorldBossOverrides.js';
import * as dlcTremors from '../../DLC/Tremors/data/loreWorldBossOverrides.js';
import * as dlcElvira from '../../DLC/Elvira/data/loreWorldBossOverrides.js';
import * as dlcPuppetMaster from '../../DLC/PuppetMaster/data/loreWorldBossOverrides.js';
import * as dlcBioShock from '../../DLC/BioShock/data/loreWorldBossOverrides.js';
import * as dlcTwistedMetal from '../../DLC/TwistedMetal/data/loreWorldBossOverrides.js';
import * as dlcFinalFantasyVIII from '../../DLC/FinalFantasyVIII/data/loreWorldBossOverrides.js';
import * as dlcTombRaider from '../../DLC/TombRaider/data/loreWorldBossOverrides.js';
import * as dlcTheLastOfUs from '../../DLC/TheLastOfUs/data/loreWorldBossOverrides.js';
import * as dlcLeft4Dead from '../../DLC/Left4Dead/data/loreWorldBossOverrides.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/loreWorldBossOverrides.js';
import * as dlcEarthwormJim from '../../DLC/EarthwormJim/data/loreWorldBossOverrides.js';
import * as dlcFlashback from '../../DLC/Flashback/data/loreWorldBossOverrides.js';
import * as dlcSplatterhouse from '../../DLC/Splatterhouse/data/loreWorldBossOverrides.js';
import * as dlcChainsawMan from '../../DLC/ChainsawMan/data/loreWorldBossOverrides.js';
import * as dlcElfenLied from '../../DLC/ElfenLied/data/loreWorldBossOverrides.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/loreWorldBossOverrides.js';
import * as dlcFinalFantasyXIII from '../../DLC/FinalFantasyXIII/data/loreWorldBossOverrides.js';
import * as dlcMetalGearRising from '../../DLC/MetalGearRising/data/loreWorldBossOverrides.js';
import * as dlcUnreal from '../../DLC/Unreal/data/loreWorldBossOverrides.js';
import * as dlcMadMaxFuryRoad from '../../DLC/MadMaxFuryRoad/data/loreWorldBossOverrides.js';
import * as dlcStargateUniverse from '../../DLC/StargateUniverse/data/loreWorldBossOverrides.js';
import * as dlcRichardAuPaysDesLivresMagiques from '../../DLC/RichardAuPaysDesLivresMagiques/data/loreWorldBossOverrides.js';
import * as dlcM3GAN from '../../DLC/M3GAN/data/loreWorldBossOverrides.js';
import * as dlcChickenRun from '../../DLC/ChickenRun/data/loreWorldBossOverrides.js';
import * as dlcGremlins from '../../DLC/Gremlins/data/loreWorldBossOverrides.js';
import * as dlcLittleBigPlanet from '../../DLC/LittleBigPlanet/data/loreWorldBossOverrides.js';
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/loreWorldBossOverrides.js';
import * as dlcHalo from '../../DLC/Halo/data/loreWorldBossOverrides.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/loreWorldBossOverrides.js';
import * as dlcDoom from '../../DLC/Doom/data/loreWorldBossOverrides.js';
import * as dlcAliens from '../../DLC/Aliens/data/loreWorldBossOverrides.js';
import * as dlcStargateAtlantis from '../../DLC/StargateAtlantis/data/loreWorldBossOverrides.js';
import * as dlcBorderlands from '../../DLC/Borderlands/data/loreWorldBossOverrides.js';
import * as dlcWarOfTheWorlds from '../../DLC/WarOfTheWorlds/data/loreWorldBossOverrides.js';
import * as dlcSkyline from '../../DLC/Skyline/data/loreWorldBossOverrides.js';
import * as dlcGodzilla from '../../DLC/Godzilla/data/loreWorldBossOverrides.js';
import * as dlcFullmetalAlchemist from '../../DLC/FullmetalAlchemist/data/loreWorldBossOverrides.js';
import * as dlcGantz from '../../DLC/Gantz/data/loreWorldBossOverrides.js';
import * as dlcSoloLeveling from '../../DLC/SoloLeveling/data/loreWorldBossOverrides.js';
import * as dlcTeenTitans from '../../DLC/TeenTitans/data/loreWorldBossOverrides.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/loreWorldBossOverrides.js';
import * as dlcCyberpunkEdgerunners from '../../DLC/CyberpunkEdgerunners/data/loreWorldBossOverrides.js';
import * as dlcDemonSlayer from '../../DLC/DemonSlayer/data/loreWorldBossOverrides.js';
import * as dlcParasyte from '../../DLC/Parasyte/data/loreWorldBossOverrides.js';
import * as dlcCowboyBebop from '../../DLC/CowboyBebop/data/loreWorldBossOverrides.js';
import * as dlcDragonBallZ from '../../DLC/DragonBallZ/data/loreWorldBossOverrides.js';
import * as dlcOnePunchMan from '../../DLC/OnePunchMan/data/loreWorldBossOverrides.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/loreWorldBossOverrides.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/loreWorldBossOverrides.js';
import * as dlcStarWars from '../../DLC/StarWars/data/loreWorldBossOverrides.js';
import * as dlcAlien3 from '../../DLC/Alien3/data/loreWorldBossOverrides.js';
import * as dlcAlienResurrection from '../../DLC/AlienResurrection/data/loreWorldBossOverrides.js';
import * as dlcAlienRomulus from '../../DLC/AlienRomulus/data/loreWorldBossOverrides.js';
import * as dlcPredator2 from '../../DLC/Predator2/data/loreWorldBossOverrides.js';
import * as dlcPredators from '../../DLC/Predators/data/loreWorldBossOverrides.js';
import * as dlcThePredator from '../../DLC/ThePredator/data/loreWorldBossOverrides.js';
import * as dlcPrey from '../../DLC/Prey/data/loreWorldBossOverrides.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/loreWorldBossOverrides.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/loreWorldBossOverrides.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/loreWorldBossOverrides.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/loreWorldBossOverrides.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/loreWorldBossOverrides.js';
import * as dlcSaw from '../../DLC/Saw/data/loreWorldBossOverrides.js';
import * as dlcDeathNote from '../../DLC/DeathNote/data/loreWorldBossOverrides.js';
import * as dlcFrom from '../../DLC/From/data/loreWorldBossOverrides.js';
import * as dlcUzumaki from '../../DLC/Uzumaki/data/loreWorldBossOverrides.js';
import * as dlcExit8 from '../../DLC/Exit8/data/loreWorldBossOverrides.js';
import * as dlcHellHouseLLC from '../../DLC/HellHouseLLC/data/loreWorldBossOverrides.js';
import * as dlcRepoTheGeneticOpera from '../../DLC/RepoTheGeneticOpera/data/loreWorldBossOverrides.js';
import * as dlcAnother from '../../DLC/Another/data/loreWorldBossOverrides.js';
import * as dlcVoyageDeChihiro from '../../DLC/VoyageDeChihiro/data/loreWorldBossOverrides.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/loreWorldBossOverrides.js';
import * as dlcZeroEscapeTheNonaryGames from '../../DLC/ZeroEscapeTheNonaryGames/data/loreWorldBossOverrides.js';
import * as dlcPsychoPass from '../../DLC/PsychoPass/data/loreWorldBossOverrides.js';
import * as dlcSpiderTheVideoGame from '../../DLC/SpiderTheVideoGame/data/loreWorldBossOverrides.js';
import * as dlcNeonGenesisEvangelion from '../../DLC/NeonGenesisEvangelion/data/loreWorldBossOverrides.js';
import * as dlcSpermageddon from '../../DLC/Spermageddon/data/loreWorldBossOverrides.js';
import * as dlcLesVisiteursDuFutur from '../../DLC/LesVisiteursDuFutur/data/loreWorldBossOverrides.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/loreWorldBossOverrides.js';
import * as dlcCoolSpot from '../../DLC/CoolSpot/data/loreWorldBossOverrides.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/loreWorldBossOverrides.js';
import * as dlcLaCiteDeLaPeur from '../../DLC/LaCiteDeLaPeur/data/loreWorldBossOverrides.js';
import * as dlcPingu from '../../DLC/Pingu/data/loreWorldBossOverrides.js';
import * as dlcSolarOpposites from '../../DLC/SolarOpposites/data/loreWorldBossOverrides.js';
import * as dlcSirenHead from '../../DLC/SirenHead/data/loreWorldBossOverrides.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/loreWorldBossOverrides.js';
import * as dlcRammstein from '../../DLC/Rammstein/data/loreWorldBossOverrides.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/loreWorldBossOverrides.js';
import * as dlcRobZombie from '../../DLC/RobZombie/data/loreWorldBossOverrides.js';
import * as dlcDaftPunk from '../../DLC/DaftPunk/data/loreWorldBossOverrides.js';
import * as dlcOliverTree from '../../DLC/OliverTree/data/loreWorldBossOverrides.js';
import * as dlcLinkinPark from '../../DLC/LinkinPark/data/loreWorldBossOverrides.js';
import * as dlcDieAntwoord from '../../DLC/DieAntwoord/data/loreWorldBossOverrides.js';
import * as dlcSkrillex from '../../DLC/Skrillex/data/loreWorldBossOverrides.js';
import * as dlcBellaPoarch from '../../DLC/BellaPoarch/data/loreWorldBossOverrides.js';
import * as dlcGunsNRoses from '../../DLC/GunsNRoses/data/loreWorldBossOverrides.js';
import * as dlcBandMaid from '../../DLC/BandMaid/data/loreWorldBossOverrides.js';
import * as dlcBringMeTheHorizon from '../../DLC/BringMeTheHorizon/data/loreWorldBossOverrides.js';
import * as dlcBlackpink from '../../DLC/Blackpink/data/loreWorldBossOverrides.js';
import * as dlcLilNasX from '../../DLC/LilNasX/data/loreWorldBossOverrides.js';
import * as dlcAtarashiiGakko from '../../DLC/AtarashiiGakko/data/loreWorldBossOverrides.js';
import * as dlcBabymetal from '../../DLC/Babymetal/data/loreWorldBossOverrides.js';
import * as dlcLadybaby from '../../DLC/Ladybaby/data/loreWorldBossOverrides.js';
import * as dlcBigfloOli from '../../DLC/BigfloOli/data/loreWorldBossOverrides.js';
import * as dlcLittleBig from '../../DLC/LittleBig/data/loreWorldBossOverrides.js';
import * as dlcHoshi from '../../DLC/Hoshi/data/loreWorldBossOverrides.js';
import * as dlcLadyGaga from '../../DLC/LadyGaga/data/loreWorldBossOverrides.js';
import * as dlcWithinTemptation from '../../DLC/WithinTemptation/data/loreWorldBossOverrides.js';
import * as dlcPSY from '../../DLC/PSY/data/loreWorldBossOverrides.js';
import * as dlcBlackEyedPeas from '../../DLC/BlackEyedPeas/data/loreWorldBossOverrides.js';
import * as dlcShakaPonk from '../../DLC/ShakaPonk/data/loreWorldBossOverrides.js';
import * as dlcShakira from '../../DLC/Shakira/data/loreWorldBossOverrides.js';
import * as dlcDeadmau5 from '../../DLC/Deadmau5/data/loreWorldBossOverrides.js';
import * as dlcKorn from '../../DLC/Korn/data/loreWorldBossOverrides.js';
import * as dlcAuralVampire from '../../DLC/AuralVampire/data/loreWorldBossOverrides.js';

const SOURCE_AUDIT = "world-bosses-lore-gap-audit-2026-07-17";

const EXCLUDED_UNIVERSES = Object.freeze([
  "Tomba",
  "Woodruff",
  "Hellraiser",
  "A Nightmare on Elm Street",
  "The Ring",
  "The Grudge",
]);

export const LORE_WORLD_BOSS_LAYOUTS = Object.freeze([
  "duelist",
  "large",
  "kaiju",
  "capitalShip",
  "cosmic",
  "stationary",
]);

export const LORE_WORLD_BOSS_POLICY_TYPES = Object.freeze([
  "nonCombatFinal",
  "stageSetpiece",
]);

const LAYOUT_DEFAULTS = Object.freeze({
  duelist: Object.freeze({
    renderHeight: 176,
    anchor: Object.freeze({ x: 0.78, y: 0.74 }),
    footprint: Object.freeze({ width: 1, height: 1, placement: "grid" }),
  }),
  large: Object.freeze({
    renderHeight: 252,
    anchor: Object.freeze({ x: 0.79, y: 0.75 }),
    footprint: Object.freeze({ width: 2, height: 2, placement: "grid" }),
  }),
  kaiju: Object.freeze({
    renderHeight: 500,
    anchor: Object.freeze({ x: 0.76, y: 0.78 }),
    footprint: Object.freeze({ width: 3, height: 3, placement: "edge" }),
  }),
  capitalShip: Object.freeze({
    renderHeight: 420,
    anchor: Object.freeze({ x: 0.66, y: 0.31 }),
    footprint: Object.freeze({ width: 0, height: 0, placement: "offGrid" }),
  }),
  cosmic: Object.freeze({
    renderHeight: 620,
    anchor: Object.freeze({ x: 0.5, y: 0.48 }),
    footprint: Object.freeze({ width: 0, height: 0, placement: "backdrop" }),
  }),
  stationary: Object.freeze({
    renderHeight: 304,
    anchor: Object.freeze({ x: 0.8, y: 0.71 }),
    footprint: Object.freeze({ width: 2, height: 2, placement: "anchored" }),
  }),
});

const EMPTY_REFERENCES = Object.freeze([]);

export const slugifyLoreWorldBossAsset = (value) => {
  const slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "unknown";
};

const phase = (id, ...attacks) => Object.freeze({
  id,
  attacks: Object.freeze(attacks),
});

const boss = (
  universe,
  legacyWorldBossId,
  name,
  layout,
  continuity,
  referenceUrl,
  visualAnchor,
  phases,
  tuning = {},
) => ({
  universe,
  legacyWorldBossId,
  name,
  layout,
  continuity,
  referenceUrl,
  visualAnchor,
  phases,
  tuning,
});

const finalPolicy = (
  universe,
  legacyWorldBossId,
  policy,
  continuity,
  objectiveFr,
  objectiveEn,
  reasonFr,
  reasonEn,
  referenceUrls,
  visualAnchor,
  finale = {},
) => ({
  universe,
  legacyWorldBossId,
  policy,
  continuity,
  objectiveFr,
  objectiveEn,
  reasonFr,
  reasonEn,
  referenceUrls,
  visualAnchor,
  finale,
});

const performancePolicy = (
  universe,
  legacyWorldBossId,
  referenceUrl,
  visualAnchor,
  continuity = `${universe} - official live-performance continuity`,
) => finalPolicy(
  universe,
  legacyWorldBossId,
  "nonCombatFinal",
  continuity,
  "Reussir le set final en maintenant le rythme, la securite de la scene et la participation du public.",
  "Complete the final set while maintaining rhythm, stage safety and audience participation.",
  "Cet univers musical ne possede aucun antagoniste canonique commun; transformer un titre, une scene ou une mascotte en creature serait invente.",
  "This music universe has no shared canonical antagonist; turning a song, stage or mascot into a creature would be invented.",
  [referenceUrl],
  visualAnchor,
  {
    fr: "Le rappel se declenche quand la performance collective est terminee sans incident, puis la scene passe a son etat final.",
    en: "The encore triggers when the full performance ends without incident, then the stage changes to its finale state.",
  },
);

const freezeContinuity = (label) => Object.freeze({
  id: slugifyLoreWorldBossAsset(label),
  label,
  status: "locked",
  source: SOURCE_AUDIT,
});

const freezeFootprint = (source) => Object.freeze({
  width: source.width,
  height: source.height,
  placement: source.placement,
});

const buildCombatPrompt = (entry, normalizedPhases) => {
  const phaseText = normalizedPhases
    .map((item) => `${item.id}: ${item.attacks.join(", ")}`)
    .join("; ");

  const formatByLayout = {
    duelist: "one full-body 4x4 animation sheet, 1024x1024, 256px cells",
    large: "one full-body 4x4 or 4x6 large-creature sheet with every appendage visible",
    kaiju: "a multipart 2048px or 4096px atlas with separate body, limbs, weak points and telegraphs",
    capitalShip: "a 4096x2048 multipart set-piece with hull, shields, hardpoints, reactor and damage states",
    cosmic: "a full-screen layered environmental atlas with manifestation, weak zones and phase masks",
    stationary: "a fixed-boss atlas with base, articulated parts, weak points and four damage states",
  };

  return [
    "Use case: stylized-concept.",
    "Create original highly detailed pixel art for a 2D RPG and Tactics game.",
    `Subject: ${entry.name} from ${entry.universe}.`,
    `Continuity lock: ${entry.continuity}.`,
    `Layout: ${entry.layout}; produce ${formatByLayout[entry.layout]}.`,
    `Visual lock: ${entry.visualAnchor}`,
    `Gameplay phases: ${phaseText}.`,
    "Use a three-quarter battle angle facing left unless the layout is arena-wide.",
    "Keep anatomy, costume, scale and equipment consistent between states.",
    "No copied frame, crossover equipment, Nexus armor, text, logo, watermark, border, cropped anatomy or duplicate subject.",
  ].join(" ");
};

const buildPolicyPrompt = (entry) => [
  "Use case: stylized-concept.",
  "Create an original highly detailed layered pixel-art kit for an interactive finale, not a combatant sprite.",
  `Universe: ${entry.universe}.`,
  `Continuity lock: ${entry.continuity}.`,
  `Policy: ${entry.policy}.`,
  `Visual lock: ${entry.visualAnchor}`,
  "Separate background, props, objective states, telegraphs, success state and failure state.",
  "Do not create a humanoid core, monster, hostile performer or other entity absent from the source.",
  "No copied frame, text, logo, watermark or baked-in UI.",
].join(" ");

const normalizeBoss = (entry) => {
  const defaults = LAYOUT_DEFAULTS[entry.layout];
  const renderHeight = entry.tuning.renderHeight ?? defaults?.renderHeight;
  const anchorSource = entry.tuning.anchor ?? defaults?.anchor;
  const footprintSource = entry.tuning.footprint ?? defaults?.footprint;
  const normalizedPhases = entry.phases.map((item) => Object.freeze({
    id: item.id,
    attacks: Object.freeze([...item.attacks]),
  }));

  return Object.freeze({
    type: "worldBoss",
    source: SOURCE_AUDIT,
    universe: entry.universe,
    legacyWorldBossId: entry.legacyWorldBossId,
    name: entry.name,
    layout: entry.layout,
    renderHeight,
    anchor: Object.freeze({ x: anchorSource.x, y: anchorSource.y }),
    tacticsFootprint: freezeFootprint(footprintSource),
    continuity: freezeContinuity(entry.continuity),
    phases: Object.freeze(normalizedPhases),
    lore: Object.freeze({
      fr: entry.tuning.loreFr
        ?? `${entry.name} est la culmination canonique retenue pour ${entry.continuity}.`,
      en: entry.tuning.loreEn
        ?? `${entry.name} is the canonical culmination selected for ${entry.continuity}.`,
    }),
    referenceUrl: entry.referenceUrl,
    visualAnchor: entry.visualAnchor,
    spritePrompt: buildCombatPrompt(entry, normalizedPhases),
    output: `/sprites/generated/bosses/${slugifyLoreWorldBossAsset(entry.universe)}/${slugifyLoreWorldBossAsset(entry.name)}.png`,
  });
};

const normalizePolicy = (entry) => {
  const defaultFinale = entry.policy === "nonCombatFinal"
    ? {
        fr: "La mission se termine par la resolution de l'objectif, sans barre de vie ni entite inventee.",
        en: "The mission ends when the objective is resolved, without a health bar or invented entity.",
      }
    : {
        fr: "La sequence se termine lorsque le set-piece est traverse ou neutralise, sans faux world boss.",
        en: "The sequence ends when the set piece is crossed or neutralized, without a fake world boss.",
      };

  return Object.freeze({
    type: "policy",
    source: SOURCE_AUDIT,
    universe: entry.universe,
    legacyWorldBossId: entry.legacyWorldBossId,
    policy: entry.policy,
    continuity: freezeContinuity(entry.continuity),
    objective: Object.freeze({ fr: entry.objectiveFr, en: entry.objectiveEn }),
    finale: Object.freeze({
      fr: entry.finale.fr ?? defaultFinale.fr,
      en: entry.finale.en ?? defaultFinale.en,
    }),
    reason: Object.freeze({ fr: entry.reasonFr, en: entry.reasonEn }),
    referenceUrls: Object.freeze([...entry.referenceUrls]),
    visualAnchor: entry.visualAnchor,
    assetPrompt: buildPolicyPrompt(entry),
    output: `/sprites/generated/finals/${slugifyLoreWorldBossAsset(entry.universe)}/${slugifyLoreWorldBossAsset(entry.policy)}.png`,
  });
};

const COMBAT_SPECS = Object.freeze([
  dlcAlien.createCombatSpecs({ boss, phase }),
  dlcSilentHill.createCombatSpecs({ boss, phase }),
  dlcTheMatrix.createCombatSpecs({ boss, phase }),
  dlcEccoTheDolphin.createCombatSpecs({ boss, phase }),
  dlcStargate.createCombatSpecs({ boss, phase }),
  dlcPortal.createCombatSpecs({ boss, phase }),
  dlcYuGiOh.createCombatSpecs({ boss, phase }),
  dlcBlazBlue.createCombatSpecs({ boss, phase }),
  dlcMassEffect.createCombatSpecs({ boss, phase }),
  dlcFallout.createCombatSpecs({ boss, phase }),
  dlcDeadSpace.createCombatSpecs({ boss, phase }),
  dlcRickMorty.createCombatSpecs({ boss, phase }),
  dlcDigimon.createCombatSpecs({ boss, phase }),
  dlcGhostInTheShell.createCombatSpecs({ boss, phase }),
  dlcDiscworld.createCombatSpecs({ boss, phase }),
  dlcTheBatmanWhoLaughs.createCombatSpecs({ boss, phase }),
  dlcKaamelott.createCombatSpecs({ boss, phase }),
  dlcPrometheus.createCombatSpecs({ boss, phase }),
  dlcAlienCovenant.createCombatSpecs({ boss, phase }),
  dlcAlienVsPredator.createCombatSpecs({ boss, phase }),
  dlcAliensVsPredatorRequiem.createCombatSpecs({ boss, phase }),
  dlcDungeonMeshi.createCombatSpecs({ boss, phase }),
  dlcHazbinHotel.createCombatSpecs({ boss, phase }),
  dlcBreakingBad.createCombatSpecs({ boss, phase }),
  dlcAttackOnTitan.createCombatSpecs({ boss, phase }),
  dlcCellsAtWork.createCombatSpecs({ boss, phase }),
  dlcToxicAvenger.createCombatSpecs({ boss, phase }),
  dlcSausageParty.createCombatSpecs({ boss, phase }),
  dlcSpyXFamily.createCombatSpecs({ boss, phase }),
  dlcTenaciousD.createCombatSpecs({ boss, phase }),
  dlcGhostbusters.createCombatSpecs({ boss, phase }),
  dlcTremors.createCombatSpecs({ boss, phase }),
  dlcElvira.createCombatSpecs({ boss, phase }),
  boss(
    "Planete Hurlante / Screamers",
    "planete-hurlante-autonomous-screamer-core",
    "David - Type 3 Screamer",
    "duelist",
    "Screamers (1995) - Sirius 6B",
    "https://en.wikipedia.org/wiki/Screamers_%281995_film%29",
    "The blond child disguise carrying a teddy bear, revealing compact industrial Screamer machinery and internal blades only during attack frames.",
    [
      phase("child-infiltration", "False surrender", "Close approach", "Teddy-bear lure"),
      phase("type-3-reveal", "Synthetic skin rupture", "Internal blade", "Factory activation"),
    ],
  ),
  boss(
    "Godzilla: The Series",
    "godzilla-the-animated-series-cyber-kaiju-mutation",
    "Cyber-Godzilla",
    "kaiju",
    "Godzilla: The Series - Monster Wars",
    "https://godzilla.fandom.com/wiki/Cyber_Godzilla",
    "The 1998 Godzilla silhouette resurrected with the animated series cybernetic torso, metal plating, red optics and mounted missiles.",
    [
      phase("cyber-command", "Missile barrage", "Cybernetic charge", "Tail sweep"),
      phase("damaged-plating", "Atomic breath", "Exposed reactor", "Control-signal break"),
    ],
  ),
  dlcPuppetMaster.createCombatSpecs({ boss, phase }),
  dlcBioShock.createCombatSpecs({ boss, phase }),
  dlcTwistedMetal.createCombatSpecs({ boss, phase }),
  dlcFinalFantasyVIII.createCombatSpecs({ boss, phase }),
  dlcTombRaider.createCombatSpecs({ boss, phase }),
  dlcTheLastOfUs.createCombatSpecs({ boss, phase }),
  dlcLeft4Dead.createCombatSpecs({ boss, phase }),
  dlcTeamFortress2.createCombatSpecs({ boss, phase }),
  dlcEarthwormJim.createCombatSpecs({ boss, phase }),
  dlcFlashback.createCombatSpecs({ boss, phase }),
  dlcSplatterhouse.createCombatSpecs({ boss, phase }),
  dlcChainsawMan.createCombatSpecs({ boss, phase }),
  dlcElfenLied.createCombatSpecs({ boss, phase }),
  dlcFinalFantasyVII.createCombatSpecs({ boss, phase }),
  dlcFinalFantasyXIII.createCombatSpecs({ boss, phase }),
  dlcMetalGearRising.createCombatSpecs({ boss, phase }),
  dlcUnreal.createCombatSpecs({ boss, phase }),
  dlcMadMaxFuryRoad.createCombatSpecs({ boss, phase }),
  dlcStargateUniverse.createCombatSpecs({ boss, phase }),
  dlcRichardAuPaysDesLivresMagiques.createCombatSpecs({ boss, phase }),
  dlcM3GAN.createCombatSpecs({ boss, phase }),
  boss(
    "Virus (1999)",
    "virus-alien-machine-intelligence",
    "Captain Everton Cyborg",
    "stationary",
    "Virus (1999) - Akademik Vladislav Volkov finale",
    "https://en.wikipedia.org/wiki/Virus_%281999_film%29",
    "Captain Everton's face and body integrated into the alien-built industrial cyborg, with cables, cranes, claws and ship weapons as separate parts.",
    [
      phase("engine-room-construct", "Tool-arm sweep", "Cable snare", "Electrical burst"),
      phase("volkov-destruction", "Part assimilation", "Core exposure", "Ship detonation"),
    ],
    { renderHeight: 350, footprint: { width: 3, height: 2, placement: "anchored" } },
  ),
  dlcChickenRun.createCombatSpecs({ boss, phase }),
  dlcGremlins.createCombatSpecs({ boss, phase }),
  boss(
    "Who Framed Roger Rabbit",
    "roger-rabbit-judge-doom-dip-machine",
    "Judge Doom",
    "duelist",
    "Who Framed Roger Rabbit (1988) - Acme warehouse",
    "https://disney.fandom.com/wiki/Judge_Doom",
    "Judge Doom in black coat, hat and glasses, then red Toon eyes and transforming Toon limbs; the Dip cannon stays a separate stage hazard.",
    [
      phase("human-disguise", "Cane sword", "Revolver shot", "Dip cannon command"),
      phase("toon-reveal", "Anvil fist", "Buzz-saw hand", "Dip dissolution"),
    ],
  ),
  dlcLittleBigPlanet.createCombatSpecs({ boss, phase }),
  dlcGearsOfWar.createCombatSpecs({ boss, phase }),
  dlcHalo.createCombatSpecs({ boss, phase }),
  dlcResidentEvil.createCombatSpecs({ boss, phase }),
  dlcDoom.createCombatSpecs({ boss, phase }),
  dlcAliens.createCombatSpecs({ boss, phase }),
  dlcStargateAtlantis.createCombatSpecs({ boss, phase }),
  dlcBorderlands.createCombatSpecs({ boss, phase }),
  dlcWarOfTheWorlds.createCombatSpecs({ boss, phase }),
  dlcSkyline.createCombatSpecs({ boss, phase }),
  dlcGodzilla.createCombatSpecs({ boss, phase }),
  dlcFullmetalAlchemist.createCombatSpecs({ boss, phase }),
  dlcGantz.createCombatSpecs({ boss, phase }),
  dlcSoloLeveling.createCombatSpecs({ boss, phase }),
  dlcTeenTitans.createCombatSpecs({ boss, phase }),
  dlcHalfLife.createCombatSpecs({ boss, phase }),
  dlcCyberpunkEdgerunners.createCombatSpecs({ boss, phase }),
  dlcDemonSlayer.createCombatSpecs({ boss, phase }),
  dlcParasyte.createCombatSpecs({ boss, phase }),
  dlcCowboyBebop.createCombatSpecs({ boss, phase }),
  dlcDragonBallZ.createCombatSpecs({ boss, phase }),
  dlcOnePunchMan.createCombatSpecs({ boss, phase }),
  dlcDinoCrisis.createCombatSpecs({ boss, phase }),
  dlcMetalGear.createCombatSpecs({ boss, phase }),
  dlcStarWars.createCombatSpecs({ boss, phase }),
  dlcAlien3.createCombatSpecs({ boss, phase }),
  dlcAlienResurrection.createCombatSpecs({ boss, phase }),
  dlcAlienRomulus.createCombatSpecs({ boss, phase }),
  dlcPredator2.createCombatSpecs({ boss, phase }),
  dlcPredators.createCombatSpecs({ boss, phase }),
  dlcThePredator.createCombatSpecs({ boss, phase }),
  dlcPrey.createCombatSpecs({ boss, phase }),
  dlcHouseOfTheDead.createCombatSpecs({ boss, phase }),
  dlcHouseOfTheDead2.createCombatSpecs({ boss, phase }),
  dlcHouseOfTheDead3.createCombatSpecs({ boss, phase }),
]);

const POLICY_SPECS = Object.freeze([
  dlcSlenderMan.createPolicySpecs({ finalPolicy }),
  dlcDigitalCircus.createPolicySpecs({ finalPolicy }),
  dlcSaw.createPolicySpecs({ finalPolicy }),
  dlcDeathNote.createPolicySpecs({ finalPolicy }),
  dlcFrom.createPolicySpecs({ finalPolicy }),
  dlcUzumaki.createPolicySpecs({ finalPolicy }),
  dlcExit8.createPolicySpecs({ finalPolicy }),
  dlcHellHouseLLC.createPolicySpecs({ finalPolicy }),
  dlcRepoTheGeneticOpera.createPolicySpecs({ finalPolicy }),
  dlcAnother.createPolicySpecs({ finalPolicy }),
  dlcVoyageDeChihiro.createPolicySpecs({ finalPolicy }),
  dlcSteinsGate.createPolicySpecs({ finalPolicy }),
  dlcZeroEscapeTheNonaryGames.createPolicySpecs({ finalPolicy }),
  dlcPsychoPass.createPolicySpecs({ finalPolicy }),
  dlcSpiderTheVideoGame.createPolicySpecs({ finalPolicy }),
  dlcNeonGenesisEvangelion.createPolicySpecs({ finalPolicy }),
  dlcSpermageddon.createPolicySpecs({ finalPolicy }),
  dlcLesVisiteursDuFutur.createPolicySpecs({ finalPolicy }),
  dlcTheSimpsons.createPolicySpecs({ finalPolicy }),
  dlcCoolSpot.createPolicySpecs({ finalPolicy }),
  dlcLeCinquiemeElement.createPolicySpecs({ finalPolicy }),
  dlcLaCiteDeLaPeur.createPolicySpecs({ finalPolicy }),
  dlcPingu.createPolicySpecs({ finalPolicy }),
  dlcSolarOpposites.createPolicySpecs({ finalPolicy }),
  dlcSirenHead.createPolicySpecs({ finalPolicy }),
  dlcVocaloid.createPolicySpecs({ performancePolicy }),
  dlcRammstein.createPolicySpecs({ performancePolicy }),
  dlcSystemOfADown.createPolicySpecs({ performancePolicy }),
  dlcRobZombie.createPolicySpecs({ performancePolicy }),
  dlcDaftPunk.createPolicySpecs({ performancePolicy }),
  dlcOliverTree.createPolicySpecs({ performancePolicy }),
  dlcLinkinPark.createPolicySpecs({ performancePolicy }),
  dlcDieAntwoord.createPolicySpecs({ performancePolicy }),
  dlcSkrillex.createPolicySpecs({ performancePolicy }),
  dlcBellaPoarch.createPolicySpecs({ performancePolicy }),
  dlcGunsNRoses.createPolicySpecs({ performancePolicy }),
  dlcBandMaid.createPolicySpecs({ performancePolicy }),
  dlcBringMeTheHorizon.createPolicySpecs({ performancePolicy }),
  dlcBlackpink.createPolicySpecs({ performancePolicy }),
  dlcLilNasX.createPolicySpecs({ performancePolicy }),
  dlcAtarashiiGakko.createPolicySpecs({ performancePolicy }),
  dlcBabymetal.createPolicySpecs({ performancePolicy }),
  dlcLadybaby.createPolicySpecs({ performancePolicy }),
  dlcBigfloOli.createPolicySpecs({ performancePolicy }),
  dlcLittleBig.createPolicySpecs({ performancePolicy }),
  dlcHoshi.createPolicySpecs({ performancePolicy }),
  dlcLadyGaga.createPolicySpecs({ performancePolicy }),
  dlcWithinTemptation.createPolicySpecs({ performancePolicy }),
  dlcPSY.createPolicySpecs({ performancePolicy }),
  dlcBlackEyedPeas.createPolicySpecs({ performancePolicy }),
  dlcShakaPonk.createPolicySpecs({ performancePolicy }),
  dlcShakira.createPolicySpecs({ performancePolicy }),
  dlcDeadmau5.createPolicySpecs({ performancePolicy }),
  dlcKorn.createPolicySpecs({ performancePolicy }),
  dlcAuralVampire.createPolicySpecs({ performancePolicy }),
]);

const NORMALIZED_COMBAT_ENTRIES = Object.freeze(COMBAT_SPECS.map(normalizeBoss));
const NORMALIZED_POLICY_ENTRIES = Object.freeze(POLICY_SPECS.map(normalizePolicy));

export const LORE_WORLD_BOSS_OVERRIDES = Object.freeze(Object.fromEntries(
  NORMALIZED_COMBAT_ENTRIES.map((entry) => [entry.universe, entry]),
));

export const LORE_WORLD_BOSS_POLICIES = Object.freeze(Object.fromEntries(
  NORMALIZED_POLICY_ENTRIES.map((entry) => [entry.universe, entry]),
));

const FOOTPRINT_PLACEMENTS = Object.freeze([
  "grid",
  "edge",
  "offGrid",
  "backdrop",
  "anchored",
]);

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isHttpsUrl = (value) => isNonEmptyString(value) && value.startsWith("https://");
const isNormalizedSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const invariant = (condition, message) => {
  if (!condition) {
    throw new Error(`[loreWorldBossOverrides] ${message}`);
  }
};

const validateLocalizedField = (value, label) => {
  invariant(value && typeof value === "object", `${label} must be an object`);
  invariant(isNonEmptyString(value.fr), `${label}.fr is required`);
  invariant(isNonEmptyString(value.en), `${label}.en is required`);
};

const validateContinuity = (value, universe) => {
  invariant(value && typeof value === "object", `${universe}: continuity is required`);
  invariant(isNormalizedSlug(value.id), `${universe}: invalid continuity.id`);
  invariant(isNonEmptyString(value.label), `${universe}: continuity.label is required`);
  invariant(value.status === "locked", `${universe}: continuity must be locked`);
  invariant(value.source === SOURCE_AUDIT, `${universe}: invalid continuity source`);
};

export const validateLoreWorldBossOverride = (universe, entry) => {
  invariant(isNonEmptyString(universe), "override universe key is required");
  invariant(entry && typeof entry === "object", `${universe}: override is required`);
  invariant(entry.type === "worldBoss", `${universe}: override.type must be worldBoss`);
  invariant(entry.source === SOURCE_AUDIT, `${universe}: invalid source`);
  invariant(entry.universe === universe, `${universe}: universe key mismatch`);
  invariant(isNonEmptyString(entry.legacyWorldBossId), `${universe}: legacyWorldBossId is required`);
  invariant(isNonEmptyString(entry.name), `${universe}: canonical name is required`);
  invariant(
    LORE_WORLD_BOSS_LAYOUTS.includes(entry.layout),
    `${universe}: unsupported layout ${entry.layout}`,
  );
  invariant(
    Number.isInteger(entry.renderHeight) && entry.renderHeight >= 96 && entry.renderHeight <= 1200,
    `${universe}: renderHeight must be an integer between 96 and 1200`,
  );
  invariant(entry.anchor && typeof entry.anchor === "object", `${universe}: anchor is required`);
  invariant(
    Number.isFinite(entry.anchor.x) && entry.anchor.x >= 0 && entry.anchor.x <= 1,
    `${universe}: anchor.x must be between 0 and 1`,
  );
  invariant(
    Number.isFinite(entry.anchor.y) && entry.anchor.y >= 0 && entry.anchor.y <= 1,
    `${universe}: anchor.y must be between 0 and 1`,
  );

  const footprint = entry.tacticsFootprint;
  invariant(footprint && typeof footprint === "object", `${universe}: tacticsFootprint is required`);
  invariant(
    Number.isInteger(footprint.width) && footprint.width >= 0 && footprint.width <= 8,
    `${universe}: invalid tacticsFootprint.width`,
  );
  invariant(
    Number.isInteger(footprint.height) && footprint.height >= 0 && footprint.height <= 8,
    `${universe}: invalid tacticsFootprint.height`,
  );
  invariant(
    FOOTPRINT_PLACEMENTS.includes(footprint.placement),
    `${universe}: invalid tacticsFootprint.placement`,
  );
  if (footprint.placement === "grid" || footprint.placement === "anchored") {
    invariant(
      footprint.width > 0 && footprint.height > 0,
      `${universe}: on-grid footprints must occupy at least one cell`,
    );
  }

  validateContinuity(entry.continuity, universe);
  invariant(Array.isArray(entry.phases) && entry.phases.length > 0, `${universe}: phases are required`);

  const phaseIds = new Set();
  for (const phaseEntry of entry.phases) {
    invariant(isNormalizedSlug(phaseEntry.id), `${universe}: invalid phase id ${phaseEntry.id}`);
    invariant(!phaseIds.has(phaseEntry.id), `${universe}: duplicate phase id ${phaseEntry.id}`);
    phaseIds.add(phaseEntry.id);
    invariant(
      Array.isArray(phaseEntry.attacks) && phaseEntry.attacks.length > 0,
      `${universe}/${phaseEntry.id}: attacks are required`,
    );
    invariant(
      phaseEntry.attacks.every(isNonEmptyString),
      `${universe}/${phaseEntry.id}: every attack must be named`,
    );
  }

  validateLocalizedField(entry.lore, `${universe}.lore`);
  invariant(isHttpsUrl(entry.referenceUrl), `${universe}: referenceUrl must use HTTPS`);
  invariant(isNonEmptyString(entry.visualAnchor), `${universe}: visualAnchor is required`);
  invariant(isNonEmptyString(entry.spritePrompt), `${universe}: spritePrompt is required`);

  const expectedOutput = `/sprites/generated/bosses/${slugifyLoreWorldBossAsset(universe)}/${slugifyLoreWorldBossAsset(entry.name)}.png`;
  invariant(entry.output === expectedOutput, `${universe}: non-deterministic boss output path`);

  return true;
};

export const validateLoreWorldBossPolicy = (universe, entry) => {
  invariant(isNonEmptyString(universe), "policy universe key is required");
  invariant(entry && typeof entry === "object", `${universe}: policy is required`);
  invariant(entry.type === "policy", `${universe}: policy.type must be policy`);
  invariant(entry.source === SOURCE_AUDIT, `${universe}: invalid source`);
  invariant(entry.universe === universe, `${universe}: universe key mismatch`);
  invariant(
    entry.legacyWorldBossId === null || isNonEmptyString(entry.legacyWorldBossId),
    `${universe}: legacyWorldBossId must be a string or null`,
  );
  invariant(
    LORE_WORLD_BOSS_POLICY_TYPES.includes(entry.policy),
    `${universe}: unsupported policy ${entry.policy}`,
  );

  validateContinuity(entry.continuity, universe);
  validateLocalizedField(entry.objective, `${universe}.objective`);
  validateLocalizedField(entry.finale, `${universe}.finale`);
  validateLocalizedField(entry.reason, `${universe}.reason`);
  invariant(
    Array.isArray(entry.referenceUrls) && entry.referenceUrls.length > 0,
    `${universe}: at least one reference URL is required`,
  );
  invariant(
    entry.referenceUrls.every(isHttpsUrl),
    `${universe}: every reference URL must use HTTPS`,
  );
  invariant(isNonEmptyString(entry.visualAnchor), `${universe}: visualAnchor is required`);
  invariant(isNonEmptyString(entry.assetPrompt), `${universe}: assetPrompt is required`);

  const expectedOutput = `/sprites/generated/finals/${slugifyLoreWorldBossAsset(universe)}/${slugifyLoreWorldBossAsset(entry.policy)}.png`;
  invariant(entry.output === expectedOutput, `${universe}: non-deterministic policy output path`);

  return true;
};

export const validateLoreWorldBossRegistries = () => {
  const combatUniverses = NORMALIZED_COMBAT_ENTRIES.map((entry) => entry.universe);
  const policyUniverses = NORMALIZED_POLICY_ENTRIES.map((entry) => entry.universe);
  const allEntries = [...NORMALIZED_COMBAT_ENTRIES, ...NORMALIZED_POLICY_ENTRIES];
  const seenUniverses = new Set();
  const seenLegacyIds = new Set();
  const seenContinuityIds = new Set();
  const seenOutputs = new Set();

  invariant(
    Object.keys(LORE_WORLD_BOSS_OVERRIDES).length === NORMALIZED_COMBAT_ENTRIES.length,
    "duplicate combat universe key detected",
  );
  invariant(
    Object.keys(LORE_WORLD_BOSS_POLICIES).length === NORMALIZED_POLICY_ENTRIES.length,
    "duplicate policy universe key detected",
  );

  for (const universe of combatUniverses) {
    validateLoreWorldBossOverride(universe, LORE_WORLD_BOSS_OVERRIDES[universe]);
  }
  for (const universe of policyUniverses) {
    validateLoreWorldBossPolicy(universe, LORE_WORLD_BOSS_POLICIES[universe]);
  }

  for (const entry of allEntries) {
    invariant(!seenUniverses.has(entry.universe), `${entry.universe}: combat/policy overlap`);
    seenUniverses.add(entry.universe);

    if (entry.legacyWorldBossId !== null) {
      invariant(
        !seenLegacyIds.has(entry.legacyWorldBossId),
        `duplicate legacy world-boss ID ${entry.legacyWorldBossId}`,
      );
      seenLegacyIds.add(entry.legacyWorldBossId);
    }

    invariant(
      !seenContinuityIds.has(entry.continuity.id),
      `duplicate continuity ID ${entry.continuity.id}`,
    );
    seenContinuityIds.add(entry.continuity.id);
    invariant(!seenOutputs.has(entry.output), `duplicate output path ${entry.output}`);
    seenOutputs.add(entry.output);
  }

  for (const excludedUniverse of EXCLUDED_UNIVERSES) {
    invariant(
      !hasOwn(LORE_WORLD_BOSS_OVERRIDES, excludedUniverse)
        && !hasOwn(LORE_WORLD_BOSS_POLICIES, excludedUniverse),
      `excluded universe leaked into this wave: ${excludedUniverse}`,
    );
  }

  invariant(
    seenOutputs.size === allEntries.length,
    `expected ${allEntries.length} unique outputs, received ${seenOutputs.size}`,
  );

  return Object.freeze({
    overrides: NORMALIZED_COMBAT_ENTRIES.length,
    policies: NORMALIZED_POLICY_ENTRIES.length,
    universes: seenUniverses.size,
    legacyIds: seenLegacyIds.size,
    outputs: seenOutputs.size,
    excludedUniverses: EXCLUDED_UNIVERSES.length,
  });
};

export const LORE_WORLD_BOSS_VALIDATION = validateLoreWorldBossRegistries();

export const getLoreWorldBossOverride = (universe) => (
  LORE_WORLD_BOSS_OVERRIDES[universe] ?? null
);

export const getLoreWorldBossPolicy = (universe) => (
  LORE_WORLD_BOSS_POLICIES[universe] ?? null
);

export const getLoreWorldBossResolution = (universe) => (
  getLoreWorldBossOverride(universe) ?? getLoreWorldBossPolicy(universe)
);

export const getLoreWorldBossReferenceUrls = (universe) => {
  const override = getLoreWorldBossOverride(universe);
  if (override) {
    return Object.freeze([override.referenceUrl]);
  }
  return getLoreWorldBossPolicy(universe)?.referenceUrls ?? EMPTY_REFERENCES;
};

export const hasLoreWorldBossOverride = (universe) => (
  hasOwn(LORE_WORLD_BOSS_OVERRIDES, universe)
);

export const hasLoreWorldBossPolicy = (universe) => (
  hasOwn(LORE_WORLD_BOSS_POLICIES, universe)
);
