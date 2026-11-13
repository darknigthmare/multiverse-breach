// H2G2 — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("H2G2", [
    candidate(
      RIFT_DRONE,
      "Vogon Guard",
      "Standard energy weapon",
      "blaster shot",
      "Garde Vogon lourdement equipe charge de faire appliquer les ordres bureaucratiques par la force.",
      "A heavily equipped Vogon guard who enforces bureaucratic orders with an energy weapon.",
      "https://hitchhikers.fandom.com/wiki/Vogon",
      "Bulky Vogon in severe bureaucratic military uniform, heavy boots and standard energy weapon; use adaptation-specific skin and costume.",
    ),
    candidate(
      BREACH_STALKER,
      "Krikkit War Robot",
      "Cricket-themed war weapon",
      "robot weapon strike",
      "Machine de guerre de Krikkit utilisant un armement inspire du cricket pour combattre a courte et longue portee.",
      "A Krikkit war machine using cricket-themed weaponry at both close and ranged distance.",
      "https://hitchhikers.fandom.com/wiki/Krikkit_robot",
      "White Krikkit war machine with hard geometric armor and cricket-themed weapon silhouette from the referenced adaptation.",
    ),
    candidate(
      ANOMALY_PACK,
      "Ravenous Bugblatter Beast of Traal",
      "Jaws and claws",
      "maul and bite",
      "Predateur geant de Traal qui renverse puis devore tout voyageur a sa portee.",
      "A giant predator from Traal that mauls and devours any traveler within reach.",
      "https://hitchhikers.fandom.com/wiki/Ravenous_Bugblatter_Beast_of_Traal",
      "Huge predatory beast using the exact adaptation/reference anatomy; no invented armor, weapons or extra eyes.",
    ),
  ]));
}
