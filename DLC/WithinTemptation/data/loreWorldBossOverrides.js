// Within Temptation — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Within Temptation",
    "within-temptation-mother-earth-angel-core",
    "https://www.within-temptation.com/",
    "Source-locked band era on an original symphonic-gothic stage with vocals, guitars, orchestral layers and fabric effects.",
  ));
}
