// Guns N Roses — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Guns N' Roses",
    "guns-n-roses-appetite-feedback-serpent",
    "https://www.gunsnroses.com/",
    "Explicitly selected band era on an original stadium stage with instruments, solo positions and crowd layers; no serpent monster.",
  ));
}
