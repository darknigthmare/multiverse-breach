// Metal Gear Rising — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Metal Gear Rising",
    "metal-gear-rising-senator-armstrong-nanomachine-core",
    "Senator Steven Armstrong",
    "large",
    "Metal Gear Rising: Revengeance - Excelsus finale",
    "https://metalgear.fandom.com/wiki/Steven_Armstrong",
    "Armstrong in torn senator clothing with nanomachine-hardened skin and red energy seams, never a separate nanomachine core.",
    [
      phase("excelsus-wreck", "Nanomachine punch", "Ground fissure", "Metal throw"),
      phase("crater-duel", "Lava eruption", "Healing absorption", "Blade-mode finish"),
    ],
    { renderHeight: 214, footprint: { width: 1, height: 1, placement: "grid" } },
  ));
}
