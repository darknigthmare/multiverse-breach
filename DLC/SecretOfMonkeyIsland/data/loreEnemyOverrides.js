// Secret of Monkey Island — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Secret of Monkey Island", [
    candidate(
      RIFT_DRONE,
      "Ghost Pirate",
      "Cutlass",
      "cutlass slash",
      "Pirate spectral de l'equipage de LeChuck qui combat avec son sabre d'abordage.",
      "A spectral pirate from LeChuck's crew who fights with a cutlass.",
      "https://monkeyisland.fandom.com/wiki/Ghost_pirate",
      "Translucent green/blue pirate corpse with period coat, hat and cutlass; spectral glow follows the game palette.",
    ),
    candidate(
      BREACH_STALKER,
      "Skeleton Pirate",
      "Cutlass",
      "cutlass slash",
      "Squelette anime en tenue de pirate qui manie encore son sabre.",
      "An animated skeleton in pirate clothing that still wields its cutlass.",
      "https://monkeyisland.fandom.com/wiki/Skeleton",
      "Animated human skeleton wearing pirate hat/cloth scraps and holding a cutlass.",
    ),
    candidate(
      ANOMALY_PACK,
      "Piranha Poodle",
      "Sharp teeth",
      "pack bite",
      "Petit caniche aux dents de piranha qui attaque toujours avec sa meute.",
      "A small poodle with piranha teeth that attacks as part of a pack.",
      "https://monkeyisland.fandom.com/wiki/Piranha_Poodles",
      "Small white poodle with exaggerated sharp teeth and aggressive pack stance; no armor.",
    ),
  ]));
}
