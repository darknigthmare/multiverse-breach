// Black Eyed Peas — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Black Eyed Peas",
    "black-eyed-peas-i-gotta-feeling-party-core",
    "https://www.blackeyedpeas.com/",
    "One explicitly selected lineup and era on an original festival stage with microphones, DJ or instruments and crowd layers.",
  ));
}
