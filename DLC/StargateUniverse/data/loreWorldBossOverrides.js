// Stargate Universe — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Stargate Universe",
    "stargate-universe-destiny-control-lockout",
    "Drone Command Ship",
    "capitalShip",
    "Stargate Universe season 2 - Berzerker drone conflict",
    "https://www.gateworld.net/wiki/Drone_command_ship",
    "The automated command vessel and separate Berzerker drone swarm from Stargate Universe; Destiny remains the allied ship.",
    [
      phase("drone-network", "Drone swarm", "Subspace coordination", "Shuttle interception"),
      phase("command-link-break", "Signal jamming", "Hull hardpoints", "FTL escape window"),
    ],
  ));
}
