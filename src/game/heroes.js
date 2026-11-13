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
import { COMBAT_SOURCE_DEFINITIONS_WAVE12 } from './combat/combatSourceDefinitionsWave12.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE13 } from './combat/combatSourceDefinitionsWave13.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE14 } from './combat/combatSourceDefinitionsWave14.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 } from './combat/combatSourceDefinitionsWave15.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE16 } from './combat/combatSourceDefinitionsWave16.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from './combat/combatSourceDefinitionsWave17.js';

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

// Apply equipment identity after every expansion has resolved the hero. Role
// defaults such as marine/tactical must not turn lances or daggers into guns.
Object.assign(heroOverrides, {
  ragna: { ...heroOverrides.ragna, weaponType: 'greatsword' },
  jin: { ...heroOverrides.jin, weaponType: 'blade' },
  noel: { ...heroOverrides.noel, weaponType: 'gun' },
  rachel_bb: { ...heroOverrides.rachel_bb, weaponType: 'umbrella' },
  hazama_bb: { ...heroOverrides.hazama_bb, weaponType: 'chain' },
  luke: { ...heroOverrides.luke, weaponType: 'lightsaber', weaponColor: '#6fe687' },
  vader: { ...heroOverrides.vader, weaponType: 'lightsaber', weaponColor: '#ee6a6a' },
  han_solo: { ...heroOverrides.han_solo, weaponType: 'gun' },
  leia_organa: { ...heroOverrides.leia_organa, weaponType: 'gun' },
  obi_wan: { ...heroOverrides.obi_wan, weaponType: 'lightsaber', weaponColor: '#67b8ff' },
  may_gg: { ...heroOverrides.may_gg, weaponType: 'anchor' },
  dizzy_gg: { ...heroOverrides.dizzy_gg, weaponType: 'melee' },
  millia_gg: { ...heroOverrides.millia_gg, weaponType: 'slash' },
  axl_gg: { ...heroOverrides.axl_gg, weaponType: 'chain' },
  baiken_gg: { ...heroOverrides.baiken_gg, weaponType: 'sword' },
  kenshin_himura: { ...heroOverrides.kenshin_himura, weaponType: 'sword' },
  sanosuke_sagara: { ...heroOverrides.sanosuke_sagara, weaponType: 'fists' },
  kaoru_kamiya: { ...heroOverrides.kaoru_kamiya, weaponType: 'bokken' },
  robin_tt: { ...heroOverrides.robin_tt, weaponType: 'staff' },
  cyborg_tt: { ...heroOverrides.cyborg_tt, weaponType: 'fists' },
  raven_tt: { ...heroOverrides.raven_tt, weaponType: 'magic' },
  starfire_tt: { ...heroOverrides.starfire_tt, weaponType: 'starbolts' },
  beast_boy_tt: { ...heroOverrides.beast_boy_tt, weaponType: 'shapeshift' },
  kiryu_yakuza: { ...heroOverrides.kiryu_yakuza, weaponType: 'fists' },
  majima_yakuza: { ...heroOverrides.majima_yakuza, weaponType: 'knife' },
  ichiban_yakuza: { ...heroOverrides.ichiban_yakuza, weaponType: 'bat' },
  saejima_yakuza: { ...heroOverrides.saejima_yakuza, weaponType: 'fists' },
  akiyama_yakuza: { ...heroOverrides.akiyama_yakuza, weaponType: 'kicking' },
  blade_wolf_mgr: { ...heroOverrides.blade_wolf_mgr, weaponType: 'chainsaw' },
  jetstream_sam: { ...heroOverrides.jetstream_sam, weaponType: 'sword' },
  armstrong_mgr: { ...heroOverrides.armstrong_mgr, weaponType: 'fists' },
  mistral_mgr: { ...heroOverrides.mistral_mgr, weaponType: 'polearm' },
  monsoon_mgr: { ...heroOverrides.monsoon_mgr, weaponType: 'sai' },
  laios_meshi: { ...heroOverrides.laios_meshi, weaponType: 'sword' },
  marcille_meshi: { ...heroOverrides.marcille_meshi, weaponType: 'staff' },
  senshi_meshi: { ...heroOverrides.senshi_meshi, weaponType: 'axe' },
  chilchuck_meshi: { ...heroOverrides.chilchuck_meshi, weaponType: 'lockpicks' },
  falin_meshi: { ...heroOverrides.falin_meshi, weaponType: 'staff' },
  marcus: { ...heroOverrides.marcus, weaponType: 'chainsaw' },
  dom: { ...heroOverrides.dom, weaponType: 'gun' },
  cole: { ...heroOverrides.cole, weaponType: 'gun' },
  baird: { ...heroOverrides.baird, weaponType: 'gun' },
  hoffman_cog: { ...heroOverrides.hoffman_cog, weaponType: 'gun' },
  shepard: { ...heroOverrides.shepard, weaponType: 'gun' },
  garrus: { ...heroOverrides.garrus, weaponType: 'gun' },
  liara: { ...heroOverrides.liara, weaponType: 'gun' },
  tali: { ...heroOverrides.tali, weaponType: 'gun' },
  wrex: { ...heroOverrides.wrex, weaponType: 'gun' },
  motoko: { ...heroOverrides.motoko, weaponType: 'gun' },
  batou: { ...heroOverrides.batou, weaponType: 'gun' },
  togusa: { ...heroOverrides.togusa, weaponType: 'gun' },
  aramaki: { ...heroOverrides.aramaki, weaponType: 'terminal' },
  saito_gits: { ...heroOverrides.saito_gits, weaponType: 'gun' },
  chris_redfield: { ...heroOverrides.chris_redfield, weaponType: 'gun' },
  claire_redfield: { ...heroOverrides.claire_redfield, weaponType: 'gun' },
  ada_wong: { ...heroOverrides.ada_wong, weaponType: 'gun' },
  barry_burton: { ...heroOverrides.barry_burton, weaponType: 'gun' },
  carlos_oliveira: { ...heroOverrides.carlos_oliveira, weaponType: 'gun' },
  sonic_hedgehog: { ...heroOverrides.sonic_hedgehog, weaponType: 'melee' },
  knuckles_echidna: { ...heroOverrides.knuckles_echidna, weaponType: 'melee' },
  miles_tails_prower: { ...heroOverrides.miles_tails_prower, weaponType: 'laser' },
  jotaro_kujo: { ...heroOverrides.jotaro_kujo, weaponType: 'melee' },
  joseph_joestar: { ...heroOverrides.joseph_joestar, weaponType: 'melee' },
  giorno_giovanna: { ...heroOverrides.giorno_giovanna, weaponType: 'melee' },
  devil_may_cry_dante: { ...heroOverrides.devil_may_cry_dante, weaponType: 'sword' },
  devil_may_cry_nero: { ...heroOverrides.devil_may_cry_nero, weaponType: 'sword' },
  devil_may_cry_lady: { ...heroOverrides.devil_may_cry_lady, weaponType: 'gun' },
  skullgirls_parasoul: { ...heroOverrides.skullgirls_parasoul, weaponType: 'umbrella' },
  skullgirls_big_band: { ...heroOverrides.skullgirls_big_band, weaponType: 'melee' },
  skullgirls_beowulf: { ...heroOverrides.skullgirls_beowulf, weaponType: 'melee' },
  snake: { ...heroOverrides.snake, weaponType: 'gun' },
  raiden: { ...heroOverrides.raiden, weaponType: 'high_frequency_blade' },
  otacon: { ...heroOverrides.otacon, weaponType: 'terminal' },
  vegeta_dbz: { ...heroOverrides.vegeta_dbz, weaponType: 'melee' },
  boruto_uzumaki: { ...heroOverrides.boruto_uzumaki, weaponType: 'kunai' },
  sarada_uchiha: { ...heroOverrides.sarada_uchiha, weaponType: 'kunai' },
  mitsuki_boruto: { ...heroOverrides.mitsuki_boruto, weaponType: 'melee' },
  rebecca_chambers: { ...heroOverrides.rebecca_chambers, weaponType: 'gun' },
  goku_dbz: { ...heroOverrides.goku_dbz, weaponType: 'melee' },
  piccolo_dbz: { ...heroOverrides.piccolo_dbz, weaponType: 'melee' },
  redxiii_ff7: { ...heroOverrides.redxiii_ff7, weaponType: 'melee' },
  yuffie_ff7: { ...heroOverrides.yuffie_ff7, weaponType: 'shuriken' },
  vincent_ff7: { ...heroOverrides.vincent_ff7, weaponType: 'gun' },
  sakura_haruno_young: { ...heroOverrides.sakura_haruno_young, weaponType: 'kunai' },
  kakashi_war: { ...heroOverrides.kakashi_war, weaponType: 'kunai' },
  snow_ff13: { ...heroOverrides.snow_ff13, weaponType: 'melee' },
  fang_ff13: { ...heroOverrides.fang_ff13, weaponType: 'spear' },
  vanille_ff13: { ...heroOverrides.vanille_ff13, weaponType: 'staff' },
  gladiolus_ff15: { ...heroOverrides.gladiolus_ff15, weaponType: 'sword' },
  ignis_ff15: { ...heroOverrides.ignis_ff15, weaponType: 'slash' }
});

// W10 explicit source equipment; the raw ability records remain preserved.
Object.assign(heroOverrides, {
  trinity: { ...heroOverrides.trinity, weaponType: 'gun' },
  oneill: { ...heroOverrides.oneill, weaponType: 'gun' },
  sam_carter: { ...heroOverrides.sam_carter, weaponType: 'gun' },
  barney: { ...heroOverrides.barney, weaponType: 'gun' },
  alyx_vance: { ...heroOverrides.alyx_vance, weaponType: 'gun' },
  nick_v: { ...heroOverrides.nick_v, weaponType: 'gun' },
  piper_wright: { ...heroOverrides.piper_wright, weaponType: 'gun' },
  hicks_aliens: { ...heroOverrides.hicks_aliens, weaponType: 'gun' },
  vasquez_aliens: { ...heroOverrides.vasquez_aliens, weaponType: 'gun' },
  ripley_aliens: { ...heroOverrides.ripley_aliens, weaponType: 'gun' },
  hudson_aliens: { ...heroOverrides.hudson_aliens, weaponType: 'gun' },
  dallas: { ...heroOverrides.dallas, weaponType: 'gun' },
  wolf_pd: { ...heroOverrides.wolf_pd, weaponType: 'gun' },
  hoxton: { ...heroOverrides.hoxton, weaponType: 'gun' },
  chains_pd: { ...heroOverrides.chains_pd, weaponType: 'gun' },
  clover_pd: { ...heroOverrides.clover_pd, weaponType: 'gun' },
  bill_l4d: { ...heroOverrides.bill_l4d, weaponType: 'gun' },
  ellis_l4d: { ...heroOverrides.ellis_l4d, weaponType: 'gun' },
  coach_l4d: { ...heroOverrides.coach_l4d, weaponType: 'gun' },
  rochelle_l4d: { ...heroOverrides.rochelle_l4d, weaponType: 'gun' },
  nick_l4d: { ...heroOverrides.nick_l4d, weaponType: 'gun' },
  neo: { ...heroOverrides.neo, weaponType: 'fists' },
  agent_smith: { ...heroOverrides.agent_smith, weaponType: 'fists' },
  seraph: { ...heroOverrides.seraph, weaponType: 'fists' },
  morpheus: { ...heroOverrides.morpheus, weaponType: 'katana' },
  tealc: { ...heroOverrides.tealc, weaponType: 'staff' },
  daniel_jackson: { ...heroOverrides.daniel_jackson, weaponType: 'tablet' },
  hammond_sgc: { ...heroOverrides.hammond_sgc, weaponType: 'radio' },
  freeman: { ...heroOverrides.freeman, weaponType: 'crowbar' },
  eli_vance: { ...heroOverrides.eli_vance, weaponType: 'tablet' },
  kleiner: { ...heroOverrides.kleiner, weaponType: 'tablet' },
  paladin: { ...heroOverrides.paladin, weaponType: 'laser' },
  dogmeat: { ...heroOverrides.dogmeat, weaponType: 'melee' },
  preston_garvey: { ...heroOverrides.preston_garvey, weaponType: 'laser' },
  bishop_aliens: { ...heroOverrides.bishop_aliens, weaponType: 'none' },
  venkman_gb: { ...heroOverrides.venkman_gb, weaponType: 'laser' },
  stantz_gb: { ...heroOverrides.stantz_gb, weaponType: 'laser' },
  zeddemore_gb: { ...heroOverrides.zeddemore_gb, weaponType: 'laser' },
  spengler_gb: { ...heroOverrides.spengler_gb, weaponType: 'scanner' },
  janine_gb: { ...heroOverrides.janine_gb, weaponType: 'radio' },
});

// W11 source-specific equipment; action records retain their original source metadata.
Object.assign(heroOverrides, {
  buffy_summers: { ...heroOverrides.buffy_summers, weaponType: 'stake' },
  willow_rosenberg: { ...heroOverrides.willow_rosenberg, weaponType: 'magic' },
  giles_buffy: { ...heroOverrides.giles_buffy, weaponType: 'crossbow' },
  xander_buffy: { ...heroOverrides.xander_buffy, weaponType: 'none' },
  spike_buffy: { ...heroOverrides.spike_buffy, weaponType: 'fists' },
  harry_potter: { ...heroOverrides.harry_potter, weaponType: 'wand' },
  hermione_granger: { ...heroOverrides.hermione_granger, weaponType: 'wand' },
  ron_weasley: { ...heroOverrides.ron_weasley, weaponType: 'wand' },
  dumbledore: { ...heroOverrides.dumbledore, weaponType: 'wand' },
  snape: { ...heroOverrides.snape, weaponType: 'wand' },
  sheppard_sga: { ...heroOverrides.sheppard_sga, weaponType: 'gun' },
  mckay_sga: { ...heroOverrides.mckay_sga, weaponType: 'tablet' },
  teyla_sga: { ...heroOverrides.teyla_sga, weaponType: 'bantos' },
  ronon_dex: { ...heroOverrides.ronon_dex, weaponType: 'gun' },
  elizabeth_weir: { ...heroOverrides.elizabeth_weir, weaponType: 'radio' },
  rush_sgu: { ...heroOverrides.rush_sgu, weaponType: 'tablet' },
  young_sgu: { ...heroOverrides.young_sgu, weaponType: 'radio' },
  greer_sgu: { ...heroOverrides.greer_sgu, weaponType: 'gun' },
  chloe_sgu: { ...heroOverrides.chloe_sgu, weaponType: 'radio' },
  matt_scott_sgu: { ...heroOverrides.matt_scott_sgu, weaponType: 'gun' },
  lilith_borderlands: { ...heroOverrides.lilith_borderlands, weaponType: 'gun' },
  mordecai_borderlands: { ...heroOverrides.mordecai_borderlands, weaponType: 'gun' },
  roland_bl: { ...heroOverrides.roland_bl, weaponType: 'gun' },
  brick_bl: { ...heroOverrides.brick_bl, weaponType: 'fists' },
  claptrap_borderlands: { ...heroOverrides.claptrap_borderlands, weaponType: 'none' },
  max: { ...heroOverrides.max, weaponType: 'gun' },
  furiosa: { ...heroOverrides.furiosa, weaponType: 'gun' },
  nux: { ...heroOverrides.nux, weaponType: 'wrench' },
  toast_mm: { ...heroOverrides.toast_mm, weaponType: 'ammo' },
  capable_mm: { ...heroOverrides.capable_mm, weaponType: 'none' },
  korben: { ...heroOverrides.korben, weaponType: 'gun' },
  leeloo: { ...heroOverrides.leeloo, weaponType: 'fists' },
  ruby_rhod: { ...heroOverrides.ruby_rhod, weaponType: 'radio' },
  zorg: { ...heroOverrides.zorg, weaponType: 'gun' },
  cornelius: { ...heroOverrides.cornelius, weaponType: 'briefing' },
  arthur_kaamelott: { ...heroOverrides.arthur_kaamelott, weaponType: 'sword' },
  perceval_kaamelott: { ...heroOverrides.perceval_kaamelott, weaponType: 'none' },
  karadoc_kaamelott: { ...heroOverrides.karadoc_kaamelott, weaponType: 'rations' },
  leodagan_kaamelott: { ...heroOverrides.leodagan_kaamelott, weaponType: 'sword' },
  lancelot_kaamelott: { ...heroOverrides.lancelot_kaamelott, weaponType: 'sword' },
});

// Explicit equipment for the selected source versions; raw action records stay intact.
for (const [id, source] of Object.entries({ ...COMBAT_SOURCE_DEFINITIONS_WAVE12, ...COMBAT_SOURCE_DEFINITIONS_WAVE13, ...COMBAT_SOURCE_DEFINITIONS_WAVE14, ...COMBAT_SOURCE_DEFINITIONS_WAVE15, ...COMBAT_SOURCE_DEFINITIONS_WAVE16, ...COMBAT_SOURCE_DEFINITIONS_WAVE17 })) {
  // Current, documented Star Wars editions keep their own saber geometry.
  // Historical W13 authoring data must not reduce Fulcrum's pair to one blade
  // or replace the S7 Mandalore double saber with the older generic type.
  const currentStarWarsKit = source.universe === 'Star Wars'
    ? SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES[id]
      || SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS['Star Wars']?.find(actor => actor.id === id)
    : null;
  const weaponType = currentStarWarsKit?.equipmentEvidenceStatus
    ? currentStarWarsKit.weaponType
    : source.weaponType;
  heroOverrides[id] = { ...heroOverrides[id], weaponType };
}

// Preserve the previous placeholder's name solely for historical raw-name audits.
heroOverrides.pomni = { ...heroOverrides.pomni, name: 'Pomni', legacyRosterName: 'Digital Circus' };

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
