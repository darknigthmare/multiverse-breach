// From — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "From",
    "from-smiling-night-entity",
    "nonCombatFinal",
    "From - ongoing television continuity through audit date 2026-07-17",
    "Retablir les talismans, proteger Colony House et extraire l'equipe avant la tombee complete de la nuit.",
    "Restore the talismans, protect Colony House and extract the team before full nightfall.",
    "Les creatures souriantes ne forment pas un world boss unique et la serie en cours exige un verrou de saison.",
    "The smiling creatures do not form a single world boss, and the ongoing series requires a season lock.",
    ["https://from.fandom.com/wiki/The_Man_in_Yellow"],
    "From town at dusk with Colony House, talismans, sealed doors, smiling figures and the Man in Yellow as separate distant layers.",
  ));
}
