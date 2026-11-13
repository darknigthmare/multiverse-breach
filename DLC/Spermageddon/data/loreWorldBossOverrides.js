// Spermageddon — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Spermageddon",
    "spermageddon-biology-musical-apocalypse",
    "nonCombatFinal",
    "Spermageddon film - final race",
    "Terminer la course vers l'ovule en evitant les obstacles et les cellules immunitaires, sans combat de world boss.",
    "Finish the race to the ovum while avoiding obstacles and immune cells, without a world-boss fight.",
    "L'univers culmine dans une course corporelle comique; aucune apocalypse biologique personnifiee n'existe.",
    "The universe culminates in a comedic bodily race; no personified biological apocalypse exists.",
    ["https://en.wikipedia.org/wiki/Spermageddon"],
    "Tasteful stylized organic race lanes, non-explicit cartoon competitors, ovum objective and immune-cell hazards on separate layers.",
  ));
}
