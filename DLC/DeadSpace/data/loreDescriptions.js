// Dead Space — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'horror',
    theme: 'Ishimura, Monolithe, demembrement strategique, vide industriel et folie necromorphe',
    stageName: 'Coursive Ishimura',
    bossName: 'Monolithe vivant'
  });
}
