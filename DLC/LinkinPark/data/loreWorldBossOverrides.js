// Linkin Park — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Linkin Park",
    "linkin-park-meteora-feedback-core",
    "https://www.linkinpark.com/",
    "One explicitly source-locked lineup and era, with vocals, guitars, drums, sampler, screens and memorial encore layers.",
  ));
}
