// Die Antwoord — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Die Antwoord",
    "die-antwoord-bassline-freak-core",
    "https://www.dieantwoord.com/",
    "Source-locked duo on an original Zef stage with costumes, dancers and projections as separate layers; no invented creature.",
  ));
}
