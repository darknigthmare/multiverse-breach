// Stargate Atlantis — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Stargate Atlantis",
    "stargate-atlantis-wraith-hive-ship",
    "Wraith Hive Ship",
    "capitalShip",
    "Stargate Atlantis - Wraith war",
    "https://www.gateworld.net/wiki/Wraith_hive_ship",
    "Dark organic Wraith hive ship with ribbed hull, dart bays, weapons and regenerating damage zones; Atlantis remains in the background.",
    [
      phase("atlantis-orbit", "Dart launch", "Energy cannon", "Organic regeneration"),
      phase("hive-infiltration", "Bay sabotage", "Reactor breach", "Puddle Jumper escape"),
    ],
  ));
}
