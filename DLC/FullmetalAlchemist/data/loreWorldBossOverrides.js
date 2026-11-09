// Fullmetal Alchemist — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Fullmetal Alchemist",
    "fullmetal-alchemist-father-beyond-the-gate",
    "Father",
    "cosmic",
    "Fullmetal Alchemist: Brotherhood - Promised Day",
    "https://fma.fandom.com/wiki/Father",
    "Father transitions from his white human vessel to the black solar manifestation after absorbing God; the nationwide circle stays environmental.",
    [
      phase("promised-day", "Motionless alchemy", "Philosopher's Stone shield", "God absorption"),
      phase("solar-vessel", "Miniature sun", "Energy barrage", "Stone depletion"),
      phase("final-fists", "Human-scale collapse", "Counter transmutation", "Gate return"),
    ],
    { renderHeight: 600, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ));
}
