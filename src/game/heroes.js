// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/heroes.js';
import * as dlcHalo from '../../DLC/Halo/data/heroes.js';
import * as dlcAlien from '../../DLC/Alien/data/heroes.js';
import * as dlcPredator from '../../DLC/Predator/data/heroes.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/heroes.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/heroes.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/heroes.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/heroes.js';
import * as dlcStargate from '../../DLC/Stargate/data/heroes.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/heroes.js';
import * as dlcPortal from '../../DLC/Portal/data/heroes.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/heroes.js';
import * as dlcPayday from '../../DLC/Payday/data/heroes.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/heroes.js';
import * as dlcYuGiOh from '../../DLC/YuGiOh/data/heroes.js';
import * as dlcGuiltyGear from '../../DLC/GuiltyGear/data/heroes.js';
import * as dlcBlazBlue from '../../DLC/BlazBlue/data/heroes.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/heroes.js';
import * as dlcChucky from '../../DLC/Chucky/data/heroes.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/heroes.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/heroes.js';
import * as dlcFallout from '../../DLC/Fallout/data/heroes.js';
import * as dlcDoom from '../../DLC/Doom/data/heroes.js';
import * as dlcUnreal from '../../DLC/Unreal/data/heroes.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/heroes.js';
import * as dlcStarWars from '../../DLC/StarWars/data/heroes.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/heroes.js';
import * as dlcScaryMovie from '../../DLC/ScaryMovie/data/heroes.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/heroes.js';
import * as dlcRickMorty from '../../DLC/RickMorty/data/heroes.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/heroes.js';
import * as dlcDigimon from '../../DLC/Digimon/data/heroes.js';
import * as dlcSaw from '../../DLC/Saw/data/heroes.js';
import * as dlcRosarioVampire from '../../DLC/RosarioVampire/data/heroes.js';
import * as dlcNegima from '../../DLC/Negima/data/heroes.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/heroes.js';
import * as dlcMadMax from '../../DLC/MadMax/data/heroes.js';
import * as dlcDiscworld from '../../DLC/Discworld/data/heroes.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/heroes.js';
import * as dlcAliens from '../../DLC/Aliens/data/heroes.js';
import * as dlcDungeonMeshi from '../../DLC/DungeonMeshi/data/heroes.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/heroes.js';
import * as dlcBreakingBad from '../../DLC/BreakingBad/data/heroes.js';
import * as dlcGhostbusters from '../../DLC/Ghostbusters/data/heroes.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/heroes.js';
import * as dlcFinalFantasyVIII from '../../DLC/FinalFantasyVIII/data/heroes.js';
import * as dlcFinalFantasyXIII from '../../DLC/FinalFantasyXIII/data/heroes.js';
import * as dlcFinalFantasyXV from '../../DLC/FinalFantasyXV/data/heroes.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/heroes.js';
import * as dlcFuturama from '../../DLC/Futurama/data/heroes.js';
import * as dlcAttackOnTitan from '../../DLC/AttackOnTitan/data/heroes.js';
import * as dlcDeathNote from '../../DLC/DeathNote/data/heroes.js';
import * as dlcSpyXFamily from '../../DLC/SpyXFamily/data/heroes.js';
import * as dlcCharmed from '../../DLC/Charmed/data/heroes.js';
import * as dlcBuffyTheVampireSlayer from '../../DLC/BuffyTheVampireSlayer/data/heroes.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/heroes.js';
import * as dlcLeft4Dead from '../../DLC/Left4Dead/data/heroes.js';
import * as dlcYakuza from '../../DLC/Yakuza/data/heroes.js';
import * as dlcBioShock from '../../DLC/BioShock/data/heroes.js';
import * as dlcBorderlands from '../../DLC/Borderlands/data/heroes.js';
import * as dlcEvilDead from '../../DLC/EvilDead/data/heroes.js';
import * as dlcTheLastOfUs from '../../DLC/TheLastOfUs/data/heroes.js';
import * as dlcMetalGearRising from '../../DLC/MetalGearRising/data/heroes.js';
import * as dlcStargateAtlantis from '../../DLC/StargateAtlantis/data/heroes.js';
import * as dlcStargateUniverse from '../../DLC/StargateUniverse/data/heroes.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/heroes.js';
import * as dlcHouseOfTheDead from '../../DLC/HouseOfTheDead/data/heroes.js';
import * as dlcHouseOfTheDead2 from '../../DLC/HouseOfTheDead2/data/heroes.js';
import * as dlcHouseOfTheDead3 from '../../DLC/HouseOfTheDead3/data/heroes.js';

// Heroes Database with Crossover Gear, Event Items, and Synergies (37 Universes)

import { EXPANDED_EVENT_ITEMS, EXPANDED_EXTRA_HERO_DATA, EXPANDED_GEAR } from './expandedUniverses.js';
import { LORE_ACCURATE_HERO_EXPANSIONS, LORE_ACCURATE_HERO_OVERRIDES } from './loreAccuratePacks.js';
import { CANON_ROSTER_WAVE } from './canonRosterWave.js';
import { applyCanonP0SourceKit } from './canonP0SourceKits.js';
import { applyCanonBlackPearlSourceKit } from './canonBlackPearlSourceKits.js';
import { applyCanonFollowupSourceKit } from './canonFollowupSourceKits.js';
import {
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS,
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES
} from './solarOppositesSirenStarWarsPack.js';

export const HEROES_DB = [
  {
    id: 'arca_mirelle',
    name: 'Mirelle Suture',
    universe: 'Nexus de Convergence',
    category: 'hacker',
    primaryColor: '#39c5bb',
    secondaryColor: '#ffeb3b',
    weaponType: 'cards',
    weaponColor: '#d8f7ff',
    stats: { hp: 118, atk: 11, def: 7, spd: 8 },
    simple: { name: 'Fil de Resonance', type: 'bullet', dmg: 0.85 },
    secondary: { name: 'Patch de Trame', type: 'heal', cd: 6, dmg: 1.2 },
    defense: { name: 'Boucle de Sauvegarde', type: 'shield', dur: 2.0, reduce: 0.72 },
    special: { name: 'Suture du Voile', type: 'nexus_aoe', dmg: 3.4, color: '#39c5bb' }
  },
  {
    id: 'arca_bastion',
    name: 'Bastion Korr',
    universe: 'Nexus de Convergence',
    category: 'tactical',
    primaryColor: '#2f3f46',
    secondaryColor: '#ff8c00',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 150, atk: 13, def: 11, spd: 4 },
    simple: { name: 'Rafale Atrium', type: 'bullet', dmg: 0.95 },
    secondary: { name: 'Balise Barricade', type: 'summon', cd: 7, dmg: 1.4 },
    defense: { name: 'Rempart d Ancre', type: 'shield', dur: 2.6, reduce: 0.82 },
    special: { name: 'Verrou de Convergence', type: 'beam_aoe', dmg: 3.8, color: '#ff8c00' }
  },
  {
    id: 'arca_nova',
    name: 'Nova Vey',
    universe: 'Nexus de Convergence',
    category: 'hacker',
    primaryColor: '#153b55',
    secondaryColor: '#7df9ff',
    weaponType: 'staff',
    weaponColor: '#7df9ff',
    stats: { hp: 110, atk: 12, def: 6, spd: 9 },
    simple: { name: 'Ping de Trame', type: 'bullet', dmg: 0.9 },
    secondary: { name: 'Surcadence A.R.C.A.', type: 'buff', cd: 7, dmg: 1.0 },
    defense: { name: 'Reflexe d Ancre', type: 'dash', dur: 1.4, reduce: 0.65 },
    special: { name: 'Reboot de Faille', type: 'nexus_aoe', dmg: 3.6, color: '#7df9ff' }
  },
  {
    id: 'arca_marrow',
    name: 'Marrow Kade',
    universe: 'Nexus de Convergence',
    category: 'slayer',
    primaryColor: '#2b1c32',
    secondaryColor: '#ff5b6e',
    weaponType: 'blade',
    weaponColor: '#ff5b6e',
    stats: { hp: 132, atk: 15, def: 7, spd: 6 },
    simple: { name: 'Coupe-Sceau', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Entaille de Breche', type: 'melee', cd: 6, dmg: 2.0 },
    defense: { name: 'Pas Entre Deux', type: 'dash', dur: 1.6, reduce: 0.7 },
    special: { name: 'Execution de Paradoxe', type: 'beam', dmg: 4.3, color: '#ff5b6e' }
  },
  {
    id: 'arca_sable',
    name: 'Sable Orison',
    universe: 'Nexus de Convergence',
    category: 'tactical',
    primaryColor: '#3d3430',
    secondaryColor: '#d9b86b',
    weaponType: 'gun',
    weaponColor: '#d9b86b',
    stats: { hp: 124, atk: 13, def: 9, spd: 5 },
    simple: { name: 'Tir de Balise', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Mine de Lecture', type: 'projectile', cd: 7, dmg: 1.8 },
    defense: { name: 'Couverture Archivee', type: 'shield', dur: 2.2, reduce: 0.76 },
    special: { name: 'Barrage du Cartographe', type: 'rocket', dmg: 4.0, color: '#d9b86b' }
  },
  {
    id: 'arca_loom',
    name: 'Loom Ivara',
    universe: 'Nexus de Convergence',
    category: 'marine',
    primaryColor: '#24364a',
    secondaryColor: '#39c5bb',
    weaponType: 'gun',
    weaponColor: '#d8f7ff',
    stats: { hp: 142, atk: 12, def: 10, spd: 5 },
    simple: { name: 'Rafale d Origine', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Drone de Suture', type: 'summon', cd: 8, dmg: 1.5 },
    defense: { name: 'Plaque Resonante', type: 'shield', dur: 2.4, reduce: 0.8 },
    special: { name: 'Ligne de Vie Nexus', type: 'heal', dmg: 3.2, color: '#39c5bb' }
  },
  {
    id: 'arca_tessera',
    name: 'Tessera Vale',
    universe: 'Nexus de Convergence',
    category: 'horror',
    campaignExclusive: true,
    campaignActId: 'arrivals',
    unlockMissionId: 8802,
    primaryColor: '#4b315f',
    secondaryColor: '#ff7aa8',
    weaponType: 'cards',
    weaponColor: '#ffc4df',
    stats: { hp: 126, atk: 13, def: 7, spd: 8 },
    simple: { name: 'Eclat Contradictoire', type: 'projectile', dmg: 0.95 },
    secondary: { name: 'Reflet Non Remplace', type: 'summon', cd: 6, dmg: 1.7 },
    defense: { name: 'Cicatrice de Possibilite', type: 'dodge', dur: 1.8, reduce: 0.78 },
    special: { name: 'Choeur des Vies Refusees', type: 'nexus_aoe', dmg: 3.9, color: '#ff7aa8' }
  },
  {
    id: 'arca_quillon',
    name: 'Quillon Rusk',
    universe: 'Nexus de Convergence',
    category: 'tactical',
    campaignExclusive: true,
    campaignActId: 'anchors',
    unlockMissionId: 8804,
    primaryColor: '#3a3028',
    secondaryColor: '#f0b35a',
    weaponType: 'gun',
    weaponColor: '#d7a55d',
    stats: { hp: 130, atk: 12, def: 9, spd: 6 },
    simple: { name: 'Tir de Contre-Registre', type: 'bullet', dmg: 0.95 },
    secondary: { name: 'Mandat de Restitution', type: 'projectile', cd: 7, dmg: 1.65 },
    defense: { name: 'Clause de Dette', type: 'shield', dur: 2.2, reduce: 0.76 },
    special: { name: 'Audit de la Premiere Breche', type: 'rocket', dmg: 3.9, color: '#f0b35a' }
  },
  {
    id: 'arca_nadir',
    name: 'Nadir Kest',
    universe: 'Nexus de Convergence',
    category: 'marine',
    campaignExclusive: true,
    campaignActId: 'archives',
    unlockMissionId: 8805,
    primaryColor: '#183a4a',
    secondaryColor: '#5ce1d8',
    weaponType: 'gun',
    weaponColor: '#b8fff9',
    stats: { hp: 146, atk: 12, def: 10, spd: 6 },
    simple: { name: 'Rafale de Ligne Sure', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Sonde de Retour', type: 'summon', cd: 7, dmg: 1.45 },
    defense: { name: 'Harnais Causal', type: 'shield', dur: 2.4, reduce: 0.8 },
    special: { name: 'Extraction des Marges', type: 'heal', dmg: 3.3, color: '#5ce1d8' }
  },
  {
    id: 'arca_elyra',
    name: 'Elyra Null',
    universe: 'Nexus de Convergence',
    category: 'hacker',
    campaignExclusive: true,
    campaignActId: 'white-void',
    unlockMissionId: 8806,
    primaryColor: '#eef5ff',
    secondaryColor: '#8a6cff',
    weaponType: 'cards',
    weaponColor: '#b7a8ff',
    stats: { hp: 108, atk: 13, def: 6, spd: 10 },
    simple: { name: 'Glyphe de Refus', type: 'bullet', dmg: 0.9 },
    secondary: { name: 'Memoire de Choix', type: 'buff', cd: 7, dmg: 1.1 },
    defense: { name: 'Pas Hors du Blanc', type: 'dash', dur: 1.5, reduce: 0.68 },
    special: { name: 'Droit de Dire Non', type: 'nexus_aoe', dmg: 3.7, color: '#8a6cff' }
  },
  {
    id: 'arca_oryn',
    name: 'Oryn Xile',
    universe: 'Nexus de Convergence',
    category: 'slayer',
    campaignExclusive: true,
    campaignActId: 'primordial',
    unlockMissionId: 8807,
    primaryColor: '#241f2d',
    secondaryColor: '#e04f64',
    weaponType: 'greatsword',
    weaponColor: '#ff8798',
    stats: { hp: 136, atk: 15, def: 8, spd: 7 },
    simple: { name: 'Taille-Nom de Route X', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Riposte du Temoin', type: 'melee', cd: 6, dmg: 1.9 },
    defense: { name: 'Pas de la Route Effacee', type: 'dash', dur: 1.7, reduce: 0.72 },
    special: { name: 'Manifeste des Survivants', type: 'beam', dmg: 4.2, color: '#e04f64' }
  },
  dlcGearsOfWar.createHeroesDb(),
  dlcHalo.createHeroesDb(),
  dlcAlien.createHeroesDb(),
  dlcPredator.createHeroesDb(),
  dlcResidentEvil.createHeroesDb(),
  dlcSilentHill.createHeroesDb(),
  dlcDinoCrisis.createHeroesDb(),
  dlcTheMatrix.createHeroesDb(),
  dlcStargate.createHeroesDb(),
  dlcHalfLife.createHeroesDb(),
  dlcPortal.createHeroesDb(),
  dlcMetalGear.createHeroesDb(),
  dlcPayday.createHeroesDb(),
  dlcVocaloid.createHeroesDb(),
  dlcYuGiOh.createHeroesDb(),
  dlcGuiltyGear.createHeroesDb(),
  dlcBlazBlue.createHeroesDb(),
  dlcSlenderMan.createHeroesDb(),
  dlcChucky.createHeroesDb(),
  dlcHellraiser.createHeroesDb(),
  dlcMassEffect.createHeroesDb(),
  dlcFallout.createHeroesDb(),
  dlcDoom.createHeroesDb(),
  dlcUnreal.createHeroesDb(),
  
  // --- NEW 13 UNIVERSES HEROES ---
  dlcHarryPotter.createHeroesDb(),
  dlcStarWars.createHeroesDb(),
  dlcLeCinquiemeElement.createHeroesDb(),
  dlcScaryMovie.createHeroesDb(),
  dlcDeadSpace.createHeroesDb(),
  dlcRickMorty.createHeroesDb(),
  dlcDigitalCircus.createHeroesDb(),
  dlcDigimon.createHeroesDb(),
  dlcSaw.createHeroesDb(),
  dlcRosarioVampire.createHeroesDb(),
  dlcNegima.createHeroesDb(),
  dlcGhostInTheShell.createHeroesDb(),
  dlcMadMax.createHeroesDb()
];

export const SYNERGIES_DB = [
  { id: 'marine', key: 'syn_marines', descKey: 'syn_marines_desc', category: 'marine', multiplier: { hp: 1.25 } },
  { id: 'slayer', key: 'syn_slayer', descKey: 'syn_slayer_desc', category: 'slayer', multiplier: { atk: 1.20 } },
  { id: 'horror', key: 'syn_horror', descKey: 'syn_horror_desc', category: 'horror', multiplier: { spd: 1.15 } },
  { id: 'hacker', key: 'syn_hackers', descKey: 'syn_hackers_desc', category: 'hacker', multiplier: { spd: 1.20 } }, // ATB speed boost
  { id: 'tactical', key: 'syn_tactical', descKey: 'syn_tactical_desc', category: 'tactical', multiplier: { def: 1.20 } }
];

export const EQUIP_ITEMS_DB = [
  // Nexus de Convergence - base game original content
  {
    id: 'nexus_anchor_coil',
    universe: 'Nexus de Convergence',
    name: { en: 'Anchor Coil', fr: 'Bobine d Ancre' },
    desc: {
      en: 'A.R.C.A. stabilizer issued to new Anchored Ones. It keeps a hero readable when a breach tries to rewrite their origin.',
      fr: 'Stabilisateur A.R.C.A. remis aux nouvelles Ancres. Il garde le heros lisible quand une breche tente de reecrire son origine.'
    },
    boost: { hp: 45, def: 4 },
    cost: 60
  },
  {
    id: 'arca_signal_lens',
    universe: 'Nexus de Convergence',
    name: { en: 'Signal Lens', fr: 'Lentille de Signal' },
    desc: {
      en: 'Focuses a damaged Thread into a targetable line instead of letting it scatter through the Atrium.',
      fr: 'Concentre une Trame abimee en ligne ciblable au lieu de la laisser se disperser dans l Atrium.'
    },
    boost: { atk: 7, spd: 1 },
    cost: 85
  },
  {
    id: 'origin_shard_guard',
    universe: 'Nexus de Convergence',
    name: { en: 'Origin Shard Guard', fr: 'Garde-Eclat d Origine' },
    desc: {
      en: 'A dull shard casing that absorbs failed rewrites before they reach the squad core.',
      fr: 'Gaine d eclat terne qui absorbe les reecritures ratees avant qu elles touchent le noyau d escouade.'
    },
    boost: { hp: 70, def: 5 },
    cost: 100
  },
  // Gears of War
  dlcGearsOfWar.createEquipItemsDb(),
  dlcGearsOfWar.createEquipItemsDb2(),
  dlcGearsOfWar.createEquipItemsDb3(),
  // Halo
  dlcHalo.createEquipItemsDb(),
  dlcHalo.createEquipItemsDb2(),
  dlcHalo.createEquipItemsDb3(),
  // Alien
  dlcAlien.createEquipItemsDb(),
  dlcAlien.createEquipItemsDb2(),
  dlcAlien.createEquipItemsDb3(),
  // Predator
  dlcPredator.createEquipItemsDb(),
  dlcPredator.createEquipItemsDb2(),
  dlcPredator.createEquipItemsDb3(),
  // Resident Evil
  dlcResidentEvil.createEquipItemsDb(),
  dlcResidentEvil.createEquipItemsDb2(),
  dlcResidentEvil.createEquipItemsDb3(),
  // Silent Hill
  dlcSilentHill.createEquipItemsDb(),
  dlcSilentHill.createEquipItemsDb2(),
  dlcSilentHill.createEquipItemsDb3(),
  // Dino Crisis
  dlcDinoCrisis.createEquipItemsDb(),
  dlcDinoCrisis.createEquipItemsDb2(),
  dlcDinoCrisis.createEquipItemsDb3(),
  // The Matrix
  dlcTheMatrix.createEquipItemsDb(),
  dlcTheMatrix.createEquipItemsDb2(),
  dlcTheMatrix.createEquipItemsDb3(),
  // Stargate
  dlcStargate.createEquipItemsDb(),
  dlcStargate.createEquipItemsDb2(),
  dlcStargate.createEquipItemsDb3(),
  // Half-Life
  dlcHalfLife.createEquipItemsDb(),
  dlcHalfLife.createEquipItemsDb2(),
  dlcHalfLife.createEquipItemsDb3(),
  // Portal
  dlcPortal.createEquipItemsDb(),
  dlcPortal.createEquipItemsDb2(),
  dlcPortal.createEquipItemsDb3(),
  // Metal Gear
  dlcMetalGear.createEquipItemsDb(),
  dlcMetalGear.createEquipItemsDb2(),
  dlcMetalGear.createEquipItemsDb3(),
  // Payday
  dlcPayday.createEquipItemsDb(),
  dlcPayday.createEquipItemsDb2(),
  dlcPayday.createEquipItemsDb3(),
  // Vocaloid
  dlcVocaloid.createEquipItemsDb(),
  dlcVocaloid.createEquipItemsDb2(),
  dlcVocaloid.createEquipItemsDb3(),
  // Yu-Gi-Oh
  dlcYuGiOh.createEquipItemsDb(),
  dlcYuGiOh.createEquipItemsDb2(),
  dlcYuGiOh.createEquipItemsDb3(),
  // Guilty Gear
  dlcGuiltyGear.createEquipItemsDb(),
  dlcGuiltyGear.createEquipItemsDb2(),
  dlcGuiltyGear.createEquipItemsDb3(),
  // BlazBlue
  dlcBlazBlue.createEquipItemsDb(),
  dlcBlazBlue.createEquipItemsDb2(),
  dlcBlazBlue.createEquipItemsDb3(),
  // Slender Man
  dlcSlenderMan.createEquipItemsDb(),
  dlcSlenderMan.createEquipItemsDb2(),
  dlcSlenderMan.createEquipItemsDb3(),
  // Chucky
  dlcChucky.createEquipItemsDb(),
  dlcChucky.createEquipItemsDb2(),
  dlcChucky.createEquipItemsDb3(),
  // Hellraiser
  dlcHellraiser.createEquipItemsDb(),
  dlcHellraiser.createEquipItemsDb2(),
  dlcHellraiser.createEquipItemsDb3(),
  // Mass Effect
  dlcMassEffect.createEquipItemsDb(),
  dlcMassEffect.createEquipItemsDb2(),
  dlcMassEffect.createEquipItemsDb3(),
  // Fallout
  dlcFallout.createEquipItemsDb(),
  dlcFallout.createEquipItemsDb2(),
  dlcFallout.createEquipItemsDb3(),
  // Doom
  dlcDoom.createEquipItemsDb(),
  dlcDoom.createEquipItemsDb2(),
  dlcDoom.createEquipItemsDb3(),
  // Unreal
  dlcUnreal.createEquipItemsDb(),
  dlcUnreal.createEquipItemsDb2(),
  dlcUnreal.createEquipItemsDb3(),

  // --- NEW 13 UNIVERSES RELICS ---
  // Harry Potter
  dlcHarryPotter.createEquipItemsDb(),
  dlcHarryPotter.createEquipItemsDb2(),
  dlcHarryPotter.createEquipItemsDb3(),
  // Star Wars
  dlcStarWars.createEquipItemsDb(),
  dlcStarWars.createEquipItemsDb2(),
  dlcStarWars.createEquipItemsDb3(),
  // Le Cinquième Element
  dlcLeCinquiemeElement.createEquipItemsDb(),
  dlcLeCinquiemeElement.createEquipItemsDb2(),
  dlcLeCinquiemeElement.createEquipItemsDb3(),
  // Scary Movie
  dlcScaryMovie.createEquipItemsDb(),
  dlcScaryMovie.createEquipItemsDb2(),
  dlcScaryMovie.createEquipItemsDb3(),
  // Dead Space
  dlcDeadSpace.createEquipItemsDb(),
  dlcDeadSpace.createEquipItemsDb2(),
  dlcDeadSpace.createEquipItemsDb3(),
  // Rick & Morty
  dlcRickMorty.createEquipItemsDb(),
  dlcRickMorty.createEquipItemsDb2(),
  dlcRickMorty.createEquipItemsDb3(),
  // Digital Circus
  dlcDigitalCircus.createEquipItemsDb(),
  dlcDigitalCircus.createEquipItemsDb2(),
  dlcDigitalCircus.createEquipItemsDb3(),
  // Digimon
  dlcDigimon.createEquipItemsDb(),
  dlcDigimon.createEquipItemsDb2(),
  dlcDigimon.createEquipItemsDb3(),
  // Saw
  dlcSaw.createEquipItemsDb(),
  dlcSaw.createEquipItemsDb2(),
  dlcSaw.createEquipItemsDb3(),
  // Rosario + Vampire
  dlcRosarioVampire.createEquipItemsDb(),
  dlcRosarioVampire.createEquipItemsDb2(),
  dlcRosarioVampire.createEquipItemsDb3(),
  // Negima
  dlcNegima.createEquipItemsDb(),
  dlcNegima.createEquipItemsDb2(),
  dlcNegima.createEquipItemsDb3(),
  // Ghost in the Shell
  dlcGhostInTheShell.createEquipItemsDb(),
  dlcGhostInTheShell.createEquipItemsDb2(),
  dlcGhostInTheShell.createEquipItemsDb3(),
  // Mad Max
  dlcMadMax.createEquipItemsDb(),
  dlcMadMax.createEquipItemsDb2(),
  dlcMadMax.createEquipItemsDb3()
];

EXPANDED_GEAR.forEach(item => {
  const existing = EQUIP_ITEMS_DB.find(entry => entry.id === item.id);
  if (existing) Object.assign(existing, item);
  else EQUIP_ITEMS_DB.push(item);
});

export const EVENT_ITEMS_DB = {
  'Gears of War': dlcGearsOfWar.createEventItemsDb(),
  'Halo': dlcHalo.createEventItemsDb(),
  'Alien': dlcAlien.createEventItemsDb(),
  'Predator': dlcPredator.createEventItemsDb(),
  'Resident Evil': dlcResidentEvil.createEventItemsDb(),
  'Silent Hill': dlcSilentHill.createEventItemsDb(),
  'Dino Crisis': dlcDinoCrisis.createEventItemsDb(),
  'The Matrix': dlcTheMatrix.createEventItemsDb(),
  'Stargate': dlcStargate.createEventItemsDb(),
  'Half-Life': dlcHalfLife.createEventItemsDb(),
  'Portal': dlcPortal.createEventItemsDb(),
  'Metal Gear': dlcMetalGear.createEventItemsDb(),
  'Payday': dlcPayday.createEventItemsDb(),
  'Vocaloid': dlcVocaloid.createEventItemsDb(),
  'Yu-Gi-Oh': dlcYuGiOh.createEventItemsDb(),
  'Guilty Gear': dlcGuiltyGear.createEventItemsDb(),
  'BlazBlue': dlcBlazBlue.createEventItemsDb(),
  'Slender Man': dlcSlenderMan.createEventItemsDb(),
  'Chucky': dlcChucky.createEventItemsDb(),
  'Hellraiser': dlcHellraiser.createEventItemsDb(),
  'Mass Effect': dlcMassEffect.createEventItemsDb(),
  'Fallout': dlcFallout.createEventItemsDb(),
  'Doom': dlcDoom.createEventItemsDb(),
  'Unreal': dlcUnreal.createEventItemsDb(),

  // --- NEW 13 UNIVERSES EVENT ITEMS ---
  'Harry Potter': dlcHarryPotter.createEventItemsDb(),
  'Star Wars': dlcStarWars.createEventItemsDb(),
  'Le Cinquième Element': dlcLeCinquiemeElement.createEventItemsDb(),
  'Scary Movie': dlcScaryMovie.createEventItemsDb(),
  'Dead Space': dlcDeadSpace.createEventItemsDb(),
  'Rick & Morty': dlcRickMorty.createEventItemsDb(),
  'Digital Circus': dlcDigitalCircus.createEventItemsDb(),
  'Digimon': dlcDigimon.createEventItemsDb(),
  'Saw': dlcSaw.createEventItemsDb(),
  'Rosario + Vampire': dlcRosarioVampire.createEventItemsDb(),
  'Negima': dlcNegima.createEventItemsDb(),
  'Ghost in the Shell': dlcGhostInTheShell.createEventItemsDb(),
  'Mad Max': dlcMadMax.createEventItemsDb()
};

Object.assign(EVENT_ITEMS_DB, EXPANDED_EVENT_ITEMS);

if (EVENT_ITEMS_DB.ASMRZ) EVENT_ITEMS_DB.ASMRZ.effect = 'concert_buff';
if (EVENT_ITEMS_DB['Spoof Movie']) EVENT_ITEMS_DB['Spoof Movie'].effect = 'parody_rule_shift';

EVENT_ITEMS_DB['Nexus de Convergence'] = {
  id: 'evt_nexus_anchor_pulse',
  name: {
    en: 'A.R.C.A. Anchor Pulse',
    fr: 'Impulsion d Ancrage A.R.C.A.'
  },
  desc: {
    en: 'The Atrium emits a stabilizing pulse: hostile rewrites are interrupted and the squad gains a brief invulnerability window.',
    fr: 'L Atrium emet une impulsion stabilisatrice : les reecritures hostiles sont interrompues et l escouade gagne une breve fenetre d invulnerabilite.'
  },
  effect: 'iris_invuln',
  provenance: 'project-original',
  contentOrigin: 'project-original',
  originalContent: true,
  icon: '/sprites/generated/items/nexus-de-convergence/evt-nexus-anchor-pulse.png',
  iconPrompt: 'Entirely original Multiverse Breach A.R.C.A. event relic. A cyan-white prismatic anchor-pulse beacon made from concentric registry rings around a small yellow signal core. Single centered high-detail pixel-art event icon, compact readable silhouette, transparent background, no text, no logo, no border.',
  summonIcon: '/sprites/generated/items/nexus-de-convergence/nexus-de-convergence-summon.png',
  summonIconPrompt: 'Entirely original Multiverse Breach A.R.C.A. allied assist. A compact hovering anchor drone and mnemonic wisp made from white archive ceramic, teal energy vanes and a small yellow signal core. Single centered high-detail pixel-art summon icon, transparent background, no text, no logo, no border.',
  referenceUrl: 'https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js',
  visualAnchor: 'A.R.C.A. Atrium anchor technology: white archive ceramic, cyan registry light, black joints and a restrained yellow signal core.',
  audit: 'ORIGINAL-OC'
};

const extraHeroData = {
  'Gears of War': dlcGearsOfWar.createExtraHeroData(),
  'Halo': dlcHalo.createExtraHeroData(),
  'Alien': dlcAlien.createExtraHeroData(),
  'Predator': dlcPredator.createExtraHeroData(),
  'Resident Evil': dlcResidentEvil.createExtraHeroData(),
  'Silent Hill': dlcSilentHill.createExtraHeroData(),
  'Dino Crisis': dlcDinoCrisis.createExtraHeroData(),
  'The Matrix': dlcTheMatrix.createExtraHeroData(),
  'Stargate': dlcStargate.createExtraHeroData(),
  'Half-Life': dlcHalfLife.createExtraHeroData(),
  'Portal': dlcPortal.createExtraHeroData(),
  'Metal Gear': dlcMetalGear.createExtraHeroData(),
  'Payday': dlcPayday.createExtraHeroData(),
  'Vocaloid': dlcVocaloid.createExtraHeroData(),
  'Yu-Gi-Oh': dlcYuGiOh.createExtraHeroData(),
  'Guilty Gear': dlcGuiltyGear.createExtraHeroData(),
  'BlazBlue': dlcBlazBlue.createExtraHeroData(),
  'Slender Man': dlcSlenderMan.createExtraHeroData(),
  'Chucky': dlcChucky.createExtraHeroData(),
  'Hellraiser': dlcHellraiser.createExtraHeroData(),
  'Mass Effect': dlcMassEffect.createExtraHeroData(),
  'Fallout': dlcFallout.createExtraHeroData(),
  'Doom': dlcDoom.createExtraHeroData(),
  'Unreal': dlcUnreal.createExtraHeroData(),
  'Harry Potter': dlcHarryPotter.createExtraHeroData(),
  'Star Wars': dlcStarWars.createExtraHeroData(),
  'Le Cinquième Element': dlcLeCinquiemeElement.createExtraHeroData(),
  'Scary Movie': dlcScaryMovie.createExtraHeroData(),
  'Dead Space': dlcDeadSpace.createExtraHeroData(),
  'Rick & Morty': dlcRickMorty.createExtraHeroData(),
  'Digital Circus': dlcDigitalCircus.createExtraHeroData(),
  'Digimon': dlcDigimon.createExtraHeroData(),
  'Saw': dlcSaw.createExtraHeroData(),
  'Rosario + Vampire': dlcRosarioVampire.createExtraHeroData(),
  'Negima': dlcNegima.createExtraHeroData(),
  'Ghost in the Shell': dlcGhostInTheShell.createExtraHeroData(),
  'Mad Max': dlcMadMax.createExtraHeroData()
};


const CANON_ROSTER_EXPANSION = {
  'Gears of War': dlcGearsOfWar.createCanonRosterExpansion(),
  Halo: dlcHalo.createCanonRosterExpansion(),
  Alien: dlcAlien.createCanonRosterExpansion(),
  Predator: dlcPredator.createCanonRosterExpansion(),
  'Resident Evil': dlcResidentEvil.createCanonRosterExpansion(),
  'Silent Hill': dlcSilentHill.createCanonRosterExpansion(),
  'Dino Crisis': dlcDinoCrisis.createCanonRosterExpansion(),
  'The Matrix': dlcTheMatrix.createCanonRosterExpansion(),
  Stargate: dlcStargate.createCanonRosterExpansion(),
  'Half-Life': dlcHalfLife.createCanonRosterExpansion(),
  Portal: dlcPortal.createCanonRosterExpansion(),
  'Metal Gear': dlcMetalGear.createCanonRosterExpansion(),
  Payday: dlcPayday.createCanonRosterExpansion(),
  Vocaloid: dlcVocaloid.createCanonRosterExpansion(),
  'Yu-Gi-Oh': dlcYuGiOh.createCanonRosterExpansion(),
  'Guilty Gear': dlcGuiltyGear.createCanonRosterExpansion(),
  BlazBlue: dlcBlazBlue.createCanonRosterExpansion(),
  'Slender Man': dlcSlenderMan.createCanonRosterExpansion(),
  Chucky: dlcChucky.createCanonRosterExpansion(),
  Hellraiser: dlcHellraiser.createCanonRosterExpansion(),
  'Mass Effect': dlcMassEffect.createCanonRosterExpansion(),
  Fallout: dlcFallout.createCanonRosterExpansion(),
  Doom: dlcDoom.createCanonRosterExpansion(),
  Unreal: dlcUnreal.createCanonRosterExpansion(),
  'Harry Potter': dlcHarryPotter.createCanonRosterExpansion(),
  'Star Wars': dlcStarWars.createCanonRosterExpansion(),
  'Le Cinquième Element': dlcLeCinquiemeElement.createCanonRosterExpansion(),
  'Scary Movie': dlcScaryMovie.createCanonRosterExpansion(),
  'Dead Space': dlcDeadSpace.createCanonRosterExpansion(),
  'Rick & Morty': dlcRickMorty.createCanonRosterExpansion(),
  'Digital Circus': dlcDigitalCircus.createCanonRosterExpansion(),
  Digimon: dlcDigimon.createCanonRosterExpansion(),
  Saw: dlcSaw.createCanonRosterExpansion(),
  'Rosario + Vampire': dlcRosarioVampire.createCanonRosterExpansion(),
  Negima: dlcNegima.createCanonRosterExpansion(),
  'Ghost in the Shell': dlcGhostInTheShell.createCanonRosterExpansion(),
  'Mad Max': dlcMadMax.createCanonRosterExpansion(),
  Discworld: dlcDiscworld.createCanonRosterExpansion(),
  Kaamelott: dlcKaamelott.createCanonRosterExpansion(),
  Aliens: dlcAliens.createCanonRosterExpansion(),
  'Dungeon Meshi': dlcDungeonMeshi.createCanonRosterExpansion(),
  'Hazbin Hotel': dlcHazbinHotel.createCanonRosterExpansion(),
  'Breaking Bad': dlcBreakingBad.createCanonRosterExpansion(),
  Ghostbusters: dlcGhostbusters.createCanonRosterExpansion(),
  'Final Fantasy VII': dlcFinalFantasyVII.createCanonRosterExpansion(),
  'Final Fantasy VIII': dlcFinalFantasyVIII.createCanonRosterExpansion(),
  'Final Fantasy XIII': dlcFinalFantasyXIII.createCanonRosterExpansion(),
  'Final Fantasy XV': dlcFinalFantasyXV.createCanonRosterExpansion(),
  'The Simpsons': dlcTheSimpsons.createCanonRosterExpansion(),
  Futurama: dlcFuturama.createCanonRosterExpansion(),
  'Attack on Titan': dlcAttackOnTitan.createCanonRosterExpansion(),
  'Death Note': dlcDeathNote.createCanonRosterExpansion(),
  'Spy x Family': dlcSpyXFamily.createCanonRosterExpansion(),
  Charmed: dlcCharmed.createCanonRosterExpansion(),
  'Buffy the Vampire Slayer': dlcBuffyTheVampireSlayer.createCanonRosterExpansion(),
  'Team Fortress 2': dlcTeamFortress2.createCanonRosterExpansion(),
  'Left 4 Dead': dlcLeft4Dead.createCanonRosterExpansion(),
  Yakuza: dlcYakuza.createCanonRosterExpansion()
};

const mergeExtraHeroData = (target, additions = {}) => {
  Object.entries(additions).forEach(([universe, entries]) => {
    if (!Array.isArray(entries) || entries.length === 0) return;
    if (!target[universe]) target[universe] = [];
    const knownIds = new Set(target[universe].map(item => item.id));
    entries.forEach(item => {
      if (!item?.id || knownIds.has(item.id)) return;
      target[universe].push(item);
      knownIds.add(item.id);
    });
  });
};



const CANON_ROSTER_EXTRA_PATCH = {
  'Scary Movie': dlcScaryMovie.createCanonRosterExtraPatch(),
  Unreal: dlcUnreal.createCanonRosterExtraPatch(),
  Ghostbusters: dlcGhostbusters.createCanonRosterExtraPatch(),
  'Buffy the Vampire Slayer': dlcBuffyTheVampireSlayer.createCanonRosterExtraPatch(),
  'Final Fantasy VIII': dlcFinalFantasyVIII.createCanonRosterExtraPatch(),
  'Final Fantasy XIII': dlcFinalFantasyXIII.createCanonRosterExtraPatch(),
  'Final Fantasy XV': dlcFinalFantasyXV.createCanonRosterExtraPatch(),
  BioShock: dlcBioShock.createCanonRosterExtraPatch(),
  Borderlands: dlcBorderlands.createCanonRosterExtraPatch(),
  'Evil Dead': dlcEvilDead.createCanonRosterExtraPatch(),
  'The Last of Us': dlcTheLastOfUs.createCanonRosterExtraPatch(),
  'Metal Gear Rising': dlcMetalGearRising.createCanonRosterExtraPatch(),
  'Stargate Atlantis': dlcStargateAtlantis.createCanonRosterExtraPatch(),
  'Stargate Universe': dlcStargateUniverse.createCanonRosterExtraPatch()
};

mergeExtraHeroData(extraHeroData, SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS);
mergeExtraHeroData(extraHeroData, EXPANDED_EXTRA_HERO_DATA);
mergeExtraHeroData(extraHeroData, CANON_ROSTER_EXPANSION);
mergeExtraHeroData(extraHeroData, CANON_ROSTER_EXTRA_PATCH);
mergeExtraHeroData(extraHeroData, LORE_ACCURATE_HERO_EXPANSIONS);

// Canon roster packs replace their historical partial entries. This final
// projection prevents older expansion layers from silently appending a fourth
// or fifth hero after the fidelity-aware three-character roster was authored.
const canonRosterUniverseSet = new Set(CANON_ROSTER_WAVE.map(entry => entry.universe));
for (let index = HEROES_DB.length - 1; index >= 0; index--) {
  if (canonRosterUniverseSet.has(HEROES_DB[index].universe)) HEROES_DB.splice(index, 1);
}
canonRosterUniverseSet.forEach(universe => {
  extraHeroData[universe] = [...(EXPANDED_EXTRA_HERO_DATA[universe] || [])];
});

const knownHeroIds = new Set(HEROES_DB.map(hero => hero.id));

Object.keys(extraHeroData).forEach(universe => {
  extraHeroData[universe].forEach(item => {
    if (!item?.id || knownHeroIds.has(item.id)) return;
    knownHeroIds.add(item.id);

    let weapon = 'slash';
    let stats = { hp: 110, atk: 12, def: 6, spd: 5 };
    if (item.cat === 'marine') { stats = { hp: 130, atk: 10, def: 8, spd: 4 }; weapon = 'gun'; }
    if (item.cat === 'horror') { stats = { hp: 115, atk: 11, def: 7, spd: 5 }; weapon = 'slash'; }
    if (item.cat === 'slayer') { stats = { hp: 105, atk: 14, def: 5, spd: 6 }; weapon = 'slash'; }
    if (item.cat === 'hacker') { stats = { hp: 100, atk: 12, def: 6, spd: 6 }; weapon = 'laser'; }
    if (item.cat === 'tactical') { stats = { hp: 120, atk: 11, def: 7, spd: 4 }; weapon = 'gun'; }

    const resolvedWeapon = item.weaponType || item.weapon || weapon;
    const resolvedStats = item.stats || stats;
    const defaultSimpleType = resolvedWeapon === 'gun' ? 'bullet' : resolvedWeapon === 'laser' ? 'energy' : resolvedWeapon === 'wand' ? 'magic' : 'melee';

    HEROES_DB.push({
      ...item,
      id: item.id,
      name: item.name,
      universe: universe,
      category: item.cat,
      primaryColor: item.color,
      secondaryColor: item.secondaryColor || item.accent || item.color,
      weaponType: resolvedWeapon,
      weaponColor: item.weaponColor || item.color,
      stats: resolvedStats,
      simple: item.simple || { name: item.simpleName || `${item.name} Signature Strike`, type: defaultSimpleType, dmg: 1.0 },
      secondary: item.secondary || { name: item.secondaryName || `${item.name} Breach Technique`, type: resolvedWeapon === 'gun' ? 'projectile' : 'signature', cd: item.cd || 8, dmg: item.secondaryDmg || 2.2 },
      defense: item.defense || { name: item.defenseName || `${item.name} Guard`, type: 'shield', dur: item.dur || 2.0, reduce: item.reduce || 0.75 },
      special: item.special || { name: item.specialName || `${item.name} Origin Burst`, type: 'origin_aoe', dmg: item.specialDmg || 4.5, color: item.specialColor || item.color },
      ...(item.equipment ? { equipment: item.equipment } : {}),
      ...(item.incarnation ? { incarnation: item.incarnation } : {}),
      ...(item.canonStatus ? { canonStatus: item.canonStatus } : {})
    });
  });
});

const heroOverrides = {
  oneill: dlcStargate.createHeroOverrides(),
  sam_carter: dlcStargate.createHeroOverrides2(),
  tealc: dlcStargate.createHeroOverrides3(),
  daniel_jackson: dlcStargate.createHeroOverrides4(),
  freeman: dlcHalfLife.createHeroOverrides(),
  barney: dlcHalfLife.createHeroOverrides2(),
  shephard: dlcHalfLife.createHeroOverrides3(),
  alyx_vance: dlcHalfLife.createHeroOverrides4(),
  pyramidhead: dlcSilentHill.createHeroOverrides(),
  james_s: dlcSilentHill.createHeroOverrides2(),
  heather: dlcSilentHill.createHeroOverrides3(),
  regina: dlcDinoCrisis.createHeroOverrides(),
  dylan: dlcDinoCrisis.createHeroOverrides2(),
  rick_dc: dlcDinoCrisis.createHeroOverrides3(),
  neo: dlcTheMatrix.createHeroOverrides(),
  trinity: dlcTheMatrix.createHeroOverrides2(),
  morpheus: dlcTheMatrix.createHeroOverrides3(),
  buckethead_avatar: dlcBuckethead.createHeroOverrides(),
  death_cube_k_echo: dlcBuckethead.createHeroOverrides2(),
  pike_riff_signal: dlcBuckethead.createHeroOverrides3(),
  soad_vocal: {
    weaponType: 'voice',
    weaponColor: '#b03a2e',
    simple: { name: 'Frontline Protest Cry', type: 'sound', dmg: 1.0 },
    secondary: { name: 'Chop Suey Tempo Cut', type: 'fear', cd: 6, dmg: 1.65 },
    defense: { name: 'Aerials Breath Shift', type: 'shield', dur: 2.0, reduce: 0.78 },
    special: { name: 'Toxicity Broadcast Break', type: 'music_aoe', dmg: 4.7, color: '#f1c40f' }
  },
  soad_guitar: {
    weaponType: 'guitar',
    weaponColor: '#1c2833',
    simple: { name: 'Staccato Riff Strike', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Prison Song Siren Cut', type: 'sound', cd: 6, dmg: 1.8 },
    defense: { name: 'Measure Skip Dodge', type: 'dodge', dur: 1.8, reduce: 0.78 },
    special: { name: 'Syncopated Riot Wall', type: 'music_aoe', dmg: 4.55, color: '#1c2833' }
  },
  soad_bass: {
    weaponType: 'bass',
    weaponColor: '#7d6608',
    simple: { name: 'Groove Anchor Hit', type: 'melee', dmg: 1.0 },
    secondary: { name: 'Low Pulse Snare', type: 'trap', cd: 7, dmg: 1.5 },
    defense: { name: 'Protest Line Guard', type: 'shield', dur: 2.2, reduce: 0.82 },
    special: { name: 'Bassline Crowd Stabilizer', type: 'support_aoe', dmg: 4.25, color: '#7d6608' }
  },
  arthur_kaamelott: dlcKaamelott.createHeroOverrides(),
  perceval_kaamelott: dlcKaamelott.createHeroOverrides2(),
  karadoc_kaamelott: dlcKaamelott.createHeroOverrides3(),
  thomas_rogan_hotd: dlcHouseOfTheDead.createHeroOverrides(),
  g_hotd: dlcHouseOfTheDead.createHeroOverrides2(),
  sophie_hotd: dlcHouseOfTheDead.createHeroOverrides3(),
  james_taylor_hotd2: dlcHouseOfTheDead2.createHeroOverrides(),
  gary_stewart_hotd2: dlcHouseOfTheDead2.createHeroOverrides2(),
  amy_crystal_hotd2: dlcHouseOfTheDead2.createHeroOverrides3(),
  lisa_rogan_hotd3: dlcHouseOfTheDead3.createHeroOverrides(),
  g_hotd3: dlcHouseOfTheDead3.createHeroOverrides2(),
  dan_taylor_hotd3: dlcHouseOfTheDead3.createHeroOverrides3(),
  jill: dlcResidentEvil.createHeroOverrides(),
  wesker: dlcResidentEvil.createHeroOverrides2()
};

Object.assign(heroOverrides, LORE_ACCURATE_HERO_OVERRIDES);
Object.assign(heroOverrides, SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES);

// Apply these source locks after the historical class-derived loadouts. Numeric
// damage and cooldowns are game rules; none of these locks approve existing art.
Object.assign(heroOverrides, {
  han_solo: {
    incarnation: 'Star Wars: A New Hope (1977) - Mos Eisley / Death Star escape',
    referenceUrl: 'https://www.starwars.com/databank/han-solo',
    referenceUrls: ['https://www.starwars.com/databank/han-solo', 'https://www.starwars.com/databank/dl-44-blaster-pistol'],
    visualAnchor: 'Han Solo in A New Hope: brown hair, cream open-collar shirt, black sleeveless vest, dark blue trousers with red side stripes, brown belt and right-thigh DL-44 holster, black boots. Modified DL-44 blaster pistol; no Jedi saber, carbonite armor, older sequel beard or winter coat.',
    canonStatus: 'source incarnation and equipment locked; combat choreography is a game adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Modified DL-44 Blaster Pistol', 'Right-Thigh Blaster Holster', 'Smuggler Utility Belt'],
    primaryColor: '#1c1c1c',
    secondaryColor: '#ede3cd',
    weaponType: 'gun',
    weaponColor: '#292929',
    simple: { name: 'DL-44 Quickdraw', type: 'bullet', dmg: 1.0, color: '#ff4136', tacticsProfile: { range: 4 } },
    secondary: { name: 'DL-44 Covering Fire', type: 'projectile', cd: 7, dmg: 1.8, color: '#ff4136', tacticsProfile: { range: 5 } },
    defense: { name: 'Smuggler Sidestep', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: 'DL-44 Blaster Volley', type: 'bullet', dmg: 4.6, color: '#ff4136', attackProfile: { shape: 'multi', maxTargets: 3, delivery: 'ranged' } }
  },
  luke: {
    incarnation: 'Star Wars: Return of the Jedi (1983) - Death Star II Jedi Knight',
    referenceUrl: 'https://www.starwars.com/databank/luke-skywalker',
    referenceUrls: ['https://www.starwars.com/databank/luke-skywalker', 'https://www.starwars.com/databank/luke-skywalkers-lightsaber'],
    visualAnchor: 'Luke Skywalker in Return of the Jedi: young adult, short brown hair, black Jedi tunic and trousers, black boots, black glove on the mechanical right hand, single silver-and-black hilt with one green lightsaber blade. Death Star II duel outfit; no blue inherited saber, old hermit beard, white farm tunic or electrical mind beam.',
    canonStatus: 'source incarnation and equipment locked; combat choreography is a game adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Luke s Green Lightsaber', 'Mechanical Right Hand', 'Black Jedi Duel Outfit'],
    primaryColor: '#202020',
    secondaryColor: '#2ecc71',
    weaponType: 'lightsaber',
    weaponColor: '#00ff00',
    simple: { name: 'Green Lightsaber Cut', type: 'melee', dmg: 1.2, tacticsProfile: { range: 1 } },
    secondary: { name: 'Force Telekinesis', type: 'gravity', cd: 5, dmg: 1.8 },
    defense: { name: 'Lightsaber Deflection', type: 'shield', dur: 2.0, reduce: 0.9 },
    special: { name: 'Green Lightsaber Duel', type: 'melee', dmg: 5.2, color: '#00ff00', attackProfile: { shape: 'single', delivery: 'melee' }, tacticsProfile: { range: 1 } }
  },
  vader: {
    incarnation: 'Star Wars: The Empire Strikes Back (1980) - Bespin Sith Lord',
    referenceUrl: 'https://www.starwars.com/databank/darth-vader',
    referenceUrls: ['https://www.starwars.com/databank/darth-vader', 'https://www.starwars.com/databank/darth-vaders-lightsaber', 'https://www.starwars.com/databank/admiral-piett'],
    visualAnchor: 'Darth Vader in The Empire Strikes Back: full black domed helmet and triangular respirator mask, glossy black shoulder armor, ribbed black suit, chest life-support control box, black cape, gloves and boots, silver-and-black hilt with one red lightsaber blade. Closed helmet throughout; no hooded human substitute, bare Anakin face, blue blade or Force lightning.',
    canonStatus: 'source incarnation and equipment locked; combat choreography is a game adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Darth Vader s Red Lightsaber', 'Cybernetic Life-Support Armor', 'Chest Control Box'],
    primaryColor: '#151515',
    secondaryColor: '#ff3030',
    weaponType: 'lightsaber',
    weaponColor: '#ff3030',
    simple: { name: 'Red Lightsaber Cut', type: 'melee', dmg: 1.0, tacticsProfile: { range: 1 } },
    secondary: { name: 'Bespin Debris Telekinesis', type: 'gravity', cd: 7, dmg: 1.8 },
    defense: { name: 'Lightsaber Parry', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Force Choke', type: 'gravity', dmg: 4.6, color: '#ff3030', attackProfile: { shape: 'single', delivery: 'ranged' } }
  },
  bob_minions: {
    incarnation: 'Minions (2015) - Bob, London crown-heist adventure',
    referenceUrl: 'https://www.illumination.com/movie/minions/',
    referenceUrls: ['https://www.illumination.com/movie/minions/', 'https://www.illumination.com/wp-content/uploads/2019/11/Minions_KingBob.png'],
    visualAnchor: 'Bob from Minions (2015): very short round bald yellow Minion, two eyes with different green and brown irises, silver double-lens goggles and black strap, blue denim bib overalls, black gloves and boots. Sweet naive personality and Tim teddy bear. Normal adventure outfit; no laser, human anatomy, hair tuft, single eye or permanent king costume.',
    canonStatus: 'source identity and props locked; comic combat is a game adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Double-Lens Goggles', 'Blue Denim Overalls', 'Tim Teddy Bear'],
    primaryColor: '#f4d74d',
    secondaryColor: '#3974ad',
    weapon: 'fists',
    weaponType: 'fists',
    weaponColor: '#242424',
    simple: { name: 'Clumsy Minion Bump', type: 'melee', dmg: 1.0, tacticsProfile: { range: 1 } },
    secondary: { name: 'Banana Distraction', type: 'projectile', cd: 8, dmg: 2.2 },
    defense: { name: 'Startled Sidestep', type: 'dodge', dur: 2.0, reduce: 0.75 },
    special: { name: 'Bob Comic Tumble', type: 'melee', dmg: 4.5, color: '#f4d74d', attackProfile: { shape: 'single', delivery: 'melee' }, tacticsProfile: { range: 1 } }
  },
  kevin_minions: {
    incarnation: 'Minions (2015) - Kevin, London crown-heist adventure',
    referenceUrl: 'https://www.illumination.com/movie/minions/',
    referenceUrls: ['https://www.illumination.com/movie/minions/', 'https://www.illumination.com/wp-content/uploads/2019/11/Minions_Kevin2.png'],
    visualAnchor: 'Kevin from Minions (2015): tallest member of the trio, elongated yellow capsule body, two brown eyes, silver double-lens goggles with black strap, central upright black hair tuft, blue denim bib overalls, black gloves and boots. Protective team leader; normal size and adventure outfit, distinct from short bald Bob and one-eyed Stuart.',
    canonStatus: 'source identity and props locked; comic combat is a game adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Double-Lens Goggles', 'Blue Denim Overalls', 'Banana'],
    primaryColor: '#f4d74d',
    secondaryColor: '#3974ad',
    weapon: 'fists',
    weaponType: 'fists',
    weaponColor: '#242424',
    simple: { name: 'Kevin Minion Bump', type: 'melee', dmg: 1.0, tacticsProfile: { range: 1 } },
    secondary: { name: 'Banana Toss', type: 'projectile', cd: 8, dmg: 2.2 },
    defense: { name: 'Protective Cover', type: 'shield', dur: 2.0, reduce: 0.75 },
    special: { name: 'Kevin Team Charge', type: 'melee', dmg: 4.5, color: '#f4d74d', attackProfile: { shape: 'single', delivery: 'melee' }, tacticsProfile: { range: 1 } }
  },
  stuart_minions: {
    incarnation: 'Minions (2015) - Stuart, London rock-star finale',
    referenceUrl: 'https://www.illumination.com/movie/minions/',
    referenceUrls: ['https://www.illumination.com/movie/minions/', 'https://www.illumination.com/wp-content/uploads/2019/11/SHM_PRINTS_P1880.png'],
    visualAnchor: 'Stuart from Minions (2015): medium-height yellow Minion with exactly one brown eye in a single silver goggle, black head strap, sparse center-parted black hair, blue denim bib overalls, black gloves and boots. Aspiring rock star with a red electric guitar and white pickguard; no second eye, sword or tall Kevin silhouette.',
    canonStatus: 'source identity and props locked; musical combat is a game adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Single-Lens Goggle', 'Blue Denim Overalls', 'Red Electric Guitar'],
    primaryColor: '#f4d74d',
    secondaryColor: '#3974ad',
    weapon: 'guitar',
    weaponType: 'guitar',
    weaponColor: '#cf2a25',
    simple: { name: 'Guitar Swing', type: 'melee', dmg: 1.0, tacticsProfile: { range: 1 } },
    secondary: { name: 'Rock-Star Riff', type: 'sound', cd: 8, dmg: 2.2 },
    defense: { name: 'Rebellious Sidestep', type: 'dodge', dur: 2.0, reduce: 0.75 },
    special: { name: 'London Guitar Solo', type: 'music_aoe', dmg: 4.5, color: '#cf2a25' }
  }
});

Object.entries(heroOverrides).forEach(([id, override]) => {
  const hero = HEROES_DB.find(item => item.id === id);
  if (hero) Object.assign(hero, override);
});

HEROES_DB.forEach(hero => {
  const corrected = applyCanonFollowupSourceKit(applyCanonBlackPearlSourceKit(applyCanonP0SourceKit(hero)));
  if (corrected !== hero) Object.assign(hero, corrected);
});

export const getHeroById = (id) => HEROES_DB.find(h => h.id === id);
export const getRandomHero = () => HEROES_DB[Math.floor(Math.random() * HEROES_DB.length)];
export const getItemsForUniverse = (univ) => EQUIP_ITEMS_DB.filter(it => it.universe === univ);
export const getEventItemForUniverse = (univ) => (
  EVENT_ITEMS_DB[univ] || EVENT_ITEMS_DB.Halo || EVENT_ITEMS_DB['Nexus de Convergence']
);
