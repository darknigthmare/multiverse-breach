// Dragon Ball Z — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Dragon Ball Z",
    "dragon-ball-z-majin-buu-planetary-crisis",
    "Kid Buu",
    "duelist",
    "Dragon Ball Z - Kid Buu saga",
    "https://dragonball.fandom.com/wiki/Kid_Buu",
    "Kid Buu with pink elastic body, head antenna and white trousers; no Super Buu absorptions or mismatched body forms.",
    [
      phase("sacred-world", "Elastic combo", "Teleport strike", "Regeneration"),
      phase("planet-burst", "Planet Burst charge", "Clone pressure", "Instant movement"),
      phase("spirit-bomb", "Energy contest", "Wish restoration", "Spirit Bomb finish"),
    ],
  ));
}
