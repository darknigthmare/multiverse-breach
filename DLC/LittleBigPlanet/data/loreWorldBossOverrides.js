// LittleBigPlanet — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "LittleBigPlanet",
    "littlebigplanet-negativitron-stitch-storm",
    "The Negativitron",
    "stationary",
    "LittleBigPlanet 2 - Cosmos finale",
    "https://littlebigplanet.fandom.com/wiki/Negativitron",
    "The black cosmic vacuum entity with luminous mouth and eye, built from layered craft materials and grapple points.",
    [
      phase("cosmos-vacuum", "Debris suction", "Laser sweep", "Negativitron Troops"),
      phase("core-launch", "Grapple point cycle", "Weak-point exposure", "Core impact"),
    ],
    { renderHeight: 390, footprint: { width: 3, height: 3, placement: "edge" } },
  ));
}
