// Band-Maid — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Band-Maid",
    "band-maid-domination-feedback-core",
    "https://bandmaid.tokyo/",
    "Source-locked lineup in maid-rock stage clothing with separate guitars, bass, drums, vocals and audience states.",
  ));
}
