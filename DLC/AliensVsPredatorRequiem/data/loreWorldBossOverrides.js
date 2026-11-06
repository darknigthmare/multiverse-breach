// Aliens vs Predator: Requiem — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Aliens vs Predator: Requiem",
    "aliens-vs-predator-requiem-predalien-queen",
    "Predalien",
    "large",
    "Aliens vs. Predator: Requiem (2007) - Gunnison",
    "https://avp.fandom.com/wiki/Predalien_%28Earth%29",
    "The Earth Predalien with Yautja mandibles, dreadlocks, hybrid crest and brown-black body; not a giant Xenomorph Queen.",
    [
      phase("hospital-hunt", "Direct implantation", "Inner-jaw strike", "Tail impale"),
      phase("rooftop-duel", "Wolf grapple", "Crest ram", "Nuclear evacuation countdown"),
    ],
  ));
}
