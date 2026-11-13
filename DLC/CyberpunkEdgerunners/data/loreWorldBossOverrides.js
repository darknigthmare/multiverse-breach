// Cyberpunk: Edgerunners — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Cyberpunk: Edgerunners",
    "cyberpunk-edgerunners-adam-smasher-full-borg",
    "Adam Smasher Full Borg",
    "large",
    "Cyberpunk: Edgerunners - Arasaka Tower finale",
    "https://cyberpunk.fandom.com/wiki/Adam_Smasher",
    "The Edgerunners full-borg Adam Smasher with massive black-grey chassis, red optics, missiles and source-locked anime proportions.",
    [
      phase("arasaka-floor", "Sandevistan rush", "Missile pod", "Heavy cannon"),
      phase("armor-break", "Borg charge", "Limb armor destruction", "Close execution"),
    ],
  ));
}
