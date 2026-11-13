// Skyline — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Skyline",
    "skyline-alien-harvest-mothership",
    "Harvest Mothership",
    "capitalShip",
    "Skyline trilogy - Los Angeles harvest continuity",
    "https://skyline.fandom.com/wiki/Mothership",
    "Blue-black biomechanical mothership above Los Angeles with hypnotic light, tentacles, bays and a separate brain chamber.",
    [
      phase("blue-light", "Hypnotic pulse", "Abduction beam", "Drone launch"),
      phase("mothership-entry", "Tentacle corridor", "Brain-room defense", "Core escape"),
    ],
  ));
}
