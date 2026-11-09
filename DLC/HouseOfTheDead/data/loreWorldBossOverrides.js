// House of the Dead — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "House of the Dead",
    "house-of-the-dead-magician-type-0",
    "Magician Type-0",
    "large",
    "The House of the Dead (1997) - Curien Mansion incident",
    "https://thehouseofthedead.fandom.com/wiki/Magician",
    "Exact original Magician Type-0: tall black biomechanical humanoid, exposed red-orange muscle seams, long clawed hands and feet, narrow horned head and no wings, robe, armor or magician clothing.",
    [
      phase("curien-laboratory", "Fireball volley", "Teleport dash", "Claw pass"),
      phase("type-zero-overload", "Rapid fire orbit", "Weak-point exposure", "Laboratory collapse"),
    ],
    { renderHeight: 270, anchor: { x: 0.79, y: 0.74 } },
  ));
}
