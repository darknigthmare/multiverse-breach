// Elfen Lied — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Elfen Lied",
    "elfen-lied-lucy-vector-catastrophe",
    "Mariko Kurama",
    "duelist",
    "Elfen Lied manga/anime - Mariko confrontation",
    "https://elfenlied.fandom.com/wiki/Mariko",
    "Mariko in her canonical restraint clothing with invisible vectors shown only as translucent telegraphs; Lucy remains a protagonist route.",
    [
      phase("vector-zone", "Invisible vector strike", "Projectile deflection", "Mobility restraint"),
      phase("bridge-confrontation", "Long-range vectors", "Bomb restraint", "Kurama intervention"),
    ],
  ));
}
