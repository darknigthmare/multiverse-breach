// Flashback — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Flashback",
    "flashback-morph-infiltration-core",
    "Master Brain",
    "stationary",
    "Flashback (1992) - Morph planet finale",
    "https://flashback.fandom.com/wiki/Master_Brain",
    "The Morph Master Brain as the fixed organic command intelligence at the core of the alien planet, with lifts and energy conduits separated.",
    [
      phase("morph-control", "Telepathic pulse", "Morph guard summon", "Energy beam"),
      phase("planet-core", "Conduit overload", "Lift lockdown", "Core detonation"),
    ],
  ));
}
