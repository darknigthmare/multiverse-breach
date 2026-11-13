// Unreal — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Unreal",
    "unreal-skaarj-warlord-overlord",
    "Skaarj Warlord",
    "large",
    "Unreal (1998) - Skaarj mothership",
    "https://unreal.fandom.com/wiki/Skaarj_Warlord",
    "The Unreal 1998 Skaarj Warlord with source-locked scaled skin, armor and wing-like appendages; no Unreal Tournament equipment.",
    [
      phase("mothership-hall", "Short flight", "Energy volley", "Claw charge"),
      phase("warlord-fall", "Skaarj reinforcement", "Platform sweep", "Falling defeat"),
    ],
  ));
}
