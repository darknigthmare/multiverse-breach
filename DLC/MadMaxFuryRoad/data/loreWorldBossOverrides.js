// Mad Max: Fury Road — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Mad Max: Fury Road",
    "mad-max-the-gigahorse-interceptor-rig",
    "The Gigahorse",
    "large",
    "Mad Max: Fury Road (2015) - Citadel pursuit",
    "https://madmax.fandom.com/wiki/The_Gigahorse",
    "Immortan Joe's twin-bodied chrome Cadillac with stacked V8 engines and giant wheels; no Interceptor or War Rig parts.",
    [
      phase("convoy-charge", "Ramming line", "War Boy boarding", "Harpoon volley"),
      phase("gigahorse-boarded", "Tire weak points", "Engine fire", "Convoy separation"),
    ],
    { renderHeight: 244, footprint: { width: 2, height: 3, placement: "edge" } },
  ));
}
