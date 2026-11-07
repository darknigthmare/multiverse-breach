// Twisted Metal — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Twisted Metal",
    "twisted-metal-sweet-tooth-war-rig",
    "Minion",
    "large",
    "Twisted Metal (1995) - Minion vehicle finale",
    "https://twistedmetal.fandom.com/wiki/Minion",
    "The heavy demonic armored Minion combat vehicle from the original Twisted Metal, viewed from a gameplay-correct rear three-quarter arena angle.",
    [
      phase("arena-pursuit", "Heavy cannon", "Missile salvo", "Ram"),
      phase("armor-break", "Mine trail", "Flame burst", "Engine exposure"),
    ],
    { renderHeight: 220, footprint: { width: 2, height: 2, placement: "grid" } },
  ));
}
