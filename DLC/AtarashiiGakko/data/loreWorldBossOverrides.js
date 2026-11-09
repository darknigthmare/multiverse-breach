// Atarashii Gakko — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Atarashii Gakko!",
    "atarashii-gakko-discipline-dance-core",
    "https://atarashiigakko.com/",
    "All four members in source-locked uniforms with original synchronized choreography, formation markers and gym-stage layers.",
  ));
}
