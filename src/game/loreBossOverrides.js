// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcDoomSweeperSafeApocalypse from '../../DLC/DoomSweeperSafeApocalypse/data/loreBossOverrides.js';
import * as dlcHeavyMetal2000 from '../../DLC/HeavyMetal2000/data/loreBossOverrides.js';
import * as dlcKillerTomatoesFromOuterSpace from '../../DLC/KillerTomatoesFromOuterSpace/data/loreBossOverrides.js';
import * as dlcPlaneteHurlante from '../../DLC/PlaneteHurlante/data/loreBossOverrides.js';
import * as dlcSharknado from '../../DLC/Sharknado/data/loreBossOverrides.js';
import * as dlcGodzillaTheAnimatedSeries from '../../DLC/GodzillaTheAnimatedSeries/data/loreBossOverrides.js';
import * as dlcPeeWee from '../../DLC/PeeWee/data/loreBossOverrides.js';
import * as dlcMalcolmInTheMiddle from '../../DLC/MalcolmInTheMiddle/data/loreBossOverrides.js';
import * as dlcTanyaTheEvil from '../../DLC/TanyaTheEvil/data/loreBossOverrides.js';
import * as dlcVirus from '../../DLC/Virus/data/loreBossOverrides.js';
import * as dlcToySoldiers from '../../DLC/ToySoldiers/data/loreBossOverrides.js';
import * as dlcShaunOfTheDead from '../../DLC/ShaunOfTheDead/data/loreBossOverrides.js';
import * as dlcPuppetMaster from '../../DLC/PuppetMaster/data/loreBossOverrides.js';
import * as dlcChickenRun from '../../DLC/ChickenRun/data/loreBossOverrides.js';
import * as dlcAnother from '../../DLC/Another/data/loreBossOverrides.js';
import * as dlcGunnm from '../../DLC/Gunnm/data/loreBossOverrides.js';
import * as dlcBattleRoyale from '../../DLC/BattleRoyale/data/loreBossOverrides.js';
import * as dlcSpawn from '../../DLC/Spawn/data/loreBossOverrides.js';
import * as dlcPingu from '../../DLC/Pingu/data/loreBossOverrides.js';
import * as dlcMoonwalker from '../../DLC/Moonwalker/data/loreBossOverrides.js';
import * as dlcMichaelJackson from '../../DLC/MichaelJackson/data/loreBossOverrides.js';
import * as dlcTheThing from '../../DLC/TheThing/data/loreBossOverrides.js';
import * as dlcEvilDead from '../../DLC/EvilDead/data/loreBossOverrides.js';
import * as dlcChappie from '../../DLC/Chappie/data/loreBossOverrides.js';
import * as dlcGremlins from '../../DLC/Gremlins/data/loreBossOverrides.js';
import * as dlcRockyHorrorPictureShow from '../../DLC/RockyHorrorPictureShow/data/loreBossOverrides.js';
import * as dlcRRRrrrr from '../../DLC/RRRrrrr/data/loreBossOverrides.js';
import * as dlcLaCiteDeLaPeur from '../../DLC/LaCiteDeLaPeur/data/loreBossOverrides.js';
import * as dlcDefiance from '../../DLC/Defiance/data/loreBossOverrides.js';
import * as dlcMarsAttacks from '../../DLC/MarsAttacks/data/loreBossOverrides.js';
import * as dlcDandadan from '../../DLC/Dandadan/data/loreBossOverrides.js';
import * as dlcBabyCart from '../../DLC/BabyCart/data/loreBossOverrides.js';
import * as dlcCloverfield from '../../DLC/Cloverfield/data/loreBossOverrides.js';
import * as dlcH2G2 from '../../DLC/H2G2/data/loreBossOverrides.js';
import * as dlcIronSky from '../../DLC/IronSky/data/loreBossOverrides.js';
import * as dlcREC from '../../DLC/REC/data/loreBossOverrides.js';
import * as dlcSinister from '../../DLC/Sinister/data/loreBossOverrides.js';
import * as dlcLesVisiteurs from '../../DLC/LesVisiteurs/data/loreBossOverrides.js';
import * as dlcKazaam from '../../DLC/Kazaam/data/loreBossOverrides.js';
import * as dlcVoyageDeChihiro from '../../DLC/VoyageDeChihiro/data/loreBossOverrides.js';
import * as dlcMeetTheFeebles from '../../DLC/MeetTheFeebles/data/loreBossOverrides.js';
import * as dlcRogerRabbit from '../../DLC/RogerRabbit/data/loreBossOverrides.js';
import * as dlcStarshipTroopers from '../../DLC/StarshipTroopers/data/loreBossOverrides.js';
import * as dlcBanlieue13 from '../../DLC/Banlieue13/data/loreBossOverrides.js';
import * as dlcHouseOf1000Corpses from '../../DLC/HouseOf1000Corpses/data/loreBossOverrides.js';
import * as dlcOverlordAnime from '../../DLC/OverlordAnime/data/loreBossOverrides.js';
import * as dlcSCPFoundation from '../../DLC/SCPFoundation/data/loreBossOverrides.js';
import * as dlcFamilyGuy from '../../DLC/FamilyGuy/data/loreBossOverrides.js';
import * as dlcAmericanDad from '../../DLC/AmericanDad/data/loreBossOverrides.js';
import * as dlcLostPlanet2 from '../../DLC/LostPlanet2/data/loreBossOverrides.js';
import * as dlcJetSetRadio from '../../DLC/JetSetRadio/data/loreBossOverrides.js';
import * as dlcAlteredBeast from '../../DLC/AlteredBeast/data/loreBossOverrides.js';
import * as dlcStreetsOfRage from '../../DLC/StreetsOfRage/data/loreBossOverrides.js';
import * as dlcEarthwormJim from '../../DLC/EarthwormJim/data/loreBossOverrides.js';
import * as dlcEccoTheDolphin from '../../DLC/EccoTheDolphin/data/loreBossOverrides.js';
import * as dlcFlashback from '../../DLC/Flashback/data/loreBossOverrides.js';
import * as dlcRistar from '../../DLC/Ristar/data/loreBossOverrides.js';
import * as dlcSplatterhouse from '../../DLC/Splatterhouse/data/loreBossOverrides.js';
import * as dlcSquidGame from '../../DLC/SquidGame/data/loreBossOverrides.js';
import * as dlcLaCasaDePapel from '../../DLC/LaCasaDePapel/data/loreBossOverrides.js';
import * as dlcSecretOfMonkeyIsland from '../../DLC/SecretOfMonkeyIsland/data/loreBossOverrides.js';
import * as dlcZombiesAteMyNeighbors from '../../DLC/ZombiesAteMyNeighbors/data/loreBossOverrides.js';
import * as dlcWrongTurn from '../../DLC/WrongTurn/data/loreBossOverrides.js';
import * as dlcCthulhu from '../../DLC/Cthulhu/data/loreBossOverrides.js';
import * as dlcNecronomicon from '../../DLC/Necronomicon/data/loreBossOverrides.js';
import * as dlcReAnimator from '../../DLC/ReAnimator/data/loreBossOverrides.js';
import * as dlcDigimonCelestialRift from '../../DLC/DigimonCelestialRift/data/loreBossOverrides.js';
import * as dlcHalo from '../../DLC/Halo/data/loreBossOverrides.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/loreBossOverrides.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/loreBossOverrides.js';
import * as dlcStargate from '../../DLC/Stargate/data/loreBossOverrides.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/loreBossOverrides.js';
import * as dlcPortal from '../../DLC/Portal/data/loreBossOverrides.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/loreBossOverrides.js';
import * as dlcFallout from '../../DLC/Fallout/data/loreBossOverrides.js';
import * as dlcScaryMovie from '../../DLC/ScaryMovie/data/loreBossOverrides.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/loreBossOverrides.js';
import * as dlcDiscworld from '../../DLC/Discworld/data/loreBossOverrides.js';
import * as dlcTheBatmanWhoLaughs from '../../DLC/TheBatmanWhoLaughs/data/loreBossOverrides.js';
import * as dlcAliens from '../../DLC/Aliens/data/loreBossOverrides.js';
import * as dlcAlien3 from '../../DLC/Alien3/data/loreBossOverrides.js';
import * as dlcAlienResurrection from '../../DLC/AlienResurrection/data/loreBossOverrides.js';
import * as dlcAlienCovenant from '../../DLC/AlienCovenant/data/loreBossOverrides.js';
import * as dlcAlienRomulus from '../../DLC/AlienRomulus/data/loreBossOverrides.js';
import * as dlcPredator2 from '../../DLC/Predator2/data/loreBossOverrides.js';
import * as dlcPrey from '../../DLC/Prey/data/loreBossOverrides.js';
import * as dlcAlienVsPredator from '../../DLC/AlienVsPredator/data/loreBossOverrides.js';
import * as dlcAliensVsPredatorRequiem from '../../DLC/AliensVsPredatorRequiem/data/loreBossOverrides.js';
import * as dlcNoob from '../../DLC/Noob/data/loreBossOverrides.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/loreBossOverrides.js';
import * as dlcSplice from '../../DLC/Splice/data/loreBossOverrides.js';
import * as dlcStargateUniverse from '../../DLC/StargateUniverse/data/loreBossOverrides.js';
import * as dlcBuffyTheVampireSlayer from '../../DLC/BuffyTheVampireSlayer/data/loreBossOverrides.js';
import * as dlcCellsAtWork from '../../DLC/CellsAtWork/data/loreBossOverrides.js';
import * as dlcInuyashiki from '../../DLC/Inuyashiki/data/loreBossOverrides.js';
import * as dlcBorderlands from '../../DLC/Borderlands/data/loreBossOverrides.js';
import * as dlcFrom from '../../DLC/From/data/loreBossOverrides.js';
import * as dlcToxicAvenger from '../../DLC/ToxicAvenger/data/loreBossOverrides.js';
import * as dlcHellHouseLLC from '../../DLC/HellHouseLLC/data/loreBossOverrides.js';
import * as dlcSpyXFamily from '../../DLC/SpyXFamily/data/loreBossOverrides.js';
import * as dlcTerrifier from '../../DLC/Terrifier/data/loreBossOverrides.js';
import * as dlcRichardAuPaysDesLivresMagiques from '../../DLC/RichardAuPaysDesLivresMagiques/data/loreBossOverrides.js';
import * as dlcTenaciousD from '../../DLC/TenaciousD/data/loreBossOverrides.js';
import * as dlcM3GAN from '../../DLC/M3GAN/data/loreBossOverrides.js';
import * as dlcWarOfTheWorlds from '../../DLC/WarOfTheWorlds/data/loreBossOverrides.js';
import * as dlcRepoTheGeneticOpera from '../../DLC/RepoTheGeneticOpera/data/loreBossOverrides.js';
import * as dlcTremors from '../../DLC/Tremors/data/loreBossOverrides.js';
import * as dlcAlien from '../../DLC/Alien/data/loreBossOverrides.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/loreBossOverrides.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/loreBossOverrides.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/loreBossOverrides.js';
import * as dlcTeenTitans from '../../DLC/TeenTitans/data/loreBossOverrides.js';
import * as dlcLesInconnus from '../../DLC/LesInconnus/data/loreBossOverrides.js';
import * as dlcLesTuche from '../../DLC/LesTuche/data/loreBossOverrides.js';
import * as dlcSpoofMovie from '../../DLC/SpoofMovie/data/loreBossOverrides.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/loreBossOverrides.js';
import * as dlcFuturama from '../../DLC/Futurama/data/loreBossOverrides.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/loreBossOverrides.js';
import * as dlcCoolSpot from '../../DLC/CoolSpot/data/loreBossOverrides.js';
import * as dlcIndila from '../../DLC/Indila/data/loreBossOverrides.js';
import * as dlcManWithAMission from '../../DLC/ManWithAMission/data/loreBossOverrides.js';
import * as dlcGunsNRoses from '../../DLC/GunsNRoses/data/loreBossOverrides.js';
import * as dlcBandMaid from '../../DLC/BandMaid/data/loreBossOverrides.js';
import * as dlcAtarashiiGakko from '../../DLC/AtarashiiGakko/data/loreBossOverrides.js';
import * as dlcLadybaby from '../../DLC/Ladybaby/data/loreBossOverrides.js';
import * as dlcBigfloOli from '../../DLC/BigfloOli/data/loreBossOverrides.js';
import * as dlcHoshi from '../../DLC/Hoshi/data/loreBossOverrides.js';
import * as dlcASMRZ from '../../DLC/ASMRZ/data/loreBossOverrides.js';
import * as dlcPredator from '../../DLC/Predator/data/loreBossOverrides.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/loreBossOverrides.js';
import * as dlcSaw from '../../DLC/Saw/data/loreBossOverrides.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/loreBossOverrides.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/loreBossOverrides.js';
import * as dlcEarlyEdition from '../../DLC/EarlyEdition/data/loreBossOverrides.js';
import * as dlcDeathNote from '../../DLC/DeathNote/data/loreBossOverrides.js';
import * as dlcExit8 from '../../DLC/Exit8/data/loreBossOverrides.js';
import * as dlcSausageParty from '../../DLC/SausageParty/data/loreBossOverrides.js';
import * as dlcSpermageddon from '../../DLC/Spermageddon/data/loreBossOverrides.js';
import * as dlcLesVisiteursDuFutur from '../../DLC/LesVisiteursDuFutur/data/loreBossOverrides.js';
import * as dlcCameraCafe from '../../DLC/CameraCafe/data/loreBossOverrides.js';
import * as dlcSamanthaOups from '../../DLC/SamanthaOups/data/loreBossOverrides.js';
import * as dlcLesChevaliersDuFiel from '../../DLC/LesChevaliersDuFiel/data/loreBossOverrides.js';
import * as dlcNoellePerna from '../../DLC/NoellePerna/data/loreBossOverrides.js';
import * as dlcCounterStrike from '../../DLC/CounterStrike/data/loreBossOverrides.js';
import * as dlcRammstein from '../../DLC/Rammstein/data/loreBossOverrides.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/loreBossOverrides.js';
import * as dlcDaftPunk from '../../DLC/DaftPunk/data/loreBossOverrides.js';
import * as dlcOliverTree from '../../DLC/OliverTree/data/loreBossOverrides.js';
import * as dlcStargateInfinity from '../../DLC/StargateInfinity/data/loreBossOverrides.js';
import * as dlcEvolutionTheAnimatedSeries from '../../DLC/EvolutionTheAnimatedSeries/data/loreBossOverrides.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/loreBossOverrides.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/loreBossOverrides.js';
import * as dlcRubber from '../../DLC/Rubber/data/loreBossOverrides.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/loreBossOverrides.js';
import * as dlcZeroEscapeTheNonaryGames from '../../DLC/ZeroEscapeTheNonaryGames/data/loreBossOverrides.js';

const slugify = (value) => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const SPRITE_PROMPT_PREFIX = dlcDoomSweeperSafeApocalypse.createSpritePromptPrefix();

const buildSpritePrompt = ({ name, universe, weapon, special, phases, visualAnchor, combatMechanicsStatus }) => [
  SPRITE_PROMPT_PREFIX,
  `Subject: ${name} from ${universe}.`,
  `Visual lock: ${visualAnchor}`,
  `${combatMechanicsStatus === 'game-adaptation' ? 'Gameplay adaptation' : 'Canonical combat identity'}: ${weapon}; signature action: ${special}.`,
  `Gameplay phases: ${phases.join(' Then ')}.`,
  'Do not add Nexus armor, cross-franchise equipment, alternate-era clothing or anatomy that is absent from the reference.'
].join(' ');

const defineBoss = (universe, entry) => Object.freeze({
  name: entry.name,
  weapon: entry.weapon,
  special: entry.special,
  phases: Object.freeze([...entry.phases]),
  lore: Object.freeze({ ...entry.lore }),
  referenceUrl: entry.referenceUrl,
  visualAnchor: entry.visualAnchor,
  ...(entry.combatMechanicsStatus ? { combatMechanicsStatus: entry.combatMechanicsStatus } : {}),
  ...(entry.visualReviewStatus ? { visualReviewStatus: entry.visualReviewStatus } : {}),
  spritePrompt: buildSpritePrompt({ universe, ...entry }),
  output: `/sprites/generated/bosses/${slugify(universe)}/${slugify(entry.name)}.png`
});

const RAW_BOSS_OVERRIDES = {
  'Heavy Metal 2000': dlcHeavyMetal2000.createRawBossOverrides(),
  'Killer Tomatoes from Outer Space': dlcKillerTomatoesFromOuterSpace.createRawBossOverrides(),
  'Planete Hurlante': dlcPlaneteHurlante.createRawBossOverrides(),
  Sharknado: dlcSharknado.createRawBossOverrides(),
  'Godzilla The Animated Series': dlcGodzillaTheAnimatedSeries.createRawBossOverrides(),
  'Pee-wee': dlcPeeWee.createRawBossOverrides(),
  'Malcolm in the Middle': dlcMalcolmInTheMiddle.createRawBossOverrides(),
  'Tanya the Evil': dlcTanyaTheEvil.createRawBossOverrides(),
  Virus: dlcVirus.createRawBossOverrides(),
  'Toy Soldiers': dlcToySoldiers.createRawBossOverrides(),
  'Shaun of the Dead': dlcShaunOfTheDead.createRawBossOverrides(),
  'Puppet Master': dlcPuppetMaster.createRawBossOverrides(),
  'Chicken Run': dlcChickenRun.createRawBossOverrides(),
  Another: dlcAnother.createRawBossOverrides(),
  Gunnm: dlcGunnm.createRawBossOverrides(),
  'Battle Royale': dlcBattleRoyale.createRawBossOverrides(),
  Spawn: dlcSpawn.createRawBossOverrides(),
  Pingu: dlcPingu.createRawBossOverrides(),
  Moonwalker: dlcMoonwalker.createRawBossOverrides(),
  'Michael Jackson': dlcMichaelJackson.createRawBossOverrides(),
  'The Thing': dlcTheThing.createRawBossOverrides(),
  'Evil Dead': dlcEvilDead.createRawBossOverrides(),
  Chappie: dlcChappie.createRawBossOverrides(),
  Gremlins: dlcGremlins.createRawBossOverrides(),
  'Rocky Horror Picture Show': dlcRockyHorrorPictureShow.createRawBossOverrides(),
  'RRRrrrr!!!': dlcRRRrrrr.createRawBossOverrides(),
  'La Cite de la Peur': dlcLaCiteDeLaPeur.createRawBossOverrides(),
  Defiance: dlcDefiance.createRawBossOverrides(),
  'Mars Attacks': dlcMarsAttacks.createRawBossOverrides(),
  Dandadan: dlcDandadan.createRawBossOverrides(),
  'Baby Cart': dlcBabyCart.createRawBossOverrides(),
  Cloverfield: dlcCloverfield.createRawBossOverrides(),
  H2G2: dlcH2G2.createRawBossOverrides(),
  'Iron Sky': dlcIronSky.createRawBossOverrides(),
  REC: dlcREC.createRawBossOverrides(),
  Sinister: dlcSinister.createRawBossOverrides(),
  'Les Visiteurs': dlcLesVisiteurs.createRawBossOverrides(),
  Kazaam: dlcKazaam.createRawBossOverrides(),
  'Voyage de Chihiro': dlcVoyageDeChihiro.createRawBossOverrides(),
  'Meet the Feebles': dlcMeetTheFeebles.createRawBossOverrides(),
  'Roger Rabbit': dlcRogerRabbit.createRawBossOverrides(),
  'Starship Troopers': dlcStarshipTroopers.createRawBossOverrides(),
  'Banlieue 13': dlcBanlieue13.createRawBossOverrides(),
  'House of 1000 Corpses': dlcHouseOf1000Corpses.createRawBossOverrides(),
  'Overlord Anime': dlcOverlordAnime.createRawBossOverrides(),
  'SCP Foundation': dlcSCPFoundation.createRawBossOverrides(),
  'Family Guy': dlcFamilyGuy.createRawBossOverrides(),
  'American Dad': dlcAmericanDad.createRawBossOverrides(),
  'Lost Planet 2': dlcLostPlanet2.createRawBossOverrides(),
  'Jet Set Radio': dlcJetSetRadio.createRawBossOverrides(),
  'Altered Beast': dlcAlteredBeast.createRawBossOverrides(),
  'Streets of Rage': dlcStreetsOfRage.createRawBossOverrides(),
  'Earthworm Jim': dlcEarthwormJim.createRawBossOverrides(),
  'Ecco the Dolphin': dlcEccoTheDolphin.createRawBossOverrides(),
  Flashback: dlcFlashback.createRawBossOverrides(),
  Ristar: dlcRistar.createRawBossOverrides(),
  Splatterhouse: dlcSplatterhouse.createRawBossOverrides(),
  'Squid Game': dlcSquidGame.createRawBossOverrides(),
  'La Casa de Papel': dlcLaCasaDePapel.createRawBossOverrides(),
  'Secret of Monkey Island': dlcSecretOfMonkeyIsland.createRawBossOverrides(),
  'Zombies Ate My Neighbors': dlcZombiesAteMyNeighbors.createRawBossOverrides(),
  'Wrong Turn': dlcWrongTurn.createRawBossOverrides(),
  Cthulhu: dlcCthulhu.createRawBossOverrides(),
  Necronomicon: dlcNecronomicon.createRawBossOverrides(),
  'Re-Animator': dlcReAnimator.createRawBossOverrides(),
  'Digimon Celestial Rift': dlcDigimonCelestialRift.createRawBossOverrides(),
  Halo: dlcHalo.createRawBossOverrides(),
  'Silent Hill': dlcSilentHill.createRawBossOverrides(),
  'The Matrix': dlcTheMatrix.createRawBossOverrides(),
  Stargate: dlcStargate.createRawBossOverrides(),
  'Half-Life': dlcHalfLife.createRawBossOverrides(),
  Portal: dlcPortal.createRawBossOverrides(),
  'Metal Gear': dlcMetalGear.createRawBossOverrides(),
  Fallout: dlcFallout.createRawBossOverrides(),
  'Scary Movie': dlcScaryMovie.createRawBossOverrides(),
  'Rick and Morty': [
    {
      name: 'Evil Morty',
      weapon: 'portal_gun_and_citadel_control',
      special: 'Central Finite Curve Escape',
      phases: ['Uses Citadel defenses, portal feints and controlled fire', 'Reveals the eyepatch transmitter and executes the escape sequence'],
      lore: {
        fr: 'Les doublons Evil Morty sont remplaces par une seule entree coherente.',
        en: 'Duplicate Evil Morty entries are replaced by one coherent entry.'
      },
      referenceUrl: 'https://www.adultswim.com/videos/rick-and-morty',
      visualAnchor: 'Exact Rick and Morty Evil Morty design, yellow shirt, blue trousers, black eyepatch with transmitter and portal gun.'
    },
    {
      name: 'Phoenixperson',
      weapon: 'arm_cannons_and_cybernetic_wings',
      special: 'Phoenix Assault',
      phases: ['Uses aerial charges, arm cannons and wing strikes', 'Damaged programming causes an unstable final attack cycle'],
      lore: {
        fr: 'Phoenixperson est Birdperson reconstruit et reprogramme.',
        en: 'Phoenixperson is the rebuilt and reprogrammed Birdperson.'
      },
      referenceUrl: 'https://rickandmorty.fandom.com/wiki/Phoenixperson',
      visualAnchor: 'Exact black-red cybernetic Birdperson body, metal wings, red optics and arm cannons from the season 4 finale.'
    }
  ],
  'Digital Circus': dlcDigitalCircus.createRawBossOverrides(),
  Discworld: dlcDiscworld.createRawBossOverrides(),
  'The Batman Who Laughs': dlcTheBatmanWhoLaughs.createRawBossOverrides(),
  Aliens: dlcAliens.createRawBossOverrides(),
  'Alien 3': dlcAlien3.createRawBossOverrides(),
  'Alien Resurrection': dlcAlienResurrection.createRawBossOverrides(),
  'Alien: Covenant': dlcAlienCovenant.createRawBossOverrides(),
  'Alien: Romulus': dlcAlienRomulus.createRawBossOverrides(),
  'Predator 2': dlcPredator2.createRawBossOverrides(),
  Prey: dlcPrey.createRawBossOverrides(),
  'Alien vs Predator': dlcAlienVsPredator.createRawBossOverrides(),
  'Aliens vs Predator: Requiem': dlcAliensVsPredatorRequiem.createRawBossOverrides(),
  Noob: dlcNoob.createRawBossOverrides(),
  'Hazbin Hotel': dlcHazbinHotel.createRawBossOverrides(),
  Splice: dlcSplice.createRawBossOverrides(),
  'Stargate Universe': dlcStargateUniverse.createRawBossOverrides(),
  'Buffy the Vampire Slayer': dlcBuffyTheVampireSlayer.createRawBossOverrides(),
  'Cells at Work!': dlcCellsAtWork.createRawBossOverrides(),
  Inuyashiki: dlcInuyashiki.createRawBossOverrides(),
  Borderlands: dlcBorderlands.createRawBossOverrides(),
  From: dlcFrom.createRawBossOverrides(),
  'Toxic Avenger': dlcToxicAvenger.createRawBossOverrides(),
  'Hell House LLC': dlcHellHouseLLC.createRawBossOverrides(),
  'Spy x Family': dlcSpyXFamily.createRawBossOverrides(),
  Terrifier: dlcTerrifier.createRawBossOverrides(),
  'Richard au pays des livres magiques': dlcRichardAuPaysDesLivresMagiques.createRawBossOverrides(),
  'Tenacious D': dlcTenaciousD.createRawBossOverrides(),
  M3GAN: dlcM3GAN.createRawBossOverrides(),
  'War of the Worlds': dlcWarOfTheWorlds.createRawBossOverrides(),
  'Repo! The Genetic Opera': dlcRepoTheGeneticOpera.createRawBossOverrides(),
  Tremors: dlcTremors.createRawBossOverrides(),
  Alien: dlcAlien.createRawBossOverrides(),
  'House of the Dead': dlcHouseOfTheDead.createRawBossOverrides(),
  'House of the Dead 2': dlcHouseOfTheDead2.createRawBossOverrides(),
  'House of the Dead 3': dlcHouseOfTheDead3.createRawBossOverrides(),
  'Teen Titans': dlcTeenTitans.createRawBossOverrides()
};

const fallbackName = (universe, slot) => `${universe} ${slot === 'EG' ? 'Elite Guardian' : 'Crisis Avatar'}`;

const definePolicy = ({ removeSlots = [], convertTo = {}, fr, en }) => ({
  removeSlots,
  convertTo,
  reason: { fr, en }
});

const RAW_SLOT_POLICIES = {
  'Heavy Metal 2000': dlcHeavyMetal2000.createRawSlotPolicies({ definePolicy, fallbackName }),
  Another: dlcAnother.createRawSlotPolicies({ definePolicy, fallbackName }),
  Pingu: dlcPingu.createRawSlotPolicies({ definePolicy, fallbackName }),
  Moonwalker: dlcMoonwalker.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Les Inconnus': dlcLesInconnus.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Les Tuche': dlcLesTuche.createRawSlotPolicies({ definePolicy, fallbackName }),
  Kazaam: dlcKazaam.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Spoof Movie': dlcSpoofMovie.createRawSlotPolicies({ definePolicy, fallbackName }),
  'The Simpsons': dlcTheSimpsons.createRawSlotPolicies({ definePolicy, fallbackName }),
  Futurama: dlcFuturama.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Team Fortress 2': dlcTeamFortress2.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Cool Spot': dlcCoolSpot.createRawSlotPolicies({ definePolicy, fallbackName }),
  Indila: dlcIndila.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Man with a Mission': dlcManWithAMission.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Guns N Roses': dlcGunsNRoses.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Band-Maid': dlcBandMaid.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Atarashii Gakko': dlcAtarashiiGakko.createRawSlotPolicies({ definePolicy, fallbackName }),
  Ladybaby: dlcLadybaby.createRawSlotPolicies({ definePolicy, fallbackName }),
  'Bigflo & Oli': dlcBigfloOli.createRawSlotPolicies({ definePolicy, fallbackName }),
  Hoshi: dlcHoshi.createRawSlotPolicies({ definePolicy, fallbackName }),
  ASMRZ: dlcASMRZ.createRawSlotPolicies({ definePolicy, fallbackName }),
  Alien: dlcAlien.createRawSlotPolicies({ definePolicy }),
  Predator: dlcPredator.createRawSlotPolicies({ definePolicy }),
  'The Matrix': dlcTheMatrix.createRawSlotPolicies({ definePolicy }),
  Portal: dlcPortal.createRawSlotPolicies({ definePolicy }),
  'Le Cinquieme Element': dlcLeCinquiemeElement.createRawSlotPolicies({ definePolicy }),
  Saw: dlcSaw.createRawSlotPolicies({ definePolicy }),
  'Ghost in the Shell': dlcGhostInTheShell.createRawSlotPolicies({ definePolicy }),
  Kaamelott: dlcKaamelott.createRawSlotPolicies({ definePolicy }),
  'Alien: Romulus': dlcAlienRomulus.createRawSlotPolicies({ definePolicy }),
  'Alien vs Predator': dlcAlienVsPredator.createRawSlotPolicies({ definePolicy }),
  'Early Edition': dlcEarlyEdition.createRawSlotPolicies({ definePolicy }),
  'Death Note': dlcDeathNote.createRawSlotPolicies({ definePolicy }),
  'Exit 8': dlcExit8.createRawSlotPolicies({ definePolicy }),
  'Sausage Party': dlcSausageParty.createRawSlotPolicies({ definePolicy }),
  Spermageddon: dlcSpermageddon.createRawSlotPolicies({ definePolicy }),
  'Les Visiteurs du Futur': dlcLesVisiteursDuFutur.createRawSlotPolicies({ definePolicy }),
  'Tenacious D': dlcTenaciousD.createRawSlotPolicies({ definePolicy }),
  'Camera Cafe': dlcCameraCafe.createRawSlotPolicies({ definePolicy }),
  'Samantha Oups!': dlcSamanthaOups.createRawSlotPolicies({ definePolicy }),
  'Les Chevaliers du Fiel': dlcLesChevaliersDuFiel.createRawSlotPolicies({ definePolicy }),
  'Noelle Perna': dlcNoellePerna.createRawSlotPolicies({ definePolicy }),
  'Counter-Strike': dlcCounterStrike.createRawSlotPolicies({ definePolicy }),
  Rammstein: dlcRammstein.createRawSlotPolicies({ definePolicy }),
  'System of a Down': dlcSystemOfADown.createRawSlotPolicies({ definePolicy }),
  'Daft Punk': dlcDaftPunk.createRawSlotPolicies({ definePolicy }),
  'Oliver Tree': dlcOliverTree.createRawSlotPolicies({ definePolicy }),
  'Stargate Infinity': dlcStargateInfinity.createRawSlotPolicies({ definePolicy }),
  'Evolution: The Animated Series': dlcEvolutionTheAnimatedSeries.createRawSlotPolicies({ definePolicy }),
  Vocaloid: dlcVocaloid.createRawSlotPolicies({ definePolicy }),
  Buckethead: dlcBuckethead.createRawSlotPolicies({ definePolicy }),
  Rubber: dlcRubber.createRawSlotPolicies({ definePolicy }),
  'Steins;Gate': dlcSteinsGate.createRawSlotPolicies({ definePolicy }),
  'Zero Escape: The Nonary Games': dlcZeroEscapeTheNonaryGames.createRawSlotPolicies({ definePolicy })
};

const universeKeys = Object.freeze(
  [...new Set([...Object.keys(RAW_BOSS_OVERRIDES), ...Object.keys(RAW_SLOT_POLICIES)])].sort()
);

const assertBossEntry = (universe, entry, index) => {
  const label = `${universe}[${index}]`;
  const stringFields = ['name', 'weapon', 'special', 'referenceUrl', 'visualAnchor', 'spritePrompt', 'output'];

  for (const field of stringFields) {
    if (typeof entry[field] !== 'string' || !entry[field].trim()) {
      throw new TypeError(`${label}.${field} must be a non-empty string`);
    }
  }

  if (!Array.isArray(entry.phases) || entry.phases.length === 0 || entry.phases.some((phase) => typeof phase !== 'string' || !phase.trim())) {
    throw new TypeError(`${label}.phases must contain non-empty strings`);
  }

  if (!entry.lore || typeof entry.lore.fr !== 'string' || typeof entry.lore.en !== 'string') {
    throw new TypeError(`${label}.lore must provide fr and en strings`);
  }

  if (!/^https?:\/\//.test(entry.referenceUrl)) {
    throw new TypeError(`${label}.referenceUrl must be an absolute HTTP URL`);
  }

  const expectedOutput = `/sprites/generated/bosses/${slugify(universe)}/${slugify(entry.name)}.png`;
  if (entry.output !== expectedOutput) {
    throw new Error(`${label}.output must be deterministic`);
  }
};

export const LORE_BOSS_OVERRIDES = Object.freeze(Object.fromEntries(
  universeKeys.map((universe) => {
    const rawEntries = RAW_BOSS_OVERRIDES[universe] || [];
    if (rawEntries.length > 2) {
      throw new RangeError(`${universe} has ${rawEntries.length} local boss overrides; maximum is 2`);
    }

    const names = new Set();
    const entries = rawEntries.map((entry, index) => {
      const normalized = defineBoss(universe, entry);
      if (names.has(normalized.name)) {
        throw new Error(`${universe} contains duplicate local boss override ${normalized.name}`);
      }
      names.add(normalized.name);
      assertBossEntry(universe, normalized, index);
      return normalized;
    });

    return [universe, Object.freeze(entries)];
  })
));

export const LORE_BOSS_SLOT_POLICY = Object.freeze(Object.fromEntries(
  Object.entries(RAW_SLOT_POLICIES).map(([universe, policy]) => [
    universe,
    Object.freeze({
      removeSlots: Object.freeze([...new Set(policy.removeSlots || [])]),
      convertTo: Object.freeze({ ...(policy.convertTo || {}) }),
      reason: Object.freeze({ ...policy.reason })
    })
  ])
));
