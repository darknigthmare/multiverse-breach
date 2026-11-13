// Mass Effect — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'sciFi',
    theme: 'Spectres, relais cosmodésiques, equipage inter-especes, biotique et guerre de civilisation',
    stageName: 'Relais galactique',
    bossName: 'Moissonneur fantome'
  });
}
