/** City source places, with localized ambience; geometry and service IDs unchanged. */
export const UNIVERSE_HUB_PLACES = {
  'Resident Evil': { fr: 'Raccoon City', en: 'Raccoon City', mood: 'rues contaminees, barricades R.P.D., pharmacies pillees', type: 'city' },
  Halo: { fr: 'Avant-poste UNSC', en: 'UNSC Outpost', mood: 'hangars blindes, balises Forerunner, silhouettes de dropship', type: 'military' },
  'Half-Life': { fr: 'Secteur Black Mesa', en: 'Black Mesa Sector', mood: 'labos coupes, conduits HEV, resonances oranges', type: 'lab' },
  Stargate: { fr: 'Salle de Porte SGC', en: 'SGC Gate Room', mood: 'rampe metallique, chevrons actifs, consoles A.R.C.A.', type: 'gate' },
  'Silent Hill': { fr: 'Quartier Brumeux', en: 'Fog District', mood: 'asphalte humide, sirenes lointaines, enseignes eteintes', type: 'fog' },
  Doom: { fr: 'Bastion UAC', en: 'UAC Bastion', mood: 'acier rouge, runes chaudes, sas de confinement', type: 'industrial' },
  'Metal Gear': { fr: 'Plateforme Shadow Moses', en: 'Shadow Moses Platform', mood: 'neige tactique, caisses militaires, radars brouilles', type: 'military' },
  'Final Fantasy VII': { fr: 'Secteur Mako', en: 'Mako Sector', mood: 'reacteurs verts, rails suspendus, fumee industrielle', type: 'reactor' },
  'Tomb Raider': { fr: 'Crypte de la Relique', en: 'Relic Crypt', mood: 'pierres anciennes, torches basses, pieges scelles', type: 'ruins' },
  'Spider: The Video Game': { fr: 'Laboratoires malefiques', en: 'Evil Labs', mood: 'circuits geants, verrerie, microprocesseurs et insectes mecaniques', type: 'lab' },
  'The Simpsons': { fr: 'Rue de Springfield', en: 'Springfield Street', mood: 'maisons colorees, centrale au loin, enseignes absurdes', type: 'suburb' },
  Futurama: { fr: 'New New York', en: 'New New York', mood: 'tubes de transport, neons, livraisons orbitales', type: 'futureCity' }
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

