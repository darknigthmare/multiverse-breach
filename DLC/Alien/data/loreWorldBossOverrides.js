// Alien — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Alien (1979)",
    "alien-predalien-monstrosity",
    "Kane's Son / Big Chap",
    "large",
    "Alien (1979) - Nostromo theatrical continuity",
    "https://avp.fandom.com/wiki/Kane%27s_Son",
    "Big Chap with a smooth translucent dome, long biomechanical limbs, segmented tail and the 1979 Nostromo proportions.",
    [
      phase("nostromo-hunt", "Ceiling ambush", "Inner-jaw grab", "Vent reposition"),
      phase("narcissus-airlock", "Harpoon restraint", "Vacuum recoil", "Engine exhaust defeat"),
    ],
    { renderHeight: 226, anchor: { x: 0.81, y: 0.76 } },
  ));
}
