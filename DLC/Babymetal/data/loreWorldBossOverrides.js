// Babymetal — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Babymetal",
    "babymetal-kami-band-rift-fox",
    "https://babymetal.com/",
    "Source-locked formation and Kami Band on a metal stage with choreography and fire layers; fox imagery is a non-hostile light motif.",
  ));
}
