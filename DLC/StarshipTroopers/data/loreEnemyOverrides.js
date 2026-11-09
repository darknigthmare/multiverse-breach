// Starship Troopers — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Starship Troopers", [
    candidate(
      RIFT_DRONE,
      "Warrior Bug",
      "Twin scythe forelimbs",
      "dual scythe slash",
      "Caste guerriere arachnide qui charge l'infanterie et tranche avec ses deux membres en faux.",
      "An Arachnid warrior caste that charges infantry and slashes with twin scythe forelimbs.",
      "https://starshiptroopers.fandom.com/wiki/Warrior_Bug",
      "Black and orange arachnid chitin, four running legs and two large scythe forelimbs; low forward combat posture.",
    ),
    candidate(
      BREACH_STALKER,
      "Hopper Bug",
      "Grasping limbs and wings",
      "dive and impale",
      "Caste volante arachnide qui plonge sur les soldats pour les empaler.",
      "A flying Arachnid caste that dives onto soldiers to impale them.",
      "https://starshiptroopers.fandom.com/wiki/Hopper_Bug",
      "Winged arachnid caste with compact chitin body, long grasping limbs and translucent insect wings.",
    ),
    candidate(
      ANOMALY_PACK,
      "Plasma Bug",
      "Plasma abdomen",
      "plasma bombardment",
      "Caste d'artillerie arachnide qui projette du plasma depuis son abdomen lumineux.",
      "An Arachnid artillery caste that launches plasma from its luminous abdomen.",
      "https://starshiptroopers.fandom.com/wiki/Plasma_Bug",
      "Massive beetle-like arachnid with reinforced legs and a swollen luminous blue plasma abdomen.",
    ),
  ]));
}
