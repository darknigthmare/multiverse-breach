// Spy x Family — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Spy x Family",
    "spy-x-family-operation-strix-collapse",
    "Keith Kepler",
    "duelist",
    "Spy x Family anime - Doggy Crisis arc",
    "https://spy-x-family.fandom.com/wiki/Keith_Kepler",
    "Keith Kepler in his anime coat and terrorist gear, with bomb dogs and clock-tower explosives as separate objective assets.",
    [
      phase("berlint-pursuit", "Pistol shot", "Bomb-dog command", "Vehicle escape"),
      phase("clock-tower", "Timed explosives", "Close-range counter", "Bomb disposal opening"),
    ],
  ));
}
