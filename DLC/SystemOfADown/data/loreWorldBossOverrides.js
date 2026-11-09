// System of a Down — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "System of a Down",
    "system-of-a-down-toxicity-riot-core",
    "https://systemofadown.com/",
    "Serj, Daron, Shavo and John on a compact stage, source-locked to one era, with separate instruments, crowd and rhythmic effects.",
  ));
}
