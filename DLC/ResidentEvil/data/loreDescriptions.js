// Resident Evil — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'horror',
    theme: 'Raccoon City, Umbrella, T-Virus, G-Virus, B.O.W., commissariat R.P.D., ressources rares et extraction de survivants',
    stageName: 'Raccoon City Police Department',
    bossName: 'Tyrant T-00',
    worldBoss: 'William Birkin G-Stage 4'
  });
}
