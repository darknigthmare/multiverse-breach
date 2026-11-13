// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/mosaicUniversePlaces.js';
import * as dlcHalo from '../../DLC/Halo/data/mosaicUniversePlaces.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/mosaicUniversePlaces.js';
import * as dlcStargate from '../../DLC/Stargate/data/mosaicUniversePlaces.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/mosaicUniversePlaces.js';
import * as dlcDoom from '../../DLC/Doom/data/mosaicUniversePlaces.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/mosaicUniversePlaces.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/mosaicUniversePlaces.js';
import * as dlcTombRaider from '../../DLC/TombRaider/data/mosaicUniversePlaces.js';
import * as dlcSpiderTheVideoGame from '../../DLC/SpiderTheVideoGame/data/mosaicUniversePlaces.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/mosaicUniversePlaces.js';
import * as dlcFuturama from '../../DLC/Futurama/data/mosaicUniversePlaces.js';

/** City source places, with localized ambience; geometry and service IDs unchanged. */
export const UNIVERSE_HUB_PLACES = {
  'Resident Evil': dlcResidentEvil.createUniverseHubPlaces(),
  Halo: dlcHalo.createUniverseHubPlaces(),
  'Half-Life': dlcHalfLife.createUniverseHubPlaces(),
  Stargate: dlcStargate.createUniverseHubPlaces(),
  'Silent Hill': dlcSilentHill.createUniverseHubPlaces(),
  Doom: dlcDoom.createUniverseHubPlaces(),
  'Metal Gear': dlcMetalGear.createUniverseHubPlaces(),
  'Final Fantasy VII': dlcFinalFantasyVII.createUniverseHubPlaces(),
  'Tomb Raider': dlcTombRaider.createUniverseHubPlaces(),
  'Spider: The Video Game': dlcSpiderTheVideoGame.createUniverseHubPlaces(),
  'The Simpsons': dlcTheSimpsons.createUniverseHubPlaces(),
  Futurama: dlcFuturama.createUniverseHubPlaces()
};

const MOODS_EN = {
  "Resident Evil": "contaminated streets, R.P.D. barricades, looted pharmacies",
  "Halo": "armored hangars, Forerunner beacons, dropship silhouettes",
  "Half-Life": "sealed laboratories, HEV conduits, orange resonances",
  "Stargate": "metal ramp, active chevrons, A.R.C.A. consoles",
  "Silent Hill": "wet asphalt, distant sirens, dark signs",
  "Doom": "red steel, heated runes, containment airlocks",
  "Metal Gear": "tactical snow, military crates, jammed radars",
  "Final Fantasy VII": "green reactors, suspended rails, industrial smoke",
  "Tomb Raider": "ancient stone, low torches, sealed traps",
  "Spider: The Video Game": "giant circuits, glassware, microprocessors and mechanical insects",
  "The Simpsons": "colorful houses, distant power plant, absurd signs",
  "Futurama": "transport tubes, neon lights, orbital deliveries"
};
const localizedPlace = (key, lang) => ({ ...UNIVERSE_HUB_PLACES[key],
  mood: lang === 'en' ? (MOODS_EN[key] || UNIVERSE_HUB_PLACES[key].mood) : UNIVERSE_HUB_PLACES[key].mood });

export const getUniverseHubPlace = (universe, lang = 'fr') => {
  const direct = Object.hasOwn(UNIVERSE_HUB_PLACES, universe) ? localizedPlace(universe, lang) : null;
  if (direct) return { ...direct, name: direct[lang] || direct.fr || direct.en };
  const lower = String(universe || '').toLowerCase();
  if (lower.includes('stargate')) return { ...localizedPlace('Stargate', lang), name: lang === 'fr' ? `Salle de Porte ${universe}` : `${universe} Gate Room` };
  if (lower.includes('final fantasy')) return { ...localizedPlace('Final Fantasy VII', lang), name: lang === 'fr' ? `District Cristal ${universe}` : `${universe} Crystal District` };
  if (lower.includes('resident')) return { ...localizedPlace('Resident Evil', lang), name: 'Raccoon City' };
  return {
    name: lang === 'fr' ? `Quartier ${universe || 'Nexus'}` : `${universe || 'Nexus'} District`,
    mood: lang === 'fr' ? 'decor reconstruit par la Trame, balises A.R.C.A. et fragments locaux' : 'Thread-built scenery, A.R.C.A. beacons, and local fragments',
    type: 'generic'
  };
};

