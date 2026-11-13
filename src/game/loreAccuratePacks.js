// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcRammstein from '../../DLC/Rammstein/data/loreAccuratePacks.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/loreAccuratePacks.js';
import * as dlcRobZombie from '../../DLC/RobZombie/data/loreAccuratePacks.js';
import * as dlcDaftPunk from '../../DLC/DaftPunk/data/loreAccuratePacks.js';
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/loreAccuratePacks.js';
import * as dlcHalo from '../../DLC/Halo/data/loreAccuratePacks.js';
import * as dlcAlien from '../../DLC/Alien/data/loreAccuratePacks.js';
import * as dlcPredator from '../../DLC/Predator/data/loreAccuratePacks.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/loreAccuratePacks.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/loreAccuratePacks.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/loreAccuratePacks.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/loreAccuratePacks.js';
import * as dlcStargate from '../../DLC/Stargate/data/loreAccuratePacks.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/loreAccuratePacks.js';
import * as dlcPortal from '../../DLC/Portal/data/loreAccuratePacks.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/loreAccuratePacks.js';
import * as dlcPayday from '../../DLC/Payday/data/loreAccuratePacks.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/loreAccuratePacks.js';
import * as dlcYuGiOh from '../../DLC/YuGiOh/data/loreAccuratePacks.js';
import * as dlcGuiltyGear from '../../DLC/GuiltyGear/data/loreAccuratePacks.js';
import * as dlcBlazBlue from '../../DLC/BlazBlue/data/loreAccuratePacks.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/loreAccuratePacks.js';
import * as dlcChucky from '../../DLC/Chucky/data/loreAccuratePacks.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/loreAccuratePacks.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/loreAccuratePacks.js';
import * as dlcFallout from '../../DLC/Fallout/data/loreAccuratePacks.js';
import * as dlcDoom from '../../DLC/Doom/data/loreAccuratePacks.js';
import * as dlcUnreal from '../../DLC/Unreal/data/loreAccuratePacks.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/loreAccuratePacks.js';
import * as dlcStarWars from '../../DLC/StarWars/data/loreAccuratePacks.js';
import * as dlcTeenTitans from '../../DLC/TeenTitans/data/loreAccuratePacks.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/loreAccuratePacks.js';
import * as dlcScaryMovie from '../../DLC/ScaryMovie/data/loreAccuratePacks.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/loreAccuratePacks.js';
import * as dlcRickMorty from '../../DLC/RickMorty/data/loreAccuratePacks.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/loreAccuratePacks.js';
import * as dlcDigimon from '../../DLC/Digimon/data/loreAccuratePacks.js';
import * as dlcSaw from '../../DLC/Saw/data/loreAccuratePacks.js';
import * as dlcRosarioVampire from '../../DLC/RosarioVampire/data/loreAccuratePacks.js';
import * as dlcNegima from '../../DLC/Negima/data/loreAccuratePacks.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/loreAccuratePacks.js';
import * as dlcDandadan from '../../DLC/Dandadan/data/loreAccuratePacks.js';
import * as dlcMadMax from '../../DLC/MadMax/data/loreAccuratePacks.js';
import * as dlcLesInconnus from '../../DLC/LesInconnus/data/loreAccuratePacks.js';
import * as dlcRRRrrrr from '../../DLC/RRRrrrr/data/loreAccuratePacks.js';
import * as dlcLaCiteDeLaPeur from '../../DLC/LaCiteDeLaPeur/data/loreAccuratePacks.js';
import * as dlcOliverTree from '../../DLC/OliverTree/data/loreAccuratePacks.js';

// Lore-accurate roster and enemy expansion layer.
// This file keeps the big canon pass isolated while heroes.js and enemies.js inject it directly.

const catStats = {
  marine: { hp: 132, atk: 12, def: 9, spd: 5 },
  horror: { hp: 118, atk: 12, def: 7, spd: 6 },
  slayer: { hp: 118, atk: 15, def: 6, spd: 7 },
  hacker: { hp: 108, atk: 13, def: 7, spd: 7 },
  tactical: { hp: 124, atk: 12, def: 8, spd: 6 }
};

const hero = (id, name, cat, color, weaponType, simple, secondary, defense, special, specialDmg = 4.6) => ({
  id,
  name,
  cat,
  color,
  weaponType,
  weaponColor: color,
  stats: catStats[cat] || catStats.tactical,
  simple: { name: simple, type: weaponType === 'gun' ? 'bullet' : weaponType === 'laser' ? 'energy' : 'melee', dmg: 1.0 },
  secondary: { name: secondary, type: 'signature', cd: 7, dmg: 1.8 },
  defense: { name: defense, type: cat === 'hacker' ? 'hack' : cat === 'horror' ? 'dodge' : 'shield', dur: 2.0, reduce: 0.8 },
  special: { name: special, type: 'nexus_aoe', dmg: specialDmg, color }
});

const loadout = (weaponType, simple, secondary, defense, special, color = '#39c5bb', specialDmg = 4.6) => ({
  weaponType,
  weaponColor: color,
  simple: { name: simple, type: weaponType === 'gun' ? 'bullet' : weaponType === 'laser' ? 'energy' : 'melee', dmg: 1.0 },
  secondary: { name: secondary, type: 'signature', cd: 7, dmg: 1.8 },
  defense: { name: defense, type: 'shield', dur: 2.0, reduce: 0.8 },
  special: { name: special, type: 'nexus_aoe', dmg: specialDmg, color }
});

export const LORE_ACCURATE_HERO_EXPANSIONS = {
  Rammstein: dlcRammstein.createLoreAccurateHeroExpansions({ hero }),
  'System of a Down': dlcSystemOfADown.createLoreAccurateHeroExpansions({ hero }),
  'Rob Zombie': dlcRobZombie.createLoreAccurateHeroExpansions({ hero }),
  'Daft Punk': dlcDaftPunk.createLoreAccurateHeroExpansions({ hero }),
  'Gears of War': dlcGearsOfWar.createLoreAccurateHeroExpansions({ hero }),
  Halo: dlcHalo.createLoreAccurateHeroExpansions({ hero }),
  Alien: dlcAlien.createLoreAccurateHeroExpansions({ hero }),
  Predator: dlcPredator.createLoreAccurateHeroExpansions({ hero }),
  'Resident Evil': dlcResidentEvil.createLoreAccurateHeroExpansions({ hero }),
  'Silent Hill': dlcSilentHill.createLoreAccurateHeroExpansions({ hero }),
  'Dino Crisis': dlcDinoCrisis.createLoreAccurateHeroExpansions({ hero }),
  'The Matrix': dlcTheMatrix.createLoreAccurateHeroExpansions({ hero }),
  Stargate: dlcStargate.createLoreAccurateHeroExpansions({ hero }),
  'Half-Life': dlcHalfLife.createLoreAccurateHeroExpansions({ hero }),
  Portal: dlcPortal.createLoreAccurateHeroExpansions({ hero }),
  'Metal Gear': dlcMetalGear.createLoreAccurateHeroExpansions({ hero }),
  Payday: dlcPayday.createLoreAccurateHeroExpansions({ hero }),
  Vocaloid: dlcVocaloid.createLoreAccurateHeroExpansions({ hero }),
  'Yu-Gi-Oh': dlcYuGiOh.createLoreAccurateHeroExpansions({ hero }),
  'Guilty Gear': dlcGuiltyGear.createLoreAccurateHeroExpansions({ hero }),
  BlazBlue: dlcBlazBlue.createLoreAccurateHeroExpansions({ hero }),
  'Slender Man': dlcSlenderMan.createLoreAccurateHeroExpansions({ hero }),
  Chucky: dlcChucky.createLoreAccurateHeroExpansions({ hero }),
  Hellraiser: dlcHellraiser.createLoreAccurateHeroExpansions({ hero }),
  'Mass Effect': dlcMassEffect.createLoreAccurateHeroExpansions({ hero }),
  Fallout: dlcFallout.createLoreAccurateHeroExpansions({ hero }),
  Doom: dlcDoom.createLoreAccurateHeroExpansions({ hero }),
  Unreal: dlcUnreal.createLoreAccurateHeroExpansions({ hero }),
  'Harry Potter': dlcHarryPotter.createLoreAccurateHeroExpansions({ hero }),
  'Star Wars': dlcStarWars.createLoreAccurateHeroExpansions({ hero }),
  'Teen Titans': dlcTeenTitans.createLoreAccurateHeroExpansions({ hero }),
  'Le Cinquième Element': dlcLeCinquiemeElement.createLoreAccurateHeroExpansions({ hero }),
  'Scary Movie': dlcScaryMovie.createLoreAccurateHeroExpansions({ hero }),
  'Dead Space': dlcDeadSpace.createLoreAccurateHeroExpansions({ hero }),
  'Rick & Morty': dlcRickMorty.createLoreAccurateHeroExpansions({ hero }),
  'Digital Circus': dlcDigitalCircus.createLoreAccurateHeroExpansions({ hero }),
  Digimon: dlcDigimon.createLoreAccurateHeroExpansions({ hero }),
  Saw: dlcSaw.createLoreAccurateHeroExpansions({ hero }),
  'Rosario + Vampire': dlcRosarioVampire.createLoreAccurateHeroExpansions({ hero }),
  Negima: dlcNegima.createLoreAccurateHeroExpansions({ hero }),
  'Ghost in the Shell': dlcGhostInTheShell.createLoreAccurateHeroExpansions({ hero }),
  Dandadan: dlcDandadan.createLoreAccurateHeroExpansions({ hero }),
  'Mad Max': dlcMadMax.createLoreAccurateHeroExpansions({ hero })
};

export const LORE_ACCURATE_HERO_OVERRIDES = {
  inconnus_trio: dlcLesInconnus.createLoreAccurateHeroOverrides({ loadout }),
  bernard_inconnus: dlcLesInconnus.createLoreAccurateHeroOverrides2({ loadout }),
  didier_inconnus: dlcLesInconnus.createLoreAccurateHeroOverrides3({ loadout }),
  pierre_rrr: dlcRRRrrrr.createLoreAccurateHeroOverrides({ loadout }),
  guy_rrr: dlcRRRrrrr.createLoreAccurateHeroOverrides2({ loadout }),
  chef_cheveux_sales: dlcRRRrrrr.createLoreAccurateHeroOverrides3({ loadout }),
  odile_deray: dlcLaCiteDeLaPeur.createLoreAccurateHeroOverrides({ loadout }),
  simon_jeremi: dlcLaCiteDeLaPeur.createLoreAccurateHeroOverrides2({ loadout }),
  serge_karamazov: dlcLaCiteDeLaPeur.createLoreAccurateHeroOverrides3({ loadout }),
  momo_ayase: dlcDandadan.createLoreAccurateHeroOverrides({ loadout }),
  oken_dandadan: dlcDandadan.createLoreAccurateHeroOverrides2({ loadout }),
  aira_dandadan: dlcDandadan.createLoreAccurateHeroOverrides3({ loadout }),
  dom: dlcGearsOfWar.createLoreAccurateHeroOverrides({ loadout }),
  cole: dlcGearsOfWar.createLoreAccurateHeroOverrides2({ loadout }),
  arbiter: dlcHalo.createLoreAccurateHeroOverrides({ loadout }),
  johnson: dlcHalo.createLoreAccurateHeroOverrides2({ loadout }),
  hicks: dlcAlien.createLoreAccurateHeroOverrides({ loadout }),
  bishop: dlcAlien.createLoreAccurateHeroOverrides2({ loadout }),
  city_hunter: dlcPredator.createLoreAccurateHeroOverrides({ loadout }),
  dutch: dlcPredator.createLoreAccurateHeroOverrides2({ loadout }),
  trinity: dlcTheMatrix.createLoreAccurateHeroOverrides({ loadout }),
  morpheus: dlcTheMatrix.createLoreAccurateHeroOverrides2({ loadout }),
  atlas: dlcPortal.createLoreAccurateHeroOverrides({ loadout }),
  pbody: dlcPortal.createLoreAccurateHeroOverrides2({ loadout }),
  raiden: dlcMetalGear.createLoreAccurateHeroOverrides({ loadout }),
  otacon: dlcMetalGear.createLoreAccurateHeroOverrides2({ loadout }),
  wolf_pd: dlcPayday.createLoreAccurateHeroOverrides({ loadout }),
  hoxton: dlcPayday.createLoreAccurateHeroOverrides2({ loadout }),
  rin: dlcVocaloid.createLoreAccurateHeroOverrides({ loadout }),
  luka: dlcVocaloid.createLoreAccurateHeroOverrides2({ loadout }),
  kaiba: dlcYuGiOh.createLoreAccurateHeroOverrides({ loadout }),
  joey: dlcYuGiOh.createLoreAccurateHeroOverrides2({ loadout }),
  pegasus_ygo: dlcYuGiOh.createLoreAccurateHeroOverrides3({ loadout }),
  ky: dlcGuiltyGear.createLoreAccurateHeroOverrides({ loadout }),
  may_gg: dlcGuiltyGear.createLoreAccurateHeroOverrides2({ loadout }),
  jin: dlcBlazBlue.createLoreAccurateHeroOverrides({ loadout }),
  noel: dlcBlazBlue.createLoreAccurateHeroOverrides2({ loadout }),
  masky: dlcSlenderMan.createLoreAccurateHeroOverrides({ loadout }),
  hoody: dlcSlenderMan.createLoreAccurateHeroOverrides2({ loadout }),
  tiffany: dlcChucky.createLoreAccurateHeroOverrides({ loadout }),
  glen: dlcChucky.createLoreAccurateHeroOverrides2({ loadout }),
  female_cenobite: dlcHellraiser.createLoreAccurateHeroOverrides({ loadout }),
  butterball: dlcHellraiser.createLoreAccurateHeroOverrides2({ loadout }),
  pinhead: dlcHellraiser.createLoreAccurateHeroOverrides3({ loadout }),
  chatterer: dlcHellraiser.createLoreAccurateHeroOverrides4({ loadout }),
  julia_cotton: dlcHellraiser.createLoreAccurateHeroOverrides5({ loadout }),
  garrus: dlcMassEffect.createLoreAccurateHeroOverrides({ loadout }),
  liara: dlcMassEffect.createLoreAccurateHeroOverrides2({ loadout }),
  paladin: dlcFallout.createLoreAccurateHeroOverrides({ loadout }),
  nick_v: dlcFallout.createLoreAccurateHeroOverrides2({ loadout }),
  hayden: dlcDoom.createLoreAccurateHeroOverrides({ loadout }),
  doom_marine: dlcDoom.createLoreAccurateHeroOverrides2({ loadout }),
  brock: loadout('gun', 'Flak Cannon Pump', 'Rocket Jump Rush', 'Shield Belt Guard', 'Tournament Bruiser Combo', '#c0392b'),
  hermione: dlcHarryPotter.createLoreAccurateHeroOverrides({ loadout }),
  ron: dlcHarryPotter.createLoreAccurateHeroOverrides2({ loadout }),
  vader: dlcStarWars.createLoreAccurateHeroOverrides({ loadout }),
  han_solo: dlcStarWars.createLoreAccurateHeroOverrides2({ loadout }),
  leeloo: dlcLeCinquiemeElement.createLoreAccurateHeroOverrides({ loadout }),
  ruby_rhod: dlcLeCinquiemeElement.createLoreAccurateHeroOverrides2({ loadout }),
  cindy: dlcScaryMovie.createLoreAccurateHeroOverrides({ loadout }),
  shorty: dlcScaryMovie.createLoreAccurateHeroOverrides2({ loadout }),
  carver: dlcDeadSpace.createLoreAccurateHeroOverrides({ loadout }),
  ellie: dlcDeadSpace.createLoreAccurateHeroOverrides2({ loadout }),
  morty: dlcRickMorty.createLoreAccurateHeroOverrides({ loadout }),
  summer: dlcRickMorty.createLoreAccurateHeroOverrides2({ loadout }),
  jax: dlcDigitalCircus.createLoreAccurateHeroOverrides({ loadout }),
  caine: dlcDigitalCircus.createLoreAccurateHeroOverrides2({ loadout }),
  matt: dlcDigimon.createLoreAccurateHeroOverrides({ loadout }),
  izzy: dlcDigimon.createLoreAccurateHeroOverrides2({ loadout }),
  amanda: loadout('knife', 'Pig Mask Slash', 'Needle Pit Trigger', 'Apprentice Hide', 'Reverse Bear Trap Panic', '#d63031'),
  hoffman: loadout('gun', 'Detective Ambush Shot', 'Glass Coffin Setup', 'Corrupt Badge Guard', 'Trap Room Lockdown', '#2d3436'),
  tsukune: dlcRosarioVampire.createLoreAccurateHeroOverrides({ loadout }),
  kurumu: dlcRosarioVampire.createLoreAccurateHeroOverrides2({ loadout }),
  asuna: dlcNegima.createLoreAccurateHeroOverrides({ loadout }),
  evangeline: dlcNegima.createLoreAccurateHeroOverrides2({ loadout }),
  batou: dlcGhostInTheShell.createLoreAccurateHeroOverrides({ loadout }),
  togusa: dlcGhostInTheShell.createLoreAccurateHeroOverrides2({ loadout }),
  furiosa: dlcMadMax.createLoreAccurateHeroOverrides({ loadout }),
  nux: dlcMadMax.createLoreAccurateHeroOverrides2({ loadout })
};

const monster = (name, hp, atk, spd, color, weapon, extra = {}) => ({ name, hp, atk, spd, color, weapon, ...extra });
const boss = (name, hp, atk, spd, color, weapon, special, extra = {}) => ({ name, hp, atk, spd, color, weapon, special, ...extra });

export const LORE_ACCURATE_ENEMY_EXPANSIONS = {
  Rammstein: dlcRammstein.createLoreAccurateEnemyExpansions({ boss, monster }),
  'System of a Down': dlcSystemOfADown.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Rob Zombie': dlcRobZombie.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Daft Punk': dlcDaftPunk.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Oliver Tree': dlcOliverTree.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Gears of War': dlcGearsOfWar.createLoreAccurateEnemyExpansions({ boss, monster }),
  Halo: dlcHalo.createLoreAccurateEnemyExpansions({ boss, monster }),
  Alien: dlcAlien.createLoreAccurateEnemyExpansions({ boss, monster }),
  Predator: dlcPredator.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Resident Evil': dlcResidentEvil.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Silent Hill': dlcSilentHill.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Dino Crisis': dlcDinoCrisis.createLoreAccurateEnemyExpansions({ boss, monster }),
  'The Matrix': dlcTheMatrix.createLoreAccurateEnemyExpansions({ boss, monster }),
  Stargate: dlcStargate.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Half-Life': dlcHalfLife.createLoreAccurateEnemyExpansions({ boss, monster }),
  Portal: dlcPortal.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Metal Gear': dlcMetalGear.createLoreAccurateEnemyExpansions({ boss, monster }),
  Payday: dlcPayday.createLoreAccurateEnemyExpansions({ boss, monster }),
  Vocaloid: dlcVocaloid.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Yu-Gi-Oh': dlcYuGiOh.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Guilty Gear': dlcGuiltyGear.createLoreAccurateEnemyExpansions({ boss, monster }),
  BlazBlue: dlcBlazBlue.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Slender Man': dlcSlenderMan.createLoreAccurateEnemyExpansions({ boss, monster }),
  Chucky: dlcChucky.createLoreAccurateEnemyExpansions({ boss, monster }),
  Hellraiser: dlcHellraiser.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Mass Effect': dlcMassEffect.createLoreAccurateEnemyExpansions({ boss, monster }),
  Fallout: dlcFallout.createLoreAccurateEnemyExpansions({ boss, monster }),
  Doom: dlcDoom.createLoreAccurateEnemyExpansions({ boss, monster }),
  Unreal: dlcUnreal.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Harry Potter': dlcHarryPotter.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Star Wars': dlcStarWars.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Le Cinquième Element': dlcLeCinquiemeElement.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Scary Movie': dlcScaryMovie.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Dead Space': dlcDeadSpace.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Rick & Morty': dlcRickMorty.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Digital Circus': dlcDigitalCircus.createLoreAccurateEnemyExpansions({ boss, monster }),
  Digimon: dlcDigimon.createLoreAccurateEnemyExpansions({ boss, monster }),
  Saw: dlcSaw.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Rosario + Vampire': dlcRosarioVampire.createLoreAccurateEnemyExpansions({ boss, monster }),
  Negima: dlcNegima.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Ghost in the Shell': dlcGhostInTheShell.createLoreAccurateEnemyExpansions({ boss, monster }),
  'Mad Max': dlcMadMax.createLoreAccurateEnemyExpansions({ boss, monster })
};
