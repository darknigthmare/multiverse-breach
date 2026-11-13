// Lady Gaga — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Lady Gaga",
    "lady-gaga-bad-romance-paparazzi-core",
    "https://www.ladygaga.com/",
    "One explicitly selected tour era and wardrobe, with original choreography, piano, dancers, catwalk and encore states.",
  ));
}
