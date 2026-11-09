// Shakira — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Shakira",
    "shakira-hips-dont-lie-pulse",
    "https://www.shakira.com/",
    "Source-locked tour wardrobe on an original stage with choreography, percussion, dancers and audience layers.",
  ));
}
