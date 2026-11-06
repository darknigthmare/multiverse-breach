// Blackpink — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Blackpink",
    "blackpink-ddu-du-cannon-core",
    "https://www.blackpinkofficial.com/",
    "All four members in one source-locked performance wardrobe, with catwalk, formation markers, dancers and pink-black lighting.",
  ));
}
