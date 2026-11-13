// House of the Dead 3 — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "House of the Dead 3",
    "house-of-the-dead-3-wheel-of-fate",
    "Wheel of Fate",
    "large",
    "The House of the Dead III (2002) - EFI Research Facility",
    "https://thehouseofthedead.fandom.com/wiki/Wheel_of_Fate",
    "Exact arcade and Xbox Wheel of Fate: towering silver metallic humanoid resurrection body, circular fate mechanism and sun-mark chest weak point, with no medieval wheel, vehicle parts or generic robot armor.",
    [
      phase("fate-symbol-cycle", "Electric sphere", "Metallic charge", "Wheel-selected pattern"),
      phase("curien-resurrection", "Lightning barrage", "Chest weak-point exposure", "BioReactor overload"),
    ],
    { renderHeight: 304, anchor: { x: 0.78, y: 0.73 } },
  ));
}
