// Ghost in the Shell — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'cyber',
    theme: 'cybercerveaux, Section 9, identite numerique, corps augmentes et fantomes dans le reseau',
    stageName: 'Reseau Section 9',
    bossName: 'Puppet Core'
  });
}
