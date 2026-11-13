// Half-Life — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Half-Life",
    "half-life-combine-strider-heavy",
    "Nihilanth",
    "stationary",
    "Half-Life (1998) - Xen finale",
    "https://combineoverwiki.net/wiki/Nihilanth",
    "Floating Nihilanth with enormous head, vestigial legs, third arm and healing crystals in Xen; no Combine or Strider hardware.",
    [
      phase("xen-chamber", "Teleport orb", "Energy sphere", "Alien Controller summon"),
      phase("crystal-break", "Healing crystal cycle", "Cranial opening", "Final jump strike"),
    ],
    { renderHeight: 430, footprint: { width: 3, height: 3, placement: "anchored" } },
  ));
}
