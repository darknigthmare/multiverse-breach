import { getStableContentIndex } from './dlcContentIdentity.js';
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
import * as dlcHeavyMetal2000 from '../../DLC/HeavyMetal2000/data/expandedUniverses.js';
import * as dlcKillerTomatoesFromOuterSpace from '../../DLC/KillerTomatoesFromOuterSpace/data/expandedUniverses.js';
import * as dlcPlaneteHurlante from '../../DLC/PlaneteHurlante/data/expandedUniverses.js';
import * as dlcSharknado from '../../DLC/Sharknado/data/expandedUniverses.js';
import * as dlcGodzillaTheAnimatedSeries from '../../DLC/GodzillaTheAnimatedSeries/data/expandedUniverses.js';
import * as dlcPeeWee from '../../DLC/PeeWee/data/expandedUniverses.js';
import * as dlcMalcolmInTheMiddle from '../../DLC/MalcolmInTheMiddle/data/expandedUniverses.js';
import * as dlcTanyaTheEvil from '../../DLC/TanyaTheEvil/data/expandedUniverses.js';
import * as dlcVirus from '../../DLC/Virus/data/expandedUniverses.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/expandedUniverses.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/expandedUniverses.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/expandedUniverses.js';
import * as dlcToySoldiers from '../../DLC/ToySoldiers/data/expandedUniverses.js';
import * as dlcShaunOfTheDead from '../../DLC/ShaunOfTheDead/data/expandedUniverses.js';
import * as dlcPuppetMaster from '../../DLC/PuppetMaster/data/expandedUniverses.js';
import * as dlcChickenRun from '../../DLC/ChickenRun/data/expandedUniverses.js';
import * as dlcGunnm from '../../DLC/Gunnm/data/expandedUniverses.js';
import * as dlcBattleRoyale from '../../DLC/BattleRoyale/data/expandedUniverses.js';
import * as dlcSpawn from '../../DLC/Spawn/data/expandedUniverses.js';
import * as dlcPingu from '../../DLC/Pingu/data/expandedUniverses.js';
import * as dlcLinkinPark from '../../DLC/LinkinPark/data/expandedUniverses.js';
import * as dlcMoonwalker from '../../DLC/Moonwalker/data/expandedUniverses.js';
import * as dlcMichaelJackson from '../../DLC/MichaelJackson/data/expandedUniverses.js';
import * as dlcTheThing from '../../DLC/TheThing/data/expandedUniverses.js';
import * as dlcEvilDead from '../../DLC/EvilDead/data/expandedUniverses.js';
import * as dlcDieAntwoord from '../../DLC/DieAntwoord/data/expandedUniverses.js';
import * as dlcChappie from '../../DLC/Chappie/data/expandedUniverses.js';
import * as dlcGremlins from '../../DLC/Gremlins/data/expandedUniverses.js';
import * as dlcRockyHorrorPictureShow from '../../DLC/RockyHorrorPictureShow/data/expandedUniverses.js';
import * as dlcLesInconnus from '../../DLC/LesInconnus/data/expandedUniverses.js';
import * as dlcRRRrrrr from '../../DLC/RRRrrrr/data/expandedUniverses.js';
import * as dlcDefiance from '../../DLC/Defiance/data/expandedUniverses.js';
import * as dlcMarsAttacks from '../../DLC/MarsAttacks/data/expandedUniverses.js';
import * as dlcDandadan from '../../DLC/Dandadan/data/expandedUniverses.js';
import * as dlcBabyCart from '../../DLC/BabyCart/data/expandedUniverses.js';
import * as dlcCloverfield from '../../DLC/Cloverfield/data/expandedUniverses.js';
import * as dlcTheCollector from '../../DLC/TheCollector/data/expandedUniverses.js';
import * as dlcH2G2 from '../../DLC/H2G2/data/expandedUniverses.js';
import * as dlcLesTuche from '../../DLC/LesTuche/data/expandedUniverses.js';
import * as dlcIronSky from '../../DLC/IronSky/data/expandedUniverses.js';
import * as dlcREC from '../../DLC/REC/data/expandedUniverses.js';
import * as dlcSinister from '../../DLC/Sinister/data/expandedUniverses.js';
import * as dlcLesVisiteurs from '../../DLC/LesVisiteurs/data/expandedUniverses.js';
import * as dlcKazaam from '../../DLC/Kazaam/data/expandedUniverses.js';
import * as dlcMeetTheFeebles from '../../DLC/MeetTheFeebles/data/expandedUniverses.js';
import * as dlcRogerRabbit from '../../DLC/RogerRabbit/data/expandedUniverses.js';
import * as dlcStarshipTroopers from '../../DLC/StarshipTroopers/data/expandedUniverses.js';
import * as dlcBanlieue13 from '../../DLC/Banlieue13/data/expandedUniverses.js';
import * as dlcHouseOf1000Corpses from '../../DLC/HouseOf1000Corpses/data/expandedUniverses.js';
import * as dlcOverlordAnime from '../../DLC/OverlordAnime/data/expandedUniverses.js';
import * as dlcSpoofMovie from '../../DLC/SpoofMovie/data/expandedUniverses.js';
import * as dlcMetalGearRising from '../../DLC/MetalGearRising/data/expandedUniverses.js';
import * as dlcBioShock from '../../DLC/BioShock/data/expandedUniverses.js';
import * as dlcTwistedMetal from '../../DLC/TwistedMetal/data/expandedUniverses.js';
import * as dlcSpiderTheVideoGame from '../../DLC/SpiderTheVideoGame/data/expandedUniverses.js';
import * as dlcTomba from '../../DLC/Tomba/data/expandedUniverses.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/expandedUniverses.js';
import * as dlcFinalFantasyVIII from '../../DLC/FinalFantasyVIII/data/expandedUniverses.js';
import * as dlcFinalFantasyXIII from '../../DLC/FinalFantasyXIII/data/expandedUniverses.js';
import * as dlcFinalFantasyXV from '../../DLC/FinalFantasyXV/data/expandedUniverses.js';
import * as dlcCrashBandicoot from '../../DLC/CrashBandicoot/data/expandedUniverses.js';
import * as dlcTombRaider from '../../DLC/TombRaider/data/expandedUniverses.js';
import * as dlcTekken from '../../DLC/Tekken/data/expandedUniverses.js';
import * as dlcSpyro from '../../DLC/Spyro/data/expandedUniverses.js';
import * as dlcRayman from '../../DLC/Rayman/data/expandedUniverses.js';
import * as dlcCroc from '../../DLC/Croc/data/expandedUniverses.js';
import * as dlcParasiteEve from '../../DLC/ParasiteEve/data/expandedUniverses.js';
import * as dlcOddworld from '../../DLC/Oddworld/data/expandedUniverses.js';
import * as dlcLegacyOfKain from '../../DLC/LegacyOfKain/data/expandedUniverses.js';
import * as dlcRugrats from '../../DLC/Rugrats/data/expandedUniverses.js';
import * as dlcGuitarHero from '../../DLC/GuitarHero/data/expandedUniverses.js';
import * as dlcDisenchantment from '../../DLC/Disenchantment/data/expandedUniverses.js';
import * as dlcFuturama from '../../DLC/Futurama/data/expandedUniverses.js';
import * as dlcBigMouth from '../../DLC/BigMouth/data/expandedUniverses.js';
import * as dlcFamilyGuy from '../../DLC/FamilyGuy/data/expandedUniverses.js';
import * as dlcAmericanDad from '../../DLC/AmericanDad/data/expandedUniverses.js';
import * as dlcKillzone from '../../DLC/Killzone/data/expandedUniverses.js';
import * as dlcYakuza from '../../DLC/Yakuza/data/expandedUniverses.js';
import * as dlcSoulCalibur from '../../DLC/SoulCalibur/data/expandedUniverses.js';
import * as dlcTheLastOfUs from '../../DLC/TheLastOfUs/data/expandedUniverses.js';
import * as dlcLittleBigPlanet from '../../DLC/LittleBigPlanet/data/expandedUniverses.js';
import * as dlcCounterStrike from '../../DLC/CounterStrike/data/expandedUniverses.js';
import * as dlcLeft4Dead from '../../DLC/Left4Dead/data/expandedUniverses.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/expandedUniverses.js';
import * as dlcLostPlanet2 from '../../DLC/LostPlanet2/data/expandedUniverses.js';
import * as dlcSeaman from '../../DLC/Seaman/data/expandedUniverses.js';
import * as dlcJetSetRadio from '../../DLC/JetSetRadio/data/expandedUniverses.js';
import * as dlcDynamiteDuke from '../../DLC/DynamiteDuke/data/expandedUniverses.js';
import * as dlcAlteredBeast from '../../DLC/AlteredBeast/data/expandedUniverses.js';
import * as dlcStreetsOfRage from '../../DLC/StreetsOfRage/data/expandedUniverses.js';
import * as dlcCoolSpot from '../../DLC/CoolSpot/data/expandedUniverses.js';
import * as dlcEarthwormJim from '../../DLC/EarthwormJim/data/expandedUniverses.js';
import * as dlcEccoTheDolphin from '../../DLC/EccoTheDolphin/data/expandedUniverses.js';
import * as dlcFlashback from '../../DLC/Flashback/data/expandedUniverses.js';
import * as dlcRistar from '../../DLC/Ristar/data/expandedUniverses.js';
import * as dlcSplatterhouse from '../../DLC/Splatterhouse/data/expandedUniverses.js';
import * as dlcWoodruff from '../../DLC/Woodruff/data/expandedUniverses.js';
import * as dlcSkibidi from '../../DLC/Skibidi/data/expandedUniverses.js';
import * as dlcSquidGame from '../../DLC/SquidGame/data/expandedUniverses.js';
import * as dlcLaCasaDePapel from '../../DLC/LaCasaDePapel/data/expandedUniverses.js';
import * as dlcSkrillex from '../../DLC/Skrillex/data/expandedUniverses.js';
import * as dlcGorillaz from '../../DLC/Gorillaz/data/expandedUniverses.js';
import * as dlcIndila from '../../DLC/Indila/data/expandedUniverses.js';
import * as dlcSecretOfMonkeyIsland from '../../DLC/SecretOfMonkeyIsland/data/expandedUniverses.js';
import * as dlcZombiesAteMyNeighbors from '../../DLC/ZombiesAteMyNeighbors/data/expandedUniverses.js';
import * as dlcWrongTurn from '../../DLC/WrongTurn/data/expandedUniverses.js';
import * as dlcKyaryPamyuPamyu from '../../DLC/KyaryPamyuPamyu/data/expandedUniverses.js';
import * as dlcKaruneCal from '../../DLC/KaruneCal/data/expandedUniverses.js';
import * as dlcSubUrban from '../../DLC/SubUrban/data/expandedUniverses.js';
import * as dlcBillieEilish from '../../DLC/BillieEilish/data/expandedUniverses.js';
import * as dlcBellaPoarch from '../../DLC/BellaPoarch/data/expandedUniverses.js';
import * as dlcManWithAMission from '../../DLC/ManWithAMission/data/expandedUniverses.js';
import * as dlcGunsNRoses from '../../DLC/GunsNRoses/data/expandedUniverses.js';
import * as dlcBandMaid from '../../DLC/BandMaid/data/expandedUniverses.js';
import * as dlcBringMeTheHorizon from '../../DLC/BringMeTheHorizon/data/expandedUniverses.js';
import * as dlcBlackpink from '../../DLC/Blackpink/data/expandedUniverses.js';
import * as dlcLilNasX from '../../DLC/LilNasX/data/expandedUniverses.js';
import * as dlcEminem from '../../DLC/Eminem/data/expandedUniverses.js';
import * as dlcAtarashiiGakko from '../../DLC/AtarashiiGakko/data/expandedUniverses.js';
import * as dlcQueenBee from '../../DLC/QueenBee/data/expandedUniverses.js';
import * as dlcGhost from '../../DLC/Ghost/data/expandedUniverses.js';
import * as dlcBabymetal from '../../DLC/Babymetal/data/expandedUniverses.js';
import * as dlcLadybaby from '../../DLC/Ladybaby/data/expandedUniverses.js';
import * as dlcBigfloOli from '../../DLC/BigfloOli/data/expandedUniverses.js';
import * as dlcLittleBig from '../../DLC/LittleBig/data/expandedUniverses.js';
import * as dlcTheWeeknd from '../../DLC/TheWeeknd/data/expandedUniverses.js';
import * as dlcHoshi from '../../DLC/Hoshi/data/expandedUniverses.js';
import * as dlcAdo from '../../DLC/Ado/data/expandedUniverses.js';
import * as dlcASMRZ from '../../DLC/ASMRZ/data/expandedUniverses.js';
import * as dlcLadyGaga from '../../DLC/LadyGaga/data/expandedUniverses.js';
import * as dlcWithinTemptation from '../../DLC/WithinTemptation/data/expandedUniverses.js';
import * as dlcNightwish from '../../DLC/Nightwish/data/expandedUniverses.js';
import * as dlcUltraVomit from '../../DLC/UltraVomit/data/expandedUniverses.js';
import * as dlcPSY from '../../DLC/PSY/data/expandedUniverses.js';
import * as dlcTommyHeavenly6 from '../../DLC/TommyHeavenly6/data/expandedUniverses.js';
import * as dlcBlackEyedPeas from '../../DLC/BlackEyedPeas/data/expandedUniverses.js';
import * as dlcShakaPonk from '../../DLC/ShakaPonk/data/expandedUniverses.js';
import * as dlcShakira from '../../DLC/Shakira/data/expandedUniverses.js';
import * as dlcDeadmau5 from '../../DLC/Deadmau5/data/expandedUniverses.js';
import * as dlcCthulhu from '../../DLC/Cthulhu/data/expandedUniverses.js';
import * as dlcNecronomicon from '../../DLC/Necronomicon/data/expandedUniverses.js';
import * as dlcReAnimator from '../../DLC/ReAnimator/data/expandedUniverses.js';
import * as dlcDigimonCelestialRift from '../../DLC/DigimonCelestialRift/data/expandedUniverses.js';
import * as dlcAuralVampire from '../../DLC/AuralVampire/data/expandedUniverses.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/expandedUniverses.js';
import * as dlcKorn from '../../DLC/Korn/data/expandedUniverses.js';
import * as dlcMarilynManson from '../../DLC/MarilynManson/data/expandedUniverses.js';

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
    dlcHeavyMetal2000.createExpandedUniverseRecord(),
    dlcKillerTomatoesFromOuterSpace.createExpandedUniverseRecord(),
    dlcPlaneteHurlante.createExpandedUniverseRecord(),
    dlcSharknado.createExpandedUniverseRecord(),
    dlcGodzillaTheAnimatedSeries.createExpandedUniverseRecord(),
    dlcPeeWee.createExpandedUniverseRecord(),
    dlcMalcolmInTheMiddle.createExpandedUniverseRecord(),
    dlcTanyaTheEvil.createExpandedUniverseRecord(),
    dlcVirus.createExpandedUniverseRecord(),
    dlcHouseOfTheDead.createExpandedUniverseRecord(),
    dlcHouseOfTheDead2.createExpandedUniverseRecord(),
    dlcHouseOfTheDead3.createExpandedUniverseRecord(),
    dlcToySoldiers.createExpandedUniverseRecord(),
    dlcShaunOfTheDead.createExpandedUniverseRecord(),
    dlcPuppetMaster.createExpandedUniverseRecord(),
    dlcChickenRun.createExpandedUniverseRecord(),
    dlcAnother.createExpandedUniverseRecord(),
    dlcGunnm.createExpandedUniverseRecord(),
    dlcBattleRoyale.createExpandedUniverseRecord(),
    dlcSpawn.createExpandedUniverseRecord(),
    dlcPingu.createExpandedUniverseRecord(),
    dlcLinkinPark.createExpandedUniverseRecord(),
    dlcMoonwalker.createExpandedUniverseRecord(),
    dlcMichaelJackson.createExpandedUniverseRecord(),
    dlcTheThing.createExpandedUniverseRecord(),
    dlcEvilDead.createExpandedUniverseRecord(),
    dlcDieAntwoord.createExpandedUniverseRecord(),
    dlcChappie.createExpandedUniverseRecord(),
    dlcGremlins.createExpandedUniverseRecord(),
    dlcRockyHorrorPictureShow.createExpandedUniverseRecord(),
    dlcLesInconnus.createExpandedUniverseRecord(),
    dlcRRRrrrr.createExpandedUniverseRecord(),
    dlcLaCiteDeLaPeur.createExpandedUniverseRecord(),
    dlcDefiance.createExpandedUniverseRecord(),
    dlcMarsAttacks.createExpandedUniverseRecord(),
    dlcDandadan.createExpandedUniverseRecord(),
    dlcBabyCart.createExpandedUniverseRecord(),
    dlcCloverfield.createExpandedUniverseRecord(),
    dlcTheCollector.createExpandedUniverseRecord(),
    dlcH2G2.createExpandedUniverseRecord(),
    dlcLesTuche.createExpandedUniverseRecord(),
    dlcIronSky.createExpandedUniverseRecord(),
    dlcREC.createExpandedUniverseRecord(),
    dlcSinister.createExpandedUniverseRecord(),
    dlcLesVisiteurs.createExpandedUniverseRecord(),
    dlcKazaam.createExpandedUniverseRecord(),
    dlcVoyageDeChihiro.createExpandedUniverseRecord(),
    dlcMeetTheFeebles.createExpandedUniverseRecord(),
    dlcRogerRabbit.createExpandedUniverseRecord(),
    dlcStarshipTroopers.createExpandedUniverseRecord(),
    dlcBanlieue13.createExpandedUniverseRecord(),
    dlcHouseOf1000Corpses.createExpandedUniverseRecord(),
    dlcOverlordAnime.createExpandedUniverseRecord(),
    dlcSCPFoundation.createExpandedUniverseRecord(),
    dlcSpoofMovie.createExpandedUniverseRecord()
  ]),
  ...makeUniverseWave([
    dlcMetalGearRising.createExpandedUniverseRecord(),
    dlcBioShock.createExpandedUniverseRecord(),
    dlcTwistedMetal.createExpandedUniverseRecord(),
    dlcSpiderTheVideoGame.createExpandedUniverseRecord(),
    dlcTomba.createExpandedUniverseRecord(),
    dlcFinalFantasyVII.createExpandedUniverseRecord(),
    dlcFinalFantasyVIII.createExpandedUniverseRecord(),
    dlcFinalFantasyXIII.createExpandedUniverseRecord(),
    dlcFinalFantasyXV.createExpandedUniverseRecord(),
    dlcCrashBandicoot.createExpandedUniverseRecord(),
    dlcTombRaider.createExpandedUniverseRecord(),
    dlcTekken.createExpandedUniverseRecord(),
    dlcSpyro.createExpandedUniverseRecord(),
    dlcRayman.createExpandedUniverseRecord(),
    dlcCroc.createExpandedUniverseRecord(),
    dlcParasiteEve.createExpandedUniverseRecord(),
    dlcOddworld.createExpandedUniverseRecord(),
    dlcLegacyOfKain.createExpandedUniverseRecord(),
    dlcRugrats.createExpandedUniverseRecord(),
    dlcGuitarHero.createExpandedUniverseRecord(),
    dlcDisenchantment.createExpandedUniverseRecord(),
    dlcTheSimpsons.createExpandedUniverseRecord(),
    dlcFuturama.createExpandedUniverseRecord(),
    dlcBigMouth.createExpandedUniverseRecord(),
    dlcFamilyGuy.createExpandedUniverseRecord(),
    dlcAmericanDad.createExpandedUniverseRecord(),
    dlcKillzone.createExpandedUniverseRecord(),
    dlcYakuza.createExpandedUniverseRecord(),
    dlcSoulCalibur.createExpandedUniverseRecord(),
    dlcTheLastOfUs.createExpandedUniverseRecord(),
    dlcLittleBigPlanet.createExpandedUniverseRecord(),
    dlcCounterStrike.createExpandedUniverseRecord(),
    dlcLeft4Dead.createExpandedUniverseRecord(),
    dlcTeamFortress2.createExpandedUniverseRecord(),
    dlcLostPlanet2.createExpandedUniverseRecord(),
    dlcSeaman.createExpandedUniverseRecord(),
    dlcJetSetRadio.createExpandedUniverseRecord(),
    dlcDynamiteDuke.createExpandedUniverseRecord(),
    dlcAlteredBeast.createExpandedUniverseRecord(),
    dlcStreetsOfRage.createExpandedUniverseRecord(),
    dlcCoolSpot.createExpandedUniverseRecord(),
    dlcEarthwormJim.createExpandedUniverseRecord(),
    dlcEccoTheDolphin.createExpandedUniverseRecord(),
    dlcFlashback.createExpandedUniverseRecord(),
    dlcRistar.createExpandedUniverseRecord(),
    dlcSplatterhouse.createExpandedUniverseRecord(),
    dlcWoodruff.createExpandedUniverseRecord(),
    dlcSkibidi.createExpandedUniverseRecord(),
    dlcSquidGame.createExpandedUniverseRecord(),
    dlcLaCasaDePapel.createExpandedUniverseRecord(),
    dlcSkrillex.createExpandedUniverseRecord(),
    dlcGorillaz.createExpandedUniverseRecord(),
    dlcIndila.createExpandedUniverseRecord(),
    dlcSecretOfMonkeyIsland.createExpandedUniverseRecord(),
    dlcZombiesAteMyNeighbors.createExpandedUniverseRecord(),
    dlcWrongTurn.createExpandedUniverseRecord(),
    dlcKyaryPamyuPamyu.createExpandedUniverseRecord(),
    dlcKaruneCal.createExpandedUniverseRecord(),
    dlcSubUrban.createExpandedUniverseRecord(),
    dlcBillieEilish.createExpandedUniverseRecord(),
    dlcBellaPoarch.createExpandedUniverseRecord(),
    dlcManWithAMission.createExpandedUniverseRecord(),
    dlcGunsNRoses.createExpandedUniverseRecord(),
    dlcBandMaid.createExpandedUniverseRecord(),
    dlcBringMeTheHorizon.createExpandedUniverseRecord(),
    dlcBlackpink.createExpandedUniverseRecord(),
    dlcLilNasX.createExpandedUniverseRecord(),
    dlcEminem.createExpandedUniverseRecord(),
    dlcAtarashiiGakko.createExpandedUniverseRecord(),
    dlcQueenBee.createExpandedUniverseRecord(),
    dlcGhost.createExpandedUniverseRecord(),
    dlcBabymetal.createExpandedUniverseRecord(),
    dlcLadybaby.createExpandedUniverseRecord(),
    dlcBigfloOli.createExpandedUniverseRecord(),
    dlcLittleBig.createExpandedUniverseRecord(),
    dlcTheWeeknd.createExpandedUniverseRecord(),
    dlcHoshi.createExpandedUniverseRecord(),
    dlcAdo.createExpandedUniverseRecord(),
    dlcASMRZ.createExpandedUniverseRecord(),
    dlcLadyGaga.createExpandedUniverseRecord(),
    dlcWithinTemptation.createExpandedUniverseRecord(),
    dlcNightwish.createExpandedUniverseRecord(),
    dlcUltraVomit.createExpandedUniverseRecord(),
    dlcPSY.createExpandedUniverseRecord(),
    dlcTommyHeavenly6.createExpandedUniverseRecord(),
    dlcBlackEyedPeas.createExpandedUniverseRecord(),
    dlcShakaPonk.createExpandedUniverseRecord(),
    dlcShakira.createExpandedUniverseRecord(),
    dlcDeadmau5.createExpandedUniverseRecord(),
    dlcCthulhu.createExpandedUniverseRecord(),
    dlcNecronomicon.createExpandedUniverseRecord(),
    dlcReAnimator.createExpandedUniverseRecord(),
    dlcDigimonCelestialRift.createExpandedUniverseRecord(),
    dlcAuralVampire.createExpandedUniverseRecord(),
    dlcBuckethead.createExpandedUniverseRecord(),
    dlcKorn.createExpandedUniverseRecord(),
    dlcMarilynManson.createExpandedUniverseRecord()
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

function stageIdFor(universe, index) {
  return EXPANDED_STAGE_START_ID + getStableContentIndex('expandedUniverses', universe.universe, index);
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
          id: universe.stageId ?? stageIdFor(universe, index),
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
        id: variant.id ?? variant.stageId ?? (30000 + getStableContentIndex('expandedUniverses', universe.universe, universeIndex) * 10 + variantIndex),
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
        ? universe.stageId ?? stageIdFor(universe, universeIndex)
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
    universe.skipPrimaryStage ? [] : [[universe.universe, universe.stageId ?? stageIdFor(universe, index)]]
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
