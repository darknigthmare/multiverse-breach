// BioShock — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'jack_bioshock', name: 'Jack', cat: 'hacker', color: '#d9b36c', weapon: 'plasmid', simpleName: 'Electro Bolt', secondaryName: 'Plasmid Chain Shock', defenseName: 'Vita-Chamber Reboot', specialName: 'Would You Kindly Override' },
    { id: 'little_sister_bioshock', name: 'Little Sister', cat: 'horror', color: '#f5cba7', simpleName: 'ADAM Needle Tap', secondaryName: 'Gatherer Call', defenseName: 'Big Daddy Hide', specialName: 'Rapture Harvest Echo' },
    { id: 'andrew_ryan', name: 'Andrew Ryan', cat: 'tactical', color: '#7f5c38', simpleName: 'Golf Club Strike', secondaryName: 'Rapture Speech Command', defenseName: 'Private Office Lock', specialName: 'No Gods or Kings Edict' },
    { id: 'booker_dewitt_bioshock', name: 'Booker DeWitt', cat: 'tactical', color: '#5d6d7e', simpleName: 'Sky-Hook Strike', secondaryName: 'Vigor Shock Jockey', defenseName: 'Tear Cover', specialName: 'Columbia Skyline Rush' }
  ]);
}
