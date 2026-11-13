// Splatterhouse — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Splatterhouse", [
    candidate(
      RIFT_DRONE,
      "Deadman",
      "Claws and teeth",
      "claw and bite",
      "Mort-vivant putrefie de Splatterhouse qui avance pour griffer et mordre.",
      "A rotting Splatterhouse undead that shambles forward to claw and bite.",
      "https://splatterhouse.fandom.com/wiki/Deadman",
      "Rotting humanoid enemy from Splatterhouse, exposed wounds, torn clothing and shambling posture.",
    ),
    candidate(
      BREACH_STALKER,
      "Boreworm",
      "Biting mouth",
      "swarm bite",
      "Petit parasite segmente qui rampe en groupe et s'accroche avec son extremite dentee.",
      "A small segmented parasite that crawls in groups and latches on with its biting end.",
      "https://splatterhouse.fandom.com/wiki/Boreworm",
      "Short segmented flesh-colored parasite with ringed body and biting end; low crawling silhouette.",
    ),
    candidate(
      ANOMALY_PACK,
      "Hellhound",
      "Jaws and claws",
      "running bite",
      "Chien demoniaque emacie qui sprinte au ras du sol pour refermer ses machoires.",
      "A gaunt demonic hound that sprints low to the ground before closing its jaws.",
      "https://splatterhouse.fandom.com/wiki/Hellhound",
      "Gaunt demonic dog with exposed ribs/bone details, dark hide and low sprinting posture.",
    ),
  ]));
}
