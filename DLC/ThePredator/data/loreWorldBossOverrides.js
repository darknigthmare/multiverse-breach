// The Predator — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "The Predator",
    "the-predator-ultimate-predator",
    "Assassin Predator / Upgrade Predator",
    "large",
    "The Predator (2018) - Project Stargazer",
    "https://avp.fandom.com/wiki/Assassin_Predator",
    "The towering genetically upgraded 2018 Assassin Predator with dark skin, minimal armor and biological camouflage.",
    [
      phase("stargazer-lab", "Biological cloak", "Heavy charge", "Organic cannon"),
      phase("forest-hunt", "Regeneration", "Fugitive Predator execution", "Extraction denial"),
    ],
    { renderHeight: 310 },
  ));
}
