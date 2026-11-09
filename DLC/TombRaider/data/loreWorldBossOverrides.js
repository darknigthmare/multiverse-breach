// Tomb Raider — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Tomb Raider",
    "tomb-raider-atlantean-scion-guardian",
    "Jacqueline Natla",
    "large",
    "Tomb Raider (1996) - Great Pyramid",
    "https://tombraider.fandom.com/wiki/Jacqueline_Natla",
    "Jacqueline Natla in business form and her winged Atlantean mutation, matching the original game continuity and Scion-era palette.",
    [
      phase("natla-firearms", "Pistol burst", "Scion energy", "Platform reposition"),
      phase("atlantean-form", "Wing dive", "Fireball", "Lava knockback"),
    ],
  ));
}
