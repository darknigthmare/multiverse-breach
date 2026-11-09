// Bigflo & Oli — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Bigflo & Oli",
    "bigflo-oli-narrative-verse-storm",
    "https://bigfloetoli.com/",
    "The duo in source-locked tour clothing on an original urban stage with alternating verses, screens and crowd response states.",
  ));
}
