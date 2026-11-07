// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcDiscworld from '../../DLC/Discworld/data/stageLoreProfiles.js';
import * as dlcJokerNew52 from '../../DLC/JokerNew52/data/stageLoreProfiles.js';
import * as dlcTheBatmanWhoLaughs from '../../DLC/TheBatmanWhoLaughs/data/stageLoreProfiles.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/stageLoreProfiles.js';
import * as dlcPrometheus from '../../DLC/Prometheus/data/stageLoreProfiles.js';
import * as dlcAliens from '../../DLC/Aliens/data/stageLoreProfiles.js';
import * as dlcAlien3 from '../../DLC/Alien3/data/stageLoreProfiles.js';
import * as dlcAlienResurrection from '../../DLC/AlienResurrection/data/stageLoreProfiles.js';
import * as dlcAlienCovenant from '../../DLC/AlienCovenant/data/stageLoreProfiles.js';
import * as dlcAlienRomulus from '../../DLC/AlienRomulus/data/stageLoreProfiles.js';
import * as dlcPredator2 from '../../DLC/Predator2/data/stageLoreProfiles.js';
import * as dlcPredators from '../../DLC/Predators/data/stageLoreProfiles.js';
import * as dlcThePredator from '../../DLC/ThePredator/data/stageLoreProfiles.js';
import * as dlcPrey from '../../DLC/Prey/data/stageLoreProfiles.js';
import * as dlcPredatorKillerOfKillers from '../../DLC/PredatorKillerOfKillers/data/stageLoreProfiles.js';
import * as dlcPredatorBadlands from '../../DLC/PredatorBadlands/data/stageLoreProfiles.js';
import * as dlcAlienVsPredator from '../../DLC/AlienVsPredator/data/stageLoreProfiles.js';
import * as dlcAliensVsPredatorRequiem from '../../DLC/AliensVsPredatorRequiem/data/stageLoreProfiles.js';
import * as dlcDungeonMeshi from '../../DLC/DungeonMeshi/data/stageLoreProfiles.js';
import * as dlcNoob from '../../DLC/Noob/data/stageLoreProfiles.js';
import * as dlcRammstein from '../../DLC/Rammstein/data/stageLoreProfiles.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/stageLoreProfiles.js';
import * as dlcRobZombie from '../../DLC/RobZombie/data/stageLoreProfiles.js';
import * as dlcDaftPunk from '../../DLC/DaftPunk/data/stageLoreProfiles.js';
import * as dlcOliverTree from '../../DLC/OliverTree/data/stageLoreProfiles.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/stageLoreProfiles.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/stageLoreProfiles.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/stageLoreProfiles.js';
import * as dlcUnreal from '../../DLC/Unreal/data/stageLoreProfiles.js';
import * as dlcBreakingBad from '../../DLC/BreakingBad/data/stageLoreProfiles.js';
import * as dlcStargateAtlantis from '../../DLC/StargateAtlantis/data/stageLoreProfiles.js';
import * as dlcStargateUniverse from '../../DLC/StargateUniverse/data/stageLoreProfiles.js';
import * as dlcCharmed from '../../DLC/Charmed/data/stageLoreProfiles.js';
import * as dlcBuffyTheVampireSlayer from '../../DLC/BuffyTheVampireSlayer/data/stageLoreProfiles.js';
import * as dlcAttackOnTitan from '../../DLC/AttackOnTitan/data/stageLoreProfiles.js';
import * as dlcDeathNote from '../../DLC/DeathNote/data/stageLoreProfiles.js';
import * as dlcCellsAtWork from '../../DLC/CellsAtWork/data/stageLoreProfiles.js';
import * as dlcInuyashiki from '../../DLC/Inuyashiki/data/stageLoreProfiles.js';
import * as dlcBorderlands from '../../DLC/Borderlands/data/stageLoreProfiles.js';
import * as dlcFrom from '../../DLC/From/data/stageLoreProfiles.js';
import * as dlcUzumaki from '../../DLC/Uzumaki/data/stageLoreProfiles.js';
import * as dlcToxicAvenger from '../../DLC/ToxicAvenger/data/stageLoreProfiles.js';
import * as dlcExit8 from '../../DLC/Exit8/data/stageLoreProfiles.js';
import * as dlcHellHouseLLC from '../../DLC/HellHouseLLC/data/stageLoreProfiles.js';
import * as dlcSausageParty from '../../DLC/SausageParty/data/stageLoreProfiles.js';
import * as dlcSpyXFamily from '../../DLC/SpyXFamily/data/stageLoreProfiles.js';
import * as dlcTerrifier from '../../DLC/Terrifier/data/stageLoreProfiles.js';
import * as dlcTenaciousD from '../../DLC/TenaciousD/data/stageLoreProfiles.js';
import * as dlcM3GAN from '../../DLC/M3GAN/data/stageLoreProfiles.js';
import * as dlcWarOfTheWorlds from '../../DLC/WarOfTheWorlds/data/stageLoreProfiles.js';
import * as dlcGhostbusters from '../../DLC/Ghostbusters/data/stageLoreProfiles.js';
import * as dlcOnechanbara from '../../DLC/Onechanbara/data/stageLoreProfiles.js';
import * as dlcDespicer from '../../DLC/Despicer/data/stageLoreProfiles.js';
import * as dlcRepoTheGeneticOpera from '../../DLC/RepoTheGeneticOpera/data/stageLoreProfiles.js';
import * as dlcTremors from '../../DLC/Tremors/data/stageLoreProfiles.js';
import * as dlcSkyline from '../../DLC/Skyline/data/stageLoreProfiles.js';
import * as dlcPlaneteHurlante from '../../DLC/PlaneteHurlante/data/stageLoreProfiles.js';
import * as dlcSharknado from '../../DLC/Sharknado/data/stageLoreProfiles.js';
import * as dlcGodzillaTheAnimatedSeries from '../../DLC/GodzillaTheAnimatedSeries/data/stageLoreProfiles.js';
import * as dlcMalcolmInTheMiddle from '../../DLC/MalcolmInTheMiddle/data/stageLoreProfiles.js';
import * as dlcTanyaTheEvil from '../../DLC/TanyaTheEvil/data/stageLoreProfiles.js';
import * as dlcVirus from '../../DLC/Virus/data/stageLoreProfiles.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/stageLoreProfiles.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/stageLoreProfiles.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/stageLoreProfiles.js';
import * as dlcToySoldiers from '../../DLC/ToySoldiers/data/stageLoreProfiles.js';
import * as dlcShaunOfTheDead from '../../DLC/ShaunOfTheDead/data/stageLoreProfiles.js';
import * as dlcPuppetMaster from '../../DLC/PuppetMaster/data/stageLoreProfiles.js';
import * as dlcChickenRun from '../../DLC/ChickenRun/data/stageLoreProfiles.js';
import * as dlcAnother from '../../DLC/Another/data/stageLoreProfiles.js';
import * as dlcGunnm from '../../DLC/Gunnm/data/stageLoreProfiles.js';
import * as dlcBattleRoyale from '../../DLC/BattleRoyale/data/stageLoreProfiles.js';
import * as dlcSpawn from '../../DLC/Spawn/data/stageLoreProfiles.js';
import * as dlcLinkinPark from '../../DLC/LinkinPark/data/stageLoreProfiles.js';
import * as dlcMoonwalker from '../../DLC/Moonwalker/data/stageLoreProfiles.js';
import * as dlcMichaelJackson from '../../DLC/MichaelJackson/data/stageLoreProfiles.js';
import * as dlcTheThing from '../../DLC/TheThing/data/stageLoreProfiles.js';
import * as dlcEvilDead from '../../DLC/EvilDead/data/stageLoreProfiles.js';
import * as dlcChappie from '../../DLC/Chappie/data/stageLoreProfiles.js';
import * as dlcGremlins from '../../DLC/Gremlins/data/stageLoreProfiles.js';
import * as dlcRockyHorrorPictureShow from '../../DLC/RockyHorrorPictureShow/data/stageLoreProfiles.js';
import * as dlcLaCiteDeLaPeur from '../../DLC/LaCiteDeLaPeur/data/stageLoreProfiles.js';
import * as dlcDefiance from '../../DLC/Defiance/data/stageLoreProfiles.js';
import * as dlcMarsAttacks from '../../DLC/MarsAttacks/data/stageLoreProfiles.js';
import * as dlcDandadan from '../../DLC/Dandadan/data/stageLoreProfiles.js';
import * as dlcCloverfield from '../../DLC/Cloverfield/data/stageLoreProfiles.js';
import * as dlcTheCollector from '../../DLC/TheCollector/data/stageLoreProfiles.js';
import * as dlcH2G2 from '../../DLC/H2G2/data/stageLoreProfiles.js';
import * as dlcIronSky from '../../DLC/IronSky/data/stageLoreProfiles.js';
import * as dlcREC from '../../DLC/REC/data/stageLoreProfiles.js';
import * as dlcSinister from '../../DLC/Sinister/data/stageLoreProfiles.js';
import * as dlcLesVisiteurs from '../../DLC/LesVisiteurs/data/stageLoreProfiles.js';
import * as dlcVoyageDeChihiro from '../../DLC/VoyageDeChihiro/data/stageLoreProfiles.js';
import * as dlcMeetTheFeebles from '../../DLC/MeetTheFeebles/data/stageLoreProfiles.js';
import * as dlcRogerRabbit from '../../DLC/RogerRabbit/data/stageLoreProfiles.js';
import * as dlcStarshipTroopers from '../../DLC/StarshipTroopers/data/stageLoreProfiles.js';
import * as dlcBanlieue13 from '../../DLC/Banlieue13/data/stageLoreProfiles.js';
import * as dlcHouseOf1000Corpses from '../../DLC/HouseOf1000Corpses/data/stageLoreProfiles.js';
import * as dlcOverlordAnime from '../../DLC/OverlordAnime/data/stageLoreProfiles.js';
import * as dlcSCPFoundation from '../../DLC/SCPFoundation/data/stageLoreProfiles.js';
import * as dlcSpoofMovie from '../../DLC/SpoofMovie/data/stageLoreProfiles.js';
import * as dlcMetalGearRising from '../../DLC/MetalGearRising/data/stageLoreProfiles.js';
import * as dlcBioShock from '../../DLC/BioShock/data/stageLoreProfiles.js';
import * as dlcTwistedMetal from '../../DLC/TwistedMetal/data/stageLoreProfiles.js';
import * as dlcSpiderTheVideoGame from '../../DLC/SpiderTheVideoGame/data/stageLoreProfiles.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/stageLoreProfiles.js';
import * as dlcFinalFantasyVIII from '../../DLC/FinalFantasyVIII/data/stageLoreProfiles.js';
import * as dlcFinalFantasyXIII from '../../DLC/FinalFantasyXIII/data/stageLoreProfiles.js';
import * as dlcFinalFantasyXV from '../../DLC/FinalFantasyXV/data/stageLoreProfiles.js';
import * as dlcCrashBandicoot from '../../DLC/CrashBandicoot/data/stageLoreProfiles.js';
import * as dlcTombRaider from '../../DLC/TombRaider/data/stageLoreProfiles.js';
import * as dlcTekken from '../../DLC/Tekken/data/stageLoreProfiles.js';
import * as dlcSpyro from '../../DLC/Spyro/data/stageLoreProfiles.js';
import * as dlcRayman from '../../DLC/Rayman/data/stageLoreProfiles.js';
import * as dlcParasiteEve from '../../DLC/ParasiteEve/data/stageLoreProfiles.js';
import * as dlcOddworld from '../../DLC/Oddworld/data/stageLoreProfiles.js';
import * as dlcLegacyOfKain from '../../DLC/LegacyOfKain/data/stageLoreProfiles.js';
import * as dlcGuitarHero from '../../DLC/GuitarHero/data/stageLoreProfiles.js';
import * as dlcDisenchantment from '../../DLC/Disenchantment/data/stageLoreProfiles.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/stageLoreProfiles.js';
import * as dlcFuturama from '../../DLC/Futurama/data/stageLoreProfiles.js';
import * as dlcKillzone from '../../DLC/Killzone/data/stageLoreProfiles.js';
import * as dlcYakuza from '../../DLC/Yakuza/data/stageLoreProfiles.js';
import * as dlcSoulCalibur from '../../DLC/SoulCalibur/data/stageLoreProfiles.js';
import * as dlcTheLastOfUs from '../../DLC/TheLastOfUs/data/stageLoreProfiles.js';
import * as dlcLittleBigPlanet from '../../DLC/LittleBigPlanet/data/stageLoreProfiles.js';
import * as dlcCounterStrike from '../../DLC/CounterStrike/data/stageLoreProfiles.js';
import * as dlcLeft4Dead from '../../DLC/Left4Dead/data/stageLoreProfiles.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/stageLoreProfiles.js';
import * as dlcJetSetRadio from '../../DLC/JetSetRadio/data/stageLoreProfiles.js';
import * as dlcAlteredBeast from '../../DLC/AlteredBeast/data/stageLoreProfiles.js';
import * as dlcStreetsOfRage from '../../DLC/StreetsOfRage/data/stageLoreProfiles.js';
import * as dlcEarthwormJim from '../../DLC/EarthwormJim/data/stageLoreProfiles.js';
import * as dlcEccoTheDolphin from '../../DLC/EccoTheDolphin/data/stageLoreProfiles.js';
import * as dlcFlashback from '../../DLC/Flashback/data/stageLoreProfiles.js';
import * as dlcSplatterhouse from '../../DLC/Splatterhouse/data/stageLoreProfiles.js';
import * as dlcSkibidi from '../../DLC/Skibidi/data/stageLoreProfiles.js';
import * as dlcSquidGame from '../../DLC/SquidGame/data/stageLoreProfiles.js';
import * as dlcLaCasaDePapel from '../../DLC/LaCasaDePapel/data/stageLoreProfiles.js';
import * as dlcGorillaz from '../../DLC/Gorillaz/data/stageLoreProfiles.js';
import * as dlcSecretOfMonkeyIsland from '../../DLC/SecretOfMonkeyIsland/data/stageLoreProfiles.js';
import * as dlcZombiesAteMyNeighbors from '../../DLC/ZombiesAteMyNeighbors/data/stageLoreProfiles.js';
import * as dlcWrongTurn from '../../DLC/WrongTurn/data/stageLoreProfiles.js';
import * as dlcKaruneCal from '../../DLC/KaruneCal/data/stageLoreProfiles.js';
import * as dlcBillieEilish from '../../DLC/BillieEilish/data/stageLoreProfiles.js';
import * as dlcGunsNRoses from '../../DLC/GunsNRoses/data/stageLoreProfiles.js';
import * as dlcBlackpink from '../../DLC/Blackpink/data/stageLoreProfiles.js';
import * as dlcLilNasX from '../../DLC/LilNasX/data/stageLoreProfiles.js';
import * as dlcEminem from '../../DLC/Eminem/data/stageLoreProfiles.js';
import * as dlcGhost from '../../DLC/Ghost/data/stageLoreProfiles.js';
import * as dlcBabymetal from '../../DLC/Babymetal/data/stageLoreProfiles.js';
import * as dlcLittleBig from '../../DLC/LittleBig/data/stageLoreProfiles.js';
import * as dlcTheWeeknd from '../../DLC/TheWeeknd/data/stageLoreProfiles.js';
import * as dlcAdo from '../../DLC/Ado/data/stageLoreProfiles.js';
import * as dlcASMRZ from '../../DLC/ASMRZ/data/stageLoreProfiles.js';
import * as dlcLadyGaga from '../../DLC/LadyGaga/data/stageLoreProfiles.js';
import * as dlcNightwish from '../../DLC/Nightwish/data/stageLoreProfiles.js';
import * as dlcPSY from '../../DLC/PSY/data/stageLoreProfiles.js';
import * as dlcShakira from '../../DLC/Shakira/data/stageLoreProfiles.js';
import * as dlcCthulhu from '../../DLC/Cthulhu/data/stageLoreProfiles.js';
import * as dlcNecronomicon from '../../DLC/Necronomicon/data/stageLoreProfiles.js';
import * as dlcReAnimator from '../../DLC/ReAnimator/data/stageLoreProfiles.js';
import * as dlcDigimonCelestialRift from '../../DLC/DigimonCelestialRift/data/stageLoreProfiles.js';
import * as dlcAuralVampire from '../../DLC/AuralVampire/data/stageLoreProfiles.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/stageLoreProfiles.js';
import * as dlcKorn from '../../DLC/Korn/data/stageLoreProfiles.js';
import * as dlcMarilynManson from '../../DLC/MarilynManson/data/stageLoreProfiles.js';
import * as dlcThalassaMnemique from '../../DLC/ThalassaMnemique/data/stageLoreProfiles.js';
import * as dlcMeridienCreux from '../../DLC/MeridienCreux/data/stageLoreProfiles.js';
import * as dlcViridienneUltime from '../../DLC/ViridienneUltime/data/stageLoreProfiles.js';
import * as dlcSplice from '../../DLC/Splice/data/stageLoreProfiles.js';
import * as dlcPoliceSquad from '../../DLC/PoliceSquad/data/stageLoreProfiles.js';
import * as dlcStargateInfinity from '../../DLC/StargateInfinity/data/stageLoreProfiles.js';
import * as dlcTheBraveLittleToaster from '../../DLC/TheBraveLittleToaster/data/stageLoreProfiles.js';
import * as dlcEvolution from '../../DLC/Evolution/data/stageLoreProfiles.js';
import * as dlcEvolutionTheAnimatedSeries from '../../DLC/EvolutionTheAnimatedSeries/data/stageLoreProfiles.js';
import * as dlcEarlyEdition from '../../DLC/EarlyEdition/data/stageLoreProfiles.js';
import * as dlcVelociPastor from '../../DLC/VelociPastor/data/stageLoreProfiles.js';
import * as dlcRubber from '../../DLC/Rubber/data/stageLoreProfiles.js';
import * as dlcSpermageddon from '../../DLC/Spermageddon/data/stageLoreProfiles.js';
import * as dlcZakEtCrysta from '../../DLC/ZakEtCrysta/data/stageLoreProfiles.js';
import * as dlcRichardAuPaysDesLivresMagiques from '../../DLC/RichardAuPaysDesLivresMagiques/data/stageLoreProfiles.js';
import * as dlcLesVisiteursDuFutur from '../../DLC/LesVisiteursDuFutur/data/stageLoreProfiles.js';
import * as dlcCameraCafe from '../../DLC/CameraCafe/data/stageLoreProfiles.js';
import * as dlcSamanthaOups from '../../DLC/SamanthaOups/data/stageLoreProfiles.js';
import * as dlcLesChevaliersDuFiel from '../../DLC/LesChevaliersDuFiel/data/stageLoreProfiles.js';
import * as dlcNoellePerna from '../../DLC/NoellePerna/data/stageLoreProfiles.js';
import * as dlcKungPow from '../../DLC/KungPow/data/stageLoreProfiles.js';
import * as dlcHowToMakeAMonster from '../../DLC/HowToMakeAMonster/data/stageLoreProfiles.js';
import * as dlcElvira from '../../DLC/Elvira/data/stageLoreProfiles.js';
import * as dlcHeavyMetal2000 from '../../DLC/HeavyMetal2000/data/stageLoreProfiles.js';
import * as dlcKillerTomatoesFromOuterSpace from '../../DLC/KillerTomatoesFromOuterSpace/data/stageLoreProfiles.js';
import * as dlcPeeWee from '../../DLC/PeeWee/data/stageLoreProfiles.js';
import * as dlcPingu from '../../DLC/Pingu/data/stageLoreProfiles.js';
import * as dlcDieAntwoord from '../../DLC/DieAntwoord/data/stageLoreProfiles.js';
import * as dlcLesInconnus from '../../DLC/LesInconnus/data/stageLoreProfiles.js';
import * as dlcRRRrrrr from '../../DLC/RRRrrrr/data/stageLoreProfiles.js';
import * as dlcBabyCart from '../../DLC/BabyCart/data/stageLoreProfiles.js';
import * as dlcLesTuche from '../../DLC/LesTuche/data/stageLoreProfiles.js';
import * as dlcKazaam from '../../DLC/Kazaam/data/stageLoreProfiles.js';
import * as dlcCroc from '../../DLC/Croc/data/stageLoreProfiles.js';
import * as dlcRugrats from '../../DLC/Rugrats/data/stageLoreProfiles.js';
import * as dlcBigMouth from '../../DLC/BigMouth/data/stageLoreProfiles.js';
import * as dlcFamilyGuy from '../../DLC/FamilyGuy/data/stageLoreProfiles.js';
import * as dlcAmericanDad from '../../DLC/AmericanDad/data/stageLoreProfiles.js';
import * as dlcLostPlanet2 from '../../DLC/LostPlanet2/data/stageLoreProfiles.js';
import * as dlcSeaman from '../../DLC/Seaman/data/stageLoreProfiles.js';
import * as dlcDynamiteDuke from '../../DLC/DynamiteDuke/data/stageLoreProfiles.js';
import * as dlcCoolSpot from '../../DLC/CoolSpot/data/stageLoreProfiles.js';
import * as dlcRistar from '../../DLC/Ristar/data/stageLoreProfiles.js';
import * as dlcSkrillex from '../../DLC/Skrillex/data/stageLoreProfiles.js';
import * as dlcIndila from '../../DLC/Indila/data/stageLoreProfiles.js';
import * as dlcKyaryPamyuPamyu from '../../DLC/KyaryPamyuPamyu/data/stageLoreProfiles.js';
import * as dlcSubUrban from '../../DLC/SubUrban/data/stageLoreProfiles.js';
import * as dlcBellaPoarch from '../../DLC/BellaPoarch/data/stageLoreProfiles.js';
import * as dlcManWithAMission from '../../DLC/ManWithAMission/data/stageLoreProfiles.js';
import * as dlcBandMaid from '../../DLC/BandMaid/data/stageLoreProfiles.js';
import * as dlcBringMeTheHorizon from '../../DLC/BringMeTheHorizon/data/stageLoreProfiles.js';
import * as dlcAtarashiiGakko from '../../DLC/AtarashiiGakko/data/stageLoreProfiles.js';
import * as dlcQueenBee from '../../DLC/QueenBee/data/stageLoreProfiles.js';
import * as dlcLadybaby from '../../DLC/Ladybaby/data/stageLoreProfiles.js';
import * as dlcBigfloOli from '../../DLC/BigfloOli/data/stageLoreProfiles.js';
import * as dlcHoshi from '../../DLC/Hoshi/data/stageLoreProfiles.js';
import * as dlcWithinTemptation from '../../DLC/WithinTemptation/data/stageLoreProfiles.js';
import * as dlcUltraVomit from '../../DLC/UltraVomit/data/stageLoreProfiles.js';
import * as dlcTommyHeavenly6 from '../../DLC/TommyHeavenly6/data/stageLoreProfiles.js';
import * as dlcBlackEyedPeas from '../../DLC/BlackEyedPeas/data/stageLoreProfiles.js';
import * as dlcShakaPonk from '../../DLC/ShakaPonk/data/stageLoreProfiles.js';
import * as dlcDeadmau5 from '../../DLC/Deadmau5/data/stageLoreProfiles.js';
import * as dlcTomba from '../../DLC/Tomba/data/stageLoreProfiles.js';
import * as dlcTheRing from '../../DLC/TheRing/data/stageLoreProfiles.js';
import * as dlcTheGrudge from '../../DLC/TheGrudge/data/stageLoreProfiles.js';
import * as dlcANightmareOnElmStreet from '../../DLC/ANightmareOnElmStreet/data/stageLoreProfiles.js';
import * as dlcWoodruff from '../../DLC/Woodruff/data/stageLoreProfiles.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/stageLoreProfiles.js';
import * as dlcJoJosBizarreAdventure from '../../DLC/JoJosBizarreAdventure/data/stageLoreProfiles.js';
import * as dlcElfenLied from '../../DLC/ElfenLied/data/stageLoreProfiles.js';
import * as dlcFullmetalAlchemist from '../../DLC/FullmetalAlchemist/data/stageLoreProfiles.js';
import * as dlcGantz from '../../DLC/Gantz/data/stageLoreProfiles.js';
import * as dlcPsychoPass from '../../DLC/PsychoPass/data/stageLoreProfiles.js';
import * as dlcFrierenBeyondJourneysEnd from '../../DLC/FrierenBeyondJourneysEnd/data/stageLoreProfiles.js';
import * as dlcNaruto from '../../DLC/Naruto/data/stageLoreProfiles.js';
import * as dlcNarutoShippuden from '../../DLC/NarutoShippuden/data/stageLoreProfiles.js';
import * as dlcBorutoNarutoNextGenerations from '../../DLC/BorutoNarutoNextGenerations/data/stageLoreProfiles.js';
import * as dlcBorutoTwoBlueVortex from '../../DLC/BorutoTwoBlueVortex/data/stageLoreProfiles.js';
import * as dlcLesAventuresDeSaturnin from '../../DLC/LesAventuresDeSaturnin/data/stageLoreProfiles.js';
import * as dlcMagiCJacK from '../../DLC/MagiCJacK/data/stageLoreProfiles.js';
import * as dlcTeenTitans from '../../DLC/TeenTitans/data/stageLoreProfiles.js';
import * as dlcGodzilla from '../../DLC/Godzilla/data/stageLoreProfiles.js';
import * as dlcChainsawMan from '../../DLC/ChainsawMan/data/stageLoreProfiles.js';
import * as dlcCyberpunkEdgerunners from '../../DLC/CyberpunkEdgerunners/data/stageLoreProfiles.js';
import * as dlcDemonSlayer from '../../DLC/DemonSlayer/data/stageLoreProfiles.js';
import * as dlcParasyte from '../../DLC/Parasyte/data/stageLoreProfiles.js';
import * as dlcZeroEscapeTheNonaryGames from '../../DLC/ZeroEscapeTheNonaryGames/data/stageLoreProfiles.js';
import * as dlcRurouniKenshin from '../../DLC/RurouniKenshin/data/stageLoreProfiles.js';
import * as dlcTokyoGhoul from '../../DLC/TokyoGhoul/data/stageLoreProfiles.js';
import * as dlcCowboyBebop from '../../DLC/CowboyBebop/data/stageLoreProfiles.js';
import * as dlcDragonBallZ from '../../DLC/DragonBallZ/data/stageLoreProfiles.js';
import * as dlcMashle from '../../DLC/Mashle/data/stageLoreProfiles.js';
import * as dlcSoloLeveling from '../../DLC/SoloLeveling/data/stageLoreProfiles.js';
import * as dlcDeadmanWonderland from '../../DLC/DeadmanWonderland/data/stageLoreProfiles.js';
import * as dlcDevilman from '../../DLC/Devilman/data/stageLoreProfiles.js';
import * as dlcNeonGenesisEvangelion from '../../DLC/NeonGenesisEvangelion/data/stageLoreProfiles.js';
import * as dlcOnePunchMan from '../../DLC/OnePunchMan/data/stageLoreProfiles.js';
import * as dlcSwordArtOnlineGunGaleOnline from '../../DLC/SwordArtOnlineGunGaleOnline/data/stageLoreProfiles.js';
import * as dlcSwordArtOnline from '../../DLC/SwordArtOnline/data/stageLoreProfiles.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/stageLoreProfiles.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/stageLoreProfiles.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/stageLoreProfiles.js';
import * as dlcStargate from '../../DLC/Stargate/data/stageLoreProfiles.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/stageLoreProfiles.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/stageLoreProfiles.js';

const MODE_SPECS = Object.freeze({
  Combat: {
    assetFile: 'combat.webp',
    camera: 'strict-side-view-16-9',
    composition: 'One continuous flat duel floor, a clear central 1v1 lane, shallow parallax, and tag entry zones outside the center.',
    promptTail: 'strict side-view 16:9 Combat camera, one continuous flat duel floor, clear central 1v1 lane, shallow parallax, props kept outside the fighters, no characters, logos, readable text or baked UI'
  },
  Melee: {
    assetFile: 'melee.webp',
    camera: 'strict-side-view-platform-arena',
    composition: 'Backdrop without baked platforms plus separately textureable platform tops, edges, walls, and readable collision silhouettes.',
    promptTail: 'strict side-view Melee camera, backdrop without baked platforms, separate platform tops and edges, readable collision silhouettes, traversal gaps, no characters, logos, readable text or baked UI'
  },
  RPG: {
    assetFile: 'rpg.webp',
    camera: 'side-view-2.5d',
    composition: 'A broad perspective battle floor, open central lane, low foreground, layered depth, and unobstructed party and enemy positions.',
    promptTail: 'side-view 2.5D RPG camera, broad perspective battle floor, open central lane, low foreground, layered depth, no characters, logos, readable text or baked UI'
  },
  Tactics: {
    assetFile: 'tactics.webp',
    camera: 'elevated-three-quarter-rectangular-grid',
    composition: 'An elevated three-quarter 8x6 rectangular grid with readable cover, traversable lanes, and lower rows visually in front of higher rows.',
    promptTail: 'elevated three-quarter Tactics camera, 8x6 rectangular grid, readable cover and traversable lanes, lower rows visually in front of higher rows, never top-down or diamond-isometric, no characters, logos, readable text or baked UI'
  }
});

const MODE_ALIASES = Object.freeze({
  Combat: 'Combat',
  Fighter: 'Combat',
  Melee: 'Melee',
  Smash: 'Melee',
  RPG: 'RPG',
  Tactics: 'Tactics'
});

const BLOCKED_CANONICAL_PATTERN = /^A definir\b/i;

const slugify = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const normalizeText = (value) => String(value).replace(/\s+/g, ' ').trim();

const buildModePrompt = ({ universeLabel, canonicalName, visualAnchor, blocked }, mode) => {
  if (blocked) {
    return `DO NOT GENERATE. ${canonicalName}. Resolve the exact source and canonical location for ${universeLabel} before producing the ${mode} asset.`;
  }
  return `Original high-detail 32-bit pixel-art environment for ${universeLabel}. Canonical location: ${canonicalName}. Visual anchor: ${visualAnchor}. ${MODE_SPECS[mode].promptTail}.`;
};

const buildModes = ({ universeLabel, slug, canonicalName, visualAnchor, blocked }) => {
  const basePath = `/backgrounds/lore-stages/${slug}`;
  const modes = {};

  for (const [mode, spec] of Object.entries(MODE_SPECS)) {
    modes[mode] = {
      assetPath: `${basePath}/${spec.assetFile}`,
      camera: spec.camera,
      composition: spec.composition,
      prompt: buildModePrompt({ universeLabel, canonicalName, visualAnchor, blocked }, mode)
    };
  }

  modes.Melee.backdropPath = `${basePath}/melee-backdrop.webp`;
  modes.Melee.platformTexturePath = `${basePath}/melee-platforms.webp`;
  modes.Tactics.tileTexturePath = `${basePath}/tactics-tiles.webp`;
  return Object.freeze(modes);
};

const buildProfile = ({
  key,
  slug,
  universeLabel,
  canonicalName,
  referenceUrls,
  visualAnchor = canonicalName,
  priority,
  auditStatus,
  stageId = null,
  universes = null,
  exclusiveVisualReference = false
}) => {
  const normalizedCanonicalName = normalizeText(canonicalName);
  const normalizedVisualAnchor = normalizeText(visualAnchor);
  const generationBlocked = BLOCKED_CANONICAL_PATTERN.test(normalizedCanonicalName);

  return Object.freeze({
    key,
    slug,
    canonicalName: normalizedCanonicalName,
    referenceUrls: Object.freeze([...referenceUrls]),
    visualAnchor: normalizedVisualAnchor,
    priority,
    auditStatus,
    generationBlocked,
    ...(stageId === null ? {} : { stageId }),
    ...(universes ? { universes: Object.freeze([...universes]) } : {}),
    ...(exclusiveVisualReference ? { exclusiveVisualReference: true } : {}),
    modes: buildModes({
      universeLabel,
      slug,
      canonicalName: normalizedCanonicalName,
      visualAnchor: normalizedVisualAnchor,
      blocked: generationBlocked
    })
  });
};

const UNIVERSE_PROFILE_DEFINITIONS = [
  dlcDiscworld.createUniverseProfileDefinitions(),
  dlcJokerNew52.createUniverseProfileDefinitions(),
  dlcTheBatmanWhoLaughs.createUniverseProfileDefinitions(),
  dlcKaamelott.createUniverseProfileDefinitions(),
  dlcPrometheus.createUniverseProfileDefinitions(),
  dlcAliens.createUniverseProfileDefinitions(),
  dlcAlien3.createUniverseProfileDefinitions(),
  dlcAlienResurrection.createUniverseProfileDefinitions(),
  dlcAlienCovenant.createUniverseProfileDefinitions(),
  dlcAlienRomulus.createUniverseProfileDefinitions(),
  dlcPredator2.createUniverseProfileDefinitions(),
  dlcPredators.createUniverseProfileDefinitions(),
  dlcThePredator.createUniverseProfileDefinitions(),
  dlcPrey.createUniverseProfileDefinitions(),
  dlcPredatorKillerOfKillers.createUniverseProfileDefinitions(),
  dlcPredatorBadlands.createUniverseProfileDefinitions(),
  dlcAlienVsPredator.createUniverseProfileDefinitions(),
  dlcAliensVsPredatorRequiem.createUniverseProfileDefinitions(),
  dlcDungeonMeshi.createUniverseProfileDefinitions(),
  dlcNoob.createUniverseProfileDefinitions(),
  dlcRammstein.createUniverseProfileDefinitions(),
  dlcSystemOfADown.createUniverseProfileDefinitions(),
  dlcRobZombie.createUniverseProfileDefinitions(),
  dlcDaftPunk.createUniverseProfileDefinitions(),
  dlcOliverTree.createUniverseProfileDefinitions(),
  dlcHazbinHotel.createUniverseProfileDefinitions(),
  dlcVocaloid.createUniverseProfileDefinitions(),
  dlcSlenderMan.createUniverseProfileDefinitions(),
  dlcUnreal.createUniverseProfileDefinitions(),
  dlcBreakingBad.createUniverseProfileDefinitions(),
  dlcStargateAtlantis.createUniverseProfileDefinitions(),
  dlcStargateUniverse.createUniverseProfileDefinitions(),
  dlcCharmed.createUniverseProfileDefinitions(),
  dlcBuffyTheVampireSlayer.createUniverseProfileDefinitions(),
  dlcAttackOnTitan.createUniverseProfileDefinitions(),
  dlcDeathNote.createUniverseProfileDefinitions(),
  dlcCellsAtWork.createUniverseProfileDefinitions(),
  dlcInuyashiki.createUniverseProfileDefinitions(),
  dlcBorderlands.createUniverseProfileDefinitions(),
  dlcFrom.createUniverseProfileDefinitions(),
  dlcUzumaki.createUniverseProfileDefinitions(),
  dlcToxicAvenger.createUniverseProfileDefinitions(),
  dlcExit8.createUniverseProfileDefinitions(),
  dlcHellHouseLLC.createUniverseProfileDefinitions(),
  dlcSausageParty.createUniverseProfileDefinitions(),
  dlcSpyXFamily.createUniverseProfileDefinitions(),
  dlcTerrifier.createUniverseProfileDefinitions(),
  dlcTenaciousD.createUniverseProfileDefinitions(),
  dlcM3GAN.createUniverseProfileDefinitions(),
  dlcWarOfTheWorlds.createUniverseProfileDefinitions(),
  dlcGhostbusters.createUniverseProfileDefinitions(),
  dlcOnechanbara.createUniverseProfileDefinitions(),
  dlcDespicer.createUniverseProfileDefinitions(),
  dlcRepoTheGeneticOpera.createUniverseProfileDefinitions(),
  dlcTremors.createUniverseProfileDefinitions(),
  dlcSkyline.createUniverseProfileDefinitions(),
  dlcPlaneteHurlante.createUniverseProfileDefinitions(),
  dlcSharknado.createUniverseProfileDefinitions(),
  dlcGodzillaTheAnimatedSeries.createUniverseProfileDefinitions(),
  dlcMalcolmInTheMiddle.createUniverseProfileDefinitions(),
  dlcTanyaTheEvil.createUniverseProfileDefinitions(),
  dlcVirus.createUniverseProfileDefinitions(),
  dlcHouseOfTheDead.createUniverseProfileDefinitions(),
  dlcHouseOfTheDead2.createUniverseProfileDefinitions(),
  dlcHouseOfTheDead3.createUniverseProfileDefinitions(),
  dlcToySoldiers.createUniverseProfileDefinitions(),
  dlcShaunOfTheDead.createUniverseProfileDefinitions(),
  dlcPuppetMaster.createUniverseProfileDefinitions(),
  dlcChickenRun.createUniverseProfileDefinitions(),
  dlcAnother.createUniverseProfileDefinitions(),
  dlcGunnm.createUniverseProfileDefinitions(),
  dlcBattleRoyale.createUniverseProfileDefinitions(),
  dlcSpawn.createUniverseProfileDefinitions(),
  dlcLinkinPark.createUniverseProfileDefinitions(),
  dlcMoonwalker.createUniverseProfileDefinitions(),
  dlcMichaelJackson.createUniverseProfileDefinitions(),
  dlcTheThing.createUniverseProfileDefinitions(),
  dlcEvilDead.createUniverseProfileDefinitions(),
  dlcChappie.createUniverseProfileDefinitions(),
  dlcGremlins.createUniverseProfileDefinitions(),
  dlcRockyHorrorPictureShow.createUniverseProfileDefinitions(),
  dlcLaCiteDeLaPeur.createUniverseProfileDefinitions(),
  dlcDefiance.createUniverseProfileDefinitions(),
  dlcMarsAttacks.createUniverseProfileDefinitions(),
  dlcDandadan.createUniverseProfileDefinitions(),
  dlcCloverfield.createUniverseProfileDefinitions(),
  dlcTheCollector.createUniverseProfileDefinitions(),
  dlcH2G2.createUniverseProfileDefinitions(),
  dlcIronSky.createUniverseProfileDefinitions(),
  dlcREC.createUniverseProfileDefinitions(),
  dlcSinister.createUniverseProfileDefinitions(),
  dlcLesVisiteurs.createUniverseProfileDefinitions(),
  dlcVoyageDeChihiro.createUniverseProfileDefinitions(),
  dlcMeetTheFeebles.createUniverseProfileDefinitions(),
  dlcRogerRabbit.createUniverseProfileDefinitions(),
  dlcStarshipTroopers.createUniverseProfileDefinitions(),
  dlcBanlieue13.createUniverseProfileDefinitions(),
  dlcHouseOf1000Corpses.createUniverseProfileDefinitions(),
  dlcOverlordAnime.createUniverseProfileDefinitions(),
  dlcSCPFoundation.createUniverseProfileDefinitions(),
  dlcSpoofMovie.createUniverseProfileDefinitions(),
  dlcMetalGearRising.createUniverseProfileDefinitions(),
  dlcBioShock.createUniverseProfileDefinitions(),
  dlcTwistedMetal.createUniverseProfileDefinitions(),
  dlcSpiderTheVideoGame.createUniverseProfileDefinitions(),
  dlcFinalFantasyVII.createUniverseProfileDefinitions(),
  dlcFinalFantasyVIII.createUniverseProfileDefinitions(),
  dlcFinalFantasyXIII.createUniverseProfileDefinitions(),
  dlcFinalFantasyXV.createUniverseProfileDefinitions(),
  dlcCrashBandicoot.createUniverseProfileDefinitions(),
  dlcTombRaider.createUniverseProfileDefinitions(),
  dlcTekken.createUniverseProfileDefinitions(),
  dlcSpyro.createUniverseProfileDefinitions(),
  dlcRayman.createUniverseProfileDefinitions(),
  dlcParasiteEve.createUniverseProfileDefinitions(),
  dlcOddworld.createUniverseProfileDefinitions(),
  dlcLegacyOfKain.createUniverseProfileDefinitions(),
  dlcGuitarHero.createUniverseProfileDefinitions(),
  dlcDisenchantment.createUniverseProfileDefinitions(),
  dlcTheSimpsons.createUniverseProfileDefinitions(),
  dlcFuturama.createUniverseProfileDefinitions(),
  dlcKillzone.createUniverseProfileDefinitions(),
  dlcYakuza.createUniverseProfileDefinitions(),
  dlcSoulCalibur.createUniverseProfileDefinitions(),
  dlcTheLastOfUs.createUniverseProfileDefinitions(),
  dlcLittleBigPlanet.createUniverseProfileDefinitions(),
  dlcCounterStrike.createUniverseProfileDefinitions(),
  dlcLeft4Dead.createUniverseProfileDefinitions(),
  dlcTeamFortress2.createUniverseProfileDefinitions(),
  dlcJetSetRadio.createUniverseProfileDefinitions(),
  dlcAlteredBeast.createUniverseProfileDefinitions(),
  dlcStreetsOfRage.createUniverseProfileDefinitions(),
  dlcEarthwormJim.createUniverseProfileDefinitions(),
  dlcEccoTheDolphin.createUniverseProfileDefinitions(),
  dlcFlashback.createUniverseProfileDefinitions(),
  dlcSplatterhouse.createUniverseProfileDefinitions(),
  dlcSkibidi.createUniverseProfileDefinitions(),
  dlcSquidGame.createUniverseProfileDefinitions(),
  dlcLaCasaDePapel.createUniverseProfileDefinitions(),
  dlcGorillaz.createUniverseProfileDefinitions(),
  dlcSecretOfMonkeyIsland.createUniverseProfileDefinitions(),
  dlcZombiesAteMyNeighbors.createUniverseProfileDefinitions(),
  dlcWrongTurn.createUniverseProfileDefinitions(),
  dlcKaruneCal.createUniverseProfileDefinitions(),
  dlcBillieEilish.createUniverseProfileDefinitions(),
  dlcGunsNRoses.createUniverseProfileDefinitions(),
  dlcBlackpink.createUniverseProfileDefinitions(),
  dlcLilNasX.createUniverseProfileDefinitions(),
  dlcEminem.createUniverseProfileDefinitions(),
  dlcGhost.createUniverseProfileDefinitions(),
  dlcBabymetal.createUniverseProfileDefinitions(),
  dlcLittleBig.createUniverseProfileDefinitions(),
  dlcTheWeeknd.createUniverseProfileDefinitions(),
  dlcAdo.createUniverseProfileDefinitions(),
  dlcASMRZ.createUniverseProfileDefinitions(),
  dlcLadyGaga.createUniverseProfileDefinitions(),
  dlcNightwish.createUniverseProfileDefinitions(),
  dlcPSY.createUniverseProfileDefinitions(),
  dlcShakira.createUniverseProfileDefinitions(),
  dlcCthulhu.createUniverseProfileDefinitions(),
  dlcNecronomicon.createUniverseProfileDefinitions(),
  dlcReAnimator.createUniverseProfileDefinitions(),
  dlcDigimonCelestialRift.createUniverseProfileDefinitions(),
  dlcAuralVampire.createUniverseProfileDefinitions(),
  dlcBuckethead.createUniverseProfileDefinitions(),
  dlcKorn.createUniverseProfileDefinitions(),
  dlcMarilynManson.createUniverseProfileDefinitions(),
  [
    "Neon Requiem",
    "P0",
    "ABSENT-VISUEL",
    "Nadir-9 vertical megacity, from the Rainline Bazaar to the Helix Memory Vault and OMNIA Cathedral",
    ["https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/originalUniversesManifest.json"],
    "Original project canon only: near-black violet sky and black-blue architecture, cyan Ghostline data rails, magenta Helix Crown accents, acid rain, licensed memory canisters and stacked transit platforms; OMNIA manifests as a monumental citymind cathedral rather than a humanoid robot"
  ],
  ["Nexus de Convergence", "P1", "ABSENT-VISUEL", "Mosaic City Central Atrium and A.R.C.A. anchor infrastructure", ["https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js"]],
  dlcThalassaMnemique.createUniverseProfileDefinitions(),
  dlcMeridienCreux.createUniverseProfileDefinitions(),
  dlcViridienneUltime.createUniverseProfileDefinitions()
];

const FULL_COVERAGE_PROFILE_DEFINITIONS = [
  dlcSplice.createFullCoverageProfileDefinitions(),
  dlcPoliceSquad.createFullCoverageProfileDefinitions(),
  dlcStargateInfinity.createFullCoverageProfileDefinitions(),
  dlcTheBraveLittleToaster.createFullCoverageProfileDefinitions(),
  dlcEvolution.createFullCoverageProfileDefinitions(),
  dlcEvolutionTheAnimatedSeries.createFullCoverageProfileDefinitions(),
  dlcEarlyEdition.createFullCoverageProfileDefinitions(),
  dlcVelociPastor.createFullCoverageProfileDefinitions(),
  dlcRubber.createFullCoverageProfileDefinitions(),
  dlcSpermageddon.createFullCoverageProfileDefinitions(),
  dlcZakEtCrysta.createFullCoverageProfileDefinitions(),
  dlcRichardAuPaysDesLivresMagiques.createFullCoverageProfileDefinitions(),
  dlcLesVisiteursDuFutur.createFullCoverageProfileDefinitions(),
  dlcCameraCafe.createFullCoverageProfileDefinitions(),
  dlcSamanthaOups.createFullCoverageProfileDefinitions(),
  dlcLesChevaliersDuFiel.createFullCoverageProfileDefinitions(),
  dlcNoellePerna.createFullCoverageProfileDefinitions(),
  dlcKungPow.createFullCoverageProfileDefinitions(),
  dlcHowToMakeAMonster.createFullCoverageProfileDefinitions(),
  dlcElvira.createFullCoverageProfileDefinitions(),
  dlcHeavyMetal2000.createFullCoverageProfileDefinitions(),
  dlcKillerTomatoesFromOuterSpace.createFullCoverageProfileDefinitions(),
  dlcPeeWee.createFullCoverageProfileDefinitions(),
  dlcPingu.createFullCoverageProfileDefinitions(),
  dlcDieAntwoord.createFullCoverageProfileDefinitions(),
  dlcLesInconnus.createFullCoverageProfileDefinitions(),
  dlcRRRrrrr.createFullCoverageProfileDefinitions(),
  dlcBabyCart.createFullCoverageProfileDefinitions(),
  dlcLesTuche.createFullCoverageProfileDefinitions(),
  dlcKazaam.createFullCoverageProfileDefinitions(),
  dlcCroc.createFullCoverageProfileDefinitions(),
  dlcRugrats.createFullCoverageProfileDefinitions(),
  dlcBigMouth.createFullCoverageProfileDefinitions(),
  dlcFamilyGuy.createFullCoverageProfileDefinitions(),
  dlcAmericanDad.createFullCoverageProfileDefinitions(),
  dlcLostPlanet2.createFullCoverageProfileDefinitions(),
  dlcSeaman.createFullCoverageProfileDefinitions(),
  dlcDynamiteDuke.createFullCoverageProfileDefinitions(),
  dlcCoolSpot.createFullCoverageProfileDefinitions(),
  dlcRistar.createFullCoverageProfileDefinitions(),
  dlcSkrillex.createFullCoverageProfileDefinitions(),
  dlcIndila.createFullCoverageProfileDefinitions(),
  dlcKyaryPamyuPamyu.createFullCoverageProfileDefinitions(),
  dlcSubUrban.createFullCoverageProfileDefinitions(),
  dlcBellaPoarch.createFullCoverageProfileDefinitions(),
  dlcManWithAMission.createFullCoverageProfileDefinitions(),
  dlcBandMaid.createFullCoverageProfileDefinitions(),
  dlcBringMeTheHorizon.createFullCoverageProfileDefinitions(),
  dlcAtarashiiGakko.createFullCoverageProfileDefinitions(),
  dlcQueenBee.createFullCoverageProfileDefinitions(),
  dlcLadybaby.createFullCoverageProfileDefinitions(),
  dlcBigfloOli.createFullCoverageProfileDefinitions(),
  dlcHoshi.createFullCoverageProfileDefinitions(),
  dlcWithinTemptation.createFullCoverageProfileDefinitions(),
  dlcUltraVomit.createFullCoverageProfileDefinitions(),
  dlcTommyHeavenly6.createFullCoverageProfileDefinitions(),
  dlcBlackEyedPeas.createFullCoverageProfileDefinitions(),
  dlcShakaPonk.createFullCoverageProfileDefinitions(),
  dlcDeadmau5.createFullCoverageProfileDefinitions(),
  dlcTomba.createFullCoverageProfileDefinitions(),
  dlcTheRing.createFullCoverageProfileDefinitions(),
  dlcTheGrudge.createFullCoverageProfileDefinitions(),
  dlcANightmareOnElmStreet.createFullCoverageProfileDefinitions(),
  dlcWoodruff.createFullCoverageProfileDefinitions(),
  dlcSteinsGate.createFullCoverageProfileDefinitions(),
  dlcJoJosBizarreAdventure.createFullCoverageProfileDefinitions(),
  dlcElfenLied.createFullCoverageProfileDefinitions(),
  dlcFullmetalAlchemist.createFullCoverageProfileDefinitions(),
  dlcGantz.createFullCoverageProfileDefinitions(),
  dlcPsychoPass.createFullCoverageProfileDefinitions(),
  dlcFrierenBeyondJourneysEnd.createFullCoverageProfileDefinitions(),
  dlcNaruto.createFullCoverageProfileDefinitions(),
  dlcNarutoShippuden.createFullCoverageProfileDefinitions(),
  dlcBorutoNarutoNextGenerations.createFullCoverageProfileDefinitions(),
  dlcBorutoTwoBlueVortex.createFullCoverageProfileDefinitions(),
  dlcLesAventuresDeSaturnin.createFullCoverageProfileDefinitions(),
  dlcMagiCJacK.createFullCoverageProfileDefinitions(),
  dlcTeenTitans.createFullCoverageProfileDefinitions(),
  dlcGodzilla.createFullCoverageProfileDefinitions(),
  dlcChainsawMan.createFullCoverageProfileDefinitions(),
  dlcCyberpunkEdgerunners.createFullCoverageProfileDefinitions(),
  dlcDemonSlayer.createFullCoverageProfileDefinitions(),
  dlcParasyte.createFullCoverageProfileDefinitions(),
  dlcZeroEscapeTheNonaryGames.createFullCoverageProfileDefinitions(),
  dlcRurouniKenshin.createFullCoverageProfileDefinitions(),
  dlcTokyoGhoul.createFullCoverageProfileDefinitions(),
  dlcCowboyBebop.createFullCoverageProfileDefinitions(),
  dlcDragonBallZ.createFullCoverageProfileDefinitions(),
  dlcMashle.createFullCoverageProfileDefinitions(),
  dlcSoloLeveling.createFullCoverageProfileDefinitions(),
  dlcDeadmanWonderland.createFullCoverageProfileDefinitions(),
  dlcDevilman.createFullCoverageProfileDefinitions(),
  dlcNeonGenesisEvangelion.createFullCoverageProfileDefinitions(),
  dlcOnePunchMan.createFullCoverageProfileDefinitions(),
  dlcSwordArtOnlineGunGaleOnline.createFullCoverageProfileDefinitions(),
  dlcSwordArtOnline.createFullCoverageProfileDefinitions()
];

const STAGE_ARC_PROFILE_DEFINITIONS = [
  {
    key: 'stargate_x_halo',
    stageId: 9001,
    priority: 'P0',
    auditStatus: 'FALLBACK',
    canonicalName: 'Installation 04 control room traversed by an active Stargate and SGC field equipment',
    referenceUrls: ['https://www.halowaypoint.com/halo-the-series', 'https://www.mgm.com/television/stargate-sg-1'],
    universes: ['Halo', 'Stargate']
  },
  {
    key: 'matrix_portal_ghost',
    stageId: 9002,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Construct white room broken by Aperture test chambers and New Port cyberbrain infrastructure',
    referenceUrls: ['https://www.warnerbros.com/movies/matrix', 'https://store.steampowered.com/app/620/Portal_2/', 'https://theghostintheshell.jp/'],
    universes: ['The Matrix', 'Portal', 'Ghost in the Shell']
  },
  {
    key: 'silent_resident_saw',
    stageId: 9003,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Brookhaven or Alchemilla ward fused with RPD medical storage and Saw trap rails',
    referenceUrls: ['https://www.konami.com/games/silenthill/', 'https://game.capcom.com/residentevil/', 'https://www.lionsgate.com/franchises/saw'],
    universes: ['Silent Hill', 'Resident Evil', 'Saw']
  },
  {
    key: 'buffycharmed_hellraiser',
    stageId: 9004,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Sunnydale High library Hellmouth crossed with Halliwell Manor attic and Leviathan corridor',
    referenceUrls: ['https://en.wikipedia.org/wiki/Buffy_the_Vampire_Slayer', 'https://www.cwtv.com/shows/charmed/', 'https://press.hulu.com/shows/hellraiser/'],
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser']
  },
  {
    key: 'breakingbad_splice_evolution',
    stageId: 9005,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Lavanderia superlab contaminated by Nucleic Exchange tanks and Glen Canyon alien growth',
    referenceUrls: ['https://www.amc.com/shows/breaking-bad--1002078', 'https://en.wikipedia.org/wiki/Splice_(film)', 'https://www.dreamworks.com/movies/evolution'],
    universes: ['Breaking Bad', 'Splice', 'Evolution']
  },
  {
    key: 'aot_deathnote_inuyashiki',
    stageId: 9006,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Shiganshina rooftop above a Death Note investigation command post invaded by Inuyashiki machinery',
    referenceUrls: ['https://shingeki.tv/final/', 'https://www.viz.com/death-note', 'https://www.inuyashiki-project.com/'],
    universes: ['Attack on Titan', 'Death Note', 'Inuyashiki']
  },
  dlcHellraiser.createStageArcProfileDefinitions(),
  dlcResidentEvil.createStageArcProfileDefinitions(),
  dlcHalfLife.createStageArcProfileDefinitions(),
  dlcStargate.createStageArcProfileDefinitions(),
  dlcSilentHill.createStageArcProfileDefinitions(),
  dlcDinoCrisis.createStageArcProfileDefinitions(),
  dlcBuckethead.createStageArcProfileDefinitions(),
  dlcSystemOfADown.createStageArcProfileDefinitions(),
  dlcKaamelott.createStageArcProfileDefinitions(),
  {
    key: 'stargate_chain',
    stageId: 40017,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Four-gate network junction with SGC, Atlantis, Destiny and animated Infinity sectors',
    referenceUrls: ['https://www.mgm.com/television/stargate-sg-1', 'https://www.gateworld.net/atlantis/', 'https://www.gateworld.net/universe/'],
    universes: ['Stargate', 'Stargate Atlantis', 'Stargate Universe', 'Stargate Infinity']
  },
  {
    key: 'lab_disasters',
    stageId: 40018,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Black Mesa, Aperture, Umbrella, Ibis and Ishimura rupture laboratory',
    referenceUrls: ['https://store.steampowered.com/app/70/HalfLife/', 'https://store.steampowered.com/app/620/Portal_2/', 'https://game.capcom.com/residentevil/'],
    universes: ['Half-Life', 'Portal', 'Resident Evil', 'Dino Crisis', 'Dead Space']
  },
  {
    key: 'watcher_hellmouth',
    stageId: 40019,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Sunnydale Hellmouth tactical seal linked to Halliwell Manor, Leviathan and Pentagram City',
    referenceUrls: ['https://en.wikipedia.org/wiki/Buffy_the_Vampire_Slayer', 'https://www.cwtv.com/shows/charmed/', 'https://press.hulu.com/shows/hellraiser/', 'https://www.aboutamazon.com/news/entertainment/hazbin-hotel-prime-video'],
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser', 'Hazbin Hotel']
  },
  {
    key: 'anime_judgment_cell',
    stageId: 40020,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Shiganshina command infirmary visualized as a living-body defense map with an investigation desk',
    referenceUrls: ['https://shingeki.tv/final/', 'https://www.viz.com/death-note', 'https://hataraku-saibou.com/', 'https://www.inuyashiki-project.com/'],
    universes: ['Attack on Titan', 'Death Note', 'Cells at Work!', 'Inuyashiki']
  },
  {
    key: 'atrium_first_cell',
    stageId: 41001,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'A.R.C.A. Atrium training grid stabilized by Black Mesa and UNSC modules',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence', 'Half-Life', 'Halo']
  },
  {
    key: 'survivors_last_door',
    stageId: 41002,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Nostromo emergency door between an RPD safe room and Aperture exit chamber',
    referenceUrls: ['https://www.20thcenturystudios.com/movies/alien', 'https://game.capcom.com/residentevil/', 'https://store.steampowered.com/app/620/Portal_2/'],
    universes: ['Alien', 'Resident Evil', 'Portal']
  },
  {
    key: 'occult_wrong_prophecy',
    stageId: 41003,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Yautja trophy court swallowed by Silent Hill Otherworld and Leviathan chains',
    referenceUrls: ['https://www.20thcenturystudios.com/movies/predator', 'https://www.konami.com/games/silenthill/', 'https://press.hulu.com/shows/hellraiser/'],
    universes: ['Predator', 'Silent Hill', 'Hellraiser']
  },
  {
    key: 'control_formula_matrix',
    stageId: 41004,
    priority: 'P0',
    auditStatus: 'FALLBACK',
    canonicalName: 'Matrix Source control room intersected by an SGC embarkation ramp and Shadow Moses command deck',
    referenceUrls: ['https://www.warnerbros.com/movies/matrix', 'https://www.mgm.com/television/stargate-sg-1', 'https://www.konami.com/mg/'],
    universes: ['The Matrix', 'Stargate', 'Metal Gear']
  },
  {
    key: 'stage:90000',
    stageId: 90000,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Central Atrium first anchor-calibration floor',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8801',
    stageId: 8801,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Central Atrium name-beacon lock',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8802',
    stageId: 8802,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Static Archives inner ring and contradiction nodes',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8803',
    stageId: 8803,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Origin Shard Foundry and divergent-life matrices',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8804',
    stageId: 8804,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Restricted Black Ledger accounting core',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8805',
    stageId: 8805,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Broken Portal Yard with one causal gate',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8806',
    stageId: 8806,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'White Threshold beyond Mosaic City',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  }
];

const makeUniverseProfiles = () => {
  const profiles = {};
  const usedSlugs = new Set();

  const definitions = [...UNIVERSE_PROFILE_DEFINITIONS, ...FULL_COVERAGE_PROFILE_DEFINITIONS];
  for (const [universe, priority, auditStatus, canonicalName, referenceUrls, visualAnchor = canonicalName] of definitions) {
    const slug = slugify(universe);
    if (!slug || profiles[universe] || usedSlugs.has(slug)) {
      throw new Error(`Duplicate or invalid stage lore universe profile: ${universe}`);
    }
    usedSlugs.add(slug);
    profiles[universe] = buildProfile({
      key: universe,
      slug,
      universeLabel: universe,
      canonicalName,
      referenceUrls,
      visualAnchor,
      priority,
      auditStatus
    });
  }

  return Object.freeze(profiles);
};

const makeArcProfiles = () => {
  const profiles = {};
  const usedSlugs = new Set();

  for (const definition of STAGE_ARC_PROFILE_DEFINITIONS) {
    const slug = `arc-${slugify(definition.key)}`;
    if (!slug || profiles[definition.key] || usedSlugs.has(slug)) {
      throw new Error(`Duplicate or invalid stage lore arc profile: ${definition.key}`);
    }
    usedSlugs.add(slug);
    profiles[definition.key] = buildProfile({
      ...definition,
      slug,
      universeLabel: definition.universes.join(' x ')
    });
  }

  return Object.freeze(profiles);
};

export const STAGE_LORE_PROFILES = makeUniverseProfiles();
export const STAGE_ARC_LORE_PROFILES = makeArcProfiles();

const STAGE_ARC_PROFILE_BY_ID = Object.freeze(Object.fromEntries(
  Object.values(STAGE_ARC_LORE_PROFILES).map(profile => [String(profile.stageId), profile])
));

export function getStageLoreProfile(stageOrKey) {
  if (typeof stageOrKey === 'number') {
    return STAGE_ARC_PROFILE_BY_ID[String(stageOrKey)] || null;
  }

  if (typeof stageOrKey === 'string') {
    return STAGE_ARC_LORE_PROFILES[stageOrKey]
      || STAGE_LORE_PROFILES[stageOrKey]
      || STAGE_ARC_PROFILE_BY_ID[stageOrKey]
      || null;
  }

  if (!stageOrKey || typeof stageOrKey !== 'object') return null;

  const stableKey = stageOrKey.arcId || stageOrKey.stableKey || stageOrKey.key;
  if (stableKey && STAGE_ARC_LORE_PROFILES[stableKey]) {
    return STAGE_ARC_LORE_PROFILES[stableKey];
  }

  const stageId = stageOrKey.stageId ?? stageOrKey.id;
  if (stageId !== undefined && STAGE_ARC_PROFILE_BY_ID[String(stageId)]) {
    return STAGE_ARC_PROFILE_BY_ID[String(stageId)];
  }

  return STAGE_LORE_PROFILES[stageOrKey.universe] || null;
}

export function getStageLoreAssetPlan(stageOrKey, mode) {
  const profile = getStageLoreProfile(stageOrKey);
  const requestedMode = mode || (stageOrKey && typeof stageOrKey === 'object' ? stageOrKey.mode : null);
  const normalizedMode = MODE_ALIASES[requestedMode];
  if (!profile || !normalizedMode) return null;

  return Object.freeze({
    profileKey: profile.key,
    canonicalName: profile.canonicalName,
    referenceUrls: profile.referenceUrls,
    visualAnchor: profile.visualAnchor,
    priority: profile.priority,
    auditStatus: profile.auditStatus,
    generationBlocked: profile.generationBlocked,
    mode: normalizedMode,
    ...profile.modes[normalizedMode]
  });
}
