// Parasyte — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Parasyte",
    "parasyte-gotou-five-parasite-body",
    "Gotou",
    "large",
    "Parasyte manga/anime - Gotou forest confrontation",
    "https://parasyte.fandom.com/wiki/Gotou",
    "Muscular humanoid Gotou whose head and limbs reconfigure into blades and shields while preserving the five-parasite anatomy.",
    [
      phase("five-parasite-body", "Blade morph", "Organic shield", "High-speed charge"),
      phase("waste-site", "Internal weak point", "Toxic debris", "Parasite desynchronization"),
    ],
  ));
}
