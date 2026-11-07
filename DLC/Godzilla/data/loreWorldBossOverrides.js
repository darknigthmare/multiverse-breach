// Godzilla — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Godzilla",
    "godzilla-destoroyah-oxygen-destroyer",
    "Destoroyah",
    "kaiju",
    "Godzilla vs. Destoroyah (1995) - Heisei continuity",
    "https://godzilla.com/blogs/monsterpedia/destoroyah",
    "Heisei Destoroyah with red exoskeleton, wings, horn and pincer tail; Aggregate and Perfect forms remain visibly distinct.",
    [
      phase("aggregate-swarm", "Micro-oxygen burst", "Aggregate rush", "Form merger"),
      phase("perfect-form", "Horn katana", "Aerial assault", "Pincer tail"),
      phase("meltdown-zone", "Military freeze", "Godzilla heat hazard", "Thermal collapse"),
    ],
    { renderHeight: 610, footprint: { width: 4, height: 4, placement: "edge" } },
  ));
}
