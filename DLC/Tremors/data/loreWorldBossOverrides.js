// Tremors — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Tremors",
    "tremors-queen-graboid-tremor",
    "Perfection Graboid Trio",
    "large",
    "Tremors (1990) - Perfection Valley",
    "https://tremors.fandom.com/wiki/Graboid",
    "The three original subterranean Graboids with brown armored hide, beaked jaws and tongue-serpents; no queen anatomy from later films.",
    [
      phase("subterranean-hunt", "Ground breach", "Tongue-serpent grab", "Seismic tracking"),
      phase("cliff-trap", "Rock impact", "False retreat", "Cliffside overrun"),
    ],
    { footprint: { width: 3, height: 2, placement: "edge" } },
  ));
}
