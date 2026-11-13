// Buffy the Vampire Slayer — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'xander_buffy', name: 'Xander Harris', cat: 'tactical', color: '#f8c471' },
    { id: 'giles_buffy', name: 'Rupert Giles', cat: 'hacker', color: '#7f8c8d' },
    { id: 'angel_buffy', name: 'Angel', cat: 'horror', color: '#1c2833' }
  ]);
}

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'willow_buffy', name: 'Willow Rosenberg', cat: 'hacker', color: '#c0392b', weapon: 'magic', simpleName: 'Wicca Spark', secondaryName: 'Barrier Spell', defenseName: 'Resolve Face Ward', specialName: 'Dark Willow Surge' },
    { id: 'spike_buffy', name: 'Spike', cat: 'horror', color: '#d7dbdd', simpleName: 'Vampire Hook', secondaryName: 'Cigarette-Lit Dash', defenseName: 'Leather Coat Guard', specialName: 'Champion Amulet Blaze' }
  ]);
}
