// Aural Vampire — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Aural Vampire",
    "aural-vampire-zombie-naocchatte-procession",
    "https://www.auralvampire.com/",
    "Official-site source-locked members and costumes on an original darkwave club stage with synths and lighting; Naocchatte remains non-hostile.",
  ));
}
