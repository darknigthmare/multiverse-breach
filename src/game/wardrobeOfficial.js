// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/wardrobeOfficial.js';
import * as dlcNieR from '../../DLC/NieR/data/wardrobeOfficial.js';
import * as dlcDevilMayCry from '../../DLC/DevilMayCry/data/wardrobeOfficial.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/wardrobeOfficial.js';
import * as dlcStarWars from '../../DLC/StarWars/data/wardrobeOfficial.js';
import * as dlcTombRaider from '../../DLC/TombRaider/data/wardrobeOfficial.js';

// Publisher / official-source inventory: existence is documented, artwork is NOT delivered.
const S0 = "https://store.steampowered.com/app/580600/";
const S1 = "https://store.steampowered.com/dlc/2050650/";
const S2 = "https://store.steampowered.com/dlc/287700/";
const S3 = "https://store.steampowered.com/dlc/339340/";
const S4 = "https://store.steampowered.com/dlc/601150/";
const S5 = "https://store.steampowered.com/dlc/750920/";
const S6 = "https://store.steampowered.com/dlc/883710/";
const S7 = "https://store.steampowered.com/dlc/952060/";
const S8 = "https://www.starwars.com/databank/han-solo";
const S9 = "https://www.starwars.com/databank/leia-organa";
const S10 = "https://www.starwars.com/databank/luke-skywalker";
const make = (universe, ids, key, fr, en, sourceWork, sourceUrl, nature="official-costume", note="Existence documentée. Captures multi-vues, détails, animation et validation artistique restent à réaliser.") => Object.freeze({
  universe, actorIds:Object.freeze(ids.split("|")), key, name:Object.freeze({fr,en}),sourceWork,sourceUrl,nature,note,
  sourceEvidence:sourceUrl.includes("steampowered")?"publisher-description":"official-databank-scene",
  artworkStatus:"NOT_PRODUCED",artApproval:"NOT_REVIEWED",equippable:false
});
export const OFFICIAL_WARDROBE = Object.freeze([
  dlcResidentEvil.createOfficialWardrobe({ S6, make }),
  dlcResidentEvil.createOfficialWardrobe2({ S6, make }),
  dlcResidentEvil.createOfficialWardrobe3({ S6, make }),
  dlcResidentEvil.createOfficialWardrobe4({ S6, make }),
  dlcResidentEvil.createOfficialWardrobe5({ S6, make }),
  dlcResidentEvil.createOfficialWardrobe6({ S6, make }),
  dlcResidentEvil.createOfficialWardrobe7({ S6, make }),
  dlcResidentEvil.createOfficialWardrobe8({ S1, make }),
  dlcResidentEvil.createOfficialWardrobe9({ S1, make }),
  dlcResidentEvil.createOfficialWardrobe10({ S1, make }),
  dlcResidentEvil.createOfficialWardrobe11({ S1, make }),
  dlcResidentEvil.createOfficialWardrobe12({ S7, make }),
  dlcResidentEvil.createOfficialWardrobe13({ S7, make }),
  dlcResidentEvil.createOfficialWardrobe14({ S7, make }),
  dlcResidentEvil.createOfficialWardrobe15({ S3, make }),
  dlcResidentEvil.createOfficialWardrobe16({ S3, make }),
  dlcResidentEvil.createOfficialWardrobe17({ S3, make }),
  dlcResidentEvil.createOfficialWardrobe18({ S3, make }),
  dlcResidentEvil.createOfficialWardrobe19({ S3, make }),
  dlcResidentEvil.createOfficialWardrobe20({ S3, make }),
  dlcResidentEvil.createOfficialWardrobe21({ S3, make }),
  dlcNieR.createOfficialWardrobe({ S0, make }),
  dlcNieR.createOfficialWardrobe2({ S0, make }),
  dlcNieR.createOfficialWardrobe3({ S0, make }),
  dlcDevilMayCry.createOfficialWardrobe({ S4, make }),
  dlcDevilMayCry.createOfficialWardrobe2({ S4, make }),
  dlcDevilMayCry.createOfficialWardrobe3({ S4, make }),
  dlcMetalGear.createOfficialWardrobe({ S2, make }),
  dlcMetalGear.createOfficialWardrobe2({ S2, make }),
  dlcMetalGear.createOfficialWardrobe3({ S2, make }),
  dlcStarWars.createOfficialWardrobe({ S10, make }),
  dlcStarWars.createOfficialWardrobe2({ S10, make }),
  dlcStarWars.createOfficialWardrobe3({ S10, make }),
  dlcStarWars.createOfficialWardrobe4({ S10, make }),
  dlcStarWars.createOfficialWardrobe5({ S10, make }),
  dlcStarWars.createOfficialWardrobe6({ S9, make }),
  dlcStarWars.createOfficialWardrobe7({ S9, make }),
  dlcStarWars.createOfficialWardrobe8({ S9, make }),
  dlcStarWars.createOfficialWardrobe9({ S8, make }),
  dlcStarWars.createOfficialWardrobe10({ S8, make }),
  dlcStarWars.createOfficialWardrobe11({ S10, make }),
  dlcTombRaider.createOfficialWardrobe({ S5, make }),
]);
