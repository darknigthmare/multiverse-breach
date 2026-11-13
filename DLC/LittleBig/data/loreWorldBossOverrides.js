// Little Big — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Little Big",
    "little-big-generation-cancellation-broadcast",
    "https://littlebig.band/",
    "One source-locked lineup on an original satirical pop set with documented costume cues and modular visual-gag props.",
  ));
}
