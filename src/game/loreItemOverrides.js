// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcAlteredBeast from '../../DLC/AlteredBeast/data/loreItemOverrides.js';
import * as dlcCoolSpot from '../../DLC/CoolSpot/data/loreItemOverrides.js';
import * as dlcDynamiteDuke from '../../DLC/DynamiteDuke/data/loreItemOverrides.js';
import * as dlcEarthwormJim from '../../DLC/EarthwormJim/data/loreItemOverrides.js';
import * as dlcEccoTheDolphin from '../../DLC/EccoTheDolphin/data/loreItemOverrides.js';
import * as dlcFlashback from '../../DLC/Flashback/data/loreItemOverrides.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/loreItemOverrides.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/loreItemOverrides.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/loreItemOverrides.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/loreItemOverrides.js';
import * as dlcJetSetRadio from '../../DLC/JetSetRadio/data/loreItemOverrides.js';
import * as dlcLeft4Dead from '../../DLC/Left4Dead/data/loreItemOverrides.js';
import * as dlcLostPlanet2 from '../../DLC/LostPlanet2/data/loreItemOverrides.js';
import * as dlcRistar from '../../DLC/Ristar/data/loreItemOverrides.js';
import * as dlcSeaman from '../../DLC/Seaman/data/loreItemOverrides.js';
import * as dlcSecretOfMonkeyIsland from '../../DLC/SecretOfMonkeyIsland/data/loreItemOverrides.js';
import * as dlcSplatterhouse from '../../DLC/Splatterhouse/data/loreItemOverrides.js';
import * as dlcStreetsOfRage from '../../DLC/StreetsOfRage/data/loreItemOverrides.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/loreItemOverrides.js';
import * as dlcToySoldiers from '../../DLC/ToySoldiers/data/loreItemOverrides.js';
import * as dlcZombiesAteMyNeighbors from '../../DLC/ZombiesAteMyNeighbors/data/loreItemOverrides.js';
import * as dlcAnother from '../../DLC/Another/data/loreItemOverrides.js';
import * as dlcDandadan from '../../DLC/Dandadan/data/loreItemOverrides.js';
import * as dlcDragonBallZ from '../../DLC/DragonBallZ/data/loreItemOverrides.js';
import * as dlcFullmetalAlchemist from '../../DLC/FullmetalAlchemist/data/loreItemOverrides.js';
import * as dlcNeonGenesisEvangelion from '../../DLC/NeonGenesisEvangelion/data/loreItemOverrides.js';
import * as dlcNaruto from '../../DLC/Naruto/data/loreItemOverrides.js';
import * as dlcTokyoGhoul from '../../DLC/TokyoGhoul/data/loreItemOverrides.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/loreItemOverrides.js';
import * as dlcDigimonCelestialRift from '../../DLC/DigimonCelestialRift/data/loreItemOverrides.js';
import * as dlcGunnm from '../../DLC/Gunnm/data/loreItemOverrides.js';
import * as dlcOverlordAnime from '../../DLC/OverlordAnime/data/loreItemOverrides.js';
import * as dlcSpawn from '../../DLC/Spawn/data/loreItemOverrides.js';
import * as dlcTanyaTheEvil from '../../DLC/TanyaTheEvil/data/loreItemOverrides.js';
import * as dlcBabyCart from '../../DLC/BabyCart/data/loreItemOverrides.js';
import * as dlcBanlieue13 from '../../DLC/Banlieue13/data/loreItemOverrides.js';
import * as dlcBattleRoyale from '../../DLC/BattleRoyale/data/loreItemOverrides.js';
import * as dlcChappie from '../../DLC/Chappie/data/loreItemOverrides.js';
import * as dlcChickenRun from '../../DLC/ChickenRun/data/loreItemOverrides.js';
import * as dlcCloverfield from '../../DLC/Cloverfield/data/loreItemOverrides.js';
import * as dlcEvilDead from '../../DLC/EvilDead/data/loreItemOverrides.js';
import * as dlcGremlins from '../../DLC/Gremlins/data/loreItemOverrides.js';
import * as dlcH2G2 from '../../DLC/H2G2/data/loreItemOverrides.js';
import * as dlcHeavyMetal2000 from '../../DLC/HeavyMetal2000/data/loreItemOverrides.js';
import * as dlcHouseOf1000Corpses from '../../DLC/HouseOf1000Corpses/data/loreItemOverrides.js';
import * as dlcIronSky from '../../DLC/IronSky/data/loreItemOverrides.js';
import * as dlcKazaam from '../../DLC/Kazaam/data/loreItemOverrides.js';
import * as dlcKillerTomatoesFromOuterSpace from '../../DLC/KillerTomatoesFromOuterSpace/data/loreItemOverrides.js';
import * as dlcLaCiteDeLaPeur from '../../DLC/LaCiteDeLaPeur/data/loreItemOverrides.js';
import * as dlcLesTuche from '../../DLC/LesTuche/data/loreItemOverrides.js';
import * as dlcLesVisiteurs from '../../DLC/LesVisiteurs/data/loreItemOverrides.js';
import * as dlcMarsAttacks from '../../DLC/MarsAttacks/data/loreItemOverrides.js';
import * as dlcMeetTheFeebles from '../../DLC/MeetTheFeebles/data/loreItemOverrides.js';
import * as dlcMoonwalker from '../../DLC/Moonwalker/data/loreItemOverrides.js';
import * as dlcNecronomicon from '../../DLC/Necronomicon/data/loreItemOverrides.js';
import * as dlcPeeWee from '../../DLC/PeeWee/data/loreItemOverrides.js';
import * as dlcPlaneteHurlante from '../../DLC/PlaneteHurlante/data/loreItemOverrides.js';
import * as dlcPuppetMaster from '../../DLC/PuppetMaster/data/loreItemOverrides.js';
import * as dlcReAnimator from '../../DLC/ReAnimator/data/loreItemOverrides.js';
import * as dlcREC from '../../DLC/REC/data/loreItemOverrides.js';
import * as dlcRockyHorrorPictureShow from '../../DLC/RockyHorrorPictureShow/data/loreItemOverrides.js';
import * as dlcRogerRabbit from '../../DLC/RogerRabbit/data/loreItemOverrides.js';
import * as dlcRRRrrrr from '../../DLC/RRRrrrr/data/loreItemOverrides.js';
import * as dlcSharknado from '../../DLC/Sharknado/data/loreItemOverrides.js';
import * as dlcShaunOfTheDead from '../../DLC/ShaunOfTheDead/data/loreItemOverrides.js';
import * as dlcSinister from '../../DLC/Sinister/data/loreItemOverrides.js';
import * as dlcStarshipTroopers from '../../DLC/StarshipTroopers/data/loreItemOverrides.js';
import * as dlcTheCollector from '../../DLC/TheCollector/data/loreItemOverrides.js';
import * as dlcTheThing from '../../DLC/TheThing/data/loreItemOverrides.js';
import * as dlcVirus from '../../DLC/Virus/data/loreItemOverrides.js';
import * as dlcVoyageDeChihiro from '../../DLC/VoyageDeChihiro/data/loreItemOverrides.js';
import * as dlcWrongTurn from '../../DLC/WrongTurn/data/loreItemOverrides.js';
import * as dlcAmericanDad from '../../DLC/AmericanDad/data/loreItemOverrides.js';
import * as dlcCthulhu from '../../DLC/Cthulhu/data/loreItemOverrides.js';
import * as dlcDefiance from '../../DLC/Defiance/data/loreItemOverrides.js';
import * as dlcFamilyGuy from '../../DLC/FamilyGuy/data/loreItemOverrides.js';
import * as dlcFuturama from '../../DLC/Futurama/data/loreItemOverrides.js';
import * as dlcGodzillaTheAnimatedSeries from '../../DLC/GodzillaTheAnimatedSeries/data/loreItemOverrides.js';
import * as dlcLaCasaDePapel from '../../DLC/LaCasaDePapel/data/loreItemOverrides.js';
import * as dlcLesInconnus from '../../DLC/LesInconnus/data/loreItemOverrides.js';
import * as dlcMalcolmInTheMiddle from '../../DLC/MalcolmInTheMiddle/data/loreItemOverrides.js';
import * as dlcPingu from '../../DLC/Pingu/data/loreItemOverrides.js';
import * as dlcRugrats from '../../DLC/Rugrats/data/loreItemOverrides.js';
import * as dlcSCPFoundation from '../../DLC/SCPFoundation/data/loreItemOverrides.js';
import * as dlcSquidGame from '../../DLC/SquidGame/data/loreItemOverrides.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/loreItemOverrides.js';
import * as dlcAdo from '../../DLC/Ado/data/loreItemOverrides.js';
import * as dlcAtarashiiGakko from '../../DLC/AtarashiiGakko/data/loreItemOverrides.js';
import * as dlcBabymetal from '../../DLC/Babymetal/data/loreItemOverrides.js';
import * as dlcBandMaid from '../../DLC/BandMaid/data/loreItemOverrides.js';
import * as dlcBellaPoarch from '../../DLC/BellaPoarch/data/loreItemOverrides.js';
import * as dlcBigfloOli from '../../DLC/BigfloOli/data/loreItemOverrides.js';
import * as dlcBillieEilish from '../../DLC/BillieEilish/data/loreItemOverrides.js';
import * as dlcBlackEyedPeas from '../../DLC/BlackEyedPeas/data/loreItemOverrides.js';
import * as dlcBlackpink from '../../DLC/Blackpink/data/loreItemOverrides.js';
import * as dlcBringMeTheHorizon from '../../DLC/BringMeTheHorizon/data/loreItemOverrides.js';
import * as dlcDeadmau5 from '../../DLC/Deadmau5/data/loreItemOverrides.js';
import * as dlcDieAntwoord from '../../DLC/DieAntwoord/data/loreItemOverrides.js';
import * as dlcEminem from '../../DLC/Eminem/data/loreItemOverrides.js';
import * as dlcGhost from '../../DLC/Ghost/data/loreItemOverrides.js';
import * as dlcGorillaz from '../../DLC/Gorillaz/data/loreItemOverrides.js';
import * as dlcGunsNRoses from '../../DLC/GunsNRoses/data/loreItemOverrides.js';
import * as dlcHoshi from '../../DLC/Hoshi/data/loreItemOverrides.js';
import * as dlcIndila from '../../DLC/Indila/data/loreItemOverrides.js';
import * as dlcKorn from '../../DLC/Korn/data/loreItemOverrides.js';
import * as dlcKyaryPamyuPamyu from '../../DLC/KyaryPamyuPamyu/data/loreItemOverrides.js';
import * as dlcLadyGaga from '../../DLC/LadyGaga/data/loreItemOverrides.js';
import * as dlcLadybaby from '../../DLC/Ladybaby/data/loreItemOverrides.js';
import * as dlcLilNasX from '../../DLC/LilNasX/data/loreItemOverrides.js';
import * as dlcLinkinPark from '../../DLC/LinkinPark/data/loreItemOverrides.js';
import * as dlcManWithAMission from '../../DLC/ManWithAMission/data/loreItemOverrides.js';
import * as dlcMarilynManson from '../../DLC/MarilynManson/data/loreItemOverrides.js';
import * as dlcMichaelJackson from '../../DLC/MichaelJackson/data/loreItemOverrides.js';
import * as dlcNightwish from '../../DLC/Nightwish/data/loreItemOverrides.js';
import * as dlcPSY from '../../DLC/PSY/data/loreItemOverrides.js';
import * as dlcQueenBee from '../../DLC/QueenBee/data/loreItemOverrides.js';
import * as dlcShakaPonk from '../../DLC/ShakaPonk/data/loreItemOverrides.js';
import * as dlcShakira from '../../DLC/Shakira/data/loreItemOverrides.js';
import * as dlcSkrillex from '../../DLC/Skrillex/data/loreItemOverrides.js';
import * as dlcSubUrban from '../../DLC/SubUrban/data/loreItemOverrides.js';
import * as dlcTheWeeknd from '../../DLC/TheWeeknd/data/loreItemOverrides.js';
import * as dlcTommyHeavenly6 from '../../DLC/TommyHeavenly6/data/loreItemOverrides.js';
import * as dlcUltraVomit from '../../DLC/UltraVomit/data/loreItemOverrides.js';
import * as dlcWithinTemptation from '../../DLC/WithinTemptation/data/loreItemOverrides.js';
import * as dlcASMRZ from '../../DLC/ASMRZ/data/loreItemOverrides.js';
import * as dlcSpoofMovie from '../../DLC/SpoofMovie/data/loreItemOverrides.js';

const SLOT_DEFINITIONS = Object.freeze([
  Object.freeze({
    slot: "sigil",
    role: "offense",
    gameplayRole: Object.freeze({
      fr: "attaque ou interaction principale",
      en: "primary attack or interaction",
    }),
  }),
  Object.freeze({
    slot: "armor",
    role: "defense",
    gameplayRole: Object.freeze({
      fr: "defense, protection ou survie",
      en: "defense, protection or survival",
    }),
  }),
  Object.freeze({
    slot: "core",
    role: "tempo",
    gameplayRole: Object.freeze({
      fr: "mobilite, recharge, soin ou tempo",
      en: "mobility, recharge, healing or tempo",
    }),
  }),
  Object.freeze({
    slot: "event",
    role: "event",
    gameplayRole: Object.freeze({
      fr: "declenchement d un evenement propre a l univers",
      en: "trigger for a universe-specific event",
    }),
  }),
]);

const EXCLUDED_UNIVERSES = Object.freeze([
  "Tomba",
  "Woodruff",
  "Hellraiser",
  "A Nightmare on Elm Street",
  "The Ring",
  "The Grudge",
]);

const EMPTY_EQUIPMENT = Object.freeze([]);
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export const slugifyLoreItemAsset = (value) => {
  const slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "unknown";
};

const item = (nameEn, nameFr, visualAnchor) => Object.freeze({
  nameEn,
  nameFr,
  visualAnchor,
});

const pack = (universe, stem, referenceUrl, items) => Object.freeze({
  universe,
  stem,
  referenceUrl,
  items: Object.freeze(items),
});

const ACTIVE_PACK_SPECS = Object.freeze([
  // FG4 - games
  dlcAlteredBeast.createActivePackSpecs({ item, pack }),
  dlcCoolSpot.createActivePackSpecs({ item, pack }),
  dlcDynamiteDuke.createActivePackSpecs({ item, pack }),
  dlcEarthwormJim.createActivePackSpecs({ item, pack }),
  dlcEccoTheDolphin.createActivePackSpecs({ item, pack }),
  dlcFlashback.createActivePackSpecs({ item, pack }),
  dlcFinalFantasyVII.createActivePackSpecs({ item, pack }),
  dlcHouseOfTheDead.createActivePackSpecs({ item, pack }),
  dlcHouseOfTheDead2.createActivePackSpecs({ item, pack }),
  dlcHouseOfTheDead3.createActivePackSpecs({ item, pack }),
  dlcJetSetRadio.createActivePackSpecs({ item, pack }),
  dlcLeft4Dead.createActivePackSpecs({ item, pack }),
  dlcLostPlanet2.createActivePackSpecs({ item, pack }),
  dlcRistar.createActivePackSpecs({ item, pack }),
  dlcSeaman.createActivePackSpecs({ item, pack }),
  dlcSecretOfMonkeyIsland.createActivePackSpecs({ item, pack }),
  dlcSplatterhouse.createActivePackSpecs({ item, pack }),
  dlcStreetsOfRage.createActivePackSpecs({ item, pack }),
  dlcTeamFortress2.createActivePackSpecs({ item, pack }),
  dlcToySoldiers.createActivePackSpecs({ item, pack }),
  dlcZombiesAteMyNeighbors.createActivePackSpecs({ item, pack }),

  // FG4 - manga and animation
  dlcAnother.createActivePackSpecs({ item, pack }),
  dlcDandadan.createActivePackSpecs({ item, pack }),
  dlcDragonBallZ.createActivePackSpecs({ item, pack }),
  dlcFullmetalAlchemist.createActivePackSpecs({ item, pack }),
  dlcNeonGenesisEvangelion.createActivePackSpecs({ item, pack }),
  dlcNaruto.createActivePackSpecs({ item, pack }),
  dlcTokyoGhoul.createActivePackSpecs({ item, pack }),
  dlcSteinsGate.createActivePackSpecs({ item, pack }),
  dlcDigimonCelestialRift.createActivePackSpecs({ item, pack }),
  dlcGunnm.createActivePackSpecs({ item, pack }),
  dlcOverlordAnime.createActivePackSpecs({ item, pack }),
  dlcSpawn.createActivePackSpecs({ item, pack }),
  dlcTanyaTheEvil.createActivePackSpecs({ item, pack }),

  // FG4 - films
  dlcBabyCart.createActivePackSpecs({ item, pack }),
  dlcBanlieue13.createActivePackSpecs({ item, pack }),
  dlcBattleRoyale.createActivePackSpecs({ item, pack }),
  dlcChappie.createActivePackSpecs({ item, pack }),
  dlcChickenRun.createActivePackSpecs({ item, pack }),
  dlcCloverfield.createActivePackSpecs({ item, pack }),
  dlcEvilDead.createActivePackSpecs({ item, pack }),
  dlcGremlins.createActivePackSpecs({ item, pack }),
  dlcH2G2.createActivePackSpecs({ item, pack }),
  dlcHeavyMetal2000.createActivePackSpecs({ item, pack }),
  dlcHouseOf1000Corpses.createActivePackSpecs({ item, pack }),
  dlcIronSky.createActivePackSpecs({ item, pack }),
  dlcKazaam.createActivePackSpecs({ item, pack }),
  dlcKillerTomatoesFromOuterSpace.createActivePackSpecs({ item, pack }),
  dlcLaCiteDeLaPeur.createActivePackSpecs({ item, pack }),
  dlcLesTuche.createActivePackSpecs({ item, pack }),
  dlcLesVisiteurs.createActivePackSpecs({ item, pack }),
  dlcMarsAttacks.createActivePackSpecs({ item, pack }),
  dlcMeetTheFeebles.createActivePackSpecs({ item, pack }),
  dlcMoonwalker.createActivePackSpecs({ item, pack }),
  dlcNecronomicon.createActivePackSpecs({ item, pack }),
  dlcPeeWee.createActivePackSpecs({ item, pack }),
  dlcPlaneteHurlante.createActivePackSpecs({ item, pack }),
  dlcPuppetMaster.createActivePackSpecs({ item, pack }),
  dlcReAnimator.createActivePackSpecs({ item, pack }),
  dlcREC.createActivePackSpecs({ item, pack }),
  dlcRockyHorrorPictureShow.createActivePackSpecs({ item, pack }),
  dlcRogerRabbit.createActivePackSpecs({ item, pack }),
  dlcRRRrrrr.createActivePackSpecs({ item, pack }),
  dlcSharknado.createActivePackSpecs({ item, pack }),
  dlcShaunOfTheDead.createActivePackSpecs({ item, pack }),
  dlcSinister.createActivePackSpecs({ item, pack }),
  dlcStarshipTroopers.createActivePackSpecs({ item, pack }),
  dlcTheCollector.createActivePackSpecs({ item, pack }),
  dlcTheThing.createActivePackSpecs({ item, pack }),
  dlcVirus.createActivePackSpecs({ item, pack }),
  dlcVoyageDeChihiro.createActivePackSpecs({ item, pack }),
  dlcWrongTurn.createActivePackSpecs({ item, pack }),

  // FG4 - series and literature
  dlcAmericanDad.createActivePackSpecs({ item, pack }),
  dlcCthulhu.createActivePackSpecs({ item, pack }),
  dlcDefiance.createActivePackSpecs({ item, pack }),
  dlcFamilyGuy.createActivePackSpecs({ item, pack }),
  dlcFuturama.createActivePackSpecs({ item, pack }),
  dlcGodzillaTheAnimatedSeries.createActivePackSpecs({ item, pack }),
  dlcLaCasaDePapel.createActivePackSpecs({ item, pack }),
  dlcLesInconnus.createActivePackSpecs({ item, pack }),
  dlcMalcolmInTheMiddle.createActivePackSpecs({ item, pack }),
  dlcPingu.createActivePackSpecs({ item, pack }),
  dlcRugrats.createActivePackSpecs({ item, pack }),
  dlcSCPFoundation.createActivePackSpecs({ item, pack }),
  dlcSquidGame.createActivePackSpecs({ item, pack }),
  dlcTheSimpsons.createActivePackSpecs({ item, pack }),

  // FG4 - music
  dlcAdo.createActivePackSpecs({ item, pack }),
  dlcAtarashiiGakko.createActivePackSpecs({ item, pack }),
  dlcBabymetal.createActivePackSpecs({ item, pack }),
  dlcBandMaid.createActivePackSpecs({ item, pack }),
  dlcBellaPoarch.createActivePackSpecs({ item, pack }),
  dlcBigfloOli.createActivePackSpecs({ item, pack }),
  dlcBillieEilish.createActivePackSpecs({ item, pack }),
  dlcBlackEyedPeas.createActivePackSpecs({ item, pack }),
  dlcBlackpink.createActivePackSpecs({ item, pack }),
  dlcBringMeTheHorizon.createActivePackSpecs({ item, pack }),
  dlcDeadmau5.createActivePackSpecs({ item, pack }),
  dlcDieAntwoord.createActivePackSpecs({ item, pack }),
  dlcEminem.createActivePackSpecs({ item, pack }),
  dlcGhost.createActivePackSpecs({ item, pack }),
  dlcGorillaz.createActivePackSpecs({ item, pack }),
  dlcGunsNRoses.createActivePackSpecs({ item, pack }),
  dlcHoshi.createActivePackSpecs({ item, pack }),
  dlcIndila.createActivePackSpecs({ item, pack }),
  dlcKorn.createActivePackSpecs({ item, pack }),
  dlcKyaryPamyuPamyu.createActivePackSpecs({ item, pack }),
  dlcLadyGaga.createActivePackSpecs({ item, pack }),
  dlcLadybaby.createActivePackSpecs({ item, pack }),
  dlcLilNasX.createActivePackSpecs({ item, pack }),
  dlcLinkinPark.createActivePackSpecs({ item, pack }),
  dlcManWithAMission.createActivePackSpecs({ item, pack }),
  dlcMarilynManson.createActivePackSpecs({ item, pack }),
  dlcMichaelJackson.createActivePackSpecs({ item, pack }),
  dlcNightwish.createActivePackSpecs({ item, pack }),
  dlcPSY.createActivePackSpecs({ item, pack }),
  dlcQueenBee.createActivePackSpecs({ item, pack }),
  dlcShakaPonk.createActivePackSpecs({ item, pack }),
  dlcShakira.createActivePackSpecs({ item, pack }),
  dlcSkrillex.createActivePackSpecs({ item, pack }),
  dlcSubUrban.createActivePackSpecs({ item, pack }),
  dlcTheWeeknd.createActivePackSpecs({ item, pack }),
  dlcTommyHeavenly6.createActivePackSpecs({ item, pack }),
  dlcUltraVomit.createActivePackSpecs({ item, pack }),
  dlcWithinTemptation.createActivePackSpecs({ item, pack }),
  dlcASMRZ.createActivePackSpecs({ item, pack }),
  dlcSpoofMovie.createActivePackSpecs({ item, pack }),
]);

const DISABLED_POLICY_SPECS = Object.freeze([]);

const idsForStem = (stem) => Object.freeze({
  equipment: Object.freeze([
    `${stem}_sigil`,
    `${stem}_armor`,
    `${stem}_core`,
  ]),
  eventItem: `evt_${stem}_breach`,
});

const buildDescription = (universe, name, slotDefinition) => {
  const description = {
    fr: `${name.fr} est un objet physique emblematique de ${universe}. Sa silhouette et son usage canoniques sont conserves ; en jeu, il assure ${slotDefinition.gameplayRole.fr}.`,
    en: `${name.en} is an emblematic physical prop from ${universe}. Its canonical silhouette and use are preserved; in game, it provides ${slotDefinition.gameplayRole.en}.`,
  };

  return Object.freeze(description);
};

const buildIconPrompt = (universe, name, visualAnchor) => (
  `Original 512x512 RGBA pixel-art inventory icon. Exactly one physical object: ${name.en} from ${universe}. ` +
  `${visualAnchor} Three-quarter view from slightly above, complete object centered, source-accurate silhouette, ` +
  "proportions, materials and palette based on the cited visual reference without copying official artwork pixel for pixel. " +
  "Crisp pixel clusters, readable at small size, restrained contact shadow, transparent background. " +
  "No character, person, hand, duplicate object, environment, frame, watermark, copied logo or readable text."
);

const buildRuntimeItem = (
  universe,
  stem,
  referenceUrl,
  source,
  slotDefinition,
  index,
) => {
  const name = Object.freeze({
    fr: source.nameFr,
    en: source.nameEn,
  });
  const description = buildDescription(universe, name, slotDefinition);
  const prompt = buildIconPrompt(universe, name, source.visualAnchor);
  const id = slotDefinition.slot === "event"
    ? `evt_${stem}_breach`
    : `${stem}_${slotDefinition.slot}`;

  return Object.freeze({
    id,
    universe,
    kind: slotDefinition.slot === "event" ? "eventItem" : "equipment",
    slot: slotDefinition.slot,
    role: slotDefinition.role,
    gameplayRole: slotDefinition.gameplayRole,
    name,
    description,
    desc: description,
    referenceUrl,
    visualAnchor: source.visualAnchor,
    prompt,
    iconPrompt: prompt,
    icon: `/sprites/generated/items/${slugifyLoreItemAsset(universe)}/${slugifyLoreItemAsset(source.nameEn)}.png`,
    audit: Object.freeze({
      family: "FG4",
      priority: "P0",
      sourceIndex: index,
    }),
  });
};

const buildRuntimePack = (source) => {
  if (!source.referenceUrl.startsWith("https://")) {
    throw new Error(`Lore item reference must be an HTTPS URL: ${source.universe}`);
  }
  if (!/^[a-z0-9_]+$/.test(source.stem)) {
    throw new Error(`Invalid legacy item stem: ${source.universe} (${source.stem})`);
  }
  if (source.items.length !== SLOT_DEFINITIONS.length) {
    throw new Error(`Expected four lore items for ${source.universe}, received ${source.items.length}`);
  }

  const allItems = Object.freeze(source.items.map((entry, index) => {
    if (!entry.nameEn || !entry.nameFr || !entry.visualAnchor) {
      throw new Error(`Incomplete lore item source for ${source.universe} at index ${index}`);
    }

    return buildRuntimeItem(
      source.universe,
      source.stem,
      source.referenceUrl,
      entry,
      SLOT_DEFINITIONS[index],
      index,
    );
  }));

  return Object.freeze({
    universe: source.universe,
    legacyStem: source.stem,
    equipment: Object.freeze(allItems.slice(0, 3)),
    eventItem: allItems[3],
    allItems,
  });
};

export const LORE_ITEM_OVERRIDES = Object.freeze(Object.fromEntries(
  ACTIVE_PACK_SPECS.map((source) => [
    source.universe,
    buildRuntimePack(source),
  ]),
));

const enabledPolicies = ACTIVE_PACK_SPECS.map((source) => {
  const ids = idsForStem(source.stem);
  return [
    source.universe,
    Object.freeze({
      status: "enabled",
      source: "FG4_P0_confirmed",
      universe: source.universe,
      legacyStem: source.stem,
      equipmentIds: ids.equipment,
      eventItemId: ids.eventItem,
      expectedEquipment: 3,
      expectedEventItems: 1,
    }),
  ];
});

const disabledPolicies = DISABLED_POLICY_SPECS.map((source) => {
  const ids = idsForStem(source.stem);
  return [
    source.universe,
    Object.freeze({
      status: "disabled",
      source: "FG4_P0_blocked",
      universe: source.universe,
      legacyStem: source.stem,
      equipmentIds: ids.equipment,
      eventItemId: ids.eventItem,
      expectedEquipment: 0,
      expectedEventItems: 0,
      reason: source.reason,
    }),
  ];
});

export const LORE_ITEM_POLICIES = Object.freeze(Object.fromEntries([
  ...enabledPolicies,
  ...disabledPolicies,
]));

const validateRuntimeRegistry = () => {
  const activeUniverses = Object.keys(LORE_ITEM_OVERRIDES);
  const policyUniverses = Object.keys(LORE_ITEM_POLICIES);
  const seenIds = new Set();
  const seenIcons = new Set();

  if (activeUniverses.length !== 126) {
    throw new Error(`Expected 126 active FG4 item universes, received ${activeUniverses.length}`);
  }
  if (policyUniverses.length !== 126) {
    throw new Error(`Expected 126 FG4 item policies, received ${policyUniverses.length}`);
  }

  for (const excludedUniverse of EXCLUDED_UNIVERSES) {
    if (
      hasOwn(LORE_ITEM_OVERRIDES, excludedUniverse) ||
      hasOwn(LORE_ITEM_POLICIES, excludedUniverse)
    ) {
      throw new Error(`Excluded universe leaked into lore item registry: ${excludedUniverse}`);
    }
  }

  for (const universe of activeUniverses) {
    const override = LORE_ITEM_OVERRIDES[universe];
    const policy = LORE_ITEM_POLICIES[universe];
    const expectedIds = idsForStem(override.legacyStem);

    if (policy?.status !== "enabled") {
      throw new Error(`Missing enabled lore item policy for ${universe}`);
    }
    if (override.equipment.length !== 3 || override.allItems.length !== 4) {
      throw new Error(`Invalid lore item cardinality for ${universe}`);
    }

    const actualEquipmentIds = override.equipment.map((entry) => entry.id);
    if (
      actualEquipmentIds.some((id, index) => id !== expectedIds.equipment[index]) ||
      override.eventItem.id !== expectedIds.eventItem
    ) {
      throw new Error(`Legacy lore item IDs changed for ${universe}`);
    }

    for (const entry of override.allItems) {
      if (
        !entry.name.fr ||
        !entry.name.en ||
        !entry.description.fr ||
        !entry.description.en ||
        !entry.gameplayRole.fr ||
        !entry.gameplayRole.en ||
        !entry.referenceUrl.startsWith("https://") ||
        !entry.visualAnchor ||
        !entry.prompt
      ) {
        throw new Error(`Incomplete runtime lore item: ${universe}/${entry.id}`);
      }
      if (!/^\/sprites\/generated\/items\/[a-z0-9-]+\/[a-z0-9-]+\.png$/.test(entry.icon)) {
        throw new Error(`Invalid lore item icon path: ${entry.icon}`);
      }
      if (seenIds.has(entry.id)) {
        throw new Error(`Duplicate lore item ID: ${entry.id}`);
      }
      if (seenIcons.has(entry.icon)) {
        throw new Error(`Duplicate lore item icon path: ${entry.icon}`);
      }
      seenIds.add(entry.id);
      seenIcons.add(entry.icon);
    }
  }

  for (const source of DISABLED_POLICY_SPECS) {
    const policy = LORE_ITEM_POLICIES[source.universe];
    if (policy?.status !== "disabled") {
      throw new Error(`Missing disabled lore item policy for ${source.universe}`);
    }
    if (hasOwn(LORE_ITEM_OVERRIDES, source.universe)) {
      throw new Error(`Disabled universe must not expose invented items: ${source.universe}`);
    }
  }

  if (seenIds.size !== 504 || seenIcons.size !== 504) {
    throw new Error(
      `Expected 504 unique lore items and icons, received ${seenIds.size} IDs and ${seenIcons.size} icons`,
    );
  }
};

validateRuntimeRegistry();

export const getLoreItemOverrides = (universe) => (
  LORE_ITEM_OVERRIDES[universe] ?? null
);

export const getLoreItemPolicy = (universe) => (
  LORE_ITEM_POLICIES[universe] ?? null
);

export const getLoreEquipmentOverrides = (universe) => (
  getLoreItemOverrides(universe)?.equipment ?? EMPTY_EQUIPMENT
);

export const getLoreEventItemOverride = (universe) => (
  getLoreItemOverrides(universe)?.eventItem ?? null
);

export const getLoreItemOverride = (universe, id) => (
  getLoreItemOverrides(universe)?.allItems.find((entry) => entry.id === id) ?? null
);

export const isLoreItemUniverseEnabled = (universe) => (
  getLoreItemPolicy(universe)?.status === "enabled"
);
