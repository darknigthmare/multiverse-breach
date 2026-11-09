// Alien Resurrection — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Alien Resurrection",
    "alien-resurrection-newborn-hybrid",
    "The Newborn",
    "large",
    "Alien Resurrection (1997) - USM Auriga",
    "https://avp.fandom.com/wiki/Newborn",
    "The pale Newborn with humanoid face, dark eye sockets, long limbs and short tail; no Queen crest or Offspring anatomy.",
    [
      phase("auriga-hunt", "Heavy grab", "Body slam", "Ripley fixation"),
      phase("betty-airlock", "Window impact", "Vacuum breach", "Decompression defeat"),
    ],
  ));
}
