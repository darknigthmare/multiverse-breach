// Voyage de Chihiro — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Voyage de Chihiro", [
    candidate(
      RIFT_DRONE,
      "Paper Bird",
      "Folded paper edges",
      "swarm cut",
      "Shikigami de papier qui attaque en nuee en utilisant ses plis comme des ailes tranchantes.",
      "A paper shikigami that attacks in a flock, using its folds as cutting wings.",
      "https://ghibli.fandom.com/wiki/Paper_Bird",
      "Flat white paper shikigami folded into angular bird forms, black ink markings, no organic feathers or metal parts.",
    ),
  ]));
}
