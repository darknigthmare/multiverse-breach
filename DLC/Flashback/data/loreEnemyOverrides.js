// Flashback — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Flashback", [
    candidate(
      RIFT_DRONE,
      "Morph Agent",
      "Compact futuristic pistol",
      "pistol shot",
      "Morph infiltre sous apparence humaine qui n'expose sa vraie forme qu'une fois touche.",
      "A Morph infiltrator in human guise whose true form is exposed only when struck.",
      "https://strategywiki.org/wiki/Flashback:_The_Quest_for_Identity/Enemies",
      "Humanoid Morph disguise from Flashback, dark coat/uniform and compact futuristic pistol; reveal alien form only on hit/death frames.",
    ),
    candidate(
      BREACH_STALKER,
      "Mutant",
      "Clawed hands",
      "claw strike",
      "Humanoide mute de Flashback qui avance courbe et frappe avec ses griffes.",
      "A mutated Flashback humanoid that advances in a hunched stance and strikes with its claws.",
      "https://strategywiki.org/wiki/Flashback:_The_Quest_for_Identity/Enemies",
      "Stocky mutated humanoid matching the original game sprite colors and hunched attack posture.",
    ),
    candidate(
      ANOMALY_PACK,
      "Cyborg Guard",
      "Service rifle",
      "rifle shot",
      "Garde cybernetique blinde qui patrouille avec son arme de service.",
      "An armored cybernetic guard that patrols with its service firearm.",
      "https://strategywiki.org/wiki/Flashback:_The_Quest_for_Identity/Enemies",
      "Armored cybernetic guard with hard sci-fi plating, visor and service firearm from the original game.",
    ),
  ]));
}
