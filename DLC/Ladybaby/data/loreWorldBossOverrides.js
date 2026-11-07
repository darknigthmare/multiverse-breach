// Ladybaby — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Ladybaby",
    "ladybaby-cute-riot-feedback",
    "https://en.wikipedia.org/wiki/Ladybaby",
    "One explicitly locked lineup and period with referenced costumes, original choreography, instruments and kawaii-metal stage layers.",
  ));
}
