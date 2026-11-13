// Halo — definitions consumed by src/game/loreDescriptions.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCoreUniverseSignatures() {
  return ({
    faction: 'sciFi',
    theme: 'UNSC, programme Spartan-II, Covenant, anneaux Forerunner, Sentinelles, Parasite et boucliers MJOLNIR',
    stageName: 'Installation 04',
    bossName: 'Scarab Covenant',
    worldBoss: 'Covenant Scarab Mech'
  });
}
