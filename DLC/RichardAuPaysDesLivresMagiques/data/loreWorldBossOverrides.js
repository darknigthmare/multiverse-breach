// Richard au pays des livres magiques — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Richard au pays des livres magiques",
    "richard-au-pays-des-livres-magiques-library-storm-dragon",
    "The Dragon",
    "large",
    "The Pagemaster (1994) - Fantasy kingdom",
    "https://en.wikipedia.org/wiki/The_Pagemaster",
    "The source-locked purple and green fantasy Dragon from The Pagemaster, surrounded by book architecture rather than a storm.",
    [
      phase("book-tower", "Fire breath", "Wing buffet", "Page ignition"),
      phase("library-escape", "Falling books", "Bite lunge", "Collective rescue"),
    ],
  ));
}
