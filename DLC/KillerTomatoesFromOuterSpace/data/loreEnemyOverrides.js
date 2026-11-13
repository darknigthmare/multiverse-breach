// Killer Tomatoes from Outer Space — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Killer Tomatoes from Outer Space", [
    candidate(
      RIFT_DRONE,
      "Killer Tomato",
      "Rolling body",
      "rolling body slam",
      "Tomate tueuse qui roule, bondit et percute ses victimes sans membres humanoides.",
      "A killer tomato that rolls, lunges and slams into victims without humanoid limbs.",
      "https://killertomatoes.fandom.com/wiki/Killer_Tomato",
      "Real red tomato body with green calyx; no humanoid limbs; rolls and lunges as in the selected screen version.",
    ),
    candidate(
      BREACH_STALKER,
      "Piranha Killer Tomato",
      "Piranha jaws",
      "jaw bite",
      "Variante piranha de la tomate tueuse dont la gueule dentee constitue l'attaque principale.",
      "A piranha variant of the killer tomato whose toothed maw is its primary attack.",
      "https://killertomatoes.fandom.com/wiki/Killer_Tomato",
      "Red tomato fused with a piranha mouth; exposed triangular teeth; animated-series proportions only.",
    ),
  ]));
}
