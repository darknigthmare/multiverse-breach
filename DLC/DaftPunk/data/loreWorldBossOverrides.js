// Daft Punk — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Daft Punk",
    "daft-punk-derezzed-pyramid-core",
    "https://www.daftpunk.com/",
    "The helmeted duo at an original Alive-inspired pyramid console with amber-cyan beams and audience layers; the pyramid is never hostile.",
  ));
}
