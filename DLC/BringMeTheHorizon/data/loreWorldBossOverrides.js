// Bring Me the Horizon — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Bring Me the Horizon",
    "bring-me-the-horizon-sempiternal-hex-core",
    "https://www.bmthofficial.com/",
    "Source-locked era and lineup on an original festival stage with vocals, guitars, synths and crowd-control states.",
  ));
}
