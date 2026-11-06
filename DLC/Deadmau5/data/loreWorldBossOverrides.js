// Deadmau5 — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Deadmau5",
    "deadmau5-ghosts-n-stuff-signal-core",
    "https://deadmau5.com/",
    "Source-locked mau5 helmet and an original cube-DJ stage with abstract mappings, beams and crowd states; no hostile signal.",
  ));
}
