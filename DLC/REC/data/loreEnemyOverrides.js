// REC — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("REC", [
    candidate(
      RIFT_DRONE,
      "Infected",
      "Hands and teeth",
      "rush, grab and bite",
      "Habitant infecte de l'immeuble place en quarantaine, pris de mouvements rapides et rabiques.",
      "An infected resident of the quarantined apartment building, driven by fast rabid movements.",
      "https://horror.fandom.com/wiki/REC_%282007%29",
      "Human victim with ordinary apartment clothing, pale skin, blood around eyes/mouth and violent rabid movement; no zombie decay not shown in REC.",
    ),
  ]));
}
