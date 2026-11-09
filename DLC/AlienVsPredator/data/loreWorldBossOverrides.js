// Alien vs Predator — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Alien vs Predator",
    "alien-vs-predator-predalien-prototype",
    "Antarctic Xenomorph Queen",
    "kaiju",
    "Alien vs. Predator (2004) - Bouvet Island pyramid",
    "https://avp.fandom.com/wiki/Queen_%28Antarctica%29",
    "The 2004 Antarctic Queen with broad crest, massive limbs, broken chains and cold vapor, without Predalien traits.",
    [
      phase("pyramid-release", "Chain break", "Tail impale", "Drone reinforcement"),
      phase("surface-ice", "Ice charge", "Crest slam", "Ocean plunge"),
    ],
  ));
}
