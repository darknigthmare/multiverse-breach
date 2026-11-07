// Aliens — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Aliens",
    "aliens-alien-queen",
    "Alien Queen",
    "kaiju",
    "Aliens (1986) - LV-426 Queen",
    "https://avp.fandom.com/wiki/Queen_%28LV-426%29",
    "The LV-426 Queen with broad crest, six limbs, long segmented tail and acid saliva; the power loader and airlock are separate arena assets.",
    [
      phase("landing-bay", "Tail impale", "Inner-jaw strike", "Egg reinforcement"),
      phase("power-loader-duel", "Loader grapple", "Airlock pressure", "Vacuum ejection"),
    ],
    { renderHeight: 440, footprint: { width: 3, height: 3, placement: "edge" } },
  ));
}
