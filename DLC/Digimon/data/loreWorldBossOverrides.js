// Digimon — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Digimon",
    "digimon-apocalymon-void-core",
    "Apocalymon",
    "cosmic",
    "Digimon Adventure (1999) - Dark Area finale",
    "https://digimon.fandom.com/wiki/Apocalymon",
    "Adventure Apocalymon as a dark floating torso above a polyhedral base with long cable-arms and Dark Masters attack manifestations.",
    [
      phase("dark-masters-memory", "Metal claw", "Tentacle lash", "Darkness Zone"),
      phase("total-annihilation", "Cable enclosure", "Self-destruct charge", "Digivice barrier"),
    ],
  ));
}
