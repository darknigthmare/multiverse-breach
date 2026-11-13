// PSY — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "PSY",
    "psy-horse-dance-bass-core",
    "https://www.pnation.com/artists",
    "Source-locked PSY performance wardrobe with dancers, an original stage, audience response and confetti states; no horse creature.",
  ));
}
