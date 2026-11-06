// Solo Leveling — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Solo Leveling",
    "solo-leveling-antares-monarch-of-destruction",
    "Antares",
    "kaiju",
    "Solo Leveling manhwa - Monarchs War finale",
    "https://solo-leveling.fandom.com/wiki/Antares",
    "Antares as a red-haired armored Monarch and then a colossal red-black Dragon Emperor, produced as linked but separate forms.",
    [
      phase("monarch-duel", "Sword pressure", "Fear aura", "Dragon army"),
      phase("dragon-emperor", "Breath of Destruction", "Wing shockwave", "Aerial pursuit"),
      phase("rulers-arrive", "Dimensional gate", "Shadow counter", "Rulers' intervention"),
    ],
    { renderHeight: 620, footprint: { width: 4, height: 4, placement: "edge" } },
  ));
}
