// Predator — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'sciFi',
    theme: 'chasse Yautja, honneur rituel, camouflage, plasma et trophees preleves sur les proies dignes',
    stageName: 'Terrain de chasse Yautja',
    bossName: 'Champion Yautja'
  });
}
