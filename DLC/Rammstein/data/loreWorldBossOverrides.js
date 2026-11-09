// Rammstein — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Rammstein",
    "rammstein-engel-wings-pyro-rig",
    "https://www.rammstein.de/en/",
    "All six musicians on an original industrial stage with source-locked tour clothing, instruments and separately animated pyrotechnics.",
  ));
}
