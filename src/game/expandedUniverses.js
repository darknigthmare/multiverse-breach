// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcAvatarNavi from '../../DLC/AvatarNavi/data/expandedUniverses.js';
import * as dlcSkyline from '../../DLC/Skyline/data/expandedUniverses.js';
import * as dlcHappyWheels from '../../DLC/HappyWheels/data/expandedUniverses.js';
import * as dlcMarbleHornets from '../../DLC/MarbleHornets/data/expandedUniverses.js';
import * as dlcTheHorriblySlowMurderer from '../../DLC/TheHorriblySlowMurderer/data/expandedUniverses.js';
import * as dlcSartoriusStedimBiotech from '../../DLC/SartoriusStedimBiotech/data/expandedUniverses.js';
import * as dlcTrololo from '../../DLC/Trololo/data/expandedUniverses.js';
import * as dlcRickAstley from '../../DLC/RickAstley/data/expandedUniverses.js';
import * as dlcNyanCat from '../../DLC/NyanCat/data/expandedUniverses.js';
import * as dlcSCPFoundation from '../../DLC/SCPFoundation/data/expandedUniverses.js';
import * as dlcMrBean from '../../DLC/MrBean/data/expandedUniverses.js';
import * as dlcFamillePirate from '../../DLC/FamillePirate/data/expandedUniverses.js';
import * as dlcTelechat from '../../DLC/Telechat/data/expandedUniverses.js';
import * as dlcNicolasEtPimprenelle from '../../DLC/NicolasEtPimprenelle/data/expandedUniverses.js';
import * as dlcDeathNote from '../../DLC/DeathNote/data/expandedUniverses.js';
import * as dlcFrom from '../../DLC/From/data/expandedUniverses.js';
import * as dlcUzumaki from '../../DLC/Uzumaki/data/expandedUniverses.js';
import * as dlcExit8 from '../../DLC/Exit8/data/expandedUniverses.js';
import * as dlcHellHouseLLC from '../../DLC/HellHouseLLC/data/expandedUniverses.js';
import * as dlcSpermageddon from '../../DLC/Spermageddon/data/expandedUniverses.js';
import * as dlcRepoTheGeneticOpera from '../../DLC/RepoTheGeneticOpera/data/expandedUniverses.js';
import * as dlcAnother from '../../DLC/Another/data/expandedUniverses.js';
import * as dlcLaCiteDeLaPeur from '../../DLC/LaCiteDeLaPeur/data/expandedUniverses.js';
import * as dlcVoyageDeChihiro from '../../DLC/VoyageDeChihiro/data/expandedUniverses.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/expandedUniverses.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/expandedUniverses.js';
import * as dlcZeroEscapeTheNonaryGames from '../../DLC/ZeroEscapeTheNonaryGames/data/expandedUniverses.js';
import * as dlcPsychoPass from '../../DLC/PsychoPass/data/expandedUniverses.js';
import * as dlcSirenHead from '../../DLC/SirenHead/data/expandedUniverses.js';
import * as dlcSilentHillF from '../../DLC/SilentHillF/data/expandedUniverses.js';
import * as dlcTheLordOfTheRings from '../../DLC/TheLordOfTheRings/data/expandedUniverses.js';
import * as dlcTitanfall2 from '../../DLC/Titanfall2/data/expandedUniverses.js';
import * as dlcPiratesOfTheCaribbean from '../../DLC/PiratesOfTheCaribbean/data/expandedUniverses.js';
import * as dlcThem from '../../DLC/Them/data/expandedUniverses.js';
import * as dlcCyberpunk from '../../DLC/Cyberpunk/data/expandedUniverses.js';
import * as dlcTheCreator from '../../DLC/TheCreator/data/expandedUniverses.js';
import * as dlcDayOfTheDead from '../../DLC/DayOfTheDead/data/expandedUniverses.js';
import * as dlcNightOfTheLivingDead from '../../DLC/NightOfTheLivingDead/data/expandedUniverses.js';
import * as dlcLandOfTheDead from '../../DLC/LandOfTheDead/data/expandedUniverses.js';
import * as dlcZombi from '../../DLC/Zombi/data/expandedUniverses.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/expandedUniverses.js';
import * as dlcTerminator from '../../DLC/Terminator/data/expandedUniverses.js';
import * as dlcRoboCop from '../../DLC/RoboCop/data/expandedUniverses.js';
import * as dlcTheDarkKnight from '../../DLC/TheDarkKnight/data/expandedUniverses.js';
import * as dlcKillBill from '../../DLC/KillBill/data/expandedUniverses.js';
import * as dlcRocky from '../../DLC/Rocky/data/expandedUniverses.js';
import * as dlcRambo from '../../DLC/Rambo/data/expandedUniverses.js';
import * as dlcCommando from '../../DLC/Commando/data/expandedUniverses.js';
import * as dlcTheSilenceOfTheLambs from '../../DLC/TheSilenceOfTheLambs/data/expandedUniverses.js';
import * as dlcTheDaVinciCode from '../../DLC/TheDaVinciCode/data/expandedUniverses.js';
import * as dlcEvilDead2013 from '../../DLC/EvilDead2013/data/expandedUniverses.js';
import * as dlcAshVsEvilDead from '../../DLC/AshVsEvilDead/data/expandedUniverses.js';
import * as dlcZorro from '../../DLC/Zorro/data/expandedUniverses.js';
import * as dlcFantomas from '../../DLC/Fantomas/data/expandedUniverses.js';
import * as dlcMenInBlack from '../../DLC/MenInBlack/data/expandedUniverses.js';
import * as dlc28DaysLater from '../../DLC/28DaysLater/data/expandedUniverses.js';
import * as dlcHomeAlone from '../../DLC/HomeAlone/data/expandedUniverses.js';
import * as dlcLastActionHero from '../../DLC/LastActionHero/data/expandedUniverses.js';
import * as dlcMinions from '../../DLC/Minions/data/expandedUniverses.js';
import * as dlcLiloStitch from '../../DLC/LiloStitch/data/expandedUniverses.js';
import * as dlcBen10 from '../../DLC/Ben10/data/expandedUniverses.js';
import * as dlcSonic from '../../DLC/Sonic/data/expandedUniverses.js';
import * as dlcIceAge from '../../DLC/IceAge/data/expandedUniverses.js';
import * as dlcStanHelsing from '../../DLC/StanHelsing/data/expandedUniverses.js';
import * as dlcSuperheroMovie from '../../DLC/SuperheroMovie/data/expandedUniverses.js';
import * as dlcAssassinsCreed from '../../DLC/AssassinsCreed/data/expandedUniverses.js';
import * as dlcTheBigBangTheory from '../../DLC/TheBigBangTheory/data/expandedUniverses.js';
import * as dlcMinecraft from '../../DLC/Minecraft/data/expandedUniverses.js';
import * as dlcTheSmurfs from '../../DLC/TheSmurfs/data/expandedUniverses.js';
import * as dlcTintin from '../../DLC/Tintin/data/expandedUniverses.js';
import * as dlcAsterixObelix from '../../DLC/AsterixObelix/data/expandedUniverses.js';
import * as dlcZootopia from '../../DLC/Zootopia/data/expandedUniverses.js';
import * as dlcInsideOut from '../../DLC/InsideOut/data/expandedUniverses.js';
import * as dlcTheConjuring from '../../DLC/TheConjuring/data/expandedUniverses.js';
import * as dlcInsidious from '../../DLC/Insidious/data/expandedUniverses.js';
import * as dlcMadMaxFuryRoad from '../../DLC/MadMaxFuryRoad/data/expandedUniverses.js';
import * as dlcJohnWick from '../../DLC/JohnWick/data/expandedUniverses.js';
import * as dlcSpyKids from '../../DLC/SpyKids/data/expandedUniverses.js';
import * as dlcTheMummy from '../../DLC/TheMummy/data/expandedUniverses.js';
import * as dlcUniversalSoldier from '../../DLC/UniversalSoldier/data/expandedUniverses.js';
import * as dlcThePurge from '../../DLC/ThePurge/data/expandedUniverses.js';
import * as dlcTheExpendables from '../../DLC/TheExpendables/data/expandedUniverses.js';
import * as dlcBladeRunner from '../../DLC/BladeRunner/data/expandedUniverses.js';
import * as dlcGhostsOfMars from '../../DLC/GhostsOfMars/data/expandedUniverses.js';
import * as dlcSmallSoldiers from '../../DLC/SmallSoldiers/data/expandedUniverses.js';
import * as dlcHeartEyes from '../../DLC/HeartEyes/data/expandedUniverses.js';
import * as dlcDiscworld from '../../DLC/Discworld/data/expandedUniverses.js';
import * as dlcJokerNew52 from '../../DLC/JokerNew52/data/expandedUniverses.js';
import * as dlcTheBatmanWhoLaughs from '../../DLC/TheBatmanWhoLaughs/data/expandedUniverses.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/expandedUniverses.js';
import * as dlcPrometheus from '../../DLC/Prometheus/data/expandedUniverses.js';
import * as dlcAliens from '../../DLC/Aliens/data/expandedUniverses.js';
import * as dlcAlien3 from '../../DLC/Alien3/data/expandedUniverses.js';
import * as dlcAlienResurrection from '../../DLC/AlienResurrection/data/expandedUniverses.js';
import * as dlcAlienCovenant from '../../DLC/AlienCovenant/data/expandedUniverses.js';
import * as dlcAlienRomulus from '../../DLC/AlienRomulus/data/expandedUniverses.js';
import * as dlcPredator2 from '../../DLC/Predator2/data/expandedUniverses.js';
import * as dlcPredators from '../../DLC/Predators/data/expandedUniverses.js';
import * as dlcThePredator from '../../DLC/ThePredator/data/expandedUniverses.js';
import * as dlcPrey from '../../DLC/Prey/data/expandedUniverses.js';
import * as dlcPredatorKillerOfKillers from '../../DLC/PredatorKillerOfKillers/data/expandedUniverses.js';
import * as dlcPredatorBadlands from '../../DLC/PredatorBadlands/data/expandedUniverses.js';
import * as dlcAlienVsPredator from '../../DLC/AlienVsPredator/data/expandedUniverses.js';
import * as dlcAliensVsPredatorRequiem from '../../DLC/AliensVsPredatorRequiem/data/expandedUniverses.js';
import * as dlcDungeonMeshi from '../../DLC/DungeonMeshi/data/expandedUniverses.js';
import * as dlcNoob from '../../DLC/Noob/data/expandedUniverses.js';
import * as dlcRammstein from '../../DLC/Rammstein/data/expandedUniverses.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/expandedUniverses.js';
import * as dlcRobZombie from '../../DLC/RobZombie/data/expandedUniverses.js';
import * as dlcDaftPunk from '../../DLC/DaftPunk/data/expandedUniverses.js';
import * as dlcOliverTree from '../../DLC/OliverTree/data/expandedUniverses.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/expandedUniverses.js';
import * as dlcSplice from '../../DLC/Splice/data/expandedUniverses.js';
import * as dlcPoliceSquad from '../../DLC/PoliceSquad/data/expandedUniverses.js';
import * as dlcBreakingBad from '../../DLC/BreakingBad/data/expandedUniverses.js';
import * as dlcStargateAtlantis from '../../DLC/StargateAtlantis/data/expandedUniverses.js';
import * as dlcStargateUniverse from '../../DLC/StargateUniverse/data/expandedUniverses.js';
import * as dlcStargateInfinity from '../../DLC/StargateInfinity/data/expandedUniverses.js';
import * as dlcTheBraveLittleToaster from '../../DLC/TheBraveLittleToaster/data/expandedUniverses.js';
import * as dlcEvolution from '../../DLC/Evolution/data/expandedUniverses.js';
import * as dlcEvolutionTheAnimatedSeries from '../../DLC/EvolutionTheAnimatedSeries/data/expandedUniverses.js';
import * as dlcEarlyEdition from '../../DLC/EarlyEdition/data/expandedUniverses.js';
import * as dlcCharmed from '../../DLC/Charmed/data/expandedUniverses.js';
import * as dlcBuffyTheVampireSlayer from '../../DLC/BuffyTheVampireSlayer/data/expandedUniverses.js';
import * as dlcAttackOnTitan from '../../DLC/AttackOnTitan/data/expandedUniverses.js';
import * as dlcCellsAtWork from '../../DLC/CellsAtWork/data/expandedUniverses.js';
import * as dlcInuyashiki from '../../DLC/Inuyashiki/data/expandedUniverses.js';
import * as dlcBorderlands from '../../DLC/Borderlands/data/expandedUniverses.js';
import * as dlcVelociPastor from '../../DLC/VelociPastor/data/expandedUniverses.js';
import * as dlcRubber from '../../DLC/Rubber/data/expandedUniverses.js';
import * as dlcToxicAvenger from '../../DLC/ToxicAvenger/data/expandedUniverses.js';
import * as dlcSausageParty from '../../DLC/SausageParty/data/expandedUniverses.js';
import * as dlcSpyXFamily from '../../DLC/SpyXFamily/data/expandedUniverses.js';
import * as dlcTerrifier from '../../DLC/Terrifier/data/expandedUniverses.js';
import * as dlcZakEtCrysta from '../../DLC/ZakEtCrysta/data/expandedUniverses.js';
import * as dlcRichardAuPaysDesLivresMagiques from '../../DLC/RichardAuPaysDesLivresMagiques/data/expandedUniverses.js';
import * as dlcLesVisiteursDuFutur from '../../DLC/LesVisiteursDuFutur/data/expandedUniverses.js';
import * as dlcTenaciousD from '../../DLC/TenaciousD/data/expandedUniverses.js';
import * as dlcM3GAN from '../../DLC/M3GAN/data/expandedUniverses.js';
import * as dlcCameraCafe from '../../DLC/CameraCafe/data/expandedUniverses.js';
import * as dlcSamanthaOups from '../../DLC/SamanthaOups/data/expandedUniverses.js';
import * as dlcLesChevaliersDuFiel from '../../DLC/LesChevaliersDuFiel/data/expandedUniverses.js';
import * as dlcNoellePerna from '../../DLC/NoellePerna/data/expandedUniverses.js';
import * as dlcWarOfTheWorlds from '../../DLC/WarOfTheWorlds/data/expandedUniverses.js';
import * as dlcGhostbusters from '../../DLC/Ghostbusters/data/expandedUniverses.js';
import * as dlcOnechanbara from '../../DLC/Onechanbara/data/expandedUniverses.js';
import * as dlcKungPow from '../../DLC/KungPow/data/expandedUniverses.js';
import * as dlcDespicer from '../../DLC/Despicer/data/expandedUniverses.js';
import * as dlcHowToMakeAMonster from '../../DLC/HowToMakeAMonster/data/expandedUniverses.js';
import * as dlcTremors from '../../DLC/Tremors/data/expandedUniverses.js';
import * as dlcElvira from '../../DLC/Elvira/data/expandedUniverses.js';
import * as dlcTheRing from '../../DLC/TheRing/data/expandedUniverses.js';
import * as dlcTheGrudge from '../../DLC/TheGrudge/data/expandedUniverses.js';

import { FEATURED_ENEMY_LORE, FEATURED_GEAR_LORE, FEATURED_STAGE_LORE, FEATURED_UNIVERSE_PACKS } from './featuredUniversePacks.js';
import { LORE_BOSS_OVERRIDES, LORE_BOSS_SLOT_POLICY } from './loreBossOverrides.js';
import { getLoreEnemyOverrides } from './loreEnemyOverrides.js';
import {
  getLoreEquipmentOverrides,
  getLoreEventItemOverride,
  getLoreItemPolicy
} from './loreItemOverrides.js';
import {
  getLoreWorldBossOverride,
  getLoreWorldBossPolicy
} from './loreWorldBossOverrides.js';
import { REQUESTED_UNIVERSE_WAVE } from './requestedUniverseWave.js';
import { CANON_ROSTER_WAVE } from './canonRosterWave.js';
import {
  getStageLoreAssetPlan,
  getStageLoreProfile
} from './stageLoreProfiles.js';
import { OC_DLC_UNIVERSES } from './ocDlcPacks.js';
import { getGearShopVisualMetadata } from './gearShopVisualContracts.js';
import { ORIGINAL_UNIVERSE_WAVE } from './originalUniverseWave.js';
import { CANON_BLACK_PEARL_SOURCE_KITS } from './canonBlackPearlSourceKits.js';
import {
  inferNonCombatTrial,
  makeNonCombatPolicyFromThreat
} from './nonCombatTrial.js';

const EXPANDED_STAGE_START_ID = 39;

// Explicit migration list for legacy rosters that represented hazards,
// puzzles, pursuits, containment objectives or comic rivals as combatants.
// True antagonists that are meant to be fought are intentionally absent.
const LEGACY_NON_COMBAT_TRIAL_ROUTES = Object.freeze([
  dlcAvatarNavi.createLegacyNonCombatTrialRoutes(),
  dlcAvatarNavi.createLegacyNonCombatTrialRoutes2(),
  dlcSkyline.createLegacyNonCombatTrialRoutes(),
  dlcSkyline.createLegacyNonCombatTrialRoutes2(),
  dlcSkyline.createLegacyNonCombatTrialRoutes3(),
  dlcHappyWheels.createLegacyNonCombatTrialRoutes(),
  dlcMarbleHornets.createLegacyNonCombatTrialRoutes(),
  dlcMarbleHornets.createLegacyNonCombatTrialRoutes2(),
  dlcTheHorriblySlowMurderer.createLegacyNonCombatTrialRoutes(),
  dlcSartoriusStedimBiotech.createLegacyNonCombatTrialRoutes(),
  dlcTrololo.createLegacyNonCombatTrialRoutes(),
  dlcRickAstley.createLegacyNonCombatTrialRoutes(),
  dlcRickAstley.createLegacyNonCombatTrialRoutes2(),
  dlcNyanCat.createLegacyNonCombatTrialRoutes(),
  dlcSCPFoundation.createLegacyNonCombatTrialRoutes(),
  dlcMrBean.createLegacyNonCombatTrialRoutes(),
  dlcFamillePirate.createLegacyNonCombatTrialRoutes(),
  dlcTelechat.createLegacyNonCombatTrialRoutes(),
  dlcNicolasEtPimprenelle.createLegacyNonCombatTrialRoutes(),
  dlcNicolasEtPimprenelle.createLegacyNonCombatTrialRoutes2()
]);

const LEGACY_NON_COMBAT_TRIAL_TYPE_BY_ID = new Map(
  LEGACY_NON_COMBAT_TRIAL_ROUTES.flatMap(([universe, type, ids]) => (
    ids.map(id => [`${universe}:${id}`, type])
  ))
);

// Older waves often stored a prop, victim, clue, hazard or abstract system as
// a plain string, so it could not carry the `nonCombat` marker used by the new
// canon sheets. Keep this list explicit: genuine antagonists in mixed
// universes remain combatants, while only the named non-enemies become trials.
const LEGACY_NON_COMBAT_TRIAL_NAME_ROUTES = Object.freeze([
  dlcDeathNote.createLegacyNonCombatTrialNameRoutes(),
  dlcFrom.createLegacyNonCombatTrialNameRoutes(),
  dlcFrom.createLegacyNonCombatTrialNameRoutes2(),
  dlcUzumaki.createLegacyNonCombatTrialNameRoutes(),
  dlcUzumaki.createLegacyNonCombatTrialNameRoutes2(),
  dlcUzumaki.createLegacyNonCombatTrialNameRoutes3(),
  dlcExit8.createLegacyNonCombatTrialNameRoutes(),
  dlcExit8.createLegacyNonCombatTrialNameRoutes2(),
  dlcHellHouseLLC.createLegacyNonCombatTrialNameRoutes(),
  dlcHellHouseLLC.createLegacyNonCombatTrialNameRoutes2(),
  dlcSpermageddon.createLegacyNonCombatTrialNameRoutes(),
  dlcRepoTheGeneticOpera.createLegacyNonCombatTrialNameRoutes(),
  dlcRepoTheGeneticOpera.createLegacyNonCombatTrialNameRoutes2(),
  dlcRepoTheGeneticOpera.createLegacyNonCombatTrialNameRoutes3(),
  dlcAnother.createLegacyNonCombatTrialNameRoutes(),
  dlcLaCiteDeLaPeur.createLegacyNonCombatTrialNameRoutes(),
  dlcVoyageDeChihiro.createLegacyNonCombatTrialNameRoutes(),
  dlcVoyageDeChihiro.createLegacyNonCombatTrialNameRoutes2(),
  dlcTheSimpsons.createLegacyNonCombatTrialNameRoutes(),
  dlcSteinsGate.createLegacyNonCombatTrialNameRoutes(),
  dlcSteinsGate.createLegacyNonCombatTrialNameRoutes2(),
  dlcZeroEscapeTheNonaryGames.createLegacyNonCombatTrialNameRoutes(),
  dlcZeroEscapeTheNonaryGames.createLegacyNonCombatTrialNameRoutes2(),
  dlcZeroEscapeTheNonaryGames.createLegacyNonCombatTrialNameRoutes3(),
  dlcPsychoPass.createLegacyNonCombatTrialNameRoutes(),
  dlcSirenHead.createLegacyNonCombatTrialNameRoutes(),
  dlcSirenHead.createLegacyNonCombatTrialNameRoutes2()
]);

const normalizeLegacyTrialName = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const dedupeThreatsByName = threats => {
  const seen = new Set();
  return [...(threats || [])].reverse().filter(threat => {
    const key = normalizeLegacyTrialName(threatName(threat));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).reverse();
};

// A combatant has one authoritative role in a universe. World bosses outrank
// local bosses, local bosses outrank regular enemies, and objective encounters
// outrank every combat role. This keeps legacy names stable while preventing a
// single subject from owning several sprite-catalog identities.
const enforceThreatRolePrecedence = universe => {
  const encounterNames = new Set((universe.encounters || [])
    .map(encounter => normalizeLegacyTrialName(encounter.name))
    .filter(Boolean));
  const worldBossName = normalizeLegacyTrialName(threatName(universe.worldBoss));
  const bosses = dedupeThreatsByName(universe.bosses).filter(boss => {
    const name = normalizeLegacyTrialName(threatName(boss));
    return name && name !== worldBossName && !encounterNames.has(name);
  });
  const bossNames = new Set(bosses.map(boss => normalizeLegacyTrialName(threatName(boss))));
  const monsters = dedupeThreatsByName(universe.monsters).filter(monster => {
    const name = normalizeLegacyTrialName(threatName(monster));
    return name
      && name !== worldBossName
      && !bossNames.has(name)
      && !encounterNames.has(name);
  });

  return { monsters, bosses };
};

const LEGACY_NON_COMBAT_TRIAL_TYPE_BY_NAME = new Map(
  LEGACY_NON_COMBAT_TRIAL_NAME_ROUTES.flatMap(([universe, type, names]) => (
    names.map(name => [`${universe}:${normalizeLegacyTrialName(name)}`, type])
  ))
);

const LORE_WORLD_BOSS_POLICY_UNIVERSE_ALIASES = Object.freeze({
  'Digital Circus': 'The Amazing Digital Circus',
  'Le Cinquième Element': 'Le Cinquieme Element',
  'Guns N Roses': "Guns N' Roses",
  'Atarashii Gakko': 'Atarashii Gakko!'
});

const POLICY_ONLY_CLEAR_COMBAT_UNIVERSES = new Set([
  'Vocaloid',
  'Slender Man',
  'Digital Circus',
  'The Amazing Digital Circus',
  'Death Note',
  'Exit 8',
  'Hell House LLC',
  'Spermageddon',
  'Another',
  'Pingu',
  'La Cite de la Peur',
  'Cool Spot',
  'Zero Escape: The Nonary Games',
  'Siren Head'
]);

export const shouldClearCombatRosterForPolicy = universe => (
  POLICY_ONLY_CLEAR_COMBAT_UNIVERSES.has(universe)
  || POLICY_ONLY_CLEAR_COMBAT_UNIVERSES.has(LORE_WORLD_BOSS_POLICY_UNIVERSE_ALIASES[universe])
);

export const getResolvedLoreWorldBossPolicy = universe => (
  getLoreWorldBossPolicy(universe)
  || getLoreWorldBossPolicy(LORE_WORLD_BOSS_POLICY_UNIVERSE_ALIASES[universe])
  || null
);

const GENERATED_ITEM_OVERRIDE_KEYS = new Set([
  'dragon_ball_z',
  'evangelion',
  'fullmetal_alchemist',
  'naruto',
  'steins_gate',
  'tokyo_ghoul'
]);

const REQUESTED_UNIVERSE_WAVE_WITHOUT_LEGACY_ITEMS = REQUESTED_UNIVERSE_WAVE.map(entry => {
  if (!GENERATED_ITEM_OVERRIDE_KEYS.has(entry.key)) return entry;

  const entryWithoutLegacyItems = { ...entry };
  delete entryWithoutLegacyItems.gear;
  delete entryWithoutLegacyItems.event;
  return entryWithoutLegacyItems;
});

const modeReward = {
  RPG: { gold: 125, shards: 38 },
  Tactics: { gold: 135, shards: 40 },
  Smash: { gold: 120, shards: 36 }
};

const difficultyScale = {
  Medium: 0,
  Hard: 1,
  'Very Hard': 2,
  Expert: 3
};

function defineCanonicalUniverse({
  key,
  universe,
  mediaType,
  faction,
  mode,
  difficulty,
  titleFr = universe,
  stage,
  boss,
  worldBoss = boss,
  cast,
  enemies,
  bosses,
  gear,
  event,
  origin,
  breach,
  motif,
  colors,
  stageMeta,
  stageVariants = []
}) {
  const boosts = [
    { atk: 8, spd: 1 },
    { def: 6, hp: 45 },
    { hp: 70, atk: 4 }
  ];

  return {
    key,
    universe,
    mediaType,
    faction,
    mode,
    difficulty,
    titleFr,
    stage,
    boss,
    worldBoss,
    hero: cast[0],
    allies: cast.slice(1),
    monsters: enemies,
    bosses,
    gear: gear.map(([itemKey, enName, frName, metadata], index) => ([
      `${key}_${itemKey}`,
      enName,
      frName,
      boosts[index % boosts.length],
      ...(metadata ? [metadata] : [])
    ])),
    event: [`evt_${key}_${event[0]}`, ...event.slice(1)],
    desc: {
      en: `${origin[0]} In Multiverse Breach, ${breach[0]}`,
      fr: `${origin[1]} Dans Multiverse Breach, ${breach[1]}`
    },
    theme: `${origin[0]} ${breach[0]}`,
    motif,
    colors,
    ...(stageMeta ? { stageMeta } : {}),
    stageVariants
  };
}

const CANONICAL_REQUESTED_UNIVERSE_WAVE = [
  dlcSilentHillF.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheLordOfTheRings.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTitanfall2.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcPiratesOfTheCaribbean.createCanonicalRequestedUniverseWave({ CANON_BLACK_PEARL_SOURCE_KITS, defineCanonicalUniverse }),
  dlcThem.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcCyberpunk.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheCreator.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcDayOfTheDead.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcNightOfTheLivingDead.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcLandOfTheDead.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcZombi.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcHarryPotter.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTerminator.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcRoboCop.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheDarkKnight.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcKillBill.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcRocky.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcRambo.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcCommando.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheSilenceOfTheLambs.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheDaVinciCode.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcEvilDead2013.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcAshVsEvilDead.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcZorro.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcFantomas.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcMenInBlack.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlc28DaysLater.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcHomeAlone.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcLastActionHero.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcMinions.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcLiloStitch.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcBen10.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcSonic.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcAvatarNavi.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcIceAge.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcStanHelsing.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcSuperheroMovie.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcAssassinsCreed.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheBigBangTheory.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcMinecraft.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheSmurfs.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTintin.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcAsterixObelix.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcZootopia.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcInsideOut.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheConjuring.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcInsidious.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcMadMaxFuryRoad.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcJohnWick.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcSpyKids.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheMummy.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcUniversalSoldier.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcThePurge.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcTheExpendables.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcBladeRunner.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcGhostsOfMars.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcSmallSoldiers.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }),
  dlcHeartEyes.createCanonicalRequestedUniverseWave({ defineCanonicalUniverse })
];

export const EXPANDED_UNIVERSES = [
  dlcDiscworld.createExpandedUniverses(),
  dlcJokerNew52.createExpandedUniverses(),
  dlcTheBatmanWhoLaughs.createExpandedUniverses(),
  dlcKaamelott.createExpandedUniverses(),
  dlcPrometheus.createExpandedUniverses(),
  dlcAliens.createExpandedUniverses(),
  dlcAlien3.createExpandedUniverses(),
  dlcAlienResurrection.createExpandedUniverses(),
  dlcAlienCovenant.createExpandedUniverses(),
  dlcAlienRomulus.createExpandedUniverses(),
  dlcPredator2.createExpandedUniverses(),
  dlcPredators.createExpandedUniverses(),
  dlcThePredator.createExpandedUniverses(),
  dlcPrey.createExpandedUniverses(),
  dlcPredatorKillerOfKillers.createExpandedUniverses(),
  dlcPredatorBadlands.createExpandedUniverses(),
  dlcAlienVsPredator.createExpandedUniverses(),
  dlcAliensVsPredatorRequiem.createExpandedUniverses(),
  dlcDungeonMeshi.createExpandedUniverses(),
  dlcNoob.createExpandedUniverses(),
  dlcRammstein.createExpandedUniverses(),
  dlcSystemOfADown.createExpandedUniverses(),
  dlcRobZombie.createExpandedUniverses(),
  dlcDaftPunk.createExpandedUniverses(),
  dlcOliverTree.createExpandedUniverses(),
  dlcHazbinHotel.createExpandedUniverses(),
  dlcSplice.createExpandedUniverses(),
  dlcPoliceSquad.createExpandedUniverses(),
  dlcBreakingBad.createExpandedUniverses(),
  dlcStargateAtlantis.createExpandedUniverses(),
  dlcStargateUniverse.createExpandedUniverses(),
  dlcStargateInfinity.createExpandedUniverses(),
  dlcTheBraveLittleToaster.createExpandedUniverses(),
  dlcEvolution.createExpandedUniverses(),
  dlcEvolutionTheAnimatedSeries.createExpandedUniverses(),
  dlcEarlyEdition.createExpandedUniverses(),
  dlcCharmed.createExpandedUniverses(),
  dlcBuffyTheVampireSlayer.createExpandedUniverses(),
  dlcAttackOnTitan.createExpandedUniverses(),
  dlcDeathNote.createExpandedUniverses(),
  dlcCellsAtWork.createExpandedUniverses(),
  dlcInuyashiki.createExpandedUniverses(),
  dlcBorderlands.createExpandedUniverses(),
  dlcVelociPastor.createExpandedUniverses(),
  dlcRubber.createExpandedUniverses(),
  dlcFrom.createExpandedUniverses({ makeLoreBossWave }),
  dlcUzumaki.createExpandedUniverses(),
  dlcToxicAvenger.createExpandedUniverses(),
  dlcExit8.createExpandedUniverses(),
  dlcHellHouseLLC.createExpandedUniverses(),
  dlcSausageParty.createExpandedUniverses(),
  dlcSpermageddon.createExpandedUniverses(),
  dlcSpyXFamily.createExpandedUniverses(),
  dlcTerrifier.createExpandedUniverses(),
  dlcZakEtCrysta.createExpandedUniverses(),
  dlcRichardAuPaysDesLivresMagiques.createExpandedUniverses(),
  dlcLesVisiteursDuFutur.createExpandedUniverses(),
  dlcTenaciousD.createExpandedUniverses(),
  dlcM3GAN.createExpandedUniverses(),
  dlcCameraCafe.createExpandedUniverses(),
  dlcSamanthaOups.createExpandedUniverses(),
  dlcLesChevaliersDuFiel.createExpandedUniverses(),
  dlcNoellePerna.createExpandedUniverses(),
  dlcWarOfTheWorlds.createExpandedUniverses(),
  dlcGhostbusters.createExpandedUniverses(),
  dlcOnechanbara.createExpandedUniverses(),
  dlcKungPow.createExpandedUniverses(),
  dlcDespicer.createExpandedUniverses(),
  dlcHowToMakeAMonster.createExpandedUniverses(),
  dlcRepoTheGeneticOpera.createExpandedUniverses(),
  dlcTremors.createExpandedUniverses(),
  dlcElvira.createExpandedUniverses(),
  dlcSkyline.createExpandedUniverses(),
  dlcTheRing.createExpandedUniverses(),
  dlcTheGrudge.createExpandedUniverses(),
  ...makeUniverseWave([
    { key: 'heavy_metal_2000', universe: 'Heavy Metal 2000', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Hard', titleFr: 'Heavy Metal 2000', stage: 'Fakk2 Loc-Nar Wasteland', boss: 'Tyler Loc-Nar Tyrant', hero: ['julie_hm2000', 'Julie', 'slayer'], allies: [['odin_hm2000', 'Odin', 'marine'], ['zeek_hm2000', 'Zeek', 'hacker']], theme: 'adult animated metal fantasy, mutant raiders, cosmic corruption, and wasteland combat', motif: 'wasteland', colors: ['#2b1320', '#050205', '#ff4f8b'] },
    { key: 'killer_tomatoes', universe: 'Killer Tomatoes from Outer Space', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Medium', titleFr: 'Tomates tueuses venues de l espace', stage: 'Tomato Saucer Panic', boss: 'Mutant Tomato Mother', hero: ['wilbur_tomatoes', 'Wilbur Finletter', 'tactical'], allies: [['tara_tomatoes', 'Tara Boumdeay', 'slayer'], ['ft_tomato', 'F.T.', 'hacker']], theme: 'absurd alien tomatoes, vegetable panic, B-movie invasions, and sauce-splattered chaos', motif: 'hauntedset', colors: ['#2b0808', '#070202', '#ff3b30'] },
    { key: 'planete_hurlante', universe: 'Planete Hurlante', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Planete Hurlante', stage: 'Sirius 6B Screamer Zone', boss: 'Autonomous Screamer Core', hero: ['hendricksson_screamers', 'Commander Hendricksson', 'marine'], allies: [['jessica_screamers', 'Jessica Hanson', 'tactical'], ['ace_screamers', 'Ace Jefferson', 'slayer']], theme: 'Sirius 6B trenches, autonomous killer machines, paranoia, and buried metallic traps', motif: 'facility', colors: ['#20242b', '#050608', '#c6d6d9'] },
    { key: 'sharknado', universe: 'Sharknado', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Medium', titleFr: 'Sharknado', stage: 'Los Angeles Shark Storm', boss: 'Category Five Sharknado', hero: ['fin_sharknado', 'Fin Shepard', 'slayer'], allies: [['april_sharknado', 'April Wexler', 'tactical'], ['nova_sharknado', 'Nova Clarke', 'marine']], theme: 'chainsaws, airborne sharks, disaster absurdity, and storm-front survival', motif: 'wasteland', colors: ['#12364c', '#02070a', '#4fd7ff'] },
    { key: 'godzilla_tas', universe: 'Godzilla The Animated Series', mediaType: 'series', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Godzilla la serie animee', stage: 'H.E.A.T. Kaiju Response', boss: 'Cyber Kaiju Mutation', hero: ['nick_tatopoulos_tas', 'Nick Tatopoulos', 'tactical'], allies: [['elsie_chapman_tas', 'Elsie Chapman', 'hacker'], ['godzilla_jr_tas', 'Godzilla Junior', 'slayer']], theme: 'H.E.A.T. science missions, mutated kaiju threats, and city-scale monster battles', motif: 'arcanecity', colors: ['#0d2a1f', '#020604', '#4dff88'] },
    { key: 'pee_wee', universe: 'Pee-wee', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Pee-wee', stage: 'Playhouse Bicycle Quest', boss: 'Stolen Bike Dream Trial', hero: ['peewee_herman', 'Pee-wee Herman', 'hacker'], allies: [['chairry_playhouse', 'Chairry', 'tactical'], ['cowboy_curtis', 'Cowboy Curtis', 'marine']], theme: 'surreal playhouse logic, strange gadgets, bicycle obsession, and comic detours', motif: 'arcanecity', colors: ['#1b3c8f', '#050718', '#ffdd33'] },
    { key: 'malcolm', universe: 'Malcolm in the Middle', mediaType: 'series', faction: 'cyber', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Malcolm', stage: 'Family Chaos Command Center', boss: 'Household Meltdown', hero: ['malcolm_wilkerson', 'Malcolm', 'hacker'], allies: [['lois_malcolm', 'Lois', 'tactical'], ['reese_malcolm', 'Reese', 'slayer']], theme: 'family chaos, genius problem solving, school trouble, and domestic escalation', motif: 'facility', colors: ['#283240', '#060709', '#ffcf4a'] },
    { key: 'tanya_the_evil', universe: 'Tanya the Evil', mediaType: 'manga', faction: 'arcane', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Tanya the Evil', stage: 'Imperial Mage Frontline', boss: 'Being X War Miracle', hero: ['tanya_degurechaff', 'Tanya Degurechaff', 'tactical'], allies: [['viktoriya_serebryakov', 'Viktoriya Serebryakov', 'marine'], ['weiss_203rd', 'Weiss', 'slayer']], theme: 'military mage doctrine, aerial artillery, alternate war fronts, and ruthless command logic', motif: 'fortress', colors: ['#24304d', '#05070c', '#d6b15f'] },
    { key: 'virus_1999', universe: 'Virus', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Virus', stage: 'Akademik Vladislav Volkov', boss: 'Alien Machine Intelligence', hero: ['kit_foster_virus', 'Kit Foster', 'marine'], allies: [['steve_baker_virus', 'Steve Baker', 'tactical'], ['nadia_virus', 'Nadia Vinogradova', 'hacker']], theme: 'derelict research ship, alien machine infection, body-tech hybrids, and electrical possession', motif: 'shipdeck', colors: ['#111d22', '#030506', '#72f0ff'] },
    { key: 'house_dead_1', universe: 'House of the Dead', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead', stage: 'Curien Mansion Outbreak', boss: 'Magician Type-0', hero: ['thomas_rogan_hotd', 'Thomas Rogan', 'marine'], allies: [['g_hotd', 'Agent G', 'tactical'], ['sophie_hotd', 'Sophie Richards', 'hacker']], theme: 'arcade agents, Curien mansion experiments, named DBR creatures, and Tarot-coded bioweapons', motif: 'hauntedset', colors: ['#1a0d0d', '#030101', '#ff4b3e'] },
    { key: 'house_dead_2', universe: 'House of the Dead 2', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead 2', stage: 'Venice Goldman Incident', boss: 'Emperor Type Alpha', hero: ['james_taylor_hotd2', 'James Taylor', 'marine'], allies: [['gary_stewart_hotd2', 'Gary Stewart', 'tactical'], ['amy_crystal_hotd2', 'Amy Crystal', 'hacker']], theme: 'Goldman outbreak, canals full of named creatures, arcade rescue routes, and synthetic Tarot final forms', motif: 'arcanecity', colors: ['#1b1510', '#030201', '#ff9d4a'] },
    { key: 'house_dead_3', universe: 'House of the Dead 3', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead 3', stage: 'EFI Research Facility', boss: 'Wheel of Fate', hero: ['lisa_rogan_hotd3', 'Lisa Rogan', 'slayer'], allies: [['g_hotd3', 'Agent G Veteran', 'tactical'], ['dan_taylor_hotd3', 'Dan Taylor', 'marine']], theme: 'AMS shotguns, abandoned EFI facilities, named genome creatures, and fate-driven experiments', motif: 'facility', colors: ['#101916', '#020403', '#5dff88'] },
    { key: 'toy_soldiers', universe: 'Toy Soldiers', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Toy Soldiers', stage: 'Miniature Trench Tabletop', boss: 'Clockwork Siege Engine', hero: ['tin_commander', 'Tin Commander', 'tactical'], allies: [['plastic_gunner', 'Plastic Gunner', 'marine'], ['windup_sapper', 'Wind-Up Sapper', 'hacker']], theme: 'miniature battlefield tactics, trench dioramas, toy artillery, and tabletop war machines', motif: 'fortress', colors: ['#243421', '#050705', '#b7d36b'] },
    {
      key: 'shaun_dead',
      universe: 'Shaun of the Dead',
      mediaType: 'movie',
      faction: 'horror',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Shaun of the Dead',
      stage: 'Winchester Last Pint',
      boss: 'Pub Zombie Siege',
      hero: ['shaun_sotd', 'Shaun', 'slayer'],
      allies: [['ed_sotd', 'Ed', 'hacker'], ['liz_sotd', 'Liz', 'tactical']],
      monsters: ['Garden Zombie', 'London Street Horde', 'Winchester Regular Dead'],
      bosses: ['Philip Zombie', 'Winchester Cellar Horde'],
      gear: [['shaun_cricket_bat', 'Shaun s Cricket Bat', 'Batte de cricket de Shaun', { atk: 9, spd: 1 }], ['shaun_record', 'Disposable Vinyl Record', 'Disque vinyle jetable', { atk: 6, def: 4 }], ['shaun_cornetto', 'Emergency Cornetto', 'Cornetto d urgence', { hp: 75 }]],
      event: ['evt_shaun_dont_stop_me', 'Winchester Jukebox Stand', 'Resistance du jukebox Winchester', 'The squad fights in rhythm around the bar while Shaun clears a route with the cricket bat.', 'L escouade combat en rythme autour du bar pendant que Shaun ouvre une route avec la batte de cricket.'],
      theme: 'British zombie comedy, pub defense, cricket bats, and deadpan survival plans',
      motif: 'hauntedset',
      colors: ['#251111', '#040202', '#d64242']
    },
    { key: 'puppet_master', universe: 'Puppet Master', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Puppet Master', stage: 'Bodega Bay Puppet Theater', boss: 'Totem Puppet Rite', hero: ['blade_puppet', 'Blade', 'horror'], allies: [['pinhead_puppet', 'Pinhead', 'slayer'], ['six_shooter_puppet', 'Six-Shooter', 'marine']], theme: 'killer puppets, occult animation, tiny assassins, and hotel corridor ambushes', motif: 'hauntedset', colors: ['#201614', '#040202', '#c28a4a'] },
    { key: 'chicken_run', universe: 'Chicken Run', mediaType: 'movie', faction: 'arcane', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Chicken Run', stage: 'Tweedy Farm Escape', boss: 'Pie Machine Grinder', hero: ['ginger_chickenrun', 'Ginger', 'tactical'], allies: [['rocky_chickenrun', 'Rocky Rhodes', 'slayer'], ['fowler_chickenrun', 'Fowler', 'marine']], theme: 'farm escape plans, claymation grit, pie machines, and improvised aviation', motif: 'fortress', colors: ['#332514', '#070503', '#f4c45f'] },
    { key: 'another', universe: 'Another', mediaType: 'manga', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Another', stage: 'Yomiyama Class 3 Curse', boss: 'Calamity Extra Student', hero: ['mei_misaki', 'Mei Misaki', 'horror'], allies: [['kouichi_sakakibara', 'Kouichi Sakakibara', 'tactical'], ['tatsuji_chibiki', 'Tatsuji Chibiki', 'hacker']], theme: 'school curse, missing identity, quiet dread, and fatal accidents around Class 3', motif: 'hauntedset', colors: ['#151923', '#020304', '#9fb4d9'] },
    { key: 'gunnm', universe: 'Gunnm', mediaType: 'manga', faction: 'cyber', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Gunnm', stage: 'Scrapyard Motorball Arena', boss: 'Zalem Hunter-Killer', hero: ['gally_gunnm', 'Gally', 'slayer'], allies: [['ido_gunnm', 'Daisuke Ido', 'hacker'], ['yugo_gunnm', 'Yugo', 'tactical']], theme: 'cyborg martial arts, scrapyard bounty hunting, motorball violence, and Zalem class divide', motif: 'facility', colors: ['#171d24', '#030507', '#67d8ff'] },
    { key: 'battle_royale', universe: 'Battle Royale', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Battle Royale', stage: 'Program Island Kill Zone', boss: 'Collar Detonation Network', hero: ['shuya_nanahara', 'Shuya Nanahara', 'tactical'], allies: [['noriko_nakagawa', 'Noriko Nakagawa', 'hacker'], ['kazuo_kiriyama', 'Kazuo Kiriyama', 'slayer']], theme: 'student survival program, explosive collars, island sectors, and moral collapse under rules', motif: 'wasteland', colors: ['#231414', '#030202', '#ff4e4e'] },
    {
      key: 'spawn',
      universe: 'Spawn',
      mediaType: 'manga',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Very Hard',
      titleFr: 'Spawn',
      stage: 'Rat City Necroplasm Rift',
      boss: 'Malebolgia Throne',
      hero: ['al_simmons_spawn', 'Spawn', 'horror'],
      allies: [['cogliostro_spawn', 'Cogliostro', 'tactical'], ['sam_twitch_spawn', 'Sam and Twitch', 'marine']],
      monsters: ['Violator Spawnling', 'Hell Soldier', 'Redeemer Hunter'],
      bosses: ['The Violator', 'Malebolgia'],
      gear: [['spawn_necroplasm', 'Necroplasm Reserve', 'Reserve de necroplasme', { atk: 10, hp: 40 }], ['spawn_chains', 'Living Hell Chains', 'Chaines infernales vivantes', { atk: 8, def: 4 }], ['spawn_cape', 'K7-Leetha Cape Fragment', 'Fragment de cape K7-Leetha', { hp: 70, def: 5 }]],
      event: ['evt_spawn_legion', 'Legion of Souls', 'Legion des ames', 'Spawn releases the voices inside his necroplasm to bind infernal enemies and tear down the throne line.', 'Spawn libere les voix de son necroplasme pour lier les ennemis infernaux et briser la ligne du trone.'],
      theme: 'necroplasm chains, hellspawn bargains, alley warfare, and infernal command structures',
      motif: 'hauntedset',
      colors: ['#08130f', '#010302', '#42ff66']
    },
    { key: 'pingu', universe: 'Pingu', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Pingu', stage: 'Antarctic Noot Noot Rift', boss: 'Frozen Fish Avalanche', hero: ['pingu', 'Pingu', 'hacker'], allies: [['pinga', 'Pinga', 'tactical'], ['roby_pingu', 'Roby', 'slayer']], theme: 'clay penguin antics, arctic family chaos, fish economy, and noot-noot disruption', motif: 'wasteland', colors: ['#112b3a', '#02070a', '#b9f2ff'] },
    { key: 'linkin_park', universe: 'Linkin Park', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Linkin Park', stage: 'Hybrid Theory Soundstage', boss: 'Meteora Feedback Core', hero: ['chester_lp', 'Chester Echo', 'slayer'], allies: [['mike_lp', 'Mike Signal', 'hacker'], ['mr_hahn_lp', 'Turntable Operator', 'tactical']], theme: 'nu-metal energy, glitch visuals, turntable cuts, emotional surges, and arena feedback', motif: 'facility', colors: ['#151a22', '#030407', '#00b7ff'] },
    { key: 'moonwalker', universe: 'Moonwalker', mediaType: 'movie', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Moonwalker', stage: 'Smooth Criminal Club Breach', boss: 'Mr Big Mecha Raid', hero: ['moonwalker_hero', 'Moonwalker', 'slayer'], allies: [['annie_moonwalker', 'Annie', 'hacker'], ['club_dancer_moonwalker', 'Club Dancer', 'tactical']], theme: 'music-video fantasy, anti-gravity dance combat, gangster clubs, and transforming starship spectacle', motif: 'arcanecity', colors: ['#101820', '#030406', '#f5f5f5'] },
    { key: 'michael_jackson', universe: 'Michael Jackson', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Michael Jackson', stage: 'King of Pop Rhythm Rift', boss: 'Thriller Beat Revenant', hero: ['mj_performer', 'King of Pop Avatar', 'slayer'], allies: [['rhythm_guard_mj', 'Rhythm Guard', 'tactical'], ['stage_light_mj', 'Stage Light Tech', 'hacker']], theme: 'pop spectacle, thriller horror dance, spotlight timing, and precision rhythm strikes', motif: 'hauntedset', colors: ['#171717', '#030303', '#f3d35c'] },
    { key: 'the_thing', universe: 'The Thing', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'The Thing', stage: 'Outpost 31 Blood Test', boss: 'Assimilation Biomass', hero: ['macready_thing', 'R.J. MacReady', 'marine'], allies: [['childs_thing', 'Childs', 'tactical'], ['blair_thing', 'Blair', 'hacker']], theme: 'antarctic paranoia, assimilation horror, blood tests, flamethrowers, and identity collapse', motif: 'facility', colors: ['#15212a', '#020406', '#c8f4ff'] },
    {
      key: 'evil_dead',
      universe: 'Evil Dead',
      mediaType: 'movie',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Evil Dead - Trilogie',
      stage: 'Knowby Cabin Deadite Night',
      boss: 'Necronomicon Kandarian Demon',
      hero: ['ash_williams', 'Ash Williams', 'slayer'],
      allies: [['annie_knowby', 'Annie Knowby', 'hacker'], ['henry_red_ed', 'Henry the Red', 'marine']],
      monsters: ['Cabin Deadite', 'Demonic Tree', 'Skeleton Army'],
      bosses: ['Evil Ash', 'Kandarian Demon'],
      gear: [['evil_dead_boomstick', 'Ash s Boomstick', 'Boomstick d Ash', { atk: 10 }], ['evil_dead_chainsaw', 'Chainsaw Hand', 'Main tronconneuse', { atk: 9, def: 3 }], ['evil_dead_necronomicon', 'Necronomicon Ex-Mortis', 'Necronomicon Ex-Mortis', { hp: 65, atk: 5 }]],
      event: ['evt_evil_dead_army', 'Army of Darkness Charge', 'Charge de l Armee des tenebres', 'Ash leads the medieval line through the Deadites while the boomstick tears open the boss guard.', 'Ash mene la ligne medievale a travers les Deadites pendant que le boomstick brise la garde du boss.'],
      theme: 'the original cabin possession, Ash s chainsaw transformation, the Necronomicon, and the medieval Army of Darkness conflict',
      motif: 'hauntedset',
      colors: ['#1f0d0d', '#030101', '#ff3f2f']
    },
    { key: 'die_antwoord', universe: 'Die Antwoord', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Die Antwoord', stage: 'Zef Neon Warehouse', boss: 'Bassline Freak Core', hero: ['ninja_da', 'Ninja', 'slayer'], allies: [['yolandi_da', 'Yo-Landi', 'hacker'], ['dj_hi_tek_da', 'DJ Hi-Tek', 'tactical']], theme: 'zef rave aggression, distorted bass, neon warehouse sets, and abrasive cyber-punk energy', motif: 'facility', colors: ['#1b1020', '#040206', '#ff4fd8'] },
    { key: 'chappie', universe: 'Chappie', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Chappie', stage: 'Johannesburg Scout AI Lab', boss: 'MOOSE Weapons Platform', hero: ['chappie_ai', 'Chappie', 'hacker'], allies: [['deon_chappie', 'Deon Wilson', 'tactical'], ['yolandi_chappie', 'Yolandi', 'marine']], theme: 'learning robot consciousness, police scouts, criminal crews, and corporate weapons platforms', motif: 'facility', colors: ['#20272b', '#050607', '#8de8ff'] },
    { key: 'gremlins', universe: 'Gremlins', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Medium', titleFr: 'Gremlins', stage: 'Kingston Falls Midnight Rules', boss: 'Stripe Gremlin Swarm', hero: ['gizmo_gremlins', 'Gizmo', 'hacker'], allies: [['billy_peltzer', 'Billy Peltzer', 'tactical'], ['kate_gremlins', 'Kate Beringer', 'marine']], theme: 'mogwai rules, midnight chaos, multiplying gremlins, and small-town creature mayhem', motif: 'hauntedset', colors: ['#142415', '#020402', '#7aff60'] },
    { key: 'rocky_horror', universe: 'Rocky Horror Picture Show', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Rocky Horror Picture Show', stage: 'Frankenfurter Castle Floor Show', boss: 'Transylvanian Time Warp', hero: ['frank_n_furter', 'Frank-N-Furter', 'horror'], allies: [['janet_rhps', 'Janet Weiss', 'tactical'], ['rocky_rhps', 'Rocky Horror', 'slayer']], theme: 'glam sci-fi castle, theatrical horror, laboratory creation, and midnight musical ritual', motif: 'hauntedset', colors: ['#240b28', '#050106', '#ff5cff'] },
    { key: 'les_inconnus', universe: 'Les Inconnus', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Inconnus', stage: 'Sketch TV Parody Breach', boss: 'Prime Time Absurdity', hero: ['inconnus_trio', 'Pascal Legitimus', 'hacker'], allies: [['bernard_inconnus', 'Bernard Campan', 'tactical'], ['didier_inconnus', 'Didier Bourdon', 'slayer']], theme: 'French sketch comedy, TV parody, social satire, and absurd catchphrase energy', motif: 'arcanecity', colors: ['#232323', '#040404', '#ffd15c'] },
    { key: 'rrrrrrr', universe: 'RRRrrrr!!!', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'RRRrrrr!!!', stage: 'Age de Pierre Shampooing', boss: 'Premier Crime Tribal', hero: ['pierre_rrr', 'Pierre - Chef des Cheveux Propres', 'slayer'], allies: [['guy_rrr', 'Guy', 'tactical'], ['chef_cheveux_sales', 'Tonton - Chef des Cheveux Sales', 'hacker']], theme: 'prehistoric comedy, rival hair tribes, first murder mystery, and absurd stone-age logic', motif: 'wasteland', colors: ['#302214', '#080503', '#f0b45b'] },
    { key: 'cite_peur', universe: 'La Cite de la Peur', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'La Cite de la Peur', stage: 'Cannes Projection Slasher', boss: 'Odile Deray Premiere Trap', hero: ['odile_deray', 'Odile Deray', 'tactical'], allies: [['simon_jeremi', 'Simon Jeremi', 'hacker'], ['serge_karamazov', 'Serge Karamazov', 'slayer']], theme: 'French comedy thriller, film festival murders, meta-cinema jokes, and chaotic publicity tactics', motif: 'hauntedset', colors: ['#261414', '#040202', '#ff5757'] },
    { key: 'defiance', universe: 'Defiance', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Defiance', stage: 'Votan Frontier Siege', boss: 'Arkfall War Engine', hero: ['nolan_defiance', 'Joshua Nolan', 'marine'], allies: [['irisa_defiance', 'Irisa', 'slayer'], ['datak_tarr', 'Datak Tarr', 'tactical']], theme: 'post-alien-war frontier towns, Votan cultures, arkfall tech, and uneasy alliances', motif: 'wasteland', colors: ['#1e2b2b', '#030606', '#58d6c7'] },
    { key: 'mars_attacks', universe: 'Mars Attacks', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Hard', titleFr: 'Mars Attacks', stage: 'Ack Ack Capitol Invasion', boss: 'Martian Supreme Commander', hero: ['byron_mars', 'Byron Williams', 'marine'], allies: [['ritchie_mars', 'Richie Norris', 'hacker'], ['nathalie_mars', 'Nathalie Lake', 'tactical']], theme: 'Martian rayguns, cruel comedy invasion, flying saucers, and yodel-powered reversal', motif: 'arcanecity', colors: ['#10251b', '#020503', '#39ff66'] },
    { key: 'dandadan', universe: 'Dandadan', mediaType: 'manga', faction: 'arcane', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Dandadan', stage: 'Occult Alien Turbo Chase', boss: 'Turbo Granny UFO Merge', hero: ['momo_ayase', 'Momo Ayase', 'hacker'], allies: [['oken_dandadan', 'Okarun', 'slayer'], ['aira_dandadan', 'Aira Shiratori', 'tactical']], theme: 'aliens, yokai, psychic powers, turbo curses, and chaotic occult battles', motif: 'hauntedset', colors: ['#241531', '#050208', '#ff6ad5'] },
    { key: 'baby_cart', universe: 'Baby Cart', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Baby Cart', stage: 'Lone Wolf Assassin Road', boss: 'Yagyu Ambush Clan', hero: ['ogami_itto', 'Ogami Itto', 'slayer'], allies: [['daigoro_babycart', 'Daigoro', 'hacker'], ['azami_assassin', 'Roadside Assassin', 'tactical']], theme: 'ronin executioner road, hidden weapons cart, clan ambushes, and grim chanbara duels', motif: 'wasteland', colors: ['#201915', '#040303', '#d8b46a'] },
    { key: 'cloverfield', universe: 'Cloverfield', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Cloverfield', stage: 'Manhattan Found Footage Collapse', boss: 'Clover Parasite Titan', hero: ['rob_cloverfield', 'Rob Hawkins', 'tactical'], allies: [['hud_cloverfield', 'Hud Platt', 'hacker'], ['marlena_cloverfield', 'Marlena Diamond', 'slayer']], theme: 'found-footage panic, city destruction, parasite bites, and colossal unseen biology', motif: 'arcanecity', colors: ['#141f25', '#020405', '#93c8d8'] },
    { key: 'collector', universe: 'The Collector', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'The Collector', stage: 'Trap House Extraction', boss: 'Collector Masked Architect', hero: ['arkin_collector', 'Arkin', 'tactical'], allies: [['elena_collector', 'Elena Peters', 'hacker'], ['lucello_collector', 'Lucello', 'marine']], theme: 'masked trap maker, house-wide mechanisms, desperate rescue, and brutal survival puzzles', motif: 'facility', colors: ['#1a1111', '#030202', '#d13d3d'] },
    {
      key: 'h2g2',
      universe: 'H2G2',
      mediaType: 'movie',
      faction: 'sciFi',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'H2G2',
      stage: 'Heart of Gold Improbability Drive',
      boss: 'Vogon Constructor Fleet',
      hero: ['arthur_dent_h2g2', 'Arthur Dent', 'hacker'],
      allies: [['ford_prefect', 'Ford Prefect', 'tactical'], ['trillian_h2g2', 'Trillian', 'slayer']],
      monsters: ['Vogon Guard', 'Bureaucratic Form Drone', 'Improbability Creature'],
      bosses: ['Marvin Depression Field', 'Vogon Constructor Fleet'],
      gear: [['h2g2_towel', 'Extremely Useful Towel', 'Serviette extremement utile', { def: 6, hp: 50 }], ['h2g2_babel_fish', 'Babel Fish', 'Poisson Babel', { spd: 2, def: 3 }], ['h2g2_guide', 'Hitchhiker s Guide', 'Guide du voyageur galactique', { hp: 70, atk: 4 }]],
      event: ['evt_h2g2_improbability', 'Infinite Improbability Jump', 'Saut d improbabilite infinie', 'The Heart of Gold turns the enemy formation into a harmless statistical impossibility for one beat.', 'Le Coeur en Or transforme la formation ennemie en impossibilite statistique inoffensive pendant un instant.'],
      theme: 'cosmic absurdity, guide entries, Vogon bureaucracy, towels, Babel fish, and probability disasters',
      motif: 'shipdeck',
      colors: ['#14243a', '#02050a', '#7dd3ff']
    },
    { key: 'tuche', universe: 'Les Tuche', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Tuche', stage: 'Bouzolles Lottery Breach', boss: 'Monaco Culture Shock', hero: ['jeff_tuche', 'Jeff Tuche', 'hacker'], allies: [['cathy_tuche', 'Cathy Tuche', 'tactical'], ['coincoin_tuche', 'Coin-Coin', 'slayer']], theme: 'lottery chaos, family stubbornness, class shock comedy, and potato-based morale', motif: 'arcanecity', colors: ['#2d2415', '#070503', '#ffd45a'] },
    { key: 'iron_sky', universe: 'Iron Sky', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Iron Sky', stage: 'Moon Reich Dark Side Base', boss: 'Gotterdammerung Warship', hero: ['renate_ironsky', 'Renate Richter', 'tactical'], allies: [['james_ironsky', 'James Washington', 'marine'], ['sasha_ironsky', 'Sasha', 'hacker']], theme: 'moonbase satire, retro-futurist saucers, political absurdity, and orbital war machines', motif: 'shipdeck', colors: ['#1d2027', '#040507', '#bfc7d5'] },
    { key: 'rec', universe: 'REC', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'REC', stage: 'Quarantined Barcelona Building', boss: 'Medeiros Attic Host', hero: ['angela_vidal', 'Angela Vidal', 'hacker'], allies: [['manu_rec', 'Manu', 'marine'], ['pablo_rec', 'Pablo Camera', 'tactical']], theme: 'found-footage infection, sealed apartment stairwells, panic screams, and attic possession horror', motif: 'hauntedset', colors: ['#161616', '#020202', '#e84b3c'] },
    { key: 'sinister', universe: 'Sinister', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Sinister', stage: 'Super 8 Murder Archive', boss: 'Bughuul Film Curse', hero: ['ellison_sinister', 'Ellison Oswalt', 'hacker'], allies: [['tracy_sinister', 'Tracy Oswalt', 'tactical'], ['deputy_so_and_so', 'Deputy So-and-So', 'marine']], theme: 'Super 8 reels, occult murder patterns, child ghosts, and image-borne possession', motif: 'hauntedset', colors: ['#17120f', '#030201', '#d87b3d'] },
    { key: 'les_visiteurs', universe: 'Les Visiteurs', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Visiteurs', stage: 'Couloir du Temps Medieval', boss: 'Potion Temporelle Instable', hero: ['godefroy_visiteurs', 'Godefroy de Montmirail', 'slayer'], allies: [['jacquouille', 'Jacquouille la Fripouille', 'hacker'], ['beatrice_visiteurs', 'Beatrice', 'tactical']], theme: 'medieval time travel, mistaken identities, magic potion accidents, and noble chaos in modern France', motif: 'castle', colors: ['#2b2417', '#070503', '#d9b86b'] },
    { key: 'kazaam', universe: 'Kazaam', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Kazaam', stage: 'Urban Genie Boom Box', boss: 'Wish Contract Overload', hero: ['kazaam_genie', 'Kazaam', 'hacker'], allies: [['max_kazaam', 'Max Connor', 'tactical'], ['malik_kazaam', 'Malik', 'marine']], theme: 'urban genie wishes, music-powered magic, kid adventure, and oversized supernatural muscle', motif: 'arcanecity', colors: ['#1e1b35', '#05040a', '#8f7cff'] },
    { key: 'spirited_away', universe: 'Voyage de Chihiro', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Voyage de Chihiro', stage: 'Bathhouse Spirit Crossing', boss: 'No-Face Gold Hunger', hero: ['chihiro_ogino', 'Chihiro', 'tactical'], allies: [['haku_spirited', 'Haku', 'slayer'], ['lin_spirited', 'Lin', 'hacker']], theme: 'spirit bathhouse rules, river dragons, masked hunger, and courage through enchanted labor', motif: 'castle', colors: ['#162d2a', '#020706', '#6ff0c8'] },
    { key: 'feebles', universe: 'Meet the Feebles', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Les Feebles', stage: 'Variety Show Backstage Riot', boss: 'Heidi Stage Meltdown', hero: ['heidi_feebles', 'Heidi', 'horror'], allies: [['wynyard_feebles', 'Wynyard', 'marine'], ['robert_feebles', 'Robert', 'tactical']], theme: 'puppet show corruption, backstage crime, grotesque satire, and variety-stage breakdown', motif: 'hauntedset', colors: ['#221015', '#040203', '#ff5a7a'] },
    { key: 'roger_rabbit', universe: 'Roger Rabbit', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Roger Rabbit', stage: 'Toontown Dip Crisis', boss: 'Judge Doom Dip Machine', hero: ['roger_rabbit', 'Roger Rabbit', 'hacker'], allies: [['eddie_valiant', 'Eddie Valiant', 'tactical'], ['jessica_rabbit', 'Jessica Rabbit', 'slayer']], theme: 'toon physics, noir investigation, Dip danger, and reality-bending gag combat', motif: 'arcanecity', colors: ['#2d1424', '#060205', '#ff6ab7'] },
    { key: 'starship_troopers', universe: 'Starship Troopers', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Starship Troopers', stage: 'Klendathu Bug War', boss: 'Brain Bug Hive Command', hero: ['johnny_rico', 'Johnny Rico', 'marine'], allies: [['dizzy_flores', 'Dizzy Flores', 'slayer'], ['carl_jenkins', 'Carl Jenkins', 'hacker']], theme: 'mobile infantry, arachnid swarms, propaganda war, and brutal planetary assaults', motif: 'wasteland', colors: ['#1b2113', '#030402', '#9ed34f'] },
    { key: 'banlieue_13', universe: 'Banlieue 13', mediaType: 'movie', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Banlieue 13', stage: 'District 13 Parkour Raid', boss: 'Neutron Bomb Countdown', hero: ['leito_b13', 'Leito', 'slayer'], allies: [['damien_b13', 'Damien Tomaso', 'tactical'], ['lola_b13', 'Lola', 'hacker']], theme: 'parkour escapes, sealed district raids, tactical infiltration, and ticking urban bomb plots', motif: 'arcanecity', colors: ['#182126', '#030506', '#ff7a45'] },
    { key: 'house_1000_corpses', universe: 'House of 1000 Corpses', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'House of 1000 Corpses', stage: 'Firefly Family Funhouse', boss: 'Doctor Satan Basement', hero: ['baby_firefly', 'Baby Firefly', 'horror'], allies: [['otis_driftwood', 'Otis Driftwood', 'slayer'], ['captain_spaulding', 'Captain Spaulding', 'tactical']], theme: 'Firefly family horror, roadside attractions, grindhouse cruelty, and underground nightmare rooms', motif: 'hauntedset', colors: ['#2a120c', '#050201', '#ff6a2f'] },
    { key: 'overlord_anime', universe: 'Overlord Anime', mediaType: 'manga', faction: 'arcane', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Overlord', stage: 'Nazarick Tomb Defense', boss: 'Ainz Ooal Gown Supreme Magic', hero: ['ainz_overlord', 'Ainz Ooal Gown', 'horror'], allies: [['albedo_overlord', 'Albedo', 'slayer'], ['demiurge_overlord', 'Demiurge', 'tactical']], theme: 'isekai dark guild, Nazarick guardians, undead kingship, and overwhelming tier magic', motif: 'castle', colors: ['#181126', '#030207', '#b88cff'] },
    { key: 'scp', universe: 'SCP Foundation', mediaType: 'series', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'SCP', stage: 'Site-19 Containment Breach', boss: 'Keter Class Cascade', hero: ['mtf_commander_scp', 'MTF Commander', 'tactical'], allies: [['researcher_scp', 'Foundation Researcher', 'hacker'], ['scp_999_echo', 'SCP-999 Echo', 'horror']], theme: 'containment protocols, anomalous entities, site lockdowns, and Keter escalation procedures', motif: 'facility', colors: ['#151515', '#020202', '#e5e5e5'] },
    { key: 'spoof_movie', universe: 'Spoof Movie', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Spoof Movie', stage: 'South Central Block Party', boss: 'Toothpick (Cure-dents)', hero: ['spoof_survivor', 'Cendar (Ashtray)', 'hacker'], allies: [['parody_detective', 'Loc Dog', 'tactical'], ['slapstick_fighter', 'Preach', 'slayer']], theme: 'the 1996 Wayans hood-film parody, South Central sight gags, Loc Dog absurdity, and Ashtray learning to choose his own ending', motif: 'arcanecity', colors: ['#202020', '#040404', '#ffcf5a'] }
  ]),
  ...makeUniverseWave([
    { key: 'mgsr', universe: 'Metal Gear Rising', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Metal Gear Rising', stage: 'Denver Cyborg Duel', boss: 'Senator Armstrong Nanomachine Core', hero: ['raiden_mgr', 'Raiden', 'slayer'], allies: [['blade_wolf_mgr', 'Blade Wolf', 'tactical'], ['jetstream_sam', 'Jetstream Sam', 'slayer']], monsters: ['Cyborg Soldier', 'Gekko UG', 'Dwarf Gekko Swarm'], bosses: ['Sundowner', 'Mistral'], gear: [['hf_blade', 'HF Blade', 'Lame HF', { atk: 5 }], ['sombrero_shield', 'Sombrero Shield', 'Bouclier Sombrero', { def: 4 }], ['ripper_mode_chip', 'Ripper Mode Chip', 'Puce Mode Éventreur', { atk: 3, spd: 2 }]], event: ['evt_zandatsu', 'Zandatsu', 'Zandatsu', 'Slice an enemy in blade mode to restore HP and energy', 'Tranche un ennemi en mode lame pour restaurer PV et énergie'], theme: 'cyborg sword duels, private armies, memes, and nanomachine brutality', motif: 'facility', colors: ['#15202b', '#030507', '#58d6ff'] },
    { key: 'bioshock', universe: 'BioShock', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Hard', titleFr: 'BioShock', stage: 'Rapture ADAM Collapse', boss: 'Atlas Fontaine Splicer King', hero: ['jack_bioshock', 'Jack', 'hacker'], allies: [['big_daddy_bioshock', 'Big Daddy', 'marine'], ['little_sister_echo', 'Little Sister Echo', 'tactical']], monsters: ['Thuggish Splicer', 'Leadhead Splicer', 'Spider Splicer'], bosses: ['Frank Fontaine', 'Sander Cohen'], gear: [['wrench', 'Wrench', 'Clé à molette', { atk: 3 }], ['electro_bolt_vigor', 'Electro Bolt Vigor', 'Vigeur Éclair', { atk: 4, spd: 1 }], ['adam_syringe', 'ADAM Syringe', 'Seringue ADAM', { hp: 5 }]], event: ['evt_hypnotize_big_daddy', 'Hypnotize Big Daddy', 'Hypnotiser Big Daddy', 'Hypnotize a Big Daddy to fight alongside you for the wave', 'Hypnotise un Big Daddy pour combattre à vos côtés pendant la vague'], theme: 'underwater dystopia, plasmids, ADAM addiction, Big Daddies, and broken utopian science', motif: 'facility', colors: ['#123448', '#020709', '#b88942'] },
    { key: 'twisted_metal', universe: 'Twisted Metal', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Twisted Metal', stage: 'Calypso Deathmatch Freeway', boss: 'Sweet Tooth War Rig', hero: ['sweet_tooth_tm', 'Sweet Tooth', 'horror'], allies: [['outlaw_tm', 'Outlaw', 'tactical'], ['roadkill_tm', 'Roadkill', 'marine']], monsters: ['Outlaw Cop', 'Darkside Trucker', 'Remote Bomb Drone'], bosses: ['Calypso', 'Minion'], gear: [['napalm_canister', 'Napalm Canister', 'Cartouche de napalm', { atk: 5 }], ['shield_pickup', 'Shield Pickup', 'Bouclier récupéré', { def: 4 }], ['turbo_boost', 'Turbo Boost', 'Turbo', { spd: 5 }]], event: ['evt_flaming_head', 'Sweet Tooth Flaming Head', 'Tête enflammée de Sweet Tooth', 'Sweet Tooth ignites his head to deal massive fire damage to all enemies', 'Sweet Tooth enflamme sa tête pour infliger des dégâts de feu massifs à tous les ennemis'], theme: 'vehicular carnage, cursed wishes, arena mayhem, and clown-faced apocalypse metal', motif: 'wasteland', colors: ['#250f12', '#050203', '#ff3f2f'] },
    { key: 'spider_ps1', universe: 'Spider: The Video Game', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Spider: The Video Game', stage: 'Circuit Boards', boss: 'Brain', hero: ['cyber_spider_kelly', 'Cybernetic Spider (Dr. Michael Kelly)', 'hacker'], allies: [['cyber_spider_flamethrower', 'Cybernetic Spider - Flamethrower Loadout', 'slayer'], ['cyber_spider_electro_beam', 'Cybernetic Spider - Electro-Beam Loadout', 'tactical']], monsters: ['Spider', 'Wasp', 'Infected Rat'], bosses: ['Mechanical Arm', 'Museum Boss'], gear: [['cyber_leg_flamethrower', 'Flamethrower Cyber-Leg', 'Patte cybernetique lance-flammes', { atk: 4 }], ['homing_missile_spider', 'Homing Missile', 'Missile a tete chercheuse', { atk: 5 }], ['electro_beam_spider', 'Electro-Beam', 'Electro-rayon', { atk: 3, spd: 2 }]], event: ['evt_microchip_gate', 'Microchip Gate Unlock', 'Ouverture de la porte a microprocesseurs', 'Collect the route microchips to unlock the next laboratory sector', 'Collecte les microprocesseurs du parcours pour ouvrir le secteur suivant du laboratoire'], theme: 'insect-scale laboratory platforming, cybernetic spider movement, interchangeable micro-weapons, giant electronics, and mechanical creature experiments', motif: 'facility', colors: ['#101a18', '#020504', '#5dff9e'] },
    { key: 'tomba', universe: 'Tomba', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Tomba', stage: 'Evil Pig Jungle Rift', boss: 'Seven Evil Pigs Gate', hero: ['tomba_hero', 'Tomba', 'slayer'], allies: [['charles_tomba', 'Charles', 'hacker'], ['tabby_tomba', 'Tabby', 'tactical']], monsters: ['Evil Pig Soldier', 'Cursed Mushroom', 'Kokka Bird'], bosses: ['100 Year Old Wise Man Trial', 'Evil Pig Boss Gate'], gear: [['grapple_hook', 'Grapple Hook', 'Grappin', { spd: 4 }], ['charity_wings', 'Charity Wings', 'Ailes de charité', { def: 3, spd: 1 }], ['phoenix_rod', 'Phoenix Rod', 'Bâton du phénix', { atk: 4 }]], event: ['evt_evil_pig_bag_seal', 'Evil Pig Bag Seal', 'Sceau du sac de cochon maléfique', 'Seal an Evil Pig into a bag to banish the curse from the area', 'Scelle un cochon maléfique dans un sac pour bannir la malédiction de la zone'], theme: 'pink-haired platforming, cursed pigs, jungle quests, and whimsical object logic', motif: 'wasteland', colors: ['#2e1b32', '#050207', '#ff66aa'] },
    { key: 'ff7', universe: 'Final Fantasy VII', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Final Fantasy VII', stage: 'Midgar Mako Reactor Breach', boss: 'Safer Sephiroth Jenova Core', hero: ['cloud_ff7', 'Cloud Strife', 'slayer'], allies: [['tifa_ff7', 'Tifa Lockhart', 'slayer'], ['aerith_ff7', 'Aerith Gainsborough', 'tactical']], monsters: ['Shinra SOLDIER', 'Guard Scorpion Drone', 'Midgar Zolom'], bosses: ['Safer Sephiroth', 'Jenova BIRTH'], gear: [['buster_sword_hilt', 'Buster Sword Hilt', 'Poignée d\'épée Buster', { atk: 5 }], ['materia_bracer', 'Materia Bracer', 'Brassard à matéria', { def: 3, hp: 2 }], ['ribbon_accessory', 'Ribbon Accessory', 'Accessoire ruban', { def: 2, spd: 2 }]], event: ['evt_knights_of_the_round', 'Knights of the Round', 'Chevaliers de la Table Ronde', 'Summon the 13 Knights of the Round to deal devastating sequential damage', 'Invoque les 13 Chevaliers de la Table Ronde pour infliger des dégâts séquentiels dévastateurs'], theme: 'mako reactors, SOLDIER trauma, materia, planetary memory, and Jenova corruption', motif: 'facility', colors: ['#14261f', '#020503', '#6dff8d'] },
    { key: 'ff8', universe: 'Final Fantasy VIII', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Final Fantasy VIII', stage: 'Balamb Time Compression', boss: 'Ultimecia Junction Core', hero: ['squall_ff8', 'Squall Leonhart', 'slayer'], allies: [['rinoa_ff8', 'Rinoa Heartilly', 'hacker'], ['quistis_ff8', 'Quistis Trepe', 'tactical']], monsters: ['Galbadian Soldier', 'Bite Bug', 'T-Rexaur'], bosses: ['Ultimecia', 'Edea Kramer'], gear: [['gunblade_magazine', 'Gunblade Magazine', 'Chargeur de gunblade', { atk: 4, spd: 1 }], ['gf_junction_link', 'GF Junction Link', 'Lien d\'association GF', { hp: 3, def: 2 }], ['triple_triad_card', 'Triple Triad Card', 'Carte Triple Triad', { spd: 3 }]], event: ['evt_renzokuken', 'Renzokuken Limit Break', 'Limit Break Renzokuken', 'Unleash a flurry of gunblade strikes finishing with a powerful Lionheart blow', 'Déchaîne une rafale de coups de gunblade terminée par un puissant coup Cœur de Lion'], theme: 'gunblades, Gardens, Guardian Forces, sorceress wars, and time compression', motif: 'castle', colors: ['#19233b', '#03050a', '#8fb6ff'] },
    { key: 'ff13', universe: 'Final Fantasy XIII', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Final Fantasy XIII', stage: 'Cocoon FalCie Purge', boss: 'Orphan Cradle Core', hero: ['lightning_ff13', 'Lightning', 'slayer'], allies: [['fang_ff13', 'Fang', 'marine'], ['vanille_ff13', 'Vanille', 'hacker']], monsters: ['PSICOM Soldier', 'Behemoth Cub', 'Cie\'th Shambler'], bosses: ['Barthandelus', 'Orphan Core'], gear: [['blazefire_saber_mod', 'Blazefire Saber Mod', 'Mod sabre Éclair', { atk: 4, spd: 1 }], ['paradigm_shift_chip', 'Paradigm Shift Chip', 'Puce de changement de paradigme', { def: 3, spd: 2 }], ['crystarium_shard', 'Crystarium Shard', 'Éclat de Cristarium', { hp: 4 }]], event: ['evt_army_of_one', 'Army of One Assault', 'Assaut Armée Solitaire', 'Lightning strikes all enemies with a lightning-fast barrage of blows', 'Lightning frappe tous les ennemis avec un barrage de coups ultra-rapide'], theme: 'lCie brands, falCie destiny, paradigm shifts, and crystalline rebellion', motif: 'shipdeck', colors: ['#20273a', '#04060a', '#f0a8d8'] },
    { key: 'ff15', universe: 'Final Fantasy XV', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Final Fantasy XV', stage: 'Lucis Roadtrip Nightfall', boss: 'Ardyn Starscourge Throne', hero: ['noctis_ff15', 'Noctis Lucis Caelum', 'slayer'], allies: [['gladiolus_ff15', 'Gladiolus', 'marine'], ['ignis_ff15', 'Ignis', 'tactical']], monsters: ['MT Trooper', 'Iron Giant', 'Red Giant'], bosses: ['Ardyn Izunia', 'Ifrit Infernian'], gear: [['engine_blade_core', 'Engine Blade Core', 'Noyau de lame motrice', { atk: 4 }], ['royal_arm_shard', 'Royal Arm Shard', 'Éclat d\'arme royale', { atk: 3, def: 2 }], ['camping_utensils', 'Camping Utensils', 'Ustensiles de camping', { hp: 4, def: 1 }]], event: ['evt_armiger_unleashed', 'Armiger Unleashed', 'Arsenal fantôme libéré', 'Unleash all Royal Arms in a devastating spectral barrage around Noctis', 'Libère toutes les armes royales dans un barrage spectral dévastateur autour de Noctis'], theme: 'royal road trips, astral pacts, daemon nights, and warp-strike brotherhood', motif: 'wasteland', colors: ['#171b2b', '#030407', '#7d9bff'] },
    { key: 'crash_bandicoot', universe: 'Crash Bandicoot', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Crash Bandicoot', stage: 'Wumpa Island Cortex Lab', boss: 'Neo Cortex Mutagen Ray', hero: ['crash_bandicoot', 'Crash Bandicoot', 'slayer'], allies: [['coco_bandicoot', 'Coco Bandicoot', 'hacker'], ['aku_aku', 'Aku Aku', 'tactical']], monsters: ['Lab Assistant', 'Tribesman', 'TNT Crate Walker'], bosses: ['Neo Cortex', 'N. Gin Mech'], gear: [['wumpa_bazooka', 'Wumpa Bazooka', 'Bazooka à Wumpa', { atk: 4 }], ['aku_aku_mask_charm', 'Aku Aku Mask Charm', 'Charme du masque Aku Aku', { def: 3, hp: 2 }], ['power_crystal', 'Power Crystal', 'Cristal de puissance', { atk: 2, spd: 2 }]], event: ['evt_aku_aku_invincibility', 'Aku Aku Invincibility', 'Invincibilité Aku Aku', 'Collect three Aku Aku masks to become temporarily invincible', 'Collecte trois masques Aku Aku pour devenir temporairement invincible'], theme: 'wumpa crates, mutant islands, mask magic, spinning chaos, and mad science traps', motif: 'wasteland', colors: ['#2e1608', '#070301', '#ff8a22'] },
    { key: 'tomb_raider', universe: 'Tomb Raider', mediaType: 'game', faction: 'arcane', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Tomb Raider', stage: 'Ancient Tomb Relic Siege', boss: 'Atlantean Scion Guardian', hero: ['lara_croft_tr', 'Lara Croft', 'tactical'], allies: [['winston_tr', 'Winston', 'hacker'], ['jonah_tr', 'Jonah Maiava', 'marine']], monsters: ['Wolves', 'Atlantean Mutant', 'Mercenary Guard'], bosses: ['Natla', 'Atlantean Scion Guardian'], gear: [['dual_pistols', 'Dual Pistols', 'Double pistolets', { atk: 9, spd: 1 }], ['climbing_axe', 'Climbing Axe', 'Piolet d escalade', { atk: 7, def: 5 }], ['jade_dragon', 'Jade Dragon', 'Dragon de jade', { hp: 80, def: 4 }]], event: ['evt_adrenaline_dodge', 'Adrenaline Dodge', 'Esquive d adrenaline', 'Lara dodges incoming attacks and counters with precise dual-pistol fire.', 'Lara esquive les attaques et riposte avec un tir precis de ses pistolets.'], theme: 'ancient tombs, relic puzzles, dual pistols, traps, and archaeological survival', motif: 'castle', colors: ['#2a2115', '#050403', '#d4a64a'] },
    { key: 'tekken_ogre', universe: 'Tekken', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Tekken', stage: 'King of Iron Fist Nexus', boss: 'True Ogre Ancient Form', hero: ['yoshimitsu_tekken', 'Yoshimitsu', 'slayer'], allies: [['true_ogre_tekken', 'True Ogre', 'horror'], ['gon_tekken', 'Gon', 'slayer']], monsters: ['Jack-4 Unit', 'Mokujin Puppet', 'Combot Drone'], bosses: ['True Ogre', 'Heihachi Mishima'], gear: [['iron_fist_gauntlet', 'Iron Fist Gauntlet', 'Gantelet du poing de fer', { atk: 10, def: 3 }], ['mishima_zaibatsu_badge', 'Mishima Zaibatsu Badge', 'Insigne du Zaibatsu Mishima', { def: 6, hp: 50 }], ['devil_gene_shard', 'Devil Gene Shard', 'Eclat du gene demoniaque', { atk: 8, spd: 2 }]], event: ['evt_rage_art', 'Rage Art', 'Art de rage', 'A devastating finishing combo unleashed when health is critical.', 'Un combo devastateur declenche quand la sante est critique.'], theme: 'martial arts tournaments, cursed bloodlines, weapon styles, ancient ogres, and arcade rivalries', motif: 'arcanecity', colors: ['#1d1828', '#040306', '#9dff4a'] },
    { key: 'spyro', universe: 'Spyro', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Spyro', stage: 'Artisans Dragon Realm', boss: 'Gnasty Gnorc Crystal Trap', hero: ['spyro_dragon', 'Spyro', 'slayer'], allies: [['sparx_spyro', 'Sparx', 'hacker'], ['hunter_spyro', 'Hunter', 'tactical']], monsters: ['Gnorc Soldier', 'Dream Weaver Ghost', 'Lava Toad'], bosses: ['Gnasty Gnorc', 'Ripto'], gear: [['dragonfly_jar', 'Dragonfly Jar', 'Bocal a libellule', { hp: 70, def: 3 }], ['gem_shard', 'Gem Shard', 'Eclat de gemme', { atk: 7, spd: 1 }], ['dragon_egg', 'Dragon Egg', 'Oeuf de dragon', { hp: 60, atk: 5 }]], event: ['evt_superflame_breath', 'Superflame Breath', 'Souffle de superflamme', 'Spyro unleashes a powered-up flame that scorches all enemies.', 'Spyro libere une flamme surpuissante qui calcine tous les ennemis.'], theme: 'dragon realms, gems, portals, gliding, and colorful platforming magic', motif: 'castle', colors: ['#2b1750', '#05020a', '#b56dff'] },
    { key: 'rayman', universe: 'Rayman', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Rayman', stage: 'Dream Forest Electoon Rift', boss: 'Mr Dark Nightmare Hand', hero: ['rayman_hero', 'Rayman', 'slayer'], allies: [['globox_rayman', 'Globox', 'marine'], ['betilla_rayman', 'Betilla', 'hacker']], monsters: ['Livid Dead', 'Dark Teensy', 'Lum Thief'], bosses: ['Mr Dark', 'Razoff'], gear: [['lum_magnet', 'Lum Magnet', 'Aimant a Lums', { spd: 2, hp: 50 }], ['plumbers_fist', 'Plumber s Fist', 'Poing du plombier', { atk: 9, def: 3 }], ['fairy_bottle', 'Fairy Bottle', 'Flacon de fee', { hp: 75, def: 4 }]], event: ['evt_moskito_ride', 'Moskito Ride', 'Chevauchee de Moskito', 'Rayman rides a Moskito, strafing enemies from above.', 'Rayman chevauche un Moskito et mitraille les ennemis depuis les airs.'], theme: 'limbless platforming, dream worlds, lums, strange music, and surreal cartoon hazards', motif: 'arcanecity', colors: ['#1b3f39', '#030807', '#ffdc4a'] },
    { key: 'croc', universe: 'Croc', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Croc', stage: 'Gobbo Island Baron Raid', boss: 'Baron Dante Crystal Beast', hero: ['croc_hero', 'Croc', 'slayer'], allies: [['gobbo_chief', 'Gobbo Chief', 'tactical'], ['beany_bird', 'Beany Bird', 'hacker']], monsters: ['Dantini Guard', 'Jelly Monster', 'Fire Imp'], bosses: ['Baron Dante', 'Flibby'], gear: [['crystal_heart', 'Crystal Heart', 'Coeur de cristal', { hp: 80, def: 4 }], ['gobbo_balloon', 'Gobbo Balloon', 'Ballon Gobbo', { spd: 2, hp: 40 }], ['barons_key', 'Baron s Key', 'Cle du Baron', { atk: 8, def: 5 }]], event: ['evt_gobbo_stampede', 'Gobbo Stampede', 'Ruee des Gobbos', 'A horde of rescued Gobbos stampedes across the field, trampling enemies.', 'Une horde de Gobbos sauves pietine le terrain et ecrase les ennemis.'], theme: 'gobbo rescue, island castles, crystal monsters, and cheerful platform adventure', motif: 'castle', colors: ['#163b18', '#030803', '#7dff5a'] },
    { key: 'parasite_eve', universe: 'Parasite Eve', mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Parasite Eve', stage: 'NYC Mitochondria Opera', boss: 'Eve Ultimate Being', hero: ['aya_brea', 'Aya Brea', 'tactical'], allies: [['daniel_dollis', 'Daniel Dollis', 'marine'], ['maeda_pe', 'Kunihiko Maeda', 'hacker']], monsters: ['Mutant Rat', 'Slime Pod', 'Evolved Bird'], bosses: ['Eve Ultimate Being', 'Maya Brea'], gear: [['club_2_tonfa', 'Club 2 Tonfa', 'Tonfa Club 2', { atk: 9, spd: 1 }], ['parasite_energy_cell', 'Parasite Energy Cell', 'Cellule d energie parasite', { atk: 7, hp: 55 }], ['nypd_badge', 'NYPD Badge', 'Insigne du NYPD', { def: 6, hp: 50 }]], event: ['evt_liberate_mitochondria', 'Liberate Mitochondria', 'Liberation mitochondriale', 'Aya unleashes her parasite energy, igniting enemy cells from within.', 'Aya libere son energie parasite et embrase les cellules ennemies de l interieur.'], theme: 'mitochondrial horror, opera mutations, police investigation, and biological ascension', motif: 'facility', colors: ['#261314', '#050202', '#ff5f4a'] },
    { key: 'oddworld', universe: 'Oddworld', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Oddworld', stage: 'RuptureFarms Mudokon Escape', boss: 'Molluck Industrial Grinder', hero: ['abe_oddworld', 'Abe', 'hacker'], allies: [['munch_oddworld', 'Munch', 'tactical'], ['alf_mudokon', 'Alf', 'marine']], monsters: ['Slig Guard', 'Scrab', 'Paramite'], bosses: ['Molluck', 'Vykker Surgeon'], gear: [['soulstorm_brew', 'SoulStorm Brew', 'Breuvage SoulStorm', { atk: 8, spd: 1 }], ['mudokon_pop', 'Mudokon Pop', 'Soda Mudokon', { hp: 65, def: 3 }], ['elum_saddle', 'Elum Saddle', 'Selle d Elum', { spd: 2, hp: 45 }]], event: ['evt_possession_chant', 'Possession Chant', 'Chant de possession', 'Abe chants and possesses an enemy, turning them against their allies.', 'Abe psalmodie et possede un ennemi, le retournant contre ses allies.'], theme: 'industrial slavery, Mudokon chanting, possession puzzles, and dark alien satire', motif: 'facility', colors: ['#162b22', '#030605', '#7edc8a'] },
    { key: 'legacy_kain', universe: 'Legacy of Kain', mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Legacy of Kain', stage: 'Nosgoth Soul Reaver Rift', boss: 'Elder God Fate Engine', hero: ['kain_lok', 'Kain', 'horror'], allies: [['raziel_lok', 'Raziel', 'slayer'], ['moebius_lok', 'Moebius', 'hacker']], monsters: ['Vampire Fledgling', 'Sarafan Knight', 'Hylden Beast'], bosses: ['Elder God', 'Hash ak gik'], gear: [['soul_reaver_shard', 'Soul Reaver Shard', 'Eclat du Soul Reaver', { atk: 11, spd: 1 }], ['reaver_bolt', 'Reaver Bolt', 'Trait du Reaver', { atk: 8, def: 4 }], ['pillars_fragment', 'Pillars Fragment', 'Fragment des Piliers', { hp: 70, def: 5 }]], event: ['evt_soul_drain', 'Soul Drain', 'Drain d ame', 'Raziel devours enemy souls, healing allies and weakening foes.', 'Raziel devore les ames ennemies, soignant les allies et affaiblissant les adversaires.'], theme: 'vampire dynasties, soul reaving, fate loops, and decaying gothic Nosgoth', motif: 'castle', colors: ['#201126', '#040205', '#8d5aff'] },
    { key: 'rugrats', universe: 'Rugrats', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Rugrats', stage: 'Backyard Baby Imagination', boss: 'Reptar Toy Rampage', hero: ['tommy_pickles', 'Tommy Pickles', 'hacker'], allies: [['chuckie_finster', 'Chuckie Finster', 'tactical'], ['angelica_pickles', 'Angelica Pickles', 'horror']], theme: 'baby imagination, household objects, Reptar fantasies, and tiny-scale adventure logic', motif: 'arcanecity', colors: ['#2e3d17', '#060803', '#c7ff4a'] },
    { key: 'guitar_hero', universe: 'Guitar Hero', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Guitar Hero', stage: 'Stadium Note Highway', boss: 'Star Power Feedback Demon', hero: ['guitar_hero_avatar', 'Guitar Hero', 'slayer'], allies: [['judy_nails', 'Judy Nails', 'hacker'], ['axel_steel', 'Axel Steel', 'marine']], monsters: ['Off-Beat Note', 'Feedback Ghost', 'Amp Overload'], bosses: ['Devil Went Down', 'Star Power Demon'], gear: [['whammy_bar', 'Whammy Bar', 'Barre de vibrato', { atk: 8, spd: 2 }], ['star_power_gem', 'Star Power Gem', 'Gemme Star Power', { atk: 10, hp: 40 }], ['guitar_pick_destiny', 'Guitar Pick of Destiny', 'Mediator du destin', { atk: 11 }]], event: ['evt_gh_star_power', 'Star Power Solo', 'Solo Star Power', 'A blazing guitar solo doubles attack power for the entire squad.', 'Un solo de guitare enflamme double la puissance d attaque de toute l escouade.'], theme: 'note highways, star power, plastic guitars, crowd energy, and rhythm duel spectacle', motif: 'facility', colors: ['#241433', '#050207', '#ff4fd8'] },
    { key: 'disenchantment', universe: 'Disenchantment', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Desenchantee', stage: 'Dreamland Castle Curse Breach', boss: 'Dagmar Enchantress Doom', hero: ['bean_disenchantment', 'Bean', 'slayer'], allies: [['elfo_disenchantment', 'Elfo', 'hacker'], ['luci_disenchantment', 'Luci', 'horror']], monsters: ['Dreamland Guard', 'Enchanted Forest Ogre', 'Steamland Automaton'], bosses: ['Dagmar Spell Cascade', 'Trog Invasion Leader'], gear: [['bean_axe', 'Bean Royal Axe', 'Hache royale de Bean', { atk: 10, spd: 1 }], ['elfo_candy', 'Elfwood Candy Flask', 'Flasque bonbon Elfwood', { hp: 70, def: 3 }], ['luci_flask', 'Luci Demon Flask', 'Flasque demon de Luci', { atk: 7, spd: 2 }]], event: ['evt_disenchantment_curse', 'Dreamland Royal Curse', 'Malediction royale Dreamland', 'Bean channels the Dreamland curse to petrify enemies and drain their will.', 'Bean canalise la malediction de Dreamland pour petrifier les ennemis et drainer leur volonte.'], theme: 'cursed medieval kingdom, sarcastic princess, demon companion, elf misadventures, dark royal magic, and Dreamland chaos', motif: 'castle', colors: ['#2a1b3d', '#05030a', '#c78fff'] },
    {
      key: 'simpsons',
      universe: 'The Simpsons',
      mediaType: 'series',
      faction: 'arcane',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Les Simpson',
      stage: 'Springfield Nuclear Gag Breach',
      boss: 'Mr Burns Reactor Scheme',
      hero: ['homer_simpson', 'Homer Simpson', 'horror'],
      allies: [['bart_simpson', 'Bart Simpson', 'slayer'], ['lisa_simpson', 'Lisa Simpson', 'hacker']],
      monsters: ['Itchy and Scratchy Bot', 'Springfield Power Mutant', 'Kang and Kodos Probe'],
      bosses: ['Mr Burns Nuclear Scheme', 'Sideshow Bob Revenge Plot'],
      gear: [['simpsons_donut', 'Homer s Emergency Donut', 'Donut d urgence de Homer', { hp: 80 }], ['simpsons_sax', 'Lisa s Baritone Sax', 'Saxophone baryton de Lisa', { atk: 7, spd: 2 }], ['simpsons_slingshot', 'Bart s Slingshot', 'Lance-pierre de Bart', { atk: 8, def: 3 }]],
      event: ['evt_simpsons_couch', 'Couch Gag Reset', 'Reinitialisation du gag du canape', 'The scene restarts with the family already in position, restoring allies while preserving mission progress.', 'La scene recommence avec la famille deja en place, restaure les allies tout en conservant la progression de mission.'],
      theme: 'Springfield satire, nuclear accidents, family chaos, and endless sitcom reality resets',
      motif: 'arcanecity',
      colors: ['#2e2b12', '#070603', '#ffd83d']
    },
    { key: 'futurama', universe: 'Futurama', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Futurama', stage: 'Planet Express Timeline Leak', boss: 'Hypnotoad Delivery Singularity', hero: ['fry_futurama', 'Philip J. Fry', 'hacker'], allies: [['leela_futurama', 'Leela', 'slayer'], ['bender_futurama', 'Bender', 'marine']], monsters: ['Robot Mafia Enforcer', 'Brain Slug Host', 'Momcorp Killbot'], bosses: ['Roberto Knife Bot', 'Hypnotoad Broadcast'], theme: 'future delivery work, robot crime, alien bureaucracy, and time paradox comedy', motif: 'shipdeck', colors: ['#152b3d', '#03070a', '#55dfff'] },
    { key: 'big_mouth', universe: 'Big Mouth', mediaType: 'series', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'Big Mouth', stage: 'Hormone Monster Hallway', boss: 'Depression Kitty Spiral', hero: ['maury_hm', 'Maury the Hormone Monster', 'horror'], allies: [['connie_hm', 'Connie the Hormone Monstress', 'slayer'], ['shame_wizard_hm', 'Shame Wizard', 'hacker']], monsters: ['Anxiety Mosquito', 'Puberty Troll', 'Lovebug Swarm'], bosses: ['Shame Wizard Spiral', 'Hate Worm Outbreak'], gear: [['hm_pillow', 'Hormone Monster Pillow', 'Oreiller de monstre hormonal', { hp: 65, def: 4 }], ['shame_cloak', 'Shame Wizard Cloak', 'Cape du Sorcier de la Honte', { def: 7, spd: 1 }], ['lovebug_jar', 'Lovebug Specimen Jar', 'Bocal a Lovebug', { atk: 8, hp: 30 }]], event: ['evt_bigmouth_hormone_surge', 'Hormone Surge Wave', 'Vague hormonale', 'Maury triggers a massive hormone surge that confuses enemies and boosts ally attack speed.', 'Maury declenche une vague hormonale massive qui deroute les ennemis et accelere les allies.'], theme: 'hormone monsters, puberty chaos, emotional avatars, anxiety mosquitos, shame wizards, and surreal adolescent psychology', motif: 'hauntedset', colors: ['#2b1730', '#060307', '#ff6aa5'] },
    { key: 'family_guy', universe: 'Family Guy', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Griffin', stage: 'Quahog Cutaway Rift', boss: 'Chicken Fight Continuity Break', hero: ['peter_griffin', 'Peter Griffin', 'horror'], allies: [['stewie_griffin', 'Stewie Griffin', 'hacker'], ['brian_griffin', 'Brian Griffin', 'tactical']], theme: 'cutaway gags, Quahog chaos, talking dogs, and reality-breaking comedy loops', motif: 'arcanecity', colors: ['#203350', '#05070a', '#7dc7ff'] },
    { key: 'american_dad', universe: 'American Dad', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Medium', titleFr: 'American Dad', stage: 'CIA Langley Alien Coverup', boss: 'Roger Persona Cascade', hero: ['stan_smith', 'Stan Smith', 'marine'], allies: [['roger_alien', 'Roger', 'hacker'], ['hayley_smith', 'Hayley Smith', 'tactical']], theme: 'CIA paranoia, alien disguises, family politics, and absurd covert operations', motif: 'facility', colors: ['#182b44', '#030609', '#ff4f5c'] },
    { key: 'killzone', universe: 'Killzone', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Killzone', stage: 'Helghan Warzone Breach', boss: 'Helghast MAWLR Command', hero: ['sev_killzone', 'Sev', 'marine'], allies: [['rico_killzone', 'Rico', 'slayer'], ['echo_killzone', 'Echo', 'tactical']], monsters: ['Helghast Trooper', 'Helghast Sniper', 'Spider Mine'], bosses: ['Colonel Radec', 'MAWLR'], gear: [['sta52_rifle_mod', 'StA52 Rifle Mod', 'Mod fusil StA52', { atk: 10, def: 3 }], ['petrusite_cell', 'Petrusite Cell', 'Cellule de petrusite', { atk: 8, hp: 45 }], ['isa_medpack', 'ISA Medpack', 'Medikit ISA', { hp: 85, def: 3 }]], event: ['evt_arc_cannon_burst', 'Arc Cannon Burst', 'Salve de canon a arc', 'A devastating arc cannon blast electrifies the battlefield.', 'Un tir devastateur de canon a arc electrifie le champ de bataille.'], theme: 'Helghast warfare, ISA squads, industrial planets, and red-eyed battlefield pressure', motif: 'fortress', colors: ['#171d22', '#030405', '#ff3d32'] },
    { key: 'yakuza', universe: 'Yakuza', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Yakuza', stage: 'Kamurocho Street Brawl', boss: 'Tojo Clan Dragon Trial', hero: ['kiryu_yakuza', 'Kazuma Kiryu', 'slayer'], allies: [['majima_yakuza', 'Goro Majima', 'horror'], ['ichiban_yakuza', 'Ichiban Kasuga', 'tactical']], monsters: ['Yakuza Thug', 'Chinese Mafia Fighter', 'Dojima Enforcer'], bosses: ['Ryuji Goda', 'Nishikiyama'], gear: [['dragon_mail_gauntlet', 'Dragon Mail Gauntlet', 'Gantelet du dragon postal', { atk: 10, def: 4 }], ['staminan_royale', 'Staminan Royale', 'Staminan Royale', { hp: 90 }], ['legendary_tojo_ring', 'Legendary Tojo Ring', 'Anneau legendaire du Tojo', { atk: 8, spd: 2 }]], event: ['evt_tiger_drop', 'Tiger Drop', 'Frappe du tigre', 'Kiryu counters with a devastating Tiger Drop that shatters enemy defenses.', 'Kiryu contre-attaque avec un Tiger Drop devastateur qui brise les defenses ennemies.'], theme: 'street brawls, clan honor, karaoke side quests, and dramatic crime melodrama', motif: 'arcanecity', colors: ['#221313', '#040202', '#ff5252'] },
    { key: 'soul_calibur', universe: 'Soul Calibur', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Soul Calibur', stage: 'Cursed Sword Duel Shrine', boss: 'Inferno Soul Edge Avatar', hero: ['nightmare_sc', 'Nightmare', 'horror'], allies: [['siegfried_sc', 'Siegfried', 'slayer'], ['ivy_sc', 'Ivy', 'tactical']], monsters: ['Lizardman', 'Berserker', 'Malfested Soldier'], bosses: ['Inferno', 'Nightmare Soulcalibur'], gear: [['soul_edge_shard', 'Soul Edge Shard', 'Eclat de Soul Edge', { atk: 11, hp: 40 }], ['guard_impact_brace', 'Guard Impact Brace', 'Brassard de parade', { def: 7, spd: 1 }], ['ring_of_power', 'Ring of Power', 'Anneau de puissance', { atk: 8, def: 4 }]], event: ['evt_critical_edge', 'Critical Edge', 'Tranchant critique', 'A soul-charged blade strike deals massive damage to all enemies.', 'Une frappe chargee d ame inflige des degats massifs a tous les ennemis.'], theme: 'cursed blades, weapon masters, ancient arenas, and soul-consuming sword rituals', motif: 'castle', colors: ['#191326', '#030205', '#806dff'] },
    { key: 'last_of_us', universe: 'The Last of Us', mediaType: 'game', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'The Last of Us', stage: 'Cordyceps Quarantine Zone', boss: 'Bloater Spore Nest', hero: ['ellie_tlou', 'Ellie', 'slayer'], allies: [['joel_tlou', 'Joel', 'marine'], ['tess_tlou', 'Tess', 'tactical']], monsters: ['Runner', 'Clicker', 'Bloater'], bosses: ['David', 'Rat King'], gear: [['shiv', 'Shiv', 'Cisaille', { atk: 7, spd: 2 }], ['molotov_kit', 'Molotov Kit', 'Kit Molotov', { atk: 10 }], ['ellies_switchblade', 'Ellie s Switchblade', 'Cran d arret d Ellie', { atk: 8, spd: 1 }]], event: ['evt_listen_mode_pulse', 'Listen Mode Pulse', 'Impulsion mode ecoute', 'Enhanced hearing reveals all enemies and boosts squad evasion.', 'L ouie amplifiee revele tous les ennemis et ameliore l esquive de l escouade.'], theme: 'cordyceps infection, ruined cities, stealth survival, and found-family desperation', motif: 'wasteland', colors: ['#1d2518', '#030403', '#a0b86a'] },
    { key: 'little_big_planet', universe: 'LittleBigPlanet', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'LittleBigPlanet', stage: 'Craftworld Sticker Breach', boss: 'Negativitron Stitch Storm', hero: ['sackboy_lbp', 'Sackboy', 'hacker'], allies: [['sackgirl_lbp', 'Sackgirl', 'tactical'], ['toggle_lbp', 'Toggle', 'marine']], monsters: ['Negativitron Spawn', 'Meanie Guard', 'Bounce Pad Trap'], bosses: ['Negativitron', 'Collector'], gear: [['grappling_hook_lbp', 'Grappling Hook', 'Grappin', { spd: 2, def: 4 }], ['jetpack_lbp', 'Jetpack', 'Jetpack', { spd: 3, atk: 5 }], ['prize_bubble', 'Prize Bubble', 'Bulle de prix', { hp: 70, def: 3 }]], event: ['evt_popit_power', 'Popit Power', 'Pouvoir du Popit', 'Sackboy opens the Popit menu and creates obstacles that block enemy attacks.', 'Sackboy ouvre le menu Popit et cree des obstacles qui bloquent les attaques ennemies.'], theme: 'Craftworld creativity, stickers, handmade physics, and imagination-powered platforming', motif: 'arcanecity', colors: ['#2b2113', '#050403', '#f2c06b'] },
    { key: 'counter_strike', universe: 'Counter-Strike', mediaType: 'game', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Counter-Strike', stage: 'Dust II Bombsite Breach', boss: 'Defuse Timer Singularity', hero: ['ct_operator_cs', 'CT Operator', 'tactical'], allies: [['terrorist_cs', 'Rogue Terrorist', 'slayer'], ['awper_cs', 'AWPer', 'marine']], monsters: ['Hostage Guard', 'Rogue Agent', 'Flashbang Drone'], bosses: ['Ace Clutch Boss', 'Defuse Timer Singularity'], gear: [['awp_scope', 'AWP Scope', 'Lunette AWP', { atk: 11, spd: 1 }], ['kevlar_vest', 'Kevlar Vest', 'Gilet en Kevlar', { def: 8, hp: 45 }], ['defuse_kit_cs', 'Defuse Kit', 'Kit de desamorcage', { spd: 2, def: 4 }]], event: ['evt_ace_clutch_round', 'Ace Clutch Round', 'Round ace clutch', 'The operator clutches the round solo, eliminating all enemies in sequence.', 'L operateur clutch le round en solo et elimine tous les ennemis en sequence.'], theme: 'bombsites, economy rounds, tactical peeks, defuse kits, and esports pressure', motif: 'facility', colors: ['#222820', '#050605', '#d7b45a'] },
    { key: 'left_4_dead', universe: 'Left 4 Dead', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Left 4 Dead', stage: 'No Mercy Rooftop Horde', boss: 'Tank Witch Crescendo', hero: ['zoey_l4d', 'Zoey', 'slayer'], allies: [['bill_l4d', 'Bill', 'marine'], ['ellis_l4d', 'Ellis', 'tactical']], monsters: ['Common Infected', 'Smoker', 'Hunter'], bosses: ['Tank', 'Witch'], gear: [['first_aid_kit_l4d', 'First Aid Kit', 'Trousse de premiers soins', { hp: 90, def: 3 }], ['pipe_bomb_l4d', 'Pipe Bomb', 'Bombe artisanale', { atk: 10 }], ['auto_shotgun_mod', 'Auto Shotgun Mod', 'Mod fusil a pompe auto', { atk: 9, def: 4 }]], event: ['evt_panic_event_horde', 'Panic Event Horde', 'Horde de panique', 'A massive infected horde swarms the battlefield, overwhelming enemies.', 'Une horde massive d infectes envahit le terrain et submerge les ennemis.'], theme: 'co-op zombie hordes, safe rooms, special infected, and desperate extraction finales', motif: 'hauntedset', colors: ['#1a1812', '#030302', '#d6563c'] },
    { key: 'team_fortress_2', universe: 'Team Fortress 2', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Team Fortress 2', stage: '2Fort Payload Breach', boss: 'Mann Co. Mercenary Stampede', hero: ['scout_tf2', 'Scout', 'slayer'], allies: [['heavy_tf2', 'Heavy', 'marine'], ['medic_tf2', 'Medic', 'hacker']], theme: 'class-based mayhem, payloads, hats, mercenary banter, and cartoon explosives', motif: 'fortress', colors: ['#2c1a14', '#060302', '#ff7a45'] },
    { key: 'lost_planet_2', universe: 'Lost Planet 2', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Lost Planet 2', stage: 'EDN III Akrid Hunt', boss: 'Category G Akrid Leviathan', hero: ['snow_pirate_lp2', 'Snow Pirate', 'marine'], allies: [['wayne_lp2', 'Wayne Echo', 'slayer'], ['thermal_engineer_lp2', 'Thermal Engineer', 'hacker']], theme: 'Akrid hunts, thermal energy, hostile planets, giant monsters, and armored squad warfare', motif: 'wasteland', colors: ['#132a35', '#020608', '#62d9ff'] },
    { key: 'seaman', universe: 'Seaman', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Seaman', stage: 'Talking Aquarium Rift', boss: 'Evolved Seaman Oracle', hero: ['seaman_oracle', 'Seaman', 'hacker'], allies: [['aquarium_keeper', 'Aquarium Keeper', 'tactical'], ['frogman_seaman', 'Frogman Echo', 'horror']], theme: 'talking fish psychology, aquarium care, surreal life simulation, and strange conversations', motif: 'facility', colors: ['#12343b', '#020708', '#6ee6d8'] },
    { key: 'jet_set_radio', universe: 'Jet Set Radio', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Jet Set Radio', stage: 'Tokyo-to Graffiti Run', boss: 'Rokkaku Police Tank', hero: ['beat_jsr', 'Beat', 'slayer'], allies: [['gum_jsr', 'Gum', 'tactical'], ['professor_k_jsr', 'Professor K', 'hacker']], theme: 'inline skating, pirate radio, graffiti tags, police chases, and cel-shaded rebellion', motif: 'arcanecity', colors: ['#102d2a', '#020605', '#5dff8a'] },
    { key: 'dynamite_duke', universe: 'Dynamite Duke', mediaType: 'game', faction: 'sciFi', mode: 'Smash', difficulty: 'Medium', titleFr: 'Dynamite Duke', stage: 'Bio-Army Arcade Assault', boss: 'Mutant Commander Duke Duel', hero: ['dynamite_duke', 'Duke', 'marine'], allies: [['arcade_commando_duke', 'Arcade Commando', 'slayer'], ['intel_duke', 'Intel Operator', 'hacker']], theme: 'arcade run-and-gun action, mutant soldiers, explosions, and punch-heavy commando raids', motif: 'facility', colors: ['#2a1f14', '#050403', '#ff9b3d'] },
    { key: 'altered_beast', universe: 'Altered Beast', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Altered Beast', stage: 'Ancient Beast Resurrection', boss: 'Neff Demon God', hero: ['centurion_ab', 'Beast Centurion', 'horror'], allies: [['werewolf_ab', 'Werewolf Form', 'slayer'], ['zeus_ab', 'Zeus Signal', 'hacker']], theme: 'ancient resurrection, beast transformations, mythic demons, and arcade body horror', motif: 'castle', colors: ['#251612', '#050302', '#d6a04a'] },
    { key: 'streets_of_rage', universe: 'Streets of Rage', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Streets of Rage', stage: 'Wood Oak City Riot', boss: 'Mr X Syndicate Tower', hero: ['axel_sor', 'Axel Stone', 'slayer'], allies: [['blaze_sor', 'Blaze Fielding', 'slayer'], ['adam_sor', 'Adam Hunter', 'tactical']], theme: 'street brawling, crime syndicates, neon alleys, police specials, and beat-em-up rhythm', motif: 'arcanecity', colors: ['#1e1428', '#040306', '#ff4f9a'] },
    { key: 'cool_spot', universe: 'Cool Spot', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Cool Spot', stage: 'Soda Beach Bubble Pop', boss: 'Bottle Cap Brand Storm', hero: ['cool_spot', 'Cool Spot', 'slayer'], allies: [['bubble_spot', 'Bubble Spot', 'hacker'], ['lifeguard_spot', 'Beach Guard', 'tactical']], theme: 'brand mascot platforming, soda bubbles, beach hazards, and 90s advertising surrealism', motif: 'wasteland', colors: ['#301018', '#070203', '#ff2f55'] },
    { key: 'earthworm_jim', universe: 'Earthworm Jim', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Earthworm Jim', stage: 'New Junk City Launch', boss: 'Psy-Crow Queen Slug-for-a-Butt', hero: ['earthworm_jim', 'Earthworm Jim', 'slayer'], allies: [['peter_puppy', 'Peter Puppy', 'horror'], ['princess_whats_her_name', 'Princess Whats-Her-Name', 'tactical']], theme: 'absurd platform shooting, worm-in-suit heroics, junk planets, and cartoon cosmic nonsense', motif: 'wasteland', colors: ['#18351f', '#030703', '#aaff4d'] },
    { key: 'ecco', universe: 'Ecco the Dolphin', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Hard', titleFr: 'Ecco the Dolphin', stage: 'Tides of Time Ocean Rift', boss: 'Vortex Queen Deep Signal', hero: ['ecco_dolphin', 'Ecco', 'hacker'], allies: [['atlantean_ecco', 'Atlantean Glyph', 'tactical'], ['orca_echo', 'Orca Echo', 'marine']], theme: 'ocean exploration, sonar puzzles, alien vortex threats, and time-bending aquatic mystery', motif: 'wasteland', colors: ['#05283f', '#010508', '#4edcff'] },
    { key: 'flashback', universe: 'Flashback', mediaType: 'game', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Flashback', stage: 'Titan Jungle Memory Lab', boss: 'Morph Infiltration Core', hero: ['conrad_flashback', 'Conrad B. Hart', 'tactical'], allies: [['ian_flashback', 'Ian', 'hacker'], ['agent_flashback', 'Resistance Agent', 'marine']], theme: 'rotoscoped sci-fi, erased memories, alien infiltrators, and dystopian platform puzzles', motif: 'facility', colors: ['#10242e', '#020506', '#62d3e8'] },
    { key: 'ristar', universe: 'Ristar', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Ristar', stage: 'Valdi Star Handle Rift', boss: 'Kaiser Greedy Star Tyrant', hero: ['ristar_hero', 'Ristar', 'slayer'], allies: [['star_handle', 'Star Handle', 'hacker'], ['planet_guardian_ristar', 'Planet Guardian', 'tactical']], theme: 'stretchy star heroics, planetary stages, grabbing movement, and colorful cosmic rescue', motif: 'shipdeck', colors: ['#152b4d', '#02050a', '#ffe84d'] },
    { key: 'splatterhouse', universe: 'Splatterhouse', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Splatterhouse', stage: 'West Mansion Gore Rift', boss: 'Terror Mask Hell Beast', hero: ['rick_splatterhouse', 'Rick Taylor', 'horror'], allies: [['jennifer_splatterhouse', 'Jennifer Willis', 'tactical'], ['terror_mask', 'Terror Mask', 'hacker']], theme: 'masked rage, haunted mansions, body horror, and brutal arcade survival', motif: 'hauntedset', colors: ['#250b0b', '#050101', '#ff2a2a'] },
    { key: 'woodruff', universe: 'Woodruff', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Woodruff', stage: 'Bouzouk City Absurdity', boss: 'Bigwig Bureaucratic Tyrant', hero: ['woodruff_hero', 'Woodruff', 'hacker'], allies: [['professor_azimuth', 'Professor Azimuth', 'tactical'], ['boozook_guard', 'Bouzouk Guard', 'slayer']], theme: 'French adventure absurdity, strange puzzles, post-human satire, and bureaucratic surrealism', motif: 'arcanecity', colors: ['#273218', '#050703', '#c8ef58'] },
    { key: 'skibidi', universe: 'Skibidi', mediaType: 'series', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Skibidi', stage: 'Camera City Toilet War', boss: 'Titan Toilet Broadcast Core', hero: ['cameraman_skibidi', 'Cameraman', 'tactical'], allies: [['speakerman_skibidi', 'Speakerman', 'slayer'], ['tvman_skibidi', 'TV Man', 'hacker']], monsters: ['Skibidi Toilet Scout', 'Parasite Toilet Swarm', 'Speaker Jammer Toilet'], bosses: ['Large Skibidi Toilet', 'Glitch Skibidi Toilet'], gear: [['skibidi_camera_lens', 'A.R.C.A. Camera Lens', 'Objectif camera A.R.C.A.', { spd: 2, def: 4 }], ['skibidi_speaker_core', 'Speaker Bass Core', 'Noyau basse speaker', { atk: 9 }], ['skibidi_tv_remote', 'Static TV Remote', 'Telecommande TV statique', { hp: 70, def: 3 }]], event: ['evt_skibidi_signal_jam', 'Signal Jam Chorus', 'Choeur brouillage signal', 'Camera, speaker, and TV units scramble the toilet broadcast before the breach escalates.', 'Les unites camera, speaker et TV brouillent la diffusion toilette avant que la breche escalade.'], theme: 'viral video war, camera soldiers, speaker blasts, TV hypnosis, and surreal toilet invasion escalation', motif: 'arcanecity', colors: ['#171b22', '#030405', '#80e8ff'] },
    { key: 'squid_game', universe: 'Squid Game', mediaType: 'series', faction: 'horror', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Squid Game', stage: 'Red Light Green Light Arena', boss: 'Front Man Debt Trial', hero: ['gi_hun_squid', 'Seong Gi-hun', 'tactical'], allies: [['sae_byeok_squid', 'Sae-byeok', 'slayer'], ['ali_squid', 'Ali Abdul', 'marine']], theme: 'deadly children games, masked guards, debt pressure, and social survival trials', motif: 'facility', colors: ['#24131c', '#050203', '#ff3f8f'] },
    { key: 'casa_papel', universe: 'La Casa de Papel', mediaType: 'series', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'La Casa de Papel', stage: 'Royal Mint Hostage Plan', boss: 'Inspector Siege Countdown', hero: ['professor_casa', 'The Professor', 'hacker'], allies: [['tokyo_casa', 'Tokyo', 'slayer'], ['nairobi_casa', 'Nairobi', 'tactical']], theme: 'heist planning, masks, hostages, police pressure, and rebellion iconography', motif: 'facility', colors: ['#2d1010', '#060202', '#ff2f2f'] },
    { key: 'skrillex', universe: 'Skrillex', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Skrillex', stage: 'Dubstep Bass Drop Breach', boss: 'Wub Singularity', hero: ['skrillex_avatar', 'Skrillex Avatar', 'hacker'], allies: [['bass_rider_skrillex', 'Bass Rider', 'slayer'], ['laser_dj_skrillex', 'Laser DJ', 'tactical']], theme: 'dubstep drops, neon bass pressure, glitch edits, and club-scale sonic ruptures', motif: 'facility', colors: ['#180f2e', '#030206', '#c14dff'] },
    { key: 'gorillaz', universe: 'Gorillaz', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'Gorillaz', stage: 'Plastic Beach Demon Studio', boss: 'Murdoc Bassline Phantom', hero: ['2d_gorillaz', '2-D', 'hacker'], allies: [['noodle_gorillaz', 'Noodle', 'slayer'], ['russel_gorillaz', 'Russel', 'marine']], theme: 'virtual band myth, haunted studios, plastic beaches, and animated genre-shifting sound', motif: 'shipdeck', colors: ['#102e35', '#020608', '#5ed6c8'] },
    { key: 'indila', universe: 'Indila', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Indila', stage: 'Derniere Danse Memory Street', boss: 'Echo of the Lost City', hero: ['indila_avatar', 'Indila Avatar', 'hacker'], allies: [['danse_echo', 'Danse Echo', 'tactical'], ['mini_world_spirit', 'Mini World Spirit', 'slayer']], theme: 'melancholic pop, cinematic streets, memory storms, and emotional resonance waves', motif: 'arcanecity', colors: ['#1d2638', '#03050a', '#d8a0ff'] },
    { key: 'monkey_island', universe: 'Secret of Monkey Island', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Secret of Monkey Island', stage: 'Melee Island Insult Duel', boss: 'LeChuck Ghost Pirate', hero: ['guybrush_threepwood', 'Guybrush Threepwood', 'hacker'], allies: [['elaine_marley', 'Elaine Marley', 'tactical'], ['stan_monkey', 'Stan', 'slayer']], theme: 'pirate comedy, insult swordfighting, ghost curses, and point-and-click puzzle logic', motif: 'wasteland', colors: ['#1b2f3a', '#030608', '#ffd15a'] },
    { key: 'zombies_neighbors', universe: 'Zombies Ate My Neighbors', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Zombies Ate My Neighbors', stage: 'Suburban Monster Rescue', boss: 'Giant Baby Chainsaw Panic', hero: ['zeke_zamn', 'Zeke', 'slayer'], allies: [['julie_zamn', 'Julie', 'tactical'], ['neighbor_rescue', 'Neighbor Rescue', 'hacker']], theme: 'suburban monster chaos, water guns, rescue runs, B-movie enemies, and arcade panic', motif: 'hauntedset', colors: ['#172b18', '#030603', '#7dff4f'] },
    { key: 'wrong_turn', universe: 'Wrong Turn', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Wrong Turn', stage: 'Backwoods Trap Ambush', boss: 'Mountain Clan Butcher', hero: ['jessie_wrongturn', 'Jessie Burlingame', 'tactical'], allies: [['chris_wrongturn', 'Chris Flynn', 'marine'], ['carly_wrongturn', 'Carly', 'hacker']], theme: 'backwoods traps, brutal survival, wrong roads, and isolated forest ambushes', motif: 'wasteland', colors: ['#171f10', '#030402', '#b5d15a'] },
    { key: 'kyary', universe: 'Kyary Pamyu Pamyu', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Kyary Pamyu Pamyu', stage: 'Harajuku Candy Pop Rift', boss: 'Kawaii Nightmare Parade', hero: ['kyary_avatar', 'Kyary Avatar', 'hacker'], allies: [['ponpon_dancer', 'PonPon Dancer', 'slayer'], ['fashion_spirit_kyary', 'Fashion Spirit', 'tactical']], theme: 'Harajuku surreal pop, candy colors, fashion monsters, and dreamlike music-video logic', motif: 'arcanecity', colors: ['#35143a', '#07020a', '#ff78df'] },
    {
      key: 'karune_cal',
      universe: 'Karune Cal',
      mediaType: 'music',
      faction: 'horror',
      mode: 'RPG',
      difficulty: 'Very Hard',
      title: 'Calne Ca (Karune Ca)',
      titleFr: 'Calne Ca (Karune Ca)',
      stage: 'Bacterial Contamination Machine Archive',
      boss: 'Calne Ca Mechanized Casing',
      hero: ['karune_cal_avatar', 'Calne Ca', 'horror'],
      allies: [['calcium_endoskeleton', 'Calcium Endoskeleton', 'slayer'], ['chibi_cal_san', 'Chibi Cal-san', 'hacker']],
      monsters: ['Magnesium Six-Legged Form', 'Isopod Head Parasite', 'Bacterial Contamination Husk'],
      bosses: ['Saikin Osen Organic Form', 'Calcium Exposed Endoskeleton'],
      gear: [['calne_isopod', 'Calne Ca Head Isopod', 'Isopode cranien de Calne Ca', { atk: 8, def: 6 }], ['calcium_tendon', 'Calcium Metal Tendon', 'Tendon metallique de Calcium', { atk: 10, spd: 1 }], ['miku_casing_fragment', 'Miku-Shaped Casing Fragment', 'Fragment de carapace en forme de Miku', { hp: 65, def: 5 }]],
      event: ['evt_calne_casing_split', 'Mechanized Casing Split', 'Ouverture de la carapace mecanisee', 'Calne Ca opens the humanoid casing and exposes Calcium for a precise mechanical strike.', 'Calne Ca ouvre sa carapace humanoide et expose Calcium pour une frappe mecanique precise.'],
      theme: 'Deinos Calne Ca derivative, a Miku-shaped casing around Calcium, exposed machine tendons, isopods, and bacterial contamination body horror',
      motif: 'facility',
      colors: ['#171a22', '#030304', '#65d6e8']
    },
    { key: 'sub_urban', universe: 'Sub Urban', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Sub Urban', stage: 'Cradles Dollhouse Breach', boss: 'Freakshow Shadow Ringmaster', hero: ['sub_urban_avatar', 'Sub Urban Avatar', 'horror'], allies: [['cradles_echo', 'Cradles Echo', 'hacker'], ['freak_dancer_sub', 'Freak Dancer', 'slayer']], theme: 'dark pop, dollhouse imagery, circus unease, and glitchy emotional nightmares', motif: 'hauntedset', colors: ['#201326', '#040205', '#b86cff'] },
    { key: 'billie_eilish', universe: 'Billie Eilish', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Billie Eilish', stage: 'Bad Guy Neon Bedroom', boss: 'Ocean Eyes Nightmare', hero: ['billie_avatar', 'Billie Avatar', 'hacker'], allies: [['neon_shadow_billie', 'Neon Shadow', 'horror'], ['whisper_beat_billie', 'Whisper Beat', 'tactical']], theme: 'whisper pop, neon dread, dreamlike rooms, and quiet bass-heavy menace', motif: 'hauntedset', colors: ['#101812', '#020302', '#86ff61'] },
    { key: 'bella_poarch', universe: 'Bella Poarch', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Bella Poarch', stage: 'Build-a-Breach Doll Factory', boss: 'Inferno Doll Core', hero: ['bella_poarch_avatar', 'Bella Avatar', 'hacker'], allies: [['doll_guard_bella', 'Doll Guard', 'tactical'], ['inferno_dancer_bella', 'Inferno Dancer', 'slayer']], theme: 'viral pop, doll-factory rebellion, hyper-polished visuals, and social-feed glitch combat', motif: 'facility', colors: ['#2a1420', '#050203', '#ff709e'] },
    { key: 'man_with_mission', universe: 'Man with a Mission', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Man with a Mission', stage: 'Wolfhead Rock Operation', boss: 'Mission Bass Predator', hero: ['mwam_avatar', 'Wolfhead Vocalist', 'slayer'], allies: [['dj_santa_monica', 'DJ Santa Monica', 'hacker'], ['rock_commando_mwam', 'Rock Commando', 'marine']], theme: 'wolf-mask rock, anime openings, mission energy, and high-speed live-show combat', motif: 'facility', colors: ['#161f24', '#030405', '#d5e5f0'] },
    { key: 'guns_n_roses', universe: 'Guns N Roses', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Guns N Roses', stage: 'Paradise City Amp Riot', boss: 'Appetite Feedback Serpent', hero: ['gnr_frontman', 'Rose Stage Avatar', 'slayer'], allies: [['slash_avatar', 'Top Hat Guitarist', 'hacker'], ['jungle_drummer_gnr', 'Jungle Drummer', 'marine']], theme: 'hard rock swagger, guitar solos, stadium chaos, and dangerous glam energy', motif: 'arcanecity', colors: ['#2b1111', '#060202', '#ff3f3f'] },
    { key: 'band_maid', universe: 'Band-Maid', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Band-Maid', stage: 'Maid Rock Serving Stage', boss: 'Domination Feedback Core', hero: ['bandmaid_avatar', 'Maid Rocker', 'slayer'], allies: [['guitar_maid', 'Guitar Maid', 'hacker'], ['drum_maid', 'Drum Maid', 'marine']], theme: 'maid costumes, hard rock precision, live-house energy, and disciplined stage assault', motif: 'facility', colors: ['#181818', '#030303', '#f0f0f0'] },
    { key: 'bring_me_horizon', universe: 'Bring Me the Horizon', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Bring Me the Horizon', stage: 'Post-Human Mosh Pit', boss: 'Sempiternal Hex Core', hero: ['bmth_avatar', 'Post-Human Vocalist', 'horror'], allies: [['amo_signal', 'Amo Signal', 'hacker'], ['mosh_guard_bmth', 'Mosh Guard', 'slayer']], theme: 'metalcore surges, cyber-horror visuals, emotional collapse, and arena breakdowns', motif: 'hauntedset', colors: ['#15151f', '#030304', '#ff4f6d'] },
    { key: 'blackpink', universe: 'Blackpink', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Blackpink', stage: 'Pink Venom Arena', boss: 'DDU-DU Cannon Core', hero: ['blackpink_avatar', 'Blackpink Unit', 'slayer'], allies: [['pink_venom_dancer', 'Pink Venom Dancer', 'hacker'], ['blink_guard', 'Blink Guard', 'tactical']], theme: 'K-pop spectacle, fashion weapons, synchronized strikes, and arena-scale bass drops', motif: 'arcanecity', colors: ['#250f1e', '#050203', '#ff5fb7'] },
    { key: 'lil_nas_x', universe: 'Lil Nas X', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Lil Nas X', stage: 'Montero Neon Descent', boss: 'Old Town Road Rift Rider', hero: ['lilnasx_avatar', 'Montero Avatar', 'slayer'], allies: [['star_walkin_echo', 'Star Walkin Echo', 'hacker'], ['rodeo_guard', 'Rodeo Guard', 'tactical']], theme: 'genre fusion, mythic pop imagery, cowboy neon, and self-made spectacle portals', motif: 'arcanecity', colors: ['#27144a', '#05020a', '#ff6bd6'] },
    { key: 'eminem', universe: 'Eminem', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'Eminem', stage: 'Slim Shady Rap Battle', boss: 'Rap God Wordstorm', hero: ['eminem_avatar', 'Slim Shady Avatar', 'hacker'], allies: [['stan_echo', 'Stan Echo', 'horror'], ['detroit_cipher', 'Detroit Cipher', 'tactical']], theme: 'rapid-fire rap, alter egos, battle lyrics, Detroit grit, and verbal pressure waves', motif: 'arcanecity', colors: ['#1c1c1c', '#030303', '#d8d8d8'] },
    { key: 'atarashii_gakko', universe: 'Atarashii Gakko', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Atarashii Gakko', stage: 'Seishun School Riot', boss: 'Discipline Dance Core', hero: ['atarashii_unit', 'Atarashii Unit', 'slayer'], allies: [['school_dancer_ag', 'School Dancer', 'tactical'], ['megaphone_ag', 'Megaphone Signal', 'hacker']], theme: 'school-uniform rebellion, sharp choreography, punk-pop energy, and synchronized chaos', motif: 'facility', colors: ['#171723', '#030304', '#ff3333'] },
    { key: 'queen_bee', universe: 'Queen Bee', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Queen Bee', stage: 'Avu-Chan Honeycomb Stage', boss: 'Hypnotic Hive Diva', hero: ['queen_bee_avatar', 'Queen Bee Avatar', 'hacker'], allies: [['honey_dancer_qb', 'Honey Dancer', 'slayer'], ['velvet_signal_qb', 'Velvet Signal', 'tactical']], theme: 'glam rock, hypnotic vocals, honeycomb visuals, and theatrical identity storms', motif: 'hauntedset', colors: ['#2b1810', '#060302', '#ffc247'] },
    { key: 'ghost_band', universe: 'Ghost', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Ghost', stage: 'Ritual Chapel Concert', boss: 'Papa Emeritus Antipope', hero: ['papa_emeritus', 'Papa Emeritus', 'horror'], allies: [['nameless_ghoul', 'Nameless Ghoul', 'slayer'], ['sister_imperator', 'Sister Imperator', 'tactical']], theme: 'occult rock, cathedral staging, masked musicians, and ritualized arena spectacle', motif: 'castle', colors: ['#1c1218', '#030203', '#d9b86b'] },
    { key: 'babymetal', universe: 'Babymetal', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Babymetal', stage: 'Fox God Metal Galaxy', boss: 'Kami Band Rift Fox', hero: ['babymetal_unit', 'Babymetal Unit', 'slayer'], allies: [['fox_god_signal', 'Fox God Signal', 'hacker'], ['kami_band_guard', 'Kami Band Guard', 'marine']], theme: 'kawaii metal, fox mythology, synchronized dance, and heavy galaxy riffs', motif: 'castle', colors: ['#1b0f18', '#030203', '#ff335f'] },
    { key: 'ladybaby', universe: 'Ladybaby', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Ladybaby', stage: 'Kawaii Metal Pop Burst', boss: 'Cute Riot Feedback', hero: ['ladybaby_unit', 'Ladybaby Unit', 'slayer'], allies: [['idol_guard_ladybaby', 'Idol Guard', 'tactical'], ['metal_cute_signal', 'Metal Cute Signal', 'hacker']], theme: 'idol metal fusion, cute chaos, heavy riffs, and bright stage absurdity', motif: 'arcanecity', colors: ['#311727', '#070304', '#ff79c8'] },
    { key: 'bigflo_oli', universe: 'Bigflo & Oli', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Bigflo & Oli', stage: 'Toulouse Rap Storyline', boss: 'Narrative Verse Storm', hero: ['bigflo_oli_unit', 'Bigflo & Oli', 'hacker'], allies: [['toulouse_crowd', 'Toulouse Crowd', 'tactical'], ['verse_guard_bfo', 'Verse Guard', 'slayer']], theme: 'French rap storytelling, brother duo energy, city pride, and emotional verse missions', motif: 'arcanecity', colors: ['#1b2a38', '#030506', '#ffb14f'] },
    {
      key: 'little_big_band',
      universe: 'Little Big',
      mediaType: 'music',
      faction: 'cyber',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Little Big',
      stage: 'Skibidi Rave Video Set',
      boss: 'Generation Cancellation Broadcast',
      hero: ['ilya_prusikin_lb', 'Ilya Ilich Prusikin', 'slayer'],
      allies: [['sonya_tayurskaya_lb', 'Sonya Tayurskaya', 'slayer'], ['danny_zuckerman_lb', 'Danny Zuckerman', 'hacker'], ['viktor_sibrinin_lb', 'Viktor Sibrinin', 'tactical']],
      monsters: ['Skibidi Dance Double', 'Lolly Bomb Android', 'Hypnodancer Guard'],
      bosses: ['UNO Rave Champion', 'Lobster Popstar'],
      gear: [['littlebig_moustache', 'Ilich Stage Moustache', 'Moustache de scene d Ilich', { atk: 7, spd: 2 }], ['littlebig_uno_jacket', 'UNO Stage Jacket', 'Veste de scene UNO', { def: 6, hp: 55 }], ['littlebig_lobster_claws', 'Lobster Popstar Claws', 'Pinces Lobster Popstar', { atk: 10, hp: 35 }]],
      event: ['evt_littlebig_skibidi', 'Skibidi Choreography Break', 'Rupture choregraphique Skibidi', 'The current Little Big lineup turns synchronized absurdity into a hard-bass knockback wave.', 'La formation actuelle de Little Big transforme une choregraphie absurde synchronisee en onde de recul hard-bass.'],
      theme: 'Ilya Prusikin, Sonya Tayurskaya, Danny Zuckerman, Viktor Sibrinin, punk-pop-rave satire, and physical music-video choreography',
      motif: 'facility',
      colors: ['#25143a', '#050208', '#8dff4a']
    },
    { key: 'the_weeknd', universe: 'The Weeknd', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'The Weeknd', stage: 'After Hours Neon City', boss: 'Blinding Lights Red Suit', hero: ['weeknd_avatar', 'After Hours Avatar', 'hacker'], allies: [['neon_driver_weeknd', 'Neon Driver', 'tactical'], ['starboy_echo', 'Starboy Echo', 'slayer']], theme: 'nocturnal pop, neon city drives, red-suit imagery, and cinematic synthwave loneliness', motif: 'arcanecity', colors: ['#171326', '#030205', '#ff2f4f'] },
    { key: 'hoshi_music', universe: 'Hoshi', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Hoshi', stage: 'Coeur Parapluie Signal', boss: 'Amour Censure Storm', hero: ['hoshi_avatar', 'Hoshi Avatar', 'hacker'], allies: [['parapluie_echo', 'Parapluie Echo', 'tactical'], ['coeur_guard_hoshi', 'Coeur Guard', 'slayer']], theme: 'French pop emotion, intimate stages, heart imagery, and sincere vocal resonance', motif: 'arcanecity', colors: ['#251b28', '#050305', '#ff8fb6'] },
    { key: 'ado', universe: 'Ado', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Ado', stage: 'Usseewa Vocal Storm', boss: 'Show Shadow Diva', hero: ['ado_avatar', 'Ado Avatar', 'horror'], allies: [['uta_echo_ado', 'Uta Echo', 'hacker'], ['rebellion_dancer_ado', 'Rebellion Dancer', 'slayer']], theme: 'powerful vocals, rebellious silhouettes, anime-stage intensity, and shadowed pop theatre', motif: 'hauntedset', colors: ['#171327', '#030205', '#3f6dff'] },
    { key: 'asmrz', universe: 'ASMRZ', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Medium', titleFr: 'ASMRZ', stage: 'Good Night Ojou-sama Mansion Set', boss: 'A.R.C.A. Good Night Choreography Echo', hero: ['asmrz_avatar', 'TANAKA', 'hacker'], allies: [['whisper_operator', 'NEEDMORECASH', 'tactical'], ['microphone_guard', 'GWANA', 'hacker']], theme: 'the TANAKA and NEEDMORECASH butler personas, multilingual bedtime warnings, formal service bells, and the viral Good Night Ojou-sama choreography produced by GWANA', motif: 'facility', colors: ['#14252a', '#030506', '#8fffea'] },
    { key: 'lady_gaga', universe: 'Lady Gaga', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Lady Gaga', stage: 'Chromatica Fame Monster', boss: 'Bad Romance Paparazzi Core', hero: ['gaga_avatar', 'Gaga Avatar', 'slayer'], allies: [['little_monster_guard', 'Little Monster Guard', 'hacker'], ['chromatica_dancer', 'Chromatica Dancer', 'tactical']], theme: 'theatrical pop, fame monsters, fashion armor, and arena-scale reinvention rituals', motif: 'arcanecity', colors: ['#2e1431', '#060207', '#ff78ff'] },
    { key: 'within_temptation', universe: 'Within Temptation', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Within Temptation', stage: 'Symphonic Storm Cathedral', boss: 'Mother Earth Angel Core', hero: ['within_temptation_avatar', 'Symphonic Guardian', 'hacker'], allies: [['angelic_guitar_wt', 'Angelic Guitar', 'slayer'], ['cathedral_drum_wt', 'Cathedral Drum', 'marine']], theme: 'symphonic metal, gothic choirs, angelic storms, and cinematic fantasy battlefields', motif: 'castle', colors: ['#151c2a', '#030406', '#9fd8ff'] },
    { key: 'nightwish', universe: 'Nightwish', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Nightwish', stage: 'Imaginaerum Dream Theater', boss: 'Dark Passion Play Titan', hero: ['nightwish_avatar', 'Imaginaerum Bard', 'hacker'], allies: [['opera_voice_nightwish', 'Opera Voice', 'tactical'], ['metal_ship_nightwish', 'Metal Ship', 'marine']], theme: 'symphonic metal, fantasy voyages, operatic storms, and dream-theatre epics', motif: 'shipdeck', colors: ['#111b2d', '#020406', '#7fb6ff'] },
    { key: 'ultravomit', universe: 'Ultra Vomit', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Ultra Vomit', stage: 'Metal Parody Kitchen', boss: 'Kammthaar Comedy Riff', hero: ['ultravomit_avatar', 'Ultra Vomit Avatar', 'horror'], allies: [['parody_riffer_uv', 'Parody Riffer', 'slayer'], ['blast_joke_uv', 'Blast Joke', 'hacker']], theme: 'French parody metal, absurd riffs, genre jokes, and heavy comedy stage chaos', motif: 'hauntedset', colors: ['#22180f', '#050302', '#ffb547'] },
    { key: 'psy', universe: 'PSY', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'PSY', stage: 'Gangnam Dancefloor Rift', boss: 'Horse Dance Bass Core', hero: ['psy_avatar', 'PSY Avatar', 'hacker'], allies: [['gangnam_dancer', 'Gangnam Dancer', 'slayer'], ['kpop_crowd_psy', 'K-Pop Crowd', 'tactical']], theme: 'viral dance, comic swagger, K-pop spectacle, and global meme-energy shockwaves', motif: 'arcanecity', colors: ['#1e2032', '#040407', '#44d7ff'] },
    { key: 'tommy_heavenly', universe: 'Tommy Heavenly6', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'Tommy Heavenly6', stage: 'Goth Pop Candy Cemetery', boss: 'Heavenly Nightmare Doll', hero: ['tommy_heavenly_avatar', 'Tommy Heavenly6', 'horror'], allies: [['goth_candy_echo', 'Goth Candy Echo', 'hacker'], ['punk_bunny_guard', 'Punk Bunny Guard', 'slayer']], theme: 'goth pop, candy-punk visuals, cute darkness, and stylish graveyard stage moods', motif: 'hauntedset', colors: ['#271327', '#050205', '#ff6fcf'] },
    { key: 'black_eyed_peas', universe: 'Black Eyed Peas', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Black Eyed Peas', stage: 'Boom Boom Pow Club Grid', boss: 'I Gotta Feeling Party Core', hero: ['bep_unit', 'Black Eyed Peas Unit', 'hacker'], allies: [['boom_dancer_bep', 'Boom Dancer', 'slayer'], ['party_signal_bep', 'Party Signal', 'tactical']], theme: 'electro-pop hooks, party anthems, club futurism, and synchronized crowd surges', motif: 'facility', colors: ['#121f2b', '#020405', '#4ee6ff'] },
    { key: 'shaka_ponk', universe: 'Shaka Ponk', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Shaka Ponk', stage: 'Goz Monkey Digital Pit', boss: 'Shaka Bass Ape Core', hero: ['shaka_ponk_avatar', 'Shaka Ponk Unit', 'slayer'], allies: [['goz_signal', 'Goz Signal', 'hacker'], ['punk_drum_shaka', 'Punk Drum', 'marine']], theme: 'digital monkey mascots, electro-rock, stage screens, and punky live-show impacts', motif: 'facility', colors: ['#172323', '#030505', '#77ff7d'] },
    { key: 'shakira', universe: 'Shakira', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Shakira', stage: 'She Wolf Rhythm Jungle', boss: 'Hips Dont Lie Pulse', hero: ['shakira_avatar', 'Shakira Avatar', 'slayer'], allies: [['she_wolf_echo', 'She Wolf Echo', 'hacker'], ['waka_guard', 'Waka Guard', 'tactical']], theme: 'Latin pop rhythm, dance power, wolf imagery, and global stadium celebration energy', motif: 'wasteland', colors: ['#2d2212', '#060503', '#ffc44a'] },
    { key: 'deadmau5', universe: 'Deadmau5', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'Deadmau5', stage: 'Mau5head EDM Grid', boss: 'Ghosts n Stuff Signal Core', hero: ['deadmau5_avatar', 'Mau5head Avatar', 'hacker'], allies: [['edm_grid_mouse', 'EDM Grid Mouse', 'tactical'], ['laser_sync_mau5', 'Laser Sync', 'slayer']], theme: 'progressive house, mau5head visuals, LED grids, and precise electronic build-ups', motif: 'facility', colors: ['#151515', '#030303', '#ff3030'] },
    { key: 'cthulhu', universe: 'Cthulhu', mediaType: 'series', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Cthulhu', stage: 'Rlyeh Dreaming Breach', boss: 'Great Old One Awakening', hero: ['investigator_cthulhu', 'Mythos Investigator', 'hacker'], allies: [['deep_one_hybrid', 'Deep One Hybrid', 'horror'], ['miskatonic_scholar', 'Miskatonic Scholar', 'tactical']], theme: 'cosmic horror, forbidden dreams, eldritch seas, cult rites, and sanity-breaking revelations', motif: 'hauntedset', colors: ['#0d2421', '#010504', '#31b58f'] },
    { key: 'necronomicon', universe: 'Necronomicon', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Necronomicon', stage: 'Forbidden Book Catacomb', boss: 'Book of the Dead Avatar', hero: ['occult_reader_necro', 'Occult Reader', 'hacker'], allies: [['deadite_scribe', 'Deadite Scribe', 'horror'], ['ritual_guard_necro', 'Ritual Guard', 'tactical']], theme: 'forbidden pages, dead languages, cursed ink, and book-bound nightmare dimensions', motif: 'castle', colors: ['#1b1210', '#030202', '#c29a5a'] },
    { key: 're_animator', universe: 'Re-Animator', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Re-Animator', stage: 'Miskatonic Reagent Lab', boss: 'Reanimated Biomass Surge', hero: ['herbert_west', 'Herbert West', 'hacker'], allies: [['dan_cain', 'Dan Cain', 'tactical'], ['megan_halsey', 'Megan Halsey', 'horror']], theme: 'mad science, green reagent, medical horror, and corpses returning very incorrectly', motif: 'facility', colors: ['#142218', '#030503', '#61ff59'] },
    { key: 'digimon_celestial', universe: 'Digimon Celestial Rift', mediaType: 'manga', faction: 'arcane', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Digimon - Faille celeste', stage: 'Digital World Angel Demon Gate', boss: 'Beelzemon Blast Mode Rupture', hero: ['angewomon_digi', 'Angewomon', 'hacker'], allies: [['lady_devimon_digi', 'LadyDevimon', 'horror'], ['beelzemon_digi', 'Beelzemon', 'slayer'], ['darcmon_digi', 'Darcmon', 'tactical']], theme: 'angel and demon Digimon, digital crests, holy arrows, and dark evolution conflicts', motif: 'castle', colors: ['#1b1835', '#030307', '#e8d7ff'] },
    {
      key: 'aural_vampire',
      universe: 'Aural Vampire',
      mediaType: 'music',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Aural Vampire',
      stage: 'Vampire Ecstasy Darkwave Club',
      boss: 'Zombie Naocchatte Procession',
      hero: ['exo_chika_av', 'EXO-CHIKA', 'horror'],
      allies: [['raveman_av', 'RAVEMAN', 'hacker'], ['wu_chy_av', 'Wu-CHY', 'marine'], ['higuchuuhei_av', 'Higuchuuhei', 'slayer'], ['zen_av', 'ZEN', 'hacker'], ['izu_av', 'IZU', 'marine']],
      monsters: ['Vampire Ecstasy Mannequin', 'Razors on Backstreet Butcher', 'Darkwave Bloodline Dancer'],
      bosses: ['Freeeze Masquerade', 'Zoltank Stage Vampire'],
      gear: [['exo_chika_microphone', 'EXO-CHIKA Vampire Microphone', 'Micro vampirique d EXO-CHIKA', { atk: 9, spd: 1 }], ['raveman_led_mask', 'RAVEMAN LED Mask', 'Masque LED de RAVEMAN', { def: 7, spd: 2 }], ['aural_synth_module', 'Aural Vampire Synth Module', 'Module synthe Aural Vampire', { atk: 8, hp: 50 }]],
      event: ['evt_aural_vampire_freeze', 'Freeeze Darkwave Drop', 'Drop darkwave Freeeze', 'EXO-CHIKA locks the crowd on the beat while RAVEMAN and the live band detonate the industrial sequence.', 'EXO-CHIKA fige la foule sur le rythme pendant que RAVEMAN et le groupe live declenchent la sequence industrielle.'],
      theme: 'EXO-CHIKA vocals, RAVEMAN masked electronics, Wu-CHY bass, Higuchuuhei guitar, ZEN keyboards, IZU drums, and Japanese darkwave horror theatre',
      motif: 'hauntedset',
      colors: ['#220d18', '#040102', '#ff3d8f']
    },
    {
      key: 'buckethead',
      universe: 'Buckethead',
      mediaType: 'music',
      faction: 'cyber',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Buckethead',
      stage: 'Bucketheadland Guitar Labyrinth',
      boss: 'Bucketheadland Automaton',
      hero: ['buckethead_avatar', 'Buckethead Persona', 'hacker'],
      allies: [['death_cube_k_echo', 'Death Cube K Echo', 'horror'], ['pike_riff_signal', 'Pike Riff Signal', 'slayer']],
      theme: 'masked guitar virtuosity, Bucketheadland surrealism, pike albums, silent stage personas, arcade-horror riffs, and instrumental labyrinths',
      motif: 'facility',
      colors: ['#181818', '#030303', '#f5f5f5'],
      monsters: ['Bucketheadland Toy Drone', 'Animatronic Riff Guard', 'White Mask Static'],
      bosses: ['Giant Robot Riff Engine', 'Death Cube K Shadow'],
      worldBoss: 'Bucketheadland Automaton',
      gear: [
        ['buckethead_white_mask', 'White Mask Resonator', 'Resonateur masque blanc', { def: 7, spd: 1 }],
        ['buckethead_bucket_crown', 'Bucket Crown Antenna', 'Antenne couronne-bucket', { hp: 60, atk: 5 }],
        ['buckethead_pike_pick', 'Pike Series Guitar Pick', 'Mediator serie Pike', { atk: 10 }]
      ],
      event: ['evt_buckethead_shred', 'Bucketheadland Shred Gate', 'Portail shred Bucketheadland', 'A silent guitar labyrinth opens, shredding hostile code and boosting squad tempo.', 'Un labyrinthe de guitare silencieux s ouvre, lacere le code hostile et accelere le tempo de l escouade.']
    },
    { key: 'korn', universe: 'Korn', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Korn', stage: 'Nu-Metal Field Pit', boss: 'Freak on a Leash Core', hero: ['korn_avatar', 'Korn Avatar', 'horror'], allies: [['seven_string_riff', 'Seven String Riff', 'slayer'], ['bagpipe_signal', 'Bagpipe Signal', 'hacker']], theme: 'nu-metal dread, detuned riffs, cathartic screams, and mosh-pit emotional pressure', motif: 'hauntedset', colors: ['#181214', '#030202', '#b0b0b0'] },
    { key: 'marilyn_manson', universe: 'Marilyn Manson', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Marilyn Manson', stage: 'Mechanical Animals Chapel', boss: 'Antichrist Superstar Effigy', hero: ['manson_avatar', 'Shock Rock Avatar', 'horror'], allies: [['mechanical_animal', 'Mechanical Animal', 'tactical'], ['pale_emperor_echo', 'Pale Emperor Echo', 'hacker']], theme: 'shock rock theatre, industrial glam, occult imagery, and corrupted celebrity rituals', motif: 'hauntedset', colors: ['#1f1111', '#030202', '#d9d9d9'] }
  ]),
  ...makeUniverseWave(CANONICAL_REQUESTED_UNIVERSE_WAVE),
  ...makeUniverseWave(REQUESTED_UNIVERSE_WAVE_WITHOUT_LEGACY_ITEMS)
];

FEATURED_UNIVERSE_PACKS.forEach(pack => {
  const existingIndex = EXPANDED_UNIVERSES.findIndex(universe => universe.universe === pack.universe);
  if (existingIndex >= 0) {
    EXPANDED_UNIVERSES[existingIndex] = pack;
  } else {
    EXPANDED_UNIVERSES.push(pack);
  }
});

OC_DLC_UNIVERSES.forEach(pack => {
  const alreadyRegistered = EXPANDED_UNIVERSES.some(universe => universe.universe === pack.universe);
  if (!alreadyRegistered) {
    EXPANDED_UNIVERSES.push(pack);
  }
});

ORIGINAL_UNIVERSE_WAVE.forEach(pack => {
  const existingIndex = EXPANDED_UNIVERSES.findIndex(
    universe => universe.universe === pack.universe
  );
  if (existingIndex >= 0) {
    EXPANDED_UNIVERSES[existingIndex] = pack;
  } else {
    EXPANDED_UNIVERSES.push(pack);
  }
});

makeUniverseWave(CANON_ROSTER_WAVE).forEach(pack => {
  const existingIndex = EXPANDED_UNIVERSES.findIndex(
    universe => universe.universe === pack.universe
  );
  if (existingIndex >= 0) {
    EXPANDED_UNIVERSES[existingIndex] = pack;
  } else {
    EXPANDED_UNIVERSES.push(pack);
  }
});

const CANON_ROSTER_UNIVERSES = new Set(CANON_ROSTER_WAVE.map(entry => entry.universe));

function splitCombatantsAndEncounters(universe) {
  const routeThreat = (threat, kind, index) => {
    const name = threatName(threat);
    const explicitType = threat && typeof threat === 'object'
      ? LEGACY_NON_COMBAT_TRIAL_TYPE_BY_ID.get(`${universe.universe}:${threat.id}`)
      : null;
    const legacyType = explicitType || LEGACY_NON_COMBAT_TRIAL_TYPE_BY_NAME.get(
      `${universe.universe}:${normalizeLegacyTrialName(name)}`
    );
    if (threat?.nonCombat !== true && !legacyType) {
      return { combatant: threat, encounter: null };
    }

    const generatedId = `legacy-${universe.key || normalizeLegacyTrialName(universe.universe).replace(/\s+/g, '-')}-${kind}-${index}-${normalizeLegacyTrialName(name).replace(/\s+/g, '-')}`;
    const source = threat && typeof threat === 'object'
      ? { ...threat, id: threat.id || generatedId, name: threat.name || name }
      : { id: generatedId, name };
    const routedThreat = {
      ...source,
      nonCombat: true,
      trialType: source.trialType || legacyType,
      nonCombatTrial: {
        ...(source.nonCombatTrial || {}),
        type: source.nonCombatTrial?.type || source.trialType || legacyType
      },
      visualAnchor: source.visualAnchor
        || `${universe.stageName}: ${name} represented as an objective state, never as a fighter.`
    };
    const policy = makeNonCombatPolicyFromThreat(universe.universe, routedThreat);
    return {
      combatant: null,
      encounter: policy
        ? { id: routedThreat.id, name: routedThreat.name, kind, threat: routedThreat, policy }
        : null
    };
  };

  const monsterRoutes = (universe.monsters || []).map((threat, index) => routeThreat(threat, 'monster', index));
  const bossRoutes = (universe.bosses || []).map((threat, index) => routeThreat(threat, 'boss', index));
  const existingEncounters = universe.encounters || [];
  const knownEncounterKeys = new Set(existingEncounters.map(encounter => (
    `${encounter.kind}:${encounter.id || normalizeLegacyTrialName(encounter.name)}`
  )));
  const routedEncounters = [...monsterRoutes, ...bossRoutes]
    .flatMap(route => route.encounter ? [route.encounter] : [])
    .filter(encounter => {
      const key = `${encounter.kind}:${encounter.id || normalizeLegacyTrialName(encounter.name)}`;
      if (knownEncounterKeys.has(key)) return false;
      knownEncounterKeys.add(key);
      return true;
    });

  return {
    monsters: monsterRoutes.flatMap(route => route.combatant ? [route.combatant] : []),
    bosses: bossRoutes.flatMap(route => route.combatant ? [route.combatant] : []),
    encounters: [...existingEncounters, ...routedEncounters]
  };
}

EXPANDED_UNIVERSES.forEach((universe, index) => {
  const worldBossOverride = getLoreWorldBossOverride(universe.universe);
  const worldBossPolicy = getResolvedLoreWorldBossPolicy(universe.universe)
    || (universe.mediaType === 'music'
      ? makeNonCombatPolicyFromThreat(universe.universe, {
          id: `${universe.key || universe.universe}-final-performance`,
          name: `${universe.universe} — final performance`,
          nonCombat: true,
          entityType: 'live-performance-trial',
          trialType: 'hit-targets',
          objectiveText: {
            fr: 'Réussir la performance finale en maintenant le rythme et la sécurité de la scène.',
            en: 'Complete the final performance while maintaining rhythm and stage safety.'
          },
          visualAnchor: universe.theme || universe.stageName
        })
      : null);
  const stageLoreProfile = getStageLoreProfile(universe.universe);
  const enrichedUniverse = { ...universe, ...splitCombatantsAndEncounters(universe) };

  if (worldBossOverride && !CANON_ROSTER_UNIVERSES.has(universe.universe)) {
    enrichedUniverse.worldBoss = makeLoreWorldBossRuntime(worldBossOverride);
    enrichedUniverse.worldBossPolicy = null;
  } else if (worldBossPolicy && !CANON_ROSTER_UNIVERSES.has(universe.universe)) {
    const clearCombatRoster = universe.mediaType === 'music'
      || shouldClearCombatRosterForPolicy(universe.universe);
    enrichedUniverse.worldBoss = null;
    enrichedUniverse.worldBossPolicy = worldBossPolicy;
    // A policy is an objective contract, never a boss label. Mixed universes
    // keep their last verified combat boss; pure puzzle/pursuit worlds expose
    // no boss at all.
    enrichedUniverse.bossName = clearCombatRoster
      ? null
      : threatName(enrichedUniverse.bosses.at(-1)) || null;
    if (clearCombatRoster) {
      enrichedUniverse.monsters = [];
      enrichedUniverse.bosses = [];
    }
  }

  const authoritativeRoster = enforceThreatRolePrecedence(enrichedUniverse);
  enrichedUniverse.monsters = authoritativeRoster.monsters;
  enrichedUniverse.bosses = authoritativeRoster.bosses;

  if (stageLoreProfile) {
    enrichedUniverse.stageLoreProfile = stageLoreProfile;
  }

  EXPANDED_UNIVERSES[index] = enrichedUniverse;
});

function makeUniverseWave(entries) {
  return entries.map(entry => {
    const [skyTop, skyBottom, accent] = entry.colors;
    const title = entry.title || entry.universe;
    const titleFr = entry.titleFr || entry.universe;
    const shortKey = entry.key.replace(/[^a-z0-9_]/gi, '').toLowerCase();
    const authoredMonsters = entry.monsters || makeLoreEnemyWave(entry.universe, title);
    const authoredBosses = entry.bosses || makeLoreBossWave(entry.universe, title);
    const authoredWorldBoss = entry.worldBoss || entry.boss;
    const routeThreat = (threat, kind) => {
      const sourceName = threatName(threat);
      const legacyTrialType = (
        threat && typeof threat === 'object'
          ? LEGACY_NON_COMBAT_TRIAL_TYPE_BY_ID.get(`${entry.universe}:${threat.id}`)
          : null
      ) || LEGACY_NON_COMBAT_TRIAL_TYPE_BY_NAME.get(
        `${entry.universe}:${normalizeLegacyTrialName(sourceName)}`
      );
      if (threat?.nonCombat !== true && !legacyTrialType) {
        return { combatant: threat, encounter: null };
      }

      const generatedThreatId = `legacy-${entry.key}-${kind}-${normalizeLegacyTrialName(sourceName).replace(/\s+/g, '-')}`;
      const threatRecord = threat && typeof threat === 'object'
        ? { ...threat, id: threat.id || generatedThreatId, name: threat.name || sourceName }
        : {
            id: generatedThreatId,
            name: sourceName,
            visualAnchor: `${entry.stage}: ${sourceName} represented as an objective state, never as a fighter.`
          };
      const nonCombatThreat = legacyTrialType
        ? {
            ...threatRecord,
            nonCombat: true,
            trialType: threatRecord.trialType || legacyTrialType,
            nonCombatTrial: {
              ...(threatRecord.nonCombatTrial || {}),
              type: threatRecord.nonCombatTrial?.type || threatRecord.trialType || legacyTrialType
            }
          }
        : { ...threatRecord, nonCombat: true };
      const policy = makeNonCombatPolicyFromThreat(entry.universe, nonCombatThreat);
      return {
        combatant: null,
        encounter: {
          id: nonCombatThreat.id,
          name: nonCombatThreat.name,
          kind,
          threat: nonCombatThreat,
          policy
        }
      };
    };
    const monsterRoutes = authoredMonsters.map(threat => routeThreat(threat, 'monster'));
    const bossRoutes = authoredBosses.map(threat => routeThreat(threat, 'boss'));
    const worldBossRoute = routeThreat(authoredWorldBoss, 'worldBoss');
    const monsters = monsterRoutes.flatMap(route => route.combatant ? [route.combatant] : []);
    const bosses = bossRoutes.flatMap(route => route.combatant ? [route.combatant] : []);
    const encounters = [
      ...monsterRoutes.flatMap(route => route.encounter ? [route.encounter] : []),
      ...bossRoutes.flatMap(route => route.encounter ? [route.encounter] : []),
      ...(worldBossRoute.encounter ? [worldBossRoute.encounter] : [])
    ];
    const worldBossPolicy = worldBossRoute.encounter?.policy || null;
    const normalizeEncounterName = value => String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    const nonCombatCharacters = [entry.hero, ...(entry.allies || [])].filter(characterEntry => (
      Array.isArray(characterEntry)
      && characterEntry[3]?.nonCombat === true
    ));
    const stageVariants = (entry.stageVariants || []).map(variant => {
      const normalizedVariant = Array.isArray(variant)
        ? {
            ...(variant[4] && typeof variant[4] === 'object' ? variant[4] : {}),
            mode: variant[0],
            name: variant[1],
            difficulty: variant[2],
            bossName: variant[3]
          }
        : { ...variant };
      const targetEncounter = encounters.find(encounter => (
        normalizeEncounterName(encounter.name) === normalizeEncounterName(normalizedVariant.bossName)
      ));
      const targetCharacter = nonCombatCharacters.find(characterEntry => (
        normalizeEncounterName(characterEntry[1]) === normalizeEncounterName(normalizedVariant.bossName)
      ));
      const authoredStageTrial = normalizedVariant.nonCombat === true
        || Boolean(normalizedVariant.nonCombatTrial)
        || Boolean(targetCharacter);
      if (!targetEncounter?.policy && !authoredStageTrial) return normalizedVariant;

      const characterMetadata = targetCharacter?.[3] || {};
      const stageTrialId = targetEncounter?.id
        || targetCharacter?.[0]
        || `stage-trial-${entry.key}-${normalizeEncounterName(normalizedVariant.name).replace(/\s+/g, '-')}`;
      const stageTrialName = (normalizedVariant.stageObjectiveOverride ? normalizedVariant.name : null)
        || targetEncounter?.name
        || targetCharacter?.[1]
        || normalizedVariant.bossName
        || normalizedVariant.name;
      const stageTrialPolicy = (!normalizedVariant.stageObjectiveOverride && targetEncounter?.policy) || makeNonCombatPolicyFromThreat(entry.universe, {
        id: stageTrialId,
        name: stageTrialName,
        nonCombat: true,
        entityType: characterMetadata.entityType || normalizedVariant.entityType || 'authored-stage-trial',
        objective: characterMetadata.objective || normalizedVariant.objective,
        objectiveFr: characterMetadata.objectiveFr || normalizedVariant.objectiveFr,
        objectiveEn: characterMetadata.objectiveEn || normalizedVariant.objectiveEn,
        victoryCondition: characterMetadata.victoryCondition || normalizedVariant.victoryCondition || 'complete-stage-trial',
        trialType: characterMetadata.trialType || normalizedVariant.trialType || normalizedVariant.objectiveType,
        visualAnchor: characterMetadata.visualAnchor || normalizedVariant.visualAnchor || entry.visualAnchor,
        nonCombatTrial: characterMetadata.nonCombatTrial || normalizedVariant.nonCombatTrial
      });
      if (!stageTrialPolicy) return normalizedVariant;

      const trial = inferNonCombatTrial(stageTrialPolicy, {
        universe: entry.universe,
        sourceId: stageTrialId,
        sourceName: stageTrialName
      });
      return {
        ...normalizedVariant,
        originalMode: normalizedVariant.mode,
        mode: 'Smash',
        bossName: null,
        encounterId: stageTrialId,
        nonCombat: true,
        finalePolicy: stageTrialPolicy,
        nonCombatTrial: trial,
        objectiveType: trial?.type,
        enemyRoster: [],
        enemyRosterExclusive: true,
        disableItems: true,
        disableHazards: true
      };
    });
    const factionLine = {
      sciFi: 'technology, survival protocols, and breach combat',
      horror: 'fear pressure, curses, ambushes, and survival horror',
      cyber: 'rhythm, systems, speed, and glitch tactics',
      arcane: 'ritual logic, strange rules, and unstable magic'
    }[entry.faction] || 'multiverse instability and anomaly combat';

    return {
      key: entry.key,
      aliases: entry.aliases,
      canonProfile: entry.canonProfile,
      canonStatus: entry.canonStatus,
      referenceUrl: entry.referenceUrl,
      referenceUrls: entry.referenceUrls,
      visualAnchor: entry.visualAnchor,
      researchDate: entry.researchDate,
      licensing: entry.licensing,
      continuity: entry.continuity,
      fidelityNotes: entry.fidelityNotes,
      lore: entry.lore,
      universe: entry.universe,
      mediaType: entry.mediaType,
      faction: entry.faction,
      stageName: entry.stage,
      stageMeta: entry.stageMeta,
      mode: entry.mode,
      difficulty: entry.difficulty,
      bossName: worldBossRoute.encounter
        ? threatName(bosses.at(-1)) || null
        : entry.boss,
      title: { en: title, fr: titleFr },
      desc: entry.desc || {
        en: `${capitalize(entry.theme)} collide with Nexus instability through ${factionLine}.`,
        fr: `${capitalize(entry.theme)} entrent en collision avec l instabilite du Nexus via ${factionLine}.`
      },
      hero: makeWaveHero(entry.hero, accent),
      allies: entry.allies.map((ally, index) => makeWaveHero(ally, index === 0 ? lightenAccent(accent) : darkenAccent(accent))),
      monsters,
      bosses,
      encounters,
      bossSlotPolicy: LORE_BOSS_SLOT_POLICY[entry.universe],
      worldBoss: worldBossRoute.combatant,
      worldBossPolicy,
      gear: entry.gear || makeLoreGearWave(entry.universe, shortKey, title, titleFr),
      event: entry.event || makeLoreEventWave(entry.universe, shortKey, title, titleFr),
      itemPolicy: getLoreItemPolicy(entry.universe),
      decor: {
        sky: [skyTop, skyBottom],
        floor: `rgba(${hexToRgb(accent).join(', ')}, 0.16)`,
        grid: `rgba(${hexToRgb(accent).join(', ')}, 0.28)`,
        motif: entry.motif,
        accent
      },
      stageVariants
    };
  });
}

function makeLoreEnemyWave(universe, title) {
  const confirmedEnemies = getLoreEnemyOverrides(universe);
  if (confirmedEnemies.length > 0) {
    return confirmedEnemies.map(({ output, ...enemy }) => ({
      ...enemy,
      spriteSource: output
    }));
  }

  return [`${title} Rift Drone`, `${title} Breach Stalker`, `${title} Anomaly Pack`];
}

function makeLoreBossWave(universe, title) {
  const confirmedBosses = LORE_BOSS_OVERRIDES[universe] || [];
  if (confirmedBosses.length > 0) {
    return confirmedBosses.map(({ output, ...boss }) => ({
      ...boss,
      spriteSource: output
    }));
  }

  return [`${title} Elite Guardian`, `${title} Crisis Avatar`];
}

function makeLoreWorldBossRuntime(override) {
  const signatureAttack = override.phases
    .flatMap(phase => phase.attacks)
    .filter(Boolean)
    .slice(-1)[0];

  return {
    ...override,
    loreLocalized: override.lore,
    lore: override.lore.fr,
    spriteSource: override.output,
    worldBossClass: override.layout,
    phaseSet: override.phases,
    special: signatureAttack || override.name,
    isWorldBoss: true
  };
}

function makeWaveHero([id, name, cat, metadata = {}], color) {
  const authoredMetadata = metadata && typeof metadata === 'object' && !Array.isArray(metadata)
    ? metadata
    : {};
  const normalizeMove = move => typeof move === 'string' ? { name: move } : move;
  const simple = normalizeMove(authoredMetadata.simple ?? authoredMetadata.basic);
  return {
    ...authoredMetadata,
    id,
    name,
    cat,
    color: authoredMetadata.color || color,
    ...(simple ? { simple } : {}),
    ...(authoredMetadata.secondary ? { secondary: normalizeMove(authoredMetadata.secondary) } : {}),
    ...(authoredMetadata.defense ? { defense: normalizeMove(authoredMetadata.defense) } : {}),
    ...(authoredMetadata.special ? { special: normalizeMove(authoredMetadata.special) } : {})
  };
}

function makeWaveGear(key, title, titleFr) {
  return [
    [`${key}_sigil`, `${title} Signature Relic`, `Relique signature ${titleFr}`, { atk: 8, spd: 1 }],
    [`${key}_armor`, `${title} Field Plate`, `Plaque terrain ${titleFr}`, { def: 6, hp: 45 }],
    [`${key}_core`, `${title} Nexus Core`, `Noyau Nexus ${titleFr}`, { hp: 75 }]
  ];
}

function makeLoreGearWave(universe, key, title, titleFr) {
  const loreItems = getLoreEquipmentOverrides(universe);
  if (loreItems.length > 0) {
    const boosts = [
      { atk: 8, spd: 1 },
      { def: 6, hp: 45 },
      { hp: 55, spd: 1 }
    ];
    return loreItems.map((entry, index) => ([
      entry.id,
      entry.name.en,
      entry.name.fr,
      boosts[index],
      entry
    ]));
  }

  if (getLoreItemPolicy(universe)?.status === 'disabled') return [];
  return makeWaveGear(key, title, titleFr);
}

function makeLoreEventWave(universe, key, title, titleFr) {
  const loreItem = getLoreEventItemOverride(universe);
  if (loreItem) {
    return [
      loreItem.id,
      loreItem.name.en,
      loreItem.name.fr,
      loreItem.desc.en,
      loreItem.desc.fr,
      loreItem
    ];
  }

  if (getLoreItemPolicy(universe)?.status === 'disabled') return null;
  return [
    `evt_${key}_breach`,
    `${title} Breach Signal`,
    `Signal breche ${titleFr}`,
    `${title} opens a signature anomaly that damages enemies and boosts the squad tempo.`,
    `${titleFr} ouvre une anomalie signature qui blesse les ennemis et accelere l escouade.`
  ];
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map(char => char + char).join('')
    : value;
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16)
  ];
}

function lightenAccent(hex) {
  const [r, g, b] = hexToRgb(hex).map(value => Math.min(255, value + 35));
  return `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`;
}

function darkenAccent(hex) {
  const [r, g, b] = hexToRgb(hex).map(value => Math.max(0, value - 35));
  return `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`;
}

const colorPalette = {
  sciFi: '#63d7ff',
  horror: '#e74c3c',
  cyber: '#39ffcc',
  arcane: '#d9b86b'
};

const weaponByCategory = {
  marine: 'gun',
  horror: 'slash',
  slayer: 'slash',
  hacker: 'laser',
  tactical: 'gun'
};

const statsByCategory = {
  marine: { hp: 130, atk: 10, def: 8, spd: 4 },
  horror: { hp: 115, atk: 11, def: 7, spd: 5 },
  slayer: { hp: 105, atk: 14, def: 5, spd: 6 },
  hacker: { hp: 100, atk: 12, def: 6, spd: 6 },
  tactical: { hp: 120, atk: 11, def: 7, spd: 4 }
};

function stageIdFor(index) {
  return EXPANDED_STAGE_START_ID + index;
}

export function stableTrialStageId(universe, encounterId) {
  const source = `${String(universe || 'Nexus')}\u241f${String(encounterId || 'trial')}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return 810000000 + (hash % 180000000);
}

function difficultyRank(universe) {
  return difficultyScale[universe.difficulty] || 0;
}

function rewardFor(universe) {
  const reward = modeReward[universe.mode] || modeReward.RPG;
  const rank = difficultyRank(universe);
  return {
    goldPrize: reward.gold + rank * 18,
    shardPrize: reward.shards + rank * 6
  };
}

function makeCombatHero(item) {
  const stats = statsByCategory[item.cat] || statsByCategory.tactical;
  const weapon = weaponByCategory[item.cat] || 'gun';
  return {
    ...item,
    id: item.id,
    name: item.name,
    cat: item.cat,
    color: item.color,
    weapon: item.weapon || item.weaponType || weapon,
    stats: item.stats || stats
  };
}

function threatName(entry) {
  return typeof entry === 'string' ? entry : entry?.name;
}

function makeEnemy(entry, index, universe, tier = 0) {
  const rank = difficultyRank(universe);
  const threat = typeof entry === 'string' ? { name: entry } : entry || {};
  return {
    hp: 85 + rank * 18 + tier * 35 + index * 12,
    atk: 11 + rank * 2 + tier * 4 + index,
    spd: 4 + (index % 3),
    color: universe.decor.accent,
    weapon: universe.faction === 'arcane' ? 'magic' : universe.faction === 'cyber' ? 'laser' : universe.faction === 'horror' ? 'claws' : 'gun',
    ...threat,
    name: threat.name || 'Unknown Threat',
    lore: threat.lore || FEATURED_ENEMY_LORE[universe.universe]?.[threat.name]
  };
}

function getStageLoreMetadata(stage) {
  const profile = getStageLoreProfile(stage);
  if (!profile) return {};

  return {
    stageLore: {
      key: profile.key,
      canonicalName: profile.canonicalName,
      referenceUrls: profile.referenceUrls,
      visualAnchor: profile.visualAnchor,
      priority: profile.priority,
      auditStatus: profile.auditStatus,
      generationBlocked: profile.generationBlocked
    },
    stageAssetPlan: getStageLoreAssetPlan(stage, stage.mode)
  };
}

function trialRewardFor(universe) {
  const reward = rewardFor(universe);
  return {
    goldPrize: Math.max(20, Math.round(reward.goldPrize * 0.35)),
    shardPrize: Math.max(8, Math.round(reward.shardPrize * 0.35)),
    ...(reward.tokenPrize
      ? { tokenPrize: Math.max(1, Math.round(reward.tokenPrize * 0.35)) }
      : {})
  };
}

const EXPANDED_STAGE_RUNTIME_METADATA_KEYS = [
  'contentPackId',
  'contentOrigin',
  'originalContent',
  'originalContentNotice',
  'ocDlc',
  'dlcStage',
  'standalone',
  'numberedAct',
  'campaignDependency',
  'requiredCampaignStageIds',
  'actLabel',
  'packTitle',
  'displayName',
  'bossNameLocalized',
  'bossId',
  'previousStageId',
  'contentStageId',
  'stageKey',
  'objectiveType',
  'setting',
  'production',
  'stageArt',
  'sourceUniverses',
  'enemyRoster',
  'enemyRosterExclusive',
  'encounterId',
  'originalMode',
  'nonCombat',
  'nonCombatTrial',
  'disableItems',
  'disableHazards',
  'tacticsBattlefieldId',
  'smashArenaId',
  'intro',
  'scenes',
  'outro',
  'storyBeat',
  'objective',
  'stakes',
  'consequence',
  'reward',
  'rewardItemId',
  'rewardItemName',
  'eventRewardId',
  'goldPrize',
  'shardPrize',
  'tokenPrize'
];

function getExpandedStageRuntimeMetadata(source) {
  const metadata = Object.fromEntries(
    EXPANDED_STAGE_RUNTIME_METADATA_KEYS
      .filter(key => Object.hasOwn(source, key))
      .map(key => [key, source[key]])
  );

  // Source locks are explicitly authored per scene. Do not silently copy the
  // broader franchise metadata onto all historical stages of that universe.
  const sourceLock = source.stageMeta?.sourceLock;
  if (sourceLock) {
    for (const key of [
      'incarnation', 'canonicalBossName', 'referenceUrl', 'referenceUrls',
      'enemyRoster', 'enemyRosterExclusive', 'visualAnchor', 'visualReviewStatus',
      'gameplayAdaptation', 'sourceSceneLore', 'sourceSceneAdaptation'
    ]) {
      if (Object.hasOwn(sourceLock, key)) metadata[key] = sourceLock[key];
    }
  }

  if (source.ocDlc && !Object.hasOwn(metadata, 'dlcStage')) {
    metadata.dlcStage = true;
  }

  return metadata;
}

export function getExpandedStages() {
  const primaryStages = EXPANDED_UNIVERSES.flatMap((universe, index) => (
    universe.skipPrimaryStage
      ? []
      : (() => {
        const primaryEncounter = universe.encounters?.[0]
          || (universe.worldBossPolicy && universe.monsters.length === 0 && universe.bosses.length === 0
            ? {
                id: universe.worldBossPolicy.legacyWorldBossId,
                name: universe.title?.fr || universe.universe,
                policy: universe.worldBossPolicy
              }
            : null);
        const hasCombatActors = universe.monsters.length > 0
          || universe.bosses.length > 0
          || Boolean(universe.worldBoss);
        const usePrimaryTrial = Boolean(
          primaryEncounter?.policy
          && !hasCombatActors
        );
        const primaryTrial = usePrimaryTrial
          ? inferNonCombatTrial(primaryEncounter.policy, {
              universe: universe.universe,
              sourceId: primaryEncounter.id,
              sourceName: primaryEncounter.name
            })
          : null;
        const stage = {
          id: universe.stageId ?? stageIdFor(index),
          name: universe.stageName,
          universe: universe.universe,
          mode: usePrimaryTrial ? 'Smash' : universe.mode,
          originalMode: usePrimaryTrial ? universe.mode : undefined,
          difficulty: universe.difficulty,
          bossName: usePrimaryTrial ? null : universe.bossName,
          finalePolicy: usePrimaryTrial ? primaryEncounter.policy : null,
          encounterId: usePrimaryTrial ? primaryEncounter.id : undefined,
          nC: usePrimaryTrial,
          nonCombat: usePrimaryTrial,
          nonCombatTrial: primaryTrial,
          objectiveType: primaryTrial?.type,
          enemyRoster: usePrimaryTrial ? [] : universe.enemyRoster,
          enemyRosterExclusive: usePrimaryTrial ? true : universe.enemyRosterExclusive,
          disableItems: usePrimaryTrial ? true : universe.disableItems,
          disableHazards: usePrimaryTrial ? true : universe.disableHazards,
          loreDescription: FEATURED_STAGE_LORE[universe.universe]?.[universe.stageName]
            || FEATURED_STAGE_LORE[universe.universe]?.[universe.mode],
          ...(usePrimaryTrial ? trialRewardFor(universe) : rewardFor(universe)),
          optionalTrial: false,
          countsTowardCampaign: true,
          ...getExpandedStageRuntimeMetadata(universe)
        };
        return [{ ...stage, ...getStageLoreMetadata(stage) }];
      })()
  ));

  const variantStages = EXPANDED_UNIVERSES.flatMap((universe, universeIndex) => (
    (universe.stageVariants || []).map((variant, variantIndex) => {
      const stageProfile = { ...universe, ...variant };
      const stage = {
        id: variant.id ?? variant.stageId ?? (30000 + universeIndex * 10 + variantIndex),
        name: variant.name,
        universe: universe.universe,
        mode: variant.mode,
        difficulty: variant.difficulty || universe.difficulty,
        bossName: Object.hasOwn(variant, 'bossName') ? variant.bossName : universe.bossName,
        finalePolicy: variant.finalePolicy || null,
        encounterId: variant.encounterId,
        nC: Boolean(variant.nonCombatTrial || variant.nonCombat),
        nonCombat: Boolean(variant.nonCombatTrial || variant.nonCombat),
        nonCombatTrial: variant.nonCombatTrial || null,
        originalMode: variant.originalMode,
        enemyRoster: variant.nonCombatTrial ? [] : variant.enemyRoster,
        enemyRosterExclusive: variant.nonCombatTrial ? true : variant.enemyRosterExclusive,
        disableItems: variant.nonCombatTrial ? true : variant.disableItems,
        disableHazards: variant.nonCombatTrial ? true : variant.disableHazards,
        loreDescription: FEATURED_STAGE_LORE[universe.universe]?.[variant.name]
          || FEATURED_STAGE_LORE[universe.universe]?.[variant.mode],
        ...(variant.nonCombatTrial ? trialRewardFor(stageProfile) : rewardFor(stageProfile)),
        optionalTrial: false,
        countsTowardCampaign: true,
        ...getExpandedStageRuntimeMetadata(stageProfile)
      };
      return { ...stage, ...getStageLoreMetadata(stage) };
    })
  ));

  const projectedStages = [...primaryStages, ...variantStages];
  const representedEncounterIds = new Set(
    projectedStages
      .filter(stage => stage.nonCombatTrial && stage.encounterId)
      .map(stage => `${stage.universe}:${stage.encounterId}`)
  );
  const representedPolicyIds = new Set(
    projectedStages
      .filter(stage => stage.nonCombatTrial && stage.finalePolicy?.legacyWorldBossId)
      .map(stage => `${stage.universe}:${stage.finalePolicy.legacyWorldBossId}`)
  );
  const dedicatedTrialStages = EXPANDED_UNIVERSES.flatMap((universe, universeIndex) => {
    const candidates = (universe.encounters || [])
      .filter(encounter => !representedEncounterIds.has(`${universe.universe}:${encounter.id}`))
      .map(encounter => ({
        encounterId: encounter.id,
        sourceName: encounter.name,
        policy: encounter.policy
      }));
    if (
      universe.worldBossPolicy
      && !representedPolicyIds.has(`${universe.universe}:${universe.worldBossPolicy.legacyWorldBossId}`)
      && !candidates.some(candidate => (
        candidate.policy?.legacyWorldBossId === universe.worldBossPolicy.legacyWorldBossId
      ))
    ) {
      candidates.push({
        encounterId: universe.worldBossPolicy.legacyWorldBossId,
        sourceName: universe.title?.fr || universe.universe,
        policy: universe.worldBossPolicy
      });
    }

    return candidates.flatMap(candidate => {
      if (!candidate.policy) return [];
      const trial = inferNonCombatTrial(candidate.policy, {
        universe: universe.universe,
        sourceId: candidate.encounterId,
        sourceName: candidate.sourceName
      });
      if (!trial) return [];
      const stageProfile = { ...universe, mode: 'Smash' };
      const hybridLeadInStageId = candidate.policy.policy === 'stageSetpiece'
        && (universe.monsters.length > 0 || universe.bosses.length > 0 || universe.worldBoss)
        ? universe.stageId ?? stageIdFor(universeIndex)
        : null;
      const stage = {
        id: stableTrialStageId(universe.universe, candidate.encounterId),
        name: `Épreuve — ${candidate.sourceName}`,
        displayName: {
          fr: `Épreuve — ${candidate.sourceName}`,
          en: `Trial — ${candidate.sourceName}`
        },
        universe: universe.universe,
        mode: 'Smash',
        originalMode: universe.mode,
        difficulty: universe.difficulty,
        bossName: null,
        encounterId: candidate.encounterId,
        nC: true,
        nonCombat: true,
        finalePolicy: candidate.policy,
        nonCombatTrial: trial,
        objectiveType: trial.type,
        enemyRoster: [],
        enemyRosterExclusive: true,
        disableItems: true,
        disableHazards: true,
        optionalTrial: true,
        countsTowardCampaign: false,
        hybridSetpiece: Boolean(hybridLeadInStageId),
        requiredLeadInStageId: hybridLeadInStageId || undefined,
        loreDescription: candidate.policy.objective?.fr,
        ...trialRewardFor(stageProfile)
      };
      return [{ ...stage, ...getStageLoreMetadata(stage) }];
    });
  });

  const stages = [...projectedStages, ...dedicatedTrialStages];
  const seenIds = new Set();
  for (const stage of stages) {
    if (seenIds.has(stage.id)) {
      throw new Error(`[expandedUniverses] duplicate stage ID ${stage.id}`);
    }
    seenIds.add(stage.id);
  }
  return stages;
}

export const EXPANDED_STAGE_ID_BY_UNIVERSE = Object.fromEntries(
  EXPANDED_UNIVERSES.flatMap((universe, index) => (
    universe.skipPrimaryStage ? [] : [[universe.universe, universe.stageId ?? stageIdFor(index)]]
  ))
);

export const EXPANDED_UNIVERSE_SIGNATURES = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    universe: universe.universe,
    mediaType: universe.mediaType,
    faction: universe.faction,
    sourceType: universe.sourceType,
    isOriginal: universe.isOriginal === true,
    theme: universe.theme || universe.desc?.en || universe.universe,
    stageName: universe.stageName,
    bossName: universe.bossName,
    worldBoss: threatName(universe.worldBoss),
    worldBossPolicy: universe.worldBossPolicy || null,
    canonicalStage: universe.stageLoreProfile?.canonicalName,
    monsters: universe.monsters.map(threatName),
    bosses: universe.bosses.map(threatName),
    encounters: (universe.encounters || []).map(encounter => ({
      id: encounter.id,
      name: encounter.name,
      kind: encounter.kind,
      nonCombat: true,
      trialType: encounter.policy?.trialType
    })),
    gearNames: universe.gear.map(([, enName, frName]) => ({ en: enName, fr: frName })),
    eventName: universe.event ? { en: universe.event[1], fr: universe.event[2] } : null,
    eventDesc: universe.event ? { en: universe.event[3], fr: universe.event[4] } : null
  }])
);

export const EXPANDED_FACTION_UNIVERSES = {
  sciFi: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'sciFi').map(universe => universe.universe),
  horror: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'horror').map(universe => universe.universe),
  cyber: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'cyber').map(universe => universe.universe),
  arcane: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'arcane').map(universe => universe.universe)
};

export const EXPANDED_LORE_DB = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    mediaType: universe.mediaType,
    faction: universe.faction,
    sourceType: universe.sourceType,
    isOriginal: universe.isOriginal === true,
    originalContent: universe.originalContent === true,
    originalContentNotice: universe.originalContentNotice,
    theme: universe.theme || universe.desc?.en,
    stageName: universe.stageName,
    bossName: universe.bossName,
    worldBoss: threatName(universe.worldBoss),
    worldBossPolicy: universe.worldBossPolicy || null,
    canonicalStage: universe.stageLoreProfile?.canonicalName,
    encounters: (universe.encounters || []).map(encounter => ({
      id: encounter.id,
      name: encounter.name,
      kind: encounter.kind,
      nonCombat: true,
      policy: encounter.policy
    })),
    title: universe.title,
    desc: universe.desc,
    narrativeArc: universe.narrativeArc,
    livingWorld: universe.livingWorld,
    worldItems: universe.worldItems,
    audiovisual: universe.audiovisual,
    sensitivityNotes: universe.sensitivityNotes
  }])
);

export const EXPANDED_ENEMIES_DB = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    monsters: universe.monsters.map((entry, index) => makeEnemy(entry, index, universe)),
    bosses: universe.bosses.map((entry, index) => {
      const enemy = makeEnemy(entry, index, universe, 2);
      const hasAuthoredStats = entry && typeof entry === 'object';
      return {
        ...enemy,
        hp: hasAuthoredStats && Number.isFinite(entry.hp)
          ? entry.hp
          : 420 + difficultyRank(universe) * 70 + index * 65,
        atk: hasAuthoredStats && Number.isFinite(entry.atk)
          ? entry.atk
          : 19 + difficultyRank(universe) * 3 + index * 3,
        special: enemy.special || `${enemy.name} Breach Pattern`
      };
    }),
    finalePolicy: universe.worldBossPolicy || null,
    trials: (universe.encounters || []).map(encounter => ({
      id: encounter.id,
      name: encounter.name,
      kind: encounter.kind,
      nonCombat: true,
      output: encounter.threat?.output || encounter.threat?.spriteSource,
      spriteSource: encounter.threat?.spriteSource || encounter.threat?.output,
      referenceUrl: encounter.threat?.referenceUrl,
      referenceUrls: encounter.threat?.referenceUrls,
      visualAnchor: encounter.threat?.visualAnchor,
      canonStatus: encounter.threat?.canonStatus,
      spritePrompt: encounter.threat?.spritePrompt,
      lore: encounter.threat?.lore,
      policy: encounter.policy,
      trial: inferNonCombatTrial(encounter.policy, {
        universe: universe.universe,
        sourceId: encounter.id,
        sourceName: encounter.name
      })
    })),
    worldBoss: universe.worldBoss ? (() => {
      const enemy = makeEnemy(universe.worldBoss, 0, universe, 4);
      const hasAuthoredStats = typeof universe.worldBoss === 'object';
      return {
        ...enemy,
        hp: hasAuthoredStats && Number.isFinite(universe.worldBoss.hp)
          ? universe.worldBoss.hp
          : 1180 + difficultyRank(universe) * 170,
        atk: hasAuthoredStats && Number.isFinite(universe.worldBoss.atk)
          ? universe.worldBoss.atk
          : 30 + difficultyRank(universe) * 4,
        spd: hasAuthoredStats && Number.isFinite(universe.worldBoss.spd)
          ? universe.worldBoss.spd
          : 4,
        special: enemy.special || `${enemy.name} Omniverse Rupture`
      };
    })() : null
  }])
);

export const EXPANDED_GEAR = EXPANDED_UNIVERSES.flatMap(universe =>
  universe.gear.map(([id, enName, frName, boost, metadata = {}], index) => ({
    ...metadata,
    id,
    universe: universe.universe,
    name: { en: enName, fr: frName },
    desc: metadata.desc || FEATURED_GEAR_LORE[id],
    boost,
    cost: 100 + difficultyRank(universe) * 20 + index * 15,
    icon: metadata.icon,
    iconPrompt: metadata.iconPrompt,
    referenceUrl: metadata.referenceUrl,
    visualAnchor: metadata.visualAnchor,
    audit: metadata.audit
  }))
);

export const EXPANDED_EVENT_ITEMS = Object.fromEntries(
  EXPANDED_UNIVERSES.flatMap(universe => {
    if (!universe.event) return [];
    const [id, enName, frName, enDesc, frDesc, metadata = {}] = universe.event;
    const visualMetadata = getGearShopVisualMetadata({
      id,
      universe: universe.universe,
      metadata
    });
    return [[universe.universe, {
      ...visualMetadata,
      id,
      name: { en: enName, fr: frName },
      desc: { en: enDesc, fr: frDesc },
      effect: id.replace('evt_', ''),
      icon: visualMetadata.icon,
      iconPrompt: visualMetadata.iconPrompt,
      referenceUrl: visualMetadata.referenceUrl,
      visualAnchor: visualMetadata.visualAnchor,
      audit: visualMetadata.audit
    }]];
  })
);

export const EXPANDED_EXTRA_HERO_DATA = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [
    universe.universe,
    [universe.hero, ...universe.allies].map(makeCombatHero)
  ])
);

export const EXPANDED_DECOR_THEMES = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, universe.decor])
);

export const EXPANDED_MEDIA_FILTERS = [
  { id: 'music', label: { fr: 'MUSIQUE', en: 'MUSIC' } }
];

export const EXPANDED_EVENT_SHOP_ITEMS = EXPANDED_UNIVERSES.flatMap(universe => {
  if (!universe.event) return [];
  const [id, enName, frName, enDesc, frDesc, metadata = {}] = universe.event;
  const visualMetadata = getGearShopVisualMetadata({
    id,
    universe: universe.universe,
    metadata
  });
  return [{
    ...visualMetadata,
    id,
    name: { en: enName, fr: frName },
    desc: { en: enDesc, fr: frDesc },
    isCombatEvent: true,
    universe: universe.universe,
    tokenCost: 4 + Math.min(4, difficultyRank(universe)),
    // Keep the OpenAI/lore contract intact when an event enters the Gear Shop.
    icon: visualMetadata.icon,
    iconPrompt: visualMetadata.iconPrompt,
    referenceUrl: visualMetadata.referenceUrl,
    visualAnchor: visualMetadata.visualAnchor,
    audit: visualMetadata.audit
  }];
});

export const EXPANDED_STAGE_ACCENT_BY_UNIVERSE = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, colorPalette[universe.faction] || universe.decor.accent])
);
