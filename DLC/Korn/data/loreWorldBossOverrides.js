// Korn — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Korn",
    "korn-freak-on-a-leash-core",
    "https://kornofficial.com/",
    "One source-locked lineup and era with instruments, microphone stand, original nu-metal stage and audience layers.",
  ));
}
