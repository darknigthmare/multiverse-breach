// Final Fantasy XIII — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'snow_ff13', name: 'Snow Villiers', cat: 'marine', color: '#d7dbdd' },
    { id: 'sazh_ff13', name: 'Sazh Katzroy', cat: 'tactical', color: '#34495e' },
    { id: 'fang_ff13', name: 'Fang', cat: 'slayer', color: '#7d3c98' }
  ]);
}

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'snow_ff13', name: 'Snow Villiers', cat: 'marine', color: '#d7dbdd', simpleName: 'NORA Fist', secondaryName: 'Sentinel Taunt', defenseName: 'Guardian Corps Block', specialName: 'Sovereign Fist' },
    { id: 'sazh_ff13', name: 'Sazh Katzroy', cat: 'tactical', color: '#34495e', simpleName: 'Dual Pistol Burst', secondaryName: 'Chocobo Chick Feint', defenseName: 'Pilot Cover', specialName: 'Cold Blood Barrage' },
    { id: 'hope_ff13', name: 'Hope Estheim', cat: 'hacker', color: '#d5dbdb', weapon: 'boomerang', simpleName: 'Boomerang Throw', secondaryName: 'Synergist Boost', defenseName: 'Protect Shell', specialName: 'Alexander Summon Trace' }
  ]);
}
