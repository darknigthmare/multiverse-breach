// Left 4 Dead — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Left 4 Dead",
    "left-4-dead-tank-witch-crescendo",
    "Tank",
    "large",
    "Left 4 Dead - evacuation finale ruleset",
    "https://left4dead.fandom.com/wiki/The_Tank",
    "Canonical Tank with massively overgrown upper body and torn civilian clothing; Witch remains a separate avoidable hazard.",
    [
      phase("crescendo-horde", "Concrete throw", "Heavy punch", "Car swat"),
      phase("rescue-arrival", "Faster pursuit", "Ledge knockback", "Evacuation denial"),
    ],
  ));
}
