// Predators — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Predators",
    "predators-berserker-predator",
    "Berserker Predator / Mr. Black",
    "large",
    "Predators (2010) - game preserve planet",
    "https://avp.fandom.com/wiki/Berserker",
    "Mr. Black with bone-like mask, dark skin, Super Predator armor and heavy build; no Feral armor or standard Yautja body.",
    [
      phase("hunting-camp", "Cloak stalk", "Plasma burst", "Wrist-blade combo"),
      phase("super-predator-duel", "Classic Predator execution", "Mask break", "Decapitation tell"),
    ],
  ));
}
