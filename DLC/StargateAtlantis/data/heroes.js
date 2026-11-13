// Stargate Atlantis — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'ronon_dex', name: 'Ronon Dex', cat: 'slayer', color: '#5d4037', simpleName: 'Particle Magnum Shot', secondaryName: 'Satedan Rush', defenseName: 'Runner Instinct', specialName: 'Wraith Hunter Rampage' },
    { id: 'elizabeth_weir', name: 'Elizabeth Weir', cat: 'tactical', color: '#d7dbdd', simpleName: 'Atlantis Command Call', secondaryName: 'Diplomatic Lock', defenseName: 'Control Room Guard', specialName: 'Expedition Mandate' },
    { id: 'carson_beckett', name: 'Carson Beckett', cat: 'hacker', color: '#85c1e9', simpleName: 'Ancient Gene Scan', secondaryName: 'Medical Nanite Purge', defenseName: 'Infirmary Shield', specialName: 'Retrovirus Stabilizer' }
  ]);
}
