// Shaka Ponk — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Shaka Ponk",
    "shaka-ponk-shaka-bass-ape-core",
    "https://www.shakaponk.com/",
    "Source-locked band on an original rock-electronic stage with Goz as a non-hostile projected avatar and separate screen layers.",
  ));
}
