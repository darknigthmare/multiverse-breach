// Dead Space — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Dead Space",
    "dead-space-giant-hive-mind-leviathan",
    "Brethren Moon",
    "cosmic",
    "Dead Space 3 - Tau Volantis convergence",
    "https://deadspace.fandom.com/wiki/Brethren_Moons",
    "A moon-sized organic Necromorph with eyes and planetary tentacles, shown across orbit, atmosphere and Marker-linked weak zones.",
    [
      phase("convergence", "Necromorph rain", "Marker pulse", "Planetary tentacle"),
      phase("orbital-escape", "Link-node rupture", "Atmosphere collapse", "Absorption countdown"),
    ],
  ));
}
