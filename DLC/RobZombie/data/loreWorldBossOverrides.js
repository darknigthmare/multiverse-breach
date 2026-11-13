// Rob Zombie — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Rob Zombie",
    "rob-zombie-dragula-stage-machine",
    "https://robzombie.com/",
    "Rob Zombie and band on an original horror-industrial stage with a separate hot-rod show prop, dancers, flames and lighting.",
  ));
}
