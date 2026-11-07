// Splatterhouse — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Splatterhouse",
    "splatterhouse-terror-mask-hell-beast",
    "Hell Chaos",
    "kaiju",
    "Splatterhouse (1988) - Hell Chaos finale",
    "https://splatterhouse.fandom.com/wiki/Hell_Chaos",
    "Hell Chaos as the enormous skeletal demon rising behind the cliff and organic mansion, while the Terror Mask remains Rick's artifact.",
    [
      phase("cliff-emergence", "Giant hand slam", "Rock fall", "Hell breath"),
      phase("house-collapse", "Organic wall pulse", "Ground crush", "Mask-powered finishing strike"),
    ],
  ));
}
