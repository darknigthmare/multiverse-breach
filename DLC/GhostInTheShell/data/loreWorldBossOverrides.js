// Ghost in the Shell — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Ghost in the Shell",
    "ghost-in-the-shell-think-tank-tachikoma-core",
    "T08A2 / R3000 Spider Tank",
    "large",
    "Ghost in the Shell (1995 film) - museum battle",
    "https://ghostintheshell.fandom.com/wiki/Ghost_in_the_Shell_%28film%29",
    "The grey multi-legged armored spider tank from the 1995 film, with cannons and optical visor; never the blue rounded Tachikoma design.",
    [
      phase("museum-suppression", "Cannon burst", "Optical tracking", "Crushing step"),
      phase("pillar-break", "Armor rotation", "Pillar destruction", "Cyberbrain access attempt"),
    ],
    { renderHeight: 278 },
  ));
}
