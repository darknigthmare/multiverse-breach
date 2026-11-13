// Alien: Romulus — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Alien: Romulus",
    "alien-romulus-offspring-hybrid",
    "The Offspring",
    "large",
    "Alien: Romulus (2024) - Corbelan finale",
    "https://avp.fandom.com/wiki/Offspring",
    "The very tall pale Offspring with Engineer-like proportions and its own tail and appendages, kept distinct from Resurrection's Newborn.",
    [
      phase("rapid-growth", "Cargo ambush", "Long-limb strike", "Grab"),
      phase("corbelan-hold", "Gravity shift", "Cryofuel hazard", "Cargo decompression"),
    ],
  ));
}
