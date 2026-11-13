// Breaking Bad — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Breaking Bad",
    "breaking-bad-heisenberg-empire",
    "Jack Welker",
    "duelist",
    "Breaking Bad - Felina compound finale",
    "https://en.wikipedia.org/wiki/Felina_%28Breaking_Bad%29",
    "Jack Welker in grounded civilian-militia clothing with gang members and compound cover as separate assets; Walter is never the hostile boss.",
    [
      phase("compound-assault", "Gang crossfire", "Cover reposition", "Hostage pressure"),
      phase("m60-trap", "Remote turret hazard", "Clubhouse breach", "Jack confrontation"),
    ],
  ));
}
