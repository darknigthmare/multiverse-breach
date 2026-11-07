// Metal Gear — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'tactical',
    theme: 'infiltration, armes autonomes, conspirations militaires, codec et duels de soldats legende',
    stageName: 'Operation furtive',
    bossName: 'Metal Gear fantome'
  });
}
