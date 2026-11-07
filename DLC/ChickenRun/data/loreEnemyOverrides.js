// Chicken Run — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Chicken Run", [
    candidate(
      RIFT_DRONE,
      "Guard Dog",
      "Jaws",
      "charge and bite",
      "Chien de garde de la ferme Tweedy chargeant les poules et les intrus pour les saisir.",
      "A Tweedy farm guard dog that charges chickens and intruders before biting them.",
      "https://chickenrun.fandom.com/wiki/Guard_Dogs",
      "Large farm guard dog with collar, heavy muzzle and four-legged running silhouette; no armor or fantasy gear.",
    ),
  ]));
}
