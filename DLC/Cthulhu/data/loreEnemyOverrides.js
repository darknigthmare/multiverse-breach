// Cthulhu — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Cthulhu", [
    candidate(
      RIFT_DRONE,
      "Deep One",
      "Webbed claws and teeth",
      "claw and bite",
      "Humanoide amphibie des profondeurs qui attaque au corps a corps avec ses griffes palmees.",
      "An amphibious deep-sea humanoid that fights at close range with webbed claws and teeth.",
      "https://lovecraft.fandom.com/wiki/Deep_One",
      "Fish/frog humanoid with wet scales, webbed clawed hands, wide mouth and hunched coastal gait.",
    ),
    candidate(
      ANOMALY_PACK,
      "Shoggoth",
      "Protoplasmic pseudopods",
      "pseudopod crush",
      "Masse protoplasmique changeante qui forme des yeux, des bouches et des pseudopodes pour broyer sa cible.",
      "A mutable protoplasmic mass that forms eyes, mouths and pseudopods to crush its target.",
      "https://lovecraft.fandom.com/wiki/Shoggoth",
      "Black iridescent protoplasmic mass forming temporary eyes and mouths; no fixed limbs or mechanical parts.",
    ),
  ]));
}
