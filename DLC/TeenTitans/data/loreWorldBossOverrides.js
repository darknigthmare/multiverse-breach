// Teen Titans — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Teen Titans",
    "teen-titans-trigon-demon-father",
    "Trigon",
    "cosmic",
    "Teen Titans animated series - The End",
    "https://teentitans.fandom.com/wiki/Trigon",
    "City-scale red Trigon with four eyes, horns and dark armor above petrified Jump City; any humanoid avatar is a separate phase asset.",
    [
      phase("petrified-city", "Eye beams", "Demonic magic", "Titan shadow clones"),
      phase("raven-seal", "Portal collapse", "Soul manipulation", "Azarath binding"),
    ],
    { renderHeight: 650, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ));
}
