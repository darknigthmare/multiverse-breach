// Metal Gear — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Metal Gear",
    "metal-gear-metal-gear-ray-goliath",
    "Metal Gear RAY Squadron",
    "large",
    "Metal Gear Solid 2 - Arsenal Gear",
    "https://metalgear.fandom.com/wiki/Metal_Gear_RAY",
    "Unmanned MGS2 Metal Gear RAY units with amphibious legs, wings and mouth cannon; no REX parts or invented Goliath variant.",
    [
      phase("ray-wave", "Knee missile", "Water jet", "Stomp"),
      phase("arsenal-endurance", "Leaping swap", "Mouth cannon", "Squadron attrition"),
    ],
    { renderHeight: 330, footprint: { width: 2, height: 3, placement: "edge" } },
  ));
}
