// One Punch Man — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "One Punch Man",
    "one-punch-man-boros-meteoric-burst",
    "Boros",
    "large",
    "One-Punch Man season 1 - Dark Matter Thieves finale",
    "https://onepunchman.fandom.com/wiki/Boros",
    "Cyclopean Boros in sealed armor, released form and Meteoric Burst, with all three silhouettes kept coherent and distinct.",
    [
      phase("sealed-armor", "Armored rush", "Energy strike", "Armor shatter"),
      phase("released-form", "Regeneration", "Moon kick", "Meteoric Burst"),
      phase("roaring-cannon", "Planetary beam", "Serious Punch counter", "Energy fade"),
    ],
  ));
}
