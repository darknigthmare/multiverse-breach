// Final Fantasy VIII — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Final Fantasy VIII",
    "final-fantasy-viii-ultimecia-junction-core",
    "Ultimecia",
    "cosmic",
    "Final Fantasy VIII - Ultimecia Castle finale",
    "https://finalfantasy.fandom.com/wiki/Ultimecia",
    "Ultimecia, Griever, junctioned Ultimecia-Griever and the final time-compression form as four distinct canonical phase layers.",
    [
      phase("sorceress", "Maelstrom", "Dispel", "Knight summon"),
      phase("griever", "Shockwave Pulsar", "Draw magic", "Helix destruction"),
      phase("junctioned-form", "Great Attractor", "Apocalypse", "Time compression"),
      phase("final-form", "Hell's Judgment", "Ultima", "Reality fade"),
    ],
  ));
}
