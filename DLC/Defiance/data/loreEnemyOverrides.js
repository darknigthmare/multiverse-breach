// Defiance — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Defiance", [
    candidate(
      RIFT_DRONE,
      "Volge Trooper",
      "Oversized energy firearm",
      "heavy energy shot",
      "Fantassin Volge massif dont l'armure lourde absorbe les tirs pendant qu'il riposte avec une arme energetique.",
      "A massive Volge infantryman whose heavy armor absorbs fire while he answers with an energy weapon.",
      "https://expanded.defiancewiki.com/wiki/Volge",
      "Very tall alien in layered grey Volge combat armor, sealed angular helmet and oversized energy firearm.",
    ),
    candidate(
      BREACH_STALKER,
      "99er Raider",
      "Industrial firearm and mining tool",
      "rifle burst or mining-tool strike",
      "Mineur 99er cybernetiquement modifie qui alterne tirs industriels et coups d'outil minier.",
      "A cybernetically altered 99er miner who alternates industrial gunfire with mining-tool strikes.",
      "https://defiance.fandom.com/wiki/Enemies%28Game%29",
      "Cybernetically altered miner, work armor, welding or mining headgear, exposed metal implants and industrial firearm/tool.",
    ),
    candidate(
      ANOMALY_PACK,
      "Hellbug Skitterling",
      "Mandibles",
      "swarm bite",
      "Petit Hellbug qui submerge sa proie en groupe avant de la dechiqueter avec ses mandibules.",
      "A small Hellbug that overwhelms prey in a swarm before tearing into it with its mandibles.",
      "https://defiance.fandom.com/wiki/Hellbugs",
      "Small low-slung insectoid Hellbug with multiple legs, segmented chitin and oversized biting mouth.",
    ),
  ]));
}
