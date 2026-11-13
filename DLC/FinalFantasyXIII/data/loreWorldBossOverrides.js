// Final Fantasy XIII — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Final Fantasy XIII",
    "final-fantasy-xiii-orphan-cradle-core",
    "Orphan",
    "stationary",
    "Final Fantasy XIII - Orphan's Cradle",
    "https://finalfantasy.fandom.com/wiki/Orphan",
    "Orphan's two canonical forms with ring structures and suspended body integrated into Orphan's Cradle, not a generic core.",
    [
      phase("falcie-form", "Merciless Judgment", "Progenitorial Wrath", "Status inversion"),
      phase("wheel-form", "Doom pressure", "Opposite polarities", "Stagger opening"),
    ],
    { renderHeight: 390, footprint: { width: 3, height: 2, placement: "anchored" } },
  ));
}
