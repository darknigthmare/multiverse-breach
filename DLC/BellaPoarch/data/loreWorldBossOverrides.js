// Bella Poarch — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Bella Poarch",
    "bella-poarch-inferno-doll-core",
    "https://www.bellapoarch.com/",
    "Original dark-pop video stage with source-locked performer appearance, dancers and modular props; no hostile doll entity.",
  ));
}
