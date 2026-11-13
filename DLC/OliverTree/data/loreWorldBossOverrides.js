// Oliver Tree — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Oliver Tree",
    "oliver-tree-turbo-scooter-breakdown",
    "https://www.olivertreemusic.com/",
    "Source-locked bowl-cut and oversized outfit, scooter, ramps and stage as separate assets for a stunt-performance finale.",
  ));
}
