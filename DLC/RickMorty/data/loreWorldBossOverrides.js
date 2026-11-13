// Rick & Morty — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Rick & Morty",
    "rick-morty-federal-prison-ai-core",
    "Rick Prime",
    "duelist",
    "Rick and Morty season 7 - Unmortricken",
    "https://rickandmorty.fandom.com/wiki/Rick_Prime",
    "Rick Prime clearly distinct from Rick C-137, with canonical coat, implants, decoys and green portals; Omega Device remains a separate prop.",
    [
      phase("black-box-maze", "Hologram decoy", "Portal feint", "Gadget barrage"),
      phase("omega-device", "Backup body", "Close-quarters counter", "Device shutdown"),
    ],
  ));
}
