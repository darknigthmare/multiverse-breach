// Scary Movie — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'horror',
    theme: 'parodie horrifique, gags de slasher, logique absurde et peur detournee par le chaos comique',
    stageName: 'Plateau de parodie',
    bossName: 'Tueur rate'
  });
}
