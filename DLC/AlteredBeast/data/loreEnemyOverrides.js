// Altered Beast — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Altered Beast", [
    candidate(
      RIFT_DRONE,
      "Zombie",
      "Fists and teeth",
      "punch and grab",
      "Mort-vivant gris qui ouvre les rangs ennemis d'Altered Beast avec ses coups et ses prises.",
      "A grey undead humanoid that forms Altered Beast's opening enemy line with punches and grabs.",
      "https://alteredbeast.fandom.com/wiki/Zombie",
      "Grey undead humanoid from Altered Beast, bare torso, torn ancient loincloth/armor scraps and stiff raised-arm pose.",
    ),
    candidate(
      BREACH_STALKER,
      "Chicken Stinger",
      "Hooked beak and talons",
      "dive attack",
      "Creature volante d'Altered Beast qui fond sur sa cible avec son bec et ses serres.",
      "An Altered Beast flying creature that dives onto targets with its hooked beak and talons.",
      "https://alteredbeast.fandom.com/wiki/Chicken_Stinger",
      "Small winged reptile/bird monster matching the original arcade sprite palette and hooked attack silhouette.",
    ),
    candidate(
      ANOMALY_PACK,
      "Two-Headed Wolf",
      "Twin jaws",
      "double bite",
      "Loup bicephale rapide d'Altered Beast dont les deux tetes mordent pendant la charge.",
      "A fast two-headed Altered Beast wolf whose twin heads bite during its charge.",
      "https://alteredbeast.fandom.com/wiki/Two-Headed_Wolf",
      "Four-legged wolf monster with two distinct heads, dark arcade palette and low running posture.",
    ),
  ]));
}
