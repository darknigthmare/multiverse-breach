// Predator 2 — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Predator 2",
    "predator-2-city-hunter",
    "City Hunter",
    "duelist",
    "Predator 2 (1990) - Los Angeles 1997",
    "https://avp.fandom.com/wiki/City_Hunter",
    "City Hunter with his urban armor, biomask, netgun, smart disc and combistick; no Jungle Hunter or Feral equipment.",
    [
      phase("slaughterhouse", "Cloak ambush", "Plasma caster", "Netgun"),
      phase("rooftop-ship", "Smart disc", "Combistick duel", "Unmasked finish"),
    ],
  ));
}
