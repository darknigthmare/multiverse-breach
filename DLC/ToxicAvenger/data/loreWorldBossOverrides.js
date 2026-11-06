// Toxic Avenger — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Toxic Avenger",
    "toxic-avenger-toxic-waste-overlord",
    "Mayor Peter Belgoody",
    "duelist",
    "The Toxic Avenger (1984) - Tromaville finale",
    "https://toxicavenger.fandom.com/wiki/Peter_Belgoody",
    "Mayor Belgoody in his film suit with Cigar Face and Tromaville thugs as separate grounded reinforcements; no toxic mutant overlord.",
    [
      phase("city-hall-gang", "Thug command", "Handgun threat", "Hostage pressure"),
      phase("tromaville-exposure", "Cigar Face reinforcement", "Hazardous barrel spill", "Public exposure"),
    ],
  ));
}
