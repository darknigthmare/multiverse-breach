// Star Wars — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'sciFi',
    theme: 'Force, Jedi, Sith, sabres, bataille spatiale et destin d une galaxie ancienne',
    stageName: 'Temple stellaire',
    bossName: 'Seigneur Sith'
  });
}
