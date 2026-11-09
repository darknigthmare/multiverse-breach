// Chicken Run — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Chicken Run",
    "chicken-run-pie-machine-grinder",
    "Mrs Tweedy and the Pie Machine",
    "stationary",
    "Chicken Run (2000) - Tweedy farm escape",
    "https://www.aardman.com/film-tv-games/chicken-run/",
    "Mrs Tweedy in her first-film clothing remains a separate human threat while the conveyor, rollers and oven form the fixed arena hazard.",
    [
      phase("pie-machine", "Conveyor acceleration", "Roller crush", "Oven cycle"),
      phase("farm-escape", "Mrs Tweedy axe pursuit", "Machine sabotage", "Aircraft takeoff"),
    ],
    { renderHeight: 284, footprint: { width: 3, height: 2, placement: "anchored" } },
  ));
}
