// Slender Man — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Slender Man",
    "slender-man-slender-woods-nexus-core",
    "nonCombatFinal",
    "Slender Man - eight-page forest pursuit",
    "Recuperer les huit indices puis atteindre l'extraction en gerant les apparitions, la statique et la perte d'orientation.",
    "Collect all eight clues, then reach extraction while managing appearances, static and loss of orientation.",
    "Slender Man est une menace de poursuite; un Nexus Core physique ou une victoire par DPS n'existe pas dans cette continuite.",
    "Slender Man is a pursuit threat; a physical Nexus Core or DPS victory does not exist in this continuity.",
    ["https://en.wikipedia.org/wiki/Slender_Man"],
    "Layered night forest, fog, eight collection points, static masks and a faceless very tall suited silhouette at several distances.",
  ));
}
