// Cool Spot — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Cool Spot",
    "cool-spot-bottle-cap-brand-storm",
    "nonCombatFinal",
    "Cool Spot - 16-bit platform-game continuity",
    "Liberer les Spots emprisonnes et atteindre la sortie de bouteille avant la fin du temps.",
    "Free the imprisoned Spots and reach the bottle exit before time runs out.",
    "Le jeu n'a pas de world boss iconique stable et Brand Storm est une extrapolation.",
    "The game has no stable iconic world boss, and Brand Storm is an extrapolation.",
    ["https://en.wikipedia.org/wiki/Cool_Spot"],
    "Original 16-bit-inspired miniature platform kit with cages, bubbles and bottle-scale scenery; omit brand logos and any giant hostile cap.",
  ));
}
