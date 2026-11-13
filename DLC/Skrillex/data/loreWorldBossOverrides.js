// Skrillex — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Skrillex",
    "skrillex-wub-singularity",
    "https://skrillex.com/",
    "Source-locked artist silhouette at an original electronic stage with booth, speaker arrays, strobes and crowd states.",
  ));
}
