// Chainsaw Man — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Chainsaw Man",
    "chainsaw-man-gun-devil-catastrophe",
    "Gun Devil - 20 Percent Manifestation",
    "kaiju",
    "Chainsaw Man manga - Gun Devil incident",
    "https://chainsaw-man.fandom.com/wiki/Gun_Devil",
    "The documented 20 percent Gun Devil with firearm-covered skeletal anatomy moving at catastrophic speed across a layered city.",
    [
      phase("high-speed-transit", "Long-range gunstorm", "Building-line sweep", "Target list"),
      phase("makima-confrontation", "Devil contract barrage", "Massive recoil", "Manifestation collapse"),
    ],
    { renderHeight: 590, footprint: { width: 0, height: 0, placement: "edge" } },
  ));
}
