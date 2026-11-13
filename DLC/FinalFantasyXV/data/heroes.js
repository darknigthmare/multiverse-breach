// Final Fantasy XV — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'ignis_ff15', name: 'Ignis Scientia', cat: 'tactical', color: '#566573' },
    { id: 'gladiolus_ff15', name: 'Gladiolus Amicitia', cat: 'marine', color: '#7b241c' },
    { id: 'lunafreya_ff15', name: 'Lunafreya', cat: 'hacker', color: '#f8c471' }
  ]);
}

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'prompto_ff15', name: 'Prompto Argentum', cat: 'tactical', color: '#f4d03f', simpleName: 'Pistol Snapshot', secondaryName: 'Piercer Shot', defenseName: 'Photo Roll Dodge', specialName: 'Trigger Happy Barrage' },
    { id: 'ardyn_ff15', name: 'Ardyn Izunia', cat: 'horror', color: '#7b241c', simpleName: 'Starscourge Cut', secondaryName: 'Royal Parry Theft', defenseName: 'Immortal Feint', specialName: 'Usurper Throne Collapse' },
    { id: 'cor_ff15', name: 'Cor Leonis', cat: 'slayer', color: '#566573', simpleName: 'Katana Draw', secondaryName: 'Immortal Counter', defenseName: 'Crownsguard Stance', specialName: 'Lucian Veteran Rush' }
  ]);
}
