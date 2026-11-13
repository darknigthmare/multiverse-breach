// Attack on Titan — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Attack on Titan",
    "attack-on-titan-colossal-titan",
    "Eren's Founding Titan",
    "kaiju",
    "Attack on Titan manga/anime finale - The Rumbling",
    "https://attackontitan.fandom.com/wiki/Founding_Titan",
    "Eren's horizon-sized skeletal Founding Titan with suspended head, vast rib cage and layered marching Colossal Titans.",
    [
      phase("rumbling-advance", "Heat wave", "Colossal lane", "War Hammer spike"),
      phase("spine-assault", "Ancient Titan summons", "Head separation objective", "Steam collapse"),
    ],
    { renderHeight: 680, anchor: { x: 0.58, y: 0.53 }, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ));
}
