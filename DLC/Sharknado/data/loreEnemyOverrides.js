// Sharknado — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Sharknado", [
    candidate(
      RIFT_DRONE,
      "Flying Bull Shark",
      "Bite and falling body",
      "crosswind bite dive",
      "Requin-bouledogue projete par la tornade qui traverse l'arene avant de replonger dans l'entonnoir.",
      "A bull shark hurled by the tornado that crosses the arena before falling back into the funnel.",
      "https://en.wikipedia.org/wiki/Sharknado",
      "Anatomically recognizable bull shark suspended in rain and compact storm spray, entire body visible; no humanoid limbs, armor or hybrid features.",
    ),
    candidate(
      BREACH_STALKER,
      "Tornado Tiger Shark",
      "Bite and debris-assisted charge",
      "storm debris ambush",
      "Requin-tigre emporte avec les debris qui surgit d'un angle mort de la tornade.",
      "A tiger shark carried with the debris that bursts from a blind side of the tornado.",
      "https://en.wikipedia.org/wiki/Sharknado",
      "Anatomically recognizable tiger shark with visible dark flank stripes, wet skin and a small amount of airborne B-movie storm debris; no fantasy mutation.",
    ),
    candidate(
      ANOMALY_PACK,
      "Airborne Shark Swarm",
      "Coordinated falling bites",
      "shark rain wave",
      "Vague de requins de plusieurs especes ejectee de l'entonnoir selon la menace centrale des films.",
      "A wave of several shark species ejected from the funnel, matching the films' central threat.",
      "https://en.wikipedia.org/wiki/Sharknado",
      "Small readable group of natural sharks at staggered depths inside the same rain funnel, with no duplicated alpha boss and no humanoid anatomy.",
    ),
  ]));
}
