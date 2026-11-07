// Gremlins — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Gremlins", [
    candidate(
      RIFT_DRONE,
      "Gremlin",
      "Claws and teeth",
      "claw and bite",
      "Gremlin reptilien rapide qui attaque en groupe avec ses griffes et ses dents.",
      "A fast reptilian Gremlin that attacks in groups with claws and teeth.",
      "https://gremlins.fandom.com/wiki/Gremlin",
      "Small reptilian humanoid, green-brown scales, long pointed ears, yellow eyes, clawed hands and hunched posture.",
    ),
    candidate(
      BREACH_STALKER,
      "Bat Gremlin",
      "Wing claws and teeth",
      "dive claw",
      "Mutation volante de Gremlin qui plonge depuis les airs pour lacerer sa cible.",
      "A flying Gremlin mutation that dives from above to rake its target.",
      "https://gremlins.fandom.com/wiki/Bat_Gremlin",
      "Gremlin/bat hybrid with broad membranous wings, reduced forearms, beady eyes and inward-curved ears.",
    ),
  ]));
}
