// Dino Crisis — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Dino Crisis",
    "dino-crisis-third-energy-tyrant-rex",
    "Tyrannosaurus rex",
    "large",
    "Dino Crisis (1999) - Ibis Island",
    "https://dinocrisis.fandom.com/wiki/Tyrannosaurus_rex",
    "The scarred source-locked Dino Crisis 1 T. rex with natural anatomy; Third Energy remains a stage effect rather than an aura.",
    [
      phase("helipad", "Bite lunge", "Fence break", "Heavy charge"),
      phase("river-pursuit", "Boat ram", "Jaw grab", "Energy-launcher escape"),
    ],
    { renderHeight: 360, footprint: { width: 3, height: 2, placement: "edge" } },
  ));
}
