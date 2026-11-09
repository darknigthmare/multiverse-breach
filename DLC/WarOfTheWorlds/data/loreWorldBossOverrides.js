// War of the Worlds — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "War of the Worlds",
    "war-of-the-worlds-martian-tripod-harvester",
    "Fighting Machine / Tripod",
    "kaiju",
    "War of the Worlds (2005) - Spielberg film continuity",
    "https://war-of-the-worlds.fandom.com/wiki/Fighting_Machine_%282005_film%29",
    "The 2005 hooded Fighting Machine on three extremely long legs, with heat ray, capture tentacles, cages and shield states.",
    [
      phase("shielded-harvest", "Heat ray", "Capture tentacle", "Tripod step"),
      phase("biological-failure", "Shield loss", "Bird tell", "Military finishing strike"),
    ],
    { renderHeight: 620, footprint: { width: 3, height: 3, placement: "edge" } },
  ));
}
