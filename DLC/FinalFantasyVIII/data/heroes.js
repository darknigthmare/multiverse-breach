// Final Fantasy VIII — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'quistis_ff8', name: 'Quistis Trepe', cat: 'hacker', color: '#f4d03f' },
    { id: 'seifer_ff8', name: 'Seifer Almasy', cat: 'slayer', color: '#d7dbdd' },
    { id: 'laguna_ff8', name: 'Laguna Loire', cat: 'tactical', color: '#5dade2' }
  ]);
}

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'zell_ff8', name: 'Zell Dincht', cat: 'slayer', color: '#f4d03f', simpleName: 'Duel Punch Rush', secondaryName: 'Burning Rave', defenseName: 'SeeD Guard', specialName: 'My Final Heaven' },
    { id: 'selphie_ff8', name: 'Selphie Tilmitt', cat: 'hacker', color: '#f8c471', simpleName: 'Nunchaku Tap', secondaryName: 'Slot Magic Roll', defenseName: 'Festival Cheer', specialName: 'The End Limit' },
    { id: 'irvine_ff8', name: 'Irvine Kinneas', cat: 'tactical', color: '#7f5c38', simpleName: 'Galbadian Rifle Shot', secondaryName: 'Shot Limit Break', defenseName: 'Sharpshooter Cover', specialName: 'Fast Ammo Barrage' }
  ]);
}
