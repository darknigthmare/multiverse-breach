// Team Fortress 2 — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Team Fortress 2",
    "team-fortress-2-mann-co-mercenary-stampede",
    "Tank Robot",
    "large",
    "Team Fortress 2 - Mann vs. Machine",
    "https://wiki.teamfortress.com/wiki/Tank_Robot",
    "The Mann vs. Machine bomb-carrying Tank Robot with tracked chassis, bomb cradle and progressive armor damage, not a mercenary giant.",
    [
      phase("bomb-route", "Robot escort wave", "Track crush", "Armor plating"),
      phase("hatch-approach", "Speed increase", "Bomb arming", "Engine weak point"),
    ],
  ));
}
