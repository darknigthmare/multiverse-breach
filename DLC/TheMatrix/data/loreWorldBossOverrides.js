// The Matrix — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "The Matrix",
    "the-matrix-deus-ex-machina-source-core",
    "Agent Smith / Super Smith",
    "duelist",
    "The Matrix Revolutions (2003) - Super Burly Brawl",
    "https://matrix.fandom.com/wiki/Agent_Smith",
    "Super Smith in black suit, dark tie and sunglasses, soaked by rain with restrained electrical aura and no machine cables.",
    [
      phase("street-duel", "Aerial rush", "Heavy punch", "Facade impact"),
      phase("crater-finale", "Shockwave clash", "Clone pressure", "Voluntary assimilation"),
    ],
    { renderHeight: 188, anchor: { x: 0.79, y: 0.74 } },
  ));
}
