// Hoshi — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Hoshi",
    "hoshi-amour-censure-storm",
    "https://www.joandco.fr/artiste/hoshi/",
    "Source-locked performer at piano and microphone with an original intimate-to-full-stage lighting progression.",
  ));
}
