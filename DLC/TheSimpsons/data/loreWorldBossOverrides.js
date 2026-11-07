// The Simpsons — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "The Simpsons",
    "the-simpsons-mr-burns-reactor-scheme",
    "nonCombatFinal",
    "The Simpsons - Springfield nuclear plant objective route",
    "Schema du reacteur de M. Burns.",
    "Mr Burns Reactor Scheme.",
    "Un plan de Mr Burns n'est pas une entite combattante et l'univers n'a pas un final unique.",
    "A Mr Burns scheme is not a combat entity, and the universe has no single finale.",
    ["https://simpsons.fandom.com/wiki/Charles_Montgomery_Burns"],
    "Springfield plant with Burns and Smithers as portraits or actors, control rods, consoles, doors and reactor states.",
  ));
}
